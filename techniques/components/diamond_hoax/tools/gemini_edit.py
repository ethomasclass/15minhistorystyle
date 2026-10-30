# Gemini image edit:  python3 tools/gemini_edit.py <model> in.png out.png prompt.txt  (reads GEMINI_API_KEY from .env; keeps the input's aspect)
import json, base64, sys, os, urllib.request
key = [l.split('=',1)[1].strip() for l in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')) if l.startswith('GEMINI_API_KEY=')][0]
model, src, out, prompt = sys.argv[1], sys.argv[2], sys.argv[3], open(sys.argv[4]).read()
img = base64.b64encode(open(src, 'rb').read()).decode()
body = {"contents":[{"parts":[{"inlineData":{"mimeType":"image/png","data":img}},{"text":prompt}]}],"generationConfig":{"responseModalities":["IMAGE"]}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
  data=json.dumps(body).encode(), headers={"Content-Type":"application/json","x-goog-api-key":key})
d = json.load(urllib.request.urlopen(req, timeout=180))
for p in d["candidates"][0]["content"]["parts"]:
    if "inlineData" in p:
        open(out,"wb").write(base64.b64decode(p["inlineData"]["data"])); print("ok", out); break
else: print("no image", json.dumps(d)[:400])
