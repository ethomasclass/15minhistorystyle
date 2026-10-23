// Chapter 7 · Mississippi, 1875 (heavy: plain, no jokes, no coral punchlines, longer holds, no picture of any killing).
// The Mississippi Plan (Frost's 1876 cartoon, windowed and labelled); the Clinton rally in Caldwell's own statement; the
// county map; the dead as plain numbers; Ames (the governor, then the Ep 2 callback: the general and the Senate roster);
// the telegrams as a message thread, each slip the text as printed in the papers, the reply quoting Grant, then the real
// Herald column swiped as it's read; the militia's march to Edwards; the peace deal; the election in words only (no
// figures: fact-check flag 20 is unsourced); the Christmas drink (ch01's p.437); his wife's answer on p.439; Redeemers
// and Redemption; his name on the 1868 convention roll; the board, then silence.
// Sources: Asher & Adams, 1874 (MDAH via Commons); A. B. Frost, Harper's Weekly, Oct. 21, 1876 (Commons); National
// Republican, Sept. 9, 1875 and New York Herald, Sept. 17, 1875 (LOC Chronicling America); Brady and Brady-Handy (LOC);
// McPherson, Political History (1871), p. 507; Mississippi in 1875 (Senate report, 1876), pp. 437, 439; Journal of the
// Mississippi Constitutional Convention of 1868, p. 5 (Internet Archive).
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch07_mississippi.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {SeriesBoard} from '../kit/ep3board';
import {Highlight, JF, Tag} from '../kit/Kit';
import {type Box, camAt, carry, DocShot, FocusIn, PRINT_F, type SheetCam, Sheet, Slip, Spot, Swipe, Win} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {PageWin, Pin, Range, StruckSlip, Thread, Trail, Whooshes, type Wire} from './ch07_parts';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => t.at(p, n) - 2;
/** Extra frames after the narration: the held silence on the board after "From people like Charles Caldwell." */
const EXTRA = 45;
export const CH07_FRAMES = chapterFrames(N, LEAD) + EXTRA;

// ------------------------------------------------------------------------------------------------------- sources
const I = 'img/ch07/';
const MAP = I + 'asher_adams_louisiana_mississippi_map_1874.jpg';
const MAP_S: [number, number] = [2032, 3000];
const MS_BOX: Box = [1000, 140, 960, 2010];               // Mississippi on the two-state map (the Louisiana half steps back)
const HINDS = I + 'asher_adams_1874_hinds_county_clinton_jackson_crop.jpg';
const HINDS_S: [number, number] = [1100, 800];
// stations on the Hinds crop (measured)
const JACKSON: [number, number] = [542, 352];
const CLINTON: [number, number] = [453, 326];
const EDWARDS: [number, number] = [310, 327];
const VICKSBURG: [number, number] = [102, 332];
// the railroad west from Jackson, through Clinton, to Edwards (the militia's march)
const MARCH: [number, number][] = [[542, 352], [515, 343], [482, 334], [453, 326], [410, 323], [373, 322], [340, 325], [312, 327]];
const FROST = I + 'frost_of_course_he_wants_to_vote_democratic_harpers_1876.jpg';
const STATEMENT = I + 'national_republican_1875-09-09_statement_of_senator_caldwell.jpg';
const STATEMENT_S: [number, number] = [790, 1230];
const AUDIENCE: Box[] = [[600, 128, 150, 20], [122, 150, 276, 22]];   // "an audience / of over two thousand" (measured)
const HEADLINE = I + 'national_republican_1875-09-09_mississippi_massacre_headline.jpg';
const HEADLINE_S: [number, number] = [690, 460];
const AMES = I + 'ames_hon_adelbert_ames_of_miss_brady_handy.jpg';
const AMES_S: [number, number] = [2343, 3000];
const GENERAL = 'img/ep2/cr_ames_general.png';
const GENERAL_S: [number, number] = [900, 1322];
const ROSTER = 'img/ep2/senate_roster_1870_mississippi_revels_ames_mcpherson_p507.jpg';
const R_AMES: Box = [1480, 1214, 244, 40];                // "Adelbert Ames" (Episode 2's box)
const PIERREPONT = I + 'pierrepont_attorney_general_brady_handy.jpg';
const HERALD = I + 'ny_herald_1875-09-17_tired_out_column.jpg';
const HERALD_S: [number, number] = [1230, 2059];
// the .json's boxes, trimmed to the words: "tired out" (the box began at "are"), "annual autumnal / outbreaks"
const TIRED: Box[] = [[380, 1325, 125, 34]];
const AUTUMNAL: Box[] = [[676, 1325, 268, 34], [24, 1353, 164, 35]];
const P437 = 'img/ch01/caldwell_testimony_p437_christmas_treat_1876.jpg';
const P437_TREAT: Box[] = [[620, 2275, 690, 48]];         // "to drink for a Christmas treat" (the .json's line, trimmed)
const P439 = I + 'caldwell_testimony_p439_obeying_governor_ames_1876.jpg';
const PAGE_S: [number, number] = [1756, 3000];
const P439_LINES: Box[] = [[53, 403, 1576, 48], [52, 452, 1033, 46]];  // the .json's two lines
const P439_QUOTE: Box[] = [[1146, 403, 484, 48], [52, 452, 1033, 46]]; // "for obeying Governor / Ames; … against him."
const ROLL = 'img/ep2/ms_convention_journal_1868_roll_caldwell_p5.jpg';
const ROLL_S: [number, number] = [1698, 3000];
const ROLL_CALDWELL: Box = [136, 2192, 368, 44];          // "Charles Caldwell" (Episode 2's box)

