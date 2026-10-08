// Ouija scene helpers on top of the field-notebook kit:
//   Layered    a Gemini painting as a 2.5D scene: subject layer over a painted-out background, each at its own depth,
//              a smooth eased camera with handheld drift, coral subject + teal trace, B&W like the archive, and one
//              living detail (lamp flicker, dust, snow, steam, a flashlight beam).
//   DropCard   a picture dropped onto the dark desk with weight: spring overshoot, contact shadow, motion blur.
//   SyncQuote  a quote that appears word by word exactly as the narrator says it.
//   Arch       a full-bleed archival picture (B&W, slow push) with its source tag, or a labelled stand-in until it exists.
import React from 'react';
import {AbsoluteFill, Easing, getStaticFiles, Img, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {noise2D} from '@remotion/noise';
import {clamp} from '../lib/anim';
import {FPS} from '../lib/theme';
import {JF, type MaskData, Tag, Tint, Traced, useGFrame, usePal} from './Kit';
import {DarkPaper} from './common';
import type {TL} from './shell';

export const hasFile = (p: string) => getStaticFiles().some((f) => f.name === p);

// ---------------------------------------------------------------------------------------------
// Looks. Everything is graded into the same family as the archival pictures.
export const LOOK = {
  bw: 'grayscale(1) contrast(1.2) brightness(0.96)',
  warm: 'sepia(0.45) saturate(0.55) contrast(1.12) brightness(0.94)',
  color: 'saturate(0.8) contrast(1.06) brightness(0.96)',
  night: 'grayscale(1) contrast(1.3) brightness(0.8)',
};
export type Look = keyof typeof LOOK;

const GEN_SIZE: [number, number] = [1376, 768];

/** Masks for the paintings: written by tools/trace.py (alpha PNG + outline JSON). */
const MASKS = new Map<string, MaskData>();
export const registerMask = (name: string, d: unknown) => MASKS.set(name, d as MaskData);

type Cam = {z?: [number, number]; x?: [number, number]; y?: [number, number]; ease?: (t: number) => number};

export type Fx =
  | {kind: 'flicker'; x: number; y: number; r?: number; color?: string; strength?: number}
  | {kind: 'dust'; x: number; y: number; w: number; h: number}
  | {kind: 'snow'}
  | {kind: 'steam'; x: number; y: number}
  | {kind: 'beam'; x: number; y: number; angle: [number, number]}
  | {kind: 'halftone'}
  | {kind: 'film'};

/** One living detail over a painting (screen space). */
const Effect: React.FC<{fx: Fx}> = ({fx}) => {
  const f = useCurrentFrame();
  if (fx.kind === 'flicker') {
    const k = 0.55 + noise2D('fl', f * 0.3, fx.x) * 0.25 + noise2D('fl2', f * 1.2, 0) * 0.1;
    const r = fx.r ?? 520;
    return <AbsoluteFill style={{mixBlendMode: 'soft-light', opacity: (fx.strength ?? 0.9) * k,
      background: `radial-gradient(circle ${r}px at ${fx.x}px ${fx.y}px, ${fx.color ?? 'rgba(255,190,110,1)'} 0%, rgba(255,170,90,0.35) 45%, transparent 100%)`}} />;
  }
  if (fx.kind === 'dust') {
    return (
      <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
        {Array.from({length: 40}).map((_, i) => {
          const sx = fx.x + random(`dx${i}`) * fx.w + noise2D(`dn${i}`, f * 0.01, 0) * 60;
          const sy = fx.y + ((random(`dy${i}`) * fx.h + f * (0.15 + random(`dv${i}`) * 0.3)) % fx.h);
          const s = 2 + random(`ds${i}`) * 3;
          return <div key={i} style={{position: 'absolute', left: sx, top: sy, width: s, height: s, borderRadius: '50%', background: '#fff6e0',
            opacity: 0.25 + 0.35 * Math.abs(noise2D(`do${i}`, f * 0.05, 0)), boxShadow: '0 0 6px rgba(255,240,210,0.8)'}} />;
        })}
      </AbsoluteFill>
    );
  }
  if (fx.kind === 'snow') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {Array.from({length: 90}).map((_, i) => {
          const sp = 1.2 + random(`sv${i}`) * 2.2;
          const sx = random(`sx${i}`) * 1980 - 30 + Math.sin((f + i * 13) / (20 + random(`sw${i}`) * 25)) * 18;
          const sy = (random(`sy${i}`) * 1140 + f * sp) % 1140 - 30;
          const s = 2 + random(`ss${i}`) * 4 * (sp / 3);
          return <div key={i} style={{position: 'absolute', left: sx, top: sy, width: s, height: s, borderRadius: '50%', background: '#f4f2ee', opacity: 0.35 + random(`so${i}`) * 0.45,
            filter: sp < 1.8 ? 'blur(1px)' : undefined}} />;
        })}
      </AbsoluteFill>
    );
  }
  if (fx.kind === 'steam') {
    return (
      <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
        {Array.from({length: 14}).map((_, i) => {
          const life = 90;
          const t = ((f + i * (life / 14)) % life) / life;
          const x = fx.x + noise2D(`st${i}`, t * 2, i) * 70 + t * 30;
          const y = fx.y - t * 420;
          const s = 80 + t * 260;
          return <div key={i} style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(235,235,235,0.35) 0%, transparent 70%)', opacity: Math.sin(Math.PI * t) * 0.8, filter: 'blur(14px)'}} />;
        })}
      </AbsoluteFill>
    );
  }
  if (fx.kind === 'beam') {
    const a = interpolate(noise2D('bm', f * 0.012, 0), [-1, 1], fx.angle);
    return <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.55,
      background: `conic-gradient(from ${a - 14}deg at ${fx.x}px ${fx.y}px, transparent 0deg, rgba(255,244,214,0.55) 9deg, rgba(255,244,214,0.75) 14deg, rgba(255,244,214,0.55) 19deg, transparent 28deg, transparent 360deg)`,
      WebkitMaskImage: `radial-gradient(circle 1100px at ${fx.x}px ${fx.y}px, #000 0%, transparent 100%)`, maskImage: `radial-gradient(circle 1100px at ${fx.x}px ${fx.y}px, #000 0%, transparent 100%)`}} />;
  }
  if (fx.kind === 'halftone') {
    // 1920s magazine print: a fine dot screen
    return <AbsoluteFill style={{mixBlendMode: 'multiply', opacity: 0.22, backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.9) 0.9px, transparent 1.4px)', backgroundSize: '5px 5px'}} />;
  }
  // film: gate weave is applied by the caller; here, a faint flicker of exposure and a few scratches
  const fl = 0.04 + Math.abs(noise2D('ff', f * 0.8, 0)) * 0.05;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: '#fff', opacity: fl, mixBlendMode: 'overlay'}} />
      {random(`scr${Math.floor(f / 3)}`) > 0.6 && <div style={{position: 'absolute', left: random(`scx${Math.floor(f / 3)}`) * 1920, top: 0, width: 1.5, height: 1080, background: 'rgba(255,255,255,0.25)'}} />}
    </AbsoluteFill>
  );
};

