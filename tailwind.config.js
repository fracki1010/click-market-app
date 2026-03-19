import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#fdfdfd",
            foreground: "#1e293b",
            primary: {
              DEFAULT: "#1e3a8a", // Azul Marino del logo
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#b08d48", // Dorado/Ocre del logo
              foreground: "#ffffff",
            },
            content1: "#ffffff",
          },
        },
        dark: {
          colors: {
            background: "#0d1117", // Azul medianoche muy oscuro
            foreground: "#f0f6fc",
            primary: {
              DEFAULT: "#c4a75b", // Dorado del logo (brillante)
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#1a4d8c", // Azul marino del logo
              foreground: "#ffffff",
            },
            content1: "#161b22", // Fondo de tarjetas (azul oscuro)
          },
        },
      },
    }),
  ],
};
