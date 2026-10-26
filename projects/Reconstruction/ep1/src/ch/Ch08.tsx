// Chapter 8 · Equal Protection. Built on the Ch06 model (cuts two frames before a phrase, the page read by the camera
// with the coral swipe, the board at the end); the subscribe plug plays over the board.
// Sources: the enrolled joint resolution proposing the 14th Amendment, June 1866 (National Archives); Dred Scott, c.1857;
// "Extract Const. Amend.", Harper's Weekly, 1866; the Mississippi vagrant act in the Weekly Copiahan, Dec. 30, 1865 (ch06);
// G. N. Barnard, The Capitol, Nashville, 1863. Tennessee ratified July 19, 1866; the other ten former Confederate states
// rejected the amendment in 1866-67.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch08_equal_protection.words.json';
import VA from '../../public/img/ch06/vox/ms_vagrant_act.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Arrow, Highlight, JF, Tag, useGFrame} from '../kit/Kit';
import {Person} from '../kit/figures';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Stamp, useScene} from '../kit/shell';
import {EpBoard} from '../kit/ep1board';
import {MASKS} from '../masks';
import {type Box, CORAL, DocShot, FocusIn, Sheet, type SheetCam, Slip, Spot, Swipe, TEAL, Tear} from '../kit/rc';
import {tornPoly} from '../kit/vox';
import {Ink, PageWin, PrintShot} from './ch07_kit';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH08_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------------------------------------------ pictures
const T14 = 'img/ch08/fourteenth_amendment_joint_resolution_1866_p1.jpg';
const T14_S: [number, number] = [1920, 2514];
const T14F = 'grayscale(1) brightness(0.72) contrast(3.2) sepia(0.12)';   // faint brown ink: darken, then stretch
// Section 1 (source px), drawn on the page and checked
const ONE: Box[] = [[280, 1160, 1080, 52], [705, 1228, 640, 52]];                        // "All persons born or naturalized in the United States," / "are citizens of the United States"
const TWO: Box[] = [[1475, 1365, 175, 50], [155, 1425, 1500, 55], [155, 1495, 95, 50]]; // "nor shall / any State deprive any person of life, liberty, or property, without due process of / law;"
const THREE: Box[] = [[262, 1495, 1345, 55], [155, 1555, 220, 50]];                      // "nor deny to any person within its jurisdiction the equal protection of / the laws."
const CARTOON = 'img/ch08/extract_const_amend_cartoon_1866.jpg';
const VAGRANT = 'img/ch06/vox/ms_vagrant_act.jpg';
const V_TITLE = VA.phrases['To Amend the Vagrant Laws'] as Box[];

const SRC = {
  t14: 'Joint resolution proposing the 14th Amendment, June 1866 · National Archives',
  dred: 'Dred Scott, photograph, c.1857 · Wikimedia Commons',
  cartoon: 'Extract Const. Amend., Harper\'s Weekly, 1866 · Library of Congress',
  codes: 'Weekly Copiahan (Hazlehurst, Miss.), Dec. 30, 1865 · LOC / 14th Amendment, 1866 · National Archives',
  capitol: 'G. N. Barnard, The Capitol, Nashville, 1863 · Library of Congress',
  votes: 'Ratification votes, former Confederate states, 1866-67',
};

// ------------------------------------------------------------------------------------------------------ the cuts
const TEAR = t.at('The Constitution') - 3;
const S_MOD = t.at('Meanwhile') - 2;
const S_14 = t.at('So in June') - 2;
const S_ONE = t.at('One Anyone') - 2;
const S_DRED = t.at('That overturned') - 2;
const S_TWO = t.at('Two No state') - 2;
const S_THREE = t.at('Three No state') - 2;
const S_TRANS = t.at('Translation') - 2;
const S_CODES = t.at('Sound familiar') - 2;
const S_RATIFY = t.at('The states still') - 2;
const S_TILES = t.at('And they did') - 2;
const S_BOARD = t.at('Which must have made') - 2;