/**
 * A Gemini painting as a 2.5D scene, frames a..b. `cam` z/x/y are [start, end] (zoom; pan as a fraction of the
 * frame). The subject (if the painting has a mask) floats at `depth`. `tint` colours it coral and `traceAt`
 * draws the teal outline. `label` goes in the corner tag ("Illustration · …").
 */
export const Layered: React.FC<{name: string; a: number; b: number; label: string; cam?: Cam; depth?: number; look?: Look; tint?: boolean; traceAt?: number;
  fx?: Fx[]; reveal?: [number, number]; children?: React.ReactNode}> = ({name, a, b, label, cam = {}, depth = 1.07, look = 'bw', tint = false, traceAt, fx = [], reveal, children}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const mask = MASKS.get(name);
  const layered = mask && hasFile(`img/gen/layers/${name}_fg.png`);
  const e = cam.ease ?? Easing.inOut(Easing.sin);
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
  const lerp = (r: [number, number] | undefined, d: number) => (r ? r[0] + (r[1] - r[0]) * u : d);
  const z = lerp(cam.z, 1.04 + 0.06 * u);
  const [W, H] = GEN_SIZE;
  const base = Math.max(1920 / W, 1080 / H) * z;
  const cx = W / 2 + lerp(cam.x, 0) * W, cy = H / 2 + lerp(cam.y, 0) * H;
  const dr = {x: noise2D(`${name}x`, f * 0.018, 0) * 3, y: noise2D(`${name}y`, 0, f * 0.018) * 3};
  const place = (d: number) => {
    const s = base * d;
    return {left: 960 - cx * s + dr.x * d, top: 540 - cy * s + dr.y * d, scale: s};
  };
  const filter = LOOK[look];
  const film = fx.some((x) => x.kind === 'film');
  const weave = film ? {x: noise2D('gw', f * 0.5, 0) * 1.5, y: noise2D('gw', 0, f * 0.5) * 1.5} : {x: 0, y: 0};
  const img = (src: string, d: number, extra?: React.CSSProperties) => {
    const p = place(d);
    return <Img src={staticFile(src)} style={{position: 'absolute', left: p.left, top: p.top, width: W * p.scale, height: H * p.scale, filter, ...extra}} />;
  };
  const fg = place(depth);
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${weave.x}px, ${weave.y}px)`}}>
        {layered ? (
          <>
            {img(`img/gen/layers/${name}_bg.jpg`, 1)}
            {/* contact shadow: the lifted subject darkens what's behind it */}
            {img(`img/gen/layers/${name}_fg.png`, depth, {filter: 'brightness(0) blur(12px)', opacity: 0.3, transform: 'translate(6px, 10px)'})}
            {img(`img/gen/layers/${name}_fg.png`, depth)}
          </>
        ) : img(`img/gen/${name}.jpg`, 1)}
        {reveal && (() => {
          const p = place(layered ? 1 : 1);
          const k = interpolate(f, reveal, [0, 1], clamp);
          const m = `linear-gradient(90deg, transparent ${(1 - k) * 100}%, #000 ${Math.min(100, (1 - k) * 100 + 30)}%)`;
          return <Img src={staticFile(`img/gen/${name}.jpg`)} style={{position: 'absolute', left: p.left, top: p.top, width: W * p.scale, height: H * p.scale, filter: LOOK.color,
            WebkitMaskImage: m, maskImage: m}} />;
        })()}
        {mask && tint && <Tint mask={`img/masks/${name}_magenta_a.png`} place={fg} size={GEN_SIZE} color={pal.subject} strength={0.85} />}
        {mask && traceAt !== undefined && <Traced paths={mask.shapes.magenta} place={fg} at={traceAt} dur={12} width={5} part={0.92} />}
        {fx.filter((x) => x.kind !== 'film').map((x, i) => <Effect key={i} fx={x} />)}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,0.62) 100%)'}} />
        {film && <Effect fx={{kind: 'film'}} />}
      </AbsoluteFill>
      {children}
      <Tag text={`Illustration · ${label}`} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------

