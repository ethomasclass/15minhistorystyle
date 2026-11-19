// The inflating turkey (ch8; IMAGE_PRESENTATION.md, "The inflating turkey"): one side-view live-turkey cut-out standing on a period
// platform scale, a dial and a counter beside it. Everything is a pure function of the frame and a few anchor frames:
//   swellAt    "broader chest": the breast swells (a local warp of the chest region only), stepped at 12 fps
//   swapAt     "white ones": a quick wipe from the bronze bird to the white one (same pose)
//   w13At      "thirteen pounds": the dial and counter read 13
//   grow       [from, to] "Today, it's over thirty": the counter ticks 13 -> 30+, the needle swings, the body inflates and the
//              legs stay the same thin size (the body above the hip line scales about the hip; the legs below it don't)
//   tipAt      "too top-heavy": the bird tips forward a few degrees about its feet, wobbles, and holds
// The cut-outs and the scale are placeholders until their files land: img/flow/tg_turkey_bronze.png and tg_turkey_white.png
// (RGBA, same pose, facing left, feet at the bottom centre of the image) and img/flow/tg_platform_scale.png. Until then a drawn
// stand-in silhouette (bronze-grey / white-grey) takes the bird's place so every move reads.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, useGFrame} from './Kit';
import {DarkPaper} from './common';
import {hasFile} from './shell';
import {CORAL, PH, TEAL} from './tg_late';

/** `big`: the white bird with a much heavier body, same pose and registration: the end state the growth dissolves toward. */
export const TURKEY = {big: 'img/flow/tg_turkey_big.png', bronze: 'img/flow/tg_turkey_bronze.png', white: 'img/flow/tg_turkey_white.png', scale: 'img/flow/tg_scale.png'};

export type TurkeyBeats = {swellAt?: number; swapAt?: number; w13At?: number; grow?: [number, number]; tipAt?: number};

/** Rig geometry as fractions of the rig box: hip line (legs below it never scale), chest centre and radius. */
const HIP = 0.69;
/** Where the feet are in the cut-outs (671 x 628 px, all three share registration): centre of the toes, lowest toe pixel. */
const IMG: [number, number] = [671, 628];
const FEET_IMG: [number, number] = [268, 616];
/** The feet's offset inside a size x size rig box (contain-fit, bottom-aligned). */
const feetIn = (size: number): [number, number] => {
  const k = Math.min(size / IMG[0], size / IMG[1]);
  return [(size - IMG[0] * k) / 2 + FEET_IMG[0] * k, size - IMG[1] * k + FEET_IMG[1] * k];
};
/** The scale cut-out (482 x 537): the middle of its platform's top face, where the toes rest. */
const SCALE_IMG: [number, number] = [482, 537];
const TRAY_IMG: [number, number] = [279, 62];
const CHEST: [number, number] = [0.3, 0.57];
const CHEST_R = 0.24;

