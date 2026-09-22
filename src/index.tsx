import React from 'react';
import {AbsoluteFill,Audio,Composition,Sequence,registerRoot,staticFile,useCurrentFrame,interpolate,Easing} from 'remotion';
import {Ending} from './Ending';
import {PRETENDARD} from './scene5/fonts';
import {DURATIONS} from './timing';
const C={bg:'#F7F5F0',ink:'#202B28',muted:'#63716B',pink:'#EAC4CE',edge:'#AB7C8B',accent:'#52634D',line:'#D7DDD4'};
const ease=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)});
const Text=({x,y,children,size=30,fill=C.muted,anchor='start'}:{x:number;y:number;children:React.ReactNode;size?:number;fill?:string;anchor?:'start'|'middle'|'end'})=><text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} fontFamily={PRETENDARD} fontWeight={600}>{children}</text>;
// Equal 260px boards. End boards are cropped by the viewing window.
const Layer=({y,offset=0,height=112,opacity=1}:{y:number;offset?:number;height?:number;opacity?:number})=><g opacity={opacity}>
 <svg x={0} y={y} width={780} height={height+12} viewBox={`0 0 780 ${height+12}`} overflow="hidden">
 {[-1,0,1,2,3].map(i=><g key={i} transform={`translate(${i*260+offset},0)`}><rect x={1} y={1} width={258} height={height} fill={C.pink} stroke={C.edge} strokeWidth={2}/><path d={`M 1 ${height-12} H 259`} stroke={C.edge} opacity={.3}/></g>)}
 </svg>
 </g>;
const Joint=({x,y,h=112}:{x:number;y:number;h?:number})=><line x1={x} y1={y} x2={x} y2={y+h} stroke={C.accent} strokeWidth={5}/>;
const Double=({top=130,gap=0,offset=130,alpha=1,guides=true}:{top?:number;gap?:number;offset?:number;alpha?:number;guides?:boolean})=><g>
 <Layer y={top+112+gap}/><Joint x={260} y={top+112+gap}/><Joint x={520} y={top+112+gap}/>
 {guides&&[260,520].map(x=><line key={x} x1={x} y1={top-25} x2={x} y2={top+112+gap} stroke={C.accent} strokeWidth={2} strokeDasharray="7 8" opacity={.5}/>)}
 <Layer y={top} offset={offset} opacity={alpha}/>
 {[offset,offset+260,offset+520].map(x=><g key={x} opacity={alpha}><Joint x={x} y={top}/></g>)}
 </g>;
