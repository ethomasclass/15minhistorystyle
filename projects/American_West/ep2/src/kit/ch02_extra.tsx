// Helpers for Ep 2 chapters 1-3 (Cheap as Dirt: the cold open, Four-Dollar Cows, The Long Drive): a state lit on the series map,
// a herd of small longhorns standing on the map, a stamped price tag, a plain numbers card, and a camera on a crop of a picture
// (stereo halves, book pages). Everything stays on the black desk; marks step at 12 fps.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, type Place, PALETTES, Traced, useGFrame, useHand, usePal} from './Kit';
import type {MaskRef} from './maskref';
import {SHADOW, SoftTint, tornPoly} from '../samples/kit';
import {keys, ScrimTag, useSlap, zkeys} from '../previews/fx';
import {MProp, TPL} from './trails';
import {W_MAP, type WApi} from './ch01_extra';

const PAL = PALETTES.locked;

/** A state lit on the series map (today's outline, for orientation): see-through hatch in `color`, dashed rim. */
export const MState: React.FC<{api: WApi; name: string; at: number; color?: string; out?: number; k?: number}> = ({api, name, at, color, out = 1e7, k: kMax = 1}) => {
  const g = useGFrame();
  if (g < at || g > out + 10) return null;
  const k = kMax * Math.min(interpolate(g, [at, at + 8], [0, 1], clamp), interpolate(g, [out, out + 10], [1, 0], clamp));
  const c = color ?? PAL.subject;
  const [W, H] = W_MAP.size;
  const d = W_MAP.states[`USA:${name}`];
  const gap = api.px(16);
  const id = `ms-${name.replace(/\W/g, '')}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(1px)', opacity: k}}>
      <defs>
        <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={gap} stroke={c} strokeWidth={api.px(2.6)} />
        </pattern>
      </defs>
      <path d={d} fill={c} opacity={0.13} />
      <path d={d} fill={`url(#${id})`} opacity={0.5} />
      <path d={d} fill="none" stroke={c} strokeWidth={api.px(3)} strokeDasharray={`${api.px(10)} ${api.px(7)}`} opacity={0.9} />
    </svg>
  );
};

/** A loose herd of the pre-cut longhorn standing on the map around a point, dropping in one by one from `at`. */
export const MCattle: React.FC<{api: WApi; at: number; center: number[]; n?: number; spread?: number; w?: number; seed?: string; per?: number; out?: number}> = ({
  api, at, center, n = 7, spread = 160, w = 70, seed = 'mc', per = 2, out,
}) => (
  <>
    {Array.from({length: n}).map((_, i) => {
      const a = random(`${seed}a${i}`) * Math.PI * 2;
      const r = Math.sqrt(random(`${seed}r${i}`)) * spread;
      const p = [center[0] + Math.cos(a) * r, center[1] + Math.sin(a) * r * 0.7];
      return <MProp key={i} api={api} at={p} name="p2_longhorn" w={w * (0.8 + random(`${seed}w${i}`) * 0.35)} show={at + i * per} out={out} flip={random(`${seed}f${i}`) > 0.5} />;
    })}
  </>
);
export {TPL};

