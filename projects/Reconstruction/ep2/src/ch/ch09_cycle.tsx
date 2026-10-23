// ch09: the debt cycle, drawn as a loop (the user asked for a circular diagram of how sharecropping and tenant farming
// kept families poor). Five steps around an ellipse, joined by teal arrows that draw on as they're said; a coral dot runs
// the loop again on "Then another", and "poorer every year" lands in the middle.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {DarkPaper, Sfx} from '../kit/common';
import {Tag, useGFrame} from '../kit/Kit';
import {Slip} from '../kit/rc';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const CX = 960, CY = 590, RX = 600, RY = 300;
const pt = (deg: number) => [CX + RX * Math.cos((deg * Math.PI) / 180), CY + RY * Math.sin((deg * Math.PI) / 180)];

/** The steps, clockwise from the top. */
const STEPS = [
  {deg: -90, text: 'credit from the store (a crop lien)', img: 'img/ch09/cr_commissary.png', size: [900, 709]},
  {deg: -18, text: 'grow the crop', img: 'img/ch08/cr_cotton_1896.png', size: [900, 918]},
  {deg: 54, text: 'crop sold: the store is paid first', img: 'img/ch09/cr_weighing.png', size: [900, 818]},
  {deg: 126, text: 'still owes', coral: true, img: 'img/ch09/promissory_note_cut.png', size: [1775, 1290]},
  {deg: 205, text: "can't leave: another year", img: 'img/ch09/cr_cabin.png', size: [900, 708]},
];
const SIZE = 52;
/** Rough width of a Slip at SIZE, so a step can be centred on its point. */
const slipW = (s: string) => s.length * SIZE * 0.4 + SIZE * 0.76;

/** A small faded picture over a step: the store, the crop, the weighing, the note, the cabin. */
const Pic: React.FC<{src: string; size: number[]; x: number; y: number; at: number; rot: number}> = ({src, size, x, y, at, rot}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const w = 210, h = (w * size[1]) / size[0];
  const k = interpolate(f, [at, at + 6], [0, 1], clamp);
  return (
    <Img src={staticFile(src)} style={{position: 'absolute', left: x - w / 2, top: y - h - 18 + 10 * (1 - k), width: w, height: h, opacity: 0.78 * k,
      transform: `rotate(${rot}deg)`, filter: 'grayscale(1) brightness(0.82) contrast(1.1) drop-shadow(0 10px 16px rgba(0,0,0,0.6))'}} />
  );
};

/** An arrow along the ellipse from one step to the next, drawn on from `at`. */
const Arc: React.FC<{a: number; b: number; at: number; dur?: number}> = ({a, b, at, dur = 9}) => {
  const g = useGFrame();
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  if (p <= 0) return null;
  const from = a + 17, to = (b < a ? b + 360 : b) - 17;
  const n = 40, upto = from + (to - from) * p;
  const pts = Array.from({length: n + 1}, (_, i) => pt(from + ((upto - from) * i) / n));
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  // chevron at the tip, pointing along the curve
  const [x1, y1] = pts[n], [x0, y0] = pts[n - 2];
  const ang = Math.atan2(y1 - y0, x1 - x0);
  const head = [ang + 2.6, ang - 2.6].map((q) => `M${x1},${y1} L${x1 + 24 * Math.cos(q)},${y1 + 24 * Math.sin(q)}`).join(' ');
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={d} fill="none" stroke={TEAL} strokeWidth={6} strokeLinecap="round" />
      {p >= 1 && <path d={head} fill="none" stroke={TEAL} strokeWidth={6} strokeLinecap="round" />}
    </svg>
  );
};

/** A coral dot running the loop once, smoothly, from `at`. */
const Runner: React.FC<{at: number; dur: number}> = ({at, dur}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur + 8) return null;
  const [x, y] = pt(-90 + 360 * interpolate(f, [at, at + dur], [0, 1], clamp));
  return <div style={{position: 'absolute', left: x - 13, top: y - 13, width: 26, height: 26, borderRadius: 13, background: CORAL, boxShadow: '0 0 18px rgba(255,111,97,0.8)'}} />;
};

export type CycleCues = {a: number; arrest: number; sign: number; behind: number; another: number};

export const DebtCycle: React.FC<{c: CycleCues}> = ({c}) => {
  const steps = [c.a + 4, c.a + 12, c.a + 20, c.a + 28, c.sign];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Slip text="the debt cycle" x={120} y={100} size={52} rot={-1.5} at={c.a + 2} />
      <Slip text="sharecroppers and tenants" x={150} y={190} size={42} rot={1} at={c.a + 6} />
      {STEPS.map((s, i) => {
        const [x, y] = pt(s.deg);
        return <Pic key={s.img} src={s.img} size={s.size} x={x} y={y} at={steps[i] - 2} rot={i % 2 ? -2 : 2} />;
      })}
      <Arc a={-90} b={-18} at={c.a + 8} />
      <Arc a={-18} b={54} at={c.a + 16} />
      <Arc a={54} b={126} at={c.a + 24} />
      <Arc a={126} b={205} at={c.sign - 6} />
      <Arc a={205} b={-90} at={c.behind} dur={12} />
      {STEPS.map((s, i) => {
        const [x, y] = pt(s.deg);
        return <Slip key={s.text} text={s.text} x={x - slipW(s.text) / 2} y={y - 34} size={SIZE} rot={i % 2 ? 1.5 : -1.5} at={steps[i]} coral={s.coral} seed={`dc${i}`} />;
      })}
      <Slip text="leaving in debt? arrest" x={150} y={880} size={44} rot={-2} at={c.arrest} />
      <Runner at={c.another} dur={34} />
      <Slip text="poorer every year" x={CX - ('poorer every year'.length * 70 * 0.4 + 70 * 0.76) / 2} y={CY - 46} size={70} rot={-2} at={c.another + 8} coral seed="pev" />
      <Sfx at={c.another + 8} src="sfx/stamp.wav" volume={0.26} />
      <Tag text="Drawn: the crop-lien cycle · pictures: plantation store 1937, cotton 1896, weighing 1904, note 1867, cabin c.1906 (LOC, IA)" />
    </AbsoluteFill>
  );
};
