# ACE-Step 1.5: a CPU test (Oct 2026)

[ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5) is an open-source music model (MIT code and weights; the model
card says outputs may be used commercially and that it was trained on licensed, royalty-free and synthetic audio,
which we can't verify). This tried it in a cloud session with **no GPU** (4 CPU cores, 15 GB RAM).

`ACE-Step_test_sampler.mp3`, in order:
1. `acestep_text_codes_style_30s.mp3`: text to music, the `rc_codes` brief (pocket-watch pulse, pizzicato bass,
   harmonium, a trapped fiddle; 66 bpm, D minor), instrumental, 30 s. **107 s to make.**
2. The source: 30 s of "Roll, Jordan, Roll" (Fisk University Jubilee Quartet, 1909, LOC National Jukebox).
3. `acestep_cover_roll_jordan_s07.mp3`: "cover" of it as solo cello and harmonium, strength 0.7. **147 s.**
4. `acestep_cover_roll_jordan_s10.mp3`: the same at strength 1.0. **142 s.**

Objective checks (I couldn't listen): every clip is a full 30 s, no silences, −20 to −23 LUFS. The covers' pitch
content does **not** track the original (chroma correlation −0.02 and −0.03, the same as an unrelated clip), so in this
setup the cover mode did not keep the melody. Likely causes: the planning model (5 Hz LM) was off to fit in memory, and
the source is a noisy 1909 record. Worth retrying on a GPU machine with the LM on and a clean source (a MIDI rendering of
the tune, or a clean modern performance we have rights to).

## How it was run (`gen.py`)
- Python 3.12 venv (`uv venv -p 3.12`); **CPU PyTorch** (`torch==2.10.0 torchaudio torchvision` from
  `https://download.pytorch.org/whl/cpu`), then the repo's `requirements.txt` minus the CUDA torch, triton, flash-attn,
  MLX, gradio and training lines, then `pip install --no-deps -e` the repo. (Its own `uv sync` forces the CUDA build on
  Linux: several GB of GPU libraries.)
- Models (`hf download ACE-Step/Ace-Step1.5 --include "<folder>/*"`, one folder per call): `acestep-v15-turbo` (4.8 GB),
  `vae` (0.3 GB), `Qwen3-Embedding-0.6B` (1.2 GB); point `ACESTEP_CHECKPOINTS_DIR` at them. On first run it also fetched
  the 1.7B planning LM (3.5 GB) even though it wasn't used.
- On CPU it loads in float32 and needs ~12 GB: it was killed for memory the first time. A one-line patch in
  `acestep/core/generation/handler/init_service_orchestrator.py` (`self.dtype = torch.bfloat16 if ... ACE_CPU_BF16`)
  loads it in bfloat16; run with `ACE_CPU_BF16=1`.
- Settings: `instrumental=True`, `thinking=False` and every `use_cot_*` off (no LM), `inference_steps=8`, seed 1865;
  for text, explicit `bpm`, `keyscale`, `timesignature`, `duration`.

## Verdict
Usable for drafts on a CPU (about 3.5–5× real time for a 30 s cue), better on a GPU or an Apple-silicon Mac (seconds).
For the channel: worth it for free, unlimited variations of a cue we like and for its exact controls (tempo, key, length,
repaint a section). Not yet proven for turning a period recording into a clean instrumental of the same tune.
