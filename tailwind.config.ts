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
        nexa: {
          red: "#E53935",
          dark: "#0F172A",
          gold: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};

export default config;
