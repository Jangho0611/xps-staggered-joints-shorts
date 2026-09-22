import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, registerRoot, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {Ending} from './Ending';
import {PRETENDARD} from './scene5/fonts';
import {DURATIONS} from './timing-v2';
const C={paper:'#EEEDE8',ink:'#292F2C',muted:'#65706A',concrete:'#BDBEB8',edge:'#999E97',floor:'#D6D4CD',pink:'#DEAFBF',pinkEdge:'#B57D92',foam:'#F1E4BB',joint:'#7E6B70',accent:'#3E6557'};
const ease=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)});
const linear=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const W=780,H=960,BW=390,BH=480,GAP=12;
const seamPath='M390 0 V960 M0 480 H780';
const topPath='M195 0 V960 M585 0 V960 M0 240 H780 M0 720 H780';
// Material texture is deterministic SVG geometry, without raster or generated media.
const Board=({x,y}:{x:number;y:number})=><g transform={`translate(${x},${y})`}>
 <rect x={GAP/2} y={GAP/2} width={BW-GAP} height={BH-GAP} fill={C.pink} stroke={C.pinkEdge} strokeWidth={1.5}/>
 <path d={`M${GAP/2+2} ${BH-GAP/2-6} H${BW-GAP/2-2} M${BW-GAP/2-6} ${GAP/2+2} V${BH-GAP/2-6}`} fill="none" stroke={C.pinkEdge} opacity={.36} strokeWidth={3}/>
 <path d={`M${GAP/2+3} ${BH-GAP/2-10} V${GAP/2+3} H${BW-GAP/2-10}`} fill="none" stroke="#F4D3DF" opacity={.65} strokeWidth={2}/>
 {Array.from({length:54},(_,i)=><circle key={i} cx={18+(i*97%350)} cy={20+(i*131%438)} r={i%3===0?1.7:.8} fill={i%2?C.pinkEdge:'#F7DBE5'} opacity={.22}/>)}
 </g>;
