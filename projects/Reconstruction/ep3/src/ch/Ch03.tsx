// Chapter 3 · Protection. The federal government hits back (Grant, 1869); the Enforcement Acts (the 1870 Act as printed in
// the Yorkville Enquirer) and the Ku Klux Klan Act (Statutes at Large, "by force, intimidation, or threat"); Grant's
// proclamation of Oct. 17, 1871, signed; the nine South Carolina counties circled on Asher & Adams's 1874 map in the
// proclamation's order; "suspend the privileges of the writ of habeas corpus" swiped as it's said; the arrests and the
// column of names in York County; the Columbia trials; the Klan largely broken (captured Klansmen, Mississippi, tagged so);
// a held beat; then the series board: the ✔ by PROTECTION, then the proclamation and "Klan broken".
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch03_protection.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Highlight, Loop, Tag} from '../kit/Kit';
import {SeriesBoard} from '../kit/ep3board';
import {type Box, camAt, cut, DOC_F, DocShot, FocusIn, PRINT_F, type SheetCam, Slip, Spot, Swipe} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {Between, Ink, PageWin, Stamps, Whooshes} from './ch02_kit';
import {Column} from './ch03_column';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
export const CH03_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------------------------------------------ pictures
const I = 'img/ch03/';
const GRANT = I + 'grant_president_portrait_1869.jpg';
const EA = I + 'yorkville_enquirer_1871-10-26_the_enforcement_act_text.jpg';
const EA_S: [number, number] = [645, 1880];
const KKA = I + 'ku_klux_klan_act_statutes_at_large_p13_1871.jpg';
const KKA_S: [number, number] = [1836, 3000];
const PRO = I + 'yorkville_enquirer_1871-10-26_proclamation_now_therefore_nine_counties_us_grant.jpg';
const PRO_S: [number, number] = [640, 1225];
const MAP = I + 'asher_adams_1874_south_carolina_counties_crop.jpg';
const MAP_S: [number, number] = [2050, 1670];
const TRIALS = I + 'ku_klux_trials_columbia_sc_proceedings_title_1872.jpg';
const CAPTURED = I + 'mississippi_ku_klux_captured_disguises_harpers_1872.jpg';
const NEWS_F = 'grayscale(1) sepia(0.12) contrast(1.35) brightness(1.06)';

const YE = 'Yorkville Enquirer (York County, S.C.), Oct. 26, 1871 · Library of Congress';
const SRC = {
  grant: 'President Ulysses S. Grant, 1869 · Library of Congress',
  ea: `“The Enforcement Act” (Act of May 31, 1870), as printed in the ${YE}`,
  kka: 'The Ku Klux Klan Act, April 20, 1871, Statutes at Large, vol. 17, p. 13 · Internet Archive',
  pro: `Grant's proclamation of Oct. 17, 1871, as printed in the ${YE}`,
  map: "Asher & Adams' North Carolina and South Carolina, 1874 · David Rumsey Map Collection via Wikimedia Commons",
  arr: `“Arrests of Citizens,” ${YE}`,
  trials: 'Proceedings in the Ku Klux Trials at Columbia, S.C., Nov. term 1871 (pub. 1872) · Internet Archive',
  captured: 'Captured Klansmen, Mississippi (not South Carolina), Harper\'s Weekly, Jan. 27, 1872 · Library of Congress',
};

// line boxes (source px), each drawn on its page and checked
const EA_RACE: Box[] = [[212, 450, 402, 30], [24, 481, 470, 30]];          // "without distinction of race, col- / or, or previous condition of servitude"
const KKA_TITLE: Box[] = [[256, 466, 1015, 32], [444, 496, 668, 28]];      // "CHAP. XXII.—An Act to enforce the Provisions of the Fourteenth Amendment …"
const KKA_FORCE: Box[] = [[764, 1284, 336, 30], [800, 1394, 300, 30]];     // §2 "by force, intimidation, or threat" (twice)
const PRO_SUSPEND: Box[] = [[25, 374, 594, 30], [28, 410, 80, 28]];        // "suspend the privileges of the writ of habeas / corpus"
const PRO_GRANT: Box[] = [[388, 1090, 202, 28]];                           // "U. S. GRANT."
const ARR_VIOL: Box[] = [[172, 780, 466, 28], [40, 819, 426, 28]];         // "for violations of the "Ku-Klux" / and "Enforcement" Acts of Congress."
const TRIALS_HEAD: Box[] = [[160, 570, 1610, 170]];                        // "KU KLUX TRIALS,"

