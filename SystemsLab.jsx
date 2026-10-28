import React,{useEffect,useRef,useState} from 'react';
import './experience.css';
const setups=[
{name:'Model A',ends:[[78,18],[86,36],[82,76],[66,86],[28,83]]},
{name:'Model B',ends:[[89,23],[75,14],[88,72],[55,90],[18,68]]},
{name:'Model C',ends:[[75,12],[91,43],[72,88],[42,78],[20,27]]}
];
const routes=['M 20 50 L 80 50','M 42 50 L 42 27 L 68 27','M 55 50 L 55 75 L 70 75','M 70 50 L 70 35 L 83 35','M 32 50 L 32 71 L 18 71'];
const wires=['M 14 54 Q 21 9 78 18','M 13 45 Q 58 85 86 36','M 14 58 Q 55 10 82 76','M 12 50 Q 95 60 66 86','M 14 47 Q 40 94 28 83','M 12 55 Q 74 15 83 35','M 14 49 Q 48 83 70 75'];
function CableScene({phase,model,circuit}){
const manual=phase<2, data=setups[model];
return <div className={'cable-scene '+(manual?'mode-manual':'mode-harness')}>
<div className="scene-head"><span className="scene-live"/> LIVE SYSTEM VIEW <span className="scene-head-right">{manual?'INDIVIDUAL ROUTING':'MODULAR HARNESS'}</span></div>
<svg viewBox="0 0 1000 590" role="img" aria-label={manual?'Individual wire routing diagram':'Reusable branch harness routing diagram'} className="vehicle-svg">
<defs><pattern id="lab-grid" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M 35 0 L 0 0 0 35" fill="none" stroke="#54716e" strokeWidth=".35"/></pattern><filter id="lab-glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<rect width="1000" height="590" fill="url(#lab-grid)" opacity=".45"/>
<g className="vehicle-outline" fill="none" stroke="#789392" strokeWidth="2">
<path d={model===1?'M 110 115 L 760 115 Q 820 115 855 165 L 910 285 L 854 460 Q 829 495 773 495 L 110 495 Q 78 495 78 465 L 78 145 Q 78 115 110 115Z':model===2?'M 130 90 L 775 90 L 925 220 L 925 385 L 778 510 L 130 510 Q 80 510 80 460 L 80 140 Q 80 90 130 90Z':'M 110 108 L 775 108 Q 830 108 850 155 L 930 292 L 850 435 Q 830 483 775 483 L 110 483 Q 78 483 78 450 L 78 140 Q 78 108 110 108Z'} />
<path d="M 260 115 L 260 482 M 760 115 L 760 482 M 260 285 L 760 285" strokeDasharray="7 12" opacity=".35"/>
</g>
<g className="components">{data.ends.map(([x,y],i)=><g key={i} transform={`translate(${x*9.4},${y*5.5})`}><rect x="-17" y="-15" width="34" height="30" rx="4" fill="#142829" stroke="#88a19e" strokeWidth="2"/><circle r="5" fill={manual?'#f0a580':'#c9f584'}/><text y="-23" fill="#9bb0ad" fontSize="15" textAnchor="middle">C{i+1}</text></g>)}</g>
<g transform="translate(100,285)"><rect x="-26" y="-24" width="52" height="48" rx="7" fill="#1b3430" stroke="#c9f584" strokeWidth="2"/><text y="5" textAnchor="middle" fill="#c9f584" fontSize="15" fontWeight="700">PWR</text></g>
{manual?<g className="manual-wires" fill="none" strokeLinecap="round">{wires.map((d,i)=><path key={i} d={d} transform="translate(0 0) scale(10 5.9)" vectorEffect="non-scaling-stroke" stroke={i%2?'#f1a58c':'#d4ad8a'} strokeWidth="2.7" style={{animationDelay:i*.13+'s'}}/>)}</g>:<g className="harness-lines" fill="none" stroke="#c9f584" strokeLinecap="round" strokeLinejoin="round" filter="url(#lab-glow)"><path className="harness-backbone" d="M 108 295 L 795 295" strokeWidth="11"/>{data.ends.map(([x,y],i)=><path key={i} className="branch-line" d={`M ${(28+i*13)*9.4} 295 L ${(28+i*13)*9.4} ${y*5.5} L ${x*9.4} ${y*5.5}`} strokeWidth="4.5" style={{animationDelay:i*.15+'s'}}/>)}{circuit>0&&<path className="new-circuit" d="M 520 295 L 520 165 L 670 165" stroke="#f5c987" strokeWidth="4"/>}</g>}
{circuit>0&&!manual&&<g transform="translate(670,165)"><circle r="15" fill="#f5c987"/><text x="23" y="5" fill="#f5c987" fontSize="16">NEW CIRCUIT</text></g>}
</svg>
<div className="scene-foot"><span>ILLUSTRATIVE GEOMETRY • NOT PRODUCTION DATA</span><span>VIEW {model+1} / 3</span></div>
</div>
}
export default function SystemsLab(){
const scrollRef=useRef(null);const[progress,setProgress]=useState(0);const[override,setOverride]=useState(null);const[model,setModel]=useState(0);const[circuit,setCircuit]=useState(0);
useEffect(()=>{let frame=0;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{let r=scrollRef.current?.getBoundingClientRect();if(!r)return;let delta=Math.max(1,r.height-innerHeight);setProgress(Math.max(0,Math.min(1,-r.top/delta)))})};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[]);
let phase=override===null?Math.min(3,Math.floor(progress*4)):override;
const titles=['The old workflow.','One wire at a time.','A smarter system.','Built to adapt.'];
const descriptions=['Disconnected drawings. Each design begins from individual routes.','Every branch needs manual installation and coordination. Complexity grows with every circuit.','A shared backbone organizes connections into a repeatable harness.','Change the model or add a circuit. The same system adapts instead of starting over.'];
return <section id="interactive-lab" className="lab-scroll" ref={scrollRef}><div className="lab-sticky">
<div className="lab-intro"><span className="lab-kicker">INTERACTIVE CASE STUDY / 01</span><h2>Don't just see the improvement.<br/><em>Experience it.</em></h2><p>Scroll to transform an electrical workflow. Then experiment with the system yourself.</p></div>
<div className="lab-layout"><div className="lab-copy"><div className="lab-fraction">0{phase+1} <span>/ 04</span></div><h3 key={phase}>{titles[phase]}</h3><p key={'d'+phase}>{descriptions[phase]}</p><div className="lab-track">{[0,1,2,3].map(i=><button key={i} type="button" aria-label={'View stage '+(i+1)} aria-pressed={phase===i} className={phase===i?'active':''} onClick={()=>setOverride(i)}/>)}</div><span className="lab-note">{override===null?'SCROLL TO ADVANCE':'MANUAL EXPLORATION ENABLED'}</span>{override!==null&&<button className="reset-scroll" onClick={()=>setOverride(null)}>↺ RESUME SCROLL CONTROL</button>}</div>
<div className="lab-visual"><CableScene phase={phase} model={model} circuit={circuit}/><div className="lab-controls"><div className="lab-control-group"><span>ROUTING MODE</span><div className="lab-switch"><button className={phase<2?'selected':''} aria-pressed={phase<2} onClick={()=>setOverride(1)}>Individual</button><button className={phase>=2?'selected':''} aria-pressed={phase>=2} onClick={()=>setOverride(3)}>Harness</button></div></div><div className="lab-control-group"><span>VEHICLE LAYOUT</span><div className="lab-switch">{setups.map((s,i)=><button key={s.name} className={model===i?'selected':''} aria-pressed={model===i} onClick={()=>{setModel(i);setOverride(3)}}>{String.fromCharCode(65+i)}</button>)}</div></div><div className="lab-control-group"><span>EXTENSIBILITY</span><button className="lab-add" onClick={()=>{setCircuit(c=>c===0?1:0);setOverride(3)}}>{circuit?'− Remove circuit':'+ Add circuit'}</button></div></div></div></div>
<div className="lab-bottom"><span>DESIGN PRINCIPLE: STANDARDIZE THE REPEATABLE. ADAPT THE VARIABLE.</span><span>↓ KEEP SCROLLING</span></div>
</div></section>
}
