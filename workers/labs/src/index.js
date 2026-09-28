export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/health") return Response.json({ worker: "lab", role: "lab-host", status: "ok" });
    return Response.json({ worker: "lab", role: "lab-host", status: "ready", authority: "experimental-only" });
  }
};