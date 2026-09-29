const topologyReasoning = {
  contract: "topology-reasoning-v1",
  mode: "observe-route-compare-propose",
  promotion_authority: false,
  questions: ["can_handoff_be_removed","is_transport_fit","is_environment_fit","is_recovery_better","observed_vs_inferred"]
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      const capability = await env.CAPABILITIES.health();
      return Response.json({ worker: "coordinator", role: "route-and-recovery", status: "ok", dependencies: { internal_capability: capability }, reasoning: topologyReasoning });
    }
    if (url.pathname === "/reasoning") return Response.json({ worker: "coordinator", reasoning: topologyReasoning });
    return Response.json({ worker: "coordinator", role: "route-and-recovery", status: "ready", authority: "route-within-caller-ceiling", reasoning: topologyReasoning });
  }
};
