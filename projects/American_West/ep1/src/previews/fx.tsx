// Motion and depth for the West motion previews: slap-down with overshoot, decaying camera shake, a breathing sway,
// whip transitions, a photo camera with parallax layers, and a tilted 3D desk with a lamp pool, stains, contact shadows
// that grow with height and depth-of-field blur. Marks keep the 12 fps step (useGFrame); cameras use the real frame.
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Highlight, JF, type Place, Traced, useGFrame} from '../kit/Kit';
import {SoftTint} from '../samples/kit';
import type {MaskRef} from '../kit/maskref';

export const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
/** Smooth camera value between keyframes [frame, value][] (smoothstep per segment). */
export const keys = (f: number, ks: [number, number][]) => {
  if (f <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    const [f0, v0] = ks[i - 1];
    const [f1, v1] = ks[i];
    if (f <= f1) return v0 + (v1 - v0) * ease((f - f0) / (f1 - f0));
  }
  return ks[ks.length - 1][1];
};
/** Log-space zoom keys so pushes feel even. */
export const zkeys = (f: number, ks: [number, number][]) => Math.exp(keys(f, ks.map(([a, b]) => [a, Math.log(b)] as [number, number])));

/** Slap-down: starts ~130% and high, snaps down with a small squash overshoot. Stepped at 12 fps like every mark. */
export const useSlap = (at: number, from = 1.3) => {
  const g = useGFrame();
  const s = spring({frame: g - at, fps: 30, config: {stiffness: 420, damping: 13, mass: 0.6}});
  const scale = from - (from - 1) * s; // s overshoots past 1 -> scale dips under 1 (squash), then settles
  return {on: g >= at, scale, lift: Math.max(0, scale - 1), opacity: Math.min(1, (g - at + 1) / 2)};
};

/** Exponentially decaying shake after each hard landing (screen px). */
export const shake = (f: number, hits: number[], amp = 9, decay = 0.22) => {
  let x = 0;
  let y = 0;
  for (const h of hits) {
    if (f < h) continue;
    const k = Math.exp(-(f - h) * decay) * amp;
    x += Math.sin((f - h) * 2.3 + h) * k;
    y += Math.cos((f - h) * 3.1 + h) * k * 0.8;
  }
  return {x, y};
};

/** Tiny sway for settled pieces. */
export const breathe = (f: number, seed: number, amp = 0.35) => ({rot: Math.sin(f / 38 + seed) * amp, y: Math.sin(f / 51 + seed * 2) * 1.6});

/** Scene switcher with whip pans: [startFrame, node, whip?][]; a whip blurs both shots sideways over 8 frames. */
export const Shots: React.FC<{shots: [number, React.ReactNode, ('whip' | 'cut')?][]}> = ({shots}) => {
  const f = useCurrentFrame();
  let i = 0;
  shots.forEach(([s], k) => {
    if (f >= s) i = k;
  });
  const W = 8;
  const next = shots[i + 1];
  // the outgoing half of a whip into the next shot
  if (next && next[2] === 'whip' && f >= next[0] - W / 2) {
    const k = (f - (next[0] - W / 2)) / (W / 2);
    return <AbsoluteFill style={{transform: `translateX(${-k * k * 900}px)`, filter: `blur(${k * 26}px)`}}>{shots[i][1]}</AbsoluteFill>;
  }
  const cur = shots[i];
  if (cur[2] === 'whip' && f < cur[0] + W / 2) {
    const k = 1 - (f - cur[0]) / (W / 2);
    return <AbsoluteFill style={{transform: `translateX(${k * k * 900}px)`, filter: `blur(${k * 26}px)`}}>{cur[1]}</AbsoluteFill>;
  }
  return <>{cur[1]}</>;
};

/**
 * A camera on an archival photo: (cx, cy) in source px at s screen px per source px. With fg/bg layers, the foreground
 * scales a little faster than the background (parallax push). children get S (source -> screen) and the place.
 */
