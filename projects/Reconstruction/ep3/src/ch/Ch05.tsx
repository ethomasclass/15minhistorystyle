// Chapter 5 · Tired. Up North, the Panic of 1873 (Jay Cooke's office, the Stock Exchange shut, a run on a bank); the one
// dry aside (the Colfax print shrinks to a tiny card beside "your paycheck"); the scandals (Grant, honest himself; Nast's
// "Probe Away!" for the Whiskey Ring; Babcock, charged and acquitted); the reformers' list, Black rights sliding down it;
// the 1874 campaign (Nast, Nov. 1874) and the Democrats' House; the Civil Rights Act of 1875 read on the statute page, and
// the Supreme Court's 1883 syllabus striking it down; the board, the subscribe line over it, then "Tenting on the Old
// Camp Ground" (1904) after the last word.
// Sources: Library of Congress (Leslie's and Wall Street engravings, Nast, Babcock, Grant, the Sachse print, U.S. Reports);
// Harper's Weekly via DPLA/Commons ("Probe Away!"); Statutes at Large vol. 18 (Internet Archive).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch05_tired.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {SeriesBoard} from '../kit/ep3board';
import {Highlight, Tag} from '../kit/Kit';
import {type Box, cut, DocShot, PRINT_F, type SheetCam, Slip, Swipe} from '../kit/rc';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {Between, Stamps, Whooshes} from './ch04_kit';
import {FarAway, Priorities} from './ch05_drawn';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
/** Room after the last word for the period record (4-6 s with the fade). */
const EXTRA = 84;
export const CH05_FRAMES = chapterFrames(N, LEAD) + EXTRA;

// ------------------------------------------------------------------------------------------------------ pictures
const I = 'img/ch05/';
const COOKE = I + 'panic_1873_jay_cooke_office_wall_street.jpg';
const EXCH = I + 'panic_1873_closing_stock_exchange_leslies.jpg';
const RUN = I + 'panic_1873_run_on_fourth_national_bank.jpg';
const PROBE = I + 'nast_probe_away_whiskey_ring_harpers_1876.jpg';
const THIRD = I + 'nast_third_term_panic_harpers_1874.jpg';
const SHACKLE = I + 'shackle_broken_genius_of_freedom_elliott_civil_rights_1874.jpg';
const ACT = I + 'civil_rights_act_1875_statutes_at_large_p336_inns_theaters.jpg';
const CASES = I + 'civil_rights_cases_109us3_first_page_1883.jpg';
// line boxes (source px), measured from the ink and drawn on the page
const INNS: Box[] = [[698, 670, 796, 36]];             // p.336 "inns, public conveyances on land or water, theaters,"
const CRA: Box[] = [[626, 1876, 266, 42]];             // 109 U.S. 3 "Civil Rights Act"
const UNCONST: Box[] = [[166, 1914, 316, 44]];         // "are unconstitutional"
const DECIDED: Box[] = [[700, 1706, 355, 36]];         // "Decided October 15th, 1883."

const SRC = {
  cooke: "Scenes in Wall Street during the panic: Jay Cooke & Company's office, 1873 · Library of Congress",
  exch: "The Great Financial Panic of 1873: closing the Stock Exchange, Sept. 20, Frank Leslie's · Library of Congress",
  run: "The Panic: run on the Fourth National Bank, New York, Frank Leslie's, Oct. 4, 1873 · Library of Congress",
  grant: 'President Ulysses S. Grant, 1869 · Library of Congress',
  probe: 'Thomas Nast, "Probe Away!", Harper\'s Weekly, Mar. 18, 1876 · DPLA / Wikimedia Commons',
  babcock: 'Orville Babcock, c.1865 (charged 1875, acquitted) · Library of Congress',
  third: 'Thomas Nast, "The Third-Term Panic," Harper\'s Weekly, Nov. 7, 1874 (the 1874 campaign) · Library of Congress',
  shackle: '"The Shackle Broken, by the Genius of Freedom," E. Sachse & Co., 1874 · Library of Congress',
  act: 'Civil Rights Act, Mar. 1, 1875, Statutes at Large vol. 18, p. 336 · Internet Archive',
  cases: 'Civil Rights Cases, 109 U.S. 3 (1883) · Library of Congress',
};

