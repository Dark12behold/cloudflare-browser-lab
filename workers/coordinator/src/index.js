export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      const capability = await env.CAPABILITIES.health();
      return Response.json({ worker: "coordinator", role: "route-and-recovery", status: "ok", dependencies: { internal_capability: capability } });
    }
    return Response.json({ worker: "coordinator", role: "route-and-recovery", status: "ready", authority: "route-within-caller-ceiling" });
  }
};