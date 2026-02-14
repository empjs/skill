import { getLang } from './config.js'

const translations = {
  en: {
    analyzing: 'Analyzing:',
    fetching: 'Fetching skills from source...',
    sourceReady: 'Source ready',
    foundSkills: 'Found {count} skills:',
    selectSkills: 'Select skills to install',
    selectScope: 'Where do you want to install?',
    selectMethod: 'How do you want to install?',
    globalScope: 'Global (~/.claude, ~/.cursor, etc.)',
    localScope: 'Local Project (./.agent/skills)',
    linkMethod: 'Symlink (Changes reflect instantly)',
    copyMethod: 'Full Copy (Self-contained)',
    installing: 'Installing {name}...',
    processing: 'Processing {name}...',
    success: '{count} skill(s) installed successfully!',
    authRequired: 'Authentication required for {domain}',
    enterToken: 'Please enter Access Token for {domain}:',
    authenticating: 'Authenticating with {domain}...',
    clonedSuccess: 'Cloned successfully',
    noAgents: 'No AI agents detected for the selected scope.',
    linkedTo: 'Linked to: {agents}',
    notLinked: 'Not linked to any agent',
    source: 'Source:',
    installed: 'INSTALLED',
    devLink: 'DEV LINK',
    unsupported: 'Invalid git URL: {url}',
    back: 'Back',
    backHint: '(Press Esc or select Back to go back)',
    selectAtLeastOne: 'Please select at least one skill.'
  },
  zh: {
    analyzing: '正在分析:',
    fetching: '正在从源获取技能...',
    sourceReady: '获取成功',
    foundSkills: '发现 {count} 个技能:',
    selectSkills: '请选择要安装的技能',
    selectScope: '您希望安装到哪里？',
    selectMethod: '您希望如何安装？',
    globalScope: '全局目录 (~/.claude, ~/.cursor 等)',
    localScope: '当前项目 (./.agent/skills)',
    linkMethod: '软链接 (修改实时生效)',
    copyMethod: '全量复制 (离线/独立)',
    installing: '正在安装 {name}...',
    processing: '正在处理 {name}...',
    success: '成功安装了 {count} 个技能！',
    authRequired: '需要鉴权: {domain}',
    enterToken: '请输入 {domain} 的访问令牌 (Access Token):',
    authenticating: '正在验证 {domain} 的鉴权信息...',
    clonedSuccess: '获取成功',
    noAgents: '在选定范围内未检测到 AI Agent 目录。',
    linkedTo: '已链接至: {agents}',
    notLinked: '未链接到任何 Agent',
    source: '源路径:',
    installed: '已安装',
    devLink: '开发链接',
    unsupported: '无效的 Git URL: {url}',
    back: '返回',
    backHint: '(按 Esc 或选择“返回”以回到上一步)',
    selectAtLeastOne: '请至少选择一个技能。'
  }
}

export function t(key: keyof typeof translations.en, params: Record<string, any> = {}): string {
  const lang = getLang()
  let text = translations[lang][key] || translations.en[key] || key
  
  for (const [p, val] of Object.entries(params)) {
    text = text.replace(`{${p}}`, String(val))
  }
  
  return text
}