const captions=[['두꺼운 XPS','한 장이면 끝?'],['1P 시공','이음부가 한 층에 그대로'],['2P 시공의 핵심','이음부 엇갈림'],['한 층의 이음부를','다른 층이 덮는다'],['2P = 단순히 두 장이 아닙니다','이음부를 엇갈리게 시공']];
const Scene=({index}:{index:number})=>{
 const f=useCurrentFrame(); const p=ease(f,25,70);const settle=ease(f,75,120);
 return <AbsoluteFill style={{background:C.bg,fontFamily:PRETENDARD,color:C.ink}}>
 <Audio src={staticFile(`assets/audio/scene${String(index+1).padStart(2,'0')}-tts-v1.mp3`)}/>
 <div style={{position:'absolute',left:90,top:205,fontSize:27,fontWeight:600,letterSpacing:2,color:C.muted}}>XPS  /  시공 디테일</div>
 <div style={{position:'absolute',left:90,top:298,width:840,fontSize:index===4?51:68,fontWeight:800,lineHeight:1.34,letterSpacing:-2}}>{captions[index].map((t,i)=><div key={t} style={{whiteSpace:'nowrap',color:i===1?C.accent:C.ink}}>{t}</div>)}</div>
 <div style={{position:'absolute',left:90,top:530,width:840,height:2,background:C.line}}/>
 <svg style={{position:'absolute',left:90,top:610,width:840,height:860}} viewBox="-30 0 840 860">
 {index===0&&<>
 <Text x={0} y={90}>XPS 판재 · 한 층</Text><Layer y={160} height={220}/>
 {[260,520].map(x=><g key={x}><Joint x={x} y={160} h={220}/><line x1={x} y1={400} x2={x} y2={455} stroke={C.accent} strokeWidth={2}/></g>)}
 <Text x={390} y={520} anchor="middle" size={38} fill={C.ink}>판재 사이에는 이음부가 있습니다</Text>
 </>}
 {index===1&&<>
 <Text x={0} y={95}>한 겹으로 나란히 시공</Text><Layer y={170} height={220}/>
 {[260,520].map(x=><g key={x}><Joint x={x} y={170} h={220}/><line x1={x} y1={412} x2={x} y2={480} stroke={C.accent} strokeWidth={2}/><circle cx={x} cy={490} r={7} fill={C.accent}/></g>)}
 <Text x={390} y={553} anchor="middle" size={42} fill={C.accent}>판재 접합선 = 이음부</Text>
 <Text x={390} y={625} anchor="middle" size={29}>균열이 아닌, 판재와 판재의 경계</Text>
 </>}
 {index===2&&<>
 <Text x={0} y={45}>두 층의 단면 구조</Text>
 <Double top={140+(1-p)*-60} gap={105*(1-settle)+(1-p)*60} offset={130+65*(1-settle)} alpha={p}/>
 <Text x={0} y={110} fill={C.accent}>두 번째 층</Text>
 <Text x={0} y={500}>첫 번째 층</Text>
 <path d="M260 560 V595 H390 V560" fill="none" stroke={C.accent} strokeWidth={3}/>
 <Text x={390} y={665} anchor="middle" size={40} fill={C.ink}>서로 다른 이음부 위치</Text>
 <Text x={390} y={735} anchor="middle" size={27}>점선은 아래층 이음부의 위치 표시</Text>
 </>}
 {index===3&&<>
 <Text x={0} y={45} size={36} fill={C.ink}>1P</Text><Layer y={82}/><Joint x={260} y={82}/><Joint x={520} y={82}/>
 <Text x={390} y={252} anchor="middle">이음부가 한 층에 남는 구조</Text>
 <line x1={0} y1={300} x2={780} y2={300} stroke={C.line} strokeWidth={2}/>
 <Text x={0} y={365} size={36} fill={C.ink}>2P · 엇갈림</Text><Double top={410} guides={false}/>
 {[260,520].map(x=><g key={x}><rect x={x-54} y={418} width={108} height={95} rx={6} fill="none" stroke={C.accent} strokeWidth={3}/><line x1={x} y1={642} x2={x} y2={685} stroke={C.accent} strokeWidth={2}/></g>)}
 <Text x={390} y={744} anchor="middle" size={36} fill={C.accent}>아래층 이음부를 위층 판재가 덮음</Text>
 </>}
 {index===4&&<>
 <Text x={0} y={80}>완성된 2P 엇갈림 구조</Text><Double top={155} guides={false}/>
 {[130,390,650].map(x=><circle key={x} cx={x} cy={138} r={7} fill={C.accent}/>)}
 {[260,520].map(x=><circle key={x} cx={x} cy={400} r={7} fill={C.accent}/>)}
 <Text x={390} y={520} anchor="middle" size={40} fill={C.ink}>두께만이 아니라</Text>
 <Text x={390} y={590} anchor="middle" size={48} fill={C.accent}>이음부 디테일</Text>
 </>}
 </svg>
 <div style={{position:'absolute',left:90,top:1520,fontSize:24,color:C.muted}}>교육용 단면 도식 · 실제 치수와 무관</div>
 </AbsoluteFill>;
};
const Film=()=>{let start=0;return <AbsoluteFill>{DURATIONS.map((n,i)=>{const at=start;start+=n;return <Sequence key={i} from={at} durationInFrames={n}><Scene index={i}/></Sequence>})}<Sequence from={start} durationInFrames={170}><Ending/></Sequence></AbsoluteFill>};
const Root=()=> <><Composition id="XpsStaggered" component={Film} width={1080} height={1920} fps={30} durationInFrames={DURATIONS.reduce((a,b)=>a+b,0)+170}/>{DURATIONS.map((n,i)=><Composition key={i} id={`Scene0${i+1}`} component={Scene} defaultProps={{index:i}} width={1080} height={1920} fps={30} durationInFrames={n}/>)}<Composition id="Ending" component={Ending} width={1080} height={1920} fps={30} durationInFrames={170}/></>;
registerRoot(Root);
