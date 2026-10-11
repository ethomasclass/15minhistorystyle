import React from 'react';
import {Composition} from 'remotion';
import {FPS} from './lib/theme';
import {JFonts} from './kit/Kit';
import {RumpelShort, SHORT_FRAMES} from './short';

export const Root: React.FC = () => (
  <>
    <Composition id="Short" width={1080} height={1920} fps={FPS} durationInFrames={SHORT_FRAMES} component={() => <JFonts><RumpelShort /></JFonts>} />
  </>
);
