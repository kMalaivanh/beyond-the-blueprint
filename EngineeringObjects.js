import * as THREE from 'three';

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const mix=(a,b,t)=>a+(b-a)*t;
const C={copper:0xe9ab7e,blue:0x9dbeb8,ivory:0xeee7dd,dim:0x5c8082};
function canvasTexture(draw,w=640,h=440){
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d');draw(ctx,w,h);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
 return texture;
}
function drawSheet(ctx,w,h,i){
 ctx.fillStyle='#e9e3d8';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#878e87';ctx.lineWidth=2;ctx.strokeRect(20,20,w-40,h-40);
 ctx.fillStyle='#3c5553';ctx.font='bold 20px monospace';ctx.fillText(['LIGHTING CIRCUIT','POWER DISTRIBUTION','SLIDE MOTOR','ROOF CONNECTION','CHASSIS CIRCUIT'][i%5],40,65);
 ctx.font='13px monospace';ctx.fillText('ILLUSTRATIVE ELECTRICAL SCHEMATIC  /  '+String(i+1).padStart(2,'0'),40,h-32);
 const y=140+(i%3)*13;ctx.lineWidth=4;ctx.strokeStyle='#263d42';ctx.beginPath();ctx.moveTo(65,y);ctx.lineTo(230,y);ctx.lineTo(230,y+86);ctx.lineTo(455,y+86);ctx.lineTo(455,y+35);ctx.lineTo(565,y+35);ctx.stroke();
 ctx.lineWidth=2;ctx.strokeStyle='#8a6052';ctx.strokeRect(52,y-22,32,44);ctx.strokeRect(548,y+13,35,44);
 ctx.fillStyle='#354b4a';ctx.font='15px monospace';ctx.fillText('PANEL',43,y-38);ctx.fillText('LOAD',533,y-2);
 for(let k=0;k<4;k++){const x=140+k*92;ctx.strokeStyle='#647c78';ctx.beginPath();ctx.moveTo(x,y-10);ctx.lineTo(x+18,y+10);ctx.stroke()}
 ctx.strokeStyle='#b5afa4';ctx.strokeRect(355,h-100,235,48);ctx.fillStyle='#526862';ctx.font='13px monospace';ctx.fillText('MODEL '+String.fromCharCode(65+(i%3)),365,h-70);
}
function drawProcess(ctx,w,h){
 ctx.fillStyle='#0c181c';ctx.fillRect(0,0,w,h);ctx.lineWidth=2;
 const nodes=[['OBSERVE','2D DRAWINGS'],['MEASURE','REAL GEOMETRY'],['MODEL','3D ROUTING'],['STANDARDIZE','REUSABLE HARNESS']];
 for(let i=0;i<4;i++){
  let x=28+i*160;ctx.strokeStyle='#c78e70';ctx.strokeRect(x,95,139,125);
  ctx.fillStyle='#e5b48c';ctx.font='bold 17px monospace';ctx.fillText(nodes[i][0],x+12,140);
  ctx.fillStyle='#aebbb3';ctx.font='12px monospace';ctx.fillText(nodes[i][1],x+12,169);
  if(i<3){ctx.beginPath();ctx.strokeStyle='#dfb087';ctx.moveTo(x+142,156);ctx.lineTo(x+156,156);ctx.stroke()}
 }
 ctx.font='17px monospace';ctx.fillStyle='#e9dfce';ctx.fillText('ENGINEERING DECISION FLOW  /  CONCEPTUAL',27,51);
 ctx.fillStyle='#96aca5';ctx.font='15px monospace';ctx.fillText('Each new model reuses shared routing decisions while preserving unique requirements.',27,283);
}
function material(color,opacity=1){return new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.18,transparent:true,opacity,roughness:.48,metalness:.16,depthWrite:false})}
function makeLine(parent,coords,color=C.blue,opacity=.65){
 const geometry=new THREE.BufferGeometry().setFromPoints(coords.map(p=>new THREE.Vector3(...p)));
 const line=new THREE.Line(geometry,new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));parent.add(line);return line;
}
function addCurve(group,coords,color,width){
 const curve=new THREE.CatmullRomCurve3(coords.map(c=>new THREE.Vector3(...c)),false,'catmullrom',.22);
 const geometry=new THREE.TubeGeometry(curve,80,width,8,false);const mesh=new THREE.Mesh(geometry,material(color));
 group.add(mesh);return{mesh,geometry,indices:geometry.index?.count??0,curve};
}
function opacityGroup(root,value){
 root.traverse(obj=>{if(obj.material&&'opacity'in obj.material){const base=obj.userData.baseOpacity??1;obj.material.opacity=base*value;obj.visible=value>.006}});
 root.visible=value>.006;
}
export function createEngineeringObjects(scene){
 const sheetsGroup=new THREE.Group();scene.add(sheetsGroup);
 const sheetObjects=[];
 for(let i=0;i<9;i++){
  const tex=canvasTexture((ctx,w,h)=>drawSheet(ctx,w,h,i));
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(6.1,4.2),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:1,side:THREE.DoubleSide,depthWrite:false}));
  mesh.userData.baseOpacity=1;sheetsGroup.add(mesh);
  sheetObjects.push(mesh);
 }
 const rig=new THREE.Group();scene.add(rig);
 const rigWireframe=new THREE.Group();rig.add(rigWireframe);
 const L=23,W=7,H=7.2;
 const shellpts=[
 [[-L/2,-H/2,-W/2],[L/2,-H/2,-W/2],[L/2,H/2,-W/2],[-L/2,H/2,-W/2],[-L/2,-H/2,-W/2]],
 [[-L/2,-H/2,W/2],[L/2,-H/2,W/2],[L/2,H/2,W/2],[-L/2,H/2,W/2],[-L/2,-H/2,W/2]]
 ];
 shellpts.forEach(points=>makeLine(rigWireframe,points,C.blue,.67));
 for(const x of [-L/2,L/2])for(const y of [-H/2,H/2])makeLine(rigWireframe,[[x,y,-W/2],[x,y,W/2]],C.blue,.67);
 for(const x of [-5,3,8])makeLine(rigWireframe,[[x,-H/2,-W/2],[x,-H/2,W/2]],C.blue,.3);
 for(const z of [-W/2,W/2])makeLine(rigWireframe,[[-5,-H/2,z],[-5,H/2,z]],C.blue,.4);
 const parts=[
 [-9,-2.1,-3.3,'PANEL'],[-4,1,-3.1,'FRIDGE'],[3,1.8,-3.2,'LIGHT'],[9,1.8,2.8,'OUTLET'],
 [7,-2.1,-3.2,'MOTOR'],[-7,2.1,2.8,'ROOF']
 ];
 const componentMats=[];
 parts.forEach(([x,y,z,label],i)=>{
  const geo=new THREE.BoxGeometry(.9,.74,.7);
  const mat=material(i===0?C.copper:C.ivory,.9);const comp=new THREE.Mesh(geo,mat);comp.position.set(x,y,z);rig.add(comp);componentMats.push(mat);
 });
 const manual=new THREE.Group(),harness=new THREE.Group();rig.add(manual,harness);
 const source=[-9,-2.1,-3.3];const wires=[];
 parts.slice(1).forEach(([x,y,z],i)=>{
  const offset=.14*i;
  const coords=[source,[-7.8,-2.6+offset,-3.25],[-3,-2.6+offset,-3.25],[x,-2.6+offset,-3.25],[x,y,z]];
  wires.push(addCurve(manual,coords,i%2?0xefb388:0xb6d0bf,.035));
 });
 const trunk=addCurve(harness,[source,[-7.8,-2.5,-3.24],[-2,-2.5,-3.24],[3,-2.5,-3.24],[9,-2.5,-3.24]],C.copper,.16);
 const branches=parts.slice(1).map(([x,y,z],i)=>addCurve(harness,[[-5+i*2.8,-2.5,-3.24],[x,-2.5,-3.2],[x,y,z]],i%2?C.ivory:C.copper,.054));
 const decisionGroup=new THREE.Group();scene.add(decisionGroup);
 const decisionTexture=canvasTexture(drawProcess,700,350);
 const decisionPlane=new THREE.Mesh(new THREE.PlaneGeometry(21,10.5),new THREE.MeshBasicMaterial({map:decisionTexture,transparent:true,opacity:1,depthWrite:false,side:THREE.DoubleSide}));
 decisionGroup.add(decisionPlane);
 const labelGroup=new THREE.Group();scene.add(labelGroup);
 function makeLabels(){
  const canvas=document.createElement('canvas');canvas.width=900;canvas.height=180;const ctx=canvas.getContext('2d');
  ctx.fillStyle='#efc39c';ctx.font='bold 32px monospace';ctx.fillText('2D DOCUMENTATION  →  3D SPATIAL ROUTING',35,85);
  ctx.font='20px monospace';ctx.fillStyle='#9caeaa';ctx.fillText('GEOMETRY  •  SHARED CORRIDOR  •  BRANCHES  •  CONNECTORS',35,125);
  return new THREE.CanvasTexture(canvas)
 }
 const infoPlane=new THREE.Mesh(new THREE.PlaneGeometry(16,3.2),new THREE.MeshBasicMaterial({map:makeLabels(),transparent:true,opacity:1,depthWrite:false}));
 infoPlane.position.set(0,-8,2);labelGroup.add(infoPlane);
 rig.rotation.set(.22,-.35,0);
 const scratch=new THREE.Vector3();
 function update(p,time,viewportWidth){
  const drawingIn=ease((p-.11)/.1),drawingOut=1-ease((p-.36)/.1);
  const drawingOpacity=drawingIn*drawingOut;
  opacityGroup(sheetsGroup,drawingOpacity);
  for(let i=0;i<sheetObjects.length;i++){
   const j=i%3,row=Math.floor(i/3),mesh=sheetObjects[i];
   let t=ease((p-.14)/.15);
   mesh.position.set((j-1)*7.1+(1-t)*Math.sin(i*3)*11,(1-row)*5.1+(1-t)*Math.cos(i*2)*8,(i%3-1)*.8+(1-t)*Math.sin(i)*12);
   mesh.rotation.set(0,.09*Math.sin(i+time*.2),.025*Math.cos(i*2+time*.2));
   mesh.scale.setScalar(.7+.3*t);
  }
  const rigOpacity=ease((p-.33)/.12)*(1-ease((p-.77)/.12));
  opacityGroup(rig,rigOpacity);
  const manualPhase=ease((p-.42)/.11)*(1-ease((p-.59)/.07));
  const harnessPhase=ease((p-.6)/.13)*(1-ease((p-.78)/.08));
  opacityGroup(manual,rigOpacity*manualPhase);
  opacityGroup(harness,rigOpacity*harnessPhase);
  wires.forEach((w,i)=>{const growing=ease((p-.44-i*.014)/.09);w.geometry.setDrawRange(0,Math.floor(w.indices*growing/3)*3)});
  trunk.geometry.setDrawRange(0,Math.floor(trunk.indices*ease((p-.60)/.08)/3)*3);
  branches.forEach((b,i)=>b.geometry.setDrawRange(0,Math.floor(b.indices*ease((p-.66-i*.016)/.07)/3)*3));
  rig.scale.setScalar(viewportWidth<720?.79:1.05);
  rig.rotation.y=-.35+(p-.42)*1.15+Math.sin(time*.15)*.09;
  rig.rotation.x=.2+Math.sin(time*.19)*.04;
  rig.position.set(0,0,0);
  const decisionOpacity=ease((p-.24)/.08)*(1-ease((p-.39)/.08));
  opacityGroup(decisionGroup,decisionOpacity);
  decisionGroup.position.set(0,0,6);decisionGroup.rotation.y=Math.sin(time*.15)*.025;
  opacityGroup(labelGroup,rigOpacity*(1-ease((p-.73)/.04)));
  // the final integrated network inherits the particle film's own consolidation
  return {drawingOpacity,rigOpacity,manualPhase,harnessPhase};
 }
 update(0,0,1280);
 return {update};
}
