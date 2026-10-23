// Chapter 10 · "A Few Acres": the ending of the series. The question on the desk under the committee's three words; the
// answer's three parts on the board's column names; the law (the three amendments, laid out like the LAW column); the land
// (the forty acres, Stevens, the sharecropping contract); protection (the board: the torn header, the proclamation and
// "Klan broken", troops out); "was it a failure?" both ways (landless and voteless again / schools, churches, families,
// leaders, the amendments); 1954 and 1965 on their own pages, then the 15th's 1869 line; the Edisto petition, "A home if It
// be but A few acres"; then the board: the LAW column, ON PAPER stamped, LAND struck, PROTECTION falling, the thank-you, and
// after the last word, "Roll, Jordan, Roll" (Fisk, 1909) under the full pull-back of the series board, ending pushed in on
// the petition with its line highlighted, the rest of the board in shadow.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch10_a_few_acres.words.json';
import {clamp} from '../lib/anim';
import {DarkPaper, Sfx} from '../kit/common';
import type {BoardKey} from '../kit/board';
import {BoardSignoff, SeriesBoard} from '../kit/ep3board';
import {Highlight, Tag, useGFrame} from '../kit/Kit';
import {type Box, cut, DocShot, EDISTO, Motif, PETITION_P3, PhotoShot, Slip, Spot, SRC, Swipe, TEAL} from '../kit/rc';
import {ChapterShell, chapterFrames, CropCard, FADE, LEAD, makeTimeline, type Narration, Photo, TAIL, useScene} from '../kit/shell';
import {Amendments, DocWin, Gate, Header, Mark} from './ch10_parts';

const N = words as Narration;
const t = makeTimeline(N, 30);
/** The first frame after the narration. */
const SAID = Math.ceil(N.duration * 30);

// ------------------------------------------------------------------------------------------ the ending's clock
/** "Roll, Jordan, Roll" starts just after the last word ("…next time.") and plays alone to the end. */
const ROLL = t.end('next time') + 5;
/** The song runs about 49 s, to the end of its second chorus (a natural breath at 0:47–0:49), fading over its last 5 s. */
const SONG = 1490;
const END = ROLL + SONG;
/** Frames past the usual tail and fade: the music-only ending. */
const EXTRA = END - (SAID + TAIL + FADE);
export const CH10_FRAMES = chapterFrames(N, LEAD) + EXTRA;

// the shots
const S_COLS = cut(t, "Here's what"), S_LAW = cut(t, 'Reconstruction delivered'), S_LAND = cut(t, 'It never'), S_STEVENS = cut(t, "Stevens's plan");
const S_CROP = cut(t, 'Most freedpeople'), S_PROT = cut(t, 'And it delivered protection'), S_FAIL = cut(t, 'Was Reconstruction'), S_LAST = cut(t, 'Schools');
const S_FOUND = cut(t, 'And three amendments'), S_1954 = cut(t, 'In 1954'), S_1965 = cut(t, 'In 1965'), S_WORDS = cut(t, 'The words written');
const S_EDISTO = cut(t, 'Remember those'), S_END = cut(t, 'But their country');

const Cuts: React.FC = () => (
  <>{[S_LAW, S_LAND, S_STEVENS, S_CROP, S_FAIL, S_LAST, S_FOUND, S_1954, S_1965, S_WORDS, S_EDISTO].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />)}</>
);

/** The board, before this chapter's marks land. */
const NEVER = 1e7;

// ------------------------------------------------------------------------------------------ 1 · the question
const Question: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Motif x={460} y={130} w={1000} at={2} />
    <Slip text="the question from the start" x={560} y={330} size={54} rot={-2} at={t.at('question') + 2} />
    <Highlight text="WHAT DOES IT TAKE" x={250} y={500} size={100} at={t.at('What does')} seed={71} rot={-2} />
    <Slip text="to make freedom real?" x={560} y={700} size={78} rot={2} at={t.at('freedom') - 2} />
    <Sfx at={t.at('What does')} src="sfx/stamp.wav" volume={0.3} />
    <Tag text={SRC.letter} />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------ 2 · three things, on the board
// the column names (board px): LAW (470, 30), LAND (1520, 36), PROTECTION (2000, 34; torn in ch07)
const COLS_CAM: BoardKey[] = [
  [S_COLS, 1250, 520, 0.62],
  [t.at('Three things') - 4, 1250, 470, 0.7],
  [t.at('The law') + 2, 560, 200, 1.4],
  [t.at('The land') - 6, 600, 205, 1.42],
  [t.at('The land') + 6, 1620, 200, 1.4],
  [t.at('And someone') - 4, 1650, 205, 1.42],
  [t.at('protect both'), 2230, 220, 1.38],
  [S_LAW + 1, 2250, 230, 1.42],
];

