/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#090d16',
        onyx: '#0b101b',
        glassDark: 'rgba(15, 23, 42, 0.65)',
        glassLight: 'rgba(255, 255, 255, 0.75)',
        neonCyan: '#06b6d4',
        neonViolet: '#8b5cf6',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'neon-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.45)',
        'neon-violet': '0 0 30px -5px rgba(139, 92, 246, 0.45)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glow-violet': '0 0 25px rgba(139, 92, 246, 0.35)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 30px -5px rgba(6, 182, 212, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'gradient-shine': 'gradient-shine 6s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        'gradient-shine': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}

