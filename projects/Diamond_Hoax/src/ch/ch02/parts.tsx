// Pieces shared by chapters 2 and 3 (builder A): the archival print on the black desk (Ch01's Print, plus a slow drift),
// the silhouette figures (Arnold, Slack, Janin: no reliable photos), Ralston cut out of his 1913 plate (coral + teal trace),
// a lamp pool, the blank drawn map of the West, and the coin stack for the money note.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, Tint, Traced, useGFrame, usePal, type Place} from '../../kit/Kit';
import {maskRef} from '../../kit/maskref';
import ralstonMask from '../../../public/img/masks/ralston.json';
import coast from '../../fx/moneymap/coast.json';

/** Ralston's mask (made with tools/mask.py's run() on ch02/ralston_william_harpending_plate_1913.jpg, crop 0,0,895,1080). */
export const RALSTON = maskRef('ralston', ralstonMask);
export const RALSTON_SRC = 'img/ch02/ralston_william_harpending_plate_1913.jpg';
export const RALSTON_SIZE: [number, number] = [895, 1230];
export const RALSTON_TAG = 'Harpending, The Great Diamond Hoax, 1913';

/** An archival print on the black desk (no mount: the channel's rule), slapped down with a little overshoot. From Ch01. */
export const Print: React.FC<{src: string; x: number; y: number; w: number; h: number; at: number; rot: number; pos?: string; tag: string; out?: number; zoom?: number}> = ({src, x, y, w, h, at, rot, pos = '50% 25%', tag, out = 1e7, zoom = 1}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%'}}>
      <div style={{width: w, height: h, overflow: 'hidden', boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}}>
        <Img src={staticFile(src)} style={{width: w, height: h, objectFit: 'cover', objectPosition: pos, display: 'block',
          filter: 'grayscale(1) contrast(1.15) brightness(0.95)', transform: `scale(${zoom})`, transformOrigin: pos}} />
      </div>
      <div style={{position: 'absolute', left: 0, top: h + 14, width: w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
        color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div>
    </div>
  );
};

/** A warm lamp pool on the desk, so black silhouettes and props read. */
export const LampPool: React.FC<{x?: number; y?: number; r?: number; a?: number}> = ({x = 960, y = 560, r = 700, a = 0.16}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(255,214,160,${a}) 0%, rgba(255,214,160,${a * 0.4}) 45%, transparent 100%)`}} />
);

const SIL = {arnold: [786, 1600], slack: [588, 1600], janin: [618, 1600]} as const;
export type SilName = keyof typeof SIL;

/**
 * A silhouette figure standing on the desk: a soft pale backing glow so the black reads, a thin teal rim, a contact shadow
 * and a mono label under the feet ("JOHN SLACK · no reliable photo"). `x` is the figure's centre, `y` its feet, `h` its height.
 */
export const Figure: React.FC<{who: SilName; x: number; y: number; h: number; at: number; label?: string; labelAt?: number; flip?: boolean; dim?: number; rim?: boolean}> = ({
  who, x, y, h, at, label, labelAt, flip, dim = 1, rim = true,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const [W, H] = SIL[who];
  const w = (W / H) * h;
  const k = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const sway = Math.sin((g - at) / 40) * 0.6;
  const rimF = rim ? 'drop-shadow(2px 0 0 rgba(47,224,196,0.85)) drop-shadow(-2px 0 0 rgba(47,224,196,0.85)) drop-shadow(0 -2px 0 rgba(47,224,196,0.85))' : '';
  const la = labelAt ?? at + 6;
  return (
    <>
      {/* the backing glow and the contact shadow */}
      <div style={{position: 'absolute', left: x - w * 1.1, top: y - h * 1.05, width: w * 2.2, height: h * 1.1, opacity: k * 0.9 * dim,
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(236,222,196,0.30) 0%, rgba(236,222,196,0.10) 55%, transparent 100%)'}} />
      <div style={{position: 'absolute', left: x - w * 0.6, top: y - 18, width: w * 1.2, height: 36, borderRadius: '50%', opacity: k * 0.8,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, transparent 70%)'}} />
      <div style={{position: 'absolute', left: x - w / 2, top: y - h + (1 - k) * 120, width: w, opacity: Math.min(1, k * 1.6) * dim,
        transform: `rotate(${sway}deg) scaleX(${flip ? -1 : 1})`, transformOrigin: '50% 100%', filter: `${rimF} drop-shadow(0 18px 22px rgba(0,0,0,0.6))`}}>
        <Img src={staticFile(`img/props/sil_${who}.webp`)} style={{width: '100%', display: 'block'}} />
      </div>
      {label && g >= la && (
        <div style={{position: 'absolute', left: x - 260, top: y + 22, width: 520, textAlign: 'center', fontFamily: JF.mono, fontSize: 20, letterSpacing: 1.5,
          color: 'rgba(244,239,230,0.88)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)', opacity: interpolate(g, [la, la + 5], [0, 1], clamp) * dim}}>{label}</div>
      )}
    </>
  );
};

/**
 * Ralston cut out of his plate on the dark desk: coral see-through tint and a teal trace (`tint` false = trace only).
 * `x, y` = top-left of the subject's box on screen, `h` = its height. Springs up at `at`; `push` is a slow zoom over `pushDur`.
 */
export const RalstonCut: React.FC<{x: number; y: number; h: number; at: number; traceAt?: number; tint?: boolean; push?: number; pushDur?: number; dim?: number}> = ({
  x, y, h, at, traceAt, tint = true, push = 0, pushDur = 300, dim = 1,
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  if (g < at) return null;
  const [x0, y0, x1, y1] = RALSTON.data.boxes.subject;
  const sc = h / (y1 - y0);
  const k = interpolate(g, [at, at + 4, at + 7], [1.18, 0.97, 1], clamp);
  const z = 1 + push * interpolate(f, [at, at + pushDur], [0, 1], clamp);
  const place: Place = {left: x - x0 * sc, top: y - y0 * sc, scale: sc};
  const [W, H] = RALSTON_SIZE;
  const mask = {WebkitMaskImage: `url(${staticFile(RALSTON.alpha)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(RALSTON.alpha)})`, maskSize: '100% 100%'} as React.CSSProperties;
  const cx = x + ((x1 - x0) * sc) / 2, cy = y + ((y1 - y0) * sc) / 2;
  const img = (extra: React.CSSProperties) => (
    <Img src={staticFile(RALSTON_SRC)} style={{position: 'absolute', left: place.left, top: place.top, width: W * sc, height: H * sc, ...mask, ...extra}} />
  );
  return (
    <AbsoluteFill style={{transform: `scale(${k * z})`, transformOrigin: `${cx}px ${cy}px`, opacity: interpolate(g, [at, at + 3], [0, 1], clamp) * dim}}>
      {img({filter: 'brightness(0) blur(14px)', opacity: 0.5, transform: 'translate(10px, 16px)'})}
      {img({filter: 'grayscale(1) contrast(1.25) brightness(0.92)'})}
      {tint && <Tint mask={RALSTON.alpha} place={place} size={RALSTON_SIZE} strength={0.85} />}
      <Traced paths={RALSTON.data.shapes.subject} place={place} at={traceAt ?? at + 6} dur={12} width={5} part={0.94} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the blank map of the West (drawn, from MoneyMap's coastlines)
const C = coast as {bbox: [number, number, number, number]; rings: number[][][]};
const merc = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
const LON0 = -127.5, LON1 = -87.5, LAT0 = 24.5, LAT1 = 50.5;
const Y0 = merc(LAT0), Y1 = merc(LAT1);
const RINGS = C.rings.filter((r) => r.some(([x, y]) => x > LON0 - 2 && x < LON1 + 2 && y > Y0 - 2 && y < Y1 + 2))
  .map((r) => 'M' + r.map(([x, y]) => `${x.toFixed(2)},${(-y).toFixed(2)}`).join('L') + 'Z').join(' ');
/** Map (lon, lat) → screen px inside a map box (x, y, w, h). */
export const westPoint = (box: [number, number, number, number], lon: number, lat: number) => {
  const [bx, by, bw, bh] = box;
  return [bx + ((lon - LON0) / (LON1 - LON0)) * bw, by + ((Y1 - merc(lat)) / (Y1 - Y0)) * bh];
};
/** The aspect (w / h) of the West map box. */
export const WEST_ASPECT = (LON1 - LON0) / (Y1 - Y0);

/**
 * A blank drawn map of the American West on a dark slab: land a shade lighter than the sea, teal coastline, faint graticule,
 * a double border like an old chart. No states, no pins: the point is that nobody knows where. Drops in at `at`.
 * `cam` = [zoom, focus x, focus y] keyed over the scene: [frame, z, fx, fy][].
 */
export const WestMap: React.FC<{box: [number, number, number, number]; at?: number; cam?: [number, number, number, number][]; children?: React.ReactNode}> = ({box, at = -999, cam, children}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const [bx, by, bw, bh] = box;
  let z = 1, fx = 960, fy = 540;
  if (cam && cam.length) {
    const fr = cam.map((c) => c[0]);
    z = interpolate(f, fr, cam.map((c) => c[1]), clamp);
    fx = interpolate(f, fr, cam.map((c) => c[2]), clamp);
    fy = interpolate(f, fr, cam.map((c) => c[3]), clamp);
  }
  const k = interpolate(g, [at, at + 4, at + 7], [1.12, 0.98, 1], clamp);
  const grat: React.ReactNode[] = [];
  for (let lon = -125; lon <= -90; lon += 5) grat.push(<line key={`o${lon}`} x1={lon} x2={lon} y1={-Y1} y2={-Y0} vectorEffect="non-scaling-stroke" />);
  for (let lat = 25; lat <= 50; lat += 5) grat.push(<line key={`a${lat}`} x1={LON0} x2={LON1} y1={-merc(lat)} y2={-merc(lat)} vectorEffect="non-scaling-stroke" />);
  return (
    <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${fx}px ${fy}px`}}>
      {g >= at && (
        <div style={{position: 'absolute', left: bx, top: by, width: bw, height: bh, transform: `scale(${k}) rotate(-0.8deg)`, boxShadow: '0 30px 60px rgba(0,0,0,0.8)'}}>
          <svg width={bw} height={bh} viewBox={`${LON0} ${-Y1} ${LON1 - LON0} ${Y1 - Y0}`} preserveAspectRatio="none" style={{display: 'block', background: '#151412'}}>
            <path d={RINGS} fill="#2c2720" stroke={pal.mark} strokeWidth={2.2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            <g stroke={pal.mark} strokeOpacity={0.16} strokeWidth={1.1}>{grat}</g>
          </svg>
          <div style={{position: 'absolute', inset: 10, border: `1.5px solid ${pal.mark}`, opacity: 0.6}} />
          <div style={{position: 'absolute', inset: 18, border: `1px solid ${pal.mark}`, opacity: 0.35}} />
        </div>
      )}
      {children}
    </AbsoluteFill>
  );
};

