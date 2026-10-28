import * as THREE from 'three';
import './film.css';
import {createEngineeringObjects} from './EngineeringObjects.js';

const TOTAL=1250,STAGES=7,TAU=Math.PI*2;
const $=s=>document.querySelector(s);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const mix=(a,b,t)=>a+(b-a)*t;
const rand=i=>{let v=Math.sin(i*127.1+78.233)*43758.5453;return v-Math.floor(v)};
const titles=[
 ['00 / THE BEGINNING','Before anything connected.','Every design was its own universe.'],
 ['01 / FRAGMENTATION','The drawings become visible.','Individual electrical sheets emerge from the particles, revealing duplicated design work.'],
 ['02 / THE THINKING','Observe. Measure. Model.','See the engineering decision process: understand the geometry before changing the workflow.'],
 ['03 / THE ENGINEERING','A drawing becomes a 3D vehicle.','Follow the physical reality: components, spatial constraints, and individual wires routed through a coach.'],
 ['04 / THE TRANSFORMATION','One backbone. Then the branches.','A growing harness replaces separate routes with a reusable architecture. The connections still serve distinct destinations.'],
 ['05 / THE SYSTEM','One foundation. Many possibilities.','Change the configuration. The relationships endure.'],
 ['06 / BEYOND THE BLUEPRINT','Different disciplines. One mindset.','Electrical engineering. Software. Data. Leadership. Always improving.']
];
const shell=document.createElement('div');
shell.innerHTML=`<div class="film-ui">
 <header class="film-header"><a class="film-brand" href="#top">K / M<span>.</span></a><div class="film-meta">KAILIA MALAIVANH<br>ENGINEERING BETTER SYSTEMS</div><a class="film-explore" href="/harness.html">EXPLORE 3D HARNESS ↗</a></header>
 <div class="film-scrollbar"><div id="film-progress"></div></div>
 <div class="film-viewport" id="top"><canvas id="film-canvas" aria-hidden="true"></canvas><div class="film-vignette"></div><div class="film-intro" id="film-intro"><span>AN INTERACTIVE ENGINEERING FILM</span><h1>BEYOND<br><em>THE BLUEPRINT.</em></h1><p>ONE MINDSET. ENDLESS WAYS TO BUILD BETTER.</p></div><div class="film-caption" id="film-caption"><span class="film-kicker" id="film-kicker">00 / THE BEGINNING</span><h2 id="film-title">Before anything connected.</h2><p id="film-description">Every design was its own universe.</p></div><div class="film-side">SCROLL TO DIRECT THE STORY <span>↓</span></div><div class="film-count" id="film-count">01 — 07</div><div class="film-skip"><a href="#film-end">SKIP FILM ↘</a></div></div>
 <div class="film-track" id="film-track"></div>
 <section class="film-end" id="film-end"><div class="film-end-label">THE STORY CONTINUES / 2026</div><h2>BETTER IS<br><em>NEVER FINISHED.</em></h2><p>Explore the work behind the experience: electrical harness architecture, software automation, predictive analytics, entrepreneurship and leadership.</p><div class="film-actions"><a href="/harness.html">EXPLORE THE 3D HARNESS <span>↗</span></a><a href="https://ggwordle.com" target="_blank" rel="noreferrer">GGWORDLE / PRODUCT <span>↗</span></a><a href="https://github.com/kMalaivanh" target="_blank" rel="noreferrer">GITHUB / SOURCE <span>↗</span></a></div><div class="film-endfoot"><span>© 2026 KAILIA MALAIVANH</span><a href="#top">REPLAY EXPERIENCE ↑</a><span>DESIGNED TO KEEP EVOLVING</span></div></section>
 </div>`;
