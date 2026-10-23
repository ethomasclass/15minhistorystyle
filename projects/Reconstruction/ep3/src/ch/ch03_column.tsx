// ch03: the Yorkville Enquirer's "Arrests of Citizens" (Oct. 26, 1871) as one long column: the report (part 1, cut just
// above "Samuel Wood") with the list of names (part 2) joined under it, laid back on the desk and scrolled like a Sheet.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {type SheetCam, tornPoly} from '../kit/vox';

export const ARR1 = 'img/ch03/yorkville_enquirer_1871-10-26_arrests_of_citizens_york_county_part1.jpg';
export const ARR2 = 'img/ch03/yorkville_enquirer_1871-10-26_arrests_of_citizens_york_county_part2_names.jpg';
const W = 670;
/** part 1 is used down to CUT; part 2's first line ("Samuel Wood") sits at JOIN in column px (measured on both crops). */
const CUT = 2145;
const JOIN = 2146;
export const COLUMN_H = JOIN + 2097;

export const Column: React.FC<{cam: SheetCam; filter: string; children?: React.ReactNode}> = ({cam, filter, children}) => {
  const {x, y, z, tilt = 0, dofY = y, dof = 0, band = 120} = cam;
  const layer = (style: React.CSSProperties) => (
    <div style={{position: 'absolute', inset: 0, ...style}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: CUT, overflow: 'hidden'}}>
        <Img src={staticFile(ARR1)} style={{display: 'block', width: W}} />
      </div>
      <Img src={staticFile(ARR2)} style={{position: 'absolute', left: 0, top: JOIN, width: W}} />
    </div>
  );
  const m = `linear-gradient(to bottom, transparent ${dofY - band * 2.2}px, #000 ${dofY - band}px, #000 ${dofY + band}px, transparent ${dofY + band * 2.2}px)`;
  return (
    <AbsoluteFill style={{perspective: 1400, perspectiveOrigin: '960px 540px', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 960 - x, top: 540 - y, width: W, height: COLUMN_H, transformOrigin: `${x}px ${y}px`,
        transform: `scale(${z}) rotateX(${tilt}deg)`, filter: `drop-shadow(0 ${18 / z}px ${30 / z}px rgba(0,0,0,0.75))`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly('arr', W, COLUMN_H, 12 / Math.max(z, 0.3)), background: '#ddd6c6'}}>
          {dof > 0 ? (
            <>
              {layer({filter: `${filter} blur(${dof / z}px)`})}
              {layer({filter, WebkitMaskImage: m, maskImage: m})}
            </>
          ) : layer({filter})}
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
