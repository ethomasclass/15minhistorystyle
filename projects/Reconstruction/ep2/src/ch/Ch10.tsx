// Chapter 10 · "The Ground They Stood On": the ending. The recap travels the series board piece by piece as the narration
// names them (the 13th, the senators print, Congress, the five districts, Caldwell's convention, 2,000 in office, the 15th)
// and pulls back; the two readings (Republicans / most white Southerners, "bottom rail on top" as a warning); what it all
// rested on (votes, soldiers, not land); the Edisto card with VOTELESS struck and LANDLESS circled; the contract and the
// cabin; Waud's Bureau officer; Caldwell's two documents and the militia; next time; the thank-you over the whole series
// board, then a music-only end screen with two clean slots ("Swing Low, Sweet Chariot", Fisk, 1909, after the last word).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch10_ground.words.json';
import {clamp} from '../lib/anim';
import {DarkPaper, Sfx} from '../kit/common';
import {BoardSignoff, SeriesBoard} from '../kit/ep2board';
import type {BoardKey} from '../kit/board';
import {Highlight, JF, Loop, type Place, Picture, Tag, useGFrame} from '../kit/Kit';
import {type Box, CORAL, cut, DOC_F, DocShot, Motif, Slip, SRC, Swipe, TEAL} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, useScene} from '../kit/shell';

const N = words as Narration;
const t = makeTimeline(N, 30);
/** The music-only end screen after the last word (YouTube's end-screen elements sit on it): 15 s more than the usual
 *  tail, so about 18 s from the last word to black. */
const EXTRA = 450;
export const CH10_FRAMES = chapterFrames(N, LEAD) + EXTRA;
/** The first frame after the last word. */
const SAID = Math.ceil(N.duration * 30);

// the shots
const S_VIEWS = cut(t, 'To Republicans'), S_REST = cut(t, 'And what was'), S_CARD = cut(t, 'Look at the card');
const S_CON = cut(t, 'But most'), S_CABIN = cut(t, 'And people'), S_NORTH = cut(t, 'As for the');
const S_CALD = cut(t, 'Charles Caldwell'), S_NEXT = cut(t, 'Next time'), S_END = cut(t, 'Thanks for watching');

const Cuts: React.FC = () => (
  <>{[S_VIEWS, S_REST, S_CARD, S_CON, S_CABIN, S_NORTH, S_CALD, S_NEXT].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />)}</>
);

const ease = Easing.inOut(Easing.cubic);
/** Pale scans (the contract, the journals): grey, the ink kept, not blown out. */
const PAGE_F = 'grayscale(1) sepia(0.18) contrast(1.2) brightness(0.9)';

/** Mounts its children from `at` to `out`, popping in. */
const Gate: React.FC<{at: number; out?: number; children: React.ReactNode}> = ({at, out = 1e7, children}) => {
  const f = useCurrentFrame();
  if (f < at || f >= out) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.12, 0.98, 1], clamp);
  return <AbsoluteFill style={{transform: `scale(${k})`, opacity: interpolate(f, [at, at + 2], [0, 1], clamp)}}>{children}</AbsoluteFill>;
};

