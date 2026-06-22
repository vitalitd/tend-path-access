import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstack: {
    start: true,
    cloudflare: true
  },
  vite: {
    build: {
      target: "esnext",
      outDir: "dist"
    },
    ssr: {
      external: ["@cloudflare/workers-types"]
    }
  }
});
