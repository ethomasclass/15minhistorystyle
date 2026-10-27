// A 21-second test of the multi-plane silhouette parallax on three scenes (not part of the video).
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {SilScene} from './kit/silparallax';
import wagon from '../public/img/layers/sil/ch03_wagon_roof/layers.json';
import hearth from '../public/img/layers/sil/ch02_hearth/layers.json';
import suburbs from '../public/img/layers/sil/ch06_suburbs/layers.json';

export const SIL_TEST_FRAMES = 630;
const S = 210;
export const SilTest: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Sequence from={0} durationInFrames={S}><SilScene name="ch02_hearth" size={hearth.size as [number, number]} glowLayer={hearth.glowLayer} a={0} b={S} cam={{z: [1.02, 1.16], x: [20, -20]}} /></Sequence>
    <Sequence from={S} durationInFrames={S}><SilScene name="ch03_wagon_roof" size={wagon.size as [number, number]} glowLayer={wagon.glowLayer} a={0} b={S} cam={{z: [1.05, 1.12], x: [-60, 50]}} /></Sequence>
    <Sequence from={2 * S} durationInFrames={S}><SilScene name="ch06_suburbs" size={suburbs.size as [number, number]} glowLayer={suburbs.glowLayer} a={0} b={S} cam={{z: [1.04, 1.1], x: [70, -70]}} /></Sequence>
  </AbsoluteFill>
);