/** A torn window onto part of a page (centred on page px cx, cy at scale s), on the desk; children in page px (swipes). */
const DocWin: React.FC<{src: string; size: [number, number]; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r?: number; filter?: string;
  children?: React.ReactNode}> = ({src, size, cx, cy, s, w, h, x, y, r = 0, filter = DOC_F, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${r}deg)`, filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.7))'}}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#ddd6c6', clipPath: 'polygon(0 3%, 100% 0, 99% 96%, 1% 100%)'}}>
      <div style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, width: size[0], height: size[1], transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: size[0], height: size[1], filter}} />
        {children}
      </div>
    </div>
  </div>
);

/** A hand-drawn tick, drawn on. */
const Tick: React.FC<{x: number; y: number; at: number; s?: number}> = ({x, y, at, s = 56}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 6], [0, 1], clamp);
  return (
    <svg width={s * 1.4} height={s * 1.4} style={{position: 'absolute', left: x, top: y, overflow: 'visible', filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,0.55))'}}>
      <path d={`M${s * 0.1},${s * 0.6} L${s * 0.42},${s * 0.95} L${s * 1.2},${s * 0.05}`} fill="none" stroke={TEAL} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** A placement filling a w x 1080 panel, centred on source (fx, fy) at zoom z. */
const panel = (size: [number, number], fx: number, fy: number, z: number, w: number): Place => {
  const sc = Math.max(w / size[0], 1080 / size[1]) * z;
  return {left: Math.min(0, Math.max(w - size[0] * sc, w / 2 - fx * sc)), top: Math.min(0, Math.max(1080 - size[1] * sc, 540 - fy * sc)), scale: sc};
};

// ------------------------------------------------------------------------------------------ 1 · the recap, on the board
// Board pixels (ep2board.tsx): the 13th ~(255, 230), the senators print ~(720, 1500), CONGRESS DECIDES + Stevens ~(1040, 790),
// the five districts ~(2180, 250), Caldwell's roll ~(820, 1790), bottom rail + 2,000 in office ~(1270, 1770), the 15th
// ~(255, 1440). Each stop: [move starts, arrives, x, y, z]. A long move dips the zoom on the way (a hop, not a whip pan).
type Stop = [number, number, number, number, number];
const STOPS: Stop[] = [
  [0, 0, 1215, 988, 0.45],
  [t.at('Five') - 18, t.at('slavery') - 2, 260, 245, 1.5],
  [t.at('a Black minister') - 20, t.at('minister') + 2, 720, 1490, 1.55],
  [t.at('How did'), t.at('fast') + 4, 800, 1400, 1.05],
  [t.at('Because') - 6, t.at('Congress') + 6, 1040, 790, 1.5],
  [t.at('The army') - 24, t.at('army') + 4, 2180, 255, 1.45],
  [t.at('while new') - 12, t.at('governments') + 2, 820, 1785, 1.45],
  [t.at('sending') - 22, t.at('2,000') + 4, 1265, 1770, 1.5],
  [t.at('And the 15th') - 20, t.at('15th') + 6, 255, 1440, 1.5],
  [S_VIEWS - 56, S_VIEWS, 1215, 988, 0.45],
];
/** The camera at frame f: holding on a stop drifts in a little; a move eases across, dipping the zoom on long ones. */
const recapCam = (f: number): [number, number, number] => {
  const drift = (s: Stop, at: number) => s[4] * (1 + 0.025 * interpolate(at, [s[1], s[1] + 120], [0, 1], clamp));
  let i = 0;
  for (let k = 0; k < STOPS.length; k++) if (f >= STOPS[k][0]) i = k;
  const s = STOPS[i];
  if (i === 0 || f >= s[1]) return [s[2], s[3], i === 0 ? s[4] : drift(s, f)];
  const p = STOPS[i - 1];
  const e = ease(interpolate(f, [s[0], s[1]], [0, 1], clamp));
  const za = i - 1 === 0 ? p[4] : drift(p, s[0]);
  const d = Math.hypot(s[2] - p[2], s[3] - p[3]);
  const dip = 1 - Math.min(0.42, d / 2600) * Math.sin(Math.PI * e);
  return [p[2] + (s[2] - p[2]) * e, p[3] + (s[3] - p[3]) * e, Math.exp(Math.log(za) + (Math.log(s[4]) - Math.log(za)) * e) * dip];
};
const RECAP: BoardKey[] = Array.from({length: S_VIEWS + 2}, (_, f) => [f, ...recapCam(f)] as BoardKey);

// ------------------------------------------------------------------------------------------ 2 · two views
const KELLY = 'img/ch05/fifteenth_amendment_1870_print.jpg';
const KELLY_S: [number, number] = [3000, 2386];
const PUCK = 'img/ch07/PROPAGANDA_strong_government_weak_government_1880.jpg';
const PUCK_S: [number, number] = [2577, 3000];
const VOMIT = 'img/ch06/PROPAGANDA_black_vomit_bottom_rail_c1867.jpg';
const VOMIT_S: [number, number] = [1170, 1536];
/** "The Bottom Rail on Top." on the broadside (measured on the image) */
const V_RAIL: Box = [336, 178, 512, 46];

const Header: React.FC<{text: string; x: number; color: string; at: number}> = ({text, x, color, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', left: x, top: 104, fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color, background: 'rgba(10,10,10,0.78)', padding: '8px 18px',
    opacity: interpolate(g, [at, at + 5], [0, 1], clamp)}}>{text}</div>;
};

const TwoViews: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = S_VIEWS, r = t.at('To most'), rail = t.at('Bottom rail');
  const pl = panel(KELLY_S, 1480, 1230, interpolate(f, [a, S_REST], [1.32, 1.38], clamp), 958);
  const pr = panel(PUCK_S, 1270, 1560, interpolate(f, [a, S_REST], [1.12, 1.17], clamp), 958);
  const dimL = interpolate(g, [r - 2, r + 6], [1, 0.42], clamp);
  const dimR = interpolate(g, [r - 2, r + 6], [0.4, 0.92], clamp) * interpolate(g, [rail - 2, rail + 4], [1, 0.62], clamp);
  return (
    <AbsoluteFill style={{background: '#0d0c09'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 958, height: 1080, overflow: 'hidden', filter: `brightness(${dimL})`}}>
        <Picture src={KELLY} place={pl} size={KELLY_S} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.6) 100%)'}} />
      </div>
      <div style={{position: 'absolute', left: 962, top: 0, width: 958, height: 1080, overflow: 'hidden', filter: `brightness(${dimR})`}}>
        <Picture src={PUCK} place={pr} size={PUCK_S} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.6) 100%)'}} />
      </div>
      <div style={{position: 'absolute', left: 958, top: 0, width: 4, height: 1080, background: '#ece6d8'}} />
      <Header text="REPUBLICANS" x={130} color={TEAL} at={t.at('Republicans')} />
      <Header text="MOST WHITE SOUTHERNERS" x={1010} color={CORAL} at={r} />
      <Slip text="equal citizenship" x={150} y={820} size={64} at={t.at('equal') - 2} />
      <Slip text="Puck, 1880: against Reconstruction" x={1010} y={900} size={40} rot={-2} at={r + 8} out={rail - 2} />
      <Slip text="a world turned upside down" x={1020} y={210} size={52} at={t.at('world') - 2} out={rail - 2} />
      <Slip text="outsiders" x={1250} y={500} size={56} rot={2} at={t.at('outsiders') - 2} out={rail - 2} />
      <Slip text="soldiers" x={1540} y={660} size={56} rot={-2} at={t.at('and soldiers') + 2} out={rail - 2} />
      {/* the phrase in use, as a warning: the title line of a racist broadside, windowed and dimmed */}
      <Gate at={rail - 2}>
        <DocWin src={VOMIT} size={VOMIT_S} cx={552} cy={201} s={1.25} w={780} h={140} x={1030} y={400} r={-1.5} filter={`${DOC_F} brightness(0.85)`}>
          <Swipe lines={[V_RAIL]} from={rail + 2} to={t.end('on top')} seed="vr" />
        </DocWin>
      </Gate>
      <Slip text="a racist broadside, c. 1867" x={1060} y={580} size={44} rot={2} at={rail + 6} />
      <Slip text="meant as a warning" x={1150} y={700} size={64} rot={-2} at={t.at('warning') - 4} coral />
      <Tag text="The Fifteenth Amendment, Thomas Kelly, 1870 · Library of Congress" />
      <Tag text="Puck, 1880 · broadside, Lynchburg, 1867 · Library of Congress" x={1004} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ 3 · what it rested on
/** A dashed coral outline, drawn on. */
const Dashed: React.FC<{x: number; y: number; w: number; h: number; at: number}> = ({x, y, w, h, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  return (
    <svg width={w + 20} height={h + 20} style={{position: 'absolute', left: x - 10, top: y - 10, overflow: 'visible'}}>
      <rect x={10} y={10} width={w} height={h} rx={6} fill="rgba(255,111,97,0.06)" stroke={CORAL} strokeWidth={6} strokeDasharray="22 16" opacity={p}
        style={{clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}} />
    </svg>
  );
};

/** A creased print dropping onto the desk. */
const Drop: React.FC<{src: string; w: number; h: number; x: number; y: number; r?: number; at: number}> = ({src, w, h, x, y, r = 0, at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = ease(interpolate(f, [at, at + 7], [0, 1], clamp));
  return (
    <>
      <Img src={staticFile(src)} style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translateY(${-30 * (1 - k)}px) rotate(${r + 4 * (1 - k)}deg) scale(${1.12 - 0.12 * k})`,
        opacity: Math.min(1, k * 3), filter: `drop-shadow(${6 + 14 * (1 - k)}px ${8 + 16 * (1 - k)}px 0 rgba(0,0,0,0.5))`}} />
      <Sfx at={at} src="sfx/page_turn.wav" volume={0.24} />
    </>
  );
};

