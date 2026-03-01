import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Optimize build for production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
    },
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Split dependencies into separate chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          "query-vendor": ["@tanstack/react-query", "axios"],
          "animation": ["@react-spring/web"],
          "3d": ["@react-three/fiber", "@react-three/drei", "three"],
        },
      },
    },
    // Increase chunk size threshold
    chunkSizeWarningLimit: 500,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
