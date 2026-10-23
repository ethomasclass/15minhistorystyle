// Chapter 4 · Colfax (a heavy chapter: plain, no jokes, no coral punchline slips, longer holds, near-silence then j_grief).
// The disputed 1872 election and the town of Colfax on the 1874 map; Easter Sunday 1873 as a drawn plan of the courthouse
// (no picture of it survives, and the killing is told, not shown); how many died as a plain number line; Harper's
// engraving of the aftermath, wide and tagged with its date, never close on the bodies; the Supreme Court's reasoning
// read on the page (p.554, torn away to p.555); the state where the mob had won; the board, and silence.
// Sources: Asher & Adams, Louisiana and Mississippi, 1874 (MDAH); Harper's Weekly, May 10, 1873 (LOC); United States
// v. Cruikshank, 92 U.S. 542 (1876), U.S. Reports (LOC).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch04_colfax.words.json';
import {DarkPaper} from '../kit/common';
import {SeriesBoard} from '../kit/ep3board';
import {Highlight, Tag} from '../kit/Kit';
import {type Box, cut, DocShot, PRINT_F, type SheetCam, Slip, Swipe, Tear} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';
import {Between, MapPin, PageWin, Stamps, Whooshes} from './ch04_kit';
import {CourthousePlan, RangeBar} from './ch04_drawn';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
/** The board holds, still and silent, after the last line. */
const EXTRA = 60;
export const CH04_FRAMES = chapterFrames(N, LEAD) + EXTRA;

// ------------------------------------------------------------------------------------------------------ pictures
const I = 'img/ch04/';
const MAP = I + 'asher_adams_1874_grant_parish_colfax_crop.jpg';
const MAP_S: [number, number] = [1000, 800];
const MAP_F = 'grayscale(1) sepia(0.12) contrast(1.15) brightness(1.02)';
const COLFAX: [number, number] = [457, 565];
const ENG = I + 'louisiana_murders_gathering_the_dead_colfax_harpers_1873_crop.jpg';
const ENG_S: [number, number] = [1670, 1390];
const P542 = I + 'us_v_cruikshank_92us542_first_page_1876.jpg';
const P554 = I + 'us_v_cruikshank_92us554_equal_protection_states_only_1876.jpg';
const P555 = I + 'us_v_cruikshank_92us555_1876.jpg';
const PAGE: [number, number] = [1796, 2704];
// line boxes (source px), measured from the ink and drawn on the page
const TITLE: Box[] = [[430, 328, 792, 44]];                        // p.542 "UNITED STATES v. CRUIKSHANK ET AL."
const STATES: Box[] = [[738, 2058, 582, 52]];                      // p.554 "prohibits a State from denying"
const EQUAL: Box[] = [[852, 2110, 466, 52], [150, 2161, 98, 52]];  // "the equal protection of the / laws;"
const DOESNT: Box[] = [[268, 2161, 508, 52]];                      // "but this provision does not,"
const RIGHTS: Box[] = [[135, 272, 612, 46]];                       // p.555 "to the rights which one citizen has"
const AGAINST: Box[] = [[135, 322, 312, 52]];                      // "against another."

const SRC = {
  map: 'Asher & Adams, Louisiana and Mississippi, 1874: Grant Parish · Mississippi Dept. of Archives and History',
  eng: '"The Louisiana Murders: Gathering the Dead and Wounded," Harper\'s Weekly, May 10, 1873 · Library of Congress',
  p542: 'United States v. Cruikshank, 92 U.S. 542 (1876), p. 542 · Library of Congress',
  p554: 'United States v. Cruikshank, 92 U.S. 542 (1876), p. 554 · Library of Congress',
  p555: 'United States v. Cruikshank, 92 U.S. 542 (1876), p. 555 · Library of Congress',
};

// ------------------------------------------------------------------------------------------------------ the cuts
const S_PLAN = c('Easter'), S_RANGE = c('How many'), S_ENG = c("It's called"), S_CASE = c('The case'), S_READ = c('Its reasoning');
const S_STATE = c('That means'), B = c('Nobody was ever');
const TEAR = t.end('cover') + 2;
/** The board's pieces land on "punished"; its end shot sits below the night's strip and the string tags above it, so nothing is sliced
 *  (boardfit, text probe). */
const PUN = t.at('punished');

