import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": "/src",
      "@contexts": "/src/contexts",
      "@components": "/src/components",
      "@assets": "/src/assets",
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://62.72.1.123:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
