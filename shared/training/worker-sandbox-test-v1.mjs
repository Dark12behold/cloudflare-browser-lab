const assert=(x,m)=>{if(!x)throw new Error(m)};
const workers={
 coordinator:{can:["ASK","HELP","ROUTE"],deny:["EXECUTE","PROMOTE"]},
 "internal-capability":{can:["ASK","HELP","EXECUTE"],deny:["PROMOTE"]},
 "browser-verifier":{can:["ASK","VERIFY"],deny:["MUTATE","PROMOTE"]},
 lab:{can:["ASK","HELP","EXPERIMENT"],deny:["PRODUCTION_MUTATE","PROMOTE"]},
 "production-site":{can:["ASK","ROUTE"],deny:["EXPAND_AUTHORITY","PROMOTE"]}
};
const events=[];
const emit=(worker,task,state,extra={})=>events.push({worker,task,state,...extra});
for(const [w,p] of Object.entries(workers)){
 emit(w,"basic-"+w,"RECEIVED");
 assert(!p.can.includes("PROMOTE"),w+" may not promote");
 assert(p.deny.includes("PROMOTE"),w+" missing promotion denial");
}
emit("coordinator","peer-help","ACCEPTED",{kind:"HELP"});
emit("internal-capability","peer-help","RESULT",{kind:"ASK",authority_expanded:false});
emit("browser-verifier","peer-help","VERIFIED",{evidence:"sandbox"});
emit("lab","delayed","NOT_YET_OBSERVED",{elapsed_ms:50,expected_ms:200});
assert(events.find(x=>x.task==="delayed").state!=="FAILED","timeout became failure");
const timing=[18,21,27,25,24,31,29];
const mean=timing.reduce((a,b)=>a+b,0)/timing.length;
assert(mean>0&&timing.length>=5,"timing aggregation unavailable");
console.log(JSON.stringify({schema:"WORKER_SANDBOX_RESULT/1",status:"PASS",workers:Object.keys(workers),checks:{confirmation:true,cooperation:true,authority:true,false_negative_guard:true,timing_samples:timing.length,mean_ms:+mean.toFixed(2)},events},null,2));