// ------------------------------------------------------------------------------------------------------ shots
/** 1872: both sides claimed Louisiana; the camera finds Colfax in Grant Parish. */
const Louisiana: React.FC = () => (
  <DocShot src={MAP} size={MAP_S} tag={SRC.map} filter={MAP_F}
    keys={[[0, {x: 500, y: 420, z: 1.12}], [t.at('And the next'), {x: 490, y: 440, z: 1.16}], [t.at('Colfax') + 4, {x: COLFAX[0], y: COLFAX[1], z: 1.75}], [S_PLAN, {x: COLFAX[0], y: COLFAX[1], z: 1.82}]]}
    over={<>
      <Slip text="Louisiana, 1872" x={150} y={130} rot={-2} at={t.at('In 1872')} />
      <Slip text="Republicans: we won" x={170} y={800} rot={-1.5} size={58} at={t.at('both sides')} out={t.at('And the next')} />
      <Slip text="Democrats: we won" x={1180} y={830} rot={2} size={58} at={t.at('claimed')} out={t.at('And the next')} />
      <Slip text="Colfax, Grant Parish" x={1030} y={600} rot={-2} size={58} at={t.at('Colfax') + 2} />
    </>}>
    <MapPin x={COLFAX[0]} y={COLFAX[1]} at={t.at('small town')} k={0.8} />
  </DocShot>
);

/** Easter Sunday, 1873: a drawn plan, slips stacking at the left. */
const Plan: React.FC = () => (
  <CourthousePlan c={{a: S_PLAN, guards: t.at('Black men'), militia: t.at('A white militia'), close: t.at('surrounded'), cannon: t.at('with a cannon'), dim: t.at('set on fire')}}>
    <Slip text="Easter Sunday, 1873" x={140} y={130} rot={-2} at={t.at('Easter')} />
    <Slip text="Black men, some Union veterans" x={150} y={260} rot={1} size={50} at={t.at('Black men')} />
    <Slip text="guarding the courthouse" x={160} y={370} rot={-1.5} size={50} at={t.at('guarding')} />
    <Slip text="a white militia, with a cannon" x={150} y={500} rot={1.5} size={50} at={t.at('A white militia')} />
    <Slip text="the courthouse set on fire" x={150} y={690} rot={-1} size={50} at={t.at('set on fire')} />
    <Slip text="men who surrendered were shot" x={160} y={800} rot={1} size={50} at={t.at('Men who')} />
  </CourthousePlan>
);

/** How many died: a number line, the numbers set plainly. */
const Range: React.FC = () => (
  <RangeBar c={{a: S_RANGE, least: t.at('At least'), more: t.at('Possibly')}}>
    <Slip text="how many died?" x={160} y={130} rot={-2} at={t.at('How many')} />
    <Slip text="we don't know exactly" x={200} y={250} rot={1.5} size={54} at={t.at("We don't know")} />
  </RangeBar>
);

/** Harper's engraving of the aftermath (May 10, 1873), wide and slow, never close on the bodies. */
const Engraving: React.FC = () => {
  const ca = t.at('Colfax Massacre');
  return (
    <DocShot src={ENG} size={ENG_S} tag={SRC.eng} filter={PRINT_F} focusAt={S_ENG}
      keys={[[S_ENG, {x: 285, y: 664, z: 0.6}], [S_CASE, {x: 292, y: 664, z: 0.625}]]}
      over={<>
        <Between b={t.at('Federal')}>
          <Highlight text="COLFAX MASSACRE" x={110} y={108} size={80} at={ca} seed={41} rot={-2} />
          <Definition term="Colfax Massacre" def="the mass killing of Black men at Colfax, Louisiana, on Easter Sunday, 1873" at={ca + 9} x={120} y={250} w={600} />
        </Between>
        <Slip text="federal charges" x={140} y={560} rot={-2} size={56} at={t.at('charged')} />
        <Slip text="under the Enforcement Acts" x={160} y={680} rot={1} size={52} at={t.at('Enforcement Acts')} />
        <Stamps at={[ca]} />
      </>} />
  );
};

/** The case goes to the Supreme Court; in 1876 the convictions are thrown out. */
const Case: React.FC = () => (
  <DocShot src={P542} size={PAGE} tag={SRC.p542} focusAt={S_CASE}
    keys={[[S_CASE, {x: 830, y: 620, z: 0.62}], [t.at('all the way'), {x: 830, y: 560, z: 0.78}], [S_READ, {x: 830, y: 600, z: 0.82}]]}
    over={<>
      <Slip text="the U.S. Supreme Court" x={1150} y={640} rot={2} size={56} at={t.at('Supreme Court')} />
      <Slip text="1876: the convictions, thrown out" x={420} y={800} rot={-1.5} size={56} at={t.at('threw')} />
    </>}>
    <Swipe lines={TITLE} from={t.at('The case') + 6} to={t.end('Supreme Court')} seed="ck" />
  </DocShot>
);

