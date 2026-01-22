import {exec} from 'node:child_process'
import {promisify} from 'node:util'
import fs from 'node:fs'
import path from 'node:path'
import {logger} from '../utils/logger.js'
import {
  ensureSharedDir,
  detectInstalledAgents,
  extractSkillName,
  getSharedSkillPath,
} from '../utils/paths.js'
import {createSymlink} from '../utils/symlink.js'
import {getRegistry} from '../utils/registry.js'
import {parseGitUrl, isGitUrl} from '../utils/git.js'

const execAsync = promisify(exec)

export interface InstallOptions {
  agent?: string // specific agent or 'all'
  link?: boolean // dev mode (symlink from local directory)
  force?: boolean // force reinstall
  registry?: string // npm registry URL
}

/**
 * Install skill to shared directory and create symlinks
 */
export async function install(
  skillNameOrPath: string,
  options: InstallOptions = {},
): Promise<void> {
  logger.info(`Installing skill: ${skillNameOrPath}`)

  // Ensure shared directory exists
  ensureSharedDir()

  let skillPath: string
  let skillName: string

  if (options.link || fs.existsSync(skillNameOrPath)) {
    // Dev mode: link from local directory
    skillPath = path.resolve(skillNameOrPath)

    if (!fs.existsSync(skillPath)) {
      logger.error(`Path not found: ${skillPath}`)
      process.exit(1)
    }

    // Get skill name from package.json or directory name
    const pkgPath = path.join(skillPath, 'package.json')
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
        skillName = extractSkillName(pkg.name)
      } catch {
        skillName = extractSkillName(path.basename(skillPath))
      }
    } else {
      skillName = extractSkillName(path.basename(skillPath))
    }
  } else if (isGitUrl(skillNameOrPath)) {
    // Git URL install mode
    const gitInfo = parseGitUrl(skillNameOrPath)
    if (!gitInfo) {
      logger.error(`Invalid git URL: ${skillNameOrPath}`)
      process.exit(1)
    }

    skillName = gitInfo.path
      ? extractSkillName(path.basename(gitInfo.path))
      : extractSkillName(gitInfo.repo)
    const tempDir = path.join('/tmp', `nova-skill-${Date.now()}`)
    const cloneDir = path.join(tempDir, 'repo')

    try {
      logger.start('Cloning from Git...')
      logger.info(`Repository: ${gitInfo.gitUrl}`)
      if (gitInfo.branch) {
        logger.info(`Branch: ${gitInfo.branch}`)
      }
      if (gitInfo.path) {
        logger.info(`Path: ${gitInfo.path}`)
      }
      fs.mkdirSync(tempDir, {recursive: true})

      // Clone the repository
      const branchFlag = gitInfo.branch ? `-b ${gitInfo.branch}` : ''
      const cloneCommand = branchFlag
        ? `git clone ${branchFlag} ${gitInfo.gitUrl} ${cloneDir} --depth 1 --quiet`
        : `git clone ${gitInfo.gitUrl} ${cloneDir} --depth 1 --quiet`
      
      await execAsync(cloneCommand)

      logger.stopSpinner()

      // Determine the skill path
      if (gitInfo.path) {
        // If path is specified, use that subdirectory
        skillPath = path.join(cloneDir, gitInfo.path)
        if (!fs.existsSync(skillPath)) {
          logger.error(`Path not found in repository: ${gitInfo.path}`)
          logger.info(`Repository cloned to: ${cloneDir}`)
          process.exit(1)
        }
      } else {
        // Use the root of the repository
        skillPath = cloneDir
      }

      // Verify SKILL.md exists (optional check)
      const skillMdPath = path.join(skillPath, 'SKILL.md')
      if (!fs.existsSync(skillMdPath)) {
        logger.warn(`Warning: SKILL.md not found in ${skillPath}`)
        logger.info('The directory may not be a valid skill package')
      }
    } catch (error: any) {
      logger.stopSpinner()
      logger.error(`Failed to clone repository: ${error.message}`)
      logger.info(`\nTried to clone: ${gitInfo.gitUrl}`)
      if (gitInfo.branch) {
        logger.info(`Branch: ${gitInfo.branch}`)
      }
      process.exit(1)
    }
  } else {
    // NPM install mode
    skillName = extractSkillName(skillNameOrPath)
    const tempDir = path.join('/tmp', `nova-skill-${Date.now()}`)

    try {
      // Determine registry (priority: CLI option > project .npmrc > global npm config > default)
      const registry = options.registry || (await getRegistry())

      logger.start('Downloading from NPM...')
      logger.info(`Registry: ${registry}`)
      fs.mkdirSync(tempDir, {recursive: true})

      await execAsync(
        `npm install ${skillNameOrPath} --prefix ${tempDir} --registry=${registry} --no-save --silent`,
      )

      logger.stopSpinner()
      skillPath = path.join(tempDir, 'node_modules', skillNameOrPath)

      if (!fs.existsSync(skillPath)) {
        logger.error(`Failed to download package: ${skillNameOrPath}`)
        process.exit(1)
      }
    } catch (error: any) {
      logger.stopSpinner()
      logger.error(`Failed to download: ${error.message}`)
      process.exit(1)
    }
  }

  // Target path in shared directory
  const targetPath = getSharedSkillPath(skillName)

  // Check if already exists
  if (fs.existsSync(targetPath)) {
    if (options.force) {
      logger.warn('Removing existing installation...')
      fs.rmSync(targetPath, {recursive: true, force: true})
    } else {
      logger.error(`Skill already exists: ${targetPath}`)
      logger.info('Use --force to overwrite')
      process.exit(1)
    }
  }

  // Copy or link to shared directory
  if (options.link) {
    // Dev mode: create symlink
    fs.symlinkSync(skillPath, targetPath, 'dir')
    logger.success(`Linked to shared directory (dev mode)`)
  } else {
    // Production mode: copy files
    copyDir(skillPath, targetPath)
    logger.success(`Installed to shared directory`)
  }

  logger.info(`📍 Location: ${targetPath}`)

  // Detect installed AI agents
  const cwd = process.cwd()
  const installedAgents = detectInstalledAgents(cwd)

  if (installedAgents.length === 0) {
    logger.warn('No AI agents detected')
    logger.info('Skill installed to shared directory, but not linked to any agent')
    logger.info('')
    logger.info('Supported agents:')
    logger.info('  - Claude Code (~/.claude/skills)')
    logger.info('  - Cursor (~/.cursor/skills)')
    logger.info('  - Windsurf (~/.windsurf/skills)')
    return
  }

  // Determine target agents
  let targetAgents = installedAgents

  if (options.agent && options.agent !== 'all') {
    const agent = installedAgents.find((a) => a.name === options.agent)
    if (!agent) {
      logger.error(`Agent not installed: ${options.agent}`)
      logger.info(`\nInstalled agents: ${installedAgents.map((a) => a.name).join(', ')}`)
      process.exit(1)
    }
    targetAgents = [agent]
  }

  // Create symlinks
  logger.info('\nCreating symlinks...')
  let successCount = 0
  for (const agent of targetAgents) {
    if (createSymlink(skillName, agent, cwd)) {
      successCount++
    }
  }

  logger.info('')
  logger.success(`✅ Skill installed successfully!`)
  logger.info(`\nLinked to ${successCount}/${targetAgents.length} agents`)

  if (options.link) {
    logger.info('\n💡 Dev mode: changes to source files will reflect immediately')
  }
}

/**
 * Recursively copy directory
 */
function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, {recursive: true})

  const entries = fs.readdirSync(src, {withFileTypes: true})

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    // Skip node_modules and hidden files
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}
