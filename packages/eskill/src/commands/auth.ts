import { logger } from '../utils/logger.js'
import { saveToken, loadConfig } from '../utils/config.js'
// @ts-ignore
import enquirer from 'enquirer'
const { Input, Password } = enquirer

export async function auth(domain?: string, options: { token?: string, list?: boolean, remove?: string } = {}) {
  if (options.list) {
    const config = loadConfig()
    if (Object.keys(config.tokens).length === 0) {
      logger.info('No tokens configured.')
      return
    }
    logger.info('\n🔐 Configured Tokens:')
    for (const [dom, token] of Object.entries(config.tokens)) {
      const masked = token.substring(0, 4) + '*'.repeat(token.length - 8) + token.substring(token.length - 4)
      logger.info(`  - ${dom}: ${masked}`)
    }
    return
  }

  if (options.remove) {
    const config = loadConfig()
    if (config.tokens[options.remove]) {
      delete config.tokens[options.remove]
      saveToken(options.remove, '') // This is a bit hacky with current saveToken, but it works
      logger.success(`Removed token for ${options.remove}`)
    } else {
      logger.error(`No token found for ${options.remove}`)
    }
    return
  }

  let targetDomain = domain
  let targetToken = options.token

  if (!targetDomain) {
    const prompt = new Input({
      message: 'Enter the domain (e.g., git.internal.corp):',
      validate: (value: string) => value.length > 0
    })
    targetDomain = await prompt.run()
  }

  if (!targetToken) {
    const prompt = new Password({
      message: `Enter Access Token for ${targetDomain}:`,
      validate: (value: string) => value.length > 0
    })
    targetToken = await prompt.run()
  }

  if (targetDomain && targetToken) {
    saveToken(targetDomain, targetToken)
    logger.success(`Token saved for ${targetDomain}`)
  }
}
