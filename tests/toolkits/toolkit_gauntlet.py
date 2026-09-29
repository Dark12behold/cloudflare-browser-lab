import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
REG=json.loads((ROOT/"shared/toolkits/tool-registry-v1.json").read_text())
PRO=json.loads((ROOT/"shared/toolkits/worker-toolkit-profiles-v1.json").read_text())
def resolve(worker,required,current_authority=None):
    p=PRO["profiles"][worker]; available=set(p.get("include",[]))|set(p.get("conditional",[]))
    selected=[x for x in required if x in available]
    missing=[x for x in required if x not in available]
    denied=[x for x in selected if x in p.get("deny",[])]
    return {"worker":worker,"selected":[x for x in selected if x not in denied],"missing":missing,"denied":denied}
def main():
    known={t["id"] for t in REG["tools"]}
    assert len(known)==len(REG["tools"])
    for name,p in PRO["profiles"].items():
        assert set(p.get("include",[]))<=known
        assert set(p.get("conditional",[]))<=known
        assert set(p.get("deny",[]))<=known
    assert "popup.place" in resolve("browser-verifier",["popup.place"])["selected"]
    assert "popup.place" in resolve("coordinator",["popup.place"])["missing"]
    assert REG["lifecycle"][0]=="CANDIDATE"
    print(json.dumps({"status":"PASS","tools":len(known),"profiles":len(PRO["profiles"])},indent=2))
if __name__=="__main__": main()
