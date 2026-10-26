// Chapter 5 · The 15th Amendment. Grant wins with Black votes; Congress writes the vote into the Constitution; Caldwell
// votes to ratify it; VOTELESS is crossed out on the Edisto strip. Then the gaps: three things it bans, three it doesn't
// (a poll tax, a literacy test, the grandfather clause: only described here, named in Episode 3), and the women it left out.
// Sources: Brady's Grant (NARA 526674); Frank Leslie's, June 6, 1868; the Republican Chart for 1868 (LOC); the enrolled
// joint resolution, Feb. 1869 (NARA 299797); McPherson, Political History (1871), p. 558 (Mississippi Senate, Jan. 15,
// 1870); the Edisto committee's letter, Oct. 1865 (NARA M752); Leslie's, 1871 (the suffragists' deputation); Stanton and
// Anthony (1880s) and Lucy Stone (LOC); Thomas Kelly, The Fifteenth Amendment, 1870 (LOC).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch05_fifteenth.words.json';
import {DarkPaper, Sfx} from '../kit/common';
import {Highlight, JF, Tag, useGFrame} from '../kit/Kit';
import {SeriesBoard} from '../kit/ep2board';
import {type Box, CORAL, DocShot, Motif, PRINT_F, SRC as EDISTO_SRC, type SheetCam, Slip, Spot, Swipe, TEAL} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {FocusIn} from '../kit/vox';
import {CropPrint, Ink, PageWin, PrintShot, Stamps, Whooshes} from './ch04_kit';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH05_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------------------------------------------ pictures
const I = 'img/ch05/';
const T15 = I + 'fifteenth_amendment_joint_resolution_1869_nara.jpg';
const T15S: [number, number] = [1920, 2690];
const T15F = 'grayscale(1) contrast(1.35) brightness(1.08)';
// line boxes (source px), drawn on the page and checked
const T15_VOTE: Box[] = [[1535, 1262, 150, 56]];          // "to vote"
const T15_DENIED: Box[] = [[190, 1338, 350, 56]];         // "not be denied"
const T15_LINE: Box[] = [[190, 1398, 1430, 56]];          // "on account of race, color, or previous condition of servitude."
const T15_RACE: Box = [560, 1398, 100, 56];
const T15_COLOR: Box = [685, 1398, 105, 56];
const T15_SERV: Box = [885, 1398, 720, 56];               // "previous condition of servitude"
const P558 = I + 'ms_senate_ratifies_15th_caldwell_yea_1870-01-15_mcpherson_p558.jpg';
const P558_DATE: Box[] = [[1225, 2675, 205, 35], [1105, 2738, 535, 40]];   // "Mississippi." / "Senate, January 15, 1870."
const P558_CALDWELL: Box[] = [[1020, 2828, 292, 36]];      // "Charles Caldwell,"
const CONV = I + 'republican_convention_chicago_1868_leslies_cover.jpg';
const CONV_HEAD: Box[] = [[285, 768, 188, 32]];            // "Grant and Colfax."

const SRC = {
  grant: 'Gen. Ulysses S. Grant, Mathew Brady, c.1864-65 · National Archives',
  conv: "Republican convention, Chicago, May 1868, Frank Leslie's, June 6, 1868 · Internet Archive",
  chart: 'Republican Chart for the Presidential Campaign, 1868 · Library of Congress',
  t15: 'Joint resolution proposing the 15th Amendment, Feb. 1869 · National Archives',
  p558: 'Mississippi Senate ratifies, Jan. 15, 1870, in McPherson, Political History (1871), p. 558 · Internet Archive',
  women: "Woman suffragists before the House Judiciary Committee, Frank Leslie's, 1871 · Library of Congress",
  split: 'E. C. Stanton and S. B. Anthony, 1880s · Lucy Stone, 1840s-60s · Library of Congress',
  kelly: 'Thomas Kelly, The Fifteenth Amendment, 1870 · Library of Congress',
};

// ------------------------------------------------------------------------------------------------------ the cuts
const S_CONV = t.at('He was a Republican') - 2;
const S_CHART = t.at('Republicans noticed') - 2;
const S_15 = t.at('In 1869') - 2;
const S_READ = t.at('It says the right') - 2;
const S_TRANS = t.at('Translation') - 2;
const S_RATIFY = t.at('It was ratified') - 2;
const S_MOTIF = t.at('And on that card') - 2;
const S_CLOSE = t.at('But read it closely') - 2;
const S_GAPS = t.at("It doesn't say") - 2;
const S_WOMEN = t.at('And it says nothing') - 2;
const S_SPLIT = t.at('and the fight') - 2;
const S_STILL = t.at('Still') - 2;
const S_BOARD = t.at('In parts of the South') - 2;

