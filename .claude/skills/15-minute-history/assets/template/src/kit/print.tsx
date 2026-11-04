// Archival prints on the black desk, and the label for a person with no photo (Diamond Hoax ch 1, The Balloon War v2).
//   Print    an archival print slapped down with a little overshoot, B&W, a deep shadow, its source tag under it in mono. The
//            channel's rules: no cream or white mount, no frame, photos look worn (run tools/crease.py on the file first and
//            point `src` at the creased copy). `fit="contain"` for a document that must show whole; `pos` picks the crop.
//   NoPhoto  a small mono caps line ("REI MINAMIMURA · NO PHOTO SURVIVES") on the first appearance of a real person who is shown
//            only as an anonymous silhouette, so the figure is never taken for a likeness. Bottom-left by default.
import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, useGFrame} from './Kit';

export const Print: React.FC<{src: string; x: number; y: number; w: number; h: number; at: number; out?: number; rot?: number; pos?: string; tag?: string;
  fit?: 'cover' | 'contain'}> = ({src, x, y, w, h, at, out = Infinity, rot = 0, pos = '50% 25%', tag, fit = 'cover'}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%'}}>
      <Img src={staticFile(src)} style={{width: w, height: h, objectFit: fit, objectPosition: pos, display: 'block',
        filter: 'grayscale(1) contrast(1.15) brightness(0.95)', boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}} />
      {tag ? <div style={{position: 'absolute', left: 0, top: h + 14, width: 'max-content', maxWidth: w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
        color: 'rgba(244,239,230,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div> : null}
    </div>
  );
};

/** The no-photo label. `y` places it from the top; without it, it sits 104 px above the bottom edge (inside the 96 px safe margin). */
export const NoPhoto: React.FC<{text: string; at: number; x?: number; y?: number; out?: number}> = ({text, at, x = 110, y, out = Infinity}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  return (
    <div style={{position: 'absolute', left: x, ...(y === undefined ? {bottom: 104} : {top: y}), fontFamily: JF.mono, fontSize: 20, letterSpacing: 2,
      color: 'rgba(244,239,230,0.8)', textTransform: 'uppercase', textShadow: '0 1px 8px rgba(0,0,0,0.95)', opacity: interpolate(g, [at, at + 6], [0, 1], clamp)}}>{text}</div>
  );
};
