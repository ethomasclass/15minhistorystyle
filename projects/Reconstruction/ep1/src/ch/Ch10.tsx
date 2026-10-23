// Chapter 10 · "Landless, Homeless, Voteless": the ending. The recap travels the board piece by piece (the question,
// Lincoln, Johnson, the pardons, the Black Codes, the Civil Rights Act and the 14th, the election) and pulls back to all of
// it; the two readings of Johnson; Edisto; the three words (the law, yes; the land, no); VOTELESS about to change; next
// time (the first Black senator); the thank-you over the whole board, then a music-only end screen with two clean slots
// for YouTube's end-screen elements ("Roll, Jordan, Roll", Fisk University Jubilee Quartet, 1909, after the last word).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch10_landless.words.json';
import {clamp} from '../lib/anim';
import {DarkPaper, Sfx} from '../kit/common';
import {BoardSignoff, EpBoard} from '../kit/ep1board';
import type {BoardKey} from '../kit/board';
import {Highlight, JF, Loop, type Place, Picture, Tag, Tint, Traced, useGFrame} from '../kit/Kit';
import {CORAL, cut, DOC_F, DocShot, EDISTO, Motif, Slip, SRC, Swipe, TEAL, THREE_WORDS, Win} from '../kit/rc';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, onScreen, Photo, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const t = makeTimeline(N, 30);
/** The music-only end screen after the last word (YouTube's end-screen elements sit on it): 15 s more than the usual
 *  tail, so about 18 s from the last word to black. */
const EXTRA = 450;
export const CH10_FRAMES = chapterFrames(N, LEAD) + EXTRA;
/** The first frame after the last word. */
const SAID = Math.ceil(N.duration * 30);

// the shots
const S_VIEWS = cut(t, "Johnson's supporters"), S_EDISTO = cut(t, 'And Edisto'), S_WORDS = cut(t, 'Remember their');
const S_CHANGE = cut(t, 'But one of those'), S_NEXT = cut(t, 'Next time'), S_END = cut(t, 'Thanks for watching');

const Cuts: React.FC = () => <>{[S_VIEWS, S_EDISTO, S_WORDS, S_CHANGE, S_NEXT].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />)}</>;

// ------------------------------------------------------------------------------------------ 1 · the recap
// Board pixels (ep1board.tsx): the question ~(960, 480), Lincoln ~(600, 455), Johnson ~(1290, 425), the pardons
// ~(1640, 600), the 13th + Black Codes ~(270, 300), the Civil Rights Act + 14th ~(250, 720), Congress decides + Stevens
// ~(1100, 750). Each move takes ~0.6 s and lands on the word that names the piece.
/** Stops [frame of arrival, x, y, zoom]: the camera holds on each until it leaves (18 frames) for the next. */
const STOPS: BoardKey[] = [
  [0, 960, 470, 1.55],
  [t.at('Who got'), 960, 470, 1.75],
  [t.at('the President'), 950, 440, 1.3],
  [t.at('Lincoln'), 600, 450, 2.0],
  [t.at('Johnson was'), 1290, 430, 2.0],
  [t.at('pardoned'), 1620, 560, 1.75],
  [t.at('The South used') + 4, 290, 300, 1.7],
  [t.at('Civil Rights'), 230, 650, 1.7],
  [t.at('14th'), 250, 760, 1.75],
  [t.at('voters handed') - 8, 1080, 730, 1.6],
  [S_VIEWS - 4, 960, 540, 0.8],
];
const MOVE = 18;
const RECAP: BoardKey[] = STOPS.flatMap(([f, x, y, z], i) => {
  const next = STOPS[i + 1];
  if (!next) return [[f, x, y, z], [f + 60, x, y, z * 0.99]] as BoardKey[];
  const leave = Math.max(f + 1, next[0] - (i === STOPS.length - 2 ? 30 : MOVE));   // the last pull-back is slower
  return [[f, x, y, z], [leave, x, y, z]] as BoardKey[];
});

// ------------------------------------------------------------------------------------------ 2 · two views
const JOHNSON = 'img/ch05/andrew_johnson_portrait_1865.jpg';
const JOHNSON_S: [number, number] = [939, 1536];
const HOME = 'img/ch10/freedpeople_family_and_home_st_helena_island_1863.jpg';
const HOME_S: [number, number] = [3000, 1517];
/** A placement filling a w x 1080 panel, centred on source (fx, fy) at zoom z. */
const panel = (size: [number, number], fx: number, fy: number, z: number, w: number): Place => {
  const sc = Math.max(w / size[0], 1080 / size[1]) * z;
  return {left: Math.min(0, Math.max(w - size[0] * sc, w / 2 - fx * sc)), top: Math.min(0, Math.max(1080 - size[1] * sc, 540 - fy * sc)), scale: sc};
};

