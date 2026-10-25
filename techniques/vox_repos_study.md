# Three Vox-collage pipelines, read for ideas (West series, Oct 2026)

Repos the user pointed to: `alisa0808/vox-director`, `Anil-matcha/vox-ai-motion-graphics-generator` (the same pipeline on a
different paid API), `sadekxD/vox-style-collage-video-skill`. All three generate the art with AI image and video models on paid
APIs; that engine doesn't fit an archival-first channel. What's worth keeping is in
`.claude/skills/15-minute-history/references/explainer-craft.md` §6. In short:

1. **The collage look is flat by design** (sadekxD's style guide: "flat layers, not depth", scanner light, no parallax). Our depth
   has to come from camera grammar, texture and drawn 3D.
2. **Shot grammar** (vox-director): two shots per beat (wide with the headline, then a detail cut-in), a cut every ~4–6 s, one
   camera move per shot, varied between neighbours, static on the payoff; a timeline pans one way, pushes on the turning point,
   pulls out on the takeaway.
3. **Weight** (vox-director's local motion engine): slap-in, overshoot settle, bounce drop, an exponentially decaying impact shake,
   "breathing" sway and pulse on settled pieces, whips sampled from an overscanned canvas.
4. **Texture is the tell** (sadekxD): torn edges plus halftone/misregistration grain; without them it reads as flat vector art.
5. **Design the end frame, then animate toward it** ("frame-zero rule").
6. **Three tracks, different jobs:** the type states the point, the voice explains why, the picture shows it (after the hook).
7. They also bake off styles and let a human pick by eye, and read layout coordinates off a labelled grid (we have `trace_grid.py`).
