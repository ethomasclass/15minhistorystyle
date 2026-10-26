"""ACE-Step 1.5 on CPU (turbo 2B, no planning LM). Usage: python gen.py text|cover OUTDIR [seconds]"""
import os, sys, time
from acestep.handler import AceStepHandler
from acestep.llm_inference import LLMHandler
from acestep.inference import GenerationParams, GenerationConfig, generate_music

mode, out = sys.argv[1], sys.argv[2]
secs = float(sys.argv[3]) if len(sys.argv) > 3 else 30
HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault("ACESTEP_CHECKPOINTS_DIR", os.path.join(HERE, "checkpoints"))
torch_threads = os.cpu_count()

t0 = time.time()
dit = AceStepHandler()
status, ok = dit.initialize_service(project_root=os.path.join(HERE, "repo"), config_path="acestep-v15-turbo", device="cpu")
print("init:", ok, status[:300] if isinstance(status, str) else status, f"{time.time() - t0:.0f}s", flush=True)
llm = LLMHandler()   # not initialised: no planning LM, metadata given explicitly

common = dict(instrumental=True, thinking=False, use_cot_metas=False, use_cot_caption=False, use_cot_language=False,
              duration=secs, inference_steps=8, seed=1865)
if mode == "text":
    params = GenerationParams(
        task_type="text2music",
        caption=("grave cold documentary underscore, 1860s period instruments, slow ticking pocket-watch pulse, walking "
                 "pizzicato upright bass, solemn reed harmonium chords, a lone fiddle circling the same few notes, "
                 "tense and restrained, cinematic, instrumental"),
        bpm=66, keyscale="D minor", timesignature="4", **common)
else:
    params = GenerationParams(
        task_type="cover",
        src_audio=os.path.join(HERE, "roll_jordan_30s.wav"),
        caption=("slow 1860s spiritual played on solo cello with a soft reed harmonium accompaniment, dignified, warm, "
                 "restrained documentary underscore, instrumental, no vocals"),
        audio_cover_strength=float(os.environ.get("COVER_STRENGTH", "0.7")), **common)
cfg = GenerationConfig(batch_size=1, audio_format="wav", use_random_seed=False, seeds=[1865])
t1 = time.time()
res = generate_music(dit, llm, params, cfg, save_dir=out)
print("generate:", res.success, getattr(res, "error", None), f"{time.time() - t1:.0f}s", flush=True)
for a in (res.audios or []):
    print("audio:", a.get("path"))
