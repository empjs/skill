import fs from 'node:fs'
import path from 'node:path'

export interface SkillItem {
  name: string
  path: string
  description?: string
  version?: string
}

/**
 * Scan directory for skills (directories containing SKILL.md)
 */
export function scanForSkills(dir: string): SkillItem[] {
  const skills: SkillItem[] = []

  // Check if the directory itself is a skill
  const skillMdPath = path.join(dir, 'SKILL.md')
  if (fs.existsSync(skillMdPath)) {
    skills.push(parseSkillDir(dir))
  }

  // Scan subdirectories (only one level deep for performance and clarity)
  const entries = fs.readdirSync(dir, {withFileTypes: true})
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      const subDir = path.join(dir, entry.name)
      const subSkillMd = path.join(subDir, 'SKILL.md')
      if (fs.existsSync(subSkillMd)) {
        skills.push(parseSkillDir(subDir))
      }
    }
  }

  return skills
}

/**
 * Parse a skill directory to get name, version, and description
 */
function parseSkillDir(dir: string): SkillItem {
  const name = path.basename(dir)
  let description = ''
  let version = '1.0.0'

  // 1. Try to read package.json first (usually more accurate)
  const pkgPath = path.join(dir, 'package.json')
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      if (pkg.description) description = pkg.description
      if (pkg.version) version = pkg.version
      if (pkg.name) {
        return {
          name: pkg.name.replace('@empjs/', ''),
          path: dir,
          description,
          version
        }
      }
    } catch {}
  }

  // 2. Fallback to SKILL.md for description
  const skillMdPath = path.join(dir, 'SKILL.md')
  if (fs.existsSync(skillMdPath)) {
    const content = fs.readFileSync(skillMdPath, 'utf-8')
    // Extract description from frontmatter (more robust regex)
    const descMatch = content.match(/description:\s*(?:"([^"]+)"|'([^']+)'|([^'"\n\r]+))/i)
    if (descMatch) {
      description = descMatch[1] || descMatch[2] || descMatch[3]
    }
  }

  return {
    name,
    path: dir,
    description: description.trim(),
    version
  }
}
