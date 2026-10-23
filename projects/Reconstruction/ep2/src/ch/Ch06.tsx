// Chapter 6 · Bottom Rail on Top. The story catches up with the cold open (the Currier & Ives print, Revels), the count of
// Black officeholders (about 2,000, Caldwell among them, sixteen in Congress), the phrase (a drawn rail fence; the
// racist broadside that mocked it, windowed onto its title only), what the new governments did (four drawn cards), the
// critics' "whole story" (Nast's 1874 cartoon, windowed onto its caption only: its figures are caricatures), and Tweed.
// Sources: Currier & Ives, 1872; Brady-Handy portraits of Revels and Smalls; the 1884 Lynch print; the 1868 Mississippi
// convention journal; the c. 1867 Virginia broadside; Harper's Weekly, Aug. 19, 1871 and Mar. 14, 1874 (LOC, Internet Archive).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch06_bottom_rail.words.json';
import {clamp} from '../lib/anim';
import {DarkPaper, Sfx} from '../kit/common';
import {SeriesBoard} from '../kit/ep2board';
import {Highlight, JF, Loop, Tag, useGFrame} from '../kit/Kit';
import {type Box, CORAL, DocShot, FocusIn, PhotoShot, PRINT_F, Sheet, camAt, Slip, Swipe, TEAL} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, Stamp, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {Cross, CREAM, LineCard, Print, Seats, Stroke, Ticks, WinS} from './ch06_parts';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH06_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------------------------------------------- sources
const PRINT = 'img/wall/cr_senators.png';
const PRINT_S: [number, number] = [900, 687];
const REVELS = 'img/ch01/revels_brady_handy_1870.jpg';
const ROLL = 'img/ch03/ms_convention_journal_1868_roll_caldwell_p5.jpg';
const ROLL_S: [number, number] = [1698, 3000];
const ROLL_CALDWELL: Box = [136, 2192, 368, 44];          // "Charles Caldwell" (measured)
const VOMIT = 'img/ch06/PROPAGANDA_black_vomit_bottom_rail_c1867.jpg';
const VOMIT_SUB: Box = [250, 178, 600, 42];               // "Or, The Bottom Rail on Top." (measured)
const RULE = 'img/ch06/PROPAGANDA_nast_colored_rule_1874.jpg';
const TWEED = 'img/ch06/nast_who_stole_the_peoples_money_tweed_ring_1871.jpg';
const TWEED_S: [number, number] = [3000, 2228];

const SRC = {
  print: 'Currier & Ives, The First Colored Senator and Representatives, 1872 · Library of Congress',
  revels: 'Hiram R. Revels, Brady-Handy studio, c. 1870 · Library of Congress',
  count: 'Black officeholders, 1867–77: about 2,000 (1,510 documented) · E. Foner, Freedom\'s Lawmakers',
  roll: 'Journal of the Mississippi Constitutional Convention of 1868 · Internet Archive',
  seats: 'John R. Lynch (print, 1884) · Robert Smalls, Brady-Handy studio · Library of Congress',
  vomit: '"The Black Vomit; or, the Bottom Rail on Top," broadside, Virginia, c. 1867 · Library of Congress',
  rule: 'Thomas Nast, Harper\'s Weekly, Mar. 14, 1874 (caption only) · Library of Congress',
  tweed: 'Thomas Nast, "Who Stole the People\'s Money?", Harper\'s Weekly, Aug. 19, 1871 · Internet Archive',
};

// ------------------------------------------------------------------------------------------------------- the shots
const S_REVELS = t.at('Two days later') - 2, S_ALONE = t.at('He wasn\'t alone') - 2, S_COUNT = t.at('During Reconstruction') - 2;
const S_ROLL = t.at('State lawmakers') - 2, S_SEATS = t.at('Sixteen served') - 2, S_RAIL = t.at('There\'s a phrase') - 2;
const S_VOMIT = t.at('and in the cartoons') - 2, S_DID = t.at('So what did') - 2, S_CRITICS = t.at('Critics') - 2;
const S_TWEED = t.at('But corruption') - 2, S_BOARD = t.at('Nobody said') - 2;

