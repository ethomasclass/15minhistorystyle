// Chapter 7 · Carpetbaggers and Scalawags. Who the South's Republicans were (drawn groups), the two insults (the carpet
// bag itself, shown B&W; Nast's 1872 cartoon for the word in use; Alcorn as one real "scalawag"), who they actually were
// (slips), where carpetbaggers sat (a drawn pyramid of offices, no numbers), Ames (the general, then the senator), and
// the twist: Nast's "Time Works Wonders" (the 1870 source of the "Davis's seat" story) against the Senate roster.
// The subscribe plug plays over the board.
// Sources: Cooper Hewitt (carpet bag); Nast, 1870 and 1872; Brady and Brady-Handy portraits (LOC); McPherson, Political
// History … Reconstruction (1871), p. 507 (Internet Archive).
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch07_carpetbaggers.words.json';
import {clamp} from '../lib/anim';
import {DarkPaper, Sfx} from '../kit/common';
import {SeriesBoard} from '../kit/ep2board';
import {Person} from '../kit/figures';
import {Highlight, JF, Tag, useGFrame} from '../kit/Kit';
import {type Box, CORAL, DocShot, PRINT_F, Slip, Swipe, TEAL} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {Print} from './ch06_parts';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH07_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------------------------------------------- sources
const BAG = 'img/ch07/cr_carpetbag.png';                // the Cooper Hewitt bag, as a creased B&W print
const BAG_S: [number, number] = [1100, 1365];
const NAST_BAGS = 'img/ch07/nast_man_with_the_carpet_bags_1872.jpg';
const NAST_BAGS_S: [number, number] = [1524, 1536];
const ALCORN = 'img/ch07/cr_alcorn.png';
const ALCORN_S: [number, number] = [900, 1332];
const GENERAL = 'img/ch07/cr_ames_general.png';
const GENERAL_S: [number, number] = [900, 1322];
const AMES = 'img/ch07/ames_senator_brady_handy.jpg';
const TWW = 'img/ch07/nast_time_works_wonders_1870.jpg';
const TWW_S: [number, number] = [2385, 3000];
const TWW_MOOR: Box[] = [[1340, 2770, 385, 36], [712, 2803, 568, 38]];   // "THE LUSTY MOOR / HATH LEAP'D INTO MY SEAT:" (measured)
const ROSTER = 'img/ch07/senate_roster_1870_mississippi_revels_ames_mcpherson_p507.jpg';
const ROSTER_S: [number, number] = [1825, 3000];
const R_MS: Box = [943, 1214, 180, 40];                 // "Mississippi*" (measured)
const R_REVELS: Box = [1178, 1214, 272, 40];            // "Hiram R. Revels"
const R_AMES: Box = [1480, 1214, 244, 40];              // "Adelbert Ames"

const SRC = {
  bag: 'Carpet bag, USA, 1860–69 · Cooper Hewitt, Smithsonian Design Museum',
  nast: 'Thomas Nast, "The Man with the (Carpet) Bags," 1872 · Library of Congress',
  pyramid: 'Carpetbaggers in Southern offices, 1867–77 (not to scale) · E. Foner, Reconstruction (1988)',
  alcorn: 'James L. Alcorn, Brady-Handy studio, c. 1870 · Library of Congress',
  general: 'Maj. Gen. Adelbert Ames, Brady studio, 1860s · Library of Congress',
  ames: 'Adelbert Ames, Brady-Handy studio, c. 1870 · Library of Congress',
  tww: 'Thomas Nast, "Time Works Wonders," Harper\'s Weekly, Apr. 9, 1870 · Library of Congress',
  roster: 'E. McPherson, Political History of the United States … Reconstruction (1871), p. 507 · Internet Archive',
};

