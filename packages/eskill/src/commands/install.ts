import {exec} from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'
// @ts-ignore
import enquirer from 'enquirer'
const {MultiSelect} = enquirer
import {isGitUrl, parseGitUrl, convertToSshUrl} from '../utils/git.js'
import {logger} from '../utils/logger.js'
import {AGENTS} from '../config/agents.js'
import {detectInstalledAgents, ensureSharedDir, extractSkillName, getSharedSkillPath} from '../utils/paths.js'
import {getRegistry} from '../utils/registry.js'
import {createSymlink} from '../utils/symlink.js'
import {scanForSkills, type SkillItem} from '../utils/collection.js'

const execAsync = promisify(exec)

const execAsync = promisify(exec)

/**
 * Execute command with timeout and custom environment
 */
async function execWithTimeout(
  command: string,
  timeout = 120000, // 2 minutes default
  env?: NodeJS.ProcessEnv,
): Promise<{stdout: string; stderr: string}> {
  let timeoutId: NodeJS.Timeout | null = null

  const timeoutPromise = new Promise<{stdout: string; stderr: string}>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Command timeout after ${timeout / 1000}s`))
    }, timeout)
  })

  try {
    const execOptions = env ? {env} : {}
    const result = await Promise.race([execAsync(command, execOptions), timeoutPromise])

    // Clear timeout if command completed successfully
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    return result
  } catch (error: any) {
    // Clear timeout on error
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    throw error
  }
}

export interface InstallOptions {
  agent?: string // specific agent or 'all'
  link?: boolean // dev mode (symlink from local directory)
  force?: boolean // force reinstall
  registry?: string // npm registry URL
  timeout?: number // timeout in milliseconds (default: 180000 for npm, 120000 for git)
}

/**
 * Install skill to shared directory and create symlinks
 */
/**
 * Shorten path by replacing home dir with ~
 */
function shortenPath(p: string): string {
  const home = os.homedir()
  return p.startsWith(home) ? p.replace(home, '~') : p
}

export async function install(skillNameOrPath: string, options: InstallOptions = {}): Promise<void> {
  const isGit = isGitUrl(skillNameOrPath)
  if (isGit) {
    logger.info('Installing from Git URL')
    logger.dim(skillNameOrPath)
  } else {
    logger.info(`Installing skill: ${skillNameOrPath}`)
  }

  // Ensure shared directory exists
  ensureSharedDir()

  let skillPath: string
  let skillName: string

  // Check Git URL first (before checking local path)
  if (process.env.DEBUG_ESKILL) {
    logger.dim(`[DEBUG] isGitUrl=${isGit}, parseGitUrl=${parseGitUrl(skillNameOrPath) ? 'ok' : 'null'}`)
  }
  if (isGit) {
    // Git URL install mode
    const gitInfo = parseGitUrl(skillNameOrPath)
    if (!gitInfo) {
      logger.error(`Invalid git URL: ${skillNameOrPath}`)
      logger.info('Please ensure the URL is a valid GitHub or GitLab repository URL')
      process.exit(1)
    }

    const tempDir = path.join('/tmp', `eskill-${Date.now()}`)
    const cloneDir = path.join(tempDir, 'repo')

    try {
      const timeout = options.timeout || 120000 // Default 2 minutes for Git
      logger.dim(`Source: ${gitInfo.gitUrl}`)
      const spinner = logger.start(`Cloning repository...`)
      fs.mkdirSync(tempDir, {recursive: true})

      // Clone the repository
      const branchFlag = gitInfo.branch ? `-b ${gitInfo.branch}` : ''
      const cloneCommand = branchFlag
        ? `git clone ${branchFlag} ${gitInfo.gitUrl} ${cloneDir} --depth 1 --quiet`
        : `git clone ${gitInfo.gitUrl} ${cloneDir} --depth 1 --quiet`

      try {
        await execWithTimeout(cloneCommand, timeout)
        spinner.succeed(`Cloned successfully`)
      } catch (error: any) {
        // Try SSH fallback if HTTPS failed
        const sshUrl = convertToSshUrl(gitInfo.gitUrl)
        if (sshUrl && gitInfo.gitUrl.startsWith('http')) {
          spinner.text = 'HTTPS clone failed, trying SSH...'
          const sshCloneCommand = cloneCommand.replace(gitInfo.gitUrl, sshUrl)
          
          try {
            await execWithTimeout(sshCloneCommand, timeout)
            spinner.succeed(`Cloned successfully (via SSH)`)
          } catch (sshError: any) {
            spinner.fail('Clone failed')
            throw error
          }
        } else {
          spinner.fail('Clone failed')
          throw error
        }
      }

      // Scan for skills
      const scanDir = gitInfo.path ? path.join(cloneDir, gitInfo.path) : cloneDir
      if (!fs.existsSync(scanDir)) {
        logger.error(`Path not found in repository: ${gitInfo.path}`)
        process.exit(1)
      }

      const availableSkills = scanForSkills(scanDir)
      if (availableSkills.length === 0) {
        logger.error('No skills found in the repository (missing SKILL.md)')
        process.exit(1)
      }

      let selectedSkills: SkillItem[] = []

      if (availableSkills.length > 1) {
        logger.info(`\n📦 Found ${availableSkills.length} skills in this collection:`)
        
        const prompt = new MultiSelect({
          name: 'value',
          message: 'Select skills to install (Space to select, Enter to confirm)',
          choices: availableSkills.map(s => ({
            name: s.name,
            value: s,
            hint: s.description ? `- ${s.description}` : ''
          })),
          result(names: string[]) {
            return names.map(name => availableSkills.find(s => s.name === name))
          }
        })

        selectedSkills = await prompt.run()
        if (selectedSkills.length === 0) {
          logger.warn('No skills selected. Exiting.')
          process.exit(0)
        }
      } else {
        selectedSkills = [availableSkills[0]]
      }

      // Detect agents once
      const cwd = process.cwd()
      const installedAgents = detectInstalledAgents(cwd)
      
      if (installedAgents.length === 0) {
        logger.warn('\nNo AI agents detected. Skills will be installed to shared directory only.')
      }

      // Install each selected skill
      for (const skill of selectedSkills) {
        if (!skill) continue
        logger.info(`\n🚀 Installing ${chalk.cyan(skill.name)}...`)
        await installFromLocalPath(skill.path, skill.name, options, installedAgents, cwd)
      }

      logger.info('')
      logger.success(`✅ ${selectedSkills.length} skill(s) installed successfully!`)
      return
    } catch (error: any) {
      logger.error(`Failed to install from Git: ${error.message}`)
      process.exit(1)
    }
  } else if (options.link || fs.existsSync(skillNameOrPath)) {
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

    const cwd = process.cwd()
    const installedAgents = detectInstalledAgents(cwd)
    await installFromLocalPath(skillPath, skillName, options, installedAgents, cwd)
    
    logger.info('')
    logger.success(`✅ Skill installed successfully!`)
    if (options.link) {
      logger.info('\n💡 Dev mode: changes to source files will reflect immediately')
    }
  } else {
    // NPM install mode
    skillName = extractSkillName(skillNameOrPath)
    const tempDir = path.join('/tmp', `eskill-${Date.now()}`)

    try {
      // Determine registry (priority: CLI option > project .npmrc > global npm config > default)
      const registry = options.registry || (await getRegistry())
      const timeout = options.timeout || 180000 // Default 3 minutes for NPM

      const spinner = logger.start(`Installing ${skillNameOrPath}...`)
      logger.infoWithoutStop(`Registry: ${registry}`)
      logger.infoWithoutStop(`Timeout: ${timeout / 1000}s`)
      fs.mkdirSync(tempDir, {recursive: true})

      // Update spinner with more details
      logger.updateSpinner(`Downloading ${skillNameOrPath} from ${registry}...`)

      // Set npm environment variables to avoid permission issues
      // Use user's home directory for npm cache and config
      const homeDir = process.env.HOME || process.env.USERPROFILE || os.homedir()
      const npmCacheDir = path.join(homeDir, '.npm')
      const npmConfigPrefix = path.join(homeDir, '.npm-global')

      // Ensure npm cache directory exists
      fs.mkdirSync(npmCacheDir, {recursive: true})

      // Build install command with options to avoid global directory access
      const installCommand = `npm install ${skillNameOrPath} --prefix ${tempDir} --registry=${registry} --no-save --silent --no-bin-links --prefer-offline`

      // Set environment variables to force npm to use user directories
      const env = {
        ...process.env,
        npm_config_cache: npmCacheDir,
        npm_config_prefix: npmConfigPrefix,
        npm_config_global: 'false',
      }

      try {
        await execWithTimeout(installCommand, timeout, env)
        spinner.succeed(`Package ${skillNameOrPath} downloaded successfully`)
      } catch (error: any) {
        spinner.fail('Download failed')
        const errorMessage = error.message || error.stderr || ''

        if (errorMessage.includes('timeout')) {
          logger.error(`Download timeout after ${timeout / 1000} seconds`)
          logger.info('')
          logger.info('Possible reasons:')
          logger.info('  - Slow network connection')
          logger.info('  - Registry server issues or unresponsive')
          logger.info('  - Large package size')
          logger.info('  - Network firewall blocking the connection')
          logger.info('')
          logger.info('Suggestions:')
          logger.info(`  - Try again: eskill add ${skillNameOrPath}`)
          logger.info(
            `  - Use a different registry: eskill add ${skillNameOrPath} --registry=https://registry.npmjs.org/`,
          )
          logger.info(`  - Increase timeout: eskill add ${skillNameOrPath} --timeout=300000`)
        } else if (
          errorMessage.includes('EACCES') ||
          errorMessage.includes('permission denied') ||
          errorMessage.includes('Permission denied')
        ) {
          logger.error('Permission denied error detected')
          logger.info('')
          logger.info('This error occurs when npm tries to access system directories.')
          logger.info('')
          logger.info('🔧 Quick Fix (Recommended):')
          logger.info('')
          logger.info('1. Configure npm to use user directory:')
          logger.info(`   mkdir -p ${npmConfigPrefix}`)
          logger.info(`   npm config set prefix '${npmConfigPrefix}'`)
          logger.info('')
          logger.info('2. Add to your ~/.zshrc (or ~/.bash_profile):')
          logger.info(`   export PATH="${npmConfigPrefix}/bin:$PATH"`)
          logger.info('')
          logger.info('3. Reload shell configuration:')
          logger.info('   source ~/.zshrc')
          logger.info('')
          logger.info('📚 Alternative Solutions:')
          logger.info('')
          logger.info('Option A: Use NVM (Node Version Manager)')
          logger.info('   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash')
          logger.info('   nvm install --lts')
          logger.info('')
          logger.info('Option B: Fix system directory permissions (requires sudo)')
          logger.info('   sudo chown -R $(whoami) /usr/local/lib/node_modules')
          logger.info('')
          logger.info('Option C: Use sudo (not recommended for security reasons)')
          logger.info(`   sudo npm install -g @empjs/skill --registry=${registry}`)
          logger.info('')
          logger.info('After fixing, try again:')
          logger.info(`   eskill add ${skillNameOrPath}`)
        } else if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('ECONNREFUSED')) {
          logger.error(`Network connection error: ${errorMessage}`)
          logger.info('')
          logger.info('Please check:')
          logger.info('  - Your internet connection')
          logger.info(`  - Registry accessibility: ${registry}`)
          logger.info(
            `  - Try a different registry: eskill add ${skillNameOrPath} --registry=https://registry.npmjs.org/`,
          )
        } else {
          logger.error(`Failed to download: ${errorMessage}`)
          logger.info('')
          logger.info('If this is a permission error, see the solutions above.')
          logger.info('For other errors, please check:')
          logger.info('  - Package name is correct')
          logger.info('  - Registry is accessible')
          logger.info(`  - Try: eskill add ${skillNameOrPath} --registry=https://registry.npmjs.org/`)
        }
        process.exit(1)
      }

      skillPath = path.join(tempDir, 'node_modules', skillNameOrPath)

      if (!fs.existsSync(skillPath)) {
        logger.error(`Failed to download package: ${skillNameOrPath}`)
        process.exit(1)
      }

      const cwd = process.cwd()
      const installedAgents = detectInstalledAgents(cwd)
      await installFromLocalPath(skillPath, skillName, options, installedAgents, cwd)
      
      logger.info('')
      logger.success(`✅ Skill installed successfully!`)
    } catch (error: any) {
      logger.error(`Failed to download: ${error.message}`)
      process.exit(1)
    }
  }
}

