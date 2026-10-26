// Chapter 3 · The Blacksmith. Registration (Asheville, 1867) and the first vote; organizing (Harper's "Electioneering
// at the South"); then Charles Caldwell, who has no known portrait: his name on the roll of Mississippi's 1868
// convention, his town on the drawn map (Clinton, 12 miles from Jackson), the convention's own words, the schools the
// new constitutions paid for, and his name again in the state senate, 1870. It ends on Edisto's three words.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch03_the_blacksmith.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Loop, Tag} from '../kit/Kit';
import {Count} from '../kit/map3d';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Photo, useScene} from '../kit/shell';
import {SeriesBoard} from '../kit/ep2board';
import {type Box, cut, DocShot, FocusIn, Motif, PhotoShot, PRINT_F, type SheetCam, Slip, Spot, SRC, Swipe, TEAL} from '../kit/rc';
import {MAP_TAG, MsLocator, TOWN, ucam} from './ch02_maps';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
export const CH03_FRAMES = chapterFrames(N, LEAD);

// sources
const REG = 'img/ch03/registration_at_the_south_asheville_harpers_1867_crop.jpg';
const ELEC = 'img/ch03/electioneering_at_the_south_harpers_1868.jpg';
const P5 = 'img/ch03/ms_convention_journal_1868_roll_caldwell_p5.jpg';
const P4 = 'img/ch03/ms_convention_journal_1868_first_day_p4.jpg';
const SCHOOL = 'img/ch03/freedmen_primary_school_vicksburg_1866.jpg';
const P558 = 'img/ch05/ms_senate_ratifies_15th_caldwell_yea_1870-01-15_mcpherson_p558.jpg';
const JOURNAL = 'Journal of the Mississippi Constitutional Convention of 1868 (pub. 1871)';
const SRCS = {
  reg: '“Registration at the South: Scene at Asheville, N.C.,” Harper\'s Weekly, Sept. 28, 1867 · Internet Archive',
  vote: '“The First Vote,” A. R. Waud, Harper\'s Weekly, Nov. 16, 1867 · Library of Congress',
  elec: '“Electioneering at the South,” W. L. Sheppard, Harper\'s Weekly, July 25, 1868 · Internet Archive',
  p5: `${JOURNAL}, p. 5 · Internet Archive`,
  p4: `${JOURNAL}, p. 4 · Internet Archive`,
  map: `Blacksmithing, A. & M. College, Greensboro, N.C., 1899 · Library of Congress · ${MAP_TAG}`,
  school: 'Primary school for freedmen, Vicksburg, Miss., Harper\'s Weekly, June 23, 1866 · Library of Congress',
  p558: 'McPherson, Political History … Reconstruction (1871), p. 558 · Internet Archive',
};

// line boxes (source px), each drawn on its page and checked
const ANSWERED: Box = [186, 1850, 1092, 42];           // p5 "The following delegates answered to their names:"
const CALDWELL: Box = [138, 2190, 362, 44];            // p5 "Charles Caldwell,"
const FORM: Box[] = [[1046, 1812, 534, 40], [172, 1862, 905, 40]];   // p4 "form a Constitution that shall render equal and exact justice to all."
const SUFFRAGE: Box[] = [[1112, 1914, 466, 40], [172, 1964, 1294, 40]]; // p4 "In the matter of suffrage, we shall doubtless carry out the views of Congress."
const SENATE: Box = [1104, 2742, 450, 36];             // p558 "Senate, January 15, 1870."
const CALDWELL70: Box = [1018, 2828, 284, 36];         // p558 "Charles Caldwell,"
const M_VOTE = {x: 813, y: 64};                        // VOTELESS on the motif strip (at w 1000)

// the shots
const S1 = c('Many had never'), S2 = c('and they organized'), S3 = c('In Mississippi'), S4 = c('He became'), S5 = c('Now he was');
const S6 = c('The new Southern'), S7 = c('And most of these'), S8 = c('Caldwell kept'), S9 = c("Remember Edisto's"), B = c('But first');

const Marker: React.FC<{at: number}> = ({at}) => <Sfx at={at} src="sfx/marker_tick.wav" volume={0.25} />;
/** A hard cut lands with a whoosh. */
const Cuts: React.FC = () => <>{[S1, S2, S3, S4, S5, S6, S7, S8, S9].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />)}</>;

