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
        snapBorder: "#2d2d2d",
        snapLink: "#8b949e",
        bg: "#1c1b20",
        primary: "#ee2529",
        secondary: "#ffcc00",
        accent: "#ffcccc",
        error: "#ff0000",
        success: "#00ff00",
        warning: "#ffff00",
      },
      fontSize: {
        tiny: ["14px", "18px"],
        sm: ["16px", "18px"],
        base: ["20px", "24px"],
        med: ["22px", "26px"],
        lg: ["30px", "34px"],
        huge: ["32px", "36px"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
