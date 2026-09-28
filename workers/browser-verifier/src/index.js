export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/health") return Response.json({ worker: "browser-verifier", role: "evidence-verifier", status: "ok" });
    return Response.json({ worker: "browser-verifier", role: "evidence-verifier", status: "ready", mutation_authority: false, note: "Browser Run binding intentionally not declared until resource binding is verified." });
  }
};