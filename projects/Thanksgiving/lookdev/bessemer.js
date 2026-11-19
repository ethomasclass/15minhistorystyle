// "Bessemer steel": shot 11 of Episode 1. A steel mill at night. A crane ladle pours melted iron into a converter lying on its
// side; the converter swings upright and the blast starts (a roar of flame and sparks); the camera pushes in and the shell turns to
// an x-ray: air pumped in through the hollow trunnion and up through holes in the bottom, bubbling through the iron, burning the
// carbon out (each dark speck flares and is gone). A clock counts minutes, not a day. The x-ray closes, the converter tips and
// pours steel into a ladle, and the vocab card lands.
// Built with rig.js and explainers.js (load them first). Teal explains; coral is kept for the Kellys (none here).

const BS = {px: 960, py: 560, ground: 820, mouth: 190, belly: 112};

// the converter, upright, in local coordinates around its trunnions (0,0): a pear, nose up
function bsShell(k = 0) { // k: inset (the lining's inner face)
  const r = BS.belly - k, n = 46 - k * 0.6, top = -BS.mouth + k * 0.4, bot = 150 - k;
  return `M${-n},${top} C${-n - 10},${-120} ${-r},${-70} ${-r},${10} C${-r},${90} ${-r + 30},${bot} 0,${bot} C${r - 30},${bot} ${r},${90} ${r},${10} C${r},${-70} ${n + 10},${-120} ${n},${top} Z`;
}
const bsTilt = (t) => t < 3.4 ? -78 : t < 5 ? -78 * (1 - ease((t - 3.4) / 1.6)) : t < 12.8 ? 0 : -100 * ease(clamp01((t - 12.8) / 1.4));
const bsBlow = (t) => smooth(4.6, 5.4, t) * (1 - smooth(12.3, 12.9, t));
const bsXray = (t) => smooth(6.4, 7.3, t) * (1 - smooth(12.0, 12.7, t));
const bsRot = (a, [x, y]) => { const r = a * Math.PI / 180; return [BS.px + x * Math.cos(r) - y * Math.sin(r), BS.py + x * Math.sin(r) + y * Math.cos(r)]; };

// the carbon in the iron: dark specks that each burn out at their own moment during the blow
const BS_C = (() => { const r = rng(1856), out = []; while (out.length < 46) { const x = (r() - 0.5) * 190, y = 20 + r() * 120;
  if (Math.abs(x) < BS.belly - 30 - (y > 100 ? (y - 100) * 0.9 : 0)) out.push({x, y, tb: 7.6 + r() * 4.2, ph: r()}); } return out; })();
const bsCarbonLeft = (t) => BS_C.filter((d) => t < d.tb).length / BS_C.length;

