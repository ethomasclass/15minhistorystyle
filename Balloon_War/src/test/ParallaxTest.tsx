// Internal test of LayeredScene on a reference image (not for publishing).
import React from 'react';
import {LayeredScene} from '../kit/silhouette';

export const PARALLAX_TEST_FRAMES = 180;
export const ParallaxTest: React.FC = () => (
  <LayeredScene name="_scratch_forest" planes={4} size={[800, 600]} a={0} b={180} shift={260} push={0.08} focusY={0.15} over={1.06}
    drift={{src: 'img/layers/_scratch_forest/subject.png', w: 170, behind: 3, from: [1700, 330], to: [300, 420], a: 0, b: 180, bob: 14, tilt: 4,
      sink: [[0, 0], [60, 40], [72, -10], [130, 50], [142, 0]]}} />
);
