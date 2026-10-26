// Hand-drawn teal sketches for Log Cabin: line drawings that draw on stroke by stroke at 12 fps and then "boil"
// (the points wobble a little every 5 frames, like a hand-drawn line redrawn each drawing). No AI images in this video;
// these drawings carry the jokes, the archival pictures carry the facts.
import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {boxOf, INK, JF, useGFrame, usePal} from './Kit';

export type Pt = [number, number];
export type Stroke = {pts: Pt[]; closed?: boolean; smooth?: boolean; width?: number; color?: 'mark' | 'subject' | 'box' | 'bone' | 'ink'; fill?: 'mark' | 'subject' | 'box' | 'bone' | 'ink'; fillOpacity?: number};
export type Drawing = {w: number; h: number; strokes: Stroke[]};

// ---------- builders (units are the drawing's own box) ----------
export const ell = (cx: number, cy: number, rx: number, ry: number, n = 22, a0 = 0, a1 = Math.PI * 2): Pt[] =>
  Array.from({length: n + 1}, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });
export const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]];
const S = (pts: Pt[], o: Partial<Stroke> = {}): Stroke => ({pts, ...o});
const shift = (st: Stroke[], dx: number, dy: number): Stroke[] => st.map((s) => ({...s, pts: s.pts.map(([x, y]) => [x + dx, y + dy] as Pt)}));

/** Catmull-Rom through the points (smooth) or straight segments. */
const pathOf = (pts: Pt[], smooth: boolean, closed: boolean) => {
  if (!smooth || pts.length < 3) return 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L') + (closed ? ' Z' : '');
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${p[1][0].toFixed(1)},${p[1][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + (closed ? ' Z' : '');
};

/**
 * A drawing placed at (x, y), `w` px wide, drawn on from `at` over `dur` frames (one stroke after another),
 * then boiling. `color` overrides the default teal; `out` removes it.
 */
export const Sketch: React.FC<{d: Drawing; x: number; y: number; w: number; at: number; dur?: number; rot?: number; out?: number; color?: string; seed?: string; amp?: number; width?: number; flip?: boolean; style?: React.CSSProperties}> = ({
  d, x, y, w, at, dur = 12, rot = 0, out = 1e7, color, seed = 's', amp = 1, width = 5, flip = false, style,
}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at || g >= out) return null;
  const sc = w / d.w;
  const h = d.h * sc;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp) * d.strokes.length;
  const boil = Math.floor(g / 5);
  const col = (c?: Stroke['color']) => (c === 'subject' ? pal.subject : c === 'box' ? boxOf(pal) : c === 'bone' ? '#EDE7DC' : c === 'ink' ? INK : color ?? pal.mark);
  const j = (Math.max(d.w, d.h) * 0.006 * amp) / Math.max(0.6, sc * 0.9);
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: `rotate(${rot}deg)${flip ? ' scaleX(-1)' : ''}`, ...style}} width={w} height={h} viewBox={`0 0 ${d.w} ${d.h}`}>
      {d.strokes.map((s, i) => {
        const k = Math.max(0, Math.min(1, p - i));
        if (k <= 0) return null;
        const pts = s.pts.map(([px, py], n) => [px + (random(`${seed}${boil}x${i}_${n}`) - 0.5) * j, py + (random(`${seed}${boil}y${i}_${n}`) - 0.5) * j] as Pt);
        const dd = pathOf(pts, s.smooth ?? false, s.closed ?? false);
        return (
          <g key={i}>
            {s.fill && <path d={dd} fill={col(s.fill)} opacity={(s.fillOpacity ?? 1) * k} stroke="none" />}
            <path d={dd} fill="none" stroke={col(s.color)} strokeWidth={((s.width ?? 1) * width) / sc} strokeLinejoin="round" strokeLinecap="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
          </g>
        );
      })}
    </svg>
  );
};

