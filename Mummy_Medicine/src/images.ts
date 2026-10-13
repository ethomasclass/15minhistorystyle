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
};
