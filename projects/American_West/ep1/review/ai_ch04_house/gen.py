import os, json, base64, urllib.request
KEY=os.environ["GEMINI_API_KEY"]
STYLE=("STYLE: a tinted lithograph printed in the 1860s, like a plate in the Pacific Railroad Survey reports: soft crayon-grain shading in black "
"plus muted tint stones only (pale buff ochre, slate blue-grey, faded brick red), slightly out of register, faded and low saturation. "
"RULES: historically accurate; nothing modern; no text, letters, numbers or signatures anywhere; no frame, border or vignette.")
J={
 "house_cut_a":("A single 1860s Central Pacific Railroad construction camp bunkhouse in the Sierra Nevada, seen straight from the side: rough vertical plank walls, a steep shingled gable roof, a small four-pane window, a plank door, a tin stovepipe, a woodpile against one wall. The whole building in frame with margin around it, isolated on a completely plain flat pure white background, no ground, no snow, no trees, no sky, no shadow. ","4:3"),
 "house_cut_b":("A single small 1860s railroad section house and storehouse in the high Sierra, side view: a long low log-and-plank building with a steep roof, a stone chimney, a lean-to shed, a lantern hook by the door. The whole building in frame with margin, isolated on a completely plain flat pure white background, no ground, no snow, no trees, no sky, no shadow. ","4:3"),
 "house_buried":("Winter 1866-67 in the high Sierra Nevada: a railroad construction camp almost completely buried in snow. Only the steep roofs and stovepipes of the plank bunkhouses show above enormous drifts, smoke rising from one pipe, a narrow trench dug down through the snow to a door, deep snow-laden pines behind, heavy grey sky. No people. ","16:9"),
}
for n,(p,ar) in J.items():
    body={"contents":[{"parts":[{"text":p+STYLE}]}],"generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":ar}}}
    req=urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json","X-goog-api-key":KEY})
    try:
        d=json.load(urllib.request.urlopen(req,timeout=300))
        img=[x for x in d["candidates"][0]["content"]["parts"] if "inlineData" in x][0]["inlineData"]
        open(f"{n}.png","wb").write(base64.b64decode(img["data"])); print(n,flush=True)
    except Exception as e: print(n,"ERR",repr(e)[:200],flush=True)