const Rest: React.FC = () => {
  const g = useGFrame();
  const a = S_REST;
  const beam = interpolate(g, [a + 4, a + 14], [0, 1], clamp);
  const post = (x: number, at: number) => g >= at && <div style={{position: 'absolute', left: x, top: 332, width: 6, height: 52, background: TEAL, opacity: interpolate(g, [at, at + 4], [0, 1], clamp)}} />;
  const votes = t.at('Votes'), soldiers = t.at('the soldiers who'), land = t.at('Not land');
  return (
    <AbsoluteFill>
      <DarkPaper />
      {/* the beam: everything the chapter recapped, resting on what's under it */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M300,312 L1620,306 L1622,334 L302,338 Z" fill="rgba(47,224,196,0.12)" stroke={TEAL} strokeWidth={6} strokeLinejoin="round"
          style={{clipPath: `inset(0 ${(1 - beam) * 100}% 0 0)`}} />
      </svg>
      <Slip text="2,000 in office · the 15th · new state governments" x={330} y={196} size={46} rot={-1} at={t.at('all of it')} />
      {post(530, votes)}
      {post(965, soldiers)}
      {post(1400, land)}
      <Drop src="img/wall/cr_firstvote.png" w={330} h={408} x={368} y={384} r={-2} at={votes - 2} />
      <Drop src="img/wall/cr_bureau.png" w={460} h={308} x={738} y={392} r={2} at={soldiers - 2} />
      <Dashed x={1235} y={388} w={330} h={400} at={land - 2} />
      <Slip text="votes" x={430} y={830} size={70} rot={-3} at={votes + 2} />
      <Slip text="soldiers" x={850} y={760} size={70} rot={2} at={t.at('protected') - 2} />
      <Slip text="not land" x={1270} y={540} size={76} rot={-3} at={land} coral />
      <Tag text="The First Vote, A. R. Waud, 1867 · The Freedmen's Bureau, A. R. Waud, 1868 · Harper's Weekly" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ 4 · the Edisto card
// the three words on the motif strip (cr_three_words.png, 1000 x 122, shown at w 1000; boxes checked on the image)
const M_LAND: Box = [112, 28, 270, 72];
const M_VOTE: Box = [698, 28, 230, 72];

const Strike: React.FC<{box: Box; at: number}> = ({box: [x, y, w, h], at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 6], [0, 1], clamp);
  const y0 = y + h * 0.55;
  return (
    <svg width={1000} height={122} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M ${x - 6} ${y0 + 4} Q ${x + w * 0.5} ${y0 - 8} ${x + w + 8} ${y0 - 2}`} stroke={TEAL} strokeWidth={10} fill="none" strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Card: React.FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f, [S_CARD, S_CON], [1, 1.05], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 30%'}}>
        <Motif x={460} y={150} w={1000} at={S_CARD} under={
          <div style={{position: 'absolute', left: 0, top: 0, width: 1000, height: 122}}>
            <Strike box={M_VOTE} at={t.at('Voteless') + 2} />
            <Loop cx={M_LAND[0] + M_LAND[2] / 2} cy={M_LAND[1] + M_LAND[3] / 2} rx={168} ry={62} at={t.at('Landless')} dur={12} width={9} seed={21} tilt={-2} color={CORAL} />
          </div>
        } />
        <Slip text="could vote" x={1110} y={400} size={62} rot={-2} at={t.at('could vote') - 2} />
        <Tick x={1430} y={392} at={t.at('could vote') + 6} />
        <Slip text="could hold office" x={1060} y={510} size={62} rot={2} at={t.at('hold office') - 2} />
        <Tick x={1520} y={505} at={t.at('hold office') + 6} />
        <Slip text="still there" x={560} y={400} size={62} rot={-3} at={t.at('still there') - 2} coral />
      </AbsoluteFill>
      <Sfx at={t.at('Voteless') + 2} src="sfx/marker_tick.wav" volume={0.22} />
      <Sfx at={t.at('Landless')} src="sfx/marker_tick.wav" volume={0.22} />
      <Tag text={SRC.letter} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ 5 · the ground
const CONTRACT = 'img/ch08/sharecropping_contract_desoto_ms_1867.jpg';
const CONTRACT_S: [number, number] = [2317, 3000];
/** "agree to furnish Land and Team and Tools" (the planter's side of the bargain; measured on the image) */
const C_FURNISH: Box = [490, 893, 1260, 68];

const Contract: React.FC = () => {
  const L = {y: 928, tilt: 28, dof: 2.4, band: 70};
  return (
    <DocShot src={CONTRACT} size={CONTRACT_S} seed="con" focusAt={S_CON} filter={PAGE_F} tag="Sharecropping contract, De Soto County, Miss., Feb. 1867 · Nabb Research Center (Internet Archive)"
      keys={[[S_CON, {...L, x: 900, z: 0.92}], [t.at('own the ground'), {...L, x: 1060, z: 0.96}], [S_CABIN, {...L, x: 1240, z: 1.0}]]}
      over={<>
        <Slip text="a sharecropping contract, Mississippi, 1867" x={150} y={140} size={48} rot={-2} at={S_CON + 6} />
        <Slip text="the planter's land" x={1160} y={760} size={66} rot={-2} at={t.at('stood on') - 2} coral />
      </>}>
      <Swipe lines={[C_FURNISH]} from={t.at('own the ground')} to={t.end('stood on') + 4} seed="cf" />
    </DocShot>
  );
};

const CABIN = 'img/ch08/LATER_old_cabin_c1906.jpg';
const Cabin: React.FC = () => (
  <Photo src={CABIN} size={[1536, 1210]} fx={760} fy={640} z0={1.03} z1={1.1} a={S_CABIN} b={S_NORTH}>
    {() => <Tag text="Old cabin, c. 1906 · Library of Congress" />}
  </Photo>
);

// ------------------------------------------------------------------------------------------ 6 · the soldiers
const WAUD = 'img/ch02/waud_the_freedmens_bureau_harpers_1868-07-25.jpg';
const North: React.FC = () => (
  <Photo src={WAUD} size={[3000, 2113]} fx={1500} fy={1000} z0={1.2} z1={1.28} a={S_NORTH} b={S_CALD}>
    {() => (
      <>
        <Slip text="a Bureau officer, between two sides · 1868" x={130} y={850} size={46} rot={-2} at={t.at('soldiers', 3) + 2} />
        <Slip text="as long as the North wanted" x={1080} y={870} size={58} rot={2} at={t.at('the North') - 2} coral />
        <Tag text="The Freedmen's Bureau, A. R. Waud, Harper's Weekly, July 25, 1868 · Internet Archive" />
      </>
    )}
  </Photo>
);

// ------------------------------------------------------------------------------------------ 7 · Caldwell
const ROLL = 'img/ch03/ms_convention_journal_1868_roll_caldwell_p5.jpg';
const ROLL_S: [number, number] = [1698, 3000];
const ROLL_NAME: Box = [136, 2188, 358, 56];
const YEA = 'img/ch05/ms_senate_ratifies_15th_caldwell_yea_1870-01-15_mcpherson_p558.jpg';
const YEA_S: [number, number] = [1825, 3000];
const YEA_NAME: Box = [1016, 2824, 290, 44];

/** His name on two pages: the 1868 convention roll and the state Senate's 1870 vote; then the militia, then a quiet hold. */
const Caldwell: React.FC = () => {
  const f = useCurrentFrame();
  const a = S_CALD, still = t.at('still in'), mil = t.at('militia'), later = t.at('Two years later');
  const push = interpolate(f, [a, S_NEXT], [1, 1.06], {...clamp, easing: Easing.out(Easing.quad)});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 45%'}}>
        <Gate at={a + 2}>
          <DocWin src={ROLL} size={ROLL_S} cx={330} cy={2216} s={1.3} w={800} h={220} x={130} y={230} r={-1.5} filter={PAGE_F}>
            <Swipe lines={[ROLL_NAME]} from={t.at('Charles Caldwell') + 2} to={t.end('Charles Caldwell') + 2} seed="rn" />
          </DocWin>
        </Gate>
        <Slip text="1868 · the convention" x={170} y={480} size={52} rot={-2} at={a + 12} />
        <Gate at={still - 2}>
          <DocWin src={YEA} size={YEA_S} cx={1265} cy={2806} s={1.35} w={800} h={220} x={990} y={310} r={1.5} filter={PAGE_F}>
            <Swipe lines={[YEA_NAME]} from={t.at('state senate')} to={t.end('state senate') + 4} seed="yn" />
          </DocWin>
        </Gate>
        <Slip text="1870 · state senator" x={1040} y={560} size={52} rot={2} at={t.at('state senate') + 2} />
        <Slip text="militia colonel · 1873" x={1040} y={700} size={72} rot={-2} at={t.at('colonel') - 2} coral />
        <Gate at={mil} out={later - 4}>
          <Highlight text="MILITIA" x={170} y={700} size={84} at={mil} seed={31} rot={-2} />
          <Definition term="militia" def="the state's own part-time army" at={t.at("the state's own")} x={170} y={850} />
        </Gate>
      </AbsoluteFill>
      <Sfx at={mil} src="sfx/stamp.wav" volume={0.3} />
      {[a + 2, still - 2].map((x) => <Sfx key={x} at={x} src="sfx/tick.wav" volume={0.38} />)}
      <Tag text="Miss. constitutional convention journal, 1868 · McPherson, Political History of Reconstruction, 1871 · Internet Archive" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ 8 · next time
const Next: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Highlight text="NEXT TIME" x={120} y={110} size={84} at={t.at('Next time')} seed={41} rot={-2} />
    <Slip text="the Klan" x={200} y={360} size={92} rot={-3} at={t.at('Klan') - 2} />
    <Slip text="a crash" x={1000} y={330} size={92} rot={2} at={t.at('crash') - 2} />
    <Slip text="a bank" x={290} y={640} size={92} rot={2} at={t.at('bank') - 2} />
    <Slip text="a deal that ended it all" x={860} y={640} size={92} rot={-2} at={t.at('deal') - 2} coral />
    <Sfx at={t.at('Next time')} src="sfx/stamp.wav" volume={0.3} />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------ 9 · the end screen
/**
 * Over the whole series board, dimmed after "subscribe", two clean slots for YouTube's end-screen elements: a video at
 * x 150-950 / y 300-750 (left) and a subscribe circle centred at (1440, 525), r 170 (right). Nothing inside either slot.
 */
export const VIDEO_SLOT = {x: 150, y: 300, w: 800, h: 450};
export const SUB_SLOT = {cx: 1440, cy: 525, r: 170};
const EndOverlay: React.FC = () => {
  const g = useGFrame();
  const a = t.at('subscribe') - 24;
  const dim = interpolate(g, [a, a + 14], [0, 0.66], clamp);
  const o = (d: number) => interpolate(g, [a + d, a + d + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(8,7,5,${dim})`}} />
      <div style={{position: 'absolute', left: VIDEO_SLOT.x, top: VIDEO_SLOT.y, width: VIDEO_SLOT.w, height: VIDEO_SLOT.h, border: `5px solid ${TEAL}`, borderRadius: 10,
        background: 'rgba(10,10,10,0.72)', opacity: o(6), boxSizing: 'border-box', boxShadow: '0 16px 30px rgba(0,0,0,0.5)'}} />
      <div style={{position: 'absolute', left: SUB_SLOT.cx - SUB_SLOT.r, top: SUB_SLOT.cy - SUB_SLOT.r, width: SUB_SLOT.r * 2, height: SUB_SLOT.r * 2, borderRadius: '50%',
        border: `5px solid ${TEAL}`, background: 'rgba(10,10,10,0.72)', opacity: o(12), boxSizing: 'border-box'}} />
      <Slip text="thanks for watching" x={150} y={150} size={58} at={t.at('Thanks for watching')} />
      <Slip text="part three" x={170} y={790} size={54} rot={2} at={t.at('part three')} />
      <Slip text="subscribe" x={1330} y={745} size={62} at={t.at('subscribe')} coral />
    </AbsoluteFill>
  );
};

