/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#bef264', // Electric Lime
        secondary: '#fbbf24', // Amber/Yellow accent
        accent: '#2dd4bf', // Teal for micro-accents
        surface: '#080808', // Deep Charcoal
        card: '#0c0c0c', // Slightly lighter for glass
        slate: {
          900: '#1e293b',
          800: '#64748b', // Boosted from original 800 for global readability
          700: '#94a3b8', // Boosted from original 700 for global readability
          600: '#cbd5e1', // Boosted from original 600 for global readability
          500: '#e2e8f0', // Boosted from original 500 for global readability
        }
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
