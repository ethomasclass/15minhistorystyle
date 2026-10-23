// The engraving look for this video's illustrations (the Flow wood engravings): full frame in black and white, showing
// as much of the picture as possible (it only crops what 16:9 needs), a slow gentle push, a light edge vignette, and a
// soft fade in from black and out again so scenes don't cut abruptly. The coral tint and teal trace work as on any
// picture. Real archival documents and portraits stay cards on the desk, so an illustration never passes for a source.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {INK, Picture, Tag, Tint, Traced} from './Kit';
import type {MaskRef} from './maskref';
import {fill} from './shell';

/**
 * An engraving filling the frame. `fx, fy` (source pixels) is the point the slow push moves toward; at z = 1 the whole
 * picture shows, cropped only to 16:9. It pushes from z0 to z1 between frames a and b, fading in over `fade` frames
 * from `a` and out over `fade` frames to `b`. `quiet` (the serious chapter) lowers the contrast and leaves out the tint.
 */
export const Engraving: React.FC<{src: string; px: [number, number]; fx: number; fy: number; a: number; b: number; z0?: number; z1?: number;
  fade?: number; quiet?: boolean; vignette?: number; mask?: MaskRef; tint?: string | null; traceAt?: number; tag?: string;
  children?: (p: {left: number; top: number; scale: number}) => React.ReactNode}> = ({
  src, px, fx, fy, a, b, z0 = 1, z1 = 1.06, fade = 12, quiet = false, vignette = 0.3, mask, tint, traceAt, tag, children,
}) => {
  const frame = useCurrentFrame();
  const place = fill(px, fx, fy, interpolate(frame, [a, b], [z0, z1], clamp));
  const k = interpolate(frame, [a, a + fade, b - fade, b], [0, 1, 1, 0], clamp);
  const bw = quiet ? 'grayscale(1) contrast(1.05) brightness(0.95)' : 'grayscale(1) contrast(1.2) brightness(0.98)';
  return (
    <AbsoluteFill style={{background: INK}}>
      <AbsoluteFill style={{opacity: k}}>
        <Picture src={src} place={place} size={px} bw={bw} />
        {mask && tint !== null && !quiet && <Tint mask={mask.alpha} place={place} size={px} color={tint ?? undefined} />}
        {mask && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt ?? a + fade} dur={12} width={5} />}
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 62%, rgba(0,0,0,${vignette}) 100%)`}} />
      </AbsoluteFill>
      {children?.(place)}
      {/* a faint dark band at the foot so the source tag reads on light paper */}
      {tag && <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 11%)', opacity: k}} />}
      {tag && <Tag text={tag} />}
    </AbsoluteFill>
  );
};
