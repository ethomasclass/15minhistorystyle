// "OUT OF BUSINESS", hand-lettered in code on the blank card pinned to the office door in BW14_aug15_dc (the painting has no
// writing, by design). Drawn as SVG in the painting's own pixels, so it rides plane 1 of the SilScene (the door's plane) with the
// parallax. The card's corners in the painting: (465,408) (678,452) (678,620) (477,599); the transform below is the affine fit
// of a 1000 x 1000 local square onto them.
import React from 'react';
import {interpolate} from 'remotion';
import {clamp} from '../../lib/anim';
import {useGFrame} from '../../kit/Kit';

export const CARD_PLANE = 1;
/** The card's centre in painting px. */
export const CARD = {x: 573, y: 516};

/** `at`: the lettering starts writing (first line), `at2`: the second line. */
export const DoorSign: React.FC<{at: number; at2: number}> = ({at, at2}) => {
  const g = useGFrame();
  const p1 = interpolate(g, [at, at + 10], [0, 1], clamp);
  const p2 = interpolate(g, [at2, at2 + 14], [0, 1], clamp);
  const ink = '#1b1814';
  const text = (s: string, y: number, len: number): React.ReactNode => (
    <text x={500} y={y} textAnchor="middle" fontFamily='"Nanum Pen Script", cursive' fontSize={330} fill={ink} stroke={ink} strokeWidth={9}
      strokeLinejoin="round" textLength={len} lengthAdjust="spacingAndGlyphs">{s}</text>
  );
  return (
    <svg viewBox="0 0 2752 1536" style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'visible'}}>
      <defs>
        <clipPath id="door-l1"><rect x={40} y={180} width={920 * p1} height={340} /></clipPath>
        <clipPath id="door-l2"><rect x={40} y={540} width={920 * p2} height={360} /></clipPath>
      </defs>
      <g transform="matrix(0.207 0.0325 0.006 0.1795 468 413.75)">
        <g clipPath="url(#door-l1)" transform="rotate(-2 500 400)">{text('OUT OF', 470, 560)}</g>
        <g clipPath="url(#door-l2)" transform="rotate(-1.5 500 720)">{text('BUSINESS', 820, 860)}</g>
      </g>
    </svg>
  );
};