/** A stamped tag on dark paper (mono head + a big Abril figure), torn top; slaps down at `at`. */
export const PriceTag: React.FC<{x: number; y: number; head: string; value: string; at: number; rot?: number; color?: string; w?: number; seed?: number}> = ({
  x, y, head, value, at, rot = -3, color, w = 440, seed = 3,
}) => {
  const sl = useSlap(at, 1.3);
  const pal = usePal();
  if (!sl.on) return null;
  const h = 230;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) scale(${sl.scale})`, opacity: sl.opacity}}>
      <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(12px 15px 0 ${SHADOW})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(w, h, seed, {t: true, b: true}, 8), background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)'}}>
          <div style={{position: 'absolute', left: 18, right: 18, top: 70, height: 2, background: pal.mark, opacity: 0.9}} />
          <div style={{position: 'absolute', inset: 10, border: `3px solid ${color ?? pal.mark}`, opacity: 0.55}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 30, top: 24, fontFamily: JF.mono, fontSize: 28, letterSpacing: 4, color: pal.mark, whiteSpace: 'nowrap'}}>{head}</div>
      <div style={{position: 'absolute', left: 28, top: 84, fontFamily: JF.display, fontSize: 118, lineHeight: 1, color: color ?? '#f4efe6', whiteSpace: 'nowrap', textShadow: `5px 6px 0 ${SHADOW}`}}>{value}</div>
    </div>
  );
};

/**
 * A full-frame camera on a crop window of a picture (a stereo card's left half, a page): keys [frame, cx, cy, s] in source px,
 * clamped so the frame never shows past the window. Optional mask tint/trace; children get S (source -> screen).
 */
export const CropCam: React.FC<{src: string; size: [number, number]; win: [number, number, number, number]; k: [number, number, number, number][]; filter?: string; tag?: string; tagY?: number;
  mask?: MaskRef; tintAt?: number; tint?: number; traceAt?: number; vignette?: number; children?: (S: (x: number, y: number) => [number, number], s: number) => React.ReactNode}> = ({
  src, size, win, k, filter = 'grayscale(1) contrast(1.2) brightness(0.98)', tag, tagY = 24, mask, tintAt, tint = 0.62, traceAt, vignette = 0.55, children,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const [x0, y0, x1, y1] = win;
  const smin = Math.max(1920 / (x1 - x0), 1080 / (y1 - y0));
  const s = Math.max(smin, zkeys(f, k.map(([a, , , z]) => [a, z] as [number, number])));
  const cx = Math.min(x1 - 960 / s, Math.max(x0 + 960 / s, keys(f, k.map(([a, x]) => [a, x] as [number, number]))));
  const cy = Math.min(y1 - 540 / s, Math.max(y0 + 540 / s, keys(f, k.map(([a, , y]) => [a, y] as [number, number]))));
  const place: Place = {left: 960 - cx * s, top: 540 - cy * s, scale: s};
  const S = (x: number, y: number): [number, number] => [place.left + x * s, place.top + y * s];
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * s, height: size[1] * s, filter}} />
      {mask && tintAt !== undefined && g >= tintAt && <SoftTint mask={mask.alpha} place={place} size={size} strength={tint * interpolate(g, [tintAt, tintAt + 5], [0, 1], clamp)} />}
      {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt} dur={12} width={5} part={0.93} />}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,${vignette}) 100%)`}} />
      {children?.(S, s)}
      {tag && <ScrimTag text={tag} x={34} y={tagY} />}
    </AbsoluteFill>
  );
};

