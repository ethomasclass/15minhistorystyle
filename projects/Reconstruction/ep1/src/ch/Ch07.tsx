// Chapter 7 · The Bureau. Built on the Ch06 model: hard cuts two frames before a phrase, pages on the desk read by the
// camera with the coral swipe, creased prints, the board at the end.
// Sources: Waud's "The Freedmen's Bureau" (Harper's, 1868); Leslie's and Harper's 1866 engravings of the Bureau at work;
// Hannah Barnett's "Information Wanted" ad (The Colored Tennessean, Nashville, Mar. 24, 1866); Johnson's two veto
// messages (Senate Ex. Docs. 25 and 31, 1866); Harper's, Apr. 28, 1866 (the House galleries).
// Override votes on the Civil Rights bill: Senate 33-15 (Apr. 6, 1866), House 122-41 (Apr. 9, 1866).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch07_the_bureau.words.json';
import AD from '../../public/img/ch07/information_wanted_ad_colored_tennessean_24mar1866.json';
import WAUD_MASK from '../../public/img/ch07/masks/waud_agent.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Arrow, Highlight, JF, Loop, type MaskData, Tag, useGFrame} from '../kit/Kit';
import {Person} from '../kit/figures';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Stamp, useScene} from '../kit/shell';
import {EpBoard} from '../kit/ep1board';
import {MASKS} from '../masks';
import {type Box, camAt, CORAL, DocShot, PRINT_F, type SheetCam, Slip, Spot, Swipe, TEAL} from '../kit/rc';
import {Ink, PrintShot, SheetTint} from './ch07_kit';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH07_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------------------------------------------ pictures
const WAUD = 'img/ch07/freedmens_bureau_waud_harpers_1868.jpg';
const WAUD_S: [number, number] = [3000, 2398];
const AGENT = {alpha: 'img/ch07/masks/waud_agent_subject_a.png', data: WAUD_MASK as unknown as MaskData};
const RATIONS = 'img/ch07/freedmens_bureau_issuing_rations_harpers_1866.jpg';
const RATIONS_S: [number, number] = [1536, 1032];
const WEDDING = 'img/ch07/marriage_colored_soldier_vicksburg_freedmens_bureau_harpers_1866.jpg';
const WEDDING_S: [number, number] = [3000, 2428];
const SCHOOL = 'img/ch07/primary_school_freedmen_vicksburg_harpers_1866.jpg';
const SCHOOL_S: [number, number] = [3000, 2337];
const ADI = 'img/ch07/information_wanted_ad_colored_tennessean_24mar1866.jpg';
const AD_S = AD.size as [number, number];
const VETO1 = 'img/ch07/johnson_veto_message_freedmens_bureau_bill_feb1866.jpg';
const VETO1_S: [number, number] = [1765, 3000];
const VETO2 = 'img/ch07/johnson_veto_message_civil_rights_bill_mar1866.jpg';
const VETO2_S: [number, number] = [1835, 3000];
const GALL = 'img/ch07/outside_galleries_house_civil_rights_bill_1866.jpg';
const GALL_S: [number, number] = [2391, 3000];

// line boxes (source px), each drawn on the image and checked
const AD_WANTED: Box[] = [AD.phrases['Information Wanted'][1] as Box];
const AD_DAUGHTER: Box[] = [[380, 650, 630, 44]];                                   // "my daughter, Martha James."
const AD_SOLD: Box[] = [[925, 828, 262, 42], [278, 872, 910, 42], [278, 917, 340, 42]]; // "was sold to Mr. John James, Nashville, Tenn., about / nine years ago,"
const AD_HANNAH: Box[] = [[605, 1140, 540, 44]];                                   // "HANNAH BARNETT."
const AD_BLOCK: Box[] = [[270, 585, 930, 610]];                                    // the whole ad, heading to signature
const V1_ACT: Box[] = [[800, 908, 830, 50], [205, 955, 495, 50]];                  // "An act to establish a Bureau for the relief / of Freedmen and Refugees,"
const V1_DATE: Box[] = [[405, 1100, 915, 42]];                                     // "February 19, 1866.—Read and ordered to be printed."
const V2_TITLE: Box[] = [[578, 920, 1140, 55], [245, 980, 125, 52]];              // "To protect all persons in the United States in their civil / rights,"
const V2_BORN: Box[] = [[833, 1760, 720, 52], [1355, 1815, 365, 52], [205, 1870, 555, 52]]; // "all persons born in the United States, … are declared to be / citizens of the United States."

