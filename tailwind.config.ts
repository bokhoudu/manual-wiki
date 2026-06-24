import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        wiki: {
          blue: "#2563eb",
          ink: "#162033",
          line: "#dbe4f0",
          soft: "#f6f9fc"
        }
      },
      boxShadow: {
        wiki: "0 10px 30px rgba(22, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
