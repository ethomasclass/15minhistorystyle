// Chapter 9 · Voteless. After 1877 Black men kept voting for years (the First Vote, 1867, as a callback); what changed
// was who protected them (the troops leaving New Orleans, ch08). Over 25 years the states took the vote back, not by a
// law the 15th Amendment banned but through its gaps: the poll tax (Mississippi 1890, §243; a 1920 receipt), the
// literacy test (§244, the "understanding" clause), the grandfather clause (Louisiana 1898, §5) and who used it (white
// 37,877, Black 111). Louisiana's registered Black voters, 130,344 (1896) -> 1,342 (1904), as two bars on one scale.
// Jim Crow (later photographs, 1943 and 1939). The three words; then the board, where VOTELESS is written back in.
// Sources: Mississippi Constitution of 1890 and Louisiana Constitution of 1898 (Internet Archive); Report of the
// Louisiana Secretary of State, 1902 (Internet Archive); FSA/OWI (Library of Congress); Harper's Weekly (LOC); NARA.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch09_voteless.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Highlight, Tag, useGFrame} from '../kit/Kit';
import {SeriesBoard} from '../kit/ep3board';
import {type Box, Counter, cut, DocShot, FocusIn, Motif, PhotoShot, PRINT_F, type SheetCam, Slip, Spot, SRC as EDISTO_SRC, Swipe, TEAL, Win} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';
import {Between, Held, Stamps, Whooshes} from './ch08_kit';
import {RegBars, YearsLine} from './ch09_parts';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
const EXTRA = 60;   // the board's pull-back plays out after the last word
export const CH09_FRAMES = chapterFrames(N, LEAD) + EXTRA;

// ------------------------------------------------------------------------------------------------------ pictures
const I = 'img/ch09/';
const T15 = 'img/ep2/fifteenth_amendment_joint_resolution_1869_nara.jpg';
const T15S: [number, number] = [1920, 2690];
const T15F = 'grayscale(1) contrast(1.35) brightness(1.08)';
const T15_LINE: Box[] = [[190, 1398, 1430, 56]];            // "on account of race, color, or previous condition of servitude." (Ep 2's box)
const MS39 = I + 'mississippi_constitution_1890_article12_franchise_sec241.jpg';
const MS43 = I + 'mississippi_constitution_1890_sec243_poll_tax_sec244_reading_test.jpg';
const MS_S: [number, number] = [1546, 2496];
const POLL: Box[] = [[345, 2148, 680, 50]];                   // "A uniform poll tax of two dollars," (§243, foot of p. 39)
const READ: Box[] = [[1280, 885, 165, 44], [118, 930, 1010, 44]];   // "be able to / read any section of the constitution of this State;"
const UNDERSTAND: Box[] = [[118, 975, 1330, 42], [118, 1018, 435, 40]];   // "able to understand ... or give a reasonable / interpretation thereof."
const LA79 = I + 'louisiana_constitution_1898_p79_sec5_grandfather_clause.jpg';
const LA_S: [number, number] = [1878, 3000];
const LA_JAN: Box[] = [[1010, 605, 490, 48]];                  // "January 1st, 1867,"
const LA_SON: Box[] = [[460, 778, 685, 48]];                  // "no son or grandson of any such person"
const LA558 = I + 'louisiana_grandfather_clause_registrations_by_race_1902.jpg';
const TOTALS: Box[] = [[1105, 2452, 130, 44], [1385, 2452, 72, 44]];   // White 37,877 · Colored 111
const HEADS: Box[] = [[1148, 500, 120, 40], [1362, 500, 152, 40]];      // "White." "Colored."
const LA554 = I + 'louisiana_registered_voters_by_race_1896_1902report.jpg';
const COLORED_COL: Box[] = [[1110, 300, 185, 2420]];          // "Number of Colored Voters", by parish
// the three words on the motif strip (cr_three_words.png, 1000 x 122; measured on the image)
const M_LAND: Box = [112, 30, 230, 64];
const M_HOME: Box = [405, 30, 245, 64];
const M_VOTE: Box = [698, 28, 215, 66];

