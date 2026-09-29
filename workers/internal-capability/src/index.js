import { WorkerEntrypoint } from "cloudflare:workers";
const reasoning={contract:"topology-reasoning-v1",focus:["capability_invocation","capability_locality","binding_cost","retry_recovery"],promotion_authority:false};
export default class InternalCapability extends WorkerEntrypoint {
  async health(){return {worker:"internal-capability",role:"capability-router",status:"ok",reasoning};}
  async describe(){return {authority:"execute-validated-capabilities-only",public_http:false,capabilities:["schema.validate"],reasoning};}
  async validateEnvelope(value){const valid=!!value&&typeof value==="object"&&typeof value.task_id==="string"&&value.task_id.length>0;return {valid,capability:"schema.validate/v1",reasoning_contract:reasoning.contract};}
}