/** Its reasoning, read along p.554; the page tears away to p.555 for "against another". */
const L: SheetCam = {x: 0, y: 0, z: 1, tilt: 26, dof: 2.2, band: 70};
const Read: React.FC = () => (
  <Tear at={TEAR} seed="ck" top={
    <DocShot src={P554} size={PAGE} tag="" focusAt={S_READ} over={<Between b={TEAR}><Tag text={SRC.p554} /></Between>}
      keys={[
        [S_READ, {...L, x: 880, y: 2085, dofY: 2085, z: 0.92}],
        [t.at('stops'), {...L, x: 1000, y: 2085, dofY: 2085, z: 1.0}],
        [t.at('people equal'), {...L, x: 1030, y: 2120, dofY: 2125, z: 1.02}],
        [t.at("It doesn't"), {...L, x: 620, y: 2180, dofY: 2186, z: 1.04}],
        [TEAR, {...L, x: 580, y: 2186, dofY: 2186, z: 1.05}],
      ]}>
      <Swipe lines={STATES} from={t.at('stops')} to={t.end('denying')} seed="s1" />
      <Swipe lines={EQUAL} from={t.at('people equal')} to={t.end('protection')} seed="s2" />
      <Swipe lines={DOESNT} from={t.at("It doesn't")} to={t.end('cover')} seed="s3" />
    </DocShot>
  }>
    <DocShot src={P555} size={PAGE} tag={SRC.p555}
      keys={[[TEAR, {...L, x: 700, y: 290, dofY: 296, z: 1.0}], [t.at('attacking'), {...L, x: 560, y: 320, dofY: 330, z: 1.02}], [S_STATE, {...L, x: 520, y: 340, dofY: 345, z: 1.05}]]}
      over={<Slip text="private citizens: not covered" x={1080} y={800} rot={-1.5} size={56} at={t.at('other private')} />}>
      <Swipe lines={RIGHTS} from={t.at('private citizens')} to={t.end('attacking')} seed="s4" />
      <Swipe lines={AGAINST} from={t.at('other private')} to={t.end('other private citizens')} seed="s5" />
    </DocShot>
  </Tear>
);

/** Up to Louisiana: the same state where the mob had won. */
const SameState: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <PageWin src={MAP} cx={470} cy={520} s={0.78} w={640} h={520} x={150} y={250} r={-2} at={S_STATE} filter={MAP_F}>
      <MapPin x={COLFAX[0]} y={COLFAX[1]} at={S_STATE} />
    </PageWin>
    <Slip text="up to Louisiana to punish the mob" x={860} y={380} rot={-1.5} size={56} at={t.at('up to the state')} />
    <Slip text="the same state where the mob had won" x={880} y={540} rot={1} size={56} at={t.at('The same state')} />
    <Tag text={SRC.map} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Louisiana key="la" />],
    [S_PLAN, <Plan key="pl" />],
    [S_RANGE, <Range key="rg" />],
    [S_ENG, <Engraving key="en" />],
    [S_CASE, <Case key="cs" />],
    [S_READ, <Read key="rd" />],
    [S_STATE, <SameState key="ss" />],
    [B, <SeriesBoard key="b" ch={4} from={B} at={PUN} cam={[[B, 2560, 1580, 1.6], [PUN + 64, 2750, 1705, 1.5], [PUN + 400, 2750, 1705, 1.5]]} />],
  ]);
  return <>{scene}<Whooshes at={[S_PLAN, S_RANGE, S_ENG, S_CASE, S_READ, S_STATE]} /></>;
};

/** Music (MUSIC.md): near-silence, then j_grief from the Supreme Court beat; it fades out under the last line, so the
 *  silence after "Nobody was ever punished for Colfax." is real, and the board holds still in it (EXTRA). */
export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_colfax.wav" lead={LEAD} extra={EXTRA}
    music={[{src: 'music/j_grief.mp3', volume: 0.12, from: S_CASE, to: t.end('Colfax', 3) + 4, fadeOut: 50}]}>
    <Body />
  </ChapterShell>
);
