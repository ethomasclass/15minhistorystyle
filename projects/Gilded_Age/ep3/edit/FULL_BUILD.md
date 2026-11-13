# Episode 3: finish the whole video (user, Nov 13, 2026: "Finish rest of video completely")

Chapter 1 is approved (`ch01.js`, `CH01_PLAN.md`, README round notes). Build chapters 2 to 9 the same way, then assemble the
full episode, 720p review and 1080p master.

## 0. Fix first: the Chunk logo intro + title card

The user: "chunk history logo intro needs to be like the other 2 videos... it came in late and up top instead of center then
making way for title card." Restore Episode 2's intro exactly (`../../ep2/edit/title.js` and its timing in `../../ep2/edit/assemble.sh`):
the Chunk logo assembles CENTRED, then makes way for the title card. Only the text changes ("He Sent Me", episode 3 of 6, as now).
Re-render the title part and the cold-open preview.

## 1. Sources for every chapter

- Script and chunk files: `../script/SCRIPT.md`, `../script/chNN_*.txt`. Voice: `../public/audio/chNN_*.wav` and words.json.
  Dialogue chapters (ch03, ch04, ch07, ch09) use `chNN_*.scene.wav` + `chNN_*.fx.wav` (as ch01); ch06 has an fx bed too
  (market) with the plain voice: use `ch06_*.scene.wav` if present (identical to the plain wav) plus its fx. See `../script/SOUND.md`.
- Shot plan per chapter: `../script/VISUALS.md` (table + "3D neighborhood model" section). Archival: `../public/img/<topic>/`,
  `../research/IMAGES.md` (use, flags, credits; every archival image gets its source tag; sensitive images per the flags:
  caricatures brief, small, framed by narration, never animated or mocked; no slur prints; violence off-screen).
- Built clips (lookdev, all review mp4s in `../../lookdev/review/ep3/`):
  - ch02: `ep3_shtetl`, `ep3_pale_map` (+ vocab cards), archival a_departure (tsar 1881; NOT the Kiev pogrom engraving).
  - ch03: `ep3_letter` (kitchen + route map), `ep3_chain`, `ep3_steerage`; The Sun 1884 ad.
  - ch04: `ep3_castle_garden`, `ep3_stat_cg`, `ep3_names` (FIX: its Hebrew-style letter marks become abstract scribbles, no real
    letter shapes), archival c_arrival (Ulrich 1884, Shults 1880, Barge Office, Ellis Island 1892+ dated on screen, S.S. Russia
    manifest in h_names), then the RUNNER PAYOFF: the second half of `ep3_runner` (Rivke grabs Shmuel back, push-in, Yankel
    through the crowd, runner gone), retimed to the words as ch01 did.
  - ch05: `ep3_old_new`, `ep3_decades`, ending on `ep3_map_arrival` so the card lands on "the Lower East Side".
  - ch06: `ep3_hester` (walk, then the room at night), `ep3_enclave` (the 3D network, the user's favourite), `ep3_map_density`,
    `ep3_tenement_plan` if needed, archival d_streets (Riis, Hester St 1897 dated).
  - ch07: `ep3_map_sweatshop` (dive) → `ep3_sweatshop`, `ep3_piecework` (+ Riis card), archival e_sweatshop; a split or callback
    to Ma Kelly sewing shirts (Ep 2 kelly_flat) on "Sound familiar?".
  - ch08: `ep3_laws`, `ep3_nativism` desk, Puck 1882 "anti-Chinese wall" (g_nativism), Kearney (portrait if public domain, else
    text), `ep3_looking_backward` (25 s read, timed to its lines), `ep3_pedestal`, New Colossus card; Statue images.
  - ch09: `ep3_map_move` → `ep3_moving_in` (Michael, "More of them") → `ep3_knock` (the conversation; extend acting as ch01's
    dialogue: speaker-driven gestures, no long static holds) → `ep3_letter` reprise with the ticket folded in; Moran's 1886 Statue
    unveiling for "That fall..."; the next-time line and end screen (as Ep 2: ga_gilded_theme end screen, 20 s).
- Anything the plan needs that doesn't exist: build it in the same lookdev style (ep3.js drawn sets, ep3_map.js model shots,
  ep3_explain.js diagrams).

## 2. Transitions: the baton rule (SCRIPT.md "Transitions")

Each chapter ends on the next chapter's title spoken as its last words. The chapter card (torn orange strip, Abril, -2°, the
next chapter's title) slams in ON those words (timed from the outgoing chapter's words.json), holds 2.0 s under the outgoing
music, then the next chapter opens. Use the chunk_snap click as Ep 2's break did. Titles: 2 What They Left Behind, 3 The
Ticket, 4 Castle Garden, 5 Old and New, 6 The Lower East Side, 7 Sweatshop, 8 Shut the Door, 9 New Neighbors.

## 3. Music (`../public/music/`, levels about 0.1 like Ep 2; measured LUFS in SUNO notes)

ch02 `ga_letters` (low, mournful use) or `ga_steerage` remainder; ch03 `ga_letters` → `ga_steerage` under the crossing;
ch04 `ga_castle_garden`, dropping to the harbor bed for the payoff; ch05 `ga_castle_garden` / neutral bed; ch06
`ga_new_neighbors`; ch07 `ga_sweatshop`; ch08 `ga_not_welcome`, `ga_looking_backward` for the Keppler read, a warmer turn for
Lazarus and the pedestal; ch09 `ga_new_neighbors` → `ga_gilded_theme` (series theme, in `../../ep1/public/music/`) for the
ending and end screen. Dip music under dialogue. Cues may start partway so their turns land on lines.

## 4. Rules (the user's)

Coral only for the Kellys; the Rabinowitzes wheat gold; everyone else ink; teal explains; orange torn strips/handwriting. Text
on screen >= 2.5 s and never cut off (text audit every chapter). Animation contacts precise (contact audit every chapter).
Flat-ground walking = Episode 1's walk cycle via stepWalk; never crouch-walk; no long static holds (idle life, speaker-driven
acting). Sound effects only for things on screen; no whooshes or page turns. No em dashes anywhere. Never name the series
compelling question. Real people never get faces in drawn sets.

## 5. Machine limits (important)

Disk has about 9.5 GB free; one chapter's frames take about 4.5 GB. ONLY ONE RENDER AT A TIME across all builders: wrap every
frame render (build_ch.sh, anim.mjs batches) in `flock /tmp/claude-0/-home-user-15minhistorystyle/7afe6234-6524-526b-bd0e-87942f84759b/scratchpad/render.lock <cmd>`,
and delete frames as soon as a chapter is encoded. Keep your own scratch frames in your own folder.

## 6. QA per chapter (before calling it done)

Contact sheet every 3 s (Read it), beat-to-word table, text audit, contact audit, chapter loudness (-18.2 LUFS like ch01).
Fix and re-render. Then the full assemble (`assemble.sh`): 720p review (and a 540p preview under 30 MB for chat), 1080p master
to `../renders/ep3_full_1080p.mp4` via Git LFS (as Ep 2; check .gitattributes), mastered to -14 LUFS. Write chapter timestamps
from the final part durations to `../YOUTUBE_CHAPTERS.md`.
