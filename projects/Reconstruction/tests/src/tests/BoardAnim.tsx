// The evidence board in motion (end of Episode 1): pieces drop onto the board on their lines and are pinned, yarn draws
// from cause to effect with its tag, the camera moves along the board, and the ending pulls back to show all of it.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../kit/common';
import {Tag, useGFrame} from '../kit/Kit';
import {TestFrame} from './common';

const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const CREAM = '#f4efe6';
const HAND = '"Nanum Pen Script", cursive';
const DISPLAY = '"Abril Fatface", serif';
const QUOTE = '"Playfair Display", serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Piece = {id: string; label: string; img?: string; doc?: string; fit?: string; x: number; y: number; w: number; h: number; r: number; at: number; coral?: boolean; faded?: boolean};

// at < 0: already on the board when the shot opens (earlier chapters)
const PIECES: Piece[] = [
  {id: 'petition', label: 'A FEW ACRES', doc: '“we wish to have A home if It be but A few acres.”', x: 790, y: 110, w: 320, h: 150, r: -1.5, at: -1, coral: true},
  {id: 'forty', label: 'FORTY ACRES', img: 'acres.jpg', fit: '62% 45%', x: 110, y: 360, w: 340, h: 180, r: -2, at: -1},
  {id: 'ten', label: 'TEN PERCENT', img: 'lincoln.jpg', fit: '50% 30%', x: 700, y: 420, w: 180, h: 190, r: 2, at: -1},
  {id: 'targets', label: 'THREE TARGETS, ONE NIGHT', img: 'johnson.jpg', fit: '50% 25%', x: 960, y: 440, w: 180, h: 190, r: -3, at: -1},
  {id: 'back', label: 'THE LAND GOES BACK', img: 'pardons.jpg', fit: '50% 40%', x: 170, y: 680, w: 250, h: 220, r: 2.5, at: 24},
  {id: 'except', label: 'EXCEPT AS A PUNISHMENT FOR CRIME', doc: '“Neither slavery nor involuntary servitude, except as a punishment for crime…”', x: 1430, y: 330, w: 320, h: 160, r: 2, at: 172, coral: true},
  {id: 'equal', label: 'EQUAL PROTECTION', doc: '“nor deny to any person within its jurisdiction the equal protection of the laws.”', x: 1450, y: 640, w: 320, h: 160, r: -2, at: 214},
  {id: 'congress', label: 'CONGRESS DECIDES', img: 'stevens.jpg', fit: '50% 30%', x: 830, y: 750, w: 180, h: 190, r: 1.5, at: 300},
  {id: 'bureau', label: 'THE BUREAU', img: 'firstvote.jpg', fit: '50% 45%', x: 1220, y: 820, w: 150, h: 150, r: 4, at: 346, faded: true},
];
const P = Object.fromEntries(PIECES.map((p) => [p.id, p]));
const PIN_DELAY = 9;
const pinOf = (id: string): [number, number] => {
  const p = P[id];
  return [p.x + p.w / 2 + 12, p.y + 12];
};

type Yarn = {from: string; to: string; word: string; at: number};
const YARN: Yarn[] = [
  {from: 'ten', to: 'targets', word: 'but', at: -1},
  {from: 'targets', to: 'back', word: 'therefore', at: 46},
  {from: 'forty', to: 'back', word: 'but', at: 84},
  {from: 'except', to: 'equal', word: 'therefore', at: 236},
  {from: 'equal', to: 'congress', word: 'but', at: 320},
];
const YARN_DUR = 16;

const CHALK: [string, number, number, number][] = [
  ['LAND', 230, 300, -1],
  ['WHO DECIDES?', 830, 352, -1],
  ['LAW', 1570, 270, 156],
];

