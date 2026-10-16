// Dressed to Kill: the pieces this video adds on top of the template kit.
//  - GREEN: the one-time colour exception. Arsenic green is the only true green on screen; never on text, titles,
//    notes, arrows or charts. Coral stays on the human subject.
//  - Sil: a silhouette painting (public/img/gen/, 1376x768) as a 2.5D parallax scene, kept in its own colours.
//  - Doc + DocMark: a scanned page on the desk with marks in the scan's own pixels (from Grip Tighter), plus `swipe`,
//    a coral highlighter wash that runs along the quoted lines in step with the narration.
//  - Swatch: the recurring motif, a small card that collects a green square each time arsenic green turns up somewhere
//    new, drains to grey on "arsenic-free", and is sealed at the end.
// Image sizes: src/imgs.ts (regenerate with the python snippet in that file's header if images change).
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {IMG} from '../imgs';
import {clamp} from '../lib/anim';
import {JF, PALETTES, Tag, useGFrame, usePal} from './Kit';
import {type Fx, Parallax} from './parallax';
import type {MaskRef} from './maskref';
import type {Place} from './Kit';

/** Paris green as it comes out of the silhouettes (median of their green pixels): a bright, slightly yellow emerald. */
export const GREEN = '#74BA6C';

export const sizeOf = (src: string): [number, number] => {
  const s = IMG[src];
  if (!s) throw new Error(`No size for ${src}: add it to src/imgs.ts`);
  return s;
};

/** The silhouette paintings: one size for all nine. */
export const GEN: [number, number] = [1376, 768];

/**
 * A silhouette painting as a parallax scene over frames a..b. `name` is its mask/layer name (g_library, g_doctor, ...).
 * Kept in its own cream, black and green (no grayscale, no coral). Default living detail: drifting dust.
 */
export const Sil: React.FC<{name: string; file: string; label: string; a: number; b: number; fx?: number; fy?: number;
  z?: [number, number]; x?: [number, number]; y?: [number, number]; depth?: number; effects?: Fx[]; mask?: MaskRef; traceAt?: number; children?: (p: Place) => React.ReactNode}> = ({
  name, file, label, a, b, fx = 0.5, fy = 0.5, z = [1.04, 1.14], x, y, depth = 1.05, effects, mask, traceAt, children,
}) => (
  <Parallax name={name} src={`img/gen/${file}`} size={GEN} a={a} b={b} tag={`Illustration · ${label}`} fx={fx} fy={fy} cam={{z, x, y}} depth={depth}
    filter="contrast(1.04) saturate(1.05)" tint={null} mask={mask} traceAt={traceAt} vignette={0.45}
    effects={effects ?? [{kind: 'dust', x: 0, y: 0, w: 1920, h: 1080}]}>
    {children}
  </Parallax>
);

/**
 * A mark drawn ON a document, in the scan's own pixel coordinates, so it moves, zooms and tilts with the paper.
 * box = loose hand-drawn rectangle; ellipse = hand-drawn loop; underline = a stroke under a line of text.
 * `tint` washes the marked area coral. `swipe` = lines [x0, y0, x1, y1] that a coral highlighter runs along,
 * from frame `at` to frame `to` (anchor `to` on the last quoted word), spread over the lines by their widths.
 */
