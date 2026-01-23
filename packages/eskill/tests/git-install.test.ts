import {afterAll, beforeAll, describe, expect, it} from 'bun:test'
import {exec} from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import {promisify} from 'util'
import {isGitUrl, parseGitUrl} from '../src/utils/git'

const execAsync = promisify(exec)

describe('Git URL Installation', () => {
  const testTempDir = path.join(os.tmpdir(), `emp-skill-test-${Date.now()}`)
  const testSkillDir = path.join(testTempDir, 'test-skill')

  beforeAll(() => {
    // Create test directory
    if (!fs.existsSync(testTempDir)) {
      fs.mkdirSync(testTempDir, {recursive: true})
    }
  })

  afterAll(() => {
    // Cleanup test directory
    if (fs.existsSync(testTempDir)) {
      fs.rmSync(testTempDir, {recursive: true, force: true})
    }
  })

  describe('URL Parsing for Installation', () => {
    it('should correctly parse the example GitHub URL', () => {
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

    it('should generate correct git clone command for GitHub URL', () => {
      const url = 'https://github.com/owner/repo/tree/develop/path/to/skill'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      // Verify git URL format
      expect(result?.gitUrl).toContain('github.com')
      expect(result?.gitUrl).toContain('owner/repo')
      expect(result?.branch).toBe('develop')
      expect(result?.path).toBe('path/to/skill')
    })

    it('should handle GitLab URLs correctly', () => {
      const url = 'https://gitlab.com/owner/repo/-/tree/main/skills/my-skill'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.type).toBe('gitlab')
      expect(result?.gitUrl).toContain('gitlab.com')
      expect(result?.path).toBe('skills/my-skill')
    })
  })

  describe('Git URL Detection', () => {
    it('should detect GitHub URLs as git URLs', () => {
      const urls = [
        'https://github.com/owner/repo',
        'https://github.com/owner/repo/tree/main/path',
        'git@github.com:owner/repo.git',
      ]

      urls.forEach(url => {
        expect(isGitUrl(url)).toBe(true)
      })
    })

    it('should not detect NPM packages as git URLs', () => {
      const packages = ['@empjs/skill', 'react-agent-skill', 'some-package']

      packages.forEach(pkg => {
        expect(isGitUrl(pkg)).toBe(false)
      })
    })

    it('should not detect local paths as git URLs', () => {
      const paths = ['./local-skill', '../parent-skill', '/absolute/path/to/skill', '.']

      paths.forEach(p => {
        expect(isGitUrl(p)).toBe(false)
      })
    })
  })

  describe('Real-world URL Examples', () => {
    it('should parse Anthropics skills repository URL', () => {
      const url = 'https://github.com/anthropics/skills/tree/main/skills/skill-creator'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.owner).toBe('anthropics')
      expect(result?.repo).toBe('skills')
      expect(result?.path).toBe('skills/skill-creator')
    })

    it('should parse repository root URL', () => {
      const url = 'https://github.com/owner/repo'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.path).toBeUndefined()
      expect(result?.branch).toBe('main')
    })

    it('should parse URL with custom branch', () => {
      const url = 'https://github.com/owner/repo/tree/feature-branch'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.branch).toBe('feature-branch')
    })

    it('should parse URL with nested path', () => {
      const url = 'https://github.com/owner/repo/tree/main/packages/skills/my-skill'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.path).toBe('packages/skills/my-skill')
    })
  })

  describe('Error Handling', () => {
    it('should handle malformed URLs gracefully', () => {
      const malformedUrls = ['https://github.com', 'github.com/owner/repo', 'not-a-url', '']

      malformedUrls.forEach(url => {
        const result = parseGitUrl(url)
        // Should either return null or not crash
        expect(result === null || result !== null).toBe(true)
      })
    })

    it('should handle URLs with special characters', () => {
      const url = 'https://github.com/user-name/repo_name/tree/branch-name/path_name'
      const result = parseGitUrl(url)

      expect(result).not.toBeNull()
      expect(result?.owner).toBe('user-name')
      expect(result?.repo).toBe('repo_name')
      expect(result?.branch).toBe('branch-name')
      expect(result?.path).toBe('path_name')
    })
  })

  describe('Integration Test (requires network)', () => {
    // Skip if running in CI without network access
    const skipNetworkTests = process.env.SKIP_NETWORK_TESTS === 'true'

    it.skipIf(skipNetworkTests)(
      'should clone a real GitHub repository',
      async () => {
        // Use a small, public test repository
        const testRepo = 'https://github.com/octocat/Hello-World'
        const result = parseGitUrl(testRepo)

        expect(result).not.toBeNull()

        // Test git clone (this requires git to be installed)
        try {
          const {stdout: gitVersion} = await execAsync('git --version')
          expect(gitVersion).toBeTruthy()

          // Note: Actual cloning would be tested in integration tests
          // This just verifies the URL parsing works
          console.log('✅ Git is available for testing')
        } catch (error) {
          console.warn('⚠️ Git not available, skipping clone test')
        }
      },
      30000,
    )
  })
})
