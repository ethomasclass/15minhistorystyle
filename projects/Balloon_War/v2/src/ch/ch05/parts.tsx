// Builder B's helpers for chapters 5-7 (Ch05, Ch06, Ch07 import them). Nothing here changes the shared kit.
//   NoPhoto     Ch01's small mono label for a person with no photo (copied from Ch01)
//   Until       show children only before a (scene-relative) frame
//   CropPrint   Print (kit/print.tsx) with a crop window and an optional slow push; children get a source->screen mapper,
//               and an existing tools/mask.py mask can tint the subject coral
//   Scope       a round "under the microscope" view of a micrograph
//   FrontPage   a drawn, text-free newspaper front page (blank, cut-out column, or censor bars)
//   Typed       a typed sheet on the desk, typed out letter by letter (with its own typewriter sound), lines can be struck out
//   RubberStamp an inked rubber stamp slammed on a sheet
//   Strike      a hand-drawn scratch line through a note
//   Tally       weeks as hand-drawn tally marks
//   LaunchBars  launches per month (Mikesh), a drawn bar chart: the placeholder for the 3D LandingMap's launch counter
import React from 'react';
import {Audio, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, Tint, Traced, useGFrame, usePal} from '../../kit/Kit';
import type {MaskRef} from '../../kit/maskref';

/** A small mono label for a person with no photo (always anonymous silhouettes). Copied from Ch01. */
export const NoPhoto: React.FC<{text: string; at: number}> = ({text, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: 110, bottom: 104, fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, color: 'rgba(244,239,230,0.8)',
      textTransform: 'uppercase', textShadow: '0 1px 8px rgba(0,0,0,0.95)', opacity: interpolate(g, [at, at + 6], [0, 1], clamp)}}>{text}</div>
  );
};

export const Until: React.FC<{f: number; children: React.ReactNode}> = ({f, children}) => (useGFrame() < f ? <>{children}</> : null);

export type ToScreen = (sx: number, sy: number) => [number, number];

/**
 * An archival print on the desk (same look and slap-in as kit Print), showing the source around (fx, fy) in a w x h window.
 * `z` [start, end] zooms the crop smoothly between frames `a` and `b` (one camera move). `children(S)` draws marks in screen
 * pixels: S(sx, sy) maps a source pixel to the screen. `mask` (an existing tools/mask.py mask) tints the subject coral from `tintAt`.
 */
export const CropPrint: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; h: number; fx: number; fy: number;
  z?: [number, number]; a?: number; b?: number; at: number; rot?: number; tag?: string; dim?: number; mask?: MaskRef; tintAt?: number; traceAt?: number;
  children?: (S: ToScreen) => React.ReactNode}> = ({src, size, x, y, w, h, fx, fy, z = [1, 1], a, b, at, rot = 0, tag, dim = 0, mask, tintAt, traceAt, children}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  if (g < at) return null;
  const [W, H] = size;
  const zz = interpolate(f, [a ?? at, b ?? at + 1], z, clamp);
  const s = Math.max(w / W, h / H) * zz;
  const left = Math.min(0, Math.max(w - W * s, w / 2 - fx * s));
  const top = Math.min(0, Math.max(h - H * s, h / 2 - fy * s));
  const k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  const S: ToScreen = (sx, sy) => [x + left + sx * s, y + top + sy * s];
  const tint = mask && tintAt !== undefined ? interpolate(g, [tintAt, tintAt + 6], [0, 1], clamp) : 0;
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%'}}>
        <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', boxShadow: '0 26px 46px rgba(0,0,0,0.8)', background: '#111'}}>
          <Img src={staticFile(src)} style={{position: 'absolute', left, top, width: W * s, height: H * s, filter: 'grayscale(1) contrast(1.15) brightness(0.95)'}} />
          {mask && tint > 0 && <Tint mask={mask.alpha} place={{left, top, scale: s}} size={size} strength={tint} />}
          {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={{left, top, scale: s}} at={traceAt} dur={12} width={5} />}
          {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(8,7,5,${dim})`}} />}
        </div>
        {tag ? <div style={{position: 'absolute', left: 0, top: h + 14, width: 'max-content', maxWidth: w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
          color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div> : null}
      </div>
      {children?.(S)}
    </>
  );
};

/** A round microscope view: the micrograph in a dark eyepiece ring, slapped onto the desk. */
export const Scope: React.FC<{src: string; cx: number; cy: number; r: number; at: number; out?: number; pos?: string; zoom?: number; tag?: string}> = ({
  src, cx, cy, r, at, out = Infinity, pos = '50% 50%', zoom = 1, tag,
}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.2, 0.97, 1], clamp);
  const drift = 1 + 0.0006 * (f - at);
  return (
    <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2 + 40, transform: `scale(${k})`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: r * 2, height: r * 2, borderRadius: '50%', overflow: 'hidden', background: '#000',
        boxShadow: '0 0 0 16px #0b0a08, 0 0 0 19px rgba(244,239,230,0.18), 0 30px 60px rgba(0,0,0,0.85)'}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${zoom * drift})`,
          filter: 'grayscale(1) contrast(1.2) brightness(0.95)'}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, transparent 58%, rgba(0,0,0,0.75) 100%)'}} />
      </div>
      {tag ? <div style={{position: 'absolute', left: 0, top: r * 2 + 30, width: 'max-content', maxWidth: r * 2 + 120, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
        color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div> : null}
    </div>
  );
};

