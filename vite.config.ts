import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the same build works locally and on GitHub project pages.
export default defineConfig({
  plugins: [react()],
  base: "./"
});
