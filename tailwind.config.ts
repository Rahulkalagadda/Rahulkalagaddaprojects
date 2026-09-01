import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          subtle: "var(--surface-subtle)",
          elevated: "var(--surface-elevated)",
          hover: "var(--surface-hover)",
        },
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          dark: "var(--muted-dark)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          hover: "var(--amber-hover)",
          dim: "var(--amber-dim)",
          subtle: "var(--amber-subtle)",
          glow: "var(--amber-glow)",
        },
        hairline: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
          active: "var(--amber)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
