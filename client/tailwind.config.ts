import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#FFFFFF", // page background (was near-black, now white)
        panel: "#F5F2EC", // card / panel background — warm off-white
        line: "#E2DDD1", // hairline borders — soft warm gray
        paper: "#1C1B18", // primary text (was off-white, now near-black ink)
        muted: "#6B6862", // secondary text
        brass: "#A9772E", // primary accent — darkened for contrast on white
        teal: "#3D6E60", // status / success accent — darkened
        rust: "#A03F2C", // error / destructive — darkened
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
