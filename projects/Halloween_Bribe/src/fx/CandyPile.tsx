// CandyPile: wrapped candies rain onto the dark desk and heap up in and around the open pillowcase sack.
// Chapter 6 beat: "If you're five years old with a pillowcase, that's not a neighborhood. That's a buffet."
//
// The physics is a small custom 2D rigid-body solver (compound circles, sequential impulses, friction),
// run ONCE at module load with a seeded RNG and a fixed timestep. Every render worker computes the same
// table, and each frame just indexes it, so out-of-order / parallel rendering is exact.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {DarkPaper} from '../kit/common';
import {Arrow, Finish, Note, PALETTES, PaletteCtx, StepCtx, usePal} from '../kit/Kit';

// ---------------------------------------------------------------- layout (screen px, 1920x1080)
const SACK_SRC = 'img/props/pillowcase_sack.webp';
const SACK_W = 1269;
const SACK_H = 1478;
const SS = 0.44; // sack scale
const SL = 880; // sack left
const ST = 985 - 1290 * SS; // sack top, so its base sits on the floor line
const FLOOR = 985;
const sx = (x: number) => SL + x * SS;
const sy = (y: number) => ST + y * SS;

/** Sack collision pieces (source px of the webp), each made convex by hull(). The back rim of the
 *  gathered mouth is not solid: candy drops past it into the opening and rests on the mouth floor. */
const SACK_PIECES_SRC: [number, number][][] = [
  // body below the mouth floor
  [[164, 395], [1048, 395], [1048, 1000], [164, 1000]],
  // skirt
  [[164, 1000], [1048, 1000], [1176, 1290], [12, 1290]],
  // left shoulder of the gathered top
  [[176, 400], [190, 280], [250, 200], [372, 120], [415, 140], [440, 230], [440, 400]],
  // right shoulder
  [[750, 400], [750, 240], [800, 110], [870, 80], [960, 160], [1032, 280], [1048, 400]],
];
/** Front lip of the opening (source px): sack drawn again below this line, over candy that went in. */
const LIP_SRC: [number, number][] = [[400, 330], [470, 352], [530, 380], [590, 405], [650, 382], [710, 352], [790, 330]];
const MOUTH = {x0: sx(440), x1: sx(750), yMax: sy(395)};

// ---------------------------------------------------------------- tiny deterministic RNG
const mulberry32 = (a: number) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type V = [number, number];
const hull = (pts: V[]): V[] => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: V, a: V, b: V) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: V[] = [], up: V[] = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
};
const SACK_POLYS: V[][] = SACK_PIECES_SRC.map((pc) => hull(pc.map(([x, y]) => [sx(x), sy(y)] as V)));

// ---------------------------------------------------------------- candy kinds
type Kind = 'twist' | 'bar' | 'mint';
type Circle = {ox: number; oy: number; r: number};
const SHAPES: Record<Kind, Circle[]> = {
  twist: [{ox: 0, oy: 0, r: 15}, {ox: -22, oy: 0, r: 8}, {ox: 22, oy: 0, r: 8}],
  bar: [{ox: -19, oy: 0, r: 11}, {ox: 0, oy: 0, r: 11}, {ox: 19, oy: 0, r: 11}],
  mint: [{ox: 0, oy: 0, r: 16}],
};

type Body = {
  kind: Kind; shade: number; scale: number; circles: Circle[];
  x: number; y: number; a: number; vx: number; vy: number; w: number;
  im: number; ii: number; spawn: number; live: boolean; rest: number;
};

// ---------------------------------------------------------------- simulation
export const SIM_FRAMES = 200; // frames of motion after `at`; the pile holds still after that
const SUB = 6; // substeps per video frame (180 Hz)
const ITER = 10;
const G = 2700;
const COUNT = 100;
const REST = 0.22; // restitution
const MU = 0.55; // friction

type Pose = Float32Array; // per body: x, y, a, inSack(0/1)

