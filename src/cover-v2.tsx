import React,{useEffect,useState} from 'react';
import {
  AbsoluteFill,
  Composition,
  Img,
  staticFile,
  registerRoot,
  delayRender,
  continueRender,
} from 'remotion';
import {PRETENDARD} from './scene5/fonts';

const fontWait=delayRender('Cover font');

new FontFace(
  PRETENDARD,
  `url(${staticFile('assets/fonts/Pretendard-ExtraBold.woff2')})`,
  {weight:'800'}
).load().then((f)=>{
  document.fonts.add(f);
  continueRender(fontWait);
});

const Character=()=>{
  const [src,setSrc]=useState('');
  const [wait]=useState(()=>delayRender('Point-right mask'));

  useEffect(()=>{
    const im=new Image();

    im.onload=()=>{
      const c=document.createElement('canvas');
      c.width=im.width;
      c.height=im.height;

      const ctx=c.getContext('2d')!;
      ctx.drawImage(im,0,0);

      const p=ctx.getImageData(0,0,c.width,c.height);
      const d=p.data;
      const seen=new Uint8Array(c.width*c.height);
      const q:number[]=[];

      const add=(i:number)=>{
        if(i<0 || i>=seen.length || seen[i]) return;

        seen[i]=1;

        const k=i*4;
        const lo=Math.min(d[k],d[k+1],d[k+2]);
        const hi=Math.max(d[k],d[k+1],d[k+2]);

        if(lo>170 && hi-lo<35) q.push(i);
      };

      for(let x=0;x<c.width;x++){
        add(x);
        add((c.height-1)*c.width+x);
      }

      for(let y=0;y<c.height;y++){
        add(y*c.width);
        add(y*c.width+c.width-1);
      }

      for(let n=0;n<q.length;n++){
        const i=q[n];
        d[i*4+3]=0;

        if(i%c.width) add(i-1);
        if(i%c.width<c.width-1) add(i+1);

        add(i-c.width);
        add(i+c.width);
      }

      ctx.putImageData(p,0,0);
      setSrc(c.toDataURL());
      continueRender(wait);
    };

    im.src=staticFile(
      'references/characters/small-daesan-pose-point-right-v1.png'
    );
  },[wait]);

  if(!src) return null;

  return (
    <Img
      src={src}
      style={{
        position:'absolute',
        left:20,
        top:1050,
        width:330,
        height:'auto',
        zIndex:5,
      }}
    />
  );
};

const Cover=()=>(
  <AbsoluteFill
    style={{
      fontFamily:PRETENDARD,
      background:'#F4F5F1',
      overflow:'hidden',
    }}
  >
    <div
      style={{
        position:'absolute',
        left:0,
        top:0,
        width:1080,
        height:1920,
        overflow:'hidden',
        background:'#F4F5F1',
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
          objectFit:'cover',
          objectPosition:'right center',
        }}
      />
    </div>

    <div
      style={{
        position:'absolute',
        left:0,
        top:0,
        width:1080,
        height:900,
        background:
          'linear-gradient(180deg,rgba(247,248,250,0.98) 0%,rgba(247,248,250,0.96) 67%,rgba(247,248,250,0) 100%)',
        zIndex:2,
      }}
    />

    <div
      style={{
        position:'absolute',
        left:64,
        top:265,
        width:760,
        height:405,
        borderRadius:38,
        background:'rgba(247,248,250,0.96)',
        border:'1px solid rgba(18,54,40,0.10)',
        boxSizing:'border-box',
        zIndex:3,
      }}
    />

    <div
      style={{
        position:'absolute',
        left:96,
        top:305,
        fontSize:29,
        fontWeight:700,
        color:'#52665C',
        zIndex:4,
      }}
    >
      건축자재 상식 · XPS 시공
    </div>

    <div
      style={{
        position:'absolute',
        left:96,
        top:375,
        fontSize:62,
        fontWeight:800,
        lineHeight:1.1,
        letterSpacing:-2,
        color:'#111',
        zIndex:4,
      }}
    >
      XPS 단열재
    </div>

    <div
      style={{
        position:'absolute',
        left:96,
        top:458,
        fontSize:66,
        fontWeight:800,
        lineHeight:1.1,
        letterSpacing:-2.4,
        color:'#111',
        zIndex:4,
      }}
    >
      한 겹 <span style={{color:'#1F5E3B'}}>vs</span> 두 겹
    </div>

    <div
      style={{
        position:'absolute',
        left:96,
        top:548,
        fontSize:68,
        fontWeight:800,
        lineHeight:1.1,
        letterSpacing:-2.4,
        color:'#1F5E3B',
        zIndex:4,
      }}
    >
      무슨 차이?
    </div>

    <div
      style={{
        position:'absolute',
        left:96,
        top:641,
        width:120,
        height:5,
        borderRadius:5,
        background:'#1F5E3B',
        zIndex:4,
      }}
    />

    <Character/>

    <div
      style={{
        position:'absolute',
        right:54,
        bottom:340,
        display:'flex',
        alignItems:'center',
        gap:10,
        zIndex:6,
        padding:'8px 14px',
        borderRadius:18,
        background:'rgba(247,248,250,0.90)',
      }}
    >
      <Img
        src={staticFile('assets/logos/daesanlogo2.png')}
        style={{
          width:62,
          height:62,
          objectFit:'contain',
        }}
      />

      <div>
        <div
          style={{
            fontSize:37,
            lineHeight:1,
            fontWeight:800,
            color:'#123628',
          }}
        >
          DAESAN
        </div>

        <div
          style={{
            marginTop:6,
            fontSize:20,
            lineHeight:1,
            fontWeight:600,
            color:'#123628',
          }}
        >
          대산종합건축자재
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

registerRoot(()=>(
  <Composition
    id="XpsStaggeredCoverV2"
    component={Cover}
    durationInFrames={1}
    fps={30}
    width={1080}
    height={1920}
  />
));