function bsShed(t) { // the mill shed: brick back wall, iron columns, roof trusses, high windows, the crane girder
  const s = [], G = BS.ground, top = 120;
  s.push(MAT.brick(-700, top, 3400, G - top, {base: '#142625', seed: 1856, vary: 0.32, soot: 'top', bw: 46, bh: 18}));
  for (let x = -560; x < 2600; x += 360) s.push(`<rect x="${x}" y="${top + 60}" width="120" height="170" rx="60" fill="#1C3332"/><rect x="${x + 8}" y="${top + 68}" width="104" height="162" rx="52" fill="url(#exsky)" opacity="0.8"/><rect x="${x + 58}" y="${top + 68}" width="4" height="162" fill="#0B1211"/><rect x="${x + 8}" y="${top + 150}" width="104" height="4" fill="#0B1211"/>`);
  for (let x = -460; x < 2600; x += 720) s.push(MAT.iron(x, top, 40, G - top, {base: '#0B1615', seams: 80, rivet: 4}));
  let truss = ''; for (let x = -700; x < 2700; x += 120) truss += `M${x},${top} L${x + 60},${top - 70} L${x + 120},${top}`;
  s.push(`<rect x="-700" y="${top - 80}" width="3400" height="12" fill="#070B0B"/><rect x="-700" y="${top - 6}" width="3400" height="12" fill="#070B0B"/><path d="${truss}" stroke="#070B0B" stroke-width="6" fill="none"/><rect x="-700" y="-900" width="3400" height="${top - 80 + 900}" fill="#050808"/>`);
  s.push(MAT.iron(-700, top + 6, 3400, 34, {base: '#0B1615', seams: 140, rivet: 4})); // the crane girder
  // a second converter at the back of the shed, blowing on its own
  s.push(`<g opacity="0.7">${bsBack(1600, 600, t)}</g>`);
  s.push(MAT.planks(-700, G, 3400, 16, {base: '#101B1A', seed: 1857, size: 80}));
  return s.join('');
}
function bsBack(x, y, t) {
  const s = [], r = rng(77);
  s.push(`<circle cx="${x}" cy="${y - 140}" r="160" fill="url(#exglow)" opacity="${f1(0.4 + 0.08 * Math.sin(t * 9))}"/>`);
  s.push(`<g transform="translate(${x},${y}) scale(0.55)"><path d="${bsShell()}" fill="#0F1C1B"/><rect x="-140" y="-8" width="280" height="16" fill="#0F1C1B"/><rect x="-150" y="0" width="22" height="${(BS.ground - y) / 0.55}" fill="#0F1C1B"/><rect x="128" y="0" width="22" height="${(BS.ground - y) / 0.55}" fill="#0F1C1B"/></g>`);
  for (let i = 0; i < 26; i++) { const u = (t * 0.8 + r()) % 1, ang = -Math.PI / 2 + (r() - 0.5) * 0.9, sp = 120 + r() * 90;
    s.push(`<circle cx="${f1(x + Math.cos(ang) * sp * u)}" cy="${f1(y - 104 + Math.sin(ang) * sp * u + 150 * u * u)}" r="${f1(2 * (1 - u) + 0.6)}" fill="${EX.glow}" opacity="${f1(0.8 * (1 - u))}"/>`); }
  return s.join('');
}

function bsCrane(t) { // the crane ladle: it pours the iron in, then rolls away along the girder
  const s = [], away = ease(clamp01((t - 3.0) / 2.2)), x = 690 - away * 900, hy = 330, tip = 38 * smooth(0.2, 0.9, t) * (1 - smooth(2.7, 3.2, t));
  s.push(`<rect x="${x - 50}" y="160" width="100" height="26" fill="#070B0B"/><path d="M${x - 30},186 L${x - 44},${hy - 50} M${x + 30},186 L${x + 44},${hy - 50}" stroke="#070B0B" stroke-width="5"/>`);
  s.push(`<g transform="rotate(${f1(tip)}, ${x}, ${hy})"><path d="M${x - 62},${hy - 52} L${x + 62},${hy - 52} L${x + 50},${hy + 46} L${x - 50},${hy + 46} Z" fill="#0B1211"/>` +
    `<path d="M${x - 66},${hy - 58} L${x + 72},${hy - 58} L${x + 72},${hy - 46} L${x - 66},${hy - 46} Z" fill="#070B0B"/><ellipse cx="${x}" cy="${hy - 52}" rx="58" ry="7" fill="${EX.glow}" opacity="${f1(0.55 * (1 - away))}"/></g>`);
  const pour = smooth(0.6, 1.0, t) * (1 - smooth(2.6, 3.0, t));
  if (pour > 0.02) { const lip = [x + 70, hy - 34], m = bsRot(-78, [0, -BS.mouth + 6]);
    const d = `M${f1(lip[0])},${f1(lip[1])} C${f1(lip[0] + 30)},${f1(lip[1] + 10)} ${f1(m[0] - 10)},${f1(m[1] - 80)} ${f1(m[0])},${f1(m[1])}`;
    s.push(`<path d="${d}" stroke="url(#exglow)" stroke-width="40" fill="none" opacity="${f1(0.6 * pour)}"/><path d="${d}" stroke="${EX.glow}" stroke-width="${f1(10 * pour)}" fill="none" stroke-linecap="round"/>`);
    s.push(bsSparks(m[0], m[1] - 10, t, 18, 140, 0.6 * pour, 21)); }
  return s.join('');
}
function bsSparks(x, y, t, n, sp0, op, seed, spread = 1.2, up = -Math.PI / 2) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const u = (t * (0.7 + r() * 0.5) + r()) % 1, ang = up + (r() - 0.5) * spread, sp = sp0 * (0.6 + r() * 0.8);
    const xx = x + Math.cos(ang) * sp * u, yy = y + Math.sin(ang) * sp * u + sp0 * 1.4 * u * u;
    s += `<path d="M${f1(xx)},${f1(yy)} l${f1(-Math.cos(ang) * 9)},${f1(-Math.sin(ang) * 9 + 6 * u)}" stroke="${EX.glow}" stroke-width="${f1(2.4 * (1 - u) + 0.8)}" stroke-linecap="round" opacity="${f1(op * (1 - u))}"/>`; }
  return s;
}

