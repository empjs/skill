import './style.css'

// Initialize i18n
if (window.i18n) {
  window.i18n.initI18n()
}

// Update version from package.json
if (typeof __APP_VERSION__ !== 'undefined') {
  const versionBadge = document.getElementById('version-badge')
  if (versionBadge) {
    versionBadge.textContent = `v${__APP_VERSION__}`
  }
}

// Install method commands
const installCommands = {
  pnpm: 'pnpm add -g @empjs/skill',
  npm: 'npm install -g @empjs/skill',
  yarn: 'yarn global add @empjs/skill',
  bun: 'bun install -g @empjs/skill'
}

// Switch install method
window.switchInstallMethod = function(method) {
  // Update tabs
  document.querySelectorAll('.install-tab').forEach(tab => {
    tab.classList.remove('active')
  })
  const activeTab = document.getElementById(`tab-${method}`)
  if (activeTab) {
    activeTab.classList.add('active')
  }
  
  // Update command
  const commandElement = document.getElementById('install-command')
  const displayElement = document.getElementById('install-command-display')
  const command = installCommands[method] || installCommands.pnpm
  
  if (commandElement) {
    commandElement.textContent = `$ ${command}`
  }
  if (displayElement) {
    displayElement.textContent = command
  }
}

// Copy install command
window.copyInstallCommand = function() {
  const activeTab = document.querySelector('.install-tab.active')
  const method = activeTab ? activeTab.id.replace('tab-', '') : 'pnpm'
  const command = installCommands[method] || installCommands.pnpm
  const fullCommand = `$ ${command}`
  const button = document.querySelector('.copy-btn')
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullCommand).then(() => {
      const originalHTML = button.innerHTML
      const lang = window.i18n ? window.i18n.getCurrentLanguage() : 'en'
      const copiedText = lang === 'zh' ? '已复制！' : 'Copied!'
      button.innerHTML = '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
      button.title = copiedText
      
      setTimeout(() => {
        button.innerHTML = originalHTML
        const copyText = lang === 'zh' ? '复制命令' : 'Copy'
        button.title = copyText
      }, 2000)
    }).catch(err => {
      console.error('Failed to copy:', err)
      fallbackCopy(fullCommand, button)
    })
  } else {
    fallbackCopy(fullCommand, button)
  }
}

// Copy command function
window.copyCommand = function(button, text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      // Show success icon
      const originalHTML = button.innerHTML
      const lang = window.i18n ? window.i18n.getCurrentLanguage() : 'en'
      const copiedText = lang === 'zh' ? '已复制！' : 'Copied!'
      button.innerHTML = '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
      button.title = copiedText
      
      // Restore original icon after 2 seconds
      setTimeout(() => {
        button.innerHTML = originalHTML
        const copyText = lang === 'zh' ? '复制命令' : 'Copy'
        button.title = copyText
      }, 2000)
    }).catch(err => {
      console.error('Failed to copy:', err)
      // Fallback for older browsers
      fallbackCopy(text, button)
    })
  } else {
    // Fallback for browsers without clipboard API
    fallbackCopy(text, button)
  }
}

// Fallback copy method for older browsers
function fallbackCopy(text, button) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    const successful = document.execCommand('copy')
    if (successful) {
      const originalHTML = button.innerHTML
      const lang = window.i18n ? window.i18n.getCurrentLanguage() : 'en'
      const copiedText = lang === 'zh' ? '已复制！' : 'Copied!'
      button.innerHTML = '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
      button.title = copiedText
      
      setTimeout(() => {
        button.innerHTML = originalHTML
        const copyText = lang === 'zh' ? '复制命令' : 'Copy'
        button.title = copyText
      }, 2000)
    }
  } catch (err) {
    console.error('Fallback copy failed:', err)
    alert('复制失败，请手动复制：' + text)
  } finally {
    document.body.removeChild(textArea)
  }
}
