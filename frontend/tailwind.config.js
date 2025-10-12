/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * TailwindCSS Configuration - Dark-Gold Neo-Spiritual Theme
 * 
 * @description Custom theme configuration for SUPERAAI Control System
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark-Gold Neo-Spiritual Theme
        primary: {
          50: '#fef9e7',
          100: '#fdf2c4',
          200: '#fae285',
          300: '#f7cd3e',
          400: '#f4d03f',
          500: '#e5b90b', // Main Gold
          600: '#d4a309',
          700: '#b8900c',
          800: '#966f10',
          900: '#7a5a11',
        },
        dark: {
          50: '#f8f8f8',
          100: '#e5e5e5',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          850: '#1a1a1a', // Secondary Dark
          900: '#0b0b0b', // Main Background
        },
        accent: {
          gold: '#f4d03f',
          amber: '#ffc107',
          bronze: '#cd7f32',
          silver: '#c0c0c0',
        },
        status: {
          online: '#22c55e',
          offline: '#ef4444',
          processing: '#f59e0b',
          standby: '#6366f1',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Orbitron', 'monospace'],
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 0 0 rgba(229, 185, 11, 0.7)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 0 10px rgba(229, 185, 11, 0)' },
        },
        'glow': {
          'from': { textShadow: '0 0 5px #e5b90b, 0 0 10px #e5b90b, 0 0 15px #e5b90b' },
          'to': { textShadow: '0 0 10px #f4d03f, 0 0 20px #f4d03f, 0 0 30px #f4d03f' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(229, 185, 11, 0.4), transparent)',
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(229, 185, 11, 0.39)',
        'gold-lg': '0 10px 25px -3px rgba(229, 185, 11, 0.35), 0 4px 6px -2px rgba(229, 185, 11, 0.05)',
        'dark': '0 4px 14px 0 rgba(0, 0, 0, 0.39)',
        'inner-gold': 'inset 0 2px 4px 0 rgba(229, 185, 11, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}