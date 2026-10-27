// Quiet chapter (1974 poisoning, the stranger-candy myth): two beats, teal only, no coral.
//
// XRayScan (~10 s), for "Hospitals offered to X-ray kids' candy." Keys (frames from the scene's start):
//   'title'   bone-tape title FREE CANDY X-RAYS
//   'bag'     the paper treat bag slides onto the desk
//   'scanner' teal viewfinder corners of the scanner bed draw on
//   'sweep'   the scan line starts; it crosses the bed in SWEEP_DUR frames, and behind it the bag is an X-ray
//   'note'    handwritten "nothing sharp inside" with an arrow at the candy
//
// Tally (~15 s), for "One sociologist has tracked newspaper reports ... candy from a stranger." Keys:
//   'title'   bone-tape title REPORTED POISONED TREATS
//   'axis'    the 1958-2025 year axis draws on
//   'dots'    one dot per report stacks up year by year (DOTS_DUR frames for the whole axis); the counter climbs with them
//   'counter' handwritten "about 130 reports" under the counter
//   'grey'    most dots fade to grey, left to right, with the note "hoaxes, or a pin found before anyone was hurt"
//   'zero'    the chart dims and KILLED BY A STRANGER'S CANDY: 0 stamps in (teal)
//
// Data: Joel Best, "Halloween Sadism: The Evidence" (rev. 2025), table "Reported incidents of Halloween sadism in
// U.S. and Canada by year", read from https://udspace.udel.edu/bitstreams/9443db0d-cf0e-4476-b12e-953645b876d7/download
// (1958-2025, 134 reports; the highest years are 1971 with 14, 1982 with 12 and 1970 with 10).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Arrow, Finish, Highlight, JF, Note, PaletteCtx, PALETTES, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper} from '../kit/common';

type At = (key: string) => number;
const CREAM = '#f4efe6';
const easeOut = Easing.out(Easing.cubic);

// ───────────────────────────── A · X-ray scan ─────────────────────────────

export const XRAY_TIMES: Record<string, number> = {title: 4, bag: 8, scanner: 30, sweep: 58, note: 178};
export const XRAY_FRAMES = 300;
const SWEEP_DUR = 96;

/** The bag image (1260 x 1441) on screen. */
const BAG = {w: 1260, h: 1441, s: 0.46, left: 478, top: 300};
/** The scanner bed (screen px). */
const BED = {x0: 400, y0: 252, x1: 1130, y1: 975};

type Candy =
  | {k: 'taffy'; x: number; y: number; w: number; h: number; r: number}
  | {k: 'ball'; x: number; y: number; r: number}
  | {k: 'bar'; x: number; y: number; w: number; h: number; r: number}
  | {k: 'pop'; x: number; y: number; r: number; len: number; rot: number};

/** Wrapped candy settled in the bottom of the bag, in bag-image pixels. */
const CANDY: Candy[] = [
  {k: 'pop', x: 330, y: 880, r: 62, len: 190, rot: -25},
  {k: 'taffy', x: 430, y: 1000, w: 160, h: 88, r: 15},
  {k: 'ball', x: 600, y: 965, r: 60},
  {k: 'bar', x: 250, y: 1040, w: 230, h: 82, r: -35},
  {k: 'pop', x: 700, y: 1060, r: 70, len: 200, rot: 30},
  {k: 'taffy', x: 510, y: 1135, w: 165, h: 95, r: -20},
  {k: 'ball', x: 330, y: 1160, r: 66},
  {k: 'taffy', x: 175, y: 1190, w: 125, h: 76, r: 70},
  {k: 'taffy', x: 790, y: 1190, w: 140, h: 84, r: 25},
  {k: 'bar', x: 620, y: 1260, w: 260, h: 90, r: 8},
  {k: 'taffy', x: 270, y: 1275, w: 150, h: 90, r: -10},
  {k: 'ball', x: 440, y: 1290, r: 62},
];

const GLOW = '#cfeffd';