const Header: React.FC<{text: string; x: number; color: string; at: number}> = ({text, x, color, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', left: x, top: 104, fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color, background: 'rgba(10,10,10,0.78)', padding: '8px 18px',
    opacity: interpolate(g, [at, at + 5], [0, 1], clamp)}}>{text}</div>;
};

const TwoViews: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = S_VIEWS, r = t.at('To the Radicals');
  const pl = panel(JOHNSON_S, 470, 560, interpolate(f, [a, S_EDISTO], [1.02, 1.06], clamp), 958);
  // the portrait's pale card stock reads as a frame: start the crop inside it (x from ~40 px of the source)
  const pr = panel(HOME_S, 800, 800, interpolate(f, [a, S_EDISTO], [1.4, 1.44], clamp), 958);
  const dimL = interpolate(g, [r - 2, r + 6], [1, 0.45], clamp);
  const dimR = interpolate(g, [r - 2, r + 6], [0.4, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#0d0c09'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 958, height: 1080, overflow: 'hidden', filter: `brightness(${dimL})`}}>
        <Picture src={JOHNSON} place={pl} size={JOHNSON_S} />
        <Tint mask={MASKS.johnson.alpha} place={pl} size={JOHNSON_S} strength={0.6} />
        <Traced paths={MASKS.johnson.data.shapes.subject} place={pl} at={a + 6} dur={12} width={5} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.6) 100%)'}} />
      </div>
      <div style={{position: 'absolute', left: 962, top: 0, width: 958, height: 1080, overflow: 'hidden', filter: `brightness(${dimR})`}}>
        <Picture src={HOME} place={pr} size={HOME_S} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.6) 100%)'}} />
      </div>
      <div style={{position: 'absolute', left: 958, top: 0, width: 4, height: 1080, background: '#ece6d8'}} />
      <Header text="HIS SUPPORTERS" x={130} color={TEAL} at={t.at('supporters')} />
      <Header text="RADICALS · FREEDPEOPLE" x={1010} color={CORAL} at={r} />
      <Slip text="following the Constitution" x={120} y={750} size={48} at={t.at('following')} />
      <Slip text="states run their own affairs" x={150} y={845} size={48} rot={2} at={t.at('states run')} />
      <Slip text="heal the country fast" x={120} y={922} size={48} at={t.at('heal')} />
      <Slip text="handed the South back…" x={1010} y={200} size={52} at={t.at('handed the South')} coral />
      <Slip text="…to the men who led it out" x={1060} y={310} size={52} rot={2} at={t.at('led it out')} />
      <Tag text="Andrew Johnson, A. Bogardus & Co., 1865 · LOC" />
      <Tag text="A freed family at home, St. Helena Island, S.C., 1863 · LOC" x={1004} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ 3 · Edisto, the words
const Edisto: React.FC = () => (
  <Photo src="img/ch10/edisto_seabrook_quarters_1862_moore.jpg" size={[3000, 2301]} fx={1500} fy={1050} z0={1.04} z1={1.12} a={S_EDISTO} b={S_WORDS}>
    {() => (
      <>
        <Slip text="Edisto Island" x={130} y={110} size={58} at={t.at('Edisto')} />
        <Slip text="1866: the land goes back" x={1120} y={150} size={58} rot={2} at={t.at('lost the land')} coral />
        <Tag text="Henry P. Moore, Seabrook's quarters, Edisto Island, S.C., 1862 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** Mounts its children from `at`, popping in (Win has no `at` of its own). */
const Gate: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.15, 0.98, 1], clamp);
  return <AbsoluteFill style={{transform: `scale(${k})`, opacity: interpolate(f, [at, at + 2], [0, 1], clamp)}}>{children}</AbsoluteFill>;
};