/**
 * A drawn front page with no words on it (a masthead bar, headline bars, columns of grey lines). `blank` leaves only the
 * masthead. `hole` = [column, firstLine, lastLine] is cut out from `holeAt` (black, as if scissored away). `censor` 0..1 lays
 * black bars over the lines, row by row.
 */
export const FrontPage: React.FC<{x: number; y: number; w: number; h: number; at: number; rot?: number; seed?: string; blank?: boolean;
  hole?: [number, number, number]; holeAt?: number; censor?: number; slap?: boolean}> = ({x, y, w, h, at, rot = 0, seed = 'fp', blank = false, hole, holeAt = Infinity, censor = 0, slap = true}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = slap ? interpolate(g, [at, at + 4, at + 7], [1.25, 0.97, 1], clamp) : 1;
  const pad = w * 0.06;
  const cols = 4;
  const gap = w * 0.03;
  const cw = (w - pad * 2 - gap * (cols - 1)) / cols;
  const top0 = h * 0.25;
  const lh = h * 0.024;
  const rows = Math.floor((h - pad - top0) / lh);
  const lines: React.ReactNode[] = [];
  const bars: React.ReactNode[] = [];
  const hp = hole && Number.isFinite(holeAt) ? interpolate(g, [holeAt, holeAt + 8], [0, 1], clamp) : 0;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const cx = pad + c * (cw + gap);
      const cy = top0 + r * lh;
      if (c < 2 && r < rows * 0.38) continue; // photo box
      const end = random(`${seed}e${c}${r}`) < 0.12;
      const len = end ? 0.35 + random(`${seed}l${c}${r}`) * 0.4 : 1;
      if (!blank) lines.push(<rect key={`l${c}-${r}`} x={cx} y={cy} width={cw * len} height={lh * 0.38} fill="#8d8679" />);
      const order = (r * cols + c) / (rows * cols);
      const bp = interpolate(censor, [order * 0.85, order * 0.85 + 0.15], [0, 1], clamp);
      if (bp > 0 && !blank) bars.push(<rect key={`b${c}-${r}`} x={cx - 2} y={cy - lh * 0.2} width={(cw * len + 4) * bp} height={lh * 0.78} fill="#0d0c09" />);
    }
  }
  const hx = hole ? pad + hole[0] * (cw + gap) - 6 : 0;
  const hy = hole ? top0 + hole[1] * lh - 8 : 0;
  const hh = hole ? (hole[2] - hole[1]) * lh + 10 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%',
      boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}}>
      <svg width={w} height={h} style={{display: 'block'}}>
        <rect x={0} y={0} width={w} height={h} fill="#e3dccc" />
        <rect x={pad} y={pad} width={w - pad * 2} height={h * 0.075} fill="#24211c" />
        <rect x={pad} y={pad + h * 0.09} width={w - pad * 2} height={2} fill="#24211c" />
        <rect x={pad} y={pad + h * 0.1} width={w - pad * 2} height={1} fill="#24211c" />
        {!blank && <>
          <rect x={pad} y={h * 0.16} width={(w - pad * 2) * 0.92} height={h * 0.03} fill="#3a362f" />
          <rect x={pad} y={h * 0.2} width={(w - pad * 2) * 0.6} height={h * 0.022} fill="#5a554b" />
          <rect x={pad} y={top0} width={cw * 2 + gap} height={rows * 0.38 * lh - lh * 0.6} fill="#a39c8f" />
        </>}
        {lines}
        {bars}
        {hole && hp > 0 && <rect x={hx} y={hy} width={cw + 12} height={hh * hp} fill="#0d0c09" />}
      </svg>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 35%, transparent 50%, rgba(60,50,35,0.28) 100%)'}} />
    </div>
  );
};