/** The dark desk with a slow handheld drift and push; children ride on it. */
export const Desk: React.FC<{a?: number; push?: number; children?: React.ReactNode; still?: React.ReactNode}> = ({a = 0, push = 0.04, children, still}) => {
  const f = useCurrentFrame();
  const z = 1 + Math.max(0, f - a) * (push / 240);
  const d = {x: noise2D('dkx', f * 0.018, 0) * 3, y: noise2D('dky', 0, f * 0.018) * 3, r: noise2D('dkr', f * 0.012, 3) * 0.18};
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${d.x}px, ${d.y}px) rotate(${d.r}deg) scale(${Math.min(z, 1 + push)})`}}>
        <DarkPaper />
        {children}
      </AbsoluteFill>
      {still}
    </AbsoluteFill>
  );
};

const CardInner: React.FC<{src: string; x: number; y: number; w: number; rot: number; at: number; filter: string; out: number; children?: React.ReactNode}> = ({src, x, y, w, rot, at, filter, out, children}) => {
  const f = useCurrentFrame();
  if (f < at || f >= out) return null;
  const sp = spring({frame: f - at, fps: FPS, config: {stiffness: 260, damping: 15, mass: 0.9}});
  const air = 1 - Math.min(sp, 1);
  const scale = 1 + air * 0.4 - Math.max(sp - 1, 0) * 0.6;
  return (
    <div style={{position: 'absolute', left: x, top: y - air * 60, width: w, transform: `scale(${scale}) rotate(${rot + air * 7}deg)`, opacity: Math.min(1, (f - at + 1) / 2)}}>
      <div style={{position: 'relative', background: '#f4efe6', padding: Math.max(8, w * 0.03),
        boxShadow: `0 ${14 + air * 70}px ${12 + air * 60}px rgba(0,0,0,${0.7 - air * 0.35}), 0 2px 3px rgba(0,0,0,${0.5 * (1 - air)})`}}>
        <Img src={staticFile(src)} style={{width: '100%', display: 'block', filter}} />
        {children}
      </div>
    </div>
  );
};

/** A picture dropped onto the desk at frame `at` (with real motion blur while it falls). */
export const DropCard: React.FC<{src: string; x: number; y: number; w: number; rot?: number; at: number; out?: number; filter?: string; children?: React.ReactNode}> = ({
  src, x, y, w, rot = 0, at, out = Infinity, filter = LOOK.bw, children,
}) => {
  const f = useCurrentFrame();
  if (f < at || f >= out) return null;
  if (!hasFile(src)) return <StandIn x={x} y={y} w={w} h={w * 0.7} rot={rot} label={src} />;
  const inner = <CardInner src={src} x={x} y={y} w={w} rot={rot} at={at} filter={filter} out={out}>{children}</CardInner>;
  return f < at + 10 ? <CameraMotionBlur shutterAngle={200} samples={6}>{inner}</CameraMotionBlur> : inner;
};

/** Labelled placeholder for an archival picture that hasn't arrived yet. */
export const StandIn: React.FC<{x: number; y: number; w: number; h: number; rot?: number; label: string}> = ({x, y, w, h, rot = 0, label}) => {
  const pal = usePal();
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, border: `4px dashed ${pal.mark}`, opacity: 0.6,
      display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, color: '#fff', textTransform: 'uppercase', padding: 20}}>
      picture to come<br />{label.split('/').pop()}
    </div>
  );
};

/** Full-bleed archival picture, B&W, slow push, source tag. Size is read once the image loads. */
export const Arch: React.FC<{src: string; tag: string; a: number; b: number; z?: [number, number]; pos?: string; look?: Look; fit?: 'cover' | 'contain'; children?: React.ReactNode}> = ({
  src, tag, a, b, z = [1.02, 1.1], pos = '50% 50%', look = 'bw', fit = 'cover', children,
}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [a, b], z, {...clamp, easing: Easing.inOut(Easing.sin)});
  const d = {x: noise2D('arx', f * 0.018, 0) * 3, y: noise2D('ary', 0, f * 0.018) * 3};
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      {fit === 'contain' && hasFile(src) && <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `${LOOK[look]} blur(20px) brightness(0.4)`}} />}
      {hasFile(src) ? (
        <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: fit, objectPosition: pos, filter: LOOK[look],
          transform: `translate(${d.x}px, ${d.y}px) scale(${k})`, transformOrigin: pos}} />
      ) : <StandIn x={260} y={200} w={1400} h={680} label={src} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,0.6) 100%)'}} />
      {children}
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

/** A quote that appears word by word exactly as the narrator speaks `phrase` (the words as written in the script). */
export const SyncQuote: React.FC<{t: TL; phrase: string; nth?: number; x: number; y: number; w: number; size?: number; color?: string; marks?: Record<number, string>}> = ({
  t, phrase, nth = 1, x, y, w, size = 64, color = '#f4efe6', marks = {},
}) => {
  const f = useCurrentFrame();
  const i0 = t.idx(phrase, nth);
  const n = phrase.split(/\s+/).length;
  const words = t.words.slice(i0, i0 + n);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: size, lineHeight: 1.3, textShadow: '0 3px 14px #000'}}>
      {words.map((wd, i) => {
        const at = Math.round(wd.s * FPS) - 2;
        const k = interpolate(f, [at, at + 5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const u = marks[i];
        const p = u ? interpolate(f, [at + 4, at + 10], [0, 1], clamp) : 0;
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', paddingRight: '0.28em', color, opacity: k, transform: `translateY(${(1 - k) * 12}px)`}}>
            {(i === 0 ? '“' : '') + wd.w.replace(/^["“]|["”]$/g, '') + (i === n - 1 ? '”' : '')}
            {u && p > 0 && <span style={{position: 'absolute', left: -3, bottom: -2, height: 7, borderRadius: 4, background: u, width: `calc(${p} * (100% - 0.2em))`}} />}
          </span>
        );
      })}
    </div>
  );
};

/**
 * A big picture seen through a moving camera: `keys` are [frame, x, y, s] (s = screen px per source px), eased
 * between keys. Children are drawn in source pixels (use `sw` for a constant-width stroke).
 */
export const SrcView: React.FC<{src: string; size: [number, number]; keys: [number, number, number, number][]; look?: Look; card?: boolean;
  children?: (sw: (px: number) => number) => React.ReactNode}> = ({src, size, keys, look = 'bw', card = false, children}) => {
  const f = useCurrentFrame();
  let k0 = keys[0], k1 = keys[0];
  for (let i = 0; i < keys.length; i++) {
    if (f >= keys[i][0]) { k0 = keys[i]; k1 = keys[Math.min(i + 1, keys.length - 1)]; }
  }
  const u = k1[0] > k0[0] ? interpolate(f, [k0[0], k1[0]], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 1;
  const [x, y, s] = [1, 2, 3].map((i) => k0[i] + (k1[i] - k0[i]) * u);
  const d = {x: noise2D('svx', f * 0.018, 0) * 3, y: noise2D('svy', 0, f * 0.018) * 3};
  const pad = card ? 18 / s : 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${960 - x * s + d.x}px, ${540 - y * s + d.y}px) scale(${s})`}}>
      {card && <div style={{position: 'absolute', left: -pad, top: -pad, width: size[0] + 2 * pad, height: size[1] + 2 * pad, background: '#f4efe6', boxShadow: `0 ${18 / s}px ${40 / s}px rgba(0,0,0,0.7)`}} />}
      <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: size[0], height: size[1], filter: LOOK[look]}} />
      {children?.((px) => px / s)}
    </div>
  );
};

