import os, json, base64, urllib.request, time, sys
KEY=os.environ["GEMINI_API_KEY"]
S=("STYLE: a black-and-white wood engraving from an illustrated American newspaper of the 1860s, such as Harper's Weekly or Frank Leslie's. "
"All shading made with fine parallel lines and cross-hatching. Crisp black ink on slightly yellowed paper, white highlights cut out of the block, slight ink spread. "
"Bold clean line work, high contrast. No color, no grey gradients, no photographic look. RULES: historically accurate for the year and place; nothing modern; "
"no text, letters, numbers or signatures anywhere; no frame or border, fill the whole 16:9 image; no recognizable real person, faces turned away or in shadow.")
J={"g_summit_tunnel":"Winter 1866, inside the rough, unlined granite Summit Tunnel being dug by the Central Pacific Railroad in the Sierra Nevada. Chinese railroad workers in padded cotton jackets, loose trousers and wide conical woven bamboo hats, seen from behind with faces hidden, drill the rock face by hand: one holds a long steel drill while two others swing sledgehammers. Oil lamps on the rock, rubble and a small wooden handcart on the floor. "+S,
 "g_hell_on_wheels":"1868, a temporary Union Pacific railroad construction town on the treeless Wyoming plains: a muddy street of canvas tents and false-front plank saloons, freight wagons and mules, a steam locomotive and flatcars loaded with iron rails at the end of the track, small distant figures of workers. Wide sky, bright daylight. "+S,
 "g_sierra_plate":"A wide panoramic view of the high Sierra Nevada of California in winter 1867: steep bare granite ridges and deep snow, scattered pines, a railroad grade cut into the steep mountainside and covered by long wooden snow sheds, a small lake far below. No people. "+S}
for model in ["gemini-2.5-flash-image","gemini-3-pro-image"]:
  for n,p in J.items():
    body={"contents":[{"parts":[{"text":p}]}],"generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":"16:9"}}}
    req=urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json","X-goog-api-key":KEY})
    t=time.time()
    try:
        d=json.load(urllib.request.urlopen(req,timeout=300))
        parts=d["candidates"][0]["content"]["parts"]
        img=[x for x in parts if "inlineData" in x][0]["inlineData"]
        fn=f"{n}__{model}.{'png' if 'png' in img['mimeType'] else 'jpg'}"
        open(fn,"wb").write(base64.b64decode(img["data"])); print(fn,"%.0fs"%(time.time()-t),flush=True)
    except urllib.error.HTTPError as e: print(n,model,"HTTP",e.code,e.read()[:300],flush=True)
    except Exception as e: print(n,model,"ERR",repr(e)[:300],flush=True)
