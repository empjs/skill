import fs from 'node:fs'
import path from 'node:path'
import type {AgentConfig} from '../config/agents.js'
import {getAgentSkillsDirs} from '../config/agents.js'
import {logger} from './logger.js'
import {getAgentSkillPaths, getSharedSkillPath} from './paths.js'

/**
 * Create symlink from shared directory to agent directory(ies)
 */
export function createSymlink(skillName: string, agent: AgentConfig, cwd?: string): boolean {
  const source = getSharedSkillPath(skillName)

  if (!fs.existsSync(source)) {
    logger.error(`Skill not found: ${source}`)
    return false
  }

  const targets = getAgentSkillPaths(agent.name, skillName, cwd)
  let successCount = 0

  for (const target of targets) {
    // Ensure target directory exists
    const targetDir = path.dirname(target)
    if (!fs.existsSync(targetDir)) {
      try {
        fs.mkdirSync(targetDir, {recursive: true})
      } catch (error: any) {
        logger.error(`Failed to create directory ${targetDir}: ${error.message}`)
        continue
      }
    }

    // Remove existing symlink or directory
    if (fs.existsSync(target)) {
      try {
        const stats = fs.lstatSync(target)
        if (stats.isSymbolicLink()) {
          fs.unlinkSync(target)
        } else {
          logger.warn(`Target exists but is not a symlink, skipping: ${target}`)
          continue
        }
      } catch (error: any) {
        logger.error(`Failed to remove existing target: ${error.message}`)
        continue
      }
    }

    try {
      fs.symlinkSync(source, target, 'dir')
      successCount++
    } catch (error: any) {
      logger.error(`Failed to create symlink at ${target}: ${error.message}`)
    }
  }

  if (successCount > 0) {
    const dirsInfo = targets.length > 1 ? ` (${successCount}/${targets.length} dirs)` : ''
    logger.success(`✓ ${agent.displayName}${dirsInfo}`)
    return true
  }

  return false
}

/**
 * Remove symlink from agent directory(ies)
 */
export function removeSymlink(skillName: string, agent: AgentConfig, cwd?: string): boolean {
  const targets = getAgentSkillPaths(agent.name, skillName, cwd)
  let removedCount = 0

  for (const target of targets) {
    if (!fs.existsSync(target)) {
      continue
    }

    try {
      const stats = fs.lstatSync(target)
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(target)
        removedCount++
      } else {
        logger.warn(`Not a symlink: ${target}`)
      }
    } catch (error: any) {
      logger.error(`Failed to remove symlink at ${target}: ${error.message}`)
    }
  }

  if (removedCount > 0) {
    const dirsInfo = targets.length > 1 ? ` (${removedCount}/${targets.length} dirs)` : ''
    logger.success(`Unlinked from ${agent.displayName}${dirsInfo}`)
    return true
  }

  return false
}

/**
 * Check if path is a symlink
 */
export function isSymlink(filePath: string): boolean {
  try {
    const stats = fs.lstatSync(filePath)
    return stats.isSymbolicLink()
  } catch {
    return false
  }
}

/**
 * Read symlink target
 */
export function readSymlink(filePath: string): string | null {
  try {
    return fs.readlinkSync(filePath)
  } catch {
    return null
  }
}
