export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/health") return Response.json({ worker: "labs", role: "lab-host", status: "ok" });
    return Response.json({ worker: "labs", role: "lab-host", status: "ready", authority: "experimental-only" });
  }
};