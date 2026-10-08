// Shot 1: the 1848 "Advent of Spiritualism" plate as a 2.5D scene. The plate is cut into layers
// (tools/plate_layers.py); each layer sits at its own depth, so when the camera travels the nearer
// layers slide and grow faster than the paper behind them.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {drift, path, type V} from '../test/fx';
import {WhipBlur} from './board3d';
import {PLATE} from '../test/plate';

const S0 = 1920 / PLATE.size[0]; // plate width = frame width at zoom 1

/** Depth of each layer: 1 = the paper; bigger = nearer the lens. */
const DEPTH = {bg: 1, top: 1.05, right: 1.06, left: 1.07, br: 1.08, bl: 1.09, house: 1.13} as const;
type Layer = keyof typeof DEPTH;

// Camera keyframes in plate pixels (cx, cy) and zoom; one smooth path, eased once over the shot.
const KEYS: V[] = [
  [800, 470, 1.0], // title, angels
  [860, 900, 1.04],
  [760, 1250, 1.1], // the family
  [700, 1620, 1.28],
  [725, 1880, 1.5], // the house
];

type Cues = {a: number; b: number; year: number; place: number; knock: number; house: number};
const CuesCtx = React.createContext<Cues>({a: 0, b: 100, year: 0, place: 0, knock: 0, house: 0});

const useCam = () => {
  const f = useCurrentFrame();
  const {a, b} = React.useContext(CuesCtx);
  const WHIP = b - 11, CUT1 = b;
  const u = interpolate(f, [a, WHIP + 2], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const [cx, cy, z] = path(KEYS, u);
  // whip: accelerate to the right (ease-in), about 1,400 screen px over the last 11 frames
  const whip = (k: number) => Math.pow(interpolate(k, [WHIP, CUT1], [0, 1], clamp), 3) * 1400;
  const speed = whip(f) - whip(f - 1);
  const d = drift(f, 'plate', 2.2);
  return {cx: cx + whip(f) / (S0 * z), cy, z, speed, d};
};

const LayerBox: React.FC<{layer: Layer; children?: React.ReactNode}> = ({layer, children}) => {
  const {cx, cy, z, d} = useCam();
  const s = S0 * z * DEPTH[layer];
  // the drift is stronger on near layers, like a real lens
  const k = DEPTH[layer];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: PLATE.size[0], height: PLATE.size[1], transformOrigin: '0 0',
      transform: `translate(${960 - cx * s + d.x * k}px, ${540 - cy * s + d.y * k}px) scale(${s})`}}>
      {children}
    </div>
  );
};

const IMG = 'grayscale(1) contrast(1.32) brightness(0.98)';

const Piece: React.FC<{name: Exclude<Layer, 'bg'>}> = ({name}) => {
  const [x, y, bw, bh] = PLATE.boxes[name];
  return (
    <LayerBox layer={name}>
      {/* a soft shadow under each lifted layer sells the depth */}
      <Img src={staticFile(`img/test/plate_${name}.png`)} style={{position: 'absolute', left: x + 6, top: y + 10, width: bw, height: bh, filter: 'brightness(0) blur(10px)', opacity: 0.35}} />
      <Img src={staticFile(`img/test/plate_${name}.png`)} style={{position: 'absolute', left: x, top: y, width: bw, height: bh, filter: IMG}} />
    </LayerBox>
  );
};

/** Coral colour on the house, plus a teal outline drawn on (stepped, like a marker). */
const HouseMarks: React.FC<{at: number}> = ({at}) => {
  const g = useGFrame();
  const pal = usePal();
  const {z} = useCam();
  const [x, y, bw, bh] = PLATE.boxes.house;
  const k = interpolate(g, [at, at + 6], [0, 1], clamp);
  const p = interpolate(g, [at, at + 12], [0, 0.93], clamp);
  const pts = PLATE.housePoly.map(([px, py]) => `${px},${py}`).join(' ');
  const mask = staticFile('img/test/plate_house_mask.png');
  const m: React.CSSProperties = {position: 'absolute', left: x, top: y, width: bw, height: bh, WebkitMaskImage: `url(${mask})`, WebkitMaskSize: '100% 100%', opacity: k};
  return (
    <>
      <div style={{...m, background: pal.subject, mixBlendMode: 'color'}} />
      <div style={{...m, background: pal.subject, mixBlendMode: 'multiply', opacity: 0.3 * k}} />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={10} height={10}>
        <polygon points={pts} fill="none" stroke={pal.mark} strokeWidth={5 / (S0 * z * DEPTH.house)} strokeLinejoin="round" pathLength={1} strokeDasharray={1}
          strokeDashoffset={1 - p} />
      </svg>
    </>
  );
};

/** The 1848 Fox family plate in 2.5D, frames a..b, whipping out to the right at b. */
export const PlateScene: React.FC<Cues> = (c) => (
  <CuesCtx.Provider value={c}><PlateBody /></CuesCtx.Provider>
);

const PlateBody: React.FC = () => {
  const g = useGFrame();
  const {speed} = useCam();
  const c = React.useContext(CuesCtx);
  const house = c.house;
  const knock = c.knock;
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <WhipBlur id="plateblur" speed={speed}>
        <LayerBox layer="bg">
          <Img src={staticFile('img/test/plate_bg.jpg')} style={{position: 'absolute', left: 0, top: 0, width: PLATE.size[0], height: PLATE.size[1], filter: IMG}} />
          <Loop cx={1215} cy={203} rx={95} ry={58} at={c.year} dur={8} width={5 / S0} tilt={-6} />
        </LayerBox>
        {(['top', 'right', 'left', 'br', 'bl'] as const).map((n) => <Piece key={n} name={n} />)}
        <LayerBox layer="house">
          <Img src={staticFile('img/test/plate_house.png')} style={{position: 'absolute', left: PLATE.boxes.house[0] + 6, top: PLATE.boxes.house[1] + 10, width: PLATE.boxes.house[2], height: PLATE.boxes.house[3], filter: 'brightness(0) blur(12px)', opacity: 0.3}} />
          <Img src={staticFile('img/test/plate_house.png')} style={{position: 'absolute', left: PLATE.boxes.house[0], top: PLATE.boxes.house[1], width: PLATE.boxes.house[2], height: PLATE.boxes.house[3], filter: IMG}} />
          <HouseMarks at={house} />
        </LayerBox>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(8,6,4,0.7) 100%)'}} />
      </WhipBlur>
      <Note text="upstate New York" x={110} y={850} size={50} rot={-3} at={c.place} dur={10} out={c.knock - 6} />
      {g >= knock && g < c.b - 11 && (
        <div style={{position: 'absolute', left: 1240, top: 610, fontFamily: JF.display, fontSize: 130, color: '#FF9F1C', transform: `rotate(-8deg) scale(${interpolate(g, [knock, knock + 4], [1.25, 1], clamp)})`,
          textShadow: '0 4px 18px rgba(0,0,0,0.7)'}}>KNOCK</div>
      )}
      <Note text="(the house)" x={1250} y={300} size={56} rot={-4} at={house + 6} dur={8} />
      <Tag text="Frontispiece, T. O. Todd, Hydesville (1905) · Internet Archive" />
    </AbsoluteFill>
  );
};