// ------------------------------------------------------------------------------------------------------- the shots
const S_BAG = t.at('Carpetbaggers') - 2, S_NAST = t.at('ready to fill') - 2, S_MANY = t.at('Some did come') - 2, S_OFFICES = t.at('They held only') - 2;
const S_SCAL = t.at('Scalawags') - 2, S_WHO = t.at('Some were small') - 2, S_GEN = t.at('Here\'s one carpetbagger') - 2, S_SEN = t.at('Then Mississippi sent') - 2;
const S_TWIST = t.at('And here\'s the twist') - 2, S_ROSTER = t.at('Mississippi has two') - 2, S_BOARD = t.at('We\'ll see Ames again') - 2;

const Cuts: React.FC = () => <>{[S_BAG, S_NAST, S_MANY, S_OFFICES, S_SCAL, S_WHO, S_GEN, S_SEN, S_TWIST, S_ROSTER].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />)}</>;

// ------------------------------------------------------------------------------------- 1 · the South's Republicans
const Label: React.FC<{text: string; x: number; y: number; w: number; at: number; color?: string}> = ({text, x, y, w, at, color = 'rgba(244,239,230,0.8)'}) => {
  const g = useGFrame();
  return <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color,
    opacity: interpolate(g, [at, at + 5], [0, 1], clamp)}}>{text}</div>;
};

const Groups: React.FC = () => {
  const b = t.at('Black voters'), w = t.at('White Republicans'), names = t.at('names too');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Slip text="Republicans in the South" x={140} y={140} size={62} at={b + 2} />
      {Array.from({length: 9}, (_, i) => <Person key={i} x={250 + i * 58} y={730} h={150} at={b + 3 + i} />)}
      <Label text="BLACK VOTERS" x={482} y={760} w={420} at={b + 8} />
      {[0, 1, 2].map((i) => <Person key={i} x={930 + i * 70} y={730} h={150} at={w + 2 + i} />)}
      <Label text="WHITE NORTHERNERS" x={1000} y={760} w={380} at={w + 6} />
      {[0, 1, 2, 3].map((i) => <Person key={i} x={1385 + i * 70} y={730} h={150} at={t.at('Republicans got') + 2 + i} />)}
      <Label text="WHITE SOUTHERNERS" x={1490} y={760} w={380} at={t.at('Republicans got') + 6} />
      <Slip text="a name: ?" x={890} y={450} size={56} rot={-3} at={names} coral />
      <Slip text="a name: ?" x={1370} y={440} size={56} rot={2} at={names + 4} coral />
      <Slip text="neither one a compliment" x={640} y={870} size={58} rot={-2} at={t.at('compliment')} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------- 2 · carpetbaggers
const Bag: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src={BAG} size={BAG_S} x={1340} y={560} w={600} rot={2} at={S_BAG} />
    <Highlight text="CARPETBAGGERS" x={100} y={96} size={84} at={t.at('Carpetbaggers')} seed={71} rot={-2} />
    <Definition term="carpetbagger" def="an insult for a Northerner who moved south after the war" at={t.at('Carpetbaggers') + 9} x={120} y={232} w={820} />
    <Slip text="everything they owned…" x={150} y={560} size={58} at={t.at('everything they owned')} />
    <Slip text="…in a cheap bag made of carpet" x={180} y={680} size={58} rot={2} at={t.at('cheap bag')} coral />
    <Sfx at={S_BAG} src="sfx/tick.wav" volume={0.4} />
    <Sfx at={t.at('Carpetbaggers')} src="sfx/stamp.wav" volume={0.32} />
    <Tag text={SRC.bag} />
  </AbsoluteFill>
);

const NastBags: React.FC = () => (
  <DocShot src={NAST_BAGS} size={NAST_BAGS_S} seed="nb" tag={SRC.nast} filter={PRINT_F} focusAt={S_NAST}
    keys={[[S_NAST, {x: 762, y: 720, z: 0.72}], [S_MANY, {x: 820, y: 640, z: 0.84}]]}
    over={<>
      <Slip text="the insult in use: Nast, 1872" x={140} y={860} size={54} at={S_NAST + 3} />
      <Slip text="ready to grab" x={1390} y={160} size={58} rot={2} at={t.at('whatever they could')} coral />
    </>} />
);

