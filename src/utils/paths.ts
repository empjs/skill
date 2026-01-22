import fs from 'node:fs'
import path from 'node:path'
import {SHARED_SKILLS_DIR, AGENTS, type AgentConfig, getAgentSkillsDirs} from '../config/agents.js'

/**
 * Get skill path in shared directory
 */
export function getSharedSkillPath(skillName: string): string {
  return path.join(SHARED_SKILLS_DIR, skillName)
}

/**
 * Get skill paths in specific AI agent directories (all directories)
 */
export function getAgentSkillPaths(agentName: string, skillName: string, cwd?: string): string[] {
  const agent = AGENTS.find((a) => a.name === agentName)
  if (!agent) {
    throw new Error(`Unknown agent: ${agentName}`)
  }
  const skillsDirs = getAgentSkillsDirs(agent, cwd)
  return skillsDirs.map((dir) => path.join(dir, skillName))
}

/**
 * Get skill path in specific AI agent directory (first directory, backward compatibility)
 */
export function getAgentSkillPath(agentName: string, skillName: string, cwd?: string): string {
  const paths = getAgentSkillPaths(agentName, skillName, cwd)
  if (paths.length === 0) {
    throw new Error(`No skills directories configured for agent: ${agentName}`)
  }
  return paths[0]
}

/**
 * Ensure shared directory exists
 */
export function ensureSharedDir(): void {
  if (!fs.existsSync(SHARED_SKILLS_DIR)) {
    fs.mkdirSync(SHARED_SKILLS_DIR, {recursive: true})
  }
}

/**
 * Detect installed AI agents
 */
export function detectInstalledAgents(cwd?: string): AgentConfig[] {
  return AGENTS.filter((agent) => {
    try {
      const skillsDirs = getAgentSkillsDirs(agent, cwd)
      // Check if any directory exists or its parent exists
      return skillsDirs.some((dir) => {
        return fs.existsSync(dir) || fs.existsSync(path.dirname(dir))
      })
    } catch {
      return false
    }
  })
}

/**
 * Extract skill name from package name or path
 * @example
 * extractSkillName('@nova/rn-skill') => 'nova-rn'
 * extractSkillName('/path/to/skill') => 'skill'
 */
export function extractSkillName(nameOrPath: string): string {
  if (nameOrPath.startsWith('@')) {
    // NPM package: @nova/rn-skill => nova-rn
    const parts = nameOrPath.split('/')
    if (parts.length === 2) {
      const scope = parts[0].slice(1) // Remove @
      const name = parts[1].replace('-skill', '')
      return `${scope}-${name}`
    }
  }

  // Local path
  return path.basename(nameOrPath)
}
