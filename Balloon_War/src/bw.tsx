// The Balloon War's own scene pieces: 3D photos by name, plain photos by path, cards, the then/now wipe and the
// censor bar. Archival photos show in black and white; the 2023 photos stay in color (now vs then).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from './lib/anim';
import {Tag, Tint, Traced, useGFrame, type Place} from './kit/Kit';
import {Photo} from './kit/shell';
import {DarkPaper} from './kit/common';
import {Photo3D} from './kit/photo3d';
import {Parallax} from './kit/parallax';
import {MASKS} from './masks';
import {L3D} from './layers3d';
import {im} from './images';

export const BW = 'grayscale(1) contrast(1.12)';
export const COLOR = 'contrast(1.04) saturate(0.92)';
export const CORAL = '#FF6F61';
export const ORANGE = '#FF9F1C';

/** A 3D photo from tools/layers3d_jobs.sh, with an optional source tag and a soft dark band for notes. */
export const P3: React.FC<{name: string; a: number; b: number; dolly?: number; yaw?: [number, number]; pan?: [number, number];
  rise?: [number, number]; deep?: number; color?: boolean; tag?: string; band?: 'top' | 'bottom' | 'left' | null; children?: React.ReactNode}> = ({
  name, a, b, dolly = 220, yaw = [-2.5, 2.5], pan = [0, 0], rise = [0, 0], deep = 1600, color, tag, band = 'bottom', children,
}) => {
  const l = L3D[name];
  if (!l) throw new Error(`No 3D layers for ${name} (run bash tools/layers3d_jobs.sh)`);
  const grad = band === 'top' ? 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent 38%)'
    : band === 'left' ? 'linear-gradient(90deg, rgba(0,0,0,0.75), transparent 48%)'
    : band === 'bottom' ? 'linear-gradient(transparent 55%, rgba(0,0,0,0.78) 88%)' : 'none';
  return (
    <AbsoluteFill>
      <Photo3D name={name} depths={l.depths} size={l.size} a={a} b={b} dolly={dolly} yaw={yaw} pan={pan} rise={rise} deep={deep} filter={color ? COLOR : BW} />
      <AbsoluteFill style={{background: grad}} />
      {children}
      {tag && <Tag text={tag} />}
    </AbsoluteFill>
  );
};

/**
 * A plain photo by path with a slow push toward (fx, fy). With `m` (a mask in src/masks.ts) the subject is tinted
 * coral, its teal outline draws on at `traceAt`, and (once tools/layers.py has run) it lifts off the background.
 */
export const Ph: React.FC<{p: string; fx: number; fy: number; a: number; b: number; z0?: number; z1?: number; color?: boolean; tag?: string;
  band?: 'top' | 'bottom' | 'left' | null; m?: keyof typeof MASKS; traceAt?: number; depth?: number;
  children?: (S: (x: number, y: number) => number[]) => React.ReactNode}> = ({p, fx, fy, a, b, z0 = 1.04, z1 = 1.14, color, tag, band = 'bottom', m, traceAt, depth = 1.06, children}) => {
  const {src, size} = im(p);
  const grad = band === 'top' ? 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent 38%)'
    : band === 'left' ? 'linear-gradient(90deg, rgba(0,0,0,0.75), transparent 48%)'
    : band === 'bottom' ? 'linear-gradient(transparent 55%, rgba(0,0,0,0.78) 88%)' : 'none';
  if (m) {
    return (
      <Parallax name={m} src={src} size={size} a={a} b={b} tag={tag ?? ''} fx={fx / size[0]} fy={fy / size[1]} cam={{z: [z0, z1]}} depth={depth}
        mask={MASKS[m]} traceAt={traceAt ?? a + 6} filter={color ? COLOR : BW} vignette={0.5}>
        {(place) => (
          <>
            <AbsoluteFill style={{background: grad}} />
            {children?.((x, y) => [place.left + x * place.scale, place.top + y * place.scale])}
          </>
        )}
      </Parallax>
    );
  }
  return (
    <Photo src={src} size={size} fx={fx} fy={fy} z0={z0} z1={z1} a={a} b={b} bw={color ? COLOR : BW} vignette={0.5}>
      {(place) => (
        <>
          <AbsoluteFill style={{background: grad}} />
          {children?.((x, y) => [place.left + x * place.scale, place.top + y * place.scale])}
          {tag && <Tag text={tag} />}
        </>
      )}
    </Photo>
  );
};

/** Then/now: `from` sits on top and a vertical edge wipes it away right to left between frames a and a+dur. */
export const Wipe: React.FC<{a: number; dur?: number; from: React.ReactNode; to: React.ReactNode}> = ({a, dur = 20, from, to}) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [a, a + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const x = 1920 * (1 - u);
  return (
    <AbsoluteFill>
      {to}
      <AbsoluteFill style={{clipPath: `inset(0 ${1920 - x}px 0 0)`}}>{from}</AbsoluteFill>
      {u > 0 && u < 1 && <div style={{position: 'absolute', left: x - 3, top: 0, width: 6, height: 1080, background: '#f4efe6', boxShadow: '0 0 24px rgba(0,0,0,0.8)'}} />}
    </AbsoluteFill>
  );
};

/** A censor bar that slides across (x, y, w, h) from frame `at`, and lifts again at `lift`. */
export const Redact: React.FC<{x: number; y: number; w: number; h: number; at: number; lift?: number; rot?: number}> = ({x, y, w, h, at, lift = 1e7, rot = -1}) => {
  const g = useGFrame();
  if (g < at) return null;
  const u = interpolate(g, [at, at + 6], [0, 1], clamp);
  const up = interpolate(g, [lift, lift + 8], [0, 1], clamp);
  return <div style={{position: 'absolute', left: x, top: y - up * 40, width: w * u, height: h, background: '#0b0b0b', opacity: 1 - up,
    transform: `rotate(${rot}deg)`, boxShadow: '0 6px 18px rgba(0,0,0,0.6)'}} />;
};

