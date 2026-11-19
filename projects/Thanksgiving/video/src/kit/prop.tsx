// AI prop cut-outs (public/img/props/<name>.webp, transparent) on the dark desk: B&W, a drop shadow, an optional coral tint
// (the scene's one subject) and a teal outline. They drop in with the channel's 12 fps step. See script/PROPS.md.
// Make props as white or pale objects on BLACK when they are light (paper, a crane, a card): tools/prop_cut_black.py; anything
// else on white: tools/prop_cut.py (FILL_HOLES=1 puts back pale insides rembg drops, like a dial or paste in a pot).
import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {useGFrame} from './Kit';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CORAL = '#FF6F61';
const TEAL = '#2FE0C4';

/** `w` is the width on screen (px at 1080p); the height follows the image. `coral` tints it; `trace` adds a teal outline. */
export const Prop: React.FC<{name: string; x: number; y: number; w: number; at: number; out?: number; rot?: number; coral?: boolean; trace?: boolean; colour?: boolean;
  from?: 'top' | 'bottom' | 'none'; z?: number}> = ({name, x, y, w, at, out = Infinity, rot = 0, coral = false, trace = false, colour = false, from = 'bottom', z = 0}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const dy = from === 'none' ? 0 : (1 - k) * (from === 'top' ? -260 : 260);
  const src = staticFile(`img/props/${name}.webp`);
  const mask = {WebkitMaskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskImage: `url(${src})`, maskSize: '100% 100%'} as React.CSSProperties;
  const outline = trace ? ` drop-shadow(3px 0 0 ${TEAL}) drop-shadow(-3px 0 0 ${TEAL}) drop-shadow(0 3px 0 ${TEAL}) drop-shadow(0 -3px 0 ${TEAL})` : '';
  return (
    <div style={{position: 'absolute', left: x, top: y + dy, width: w, transform: `rotate(${rot}deg) scale(${0.92 + 0.08 * k})`, opacity: Math.min(1, k * 1.6), zIndex: z,
      // a tight contact shadow and a soft lifted one: the cut-out lies on the desk (the Gilded Age's deskCut)
      filter: `${outline} drop-shadow(0 3px 2px rgba(0,0,0,0.7)) drop-shadow(0 16px 22px rgba(0,0,0,0.55))`}}>
      <div style={{position: 'relative', width: '100%'}}>
        <Img src={src} style={{width: '100%', display: 'block', filter: coral ? 'grayscale(1) contrast(1.05) brightness(1.12)' : colour ? 'saturate(0.88) contrast(1.03)' : 'grayscale(1) contrast(1.15) brightness(0.95)'}} />
        {coral && (
          // a see-through coral, never a flat red block (the user's rule, Diamond Hoax and The Balloon War v2): the texture shows through
          <>
            <div style={{position: 'absolute', inset: 0, ...mask, background: CORAL, mixBlendMode: 'color', opacity: 0.62}} />
            <div style={{position: 'absolute', inset: 0, ...mask, background: CORAL, mixBlendMode: 'screen', opacity: 0.16}} />
          </>
        )}
      </div>
    </div>
  );
};