/** A picture on the desk, `h` px tall, centred at screen x `sx`; the camera pushes in a little from a to b. */
const placed = (size: [number, number], h: number, sx: number, a: number, b: number, push = 0.05, sy = 540): [number, SheetCam][] => {
  const z = h / size[1];
  const cam = (k: number): SheetCam => ({x: size[0] / 2 - (sx - 960) / (z * k), y: size[1] / 2 - (sy - 540) / (z * k), z: z * k});
  return [[a, cam(1)], [b, cam(1 + push)]];
};

// ------------------------------------------------------------------------------------------------------ the cuts
const S_EXCH = c("It's called"), S_RUN = c('Businesses'), S_FAR = c("When you're"), S_GRANT = c('Then there were'), S_PROBE = c('The worst');
const S_BAB = c('One of the men'), S_LIST = c('Reformers'), S_1874 = c('In 1874'), S_LAW = c('Republicans managed'), S_ACT = c('the Civil Rights');
const S_CASES = c('The Supreme Court'), B = c('More and more');
/** The pieces land on "tired of solving"; the end shot sits right of Ames's card so nothing is sliced (boardfit). */
const TIRED = t.at('tired of solving');
const SONG = t.end('involved') + 6;

// ------------------------------------------------------------------------------------------------------ shots
const Cooke: React.FC = () => (
  <DocShot src={COOKE} size={[1089, 1536]} tag={SRC.cooke} filter={PRINT_F} keys={placed([1089, 1536], 920, 1270, 0, S_EXCH)}
    over={<>
      <Slip text="meanwhile, up North" x={140} y={150} rot={-2} at={t.at('Meanwhile')} />
      <Slip text="Jay Cooke & Co., Sept. 1873" x={150} y={420} rot={1.5} size={58} at={t.at('biggest banks')} />
      <Slip text="collapsed" x={170} y={540} rot={-2} size={66} at={t.at('collapsed')} coral />
      <Slip text="and took the economy with it" x={160} y={680} rot={1} size={54} at={t.at('took the economy')} />
    </>} />
);

const Exchange: React.FC = () => {
  const p = t.at('Panic of 1873');
  return (
    <DocShot src={EXCH} size={[1150, 1536]} tag={SRC.exch} filter={PRINT_F} focusAt={S_EXCH} keys={placed([1150, 1536], 920, 1280, S_EXCH, S_RUN)}
      over={<>
        <Highlight text="PANIC OF 1873" x={110} y={100} size={84} at={p} seed={51} rot={-2} />
        <Definition term="Panic of 1873" def="a financial crash, then a depression that lasted for years" at={p + 9} x={120} y={250} w={640} />
        <Slip text="a depression: 1873 to about 1879" x={140} y={560} rot={-1.5} size={52} at={t.at('lasted for years')} />
        <Stamps at={[p]} />
      </>} />
  );
};

const Run: React.FC = () => (
  <DocShot src={RUN} size={[1185, 1536]} tag={SRC.run} filter={PRINT_F} focusAt={S_RUN} keys={placed([1185, 1536], 920, 1280, S_RUN, S_FAR)}
    over={<>
      <Slip text="businesses failed" x={150} y={300} rot={-2} at={t.at('Businesses')} />
      <Slip text="workers lost their jobs" x={170} y={440} rot={1.5} at={t.at('Workers')} />
    </>} />
);

/** Grant, honest himself; the people around him. */
const Grant: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src="img/ch03/grant_president_portrait_1869.jpg" size={[1028, 1280]} x={1060} y={110} w={690} h={860} fx={514} fy={632} scale={0.68} rot={1.5} at={S_GRANT}
      mask={MASKS.grant1869} tintStrength={0.6} traceAt={t.at('Grant')} />
    <Slip text="the scandals" x={150} y={180} rot={-2} at={t.at('scandals')} />
    <Slip text="Grant: honest himself" x={160} y={360} rot={1.5} size={60} at={t.at('Grant')} coral />
    <Slip text="the people around him: no" x={150} y={520} rot={-1.5} size={56} at={t.at('but people')} />
    <Sfx at={S_GRANT} src="sfx/tick.wav" volume={0.35} />
    <Tag text={SRC.grant} />
  </AbsoluteFill>
);