/**
 * A masked subject placed by hand (no full-bleed camera): the cut-out alone from tools/layers.py, or with `whole` the
 * full picture (`src`, for a photo inside a card). Tinted coral; the teal outline draws on at `traceAt`; springs up at `at`.
 */
export const Cutout: React.FC<{name: keyof typeof MASKS; size: [number, number]; place: Place; at: number; traceAt: number; whole?: boolean; src?: string; tint?: boolean}> = ({
  name, size, place, at, traceAt, whole, src, tint = true,
}) => {
  const g = useGFrame();
  const {fps} = useVideoConfig();
  const mask = MASKS[name];
  const k = whole ? 1 : spring({frame: g - at, fps, config: {damping: 14, mass: 0.8}});
  if (!whole && g < at) return null;
  const file = whole ? (src ?? `img/layers/${name}_bg.jpg`) : `img/layers/${name}_fg.webp`;
  const p: Place = {left: place.left, top: place.top + (1 - k) * 160, scale: place.scale};
  const img = (extra?: React.CSSProperties) => (
    <Img src={staticFile(file)} style={{position: 'absolute', left: p.left, top: p.top, width: size[0] * p.scale, height: size[1] * p.scale, filter: BW, ...extra}} />
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: Math.min(1, k * 1.5)}}>
      {!whole && img({filter: 'brightness(0) blur(14px)', opacity: 0.45, transform: 'translate(10px, 14px)'})}
      {img()}
      {tint && <Tint mask={mask.alpha} place={p} size={size} />}
      <Traced paths={mask.data.shapes.subject} place={p} at={traceAt} dur={12} width={5} part={0.92} />
    </div>
  );
};

type Box = [number, number, number, number];

/**
 * The channel's notebook look: the subject cut out of its photo, standing on the dark ruled paper. It is fitted into
 * `box` (x, y, w, h; bottom-aligned, centred across), springs up at `at`, floats very slightly, and its teal outline
 * draws on at `traceAt`. `tint` makes it the coral subject (one per scene). No camera moves.
 */
export const Cut: React.FC<{p: string; m: keyof typeof MASKS; box: Box; at: number; traceAt?: number; tint?: boolean; tag?: string;
  valign?: 'bottom' | 'center'; bare?: boolean; children?: React.ReactNode}> = ({p, m, box, at, traceAt, tint = true, tag, valign = 'bottom', bare, children}) => {
  const g = useGFrame();
  const {size} = im(p);
  const [x0, y0, x1, y1] = MASKS[m].data.boxes.subject;
  const [bx, by, bw, bh] = box;
  const sc = Math.min(bw / (x1 - x0), bh / (y1 - y0));
  const float = Math.sin(g / 45) * 4;
  const place: Place = {left: bx + (bw - (x1 - x0) * sc) / 2 - x0 * sc, top: (valign === 'bottom' ? by + bh - (y1 - y0) * sc : by + (bh - (y1 - y0) * sc) / 2) - y0 * sc + float, scale: sc};
  return (
    <AbsoluteFill>
      {!bare && <DarkPaper />}
      <Cutout name={m} size={size} place={place} at={at} traceAt={traceAt ?? at + 8} tint={tint} />
      {children}
      {tag && <Tag text={tag} />}
    </AbsoluteFill>
  );
};

/**
 * A photo as a cream card on the desk (for scenes with no single subject: landscapes, crowds, rooms). The card drops in
 * at `at` and drifts a few pixels; no zoom. With `m` the subject inside the card is tinted and traced.
 */
export const Desk: React.FC<{p: string; box: Box; at: number; rot?: number; pos?: [number, number]; m?: keyof typeof MASKS; traceAt?: number;
  tag?: string; children?: React.ReactNode | ((S: (x: number, y: number) => number[]) => React.ReactNode)}> = ({p, box, at, rot = -2, pos = [0.5, 0.5], m, traceAt, tag, children}) => {
  const g = useGFrame();
  const {fps} = useVideoConfig();
  const {src, size} = im(p);
  const [bx, by, bw, bh] = box;
  const k = spring({frame: g - at, fps, config: {damping: 15, mass: 0.7}});
  const pad = Math.max(12, bw * 0.022);
  const iw = bw - 2 * pad, ih = bh - 2 * pad;
  const sc = Math.max(iw / size[0], ih / size[1]);
  const place: Place = {left: (iw - size[0] * sc) * pos[0], top: (ih - size[1] * sc) * pos[1], scale: sc};
  const drift = Math.sin(g / 60) * 3;
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= at && (
        <div style={{position: 'absolute', left: bx, top: by + drift, width: bw, transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * k})`, opacity: Math.min(1, k * 2)}}>
          <div style={{background: '#f4efe6', padding: pad, boxShadow: '0 24px 44px rgba(0,0,0,0.7)'}}>
            <div style={{position: 'relative', width: iw, height: ih, overflow: 'hidden', background: '#111'}}>
              {m ? <Cutout name={m} size={size} place={place} at={-999} traceAt={traceAt ?? at + 8} whole src={src} />
                : <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * sc, height: size[1] * sc, filter: BW}} />}
            </div>
          </div>
        </div>
      )}
      {typeof children === 'function' ? children((x, y) => [bx + pad + place.left + x * sc, by + pad + place.top + y * sc + drift]) : children}
      {tag && <Tag text={tag} />}
    </AbsoluteFill>
  );
};
