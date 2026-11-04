// Chapter 8 · The Dominoes (+ the subscribe plug). Scene plan: script/SCENES.md "ch08" (the narration file is the truth: the
// paper is the Evening Star). Every cut lands 1 frame before the word that starts its idea; each scene sits in a
// <Sequence from={cut}> and gets its beats as t.at(...) - cut. The dominoes (fx/Dominoes) are one piece seen in several shots:
// its beats are passed relative to each shot, so a shot that starts after a tile was named shows it already named.
//   0:00  "King had a problem"            the empty desk, four tiles rise at "bigger"; COUNT THE DOMINOES
//   0:08  "Domino one: the insiders"      close on tile one, named and tipping
//   0:16  "Every share they unload"       the share certificate slides from the insider's hat to the buyer's
//   0:20  "Domino two: the crash"         close on tile two
//   0:28  "The longer the secret lasts"   certificates pile up
//   0:31  "Domino three: the bank"        tile three, Ralston on its face
//   0:34  "Remember the banker"           Ralston (coral) and his Bank of California
//   0:41  "a bank doesn't keep your money in a vault"  fx/BankVault: deposits, loans, the reserve; then the run
//   0:56  "That's called a bank run"      sil_bank_line + the {bank run} card
//   1:00  "Domino four: everyone else"    the whole row; businesses, mines, smaller banks
//   1:08  "Paychecks stop"                the banknotes, gone on "disappear"
//   1:11  "Does that sound far-fetched?"  the Panic of 1873 (Wall Street engravings); 1:18 the Stock Exchange shut, 10 DAYS
//   1:24  "the dominoes got taller"       the tiles grow
//   1:27  "beat the dealer"               the pocket watch: a race
//   1:31  "He left before dawn"           sil_dawn_ride, fast parallax; NOV. 10
//   1:37  "Janin's hotel"                 Janin's silhouette under the lamp, a clock spinning
//   1:42  "walked into Ralston's bank"    the bank; FRAUD
//   1:50  "one of King's own men"         Emmons; "wait a little?"
//   1:58  "Domino one, right there in the room"  the row, tile one wobbles (coral)
//   2:01  King's answer                   King coral, the quote word by word
//   2:08  "the story hit the papers"      Gold Hill and the New York Sun, NOV. 26, 1872
//   2:13  "One newspaper called it"       the Evening Star, the swipe on the exact words
//   2:19  "The dominoes stayed standing. For now."  the tiles stand back up and go still
//   2:22  the plug                        the still row, a small "subscribe ↓" note
//   2:32  "where did all that money go?"  the empty pouch; the two cousins
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch08_not_enough_money.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {Sheet, Slip, Swipe, type Box} from '../kit/vox';
import {maskRef} from '../kit/maskref';
import {Dominoes} from '../fx/Dominoes';
import {BankVault} from '../fx/BankVault';
import type {CamKey} from '../fx/desk/kit3d';
import {Lamp, Print, SilFigure, SyncQuote} from './ch08/parts';
import bankLine from '../../public/img/layers/sil/sil_bank_line/layers.json';
import dawnRide from '../../public/img/layers/sil/sil_dawn_ride/layers.json';
import kingMask from '../../public/img/masks/ch08_king.json';
import ralstonMask from '../../public/img/masks/ch08_ralston.json';
import swindle from '../../public/img/ch08/evening_star_1872-11-26_barefaced_swindle.json';

const N = words as Narration;
const TL8 = makeTimeline(N, 30);
// the music drops out just before King's line and comes back with the papers, still in step with the narration, so the cue's
// own stop lands between "Subscribe anyway." and "So where did all that money go?"
const DROP = TL8.at('There is not enough') - 5;
const BACK = TL8.at('On November 26th');
export const CH08_FRAMES = chapterFrames(N, LEAD);

type L = {size: number[]; glowLayer?: number};
const sz = (l: L) => l.size as [number, number];
const KING = maskRef('ch08_king', kingMask);
const RALSTON = maskRef('ch08_ralston', ralstonMask);
const TILE3 = 'img/ch08/ralston_tile_crop.jpg';

