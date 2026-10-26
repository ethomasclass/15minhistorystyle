// Vertical thumbnails (1080x1920) for the Short: three concepts to pick from in YouTube Studio.
// Keep the headline and the subject inside the middle of the frame (y ~250-1650): the Shorts shelf crops the edges.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {Cutout} from './kit/desk';
import {DoorShot, Stix, CREAM, ORANGE} from './candy';
import {MASKS} from './masks';
import {IMG} from './images';
import {Mark} from './kit/vshort';

const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
        {children}
        <Mark />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.45) 100%)'}} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);

/** A: the question, over the door and the hand. */
export const ThumbA: React.FC = () => (
  <Frame>
    <div style={{position: 'absolute', left: 0, top: 260, width: 1080, height: 1920, transform: 'scale(1.12)', transformOrigin: '30% 30%'}}>
      <DoorShot ext={1} held="stix" light={0.7} />
    </div>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.9) 0%, rgba(8,7,5,0.6) 22%, rgba(8,7,5,0) 34%)'}} />
    <Highlight text="POISONED" x={60} y={210} size={170} at={-40} seed={91} rot={-3} />
    <Highlight text="CANDY?" x={120} y={420} size={190} at={-40} seed={92} rot={-2} />
    <Note text="the only real case" x={170} y={1420} size={88} rot={-4} at={-40} color="#ffffff" />
  </Frame>
);

/** B: the twist. The father in coral, the stick, "THE CANDY MAN". */
export const ThumbB: React.FC = () => {
  const [x0, y0, x1, y1] = MASKS.dad.data.boxes.subject;
  const sc = 1180 / (y1 - y0);
  const place = {left: 1110 - (x1 - x0) * sc - x0 * sc + 120, top: 640 - y0 * sc, scale: sc};
  return (
    <Frame>
      <DarkPaper />
      <Cutout name="dad" mask={MASKS.dad} size={IMG.dad.size as [number, number]} place={place} at={-60} traceAt={-60} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <g transform="translate(300,1420) rotate(-24) scale(1.35)"><Stix /></g>
      </svg>
      <Highlight text="THE CANDY" x={50} y={230} size={160} at={-40} seed={93} rot={-3} />
      <Highlight text="MAN" x={70} y={420} size={190} at={-40} seed={94} rot={-2} />
      <Note text="Halloween, 1974" x={80} y={650} size={78} rot={-4} at={-40} color="#ffffff" />
    </Frame>
  );
};

/** C: the number. Zero, under the question. */
export const ThumbC: React.FC = () => (
  <Frame>
    <DarkPaper />
    <Highlight text="KIDS KILLED BY" x={50} y={260} size={108} at={-40} seed={95} rot={-3} />
    <Highlight text="POISONED CANDY" x={60} y={410} size={98} at={-40} seed={96} rot={-2} />
    <Note text="from strangers, since 1958:" x={90} y={580} size={58} rot={-3} at={-40} color="#ffffff" />
    <div style={{position: 'absolute', left: 0, width: 1080, top: 700, textAlign: 'center', fontFamily: JF.display, fontSize: 720, lineHeight: 1, color: ORANGE,
      textShadow: '0 14px 44px rgba(0,0,0,0.9)'}}>0</div>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform="translate(560,1560) rotate(-12) scale(1.4)"><Stix /></g>
    </svg>
    <div style={{position: 'absolute', left: 120, top: 1660, fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color: CREAM, opacity: 0.8}}>HALLOWEEN 1974 → TODAY</div>
  </Frame>
);
