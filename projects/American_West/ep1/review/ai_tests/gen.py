import urllib.parse, urllib.request, sys, time, json
STYLE=("A black-and-white wood engraving from an illustrated newspaper of the 1860s, such as Harper's Weekly or Frank Leslie's. "
"All shading made with fine parallel lines and cross-hatching. Crisp black ink on slightly yellowed paper, white highlights cut out of the block, "
"slight ink spread. Bold, clean line work, high contrast. No color, no grey gradients, no photographic look. No text, letters, numbers or signatures anywhere. "
"No frame or border. No recognizable real person; faces hidden or turned away. Nothing modern.")
JOBS={
 "t1_summit_tunnel": "Winter 1866, inside a rough granite railroad tunnel high in the Sierra Nevada. Chinese railroad workers in padded cotton jackets and broad conical woven hats, seen from behind, drill the rock face by hand with long steel drills and sledgehammers, lit by oil lamps. Rubble on the floor, wooden ore cart, dark rock walls. "+STYLE,
 "t2_hell_on_wheels": "1868, a temporary Union Pacific railroad construction town on the treeless Wyoming plains. A muddy street of canvas tents and false-front plank saloons, freight wagons, a locomotive and flatcars of rails at the end of the track, workers in slouch hats seen at a distance. Wide sky, bright daylight. "+STYLE,
 "t3_sierra_plate": "A wide panoramic landscape of the Sierra Nevada mountains in winter, 1867: steep granite ridges and deep snow, pine forests, a thin railroad grade cut into the mountainside with wooden snow sheds. No people. Vast and empty. "+STYLE,
 "t4_paper_texture": "Flat top-down studio photograph of several torn strips of old cream-colored newsprint paper with ragged torn edges showing paper fibers, laid on a pure black background, evenly lit, high resolution texture reference, no printed text, no objects.",
}
for name,prompt in JOBS.items():
    for model in ["flux"]:
        url="https://image.pollinations.ai/prompt/"+urllib.parse.quote(prompt)+"?width=1920&height=1080&nologo=true&seed=7&model="+model
        t=time.time()
        try:
            data=urllib.request.urlopen(url,timeout=240).read()
            open(f"{name}.jpg","wb").write(data); print(name, len(data), "%.0fs"%(time.time()-t))
        except Exception as e: print(name,"ERR",e)