/** A hand-drawn tick or cross, drawn on. */
const Mark: React.FC<{kind: 'yes' | 'no'; x: number; y: number; at: number; s?: number}> = ({kind, x, y, at, s = 70}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 6], [0, 1], clamp);
  const q = interpolate(g, [at + 4, at + 9], [0, 1], clamp);
  const c = kind === 'yes' ? TEAL : CORAL;
  const st = {fill: 'none', stroke: c, strokeWidth: 12, strokeLinecap: 'round' as const, pathLength: 1, strokeDasharray: 1};
  return (
    <svg width={s * 1.4} height={s * 1.4} style={{position: 'absolute', left: x, top: y, overflow: 'visible', filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,0.55))'}}>
      {kind === 'yes'
        ? <path d={`M${s * 0.1},${s * 0.6} L${s * 0.42},${s * 0.95} L${s * 1.2},${s * 0.05}`} {...st} strokeDashoffset={1 - p} />
        : <>
          <path d={`M${s * 0.1},${s * 0.1} L${s * 1.1},${s * 1.1}`} {...st} strokeDashoffset={1 - p} />
          <path d={`M${s * 1.1},${s * 0.1} L${s * 0.1},${s * 1.1}`} {...st} strokeDashoffset={1 - q} />
        </>}
    </svg>
  );
};

// the three words on the motif strip (cr_three_words.png, 1000 x 122, shown at w 1000)
const M_LAND: [number, number, number, number] = [112, 28, 270, 72];
const M_HOME: [number, number, number, number] = [400, 28, 245, 72];
const M_VOTE: [number, number, number, number] = [698, 28, 230, 72];
const T13 = 'img/ch06/vox/thirteenth_src.jpg';
const T14 = 'img/ch08/fourteenth_amendment_joint_resolution_1866_p1.jpg';

/** Their three words, again; then what they had by the end of 1866 (the law), and what they didn't (the land). */
const Words: React.FC = () => {
  const law = t.at('The law'), land = t.at('the land', 2);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Motif x={460} y={110} w={1000} at={S_WORDS} under={
        <div style={{position: 'absolute', left: 0, top: 0, width: 1000, height: 122}}>
          <Swipe lines={[M_LAND]} from={t.at('Landless')} to={t.end('Landless')} seed="m1" />
          <Swipe lines={[M_HOME]} from={t.at('Homeless')} to={t.end('Homeless')} seed="m2" />
          <Swipe lines={[M_VOTE]} from={t.at('Voteless')} to={t.end('Voteless')} seed="m3" />
        </div>
      } />
      <Slip text="by the end of 1866" x={730} y={290} size={52} at={t.at('By the end')} out={law} />
      {/* LAW, left: the 13th in force, the 14th on its way */}
      <Slip text="the law" x={280} y={330} size={84} at={law} />
      <Mark kind="yes" x={600} y={320} at={law + 6} />
      <Gate at={t.at('Slavery was gone')}><Win src={T13} cx={1050} cy={985} s={0.55} w={600} h={180} x={170} y={500} r={-2} filter={DOC_F} /></Gate>
      <Gate at={t.at('14th Amendment', 2)}><Win src={T14} cx={820} cy={1170} s={0.62} w={600} h={180} x={200} y={740} r={1.5} filter="grayscale(1) brightness(0.62) contrast(4) brightness(1.35)" /></Gate>
      <Slip text="13th: slavery gone" x={230} y={640} size={46} at={t.at('Slavery was gone') + 4} />
      <Slip text="14th: on its way" x={260} y={880} size={46} rot={2} at={t.at('14th Amendment', 2) + 4} />
      {/* LAND, right */}
      <Slip text="the land" x={1180} y={330} size={84} rot={2} at={land - 2} coral />
      <Mark kind="no" x={1520} y={320} at={land + 4} />
      <Gate at={land - 2}><Win src="img/wall/acres.jpg" cx={900} cy={560} s={0.36} w={600} h={300} x={1150} y={500} r={2} filter="grayscale(0.2) brightness(0.8)" /></Gate>
      {[t.at('Slavery was gone'), t.at('14th Amendment', 2), land - 2].map((f) => <Sfx key={f} at={f} src="sfx/tick.wav" volume={0.38} />)}
      <Sfx at={law} src="sfx/tick_soft.wav" volume={0.3} />
      <Tag text="Edisto committee to Gen. Howard, Oct. 1865 · 13th Amendment, 1865 · 14th Amendment, 1866 · National Archives; Library of Congress" />
    </AbsoluteFill>
  );
};

/** One of those three words was about to change: back to Bram's letter, a teal loop round VOTELESS. */
const Change: React.FC = () => (
  <DocShot src={THREE_WORDS} size={EDISTO.wordsSize} seed="lhv" tag={SRC.letter} focusAt={S_CHANGE}
    keys={[[S_CHANGE, {x: 620, y: 420, z: 1.3}], [t.at('three words', 2), {x: 760, y: 420, z: 1.5}], [S_NEXT, {x: 820, y: 420, z: 1.62}]]}>
    <Swipe lines={[EDISTO.landless, EDISTO.homeless]} from={-10} to={-9} seed="cg" color="rgba(255,111,97,0.55)" />
    <Loop cx={860} cy={420} rx={185} ry={62} at={t.at('three words', 2)} dur={14} width={9} seed={10} tilt={-2} />
  </DocShot>
);

