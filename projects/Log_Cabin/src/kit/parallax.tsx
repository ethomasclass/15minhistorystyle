// 2.5D parallax for any picture with a subject mask: archival photos as well as the Flow cards.
// Layers come from tools/layers.py (public/img/layers/<name>_fg.webp + _bg.jpg). Without them the scene falls back
// to the flat picture, so a scene can be built before its layers exist. Generalised from Good Luck's Layered.
import React from 'react';
import {AbsoluteFill, Easing, getStaticFiles, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {clamp} from '../lib/anim';
import {INK, Tag, Tint, Traced, type Place} from './Kit';
import type {MaskRef} from './maskref';

const hasFile = (p: string) => getStaticFiles().some((f) => f.name === p);

/** One living detail over the picture (screen space). */
export type Fx =
  | {kind: 'flicker'; x: number; y: number; r?: number; strength?: number}   // gas lamp, match, window light
  | {kind: 'dust'; x: number; y: number; w: number; h: number}             // dust in a sunbeam, pollen over a field
  | {kind: 'smoke'; x: number; y: number}                                   // cigar smoke rising in a grandstand
  | {kind: 'film'};                                                         // exposure flicker, scratches and gate weave

const Effect: React.FC<{fx: Fx}> = ({fx}) => {
  const f = useCurrentFrame();
  if (fx.kind === 'flicker') {
    const k = 0.55 + noise2D('fl', f * 0.3, fx.x) * 0.25 + noise2D('fl2', f * 1.2, 0) * 0.1;
    const r = fx.r ?? 520;
    return <AbsoluteFill style={{mixBlendMode: 'soft-light', opacity: (fx.strength ?? 0.9) * k,
      background: `radial-gradient(circle ${r}px at ${fx.x}px ${fx.y}px, rgba(255,214,160,1) 0%, rgba(255,200,140,0.35) 45%, transparent 100%)`}} />;
  }
  if (fx.kind === 'dust') {
    return (
      <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
        {Array.from({length: 36}).map((_, i) => {
          const sx = fx.x + random(`dx${i}`) * fx.w + noise2D(`dn${i}`, f * 0.01, 0) * 60;
          const sy = fx.y + ((random(`dy${i}`) * fx.h + f * (0.15 + random(`dv${i}`) * 0.3)) % fx.h);
          const s = 2 + random(`ds${i}`) * 3;
          return <div key={i} style={{position: 'absolute', left: sx, top: sy, width: s, height: s, borderRadius: '50%', background: '#fff6e0',
            opacity: 0.2 + 0.3 * Math.abs(noise2D(`do${i}`, f * 0.05, 0))}} />;
        })}
      </AbsoluteFill>
    );
  }
  if (fx.kind === 'smoke') {
    return (
      <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
        {Array.from({length: 10}).map((_, i) => {
          const life = 150;
          const t = ((f + i * (life / 10)) % life) / life;
          const x = fx.x + noise2D(`sm${i}`, t * 2, i) * 50 + t * 40;
          const y = fx.y - t * 300;
          const s = 40 + t * 200;
          return <div key={i} style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(225,225,225,0.3) 0%, transparent 70%)', opacity: Math.sin(Math.PI * t) * 0.7, filter: 'blur(12px)'}} />;
        })}
      </AbsoluteFill>
    );
  }
  const fl = 0.04 + Math.abs(noise2D('ff', f * 0.8, 0)) * 0.05;
  const k = Math.floor(f / 3);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: '#fff', opacity: fl, mixBlendMode: 'overlay'}} />
      {random(`scr${k}`) > 0.6 && <div style={{position: 'absolute', left: random(`scx${k}`) * 1920, top: 0, width: 1.5, height: 1080, background: 'rgba(255,255,255,0.25)'}} />}
    </AbsoluteFill>
  );
};

type Cam = {z?: [number, number]; x?: [number, number]; y?: [number, number]; ease?: (t: number) => number};

