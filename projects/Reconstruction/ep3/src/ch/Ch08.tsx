// Chapter 8 · Two Sets of Results. 1876: three Southern states still Republican (the drawn map); Hayes against Tilden
// (the Currier & Ives banners, then the portraits); South Carolina's two legislatures (Leslie's, wide: some caricature in
// the faces); the electoral count as a drawn tally (185 to win; 184, 165, and the 20 disputed in their own pile); "Tilden
// or Blood" (Nast); the commission, 8 to 7; the pile slides to Hayes, 185-184; no proof of a written deal (the
// Compromise of 1877); the troops leave the Louisiana State House; the map goes dark; the board.
// Sources: Currier & Ives (LOC); Brady studio (LOC); Leslie's (LOC); Harper's Weekly (LOC). "The Political Farce of
// 1876" (Democratic racial propaganda) is not used.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch08_1876.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Highlight, Tag} from '../kit/Kit';
import {SeriesBoard} from '../kit/ep3board';
import {type Box, cut, DocShot, FocusIn, PRINT_F, Slip, Swipe, TEAL, Win} from '../kit/rc';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {Ink, Stamps, Whooshes, wob} from './ch08_kit';
import {MAP_TAG, SouthMap, ucam} from './ch08_map';
import {Tally, type TallyCues} from './ch08_tally';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
export const CH08_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------------------------------------------ pictures
const I = 'img/ch08/';
const SRC = {
  banners: 'Grand National Republican and Democratic banners, Currier & Ives, 1876 · Library of Congress',
  portraits: 'Rutherford B. Hayes, Brady studio, c.1870-80 · Samuel J. Tilden, engraving, 1876 · Library of Congress',
  deadlock: "South Carolina: the dead-lock in the state legislature at Columbia, Frank Leslie's, Dec. 16, 1876 · Library of Congress",
  nast: "Thomas Nast, “A Truce—Not a Compromise,” Harper's Weekly, Feb. 17, 1877 · Library of Congress",
  commission: "The Electoral Commission in secret session, Feb. 16, 1877, Frank Leslie's, Mar. 10, 1877 · Library of Congress",
  troops: 'Louisiana: the federal troops leave the State House, New Orleans, April 24, 1877 (engraving, 1877) · Library of Congress',
};
const DEADLOCK = I + 'south_carolina_deadlock_state_legislature_columbia_leslies_1876.jpg';
const DEADLOCK_LINE: Box[] = [[985, 2764, 615, 32]];        // "THE DEAD-LOCK IN THE STATE LEGISLATURE AT COLUMBIA."
const TROOPS = I + 'louisiana_withdrawal_federal_troops_state_house_april_1877.jpg';
const T_WITHDRAW: Box[] = [[345, 1752, 965, 38]];          // "LOUISIANA.—THE WITHDRAWAL OF THE FEDERAL TROOPS FROM THE STATE HOUSE"
const T_DATE: Box[] = [[1310, 1752, 745, 38]];              // "IN NEW ORLEANS, AT NOON, ON APRIL 24TH."

// ------------------------------------------------------------------------------------------------------ the cuts
const S_BAN = c('And then came');
const S_POR = c('Republican Rutherford');
const S_SC = c('In those same');
const S_TAL = c('The winner needed');
const S_NAST = c('For months');
const S_COM = c('Congress created');
const S_TAL2 = c('and gave every');
const S_DEAL = c("There's no proof");
const S_TROOPS = c('In April 1877');
const S_END = c('Every Southern state');
const S_BOARD = c("And that's usually");

const TALLY: TallyCues = {need: t.at('needed'), tilden: t.at('Tilden had'), hayes: t.at('Tilden had') + 22, disputed: t.at('The disputed'),
  slide: t.at('every disputed'), slideEnd: t.end('to Hayes')};

