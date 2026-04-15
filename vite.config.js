import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BACKEND_URL = "https://auticare-production.up.railway.app";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // All /api/* requests are forwarded to Railway - avoids CORS entirely
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.error("[proxy] error:", err.message);
          });
          proxy.on("proxyReq", (_proxyReq, req) => {
            console.log("[proxy] →", req.method, req.url);
          });
        },
      },
    },
  },
});
