const reasoning={contract:"topology-reasoning-v1",mode:"observe-route-compare-propose",promotion_authority:false};
const ack=(task_id,state,extra={})=>({contract:"CONFIRMATION/1",task_id,state,worker:"coordinator",at:new Date().toISOString(),...extra});
export default{async fetch(request,env){const url=new URL(request.url);
if(url.pathname==="/health"){const capability=await env.CAPABILITIES.health();return Response.json({worker:"coordinator",role:"route-and-recovery",status:"ok",dependencies:{internal_capability:capability},reasoning});}
if(url.pathname==="/reasoning")return Response.json({worker:"coordinator",reasoning});
if(url.pathname==="/confirm"&&request.method==="POST"){const v=await request.json().catch(()=>null);if(!v?.task_id)return Response.json({contract:"CONFIRMATION/1",state:"BLOCKED",worker:"coordinator",reason:"missing_task_id"},{status:400});return Response.json(ack(v.task_id,"RECEIVED",{next:"route",expected_event:"ACCEPTED"}));}
if(url.pathname==="/help"&&request.method==="POST"){const v=await request.json().catch(()=>null);return Response.json(ack(v?.task_id??"unknown","ACCEPTED",{kind:"HELP",action:"capability_discovery",authority_expanded:false}));}
return Response.json({worker:"coordinator",role:"route-and-recovery",status:"ready",authority:"route-within-caller-ceiling",reasoning});}};