const Probe: React.FC = () => {
  const w = t.at('Whiskey Ring');
  return (
    <DocShot src={PROBE} size={[1590, 1660]} tag={SRC.probe} filter={PRINT_F} focusAt={S_PROBE} keys={placed([1590, 1660], 930, 1300, S_PROBE, S_BAB)}
      over={<>
        <Highlight text="WHISKEY RING" x={110} y={100} size={84} at={w} seed={52} rot={-2} />
        <Definition term="Whiskey Ring" def="tax officials let whiskey makers skip their taxes, in exchange for a cut" at={w + 9} x={120} y={250} w={640} />
        <Slip text="Nast, 1876: “probe away!”" x={140} y={700} rot={-1.5} size={54} at={t.at('in exchange')} />
        <Stamps at={[w]} />
      </>} />
  );
};

const Babcock: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={I + 'babcock_orville_portrait.jpg'} size={[1027, 1536]} x={1130} y={110} w={600} h={860} fx={500} fy={760} scale={0.6} rot={-1.5} at={S_BAB}
      mask={MASKS.babcock} tintStrength={0.6} traceAt={t.at('private secretary') - 4} />
    <Slip text="one of the men charged:" x={150} y={200} rot={-2} size={58} at={t.at('One of the men')} />
    <Slip text="the President's own private secretary" x={160} y={340} rot={1} size={50} at={t.at("President's")} />
    <Slip text="Orville Babcock" x={180} y={480} rot={-2} size={64} at={t.at('private secretary')} coral />
    <Slip text="charged 1875 · acquitted" x={190} y={620} rot={1.5} size={52} at={t.at('secretary') + 8} />
    <Sfx at={S_BAB} src="sfx/tick.wav" volume={0.35} />
    <Tag text={SRC.babcock} />
  </AbsoluteFill>
);

const Third: React.FC = () => (
  <DocShot src={THIRD} size={[3000, 2260]} tag={SRC.third} filter={PRINT_F} focusAt={S_1874}
    keys={[[S_1874, {x: 1560, y: 1130, z: 0.6}], [S_LAW, {x: 1600, y: 1120, z: 0.64}]]}
    over={<>
      <Slip text="the 1874 campaign" x={1300} y={130} rot={2} at={t.at('In 1874')} />
      <Slip text="Democrats win the House" x={1080} y={780} rot={-2} size={62} at={t.at('Democrats')} coral />
      <Slip text="first time since before the war" x={1050} y={900} rot={1} size={54} at={t.at('first time')} />
    </>} />
);

const Shackle: React.FC = () => (
  <DocShot src={SHACKLE} size={[3000, 2520]} tag={SRC.shackle} filter={PRINT_F} focusAt={S_LAW} keys={placed([3000, 2520], 960, 860, S_LAW, S_ACT, 0.04)}
    over={<Slip text="one last law" x={1460} y={460} rot={2} size={64} at={t.at('one last law')} />} />
);

