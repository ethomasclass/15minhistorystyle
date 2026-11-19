import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from '../lib/theme';
import {JFonts} from '../kit/Kit';
import {GrandmaProto, MontageProto, SubscribeProto} from './HandsProto';

const BEATS = {Montage: MontageProto, Grandma: GrandmaProto, Subscribe: SubscribeProto};
export const ProtoRoot: React.FC = () => (
  <>
    {Object.entries(BEATS).flatMap(([k, C]) => (['A', 'B'] as const).map((v) => (
      <Composition key={k + v} id={`Proto-${k}-${v}`} width={W} height={H} fps={FPS} durationInFrames={150} component={() => <JFonts><C v={v} /></JFonts>} />
    )))}
  </>
);
