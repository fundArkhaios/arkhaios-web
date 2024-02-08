/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  fontFamily: {
    josefin: ['Josefin Sans', 'sans-serif'],
  },
  plugins: [require('daisyui')],
}

