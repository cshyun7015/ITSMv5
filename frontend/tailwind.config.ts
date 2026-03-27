/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1e1e1e',
        border: '#333333',
        primary: {
          light: '#4dabf7',
          DEFAULT: '#339af0',
          dark: '#1c7ed6',
        },
        success: {
          light: '#69db7c',
          DEFAULT: '#51cf66',
          dark: '#37b24d',
        },
        danger: {
          light: '#ff8787',
          DEFAULT: '#ff6b6b',
          dark: '#f03e3e',
        },
        warning: {
          light: '#ffd43b',
          DEFAULT: '#fcc419',
          dark: '#f59f00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px rgba(0,0,0,0.5)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
