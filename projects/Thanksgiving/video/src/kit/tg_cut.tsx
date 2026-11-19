// Thanksgiving: the Flow still cut-outs (public/img/flow/tg_*.png, RGBA, cropped) on the desk, and the motion we make from them
// in code. No AI video anywhere (the user, Nov 2026): every move is a stepped dissolve between two stills, a frame loop we warped
// ourselves (the eel, the Jell-O ring, the calf's head to tureen), or a puppet move of a cut-out.
//   Cut       one cut-out lying on the desk: its natural aspect always (the height follows the width), a tight contact shadow
//             and a soft lifted one (the Gilded Age's deskCut), muted colour, a stepped landing.
//   CutLoop   a frame loop of cut-outs at 12 drawings a second (img/flow/<dir>/<stem>_0000.png ...).
//   Swap      one still turning into another in 12-a-second steps: a short wobble, a stepped cross-dissolve, a settle.
//   States    a set of state stills drawn on one 1376 x 768 frame (so they stay registered): stop-motion replacement, each state
//             cut in on its frame with a one-drawing dissolve and an optional wobble (mince pie, casserole, pumpkin pie, the
//             pie-to-can cloth, the three-step aspic-to-box change).
//   Clip      one of our own drawn silhouette scenes (projects/Thanksgiving/lookdev/tg.js, rendered to public/clips/), full frame,
//             muted, smooth at 30 fps; it starts `start` seconds into the clip at frame `at` and holds its last frame.
//   Hand      a silhouette hand reaching in from the right edge (puppet move), holding at its mark, and leaving.
import React from 'react';
import {AbsoluteFill, Freeze, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {useGFrame} from './Kit';

/** Pixel sizes of the cut-outs (so a width gives the height; never a forced box). */
export const FLOW = {
  tg_aspic: [711, 645], tg_aspic_savory: [758, 411], tg_calf_head: [864, 350], tg_casserole_A: [933, 576], tg_deer: [490, 571], tg_fowl: [920, 540],
  tg_gelatin_box: [692, 644], tg_hand_can: [776, 308], tg_hand_card: [895, 518], tg_hand_pinch: [751, 273], tg_hand_point: [686, 222], tg_homemade_pie: [803, 480],
  tg_jello: [779, 521], tg_mince_A: [878, 400], tg_modern_plate: [651, 644], tg_pie_1: [791, 533], tg_potato: [810, 554], tg_scale: [482, 537], tg_tureen: [862, 386],
  tg_turkey_bronze: [671, 628], tg_turkey_white: [671, 628], tg_turtle: [654, 573], tg_can: [803, 480], tg_three_cans: [1150, 610], tg_turkey_big: [666, 628],
  tg_pie_2: [792, 537], tg_pie_3: [792, 539], tg_pie_4: [792, 537], tg_pie_5: [791, 535],
} as const;
export type FlowName = keyof typeof FLOW;
export const flowSrc = (name: FlowName) => `img/flow/${name}.png`;
/** Height on screen of a cut-out `w` wide. */
export const flowH = (name: FlowName, w: number) => (w * FLOW[name][1]) / FLOW[name][0];

/** On the desk: a tight contact shadow and a soft lifted one. */
export const DESK_SHADOW = 'drop-shadow(0 3px 2px rgba(0,0,0,0.7)) drop-shadow(0 16px 22px rgba(0,0,0,0.55))';
/** Flow's food and animal cut-outs keep their colour, a little muted (IMAGE_PRESENTATION.md: the food props may). */
export const CUT_COLOUR = 'saturate(0.88) contrast(1.03)';
const GREY = 'grayscale(1) contrast(1.12) brightness(0.97)';

type Land = 'drop' | 'rise' | 'slap' | 'none';
const landing = (g: number, at: number, land: Land) => {
  if (land === 'none' || at < -900) return {dy: 0, k: 1, o: 1};
  const p = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: (q) => 1 - Math.pow(1 - q, 3)});
  if (land === 'slap') return {dy: 0, k: interpolate(g, [at, at + 3, at + 6], [1.22, 0.97, 1], clamp), o: Math.min(1, p * 3)};
  return {dy: (1 - p) * (land === 'drop' ? -220 : 220), k: 0.94 + 0.06 * p, o: Math.min(1, p * 1.8)};
};