// camera: board point at the centre of the frame, and zoom
const CAM: [number, number, number, number][] = [
  // frame, cx, cy, zoom
  [0, 450, 650, 1.42],
  [110, 470, 650, 1.4],
  [146, 1480, 560, 1.62],
  [262, 1440, 600, 1.55],
  [292, 1060, 760, 1.6],
  [362, 1080, 760, 1.5],
  [412, 960, 540, 1.0],
  [480, 960, 540, 0.98],
];
const camAt = (f: number) => {
  let i = CAM.length - 2;
  for (let k = 0; k < CAM.length - 1; k++) if (f < CAM[k + 1][0]) { i = k; break; }
  const [f0, x0, y0, z0] = CAM[i];
  const [f1, x1, y1, z1] = CAM[i + 1];
  const t = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (f - f0) / (f1 - f0))));
  return {x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, z: Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * t)};
};

const Face: React.FC<{p: Piece}> = ({p}) =>
  p.img ? (
    <Img src={staticFile(`img/wall/${p.img}`)} style={{width: p.w, height: p.h, objectFit: 'cover', objectPosition: p.fit ?? '50% 50%', display: 'block', filter: 'grayscale(1) contrast(1.15)'}} />
  ) : (
    <div style={{width: p.w, height: p.h, background: '#e9e1cf', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: p.w * 0.08, boxSizing: 'border-box'}}>
      <div style={{fontFamily: QUOTE, fontWeight: 900, fontSize: p.w * 0.075, lineHeight: 1.25, color: '#2a2520', textAlign: 'center'}}>{p.doc}</div>
    </div>
  );

const Card: React.FC<{p: Piece}> = ({p}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (p.at >= 0 && f < p.at) return null;
  const k = p.at < 0 ? 1 : spring({frame: f - p.at, fps, config: {damping: 13, stiffness: 150, mass: 0.9}});
  const fall = 1 - k;
  return (
    <div style={{position: 'absolute', left: p.x, top: p.y, transformOrigin: '50% 30%',
      transform: `translateY(${-70 * fall}px) rotate(${p.r + 7 * fall}deg) scale(${1 + 0.14 * fall})`, opacity: (p.faded ? 0.5 : 1) * Math.min(1, k * 3)}}>
      <div style={{background: CREAM, padding: 12, paddingBottom: 66, position: 'relative', boxShadow: `0 ${16 + 40 * fall}px ${30 + 50 * fall}px rgba(0,0,0,${0.6 - 0.25 * fall})`}}>
        <Face p={p} />
        {p.coral && <div style={{position: 'absolute', left: 12, top: 12, width: p.w, height: p.h, background: CORAL, mixBlendMode: 'multiply', opacity: 0.55}} />}
        <div style={{position: 'absolute', left: 12, right: 12, bottom: 8, fontFamily: DISPLAY, fontSize: 20, color: p.coral ? '#b8433a' : '#1b1915', lineHeight: 1.05}}>{p.label}</div>
      </div>
    </div>
  );
};

const Pin: React.FC<{p: Piece}> = ({p}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = p.at < 0 ? -99 : p.at + PIN_DELAY;
  if (f < at) return null;
  const k = spring({frame: f - at, fps, config: {damping: 10, stiffness: 260}});
  const [x, y] = pinOf(p.id);
  const c = p.coral ? CORAL : TEAL;
  return (
    <div style={{position: 'absolute', left: x - 11, top: y - 11, width: 22, height: 22, borderRadius: 11, transform: `scale(${0.4 + 0.6 * k})`,
      background: `radial-gradient(circle at 35% 35%, #fff 0 15%, ${c} 35%, ${p.coral ? '#6b2620' : '#0d4b42'} 100%)`, boxShadow: '3px 6px 6px rgba(0,0,0,0.6)', opacity: p.faded ? 0.6 : 1}} />
  );
};

const curve = (y: Yarn) => {
  const [x1, y1] = pinOf(y.from);
  const [x2, y2] = pinOf(y.to);
  const cy = Math.max(y1, y2) + 30 + Math.abs(x2 - x1) * 0.08;
  return {d: `M${x1},${y1} Q${(x1 + x2) / 2},${cy} ${x2},${y2}`, x1, y1, x2, y2, cy};
};