const SRC = {
  vote: '“The First Vote,” A. R. Waud, Harper\'s Weekly, Nov. 16, 1867 · Library of Congress',
  troops: 'Louisiana: the federal troops leave the State House, New Orleans, April 24, 1877 (engraving, 1877) · Library of Congress',
  t15: 'Joint resolution proposing the 15th Amendment, Feb. 1869 · National Archives',
  ms39: 'Constitution of the State of Mississippi, 1890, Art. 12, §243 · Internet Archive',
  receipt: 'Poll tax receipt, Jefferson County, Alabama, Oct. 22, 1920 (a later example) · Wikimedia Commons',
  ms43: 'Constitution of the State of Mississippi, 1890, Art. 12, §244 · Internet Archive',
  la79: 'Constitution of the State of Louisiana, 1898, Art. 197, §5 · Internet Archive',
  la558: 'Persons registered under §5, Report of the Louisiana Secretary of State, 1902, p. 558 · Internet Archive',
  la554: 'Registered voters, 1896, Report of the Louisiana Secretary of State, 1902, p. 554 · Internet Archive',
  bars: 'Drawn: figures from the Louisiana Secretary of State\'s reports (1896 and 1904)',
  bubley: 'Bus station sign, Esther Bubley, 1943 (a later photograph) · Library of Congress',
  lee: 'Streetcar terminal, Oklahoma City, Russell Lee, FSA, July 1939 (a later photograph) · Library of Congress',
};

// ------------------------------------------------------------------------------------------------------ the cuts
const S_PROT = c('What changed');
const S_YEARS = c('Over the next');
const S_15 = c('Not with a law');
const S_GAPS = c('They used');
const S_POLL = c('A poll tax');
const S_RCPT = c('more than many');
const S_LIT = c('A literacy test');
const S_GF = c('A grandfather clause');
const S_USED = c('Which in the South');
const S_1896 = c("Here's what");
const S_BARS = c('about 130000');
const S_SIGN = c('Along with it');
const S_LEE = c('water fountains');
const S_WORDS = c('So go back');
const S_BOARD = c('And Voteless');
const WRITTEN = t.at('Written');

const TINY: SheetCam = {x: 0, y: 0, z: 1, tilt: 24, dof: 2.2, band: 70};

// ------------------------------------------------------------------------------------------------------ shots
/** After 1877, Black men kept voting: the First Vote (1867) as a callback. */
const Kept: React.FC = () => (
  <PhotoShot src="img/wall/cr_firstvote.png" size={[900, 1113]} a={0} b={S_PROT} w={560} x={600} y={530} rot={-1.5} tag={SRC.vote}>
    <Slip text="after 1877: not everything lost" x={980} y={180} rot={-2} size={56} at={t.at("didn't lose")} />
    <Slip text="Black men kept voting" x={1020} y={330} rot={1.5} size={60} at={t.at('kept voting')} />
    <Slip text="some kept winning office" x={1000} y={470} rot={-1.5} size={60} at={t.at('kept winning')} coral />
  </PhotoShot>
);

/** What changed: the troops had gone. */
const Protect: React.FC = () => (
  <DocShot src="img/ch08/louisiana_withdrawal_federal_troops_state_house_april_1877.jpg" size={[3000, 2394]} tag={SRC.troops}
    filter="grayscale(1) contrast(1.3) brightness(0.8)" focusAt={S_PROT}
    keys={[[S_PROT, {x: 1900, y: 1260, z: 0.86}], [S_YEARS, {x: 2000, y: 1250, z: 0.92}]]}
    over={<>
      <Slip text="what changed: who protected them" x={140} y={120} rot={-2} size={60} at={t.at('protecting')} />
      <Slip text="now, nobody was" x={600} y={860} rot={1.5} size={72} at={t.at('nobody was')} coral />
    </>} />
);

