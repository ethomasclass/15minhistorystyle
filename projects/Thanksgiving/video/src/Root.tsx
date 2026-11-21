import React from 'react';
import {Composition} from 'remotion';
import {ThumbEels} from './ThumbEels';
import {FPS, H, W} from './lib/theme';
import {CHAPTERS} from './chapters';
import {JFonts} from './kit/Kit';
import {END_SCREEN_FRAMES, EndSlots, MarkSnap, SNAP_FRAMES, TITLE_INTRO_FRAMES, TitleIntro} from './kit/ga_brand';
import {DATES, SUBTITLE, TITLE} from './project';
import {BRAND} from './Brand';
import {THUMB_FRAMES, ThumbA, ThumbB} from './Thumbnail';
import {FX} from './fx/registry';
import {VShort1, VSHORT1_FRAMES} from './shorts/VShort1';
import {VShort2, VSHORT2_FRAMES} from './shorts/VShort2';
import {VShort3, VSHORT3_FRAMES} from './shorts/VShort3';
import {TEST_COLOR_FRAMES, TestColorA, TestColorB, TestColorC} from './test/TestColor';

export const Root: React.FC = () => (
  <>
    {CHAPTERS.map((c) => (
      <Composition key={c.id} id={c.id} width={W} height={H} fps={FPS} durationInFrames={c.frames} component={() => <JFonts><c.C /></JFonts>} />
    ))}
    {FX.map((x) => <Composition key={x.id} id={`FX-${x.id}`} width={W} height={H} fps={FPS} durationInFrames={x.frames} component={() => <JFonts><x.C /></JFonts>} />)}
    <Composition id="ThumbEels-A" width={W} height={H} fps={FPS} durationInFrames={1} component={() => <JFonts><ThumbEels variant="A" /></JFonts>} />
    <Composition id="ThumbEels-B" width={W} height={H} fps={FPS} durationInFrames={1} component={() => <JFonts><ThumbEels variant="B" /></JFonts>} />
    <Composition id="Thumb-A" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbA /></JFonts>} />
    <Composition id="Thumb-B" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbB /></JFonts>} />
    <Composition id="Intro" width={W} height={H} fps={FPS} durationInFrames={TITLE_INTRO_FRAMES} component={() => <JFonts><TitleIntro title={TITLE} subtitle={SUBTITLE} line={DATES} /></JFonts>} />
    <Composition id="LogoBreak" width={W} height={H} fps={FPS} durationInFrames={SNAP_FRAMES} component={() => <JFonts><MarkSnap /></JFonts>} />
    <Composition id="EndScreen" width={W} height={H} fps={FPS} durationInFrames={END_SCREEN_FRAMES} component={() => <JFonts><EndSlots /></JFonts>} />
    {/* the vertical Shorts (1080 x 1920), cut from the chapters' narration: src/shorts/ */}
    <Composition id="VShort1" width={1080} height={1920} fps={FPS} durationInFrames={VSHORT1_FRAMES} component={() => <JFonts><VShort1 /></JFonts>} />
    <Composition id="VShort2" width={1080} height={1920} fps={FPS} durationInFrames={VSHORT2_FRAMES} component={() => <JFonts><VShort2 /></JFonts>} />
    {/* VShort3 (the turtle-soup Short) has its own voiced narration; it replaces VShort1, which stays registered but unused */}
    <Composition id="VShort3" width={1080} height={1920} fps={FPS} durationInFrames={VSHORT3_FRAMES} component={() => <JFonts><VShort3 /></JFonts>} />
    {/* the Shorts' covers: frame 0 of each Short, as a still (renders/shorts/<name>_cover.png/.jpg; muxed in as attached_pic) */}
    <Composition id="VShort2Cover" width={1080} height={1920} fps={FPS} durationInFrames={1} component={() => <JFonts><VShort2 /></JFonts>} />
    <Composition id="VShort3Cover" width={1080} height={1920} fps={FPS} durationInFrames={1} component={() => <JFonts><VShort3 /></JFonts>} />
    {/* the desk-colour test (not part of the video) */}
    {([['A', TestColorA], ['B', TestColorB], ['C', TestColorC]] as const).map(([k, C]) => (
      <Composition key={k} id={`TestColor-${k}`} width={W} height={H} fps={FPS} durationInFrames={TEST_COLOR_FRAMES} component={() => <JFonts><C /></JFonts>} />
    ))}
    {BRAND.map((b) => <Composition key={b.id} id={b.id} width={b.w} height={b.h} fps={FPS} durationInFrames={1} component={() => <JFonts><b.C /></JFonts>} />)}
  </>
);
