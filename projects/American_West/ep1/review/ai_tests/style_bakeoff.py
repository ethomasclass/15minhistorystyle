import os, json, base64, urllib.request, time
KEY=os.environ["GEMINI_API_KEY"]
SCENE=("Winter 1866, inside the rough, unlined granite Summit Tunnel being dug by the Central Pacific Railroad in the Sierra Nevada. "
"Chinese railroad workers in padded cotton jackets, loose trousers and wide conical woven bamboo hats, seen from behind with faces hidden, drill the rock face by hand: "
"one holds a long steel drill while two others swing sledgehammers. Oil lamps on the rock, rubble and a small wooden handcart on the floor. "
"Casual, uneven composition as if drawn on the spot, not symmetrical.")
RULES=(" RULES: historically accurate; nothing modern; no text, letters, numbers or signatures anywhere; no frame, border, vignette or rounded corners, "
"the drawing fills the whole 16:9 image edge to edge; no recognizable real person.")
STY={
 "s1_fine_etching":"A fine 19th-century steel engraving or etching from a travel book of the 1860s: very thin, delicate lines of varying weight, stippling and loose cross-hatching, soft uneven ink, warm off-white paper, slightly imperfect printing. Not bold, not graphic.",
 "s2_field_sketch":"An artist's on-the-spot field sketch like the Civil War special artists of Harper's Weekly made: quick pencil and pen-and-ink lines on toned buff paper, white chalk highlights, loose unfinished edges, smudges, some construction lines left visible.",
 "s3_lithograph":"A tinted lithograph from the 1860s: soft crayon-grain shading on stone, one pale buff tint stone plus black, gentle tonal gradations, slightly grainy, the look of a printed plate from a government railroad survey report.",
 "s4_charcoal_notebook":"A charcoal and graphite drawing in an old field notebook: smudged charcoal shadows, rough expressive strokes, the paper grain showing through, a few fingerprints and erasures, monochrome.",
 "s5_newspaper_woodcut":"A small, rough wood engraving printed in a cheap 1860s American newspaper on thin pulpy newsprint: coarse uneven lines, ink filling in the dark areas, slightly blurred impression, visible paper grain, imperfect and a little crude.",
}
for n,s in STY.items():
    body={"contents":[{"parts":[{"text":SCENE+" STYLE: "+s+RULES}]}],"generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":"16:9"}}}
    req=urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json","X-goog-api-key":KEY})
    try:
        d=json.load(urllib.request.urlopen(req,timeout=300))
        img=[x for x in d["candidates"][0]["content"]["parts"] if "inlineData" in x][0]["inlineData"]
        open(f"styles/{n}.png","wb").write(base64.b64decode(img["data"])); print(n,flush=True)
    except Exception as e: print(n,"ERR",repr(e)[:200],flush=True)
