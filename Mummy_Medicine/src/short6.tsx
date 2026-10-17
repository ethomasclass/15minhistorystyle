// Short 6 · There May Be a Person in This Painting: mummy brown, with its own 40 s narration (script/shorts/short6_mummy_brown.txt).
// Opens (and closes) in a 3D gallery corridor built from CSS 3D planes: paintings on both walls, the portrait at the far end.
// The new paint tube is a proper drawn tube (crimped end, label, screw cap) that unscrews, squeezes a ribbon of brown onto a
// palette, and then morphs into a mummy case.
//
// Safe zones as in vshorts.tsx: scene text in x 60–930, y 150–1150; captions at y ~1185; source tags at y ~1490.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration} from './lib/timing';
import {Arrow, Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, useGFrame, useHand, usePal} from './kit/Kit';
import {DarkPaper, Sfx, WRITE} from './kit/common';
import {Stamp, type TL, useScene} from './kit/shell';
import {Captions, Mark, TAG_Y} from './kit/vshort';
import {along, MUMMY_CASE, type P, resample, Sketch, smoothPath} from './draw';
import words from '../public/audio/short6_mummy_brown.words.json';

const N = words as Narration;
const FPS = 30;
const OUTRO = 75;
const ACCENT = 61.6; // seconds into m_reveal.mp3: its last strong hit
const CORAL = '#FF6F61';
const GOLD = '#c9a34a';
const BROWN = '#6b3f24';
const G = (i: number) => `img/ch09_answer/gallery_${i}.jpg`;
const ease = (x: number) => x * x * (3 - 2 * x);

const VTag: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', left: 60, top: TAG_Y, width: 860, fontFamily: JF.mono, fontSize: 22, letterSpacing: 1, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', textShadow: '0 1px 6px #000'}}>{text}</div>
);

// ---------- the corridor ----------
const CW = 1100; // corridor width
const CHT = 1500; // corridor height (eye level at the middle)
const CL = 3800; // depth of the far wall
const PERSP = 900;
const SEG = 400;
const HERO = {w: 620, h: 744, y: -80};
type Hung = {src: string; side: 'L' | 'R'; d: number; w: number; r: number};
const HUNG: Hung[] = [
  {src: G(2), side: 'L', d: 450, w: 520, r: 2400 / 2009},
  {src: G(4), side: 'R', d: 900, w: 800, r: 1769 / 2400},
  {src: G(3), side: 'L', d: 1650, w: 780, r: 1783 / 2400},
  {src: G(6), side: 'R', d: 2150, w: 780, r: 1766 / 2400},
  {src: G(5), side: 'L', d: 2800, w: 760, r: 1557 / 2400},
];
const fog = (dist: number, max = 0.84) => Math.min(max, Math.max(0, (dist - 1300) / 3000));
const blk = (a: number) => `rgba(6,5,4,${a.toFixed(3)})`;

