# Arsenic Green: archival image candidates

Researched 2026-10-14. Nothing has been downloaded. ★ marks the best pick for each beat.

**How to read the tables**
- **Px** is the full-resolution pixel size where the API reported it.
- **Licence**: PD = public domain; PDM = Public Domain Mark; CC0; CC BY 4.0 (credit needed); NKR = LOC "No known restrictions on publication"; Etalab = French *Licence Ouverte* (commercial reuse allowed with attribution, equivalent to CC BY).
- **Credits**: the template's `credits.json` stores `title / artist / date / licence / page`. Every row below has those fields.
  - `tools/find_images.py get` handles `commons:`, `loc:`, `met:`, `cma:`, `ia:` and `iabook:` sources.
  - Wellcome, NLM and Rijksmuseum items are best fetched through their Wikimedia Commons copies (where one is listed), or downloaded by hand with a manual credit entry.
- **Wellcome full-size file pattern**: `https://iiif.wellcomecollection.org/image/<ID>/full/max/default.jpg`.
- **LOC items**: the TIFF master is linked from each item page. The "v.jpg" links given below are LOC's large JPEGs.
- **Tool bug**: The Met retired `/public/collection/v1/search` on 2026-10-01, and `find_images.py` (`s_met`) still calls it. Met *search* through the tool will come back empty until it is switched to `/v1.1/search`. `get met:<id>` still works, because the object endpoint is unchanged.

---

## 1. Carl Wilhelm Scheele

