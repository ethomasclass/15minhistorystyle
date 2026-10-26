# Candy Scare: open-licence images

These are open-licence and public-domain finds for the Short, mapped to the beats in **Visual plan (draft 3)** in `SCRIPT.md`.
Every file is recorded in `public/img/credits.json`. Contact sheet (B&W preview): `out/sheet_open.jpg`.

Sources: Wikimedia Commons, downloaded with `find_images.py get commons:…` and `commons.py get` (same licence test). LOC, Met,
AIC, CMA and IA had nothing usable for this topic. LOC's Halloween photos are mostly Look magazine or Shawn Walker material
marked "publication may be restricted". The two Flickr Pixy Stix photos are not on Commons. I found them through Openverse,
checked the CC licence on each Flickr page and fetched the originals with curl. Their credits are hand-added in the tool's
format, with `source: flickr:<id>`.

Notes on size:
- The tool caps Commons downloads at 1920 px wide, so files with bigger originals are 1920 wide here.
- Wikimedia started returning 429 (rate limit) partway through. Five files came down at the next standard thumbnail size
  below their original instead. They are marked "(orig …)" in the tables, and the full-size file can be pulled later with
  the same tool once the limit clears.

"Cut-out" means one clear subject on a background that's easy to separate, suited to the notebook `Cut`. "Card" means it
works better as a cream desk card (`Desk`).

## candy/

| File | Shows | Source id | Licence | Size (w x h) | Use | Cut-out? |
|---|---|---|---|---|---|---|
| pixy_stix_bundle.jpg | A bundle of real, branded Pixy Stix standing in a clear holder | flickr:3895902958 (TheDeliciousLife) | CC BY 2.0 | 1600x1200 | 0:16 door 2, the Pixy Stix drops into the bags; 0:19 Loupe on a stick top. **Best Pixy Stix pick** | yes (crop to 1–3 sticks) |
| pixy_stix_giant.jpg | Two long (giant-size) Pixy Stix straws crossed in a shot glass | flickr:4470595592 (Vironevaeh) | CC BY-SA 2.0 | 3028x4540 | 0:00/0:10 reference for the coral giant stick in the hand; alt for the 0:16 drop | yes (straws; the glass can be masked out) |
| pixy_stix_lamp.jpg | A pendant lamp shade packed with Pixy Stix | commons:File:Pixy Stix.jpg | CC BY 2.0 | 1125x1500 | Fallback only; reads as a lamp, not candy | no |
| powder_straw_candy.jpg | Pile of plain powder-filled straw candies (generic Pixy Stix look, no branding) | commons:File:Straw candy.jpg | CC0 | 1920x1440 | Alt for 0:16 if branding should be avoided; a single straw cuts out cleanly | yes |
| pumpkin_pail_full.jpg | Plastic jack-o'-lantern pail full of wrapped candy | commons:File:Halloween candy bucket.jpg | CC0 | 1600x1200 | 0:16 door 2 bags (a real pail beside the drawn bags); 0:41 X-ray (candy bag subject) | yes |
| jackolantern_bowl_candy.jpg | Jack-o'-lantern bowl heaped with candy bars, on a table outdoors | commons:File:Costumes and Candy Fill Misawa Air Base (9393626).jpg | Public domain (USAF) | 1920x1278 | 0:16 alt / 0:43 counter backdrop | yes (bowl) |
| candy_bowl_bars.jpg | Bowl of mixed candy bars with a "Please help yourself" sign | commons:File:Halloween candies.jpg | CC BY-SA 4.0 | 1920x3413 | 0:41–0:43 "just candy inside"; vertical card | card |
| candy_corn_loose.jpg | Loose candy corn on black | commons:File:Candy corn strewn on a black background.jpg | CC BY 2.0 | 1920x1271 | Texture or loose candy fill for the X-ray bag | card / texture |
| hand_in_candy_bowl.jpg | Rubber hand reaching up out of a bowl of wrapped candy | commons:File:Trickortreathand.jpg | Public domain (PD-self) | 960x1440 (orig 1024x1536) | Hand motif: 0:13 "whose hand was it?" or 0:51 | yes |
| hershey_bar.jpg | Unwrapped Hershey bar, isolated on white | commons:File:Hershey-bar-open.JPG | Public domain (Evan-Amos) | 1920x901 | Candy-bar cut-out for the bags or the X-ray | yes |
| snickers_bar.jpg | Snickers bar broken in two, on white | commons:File:Snickers-broken.JPG | Public domain (Evan-Amos) | 1920x755 | Same | yes |
| mounds_bar.jpg | Mounds bar broken, on white | commons:File:Candy-Mounds-Broken.jpg | Public domain (Evan-Amos) | 1920x942 | Alt | yes |
| apple_red.jpg | Single apple on white (small in frame) | commons:File:Apple With White Background.jpg | CC BY-SA 4.0 | 1920x1280 | Apple (the razor-blade-in-apple myth) for 0:43 "hoax/pin" tags | yes |
| apple_red_alt.jpg | Big close apple on white, studio light | commons:File:Red Apple.jpg | CC BY 2.0 | 1920x1741 | Better apple cut-out | yes |

