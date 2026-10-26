// Chapter 2 · The Army Goes Back In. A 20-second recap over Episode 1's pictures (the 13th, Johnson, the pardons, the
// Black Codes, the 14th, Edisto and its three words), then the Reconstruction Act of March 2, 1867, counted out in three
// parts on McPherson's printing of it (Political Manual, 1871), the five military districts on the drawn map, and the
// two ways the South saw the army: an occupation, or soldiers standing on the freedpeople's side.
// Note: McPherson p.166's "The Senate passed it over the veto" (Feb. 8) is the Nebraska bill, not this one: the swipe
// for "over Johnson's veto" runs on the page's own heading, "Veto of the Reconstruction Bill, March 2, 1867."
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch02_the_army.words.json';
import VA from '../../public/img/ep1/ms_vagrant_act.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Highlight, JF, Tag} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';
import {SeriesBoard} from '../kit/ep2board';
import {type Box, camAt, carry, CORAL, Counter, cut, DOC_F, DocShot, EDISTO, FocusIn, PhotoShot, Sheet, type SheetCam, Slip, Spot, SRC, Swipe, TEAL, THREE_WORDS, Win} from '../kit/rc';
import {DistrictMap, MAP_TAG, TopShade, ucam} from './ch02_maps';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
export const CH02_FRAMES = chapterFrames(N, LEAD);

// sources
const T13 = 'img/ep1/thirteenth_src.jpg';
const T13S: [number, number] = [3196, 4253];
const T13F = 'grayscale(1) sepia(0.15) contrast(1.6) brightness(1.08)';
const VAG = 'img/ep1/ms_vagrant_act.jpg';
const VAS = VA.size as [number, number];
const V_TITLE = VA.phrases['To Amend the Vagrant Laws'] as Box[];
const P166 = 'img/ch02/reconstruction_act_votes_and_veto_mcpherson_1871_p166.jpg';
const P191 = 'img/ch02/reconstruction_act_text_mcpherson_1871_p191.jpg';
const P192 = 'img/ch02/reconstruction_act_sec5_mcpherson_1871_p192.jpg';
const PAGE: [number, number] = [1825, 3000];
const MAP69 = 'img/ch02/military_map_1869_south_detail.jpg';
const MAP69S: [number, number] = [3000, 1168];
const ALLEG = 'img/ch02/reconstruction_allegory_1867.jpg';
const ALLEGS: [number, number] = [1536, 1228];
const WAUD = 'img/ch02/waud_the_freedmens_bureau_harpers_1868-07-25.jpg';
const MAP_F = 'grayscale(1) sepia(0.25) contrast(1.25) brightness(1.02)';
const MCPH = 'McPherson, Political History … Reconstruction (1871)';
const SRCS = {
  t13: 'Joint resolution, 13th Amendment, signed by Lincoln, Feb. 1, 1865 · Library of Congress',
  johnson: 'Andrew Johnson, 1865 (A. Bogardus & Co.) · Library of Congress',
  pardons: '“President Johnson pardoning rebels,” Harper\'s Weekly, Oct. 14, 1865 · Library of Congress',
  va: 'Weekly Copiahan (Hazlehurst, Miss.), Dec. 30, 1865 · Library of Congress',
  p191: `${MCPH}, p. 191 · Internet Archive`,
  p192: `${MCPH}, p. 192 · Internet Archive`,
  p166: `${MCPH}, p. 166 · Internet Archive`,
  edisto: 'Freedpeople, Hopkinson plantation, Edisto Island, 1862 · Henry P. Moore · Library of Congress',
  map69: 'Military Map of the United States (detail), War Department, 1869 · Library of Congress',
  alleg: '“Reconstruction,” lithograph, 1867 · Library of Congress',
  views: 'Military Map of the U.S., 1869 · “The Freedmen\'s Bureau,” A. R. Waud, Harper\'s Weekly, July 25, 1868 · LOC; Internet Archive',
};

// line boxes (source px), each drawn on its page and checked
const AM14: Box = [228, 463, 552, 36];               // p191 "14th Constitutional Amendment."
const ART14: Box = [398, 936, 220, 26];              // p191 "ARTICLE XIV."
const ACT_HEAD: Box = [942, 802, 815, 36];           // p191 "Reconstruction Act of Thirty-Ninth Congress"
const TEN: Box[] = [[1032, 1006, 716, 36], [940, 1042, 792, 36], [940, 1078, 705, 36]];   // "rebel States of Virginia … and Arkansas;"
const VETO: Box = [938, 2602, 790, 38];              // p166 "Veto of the Reconstruction Bill, March 2, 1867."
const CONST: Box[] = [[155, 272, 765, 36], [116, 312, 804, 36]];   // p192 "Sec. 5. That when the people … shall have formed a constitution"
const RACE: Box[] = [[258, 504, 662, 36], [116, 542, 98, 36]];     // p192 "of whatever race, color, or previous condition,"
const RATIFY: Box[] = [[116, 1158, 804, 36], [470, 1236, 448, 36]]; // p192 "adopted the amendment to the Constitution … known as article fourteen,"

