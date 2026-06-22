import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { startVitePlugin } from "@tanstack/start-vite-plugin";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    startVitePlugin({
      ssr: {
        target: "cloudflare"
      }
    })
  ],
  ssr: {
    target: "webworker",
    noExternal: true
  },
  build: {
    target: "esnext",
    outDir: "dist"
  }
});
