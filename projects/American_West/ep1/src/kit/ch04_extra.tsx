// Shared helpers for chapters 4–6 (The Mountain, Done, Let Us Have Peace): a clamped photo camera, a keyed desk camera,
// prop cut-outs placed by their mask box, a newspaper/document clip with a focus pull and a swipe in any colour,
// counters, tally marks, a two-bar comparison and a sound list. Everything stays on the black desk; marks step at 12 fps.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {boxOf, JF, type Place, Traced, useGFrame, useHand, usePal} from './Kit';
import {Sfx} from './common';
import type {MaskRef} from './maskref';
import {CutOut, SHADOW, SoftTint, tornPoly} from '../samples/kit';
import {Desk3D, keys, ScrimTag, useSlap, zkeys} from '../previews/fx';

export const BWX = 'grayscale(1) contrast(1.22) brightness(0.98)';
/** Lithograph plates keep a little of their muted colour (series exception); quiet scenes take more out. */
export const LITHO = 'saturate(0.62) contrast(1.08) brightness(0.95)';
export const LITHO_QUIET = 'saturate(0.3) contrast(1.05) brightness(0.9)';

type K3 = [number, number, number, number]; // [frame, cx, cy, s]

/**
 * A camera on a picture that never shows past its edges: keyframes [frame, cx, cy, s] (source px, screen px per source px),
 * smooth between keys (zoom in log space). Children get S (source -> screen).
 */