> **Caveat for the script:** no securely authenticated life portrait of Scheele exists. Every likeness is either posthumous or of a disputed sitter. On screen, tag it "later engraving" rather than "portrait from life".

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | Carl Wilhelm Scheele (engraving) | 1780/1800 | Johann Gottfried Scheffner | via portraitindex.de / Commons | [Commons](https://commons.wikimedia.org/wiki/File:Carl_Wilhelm_Scheele_by_Johann_Gottfried_Scheffner.png) | [png](https://upload.wikimedia.org/wikipedia/commons/1/18/Carl_Wilhelm_Scheele_by_Johann_Gottfried_Scheffner.png) | 2700×3201 | PDM | Best engraving and highest resolution. Strong single face, good for masking. |
|   | Carl Wilhelm Scheele (Popular Science Monthly) | 1887 | unknown engraver | Commons (PSM vol. 31) | [Commons](https://commons.wikimedia.org/wiki/File:PSM_V31_D740_Carl_Wilhelm_Scheele.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/4/4d/PSM_V31_D740_Carl_Wilhelm_Scheele.jpg) | 1665×2184 | PD | Clean line engraving. Good backup. |
|   | Medal commemorating Scheele | 1789 | I. G. Wikman | Science Museum Group | [Commons](https://commons.wikimedia.org/wiki/File:Medal_commemorating_Carl_Wilhelm_Scheele_by_I_G_Wikman,_1789_(obverse).jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/3/3c/Medal_commemorating_Carl_Wilhelm_Scheele_by_I_G_Wikman%2C_1789_%28obverse%29.jpg) | 1536×1530 | CC BY 4.0 | Profile medal, close to his lifetime. Good as an object insert. |
|   | Carl Wilhelm Scheele (Familj-Journalen) | 1874 | unknown | Commons | [Commons](https://commons.wikimedia.org/wiki/File:Carl_Wilhelm_Scheele_from_Familj-Journalen1874.png) | [png](https://upload.wikimedia.org/wikipedia/commons/1/16/Carl_Wilhelm_Scheele_from_Familj-Journalen1874.png) | 588×692 | PD | Too small except for a corner inset. |
|   | Carl Wilhelm Scheele (oil) | c. 1775 | unidentified painter | Commons | [Commons](https://commons.wikimedia.org/wiki/File:Carl_Wilhelm_Scheele.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/6/60/Carl_Wilhelm_Scheele.jpg) | 602×816 | PD | Sitter disputed. Low resolution. |

---

## 2. Victorian green fashion

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | Dress (green silk, American) C.I.53.72.1a–c | 1868 | unknown | The Met | [Met 107839](https://www.metmuseum.org/art/collection/search/107839) | [jpg](https://images.metmuseum.org/CRDImages/ci/original/C.I.53.72.1a–c_F.jpg) | (Met original, large) | CC0 | The dress usually cited as "likely arsenic green". The Met itself does not record the dye, so say "probably". It has 8 extra views. Thumbnail candidate. |
| ★ | Journal des Demoiselles, août 1863 (two women in crinolines and a child) | 1863 | Rijksmuseum print | Rijksmuseum | [Commons](https://commons.wikimedia.org/wiki/File:Journal_des_Demoiselles,_ao%C3%BBt_1863,_31e_ann%C3%A9e,_No._8,_RP-P-2009-3475.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/f/f5/Journal_des_Demoiselles%2C_ao%C3%BBt_1863%2C_31e_ann%C3%A9e%2C_No._8%2C_RP-P-2009-3475.jpg) | 3966×5718 | CC0 | Hand-coloured 1860s fashion plate. Shows in B&W, so tint one gown coral. |
|   | Gazette of Fashion, riding habits, April 1862 | 1862 | — | Rijksmuseum | [Commons](https://commons.wikimedia.org/wiki/File:Gazette_of_Fashion,_New_designs_for_riding_habits,_April_1862,_RP-P-2009-2668.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/8/84/Gazette_of_Fashion%2C_New_designs_for_riding_habits%2C_April_1862%2C_RP-P-2009-2668.jpg) | 4020×5464 | CC0 | London fashion plate from 1862, the year of the Arsenic Waltz. |
|   | Fashion plate, 1862 | 1862 | Adèle-Anaïs Toudouze | Commons | [Commons](https://commons.wikimedia.org/wiki/File:Ad%C3%A8le-Ana%C3%AFs_Toudouze_-_3474.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/6/6d/Ad%C3%A8le-Ana%C3%AFs_Toudouze_-_3474.jpg) | 3482×5222 | PD | Leading Paris fashion-plate artist. |
|   | Modes parisiennes (caricature of fashion), 1862 | 1862 | Cham (lithographer) | Paris Musées | [Commons](https://commons.wikimedia.org/wiki/File:Modes_parisiennes,_G.21965(36)_(2_of_2).jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/9/91/Modes_parisiennes%2C_G.21965%2836%29_%282_of_2%29.jpg) | 4588×5954 | CC0 | Satire of 1862 fashion. Witty cutaway. |
|   | Fashion Study: Woman in a Green Dress | 19th c. | anon. French | The Met | [Met 384449](https://www.metmuseum.org/art/collection/search/384449) | [jpg](https://images.metmuseum.org/CRDImages/dp/original/DP809411.jpg) | large | CC0 | Explicitly a *green* dress, a single figure. Easy coral mask. |
|   | [Young Lady in White Dress with Green Sash] | c. 1857 | unknown | The Met | [Met 269145](https://www.metmuseum.org/art/collection/search/269145) | [jpg](https://images.metmuseum.org/CRDImages/ph/original/DP116203.jpg) | large | CC0 | Real hand-tinted photograph: a real face plus green. Thumbnail candidate. |
|   | Wedding headdress (artificial flowers) | 1863 | — | The Met | [Met 123429](https://www.metmuseum.org/art/collection/search/123429) | [jpg](https://images.metmuseum.org/CRDImages/ci/original/C.I.46.68.2_F.jpg) | large | CC0 | Headdress of artificial flowers, probably wax rather than green leaves. A stand-in for a "flower wreath" shot. |

Not usable (rights):
- **Bata Shoe Museum** green "Adelaide" boots, c. 1840s (arsenic confirmed): photo © Ron Wood / Bata Shoe Museum.
- **Toronto Metropolitan University** arsenic-tested dress, 1860s: museum photo.
- **V&A** green artificial-flower wreaths: V&A terms are non-commercial only.

All of these need permission.

---

## 3. Punch cartoons

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | "The Arsenic Waltz. The new Dance of Death (Dedicated to the Green Wreath and Dress-Mongers)" | Punch, 8 Feb 1862 | Punch | Wellcome V0042226 | [Wellcome](https://wellcomecollection.org/works/awbr7whm) | [IIIF max](https://iiif.wellcomecollection.org/image/V0042226/full/max/default.jpg) | 2974×2358 | PDM (Wellcome); CC BY 4.0 on Commons | **Top thumbnail pick**: two dancing skeletons, instantly readable. |
|   | same, cropped and cleaned | 1862 | — | Commons | [Commons](https://commons.wikimedia.org/wiki/File:Two_skeletons_dressed_as_lady_and_gentleman._Etching,_1862._Wellcome_V0042226_(crop_and_cleaned_up).png) | [png](https://upload.wikimedia.org/wikipedia/commons/6/64/Two_skeletons_dressed_as_lady_and_gentleman._Etching%2C_1862._Wellcome_V0042226_%28crop_and_cleaned_up%29.png) | 2962×2209 | CC BY 4.0 | Cleaner background for masking the skeleton lady. |
| ★ | "The Great Lozenge-Maker. A Hint to Paterfamilias" (Death making sweets with arsenic) | Punch, 20 Nov 1858 | John Leech | Commons / Wellcome L0078890 | [Commons](https://commons.wikimedia.org/wiki/File:The_Great_Lozenge-Maker;_Punch_cartoon.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/6/65/The_Great_Lozenge-Maker%3B_Punch_cartoon.jpg) | 3951×5505 | PD | Covers the **sweets** beat (Bradford poisoning, 1858). Wellcome copy is 5255×6985: [Wellcome](https://wellcomecollection.org/works/mj8x9hdn). Thumbnail candidate. |
|   | "Broken Hoops" | Punch, 8 Nov 1862 | Punch | Commons | [Commons](https://commons.wikimedia.org/wiki/File:Broken_Hoops._Punch,_8_November_1862.png) | [png](https://upload.wikimedia.org/wikipedia/commons/e/e6/Broken_Hoops._Punch%2C_8_November_1862.png) | 960×713 | PD | Crinoline satire from the same year. Context only, low resolution. |
|   | Maid and mistress in crinoline, Punch Almanack 1862 | 1862 | Punch | Commons | [Commons](https://commons.wikimedia.org/wiki/File:Maid_and_mistress_in_crinoline._Punch_Almanack_for_1862-2.png) | [png](https://upload.wikimedia.org/wikipedia/commons/5/57/Maid_and_mistress_in_crinoline._Punch_Almanack_for_1862-2.png) | 993×683 | PD | Context only. |
|   | "An unscrupulous chemist selling a child arsenic and laudanum" | c. 1849 | after John Leech (Punch) | Wellcome V0011589 | [Wellcome](https://wellcomecollection.org/works/hcw9dhst) | [IIIF](https://iiif.wellcomecollection.org/image/V0011589/full/max/default.jpg) | 2300×3098 | PDM | Shows how easily arsenic could be bought. Optional. |

No Punch cartoon specifically about arsenical *wallpaper* turned up. See Gaps.

---

## 4. Arsenical wallpapers

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | *Shadows from the Walls of Death* (sample page) | 1874 | Robert C. Kedzie | NLM via Commons | [Commons](https://commons.wikimedia.org/wiki/File:Shadows_from_the_walls_of_death_page.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/2/23/Shadows_from_the_walls_of_death_page.jpg) | 5544×7194 | PD | Real arsenical sample. Superb resolution. Thumbnail candidate (pattern plus title). |
| ★ | *Shadows from the Walls of Death* (title page) | 1874 | Kedzie | NLM via Commons | [Commons](https://commons.wikimedia.org/wiki/File:Shadows_from_the_Walls_of_Death_title_page.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/8/8e/Shadows_from_the_Walls_of_Death_title_page.jpg) | 2794×2695 | PD | Title card. |
|   | *Shadows from the Walls of Death*, full book (86 leaves of samples) | 1874 | Kedzie | NLM, ID 0234555 | [NLM](https://collections.nlm.nih.gov/catalog/nlm:nlmuid-0234555-bk) | PDF on the NLM page; IA mirror `0234555.nlm.nih.gov` | — | PD ("NLM believes this item to be in the public domain") | Pick 3–4 more green samples with `find_images.py pages 0234555.nlm.nih.gov`. |
| ★ | Trellis wallpaper (William Morris's first design) | designed 1862, produced 1864 | William Morris & Philip Webb | The Met 384020 | [Met](https://www.metmuseum.org/art/collection/search/384020) | [jpg](https://images.metmuseum.org/CRDImages/dp/original/DP306738.jpg) | 3069×3857 | CC0 | Second Met photo: [DT255077](https://upload.wikimedia.org/wikipedia/commons/7/7b/Trellis_MET_DT255077.jpg) (3239×4000). |
|   | Morris's own design drawing for Trellis | 1862 | William Morris | Commons | [Commons](https://commons.wikimedia.org/wiki/File:William_Morris_design_for_Trellis_wallpaper_1862.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/b/b4/William_Morris_design_for_Trellis_wallpaper_1862.jpg) | 1131×1184 | PD | Hand-drawn design. Nice in a "Morris at his desk" scene. |
|   | Daisy wallpaper | 1864 | William Morris | The Met 384017 | [Met](https://www.metmuseum.org/art/collection/search/384017) | [jpg](https://images.metmuseum.org/CRDImages/dp/original/DP306732.jpg) | large | CC0 | |
|   | Fruit (or Pomegranate) wallpaper | c. 1866 | William Morris | The Met 365338 | [Met](https://www.metmuseum.org/art/collection/search/365338) | [jpg](https://images.metmuseum.org/CRDImages/dp/original/DP109416.jpg) | large | CC0 | Also at the Met: Willow 1874 (398344), Larkspur 1875 (384021), Marigold 1875 (384018). |
| ★ | Sidewall and border, faded to the green flowers only ("green may contain arsenic") | 1836 | unknown, USA | Cooper Hewitt (CH 18620703) | [Commons](https://commons.wikimedia.org/wiki/File:Sidewall_And_Border_(USA),_1836_(CH_18620703).jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/a/a0/Sidewall_And_Border_%28USA%29%2C_1836_%28CH_18620703%29.jpg) | 3000×2580 | PD | The museum's own record flags arsenic. The faded paper makes the point visually. |
|   | Sidewall, green blossoms ("green may contain arsenic") | 1840s | unknown, USA | Cooper Hewitt 1956-171-9 (CH 18407709) | [Commons](https://commons.wikimedia.org/wiki/File:Sidewall_(USA),_1840s_(CH_18407709)-2.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/8/81/Sidewall_%28USA%29%2C_1840s_%28CH_18407709-2%29.jpg) | 4096×3298 | PD | Featured in Cooper Hewitt's "Toxic Beauty" post. |
|   | Sidewall, ivy in five greens | 1840s | Arthur Sanderson & Sons | Cooper Hewitt (CH 18401227) | [Commons](https://commons.wikimedia.org/wiki/File:Sidewall_(England),_1840s_(CH_18401227).jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/4/4c/Sidewall_%28England%29%2C_1840s_%28CH_18401227%29.jpg) | 4096×2727 | PD | British green paper of the period. |
|   | Page from Morris & Co. sample book | 1887 | Jeffrey & Co. for Morris & Co. | Cooper Hewitt (CH 102200443) | [Commons](https://commons.wikimedia.org/wiki/File:Page_From_Sample_Book,_Morris_and_Co.,_1887_(CH_102200443).jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/8/84/Page_From_Sample_Book%2C_Morris_and_Co.%2C_1887_%28CH_102200443%29.jpg) | 2256×3000 | PD | |

---

## 5. Victorian parlour and nursery interiors

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | Parlor interior (stereograph) | 1870s | Joseph W. Warren | LOC 2017650477 | [LOC](https://www.loc.gov/pictures/item/2017650477/) | [v.jpg](https://cdn.loc.gov/service/pnp/stereo/1s00000/1s08000/1s08500/1s08560v.jpg) | TIFF on page | NKR | Real patterned-paper parlour. Crop one half of the stereo pair. |
|   | [Sitting room] (stereograph) | 1875 | Woodward & Son | LOC 2017650480 | [LOC](https://www.loc.gov/pictures/item/2017650480/) | [v.jpg](https://cdn.loc.gov/service/pnp/stereo/1s00000/1s08000/1s08500/1s08563v.jpg) | TIFF on page | NKR | |
|   | "Green Room in President's mansion" (stereograph) | 1870–99 | J. F. Jarvis | LOC 2016653024 | [LOC](https://www.loc.gov/pictures/item/2016653024/) | [v.jpg](https://cdn.loc.gov/service/pnp/stereo/1s00000/1s06000/1s06400/1s06463v.jpg) | TIFF on page | NKR | A real "Green Room": a neat line for the script. Also 92511644 and 2017647923. |
|   | Brownstone residence of Richard M. and Catharine H. Hunt, NYC (interior) | c. 1865 | S. Beer | LOC 2024638769 | [LOC](https://www.loc.gov/pictures/item/2024638769/) | [r.jpg](https://tile.loc.gov/storage-services/service/pnp/ppmsca/74900/74923r.jpg) | TIFF on page | check page | 1860s American interior. Confirm the rights line before use. |
|   | Paper Doll Nursery | 1883 | anon. German | The Met 916267 | [Met](https://www.metmuseum.org/art/collection/search/916267) | [jpg](https://images.metmuseum.org/CRDImages/dp/original/DP-37999-001.jpg) | large | CC0 | A printed toy nursery. Covers both the **nursery** and **toys** beats. |
|   | Drawing Room at Hatton, Warwickshire | 1820–30 | granddaughters of Dr Samuel Parr | The Met 386400 | [Met](https://www.metmuseum.org/art/collection/search/386400) | [jpg](https://images.metmuseum.org/CRDImages/dp/original/DP806208.jpg) | large | CC0 | Too early for the craze, but a fine papered room. Use only as a "before" shot. |

---

## 6. Factory workers: flower makers and wallpaper printing

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | Processes of Wallpaper Production (print) | 1882 | unknown | Cooper Hewitt (CH 18406939) | [Commons](https://commons.wikimedia.org/wiki/File:Print,_Processes_of_Wallpaper_Production,_1882_(CH_18406939).jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/9/99/Print%2C_Processes_of_Wallpaper_Production%2C_1882_%28CH_18406939%29.jpg) | 2764×4096 | PD | Vignettes of wallpaper printing. Crop to individual workers. Second scan: CH 18406939-2. |
| ★ | Wall paper manufactory of Janeway & Carpender, New Brunswick, N.J. | 1880–90 | unknown | LOC 98507615 | [LOC](https://www.loc.gov/pictures/item/98507615/) | [v.jpg](https://cdn.loc.gov/service/pnp/pga/03300/03313v.jpg) | TIFF on page | NKR | Bird's-eye factory lithograph. Good establishing shot for the American angle. |
| ★ | Artificial flower makers' workroom (wood engraving) in *Another Blow for Life* | 1864 | George Godwin (ed. of *The Builder*) | Internet Archive `anotherblowforl00godwgoog` | [IA](https://archive.org/details/anotherblowforl00godwgoog) | via `find_images.py pages` | — | PD (pre-1930) | Text "Artificial flower makers: blighting the buds" (contents) and "Flower-making" around leaf n57. Find the plate with a contact sheet. The same engraving survives as Wellcome glass slide [M0012977](https://wellcomecollection.org/works/eb7f3art) (PDM). |
|   | Un atelier de fleuriste (*Le Monde illustré*) | 1903 | Le Monde illustré | Paris Musées (G.36370) | [Commons](https://commons.wikimedia.org/wiki/File:Un_atelier_de_fleuriste._G.36370.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/4/4e/Un_atelier_de_fleuriste._G.36370.jpg) | 4710×3522 | CC0 | Paris flower workshop. Later than the craze, so tag the date. |
|   | "Artificial flower making at 8 cents a gross. Youngest child working is 5 years old." | Jan 1908 | Lewis W. Hine | LOC 2018673615 (NCLC) | [LOC](https://www.loc.gov/pictures/item/2018673615/) | [v.jpg](https://cdn.loc.gov/service/pnp/nclc/04000/04073v.jpg) | TIFF on page | NKR | Real faces. Very strong, but 1908. Use for "the trade went on" or an epilogue. More Hine flower-maker photos: 2018676862, 2018676866, 2018677020. |
|   | Elevation of equipment for staining papers (Encyclopédie plate) | 18th c. | after Diderot & d'Alembert | Wellcome V0023747 | [Wellcome](https://wellcomecollection.org/works/s27cgkyz) | [IIIF](https://iiif.wellcomecollection.org/image/V0023747/full/max/default.jpg) | 2500×2659 | PDM | Pre-arsenic block printing. Usable as a technical diagram. |
|   | Furnace used in processing arsenic (Encyclopédie plate) | 18th c. | after L.-J. Goussier | Wellcome V0023587 / V0023588 | [Wellcome](https://wellcomecollection.org/works/zjdtrnmn) | [IIIF](https://iiif.wellcomecollection.org/image/V0023587/full/max/default.jpg) | 2200×3342 | PDM | Shows where the white arsenic comes from (also fits the Devon Great Consols beat). |

---

## 7. Medical images

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | Vernois, "Mémoire sur les accidents produits par l'emploi des verts arsenicaux chez les ouvriers fleuristes…", with a **chromolithograph plate of the sores on flower-makers' hands, face and genitals** | 1859 | Maxime Vernois | *Annales d'hygiène publique*, 2e sér., t. 12; BIU Santé scan on IA `BIUSante_90141x1859x12` | [IA](https://archive.org/details/BIUSante_90141x1859x12) | the plate follows the "Explication de la planche" on leaf about n347 (memoir runs about n320–n347) | 489 leaves, high resolution | **Etalab Licence Ouverte** (attribution: BIU Santé, Université Paris Cité) | **The** image for this beat. Envhistnow credits a copy to Wellcome under CC BY 4.0. Pages n52–n75 of the same volume cover **arsenical sweets and papers**. Thumbnail candidate (crop the hands). |
| ★ | Vernois, *De la main des ouvriers et des artisans…*, with **4 chromolithograph plates** of workers' hands, including flower-makers' (*fleuristes*) arsenical lesions | 1862 | Maxime Vernois | Wellcome b21082285 | [Wellcome](https://wellcomecollection.org/works/yzuwu39v) | IIIF per page: `https://iiif.wellcomecollection.org/image/b21082285_0NNN.jp2/full/max/default.jpg`; the plates are among the unpaginated canvases 100–124 | 3130×5164 | PDM | Second copy: [tq768gg7](https://wellcomecollection.org/works/tq768gg7). The text tables list *Fleuristes* on pp. 74–80. Check the plates in the Wellcome viewer before choosing. |
|   | Jabez Hogg, *Arsenical poisoning by wall-papers and other manufactured articles* | 1885 | Jabez Hogg | Wellcome b22276956 | [Wellcome](https://wellcomecollection.org/works/c3mf37f6) | via the IIIF viewer | — | PDM | Title page as a period-document insert. Also Hogg 1879 *Inflammation of the eye… arsenical wall-paper poisoning* ([ae39dkkp](https://wellcomecollection.org/works/ae39dkkp)) and 1889 *Arsenical wall-papers and cretonnes* ([ege7h2hd](https://wellcomecollection.org/works/ege7h2hd)). |
|   | *A report on arsenical poisoning by means of wall-papers, paints, etc.* (Medical Society of London) | 1880 | — | Wellcome b22379046 | [Wellcome](https://wellcomecollection.org/works/dbn8ss9c) | IIIF | — | PDM | Title page. |
|   | Henry Carr, *Our domestic poisons; or, the poisonous effects of certain dyes & colours…* | 1879 / 1883 | Henry Carr | Wellcome scans on IA `b22362964` / `b21523253` | [IA](https://archive.org/details/b22362964) | — | — | PD (pre-1930) | Title page. |
|   | E. C. Seguin, *Myelitis following acute arsenical poisoning (by Paris or Schweinfurth green)* | 1882 | E. C. Seguin | Wellcome | [Wellcome](https://wellcomecollection.org/works/ntxpdurz) | IIIF | — | PDM | Links to the American Paris-green beat. |
|   | F. H. Brown, *Arsenical paper-hangings* | 1876 | Francis H. Brown | NLM scan on IA `9613869.nlm.nih.gov` | [IA](https://archive.org/details/9613869.nlm.nih.gov) | — | — | PD (pre-1930) | Boston (US) angle. |
|   | "A chemist gives a demonstration involving arsenic" | 1841 | Honoré Daumier | Wellcome V0011761 | [Wellcome](https://wellcomecollection.org/works/qjurmfkb) | [IIIF](https://iiif.wellcomecollection.org/image/V0011761/full/max/default.jpg) | 2377×3099 | PDM | For the Marsh-test / "chemists find arsenic" moment. |

---

## 8. William Morris and Devon Great Consols

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | William Morris, age 53 | c. 1887 (pub. 1899) | Frederick Hollyer | Commons | [Commons](https://commons.wikimedia.org/wiki/File:William_Morris_age_53.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/8/8a/William_Morris_age_53.jpg) | 1404×1767 | PD | Classic Hollyer portrait. Strong face, so a thumbnail candidate for a "Morris's secret" angle. |
|   | William Morris (frontispiece, *W. Morris and the early days of the socialist movement*) | photo by Hollyer (pub. 1920) | Frederick Hollyer | Commons | [Commons](https://commons.wikimedia.org/wiki/File:William-morris-and-the-early-days-of-the-socialist-movement_-_William_Morris.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/1/14/William-morris-and-the-early-days-of-the-socialist-movement_-_William_Morris.jpg) | 1251×1587 | PD | |
|   | Edward Burne-Jones and William Morris | 1874 | Frederick Hollyer | Commons | [Commons](https://commons.wikimedia.org/wiki/File:Frederick_Hollyer_Edward_Burne-Jones_and_William_Morris_1874.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/3/34/Frederick_Hollyer_Edward_Burne-Jones_and_William_Morris_1874.jpg) | 1031×1372 | PD | Morris during the Devon Great Consols years (he was a director until 1875). |
|   | Burne-Jones and Morris | c. 1890 | Frederick Hollyer | Commons | [Commons](https://commons.wikimedia.org/wiki/File:Frederick_Hollyer_Burne-Jones_and_Morris_1890.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/5/59/Frederick_Hollyer_Burne-Jones_and_Morris_1890.jpg) | 1329×1640 | PD | |
|   | Devon Great Consols and Tamar valley (panorama) | 2011 | Nilfanion | Commons | [Commons](https://commons.wikimedia.org/wiki/File:Devon_Great_Consols_and_Tamar_valley.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/3/31/Devon_Great_Consols_and_Tamar_valley.jpg) | 12409×2555 | **CC BY-SA 3.0** | Modern photo. Share-alike: credit it and treat with caution. |
|   | Calciners at Devon Great Consols (arsenic roasting ruins) | 2014 | Nilfanion | Commons | [Commons](https://commons.wikimedia.org/wiki/File:Calciners_at_Devon_Great_Consols_(4972).jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/a/a8/Calciners_at_Devon_Great_Consols_%284972%29.jpg) | 4288×2848 | **CC BY-SA 4.0** | The actual arsenic works. Modern photo. More in the same series (4973–5008). |

No period (pre-1900) image of Devon Great Consols was found. See Gaps.

---

## 9. Napoleon on St Helena (secondary)

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | Napoleon's house at Longwood (photo) | 1850–1880 | unknown | Rijksmuseum RP-F-F02293 | [Commons](https://commons.wikimedia.org/wiki/File:Napoleon%27s_huis_in_Longwood,_RP-F-F02293.jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/c/c9/Napoleon%27s_huis_in_Longwood%2C_RP-F-F02293.jpg) | 4954×3662 | CC0 | Real 19th-century photo of the house. |
| ★ | The death of Napoleon Bonaparte at St Helena, 1821 (lithograph after Baron Steuben) | 19th c. | after Charles de Steuben | Wellcome V0006755 | [Wellcome](https://wellcomecollection.org/works/yvn7af65) | [IIIF](https://iiif.wellcomecollection.org/image/V0006755/full/max/default.jpg) | 3212×2575 | PDM | Deathbed scene in the (wallpapered) room. Intaglio version by Jazet, 1830: V0006858. |
|   | The last moments of Napoleon at St Helena (Bovinet and Couché after Gudin) | 19th c. | Bovinet, Couché | Wellcome V0006900 | [Wellcome](https://wellcomecollection.org/works/shq68n7b) | [IIIF](https://iiif.wellcomecollection.org/image/V0006900/full/max/default.jpg) | 3328×2468 | PDM | |
|   | Napoleon on St Helena (sculpture) | c. 1860–70 | Jean-Baptiste Carpeaux | Cleveland Museum of Art 1917.371 | [CMA](https://clevelandart.org/art/1917.371) | [jpg](https://openaccess-cdn.clevelandart.org/1917.371/1917.371_print.jpg) | 3400×3346 | CC0 | Brooding single figure. Easy mask. |
|   | Napoleon Lying Dead at St Helena | 1840 or later | Alexis Joseph Depaulis | The Met 206685 | [Met](https://www.metmuseum.org/art/collection/search/206685) | [jpg](https://images.metmuseum.org/CRDImages/es/original/213755.jpg) | large | CC0 | Medal. |

---

## 10. Paris green: insecticide and the Colorado potato beetle

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | C. V. Riley, *Potato Pests* (beetle plates; Paris-green instructions) | 1876 | Charles V. Riley | Internet Archive `potatopests00rile` | [IA](https://archive.org/details/potatopests00rile) | via `find_images.py pages potatopests00rile` | — | PD | The American Paris-green moment in one book. |
| ★ | Colorado potato beetle: eggs, larva, pupa, adult (figure) | 1877 | A. S. Packard / U.S. Geological Survey report | IA Book Images on Commons | [Commons](https://commons.wikimedia.org/wiki/File:Report_on_the_Rocky_Mountain_locust_and_other_insects_now_injuring_or_likely_to_injure_field_and_garden_crops_in_the_western_states_and_territories_(1877)_(14801465903).jpg) | [jpg](https://upload.wikimedia.org/wikipedia/commons/4/46/Report_on_the_Rocky_Mountain_locust_and_other_insects_now_injuring_or_likely_to_injure_field_and_garden_crops_in_the_western_states_and_territories_%281877%29_%2814801465903%29.jpg) | 1774×3084 | No restrictions (PD) | Clean engraving. Mask the adult beetle. |
| ★ | Trademark: [Tiger Head Logo] brand Paris Green (label) | 1907 | Morris Herrmann & Co. | LOC 2026693688 | [LOC](https://www.loc.gov/pictures/item/2026693688/) | [v.jpg](https://tile.loc.gov/storage-services/service/pnp/trmk/1t60000/1t66000/1t66500/1t66556v.jpg) | TIFF on page | NKR | Real Paris-green package label. Later than the 1870s, so tag the date. |
|   | Trademark: Herrmann's Hi-Grade Pure Paris Green | 1907 | Morris Herrmann & Co. | LOC 2026693850 | [LOC](https://www.loc.gov/pictures/item/2026693850/) | [v.jpg](https://tile.loc.gov/storage-services/service/pnp/trmk/1t60000/1t66000/1t66700/1t66719v.jpg) | TIFF on page | NKR | Also: M H Co brand (2026693689); Star brand, 1911 (2026709388). |
|   | Trademark: Surmort brand "Powder for destroying the Cotton Worm" | 1874 | G. F. Gantz & Co. | LOC 2020745899 | [LOC](https://www.loc.gov/pictures/item/2020745899/) | [v.jpg](https://tile.loc.gov/storage-services/service/pnp/trmk/1t00000/1t01000/1t01600/1t01684v.jpg) | TIFF on page | NKR | An 1870s pesticide label. Whether it contains arsenic is unverified, so don't claim Paris green. |
|   | "Dust Paris green on swamps and ponds" (malaria poster) | 1940s | U.S. government | NARA 515024 | [Commons](https://commons.wikimedia.org/wiki/File:%22Dust_Paris_green_on_swamps_and_ponds%22_-_NARA_-_515024_(restored).jpg) | Commons original | — | PD (US gov) | Epilogue: Paris green's long afterlife. |
|   | Paris Green (packages) | 1880s | — | Smithsonian NMAH (nmah_718311, nmah_1141928) | [NMAH](https://americanhistory.si.edu/collections/object/nmah_718311) | — | — | **unverified**: the SI API shows no CC0 image | Worth a manual check. The page blocked automated fetch. |

---

## 11. Newspaper pages (Chronicling America, LOC, public domain)

All are free LOC newspaper scans. Crop the headline and the first paragraph. Page links open the viewer, where the high-resolution JP2/PDF can be downloaded.

| ★ | Headline (verified in the OCR) | Paper | Date | Page |
|---|---|---|---|---|
| ★ | **"POISON ON THE WALL. The Danger Lurking in Carelessly-Made Green Wall-Paper."** | The Bossier Banner (Bellevue, La.) | 10 Nov 1887, p. 1 | [LOC](http://www.loc.gov/resource/sn85034235/1887-11-10/ed-1/?sp=1) |
| ★ | **"Poisoning from Green Wall Paper."** (a Massachusetts woman sickened) | The Daily Phoenix (Columbia, S.C.) | 14 Nov 1872, p. 3 | [LOC](http://www.loc.gov/resource/sn84027008/1872-11-14/ed-1/?sp=3) |
|   | "Poisonous Wall Paper." (from Edinburgh manufacturers) | The Bee (Washington, D.C.) | 26 Jan 1884, p. 1 | [LOC](http://www.loc.gov/resource/sn84025890/1884-01-26/ed-1/?sp=1) |
|   | "To Detect Arsenic in Wall Paper." (the ammonia home test) | The State Journal (Harrisburg, Pa.) | 27 Dec 1884, p. 1 | [LOC](http://www.loc.gov/resource/sn83027086/1884-12-27/ed-1/?sp=1) |
|   | "Arsenic in Wall Paper." (Massachusetts Board of Health report) | The Press (Belleville, N.J.) | 7 May 1892, p. 1 | [LOC](http://www.loc.gov/resource/sn87068108/1892-05-07/ed-1/?sp=1) |
|   | Paris green against potato bugs: "Paris Green is the surest means of destruction, but … the most dangerous" | The Farmer and Mechanic (Raleigh, N.C.) | 13 Jun 1878, p. 6 | [LOC](http://www.loc.gov/resource/sn85042098/1878-06-13/ed-1/?sp=6) |
|   | Paris green with a pepper-duster for potato bugs | Kenosha Telegraph (Wis.) | 23 Jun 1870, p. 7 | [LOC](http://www.loc.gov/resource/sn85033123/1870-06-23/ed-1/?sp=7) |
|   | Farmers "laying in a supply of Paris green… a word of caution" | Helena Weekly Herald (Mont.) | 17 Jul 1879, p. 7 | [LOC](http://www.loc.gov/resource/sn84036143/1879-07-17/ed-1/?sp=7) |
|   | Children in the potato fields; farmers using Paris green | New York Herald | 22 Jun 1875, p. 3 | [LOC](http://www.loc.gov/resource/sn83030313/1875-06-22/ed-1/?sp=3) |

These are all American papers. For a British paper, *Annales d'hygiène* 1859 (beat 7) and the Hogg pamphlets work as period documents.

---

## 12. "Arsenic-free" wallpaper adverts

| ★ | Title | Date | Creator | Institution | Page | File | Px | Licence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| ★ | Advert for wall paper "free from Arsenic" (in National Health Society pamphlet *In a Sick Room*) | c. 1890 | National Health Society (GB) | Wellcome L0048804 | [Wellcome](https://wellcomecollection.org/works/mu8u5sh4) · [Commons](https://commons.wikimedia.org/wiki/File:Advert_for_wall_paper_free_from_Arsenic_Wellcome_L0048804.jpg) | [IIIF](https://iiif.wellcomecollection.org/image/L0048804/full/max/default.jpg) | 4182×6382 | PDM (CC BY 4.0 on Commons) | The direct hit for this beat. |
| ★ | *New stock patterns of non-arsenical artistic wall and ceiling papers*, Wm. Woollams & Co. | 1897 | Wm. Woollams & Co. | Caroline Simpson Library (Museums of History NSW) on IA `Woollams40062` | [IA](https://archive.org/details/Woollams40062) | via `find_images.py pages Woollams40062` | — | PDM | Trade catalogue whose title says "non-arsenical". Use the cover. |
|   | "Dr. Mackenzie's Arsenical Soap" (advert) | 19th c. | — | Wellcome L0080101 | [Wellcome](https://wellcomecollection.org/works/wreqrymf) | [IIIF](https://iiif.wellcomecollection.org/image/L0080101/full/max/default.jpg) | 5239×7878 | PDM | Counterpoint: arsenic was *sold* as a beauty product. |

---

## Thumbnail shortlist

1. **The Arsenic Waltz** (Punch 1862, Wellcome V0042226): two skeletons, readable at a glance. Tint the skeleton lady's dress coral. **First choice.**
2. **The Great Lozenge-Maker** (Punch 1858): Death in an apron making sweets. Very high resolution (3951×5505 / 5255×6985).
3. **Vernois 1859 hands plate**: ulcerated hands, visceral. Pairs with the line "the green that ate their hands".
4. **The Met 1868 green dress** (107839): an elegant single object. The coral tint makes the "poison dress" point.
5. **Kedzie sample page** (5544×7194): the book that can kill you.
6. **Hollyer's William Morris**: the strong single face, if the angle is "Morris got rich from arsenic".

---

## Gaps and suggested non-AI fills

| Beat or moment | Problem | Suggested fill |
|---|---|---|
| **Matilda Scheurer** (flower maker, d. 1861) | No image of her exists. | Godwin 1864 flower-workshop engraving (crop one anonymous worker; say on screen that no picture of her survives), plus the Vernois hands plate, plus the text of the inquest from a period journal page. |
| **Green artificial-flower wreaths and headdresses** | Surviving pieces with arsenic confirmed (V&A, Bata) are not free to use. | Fashion-plate details showing wreaths (Journal des Demoiselles 1863, Toudouze 1862), the wreath in the Arsenic Waltz itself, and the Met 1863 headdress as an object stand-in. |
| **Bata Shoe Museum boots / TMU dress** | Copyright photos. | Ask the Bata Shoe Museum for permission, or use the Met 1868 dress plus a drawn diagram of a fabric fibre coated with copper arsenite. |
| **Devon Great Consols, period** | Only modern CC BY-SA photos (share-alike). | A period OS map or geological-survey plate from IA, or a hand-drawn map of the Tamar valley. The Encyclopédie "arsenic furnace" plate (Wellcome V0023587) can show how arsenic was roasted. Use the modern calciner photos only with full CC BY-SA credit. |
| **Napoleon's actual wallpaper sample** | Private collection; no free image. | Rijksmuseum Longwood photo plus the Steuben deathbed lithograph, and a drawn diagram of damp paper, mould and arsenic gas ("Gosio gas"/trimethylarsine, a later explanation; frame it as theory). |
| **Illustrated London News coverage** | No free ILN engraving of flower makers or paper-staining was confirmed. ILN pre-1900 is public domain, but the free scans are scattered. | Run `find_images.py books "Illustrated London News 1862"` and page through IA volumes. Otherwise use the 1882 Cooper Hewitt wallpaper-production print and the Godwin 1864 engraving. |
| **Punch cartoon about wallpaper** | None found. Punch's arsenic cartoons are about dresses (1862) and sweets (1858). | Use the Kedzie page and the "POISON ON THE WALL" headline. |
| **1870s Paris-green packaging** | The earliest labels found are 1907–1911 (LOC trademarks). | 1870s newspaper text (beat 11), Riley 1876 plates, and the 1907 label tagged with its date. |
| **Arsenical sweets and toys (objects)** | No surviving object photos. | The Great Lozenge-Maker, the Met 1883 Paper Doll Nursery, and *Annales d'hygiène* 1859 vol. 12 pages on "bonbons arsenicaux" (around leaves n52–n75, Etalab) as a period-document insert. |
| **Scheele's life portrait** | None is authenticated. | Scheffner engraving tagged "later engraving", or the 1789 Wikman medal. Alternatively, open on Scheele's 1775 letter or a page of his *Chemische Abhandlung* (search IA `books "Scheele chemische"`). |
