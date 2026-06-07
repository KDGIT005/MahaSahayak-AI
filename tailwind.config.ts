import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        navy: {
          DEFAULT: '#1E3A5F',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A5F',
          950: '#0F1E33',
        },
        gold: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        cream: '#FFFBF5',
        emergency: '#DC2626',
        safe: '#16A34A',
        warning: '#D97706',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-red': 'pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'count-up': 'count-up 1s ease-out forwards',
        'slide-in': 'slide-in 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(220, 38, 38, 0)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(245, 158, 11, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'saffron-gradient': 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #1E3A5F 100%)',
        'navy-gradient': 'linear-gradient(135deg, #1E3A5F 0%, #0F1E33 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FFFBF5 0%, #FFF7ED 100%)',
        'emergency-gradient': 'linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(30, 58, 95, 0.08)',
        'card-hover': '0 8px 32px rgba(30, 58, 95, 0.16)',
        'saffron': '0 4px 24px rgba(249, 115, 22, 0.3)',
        'emergency': '0 4px 24px rgba(220, 38, 38, 0.4)',
        'gold': '0 4px 24px rgba(245, 158, 11, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