/** The nine counties in the proclamation's order: the printed name on the map (centre, half-width), map px. */
const COUNTIES: [string, number, number, number][] = [
  ['Spartanburg', 583, 117, 130], ['York', 850, 96, 92], ['Marion', 1660, 583, 82], ['Chester', 895, 292, 112], ['Laurens', 571, 367, 112],
  ['Newberry', 675, 483, 100], ['Fairfield', 925, 430, 124], ['Lancaster', 1110, 288, 112], ['Chesterfield', 1333, 296, 126],
];

// ------------------------------------------------------------------------------------------------------ the cuts
const S_ACTS = c('Between');
const S_KKA = c('The biggest');
const S_SIGN = c('President Grant');
const S_MAP = c('he declared');
const S_HC = c('He suspended');
const S_ARR = c('Soldiers');
const S_TRIAL = c('Federal courts');
const S_BROKEN = c('And the Klan');
const S_HOLD = c('Hold onto');
const S_BOARD = c('On the card');

const ENF = t.at('Enforcement');
const HC = t.at('habeas');
const BROKEN = t.at('largely');
const CHECK = t.at('check');

// ------------------------------------------------------------------------------------------------------ shots
/** Then the federal government hit back: Grant. */
const Grant: React.FC = () => (
  <AbsoluteFill>
    <Photo src={GRANT} size={[1028, 1280]} fx={514} fy={400} z0={1.1} z1={1.16} a={0} b={S_ACTS} mask={MASKS.grant1869} traceAt={6} />
    <Slip text="the federal government" x={1250} y={150} rot={-2} size={54} at={t.at('federal')} />
    <Slip text="hits back" x={1380} y={265} rot={2} size={66} at={t.at('hit back')} coral />
    <Tag text={SRC.grant} />
  </AbsoluteFill>
);

/** The Enforcement Acts: the 1870 Act read down its column. */
const Acts: React.FC = () => {
  const L: SheetCam = {x: 322, y: 0, z: 1.15, tilt: 24, dof: 2, band: 70};
  return (
    <DocShot src={EA} size={EA_S} tag={SRC.ea} filter={NEWS_F} focusAt={S_ACTS}
      keys={[[S_ACTS, {x: 322, y: 300, z: 1.0}], [t.at('Congress') - 6, {...L, y: 420, dofY: 420, z: 1.1}], [t.end('Acts') + 4, {...L, y: 480, dofY: 480}], [S_KKA, {...L, y: 500, dofY: 490, z: 1.18}]]}
      over={<Slip text="1870 – 1871" x={1350} y={300} rot={2} size={64} at={t.at('1870')} />}>
      <Swipe lines={EA_RACE} from={t.at('Congress')} to={t.end('Enforcement Acts')} seed="ea" />
    </DocShot>
  );
};

/** The Ku Klux Klan Act: its title, then §2's "by force, intimidation, or threat". */
const KlanAct: React.FC = () => {
  const L: SheetCam = {x: 0, y: 0, z: 0.95, tilt: 26, dof: 2.2, band: 70};
  const made = t.at('They made');
  return (
    <DocShot src={KKA} size={KKA_S} tag={SRC.kka} filter={DOC_F} focusAt={S_KKA}
      keys={[[S_KKA, {x: 880, y: 660, z: 1.08}], [t.end('Ku Klux Klan Act'), {x: 860, y: 640, z: 1.12}], [made + 8, {...L, x: 900, y: 1300, dofY: 1290}],
        [t.end('voting'), {...L, x: 980, y: 1360, dofY: 1350}], [S_SIGN, {...L, x: 960, y: 1370, z: 0.99, dofY: 1360}]]}
      over={<>
        <Slip text="the Ku Klux Klan Act, 1871" x={1180} y={140} rot={2} size={54} at={t.at('Ku Klux Klan Act')} out={made} />
        <Slip text="a federal crime" x={1180} y={700} rot={-2} size={64} at={t.at('federal crime')} />
        <Slip text="the army can be used" x={1140} y={830} rot={1.5} size={64} at={t.at('army')} coral />
      </>}>
      <Swipe lines={KKA_TITLE} from={t.at('Ku Klux Klan Act')} to={t.end('Ku Klux Klan Act') + 6} seed="kt" />
      <Swipe lines={KKA_FORCE} from={t.at('use force')} to={t.end('voting')} seed="kf" />
    </DocShot>
  );
};

/** President Grant used it: his signature on the proclamation, Oct. 1871. */
const Signed: React.FC = () => (
  <DocShot src={PRO} size={PRO_S} tag={SRC.pro} filter={NEWS_F} focusAt={S_SIGN}
    keys={[[S_SIGN, {x: 400, y: 1010, z: 1.25}], [S_MAP, {x: 430, y: 1070, z: 1.4}]]}
    over={<>
      <Slip text="President Grant" x={1320} y={220} rot={2} size={64} at={S_SIGN + 4} />
      <Slip text="October 17, 1871" x={1330} y={360} rot={-2} size={60} at={t.at('October')} />
    </>}>
    <Swipe lines={PRO_GRANT} from={t.at('Grant')} to={t.end('used it')} seed="ug" />
  </DocShot>
);

