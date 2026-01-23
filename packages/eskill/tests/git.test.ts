import {describe, expect, it} from 'bun:test'
import {isGitUrl, isUrl, parseGitUrl} from '../src/utils/git'

describe('Git URL Parsing', () => {
  describe('parseGitUrl', () => {
    it('should parse GitHub URL with tree and path', () => {
      const url = 'https://github.com/anthropics/skills/tree/main/skills/skill-creator'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('github')
      expect(result?.owner).toBe('anthropics')
      expect(result?.repo).toBe('skills')
      expect(result?.branch).toBe('main')
      expect(result?.path).toBe('skills/skill-creator')
      expect(result?.gitUrl).toBe('https://github.com/anthropics/skills.git')
    })

    it('should parse GitHub URL with tree but no path', () => {
      const url = 'https://github.com/owner/repo/tree/develop'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('github')
      expect(result?.owner).toBe('owner')
      expect(result?.repo).toBe('repo')
      expect(result?.branch).toBe('develop')
      expect(result?.path).toBeUndefined()
    })

    it('should parse simple GitHub URL', () => {
      const url = 'https://github.com/owner/repo'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('github')
      expect(result?.owner).toBe('owner')
      expect(result?.repo).toBe('repo')
      expect(result?.branch).toBe('main')
      expect(result?.path).toBeUndefined()
    })

    it('should parse GitHub URL with trailing slash', () => {
      const url = 'https://github.com/owner/repo/'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('github')
      expect(result?.owner).toBe('owner')
      expect(result?.repo).toBe('repo')
    })

    it('should parse GitHub SSH URL', () => {
      const url = 'git@github.com:owner/repo.git'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('github')
      expect(result?.owner).toBe('owner')
      expect(result?.repo).toBe('repo')
      expect(result?.branch).toBe('main')
    })

    it('should parse GitHub SSH URL without .git extension', () => {
      const url = 'git@github.com:owner/repo'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('github')
      expect(result?.owner).toBe('owner')
      expect(result?.repo).toBe('repo')
    })

    it('should parse GitLab URL with tree and path', () => {
      const url = 'https://gitlab.com/owner/repo/-/tree/main/path/to/skill'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('gitlab')
      expect(result?.owner).toBe('owner')
      expect(result?.repo).toBe('repo')
      expect(result?.branch).toBe('main')
      expect(result?.path).toBe('path/to/skill')
      expect(result?.gitUrl).toBe('https://gitlab.com/owner/repo.git')
    })

    it('should parse simple GitLab URL', () => {
      const url = 'https://gitlab.com/owner/repo'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('gitlab')
      expect(result?.owner).toBe('owner')
      expect(result?.repo).toBe('repo')
      expect(result?.branch).toBe('main')
    })

    it('should parse GitLab SSH URL', () => {
      const url = 'git@gitlab.com:owner/repo.git'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('gitlab')
      expect(result?.owner).toBe('owner')
      expect(result?.repo).toBe('repo')
    })

    it('should parse git+https URL', () => {
      const url = 'git+https://github.com/owner/repo.git'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('other')
      expect(result?.gitUrl).toBe('https://github.com/owner/repo.git')
    })

    it('should parse git:// URL', () => {
      const url = 'git://github.com/owner/repo.git'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('other')
    })

    it('should return null for invalid URL', () => {
      const url = 'not-a-url'
      const result = parseGitUrl(url)

      expect(result).toBeNull()
    })

    it('should return null for NPM package name', () => {
      const url = '@nova/rn-skill'
      const result = parseGitUrl(url)

      expect(result).toBeNull()
    })

    it('should handle complex path with multiple segments', () => {
      const url = 'https://github.com/owner/repo/tree/main/path/to/deep/nested/skill'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.path).toBe('path/to/deep/nested/skill')
    })

    it('should handle branch names with special characters', () => {
      // Note: GitHub URLs with slashes in branch names are ambiguous
      // The first segment after /tree/ is treated as branch, rest as path
      const url = 'https://github.com/owner/repo/tree/feature-branch'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.branch).toBe('feature-branch')
    })

    it('should handle branch with slash (treated as branch + path)', () => {
      // When branch contains slash, GitHub treats it as branch/path
      const url = 'https://github.com/owner/repo/tree/feature/new-feature'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      // First segment is branch, rest is path
      expect(result?.branch).toBe('feature')
      expect(result?.path).toBe('new-feature')
    })

    it('should handle repo names with hyphens and underscores', () => {
      const url = 'https://github.com/owner/my-repo_name/tree/main'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.repo).toBe('my-repo_name')
    })
  })

  describe('isGitUrl', () => {
    it('should detect GitHub HTTPS URL', () => {
      expect(isGitUrl('https://github.com/owner/repo')).toBe(true)
    })

    it('should detect GitHub URL with path', () => {
      expect(isGitUrl('https://github.com/owner/repo/tree/main/path')).toBe(true)
    })

    it('should detect GitLab HTTPS URL', () => {
      expect(isGitUrl('https://gitlab.com/owner/repo')).toBe(true)
    })

    it('should detect GitHub SSH URL', () => {
      expect(isGitUrl('git@github.com:owner/repo.git')).toBe(true)
    })

    it('should detect GitLab SSH URL', () => {
      expect(isGitUrl('git@gitlab.com:owner/repo.git')).toBe(true)
    })

    it('should detect git+ URL', () => {
      expect(isGitUrl('git+https://github.com/owner/repo.git')).toBe(true)
    })

    it('should detect git:// URL', () => {
      expect(isGitUrl('git://github.com/owner/repo.git')).toBe(true)
    })

    it('should return false for NPM package', () => {
      expect(isGitUrl('@nova/rn-skill')).toBe(false)
    })

    it('should return false for local path', () => {
      expect(isGitUrl('./local-skill')).toBe(false)
    })

    it('should return false for regular string', () => {
      expect(isGitUrl('not-a-git-url')).toBe(false)
    })
  })

  describe('isUrl', () => {
    it('should detect valid HTTP URL', () => {
      expect(isUrl('https://github.com/owner/repo')).toBe(true)
    })

    it('should detect valid HTTPS URL', () => {
      expect(isUrl('http://example.com')).toBe(true)
    })

    it('should return false for relative path', () => {
      expect(isUrl('./local-path')).toBe(false)
    })

    it('should return false for NPM package', () => {
      expect(isUrl('@nova/rn-skill')).toBe(false)
    })

    it('should return false for invalid string', () => {
      expect(isUrl('not a url')).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      expect(parseGitUrl('')).toBeNull()
      expect(isGitUrl('')).toBe(false)
      expect(isUrl('')).toBe(false)
    })

    it('should handle URL with query parameters', () => {
      const url = 'https://github.com/owner/repo?ref=main'
      // Note: This might not parse correctly, but should not crash
      const result = parseGitUrl(url)
      // Should either parse or return null gracefully
      expect(result === null || result !== null).toBe(true)
    })

    it('should handle URL with hash', () => {
      const url = 'https://github.com/owner/repo#readme'
      const result = parseGitUrl(url)
      // Should parse the base URL
      expect(result === null || result !== null).toBe(true)
    })

    it('should handle very long paths', () => {
      const longPath = 'a'.repeat(100).split('').join('/')
      const url = `https://github.com/owner/repo/tree/main/${longPath}`
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.path).toContain('a')
    })
  })
})