export const Pic: React.FC<{src: string; size: [number, number]; k: K3[]; filter?: string; tag?: string; tagY?: number; mask?: MaskRef; tintAt?: number; tint?: number; traceAt?: number;
  vignette?: number; children?: (S: (x: number, y: number) => [number, number], s: number) => React.ReactNode}> = ({
  src, size, k, filter = BWX, tag, tagY = 24, mask, tintAt, tint = 0.62, traceAt, vignette = 0.55, children,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const [w, h] = size;
  const smin = Math.max(1920 / w, 1080 / h);
  const s = Math.max(smin, zkeys(f, k.map(([a, , , z]) => [a, z] as [number, number])));
  const cx = Math.min(w - 960 / s, Math.max(960 / s, keys(f, k.map(([a, x]) => [a, x] as [number, number]))));
  const cy = Math.min(h - 540 / s, Math.max(540 / s, keys(f, k.map(([a, , y]) => [a, y] as [number, number]))));
  const place: Place = {left: 960 - cx * s, top: 540 - cy * s, scale: s};
  const S = (x: number, y: number): [number, number] => [place.left + x * s, place.top + y * s];
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: w * s, height: h * s, filter}} />
      {mask && tintAt !== undefined && g >= tintAt && <SoftTint mask={mask.alpha} place={place} size={size} strength={tint * interpolate(g, [tintAt, tintAt + 5], [0, 1], clamp)} />}
      {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt} dur={12} width={5} part={0.93} />}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,${vignette}) 100%)`}} />
      {children?.(S, s)}
      {tag && <ScrimTag text={tag} x={34} y={tagY} />}
    </AbsoluteFill>
  );
};

/** The tilted desk with a keyed camera: each key [frame, tilt, z, x, y, rotZ]. */
export const DeskCam: React.FC<{k: [number, number, number, number, number, number][]; lamp?: [number, number]; children: React.ReactNode}> = ({k, lamp, children}) => {
  const f = useCurrentFrame();
  const v = (i: number) => keys(f, k.map((r) => [r[0], r[i]] as [number, number]));
  const z = zkeys(f, k.map((r) => [r[0], r[2]] as [number, number]));
  return <Desk3D tilt={v(1)} z={z} x={v(3)} y={v(4)} rotZ={v(5)} lamp={lamp}>{children}</Desk3D>;
};

/** Placement that puts a mask's subject box at (x, y) with width w (in the parent's px). */
export const propPlace = (m: MaskRef, x: number, y: number, w: number): Place => {
  const [x0, y0, x1] = m.data.boxes.subject;
  const sc = w / (x1 - x0);
  return {left: x - x0 * sc, top: y - y0 * sc, scale: sc};
};
export const propH = (m: MaskRef, w: number) => {
  const [x0, y0, x1, y1] = m.data.boxes.subject;
  return ((y1 - y0) * w) / (x1 - x0);
};

/** A cut-out prop (AI lithograph object on white, masked) with an ink offset shadow, slapped down at `at`. */
export const Prop: React.FC<{src: string; m: MaskRef; x: number; y: number; w: number; at: number; rot?: number; tint?: number; traceAt?: number; filter?: string; shadow?: boolean}> = ({
  src, m, x, y, w, at, rot = 0, tint = 0, traceAt, filter = 'saturate(0.55) contrast(1.08)', shadow = true,
}) => {
  const sl = useSlap(at, 1.25);
  if (!sl.on) return null;
  const [x0, y0, x1, y1] = m.data.boxes.subject;
  const sc = w / (x1 - x0);
  const cx = x + w / 2;
  const cy = y + ((y1 - y0) * sc) / 2;
  return (
    <AbsoluteFill style={{opacity: sl.opacity, transform: `rotate(${rot}deg) scale(${sl.scale})`, transformOrigin: `${cx}px ${cy}px`}}>
      <CutOut src={src} size={m.data.size} mask={m} place={{left: x - x0 * sc, top: y - y0 * sc, scale: sc}} at={-99} shadow={shadow ? 'ink' : 'none'} off={[10, 12]} tint={tint} soft traceAt={traceAt} filter={filter} />
    </AbsoluteFill>
  );
};

/**
 * A newspaper or document clip on the desk (no mount): the scan's own pixels with torn top and bottom, a hard ink shadow,
 * a window from source (sx0, sy0) at `scale`. Optional focus pull on a band of lines and a swipe ([x0, yCentre, x1] per line,
 * source px) that runs from `swipeAt` over `dur` frames, in `color` (teal in quiet scenes, coral otherwise).
 */
export const Clip: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; h: number; sx0: number; sy0: number; scale: number; rot?: number; at: number;
  band?: [number, number]; pullAt?: number; swipes?: [number, number, number][]; swipeAt?: number; dur?: number; lineH?: number; color?: string; seed?: number}> = ({
  src, size, x, y, w, h, sx0, sy0, scale, rot = 0, at, band, pullAt = 1e7, swipes = [], swipeAt = 1e7, dur = 14, lineH = 46, color, seed = 5,
}) => {
  const sl = useSlap(at, 1.18);
  const g = useGFrame();
  const pal = usePal();
  if (!sl.on) return null;
  const left = -sx0 * scale;
  const top = -sy0 * scale;
  const pull = interpolate(g, [pullAt, pullAt + 8], [0, 1], clamp);
  const total = swipes.reduce((a, [x0, , x1]) => a + (x1 - x0), 0);
  const sp = interpolate(g, [swipeAt, swipeAt + dur], [0, 1], clamp) * total;
  let acc = 0;
  const img = (extra: React.CSSProperties) => <Img src={staticFile(src)} style={{position: 'absolute', left, top, width: size[0] * scale, height: size[1] * scale, ...extra}} />;
  let fm = '';
  if (band) {
    const t0 = (band[0] - sy0) * scale;
    const t1 = (band[1] - sy0) * scale;
    fm = `linear-gradient(to bottom, #000 0px, #000 ${t0 - 12}px, transparent ${t0}px, transparent ${t1}px, #000 ${t1 + 12}px, #000 100%)`;
  }
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: sl.opacity, transform: `rotate(${rot}deg) scale(${sl.scale})`, filter: `drop-shadow(14px 18px 0 ${SHADOW})`}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', clipPath: tornPoly(w, h, seed, {t: true, b: true, l: true, r: true}, 7)}}>
        {img({filter: 'grayscale(1) sepia(0.25) contrast(1.2) brightness(0.9)'})}
        {swipes.map(([x0, ly, x1], i) => {
          const wd = Math.max(0, Math.min(x1 - x0, sp - acc));
          acc += x1 - x0;
          return wd > 0 ? <div key={i} style={{position: 'absolute', left: left + x0 * scale, top: top + (ly - lineH / 2) * scale, width: wd * scale, height: lineH * scale,
            background: color ?? pal.subject, mixBlendMode: 'multiply', opacity: 0.8}} /> : null;
        })}
        {band && pull > 0 && <div style={{position: 'absolute', inset: 0, WebkitMaskImage: fm, maskImage: fm} as React.CSSProperties}>
          {img({filter: `grayscale(1) sepia(0.25) contrast(1.1) blur(${pull * 4}px) brightness(${0.9 - pull * 0.5})`})}
        </div>}
      </div>
    </div>
  );
};