const Many: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src={BAG} size={BAG_S} x={440} y={560} w={430} rot={-2} at={S_MANY} />
    <Slip text="some came to get rich" x={860} y={150} size={58} at={t.at('Some did come')} />
    <Slip text="but many were:" x={880} y={280} size={58} rot={2} at={t.at('But many')} />
    <Slip text="Union veterans" x={880} y={410} size={60} rot={-2} at={t.at('Union veterans')} />
    <Slip text="teachers" x={1350} y={430} size={60} rot={3} at={t.at('teachers')} />
    <Slip text="ministers" x={900} y={540} size={60} rot={2} at={t.at('ministers')} />
    <Slip text="businessmen" x={1300} y={560} size={60} rot={-3} at={t.at('businessmen')} />
    <Slip text="who stayed to rebuild" x={960} y={710} size={62} rot={-1} at={t.at('stayed to rebuild')} coral />
    <Tag text={SRC.bag} />
  </AbsoluteFill>
);

/** A pyramid of offices: a sliver of the wide base, a big piece of the narrow top. Not to scale. */
const AX = 960, AY = 200, BY = 900, HW = 600;
const hw = (y: number) => (HW * (y - AY)) / (BY - AY);
const TIERS: {y0: number; y1: number; label: string; share: number; key: string}[] = [
  {y0: AY, y1: 430, label: 'GOVERNORS · CONGRESS', share: 0.42, key: 'highest'},
  {y0: 440, y1: 660, label: 'STATE LEGISLATURES', share: 0.14, key: 'small share'},
  {y0: 670, y1: BY, label: 'LOCAL OFFICES', share: 0.06, key: 'small share'},
];
const Offices: React.FC = () => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Slip text="carpetbaggers in office" x={130} y={120} size={60} at={S_OFFICES + 4} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          {TIERS.map((s, i) => <clipPath key={i} id={`tier${i}`}><polygon points={`${AX - hw(s.y0)},${s.y0} ${AX + hw(s.y0)},${s.y0} ${AX + hw(s.y1)},${s.y1} ${AX - hw(s.y1)},${s.y1}`} /></clipPath>)}
        </defs>
        {TIERS.map((s, i) => {
          const at = S_OFFICES + 4 + i * 3;
          if (g < at) return null;
          const fa = t.at(s.key) + (i === 2 ? 4 : 0);
          const p = interpolate(g, [fa, fa + 8], [0, s.share], clamp);
          const x0 = AX - hw(s.y1);
          return (
            <g key={i}>
              <rect x={x0} y={s.y0} width={2 * hw(s.y1) * p} height={s.y1 - s.y0} fill={CORAL} clipPath={`url(#tier${i})`} />
              <polygon points={`${AX - hw(s.y0)},${s.y0} ${AX + hw(s.y0)},${s.y0} ${AX + hw(s.y1)},${s.y1} ${AX - hw(s.y1)},${s.y1}`} fill="rgba(47,224,196,0.08)" stroke={TEAL} strokeWidth={6}
                strokeLinejoin="round" opacity={interpolate(g, [at, at + 4], [0, 1], clamp)} />
            </g>
          );
        })}
      </svg>
      {TIERS.map((s, i) => {
        const ym = (s.y0 + s.y1) / 2 + (i === 0 ? 50 : 0);
        return <div key={i} style={{position: 'absolute', right: 1920 - (AX - hw(ym)) + 30, top: ym - 18, fontFamily: JF.mono, fontSize: 26, letterSpacing: 2, color: 'rgba(244,239,230,0.8)',
          whiteSpace: 'nowrap', opacity: interpolate(g, [S_OFFICES + 6 + i * 3, S_OFFICES + 11 + i * 3], [0, 1], clamp)}}>{s.label}</div>;
      })}
      <Slip text="only a small share" x={1180} y={930} size={56} rot={-2} at={t.at('small share')} />
      <Slip text="some of the highest" x={1140} y={250} size={60} rot={2} at={t.at('highest')} coral />
      <Tag text={SRC.pyramid} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------- 3 · scalawags