// ------------------------------------------------------------------------------------------------------ shots
const GRANT_MASK = {alpha: I + 'cr_grant_mask.png', paths: MASKS.grant.data.shapes.subject, crop: [180, 499, 1740, 2260] as [number, number, number, number]};
/** Grant, the general who won the war. */
const Grant: React.FC = () => (
  <PrintShot src={I + 'cr_grant.png'} size={[900, 1015]} a={0} b={S_CONV} w={620} x={610} rot={-1.5} tag={SRC.grant} mask={GRANT_MASK} tintAt={t.at('Ulysses')}>
    <Slip text="the 1868 election" x={1060} y={240} rot={-3} at={t.at('That fall')} />
    <Slip text="Ulysses S. Grant" x={1090} y={400} rot={2} at={t.at('Ulysses')} coral />
    <Slip text="the general who won the war" x={1010} y={560} rot={-2} size={54} at={t.at('the general')} />
  </PrintShot>
);

/** The Republican convention: the camera reads "Grant and Colfax", then drops to the convention. */
const Convention: React.FC = () => (
  <DocShot src={CONV} size={[2032, 3000]} tag={SRC.conv} filter={PRINT_F} focusAt={S_CONV}
    keys={[[S_CONV, {x: 560, y: 820, z: 1.05}], [t.at('And in the South') - 4, {x: 600, y: 860, z: 1.1}], [t.at('And in the South') + 14, {x: 1000, y: 2060, z: 1.0}], [S_CHART, {x: 1000, y: 2080, z: 1.04}]]}
    over={<>
      <Slip text="Republican" x={1240} y={170} rot={2} at={t.at('Republican')} />
      <Slip text="Black voters helped elect him" x={1000} y={820} rot={-2} at={t.at('Black voters')} coral />
    </>}>
    <Swipe lines={CONV_HEAD} from={t.at('He was a Republican')} to={t.end('Republican')} seed="cv" />
  </DocShot>
);

/** Republicans noticed: the vote made everything else possible. The 1868 campaign chart. */
const Chart: React.FC = () => (
  <DocShot src={I + 'republican_chart_1868_grant_colfax.jpg'} size={[2303, 3000]} tag={SRC.chart} filter={PRINT_F} focusAt={S_CHART}
    keys={[[S_CHART, {x: 1150, y: 1180, z: 0.82}], [S_15, {x: 1150, y: 1230, z: 0.9}]]}
    over={<>
      <Slip text="the vote →" x={140} y={250} rot={-3} size={66} at={t.at('The vote was')} />
      <Slip text="everything else" x={190} y={380} rot={2} size={58} at={t.at('everything else')} />
      <Slip text="make it permanent" x={1180} y={800} rot={-2} size={66} at={t.at('permanent')} coral />
    </>} />
);

/** The amendment itself: the enrolled resolution. */
const Fifteenth: React.FC = () => (
  <>
    <DocShot src={T15} size={T15S} tag={SRC.t15} filter={T15F} focusAt={S_15}
      keys={[[S_15, {x: 960, y: 1150, z: 0.42}], [S_READ, {x: 960, y: 1250, z: 0.5}]]}
      over={<>
        <Slip text="Feb. 1869" x={1480} y={150} rot={2} at={t.at('1869')} />
        <Highlight text="15TH AMENDMENT" x={110} y={106} size={84} at={t.at('15th')} seed={51} rot={-2} />
        <Definition term="15th Amendment" def="the right to vote can't be denied because of race, color, or having been enslaved" at={t.at('15th') + 9} x={120} y={836} w={1320} />
      </>} />
    <Stamps at={[t.at('15th')]} />
  </>
);

