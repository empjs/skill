// i18n translations
const translations = {
  en: {
    nav: {
      features: 'Features',
      agents: 'Agents',
      commands: 'Commands',
      usage: 'Usage',
    },
    hero: {
      title: '@empjs/skill',
      subtitle: 'Unified AI Agent Skills Management',
      description:
        'Write once, distribute to 18+ agents. Manage skills for Claude, Cursor, Windsurf, Antigravity and more through one CLI.',
      unified: 'Unified AI Agent Skills Management',
      howItWorks: 'How it Works',
      viewCommands: 'View Commands',
      gitInstall: '✨ Git URL Install',
      stats: {
        agents: 'AI Agents',
        skills: 'Skills',
        cli: 'CLI Tool',
        config: 'Config Files',
      },
    },
    features: {
      mainTitle: 'Everything You Need for Unified Skills',
      mainDesc:
        'Comprehensive skill management at your fingertips. Install, distribute, and manage skills across all AI agents with one CLI.',
      title: 'Features',
      unified: {
        title: 'Unified Storage',
        desc: 'All skills stored centrally in ~/.emp-agent/skills/',
      },
      auto: {
        title: 'Auto Distribution',
        desc: 'Auto-detect and symlink to installed agents. Use --agent to target specific platform.',
      },
      dev: {
        title: 'Dev Mode',
        desc: 'Use --link for local development, changes take effect instantly',
      },
      git: {
        title: 'Git URL Install',
        desc: 'Install directly from GitHub/GitLab URL, no NPM publishing needed',
      },
    },
    agents: {
      title: '18+ AI Agents Supported',
      desc: 'Framework-specific skill directories with automatic symlinks.',
    },
    commands: {
      title: 'Commands',
      gitInstall: {
        title: 'Install from Git URL',
        desc: 'Install skills directly from GitHub/GitLab URLs. No NPM publishing required. Supports branches and subdirectories.',
        gitTitle: '✨ Git URL Installation',
        exampleTitle: 'Usage Example',
        exampleDesc: 'Copy the full GitHub/GitLab URL including branch and path:',
        supportedFeatures: 'Supported Features:',
        feature1: 'Branches',
        feature2: 'Subdirectories',
        benefit1: 'No NPM Publishing',
        benefit2: 'Direct from Repo',
        benefit3: 'Auto Branch Detection',
      },
      install: {
        title: 'install / add',
        desc: 'Install a skill from NPM, Git URL, or local directory',
        gitTitle: '✨ Git URL Install',
        npmTitle: '🌍 Install NPM Package',
        example: 'Example:',
      },
      list: {
        title: 'list / ls',
        desc: 'List all installed skills',
      },
      remove: {
        title: 'remove / rm / uninstall',
        desc: 'Remove an installed skill',
      },
      agents: {
        title: 'agents',
        desc: 'List all supported AI agents and their directories',
      },
    },
    usage: {
      mainTitle: 'How It Works',
      mainDesc: 'From installation to skill management in 5 simple steps',
      title: 'Usage Guide',
      step0: {
        title: 'Install CLI',
        desc: 'Install the @empjs/skill CLI tool globally',
        pnpm: 'Using pnpm (recommended)',
        npm: 'Using npm',
        yarn: 'Using yarn',
        bun: 'Using bun',
        note: '* After installation, use eskill command to manage skills',
      },
      step1: {
        title: 'Install Skill',
        desc: 'Install skills from NPM or Git URL',
        gitTitle: '🚀 Install from GitHub/GitLab URL (New)',
        gitAlias: 'Or use alias:',
        gitNote: 'Supports GitHub, GitLab, branches and subdirectory paths',
        gitFeature: '✨ No need to publish to NPM, install directly from repo',
        npmTitle: '🌍 Install NPM Package',
        npmAlias: 'Or: eskill add <skill-name>',
        note: '* Auto-distributed to 18+ agents (Claude, Cursor, Windsurf, Antigravity, etc.)',
      },
      step2: {
        title: 'Developer Mode',
        desc: 'Link local skill for development, changes take effect instantly',
        cd: 'Enter skill directory',
        link: 'Create symlink',
        linkAlias: 'Or: eskill add . --link',
      },
      step3: {
        title: 'List Skills',
        desc: 'View all installed skills and their status',
        output: 'Output example:',
      },
      step4: {
        title: 'Remove Skill',
        desc: 'Remove installed skills',
        removeTitle: 'Remove skill (three equivalent ways)',
        agentOnly: 'Remove link for specific agent only',
      },
      step5: {
        title: 'List Agents',
        desc: 'View all supported agents and their directories',
      },
    },
    cta: {
      title: 'Ready to Manage Your Skills?',
      desc: 'Get started with @empjs/skill. Unified skill management at your fingertips.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      compatible: 'Multi-Agent Compatible',
      productionReady: 'Production Ready',
      gitInstall: '✨ Try Git URL Installation - Our Core Feature',
      gitInstallDesc: 'Install skills directly from GitHub/GitLab without publishing to NPM',
    },
    footer: {
      copyright: '© 2026 EMP Team. MIT License.',
    },
    copy: {
      copy: 'Copy',
      copied: 'Copied!',
    },
  },
  zh: {
    nav: {
      features: '功能特性',
      agents: '支持平台',
      commands: '指令介绍',
      usage: '使用指南',
    },
    hero: {
      title: '@empjs/skill',
      subtitle: '统一 AI Agent 技能管理',
      description: '一次开发，18+ 平台通用。通过统一 CLI 管理 Claude、Cursor、Windsurf、Antigravity 等平台技能。',
      unified: '统一 AI Agent 技能管理',
      howItWorks: '使用指南',
      viewCommands: '查看命令',
      gitInstall: '✨ Git URL 安装',
      stats: {
        agents: 'AI 平台',
        skills: '技能',
        cli: 'CLI 工具',
        config: '配置文件',
      },
    },
    features: {
      mainTitle: '统一技能管理所需的一切',
      mainDesc: '全面的技能管理功能。通过一个 CLI 安装、分发和管理所有 AI Agent 的技能。',
      title: '功能特性',
      unified: {
        title: '统一存储',
        desc: '所有技能集中存储在 ~/.emp-agent/skills/',
      },
      auto: {
        title: '自动分发',
        desc: '自动检测并软链到已安装的 Agent。支持 --agent 指定目标平台。',
      },
      dev: {
        title: '开发模式',
        desc: '使用 --link 进行本地开发，修改即时生效',
      },
      git: {
        title: 'Git URL 安装',
        desc: '直接从 GitHub/GitLab URL 安装，无需发布到 NPM',
      },
    },
    agents: {
      title: '支持 18+ 个 AI Agent',
      desc: '特定于框架的技能目录，自动创建软链接。',
    },
    commands: {
      title: '指令介绍',
      gitInstall: {
        title: '从 Git URL 安装',
        desc: '直接从 GitHub/GitLab URL 安装技能。无需发布到 NPM。支持分支和子目录。',
        gitTitle: '✨ Git URL 安装',
        exampleTitle: '使用示例',
        exampleDesc: '复制完整的 GitHub/GitLab URL，包含分支和路径：',
        supportedFeatures: '支持的功能：',
        feature1: '支持分支',
        feature2: '支持子目录',
        benefit1: '无需 NPM 发布',
        benefit2: '直接从仓库',
        benefit3: '自动识别分支',
      },
      install: {
        title: 'install / add',
        desc: '安装技能包，支持从 NPM、Git URL 或本地目录安装',
        gitTitle: '✨ 新功能：Git URL 安装',
        npmTitle: '🌍 安装 NPM 技能包',
        example: '示例：',
      },
      list: {
        title: 'list / ls',
        desc: '列出所有已安装的技能',
      },
      remove: {
        title: 'remove / rm / uninstall',
        desc: '删除已安装的技能',
      },
      agents: {
        title: 'agents',
        desc: '列出所有支持的 AI Agent 及其目录',
      },
    },
    usage: {
      mainTitle: '使用流程',
      mainDesc: '从安装到技能管理的 5 个简单步骤',
      title: '使用指南',
      step0: {
        title: '安装 CLI',
        desc: '全局安装 @empjs/skill CLI 工具',
        pnpm: '使用 pnpm（推荐）',
        npm: '使用 npm',
        yarn: '使用 yarn',
        bun: '使用 bun',
        note: '* 安装完成后，使用 eskill 命令管理技能',
      },
      step1: {
        title: '安装技能',
        desc: '从 NPM 或 Git URL 安装技能',
        gitTitle: '🚀 从 GitHub/GitLab URL 安装（新功能）',
        gitAlias: '或使用别名：',
        gitNote: '支持 GitHub、GitLab、分支和子目录路径',
        gitFeature: '✨ 无需发布到 NPM，直接从仓库安装',
        npmTitle: '🌍 安装 NPM 技能包',
        npmAlias: '或：eskill add <skill-name>',
        note: '* 自动分发到 18+ 个平台（Claude、Cursor、Windsurf、Antigravity 等）',
      },
      step2: {
        title: '开发者模式',
        desc: '链接本地技能进行开发，修改即时生效',
        cd: '进入技能包目录',
        link: '创建软链',
        linkAlias: '或：eskill add . --link',
      },
      step3: {
        title: '查看技能',
        desc: '查看所有已安装的技能及其状态',
        output: '输出示例：',
      },
      step4: {
        title: '删除技能',
        desc: '删除已安装的技能',
        removeTitle: '删除技能（三种方式等价）',
        agentOnly: '仅删除特定 agent 的链接',
      },
      step5: {
        title: '查看平台',
        desc: '查看所有支持的 Agent 及其目录',
      },
    },
    cta: {
      title: '准备管理您的技能？',
      desc: '开始使用 @empjs/skill。统一的技能管理触手可及。',
      getStarted: '开始使用',
      learnMore: '了解更多',
      compatible: '多平台兼容',
      productionReady: '生产就绪',
      gitInstall: '✨ 尝试 Git URL 安装 - 我们的核心功能',
      gitInstallDesc: '直接从 GitHub/GitLab 安装技能，无需发布到 NPM',
    },
    footer: {
      copyright: '© 2026 EMP Team. MIT License.',
    },
    copy: {
      copy: '复制命令',
      copied: '已复制！',
    },
  },
}

