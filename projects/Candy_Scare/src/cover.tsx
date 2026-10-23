// Hook cover: the first 1.5 s of the Short, fully drawn from frame 0 so it can be picked as the Shorts cover.
// The same door and hand the Short opens (and ends) on, with the question in big type.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Highlight, PALETTES, PaletteCtx, StepCtx} from './kit/Kit';
import {DoorShot} from './candy';

export const Cover: React.FC = () => (
  <DoorShot ext={0.92} held="stix" light={0.6}>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.82) 0%, rgba(8,7,5,0.55) 26%, rgba(8,7,5,0) 40%)'}} />
    <Highlight text="WHO POISONED" x={50} y={250} size={118} at={-40} seed={81} rot={-3} />
    <Highlight text="THE HALLOWEEN" x={60} y={400} size={108} at={-40} seed={82} rot={-2} />
    <Highlight text="CANDY?" x={80} y={545} size={150} at={-40} seed={83} rot={-3} />
  </DoorShot>
);

export const CoverStill: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <Cover />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
