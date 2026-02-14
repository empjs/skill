import {exec} from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'
// @ts-ignore
import enquirer from 'enquirer'
const {MultiSelect, Password, Select} = enquirer
import chalk from 'chalk'
import {isGitUrl, parseGitUrl, convertToSshUrl} from '../utils/git.js'
import {logger} from '../utils/logger.js'
import {AGENTS} from '../config/agents.js'
import {detectInstalledAgents, ensureSharedDir, extractSkillName, getSharedSkillPath} from '../utils/paths.js'
import {getRegistry} from '../utils/registry.js'
import {createSymlink} from '../utils/symlink.js'
import {scanForSkills, type SkillItem} from '../utils/collection.js'
import {getToken, saveToken} from '../utils/config.js'
import {t} from '../utils/i18n.js'

const execAsync = promisify(exec)

async function execWithTimeout(command: string, timeout = 120000, env?: NodeJS.ProcessEnv) {
  let timeoutId: NodeJS.Timeout | null = null
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Timeout ${timeout / 1000}s`)), timeout)
  })
  try {
    const res = await Promise.race([execAsync(command, env ? {env} : {}), timeoutPromise])
    if (timeoutId) clearTimeout(timeoutId)
    return res
  } catch (e) {
    if (timeoutId) clearTimeout(timeoutId)
    throw e
  }
}

export interface InstallOptions {
  agent?: string; link?: boolean; copy?: boolean; global?: boolean; local?: boolean; all?: boolean; force?: boolean; registry?: string; timeout?: number
}

/**
 * Configure OpenClaw-style MultiSelect
 */
async function promptSkills(skills: SkillItem[]) {
  const prompt = new MultiSelect({
    name: 'value',
    message: t('selectSkills'),
    choices: skills.map(s => ({
      name: s.name, enabled: true,
      message: `${s.name.substring(0, 20)}${chalk.dim((s.description ? ' - ' + s.description : '').substring(0, 40))}`
    })),
    pointer(state: any, choice: any) { return state.index === choice.index ? chalk.cyan('❯') : ' ' },
    indicator(state: any, choice: any) { return choice.enabled ? chalk.green('[✔]') : chalk.gray('[ ]') },
    footer: chalk.dim(`\n  (空格勾选, A 全选, Enter 确认, Esc 退出)`),
    validate(value: string[]) {
      if (value.length === 0) return chalk.red(t('selectAtLeastOne'))
      return true
    }
  })
  return prompt.run()
}

/**
 * Configure Back-aware Select
 */
async function promptSelect(message: string, choices: any[]) {
  const prompt = new Select({
    name: 'value',
    message,
    choices: [...choices, {name: 'back', message: chalk.yellow('← ' + t('back'))}],
    pointer(state: any, choice: any) { return state.index === choice.index ? chalk.cyan('❯') : ' ' },
    footer: chalk.dim(`\n  ${t('backHint')}`),
  })
  return prompt.run()
}

export async function install(skillNameOrPath: string, options: InstallOptions = {}): Promise<void> {
  const isGit = isGitUrl(skillNameOrPath)
  logger.info(`${chalk.cyan('🔍')} ${t('analyzing')} ${chalk.bold(skillNameOrPath)}`)
  ensureSharedDir()

  let tempDir = ''; let cloneDir = ''; let availableSkills: SkillItem[] = []

  if (isGit) {
    const gitInfo = parseGitUrl(skillNameOrPath)
    if (!gitInfo) { logger.error(t('unsupported', {url: skillNameOrPath})); process.exit(1) }
    tempDir = path.join('/tmp', `eskill-${Date.now()}`); cloneDir = path.join(tempDir, 'repo')
    try {
      const spinner = logger.start(t('fetching')); fs.mkdirSync(tempDir, {recursive: true})
      const domain = new URL(gitInfo.gitUrl).hostname; let gitUrl = gitInfo.gitUrl
      const token = getToken(domain) || process.env[`ESKILL_TOKEN_${domain.toUpperCase().replace(/\./g, '_')}`]
      const doClone = async (u: string) => execWithTimeout(`git clone ${gitInfo.branch ? '-b ' + gitInfo.branch : ''} ${u} ${cloneDir} --depth 1 --quiet`, options.timeout || 120000)
      
      try {
        let finalUrl = gitUrl; if (token && gitUrl.startsWith('https://')) finalUrl = gitUrl.replace('https://', `https://oauth2:${token}@`)
        await doClone(finalUrl); spinner.succeed(t('sourceReady'))
      } catch (e) {
        const sshUrl = convertToSshUrl(gitUrl)
        if (sshUrl) {
          try { await doClone(sshUrl); spinner.succeed(t('sourceReady')) }
          catch {
            spinner.stop(); logger.warn(`\n🔒 ${t('authRequired', {domain})}`)
            const newToken = await new Password({ message: t('enterToken', {domain}), validate: (v: string) => v.length > 0 }).run()
            saveToken(domain, newToken); const authedUrl = gitUrl.replace('https://', `https://oauth2:${newToken}@`)
            const fs = logger.start(t('fetching')); await performClone(authedUrl); fs.succeed(t('sourceReady'))
          }
        } else { spinner.fail('Clone failed'); throw e }
      }
      availableSkills = scanForSkills(gitInfo.path ? path.join(cloneDir, gitInfo.path) : cloneDir)
    } catch (error: any) { logger.error(`Error: ${error.message}`); process.exit(1) }
  } else {
    const skillPath = path.resolve(skillNameOrPath)
    if (!fs.existsSync(skillPath)) { logger.error(`Path not found: ${skillPath}`); process.exit(1) }
    availableSkills = scanForSkills(skillPath)
  }

  if (availableSkills.length === 0) { logger.error('No skills found'); process.exit(1) }

  let step = availableSkills.length === 1 ? 1 : 0 
  let selectedNames: string[] = [availableSkills[0]?.name]
  let installScope: 'global' | 'local' = options.local ? 'local' : 'global'
  let installMethod: 'link' | 'copy' = options.copy ? 'copy' : 'link'

  while (step < 3) {
    try {
      if (step === 0) {
        logger.info(`\n📦 ${t('foundSkills', {count: availableSkills.length})}`)
        selectedNames = await promptSkills(availableSkills)
        step = 1
      } else if (step === 1) {
        if (options.global || options.local) { step = 2; continue }
        installScope = await promptSelect(t('selectScope'), [{name: 'global', message: t('globalScope')}, {name: 'local', message: t('localScope')}])
        if (installScope as any === 'back') { step = availableSkills.length === 1 ? -1 : 0; continue }
        step = 2
      } else if (step === 2) {
        if (options.link || options.copy) { step = 3; continue }
        installMethod = await promptSelect(t('selectMethod'), [{name: 'link', message: t('linkMethod')}, {name: 'copy', message: t('copyMethod')}])
        if (installMethod as any === 'back') { step = 1; continue }
        step = 3
      }
    } catch (e) {
      if (step === 0 || step === -1) { logger.warn('\nInstallation cancelled.'); process.exit(0) }
      step-- // Go back on Esc
      continue
    }
  }

  options.local = installScope === 'local'; options.global = installScope === 'global'
  options.copy = installMethod === 'copy'; options.link = installMethod === 'link'
  
  const selectedSkills = selectedNames.map(n => availableSkills.find(s => s.name === n)).filter(Boolean) as SkillItem[]
  const cwd = process.cwd(); let agents = detectInstalledAgents(cwd)
  if (options.local) {
    agents = agents.map(a => ({ ...a, skillsDirs: (c?: string) => (typeof a.skillsDirs === 'function' ? a.skillsDirs(c) : []).filter(d => d.includes(c || cwd))}))
      .filter(a => (typeof a.skillsDirs === 'function' ? a.skillsDirs(cwd) : []).length > 0)
  }

  for (const skill of selectedSkills) {
    logger.info(`\n🚀 ${t('installing', {name: skill.name})}`)
    await installFromLocalPath(skill.path, skill.name, options, agents, cwd)
  }
  logger.info(''); logger.success(`✅ ${t('success', {count: selectedSkills.length})}`)
}