/** Over the next 25 years. */
const Years: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <YearsLine at={S_YEARS} span={t.at('25 years')} marks={t.at('Southern states')} />
    <Slip text="the South took the vote back" x={560} y={850} rot={-1.5} size={64} at={t.at('took the vote')} coral />
    <Tag text="" />
  </AbsoluteFill>
);

/** Not with a law that said "no Black voters": the 15th Amendment didn't allow it. */
const Fifteenth: React.FC = () => {
  const L: SheetCam = {x: 0, y: 1426, z: 0.95, tilt: 30, dof: 2.4, band: 70};
  return (
    <DocShot src={T15} size={T15S} tag={SRC.t15} filter={T15F} focusAt={S_15}
      keys={[[S_15, {...L, x: 900, z: 0.82}], [t.at('The 15th'), {...L, x: 800, z: 0.9}], [S_GAPS, {...L, x: 1150, z: 0.98}]]}
      over={<>
        <Slip text="a law saying “no Black voters”?" x={140} y={130} rot={-2} size={60} at={t.at('a law')} />
        <Slip text="the 15th Amendment: not allowed" x={900} y={850} rot={1.5} size={60} at={t.at("didn't allow")} coral />
      </>}>
      <Swipe lines={T15_LINE} from={t.at('The 15th')} to={t.end('allow that')} seed="t15" />
    </DocShot>
  );
};

/** The gaps from the last episode: three things the 15th doesn't mention. */
const Gaps: React.FC = () => {
  const g = useGFrame();
  const at = t.at('gaps');
  const items: [string, number, number, number][] = [['a tax to vote', 160, 420, -3], ['a reading test', 820, 420, 2], ['an exemption if your grandfather could vote', 220, 640, -1]];
  const qx = [600, 1220, 1290];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S_GAPS}>
        <Win src={T15} cx={905} cy={1426} s={0.8} w={1340} h={120} x={290} y={140} r={-1} filter={T15F} />
      </FocusIn>
      <Slip text="the gaps (Part 2)" x={140} y={300} rot={-2} size={50} at={S_GAPS + 4} />
      {items.map(([text, x, y, r], i) => (
        <React.Fragment key={i}>
          <Slip text={text} x={x} y={y} rot={r} size={62} at={at + i * 5} />
          {g >= at + i * 5 + 8 && <div style={{position: 'absolute', left: qx[i], top: y - 30, fontFamily: '"Abril Fatface", serif', fontSize: 120, color: TEAL,
            transform: `rotate(${r * 3}deg)`, textShadow: '0 4px 14px rgba(0,0,0,0.8)'}}>?</div>}
        </React.Fragment>
      ))}
      {items.map((_, i) => <Sfx key={i} at={at + i * 5 + 8} src="sfx/tick.wav" volume={0.32} />)}
      <Tag text={SRC.t15} />
    </AbsoluteFill>
  );
};

const PollTitle: React.FC = () => {
  const pt = t.at('poll tax');
  return (
    <>
      <Highlight text="POLL TAX" x={110} y={106} size={88} at={pt} seed={91} rot={-2} />
      <Between b={S_RCPT + 40}><Definition term="poll tax" def="a fee you had to pay before you could vote" at={pt + 9} x={120} y={870} w={1500} /></Between>
      <Counter n={1} at={pt} label="GAP" />
    </>
  );
};

/** A poll tax: Mississippi, 1890, §243. */
const Poll: React.FC = () => (
  <DocShot src={MS39} size={MS_S} tag={SRC.ms39} focusAt={S_POLL}
    keys={[[S_POLL, {...TINY, x: 640, y: 2172, z: 0.92}], [t.end('poll tax'), {...TINY, x: 700, y: 2172, z: 1.0}], [S_RCPT, {...TINY, x: 760, y: 2172, z: 1.05}]]}
    over={<><PollTitle /><Stamps at={[t.at('poll tax')]} /></>}>
    <Swipe lines={POLL} from={t.at('poll tax')} to={t.end('to vote')} seed="pl" />
  </DocShot>
);

