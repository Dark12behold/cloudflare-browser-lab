import json,pathlib
p=pathlib.Path(__file__).parent
c=json.loads((p/"worker-io-training-v1.json").read_text())
assert c["schema"]=="WORKER_IO_TRAINING/1"
assert len(c["cases"])>=10
ids=[x["id"] for x in c["cases"]]; assert len(ids)==len(set(ids))
assert any(x.get("timing",{}).get("ack_state")=="NOT_YET_OBSERVED" for x in c["cases"])
assert any(x["expect"].get("must_not_expand_authority") for x in c["cases"])
assert "false_success" in c["metrics"] and "false_failure" in c["metrics"]
print("WORKER_IO_TRAINING_CORPUS PASS",len(c["cases"]),"cases")