/** Nine counties "in rebellion", circled one by one in the proclamation's order. */
const Counties: React.FC = () => {
  const n = t.at('nine');
  return (
    <DocShot src={MAP} size={MAP_S} tag={SRC.map} filter="grayscale(1) sepia(0.12) contrast(1.15) brightness(1.02)" focusAt={S_MAP}
      keys={[[S_MAP, {x: 1100, y: 350, z: 1.15}], [S_HC, {x: 1100, y: 340, z: 1.24}]]}
      over={<>
        <Slip text="South Carolina, 1871" x={150} y={150} rot={-2} size={54} at={S_MAP + 4} />
        <Slip text="nine counties" x={160} y={850} rot={-1.5} size={62} at={n + 4} coral />
        <Slip text="“in rebellion”" x={640} y={880} rot={2} size={62} at={t.at('rebellion')} />
      </>}>
      {COUNTIES.map(([name, x, y, rx], i) => <Loop key={name} cx={x} cy={y} rx={rx} ry={36} at={n + i * 8} dur={7} width={6} seed={i + 30} />)}
      {COUNTIES.map(([name], i) => <Sfx key={name} at={n + i * 8} src="sfx/tick_soft.wav" volume={0.28} />)}
    </DocShot>
  );
};

/** He suspended habeas corpus there: the proclamation's own words, swiped as they're said. */
const Habeas: React.FC = () => {
  // the page sits right of the title (cam x left of the page's centre)
  const L: SheetCam = {x: 110, y: 0, z: 1.5, tilt: 26, dof: 2, band: 60};
  return (
    <DocShot src={PRO} size={PRO_S} tag={SRC.pro} filter={NEWS_F} focusAt={S_HC}
      keys={[[S_HC, {...L, y: 385, dofY: 385}], [t.end('corpus') + 6, {...L, y: 410, dofY: 400, z: 1.55}], [t.at('Suspending'), {...L, y: 430, dofY: 420, z: 1.3, tilt: 18}],
        [S_ARR, {...L, y: 440, dofY: 430, z: 1.34, tilt: 18}]]}
      over={<>
        <Slip text="suspended:" x={200} y={470} rot={-2} size={58} at={t.at('Suspending')} />
        <Slip text="the army can arrest and hold" x={130} y={600} rot={1.5} size={54} at={t.at('meant')} dur={16} coral />
      </>}>
      <Swipe lines={PRO_SUSPEND} from={t.at('suspended')} to={t.end('habeas corpus')} seed="ps" />
      <Spot size={PRO_S} boxes={PRO_SUSPEND} at={t.at("That's the right")} id="hc" dark={0.5} />
    </DocShot>
  );
};

/** The arrests: the report, then the names of the men held, scrolling. */
const Arrests: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 470, y: 0, z: 1.15, tilt: 22, dof: 2, band: 110};
  const cam = camAt([
    [S_ARR, {...L, y: 330, dofY: 330, z: 1.1}], [t.at('arrested') - 6, {...L, y: 760, dofY: 790}], [t.at('Hundreds more') - 4, {...L, y: 980, dofY: 1000}],
    [t.at('confessed') + 6, {...L, y: 2400, dofY: 2400, z: 1.05}], [S_TRIAL, {...L, y: 3150, dofY: 3150, z: 1.02}],
  ], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S_ARR}>
        <Column cam={cam} filter={NEWS_F}>
          <Swipe lines={ARR_VIOL} from={t.at('arrested')} to={t.end('of men')} seed="av" />
        </Column>
      </FocusIn>
      <Slip text="York County, S.C." x={1290} y={150} rot={-2} size={52} at={S_ARR + 6} />
      <Slip text="hundreds arrested" x={1270} y={300} rot={2} size={62} at={t.at('hundreds')} />
      <Slip text="hundreds more confessed" x={1250} y={450} rot={-1.5} size={56} at={t.at('Hundreds more')} />
      <Sfx at={S_ARR} src="sfx/tick.wav" volume={0.35} />
      <Tag text={SRC.arr} />
    </AbsoluteFill>
  );
};

/** Federal courts held trials. */
const Trials: React.FC = () => (
  <DocShot src={TRIALS} size={[1843, 3000]} tag={SRC.trials} filter={DOC_F} focusAt={S_TRIAL}
    keys={[[S_TRIAL, {x: 920, y: 1150, z: 0.5}], [S_BROKEN, {x: 920, y: 1050, z: 0.56}]]}>
    <Swipe lines={TRIALS_HEAD} from={t.at('Federal courts')} to={t.end('trials')} seed="tr" />
  </DocShot>
);

