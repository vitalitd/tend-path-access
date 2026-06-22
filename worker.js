import handler from "./dist/server/server.js"

export default {
  async fetch(request, env, ctx) {
    return handler.fetch
      ? handler.fetch(request, env, ctx)
      : handler(request, env, ctx)
  }
}
