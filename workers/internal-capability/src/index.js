import{WorkerEntrypoint}from"cloudflare:workers";
const reasoning={contract:"topology-reasoning-v1",focus:["capability_invocation","capability_locality","binding_cost","retry_recovery"],promotion_authority:false};
const ack=(task_id,state,extra={})=>({contract:"CONFIRMATION/1",task_id,state,worker:"internal-capability",at:new Date().toISOString(),...extra});
export default class InternalCapability extends WorkerEntrypoint{
async health(){return{worker:"internal-capability",role:"capability-router",status:"ok",reasoning};}
async describe(){return{authority:"execute-validated-capabilities-only",public_http:false,capabilities:["schema.validate"],cooperation:["ASK","HELP"],confirmation:"CONFIRMATION/1",reasoning};}
async confirm(v){if(!v?.task_id)return ack("unknown","BLOCKED",{reason:"missing_task_id"});return ack(v.task_id,"RECEIVED",{next:"validate",expected_event:"ACCEPTED"});}
async ask(v){return ack(v?.task_id??"unknown","RESULT",{kind:"ASK",capabilities:["schema.validate"],authority_expanded:false});}
async validateEnvelope(value){const valid=!!value&&typeof value==="object"&&typeof value.task_id==="string"&&value.task_id.length>0&&value.contract_version===1;return{valid,capability:"schema.validate/v1",state:valid?"VERIFIED":"BLOCKED",reasoning_contract:reasoning.contract};}}