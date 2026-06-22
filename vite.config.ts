import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  ssr: {
    target: "webworker",
    noExternal: true
  },
  build: {
    target: "esnext",
    outDir: "dist"
  }
});
