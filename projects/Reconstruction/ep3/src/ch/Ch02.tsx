// Chapter 2 · The Night. A 20-second recap (the army, the first vote, 2,000 in office, the 15th, still landless, and the
// two things it all rested on: votes and soldiers, each crossed out on "attack both"); the Klan founded at Pulaski,
// Tennessee, in 1866 (drawn locator; no picture exists) and spreading across the old Confederacy; masks and robes
// (Harper's, 1868); whipped, burned and killed, and who they targeted (over the Memphis riot of 1866, tagged as a white mob,
// not the Klan); night mattered ("Visit of the Ku-Klux", 1872, and Ep 2's "Electioneering at the South" for the night
// meetings); the goal as a chain; terrorism, over Congress's own 13-volume report. Ends on the series board.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch02_the_klan.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Arrow, Highlight, Loop, Tag} from '../kit/Kit';
import {SeriesBoard} from '../kit/ep3board';
import {cut, DOC_F, DocShot, FocusIn, Motif, PhotoShot, PRINT_F, SRC as EDISTO_SRC, Slip} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';
import {Cross, PageWin, Print, Stamps, Whooshes} from './ch02_kit';
import {KlanMap, MAP_TAG, ucam} from './ch02_map';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
/** The board holds a second longer after the last word (narration ends 1 s after the cut onto it). */
const EXTRA = 30;
export const CH02_FRAMES = chapterFrames(N, LEAD) + EXTRA;

// ------------------------------------------------------------------------------------------------------ pictures
const GENERAL = 'img/ep2/cr_ames_general.png';
const GENERAL_S: [number, number] = [900, 1322];
const VOTE = 'img/wall/cr_firstvote.png';
const VOTE_S: [number, number] = [900, 1113];
const T15 = 'img/ep2/fifteenth_amendment_joint_resolution_1869_nara.jpg';
const ROBES = 'img/ch02/two_members_ku_klux_klan_disguises_harpers_1868.jpg';
const MEMPHIS = 'img/ch02/memphis_riot_burning_freedmens_school_house_harpers_1866_crop.jpg';
const VISIT = 'img/ch02/visit_of_the_ku_klux_harpers_1872.jpg';
const VISIT_S: [number, number] = [3000, 2349];
const ELEC = 'img/ep2/electioneering_at_the_south_harpers_1868.jpg';
const REPORT = 'img/ch02/ku_klux_report_joint_select_committee_title_1872.jpg';

const SRC = {
  general: 'Maj. Gen. Adelbert Ames, Brady studio, 1860s · Library of Congress',
  vote: '“The First Vote,” A. R. Waud, Harper\'s Weekly, Nov. 16, 1867 · Library of Congress',
  senators: 'The First Colored Senator and Representatives, Currier & Ives, 1872 · Library of Congress',
  t15: 'Joint resolution proposing the 15th Amendment, Feb. 1869 · National Archives',
  two: '“The First Vote,” Harper\'s Weekly, 1867 · Maj. Gen. Adelbert Ames, Brady studio, 1860s · Library of Congress',
  robes: '“Two members of the Ku-Klux Klan in their disguises,” Harper\'s Weekly, Dec. 19, 1868 · Library of Congress',
  memphis: 'Memphis riot, May 1866 (a white mob, not the Klan): “burning a freedmen\'s school-house,” A. R. Waud, Harper\'s Weekly, May 26, 1866 · Library of Congress',
  visit: '“Visit of the Ku-Klux,” Frank Bellew, Harper\'s Weekly, Feb. 24, 1872 · Library of Congress',
  elec: '“Electioneering at the South,” W. L. Sheppard, Harper\'s Weekly, July 25, 1868 · Internet Archive',
  report: 'Report of the Joint Select Committee on the late insurrectionary states (the "Ku Klux Report"), 1872 · Internet Archive',
};

// ------------------------------------------------------------------------------------------------------ the cuts
const S_VOTE = c('Black men');
const S_OFFICE = c('about 2,000');
const S_15 = c('The 15th');
const S_LAND = c('But most');
const S_TWO = c('And the whole');
const S_MAP = c('In 1866');
const S_ROBES = c('They rode');
const S_MEM = c('They whipped');
const S_NIGHT = c('Night mattered');
const S_FREE = c('Since freedom');
const S_BACK = c('The Klan wanted');
const S_GOAL = c('And the goal');
const S_TERR = c('This was terrorism');
const S_BOARD = c('And it worked');

