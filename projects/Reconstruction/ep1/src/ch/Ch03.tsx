// Chapter 3 · Ten Percent. Reconstruction defined; who was in charge of it (Congress vs the President, and the veto);
// Lincoln's Proclamation of Amnesty and Reconstruction (Dec. 8, 1863: the one-tenth clause, the pardon); the Republicans
// and the Radicals; the Wade-Davis bill's majority and Lincoln's pocket veto; one plan each, and nobody had won.
// Sources: Lincoln Papers (LOC) for the proclamation; the 1864 printing of the Wade-Davis bill and Lincoln's July 8, 1864
// proclamation (LOC, Stern Collection).
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch03_ten_percent.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Highlight, Tag} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, Stamp, useScene} from '../kit/shell';
import {Route, Slab, StateTiles, UNION_FREE_1861, BORDER_1861} from '../kit/map3d';
import {Person} from '../kit/figures';
import {EpBoard} from '../kit/ep1board';
import {type Box, camAt, carry, CORAL, cut, DOC_F, FocusIn, PhotoShot, Sheet, type SheetCam, Slip, Swipe, TEAL} from '../kit/rc';
import {MASKS} from '../masks';
import {CONF, MAP_TAG, shiftPath, TopShade, ucam, US, UsMap} from './ch02_maps';
import {BillArrow, BranchCard} from './ch03_cards';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
/** The board after the last word. */
const EXTRA = 30;
export const CH03_FRAMES = chapterFrames(N, LEAD) + EXTRA;

// sources
const P1 = 'img/ch03/lincoln_amnesty_proclamation_8dec1863_p1_title.jpg';
const P1_S: [number, number] = [1939, 3000];
const P3 = 'img/ch03/lincoln_amnesty_proclamation_8dec1863_p3_one_tenth_clause.jpg';
const P3_S: [number, number] = [1942, 3000];
const P7 = 'img/ch03/lincoln_amnesty_proclamation_8dec1863_p7_signed.jpg';
const P7_S: [number, number] = [1951, 3000];
const WD = 'img/ch03/wade_davis_bill_text_printed_1864_p2_majority_clause.jpg';
const WD_S: [number, number] = [1516, 2219];
const PV = 'img/ch03/lincoln_proclamation_wade_davis_pocket_veto_8jul1864.jpg';
const PV_S: [number, number] = [1508, 2240];
const MS_F = 'grayscale(1) sepia(0.15) contrast(1.3) brightness(1.04)';   // the manuscript: keep the pen strokes soft
const SRC = {
  amnesty: 'Lincoln, Proclamation of Amnesty and Reconstruction, Dec. 8, 1863 · Library of Congress',
  lincoln: 'Abraham Lincoln, Feb. 1865 · Alexander Gardner · Library of Congress',
  radicals: 'Thaddeus Stevens · Benjamin Wade, c.1859 · Henry Winter Davis · Library of Congress',
  freed: 'Sweet potato planting, Hopkinson plantation, Edisto Island, 1862 · Henry P. Moore · Library of Congress',
  wd: 'The Wade-Davis bill, as printed in 1864 · Library of Congress',
  pv: "Lincoln's proclamation on the Wade-Davis bill, July 8, 1864 · Library of Congress",
};

// line boxes (source px), each drawn on its page and checked
const TITLE: Box = [680, 245, 690, 80];              // p1 "Proclamation."
const PARDONS: Box = [1020, 610, 800, 75];           // p1 "and pardons for offences"
const TENTH: Box[] = [[1140, 1420, 640, 70], [110, 1505, 750, 70]];   // p3 "not less than one / tenth, in number of the votes cast"
const MAJ: Box = [683, 1693, 542, 36];               // "a majority of the persons enrolled"
const NOTSIGNED: Box = [905, 815, 385, 36];          // "was not signed by him"

// the shots
const S1 = c('The first fight'), S2 = c('Quick refresher'), S3 = c('President Abraham'), S4 = c('In 1863'), S5 = c('Once 10 percent'), S6 = c('And most Confederates');
const S7 = c("That's the Ten Percent"), S8 = c('Lincoln wanted'), S9 = c('But many in'), S10 = c('Its most determined'), S11 = c('freedpeople'), S12 = c('To them');
const S13 = c('So Congress passed'), S14 = c('Lincoln let it die'), S15 = c('So the President had'), B = c('And when the war ended');