// the whole series board (Episode 1 on top, Episode 2's row below, PROTECTION on the right): z 0.45 keeps the chalked column
// names (board y 30) and the sign-off strip (board y 1920) inside the title-safe margin
const END_CAM: BoardKey[] = [[S_END, 1215, 988, 0.45], [S_END + 900, 1215, 988, 0.44]];
/** LANDLESS on the board's three-words strip (x 680, y 205, w 560): circled in coral, as on the card. */
const BoardLoop: React.FC = () => <Loop cx={818} cy={242} rx={96} ry={36} at={S_END + 16} dur={12} width={7} seed={22} tilt={-1} color={CORAL} />;

const Body: React.FC = () => {
  const scene = useScene([
    [0, <SeriesBoard key="r" ch={10} from={0} at={0} cam={RECAP} whoosh={false} />],
    [S_VIEWS, <TwoViews key="v" />],
    [S_REST, <Rest key="rest" />],
    [S_CARD, <Card key="card" />],
    [S_CON, <Contract key="con" />],
    [S_CABIN, <Cabin key="cab" />],
    [S_NORTH, <North key="n" />],
    [S_CALD, <Caldwell key="c" />],
    [S_NEXT, <Next key="next" />],
    [S_END, <SeriesBoard key="end" ch={10} from={S_END} at={S_END} cam={END_CAM} overlay={<EndOverlay />}><BoardSignoff at={S_END + 6} /><BoardLoop /></SeriesBoard>],
  ]);
  return (
    <>
      {scene}
      <Cuts />
      <Sfx at={t.at('Bottom rail')} src="sfx/marker_tick.wav" volume={0.22} />
      <Sfx at={t.at('own the ground')} src="sfx/marker_tick.wav" volume={0.22} />
    </>
  );
};

/** Music (MUSIC.md): r_ending from the top (its build peaks under the Edisto card, its hush sits under "the ground they
 *  stood on" and it dies away under the soldiers); m_lament, low, under Caldwell; a second pass of r_ending's warm
 *  opening under the teaser and the thank-you; then, after the last word only, "Swing Low, Sweet Chariot" (Fisk
 *  University Jubilee Singers, 1909) over the end screen. */
const SWING = SAID + 3;
export const Ch10: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch10_ground.wav" lead={LEAD} extra={EXTRA}
    music={[
      {src: 'music/r_ending.mp3', volume: 0.15, to: S_NORTH + 50, fadeOut: 40},
      {src: 'music/m_lament.mp3', volume: 0.12, from: S_NORTH - 8, to: S_NEXT + 6, fadeOut: 30},
      {src: 'music/r_ending.mp3', volume: 0.11, from: S_NEXT - 6, to: SWING + 24, fadeOut: 40},
      {src: 'music/period/roll_jordan_fisk_1909.mp3', volume: 0.42, from: SWING}, // the series' end-card record (MUSIC.md)
    ]}>
    <Body />
  </ChapterShell>
);