const Cuts: React.FC = () => <>{[S_REVELS, S_ALONE, S_COUNT, S_ROLL, S_SEATS, S_RAIL, S_VOMIT, S_DID, S_CRITICS, S_TWEED].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />)}</>;

// ------------------------------------------------------------------------------------- 1 · the moment, Revels
/** The print from the cold open, the camera drifting in on Revels (far left). */
const Moment: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt([[0, {x: 450, y: 335, z: 1.62}], [t.at('February') - 6, {x: 430, y: 335, z: 1.66}], [S_REVELS, {x: 300, y: 320, z: 2.05}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={0}><Sheet src={PRINT} size={PRINT_S} cam={cam} seed="prt" filter="grayscale(1) contrast(1.1)">
        <Loop cx={180} cy={228} rx={62} ry={80} at={t.at('The moment') + 2} width={3.5} seed={6} />
      </Sheet></FocusIn>
      <Slip text="Hiram Revels: the first Black senator" x={1000} y={790} size={54} at={t.at('The moment')} coral />
      <Slip text="Feb. 1870: Mississippi back in the Union" x={1000} y={900} size={50} rot={-2} at={t.at('Mississippi')} />
      <Tag text={SRC.print} />
    </AbsoluteFill>
  );
};

const Revels: React.FC = () => (
  <Photo src={REVELS} size={[2545, 3000]} fx={1400} fy={1281} z0={1.03} z1={1.12} a={S_REVELS} b={S_ALONE} mask={MASKS.revels} traceAt={t.at('Hiram') + 2}>
    {() => (
      <>
        <Slip text="Hiram Revels" x={1090} y={140} size={62} at={t.at('Hiram')} coral />
        <Slip text="sworn in: Feb. 25, 1870" x={1110} y={255} size={52} rot={2} at={t.at('sworn in')} />
        <Slip text="born free, North Carolina" x={1090} y={360} size={52} at={t.at('born free')} />
        <Slip text="minister · teacher" x={1120} y={465} size={52} rot={2} at={t.at('a minister')} />
        <Slip text="chaplain, Black Union soldiers" x={1080} y={570} size={52} at={t.at('chaplain')} />
        <Tag text={SRC.revels} />
      </>
    )}
  </Photo>
);

// ------------------------------------------------------------------------------------------ 2 · about 2,000
const Count: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <Ticks x={1010} y={190} cols={50} rows={40} cw={16} ch={17.5} from={t.at('about')} to={t.end('office')} />
    <div style={{position: 'absolute', left: 1006, top: 908, fontFamily: JF.mono, fontSize: 21, letterSpacing: 2, color: 'rgba(244,239,230,0.6)'}}>EACH MARK: ONE BLACK OFFICEHOLDER, 1867–77</div>
    <Stamp text="≈ 2,000" x={140} y={200} size={180} color={CREAM} at={t.at('2,000')} />
    <Slip text="Black men in public office" x={150} y={450} size={56} at={t.at('held public office')} />
    <Slip text="sheriffs" x={190} y={600} size={60} rot={-4} at={t.at('Sheriffs')} />
    <Slip text="mayors" x={420} y={680} size={60} rot={3} at={t.at('Mayors')} />
    <Slip text="judges" x={250} y={780} size={60} rot={-2} at={t.at('Judges')} />
    <Sfx at={t.at('2,000')} src="sfx/stamp.wav" volume={0.32} />
    <Tag text={SRC.count} />
  </AbsoluteFill>
);

/** State lawmakers: Caldwell's name on the convention roll (ch03). */
const Roll: React.FC = () => (
  <DocShot src={ROLL} size={ROLL_S} seed="roll" tag={SRC.roll} focusAt={S_ROLL}
    keys={[[S_ROLL, {x: 760, y: 2215, z: 1.02}], [t.at('Charles Caldwell') - 3, {x: 470, y: 2214, z: 1.42}], [S_SEATS, {x: 440, y: 2214, z: 1.5}]]}
    over={<>
      <Slip text="state lawmakers" x={140} y={150} size={60} at={S_ROLL + 3} />
      <Slip text="Charles Caldwell, the blacksmith" x={300} y={790} size={56} rot={2} at={t.at('Charles Caldwell') + 4} coral />
    </>}>
    <Swipe lines={[ROLL_CALDWELL]} from={t.at('Charles Caldwell')} to={t.end('Caldwell')} seed="cc" />
  </DocShot>
);

