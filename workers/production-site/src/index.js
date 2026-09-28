export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      const capability = await env.CAPABILITIES.health();
      return Response.json({ worker: "production-site", role: "public-product-surface", status: "ok", dependencies: { internal_capability: capability } });
    }
    return env.ASSETS.fetch(request);
  }
};