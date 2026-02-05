import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export interface AgentConfig {
  name: string
  displayName: string
  skillsDir?: string // Single directory (backward compatibility)
  skillsDirs?: string[] | ((cwd?: string) => string[]) // Multiple directories or function to get directories
  enabled: boolean
}

const HOME = os.homedir()
// XDG config: ~/.config on Linux/macOS, matches skills.sh ecosystem
const CONFIG_HOME = process.env.XDG_CONFIG_HOME || path.join(HOME, '.config')

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
 * Aligned with https://skills.sh/ ecosystem
 */
export const AGENTS: AgentConfig[] = [
  // skills.sh core agents (18)
  {
    name: 'amp',
    displayName: 'AMP',
    skillsDirs: (cwd?: string) => {
      const dirs = [path.join(CONFIG_HOME, 'agents', 'skills')]
      if (cwd) dirs.push(path.join(cwd, '.agents', 'skills'))
      return dirs
    },
    enabled: true,
  },
  {
    name: 'antigravity',
    displayName: 'Antigravity',
    skillsDirs: (cwd?: string) => {
      const dirs = [path.join(HOME, '.gemini', 'antigravity', 'skills')]
      if (cwd) dirs.push(path.join(cwd, '.agent', 'skills'))
      if (cwd) dirs.push(path.join(cwd, '.shared', 'skills'))
      return dirs
    },
    enabled: true,
  },
  {
    name: 'claude',
    displayName: 'Claude Code',
    skillsDir: path.join(process.env.CLAUDE_CONFIG_DIR?.trim() || path.join(HOME, '.claude'), 'skills'),
    enabled: true,
  },
  {
    name: 'clawdbot',
    displayName: 'ClawdBot',
    skillsDirs: () => {
      const openclaw = path.join(HOME, '.openclaw', 'skills')
      const clawdbot = path.join(HOME, '.clawdbot', 'skills')
      const moltbot = path.join(HOME, '.moltbot', 'skills')
      if (fs.existsSync(path.join(HOME, '.openclaw'))) return [openclaw]
      if (fs.existsSync(path.join(HOME, '.clawdbot'))) return [clawdbot]
      if (fs.existsSync(path.join(HOME, '.moltbot'))) return [moltbot]
      return [openclaw] // default for symlink creation
    },
    enabled: true,
  },
  {
    name: 'cline',
    displayName: 'Cline',
    skillsDir: path.join(HOME, '.cline', 'skills'),
    enabled: true,
  },
  {
    name: 'codex',
    displayName: 'Codex',
    skillsDir: path.join(process.env.CODEX_HOME?.trim() || path.join(HOME, '.codex'), 'skills'),
    enabled: true,
  },
  {
    name: 'cursor',
    displayName: 'Cursor',
    skillsDir: path.join(HOME, '.cursor', 'skills'),
    enabled: true,
  },
  {
    name: 'droid',
    displayName: 'Droid',
    skillsDir: path.join(HOME, '.factory', 'skills'),
    enabled: true,
  },
  {
    name: 'gemini',
    displayName: 'Gemini',
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
    name: 'goose',
    displayName: 'Goose',
    skillsDir: path.join(CONFIG_HOME, 'goose', 'skills'),
    enabled: true,
  },
  {
    name: 'kilo',
    displayName: 'Kilo Code',
    skillsDir: path.join(HOME, '.kilocode', 'skills'),
    enabled: true,
  },
  {
    name: 'kiro',
    displayName: 'Kiro CLI',
    skillsDir: path.join(HOME, '.kiro', 'skills'),
    enabled: true,
  },
  {
    name: 'opencode',
    displayName: 'OpenCode',
    skillsDir: path.join(CONFIG_HOME, 'opencode', 'skills'),
    enabled: true,
  },
  {
    name: 'roo',
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
    name: 'windsurf',
    displayName: 'Windsurf',
    skillsDirs: () => {
      const dirs: string[] = []
      dirs.push(path.join(HOME, '.windsurf', 'skills'))
      dirs.push(path.join(HOME, '.codeium', 'windsurf', 'skills'))
      return dirs
    },
    enabled: true,
  },
  // Additional agents
  {
    name: 'qoder',
    displayName: 'Qoder',
    skillsDir: path.join(HOME, '.qoder', 'skills'),
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
export const SHARED_SKILLS_DIR = path.join(HOME, '.emp-agent', 'skills')

/**
 * EMP agent config file
 */
export const CONFIG_FILE = path.join(HOME, '.emp-agent', 'config.json')

/**
 * Cache directory
 */
export const CACHE_DIR = path.join(HOME, '.emp-agent', 'cache')
