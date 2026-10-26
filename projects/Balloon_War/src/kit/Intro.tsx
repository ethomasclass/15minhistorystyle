// Channel intro: "15 Minute History", then the video's title. A pull-back from one taped-down photo to the notebook
// page with the logo, then the title on orange tape. Graphics step at 12 fps like the rest of the video.
import React from 'react';
import {AbsoluteFill, Audio, Easing, getInputProps, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {boxOf, Finish, Highlight, INK, JF, PALETTES, PaletteCtx, StepCtx, useGFrame, usePal} from './Kit';
import {DarkPaper, Sfx} from './common';
import {DATES, INTRO_CARDS, SUBTITLE, TITLE} from '../project';

export const INTRO_FRAMES = 186;
/** A jingle mockup to audition (render with --props='{"jingle":"music/jingle_A.mp3"}'). */
const JINGLE = (getInputProps() as {jingle?: string}).jingle;

const CARDS = INTRO_CARDS;

const Clock: React.FC<{cx: number; cy: number; r: number; at: number}> = ({cx, cy, r, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const ring = interpolate(g, [at, at + 8], [0, 1], clamp);
  const sweep = interpolate(g, [at + 6, at + 22], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const a = -Math.PI / 2 + sweep * (Math.PI / 2);
  const hx = cx + Math.cos(a) * r * 0.82;
  const hy = cy + Math.sin(a) * r * 0.82;
  // hand-drawn ring
  const pts: string[] = [];
  for (let i = 0; i <= 74; i++) {
    const t = (i / 70) * Math.PI * 2 - Math.PI / 2 - 0.2;
    const w = 1 + (random(`ck${i}`) - 0.5) * 0.02 + (i / 70) * 0.025;
    pts.push(`${(cx + Math.cos(t) * r * w).toFixed(1)},${(cy + Math.sin(t) * r * w).toFixed(1)}`);
  }
  const wedge = sweep > 0 ? `M${cx},${cy} L${cx},${cy - r * 0.92} A${r * 0.92},${r * 0.92} 0 0 1 ${cx + Math.cos(a) * r * 0.92},${cy + Math.sin(a) * r * 0.92} Z` : '';
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      {wedge && <path d={wedge} fill={pal.subject} opacity={0.9} />}
      <polyline points={pts.join(' ')} fill="none" stroke={pal.mark} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} />
      {[0, 1, 2, 3].map((q) => {
        const qa = -Math.PI / 2 + (q * Math.PI) / 2;
        return ring >= 1 ? <line key={q} x1={cx + Math.cos(qa) * r * 0.78} y1={cy + Math.sin(qa) * r * 0.78} x2={cx + Math.cos(qa) * r * 0.95} y2={cy + Math.sin(qa) * r * 0.95} stroke={pal.mark} strokeWidth={8} strokeLinecap="round" /> : null;
      })}
      {ring >= 1 && <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#f4efe6" strokeWidth={9} strokeLinecap="round" />}
      {ring >= 1 && <circle cx={cx} cy={cy} r={12} fill="#f4efe6" />}
    </svg>
  );
};

/** The "15 Minute History" wordmark, animating in from the given frames (also used, fully drawn, on the thumbnail). */
export const Wordmark: React.FC<{clockAt: number; numAt: number; minAt: number; hisAt: number}> = ({clockAt, numAt, minAt, hisAt}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <>
      <Clock cx={440} cy={540} r={250} at={clockAt} />
      {g >= numAt && (
        <div style={{position: 'absolute', left: 440 - 200, top: 540 - 150, width: 400, textAlign: 'center', fontFamily: JF.display, fontSize: 250, lineHeight: 1,
          color: '#f4efe6', textShadow: '0 6px 24px rgba(0,0,0,0.7)', transform: `scale(${interpolate(g, [numAt, numAt + 3, numAt + 6], [1.35, 0.95, 1], clamp)})`}}>15</div>
      )}
      {g >= minAt && <Highlight text="MINUTE" x={760} y={350} size={128} at={minAt} seed={7} rot={-2} />}
      {g >= hisAt && (
        <div style={{position: 'absolute', left: 770, top: 520, fontFamily: JF.display, fontSize: 196, lineHeight: 1, color: pal.mark, textShadow: '0 6px 26px rgba(0,0,0,0.7)',
          transform: `scale(${interpolate(g, [hisAt, hisAt + 3, hisAt + 6], [1.3, 0.97, 1], clamp)})`, transformOrigin: 'left center'}}>HISTORY</div>
      )}
      {g >= hisAt + 6 && <div style={{position: 'absolute', left: 780, top: 760, width: interpolate(g, [hisAt + 6, hisAt + 16], [0, 820], clamp), height: 8, background: boxOf(pal)}} />}
    </>
  );
};

/** Where the six taped-down photos sit on the page (the camera starts close on the first). */
const PAGE: {x: number; y: number; w: number; rot: number}[] = [
  {x: 70, y: 60, w: 400, rot: -4}, {x: 1460, y: 70, w: 400, rot: 3}, {x: 80, y: 740, w: 380, rot: 2},
  {x: 1470, y: 750, w: 390, rot: -3}, {x: 760, y: 40, w: 360, rot: 1.5}, {x: 790, y: 830, w: 340, rot: -2},
];
const TORN = (seed: string, n = 40) => {
  // a strip with ragged top and bottom edges, as a CSS polygon
  const top = [...Array(n + 1)].map((_, i) => `${(i / n) * 100}% ${random(`${seed}t${i}`) * 9}%`);
  const bot = [...Array(n + 1)].map((_, i) => `${100 - (i / n) * 100}% ${91 + random(`${seed}b${i}`) * 9}%`);
  return `polygon(${[...top, ...bot].join(', ')})`;
};

/**
 * The channel intro (from The Balloon War): the camera starts close on one photo taped into the notebook and drifts
 * back to the whole page, the logo in the middle among the video's photos. The logo holds for a second, eases up, and
 * an orange tape strip with the video's title is pulled across the middle. No ticks: paper, tape, and the sting.
 */
const Body: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  const back = 72, up = 104, tape = 108, sub = 126;
  const u = interpolate(f, [0, back], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const s = 3.1 + (1 - 3.1) * u;
  const c0 = [PAGE[0].x + PAGE[0].w / 2, PAGE[0].y + PAGE[0].w * 0.34];
  const cx = c0[0] + (960 - c0[0]) * u, cy = c0[1] + (540 - c0[1]) * u;
  const k = interpolate(f, [up, up + 18], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const logo = 0.6 - 0.24 * k;
  const ly = 540 - 330 * k;
  const pull = interpolate(f, [tape, tape + 14], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const dim = interpolate(f, [up, up + 14], [1, 0.45], clamp);
  const fade = interpolate(f, [INTRO_FRAMES - 10, INTRO_FRAMES], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#050403', opacity: fade}}>
      <AbsoluteFill style={{transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: -700, top: -500, width: 3320, height: 2080}}><DarkPaper /></div>
        <AbsoluteFill style={{opacity: dim}}>
          {PAGE.map((c, i) => (
            <div key={i} style={{position: 'absolute', left: c.x, top: c.y, width: c.w, transform: `rotate(${c.rot}deg)`, opacity: i === 4 ? 1 - k : 1}}>
              <div style={{background: '#f4efe6', padding: 10, boxShadow: '0 14px 28px rgba(0,0,0,0.65)'}}>
                <Img src={staticFile(CARDS[i % CARDS.length])} style={{width: c.w - 20, height: (c.w - 20) * 0.66, objectFit: 'cover', display: 'block', filter: 'grayscale(1) contrast(1.2)'}} />
              </div>
              {[[-18, -14, -8], [c.w - 70, -12, 9]].map(([tx, ty, tr], q) => (
                <div key={q} style={{position: 'absolute', left: tx, top: ty, width: 90, height: 30, background: 'rgba(236,222,190,0.62)', transform: `rotate(${tr + (random(`tp${i}${q}`) - 0.5) * 8}deg)`}} />
              ))}
            </div>
          ))}
        </AbsoluteFill>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${960 - 895 * logo}px, ${ly - 540 * logo}px) scale(${logo})`, transformOrigin: '0 0'}}>
          <Wordmark clockAt={-200} numAt={-200} minAt={-200} hisAt={-200} />
        </div>
      </AbsoluteFill>
      {/* the title on a strip of orange tape, pulled across the middle */}
      {f >= tape && (
        <div style={{position: 'absolute', left: -40, top: 440, width: 2000, height: 190, transform: 'rotate(-2deg)',
          clipPath: `inset(0 ${(1 - pull) * 100}% 0 0)`, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.55))'}}>
          <div style={{position: 'absolute', inset: 0, background: boxOf(pal), clipPath: TORN('title')}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JF.display, fontSize: 132,
            color: INK, letterSpacing: 1, whiteSpace: 'nowrap'}}>{TITLE}</div>
        </div>
      )}
      {g >= sub && (
        <div style={{position: 'absolute', left: 0, width: 1920, top: 680, textAlign: 'center', fontFamily: JF.display, fontSize: 60, color: pal.mark,
          textShadow: '0 3px 16px rgba(0,0,0,0.85)', opacity: interpolate(g, [sub, sub + 8], [0, 1], clamp)}}>{SUBTITLE}</div>
      )}
      {g >= sub + 10 && <Highlight text={DATES} x={1500} y={800} size={54} at={sub + 10} seed={9} rot={-3} />}
      <Finish vignette={0.45} />
      <Sfx at={2} src="sfx/paper_rustle.wav" volume={0.22} />
      <Sfx at={tape - 2} src="sfx/tape_pull.wav" volume={0.42} />
      {/* the jingle (whole intro, timed to its beats) or, until one is chosen, the title sting */}
      {JINGLE ? <Audio src={staticFile(JINGLE)} volume={0.55} />
        : <Sequence from={40} layout="none"><Audio src={staticFile('music/title_sting.mp3')} volume={(x) => interpolate(x, [0, 4, 60, 100], [0, 0.32, 0.32, 0], clamp)} /></Sequence>}
    </AbsoluteFill>
  );
};

export const ChannelIntro: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