const Cuts: React.FC = () => (
  <>{[S_MOD, S_14, S_ONE, S_DRED, S_TWO, S_THREE, S_TRANS, S_CODES, S_RATIFY, S_TILES].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />)}</>
);
const Stamps: React.FC<{at: number[]}> = ({at}) => <>{at.map((f) => <Sfx key={f} at={f} src="sfx/stamp.wav" volume={0.33} />)}</>;

// ------------------------------------------------------------------------------------------------------ shots
/** A law can be undone: the Civil Rights Act as a typed card, which tears away to the Constitution underneath. */
const LawCard: React.FC = () => {
  const f = useCurrentFrame();
  const W = 1000, H = 520;
  const top = (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={2}>
        <div style={{position: 'absolute', left: 960 - W / 2, top: 540 - H / 2, width: W, height: H, transform: `rotate(-2deg) scale(${1 + f * 0.0004})`,
          filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}}>
          <div style={{position: 'absolute', inset: 0, background: '#ece6d8', clipPath: tornPoly('law', W, H, 9)}}>
            <div style={{position: 'absolute', left: 70, top: 64, fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: '#3a3a3a'}}>AN ACT OF CONGRESS · APRIL 9, 1866</div>
            <div style={{position: 'absolute', left: 66, top: 120, fontFamily: JF.display, fontSize: 96, lineHeight: 1.05, color: '#151515'}}>Civil Rights Act</div>
            <div style={{position: 'absolute', left: 70, top: 260, width: 860, borderTop: '3px solid #151515'}} />
            <div style={{position: 'absolute', left: 70, top: 290, fontFamily: JF.mono, fontSize: 30, lineHeight: 1.6, color: '#222'}}>
              born here = a citizen<br />sign contracts · own property · go to court
            </div>
          </div>
        </div>
      </FocusIn>
      <Slip text="repealed?" x={1270} y={180} rot={4} at={t.at('repealed')} coral />
      <Slip text="struck down?" x={330} y={830} rot={-3} at={t.at('struck down')} coral />
    </AbsoluteFill>
  );
  return (
    <Tear at={TEAR} top={top} seed="law">
      <DarkPaper />
      <Sheet src={T14} size={T14_S} cam={{x: 960, y: 1257 - (f - TEAR) * 0.6, z: 0.42}} seed="t14" filter={T14F} />
      <Tag text={SRC.t14} />
    </Tear>
  );
};

/** Every veto pushed moderate Republicans over to the Radicals. Drawn figures cross from one side to the other. */
const Moderates: React.FC = () => {
  const g = useGFrame();
  const w1 = t.at('pushed'), w2 = t.at('over to the');
  const move = (i: number) => (i >= 5 ? w1 + (7 - i) * 2 : i >= 3 ? w2 + (4 - i) * 2 : 1e7);
  const slot = (i: number) => (i >= 5 ? 7 - i + 3 : i >= 3 ? 4 - i + 6 : 0); // right-hand slot after the move
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 150, top: 330, fontFamily: JF.mono, fontSize: 38, letterSpacing: 2, color: TEAL}}>MODERATE REPUBLICANS</div>
      <div style={{position: 'absolute', left: 1080, top: 330, fontFamily: JF.mono, fontSize: 38, letterSpacing: 2, color: CORAL}}>RADICALS</div>
      <div style={{position: 'absolute', left: 958, top: 320, height: 520, borderLeft: '3px solid rgba(244,239,230,0.35)'}} />
      {[0, 1, 2].map((i) => <Person key={`r${i}`} x={1110 + i * 78} y={800} h={210} color={CORAL} at={S_MOD + 2} />)}
      {Array.from({length: 8}, (_, i) => {
        const m = move(i);
        const p = interpolate(g, [m, m + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const e = 1 - Math.pow(1 - p, 3);
        const x0 = 180 + i * 78, x1 = 1110 + slot(i) * 78;
        return <Person key={`m${i}`} x={x0 + (x1 - x0) * e} y={800} h={210} color={p >= 1 ? CORAL : '#f4efe6'} at={S_MOD + 2} />;
      })}
      <Stamp text="VETO" x={720} y={150} size={90} color={CORAL} rot={-8} at={t.at('veto')} />
      <Stamp text="VETO" x={800} y={190} size={90} color={CORAL} rot={5} at={t.at('Republicans') - 3} />
      <Stamps at={[t.at('veto'), t.at('Republicans') - 3]} />
    </AbsoluteFill>
  );
};