// ------------------------------------------------------------------------------------------ 4 · next time
const SENATORS = 'img/wall/senators.jpg';
const NextPush: React.FC = () => {
  const f = useCurrentFrame();
  const sen = t.at('a Black senator');
  const push = interpolate(f, [sen - 12, sen + 14], [0, 1], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  const fx = 512 + (300 - 512) * push, fy = 352 + (330 - 352) * push, z = 1.0 + (1.75 - 1.0) * push;
  return (
    <Photo src={SENATORS} size={[1024, 782]} fx={fx} fy={fy} z0={z} z1={z} a={S_NEXT} b={S_END}>
      {(p) => {
        const S = onScreen(p);
        const [cx, cy] = S(205, 300);
        return (
          <>
            <Highlight text="NEXT TIME" x={110} y={100} size={84} at={t.at('Next time')} seed={101} rot={-2} />
            <Slip text="the army goes back South" x={130} y={240} size={54} at={t.at('army')} out={sen - 12} />
            <Slip text="Mississippi, Jefferson Davis's home state" x={130} y={240} size={50} at={t.at('Mississippi')} out={sen - 12} />
            {f >= sen + 14 && <Loop cx={cx} cy={cy} rx={150} ry={190} at={sen + 14} dur={12} width={7} seed={12} />}
            <Slip text="Hiram Revels · 1870" x={1150} y={760} size={60} rot={-2} at={sen + 20} coral />
            <Tag text="The First Colored Senator and Representatives, Currier & Ives, 1872 · Library of Congress" />
          </>
        );
      }}
    </Photo>
  );
};

// ------------------------------------------------------------------------------------------ 5 · the end screen
/**
 * Over the whole board, dimmed after the last word, two clean slots for YouTube's end-screen elements: a video at
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
      <Slip text="part two" x={170} y={790} size={54} rot={2} at={t.at('part two')} />
      <Slip text="subscribe" x={1330} y={745} size={62} at={t.at('subscribe')} coral />
    </AbsoluteFill>
  );
};

// the whole board, inside the title-safe margin (z 0.8 keeps the chalked LAW/LAND and the sign-off strip clear of the edge)
const END_CAM: BoardKey[] = [[S_END, 960, 540, 0.82], [S_END + 800, 960, 540, 0.79]];

const Body: React.FC = () => {
  const scene = useScene([
    [0, <EpBoard key="r" ch={10} from={0} at={0} cam={RECAP} whoosh={false} />],
    [S_VIEWS, <TwoViews key="v" />],
    [S_EDISTO, <Edisto key="e" />],
    [S_WORDS, <Words key="w" />],
    [S_CHANGE, <Change key="c" />],
    [S_NEXT, <NextPush key="n" />],
    [S_END, <EpBoard key="end" ch={10} from={S_END} at={S_END} cam={END_CAM} overlay={<EndOverlay />}><BoardSignoff at={S_END + 6} /></EpBoard>],
  ]);
  return (
    <>
      {scene}
      <Cuts />
      <Sfx at={t.at('Next time')} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={t.at('a Black senator') + 14} src="sfx/marker_tick.wav" volume={0.22} />
      <Sfx at={t.at('three words', 2)} src="sfx/marker_tick.wav" volume={0.22} />
    </>
  );
};

/** Music (MUSIC.md): r_ending from the top (its build peaks under "the law", its hush and last swell land on "What they
 *  still didn't have was the land", and it dies away under "about to change"); a second pass of its warm opening under the
 *  teaser and the thank-you; then, after the last word only, "Roll, Jordan, Roll" over the end screen. */
const ROLL = SAID + 3;
export const Ch10: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch10_landless.wav" lead={LEAD} extra={EXTRA}
    music={[
      {src: 'music/r_ending.mp3', volume: 0.15},
      {src: 'music/r_ending.mp3', volume: 0.11, from: S_NEXT - 6, to: ROLL + 24, fadeOut: 40},
      {src: 'music/period/roll_jordan_fisk_1909.mp3', volume: 0.42, from: ROLL},
    ]}>
    <Body />
  </ChapterShell>
);
