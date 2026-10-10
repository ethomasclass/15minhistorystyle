// Review-only: four masked archival subjects as 2.5D parallax scenes (coral tint, teal trace, crop inside the film border).
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Finish, PALETTES, PaletteCtx, StepCtx} from '../kit/Kit';
import {Parallax} from '../kit/parallax';
import {MASKS} from '../masks';

const S = 90;
const SCENES = [
  {name: 'landis_street', src: 'img/ch01/landis_street_1924_crop.jpg', size: [3280, 2430], fx: 0.55, fy: 0.42, tag: 'Library of Congress · National Photo Co., 1924', cam: {z: [1.02, 1.12] as [number, number]}},
  {name: 'cicotte', src: 'img/ch06/eddie_cicotte_1917.jpg', size: [2989, 2257], crop: [330, 170, 2780, 2120], fx: 0.55, fy: 0.45, tag: 'Library of Congress · Bain News Service, 1917', cam: {x: [-0.04, 0.03] as [number, number]}},
  {name: 'jackson', src: 'img/ch06/joe_jackson_cleveland_1911.jpg', size: [3000, 2198], crop: [120, 170, 2900, 2100], fx: 0.5, fy: 0.45, tag: 'Library of Congress · Bain News Service, 1911', cam: {z: [1.12, 1.03] as [number, number]}},
  {name: 'klem', src: 'img/ch04/bill_klem_umpire_1914_b.jpg', size: [3840, 2770], crop: [760, 150, 3720, 2680], fx: 0.5, fy: 0.3, tag: 'Library of Congress · Bain News Service, 1914', cam: {y: [0.03, -0.02] as [number, number]}},
] as const;

export const PARALLAX_TEST_FRAMES = S * SCENES.length;
export const ParallaxTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}><StepCtx.Provider value={2.5}>
  <AbsoluteFill style={{background: '#111'}}>
    {SCENES.map((s, i) => (
      <Sequence key={s.name} from={i * S} durationInFrames={S}>
        <Parallax name={s.name} src={s.src} size={s.size as [number, number]} crop={'crop' in s ? (s.crop as unknown as [number, number, number, number]) : undefined}
          a={0} b={S} fx={s.fx} fy={s.fy} cam={s.cam} tag={s.tag} mask={MASKS[s.name]} traceAt={8} depth={1.07} />
      </Sequence>
    ))}
    <Finish />
  </AbsoluteFill>
  </StepCtx.Provider></PaletteCtx.Provider>
);
