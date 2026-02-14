import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import chalk from 'chalk'
import {AGENTS, getAgentSkillsDirs, SHARED_SKILLS_DIR} from '../config/agents.js'
import {logger} from '../utils/logger.js'
import {isSymlink, readSymlink} from '../utils/symlink.js'

/**
 * Shorten path by replacing home dir with ~
 */
function shortenPath(p: string): string {
  const home = os.homedir()
  return p.startsWith(home) ? p.replace(home, '~') : p
}

/**
 * List installed skills
 */
export function list(): void {
  if (!fs.existsSync(SHARED_SKILLS_DIR)) {
    logger.info('No skills installed')
    logger.info(`\nTo install a skill, run: ${chalk.cyan('eskill install <skill-name>')}`)
    return
  }

  const skills = fs.readdirSync(SHARED_SKILLS_DIR).filter(s => !s.startsWith('.'))

  if (skills.length === 0) {
    logger.info('No skills installed')
    logger.info(`\nTo install a skill, run: ${chalk.cyan('eskill install <skill-name>')}`)
    return
  }

  console.log(chalk.bold(`\n📦 Installed Skills in ${chalk.blue(shortenPath(SHARED_SKILLS_DIR))}:\n`))

  for (const skill of skills) {
    const skillPath = path.join(SHARED_SKILLS_DIR, skill)

    try {
      const stats = fs.lstatSync(skillPath)

      if (!stats.isDirectory() && !stats.isSymbolicLink()) {
        continue
      }

      // Read version from package.json or SKILL.md
      let version = 'unknown'
      let description = ''

      // Try package.json first
      const pkgPath = path.join(skillPath, 'package.json')
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
          if (pkg.version) version = pkg.version
          if (pkg.description) description = pkg.description
        } catch (error) {}
      }

      // Read description from SKILL.md frontmatter
      if (!description) {
        const skillMdPath = path.join(skillPath, 'SKILL.md')
        if (fs.existsSync(skillMdPath)) {
          const content = fs.readFileSync(skillMdPath, 'utf-8')
          const descMatch = content.match(/description:\s*["']?([^"'\n]+)["']?/)
          if (descMatch) description = descMatch[1]
          
          if (version === 'unknown') {
            const verMatch = content.match(/version:\s*(.+)$/m)
            if (verMatch) version = verMatch[1].trim().replace(/^["']|["']$/g, '')
          }
        }
      }

      // Source & Type
      const isDev = isSymlink(skillPath)
      const typeLabel = isDev 
        ? chalk.bgYellow.black(' DEV LINK ') 
        : chalk.bgBlue.white(' INSTALLED ')

      // Format version display
      const versionDisplay = version !== 'unknown' ? chalk.gray(`v${version}`) : ''
      const descDisplay = description ? chalk.dim(` - ${description}`) : ''

      console.log(`${chalk.green('●')} ${chalk.bold(skill)} ${versionDisplay} ${typeLabel}${descDisplay}`)

      // Check linked agents
      const cwd = process.cwd()
      const linkedAgents: string[] = []
      for (const agent of AGENTS) {
        const skillsDirs = getAgentSkillsDirs(agent, cwd)
        const hasRef = skillsDirs.some(dir => {
          const agentSkillPath = path.join(dir, skill)
          if (!fs.existsSync(agentSkillPath)) return false
          if (isSymlink(agentSkillPath)) {
            const target = readSymlink(agentSkillPath)
            return target === skillPath
          }
          if (agent.useCopyInsteadOfSymlink) {
            return fs.statSync(agentSkillPath).isDirectory()
          }
          return false
        })
        if (hasRef) linkedAgents.push(agent.displayName)
      }

      if (linkedAgents.length > 0) {
        console.log(chalk.gray(`  🔗 Linked to: ${chalk.white(linkedAgents.join(', '))}`))
      } else {
        console.log(chalk.red(`  ⚠️ Not linked to any agent`))
      }

      if (isDev) {
        const target = readSymlink(skillPath)
        if (target) {
          console.log(chalk.gray(`  📁 Source: ${chalk.dim(shortenPath(target))}`))
        }
      }

      console.log('')
    } catch (error) {}
  }
}
