import { defineConfig } from "vite";

export default defineConfig({
  root: "public", // This is where index.html lives
  build: {
    outDir: "../dist", // Build output folder
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
});
