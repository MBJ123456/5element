import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        "ink-soft": "#4b5563",
        "ink-light": "#9ca3af",
        jade: "#8dd3c7",
        "jade-soft": "#c4f1e0",
        paper: "#f9fafb"
      },
      boxShadow: {
        card: "0 18px 45px rgba(15,23,42,0.12)"
      },
      borderRadius: {
        card: "24px"
      }
    }
  },
  plugins: []
};

export default config;


