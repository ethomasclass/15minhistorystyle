# Reconstruction · music

Three layers, so the series sounds like the 1860s without turning into a costume drama:

1. **Real period recordings** (`music/period/`): songs of the 1850s–60s as recorded in 1902–1916, from the Library of
   Congress National Jukebox. Crackle and all. They're used as *source music* in the open moments (a chapter's first
   seconds, its tail after the last word, the series ending), **never under narration when they're sung**.
2. **New period-instrument beds** (`tests/public/music/rc_*.mp3`, ElevenLabs, prefix `rc_`): fretless banjo, fiddle, a
   saxhorn brass band, reed harmonium, a parlor piano. These sit under the narration.
3. **The channel library** (`music/cues/` at the style repo root) for the roles it already fills well: the title sting,
   intrigue, grief, the ending.

## The recurring tune: "Roll, Jordan, Roll"

It's one of the songs printed in *Slave Songs of the United States* (1867), collected on the Port Royal Sea Islands, the
same stretch of coast as the Edisto petition. Fisk University's singers recorded it in 1909, and Fisk was itself a
Reconstruction school: it opened in January 1866 and is named for the Freedmen's Bureau officer Clinton B. Fisk; its
Jubilee Singers started touring in 1871. It plays over the end card of each episode and, in full, under the last
pull-back of the series.

## The period recordings

All are on the LOC's [National Jukebox](https://www.loc.gov/collections/national-jukebox/); the LOC page for each is the
source to cite. LUFS is as downloaded: bring each to about −16 LUFS before use (the quiet ones need a lot of gain).

