# Thumbnail research: what we might be missing (Oct 27, 2026)

Second pass, focused on testing data and checks we haven't run. Competitor scan and general principles: `THUMBNAIL_RESEARCH.md`.
Source quality is mixed: YouTube's own pages are solid; most "CTR lift" numbers online are vendor blogs and were ignored.

## What the better sources say

| Finding | Source | What it means for us |
|---|---|---|
| Test & Compare: up to **3** titles, thumbnails or title+thumbnail combos; **winner = highest watch time**, not CTR; runs days to 2 weeks; options must be "meaningfully different"; any thumbnail under 1280×720 drags **all** test images down to 480p | [YouTube Help 16391400](https://support.google.com/youtube/answer/16391400?hl=en) | Our three test options should be three different *styles*, not word swaps (C vs C2 is a word swap). Because watch time decides, **the winner must match the first 30 s of the video**, so packaging decides the cold open: work backwards from it. |
| Thumbnails "appear much larger" on TV; file limit going **2 MB → 50 MB for 4K** thumbnails (Oct 29, 2025); "first impressions are everything on the big screen" | [YouTube blog](https://blog.youtube/news-and-events/new-features-to-help-creators/) | ~1/3 of US YouTube hours are on TVs (Drop Media figure, secondhand). We export 1280×720 PNGs and the Gemini art is 1376×768: upload **1920×1080 or 3840×2160**, and regenerate the chosen painting at 4K. AI flaws show on a TV. |
| "Glance test": everything readable in a glance; **3 or fewer focus points**; under ~5 words; view title and thumbnail **as one** (complement, don't repeat); make 3 options per video | Paddy Galloway ([X](https://x.com/PaddyG96/status/1811083499044044951), [X](https://twitter.com/PaddyG96/status/1742221359613190312)) | C has four focus points (door, kids, wagon, moon) plus tape: crop or simplify. |
| Look **familiar in the niche + one unexpected twist**; keep branding consistent; packaging matters more than production | [Colin & Samir: Paddy's new rules](https://www.colinandsamir.com/resources/the-new-rules-of-youtube-from-paddy-galloway) | Familiar = Halloween night, moon, kids. Twist = the wagon on the roof / the tear-gas headline. Keep the orange tape as the channel signature. |
| Sea of sameness from AI thumbnails; specific, believable promises beat dramatic ones for smaller channels | [vidIQ](https://vidiq.com/blog/post/ai-thumbnail-makers-destroying-youtube/), [tubemilestone](https://tubemilestone.com/blog/youtube-ctr-why-not-getting-clicks) | A *real* 1933 headline is a believable, specific promise. AI art should stay plainly illustration (the silhouettes do). |
| Halloween searches and viewing peak in October; seasonal search videos do best published weeks ahead | [Think with Google](https://thinkwithgoogle.com/advertising-channels/video/october-youtube-trends), [Pixability](https://www.pixability.com/youtube/heres-how-viewers-are-turning-to-halloween-content-on-youtube/) | Halloween is Saturday. If the video misses this week, design packaging that also works next September (evergreen title, no "2026"). |

## Gaps in what we've done so far

1. **No feed mock-up.** We checked phone size alone, not *next to* competitors in a dark- and light-mode feed. Next: drop our three into a mock home feed with the top competitor thumbnails.
2. **Resolution.** Export 1920×1080 (or 4K) for upload; regenerate the winning painting at 4K with `imageSize`.
3. **AI flaws at TV size** (close-ups checked): the wagon's wheels don't line up (one pair floats), the middle boy's ladder passes through him, and a stray emblem sits on the ghost's chest. Fix on regeneration.
4. **Packaging → script.** The test winner must be on screen at frame 0 with a matching hook line. Each test option needs its own payoff early in the video: the wagon painting (C/D), the headline (E), the masks (F).
5. **Too many focus points in C.** Try a tighter crop: kids at the lit door + the wagon on the moon, with the tape over the sky.
6. **Test set should differ in style:** e.g. F (B&W photo, faces) vs E (real headline) vs C or D (silhouette painting). Drop C2 (a word swap).
7. **Logo.** The top-left logo uses about 6% of the frame. Most large channels skip it, since the channel name shows under the video. Worth one test; the channel rule keeps it for now.
8. **After Halloween:** plan a November thumbnail and title that drop the seasonal hook, then a September refresh (Paddy: updating an old video's thumbnail can revive it).

## Feed mock-up results (`review/feed_dark.jpg`, `review/feed_light.jpg`; `python3 tools/feed_mock.py`)

- C and D (orange silhouette paintings) disappear among Fire of Learning, Mr. DeMaio and The History Guy.
- E and F stand out: the only B&W and newsprint thumbnails in the grid.
- F looks a lot like HISTORY's "Trick or Treating's Tricky History" (masked vintage kids), the one competitor on our angle.
- The Chunk History logo is unreadable at feed size.
- **G (headline in two strips + coral 1964 monster mask, no logo) is the clear standout**: the largest readable text in the grid and the only coral.
- Watch out: a channel called "Crunchy History" posts Halloween prank videos (its name is close to Chunk History).
- Honesty note for G: the mask is from 1964 and the headline from 1933. The mask stands in for "Halloween"; the video must not imply that kid was gassed.