/** Largely broken: captured Klansmen (Mississippi, so tagged and slipped). */
const Broken: React.FC = () => (
  <DocShot src={CAPTURED} size={[1411, 1536]} tag={SRC.captured} filter={PRINT_F} focusAt={S_BROKEN}
    keys={[[S_BROKEN, {x: 360, y: 760, z: 0.72}], [S_HOLD, {x: 380, y: 730, z: 0.78}]]}
    over={<Slip text="captured Klansmen, in Mississippi" x={120} y={700} rot={-2} size={50} at={S_BROKEN + 8} />} />
);

/** Hold onto that: with real force, it worked. */
const Hold: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <FocusIn at={S_HOLD}>
      <PageWin src={PRO} cx={320} cy={404} s={1.45} w={940} h={104} x={490} y={262} r={-1} filter={NEWS_F}>
        <Ink lines={PRO_SUSPEND} seed="hd" />
      </PageWin>
    </FocusIn>
    <Slip text="hold onto that" x={330} y={460} rot={-2} size={64} at={t.at('Hold onto')} />
    <Slip text="the government protected Black voters" x={360} y={600} rot={1.5} size={58} at={t.at('When the federal')} dur={16} />
    <Slip text="with real force, it worked" x={620} y={760} rot={-1.5} size={72} at={t.at('it worked')} coral />
    <Sfx at={S_HOLD} src="sfx/tick.wav" volume={0.35} />
    <Tag text={SRC.pro} />
  </AbsoluteFill>
);

/** Titles that span two shots (each at least 2 s on screen). */
const Titles: React.FC = () => (
  <>
    <Between a={ENF} b={t.at('They made')}>
      <Highlight text="ENFORCEMENT ACTS" x={110} y={106} size={84} at={ENF} seed={31} rot={-2} />
      <Definition term="Enforcement Acts" def="federal laws, 1870–71, that made using force to stop a voter a federal crime" at={ENF + 9} x={120} y={830} w={1640} />
    </Between>
    <Between a={HC} b={S_ARR}>
      <Highlight text="HABEAS CORPUS" x={110} y={106} size={88} at={HC} seed={32} rot={-2} />
      <Definition term="habeas corpus" def="the right not to be held in jail without being charged with a crime" at={HC + 9} x={120} y={830} w={1640} />
    </Between>
    <Between a={BROKEN} b={S_HOLD + 36}>
      <Highlight text="LARGELY BROKEN" x={110} y={106} size={84} at={BROKEN} seed={33} rot={-2} />
    </Between>
  </>
);

// The board: open on the ✔ by PROTECTION (the header and the check; framed so nothing is sliced: tools/boardfit.mjs), then
// down to the proclamation and "Klan broken".
const BOARD_CAM: [number, number, number, number][] = [
  [S_BOARD, 2430, 210, 2.0], [CHECK + 12, 2420, 200, 2.0], [CHECK + 46, 2823, 1196, 1.75], [CHECK + 300, 2823, 1198, 1.73],
];

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Grant key="gr" />],
    [S_ACTS, <Acts key="ea" />],
    [S_KKA, <KlanAct key="kk" />],
    [S_SIGN, <Signed key="sg" />],
    [S_MAP, <Counties key="mp" />],
    [S_HC, <Habeas key="hc" />],
    [S_ARR, <Arrests key="ar" />],
    [S_TRIAL, <Trials key="tr" />],
    [S_BROKEN, <Broken key="br" />],
    [S_HOLD, <Hold key="ho" />],
    [S_BOARD, <SeriesBoard key="b" ch={3} from={S_BOARD} at={CHECK} cam={BOARD_CAM} />],
  ]);
  return (
    <>
      {scene}
      <Titles />
      <Whooshes at={[S_ACTS, S_KKA, S_SIGN, S_MAP, S_HC, S_ARR, S_TRIAL, S_BROKEN, S_HOLD]} />
      <Stamps at={[ENF, HC, BROKEN]} />
    </>
  );
};

// w_dawn under the chapter; it swells (the same cue, crossfaded in phase to a higher level) under "largely broken".
const SWELL = S_BROKEN;
export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_protection.wav" lead={LEAD}
    music={[{src: 'music/w_dawn.mp3', volume: 0.14, to: SWELL + 24, fadeOut: 24}, {src: 'music/w_dawn.mp3', volume: 0.21, from: SWELL, startFrom: SWELL}]}>
    <Body />
  </ChapterShell>
);