const SRC = {
  map: "Asher & Adams, Louisiana and Mississippi, 1874 · Mississippi Dept. of Archives and History",
  hinds: "Asher & Adams, Louisiana and Mississippi, 1874 (detail: Hinds County) · Mississippi Dept. of Archives and History",
  frost: 'A. B. Frost, “Of course he wants to vote the Democratic ticket!”, Harper\'s Weekly, Oct. 21, 1876 (caricature) · Wikimedia Commons',
  statement: 'National Republican (Washington), Sept. 9, 1875, p. 1: “Statement of State Senator Caldwell” · Library of Congress',
  headline: 'National Republican (Washington), Sept. 9, 1875, p. 1 · Library of Congress',
  ames: 'Hon. Adelbert Ames of Miss., Brady-Handy studio, c. 1870–74 · Library of Congress',
  callback: 'Maj. Gen. Adelbert Ames, Brady studio, 1860s · Library of Congress · McPherson, Political History (1871), p. 507 · Internet Archive',
  wires: 'Telegrams, Sept. 1875: text as printed in the National Republican, Sept. 9, and the New York Herald, Sept. 17, 1875 · Library of Congress',
  herald: 'New York Herald, Sept. 17, 1875, p. 3: the attorney general to Gov. Ames, Sept. 14, quoting the President · Library of Congress',
  p437: 'Testimony of Margaret Ann Caldwell, Mississippi in 1875 (Senate report, 1876), p. 437 · Internet Archive',
  p439: 'Testimony of Margaret Ann Caldwell, Mississippi in 1875 (Senate report, 1876), p. 439 · Internet Archive',
  roll: 'Journal of the Mississippi Constitutional Convention of 1868 (pub. 1871), p. 5 · Internet Archive',
};
const MAP_F = 'grayscale(1) sepia(0.12) contrast(1.25) brightness(1.02)';

// ------------------------------------------------------------------------------------------------------- the cuts
const S_HINDS = c('That year'), S_FROST = c('Armed clubs'), S_PLAN = c('People called'), S_RALLY = c('about 2,000'), S_CLINTON = c('just outside');
const S_SHOTS = c('Shots were fired'), S_DAYS = c('Over the next'), S_RANGE = c('Somewhere between'), S_AMES = c('The governor'), S_CALLBACK = c('The carpetbagger');
const S_WIRE = c('He telegraphed'), S_HERALD = t.at('tired') - 8, S_MILITIA = c('So Ames raised'), S_PEACE = c('Then Ames made'), S_VOTE = c('On Election Day');
const S_DRINK = c('And at the end'), S_WIFE = c('His wife'), S_REDEEM = c('The white Democrats who'), S_ROLL = c('In their story'), S_BOARD = c('From people like');
/** The board's pieces land on "Charles Caldwell" (the last line's). */
const AT = t.wordAt(t.idx('like Charles Caldwell') + 1);
const CUTS = [S_HINDS, S_FROST, S_PLAN, S_RALLY, S_CLINTON, S_SHOTS, S_DAYS, S_RANGE, S_AMES, S_CALLBACK, S_WIRE, S_HERALD, S_MILITIA, S_PEACE, S_VOTE, S_DRINK, S_WIFE, S_REDEEM, S_ROLL];

