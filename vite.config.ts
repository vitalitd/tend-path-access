import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstack: {
    start: true,
    cloudflare: {
      enabled: true
    },
    nitro: {
      preset: "cloudflare"
    }
  },
  vite: {
    ssr: {
      target: "webworker",
      noExternal: true
    },
    build: {
      target: "esnext",
      outDir: "dist"
    }
  }
});
