import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0A0A0C",
        "surface-raised": "#121217",
        sony: {
          blue: "#0050FF",
          cyan: "#00D6FF",
          glow: "rgba(0, 80, 255, 0.15)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: ['"SF Mono"', "Menlo", "Monaco", "Consolas", "monospace"],
      },
      backgroundImage: {
        "sony-gradient": "linear-gradient(135deg, #0050FF 0%, #00D6FF 100%)",
        "radial-hero":
          "radial-gradient(circle at 50% 50%, rgba(0, 80, 255, 0.08) 0%, rgba(5, 5, 5, 0) 70%)",
        "card-glass":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
