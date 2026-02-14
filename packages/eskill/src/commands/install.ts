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

/**
 * Execute command with timeout and custom environment
 */
async function execWithTimeout(
  command: string,
  timeout = 120000, // 2 minutes default
  env?: NodeJS.ProcessEnv,
): Promise<{stdout: string; stderr: string}> {
  let timeoutId: NodeJS.Timeout | null = null

  const timeoutPromise = new Promise<{stdout: string; stderr: string}>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Command timeout after ${timeout / 1000}s`))
    }, timeout)
  })

  try {
    const execOptions = env ? {env} : {}
    const result = await Promise.race([execAsync(command, execOptions), timeoutPromise])

    if (timeoutId) clearTimeout(timeoutId)
    return result
  } catch (error: any) {
    if (timeoutId) clearTimeout(timeoutId)
    throw error
  }
}

export interface InstallOptions {
  agent?: string
  link?: boolean
  copy?: boolean
  global?: boolean
  local?: boolean
  all?: boolean
  force?: boolean
  registry?: string
  timeout?: number
}

function shortenPath(p: string): string {
  const home = os.homedir()
  return p.startsWith(home) ? p.replace(home, '~') : p
}

export async function install(skillNameOrPath: string, options: InstallOptions = {}): Promise<void> {
  const isGit = isGitUrl(skillNameOrPath)
  logger.info(`${chalk.cyan('🔍')} ${t('analyzing')} ${chalk.bold(skillNameOrPath)}`)
  ensureSharedDir()

  let skillPath: string
  let skillName: string

  if (isGit) {
    const gitInfo = parseGitUrl(skillNameOrPath)
    if (!gitInfo) {
      logger.error(t('unsupported', {url: skillNameOrPath}))
      process.exit(1)
    }

    const tempDir = path.join('/tmp', `eskill-${Date.now()}`)
    const cloneDir = path.join(tempDir, 'repo')

    try {
      const timeout = options.timeout || 120000
      const spinner = logger.start(t('fetching'))
      fs.mkdirSync(tempDir, {recursive: true})

      const domain = new URL(gitInfo.gitUrl).hostname
      let gitUrl = gitInfo.gitUrl
      const envTokenKey = `ESKILL_TOKEN_${domain.toUpperCase().replace(/\./g, '_')}`
      let token = getToken(domain) || process.env[envTokenKey]
      
      const performClone = async (url: string) => {
        const branchFlag = gitInfo.branch ? `-b ${gitInfo.branch}` : ''
        const cmd = branchFlag ? `git clone ${branchFlag} ${url} ${cloneDir} --depth 1 --quiet` : `git clone ${url} ${cloneDir} --depth 1 --quiet`
        return execWithTimeout(cmd, timeout)
      }

      try {
        let finalUrl = gitUrl
        if (token && gitUrl.startsWith('https://')) {
          spinner.text = t('authenticating', {domain})
          finalUrl = gitUrl.replace('https://', `https://oauth2:${token}@`)
        }
        await performClone(finalUrl)
        spinner.succeed(t('sourceReady'))
      } catch (error: any) {
        const sshUrl = convertToSshUrl(gitUrl)
        if (sshUrl) {
          try {
            spinner.text = 'HTTPS failed, trying SSH...'
            await performClone(sshUrl)
            spinner.succeed(t('sourceReady'))
          } catch (sshError: any) {
            spinner.stop()
            logger.warn(`\n🔒 ${t('authRequired', {domain})}`)
            const prompt = new Password({ message: t('enterToken', {domain}), validate: (v: string) => v.length > 0 })
            const newToken = await prompt.run()
            if (newToken) {
              saveToken(domain, newToken)
              const authedUrl = gitUrl.replace('https://', `https://oauth2:${newToken}@`)
              const finalSpinner = logger.start(t('fetching'))
              await performClone(authedUrl)
              finalSpinner.succeed(t('sourceReady'))
            } else { throw new Error('Auth required') }
          }
        } else { spinner.fail('Clone failed'); throw error }
      }

      const scanDir = gitInfo.path ? path.join(cloneDir, gitInfo.path) : cloneDir
      const availableSkills = scanForSkills(scanDir)
      if (availableSkills.length === 0) { logger.error('No skills found'); process.exit(1) }

      let selectedSkills: SkillItem[] = []
      if (options.all) {
        selectedSkills = availableSkills
      } else if (availableSkills.length > 1) {
        logger.info(`\n📦 ${t('foundSkills', {count: availableSkills.length})}`)
        const prompt = new MultiSelect({
          name: 'value', message: t('selectSkills'),
          choices: availableSkills.map(s => {
            const sn = s.name.substring(0, 20); let sh = (s.description || '').substring(0, 40)
            if (sh) sh = ` - ${sh}`
            return { name: s.name, message: `${sn}${chalk.dim(sh)}`, value: s }
          }),
          indicator(state: any, choice: any) { return choice.enabled ? chalk.cyan('◉') : chalk.gray('◯') },
          result(names: string[]) { return names.map(n => availableSkills.find(s => s.name === n)) }
        })
        selectedSkills = await prompt.run()
      } else { selectedSkills = [availableSkills[0]] }

      if (selectedSkills.length === 0) { logger.warn('No skills selected'); process.exit(0) }

      let isLocal = options.local || false; let isCopy = options.copy || false
      if (!options.global && !options.local) {
        const scopeP = new Select({ name: 'scope', message: t('selectScope'), choices: [{name: 'global', message: t('globalScope')}, {name: 'local', message: t('localScope')}] })
        isLocal = (await scopeP.run()) === 'local'
      }
      if (!options.link && !options.copy) {
        const methodP = new Select({ name: 'method', message: t('selectMethod'), choices: [{name: 'link', message: t('linkMethod')}, {name: 'copy', message: t('copyMethod')}] })
        isCopy = (await methodP.run()) === 'copy'
      }

      options.local = isLocal; options.global = !isLocal; options.link = !isCopy; options.copy = isCopy
      const cwd = process.cwd(); let installedAgents = detectInstalledAgents(cwd)
      if (options.local) {
        installedAgents = installedAgents.map(a => ({ ...a, skillsDirs: (c?: string) => {
          const dirs = typeof a.skillsDirs === 'function' ? a.skillsDirs(c) : (a.skillsDirs || [])
          return dirs.filter(d => d.includes(c || cwd))
        }})).filter(a => (typeof a.skillsDirs === 'function' ? a.skillsDirs(cwd) : []).length > 0)
      }

      if (installedAgents.length === 0) logger.warn(`\n${t('noAgents')}`)
      for (const skill of selectedSkills) {
        if (!skill) continue
        logger.info(`\n🚀 ${t('installing', {name: skill.name})}`)
        await installFromLocalPath(skill.path, skill.name, options, installedAgents, cwd)
      }
      logger.info(''); logger.success(`✅ ${t('success', {count: selectedSkills.length})}`)
      return
    } catch (error: any) { logger.error(`Error: ${error.message}`); process.exit(1) }
  } else if (options.link || fs.existsSync(skillNameOrPath)) {
    const skillPath = path.resolve(skillNameOrPath)
    if (!fs.existsSync(skillPath)) { logger.error(`Path not found: ${skillPath}`); process.exit(1) }
    const availableSkills = scanForSkills(skillPath)
    if (availableSkills.length === 0) { logger.error('No skills found'); process.exit(1) }

    let selectedSkills: SkillItem[] = []
    if (options.all) { selectedSkills = availableSkills } 
    else if (availableSkills.length > 1) {
      logger.info(`\n📦 ${t('foundSkills', {count: availableSkills.length})}`)
      const prompt = new MultiSelect({
        name: 'value', message: t('selectSkills'),
        choices: availableSkills.map(s => {
          const sn = s.name.substring(0, 20); let sh = (s.description || '').substring(0, 40)
          if (sh) sh = ` - ${sh}`
          return { name: s.name, message: `${sn}${chalk.dim(sh)}`, value: s }
        }),
        indicator(state: any, choice: any) { return choice.enabled ? chalk.cyan('◉') : chalk.gray('◯') },
        result(names: string[]) { return names.map(n => availableSkills.find(s => s.name === n)) }
      })
      selectedSkills = await prompt.run()
    } else { selectedSkills = [availableSkills[0]] }

    if (selectedSkills.length === 0) { logger.warn('No skills selected'); process.exit(0) }

    let isLocal = options.local || false; let isCopy = options.copy || false
    if (!options.global && !options.local) {
      const scopeP = new Select({ name: 'scope', message: t('selectScope'), choices: [{name: 'global', message: t('globalScope')}, {name: 'local', message: t('localScope')}] })
      isLocal = (await scopeP.run()) === 'local'
    }
    if (!options.link && !options.copy) {
      const methodP = new Select({ name: 'method', message: t('selectMethod'), choices: [{name: 'link', message: t('linkMethod')}, {name: 'copy', message: t('copyMethod')}] })
      isCopy = (await methodP.run()) === 'copy'
    }

    options.local = isLocal; options.global = !isLocal; options.link = !isCopy; options.copy = isCopy
    const cwd = process.cwd(); let installedAgents = detectInstalledAgents(cwd)
    if (options.local) {
      installedAgents = installedAgents.map(a => ({ ...a, skillsDirs: (c?: string) => {
        const dirs = typeof a.skillsDirs === 'function' ? a.skillsDirs(c) : (a.skillsDirs || [])
        return dirs.filter(d => d.includes(c || cwd))
      }})).filter(a => (typeof a.skillsDirs === 'function' ? a.skillsDirs(cwd) : []).length > 0)
    }

    for (const skill of selectedSkills) {
      if (!skill) continue
      logger.info(`\n🚀 ${t('processing', {name: skill.name})}`)
      await installFromLocalPath(skill.path, skill.name, options, installedAgents, cwd)
    }
    logger.info(''); logger.success(`✅ ${t('success', {count: selectedSkills.length})}`)
  } else {
    // NPM mode remains similarly structured with i18n
    skillName = extractSkillName(skillNameOrPath)
    const tempDir = path.join('/tmp', `eskill-${Date.now()}`)
    try {
      const registry = options.registry || (await getRegistry())
      const timeout = options.timeout || 180000
      const spinner = logger.start(t('installing', {name: skillNameOrPath}))
      fs.mkdirSync(tempDir, {recursive: true})
      const homeDir = os.homedir()
      const npmCacheDir = path.join(homeDir, '.npm')
      const npmConfigPrefix = path.join(homeDir, '.npm-global')
      fs.mkdirSync(npmCacheDir, {recursive: true})
      const installCommand = `npm install ${skillNameOrPath} --prefix ${tempDir} --registry=${registry} --no-save --silent --no-bin-links --prefer-offline`
      const env = { ...process.env, npm_config_cache: npmCacheDir, npm_config_prefix: npmConfigPrefix, npm_config_global: 'false' }
      await execWithTimeout(installCommand, timeout, env)
      spinner.succeed(t('sourceReady'))
      skillPath = path.join(tempDir, 'node_modules', skillNameOrPath)
      const cwd = process.cwd(); let installedAgents = detectInstalledAgents(cwd)
      await installFromLocalPath(skillPath, skillName, options, installedAgents, cwd)
      logger.info(''); logger.success(`✅ ${t('success', {count: 1})}`)
    } catch (error: any) { logger.error(`Download failed: ${error.message}`); process.exit(1) }
  }
}

