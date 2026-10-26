// Review sheet for the hand-drawn sketches (not part of the video).
import React from 'react';
import {Note, PALETTES, PaletteCtx, StepCtx} from './kit/Kit';
import {BALL, BANK, BANNER, BARREL, Board, CABIN, CABIN_BOTTLE, CABIN_FLAG, CABIN_WHEELS, CARPET, CHAIR, COLUMN, CORSET, CrashChart, DayGrid, DOOR, PERFUME, PLANTATION, RACCOON, Sketch, SPOON, SpeechScroll, WIND, Zipper} from './kit/lc';

export const DrawTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Board>
        <Sketch d={CABIN} x={40} y={40} w={260} at={0} />
        <Sketch d={CABIN_FLAG} x={330} y={10} w={220} at={0} />
        <Sketch d={CABIN_WHEELS} x={580} y={20} w={280} at={0} />
        <Sketch d={BARREL} x={900} y={40} w={130} at={0} />
        <Sketch d={RACCOON} x={1070} y={30} w={170} at={0} />
        <Sketch d={BALL} x={1280} y={40} w={180} at={0} />
        <Sketch d={CHAIR} x={1500} y={40} w={150} at={0} />
        <Sketch d={SPOON} x={1700} y={40} w={60} at={0} />
        <Sketch d={PERFUME} x={40} y={340} w={150} at={0} />
        <Sketch d={CORSET} x={220} y={330} w={130} at={0} />
        <Sketch d={CARPET} x={380} y={350} w={240} at={0} />
        <Sketch d={COLUMN} x={660} y={300} w={110} at={0} />
        <Sketch d={CABIN_BOTTLE} x={800} y={320} w={110} at={0} />
        <Sketch d={DOOR} x={950} y={300} w={140} at={0} />
        <Sketch d={BANNER} x={1120} y={320} w={500} at={0} />
        <Sketch d={BANK} x={1650} y={330} w={230} at={0} />
        <Sketch d={WIND} x={40} y={620} w={300} at={0} />
        <Sketch d={PLANTATION} x={380} y={620} w={320} at={0} />
        <CrashChart x={760} y={620} w={360} h={200} at={0} label="1837" />
        <Zipper x={1180} y={700} w={200} at={0} />
        <SpeechScroll x={1420} y={600} w={120} at={0} dur={1} to={400} />
        <DayGrid x={1580} y={600} cell={40} cols={8} at={0} dur={1} />
        <Note text="draw test" x={60} y={960} size={50} at={0} />
      </Board>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
