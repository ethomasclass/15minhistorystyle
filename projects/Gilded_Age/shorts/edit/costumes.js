// Short s3: the drawn costume plates (1080x1920), from the costumes reported at the Vanderbilt ball, March 26, 1883
// (MCNY blog, from the New York Times and the Sun). Real guests, so there are NO faces: every head is a soft dark shape,
// turned away from us, lit only along one edge. The costume carries the colour against a dark room with a spotlight and grain.
//   costumePlate(name, T, t0, t1, opts) -> html     t0/t1: the shot, for the quick push-in; each plate has one small animated detail.
//   c_cat c_hornet c_devil c_duchess c_electric c_porcelain c_kings   (+ c_door: a lone guest at the lit door, for the hook)
// Silhouettes follow 1883 fancy dress: a fitted cuirass bodice, a narrow waist, a bustle and train behind (Worth's line),
// long gloves; the men in powdered wigs and breeches. Local figure units: origin at the waist, head top about -560, floor +880.

const CP = {f: (v) => (Math.round(v * 10) / 10).toString()};

/* ---------- the room ---------- */
// A dark panelled room (the lookdev ink and teal-slate), a cone of light from above, a pool on the floor, grain, a vignette.
function cpRoom(id, T, {spot = '#FFF3D6', spotA = 0.55, sx = 470, sy = 900, wall = '#101615', glow = 1} = {}) {
  let panels = '';
  for (let x = -40; x < 1120; x += 190) panels += `<rect x="${x}" y="260" width="150" height="1220" rx="6" fill="none" stroke="#1A2423" stroke-width="5"/><rect x="${x + 18}" y="300" width="114" height="520" fill="#0E1312"/>`;
  return `<defs>
    <radialGradient id="${id}spot" cx="${sx}" cy="${sy}" r="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${spot}" stop-opacity="${spotA * glow}"/><stop offset=".45" stop-color="${spot}" stop-opacity="${spotA * 0.35 * glow}"/><stop offset="1" stop-color="${spot}" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${spot}" stop-opacity="${0.22 * glow}"/><stop offset="1" stop-color="${spot}" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}pool" cx="${sx}" cy="1690" r="520" gradientTransform="translate(0 1690) scale(1 .22) translate(0 -1690)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${spot}" stop-opacity="${0.5 * glow}"/><stop offset="1" stop-color="${spot}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}vig" cx="540" cy="900" r="1150" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient>
    <filter id="${id}gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${Math.floor(T * 12) % 97}"/><feColorMatrix type="saturate" values="0"/></filter>
    <filter id="${id}soft"><feGaussianBlur stdDeviation="6"/></filter><filter id="${id}blur" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
  <rect width="1080" height="1920" fill="#080908"/><rect width="1080" height="1700" fill="${wall}"/>${panels}
  <rect y="1660" width="1080" height="260" fill="#0A0B0A"/><rect y="1660" width="1080" height="6" fill="#1C2524"/>
  <path d="M${sx - 120},-20 L${sx + 120},-20 L${sx + 520},1700 L${sx - 520},1700 Z" fill="url(#${id}cone)"/>
  <rect width="1080" height="1920" fill="url(#${id}spot)"/><rect y="1560" width="1080" height="360" fill="url(#${id}pool)"/>`;
}
const cpFinish = (id) => `<rect width="1080" height="1920" fill="url(#${id}vig)"/><rect width="1080" height="1920" filter="url(#${id}gr)" opacity=".16" style="mix-blend-mode:overlay"/>`;

/** A satin gradient across a part (dark edge, a lit band toward the light at the left, mid, dark edge). */
const cpSatin = (id, [d, m, l], x0 = -260, x1 = 460) => `<linearGradient id="${id}" x1="${x0}" y1="0" x2="${x1}" y2="0" gradientUnits="userSpaceOnUse">
  <stop offset="0" stop-color="${d}"/><stop offset=".22" stop-color="${l}"/><stop offset=".42" stop-color="${m}"/><stop offset=".78" stop-color="${d}"/><stop offset="1" stop-color="${d}"/></linearGradient>`;
/** A four-point glint. */
const cpGlint = (x, y, r, a = 1, col = '#FFFFFF') => a <= 0.01 ? '' : `<g opacity="${CP.f(Math.min(1, a))}"><path d="M${CP.f(x)},${CP.f(y - r)} Q${CP.f(x + r * 0.12)},${CP.f(y - r * 0.12)} ${CP.f(x + r)},${CP.f(y)} Q${CP.f(x + r * 0.12)},${CP.f(y + r * 0.12)} ${CP.f(x)},${CP.f(y + r)} Q${CP.f(x - r * 0.12)},${CP.f(y + r * 0.12)} ${CP.f(x - r)},${CP.f(y)} Q${CP.f(x - r * 0.12)},${CP.f(y - r * 0.12)} ${CP.f(x)},${CP.f(y - r)} Z" fill="${col}"/><circle cx="${CP.f(x)}" cy="${CP.f(y)}" r="${CP.f(r * 0.22)}" fill="${col}"/></g>`;

