import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/theme';
import {CHAPTERS} from './chapters';
import {JFonts} from './kit/Kit';
import {BREAK_FRAMES, ChannelIntro, INTRO_FRAMES, LogoBreak} from './kit/ChunkIntro';
import {FX} from './fx/registry';
import {THUMB_FRAMES, THUMBS} from './ThumbsBW';

export const Root: React.FC = () => (
  <>
    {CHAPTERS.map((c) => (
      <Composition key={c.id} id={c.id} width={W} height={H} fps={FPS} durationInFrames={c.frames} component={() => <JFonts><c.C /></JFonts>} />
    ))}
    {FX.map((x) => <Composition key={x.id} id={`FX-${x.id}`} width={W} height={H} fps={FPS} durationInFrames={x.frames} component={() => <JFonts><x.C /></JFonts>} />)}
    <Composition id="Intro" width={W} height={H} fps={FPS} durationInFrames={INTRO_FRAMES} component={() => <JFonts><ChannelIntro /></JFonts>} />
    {THUMBS.map((t) => <Composition key={t.key} id={`Thumb-${t.key}`} width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><t.C /></JFonts>} />)}
    <Composition id="LogoBreak" width={W} height={H} fps={FPS} durationInFrames={BREAK_FRAMES} component={() => <JFonts><LogoBreak /></JFonts>} />
  </>
);
