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
    logger.info(`\nTo install a skill, run: ${chalk.cyan('nova-skill install @nova/rn-skill')}`)
    return
  }

  const skills = fs.readdirSync(SHARED_SKILLS_DIR)

  if (skills.length === 0) {
    logger.info('No skills installed')
    logger.info(`\nTo install a skill, run: ${chalk.cyan('nova-skill install @nova/rn-skill')}`)
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

      // Read version from package.json
      let version = 'unknown'
      const pkgPath = path.join(skillPath, 'package.json')
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
          version = pkg.version || 'unknown'
        } catch {
          // Ignore parse errors
        }
      }

      // Check if dev mode (symlink in shared dir)
      const isDev = isSymlink(skillPath)
      const devTag = isDev ? chalk.yellow(' (dev)') : ''

      console.log(chalk.green('📦') + ` ${chalk.bold(skill)} ${chalk.gray(`(v${version})`)}${devTag}`)

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