/* ---------- the figures (local units, origin at the waist) ---------- */
// The head: a dark oval with the hair up in a chignon, turned three-quarters away (the bun toward us). Light only on the edge.
function cpHead(id, {x = 0, y = -470, rim = '#FFE9C2', rimA = 0.75, hair = '#1B1410', powdered = false} = {}) {
  // seen from behind and a little to the side: all hair and shadow; the light only draws a thin edge down the left side
  const hc = powdered ? '#D9D4CC' : hair;
  return `<clipPath id="${id}hc"><ellipse cx="${x}" cy="${y}" rx="50" ry="60"/></clipPath>
    <path d="M${x - 18},${y + 40} L${x - 24},${y + 100} L${x + 26},${y + 100} L${x + 20},${y + 40} Z" fill="#14100D"/>
    <ellipse cx="${x}" cy="${y}" rx="50" ry="60" fill="${powdered ? '#B9B3AA' : '#120D0A'}"/>
    <ellipse cx="${x + 26}" cy="${y - 4}" rx="56" ry="74" fill="${hc}" clip-path="url(#${id}hc)"/>
    <path d="M${x - 50},${y - 4} A50,60 0 0 1 ${x - 20},${y - 56}" stroke="${rim}" stroke-opacity="${rimA}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M${x - 49},${y + 10} Q${x - 44},${y + 40} ${x - 26},${y + 54}" stroke="${rim}" stroke-opacity="${rimA * 0.5}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="${x + 34}" cy="${y - 44}" rx="${powdered ? 40 : 32}" ry="${powdered ? 34 : 28}" fill="${hc}"/>
    <path d="M${x + 10},${y - 66} Q${x + 40},${y - 80} ${x + 62},${y - 50}" stroke="${rim}" stroke-opacity="${rimA * 0.6}" stroke-width="4" fill="none"/>` +
    (powdered ? `<path d="M${x - 46},${y - 30} Q${x - 30},${y - 130} ${x + 20},${y - 128} Q${x + 70},${y - 120} ${x + 56},${y - 20}" fill="${hc}"/><circle cx="${x + 56}" cy="${y + 10}" r="14" fill="${hc}"/><circle cx="${x + 54}" cy="${y + 36}" r="12" fill="${hc}"/>` : '');
}
/** A lady of 1883: cuirass bodice, overskirt drape, bustle and train behind (to the right), gloved arms.
 *  o: {sat:[dark,mid,light], sat2 (skirt), glove, bustle:true, arm:'down'|'up'|'fan', id, extraSkirt(id) (drawn clipped to the skirt)} */
