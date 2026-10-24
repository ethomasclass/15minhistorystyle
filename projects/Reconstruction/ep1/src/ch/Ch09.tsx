// Chapter 9 · "Swing Around the Circle": the deadline (the fall election), Memphis and New Orleans (plain: buildings and
// crowds, no tint, no marks on the victims), the papers, Johnson's tour (Nast's "Andy's Trip"), the Cleveland heckling in
// three clippings that disagree about who said "hang Thad Stevens", Stevens, the kindest version, the election (seats of
// the 40th Congress against the two-thirds line), and the board.
// Sources: Harper's Weekly, May 26 and Aug. 25, 1866; Nast, "Andy's Trip", Harper's Weekly, Oct. 27, 1866; Cleveland
// Morning Leader, Mar. 13, 1865; New-York Tribune and Worcester Daily Spy, Sept. 5, 1866; Philadelphia Evening Telegraph,
// Sept. 10, 1866 (all Library of Congress); Thaddeus Stevens, Brady-Handy (LOC).
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch09_swing_circle.words.json';
import {clamp} from '../lib/anim';
import {DarkPaper, Sfx} from '../kit/common';
import {EpBoard} from '../kit/ep1board';
import {Highlight, JF, Tag, useGFrame} from '../kit/Kit';
import {type Box, CORAL, cut, DOC_F, DocShot, PRINT_F, Slip, Spot, Swipe, TEAL} from '../kit/rc';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, Stamp, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH09_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------------------------------------------- sources
const MEM = 'img/ch09/scenes_in_memphis_riot_harpers_may1866.jpg';
const MEM_S: [number, number] = [2406, 3000];
/** the top engraving only ("burning a freedmen's school-house"): the bottom one shows the killing and stays dark */
const MEM_TOP: Box = [546, 804, 1318, 840];
const NOLA = 'img/ch09/new_orleans_riot_procession_harpers_aug1866.jpg';
const NOLA_S: [number, number] = [2383, 3000];
const TRIP = 'img/ch09/andys_trip_nast_harpers_oct1866.jpg';
const TRIP_S: [number, number] = [3000, 2251];
const LEADER = 'img/ch04/johnson_inauguration_drunk_editorial_cleveland_leader_13mar1865.jpg';
const LEADER_S: [number, number] = [805, 3000];
const L_DRUNK: Box = [172, 256, 528, 30];                 // "himself, drunk, before the Senate of the"
const TRIB = 'img/ch09/johnson_cleveland_speech_ny_tribune_5sep1866.jpg';
const TRIB_S: [number, number] = [1789, 3000];
const T_HANG: Box[] = [[392, 2503, 178, 28], [680, 2503, 220, 28]];   // "Hang Jeff. Davis!" … "Hang Jeff. Davis," he says
const T_THAD: Box = [338, 2557, 735, 28];                 // [A voice—"Hang Thad Stevens and Wendell Phillips."]
const T_REPLY: Box = [338, 2584, 507, 28];                // Hang Jeff. Davis! Why don't you hang him.
const SPY = 'img/ch09/johnson_cleveland_speech_worcester_spy_5sep1866.jpg';
const SPY_THAD: Box[] = [[440, 220, 205, 24], [90, 243, 312, 23]];   // (A voice—"Hang Thad. / Stevens and Wendell Phillips.")
const TEL = 'img/ch09/johnson_why_not_hang_thad_stevens_evening_telegraph_10sep1866.jpg';
const TEL_S: [number, number] = [1053, 514];
const TEL_WHY: Box = [410, 245, 517, 31];                 // —'Why not hang Thad. Stevens
const STEVENS = 'img/ch05/thaddeus_stevens_brady_handy.jpg';