## halloween/

| File | Shows | Source id | Licence | Size (w x h) | Use | Cut-out? |
|---|---|---|---|---|---|---|
| skeleton_kid_porch_1979.jpg | Child in a skeleton costume with a treat bag, coming down porch steps by a front door (1979) | commons:File:Trick or Treater.jpg | CC BY-SA 2.5 | 981x974 | Period trick-or-treater, any door beat (0:16, 0:51). **Best 1970s kid**, though under 1500 px | yes |
| trick_or_treat_door_1969.jpg | NBC 1969 press still: skeleton and witch kids at an open front door, a man handing out treats | commons:File:Charles Nelson Reilly, Harlen Carraher, and Kellie Flanagan - The Ghost & Mrs. Muir.jpg | Public domain (no notice) | 719x949 | Best "kids at the door" composition (0:00/0:51 reference). Low-res; the adult is actor Charles Nelson Reilly | yes (kids) |
| kid_costume_bag_1967.jpg | Small child in a leopard costume holding a trick-or-treat bag (1967 snapshot) | commons:File:Halloween 1967 Alaska.jpg | CC BY 2.0 | 1920x1921 | Period kid with bag, 0:16 or 0:51 | yes |
| kid_pumpkin_pail_1982.jpg | Child in costume holding a plastic pumpkin pail (Oct 1982) | commons:File:Halloween 1982 - Kooky.jpg | CC BY-SA 2.0 | 1018x1033 | 0:34 "1982, Halloween cancelled" beside the clipping | yes |
| kids_costumes_1984.jpg | Two kids (wizard, cowgirl) in costume, 1984 | commons:File:Terre Haute Indiana Halloween 1984.jpg | CC BY 2.0 | 1047x1584 | 1980s alt | yes |
| kids_costumes_1964.jpg | Group of costumed kids on a driveway, 1964 | commons:File:Halloween 1964 in Illinois.jpg | CC BY 2.0 | 1656x1641 | Card; "kids in the neighbourhood" | card |
| kids_costumes_1957.jpg | Three costumed kids by houses and power lines, 1957 | commons:File:Halloween 1957 in Toledo, Ohio USA.jpg | CC BY 2.0 | 1748x1160 | Card | card |
| masked_kids_door_1930s.jpg | Danish kids in masks outside a doorway, 1930s, B&W | commons:File:Boern rasleboesse 193x kgl bib billedsamling.jpg | Public domain | 1280x811 (orig 1602x1015) | Card for the "old custom" mood; not American | card |
| beaumont_1950_news_photo.png | 1950 newspaper photo: skeleton kid at a door, woman answering, with caption | commons:File:Trick or Treating - Beaumont, California (1950).png | Public domain | 960x1325 (orig 1136x1568) | Desk card (clipping look) | card |
| witch_costume_1977.jpg | Woman in a witch costume riding a broom on a lawn (NASA Glenn, 1977), B&W | commons:File:Halloween at NASA's Glenn Research Center, Cleveland, Ohio, 1977.jpg | Public domain (NASA) | 1920x2097 | 1970s Halloween cut-out; spare | yes |
| trick_or_treat_front_door.jpg | Costumed child at an open front door getting candy (Navy base, Japan) | commons:File:CFAY Hosts Trick-or-Treating (8729573).jpg | Public domain (US Navy) | 1920x1440 | Modern alt for the door beat | card |
| trick_or_treat_porch.jpg | Kids at a lit porch with a pumpkin, at night | commons:File:Trick or Treat New Orleans 2012.jpg | CC BY 2.0 | 1920x1440 | Night porch card | card |
| porch_light.png | Glowing porch light on a stucco wall, dark | commons:File:Porch Light.png | CC0 | 1920x2880 | 0:02 porch-light flicker. **Best pick** | yes |
| jackolantern_candle.jpg | Lit jack-o'-lantern in the dark | commons:File:Jackolantern with candle 01.jpg | CC BY 4.0 | 1920x2076 | Spare night accent | yes |
| jackolanterns_step_night.jpg | Lit jack-o'-lanterns on front steps by a door, dusk | commons:File:Halloween Step (11767159863).jpg | CC BY-SA 2.0 | 1920x2560 | Jack-o'-lantern on a step (door beat dressing) | card |
| jackolantern_front_door.jpg | Carved pumpkin by a front door, child in the doorway (daytime) | commons:File:Halloween-Jack-O-Lantern-551.jpg | CC BY-SA 3.0 | 1280x960 | Alt | yes (pumpkin) |

