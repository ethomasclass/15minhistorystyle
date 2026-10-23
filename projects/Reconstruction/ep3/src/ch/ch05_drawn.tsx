// ch05's two drawn scenes.
//   FarAway      the one dry aside: the Colfax print shrinks to a tiny card on a big desk beside "your paycheck"
//   Priorities   the reformers' list: new causes drop in on top and "Black rights" slides down it
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {DarkPaper, Sfx} from '../kit/common';
import {Tag, useGFrame} from '../kit/Kit';
import {CORAL, Slip, TEAL, tornPoly} from '../kit/vox';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const HAND = '"Nanum Pen Script", cursive';

export type FarCues = {a: number; paycheck: number; shrink: number; shrinkEnd: number; louisiana: number; far: number};

export const FarAway: React.FC<{c: FarCues}> = ({c}) => {
  const f = useCurrentFrame();
  const p = Easing.inOut(Easing.cubic)(interpolate(f, [c.shrink, c.shrinkEnd], [0, 1], clamp));
  const w = 860 * Math.pow(130 / 860, p);
  const h = (w * 676) / 900;
  const cx = 960 + (1560 - 960) * p, cy = 450 + (250 - 450) * p;
  const rise = interpolate(f, [c.a, c.a + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Img src={staticFile('img/wall/cr_colfax.png')} style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2 + (1 - rise) * 20, width: w, height: h, transform: `rotate(${-2 + 4 * p}deg)`,
        opacity: Math.min(1, rise * 2.5), filter: `drop-shadow(0 ${18 - 12 * p}px ${26 - 16 * p}px rgba(0,0,0,0.7))`}} />
      <Slip text="your paycheck" x={170} y={840} rot={-2} size={100} at={c.paycheck} coral />
      <Slip text="Louisiana" x={1480} y={330} rot={2} size={36} at={c.louisiana} />
      <Slip text="very far away" x={760} y={520} rot={-1.5} size={66} at={c.far} />
      <Sfx at={c.a} src="sfx/tick.wav" volume={0.35} />
      <Tag text={'"The Louisiana Murders," Harper\'s Weekly, May 10, 1873 · Library of Congress'} />
    </AbsoluteFill>
  );
};

export type ListCues = {a: number; slavery: number; gov: number; econ: number; slid: number};

const CARD = {x: 820, y: 130, w: 760, h: 800};
const ROW0 = 330, ROW = 130;

/** One line on the list; its row eases between integer rows as items are inserted above it. */
const Item: React.FC<{text: string; at: number; row: (g: number) => number; color?: string; strike?: number}> = ({text, at, row, color = '#0f3e37'}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  if (g < at) return null;
  const drop = interpolate(f, [at, at + 6], [-40, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const write = interpolate(g, [at + 2, at + 12], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 120, top: ROW0 - CARD.y + row(f) * ROW + drop - 60, fontFamily: HAND, fontSize: 84, lineHeight: 1, color, whiteSpace: 'nowrap',
      opacity: interpolate(f, [at, at + 3], [0, 1], clamp)}}>
      <span style={{clipPath: `inset(-20% ${(1 - write) * 100}% -20% -5%)`, display: 'inline-block'}}>{text}</span>
    </div>
  );
};

export const Priorities: React.FC<{c: ListCues}> = ({c}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const step = (at: number) => interpolate(f, [at, at + 8], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const rise = interpolate(f, [c.a, c.a + 8], [0, 1], clamp);
  // Black rights: row 0, pushed to 1 by "clean government", to 2 by "the economy", then slides to 3 on "slid"
  const br = (fr: number) => step(c.gov) + step(c.econ) + step(c.slid) * 1.15 + 0 * fr;
  const gov = () => step(c.econ);
  const arrow = interpolate(g, [c.slid + 4, c.slid + 12], [0, 1], clamp);
  const yBR = ROW0 + br(f) * ROW;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: CARD.x, top: CARD.y + (1 - rise) * 24, width: CARD.w, height: CARD.h, transform: 'rotate(-1.5deg)', opacity: Math.min(1, rise * 2.5),
        filter: 'drop-shadow(8px 12px 0 rgba(0,0,0,0.5))'}}>
        <div style={{position: 'absolute', inset: 0, background: '#ece6d8', clipPath: tornPoly('rl', CARD.w, CARD.h, 10),
          backgroundImage: 'linear-gradient(rgba(15,62,55,0.18) 2px, transparent 2px)', backgroundSize: `100% ${ROW}px`, backgroundPosition: `0 ${ROW0 - CARD.y + 40}px`}} />
        <div style={{position: 'absolute', left: 60, top: 40, fontFamily: HAND, fontSize: 70, color: '#0f3e37', opacity: 0.85}}>the reformers' list</div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: 50, top: ROW0 - CARD.y + i * ROW - 52, fontFamily: HAND, fontSize: 64, color: 'rgba(15,62,55,0.45)'}}>{i + 1}.</div>
        ))}
        <Item text="the economy" at={c.econ} row={() => 0} />
        <Item text="clean government" at={c.gov} row={gov} />
        <Item text="Black rights" at={c.a + 4} row={br} color="#a33a2e" />
        {arrow > 0 && (
          <svg width={CARD.w + 200} height={CARD.h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <path d={`M ${CARD.w - 70} ${ROW0 - CARD.y - 30} L ${CARD.w - 70} ${ROW0 - CARD.y - 30 + (yBR - ROW0 + 10) * arrow}`} stroke={TEAL} strokeWidth={7} strokeLinecap="round" fill="none" />
            {arrow >= 1 && <path d={`M ${CARD.w - 92} ${yBR - CARD.y - 42} L ${CARD.w - 70} ${yBR - CARD.y - 18} L ${CARD.w - 48} ${yBR - CARD.y - 42}`} stroke={TEAL} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
          </svg>
        )}
      </div>
      <Slip text="once: against slavery" x={150} y={200} rot={-2} size={56} at={c.slavery} />
      <Slip text="now: clean government" x={160} y={330} rot={1.5} size={56} at={c.gov} />
      <Slip text="slid down" x={260} y={640} rot={-2} size={66} at={c.slid + 6} coral />
      {[c.gov, c.econ].map((a) => <Sfx key={a} at={a} src="sfx/marker_tick.wav" volume={0.25} />)}
      <Sfx at={c.slid} src="sfx/page_turn.wav" volume={0.2} />
      <Tag text="Drawn: the reformers' priorities in the 1870s (an illustration)" />
    </AbsoluteFill>
  );
};

/** keep `random`/CORAL imports meaningful for future tweaks */
export const _unused = [random, CORAL];
