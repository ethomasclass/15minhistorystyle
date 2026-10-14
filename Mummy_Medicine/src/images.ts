// Image paths and real pixel sizes (read with PIL). Scenes take both from here.
type Im = {src: string; size: [number, number]};
const im = (src: string, w: number, h: number): Im => ({src, size: [w, h]});

export const IMG = {
  merckTitle: im('img/ch01_1924/merck_darmstadt_price_list_1903_title.jpg', 2500, 4228),
  merckPage: im('img/ch01_1924/merck_darmstadt_price_list_1903_mumia_vera_aegyptiaca_page.jpg', 2500, 4188),
  merckLine: im('img/ch01_1924/merck_1903_mumia_vera_aegyptiaca_line_crop.jpg', 2500, 231),
  carter: im('img/ch01_1924/howard_carter_beside_tutankhamun_coffin_c1926.jpg', 1536, 1140),
  museumJar: im('img/ch01_1924/deutsches_apothekenmuseum_mumia_jar.jpg', 1920, 2880),
  seep: im('img/ai/ch02_bitumen_seep.jpg', 1376, 768),
  pometPlate: im('img/ch05_fakes/pomet_1712_mummies_plate.jpg', 3229, 3881),
  // ch02
  translator: im('img/ai/ch02_translator.jpg', 1376, 768),
  sarcophagus: im('img/ch03_mistake/description_egypte_mummy_shaped_sarcophagus_boulaq_1809.jpg', 3840, 2813),
  wrappedMummyPlate: im('img/ch03_mistake/description_egypte_wrapped_mummy_and_animal_mummies_1809.jpg', 3840, 5154),
  gerardMs: im('img/ch03_mistake/gerard_of_cremona_translation_razi_ms_c1250.jpg', 1067, 1211),
  gerardPage: im('img/ch03_mistake/gerard_of_cremona_wellcome_diagram_page.jpg', 1920, 2301),
  avicenna: im('img/ch02_word/avicenna_canon_persian_manuscript_isfahan_1632.jpg', 2400, 4746),
  blackCoffin: im('img/ch03_mistake/coffin_of_paankhaenamun_aic.jpg', 1686, 5058),
  pomet1712Plate: im('img/ch05_fakes/pomet_1712_mummies_plate.jpg', 3229, 3881),
  // ch03
  cairoTombs: im('img/ch04_trade/description_egypte_cairo_city_of_tombs_1809.jpg', 3840, 2753),
  tomb: im('img/ai/ch03_tomb_night.jpg', 1376, 768),
  ship: im('img/ai/ch03_ship_loading.jpg', 1376, 768),
  apothecary: im('img/ai/ch03_apothecary_grinding.jpg', 1376, 768),
  francis: im('img/ch04_trade/francis_i_of_france_oil_painting_wellcome.jpg', 2400, 2905),
  paracelsus: im('img/ch04_trade/paracelsus_hirschvogel_woodcut_1538.jpg', 2400, 3159),
  boyle: im('img/ch04_trade/robert_boyle_line_engraving_1696.jpg', 2400, 4033),
  // ch04
  alexandriaMap: im('img/ch04_trade/braun_hogenberg_alexandria_c1575_bnf.jpg', 3840, 2818),
  dealer: im('img/ai/ch04_dealer_storeroom.jpg', 1376, 768),
  pare: im('img/ch05_fakes/ambroise_pare_woodcut_1582.jpg', 2400, 3329),
  pomet: im('img/ch04_trade/pierre_pomet_portrait_1694.jpg', 2806, 4383),
  oven: im('img/ai/ch04_oven_fakes.jpg', 1376, 768),
  pomet1725Plate: im('img/ch05_fakes/pomet_1725_mummies_plate.jpg', 3142, 4320),
  // ch05
  crollFront: im('img/ch04_trade/paracelsus_croll_basilica_chymica_frontispiece_detail.jpg', 2400, 3520),
  crollTitle: im('img/ch05_fresh/croll_basilica_chymica_title_page.jpg', 1614, 2657),
  crollPage: im('img/ch05_fresh/croll_basilica_chymica_theriaca_de_mumia_page.jpg', 1566, 2645),
  schroederPage: im('img/ch05_fresh/schroeder_1669_modern_mummy_recipe_page.jpg', 3427, 5282),
  mummyCase: im('img/ch04_trade/cartonnage_mummy_case_cma.jpg', 1011, 2048),
};