const Gun=({x,y,alpha}:{x:number;y:number;alpha:number})=>{
 const flip=x>600?-1:1;
 return <g transform={`translate(${x},${y}) scale(${flip},1)`} opacity={alpha}>
 <path d="M0 0 L69 -52 L102 -52" fill="none" stroke="#495550" strokeWidth={11} strokeLinecap="round"/>
 <path d="M1 -2 L68 -55" stroke="#D8DFDB" strokeWidth={4}/>
 <path d="M92 -64 H154 L165 -40 H119 L133 13 H108 L91 -40 Z" fill="#55645C" stroke="#34463C" strokeWidth={3}/>
 <path d="M133 -39 Q157 -4 129 -1" fill="none" stroke="#414D46" strokeWidth={5}/>
 <rect x={112} y={-158} width={43} height={94} rx={8} fill="#D1D7D2" stroke="#5A665D" strokeWidth={3}/>
 <rect x={112} y={-130} width={43} height={37} fill={C.accent}/>
 <path d="M123 -162 H144" stroke="#5A665D" strokeWidth={7}/>
 </g>;
};
const Foam=({progress=1,tool=false}:{progress?:number;tool?:boolean})=>{
 const distance=progress*(H+W), v=Math.min(H,distance),h=Math.max(0,distance-H);
 const x=distance<H?390:h,y=distance<H?v:480;
 return <g>
 <path d={`M390 0 V${v} ${h>0?`M0 480 H${h}`:''}`} fill="none" stroke="#C7B88A" strokeWidth={9} strokeLinecap="round"/>
 <path d={`M390 0 V${v} ${h>0?`M0 480 H${h}`:''}`} fill="none" stroke={C.foam} strokeWidth={6} strokeLinecap="round"/>
 {tool&&<Gun x={x} y={y} alpha={progress>0&&progress<1?1:0}/>}
 </g>;
};
const Wall=({scene,frame,duration}:{scene:number;frame:number;duration:number})=>{
 const foamStart=171,foamEnd=duration-22;
 const foam=scene===0?0:scene===1?linear(frame,foamStart,foamEnd):1;
 const second=scene>=2;
 const point2=scene===3?ease(frame,duration*.37,duration*.44):0;
 const finish=scene===3?ease(frame,duration*.72,duration*.79):0;
 const cut=scene===3?(1-finish)*(1-point2*.65):0;
 const guide=scene===2?ease(frame,145,165):scene===3?point2*(1-finish):scene===4?ease(frame,12,25)*(1-ease(frame,90,110)):0;
 const id=`wall-${scene}`;
 return <svg style={{position:'absolute',left:0,top:535,width:1080,height:1080}} viewBox="0 0 1080 1080">
 <defs>
 <clipPath id={`${id}-clip`}><rect width={W} height={H}/></clipPath>
 <mask id={`${id}-cut`}><rect x={-100} y={-100} width={1000} height={1200} fill="white"/><rect x={300} y={130} width={180} height={600} fill="black" opacity={cut}/></mask>
 </defs>
 {/* Concrete wall, visible return and floor establish the same job site in every scene. */}
 <path d="M88 40 H935 L1000 82 V1000 H88 Z" fill={C.concrete}/>
 <path d="M935 40 L1000 82 V1000 L935 968 Z" fill="#A5AAA3"/>
 {Array.from({length:90},(_,i)=><path key={i} d={`M${98+i*113%820} ${53+i*163%916} l${3+i%5} ${i%3}`} stroke="#8E948C" opacity={.2} strokeWidth={1.2}/>)}
 <path d="M0 1000 L935 968 L1080 1040 V1080 H0 Z" fill={C.floor}/>
 <path d="M88 1000 L935 968 L1080 1040" fill="none" stroke="#A6ABA2" strokeWidth={2}/>
 <path d="M190 1000 L125 1080 M600 986 L620 1080" stroke="#B4B6AE" strokeWidth={1}/>
 <g transform="translate(120,35)">
 {/* Thin physical edge of the insulation package, never an exploded UI card. */}
 <path d={`M${W} 8 l${second?22:12} 10 v${H-12} l-${second?22:12} -10 Z`} fill="#A87389"/>
 <path d={`M0 ${H} H${W} l${second?22:12} 10 H12 Z`} fill="#BA879B"/>
 <g clipPath={`url(#${id}-clip)`}>
 <rect width={W} height={H} fill={C.joint}/>
 {[0,1].flatMap(row=>[0,1].map(col=><Board key={`base${row}${col}`} x={col*BW} y={row*BH}/>))}
 {foam>0&&<Foam progress={foam}/>}
 {second&&<g mask={`url(#${id}-cut)`}>
 {[-1,0,1].flatMap((row,ri)=>[-1,0,1].map((col,ci)=>{
  const order=ri*3+ci;
  const p=scene===2?ease(frame,25+order*8,65+order*8):1;
  return <g key={`front${row}${col}`} opacity={p} transform={`translate(${(1-p)*55},${(1-p)*35})`}>
   <rect x={col*BW+195} y={row*BH+240} width={BW} height={BH} fill={C.joint}/>
   <Board x={col*BW+195} y={row*BH+240}/>
  </g>;
 }))}
 </g>}
 {guide>0&&<g opacity={guide}>
 <path d={seamPath} stroke="#F5F0DD" strokeWidth={6} strokeDasharray="15 12" fill="none"/>
 <path d={topPath} stroke={C.accent} strokeWidth={4} fill="none"/>
 </g>}
 {scene===3&&cut>.1&&<rect x={300} y={130} width={180} height={600} fill="none" stroke={C.accent} strokeWidth={2} strokeDasharray="9 8" opacity={cut}/>}
 </g>
 {scene===1&&foam>0&&foam<1&&<Gun x={foam*(H+W)<H?390:foam*(H+W)-H} y={foam*(H+W)<H?foam*(H+W):480} alpha={1}/>}
 </g>
 </svg>;
};
const Scene=({index}:{index:number})=>{
 const frame=useCurrentFrame();
 // A Sequence's video config retains master duration: use measured per-scene frames.
 const duration=DURATIONS[index];
 const secondLine=index===1?ease(frame,166,180):index===3?ease(frame,duration*.37,duration*.44):1;
 const final=index===3&&frame>duration*.76;
 const lines=index===0?['두꺼운 XPS','한 장이면 끝?']:index===1?['판재 사이 틈새','우레탄폼으로 충진']:index===2?['2P 시공의 핵심','이음부를 엇갈리게']:index===3?(final?['취약한 이음부 보완']:['① 틈새 충진','② 이음부 엇갈림']):['2P = 단순히 두 장이 아닙니다','틈새 처리 + 이음부 엇갈림'];
 let note=index===0?'벽체에 XPS 판재를 시공한 상태':index===1?'노즐이 판재 사이의 좁은 틈새를 따라 이동':index===2?'점선: 1층 이음부 · 실선: 2층 이음부':index===3?(final?'틈새 처리와 엇갈림을 함께':'2층 일부를 열어 본 설명용 투시'):frame<110?'점선: 1층 이음부 · 실선: 2층 이음부':'틈새 처리 + 이음부 엇갈림';
 return <AbsoluteFill style={{background:C.paper,fontFamily:PRETENDARD,color:C.ink}}>
 <Audio src={staticFile(`assets/audio/scene${String(index+1).padStart(2,'0')}-tts-v2.mp3`)}/>
 <div style={{position:'absolute',left:90,top:195,fontSize:27,fontWeight:600,letterSpacing:1,color:C.muted}}>XPS  /  벽체 시공</div>
 <div style={{position:'absolute',left:90,top:277,width:840,fontSize:index===4?51:65,fontWeight:800,lineHeight:1.34,letterSpacing:-1.8}}>
 {lines.map((t,i)=><div key={t} style={{whiteSpace:'nowrap',opacity:i===1?secondLine:1,color:i===1?C.accent:C.ink}}>{t}</div>)}
 </div>
 <Wall scene={index} frame={frame} duration={duration}/>
 <div style={{position:'absolute',left:90,top:465,fontSize:25,fontWeight:600,color:C.muted}}>{note}</div>
 <div style={{position:'absolute',left:90,top:1585,fontSize:22,fontWeight:500,color:C.muted}}>교육용 시공 도식 · 실제 치수와 무관</div>
 </AbsoluteFill>;
};
const Film=()=>{let at=0;return <AbsoluteFill>{DURATIONS.map((n,i)=>{const start=at;at+=n;return <Sequence key={i} from={start} durationInFrames={n}><Scene index={i}/></Sequence>})}<Sequence from={at} durationInFrames={170}><Ending/></Sequence></AbsoluteFill>};
const Root=()=> <><Composition id="XpsStaggeredV2" component={Film} width={1080} height={1920} fps={30} durationInFrames={DURATIONS.reduce((a,b)=>a+b,0)+170}/>{DURATIONS.map((n,i)=><Composition key={i} id={`Scene0${i+1}V2`} component={Scene} defaultProps={{index:i}} width={1080} height={1920} fps={30} durationInFrames={n}/>)}<Composition id="EndingV2" component={Ending} width={1080} height={1920} fps={30} durationInFrames={170}/></>;
registerRoot(Root);