const YarnLines: React.FC = () => {
  const g = useGFrame();
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {YARN.map((y, i) => {
        const p = y.at < 0 ? 1 : interpolate(g, [y.at, y.at + YARN_DUR], [0, 1], clamp);
        if (p <= 0) return null;
        const {d} = curve(y);
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={5} transform="translate(3,5)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
            <path d={d} fill="none" stroke={TEAL} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          </g>
        );
      })}
    </svg>
  );
};

const YarnTags: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      {YARN.map((y, i) => {
        const at = y.at < 0 ? -99 : y.at + YARN_DUR;
        if (f < at) return null;
        const k = spring({frame: f - at, fps, config: {damping: 11, stiffness: 220}});
        const {x1, y1, x2, y2, cy} = curve(y);
        const t = 0.62;
        const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * ((x1 + x2) / 2) + t * t * x2;
        const yy = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: yy, transform: `translate(-50%,-50%) rotate(${i % 2 ? 4 : -5}deg) scale(${k})`, background: CREAM, color: '#14322d',
            fontFamily: HAND, fontSize: 30, lineHeight: 1, padding: '3px 10px 6px', boxShadow: '0 4px 10px rgba(0,0,0,0.45)', whiteSpace: 'nowrap'}}>{y.word}</div>
        );
      })}
    </>
  );
};

const Chalk: React.FC = () => {
  const g = useGFrame();
  return (
    <>
      {CHALK.map(([t, x, y, at]) => {
        const p = at < 0 ? 1 : interpolate(g, [at, at + 12], [0, 1], clamp);
        if (p <= 0) return null;
        return <div key={t} style={{position: 'absolute', left: x, top: y, fontFamily: HAND, fontSize: 46, color: 'rgba(244,239,230,0.6)', transform: 'rotate(-2deg)', whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`}}>{t}</div>;
      })}
    </>
  );
};

export const BOARD_FRAMES = 480;
export const BoardAnim: React.FC = () => {
  const f = useCurrentFrame();
  const c = camAt(f);
  return (
    <TestFrame vignette={0.55}>
      <AbsoluteFill style={{background: '#0d0c09'}} />
      <AbsoluteFill style={{transform: `translate(${960 - c.x * c.z}px, ${540 - c.y * c.z}px) scale(${c.z})`, transformOrigin: '0 0'}}>
        {/* the board: dark desk paper, the brand's cracks very faint; bigger than the frame so a pull-back never shows its edge */}
        <div style={{position: 'absolute', left: -600, top: -400, width: 3120, height: 1880, background: 'radial-gradient(ellipse at 50% 45%, #2b2620 0%, #17140f 60%, #0d0c09 100%)'}} />
        <div style={{position: 'absolute', left: -600, top: -400, width: 3120, height: 1880, opacity: 0.16, backgroundImage: `url(${staticFile('img/wall/pattern-cracks.svg')})`, backgroundSize: '420px'}} />
        <Chalk />
        <YarnLines />
        {PIECES.map((p) => <Card key={p.id} p={p} />)}
        <YarnTags />
        {PIECES.map((p) => <Pin key={p.id} p={p} />)}
      </AbsoluteFill>
      {/* sound: a soft knock as each pin goes in, a pen tick as yarn draws, a whoosh on the camera moves */}
      {PIECES.filter((p) => p.at >= 0).map((p) => <Sfx key={p.id} at={p.at + PIN_DELAY} src="sfx/knock.wav" volume={0.35} />)}
      {YARN.filter((y) => y.at >= 0).map((y, i) => <Sfx key={i} at={y.at} src="sfx/marker_tick.wav" volume={0.25} />)}
      {[112, 264, 364].map((at) => <Sfx key={at} at={at} src="sfx/whoosh.wav" volume={0.25} />)}
      <Tag text="Mockup · the board in motion · end of Episode 1 · no narration: pieces land on their chapters' last lines" />
    </TestFrame>
  );
};