/** Overlapping bands on a timeline (love, fun, grief, fear): qualitative, no numbers. Each band fades up at its cue. */
export const Bands: React.FC<{x: number; y: number; w: number; from: number; to: number; bands: {label: string; color: string; a: number; b: number; at: number}[]; axisAt: number; ticks?: number[]}> = ({
  x, y, w, from, to, bands, axisAt, ticks = [],
}) => {
  const g = useGFrame();
  const X = (yr: number) => x + ((yr - from) / (to - from)) * w;
  const axis = interpolate(g, [axisAt, axisAt + 10], [0, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y + bands.length * 74 + 10, width: w * axis, height: 5, background: '#f4efe6', opacity: 0.8}} />
      {ticks.map((yr) => g >= axisAt + 8 && (
        <div key={yr} style={{position: 'absolute', left: X(yr) - 60, top: y + bands.length * 74 + 26, width: 120, textAlign: 'center', fontFamily: JF.display, fontSize: 40, color: '#f4efe6'}}>{yr}</div>
      ))}
      {bands.map((b, i) => {
        const k = interpolate(g, [b.at, b.at + 8], [0, 1], clamp);
        if (k <= 0) return null;
        return (
          <div key={b.label} style={{position: 'absolute', left: X(b.a), top: y + i * 74, width: (X(b.b) - X(b.a)) * k, height: 56, background: b.color, opacity: 0.78, borderRadius: 4,
            clipPath: `polygon(0 6%, 100% 0, 99% 94%, 1% 100%)`}}>
            <div style={{position: 'absolute', left: 16, top: 4, fontFamily: JF.display, fontSize: 40, color: '#111', whiteSpace: 'nowrap'}}>{b.label}</div>
          </div>
        );
      })}
    </>
  );
};

