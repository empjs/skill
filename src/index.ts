#!/usr/bin/env node
import {Command} from 'commander'
import {install} from './commands/install.js'
import {list} from './commands/list.js'

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

program.parse()
