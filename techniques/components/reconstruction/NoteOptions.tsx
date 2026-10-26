// Legibility options for handwritten notes over busy pictures (the hardest case: teal handwriting on the pale,
// handwritten 13th Amendment page). Same two notes, four treatments:
//   A  as now: handwriting with a dark outline, straight on the picture
//   B  a soft shadow pool behind the words (invisible as a shape, just darker where the words are)
//   C  a torn paper slip: dark-teal ink on cream, like the board's yarn tags
//   D  notes off the picture: the picture slides aside, notes sit on the desk with a teal leader to their spot
import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {DarkPaper} from '../kit/common';
import {Arrow, JF, Note, Tag} from '../kit/Kit';
import {TestFrame} from './common';
import {CORAL, Sheet} from './voxkit';

const T13 = 'img/ch06/thirteenth_src.jpg';
const T13S: [number, number] = [3196, 4253];
const T13F = 'grayscale(1) sepia(0.15) contrast(1.6) brightness(1.08)';
const HANDF = '"Nanum Pen Script", cursive';
const NOTES = [
  {text: '3 of 4 states say yes', x: 1060, y: 330, rot: -3, color: undefined as string | undefined},
  {text: 'slavery: over', x: 1080, y: 470, rot: -3, color: CORAL},
];

/** B: the words with a soft dark pool behind them. */
const Pooled: React.FC<{text: string; x: number; y: number; rot: number; color?: string}> = ({text, x, y, rot, color}) => (
  <>
    <div style={{position: 'absolute', left: x - 50, top: y - 30, width: text.length * 34 + 100, height: 150,
      background: 'radial-gradient(ellipse at 50% 50%, rgba(8,8,6,0.78) 0%, rgba(8,8,6,0.55) 45%, transparent 72%)', filter: 'blur(6px)'}} />
    <Note text={text} x={x} y={y} size={46} rot={rot} color={color} />
  </>
);

/** C: a torn paper slip with the words in dark ink. */
const Slip: React.FC<{text: string; x: number; y: number; rot: number; coral?: boolean; seed: string}> = ({text, x, y, rot, coral, seed}) => {
  const pts: string[] = [];
  for (let i = 0; i <= 16; i++) pts.push(`${(i / 16) * 100}% ${random(`${seed}t${i}`) * 9}%`);
  for (let i = 16; i >= 0; i--) pts.push(`${(i / 16) * 100}% ${100 - random(`${seed}b${i}`) * 9}%`);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(4px 5px 0 rgba(0,0,0,0.55))'}}>
      <div style={{background: coral ? '#f3c6bf' : '#ece6d8', clipPath: `polygon(${pts.join(',')})`, padding: '6px 26px 10px', fontFamily: HANDF, fontSize: 70, lineHeight: 1,
        color: coral ? '#5a1d17' : '#0f3e37', whiteSpace: 'nowrap'}}>{text}</div>
    </div>
  );
};

const Doc: React.FC<{x?: number}> = ({x = 1598}) => (
  <Sheet src={T13} size={T13S} cam={{x, y: 1320, z: 0.32}} seed="t13" filter={T13F} />
);

const Frame: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
  <TestFrame vignette={0.4}>
    <AbsoluteFill><DarkPaper />{children}</AbsoluteFill>
    <div style={{position: 'absolute', left: 60, top: 40, fontFamily: JF.mono, fontSize: 30, letterSpacing: 2, color: '#f4efe6', textShadow: '0 2px 8px #000'}}>{label}</div>
    <Tag text="Mockup · handwriting legibility over a busy picture" />
  </TestFrame>
);

export const NoteA: React.FC = () => (
  <Frame label="A · AS NOW">
    <Doc />
    {NOTES.map((n) => <Note key={n.text} text={n.text} x={n.x} y={n.y} size={46} rot={n.rot} color={n.color} />)}
  </Frame>
);
export const NoteB: React.FC = () => (
  <Frame label="B · SHADOW POOL">
    <Doc />
    {NOTES.map((n) => <Pooled key={n.text} {...n} />)}
  </Frame>
);
export const NoteC: React.FC = () => (
  <Frame label="C · PAPER SLIP">
    <Doc />
    {NOTES.map((n, i) => <Slip key={n.text} text={n.text} x={n.x} y={n.y} rot={n.rot} coral={!!n.color} seed={`s${i}`} />)}
  </Frame>
);
export const NoteD: React.FC = () => (
  <Frame label="D · ON THE DESK">
    <Doc x={2700} />
    <Note text="3 of 4 states say yes" x={1200} y={300} size={46} rot={-3} />
    <Note text="slavery: over" x={1260} y={560} size={46} rot={-3} color={CORAL} />
    <Arrow x1={1190} y1={350} x2={960} y2={330} bow={-25} at={-99} />
    <Arrow x1={1250} y1={610} x2={990} y2={430} bow={30} at={-99} color={CORAL} />
  </Frame>
);