/** Horizontal bars drawn on slowly (death tolls, survey results). Values are labelled; no axis. */
export const HBars: React.FC<{x: number; y: number; w: number; max: number; rows: {label: string; value: number; text: string; color: string; at: number}[]; gap?: number}> = ({x, y, w, max, rows, gap = 150}) => {
  const g = useGFrame();
  return (
    <>
      {rows.map((r, i) => {
        const k = interpolate(g, [r.at, r.at + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        if (g < r.at) return null;
        return (
          <div key={r.label} style={{position: 'absolute', left: x, top: y + i * gap}}>
            <div style={{fontFamily: JF.mono, fontSize: 28, letterSpacing: 2, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', marginBottom: 10}}>{r.label}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{width: (w * r.value / max) * k, height: 58, background: r.color, clipPath: 'polygon(0 4%, 100% 0, 99% 96%, 1% 100%)'}} />
              <div style={{fontFamily: JF.display, fontSize: 64, color: '#f4efe6', opacity: k, whiteSpace: 'nowrap'}}>{r.text}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

/** A number counting up from 0 to `to` between frames at and at+dur. */
export const CountUp: React.FC<{x: number; y: number; to: number; at: number; dur?: number; size?: number; prefix?: string; suffix?: string; color?: string}> = ({
  x, y, to, at, dur = 30, size = 150, prefix = '', suffix = '', color = '#f4efe6',
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const v = Math.round(to * interpolate(g, [at, at + dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}));
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.display, fontSize: size, lineHeight: 1, color, textShadow: '0 6px 22px rgba(0,0,0,0.8)'}}>{prefix}{v.toLocaleString('en-US')}{suffix}</div>;
};
