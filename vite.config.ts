import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstack: {
    start: true,
    cloudflare: true,
  },

  vite: {
    build: {
      target: "esnext",
      outDir: "dist",
    },
    ssr: {
      external: ["@cloudflare/workers-types"],
    },
    define: {
      "process.env.TSS_PRERENDERING": JSON.stringify("false"),
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
    },
  },
});