/** A dark card of numbers: a mono head, then rows of [big figure, label], each slapping in on its own frame. */
export const NumbersCard: React.FC<{x: number; y: number; w: number; head: string; rows: {fig: string; label: string; at: number; color?: string}[]; at: number; rot?: number; rowH?: number}> = ({
  x, y, w, head, rows, at, rot = -1.5, rowH = 150,
}) => {
  const sl = useSlap(at, 1.2);
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (!sl.on) return null;
  const h = 110 + rows.length * rowH;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) scale(${sl.scale})`, opacity: sl.opacity}}>
      <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(14px 18px 0 ${SHADOW})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(w, h, 7, {t: true, b: true}, 9), background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)'}}>
          <div style={{position: 'absolute', left: 22, right: 22, top: 88, height: 2, background: pal.mark, opacity: 0.9}} />
          {rows.map((_, i) => i > 0 && <div key={i} style={{position: 'absolute', left: 22, right: 22, top: 100 + i * rowH, height: 1.5, background: pal.mark, opacity: 0.3}} />)}
        </div>
      </div>
      <div style={{position: 'absolute', left: 34, top: 34, fontFamily: JF.mono, fontSize: 28, letterSpacing: 4, color: pal.mark, whiteSpace: 'nowrap'}}>{head}</div>
      {rows.map((r, i) => {
        if (g < r.at) return null;
        const k = interpolate(g, [r.at, r.at + 3, r.at + 6], [1.3, 0.95, 1], clamp);
        const p = interpolate(g, [r.at + 2, r.at + 12], [0, 1], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: 34, top: 118 + i * rowH, display: 'flex', alignItems: 'baseline', gap: 28, whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: JF.display, fontSize: 92, lineHeight: 1, color: r.color ?? '#f4efe6', transform: `scale(${k})`, transformOrigin: 'left center', textShadow: `5px 6px 0 ${SHADOW}`}}>{r.fig}</div>
            <div style={{fontFamily: hand.family, fontSize: 50 * hand.scale, color: pal.mark, clipPath: `inset(-60% ${(1 - p) * 100}% -60% -5%)`,
              textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>{r.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/** A big counter "1/3 · 2/3 · 3/3": three dark sockets, the current one lit orange-on-dark with its label. */
export const ThreeCount: React.FC<{x: number; y: number; n: number; at: number; label: string}> = ({x, y, n, at, label}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.3, 0.95, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 18}}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{width: 74, height: 74, borderRadius: '50%', boxSizing: 'border-box', border: `5px solid ${i <= n ? '#FF9F1C' : 'rgba(47,224,196,0.35)'}`,
          background: i === n ? '#FF9F1C' : '#16140f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 44,
          color: i === n ? '#111' : i < n ? '#FF9F1C' : 'rgba(47,224,196,0.5)', boxShadow: `6px 7px 0 ${SHADOW}`, transform: i === n ? `scale(${k})` : undefined}}>{i}</div>
      ))}
      <div style={{marginLeft: 14, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.mark, background: '#0b0a08', padding: '8px 16px', whiteSpace: 'nowrap',
        boxShadow: `6px 7px 0 ${SHADOW}`}}>{`${n} / 3 · ${label}`}</div>
    </div>
  );
};

/**
 * A portrait as a full cut-out of the bust (the series rule, Oct 27): no paper, no photo background, no mount; head and shoulders
 * on the desk with a soft contact shadow. The beat's subject takes the coral see-through tint (`tint`) and the teal trace (`traceAt`);
 * anyone else is plain B&W (tint 0), with or without a trace. Placed in screen px: the mask's subject box at (x, y), `w` wide.
 */
export const Bust: React.FC<{src: string; size: [number, number]; m: MaskRef; x: number; y: number; w: number; at: number; tint?: number; tintAt?: number; traceAt?: number;
  filter?: string; rot?: number}> = ({src, size, m, x, y, w, at, tint = 0, tintAt, traceAt, filter = 'grayscale(1) contrast(1.18) brightness(1.0)', rot = 0}) => {
  const sl = useSlap(at, 1.18);
  const g = useGFrame();
  if (!sl.on) return null;
  const [x0, y0, x1, y1] = m.data.boxes.subject;
  const sc = w / (x1 - x0);
  const place: Place = {left: x - x0 * sc, top: y - y0 * sc, scale: sc};
  const W = size[0] * sc;
  const H = size[1] * sc;
  const mk: React.CSSProperties = {WebkitMaskImage: `url(${staticFile(m.alpha)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(m.alpha)})`, maskSize: '100% 100%'} as React.CSSProperties;
  const cx = x + w / 2;
  const cy = y + ((y1 - y0) * sc) / 2;
  const k = tintAt === undefined ? 1 : interpolate(g, [tintAt, tintAt + 5], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: sl.opacity, transform: `rotate(${rot}deg) scale(${sl.scale})`, transformOrigin: `${cx}px ${cy}px`}}>
      <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(10px 22px 16px rgba(0,0,0,0.78))`}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: W, height: H, filter, ...mk}} />
        {tint > 0 && (tintAt === undefined || g >= tintAt) && <SoftTint mask={m.alpha} place={place} size={size} strength={tint * k} />}
      </div>
      {traceAt !== undefined && <Traced paths={m.data.shapes.subject} place={place} at={traceAt} dur={12} width={5} part={0.93} />}
    </AbsoluteFill>
  );
};
