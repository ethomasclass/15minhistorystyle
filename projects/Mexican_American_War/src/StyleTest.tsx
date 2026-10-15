// Look test for the engraving treatment (not part of the video).
import React from 'react';
import {Sequence} from 'remotion';
import {Engraving} from './kit/engraving';
import {PALETTES, PaletteCtx, StepCtx} from './kit/Kit';

const S = 90;
export const STYLETEST_FRAMES = S * 3;

export const StyleTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Sequence durationInFrames={S}>
        <Engraving src="img/gen/ch02_settlers_arrive.jpg" px={[1376, 768]} fx={760} fy={400} a={0} b={S} tag="Illustration · settlers arriving in Mexican Texas" />
      </Sequence>
      <Sequence from={S} durationInFrames={S}>
        <Engraving src="img/gen/ch06_cork_leg.jpg" px={[1340, 705]} fx={760} fy={360} a={0} b={S} tag="Illustration · Cerro Gordo, 1847" />
      </Sequence>
      <Sequence from={S * 2} durationInFrames={S}>
        <Engraving src="img/gen/ch09_sick_tents.jpg" px={[1376, 768]} fx={700} fy={420} a={0} b={S} quiet tag="Illustration · a field hospital, 1847" />
      </Sequence>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
