import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/")
          ) {
            return "vendor-react";
          }

          if (
            id.includes("/node_modules/react-router/") ||
            id.includes("/node_modules/react-router-dom/")
          ) {
            return "vendor-router";
          }

          if (
            id.includes("/node_modules/@reduxjs/") ||
            id.includes("/node_modules/react-redux/") ||
            id.includes("/node_modules/redux/")
          ) {
            return "vendor-state";
          }

          if (
            id.includes("/node_modules/@react-aria/") ||
            id.includes("/node_modules/@react-stately/") ||
            id.includes("/node_modules/@react-types/") ||
            id.includes("/node_modules/@internationalized/")
          ) {
            return "vendor-ui-aria";
          }

          if (id.includes("/node_modules/@heroui/")) {
            return "vendor-ui-heroui";
          }

          if (
            id.includes("/node_modules/framer-motion/") ||
            id.includes("/node_modules/motion-dom/") ||
            id.includes("/node_modules/motion-utils/") ||
            id.includes("/node_modules/animate.css/")
          ) {
            return "vendor-motion";
          }

          if (
            id.includes("/node_modules/recharts/") ||
            id.includes("/node_modules/d3-")
          ) {
            return "vendor-charts";
          }

          if (id.includes("/node_modules/firebase/")) {
            return "vendor-firebase";
          }

          if (id.includes("/node_modules/react-icons/")) {
            return "vendor-icons";
          }
        },
      },
    },
  },
});
