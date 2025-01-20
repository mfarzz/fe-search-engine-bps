/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],  // Menambahkan Poppins sebagai font default
      },
      colors: {
        'blue-premier': '#00255C',
        'green': '#5DAB2C',
        'blue-sky' : '#0093DD',
        'oren' : '#EBA500'
      },
    },
  },
  plugins: [ ],
};