/** Sixteen in Congress: 14 House seats and two Senate seats; two of the sixteen in their portraits. */
const Congress: React.FC = () => {
  const g = useGFrame();
  const s16 = t.at('Sixteen'), sen = t.at('two senators');
  const lp = interpolate(g, [sen, sen + 6], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Seats cx={640} cy={860} r1={440} r2={300} outer={9} inner={7} at={(i) => s16 + 2 + i * 1.25} coral={[8, 15]} coralAt={sen} />
      <Stamp text="16" x={540} y={650} size={170} color={CREAM} at={s16} />
      <div style={{position: 'absolute', left: 520, top: 845, width: 240, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: 'rgba(244,239,230,0.75)',
        opacity: interpolate(g, [s16 + 10, s16 + 16], [0, 1], clamp)}}>IN CONGRESS</div>
      <div style={{position: 'absolute', left: 170, top: 920, fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: TEAL, opacity: lp}}>14 HOUSE</div>
      <div style={{position: 'absolute', left: 930, top: 920, fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: CORAL, opacity: lp}}>2 SENATE</div>
      <Print src="img/ch06/cr_lynch.png" size={[900, 1018]} x={1330} y={350} w={300} rot={-2} at={t.at('served in Congress')} />
      <Print src="img/ch06/cr_smalls.png" size={[900, 989]} x={1655} y={365} w={290} rot={2} at={t.at('Congress')} />
      <Slip text="John R. Lynch · Miss." x={1180} y={545} size={38} rot={-2} at={t.at('served in Congress') + 3} />
      <Slip text="Robert Smalls · S.C." x={1495} y={560} size={38} rot={2} at={t.at('Congress') + 3} />
      <Slip text="both from Mississippi" x={1130} y={720} size={58} rot={-2} at={t.at('both from Mississippi')} coral />
      <Sfx at={s16} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={sen} src="sfx/tick.wav" volume={0.4} />
      <Tag text={SRC.seats} />
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------------------------- 3 · the bottom rail
const POSTS = [640, 960, 1280];
const RX0 = 560, RX1 = 1360;
const SLOT = [520, 620, 720, 820];

/** A drawn post-and-rail fence; the bottom rail (coral) sits in the mud, then lifts to the top. */
const Rail: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pic = t.at('Picture a rail'), bottom = t.at('The bottom rail', 2), mud = t.at('mud'), top = t.at('Now it was on top');
  const lift = Easing.inOut(Easing.cubic)(interpolate(f, [top, top + 16], [0, 1], clamp));
  const hl = t.at('bottom rail');
  // the three other rails step down one slot as the bottom one rises over them
  const railY = (i: number) => (i === 3 ? SLOT[3] + (SLOT[0] - 100 - SLOT[3]) * lift + Math.sin(lift * Math.PI) * -30 : SLOT[i] + 100 * lift);
  const isCoral = g >= bottom;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Slip text="a phrase from the time" x={150} y={420} size={60} at={t.at('phrase') - 2} out={pic} />
      <Highlight text="BOTTOM RAIL ON TOP" x={100} y={112} size={84} at={hl} seed={61} rot={-2} />
      <Definition term="bottom rail on top" def="freedpeople's phrase: the bottom of society, now in charge" at={hl + 9} x={120} y={244} w={1300} />
      {g >= pic && (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {/* the ground, and the mud under the bottom rail */}
          <Stroke x1={RX0 - 120} y1={905} x2={RX1 + 120} y2={905} at={pic} dur={6} color="rgba(244,239,230,0.45)" width={4} seed="gr" />
          {g >= mud && Array.from({length: 26}, (_, i) => {
            const x = RX0 - 60 + i * 36 + random(`mx${i}`) * 14;
            return <path key={i} d={`M${x},${905 - 2} q 9 ${-16 - random(`mh${i}`) * 26} 22 0`} fill="none" stroke="#7a6a55" strokeWidth={5} strokeLinecap="round"
              opacity={interpolate(g, [mud + i * 0.3, mud + 4 + i * 0.3], [0, 0.9], clamp) * (1 - lift)} />;
          })}
          {POSTS.map((x, i) => <Stroke key={x} x1={x} y1={450} x2={x} y2={925} at={pic + i * 2} dur={6} width={12} seed={`p${i}`} />)}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(0 ${railY(i) - SLOT[i]})`}>
              <Stroke x1={RX0} y1={SLOT[i]} x2={RX1} y2={SLOT[i] + (i % 2 ? 6 : -6)} at={pic + 6 + i * 2} dur={7} width={i === 3 && isCoral ? 18 : 12} seed={`r${i}`}
                color={i === 3 && isCoral ? CORAL : TEAL} />
            </g>
          ))}
        </svg>
      )}
      <Slip text="always in the mud" x={1400} y={790} size={50} rot={2} at={t.at('always')} out={top + 8} />
      <Slip text="now on top" x={1420} y={400} size={60} rot={-3} at={top + 10} coral />
      <Sfx at={hl} src="sfx/stamp.wav" volume={0.32} />
      <Sfx at={pic} src="sfx/marker_tick.wav" volume={0.22} />
      <Sfx at={top} src="sfx/whoosh.wav" volume={0.14} />
    </AbsoluteFill>
  );
};

/** The people who hated the idea: the broadside, windowed onto its title only, dimmed, labelled. */
const Vomit: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <WinS src={VOMIT} cx={585} cy={135} s={1.2} w={1240} h={300} x={340} y={250} r={-1.5} at={S_VOMIT} filter="grayscale(1) sepia(0.1) contrast(1.3) brightness(0.72)">
      <Swipe lines={[VOMIT_SUB]} from={t.at('cartoons')} to={t.end('idea')} seed="bv" />
    </WinS>
    <Slip text="a racist broadside, Virginia, c. 1867" x={500} y={630} size={56} rot={-2} at={S_VOMIT + 3} />
    <Slip text="the same phrase, as mockery" x={620} y={750} size={52} rot={2} at={t.at('hated the idea')} />
    <Sfx at={S_VOMIT} src="sfx/tick.wav" volume={0.4} />
    <Tag text={SRC.vomit} />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------- 4 · what they did, and taxes
const CW = 380, CH = 240, CX = [130, 560, 990, 1420];
const Did: React.FC = () => {
  const g = useGFrame();
  const tax = t.at('raised taxes');
  const dim = interpolate(g, [tax - 4, tax + 2], [1, 0.5], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Slip text="what the new governments did" x={130} y={130} size={58} at={S_DID + 4} />
      <LineCard x={CX[0]} y={320} w={CW} h={CH} at={t.at('built the first')} label="public schools" sub="THE SOUTH'S FIRST" dim={dim} rot={-1.5} />
      <LineCard x={CX[1]} y={330} w={CW} h={CH} at={t.at('hospitals')} label="hospitals · roads" dim={dim} rot={1} />
      <LineCard x={CX[2]} y={320} w={CW} h={CH} at={t.at('rebuilt')} label="railroads rebuilt" sub="WRECKED BY THE WAR" dim={dim} rot={-1} />
      <LineCard x={CX[3]} y={330} w={CW} h={CH} at={t.at('got rid')} label="Black Codes" sub="GONE" dim={dim} rot={1.5} />
      {g >= t.at('Black Codes') && <div style={{opacity: dim}}><Cross x={CX[3] + 70} y={360} w={CW - 140} h={CH - 80} at={t.at('Black Codes') + 4} /></div>}
      <LineCard x={560} y={640} w={CW} h={CH} at={tax} label="taxes raised" color={CORAL} rot={-1.5} />
      <LineCard x={990} y={650} w={CW} h={CH} at={t.at('some officials')} label="some corruption" sub="SOME OFFICIALS" color={CORAL} rot={1.5} />
      {['built the first', 'hospitals', 'rebuilt', 'got rid', 'raised taxes', 'some officials'].map((p) => <Sfx key={p} at={t.at(p)} src="sfx/tick.wav" volume={0.38} />)}
    </AbsoluteFill>
  );
};

/** The critics' "whole story": Nast's 1874 cover, windowed onto its date and its caption only. */
const Critics: React.FC = () => {
  const dim = 'grayscale(1) sepia(0.12) contrast(1.35) brightness(0.74)';
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WinS src={RULE} cx={1190} cy={645} s={0.95} w={860} h={110} x={180} y={190} r={-1.5} at={S_CRITICS} filter={dim} />
      <WinS src={RULE} cx={1000} cy={2735} s={1.05} w={1220} h={130} x={330} y={340} r={1} at={S_CRITICS + 3} filter={dim} />
      <Slip text="a racist cartoon, Harper's Weekly, 1874" x={420} y={520} size={54} rot={-2} at={S_CRITICS + 5} />
      <Slip text="then, and in history books for decades" x={300} y={660} size={52} rot={1.5} at={t.at('then and later')} />
      <Slip text="“the whole story”" x={760} y={790} size={64} rot={-2} at={t.at('whole story')} coral />
      <Sfx at={S_CRITICS} src="sfx/tick.wav" volume={0.4} />
      <Tag text={SRC.rule} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------- 5 · Tweed
const Tweed: React.FC = () => {
  const push = t.at('William Tweed') - 8;
  return (
    <DocShot src={TWEED} size={TWEED_S} seed="tweed" tag={SRC.tweed} filter={PRINT_F} focusAt={S_TWEED}
      keys={[[S_TWEED, {x: 1500, y: 1114, z: 0.62}], [push, {x: 1480, y: 1114, z: 0.67}], [push + 18, {x: 900, y: 1010, z: 1.05}], [S_BOARD, {x: 880, y: 1010, z: 1.12}]]}
      over={<>
        <Slip text="not just the South" x={150} y={150} size={58} at={t.at('wasn\'t a Southern')} out={push} />
        <Slip text="the 1870s: everywhere" x={1180} y={170} size={58} rot={2} at={t.at('everywhere')} out={push} />
        <Slip text="New York City" x={150} y={880} size={58} at={t.at('New York City')} out={push} />
        <Slip text="William “Boss” Tweed" x={980} y={150} size={60} at={t.at('Tweed')} coral />
        <Slip text="stole tens of millions" x={1000} y={850} size={58} rot={-2} at={t.at('stole tens')} />
      </>}>
      <Loop cx={615} cy={760} rx={175} ry={215} at={t.at('Tweed') + 2} width={7} seed={9} />
    </DocShot>
  );
};

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Moment key="m" />],
    [S_REVELS, <Revels key="r" />],
    [S_ALONE, <PhotoShot key="a" src={PRINT} size={PRINT_S} a={S_ALONE} b={S_COUNT} w={1330} tag={SRC.print} />],
    [S_COUNT, <Count key="c" />],
    [S_ROLL, <Roll key="roll" />],
    [S_SEATS, <Congress key="s" />],
    [S_RAIL, <Rail key="rail" />],
    [S_VOMIT, <Vomit key="v" />],
    [S_DID, <Did key="d" />],
    [S_CRITICS, <Critics key="cr" />],
    [S_TWEED, <Tweed key="tw" />],
    [S_BOARD, <SeriesBoard key="b" ch={6} from={S_BOARD} at={t.at('fit to govern')}
      cam={[[S_BOARD, 1170, 1760, 1.5], [t.at('fit to govern') + 40, 880, 1620, 1.15], [t.at('fit to govern') + 300, 880, 1620, 1.14]]}
      overlay={<Slip text="nobody said New Yorkers weren't fit to govern" x={700} y={905} size={52} rot={-2} at={t.at('Nobody said') + 4} coral />} />],
  ]);
  return (
    <>
      {scene}
      <Cuts />
      <Sfx at={t.at('Charles Caldwell')} src="sfx/marker_tick.wav" volume={0.22} />
      <Sfx at={t.at('cartoons')} src="sfx/marker_tick.wav" volume={0.22} />
    </>
  );
};

/** Music (MUSIC.md): the steady, hopeful-but-wary cue under the whole chapter; it lifts with the board after the last word. */
export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_bottom_rail.wav" lead={LEAD} music={[{src: 'music/g_world_outside.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