// ---------------------------------------------------------------------------------------------------------- shots
/** Registration at Asheville, framed left of centre (the right edge of the engraving is caricature); the count. */
const Register: React.FC = () => {
  const n = t.at('hundreds of thousands');
  return (
    <AbsoluteFill>
      <Photo src={REG} size={[3000, 2071]} fx={880} fy={1280} z0={1.85} z1={1.97} a={0} b={S1} bw="grayscale(1) contrast(1.25)" />
      <Slip text="moved fast" x={140} y={120} rot={-2} at={t.at('moved fast') - 2} />
      <FocusIn at={n - 2}>
        <div style={{position: 'absolute', left: 1180, top: 110, padding: '18px 34px 22px', background: 'rgba(12,11,9,0.8)', boxShadow: '0 14px 28px rgba(0,0,0,0.6)', transform: 'rotate(1.5deg)'}}>
          <Count to={700000} at={n} dur={30} size={120} prefix="≈ " />
        </div>
      </FocusIn>
      <Slip text="Black men registered, 1867–68" x={1170} y={330} size={54} rot={-1} at={t.at('registered') - 2} />
      <Sfx at={n - 2} src="sfx/tick.wav" volume={0.4} />
      <Tag text={SRCS.reg} />
    </AbsoluteFill>
  );
};

/** Organizing: in churches, at rallies, in clubs at night (kept wide). */
const Organize: React.FC = () => (
  <AbsoluteFill>
    <Photo src={ELEC} size={[3000, 2328]} fx={1500} fy={1080} z0={1.0} z1={1.06} a={S2} b={S3} bw="grayscale(1) contrast(1.2)" />
    <Slip text="they organized" x={140} y={110} rot={-2} at={t.at('they organized') - 2} />
    <Slip text="churches" x={1180} y={100} rot={-2} at={t.at('In churches') - 2} />
    <Slip text="rallies" x={1500} y={200} rot={2} at={t.at('at rallies') - 2} />
    <Slip text="clubs that met at night" x={1100} y={300} rot={-1} at={t.at('political clubs') - 2} />
    <Tag text={SRCS.elec} />
  </AbsoluteFill>
);

/** One of the men they sent: the convention's roll, the camera finds his name. */
const Roll: React.FC = () => {
  const cc = t.at('Charles Caldwell');
  const L: SheetCam = {x: 0, y: 2212, z: 1.3, tilt: 24, dof: 2.2, band: 60, dofY: 2212};
  return (
    <DocShot src={P5} size={[1698, 3000]} seed="p5" tag={SRCS.p5} focusAt={S3}
      keys={[[S3, {x: 849, y: 1560, z: 0.34}], [t.at('one of the men'), {x: 760, y: 1880, z: 0.62}], [cc - 4, {...L, x: 520}], [t.at('He was born'), {...L, x: 470, z: 1.42}], [S4, {...L, x: 500, z: 1.48}]]}
      over={<>
        <Slip text="Mississippi's convention, Jan. 1868" x={1080} y={150} size={54} rot={2} at={S3 + 4} out={cc} />
        <Slip text="no photograph of him is known" x={1060} y={160} size={54} rot={2} at={cc + 18} />
        <Slip text="born into slavery" x={180} y={800} size={66} rot={-2} coral at={t.at('born into') - 2} />
        <Marker at={cc} />
      </>}>
      <Swipe lines={[ANSWERED]} from={t.at('one of the men')} to={t.end('state constitution')} seed="ans" />
      <Swipe lines={[CALDWELL]} from={cc} to={t.end('Charles Caldwell') + 2} seed="cc" />
      <Spot size={[1698, 3000]} boxes={[CALDWELL]} at={t.at('He was born')} id="spcc" />
    </DocShot>
  );
};

