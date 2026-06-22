import { defineAppConfig } from "@tanstack/start";

export default defineAppConfig({
  vite: {
    ssr: {
      target: "webworker"
    }
  }
});