const SRC = {
  mem: "Harper's Weekly, May 26, 1866 (sketch by A. R. Waud) · Library of Congress",
  nola: "Harper's Weekly, Aug. 25, 1866 (sketch by T. R. Davis) · Library of Congress",
  trip: "Thomas Nast, \"Andy's Trip,\" Harper's Weekly, Oct. 27, 1866 · Library of Congress",
  leader: 'Cleveland Morning Leader, Mar. 13, 1865 · Library of Congress',
  trib: 'New-York Tribune, Sept. 5, 1866 · Library of Congress',
  two: 'Worcester Daily Spy, Sept. 5, 1866 · Evening Telegraph (Philadelphia), Sept. 10, 1866 · Library of Congress',
  tel: 'Evening Telegraph (Philadelphia), Sept. 10, 1866 · Library of Congress',
  stevens: 'Thaddeus Stevens, Brady-Handy studio · Library of Congress',
  seats: 'Party divisions, 40th Congress (1867-69) · Office of the House Historian; U.S. Senate Historical Office',
};

// ------------------------------------------------------------------------------------------------------- the shots
const S_MEM = cut(t, 'And in the South'), S_NOLA = cut(t, 'In July'), S_PAPERS = cut(t, 'Northern newspapers'), S_TRIP = cut(t, "Johnson's answer");
const S_AGAIN = cut(t, 'Once again'), S_CLEV = cut(t, 'In Cleveland'), S_TWO = cut(t, 'Newspapers printed'), S_TEL = cut(t, 'but in several');
const S_STEV = cut(t, "That's Thaddeus"), S_KIND = cut(t, 'Even in the kindest'), S_VOTE = cut(t, 'In November'), S_BOARD = cut(t, 'So back to the question');

const Cuts: React.FC = () => <>{[S_MEM, S_NOLA, S_PAPERS, S_TRIP, S_AGAIN, S_CLEV, S_TWO, S_TEL, S_STEV, S_KIND, S_VOTE].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.2} />)}</>;

/** Seconds of narration (for comments): t.at(...) / 30. */

// ------------------------------------------------------------------------------------------- 1 · the deadline
const MONTHS = ['MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV'];
const TL_X0 = 260, TL_X1 = 1660, TL_Y = 560;
const mx = (i: number) => TL_X0 + ((TL_X1 - TL_X0) * i) / (MONTHS.length - 1);

