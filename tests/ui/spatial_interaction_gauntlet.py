import json, math, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
G=json.loads((ROOT/"shared/training/spatial-ui-gauntlet-v1.json").read_text())

def place_popup(px,py,pw,ph,vw,vh,gap=8):
    x=px+gap; y=py+gap; hx="right"; vy="down"
    if x+pw>vw: x=max(0,px-pw-gap); hx="left"
    if y+ph>vh: y=max(0,py-ph-gap); vy="up"
    return {"x":x,"y":y,"horizontal":hx,"vertical":vy}

def inside(r,vw,vh):
    return r["x"]>=0 and r["y"]>=0 and r["x"]+r["w"]<=vw and r["y"]+r["h"]<=vh

def path_len(points):
    return sum(math.hypot(b[0]-a[0],b[1]-a[1]) for a,b in zip(points,points[1:]))

def run():
    results=[]
    cases=[
      ("center",place_popup(400,300,180,220,1024,768),1024,768,"right","down"),
      ("right_edge",place_popup(1000,300,180,220,1024,768),1024,768,"left","down"),
      ("bottom_edge",place_popup(400,750,180,220,1024,768),1024,768,"right","up"),
      ("corner",place_popup(1010,750,180,220,1024,768),1024,768,"left","up"),
      ("mobile_corner",place_popup(315,620,180,220,320,640),320,640,"left","up")
    ]
    for name,p,vw,vh,h,v in cases:
      r={**p,"w":180,"h":220}; ok=inside(r,vw,vh) and p["horizontal"]==h and p["vertical"]==v
      results.append({"case":name,"status":"PASS" if ok else "FAIL","placement":p})
    direct=[(20,20),(100,80),(180,140)]
    detour=[(20,20),(20,140),(180,140)]
    results.append({"case":"pointer_path_efficiency","status":"PASS" if path_len(direct)<path_len(detour) else "FAIL","direct":path_len(direct),"detour":path_len(detour)})
    timeline=["trigger","animation_start","visual_complete","interactive_ready","click"]
    results.append({"case":"temporal_readiness","status":"PASS" if timeline.index("interactive_ready")<timeline.index("click") else "FAIL"})
    results.append({"case":"gauntlet_shape","status":"PASS" if len(G["progression"])==6 and G["promotion"]["self_promotion"] is False else "FAIL"})
    print(json.dumps(results,indent=2))
    return 1 if any(x["status"]!="PASS" for x in results) else 0
if __name__=="__main__":sys.exit(run())
