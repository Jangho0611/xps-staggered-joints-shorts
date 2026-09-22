import React, {useEffect,useState} from 'react';
import {AbsoluteFill,Composition,Img,staticFile,registerRoot,delayRender,continueRender} from 'remotion';
import {PRETENDARD} from './scene5/fonts';
const fontWait=delayRender('Cover Black');
new FontFace(PRETENDARD,`url(${staticFile('assets/fonts/Pretendard-ExtraBold.woff2')})`,{weight:'900'}).load().then(f=>{document.fonts.add(f);continueRender(fontWait);});
// Only the connected outside background is masked for compositing.
// Enclosed face/body pixels, proportions, pose and original file remain untouched.
const Character=()=>{
 const [src,setSrc]=useState('');const [wait]=useState(()=>delayRender('Canonical mask'));
 useEffect(()=>{const im=new Image();im.onload=()=>{
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;
  const x=c.getContext('2d')!;x.drawImage(im,0,0);const p=x.getImageData(0,0,c.width,c.height);const d=p.data;
  const seen=new Uint8Array(c.width*c.height);const q:number[]=[];
  const add=(i:number)=>{if(i<0||i>=seen.length||seen[i])return;seen[i]=1;const k=i*4;const lo=Math.min(d[k],d[k+1],d[k+2]),hi=Math.max(d[k],d[k+1],d[k+2]);if(lo>170&&hi-lo<35)q.push(i);};
  for(let a=0;a<c.width;a++){add(a);add((c.height-1)*c.width+a);}for(let a=0;a<c.height;a++){add(a*c.width);add(a*c.width+c.width-1);}
  for(let a=0;a<q.length;a++){const i=q[a];d[i*4+3]=0;if(i%c.width)add(i-1);if(i%c.width<c.width-1)add(i+1);add(i-c.width);add(i+c.width);}
  x.putImageData(p,0,0);setSrc(c.toDataURL());continueRender(wait);
 };im.src=staticFile('references/characters/small-daesan-pose-point-right-v1.png');},[wait]);
 return src?<Img src={src} style={{position:'absolute',left:0,top:1080,width:320,height:'auto'}}/>:null;
};
const Cover=()=> <AbsoluteFill style={{fontFamily:PRETENDARD,background:'#F7F8FA'}}>
 <div style={{
 position:'absolute',
 left:0,
 top:0,
 width:1080,
 height:1920,
 overflow:'hidden'
}}>
 <Img
  src={staticFile('covers/source/scene03-cover-hero-candidate-2.png')}
  style={{
   position:'absolute',
   width:1080,
   height:1920,
   top:0,
   left:0,
   objectFit:'cover'
  }}
 />
</div>
 <div style={{position:'absolute',left:53,top:341,width:717,height:353,borderRadius:36,background:'rgba(197,176,244,0.92)',border:'1px solid #e6e6e6',boxSizing:'border-box'}}/>
 <div style={{position:'absolute',left:90,top:279,width:8,height:30,background:'#1f1d3d'}}/>
 <div style={{position:'absolute',left:114,top:279,fontSize:30,fontWeight:600,color:'#000000'}}>건축자재 상식 · XPS 시공</div>
 <div style={{position:'absolute',left:710,top:370,width:12,height:12,borderRadius:12,background:'#1f1d3d'}}/>
 <div style={{position:'absolute',left:728,top:370,width:12,height:12,borderRadius:12,background:'#e6e6e6'}}/>
 <div style={{position:'absolute',left:92,top:438,fontSize:60,lineHeight:'72px',fontWeight:600,letterSpacing:-1.8,color:'#000000'}}><span style={{fontWeight:900,color:'#000000'}}>XPS 단열재</span></div>
 <div style={{position:'absolute',left:92,top:530,fontSize:60,lineHeight:'72px',fontWeight:900,letterSpacing:-1.8,color:'#000000'}}>한 겹 <span style={{color:'#1F5E3B'}}>vs</span> 두 겹</div>
 <div style={{position:'absolute',left:92,top:613,width:112,height:4,background:'#1F5E3B'}}/>
 <div style={{
  position:'absolute',
  left:92,
  top:625,
  fontSize:54,
  lineHeight:'64px',
  fontWeight:900,
  letterSpacing:-1.8,
  color:'#1F5E3B'
 }}>무슨 차이?</div>
 <Character/>
 <Img src={staticFile('assets/logos/daesanlogo2.png')} style={{position:'absolute',left:660,top:1370,width:78,height:78,objectFit:'contain'}}/>
 <div style={{position:'absolute',left:750,top:1377,fontWeight:900,fontSize:46,lineHeight:1,color:'#123628'}}>DAESAN</div>
 <div style={{position:'absolute',left:750,top:1431,fontWeight:500,fontSize:26,lineHeight:1,color:'#123628'}}>대산종합건축자재</div>
</AbsoluteFill>;
registerRoot(()=> <Composition id="XpsStaggeredCoverV5" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920}/>);