// ------------------------------------------------------------------------------------------------------ shots
/** 1876: the South, and the three states still Republican. */
const Map1: React.FC = () => (
  <AbsoluteFill>
    <SouthMap keys={[ucam(0, 3500, 2960, 0.56), ucam(S_BAN, 3580, 2960, 0.63)]} ink={t.at('only three')} rise={[t.at('South Carolina'), t.at('Louisiana'), t.at('Florida')]} />
    <Slip text="1876" x={150} y={110} rot={-3} size={70} at={6} />
    <Slip text="still Republican: three states" x={1120} y={120} rot={2} size={58} at={t.at('Republican governments')} coral />
    <Slip text="the rest: back under Democrats" x={150} y={880} rot={-1.5} size={54} at={t.at('only three') + 8} />
    <Tag text={MAP_TAG} />
  </AbsoluteFill>
);

/** The election of 1876: the two campaign banners. */
const Banners: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <FocusIn at={S_BAN}>
      <Win src={I + 'grand_national_republican_banner_hayes_1876.jpg'} cx={1140} cy={1560} s={0.46} w={720} h={620} x={170} y={160} r={-1.5} />
      <Win src={I + 'grand_national_democratic_banner_tilden_1876.jpg'} cx={1150} cy={1600} s={0.46} w={720} h={620} x={1030} y={180} r={1.5} />
    </FocusIn>
    <Slip text="the presidential election of 1876" x={560} y={850} rot={-1.5} size={62} at={t.at('presidential election')} />
    <Sfx at={S_BAN} src="sfx/tick.wav" volume={0.35} />
    <Tag text={SRC.banners} />
  </AbsoluteFill>
);

/** Hayes (coral, traced) and Tilden (a plain print: the engraving has no mask). */
const Portraits: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={I + 'hayes_president_brady.jpg'} size={[2080, 3000]} x={300} y={130} w={480} h={600} fx={1000} fy={1430} scale={0.43} rot={-1.5}
      at={S_POR + 2} mask={MASKS.hayes} tintStrength={0.6} traceAt={t.at('Rutherford') + 4} />
    <CropCard src={I + 'tilden_portrait_1876.jpg'} size={[2322, 3000]} x={1140} y={130} w={480} h={600} fx={1100} fy={1200} scale={0.43} rot={1.5}
      at={t.at('Democrat') - 2} bw="grayscale(1) contrast(1.25) brightness(1.05)" />
    <Slip text="Rutherford B. Hayes · Republican" x={230} y={780} rot={-2} size={50} at={t.at('Rutherford')} coral />
    <Slip text="Samuel Tilden · Democrat" x={1120} y={780} rot={2} size={50} at={t.at('Samuel')} />
    <Slip text="won more votes" x={1210} y={880} rot={-1.5} size={56} at={t.at('won more')} />
    <Slip text="but not clearly enough" x={420} y={900} rot={1.5} size={56} at={t.at('But not')} />
    {[S_POR + 2, t.at('Democrat') - 2].map((f) => <Sfx key={f} at={f} src="sfx/tick.wav" volume={0.38} />)}
    <Tag text={SRC.portraits} />
  </AbsoluteFill>
);

/** Two sets of results: South Carolina's rival legislatures (framed wide: Leslie's caricatures some faces). */
const Deadlock: React.FC = () => (
  <DocShot src={DEADLOCK} size={[2413, 3000]} tag={SRC.deadlock} filter={PRINT_F} focusAt={S_SC}
    keys={[[S_SC, {x: 1206, y: 1500, z: 0.38}], [t.at('both parties'), {x: 1206, y: 2050, z: 0.5}], [t.at('Two sets'), {x: 1230, y: 2330, z: 0.6}], [S_TAL, {x: 1240, y: 2360, z: 0.62}]]}
    over={<>
      <Slip text="South Carolina, Dec. 1876" x={1260} y={130} rot={2} size={56} at={t.at('three states')} />
      <Slip text="both parties: “we won”" x={1300} y={250} rot={-2} size={56} at={t.at('both parties')} />
      <Slip text="each sent its own electoral votes" x={170} y={870} rot={-1.5} size={52} at={t.at('each sent')} />
      <Highlight text="TWO SETS OF RESULTS" x={110} y={106} size={84} at={t.at('Two sets')} seed={81} rot={-2} />
      <Slip text="one country" x={1380} y={880} rot={2} size={60} at={t.at('One country')} coral />
      <Stamps at={[t.at('Two sets')]} />
    </>}>
    <Swipe lines={DEADLOCK_LINE} from={t.at('claimed')} to={t.end('have won')} seed="dl" />
  </DocShot>
);