/** Section 1, read along the tilted page as it's spoken. */
const Read: React.FC = () => {
  const L: SheetCam = {x: 0, y: 1300, z: 1.0, tilt: 32, dof: 2.6, band: 70};
  return (
    <DocShot src={T15} size={T15S} tag={SRC.t15} filter={T15F} carryFrom={S_READ} carryTo={S_TRANS}
      keys={[
        [S_READ, {...L, x: 1350, y: 1280, dofY: 1280}],
        [t.at('denied') + 4, {...L, x: 700, y: 1360, dofY: 1360}],
        [t.at('on account'), {...L, x: 620, y: 1425, dofY: 1425}],
        [t.end('servitude'), {...L, x: 1300, y: 1425, dofY: 1425, z: 1.06}],
        [S_TRANS, {...L, x: 1340, y: 1425, dofY: 1425, z: 1.08}],
      ]}>
      <Swipe lines={T15_VOTE} from={t.at('right to vote')} to={t.end('right to vote')} seed="v1" />
      <Swipe lines={T15_DENIED} from={t.at("can't be denied")} to={t.end('denied')} seed="v2" />
      <Swipe lines={T15_LINE} from={t.at('on account')} to={t.end('servitude')} seed="v3" />
    </DocShot>
  );
};

/** Translation, over the line. */
const Trans: React.FC = () => (
  <DocShot src={T15} size={T15S} tag={SRC.t15} filter={T15F} keys={[[S_TRANS, {x: 900, y: 1430, z: 0.82}], [S_RATIFY, {x: 920, y: 1430, z: 0.86}]]}
    over={<>
      <Slip text="translation:" x={160} y={130} rot={-3} size={72} at={t.at('Translation')} />
      <Slip text="you can't be kept from voting" x={250} y={270} rot={-1} size={58} at={t.at("you can't be kept")} />
      <Slip text="because you're Black" x={330} y={720} rot={2} size={58} at={t.at("because you're Black")} />
      <Slip text="or because you used to be enslaved" x={720} y={850} rot={-2} size={58} at={t.at('used to be')} coral />
    </>}>
    <Ink lines={T15_LINE} seed="i3" />
    <Spot size={T15S} boxes={T15_LINE} at={S_TRANS} id="tr" dark={0.55} />
  </DocShot>
);

/** Ratified, 1870: the Mississippi Senate's yeas, and Charles Caldwell among them. */
const Ratify: React.FC = () => {
  const L = {tilt: 26, dof: 2.2, band: 70};
  return (
    <DocShot src={P558} size={[1825, 3000]} tag={SRC.p558} focusAt={S_RATIFY}
      keys={[[S_RATIFY, {...L, x: 1330, y: 2740, z: 1.05}], [S_MOTIF, {...L, x: 1260, y: 2810, z: 1.14}]]}
      over={<Slip text="Charles Caldwell: yes" x={1160} y={800} rot={-2} at={t.at('1870') + 2} coral />}>
      <Swipe lines={P558_DATE} from={t.at('ratified')} to={t.at('1870') - 2} seed="r1" />
      <Swipe lines={P558_CALDWELL} from={t.at('1870')} to={t.at('1870') + 12} seed="r2" />
    </DocShot>
  );
};

/** Edisto's three words; VOTELESS is struck through as it's said. Strike in strip px: VOTELESS spans about x 700-935. */
const Strike: React.FC<{at: number; k: number}> = ({at, k}) => {
  const g = useGFrame();
  const p = interpolate(g, [at, at + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (p <= 0) return null;
  const x0 = 690 * k, x1 = 950 * k, y0 = 70 * k, y1 = 58 * k;
  return (
    <svg width={1000 * k} height={122 * k} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${y1 - 8 * k} ${x0 + (x1 - x0) * p} ${y1}`} stroke={TEAL} strokeWidth={13} fill="none" strokeLinecap="round" />
    </svg>
  );
};
const Edisto: React.FC = () => {
  const f = useCurrentFrame();
  const W = 1500;
  const k = interpolate(f, [S_MOTIF, S_CLOSE], [1, 1.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const v = t.at('Voteless');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${k})`}}>
        <Motif x={210} y={460} w={W} at={S_MOTIF + 1} under={<Strike at={v} k={W / 1000} />} />
      </AbsoluteFill>
      <Slip text="Edisto Island, 1865" x={260} y={240} rot={-3} at={t.at('Edisto')} />
      <Slip text="crossed out" x={1180} y={760} rot={2} at={v + 6} coral />
      <Sfx at={S_MOTIF + 1} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={v} src="sfx/marker_tick.wav" volume={0.35} />
      <Tag text={EDISTO_SRC.letter} />
    </AbsoluteFill>
  );
};

