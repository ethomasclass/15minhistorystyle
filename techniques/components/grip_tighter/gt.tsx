// Grip Tighter helpers on top of the template kit: archival pictures by path (sizes from src/imgs.ts),
// Gemini paintings with a labelled stand-in until the PNG exists, documents on the desk, hand-drawn
// underlines, the running census counter, and music that switches to the Suno cue once it is dropped in.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {IMG} from '../imgs';
import {clamp} from '../lib/anim';
import {JF, PALETTES, Tag, useGFrame, usePal} from './Kit';
import {DarkPaper} from './common';
import type {MaskRef} from './maskref';
import {hasFile, Photo} from './shell';

export const sizeOf = (src: string): [number, number] => {
  const s = IMG[src];
  if (!s) throw new Error(`No size for ${src}: run python3 tools/img_sizes.py`);
  return s;
};

/** Full-bleed archival picture (B&W, slow push) with its source tag. fx/fy default to the centre. */
export const Pic: React.FC<{src: string; tag: string; a: number; b: number; fx?: number; fy?: number; z0?: number; z1?: number; bw?: string; mask?: MaskRef; tint?: string | null;
  traceAt?: number; vignette?: number; children?: React.ReactNode}> = ({src, tag, a, b, fx, fy, z0, z1, bw, mask, tint, traceAt, vignette, children}) => {
  const size = sizeOf(src);
  return (
    <AbsoluteFill>
      <Photo src={src} size={size} fx={fx ?? size[0] / 2} fy={fy ?? size[1] / 2} z0={z0} z1={z1} a={a} b={b} bw={bw} mask={mask} tint={tint} traceAt={traceAt} vignette={vignette} />
      {children}
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

/** A Gemini painting (public/img/gen/<name>.png) full-bleed with a slow push. Until it exists: a labelled stand-in. */
export const Gen: React.FC<{name: string; label: string; a: number; b: number; z0?: number; z1?: number; ox?: string; oy?: string; children?: React.ReactNode}> = ({
  name, label, a, b, z0 = 1.02, z1 = 1.1, ox = '50%', oy = '50%', children,
}) => {
  const frame = useCurrentFrame();
  const pal = usePal();
  const src = `img/gen/${name}.png`;
  const z = interpolate(frame, [a, b], [z0, z1], clamp);
  if (hasFile(src)) {
    return (
      <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${ox} ${oy}`, transform: `scale(${z})`, transformOrigin: `${ox} ${oy}`,
          filter: 'grayscale(1) contrast(1.15) brightness(0.92)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)'}} />
        {children}
        <Tag text={`Illustration · ${label}`} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 260, top: 200, width: 1400, height: 680, border: `4px dashed ${pal.mark}`, opacity: 0.55}} />
      <div style={{position: 'absolute', left: 300, top: 470, width: 1320, textAlign: 'center', fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase'}}>
        painting to come · {name}.png
        <div style={{marginTop: 18, fontSize: 24, letterSpacing: 2, color: 'rgba(255,255,255,0.5)'}}>{label}</div>
      </div>
      {children}
      <Tag text={`Illustration · ${label}`} />
    </AbsoluteFill>
  );
};

/**
 * A mark drawn ON a document, in the scan's own pixel coordinates, so it moves, zooms and tilts with the paper.
 * box = loose hand-drawn rectangle; ellipse = hand-drawn loop; underline = a stroke under a line of text.
 * `tint` lays the coral subject colour over the marked area (the masking effect), from `at` until `until`.
 * `rot` tilts a box (degrees, about its centre) to follow handwriting that climbs across the page.
 */
export type DocMark = {at: number; box?: [number, number, number, number]; ellipse?: [number, number, number, number]; underline?: [number, number, number];
  tint?: boolean; until?: number; pad?: number; seed?: number; width?: number; noTrace?: boolean; rot?: number};

const markPath = (m: DocMark) => {
  const j = (k: string) => (random(`dm${m.seed ?? 1}${k}`) - 0.5);
  if (m.underline) {
    const [x1, x2, y] = m.underline;
    return Array.from({length: 10}, (_, i) => `${i ? 'L' : 'M'}${x1 + ((x2 - x1) * i) / 9},${y + j(`u${i}`) * 6 + i * 0.4}`).join(' ');
  }
  if (m.ellipse) {
    const [cx, cy, rx, ry] = m.ellipse;
    return Array.from({length: 40}, (_, i) => {
      const a = -Math.PI * 0.6 + (i / 39) * Math.PI * 2 * 1.04;
      const w = 1 + j(`e${i % 7}`) * 0.08;
      return `${i ? 'L' : 'M'}${cx + rx * w * Math.cos(a)},${cy + ry * w * Math.sin(a)}`;
    }).join(' ');
  }
  const [x0, y0, x1, y1] = m.box!;
  const p = m.pad ?? 8;
  const pts = [[x0 - p, y0 - p], [x1 + p, y0 - p], [x1 + p, y1 + p], [x0 - p, y1 + p], [x0 - p + 6, y0 - p - 4]];
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x + j(`bx${i}`) * 8},${y + j(`by${i}`) * 8}`).join(' ');
};

const DocMarks: React.FC<{marks: DocMark[]; size: [number, number]; w: number; h: number}> = ({marks, size, w, h}) => {
  const g = useGFrame();
  const pal = usePal();
  // the quiet chapters keep coral off the screen: their wash is a lighter teal
  const quiet = pal === PALETTES.quiet;
  const tc = quiet ? pal.mark : pal.subject;
  const [om, oc] = quiet ? [0.45, 0.35] : [0.75, 0.5];
  return (
    <>
      {marks.map((m, i) => {
        if (!m.tint || (!m.box && !m.ellipse) || g < m.at + 2 || g >= (m.until ?? 1e7)) return null;
        const o = interpolate(g, [m.at + 2, m.at + 8], [0, 1], clamp);
        const r = m.box ? m.box : [m.ellipse![0] - m.ellipse![2], m.ellipse![1] - m.ellipse![3], m.ellipse![0] + m.ellipse![2], m.ellipse![1] + m.ellipse![3]];
        const pad = m.box ? (m.pad ?? 8) * 0.5 : 0;
        const st: React.CSSProperties = {position: 'absolute', left: 16 + ((r[0] - pad) / size[0]) * w, top: 16 + ((r[1] - pad) / size[1]) * h,
          width: ((r[2] - r[0] + 2 * pad) / size[0]) * w, height: ((r[3] - r[1] + 2 * pad) / size[1]) * h, background: tc, borderRadius: m.ellipse ? '50%' : 6,
          transform: m.rot ? `rotate(${m.rot}deg)` : undefined};
        return (
          <React.Fragment key={`t${i}`}>
            <div style={{...st, mixBlendMode: 'multiply', opacity: om * o}} />
            <div style={{...st, mixBlendMode: 'color', opacity: oc * o}} />
          </React.Fragment>
        );
      })}
      <svg style={{position: 'absolute', left: 16, top: 16, overflow: 'visible'}} width={w} height={h} viewBox={`0 0 ${size[0]} ${size[1]}`} preserveAspectRatio="none">
        {marks.map((m, i) => {
          if (g < m.at || m.noTrace) return null;
          const p = interpolate(g, [m.at, m.at + (m.underline ? 8 : 12)], [0, 1], clamp);
          const c = m.box ? [(m.box[0] + m.box[2]) / 2, (m.box[1] + m.box[3]) / 2] : [0, 0];
          return <path key={i} d={markPath(m)} transform={m.rot && m.box ? `rotate(${m.rot} ${c[0]} ${c[1]})` : undefined} fill="none" stroke={pal.mark} strokeWidth={m.width ?? 5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
        })}
      </svg>
    </>
  );
};

/** A document or page on the desk: cream card, light sepia, pops on, then pushes in slowly toward (fx, fy).
 *  `marks` draw on the paper itself (see DocMark). `children(S)` get a source→screen mapper (tilt included) for overlays off the paper. */
export const Doc: React.FC<{src: string; x: number; y: number; w: number; at: number; out?: number; rot?: number; push?: [number, number]; fx?: number; fy?: number; zoom?: number; sepia?: number;
  marks?: DocMark[]; children?: (S: (sx: number, sy: number) => number[]) => React.ReactNode}> = ({src, x, y, w, at, out = Infinity, rot = 0, push, fx, fy, zoom = 1.25, sepia = 0.3, marks, children}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const size = sizeOf(src);
  const h = (w * size[1]) / size[0];
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  const z = push ? interpolate(frame, push, [1, zoom], clamp) : 1;
  const ox = fx ?? size[0] / 2;
  const oy = fy ?? size[1] / 2;
  const sc = w / size[0];
  // camera: zoom about the focus point, keeping it where it sits on screen at z = 1
  const flat = (sx: number, sy: number) => [x + ox * sc + (sx - ox) * sc * z, y + oy * sc + (sy - oy) * sc * z];
  const [lx, ty] = flat(0, 0);
  const cw = w * z + 32;
  const ch = h * z + 32;
  const cx = lx - 16 + cw / 2;
  const cy = ty - 16 + ch / 2;
  const a = (rot * Math.PI) / 180;
  const S = (sx: number, sy: number) => {
    const [px, py] = flat(sx, sy);
    return [cx + (px - cx) * Math.cos(a) - (py - cy) * Math.sin(a), cy + (px - cx) * Math.sin(a) + (py - cy) * Math.cos(a)];
  };
  return (
    <>
      <div style={{position: 'absolute', left: lx - 16, top: ty - 16, width: cw, height: ch, background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
        transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2)}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: 16, top: 16, width: w * z, height: h * z, filter: `grayscale(1) sepia(${sepia}) contrast(1.15)`}} />
        {marks && k >= 1 && <DocMarks marks={marks} size={size} w={w * z} h={h * z} />}
      </div>
      {k >= 1 && children?.(S)}
    </>
  );
};

/** A hand-drawn teal underline from (x1, y) to (x2, y), drawn on over `dur` frames. */
export const Underline: React.FC<{x1: number; x2: number; y: number; at: number; dur?: number; width?: number; color?: string; seed?: number}> = ({x1, x2, y, at, dur = 8, width = 6, color, seed = 1}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const pts = Array.from({length: 12}, (_, i) => `${i ? 'L' : 'M'}${x1 + ((x2 - x1) * i) / 11},${y + (random(`u${seed}${i}`) - 0.5) * 6 + i * 0.6}`).join(' ');
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={pts} fill="none" stroke={color ?? pal.mark} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** The running census counter, top-right: "ENSLAVED · 1790" and the number, ticking from `from` to `to`. */
export const Counter: React.FC<{year: number; from: number; to: number; at: number; dur?: number; color?: string}> = ({year, from, to, at, dur = 30, color}) => {
  const g = useGFrame();
  if (g < at) return null;
  const v = Math.round(interpolate(g, [at, at + dur], [from, to], clamp));
  const o = interpolate(g, [at, at + 6], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', right: 60, top: 46, textAlign: 'right', opacity: o, textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>
      <div style={{fontFamily: JF.mono, fontSize: 22, letterSpacing: 3, color: 'rgba(255,255,255,0.8)'}}>ENSLAVED · CENSUS OF {year}</div>
      <div style={{fontFamily: JF.display, fontSize: 64, lineHeight: 1.1, color: color ?? '#f4efe6'}}>{v.toLocaleString('en-US')}</div>
    </div>
  );
};

/** Music: the Suno cue if it has been dropped into public/music, else the stand-in from an earlier video. */
export const cue = (name: string, fallback: string) => (hasFile(`music/${name}.mp3`) ? `music/${name}.mp3` : `music/${fallback}.mp3`);