/** The count, drawn. */
const Count1: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Tally c={{...TALLY, slide: undefined, slideEnd: undefined}} />
    <Slip text="one short" x={1580} y={212} rot={4} size={46} at={t.at('184') + 4} />
    <Tag text="Drawn: the electoral votes, 1876 (369 in all)" />
  </AbsoluteFill>
);

/** For months, nobody knew: "Tilden or Blood". */
const Nast: React.FC = () => (
  <DocShot src={I + 'nast_a_truce_not_a_compromise_1877.jpg'} size={[3000, 2122]} tag={SRC.nast} filter={PRINT_F} focusAt={S_NAST}
    keys={[[S_NAST, {x: 1500, y: 1080, z: 0.56}], [S_COM, {x: 950, y: 1180, z: 0.74}]]}
    over={<>
      <Slip text="for months, nobody knew" x={130} y={120} rot={-2} size={60} at={t.at('nobody knew')} />
      <Slip text="“Tilden or Blood”: talk of war" x={1130} y={880} rot={1.5} size={54} at={t.at('next president') - 2} />
    </>} />
);

/** The Electoral Commission, by candlelight. */
const Commission: React.FC = () => (
  <DocShot src={I + 'electoral_commission_secret_session_candlelight_leslies_1877.jpg'} size={[1536, 942]} tag={SRC.commission} filter={PRINT_F} focusAt={S_COM}
    keys={[[S_COM, {x: 768, y: 450, z: 1.2}], [S_TAL2, {x: 760, y: 430, z: 1.3}]]}
    over={<>
      <Slip text="a commission of 15 men" x={130} y={120} rot={-2} size={58} at={t.at('15 men') - 2} />
      <Slip text="8 – 7, along party lines" x={1080} y={890} rot={1.5} size={60} at={t.at('party lines')} coral />
    </>} />
);

/** Every disputed vote to Hayes: 185 to 184. Congress could still have blocked it. */
const Count2: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Tally c={TALLY} from={S_TAL2} />
    <Slip text="one short" x={1580} y={212} rot={4} size={46} at={S_TAL2 - 400} />
    <Slip text="Democrats in Congress could still block it" x={150} y={870} rot={-1.5} size={50} at={t.at('Democrats could')} />
    <Slip text="they didn't" x={1180} y={880} rot={2} size={56} at={t.at("They didn't")} />
    <Slip text="why?" x={1560} y={870} rot={-3} size={60} at={t.at('Why')} coral />
    <Tag text="Drawn: the electoral votes, 1876 (369 in all)" />
  </AbsoluteFill>
);

