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

  // Try to read SKILL.md for description (extract from frontmatter if exists)
  const skillMdPath = path.join(dir, 'SKILL.md')
  if (fs.existsSync(skillMdPath)) {
    const content = fs.readFileSync(skillMdPath, 'utf-8')
    const match = content.match(/description:\s*["']?([^"'
]+)["']?/)
    if (match) {
      description = match[1]
    }
    
    const nameMatch = content.match(/name:\s*["']?([^"'
]+)["']?/)
    if (nameMatch) {
      // Use name from frontmatter if available
      // return { name: nameMatch[1], path: dir, description, version };
    }
  }

  // Try to read package.json for better metadata
  const pkgPath = path.join(dir, 'package.json')
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      return {
        name: pkg.name.replace('@empjs/', ''),
        path: dir,
        description: pkg.description || description,
        version: pkg.version || version
      }
    } catch {
      // Ignore parse error
    }
  }

  return {
    name,
    path: dir,
    description,
    version
  }
}
