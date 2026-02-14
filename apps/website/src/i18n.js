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
      title: 'EMP Skill Hub',
      subtitle: 'The Enterprise Distribution Hub for AI Agents',
      description:
        'Securely bridge your internal engineering standards with AI Agents. One CLI to manage, distribute, and trace skills across 18+ platforms with private repository support.',
      unified: 'Unified AI Agent Skills Management',
      howItWorks: 'Get Started',
      viewCommands: 'CLI Reference',
      gitInstall: '🚀 Private Repo Install',
      stats: {
        agents: 'Platforms',
        skills: 'Skills',
        cli: 'Unified CLI',
        config: 'Zero Config',
      },
    },
    features: {
      mainTitle: 'Enterprise-Grade Skill Management',
      mainDesc:
        'Built for modern engineering teams. Distribute knowledge, enforce standards, and scale AI productivity securely.',
      title: 'Core Capabilities',
      unified: {
        title: 'Unified Registry',
        desc: 'Centralized skill management in ~/.emp-agent/skills/ with agent-native auto-linking.',
      },
      auto: {
        title: 'Smart Distribution',
        desc: 'Auto-detects 18+ agents. Inject skills into Claude, Cursor, or Windsurf with zero manual path config.',
      },
      dev: {
        title: 'B2B On-demand',
        desc: 'Interactive multi-select for Monorepo skill sets. Install specifically what your project needs.',
      },
      git: {
        title: 'Secure Auth',
        desc: 'Zero-config private GitLab/GitHub support. Smart in-line token prompting and SSH fallback.',
      },
      trace: {
        title: 'Agent Traceability',
        desc: 'Clearly see which skills are linked to which AI Agents (Claude, Cursor, etc.) at a glance.',
      },
      scope: {
        title: 'Project-Local Support',
        desc: 'Install skills to ./.agent/skills for specific projects, keeping your global environment clean.',
      },
      method: {
        title: 'Link or Copy',
        desc: 'Choose between Symlinks (instant updates) or Full Copy (portable & self-contained).',
      },
    },
    agents: {
      title: '18+ AI Agents Supported',
      desc: 'Framework-specific skill directories with automatic symlinks.',
    },
    commands: {
      title: 'Commands',
      gitInstall: {
        title: 'B2B: On-demand Installation',
        desc: 'Detects multiple skills in one repository. Choose specifically what to install via interactive UI.',
        gitTitle: '📦 Skill Set Discovery',
        exampleTitle: 'B2B Usage Example',
        exampleDesc: 'Perfect for internal monorepos with multiple skill packages:',
        supportedFeatures: 'B2B Capabilities:',
        feature1: 'Monorepo Discovery',
        feature2: 'Interactive UI',
        benefit1: 'Private Registry Ready',
        benefit2: 'Sub-directory Scan',
        benefit3: 'Access Token Support',
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
      auth: {
        title: 'auth [domain]',
        desc: 'Advanced: Manually manage tokens. (Note: install now detects and prompts for tokens automatically!)',
        example: '$ eskill auth git.internal.corp --token your_token',
      },
    },
    usage: {
      mainTitle: 'How It Works',
      mainDesc: 'Intelligent, automated, and framework-agnostic.',
      title: 'Usage Guide',
      step0: {
        title: 'Install CLI',
        desc: 'Global installation of the unified skill manager',
        pnpm: 'Using pnpm (recommended)',
        npm: 'Using npm',
        yarn: 'Using yarn',
        bun: 'Using bun',
        note: '* After installation, use eskill command to manage skills',
      },
      step1: {
        title: 'Zero-Config Install',
        desc: 'Install from any URL. Private repos are handled automatically via SSH or smart in-line prompting.',
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
      title: 'EMP 技能枢纽',
      subtitle: '企业级 AI Agent 技能分发中心',
      description: '为企业内部工程规范与 AI 助手搭建安全桥梁。通过统一 CLI，在支持私有仓库的前提下，跨 18+ 平台管理、分发并追踪技能链路。',
      unified: '统一 AI Agent 技能管理',
      howItWorks: '立即开始',
      viewCommands: '命令手册',
      gitInstall: '🚀 私有仓库安装',
      stats: {
        agents: '支持平台',
        skills: '丰富技能',
        cli: '统一工具',
        config: '零配置',
      },
    },
    features: {
      mainTitle: '企业级技能管理方案',
      mainDesc: '专为现代研发团队打造。安全地分发知识、落地规范，并规模化提升 AI 生产力。',
      title: '核心能力',
      unified: {
        title: '统一注册表',
        desc: '所有技能集中存储在 ~/.emp-agent/skills/，并支持 Agent 原生自动链接。',
      },
      auto: {
        title: '智能分发',
        desc: '自动探测 18+ 种 Agent。无需手动配置路径，即可向 Claude, Cursor 或 Windsurf 注入技能。',
      },
      dev: {
        title: 'B2B 按需分发',
        desc: '支持 Monorepo 技能集交互式多选。根据项目需求，精准安装所需技能。',
      },
      git: {
        title: '全自动鉴权',
        desc: '零配置支持私有 GitLab/GitHub。具备智能内联 Token 提示及 SSH 自动回退机制。',
      },
      trace: {
        title: 'Agent 链路追踪',
        desc: '一眼看清哪些技能链接到了哪些 AI Agent (Claude, Cursor 等)。',
      },
      scope: {
        title: '项目本地支持',
        desc: '支持安装到当前项目的 ./.agent/skills，保持全局环境整洁，实现项目级隔离。',
      },
      method: {
        title: '软链或全量',
        desc: '自由选择软链接（实时同步修改）或全量复制（离线可用、环境交付）。',
      },
    },
    agents: {
      title: '支持 18+ 个 AI Agent',
      desc: '特定于框架的技能目录，自动创建软链接。',
    },
    commands: {
      title: '指令介绍',
      gitInstall: {
        title: 'B端场景：按需分发',
        desc: '自动识别 Monorepo 中的多个技能。通过交互式界面选择性安装特定包。',
        gitTitle: '📦 技能集自动发现',
        exampleTitle: 'B端使用示例',
        exampleDesc: '非常适合包含多个技能包的企业内部 Monorepo 仓库：',
        supportedFeatures: 'B2B 核心能力：',
        feature1: 'Monorepo 识别',
        feature2: '交互式 UI 选择',
        benefit1: '私有源原生适配',
        benefit2: '子目录深度扫描',
        benefit3: '企业鉴权支持',
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
      auth: {
        title: 'auth [domain]',
        desc: '高级选项：手动管理令牌。（注：install 命令现在会自动探测并提示输入令牌！）',
        example: '$ eskill auth git.internal.corp --token 你的令牌',
      },
    },
    usage: {
      mainTitle: '运作原理',
      mainDesc: '智能、自动、且适配所有主流 AI Agent 平台。',
      title: '使用指南',
      step0: {
        title: '安装 CLI',
        desc: '全局安装统一技能管理器 @empjs/skill',
        pnpm: '使用 pnpm（推荐）',
        npm: '使用 npm',
        yarn: '使用 yarn',
        bun: '使用 bun',
        note: '* 安装完成后，使用 eskill 命令管理技能',
      },
      step1: {
        title: '零配置安装',
        desc: '支持任何 URL 安装。私有仓库将通过 SSH 或智能内联提示自动处理鉴权。',
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
