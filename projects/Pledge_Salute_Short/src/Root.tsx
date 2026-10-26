import React from 'react';
import {Composition} from 'remotion';
import {FPS} from './lib/theme';
import {JFonts} from './kit/Kit';
import {CoverStill} from './cover';
import {PledgeShort, SHORT_FRAMES} from './short';

export const Root: React.FC = () => (
  <>
    <Composition id="Short" width={1080} height={1920} fps={FPS} durationInFrames={SHORT_FRAMES} component={() => <JFonts><PledgeShort /></JFonts>} />
    <Composition id="Cover" width={1080} height={1920} fps={FPS} durationInFrames={1} component={() => <JFonts><CoverStill /></JFonts>} />
  </>
);