/** A torn print of an archival picture (no border), cropped to [sx0, sy0, sx1, sy1], with a hard ink shadow; slapped at `at`. */
export const Print: React.FC<{src: string; size: [number, number]; x: number; y: number; w: number; crop?: [number, number, number, number]; rot?: number; at: number; filter?: string; seed?: number;
  mask?: MaskRef; tint?: number; traceAt?: number; children?: (S: (sx: number, sy: number) => [number, number]) => React.ReactNode}> = ({
  src, size, x, y, w, crop, rot = 0, at, filter = BWX, seed = 3, mask, tint = 0, traceAt, children,
}) => {
  const sl = useSlap(at, 1.2);
  if (!sl.on) return null;
  const [sx0, sy0, sx1, sy1] = crop ?? [0, 0, size[0], size[1]];
  const sc = w / (sx1 - sx0);
  const h = (sy1 - sy0) * sc;
  const place: Place = {left: -sx0 * sc, top: -sy0 * sc, scale: sc};
  const S = (sx: number, sy: number): [number, number] => [x + place.left + sx * sc, y + place.top + sy * sc];
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: sl.opacity, transform: `rotate(${rot}deg) scale(${sl.scale})`, filter: `drop-shadow(12px 15px 0 ${SHADOW})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(w, h, seed, {t: true, r: true, b: true, l: true}, 8, undefined, true), overflow: 'hidden'}}>
          <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * sc, height: size[1] * sc, filter}} />
          {mask && tint > 0 && <SoftTint mask={mask.alpha} place={place} size={size} strength={tint} />}
        </div>
        {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt} dur={12} width={5} part={0.92} />}
      </div>
      {children?.(S)}
    </>
  );
};

/** Big display figure (Abril) that slaps in; teal by default. */
export const Big: React.FC<{text: string; x: number; y: number; size?: number; at: number; color?: string; rot?: number; anchor?: 'left' | 'center'}> = ({text, x, y, size = 150, at, color, rot = -2, anchor = 'left'}) => {
  const sl = useSlap(at, 1.4);
  const pal = usePal();
  if (!sl.on) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translateX(${anchor === 'center' ? '-50%' : '0'}) rotate(${rot}deg) scale(${sl.scale})`, transformOrigin: 'left center', opacity: sl.opacity,
      fontFamily: JF.display, fontSize: size, lineHeight: 1, color: color ?? pal.mark, whiteSpace: 'nowrap', textShadow: `6px 7px 0 ${SHADOW}`}}>{text}</div>
  );
};

/** A number counting up between frames (stepped like a mark). */
export const Counter: React.FC<{from?: number; to: number; at: number; dur?: number; x: number; y: number; size?: number; color?: string; prefix?: string; suffix?: string}> = ({
  from = 0, to, at, dur = 20, x, y, size = 120, color, prefix = '', suffix = '',
}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const v = Math.round(interpolate(g, [at, at + dur], [from, to], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)}));
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.display, fontSize: size, lineHeight: 1, color: color ?? pal.mark, whiteSpace: 'nowrap', textShadow: `5px 6px 0 ${SHADOW}`}}>
    {prefix}{v.toLocaleString('en-US')}{suffix}</div>;
};