// ------------------------------------------------------------------------------------------------------- the map
type MapPin = {at: [number, number]; at0: number; label: string; coral?: boolean; dx?: number; dy?: number};
/** The Hinds County crop on the desk with a camera path, pins and their printed-style labels (screen space). */
const Hinds: React.FC<{keys: [number, SheetCam][]; pins: MapPin[]; a: number; b: number; trail?: {at: number; dur: number}; dim?: number; children?: React.ReactNode}> = ({
  keys, pins, a, b, trail, dim = 0, children,
}) => {
  const f = useCurrentFrame();
  const cam = camAt(keys, f);
  const off = carry(f, a, b) * 0.4;
  const S = ([x, y]: [number, number]) => [960 + (x - cam.x) * cam.z + off, 540 + (y - cam.y) * cam.z];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={a}>
        <Sheet src={HINDS} size={HINDS_S} cam={cam} seed="hinds" filter={`${MAP_F} brightness(${1 - dim})`} offset={[off, 0]}>
          {trail && <Trail pts={MARCH} at={trail.at} dur={trail.dur} z={cam.z} />}
          {pins.map((p, i) => <Pin key={i} x={p.at[0]} y={p.at[1]} at={p.at0} z={cam.z} coral={p.coral} />)}
        </Sheet>
      </FocusIn>
      {pins.map((p, i) => {
        if (f < p.at0 + 4) return null;
        const [x, y] = S(p.at);
        return <div key={i} style={{position: 'absolute', left: x + (p.dx ?? -60), top: y + (p.dy ?? 30), padding: '2px 8px', background: 'rgba(12,11,9,0.78)', fontFamily: JF.mono, fontSize: 21,
          letterSpacing: 2, color: p.coral ? '#ffb3aa' : '#e9fff9', whiteSpace: 'nowrap'}}>{p.label}</div>;
      })}
      {children}
      <Tag text={SRC.hinds} />
    </AbsoluteFill>
  );
};
const P_JACKSON = (at0: number): MapPin => ({at: JACKSON, at0, label: 'JACKSON', dx: 18, dy: 22});
const P_CLINTON = (at0: number): MapPin => ({at: CLINTON, at0, label: 'CLINTON', coral: true, dx: -56, dy: 30});
const P_EDWARDS = (at0: number): MapPin => ({at: EDWARDS, at0, label: 'EDWARDS', dx: -70, dy: 30});
const P_VICKSBURG = (at0: number): MapPin => ({at: VICKSBURG, at0, label: 'VICKSBURG', dx: -40, dy: 32});

// ------------------------------------------------------------------------------------------------------- 1 · 1875
/** Back to Mississippi: the two-state map, the Louisiana half stepping back, the camera going in toward Jackson. */
const Back: React.FC = () => (
  <DocShot src={MAP} size={MAP_S} tag={SRC.map} filter={MAP_F} focusAt={0}
    keys={[[0, {x: 1480, y: 1150, z: 0.5}], [t.at('1875') + 10, {x: 1420, y: 1240, z: 0.62}], [S_HINDS, {x: 1325, y: 1372, z: 1.2}]]}
    over={<Slip text="Mississippi, 1875" x={150} y={150} size={72} rot={-2} at={t.at('1875')} />}>
    <Spot size={MAP_S} boxes={[MS_BOX]} at={6} id="ms" dark={0.55} />
  </DocShot>
);