/** The 14th Amendment: the enrolled joint resolution, then down to Section 1. */
const Fourteenth: React.FC = () => (
  <>
    <DocShot src={T14} size={T14_S} tag={SRC.t14} filter={T14F} focusAt={S_14}
      keys={[[S_14, {x: 960, y: 1240, z: 0.42}], [t.at('Its first section'), {x: 940, y: 1260, z: 0.46}], [S_ONE, {x: 900, y: 1300, z: 0.74}]]}
      over={<>
        <Slip text="June 1866" x={1460} y={140} rot={2} at={t.at('June')} />
        <Highlight text="14TH AMENDMENT" x={110} y={106} size={84} at={t.at('14th')} seed={81} rot={-2} />
        <Definition term="14th Amendment" def="a change to the Constitution: citizenship and equal rights under the law" at={t.at('14th') + 10} x={120} y={840} />
      </>} />
    <Stamps at={[t.at('14th')]} />
  </>
);

/** "SECTION 1 · n/3", top right, on a dark tab so it reads over the bright page. */
const PartNo: React.FC<{n: number; at: number}> = ({n, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', right: 110, top: 96, fontFamily: JF.mono, fontSize: 34, letterSpacing: 2, color: '#f4efe6', background: 'rgba(12,11,9,0.82)', padding: '6px 18px'}}>SECTION 1 · {n}/3</div>;
};

/** One part of Section 1, read along the tilted page. */
const Part: React.FC<{n: number; y: number; from: number; to: number; xs: [number, number]; lines: Box[]; swFrom: number; swTo: number; ink: Box[][]; children?: React.ReactNode}> = ({
  n, y, from, to, xs, lines, swFrom, swTo, ink, children,
}) => {
  const L: SheetCam = {x: xs[0], y, z: 1.02, tilt: 32, dof: 2.6, band: 60};
  return (
    <DocShot src={T14} size={T14_S} tag={SRC.t14} filter={T14F} carryFrom={from} carryTo={to}
      keys={[[from, L], [swTo, {...L, x: xs[1]}], [to, {...L, x: xs[1] + 40, z: 1.06}]]}
      over={<><PartNo n={n} at={from} />{children}</>}>
      {ink.map((b, i) => <Ink key={i} lines={b} seed={`i${i}`} />)}
      <Swipe lines={lines} from={swFrom} to={swTo} seed={`p${n}`} />
    </DocShot>
  );
};

/** Dred Scott: the photograph, and the decision the first part overturned. */
const Dred: React.FC = () => (
  <>
    <PrintShot src="img/ch08/cr_dred_scott.png" size={[900, 1159]} a={S_DRED} b={S_TWO} w={560} x={480} tag={SRC.dred} mask={MASKS.dred_scott} tintAt={t.at('Dred Scott')}>
      <Slip text="overturned" x={1000} y={330} rot={-3} at={t.at('overturned')} coral />
      <Highlight text="DRED SCOTT DECISION" x={860} y={106} size={62} at={t.at('Dred Scott')} seed={83} rot={-2} />
      <Definition term="Dred Scott decision" def="1857: the Supreme Court said Black Americans could never be citizens" at={t.at('Dred Scott') + 10} x={860} y={700} w={880} />
    </PrintShot>
    <Stamps at={[t.at('Dred Scott')]} />
  </>
);

/** Translation, over the equal-protection line. */
const Trans: React.FC = () => (
  <DocShot src={T14} size={T14_S} tag={SRC.t14} filter={T14F} keys={[[S_TRANS, {x: 880, y: 1530, z: 0.82}], [S_CODES, {x: 900, y: 1530, z: 0.86}]]}
    over={<>
      <Slip text="translation:" x={160} y={120} rot={-3} at={t.at('Translation')} size={70} />
      <Slip text="one set of laws for white people" x={260} y={250} rot={-1} at={t.at('one set')} />
      <Slip text="another for Black people" x={560} y={760} rot={2} at={t.at('another')} />
      <Slip text="not allowed" x={1240} y={880} rot={-3} at={t.end('Black people') - 4} coral />
    </>}>
    <Ink lines={THREE} seed="i3" />
    <Spot size={T14_S} boxes={THREE} at={S_TRANS} id="tr" dark={0.55} />
  </DocShot>
);

/** Sound familiar? The Mississippi act from ch06, and the line aimed at it. */
const Codes: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <FocusIn at={S_CODES}>
      <PageWin src={VAGRANT} cx={500} cy={3320} s={1.0} w={800} h={290} x={110} y={300} r={-2}>
        <Ink lines={V_TITLE} seed="cv" />
      </PageWin>
    </FocusIn>
    <FocusIn at={t.at('aimed straight')}>
      <PageWin src={T14} cx={880} cy={1540} s={0.6} w={800} h={290} x={1010} y={320} r={1.5} filter={T14F}>
        <Ink lines={THREE} seed="c3" />
      </PageWin>
    </FocusIn>
    <Slip text="Black Codes · Mississippi, 1865" x={150} y={650} rot={-2} at={S_CODES + 4} size={54} />
    <Slip text="14th Amendment · 1866" x={1120} y={670} rot={2} at={t.at('aimed straight') + 4} size={54} />
    <Arrow x1={1060} y1={580} x2={880} y2={580} bow={-70} color={CORAL} width={7} at={t.at('straight at')} />
    <Slip text="the reason it exists" x={640} y={830} rot={-2} at={t.at('are why')} coral />
    <Sfx at={t.at('aimed straight')} src="sfx/tick.wav" volume={0.4} />
    <Tag text={SRC.codes} />
  </AbsoluteFill>
);