/** Mono caps label, no backing strip (bare on the desk / image, ink outline for legibility). */
export const Label: React.FC<{text: string; x: number; y: number; size?: number; color?: string; at?: number; out?: number; rot?: number}> = ({text, x, y, size = 24, color, at = -999, out = 1e9, rot = 0}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at || g >= out) return null;
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.mono, fontSize: size, letterSpacing: 3, color: color ?? pal.mark, textTransform: 'uppercase', whiteSpace: 'nowrap',
    transform: `rotate(${rot}deg)`, opacity: interpolate(g, [at, at + 4], [0, 1], clamp), textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111, 2px -2px 0 #111, -2px -2px 0 #111'}}>{text}</div>;
};

/** Tally marks in groups of five, each stroke stepping in from `at` every `per` frames. */
export const Tally: React.FC<{n: number; x: number; y: number; at: number; per?: number; h?: number; gap?: number; color?: string; perRow?: number}> = ({n, x, y, at, per = 1, h = 70, gap = 18, color, perRow = 20}) => {
  const g = useGFrame();
  const pal = usePal();
  const c = color ?? pal.mark;
  const strokes: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    if (g < at + i * per) break;
    const row = Math.floor(i / perRow);
    const j = i % perRow;
    const grp = Math.floor(j / 5);
    const k = j % 5;
    const gx = x + grp * (4 * gap + 46);
    const gy = y + row * (h + 34);
    const jit = (random(`ty${i}`) - 0.5) * 6;
    if (k < 4) strokes.push(<line key={i} x1={gx + k * gap + jit} y1={gy} x2={gx + k * gap - jit} y2={gy + h} stroke={c} strokeWidth={6} strokeLinecap="round" />);
    else strokes.push(<line key={i} x1={gx - 12} y1={gy + h * 0.78} x2={gx + 3 * gap + 12} y2={gy + h * 0.22} stroke={c} strokeWidth={6} strokeLinecap="round" />);
  }
  return <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: `drop-shadow(3px 4px 0 ${SHADOW})`}} width={1920} height={1080}>{strokes}</svg>;
};

/** A drawn horizontal bar (dark paper strip with a teal rule; fill grows from `at`). */
export const HBar: React.FC<{x: number; y: number; w: number; h?: number; at: number; dur?: number; color: string; label: string; value: string; valueColor?: string}> = ({
  x, y, w, h = 70, at, dur = 14, color, label, value, valueColor,
}) => {
  const g = useGFrame();
  const hand = useHand();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y - 46, fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: 'rgba(244,239,230,0.9)', whiteSpace: 'nowrap'}}>{label}</div>
      <div style={{position: 'absolute', left: x, top: y, width: Math.max(8, w * p), height: h, background: color, boxShadow: `8px 10px 0 ${SHADOW}`,
        clipPath: tornPoly(Math.max(8, w * p), h, 17, {r: true}, 6)}} />
      {p > 0.9 && <div style={{position: 'absolute', left: x + Math.max(8, w * p) + 26, top: y + h / 2 - 34 * hand.scale, fontFamily: hand.family, fontSize: 52 * hand.scale, color: valueColor ?? color,
        whiteSpace: 'nowrap', textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>{value}</div>}
    </>
  );
};

/** A drawn line that writes on (teal by default), for diagrams in screen px. */
export const Line: React.FC<{d: string; at: number; dur?: number; color?: string; width?: number; dash?: string; opacity?: number}> = ({d, at, dur = 10, color, width = 5, dash, opacity = 1}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      {dash ? (
        <path d={d} fill="none" stroke={color ?? pal.mark} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} opacity={opacity * p} />
      ) : (
        <path d={d} fill="none" stroke={color ?? pal.mark} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={opacity} />
      )}
    </svg>
  );
};

