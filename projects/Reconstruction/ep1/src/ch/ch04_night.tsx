// Chapter 4's board close-up: one night, three men (ported from CollageNight in tests/src/tests/CollageAnim.tsx).
// Booth in the middle, strung to the President, the vice president and the Secretary of State as the narration names them.
// Labels name places and outcomes only. The outcomes are stamped in bone, not coral, and without the camera jolt: this is
// the quiet chapter.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AThreads, APin, BoardSounds, type BoardKey, BoardStage, BRAND, Ctx, Defs, Land, Photo, SANS, Stamp, Strip} from '../kit/board';
import {Sfx} from '../kit/common';

const W = 'img/wall/';
const BONE = '#EDE7DC';
const BOOTH: [number, number] = [878, 222];   // pins sit on the prints' top margins, clear of the faces
const LINCOLN: [number, number] = [407, 212];
const JOHNSON: [number, number] = [1430, 212];
const SEWARD: [number, number] = [905, 674];

export type NightTimes = {booth: number; lincoln: number; johnson: number; seward: number; date: number;
  /** outcome stamps (1e7 = not yet) */
  died: number; survived: number; never: number};

/** `t`: when each piece lands (frames); pieces that landed before `from` are simply there. `cam`: board camera keys. */
export const NightBoard: React.FC<{from: number; t: NightTimes; cam: BoardKey[]}> = ({from, t, cam}) => {
  const now = (a: number) => a >= from - 2;
  const arr = (xs: number[]) => xs.filter(now);
  return (
    <Ctx.Provider value={BRAND}>
      <AbsoluteFill>
        <Defs />
        <BoardStage cam={cam} splats="c3">
          <Land at={t.date} kind="slide" x={140} y={112}><Strip text="APRIL 14, 1865" seed="cf" size={34} bg={BRAND.paper} font={SANS} /></Land>
          <Land at={t.booth} kind="drop" x={840} y={200} r={-2}><Photo src={W + 'cr_booth.png'} w={240} /></Land>
          <Land at={t.booth + 12} kind="slide" x={826} y={604} r={2}><Strip text="J. WILKES BOOTH · actor" seed="jb" size={24} font={SANS} /></Land>
          <Land at={t.lincoln} kind="drop" x={300} y={190} r={3}><Photo src={W + 'cr_lincoln.png'} w={215} /></Land>
          <Land at={t.lincoln + 8} kind="slide" x={270} y={545} r={-3}><Strip text="the President · Ford's Theatre" seed="t1" size={20} /></Land>
          <Land at={t.johnson} kind="drop" x={1310} y={190} r={-3}><Photo src={W + 'cr_johnson.png'} w={240} /></Land>
          <Land at={t.johnson + 8} kind="slide" x={1270} y={505} r={2}><Strip text="the vice president · Kirkwood House" seed="t3" size={20} /></Land>
          <Land at={t.seward} kind="drop" x={860} y={660} r={1}><Photo src={W + 'cr_seward.png'} w={205} /></Land>
          <Land at={t.seward + 8} kind="slide" x={790} y={956} r={-2}><Strip text="the Secretary of State · his home" seed="t2" size={20} /></Land>
          <Land at={t.died} kind="stamp" x={250} y={636} r={-6} z={6}><Stamp text="DIED · APRIL 15" size={32} color={BONE} /></Land>
          <Land at={t.survived} kind="stamp" x={1084} y={862} r={-5} z={6}><Stamp text="STABBED · SURVIVED" size={30} color={BONE} /></Land>
          <Land at={t.never} kind="stamp" x={1300} y={574} r={4} z={6}><Stamp text="NEVER ATTACKED" size={32} color={BONE} /></Land>
          <AThreads lines={[{a: BOOTH, b: LINCOLN, at: t.lincoln + 12}, {a: BOOTH, b: JOHNSON, at: t.johnson + 12}, {a: BOOTH, b: SEWARD, at: t.seward + 12}]} />
          <APin at={t.booth + 20} x={BOOTH[0]} y={BOOTH[1]} />
          <APin at={t.lincoln + 10} x={LINCOLN[0]} y={LINCOLN[1]} />
          <APin at={t.johnson + 10} x={JOHNSON[0]} y={JOHNSON[1]} />
          <APin at={t.seward + 10} x={SEWARD[0]} y={SEWARD[1]} />
        </BoardStage>
        <BoardSounds drops={arr([t.booth, t.lincoln, t.johnson, t.seward])} pins={arr([t.booth + 20, t.lincoln + 10, t.johnson + 10, t.seward + 10])}
          slides={arr([t.date, t.booth + 12, t.lincoln + 8, t.johnson + 8, t.seward + 8])} threads={arr([t.lincoln + 12, t.johnson + 12, t.seward + 12])} />
        {arr([t.died, t.survived, t.never]).map((a) => <Sfx key={a} at={a} src="sfx/stamp.wav" volume={0.28} />)}
      </AbsoluteFill>
    </Ctx.Provider>
  );
};