export type TypedLine = {text: string; at: number; size?: number; strike?: number; gap?: number; bold?: boolean};

/** Frames a typed line takes (1.2 characters a frame); used for its sound too. */
export const typeFrames = (text: string) => Math.ceil(text.length / 1.2) + 2;

/** A typed sheet on the desk. Each line types on from its `at`; `strike` crosses it out. `label` is a small mono note above it. */
export const Typed: React.FC<{x: number; y: number; w: number; h: number; at: number; rot?: number; lines: TypedLine[]; label?: string}> = ({x, y, w, h, at, rot = 0, lines, label}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - k) * 60, width: w, height: h, transform: `rotate(${rot}deg)`, opacity: Math.min(1, k * 1.5),
      background: '#e6dfcf', boxShadow: '0 26px 46px rgba(0,0,0,0.8)', padding: '64px 70px', boxSizing: 'border-box'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 35%, transparent 50%, rgba(60,50,35,0.25) 100%)'}} />
      {lines.map((l, i) => {
        if (g < l.at) return <div key={i} style={{height: (l.size ?? 44) * 1.35, marginTop: l.gap ?? 0}} />;
        const n = Math.min(l.text.length, Math.floor((g - l.at) * 1.2));
        const sp = l.strike !== undefined ? interpolate(g, [l.strike, l.strike + 6], [0, 1], clamp) : 0;
        return (
          <div key={i} style={{position: 'relative', marginTop: l.gap ?? 0, fontFamily: JF.mono, fontWeight: l.bold ? 700 : 400, fontSize: l.size ?? 44, lineHeight: 1.35,
            color: '#1d1a15', whiteSpace: 'pre', width: 'max-content'}}>
            {l.text.slice(0, n)}
            {sp > 0 && <div style={{position: 'absolute', left: -8, top: '52%', height: 7, width: `calc(${sp * 100}% + 16px)`, background: '#1d1a15', transform: 'rotate(-1.5deg)'}} />}
          </div>
        );
      })}
      {label ? <div style={{position: 'absolute', right: 26, bottom: 18, fontFamily: JF.mono, fontSize: 16, letterSpacing: 2, color: 'rgba(29,26,21,0.55)', textTransform: 'uppercase'}}>{label}</div> : null}
    </div>
  );
};

/** The typing sound for a typed line (cut to the line's length). */
export const TypeSfx: React.FC<{at: number; text: string; volume?: number}> = ({at, text, volume = 0.35}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={typeFrames(text) + 4} layout="none"><Audio src={staticFile('sfx/typewriter.wav')} volume={volume} /></Sequence>
);

/** An inked rubber stamp, slammed on at `at`. */
export const RubberStamp: React.FC<{text: string; x: number; y: number; at: number; size?: number; rot?: number; color?: string}> = ({text, x, y, at, size = 120, rot = -8, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.6, 0.94, 1], clamp);
  const c = color ?? pal.box ?? pal.mark;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: 'center', border: `${size * 0.07}px solid ${c}`,
      borderRadius: size * 0.08, padding: `${size * 0.02}px ${size * 0.18}px`, fontFamily: JF.display, fontSize: size, lineHeight: 1.1, color: c, whiteSpace: 'nowrap',
      opacity: 0.92, mixBlendMode: 'multiply'}}>{text}</div>
  );
};