/**
 * A picture as a 2.5D scene over frames a..b. `size` is the source's pixel size (masks are in source pixels).
 * `fx`/`fy` (0..1) is the point the camera centres on; `cam` z/x/y are [start, end] (zoom; extra pan as a fraction of
 * the picture). The subject floats at `depth` (1 = flat), so it slides against the background as the camera moves.
 * `crop` (source pixels x0, y0, x1, y1) keeps the camera inside a region, e.g. inside a glass negative's black border.
 * `tint` colours the subject coral (null for none: Flow cards are already coral); `traceAt` draws the teal outline.
 */
export const Parallax: React.FC<{name: string; src: string; size: [number, number]; a: number; b: number; tag: string; fx?: number; fy?: number; cam?: Cam;
  depth?: number; crop?: [number, number, number, number]; frame?: [number, number]; mask?: MaskRef; tint?: string | null; traceAt?: number; filter?: string; effects?: Fx[]; vignette?: number; children?: (p: Place) => React.ReactNode}> = ({
  name, src, size, a, b, tag, fx = 0.5, fy = 0.5, cam = {}, depth = 1.06, crop, frame = [1920, 1080], mask, tint, traceAt, filter = 'grayscale(1) contrast(1.2) brightness(0.97)', effects = [], vignette = 0.6, children,
}) => {
  const f = useCurrentFrame();
  const layered = hasFile(`img/layers/${name}_fg.webp`) && hasFile(`img/layers/${name}_bg.jpg`);
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: cam.ease ?? Easing.inOut(Easing.sin)});
  const lerp = (r: [number, number] | undefined, d: number) => (r ? r[0] + (r[1] - r[0]) * u : d);
  const [W, H] = size;
  const z = lerp(cam.z, 1.03 + 0.07 * u);
  const [x0, y0, x1, y1] = crop ?? [0, 0, W, H];
  const [FW, FH] = frame;
  const base = Math.max(FW / (x1 - x0), FH / (y1 - y0)) * z;
  // the centre point, clamped so the visible window stays inside the crop (no black edges, no film border)
  const hw = FW / 2 / base, hh = FH / 2 / base;
  const cx = Math.min(x1 - hw, Math.max(x0 + hw, x0 + fx * (x1 - x0) + lerp(cam.x, 0) * (x1 - x0)));
  const cy = Math.min(y1 - hh, Math.max(y0 + hh, y0 + fy * (y1 - y0) + lerp(cam.y, 0) * (y1 - y0)));
  const drift = {x: noise2D(`${name}x`, f * 0.018, 0) * 3, y: noise2D(`${name}y`, 0, f * 0.018) * 3};
  const place = (d: number): Place => {
    const s = base * d;
    return {left: FW / 2 - cx * s + drift.x * d, top: FH / 2 - cy * s + drift.y * d, scale: s};
  };
  const img = (file: string, p: Place, extra?: React.CSSProperties) => (
    <Img src={staticFile(file)} style={{position: 'absolute', left: p.left, top: p.top, width: W * p.scale, height: H * p.scale, filter, ...extra}} />
  );
  const fg = layered ? place(depth) : place(1);
  const film = effects.some((e) => e.kind === 'film');
  const weave = film ? {x: noise2D('gw', f * 0.5, 0) * 1.5, y: noise2D('gw', 0, f * 0.5) * 1.5} : {x: 0, y: 0};
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${weave.x}px, ${weave.y}px)`}}>
        {layered ? (
          <>
            {img(`img/layers/${name}_bg.jpg`, place(1))}
            {/* contact shadow: the lifted subject darkens what's behind it */}
            {img(`img/layers/${name}_fg.webp`, fg, {filter: 'brightness(0) blur(12px)', opacity: 0.28, transform: 'translate(6px, 10px)'})}
            {img(`img/layers/${name}_fg.webp`, fg)}
          </>
        ) : img(src, place(1))}
        {mask && tint !== null && <Tint mask={mask.alpha} place={fg} size={size} color={tint ?? undefined} />}
        {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={fg} at={traceAt} dur={12} width={5} part={0.92} />}
        {effects.filter((e) => e.kind !== 'film').map((e, i) => <Effect key={i} fx={e} />)}
        {children?.(fg)}
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,${vignette}) 100%)`}} />
        {film && <Effect fx={{kind: 'film'}} />}
      </AbsoluteFill>
      <Tag text={tag} y={FH - 50} />
    </AbsoluteFill>
  );
};