const Deadline: React.FC = () => {
  const g = useGFrame();
  const draw = interpolate(g, [4, 24], [0, 1], clamp);
  const pts = Array.from({length: 40}, (_, i) => `${i ? 'L' : 'M'}${TL_X0 - 30 + ((TL_X1 - TL_X0 + 60) * i) / 39},${TL_Y + (random(`tl${i}`) - 0.5) * 5}`).join(' ');
  const pinAt = t.at('deadline');
  const k = interpolate(g, [pinAt, pinAt + 3, pinAt + 6], [0, 1.25, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d={pts} fill="none" stroke={TEAL} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        {MONTHS.map((m, i) => g >= 6 + i * 3 && <line key={m} x1={mx(i)} y1={TL_Y - 22} x2={mx(i)} y2={TL_Y + 22} stroke={TEAL} strokeWidth={6} strokeLinecap="round" />)}
        {g >= pinAt && <circle cx={mx(6)} cy={TL_Y} r={30 * k} fill="none" stroke={CORAL} strokeWidth={8} />}
      </svg>
      {MONTHS.map((m, i) => g >= 6 + i * 3 && (
        <div key={m} style={{position: 'absolute', left: mx(i) - 80, width: 160, top: TL_Y + 44, textAlign: 'center', fontFamily: JF.mono, fontSize: 30, letterSpacing: 2,
          color: i === 6 && g >= pinAt ? CORAL : 'rgba(244,239,230,0.85)'}}>{m}</div>
      ))}
      <div style={{position: 'absolute', left: TL_X0 - 40, top: TL_Y + 100, fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: 'rgba(244,239,230,0.55)', opacity: interpolate(g, [10, 16], [0, 1], clamp)}}>1866</div>
      <Slip text="summer 1866" x={mx(2) - 170} y={350} size={64} at={t.at('summer')} />
      <Slip text="the deadline" x={mx(6) - 250} y={340} size={60} rot={2} at={pinAt} coral />
      <Slip text="election: a new Congress" x={mx(6) - 540} y={720} size={58} rot={-2} at={t.at('election')} />
      <Sfx at={pinAt} src="sfx/tick.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------- 2 · Memphis, New Orleans (plain)
/** The Harper's cover: masthead, then the top engraving (the school-house burning), held. The page steps aside for the
 *  number; everything but the top engraving dims. */
const Memphis: React.FC = () => (
  <DocShot src={MEM} size={MEM_S} seed="mem" tag={SRC.mem} filter={PRINT_F} focusAt={S_MEM}
    keys={[[S_MEM, {x: 1270, y: 520, z: 1.12}], [t.at('Memphis') - 30, {x: 1265, y: 560, z: 1.15}], [t.at('attacked') - 4, {x: 1205, y: 1230, z: 0.95}], [t.at('In three days') - 6, {x: 1205, y: 1230, z: 0.98}],
      [t.at('46') - 2, {x: 880, y: 1230, z: 0.86}], [S_NOLA, {x: 870, y: 1230, z: 0.88}]]}
    over={<>
      <Slip text="Memphis, Tennessee · May 1866" x={140} y={135} size={54} at={t.at('Memphis')} />
      <Stamp text="46" x={190} y={430} size={190} color="#EDE7DC" at={t.at('46')} />
      <Slip text="killed in three days" x={150} y={660} size={52} rot={-2} at={t.at('killed')} />
    </>}>
    <Spot size={MEM_S} boxes={[MEM_TOP]} at={t.at('In three days')} dark={0.72} id="memspot" />
  </DocShot>
);

const NewOrleans: React.FC = () => (
  <DocShot src={NOLA} size={NOLA_S} seed="nola" tag={SRC.nola} filter={PRINT_F} focusAt={S_NOLA}
    keys={[[S_NOLA, {x: 1243, y: 820, z: 1.02}], [S_PAPERS, {x: 1243, y: 860, z: 1.08}]]}
    over={<Slip text="New Orleans · July 30, 1866" x={140} y={135} size={54} at={t.at('New Orleans')} />} />
);

/** A torn window onto part of a page (centred on page px cx, cy at scale s), with children drawn in page px. */
const WinS: React.FC<{src: string; cx: number; cy: number; s: number; w: number; h: number; x: number; y: number; r?: number; at: number; children?: React.ReactNode}> = ({
  src, cx, cy, s, w, h, x, y, r = 0, at, children,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 3, at + 6], [1.15, 0.98, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${r}deg) scale(${k})`, opacity: interpolate(f, [at, at + 2], [0, 1], clamp),
      filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.7))'}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#ddd6c6', clipPath: 'polygon(0 2%, 100% 0, 99% 97%, 1% 100%)'}}>
        <div style={{position: 'absolute', left: w / 2 - cx * s, top: h / 2 - cy * s, transform: `scale(${s})`, transformOrigin: '0 0'}}>
          <Img src={staticFile(src)} style={{display: 'block', filter: DOC_F}} />
          {children}
        </div>
      </div>
    </div>
  );
};

/** Northern papers covered both: the two Harper's pages, side by side. */
const Papers: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <WinS src={MEM} cx={1270} cy={480} s={0.5} w={800} h={300} x={110} y={210} r={-2} at={S_PAPERS} />
    <WinS src={NOLA} cx={1240} cy={530} s={0.55} w={800} h={300} x={1010} y={250} r={1.5} at={t.at('covered') - 1} />
    <Slip text="May 26, 1866" x={330} y={560} size={54} at={S_PAPERS + 4} />
    <Slip text="Aug. 25, 1866" x={1240} y={600} size={54} rot={2} at={t.at('covered')} />
    <Slip text="read across the North, before November" x={450} y={780} size={58} rot={-2} at={t.at('Northern voters')} />
    <Sfx at={S_PAPERS} src="sfx/tick.wav" volume={0.4} />
    <Sfx at={t.at('covered') - 1} src="sfx/tick.wav" volume={0.4} />
    <Tag text="Harper's Weekly, May 26 and Aug. 25, 1866 · Library of Congress" />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------------ 3 · the tour
/** Nast's "Andy's Trip": the spread, then Johnson in the middle, then the crowd with its signs (top left). */
const Trip: React.FC = () => {
  const g = useGFrame();
  const sw = t.at('Swing'), heckle = t.at('Crowds heckled');
  return (
    <DocShot src={TRIP} size={TRIP_S} seed="trip" tag={SRC.trip} filter={PRINT_F} focusAt={S_TRIP}
      keys={[[S_TRIP, {x: 1500, y: 1125, z: 0.62}], [heckle - 8, {x: 1500, y: 1125, z: 0.68}], [heckle + 12, {x: 380, y: 560, z: 1.55}], [S_AGAIN, {x: 390, y: 570, z: 1.62}]]}
      over={<>
        <Slip text="New York · Cleveland · Chicago · St. Louis" x={300} y={880} size={50} at={t.at('across the North')} out={sw - 8} />
        {g < heckle && <Highlight text="SWING AROUND THE CIRCLE" x={110} y={116} size={78} at={sw} seed={91} rot={-2} />}
        {g < heckle && <Definition term="Swing Around the Circle" def="Johnson's speaking tour of the North, Aug.–Sept. 1866" at={sw + 9} x={120} y={840} />}
        <Slip text="he heckled back" x={1180} y={330} size={60} at={t.at('heckled them back')} coral />
      </>} />
  );
};

/** Once again: the Cleveland Leader on the inauguration, a year and a half before (ch04). */
const Again: React.FC = () => (
  <DocShot src={LEADER} size={LEADER_S} seed="leader" tag={SRC.leader} focusAt={S_AGAIN}
    keys={[[S_AGAIN, {x: 430, y: 240, z: 1.45}], [S_CLEV, {x: 450, y: 268, z: 1.6}]]}
    over={<Slip text="March 1865, again" x={1180} y={760} size={58} rot={-2} at={t.at('Once again') + 4} />}>
    <Swipe lines={[L_DRUNK]} from={t.at('lose control')} to={t.end('public')} seed="ld" />
  </DocShot>
);

// ----------------------------------------------------------------------------------------- 4 · Cleveland
/** The verbatim transcript: the headline, then the crowd's shouts. */
const Cleveland: React.FC = () => (
  <DocShot src={TRIB} size={TRIB_S} seed="trib" tag={SRC.trib} focusAt={S_CLEV}
    keys={[[S_CLEV, {x: 760, y: 560, z: 0.95}], [t.at('shouting') - 8, {x: 640, y: 2510, z: 1.5}], [S_TWO, {x: 660, y: 2515, z: 1.55}]]}
    over={<Slip text="Cleveland · Sept. 3, 1866" x={1220} y={135} size={54} at={t.at('Cleveland')} />}>
    <Swipe lines={T_HANG} from={t.at('shouting')} to={t.end('hanging people')} seed="th" />
  </DocShot>
);

/** Different versions: a heckler says it in one paper, Johnson in another. */
const TwoVersions: React.FC = () => (
  <AbsoluteFill>
    <DarkPaper />
    <WinS src={SPY} cx={368} cy={242} s={1.38} w={820} h={280} x={100} y={300} r={-1.5} at={S_TWO}>
      <Swipe lines={SPY_THAD} from={t.at('different versions')} to={t.end('versions') + 8} seed="v1" />
    </WinS>
    <WinS src={TEL} cx={660} cy={262} s={1.4} w={820} h={280} x={1000} y={330} r={1.5} at={S_TWO + 3}>
      <Swipe lines={[TEL_WHY]} from={t.at('who said what')} to={t.end('what') + 6} seed="v2" />
    </WinS>
    <Slip text="Worcester Spy: a voice in the crowd" x={130} y={640} size={50} at={t.at('different versions')} />
    <Slip text="Phila. Telegraph: Johnson" x={1120} y={670} size={50} rot={2} at={t.at('who said what')} />
    <Sfx at={S_TWO} src="sfx/tick.wav" volume={0.4} />
    <Sfx at={S_TWO + 3} src="sfx/tick.wav" volume={0.35} />
    <Tag text={SRC.two} />
  </AbsoluteFill>
);

/** In several of them, Johnson shot back. */
const Telegraph: React.FC = () => (
  <DocShot src={TEL} size={TEL_S} seed="tel" tag={SRC.tel} focusAt={S_TEL}
    keys={[[S_TEL, {x: 520, y: 262, z: 1.6}], [t.at('why not'), {x: 640, y: 262, z: 1.85}], [S_STEV, {x: 700, y: 262, z: 1.95}]]}>
    <Swipe lines={[TEL_WHY]} from={t.at('why not')} to={t.end('Thad Stevens')} seed="tw" />
  </DocShot>
);

const Stevens: React.FC = () => (
  <Photo src={STEVENS} size={[2323, 3000]} fx={1100} fy={1330} z0={1.25} z1={1.3} a={S_STEV} b={S_KIND} mask={MASKS.stevens} traceAt={t.at('Thaddeus') + 2}>
    {() => (
      <>
        <Slip text="Thaddeus Stevens" x={1180} y={240} size={62} at={t.at('Thaddeus')} coral />
        <Slip text="the land plan" x={1260} y={390} size={58} rot={2} at={t.at('land plan')} />
        <Tag text={SRC.stevens} />
      </>
    )}
  </Photo>
);

/** The kindest version: the transcript, where a heckler says it and Johnson answers with hanging talk of his own. */
const Kindest: React.FC = () => (
  <DocShot src={TRIB} size={TRIB_S} seed="trib" tag={SRC.trib}
    keys={[[S_KIND, {x: 700, y: 2560, z: 1.55}], [S_VOTE, {x: 720, y: 2572, z: 1.65}]]}
    over={<>
      <Slip text="the transcript: a heckler…" x={330} y={300} size={56} at={t.at('kindest version')} />
      <Slip text="…and the President" x={470} y={720} size={56} rot={2} at={t.at('sitting president')} coral />
    </>}>
    <Spot size={TRIB_S} boxes={[T_THAD, T_REPLY]} at={S_KIND + 6} dark={0.6} id="kspot" />
    <Swipe lines={[T_THAD]} from={t.at('kindest version')} to={t.end('version') + 8} seed="k1" />
    <Swipe lines={[T_REPLY]} from={t.at('trading hanging')} to={t.end('talk') + 4} seed="k2" />
  </DocShot>
);

// ------------------------------------------------------------------------------------------- 5 · the election
// Seats of the 40th Congress (elected 1866-67, sat 1867-69), as the House and Senate historians list them:
//   House: 226 seats, 173 Republicans, 47 Democrats, 6 others (incl. 2 vacancies)  (history.house.gov, Party Divisions)
//   Senate: 68 seats, 57 Republicans, 9 Democrats, 2 vacant  (senate.gov/history/partydiv.htm)
// Both totals include the Southern seats filled as states were readmitted in 1868.
const SEATS = [
  {label: 'HOUSE', r: 173, of: 226},
  {label: 'SENATE', r: 57, of: 68},
];
const BX = 380, BW = 1280, BH = 96;
const Vote: React.FC = () => {
  const g = useGFrame();
  const grow = t.at('Republicans');
  const line = t.at('two-thirds');
  const lp = interpolate(g, [line, line + 10], [0, 1], clamp);
  const x23 = BX + (BW * 2) / 3;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Slip text="Nov. 1866: the voters answer" x={130} y={140} size={60} at={S_VOTE + 2} />
      {SEATS.map((s, i) => {
        const y = 330 + i * 250;
        const show = interpolate(g, [grow - 6 + i * 4, grow + i * 4], [0, 1], clamp);
        const p = interpolate(g, [grow + i * 6, grow + 18 + i * 6], [0, 1], clamp);
        const rw = (BW * s.r) / s.of;
        return (
          <React.Fragment key={s.label}>
            <div style={{position: 'absolute', left: BX - 230, top: y + 28, width: 200, textAlign: 'right', fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color: '#f4efe6', opacity: show}}>{s.label}</div>
            <div style={{position: 'absolute', left: BX, top: y, width: BW, height: BH, background: 'rgba(237,231,220,0.16)', border: '3px solid rgba(237,231,220,0.45)', boxSizing: 'border-box', opacity: show}} />
            <div style={{position: 'absolute', left: BX, top: y, width: rw * p, height: BH, background: CORAL}} />
            {p >= 1 && <div style={{position: 'absolute', left: BX + 22, top: y + 12, fontFamily: JF.display, fontSize: 58, color: '#111', whiteSpace: 'nowrap'}}>{s.r} Republicans</div>}
            {p >= 1 && <div style={{position: 'absolute', left: BX + rw + 18, top: y + 30, fontFamily: JF.mono, fontSize: 28, letterSpacing: 1, color: '#f4efe6', whiteSpace: 'nowrap'}}>of {s.of}</div>}
          </React.Fragment>
        );
      })}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={x23} y1={290} x2={x23} y2={290 + 390 * lp} stroke={TEAL} strokeWidth={6} strokeDasharray="16 12" strokeLinecap="round" />
      </svg>
      <Slip text="two-thirds" x={x23 - 140} y={190} size={54} at={line} />
      <Slip text="enough to override any veto" x={760} y={760} size={64} rot={-2} at={t.at('Enough to override')} coral />
      <Sfx at={line} src="sfx/marker_tick.wav" volume={0.25} />
      <Sfx at={grow} src="sfx/tick.wav" volume={0.35} />
      <Tag text={SRC.seats} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const scene = useScene([
    [0, <Deadline key="d" />],
    [S_MEM, <Memphis key="m" />],
    [S_NOLA, <NewOrleans key="n" />],
    [S_PAPERS, <Papers key="p" />],
    [S_TRIP, <Trip key="t" />],
    [S_AGAIN, <Again key="a" />],
    [S_CLEV, <Cleveland key="c" />],
    [S_TWO, <TwoVersions key="v" />],
    [S_TEL, <Telegraph key="tel" />],
    [S_STEV, <Stevens key="s" />],
    [S_KIND, <Kindest key="k" />],
    [S_VOTE, <Vote key="vote" />],
    [S_BOARD, <EpBoard key="b" ch={9} from={S_BOARD} at={t.at('Congress does')} />],
  ]);
  return (
    <>
      {scene}
      <Cuts />
      <Sfx at={t.at('Swing')} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={t.at('46')} src="sfx/stamp.wav" volume={0.27} />
      {[t.at('lose control'), t.at('shouting'), t.at('why not'), t.at('kindest version'), t.at('trading hanging')].map((f) => <Sfx key={f} at={f} src="sfx/marker_tick.wav" volume={0.22} />)}
    </>
  );
};

/** Music (MUSIC.md): the grieving bed for Memphis and New Orleans, handing over to the campaign cue as Johnson hits the
 *  road (j_campaign has two seconds of silence at its head, skipped). */
const HAND = S_TRIP;
export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_swing_circle.wav" lead={LEAD}
    music={[{src: 'music/w_aftermath.mp3', volume: 0.12, to: HAND + 6}, {src: 'music/j_campaign.mp3', volume: 0.15, from: HAND - 12, startFrom: 60}]}>
    <Body />
  </ChapterShell>
);
