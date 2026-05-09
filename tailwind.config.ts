import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        mono:    ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
      colors: {
        arc:  { DEFAULT: '#00ffa3', dim: '#00ffa340', glow: '#00ffa315', dark: '#00ffa308' },
        warn: { DEFAULT: '#ffaa00', dim: '#ffaa0030' },
        danger: { DEFAULT: '#ff4466', dim: '#ff446620' },
        panel: {
          900: '#03080d',
          800: '#060e15',
          700: '#0a1520',
          600: '#0e1d2c',
          500: '#132438',
          400: '#1a3049',
        },
      },
      animation: {
        'scan':      'scan 4s linear infinite',
        'blink':     'blink 1s step-end infinite',
        'flow-x':    'flowX 2s linear infinite',
        'float':     'float 6s ease-in-out infinite',
        'pulse-arc': 'pulseArc 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        scan:     { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
        blink:    { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        flowX:    { '0%': { backgroundPosition: '0% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseArc: { '0%,100%': { boxShadow: '0 0 0 0 #00ffa340' }, '50%': { boxShadow: '0 0 0 8px #00ffa300' } },
      },
      boxShadow: {
        'arc':    '0 0 20px #00ffa330, 0 0 60px #00ffa310',
        'arc-sm': '0 0 10px #00ffa325',
        'panel':  'inset 0 1px 0 #ffffff08, 0 4px 24px #00000060',
      },
    },
  },
  plugins: [],
}
export default config
