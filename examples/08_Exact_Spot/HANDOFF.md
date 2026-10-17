# Handoff: The Exact Spot

**The Exact Spot: Texas, the Mexican-American War, and the Question It Reopened** (1821–1848) · 14:45 · 10 chapters · 2,485 words.
Built in this repo at `projects/Mexican_American_War/` on branch `claude/relaxed-lamport-62biq7`, from the lesson card
[`lesson2_day2_card.png`](lesson2_day2_card.png) (Lesson 2, Day 2: *Texas, the War with Mexico, and the Wilmot Proviso*).

## The documents here

| File | What it is |
|---|---|
| [`SCRIPT.md`](SCRIPT.md) | Narration with production notes, cut list, pronunciation, fact-check flags and sources |
| [`OUTLINE.md`](OUTLINE.md) | The first outline (superseded by the script) |
| [`VISUALS.md`](VISUALS.md) | The scene-by-scene visual plan |
| [`FLOW_PROMPT.md`](FLOW_PROMPT.md) | One master prompt for every AI image, in the 1840s wood-engraving style |
| [`MUSIC.md`](MUSIC.md) | Music plan with the three new Suno prompts (`m_frontier`, `m_war_drums`, `m_lament`) |
| [`YouTube_description.md`](YouTube_description.md) | Title, description, chapters, tags, upload settings |
| [`Exact_Spot_viewing_guide.md`](Exact_Spot_viewing_guide.md) · [`Exact_Spot_teacher_key.md`](Exact_Spot_teacher_key.md) | The student viewing guide and its key (the live copy is a Claude Doc with the key in a second tab) |

## How it was made

- **Story:** Lincoln's Spot Resolutions as the cold open ("Where is the spot?"), then Texas from 1821, the revolution, annexation, Polk
  and the Nueces Strip, the war, the critics, the treaty, who paid, and the Wilmot Proviso. The ending ties back to the question
  and points to the Civil War: "It took about 13 years to work."
- **Both sides:** supporters (a defensive war, Manifest Destiny) and critics (Polk put the army where a fight was likely, and Congress
  voted after the shooting started); historians still disagree.
- **Look:** the channel look plus the **3D tilted map** in every chapter and **Flow wood engravings** for the 17 scenes with no
  surviving image. Real documents (the Texas Declaration, Polk's diary, Grant's memoirs, the treaty) are marked up on cards.
- **Masks:** rembg first, then `refine_mask.py` and hand traces for every mask that was rough; checked with `mask_closeup.py`.
- **Music:** 10 library cues and 3 new Suno cues; the bed lifts after each chapter's last word.

## Your notes during the build (now in the standing preferences)

- "Make sure you are checking masks. The last one of the portrait looked rough." → full-resolution checks and hand traces.
- The ambush picture ("Why are they inside a fence?") → a map plus a drawn trap diagram.
- Grant and Lee's heads leaving the shot → focus on the faces, a smaller push.
- The Civil War allusion at the end was too quiet → UNION / CONFEDERACY / border states labels, a key, Fort Sumter, THE CIVIL WAR.
- Worksheet: true/false and short answer, the video's exact wording, cover the lesson card, 20 questions, no date questions, a teacher key.
- Thumbnail D: "Mexican-American War: Who started it?" with images of the war, not one person.
- Search anywhere for images, not just Wikimedia.
