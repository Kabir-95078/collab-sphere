/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: '#22040e',   // Darker background
          base: '#5A0E24',   // Main Burgundy
          plum: '#7D1B3A',   // Deep Plum
          pink: '#C41E5D',   // Vibrant Pink
          blue: '#69B3D8',   // Sky Blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}