/** A flat div placed in the 3D world: origin at its top-left corner. */
const Plane: React.FC<{x: number; y: number; z: number; ry?: number; rx?: number; w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({x, y, z, ry = 0, rx = 0, w, h, style, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`, ...style}}>{children}</div>
);

/** A painting in a drawn gilded frame, with a gallery spotlight on the wall around it. */
const Framed: React.FC<{src: string; w: number; h: number; warm?: number; seed: number}> = ({src, w, h, warm = 0, seed}) => {
  const pad = 26;
  return (
    <>
      <div style={{position: 'absolute', left: -260, top: -380, width: w + 520, height: h + 620, background: 'radial-gradient(ellipse 48% 46% at 50% 44%, rgba(255,214,150,0.17), rgba(255,214,150,0) 70%)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, boxShadow: '0 24px 50px rgba(0,0,0,0.75)'}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.1) brightness(0.92)'}} />
        {warm > 0 && <div style={{position: 'absolute', inset: 0, background: CORAL, mixBlendMode: 'color', opacity: 0.75 * warm}} />}
      </div>
      <Sketch pts={[[-pad, -pad], [w + pad, -pad], [w + pad, h + pad], [-pad, h + pad], [-pad, -pad + 6]]} x={0} y={0} at={-40} width={14} smooth={false} color={GOLD} n={40 + seed} />
      <Sketch pts={[[-8, -8], [w + 8, -8], [w + 8, h + 8], [-8, h + 8], [-8, -4]]} x={0} y={0} at={-40} width={4} smooth={false} color={GOLD} n={40 + seed} />
    </>
  );
};

/** The gallery corridor seen from camera depth `cam` (0 = the entrance), the far portrait warming by `warm` (0..1). */
const Corridor: React.FC<{cam: number; warm: number}> = ({cam, warm}) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 17) * 5;
  const bob = Math.sin(f / 8.5) * 2.5;
  const dist = (d: number) => PERSP + d - cam;
  const segs: number[] = [];
  for (let d0 = -600; d0 < CL; d0 += SEG) if (dist(d0) > 40) segs.push(d0);
  const wall = '#1a1611';
  const wains = 'linear-gradient(180deg, transparent 0, transparent 1072px, #3a3226 1072px, #3a3226 1080px, #120f0b 1080px, #120f0b 1470px, #2e271e 1470px)';
  return (
    <AbsoluteFill style={{background: '#070605', overflow: 'hidden', perspective: `${PERSP}px`, perspectiveOrigin: '540px 900px'}}>
      <div style={{position: 'absolute', left: 540, top: 900, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `translate3d(${sway}px, ${bob}px, ${cam}px)`}}>
        {/* far wall and the portrait */}
        <Plane x={-CW / 2} y={-CHT / 2} z={-CL} w={CW} h={CHT} style={{background: wall, backgroundImage: wains}}>
          <div style={{position: 'absolute', left: (CW - HERO.w) / 2, top: CHT / 2 + HERO.y - HERO.h / 2}}>
            <Framed src={G(1)} w={HERO.w} h={HERO.h} warm={warm} seed={1} />
          </div>
          <div style={{position: 'absolute', inset: 0, background: blk(fog(dist(CL), 0.4))}} />
        </Plane>
        {segs.map((d0) => {
          const d1 = d0 + SEG;
          const fa = fog(dist(d0)), fb = fog(dist(d1));
          return (
            <React.Fragment key={d0}>
              <Plane x={-CW / 2} y={-CHT / 2} z={-d0} ry={90} w={SEG + 1} h={CHT} style={{background: wall, backgroundImage: `linear-gradient(90deg, ${blk(fa)}, ${blk(fb)}), ${wains}`}} />
              <Plane x={CW / 2} y={-CHT / 2} z={-d1} ry={-90} w={SEG + 1} h={CHT} style={{background: wall, backgroundImage: `linear-gradient(90deg, ${blk(fb)}, ${blk(fa)}), ${wains}`}} />
              <Plane x={-CW / 2} y={CHT / 2} z={-d0} rx={-90} w={CW} h={SEG + 1}
                style={{background: '#15110c', backgroundImage: `linear-gradient(180deg, ${blk(fa)}, ${blk(fb)}), linear-gradient(90deg, transparent 300px, #2c1613 300px, #2c1613 800px, transparent 800px), repeating-linear-gradient(90deg, #0d0a07 0, #0d0a07 3px, transparent 3px, transparent 110px)`}} />
              <Plane x={-CW / 2} y={-CHT / 2} z={-d0} rx={-90} w={CW} h={SEG + 1}
                style={{background: '#0b0907', backgroundImage: `linear-gradient(180deg, ${blk(fa)}, ${blk(fb)}), linear-gradient(90deg, transparent 480px, #2a241b 480px, #2a241b 620px, transparent 620px)`}} />
            </React.Fragment>
          );
        })}
        {/* pilasters every 700 on both walls */}
        {[...Array(6)].map((_, i) => {
          const d = 150 + i * 700;
          if (dist(d) < 40) return null;
          const k = fog(dist(d));
          return (
            <React.Fragment key={i}>
              <Plane x={-CW / 2 + 1} y={-CHT / 2} z={-d} ry={90} w={46} h={CHT} style={{background: '#231e17', boxShadow: 'inset 0 0 0 2px #2d261d'}}><div style={{position: 'absolute', inset: 0, background: blk(k)}} /></Plane>
              <Plane x={CW / 2 - 1} y={-CHT / 2} z={-d - 46} ry={-90} w={46} h={CHT} style={{background: '#231e17', boxShadow: 'inset 0 0 0 2px #2d261d'}}><div style={{position: 'absolute', inset: 0, background: blk(k)}} /></Plane>
            </React.Fragment>
          );
        })}
        {HUNG.map((p, i) => {
          if (dist(p.d) < 40) return null;
          const h = p.w * p.r;
          const k = fog(dist(p.d + p.w / 2), 0.7);
          const y = HERO.y - h / 2;
          const inner = (
            <>
              <Framed src={p.src} w={p.w} h={h} seed={i + 2} />
              <div style={{position: 'absolute', left: -40, top: -40, width: p.w + 80, height: h + 80, background: blk(k)}} />
            </>
          );
          return p.side === 'L'
            ? <Plane key={i} x={-CW / 2 + 3} y={y} z={-p.d} ry={90} w={p.w} h={h}>{inner}</Plane>
            : <Plane key={i} x={CW / 2 - 3} y={y} z={-(p.d + p.w)} ry={-90} w={p.w} h={h}>{inner}</Plane>;
        })}
      </div>
      {/* the room's light falls off toward the edges of the frame */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 55% at 50% 46%, transparent 40%, rgba(5,4,3,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
/** Where the portrait sits on screen for camera depth `cam` (centre, scale). */
const heroOnScreen = (cam: number) => {
  const s = PERSP / (PERSP + CL - cam);
  return {cx: 540, cy: 900 + HERO.y * s, s};
};

// ---------- the paint tube ----------
// Local units, the nozzle pointing up: base (crimped end) at y 0, shoulder at -640, nozzle top at -700, cap to -800.
const HALF: P[] = [[0, -700], [36, -700], [36, -672], [70, -655], [112, -628], [140, -585], [150, -520], [152, -420], [155, -300], [160, -160], [166, -60], [172, -50], [172, 0]];
const sideX = (y: number) => {
  for (let i = 1; i < HALF.length; i++) {
    const [x0, y0] = HALF[i - 1], [x1, y1] = HALF[i];
    if (y >= y0 && y <= y1) return y1 === y0 ? x1 : x0 + ((y - y0) / (y1 - y0)) * (x1 - x0);
  }
  return HALF[HALF.length - 1][0];
};
const pinchAt = (y: number, sq: number) => {
  const u = (y + 270) / 230;
  return u > 0 && u < 1 ? 1 - 0.38 * sq * Math.sin(Math.PI * u) : 1;
};
/** Outline, clockwise from the nozzle's top centre (so it lines up point for point with MUMMY_CASE). */
const tubeOutline = (sq: number): P[] => {
  const right = HALF.map(([x, y]): P => [x * pinchAt(y, sq), y]);
  const left = [...HALF].reverse().slice(0, -1).map(([x, y]): P => [-x * pinchAt(y, sq), y]);
  return [...right, ...left];
};
const CASE: P[] = MUMMY_CASE.map(([x, y]): P => [(x - 260) * 1.75, y * 1.75 - 770]);

type TubeProps = {
  x: number; y: number; s: number; rot?: number; at: number; dur?: number;
  labelAt?: number; textAt?: number; capAt?: number; sqAt?: number; morph?: [number, number]; popOut?: number;
  to?: {x: number; y: number; s: number; rot: number};
};
/** The drawn tube. (x, y) is the crimped end on screen; it rotates about that point. */
const Tube: React.FC<TubeProps> = ({x, y, s, rot = 0, at, dur = 14, labelAt, textAt, capAt, sqAt, morph, popOut, to}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (g < at) return null;
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  const u = morph ? ease(interpolate(g, morph, [0, 1], clamp)) : 0;
  const pop = popOut !== undefined ? interpolate(g, [popOut, popOut + 4], [1, 0], clamp) : 1;
  if (pop <= 0) return null;
  const sq = sqAt !== undefined ? interpolate(g, [sqAt, sqAt + 10], [0, 1], clamp) * (1 - u) : 0;
  const boil = Math.floor(g / 5);
  const A = resample(tubeOutline(sq), 140, true);
  const B = resample(CASE, 140, true);
  const pts: P[] = A.map(([ax, ay], i) => [ax + (B[i][0] - ax) * u + (random(`tx${i % 7}${boil}`) - 0.5) * 3 / s, ay + (B[i][1] - ay) * u + (random(`ty${i % 5}${boil}`) - 0.5) * 3 / s]);
  const d = smoothPath(pts, true);
  const X = to ? x + (to.x - x) * u : x, Y = to ? y + (to.y - y) * u : y;
  const S = (to ? s + (to.s - s) * u : s) * pop, R = to ? rot + (to.rot - rot) * u : rot;
  const lw = 7 / S;
  const line = {fill: 'none', stroke: pal.mark, strokeWidth: lw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  // label band: the body between y -470 and -150, following the (squeezed) sides
  const ys = [...Array(9)].map((_, i) => -470 + i * 40);
  const lab = [...ys.map((yy): P => [sideX(yy) * pinchAt(yy, sq) - 3, yy]), ...[...ys].reverse().map((yy): P => [-sideX(yy) * pinchAt(yy, sq) + 3, yy])];
  const labD = 'M' + lab.map((q) => q.join(',')).join(' L') + ' Z';
  const labO = labelAt !== undefined ? interpolate(g, [labelAt, labelAt + 6], [0, 1], clamp) * (1 - u) : 0;
  const txt = textAt !== undefined ? interpolate(g, [textAt, textAt + 10], [0, 1], clamp) : 0;
  // the cap: twists (ribs slide), then pops off along the tube's axis
  const tw = capAt !== undefined ? Math.max(0, g - capAt) : 0;
  const fly = capAt !== undefined ? interpolate(g, [capAt + 12, capAt + 22], [0, 1], clamp) : 0;
  const ribShift = capAt !== undefined && g >= capAt && fly === 0 ? (tw * 4) % 16 : 0;
  const wob = capAt !== undefined && g >= capAt && fly === 0 ? Math.sin(tw * 1.7) * 4 : 0;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1080} height={1920}>
      <g transform={`translate(${X} ${Y}) rotate(${R}) scale(${S})`}>
        <path d={d} fill={u > 0 ? pal.subject : '#24201b'} opacity={p >= 1 ? (u > 0 ? 0.25 + 0.2 * u : 0.95) : 0} stroke="none" />
        {labO > 0 && (
          <g opacity={labO}>
            <path d={labD} fill="#efe6d3" />
            <path d={labD} fill={BROWN} clipPath="url(#t6band)" />
            <clipPath id="t6band"><rect x={-200} y={-470} width={400} height={56} /></clipPath>
            <g transform="translate(0 -282) rotate(-90)" style={{clipPath: `inset(0 ${(1 - txt) * 100}% 0 0)`}}>
              <text x={0} y={-30} textAnchor="middle" fontFamily={hand.family} fontWeight={hand.weight} fontSize={64 * hand.scale} fill={BROWN}>MUMMY</text>
              <text x={0} y={36} textAnchor="middle" fontFamily={hand.family} fontWeight={hand.weight} fontSize={64 * hand.scale} fill={BROWN}>BROWN</text>
              <text x={0} y={82} textAnchor="middle" fontFamily={JF.mono} fontSize={17} letterSpacing={2} fill="#4a3a2a">ARTISTS' OIL COLOUR</text>
            </g>
          </g>
        )}
        {/* crimped end */}
        <g opacity={(1 - u) * (p >= 1 ? 1 : 0)}>
          <path d="M-170,-50 L170,-50" {...line} />
          {[...Array(11)].map((_, i) => <path key={i} d={`M${-150 + i * 30},-44 L${-150 + i * 30},-6`} {...line} strokeWidth={lw * 0.6} />)}
          <path d="M-36,-672 L36,-672" {...line} strokeWidth={lw * 0.7} />
        </g>
        <path d={d} {...line} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        {sq > 0 && u < 0.2 && [1, -1].map((side) => {
          const ex = side * (sideX(-155) * pinchAt(-155, sq) + 48 + (1 - sq) * 80);
          return (
            <g key={side} opacity={1 - u * 5}>
              <path d={`M${ex + side * 150},-205 L${ex},-205 Q${ex - side * 50},-205 ${ex - side * 50},-155 Q${ex - side * 50},-105 ${ex},-105 L${ex + side * 150},-105`} {...line} fill="#d6bfa1" />
              <path d={`M${ex - side * 6},-182 Q${ex - side * 30},-180 ${ex - side * 30},-155 Q${ex - side * 30},-130 ${ex - side * 6},-128`} {...line} strokeWidth={lw * 0.55} />
              {[-1, 1].map((k) => <path key={k} d={`M${ex - side * 20},${-155 + k * 75} l${-side * 34},${k * 26}`} {...line} strokeWidth={lw * 0.6} opacity={sq} />)}
            </g>
          );
        })}
        {/* the mummy case's face and bands, once it has become one */}
        {u > 0.6 && (
          <g opacity={(u - 0.6) / 0.4}>
            <ellipse cx={0} cy={-655} rx={46} ry={58} {...line} />
            <path d="M-120,-480 Q0,-440 120,-480" {...line} />
            <path d="M-110,-300 Q0,-270 110,-300" {...line} />
            <path d="M-80,-130 Q0,-110 80,-130" {...line} />
          </g>
        )}
        {capAt !== undefined && fly < 1 && p >= 1 && u === 0 && (
          <g transform={`translate(0 ${-fly * 520}) rotate(${wob + fly * 240} 0 -750)`} opacity={1 - fly}>
            <rect x={-46} y={-800} width={92} height={100} rx={8} {...line} fill="#2e2a24" />
            <clipPath id="t6cap"><rect x={-46} y={-800} width={92} height={100} rx={8} /></clipPath>
            <g clipPath="url(#t6cap)">
              {[...Array(8)].map((_, i) => <path key={i} d={`M${-50 + i * 16 + ribShift},-790 L${-50 + i * 16 + ribShift},-710`} {...line} strokeWidth={lw * 0.5} />)}
            </g>
          </g>
        )}
        {capAt === undefined && (
          <g opacity={(1 - u) * (p >= 1 ? 1 : 0)}>
            <rect x={-46} y={-800} width={92} height={100} rx={8} {...line} fill="#2e2a24" />
            {[...Array(5)].map((_, i) => <path key={i} d={`M${-30 + i * 15},-790 L${-30 + i * 15},-710`} {...line} strokeWidth={lw * 0.5} />)}
          </g>
        )}
      </g>
    </svg>
  );
};
/** Screen position of the nozzle for a tube at (x, y), scale s, rotation rot (degrees). */
const nozzle = (x: number, y: number, s: number, rot: number): P => {
  const r = (rot * Math.PI) / 180;
  return [x + 700 * s * Math.sin(r), y - 700 * s * Math.cos(r)];
};

/** A ribbon of paint from the nozzle onto the palette, coiling as it lands. */
const Ribbon: React.FC<{from: P; a: number; b: number; out?: [number, number]}> = ({from, a, b, out}) => {
  const g = useGFrame();
  if (g < a) return null;
  const p = interpolate(g, [a, b], [0, 1], clamp);
  const o = out ? interpolate(g, out, [1, 0], clamp) : 1;
  const [nx, ny] = from;
  const coil: P[] = [...Array(14)].map((_, i) => {
    const t = i / 13;
    const ang = Math.PI * 0.9 + t * Math.PI * 3.2;
    const r = 70 * (1 - t * 0.75);
    return [690 + Math.cos(ang) * r, 985 + Math.sin(ang) * r * 0.45 - t * 22];
  });
  const pts: P[] = [[nx, ny], [nx + 45, ny + 8], [nx + 70, ny + 70], [nx + 62, ny + 170], [nx + 20, ny + 260], [nx - 40, ny + 320], ...coil];
  const d = smoothPath(resample(pts, 80));
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, opacity: o}} width={1080} height={1920}>
      <path d={d} fill="none" stroke="#3e2414" strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={d} fill="none" stroke={BROWN} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={d} fill="none" stroke="#b07a4e" strokeWidth={9} strokeLinecap="round" opacity={0.55} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform="translate(-6 -9)" />
    </svg>
  );
};