// the shots
const S1 = c('President Andrew'), S2 = c('pardoned'), S3 = c('The South answered'), S4 = c('And Congress fought'), S5 = c('When the freed');
const S6 = c('they described'), S7 = c('By 1867'), S8 = c('In March'), S9 = c("Here's what"), S10 = c('One'), S11 = c('They were split');
const S12 = c('Two'), S13 = c('Three', 3), S14 = c('This is the start'), S15 = c('To many white'), B = c('a government');

/** "STEP n/3", on a soft dark backing so it reads over a bright page too. */
const Step: React.FC<{n: number; at: number}> = ({n, at}) => (
  <>
    {useCurrentFrame() >= at && <div style={{position: 'absolute', right: 92, top: 88, width: 236, height: 64, background: 'rgba(10,9,7,0.62)', borderRadius: 4, filter: 'blur(1px)'}} />}
    <Counter n={n} at={at} />
  </>
);

const Stamps: React.FC<{at: number[]}> = ({at}) => <>{at.map((f) => <Sfx key={f} at={f} src="sfx/stamp.wav" volume={0.3} />)}</>;
const Marker: React.FC<{at: number}> = ({at}) => <Sfx at={at} src="sfx/marker_tick.wav" volume={0.25} />;

/** A hard cut lands with a whoosh. */
const Cuts: React.FC = () => <>{[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />)}</>;

// ------------------------------------------------------------------------------------------------------- the recap
/** Last time: the war over, slavery over (the 13th Amendment). */
const Thirteenth: React.FC = () => (
  <DocShot src={T13} size={T13S} seed="t13" filter={T13F} tag={SRCS.t13} focusAt={0}
    keys={[[0, {x: 1598, y: 1600, z: 0.27}], [S1, {x: 1598, y: 1450, z: 0.31}]]}
    over={<>
      <Slip text="last time" x={130} y={110} rot={-2} size={54} at={0} />
      <Slip text="the war: over" x={1240} y={330} at={t.at('Civil War') - 2} />
      <Slip text="slavery: over" x={1290} y={480} rot={2} coral at={t.at('slavery') - 2} />
    </>} />
);

/** The South answered with the Black Codes: Mississippi's vagrant law. */
const Codes: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 3320, z: 1.15, tilt: 30, dof: 2.6, band: 50};
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={VAG} size={VAS} cam={camAt([[S3, {...L, x: 330}], [S4, {...L, x: 470, z: 1.22}]], f)} seed="va" offset={[carry(f, S3, S4), 0]}>
        <Swipe lines={V_TITLE} from={t.at('Black Codes') - 6} to={t.end('Black Codes')} seed="va1" />
      </Sheet>
      <Slip text="the Black Codes · 1865" x={1060} y={760} size={64} at={t.at('Black Codes') - 2} />
      <Marker at={t.at('Black Codes') - 6} />
      <Tag text={SRCS.va} />
    </AbsoluteFill>
  );
};

