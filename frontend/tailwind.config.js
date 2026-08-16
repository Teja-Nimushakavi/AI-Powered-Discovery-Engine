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
        porcelain: "#f1f5f9",
        surface: {
          DEFAULT: "#ffffff",
          low: "#f8fafc",
          container: "#ffffff",
          high: "#e2e8f0",
        },
        brand: {
          pink: "#ff3f6c",
          pinkHover: "#e0355c",
          container: "#fff1f3",
        },
        accent: {
          emerald: "#10b981",
          gold: "#f59e0b",
          blue: "#3b82f6",
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