function cpLady(o) {
  const id = o.id, s = [];
  const skirt = o.bustle === false
    ? 'M-52,0 C-120,240 -200,620 -240,890 Q0,915 220,905 L470,905 C400,700 230,420 150,240 C110,120 80,40 52,0 Z'
    : 'M-50,0 C-110,250 -180,620 -215,890 Q0,915 200,900 L440,905 C390,700 280,520 248,330 C268,200 236,60 50,0 Z';
  s.push(`<defs>${cpSatin(id + 'b', o.sat, -120, 120)}${cpSatin(id + 's', o.sat2 || o.sat, -230, 430)}<clipPath id="${id}sk"><path d="${skirt}"/></clipPath></defs>`);
  // back arm (behind the body)
  s.push(`<path d="M70,-330 Q118,-200 96,-70" stroke="${o.glove || '#EDE6D8'}" stroke-width="30" fill="none" stroke-linecap="round" opacity=".55"/>`);
  // skirt, folds, its own decoration, then the bustle drape and the front apron
  s.push(`<path d="${skirt}" fill="url(#${id}s)"/>`);
  s.push(`<g clip-path="url(#${id}sk)" fill="none">${[-150, -70, 20, 110, 200, 300].map((x, i) => `<path d="M${x * 0.15},20 C${x * 0.5},300 ${x * 0.85},600 ${x},910" stroke="${i % 2 ? '#000' : '#FFF'}" stroke-opacity="${i % 2 ? 0.22 : 0.1}" stroke-width="${10 + i * 2}"/>`).join('')}${o.extraSkirt ? o.extraSkirt(id) : ''}</g>`);
  if (o.bustle !== false) s.push(`<path d="M36,8 C210,-4 290,130 240,262 C180,236 104,196 40,120 Z" fill="url(#${id}s)"/><path d="M60,40 C170,40 230,120 214,210" stroke="#000" stroke-opacity=".25" stroke-width="8" fill="none"/>`);
  if (o.apron !== false) s.push(`<path d="M-52,10 C-104,150 -124,270 -62,336 C24,368 150,300 178,196 C104,150 64,60 50,8 Z" fill="url(#${id}b)"/><path d="M-62,336 C24,368 150,300 178,196" stroke="${o.trim || '#E8C35A'}" stroke-width="7" fill="none"/>`);
  // the bodice: a cuirass to below the hips, shoulders bare in shade, a deep V neckline
  s.push(`<path d="M-96,-346 C-102,-290 -72,-110 -54,30 L54,30 C72,-110 100,-290 96,-346 C60,-336 30,-318 0,-290 C-30,-318 -60,-336 -96,-346 Z" fill="url(#${id}b)"/>`);
  s.push(`<path d="M-96,-346 C-60,-336 -30,-318 0,-290 C30,-318 60,-336 96,-346" stroke="${o.trim || '#E8C35A'}" stroke-width="6" fill="none"/><path d="M-62,-300 C-50,-200 -36,-80 -30,24 M62,-300 C50,-200 36,-80 30,24" stroke="#000" stroke-opacity=".18" stroke-width="5" fill="none"/>`);
  s.push(`<path d="M-96,-346 Q-50,-372 -18,-370 L18,-370 Q50,-372 96,-346 C60,-336 30,-318 0,-290 C-30,-318 -60,-336 -96,-346 Z" fill="#33251D"/><path d="M-96,-346 Q-60,-366 -24,-370" stroke="#FFE9C2" stroke-opacity=".35" stroke-width="4" fill="none"/>
    <ellipse cx="-88" cy="-336" rx="30" ry="22" fill="url(#${id}b)"/><ellipse cx="86" cy="-336" rx="28" ry="20" fill="url(#${id}b)"/>`);
  // front arm: down to the waist, up (a torch), or holding a fan
  const g = o.glove || '#EDE6D8';
  if (o.arm === 'up') s.push(`<path d="M-86,-330 Q-150,-400 -150,-540" stroke="#33251D" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-150,-470 L-150,-610" stroke="${g}" stroke-width="30" stroke-linecap="round"/>`);
  else s.push(`<path d="M-92,-330 Q-136,-250 -128,-180" stroke="#33251D" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-128,-200 Q-124,-100 -46,-46" stroke="${g}" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M-128,-200 Q-124,-100 -46,-46" stroke="#000" stroke-opacity=".18" stroke-width="8" fill="none" transform="translate(8 2)"/><ellipse cx="-40" cy="-44" rx="16" ry="12" fill="${g}"/>`);
  return s.join('');
}
/** A man in costume (Louis XVI, Lear): coat skirts, breeches, stockings. o: {coat:[d,m,l], legs, cloak, id} */
function cpMan(o) {
  const id = o.id;
  return `<defs>${cpSatin(id + 'c', o.coat, -140, 140)}</defs>` +
    `<path d="M-46,0 L-54,840 L-12,840 L-4,120 L4,120 L14,840 L56,840 L46,0 Z" fill="${o.legs || '#E9E3D6'}"/>` +
    `<path d="M-70,840 l58,0 l0,26 l-70,0 Z M12,840 l58,0 l12,26 l-70,0 Z" fill="#14100D"/>` +
    (o.robe ? `<path d="M-120,-330 C-170,100 -220,500 -250,880 L260,880 C230,500 180,100 120,-330 Z" fill="url(#${id}c)"/>`
      : `<path d="M-60,-20 L-56,200 L56,200 L60,-20 Z" fill="${o.breeches || '#2A3E7A'}"/><path d="M-100,-340 C-118,-150 -150,180 -160,330 L-40,280 L-20,-20 L20,-20 L40,280 L160,330 C150,180 118,-150 100,-340 Z" fill="url(#${id}c)"/>`) +
    `<path d="M-100,-340 Q0,-372 100,-340 L60,-60 L-60,-60 Z" fill="url(#${id}c)"/>` +
    `<path d="M-90,-334 Q-150,-200 -140,-40" stroke="url(#${id}c)" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M90,-334 Q130,-200 120,-50" stroke="url(#${id}c)" stroke-width="40" fill="none" stroke-linecap="round" opacity=".8"/>`;
}

