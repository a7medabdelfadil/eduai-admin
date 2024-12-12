import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "var(--primary)",
        secondary: "#526484",
        bgPrimary: "var(--bg-primary)",
        chat: "var(--chat)",
        bgSecondary: "var(--bg-secondary)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        warning: "var(--warning)",
        error: "var(--error)",
        success: "var(--success)",
        info: "var(--info)",
        borderPrimary: "var(--border-primary)",
        hover: "#4a5cc5",
        thead: "var(--thead)",
        blackOrWhite: "var(--black-or-white)",
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
  darkMode: 'class',
};

export default config;
