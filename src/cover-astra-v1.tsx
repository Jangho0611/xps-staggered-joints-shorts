import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Composition, Img, staticFile, registerRoot, delayRender, continueRender, cancelRender} from 'remotion';
import {PRETENDARD} from './scene5/fonts';

const blackWait=delayRender('Approved series Black font');
new FontFace(PRETENDARD,`url(${staticFile('assets/fonts/Pretendard-Black.ttf')})`,{weight:'900'})
 .load().then(font=>{document.fonts.add(font);continueRender(blackWait);}).catch(cancelRender);

// Same connected exterior-background removal used by approved XPS covers.
// No resynthesis, recoloring, pose manipulation, or changes to enclosed pixels.
const PointRight=()=>{
 const [src,setSrc]=useState('');
 const [wait]=useState(()=>delayRender('Point-right exterior mask'));
 useEffect(()=>{
  const im=new Image();
  im.onerror=()=>cancelRender(new Error('Point-right asset could not load'));
  im.onload=()=>{
   const canvas=document.createElement('canvas');canvas.width=im.width;canvas.height=im.height;
   const ctx=canvas.getContext('2d')!;ctx.drawImage(im,0,0);
   const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),d=pixels.data;
   const seen=new Uint8Array(canvas.width*canvas.height),queue:number[]=[];
   const add=(i:number)=>{
    if(i<0||i>=seen.length||seen[i])return;
    seen[i]=1;const k=i*4,lo=Math.min(d[k],d[k+1],d[k+2]),hi=Math.max(d[k],d[k+1],d[k+2]);
    if(lo>170&&hi-lo<35)queue.push(i);
   };
   for(let x=0;x<canvas.width;x++){add(x);add((canvas.height-1)*canvas.width+x);}
   for(let y=0;y<canvas.height;y++){add(y*canvas.width);add(y*canvas.width+canvas.width-1);}
   for(let n=0;n<queue.length;n++){
    const i=queue[n];d[i*4+3]=0;
    if(i%canvas.width)add(i-1);
    if(i%canvas.width<canvas.width-1)add(i+1);
    add(i-canvas.width);add(i+canvas.width);
   }
   ctx.putImageData(pixels,0,0);setSrc(canvas.toDataURL());continueRender(wait);
  };
  im.src=staticFile('references/characters/small-daesan-pose-point-right-v1.png');
 },[wait]);
 return src?<Img src={src} style={{position:'absolute',left:0,top:1010,width:320,height:'auto'}}/>:null;
};

// Approval references: XPS Ep1 cover-v2 + Ep2 cover-v3, viewed directly.
// Card/category/brand use their fixed series geometry. No v1-v6 cover imports.
const Cover=()=> <AbsoluteFill style={{fontFamily:PRETENDARD,background:'#BDC1C7',overflow:'hidden'}}>
 {/* Only clean photographic background at source y=0..250 is visible.
     The original category/card/product/brand are entirely outside this viewport.
     This reuses the approved gray atmosphere; no gradient overlay is added. */}
 <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
  <Img src={staticFile('covers/source/xps-series-approved-cover2-background-source.png')} style={{position:'absolute',left:0,top:0,width:1080,height:1920*1920/250,maxWidth:'none'}}/>
 </div>
 {/* Hero source selection x=120..922, y=570..1140. Uniform scale only.
     Neither upper scene captions nor the y1585 footer can enter the crop.
     922px-wide unframed product fills the main visual area, not a UI card. */}
 <div style={{position:'absolute',left:70,top:710,width:802*1.15,height:570*1.15,overflow:'hidden'}}>
  <Img src={staticFile('covers/source/scene03-cover-hero-candidate-2.png')} style={{position:'absolute',left:-120*1.15,top:-570*1.15,width:1080*1.15,height:1920*1.15,maxWidth:'none'}}/>
 </div>
 <div style={{position:'absolute',left:53,top:341,width:717,height:353,borderRadius:36,background:'rgba(245,233,212,0.92)',border:'1px solid #e3e8ee',boxSizing:'border-box'}}/>
 <div style={{position:'absolute',left:90,top:279,width:8,height:30,background:'#533afd'}}/>
 <div style={{position:'absolute',left:114,top:279,fontSize:30,fontWeight:600,color:'#0d253d'}}>건축자재 상식 · XPS 시공</div>
 <div style={{position:'absolute',left:710,top:370,width:12,height:12,borderRadius:12,background:'#533afd'}}/>
 <div style={{position:'absolute',left:728,top:370,width:12,height:12,borderRadius:12,background:'#e3e8ee'}}/>
 <div style={{position:'absolute',left:92,top:423,fontSize:60,lineHeight:'72px',fontWeight:900,letterSpacing:-1.8,color:'#273951',whiteSpace:'nowrap'}}>
  <div><span style={{color:'#9D4763'}}>XPS</span> 단열재</div>
  <div>한 겹 <span style={{fontWeight:600}}>vs</span> 두 겹</div>
  <div style={{color:'#9D4763'}}>무슨 차이?</div>
 </div>
 <div style={{position:'absolute',left:92,top:654,width:112,height:4,background:'#9D4763'}}/>
 <PointRight/>
 <Img src={staticFile('assets/logos/daesanlogo2.png')} style={{position:'absolute',left:660,top:1370,width:78,height:78,objectFit:'contain'}}/>
 <div style={{position:'absolute',left:750,top:1377,fontWeight:900,fontSize:46,lineHeight:1,color:'#123628'}}>DAESAN</div>
 <div style={{position:'absolute',left:750,top:1431,fontWeight:500,fontSize:26,lineHeight:1,color:'#123628'}}>대산종합건축자재</div>
</AbsoluteFill>;
const Square=()=> <AbsoluteFill style={{overflow:'hidden'}}><div style={{position:'absolute',left:0,top:-420,width:1080,height:1920}}><Cover/></div></AbsoluteFill>;
registerRoot(()=> <>
 <Composition id="XpsCoverAstraV1" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920}/>
 <Composition id="XpsCoverAstraV1Square" component={Square} durationInFrames={1} fps={30} width={1080} height={1080}/>
</>);
