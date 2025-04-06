import type { Config } from "tailwindcss";
import { CSSRuleObject } from "tailwindcss/types/config";

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
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
      },
      colors: {
        primary: "var(--primary)",
        secondary: "#526484",
        bgPrimary: "var(--bg-primary)",
        bgSecondary: "var(--bg-secondary)",
        bgRowTable: "var(--bg-row-table)",
        chat: "var(--chat)",
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
    require("tailwindcss-animate"),
      function ({ addBase }: { addBase: (base: CSSRuleObject | CSSRuleObject[]) => void }) {
        addBase({
          '::-webkit-scrollbar': {
            width: '5px',
            height: '5px',
          },
          '::-webkit-scrollbar-track': {
            background: '#F0EFF2',
          },
          '::-webkit-scrollbar-thumb': {
            background: '#4a5cc5',
            "border-radius": "5px",
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: '#3b2b70',
          },
        });
      },
  ],
  darkMode: 'class',
};

export default config;
