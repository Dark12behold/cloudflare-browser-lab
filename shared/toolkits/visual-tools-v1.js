export function placePopup({anchor, menu, viewport, gap=8, padding=0}) {
  let x=anchor.x+gap, y=anchor.y+gap, horizontal="right", vertical="down";
  if (x+menu.width+padding>viewport.width) { x=anchor.x-menu.width-gap; horizontal="left"; }
  if (y+menu.height+padding>viewport.height) { y=anchor.y-menu.height-gap; vertical="up"; }
  x=Math.max(padding,Math.min(x,viewport.width-menu.width-padding));
  y=Math.max(padding,Math.min(y,viewport.height-menu.height-padding));
  return {x,y,width:menu.width,height:menu.height,horizontal,vertical};
}
export function pathLength(points=[]) {
  let n=0; for(let i=1;i<points.length;i++) n+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y); return n;
}
export function verifyTimeline(events=[]) {
  const pos=Object.fromEntries(events.map((e,i)=>[e,i]));
  const required=["trigger","animation_start","visual_complete","interactive_ready"];
  const missing=required.filter(k=>pos[k]===undefined);
  if(missing.length) return {ok:false,missing};
  return {ok:pos.trigger<=pos.animation_start&&pos.animation_start<=pos.visual_complete&&pos.visual_complete<=pos.interactive_ready,missing:[]};
}