// ---------- the drawings ----------
const cabinStrokes = (): Stroke[] => {
  const st: Stroke[] = [
    S([[0, 180], [220, 180]], {width: 0.8}),
    S([[8, 80], [110, 22], [212, 80]], {width: 1.2}),
    S([[26, 80], [26, 178]]),
    S([[194, 80], [194, 178]]),
    S(rect(96, 128, 124, 178), {fill: 'mark', fillOpacity: 0.12}),
    S(rect(142, 100, 172, 126)),
    S([[157, 100], [157, 126]], {width: 0.6}),
    S([[142, 113], [172, 113]], {width: 0.6}),
    S([[150, 52], [150, 30], [170, 30], [170, 64]]),
  ];
  for (const y of [96, 114, 132, 150, 166]) {
    st.push(S([[26, y], [96, y]], {width: 0.6}), S([[124, y], [194, y]], {width: 0.6}));
  }
  for (const y of [88, 105, 123, 141, 158, 172]) st.push(S(ell(24, y, 5, 6.5, 10), {width: 0.6, closed: true}), S(ell(196, y, 5, 6.5, 10), {width: 0.6, closed: true}));
  return st;
};
export const CABIN: Drawing = {w: 220, h: 182, strokes: cabinStrokes()};
/** The cabin with a flag on a pole, as on the campaign prints. */
export const CABIN_FLAG: Drawing = {w: 220, h: 232, strokes: [
  ...shift(cabinStrokes(), 0, 50),
  S([[110, 72], [110, 4]]),
  S([[110, 4], [150, 12], [138, 22], [154, 32], [110, 28]], {smooth: true, fill: 'subject', fillOpacity: 0.85, color: 'subject'}),
]};
/** The cabin on a wheeled float, pulled through town. */
export const CABIN_WHEELS: Drawing = {w: 240, h: 232, strokes: [
  ...shift(cabinStrokes().slice(1), 10, 0),
  S(rect(0, 180, 240, 196)),
  S(ell(46, 210, 18, 18, 18), {closed: true}),
  S([[28, 210], [64, 210]], {width: 0.6}), S([[46, 192], [46, 228]], {width: 0.6}),
  S(ell(194, 210, 18, 18, 18), {closed: true}),
  S([[176, 210], [212, 210]], {width: 0.6}), S([[194, 192], [194, 228]], {width: 0.6}),
]};

/** The cabin as a costume worn over a portrait: the roof is a hat, the walls frame the shoulders, the door sits on the chest. */
export const COSTUME: Drawing = {w: 220, h: 182, strokes: [
  S([[8, 80], [110, 22], [212, 80]], {width: 1.3}),
  S([[150, 52], [150, 30], [170, 30], [170, 64]]),
  S([[26, 80], [26, 178]]),
  S([[194, 80], [194, 178]]),
  S([[0, 180], [220, 180]], {width: 0.8}),
  S(rect(96, 163, 124, 180), {fill: 'mark', fillOpacity: 0.18}),
  ...[163, 170, 177].flatMap((y) => [S([[26, y], [90, y]], {width: 0.6}), S([[130, y], [194, y]], {width: 0.6})]),
  ...[90, 108, 126, 144, 162].flatMap((y) => [S(ell(24, y, 5, 6.5, 10), {width: 0.6, closed: true}), S(ell(196, y, 5, 6.5, 10), {width: 0.6, closed: true})]),
]};

export const BARREL: Drawing = {w: 120, h: 150, strokes: [
  S(ell(60, 18, 44, 12, 22), {closed: true}),
  S([[16, 18], [8, 75], [16, 132]], {smooth: true}),
  S([[104, 18], [112, 75], [104, 132]], {smooth: true}),
  S([[16, 132], [60, 144], [104, 132]], {smooth: true}),
  S([[11, 46], [60, 58], [109, 46]], {smooth: true, width: 0.8}),
  S([[11, 104], [60, 116], [109, 104]], {smooth: true, width: 0.8}),
  S([[44, 31], [41, 85], [44, 141]], {smooth: true, width: 0.5}),
  S([[76, 31], [79, 85], [76, 141]], {smooth: true, width: 0.5}),
  S(rect(54, 82, 66, 94), {width: 0.8}),
  S([[66, 88], [80, 88], [80, 100]], {width: 0.8}),
]};

