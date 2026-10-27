// The end screen (about 20 s after the thank-you): the Chunk History logo, THANKS FOR WATCHING, a drawn subscribe circle and
// two drawn "watch next" video slots where YouTube's end-screen elements sit, and the candy bowl ("take one"), on the desk. Place YouTube's elements in Studio: subscribe over the circle, two videos over the frames.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Finish, Highlight, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Prop} from '../kit/prop';
import {bed} from '../kit/levels';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
/** YouTube end-screen element slots (1080p px). Video elements are 16:9; the subscribe element is a circle. */
export const SLOTS = {videoA: {x: 1180, y: 175, w: 604, h: 340}, videoB: {x: 1180, y: 610, w: 604, h: 340}, subscribe: {cx: 330, cy: 700, r: 150}};
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
  const s = (n: number) => n - start;   // frames relative to the end screen
  const {cx, cy, r} = SLOTS.subscribe;
  const ring = interpolate(g, [s(subscribe), s(subscribe) + 12], [0, 1], clamp);
  const logoIn = interpolate(f, [6, 16], [0, 1], clamp);
  const markSpin = interpolate(f, [6, 18], [-90, 0], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <DarkPaper />
      {/* the logo: the mark turns in and locks, the wordmark fades up */}
      <div style={{position: 'absolute', left: 110, top: 70, display: 'flex', alignItems: 'center', gap: 26, opacity: logoIn}}>
        <Img src={staticFile('img/brand/chunk-history-mark.svg')} style={{width: 96, height: 96, transform: `rotate(${markSpin}deg)`}} />
        <Img src={staticFile('img/brand/chunk-history-wordmark-white.svg')} style={{height: 56}} />
      </div>
      <Highlight text="THANKS FOR WATCHING" x={100} y={210} size={70} at={2} seed={81} rot={-2} />
      <Note text="more stories like this one" x={120} y={350} size={54} rot={-3} at={s(more)} color="#ffffff" />
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
          <Note text="subscribe ↓" x={cx - 140} y={cy - r - 130} size={70} rot={-4} at={s(subscribe)} />
        </>
      )}
      <Prop name="candy_bowl" x={560} y={690} w={360} at={s(more) + 14} coral from="bottom" />
      <Note text="(take one)" x={900} y={850} size={46} rot={-3} at={s(more) + 24} color="#ffffff" />
      <Slot {...SLOTS.videoA} at={10} label="watch next" />
      <Slot {...SLOTS.videoB} at={18} label="more spooky history" />
      <Tag text="Music made for Chunk History · Image credits in the description" />
    </AbsoluteFill>
  );
};

/** Standalone test: the thank-you line from ch08 and 20 s of end screen. */
export const EndScreenTest: React.FC = () => {
  const start = Math.round(77.3 * 30);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#000'}}>
          <EndScreen start={start} subscribe={Math.round(80.1 * 30)} more={Math.round(78.8 * 30)} />
          <Finish vignette={0.3} />
          <Sequence from={0}><Audio src={staticFile('audio/ch08_treat_or_shakedown.wav')} startFrom={start} /></Sequence>
          <Audio src={staticFile('music/hb_oiche_shamhna.mp3')} startFrom={120 * 30} volume={(fr) => interpolate(fr, [0, 20, END_FRAMES - 60, END_FRAMES], [0, bed('hb_oiche_shamhna', 11), bed('hb_oiche_shamhna', 11), 0], clamp)} />
          <Sfx at={2} src="sfx/stamp.wav" volume={0.28} />
          <Sfx at={8} src="sfx/chunk_snap.wav" volume={0.3} />
          {[Math.round(78.8 * 30) - start, Math.round(80.1 * 30) - start].map((a) => <Sfx key={a} at={a - 2} src={WRITE.src} volume={WRITE.volume} />)}
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