export const PhotoCam: React.FC<{src: string; size: [number, number]; cx: number; cy: number; s: number; bw?: string; fg?: string; bg?: string; fgK?: number;
  mask?: MaskRef; tintAt?: number; traceAt?: number; vignette?: number; children?: (S: (x: number, y: number) => [number, number], p: Place) => React.ReactNode}> = ({
  src, size, cx, cy, s, bw = 'grayscale(1) contrast(1.22) brightness(0.98)', fg, bg, fgK = 0, mask, tintAt, traceAt, vignette = 0.6, children,
}) => {
  const g = useGFrame();
  const place: Place = {left: 960 - cx * s, top: 540 - cy * s, scale: s};
  const s2 = s * (1 + fgK);
  const fplace: Place = {left: 960 - cx * s2, top: 540 - cy * s2, scale: s2};
  const S = (x: number, y: number): [number, number] => [place.left + x * s, place.top + y * s];
  const img = (file: string, p: Place) => <Img src={staticFile(file)} style={{position: 'absolute', left: p.left, top: p.top, width: size[0] * p.scale, height: size[1] * p.scale, filter: bw}} />;
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      {fg && bg ? <>{img(bg, place)}{img(fg, fplace)}</> : img(src, place)}
      {mask && tintAt !== undefined && g >= tintAt && <SoftTint mask={mask.alpha} place={place} size={size} strength={0.65 * interpolate(g, [tintAt, tintAt + 5], [0, 1], clamp)} />}
      {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt} dur={12} width={5} part={0.92} />}
      {children?.(S, place)}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,${vignette}) 100%)`}} />
    </AbsoluteFill>
  );
};

/** Desk plane coordinates: the plane is 2720 x 1680, offset so desk (400, 300) sits at the screen's top-left when flat. */
export const DESK = {w: 2720, h: 1680, ox: 400, oy: 300};

/** The tilted 3D desk: dark paper with ruling and stains, lit by a lamp pool; children are placed in desk coordinates. */
export const Desk3D: React.FC<{tilt: number; rotZ?: number; z?: number; x?: number; y?: number; lamp?: [number, number]; children: React.ReactNode}> = ({
  tilt, rotZ = 0, z = 1, x = 0, y = 0, lamp = [960, 470], children,
}) => (
  <AbsoluteFill style={{background: '#070605', overflow: 'hidden', perspective: 1700, perspectiveOrigin: '50% 30%'}}>
    <div style={{position: 'absolute', left: -DESK.ox, top: -DESK.oy, width: DESK.w, height: DESK.h, transformStyle: 'preserve-3d', transformOrigin: '50% 50%',
      transform: `translate(${x}px, ${y}px) scale(${z}) rotateX(${tilt}deg) rotateZ(${rotZ}deg)`}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, #3a342b 0%, #221f19 60%, #13110d 100%)'}}>
        <div style={{position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '100% 64px'}} />
        <Img src={staticFile('img/previews/tex_stains.png')} style={{position: 'absolute', left: 300, top: 150, width: 2100, height: 1200, mixBlendMode: 'multiply', opacity: 0.7}} />
      </div>
      {children}
    </div>
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'soft-light', background: `radial-gradient(circle 760px at ${lamp[0]}px ${lamp[1]}px, rgba(255,214,160,0.9) 0%, rgba(255,200,140,0.32) 45%, transparent 100%)`}} />
    <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 1100px 760px at ${lamp[0]}px ${lamp[1]}px, transparent 45%, rgba(0,0,0,0.4) 100%)`}} />
  </AbsoluteFill>
);

/**
 * A piece lying on the desk at height `h` (px above the desk), slapped down at `at`: the content floats on translateZ,
 * its soft contact shadow sits on the desk and spreads/offsets with the height. `blur` = depth-of-field blur (px).
 */
export const Lift: React.FC<{x: number; y: number; w: number; hgt: number; h?: number; at: number; rot?: number; blur?: number; seed?: number; children: React.ReactNode}> = ({
  x, y, w, hgt, h = 6, at, rot = 0, blur = 0, seed = 1, children,
}) => {
  const f = useCurrentFrame();
  const sl = useSlap(at);
  if (!sl.on) return null;
  const z = h + sl.lift * 600;
  const b = breathe(f, seed, 0.25);
  return (
    <>
      <div style={{position: 'absolute', left: x + DESK.ox + z * 0.3, top: y + DESK.oy + z * 0.45, width: w, height: hgt, transform: `rotate(${rot}deg)`,
        background: 'rgba(0,0,0,0.75)', filter: `blur(${3 + z * 0.35}px)`, opacity: sl.opacity * Math.max(0.35, 1 - z / 400)}} />
      <div style={{position: 'absolute', left: x + DESK.ox, top: y + DESK.oy, width: w, height: hgt, opacity: sl.opacity, transformOrigin: '50% 50%',
        transform: `translateZ(${z}px) rotate(${rot + b.rot}deg) scale(${sl.scale})`, filter: blur ? `blur(${blur}px)` : undefined}}>
        {children}
      </div>
    </>
  );
};

/** Source tag on a dark scrim so it stays readable over bright photos. */
export const ScrimTag: React.FC<{text: string; x?: number; y?: number}> = ({text, x = 34, y = 1026}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.mono, fontSize: 18, letterSpacing: 1, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase',
    background: 'rgba(8,7,5,0.72)', padding: '4px 10px', whiteSpace: 'nowrap'}}>{text}</div>
);

/**
 * A torn-tape title that slaps down (130% -> 100% with overshoot) and is revealed only where its tape has wiped on,
 * so the letters never float over a busy picture before the tape is under them.
 */
export const SlapTitle: React.FC<{text: string; x: number; y: number; size: number; at: number; seed?: number; rot?: number}> = ({text, x, y, size, at, seed = 21, rot = -2}) => {
  const s = useSlap(at, 1.35);
  const g = useGFrame();
  if (!s.on) return null;
  const wipe = interpolate(g, [at, at + 8], [0, 1], clamp);
  const w = text.length * size * 0.62 + size * 0.44; // a little under the real box, so the tape stays ahead of the letters
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s.scale})`, transformOrigin: `${x + w / 2}px ${y + size / 2}px`,
      clipPath: wipe < 1 ? `polygon(0 0, ${x + w * wipe}px 0, ${x + w * wipe}px 1080px, 0 1080px)` : undefined}}>
      <Highlight text={text} x={x} y={y} size={size} at={at} seed={seed} rot={rot} />
    </div>
  );
};
