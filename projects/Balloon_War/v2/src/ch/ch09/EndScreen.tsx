// The end screen (20 s from "Thanks"), copied from projects/Diamond_Hoax/src/ch/ch09/EndScreen.tsx (itself from Halloween Bribe):
// the Chunk History logo, THANKS FOR WATCHING, a drawn subscribe circle and two drawn "watch next" slots where YouTube's
// end-screen elements sit (place them in Studio: subscribe over the circle, two videos over the frames), and this video's object,
// a paper crane, on the desk. Balloon War has no logo SVG files in public/, so the logo is drawn here from the brand shapes the
// channel intro uses (kit/chunk/shapes.json), flat.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Highlight, Note, Tag, useGFrame} from '../../kit/Kit';
import {DarkPaper} from '../../kit/common';
import {Prop} from '../../kit/prop';
import shapes from '../../kit/chunk/shapes.json';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
/** YouTube end-screen element slots (1080p px). Video elements are 16:9; the subscribe element is a circle. */
export const SLOTS = {videoA: {x: 1120, y: 175, w: 604, h: 340}, videoB: {x: 1120, y: 610, w: 604, h: 340}, subscribe: {cx: 380, cy: 760, r: 150}};
export const END_FRAMES = 20 * 30;

type Piece = {color: string; outer: number[][]; holes: number[][][]};
const path = (p: Piece) => [p.outer, ...p.holes].map((r) => `M${r.map(([x, y]) => `${x},${-y}`).join(' L')} Z`).join(' ');

/** A shape set from shapes.json as flat SVG (y flipped), `h` px tall per unit. */
const Shapes: React.FC<{pieces: Piece[]; h: number; style?: React.CSSProperties}> = ({pieces, h, style}) => {
  const xs = pieces.flatMap((p) => p.outer.map((q) => q[0]));
  const ys = pieces.flatMap((p) => p.outer.map((q) => -q[1]));
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return (
    <svg width={(x1 - x0) * h} height={(y1 - y0) * h} viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} style={style}>
      {pieces.map((p, i) => <path key={i} d={path(p)} fill={p.color} fillRule="evenodd" />)}
    </svg>
  );
};

/** The logo lockup: the mark, then the wordmark. */
export const Logo: React.FC<{h?: number; spin?: number; wordOpacity?: number}> = ({h = 96, spin = 0, wordOpacity = 1}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
    <Shapes pieces={shapes.mark as Piece[]} h={h} style={{transform: `rotate(${spin}deg)`}} />
    <Shapes pieces={shapes.wordmark as Piece[]} h={h} style={{opacity: wordOpacity}} />
  </div>
);

/** A hand-drawn frame that draws on (teal), with a handwritten label above it. */
const Slot: React.FC<{x: number; y: number; w: number; h: number; at: number; label: string}> = ({x, y, w, h, at, label}) => {
  const g = useGFrame();
  const p = interpolate(g, [at, at + 12], [0, 1], clamp);
  if (g < at) return null;
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: 'rgba(8,8,6,0.55)', borderRadius: 6, opacity: p}} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={8} fill="none" stroke={TEAL} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
          strokeLinecap="round" transform={`rotate(-0.6 ${x + w / 2} ${y + h / 2})`} />
      </svg>
      <Note text={label} x={x + 10} y={y - 64} size={50} rot={-2} at={at + 4} color="#ffffff" />
    </>
  );
};

/** `start` = the frame of "Thanks" (the end screen starts there); `subscribe` / `more` = the frames of those words. */
export const EndScreen: React.FC<{start: number; subscribe: number; more: number}> = ({start, subscribe, more}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const s = (n: number) => n - start; // frames relative to the end screen
  const {cx, cy, r} = SLOTS.subscribe;
  const ring = interpolate(g, [s(subscribe), s(subscribe) + 12], [0, 1], clamp);
  const logoIn = interpolate(f, [6, 16], [0, 1], clamp);
  const markSpin = interpolate(f, [6, 18], [-90, 0], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <DarkPaper />
      {/* the logo: the mark turns in and locks, the wordmark fades up */}
      <div style={{position: 'absolute', left: 130, top: 100, opacity: logoIn}}>
        <Logo h={96} spin={markSpin} wordOpacity={interpolate(f, [12, 22], [0, 1], clamp)} />
      </div>
      <Highlight text="THANKS FOR WATCHING" x={120} y={240} size={70} at={2} seed={81} rot={-2} />
      <Note text="more stories like this one" x={140} y={380} size={54} rot={-3} at={s(more)} color="#ffffff" />
      {/* subscribe: a drawn circle with the Chunk mark (YouTube's subscribe element covers it) */}
      {g >= s(subscribe) && (
        <>
          <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', background: '#15130f', opacity: ring,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Shapes pieces={shapes.mark as Piece[]} h={r * 1.1} style={{opacity: 0.9}} />
          </div>
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke={CORAL} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring}
              transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="round" />
          </svg>
          <Note text="subscribe ↓" x={cx - 140} y={cy - r - 120} size={66} rot={-4} at={s(subscribe)} />
        </>
      )}
      <Prop name="paper_crane" x={620} y={700} w={300} at={s(more) + 14} coral trace from="bottom" />
      <Slot {...SLOTS.videoA} at={10} label="watch next" />
      <Slot {...SLOTS.videoB} at={18} label="more history" />
      <Tag text="Image credits in the description" x={110} y={1000} />
    </AbsoluteFill>
  );
};
