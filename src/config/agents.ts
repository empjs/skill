import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'

export interface AgentConfig {
  name: string
  displayName: string
  skillsDir?: string // Single directory (backward compatibility)
  skillsDirs?: string[] | ((cwd?: string) => string[]) // Multiple directories or function to get directories
  enabled: boolean
}

const HOME = os.homedir()

/**
 * Get all skills directories for an agent
 */
export function getAgentSkillsDirs(agent: AgentConfig, cwd?: string): string[] {
  if (agent.skillsDirs) {
    if (typeof agent.skillsDirs === 'function') {
      return agent.skillsDirs(cwd)
    }
    return agent.skillsDirs
  }
  if (agent.skillsDir) {
    return [agent.skillsDir]
  }
  return []
}

/**
 * Supported AI agents configuration
 */
export const AGENTS: AgentConfig[] = [
  {
    name: 'claude',
    displayName: 'Claude Code',
    skillsDir: path.join(HOME, '.claude', 'skills'),
    enabled: true,
  },
  {
    name: 'cursor',
    displayName: 'Cursor',
    skillsDir: path.join(HOME, '.cursor', 'skills'),
    enabled: true,
  },
  {
    name: 'windsurf',
    displayName: 'Windsurf',
    skillsDir: path.join(HOME, '.windsurf', 'skills'),
    enabled: true,
  },
  {
    name: 'cline',
    displayName: 'Cline',
    skillsDir: path.join(HOME, '.cline', 'skills'),
    enabled: true,
  },
  {
    name: 'gemini',
    displayName: 'Gemini Code',
    skillsDir: path.join(HOME, '.gemini', 'skills'),
    enabled: true,
  },
  {
    name: 'copilot',
    displayName: 'GitHub Copilot',
    skillsDir: path.join(HOME, '.copilot', 'skills'),
    enabled: true,
  },
  {
    name: 'opencode',
    displayName: 'OpenCode',
    skillsDir: path.join(HOME, '.opencode', 'skills'),
    enabled: true,
  },
  {
    name: 'antigravity',
    displayName: 'Antigravity',
    skillsDirs: (cwd?: string) => {
      const dirs: string[] = []
      // Global directory
      dirs.push(path.join(HOME, '.gemini', 'antigravity', 'skills'))
      // Project-level .agent/skills directory (always include if cwd is provided)
      if (cwd) {
        dirs.push(path.join(cwd, '.agent', 'skills'))
      }
      // Project-level .shared/skills directory (always include if cwd is provided)
      if (cwd) {
        dirs.push(path.join(cwd, '.shared', 'skills'))
      }
      return dirs
    },
    enabled: true,
  },
  {
    name: 'kiro',
    displayName: 'Kiro',
    skillsDir: path.join(HOME, '.kiro', 'skills'),
    enabled: true,
  },
  {
    name: 'codex',
    displayName: 'Codex CLI',
    skillsDir: path.join(HOME, '.codex', 'skills'),
    enabled: true,
  },
  {
    name: 'qoder',
    displayName: 'Qoder',
    skillsDir: path.join(HOME, '.qoder', 'skills'),
    enabled: true,
  },
  {
    name: 'roocode',
    displayName: 'Roo Code',
    skillsDir: path.join(HOME, '.roo', 'skills'),
    enabled: true,
  },
  {
    name: 'trae',
    displayName: 'Trae',
    skillsDir: path.join(HOME, '.trae', 'skills'),
    enabled: true,
  },
  {
    name: 'continue',
    displayName: 'Continue',
    skillsDir: path.join(HOME, '.continue', 'skills'),
    enabled: true,
  },
]

/**
 * Shared skills directory for all AI agents
 */
export const SHARED_SKILLS_DIR = path.join(HOME, '.nova-agent', 'skills')

/**
 * Nova agent config file
 */
export const CONFIG_FILE = path.join(HOME, '.nova-agent', 'config.json')

/**
 * Cache directory
 */
export const CACHE_DIR = path.join(HOME, '.nova-agent', 'cache')