/** The painter's palette, with a few other colours already on it. */
const Palette: React.FC<{at: number; out?: [number, number]}> = ({at, out}) => {
  const g = useGFrame();
  if (g < at) return null;
  const o = (out ? interpolate(g, out, [1, 0], clamp) : 1) * interpolate(g, [at, at + 6], [0, 1], clamp);
  const pts: P[] = [...Array(24)].map((_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = 1 + (random(`pal${i}`) - 0.5) * 0.06;
    return [640 + Math.cos(a) * 320 * r, 1000 + Math.sin(a) * 125 * r];
  });
  const dabs: [number, number, string][] = [[430, 990, '#e8e0cf'], [500, 935, '#c9a34a'], [585, 1050, '#7a2a1e'], [850, 1040, '#2c3a4a']];
  return (
    <div style={{opacity: o}}>
      <Sketch pts={pts} x={0} y={0} at={at} dur={10} width={6} closed fill="#4b3a28" fillOpacity={0.55} color="#c9b48a" />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
        <ellipse cx={370} cy={1010} rx={34} ry={22} fill="#0d0c09" stroke="#c9b48a" strokeWidth={4} />
        {dabs.map(([x, y, c], i) => <ellipse key={i} cx={x} cy={y} rx={34} ry={17} fill={c} opacity={0.9} />)}
      </svg>
    </div>
  );
};

