import './style.css'

// Update version from package.json
if (typeof __APP_VERSION__ !== 'undefined') {
  const versionBadge = document.getElementById('version-badge')
  if (versionBadge) {
    versionBadge.textContent = `v${__APP_VERSION__}`
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