/**
 * Install a skill from a local path to shared directory and link to agents
 */
async function installFromLocalPath(
  skillPath: string,
  skillName: string,
  options: InstallOptions,
  installedAgents: any[],
  cwd: string,
): Promise<void> {
  // Target path in shared directory
  const targetPath = getSharedSkillPath(skillName)
  const sourceIsTarget = path.resolve(skillPath) === path.resolve(targetPath)

  // Check if already exists (skip if source is the shared dir)
  const alreadyExists = fs.existsSync(targetPath) && !sourceIsTarget
  if (alreadyExists) {
    if (options.force) {
      logger.warn(`Removing existing installation for ${skillName}...`)
      fs.rmSync(targetPath, {recursive: true, force: true})
    } else {
      logger.info(`Skill ${skillName} already exists, updating agent links...`)
    }
  }

  // Copy or link to shared directory
  if (sourceIsTarget) {
    logger.info(`Skill ${skillName} already in shared directory, updating agent links...`)
  } else if (alreadyExists && !options.force) {
    // Skip copy, just update agent links
  } else if (options.link) {
    // Dev mode: create symlink
    fs.symlinkSync(skillPath, targetPath, 'dir')
    logger.success(`Linked ${skillName} to shared directory (dev mode)`)
  } else {
    // Production mode: copy files
    copyDir(skillPath, targetPath)
    logger.success(`Installed ${skillName} to shared directory`)
  }

  // Determine target agents
  let targetAgents = installedAgents

  if (options.agent && options.agent !== 'all') {
    const agent = AGENTS.find(a => a.name === options.agent && a.enabled)
    if (agent) {
      targetAgents = [agent]
    }
  }

  if (targetAgents.length > 0) {
    logger.info(`Creating symlinks for ${skillName}...`)
    let successCount = 0
    for (const agent of targetAgents) {
      if (createSymlink(skillName, agent, cwd)) {
        successCount++
      }
    }
    logger.dim(`Linked ${skillName} to ${successCount} agent(s)`)
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