const Until: React.FC<{out: number; children: React.ReactNode}> = ({out, children}) => (useCurrentFrame() < out ? <>{children}</> : null);

const Sounds: React.FC = () => (
  <>
    {[S1, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.22} />)}
    {['Reconstruction', 'veto', 'pardon', 'Ten Percent Plan', 'Republican', 'Radical Republicans', 'freedpeople', 'Wade-Davis', '4 million'].map((p) => (
      <Sfx key={p} at={t.at(p)} src="sfx/stamp.wav" volume={0.3} />
    ))}
  </>
);

// ---------------------------------------------------------------------------------------------------------- shots
const AWAY = {dx: 60, dy: 75};   // where ch02 left the South: broken away

/** Reconstruction: the South, broken away at the end of ch02, slides back into the Union. */
const PutBack: React.FC = () => {
  const keys = [ucam(0, 3720, 2470, 0.54, 40, -4), ucam(S1, 3740, 2440, 0.6, 42, -6)];
  const r = t.at('Reconstruction');
  return (
    <AbsoluteFill>
      <UsMap keys={keys}>
        {(api) => (
          <>
            <StateTiles api={api} names={[...UNION_FREE_1861, ...BORDER_1861]} at={-200} stagger={0} h={24} color={TEAL} layers={5} />
            <Slab api={api} d={shiftPath(US.regions.confed, AWAY.dx, AWAY.dy)} at={-200} h={34} dur={14} color={CONF} layers={8}
              slide={{at: t.at('back into the Union') - 4, dur: 22, dx: -AWAY.dx, dy: -AWAY.dy, lift: 26}} />
          </>
        )}
      </UsMap>
      <TopShade />
      <Highlight text="RECONSTRUCTION" x={110} y={100} size={84} at={r} seed={31} rot={-2} />
      <Definition term="Reconstruction" def="bringing the South back into the Union, and deciding what freedom would mean" at={r + 9} x={120} y={860} w={1300} />
      <Stamp text="4 million" x={1060} y={330} size={130} at={t.at('4 million')} rot={-3} />
      <Slip text="people just freed" x={1150} y={490} rot={2} at={t.at('just been freed') - 2} />
      <Tag text={MAP_TAG} />
    </AbsoluteFill>
  );
};

const CONG = {x: 190, y: 290}, PRES = {x: 1260, y: 290};

/** Who was in charge: Congress and the President; the refresher (bill, sign, veto); and the gap in the Constitution. */
const Who: React.FC = () => {
  const v = t.at('veto');
  const gap = t.at('how a state');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <BranchCard name="CONGRESS" sub="THE CAPITOL" x={CONG.x} y={CONG.y} at={S1 + 2} rot={-1.5} />
      <BranchCard name="PRESIDENT" sub="THE WHITE HOUSE" x={PRES.x} y={PRES.y} at={S1 + 8} rot={1.5} />
      <Slip text="who's in charge?" x={720} y={120} coral size={70} rot={-2} at={t.at('who was in charge') - 2} out={S2} />
      <Slip text="writes the laws" x={240} y={580} rot={-2} at={t.at('writes the laws') - 2} />
      <BillArrow x1={690} x2={1240} y={420} at={t.at('writes the laws') + 6} label="A BILL" />
      <Slip text="signs it: a law ✓" x={1290} y={580} rot={2} at={t.at('signs them') - 2} />
      <Slip text="or refuses" x={1330} y={690} rot={-2} at={t.at('refuses') - 2} />
      <Until out={gap - 2}>
        <Highlight text="VETO" x={830} y={170} size={96} at={v} seed={32} rot={-3} />
        <Definition term="veto" def="the President refusing to sign a bill into law" at={v + 9} x={120} y={860} />
      </Until>
      <Slip text="the Constitution: says nothing" x={560} y={720} coral rot={-2} at={t.at('says nothing') - 2} />
      <BranchCard name="A STATE THAT LEFT" sub="HOW DOES IT COME BACK IN?" x={520} y={810} w={880} h={200} at={gap} dashed color="#f4efe6" />
      <Tag text="Drawn: how a bill becomes law, U.S. Constitution, Art. I, Sec. 7" />
    </AbsoluteFill>
  );
};

