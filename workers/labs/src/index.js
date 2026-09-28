function makeTick(controller) {
  return {
    event: "chain.tick",
    source: "lab",
    scheduled_time: new Date(controller.scheduledTime).toISOString(),
    cron: controller.cron,
    authority: ["schedule", "emit-heartbeat"],
    denied: ["promote", "production-mutation", "authority-expansion"]
  };
}

async function runScheduledTick(controller) {
  const tick = makeTick(controller);
  console.log(JSON.stringify(tick));
  return tick;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return Response.json({
        worker: "lab",
        role: "lab-host",
        scheduler: "configured",
        status: "ok"
      });
    }
    return Response.json({
      worker: "lab",
      role: "lab-host",
      status: "ready",
      authority: "experimental-only",
      scheduler: "chain-heartbeat"
    });
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(runScheduledTick(controller));
  }
};
