// A 20-second test of the multi-plane silhouette parallax on four scenes (not part of the video).
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {SilScene} from './kit/silparallax';
import salting from '../public/img/layers/sil/sil_salting/layers.json';
import dawn from '../public/img/layers/sil/sil_dawn_ride/layers.json';
import sf from '../public/img/layers/sil/sil_sf_night/layers.json';
import stranger from '../public/img/layers/sil/sil_stranger/layers.json';

export const SIL_TEST_FRAMES = 600;
const S = 150;
type L = {size: number[]; glowLayer?: number};
const sz = (l: L) => l.size as [number, number];
export const SilTest: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Sequence from={0} durationInFrames={S}><SilScene name="sil_salting" size={sz(salting)} glowLayer={(salting as L).glowLayer} a={0} b={S} cam={{z: [1.03, 1.15], x: [30, -20]}} /></Sequence>
    <Sequence from={S} durationInFrames={S}><SilScene name="sil_dawn_ride" size={sz(dawn)} glowLayer={(dawn as L).glowLayer} a={0} b={S} cam={{z: [1.04, 1.1], x: [-80, 60]}} flicker={0} /></Sequence>
    <Sequence from={2 * S} durationInFrames={S}><SilScene name="sil_sf_night" size={sz(sf)} glowLayer={(sf as L).glowLayer} a={0} b={S} cam={{z: [1.03, 1.12], x: [40, -40], y: [10, -10]}} /></Sequence>
    <Sequence from={3 * S} durationInFrames={S}><SilScene name="sil_stranger" size={sz(stranger)} glowLayer={(stranger as L).glowLayer} a={0} b={S} cam={{z: [1.02, 1.1], x: [0, 0], y: [20, -20]}} flicker={0} /></Sequence>
  </AbsoluteFill>
);
