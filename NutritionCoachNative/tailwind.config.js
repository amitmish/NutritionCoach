/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#ededed',
        card: '#171717',
        primary: '#10b981',
        secondary: '#262626',
        border: '#262626',
        muted: '#a3a3a3',
      }
    },
  },
  plugins: [],
}