// ------------------------------------------------------------------------------------------ 3 · the law
const Law: React.FC = () => (
  <Amendments a={S_LAW} b={S_LAND} t13={t.at('The 13th')} t14={t.at('The 14th')} t15={t.at('The 15th')}
    h13={[t.at('ended slavery'), t.end('ended slavery') + 4]} h14={[t.at('equal protection'), t.end('of the laws') + 2]} h15={[t.at('protected the vote'), t.end('protected the vote') + 6]}
    head={<>
      <Slip text="the law" x={140} y={80} size={76} rot={-2} at={S_LAW + 4} />
      <Mark kind="yes" x={420} y={70} at={t.at('delivered the law') + 12} s={64} />
      <Slip text="citizens" x={1420} y={400} size={50} rot={3} at={t.at('citizens') - 2} />
    </>} />
);

// ------------------------------------------------------------------------------------------ 4 · the land
const ACRES_S: [number, number] = [1920, 1080];
const Acres: React.FC = () => (
  <Photo src="img/wall/acres.jpg" size={ACRES_S} fx={1100} fy={590} z0={1.35} z1={1.4} a={S_LAND} b={S_STEVENS} bw="contrast(1.05)">
    {() => (
      <>
        <Slip text="the land" x={140} y={110} size={80} rot={-2} at={t.at('the land', 2) - 2} coral />
        <Mark kind="no" x={470} y={96} at={t.at('the land', 2) + 6} s={66} />
        <Slip text="Edisto Island: back to the old owners" x={140} y={780} size={58} rot={1} at={t.at('Most of Edisto')} />
        <Tag text="The forty acres, Special Field Order No. 15 (from Part 1) · coast: U.S. Census Bureau" />
      </>
    )}
  </Photo>
);

const Stevens: React.FC = () => (
  <PhotoShot src="img/wall/cr_stevens.png" size={[900, 1134]} a={S_STEVENS} b={S_CROP} w={520} x={620} rot={-1.5} tag="Thaddeus Stevens, engraving after J. Eichholtz, 1838 · Library of Congress">
    <Slip text="his plan: land for freedpeople" x={1000} y={330} size={58} rot={-2} at={S_STEVENS + 6} />
    <Slip text="died with him · 1868" x={1040} y={480} size={66} rot={2} at={t.at('died with him') - 2} coral />
  </PhotoShot>
);

const Crop: React.FC = () => (
  <PhotoShot src="img/wall/cr_contract.png" size={[900, 645]} a={S_CROP} b={S_PROT} w={1150} x={960} y={500} rot={1}
    tag="Sharecropping contract, De Soto County, Miss., Feb. 1867 · Nabb Center, Salisbury Univ. · Internet Archive">
    <Slip text="sharecropping" x={140} y={800} size={74} rot={-3} at={t.at('sharecropping') - 2} coral />
    <Slip text="someone else's ground" x={1100} y={870} size={60} rot={2} at={t.at("someone else's") - 2} />
  </PhotoShot>
);

// ------------------------------------------------------------------------------------------ 5 · protection, on the board
// PROTECTION's torn header (2000, 34), the proclamation and "Klan broken" (2780–3320, 990–1292), TROOPS OUT (1600, 2220)
const PROT_CAM: BoardKey[] = [
  [S_PROT, 2150, 240, 1.32],
  [t.at('only while') + 10, 2220, 270, 1.4],
  [t.at('When the army enforced') - 14, 2240, 280, 1.4],
  [t.at('When the army enforced') + 6, 2700, 700, 0.95],
  [t.at('enforced') + 10, 3030, 1140, 1.36],
  [t.at('When the army left') - 8, 3060, 1150, 1.44],
  [t.at('When the army left') + 4, 2500, 1700, 0.95],
  [t.at('army left') + 16, 1760, 2160, 1.42],
  [S_FAIL + 1, 1780, 2170, 1.5],
];
const ProtOverlay: React.FC = () => (
  <Slip text="the law: on paper" x={1100} y={150} size={70} rot={-2} at={t.at('stayed on paper') - 2} coral />
);