// ---------- scene pieces ----------
const Desk: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill><DarkPaper />{children}</AbsoluteFill>;

/** A brown glaze laid into the shadows of the portrait, with the brush at the tip of the stroke. */
const Glaze: React.FC<{pts: P[]; a: number; b: number; width?: number}> = ({pts, a, b, width = 110}) => {
  const g = useGFrame();
  if (g < a) return null;
  const p = interpolate(g, [a, b], [0, 1], clamp);
  const d = smoothPath(resample(pts, 60));
  const [tx, ty] = along(pts, p);
  return (
    <>
    {(['color', 'screen'] as const).map((mode) => (
      <svg key={mode} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: mode}} width={1080} height={1920}>
        <filter id={`glaze${mode}`}><feGaussianBlur stdDeviation={12} /></filter>
        <path d={d} fill="none" stroke={mode === 'color' ? '#b4682e' : '#c07a40'} strokeWidth={mode === 'color' ? width : width * 0.5} strokeLinecap="round" strokeLinejoin="round"
          opacity={mode === 'color' ? 0.95 : 0.25} filter={`url(#glaze${mode})`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
    ))}
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
      {p < 1 && (
        <g transform={`translate(${tx} ${ty}) rotate(-38)`}>
          <ellipse cx={0} cy={-24} rx={20} ry={34} fill={BROWN} />
          <rect x={-15} y={-92} width={30} height={52} fill="#9aa3a6" stroke="#0d0c09" strokeWidth={3} />
          <path d="M0,-92 L0,-380" stroke="#c9a34a" strokeWidth={18} strokeLinecap="round" />
        </g>
      )}
    </svg>
    </>
  );
};