/** The weight the dial and counter show at graphics frame g (null before the 1930s figure is said). */
export const weightAt = (g: number, b: TurkeyBeats) => {
  if (b.w13At === undefined || g < b.w13At) return null;
  if (!b.grow) return 13;
  return 13 + 17 * interpolate(g, b.grow, [0, 1], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
};

/** The drawn stand-in: a plain side-view turkey silhouette (facing left), until the Flow cut-out exists. */
const StandIn: React.FC<{size: number; white?: boolean}> = ({size, white}) => {
  const body = white ? '#cfcac0' : '#4a3d31';
  const tail = white ? '#bdb7ab' : '#3a2f26';
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g stroke="#111" strokeWidth={0.9} strokeLinejoin="round">
        <path d="M60 46 C 66 18, 92 16, 96 34 C 98 46, 90 58, 74 60 Z" fill={tail} />
        <path d="M48 68 L45 98 M45 98 L40 99 M45 98 L49 99.5" fill="none" stroke="#9a8f80" strokeWidth={1.6} strokeLinecap="round" />
        <path d="M58 68 L60 98 M60 98 L55 99.5 M60 98 L65 99" fill="none" stroke="#9a8f80" strokeWidth={1.6} strokeLinecap="round" />
        <path d="M24 48 C 22 34, 40 32, 56 36 C 74 40, 80 54, 72 64 C 64 72, 40 74, 30 66 C 24 61, 23 55, 24 48 Z" fill={body} />
        <path d="M30 46 C 24 36, 22 28, 20 22 C 19 17, 14 15, 12 18 C 11 22, 14 25, 15 30 C 17 38, 21 46, 26 50 Z" fill={body} />
        <path d="M12 18 L6 20 L12 21 Z" fill="#c9a24a" />
        <path d="M14 22 C 13 27, 15 31, 13 33" fill="none" stroke={CORAL} strokeWidth={1.6} strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** The bird's art at the current feather state: bronze, white, or the wipe between (p 0..1). */
const Art: React.FC<{size: number; p: number; big?: number}> = ({size, p, big = 0}) => {
  const img = (src: string) => <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: size, height: size, objectFit: 'contain', objectPosition: '50% 100%'}} />;
  const bronze = hasFile(TURKEY.bronze) ? img(TURKEY.bronze) : <StandIn size={size} />;
  const white = hasFile(TURKEY.white) ? img(TURKEY.white) : <StandIn size={size} white />;
  return (
    <>
      {p < 1 && <div style={{position: 'absolute', inset: 0}}>{bronze}</div>}
      {p > 0 && <div style={{position: 'absolute', inset: 0, clipPath: `inset(-5% ${(1 - p) * 105}% -5% -5%)`}}>{white}</div>}
      {big > 0 && hasFile(TURKEY.big) && <div style={{position: 'absolute', inset: 0, opacity: big}}>{img(TURKEY.big)}</div>}
    </>
  );
};

/**
 * The rig: the bird `size` px square with its feet at (x, y) on screen. Chest swell and body inflation are warps of the same art
 * (rendered again under a mask and scaled), so they work on the stand-in and on the real cut-out alike.
 */
export const TurkeyRig: React.FC<{x: number; y: number; size: number; b: TurkeyBeats; white?: boolean; grow?: number; label?: boolean}> = ({x, y, size, b, white, grow: fixedGrow, label = true}) => {
  const g = useGFrame();
  const swell = b.swellAt === undefined ? 0 : interpolate(g, [b.swellAt, b.swellAt + 15], [0, 1], clamp);
  const p = white ? 1 : b.swapAt === undefined ? 0 : interpolate(g, [b.swapAt, b.swapAt + 5], [0, 1], clamp);
  const w = weightAt(g, b);
  const k = fixedGrow ?? (w === null ? 0 : (w - 13) / 17);
  // with the heavy bird's own drawing to dissolve into, the warp only has to carry the change (it was 0.4 on its own)
  const hasBig = hasFile(TURKEY.big);
  const inflate = 1 + (hasBig ? 0.16 : 0.4) * k;
  const big = hasBig ? Math.round(k * 6) / 6 : 0;
  let tip = 0;
  if (b.tipAt !== undefined && g >= b.tipAt) {
    const t = g - b.tipAt;
    tip = -8 * interpolate(t, [0, 6], [0, 1], {...clamp, easing: (q) => 1 - Math.pow(1 - q, 3)}) + 3.2 * Math.exp(-t / 9) * Math.sin(t * 0.55) * (t > 4 ? 1 : 0);
  }
  const [cx, cy] = [CHEST[0] * size, CHEST[1] * size];
  const r = CHEST_R * size;
  const chestMask = `radial-gradient(circle at ${cx}px ${cy}px, #000 0, #000 ${r * 0.55}px, transparent ${r}px)`;
  const hipY = HIP * size;
  const sw = 1 + 0.28 * swell;
  // soft seam at the hip: the body fades out and the legs fade in over ~4% of the bird, so no straight cut shows when it inflates
  const seam = size * 0.04;
  const bodyMask = `linear-gradient(to bottom, #000 0, #000 ${hipY - seam}px, transparent ${hipY + seam * 0.6}px)`;
  const legMask = `linear-gradient(to bottom, transparent 0, transparent ${hipY - seam}px, #000 ${hipY + seam * 0.6}px)`;
  return (
    <>
      <div style={{position: 'absolute', left: x - feetIn(size)[0], top: y - feetIn(size)[1], width: size, height: size, transform: `rotate(${tip}deg)`, transformOrigin: `${feetIn(size)[0]}px ${feetIn(size)[1]}px`,
        filter: 'drop-shadow(10px 16px 14px rgba(0,0,0,0.55))'}}>
        {/* the legs: never scaled */}
        <div style={{position: 'absolute', inset: 0, WebkitMaskImage: legMask, maskImage: legMask}}><Art size={size} p={p} big={big} /></div>
        {/* the body: inflates about the hip; the chest swells inside it */}
        <div style={{position: 'absolute', inset: 0, WebkitMaskImage: bodyMask, maskImage: bodyMask, transform: `scale(${inflate})`, transformOrigin: `${feetIn(size)[0]}px ${hipY}px`}}>
          <Art size={size} p={p} big={big} />
          {swell > 0 && (
            <div style={{position: 'absolute', inset: 0, WebkitMaskImage: chestMask, maskImage: chestMask, transform: `scale(${sw})`, transformOrigin: `${cx}px ${cy}px`}}>
              <Art size={size} p={p} big={big} />
            </div>
          )}
        </div>
      </div>
      {label && !hasFile(white ? TURKEY.white : p > 0.5 ? TURKEY.white : TURKEY.bronze) && (
        <div style={{position: 'absolute', left: x - size / 2, top: y - size - 40, fontFamily: JF.mono, fontSize: 16, color: 'rgba(244,239,230,0.6)', whiteSpace: 'nowrap'}}>
          PLACEHOLDER: {white || p > 0.5 ? TURKEY.white : TURKEY.bronze} · drawn stand-in
        </div>
      )}
    </>
  );
};

