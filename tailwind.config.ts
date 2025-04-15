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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primaryCN: {
          DEFAULT: "#566df2",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      zIndex: {
        dialog: "1001",
        select: "1050",
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