export const RACCOON: Drawing = {w: 140, h: 160, strokes: [
  S([[42, 30], [44, 10], [58, 24]], {width: 1}),
  S([[82, 24], [96, 10], [98, 30]], {width: 1}),
  S(ell(70, 45, 32, 25, 24), {closed: true, smooth: true}),
  S([[40, 44], [54, 36], [70, 43], [86, 36], [100, 44], [92, 56], [78, 51], [70, 56], [62, 51], [48, 56]], {closed: true, smooth: true, fill: 'mark', fillOpacity: 0.9, width: 0.7}),
  S(ell(57, 46, 3.5, 3.5, 10), {closed: true, fill: 'ink', color: 'ink', width: 0.4}),
  S(ell(83, 46, 3.5, 3.5, 10), {closed: true, fill: 'ink', color: 'ink', width: 0.4}),
  S(ell(70, 62, 5, 3.5, 10), {closed: true, fill: 'mark'}),
  S([[63, 67], [70, 71], [77, 67]], {smooth: true, width: 0.7}),
  S([[46, 70], [34, 110], [44, 148], [96, 148], [106, 110], [94, 70]], {smooth: true}),
  S([[56, 98], [62, 120]], {width: 0.7}),
  S([[84, 98], [78, 120]], {width: 0.7}),
  S([[100, 140], [124, 128], [136, 100], [132, 72], [120, 74], [122, 98], [112, 118], [98, 124]], {smooth: true, closed: true}),
  S([[133, 82], [121, 84]], {width: 0.9}),
  S([[130, 100], [119, 97]], {width: 0.9}),
  S([[120, 119], [112, 111]], {width: 0.9}),
]};

export const BALL: Drawing = {w: 200, h: 200, strokes: [
  S(ell(100, 100, 94, 94, 36), {closed: true, smooth: true, width: 1.2}),
  S(ell(100, 100, 42, 94, 30), {closed: true, smooth: true, width: 0.6}),
  S([[10, 70], [100, 58], [190, 70]], {smooth: true, width: 0.6}),
  S([[10, 130], [100, 142], [190, 130]], {smooth: true, width: 0.6}),
]};

export const CHAIR: Drawing = {w: 160, h: 200, strokes: [
  S([[30, 196], [30, 8], [130, 8], [130, 196]], {width: 1.1}),
  S([[30, 40], [130, 40]], {width: 0.7}),
  S([[30, 70], [130, 70]], {width: 0.7}),
  S([[14, 112], [146, 112], [146, 128], [14, 128], [14, 112]], {width: 1}),
  S([[18, 128], [18, 196]]),
  S([[142, 128], [142, 196]]),
]};

