
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const CONFIG_DIR = path.join(os.homedir(), '.emp-agent')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')

export interface SkillSource {
  id: string
  provider: 'gitlab' | 'github'
  url: string
  group: string
  token?: string
}

export interface Config {
  sources: SkillSource[]
  tokens: Record<string, string> // domain -> token
}

const DEFAULT_CONFIG: Config = {
  sources: [],
  tokens: {}
}

export function saveToken(domain: string, token: string) {
  const config = loadConfig()
  config.tokens[domain] = token
  saveConfig(config)
}

export function getToken(domain: string): string | undefined {
  const config = loadConfig()
  return config.tokens[domain]
}

export function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
  }
}

export function loadConfig(): Config {
  ensureConfigDir()
  if (!fs.existsSync(CONFIG_FILE)) {
    return DEFAULT_CONFIG
  }
  try {
    const content = fs.readFileSync(CONFIG_FILE, 'utf-8')
    return { ...DEFAULT_CONFIG, ...JSON.parse(content) }
  } catch {
    return DEFAULT_CONFIG
  }
}

export function saveConfig(config: Config) {
  ensureConfigDir()
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
}

export function addSource(source: SkillSource) {
  const config = loadConfig()
  // Check if ID already exists
  if (config.sources.find(s => s.id === source.id)) {
    throw new Error(`Source with ID '${source.id}' already exists`)
  }
  config.sources.push(source)
  saveConfig(config)
}

export function removeSource(id: string) {
  const config = loadConfig()
  const initialLength = config.sources.length
  config.sources = config.sources.filter(s => s.id !== id)
  if (config.sources.length === initialLength) {
    throw new Error(`Source with ID '${id}' not found`)
  }
  saveConfig(config)
}

export function listSources(): SkillSource[] {
  return loadConfig().sources
}
