// Chapter 9 · The Debt (the heavy chapter: plain, no jokes, longer holds, no coral punchline slips).
// A year to grow a crop; credit at the store (a promissory note due "on or before the 25 day of December next"); the
// plantation store; the crop lien (the 1867 contract: "after deducting the amount he may advance"); settling up as a
// drawn ledger in bars, no dollar figures, the music dropping out on "owes more than it made"; another year, already
// behind; not slavery, but a trap; the 13th Amendment's "except as a punishment for crime" (Episode 1's swipe);
// convict leasing (the Florida photograph, Alabama's own inspector's report, Mississippi's vagrant law).
// Sources: the De Soto County, Miss., papers of 1867 (Nabb Center, Salisbury Univ., Internet Archive); FSA (LOC);
// the joint resolution signed by Lincoln (LOC); State Archives of Florida via LOC; R. H. Dawson, 1892 (Internet Archive).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch09_the_debt.words.json';
import VA from '../../public/img/ep1/ms_vagrant_act.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Highlight, Tag} from '../kit/Kit';
import {DebtCycle} from './ch09_cycle';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';
import {SeriesBoard} from '../kit/ep2board';
import {type Box, camAt, carry, cut, DOC_F, FocusIn, PhotoShot, Sheet, type SheetCam, Slip, Spot, Swipe, Win} from '../kit/rc';
import {Ledger, type LedgerCues, YearCard, YearLine} from './ch09_ledger';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);
export const CH09_FRAMES = chapterFrames(N, LEAD);

// sources
const NOTE = 'img/ch09/promissory_note_cut.png';             // the note, cut out of the scan's white surround
const NOTE_S: [number, number] = [1775, 1290];
const DEAL = 'img/ch08/desoto_contract_cut.png';
const DEAL_S: [number, number] = [1557, 2458];
const T13 = 'img/ep1/thirteenth_src.jpg';
const T13S: [number, number] = [3196, 4253];
const T13F = 'grayscale(1) sepia(0.15) contrast(1.6) brightness(1.08)';
const DAW = 'img/ch09/LATER_convict_system_of_alabama_dawson_1892_cover.jpg';
const DAW_S: [number, number] = [1886, 3000];
const HAND_F = 'grayscale(1) sepia(0.15) contrast(1.3) brightness(1.04)';
const SRC = {
  note: 'Promissory note, De Soto County, Miss., April 17, 1867 · Nabb Center, Salisbury Univ. · Internet Archive',
  store: 'Commissary (plantation store), Gold Dust Plantation, near Clarksdale, Miss., 1937 · FSA · Library of Congress',
  deal: 'Sharecropping contract, De Soto County, Miss., Feb. 1867 · Nabb Center, Salisbury Univ. · Internet Archive',
  weigh: 'Weighing cotton, Texas, stereograph, 1904 · Keystone View Co. · Library of Congress',
  cabin: 'A cabin, c. 1906 · Detroit Publishing Co. · Library of Congress',
  t13: 'Joint resolution, 13th Amendment, signed by Lincoln, Feb. 1, 1865 · Library of Congress',
  convicts: 'Convicts leased to harvest timber, Florida, c. 1915 · State Archives of Florida · Library of Congress',
  dawson: 'R. H. Dawson, The Convict System of Alabama, 1892 · Internet Archive',
  vagrant: 'Dawson, 1892 · Internet Archive · Weekly Copiahan (Miss.), Dec. 30, 1865 · Library of Congress',
};

// line boxes (source px), each drawn on its page and checked
const DUE: Box[] = [[330, 330, 1230, 90], [230, 445, 830, 95]];    // "On or before the 25 day / of December next"
const ADVANCE: Box = [225, 1720, 1255, 54];                         // "after deducting the amount he may advance"
const T13_LINE: Box = [2035, 928, 860, 62];                         // "except as a punishment for crime;" (Episode 1's box)
const V_TITLE = (VA.phrases as Record<string, number[][]>)['To Amend the Vagrant Laws'][0];

// the shots
const S2 = c('So they bought'), S3 = c('Usually from'), S4 = c('To get that'), S5 = c('And at the end'), S6 = c('The crop is sold'), S7 = c('In many places');
const S8 = c('Some people'), S9 = c('But for a lot'), S10 = c('And remember those'), S11 = c('Southern states'), S12 = c('Most of them'), B = c("It's called");
const PRICES = t.at('The prices');