## 1982/

| File | Shows | Source id | Licence | Size (w x h) | Use | Cut-out? |
|---|---|---|---|---|---|---|
| burke_tylenol_bottle_1982.jpg | J&J chairman James E. Burke holding a Tylenol bottle, 1982 wirephoto, B&W | commons:File:James E. Burke holding Tylenol bottle in 1982.jpg | Public domain (no notice; rationale on the file page) | 1280x1593 (orig 1646x2048) | 0:28–0:31 the Tylenol beat. **Only real 1982 photo found**. Executive, not a politician | yes |
| capsule_open_two_piece.jpg | A two-piece capsule pulled apart, beside whole capsules | commons:File:Arzneimittelkapsel01.jpg | CC BY-SA 2.0 de | 1280x730 (orig 1824x1040) | 0:28 "the capsule": shows how they were opened and refilled. **Best capsule pick** | yes |
| hand_two_capsules.jpg | Open palm holding two capsules | commons:File:A person having two capsules at home.jpg | CC BY-SA 4.0 | 1920x1440 | Photo reference for the 0:28 match cut (hand holds a capsule) | yes |
| tylenol_gelcaps.jpg | Tylenol gelcaps spilling from a bottle, "TY" printed on them | commons:File:Tylenol rapid release pills.jpg | CC BY-SA 2.0 | 1280x960 | Capsule-shaped Tylenol (modern) | yes |
| tylenol_caplets.jpg | Tylenol caplets (modern) | commons:File:Tylenol Pills (15213405761).jpg | CC BY 2.0 | 1920x1440 | Alt | yes |
| tylenol_bottle.jpg | Extra Strength Tylenol bottle (modern label) | commons:File:Tylenol bottle closeup (loose crop).jpg | CC BY-SA 2.0 | 1920x1815 | Bottle cut-out | yes |
| tylenol_bottles_spilled.jpg | Two Tylenol bottles with pills spilled, on black | commons:File:Extra Strength Tylenol and Tylenol PM.jpg | CC BY-SA 4.0 | 1920x2401 | Alt | yes |
| tylenol_ad_1975.jpg | 1975 newspaper ad: "Tylenol Bottle of 100 $1.09" | commons:File:1975 Osco Tylenol ad.jpg | Public domain (no notice) | 1112x1123 | Period Tylenol desk card | card |
| capsules_spilling_bottle.jpg | Capsules spilling from an amber bottle (generic) | commons:File:Capsules Spilling from Bottle (34356373370).jpg | CC BY 2.0 | 1920x2090 | Generic pill-bottle cut-out | yes |
| tamper_seal_alt.jpg | Jar with a pull-tab tamper-evident seal | commons:File:Tamper evident seal on OTC pharmaceutical.jpg | CC BY-SA 4.0 | 1920x1440 | The legacy of 1982 (tamper seals), if needed | yes |
| tamper_seal.jpg | Eye-drop bottle with a tamper ring (weak) | commons:File:Tamper seal pharma.jpg | CC BY-SA 4.0 | 1920x2463 | Spare | yes |

## xray/

| File | Shows | Source id | Licence | Size (w x h) | Use | Cut-out? |
|---|---|---|---|---|---|---|
| xray_hand_schuster_1896.jpg | Early X-ray of a hand with a ring, crisp, white bones on dark | commons:File:Hand with ring by Arthur Schuster.jpg | CC BY 4.0 | 1920x2656 | 0:41 X-ray look reference, or a payoff for the hand motif (the hand, X-rayed). **Best X-ray pick** | yes |
| xray_hand_ring_1895.jpg | Röntgen's 1895 X-ray of a hand with a ring, on its mount | commons:File:X-ray of the bones of a hand with a ring on one finger Wellcome V0029523.jpg | Public domain | 1920x2750 | Alt, more "antique" | card |
| xray_skeleton_negative.jpg | Toy skeleton photographed as an X-ray-style negative | commons:File:X-ray negative - Flickr - theilr.jpg | CC BY-SA 2.0 | 1920x1332 | Halloween-flavoured X-ray texture | card |
| xray_reading_1975.jpg | Belize City Hospital X-ray reading room, 1975 (man at desk) | commons:File:Belize City Hospital X Ray Reading 1975.jpg | CC BY-SA 4.0 | 960x814 (orig 1180x1000) | Weak; spare | no |

## street/

