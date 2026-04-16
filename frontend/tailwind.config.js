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
          DEFAULT: '#a855f7',
          glow: 'rgba(168, 85, 247, 0.4)',
        },
        secondary: {
          DEFAULT: '#0ea5e9',
          glow: 'rgba(14, 165, 233, 0.4)',
        },
        dark: {
          DEFAULT: '#050505',
          card: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          glass: 'rgba(15, 15, 25, 0.7)',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
