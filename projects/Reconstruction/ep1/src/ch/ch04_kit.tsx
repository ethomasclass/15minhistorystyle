// Helpers for chapters 4 and 5 (Ford's Theatre; Treason must be made odious).
//   PreShell   ChapterShell with a music-only pre-roll: the narration starts `pre` frames after the fade up, so a period
//              recording can play on its own first (a sung or busy record never sits under the voice).
//   Full       a full-bleed archival picture cropped to its picture area (no mounts, margins or plate edges), slow push,
//              optional coral tint and teal trace.
//   DeskPrint  a portrait lying on the desk at its own resolution (no upscaling), with the tint and trace.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Finish, INK, PALETTES, PaletteCtx, Picture, type Place, StepCtx, Tint, Traced} from '../kit/Kit';
import {LogoBreak} from '../kit/LogoBreak';
import type {MaskRef} from '../kit/maskref';
import {DarkPaper, Sfx} from '../kit/common';
import {FADE, LEAD, type Narration, TAIL, TAIL_LIFT} from '../kit/shell';
import {FocusIn} from '../kit/rc';
import {tornPoly} from '../kit/vox';

/** The narration's words moved `pre` frames later, so every anchor is in body time (frame 0 = the fade up). */
export const shifted = (n: Narration, pre: number): Narration => ({
  ...n, duration: n.duration + pre / 30, words: n.words.map((w) => ({...w, s: w.s + pre / 30, e: w.e + pre / 30})),
});

/** Total frames for a PreShell chapter. */
export const preFrames = (n: Narration, pre: number, extra = 0) => LEAD + pre + Math.ceil(n.duration * 30) + TAIL + FADE + extra;

type Cue = {src: string; volume?: number; startFrom?: number; from?: number; to?: number; fadeOut?: number};

/** ChapterShell (kit/shell.tsx) with a pre-roll: `n` is the unshifted narration; the body runs in body time. */
export const PreShell: React.FC<{n: Narration; pre: number; audio: string; extra?: number; music?: Cue[]; children: React.ReactNode}> = ({n, pre, audio, extra = 0, music = [], children}) => {
  const frame = useCurrentFrame();
  const total = preFrames(n, pre, extra);
  const up = interpolate(frame, [LEAD, LEAD + FADE], [0, 1], clamp);
  const down = interpolate(frame, [total - FADE, total], [1, 0], clamp);
  const spoken = pre + Math.ceil(n.duration * 30);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#000'}}>
          <Sequence from={LEAD} layout="none">
            <AbsoluteFill style={{opacity: Math.min(up, down)}}>
              {children}
              <Finish vignette={0.3} />
            </AbsoluteFill>
            <Sequence from={pre} layout="none"><Audio src={staticFile(audio)} /></Sequence>
            {music.map((m, i) => (
              <Sequence key={i} from={m.from ?? 0} layout="none">
                <Audio src={staticFile(m.src)} startFrom={m.startFrom ?? 0}
                  volume={(f) => {
                    const v = m.volume ?? 0.15;
                    const from = m.from ?? 0;
                    const end = total - LEAD - from;
                    const said = Math.max(21, spoken - from);
                    const lift = Math.min(end - 31, said + 18);
                    const off = m.to === undefined ? 1 : interpolate(f, [m.to - from - (m.fadeOut ?? 30), m.to - from], [1, 0], clamp);
                    return off * interpolate(f, [0, 20, said, lift, end - 30, end], [0, v, v, v * TAIL_LIFT, v * TAIL_LIFT, 0], clamp);
                  }} />
              </Sequence>
            ))}
          </Sequence>
          {frame < LEAD && <Sequence from={-16} layout="none"><LogoBreak /></Sequence>}
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};

/** Whooshes on a list of cut frames. */
export const Cuts: React.FC<{at: number[]; volume?: number}> = ({at, volume = 0.2}) => <>{at.map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={volume} />)}</>;

export type Rect = [number, number, number, number];

