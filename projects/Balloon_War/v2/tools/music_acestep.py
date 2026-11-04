"""Music cues from ACE-Step 1.5, run locally (free, unlimited), saved to public/music/<name>.mp3 (+ .wav, git-ignored).

  python tools/music_acestep.py cw_fife_dread rc_jubilee        # some cues
  python tools/music_acestep.py --all                           # every cue in CUES
  python tools/music_acestep.py --list

Setup (once): ACE-Step 1.5 (https://github.com/ace-step/ACE-Step-1.5, MIT code and weights; the model card allows
commercial use of outputs) in its own Python 3.11/3.12 environment, then run this script with that environment's
python. Point ACESTEP_DIR at the repo checkout and ACESTEP_CHECKPOINTS_DIR at the models: acestep-v15-turbo, vae,
Qwen3-Embedding-0.6B from huggingface.co/ACE-Step/Ace-Step1.5 (download one folder per `hf download --include` call).
  - GPU (CUDA) or Apple silicon: their installer works as is; a 60 s cue takes seconds.
  - CPU only (a cloud session): install CPU PyTorch instead of the CUDA build, and load in bfloat16 or it needs
    ~12 GB of RAM and gets killed: in acestep/core/generation/handler/init_service_orchestrator.py make the CPU dtype
    `torch.bfloat16 if (resolved_device == "xpu" or os.environ.get("ACE_CPU_BF16")) else torch.float32` and set
    ACE_CPU_BF16=1. A 60 s cue then takes about 4 minutes on 4 cores.
  Full notes: the style repo's projects/Reconstruction/music/acestep_test/README.md.

Prompting (what worked): the caption is a comma-separated description, instruments and period first ("1860s",
"fife and field drum", "fretless banjo", "reed harmonium", "saxhorn brass band"), then mood, then "documentary
underscore, restrained, instrumental"; give bpm, key and time signature explicitly (the planning LM is off). Keep it
instrumental (instrumental=True). After generating: measure loudness (ACE-Step normalises peaks, so cues land around
-17 to -21 LUFS; beds run ~0.17-0.24), listen to the first 30-40 s, then add keepers to the music library.
"""
import os, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "music")
STYLE = "documentary underscore, restrained, cinematic, space for a narrator, instrumental"

# name: (caption, bpm, key, time signature, seconds)
CUES = {
    # Civil War (prefix cw_)
    "cw_fife_dread": ("1860s Civil War, distant fife and muffled field snare drum playing a slow march, low string drone "
                      "underneath, ominous, the war is coming, builds slowly, never heroic, " + STYLE, 72, "E minor", "4", 60),
    "cw_camp_night": ("1860s soldiers' camp at night, a lonely solo fiddle playing a slow homesick waltz, soft acoustic "
                      "guitar, distant harmonica, crackling quiet, tender and weary, " + STYLE, 84, "G major", "3", 60),
    "cw_aftermath": ("aftermath of a Civil War battle, slow mournful low cello and distant muted brass chorale, a soft "
                     "muffled drum like a heartbeat, grave, humane, no melodrama, fades to quiet, " + STYLE, 56, "C minor", "4", 60),
    "cw_telegraph": ("1860s breaking news, urgent ticking telegraph-like pizzicato rhythm, tense low strings, field snare "
                     "rolls, a sense of shock and hurry, then a sudden hush at the end, " + STYLE, 100, "D minor", "4", 60),
    # Reconstruction (prefix rc_)
    "rc_jubilee": ("1865 freedom celebration, joyful fretless banjo and fiddle, hand claps and foot stomps, upright bass, "
                   "warm and hopeful, a plain folk melody, " + STYLE, 108, "D major", "4", 60),
    "rc_resolve": ("dignified slow hymn on reed harmonium and solo cello, 1860s church, quiet determination rising to a "
                   "restrained proud swell, then settles, " + STYLE, 64, "F major", "4", 60),
    "rc_backroom": ("1860s Washington politics, sly backroom deal, plucked pizzicato strings, a fussy upright parlor piano, "
                    "low clarinet, sneaky and wry, a little tension, " + STYLE, 92, "A minor", "4", 60),
    "rc_reckoning": ("the end of Reconstruction, slow solemn brass band and low strings in the distance, a broken march "
                     "that slows and falters, regret and loss, ends on an unresolved low chord, " + STYLE, 60, "B minor", "4", 60),
}


def main(names):
    acedir = os.environ.get("ACESTEP_DIR")
    if acedir:
        sys.path.insert(0, acedir)
    from acestep.handler import AceStepHandler
    from acestep.llm_inference import LLMHandler
    from acestep.inference import GenerationParams, GenerationConfig, generate_music
    import torch
    device = "cuda" if torch.cuda.is_available() else "mps" if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available() else "cpu"
    dit = AceStepHandler()
    status, ok = dit.initialize_service(project_root=acedir or HERE, config_path="acestep-v15-turbo", device=device)
    if not ok:
        sys.exit(f"ACE-Step init failed: {status}")
    llm = LLMHandler()   # planning LM off: metadata is given explicitly
    os.makedirs(OUT, exist_ok=True)
    for name in names:
        caption, bpm, key, ts, secs = CUES[name]
        t0 = time.time()
        params = GenerationParams(task_type="text2music", caption=caption, instrumental=True, bpm=bpm, keyscale=key,
                                  timesignature=ts, duration=secs, inference_steps=8, seed=1865, thinking=False,
                                  use_cot_metas=False, use_cot_caption=False, use_cot_language=False)
        cfg = GenerationConfig(batch_size=1, audio_format="wav", use_random_seed=False, seeds=[1865])
        res = generate_music(dit, llm, params, cfg, save_dir=os.path.join(OUT, ".acestep"))
        if not res.success:
            print("FAILED", name, res.error, flush=True)
            continue
        wav = os.path.join(OUT, name + ".wav")
        os.replace(res.audios[0]["path"], wav)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", wav, "-c:a", "libmp3lame", "-b:a", "192k", os.path.join(OUT, name + ".mp3")], check=True)
        print(f"music/ {name}  {time.time() - t0:.0f}s", flush=True)


if __name__ == "__main__":
    args = sys.argv[1:]
    if args == ["--list"]:
        for k, v in CUES.items():
            print(f"{k:16} {v[4]:>3}s {v[1]:>3} bpm {v[2]:8}  {v[0][:80]}")
    else:
        main(list(CUES) if args in ([], ["--all"]) else args)