/** A real receipt (Alabama, 1920: later, but the same tax). */
const Receipt: React.FC = () => (
  <DocShot src={I + 'poll_tax_receipt_jefferson_county_alabama_1920.jpg'} size={[1920, 893]} tag={SRC.receipt} filter="grayscale(1) contrast(1.2) brightness(1.04)" focusAt={S_RCPT}
    keys={[[S_RCPT, {x: 960, y: 420, z: 0.8}], [S_LIT, {x: 900, y: 400, z: 0.86}]]}
    over={<>
      <PollTitle />
      <Slip text="Alabama, 1920: $1.50 a year" x={1100} y={190} rot={2} size={52} at={S_RCPT + 4} />
      <Slip text="more than many poor farmers could spare" x={260} y={720} rot={-1.5} size={56} at={t.at('poor farmers')} coral />
    </>} />
);

/** A literacy test: §244, read it, or "understand" it to the officials' satisfaction. */
const Literacy: React.FC = () => {
  const lt = t.at('literacy test');
  return (
    <DocShot src={MS43} size={MS_S} tag={SRC.ms43} focusAt={S_LIT}
      keys={[[S_LIT, {...TINY, x: 900, y: 920, z: 0.9}], [t.at('reading test'), {...TINY, x: 800, y: 935, z: 0.98}], [t.at('graded'), {...TINY, x: 780, y: 1000, z: 1.0}],
        [S_GF, {...TINY, x: 760, y: 1010, z: 1.04}]]}
      over={<>
        <Highlight text="LITERACY TEST" x={110} y={106} size={88} at={lt} seed={92} rot={-2} />
        <Definition term="literacy test" def="a reading test you had to pass before you could register to vote" at={lt + 9} x={120} y={870} w={1500} />
        <Counter n={2} at={lt} label="GAP" />
        <Slip text="graded by white officials" x={1080} y={250} rot={2} size={58} at={t.at('graded')} coral />
        <Slip text="they decided who passed" x={1120} y={720} rot={-1.5} size={56} at={t.at('decided')} />
        <Stamps at={[lt]} />
      </>}>
      <Swipe lines={READ} from={t.at('reading test')} to={t.end('reading test') + 6} seed="rd" />
      <Swipe lines={UNDERSTAND} from={t.at('graded')} to={t.end('officials')} seed="un" />
    </DocShot>
  );
};

/** A grandfather clause: Louisiana, 1898, §5. */
const Grandfather: React.FC = () => {
  const gc = t.at('grandfather clause');
  return (
    <DocShot src={LA79} size={LA_S} tag={SRC.la79} focusAt={S_GF}
      keys={[[S_GF, {...TINY, x: 940, y: 700, z: 0.8}], [t.at('his grandfather') - 6, {...TINY, x: 900, y: 790, z: 0.92}], [t.at('able to vote') - 2, {...TINY, x: 1100, y: 640, z: 0.95}],
        [S_USED, {...TINY, x: 1150, y: 640, z: 0.98}]]}
      over={<>
        <Highlight text="GRANDFATHER CLAUSE" x={110} y={106} size={84} at={gc} seed={93} rot={-2} />
        <Definition term="grandfather clause" def="an escape hatch: a man could skip the new rules if his father or grandfather could vote on Jan. 1, 1867" at={gc + 9} x={120} y={850} w={1640} />
        <Counter n={3} at={gc} label="GAP" />
        <Slip text="skip the tax and the test" x={1100} y={250} rot={2} size={56} at={t.at('skip those rules')} />
        <Slip text="Jan. 1, 1867: before Black men could vote there" x={460} y={720} rot={-1.5} size={52} at={t.at('able to vote')} coral />
        <Stamps at={[gc]} />
      </>}>
      <Swipe lines={LA_SON} from={t.at('his grandfather')} to={t.end('his grandfather') + 10} seed="sn" />
      <Swipe lines={LA_JAN} from={t.at('able to vote')} to={t.end('able to vote')} seed="jn" />
    </DocShot>
  );
};