const simulate = () => {
  const rnd = mulberry32(19451946);
  const kinds: Kind[] = ['twist', 'twist', 'bar', 'mint', 'twist', 'mint', 'bar'];
  const bodies: Body[] = [];
  for (let i = 0; i < COUNT; i++) {
    const kind = kinds[Math.floor(rnd() * kinds.length)];
    const scale = 1.1 + rnd() * 0.35;
    const circles = SHAPES[kind].map((c) => ({ox: c.ox * scale, oy: c.oy * scale, r: c.r * scale}));
    let m = 0, I = 0;
    for (const c of circles) { const cm = c.r * c.r; m += cm; I += cm * (0.5 * c.r * c.r + c.ox * c.ox + c.oy * c.oy); }
    // spawn: early pieces aimed at the sack mouth, then a widening shower
    const tSpawn = Math.floor(Math.pow(i / COUNT, 1.15) * 105 + rnd() * 6);
    const g1 = rnd() + rnd() + rnd() - 1.5; // ~normal
    const spread = 120 + 230 * (i / COUNT);
    const x = (MOUTH.x0 + MOUTH.x1) / 2 + g1 * spread * 1.4 + (i % 5 === 0 ? (rnd() - 0.5) * 60 : 0);
    bodies.push({kind, shade: Math.floor(rnd() * 3), scale, circles, x, y: -70 - rnd() * 120, a: rnd() * Math.PI * 2,
      vx: (rnd() - 0.5) * 160, vy: 250 + rnd() * 350, w: (rnd() - 0.5) * 10, im: 1 / m, ii: 1 / I, spawn: tSpawn, live: false, rest: 0});
  }

  const dt = 1 / 30 / SUB;
  const poses: Pose[] = [];
  const inSack = new Uint8Array(COUNT);

  type Contact = {b: number; o: number; nx: number; ny: number; pen: number; rax: number; ray: number; rbx: number; rby: number; mn: number; mt: number; jn: number; jt: number; bias: number};

  const world = (b: Body, c: Circle): V => {
    const cs = Math.cos(b.a), sn = Math.sin(b.a);
    return [b.x + c.ox * cs - c.oy * sn, b.y + c.ox * sn + c.oy * cs];
  };

  const circlePoly = (px: number, py: number, r: number, poly: V[]): {nx: number; ny: number; pen: number} | null => {
    // polygon is convex; works out closest feature and inside/outside
    let inside = true, best = -Infinity, bnx = 0, bny = 0;
    let cd = Infinity, cx = 0, cy = 0;
    const n = poly.length;
    // orientation
    let area = 0;
    for (let i = 0; i < n; i++) { const p = poly[i], q = poly[(i + 1) % n]; area += p[0] * q[1] - q[0] * p[1]; }
    const sgn = area > 0 ? 1 : -1;
    for (let i = 0; i < n; i++) {
      const p = poly[i], q = poly[(i + 1) % n];
      const ex = q[0] - p[0], ey = q[1] - p[1];
      const len = Math.hypot(ex, ey);
      // outward normal
      const nx = (sgn * ey) / len, ny = (-sgn * ex) / len;
      const d = (px - p[0]) * nx + (py - p[1]) * ny;
      if (d > 0) inside = false;
      if (d > best) { best = d; bnx = nx; bny = ny; }
      let t = ((px - p[0]) * ex + (py - p[1]) * ey) / (len * len);
      t = Math.max(0, Math.min(1, t));
      const qx = p[0] + ex * t, qy = p[1] + ey * t;
      const dd = Math.hypot(px - qx, py - qy);
      if (dd < cd) { cd = dd; cx = qx; cy = qy; }
    }
    if (inside) return {nx: bnx, ny: bny, pen: r - best};
    if (cd >= r) return null;
    return {nx: (px - cx) / cd, ny: (py - cy) / cd, pen: r - cd};
  };

  for (let f = 0; f <= SIM_FRAMES; f++) {
    for (const b of bodies) if (!b.live && b.spawn <= f) b.live = true;
    if (f > 0) for (let s = 0; s < SUB; s++) {
      // integrate forces
      for (const b of bodies) {
        if (!b.live) continue;
        b.vy += G * dt;
        b.vx *= 0.9995; b.vy *= 0.9995; b.w *= 0.996;
      }
      // contacts
      const cs: Contact[] = [];
      const add = (bi: number, oi: number, px: number, py: number, nx: number, ny: number, pen: number) => {
        // normal points from other (or static) into body bi
        const b = bodies[bi];
        const rax = px - b.x, ray = py - b.y;
        let rbx = 0, rby = 0, imB = 0, iiB = 0;
        if (oi >= 0) { const o = bodies[oi]; rbx = px - o.x; rby = py - o.y; imB = o.im; iiB = o.ii; }
        const rna = rax * ny - ray * nx, rnb = rbx * ny - rby * nx;
        const mn = 1 / (b.im + imB + b.ii * rna * rna + iiB * rnb * rnb);
        const tx = -ny, ty = nx;
        const rta = rax * ty - ray * tx, rtb = rbx * ty - rby * tx;
        const mt = 1 / (b.im + imB + b.ii * rta * rta + iiB * rtb * rtb);
        // relative normal velocity for restitution
        let vrx = b.vx - b.w * ray, vry = b.vy + b.w * rax;
        if (oi >= 0) { const o = bodies[oi]; vrx -= o.vx - o.w * rby; vry -= o.vy + o.w * rbx; }
        const vn = vrx * nx + vry * ny;
        const bias = Math.max(0, pen - 0.5) * 0.2 / dt + (vn < -120 ? -REST * vn : 0);
        cs.push({b: bi, o: oi, nx, ny, pen, rax, ray, rbx, rby, mn, mt, jn: 0, jt: 0, bias});
      };
      for (let i = 0; i < COUNT; i++) {
        const b = bodies[i];
        if (!b.live) continue;
        const wc = b.circles.map((c) => world(b, c));
        // floor
        b.circles.forEach((c, k) => {
          const [px, py] = wc[k];
          const pen = py + c.r - FLOOR;
          if (pen > 0) add(i, -1, px, FLOOR, 0, -1, pen);
          if (px - c.r < -200) add(i, -1, -200, py, 1, 0, -200 - (px - c.r));
          if (px + c.r > 2120) add(i, -1, 2120, py, -1, 0, px + c.r - 2120);
          for (const poly of SACK_POLYS) {
            const h = circlePoly(px, py, c.r, poly);
            if (h) add(i, -1, px - h.nx * (c.r - h.pen * 0.5), py - h.ny * (c.r - h.pen * 0.5), h.nx, h.ny, h.pen);
          }
        });
        for (let j = i + 1; j < COUNT; j++) {
          const o = bodies[j];
          if (!o.live) continue;
          if (Math.abs(o.x - b.x) > 110 || Math.abs(o.y - b.y) > 110) continue;
          const oc = o.circles.map((c) => world(o, c));
          b.circles.forEach((c, k) => o.circles.forEach((d, l) => {
            const dx = wc[k][0] - oc[l][0], dy = wc[k][1] - oc[l][1];
            const dist = Math.hypot(dx, dy), rr = c.r + d.r;
            if (dist < rr && dist > 1e-6) {
              const nx = dx / dist, ny = dy / dist;
              add(i, j, oc[l][0] + nx * (d.r - (rr - dist) * 0.5), oc[l][1] + ny * (d.r - (rr - dist) * 0.5), nx, ny, rr - dist);
            }
          }));
        }
      }
      // sequential impulses
      for (let it = 0; it < ITER; it++) {
        for (const c of cs) {
          const b = bodies[c.b];
          const o = c.o >= 0 ? bodies[c.o] : null;
          let vrx = b.vx - b.w * c.ray, vry = b.vy + b.w * c.rax;
          if (o) { vrx -= o.vx - o.w * c.rby; vry -= o.vy + o.w * c.rbx; }
          const vn = vrx * c.nx + vry * c.ny;
          let dj = c.mn * (-vn + c.bias);
          const jn0 = c.jn; c.jn = Math.max(0, jn0 + dj); dj = c.jn - jn0;
          let px = dj * c.nx, py = dj * c.ny;
          b.vx += px * b.im; b.vy += py * b.im; b.w += b.ii * (c.rax * py - c.ray * px);
          if (o) { o.vx -= px * o.im; o.vy -= py * o.im; o.w -= o.ii * (c.rbx * py - c.rby * px); }
          // friction
          const tx = -c.ny, ty = c.nx;
          vrx = b.vx - b.w * c.ray; vry = b.vy + b.w * c.rax;
          if (o) { vrx -= o.vx - o.w * c.rby; vry -= o.vy + o.w * c.rbx; }
          const vt = vrx * tx + vry * ty;
          let dt2 = -vt * c.mt;
          const jt0 = c.jt; c.jt = Math.max(-MU * c.jn, Math.min(MU * c.jn, jt0 + dt2)); dt2 = c.jt - jt0;
          px = dt2 * tx; py = dt2 * ty;
          b.vx += px * b.im; b.vy += py * b.im; b.w += b.ii * (c.rax * py - c.ray * px);
          if (o) { o.vx -= px * o.im; o.vy -= py * o.im; o.w -= o.ii * (c.rbx * py - c.rby * px); }
        }
      }
      // integrate velocities; let resting pieces settle quietly
      const touching = new Uint8Array(COUNT);
      for (const c of cs) { touching[c.b] = 1; if (c.o >= 0) touching[c.o] = 1; }
      for (let i = 0; i < COUNT; i++) {
        const b = bodies[i];
        if (!b.live) continue;
        const sp = Math.hypot(b.vx, b.vy) + Math.abs(b.w) * 15;
        b.rest = touching[i] && sp < 35 ? b.rest + 1 : 0;
        if (b.rest > SUB * 4) { b.vx *= 0.6; b.vy *= 0.6; b.w *= 0.6; }
        b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.w * dt;
      }
    }
    const pose = new Float32Array(COUNT * 4);
    bodies.forEach((b, i) => {
      // "in the sack" while its centre sits inside the opening, below the back rim
      const nowIn = b.live && b.x > MOUTH.x0 - 6 && b.x < MOUTH.x1 + 6 && b.y > sy(250) && b.y < MOUTH.yMax + 10;
      inSack[i] = nowIn ? 1 : 0;
      pose.set([b.live ? b.x : -999, b.live ? b.y : -999, b.a, inSack[i]], i * 4);
    });
    poses.push(pose);
  }
  return {poses, meta: bodies.map((b) => ({kind: b.kind, shade: b.shade, scale: b.scale}))};
};

