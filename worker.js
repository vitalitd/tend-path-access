import * as server from "./dist/server/server.js"

export default {
  async fetch(request, env, ctx) {
    // 1. If the bundle exports a default function
    if (typeof server.default === "function") {
      return server.default(request, env, ctx)
    }

    // 2. If the bundle exports a named "handleRequest"
    if (typeof server.handleRequest === "function") {
      return server.handleRequest(request, env, ctx)
    }

    // 3. If the bundle exports a named "fetch"
    if (typeof server.fetch === "function") {
      return server.fetch(request, env, ctx)
    }

    // 4. If the bundle exports ANY function, use the first one
    for (const key of Object.keys(server)) {
      if (typeof server[key] === "function") {
        return server[key](request, env, ctx)
      }
    }

    return new Response(
      "No valid handler found in dist/server/server.js",
      { status: 500 }
    )
  }
}
