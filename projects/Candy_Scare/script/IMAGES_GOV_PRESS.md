# Images: U.S. government (public domain) and press (fair-use candidates)

Sourced 2026-10-23 for *The Candy Man* Short. Scope: U.S. government sources and 1982 press coverage (another pass
covers Wikimedia / LOC / museum archives). All files are under `public/img/`; every file has an entry in
`public/img/credits.json`, keyed by its path relative to `public/img/` (`gov/...`, `fairuse/...`) like the house
`find_images.py` writes them. Everything goes on screen black and white, so the colour originals are fine.

- `gov/`: U.S. federal works, public domain (17 U.S.C. § 105). DOJ/DEA site policy: "Unless otherwise indicated,
  information on Department of Justice websites is in the public domain"
  ([justice.gov/legalpolicies](https://www.justice.gov/legalpolicies)). Seals and insignia are excluded, so keep the DEA
  seal out of the frame.
- `fairuse/`: every file name starts with `FAIRUSE_`. These are copyrighted: use a short crop, on screen only while the
  narration comments on it, with the credit tag. See "Rights notes" below.

## The DEA sentence (beat 0:37–0:41)

> "Dubbed “rainbow fentanyl” in the media, this trend appears to be a new method used by drug cartels to sell highly
> addictive and potentially deadly fentanyl made to look like candy to children and young people."

From the second paragraph of *DEA Warns of Brightly-Colored Fentanyl Used to Target Young Americans*, dated **August 30,
2022**, <https://www.dea.gov/press-releases/2022/08/30/dea-warns-brightly-colored-fentanyl-used-target-young-americans>
(also mirrored at `/2022/09/01/...`). Other lines you could lift:

- Lede: "The Drug Enforcement Administration is advising the public of an alarming emerging trend of colorful fentanyl
  available across the United States."
- Anne Milgram: "Rainbow fentanyl—fentanyl pills and powder that come in a variety of bright colors, shapes, and
  sizes—is a deliberate effort by drug traffickers to drive addiction amongst kids and young adults."
- Footnote on the page: updated 10/12/2022 (seizures in 26 states, up from 18). The release never mentions Halloween,
  which matches the fact-check flag.

dea.gov blocks plain `curl` (Akamai 403). Headed Chromium under `xvfb-run` loads it fine.

## Public domain (`gov/`)

| File | Shows | Source URL | Licence | Size | Use (beat) | Notes |
|---|---|---|---|---|---|---|
| `gov/dea_2022_rainbow_fentanyl_m30_pills.jpg` | Pile of pastel "M 30" fentanyl pills in a plastic bag, "DEA" watermark bottom right | [press release](https://www.dea.gov/press-releases/2022/08/30/dea-warns-brightly-colored-fentanyl-used-target-young-americans), file [Rainbow fentanyl m30.jpg](https://www.dea.gov/sites/default/files/2022-08/Rainbow%20fentanyl%20m30.jpg) | PD, U.S. federal (DEA) | 3768×3024, 3.8 MB | **0:39 pill cut-out (best pick)**; also the source for the rainbow pill in the hand at 0:37 | The only DEA-credited photo in the release (watermark). Pills read as candy even in B&W. Crop the watermark or keep it as proof. EXIF 2022-08-24. |
| `gov/dea_2022-08-30_press_release_lede_card.png` | Headline, "August 30, 2022" and the lede paragraph with "made to look like candy to children and young people" | same page | PD | 1881×743 | **0:39 DocLift card (best pick)** | Two crops of the screenshot joined (title block + first paragraph), carousel removed. The line to lift is the last 2 lines. |
| `gov/dea_2022-08-30_press_release_article.png` | Title, date, contact, pill slideshow photo, full body text | same page | PD | 1881×3921 | 0:39 alternative card (tall) | The slideshow caption on the photo shows in Spanish ("Fentanilo arcoíris...") as served today. |
| `gov/dea_2022-08-30_press_release_fullpage.png` | Full-page screenshot incl. DEA header and footer | same page | PD (seal excepted) | 2530×6862 | Archive / proof | Captured 2026-10-23 with Playwright (Chromium 1194, 2× scale). |
| `gov/dea_2022-10_nyc_rainbow_fentanyl_lego_box.jpg` | Bag of pastel pills next to an open LEGO Classic box of bricks | [DEA NY, Oct 4 2022](https://www.dea.gov/press-releases/2022/10/04/trafficker-quantities-rainbow-fentanyl-arrive-new-york) | PD (uncredited on DEA release) | 4032×3024 | Alt for 0:37–0:39 ("looked like candy" / toys) | The release says the cartels "use colors and dyes to mimic candy and/or legitimate prescription drugs". Joint announcement with NYC Special Narcotics Prosecutor and NYPD; photo carries no outside credit. LEGO trade dress is visible: crop it if you'd rather not show a brand. |
| `gov/dea_2022-10_nyc_rainbow_fentanyl_bag.jpg` | Plastic bag of pink/yellow/green/blue pills | same Oct 4 release | PD | 4032×3024 | Alt pill cut-out | Cleaner shape than the M30 pile for a cut-out. |
| `gov/fr_1982-11-05_p50442_tamper_resistant_rule.jpg` | Federal Register p. 50442: FDA final rule "Tamper-Resistant Packaging Requirements…", summary ("seven deaths in the Chicago area"), "I. Background / The Chicago Poisonings" | [govinfo FR-1982-11-05.pdf](https://www.govinfo.gov/content/pkg/FR-1982-11-05/pdf/FR-1982-11-05.pdf), PDF p. 258 | PD | 2430×3271 (300 dpi) | **0:28–0:34 Tylenol beat (best gov pick)**: a desk card under "Seven people died"; DocMark on "seven deaths in the Chicago area" | Vol. 47, No. 215, Docket 82N-0330, 21 CFR 211/314/700. Old-paper tone; desaturates well. |
| `gov/fr_1982-11-05_tamper_rule_part4_cover.jpg` | Federal Register, Friday Nov 5 1982, Part IV divider: big vertical "federal register", "Food and Drug Administration / Tamper-Resistant Packaging Requirements … Final Rules" | same PDF, p. 257 | PD | 2422×3269 | Alt card for 0:28–0:34 | Strong graphic shape, fewer words. Good if the beat only needs "the government changed the packaging". |
| `gov/statute_1983-10-13_federal_anti_tampering_act_p831.jpg` | Public Law 98-127, "Federal Anti-Tampering Act", 97 Stat. 831, first page (§ 1365, life imprisonment if death results) | [govinfo STATUTE-97-Pg831.pdf](https://www.govinfo.gov/content/pkg/STATUTE-97/pdf/STATUTE-97-Pg831.pdf) | PD | 1893×2837 | Optional (the fear's legacy) | Not in the current narration. |
| `gov/senate_hearing_1983-03-04_anti_tampering_cover.jpg` | Title page: "The Federal Anti-Tampering Act. Hearing before the Committee on the Judiciary, United States Senate … S. 216 … March 4, 1983" (S. Hrg. 98-182) | [archive.org micro_IA41152802_0397](https://archive.org/details/micro_IA41152802_0397) | PD (GPO) | 2043×3199 | Optional | Microfiche scan, black border. |
| `gov/senate_hearing_1983-03-04_p24_halloween_cancelled.jpg` | Hearing p. 24, testimony of Stephen W. Grafman (Grocery Manufacturers of America) | same, PDF p. 27 | PD (GPO publication) | 2073×3085 | **0:34 backup / partner card** for "some towns banned trick-or-treating" | The PD alternative to a newspaper clipping. |
| `gov/senate_hearing_1983-03-04_p24_halloween_quote_crop.jpg` | The paragraph ending "…this past fall numerous communities felt compelled to cancel their own Halloween activities." | same | PD | 1612×369 | 0:34 DocLift line | Crop of the page above. Same hearing, PDF p. 53 (Q&A with Grafman): "The fear that gripped this country last fall … and caused cancellation [of] Halloween observances" (poorer scan, not cropped). |

## Fair-use candidates (`fairuse/`)

| File | Shows | Source URL | Licence | Size | Use (beat) | Notes |
|---|---|---|---|---|---|---|
| `fairuse/FAIRUSE_thehour_1982-10-28_p2_halloween_kooks_article.png` | Headline **"Halloween For Kids Threatened As 'Kooks' Widen Deadly Tricks"** + 3 columns. Text: "Dozens of cities around the nation … are canceling Halloween doorbelling"; "Ascension Parish and Hammond, La., **Vineland, N.J.**, Providence, R.I., and Mogadore, Ohio, became the latest among at least 40 cities to ban traditional trick-or-treating"; Byerly Hospital (S.C.) invites trick-or-treaters "to bring in bags of candy for X-rays"; Houston and Reno hospitals too | [Google News Archive](https://news.google.com/newspapers?id=VipJAAAAIBAJ&sjid=rwYNAAAAIBAJ&pg=864,5082514) | Fair use candidate: The Hour / AP, all rights reserved | 1044×826 | **0:34 clipping (best pick)**; the headline is legible at Short size and the body names Vineland | AP story by John Daniszewski, *The Hour* (Norwalk, Conn.), Thu Oct 28 1982, p. 2. The same AP copy ran in many papers that week. |
| `fairuse/FAIRUSE_thehour_1982-10-28_p2_halloween_kooks_headline.png` | The two-line headline only | same | same | 1044×157 | 0:34 highlighter sweep target | For the coral `DocMark swipe`. |
| `fairuse/FAIRUSE_thehour_1982-10-28_p2-3_spread.jpg` | Full pp. 2–3 spread | same | Fair use candidate: The Hour | 4432×3328 | Reference only | For checking context or re-cropping. The pumpkin photo above the story is AP (a dog, no children). |
| `fairuse/FAIRUSE_freelancestar_1982-10-27_p1_uncertainties_bewitching_halloween.png` | Masthead "The Free Lance-Star … Fredericksburg, Virginia, Wednesday, October 27, 1982" + banner headline **"Uncertainties bewitching Halloween"** + article: "what might be called 'the great Tylenol Scare'"; Mary Washington Hospital "will offer the X-rays of trick-or-treat goodies"; "we won't be able to detect poisons … only metallic objects" | [Google News Archive](https://news.google.com/newspapers?nid=9fRKRCJz75UC&dat=19821027&printsec=frontpage&hl=en) | Fair use candidate: The Free Lance-Star, all rights reserved | 1433×801 | **0:34 alternative; strong for 0:41 X-ray** ("X-rays find metal, not drugs" is in the 1982 text) | Front page, by Paul Sullivan. Masthead and date on the same crop, which helps it read as 1982. |
| `fairuse/FAIRUSE_freelancestar_1982-10-27_p1_frontpage.jpg` | Whole front page | same | same | 1935×3071 | Reference / a wider establishing card | Photo on the page is an adult painting a porch. |
| `fairuse/FAIRUSE_thehour_1982-11-01_p1_halloween_scares_real.png` | **"Halloween Scares Real All Across the Country"**: "police in 24 states took more than 300 reports of apples and candy sabotaged with pins, needles and razor blades"; parents "got the goodies X-rayed at local hospitals" | [Google News Archive](https://news.google.com/newspapers?id=nR1JAAAAIBAJ&sjid=NgYNAAAAIBAJ&pg=864,0) | Fair use candidate: The Hour (wire copy), all rights reserved | 681×612 | Optional; careful with it | **Fact-check caution:** "300 reports" are *reports*, mostly hoaxes (Joel Best's tally lists 12 reported cases for 1982), and the 13-year-old and Somerdale stories are unverified. Fine as "the panic", never as evidence. Only the article crop was kept: the front page has a photo of trick-or-treating children. |
| `fairuse/FAIRUSE_tdcj_1975_obryan_death_row_record.jpg` | Texas death-row sheet: "Ronald Clark O'Bryan, D.R. #529, DOB 10/19/44, received 07/14/75, Harris County … Summary: Convicted of murdering his son, Timothy O'Bryan, by poisoning his Halloween candy with cyanide", annotated "#3 3-31-84", 1975 profile + front mugshots (placard "TEXAS EX 529 1975") | [TDCJ image](https://www.tdcj.texas.gov/death_row/dr_info/obryanronald.jpg) (linked from [last statement page](https://www.tdcj.texas.gov/death_row/dr_info/obryanronaldlast.html)) | Fair use candidate: Texas Dept. of Criminal Justice (state record, **not** federal; no licence stated) | 840×1097 (grayscale) | **0:24 "the dad" (best pick)**: the whole sheet as a desk card, or the face as a cut-out | Names the victim in typed text; no image of him or any child. |
| `fairuse/FAIRUSE_tdcj_1975_obryan_mugshot_front.jpg` | Front mugshot only, crop of the sheet | same | same | 217×310 | 0:24 small cut-out | Low-res: keep it small (under ~300 px tall on the 1080 frame) or use the full sheet. |
| `fairuse/FAIRUSE_houstonchronicle_1975-06-03_obryan_leaving_court.jpg` | O'Bryan in a pinstripe suit, handcuffed, holding a folder, beside an older man (an officer/bailiff), after the guilty verdict | [Commons file page](https://commons.wikimedia.org/wiki/File:Ronald_Clark_O%27Bryan_being_escorted_from_courtroom.jpg) (the Wikipedia infobox image) | Fair use candidate: *Houston Chronicle* (photo by Othell O. Owensby Jr.), all rights reserved **unless** the Commons PD claim is verified | 960×934 (Commons 960px thumbnail; original 1488×1448) | **0:24 cut-out alternative**: sharper and more dramatic than the mugshot; the handcuffs say "caught" | Commons says PD-US-no-notice ("The newspaper has no copyright notice on it"); unverified. The original-size file was rate-limited (HTTP 429), so re-fetch the 1488px original before rendering. Crop the other man out for the cut-out. |

## Best pick per beat

| Beat | Pick | Backup |
|---|---|---|
| 0:24 "the dad" | `FAIRUSE_tdcj_1975_obryan_death_row_record.jpg` (sheet as a desk card; the summary line says the whole twist) | `FAIRUSE_houstonchronicle_1975-06-03_obryan_leaving_court.jpg` as the rising cut-out (best face, handcuffed); mugshot crop |
| 0:28–0:31 Tylenol / "Seven people died" | `fr_1982-11-05_p50442_tamper_resistant_rule.jpg` (DocMark "seven deaths in the Chicago area") | `fr_1982-11-05_tamper_rule_part4_cover.jpg` |
| 0:34 towns banned trick-or-treating | `FAIRUSE_thehour_1982-10-28_p2_halloween_kooks_*` (headline + "Vineland, N.J. … at least 40 cities to ban") | PD: `senate_hearing_1983-03-04_p24_halloween_quote_crop.jpg`; press: Free Lance-Star front page |
| 0:37–0:39 rainbow fentanyl | `dea_2022_rainbow_fentanyl_m30_pills.jpg` + `dea_2022-08-30_press_release_lede_card.png` | NYC LEGO-box and bag photos |
| 0:41 candy X-ray | Drawn, as planned (no PD photo found) | `FAIRUSE_freelancestar_…` crop ("only metallic objects") if you want a real document |

## Found but not downloaded

- **O'Bryan courtroom photo, full size**: the 1488×1448 original on Commons (only the 960px thumbnail was downloaded, because upload.wikimedia.org returned HTTP 429 for the original). Source given as newspapers.com page 1201541998 (*Houston Chronicle*): check that page for a copyright notice.
- **O'Bryan mugshot on Wikipedia**: [File:Ronald_Clark_O'Bryan.jpg](https://en.wikipedia.org/wiki/File:Ronald_Clark_O%27Bryan.jpg),
  386×258, a non-free upload of the TDCJ image above with an English-Wikipedia fair-use rationale ("visual identification
  … subject is deceased"). Our TDCJ download is the same picture at higher resolution.
- **TDCJ last statement** (text): <https://www.tdcj.texas.gov/death_row/dr_info/obryanronaldlast.html>. TDCJ lists
  the execution date as **March 30, 1984**; he died just after midnight on March 31 (the script's flag says Mar 31;
  both appear in sources).
- **Senate Report 98-69, "The Federal Anti-Tampering Act"** (May 2, 1983): [archive.org micro_IA41152802_0432](https://archive.org/details/micro_IA41152802_0432). PD, text only, no Halloween line.
- **Congressional Record, Dec 7 and Dec 14, 1982** (govinfo `GPO-CRECB-1982-pt21`, `-pt22`): full-text search hits
  for Halloween + tampering. Not checked page by page.
- **DEA Oct 12, 2022 Bronx seizure (300,000 pills)**: <https://www.dea.gov/press-releases/2022/10/12/major-seizure-approximately-300000-rainbow-fentanyl-pills-and-over-20>.
  Photos (6000×4000, PD): "Different colored fentanyl pills.JPG", "Trash bag filled with rainbow colored fentanyl.JPG",
  which mostly show evidence bags on a table. Release text: "candy-colored fentanyl".
- **DEA Aug 30 release, other 4 slides**: credited "Multnomah County Sheriff" and "Tigard Police Department" (Oregon
  local agencies, so not federal works and not PD by default). Left out.
- **DEA One Pill Can Kill** (<https://www.dea.gov/onepill>): "Authentic_Fentanyl_lethal_dose" (2 mg of fentanyl on
  a pencil tip, 4389×2668, PD) and real-vs-fake oxycodone/Xanax/Adderall comparison graphics. None of them show
  rainbow pills.
- **The Battalion (Texas A&M), Oct 29, 1982, p. 1**: reportedly says hospitals in Amarillo and Houston would X-ray
  treats. <https://newspaper.library.tamu.edu/lccn/sn86088544/1982-10-29/ed-1/seq-1.pdf>. Blocked by a Cloudflare
  challenge, and the Wayback Machine was rate-limiting. Student paper, so rights are unclear.
- **Record-Journal (Meriden, Conn.), Sat Oct 30, 1982, p. 1**: "Incidents bring Halloween jitters", plus the facing
  page "Tylenol copycat tamperings mounting across nation" (Oct 29).
  [GNA](https://news.google.com/newspapers?id=KNlHAAAAIBAJ&sjid=FgANAAAAIBAJ&pg=1024,4066280). Fair-use candidate.
- **Sarasota Herald-Tribune, Oct 28, 1982, p. 10**: "Children Concerned By Dangers That May Haunt Halloween Treat".
  [GNA](https://news.google.com/newspapers?id=-SMhAAAAIBAJ&sjid=O2gEAAAAIBAJ&pg=608,6599840). Same paper, Oct 30
  p. 19: "Trick-Or-Treat Alternatives Offer Safe, Fun Halloween".
- **Christian Science Monitor, Oct 28, 1983, "Taking the scare out of Halloween"**: <https://www.csmonitor.com/1983/1028/102819.html>.
  Says 1982 candy sales were "generally off 10 to 25 percent". **Fact-check note:** the script's flag says 20–50% (Mental
  Floss); the contemporary figure is lower. The narration doesn't use a number, so nothing breaks.
- **Halloween candy X-ray, federal**: [DVIDS story 146498](https://www.dvidshub.net/news/146498/halloween-candy-x-ray)
  (Fort Hood, Oct 29, 2014: the 79th Ordnance Battalion offered free candy X-rays at Club Hood), text only, no photo.
  Nellis AFB 2011 article (text). DVIDS image search for candy/X-ray/Halloween found **no** candy X-ray photo.

## Gaps

- **No public-domain candy X-ray photo** (DVIDS, af.mil, army.mil searched). The plan already draws the X-ray. Patient
  First / hospital photos exist but are corporate and press images.
- **No FDA/FBI PD photo of the tainted Tylenol capsules.** FDA's Flickr only has 2010 Tylenol recall shots. The famous
  capsule/bottle photos are AP or Chicago Tribune. The drawn capsule in the hand covers the beat.
- **No legible 1982 "candy sales fall" clipping.** The OCR scan of seven Google News Archive papers (Oct 26–Nov 1, 1982)
  found none; the CSM 1983 article is text only.
- **Vineland's own paper** (*The Daily Journal*, Vineland) isn't in any free archive found. The AP story above names
  Vineland, which is enough for "some towns".

## Rights notes on each fair-use item

- **The Hour, Oct 28, 1982 (AP story) / Nov 1, 1982.** Copyright The Hour Publishing Co. (story © Associated Press);
  a 1982 work for hire is protected for 95 years from publication (to about 2077), and no renewal is needed. Viewable free on
  Google News Archive by permission of the publisher, which gives no reuse licence. Fair-use case: a few seconds, a
  crop of the headline and a few lines, B&W, under narration that comments on the 1982 panic, credited on screen.
  It's used as evidence of what papers said, not as decoration, and doesn't replace the article in any market.
  Moderate risk: AP enforces its photos, so keep the AP pumpkin photo out and use only the text crop.
- **The Free Lance-Star, Oct 27, 1982.** Same analysis. Copyright The Free Lance-Star Publishing Co. (now owned by
  Lee Enterprises). Staff-written local story, so no wire rights holder. Use the headline and masthead crop briefly
  with commentary.
- **TDCJ death-row sheet and 1975 mugshot.** A Texas state agency record, **not** a U.S. federal work, so § 105 doesn't
  apply. Texas has no statute putting its records in the public domain, and the page carries no licence. In practice
  the mugshot is a record of a public trial and execution, published by the state for public information, used here
  to identify the subject of a news-history segment. That's a strong fair-use position, and Wikipedia uses it the same
  way. Credit "Texas Department of Criminal Justice". Low risk.
- **Houston Chronicle courtroom photo (Commons).** A PD claim on no-notice grounds, unverified (see above). If the
  newspaper page turns out to carry a notice, it's a *Houston Chronicle* staff photo under copyright, and the use is
  fair use only (higher risk than the TDCJ mugshot: a news photo is the kind of thing its owner licenses). Prefer the
  TDCJ image.
- **Hearing testimony (in `gov/`).** Grafman was a private witness, but the hearing record is a GPO publication.
  Congressional hearing transcripts are treated as public domain; his prepared statement is reproduced in the same
  volume. Low risk.
