import React,{useEffect,useState} from 'react';
import {
  AbsoluteFill,
  Composition,
  Img,
  staticFile,
  registerRoot,
  delayRender,
  continueRender
} from 'remotion';
import {PRETENDARD} from './scene5/fonts';

const fontWait=delayRender('Cover Black');

new FontFace(
  PRETENDARD,
  `url(${staticFile('assets/fonts/Pretendard-ExtraBold.woff2')})`,
  {weight:'900'}
).load().then(f=>{
  document.fonts.add(f);
  continueRender(fontWait);
});

const Character=()=>{
  const [src,setSrc]=useState('');
  const [wait]=useState(()=>delayRender('Point right mask'));

  useEffect(()=>{
    const im=new Image();

    im.onload=()=>{
      const c=document.createElement('canvas');
      c.width=im.width;
      c.height=im.height;

      const x=c.getContext('2d')!;
      x.drawImage(im,0,0);

      const p=x.getImageData(0,0,c.width,c.height);
      const d=p.data;
      const seen=new Uint8Array(c.width*c.height);
      const q:number[]=[];

      const add=(i:number)=>{
        if(i<0||i>=seen.length||seen[i]) return;

        seen[i]=1;

        const k=i*4;
        const lo=Math.min(d[k],d[k+1],d[k+2]);
        const hi=Math.max(d[k],d[k+1],d[k+2]);

        if(lo>170&&hi-lo<35) q.push(i);
      };

      for(let a=0;a<c.width;a++){
        add(a);
        add((c.height-1)*c.width+a);
      }

      for(let a=0;a<c.height;a++){
        add(a*c.width);
        add(a*c.width+c.width-1);
      }

      for(let a=0;a<q.length;a++){
        const i=q[a];
        d[i*4+3]=0;

        if(i%c.width) add(i-1);
        if(i%c.width<c.width-1) add(i+1);

        add(i-c.width);
        add(i+c.width);
      }

      x.putImageData(p,0,0);
      setSrc(c.toDataURL());
      continueRender(wait);
    };

    im.src=staticFile(
      'references/characters/small-daesan-pose-point-right-v1.png'
    );
  },[wait]);

  return src ? (
    <Img
      src={src}
      style={{
        position:'absolute',
        left:55,
        top:1055,
        width:360,
        height:'auto'
      }}
    />
  ) : null;
};

const Cover=()=>(
  <AbsoluteFill
    style={{
      fontFamily:PRETENDARD,
      background:'#F7F8FA',
      overflow:'hidden'
    }}
  >
    <Img
      src={staticFile(
        'covers/source/scene03-cover-hero-candidate-4.png'
      )}
      style={{
        position:'absolute',
        width:1080,
        height:1920,
        left:0,
        top:0,
        objectFit:'cover'
      }}
    />

    <div
      style={{
        position:'absolute',
        left:55,
        top:315,
        width:760,
        height:405,
        borderRadius:38,
        background:'rgba(247,248,250,0.94)',
        border:'1px solid rgba(20,54,40,0.12)',
        boxSizing:'border-box'
      }}
    />

    <div
      style={{
        position:'absolute',
        left:92,
        top:355,
        fontSize:29,
        fontWeight:700,
        color:'#456052'
      }}
    >
      건축자재 상식 · XPS 시공
    </div>

    <div
      style={{
        position:'absolute',
        left:92,
        top:425,
        fontSize:62,
        lineHeight:1.12,
        fontWeight:900,
        letterSpacing:-2.2,
        color:'#111111'
      }}
    >
      XPS 단열재
    </div>

    <div
      style={{
        position:'absolute',
        left:92,
        top:505,
        fontSize:66,
        lineHeight:1.12,
        fontWeight:900,
        letterSpacing:-2.5,
        color:'#111111'
      }}
    >
      한 겹 <span style={{color:'#1F5E3B'}}>vs</span> 두 겹
    </div>

    <div
      style={{
        position:'absolute',
        left:92,
        top:590,
        fontSize:66,
        lineHeight:1.12,
        fontWeight:900,
        letterSpacing:-2.5,
        color:'#1F5E3B'
      }}
    >
      무슨 차이?
    </div>

    <div
      style={{
        position:'absolute',
        left:92,
        top:682,
        width:118,
        height:5,
        borderRadius:5,
        background:'#1F5E3B'
      }}
    />

    <Character/>

    <Img
      src={staticFile('assets/logos/daesanlogo2.png')}
      style={{
        position:'absolute',
        left:660,
        top:1370,
        width:78,
        height:78,
        objectFit:'contain'
      }}
    />

    <div
      style={{
        position:'absolute',
        left:750,
        top:1377,
        fontWeight:900,
        fontSize:46,
        lineHeight:1,
        color:'#123628'
      }}
    >
      DAESAN
    </div>

    <div
      style={{
        position:'absolute',
        left:750,
        top:1431,
        fontWeight:500,
        fontSize:26,
        lineHeight:1,
        color:'#123628'
      }}
    >
      대산종합건축자재
    </div>
  </AbsoluteFill>
);

registerRoot(()=>(
  <Composition
    id="XpsStaggeredCoverV1"
    component={Cover}
    durationInFrames={1}
    fps={30}
    width={1080}
    height={1920}
  />
));
