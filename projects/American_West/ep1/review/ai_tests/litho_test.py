import os, json, base64, urllib.request
KEY=os.environ["GEMINI_API_KEY"]
STYLE=("STYLE: a tinted lithograph printed in the 1860s, like the plates in the Pacific Railroad Survey reports or a Harper's Weekly supplement. "
"Soft crayon-grain shading drawn on stone in black, plus a limited palette of two or three muted tint stones only: pale buff ochre, slate blue-grey and a faded brick red, "
"laid in flat areas and slightly out of register with the black. The paper shows through as the highlights. Muted, faded, low saturation; never bright; no modern colour grading.")
COMP=("COMPOSITION: casual and asymmetric, as if drawn from life. Figures at different distances and sizes, overlapping, some partly cut off by the edge of the picture; "
"never a neat row of identical figures.")
RULES=("RULES: historically accurate for the year and place; nothing modern. No text, letters, numbers, signatures or monograms anywhere. "
"No frame, border, margin, vignette or rounded corners: the picture runs edge to edge across the whole 16:9 image. No recognizable real person; faces turned away, small or in shadow.")
J={"L1_tunnel_face":"Winter 1866, the rough, unlined granite face of the Summit Tunnel being dug by the Central Pacific Railroad in the Sierra Nevada. "
"Seen over the shoulder of one Chinese worker in the foreground, close to us, in a padded cotton jacket and a wide conical woven hat, holding a long steel drill against the rock. "
"Behind him, further down the tunnel and smaller, two more men swing sledgehammers and another carries rubble to a wooden handcart. Oil lamps, smoke, deep shadow.",
 "L2_hell_on_wheels":"1868, a temporary Union Pacific construction town on the treeless Wyoming plains, seen from a slight rise: a muddy street of canvas tents and plank shacks, "
"freight wagons and mules, a steam locomotive and flatcars of iron rails at the end of the track, tiny figures of workers spread out, a huge pale sky.",
 "L3_sierra_snowsheds":"Winter 1867, the high Sierra Nevada of California: steep bare granite ridges and deep snow, scattered Jeffrey pines, "
"a railroad grade cut into the mountainside and covered by long wooden snow sheds, a frozen lake far below. No people. Wide panoramic landscape."}
for n,p in J.items():
    body={"contents":[{"parts":[{"text":p+" "+STYLE+" "+COMP+" "+RULES}]}],"generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":"16:9"}}}
    req=urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json","X-goog-api-key":KEY})
    try:
        d=json.load(urllib.request.urlopen(req,timeout=300))
        img=[x for x in d["candidates"][0]["content"]["parts"] if "inlineData" in x][0]["inlineData"]
        open(f"litho/{n}.png","wb").write(base64.b64decode(img["data"])); print(n,flush=True)
    except Exception as e: print(n,"ERR",repr(e)[:200],flush=True)
