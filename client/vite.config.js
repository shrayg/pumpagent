import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import rollupNodePolyFill from "rollup-plugin-polyfill-node";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({
      algorithm: "brotliCompress",
    }),
    visualizer({
      open: false, // Opens report in browser automatically
      gzipSize: true,
      brotliSize: true,
      filename: "stats.html",
    }),
  ],
  resolve: {
    alias: {
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["buffer"],
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
  assetsInclude: ["**/*.zip"],
});
