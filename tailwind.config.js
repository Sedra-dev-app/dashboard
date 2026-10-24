/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
        'geist-mono': ['"Geist Mono"', 'monospace'],
      },
      colors: {
        // Surfaces bleu nuit reprises de sedra-dev.com
        ink: {
          950: '#000000',
          900: '#060911',
          850: '#070b14',
          800: '#090d16',
          750: '#0a0e18',
          700: '#0b0f19',
          650: '#0d1324',
          600: '#0f1422',
          500: '#14151f',
        },
      },
      borderRadius: {
        '4xl': '28px',
        '5xl': '32px',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(99,102,241,.45)',
        'glow-emerald': '0 0 12px rgba(34,197,94,.8)',
      },
      keyframes: {
        aurora: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(6%,-4%) scale(1.08)' },
          '66%': { transform: 'translate(-5%,5%) scale(.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        aurora: 'aurora 22s ease-in-out infinite',
        'aurora-slow': 'aurora 32s ease-in-out infinite reverse',
        shimmer: 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
}
