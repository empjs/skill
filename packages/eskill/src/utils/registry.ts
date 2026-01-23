import {exec} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import {promisify} from 'node:util'

const execAsync = promisify(exec)

/**
 * Find .npmrc file by walking up the directory tree
 */
function findNpmrc(startDir: string): string | null {
  let currentDir = path.resolve(startDir)

  while (currentDir !== path.dirname(currentDir)) {
    const npmrcPath = path.join(currentDir, '.npmrc')
    if (fs.existsSync(npmrcPath)) {
      return npmrcPath
    }
    currentDir = path.dirname(currentDir)
  }

  return null
}

/**
 * Parse registry from .npmrc file
 */
function parseNpmrc(npmrcPath: string): string | null {
  try {
    const content = fs.readFileSync(npmrcPath, 'utf-8')
    const lines = content.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      // Match registry=... or @scope:registry=...
      const registryMatch = trimmed.match(/^(?:@[^:]+:)?registry\s*=\s*(.+)$/)
      if (registryMatch) {
        return registryMatch[1].trim()
      }
    }
  } catch (error) {
    // Ignore parse errors
  }

  return null
}

/**
 * Get registry from global npm config
 */
async function getGlobalRegistry(): Promise<string | null> {
  try {
    const {stdout} = await execAsync('npm config get registry')
    const registry = stdout.trim()
    // npm config get registry returns 'undefined' if not set
    if (registry && registry !== 'undefined') {
      return registry
    }
  } catch (error) {
    // Ignore errors
  }

  return null
}

/**
 * Get npm registry with priority:
 * 1. CLI --registry option (handled by caller)
 * 2. Project .npmrc file
 * 3. Global npm config
 * 4. Default https://registry.npmjs.org/
 */
export async function getRegistry(cwd: string = process.cwd()): Promise<string> {
  // 1. Check project .npmrc
  const npmrcPath = findNpmrc(cwd)
  if (npmrcPath) {
    const registry = parseNpmrc(npmrcPath)
    if (registry) {
      return registry
    }
  }

  // 2. Check global npm config
  const globalRegistry = await getGlobalRegistry()
  if (globalRegistry) {
    return globalRegistry
  }

  // 3. Default registry
  return 'https://registry.npmjs.org/'
}
