import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "480px",
      sm: "660px",
      md: "840px",
      lg: "1024px",
    },
    extend: {
      borderWidth: {
        1.5: "1.5px",
      },
    },
  },
} satisfies Config;