const LEDGER: LedgerCues = {
  sold: t.at('is sold') - 2, half: t.at("The family's half"), store: t.at('Then the store'), storeEnd: t.end('everything they bought'),
  interest: t.at('plus interest'), interestEnd: t.end('plus interest') + 4, owes: t.at('owes'),
};

const Sounds: React.FC = () => (
  <>
    {[S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />)}
    {['crop lien', 'convict leasing'].map((p) => <Sfx key={p} at={t.at(p)} src="sfx/stamp.wav" volume={0.28} />)}
    {[t.at('on credit'), t.at('gets paid first'), t.at('Except')].map((f) => <Sfx key={f} at={f} src="sfx/marker_tick.wav" volume={0.22} />)}
  </>
);

/** Show children only between frames a and b. */
const Between: React.FC<{a?: number; b: number; children: React.ReactNode}> = ({a = -1e7, b, children}) => {
  const f = useCurrentFrame();
  return f >= a && f < b ? <>{children}</> : null;
};

// ---------------------------------------------------------------------------------------------------------- shots
/** A page on the desk with a camera path and its tag. */
const Doc: React.FC<{src: string; size: [number, number]; keys: [number, SheetCam][]; a: number; b: number; tag: string; filter?: string; children?: React.ReactNode; over?: React.ReactNode}> = ({
  src, size, keys, a, b, tag, filter = DOC_F, children, over,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={a}>
        <Sheet src={src} size={size} cam={camAt(keys, f)} seed={src} filter={filter} offset={[carry(f, a, b) * 0.5, 0]}>{children}</Sheet>
      </FocusIn>
      {over}
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

/** A year to grow; a family has to eat until the harvest. */
const Year: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <YearLine grow={t.at('takes')} harvest={t.at('harvest')} eat={t.at('a family has')} />
    <Slip text="harvest" x={1440} y={200} rot={2} at={t.at('harvest') + 2} />
    <Slip text="a family has to eat" x={560} y={700} rot={-1.5} at={t.at('to eat') - 2} />
    <Tag text="Drawn: a year on a cotton farm" />
  </AbsoluteFill>
);

/** Settling up, line by line. The music drops out just before "owes". */
const Settle: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Ledger c={LEDGER} at={S6} />
    <Tag text="Drawn: settling up at the end of the year (no real figures)" />
  </AbsoluteFill>
);

/** Can't leave: another year, already behind. Then another. (Replaced by the debt cycle, ch09_cycle.tsx.) */
export const Behind: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Ledger c={LEDGER} at={S6} from={S7} x={110} y={170} s={0.42} rot={-3} />
    <YearCard title="the next year" x={780} y={150} rot={2} at={t.at('another year') - 1} seed="y1" s={0.6} />
    <YearCard title="the year after" x={860} y={360} rot={-2} at={t.at('Then another') - 1} seed="y2" s={0.6} />
    <YearCard title="and the next" x={940} y={570} rot={1.5} at={t.at('Then another') + 14} seed="y3" s={0.6} />
    <Slip text="leaving with a debt could get you arrested" x={130} y={890} rot={-1} size={58} at={t.at('leaving with') - 2} dur={24} />
    <Tag text="Drawn: one year's debt carried into the next" />
  </AbsoluteFill>
);

/** Not slavery; a trap. Plain slips on the desk. */
const NotSlavery: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Slip text="“slavery by another name”" x={300} y={200} rot={-2} size={72} at={t.at('slavery by another') - 2} dur={16} />
    <Slip text="it wasn't slavery" x={420} y={360} rot={1.5} size={72} at={t.at("It wasn't slavery") - 2} />
    <Slip text="you couldn't be sold" x={560} y={560} rot={-1.5} size={62} at={t.at("You couldn't be") - 2} />
    <Slip text="your family couldn't be split up" x={560} y={680} rot={1} size={62} at={t.at('Your family') - 2} dur={16} />
    <Tag text="" />
  </AbsoluteFill>
);