export type DocMark = {at: number; to?: number; box?: [number, number, number, number]; ellipse?: [number, number, number, number]; underline?: [number, number, number];
  swipe?: [number, number, number, number][]; tint?: boolean; until?: number; pad?: number; seed?: number; width?: number; noTrace?: boolean; rot?: number};

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
  const quiet = pal === PALETTES.quiet;
  const tc = quiet ? pal.mark : pal.subject;
  const [om, oc] = quiet ? [0.45, 0.35] : [0.75, 0.5];
  const sx = (v: number) => 16 + (v / size[0]) * w;
  const sy = (v: number) => 16 + (v / size[1]) * h;
  const wash = (key: string, l: number, t: number, ww: number, hh: number, o: number, radius = 6) => {
    const st: React.CSSProperties = {position: 'absolute', left: l, top: t, width: ww, height: hh, background: tc, borderRadius: radius};
    return (
      <React.Fragment key={key}>
        <div style={{...st, mixBlendMode: 'multiply', opacity: om * o}} />
        <div style={{...st, mixBlendMode: 'color', opacity: oc * o}} />
      </React.Fragment>
    );
  };
  return (
    <>
      {marks.map((m, i) => {
        if (g < m.at || g >= (m.until ?? 1e7)) return null;
        if (m.swipe) {
          // the highlighter front moves along the lines in reading order, at a steady rate across their total width
          const widths = m.swipe.map(([x0, , x1]) => x1 - x0);
          const total = widths.reduce((s, v) => s + v, 0);
          const done = interpolate(g, [m.at, m.to ?? m.at + 20], [0, total], clamp);
          let acc = 0;
          return m.swipe.map(([x0, y0, x1, y1], k) => {
            const len = Math.max(0, Math.min(widths[k], done - acc));
            acc += widths[k];
            if (len <= 0) return null;
            const jt = (random(`sw${i}${k}`) - 0.5) * (y1 - y0) * 0.12;
            return wash(`s${i}${k}`, sx(x0 - 6), sy(y0 - 4 + jt), (len + 12) / size[0] * w, (y1 - y0 + 8) / size[1] * h, 1, 3);
          });
        }
        if (!m.tint || (!m.box && !m.ellipse) || g < m.at + 2) return null;
        const o = interpolate(g, [m.at + 2, m.at + 8], [0, 1], clamp);
        const r = m.box ? m.box : [m.ellipse![0] - m.ellipse![2], m.ellipse![1] - m.ellipse![3], m.ellipse![0] + m.ellipse![2], m.ellipse![1] + m.ellipse![3]];
        const pad = m.box ? (m.pad ?? 8) * 0.5 : 0;
        return wash(`t${i}`, sx(r[0] - pad), sy(r[1] - pad), ((r[2] - r[0] + 2 * pad) / size[0]) * w, ((r[3] - r[1] + 2 * pad) / size[1]) * h, o, m.ellipse ? 999 : 6);
      })}
      <svg style={{position: 'absolute', left: 16, top: 16, overflow: 'visible'}} width={w} height={h} viewBox={`0 0 ${size[0]} ${size[1]}`} preserveAspectRatio="none">
        {marks.map((m, i) => {
          if (g < m.at || m.noTrace || m.swipe) return null;
          const p = interpolate(g, [m.at, m.at + (m.underline ? 8 : 12)], [0, 1], clamp);
          const c = m.box ? [(m.box[0] + m.box[2]) / 2, (m.box[1] + m.box[3]) / 2] : [0, 0];
          return <path key={i} d={markPath(m)} transform={m.rot && m.box ? `rotate(${m.rot} ${c[0]} ${c[1]})` : undefined} fill="none" stroke={pal.mark} strokeWidth={m.width ?? 5}
            vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
        })}
      </svg>
    </>
  );
};

/**
 * A document or page on the desk: cream card, light sepia, pops on, then pushes in slowly toward (fx, fy) (source px).
 * `marks` draw on the paper itself. `colour` keeps the scan's own colours (use for the green sample pages; never
 * for plain text pages). `children(S)` get a source→screen mapper (tilt included) for overlays off the paper.
 */
export const Doc: React.FC<{src: string; x: number; y: number; w: number; at: number; out?: number; rot?: number; push?: [number, number]; fx?: number; fy?: number; zoom?: number; sepia?: number;
  colour?: boolean; marks?: DocMark[]; children?: (S: (sx: number, sy: number) => number[]) => React.ReactNode}> = ({
  src, x, y, w, at, out = 1e7, rot = 0, push, fx, fy, zoom = 1.25, sepia = 0.3, colour, marks, children,
}) => {
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
        transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2), overflow: 'hidden'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: 16, top: 16, width: w * z, height: h * z,
          filter: colour ? 'contrast(1.05)' : `grayscale(1) sepia(${sepia}) contrast(1.15)`}} />
        {marks && k >= 1 && <DocMarks marks={marks} size={size} w={w * z} h={h * z} />}
      </div>
      {k >= 1 && children?.(S)}
    </>
  );
};

