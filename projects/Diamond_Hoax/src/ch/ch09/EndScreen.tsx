// The end screen (20 s from the thank-you), copied from projects/Halloween_Bribe/src/fx/EndScreen.tsx and adapted for this video:
// the Chunk History logo, THANKS FOR WATCHING, a drawn subscribe circle and two drawn "watch next" slots where YouTube's
// end-screen elements sit (place them in Studio: subscribe over the circle, two videos over the frames), and the video's object,
// the rough diamond, on the desk instead of Halloween's candy bowl.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Highlight, Note, Tag, useGFrame} from '../../kit/Kit';
import {DarkPaper} from '../../kit/common';
import {Prop} from '../../kit/prop';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
/** YouTube end-screen element slots (1080p px). Video elements are 16:9; the subscribe element is a circle. */
export const SLOTS = {videoA: {x: 1120, y: 175, w: 604, h: 340}, videoB: {x: 1120, y: 610, w: 604, h: 340}, subscribe: {cx: 380, cy: 760, r: 150}};
export const END_FRAMES = 20 * 30;

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
      <div style={{position: 'absolute', left: 130, top: 100, display: 'flex', alignItems: 'center', gap: 26, opacity: logoIn}}>
        <Img src={staticFile('img/brand/chunk-history-mark.svg')} style={{width: 96, height: 96, transform: `rotate(${markSpin}deg)`}} />
        <Img src={staticFile('img/brand/chunk-history-wordmark-white.svg')} style={{height: 56}} />
      </div>
      <Highlight text="THANKS FOR WATCHING" x={120} y={240} size={70} at={2} seed={81} rot={-2} />
      <Note text="more stories like this one" x={140} y={380} size={54} rot={-3} at={s(more)} color="#ffffff" />
      {/* subscribe: a drawn circle with the Chunk mark (YouTube's subscribe element covers it) */}
      {g >= s(subscribe) && (
        <>
          <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', background: '#15130f', opacity: ring,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Img src={staticFile('img/brand/chunk-history-mark.svg')} style={{width: r * 1.1, height: r * 1.1, opacity: 0.9}} />
          </div>
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke={CORAL} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring}
              transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="round" />
          </svg>
          <Note text="subscribe ↓" x={cx - 140} y={cy - r - 120} size={66} rot={-4} at={s(subscribe)} />
        </>
      )}
      <Prop name="rough_diamond" x={640} y={760} w={220} at={s(more) + 14} coral trace from="bottom" />
      <Slot {...SLOTS.videoA} at={10} label="watch next" />
      <Slot {...SLOTS.videoB} at={18} label="more history" />
      <Tag text="Image credits in the description" x={110} y={1000} />
    </AbsoluteFill>
  );
};