/** One candy as a soft X-ray silhouette: dense core, faint wrapper, glowing edge. */
const CandyShape: React.FC<{c: Candy; i: number}> = ({c, i}) => {
  const edge = {stroke: GLOW, strokeWidth: 3.5, strokeOpacity: 0.75, strokeLinejoin: 'round' as const};
  if (c.k === 'taffy') {
    const {w, h} = c;
    const end = (s: number) =>
      `M${s * w * 0.27},${-h * 0.2} L${s * w * 0.5},${-h * 0.48} L${s * w * 0.44},${-h * 0.05} L${s * w * 0.5},${h * 0.46} L${s * w * 0.27},${h * 0.2} Z`;
    return (
      <g transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
        <path d={end(1)} fill="url(#xrWrap)" {...edge} strokeOpacity={0.45} />
        <path d={end(-1)} fill="url(#xrWrap)" {...edge} strokeOpacity={0.45} />
        <rect x={-w * 0.3} y={-h / 2} width={w * 0.6} height={h} rx={h * 0.38} fill="url(#xrCore)" {...edge} />
      </g>
    );
  }
  if (c.k === 'ball') {
    // foil: a crinkled outline
    const pts = Array.from({length: 22}, (_, j) => {
      const a = (j / 22) * Math.PI * 2;
      const rr = c.r * (0.9 + random(`ball${i}-${j}`) * 0.16);
      return `${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`;
    });
    return (
      <g transform={`translate(${c.x} ${c.y})`}>
        <polygon points={pts.join(' ')} fill="url(#xrCore)" {...edge} />
        <path d={`M${c.r * 0.7},${-c.r * 0.6} l${c.r * 0.35},${-c.r * 0.35} l${c.r * 0.05},${c.r * 0.4} Z`} fill="url(#xrWrap)" {...edge} strokeOpacity={0.4} />
      </g>
    );
  }
  if (c.k === 'bar') {
    const {w, h} = c;
    const crimp = (s: number) => {
      const x0 = s * w * 0.4;
      const x1 = s * w * 0.5;
      return `M${x0},${-h / 2} L${x1},${-h / 2} L${x1 - s * 8},${-h / 4} L${x1},0 L${x1 - s * 8},${h / 4} L${x1},${h / 2} L${x0},${h / 2} Z`;
    };
    return (
      <g transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
        <path d={crimp(1)} fill="url(#xrWrap)" {...edge} strokeOpacity={0.4} />
        <path d={crimp(-1)} fill="url(#xrWrap)" {...edge} strokeOpacity={0.4} />
        <rect x={-w * 0.4} y={-h / 2} width={w * 0.8} height={h} rx={10} fill="url(#xrCore)" {...edge} />
        {[-0.2, 0, 0.2].map((f) => <line key={f} x1={w * f} y1={-h / 2 + 8} x2={w * f} y2={h / 2 - 8} stroke={GLOW} strokeOpacity={0.25} strokeWidth={3} />)}
      </g>
    );
  }
  // lollipop: dense round head, faint paper stick ending in a blunt round tip
  return (
    <g transform={`translate(${c.x} ${c.y}) rotate(${c.rot})`}>
      <rect x={-7} y={c.r * 0.6} width={14} height={c.len} rx={7} fill="url(#xrWrap)" {...edge} strokeOpacity={0.35} strokeWidth={2.5} />
      <circle r={c.r} fill="url(#xrCore)" {...edge} />
      <circle r={c.r * 0.55} fill="none" stroke={GLOW} strokeOpacity={0.2} strokeWidth={3} />
    </g>
  );
};