// ---------------------------------------------------------------- domino cameras (world: the row runs along x, faces to −x)
const XS = [-2.4, -0.8, 0.8, 2.4];
/** A detail on tile i: from the front-left, a little above, drifting in. */
const tileCam = (i: number, len: number): CamKey[] => [
  {f: 0, pos: [XS[i] - 4.6, 5.9, 5.6], look: [XS[i] + 0.55, 0.75, 0], fov: 30},
  {f: len, pos: [XS[i] - 4.2, 5.5, 5.1], look: [XS[i] + 0.6, 0.78, 0], fov: 30},
];
const WIDE: CamKey[] = [
  {f: 0, pos: [-8.6, 4.2, 9.9], look: [0.5, 1.5, 0], fov: 30},
  {f: 300, pos: [-7.8, 3.9, 9.0], look: [0.5, 1.55, 0], fov: 30},
];
const WIDE_TALL: CamKey[] = [
  {f: 0, pos: [-8.6, 3.9, 9.8], look: [0.5, 2.0, 0], fov: 30},
  {f: 200, pos: [-8.1, 3.7, 9.2], look: [0.5, 2.05, 0], fov: 30},
];
const LOW_TALL: CamKey[] = [
  {f: 0, pos: [-7.4, 1.6, 7.6], look: [0.8, 2.3, 0], fov: 32},
  {f: 320, pos: [-6.9, 1.5, 7.0], look: [0.8, 2.35, 0], fov: 32},
];

type S = {t: TL; a: number; b: number};
/** The four domino beats in chapter frames; each shot passes them relative to its own start. */
type DB = {rise: number; name: number[]; taller: number; reset: number};
const rel = (d: DB, a: number) => ({riseAt: d.rise - a, nameAt: d.name.map((x) => x - a), tallerAt: d.taller - a, resetAt: d.reset - a});

/** "King had a problem. And it was a lot bigger than one bad stock. Here's how it could have gone. Count the dominoes." */
const Opening: React.FC<S & {d: DB}> = ({t, a, b, d}) => (
  <AbsoluteFill>
    <Dominoes {...rel(d, a)} portrait={TILE3} cam={WIDE} />
    <Note text="King's problem…" x={150} y={150} size={66} rot={-4} at={t.at('problem') - a - 3} out={t.at('Count') - a - 2} />
    <Note text="bigger than one bad stock" x={190} y={250} size={56} rot={-3} at={t.at('bigger') - a - 3} out={t.at('Count') - a - 2} color="#ffffff" />
    <Highlight text="COUNT THE DOMINOES" x={150} y={130} size={92} at={t.at('Count') - a} seed={81} rot={-2} />
  </AbsoluteFill>
);

/** "Domino one: the insiders. Anyone who knows the truth sells their shares, fast, to people who don't." */
const TileOne: React.FC<S & {d: DB}> = ({t, a, b, d}) => (
  <AbsoluteFill>
    <Dominoes {...rel(d, a)} portrait={TILE3} cam={tileCam(0, b - a)} />
    <Highlight text="DOMINO 1" x={130} y={110} size={80} at={t.at('Domino one') - a + 2} seed={82} rot={-2} />
    <Note text="they know the truth…" x={1030} y={740} size={56} rot={-3} at={t.at('knows') - a - 3} />
    <Note text="…and sell, fast" x={1150} y={830} size={58} rot={-4} at={t.at('sells') - a - 3} color="#ffffff" />
  </AbsoluteFill>
);

