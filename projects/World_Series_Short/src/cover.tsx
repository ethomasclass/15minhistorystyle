// Hook cover: the first 1.5 s of the Short, fully drawn from frame 0 so it can be picked as the Shorts cover.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Highlight, Note, PALETTES, PaletteCtx, StepCtx, usePal} from './kit/Kit';
import {Stamp} from './kit/shell';
import {Arch} from './kit/bs';
import {IMG} from './images';

export const Cover: React.FC<{at?: number}> = ({at = 0}) => {
  const pal = usePal();
  return (
    <Arch src={IMG.jays.src} tag="" a={0} b={45} z={[1.0, 1.0]} pos="52% 30%" look="card">
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.6) 0%, rgba(8,7,5,0.15) 40%, rgba(8,7,5,0.2) 60%, rgba(8,7,5,0.8) 100%)'}} />
      <Highlight text="THE “WORLD”" x={60} y={300} size={128} at={at} seed={81} rot={-3} />
      <Highlight text="SERIES?" x={110} y={480} size={150} at={at + 3} seed={82} rot={-2} />
      <Stamp text="2 of 121" x={110} y={1180} at={at + 6} size={150} color={pal.subject} rot={-5} />
      <Note text="won outside the U.S." x={130} y={1350} size={70} rot={-4} at={at + 8} color="#ffffff" />
    </Arch>
  );
};

export const CoverStill: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <Cover at={-40} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