/** A quick hand-drawn scratch through something (two strokes). */
export const Strike: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; color?: string; width?: number}> = ({x1, y1, x2, y2, at, color, width = 7}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p1 = interpolate(g, [at, at + 4], [0, 1], clamp);
  const p2 = interpolate(g, [at + 3, at + 7], [0, 1], clamp);
  const c = color ?? pal.mark;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x1},${y1} L${x2},${y2}`} stroke={c} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p1} />
      <path d={`M${x1 + 6},${y1 + 16} L${x2 - 4},${y2 + 10}`} stroke={c} strokeWidth={width * 0.8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p2} />
    </svg>
  );
};

/** Tally marks in fives, one more every `every` frames from `at` (n in all), drawn in teal. */
export const Tally: React.FC<{x: number; y: number; n: number; at: number; every?: number; h?: number}> = ({x, y, n, at, every = 5, h = 120}) => {
  const g = useGFrame();
  const pal = usePal();
  const shown = Math.max(0, Math.min(n, Math.floor((g - at) / every) + 1));
  const marks: React.ReactNode[] = [];
  for (let i = 0; i < shown; i++) {
    const grp = Math.floor(i / 5);
    const j = i % 5;
    const gx = x + grp * (h * 0.95);
    const jx = (random(`ta${i}`) - 0.5) * 6;
    if (j < 4) marks.push(<path key={i} d={`M${gx + j * h * 0.17 + jx},${y} L${gx + j * h * 0.17 - jx},${y + h}`} stroke={pal.mark} strokeWidth={7} strokeLinecap="round" />);
    else marks.push(<path key={i} d={`M${gx - h * 0.1},${y + h * 0.8} L${gx + h * 0.62},${y + h * 0.15}`} stroke={pal.mark} strokeWidth={7} strokeLinecap="round" />);
  }
  return <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>{marks}</svg>;
};

/**
 * Balloons launched per month (Mikesh 1973: Nov 700, Dec 1,200, Jan 2,000, Feb 2,500, Mar 2,500, early Apr 400), then 0.
 * `ats` = the frame each bar rises (7 entries: Nov..Apr and the zero month).
 */
export const LaunchBars: React.FC<{x: number; base: number; ats: number[]; maxH?: number}> = ({x, base, ats, maxH = 480}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const pal = usePal();
  const data: [string, number][] = [['NOV', 700], ['DEC', 1200], ['JAN', 2000], ['FEB', 2500], ['MAR', 2500], ['APR', 400], ['MAY', 0]];
  const bw = 130;
  const gap = 56;
  return (
    <>
      <div style={{position: 'absolute', left: x - 20, top: base, width: data.length * (bw + gap) + 10, height: 4, background: 'rgba(244,239,230,0.7)'}} />
      {data.map(([m, v], i) => {
        if (g < ats[i]) return null;
        const p = interpolate(f, [ats[i], ats[i] + 10], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
        const hgt = (v / 2500) * maxH * p;
        const bx = x + i * (bw + gap);
        return (
          <React.Fragment key={m}>
            <div style={{position: 'absolute', left: bx, top: base - hgt, width: bw, height: hgt, background: 'rgba(244,239,230,0.85)', boxShadow: `inset 0 0 0 4px ${pal.mark}`}} />
            <div style={{position: 'absolute', left: bx, top: base + 16, width: bw, textAlign: 'center', fontFamily: JF.mono, fontSize: 28, letterSpacing: 2, color: 'rgba(244,239,230,0.85)'}}>{m}</div>
            <div style={{position: 'absolute', left: bx - 20, top: base - hgt - 46, width: bw + 40, textAlign: 'center', fontFamily: JF.mono, fontWeight: 700, fontSize: v ? 30 : 44,
              color: v ? '#f4efe6' : pal.mark, opacity: p}}>{v.toLocaleString('en-US')}</div>
          </React.Fragment>
        );
      })}
    </>
  );
};