/** Which, in the South, meant white men: who registered under §5 (the state's own totals). */
const Used: React.FC = () => {
  const wm = t.at('meant white');
  return (
    <DocShot src={LA558} size={LA_S} tag={SRC.la558} focusAt={S_USED}
      keys={[[S_USED, {x: 1000, y: 1300, z: 0.38}], [wm - 4, {x: 1260, y: 2380, z: 0.78}], [S_1896, {x: 1270, y: 2400, z: 0.82}]]}
      over={<>
        <Counter n={3} at={0} label="GAP" />
        <Slip text="who signed up under §5, 1898" x={140} y={120} rot={-2} size={56} at={S_USED + 6} />
        <Slip text="white: 37,877" x={260} y={820} rot={-1.5} size={64} at={wm} />
        <Slip text="Black: 111" x={1180} y={820} rot={2} size={64} at={t.at('white men')} coral />
      </>}>
      <Spot size={LA_S} boxes={[...TOTALS, ...HEADS]} at={wm - 4} id="tot" dark={0.55} />
      <Swipe lines={[TOTALS[1]]} from={t.at('white men')} to={t.end('white men')} seed="111" />
    </DocShot>
  );
};

/** Here's what it did: Louisiana's own count of registered voters, 1896 (the colored column; no totals row here). */
const Page1896: React.FC = () => (
  <DocShot src={LA554} size={LA_S} tag={SRC.la554} focusAt={S_1896}
    keys={[[S_1896, {x: 940, y: 330, z: 0.95}], [t.at('Louisiana') - 4, {x: 960, y: 380, z: 0.95}], [S_BARS, {x: 1150, y: 900, z: 0.62}]]}
    over={<>
      <Slip text="Louisiana's own count, 1896" x={140} y={860} rot={-1.5} size={58} at={t.at('1896')} />
      <Slip text="colored voters, parish by parish" x={1100} y={860} rot={1.5} size={52} at={t.at('Louisiana') + 6} />
    </>}>
    <Spot size={LA_S} boxes={COLORED_COL} at={t.at('Louisiana') + 6} id="col" dark={0.38} />
  </DocShot>
);

/** About 130,000; eight years later, about 1,300. */
const Bars: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <RegBars c={{first: t.at('130000'), later: t.at('Eight years'), second: t.at('1300'), ratio: t.at('1300') + 18}} />
    <Tag text={SRC.bars} />
  </AbsoluteFill>
);

/** Jim Crow: a waiting-room sign (1943). */
const Sign: React.FC = () => (
  <PhotoShot src={I + 'bubley_colored_waiting_room_sign_1943.jpg'} size={[1433, 1503]} a={S_SIGN} b={S_LEE} w={620} x={560} y={540} rot={-1.5} tag={SRC.bubley}>
    <Slip text="laws that split almost everything by race" x={300} y={110} rot={-1.5} size={56} at={t.at('split')} />
    <Slip text="schools" x={1020} y={330} rot={2} size={64} at={t.at('schools')} />
    <Slip text="trains" x={1060} y={460} rot={-2} size={64} at={t.at('trains')} />
    <Slip text="waiting rooms" x={1020} y={590} rot={1.5} size={64} at={t.at('waiting rooms')} coral />
  </PhotoShot>
);