/** One entry on the swatch card: where arsenic green turned up, and the frame it arrives. */
export type SwatchItem = {label: string; at: number};

/**
 * The recurring motif: a small cream card, always in the same place (top right), headed ARSENIC GREEN. Each item adds
 * a green square with a tiny mono label. `drainAt` turns every square grey (arsenic-free); `sealAt` stamps it SEALED.
 * `x`/`y` default to the top-right corner; keep them the same everywhere the card returns.
 */
export const Swatch: React.FC<{items: SwatchItem[]; drainAt?: number; sealAt?: number; x?: number; y?: number; at?: number}> = ({items, drainAt = 1e7, sealAt = 1e7, x = 1560, y = 56, at = 0}) => {
  const g = useGFrame();
  if (g < at) return null;
  const pop = interpolate(g, [at, at + 5], [0.7, 1], clamp);
  const drain = interpolate(g, [drainAt, drainAt + 18], [0, 1], clamp);
  const cell = 52;
  const cols = 3;
  const shown = items.filter((it) => g >= it.at);
  const rows = Math.max(1, Math.ceil(items.length / cols));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 300, padding: '14px 16px 16px', background: '#f4efe6', boxShadow: '0 12px 26px rgba(0,0,0,0.55)',
      transform: `rotate(2deg) scale(${pop})`, transformOrigin: 'top right'}}>
      <div style={{fontFamily: JF.mono, fontSize: 17, letterSpacing: 3, color: '#2a2620', marginBottom: 10}}>ARSENIC GREEN</div>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell + 34}px)`, rowGap: 8, minHeight: rows * (cell + 26)}}>
        {shown.map((it, i) => {
          const k = interpolate(g, [it.at, it.at + 4], [0, 1], clamp);
          return (
            <div key={i} style={{opacity: k}}>
              <div style={{width: cell, height: cell, background: GREEN, filter: `grayscale(${drain}) brightness(${1 - 0.25 * drain})`,
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.25)', transform: `scale(${0.6 + 0.4 * k})`}} />
              <div style={{fontFamily: JF.mono, fontSize: 12, letterSpacing: 1.5, color: '#2a2620', marginTop: 4, whiteSpace: 'nowrap'}}>{it.label}</div>
            </div>
          );
        })}
      </div>
      {g >= sealAt && (
        <div style={{position: 'absolute', inset: 6, border: '4px solid rgba(42,38,32,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(244,239,230,0.35)', opacity: interpolate(g, [sealAt, sealAt + 4], [0, 1], clamp)}}>
          <div style={{fontFamily: JF.display, fontSize: 40, color: '#2a2620', transform: 'rotate(-8deg)'}}>SEALED</div>
        </div>
      )}
    </div>
  );
};

/** Every place arsenic green turns up, in the order the script names them (anchor each `at` in the chapter). */
export const SWATCH_LABELS = ['WALLS', 'GOWNS', 'WREATHS', 'CANDY', 'TOYS', 'BOOKS'] as const;

/** A full-bleed archival picture as a parallax scene (B&W) with the subject tinted arsenic GREEN instead of coral. */
export const GreenParallax: React.FC<React.ComponentProps<typeof Parallax>> = (p) => <Parallax {...p} tint={GREEN} />;

/** A plain dark card for a fact in a heavy chapter: bone Playfair, fades in, no marks. */
export const Plain: React.FC<{text: string; x: number; y: number; at: number; size?: number; w?: number}> = ({text, x, y, at, size = 60, w = 1500}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: JF.heavy, fontWeight: 700, fontSize: size, lineHeight: 1.2, color: '#e9e2d4',
      opacity: interpolate(g, [at, at + 8], [0, 1], clamp), textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>{text}</div>
  );
};

export {Tag};
export const DkFill: React.FC<{children?: React.ReactNode}> = ({children}) => <AbsoluteFill>{children}</AbsoluteFill>;
