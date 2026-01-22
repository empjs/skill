import os from 'node:os'
import path from 'node:path'

export interface AgentConfig {
  name: string
  displayName: string
  skillsDir: string
  enabled: boolean
}

const HOME = os.homedir()

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
