import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skytoy: "#42B5F5",
        coral: "#FF6B6B",
        banana: "#FFD166",
        leaf: "#7BD88F",
        ink: "#213547",
        cloud: "#FFF8EC"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(33, 53, 71, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