/** "Every share they unload ends up with somebody who has no idea." The certificate passes from one hat to the other. */
const Unload: React.FC<S> = ({t, a}) => {
  const g = useGFrame();
  const go = t.at('unload') - a;
  const k = interpolate(g, [go, go + 14], [0, 1], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={960} y={560} r={700} a={0.12} />
      <Prop name="top_hat" x={190} y={420} w={330} at={1} />
      <Prop name="slouch_hat" x={1380} y={470} w={400} at={3} />
      <div style={{position: 'absolute', left: 230, top: 760, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: 'rgba(244,239,230,0.85)'}}>THE INSIDER</div>
      <div style={{position: 'absolute', left: 1370, top: 760, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: 'rgba(244,239,230,0.85)'}}>THE BUYER</div>
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${interpolate(k, [0, 1], [0, 1010])}px, ${-Math.sin(k * Math.PI) * 120}px) rotate(${-8 + k * 14}deg)`}}>
        <Prop name="share_certificate" x={420} y={240} w={300} at={2} coral trace />
      </div>
      <Note text="somebody with no idea" x={1040} y={830} size={60} rot={-3} at={t.at('somebody') - a - 3} />
    </AbsoluteFill>
  );
};

/** "Domino two: the crash. The news breaks, the shares are worth nothing, and whoever bought last is left holding paper." */
const TileTwo: React.FC<S & {d: DB}> = ({t, a, b, d}) => (
  <AbsoluteFill>
    <Dominoes {...rel(d, a)} portrait={TILE3} cam={tileCam(1, b - a)} />
    <Highlight text="DOMINO 2" x={130} y={110} size={80} at={t.at('Domino two') - a + 2} seed={83} rot={-2} />
    <Note text="shares worth $0" x={1120} y={740} size={60} rot={-3} at={t.at('worth nothing') - a - 3} />
    <Note text="the last buyer holds paper" x={1000} y={830} size={56} rot={-3} at={t.at('whoever') - a - 3} color="#ffffff" />
  </AbsoluteFill>
);

/** "The longer the secret lasts, the more people are holding it." Certificates pile up, one per beat. */
const Holding: React.FC<S> = ({t, a}) => {
  const at0 = t.at('longer') - a;
  const at1 = t.at('more people') - a;
  const spots: [number, number, number][] = [[620, 300, -8], [860, 280, 5], [740, 330, -2], [990, 320, 9], [520, 350, 4], [1110, 300, -6], [800, 360, 12]];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={900} y={560} r={650} a={0.14} />
      {spots.map(([x, y, r], i) => <Prop key={i} name="share_certificate" x={x} y={y} w={260} rot={r} at={(i < 3 ? at0 : at1) + (i % 3) * 5 + (i >= 3 ? (i - 3) * 2 : 0)} from="top"
        coral={i === spots.length - 1} trace={i === spots.length - 1} />)}
      <Note text="the longer the secret lasts…" x={150} y={150} size={60} rot={-3} at={at0 - 3} />
      <Note text="…the more people are stuck" x={860} y={830} size={60} rot={-3} at={at1 - 3} />
    </AbsoluteFill>
  );
};

/** "Domino three: the bank." Ralston on the tile's face. */
const TileThree: React.FC<S & {d: DB}> = ({t, a, b, d}) => (
  <AbsoluteFill>
    <Dominoes {...rel(d, a)} portrait={TILE3} cam={tileCam(2, b - a)} />
    <Highlight text="DOMINO 3" x={130} y={110} size={80} at={t.at('Domino three') - a + 2} seed={84} rot={-2} />
  </AbsoluteFill>
);

/** "Remember the banker, William Ralston? He was one of the company's biggest backers, and he ran the biggest bank in the West." */
const Ralston: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={560} y={520} r={560} a={0.12} />
    <Print src="img/ch02/ralston_william_harpending_plate_1913.jpg" size={[895, 1230]} mask={RALSTON} x={180} y={70} w={560} rot={-2} at={1}
      tag="Harpending, The Great Diamond Hoax, 1913" />
    <Print src="img/ch02/bank_of_california_lawrence_houseworth_c1867.jpg" x={930} y={480} w={760} h={430} rot={2} pos="50% 55%" at={t.at('ran the biggest') - a - 1}
      tag="Lawrence & Houseworth, c. 1867 · Library of Congress" />
    <Note text="William Ralston" x={900} y={130} size={70} rot={-4} at={t.at('William Ralston') - a - 3} />
    <Note text="one of the biggest backers" x={920} y={240} size={56} rot={-3} at={t.at('biggest backers') - a - 3} color="#ffffff" />
    <Note text="the biggest bank in the West" x={900} y={345} size={56} rot={-3} at={t.at('biggest bank') - a - 3} />
  </AbsoluteFill>
);

const VAULT_CAM: CamKey[] = [
  {f: 0, pos: [0.4, 5.6, 18.6], look: [0.6, 1.6, 0], fov: 30},
  {f: 260, pos: [0.3, 5.0, 16.6], look: [0.6, 1.6, 0], fov: 30},
];
const RUN_CAM: CamKey[] = [
  {f: 0, pos: [-4.9, 3.6, 13.2], look: [-3.3, 1.2, 0.4], fov: 30},
  {f: 200, pos: [-3.7, 3.2, 11.6], look: [-2.6, 1.2, 0.4], fov: 30},
];

/** "Now, a bank doesn't keep your money in a vault. It lends most of it out. That works fine, as long as..." */
const Vault: React.FC<S & {v: {dep: number; loan: number; run: number; empty: number}}> = ({t, a, b, v}) => (
  <AbsoluteFill>
    <BankVault depositAt={v.dep - a} loanAt={v.loan - a} runAt={v.run - a} emptyAt={v.empty - a} cam={VAULT_CAM} />
    <Note text="not sitting in a vault" x={150} y={120} size={60} rot={-3} at={t.at("doesn't keep") - a - 3} />
    <Note text="most of it lent out →" x={1040} y={130} size={56} rot={-3} at={t.at('lends') - a - 3} />
    <Note text="fine… unless everyone comes at once" x={250} y={835} size={56} rot={-2} at={t.at('as long as') - a - 3} color="#ffffff" />
  </AbsoluteFill>
);

/** "But if people hear the bank's boss just lost a fortune on a fake diamond field, they all come on the same day." */
const Run: React.FC<S & {v: {dep: number; loan: number; run: number; empty: number}}> = ({t, a, v}) => (
  <AbsoluteFill>
    <BankVault depositAt={v.dep - a} loanAt={v.loan - a} runAt={v.run - a} emptyAt={v.empty - a} cam={RUN_CAM} />
    <Note text="the boss lost a fortune?" x={140} y={835} size={60} rot={-3} at={t.at('hear') - a - 3} />
    <Note text="everyone, the same day" x={1000} y={835} size={60} rot={-3} at={t.at('they all come') - a - 3} color="#ffffff" />
  </AbsoluteFill>
);

/** "That's called a bank run. Almost no bank survives one." */
const BankRun: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_bank_line" size={sz(bankLine)} glowLayer={(bankLine as L).glowLayer} a={0} b={b - a + 8} cam={{z: [1.06, 1.16], x: [20, -20], y: [0, -10]}} />
    <Highlight text="BANK RUN" x={140} y={120} size={110} at={t.at('bank run') - a} seed={85} rot={-2} />
    <Definition term="bank run" def="everybody wants their money back at once, and the bank runs out" at={t.at('bank run') - a + 9} x={150} y={300} w={1000} />
    <Slip text="almost no bank survives one" x={150} y={880} size={56} rot={-2} at={t.at('Almost') - a - 3} />
  </AbsoluteFill>
);

/** "Domino four: everyone else. When the West's biggest bank goes down, it takes businesses, mines and smaller banks down with it." */
const TileFour: React.FC<S & {d: DB}> = ({t, a, b, d}) => (
  <AbsoluteFill>
    <Dominoes {...rel(d, a)} portrait={TILE3} cam={[{f: 0, pos: [-8.0, 3.9, 9.2], look: [0.9, 1.5, 0], fov: 30}, {f: b - a, pos: [-7.4, 3.6, 8.5], look: [1.0, 1.55, 0], fov: 30}]} />
    <Highlight text="DOMINO 4" x={130} y={110} size={80} at={t.at('Domino four') - a + 2} seed={86} rot={-2} />
    <Note text="businesses" x={1330} y={130} size={62} rot={-4} at={t.at('businesses') - a - 3} />
    <Note text="mines" x={1430} y={230} size={62} rot={-3} at={t.at('mines') - a - 3} />
    <Note text="smaller banks" x={1300} y={330} size={62} rot={-4} at={t.at('smaller banks') - a - 3} />
  </AbsoluteFill>
);

/** "Paychecks stop. Savings disappear." */
const Paychecks: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={960} y={520} r={600} a={0.14} />
    <Prop name="banknotes_stack" x={600} y={330} w={720} at={1} out={t.at('disappear') - a + 2} coral trace from="top" />
    <Note text="paychecks stop" x={180} y={160} size={70} rot={-4} at={t.at('Paychecks') - a - 3} />
    <Note text="savings disappear" x={1060} y={815} size={70} rot={-3} at={t.at('Savings') - a - 3} color="#ffffff" />
  </AbsoluteFill>
);

/** "Does that sound far-fetched? The very next year, one big bank in New York went under after bad railroad bets." */
const Panic: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch08/panic_1873_nassau_broad_wall_street_crowd.jpg" x={150} y={140} w={640} h={700} rot={-2} pos="50% 45%" at={1}
      tag="Wall Street, 1873 · Library of Congress" />
    <Print src="img/ch08/panic_1873_jay_cooke_office_wall_street.jpg" x={1000} y={150} w={600} h={600} rot={2} pos="50% 40%" at={t.at('one big bank') - a - 1}
      tag="Wall Street, 1873 · Library of Congress" />
    <Highlight text="1873" x={830} y={100} size={110} at={t.at('next year') - a} seed={87} rot={-3} />
    <Note text="the very next year" x={820} y={835} size={58} rot={-3} at={t.at('very next') - a - 3} out={t.at('one big bank') - a + 2} />
    <Note text="Jay Cooke & Co.: gone under" x={900} y={835} size={54} rot={-3} at={t.at('went under') - a - 3} />
  </AbsoluteFill>
);

/** "The panic was so bad, the New York Stock Exchange shut down for ten days." */
const Exchange: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch08/panic_1873_closing_stock_exchange_doors.jpg" x={240} y={90} w={640} h={820} rot={-2} pos="50% 55%" at={1}
      tag="Frank Leslie's, 1873 · Library of Congress" />
    <Note text="the Stock Exchange" x={1040} y={230} size={66} rot={-4} at={t.at('Stock Exchange') - a - 3} />
    <Note text="doors shut" x={1100} y={340} size={66} rot={-3} at={t.at('shut down') - a - 3} color="#ffffff" />
    <Stamp text="10 DAYS" x={1000} y={500} at={t.at('ten days') - a} size={150} color="#FF9F1C" rot={-4} />
  </AbsoluteFill>
);

/** "So every day the secret held, the dominoes got taller." */
const Taller: React.FC<S & {d: DB}> = ({t, a, b, d}) => (
  <AbsoluteFill>
    <Dominoes {...rel(d, a)} showLabels portrait={TILE3} cam={[{f: 0, pos: [-8.6, 3.0, 9.6], look: [0.6, 1.8, 0], fov: 30}, {f: b - a + 30, pos: [-9.4, 3.6, 10.6], look: [0.6, 2.2, 0], fov: 30}]} />
    <Note text="every day the secret held…" x={150} y={130} size={60} rot={-3} at={t.at('every day') - a - 3} />
    <Highlight text="TALLER" x={1300} y={120} size={100} at={t.at('taller') - a} seed={88} rot={-3} />
  </AbsoluteFill>
);

/** "And King had to beat the dealer who wanted a head start." A race against the clock. */
const Race: React.FC<S> = ({t, a}) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f * 0.21) * 3;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={960} y={520} r={560} a={0.16} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `rotate(${sway}deg)`, transformOrigin: '960px 140px'}}>
        <Prop name="pocket_watch" x={700} y={260} w={500} at={1} coral trace from="top" />
      </div>
      <Highlight text="A RACE" x={140} y={120} size={100} at={t.at('beat') - a} seed={89} rot={-3} />
      <Note text="King: warn everybody" x={140} y={825} size={58} rot={-3} at={t.at('And King had') - a - 3} />
      <Note text="the dealer: a head start" x={1040} y={825} size={56} rot={-3} at={t.at('dealer') - a - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** "He left before dawn, rode about 45 miles to a train station, and got to San Francisco on November 10th." */
const Ride: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_dawn_ride" size={sz(dawnRide)} glowLayer={(dawnRide as L).glowLayer} a={0} b={b - a + 6} cam={{z: [1.12, 1.34], x: [-170, 170], y: [6, -16]}} flicker={0.2} />
    <Slip text="before dawn" x={150} y={140} size={62} rot={-3} at={t.at('before dawn') - a - 3} />
    <Slip text="about 45 miles to the train" x={170} y={260} size={56} rot={-2} at={t.at('45 miles') - a - 3} />
    <Stamp text="NOV. 10" x={1250} y={790} at={t.at('November') - a} size={140} color="#FF9F1C" rot={-4} />
    <Slip text="San Francisco" x={1260} y={680} size={56} rot={-3} at={t.at('San Francisco') - a - 3} />
  </AbsoluteFill>
);

/** A small drawn clock (teal) whose hands spin: a whole night passing. */
const SpinClock: React.FC<{x: number; y: number; r: number; at: number}> = ({x, y, r, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = g - at;
  const minute = k * 24;
  const hour = k * 2;
  const hand = (deg: number, len: number, wdt: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return <line x1={x} y1={y} x2={x + Math.cos(rad) * len} y2={y + Math.sin(rad) * len} stroke="#2FE0C4" strokeWidth={wdt} strokeLinecap="round" />;
  };
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: Math.min(1, k / 5)}}>
      <circle cx={x} cy={y} r={r} fill="rgba(10,10,8,0.55)" stroke="#2FE0C4" strokeWidth={6} />
      {Array.from({length: 12}, (_, i) => {
        const rad = (i / 12) * Math.PI * 2;
        return <line key={i} x1={x + Math.cos(rad) * r * 0.82} y1={y + Math.sin(rad) * r * 0.82} x2={x + Math.cos(rad) * r * 0.94} y2={y + Math.sin(rad) * r * 0.94} stroke="#2FE0C4" strokeWidth={4} />;
      })}
      {hand(300 + hour, r * 0.5, 8)}
      {hand(minute, r * 0.78, 5)}
      <circle cx={x} cy={y} r={8} fill="#2FE0C4" />
    </svg>
  );
};

/** "He spent that whole night at Janin's hotel, convincing Janin he'd been fooled." */
const Janin: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <SilFigure name="sil_janin" x={330} y={170} h={720} at={1} />
    <SpinClock x={1380} y={430} r={190} at={t.at('whole night') - a - 2} />
    <Note text="all night" x={1220} y={130} size={70} rot={-4} at={t.at('whole night') - a - 3} />
    <Note text="“you've been fooled”" x={960} y={790} size={64} rot={-3} at={t.at('convincing') - a - 3} color="#ffffff" />
  </AbsoluteFill>
);

/** "The next morning, he walked into Ralston's bank and read his report to the company's directors. The diamond field... was a fraud." */
const Report: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch02/bank_of_california_lawrence_houseworth_c1867.jpg" x={130} y={170} w={860} h={640} rot={-1.5} pos="50% 50%" at={1}
      tag="Lawrence & Houseworth, c. 1867 · Library of Congress" />
    <Note text="the next morning" x={1090} y={160} size={62} rot={-4} at={t.at('next morning') - a - 3} />
    <Note text="Ralston's bank" x={1120} y={270} size={62} rot={-3} at={t.at("Ralston's bank") - a - 3} color="#ffffff" />
    <Note text="report to the directors" x={1080} y={380} size={56} rot={-3} at={t.at('read his report') - a - 3} />
    <Stamp text="FRAUD" x={1100} y={560} at={t.at('fraud') - a} size={180} color="#FF6F61" rot={-6} />
  </AbsoluteFill>
);

/** "According to one of King's own men, a director suggested King might wait a little before he went public. Long enough for a few people to sell." */
const Director: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch08/emmons_samuel_franklin_c1870.jpg" x={200} y={110} w={500} h={760} rot={-2} pos="50% 30%" at={1}
      tag="Samuel F. Emmons · Library of Congress" />
    <Note text="one of King's own men" x={860} y={150} size={62} rot={-3} at={t.at("King's own") - a - 3} />
    <Note text="a director: “wait a little?”" x={840} y={330} size={60} rot={-4} at={t.at('wait') - a - 3} color="#ffffff" />
    <Note text="…long enough for a few to sell" x={820} y={510} size={56} rot={-3} at={t.at('Long enough') - a - 3} />
  </AbsoluteFill>
);

/** "Domino one, right there in the room." The row again, tile one wobbles, coral. */
const InTheRoom: React.FC<S & {d: DB}> = ({t, a, b, d}) => (
  <AbsoluteFill>
    <Dominoes {...rel(d, a)} showLabels portrait={TILE3} coral={0} wobbleAt={[{tile: 0, at: t.at('Domino one', 2) - a + 4}]}
      cam={[{f: 0, pos: [-8.0, 3.2, 9.0], look: [-0.6, 2.0, 0], fov: 30}, {f: b - a, pos: [-7.4, 3.0, 8.3], look: [-0.7, 2.05, 0], fov: 30}]} />
    <Note text="domino one, right there in the room" x={140} y={130} size={64} rot={-3} at={t.at('Domino one', 2) - a - 3} />
  </AbsoluteFill>
);

/** King's answer, word by word. */
const Answer: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={420} y={540} r={520} a={0.12} />
    <Print src="img/ch07/king_clarence_age27_c1869.jpg" size={[923, 1536]} mask={KING} x={130} y={60} w={520} rot={-2} at={1} out={1e7}
      tag="Clarence King, c. 1869 · Library of Congress" />
    <Note text="King's answer" x={760} y={110} size={62} rot={-3} at={t.at("King's answer") - a - 3} />
    <SyncQuote t={t} a={a} phrase="There is not enough money in the Bank of California to make me delay the publication a single hour." x={760} y={250} w={1020} size={64}
      who="Clarence King, Nov. 1872 · as Samuel Emmons remembered it" whoAt={t.at('single hour') - a + 10} />
  </AbsoluteFill>
);

/** "On November 26th, 1872, the story hit the papers." */
const Papers: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch08/gold_hill_news_1872-11-26_great_diamond_hoax.jpg" x={180} y={80} w={520} h={720} rot={-2} pos="50% 10%" at={1}
      tag="Gold Hill Daily News, Nov. 26, 1872 · Library of Congress" tagW={560} />
    <Print src="img/ch08/ny_sun_1872-11-26_salted_jewel_fields.jpg" x={790} y={150} w={560} h={600} rot={2} pos="50% 0%" at={t.at('story') - a - 1}
      tag="The Sun (New York), Nov. 26, 1872 · Library of Congress" tagW={600} />
    <Stamp text="NOV. 26, 1872" x={1060} y={850} at={t.at('26th') - a} size={110} color="#FF9F1C" rot={-3} />
    <Note text="the papers" x={1430} y={240} size={66} rot={-4} at={t.at('hit the papers') - a - 3} />
  </AbsoluteFill>
);

/** "One newspaper called it 'one of the most gigantic and barefaced swindles ever perpetrated.'" The Evening Star, swiped. */
const Swindle: React.FC<S> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const lines = (swindle as {phrases: Record<string, number[][]>}).phrases['the most gigantic and barefaced swindles ever perpetrated'] as Box[];
  // "one of" sits just before the first box on its line: start the swipe a little left of it
  const L: Box[] = [[lines[0][0] - 112, lines[0][1], lines[0][2] + 112, lines[0][3]], lines[1], lines[2]];
  const z = interpolate(f, [0, b - a], [1.18, 1.36], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src="img/ch08/evening_star_1872-11-26_barefaced_swindle.jpg" size={[1030, 604]} cam={{x: 520, y: 430, z, tilt: 8, dof: 2.2, dofY: 470, band: 110}} seed="es">
        <Swipe lines={L} from={t.at('one of the most') - a - 1} to={t.end('ever perpetrated') - a} seed="es" />
      </Sheet>
      <Tag text="Evening Star (Washington), Nov. 26, 1872 · Library of Congress" x={110} y={990} />
    </AbsoluteFill>
  );
};

/** "The dominoes stayed standing. For now." + the plug: the still row and a small "subscribe ↓". */
const Standing: React.FC<S & {d: DB; cam: CamKey[]; plug?: boolean}> = ({t, a, d, cam, plug}) => (
  <AbsoluteFill>
    <Dominoes {...rel(d, a)} showLabels portrait={TILE3} cam={cam} />
    {!plug && <Highlight text="FOR NOW." x={1320} y={130} size={96} at={t.at('For now') - a} seed={90} rot={-3} />}
    {plug && <Note text="subscribe ↓" x={1360} y={850} size={58} rot={-4} at={t.at('hit subscribe') - a - 1} />}
  </AbsoluteFill>
);

/** "So where did all that money go? And what happened to the two cousins?" The pouch, empty; the cousins. */
const WhereWent: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={960} y={560} r={560} a={0.14} />
    <Prop name="leather_pouch" x={770} y={430} w={380} at={1} coral trace from="top" />
    <Note text="empty" x={1150} y={430} size={62} rot={-6} at={6} />
    <Note text="where did it go?" x={720} y={160} size={70} rot={-3} at={t.at('where did') - a - 3} />
    <SilFigure name="sil_arnold" x={170} y={300} h={560} at={t.at('two cousins') - a - 1} label={false} />
    <SilFigure name="sil_slack" x={1530} y={300} h={560} at={t.at('two cousins') - a + 2} flip label={false} />
    <div style={{position: 'absolute', left: 130, top: 900, width: 1660, display: 'flex', justifyContent: 'space-between', fontFamily: JF.mono, fontSize: 18, letterSpacing: 1.5,
      color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 6px rgba(0,0,0,0.9)', opacity: useGFrame() >= t.at('two cousins') - a + 4 ? 1 : 0}}>
      <span>PHILIP ARNOLD · NO RELIABLE PHOTO</span><span>JOHN SLACK · NO RELIABLE PHOTO</span>
    </div>
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const d: DB = {rise: at('bigger') + 2, name: [at('insiders'), at('crash'), at('the bank'), at('everyone else')], taller: at('taller') - 2, reset: at('For now')};
  const v = {dep: at('Now a bank') + 2, loan: at('That works') - 4, run: at('hear') - 4, empty: at('they all come') - 6};
  const c = {
    one: at('Domino one') - 1, unload: at('Every share') - 1, two: at('Domino two') - 1, hold: at('The longer') - 1, three: at('Domino three') - 1,
    ralston: at('Remember the banker') - 1, vault: at('Now a bank') - 1, run: at('But if people') - 1, def: at("That's called") - 1, four: at('Domino four') - 1,
    pay: at('Paychecks') - 1, panic: at('Does that sound') - 1, exch: at('The panic was') - 1, taller: at('So every day') - 1, race: at('And King had') - 1,
    ride: at('He left before') - 1, janin: at('He spent') - 1, report: at('The next morning') - 1, dir: at('According to') - 1, room: at('Domino one', 2) - 1,
    answer: at("King's answer") - 1, papers: at('On November', 2) - 1, swindle: at('One newspaper') - 1, stand: at('The dominoes stayed') - 1, plug: at('Quick favor') - 1,
    went: at('So where did') - 1,
  };
  const END = Math.ceil(N.duration * 30) + 60;
  const seq = (from: number, node: React.ReactNode): [number, React.ReactNode] => [from, <Sequence from={from} layout="none">{node}</Sequence>];
  const cuts: [number, React.ReactNode][] = [
    seq(0, <Opening t={t} a={0} b={c.one} d={d} />),
    seq(c.one, <TileOne t={t} a={c.one} b={c.unload} d={d} />),
    seq(c.unload, <Unload t={t} a={c.unload} b={c.two} />),
    seq(c.two, <TileTwo t={t} a={c.two} b={c.hold} d={d} />),
    seq(c.hold, <Holding t={t} a={c.hold} b={c.three} />),
    seq(c.three, <TileThree t={t} a={c.three} b={c.ralston} d={d} />),
    seq(c.ralston, <Ralston t={t} a={c.ralston} b={c.vault} />),
    seq(c.vault, <Vault t={t} a={c.vault} b={c.run} v={v} />),
    seq(c.run, <Run t={t} a={c.run} b={c.def} v={v} />),
    seq(c.def, <BankRun t={t} a={c.def} b={c.four} />),
    seq(c.four, <TileFour t={t} a={c.four} b={c.pay} d={d} />),
    seq(c.pay, <Paychecks t={t} a={c.pay} b={c.panic} />),
    seq(c.panic, <Panic t={t} a={c.panic} b={c.exch} />),
    seq(c.exch, <Exchange t={t} a={c.exch} b={c.taller} />),
    seq(c.taller, <Taller t={t} a={c.taller} b={c.race} d={d} />),
    seq(c.race, <Race t={t} a={c.race} b={c.ride} />),
    seq(c.ride, <Ride t={t} a={c.ride} b={c.janin} />),
    seq(c.janin, <Janin t={t} a={c.janin} b={c.report} />),
    seq(c.report, <Report t={t} a={c.report} b={c.dir} />),
    seq(c.dir, <Director t={t} a={c.dir} b={c.room} />),
    seq(c.room, <InTheRoom t={t} a={c.room} b={c.answer} d={d} />),
    seq(c.answer, <Answer t={t} a={c.answer} b={c.papers} />),
    seq(c.papers, <Papers t={t} a={c.papers} b={c.swindle} />),
    seq(c.swindle, <Swindle t={t} a={c.swindle} b={c.stand} />),
    seq(c.stand, <Standing t={t} a={c.stand} b={c.plug} d={d} cam={WIDE_TALL} />),
    seq(c.plug, <Standing t={t} a={c.plug} b={c.went} d={d} cam={LOW_TALL} plug />),
    seq(c.went, <WhereWent t={t} a={c.went} b={END} />),
  ];
  const scene = useScene(cuts);
  const notes = ['problem', 'bigger', 'knows', 'sells', 'somebody', 'worth nothing', 'whoever', 'longer', 'more people', 'William Ralston',
    'biggest backers', 'biggest bank', "doesn't keep", 'lends', 'as long as', 'hear', 'they all come', 'businesses', 'mines', 'smaller banks', 'Paychecks', 'Savings',
    'very next', 'went under', 'Stock Exchange', 'shut down', 'every day', 'And King had', 'dealer', 'whole night', 'convincing',
    'next morning', "Ralston's bank", 'read his report', "King's own", 'wait', 'Long enough', "King's answer", 'hit the papers', 'where did'];
  const titles = ['Count', 'next year', 'bank run', 'taller', 'beat', 'For now'];
  const stamps = ['ten days', 'November', 'fraud', '26th'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f]) => <Sfx key={f} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {notes.map((p) => <Sfx key={p} at={at(p) - 5} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('Domino one', 2) - 5} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at('hit subscribe') - 3} src={WRITE.src} volume={WRITE.volume} />
      {[...titles, 'Domino one', 'Domino two', 'Domino three', 'Domino four'].map((p) => <Sfx key={p} at={at(p) + (p.startsWith('Domino') ? 2 : 0)} src="sfx/stamp.wav" volume={0.27} />)}
      {stamps.map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.32} />)}
      {/* the tiles: a tick as each one tips; the papers land */}
      {d.name.map((f, i) => <Sfx key={`n${i}`} at={f + 2} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('Domino one', 2) + 4} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={c.papers} src="sfx/paper_rustle.wav" volume={0.3} />
      {[0, 12, 24, 36, 48, 60, 72, 84].map((k) => <Sfx key={`w${k}`} at={c.race + 2 + k} src="sfx/tick_soft.wav" volume={0.3} />)}
    </>
  );
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_not_enough_money.wav" lead={LEAD} music={[{src: 'music/dh_dominoes.mp3', volume: bed('dh_dominoes'), to: DROP, fadeOut: 5}, {src: 'music/dh_dominoes.mp3', volume: bed('dh_dominoes'), from: BACK, startFrom: BACK}]}>
    <Body />
  </ChapterShell>
);
