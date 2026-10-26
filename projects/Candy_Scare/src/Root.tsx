import React from 'react';
import {Composition} from 'remotion';
import {FPS} from './lib/theme';
import {JFonts} from './kit/Kit';
import {CoverStill} from './cover';
import {CandyShort, SHORT_FRAMES} from './short';
import {ThumbA, ThumbB, ThumbC} from './thumb';

export const Root: React.FC = () => (
  <>
    <Composition id="Short" width={1080} height={1920} fps={FPS} durationInFrames={SHORT_FRAMES} component={() => <JFonts><CandyShort /></JFonts>} />
    <Composition id="Cover" width={1080} height={1920} fps={FPS} durationInFrames={1} component={() => <JFonts><CoverStill /></JFonts>} />
    <Composition id="ThumbA" width={1080} height={1920} fps={FPS} durationInFrames={1} component={() => <JFonts><ThumbA /></JFonts>} />
    <Composition id="ThumbB" width={1080} height={1920} fps={FPS} durationInFrames={1} component={() => <JFonts><ThumbB /></JFonts>} />
    <Composition id="ThumbC" width={1080} height={1920} fps={FPS} durationInFrames={1} component={() => <JFonts><ThumbC /></JFonts>} />
  </>
);