/** Read it closely: the three things it bans, numbered as they're said. */
const Close: React.FC = () => {
  const g = useGFrame();
  const L: SheetCam = {x: 1000, y: 1425, z: 1.0, tilt: 28, dof: 2.4, band: 70};
  const ats = [t.at('Race', 2), t.at('Color', 2), t.at('Having been')];
  const boxes = [T15_RACE, T15_COLOR, T15_SERV].filter((_, i) => g >= ats[i]);
  return (
    <DocShot src={T15} size={T15S} tag={SRC.t15} filter={T15F} focusAt={S_CLOSE}
      keys={[[S_CLOSE, {...L, x: 1100, z: 0.95}], [ats[0] - 4, {...L, x: 900, z: 1.02}], [S_GAPS, {...L, x: 1000, z: 1.06}]]}
      over={<>
        <Slip text="read it closely" x={150} y={140} rot={-3} at={t.at('read it closely')} />
        <Slip text="what it bans:" x={160} y={270} rot={2} size={54} at={t.at("you can't use")} />
      </>}>
      {boxes.length > 0 && <Spot size={T15S} boxes={boxes} at={ats[0]} id="cl" dark={0.6} />}
      {[T15_RACE, T15_COLOR, T15_SERV].map(([x, y, w], i) => g >= ats[i] && (
        <div key={i} style={{position: 'absolute', left: x + w / 2 - 40, top: y - 120, width: 80, textAlign: 'center', fontFamily: JF.display, fontSize: 96, color: TEAL,
          textShadow: '0 0 4px #111, 3px 3px 0 #111, -3px 3px 0 #111, 0 4px 16px rgba(0,0,0,0.8)'}}>{i + 1}</div>
      ))}
      {ats.map((a, i) => <Sfx key={i} at={a} src="sfx/tick_soft.wav" volume={0.32} />)}
    </DocShot>
  );
};

/** What it doesn't ban: three slips, each with a question mark (named in Episode 3). The banned line stays at the top. */
const Gaps: React.FC = () => {
  const g = useGFrame();
  const items: [string, number, number, number][] = [
    ['a tax to vote', t.at('a tax'), 170, -3],
    ['a reading test', t.at('a reading test'), 720, 2],
    ['an exemption if your grandfather could vote', t.at('a rule that'), 0, -1],
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S_GAPS}>
        <PageWin src={T15} cx={900} cy={1426} s={0.82} w={1360} h={120} x={280} y={120} r={-1} filter={T15F}>
          <Ink lines={T15_LINE} seed="g0" />
        </PageWin>
      </FocusIn>
      <div style={{position: 'absolute', left: 290, top: 262, fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: '#ede7dc', opacity: g >= S_GAPS + 4 ? 0.85 : 0}}>BANNED ↑ · NOT MENTIONED ↓</div>
      {items.map(([text, at, x, r], i) => {
        const y = i < 2 ? 400 : 600;
        const xx = i < 2 ? x : 260;
        return (
          <React.Fragment key={i}>
            <Slip text={text} x={xx} y={y} rot={r} size={64} at={at} />
            {g >= at + 8 && <div style={{position: 'absolute', left: xx + (i === 2 ? 1300 : i === 0 ? 470 : 500), top: y - 30, fontFamily: JF.display, fontSize: 120, color: TEAL,
              transform: `rotate(${r * 3}deg)`, textShadow: '0 4px 14px rgba(0,0,0,0.8)'}}>?</div>}
          </React.Fragment>
        );
      })}
      <Slip text="hold onto that" x={300} y={800} rot={-2} size={62} at={t.at('Hold onto')} coral />
      <Slip text="more in Part 3" x={1080} y={830} rot={2} size={52} at={t.at("It's going to matter")} />
      {items.map(([, at], i) => <Sfx key={i} at={at + 8} src="sfx/tick.wav" volume={0.35} />)}
      <Tag text={SRC.t15} />
    </AbsoluteFill>
  );
};