async function installFromLocalPath(skillPath: string, skillName: string, options: InstallOptions, installedAgents: any[], cwd: string): Promise<void> {
  const targetPath = getSharedSkillPath(skillName)
  const sourceIsTarget = path.resolve(skillPath) === path.resolve(targetPath)
  const alreadyExists = fs.existsSync(targetPath) && !sourceIsTarget
  if (alreadyExists) {
    if (options.force) {
      logger.warn(`Removing existing ${skillName}...`); fs.rmSync(targetPath, {recursive: true, force: true})
    } else { logger.info(`${skillName} exists, updating links...`) }
  }
  if (sourceIsTarget) { logger.info(`${skillName} already in shared dir`) } 
  else if (alreadyExists && !options.force) {} 
  else if (options.copy) { copyDir(skillPath, targetPath); logger.success(`${skillName} copied (full copy)`) } 
  else { fs.symlinkSync(skillPath, targetPath, 'dir'); logger.success(`${skillName} linked (symlink)`) }

  let targetAgents = installedAgents
  if (options.agent && options.agent !== 'all') {
    const agent = AGENTS.find(a => a.name === options.agent && a.enabled)
    if (agent) targetAgents = [agent]
  }
  if (targetAgents.length > 0) {
    let successCount = 0
    for (const agent of targetAgents) {
      const useCopy = options.copy || agent.useCopyInsteadOfSymlink
      if (createSymlink(skillName, agent, cwd, useCopy)) successCount++
    }
    logger.dim(`${skillName} linked to ${successCount} agent(s)`)
  }
}

function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, {recursive: true})
  const entries = fs.readdirSync(src, {withFileTypes: true})
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const srcPath = path.join(src, entry.name); const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(srcPath, destPath); else fs.copyFileSync(srcPath, destPath)
  }
}
