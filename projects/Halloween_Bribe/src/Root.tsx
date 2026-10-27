import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/theme';
import {CHAPTERS} from './chapters';
import {JFonts} from './kit/Kit';
import {ChannelIntro, INTRO_FRAMES} from './kit/ChunkIntro';
import {BREAK_FRAMES, LogoBreak} from './kit/ChunkIntro';
import {BRAND} from './Brand';
import {THUMB_FRAMES, ThumbA, ThumbB} from './Thumbnail';
import {HALLOWEEN_THUMBS} from './ThumbsHalloween';
import {SIL_TEST_FRAMES, SilTest} from './SilTest';

export const Root: React.FC = () => (
  <>
    {CHAPTERS.map((c) => (
      <Composition key={c.id} id={c.id} width={W} height={H} fps={FPS} durationInFrames={c.frames} component={() => <JFonts><c.C /></JFonts>} />
    ))}
    <Composition id="Thumb-A" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbA /></JFonts>} />
    <Composition id="Thumb-B" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbB /></JFonts>} />
    {Object.entries(HALLOWEEN_THUMBS).map(([k, T]) => <Composition key={k} id={`Thumb-${k}`} width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><T /></JFonts>} />)}
    <Composition id="SilTest" width={W} height={H} fps={FPS} durationInFrames={SIL_TEST_FRAMES} component={SilTest} />
    <Composition id="Intro" width={W} height={H} fps={FPS} durationInFrames={INTRO_FRAMES} component={() => <JFonts><ChannelIntro /></JFonts>} />
    <Composition id="LogoBreak" width={W} height={H} fps={FPS} durationInFrames={BREAK_FRAMES} component={() => <JFonts><LogoBreak /></JFonts>} />
    {BRAND.map((b) => <Composition key={b.id} id={b.id} width={b.w} height={b.h} fps={FPS} durationInFrames={1} component={() => <JFonts><b.C /></JFonts>} />)}
  </>
);
