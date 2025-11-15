/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        'background-secondary': 'rgb(var(--color-background-secondary) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        'card-hover': 'rgb(var(--color-card-hover) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-dark) / <alpha-value>)',
        },
        danger: '#F44336',
        success: '#4CAF50',
        warning: '#FFC107',
        secondary: '#6B7280',
        light: {
          DEFAULT: '#F5F5F5',
          blue: '#E8F1F9',
        },
        'light-blue': '#E8F1F9'
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: 'var(--shadow)',
        'card-hover': 'var(--shadow-lg)',
      },
      animation: {
        scanning: 'scanning 3s ease-in-out',
      },
      keyframes: {
        scanning: {
          '0%': { width: '0%' },
          '50%': { width: '70%' },
          '90%': { width: '90%' },
          '100%': { width: '100%' },
        },
      },
      zIndex: {
        '5': '5',
      },
    },
  },
  plugins: [],
};