const Scalawags: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src={ALCORN} size={ALCORN_S} x={1430} y={570} w={500} rot={2} at={S_SCAL} />
    <Highlight text="SCALAWAGS" x={100} y={96} size={84} at={t.at('Scalawags')} seed={72} rot={-2} />
    <Definition term="scalawag" def="an insult for a white Southerner who voted Republican" at={t.at('Scalawags') + 9} x={120} y={232} w={820} />
    <Slip text="slang: a worthless farm animal" x={150} y={520} size={58} rot={-2} at={t.at('slang')} />
    <Slip text="one of them: James Alcorn, governor of Mississippi, 1870" x={140} y={860} size={42} rot={1} at={t.at('worthless farm')} />
    <Sfx at={S_SCAL} src="sfx/tick.wav" volume={0.4} />
    <Sfx at={t.at('Scalawags')} src="sfx/stamp.wav" volume={0.32} />
    <Tag text={SRC.alcorn} />
  </AbsoluteFill>
);

const Who: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    {[0, 1, 2, 3].map((i) => <Person key={i} x={250 + i * 110} y={760} h={250} at={S_WHO + 2 + i} />)}
    <Label text="WHITE SOUTHERNERS" x={415} y={790} w={460} at={S_WHO + 6} />
    <Slip text="scalawags" x={290} y={380} size={64} rot={-3} at={S_WHO + 4} coral />
    <Slip text="small farmers, loyal to the Union" x={830} y={200} size={56} rot={-2} at={t.at('small farmers')} />
    <Slip text="business owners: railroads, schools, growth" x={830} y={340} size={50} rot={1.5} at={t.at('business owners')} />
    <Slip text="equality? plenty of them: no" x={860} y={480} size={56} rot={-1.5} at={t.at('didn\'t believe')} />
    <Slip text="the Republican plan: yes" x={880} y={630} size={60} rot={2} at={t.at('Republican plan')} coral />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------------- 4 · Ames
const General: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src={GENERAL} size={GENERAL_S} x={600} y={560} w={520} rot={-1.5} at={S_GEN} />
    <Slip text="one carpetbagger" x={1000} y={200} size={56} at={t.at('carpetbagger worth')} />
    <Slip text="Adelbert Ames" x={1010} y={320} size={68} rot={2} at={t.at('Adelbert')} coral />
    <Slip text="Union general, from Maine" x={1000} y={460} size={56} rot={-2} at={t.at('Union general')} />
    <Slip text="ran a military district (Mississippi)" x={990} y={590} size={52} rot={1.5} at={t.at('ran one')} />
    <Sfx at={S_GEN} src="sfx/tick.wav" volume={0.4} />
    <Tag text={SRC.general} />
  </AbsoluteFill>
);

const Senator: React.FC = () => (
  <Photo src={AMES} size={[2343, 3000]} fx={1171} fy={1250} z0={1.12} z1={1.2} a={S_SEN} b={S_TWIST} mask={MASKS.ames} traceAt={S_SEN + 4}>
    {() => (
      <>
        <Slip text="U.S. senator, 1870" x={150} y={260} size={62} at={t.at('U.S. Senate')} coral />
        <Slip text="the same year as Revels" x={170} y={390} size={56} rot={2} at={t.at('same year')} />
        <Tag text={SRC.ames} />
      </>
    )}
  </Photo>
);