document.getElementById('root').replaceChildren(shell);
const canvas=$('#film-canvas'),viewport=$('.film-viewport'),track=$('#film-track'),intro=$('#film-intro'),caption=$('#film-caption');
track.style.height='950vh';
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.65));renderer.setClearColor(0x070c10,1);
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x070c10,.018);
const camera=new THREE.PerspectiveCamera(52,1,.1,200);camera.position.set(0,0,34);
const world=new THREE.Group();scene.add(world);
const engineeringObjects=createEngineeringObjects(scene);
const colors=[new THREE.Color('#dda77e'),new THREE.Color('#9fc7c0'),new THREE.Color('#ddd3bd'),new THREE.Color('#c9b9d2'),new THREE.Color('#8eb3c4')];
const anchors=[[-11,5,0],[11,6,-2],[-1,-7,3]];
const points=[];
const positions=new Float32Array(TOTAL*3),colArr=new Float32Array(TOTAL*3),sizes=new Float32Array(TOTAL);
const targets=Array.from({length:STAGES},()=>new Float32Array(TOTAL*3));
const particleTypes=new Uint8Array(TOTAL);
for(let i=0;i<TOTAL;i++){
 const type=i%5,group=i%3,seed=rand(i+1),seed2=rand(i+81),seed3=rand(i+231);
 particleTypes[i]=type;
 const theta=TAU*seed,phi=Math.acos(2*seed2-1),r=1+Math.pow(seed3,.65)*7;
 const cl=anchors[group],bx=cl[0]+r*Math.sin(phi)*Math.cos(theta),by=cl[1]+r*Math.sin(phi)*Math.sin(theta),bz=cl[2]+r*Math.cos(phi);
 const k=i*3;
 // Opening: isolated star field with distant clusters
 targets[0].set([bx*1.38,by*1.32,bz*1.4],k);
 // Three drawing sheets appear: particles assemble across recognizable paper planes.
 const sheet=i%9,cell=Math.floor(i/9),column=cell%14,row=Math.floor(cell/14)%10;
 const sx=(sheet%3-1)*7,sy=(1-Math.floor(sheet/3))*5;
 targets[1].set([sx+(column-6.5)*.42,sy+(row-4.5)*.36,(sheet%3-1)*.42],k);
 // The same particles condense into orthogonal circuit tracks and diagram components.
 const line=Math.floor(i/125),idx=i%125,x=-12+(idx/124)*24,y=(line-5)*1.05;
 const bend=idx>60&&idx<82?2.4:idx>=82?1.15:0;
 targets[2].set([x,y+bend,(line%2)*.08],k);
 // An actual 3D trailer silhouette assembles: edges, bulkheads and a central conduit.
 const edge=i%16,step=Math.floor(i/16)/Math.ceil(TOTAL/16);
 const u=-11.5+23*step;
 let vx=u,vy=0,vz=0;
 if(edge<4){vy=edge%2?3.6:-3.6;vz=edge<2?-3.5:3.5}
 else if(edge<8){vx=edge%2?11.5:-11.5;vy=-3.6+7.2*step;vz=edge<6?-3.5:3.5}
 else if(edge<12){vx=edge%2?11.5:-11.5;vy=edge<10?-3.6:3.6;vz=-3.5+7*step}
 else {vy=-2.5+(edge-13.5)*.12;vz=-3.2+(edge%2)*.2}
 targets[3].set([vx,vy,vz],k);
 // Consolidation: common definitions converge into fewer reusable nodes; others orbit
 const shared=i%9!==0,def=i%18,a=(def/18)*TAU;
 const cx=Math.cos(a)*5.8,cy=Math.sin(a)*4.8,cz=Math.sin(a*2)*2.5;
 const gx=shared?cx+Math.sin(i*2.4)*.17:anchors[group][0]*.86+Math.cos(theta)*2.5;
 const gy=shared?cy+Math.cos(i*1.7)*.17:anchors[group][1]*.8+Math.sin(theta)*2.3;
 targets[4].set([gx,gy,shared?cz+(seed-.5)*.6:bz*.6],k);
 // Connected architecture: distinct trunk / root / branching destinations
 const family=i%7,depth=(Math.floor(i/7)%190)/190,x5=-14+depth*28;
 const y5=family===0?0:(family-3)*1.6*smooth((depth-.1)/.45);
 const z5=family===0?0:Math.sin(depth*4+family)*3*smooth((depth-.1)/.5);
 targets[5].set([x5,y5,z5],k);
 // End: globe of connected disciplines
 const a6=theta*2,rad6=6+4*seed3;
 targets[6].set([rad6*Math.sin(phi)*Math.cos(a6),rad6*Math.sin(phi)*Math.sin(a6),rad6*Math.cos(phi)],k);
 const c=colors[type];colArr[k]=c.r;colArr[k+1]=c.g;colArr[k+2]=c.b;
 sizes[i]=type===0?4.2:type===1?2.7:type===2?2.1:3.2;
}
const geometry=new THREE.BufferGeometry();
geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
geometry.setAttribute('color',new THREE.BufferAttribute(colArr,3));
geometry.setAttribute('size',new THREE.BufferAttribute(sizes,1));
const material=new THREE.ShaderMaterial({
 vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
 uniforms:{uTime:{value:0},uOpacity:{value:1},uSize:{value:1}},
 vertexShader:`attribute float size;varying vec3 vColor;uniform float uTime;uniform float uSize;void main(){vColor=color;vec3 p=position;p.y+=sin(uTime*.55+position.x*.31+position.z*.2)*.09;p.x+=cos(uTime*.4+position.y*.35)*.075;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=min(13.0,size*uSize*(34.0/max(4.0,-mv.z)));gl_Position=projectionMatrix*mv;}`,
 fragmentShader:`varying vec3 vColor;uniform float uOpacity;void main(){float d=length(gl_PointCoord-.5);float alpha=smoothstep(.5,.03,d);alpha*=smoothstep(.52,.22,d)*.85;gl_FragColor=vec4(vColor,alpha*uOpacity);}`
});
const cloud=new THREE.Points(geometry,material);world.add(cloud);
// Central flowing tracers: use dynamic points with wrap-around motion
const tracerGeo=new THREE.BufferGeometry(),TRACERS=150;
const tracerPos=new Float32Array(TRACERS*3),tracerCol=new Float32Array(TRACERS*3);
for(let i=0;i<TRACERS;i++){const color=colors[i%2];tracerCol.set([color.r,color.g,color.b],i*3)}
tracerGeo.setAttribute('position',new THREE.BufferAttribute(tracerPos,3).setUsage(THREE.DynamicDrawUsage));
tracerGeo.setAttribute('color',new THREE.BufferAttribute(tracerCol,3));
const tracer=new THREE.Points(tracerGeo,new THREE.PointsMaterial({size:.11,vertexColors:true,transparent:true,opacity:.75,depthWrite:false,blending:THREE.AdditiveBlending}));world.add(tracer);
// Lines become visible as objects consolidate and branch
const LINKS=115,linePositions=new Float32Array(LINKS*6);
const lineGeo=new THREE.BufferGeometry();lineGeo.setAttribute('position',new THREE.BufferAttribute(linePositions,3).setUsage(THREE.DynamicDrawUsage));
const lines=new THREE.LineSegments(lineGeo,new THREE.LineBasicMaterial({color:0xd5ab88,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));world.add(lines);
// Background stars: subtle cinematic depth
const bgGeo=new THREE.BufferGeometry(),bgPos=new Float32Array(650*3);
for(let i=0;i<650;i++){bgPos[i*3]=(rand(i+442)-.5)*115;bgPos[i*3+1]=(rand(i+557)-.5)*80;bgPos[i*3+2]=-22-rand(i+772)*50}
bgGeo.setAttribute('position',new THREE.BufferAttribute(bgPos,3));
const stars=new THREE.Points(bgGeo,new THREE.PointsMaterial({color:0x7e9894,size:.065,transparent:true,opacity:.4,depthWrite:false}));scene.add(stars);
const ambient=new THREE.PointLight(0xe6a97a,2,45);ambient.position.set(8,4,10);scene.add(ambient);
let scrollProgress=0,renderProgress=0,mouseX=0,mouseY=0,currentStage=-1,last=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const setSize=()=>{const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<720?65:52;camera.updateProjectionMatrix();material.uniforms.uSize.value=w<720?.7:1};
addEventListener('resize',setSize);setSize();
const updateScroll=()=>{const r=track.getBoundingClientRect();const max=Math.max(1,r.height-innerHeight);scrollProgress=clamp(-r.top/max);viewport.classList.toggle('film-at-end',r.bottom<=innerHeight*.3);$('#film-progress').style.width=(scrollProgress*100)+'%'};
addEventListener('scroll',updateScroll,{passive:true});updateScroll();
addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5)*2;mouseY=(e.clientY/innerHeight-.5)*2},{passive:true});
const render=(ms)=>{
 requestAnimationFrame(render);
 const dt=Math.min(.05,(ms-last)/1000||.016);last=ms;
 renderProgress=mix(renderProgress,scrollProgress,reduced?1:1-Math.exp(-dt*3.6));
 const scaled=renderProgress*(STAGES-1),stage=Math.min(STAGES-2,Math.floor(scaled)),t=smooth(scaled-stage),i0=stage,i1=stage+1;
 const pos=geometry.attributes.position.array;
 const time=ms*.001;
 const objectState=engineeringObjects.update(renderProgress,time,innerWidth);
 for(let i=0;i<TOTAL;i++){const j=i*3;pos[j]=mix(targets[i0][j],targets[i1][j],t);pos[j+1]=mix(targets[i0][j+1],targets[i1][j+1],t);pos[j+2]=mix(targets[i0][j+2],targets[i1][j+2],t)}
 geometry.attributes.position.needsUpdate=true;
 // Flow across coherent structures rather than random noise.
 for(let i=0;i<TRACERS;i++){
  const j=i*3,phase=(i/TRACERS+time*.048)%1,curve=phase*TAU;
  if(renderProgress<.52){tracerPos[j]=Math.sin(curve*2+i)*15;tracerPos[j+1]=Math.cos(curve+i*.7)*8;tracerPos[j+2]=Math.sin(curve*.9+i)*6}
  else if(renderProgress<.82){tracerPos[j]=-14+phase*28;tracerPos[j+1]=Math.sin(phase*4+i)*2.1;tracerPos[j+2]=Math.cos(phase*3+i*.3)*1.7}
  else{tracerPos[j]=Math.cos(curve)*9;tracerPos[j+1]=Math.sin(curve)*7;tracerPos[j+2]=Math.sin(curve*1.8+i)*4}
 }
 tracerGeo.attributes.position.needsUpdate=true;
 lines.material.opacity=smooth((renderProgress-.43)/.22)*.43;
 for(let n=0;n<LINKS;n++){const j=n*6,a=n*9%TOTAL,b=(a+7+n%19)%TOTAL,k=a*3,h=b*3;linePositions[j]=pos[k];linePositions[j+1]=pos[k+1];linePositions[j+2]=pos[k+2];linePositions[j+3]=pos[h];linePositions[j+4]=pos[h+1];linePositions[j+5]=pos[h+2]}
 lineGeo.attributes.position.needsUpdate=true;
 const drift=reduced?0:Math.sin(time*.1)*.12;
 world.rotation.y=mix(world.rotation.y,renderProgress*1.35+mouseX*.12+drift,.035);
 world.rotation.x=mix(world.rotation.x,(renderProgress-.5)*.21+mouseY*.07,.035);
 camera.position.z=mix(camera.position.z,innerWidth<720?46:32-(Math.sin(renderProgress*Math.PI)*3),.025);
 camera.position.x=mix(camera.position.x,Math.sin(renderProgress*TAU)*2,.018);camera.lookAt(0,0,0);
 material.uniforms.uTime.value=time;
 const objectFocus=Math.max(objectState.drawingOpacity*.92,objectState.rigOpacity*.82);
 material.uniforms.uOpacity.value=1-objectFocus*.88;
 tracer.material.opacity=.75*(1-objectFocus*.83);
 lines.material.opacity*=1-objectFocus*.75;
 const chapter=Math.min(6,Math.floor(renderProgress*6.999));
 if(chapter!==currentStage){currentStage=chapter;const story=titles[chapter];$('#film-kicker').textContent=story[0];$('#film-title').textContent=story[1];$('#film-description').textContent=story[2];$('#film-count').textContent=String(chapter+1).padStart(2,'0')+' — 07';caption.classList.remove('caption-flash');void caption.offsetHeight;caption.classList.add('caption-flash')}
 intro.style.opacity=String(1-smooth(renderProgress/.13));
 intro.style.transform='translate3d(0,'+(-renderProgress*95)+'px,0)';
 caption.style.opacity=String(smooth(renderProgress/.12)*(1-smooth((renderProgress-.955)/.045)));
 stars.rotation.y+=dt*.0015;
 renderer.render(scene,camera);
};
requestAnimationFrame(render);
