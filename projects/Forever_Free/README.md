# Forever Free (Civil War series, Video 2 of 3)

A 15 Minute History video, **about 9:00**, 8 chapters, for general viewers and for students (Unit 4, the rest of Lesson 6 and
Lesson 7: Robert Smalls, contraband, McClellan, habeas corpus, Greeley, Antietam, the Emancipation Proclamation, Britain, the 54th).

| | |
|---|---|
| **Status** | Voiced (8 chapters, 8:56 with intro and end screen). Scenes built for all 8 chapters (`src/ch/Ch01.tsx` … `Ch08.tsx`, shared pieces in `src/kit/ff.tsx`); 11 subject masks (`tools/mask.py`, `src/masks.ts`); library music per the revised plan at the end of `script/MUSIC.md`. Text probe clean at a 96/54 px safe margin. Next: full render (`tools/render.sh`), thumbnail. |
| **Script** | [`script/SCRIPT.md`](script/SCRIPT.md) · chapter files `script/ch01_cold_open.txt` … `script/ch08_who_freed_them.txt` · review PDF in `review/` |
| **Images** | 99 archival images in `public/img/ch01` … `ch08`, every one credited in `public/img/credits.json`; table and gaps in [`research/IMAGES.md`](research/IMAGES.md); contact sheets in `review/contact/` |
| **AI images** | [`script/FLOW_PROMPT.md`](script/FLOW_PROMPT.md) (series file; this video's scenes are `v2_*`) |
| **Maps** | [`script/MAPS.md`](script/MAPS.md) · base map `public/maps/civwar1861.json`. The tested map code (including the Proclamation beat) is in `projects/In_Their_Own_Words/src/MapTest.tsx`. |

Sister projects: `projects/In_Their_Own_Words/` (Video 1) and `projects/Except/` (Video 3).
