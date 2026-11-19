# Google Flow plan: Thanksgiving food video (draft 1, before the image search returns)

The final `FLOW_PROMPT.md` (one ordered prompt) gets written once the archival search shows the real gaps. Rules from the skill (`images-and-masks.md` §11): one locked palette, figures as one solid black shape in profile, no faces, no text, no recognizable real people, everything important inside the central 80%, 3–4 depth bands.

**Colour:** silhouette scenes keep the channel palette (ink, teal-slate haze, cream light, coral only on the subject). **Props** for cut-out can be in colour where it fits the era (the user, Nov 2026): the 1950s dishes in saturated magazine colour, the earlier ones in muted engraving tones.

## A. Silhouette scenes (full-frame parallax), about 6
| # | Scene | Chapter | Coral subject |
|---|---|---|---|
| S1 | A tidal river at dawn; a figure wading, treading eels from the mud. Squanto is a real person with no portrait: anonymous, labelled with `NoPhoto` | ch1/ch2 | the eel basket |
| S2 | The autumn 1621 gathering, wide and distant: tents, smoke, a deer carried in, many small figures | ch2 | the cooking fire |
| S3 | An 1800s dock: a crate of live sea turtles being unloaded from a ship | ch3 | a turtle |
| S4 | A Gilded Age dining room, a long table, diners in profile, a tureen being carried in | ch3 | the tureen |
| S5 | A Victorian kitchen at night: a cook hauling calves' feet out of a steaming pot, a jelly mould cooling | ch6 | the mould |
| S6 | A 1950s suburban kitchen: a hostess in profile at a counter of cans; a magazine propped open | ch7 | the casserole dish |

## B. Props (cut-outs on the desk; made on a plain background for `prop_cut.py` / `prop_cut_black.py`)
Eel (coiled); a green sea turtle; a meat mince pie, cut to show the filling; mince ingredients (beef, suet, raisins, a brandy bottle); a calves'-foot jelly in a copper mould; a Jell-O ring with suspended vegetables; a tuna-in-gelatin salad (1955 colour); marshmallow-topped sweet potatoes; a ridged cranberry log on a plate; three 1950s-style unbranded cans; a green bean casserole; a Broad-Breasted White turkey (side view); a Thanksgiving menu card (blank, for adding real type later).

No brand logos on generated props: real brands only from real ads.

## C. Animated silhouette clips (Flow image-to-video), the hero beats
The method from the Nov 2026 Rei test (`projects/Balloon_War/review/motion_test_rei_flow.mp4`; skill `images-and-masks.md` §11):
feed Flow the finished, palette-locked, upscaled scene painting as the start frame. One action per clip, tied to its narration line.
Export 1080p. Trim any opening border. Check frame by frame for morphing, faces, interior lines and text. `SilScene` parallax stays the main look.
Add to every motion prompt: *"Full frame from the first frame, no border or picture frame. Every object, including tools, is a solid black silhouette with no shading. Camera move only, slow."*

| Clip | From scene | Action (one) | Under the line |
|---|---|---|---|
| M1 | S1 eel river | The wading figure's foot presses into the mud; an eel wriggles up into the basket | "...knew how to catch these with their feet." (cold open, frame 0 candidate) |
| M2 | S3 turtle dock | A crate is lowered; a turtle's flipper pushes slowly against the slats | "...shipped alive from the Caribbean." |
| M3 | S5 Victorian kitchen | Steam rolls off the pot as the cook lifts the jelly mould; the jelly trembles | "...boiling calves' feet for hours." |
| M4 | S6 1950s kitchen | The hostess sets the casserole down; the can opener turns | "It's 1955. You're hosting..." |