const KKK = t.at('Ku Klux Klan');
const TERROR = t.at('terrorism');

// ------------------------------------------------------------------------------------------------------ the recap
/** Last time: the army back in the South (Ames as a general, Ep 2). */
const Army: React.FC = () => (
  <PhotoShot src={GENERAL} size={GENERAL_S} a={0} b={S_VOTE} w={430} x={680} y={540} rot={-1.5} tag={SRC.general}>
    <Slip text="last time" x={1040} y={200} rot={-3} size={52} at={8} />
    <Slip text="1867: Congress" x={1060} y={330} rot={2} at={t.at('Congress')} />
    <Slip text="the army, back in the South" x={1000} y={460} rot={-1.5} size={56} at={t.at('army')} />
  </PhotoShot>
);

const Vote: React.FC = () => (
  <PhotoShot src={VOTE} size={VOTE_S} a={S_VOTE} b={S_OFFICE} w={430} x={720} y={540} rot={1.5} tag={SRC.vote}>
    <Slip text="Black men vote" x={1080} y={430} rot={-2} size={66} at={S_VOTE + 3} />
  </PhotoShot>
);

const Office: React.FC = () => (
  <PhotoShot src="img/wall/cr_senators.png" size={[900, 687]} a={S_OFFICE} b={S_15} w={880} x={800} y={500} rot={-1} tag={SRC.senators}>
    <Slip text="≈ 2,000 in office" x={1290} y={800} rot={2} size={66} at={t.at('2,000')} coral />
  </PhotoShot>
);

const Fifteenth: React.FC = () => (
  <DocShot src={T15} size={[1920, 2690]} tag={SRC.t15} filter="grayscale(1) contrast(1.35) brightness(1.08)" focusAt={S_15}
    keys={[[S_15, {x: 960, y: 1250, z: 0.42}], [S_LAND, {x: 960, y: 1240, z: 0.47}]]}
    over={<>
      <Slip text="15th Amendment" x={1260} y={200} rot={2} at={S_15 + 4} />
      <Slip text="the vote → the Constitution" x={1100} y={760} rot={-2} size={56} at={t.at('wrote')} />
    </>} />
);

/** Still landless: the Edisto committee's three words, LANDLESS circled. Strip px: LANDLESS is about x 100-350. */
const Land: React.FC = () => {
  const W = 1500, k = W / 1000;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Motif x={210} y={440} w={W} at={S_LAND + 1} under={<Loop cx={228 * k} cy={64 * k} rx={170 * k} ry={58 * k} at={t.at('own land')} width={7} seed={22} />} />
      <Slip text="most freedpeople" x={280} y={230} rot={-2} at={t.at('most freedpeople')} />
      <Slip text="still no land of their own" x={330} y={760} rot={1.5} at={t.at("didn't own")} coral />
      <Sfx at={S_LAND + 1} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={t.at('own land')} src="sfx/marker_tick.wav" volume={0.3} />
      <Tag text={EDISTO_SRC.letter} />
    </AbsoluteFill>
  );
};

/** It all rested on two things: votes and soldiers. Somebody figured out how to attack both: a coral ✕ on each. */
const Two: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src={VOTE} size={VOTE_S} x={470} y={150} w={300} at={t.at('votes') - 2} rot={-2} dim={0.85} />
    <Print src={GENERAL} size={GENERAL_S} x={1150} y={130} w={270} at={t.at('soldiers') - 2} rot={2} dim={0.85} />
    <Slip text="votes" x={520} y={590} rot={-3} size={84} at={t.at('votes')} />
    <Slip text="soldiers" x={1150} y={590} rot={2} size={84} at={t.at('soldiers')} />
    <Slip text="it all rested on two things" x={560} y={810} rot={-1} size={60} at={t.at('rested')} />
    <Cross x={450} y={170} w={360} h={540} at={t.at('attack')} />
    <Cross x={1120} y={160} w={380} h={550} at={t.at('both')} />
    <Tag text={SRC.two} />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------------------ the Klan
