// Chapter opener: the planchette spells a short word on the 3D board, its landings ringed in teal, then the
// chapter title stamps on in the orange torn box. Plays under the first words of narration.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {clamp} from '../lib/anim';
import {Highlight, JF, useGFrame} from './Kit';
import {BoardShot, type CamMode, type Light, landings, spell} from './board3d';

export const titleMoves = (word: string, per = 8) => spell(word, 6, per);
export const titleDone = (word: string, per = 8) => {
  const m = titleMoves(word, per);
  return m[m.length - 1].f + m[m.length - 1].dur + 4;
};

export const ChapterTitle: React.FC<{word: string; title: string; n: number; b: number; light?: Light; cam?: CamMode; per?: number}> = ({word, title, n, b, light = 'candle', cam = 'top', per = 8}) => {
  const g = useGFrame();
  const moves = titleMoves(word, per);
  const done = titleDone(word, per);
  return (
    <BoardShot a={0} b={b} moves={moves} cam={cam} light={light} dolly={0.35} start={{x: 1024, y: 900}} rings={landings(moves).map((l) => ({at: l.f, key: l.key}))}>
      <AbsoluteFill style={{background: 'rgba(5,4,3,0.5)', opacity: interpolate(g, [done, done + 8], [0, 1], clamp)}} />
      {g >= done && <Highlight text={title} x={150} y={780} size={110} at={done} seed={n * 7} rot={-2} />}
      {g >= done && <div style={{position: 'absolute', left: 160, top: 700, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: 'rgba(255,255,255,0.8)',
        opacity: interpolate(g, [done, done + 6], [0, 1], clamp)}}>CHAPTER {n}</div>}
    </BoardShot>
  );
};
