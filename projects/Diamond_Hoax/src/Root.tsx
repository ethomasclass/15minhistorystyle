import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/theme';
import {CHAPTERS} from './chapters';
import {JFonts} from './kit/Kit';
import {ChannelIntro, INTRO_FRAMES} from './kit/ChunkIntro';
import {BREAK_FRAMES, LogoBreak} from './kit/ChunkIntro';
import {BRAND} from './Brand';
import {THUMB_FRAMES, ThumbA, ThumbB} from './Thumbnail';
import {SIL_TEST_FRAMES, SilTest} from './SilTest';
import {FX_TERRAIN} from './fx/registry_terrain';
import {FX_DESK} from './fx/registry_desk';
import {ThumbF1, ThumbF2, ThumbF3, ThumbG1, ThumbG2, ThumbH1, ThumbH2} from './ThumbsDiamond';

export const Root: React.FC = () => (
  <>
    {CHAPTERS.map((c) => (
      <Composition key={c.id} id={c.id} width={W} height={H} fps={FPS} durationInFrames={c.frames} component={() => <JFonts><c.C /></JFonts>} />
    ))}
    <Composition id="Thumb-A" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbA /></JFonts>} />
    <Composition id="Thumb-B" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbB /></JFonts>} />
    {([['F1', ThumbF1], ['F2', ThumbF2], ['F3', ThumbF3], ['G1', ThumbG1], ['G2', ThumbG2], ['H1', ThumbH1], ['H2', ThumbH2]] as const).map(([k, T]) => (
      <Composition key={k} id={`Thumb-${k}`} width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><T /></JFonts>} />
    ))}
    {[...FX_TERRAIN, ...FX_DESK].map((x) => <Composition key={x.id} id={`FX-${x.id}`} width={W} height={H} fps={FPS} durationInFrames={x.frames} component={() => <JFonts><x.C /></JFonts>} />)}
    <Composition id="SilTest" width={W} height={H} fps={FPS} durationInFrames={SIL_TEST_FRAMES} component={SilTest} />
    <Composition id="Intro" width={W} height={H} fps={FPS} durationInFrames={INTRO_FRAMES} component={() => <JFonts><ChannelIntro /></JFonts>} />
    <Composition id="LogoBreak" width={W} height={H} fps={FPS} durationInFrames={BREAK_FRAMES} component={() => <JFonts><LogoBreak /></JFonts>} />
    {BRAND.map((b) => <Composition key={b.id} id={b.id} width={b.w} height={b.h} fps={FPS} durationInFrames={1} component={() => <JFonts><b.C /></JFonts>} />)}
  </>
);
