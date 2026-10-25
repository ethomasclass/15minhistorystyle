"""Gemini helpers: lines <img> <question> [out.json] ; describe <img> <question>"""
import os, sys, json, base64, io, urllib.request
from PIL import Image
KEY = os.environ["GEMINI_API_KEY"]
def call(model, parts, cfg=None):
    body = {"contents": [{"parts": parts}]}
    if cfg: body["generationConfig"] = cfg
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "X-goog-api-key": KEY})
    return json.load(urllib.request.urlopen(req, timeout=300))
def jpg(path, box=None, maxside=3000):
    im = Image.open(path).convert("RGB")
    if box: im = im.crop(box)
    im.thumbnail((maxside, maxside)); b = io.BytesIO(); im.save(b, "JPEG", quality=90)
    return base64.b64encode(b.getvalue()).decode()
if __name__ == "__main__":
    mode, path, q = sys.argv[1:4]
    box = tuple(map(int, os.environ["BOX"].split(","))) if os.environ.get("BOX") else None
    cfg = {"responseMimeType": "application/json"} if mode == "lines" else None
    d = call("gemini-flash-latest", [{"inline_data": {"mime_type": "image/jpeg", "data": jpg(path, box)}}, {"text": q}], cfg)
    t = d["candidates"][0]["content"]["parts"][0]["text"]
    if len(sys.argv) > 4: open(sys.argv[4], "w").write(t)
    print(t[:4000])