/* ---------- the plates ---------- */
const CPL = {};
// "Puss": a stuffed cat's head as a headdress, seven cat tails sewn to the skirt (Kate Fearing Strong). The tails sway.
CPL.c_cat = (T, id) => {
  const tails = Array.from({length: 7}, (_, i) => {
    const x = -150 + i * 58, y = 300 + Math.abs(i - 3) * -12 + 40, a = Math.sin(T * 2.6 + i * 0.9) * 16 + (i - 3) * 4, L = 250 + (i % 3) * 30;
    const r = (a * Math.PI) / 180, ex = x + Math.sin(r) * L, ey = y + Math.cos(r) * L, mx = x + Math.sin(r * 0.4) * L * 0.5 + 18 * Math.sin(T * 2.6 + i), my = y + L * 0.5;
    const d = `M${CP.f(x)},${y} Q${CP.f(mx)},${CP.f(my)} ${CP.f(ex)},${CP.f(ey)}`;
    const col = ['#E08A2E', '#9A9A96', '#E9E2D2', '#C6721F', '#5C5650', '#E08A2E', '#D9CDB8'][i];
    return `<path d="${d}" stroke="#000" stroke-opacity=".4" stroke-width="40" fill="none" stroke-linecap="round" transform="translate(8 10)"/>
      <path d="${d}" stroke="${col}" stroke-width="34" fill="none" stroke-linecap="round"/>
      <path d="${d}" stroke="#2A1C10" stroke-opacity=".55" stroke-width="34" fill="none" stroke-dasharray="10 26"/>
      <path d="${d}" stroke="#FFF" stroke-opacity=".25" stroke-width="8" fill="none" transform="translate(-9 0)"/>`;
  }).join('');
  const head = (() => { // the cat's head, on top of her own (a mounted head: ears up, glass eyes that catch the light)
    const hx = 0, hy = -560, gl = 0.5 + 0.5 * Math.sin(T * 5);
    return `<path d="M${hx - 70},${hy + 20} Q${hx - 76},${hy - 60} ${hx - 52},${hy - 96} L${hx - 34},${hy - 60} Q${hx},${hy - 76} ${hx + 34},${hy - 60} L${hx + 56},${hy - 98} Q${hx + 80},${hy - 56} ${hx + 72},${hy + 20} Q${hx},${hy + 56} ${hx - 70},${hy + 20} Z" fill="#D9822C"/>
      <path d="M${hx - 50},${hy - 84} L${hx - 40},${hy - 56} L${hx - 58},${hy - 50} Z M${hx + 52},${hy - 86} L${hx + 40},${hy - 56} L${hx + 58},${hy - 50} Z" fill="#F2B3A0"/>
      <path d="M${hx - 30},${hy - 66} l8,30 M${hx},${hy - 72} l0,30 M${hx + 30},${hy - 66} l-8,30" stroke="#7A4214" stroke-width="7"/>
      <path d="M${hx - 34},${hy + 16} Q${hx},${hy + 46} ${hx + 34},${hy + 16} Q${hx},${hy + 2} ${hx - 34},${hy + 16} Z" fill="#F4EEE2"/>
      <ellipse cx="${hx - 30}" cy="${hy - 12}" rx="16" ry="12" fill="#F2C230"/><ellipse cx="${hx + 30}" cy="${hy - 12}" rx="16" ry="12" fill="#F2C230"/>
      <rect x="${hx - 33}" y="${hy - 22}" width="6" height="20" rx="3" fill="#120C06"/><rect x="${hx + 27}" y="${hy - 22}" width="6" height="20" rx="3" fill="#120C06"/>
      <path d="M${hx - 8},${hy + 10} L${hx + 8},${hy + 10} L${hx},${hy + 20} Z" fill="#C7616A"/>
      <path d="M${hx - 20},${hy + 22} l-56,-6 M${hx - 20},${hy + 28} l-54,8 M${hx + 20},${hy + 22} l56,-6 M${hx + 20},${hy + 28} l54,8" stroke="#F4EEE2" stroke-width="3" opacity=".8"/>
      ${cpGlint(hx - 36, hy - 18, 14, gl)}${cpGlint(hx + 24, hy - 18, 14, 1 - gl)}`;
  })();
  return {spot: '#FFE4BE', fig: `<g transform="translate(470 860) scale(1.05)">` + cpLady({id, sat: ['#3A3026', '#B8A994', '#F6F0E4'], sat2: ['#2A2018', '#9C8A70', '#EFE6D6'], glove: '#F6F0E4', trim: '#3D7BD9',
    extraSkirt: () => Array.from({length: 9}, (_, k) => `<path d="M${-260 + k * 80},300 l40,600" stroke="#C6721F" stroke-opacity=".35" stroke-width="22"/>`).join('')}) +
    tails + `<path d="M-40,-300 q40,26 80,0 l-14,40 q-26,-12 -52,0 Z" fill="#3D7BD9"/><circle cx="0" cy="-290" r="13" fill="#3D7BD9"/>` +
    cpHead(id) + head + `</g>`, focus: [470, 1100]};
};
// A hornet, with an imported headdress of diamonds (Lila Vanderbilt Webb): a striped skirt, gauze wings that flick, diamonds glint.
CPL.c_hornet = (T, id) => {
  const burst = Math.max(0, Math.sin(T * 3.4)), flick = Math.sin(T * 38) * 9 * burst * burst;
  const wing = (rot, sc, op) => `<g transform="translate(70 -300) rotate(${CP.f(rot)}) scale(${sc})"><path d="M0,0 C80,-260 320,-330 370,-220 C400,-130 220,-40 0,0 Z" fill="url(#${id}wg)" stroke="#F6E7A8" stroke-width="4" opacity="${op}"/>
    <path d="M0,0 C110,-120 220,-190 340,-220 M40,-40 C140,-110 260,-150 300,-140 M80,-70 C120,-190 180,-260 250,-290" stroke="#F6E7A8" stroke-opacity=".7" stroke-width="3" fill="none"/></g>`;
  const stripes = () => Array.from({length: 7}, (_, k) => `<path d="M-400,${110 + k * 120} Q60,${150 + k * 120} 520,${80 + k * 130} L520,${150 + k * 130} Q60,${210 + k * 120} -400,${170 + k * 120} Z" fill="#0E0B07"/>`).join('');
  const dia = [[-40, -548], [-14, -566], [14, -570], [42, -558], [64, -536], [-60, -524]];
  const tiara = dia.map(([x, y], i) => `<path d="M${x},${y - 14} l9,14 l-9,14 l-9,-14 Z" fill="#DDF3FF"/>` + cpGlint(x, y, 26, Math.max(0, Math.sin(T * 4 + i * 1.7)) ** 3)).join('');
  const ant = `<path d="M-10,-540 C-40,-640 -90,-680 -130,-690 M20,-540 C30,-650 70,-700 110,-712" stroke="#120E08" stroke-width="7" fill="none"/>
    <path d="M-130,-704 l12,14 l-12,14 l-12,-14 Z M110,-726 l12,14 l-12,14 l-12,-14 Z" fill="#DDF3FF"/>${cpGlint(-130, -690, 34, 0.5 + 0.5 * Math.sin(T * 6))}${cpGlint(110, -712, 34, 0.5 - 0.5 * Math.sin(T * 6))}`;
  return {spot: '#FFF0B8', fig: `<g transform="translate(450 880) scale(1.04)"><defs><linearGradient id="${id}wg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9F6FF" stop-opacity=".75"/><stop offset="1" stop-color="#BFE6FF" stop-opacity=".25"/></linearGradient></defs>` +
    wing(-8 + flick, 1, 0.75) + wing(26 - flick * 0.8, 0.8, 0.6) +
    cpLady({id, sat: ['#3A2A05', '#E3A51A', '#FFE27A'], sat2: ['#3A2A05', '#E8AA14', '#FFE680'], glove: '#14100A', trim: '#14100A', extraSkirt: stripes}) +
    `<path d="M-90,-250 Q0,-230 90,-250 M-80,-160 Q0,-140 80,-160 M-66,-70 Q0,-50 66,-70" stroke="#0E0B07" stroke-width="26" fill="none"/>` +
    cpHead(id, {rim: '#FFF0B8'}) + ant + tiara + `</g>`, focus: [470, 640]};
};
// "Mme. Le Diable": red satin, a black velvet demon embroidered on it, a fringe of little demon heads (Bessie Webb). The fringe swings.
CPL.c_devil = (T, id) => {
  const imp = (x, y, a, k = 1) => `<g transform="translate(${CP.f(x)} ${CP.f(y)}) rotate(${CP.f(a)}) scale(${k})"><line x1="0" y1="0" x2="0" y2="26" stroke="#E8C35A" stroke-width="3"/>
    <path d="M-15,40 Q-16,26 -22,16 Q-10,24 0,24 Q10,24 22,16 Q16,26 15,40 Q15,58 0,60 Q-15,58 -15,40 Z" fill="#0B0505"/><circle cx="-6" cy="40" r="3" fill="#FFB12E"/><circle cx="6" cy="40" r="3" fill="#FFB12E"/></g>`;
  const fringe = Array.from({length: 11}, (_, i) => { const u = i / 10, x = -62 + u * 240, y = 336 - Math.sin(u * Math.PI) * 40 - u * 140 + 4;
    return imp(x, y, Math.sin(T * 3.2 + i * 0.55) * 18); }).join('') +
    Array.from({length: 7}, (_, i) => imp(-54 + i * 18, 26, Math.sin(T * 3.2 + i * 0.7 + 1) * 16, 0.8)).join('');
  const demon = () => `<g transform="translate(-20 520)"><path d="M0,-150 C-30,-150 -50,-120 -50,-90 L-80,-150 L-66,-80 C-90,-60 -96,-20 -84,20 L-200,-60 C-180,10 -150,50 -90,80 L-60,170 L-20,90 L20,90 L60,170 L90,80 C150,50 180,10 200,-60 L84,20 C96,-20 90,-60 66,-80 L80,-150 L50,-90 C50,-120 30,-150 0,-150 Z" fill="#0D0405" stroke="#E8C35A" stroke-width="5"/>
    <path d="M-24,-96 l14,8 M24,-96 l-14,8" stroke="#E8C35A" stroke-width="5"/><path d="M100,60 Q160,140 140,220" stroke="#0D0405" stroke-width="10" fill="none"/><path d="M130,210 l10,20 l14,-16 Z" fill="#0D0405"/></g>`;
  return {spot: '#FFD0C0', spotA: 0.5, fig: `<g transform="translate(460 870) scale(1.05)">` +
    cpLady({id, sat: ['#3C0306', '#B3101C', '#FF4A3D'], sat2: ['#320205', '#A50D18', '#FF3B30'], glove: '#0D0607', trim: '#E8C35A', extraSkirt: demon}) + fringe +
    cpHead(id, {rim: '#FFB0A0'}) + `<path d="M-40,-520 Q-70,-560 -60,-610 Q-44,-566 -20,-530 Z M30,-528 Q60,-570 54,-620 Q78,-570 54,-520 Z" fill="#0B0505" stroke="#E8C35A" stroke-width="3"/></g>`, focus: [470, 1150]};
};
// The Duchess of Burgundy: real sapphires, rubies and emeralds studding the front of the dress (Edith Fish); a hennin and veil,
// ermine trim. The jewels sparkle one by one.
CPL.c_duchess = (T, id) => {
  const gems = []; for (let r = 0; r < 7; r++) for (let c = 0; c <= r; c++) gems.push([-r * 26 + c * 52 - 10, -250 + r * 70, (r + c) % 3]);
  for (let r = 0; r < 5; r++) for (let c = 0; c < 3 + r; c++) gems.push([-60 - r * 30 + c * 64, 120 + r * 120, (r * 2 + c) % 3]);
  const cols = [['#1C4FD8', '#8FB4FF'], ['#C3112A', '#FF8A96'], ['#0E9A57', '#7DF0B4']], k = Math.floor(T * 9);
  const gemSvg = gems.map(([x, y, t], i) => { const on = (k - i * 5) % gems.length, hot = (k * 7) % gems.length === i || (k * 7 + 13) % gems.length === i;
    return `<path d="M${x},${y - 14} l12,14 l-12,14 l-12,-14 Z" fill="${cols[t][0]}" stroke="#E8C35A" stroke-width="3"/><path d="M${x - 4},${y - 6} l4,-4 l4,4 Z" fill="${cols[t][1]}"/>` + (hot ? cpGlint(x, y, 34) : on < 0 ? '' : ''); }).join('');
  const ermine = (d) => `<path d="${d}" fill="#F4F1EA"/>` + Array.from({length: 14}, (_, i) => `<path d="M${-220 + i * 50},${872 + (i % 2) * 10} l5,-12 l5,12 Z" fill="#0D0B09"/>`).join('');
  const veil = Math.sin(T * 1.6) * 10;
  return {spot: '#E6E0FF', spotA: 0.5, fig: `<g transform="translate(470 860) scale(1.05)">` +
    `<path d="M40,-640 C200,-520 ${CP.f(300 + veil)},-200 ${CP.f(360 + veil)},300 L${CP.f(300 + veil)},310 C${CP.f(240 + veil)},-100 160,-460 20,-600 Z" fill="#EDEBFF" opacity=".35"/>` +
    cpLady({id, bustle: false, apron: false, sat: ['#140B3A', '#3A2A9A', '#7C6BFF'], sat2: ['#120936', '#33238A', '#6E5CF0'], glove: '#E8C35A', trim: '#E8C35A',
      extraSkirt: () => `<rect x="-400" y="850" width="900" height="70" fill="#F4F1EA"/>` + Array.from({length: 18}, (_, i) => `<path d="M${-230 + i * 40},${872 + (i % 2) * 14} l5,-12 l5,12 Z" fill="#0D0B09"/>`).join('')}) +
    `<rect x="-60" y="-120" width="120" height="16" fill="#E8C35A"/>` + gemSvg + ermine('M-104,-120 l0,0') +
    cpHead(id, {rim: '#E6E0FF'}) +
    `<path d="M-40,-520 L120,-830 L150,-812 L46,-500 Z" fill="#2A1C7A"/><path d="M-40,-520 L120,-830 L150,-812 L46,-500 Z" fill="none" stroke="#E8C35A" stroke-width="5"/>` +
    [0.25, 0.5, 0.75].map((u) => `<path d="M${CP.f(-40 + 160 * u)},${CP.f(-520 - 310 * u)} l${CP.f(86 - 50 * u)},${CP.f(20 - 2 * u)}" stroke="#E8C35A" stroke-width="7"/>`).join('') +
    `<path d="M-48,-506 Q0,-540 52,-500 L46,-484 Q0,-516 -46,-490 Z" fill="#E8C35A"/>${cpGlint(130, -826, 30, 0.6 + 0.4 * Math.sin(T * 5))}</g>`, focus: [470, 900]};
};
// "The Electric Light" (Alice Vanderbilt): white satin and diamonds, a torch that really lit, wired to batteries in her dress.
// opts.on: the time the torch flickers on (default: 0.6 s into the shot).
CPL.c_electric = (T, id, {t0 = 0, on, flare = 0} = {}) => {   // flare: an extra blazing bloom and lens streak (the hook)
  const tOn = on ?? t0 + 0.6, u = T - tOn;
  const flick = u < 0 ? 0 : u < 0.5 ? ([1, 0, 1, 0.2, 1, 0.5, 1][Math.floor(u * 14) % 7]) : 0.92 + 0.08 * Math.sin(T * 31) * Math.sin(T * 7);
  const tx = -150, ty = -640;
  const rays = Array.from({length: 12}, (_, i) => { const a = (i / 12) * Math.PI * 2 + T * 0.4, r0 = 40, r1 = 120 + 40 * Math.sin(T * 6 + i);
    return `<line x1="${CP.f(tx + Math.cos(a) * r0)}" y1="${CP.f(ty + Math.sin(a) * r0)}" x2="${CP.f(tx + Math.cos(a) * r1)}" y2="${CP.f(ty + Math.sin(a) * r1)}" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>`; }).join('');
  const r = (() => { let s = 1; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
  const dia = Array.from({length: 26}, (_, i) => { const x = -170 + r() * 300, y = -280 + r() * 1080; return [x, y]; }).filter(([x, y]) => y < 0 ? Math.abs(x) < 80 - y * 0.0 : x > -60 - y * 0.22 && x < 60 + y * 0.35);
  const sparkle = dia.map(([x, y], i) => cpGlint(x, y, 16, (0.3 + 0.7 * flick) * Math.max(0, Math.sin(T * 5 + i * 2.1)) ** 2)).join('');
  const crown = Array.from({length: 7}, (_, i) => { const a = -0.9 + i * 0.3, x = Math.sin(a) * 70, y = -500 - Math.cos(a) * 60;
    return `<path d="M${CP.f(Math.sin(a) * 46)},${CP.f(-500 - Math.cos(a) * 40)} L${CP.f(x + 8)},${CP.f(y - 34)} L${CP.f(x - 6)},${CP.f(y - 10)} L${CP.f(x + 4)},${CP.f(y - 60)}" stroke="#F4F7FF" stroke-width="6" fill="none" stroke-linejoin="round"/>`; }).join('');
  return {spot: '#DDEBFF', spotA: 0.2 + 0.45 * flick, glow: flick, fig: `<g transform="translate(500 900) scale(1.0)">` +
    `<circle cx="${tx}" cy="${ty}" r="520" fill="url(#${id}bulb)" opacity="${CP.f(flick)}"/>` +
    cpLady({id, sat: ['#4A4A52', '#C9CCD6', '#FFFFFF'], sat2: ['#3E3E46', '#BFC3CE', '#FFFFFF'], glove: '#FFFFFF', trim: '#E8C35A', arm: 'up'}) +
    sparkle + cpHead(id, {rim: '#E6F2FF', rimA: 0.4 + 0.5 * flick}) + crown +
    `<rect x="${tx - 9}" y="${ty + 10}" width="18" height="70" rx="4" fill="#E8C35A"/><path d="M${tx - 22},${ty + 14} L${tx + 22},${ty + 14} L${tx + 12},${ty - 2} L${tx - 12},${ty - 2} Z" fill="#B8912E"/>` +
    `<ellipse cx="${tx}" cy="${ty - 20}" rx="22" ry="28" fill="${flick > 0.1 ? '#FFFFFF' : '#5A5E66'}"/>` +
    `<g opacity="${CP.f(flick)}">${rays}<circle cx="${tx}" cy="${ty - 20}" r="70" fill="#FFFFFF" filter="url(#${id}blur)"/></g>` +
    (flare ? `<g opacity="${CP.f(flare * flick)}" style="mix-blend-mode:screen"><circle cx="${tx}" cy="${ty - 20}" r="${CP.f(150 + 14 * Math.sin(T * 19))}" fill="#FFFFFF" filter="url(#${id}blur)"/>
      <ellipse cx="${tx}" cy="${ty - 20}" rx="${CP.f(560 + 40 * Math.sin(T * 11))}" ry="7" fill="#DDEEFF" filter="url(#${id}soft)"/><ellipse cx="${tx}" cy="${ty - 20}" rx="9" ry="300" fill="#DDEEFF" opacity=".55" filter="url(#${id}soft)"/></g>` : '') +
    `<defs><radialGradient id="${id}bulb" cx="${tx}" cy="${ty}" r="520" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset=".15" stop-color="#CFE6FF" stop-opacity=".45"/><stop offset="1" stop-color="#9CC8FF" stop-opacity="0"/></radialGradient></defs></g>`,
    focus: [350, 300]};
};
// The Dresden quadrille: the dancers all in white, "living porcelain dolls": a row turns in step.
CPL.c_porcelain = (T, id) => {
  const fig = (x, i) => { const ph = T * 2.4 - i * 0.12, sx = Math.cos(ph), w = Math.abs(sx) < 0.12 ? 0.12 * Math.sign(sx || 1) : sx;
    return `<g transform="translate(${x} 1130) scale(${CP.f(0.5 * w)} 0.5)">` +
      cpLady({id: `${id}p${i}`, bustle: true, sat: ['#8A8E98', '#E9ECF2', '#FFFFFF'], sat2: ['#8C909A', '#F2F4F8', '#FFFFFF'], glove: '#FFFFFF', trim: i % 2 ? '#7FA8E0' : '#F2A0B8',
        extraSkirt: () => Array.from({length: 5}, (_, k) => `<path d="M-300,${260 + k * 140} Q60,${300 + k * 140} 500,${240 + k * 150}" stroke="#E8C35A" stroke-width="6" fill="none"/><circle cx="${-120 + k * 70}" cy="${300 + k * 140}" r="16" fill="${i % 2 ? '#7FA8E0' : '#F2A0B8'}"/>`).join('')}) +
      cpHead(`${id}h${i}`, {powdered: true, rim: '#FFFFFF'}) + `</g>`; };
  const xs = [150, 330, 510, 690, 870];
  return {spot: '#F2F6FF', spotA: 0.5, fig: `<rect x="40" y="1560" width="1000" height="40" fill="#E9ECF2" opacity=".18"/>` + xs.map((x, i) => fig(x, i)).join(''), focus: [520, 1000]};
};
// A quick triptych of the kings: a Louis XVI in a powdered wig, a King Lear, a Joan of Arc in armour. They pop in one by one.
CPL.c_kings = (T, id, {t0 = 0} = {}) => {
  const pop = (k) => { const u = clamp01((T - t0 - k * 0.38) / 0.22); return u <= 0 ? 0 : 0.7 + 0.3 * (1 - Math.pow(1 - u, 3)) + 0.06 * Math.sin(u * Math.PI); };
  const panel = (k, x, inner, tint) => { const p = pop(k); if (!p) return '';
    return `<g opacity="${CP.f(Math.min(1, p * 1.3))}"><rect x="${x - 170}" y="200" width="340" height="1500" fill="url(#${id}pan${k})"/>
      <defs><radialGradient id="${id}pan${k}" cx="${x}" cy="760" r="620" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${tint}" stop-opacity=".45"/><stop offset="1" stop-color="${tint}" stop-opacity="0"/></radialGradient></defs>
      <g transform="translate(${x} 1020) scale(${CP.f(0.66 * p)})">${inner}</g></g>`; };
  const louis = cpMan({id: id + 'l', coat: ['#0E1F5A', '#2A4CC8', '#6E90FF'], breeches: '#1A2E80'}) +
    `<path d="M-6,-330 L-60,40 L-40,46 L10,-320 Z" fill="#E8C35A"/>` + Array.from({length: 8}, (_, i) => `<circle cx="${-30}" cy="${-300 + i * 40}" r="7" fill="#E8C35A"/>`).join('') +
    `<path d="M-30,-372 Q0,-330 30,-372 L18,-320 L-18,-320 Z" fill="#FFFFFF"/>` + cpHead(id + 'lh', {powdered: true, rim: '#CFE0FF'}) + `<path d="M50,-450 Q70,-420 60,-380" stroke="#141010" stroke-width="12" fill="none"/>`;
  const lear = cpMan({id: id + 'r', robe: true, coat: ['#2C0C3A', '#7A2AA0', '#C27BFF']}) +
    `<path d="M-130,-350 Q0,-300 130,-350 L150,-160 Q0,-110 -150,-160 Z" fill="#F4F1EA"/>` + Array.from({length: 8}, (_, i) => `<path d="M${-110 + i * 30},${-200 + (i % 2) * 20} l5,-12 l5,12 Z" fill="#0D0B09"/>`).join('') +
    `<path d="M150,-560 L170,880" stroke="#8A6A3A" stroke-width="14"/>` + cpHead(id + 'rh', {rim: '#E8D8FF', hair: '#CFCAC0'}) +
    `<path d="M-46,-430 Q-60,-330 -20,-280 Q10,-320 20,-420 Z" fill="#E9E5DC"/><path d="M-50,-520 L-50,-560 L-30,-536 L-10,-576 L10,-536 L30,-566 L50,-524 Z" fill="#E8C35A"/>` + cpGlint(-10, -560, 30, 0.6 + 0.4 * Math.sin(T * 7));
  const joan = cpMan({id: id + 'j', coat: ['#3A4048', '#B8C2CE', '#F4F8FF'], legs: '#AAB4C0', breeches: '#8C96A2'}) +
    [-260, -180, -100, -20].map((y) => `<path d="M-100,${y} Q0,${y + 24} 100,${y}" stroke="#5A626C" stroke-width="5" fill="none"/>`).join('') +
    `<path d="M-160,-700 L-160,860" stroke="#6A5030" stroke-width="12"/><path d="M-160,-690 L-390,-640 L-300,-560 L-390,-480 L-160,-470 Z" fill="#F4F1EA"/>` +
    `<path d="M-270,-610 q-14,20 0,44 q14,-24 0,-44 M-292,-560 l44,0" stroke="#E8C35A" stroke-width="7" fill="none"/>` + cpHead(id + 'jh', {rim: '#E6EEFF', hair: '#3A2A1E'}) + cpGlint(-160, -705, 30, 0.5 + 0.5 * Math.sin(T * 6));
  return {spot: '#FFF3D6', spotA: 0.25, fig: panel(0, 190, louis, '#6E90FF') + panel(1, 540, lear, '#C27BFF') + panel(2, 890, joan, '#CFE0FF'), focus: [540, 900]};
};
// The hook's last beat: a lone guest, her back to us, at the lit Gothic door of 660 Fifth Avenue. Ink, with a rim of door light.
CPL.c_door = (T, id) => {
  const arch = 'M300,1660 L300,780 Q300,560 540,520 Q780,560 780,780 L780,1660 Z';
  return {spot: '#FFF3D6', spotA: 0.3, fig: `<path d="M240,1660 L240,740 Q240,470 540,430 Q840,470 840,740 L840,1660 Z" fill="#1C2A28"/><path d="${arch}" fill="#FFF3D6"/>` +
    `<path d="${arch}" fill="none" stroke="#FFE2A8" stroke-width="40" filter="url(#${id}blur)" opacity=".7"/>` +
    Array.from({length: 7}, (_, i) => `<rect x="${200 + i * 0}" y="${1660 - i * 0}" width="0" height="0"/><rect x="${210 - i * 14}" y="${1660 + i * 24}" width="${660 + i * 28}" height="24" fill="${i % 2 ? '#1A2523' : '#22302E'}"/>`).join('') +
    `<g transform="translate(560 1290) scale(0.62)">` + cpLady({id, sat: ['#050505', '#0B0B0B', '#141414'], glove: '#0B0B0B', trim: '#0B0B0B'}).replace(/<path d="M-86[^>]*>/g, '') +
    cpHead(id, {rim: '#FFF3D6', rimA: 0.9}) + `</g>`, focus: [540, 1100]};
};

/** One plate as a full frame, with the quick push-in (ease over the shot) toward the plate's detail. */
function costumePlate(name, T, t0, t1, opts = {}) {
  const id = name.replace('c_', 'k') + (opts.key || '');
  CP.fid = id;
  const P = CPL[name](T, id, {t0, ...opts}), u = clamp01((T - t0) / Math.max(0.5, t1 - t0)), k = (opts.base ?? 1) + (opts.push ?? 0.12) * (1 - Math.pow(1 - u, 2.2));
  const [fx, fy] = opts.focus || P.focus;
  const room = cpRoom(id, T, {spot: P.spot, spotA: opts.spotA ?? P.spotA ?? 0.55, glow: P.glow ?? 1});
  return `<div style="position:absolute;inset:0;transform-origin:${fx}px ${fy}px;transform:scale(${k.toFixed(4)})"><svg style="position:absolute;inset:0" width="1080" height="1920" viewBox="0 0 1080 1920">${room}<g transform="translate(0 ${opts.drop ?? 170})">${P.fig}</g>${cpFinish(id)}</svg></div>`;
}
if (typeof window !== 'undefined') Object.assign(window, {costumePlate, cpLady, cpHead});