const XRayCandy: React.FC = () => (
  <svg width={BAG.w} height={BAG.h} viewBox={`0 0 ${BAG.w} ${BAG.h}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', mixBlendMode: 'screen'}}>
    <defs>
      <radialGradient id="xrCore" cx="45%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#bfe6f7" stopOpacity={0.62} />
        <stop offset="70%" stopColor="#7fbfdc" stopOpacity={0.42} />
        <stop offset="100%" stopColor="#bfe6f7" stopOpacity={0.55} />
      </radialGradient>
      <radialGradient id="xrWrap" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#9fd3ea" stopOpacity={0.22} />
        <stop offset="100%" stopColor="#9fd3ea" stopOpacity={0.1} />
      </radialGradient>
      <filter id="xrSoft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="b" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="g" />
        <feMerge><feMergeNode in="g" /><feMergeNode in="b" /></feMerge>
      </filter>
    </defs>
    <g filter="url(#xrSoft)">{CANDY.map((c, i) => <CandyShape key={i} c={c} i={i} />)}</g>
  </svg>
);

/** Corner brackets of the scanner bed, drawn on. */
const Corners: React.FC<{at: number}> = ({at}) => {
  const g = useGFrame();
  const pal = usePal();
  const p = interpolate(g, [at, at + 10], [0, 1], clamp);
  if (p <= 0) return null;
  const L = 70;
  const {x0, y0, x1, y1} = BED;
  const c = [
    `M${x0},${y0 + L} L${x0},${y0} L${x0 + L},${y0}`,
    `M${x1 - L},${y0} L${x1},${y0} L${x1},${y0 + L}`,
    `M${x1},${y1 - L} L${x1},${y1} L${x1 - L},${y1}`,
    `M${x0 + L},${y1} L${x0},${y1} L${x0},${y1 - L}`,
  ];
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      {c.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={pal.mark} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={`translate(${(random(`cj${i}`) - 0.5) * 6} ${(random(`ck${i}`) - 0.5) * 6})`} />
      ))}
      <text x={x0 + 22} y={y0 + 36} fill={pal.mark} opacity={p} fontFamily={JF.mono} fontSize={20} letterSpacing={3}>X-RAY</text>
    </svg>
  );
};

export const XRayScan: React.FC<{at: At}> = ({at}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const pal = usePal();
  const bagX = interpolate(g, [at('bag'), at('bag') + 15], [-1050, 0], {...clamp, easing: easeOut});
  const sw = at('sweep');
  const sp = interpolate(g, [sw, sw + SWEEP_DUR], [0, 1], clamp);
  const lineX = BED.x0 + (BED.x1 - BED.x0) * sp;
  const lineOn = g >= sw && g < sw + SWEEP_DUR + 8;
  const lineFade = interpolate(g, [sw, sw + 3, sw + SWEEP_DUR, sw + SWEEP_DUR + 8], [0, 1, 1, 0], clamp);
  // the X-ray layer shows to the left of the scan line (all of it once the sweep is done)
  const clip = `inset(0px ${1920 - (g >= sw ? lineX : BED.x0)}px 0px 0px)`;
  const push = interpolate(f, [0, XRAY_FRAMES], [1, 1.035]);
  const flicker = 0.9 + 0.1 * random(`fl${Math.floor(g)}`);
  const bag: React.CSSProperties = {position: 'absolute', left: BAG.left + bagX, top: BAG.top, width: BAG.w * BAG.s, height: BAG.h * BAG.s};
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '765px 620px'}}>
        {/* the paper bag, as photographed (B&W) */}
        <Img src={staticFile('img/props/treat_bag.webp')} style={{...bag, filter: 'grayscale(1) contrast(1.15) brightness(0.92) drop-shadow(0 26px 30px rgba(0,0,0,0.65))'}} />
        {/* the X-ray view behind the scan line */}
        <AbsoluteFill style={{clipPath: clip}}>
          <div style={{position: 'absolute', left: BED.x0, top: BED.y0, width: BED.x1 - BED.x0, height: BED.y1 - BED.y0,
            background: 'radial-gradient(ellipse at 50% 55%, #0c1a26 0%, #070e16 65%, #04080d 100%)', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)'}}>
            <div style={{position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: 'linear-gradient(rgba(150,220,255,0.35) 1px, transparent 1px)', backgroundSize: '100% 5px'}} />
          </div>
          <div style={{...bag, opacity: flicker}}>
            <Img src={staticFile('img/fx/treat_bag_xray.webp')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
            <XRayCandy />
          </div>
        </AbsoluteFill>
        {/* scan line */}
        {lineOn && (
          <div style={{position: 'absolute', left: lineX - 2, top: BED.y0 - 10, width: 4, height: BED.y1 - BED.y0 + 20, opacity: lineFade}}>
            <div style={{position: 'absolute', right: 2, top: 0, width: 110, height: '100%', background: `linear-gradient(90deg, transparent, ${pal.mark}33)`}} />
            <div style={{position: 'absolute', inset: 0, background: '#dffff9', boxShadow: `0 0 14px 4px ${pal.mark}, 0 0 46px 12px ${pal.mark}88`}} />
          </div>
        )}
        <Corners at={at('scanner')} />
      </AbsoluteFill>
      <Highlight text="FREE CANDY X-RAYS" x={120} y={92} size={84} at={at('title')} rot={-2} seed={7} />
      <Note text="nothing sharp inside" x={1180} y={470} size={46} rot={-4} at={at('note')} dur={14} />
      <Arrow x1={1240} y1={590} x2={880} y2={800} bow={-40} at={at('note') + 12} dur={8} />
      <Tag text="Illustration · X-ray view drawn for this video" />
    </AbsoluteFill>
  );
};

// ───────────────────────────── B · The tally ─────────────────────────────

export const TALLY_TIMES: Record<string, number> = {title: 4, axis: 10, dots: 40, counter: 168, grey: 262, zero: 368};
export const TALLY_FRAMES = 450;
const DOTS_DUR = 120;

/** Reports per year, 1958-2025 (Joel Best, Halloween Sadism: The Evidence, rev. 2025). Sums to 134. */
const COUNTS = [
  0, 1, 0, 0, 1, 1, 3, 1, 5, 4, 3, 7, 10, 14, 1, 4, 1, 2, 2, 0, // 1958-1977
  1, 3, 0, 0, 12, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, // 1978-1997
  2, 0, 2, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 3, 3, 0, // 1998-2017
  8, 4, 1, 3, 6, 5, 1, 8, // 2018-2025
];
const Y0 = 1958;
const TOTAL = COUNTS.reduce((a, b) => a + b, 0);
const AX = {x0: 176, x1: 1744, base: 640};
const DX = (AX.x1 - AX.x0) / (COUNTS.length - 1);
const DOT = 8.5;
const STEP = 19.5;
const GREY = '#77726a';
const colX = (i: number) => AX.x0 + i * DX;
/** Frame (from 'dots') at which year i's k-th dot appears. */
const dotAt = (i: number, k: number) => (i / (COUNTS.length - 1)) * (DOTS_DUR - 14) + k;
/** A few dots stay teal (the minor, unexplained cases); most go grey. */
const staysTeal = (i: number, k: number) => random(`keep${i}-${k}`) < 0.1;

const Counter: React.FC<{n: number; show: number}> = ({n, show}) => (
  <div style={{position: 'absolute', right: 130, top: 64, textAlign: 'right', opacity: show}}>
    <div style={{fontFamily: JF.display, fontSize: 150, lineHeight: 1, color: CREAM, textShadow: '0 6px 22px rgba(0,0,0,0.8)', fontVariantNumeric: 'tabular-nums'}}>{n}</div>
    <div style={{fontFamily: JF.mono, fontSize: 20, letterSpacing: 3, color: 'rgba(244,239,230,0.75)', marginTop: 4}}>REPORTS SINCE 1958</div>
  </div>
);

/** Rubber-stamp line: KILLED BY A STRANGER'S CANDY: 0 */
const ZeroStamp: React.FC<{at: number}> = ({at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.45, 0.96, 1], clamp);
  const o = interpolate(g, [at, at + 2.5], [0.5, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 960, top: 845, transform: `translate(-50%, -50%) rotate(-2.5deg) scale(${k})`, opacity: o}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 34, padding: '10px 40px 12px', border: `6px solid ${pal.mark}`, outline: `2px solid ${pal.mark}`, outlineOffset: 6,
        color: pal.mark, whiteSpace: 'nowrap', background: 'rgba(8,10,9,0.55)', boxShadow: '0 10px 40px rgba(0,0,0,0.7)'}}>
        <div style={{fontFamily: JF.display, fontSize: 60, lineHeight: 1.1, letterSpacing: 1}}>KILLED BY A STRANGER'S CANDY:</div>
        <div style={{fontFamily: JF.display, fontSize: 150, lineHeight: 1}}>0</div>
      </div>
    </div>
  );
};

export const Tally: React.FC<{at: At}> = ({at}) => {
  const g = useGFrame();
  const pal = usePal();
  const d0 = at('dots');
  const gr = at('grey');
  const z = at('zero');
  const axisP = interpolate(g, [at('axis'), at('axis') + 14], [0, 1], clamp);
  const dim = interpolate(g, [z, z + 5], [1, 0.42], clamp);
  let shown = 0;
  const dots: React.ReactNode[] = [];
  COUNTS.forEach((n, i) => {
    for (let k = 0; k < n; k++) {
      const t = d0 + dotAt(i, k);
      if (g < t) continue;
      shown++;
      const s = interpolate(g, [t, t + 2.5, t + 5], [1.6, 0.9, 1], clamp);
      const gt = gr + (i / (COUNTS.length - 1)) * 36 + random(`gd${i}-${k}`) * 4;
      const grey = staysTeal(i, k) ? 0 : interpolate(g, [gt, gt + 5], [0, 1], clamp);
      const cx = colX(i) + (random(`jx${i}-${k}`) - 0.5) * 2.5;
      const cy = AX.base - 14 - k * STEP;
      dots.push(
        <g key={`${i}-${k}`} transform={`translate(${cx} ${cy}) scale(${s})`}>
          <circle r={DOT} fill={pal.mark} opacity={1 - grey} />
          <circle r={DOT} fill={GREY} opacity={grey} />
        </g>,
      );
    }
  });
  const ticks = [1958, 1970, 1980, 1990, 2000, 2010, 2025];
  const show = interpolate(g, [d0, d0 + 4], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{opacity: dim}}>
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          <line x1={AX.x0 - 24} y1={AX.base} x2={AX.x1 + 24} y2={AX.base} stroke={pal.mark} strokeWidth={4} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - axisP} />
          {ticks.map((y, j) => {
            const x = colX(y - Y0);
            const o = interpolate(g, [at('axis') + 2 + j * 2, at('axis') + 5 + j * 2], [0, 1], clamp);
            return (
              <g key={y} opacity={o}>
                <line x1={x} y1={AX.base + 2} x2={x} y2={AX.base + 16} stroke={pal.mark} strokeWidth={3} />
                <text x={x} y={AX.base + 46} textAnchor="middle" fill={CREAM} fillOpacity={0.85} fontFamily={JF.mono} fontSize={24}>{y}</text>
              </g>
            );
          })}
          {dots}
        </svg>
        <Counter n={shown} show={show} />
        <Note text="about 130 reports" x={1350} y={300} size={44} rot={-3} at={at('counter')} dur={12} />
        <Note text="hoaxes, or a pin found before anyone was hurt" x={200} y={250} size={42} rot={-2} color="#c9c3b8" at={gr + 6} dur={16} />
      </AbsoluteFill>
      <Highlight text="REPORTED POISONED TREATS" x={120} y={92} size={72} at={at('title')} rot={-2} seed={11} />
      <ZeroStamp at={z} />
      <Tag text="Joel Best, Halloween Sadism: The Evidence (rev. 2025)" />
    </AbsoluteFill>
  );
};

// ───────────────────────────── test ─────────────────────────────

export const XRayScan_TEST_FRAMES = XRAY_FRAMES + TALLY_FRAMES;

const Fade: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(f, [0, 8, len - 8, len], [0, 1, 1, 0], clamp)}}>{children}</AbsoluteFill>;
};

export const XRayScanTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.quiet}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#000'}}>
        <Sequence durationInFrames={XRAY_FRAMES}>
          <Fade len={XRAY_FRAMES}><XRayScan at={(k) => XRAY_TIMES[k] ?? 0} /></Fade>
        </Sequence>
        <Sequence from={XRAY_FRAMES} durationInFrames={TALLY_FRAMES}>
          <Fade len={TALLY_FRAMES}><Tally at={(k) => TALLY_TIMES[k] ?? 0} /></Fade>
        </Sequence>
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
