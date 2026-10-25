import os, json, base64, urllib.request
KEY=os.environ["GEMINI_API_KEY"]
STYLE=("STYLE: a tinted lithograph printed in the 1860s, like a plate in Harper's Weekly or Frank Leslie's: soft crayon-grain shading in black "
"plus muted tint stones only (pale buff ochre, slate blue-grey, faded brick red), slightly out of register, faded and low saturation. "
"COMPOSITION: as if drawn from life, slightly off-centre. "
"RULES: historically accurate for 1862; nothing modern; no text, letters, numbers, flags with writing, or signatures anywhere; no frame, border or vignette; "
"no recognizable real person, everyone small, seen from behind or at a distance.")
HALL=("The Hall of the United States House of Representatives in the Capitol in 1862, seen from high in the public gallery: "
"the wide semicircular chamber with curving rows of heavy carved wooden desks and leather armchairs facing the raised marble Speaker's rostrum, "
"an iron-and-glass skylight ceiling with stained-glass panels letting in soft light, galleries with railings around the walls. ")
J={
 "chamber_a": (HALL+"Congressmen in dark frock coats sit and stand at the desks on the left and in the middle of the chamber, but one whole section of desks on the right side is completely empty: rows of empty chairs pushed in, nobody there. ","16:9"),
 "chamber_b": (HALL+"Most desks are filled with congressmen in dark frock coats, small and seen from behind, but a large wedge of desks on the right-hand side stands completely empty, its chairs pushed in under the desks, a striking gap in the crowded room. ","16:9"),
 "chamber_empty_a": (HALL+"The chamber is completely empty: every desk and chair unoccupied, chairs pushed in, quiet afternoon light from the skylight, a few papers left on desks. ","16:9"),
 "chamber_empty_b": (HALL+"The chamber is entirely empty and silent: row after row of empty armchairs at the curving desks, long shadows, dust in the light from the skylight. ","16:9"),
}
for n,(p,ar) in J.items():
    body={"contents":[{"parts":[{"text":p+STYLE}]}],"generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":ar}}}
    req=urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json","X-goog-api-key":KEY})
    try:
        d=json.load(urllib.request.urlopen(req,timeout=300))
        img=[x for x in d["candidates"][0]["content"]["parts"] if "inlineData" in x][0]["inlineData"]
        open(f"{n}.png","wb").write(base64.b64decode(img["data"])); print(n,flush=True)
    except Exception as e: print(n,"ERR",repr(e)[:200],flush=True)
