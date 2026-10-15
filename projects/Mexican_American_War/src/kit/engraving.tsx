// The engraving look for this video's illustrations (the Flow wood engravings): black and white, a slow push, and a
// soft fade from a bright centre into the dark desk ("version B"). The bright centre sits on the scene's subject, and
// the fade blooms open from the dark when the scene starts and closes again at the end. The coral tint and teal trace
// work as on any picture. Real archival documents and portraits don't use this: they stay cards on the desk, so
// viewers can tell an illustration from a source.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {DarkPaper} from './common';
import {INK, Picture, Tag, Tint, Traced} from './Kit';
import type {MaskRef} from './maskref';
import {fill} from './shell';

/** The fade's falloff (version B): opaque to 58% of the oval, gone at its edge, eased (gamma 1.4). */
const STOPS: [number, number][] = [[0.58, 1], [0.68, 0.68], [0.79, 0.38], [0.9, 0.13], [1, 0]];
/** The heavier "faded print" for the quiet chapters: a small bright centre and washed-out ink. */
const STOPS_QUIET: [number, number][] = [[0.12, 1], [0.3, 0.72], [0.5, 0.42], [0.7, 0.18], [0.85, 0.05], [0.95, 0]];

const maskCss = (cx: number, cy: number, rx: number, ry: number, stops: [number, number][]) =>
  `radial-gradient(ellipse ${rx}px ${ry}px at ${cx}px ${cy}px, ${stops.map(([r, a]) => `rgba(0,0,0,${a}) ${(r * 100).toFixed(1)}%`).join(', ')})`;

/**
 * An engraving filling the frame behind a fade. `fx, fy` (source pixels) is what the camera centres on; `focus`
 * (0..1 of the screen) is where the bright centre sits, usually over the subject. The picture pushes from z0 to z1
 * between frames a and b; the fade blooms open over `bloom` frames from `a` and closes over `bloom` frames to `b`.
 * `size` (0.7..1.3) scales the bright oval. `quiet` uses the heavier faded-print look.
 */
export const Engraving: React.FC<{src: string; px: [number, number]; fx: number; fy: number; a: number; b: number; z0?: number; z1?: number;
  focus?: [number, number]; size?: number; bloom?: number; quiet?: boolean; mask?: MaskRef; tint?: string | null; traceAt?: number; tag?: string;
  children?: (p: {left: number; top: number; scale: number}) => React.ReactNode}> = ({
  src, px, fx, fy, a, b, z0 = 1.03, z1 = 1.1, focus = [0.5, 0.5], size = 1, bloom = 16, quiet = false, mask, tint, traceAt, tag, children,
}) => {
  const frame = useCurrentFrame();
  const place = fill(px, fx, fy, interpolate(frame, [a, b], [z0, z1], clamp));
  const open = Math.min(
    interpolate(frame, [a, a + bloom], [0.35, 1], {...clamp, easing: Easing.out(Easing.cubic)}),
    interpolate(frame, [b - bloom, b], [1, 0.35], {...clamp, easing: Easing.in(Easing.cubic)}),
  );
  const fadeIn = interpolate(frame, [a, a + bloom * 0.6, b - bloom * 0.6, b], [0, 1, 1, 0], clamp);
  const k = size * open;
  const css = maskCss(focus[0] * 1920, focus[1] * 1080, 960 * k * (quiet ? 1.05 : 1), 497 * k * (quiet ? 1.05 : 1), quiet ? STOPS_QUIET : STOPS);
  const bw = quiet ? 'grayscale(1) contrast(0.95) brightness(1.05) opacity(0.82)' : 'grayscale(1) contrast(1.25) brightness(0.97)';
  return (
    <AbsoluteFill style={{background: INK}}>
      <DarkPaper />
      <AbsoluteFill style={{WebkitMaskImage: css, maskImage: css, opacity: fadeIn} as React.CSSProperties}>
        <Picture src={src} place={place} size={px} bw={bw} />
        {mask && tint !== null && !quiet && <Tint mask={mask.alpha} place={place} size={px} color={tint ?? undefined} />}
        {mask && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt ?? a + bloom} dur={12} width={5} />}
      </AbsoluteFill>
      {children?.(place)}
      {tag && <Tag text={tag} />}
    </AbsoluteFill>
  );
};
