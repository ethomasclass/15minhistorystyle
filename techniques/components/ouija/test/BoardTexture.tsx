// The flat artwork of the talking board, rendered once to public/img/test/board_tex.png
// (npx remotion still src/index.ts BoardTexture public/img/test/board_tex.png) and mapped onto the 3D board.
// It matches the painted board in the Gemini hands series: parchment, the sun and moon in the top corners and
// the cloud ornaments at the bottom are cut from hands_00_board (public/img/board/), and the letters sit in the
// same places, in navy. No brand name.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {JF} from '../kit/Kit';
import {GLYPHS, TH, TW, WORDS_ON_BOARD} from './board';

const NAVY = '#1c2536';
/** Ornaments cut from the painting, faded out at their edges so the cut never shows. */
const orn = (shape = 'ellipse 50% 50% at 50% 50%'): React.CSSProperties => ({position: 'absolute', mixBlendMode: 'multiply', filter: 'contrast(1.08)',
  WebkitMaskImage: `radial-gradient(${shape}, #000 55%, transparent 100%)`, maskImage: `radial-gradient(${shape}, #000 55%, transparent 100%)`});

export const BoardTexture: React.FC = () => (
  <AbsoluteFill style={{background: '#dcc596'}}>
    {/* mottled old paint: two noise layers in the painting's parchment tones */}
    <svg width={TW} height={TH} style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply'}}>
      <filter id="mottle"><feTurbulence type="fractalNoise" baseFrequency="0.0035" numOctaves="4" seed="9" /><feColorMatrix type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.74  0 0 0 0 0.52  0 0 0 0.9 0" /></filter>
      <rect width="100%" height="100%" filter="url(#mottle)" />
    </svg>
    {/* fine craquelure and grain over the paint */}
    <svg width={TW} height={TH} style={{position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'multiply'}}>
      <filter id="crack"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="5" seed="4" /><feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.22  0 0 0 -2.2 1.35" /></filter>
      <rect width="100%" height="100%" filter="url(#crack)" />
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 48%, transparent 50%, rgba(70,45,20,0.5) 100%)'}} />
    <Img src={staticFile('img/board/sun.jpg')} style={{...orn(), left: 40, top: 36, width: 420, height: 420}} />
    <Img src={staticFile('img/board/moon.jpg')} style={{...orn(), left: TW - 470, top: 30, width: 430, height: 430}} />
    <Img src={staticFile('img/board/cloud_bl.jpg')} style={{...orn('ellipse 60% 60% at 35% 65%'), left: 30, top: TH - 420, width: 520, height: 372}} />
    <Img src={staticFile('img/board/cloud_br.jpg')} style={{...orn('ellipse 60% 60% at 65% 65%'), left: TW - 480, top: TH - 420, width: 450, height: 372}} />
    {GLYPHS.map((g) => (
      <div key={g.ch} style={{position: 'absolute', left: g.x - 100, top: g.y - g.size * 0.62, width: 200, textAlign: 'center', fontFamily: JF.display, fontSize: g.size, color: NAVY,
        lineHeight: 1.2, transform: `rotate(${g.rot}deg)`, transformOrigin: '50% 52%'}}>{g.ch}</div>
    ))}
    {Object.entries(WORDS_ON_BOARD).map(([w, p]) => (
      <div key={w} style={{position: 'absolute', left: p.x - 400, top: p.y - p.size * 0.55, width: 800, textAlign: 'center', fontFamily: '"Inter", sans-serif', fontWeight: 800, fontSize: p.size * 0.8,
        color: NAVY, lineHeight: 1.1, letterSpacing: 10}}>{w}</div>
    ))}
  </AbsoluteFill>
);
