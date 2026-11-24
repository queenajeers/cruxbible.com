"""Make one picture with OpenAI's image API (no reference images).

Usage: OPENAI_API_KEY=... python3 tools/gen_image.py OUT.png SIZE PROMPT_FILE [STYLE_FILE]
SIZE is 1024x1024, 1536x1024 or 1024x1536. Quality is always medium.
The prompt is STYLE_FILE's text (if given) followed by PROMPT_FILE's.
Each call is logged as one JSON line to $GEN_LOG (if set).
"""
import base64, json, os, subprocess, sys, time

out, size, prompt_file, *style = sys.argv[1:]
prompt = open(prompt_file).read().strip()
if style:
    prompt = open(style[0]).read().strip() + '\n\n' + prompt
model = os.environ.get('IMG_MODEL', 'gpt-image-2')
body = json.dumps({'model': model, 'prompt': prompt, 'size': size, 'quality': 'medium', 'n': 1}).encode()
t0 = time.time()
# curl, not urllib: python.org's Python has no root certificates here. The key goes in on stdin, the body in a pipe.
r, w = os.pipe()
pid = os.fork()
if pid == 0:
    os.close(r); os.write(w, body); os.close(w); os._exit(0)
os.close(w)
res = subprocess.run(['curl', '-sS', '--max-time', '300', 'https://api.openai.com/v1/images/generations',
                      '-H', '@-', '--data-binary', '@/dev/fd/%d' % r],
                     input='Authorization: Bearer ' + os.environ['OPENAI_API_KEY'] + '\nContent-Type: application/json\n',
                     capture_output=True, text=True, pass_fds=(r,))
os.close(r); os.waitpid(pid, 0)
try:
    d = json.loads(res.stdout)
except Exception:
    print('BAD RESPONSE', res.stdout[:400], res.stderr[:400]); sys.exit(1)
if 'error' in d:
    print('API ERROR', json.dumps(d['error'])[:600]); sys.exit(1)
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
with open(out, 'wb') as f:
    f.write(base64.b64decode(d['data'][0]['b64_json']))
line = json.dumps({'out': 'cruxbible.com/' + os.path.basename(out), 'model': model, 'size': size, 'quality': 'medium',
                   'secs': round(time.time() - t0, 1), 'usage': d.get('usage', {})})
if os.environ.get('GEN_LOG'):
    with open(os.environ['GEN_LOG'], 'a') as f:
        f.write(line + '\n')
print(line)
