import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#0e0f14",
          75: "#14151b",
          50: "#202127",
        },
        secondary: {
          100: "#969faf",
          75: "#75798a",
          50: "#f4f4f6",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
