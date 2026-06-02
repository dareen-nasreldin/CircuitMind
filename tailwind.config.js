/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':    '#0a0f1e',
        'bg-surface':    '#111827',
        'bg-elevated':   '#1a2235',
        'accent-cyan':   '#00d4ff',
        'accent-green':  '#00ff88',
        'accent-red':    '#ff4466',
        'accent-yellow': '#ffaa00',
        'text-primary':  '#e2e8f0',
        'text-muted':    '#64748b',
        'border-dim':    '#1e293b',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-cyan': `
          linear-gradient(rgba(0, 212, 255, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
    },
  },
  plugins: [],
}