export const SPOON: Drawing = {w: 60, h: 200, strokes: [
  S(ell(30, 40, 22, 36, 24), {closed: true, smooth: true, color: 'box', width: 1.3}),
  S(ell(30, 36, 10, 20, 16), {closed: true, smooth: true, color: 'box', width: 0.6}),
  S([[30, 76], [26, 140], [32, 196]], {smooth: true, width: 1.4, color: 'box'}),
]};
export const PERFUME: Drawing = {w: 130, h: 160, strokes: [
  S(ell(55, 110, 45, 45, 26), {closed: true, smooth: true}),
  S(rect(43, 48, 67, 66)),
  S(ell(55, 38, 14, 10, 14), {closed: true}),
  S([[92, 92], [112, 62]], {smooth: true}),
  S(ell(114, 50, 10, 13, 14), {closed: true, fill: 'mark', fillOpacity: 0.3}),
  S([[30, 100], [40, 90]], {width: 0.6}),
]};
export const CORSET: Drawing = {w: 120, h: 180, strokes: [
  S([[20, 10], [44, 90], [20, 170]], {smooth: true}),
  S([[100, 10], [76, 90], [100, 170]], {smooth: true}),
  S([[20, 10], [60, 24], [100, 10]], {smooth: true}),
  S([[20, 170], [60, 158], [100, 170]], {smooth: true}),
  S([[54, 28], [66, 42], [54, 56], [66, 70], [54, 84], [66, 98], [54, 112], [66, 126], [54, 140], [66, 154]], {width: 0.7}),
]};
export const CARPET: Drawing = {w: 230, h: 120, strokes: [
  S(rect(25, 10, 205, 110)),
  S(rect(45, 26, 185, 94), {width: 0.6}),
  S([[115, 34], [165, 60], [115, 86], [65, 60]], {closed: true, fill: 'subject', fillOpacity: 0.5, color: 'subject', width: 0.8}),
  ...[20, 35, 50, 65, 80, 95].map((y) => S([[25, y], [6, y + 2]], {width: 0.5})),
  ...[20, 35, 50, 65, 80, 95].map((y) => S([[205, y], [224, y + 2]], {width: 0.5})),
]};

export const COLUMN: Drawing = {w: 110, h: 270, strokes: [
  S(rect(0, 8, 110, 22)),
  S([[8, 22], [102, 22], [96, 38], [14, 38], [8, 22]]),
  S(ell(10, 32, 9, 9, 14), {width: 0.7}),
  S(ell(100, 32, 9, 9, 14), {width: 0.7}),
  S([[18, 38], [21, 238]]),
  S([[92, 38], [89, 238]]),
  S([[38, 42], [39, 236]], {width: 0.5}),
  S([[55, 42], [55, 236]], {width: 0.5}),
  S([[72, 42], [71, 236]], {width: 0.5}),
  S([[10, 238], [100, 238], [104, 254], [6, 254], [10, 238]]),
  S(rect(0, 254, 110, 268)),
]};

/** A whiskey bottle shaped like a log cabin (the 1840 "Booz" bottle, drawn). */
export const CABIN_BOTTLE: Drawing = {w: 110, h: 220, strokes: [
  S(rect(42, 2, 68, 34)),
  S([[38, 2], [72, 2]], {width: 1.4}),
  S([[8, 78], [55, 34], [102, 78]], {width: 1.1}),
  S([[14, 76], [14, 214], [96, 214], [96, 76]]),
  ...[96, 116, 136, 156, 176, 196].map((y) => S([[14, y], [96, y]], {width: 0.5})),
  S(rect(44, 172, 66, 214), {fill: 'mark', fillOpacity: 0.15}),
  S(rect(26, 110, 44, 128), {width: 0.7}),
  S(rect(66, 110, 84, 128), {width: 0.7}),
]};

export const DOOR: Drawing = {w: 150, h: 250, strokes: [
  S(rect(4, 4, 146, 246), {width: 1.2}),
  S(rect(22, 24, 128, 112), {width: 0.7}),
  S(rect(22, 134, 128, 226), {width: 0.7}),
  S(ell(126, 124, 6, 6, 10), {closed: true, fill: 'mark'}),
]};

export const BANNER: Drawing = {w: 620, h: 170, strokes: [
  S([[50, 36], [200, 24], [420, 46], [570, 34]], {smooth: true, width: 1.1}),
  S([[50, 136], [200, 124], [420, 146], [570, 134]], {smooth: true, width: 1.1}),
  S([[50, 36], [50, 136]]),
  S([[570, 34], [570, 134]]),
  S([[50, 50], [6, 40], [26, 92], [6, 144], [50, 124]], {width: 0.9}),
  S([[570, 48], [614, 38], [594, 90], [614, 142], [570, 122]], {width: 0.9}),
]};