// Detect browser language
function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage
  const langCode = browserLang.split('-')[0].toLowerCase()
  return translations[langCode] ? langCode : 'en'
}

// Get current language from localStorage or detect
function getCurrentLanguage() {
  const saved = localStorage.getItem('eskill-lang')
  return saved || detectLanguage()
}

// Set language
function setLanguage(lang) {
  localStorage.setItem('eskill-lang', lang)
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  updatePageContent(lang)
  updateLanguageButtons(lang)
}

// Update language buttons
function updateLanguageButtons(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang')
    if (btnLang === lang) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  })
}

// Update page content
function updatePageContent(lang) {
  const t = translations[lang]
  if (!t) return

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    const keys = key.split('.')
    let value = t
    for (const k of keys) {
      value = value?.[k]
    }
    if (value !== undefined) {
      if (el.tagName === 'INPUT' && el.type === 'button') {
        el.value = value
      } else {
        el.textContent = value
      }
    }
  })

  // Update title
  if (lang === 'zh') {
    document.title = '@empjs/skill - 统一 AI Agent 技能管理'
  } else {
    document.title = '@empjs/skill - Unified AI Agent Skills Management'
  }
}

// Initialize
function initI18n() {
  const lang = getCurrentLanguage()
  setLanguage(lang)
  updateLanguageButtons(lang)
}

// Export
if (typeof window !== 'undefined') {
  window.i18n = {
    translations,
    setLanguage,
    getCurrentLanguage,
    initI18n,
    updateLanguageButtons,
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n)
  } else {
    initI18n()
  }
}