let SIM: ReturnType<typeof simulate> | null = null;
const getSim = () => (SIM ??= simulate());

// ---------------------------------------------------------------- drawing
const OUT = '#2a1310';
const CREAM = '#f4efe6';
/** Coral-tinted wrapper tones (the pile as a whole is the coral subject). */
const tones = (coral: string, shade: number) => [
  {body: '#FF8C80', end: '#FFC2BA', mark: CREAM},
  {body: coral, end: '#FFA399', mark: CREAM},
  {body: '#D9554A', end: '#FF8F84', mark: '#FFD9D3'},
][shade];

const CandyShape: React.FC<{kind: Kind; shade: number; scale: number; coral: string}> = ({kind, shade, scale, coral}) => {
  const t = tones(coral, shade);
  const s = scale;
  const sw = 2.2;
  if (kind === 'twist') return (
    <g>
      <path d={`M${-14 * s},0 L${-30 * s},${-11 * s} L${-27 * s},${-3 * s} L${-31 * s},${3 * s} L${-29 * s},${11 * s} Z`} fill={t.end} stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
      <path d={`M${14 * s},0 L${30 * s},${-11 * s} L${27 * s},${-3 * s} L${31 * s},${3 * s} L${29 * s},${11 * s} Z`} fill={t.end} stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={17 * s} ry={13 * s} fill={t.body} stroke={OUT} strokeWidth={sw} />
      <path d={`M${-8 * s},${-11 * s} Q${-2 * s},0 ${-8 * s},${11 * s} M${2 * s},${-12 * s} Q${8 * s},0 ${2 * s},${12 * s}`} fill="none" stroke={t.mark} strokeWidth={2.4 * s} strokeLinecap="round" opacity={0.85} />
      <ellipse cx={-6 * s} cy={-6 * s} rx={5 * s} ry={2.5 * s} fill="#fff" opacity={0.45} />
    </g>
  );
  if (kind === 'bar') return (
    <g>
      <rect x={-31 * s} y={-11 * s} width={62 * s} height={22 * s} rx={4 * s} fill={t.body} stroke={OUT} strokeWidth={sw} />
      <rect x={-31 * s} y={-11 * s} width={9 * s} height={22 * s} rx={3 * s} fill={t.end} stroke={OUT} strokeWidth={sw * 0.8} />
      <rect x={22 * s} y={-11 * s} width={9 * s} height={22 * s} rx={3 * s} fill={t.end} stroke={OUT} strokeWidth={sw * 0.8} />
      <path d={`M${-16 * s},${-4 * s} L${14 * s},${-4 * s} M${-16 * s},${3 * s} L${6 * s},${3 * s}`} stroke={t.mark} strokeWidth={2.6 * s} strokeLinecap="round" opacity={0.85} />
    </g>
  );
  return (
    <g>
      <circle r={16 * s} fill={t.body} stroke={OUT} strokeWidth={sw} />
      <path d={`M0,${-15 * s} Q${9 * s},${-6 * s} 0,0 Q${-9 * s},${6 * s} 0,${15 * s} M${-15 * s},0 Q${-6 * s},${-9 * s} 0,0 Q${6 * s},${9 * s} ${15 * s},0`} fill="none" stroke={t.mark} strokeWidth={3 * s} strokeLinecap="round" opacity={0.9} />
      <circle r={16 * s} fill="none" stroke={OUT} strokeWidth={sw} />
    </g>
  );
};

