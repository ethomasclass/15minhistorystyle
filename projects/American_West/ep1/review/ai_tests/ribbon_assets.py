import os, json, base64, urllib.request
KEY=os.environ["GEMINI_API_KEY"]
STYLE=("STYLE: a tinted lithograph printed in the 1860s, like a plate in the Pacific Railroad Survey reports: soft crayon-grain shading in black "
"plus muted tint stones only (pale buff ochre, slate blue-grey, faded brick red), slightly out of register, faded and low saturation.")
RULES=("RULES: historically accurate; nothing modern. No text, letters, numbers, signatures, nameplates or monograms anywhere. "
"No frame, border or vignette.")
ENGINE=("A single 1860s American 4-4-0 wood-burning steam locomotive and its wood tender, seen exactly side-on in clean profile, the whole engine and tender in frame with margin around it, "
"tall balloon smokestack, large brass headlamp, cowcatcher, two big driving wheels, a wooden cab, the tender piled with cut firewood. "
"Isolated on a completely plain flat pure white background, no ground, no track, no shadow, no scenery, no smoke.")
J={
 "engine_cp_east_a": (ENGINE+" The locomotive faces RIGHT (the cowcatcher and smokestack on the right side of the picture, the tender on the left). ","21:9"),
 "engine_cp_east_b": (ENGINE+" The locomotive faces RIGHT (the cowcatcher and smokestack on the right side of the picture, the tender on the left). Slightly different design: a diamond smokestack. ","21:9"),
 "engine_up_west_a": (ENGINE+" The locomotive faces LEFT (the cowcatcher and smokestack on the left side of the picture, the tender on the right). ","21:9"),
 "engine_up_west_b": (ENGINE+" The locomotive faces LEFT (the cowcatcher and smokestack on the left side of the picture, the tender on the right). Slightly different design: a straight stack with a flared top. ","21:9"),
 "ridge_sierra_a": ("A long horizontal band of the high Sierra Nevada of California in winter, seen from the side like a panorama strip: jagged granite peaks and ridges deep in snow, dark pine forest on the lower slopes, the peaks rising toward the left. The sky above the ridgeline is completely plain flat pure white with no clouds, so the mountains can be cut out along their silhouette. ","21:9"),
 "ridge_sierra_b": ("A long horizontal band of the high Sierra Nevada of California in winter, a wide panorama strip of snowy granite summits and ridges with pine-covered foothills along the bottom edge. The sky is completely plain flat pure white with no clouds. ","21:9"),
 "ridge_wyoming_a": ("A long horizontal band of the Wyoming high plains rising to the low granite hills of the Laramie Mountains (Sherman Hill), seen from the side like a panorama strip: dry grass and sagebrush, rounded granite outcrops, sparse pines on the crest, a few patches of snow. The sky is completely plain flat pure white with no clouds. ","21:9"),
 "ridge_wyoming_b": ("A long horizontal band of rolling Great Plains and the Wyoming Rockies foothills in late autumn, wide and mostly flat with one long rising ridge of granite hills toward the right, dry grass, sagebrush and a few pines. The sky is completely plain flat pure white with no clouds. ","21:9"),
}
for n,(p,ar) in J.items():
    body={"contents":[{"parts":[{"text":p+STYLE+" "+RULES}]}],"generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":ar}}}
    req=urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json","X-goog-api-key":KEY})
    try:
        d=json.load(urllib.request.urlopen(req,timeout=300))
        img=[x for x in d["candidates"][0]["content"]["parts"] if "inlineData" in x][0]["inlineData"]
        open(f"ribbon/{n}.png","wb").write(base64.b64decode(img["data"])); print(n,flush=True)
    except Exception as e: print(n,"ERR",repr(e)[:200],flush=True)