| File | Shows | Source id | Licence | Size (w x h) | Use | Cut-out? |
|---|---|---|---|---|---|---|
| suburb_street_belair_1.jpg | Two-storey suburban house with cars at the curb, street in front (Levitt "Belair at Bowie", HABS B&W) | commons:File:General view, 12401 Sussex Lane, Belair at Bowie, Maryland, looking southwest. - … HABS MD-1267-1.tif | Public domain (HABS) | 1920x1391 | Reference for the CSS street; desk card. **Best street pick** | card |
| ranch_house_belair.jpg | Brick ranch house with a car in the drive, curb in front (HABS B&W) | commons:File:General view, 12405 Sussex Lane, … HABS MD-1269-1.tif | Public domain (HABS) | 1920x1390 | Closest to a 1970s Texas ranch house | card |
| suburb_house_belair_2.jpg | Cape/ranch house, lawn and drive (HABS B&W) | commons:File:General view, 12406 Skylark Lane, … HABS MD-1271-1.tif | Public domain (HABS) | 1920x1399 | Alt | card |
| house_halloween_1970s_documerica.jpg | Small 1970s house decorated for Halloween, New Ulm, Minnesota (DOCUMERICA, October) | commons:File:THE TOWN OF NEW ULM, MINNESOTA, … - NARA - 558158.jpg | Public domain (EPA DOCUMERICA) | 1920x1303 | A real 1970s house with Halloween decorations; desk card for 0:16 or 0:51 | card |

## Best pick per beat

| Beat | Pick |
|---|---|
| 0:00 / 0:10 hand + giant Pixy Stix | `candy/pixy_stix_giant.jpg` (stick shape reference) and `candy/pixy_stix_bundle.jpg` (real sticks) |
| 0:02 porch-light flicker | `halloween/porch_light.png` |
| 0:13 "whose hand?" | `candy/hand_in_candy_bowl.jpg` (optional) |
| 0:16 door 2, Pixy Stix into bags | `candy/pixy_stix_bundle.jpg` (crop 1 stick); `candy/pumpkin_pail_full.jpg`; kid `halloween/skeleton_kid_porch_1979.jpg` |
| 0:19 Loupe on the stick top | `candy/pixy_stix_bundle.jpg` (crimped ends visible); alt `candy/powder_straw_candy.jpg` |
| 0:28 capsule match cut | `1982/capsule_open_two_piece.jpg`; hand reference `1982/hand_two_capsules.jpg` |
| 0:31–0:34 Chicago 1982 | `1982/burke_tylenol_bottle_1982.jpg`; `halloween/kid_pumpkin_pail_1982.jpg` beside the clipping |
| 0:41 X-ray | `xray/xray_hand_schuster_1896.jpg` (look reference); bag contents `candy/pumpkin_pail_full.jpg` and the bar cut-outs |
| 0:43 counter tags ("hoax", "pin") | `candy/apple_red_alt.jpg` |
| 0:51 street, porch to porch | `street/suburb_street_belair_1.jpg`, `street/house_halloween_1970s_documerica.jpg` (references for the drawn street) |

## Gaps (not found on open-licence archives)

- **A real X-ray of candy or a Halloween bag.** None on Commons, LOC or Openverse. DVIDS has photos of base hospitals
  X-raying candy, but not on Commons under any search I tried, and DVIDS needs an API key. The plan already draws the X-ray,
  so the hand X-ray can stand in as a look reference.
- **An X-ray light box or 1970s X-ray machine** at good size. Only the low-res Belize 1975 room photo turned up.
- **A Pixy Stix photo on Commons that is actually candy.** The only one, `File:Pixy Stix.jpg`, is a lamp. The good ones are
  Flickr CC (BY and BY-SA), fetched by curl and credited by hand.
- **A high-res 1960s–80s trick-or-treater at a front door.** The best two are under 1000 px: the 1969 NBC still and the 1979
  skeleton kid. Florida Memory has 1967–1972 costume photos on Commons, but only at 600 px. DOCUMERICA has no trick-or-treat
  photos.
- **A 1970s Texas or Houston suburban street.** None found. The HABS Belair-at-Bowie (Maryland) ranch-house set is the
  closest look.
- **1982 Tylenol murders material beyond Burke.** I skipped two things. "Roger Arnold leaves Chicago court" (PD, 1982) shows
  a man who was questioned and cleared in the Tylenol case. `TylenolKillerSuspect.png` (CC0 claim) is a store surveillance
  still of an unidentified man. Both name or show a real person tied to the murders without his conviction, so they are
  risky. No FDA history photo of the 1982 seals is on Commons.
- **Avoided on purpose:** White House Halloween photos (the Kennedys, the Fords and UNICEF, the Carters, Reagan, the
  Bidens, George W. Bush) and the 2012 Milton photo (a governor's-office photo of a politician handing out candy), because the brief rules out presidents and
  politicians.
