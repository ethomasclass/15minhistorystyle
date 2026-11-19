# Voice notes: deadpan delivery (the user, Nov 2026)

**The direction:** dry, flat, unbothered. The narrator reports absurd facts as if reading a grocery list. The jokes come from the *contrast* between the facts and the calm voice, never from the voice selling the joke. No smiling through the lines, no rising "isn't this crazy?" tone, no comic emphasis.

## How deadpan reads
- **Same pitch and energy on the weird line as on the normal one.** "You take out the brains" is read exactly like "you take a calf's head."
- **Endings go DOWN.** Statements land flat, with falling pitch, including the questions that are really statements ("Was it a good idea? Maybe.").
- **The pause does the work.** A beat *before* the punchline (set up the expectation), and a held beat *after* it (let it sit). Never rush past a joke.
- **Understate.** No exclamation marks anywhere; "Maybe!" became "Maybe."
- **Short sentences.** The punchlines stay three to six words: "That's step one." "Happy Thanksgiving." "It's still delicious."
- **Stay human.** Deadpan isn't bored or robotic. Clear, steady, a little dry; the wry voice is still there, just never winking.

## In the script
- Cues changed: every `[warm]` and `[wry]` is now `[deadpan]` or removed. At most one tag per paragraph, only on punchlines.
- **Ellipses (...) = a held beat** before a punchline. CAPS on one word = flat stress (used once: "it IS the can").
- Never `[quietly]` / `[softly]` / `[whispers]`: deadpan is flat, not quiet. Keep the level steady (`quiet_check.py` after voicing).

## The deadpan beats, line by line
| Ch | Line | Read |
|---|---|---|
| 1 | "...knew how to catch these with their feet." | First line, totally matter-of-fact, no hook voice |
| 1 | "And this." | Flat; let the can do it |
| 1 | "Honestly, it should be." | Sincere but level, no warmth push |
| 3 | "...cut off the head and save the blood." → "That's step one." | Read the quote straight, then a 1 s beat, then "That's step one" flatter still |
| 3 | "Meat in the soup. Meat on the platter. Meat in the pie." | Identical rhythm and pitch on all three: a list, not a build |
| 4 | "You take out the brains." | Exactly like the line before it |
| 4 | "The fake outlasted the real thing." | Down, final |
| 5 | "'Mary had a little lamb.' That was her." | No reveal voice; just information |
| 6 | "That's tuna. In lemon gelatin." → [3 s] → "Yes. People ate this. On purpose." | The peak of the video: the silence, then three flat sentences with small gaps |
| 7 | "Was it a good idea? Maybe." | "Maybe" drops, no shrug in the voice |
| 7 | "Because it IS the can. Those ridges are the can's ridges." | Flat stress on IS; the second sentence even flatter |
| 8 | "...nearly every one of them now comes from artificial insemination." → "Happy Thanksgiving." | Serious and clinical on the fact; a 1.5 s beat; "Happy Thanksgiving" sincere and flat, as if nothing odd was said |
| 8 | "Unlike the marshmallow people, I'm not selling you anything." | Dry, no wink |
| 8 | "Your grandmother's recipe card was probably an ad." → "It's still delicious." | A beat between them; the last line is kind but level: the only warmth is in the words |

## ElevenLabs settings test (cold open first)
Deadpan pulls against the house setting (`VOICE_STABILITY=0.0`, Creative, which is the most expressive). Voice the cold open three ways and pick by ear:
- **A:** Creative (0.0) + the `[deadpan]` tags (the house setting).
- **B:** Natural (0.5), with the tags removed. A steadier, flatter read; it follows tags less, which is fine here.
- **C:** Natural (0.5) + `[deadpan]` only on the punchlines.
Keep `eleven_v4`, one take per chapter, speed 1.0, `similarity_boost` 0.85. If a take still sounds too "performed", lower the style exaggeration to 0 if the tool exposes it, or swap a punchline's `[deadpan]` for an ellipsis beat before it.
