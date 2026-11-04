// Parallax test for the v2 silhouette scenes: four scenes, 5 s each, cross-fading. Layers from tools/sil_layers.py on the
// 2x upscales (public/img/gen/scenes/2x/ -> public/img/layers/sil/<name>/).
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {PlaneImg, SilScene} from '../kit/silparallax';
import {Finish} from '../kit/Kit';

const SZ: [number, number] = [2752, 1536];
const SHOT = 150;
const OVER = 12;
export const SIL_TEST_FRAMES = SHOT * 4 - OVER * 3;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** The release: the round balloon (its own cut-out) rises and shrinks over the sea, swaying a little on its lines. */
const RisingBalloon: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, SHOT], [0, 1], clamp);
  const y = 272 - 150 * k;
  const x = 2134 + Math.sin(f / 22) * 6;
  const w = 264 * (1 - 0.18 * k);
  const rot = Math.sin(f / 18) * 1.6;
  return <PlaneImg src="img/gen/scenes/plates/balloon_ring.png" size={SZ} x={x} y={y} w={w} aspect={576 / 264} anchor={[0.5, 122.4 / 576]}
    style={{transform: `rotate(${rot}deg)`, transformOrigin: '50% 21%'}} />;
};

export const SilTest: React.FC = () => (
  <AbsoluteFill style={{background: '#0d0c09'}}>
    <Sequence from={0} durationInFrames={SHOT}>
      <SilScene name="BW03_woods_open" size={SZ} a={0} b={SHOT} cam={{z: [1.05, 1.15], x: [24, -18], y: [0, -12]}} fog={0.35} />
    </Sequence>
    <Sequence from={SHOT - OVER} durationInFrames={SHOT}>
      <SilScene name="BW01_beach_dawn" size={SZ} a={0} b={SHOT} cam={{z: [1.06, 1.1], x: [-36, 30], y: [0, -6]}} fog={0.25} />
    </Sequence>
    <Sequence from={2 * (SHOT - OVER)} durationInFrames={SHOT}>
      <SilScene name="BW09_rei" size={SZ} a={0} b={SHOT} cam={{z: [1.06, 1.17], x: [10, -10], y: [4, -16]}} fog={0.2}
        dust={{x: 1080, y: 260, w: 560, h: 760, n: 30, seed: 'rei'}} />
    </Sequence>
    <Sequence from={3 * (SHOT - OVER)} durationInFrames={SHOT}>
      <SilScene name="BW02_release" size={SZ} a={0} b={SHOT} cam={{z: [1.04, 1.09], x: [-10, 10], y: [12, -24]}} fog={0.25}
        insert={[{plane: 3, node: <RisingBalloon />}]} />
    </Sequence>
    <Finish vignette={0.35} />
  </AbsoluteFill>
);

/** One scene with a standard move (for checking layers): props {name}. */
export const SilOne: React.FC<{name: string}> = ({name}) => (
  <AbsoluteFill style={{background: '#0d0c09'}}>
    <SilScene name={name} size={SZ} a={0} b={SHOT} fade={1} cam={{z: [1.04, 1.12], x: [-30, 30], y: [0, -10]}} />
  </AbsoluteFill>
);
