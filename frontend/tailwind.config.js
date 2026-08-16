/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0b1326",
        surface: {
          DEFAULT: "#0b1326",
          low: "#131b2e",
          container: "#171f33",
          high: "#222a3d",
          highest: "#2d3449",
        },
        brand: {
          pink: "#ff3f6c",
          pinkHover: "#e0355c",
          container: "#ff4f74",
        },
        accent: {
          emerald: "#10b981",
          gold: "#fbbf24",
          blue: "#60a5fa",
        },
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      maxWidth: {
        "1440": "1440px",
      },
    },
  },
  plugins: [],
};