/** Six browns that all look alike, each with a hopeful label. */
const BROWNS: [string, string][] = [['#5c3b26', 'umber?'], ['#5f3d27', 'sepia?'], ['#593824', 'bitumen?'], ['#61402a', 'Vandyke?'], ['#5d3c25', 'sienna?'], ['#5e3c26', 'mummy?']];
const Swatches: React.FC<{at: number; circleAt: number}> = ({at, circleAt}) => {
  const g = useGFrame();
  const boil = Math.floor(g / 5);
  return (
    <>
      {BROWNS.map(([c, name], i) => {
        const cx = i % 2 ? 760 : 300, cy = 520 + Math.floor(i / 2) * 220;
        const t0 = at + i * 3;
        if (g < t0) return null;
        const k = interpolate(g, [t0, t0 + 4], [0.6, 1], clamp);
        const pts: P[] = [...Array(16)].map((_, j) => {
          const a = (j / 16) * Math.PI * 2;
          const r = 82 * (1 + (random(`sw${i}${j}`) - 0.5) * 0.28) + (random(`sb${i}${j}${boil}`) - 0.5) * 3;
          return [cx + Math.cos(a) * r * 1.25, cy + Math.sin(a) * r * 0.8];
        });
        return (
          <React.Fragment key={i}>
            <svg style={{position: 'absolute', left: 0, top: 0, transform: `scale(${k})`, transformOrigin: `${cx}px ${cy}px`}} width={1080} height={1920}>
              <path d={smoothPath(pts, true)} fill={c} />
              <path d={smoothPath(pts.map(([x, y]): P => [x - 18, y - 16]).slice(2, 6))} fill="none" stroke="#9a6a44" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
            </svg>
            <Note text={name} x={cx - 70} y={cy + 66} size={44} rot={-3} at={t0 + 2} color="#ffffff" />
          </React.Fragment>
        );
      })}
      <Loop cx={760} cy={520 + 2 * 220 + 10} rx={175} ry={120} at={circleAt} seed={61} color={CORAL} width={8} />
    </>
  );
};

