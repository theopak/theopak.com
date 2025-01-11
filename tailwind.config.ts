import type { Config } from "tailwindcss";
// import { BerkeleyMono } from "./app/layout.tsx";

const tailwindConfig: Config = {
  // corePlugins: {
  //   preflight: false,
  // },
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        mono: ["var(--font-BerkeleyMono)"],
        // mono: [`var(${BerkeleyMono.variable})`],
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