const SRC = {
  waud: "A. R. Waud, “The Freedmen's Bureau,” Harper's Weekly, July 25, 1868 · Library of Congress",
  howard: 'Oliver Otis Howard, c.1861-65 · Library of Congress',
  rations: "Issuing rations to the old and sick, Frank Leslie's, 1866 · Library of Congress",
  wedding: "Marriage of a colored soldier at Vicksburg, Harper's Weekly, June 30, 1866 · Library of Congress",
  school: "Primary school for freedmen, Vicksburg, Harper's Weekly, 1866 · Library of Congress",
  ad: 'The Colored Tennessean (Nashville), Mar. 24, 1866 · Library of Congress',
  veto1: "Johnson's veto message, Freedmen's Bureau bill, Feb. 19, 1866 · Library of Congress",
  veto2: "Johnson's veto message, Civil Rights bill, Mar. 27, 1866 · Library of Congress",
  gall: "Outside the House galleries, Civil Rights bill, Harper's Weekly, Apr. 28, 1866 · Library of Congress",
  votes: 'Override votes: Senate 33-15, Apr. 6, 1866 · House 122-41, Apr. 9, 1866 · Congressional Globe',
};

// ------------------------------------------------------------------------------------------------------ the cuts
const S_HOWARD = t.at('Oliver Howard') - 2;
const S_FOOD = t.at('It handed') - 2;
const S_MARRY = t.at('It made marriages') - 2;
const S_SCHOOL = t.at('It helped start') - 2;
const S_FAMILY = t.at('And it helped families') - 2;
const S_ADS = t.at('Now people') - 2;
const S_AD = t.at('Look at this') - 2;
const S_FEW = t.at('Hundreds of ads') - 2;
const S_VETO1 = t.at('And it was supposed') - 2;
const S_CRA = t.at('Then Congress') - 2;
const S_RIGHTS = t.at('It said people') - 2;
const S_VETO2 = t.at('Johnson vetoed that') - 2;
const S_GALL = t.at('So Congress did') - 2;
const S_OVR = t.at('An override') - 2;
const S_BOARD = t.at('The Civil Rights Act became') - 2;

const Cuts: React.FC = () => (
  <>{[S_HOWARD, S_FOOD, S_MARRY, S_SCHOOL, S_FAMILY, S_ADS, S_AD, S_FEW, S_VETO1, S_CRA, S_RIGHTS, S_VETO2, S_GALL, S_OVR].map((f) => (
    <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />
  ))}</>
);
const Stamps: React.FC<{at: number[]}> = ({at}) => <>{at.map((f) => <Sfx key={f} at={f} src="sfx/stamp.wav" volume={0.33} />)}</>;

// ------------------------------------------------------------------------------------------------------ shots
/** Who stood between: Waud's Bureau agent between the two crowds; the Bureau named on him. */
const Bureau: React.FC = () => {
  const f = useCurrentFrame();
  const keys: [number, SheetCam][] = [[0, {x: 1440, y: 1160, z: 0.86}], [t.at('Mostly'), {x: 1400, y: 1120, z: 0.9}], [S_HOWARD, {x: 1290, y: 1060, z: 1.06}]];
  const z = camAt(keys, f).z;
  return (
    <>
      <DocShot src={WAUD} size={WAUD_S} keys={keys} tag={SRC.waud} filter={PRINT_F} focusAt={2}
        over={<>
          <Highlight text="FREEDMEN'S BUREAU" x={110} y={106} size={70} at={t.at("Freedmen's Bureau")} seed={71} rot={-2} />
          <Definition term="Freedmen's Bureau" def="the federal office set up to help people freed from slavery" at={t.at("Freedmen's Bureau") + 10} x={120} y={840} w={860} />
          <Slip text="March 1865" x={1460} y={130} rot={2} at={t.at('March')} />
        </>}>
        <SheetTint mask={AGENT} at={t.at('stood between')} z={z} />
      </DocShot>
      <Stamps at={[t.at("Freedmen's Bureau")]} />
    </>
  );
};

