#!/usr/bin/env python3
"""Google Cloud TTS using existing Application Default Credentials.

Single: python generate_tts.py "안녕하세요" --voice ko-KR-Chirp3-HD-Alnilam --out output.mp3
Batch:  python generate_tts.py --batch texts.json --out ./audio
texts.json: {"scene01.mp3": "안녕하세요", "scene02.mp3": "반갑습니다"}
Dependencies: google-auth, requests (existing project .venv is used if needed).
No automatic synthesis retries; existing output files are never overwritten.
"""
import argparse
import base64
import json
import math
import os
from pathlib import Path
import sys
import urllib.error
import urllib.request


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('text', nargs='?')
    parser.add_argument('--voice', default='ko-KR-Chirp3-HD-Alnilam')
    parser.add_argument('--rate', type=float, default=1.0)
    parser.add_argument('--out', required=True, type=Path, help='MP3 path, or output directory with --batch')
    parser.add_argument('--batch', type=Path, help='JSON object mapping MP3 filenames to text')
    parser.add_argument('--ssml', action='store_true', help='Treat text/batch values as SSML markup')
    args = parser.parse_args()
    if (args.text is None) == (args.batch is None):
        parser.error('Provide either text or --batch, not both.')
    if not math.isfinite(args.rate) or not 0.25 <= args.rate <= 4.0:
        parser.error('--rate must be between 0.25 and 4.0')
    if args.batch:
        data = json.loads(args.batch.read_text(encoding='utf-8'))
        if not isinstance(data, dict) or not data:
            parser.error('--batch JSON must be a nonempty {filename: text} object')
        jobs = []
        for filename, text in data.items():
            name = Path(filename)
            if name.is_absolute() or '..' in name.parts:
                parser.error('Batch filenames must be relative paths without ..')
            jobs.append((args.out / name, text))
    else:
        jobs = [(args.out, args.text)]
    resolved = set()
    for path, text in jobs:
        if not isinstance(text, str) or not text.strip():
            parser.error(f'Empty/non-string text for {path}')
        if len(text.encode('utf-8')) > 5000:
            parser.error(f'Text exceeds 5000 UTF-8 bytes: {path}')
        if path.suffix.lower() != '.mp3':
            parser.error(f'Output must use .mp3: {path}')
        if path.exists() or path.resolve() in resolved:
            parser.error(f'Output already exists or is duplicated: {path}')
        resolved.add(path.resolve())
    try:
        import google.auth
        from google.auth.transport.requests import Request
    except ImportError:
        venv = Path(__file__).resolve().parent.parent / '.venv/bin/python'
        if venv.exists() and Path(sys.prefix).resolve() != venv.parent.parent.resolve():
            os.execv(str(venv), [str(venv), str(Path(__file__).resolve()), *sys.argv[1:]])
        raise RuntimeError('Install dependencies: python -m pip install google-auth requests')
    credentials, _ = google.auth.default(scopes=['https://www.googleapis.com/auth/cloud-platform'])
    refresh_request = Request()
    url = 'https://texttospeech.googleapis.com/v1/text:synthesize'
    for path, text in jobs:
        headers = {'Content-Type': 'application/json'}
        credentials.before_request(refresh_request, 'POST', url, headers)
        payload = {
            'input': ({'ssml': text} if args.ssml else {'text': text}),
            'voice': {'languageCode': '-'.join(args.voice.split('-')[:2]), 'name': args.voice},
            'audioConfig': {'audioEncoding': 'MP3', 'speakingRate': args.rate},
        }
        request = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                result = json.load(response)
        except urllib.error.HTTPError as error:
            try:
                message = json.loads(error.read()).get('error', {}).get('message', 'Request failed')
            except (ValueError, AttributeError):
                message = 'Request failed'
            raise RuntimeError(f'Google TTS HTTP {error.code}: {message}') from None
        audio = base64.b64decode(result['audioContent'], validate=True)
        if not audio:
            raise RuntimeError('Google TTS returned empty audio')
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open('xb') as output:
            output.write(audio)
        print(f'SAVED {path} ({len(audio)} bytes), voice={args.voice}, rate={args.rate}')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'ERROR: {error}', file=sys.stderr)
        sys.exit(1)