/** The decision, on the county map: Jackson, Clinton, Edwards, Vicksburg. */
const Decision: React.FC = () => (
  <Hinds a={S_HINDS} b={S_FROST} keys={[[S_HINDS, {x: 560, y: 360, z: 1.8}], [S_FROST, {x: 548, y: 356, z: 1.88}]]}
    pins={[P_JACKSON(S_HINDS + 6), P_CLINTON(S_HINDS + 10), P_EDWARDS(S_HINDS + 14), P_VICKSBURG(S_HINDS + 18)]}>
    <Slip text="Mississippi's Democrats, 1875" x={150} y={140} size={60} rot={-2} at={t.at("Mississippi's")} />
    <Slip text="win the next election" x={170} y={770} size={62} rot={1.5} at={t.at('win the next')} />
    <Slip text="by any means necessary" x={260} y={880} size={66} rot={-1.5} at={t.at('by any means')} />
  </Hinds>
);

/** Armed clubs: Frost's 1876 cartoon, windowed and labelled (caricature, a year later), brief. */
const Clubs: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <FocusIn at={S_FROST}>
      <Win src={FROST} cx={1130} cy={650} s={0.62} w={820} h={580} x={980} y={180} r={1.5} filter="grayscale(1) contrast(1.15) brightness(0.86)" />
    </FocusIn>
    <Slip text="armed clubs of white men" x={130} y={250} size={62} rot={-2} at={t.at('Armed clubs')} />
    <Slip text="at Republican meetings" x={160} y={380} size={60} rot={1.5} at={t.at('Republican meetings')} />
    <Slip text="a Republican cartoon of 1876, against the shotgun policy" x={130} y={850} size={46} rot={-1} at={S_FROST + 6} dur={16} />
    <Sfx at={S_FROST} src="sfx/tick.wav" volume={0.35} />
    <Tag text={SRC.frost} />
  </AbsoluteFill>
);

