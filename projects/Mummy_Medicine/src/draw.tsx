// Hand-drawn pieces for When Europe Ate Mummies: teal line art that draws on and boils at 12 fps, shape morphs,
// the trade map, index cards, the supply/demand chart, and music beds with their own windows.
import React from 'react';
import {Audio, interpolate, random, Sequence, staticFile} from 'remotion';
import {clamp} from './lib/anim';
import {JF, useGFrame, useHand, usePal} from './kit/Kit';

export type P = [number, number];

/** Resample a polyline to n evenly spaced points (so two shapes can morph point for point). */
export const resample = (pts: P[], n: number, closed = false): P[] => {
  const src = closed ? [...pts, pts[0]] : pts;
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < src.length; i++) {
    const d = Math.hypot(src[i][0] - src[i - 1][0], src[i][1] - src[i - 1][1]);
    seg.push(d);
    total += d;
  }
  const out: P[] = [];
  for (let k = 0; k < n; k++) {
    let dist = (total * k) / (n - 1);
    let i = 0;
    while (i < seg.length - 1 && dist > seg[i]) dist -= seg[i++];
    const t = seg[i] ? dist / seg[i] : 0;
    out.push([src[i][0] + (src[i + 1][0] - src[i][0]) * t, src[i][1] + (src[i + 1][1] - src[i][1]) * t]);
  }
  return out;
};

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export const smoothPath = (pts: P[], closed = false) => {
  if (pts.length < 2) return '';
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${p[1][0].toFixed(1)},${p[1][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1], [x1, y1] = p[i], [x2, y2] = p[i + 1], [x3, y3] = p[i + 2];
    d += ` C${(x1 + (x2 - x0) / 6).toFixed(1)},${(y1 + (y2 - y0) / 6).toFixed(1)} ${(x2 - (x3 - x1) / 6).toFixed(1)},${(y2 - (y3 - y1) / 6).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }
  return d;
};

const boilJ = (g: number, key: string, amp: number) => (random(`${key}${Math.floor(g / 5)}`) - 0.5) * amp;

/**
 * A sketched line: `pts` in local units, placed at (x, y) and scaled by `s`. Draws on from `at` over `dur`.
 * With `to`, morphs into another shape between frames `ma` and `mb`.
 */
export const Sketch: React.FC<{pts: P[]; x: number; y: number; s?: number; at: number; dur?: number; to?: P[]; ma?: number; mb?: number; closed?: boolean;
  color?: string; width?: number; smooth?: boolean; fill?: string; fillOpacity?: number; out?: number; dashed?: boolean; n?: number}> = ({
  pts, x, y, s = 1, at, dur = 12, to, ma = 1e7, mb = 1e7 + 1, closed = false, color, width = 6, smooth = true, fill, fillOpacity = 0.5, out = 1e7, dashed, n = 90,
}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at || g >= out) return null;
  const A = resample(pts, n, closed);
  const B = to ? resample(to, n, closed) : A;
  const u = interpolate(g, [ma, mb], [0, 1], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
  const cur: P[] = A.map(([ax, ay], i) => [x + (ax + (B[i][0] - ax) * u) * s + boilJ(g, `x${i % 7}`, 2), y + (ay + (B[i][1] - ay) * u) * s + boilJ(g, `y${i % 5}`, 2)]);
  const d = smooth ? smoothPath(cur, closed) : 'M' + cur.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' L') + (closed ? ' Z' : '');
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1920} height={1080}>
      {fill && p >= 1 && <path d={d} fill={fill} opacity={fillOpacity} stroke="none" />}
      <path d={d} fill="none" stroke={color ?? pal.mark} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={dashed ? '0.012 0.012' : 1} strokeDashoffset={dashed ? 0 : 1 - p}
        style={dashed ? {clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`} : undefined} />
    </svg>
  );
};

// ---------- shapes (local units) ----------
export const MOUNTAIN: P[] = [[0, 400], [70, 290], [120, 320], [190, 170], [240, 120], [290, 190], [330, 160], [400, 260], [460, 330], [520, 400]];
export const TAR: P[] = [[262, 180], [258, 230], [270, 280], [262, 330], [275, 380]];
export const MUMMY_CASE: P[] = [[260, 0], [310, 20], [325, 75], [312, 120], [345, 160], [350, 240], [335, 330], [318, 400], [310, 440], [210, 440], [202, 400], [185, 330], [170, 240], [175, 160], [208, 120], [195, 75], [210, 20]];

