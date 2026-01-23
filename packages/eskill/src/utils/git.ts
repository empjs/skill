/**
 * Parse GitHub URL and convert to git install format
 * Supports:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo/tree/branch
 * - https://github.com/owner/repo/tree/branch/path/to/dir
 * - git@github.com:owner/repo.git
 */
export interface GitUrlInfo {
  type: 'github' | 'gitlab' | 'other'
  owner: string
  repo: string
  branch?: string
  path?: string
  gitUrl: string
  installUrl: string // npm install compatible format
}

export function parseGitUrl(url: string): GitUrlInfo | null {
  // GitHub URL patterns
  const githubPatterns = [
    // https://github.com/owner/repo/tree/branch/path/to/dir
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)(?:\/(.+))?$/,
    // https://github.com/owner/repo
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/)?$/,
    // git@github.com:owner/repo.git
    /^git@github\.com:([^/]+)\/([^/]+)(?:\.git)?$/,
  ]

  // GitLab URL patterns
  const gitlabPatterns = [
    // https://gitlab.com/owner/repo/-/tree/branch/path/to/dir
    /^https?:\/\/gitlab\.com\/([^/]+)\/([^/]+)\/-\/tree\/([^/]+)(?:\/(.+))?$/,
    // https://gitlab.com/owner/repo
    /^https?:\/\/gitlab\.com\/([^/]+)\/([^/]+)(?:\/)?$/,
    // git@gitlab.com:owner/repo.git
    /^git@gitlab\.com:([^/]+)\/([^/]+)(?:\.git)?$/,
  ]

  // Try GitHub patterns
  for (let i = 0; i < githubPatterns.length; i++) {
    const pattern = githubPatterns[i]
    const match = url.match(pattern)
    if (match) {
      const owner = match[1]
      const repo = match[2].replace(/\.git$/, '')
      // Pattern 0: has branch and path
      // Pattern 1: no branch, no path
      // Pattern 2: SSH format
      let branch: string | undefined
      let path: string | undefined

      if (i === 0) {
        // https://github.com/owner/repo/tree/branch/path
        branch = match[3]
        path = match[4]
      } else if (i === 1) {
        // https://github.com/owner/repo
        branch = 'main'
      } else {
        // git@github.com:owner/repo.git
        branch = 'main'
      }

      const gitUrl = `https://github.com/${owner}/${repo}.git`

      return {
        type: 'github',
        owner,
        repo,
        branch,
        path,
        gitUrl,
        installUrl: gitUrl, // Will be used for git clone
      }
    }
  }

  // Try GitLab patterns
  for (let i = 0; i < gitlabPatterns.length; i++) {
    const pattern = gitlabPatterns[i]
    const match = url.match(pattern)
    if (match) {
      const owner = match[1]
      const repo = match[2].replace(/\.git$/, '')
      let branch: string | undefined
      let path: string | undefined

      if (i === 0) {
        // https://gitlab.com/owner/repo/-/tree/branch/path
        branch = match[3]
        path = match[4]
      } else if (i === 1) {
        // https://gitlab.com/owner/repo
        branch = 'main'
      } else {
        // git@gitlab.com:owner/repo.git
        branch = 'main'
      }

      const gitUrl = `https://gitlab.com/${owner}/${repo}.git`

      return {
        type: 'gitlab',
        owner,
        repo,
        branch,
        path,
        gitUrl,
        installUrl: gitUrl, // Will be used for git clone
      }
    }
  }

  // Check if it's a git URL (git+https:// or git+ssh://)
  if (url.startsWith('git+') || url.startsWith('git://')) {
    return {
      type: 'other',
      owner: '',
      repo: '',
      gitUrl: url.replace(/^git\+/, ''),
      installUrl: url.startsWith('git+') ? url : `git+${url}`,
    }
  }

  return null
}

/**
 * Check if a string is a URL
 */
export function isUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

/**
 * Check if a string is a GitHub/GitLab URL
 */
export function isGitUrl(str: string): boolean {
  return (
    str.includes('github.com') ||
    str.includes('gitlab.com') ||
    str.startsWith('git@') ||
    str.startsWith('git+') ||
    str.startsWith('git://')
  )
}
