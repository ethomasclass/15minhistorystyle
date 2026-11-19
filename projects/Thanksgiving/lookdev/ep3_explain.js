// Episode 3 (Immigration, 1884): the explainer diagrams. Load after ep3.js (bridge.html). Reuses, read only: the camera, labels
// and frame from explainers.js (tag, penS, tapeS, card, frame, SAFE), rig.js (figure, smooth, f1, pts, rng), and from ep3.js the
// colours (E3), the map data (E3_LAND, E3P, E3_RUSSIA), the neighbour figures (nb) and the defs (e3Defs).
//
//   ep3_pale_map        ch2  The Russian Empire's western region; the Pale of Settlement shaded; "home"; three vocab cards.
//   ep3_chain           ch3  Chain migration: Yankel goes first (1882), works, sends letters, money and a prepaid ticket east;
//                            the family follows (1884); later a cousin. The Sun's 1884 steamship ads ("$18").
//   ep3_stat_cg         ch4  Castle Garden in numbers: 1855 to 1890, about 8 million people, 2 of every 3 immigrants.
//   ep3_old_new         ch5  The "old" vs "new" immigrants chart, rebuilt on notebook paper; the Kellys break it.
//   ep3_decades         ch5  Immigrants per decade (2.8, 5.2, 3.7, 8.8 million), then 1884's "1 in 50" picture graph.
//   ep3_piecework       ch7  The contracting chain (company, contractor, the family's room), and Riis's numbers.
//   ep3_laws            ch8  Walls and welcome, 1882 to 1886: the laws above the line, the poem and the Statue below.
//   ep3_pedestal        ch8  The pedestal fund: 100,000+ people, most giving $1 or less (1885).
//   ep3_tenement_plan   ch6  One tenement floor from above: four flats, dark inside rooms, one sink in the hall.
//
// Colour rules: Kellys coral only; the Rabinowitzes (and Jewish arrivals) wheat gold; everyone else ink or a muted grey-green;
// teal draws and explains; orange is the torn strip and the handwriting; cream paper. No em dashes in any on-screen text.

const XP = {bg: '#0B1414', grid: '#13221F', panel: '#1C3332', panel2: '#4E726C', mute: '#5F857F', mute2: '#3E5F5A', pale: '#A3BAB2',
  teal: '#2FE0C4', orange: '#FF9F1C', cream: '#F4EFE6', ink: '#0D0C09', coral: '#FF6F61', gold: '#E2B864', goldTone: '#7A5B22', paper: '#EDE4D0'};