// ---------- the hand-drawn Mediterranean (screen pixels) ----------
export const COAST_N: P[] = [[60, 600], [140, 545], [230, 505], [320, 470], [400, 420], [470, 395], [540, 400], [600, 380], [650, 400], [700, 460], [760, 520], [800, 590], [770, 610],
  [735, 575], [700, 520], [670, 470], [650, 430], [690, 380], [730, 360], [790, 420], [860, 480], [900, 560], [950, 600], [990, 540], [1040, 500], [1110, 470], [1230, 470],
  [1340, 480], [1420, 520], [1470, 580], [1490, 650], [1480, 720]];
export const COAST_S: P[] = [[60, 650], [180, 640], [330, 610], [470, 600], [620, 640], [760, 680], [900, 710], [1040, 735], [1160, 760], [1260, 770], [1330, 765], [1400, 760], [1480, 735]];
export const BRITAIN: P[] = [[250, 120], [300, 90], [330, 140], [315, 210], [340, 260], [270, 285], [215, 265], [235, 200], [215, 150]];
export const IBERIA_W: P[] = [[60, 600], [40, 520], [60, 440], [150, 400], [240, 390], [330, 370], [400, 340]];
export const NILE: P[] = [[1300, 765], [1305, 820], [1312, 900], [1318, 1000]];
export const PLACES = {cairo: [1312, 812] as P, saqqara: [1300, 840] as P, alexandria: [1262, 772] as P, venice: [732, 352] as P, lyon: [520, 330] as P, london: [300, 215] as P, gibraltar: [80, 625] as P};
export const ROUTE_LONDON: P[] = [PLACES.alexandria, [1100, 690], [800, 650], [500, 620], [200, 615], [70, 625], [20, 520], [60, 380], [180, 300], PLACES.london];
export const ROUTE_VENICE: P[] = [PLACES.alexandria, [1150, 680], [960, 640], [880, 560], [800, 460], PLACES.venice];

/** Position along a polyline at fraction u (0..1). */
export const along = (pts: P[], u: number): P => {
  const r = resample(pts, 200);
  return r[Math.min(199, Math.max(0, Math.round(u * 199)))];
};

/** The drawn map: coasts, Britain, Nile, optional labels. Everything draws on from `at`. */
export const MedMap: React.FC<{at: number; dim?: boolean}> = ({at, dim}) => (
  <div style={{opacity: dim ? 0.55 : 1}}>
    <Sketch pts={COAST_N} x={0} y={0} at={at} dur={18} width={5} n={160} />
    <Sketch pts={IBERIA_W} x={0} y={0} at={at + 4} dur={12} width={5} />
    <Sketch pts={COAST_S} x={0} y={0} at={at + 6} dur={16} width={5} n={120} />
    <Sketch pts={BRITAIN} x={0} y={0} at={at + 10} dur={10} width={5} closed />
    <Sketch pts={NILE} x={0} y={0} at={at + 14} dur={8} width={4} />
  </div>
);

/** A small crate that hops along a route between frames a and b. */
export const Crate: React.FC<{route: P[]; a: number; b: number; size?: number; color?: string; label?: string}> = ({route, a, b, size = 34, color, label}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < a) return null;
  const u = interpolate(g, [a, b], [0, 1], clamp);
  const [cx, cy] = along(route, u);
  const hop = u < 1 ? Math.abs(Math.sin(u * Math.PI * 9)) * 14 : 0;
  const c = color ?? pal.subject;
  return (
    <div style={{position: 'absolute', left: cx - size / 2, top: cy - size / 2 - hop, width: size, height: size * 0.8}}>
      <svg width={size} height={size * 0.8} style={{overflow: 'visible'}}>
        <rect x={2} y={2} width={size - 4} height={size * 0.8 - 4} fill={c} fillOpacity={0.35} stroke={c} strokeWidth={3} />
        <path d={`M2,2 L${size - 2},${size * 0.8 - 2} M${size - 2},2 L2,${size * 0.8 - 2}`} stroke={c} strokeWidth={2} />
      </svg>
      {label && <div style={{position: 'absolute', left: size + 8, top: -6, fontFamily: JF.mono, fontSize: 20, color: '#f4efe6', whiteSpace: 'nowrap', textShadow: '0 1px 6px #000'}}>{label}</div>}
    </div>
  );
};

