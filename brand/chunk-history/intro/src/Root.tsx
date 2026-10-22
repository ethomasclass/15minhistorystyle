import React from 'react';
import {Composition} from 'remotion';
import {Intro} from './Intro';

export const Root: React.FC = () => (
  <>
    <Composition id="ChunkIntro" component={Intro} durationInFrames={260} fps={30} width={1920} height={1080} />
  </>
);
