from pathlib import Path
import subprocess,json,hashlib
p=Path(__file__).resolve().parent.parent
rows=json.loads((p/'docs/timing-v1.json').read_text())
jobs=[('XpsStaggered','xps-staggered-joints-preview-v1.mp4')]+[(f'Scene{i:02}',f'scene{i:02}-preview-candidate-v1.mp4') for i in range(1,6)]
qa=[]
for comp,name in jobs:
 out=p/'public/assets/video'/name
 log=p/'out/qa'/f'{comp}-render-v1.log'
 with log.open('w') as f: subprocess.run(['npx','remotion','render','src/index.tsx',comp,str(out),'--codec=h264','--audio-codec=aac','--concurrency=2'],cwd=p,stdout=f,stderr=subprocess.STDOUT,check=True)
 data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(out)]))
 subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(out),'-f','null','-'],check=True)
 v=next(x for x in data['streams'] if x['codec_type']=='video');a=next(x for x in data['streams'] if x['codec_type']=='audio')
 assert (v['width'],v['height'],v['r_frame_rate'],v['codec_name'],a['codec_name'])==(1080,1920,'30/1','h264','aac')
 expected=sum(r['frames'] for r in rows)+170 if comp=='XpsStaggered' else rows[int(comp[-2:])-1]['frames']
 assert int(v['nb_frames'])==expected
 qa.append({'file':str(out),'frames':v['nb_frames'],'videoDuration':v['duration'],'containerDuration':data['format']['duration'],'width':1080,'height':1920,'fps':30,'videoCodec':'h264','audioCodec':'aac','decode':'PASS'})
 print('PASS',name,v['duration'],flush=True)
 if comp!='XpsStaggered':
  subprocess.run(['ffmpeg','-v','error','-n','-ss',str(min(4,expected/30-0.5)),'-i',str(out),'-frames:v','1','-vf','scale=360:640',str(p/f'out/qa/{comp}-v1.png')],check=True)
full=p/'public/assets/video/xps-staggered-joints-preview-v1.mp4'
subprocess.run(['ffmpeg','-v','error','-n','-i',str(full),'-vf','fps=1/2,scale=216:384,tile=6x3','-frames:v','1',str(p/'out/qa/contact-v1.jpg')],check=True)
manifest=json.loads((p/'docs/slim-copy-manifest.json').read_text())
for r in manifest:
 if r['destination'].startswith(('src/','public/')):
  assert hashlib.sha256((p/r['destination']).read_bytes()).hexdigest()==r['sha256']
  assert hashlib.sha256(Path(r['source']).read_bytes()).hexdigest()==r['sha256']
(p/'out/qa/mechanical-v1.json').write_text(json.dumps(qa,indent=2))
print('ENDING SOURCE HASHES PASS',flush=True)