/** The tube on Sunday: picked up from the table, dropped in a hole, covered over, with a daisy on top. */
const Burial: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const grab = t.at('grabbed');
  const bur = t.at('buried');
  const gar = t.at('garden');
  const daisy = gar + 10;
  const drop = ease(interpolate(g, [bur, bur + 10], [0, 1], clamp));
  const n = Math.floor(interpolate(g, [daisy + 8, daisy + 18], [0, 12], clamp));
  const cx = 575, cy = 905;
  const cup: P[] = [[150, 560], [160, 640], [190, 660], [270, 660], [300, 640], [310, 560]];
  return (
    <>
      <Sketch pts={cup} x={0} y={0} at={t.at('Sunday')} dur={8} width={6} />
      <Sketch pts={[[310, 580], [345, 585], [345, 625], [302, 630]]} x={0} y={0} at={t.at('Sunday') + 4} dur={6} width={5} />
      <Sketch pts={[[110, 668], [350, 668]]} x={0} y={0} at={t.at('Sunday') + 6} dur={6} width={6} />
      <Sketch pts={[[70, 700], [1010, 700]]} x={0} y={0} at={t.at('Sunday')} dur={10} width={5} color="#EDE7DC" />
      <Tube x={430 + drop * 15} y={600 + drop * 395} s={0.36} rot={90} at={grab} dur={8} />
      <Sketch pts={[[80, 920], [425, 920], [460, 935], [1000, 930]]} x={0} y={0} at={bur - 6} dur={10} width={6} color="#EDE7DC" />
      <Sketch pts={[[425, 920], [435, 1020], [720, 1025], [735, 930]]} x={0} y={0} at={bur - 2} dur={8} width={5} color="#EDE7DC" />
      {g >= gar && <Sketch pts={[[425, 925], [520, 896], [640, 898], [735, 928]]} x={0} y={0} at={gar} dur={8} width={9} fill="#5a3c26" fillOpacity={0.9} color="#8a5a3a" closed />}
      <Note text="a proper burial." x={290} y={1060} size={66} rot={-3} at={gar} color={pal.subject} />
      {g >= daisy && (
        <>
          <Sketch pts={[[cx, cy], [cx - 6, cy - 70], [cx + 4, cy - 150]]} x={0} y={0} at={daisy} dur={8} width={6} />
          <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
            {[...Array(n)].map((_, i) => {
              const ang = (i / 12) * Math.PI * 2;
              const px = cx + 4 + Math.cos(ang) * 30, py = cy - 150 + Math.sin(ang) * 30;
              return <ellipse key={i} cx={px} cy={py} rx={22} ry={9} transform={`rotate(${(ang * 180) / Math.PI} ${px} ${py})`} fill="#f4efe6" />;
            })}
            {n >= 12 && <circle cx={cx + 4} cy={cy - 150} r={16} fill="#FF9F1C" />}
          </svg>
        </>
      )}
    </>
  );
};

