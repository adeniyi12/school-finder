import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eafdf2",
          100: "#d5fce5",
          200: "#aaf7c8",
          300: "#80f2ab",
          400: "#55ed8f",
          500: "#31EE88",
          600: "#012233",
          700: "#011b29",
          800: "#01141f",
          900: "#000d14",
        },
      },
      fontFamily: {
        sans: ["Raleway", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
