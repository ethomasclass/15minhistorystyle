// Review-only: the Landis street photo three ways — today's two-layer Parallax, then DepthParallax with a push and with
// a sideways dolly — so the depth version can be judged against what the video already does.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Finish, PALETTES, PaletteCtx, StepCtx} from '../kit/Kit';
import {Parallax} from '../kit/parallax';
import {DepthParallax} from '../kit/depthparallax';
import {MASKS} from '../masks';

const S = 150;
const P = {name: 'landis_street', src: 'img/ch01/landis_street_1924_crop.jpg', size: [3280, 2430] as [number, number], fx: 0.55, fy: 0.42,
  tag: 'Library of Congress · National Photo Co., 1924', mask: MASKS.landis_street, traceAt: 20, a: 0, b: S};

const Label: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', top: 36, left: 44, padding: '8px 16px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontFamily: 'monospace', fontSize: 28}}>{text}</div>
);

export const DEPTH_TEST_FRAMES = S * 3;
export const DepthTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}><StepCtx.Provider value={2.5}>
  <AbsoluteFill style={{background: '#111'}}>
    <Sequence durationInFrames={S}>
      <Parallax {...P} cam={{z: [1.02, 1.12]}} depth={1.07} /><Label text="NOW · 2 flat layers, push" />
    </Sequence>
    <Sequence from={S} durationInFrames={S}>
      <DepthParallax {...P} cam={{z: [1.02, 1.12]}} shift={{x: [-10, 10]}} dolly={[0, 0.16]} /><Label text="DEPTH · push" />
    </Sequence>
    <Sequence from={2 * S} durationInFrames={S}>
      <DepthParallax {...P} cam={{z: [1.06, 1.08]}} shift={{x: [-60, 60], y: [8, -8]}} dolly={[0, 0.04]} /><Label text="DEPTH · sideways dolly" />
    </Sequence>
    <Finish />
  </AbsoluteFill>
  </StepCtx.Provider></PaletteCtx.Provider>
);