/** The London shop's shelf: five tubes, gone one by one. */
const Shelf: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('One London');
  const gone = t.at('Then they');
  const xs = [175, 345, 515, 685, 855];
  return (
    <>
      <Sketch pts={[[70, 905], [1010, 905]]} x={0} y={0} at={a} dur={8} width={7} color="#EDE7DC" />
      <Sketch pts={[[110, 905], [110, 975], [170, 905]]} x={0} y={0} at={a + 4} dur={6} width={5} color="#EDE7DC" smooth={false} />
      <Sketch pts={[[970, 905], [970, 975], [910, 905]]} x={0} y={0} at={a + 4} dur={6} width={5} color="#EDE7DC" smooth={false} />
      {xs.map((x, i) => <Tube key={i} x={x} y={900} s={0.3} at={a + 4 + i * 3} dur={8} labelAt={a + 8 + i * 3} textAt={a + 10 + i * 3} popOut={gone + (4 - i) * 4} />)}
    </>
  );
};

// ---------- the Short ----------
const Body: React.FC = () => {
  const f = useCurrentFrame();
  const t = makeTimeline(N, FPS);
  const at = t.at;
  const inIt = at('in it', 2);
  const lastE = Math.round(N.words[N.words.length - 1].e * FPS);
  const outroAt = lastE + 12;
  // opening walk, then the closing walk
  const camOpen = interpolate(f, [12, inIt + 4], [0, 3950], {...clamp, easing: ease});
  const camEnd = interpolate(f, [at('So next') - 1, at('look closely')], [2500, 3880], {...clamp, easing: ease}) + interpolate(f, [at('look closely'), outroAt + 60], [0, 90], clamp);
  const tubeX = 170, tubeY = 735, tubeS = 0.9, tubeR = 80;
  const morph: [number, number] = [at('Egyptian'), at('Egyptian') + 18];
  const hero = heroOnScreen(3880);
  const cuts: [number, React.ReactNode][] = [
    [0, (
      <AbsoluteFill>
        <Corridor cam={camOpen} warm={interpolate(useGFrame(), [at('person'), at('person') + 24], [0, 1], clamp)} />
        <Loop cx={540} cy={heroOnScreen(3950).cy} rx={470} ry={560} at={inIt} dur={14} seed={91} width={7} />
        <VTag text="The Met (illustrative: none of these is known to contain mummy brown)" />
      </AbsoluteFill>
    )],
    [at('For centuries') - 1, (
      <Desk>
        <Highlight text="MUMMY BROWN" x={60} y={180} size={120} at={at('mummy brown')} seed={41} rot={-2} />
        <Palette at={at('For centuries') + 8} out={morph} />
        <Tube x={tubeX} y={tubeY} s={tubeS} rot={tubeR} at={at('For centuries')} labelAt={at('For centuries') + 12} textAt={at('mummy brown')}
          capAt={at('It was made')} sqAt={at('exactly')} morph={morph} to={{x: 540, y: 1100, s: 0.85, rot: 0}} />
        <Ribbon from={nozzle(tubeX, tubeY, tubeS, tubeR)} a={at('exactly') + 2} b={at('Egyptian') - 4} out={morph} />
        <Note text="ground-up Egyptian mummies" x={70} y={340} size={60} rot={-3} at={at('groundup')} color={CORAL} />
      </Desk>
    )],
    [at('Painters') - 1, (
      <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
        <Img src={staticFile(G(2))} style={{position: 'absolute', left: -263, top: 0, width: 1607, height: 1920, filter: 'grayscale(1) contrast(1.1) brightness(0.95)',
          transform: `scale(${interpolate(f, [at('Painters'), at('One English')], [1, 1.06], clamp)})`, transformOrigin: '490px 640px'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.5) 0%, rgba(8,7,5,0) 20%, rgba(8,7,5,0) 52%, rgba(8,7,5,0.7) 72%)'}} />
        <Glaze pts={[[90, 330], [250, 290], [330, 450], [250, 620], [120, 770], [200, 940]]} a={at('Painters')} b={at('shadows')} width={170} />
        <Glaze pts={[[760, 300], [950, 360], [1000, 560], [860, 700]]} a={at('shadows')} b={at('shadows') + 12} width={150} />
        <Highlight text="SHADOWS" x={390} y={170} size={100} at={at('shadows')} seed={42} rot={-3} />
        <Note text="what's in the tube?" x={300} y={1030} size={58} rot={-3} at={at('Most never')} color={CORAL} />
        <Arrow x1={390} y1={1020} x2={240} y2={890} bow={-40} width={7} at={at('Most never') + 6} />
        <VTag text="John Constable, Mrs. James Pulham Sr. · The Met (illustrative)" />
      </AbsoluteFill>
    )],
    [at('One English') - 1, (
      <Desk>
        <Note text="one English painter" x={70} y={200} size={66} rot={-3} at={at('One English')} color="#ffffff" />
        <Note text="found out over Sunday lunch" x={90} y={310} size={54} rot={-3} at={at('Sunday')} />
        <Burial t={t} />
        <VTag text="Edward Burne-Jones, 1881 · Georgiana Burne-Jones, Memorials (1904)" />
      </Desk>
    )],
    [at('One London') - 1, (
      <Desk>
        <Note text="one London paint shop" x={70} y={200} size={64} rot={-3} at={at('One London')} color="#ffffff" />
        <Stamp text="1960s" x={600} y={330} at={at('1960s')} size={130} color="#f4efe6" rot={-5} />
        <Shelf t={t} />
        <Stamp text="OUT OF MUMMIES" x={70} y={1010} at={at('of mummies')} size={96} color={CORAL} rot={-4} />
        <VTag text="C. Roberson & Co., London · Time magazine, 1964" />
      </Desk>
    )],
    [at('And artists') - 1, (
      <Desk>
        <Note text="which brown?" x={70} y={190} size={78} rot={-3} at={at('which brown')} color="#ffffff" />
        <Note text="(rarely written down)" x={90} y={300} size={50} rot={-3} at={at('rarely')} />
        <Swatches at={at('And artists')} circleAt={at('which brown') + 6} />
      </Desk>
    )],
    [at('So next') - 1, (
      <AbsoluteFill>
        <Corridor cam={camEnd} warm={1} />
        <Loop cx={hero.cx + 205 * hero.s} cy={hero.cy - 235 * hero.s} rx={120} ry={165} at={at('shadows', 2)} dur={14} seed={93} color={CORAL} width={8} />
        <Note text="hi." x={150} y={420} size={110} rot={-7} at={at('say hi')} color={CORAL} />
        <VTag text="Sir Henry Raeburn, William Forsyth · The Met (illustrative)" />
      </AbsoluteFill>
    )],
  ];
  const scene = useScene(cuts.map(([fr, node], i): [number, React.ReactNode] => [fr, <React.Fragment key={i}>{node}</React.Fragment>]));
  const payoff = at('say hi') / FPS;
  const total = t.frames + OUTRO;
  return (
    <>
      {scene}
      <Outro at={outroAt} />
      <Cover6 />
      <Captions n={N} until={outroAt} />
      <Mark />
      <Finish vignette={0.25} />
      <Audio src={staticFile('audio/short6_mummy_brown.wav')} />
      <Audio src={staticFile('music/m_reveal.mp3')} startFrom={Math.max(0, Math.round((ACCENT - payoff) * FPS))}
        volume={(fr) => interpolate(fr, [0, 8, total - 50, total - 10], [0, 0.2, 0.2, 0], clamp)} />
      {cuts.slice(1).map(([fr], i) => <Sfx key={i} at={fr} src="sfx/whoosh.wav" volume={0.28} />)}
      {['One English', 'Sunday', 'One London', 'which brown', 'rarely', 'Most never', 'groundup', 'say hi'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {[at('mummy brown'), at('1960s'), at('of mummies'), at('shadows')].map((fr, i) => <Sfx key={`s${i}`} at={fr} src="sfx/stamp.wav" volume={0.28} />)}
      <Sfx at={at('It was made') + 12} src="sfx/tick.wav" volume={0.5} />
      <Sfx at={at('buried') + 10} src="sfx/knock.wav" volume={0.3} />
      <Sfx at={outroAt} src="sfx/stamp.wav" volume={0.3} />
    </>
  );
};

/** The hook cover: fully drawn on frame 0 (the corridor behind it), faded by frame 45. */
const Cover6: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= 45) return null;
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [28, 45], [1, 0], clamp)}}>
      <Highlight text="THERE MAY BE" x={50} y={170} size={104} at={-40} seed={200} rot={-3} />
      <Highlight text="A PERSON IN" x={60} y={1120} size={104} at={-40} seed={201} rot={-2} />
      <Highlight text="THIS PAINTING" x={80} y={1265} size={92} at={-40} seed={202} rot={-3} />
      <Arrow x1={760} y1={1100} x2={612} y2={930} bow={-50} width={9} at={-40} color={CORAL} />
    </AbsoluteFill>
  );
};

/** After the last line: the full video's title over the dimmed corridor, and a subscribe arrow at YouTube's button. */
const Outro: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < at) return null;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(8,7,5,0.72)', opacity: interpolate(f, [at, at + 8], [0, 1], clamp)}} />
      <Note text="the full story:" x={100} y={300} size={72} rot={-3} at={at} color="#ffffff" />
      <Highlight text="WHEN EUROPE" x={80} y={430} size={130} at={at + 3} seed={301} rot={-3} />
      <Highlight text="ATE MUMMIES" x={110} y={610} size={130} at={at + 6} seed={302} rot={-2} />
      <Note text="on the channel" x={130} y={830} size={78} rot={-3} at={at + 10} color={pal.subject} />
      <Note text="subscribe" x={180} y={1100} size={78} rot={-4} at={at + 18} />
      <Arrow x1={400} y1={1200} x2={560} y2={1430} bow={40} width={8} at={at + 22} dur={8} />
    </AbsoluteFill>
  );
};

export const SHORT6_FRAMES = Math.ceil(N.duration * FPS) + OUTRO;
export const Short6: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
        <Body />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