/**
 * Full bleed, cropped inside `rect` (source px: x0, y0, x1, y1 of the picture area). Looks at `f0` (moving to `f1`) at
 * zoom z0 -> z1 (1 = the rect just covers the frame) between frames a and b. The window never leaves the rect.
 */
export const Full: React.FC<{src: string; size: [number, number]; rect: Rect; f0: [number, number]; f1?: [number, number]; z0?: number; z1?: number; a: number; b: number;
  bw?: string; mask?: MaskRef; tint?: string | null; tintStrength?: number; traceAt?: number; vignette?: number; children?: (p: Place) => React.ReactNode}> = ({
  src, size, rect: [x0, y0, x1, y1], f0, f1 = f0, z0 = 1, z1 = 1.06, a, b, bw = 'grayscale(1) contrast(1.2) brightness(0.97)', mask, tint, tintStrength = 0.6, traceAt, vignette = 0.6, children,
}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [a, b], [0, 1], clamp);
  const sc = Math.max(1920 / (x1 - x0), 1080 / (y1 - y0)) * (z0 + (z1 - z0) * k);
  const fx = f0[0] + (f1[0] - f0[0]) * k, fy = f0[1] + (f1[1] - f0[1]) * k;
  const place: Place = {
    left: Math.min(-x0 * sc, Math.max(1920 - x1 * sc, 960 - fx * sc)),
    top: Math.min(-y0 * sc, Math.max(1080 - y1 * sc, 540 - fy * sc)),
    scale: sc,
  };
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src={src} place={place} size={size} bw={bw} />
      {mask && tint !== null && <Tint mask={mask.alpha} place={place} size={size} color={tint} strength={tintStrength} />}
      {mask && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt ?? a + 4} dur={12} width={5} />}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,${vignette}) 100%)`}} />
      {children?.(place)}
    </AbsoluteFill>
  );
};

/**
 * A portrait on the desk at its own resolution: the picture area `rect` is shown `h` px tall, centred at (x, y),
 * pushing in slowly from a to b, focusing in on arrival. Tint and trace as in `Full`.
 */
export const DeskPrint: React.FC<{src: string; size: [number, number]; rect: Rect; h: number; x: number; y: number; a: number; b: number; rot?: number;
  mask?: MaskRef; tint?: string | null; traceAt?: number; bw?: string}> = ({src, size, rect: [x0, y0, x1, y1], h, x, y, a, b, rot = 0, mask, tint, traceAt, bw = 'grayscale(1) contrast(1.15) brightness(1.02)'}) => {
  const f = useCurrentFrame();
  const s = h / (y1 - y0);
  const w = (x1 - x0) * s;
  const push = interpolate(f, [a, b], [1, 1.035], clamp);
  const place: Place = {left: -x0 * s, top: -y0 * s, scale: s};
  return (
    <FocusIn at={a}>
      <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scale(${push})`,
        filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}}>
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#d9d2c2', clipPath: tornPoly(src, w, h, 9)}}>
          <Picture src={src} place={place} size={size} bw={bw} />
          {mask && tint !== null && <Tint mask={mask.alpha} place={place} size={size} color={tint} strength={0.6} />}
        </div>
        {mask && <div style={{position: 'absolute', left: 0, top: 0}}><Traced paths={mask.data.shapes.subject} place={place} at={traceAt ?? a + 6} dur={12} width={5} part={0.92} /></div>}
      </div>
    </FocusIn>
  );
};

/** The desk with a creased print (img/wall/cr_*.png) lying on it, no camera carry: for the quiet chapter. */
export const QuietPrint: React.FC<{src: string; size: [number, number]; w: number; x?: number; y?: number; a: number; b: number; rot?: number}> = ({src, size, w, x = 960, y = 540, a, b, rot = 0}) => {
  const f = useCurrentFrame();
  const h = (size[1] * w) / size[0];
  const push = interpolate(f, [a, b], [1, 1.035], clamp);
  return (
    <FocusIn at={a}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scale(${push})`,
        filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} />
    </FocusIn>
  );
};

export {DarkPaper};
