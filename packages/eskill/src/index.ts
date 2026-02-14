#!/usr/bin/env node
import {Command} from 'commander'
import {readFileSync} from 'fs'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'
import {agents} from './commands/agents.js'
import {install} from './commands/install.js'
import {list} from './commands/list.js'
import {remove} from './commands/remove.js'
import {auth} from './commands/auth.js'

// Read version from package.json
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJsonPath = join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
const version = packageJson.version

const program = new Command()

program.name('eskill').description('Unified CLI tool for managing AI agent skills').version(version)

// Install command (with add alias)
program
  .command('install <skill>')
  .alias('add')
  .description('Install a skill (Supports selective install, local/global scope, and link/copy methods)')
  .option('-a, --agent <name>', 'Install for specific agent (claude, cursor, etc.)')
  .option('--all', 'Install all skills if multiple are found in a collection')
  .option('--global', 'Install to global agent directories (default)')
  .option('--local', 'Install to current project directory (.agent/skills)')
  .option('--link', 'Use symlink for installation (changes reflect instantly)')
  .option('--copy', 'Use full copy for installation (portable)')
  .option('-f, --force', 'Force reinstall if already exists')
  .option('-r, --registry <url>', 'NPM registry URL')
  .option('-t, --timeout <ms>', 'Timeout in milliseconds (default: 180000 for npm, 120000 for git)', value =>
    Number.parseInt(value, 10),
  )
  .action(async (skill, options) => {
    try {
      await install(skill, options)
    } catch (error: any) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

// Auth command
program
  .command('auth [domain]')
  .description('Manage access tokens for private repositories')
  .option('-t, --token <token>', 'Access token')
  .option('-l, --list', 'List all saved tokens')
  .option('-r, --remove <domain>', 'Remove token for a domain')
  .action(async (domain, options) => {
    try {
      await auth(domain, options)
    } catch (error: any) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

// List command
program
  .command('list')
  .alias('ls')
  .description('List installed skills')
  .action(() => {
    try {
      list()
    } catch (error: any) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

// Remove command (with rm and uninstall aliases)
program
  .command('remove <skill>')
  .alias('rm')
  .alias('uninstall')
  .description('Remove an installed skill')
  .option('-a, --agent <name>', 'Remove symlink for specific agent only (keeps skill in shared directory)')
  .action(async (skill, options) => {
    try {
      await remove(skill, options)
    } catch (error: any) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

// Agents command
program
  .command('agents')
  .alias('list-agents')
  .description('List all supported AI agents and their skills directories')
  .action(() => {
    try {
      agents()
    } catch (error: any) {
      console.error('Error:', error.message)
      process.exit(1)
    }
  })

program.parse()
