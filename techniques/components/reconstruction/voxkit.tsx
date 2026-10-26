// Techniques from the Vox motion study (techniques/vox_motion_study.md), built for the channel:
//   Sheet     a document laid on the desk, optionally tilted back in 3D with a depth-of-field band (§3.3)
//   Swipe     the coral highlighter, running along printed lines at reading speed (in page pixels, inside a Sheet)
//   Spot      everything on the page steps back except the given boxes (§3.2, inside a Sheet)
//   FocusIn   a picture rises into place while coming into focus (§3.9)
//   carry     motion carried through a hard cut (§3.5)
//   Tear      the top layer tears in two and falls away to reveal what's underneath (§3.6)
//   WordRun   page after page flashes past with the same word dead centre, speeding up (§3.4)
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {useGFrame} from '../kit/Kit';
import {Sfx} from '../kit/common';

export const CORAL = '#FF6F61';
export const TEAL = '#2FE0C4';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export type Box = [number, number, number, number];

/** Torn edge as a clip-path polygon over a w x h box (px), all four sides ragged. */
export const tornPoly = (seed: string, w: number, h: number, amp = 10, n = 28) => {
  const j = (k: string) => random(`${seed}${k}`) * amp;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * w}px ${j(`t${i}`)}px`);
  for (let i = 0; i <= n; i++) pts.push(`${w - j(`r${i}`)}px ${(i / n) * h}px`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * w}px ${h - j(`b${i}`)}px`);
  for (let i = n; i >= 0; i--) pts.push(`${j(`l${i}`)}px ${(i / n) * h}px`);
  return `polygon(${pts.join(',')})`;
};

export type SheetCam = {x: number; y: number; z: number; tilt?: number; rot?: number; dofY?: number; dof?: number; band?: number};

/** Interpolate sheet cameras between keyframes [frame, cam] with an ease in-out (zoom in log space). */
export const camAt = (keys: [number, SheetCam][], f: number): SheetCam => {
  let i = keys.length - 2;
  for (let k = 0; k < keys.length - 1; k++) if (f < keys[k + 1][0]) { i = Math.max(0, k); break; }
  const [f0, a] = keys[Math.max(0, i)];
  const [f1, b] = keys[Math.min(keys.length - 1, i + 1)];
  const t = f1 === f0 ? 1 : Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (f - f0) / (f1 - f0))));
  const L = (p: number | undefined, q: number | undefined, d = 0) => (p ?? d) + ((q ?? d) - (p ?? d)) * t;
  return {x: L(a.x, b.x), y: L(a.y, b.y), z: Math.exp(L(Math.log(a.z), Math.log(b.z))), tilt: L(a.tilt, b.tilt), rot: L(a.rot, b.rot),
    dofY: L(a.dofY ?? a.y, b.dofY ?? b.y), dof: L(a.dof, b.dof), band: L(a.band, b.band, 120)};
};

/**
 * A document on the desk. The camera looks at page point (x, y) at zoom z; `tilt` lays the page back (degrees) around
 * that point. With `dof` > 0 only a horizontal band around `dofY` stays sharp. Children are drawn in page pixels.
 */