const lipClip = () => {
  // polygon (in % of the sack image) covering everything below the front lip of the opening
  const pts = [[0, 330], ...LIP_SRC, [SACK_W, 330], [SACK_W, 1335], [0, 1335]].map(([x, y]) => `${(x / SACK_W) * 100}% ${(y / SACK_H) * 100}%`);
  return `polygon(${pts.join(',')})`;
};

const Sack: React.FC<{clip?: string}> = ({clip}) => (
  <Img src={staticFile(SACK_SRC)} style={{position: 'absolute', left: SL, top: ST, width: SACK_W * SS, height: SACK_H * SS,
    // the photo's own loose candies at the base are cropped away; B&W, contrast up (channel treatment)
    clipPath: clip ?? `inset(0 0 ${((SACK_H - 1335) / SACK_H) * 100}% 0)`, filter: 'grayscale(1) contrast(1.2) brightness(0.95)'}} />
);

/** Holds each simulated pose for this many frames: 2 = 15 fps, a stop-motion step that still reads as physics. */
const POSE_STEP = 2;

/** The beat. `at` = the frame the first candy starts falling (in the parent's frame time). */
export const CandyPile: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const coral = usePal().subject;
  const sim = getSim();
  const rel = frame - at;
  const idx = Math.max(0, Math.min(SIM_FRAMES, Math.floor(rel / POSE_STEP) * POSE_STEP));
  const pose = sim.poses[idx];
  const show = rel >= 0;

  const draw = (wantIn: number) => sim.meta.map((m, i) => {
    const x = pose[i * 4], y = pose[i * 4 + 1], a = pose[i * 4 + 2], inS = pose[i * 4 + 3];
    if (!show || inS !== wantIn || y < -150 || x < -100) return null;
    return (
      <g key={i} transform={`translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${((a * 180) / Math.PI).toFixed(2)})`}>
        <CandyShape kind={m.kind} shade={m.shade} scale={m.scale} coral={coral} />
      </g>
    );
  });
  const layer = (wantIn: number) => (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.55))'}}>
      {draw(wantIn)}
    </svg>
  );

  return (
    <AbsoluteFill>
      <DarkPaper />
      {/* soft contact shadow on the desk */}
      <div style={{position: 'absolute', left: SL - 40, top: FLOOR - 26, width: SACK_W * SS + 140, height: 52, borderRadius: '50%',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.6) 0%, transparent 70%)'}} />
      <Sack />
      {layer(1)}
      <Sack clip={lipClip()} />
      {layer(0)}
      <Note text="that's a buffet." x={170} y={560} size={64} rot={-5} at={at + 128} dur={14} />
      <Arrow x1={560} y1={680} x2={720} y2={900} bow={-40} at={at + 144} dur={8} />
    </AbsoluteFill>
  );
};

export const CandyPile_TEST_FRAMES = 210;
export const CandyPileTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <CandyPile at={10} />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
