// Shared wrapper for the Reconstruction test clips: the channel's locked palette, 12 fps marks, fonts, finish.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Finish, JFonts, PALETTES, PaletteCtx, StepCtx} from '../kit/Kit';

export const TestFrame: React.FC<{children: React.ReactNode; vignette?: number}> = ({children, vignette = 0.5}) => (
  <JFonts>
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09'}}>
          {children}
          <Finish vignette={vignette} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  </JFonts>
);
