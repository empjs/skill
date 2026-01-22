import './style.css'

// Update version from package.json
if (typeof __APP_VERSION__ !== 'undefined') {
  const versionBadge = document.getElementById('version-badge')
  if (versionBadge) {
    versionBadge.textContent = `v${__APP_VERSION__}`
  }
}

// Install method commands
const installCommands = {
  pnpm: 'pnpm add -g @nova/skill --registry=http://npm.ppx520.com/',
  npm: 'npm install -g @nova/skill --registry=http://npm.ppx520.com/',
  yarn: 'yarn global add @nova/skill --registry=http://npm.ppx520.com/'
}

// Switch install method
window.switchInstallMethod = function(method) {
  // Update tabs
  document.querySelectorAll('.install-tab').forEach(tab => {
    tab.classList.remove('active', 'bg-blue-500/20', 'text-blue-400')
    tab.classList.add('text-slate-400', 'hover:text-white')
  })
  const activeTab = document.getElementById(`tab-${method}`)
  if (activeTab) {
    activeTab.classList.add('active', 'bg-blue-500/20', 'text-blue-400')
    activeTab.classList.remove('text-slate-400', 'hover:text-white')
  }
  
  // Update command
  const commandElement = document.getElementById('install-command')
  if (commandElement) {
    commandElement.textContent = `$ ${installCommands[method]}`
  }
}

// Copy install command
window.copyInstallCommand = function() {
  const activeTab = document.querySelector('.install-tab.active')
  const method = activeTab ? activeTab.id.replace('tab-', '') : 'pnpm'
  const command = installCommands[method] || installCommands.pnpm
  const button = document.querySelector('.copy-btn')
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(command).then(() => {
      const originalHTML = button.innerHTML
      button.innerHTML = '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
      button.title = '已复制！'
      
      setTimeout(() => {
        button.innerHTML = originalHTML
        button.title = '复制命令'
      }, 2000)
    }).catch(err => {
      console.error('Failed to copy:', err)
      fallbackCopy(command, button)
    })
  } else {
    fallbackCopy(command, button)
  }
}

// Copy command function
window.copyCommand = function(button, text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      // Show success icon
      const originalHTML = button.innerHTML
      button.innerHTML = '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
      button.title = '已复制！'
      
      // Restore original icon after 2 seconds
      setTimeout(() => {
        button.innerHTML = originalHTML
        button.title = '复制命令'
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
      button.innerHTML = '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
      button.title = '已复制！'
      
      setTimeout(() => {
        button.innerHTML = originalHTML
        button.title = '复制命令'
      }, 2000)
    }
  } catch (err) {
    console.error('Fallback copy failed:', err)
    alert('复制失败，请手动复制：' + text)
  } finally {
    document.body.removeChild(textArea)
  }
}
