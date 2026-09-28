import { WorkerEntrypoint } from "cloudflare:workers";

export default class InternalCapability extends WorkerEntrypoint {
  async health() {
    return { worker: "internal-capability", role: "capability-router", status: "ok" };
  }

  async describe() {
    return {
      authority: "execute-validated-capabilities-only",
      public_http: false,
      capabilities: ["schema.validate"]
    };
  }

  async validateEnvelope(value) {
    const valid = !!value && typeof value === "object" && typeof value.task_id === "string" && value.task_id.length > 0;
    return { valid, capability: "schema.validate/v1" };
  }
}