/** A cut-out on the desk, `w` px wide at (x, y) (its top-left corner). `grey` for a B&W beat; `flip` mirrors it. */
export const Cut: React.FC<{name: FlowName; x: number; y: number; w: number; at?: number; out?: number; rot?: number; land?: Land; grey?: boolean; flip?: boolean;
  shadow?: boolean; opacity?: number; filter?: string; children?: React.ReactNode}> = ({
  name, x, y, w, at = -999, out = Infinity, rot = 0, land = 'drop', grey = false, flip = false, shadow = true, opacity = 1, filter, children,
}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const {dy, k, o} = landing(g, at, land);
  const h = flowH(name, w);
  return (
    <div style={{position: 'absolute', left: x, top: y + dy, width: w, height: h, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 70%', opacity: o * opacity,
      filter: shadow ? DESK_SHADOW : undefined}}>
      <Img src={staticFile(flowSrc(name))} style={{display: 'block', width: w, height: h, transform: flip ? 'scaleX(-1)' : undefined, filter: filter ?? (grey ? GREY : CUT_COLOUR)}} />
      {children}
    </div>
  );
};

/** A loop of cut-out frames at 12 a second: img/flow/<dir>/<stem>_0000.png ... (`n` of them, each `size` px). */
export const CutLoop: React.FC<{dir: string; stem: string; n: number; size: [number, number]; x: number; y: number; w: number; at?: number; out?: number; rot?: number; land?: Land}> = ({
  dir, stem, n, size, x, y, w, at = -999, out = Infinity, rot = 0, land = 'drop',
}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const {dy, k, o} = landing(g, at, land);
  const i = Math.floor(Math.max(0, f - Math.max(at, 0)) / 2.5) % n;
  const h = (w * size[1]) / size[0];
  return (
    <div style={{position: 'absolute', left: x, top: y + dy, width: w, height: h, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 70%', opacity: o, filter: DESK_SHADOW}}>
      <Img src={staticFile(`img/flow/${dir}/${stem}_${String(i).padStart(4, '0')}.png`)} style={{display: 'block', width: w, height: h, filter: CUT_COLOUR}} />
    </div>
  );
};

/**
 * One still turns into another, made in code: from `from` the first wobbles (a squash and stretch, three drawings), the two
 * cross-dissolve in 12-a-second steps while the pair swells a little, and the second settles by `to`. Both are drawn `h` px
 * tall, standing on the same base line (x = the centre, y = the base).
 */
export const Swap: React.FC<{a: FlowName; b: FlowName; cx: number; base: number; h: number; from: number; to: number; at?: number}> = ({a, b, cx, base, h, from, to, at = -999}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [from, to], [0, 1], clamp);
  const mix = interpolate(p, [0.25, 0.75], [0, 1], clamp);
  // squash and stretch through the change, gone at both ends
  const wob = Math.sin(p * Math.PI) * Math.sin(p * Math.PI * 5) * 0.06;
  const one = (name: FlowName, o: number) => {
    const w = (h * FLOW[name][0]) / FLOW[name][1];
    return o <= 0 ? null : <Img src={staticFile(flowSrc(name))} style={{position: 'absolute', left: cx - w / 2, top: base - h, width: w, height: h, opacity: o, filter: CUT_COLOUR}} />;
  };
  const {dy, k, o} = landing(g, at, 'drop');
  return (
    <div style={{position: 'absolute', left: 0, top: dy, width: 1920, height: 1080, opacity: o, filter: DESK_SHADOW,
      transform: `scale(${(k * (1 + wob)).toFixed(4)}, ${(k * (1 - wob)).toFixed(4)})`, transformOrigin: `${cx}px ${base}px`}}>
      {one(a, 1 - mix)}
      {one(b, mix)}
    </div>
  );
};

/** The state stills' frame. */
export const STATE_SIZE: [number, number] = [1376, 768];
/**
 * Stop-motion replacement between registered state stills (img/flow/<src>.png, each the full 1376 x 768 frame). `at[i]` is the
 * frame state i cuts in (at[0] = when the first lands); each change is a one-drawing 50% dissolve, and with `wobble` a squash
 * and stretch over the next three drawings. The frame is drawn `w` px wide with its top-left at (x, y); `map(sx, sy)` on
 * stateMap gives a source pixel's place on screen for labels.
 */
export const stateMap = (x: number, y: number, w: number) => (sx: number, sy: number): [number, number] => [x + (sx * w) / STATE_SIZE[0], y + (sy * w) / STATE_SIZE[0]];
export const States: React.FC<{srcs: string[]; at: number[]; x: number; y: number; w: number; land?: Land; wobble?: boolean; out?: number; origin?: [number, number]}> = ({
  srcs, at, x, y, w, land = 'slap', wobble = false, out = Infinity, origin = [0.5, 0.8],
}) => {
  const g = useGFrame();
  if (g < at[0] || g >= out) return null;
  let i = 0;
  at.forEach((a, k) => { if (g >= a) i = k; });
  const since = g - at[i];
  const h = (w * STATE_SIZE[1]) / STATE_SIZE[0];
  const {dy, k, o} = landing(g, at[0], land);
  const wob = wobble && i > 0 && since < 9 ? 0.05 * Math.exp(-since / 4) * Math.cos(since * 1.1) : 0;
  const img = (j: number, op: number) => <Img key={j} src={staticFile(`img/flow/${srcs[j]}.png`)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h, opacity: op, filter: CUT_COLOUR}} />;
  return (
    <div style={{position: 'absolute', left: x, top: y + dy, width: w, height: h, opacity: o, filter: DESK_SHADOW,
      transform: `scale(${(k * (1 + wob)).toFixed(4)}, ${(k * (1 - wob)).toFixed(4)})`, transformOrigin: `${origin[0] * 100}% ${origin[1] * 100}%`}}>
      {i > 0 && since < 2.5 ? [img(i - 1, 1), img(i, 0.5)] : img(i, 1)}
    </div>
  );
};