/** Congress fought back with the 14th: McPherson prints it at the top of the same page as the Act. */
const Fourteenth: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 470, z: 1.15, tilt: 26, dof: 2.4, band: 60};
  const cam = camAt([[S4, {...L, x: 380}], [t.at('14th'), {...L, x: 500, y: 600, dofY: 482, z: 1.05}], [S5, {...L, x: 520, y: 700, dofY: 700, z: 1.0}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={P191} size={PAGE} cam={cam} seed="p191" filter={DOC_F} offset={[carry(f, S4, S5), 0]}>
        <Swipe lines={[AM14]} from={t.at('14th')} to={t.end('Amendment')} seed="a14" />
        <Swipe lines={[ART14]} from={t.end('Amendment') + 2} to={t.end('Amendment') + 8} seed="x14" />
      </Sheet>
      <Slip text="14th Amendment · 1866" x={1150} y={800} size={60} rot={2} at={t.at('14th') - 2} />
      <Marker at={t.at('14th')} />
      <Tag text={SRCS.p191} />
    </AbsoluteFill>
  );
};

/** They described themselves in three words: each one swiped as it's said. */
const Words: React.FC = () => (
  <DocShot src={THREE_WORDS} size={EDISTO.wordsSize} seed="lhv" tag={SRC.letter} focusAt={S6}
    keys={[[S6, {x: 850, y: 480, z: 1.0}], [t.at('Landless') - 8, {x: 600, y: 420, z: 1.5}], [S7, {x: 660, y: 420, z: 1.62}]]}>
    <Swipe lines={[EDISTO.landless]} from={t.at('Landless')} to={t.end('Landless')} seed="w1" />
    <Swipe lines={[EDISTO.homeless]} from={t.at('Homeless')} to={t.end('Homeless')} seed="w2" />
    <Swipe lines={[EDISTO.voteless]} from={t.at('Voteless')} to={t.end('Voteless')} seed="w3" />
  </DocShot>
);

// ----------------------------------------------------------------------------------------------------- the Act
/** By 1867 Congress was in charge: the army's own map of the South (1869). */
const Charge: React.FC = () => (
  <DocShot src={MAP69} size={MAP69S} seed="m69" filter={MAP_F} tag={SRCS.map69} focusAt={S7}
    keys={[[S7, {x: 1250, y: 600, z: 0.9}], [S8, {x: 1700, y: 560, z: 1.05}]]}
    over={<>
      <Slip text="1867: Congress in charge" x={160} y={150} rot={-2} at={t.at('Congress was in charge') - 2} />
      <Slip text="done asking nicely" x={1080} y={820} rot={2} size={72} coral at={t.at('done asking') - 2} />
    </>} />
);

/** The Act, over the veto: the heading of Johnson's veto message, swiped. */
const Act: React.FC = () => {
  const ra = t.at('Reconstruction Act');
  return (
    <DocShot src={P166} size={PAGE} seed="p166" tag={SRCS.p166} focusAt={S8}
      keys={[[S8, {x: 1320, y: 2560, z: 0.62}], [t.at("over Johnson's"), {x: 1330, y: 2640, z: 1.05, tilt: 24, dof: 2.2, band: 60, dofY: 2621}], [S9, {x: 1380, y: 2650, z: 1.1, tilt: 26, dof: 2.2, band: 60, dofY: 2621}]]}
      over={<>
        <Highlight text="RECONSTRUCTION ACT" x={110} y={106} size={84} at={ra} seed={31} rot={-2} />
        <Definition term="Reconstruction Act" def="the 1867 law that put the South under the army until it met Congress's terms" at={ra + 9} x={120} y={830} w={1500} />
        <Slip text="March 1867" x={1380} y={250} rot={2} at={t.at('In March')} />
        <Stamps at={[ra]} />
        <Marker at={t.at("over Johnson's")} />
      </>}>
      <Swipe lines={[VETO]} from={t.at("over Johnson's")} to={t.end('veto') + 4} seed="veto" />
    </DocShot>
  );
};

/** The Act itself (McPherson p.191): its heading, then part one, the ten states. */
const PartOne: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 820, z: 1.05, tilt: 28, dof: 2.4, band: 60};
  const cam = camAt([
    [S9, {...L, x: 1250, z: 0.95}], [t.at('three parts'), {...L, x: 1350}],
    [S10, {...L, x: 1250, y: 1040, dofY: 1040, band: 90}], [t.end('army'), {...L, x: 1400, y: 1050, dofY: 1050, band: 90, z: 1.1}], [S11, {...L, x: 1420, y: 1050, dofY: 1050, band: 90, z: 1.12}],
  ], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S9}>
        <Sheet src={P191} size={PAGE} cam={cam} seed="p191" filter={DOC_F} offset={[carry(f, S9, S11), 0]}>
          <Swipe lines={[ACT_HEAD]} from={t.at("Here's what")} to={t.end('three parts')} seed="hd" />
          <Swipe lines={TEN} from={t.at('Ten Southern')} to={t.end('army')} seed="ten" />
        </Sheet>
      </FocusIn>
      <Slip text="in three parts" x={1300} y={160} rot={2} at={t.at('three parts') - 2} out={S10} />
      <Slip text="10 states" x={1360} y={760} size={70} rot={-2} coral at={t.at('Ten Southern') - 2} />
      <Step n={1} at={S10} />
      <Marker at={t.at("Here's what")} />
      <Marker at={t.at('Ten Southern')} />
      <Tag text={SRCS.p191} />
    </AbsoluteFill>
  );
};