/** A page on the desk with a camera path and its tag. */
const Doc: React.FC<{src: string; size: [number, number]; keys: [number, SheetCam][]; a: number; b: number; tag: string; filter?: string; children?: React.ReactNode; over?: React.ReactNode}> = ({
  src, size, keys, a, b, tag, filter = DOC_F, children, over,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={a}>
        <Sheet src={src} size={size} cam={camAt(keys, f)} seed={src} filter={filter} offset={[carry(f, a, b), 0]}>{children}</Sheet>
      </FocusIn>
      {over}
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

/** The Ten Percent Plan's three conditions, as slips. */
const Tenth: React.FC = () => {
  const L: SheetCam = {x: 0, y: 1480, z: 0.95, tilt: 26, dof: 2.2, band: 90};
  return (
    <Doc src={P3} size={P3_S} a={S5} b={S6} tag={SRC.amnesty} filter={MS_F}
      keys={[[S5, {...L, x: 1100}], [t.end("state's voters"), {...L, x: 700, y: 1510, dofY: 1510}], [S6, {...L, x: 760, y: 1520, dofY: 1520, z: 0.98}]]}
      over={<>
        <Slip text="10% swear loyalty" x={1150} y={140} rot={-2} at={t.at('swore loyalty') - 2} />
        <Slip text="→ a new state government" x={1020} y={760} rot={2} at={t.at('form a new') - 2} />
        <Slip text="+ accept the end of slavery" x={1000} y={870} rot={-1.5} at={t.at('accept the end') - 2} />
      </>}>
      <Swipe lines={TENTH} from={t.at('10 percent')} to={t.end("state's voters")} seed="tn" />
    </Doc>
  );
};

/** Ten voters: one swore loyalty, nine didn't have to. */
const Ten: React.FC = () => {
  const one = t.at('10 percent', 2);
  const nine = t.at('nine out of ten');
  const xs = Array.from({length: 10}, (_, i) => 300 + i * 147);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {xs.map((x, i) => <Person key={i} x={x} y={760} h={260} at={S12 + 2 + i} color="#8d877c" />)}
      <Person x={xs[0]} y={760} h={260} at={one} color={TEAL} />
      <Slip text="10%: swore loyalty" x={150} y={330} rot={-3} at={one + 2} />
      {<NineBracket x0={xs[1] - 55} x1={xs[9] + 55} y={800} at={nine} />}
      <Slip text="9 out of 10" x={1020} y={840} rot={2} at={nine + 4} />
      <Slip text="promised nothing" x={1100} y={330} coral size={70} rot={-2} at={t.at("didn't have to promise") - 2} />
      <Tag text="Drawn: one voter in ten" />
    </AbsoluteFill>
  );
};

const NineBracket: React.FC<{x0: number; x1: number; y: number; at: number}> = ({x0, x1, y, at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={`M${x0},${y} L${x0},${y + 24} L${x1},${y + 24} L${x1},${y}`} fill="none" stroke={CORAL} strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};

/** The Radicals: Stevens, Wade and Davis (no group picture exists). */
const Radicals: React.FC = () => {
  const f = useCurrentFrame();
  const r = t.at('Radical Republicans');
  const dx = carry(f, S10, S11);
  const card = (src: string, w: number, x: number, y: number, rot: number, at: number) => (
    <FocusIn at={at}><Img src={staticFile(src)} style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} /></FocusIn>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${dx}px)`}}>
        {card('img/ch03/cr_stevens_bh.png', 500, 150, 250, -2.5, S10)}
        {card('img/ch03/cr_wade.png', 430, 745, 200, 1.5, S10 + 6)}
        {card('img/ch03/cr_davis.png', 330, 1330, 175, -1.5, S10 + 12)}
      </AbsoluteFill>
      <Slip text="Thaddeus Stevens" x={230} y={720} rot={-2} size={52} at={S10 + 4} />
      <Slip text="Benjamin Wade" x={800} y={740} rot={2} size={52} at={S10 + 10} />
      <Slip text="Henry Winter Davis" x={1320} y={810} rot={-2} size={52} at={S10 + 16} />
      <Highlight text="RADICAL REPUBLICANS" x={110} y={70} size={70} at={r} seed={33} rot={-2} />
      <Definition term="Radical Republicans" def="the party's most determined members against slavery" at={r + 9} x={120} y={900} />
      <Slip text="remake the South" x={1330} y={70} coral rot={2} size={56} at={t.at('remake') - 2} />
      <Sfx at={S10} src="sfx/tick.wav" volume={0.35} />
      <Tag text={SRC.radicals} />
    </AbsoluteFill>
  );
};

/** The free North rises: the party of the North, founded to stop slavery spreading west. */
const Party: React.FC = () => {
  const r = t.at('Republican');
  const keys = [ucam(S9, 3300, 2250, 0.36, 34, -2), ucam(S10, 3200, 2200, 0.4, 36, -3)];
  return (
    <AbsoluteFill>
      <UsMap keys={keys}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={t.at('mostly Northern')} stagger={1} h={24} color={TEAL} layers={5} />
            <Route api={api} pts={[[3150, 2900], [2700, 2600], [2250, 2450]]} at={t.at('stop slavery')} dur={18} color={CORAL} width={10} dashed />
          </>
        )}
      </UsMap>
      <TopShade />
      <Slip text="his own party hated it" x={1180} y={150} coral rot={-2} at={t.at('hated it') - 2} />
      <Highlight text="REPUBLICAN" x={110} y={100} size={84} at={r} seed={34} rot={-2} />
      <Definition term="Republican Party" def="founded in 1854 to stop slavery spreading into the West" at={r + 9} x={120} y={860} />
      <Slip text="same name, very different party" x={1050} y={270} rot={2} size={56} at={t.at('Same name') - 2} />
      <Slip text="mostly Northern" x={1200} y={390} rot={-2} at={t.at('mostly Northern') - 2} />
      <Slip text="stop it spreading" x={400} y={640} coral rot={-3} at={t.at('stop slavery') + 4} />
      <Tag text={MAP_TAG} />
    </AbsoluteFill>
  );
};

/** The end: the same two cards, one plan each. */
const Plans: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <BranchCard name="PRESIDENT" sub="TEN PERCENT" x={190} y={290} at={S15 + 2} rot={-1.5} />
    <BranchCard name="CONGRESS" sub="A MAJORITY" x={1260} y={290} at={t.at('Congress had') - 1} rot={1.5} />
    <Slip text="one plan" x={300} y={600} rot={-2} size={70} at={t.at('one plan') - 2} />
    <Slip text="another" x={1390} y={600} rot={2} size={70} at={t.at('another') - 2} />
    <Tag text="Drawn: the two plans, 1863 and 1864" />
  </AbsoluteFill>
);

/** Music (MUSIC.md): j_intrigue under the whole chapter. */
const Body: React.FC = () => {
  const pd = t.at('pardon');
  const tp = t.at('Ten Percent Plan');
  const wd = t.at('Wade-Davis');
  const fp = t.at('freedpeople');
  const scene = useScene([
    [0, <PutBack key="pb" />],
    [S1, <Who key="w" />],
    [S3, <AbsoluteFill key="l">
      <Photo src="img/ch04/lincoln_gardner_feb1865.jpg" size={[2133, 2999]} fx={1070} fy={1180} z0={1.3} z1={1.38} a={S3} b={S4} mask={MASKS.lincoln} traceAt={S3 + 6} />
      <Slip text="Abraham Lincoln, Republican" x={1180} y={820} rot={-2} size={56} at={S3 + 8} />
      <Tag text={SRC.lincoln} />
    </AbsoluteFill>],
    [S4, <Doc key="p1" src={P1} size={P1_S} a={S4} b={S5} tag={SRC.amnesty} filter={MS_F}
      keys={[[S4, {x: 1000, y: 560, z: 0.72}], [S5, {x: 1000, y: 520, z: 0.82}]]}
      over={<Slip text="Dec. 8, 1863" x={1340} y={820} rot={-2} at={t.at('1863') + 2} />}>
      <Swipe lines={[TITLE]} from={t.at('announced a plan')} to={t.end('announced a plan') + 4} seed="tt" />
    </Doc>],
    [S5, <Tenth key="p3" />],
    [S6, <Doc key="pd" src={P1} size={P1_S} a={S6} b={S7} tag={SRC.amnesty} filter={MS_F}
      keys={[[S6, {x: 1150, y: 640, z: 0.95, tilt: 26, dof: 2.2, band: 80}], [S7, {x: 1300, y: 650, z: 1.02, tilt: 26, dof: 2.2, band: 80}]]}
      over={<>
        <Slip text="most Confederates" x={1240} y={170} rot={2} at={t.at('most Confederates') - 2} />
        <Highlight text="PARDON" x={110} y={100} size={90} at={pd} seed={35} rot={-2} />
        <Definition term="pardon" def="an official “you're forgiven”, with their rights given back" at={pd + 9} x={120} y={860} />
      </>}>
      <Swipe lines={[PARDONS]} from={pd} to={pd + 16} seed="pd" />
    </Doc>],
    [S7, <Doc key="p7" src={P7} size={P7_S} a={S7} b={S8} tag={SRC.amnesty} filter={MS_F}
      keys={[[S7, {x: 1250, y: 560, z: 0.95}], [S8, {x: 1300, y: 600, z: 1.05}]]}
      over={<>
        <Highlight text="TEN PERCENT PLAN" x={110} y={100} size={84} at={tp} seed={36} rot={-2} />
        <Definition term="Ten Percent Plan" def="Lincoln's plan: once 10% of a state's voters swore loyalty, it could return" at={tp + 9} x={120} y={860} w={1400} />
        <Slip text="generous on purpose" x={1220} y={680} coral rot={-2} at={t.at('generous') - 2} />
      </>} />],
    [S8, <PhotoShot key="lf" src="img/ch03/cr_lincoln_g.png" size={[900, 968]} a={S8} b={S9} w={600} x={560} y={540} rot={-2} tag={SRC.lincoln}>
      <Slip text="the war over, fast" x={1020} y={300} rot={-2} at={t.at('over fast') - 2} />
      <Slip text="the South back on his side" x={980} y={450} rot={2} at={t.at('Southerners') - 2} />
    </PhotoShot>],
    [S9, <Party key="pa" />],
    [S10, <Radicals key="ra" />],
    [S11, <AbsoluteFill key="fr">
      <Photo src="img/ch01/edisto_sweet_potato_planting_hopkinson_1862_moore.jpg" size={[3000, 2286]} fx={1500} fy={1350} z0={1.12} z1={1.2} a={S11} b={S12} />
      <Highlight text="FREEDPEOPLE" x={110} y={100} size={84} at={fp} seed={37} rot={-2} />
      <Definition term="freedpeople" def="the people who had just been freed from slavery" at={fp + 9} x={120} y={860} />
      <Tag text={SRC.freed} />
    </AbsoluteFill>],
    [S12, <Ten key="ten" />],
    [S13, <Doc key="wd" src={WD} size={WD_S} a={S13} b={S14} tag={SRC.wd}
      keys={[[S13, {x: 760, y: 900, z: 0.85}], [t.at('a majority') - 16, {x: 760, y: 1000, z: 0.9}], [t.at('a majority') + 4, {x: 950, y: 1700, z: 1.2, tilt: 26, dof: 2, band: 70}],
        [S14, {x: 1000, y: 1700, z: 1.26, tilt: 26, dof: 2, band: 70}]]}
      over={<>
        <Slip text="a tougher plan" x={1250} y={170} rot={2} at={t.at('tougher plan') - 2} />
        <Highlight text="WADE-DAVIS BILL" x={110} y={100} size={84} at={wd} seed={38} rot={-2} />
        <Definition term="Wade-Davis Bill" def="Congress's 1864 plan: a majority had to swear loyalty first" at={wd + 9} x={120} y={860} />
      </>}>
      <Swipe lines={[MAJ]} from={t.at('a majority')} to={t.end('a majority') + 12} seed="mj" />
    </Doc>],
    [S14, <Doc key="pv" src={PV} size={PV_S} a={S14} b={S15} tag={SRC.pv}
      keys={[[S14, {x: 760, y: 560, z: 0.92}], [t.at('without signing') - 10, {x: 800, y: 620, z: 0.98}], [t.at('without signing') + 8, {x: 1000, y: 832, z: 1.3}], [S15, {x: 1060, y: 832, z: 1.36}]]}
      over={<>
        <Slip text="pocket veto" x={1260} y={170} rot={-2} size={70} at={t.at('pocket veto') - 2} />
        <Slip text="a very polite no" x={1220} y={760} coral rot={2} size={66} at={t.at('A very polite') - 2} />
      </>}>
      <Swipe lines={[NOTSIGNED]} from={t.at('without signing')} to={t.end('without signing it')} seed="ns" />
    </Doc>],
    [S15, <Plans key="pl" />],
    [B, <EpBoard key="b" ch={3} from={B} at={t.at('neither had won') - 30} />],
  ]);
  return <>{scene}<Sounds /></>;
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_ten_percent.wav" lead={LEAD} extra={EXTRA} music={[{src: 'music/j_intrigue.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
