# Gemini image generation:  SIZE=2K python3 tools/gemini_image.py gemini-3-pro-image out.png prompt.txt  (reads GEMINI_API_KEY from .env)
import json, base64, sys, os, urllib.request
key = [l.split('=',1)[1].strip() for l in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')) if l.startswith('GEMINI_API_KEY=')][0]
model, out, prompt = sys.argv[1], sys.argv[2], open(sys.argv[3]).read()
body = {"contents":[{"parts":[{"text":prompt}]}],"generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":os.environ.get("ASPECT","16:9"), **({"imageSize": os.environ["SIZE"]} if os.environ.get("SIZE") else {})}}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
  data=json.dumps(body).encode(), headers={"Content-Type":"application/json","x-goog-api-key":key})
d = json.load(urllib.request.urlopen(req, timeout=180))
for p in d["candidates"][0]["content"]["parts"]:
    if "inlineData" in p:
        open(out,"wb").write(base64.b64decode(p["inlineData"]["data"])); print("ok", out); break
else: print("no image", json.dumps(d)[:400])
