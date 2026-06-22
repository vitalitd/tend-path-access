import { createStartHandler } from "@tanstack/start/server";
import { createCloudflareHandler } from "@tanstack/start-cloudflare-adapter";

export default {
  fetch: createCloudflareHandler({
    createStartHandler,
  }),
};
