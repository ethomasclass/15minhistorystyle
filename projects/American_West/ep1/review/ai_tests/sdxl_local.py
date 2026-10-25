import torch, time, sys
from diffusers import AutoPipelineForText2Image
torch.set_num_threads(4)
p=AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float32)
S=("black and white 19th century wood engraving, Harper's Weekly 1868 illustration, fine parallel line hatching and cross-hatching, crisp black ink on yellowed paper, high contrast, no text")
J={"l1_summit_tunnel":"Chinese railroad workers in conical straw hats seen from behind drilling a granite tunnel face by oil lamp light, Sierra Nevada 1866, "+S,
 "l2_hell_on_wheels":"temporary railroad construction town of canvas tents and wooden saloons on treeless plains, locomotive at end of track, 1868, "+S,
 "l3_sierra_plate":"panoramic Sierra Nevada mountains in deep snow, granite ridges, pine forest, railroad grade with wooden snow sheds cut into the slope, no people, "+S}
for n,pr in J.items():
    t=time.time()
    im=p(prompt=pr,num_inference_steps=4,guidance_scale=0.0,width=768,height=432,generator=torch.Generator().manual_seed(7)).images[0]
    im.save(n+".png"); print(n,"%.0fs"%(time.time()-t),flush=True)
