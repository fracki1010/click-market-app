import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
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
            background: "#f9fafb", // gray-50
            foreground: "#1f2937", // gray-800
            primary: {
              DEFAULT: "#4f46e5", // indigo-600
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#d97706", // amber-600
              foreground: "#000000",
            },
            // Color de fondo para las tarjetas (bg-white)
            content1: "#ffffff",
          },
        },
        dark: {
          colors: {
            background: "#171717", // neutral-900
            foreground: "#f3f4f6", // gray-100
            primary: {
              DEFAULT: "#6366f1", // indigo-500
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#f59e0b", // amber-500
              foreground: "#000000",
            },
            // Color de fondo para las tarjetas (neutral-800)
            content1: "#262626",
          },
        },
      },
    }),
  ],
}