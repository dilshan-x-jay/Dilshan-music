/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sp-dark-bg': '#121212',
        'sp-med-bg': '#181818',
        'sp-light-bg': '#282828',
        'sp-primary': '#1ED760',
        'sp-secondary': '#1DB954',
        'sp-white': '#FFFFFF',
        'sp-gray': '#B3B3B3',
        'sp-light-gray': '#535353',
        'sp-pink': '#F43F5E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'marquee': 'marquee 10s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}