export const BANK: Drawing = {w: 230, h: 190, strokes: [
  S([[10, 52], [115, 10], [220, 52], [10, 52]], {width: 1.1}),
  S([[18, 62], [212, 62]]),
  ...[42, 78, 152, 188].map((x) => S([[x, 64], [x, 162]], {width: 0.9})),
  S([[0, 164], [230, 164]]),
  S([[0, 178], [230, 178]], {width: 0.8}),
]};

export const WIND: Drawing = {w: 300, h: 160, strokes: [
  S([[0, 50], [80, 42], [160, 52], [210, 36], [196, 10], [172, 18], [184, 40]], {smooth: true, width: 0.9}),
  S([[30, 96], [120, 88], [220, 98], [270, 80], [256, 56], [234, 64], [246, 84]], {smooth: true, width: 0.9}),
  S([[10, 140], [90, 134], [170, 142]], {smooth: true, width: 0.7}),
]};

/** A folded newspaper: masthead, rule, columns of lines. */
export const NEWSPAPER: Drawing = {w: 260, h: 320, strokes: [
  S([[10, 10], [250, 6], [254, 312], [6, 316], [10, 10]], {width: 1.1}),
  S([[34, 34], [226, 32]], {width: 2.2}),
  S([[60, 52], [200, 51]], {width: 0.9}),
  S([[26, 66], [234, 64]], {width: 0.6}),
  S([[26, 72], [234, 70]], {width: 0.6}),
  ...[0, 1, 2].flatMap((c) => Array.from({length: 11}, (_, i) => S([[28 + c * 72, 92 + i * 20], [28 + c * 72 + 56 - ((i * 7 + c * 3) % 4) * 6, 92 + i * 20]], {width: 0.5}))),
  S([[100, 86], [100, 300]], {width: 0.4}), S([[172, 86], [172, 300]], {width: 0.4}),
]};

export const PLANTATION: Drawing = {w: 300, h: 170, strokes: [
  S([[0, 160], [300, 160]], {width: 0.7}),
  S(rect(40, 60, 260, 158)),
  S([[30, 62], [150, 20], [270, 62]], {width: 1.1}),
  ...[70, 110, 190, 230].map((x) => S(rect(x - 12, 82, x + 12, 110), {width: 0.6})),
  ...[70, 110, 190, 230].map((x) => S(rect(x - 12, 122, x + 12, 150), {width: 0.6})),
  S(rect(136, 112, 164, 158), {width: 0.8}),
  S(rect(60, 28, 78, 50), {width: 0.7}),
  S(rect(222, 28, 240, 50), {width: 0.7}),
]};

// ---------- composed graphics ----------

/** A falling line chart: up, up, then off a cliff (1837). */
export const CrashChart: React.FC<{x: number; y: number; w: number; h: number; at: number; dur?: number; label?: string}> = ({x, y, w, h, at, dur = 30, label}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const axes = interpolate(g, [at, at + 6], [0, 1], clamp);
  const k = interpolate(g, [at + 4, at + dur], [0, 1], clamp);
  const pts: Pt[] = [[0.02, 0.62], [0.14, 0.5], [0.26, 0.54], [0.38, 0.38], [0.5, 0.42], [0.6, 0.26], [0.66, 0.3], [0.7, 0.72], [0.78, 0.84], [0.9, 0.8], [0.98, 0.9]];
  const d = 'M' + pts.map(([px, py]) => `${(px * w).toFixed(1)},${(py * h).toFixed(1)}`).join(' L');
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={w} height={h}>
      <path d={`M0,0 L0,${h} L${w},${h}`} fill="none" stroke="#EDE7DC" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - axes} opacity={0.8} />
      <path d={d} fill="none" stroke={pal.subject} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
      {label && k > 0.7 && <text x={w * 0.66} y={h * 0.2} fill={pal.subject} fontFamily={JF.display} fontSize={56} opacity={interpolate(k, [0.7, 0.8], [0, 1], clamp)}>{label}</text>}
    </svg>
  );
};