/** A blacksmith in Clinton, 12 miles from Jackson: the drawn locator, with a labelled stand-in for the trade. */
const Clinton: React.FC = () => {
  const town = t.at('a small town'), jk = t.at('from Jackson');
  const [x, y] = TOWN.Clinton, [jx, jy] = TOWN.Jackson;
  const mx = (x + jx) / 2, my = (y + jy) / 2;
  const keys = [ucam(S4, 3480, 2920, 1.45, 30, -2), ucam(town, 3460, 2950, 2.0, 32, -2), ucam(jk, mx, my + 0.8, 38, 36, -2), ucam(S5, mx, my + 0.8, 41, 36, -2)];
  return (
    <AbsoluteFill>
      <MsLocator keys={keys} at={S4} clinton={t.at('in Clinton')} miles={t.at('12 miles')} jackson={t.at('Jackson')} nameOut={town} fillOut={t.at('12 miles') - 4} />
      <BlacksmithCard at={S4 + 2} out={town} />
      <Slip text="Jackson: the state capital" x={1150} y={830} size={58} rot={2} at={t.at('state capital') - 2} />
      <Sfx at={t.at('in Clinton')} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={t.at('Jackson')} src="sfx/tick.wav" volume={0.4} />
      <Tag text={SRCS.map} />
    </AbsoluteFill>
  );
};

/** The stand-in: a small creased print with its own label (never implying it's him). */
const BlacksmithCard: React.FC<{at: number; out: number}> = ({at, out}) => (
  <Window at={at} out={out}>
    <FocusIn at={at}>
      <Img src={staticFile('img/ch03/cr_blacksmiths.png')} style={{position: 'absolute', left: 1250, top: 130, width: 480, transform: 'rotate(2deg)', filter: 'drop-shadow(0 16px 22px rgba(0,0,0,0.7))'}} />
    </FocusIn>
    <Slip text="Black blacksmiths, N.C., 1899" x={1220} y={500} size={46} rot={-1} at={at + 4} />
    <Sfx at={at} src="sfx/tick.wav" volume={0.35} />
  </Window>
);

const Window: React.FC<{at: number; out: number; children: React.ReactNode}> = ({at, out, children}) => {
  const f = useCurrentFrame();
  return f >= at && f < out ? <>{children}</> : null;
};

/** The convention's opening speech: "form a Constitution that shall render equal and exact justice to all." */
const Laws: React.FC = () => {
  const L: SheetCam = {x: 0, y: 1840, z: 1.0, tilt: 26, dof: 2.2, band: 70, dofY: 1840};
  return (
    <DocShot src={P4} size={[1727, 3000]} seed="p4" tag={SRCS.p4} carryFrom={S5} carryTo={S6}
      keys={[[S5, {...L, x: 1150}], [t.at('helping write') + 10, {...L, x: 900}], [S6, {...L, x: 760, z: 1.06}]]}
      over={<>
        <Slip text="treated him as property" x={1080} y={800} size={64} rot={-2} at={t.at('treated him') - 2} />
        <Marker at={t.at('helping write')} />
      </>}>
      <Swipe lines={FORM} from={t.at('helping write')} to={t.end('laws')} seed="form" />
    </DocShot>
  );
};

/** The new constitutions: "In the matter of suffrage …" — vote, and hold office. */
const Constitutions: React.FC = () => {
  const L: SheetCam = {x: 0, y: 1950, z: 1.05, tilt: 26, dof: 2.2, band: 70, dofY: 1950};
  return (
    <DocShot src={P4} size={[1727, 3000]} seed="p4" tag={SRCS.p4} carryFrom={S6} carryTo={S7}
      keys={[[S6, {...L, x: 1080, y: 1920, dofY: 1932}], [t.at('Black men could'), {...L, x: 860}], [S7, {...L, x: 780, z: 1.1}]]}
      over={<>
        <Slip text="the new constitutions" x={160} y={150} rot={-2} at={S6 + 4} />
        <Slip text="vote" x={1180} y={780} size={72} rot={-3} coral at={t.at('could vote') - 2} />
        <Slip text="hold office" x={1390} y={800} size={72} rot={2} coral at={t.at('hold office') - 2} />
        <Marker at={t.at('Black men could')} />
      </>}>
      <Swipe lines={SUFFRAGE} from={t.at('Black men could')} to={t.end('hold office')} seed="suf" />
    </DocShot>
  );
};