function bsConverter(t, z) {
  const s = [], a = bsTilt(t), blow = bsBlow(t), xr = bsXray(t), G = BS.ground, P = (p) => bsRot(a, p).map(f1).join(',');
  const m = bsRot(a, [0, -BS.mouth]);
  // glow on the floor and the wall, pulsing with the blow
  const pulse = 0.85 + 0.15 * Math.sin(t * 11) * Math.sin(t * 3.1);
  s.push(`<ellipse cx="${BS.px}" cy="${G + 4}" rx="${f1(420 + 160 * blow)}" ry="40" fill="${EX.glow}" opacity="${f1((0.05 + 0.1 * blow) * pulse)}"/>`);
  s.push(`<circle cx="${f1(m[0])}" cy="${f1(m[1] - 60 * blow)}" r="${f1(220 + 200 * blow)}" fill="url(#exglow)" opacity="${f1((0.35 + 0.55 * blow) * pulse)}"/>`);
  // the stands and the trunnion pins; the air pipe runs in through the near trunnion and down to the wind box
  s.push(MAT.iron(BS.px - 170, BS.py - 14, 40, G - BS.py + 14, {base: '#0B1615', seams: 60, rivet: 5}) + MAT.iron(BS.px + 130, BS.py - 14, 40, G - BS.py + 14, {base: '#0B1615', seams: 60, rivet: 5}));
  s.push(`<path d="M${BS.px + 170},${BS.py} L${BS.px + 260},${BS.py} L${BS.px + 260},${G}" stroke="#0B1615" stroke-width="26" fill="none"/>`);
  // the vessel itself
  const shell = bsShell(), inner = bsShell(20);
  s.push(`<g transform="translate(${BS.px},${BS.py}) rotate(${f1(a)})">`);
  s.push(`<defs><clipPath id="bsin"><path d="${inner}"/></clipPath><clipPath id="bsout"><path d="${shell}"/></clipPath></defs>`);
  s.push(`<g clip-path="url(#bsout)">${MAT.iron(-130, -200, 260, 380, {base: '#0A1312', seams: 34, rivet: 5})}</g>`);
  s.push(`<path d="${shell}" fill="none" stroke="#050808" stroke-width="6"/>`);
  s.push(`<rect x="-${BS.belly + 26}" y="-10" width="${2 * BS.belly + 52}" height="20" fill="#070B0B"/><circle cx="-${BS.belly + 34}" cy="0" r="18" fill="#070B0B"/><circle cx="${BS.belly + 34}" cy="0" r="18" fill="#070B0B"/>`); // the trunnion ring
  s.push(`<path d="M${BS.belly + 34},0 C${BS.belly + 60},40 ${BS.belly + 30},150 60,166 L-60,166 L-60,150 L60,150" stroke="#070B0B" stroke-width="16" fill="none"/>`); // the blast pipe to the wind box
  s.push(`<rect x="-66" y="148" width="132" height="24" rx="6" fill="#070B0B"/>`); // the wind box under the bottom
  s.push(`<ellipse cx="0" cy="${-BS.mouth}" rx="44" ry="8" fill="${EX.glow}" opacity="${f1(0.5 + 0.5 * blow)}"/>`);
  if (xr > 0.01) s.push(bsXrayBody(t, xr, shell, inner));
  s.push('</g>');
  // the blow: a tongue of flame and a fountain of sparks from the mouth
  if (blow > 0.02) {
    const fl = 1 + 0.18 * Math.sin(t * 17) + 0.1 * Math.sin(t * 29), fh = 230 * blow * fl, mx = m[0], my = m[1];
    s.push(`<path d="M${f1(mx - 40)},${f1(my)} C${f1(mx - 50)},${f1(my - fh * 0.5)} ${f1(mx - 8 + 12 * Math.sin(t * 7))},${f1(my - fh * 0.8)} ${f1(mx + 6 * Math.sin(t * 9))},${f1(my - fh)} C${f1(mx + 14)},${f1(my - fh * 0.75)} ${f1(mx + 52)},${f1(my - fh * 0.45)} ${f1(mx + 40)},${f1(my)} Z" fill="url(#bsflame)" opacity="${f1(0.95 * blow)}"/>`);
    s.push(bsSparks(mx, my - 20, t, 90, 300, blow, 1858, 1.6));
    s.push(MAT.smoke(mx, my - fh, t, {col: '5F857F', k: 1.6 * blow, n: 8, seed: 1859, rise: 260}));
  }
  // the pour at the end: steel into the ladle on its car
  const pour = smooth(13.9, 14.4, t);
  const lx = 690, ly = G - 92;
  s.push(`<rect x="${lx - 90}" y="${G - 24}" width="180" height="16" fill="#070B0B"/><circle cx="${lx - 60}" cy="${G - 6}" r="10" fill="#070B0B"/><circle cx="${lx + 60}" cy="${G - 6}" r="10" fill="#070B0B"/>`);
  s.push(MAT.iron(lx - 70, ly, 140, G - 24 - ly, {base: '#0B1211', rx: 10, seams: 26}) + `<ellipse cx="${lx}" cy="${ly}" rx="70" ry="9" fill="${EX.glow}" opacity="${f1(0.15 + 0.65 * pour)}"/>`);
  if (pour > 0.02) { const mm = bsRot(bsTilt(t), [0, -BS.mouth + 4]);
    const d = `M${f1(mm[0])},${f1(mm[1])} C${f1(mm[0] - 40)},${f1(mm[1] + 4)} ${f1(lx + 10)},${f1(ly - 60)} ${f1(lx + 6)},${f1(ly)}`;
    s.push(`<path d="${d}" stroke="url(#exglow)" stroke-width="46" fill="none" opacity="${f1(0.6 * pour)}"/><path d="${d}" stroke="${EX.glow}" stroke-width="${f1(12 * pour)}" fill="none" stroke-linecap="round"/>`);
    s.push(bsSparks(lx + 6, ly - 4, t, 26, 120, pour, 1860, 2.2), `<circle cx="${lx}" cy="${ly - 20}" r="150" fill="url(#exglow)" opacity="${f1(0.5 * pour)}"/>`); }
  // the men: one at the tilting lever, one shielding his face from the heat
  const L = lodFor(118 * z, 0.7), rim = {c: '#F4EFE6', dx: 0.012, dy: -0.004, a: L.rimA * (0.4 + 0.6 * Math.max(blow, pour))};
  s.push(figure({x: BS.px + 400, y: G, h: 118, d: -1, kind: 'man', hat: 'cap', coat: 'jacket', fill: '#0D0C09', rim: {...rim, dx: -0.012}, an: {...POSES.stand(t, 0.1), fArm: [150, 120], bArm: [130, 100], tilt: 8}}));
  s.push(`<path d="M${BS.px + 352},${G - 64} L${BS.px + 362 + 10 * smooth(3.4, 5, t) - 40 * smooth(12.8, 14.2, t)},${G - 196}" stroke="#070B0B" stroke-width="9" stroke-linecap="round"/><rect x="${BS.px + 326}" y="${G - 78}" width="50" height="78" fill="#070B0B"/>`); // the lever
  s.push(figure({x: BS.px - 470, y: G, h: 118, d: 1, kind: 'man', hat: 'cap', coat: 'jacket', fill: '#0D0C09', rim, an: {...POSES.stand(t, 0.4), fArm: [40 + 6 * Math.sin(t * 1.3), 20], bArm: [160, 130], tilt: -12, lean: -4}}));
  return s.join('');
}

