import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/theme';
import {CHAPTERS} from './chapters';
import {JFonts} from './kit/Kit';
import {ChannelIntro, INTRO_FRAMES} from './kit/Intro';
import {BREAK_FRAMES, LogoBreak} from './kit/LogoBreak';
import {BRAND} from './Brand';
import {THUMB_FRAMES, ThumbA, ThumbB} from './Thumbnail';
import {STEREO_FRAMES, StereoTest} from './tests/StereoTest';
import {ACRES_FRAMES, AcresTest} from './tests/AcresTest';
import {FORDS_FRAMES, FordsTest} from './tests/FordsTest';
import {WallA, WallB, WallC, WallD} from './tests/WallMocks';
import {BrickChannel, BrickE1, BrickEnd, BrickLand} from './tests/WallBricks';
import {BOARD_FRAMES, BoardAnim} from './tests/BoardAnim';
import {Collage1, Collage2, Collage3, Collage4} from './tests/CollageMocks';
import {COLLAGE_ANIM_FRAMES, COLLAGE_NIGHT_FRAMES, CollageAnim, CollageNight} from './tests/CollageAnim';

export const Root: React.FC = () => (
  <>
    {CHAPTERS.map((c) => (
      <Composition key={c.id} id={c.id} width={W} height={H} fps={FPS} durationInFrames={c.frames} component={() => <JFonts><c.C /></JFonts>} />
    ))}
    <Composition id="Thumb-A" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbA /></JFonts>} />
    <Composition id="Thumb-B" width={W} height={H} fps={FPS} durationInFrames={THUMB_FRAMES} component={() => <JFonts><ThumbB /></JFonts>} />
    <Composition id="Test-Stereo" width={W} height={H} fps={FPS} durationInFrames={STEREO_FRAMES} component={StereoTest} />
    <Composition id="Test-Acres" width={W} height={H} fps={FPS} durationInFrames={ACRES_FRAMES} component={AcresTest} />
    <Composition id="Test-Fords" width={W} height={H} fps={FPS} durationInFrames={FORDS_FRAMES} component={FordsTest} />
    {([['Wall-A', WallA], ['Wall-B', WallB], ['Wall-C', WallC], ['Wall-D', WallD], ['Brick-E1', BrickE1], ['Brick-Land', BrickLand], ['Brick-End', BrickEnd], ['Brick-Channel', BrickChannel], ['Collage-1', Collage1], ['Collage-2', Collage2], ['Collage-3', Collage3], ['Collage-4', Collage4]] as const).map(([id, C]) => <Composition key={id} id={id} width={W} height={H} fps={FPS} durationInFrames={1} component={C} />)}
    <Composition id="Collage-Anim" width={W} height={H} fps={FPS} durationInFrames={COLLAGE_ANIM_FRAMES} component={CollageAnim} />
    <Composition id="Collage-Night" width={W} height={H} fps={FPS} durationInFrames={COLLAGE_NIGHT_FRAMES} component={CollageNight} />
    <Composition id="Board-Anim" width={W} height={H} fps={FPS} durationInFrames={BOARD_FRAMES} component={BoardAnim} />
    <Composition id="Intro" width={W} height={H} fps={FPS} durationInFrames={INTRO_FRAMES} component={() => <JFonts><ChannelIntro /></JFonts>} />
    <Composition id="LogoBreak" width={W} height={H} fps={FPS} durationInFrames={BREAK_FRAMES} component={() => <JFonts><LogoBreak /></JFonts>} />
    {BRAND.map((b) => <Composition key={b.id} id={b.id} width={b.w} height={b.h} fps={FPS} durationInFrames={1} component={() => <JFonts><b.C /></JFonts>} />)}
  </>
);
