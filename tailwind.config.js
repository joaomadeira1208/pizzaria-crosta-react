/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pizza-red': {
          50: '#FFF5F5',
          100: '#FFE0E0',
          200: '#FFC2C2',
          300: '#FF9B9B',
          400: '#FF6B6B',
          500: '#FF3B3B',
          600: '#FF0000',
          700: '#D00000',
          800: '#A60000',
          900: '#750000',
        },
        'pizza-orange': {
          50: '#FFF9F0',
          100: '#FFEFD8',
          200: '#FFD8A8',
          300: '#FFC078',
          400: '#FFA94D',
          500: '#FF922B',
          600: '#FD7E14',
          700: '#F76707',
          800: '#E8590C',
          900: '#D9480F',
        },
        'pizza-brown': {
          50: '#FAF6F1',
          100: '#F0E9DB',
          200: '#E1D1B7',
          300: '#D1B68E',
          400: '#C09A65',
          500: '#B08048',
          600: '#96682D',
          700: '#7D5425',
          800: '#63421D',
          900: '#4A3116',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'pizza': '0 4px 14px 0 rgba(213, 64, 0, 0.25)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};