/** Howard again, as a creased print, his subject in coral. */
const Howard: React.FC = () => (
  <PrintShot src="img/ch07/cr_howard.png" size={[900, 1309]} a={S_HOWARD} b={S_FOOD} w={560} x={620} tag={SRC.howard} mask={MASKS.howard} tintAt={S_HOWARD + 4}>
    <Slip text="Gen. O. O. Howard" x={1040} y={330} at={t.at('Oliver Howard') + 2} />
    <Slip text="Edisto, fall 1865" x={1080} y={460} rot={2} at={t.at('Edisto')} coral />
    <Slip text="slavery → freedom" x={1060} y={640} rot={-2} at={t.at('slavery to freedom')} />
  </PrintShot>
);

/** Food and medicine: rations handed through the Bureau's window. */
const Food: React.FC = () => (
  <DocShot src={RATIONS} size={RATIONS_S} keys={[[S_FOOD, {x: 760, y: 470, z: 1.36}], [S_MARRY, {x: 700, y: 460, z: 1.46}]]} tag={SRC.rations} filter={PRINT_F}
    carryFrom={S_FOOD} carryTo={S_MARRY}
    over={<>
      <Slip text="food" x={1260} y={760} at={t.at('food')} />
      <Slip text="medicine" x={1360} y={870} rot={2} at={t.at('medicine')} />
    </>}>
    <Loop cx={500} cy={425} rx={120} ry={80} at={t.at('food')} seed={3} width={4} color={TEAL} />
  </DocShot>
);

/** Marriages: a Bureau chaplain marries a soldier and his bride at Vicksburg. */
const Marry: React.FC = () => (
  <DocShot src={WEDDING} size={WEDDING_S} keys={[[S_MARRY, {x: 1500, y: 1060, z: 0.7}], [S_SCHOOL, {x: 1420, y: 1000, z: 0.86}]]} tag={SRC.wedding} filter={PRINT_F}
    carryFrom={S_MARRY} carryTo={S_SCHOOL}
    over={<>
      <Slip text="a legal marriage" x={1240} y={765} at={t.at('legal')} />
      <Slip text="before: no legal marriage" x={1120} y={875} rot={2} at={t.at("hadn't counted")} coral />
    </>}>
    <Loop cx={1355} cy={1030} rx={110} ry={80} at={t.at('marriages')} seed={5} width={6} color={TEAL} />
  </DocShot>
);

/** Schools: the Vicksburg primary school; the camera finds an older woman reading beside a boy. */
const School: React.FC = () => (
  <DocShot src={SCHOOL} size={SCHOOL_S} tag={SRC.school} filter={PRINT_F} carryFrom={S_SCHOOL} carryTo={S_FAMILY}
    keys={[[S_SCHOOL, {x: 1560, y: 1050, z: 0.76}], [t.at('Grandparents'), {x: 1600, y: 1060, z: 0.8}], [t.at('grandchildren') + 10, {x: 1990, y: 1150, z: 1.45}], [S_FAMILY, {x: 2000, y: 1150, z: 1.52}]]}
    over={<Slip text="Vicksburg, 1866" x={1420} y={130} rot={2} at={t.at('thousands')} />}>
    <Loop cx={2030} cy={1150} rx={300} ry={230} at={t.at('learning')} seed={9} width={4} color={TEAL} />
  </DocShot>
);

