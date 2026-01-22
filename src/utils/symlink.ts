import fs from 'node:fs'
import path from 'node:path'
import {getSharedSkillPath, getAgentSkillPath} from './paths.js'
import {logger} from './logger.js'
import type {AgentConfig} from '../config/agents.js'

/**
 * Create symlink from shared directory to agent directory
 */
export function createSymlink(skillName: string, agent: AgentConfig): boolean {
  const source = getSharedSkillPath(skillName)
  const target = getAgentSkillPath(agent.name, skillName)

  if (!fs.existsSync(source)) {
    logger.error(`Skill not found: ${source}`)
    return false
  }

  // Ensure target directory exists
  const targetDir = path.dirname(target)
  if (!fs.existsSync(targetDir)) {
    try {
      fs.mkdirSync(targetDir, {recursive: true})
    } catch (error: any) {
      logger.error(`Failed to create directory ${targetDir}: ${error.message}`)
      return false
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
        return false
      }
    } catch (error: any) {
      logger.error(`Failed to remove existing target: ${error.message}`)
      return false
    }
  }

  try {
    fs.symlinkSync(source, target, 'dir')
    logger.success(`✓ ${agent.displayName}`)
    return true
  } catch (error: any) {
    logger.error(`Failed to create symlink for ${agent.displayName}: ${error.message}`)
    return false
  }
}

/**
 * Remove symlink from agent directory
 */
export function removeSymlink(skillName: string, agent: AgentConfig): boolean {
  const target = getAgentSkillPath(agent.name, skillName)

  if (!fs.existsSync(target)) {
    return false
  }

  try {
    const stats = fs.lstatSync(target)
    if (stats.isSymbolicLink()) {
      fs.unlinkSync(target)
      logger.success(`Unlinked from ${agent.displayName}`)
      return true
    } else {
      logger.warn(`Not a symlink: ${target}`)
      return false
    }
  } catch (error: any) {
    logger.error(`Failed to remove symlink: ${error.message}`)
    return false
  }
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