/** A zipper drawn across a mouth: the line, then the teeth, then the pull. */
export const Zipper: React.FC<{x: number; y: number; w: number; at: number; rot?: number}> = ({x, y, w, at, rot = 0}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 10], [0, 1], clamp);
  const n = Math.floor(w / 14);
  return (
    <svg style={{position: 'absolute', left: x, top: y - 20, overflow: 'visible', transform: `rotate(${rot}deg)`}} width={w} height={40}>
      <path d={`M0,20 L${w},20`} stroke={pal.mark} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
      {Array.from({length: n}).map((_, i) => (i / n < k ? <path key={i} d={`M${i * 14 + 7},${i % 2 ? 10 : 30} L${i * 14 + 7},20`} stroke={pal.mark} strokeWidth={4} strokeLinecap="round" /> : null))}
      {k >= 1 && <g><rect x={w - 6} y={8} width={22} height={24} rx={4} fill="none" stroke={pal.mark} strokeWidth={4} /><circle cx={w + 5} cy={20} r={4} fill={pal.mark} /></g>}
    </svg>
  );
};

/** A long speech on cream paper, unrolling down the frame (and off the bottom). */
export const SpeechScroll: React.FC<{x: number; y: number; w: number; at: number; dur?: number; to?: number; rot?: number}> = ({x, y, w, at, dur = 60, to = 1400, rot = 2}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const len = interpolate(g, [at, at + dur], [50, to], clamp);
  const lines = Math.floor((len - 40) / 24);
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: `rotate(${rot}deg)`}} width={w} height={len + 40}>
      <rect x={0} y={18} width={w} height={len - 18} fill="#f1eadb" />
      <path d={`M0,18 L0,${len} M${w},18 L${w},${len}`} stroke={pal.mark} strokeWidth={5} fill="none" strokeLinecap="round" />
      {Array.from({length: Math.max(0, lines)}).map((_, i) => (
        <path key={i} d={`M24,${48 + i * 24} L${24 + (w - 48) * (0.55 + random(`sl${i}`) * 0.45)},${48 + i * 24}`} stroke="#5b544a" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      ))}
      <rect x={-12} y={4} width={w + 24} height={28} rx={14} fill="#d8cdb8" stroke={pal.mark} strokeWidth={5} />
      <rect x={-12} y={len - 14} width={w + 24} height={30} rx={15} fill="#d8cdb8" stroke={pal.mark} strokeWidth={5} />
    </svg>
  );
};

/** 31 boxes crossed off one a frame-step at a time; the last one is circled. */
export const DayGrid: React.FC<{x: number; y: number; cell?: number; at: number; dur?: number; cols?: number; color?: string}> = ({x, y, cell = 86, at, dur = 45, cols = 8, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const c = color ?? pal.mark;
  const shown = interpolate(g, [at, at + 6], [0, 31], clamp);
  const crossed = interpolate(g, [at + 8, at + 8 + dur], [0, 31], clamp);
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={cols * cell} height={Math.ceil(31 / cols) * cell}>
      {Array.from({length: 31}).map((_, i) => {
        if (i >= shown) return null;
        const cx = (i % cols) * cell, cy = Math.floor(i / cols) * cell;
        const j = (s: string) => (random(`dg${s}${i}`) - 0.5) * 4;
        return (
          <g key={i}>
            <path d={`M${cx + 6 + j('a')},${cy + 6} L${cx + cell - 6},${cy + 6 + j('b')} L${cx + cell - 6 + j('c')},${cy + cell - 6} L${cx + 6},${cy + cell - 6 + j('d')} Z`} fill="none" stroke="#EDE7DC" strokeWidth={3} opacity={0.7} />
            <text x={cx + 14} y={cy + 34} fill="#EDE7DC" fontFamily={JF.mono} fontSize={22} opacity={0.8}>{i + 1}</text>
            {i < Math.floor(crossed) && i < 30 && <path d={`M${cx + 18},${cy + 22} L${cx + cell - 18},${cy + cell - 18} M${cx + cell - 18},${cy + 22} L${cx + 18},${cy + cell - 18}`} stroke={c} strokeWidth={5} strokeLinecap="round" />}
            {i === 30 && crossed >= 30.9 && <ellipse cx={cx + cell / 2} cy={cy + cell / 2} rx={cell * 0.62} ry={cell * 0.55} fill="none" stroke={c} strokeWidth={5} />}
          </g>
        );
      })}
    </svg>
  );
};

