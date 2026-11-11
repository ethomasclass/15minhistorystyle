# Google Flow prompt: Episode 1 thumbnail (no text)

Settings: image, 16:9 landscape, 4 takes. Optional: attach a public-domain photo of Andrew Carnegie (around 1900 to 1910) as a reference image for the likeness.
Keep the take where the face reads clearly at phone size and the left third stays dark and empty (that is where "WHO PAID?" goes).

## Prompt

```
A dramatic studio photograph of a polished gold bust of Andrew Carnegie, the Scottish-American steel magnate around 1905: an older man with a short, neatly trimmed white beard, a high forehead, a calm, self-satisfied expression, a high starched collar, a waistcoat and a frock coat, shown from the chest up on a dark stone pedestal. The bust is placed in the right two-thirds of the frame, turned three-quarters toward the left. The gold is rich and mirror-bright on the forehead, nose and shoulders, but it is partly tarnished: the gold leaf is worn through and flaking along one cheek, the beard and the lower chest, revealing dark, rough, blackened iron underneath, with streaks of soot, brown rust and dull green patina in the cracks and folds of the coat. Strong warm key light from the upper left makes the gold glow; a faint orange furnace glow rises from below on the tarnished side. Background is a deep charcoal-black with a soft haze of smoke, very dark and empty in the left third of the frame. Moody, cinematic, high contrast, sharp focus on the face, shallow depth of field, photorealistic museum sculpture, 1880s Gilded Age atmosphere.
```

## Negative prompt (if Flow offers one, otherwise add "no text" to the end)

```
text, letters, words, captions, logo, watermark, signature, plaque, nameplate, frame, border, modern clothing, cartoon, illustration, extra people, hands, cluttered background, blurry face, distorted face
```

After picking a take: send it back and it gets the series treatment in `src/render.mjs` (the Kelly silhouettes in coral inside the worn patch, the "THE GILDED AGE · 1" tag, and the "WHO PAID?" text).
