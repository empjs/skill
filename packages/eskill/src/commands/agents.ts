import fs from 'node:fs'
import os from 'node:os'
import chalk from 'chalk'
import {AGENTS, getAgentSkillsDirs, SHARED_SKILLS_DIR} from '../config/agents.js'

/**
 * List all supported agents and their skills directories
 */
export function agents(): void {
  const cwd = process.cwd()

  console.log(chalk.bold('\n📋 Supported AI Agents:\n'))

  for (const agent of AGENTS) {
    const skillsDirs = getAgentSkillsDirs(agent, cwd)
    const dirsInfo = skillsDirs.length > 1 ? ` (${skillsDirs.length} directories)` : ''

    console.log(chalk.bold(agent.displayName))
    console.log(chalk.gray(`  Name: ${agent.name}`))

    if (skillsDirs.length === 0) {
      console.log(chalk.yellow('  ⚠️  No directories configured'))
    } else {
      console.log(chalk.gray(`  Directories${dirsInfo}:`))
      for (const dir of skillsDirs) {
        const exists = fs.existsSync(dir)
        const status = exists ? chalk.green('✓') : chalk.gray('○')
        const pathColor = exists ? chalk.white : chalk.gray
        console.log(`    ${status} ${pathColor(dir)}`)
      }
    }

    console.log('')
  }

  console.log(chalk.bold('📦 Shared Skills Directory:'))
  const sharedExists = fs.existsSync(SHARED_SKILLS_DIR)
  const sharedStatus = sharedExists ? chalk.green('✓') : chalk.gray('○')
  const sharedPathColor = sharedExists ? chalk.white : chalk.gray
  console.log(`  ${sharedStatus} ${sharedPathColor(SHARED_SKILLS_DIR)}`)
  console.log('')

  // Show current working directory if different from home
  const home = os.homedir()
  if (cwd !== home) {
    console.log(chalk.gray(`Current working directory: ${cwd}`))
    console.log(chalk.gray('(Project-level directories are shown above)\n'))
  }
}
