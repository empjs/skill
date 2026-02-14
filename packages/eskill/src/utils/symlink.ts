import fs from 'node:fs'
import path from 'node:path'
import type {AgentConfig} from '../config/agents.js'
import {getAgentSkillsDirs} from '../config/agents.js'
import {logger} from './logger.js'
import {getAgentSkillPaths, getSharedSkillPath} from './paths.js'

/**
 * Recursively copy directory (excludes node_modules and hidden files)
 */
function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, {recursive: true})
  const entries = fs.readdirSync(src, {withFileTypes: true})
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * Create symlink (or copy for Cursor) from shared directory to agent directory(ies)
 * Cursor does not follow symlinks to discover skills - use copy instead.
 */
export function createSymlink(
  skillName: string,
  agent: AgentConfig,
  cwd?: string,
  useCopyOverride?: boolean,
): boolean {
  const source = getSharedSkillPath(skillName)

  if (!fs.existsSync(source)) {
    logger.error(`Skill not found: ${source}`)
    return false
  }

  const targets = getAgentSkillPaths(agent.name, skillName, cwd)
  const useCopy = useCopyOverride !== undefined ? useCopyOverride : agent.useCopyInsteadOfSymlink === true
  let successCount = 0

  for (const target of targets) {
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
        } else if (stats.isDirectory()) {
          fs.rmSync(target, {recursive: true, force: true})
        } else {
          logger.warn(`Target exists but is not a symlink/dir, skipping: ${target}`)
          continue
        }
      } catch (error: any) {
        logger.error(`Failed to remove existing target: ${error.message}`)
        continue
      }
    }

    try {
      if (useCopy) {
        copyDir(source, target)
      } else {
        fs.symlinkSync(source, target, 'dir')
      }
      successCount++
    } catch (error: any) {
      logger.error(`Failed to ${useCopy ? 'copy' : 'symlink'} at ${target}: ${error.message}`)
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
 * Remove symlink or copied directory from agent directory(ies)
 * Handles both symlinks (most agents) and directories (Cursor uses copy)
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
      } else if (stats.isDirectory()) {
        fs.rmSync(target, {recursive: true, force: true})
        removedCount++
      } else {
        logger.warn(`Not a symlink or directory: ${target}`)
      }
    } catch (error: any) {
      logger.error(`Failed to remove at ${target}: ${error.message}`)
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