// inside the converter, drawn in its local frame (upright when this shows)
function bsXrayBody(t, xr, shell, inner) {
  const s = [], surf = 18, blow = bsBlow(t);
  s.push(`<g opacity="${f1(xr)}"><path d="${shell}" fill="#0B1211"/>`);
  // the lining: firebrick, then the space inside
  s.push(`<g clip-path="url(#bsout)">${MAT.brick(-140, -210, 280, 400, {base: '#1A2B29', seed: 1861, bw: 26, bh: 12, vary: 0.3})}</g><path d="${inner}" fill="#081010"/>`);
  // the melted iron, its surface heaving with the blast
  let top = `M-120,${surf}`; for (let x = -120; x <= 120; x += 10) top += ` L${x},${f1(surf + 6 * Math.sin(x * 0.07 + t * 9) * blow + 3 * Math.sin(x * 0.19 - t * 13) * blow)}`;
  s.push(`<g clip-path="url(#bsin)"><path d="${top} L120,200 L-120,200 Z" fill="url(#bsiron)"/>`);
  // air coming up through the holes in the bottom (the tuyeres) and rising through the iron as bubbles
  for (const hx of [-48, -24, 0, 24, 48]) s.push(`<rect x="${hx - 3}" y="128" width="6" height="22" fill="${EX.teal}" opacity="0.8"/>`);
  const r = rng(1862);
  for (let i = 0; i < 70; i++) { const hx = [-48, -24, 0, 24, 48][i % 5], sp = 0.9 + r() * 0.6, u = (t * sp * 0.9 + r()) % 1, y = 128 - u * (128 - surf), x = hx + 14 * Math.sin(u * 9 + i) * u;
    const rr = 3 + 5 * u; if (blow < 0.05) continue;
    s.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="none" stroke="${EX.teal}" stroke-width="2.4" opacity="${f1(0.9 * blow * (u < 0.95 ? 1 : 0))}"/>`); }
  // the carbon: dark specks that flare as the air reaches them, and are gone
  for (const d of BS_C) { const k = t - d.tb, wob = 2 * Math.sin(t * 3 + d.ph * 9);
    if (k < 0) s.push(`<circle cx="${f1(d.x + wob)}" cy="${f1(d.y)}" r="6.5" fill="#0D0C09" stroke="${EX.teal}" stroke-width="1.6" opacity="0.95"/>`);
    else if (k < 0.5) { const q = k / 0.5; s.push(`<circle cx="${f1(d.x + wob)}" cy="${f1(d.y - 30 * q)}" r="${f1(6 + 18 * q)}" fill="${EX.cream}" opacity="${f1(0.9 * (1 - q))}"/>`); } }
  s.push('</g>');
  // the cut edge of the shell, outlined in teal
  s.push(`<path d="${shell}" fill="none" stroke="${EX.teal}" stroke-width="4"/><path d="${inner}" fill="none" stroke="${EX.teal}" stroke-width="2" stroke-dasharray="10 8" opacity="0.7"/>`);
  // the air's route: in through the trunnion, down the pipe, into the wind box
  if (blow > 0.05) s.push(`<path d="M${BS.belly + 34},0 C${BS.belly + 60},40 ${BS.belly + 30},150 60,166 L-40,166" stroke="${EX.teal}" stroke-width="5" fill="none" stroke-dasharray="14 12" stroke-dashoffset="${f1(-t * 90)}"/>`);
  s.push('</g>');
  return s.join('');
}

function bsClock(x, y, t, op) { // the minute clock: the hand sweeps about fifteen minutes (a blow took 10 to 20) during the blow
  if (op < 0.01) return '';
  const min = 15 * smooth(7.0, 12.2, t), ang = (min / 60) * TAU - Math.PI / 2, R = 92;
  let ticks = ''; for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, r0 = i % 5 ? R - 10 : R - 20; ticks += `M${f1(x + Math.cos(a) * r0)},${f1(y + Math.sin(a) * r0)} L${f1(x + Math.cos(a) * R)},${f1(y + Math.sin(a) * R)}`; }
  const arc = min > 0.05 ? `<path d="M${x},${y} L${x},${y - R + 4} A${R - 4},${R - 4} 0 ${min > 30 ? 1 : 0},1 ${f1(x + Math.cos(ang) * (R - 4))},${f1(y + Math.sin(ang) * (R - 4))} Z" fill="${EX.teal}" opacity="0.35"/>` : '';
  return `<g opacity="${f1(op)}"><circle cx="${x}" cy="${y}" r="${R + 10}" fill="rgba(13,12,9,0.86)"/><circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="${EX.cream}" stroke-width="3"/>${arc}<path d="${ticks}" stroke="${EX.cream}" stroke-width="2"/>` +
    `<path d="M${x},${y} L${f1(x + Math.cos(ang) * (R - 16))},${f1(y + Math.sin(ang) * (R - 16))}" stroke="${EX.cream}" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="7" fill="${EX.cream}"/>` +
    `<text x="${x}" y="${y + R + 56}" text-anchor="middle" font-family="Mono" font-size="28" letter-spacing="2" fill="${EX.cream}">${Math.round(min)} MIN</text></g>`;
}
function bsMeter(x, y, t, op) { // how much carbon is left in the iron
  if (op < 0.01) return '';
  const k = bsCarbonLeft(t), W = 420;
  return `<g opacity="${f1(op)}">${tag(x, y, 'CARBON LEFT IN THE IRON', 1)}<rect x="${x - 10}" y="${y + 22}" width="${W + 20}" height="54" fill="rgba(13,12,9,0.86)"/>` +
    `<rect x="${x}" y="${y + 32}" width="${W}" height="34" fill="none" stroke="${EX.cream}" stroke-width="2"/><rect x="${x + 3}" y="${y + 35}" width="${f1((W - 6) * Math.max(0.06, k))}" height="28" fill="${EX.teal}"/></g>`;
}

const BS_KEYS = [ // t, z, ux, uy
  [0, 1.0, 840, 520], [3.2, 1.05, 860, 520], [5.0, 1.08, 960, 480], [6.6, 1.55, 960, 470], [12.2, 1.6, 960, 470],
  [13.8, 1.0, 840, 540], [18, 0.96, 820, 540],
];
function bsCam(t) {
  let k = BS_KEYS.length - 2;
  for (let i = 0; i < BS_KEYS.length - 1; i++) if (t < BS_KEYS[i + 1][0]) { k = i; break; }
  const [t0, z0, x0, y0] = BS_KEYS[k], [t1, z1, x1, y1] = BS_KEYS[k + 1], u = ease(clamp01((t - t0) / (t1 - t0)));
  return {z: lerpLog(z0, z1, u), ux: x0 + (x1 - x0) * u, uy: y0 + (y1 - y0) * u};
}
function bsDefs(t) {
  return exDefs(t).replace('</defs>', `<linearGradient id="bsiron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFBEF"/><stop offset="0.35" stop-color="#F4EFE6"/><stop offset="1" stop-color="#C9C2A8"/></linearGradient>` +
    `<linearGradient id="bsflame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFFBEF" stop-opacity="1"/><stop offset="0.5" stop-color="#F4EFE6" stop-opacity="0.75"/><stop offset="1" stop-color="#A3BAB2" stop-opacity="0"/></linearGradient></defs>`);
}
function renderBessemer(t) {
  const c = cam2(bsCam(t)), world = [];
  world.push(layerAt(c, 1, `<rect x="-3000" y="${BS.ground}" width="9000" height="3000" fill="#0D0C09"/>` + bsShed(t) + bsCrane(t) + bsConverter(t, c.z)));
  const scr = [], xr = bsXray(t), fin = smooth(14.6, 15.4, t);
  scr.push(tag(40, 1040, 'A STEEL MILL · PENNSYLVANIA · 1870s', 1));
  if (t < 3.4) scr.push(tag(c.sx(690) - 150, c.sy(240), 'MELTED IRON', smooth(0.6, 1.0, t)), penS(1060, 230, 'iron is strong, but brittle', 32, -3));
  if (t > 4.4 && t < 6.6) scr.push(penS(1180, 240, 'then: blow air through it', 34, -3));
  if (t > 3.6 && t < 6.6) scr.push(tag(60, 120, 'THE BESSEMER CONVERTER · INVENTED IN 1856', smooth(3.6, 4.2, t)));
  if (xr > 0.01) {
    scr.push(tag(60, 120, 'X-RAY VIEW', xr));
    const lab = (lx, ly, wx, wy, txt, op) => { const X = c.sx(wx), Y = c.sy(wy); return `<path d="M${f1(lx + (lx < X ? txt.length * 19.4 + 14 : -14))},${f1(ly - 10)} L${f1(X)},${f1(Y)}" stroke="${EX.teal}" stroke-width="3" opacity="${f1(op)}"/><circle cx="${f1(X)}" cy="${f1(Y)}" r="6" fill="${EX.teal}" opacity="${f1(op)}"/>` + tag(lx, ly, txt, op); };
    scr.push(lab(140, 700, BS.px - 70, BS.py + 70, 'MELTED IRON', xr));
    scr.push(lab(170, 880, BS.px - 24, BS.py + 140, 'AIR BLASTED IN', xr * smooth(7.2, 7.8, t)));
    const d = BS_C[3]; scr.push(lab(160, 520, BS.px + d.x, BS.py + d.y, 'CARBON', xr * smooth(7.4, 8.0, t) * (t < d.tb ? 1 : 0.5)));
    scr.push(`<g opacity="${f1(xr)}">` + penS(1250, 330, 'the air burns', 34, -3, EX.orange) + penS(1290, 400, 'the carbon out', 34, -3, EX.orange) +
      (t > 9.4 ? penS(1300, 870, 'no fuel needed: the burning', 28, -3) + penS(1340, 930, 'makes its own heat', 28, -3) : '') + '</g>');
    scr.push(bsClock(1660, 590, t, xr * smooth(7.0, 7.4, t)), bsMeter(1270, 140, t, xr * smooth(7.6, 8.0, t)));
  }
  if (t > 12.6 && t < 15) { const o = smooth(12.6, 13.0, t) * (1 - smooth(14.6, 15, t));
    scr.push(tag(1180, 200, 'THE OLD WAY: A DAY OR MORE', o), tag(1180, 260, 'BESSEMER: 10 TO 20 MINUTES', o)); }
  if (t > 14.2) scr.push(penS(c.sx(690) - 150, c.sy(612), 'steel', 44, -4, EX.orange));
  scr.push(card(90, 130, 'Bessemer process', 'A way to make steel fast by blowing|air through melted iron to burn|out the extra carbon.', 'cheap steel, so cheap rails', fin));
  return frame(bsDefs(t), `<rect width="1920" height="1080" fill="#050808"/>`, world.join(''), scr.join(''), t);
}

Object.assign(CLIPS, {bessemer_xray: {sec: 18, render: (t) => renderBessemer(t)}});
if (typeof window !== 'undefined') Object.assign(window, {renderBessemer});