const Plan: React.FC = () => {
  const at = t.at('Mississippi Plan');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="MISSISSIPPI PLAN" x={300} y={330} size={110} at={at} seed={71} rot={-2} />
      <Definition term="Mississippi Plan" def="the Democrats' plan to win the 1875 election by any means, including armed force" at={at + 9} x={300} y={580} w={1320} />
      <Sfx at={at} src="sfx/stamp.wav" volume={0.3} />
      <Tag text="" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------------- 2 · Clinton
/** About 2,000 people: Caldwell's own statement, the morning after it was printed. */
const Rally: React.FC = () => (
  <DocShot src={STATEMENT} size={STATEMENT_S} tag={SRC.statement} focusAt={S_RALLY} seed="stmt"
    keys={[[S_RALLY, {x: 420, y: 150, z: 1.9}], [S_CLINTON, {x: 420, y: 160, z: 2.0}]]}
    over={<>
      <Slip text="Charles Caldwell's own account" x={150} y={110} size={56} rot={-2} at={S_RALLY + 4} coral />
      <Slip text="a Republican rally and barbecue" x={300} y={860} size={60} rot={1.5} at={t.at('rally')} />
    </>}>
    <Swipe lines={AUDIENCE} from={t.at('about 2,000')} to={t.end('Black Mississippians')} seed="aud" />
  </DocShot>
);

const Clinton: React.FC = () => (
  <Hinds a={S_CLINTON} b={S_SHOTS} keys={[[S_CLINTON, {x: 453, y: 330, z: 2.5}], [S_SHOTS, {x: 453, y: 328, z: 2.62}]]} pins={[P_CLINTON(S_CLINTON + 4)]}>
    <Slip text="just outside Clinton" x={150} y={140} size={62} rot={-2} at={t.at('just outside')} />
    <Slip text="Charles Caldwell's town" x={1040} y={640} size={64} rot={2} at={t.at("Charles Caldwell's")} coral />
    <Slip text="men from a nearby town broke it up" x={150} y={870} size={56} rot={-1} at={t.at('Men from')} />
  </Hinds>
);

/** Shots fired: the headline as the news broke, and the dead as plain numbers. */
const Shots: React.FC = () => (
  <DocShot src={HEADLINE} size={HEADLINE_S} tag={SRC.headline} focusAt={S_SHOTS} seed="hl" filter={PRINT_F}
    keys={[[S_SHOTS, {x: 345, y: 300, z: 1.9}], [S_DAYS, {x: 345, y: 296, z: 1.96}]]}
    over={<>
      <Slip text="at least 8 people died" x={250} y={880} size={62} rot={-1.5} at={t.at('At least')} />
      <Slip text="including 3 white men" x={1000} y={890} size={62} rot={1.5} at={t.at('including')} />
    </>} />
);

const Days: React.FC = () => (
  <Hinds a={S_DAYS} b={S_RANGE} dim={0.12} keys={[[S_DAYS, {x: 500, y: 420, z: 1.8}], [S_RANGE, {x: 500, y: 410, z: 1.86}]]} pins={[P_CLINTON(S_DAYS + 3)]}>
    <Slip text="over the next few days" x={150} y={140} size={62} rot={-2} at={t.at('Over the next')} />
    <Slip text="armed white men hunted Black people" x={170} y={770} size={58} rot={1} at={t.at('armed white')} />
    <Slip text="across the county" x={320} y={880} size={62} rot={-1.5} at={t.at('across the')} />
  </Hinds>
);

// ------------------------------------------------------------------------------------------------------- 3 · Ames
const Ames: React.FC = () => (
  <Photo src={AMES} size={AMES_S} fx={900} fy={1150} z0={1.25} z1={1.31} a={S_AMES} b={S_CALLBACK} mask={MASKS.ames_miss} traceAt={S_AMES + 4}>
    {() => (
      <>
        <Slip text="the governor of Mississippi" x={140} y={300} size={60} rot={-2} at={t.at('governor')} />
        <Slip text="Adelbert Ames" x={170} y={430} size={72} rot={1.5} at={t.at('Adelbert')} coral />
        <Tag text={SRC.ames} />
      </>
    )}
  </Photo>
);

/** Episode 2's Ames: the general from Maine, and the Senate roster where he took Davis's old seat. */
const Callback: React.FC = () => {
  const f = useCurrentFrame();
  const h = (GENERAL_S[1] * 430) / GENERAL_S[0];
  const jd = t.at('Jefferson');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S_CALLBACK}>
        <Img src={staticFile(GENERAL)} style={{position: 'absolute', left: 420 - 215 + carry(f, S_CALLBACK, S_WIRE) * 0.5, top: 540 - h / 2, width: 430, height: h, transform: 'rotate(-1.5deg)',
          filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} />
      </FocusIn>
      <Slip text="the carpetbagger from Maine" x={760} y={190} size={60} rot={-2} at={t.at('carpetbagger')} />
      <FocusIn at={jd - 2}>
        <PageWin src={ROSTER} cx={1240} cy={1234} s={0.85} w={1000} h={120} x={760} y={430} r={-1}>
          <Swipe lines={[R_AMES]} from={jd} to={t.end('Senate seat')} seed="ra" />
        </PageWin>
      </FocusIn>
      <Slip text="Jefferson Davis's old Senate seat" x={800} y={620} size={58} rot={1.5} at={t.at('Senate seat')} />
      <Sfx at={S_CALLBACK} src="sfx/tick.wav" volume={0.35} />
      <Sfx at={jd - 2} src="sfx/tick.wav" volume={0.35} />
      <Tag text={SRC.callback} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------------- 4 · the telegrams
const NR = 'TEXT AS PRINTED IN THE NATIONAL REPUBLICAN, SEPT. 9, 1875';
const WIRES: Wire[] = [
  {id: 'w1', side: 'left', at: t.at('telegraphed'), w: 600, h: 256, foot: NR, sign: 'ADELBERT AMES.',
    head: ['JACKSON, MISS., SEPT. 7, 1875.', 'TO HIS EXCELLENCY U. S. GRANT, PRESIDENT'],
    body: 'SIR: Domestic violence in its most aggravated form exists in certain parts of this State…'},
  {id: 'w2', side: 'left', at: t.at('for troops'), w: 600, h: 284, foot: NR, label: 'OFFICIAL CALL FOR FEDERAL ASSISTANCE',
    head: ['JACKSON, MISS., SEPT. 8—5:30 P. M.', 'TO PRESIDENT U. S. GRANT, WASHINGTON, D. C.'],
    body: 'Domestic violence prevails in various parts of this State beyond the power of the State authorities to suppress…'},
  {id: 'w3', side: 'right', at: t.at('quoting'), w: 660, h: 286, foot: 'TEXT AS PRINTED IN THE NEW YORK HERALD, SEPT. 17, 1875', bodySize: 29, typeDur: 26,
    label: '“…AN EXTRACT FROM HIS DESPATCH:—”',
    head: ['DEPARTMENT OF JUSTICE, WASHINGTON, SEPT. 14, 1875.', 'TO GOVERNOR AMES, JACKSON, MISS.'],
    body: 'The whole public are tired out with these annual autumnal outbreaks in the South…'},
];
const Wires: React.FC = () => (
  <Thread wires={WIRES} typing={[t.at('The answer'), t.at('quoting')]} header="SEPT. 1875 · JACKSON ⇄ WASHINGTON"
    senders={[
      {src: AMES, size: AMES_S, mask: MASKS.ames_miss, fx: 1230, fy: 1250, scale: 0.3, x: 150, y: 250, at: S_WIRE, credit: 'Adelbert Ames, Brady-Handy studio, c. 1870–74 · Library of Congress'},
      {src: PIERREPONT, size: [2444, 3000], mask: MASKS.pierrepont, fx: 1300, fy: 1300, scale: 0.3, x: 1450, y: 250, at: t.at('attorney general'),
        credit: 'Edwards Pierrepont, Brady-Handy studio, undated · Library of Congress'},
    ]}>
    <Slip text="Gov. Ames" x={170} y={740} size={56} rot={-2} at={S_WIRE + 4} />
    <Slip text="Grant's attorney general" x={1390} y={740} size={38} rot={1.5} at={t.at('attorney general')} />
    <Tag text={SRC.wires} />
  </Thread>
);

/** The real column, swiped as it's read; then the translation. */
const Herald: React.FC = () => {
  const L = {tilt: 20, dof: 1.8, band: 80};
  return (
    <DocShot src={HERALD} size={HERALD_S} tag={SRC.herald} focusAt={S_HERALD} seed="her"
      keys={[[S_HERALD, {...L, x: 600, y: 1300, z: 1.12, dofY: 1340}], [t.end('outbreaks'), {...L, x: 560, y: 1345, z: 1.3, dofY: 1345}], [S_MILITIA, {...L, x: 556, y: 1348, z: 1.36, dofY: 1345}]]}
      over={<>
        <Slip text="translation:" x={160} y={140} size={66} rot={-2} at={t.at('Translation')} />
        <Slip text="the North was done." x={240} y={830} size={76} rot={1.5} at={t.at('the North')} />
      </>}>
      <Swipe lines={TIRED} from={t.at('tired')} to={t.end('tired out')} seed="to" />
      <Swipe lines={AUTUMNAL} from={t.at('annual')} to={t.end('outbreaks')} seed="aa" />
      <Spot size={HERALD_S} boxes={[...TIRED, ...AUTUMNAL]} at={t.end('outbreaks in the South') + 4} id="hsp" dark={0.5} />
    </DocShot>
  );
};

// ------------------------------------------------------------------------------------------------------- 5 · the militia
const Militia: React.FC = () => {
  const m = t.at('marched');
  return (
    <Hinds a={S_MILITIA} b={S_PEACE} keys={[[S_MILITIA, {x: 470, y: 345, z: 2.1}], [S_PEACE, {x: 455, y: 340, z: 2.2}]]}
      pins={[P_JACKSON(S_MILITIA + 4), P_CLINTON(S_MILITIA + 8), P_EDWARDS(m)]} trail={{at: m, dur: t.at('guns') - m}}>
      <Slip text="Ames raises a militia" x={150} y={140} size={64} rot={-2} at={t.at('raised')} />
      <Slip text="Charles Caldwell commands part of it" x={170} y={270} size={58} rot={1.5} at={t.at('Charles Caldwell')} coral />
      <Slip text="a company marches to Edwards" x={300} y={760} size={58} rot={-1.5} at={m} />
      <Slip text="delivering guns" x={420} y={880} size={62} rot={1.5} at={t.at('deliver')} />
    </Hinds>
  );
};

const Peace: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Slip text="a peace deal" x={560} y={240} size={76} rot={-2} at={t.at('peace deal')} />
    <StruckSlip text="Ames's militia" x={640} y={460} at={S_PEACE + 2} strike={t.at('disbanded')} w={430} size={76} rot={1.5} />
    <Slip text="disbanded" x={900} y={660} size={70} rot={-1.5} at={t.at('disbanded') + 6} />
    <Tag text="" />
  </AbsoluteFill>
);

/** Election Day, in words only: no vote counts on screen (fact-check flag 20 has no source yet). */
const Vote: React.FC = () => (
  <DocShot src={MAP} size={MAP_S} tag={SRC.map} filter={MAP_F} focusAt={S_VOTE}
    keys={[[S_VOTE, {x: 1250, y: 1150, z: 0.5}], [S_DRINK, {x: 1270, y: 1150, z: 0.53}]]}
    over={<>
      <Slip text="Election Day, 1875" x={140} y={140} size={64} rot={-2} at={t.at('Election Day')} />
      <Slip text="Democrats sweep Mississippi" x={160} y={270} size={60} rot={1.5} at={t.at('swept')} />
      <Slip text="in some counties full of Black voters," x={140} y={760} size={54} rot={-1} at={t.at('In some counties')} />
      <Slip text="the Republican vote: almost nothing" x={180} y={880} size={58} rot={1} at={t.at('the Republican vote')} />
    </>}>
    <Spot size={MAP_S} boxes={[MS_BOX]} at={S_VOTE} id="ms2" dark={0.6} />
  </DocShot>
);

// ------------------------------------------------------------------------------------------------------- 6 · December
/** The Christmas drink: ch01's page, brief. */
const Drink: React.FC = () => {
  const L = {tilt: 22, dof: 2, band: 80};
  return (
    <DocShot src={P437} size={PAGE_S} tag={SRC.p437} focusAt={S_DRINK} seed="p437"
      keys={[[S_DRINK, {...L, x: 900, y: 2240, z: 0.82, dofY: 2260}], [t.at('talked'), {...L, x: 960, y: 2296, z: 0.96, dofY: 2299}], [S_WIFE, {...L, x: 980, y: 2299, z: 1.0, dofY: 2299}]]}
      over={<Slip text="the end of December, 1875" x={150} y={140} size={60} rot={-2} at={t.at('December')} />}>
      <Swipe lines={P437_TREAT} from={t.at('talked')} to={t.end('Christmas drink')} seed="tr" />
    </DocShot>
  );
};

/** Why: his wife's words on the printed page, swiped as they're spoken, then held. */
const Wife: React.FC = () => {
  const L = {tilt: 18, dof: 1.6, band: 90};
  const q = t.at('for obeying');
  return (
    <DocShot src={P439} size={PAGE_S} tag={SRC.p439} focusAt={S_WIFE} seed="p439"
      keys={[[S_WIFE, {x: 878, y: 330, z: 0.7}], [q - 12, {...L, x: 878, y: 440, z: 0.98, dofY: 452}], [S_REDEEM, {...L, x: 878, y: 446, z: 1.04, dofY: 452}]]}
      over={<Slip text="Margaret Ann Caldwell, to a Senate committee, 1876" x={150} y={860} size={52} rot={-1} at={t.at('wife')} dur={16} />}>
      <Swipe lines={P439_QUOTE} from={q} to={t.end('against him')} seed="ob" />
      <Spot size={PAGE_S} boxes={P439_LINES} at={t.end('against him') + 4} id="p439" dark={0.5} />
    </DocShot>
  );
};

// ------------------------------------------------------------------------------------------------------- 7 · Redemption
const Redeem: React.FC = () => {
  const r1 = t.at('Redeemers'), r2 = t.at('Redemption');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="REDEEMERS" x={140} y={140} size={104} at={r1} seed={72} rot={-2} />
      <Definition term="Redeemers" def="what the white Democrats who took over called themselves" at={r1 + 9} x={150} y={330} w={1500} />
      <Highlight text="REDEMPTION" x={140} y={520} size={104} at={r2} seed={73} rot={-1.5} />
      <Definition term="Redemption" def="their word for what they had done. To redeem means to save." at={r2 + 9} x={150} y={710} w={1500} />
      <Sfx at={r1} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={r2} src="sfx/stamp.wav" volume={0.3} />
      <Tag text="" />
    </AbsoluteFill>
  );
};