export const Sheet: React.FC<{src: string; size: [number, number]; cam: SheetCam; seed?: string; filter?: string; offset?: [number, number]; children?: React.ReactNode}> = ({
  src, size: [w, h], cam, seed = 'sh', filter = 'grayscale(1) sepia(0.12) contrast(1.12) brightness(1.03)', offset = [0, 0], children,
}) => {
  const {x, y, z, tilt = 0, rot = 0, dofY = y, dof = 0, band = 120} = cam;
  const img = (style: React.CSSProperties) => <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h, filter, ...style}} />;
  const m = `linear-gradient(to bottom, transparent ${dofY - band * 2.2}px, #000 ${dofY - band}px, #000 ${dofY + band}px, transparent ${dofY + band * 2.2}px)`;
  return (
    <AbsoluteFill style={{perspective: 1400, perspectiveOrigin: '960px 540px', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 960 - x + offset[0], top: 540 - y + offset[1], width: w, height: h, transformOrigin: `${x}px ${y}px`,
        transform: `scale(${z}) rotateX(${tilt}deg) rotateZ(${rot}deg)`, filter: `drop-shadow(0 ${18 / z}px ${30 / z}px rgba(0,0,0,0.75))`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(seed, w, h, 12 / Math.max(z, 0.3))}}>
          {dof > 0 ? (
            <>
              {img({filter: `${filter} blur(${dof / z}px)`})}
              {img({WebkitMaskImage: m, maskImage: m})}
            </>
          ) : img({})}
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** The coral highlighter along printed lines (page px), from `from` to `to` at an even reading speed, stepped. */
export const Swipe: React.FC<{lines: Box[]; from: number; to: number; seed?: string; color?: string; out?: number}> = ({lines, from, to, seed = 'sw', color = CORAL, out = Infinity}) => {
  const g = useGFrame();
  if (g < from || g >= out) return null;
  const total = lines.reduce((s, b) => s + b[2], 0);
  let left = interpolate(g, [from, to], [0, total], clamp);
  return (
    <>
      {lines.map(([x, y, w, h], i) => {
        const fillW = Math.max(0, Math.min(w, left));
        left -= w;
        if (fillW <= 0) return null;
        const pts: string[] = [];
        for (let k = 0; k <= 30; k++) pts.push(`${(k / 30) * 100}% ${random(`${seed}t${i}${k}`) * 14}%`);
        for (let k = 30; k >= 0; k--) pts.push(`${(k / 30) * 100}% ${100 - random(`${seed}b${i}${k}`) * 14}%`);
        return <div key={i} style={{position: 'absolute', left: x - h * 0.15, top: y - h * 0.08, width: fillW + h * 0.3, height: h * 1.16, background: color, opacity: 0.8,
          mixBlendMode: 'multiply', clipPath: `polygon(${pts.join(',')})`}} />;
      })}
    </>
  );
};

/** Darkens the whole page except the boxes (page px), softly edged. */
export const Spot: React.FC<{size: [number, number]; boxes: Box[]; at: number; out?: number; dark?: number; id: string}> = ({size: [w, h], boxes, at, out = Infinity, dark = 0.62, id}) => {
  const f = useCurrentFrame();
  if (f < at || f >= out) return null;
  const o = interpolate(f, [at, at + 2], [0, 1], clamp);   // a hard cut, two frames
  const pad = 14;
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <defs>
        <filter id={`${id}b`}><feGaussianBlur stdDeviation={10} /></filter>
        <mask id={`${id}m`}>
          <rect width={w} height={h} fill="#fff" />
          <g filter={`url(#${id}b)`}>{boxes.map(([x, y, bw, bh], i) => <rect key={i} x={x - pad} y={y - pad} width={bw + pad * 2} height={bh + pad * 2} rx={8} fill="#000" />)}</g>
        </mask>
      </defs>
      <rect width={w} height={h} fill={`rgba(12,11,9,${dark})`} mask={`url(#${id}m)`} />
    </svg>
  );
};

/** A picture rises a little into place while coming into focus, like being brought up into a lens. */
export const FocusIn: React.FC<{at: number; dur?: number; children: React.ReactNode}> = ({at, dur = 9, children}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = Easing.out(Easing.cubic)(interpolate(f, [at, at + dur], [0, 1], clamp));
  return <AbsoluteFill style={{filter: p < 1 ? `blur(${(1 - p) * 22}px)` : undefined, transform: `translateY(${(1 - p) * 26}px) scale(${1.03 - 0.03 * p})`, opacity: Math.min(1, p * 2.5)}}>{children}</AbsoluteFill>;
};

/**
 * Motion carried through a hard cut: horizontal offset (px) for a shot shown from `a` to `b`. It enters already moving at
 * `v` px/frame and settles to a slow drift; in its last 8 frames it speeds back up to `v`, so the next shot can take over.
 */
export const carry = (f: number, a: number, b: number, v = -11, inTau = 7) => {
  const t = f - a;
  let x = v * inTau * (1 - Math.exp(-Math.max(0, t) / inTau)) - 0.3 * Math.max(0, t);
  const s = f - (b - 8);
  if (s > 0) x += 0.5 * (v / 8) * s * s;
  return x;
};