/** Pulaski, 1866, on the drawn map; the name; then it spreads across the South. */
const Founded: React.FC = () => {
  const within = t.at('Within');
  const keys = [ucam(S_MAP, 3790, 2640, 0.95), ucam(t.at('Pulaski') - 6, 3770, 2650, 1.5, 40), ucam(within, 3770, 2650, 1.55, 40),
    ucam(t.at('across the South'), 3720, 2830, 0.66, 36), ucam(S_ROBES, 3720, 2840, 0.64, 36)];
  return (
    <AbsoluteFill>
      <KlanMap keys={keys} tn={S_MAP + 4} pin={t.at('Pulaski')} spread={within + 10} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0) 26%)'}} />
      <Slip text="1866" x={1300} y={250} rot={2} size={70} at={t.at('1866')} out={within} />
      <Slip text="six Confederate veterans" x={1180} y={380} rot={-2} size={58} at={t.at('six')} out={within} />
      <Slip text="a club" x={1320} y={510} rot={1.5} size={64} at={t.at('club')} out={within} />
      <Slip text="spreads across the South" x={1150} y={720} rot={-1.5} size={58} at={t.at('spread')} />
      <Highlight text="KU KLUX KLAN" x={110} y={106} size={88} at={KKK} seed={21} rot={-2} />
      <Definition term="Ku Klux Klan" def="a secret society started in 1866 to keep Black Southerners from using their freedom, by terror" at={KKK + 9} x={120} y={830} w={1640} />
      <Tag text={MAP_TAG} />
    </AbsoluteFill>
  );
};

/** They rode at night, in masks and robes (the top engraving only; the page's lower picture is an English riot). */
const Robes: React.FC = () => (
  <DocShot src={ROBES} size={[2404, 3000]} tag={SRC.robes} filter={PRINT_F} focusAt={S_ROBES}
    keys={[[S_ROBES, {x: 1060, y: 1020, z: 0.66}], [S_MEM, {x: 1060, y: 900, z: 0.8}]]}
    over={<>
      <Slip text="they rode at night" x={1420} y={240} rot={2} size={56} at={t.at('rode')} />
      <Slip text="masks and robes" x={1450} y={700} rot={-2} size={58} at={t.at('masks')} coral />
    </>} />
);

/** Whipped, burned and killed; the targets, stacking. The picture is the Memphis riot of 1866 (before the Klan). */
const Targets: React.FC = () => {
  const items = ['Black voters', 'Black officeholders', 'teachers', 'churches', 'white Republicans'];
  return (
    <DocShot src={MEMPHIS} size={[1070, 840]} tag={SRC.memphis} filter={PRINT_F} focusAt={S_MEM}
      keys={[[S_MEM, {x: 800, y: 420, z: 1.05}], [S_NIGHT, {x: 780, y: 420, z: 1.1}]]}
      over={<>
        <Slip text="Memphis, May 1866: a white mob, not the Klan" x={150} y={120} rot={-1.5} size={40} at={S_MEM + 6} />
        <Slip text="whipped, burned, killed" x={1320} y={120} rot={2} size={48} at={t.at('whipped')} dur={16} />
        <Slip text="targets:" x={1330} y={230} rot={-2} size={52} at={t.at('targets')} />
        {items.map((p, i) => <Slip key={p} text={p} x={1340 + (i % 2) * 20} y={340 + i * 108} rot={i % 2 ? 1.5 : -1.5} size={54} at={t.at(p)} />)}
      </>} />
  );
};

/** Night mattered: the visit by lamplight. */
const Night: React.FC = () => (
  <DocShot src={VISIT} size={VISIT_S} tag={SRC.visit} filter={PRINT_F} focusAt={S_NIGHT}
    keys={[[S_NIGHT, {x: 1500, y: 1170, z: 0.62}], [t.at('Under slavery'), {x: 1400, y: 1180, z: 0.66}], [S_FREE, {x: 1050, y: 1200, z: 0.92}]]}
    over={<>
      <Slip text="night mattered" x={150} y={120} rot={-2} size={58} at={t.at('Night mattered')} />
      <Slip text="under slavery:" x={1000} y={110} rot={2} size={56} at={t.at('Under slavery')} />
      <Slip text="white patrols ruled the roads after dark" x={820} y={220} rot={-1.5} size={52} at={t.at('white patrols')} dur={18} />
    </>} />
);

/** Since freedom: church, political clubs, family (Ep 2's "Electioneering at the South", windowed on the meeting). */
const Freedom: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <FocusIn at={S_FREE}>
      <PageWin src={ELEC} cx={1950} cy={1050} s={0.56} w={1100} h={820} x={720} y={120} r={1} filter={PRINT_F} />
    </FocusIn>
    <Slip text="since freedom:" x={130} y={200} rot={-2} size={60} at={t.at('Since freedom')} />
    <Slip text="church meetings" x={150} y={340} rot={1.5} size={58} at={t.at('church')} />
    <Slip text="political clubs" x={140} y={480} rot={-1.5} size={58} at={t.at('political')} />
    <Slip text="visiting family" x={160} y={620} rot={2} size={58} at={t.at('visiting')} />
    <Sfx at={S_FREE} src="sfx/tick.wav" volume={0.35} />
    <Tag text={SRC.elec} />
  </AbsoluteFill>
);