/** Families sold apart: a drawn family on the desk, then the children pulled away from their mother. */
const Family: React.FC = () => {
  const g = useGFrame();
  const at = t.at('sold away');
  const p = interpolate(g, [at, at + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const e = 1 - Math.pow(1 - p, 3);
  const kids = [{x0: 930, x1: 1420, h: 240}, {x0: 1060, x1: 1610, h: 205}];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Person x={740} y={830} h={380} dress at={S_FAMILY + 2} />
      {kids.map((k, i) => <React.Fragment key={i}>
        {p > 0 && <Person x={k.x0} y={830} h={k.h} dashed hat={false} />}
        <Person x={k.x0 + (k.x1 - k.x0) * e} y={830} h={k.h} hat={false} at={S_FAMILY + 4 + i * 2} />
      </React.Fragment>)}
      {p <= 0 && <Loop cx={880} cy={660} rx={330} ry={260} at={t.at('families')} seed={12} width={5} color={TEAL} />}
      <Arrow x1={1130} y1={520} x2={1400} y2={520} bow={-30} color={CORAL} width={6} at={at + 4} />
      <Slip text="sold" x={1460} y={400} rot={-3} at={at + 6} coral />
      <Slip text="parents · children" x={440} y={250} rot={-2} at={t.at('parents and children')} />
      <Sfx at={at} src="sfx/whoosh.wav" volume={0.15} />
    </AbsoluteFill>
  );
};

/** "Information Wanted": the ads, then Hannah Barnett's. */
const Ads: React.FC = () => (
  <DocShot src={ADI} size={AD_S} keys={[[S_ADS, {x: 740, y: 760, z: 0.82, rot: -2}], [S_AD, {x: 730, y: 700, z: 0.9, rot: -1}]]} tag={SRC.ad} focusAt={S_ADS}>
    <Swipe lines={AD_WANTED} from={t.at('ads in newspapers')} to={t.end('newspapers') + 4} seed="aw" />
  </DocShot>
);

const AdRead: React.FC = () => {
  const L: SheetCam = {x: 760, y: 900, z: 1.12, tilt: 28, dof: 2.4, band: 70};
  return (
    <DocShot src={ADI} size={AD_S} tag={SRC.ad}
      keys={[[S_AD, {...L, y: 760, dofY: 610}], [t.at('A mother'), {...L, y: 900, dofY: 1160}], [t.at('her daughter'), {...L, y: 860, dofY: 670}],
        [t.at('since Martha'), {...L, y: 900, dofY: 900}], [S_FEW, {...L, x: 780, y: 910, z: 1.18, dofY: 910}]]}
      over={<Slip text="The Colored Tennessean" x={1180} y={130} rot={2} at={t.at('Nashville paper')} />}>
      <Ink lines={AD_WANTED} seed="aw" />
      <Swipe lines={AD_HANNAH} from={t.at('Hannah Barnett')} to={t.end('Hannah Barnett')} seed="ah" />
      <Swipe lines={AD_DAUGHTER} from={t.at('her daughter')} to={t.end('daughter Martha')} seed="ad" />
      <Swipe lines={AD_SOLD} from={t.at('was sold')} to={t.end('nine years earlier')} seed="as" />
    </DocShot>
  );
};

/** Hundreds survive; very few ended with a family together again. Hold, no new marks. */
const Few: React.FC = () => (
  <DocShot src={ADI} size={AD_S} tag={SRC.ad} keys={[[S_FEW, {x: 735, y: 890, z: 0.98}], [S_VETO1, {x: 735, y: 880, z: 0.86}]]}>
    <Ink lines={AD_WANTED} seed="aw" />
    <Ink lines={AD_HANNAH} seed="ah" />
    <Ink lines={AD_DAUGHTER} seed="ad" />
    <Ink lines={AD_SOLD} seed="as" />
    <Spot size={AD_S} boxes={AD_BLOCK} at={S_FEW} id="few" dark={0.5} />
  </DocShot>
);

/** The Bureau bill, vetoed. */
const Veto1: React.FC = () => (
  <>
    <DocShot src={VETO1} size={VETO1_S} tag={SRC.veto1} focusAt={S_VETO1}
      keys={[[S_VETO1, {x: 880, y: 860, z: 0.62}], [t.at('Congress voted'), {x: 900, y: 960, z: 0.9}], [S_CRA, {x: 900, y: 980, z: 0.95}]]}
      over={<>
        <Slip text="1865 law: the war + one year" x={130} y={140} rot={-2} at={t.at('temporary')} size={54} />
        <Slip text="Feb. 1866" x={1460} y={150} rot={2} at={t.at('early 1866')} />
        <Stamp text="VETOED" x={560} y={640} size={150} color={CORAL} rot={-8} at={t.at('Johnson vetoed it')} />
      </>}>
      <Swipe lines={V1_ACT} from={t.at('Congress voted')} to={t.end('keep it going')} seed="v1" />
    </DocShot>
    <Stamps at={[t.at('Johnson vetoed it')]} />
  </>
);

/** The Civil Rights Act: its title on the President's message returning it. */
const CRA: React.FC = () => (
  <>
    <DocShot src={VETO2} size={VETO2_S} tag={SRC.veto2} carryFrom={S_CRA} carryTo={S_RIGHTS}
      keys={[[S_CRA, {x: 1000, y: 900, z: 0.8}], [S_RIGHTS, {x: 1060, y: 960, z: 0.92}]]}
      over={<>
        <Highlight text="CIVIL RIGHTS ACT OF 1866" x={110} y={106} size={72} at={t.at('Civil Rights Act')} seed={73} rot={-2} />
        <Definition term="Civil Rights Act of 1866" def="a federal law: anyone born here is a citizen, with equal rights" at={t.at('Civil Rights Act') + 10} x={120} y={840} />
      </>}>
      <Swipe lines={V2_TITLE} from={t.at('Civil Rights Act')} to={t.end('of 1866')} seed="v2" />
    </DocShot>
    <Stamps at={[t.at('Civil Rights Act')]} />
  </>
);

/** Born here = a citizen, read on the page; then the three rights as three slips. */
const Rights: React.FC = () => {
  const L: SheetCam = {x: 860, y: 1840, z: 0.98, tilt: 30, dof: 2.4, band: 80};
  return (
    <DocShot src={VETO2} size={VETO2_S} tag={SRC.veto2} carryFrom={S_RIGHTS} carryTo={S_VETO2}
      keys={[[S_RIGHTS, {...L, x: 760}], [t.at('citizens with'), {...L, x: 980, dofY: 1840}], [S_VETO2, {...L, x: 1060, z: 1.04}]]}
      over={<>
        <Slip text="sign contracts" x={1180} y={140} rot={-3} at={t.at('sign contracts')} />
        <Slip text="own property" x={1250} y={260} rot={2} at={t.at('own property')} />
        <Slip text="go to court" x={1200} y={380} rot={-2} at={t.at('go to court')} />
      </>}>
      <Swipe lines={V2_BORN} from={t.at('people born')} to={t.end('were citizens')} seed="v3" />
    </DocShot>
  );
};

/** Vetoed too. */
const Veto2: React.FC = () => (
  <>
    <DocShot src={VETO2} size={VETO2_S} tag={SRC.veto2} keys={[[S_VETO2, {x: 960, y: 800, z: 0.62}], [S_GALL, {x: 960, y: 780, z: 0.66}]]}
      over={<Stamp text="VETOED" x={600} y={520} size={150} color={CORAL} rot={-6} at={t.at('vetoed that too')} />}>
      <Ink lines={V2_TITLE} seed="v2" />
    </DocShot>
    <Stamps at={[t.at('vetoed that too')]} />
  </>
);

/** Something Congress had never done to a major law: the crowds outside the House galleries. */
const Galleries: React.FC = () => (
  <DocShot src={GALL} size={GALL_S} tag={SRC.gall} filter={PRINT_F} carryFrom={S_GALL} carryTo={S_OVR}
    keys={[[S_GALL, {x: 1160, y: 820, z: 0.98}], [S_OVR, {x: 760, y: 820, z: 1.12}]]}
    over={<Slip text="April 1866" x={1460} y={140} rot={2} at={t.at('It overrode')} />} />
);

/** Override: two-thirds of each house. A drawn bar per house crossing the two-thirds line. */
const Override: React.FC = () => {
  const g = useGFrame();
  const rows = [{name: 'HOUSE', yes: 122, no: 41, at: t.at('two-thirds of the House'), y: 400}, {name: 'SENATE', yes: 33, no: 15, at: t.at('two-thirds of the Senate'), y: 610}];
  const X = 380, W = 1160, H = 96, TWO = X + W * (2 / 3);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="OVERRIDE" x={110} y={106} size={84} at={t.at('override')} seed={75} rot={-2} />
      <Definition term="override" def="Congress passes a law the President vetoed" at={t.at('override') + 9} x={120} y={840} />
      {rows.map((r) => {
        const show = g >= S_OVR + 2;
        const p = interpolate(g, [r.at, r.at + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const frac = r.yes / (r.yes + r.no);
        return show && (
          <React.Fragment key={r.name}>
            <div style={{position: 'absolute', left: X, top: r.y - 48, fontFamily: JF.mono, fontSize: 32, letterSpacing: 2, color: '#f4efe6'}}>{r.name}</div>
            <div style={{position: 'absolute', left: X, top: r.y, width: W, height: H, background: 'rgba(237,231,220,0.16)', border: '3px solid rgba(237,231,220,0.5)', boxSizing: 'border-box'}} />
            <div style={{position: 'absolute', left: X, top: r.y, width: W * frac * p, height: H, background: CORAL}} />
            {p >= 1 && <div style={{position: 'absolute', left: X + 22, top: r.y + 18, fontFamily: JF.display, fontSize: 52, lineHeight: 1, color: '#111'}}>{r.yes} yes</div>}
            {p >= 1 && <div style={{position: 'absolute', left: X + W * frac + 22, top: r.y + 26, fontFamily: JF.mono, fontSize: 32, color: '#f4efe6'}}>{r.no} no</div>}
          </React.Fragment>
        );
      })}
      {g >= S_OVR + 2 && <>
        <div style={{position: 'absolute', left: TWO - 2, top: 330, height: 420, borderLeft: `5px dashed ${TEAL}`}} />
        <div style={{position: 'absolute', left: TWO - 40, top: 760, width: 80, textAlign: 'center', fontFamily: JF.display, fontSize: 56, color: TEAL}}>⅔</div>
      </>}
      <Slip text="law, without his signature" x={1010} y={150} rot={2} at={t.at('becomes law')} coral size={56} />
      {rows.map((r) => <Sfx key={r.name} at={r.at} src="sfx/tick.wav" volume={0.4} />)}
      <Stamps at={[t.at('override')]} />
      <Tag text={SRC.votes} />
    </AbsoluteFill>
  );
};

/** Music (MUSIC.md): g_world_outside under the whole chapter; it lifts after the last word and fades with the board. */
const Body: React.FC = () => {
  const scene = useScene([
    [0, <Bureau key="bu" />],
    [S_HOWARD, <Howard key="ho" />],
    [S_FOOD, <Food key="fo" />],
    [S_MARRY, <Marry key="ma" />],
    [S_SCHOOL, <School key="sc" />],
    [S_FAMILY, <Family key="fa" />],
    [S_ADS, <Ads key="ads" />],
    [S_AD, <AdRead key="ad" />],
    [S_FEW, <Few key="few" />],
    [S_VETO1, <Veto1 key="v1" />],
    [S_CRA, <CRA key="cra" />],
    [S_RIGHTS, <Rights key="ri" />],
    [S_VETO2, <Veto2 key="v2" />],
    [S_GALL, <Galleries key="ga" />],
    [S_OVR, <Override key="ov" />],
    [S_BOARD, <EpBoard key="b" ch={7} from={S_BOARD} at={t.at('so did a new')} />],
  ]);
  return <>{scene}<Cuts /></>;
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_the_bureau.wav" lead={LEAD} music={[{src: 'music/g_world_outside.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