/** Where each hand's fingertips are, as a fraction of its picture (the hands all reach in from the right). */
// (the pointing fingertip; the pinch; the base of the can it holds; the middle of the card it holds)
const TIP: Record<string, [number, number]> = {tg_hand_point: [0.02, 0.33], tg_hand_pinch: [0.08, 0.68], tg_hand_can: [0.11, 0.95], tg_hand_card: [0.14, 0.28]};

/**
 * A silhouette hand reaches in from the right edge so its fingertips land on (x, y) at frame `at` (stepped, 8 drawings), holds,
 * and from `out` leaves the way it came. Its soft shadow falls on the desk below it. `w` = the picture's width on screen.
 */
export const Hand: React.FC<{name: 'tg_hand_point' | 'tg_hand_pinch' | 'tg_hand_can' | 'tg_hand_card'; x: number; y: number; w?: number; at: number; out?: number; rot?: number;
  label?: string}> = ({
  name, x, y, w = 760, at, out = Infinity, rot = 0, label,
}) => {
  const g = useGFrame();
  const IN = 9;
  if (g < at - IN || g >= out + IN) return null;
  const p = g < out ? interpolate(g, [at - IN, at], [0, 1], {...clamp, easing: (q) => 1 - Math.pow(1 - q, 3)}) : interpolate(g, [out, out + IN], [1, 0], {...clamp, easing: (q) => 1 - q * q});
  const h = flowH(name, w);
  const [tx, ty] = TIP[name];
  const left = x - tx * w + (1 - p) * (1960 - x), top = y - ty * h - (1 - p) * 50;
  const img = (extra: React.CSSProperties) => <Img src={staticFile(flowSrc(name))} style={{position: 'absolute', left, top, width: w, height: h, transform: `rotate(${rot}deg)`,
    transformOrigin: `${tx * 100}% ${ty * 100}%`, ...extra}} />;
  return (
    <>
      {img({filter: 'brightness(0) blur(14px)', opacity: 0.42, translate: '18px 30px'})}
      {img({})}
      {/* words on the card it holds (the card lies about 17 degrees off level in the picture) */}
      {label && name === 'tg_hand_card' && (
        <div style={{position: 'absolute', left: left + tx * w - 0.105 * w, top: top + ty * h - 0.02 * w, width: 0.26 * w, textAlign: 'center', transform: `rotate(${rot + 17}deg)`,
          fontFamily: '"Nanum Pen Script", cursive', fontSize: w * 0.072, lineHeight: 1, color: '#0f3e37', whiteSpace: 'nowrap'}}>{label}</div>
      )}
    </>
  );
};

/** Our drawn scenes, rendered from lookdev/tg.js: file and length in frames. */
export const CLIPS = {eel_river: ['clips/tg_eel_river.mp4', 420], victorian_kitchen: ['clips/tg_victorian_kitchen.mp4', 360], turtle_dock: ['clips/tg_turtle_dock.mp4', 180],
  dining_hall: ['clips/tg_dining_hall.mp4', 300], fifties_kitchen: ['clips/tg_1950s_kitchen.mp4', 390], table_3d: ['clips/tg_table_3d.mp4', 270]} as const;
/** A drawn scene, full frame, from frame `at`, starting `start` s into the clip; it holds on its last frame. Muted (the clips have no sound). */
export const Clip: React.FC<{name: keyof typeof CLIPS; at: number; start?: number; dim?: number}> = ({name, at, start = 0, dim = 0}) => {
  const f = useCurrentFrame();
  const [src, n] = CLIPS[name];
  const k = Math.max(0, Math.min(n - 1, f - at + Math.round(start * 30)));
  return (
    <AbsoluteFill style={{background: '#0d0c09'}}>
      <Freeze frame={k}><OffthreadVideo src={staticFile(src)} muted style={{width: 1920, height: 1080}} /></Freeze>
      {dim > 0 && <AbsoluteFill style={{background: `rgba(13,12,9,${dim})`}} />}
    </AbsoluteFill>
  );
};