/** The Klan wanted the night back: in at the door. */
const Back: React.FC = () => (
  <DocShot src={VISIT} size={VISIT_S} tag={SRC.visit} filter={PRINT_F}
    keys={[[S_BACK, {x: 880, y: 1150, z: 1.2}], [S_GOAL, {x: 900, y: 1150, z: 1.3}]]}
    over={<Slip text="the Klan wanted the night back" x={1080} y={150} rot={-2} size={56} at={t.at('wanted') - 2} coral />} />
);

/** The goal, as a chain: no Black votes → no Republican governments. */
const Goal: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Slip text="the goal" x={200} y={150} rot={-3} size={58} at={t.at('goal')} />
    <Slip text="keep Black men from voting" x={360} y={330} rot={-1.5} size={68} at={t.at('Keep')} />
    <Arrow x1={760} y1={450} x2={860} y2={610} bow={-30} at={t.at('and the Republican')} width={7} />
    <Slip text="the Republican governments fall" x={560} y={650} rot={1.5} size={68} at={t.at('Republican governments')} coral />
    <Sfx at={t.at('and the Republican')} src="sfx/marker_tick.wav" volume={0.3} />
    <Tag text="" />
  </AbsoluteFill>
);

/** This was terrorism: over Congress's own record of it. */
const Terror: React.FC = () => (
  <DocShot src={REPORT} size={[1791, 3000]} tag={SRC.report} filter={DOC_F} focusAt={S_TERR}
    keys={[[S_TERR, {x: 900, y: 1350, z: 0.36}], [S_BOARD, {x: 900, y: 1300, z: 0.4}]]}
    over={<>
      <Slip text="Congress investigated" x={1320} y={270} rot={2} size={54} at={S_TERR + 10} />
      <Slip text="13 volumes, 1872" x={1360} y={390} rot={-2} size={54} at={S_TERR + 22} />
      <Highlight text="TERRORISM" x={110} y={106} size={96} at={TERROR} seed={23} rot={-2} />
      <Definition term="terrorism" def="violence meant to frighten a whole group of people into giving up their rights" at={TERROR + 9} x={120} y={830} w={1640} />
    </>} />
);

// The board: the default end shot slices Episode 1–2 pieces on the left, so frame the night piece and the end of Ep 2's
// "part 3 →" string close (tools/boardfit.mjs 2 2560 1180 1.85): Ames's strip above stays out, the tag stays inside the margin.
const AT = t.at('at first');
const BOARD_CAM: [number, number, number, number][] = [[S_BOARD, 2545, 1182, 2.0], [AT + 40, 2560, 1180, 1.85], [AT + 300, 2560, 1182, 1.83]];

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Army key="ar" />],
    [S_VOTE, <Vote key="vo" />],
    [S_OFFICE, <Office key="of" />],
    [S_15, <Fifteenth key="15" />],
    [S_LAND, <Land key="la" />],
    [S_TWO, <Two key="tw" />],
    [S_MAP, <Founded key="mp" />],
    [S_ROBES, <Robes key="ro" />],
    [S_MEM, <Targets key="me" />],
    [S_NIGHT, <Night key="ni" />],
    [S_FREE, <Freedom key="fr" />],
    [S_BACK, <Back key="bk" />],
    [S_GOAL, <Goal key="go" />],
    [S_TERR, <Terror key="te" />],
    [S_BOARD, <SeriesBoard key="b" ch={2} from={S_BOARD} at={AT} cam={BOARD_CAM} />],
  ]);
  return (
    <>
      {scene}
      <Whooshes at={[S_VOTE, S_OFFICE, S_15, S_LAND, S_TWO, S_MAP, S_ROBES, S_MEM, S_NIGHT, S_FREE, S_BACK, S_GOAL, S_TERR]} />
      <Stamps at={[KKK, TERROR]} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_the_klan.wav" lead={LEAD} extra={EXTRA} music={[{src: 'music/rc_night_riders.mp3', volume: 0.2}]}>
    <Body />
  </ChapterShell>
);