/** The top layer tears roughly top-to-bottom and both halves fall away from `at`, revealing `children`. */
export const Tear: React.FC<{at: number; top: React.ReactNode; seed?: string; children: React.ReactNode}> = ({at, top, seed = 'tr', children}) => {
  const f = useCurrentFrame();
  if (f < at) return <AbsoluteFill>{top}</AbsoluteFill>;
  const pts: [number, number][] = [];
  const n = 26;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([1130 - 300 * t + (random(`${seed}x${i}`) - 0.5) * 70 + (i % 2 ? 14 : -14), -40 + 1160 * t]);
  }
  const line = pts.map(([x, y]) => `${x}px ${y}px`).join(',');
  const pR = Easing.in(Easing.cubic)(interpolate(f, [at, at + 16], [0, 1], clamp));
  const pL = Easing.in(Easing.cubic)(interpolate(f, [at + 5, at + 21], [0, 1], clamp));
  const fibre = (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <polyline points={pts.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="#efe9dc" strokeWidth={9} strokeLinejoin="round" />
    </svg>
  );
  const piece = (clip: string, tf: string, key: string) => (
    <div key={key} style={{position: 'absolute', inset: 0, transform: tf, transformOrigin: key === 'R' ? '1920px 0px' : '0px 1080px', filter: 'drop-shadow(0 20px 26px rgba(0,0,0,0.7))'}}>
      <div style={{position: 'absolute', inset: 0, clipPath: clip}}>{top}{fibre}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      {children}
      {pL < 1 && piece(`polygon(0px 0px, ${line}, 0px 1080px)`, `translate(${-1300 * pL}px, ${160 * pL}px) rotate(${-10 * pL}deg)`, 'L')}
      {pR < 1 && piece(`polygon(${line}, 1920px 1080px, 1920px 0px)`, `translate(${1400 * pR}px, ${220 * pR}px) rotate(${14 * pR}deg)`, 'R')}
      <Sfx at={at} src="sfx/page_turn.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export type RunItem = {src: string; box: Box; tag: string};
/**
 * Word match cut: each item is a 1920x1080 crop with the word's box centred. Shots start at `durs[0]` frames and get
 * shorter; the last one holds, and the coral highlighter runs over its word.
 */
export const WordRun: React.FC<{items: RunItem[]; at: number; durs: number[]; holdSwipe?: number}> = ({items, at, durs, holdSwipe = 6}) => {
  const f = useCurrentFrame();
  const starts: number[] = [];
  let s = at;
  items.forEach((_, i) => { starts.push(s); s += durs[Math.min(i, durs.length - 1)]; });
  let k = 0;
  starts.forEach((st, i) => { if (f >= st) k = i; });
  const it = items[k];
  const local = f - starts[k];
  const last = k === items.length - 1;
  const sc = 1.025 - 0.025 * Math.min(1, local / 6);
  return (
    <AbsoluteFill style={{background: '#0d0c09'}}>
      <AbsoluteFill style={{transform: `scale(${sc})`}}>
        <Img src={staticFile(it.src)} style={{width: 1920, height: 1080, filter: 'grayscale(1) sepia(0.1) contrast(1.25) brightness(1.04)'}} />
        {last && <Swipe lines={[it.box]} from={starts[k] + holdSwipe} to={starts[k] + holdSwipe + 8} seed="wr" />}
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%)'}} />
      <div style={{position: 'absolute', left: 44, top: 1030, fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, letterSpacing: 1, color: 'rgba(255,255,255,0.88)',
        textTransform: 'uppercase', textShadow: '0 1px 6px #000'}}>{it.tag}</div>
      {starts.map((st, i) => <Sfx key={i} at={st} src="sfx/tick.wav" volume={0.35} />)}
    </AbsoluteFill>
  );
};

/**
 * A note on a torn paper slip (the user's pick over bare handwriting, Oct 2026): the slip slaps on, then the words write
 * on in dark ink. Cream with deep-teal ink by default; `coral` for the subject or punchline. `size` is the hand's px.
 */
export const Slip: React.FC<{text: string; x: number; y: number; at: number; rot?: number; size?: number; coral?: boolean; dur?: number; seed?: string}> = ({
  text, x, y, at, rot = -3, size = 62, coral, dur = 10, seed = text,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.25, 0.97, 1], clamp);
  const w = interpolate(g, [at + 3, at + 3 + dur], [0, 1], clamp);
  const pts: string[] = [];
  for (let i = 0; i <= 16; i++) pts.push(`${(i / 16) * 100}% ${random(`${seed}t${i}`) * 9}%`);
  for (let i = 16; i >= 0; i--) pts.push(`${(i / 16) * 100}% ${100 - random(`${seed}b${i}`) * 9}%`);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: 'left center', opacity: interpolate(f, [at, at + 2], [0, 1], clamp),
      filter: 'drop-shadow(4px 5px 0 rgba(0,0,0,0.55))'}}>
      <div style={{background: coral ? '#f3c6bf' : '#ece6d8', clipPath: `polygon(${pts.join(',')})`, padding: `${size * 0.1}px ${size * 0.38}px ${size * 0.16}px`,
        fontFamily: '"Nanum Pen Script", cursive', fontSize: size, lineHeight: 1, color: coral ? '#5a1d17' : '#0f3e37', whiteSpace: 'nowrap'}}>
        <span style={{clipPath: `inset(-20% ${(1 - w) * 100}% -20% -5%)`, display: 'inline-block'}}>{text}</span>
      </div>
      <Sfx at={at} src="sfx/tick_soft.wav" volume={0.3} />
    </div>
  );
};