/** No proof of a written deal: the understanding, as two slips on a dashed string. */
const Deal: React.FC = () => {
  const cmp = t.at('Compromise');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <Ink d={wob(430, 390, 440, 640, 'deal', 4)} at={t.at('and the federal')} dur={8} width={5} color={TEAL} dash="16 12" />
      </svg>
      <Slip text="no proof of a written deal" x={520} y={470} rot={-2} size={58} at={t.at("There's no proof")} />
      <Highlight text="COMPROMISE OF 1877" x={110} y={106} size={84} at={cmp} seed={82} rot={-2} />
      <Slip text="Hayes becomes president" x={200} y={300} rot={-2} size={60} at={t.at('Hayes becomes')} />
      <Slip text="the troops stop propping up" x={200} y={640} rot={1.5} size={58} at={t.at('stops propping')} />
      <Slip text="the last Republican governments" x={280} y={740} rot={-1} size={54} at={t.at('the last Republican')} coral />
      <Definition term="Compromise of 1877" def="the unwritten understanding that settled the election: Hayes became president, and federal troops stopped protecting the last Republican governments in the South"
        at={cmp + 9} x={120} y={850} w={1660} />
      <Stamps at={[cmp]} />
      <Sfx at={t.at('and the federal')} src="sfx/marker_tick.wav" volume={0.25} />
      <Tag text="" />
    </AbsoluteFill>
  );
};

/** April 1877: the troops leave the Louisiana State House. */
const Troops: React.FC = () => (
  <DocShot src={TROOPS} size={[3000, 2394]} tag={SRC.troops} filter={PRINT_F} focusAt={S_TROOPS}
    keys={[[S_TROOPS, {x: 1450, y: 1300, z: 0.6}], [t.at('South Carolina', 2), {x: 1430, y: 1330, z: 0.63}], [t.at('to leave') - 4, {x: 1420, y: 1340, z: 0.64}],
      [t.at('Soon after') + 10, {x: 1900, y: 1260, z: 0.86}], [S_END, {x: 1960, y: 1250, z: 0.9}]]}
    over={<>
      <Slip text="April 1877" x={140} y={110} rot={-3} size={64} at={t.at('April')} />
      <Slip text="South Carolina: April 10" x={1180} y={110} rot={2} size={54} at={t.at('South Carolina', 2)} />
      <Slip text="Louisiana: April 24" x={1220} y={220} rot={-1.5} size={54} at={t.at('Louisiana', 2)} />
      <Slip text="both Republican governments collapsed" x={420} y={870} rot={-1.5} size={58} at={t.at('collapsed')} coral />
    </>}>
    <Swipe lines={T_WITHDRAW} from={t.at('ordered')} to={t.end('statehouses')} seed="tw" />
    <Swipe lines={T_DATE} from={t.at('Louisiana', 2)} to={t.end('to leave')} seed="td" />
  </DocShot>
);

/** Every Southern state in the hands of the Redeemers: the three go dark. */
const Map2: React.FC = () => (
  <AbsoluteFill>
    <SouthMap keys={[ucam(S_END, 3580, 2960, 0.63), ucam(S_BOARD, 3540, 2970, 0.6)]} from={S_END} ink={0} rise={[0, 0, 0]} fall={t.at('was now')} />
    <Slip text="1877" x={150} y={110} rot={-3} size={70} at={S_END + 4} />
    <Slip text="all in the hands of the Redeemers" x={480} y={880} rot={-1.5} size={60} at={t.at('Redeemers')} coral />
    <Tag text={MAP_TAG} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Map1 key="m1" />],
    [S_BAN, <Banners key="bn" />],
    [S_POR, <Portraits key="pt" />],
    [S_SC, <Deadlock key="dl" />],
    [S_TAL, <Count1 key="t1" />],
    [S_NAST, <Nast key="ns" />],
    [S_COM, <Commission key="cm" />],
    [S_TAL2, <Count2 key="t2" />],
    [S_DEAL, <Deal key="dd" />],
    [S_TROOPS, <Troops key="tr" />],
    [S_END, <Map2 key="m2" />],
    [S_BOARD, <SeriesBoard key="b" ch={8} from={S_BOARD} at={t.at('Reconstruction was over')} />],
  ]);
  return <>{scene}<Whooshes at={[S_BAN, S_POR, S_SC, S_TAL, S_NAST, S_COM, S_TAL2, S_DEAL, S_TROOPS, S_END]} /></>;
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_1876.wav" lead={LEAD} music={[{src: 'music/j_intrigue.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
