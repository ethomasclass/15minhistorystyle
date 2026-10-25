import os, time
from huggingface_hub import InferenceClient
c=InferenceClient(token=os.environ["HF_TOKEN"])
S=("A black-and-white wood engraving from an illustrated newspaper of the 1860s such as Harper's Weekly. All shading made with fine parallel lines and cross-hatching. "
"Crisp black ink on slightly yellowed paper, high contrast, no color, no grey gradients, no photographic look, no text or letters anywhere, no border.")
J={"h1_summit_tunnel":"Winter 1866, inside a rough granite railroad tunnel in the Sierra Nevada. Chinese railroad workers in padded cotton jackets and wide conical woven bamboo hats, seen from behind with faces hidden, drill the rock face by hand with long steel drills and sledgehammers by oil-lamp light. "+S,
 "h2_hell_on_wheels":"1868, a temporary railroad construction town on the treeless Wyoming plains: a muddy street of canvas tents and false-front plank saloons, freight wagons, a locomotive and flatcars of iron rails at the end of the track, small distant figures. "+S,
 "h3_sierra_plate":"A wide panoramic view of the Sierra Nevada of California in winter 1867: steep bare granite ridges and deep snow, Jeffrey pines, a railroad grade cut into the mountainside covered by long wooden snow sheds. No people. "+S}
for model in ["black-forest-labs/FLUX.1-schnell"]:
  for n,p in J.items():
    t=time.time()
    try:
        im=c.text_to_image(p, model=model, width=1344, height=768)
        im.save(n+".png"); print(n, im.size, "%.0fs"%(time.time()-t), flush=True)
    except Exception as e: print(n,"ERR",str(e)[:300], flush=True)
