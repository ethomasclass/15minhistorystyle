// Look test: engravings as 2.5D parallax with the coral subject and teal trace (not part of the video).
import React from 'react';
import {Sequence} from 'remotion';
import {PALETTES, PaletteCtx, StepCtx} from './kit/Kit';
import {Parallax} from './kit/parallax';
import {MASKS} from './masks';

const S = 120;
export const PARALLAXTEST_FRAMES = S * 3;

export const ParallaxTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Sequence durationInFrames={S}>
        <Parallax name="settlers_enslaved" src="img/gen/ch02_settlers_arrive.jpg" size={[1376, 768]} a={0} b={S} fx={0.55} fy={0.52}
          cam={{z: [1.0, 1.1], x: [-0.03, 0.04]}} depth={1.05} tintStrength={0.6} vignette={0.3} mask={MASKS.settlers_enslaved} traceAt={40}
          tag="Illustration · settlers arriving in Mexican Texas" />
      </Sequence>
      <Sequence from={S} durationInFrames={S}>
        <Parallax name="rider" src="img/gen/ch05_rider.jpg" size={[1376, 768]} a={0} b={S} fx={0.45} fy={0.5}
          cam={{z: [1.02, 1.14], x: [0.04, -0.03]}} depth={1.06} tintStrength={0.6} vignette={0.3} mask={MASKS.rider} traceAt={30}
          tag="Illustration · an express rider, 1846" />
      </Sequence>
      <Sequence from={S * 2} durationInFrames={S}>
        <Parallax name="corkleg_leg" src="img/gen/ch06_cork_leg.jpg" size={[1340, 705]} a={0} b={S} fx={0.6} fy={0.6}
          cam={{z: [1.0, 1.22], x: [-0.02, 0.03], y: [0.0, 0.02]}} depth={1.06} tintStrength={0.6} vignette={0.3} mask={MASKS.corkleg_leg} traceAt={36}
          tag="Illustration · Cerro Gordo, 1847" />
      </Sequence>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
