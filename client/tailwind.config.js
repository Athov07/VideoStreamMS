/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0F0F0F", 
          secondary: "#272727",
          accent: "#3F3F3F",
        },
        primary: {
          DEFAULT: "#FF0000",
          dark: "#CC0000",
        },
        surface: {
          DEFAULT: "#1F1F1F",
          text: "#F1F1F1",
          muted: "#AAAAAA",
        }
      },
    },
  },
  plugins: [],
}