/** A cream index card with handwritten lines that write on at their own frames; optional tick boxes. */
export const IndexCard: React.FC<{x: number; y: number; w: number; h: number; at: number; rot?: number; title?: string; lines: {text: string; at: number; color?: string; tick?: boolean}[]; size?: number; lineH?: number; out?: number;
  children?: React.ReactNode}> = ({x, y, w, h, at, rot = -2, title, lines, size = 40, lineH = 62, out = 1e7, children}) => {
  const g = useGFrame();
  const hand = useHand();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 5], [0.6, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${k}) rotate(${rot}deg)`, opacity: Math.min(1, (k - 0.6) * 5),
      background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)', backgroundImage: `repeating-linear-gradient(transparent 0, transparent ${lineH - 1}px, rgba(47,120,170,0.28) ${lineH}px, transparent ${lineH + 1}px)`,
      backgroundPositionY: 34}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, height: 3, background: 'rgba(220,70,70,0.45)'}} />
      {title && <div style={{position: 'absolute', left: 36, top: 14, fontFamily: JF.mono, fontSize: 26, letterSpacing: 2, color: '#333', whiteSpace: 'nowrap'}}>{title}</div>}
      {lines.map((l, i) => {
        if (g < l.at) return null;
        const p = interpolate(g, [l.at, l.at + 9], [0, 1], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: 36, top: 84 + i * lineH, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap'}}>
            {l.tick !== undefined && (
              <svg width={34} height={34}>
                <rect x={3} y={3} width={28} height={28} fill="none" stroke="#333" strokeWidth={2.5} />
                {l.tick && p >= 0.6 && <path d="M8,18 L15,26 L29,6" fill="none" stroke="#1a8a78" strokeWidth={4.5} strokeLinecap="round" />}
              </svg>
            )}
            <div style={{fontFamily: hand.family, fontWeight: hand.weight, fontSize: size * hand.scale, lineHeight: 1, color: l.color ?? '#1d2a33', clipPath: `inset(-30% ${(1 - p) * 100}% -30% -5%)`}}>{l.text}</div>
          </div>
        );
      })}
      {children}
    </div>
  );
};

/** Music bed with its own window: fades in at `from`, out at `to` (narration frames). */
export const Bed: React.FC<{src: string; from: number; to: number; volume?: number; startFrom?: number; fadeIn?: number; fadeOut?: number}> = ({src, from, to, volume = 0.2, startFrom = 0, fadeIn = 20, fadeOut = 30}) => (
  <Sequence from={Math.max(0, from)} durationInFrames={Math.max(1, to - Math.max(0, from))} layout="none">
    <Audio src={staticFile(src)} startFrom={startFrom}
      volume={(f) => interpolate(f, [0, fadeIn, Math.max(fadeIn + 1, to - from - fadeOut), Math.max(fadeIn + 2, to - from)], [0, volume, volume, 0], clamp)} />
  </Sequence>
);

/** The supply/demand sketch chart: axes, a falling supply line, a flat demand line, and the gap hatched coral. */
export const SupplyChart: React.FC<{x: number; y: number; w: number; h: number; at: number; supplyAt: number; demandAt: number; gapAt: number}> = ({x, y, w, h, at, supplyAt, demandAt, gapAt}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const sup: P[] = [[0, 0.22], [0.25, 0.25], [0.45, 0.42], [0.65, 0.66], [1, 0.86]].map(([a, b]) => [x + a * w, y + b * h]);
  const dem: P[] = [[0, 0.2], [0.35, 0.18], [0.7, 0.2], [1, 0.17]].map(([a, b]) => [x + a * w, y + b * h]);
  const gp = interpolate(g, [gapAt, gapAt + 14], [0, 1], clamp);
  const S = resample(sup, 60);
  const D = resample(dem, 60);
  const poly = [...D, ...[...S].reverse()].map((q) => q.join(',')).join(' ');
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <defs>
          <pattern id="hatch" width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1={0} y1={0} x2={0} y2={16} stroke={pal.subject} strokeWidth={5} /></pattern>
          <clipPath id="gapclip"><rect x={x} y={y - 20} width={w * gp} height={h + 40} /></clipPath>
        </defs>
        {gp > 0 && <polygon points={poly} fill="url(#hatch)" opacity={0.7} clipPath="url(#gapclip)" />}
      </svg>
      <Sketch pts={[[x, y - 30], [x, y + h], [x + w + 30, y + h]]} x={0} y={0} at={at} dur={8} width={5} smooth={false} color="#f4efe6" />
      <Sketch pts={dem} x={0} y={0} at={demandAt} dur={14} width={8} color="#FF9F1C" />
      <Sketch pts={sup} x={0} y={0} at={supplyAt} dur={16} width={8} />
    </>
  );
};
