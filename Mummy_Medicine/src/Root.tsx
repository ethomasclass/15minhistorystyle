import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/theme';
import {CHAPTERS} from './chapters';
import {JFonts} from './kit/Kit';
import {ChannelIntro, INTRO_FRAMES} from './kit/Intro';
import {BREAK_FRAMES, LogoBreak} from './kit/LogoBreak';
import {BRAND} from './Brand';
import {THUMB_FRAMES, ThumbA, ThumbB, ThumbC, ThumbD} from './Thumbnail';
import {Cover1Still, VSHORTS} from './vshorts';
import {CommunitySpooky} from './community';

export const Root: React.FC = () => (
  <>
    {CHAPTERS.map((c) => (
      <Composition key={c.id} id={c.id} width={W} height={H} fps={FPS} durationInFrames={c.frames} component={() => <JFonts><c.C /></JFonts>} />
    ))}
    <Composition id="Thumb-A" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbA /></JFonts>} />
    <Composition id="Thumb-B" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbB /></JFonts>} />
    <Composition id="Thumb-C" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbC /></JFonts>} />
    <Composition id="Thumb-D" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbD /></JFonts>} />
    {VSHORTS.map((v) => <Composition key={v.id} id={v.id} width={1080} height={1920} fps={FPS} durationInFrames={v.frames} component={() => <JFonts><v.C /></JFonts>} />)}
    <Composition id="Cover-Short1" width={1080} height={1920} fps={FPS} durationInFrames={1} component={() => <JFonts><Cover1Still /></JFonts>} />
    <Composition id="Community-Spooky" width={1080} height={1080} fps={FPS} durationInFrames={1} component={() => <JFonts><CommunitySpooky /></JFonts>} />
    <Composition id="Intro" width={W} height={H} fps={FPS} durationInFrames={INTRO_FRAMES} component={() => <JFonts><ChannelIntro /></JFonts>} />
    <Composition id="LogoBreak" width={W} height={H} fps={FPS} durationInFrames={BREAK_FRAMES} component={() => <JFonts><LogoBreak /></JFonts>} />
    {BRAND.map((b) => <Composition key={b.id} id={b.id} width={b.w} height={b.h} fps={FPS} durationInFrames={1} component={() => <JFonts><b.C /></JFonts>} />)}
  </>
);
