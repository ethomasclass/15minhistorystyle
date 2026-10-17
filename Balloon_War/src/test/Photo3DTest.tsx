// Internal test: the 320th photo as a 3D scene.
import React from 'react';
import {Photo3D} from '../kit/photo3d';
import {Finish} from '../kit/Kit';
import meta from '../../public/img/layers3d/ch02_320th/layers.json';

export const PHOTO3D_TEST_FRAMES = 210;
export const Photo3DTest: React.FC = () => (
  <>
    <Photo3D name="ch02_320th" depths={meta.depth} size={meta.size as [number, number]} a={0} b={210}
      dolly={320} yaw={[-4, 4]} pan={[30, -30]} deep={1800} />
    <Finish vignette={0.3} />
  </>
);
