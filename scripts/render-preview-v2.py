from pathlib import Path
import subprocess,json,hashlib
p=Path(__file__).resolve().parent.parent
rows=json.loads((p/'docs/timing-v2.json').read_text())
jobs=[(f'Scene{i:02}V2',f'scene{i:02}-preview-candidate-v2.mp4',rows[i-1]['frames']) for i in range(1,6)]+[('XpsStaggeredV2','xps-staggered-joints-preview-v2.mp4',sum(r['frames'] for r in rows)+170)]
qa=[]
for comp,name,expected in jobs:
 out=p/'public/assets/video'/name
 assert not out.exists(),f'Refusing overwrite: {out}'
 with (p/f'out/qa/{comp}-render-v2.log').open('x') as log:
  subprocess.run(['npx','remotion','render','src/index-v2.tsx',comp,str(out),'--codec=h264','--audio-codec=aac','--concurrency=2'],cwd=p,stdout=log,stderr=subprocess.STDOUT,check=True)
 data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(out)]))
 subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(out),'-f','null','-'],check=True)
 v=next(s for s in data['streams'] if s['codec_type']=='video');a=next(s for s in data['streams'] if s['codec_type']=='audio')
 assert (v['width'],v['height'],v['r_frame_rate'],v['codec_name'],a['codec_name'])==(1080,1920,'30/1','h264','aac')
 assert int(v['nb_frames'])==expected
 qa.append({'file':str(out),'frames':int(v['nb_frames']),'videoSeconds':float(v['duration']),'containerSeconds':float(data['format']['duration']),'resolution':'1080x1920','fps':30,'videoCodec':'h264','audioCodec':'aac','fullDecode':'PASS'})
 print('PASS',comp,v['duration'],flush=True)
 if comp.startswith('Scene'):
  subprocess.run(['ffmpeg','-v','error','-n','-i',str(out),'-vf','fps=1,scale=270:480,tile=5x3','-frames:v','1',str(p/f'out/qa/{comp}-contact.png')],check=True)
subprocess.run(['ffmpeg','-v','error','-n','-i',str(p/'public/assets/video/xps-staggered-joints-preview-v2.mp4'),'-vf','fps=1/2,scale=216:384,tile=5x4','-frames:v','1',str(p/'out/qa/contact-v2.jpg')],check=True)
checks=json.loads((p/'docs/preservation-before-v2.json').read_text())
for rel,h in checks.items():assert hashlib.sha256((p/rel).read_bytes()).hexdigest()==h,rel
(p/'out/qa/mechanical-v2.json').write_text(json.dumps({'videos':qa,'v1AndEndingPreserved':True,'checkedFiles':len(checks)},indent=2))
print('V1 + ENDING PRESERVATION PASS',len(checks),'files',flush=True)