/** Johnson tells the South to vote it down: Harper's "Extract Const. Amend." (a light touch). */
const Ratify: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [S_RATIFY, S_TILES], [1, 1.04], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S_RATIFY}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${k})`, transformOrigin: '560px 540px'}}>
          <PageWin src={CARTOON} cx={1110} cy={1330} s={0.6} w={1000} h={1000} x={110} y={40} r={-1} filter="grayscale(1) contrast(1.3) brightness(1.02)" />
        </div>
      </FocusIn>
      <Slip text="¾ of the states must say yes" x={1150} y={300} rot={2} at={t.at('ratify')} size={54} />
      <Slip text="Johnson: vote no" x={1240} y={430} rot={-2} at={t.at('vote it down')} coral />
      <Sfx at={S_RATIFY} src="sfx/tick.wav" volume={0.35} />
      <Tag text={SRC.cartoon} />
    </AbsoluteFill>
  );
};

/** The former Confederate states, as tiles: ten say no, Tennessee says yes. Then Johnson's home state. */
const TILES: [string, number, number, number][] = [
  ['VA', 4, 0, 2], ['AR', 0, 1, 1], ['TN', 1, 1, 3], ['NC', 4, 1, 2], ['TX', 0, 2, 1], ['LA', 1, 2, 1], ['MS', 2, 2, 1], ['AL', 3, 2, 1], ['GA', 4, 2, 1], ['SC', 5, 2, 1], ['FL', 4, 3, 1],
];
const Tiles: React.FC = () => {
  const g = useGFrame();
  const S = 140, G = 12, X = 150, Y = 280;
  const no = t.at('did');
  const tn = t.at('Tennessee');
  const home = t.at('home state');
  const printAt = home - 2;
  let k = 0;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: X, top: 190, fontFamily: JF.mono, fontSize: 28, letterSpacing: 2, color: '#f4efe6'}}>THE FORMER CONFEDERATE STATES</div>
      {TILES.map(([code, c, r, w]) => {
        const isTN = code === 'TN';
        const at = isTN ? tn : no + 2 * k++;
        const on = g >= at;
        const pop = interpolate(g, [at, at + 3, at + 6], [1, 1.15, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const bg = on ? (isTN ? TEAL : 'rgba(244,239,230,0.07)') : 'rgba(244,239,230,0.16)';
        return (
          <div key={code} style={{position: 'absolute', left: X + c * (S + G), top: Y + r * (S + G), width: w * S + (w - 1) * G, height: S, background: bg,
            border: `3px solid ${on && !isTN ? 'rgba(244,239,230,0.3)' : 'rgba(244,239,230,0.6)'}`, boxSizing: 'border-box', transform: `scale(${pop})`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.5)'}}>
            <div style={{fontFamily: JF.display, fontSize: 52, lineHeight: 1, color: on && isTN ? '#111' : on ? 'rgba(244,239,230,0.5)' : '#f4efe6'}}>{code}</div>
            {on && <div style={{fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, marginTop: 6, color: isTN ? '#111' : CORAL}}>{isTN ? 'YES' : 'NO'}</div>}
          </div>
        );
      })}
      {g >= printAt && (
        <FocusIn at={printAt}>
          <Img src={staticFile('img/ch08/cr_capitol.png')} style={{position: 'absolute', left: 1120, top: 300, width: 680, height: 488, transform: 'rotate(2deg)',
            filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} />
        </FocusIn>
      )}
      <Slip text="Tennessee: yes, July 1866" x={1140} y={850} rot={-2} at={home + 6} size={54} />
      <Sfx at={tn} src="sfx/tick.wav" volume={0.45} />
      <Sfx at={printAt} src="sfx/tick.wav" volume={0.35} />
      <Tag text={g >= printAt ? SRC.capitol : SRC.votes} />
    </AbsoluteFill>
  );
};

/** The board; the dry aside on a coral slip, then the subscribe plug with its own slip. */
const Board: React.FC = () => (
  <EpBoard ch={8} from={S_BOARD} at={t.at('awkward trip home')}
    overlay={<>
      <Slip text="awkward." x={1400} y={150} rot={3} at={t.at('awkward') + 4} coral out={t.at('Quick thing')} />
      <Slip text="subscribe ↓" x={1420} y={860} rot={-3} at={t.at('hit subscribe')} />
    </>} />
);

/** Music (MUSIC.md): r_abolition_b (determined build) under the whole chapter; it lifts after the last word. */
const Body: React.FC = () => {
  const scene = useScene([
    [0, <LawCard key="law" />],
    [S_MOD, <Moderates key="mod" />],
    [S_14, <Fourteenth key="14" />],
    [S_ONE, <Part key="p1" n={1} y={1215} from={S_ONE} to={S_DRED} xs={[560, 980]} lines={ONE} swFrom={t.at('Anyone')} swTo={t.end('is a citizen')} ink={[]} />],
    [S_DRED, <Dred key="dred" />],
    [S_TWO, <Part key="p2" n={2} y={1440} from={S_TWO} to={S_THREE} xs={[620, 1180]} lines={TWO} swFrom={t.at('Two No state') + 15} swTo={t.end('legal process')} ink={[ONE]}>
      <Highlight text="DUE PROCESS" x={110} y={106} size={84} at={t.at('due process')} seed={85} rot={-2} />
      <Definition term="due process" def="fair legal steps before a state can take your life, liberty or property" at={t.at('due process') + 9} x={120} y={840} />
    </Part>],
    [S_THREE, <Part key="p3" n={3} y={1520} from={S_THREE} to={S_TRANS} xs={[600, 1150]} lines={THREE} swFrom={t.at('No state can deny')} swTo={t.end('of the laws')} ink={[ONE, TWO]}>
      <Highlight text="EQUAL PROTECTION" x={110} y={106} size={84} at={t.at('Equal protection', 2)} seed={87} rot={-2} />
      <Definition term="equal protection" def="the same laws, applied the same way, to everyone" at={t.at('Equal protection', 2) + 9} x={120} y={840} />
    </Part>],
    [S_TRANS, <Trans key="tr" />],
    [S_CODES, <Codes key="codes" />],
    [S_RATIFY, <Ratify key="rat" />],
    [S_TILES, <Tiles key="tiles" />],
    [S_BOARD, <Board key="b" />],
  ]);
  return <>{scene}<Cuts /><Stamps at={[t.at('due process'), t.at('Equal protection', 2)]} /></>;
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_equal_protection.wav" lead={LEAD} music={[{src: 'music/r_abolition_b.mp3', volume: 0.14}]}>
    <Body />
  </ChapterShell>
);