/** In their story, they had saved the South: his name on the 1868 roll, held, nothing written over it. */
const Roll: React.FC = () => {
  const L = {tilt: 16, dof: 1.4, band: 80, dofY: 2214};
  return (
    <DocShot src={ROLL} size={ROLL_S} tag={SRC.roll} focusAt={S_ROLL} seed="roll"
      keys={[[S_ROLL, {...L, x: 500, y: 2214, z: 1.42}], [S_BOARD, {...L, x: 470, y: 2214, z: 1.5}]]}>
      <Spot size={ROLL_S} boxes={[ROLL_CALDWELL]} at={S_ROLL} id="roll" dark={0.6} />
    </DocShot>
  );
};

// ------------------------------------------------------------------------------------------------------- the chapter
/** On the board: close on the pieces as they land on "Charles Caldwell", settle, then (in the silence) up the
 *  PROTECTION column to its header, torn, and the cut string from Ames to the army. Neither framing slices a piece
 *  (tools/boardfit.mjs 7 2780 2100 1.58 / 2792 425 1.13). */
const BOARD_CAM: [number, number, number, number][] = [
  [S_BOARD, 2550, 1890, 1.5], [AT + 24, 2780, 2100, 1.58], [AT + 40, 2780, 2096, 1.57], [AT + 70, 2792, 425, 1.13], [AT + 260, 2792, 425, 1.12],
];

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Back key="bk" />],
    [S_HINDS, <Decision key="de" />],
    [S_FROST, <Clubs key="cl" />],
    [S_PLAN, <Plan key="pl" />],
    [S_RALLY, <Rally key="ra" />],
    [S_CLINTON, <Clinton key="ci" />],
    [S_SHOTS, <Shots key="sh" />],
    [S_DAYS, <Days key="dy" />],
    [S_RANGE, <Range key="rg" lo="30" hi="50" at={S_RANGE} label="SOMEWHERE BETWEEN" note="KILLED ACROSS THE COUNTY, OVER THE NEXT FEW DAYS" />],
    [S_AMES, <Ames key="am" />],
    [S_CALLBACK, <Callback key="cb" />],
    [S_WIRE, <Wires key="wi" />],
    [S_HERALD, <Herald key="he" />],
    [S_MILITIA, <Militia key="mi" />],
    [S_PEACE, <Peace key="pe" />],
    [S_VOTE, <Vote key="vo" />],
    [S_DRINK, <Drink key="dr" />],
    [S_WIFE, <Wife key="wf" />],
    [S_REDEEM, <Redeem key="rd" />],
    [S_ROLL, <Roll key="ro" />],
    [S_BOARD, <SeriesBoard key="b" ch={7} from={S_BOARD} at={AT} cam={BOARD_CAM} />],
  ]);
  return (
    <>
      {scene}
      <Whooshes at={CUTS} />
      {[t.at('about 2,000'), t.at('tired'), t.at('annual'), t.at('for obeying')].map((f) => <Sfx key={f} at={f} src="sfx/marker_tick.wav" volume={0.2} />)}
    </>
  );
};

/** Music (SCENES.md): rc_night_riders until the attorney general's reply, then rc_brass_dirge; it fades away under the
 *  last line, so the silence after "From people like Charles Caldwell." is silence. */
const REPLY = t.at('The answer');
const QUIET = t.end('like Charles Caldwell') + 4;
export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_mississippi.wav" lead={LEAD} extra={EXTRA}
    music={[{src: 'music/rc_night_riders.mp3', volume: 0.18, to: REPLY + 6, fadeOut: 36}, {src: 'music/rc_brass_dirge.mp3', volume: 0.18, from: REPLY - 12, to: QUIET, fadeOut: 60}]}>
    <Body />
  </ChapterShell>
);