/** Five military districts on the drawn map; a general on the 4th; Tennessee left out. */
const Districts: React.FC = () => {
  const md = t.at('military districts'), tn = t.at('Tennessee');
  const keys = [ucam(S11, 3380, 2880, 0.6, 36, -4), ucam(t.at('each run'), 3420, 2860, 0.7, 40, -4), ucam(tn, 3640, 2700, 0.86, 42, -4), ucam(S12, 3700, 2680, 0.92, 42, -4)];
  return (
    <AbsoluteFill>
      <DistrictMap keys={keys} rise={t.at('five military') - 4} ord={t.at('each run')} ordOut={tn + 30} tn={tn} />
      <TopShade />
      {useCurrentFrame() < tn + 12 && <>
        <Highlight text="MILITARY DISTRICTS" x={110} y={106} size={84} at={md} seed={32} rot={-2} />
        <Definition term="military districts" def="the five parts of the South the army ran, each under a general" at={md + 9} x={120} y={830} w={1500} />
      </>}
      <Slip text="left out" x={170} y={190} rot={-2} at={t.at('left out') - 2} />
      <Slip text="it had ratified the 14th, 1866" x={170} y={320} rot={2} size={58} at={t.at('It had already') - 2} />
      <Step n={1} at={S11} />
      <Stamps at={[md]} />
      <Sfx at={t.at('each run')} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={tn} src="sfx/tick.wav" volume={0.35} />
      <Tag text={`${MAP_TAG} · Ord, Brady, 1865 · Library of Congress`} />
    </AbsoluteFill>
  );
};

/** Part two: a new constitution, and Black men voting (Sec. 5). */
const PartTwo: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 300, z: 1.1, tilt: 30, dof: 2.4, band: 70};
  const cam = camAt([[S12, {...L, x: 420}], [t.at('write a new'), {...L, x: 520, y: 310}], [t.at('Black men'), {...L, x: 560, y: 520, dofY: 524}], [S13, {...L, x: 640, y: 530, dofY: 524, z: 1.16}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={P192} size={PAGE} cam={cam} seed="p192" filter={DOC_F} offset={[carry(f, S12, S13), 0]}>
        <Swipe lines={CONST} from={t.at('write a new')} to={t.end('constitution')} seed="cn" />
        <Swipe lines={RACE} from={t.at('Black men')} to={t.end('vote')} seed="rc" />
        <Spot size={PAGE} boxes={RACE} at={t.at('both for')} id="sprace" />
      </Sheet>
      <Slip text="a new constitution" x={1220} y={170} rot={2} at={t.at('new constitution') - 2} />
      <Slip text="Black men vote" x={160} y={790} size={70} rot={-2} coral at={t.at('allowed to vote') - 2} />
      <Slip text="for the convention…" x={1180} y={760} size={54} rot={2} at={t.at('both for') - 2} />
      <Slip text="…and every election after" x={1130} y={870} size={54} rot={-1} at={t.at('every election') - 2} />
      <Step n={2} at={S12} />
      <Marker at={t.at('write a new')} />
      <Marker at={t.at('Black men')} />
      <Tag text={SRCS.p192} />
    </AbsoluteFill>
  );
};

/** Part three: ratify "article fourteen". */
const PartThree: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 1200, z: 1.12, tilt: 30, dof: 2.4, band: 70};
  const cam = camAt([[S13, {...L, x: 380}], [t.at('ratify'), {...L, x: 500, y: 1210}], [S14, {...L, x: 640, y: 1240, dofY: 1220, z: 1.2}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={P192} size={PAGE} cam={cam} seed="p192" filter={DOC_F} offset={[carry(f, S13, S14), 0]}>
        <Swipe lines={RATIFY} from={t.at('ratify')} to={t.end('ratify the 14th Amendment')} seed="rt" />
      </Sheet>
      <Slip text="ratify the 14th" x={1250} y={800} size={70} rot={-2} at={t.at('ratify') - 2} />
      <Step n={3} at={S13} />
      <Marker at={t.at('ratify')} />
      <Tag text={SRCS.p192} />
    </AbsoluteFill>
  );
};

/** Congressional Reconstruction, on the 1867 print called "Reconstruction". */
const Congressional: React.FC = () => {
  const cr = t.at('Congressional Reconstruction');
  return (
    <DocShot src={ALLEG} size={ALLEGS} seed="alleg" filter="grayscale(1) contrast(1.2) brightness(1.02)" tag={SRCS.alleg} focusAt={S14}
      keys={[[S14, {x: 768, y: 560, z: 0.8}], [S15, {x: 768, y: 600, z: 0.92}]]}
      over={<>
        <Highlight text="CONGRESSIONAL RECONSTRUCTION" x={110} y={118} size={70} at={cr} seed={33} rot={-2} />
        <Definition term="Congressional Reconstruction" def="Reconstruction run by Congress, not the President, from 1867" at={cr + 9} x={120} y={830} w={1500} />
        <Slip text="some call it: Radical Reconstruction" x={1000} y={250} rot={2} size={56} at={t.at('Some people') - 2} />
        <Stamps at={[cr]} />
      </>} />
  );
};

/** Two views: many white Southerners (an occupation) | freedpeople (soldiers on their side). */
const Views: React.FC = () => {
  const fp = t.at('To freedpeople');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 958, top: 70, width: 4, height: 900, background: '#ece6d8', opacity: 0.8}} />
      <div style={{position: 'absolute', left: 120, top: 106, width: 760, textAlign: 'center', fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: TEAL}}>MANY WHITE SOUTHERNERS</div>
      <FocusIn at={S15}><Win src={MAP69} cx={1150} cy={640} s={0.62} w={760} h={560} x={120} y={170} r={-1.5} filter={`${MAP_F} brightness(0.8)`} /></FocusIn>
      <Slip text="a military occupation" x={170} y={700} size={62} rot={-2} at={t.at('military occupation') - 2} />
      <Slip text="“rule by bayonet”" x={250} y={830} size={66} rot={2} at={t.at('rule by') - 2} />
      {useCurrentFrame() >= fp - 2 && <>
        <div style={{position: 'absolute', left: 1040, top: 106, width: 760, textAlign: 'center', fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: CORAL}}>FREEDPEOPLE</div>
        <FocusIn at={fp - 2}><Win src={WAUD} cx={1560} cy={1050} s={0.4} w={760} h={600} x={1040} y={170} r={1.5} filter="grayscale(1) contrast(1.2)" /></FocusIn>
        <Slip text="something brand new" x={1120} y={820} size={62} rot={-2} coral at={t.at('brand new') - 2} />
      </>}
      <Sfx at={S15} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={fp - 2} src="sfx/tick.wav" volume={0.4} />
      <Tag text={SRCS.views} />
    </AbsoluteFill>
  );
};