| File | Song (written) | Recording | Sung? | LUFS | Length | Use |
|---|---|---|---|---|---|---|
| `roll_jordan_fisk_1909.mp3` | "Roll, Jordan, Roll" (spiritual, printed 1867) | Fisk University Jubilee Quartet, Victor, Dec 21 1909 · [jukebox-128182](https://www.loc.gov/item/jukebox-128182/) | yes | −22.1 | 2:44 | The series motif: every episode's end card; the series ending |
| `swing_low_fisk_1909.mp3` | "Swing Low, Sweet Chariot" (spiritual, published by the Fisk singers 1872) | Fisk University Jubilee Singers, Victor, Dec 1 1909 · [jukebox-128141](https://www.loc.gov/item/jukebox-128141/) | yes | −15.4 | 3:00 | Ep 2 ch06 tail (the high point) |
| `steal_away_dinwiddie_1902.mp3` | "Steal Away" (spiritual) | Dinwiddie Colored Quartet, Victor, Oct 29 1902, among the earliest recordings by a Black vocal group · [jukebox-4649](https://www.loc.gov/item/jukebox-4649/) | yes | −17.2 | 2:54 | Ep 3 ch01, the silence after Caldwell's death |
| `marching_through_georgia_princes_band_1916.mp3` | "Marching Through Georgia" (Henry Clay Work, 1865: Sherman's march) | Prince's Band, Columbia, Jun 30 1916 · [jukebox-654453](https://www.loc.gov/item/jukebox-654453/) | no | −15.0 | 3:03 | Ep 1 ch02 open: Sherman reaches Savannah, then Field Order 15 |
| `war_songs_march_fife_drum_1907.mp3` | Civil War songs medley | Victor Drum, Fife and Bugle Corps, Jul 12 1907 · [jukebox-1059912](https://www.loc.gov/item/jukebox-1059912/) | no | −20.0 | 2:40 | Ep 2 ch02 open: the army goes back in, five districts |
| `memories_of_the_war_conway_1915.mp3` | "Memories of the War: 1861–1863" (medley of Root and Work) | Conway's Band, Victor, Sep 21 1915 · [jukebox-14887](https://www.loc.gov/item/jukebox-14887/) | no | −19.2 | 4:02 | Ep 1 ch04: the crowd outside the White House, April 1865 (cut dead at the shot) |
| `tenting_on_the_old_camp_ground_1904.mp3` | "Tenting on the Old Camp Ground" (Walter Kittredge, 1863: "many are the hearts that are weary tonight") | Victor, Jun 8 1904 · [jukebox-120033](https://www.loc.gov/item/jukebox-120033/) | yes | −25.5 | 2:37 | Ep 3 ch05 tail ("Tired") |
| `hard_times_brunswick_1910.mp3` | "Hard Times Come Again No More" (Stephen Foster, 1854) | Brunswick Quartette with Frank Coombs, Columbia, Dec 8 1910 · [jukebox-645406](https://www.loc.gov/item/jukebox-645406/) | yes | −22.3 | 3:17 | Ep 2 ch09 tail (the debt) |
| `southern_melodies_medley_1916.mp3` | medley (search matched "Kingdom Coming") | Victor, Jun 1 1916 (Bourdon, King, Van Eps) · [jukebox-17720](https://www.loc.gov/item/jukebox-17720/) | no | −21.8 | 2:55 | **Listen before use**: "Southern melodies" medleys of 1916 often mix in minstrel tunes |
| `lorena_1911.mp3` | "Lorena" (1857, a Confederate soldiers' favourite) | Frank Coombs, Columbia, Apr 7 1911 · [jukebox-762734](https://www.loc.gov/item/jukebox-762734/) | yes | −31.4 | 3:54 | Spare. Only if a scene needs the white South's nostalgia (the Redeemers) |

**Rights.** US sound recordings published before 1926 are in the public domain (Music Modernization Act, 2018; pre-1923
recordings since 2022, then a year at a time), and every song here is older still. The LOC's note "courtesy of Sony
Music Entertainment or EMI Music" is about the Jukebox's original license, not a copyright. A reissue label can still
send a YouTube Content ID claim on a public-domain recording: dispute it with the LOC link and the recording date. Credit
the performers in the description (e.g. "Swing Low, Sweet Chariot: Fisk University Jubilee Singers, 1909, Library of
Congress").

**Leave out.** "Dixie" and minstrel songs, even as instrumentals: in 1900s recordings they're sung in mock dialect, and
as background they read as celebration. "Kingdom Coming" is a real 1862 abolitionist song but written in minstrel
dialect; use it only as an instrumental, and only after hearing the recording.

## The new beds (`rc_`)

Made with `tests/tools/music_eleven.py` (prompts in that file). Every one is instrumental, period instruments, room for
the narrator.

| Cue | What it is | Where |
|---|---|---|
| `rc_jubilo` | Fretless banjo and fiddle trade a plain folk tune, quietly joyful; the second half thins to the fiddle with a hint of doubt | Ep 1 ch02 (forty acres), Ep 2 ch03 (registering to vote), Ep 2 ch06 (Revels) |
| `rc_brass_dirge` | A distant saxhorn band and muffled drum, a slow funeral march, one swell, then near-silence | Ep 1 ch04 after the shot; Ep 3 ch07 (Ames's telegram, no troops) |
| `rc_codes` | Pocket-watch tick, walking pizzicato, harmonium, a fiddle line circling the same notes: trapped | Ep 1 ch06 (Black Codes), Ep 2 ch09 (the debt), Ep 3 ch09 (the new laws) |
| `rc_night_riders` | Low fiddle drone, a hoofbeat rhythm that comes close and passes, distant brass; cold rather than loud | Ep 3 ch01, ch02 (the Klan), ch07 (Mississippi 1875) |
| `rc_parlor` | A polite, slightly out-of-tune parlor waltz on piano and harmonium that sours while it carries on | Ep 3 ch05 (the North gets tired), ch06 (the bank) |

## More beds, made locally (ACE-Step 1.5)

Free text-to-music, run in this session on CPU (`tests/tools/music_acestep.py --all`, captions in that file); about
3 minutes per 60 s cue. They're quieter than the ElevenLabs beds (−16 to −22 LUFS), so they sit about twice as high
in the mix. All are in the channel library (`music/cues/`) and on one sampler, `music/Reconstruction_acestep_cues_sampler.mp3`
(20 s of each, levelled, in this order). Nothing in the chapter plan below uses them yet: swap one in where it fits better.

| Cue | What it is | Could go |
|---|---|---|
| `cw_fife_dread` | Distant fife and muffled snare over a low drone, a slow march that builds in waves (music from ~0:15) | Any Civil War opening; Ep 1 ch01 if the cold open starts in the war |
| `cw_camp_night` | A lonely fiddle playing a homesick waltz over guitar and harmonica | Soldiers coming home, Ep 1 ch02 before Sherman |
| `cw_aftermath` | Low cello and a muted brass chorale over a heartbeat drum (music from ~0:08) | Memphis and New Orleans in Ep 1 ch09 (instead of `w_aftermath`), Colfax in Ep 3 ch04 |
| `cw_telegraph` | Urgent telegraph-like tick, tense strings, then a hush (tick from ~0:10) | News arriving: Ep 1 ch04 after the shot, Ep 3 ch07 (Ames's telegram), Ep 3 ch08 (the 1876 count) |
| `rc_jubilee` | Banjo, fiddle, claps and stomps: open joy (no doubt in it, unlike `rc_jubilo`) | Ep 2 ch05 (the 15th), Ep 2 ch06 (Revels) |
| `rc_resolve` | Harmonium hymn and cello, a restrained proud swell | Ep 1 ch08 (equal protection), Ep 2 ch03 (registering) |
| `rc_backroom` | Pizzicato, fussy parlor piano, low clarinet: sly | Ep 2 ch04 (one vote short), Ep 3 ch08 (1876) instead of `j_intrigue` |
| `rc_reckoning` | A distant brass band whose march falters; unresolved end | Ep 3 ch09 or ch10, before "Roll, Jordan, Roll" |

## Chapter by chapter

Beds at 0.13–0.17 under narration (quiet ElevenLabs cues higher: check LUFS). "Open" = the first seconds before
the narration takes over; "tail" = after the last word, before the logo break.

### Episode 1 · *Landless, Homeless, Voteless*

| Ch | Bed | Period moment |
|---|---|---|
| 01 Cold open | `r_cold_open` (the channel's cold-open identity) | — |
| 02 Forty acres | `rc_jubilo` from "Field Order" | Open: "Marching Through Georgia" (Prince's Band), 4–6 s as Sherman reaches Savannah |
| 03 Ten percent | `j_intrigue` | — |
| 04 Ford's Theatre | `rc_brass_dirge` from the morning after | Open: Conway's Band medley as the crowd gathers outside the White House; **cut to silence on the shot** |
| 05 Treason odious | `g_grip` | — |
| 06 Except as a punishment for crime | `rc_codes` | — |
| 07 The Bureau | `g_world_outside` | — |
| 08 Equal protection | `r_abolition_b` (determined build) | — |
| 09 Swinging round the circle | `j_campaign` for the tour, `w_aftermath` for Memphis and New Orleans | — |
| 10 Landless | `r_ending`, warm first half | Tail: **"Roll, Jordan, Roll"** over the end card |

### Episode 2 · *Bottom Rail on Top*

| Ch | Bed | Period moment |
|---|---|---|
| 01 Cold open | `r_cold_open` | — |
| 02 The army | `g_grip`, low | Open: the fife-and-drum "War songs march" under the five districts |
| 03 The blacksmith | `rc_jubilo` | — |
| 04 One vote short | `j_intrigue` | — |
| 05 The 15th | `w_dawn`: the sunrise swell lands on "Voteless" crossed out | — |
| 06 Bottom rail on top | `rc_jubilo` | Tail: "Swing Low, Sweet Chariot" (Fisk, 1909) |
| 07 Carpetbaggers | `a_price` (sardonic) | — |
| 08 No land | `m_lament` | — |
| 09 The debt | `rc_codes` | Tail: "Hard Times Come Again No More" (1910) |
| 10 Ground | `r_ending` | Tail: **"Roll, Jordan, Roll"** |

### Episode 3 · *Redemption*

| Ch | Bed | Period moment |
|---|---|---|
| 01 Cold open | `rc_night_riders`, low, **silence from the shot** | After the widow's testimony: a few bars of "Steal Away" (1902), then the question |
| 02 The Klan | `rc_night_riders` | — |
| 03 Protection works | `w_dawn` (the swell when the Klan is broken) | — |
| 04 Colfax | near-silence, then `j_grief` | — |
| 05 Tired | `rc_parlor` | Tail: "Tenting on the Old Camp Ground" (1904) |
| 06 The bank | `rc_parlor` second half (the souring) | — |
| 07 Mississippi, 1875 | `rc_night_riders`, then `rc_brass_dirge` from the telegram | — |
| 08 1876 | `j_intrigue` | — |
| 09 Voteless | `rc_codes` | — |
| 10 A few acres | `r_ending` | The series ending: **"Roll, Jordan, Roll"** in full under the last pull-back of the board |