/** Schools: the freedmen's primary school at Vicksburg (1866), then its classroom. */
const Schools: React.FC = () => (
  <DocShot src={SCHOOL} size={[1050, 1536]} seed="school" filter={PRINT_F} tag={SRCS.school} focusAt={S7}
    keys={[[S7, {x: 525, y: 330, z: 1.32}], [t.at('for Black children'), {x: 525, y: 360, z: 1.44}], [t.at('Usually') - 4, {x: 525, y: 1090, z: 1.06}], [S8, {x: 525, y: 1110, z: 1.13}]]}
    over={<>
      <Slip text="public schools" x={300} y={110} rot={-2} at={t.at('public schools') - 2} out={t.at('Usually') - 4} />
      <Slip text="paid for by the state" x={1060} y={130} rot={2} at={t.at('paid for') - 2} out={t.at('Usually') - 4} />
      <Slip text="usually in separate buildings" x={300} y={130} size={58} rot={-2} at={t.at('Usually') - 2} />
      <Slip text="but for the first time, there" x={980} y={250} size={60} rot={2} coral at={t.at('for the first time') - 2} />
    </>} />
);

/** 1870: the state senate. His name among the senators, Jan. 15, 1870. */
const Senate: React.FC = () => {
  const L: SheetCam = {x: 0, y: 2800, z: 1.2, tilt: 24, dof: 2.2, band: 80, dofY: 2790};
  return (
    <DocShot src={P558} size={[1825, 3000]} seed="p558" tag={SRCS.p558} focusAt={S8}
      keys={[[S8, {x: 1300, y: 2620, z: 0.62}], [t.at('In 1870'), {...L, x: 1340}], [S9, {...L, x: 1220, z: 1.3}]]}
      over={<>
        <Slip text="state senator, 1870" x={1180} y={780} size={70} rot={-2} coral at={t.at('state senate') - 2} />
        <Marker at={t.at('In 1870')} />
      </>}>
      <Swipe lines={[SENATE]} from={t.at('In 1870')} to={t.end('In 1870') + 6} seed="sen" />
      <Swipe lines={[CALDWELL70]} from={t.at('sent him')} to={t.end('state senate')} seed="cc70" />
    </DocShot>
  );
};

/** Remember Edisto's three words: a teal loop round VOTELESS. */
const Words: React.FC = () => {
  const mx = 330, my = 440, w = 1260, k = w / 1000;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Motif x={mx} y={my} w={w} at={S9} />
      <Slip text="Edisto Island, 1865" x={430} y={290} size={58} rot={-2} at={S9 + 6} />
      <Loop cx={mx + M_VOTE.x * k} cy={my + M_VOTE.y * k} rx={190} ry={86} at={t.at('crossed out')} dur={14} width={8} color={TEAL} seed={12} tilt={-2} />
      <Sfx at={S9} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={t.at('crossed out')} src="sfx/marker_tick.wav" volume={0.3} />
      <Tag text={SRC.letter} />
    </AbsoluteFill>
  );
};

/** Music (MUSIC.md): banjo and fiddle, quietly joyful (rc_jubilo) under the whole chapter. */
const Body: React.FC = () => {
  const scene = useScene([
    [0, <Register key="r" />],
    [S1, <PhotoShot key="v" src="img/wall/cr_firstvote.png" size={[900, 1113]} a={S1} b={S2} w={600} x={620} rot={-1.5} tag={SRCS.vote}>
      <Slip text="never held a ballot" x={1060} y={260} rot={-2} at={t.at('never held') - 2} />
      <Slip text="many couldn't read one" x={1040} y={420} rot={2} at={t.at("couldn't read") - 2} />
      <Slip text="voted anyway" x={1120} y={600} size={72} rot={-2} coral at={t.at('voted anyway') - 2} />
    </PhotoShot>],
    [S2, <Organize key="o" />],
    [S3, <Roll key="roll" />],
    [S4, <Clinton key="map" />],
    [S5, <Laws key="laws" />],
    [S6, <Constitutions key="con" />],
    [S7, <Schools key="sch" />],
    [S8, <Senate key="sen" />],
    [S9, <Words key="w" />],
    [B, <SeriesBoard key="b" ch={3} from={B} at={t.at('get past')} />],
  ]);
  return <>{scene}<Cuts /></>;
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_the_blacksmith.wav" lead={LEAD} music={[{src: 'music/rc_jubilo.mp3', volume: 0.22}]}>
    <Body />
  </ChapterShell>
);

