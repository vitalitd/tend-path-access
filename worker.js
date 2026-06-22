import * as server from "./dist/server/server.js"

export default {
  async fetch(request, env, ctx) {
    // TanStack Start SSR exports a default handler function
    if (typeof server.default === "function") {
      return server.default(request, env, ctx)
    }

    // Or it may export a fetch function
    if (typeof server.fetch === "function") {
      return server.fetch(request, env, ctx)
    }

    return new Response("No valid handler found in server.js", { status: 500 })
  }
}
