#!/usr/bin/env node
import {Command} from 'commander'
import {install} from './commands/install.js'
import {list} from './commands/list.js'
import {remove} from './commands/remove.js'
import {agents} from './commands/agents.js'

const program = new Command()

program
  .name('nova-skill')
  .description('Unified CLI tool for managing AI agent skills')
  .version('1.0.0')

// Install command
program
  .command('install <skill>')
  .description('Install a skill from NPM or local directory')
  .option('-a, --agent <name>', 'Install for specific agent (claude, cursor, windsurf, or all)')
  .option('-l, --link', 'Dev mode: symlink from local directory')
  .option('-f, --force', 'Force reinstall if already exists')
  .option('-r, --registry <url>', 'NPM registry URL (overrides .npmrc and global config)')
  .action(async (skill, options) => {
    try {
      await install(skill, options)
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

// Remove command
program
  .command('remove <skill>')
  .alias('rm')
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
