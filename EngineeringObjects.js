import * as THREE from 'three';

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
const palette=[0xe8aa7d,0x91bcb7,0xe3d9c9,0xc4b3d3,0x89a9c8,0xd8bd8b];
const v=(x,y,z)=>new THREE.Vector3(x,y,z);
function mat(color,opacity=1){return new THREE.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide})}
function line(group,pts,color=0x7a9996,opacity=.45){
 const g=new THREE.BufferGeometry().setFromPoints(pts.map(p=>v(...p)));
 const m=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));
 m.userData.baseOpacity=opacity;group.add(m);return m;
}
function cable(group,pts,color,radius=.06){
 const curve=new THREE.CatmullRomCurve3(pts.map(p=>v(...p)),false,'catmullrom',.14);
 const segments=90;
 const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,segments,radius,7,false),mat(color));
 mesh.userData.baseOpacity=1;group.add(mesh);
 // Use contiguous complete rings to animate physically growing routes.
 const total=mesh.geometry.index.count;
 return {mesh,curve,total,set(t){const count=Math.floor(total*ease(t)/3)*3;mesh.geometry.setDrawRange(0,count)}};
}
function opacity(group,value){
 group.visible=value>.002;
 group.traverse(obj=>{if(obj.material&&obj.material.opacity!==undefined){obj.material.opacity=(obj.userData.baseOpacity??1)*value}});
}
function schematicTexture(index){
 const c=document.createElement('canvas');c.width=512;c.height=350;
 const g=c.getContext('2d');g.fillStyle='#eee8de';g.fillRect(0,0,512,350);
 g.strokeStyle='#84908b';g.lineWidth=1.7;g.strokeRect(13,13,486,324);
 g.fillStyle='#324944';g.font='bold 16px monospace';g.fillText(['MAIN DISTRIBUTION','FRIDGE SUPPLY','CEILING LIGHT','SLIDE MOTOR','ROOF CIRCUIT'][index%5],26,43);
 g.font='11px monospace';g.fillText('ILLUSTRATIVE 2D ELECTRICAL DRAWING',26,325);
 g.strokeStyle='#273a40';g.lineWidth=3;g.beginPath();g.moveTo(58,165);g.lineTo(130,165);g.lineTo(130,100+index*14);g.lineTo(325,100+index*14);g.lineTo(325,218);g.lineTo(440,218);g.stroke();
 g.strokeStyle='#a07356';g.lineWidth=2;g.strokeRect(38,145,42,40);g.strokeRect(424,200,42,38);
 for(let n=0;n<3;n++){g.strokeStyle='#607d76';g.strokeRect(170+n*60,92+index*14,23,17)}
 g.fillStyle='#546761';g.font='11px monospace';g.fillText('POWER',32,133);g.fillText('LOAD',420,195);
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx;
}
function makeRig(group){
 const rig=new THREE.Group();group.add(rig);
 const L=24,H=8,W=8;
 const shell=new THREE.Group();rig.add(shell);
 for(const z of [-W/2,W/2])line(shell,[[-L/2,-H/2,z],[L/2,-H/2,z],[L/2,H/2,z],[-L/2,H/2,z],[-L/2,-H/2,z]],0x84a6a4,.4);
 for(const x of [-L/2,L/2])for(const y of [-H/2,H/2])line(shell,[[x,y,-W/2],[x,y,W/2]],0x84a6a4,.4);
 for(const x of [-7,-1,7]){line(shell,[[x,-4,-4],[x,4,-4]],0x66817f,.16);line(shell,[[x,-4,4],[x,4,4]],0x66817f,.16)}
 const parts=[[-10,-2.6,-3.45],[-8,2.7,-3.45],[-3,-.5,3.45],[1,3,3.45],[7,-2.5,-3.45],[10,2,3.45],[2,-1,-3.45],[-6,3,3.45],[9,3,-3.45],[-1,-2.8,3.45]];
 parts.forEach((p,i)=>{
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(i===0?1.5:.67,i===0?1.9:.67,.52),mat(i===0?0xe8aa7d:0xc7d5cd,.9));
  mesh.position.set(...p);mesh.userData.baseOpacity=.9;rig.add(mesh);
 });
 const source=parts[0],manual=new THREE.Group(),harness=new THREE.Group();
 rig.add(manual,harness);
 // BEFORE: Every wire starts at exactly the same central distribution point.
 // Different detours, separated lanes, overlapping bends, no common trunk.
 const loose=[];
 for(let i=1;i<parts.length;i++){
  const [x,y,z]=parts[i];const wiggle=((i%3)-1)*1.3;
  const path=[source,[-8.7,-2.6+(i%5)*.46,-3.2],[-5.4+i*.42,-3.8+(i%3)*1.3,-2.7+((i%4)-1.5)*.75],[(x-1.6),-1.5+wiggle,((i%2)===0?2.6:-2.7)],[x,y,z]];
  loose.push(cable(manual,path,palette[i%palette.length],.055));
 }
 // AFTER: A single shared backbone from the same distribution panel.
 // Short branches terminate at exactly the same components as the before.
 const trunk=cable(harness,[source,[-8,-2.65,-3.45],[-4,-2.65,-3.45],[0,-2.65,-3.45],[5,-2.65,-3.45],[10,-2.65,-3.45]],0xdcb08b,.26);
 const branches=parts.slice(1).map(([x,y,z],i)=>{
  const tap=clamp(x,-8,10);
  const path=[[tap,-2.65,-3.45],[tap,-2.25,-3.4],[tap,y*.65,z*.65],[x,y,z]];
  return cable(harness,path,palette[(i+1)%palette.length],.07)
 });
 const bands=[];
 [-7,-3,1,5,8].forEach(x=>{const m=new THREE.Mesh(new THREE.TorusGeometry(.29,.045,7,12),mat(0xc6d0ca));m.rotation.y=Math.PI/2;m.position.set(x,-2.65,-3.45);harness.add(m);bands.push(m)});
 rig.rotation.set(.16,-.25,0);
 return {rig,shell,manual,harness,loose,trunk,branches,bands};
}
export function createEngineeringObjects(scene){
 const drawings=new THREE.Group();scene.add(drawings);
 const papers=Array.from({length:6},(_,i)=>{
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(7.3,5),new THREE.MeshBasicMaterial({map:schematicTexture(i),transparent:true,opacity:1,side:THREE.DoubleSide,depthWrite:false}));
  drawings.add(mesh);return mesh;
 });
 const processObjects=new THREE.Group();scene.add(processObjects);
 // The process is revealed through separate physical symbols, never as a flat four-box diagram.
 const measurement=new THREE.Group();processObjects.add(measurement);
 const measureLine=line(measurement,[[-8,0,2],[8,0,2]],0xe8aa7d,1);
 for(let j=0;j<9;j++)line(measurement,[[-8+j*2,-.22,2],[-8+j*2,.22,2]],0xe8aa7d,.95);
 const r=makeRig(scene);
 function update(p,time,w){
  // Paper scene grows large and centered, sheets peel away one by one.
  const sheetAlpha=ease((p-.12)/.045)*(1-ease((p-.245)/.047));
  opacity(drawings,sheetAlpha);
  for(let i=0;i<papers.length;i++){
   const paper=papers[i],t=ease((p-.13)/.08),x=(i%3-1)*8.2,y=(1-Math.floor(i/3))*5.35;
   paper.position.set(x*(.5+.5*t),y*(.5+.5*t),(i%3-1)*.6);
   paper.rotation.set(.03*Math.sin(time*.25+i),.035*Math.sin(time*.21+i),.04*(i-2));
   paper.scale.setScalar(w<650?1.05:1.4);
  }
  // One visual idea: a measurement guide in front of the emerging vehicle.
  const measureAlpha=ease((p-.245)/.04)*(1-ease((p-.315)/.038));
  opacity(processObjects,measureAlpha);
  measurement.position.set(0,-1,7);
  // One large RV occupies the frame; the before and after share the exact same load positions.
  const rigAlpha=ease((p-.31)/.05)*(1-ease((p-.81)/.07));
  opacity(r.rig,rigAlpha);
  const manualAlpha=ease((p-.375)/.035)*(1-ease((p-.555)/.06));
  const harnessAlpha=ease((p-.56)/.045)*(1-ease((p-.81)/.06));
  opacity(r.manual,rigAlpha*manualAlpha);
  opacity(r.harness,rigAlpha*harnessAlpha);
  // Richer arcs grow outward from center one-by-one: first chaotic, then tidy.
  r.loose.forEach((wire,i)=>wire.set((p-.386-i*.012)/.11));
  r.trunk.set((p-.56)/.075);
  r.branches.forEach((wire,i)=>wire.set((p-.635-i*.014)/.075));
  r.bands.forEach((band,i)=>{band.scale.setScalar(.3+.7*ease((p-.67-i*.012)/.04))});
  // Centered and nearly full-screen while retaining clearance for camera perspective.
  r.rig.scale.setScalar(w<650?1.05:1.35);
  r.rig.rotation.set(.2,-.3+Math.sin(time*.16)*.035,0);
  // Push the rig slightly upward so minimal captions never cross the wires.
  r.rig.position.y=1.5;
  return {drawingOpacity:sheetAlpha,rigOpacity:rigAlpha,manualPhase:manualAlpha,harnessPhase:harnessAlpha,measureOpacity:measureAlpha}
 }
 update(0,0,1280);
 return {update};
}