/** A tilted 3D stage (CSS perspective), world placed so (fx, 0) sits mid-frame. */
export const Stage: React.FC<{fx: number; fy?: number; tilt: number; spin: number; z: number; dy?: number; w: number; children: React.ReactNode}> = ({fx, fy = 0, tilt, spin, z, dy = 0, w, children}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #231f19 0%, #12100c 65%, #070605 100%)', perspective: 1500, perspectiveOrigin: '50% 35%', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 960 - fx, top: 600 + dy - fy, width: w, height: 0, transformStyle: 'preserve-3d', transformOrigin: `${fx}px ${fy}px`,
      transform: `scale(${z}) rotateX(${tilt}deg) rotateZ(${spin}deg)`}}>
      {children}
    </div>
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'soft-light', background: 'radial-gradient(circle 800px at 960px 470px, rgba(255,214,160,0.55) 0%, transparent 100%)'}} />
  </AbsoluteFill>
);

/** A vertical plane standing on the stage's x axis at depth y (world px; + is nearer), `h` tall. */
export const Upright: React.FC<{y: number; w: number; h: number; children: React.ReactNode}> = ({y, w, h, children}) => (
  <div style={{position: 'absolute', left: 0, top: y - h, width: w, height: h, transformOrigin: '50% 100%', transform: 'rotateX(-90deg)'}}>{children}</div>
);

export type SfxRow = [number, string, number];
/** The chapter's sound list (gentle levels; see SCENES.md). */
export const Sounds: React.FC<{list: SfxRow[]}> = ({list}) => <>{list.map(([at, n, v], i) => <Sfx key={i} at={at} src={`sfx/${n}.wav`} volume={v} />)}</>;

/** Bare teal handwriting in several lines (each writes on at its own frame). */
export const Lines: React.FC<{x: number; y: number; rows: {text: string; at: number; color?: string; size?: number}[]; gap?: number; size?: number; rot?: number}> = ({x, y, rows, gap = 92, size = 54, rot = -2}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  return (
    <>
      {rows.map((r, i) => {
        if (g < r.at) return null;
        const p = interpolate(g, [r.at, r.at + 12], [0, 1], clamp);
        return <div key={i} style={{position: 'absolute', left: x, top: y + i * gap, fontFamily: hand.family, fontSize: (r.size ?? size) * hand.scale, color: r.color ?? pal.accent ?? pal.mark,
          whiteSpace: 'nowrap', transform: `rotate(${rot}deg)`, clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`,
          textShadow: '0 0 2px #111, 0 0 4px #111, 2px 2px 0 #111, -2px 2px 0 #111, 2px -2px 0 #111, -2px -2px 0 #111, 0 3px 12px rgba(0,0,0,0.7)'}}>{r.text}</div>;
      })}
    </>
  );
};

/** Orange-tape colour for small accents (the palette's title box). */
export const useBox = () => boxOf(usePal());

/** Like fx's Lift but without the rectangular contact shadow (for cut-out props that carry their own ink shadow). */
export const Float: React.FC<{x: number; y: number; w: number; hgt: number; h?: number; at: number; rot?: number; blur?: number; seed?: number; children: React.ReactNode}> = ({
  x, y, w, hgt, h = 6, at, rot = 0, blur = 0, seed = 1, children,
}) => {
  const f = useCurrentFrame();
  const sl = useSlap(at);
  if (!sl.on) return null;
  const z = h + sl.lift * 600;
  const b = Math.sin(f / 38 + seed) * 0.25;
  return (
    <div style={{position: 'absolute', left: x + 400, top: y + 300, width: w, height: hgt, opacity: sl.opacity, transformOrigin: '50% 50%',
      transform: `translateZ(${z}px) rotate(${rot + b}deg) scale(${sl.scale})`, filter: blur ? `blur(${blur}px)` : undefined}}>
      {children}
    </div>
  );
};
