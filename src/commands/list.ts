import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import {logger} from '../utils/logger.js'
import {SHARED_SKILLS_DIR, AGENTS, getAgentSkillsDirs} from '../config/agents.js'
import {isSymlink, readSymlink} from '../utils/symlink.js'

/**
 * List installed skills
 */
export function list(): void {
  if (!fs.existsSync(SHARED_SKILLS_DIR)) {
    logger.info('No skills installed')
    logger.info(`\nTo install a skill, run: ${chalk.cyan('eskill install <skill-name>')}`)
    return
  }

  const skills = fs.readdirSync(SHARED_SKILLS_DIR)

  if (skills.length === 0) {
    logger.info('No skills installed')
    logger.info(`\nTo install a skill, run: ${chalk.cyan('eskill install <skill-name>')}`)
    return
  }

  console.log(chalk.bold(`\nInstalled skills in ${SHARED_SKILLS_DIR}:\n`))

  for (const skill of skills) {
    const skillPath = path.join(SHARED_SKILLS_DIR, skill)

    try {
      const stats = fs.lstatSync(skillPath)

      if (!stats.isDirectory() && !stats.isSymbolicLink()) {
        continue
      }

      // Read version from package.json or SKILL.md
      let version = 'unknown'
      
      // Try package.json first
      const pkgPath = path.join(skillPath, 'package.json')
      if (fs.existsSync(pkgPath)) {
        try {
          const pkgContent = fs.readFileSync(pkgPath, 'utf-8')
          const pkg = JSON.parse(pkgContent)
          if (pkg.version && typeof pkg.version === 'string') {
            version = pkg.version
          }
        } catch (error) {
          // JSON parse error, try SKILL.md
        }
      }
      
      // If no version found, try reading from SKILL.md frontmatter
      if (version === 'unknown') {
        const skillMdPath = path.join(skillPath, 'SKILL.md')
        if (fs.existsSync(skillMdPath)) {
          try {
            const skillMdContent = fs.readFileSync(skillMdPath, 'utf-8')
            // Look for version in YAML frontmatter
            const frontmatterMatch = skillMdContent.match(/^---\s*\n([\s\S]*?)\n---/)
            if (frontmatterMatch) {
              const frontmatter = frontmatterMatch[1]
              const versionMatch = frontmatter.match(/^version:\s*(.+)$/m)
              if (versionMatch) {
                version = versionMatch[1].trim().replace(/^["']|["']$/g, '')
              }
            }
          } catch (error) {
            // Ignore errors
          }
        }
      }
      
      // If still unknown and it's a symlink, try reading from the target
      if (version === 'unknown' && isSymlink(skillPath)) {
        try {
          const targetPath = readSymlink(skillPath)
          if (targetPath) {
            const targetPkgPath = path.join(targetPath, 'package.json')
            if (fs.existsSync(targetPkgPath)) {
              const pkg = JSON.parse(fs.readFileSync(targetPkgPath, 'utf-8'))
              if (pkg.version && typeof pkg.version === 'string') {
                version = pkg.version
              }
            }
          }
        } catch (error) {
          // Ignore errors
        }
      }

      // Check if dev mode (symlink in shared dir)
      const isDev = isSymlink(skillPath)
      const devTag = isDev ? chalk.yellow(' (dev)') : ''
      
      // Format version display
      const versionDisplay = version !== 'unknown' ? chalk.gray(`(v${version})`) : ''

      console.log(chalk.green('📦') + ` ${chalk.bold(skill)}${versionDisplay ? ' ' + versionDisplay : ''}${devTag}`)

      // Check which agents are linked
      const cwd = process.cwd()
      const linkedAgents: string[] = []
      for (const agent of AGENTS) {
        const skillsDirs = getAgentSkillsDirs(agent, cwd)
        const hasSymlink = skillsDirs.some((dir) => {
          const agentSkillPath = path.join(dir, skill)
          if (fs.existsSync(agentSkillPath) && isSymlink(agentSkillPath)) {
            const target = readSymlink(agentSkillPath)
            return target === skillPath
          }
          return false
        })
        if (hasSymlink) {
          linkedAgents.push(agent.displayName)
        }
      }

      if (linkedAgents.length > 0) {
        console.log(chalk.gray(`   → Linked to: ${linkedAgents.join(', ')}`))
      } else {
        console.log(chalk.yellow(`   → Not linked to any agent`))
      }

      if (isDev) {
        const target = readSymlink(skillPath)
        if (target) {
          console.log(chalk.gray(`   → Source: ${target}`))
        }
      }

      console.log('')
    } catch (error) {
      // Skip entries that can't be read
      continue
    }
  }
}
