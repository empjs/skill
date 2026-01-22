import fs from 'node:fs'
import path from 'node:path'
import {logger} from '../utils/logger.js'
import {
  getSharedSkillPath,
  getAgentSkillPaths,
  extractSkillName,
  detectInstalledAgents,
} from '../utils/paths.js'
import {removeSymlink, isSymlink} from '../utils/symlink.js'
import {AGENTS, getAgentSkillsDirs} from '../config/agents.js'

export interface RemoveOptions {
  agent?: string // specific agent or 'all'
}

/**
 * Remove skill from shared directory and/or agent symlinks
 */
export async function remove(skillName: string, options: RemoveOptions = {}): Promise<void> {
  const extractedName = extractSkillName(skillName)
  const sharedPath = getSharedSkillPath(extractedName)

  // Check if skill exists in shared directory
  const skillExists = fs.existsSync(sharedPath)

  if (!skillExists) {
    logger.error(`Skill not found: ${extractedName}`)
    logger.info(`Location: ${sharedPath}`)
    process.exit(1)
  }

  // Detect installed agents
  const cwd = process.cwd()
  const installedAgents = detectInstalledAgents(cwd)

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

  // Remove symlinks from agent directories
  if (targetAgents.length > 0) {
    logger.info('Removing symlinks from agents...')
    let removedCount = 0
    for (const agent of targetAgents) {
      if (removeSymlink(extractedName, agent, cwd)) {
        removedCount++
      }
    }
    logger.info(`Removed ${removedCount}/${targetAgents.length} symlinks`)
  }

  // If --agent is specified, only remove symlinks, keep the skill in shared directory
  if (options.agent && options.agent !== 'all') {
    logger.success(`✅ Removed symlinks for ${options.agent} only`)
    logger.info(`Skill remains in shared directory: ${sharedPath}`)
    return
  }

  // Remove skill from shared directory
  logger.info('Removing skill from shared directory...')
  try {
    const stats = fs.lstatSync(sharedPath)
    if (stats.isSymbolicLink()) {
      fs.unlinkSync(sharedPath)
      logger.success('Removed symlink from shared directory')
    } else {
      fs.rmSync(sharedPath, {recursive: true, force: true})
      logger.success('Removed skill from shared directory')
    }
  } catch (error: any) {
    logger.error(`Failed to remove skill: ${error.message}`)
    process.exit(1)
  }

  // Check if there are any remaining symlinks in other agents
  const remainingSymlinks: string[] = []
  for (const agent of AGENTS) {
    const agentSkillPaths = getAgentSkillPaths(agent.name, extractedName, cwd)
    const hasSymlink = agentSkillPaths.some((path) => {
      return fs.existsSync(path) && isSymlink(path)
    })
    if (hasSymlink) {
      remainingSymlinks.push(agent.displayName)
    }
  }

  if (remainingSymlinks.length > 0) {
    logger.warn(`\n⚠️  Warning: Found remaining symlinks in:`)
    for (const agentName of remainingSymlinks) {
      logger.info(`  - ${agentName}`)
    }
    logger.info('\nYou may need to manually remove these symlinks')
  } else {
    logger.success(`✅ Skill "${extractedName}" removed successfully!`)
  }
}