/** Music (MUSIC.md): banjo and fiddle (rc_jubilo, Episode 1's) under the recap, handing over to g_grip at "By 1867". */
const Body: React.FC = () => {
  const scene = useScene([
    [0, <Thirteenth key="t13" />],
    [S1, <PhotoShot key="j" src="img/wall/cr_johnson.png" size={[900, 1101]} a={S1} b={S2} w={560} x={700} tag={SRCS.johnson}>
      <Slip text="President Andrew Johnson" x={1080} y={300} rot={-2} size={58} at={S1 + 2} />
    </PhotoShot>],
    [S2, <PhotoShot key="p" src="img/wall/cr_pardons.png" size={[900, 1114]} a={S2} b={S3} w={560} x={700} tag={SRCS.pardons}>
      <Slip text="pardoned" x={1100} y={260} rot={-2} at={S2 + 2} />
      <Slip text="and their land, given back" x={1060} y={420} size={58} rot={2} coral at={t.at('gave them back') - 2} />
    </PhotoShot>],
    [S3, <Codes key="c" />],
    [S4, <Fourteenth key="14" />],
    [S5, <PhotoShot key="e" src="img/ch02/cr_edisto.png" size={[900, 645]} a={S5} b={S6} w={980} x={960} y={500} rot={-1.5} tag={SRCS.edisto}>
      <Slip text="Edisto Island" x={160} y={120} rot={-2} at={t.at('Edisto Island') - 2} />
      <Slip text="lost their land" x={1260} y={880} rot={2} coral at={t.at('lost their land') - 2} />
    </PhotoShot>],
    [S6, <Words key="w" />],
    [S7, <Charge key="ch" />],
    [S8, <Act key="act" />],
    [S9, <PartOne key="p1" />],
    [S11, <Districts key="md" />],
    [S12, <PartTwo key="p2" />],
    [S13, <PartThree key="p3" />],
    [S14, <Congressional key="cr" />],
    [S15, <Views key="v" />],
    [B, <SeriesBoard key="b" ch={2} from={B} at={t.at('standing')} />],
  ]);
  return <>{scene}<Cuts /></>;
};

const HAND = t.at('By 1867');
export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_the_army.wav" lead={LEAD}
    music={[{src: 'music/rc_jubilo.mp3', volume: 0.22, to: HAND + 6}, {src: 'music/g_grip.mp3', volume: 0.15, from: HAND - 12}]}>
    <Body />
  </ChapterShell>
);