/** The Act itself: title card, then the camera reads section 1's list. */
const Act: React.FC = () => {
  const a = t.at('Civil Rights Act');
  const R = {tilt: 24, dof: 2.0, band: 60};
  return (
    <DocShot src={ACT} size={[1934, 3000]} tag={SRC.act} focusAt={S_ACT}
      keys={[[S_ACT, {x: 1160, y: 640, z: 0.95}], [t.at('It banned'), {x: 1150, y: 660, z: 1.0}], [t.at('hotels') - 6, {...R, x: 980, y: 688, dofY: 688, z: 1.28}],
        [t.end('trains'), {...R, x: 1260, y: 688, dofY: 688, z: 1.32}], [S_CASES, {...R, x: 1280, y: 690, dofY: 690, z: 1.34}]]}
      over={<>
        <Between b={t.at('hotels') - 6}>
          <Highlight text="CIVIL RIGHTS ACT OF 1875" x={110} y={100} size={76} at={a} seed={53} rot={-2} />
          <Definition term="Civil Rights Act of 1875" def="a federal law that banned discrimination in hotels, theaters and trains" at={a + 9} x={120} y={830} w={1100} />
        </Between>
        <Slip text="almost nobody enforced it" x={300} y={820} rot={-1.5} size={64} at={t.at('Almost nobody')} />
        <Stamps at={[a]} />
      </>}>
      <Swipe lines={INNS} from={t.at('hotels')} to={t.end('trains')} seed="inn" />
    </DocShot>
  );
};

const Cases: React.FC = () => (
  <DocShot src={CASES} size={[1796, 2704]} tag={SRC.cases} focusAt={S_CASES}
    keys={[[S_CASES, {x: 740, y: 1820, z: 0.92}], [t.at('struck'), {x: 720, y: 1860, z: 1.0}], [B, {x: 730, y: 1850, z: 1.04}]]}
    over={<Slip text="struck down, 1883" x={1220} y={820} rot={2} size={60} at={t.at('eight years')} />}>
    <Swipe lines={CRA} from={S_CASES + 4} to={t.end('Supreme Court')} seed="cra" />
    <Swipe lines={UNCONST} from={t.at('struck')} to={t.end('struck it down')} seed="unc" />
    <Swipe lines={DECIDED} from={t.at('eight years')} to={t.end('later')} seed="dec" />
  </DocShot>
);

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Cooke key="ck" />],
    [S_EXCH, <Exchange key="ex" />],
    [S_RUN, <Run key="rn" />],
    [S_FAR, <FarAway key="far" c={{a: S_FAR, paycheck: t.at('paycheck'), shrink: t.at('a fight'), shrinkEnd: t.at('far away') + 4, louisiana: t.at('far away') + 6, far: t.at('very far')}} />],
    [S_GRANT, <Grant key="gr" />],
    [S_PROBE, <Probe key="pr" />],
    [S_BAB, <Babcock key="bb" />],
    [S_LIST, <Priorities key="ls" c={{a: S_LIST, slavery: t.at('once fought'), gov: t.at('cleaning up'), econ: t.at('Black rights'), slid: t.at('slid')}} />],
    [S_1874, <Third key="3t" />],
    [S_LAW, <Shackle key="sh" />],
    [S_ACT, <Act key="act" />],
    [S_CASES, <Cases key="cs" />],
    [B, <SeriesBoard key="b" ch={5} from={B} at={TIRED} cam={[[B, 2850, 310, 1.5], [TIRED + 50, 3000, 300, 1.6], [TIRED + 420, 3030, 305, 1.57]]} overlay={
      <Slip text="subscribe ↓" x={1300} y={880} rot={3} size={60} at={t.at('hit subscribe')} />
    } />],
  ]);
  return <>{scene}<Whooshes at={[S_EXCH, S_RUN, S_FAR, S_GRANT, S_PROBE, S_BAB, S_LIST, S_1874, S_LAW, S_ACT, S_CASES]} /></>;
};

/** Music (MUSIC.md): rc_parlor under the chapter (it ends on its own under the 1875 Act), again from its start under the
 *  board and the subscribe line, handing over to "Tenting on the Old Camp Ground" (1904; sung, so only after the last
 *  word). The record is already at about -16.5 LUFS like the other period records. */
export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_tired.wav" lead={LEAD} extra={EXTRA} music={[
    {src: 'music/rc_parlor.mp3', volume: 0.2, startFrom: 30},
    {src: 'music/rc_parlor.mp3', volume: 0.18, startFrom: 30, from: B, to: SONG + 10, fadeOut: 30},
    {src: 'music/period/tenting_on_the_old_camp_ground_1904.mp3', volume: 0.32, from: SONG},
  ]}>
    <Body />
  </ChapterShell>
);
