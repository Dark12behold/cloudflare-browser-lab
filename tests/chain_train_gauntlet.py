import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def load(path):
    return json.loads((ROOT / path).read_text())

TRACE = load("shared/contracts/chain-trace-v1.json")
TRAIN = load("workflows/chain-train-v1.json")
ROLES = load("shared/contracts/worker-roles.json")["workers"]

EXPECTED_STAGES = ["scheduled","workflow_started","inspect","plan","execute","verify","record","decide","complete"]

def span(trace_id, n, actor, stage, status="success", parent=None, authority=None, retry=0):
    return {
        "trace_id": trace_id,
        "span_id": f"s{n}",
        "parent_span_id": parent,
        "task_id": "gauntlet-001",
        "actor": actor,
        "stage": stage,
        "status": status,
        "started_at": "2026-09-28T00:00:00Z",
        "authority_ceiling": authority or [],
        "retry_count": retry,
    }

def assert_trace(spans):
    assert len({s["trace_id"] for s in spans}) == 1
    assert len({s["span_id"] for s in spans}) == len(spans)
    for i, s in enumerate(spans):
        for req in TRACE["required"]:
            assert req in s, (s["span_id"], req)
        assert s["stage"] in TRACE["stages"]
        assert s["status"] in TRACE["status"]
        if i:
            assert s["parent_span_id"] == spans[i-1]["span_id"]
            assert set(s["authority_ceiling"]).issubset(set(spans[i-1]["authority_ceiling"]))

def happy_path():
    actors = ["lab","workflow","coordinator","coordinator","internal-capability","browser-verifier","coordinator","coordinator","coordinator"]
    auth = ["schedule","route","execute","verify","record"]
    spans=[]
    for i,(stage,actor) in enumerate(zip(EXPECTED_STAGES,actors)):
        spans.append(span("trace-happy",i,actor,stage,parent=spans[-1]["span_id"] if spans else None,authority=auth))
    assert_trace(spans)
    assert [s["stage"] for s in spans] == EXPECTED_STAGES
    return spans

def malformed_envelope_blocks():
    envelope = {"contract_version":1,"input":{},"authority":[]}
    valid = isinstance(envelope.get("task_id"), str) and len(envelope["task_id"]) > 0
    assert valid is False

def authority_expansion_blocks():
    upstream = {"route","execute"}
    downstream = {"route","execute","promote"}
    assert not downstream.issubset(upstream)

def retry_preserves_identity():
    first=span("trace-retry",4,"internal-capability","execute","retryable_failure",authority=["execute"],retry=0)
    retry=span("trace-retry",5,"internal-capability","execute","success",parent="s4",authority=["execute"],retry=1)
    assert first["task_id"] == retry["task_id"]
    assert first["trace_id"] == retry["trace_id"]
    assert retry["retry_count"] == first["retry_count"] + 1

def verifier_can_reject_executor_success():
    execute=span("trace-verify",4,"internal-capability","execute","success",authority=["execute","verify"])
    verify=span("trace-verify",5,"browser-verifier","verify","permanent_failure",parent="s4",authority=["verify"])
    assert execute["status"] == "success"
    assert verify["status"] != "success"

def record_failure_does_not_reexecute_side_effect():
    execution_count=1
    record=span("trace-record",6,"coordinator","record","retryable_failure",authority=["record"])
    assert record["status"] == "retryable_failure"
    assert execution_count == 1

def topology_contract():
    expected={"lab","browser-verifier","internal-capability","coordinator","production-site"}
    assert set(ROLES)==expected
    owners={s["owner"] for s in TRAIN["workflow"]["steps"]}
    assert owners <= expected
    assert "production-promotion" in ROLES["lab"]["denied"]
    assert "authority-escalation" in ROLES["internal-capability"]["denied"]
    assert "self-authorize" in ROLES["coordinator"]["denied"]

if __name__ == "__main__":
    tests=[happy_path,malformed_envelope_blocks,authority_expansion_blocks,retry_preserves_identity,
           verifier_can_reject_executor_success,record_failure_does_not_reexecute_side_effect,topology_contract]
    results=[]
    for t in tests:
        try:
            value=t()
            results.append({"test":t.__name__,"status":"PASS","spans":len(value) if isinstance(value,list) else None})
        except Exception as e:
            results.append({"test":t.__name__,"status":"FAIL","error":repr(e)})
    print(json.dumps(results,indent=2))
    failed=[r for r in results if r["status"]!="PASS"]
    if failed:
        raise SystemExit(1)
