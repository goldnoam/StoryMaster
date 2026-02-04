
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./i18n.ts",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Heebo', 'Noto Sans SC', 'Noto Sans Devanagari', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