/* ---------- shared bits ---------- */
const xpOp = (u, body) => (u <= 0.005 ? '' : `<g opacity="${f1(Math.min(1, u) * 100) / 100}">${body}</g>`);
const xpIn = (t0, t, d = 0.45) => smooth(t0, t0 + d, t);
const xpWin = (t0, t1, t, d = 0.45) => smooth(t0, t0 + d, t) * (1 - smooth(t1, t1 + d, t)); // in at t0, out at t1
const xpMono = (x, y, txt, size = 26, col = XP.cream, anchor = 'start', ls = 2) => `<text x="${f1(x)}" y="${f1(y)}" font-family="Mono" font-size="${size}" letter-spacing="${ls}" fill="${col}" text-anchor="${anchor}">${txt}</text>`;
const xpInter = (x, y, txt, size = 34, col = XP.ink, weight = 600, anchor = 'start') => `<text x="${f1(x)}" y="${f1(y)}" font-family="Inter" font-weight="${weight}" font-size="${size}" fill="${col}" text-anchor="${anchor}">${txt}</text>`;
const xpAbril = (x, y, txt, size = 64, col = XP.cream, anchor = 'start') => `<text x="${f1(x)}" y="${f1(y)}" font-family="Abril" font-size="${size}" fill="${col}" text-anchor="${anchor}">${txt}</text>`;
// the dark explainer board: faint graph-paper squares, like the series' maps and charts
function xpBoard(seed = 1) {
  const s = [`<rect width="1920" height="1080" fill="${XP.bg}"/>`];
  for (let x = 0; x <= 1920; x += 60) s.push(`<rect x="${x}" y="0" width="1.2" height="1080" fill="${XP.grid}"/>`);
  for (let y = 0; y <= 1080; y += 60) s.push(`<rect x="0" y="${y}" width="1920" height="1.2" fill="${XP.grid}"/>`);
  return s.join('');
}
const xpFrame = (t, world, screen = '') => frame(e3Defs(t), '', world, screen, t);
// a polyline cut at fraction u of its length
function xpPartial(a, u) {
  const len = a.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) : 0), 0), L = len * clamp01(u), o = [a[0]];
  let acc = 0;
  for (let i = 1; i < a.length; i++) { const d = Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]); if (acc + d >= L) { const v = d ? (L - acc) / d : 0; o.push([a[i - 1][0] + (a[i][0] - a[i - 1][0]) * v, a[i - 1][1] + (a[i][1] - a[i - 1][1]) * v]); return o; } acc += d; o.push(a[i]); }
  return o;
}
const xpAt = (a, u) => { const p = xpPartial(a, u); return p[p.length - 1]; };
// points along a quadratic curve from p0 to p1, bowed by `bend` px to the left of travel
function xpCurve(p0, p1, bend, n = 40) {
  const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2, dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1;
  const c = [mx + (dy / L) * bend, my - (dx / L) * bend], o = [];
  for (let i = 0; i <= n; i++) { const u = i / n, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), d = u * u; o.push([a * p0[0] + b * c[0] + d * p1[0], a * p0[1] + b * c[1] + d * p1[1]]); }
  return o;
}
// a teal arrow that draws itself on (u 0..1), with a dark under-stroke; the head lands at the end
function xpArrow(a, u, {col = XP.teal, w = 6, dash = '', head = true} = {}) {
  if (u <= 0.005) return '';
  const p = xpPartial(a, u), e = p[p.length - 1], q = p[Math.max(0, p.length - 2)];
  const da = dash ? ` stroke-dasharray="${dash}"` : '';
  let s = `<polyline points="${pts(p)}" fill="none" stroke="#111" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"${da}/>` +
    `<polyline points="${pts(p)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${da}/>`;
  if (head && u > 0.6) {
    const ang = Math.atan2(e[1] - q[1], e[0] - q[0]), hs = 12 + w * 2.2, k = smooth(0.6, 0.95, u);
    const h1 = [e[0] - Math.cos(ang - 0.5) * hs * k, e[1] - Math.sin(ang - 0.5) * hs * k], h2 = [e[0] - Math.cos(ang + 0.5) * hs * k, e[1] - Math.sin(ang + 0.5) * hs * k];
    s += `<polyline points="${pts([h1, e, h2])}" fill="none" stroke="#111" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${pts([h1, e, h2])}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return s;
}
// a picture-graph person: round head, shoulders, two legs (skirt for a woman or girl). y is the feet.
function xpPerson(x, y, h, col, {skirt = false, kid = false, stroke = '', op = 1} = {}) {
  const r = h * (kid ? 0.14 : 0.12), hy = y - h + r, sh = hy + r * 1.35, bw = h * (kid ? 0.4 : 0.36), hip = y - h * 0.44, st = stroke ? ` stroke="${stroke}" stroke-width="3"` : '';
  let body = `<circle cx="${f1(x)}" cy="${f1(hy)}" r="${f1(r)}"${st}/>`;
  if (skirt) body += `<path d="M${f1(x - bw * 0.42)},${f1(sh + r * 0.5)} q0,${f1(-r * 0.5)} ${f1(r * 0.5)},${f1(-r * 0.5)} l${f1(bw * 0.84 - r)},0 q${f1(r * 0.5)},0 ${f1(r * 0.5)},${f1(r * 0.5)} L${f1(x + bw * 0.62)},${f1(y - h * 0.1)} L${f1(x - bw * 0.62)},${f1(y - h * 0.1)} Z"${st}/>` +
    `<rect x="${f1(x - bw * 0.3)}" y="${f1(y - h * 0.12)}" width="${f1(bw * 0.22)}" height="${f1(h * 0.12)}"${st}/><rect x="${f1(x + bw * 0.08)}" y="${f1(y - h * 0.12)}" width="${f1(bw * 0.22)}" height="${f1(h * 0.12)}"${st}/>`;
  else body += `<path d="M${f1(x - bw / 2)},${f1(hip)} L${f1(x - bw / 2)},${f1(sh + r * 0.6)} q0,${f1(-r * 0.6)} ${f1(r * 0.6)},${f1(-r * 0.6)} l${f1(bw - r * 1.2)},0 q${f1(r * 0.6)},0 ${f1(r * 0.6)},${f1(r * 0.6)} L${f1(x + bw / 2)},${f1(hip)} Z"${st}/>` +
    `<rect x="${f1(x - bw * 0.42)}" y="${f1(hip - 1)}" width="${f1(bw * 0.38)}" height="${f1(y - hip + 1)}" rx="${f1(bw * 0.08)}"${st}/><rect x="${f1(x + bw * 0.04)}" y="${f1(hip - 1)}" width="${f1(bw * 0.38)}" height="${f1(y - hip + 1)}" rx="${f1(bw * 0.08)}"${st}/>`;
  return `<g fill="${col}" opacity="${f1(op * 100) / 100}">${body}</g>`;
}
// small props
const xpEnvelope = (x, y, k = 1) => `<g transform="translate(${f1(x)},${f1(y)}) scale(${k})"><rect x="-26" y="-17" width="52" height="34" fill="${XP.paper}" stroke="#111" stroke-width="2.5"/><path d="M-26,-17 L0,4 L26,-17" fill="none" stroke="#111" stroke-width="2.5"/></g>`;
const xpCoin = (x, y, k = 1, col = XP.cream) => `<g transform="translate(${f1(x)},${f1(y)}) scale(${k})"><circle r="17" fill="${col}" stroke="#111" stroke-width="2.5"/><text x="0" y="8" font-family="Inter" font-weight="800" font-size="22" text-anchor="middle" fill="#111">$</text></g>`;
const xpTicket = (x, y, k = 1, rot = -6) => `<g transform="translate(${f1(x)},${f1(y)}) rotate(${rot}) scale(${k})"><rect x="-38" y="-22" width="76" height="44" fill="#DCCFB0" stroke="#111" stroke-width="2.5"/><rect x="-32" y="-16" width="64" height="32" fill="none" stroke="#2B2418" stroke-width="1.5"/><path d="M-24,4 l26,0 l-4,7 l-20,0 Z" fill="#2B2418"/><rect x="8" y="-9" width="18" height="3" fill="#2B2418"/><rect x="8" y="-1" width="14" height="3" fill="#2B2418"/></g>`;
const xpGarment = (x, y, k = 1, col = XP.cream) => `<g transform="translate(${f1(x)},${f1(y)}) scale(${k})"><path d="M-12,-22 L-26,-14 L-34,8 L-24,12 L-20,0 L-20,24 L20,24 L20,0 L24,12 L34,8 L26,-14 L12,-22 Q0,-12 -12,-22 Z" fill="${col}" stroke="#111" stroke-width="2.5"/><line x1="0" y1="-16" x2="0" y2="24" stroke="#111" stroke-width="1.5"/></g>`;
const xpBundle = (x, y, k = 1, col = '#C9BFA6') => `<g transform="translate(${f1(x)},${f1(y)}) scale(${k})"><rect x="-34" y="-20" width="68" height="40" rx="10" fill="${col}" stroke="#111" stroke-width="2.5"/><path d="M-10,-20 L-6,20 M12,-20 L8,20" stroke="#5B5240" stroke-width="3"/></g>`;
const xpIron = (x, y, k = 1, col = '#111') => `<g transform="translate(${f1(x)},${f1(y)}) scale(${k})"><path d="M-22,0 L22,0 L16,-14 L-14,-14 Z" fill="${col}"/><path d="M-8,-14 q8,-14 16,0" fill="none" stroke="${col}" stroke-width="4"/></g>`;
const xpHouse = (x, y, k = 1, col = XP.mute2) => `<g transform="translate(${f1(x)},${f1(y)}) scale(${k})" fill="${col}"><path d="M0,0 L0,-60 L50,-100 L100,-60 L100,0 Z"/><rect x="38" y="-38" width="22" height="38" fill="${XP.bg}" opacity="0.6"/><rect x="66" y="-56" width="18" height="16" fill="${XP.bg}" opacity="0.6"/></g>`;
// a cream sheet behind text (used for the Riis numbers card)
const xpPaper = (x, y, w, h, rot = 0) => `<g transform="rotate(${rot}, ${x}, ${y})"><rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" fill="#000" opacity="0.45" filter="url(#soft)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${XP.cream}"/></g>`;

/* ================= 1. ep3_pale_map (ch 2): the Pale of Settlement ================= */
// The Pale, approximately: the fifteen western provinces where Jews were required to live (today much of Lithuania, Belarus,
// Ukraine and Moldova, and the Bialystok corner of eastern Poland). Hand-traced from period maps, rounded; "borders approximate".
const XP_PALE = [[21.05, 56.1], [22.0, 56.4], [24.0, 56.35], [25.5, 56.2], [26.3, 55.9], [26.6, 56.6], [27.0, 57.0], [28.3, 57.1], [29.4, 56.5], [31.0, 56.0],
  [31.5, 55.0], [32.5, 54.2], [32.6, 53.3], [33.6, 52.8], [34.1, 52.3], [34.9, 51.0], [35.6, 50.2], [36.5, 49.2], [38.0, 49.2], [39.5, 48.4], [39.0, 47.1],
  [37.0, 46.0], [36.7, 45.0], [33.5, 44.3], [32.4, 45.5], [31.0, 46.2], [30.0, 45.5], [29.6, 45.2], [28.2, 45.5], [28.0, 46.5], [27.2, 47.8], [26.6, 48.3],
  [26.1, 48.7], [26.0, 49.6], [25.2, 50.1], [24.1, 50.6], [23.6, 51.5], [23.1, 52.3], [22.5, 52.6], [22.7, 53.3], [23.5, 53.9], [23.9, 54.9], [22.8, 55.0],
  [22.0, 55.05], [21.3, 55.2], [21.0, 55.7]];
function renderPaleMap(t) {
  const k = 1.6, z = 1 + 0.025 * smooth(0, 14, t);
  // the letter map's projection, scaled up on eastern Europe: lon 30, lat 51 sits at (560, 540)
  const [cx, cy] = E3P(30, 51), ox = 560 - cx * k, oy = 540 - cy * k, P = (lon, lat) => { const [x, y] = E3P(lon, lat); return [ox + x * k, oy + y * k]; };
  const S = (p) => [960 + (p[0] - 960) * z, 540 + (p[1] - 540) * z];
  const m = [`<rect width="1920" height="1080" fill="#132423"/>`];
  m.push(`<clipPath id="xpland"><path d="${E3_LAND}" transform="translate(${f1(ox)},${f1(oy)}) scale(${k})"/></clipPath>`);
  m.push(`<path d="${E3_LAND}" transform="translate(${f1(ox)},${f1(oy)}) scale(${k})" fill="#24403D" stroke="#5F857F" stroke-width="${f1(2 / k)}"/>`);
  for (let lat = 40; lat <= 62; lat += 5) m.push(line([P(0, lat), P(60, lat)], '#2B4744', 1.2));
  for (let lon = 0; lon <= 60; lon += 10) m.push(line([P(lon, 38), P(lon, 64)], '#2B4744', 1.2));
  const uR = xpIn(0.8, t, 0.8), uP = xpIn(2.4, t, 1.2), ring = pts(E3_RUSSIA.map(([a, b]) => (a === 50 ? P(90, b === 40 ? 38 : b) : P(a, b)))), pale = XP_PALE.map(([a, b]) => P(a, b));
  if (uR > 0) m.push(xpOp(uR, `<g clip-path="url(#xpland)"><polygon points="${ring}" fill="#3E5F5A"/><polygon points="${ring}" fill="url(#hatchT)" opacity="0.45"/></g>`));
  if (uP > 0) {
    m.push(xpOp(uP, `<g clip-path="url(#xpland)"><polygon points="${pts(pale)}" fill="${XP.teal}" opacity="0.32"/></g>`));
    const ring2 = [...pale, pale[0]];
    m.push(`<polyline points="${pts(xpPartial(ring2, uP))}" fill="none" stroke="#111" stroke-width="8" stroke-linejoin="round"/><polyline points="${pts(xpPartial(ring2, uP))}" fill="none" stroke="${XP.teal}" stroke-width="4.5" stroke-linejoin="round" stroke-dasharray="14 8"/>`);
  }
  const home = P(28.6, 50.25), uH = xpIn(4.6, t, 0.4);
  if (uH > 0) m.push(`<circle cx="${f1(home[0])}" cy="${f1(home[1])}" r="${f1(13 * uH)}" fill="${XP.orange}" stroke="#111" stroke-width="3"/>`);
  // the cards side dims a little so they sit cleanly
  const dimR = xpIn(6.2, t, 0.6);
  const world = `<g transform="translate(960,540) scale(${f1(z * 1000) / 1000}) translate(-960,-540)">${m.join('')}</g>` +
    (dimR > 0 ? `<rect x="960" y="0" width="960" height="1080" fill="#0B1414" opacity="${f1(0.45 * dimR * 100) / 100}"/>` : '');
  const scr = [];
  const re = S(P(33.2, 58.2)), pl = S(P(27.0, 52.9)), hm = S(home);
  scr.push(tag(re[0] - 140, re[1], 'RUSSIAN EMPIRE', xpIn(1.3, t)));
  scr.push(tag(pl[0] - 190, pl[1], 'PALE OF SETTLEMENT', xpIn(3.2, t)));
  if (t > 3.8) scr.push(xpOp(xpIn(3.8, t), penS(130, 935, 'where most Jews had to live', 30, -3)));
  scr.push(tag(hm[0] - 50, hm[1] + 62, 'HOME', xpIn(4.8, t)));
  scr.push(tag(130, 1000, 'ABOUT 1884 · BORDERS APPROXIMATE', xpIn(1.6, t)));
  scr.push(card(1000, 70, 'Pale of Settlement', 'Western Russian Empire, where most|Jews were required to live.', '', xpIn(6.4, t)));
  scr.push(card(1000, 352, 'Pogrom', 'A mob attack on a Jewish community,|often with officials looking|the other way.', '', xpIn(8.2, t)));
  scr.push(card(1000, 690, 'May Laws', 'Russian rules of 1882 that pushed|Jews out of villages and limited|where they could live and trade.', '', xpIn(10.0, t)));
  return xpFrame(t, world, scr.join(''));
}

/* ================= 2. ep3_chain (ch 3): chain migration ================= */
const XP_SUN = E3_IMG + 'f_letters/steamship_ads_prepaid_steerage_the_sun_jun11_1884_loc_sn83030272.jpg';
if (typeof window !== 'undefined') window.E3_PRELOAD = Promise.all([window.E3_PRELOAD, new Promise((ok) => { const im = new Image(); im.onload = im.onerror = () => ok(true); im.src = XP_SUN; })]);
function renderChain(t) {
  // A numbered story, left to right in time. Westbound arcs stack top to bottom in the order they happen (1 Yankel, 4 the family,
  // 5 a cousin), each labelled just above its own middle when it lands; the eastbound arc (3) runs under the sea, labelled below.
  const G = 470, s = [xpBoard()], scr = [];
  const arc1 = xpCurve([1300, 215], [570, 215], 60), arc4 = xpCurve([1300, 325], [590, 325], 60), arc5 = xpCurve([1300, 425], [620, 425], 60);
  const arc3 = xpCurve([560, 565], [1400, 565], 60);
  // the two ends: New York (left) and the old country (right), the ocean between
  s.push(icon('city', 150, G - 176, 2.3, '#1F3A37') + icon('city', 380, G - 150, 1.9, '#1F3A37'));
  s.push(xpHouse(1520, G, 1.6, '#1F3A37'));
  for (let i = 0; i < 4; i++) s.push(`<path d="M${720 + (i % 2) * 40},${G - 40 + i * 22} ${[...Array(9)].map(() => `q20,-10 40,0 q20,10 40,0`).join(' ')}" fill="none" stroke="#2B4744" stroke-width="3" opacity="0.8"/>`);
  s.push(`<rect x="110" y="${G}" width="560" height="3" fill="#2B4744"/><rect x="1250" y="${G}" width="560" height="3" fill="#2B4744"/>`);
  const fig2 = (name, x, d, h, o = {}) => nb(name, {x, y: G, h, d, det: 0, hat: o.hat, coat: o.coat, scale: o.scale, an: {...POSES.stand(t, x / 300), ...(o.an || {})}});
  // 1. Yankel goes first (1882)
  const u1 = xpIn(0.9, t, 1.6), yArr = smooth(2.3, 2.6, t);
  if (u1 < 0.05) s.push(fig2('nfather', 1340, -1, 210, {hat: 'cap', coat: 'frock'}));
  s.push(xpArrow(arc1, u1, {w: 6}));
  if (u1 > 0.02 && u1 < 0.98) { const p = xpAt(arc1, u1); s.push(xpPerson(p[0], p[1] - 8, 56, XP.gold)); }
  if (yArr > 0) s.push(xpOp(yArr, fig2('nfather', 300, 1, 210, {hat: 'cap', coat: 'frock', an: t > 3 ? POSES.iron(t) : {}})));
  // 2. works, saves: a pressing board, coins piling up
  const work = xpWin(3.0, 8.6, t);
  if (work > 0) s.push(xpOp(work, `<rect x="380" y="${G - 108}" width="150" height="10" fill="#2B4744"/><rect x="392" y="${G - 98}" width="8" height="98" fill="#2B4744"/><rect x="508" y="${G - 98}" width="8" height="98" fill="#2B4744"/>` +
    xpIron(440 + 18 * Math.sin(t * 4), G - 108, 1.1, XP.cream) + [0, 1, 2].map((i) => (t > 3.4 + i * 0.4 ? xpCoin(560, G - 20 - i * 12, 0.9) : '')).join('')));
  // 3. letters + money, then the ticket, go east under the sea
  const uL = xpIn(4.2, t, 1.4), uT = xpIn(5.8, t, 1.3);
  s.push(xpArrow(arc3, Math.max(uL, uT), {w: 6}));
  if (uL > 0.02 && uL < 0.98) { const p = xpAt(arc3, uL); s.push(xpEnvelope(p[0] - 30, p[1], 1) + xpCoin(p[0] + 26, p[1] + 4, 0.9)); }
  if (uT > 0.02) { const p = xpAt(arc3, Math.min(uT, 0.995)); s.push(xpOp(1 - smooth(7.6, 8.0, t), xpTicket(p[0], p[1] - (uT > 0.99 ? 34 : 0), 1.2))); }
  // 4. the family follows (1884)
  const u4 = xpIn(7.6, t, 1.6), fArr = smooth(9.0, 9.3, t);
  if (u4 < 0.05) s.push(fig2('nmother', 1360, -1, 210) + fig2('ndaughter', 1430, -1, 210, {scale: 0.8}) + fig2('nson', 1490, -1, 210, {scale: 0.5}));
  if (u4 > 0) s.push(xpArrow(arc4, u4, {w: 6}));
  if (u4 > 0.02 && u4 < 0.98) { const p = xpAt(arc4, u4); s.push(xpPerson(p[0] - 30, p[1] - 8, 60, XP.gold, {skirt: true}) + xpPerson(p[0] + 4, p[1] - 8, 48, XP.gold, {skirt: true, kid: true}) + xpPerson(p[0] + 32, p[1] - 8, 38, XP.gold, {kid: true})); }
  if (fArr > 0) s.push(xpOp(fArr, fig2('nmother', 380, 1, 210) + fig2('ndaughter', 445, 1, 210, {scale: 0.8}) + fig2('nson', 500, 1, 210, {scale: 0.5})));
  // 5. later: a cousin, waiting at home for the next ticket; a dotted arc, because it has not happened yet
  const uC = xpIn(9.8, t, 0.6), u5 = xpIn(10.0, t, 1.0);
  if (uC > 0) s.push(xpOp(uC * 0.7, fig2('nmother', 1420, -1, 200)) + xpArrow(arc5, u5, {w: 5, dash: '4 16'}));
  // The Sun, June 11, 1884: the shipping ads (Anchor Line "Steerage, $18"; Monarch Line "prepaid steerage tickets")
  const ad = xpWin(5.9, 10.3, t, 0.5);
  if (ad > 0) {
    const ax = 130, ay = 640, aw = 520, ah = aw * 380 / 690; // crop: the top of the column (y 20 to 400 of 1500)
    s.push(xpOp(ad, `<g transform="rotate(-1.5, ${ax}, ${ay})"><rect x="${ax + 8}" y="${ay + 12}" width="${aw}" height="${f1(ah)}" fill="#000" opacity="0.5" filter="url(#soft)"/>` +
      `<svg x="${ax}" y="${ay}" width="${aw}" height="${f1(ah)}" viewBox="0 20 690 380" preserveAspectRatio="xMidYMid slice"><image href="${XP_SUN}" x="0" y="0" width="690" height="1500"/></svg>` +
      `<ellipse cx="${f1(ax + aw * 605 / 690)}" cy="${f1(ay + (252 - 20) * aw / 690)}" rx="62" ry="22" fill="none" stroke="${XP.teal}" stroke-width="5" opacity="${f1(smooth(6.6, 7.0, t))}"/></g>`));
  }
  // labels: each lands with its own arrow, next to it
  scr.push(tag(150, 185, 'NEW YORK', xpIn(0.2, t)), tag(1450, 185, 'THE OLD COUNTRY', xpIn(0.2, t)));
  const L1 = xpIn(2.2, t), L3 = xpIn(5.0, t), L4 = xpIn(8.9, t), L5 = xpIn(10.8, t);
  scr.push(tag(650, 206, '1882', L1), xpOp(L1, penS(780, 212, '1. Yankel goes first', 24, -2)));
  scr.push(tag(160, 525, '2. WORKS, SAVES', xpIn(3.2, t)));
  scr.push(xpOp(L3, penS(720, 628, '3. letters, money, a ticket', 24, -2)));
  scr.push(tag(650, 316, '1884', L4), xpOp(L4, penS(780, 322, '4. the family follows', 24, -2)));
  scr.push(xpOp(L5, penS(780, 420, '5. later: a cousin', 24, -2)));
  scr.push(tag(150, 1000, 'THE SUN, NEW YORK, JUNE 11, 1884', ad), tag(690, 940, '$18 ≈ $650 TODAY', ad * xpIn(6.8, t)));
  scr.push(card(130, 700, 'Chain migration', 'One family member moves first, then|helps the next one come.', '', xpIn(10.6, t)));
  scr.push(card(980, 700, 'Prepaid ticket', 'A ship ticket bought in America|and mailed to someone in Europe.', '', xpIn(11.4, t)));
  return xpFrame(t, s.join(''), scr.join(''));
}

/* ================= 3. ep3_stat_cg (ch 4): Castle Garden in numbers ================= */
function renderStatCG(t) {
  const s = [xpBoard()];
  // the fort, small: a low round wall, the broad roof, the lantern
  s.push(xpOp(xpIn(0.3, t), `<g transform="translate(790,175)" fill="#2B4744"><path d="M0,0 L0,-34 Q110,-52 220,-34 L220,0 Z"/><path d="M-6,-34 Q110,-70 226,-34 Z"/><rect x="94" y="-74" width="32" height="18"/><path d="M90,-74 L110,-86 L130,-74 Z"/>` +
    [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${16 + i * 34},0 l0,-16 a7,7 0 0 1 14,0 l0,16 Z" fill="${XP.bg}" opacity="0.7"/>`).join('') + `</g>`));
  // the picture graph: three people, two of them teal
  const fx = [250, 450, 650], fy = 1000, fh = 330, fill2 = xpIn(5.8, t, 0.5);
  fx.forEach((x, i) => { const u = xpIn(4.4 + i * 0.3, t, 0.35); if (u > 0) s.push(xpOp(u, xpPerson(x, fy, fh, XP.mute2, {skirt: i === 1})) + (i < 2 && fill2 > 0 ? xpOp(fill2, xpPerson(x, fy, fh, XP.teal, {skirt: i === 1})) : '')); });
  const scr = [];
  scr.push(xpOp(xpIn(0.2, t), tapeS(130, 84, 'CASTLE GARDEN', 60, -2, 1, 31)));
  scr.push(xpOp(xpIn(1.0, t), xpAbril(140, 320, '1855 to 1890', 84)));
  scr.push(xpOp(xpIn(2.4, t), xpAbril(140, 500, '≈ 8 MILLION PEOPLE', 112, XP.cream)));
  scr.push(tag(150, 575, 'AT THE BATTERY, NEW YORK', xpIn(2.9, t)));
  scr.push(xpOp(xpIn(6.2, t), xpAbril(860, 790, '2 OF EVERY 3', 112, XP.teal)));
  scr.push(xpOp(xpIn(6.6, t), xpAbril(864, 935, 'IMMIGRANTS', 84, XP.cream)));
  scr.push(tag(870, 1008, 'WHO CAME TO THE U.S. IN THOSE YEARS', xpIn(7.0, t)));
  return xpFrame(t, s.join(''), scr.join(''));
}

/* ================= 4. ep3_old_new (ch 5): the old vs new immigrants chart ================= */
const XP_ROWS = [
  [['Arrived before 1880'], ['Arrived 1880 to 1910']],
  [['Northern and Western Europe'], ['Southern and Eastern Europe']],
  [['Mainly Protestant'], ['Mainly Catholic, Jewish or', 'Orthodox Christian']],
  [['<SEEN> similar to earlier settlers'], ['<SEEN> different']],
  [['Settled in cities and farm country'], ['Mostly settled in cities']],
];
function xpTornV(x, y0, y1, w, seed, u = 1) { // a vertical torn strip of orange paper, growing downward with u
  const r = rng(seed), yb = y0 + (y1 - y0) * clamp01(u), L = [], R = [];
  for (let y = y0; y <= yb + 0.1; y += 14) { L.push([x - w / 2 + r() * 6, y]); R.push([x + w / 2 - r() * 6, y]); }
  L.push([x - w / 2 + 3, yb]); R.push([x + w / 2 - 3, yb]);
  return `<polygon points="${pts([...L, ...R.reverse()])}" fill="${XP.orange}"/>`;
}
function xpTornH(x, y, w, h, seed) { // a horizontal torn strip of orange paper
  const r = rng(seed), T = [], B = [];
  for (let u = 0; u <= w + 0.1; u += 16) { T.push([x + u, y + r() * 4]); B.push([x + u, y + h - r() * 4]); }
  return `<polygon points="${pts([...T, ...B.reverse()])}" fill="${XP.orange}"/>`;
}
// o (optional, the Ep 3 edit, ch 5): at = {header, line, seen, who, kellys, kpen, arrow, except} reveal times; cells[i] = [left, right]
// reveal times per row (the narration reads the old column first, then the new), all in the same clock as t
function renderOldNew(t, o = {}) {
  const AT = (k, d) => (o.at && o.at[k] != null ? o.at[k] : d);
  const PX0 = 120, PX1 = 1800, PY0 = 70, PY1 = 1010, DIV = 960, LX = 170, RX = 1010, ROW0 = 215, RH = 125;
  const s = [`<rect width="1920" height="1080" fill="#14110D"/>`, MAT.planks(-40, -40, 2000, 1160, {base: '#2A2117', seed: 141, size: 70}), `<rect width="1920" height="1080" fill="url(#exvig)"/>`];
  const sheet = xpIn(0, t, 0.6), sy = 40 * (1 - sheet);
  const p = [];
  p.push(`<rect x="${PX0 + 10}" y="${PY0 + 14}" width="${PX1 - PX0}" height="${PY1 - PY0}" fill="#000" opacity="0.5" filter="url(#soft)"/><rect x="${PX0}" y="${PY0}" width="${PX1 - PX0}" height="${PY1 - PY0}" fill="${XP.cream}"/>`);
  for (let y = PY0 + 60; y < PY1; y += 42) p.push(`<rect x="${PX0}" y="${y}" width="${PX1 - PX0}" height="1.4" fill="#2B4744" opacity="0.13"/>`);
  // headers
  const uh = xpIn(AT('header', 0.5), t);
  p.push(xpOp(uh, xpAbril((PX0 + DIV) / 2, 172, 'OLD IMMIGRANTS', 58, XP.ink, 'middle') + xpAbril((DIV + PX1) / 2, 172, 'NEW IMMIGRANTS', 58, XP.ink, 'middle') + `<rect x="${PX0 + 30}" y="${ROW0 - 12}" width="${PX1 - PX0 - 60}" height="3" fill="${XP.ink}"/>`));
  // the 1880 line: an orange torn strip down the middle
  const ud = xpIn(AT('line', 0.8), t, 0.9);
  if (ud > 0) p.push(xpTornV(DIV, 110, ROW0 + RH * 5, 26, 7, ud));
  // rows, one at a time
  const T_ROW = [1.8, 3.3, 4.8, 6.3, 7.9];
  XP_ROWS.forEach((row, i) => {
    const uL = xpIn(o.cells ? o.cells[i][0] : T_ROW[i], t, 0.5), uR = xpIn(o.cells ? o.cells[i][1] : T_ROW[i], t, 0.5), u = Math.max(uL, uR); if (u <= 0) return;
    const top = ROW0 + i * RH, dx = -24 * (1 - u);
    const cell = (x, lines) => lines.map((ln, j) => {
      const y = top + (lines.length === 1 && !(i === 2 && x === LX) ? 74 : 54 + j * 42);
      if (ln.startsWith('<SEEN>')) return xpInter(x + 150, y, ln.slice(6), 34, XP.ink, 600) + xpInter(x, y, 'SEEN AS', 34, XP.ink, 800) + `<rect x="${x}" y="${y + 8}" width="136" height="6" fill="#111"/><rect x="${x + 1}" y="${y + 9}" width="134" height="4" fill="${XP.teal}"/>`;
      return xpInter(x, y, ln, 34, XP.ink, 600);
    }).join('');
    const dL = -24 * (1 - uL), dR = -24 * (1 - uR);
    p.push(xpOp(uL, `<g transform="translate(${f1(dL)},0)">${cell(LX, row[0])}</g>`) + xpOp(uR, `<g transform="translate(${f1(dR)},0)">${cell(RX, row[1])}</g>`) + xpOp(u, `<rect x="${PX0 + 30}" y="${top + RH - 1}" width="${PX1 - PX0 - 60}" height="1.5" fill="${XP.ink}" opacity="0.3"/>`));
  });
  const u4 = xpIn(AT('seen', 6.9), t);
  if (u4 > 0) p.splice(3, 0, `<rect x="${PX0 + 20}" y="${ROW0 + 3 * RH + 4}" width="${PX1 - PX0 - 40}" height="${RH - 8}" fill="${XP.teal}" opacity="${f1(0.22 * u4 * 100) / 100}"/>`);
  const scr = [];
  // the Kellys slide into the old column; the exception, in teal
  const uk = xpIn(AT('kellys', 9.4), t, 0.8), kx = -260 * (1 - uk);
  if (uk > 0) p.push(`<g transform="translate(${f1(kx)},0)">` + xpPerson(210, 990, 118, XP.coral, {skirt: true}) + xpPerson(272, 990, 128, XP.coral) + xpPerson(330, 990, 112, XP.coral, {skirt: true}) + xpPerson(382, 990, 92, XP.coral, {kid: true}) + `</g>`);
  const ua = xpIn(AT('arrow', 10.6), t, 0.7);
  if (ua > 0) p.push(xpArrow([[150, 880], [142, 760], [140, 640], [150, 585], [168, 572]], ua, {w: 5}));
  const sheetG = `<g transform="translate(0,${f1(sy)})" opacity="${f1(sheet)}">${p.join('')}</g>`;
  scr.push(xpOp(xpIn(AT('line', 0.8) + 0.4, t), tapeS(DIV - 64, 96, '1880', 40, -2, 1, 12)));
  if (t > AT('who', 6.9)) scr.push(xpOp(xpIn(AT('who', 6.9), t), `<g>${tag(1010, 905, 'WHO DECIDED?', 1)}${tag(1010, 960, 'NATIVE-BORN PROTESTANT AMERICANS', 1)}</g>` + xpArrow([[990, 872], [988, 800], [988, 712]], xpIn(AT('who', 6.9) + 0.3, t, 0.5), {w: 5})));
  if (t > AT('kpen', 10.0)) scr.push(xpOp(xpIn(AT('kpen', 10.0), t), penS(440, 975, 'the Kellys, Irish', 22, -3)));
  if (t > AT('except', 11.0)) scr.push(xpOp(xpIn(AT('except', 11.0), t), penS(205, 572, 'except the Irish: Catholic', 22, -2, XP.teal)));
  return xpFrame(t, s.join('') + sheetG, scr.join(''));
}

/* ================= 5. ep3_decades (ch 5): immigrants per decade, then 1884's 1 in 50 ================= */
const XP_DEC = [['1870s', 2.8], ['1880s', 5.2], ['1890s', 3.7], ['1900s', 8.8]];
function renderDecades(t) {
  const s = [xpBoard()], scr = [], BASE = 880, PER = 58, BW = 160;
  s.push(xpOp(xpIn(0.6, t), `<rect x="140" y="${BASE}" width="830" height="4" fill="${XP.pale}"/>`));
  XP_DEC.forEach(([lab, v], i) => {
    const t0 = 1.0 + i * 1.1, g = smooth(t0, t0 + 0.8, t), x = 170 + i * 210, h = v * PER * g, hi = i === 1;
    if (g > 0) s.push(`<rect x="${x}" y="${f1(BASE - h)}" width="${BW}" height="${f1(h)}" fill="${hi ? XP.teal : XP.mute2}" opacity="${hi ? 0.9 : 1}"/><rect x="${x}" y="${f1(BASE - h)}" width="${BW}" height="5" fill="${XP.teal}"/>`);
    scr.push(xpOp(xpIn(t0 - 0.2, t), xpMono(x + BW / 2, BASE + 52, lab, 32, XP.cream, 'middle')));
    scr.push(xpOp(xpIn(t0 + 0.7, t, 0.3), xpAbril(x + BW / 2, BASE - v * PER - 22, `${v} M`, 56, XP.cream, 'middle')));
  });
  scr.push(xpOp(xpIn(0.2, t), tapeS(130, 84, 'IMMIGRANTS PER DECADE', 50, -2, 1, 41)));
  scr.push(tag(150, 1000, 'U.S. ARRIVALS · DHS YEARBOOK, TABLE 1', xpIn(1.0, t)));
  // 1884: one of the 1880s, then the picture graph
  const u84 = xpIn(5.6, t);
  if (u84 > 0) scr.push(tag(398, 760, '1884', u84) + xpArrow([[492, 780], [990, 780], [1088, 650]], xpIn(5.9, t, 0.6), {w: 6}));
  scr.push(xpOp(xpIn(6.4, t), xpAbril(1100, 230, '1 in 50', 110, XP.cream)));
  scr.push(tag(1110, 305, '1884 ARRIVALS', xpIn(6.6, t)));
  for (let i = 0; i < 50; i++) {
    const c = i % 10, r = Math.floor(i / 10), u = xpIn(6.8 + i * 0.03, t, 0.25);
    if (u <= 0) continue;
    const x = 1130 + c * 66, y = 440 + r * 105, gold = i === 23 && t > 8.8;
    s.push(xpOp(u, xpPerson(x, y, 84, gold ? XP.gold : XP.mute2, {skirt: i % 3 === 1})));
    if (i === 23 && t > 8.8) s.push(`<ellipse cx="${x}" cy="${y - 42}" rx="40" ry="56" fill="none" stroke="${XP.teal}" stroke-width="5" opacity="${f1(xpIn(8.8, t))}"/>`);
  }
  scr.push(tag(1110, 960, 'ABOUT 11,000 OF 500,000+ WERE JEWISH', xpIn(9.3, t)));
  return xpFrame(t, s.join(''), scr.join(''));
}

/* ================= 6. ep3_piecework (ch 7): the contracting chain, and Riis's numbers ================= */
function xpWorker(x, y, h, kind, t) { // a gold picture-graph worker with the tool of the job
  const p = xpPerson(x, y, h, XP.gold, {skirt: kind === 'finisher' || kind === 'machine', kid: kind === 'thread'});
  switch (kind) {
    case 'presser': return p + `<rect x="${x + 6}" y="${y - h * 0.5}" width="${h * 0.62}" height="7" fill="${XP.ink}"/>` + xpIron(x + h * 0.36 + 10 * Math.sin(t * 4), y - h * 0.5, 0.75, XP.ink);
    case 'machine': return p + `<g transform="translate(${x + h * 0.3},${y - h * 0.42})" fill="${XP.ink}"><rect x="0" y="0" width="${h * 0.42}" height="7"/><path d="M${h * 0.04},0 l0,-${h * 0.16} l${h * 0.3},0 l0,${h * 0.06} l-${h * 0.06},0 l0,${h * 0.1} Z"/><rect x="${h * 0.18}" y="7" width="6" height="${h * 0.42}"/><circle cx="${h * 0.32}" cy="${h * 0.3}" r="${h * 0.1}" fill="none" stroke="${XP.ink}" stroke-width="4"/></g>`;
    case 'finisher': { const a = Math.sin(t * 3) * 10; return p + `<line x1="${x + h * 0.2}" y1="${y - h * 0.62}" x2="${x + h * 0.36}" y2="${y - h * 0.72 + a}" stroke="${XP.ink}" stroke-width="3"/><rect x="${x + h * 0.1}" y="${y - h * 0.6}" width="${h * 0.34}" height="${h * 0.12}" fill="${XP.cream}" stroke="${XP.ink}" stroke-width="2"/>`; }
    case 'thread': return p + `<path d="M${x + h * 0.2},${y - h * 0.5} q${h * 0.2},${h * 0.1 + 6 * Math.sin(t * 5)} ${h * 0.36},-${h * 0.02}" fill="none" stroke="${XP.cream}" stroke-width="3"/>`;
  }
  return p;
}
function renderPiecework(t) {
  const s = [xpBoard()], scr = [];
  const panel = (x, y, w, h, u, fill = XP.panel2) => xpOp(u, `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${XP.teal}" stroke-width="4"/>`);
  // 1. the big company: a loft building, a cutting table, a stack of cut pieces
  const u1 = xpIn(0.5, t);
  s.push(panel(130, 200, 400, 270, u1, XP.panel));
  s.push(xpOp(u1, `<g fill="#2B4744"><rect x="160" y="250" width="150" height="200"/>${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${176 + c * 44}" y="${270 + r * 56}" width="28" height="34" fill="${XP.bg}" opacity="0.7"/>`).join('')).join('')}</g>` +
    `<rect x="330" y="380" width="180" height="12" fill="${XP.pale}"/><rect x="342" y="392" width="8" height="58" fill="${XP.pale}"/><rect x="490" y="392" width="8" height="58" fill="${XP.pale}"/>` +
    `<g transform="translate(372,350)"><rect x="0" y="0" width="100" height="30" fill="#C9BFA6" stroke="#111" stroke-width="2"/><path d="M8,30 l14,-30 M40,30 l14,-30 M72,30 l14,-30" stroke="#5B5240" stroke-width="2"/></g>` +
    `<g transform="translate(440,322) rotate(${f1(-10 + 10 * Math.sin(t * 5))})" stroke="${XP.cream}" stroke-width="4" fill="none"><circle cx="-14" cy="0" r="7"/><circle cx="-14" cy="18" r="7"/><path d="M-8,4 L24,14 M-8,14 L24,4"/></g>`));
  // 2. the contractor (ink), a bundle of cut pieces on his shoulder
  const u2 = xpIn(2.6, t), walk = Math.sin(t * 6);
  s.push(panel(700, 200, 380, 270, u2));
  if (u2 > 0) {
    const fo = {x: 880, y: 452, h: 196, d: 1, kind: 'man', hat: 'bowler', coat: 'sack', fill: XP.ink, det: 0, an: {...walkAn(t * 0.9), fArm: [28, -40]}};
    const g = E3K.hand(fo, 'f');
    s.push(xpOp(u2, MAT.shadow(880, 452, 70, 0.4) + figure(fo) + xpBundle(g.x - 6, g.y + 4, 1.15) + xpBundle(g.x - 34, g.y + 30, 0.9, '#B6AC93')));
  }
  // 3. the family's room: the four jobs, gold
  const u3 = xpIn(4.6, t);
  s.push(panel(1250, 200, 540, 270, u3));
  [['presser', 1300, 'PRESSER'], ['machine', 1430, 'MACHINE'], ['finisher', 1565, 'FINISHER'], ['thread', 1700, 'THREAD|PULLER']].forEach(([k, x, lab], i) => {
    const u = xpIn(4.9 + i * 0.35, t, 0.35); if (u <= 0) return;
    s.push(xpOp(u, xpWorker(x - 20, 400, k === 'thread' ? 120 : 160, k, t)));
    lab.split('|').forEach((ln, j) => scr.push(xpOp(u, xpMono(x + 10, 436 + j * 27 - (lab.includes('|') ? 12 : 0), ln, 20, XP.ink, 'middle', 1))));
  });
  // arrows: company -> contractor -> room, and the finished garments back
  s.push(xpArrow([[540, 335], [690, 335]], xpIn(2.2, t, 0.5)));
  s.push(xpArrow([[1090, 335], [1240, 335]], xpIn(4.2, t, 0.5)));
  const back = xpCurve([1520, 482], [470, 482], 250, 60), ub = xpIn(6.6, t, 1.4);
  s.push(xpArrow(back, ub, {w: 6}));
  if (ub > 0) for (let j = 0; j < 3; j++) { const u = ((t - 6.6) * 0.22 + j / 3) % 1; if (t > 7.0) { const p = xpAt(back, u); s.push(xpOp(Math.min(1, (t - 7.0) * 2) * Math.sin(Math.PI * u), xpGarment(p[0], p[1], 0.85))); } }
  // coins from the contractor to the family, paid by the piece
  const up = xpIn(5.8, t);
  if (up > 0) for (let j = 0; j < 3; j++) { const u = ((t - 5.8) * 0.5 + j / 3) % 1; s.push(xpOp(up * Math.sin(Math.PI * u), xpCoin(1100 + 130 * u, 300 - 30 * Math.sin(Math.PI * u), 0.8))); }
  scr.push(tag(150, 170, 'BIG COMPANY', xpIn(0.5, t)), tag(720, 170, 'CONTRACTOR', xpIn(2.6, t)), tag(1270, 170, "THE FAMILY'S ROOM", xpIn(4.6, t)));
  scr.push(xpOp(xpIn(1.0, t), penS(150, 535, 'cuts the cloth', 24, -3)));
  scr.push(xpOp(xpIn(3.0, t), penS(720, 535, 'carries the bundles', 24, -3)));
  scr.push(tag(1000, 105, 'PAID BY THE PIECE', xpIn(5.8, t)));
  scr.push(tag(780, 676, 'FINISHED GARMENTS', xpIn(7.2, t)));
  // the vocab cards, then Riis's numbers
  scr.push(card(130, 720, 'Contractor', 'A middleman who took cut cloth|from a clothing company and|paid others to sew it.', '', xpWin(3.2, 9.0, t)));
  scr.push(card(990, 720, 'Sweatshop', 'A small, crowded workshop, often|in a tenement room: long hours,|low pay.', '', xpWin(5.2, 9.0, t)));
  const ur = xpIn(9.3, t, 0.5);
  if (ur > 0) {
    const RX = 330, RY = 712;
    scr.push(xpOp(ur, xpPaper(RX, RY, 1260, 290, -1) + `<g transform="rotate(-1, ${RX}, ${RY})">` +
      xpMono(RX + 40, RY + 50, "WHAT A REPORTER FOUND IN ONE SHOP", 22, '#5B5240', 'start', 2) +
      xpOp(xpIn(9.6, t), xpInter(RX + 40, RY + 120, 'knee pants: 70¢ a dozen', 46, XP.ink, 800)) +
      xpOp(xpIn(10.5, t), xpInter(RX + 40, RY + 186, 'beginners: $2 to $5 a week', 46, XP.ink, 800)) +
      xpOp(xpIn(11.4, t), xpInter(RX + 40, RY + 252, 'sunrise to 9 p.m.', 46, XP.ink, 800)) + `</g>`));
    scr.push(tag(1220, 958, 'JACOB RIIS, 1890', xpIn(11.6, t)));
  }
  return xpFrame(t, s.join(''), scr.join(''));
}

/* ================= 7. ep3_laws (ch 8): walls and welcome, 1882 to 1886 ================= */
// Walls above the line (ink cards, orange); welcome below (teal). Years on a linear axis, 290 px a year.
const XP_YX = (yr) => 170 + (yr - 1882) * 290;
const XP_LAWS = [ // [up?, year label, x of the event, card x, card y, title, lines, appear]
  [1, '1882', XP_YX(1882.35), 190, 170, 'CHINESE EXCLUSION ACT', ['first major law to keep out', 'a group by nationality'], 1.4],
  [1, '1882', XP_YX(1882.6), 190, 340, 'HEAD TAX + "PUBLIC CHARGE"', ['50¢ on each arrival; anyone too', 'poor to support themselves', 'turned away'], 2.5],
  [0, '1883', XP_YX(1883.84), 640, 622, '"THE NEW COLOSSUS"', ['Emma Lazarus: "Give me', 'your tired, your poor ..."'], 3.6],
  [1, '1885', XP_YX(1885.15), 1060, 370, 'CONTRACT LABOR BAN', ['no bringing in workers', 'under contract to an employer'], 4.7],
  [0, '1885 TO 1886', XP_YX(1885.6), 1000, 790, 'PEDESTAL FUND', ['ordinary people pay for', "the Statue's base"], 5.8],
  [0, '1886', XP_YX(1886.82), 1330, 622, 'STATUE DEDICATED', ['October 28, 1886'], 6.9],
];
function renderLaws(t) {
  const s = [xpBoard()], scr = [], AX = 560;
  const ua = xpIn(0.4, t, 1.0);
  s.push(xpArrow([[130, AX], [1790, AX]], ua, {col: XP.cream, w: 5}));
  for (let yr = 1882; yr <= 1887; yr++) { const u = xpIn(0.5 + (yr - 1882) * 0.12, t); s.push(xpOp(u, `<rect x="${XP_YX(yr) - 2}" y="${AX - 14}" width="4" height="28" fill="${XP.cream}"/>`)); scr.push(xpOp(u, xpMono(XP_YX(yr), AX + 50, String(yr), 26, XP.pale, 'middle'))); }
  // the pedestal fund's span on the line
  const up = xpIn(5.8, t);
  if (up > 0) s.push(xpOp(up, `<rect x="${XP_YX(1885.2)}" y="${AX - 7}" width="${XP_YX(1886.4) - XP_YX(1885.2)}" height="14" rx="7" fill="${XP.teal}" stroke="#111" stroke-width="2"/>`));
  for (const [upw, yl, ex, cx, cy, title, lines, t0] of XP_LAWS) {
    const u = xpIn(t0, t, 0.5); if (u <= 0) continue;
    const w = 460, h = 116 + (lines.length - 1) * 30, col = upw ? XP.orange : XP.teal, dy = (upw ? -1 : 1) * 20 * (1 - u);
    // leader from the event on the line to the card
    const lx = Math.max(cx + 16, Math.min(cx + w - 16, ex)), ly = upw ? cy + h : cy;
    s.push(xpOp(u, `<polyline points="${pts([[ex, AX + (upw ? -10 : 10)], [ex, upw ? AX - 40 : AX + 40], [lx, ly + (upw ? 14 : -14)], [lx, ly]])}" fill="none" stroke="${col}" stroke-width="3"/><circle cx="${ex}" cy="${AX}" r="9" fill="${col}" stroke="#111" stroke-width="3"/>`));
    let c = `<rect x="${cx + 6}" y="${cy + 10}" width="${w}" height="${h}" fill="#000" opacity="0.5" filter="url(#soft)"/><rect x="${cx}" y="${cy}" width="${w}" height="${h}" fill="${upw ? XP.ink : '#0E2524'}" stroke="${col}" stroke-width="3"/>`;
    if (upw) c += xpTornH(cx, cy - 8, w, 14, 3);
    c += xpMono(cx + 20, cy + 32, yl, 22, col, 'start', 2) + xpInter(cx + 20, cy + 64, title, 26, upw ? XP.orange : XP.teal, 800) +
      lines.map((ln, j) => xpInter(cx + 20, cy + 96 + j * 30, ln, 24, XP.cream, 600)).join('');
    scr.push(xpOp(u, `<g transform="translate(0,${f1(dy)})">${c}</g>`));
  }
  scr.push(xpOp(xpIn(0.2, t), tapeS(130, 84, 'WALLS AND WELCOME', 48, -2, 1, 52)));
  scr.push(xpOp(xpIn(1.6, t), penS(1520, 250, 'walls', 40, -4)));
  scr.push(xpOp(xpIn(3.8, t), penS(210, 800, 'welcome', 40, -4, XP.teal)));
  // then the word for it: the timeline steps back, the card lands
  const un = xpIn(10.8, t, 0.6), back = `<g opacity="${f1((1 - 0.78 * un) * 100) / 100}">${s.join('')}${scr.join('')}</g>`;
  return xpFrame(t, back, un > 0 ? card(560, 380, 'Nativism', 'Favoring people born in a country|over immigrants, often with fear|or anger toward newcomers.', '', un) : '');
}

/* ================= 8. ep3_pedestal (ch 8): who paid for the pedestal ================= */
function renderPedestal(t) {
  const s = [xpBoard()], scr = [];
  for (let i = 0; i < 100; i++) {
    const c = i % 10, r = Math.floor(i / 10), u = xpIn(1.0 + (r * 10 + c) * 0.04, t, 0.25);
    if (u <= 0) continue;
    s.push(xpOp(u, xpPerson(1000 + c * 80, 196 + r * 86, 70, i % 7 === 3 ? XP.pale : '#7FA39B', {skirt: (i * 7) % 3 === 0, kid: i % 11 === 5})));
  }
  // a stack of dollar coins growing on the left
  const ucn = xpIn(5.8, t, 0.6);
  if (ucn > 0) for (let j = 0; j < 5; j++) if (t > 5.8 + j * 0.12) s.push(xpCoin(200 + j * 46, 830, 1.3));
  scr.push(xpOp(xpIn(0.2, t), tapeS(130, 84, 'THE PEDESTAL FUND', 50, -2, 1, 61)));
  scr.push(xpOp(xpIn(1.0, t), xpAbril(130, 370, '100,000+', 140, XP.cream)));
  scr.push(xpOp(xpIn(1.6, t), xpAbril(136, 478, 'PEOPLE CHIPPED IN', 54, XP.teal)));
  scr.push(tag(146, 565, '1885', xpIn(2.2, t)));
  scr.push(xpOp(xpIn(5.4, t), penS(140, 720, 'most gave $1 or less', 34, -3)));
  scr.push(tag(146, 1000, 'EACH FIGURE = 1,000 PEOPLE', xpIn(2.8, t)));
  return xpFrame(t, s.join(''), scr.join(''));
}

/* ================= 9. ep3_tenement_plan (ch 6): one floor, seen from above ================= */
// Schematic, after the 1879 "dumbbell" plans: four flats, two to the street and two to the yard, three rooms each in a row; only the
// end rooms get real windows; the hall in the middle holds the stairs and, here, the floor's one sink. Not to exact scale.
function renderTenementPlan(t) {
  const s = [xpBoard()], scr = [];
  const X0 = 260, X1 = 1660, Y0 = 300, Y1 = 700, YM = 500, NA = 880, NB = 1040, ND = 50;
  const outline = [[X0, Y0], [NA, Y0], [NA, Y0 + ND], [NB, Y0 + ND], [NB, Y0], [X1, Y0], [X1, Y1], [NB, Y1], [NB, Y1 - ND], [NA, Y1 - ND], [NA, Y1], [X0, Y1], [X0, Y0]];
  // rooms: [x0, x1, y0, y1, lit?]
  const rooms = [];
  for (const [ya, yb] of [[Y0, YM], [YM, Y1]]) {
    rooms.push([X0, 500, ya, yb, 1], [500, 690, ya, yb, 0], [690, NA, ya, yb, 0]);
    rooms.push([NB, 1230, ya, yb, 0], [1230, 1420, ya, yb, 0], [1420, X1, ya, yb, 1]);
  }
  const ur = xpIn(1.6, t, 0.8), ud = xpIn(2.8, t, 0.6);
  rooms.forEach(([a, b, c, d, lit]) => { if (ur > 0) s.push(xpOp(ur, `<rect x="${a}" y="${c}" width="${b - a}" height="${d - c}" fill="${lit ? '#4E726C' : (ud > 0 ? `rgb(${Math.round(78 - 54 * ud)},${Math.round(114 - 76 * ud)},${Math.round(108 - 70 * ud)})` : '#4E726C')}"/>`)); });
  // the hall: stairs and the one sink
  const uh = xpIn(4.0, t);
  if (ur > 0) s.push(xpOp(ur, `<rect x="${NA}" y="${Y0 + ND}" width="${NB - NA}" height="${Y1 - Y0 - 2 * ND}" fill="#2B4744"/>`));
  if (uh > 0) s.push(xpOp(uh, [...Array(9)].map((_, i) => `<rect x="${NA + 20}" y="${Y0 + ND + 20 + i * 16}" width="70" height="3" fill="${XP.pale}"/>`).join('') + `<rect x="${NA + 18}" y="${Y0 + ND + 18}" width="74" height="${9 * 16}" fill="none" stroke="${XP.pale}" stroke-width="2"/>` +
    xpMono(NA + 55, Y0 + ND + 196, 'STAIRS', 20, XP.pale, 'middle', 1)));
  const us = xpIn(4.6, t);
  if (us > 0) s.push(xpOp(us, `<rect x="${NA + 100}" y="${Y1 - ND - 74}" width="50" height="60" rx="8" fill="${XP.cream}" stroke="#111" stroke-width="3"/><ellipse cx="${NA + 125}" cy="${Y1 - ND - 44}" rx="16" ry="20" fill="#2B4744"/><circle cx="${NA + 125}" cy="${Y1 - ND - 66}" r="5" fill="#111"/>`));
  // walls: the outline draws on, then the partitions; doors are gaps
  const uo = xpIn(0.6, t, 1.4);
  s.push(`<polyline points="${pts(xpPartial(outline, uo))}" fill="none" stroke="${XP.cream}" stroke-width="8" stroke-linejoin="miter"/>`);
  if (ur > 0) {
    const w = [];
    w.push([[X0, YM], [NA, YM]], [[NB, YM], [X1, YM]]);
    for (const x of [500, 690, 1230, 1420]) w.push([[x, Y0], [x, Y0 + 70]], [[x, Y0 + 130], [x, YM + 70]], [[x, YM + 130], [x, Y1]]);
    w.push([[NA, Y0 + ND], [NA, Y0 + 150]], [[NA, Y0 + 210], [NA, Y1 - 210]], [[NA, Y1 - 150], [NA, Y1 - ND]], [[NB, Y0 + ND], [NB, Y0 + 150]], [[NB, Y0 + 210], [NB, Y1 - 210]], [[NB, Y1 - 150], [NB, Y1 - ND]]);
    s.push(xpOp(ur, w.map((a) => line(a, XP.cream, 5)).join('')));
    // windows: street and yard ends, small airshaft windows
    s.push(xpOp(ur, [Y0 + 50, Y0 + 130, YM + 50, YM + 130].map((y) => `<rect x="${X0 - 5}" y="${y}" width="10" height="44" fill="${XP.teal}"/><rect x="${X1 - 5}" y="${y}" width="10" height="44" fill="${XP.teal}"/>`).join('')));
  }
  // the Rabinowitzes' flat (front, lower): four sleep in one room, a boarder in the kitchen
  const uR = xpIn(6.2, t, 0.5);
  if (uR > 0) {
    s.push(xpOp(uR, `<rect x="${X0 + 6}" y="${YM + 6}" width="${NA - X0 - 12}" height="${Y1 - YM - 12}" fill="none" stroke="${XP.gold}" stroke-width="6" stroke-dasharray="18 10"/>`));
    [[730, 560], [800, 560], [730, 640], [800, 640]].forEach(([x, y], i) => { const u = xpIn(6.6 + i * 0.15, t, 0.3); if (u > 0) s.push(xpOp(u, `<circle cx="${x}" cy="${y}" r="${i < 2 ? 22 : 16}" fill="${XP.gold}" stroke="#111" stroke-width="3"/>`)); });
    const ub = xpIn(7.3, t, 0.3);
    if (ub > 0) s.push(xpOp(ub, `<circle cx="595" cy="600" r="22" fill="${XP.pale}" stroke="#111" stroke-width="3"/>`));
  }
  scr.push(xpOp(xpIn(0.2, t), tapeS(130, 84, 'ONE TENEMENT FLOOR', 50, -2, 1, 71)));
  scr.push(tag(1420, 128, 'SEEN FROM ABOVE', xpIn(0.5, t)));
  scr.push(tag(106, 512, 'STREET', xpIn(1.2, t)), tag(1680, 512, 'YARD', xpIn(1.2, t)));
  if (uh > 0) scr.push(tag(700, 240, 'ONE SINK FOR THE WHOLE FLOOR', xpIn(4.8, t)) + xpArrow([[1010, 262], [1010, 400], [1006, 560]], xpIn(5.0, t, 0.6), {w: 5}));
  scr.push(xpOp(xpIn(3.3, t), penS(1080, 800, 'inside rooms: no windows', 26, -3)) + xpArrow([[1300, 760], [1330, 700], [1320, 640]], xpIn(3.6, t, 0.5), {w: 4}));
  [['FLAT 1', 380, Y0 + 110], ['FLAT 2', 380, YM + 110], ['FLAT 3', 1540, Y0 + 110], ['FLAT 4', 1540, YM + 110]].forEach(([l, x, y]) => scr.push(xpOp(xpIn(2.2, t), xpMono(x, y, l, 22, XP.cream, 'middle', 2))));
  if (uR > 0) scr.push(xpOp(xpIn(7.4, t), xpMono(595, 652, 'BOARDER', 20, XP.cream, 'middle', 1)), tag(270, 790, 'THE RABINOWITZES: 4 PEOPLE + A BOARDER', xpIn(7.6, t)));
  return xpFrame(t, s.join(''), scr.join(''));
}

if (typeof window !== 'undefined') Object.assign(window, {renderPaleMap, renderChain, renderStatCG, renderOldNew, renderDecades, renderPiecework, renderLaws, renderPedestal, renderTenementPlan});
Object.assign(CLIPS, {
  ep3_pale_map: {sec: 14, render: (t) => renderPaleMap(t)},
  ep3_chain: {sec: 15, render: (t) => renderChain(t)},
  ep3_stat_cg: {sec: 10.5, render: (t) => renderStatCG(t)},
  ep3_old_new: {sec: 15, render: (t) => renderOldNew(t)},
  ep3_decades: {sec: 13.5, render: (t) => renderDecades(t)},
  ep3_piecework: {sec: 15, render: (t) => renderPiecework(t)},
  ep3_laws: {sec: 15, render: (t) => renderLaws(t)},
  ep3_pedestal: {sec: 11, render: (t) => renderPedestal(t)},
  ep3_tenement_plan: {sec: 11.5, render: (t) => renderTenementPlan(t)},
});