/** The scale's dial: 0-40 lb, a teal needle that swings to the weight with a little overshoot (stepped). */
export const Dial: React.FC<{x: number; y: number; r?: number; b: TurkeyBeats}> = ({x, y, r = 170, b}) => {
  const g = useGFrame();
  const w = weightAt(g, b);
  // the needle overshoots a little after each change (13 lands, then the growth ends)
  const kick = (at: number | undefined) => (at === undefined || g < at ? 0 : 2.2 * Math.exp(-(g - at) / 5) * Math.sin((g - at) * 0.9));
  const ww = (w ?? 0) + kick(b.w13At) + (b.grow ? kick(b.grow[1]) : 0);
  const ang = -120 + (Math.max(0, ww) / 40) * 240;
  const ticks = Array.from({length: 41}, (_, i) => i);
  return (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2}}>
      <svg width={r * 2} height={r * 2} viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`} style={{overflow: 'visible'}}>
        <circle r={r} fill="#15130f" stroke="#f4efe6" strokeOpacity={0.5} strokeWidth={5} />
        <circle r={r - 14} fill="none" stroke={TEAL} strokeOpacity={0.35} strokeWidth={2} />
        {ticks.map((i) => {
          const a = ((-120 + (i / 40) * 240 - 90) * Math.PI) / 180;
          const L = i % 10 === 0 ? 26 : i % 5 === 0 ? 18 : 9;
          return <line key={i} x1={Math.cos(a) * (r - 18)} y1={Math.sin(a) * (r - 18)} x2={Math.cos(a) * (r - 18 - L)} y2={Math.sin(a) * (r - 18 - L)}
            stroke={i === 30 ? CORAL : '#f4efe6'} strokeOpacity={0.8} strokeWidth={i % 10 === 0 ? 4 : 2} />;
        })}
        {[0, 10, 20, 30, 40].map((v) => {
          const a = ((-120 + (v / 40) * 240 - 90) * Math.PI) / 180;
          return <text key={v} x={Math.cos(a) * (r - 66)} y={Math.sin(a) * (r - 66) + 8} textAnchor="middle" fontFamily="Abril Fatface" fontSize={22} fill="#f4efe6" fillOpacity={0.8}>{v}</text>;
        })}
        <text x={0} y={r * 0.52} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={16} letterSpacing={2} fill="#f4efe6" fillOpacity={0.6}>POUNDS · LIVE</text>
        <g transform={`rotate(${ang})`}>
          <line x1={0} y1={18} x2={0} y2={-(r - 34)} stroke={TEAL} strokeWidth={6} strokeLinecap="round" />
        </g>
        <circle r={12} fill={TEAL} stroke="#111" strokeWidth={3} />
      </svg>
    </div>
  );
};

/** The counter: big Abril digits in a dark window, ticking whole pounds; "30+" once it passes thirty. */
export const Counter: React.FC<{x: number; y: number; b: TurkeyBeats; size?: number}> = ({x, y, b, size = 110}) => {
  const g = useGFrame();
  const w = weightAt(g, b);
  if (w === null) return null;
  const n = Math.floor(w + 1e-6);
  const txt = n >= 30 ? '30+' : String(n);
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'baseline', gap: 16, padding: '6px 26px 10px', background: '#0e0d0a',
      boxShadow: 'inset 0 0 0 3px rgba(244,239,230,0.25), 0 16px 30px rgba(0,0,0,0.6)'}}>
      <div style={{fontFamily: JF.display, fontSize: size, lineHeight: 1, color: n >= 30 ? CORAL : '#f4efe6', minWidth: size * 1.55, textAlign: 'right', whiteSpace: 'nowrap'}}>{txt}</div>
      <div style={{fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: 'rgba(244,239,230,0.7)'}}>LB</div>
    </div>
  );
};

/** The scale's width on screen (its tray is about three quarters of that). */
const SCALE_W = 330;
/** Where things sit in the set (screen px at zoom 1). */
export const SET = {feet: [860, 800] as [number, number], size: 600, dial: [1470, 420] as [number, number], counter: [1310, 650] as [number, number]};
/** The chest's screen position at zoom 1 (for loupes and cut-ins). */
export const chestAt = (): [number, number] => [SET.feet[0] - feetIn(SET.size)[0] + CHEST[0] * SET.size, SET.feet[1] - feetIn(SET.size)[1] + CHEST[1] * SET.size];
/** The legs' screen position at zoom 1 (just above the toes). */
export const legsAt = (): [number, number] => [SET.feet[0] + 8, SET.feet[1] - SET.size * 0.12];

/**
 * The whole set (desk, platform scale, the bird, the dial, the counter) through a camera looking at (cx, cy) at zoom z (smooth,
 * not stepped). `dial` hides the dial and counter for the shots before the weights. Children draw in screen px over the set.
 */
export const TurkeySet: React.FC<{b: TurkeyBeats; cam?: {x: number; y: number; z: number}; dial?: boolean; labels?: boolean; children?: React.ReactNode}> = ({b, cam = {x: 960, y: 540, z: 1}, dial = true, labels = true, children}) => {
  const [fx, fy] = SET.feet;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translate(${960 - cam.x * cam.z}px, ${540 - cam.y * cam.z}px) scale(${cam.z})`, transformOrigin: '0 0'}}>
        {/* the scale, its own aspect (482 x 537): the tray's middle (58% across, 4% down) under the bird's feet */}
        <PH file={TURKEY.scale} what="period scale (the bird stands on its tray)" x={fx - TRAY_IMG[0] * (SCALE_W / SCALE_IMG[0])} y={fy - TRAY_IMG[1] * (SCALE_W / SCALE_IMG[0])} w={SCALE_W} h={SCALE_W * (SCALE_IMG[1] / SCALE_IMG[0])} label={labels}
          filter="saturate(0.85) contrast(1.03)" />
        <TurkeyRig x={fx} y={fy} size={SET.size} b={b} label={labels} />
        {dial && <Dial x={SET.dial[0]} y={SET.dial[1]} b={b} />}
        {dial && <Counter x={SET.counter[0]} y={SET.counter[1]} b={b} />}
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};
