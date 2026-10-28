import React,{useEffect,useRef,useState} from 'react';
import './network-story.css';

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=t=>t*t*(3-2*t);
const groups=[
{cx:230,cy:220,tone:'#dfa77d',name:'MODEL A'},
{cx:640,cy:170,tone:'#abc9b7',name:'MODEL B'},
{cx:540,cy:480,tone:'#c6b5d4',name:'MODEL C'}
];
const objects=Array.from({length:96},(_,i)=>{
const group=i%3, within=Math.floor(i/3),theta=(within*2.39996+group)*1.05,r=28+Math.sqrt(within/32)*115;
const orig={x:groups[group].cx+Math.cos(theta)*r,y:groups[group].cy+Math.sin(theta)*r*.75};
const definition=within%9;
const dx=definition%3,dy=Math.floor(definition/3);
const core={x:410+(dx-1)*75,y:307+(dy-1)*70};
return {id:i,group,within,definition,orig,core,
kind:within%5===0?'drawing':within%5===1?'circuit':within%5===2?'component':within%5===3?'measurement':'spec',
unique:within%11===0,
angle:theta};
});
const story=[
{eyebrow:'ACT 01 / THE PROBLEM',title:'Everything existed.',em:'Separately.',copy:'Drawings, circuits, components and measurements lived in disconnected collections. Different models often needed similar information.'},
{eyebrow:'ACT 02 / THE PATTERN',title:'Different models.',em:'Repeated work.',copy:'When the same engineering decisions appear across designs, maintaining each independently creates friction. Watch matching definitions illuminate.'},
{eyebrow:'ACT 03 / THE TRANSFORMATION',title:'Stop recreating.',em:'Start connecting.',copy:'Shared engineering information moves toward a common foundation. Unique model requirements remain independent, while reusable relationships emerge.'},
{eyebrow:'ACT 04 / THE ARCHITECTURE',title:'One foundation.',em:'Many configurations.',copy:'A reusable architecture does not mean every model is identical. It preserves common information while allowing each vehicle to adapt.'},
{eyebrow:'ACT 05 / THE OUTCOME',title:'Design what',em:'changes.',copy:'The result is not fewer dots for the sake of fewer dots. It is less duplicate work and a system that can grow without being recreated.'}
];
const n=(x)=>Number(x.toFixed(2));
function Node({item,t,focus,highlight,selected,onSelect}){
 const consolidate=ease(clamp((t-.36)/.34)), showConnection=ease(clamp((t-.52)/.29));
 const independent=item.unique;
 const end=independent?{x:groups[item.group].cx+(item.orig.x-groups[item.group].cx)*.47,y:groups[item.group].cy+(item.orig.y-groups[item.group].cy)*.48}:item.core;
 const x=item.orig.x+(end.x-item.orig.x)*consolidate,y=item.orig.y+(end.y-item.orig.y)*consolidate;
 const isFeatured=item.definition===focus;
 const fade=highlight&&!isFeatured&&consolidate>.5;
 const color=item.kind==='drawing'?'#d7cdbb':item.kind==='circuit'?'#efa979':item.kind==='component'?'#a3c4b8':item.kind==='measurement'?'#c4b6d5':'#d8c98d';
 const opacity=(fade?.11:1)*(independent?.8:1);
 const size=item.kind==='drawing'?10:item.kind==='component'?7:item.kind==='measurement'?6:4;
 return <g onClick={()=>onSelect(item.definition)} className="story-node" role="button" aria-label={'Select engineering definition '+(item.definition+1)} style={{cursor:'pointer'}} opacity={opacity}>
   {consolidate>.06&&!independent&&<path d={`M ${n(x)} ${n(y)} L ${n(groups[item.group].cx)} ${n(groups[item.group].cy)}`} stroke={color} strokeWidth={isFeatured?1.5:.65} strokeDasharray="3 8" opacity={showConnection*.65} fill="none"/>}
   {item.kind==='drawing'?<rect x={x-size/2} y={y-size/2} width={size} height={size*.7} fill={color} opacity=".85"/>:item.kind==='component'?<rect x={x-size/2} y={y-size/2} width={size} height={size} rx="1.5" stroke={color} fill="#0d191b" strokeWidth="2"/>:item.kind==='measurement'?<path d={`M${x-4} ${y+4}L${x+4} ${y-4}M${x-6} ${y}h12`} stroke={color} strokeWidth="1.6"/>:<circle cx={x} cy={y} r={size/2} fill={color}/>}
   {isFeatured&&highlight&&<circle cx={x} cy={y} r={12} fill="none" stroke={color} strokeWidth="1" opacity=".8"/>}
 </g>
}
function NetworkScene({progress,model,focus,setFocus,manual}){
const t=manual??progress;
const connected=ease(clamp((t-.47)/.34));
return <svg className="network-svg" viewBox="0 0 900 650" role="img" aria-label="Interactive engineering definitions consolidating from three isolated model clusters to shared reusable nodes">
<defs><radialGradient id="storyBg"><stop stopColor="#203537"/><stop offset="1" stopColor="#0b1417"/></radialGradient><filter id="storyGlow"><feGaussianBlur stdDeviation="7"/></filter></defs>
<rect width="900" height="650" fill="url(#storyBg)"/>
<g opacity=".17" stroke="#73908b" strokeWidth=".55">{Array.from({length:23},(_,i)=><path key={'h'+i} d={`M 0 ${i*30} H 900`}/>)}{Array.from({length:31},(_,i)=><path key={'v'+i} d={`M ${i*30} 0 V 650`}/>)}</g>
{groups.map((g,i)=><g key={i}><circle cx={g.cx} cy={g.cy} r={135-55*connected} fill="none" stroke={g.tone} opacity={.22+connected*.35} strokeWidth="1" strokeDasharray={connected?'3 9':'2 12'}/><text x={g.cx} y={g.cy-148+connected*57} fill={g.tone} textAnchor="middle" fontSize="10" letterSpacing="3" opacity={.65+connected*.35}>{g.name}</text></g>)}
{connected>.01&&<g opacity={connected} stroke="#e7a87e" strokeWidth="1.4" fill="none">{groups.map((g,i)=><path key={i} d={`M410 307 Q ${410+(g.cx-410)*.4} ${307+(g.cy-307)*.8-65} ${g.cx} ${g.cy}`} strokeDasharray="850" strokeDashoffset={850*(1-connected)} />)}<circle cx="410" cy="307" r={105} strokeWidth=".65" opacity=".5" strokeDasharray="3 10"/><circle cx="410" cy="307" r={65} fill="#e7a87e" fillOpacity=".04" strokeWidth=".5"/></g>}
{objects.map(item=><Node key={item.id} item={item} t={t} focus={focus} highlight={connected>.38} selected={model} onSelect={setFocus}/>)}
{connected>.45&&<g opacity={clamp((connected-.45)*2)}><rect x="335" y="265" width="150" height="84" rx="2" fill="#101c1d" stroke="#e7a87e" strokeWidth="1.5"/><text x="410" y="300" fill="#f1c09b" fontSize="11" letterSpacing="2" textAnchor="middle">SHARED</text><text x="410" y="319" fill="#d8e0d7" fontSize="11" letterSpacing="2" textAnchor="middle">DEFINITIONS</text></g>}
<g fill="#7eaaa4" fontSize="9" letterSpacing="1.5"><text x="24" y="34">ENGINEERING SYSTEM / CONCEPTUAL RECONSTRUCTION</text><text x="24" y="626">DRAWINGS · CIRCUITS · COMPONENTS · MEASUREMENTS · SPECS</text><text x="876" y="626" textAnchor="end">NO CONFIDENTIAL CAD DATA</text></g>
</svg>
}
function ModelReuse({model,setModel,circuit,setCircuit}){
const cfg=[{size:0,branch:[72,35]},{size:1,branch:[80,24]},{size:2,branch:[86,40]}][model];
return <div className="reuse-sim"><div className="reuse-copy"><span>THE DESIGN ADAPTS / 0{model+1}</span><strong>{['STANDARD CONFIGURATION','EXTENDED VEHICLE','ALTERNATE LAYOUT'][model]}</strong></div><svg viewBox="0 0 700 260" aria-label="Illustrative harness route morphing across vehicle configurations"><path d={`M55 55 H${575+cfg.size*50} L${650+cfg.size*10} 130 L${575+cfg.size*50} 210 H55 L30 130 Z`} fill="none" stroke="#9aaba3" strokeWidth="1.5" opacity=".7"/><path d={`M65 130 H${555+cfg.size*42}`} stroke="#e8b082" strokeWidth="9" strokeLinecap="round" className="reuse-route"/><path d={`M190 130 V72 H${355+cfg.size*15} M365 130 V190 H${440+cfg.size*10} M510 130 V78 H${595+cfg.size*20}`} stroke="#e8b082" fill="none" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="reuse-route"/>{circuit&&<path d="M288 130 V203 H320" stroke="#b4d4c0" strokeWidth="4" fill="none" className="reuse-route"/>}</svg><div className="reuse-buttons"><div>{['A','B','C'].map((v,i)=><button key={v} aria-pressed={model===i} className={model===i?'on':''} onClick={()=>setModel(i)}>MODEL {v}</button>)}</div><button onClick={()=>setCircuit(v=>!v)}>{circuit?'− REMOVE CIRCUIT':'+ ADD CIRCUIT'}</button></div></div>
}
export default function NetworkStory(){
const track=useRef(null);const[scroll,setScroll]=useState(0),[manual,setManual]=useState(null),[focus,setFocus]=useState(2),[model,setModel]=useState(0),[circuit,setCircuit]=useState(false);
useEffect(()=>{let frame;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!track.current)return;const r=track.current.getBoundingClientRect();setScroll(clamp(-r.top/Math.max(1,r.height-innerHeight)))})};update();addEventListener('scroll',update,{passive:true});addEventListener('resize',update);return()=>{removeEventListener('scroll',update);removeEventListener('resize',update);cancelAnimationFrame(frame)}},[]);
const value=manual===null?scroll:manual,scene=Math.min(4,Math.floor(value*5));
const s=story[scene];
return <section className="network-chapter" id="transformation"><div className="network-preface"><span>AN INTERACTIVE EXPLORATION / 01—05</span><h2>From <em>fragmentation</em><br/>to connection.</h2><p>Scroll through the system, or take control. The same thinking powers electrical design, software automation, and continuous improvement.</p></div><div className="network-track" ref={track}><div className="network-sticky"><div className="network-copy"><span className="network-eyebrow">{s.eyebrow}</span><div key={scene} className="network-headline"><h3>{s.title}<br/><em>{s.em}</em></h3><p>{s.copy}</p></div><div className="network-stages">{story.map((item,i)=><button type="button" aria-label={'Go to '+item.eyebrow} aria-pressed={scene===i} key={i} className={scene===i?'is-current':''} onClick={()=>setManual(i/5+.095)}><span>0{i+1}</span><i/></button>)}</div><span className="network-hint">{manual===null?'SCROLL TO TRANSFORM ↓':'MANUAL EXPLORATION'}</span></div><div className="network-stage"><NetworkScene progress={scroll} manual={manual} model={model} focus={focus} setFocus={setFocus}/><div className="network-overlay"><span>{value<.47?'DISCONNECTED / MULTIPLE SOURCES':'CONNECTED / SHARED FOUNDATION'}</span><span>{Math.round(value*100)}% / STORY</span></div></div><div className="network-lower"><label htmlFor="network-range">SCRUB THE TRANSFORMATION</label><input id="network-range" type="range" min="0" max="100" value={Math.round(value*100)} onChange={e=>setManual(Number(e.target.value)/100)}/><button className="network-return" onClick={()=>setManual(null)}>{manual===null?'SCROLL MODE ACTIVE':'↺ RETURN TO SCROLL'}</button></div></div></div><div className="network-reuse"><div className="reuse-heading"><span>ACT 06 / REUSE IN MOTION</span><h2>A new model shouldn't<br/>mean <em>starting over.</em></h2><p>The shared routing concept stays recognizable while model dimensions and component requirements change. Try the controls.</p></div><ModelReuse model={model} setModel={setModel} circuit={circuit} setCircuit={setCircuit}/><div className="reuse-disclosure">ILLUSTRATIVE MODEL ONLY · ROUTING DIMENSIONS AND CIRCUITS ARE SYNTHETIC</div></div></section>
}