/** A big hand-drawn question mark in teal, drawn on (stroke) at `at`. */
export const DrawnQ: React.FC<{x: number; y: number; size: number; at: number; dur?: number; color?: string}> = ({x, y, size, at, dur = 12, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const s = size / 100;
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={60 * s} height={100 * s} viewBox="0 0 60 100">
      <path d="M8,26 C8,6 52,2 52,26 C52,42 30,44 30,62 L30,70" fill="none" stroke={color ?? pal.mark} strokeWidth={7} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.8))'}} />
      {p >= 1 && <circle cx={30} cy={88} r={5.5} fill={color ?? pal.mark} />}
    </svg>
  );
};

/** Silver dollars stacking up (side-on ellipses), one per 12 fps step from `at`, in `cols` stacks of `per`. */
export const CoinStack: React.FC<{x: number; y: number; n: number; at: number; per?: number; cols?: number; w?: number; every?: number; coral?: boolean}> = ({
  x, y, n, at, per = 9, cols = 3, w = 150, every = 2.5, coral,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const shown = Math.min(n, Math.floor((g - at) / every) + 1);
  const th = w * 0.13;
  return (
    <>
      {Array.from({length: shown}).map((_, i) => {
        const c = Math.floor(i / per), r = i % per;
        const jx = (random(`c${i}`) - 0.5) * 8;
        return (
          <div key={i} style={{position: 'absolute', left: x + c * (w + 30) + jx, top: y - r * th, width: w, height: w * 0.3, borderRadius: '50%',
            background: coral ? 'linear-gradient(180deg, #ffb3a8 0%, #FF6F61 55%, #a8433a 100%)' : 'linear-gradient(180deg, #e6e1d6 0%, #b9b3a7 50%, #6e695f 100%)',
            border: '2px solid rgba(20,18,14,0.75)', boxShadow: '0 4px 6px rgba(0,0,0,0.55)'}} />
        );
      })}
    </>
  );
};
