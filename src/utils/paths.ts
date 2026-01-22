import fs from 'node:fs'
import path from 'node:path'
import {SHARED_SKILLS_DIR, AGENTS, type AgentConfig} from '../config/agents.js'

/**
 * Get skill path in shared directory
 */
export function getSharedSkillPath(skillName: string): string {
  return path.join(SHARED_SKILLS_DIR, skillName)
}

/**
 * Get skill path in specific AI agent directory
 */
export function getAgentSkillPath(agentName: string, skillName: string): string {
  const agent = AGENTS.find((a) => a.name === agentName)
  if (!agent) {
    throw new Error(`Unknown agent: ${agentName}`)
  }
  return path.join(agent.skillsDir, skillName)
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
export function detectInstalledAgents(): AgentConfig[] {
  return AGENTS.filter((agent) => {
    try {
      return fs.existsSync(agent.skillsDir) || fs.existsSync(path.dirname(agent.skillsDir))
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
