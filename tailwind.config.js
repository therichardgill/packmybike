/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ebfbe4',
          100: '#d3f7c6',
          200: '#a8ed8b',
          300: '#70db47',
          400: '#4dc520',
          500: '#38B000', // Main brand color
          600: '#2d8c00',
          700: '#236b00',
          800: '#1b5200',
          900: '#153f00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};