/** A cream index card with a typeset document text (the editor's quote, a clause of the Constitution, a platform). */
export const PaperCard: React.FC<{x: number; y: number; w: number; at: number; rot?: number; head?: string; title?: string; children?: React.ReactNode; pad?: number}> = ({x, y, w, at, rot = -1.5, head, title, children, pad = 44}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 6], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, padding: `${pad - 6}px ${pad}px ${pad}px`, background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
      transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2), color: '#1a1a1a'}}>
      {head && <div style={{fontFamily: JF.mono, fontSize: 22, letterSpacing: 3, color: '#555', textTransform: 'uppercase'}}>{head}</div>}
      {title && <div style={{fontFamily: JF.display, fontSize: 72, lineHeight: 1.05, color: '#111', margin: '6px 0 14px'}}>{title}</div>}
      {children}
    </div>
  );
};

/** A big orange rubber stamp word (NONE, MYTH, OUT) slammed on at an angle, with a rough border. */
export const RubberStamp: React.FC<{text: string; x: number; y: number; at: number; size?: number; rot?: number; color?: string}> = ({text, x, y, at, size = 110, rot = -12, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.5, 0.94, 1], clamp);
  const c = color ?? boxOf(pal);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: 'center', border: `${size * 0.07}px solid ${c}`, borderRadius: size * 0.12,
      padding: `${size * 0.02}px ${size * 0.2}px 0`, fontFamily: JF.display, fontSize: size, lineHeight: 1.1, color: c, whiteSpace: 'nowrap', opacity: 0.92, textShadow: '0 4px 14px rgba(0,0,0,0.45)'}}>{text}</div>
  );
};

/** A straight hand-drawn strike line across something (rejected, myth). */
export const Strike: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; color?: string; width?: number}> = ({x1, y1, x2, y2, at, color, width = 9}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x1},${y1} L${x2},${y2}`} stroke={color ?? boxOf(pal)} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
    </svg>
  );
};

/** The rolling ball: a drawn ball with a slogan on it, rolling from x0 to x1 (smooth, 30 fps) while its lines step at 12. */
export const RollingBall: React.FC<{x0: number; x1: number; y: number; d: number; a: number; b: number; text?: string}> = ({x0, x1, y, d, a, b, text = 'TIP & TY'}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < a) return null;
  const x = interpolate(f, [a, b], [x0, x1], clamp);
  const ang = ((x - x0) / (Math.PI * d)) * 360;
  return (
    <div style={{position: 'absolute', left: x - d / 2, top: y - d, width: d, height: d, transform: `rotate(${ang}deg)`}}>
      <Sketch d={BALL} x={0} y={0} w={d} at={a} dur={8} width={6} seed="ball" />
      <div style={{position: 'absolute', left: 0, top: d * 0.38, width: d, textAlign: 'center', fontFamily: JF.display, fontSize: d * 0.17, color: boxOf(pal), textShadow: '0 2px 8px #000'}}>{text}</div>
    </div>
  );
};

/** Dark desk background for drawing-only scenes. */
export const Board: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 40%, #2a2620 0%, #16140f 70%, #0d0c09 100%)'}} />
    <AbsoluteFill style={{opacity: 0.12, backgroundImage: 'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '100% 64px'}} />
    {children}
  </AbsoluteFill>
);

/** A music bed that starts at `from` (narration frame) and fades out by `to`, independent of the chapter end. */
export type Bed = {src: string; volume: number; from?: number; to?: number; startFrom?: number};
