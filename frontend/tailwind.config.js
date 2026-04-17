/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,成果}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#bef264', // Electric Lime
        secondary: '#fbbf24', // Amber/Yellow accent
        accent: '#2dd4bf', // Teal for micro-accents
        surface: '#080808', // Deep Charcoal
        card: '#0c0c0c', // Slightly lighter for glass
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
