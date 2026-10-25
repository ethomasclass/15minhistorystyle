import os, json, base64, urllib.request
KEY=os.environ["GEMINI_API_KEY"]
def call(model, parts, cfg=None):
    body={"contents":[{"parts":parts}]}
    if cfg: body["generationConfig"]=cfg
    req=urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json","X-goog-api-key":KEY})
    return json.load(urllib.request.urlopen(req,timeout=300))
def img(name, prompt, ar="16:9"):
    d=call("gemini-2.5-flash-image",[{"text":prompt}],{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":ar}})
    x=[p for p in d["candidates"][0]["content"]["parts"] if "inlineData" in p][0]["inlineData"]
    open(f"assets/{name}.png","wb").write(base64.b64decode(x["data"])); print(name,flush=True)
NOTEXT=" No text, letters, numbers, logos or watermarks anywhere. Nothing else in the picture."
img("tex_torn_paper","Flat overhead studio scan of six strips and scraps of old 19th-century paper with ragged hand-torn edges showing loose paper fibres, laid apart from each other on a pure flat black background (#000000) with no shadows. Papers vary: cream rag paper, yellowed newsprint, greyish wrapping paper, a buff card. Even lighting, very sharp, high detail of fibres and edges, blank paper."+NOTEXT)
img("tex_tape","Flat overhead studio scan of eight short pieces of old cloth and paper tape, some torn at the ends, some creased, semi-translucent, in faded ochre-orange and dull cream, laid apart from each other on a pure flat black background (#000000) with no shadows. Even lighting, very sharp, high detail."+NOTEXT)
img("tex_stains","Flat overhead scan of a sheet of plain white paper covered with old stains only: tea and coffee rings, brown foxing spots, faint water marks, a few ink spatters, smudged fingerprints. Pure white paper everywhere else, evenly lit, high detail, no objects."+NOTEXT)
img("prop_spike","Studio product photograph of a single old hand-forged iron railroad spike from the 1860s, rusted and worn, lying on its side, isolated on a pure flat white seamless background, soft even light, very sharp, the whole object in frame with margin around it."+NOTEXT,"1:1")
img("prop_sledgehammer","Studio product photograph of a single 19th-century railroad worker's sledgehammer with a worn wooden handle and a chipped iron head, lying diagonally, isolated on a pure flat white seamless background, soft even light, very sharp, the whole object in frame with margin around it."+NOTEXT,"1:1")
# 3. find the quoted line on the Act page
page=open("../../public/img/samples/pacific_railway_act_1862_p4.jpg","rb").read()
q=("This is a scanned page of the Pacific Railway Act of 1862. Find every printed line that contains the words 'every alternate section' "
"or that continues the same sentence describing the land grant (alternate sections, odd numbers, ten-mile limits). "
"Return JSON only: a list of objects {\"text\": exact transcription of that printed line, \"box_2d\": [ymin, xmin, ymax, xmax]} with coordinates normalized 0-1000, one object per printed line, in reading order.")
d=call("gemini-flash-latest",[{"inline_data":{"mime_type":"image/jpeg","data":base64.b64encode(page).decode()}},{"text":q}],{"responseMimeType":"application/json"})
t=d["candidates"][0]["content"]["parts"][0]["text"]; open("assets/act_lines.json","w").write(t); print(t[:1500])