/** ... water fountains (1939). Jim Crow. */
const Fountain: React.FC = () => {
  const jc = t.at('Jim Crow');
  return (
    <PhotoShot src={I + 'russell_lee_colored_water_cooler_oklahoma_city_1939.jpg'} size={[1920, 1291]} a={S_LEE} b={S_WORDS} w={860} x={720} y={520} rot={1} tag={SRC.lee}>
      <Slip text="water fountains" x={1220} y={290} rot={-2} size={64} at={t.at('water fountains')} coral />
      <Highlight text="JIM CROW" x={110} y={106} size={88} at={jc} seed={94} rot={-2} />
      <Definition term="Jim Crow laws" def="laws that kept Black and white Southerners apart in public life" at={jc + 9} x={120} y={870} w={1500} />
      <Stamps at={[jc]} />
    </PhotoShot>
  );
};

/** The three words: Landless, still. Homeless, for many, still. Voteless: under its strike from Episode 2. */
const Words: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [S_WORDS, S_BOARD], [1, 1.06], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const [vx, vy, vw, vh] = M_VOTE;
  const y0 = vy + vh * 0.55;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${k})`, transformOrigin: '50% 45%'}}>
        <Motif x={460} y={380} w={1000} at={S_WORDS + 1} under={
          <div style={{position: 'absolute', left: 0, top: 0, width: 1000, height: 122}}>
            <Swipe lines={[M_LAND]} from={t.at('Landless')} to={t.end('Landless')} seed="ml" />
            <Swipe lines={[M_HOME]} from={t.at('Homeless')} to={t.end('Homeless')} seed="mh" />
            <svg width={1000} height={122} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
              <path d={`M ${vx - 6} ${y0 + 4} Q ${vx + vw * 0.5} ${y0 - 8} ${vx + vw + 8} ${y0 - 2}`} stroke={TEAL} strokeWidth={10} fill="none" strokeLinecap="round" />
            </svg>
          </div>
        } />
        <Slip text="Edisto Island, 1865" x={300} y={220} rot={-3} size={60} at={t.at('Edisto')} />
        <Slip text="still" x={560} y={570} rot={-2} size={68} at={t.at('Still')} />
        <Slip text="for many, still" x={830} y={660} rot={2} size={64} at={t.at('For many')} />
      </AbsoluteFill>
      <Sfx at={S_WORDS + 1} src="sfx/tick.wav" volume={0.4} />
      <Tag text={EDISTO_SRC.letter} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Kept key="kp" />],
    [S_PROT, <Protect key="pr" />],
    [S_YEARS, <Years key="yr" />],
    [S_15, <Fifteenth key="15" />],
    [S_GAPS, <Gaps key="gp" />],
    [S_POLL, <Poll key="pl" />],
    [S_RCPT, <Receipt key="rc" />],
    [S_LIT, <Literacy key="lt" />],
    [S_GF, <Grandfather key="gf" />],
    [S_USED, <Used key="us" />],
    [S_1896, <Page1896 key="96" />],
    [S_BARS, <Bars key="br" />],
    [S_SIGN, <Sign key="sg" />],
    [S_LEE, <Fountain key="ft" />],
    [S_WORDS, <Words key="wd" />],
    // the coral VOTELESS writes itself over the strike; hold, then travel down the 15th's "but" string to the gaps scrap
    [S_BOARD, <SeriesBoard key="b" ch={9} from={S_BOARD} at={WRITTEN}
      cam={[[S_BOARD, 1060, 240, 1.7], [WRITTEN + 30, 1080, 240, 1.75], [WRITTEN + 80, 920, 1836, 0.7], [WRITTEN + 400, 920, 1836, 0.69]]} />],
  ]);
  return <>{scene}<Whooshes at={[S_PROT, S_YEARS, S_15, S_GAPS, S_POLL, S_RCPT, S_LIT, S_GF, S_USED, S_1896, S_BARS, S_SIGN, S_LEE, S_WORDS]} /></>;
};

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_voteless.wav" lead={LEAD} extra={EXTRA} music={[{src: 'music/rc_codes.mp3', volume: 0.2}]}>
    <Body />
  </ChapterShell>
);