// ------------------------------------------------------------------------------------------------ 5 · the twist
const Twist: React.FC = () => {
  const hear = t.at('You might hear');
  return (
    <DocShot src={TWW} size={TWW_S} seed="tww" tag={SRC.tww} filter={PRINT_F} focusAt={S_TWIST}
      keys={[[S_TWIST, {x: 1192, y: 1500, z: 0.36}], [hear - 2, {x: 1192, y: 1480, z: 0.37}], [hear + 14, {x: 1200, y: 2770, z: 0.98}], [S_ROSTER, {x: 1160, y: 2775, z: 1.04}]]}
      over={<>
        <Slip text="a cartoon, April 1870" x={140} y={300} size={56} rot={-2} at={S_TWIST + 4} out={hear + 6} />
        <Slip text="Davis as Iago · Revels as Othello" x={140} y={150} size={54} at={hear + 12} />
        <Slip text="where the story comes from" x={160} y={760} size={56} rot={2} at={t.at('took Jefferson')} />
        <Slip text="he didn't." x={1180} y={760} size={72} rot={-3} at={t.at('He didn\'t')} coral />
      </>}>
      <Swipe lines={TWW_MOOR} from={t.at('took Jefferson')} to={t.end('Davis\'s old seat')} seed="tw" />
    </DocShot>
  );
};

const Roster: React.FC = () => (
  <DocShot src={ROSTER} size={ROSTER_S} seed="ros" tag={SRC.roster} focusAt={S_ROSTER}
    keys={[[S_ROSTER, {x: 1330, y: 1240, z: 0.78}], [S_ROSTER + 16, {x: 1330, y: 1236, z: 1.3}], [S_BOARD, {x: 1340, y: 1236, z: 1.38}]]}
    over={<>
      <Slip text="Mississippi: two Senate seats" x={140} y={150} size={58} at={t.at('two Senate seats')} />
      <Slip text="Revels: Albert Brown's old seat" x={150} y={700} size={56} rot={-2} at={t.at('the other one')} />
      <Slip text="Ames: Jefferson Davis's old seat" x={640} y={830} size={60} rot={2} at={t.at('Davis\'s old seat', 2)} coral />
    </>}>
    <Swipe lines={[R_MS]} from={S_ROSTER + 4} to={t.end('two Senate seats')} seed="r1" />
    <Swipe lines={[R_REVELS]} from={t.at('Revels got')} to={t.end('the other one')} seed="r2" />
    <Swipe lines={[R_AMES]} from={t.at('Davis\'s old seat', 2)} to={t.end('to Ames')} seed="r3" />
  </DocShot>
);

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Groups key="g" />],
    [S_BAG, <Bag key="bag" />],
    [S_NAST, <NastBags key="nb" />],
    [S_MANY, <Many key="m" />],
    [S_OFFICES, <Offices key="o" />],
    [S_SCAL, <Scalawags key="sc" />],
    [S_WHO, <Who key="w" />],
    [S_GEN, <General key="gen" />],
    [S_SEN, <Senator key="sen" />],
    [S_TWIST, <Twist key="tw" />],
    [S_ROSTER, <Roster key="r" />],
    [S_BOARD, <SeriesBoard key="b" ch={7} from={S_BOARD} at={t.at('asking for help')} overlay={<>
      <Slip text="he'll be the one asking for help" x={160} y={880} size={56} rot={-2} at={t.at('He\'s going')} out={t.at('Quick thing')} coral />
      <Slip text="subscribe ↓" x={1500} y={900} size={54} rot={3} at={t.at('hit subscribe')} />
    </>} />],
  ]);
  return (
    <>
      {scene}
      <Cuts />
      {[t.at('took Jefferson'), t.at('Revels got'), t.at('Davis\'s old seat', 2)].map((f) => <Sfx key={f} at={f} src="sfx/marker_tick.wav" volume={0.22} />)}
    </>
  );
};

/** Music (MUSIC.md): the sardonic cue under the insults and the twist; it lifts under the subscribe line and the board. */
export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_carpetbaggers.wav" lead={LEAD} music={[{src: 'music/a_price.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);