/** "Except as a punishment for crime": Episode 1's line, swiped again as it's said. */
const Except: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 958, z: 0.62, tilt: 40, dof: 3.2, band: 60};
  const cam = camAt([
    [S10, {x: 1598, y: 1500, z: 0.27}], [t.at('six words'), {x: 1598, y: 1320, z: 0.32}],
    [t.at('Except') - 20, {...L, x: 1150, z: 0.66}], [t.at('Except'), {...L, x: 1900, z: 0.74}], [t.end('for crime'), {...L, x: 2420, z: 0.82}], [S11, {...L, x: 2460, z: 0.85}],
  ], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S10}>
        <Sheet src={T13} size={T13S} cam={cam} seed="t13" filter={T13F}>
          <Swipe lines={[T13_LINE]} from={t.at('Except')} to={t.end('for crime')} seed="m9" />
          <Spot size={T13S} boxes={[T13_LINE]} at={t.end('for crime') + 8} id="sp9" />
        </Sheet>
      </FocusIn>
      <Slip text="13th Amendment, 1865" x={1200} y={150} rot={2} at={t.at('13th') - 2} />
      <Tag text={SRC.t13} />
    </AbsoluteFill>
  );
};

/** Alabama's own inspector of convicts reports on the system; Mississippi's vagrant law, from Episode 1. */
const Report: React.FC = () => {
  const f = useCurrentFrame();
  const vg = t.at('vagrancy');
  const cam = camAt([[S12, {x: 1720, y: 1560, z: 0.31}], [B, {x: 1660, y: 1480, z: 0.335}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S12}><Sheet src={DAW} size={DAW_S} cam={cam} seed="daw" filter="grayscale(1) sepia(0.1) contrast(1.2) brightness(1.05)" /></FocusIn>
      <Slip text="Alabama's inspector of convicts, 1892" x={1100} y={190} rot={2} size={54} at={S12 + 8} />
      <FocusIn at={vg - 2}>
        <Win src="img/ep1/ms_vagrant_act.jpg" cx={V_TITLE[0] + V_TITLE[2] / 2} cy={V_TITLE[1] + V_TITLE[3] / 2} s={1.0} w={660} h={130} x={1130} y={470} r={-1.5}
          filter="grayscale(1) sepia(0.12) contrast(1.3)" />
      </FocusIn>
      <Slip text="Mississippi, 1865" x={1240} y={640} rot={1.5} size={56} at={vg + 4} />
      <Sfx at={vg - 2} src="sfx/tick.wav" volume={0.35} />
      <Tag text={f >= vg - 2 ? SRC.vagrant : SRC.dawson} />
    </AbsoluteFill>
  );
};

/** Music (MUSIC.md): rc_codes, the trapped cue from Episode 1's Black Codes. It drops out four frames before "owes"
 *  (silence under "owes more than it made" and "they can't leave"), and comes back, from its own start, on "So they sign
 *  on for another year". */
const DROP = t.at('owes') - 4;
const BACK = t.at('So they sign');

const Body: React.FC = () => {
  const cl = t.at('crop lien');
  const cv = t.at('convict leasing');
  const scene = useScene([
    [0, <Year key="yr" />],
    [S2, <Doc key="nt" src={NOTE} size={NOTE_S} a={S2} b={S3} tag={SRC.note} filter={HAND_F}
      keys={[[S2, {x: 887, y: 600, z: 0.92}], [t.at('on credit') - 6, {x: 887, y: 560, z: 0.95}], [t.at('on credit') + 14, {x: 880, y: 500, z: 0.86, tilt: 18, dof: 2, band: 140, dofY: 440}],
        [S3, {x: 900, y: 500, z: 0.9, tilt: 18, dof: 2, band: 140, dofY: 440}]]}
      over={<Slip text="due after the harvest" x={1180} y={830} rot={-2} at={t.end('tools') - 4} />}>
      <Swipe lines={DUE} from={t.at('on credit')} to={t.end('tools')} seed="due" />
    </Doc>],
    [S3, <PhotoShot key="st" src="img/ch09/cr_commissary.png" size={[900, 709]} a={S3} b={S4} w={900} x={760} y={520} rot={-1} tag={SRC.store}>
      <Slip text="the store" x={1240} y={170} rot={2} size={62} at={t.at('local store') - 2} />
      <Slip text="often the planter's" x={1250} y={760} rot={-2} at={t.at('often owned') - 2} />
    </PhotoShot>],
    [S4, <Doc key="cl" src={DEAL} size={DEAL_S} a={S4} b={S5} tag={SRC.deal} filter={HAND_F}
      keys={[[S4, {x: 760, y: 1745, z: 0.95, tilt: 24, dof: 2.2, band: 80}], [t.at('gets paid first'), {x: 700, y: 1745, z: 1.0, tilt: 24, dof: 2.2, band: 80}],
        [t.end('of the crop') + 10, {x: 980, y: 1745, z: 1.04, tilt: 24, dof: 2.2, band: 80}], [S5, {x: 1000, y: 1745, z: 1.06, tilt: 24, dof: 2.2, band: 80}]]}
      over={<>
        <Between b={PRICES - 2}>
          <Highlight text="CROP LIEN" x={110} y={106} size={88} at={cl} seed={91} rot={-2} />
          <Definition term="crop lien" def="a promise that the store gets paid first, out of the crop" at={cl + 9} x={120} y={840} w={1640} />
        </Between>
        <Slip text="“after deducting the amount he may advance”" x={300} y={760} rot={-1.5} size={52} at={t.at('gets paid first') + 6} dur={24} out={PRICES - 2} />
        <Slip text="high prices" x={320} y={790} rot={-2} size={66} at={PRICES - 2} />
        <Slip text="high interest" x={860} y={820} rot={1.5} size={66} at={t.at('So was the interest') - 2} />
      </>}>
      <Swipe lines={[ADVANCE]} from={t.at('gets paid first')} to={t.end('of the crop')} seed="adv" />
    </Doc>],
    [S5, <PhotoShot key="wg" src="img/ch09/cr_weighing.png" size={[900, 818]} a={S5} b={S6} w={720} x={620} y={520} rot={1} tag={SRC.weigh}>
      <Slip text="end of the year: settling up" x={1040} y={780} rot={-2} size={56} at={t.at('settling up') - 2} dur={14} />
    </PhotoShot>],
    [S6, <Settle key="se" />],
    [S7, <DebtCycle key="dc" c={{a: S7, arrest: t.at('leaving with') - 2, sign: t.at('So they sign'), behind: t.at('already behind'), another: t.at('Then another')}} />],
    [S8, <NotSlavery key="ns" />],
    [S9, <PhotoShot key="cb" src="img/ch09/cr_cabin.png" size={[900, 708]} a={S9} b={S10} w={900} x={760} y={500} rot={-1} tag={SRC.cabin}>
      <Slip text="a trap with no way out" x={1080} y={850} rot={-1.5} size={64} at={t.at('a trap') - 2} dur={14} />
    </PhotoShot>],
    [S10, <Except key="ex" />],
    [S11, <PhotoShot key="cv" src="img/ch09/cr_convicts.png" size={[900, 888]} a={S11} b={S12} w={660} x={540} y={530} rot={-1} tag={SRC.convicts}>
      <Slip text="railroads · mines · planters" x={1000} y={300} rot={-2} size={60} at={t.at('Railroads') - 2} dur={18} />
      <Slip text="→ paid the state" x={1080} y={420} rot={1.5} size={60} at={t.at('paid the state') - 2} />
      <Slip text="the prisoners: unpaid" x={1040} y={600} rot={-1.5} size={60} at={t.at('unpaid') - 2} />
    </PhotoShot>],
    [S12, <Report key="rp" />],
    [B, <SeriesBoard key="b" ch={9} from={B} at={t.at('And it was legal')} overlay={
      <Between b={t.at('And it was legal') + 22}>
        <Highlight text="CONVICT LEASING" x={110} y={106} size={84} at={cv} seed={92} rot={-2} />
        <Definition term="convict leasing" def="states renting out prisoners to work, unpaid" at={cv + 9} x={120} y={840} w={1640} />
      </Between>} />],
  ]);
  return <>{scene}<Sounds /></>;
};

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_the_debt.wav" lead={LEAD}
    music={[{src: 'music/rc_codes.mp3', volume: 0.17, to: DROP, fadeOut: 5}, {src: 'music/rc_codes.mp3', volume: 0.17, from: BACK}]}>
    <Body />
  </ChapterShell>
);
