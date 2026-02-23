/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Atkinson Hyperlegible", "ui-sans-serif", "system-ui", "sans-serif"],
        dyslexic: ["OpenDyslexic", "Atkinson Hyperlegible", "sans-serif"],
      },
      colors: {
        readable: {
          bg: "#d9dbff",
          card: "#ffffff",
          accent: "#594491",
          ink: "#132525",
        },
      },
    },
  },
  plugins: [],
};

