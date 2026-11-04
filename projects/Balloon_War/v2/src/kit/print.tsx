// An archival print on the black desk (the channel's rule: no cream or white mounts, photos look worn), slapped down with a
// little overshoot, with its source tag under it. From Diamond Hoax ch 1. For a creased, worn print first run
// tools/crease.py on the file and point `src` at the creased copy.
import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, useGFrame} from './Kit';

export const Print: React.FC<{src: string; x: number; y: number; w: number; h: number; at: number; rot?: number; pos?: string; tag?: string;
  fit?: 'cover' | 'contain'}> = ({src, x, y, w, h, at, rot = 0, pos = '50% 25%', tag, fit = 'cover'}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%'}}>
      <Img src={staticFile(src)} style={{width: w, height: h, objectFit: fit, objectPosition: pos, display: 'block',
        filter: 'grayscale(1) contrast(1.15) brightness(0.95)', boxShadow: '0 26px 46px rgba(0,0,0,0.8)'}} />
      {tag ? <div style={{position: 'absolute', left: 0, top: h + 14, width: 'max-content', maxWidth: w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
        color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div> : null}
    </div>
  );
};
