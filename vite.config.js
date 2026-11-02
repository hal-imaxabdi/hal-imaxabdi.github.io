import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// HeroScene is lazy-loaded, so three.js lands in its own chunk and the page text paints first.
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: { chunkSizeWarningLimit: 1400 },
});
