import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "public",  
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "public/index.html"),
        signup: resolve(__dirname, "public/signup.html"),
        login: resolve(__dirname, "public/login.html"),
        patient: resolve(__dirname, "public/patient.html"),
        admin: resolve(__dirname, "public/admin.html"),
        staff: resolve(__dirname, "public/staff.html"),
      },
    },
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    open: "/index.html",
  },
});