/** Nothing about women: suffragists before the House Judiciary Committee, 1871. */
const Women: React.FC = () => (
  <DocShot src={I + 'woman_suffrage_deputation_judiciary_1871.jpg'} size={[3000, 1931]} tag={SRC.women} filter={PRINT_F} focusAt={S_WOMEN}
    keys={[[S_WOMEN, {x: 1500, y: 930, z: 0.66}], [S_SPLIT, {x: 1650, y: 820, z: 0.76}]]}
    over={<>
      <Slip text="nothing about women" x={130} y={130} rot={-2} at={t.at('nothing about women')} coral />
      <Slip text="abolitionists too" x={1300} y={150} rot={2} size={54} at={t.at('alongside the abolitionists')} />
      <Slip text="left out" x={1360} y={800} rot={-3} size={70} at={t.at('left out')} />
    </>} />
);

/** The split: Stanton and Anthony | Lucy Stone. */
const Split: React.FC = () => {
  const g = useGFrame();
  const sp = t.at('split');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 958, top: 150, width: 4, height: 800, background: 'rgba(244,239,230,0.45)'}} />
      <div style={{position: 'absolute', left: 150, top: 130, width: 660, textAlign: 'center', fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color: TEAL}}>STANTON & ANTHONY</div>
      <div style={{position: 'absolute', left: 1110, top: 130, width: 660, textAlign: 'center', fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color: CORAL}}>LUCY STONE</div>
      <FocusIn at={S_SPLIT + 1}>
        <div style={{position: 'absolute', left: 480 - 190, top: 200, transform: 'rotate(-2deg)', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}}>
          <CropPrint src={I + 'cr_stanton_anthony.png'} size={[900, 1366]} w={380} />
        </div>
        <div style={{position: 'absolute', left: 1440 - 215, top: 210, transform: 'rotate(2deg)', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}}>
          <CropPrint src={I + 'cr_lucy_stone.png'} size={[900, 1125]} w={430} />
        </div>
      </FocusIn>
      <Slip text="opposed it" x={330} y={810} rot={-3} size={56} at={sp + 6} />
      <Slip text="backed it" x={1300} y={800} rot={2} size={56} at={sp + 10} />
      {g >= sp && <Highlight text="SPLIT IN TWO" x={640} y={866} size={84} at={sp} seed={55} rot={-2} />}
      <Stamps at={[sp]} />
      <Sfx at={S_SPLIT + 1} src="sfx/tick.wav" volume={0.35} />
      <Tag text={SRC.split} />
    </AbsoluteFill>
  );
};

/** Still: Kelly's 1870 print of the celebration, framed below the caricatured vignette at top left. */
const Still: React.FC = () => (
  <DocShot src={I + 'fifteenth_amendment_1870_print.jpg'} size={[3000, 2386]} tag={SRC.kelly} filter={PRINT_F} focusAt={S_STILL}
    keys={[[S_STILL, {x: 1520, y: 1330, z: 1.05}], [S_BOARD, {x: 1500, y: 1300, z: 1.13}]]}
    over={<>
      <Slip text="1870" x={140} y={140} rot={-3} at={t.at('Five years')} />
      <Slip text="freedmen vote, nationwide" x={1120} y={800} rot={2} at={t.at('freedmen could vote')} coral />
    </>} />
);

/** Music (MUSIC.md lists w_dawn, which isn't in public/music; SCENES.md's r_abolition_b under the whole chapter). */
const Body: React.FC = () => {
  const scene = useScene([
    [0, <Grant key="g" />],
    [S_CONV, <Convention key="cv" />],
    [S_CHART, <Chart key="ch" />],
    [S_15, <Fifteenth key="15" />],
    [S_READ, <Read key="rd" />],
    [S_TRANS, <Trans key="tr" />],
    [S_RATIFY, <Ratify key="ra" />],
    [S_MOTIF, <Edisto key="ed" />],
    [S_CLOSE, <Close key="cl" />],
    [S_GAPS, <Gaps key="gp" />],
    [S_WOMEN, <Women key="w" />],
    [S_SPLIT, <Split key="sp" />],
    [S_STILL, <Still key="st" />],
    [S_BOARD, <SeriesBoard key="b" ch={5} from={S_BOARD} at={t.at('most of the voters')} />],
  ]);
  return <>{scene}<Whooshes at={[S_CONV, S_CHART, S_15, S_READ, S_TRANS, S_RATIFY, S_MOTIF, S_CLOSE, S_GAPS, S_WOMEN, S_SPLIT, S_STILL]} /></>;
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_fifteenth.wav" lead={LEAD} music={[{src: 'music/r_abolition_b.mp3', volume: 0.14}]}>
    <Body />
  </ChapterShell>
);
