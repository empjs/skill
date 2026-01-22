/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1E293B',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F1F5F9',
        // CLI colors matching chalk/vscode theme
        'cli-green': '#4EC9B0',
        'cli-blue': '#569CD6',
        'cli-yellow': '#DCDCAA',
        'cli-red': '#F48771',
        'cli-gray': '#858585',
        'cli-white': '#E5E5E5',
        'cli-cyan': '#4EC9B0',
        'cli-purple': '#C586C0',
      },
      fontFamily: {
        sans: ['"JetBrains Mono"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