// ------------------------------------------------------------------------------------------ 6 · a failure?
// the three words on the motif strip (cr_three_words.png, 1000 x 122)
const M_LAND: Box = [112, 28, 270, 72];
const M_VOTE: Box = [698, 28, 230, 72];
const MW = 760;

const Failure: React.FC = () => {
  const g = useGFrame();
  const two = t.at('Another answer');
  const dimL = interpolate(g, [two - 2, two + 6], [1, 0.4], clamp);
  const line = interpolate(g, [t.at('One answer'), t.at('One answer') + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="A FAILURE?" x={620} y={90} size={108} at={t.at('failure') - 2} seed={73} rot={-2} />
      <Slip text="argued about ever since" x={680} y={250} size={56} rot={2} at={t.at('People have argued') + 4} />
      {line > 0 && <div style={{position: 'absolute', left: 958, top: 360, width: 4, height: 630 * line, background: TEAL, opacity: 0.7}} />}
      <AbsoluteFill style={{opacity: dimL}}>
        <Header text="ONE ANSWER: YES" x={130} y={370} color="#f4efe6" at={t.at('One answer')} />
        <Motif x={140} y={480} w={MW} at={t.at('By 1900')} under={
          <div style={{position: 'absolute', left: 0, top: 0, width: 1000, height: 122, transform: `scale(${MW / 1000})`, transformOrigin: '0 0'}}>
            <Swipe lines={[M_LAND]} from={t.at('landless again')} to={t.end('landless again')} seed="fl" />
            <Swipe lines={[M_VOTE]} from={t.at('voteless again')} to={t.end('voteless again')} seed="fv" />
          </div>
        } />
        <Slip text="by 1900" x={150} y={640} size={58} rot={-2} at={t.at('By 1900') + 4} />
        <Slip text="landless again" x={160} y={750} size={58} rot={2} at={t.at('landless again')} />
        <Slip text="voteless again" x={440} y={850} size={58} rot={-2} at={t.at('voteless again')} />
      </AbsoluteFill>
      <Header text="ANOTHER ANSWER" x={1010} y={370} color={TEAL} at={two} />
      <Slip text="it built things that lasted" x={1010} y={490} size={64} rot={-2} at={t.at('it built') + 2} coral />
      <Sfx at={t.at('failure') - 2} src="sfx/stamp.wav" volume={0.3} />
      {[t.at('landless again'), t.at('voteless again')].map((f) => <Sfx key={f} at={f} src="sfx/marker_tick.wav" volume={0.22} />)}
      {g >= t.at('By 1900') && <Tag text={SRC.letter} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ 7 · things that lasted
const SCHOOL = 'img/ch10/primary_school_freedmen_vicksburg_harpers_1866.jpg';
const WANTED = 'img/ch10/colored_tennessean_1866-03-24_information_wanted_column.jpg';
const WANTED_S: [number, number] = [1050, 2860];
/** "HANNAH BARNETT." under her notice for her daughter (measured on the image) */
const HANNAH: Box = [432, 906, 534, 42];
const HEROES = 'img/ch10/heroes_of_the_colored_race_1881.jpg';

const Lasted: React.FC = () => {
  const f = useCurrentFrame();
  const fam = t.at('Families'), lead = t.at('A generation');
  const push = interpolate(f, [S_LAST, S_FOUND], [1, 1.03], clamp);
  const cy = interpolate(f, [fam, lead + 20], [660, 760], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Header text="IT BUILT THINGS THAT LASTED" x={130} y={70} color={TEAL} at={S_LAST} />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 55%'}}>
        <CropCard src={SCHOOL} size={[3000, 2337]} x={140} y={190} w={590} h={390} fx={1530} fy={1260} scale={0.27} rot={-1.5} at={t.at('Schools')} />
        <Slip text="schools" x={160} y={620} size={64} rot={-2} at={t.at('Schools') + 2} />
        <Slip text="churches" x={430} y={720} size={64} rot={2} at={t.at('Churches') - 2} />
        <Gate at={fam - 2}>
          <DocWin src={WANTED} size={WANTED_S} cx={525} cy={cy} s={0.5} w={420} h={660} x={790} y={170} r={1}>
            <Swipe lines={[HANNAH]} from={t.at('found each other')} to={t.end('found each other') + 6} seed="hb" />
          </DocWin>
        </Gate>
        <Slip text="families that found each other" x={760} y={870} size={50} rot={-1} at={fam + 2} />
        <CropCard src={HEROES} size={[3000, 2210]} x={1280} y={190} w={520} h={400} fx={1500} fy={1080} scale={0.3} rot={1.5} at={lead - 2} />
        <Slip text="Black leaders" x={1300} y={640} size={64} rot={-2} at={lead + 4} />
        <Slip text="Bruce · Douglass · Revels" x={1300} y={740} size={44} rot={1} at={lead + 12} />
      </AbsoluteFill>
      {[t.at('Schools'), fam - 2, lead - 2].map((x) => <Sfx key={x} at={x} src="sfx/tick.wav" volume={0.38} />)}
      <Sfx at={t.at('found each other')} src="sfx/marker_tick.wav" volume={0.22} />
      <Tag text="Primary school for freedmen, Vicksburg, Harper's Weekly, 1866 · The Colored Tennessean, Mar. 24, 1866 · Heroes of the Colored Race, 1881 · Library of Congress" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ 8 · a second founding
const Founding: React.FC = () => (
  <Amendments a={S_FOUND} b={S_1954} t13={S_FOUND - 30} t14={S_FOUND - 30} t15={S_FOUND - 30} h13={[-20, -19]} h14={[-20, -19]} h15={[-20, -19]}
    head={<Slip text="three amendments" x={140} y={80} size={66} rot={-2} at={S_FOUND + 4} />}
    over={<>
      <Slip text="never went away" x={150} y={915} size={58} rot={2} at={t.at('never went away') - 2} />
      <Slip text="a second founding" x={800} y={905} size={68} rot={-2} at={t.at('second founding') - 2} coral />
    </>} />
);

// ------------------------------------------------------------------------------------------ 9 · 1954, 1965, the 1860s
const BROWN = 'img/ch10/brown_v_board_347us495_inherently_unequal_1954.jpg';
const BROWN_S: [number, number] = [1796, 2704];
/** "deprived of the equal / protection of the laws guaranteed by the Fourteenth / Amendment." */
const B_EQUAL: Box[] = [[886, 724, 414, 44], [158, 780, 1141, 44], [158, 836, 276, 45]];
/** "Separate / educational facilities are inherently unequal." */
const B_UNEQUAL: Box[] = [[1076, 498, 226, 45], [158, 552, 916, 48]];

const Brown: React.FC = () => (
  <DocShot src={BROWN} size={BROWN_S} seed="brown" focusAt={S_1954} tag="Brown v. Board of Education, 347 U.S. 483 (1954), p. 495 · Library of Congress"
    keys={[[S_1954, {x: 760, y: 330, z: 0.82}], [t.at('the 14th', 2) - 4, {x: 740, y: 760, z: 1.02}], [t.at('end segregated') - 6, {x: 740, y: 780, z: 1.05}],
      [t.at('end segregated') + 14, {x: 740, y: 560, z: 1.1}], [S_1965, {x: 740, y: 555, z: 1.14}]]}
    over={<Slip text="Brown v. Board of Education · 1954" x={130} y={90} size={52} rot={-2} at={S_1954 + 6} />}>
    <Swipe lines={B_EQUAL} from={t.at('the 14th', 2)} to={t.end('equal protection', 2) + 6} seed="be" />
    <Swipe lines={B_UNEQUAL} from={t.at('end segregated') + 12} to={t.end('end segregated schools') + 14} seed="bu" />
  </DocShot>
);

const VRA = 'img/ch10/voting_rights_act_1965_79stat437_enforce_fifteenth.jpg';
const VRA_S: [number, number] = [1899, 2841];
/** "To enforce the fifteenth amendment" */
const V_ENFORCE: Box = [202, 718, 648, 32];

const Vra: React.FC = () => (
  <DocShot src={VRA} size={VRA_S} seed="vra" focusAt={S_1965} tag="Voting Rights Act of 1965, Public Law 89-110, 79 Stat. 437 · govinfo.gov (U.S. Statutes at Large)"
    keys={[[S_1965, {x: 900, y: 650, z: 0.82}], [t.at('real force') - 10, {x: 640, y: 735, z: 1.25}], [S_WORDS, {x: 620, y: 735, z: 1.3}]]}
    over={<Slip text="the Voting Rights Act · 1965" x={130} y={90} size={52} rot={-2} at={S_1965 + 6} />}>
    <Swipe lines={[V_ENFORCE]} from={t.at('real force')} to={t.end('behind the 15th') + 4} seed="ve" />
  </DocShot>
);

const T15 = 'img/ep2/fifteenth_amendment_joint_resolution_1869_nara.jpg';
const T15_LINE: Box = [190, 1398, 1415, 56];
const Waiting: React.FC = () => (
  <DocShot src={T15} size={[1920, 2690]} seed="t15" focusAt={S_WORDS} tag="Joint resolution proposing the 15th Amendment, Feb. 1869 · National Archives"
    keys={[[S_WORDS, {x: 900, y: 1330, z: 0.78}], [t.at('still there'), {x: 900, y: 1400, z: 0.92, tilt: 18, dof: 2, band: 120, dofY: 1400}], [S_EDISTO, {x: 920, y: 1410, z: 0.97, tilt: 22, dof: 2.2, band: 110, dofY: 1410}]]}
    over={<>
      <Slip text="written down in 1869" x={130} y={90} size={52} rot={-2} at={S_WORDS + 6} />
      <Slip text="still there, waiting" x={1080} y={800} size={72} rot={2} at={t.at('still there') - 2} coral />
    </>}>
    <Swipe lines={[T15_LINE]} from={t.at('written down')} to={t.end('the 1860s') + 8} seed="tw" />
  </DocShot>
);

// ------------------------------------------------------------------------------------------ 10 · a few acres
const Petition: React.FC = () => {
  const men = t.at('three men'), asked = t.at('They asked');
  return (
    <DocShot src={PETITION_P3} size={EDISTO.p3Size} seed="p3" tag={SRC.petition} focusAt={S_EDISTO}
      keys={[[S_EDISTO, {x: 1290, y: 1690, z: 0.9}], [asked - 4, {x: 1320, y: 1720, z: 0.98}],
        [t.at('A home') - 8, {x: 1050, y: 290, z: 0.9, tilt: 26, dof: 2.4, band: 120, dofY: 290}],
        [t.at('It be'), {x: 560, y: 365, z: 0.95, tilt: 26, dof: 2.4, band: 120, dofY: 365}],
        [S_END, {x: 470, y: 365, z: 1.0, tilt: 26, dof: 2.4, band: 120, dofY: 365}]]}
      over={<Slip text="Edisto Island · Oct. 28, 1865" x={130} y={90} size={52} rot={-2} at={S_EDISTO + 6} out={asked + 10} />}>
      <Spot size={EDISTO.p3Size} boxes={[EDISTO.bram, EDISTO.moultrie, EDISTO.sampson]} at={men} out={asked + 10} id="p3names" dark={0.45} />
      <Swipe lines={[EDISTO.bram]} from={men} to={men + 12} seed="m1" out={asked + 10} />
      <Swipe lines={[EDISTO.moultrie]} from={men + 12} to={men + 24} seed="m2" out={asked + 10} />
      <Swipe lines={[EDISTO.sampson]} from={men + 24} to={men + 36} seed="m3" out={asked + 10} />
      <Swipe lines={EDISTO.fewAcres} from={t.at('A home')} to={t.end('acres') + 6} seed="fa" />
    </DocShot>
  );
};

// ------------------------------------------------------------------------------------------ 11 · the whole board
/** ON PAPER lands at LAW, LAND is struck 24 frames later, PROTECTION's torn half falls at 40 (ep3board's ch10 table). */
const MARKS = t.at('a hundred years') + 22;
const PULL = t.at('subscribe') - 40;
const WHOLE: [number, number, number] = [1680, 1198, 0.41];   // the whole series board, inside the title-safe margin
const PUSH0 = ROLL + 720, PUSH1 = ROLL + 940;
const PET: [number, number, number] = [960, 150, 1.9];         // the petition, top centre
const END_CAM: BoardKey[] = [
  [S_END, 360, 320, 1.2],
  [t.at('about citizens') + 2, 300, 830, 1.32],
  [t.at('about the vote') - 6, 300, 860, 1.36],
  [t.at('about the vote') + 10, 300, 1440, 1.32],
  [MARKS - 40, 320, 1460, 1.36],
  [MARKS - 2, 1000, 420, 0.8],
  [MARKS + 60, 1330, 430, 0.75],
  [PULL, 1360, 440, 0.74],
  [ROLL + 300, ...WHOLE],
  [PUSH0, WHOLE[0], WHOLE[1], 0.4],
  [PUSH1, ...PET],
  [END + 10, PET[0], PET[1], PET[2] * 1.04],
];

/** The petition's line on the board (cr_petition.png, 1000 x 128, pinned at (660, 60), w 600, r -1). */
const PET_LINES: Box[] = [[725, 28, 245, 42], [18, 72, 425, 42]];
/** At the very end: the rest of the board falls into shadow and the coral runs along "A home if / It be but A few acres." */
const PetitionLight: React.FC = () => {
  const g = useGFrame();
  const dark = interpolate(g, [PUSH0 + 60, PUSH1], [0, 0.84], clamp);
  return (
    <>
      {dark > 0 && (
        <svg width={6400} height={4400} style={{position: 'absolute', left: -1600, top: -1200, zIndex: 80, overflow: 'visible'}}>
          <defs>
            <filter id="c10blur"><feGaussianBlur stdDeviation={26} /></filter>
            <mask id="c10hole">
              <rect width={6400} height={4400} fill="#fff" />
              <rect x={1600 + 640} y={1200 + 36} width={640} height={165} rx={20} fill="#000" filter="url(#c10blur)" />
            </mask>
          </defs>
          <rect width={6400} height={4400} fill={`rgba(9,8,6,${dark})`} mask="url(#c10hole)" />
        </svg>
      )}
      <div style={{position: 'absolute', left: 660, top: 60, width: 600, height: 76.8, transform: 'rotate(-1deg)', transformOrigin: '50% 50%', zIndex: 81}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1000, height: 128, transform: 'scale(0.6)', transformOrigin: '0 0'}}>
          <Swipe lines={PET_LINES} from={PUSH1 + 20} to={PUSH1 + 110} seed="pet" />
        </div>
      </div>
    </>
  );
};

const EndOverlay: React.FC = () => (
  <>
    <Slip text="thanks for watching" x={140} y={880} size={60} rot={-2} at={t.at('Thanks for watching')} out={ROLL + 40} />
    <Slip text="subscribe ↓" x={1400} y={880} size={64} rot={2} at={t.at('subscribe') - 2} out={ROLL + 40} coral />
  </>
);

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Question key="q" />],
    [S_COLS, <SeriesBoard key="cols" ch={10} from={S_COLS} at={NEVER} cam={COLS_CAM} />],
    [S_LAW, <Law key="law" />],
    [S_LAND, <Acres key="acres" />],
    [S_STEVENS, <Stevens key="stevens" />],
    [S_CROP, <Crop key="crop" />],
    [S_PROT, <SeriesBoard key="prot" ch={10} from={S_PROT} at={NEVER} cam={PROT_CAM} overlay={<ProtOverlay />} />],
    [S_FAIL, <Failure key="fail" />],
    [S_LAST, <Lasted key="last" />],
    [S_FOUND, <Founding key="found" />],
    [S_1954, <Brown key="brown" />],
    [S_1965, <Vra key="vra" />],
    [S_WORDS, <Waiting key="wait" />],
    [S_EDISTO, <Petition key="pet" />],
    [S_END, (
      <SeriesBoard key="end" ch={10} from={S_END} at={MARKS} cam={END_CAM} overlay={<EndOverlay />}>
        <BoardSignoff at={ROLL + 150} />
        <PetitionLight />
      </SeriesBoard>
    )],
  ]);
  return (
    <>
      {scene}
      <Cuts />
      <Sfx at={MARKS + 40} src="sfx/page_turn.wav" volume={0.3} />
      {[t.at('ended slavery'), t.at('equal protection'), t.at('protected the vote'), t.at('the 14th', 2), t.at('real force'), t.at('written down'), t.at('A home'), PUSH1 + 20].map((f) => (
        <Sfx key={f} at={f} src="sfx/marker_tick.wav" volume={0.22} />
      ))}
    </>
  );
};

/** Music (MUSIC.md): r_ending from the top at 0.16 (it runs out under the list of things that lasted); a second pass of
 *  its warm opening from "And three amendments" through the thank-you; then, after the last word only, "Roll, Jordan,
 *  Roll" (Fisk University Jubilee Quartet, 1909), the series' tune, under the pull-back and the petition, fading out with
 *  the picture at the end of its second chorus. */
export const Ch10: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch10_a_few_acres.wav" lead={LEAD} extra={EXTRA}
    music={[
      {src: 'music/r_ending.mp3', volume: 0.16},
      {src: 'music/r_ending.mp3', volume: 0.13, from: S_FOUND - 2, to: ROLL + 24, fadeOut: 40},
      {src: 'music/period/roll_jordan_fisk_1909.mp3', volume: 0.42, from: ROLL, to: END, fadeOut: 150},
    ]}>
    <Body />
  </ChapterShell>
);