async function installFromLocalPath(skillPath: string, skillName: string, options: InstallOptions, installedAgents: any[], cwd: string): Promise<void> {
  const targetPath = getSharedSkillPath(skillName); const sourceIsTarget = path.resolve(skillPath) === path.resolve(targetPath)
  if (fs.existsSync(targetPath) && !sourceIsTarget && options.force) fs.rmSync(targetPath, {recursive: true, force: true})
  if (!sourceIsTarget && (!fs.existsSync(targetPath) || options.force)) {
    if (options.copy) copyDir(skillPath, targetPath)
    else { try { fs.symlinkSync(skillPath, targetPath, 'dir') } catch { copyDir(skillPath, targetPath) } }
  }
  let targets = installedAgents; if (options.agent && options.agent !== 'all') { const a = AGENTS.find(a => a.name === options.agent && a.enabled); if (a) targets = [a] }
  if (targets.length > 0) {
    let count = 0; for (const a of targets) if (createSymlink(skillName, a, cwd, options.copy || a.useCopyInsteadOfSymlink)) count++
    logger.dim(`${skillName} -> ${count} agent(s)`)
  }
}

function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, {recursive: true})
  for (const e of fs.readdirSync(src, {withFileTypes: true})) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const s = path.join(src, e.name); const d = path.join(dest, e.name)
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d)
  }
}
