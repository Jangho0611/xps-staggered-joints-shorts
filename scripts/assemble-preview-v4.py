from pathlib import Path
import json,subprocess,hashlib
p=Path(__file__).resolve().parent.parent
rows=json.loads((p/'docs/timing-v4.json').read_text());a=p/'public/assets/video/v4-assembly'
def run(args):subprocess.run(args,cwd=p,check=True)
def probe(f):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(f)]))
with (p/'out/qa/Scene03V4-render.log').open('x') as log:
 subprocess.run(['npx','remotion','render','src/index-v4.tsx','Scene03V4','public/assets/video/scene03-preview-candidate-v4.mp4','--codec=h264','--audio-codec=aac','--concurrency=2'],cwd=p,stdout=log,stderr=subprocess.STDOUT,check=True)
segments=[]
for i in range(1,6):
 version=3 if i in [2,5] else 4
 f=p/f'public/assets/video/scene{i:02}-preview-candidate-v{version}.mp4';v=a/f'scene{i:02}-video.mp4'
 run(['ffmpeg','-v','error','-n','-i',str(f),'-map','0:v:0','-an','-c:v','copy',str(v)]);segments.append(v)
segments.append(a/'ending-approved-video.mp4')
frames=[r['frames'] for r in rows]+[170]
concat=a/'concat-v4.txt'
with concat.open('x') as f:
 for file,n in zip(segments,frames):f.write(f"file '{file}'\nduration {n/30:.12f}\n")
args=['ffmpeg','-v','error','-n'];filters=[]
for i,name in enumerate([r['audio'] for r in rows]+['scene06-tts-v3.mp3']):
 args+=['-i',str(p/'public/assets/audio'/name)]
 filters.append(f'[{i}:a]aresample=48000,apad=whole_dur={frames[i]/30},atrim=duration={frames[i]/30},asetpts=PTS-STARTPTS[a{i}]')
filters.append(''.join(f'[a{i}]' for i in range(6))+'concat=n=6:v=0:a=1[out]')
wave=p/'public/assets/audio/full-tts-qa-v4.wav'
run(args+['-filter_complex',';'.join(filters),'-map','[out]','-c:a','pcm_s16le',str(wave)])
run(['ffmpeg','-v','error','-n','-i',str(wave),'-c:a','libmp3lame','-b:a','128k',str(p/'public/assets/audio/full-tts-qa-v4.mp3')])
full=p/'public/assets/video/xps-staggered-joints-preview-v4.mp4'
run(['ffmpeg','-v','error','-n','-f','concat','-safe','0','-i',str(concat),'-i',str(wave),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-video_track_timescale','15360','-movflags','+faststart',str(full)])
qa=[]
for i in [1,3,4,0]:
 file=full if i==0 else p/f'public/assets/video/scene{i:02}-preview-candidate-v4.mp4'
 data=probe(file);v=next(s for s in data['streams'] if s['codec_type']=='video');au=next(s for s in data['streams'] if s['codec_type']=='audio')
 assert (v['width'],v['height'],v['r_frame_rate'],v['codec_name'],au['codec_name'])==(1080,1920,'30/1','h264','aac')
 assert int(v['nb_frames'])==(sum(frames) if i==0 else frames[i-1])
 run(['ffmpeg','-v','error','-xerror','-i',str(file),'-f','null','-'])
 qa.append({'file':str(file),'frames':v['nb_frames'],'seconds':v['duration'],'containerSeconds':data['format']['duration'],'decode':'PASS'})
 print('PASS',file.name,v['duration'],flush=True)
# Decode hashes verify reused frames in the assembled output, including exact ending.
def hashes(file,start,count):
 s=subprocess.check_output(['ffmpeg','-v','error','-i',str(file),'-map','0:v:0','-vf',f'trim=start_frame={start}:end_frame={start+count},setpts=PTS-STARTPTS','-f','framemd5','-']).decode()
 return [l.split(',')[-1].strip() for l in s.splitlines() if not l.startswith('#') and l.strip()]
start=0;reused=[]
for i,(seg,n) in enumerate(zip(segments,frames)):
 if i in [1,4,5]:
  assert hashes(full,start,n)==hashes(seg,0,n)
  reused.append({'scene':i+1,'frames':n,'decodedPixelMatch':True})
 start+=n
checks=json.loads((p/'docs/preservation-before-v4.json').read_text())
for rel,h in checks.items():assert hashlib.sha256((p/rel).read_bytes()).hexdigest()==h,rel
src3=(p/'src/index-v3.tsx').read_text();src4=(p/'src/index-v4.tsx').read_text()
assert src3[src3.index('const Gun='):src3.index('const FoamStroke=')]==src4[src4.index('const Gun='):src4.index('const FoamStroke=')]
(p/'out/qa/mechanical-v4.json').write_text(json.dumps({'videos':qa,'reused':reused,'preservedFiles':len(checks),'gunUnchanged':True},indent=2))
run(['ffmpeg','-v','error','-n','-i',str(full),'-vf','fps=1/2,scale=216:384,tile=6x4','-frames:v','1',str(p/'out/qa/contact-v4.jpg')])
run(['ffmpeg','-v','error','-n','-i',str(p/'public/assets/video/scene03-preview-candidate-v4.mp4'),'-vf','fps=2,scale=216:384,tile=5x5','-frames:v','1',str(p/'out/qa/scene03-contact-v4.jpg')])
print('REUSED SCENES PIXEL MATCH; ALL PREVIOUS FILES PRESERVED',flush=True)
