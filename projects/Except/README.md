# Except (Civil War series, Video 3 of 3)

A 15 Minute History video, **about 8:45**, 8 chapters, for general viewers and for students (Unit 4, Lesson 8: Gettysburg and
Vicksburg, the Gettysburg Address, the drafts and draft riots, Sherman, Appomattox, Juneteenth, the 13th Amendment, Black Codes).

| | |
|---|---|
| **Status** | Voiced (all 8 chapters). **Scenes built** for Ch01 to Ch08 (`src/ch/`), video-specific pieces in `src/kit/except.tsx` (the six-words tape, the amendment line coordinates, diagram boxes, two-views, the Black Codes chain). Masks: lee, grant, everett, sherman, granger, lee_1865, galveston_officer, hired_man. Music: library cues per the revised plan in `script/MUSIC.md`. Text probe clean at the 96 px / 54 px safe margin. Next: render (`tools/render.sh`). |
| **Script** | [`script/SCRIPT.md`](script/SCRIPT.md) · chapter files `script/ch01_cold_open.txt` … `script/ch08_what_it_settled.txt` · review PDF in `review/` |
| **Images** | 76 archival images (plus `ch04/draft_office_burning_headley_1873_rot.jpg`, the Headley plate turned upright, and `ch08/company_e_4th_usct_fort_lincoln_c1864.jpg` from Video 2) in `public/img/ch01` … `ch08`, every one credited in `public/img/credits.json`; table and gaps in [`research/IMAGES.md`](research/IMAGES.md); contact sheets in `review/contact/` |
| **AI images** | [`script/FLOW_PROMPT.md`](script/FLOW_PROMPT.md) (series file; this video's scenes are `v3_*`) |
| **Maps** | [`script/MAPS.md`](script/MAPS.md) · base map `public/maps/civwar1861.json`. The tested map code (July 1863 and Sherman's march beats) is in `projects/In_Their_Own_Words/src/MapTest.tsx`. |

Sister projects: `projects/In_Their_Own_Words/` (Video 1) and `projects/Forever_Free/` (Video 2).
