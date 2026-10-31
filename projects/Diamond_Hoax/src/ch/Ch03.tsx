// Chapter 3 · Everybody Wants a Diamond Mine (87 s). Scene plan: script/SCENES.md "ch03"; build brief: script/BUILD_BRIEF.md.
// Every cut lands 1 frame before the word that starts its idea; each scene sits in a <Sequence from={cut}> so its beats are
// passed relative to the cut (t.at(...) - a). No Con Card in this chapter (no move is named).
//   0:00  "Because he wanted to." Ralston, coral, a slow push
//   0:02  "Ralston had helped make a fortune on Nevada silver" the Comstock cut-away, 1876
//   0:08  "Diamonds had just turned up in South Africa" Kimberley, 1872 (Holub)
//   0:11  "So why not here?" the blank West again, a coral glint
//   0:13  "Quick money note" the exchange-rate card: $1 then, 27 silver dollars now
//   0:22  "Then the cousins came back" a bigger bag; $16 million money tag
//   0:30  "A local jeweler" the loupe and the diamond: "reportedly"; REAL
//   0:36  "That's the trick" Arnold (silhouette), the bookkeeper
//   0:40  "which use cheap, flawed diamonds" the diamond-drill crown, push into the tips
//   0:47  "So Ralston and his partners bought in" Ralston, the banknotes, $3 million
//   0:55  "A claim is your legal right" four stakes hammered in around a square; vocab card
//   1:01  "That's where staking a claim comes from" the 1872 claim notice, "beginning at a stake" swiped
//   1:06  "they'd need a lot more stones" the bag, a few stones, the money for a trip
//   1:11  "To London" the money map, San Francisco → London, "fake names"; $500,000
//   1:17  "Low-grade stuff. Rejects." the stones drop into the bag
//   1:20  "Now they had plenty of stones" the map again, the bag sets off toward New York
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch03_everybody_wants_a_diamond_mine.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Ember, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, Stamp, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {Sheet, Slip, Swipe, type Box} from '../kit/vox';
import {MoneyTag} from '../fx/ColdOpenDepth';
import {MoneyMap, moneyCam} from '../fx/MoneyMap';
import {CoinStack, Figure, LampPool, Print, RalstonCut, RALSTON_TAG, WEST_ASPECT, WestMap, westPoint} from './ch02/parts';
import claimJson from '../../public/img/ch03/white_pine_news_1872-11-09_claim_notice_beginning_at_a_stake.json';

const N = words as Narration;
const TL3 = makeTimeline(N, 30);
// the bag's cue picks up where ch 2 left it and hands to the con's theme as the jeweler's "yes" lands; the waltz is saved for Tiffany
const THEY_WERE = TL3.at('And they were');
/** The theme comes in here; startFrom lands its last chord (3450 frames into the cue) just after "treasure". */
const THEME = THEY_WERE - 30;
const THEME_START = 3450 - (TL3.at('treasure') + 28 - THEME);
export const CH03_FRAMES = chapterFrames(N, LEAD);

const CLAIM = 'img/ch03/white_pine_news_1872-11-09_claim_notice_beginning_at_a_stake.jpg';
const CLAIM_SIZE = claimJson.size as [number, number];
const STAKE_LINE = claimJson.phrases['beginning at a stake'] as Box[];

/** A slow push on the whole shot (one camera move per shot). */
const Push: React.FC<{z?: [number, number]; dur: number; ox?: number; oy?: number; children: React.ReactNode}> = ({z = [1, 1.05], dur, ox = 960, oy = 540, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{transform: `scale(${interpolate(f, [0, dur], z, clamp)})`, transformOrigin: `${ox}px ${oy}px`}}>{children}</AbsoluteFill>;
};

/** MoneyTag kept on one line: it is absolutely placed, so near the right edge it would wrap; a wide nowrap box gives it room. */
const Money: React.FC<{at: number; big: string; small: string; x: number; y: number}> = (p) => (
  <div style={{position: 'absolute', left: p.x - 1000, top: 0, width: 2000, height: 1080, whiteSpace: 'nowrap', pointerEvents: 'none'}}>
    <MoneyTag {...p} x={1000} />
  </div>
);

/** "Because he wanted to." */
const Wanted: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <LampPool x={760} y={520} r={600} a={0.12} />
    <Push dur={80} z={[1, 1.08]} ox={760} oy={420}>
      <RalstonCut x={400} y={130} h={800} at={-10} traceAt={-4} />
    </Push>
    <Note text="he wanted to" x={1240} y={420} size={70} rot={-4} at={t.at('wanted') - a - 2} />
    <Tag text={RALSTON_TAG} />
  </AbsoluteFill>
);

/** "Ralston had helped make a fortune on Nevada silver, and men like him were always hunting for the next big strike." */
const Silver: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Push dur={200} z={[1, 1.06]} ox={1000} oy={560}>
      <Print src="img/ch03/comstock_mining_cutaway_lecount_1876.jpg" x={500} y={200} w={1040} h={720} rot={-1.5} pos="50% 50%" at={-2}
        tag="Mining on the Comstock, 1876 · Library of Congress" />
    </Push>
    <Highlight text="NEVADA SILVER" x={130} y={110} size={92} at={t.at('Nevada') - a} seed={301} rot={-2} />
    <Note text="a fortune" x={140} y={330} size={60} rot={-4} at={t.at('fortune') - a - 2} />
    <Slip text="the next big strike" x={1080} y={800} at={t.at('next big strike') - a - 2} rot={-3} size={56} />
  </AbsoluteFill>
);

/** "Diamonds had just turned up in South Africa." */
const Africa: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Push dur={110} z={[1, 1.05]} ox={980} oy={520}>
      <Print src="img/ch03/kimberley_kopje_holub_1872.jpg" x={560} y={170} w={920} h={760} rot={1.5} pos="50% 40%" zoom={1.08} at={-2}
        tag="Holub, Seven Years in South Africa, 1881" />
    </Push>
    <Highlight text="SOUTH AFRICA" x={120} y={110} size={92} at={t.at('South Africa') - a} seed={302} rot={-2} />
    <Note text="diamonds!" x={140} y={330} size={66} rot={-5} at={t.at('Diamonds') - a} />
  </AbsoluteFill>
);

const MAP_H = 800;
const MAP_BOX: [number, number, number, number] = [780, 150, Math.round(MAP_H * WEST_ASPECT), MAP_H];

/** "So why not here?" */
const WhyNot: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const [gx, gy] = westPoint(MAP_BOX, -108.6, 40.9);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WestMap box={MAP_BOX} at={-3} cam={[[0, 1, gx, gy], [60, 1.08, gx, gy]]}>
        <Ember x={gx} y={gy} at={t.at('here') - a - 4} size={0.7} />
        <Tag text="Map drawn for the series · Natural Earth coastlines" x={MAP_BOX[0] + 30} y={MAP_BOX[1] + MAP_H + 18} />
      </WestMap>
      <Note text="why not here?" x={140} y={300} size={70} rot={-4} at={t.at('why not') - a - 2} />
    </AbsoluteFill>
  );
};

/** A big figure in Abril with a small mono line under it (the left side of the exchange-rate card). */
const Big: React.FC<{x: number; y: number; at: number; big: string; small: string; color?: string}> = ({x, y, at, big, small, color = '#F4EFE6'}) => {
  const g = useGFrame();
  if (g < at) return null;
  const s = interpolate(g, [at, at + 5, at + 9], [1.35, 0.95, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translateX(-50%) scale(${s})`, textAlign: 'center', transformOrigin: '50% 60%'}}>
      <div style={{fontFamily: JF.display, fontSize: 150, lineHeight: 1, color, textShadow: '0 6px 24px rgba(0,0,0,0.85)'}}>{big}</div>
      <div style={{fontFamily: JF.mono, fontSize: 30, color: '#F4EFE6', opacity: 0.85, marginTop: 10, letterSpacing: 2, textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>{small}</div>
    </div>
  );
};

/** "Quick money note. A dollar back then was worth about 27 of today's dollars. So from here on, every number is in today's money." */
const MoneyNote: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  const n27 = t.at('27') - a;
  const shown = Math.min(27, Math.max(0, Math.floor((g - n27) / 2.5) + 1));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <LampPool x={960} y={600} r={760} a={0.12} />
      <Highlight text="QUICK MONEY NOTE" x={130} y={110} size={88} at={t.at('Quick') - a} seed={303} rot={-2} />
      <Big x={500} y={290} at={t.at('A dollar') - a - 1} big="$1" small="BACK THEN (1872)" />
      <CoinStack x={410} y={700} n={1} at={t.at('A dollar') - a + 2} per={1} cols={1} w={180} />
      {g >= n27 - 4 && <div style={{position: 'absolute', left: 735, top: 470, fontFamily: JF.display, fontSize: 150, color: pal.mark,
        opacity: interpolate(g, [n27 - 4, n27], [0, 1], clamp)}}>≈</div>}
      <Big x={1310} y={290} at={n27} big={`$${Math.max(1, shown)}`} small="TODAY" color="#FF9F1C" />
      <CoinStack x={1000} y={700} n={27} at={n27} per={9} cols={3} w={180} />
      <Note text="every number: today's money" x={560} y={830} size={56} rot={-3} at={t.at('every number') - a - 2} />
    </AbsoluteFill>
  );
};

/** "Then the cousins came back from another secret trip with a bigger bag, which they said was worth about 16 million dollars." */
const BiggerBag: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const grow = t.at('bigger bag') - a;
  const s = interpolate(f, [grow - 2, grow + 8], [0.55, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) * (1 - 2.4 * x * (1 - x))});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <LampPool x={560} y={620} r={640} a={0.15} />
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: '540px 840px'}}>
        <Prop name="leather_pouch" x={200} y={300} w={660} at={-4} coral trace from="top" />
      </AbsoluteFill>
      <Note text="another secret trip" x={140} y={160} size={58} rot={-4} at={t.at('secret trip') - a - 2} />
      <Note text="a bigger bag" x={960} y={180} size={64} rot={-4} at={grow - 2} />
      <Money at={t.at('16 million') - a} big="$16 million" small="$600,000 in 1872" x={1300} y={370} />
      <Note text="they said" x={1180} y={640} size={60} rot={-4} color="#FF9F1C" at={t.at('they said') - a - 2} />
    </AbsoluteFill>
  );
};

/** "A local jeweler reportedly took a look and said yes, these are real. And they were." */
const Jeweler: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <LampPool x={900} y={560} r={620} a={0.17} />
    <Push dur={180} z={[1, 1.06]} ox={880} oy={600}>
      <Prop name="rough_diamond" x={560} y={500} w={330} at={-2} coral trace from="none" />
      <Prop name="jeweler_loupe" x={930} y={250} w={330} rot={-12} at={t.at('took a look') - a - 2} from="top" />
    </Push>
    <Note text="a local jeweler" x={140} y={180} size={60} rot={-4} at={t.at('jeweler') - a - 2} />
    <Note text="reportedly" x={150} y={300} size={58} rot={-3} color="#FF9F1C" at={t.at('reportedly') - a - 2} />
    <Highlight text="REAL" x={1380} y={240} size={130} at={t.at('real') - a} seed={304} rot={-4} />
    <Note text="and they were" x={1330} y={460} size={62} rot={-4} at={t.at('they were') - a - 2} />
  </AbsoluteFill>
);

const FIG_FEET = 940;

/** "That's the trick. Arnold had worked as a bookkeeper at a company that made diamond drills," */
const Trick: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <LampPool x={560} y={600} r={560} a={0.14} />
    <Push dur={150} z={[1, 1.04]} ox={560} oy={640}>
      <Figure who="arnold" x={560} y={FIG_FEET} h={680} at={-4} label="Philip Arnold · no reliable photo" />
    </Push>
    <Highlight text="THE TRICK" x={1040} y={150} size={110} at={t.at('trick') - a} seed={305} rot={-3} />
    <Note text="a bookkeeper" x={1040} y={420} size={64} rot={-4} at={t.at('bookkeeper') - a - 2} />
    <Note text="at a diamond-drill maker" x={1040} y={560} size={56} rot={-3} at={t.at('diamond drills') - a - 2} />
  </AbsoluteFill>
);

/** "which use cheap, flawed diamonds as cutting tips. He knew exactly where to find a diamond nobody wanted." */
const Drill: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const tips = t.at('cutting tips') - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <LampPool x={760} y={600} r={620} a={0.16} />
      <Push dur={b - a} z={[1, 1.16]} ox={840} oy={850}>
        <Prop name="diamond_drill_bit" x={580} y={240} w={520} at={-2} trace from="top" />
        <Loop cx={840} cy={845} rx={290} ry={62} at={tips - 2} dur={10} width={6} seed={306} tilt={-1} />
      </Push>
      <Note text="cheap, flawed diamonds" x={1190} y={560} size={50} rot={-4} at={t.at('cheap') - a - 2} />
      <Arrow x1={1250} y1={660} x2={1130} y2={830} bow={30} at={tips} />
      <Note text="nobody wanted these" x={1190} y={300} size={52} rot={-3} at={t.at('nobody wanted') - a - 2} />
      <Highlight text="DIAMOND DRILL" x={130} y={110} size={84} at={t.at('which use') - a + 2} seed={307} rot={-2} />
    </AbsoluteFill>
  );
};

/** "So Ralston and his partners bought in. They agreed to pay the cousins nearly three million dollars for a piece of their claim." */
const BoughtIn: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const pay = t.at('pay') - a;
  const dx = interpolate(f, [pay, pay + 30], [0, 300], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <LampPool x={960} y={600} r={760} a={0.12} />
      <RalstonCut x={150} y={210} h={700} at={-4} traceAt={-2} tint={false} />
      <AbsoluteFill style={{transform: `translateX(${dx}px)`}}>
        <Prop name="banknotes_stack" x={720} y={620} w={400} at={t.at('bought in') - a - 2} rot={-4} from="top" />
      </AbsoluteFill>
      <Prop name="leather_pouch" x={1470} y={590} w={290} at={-2} coral from="none" />
      <Highlight text="BOUGHT IN" x={820} y={120} size={96} at={t.at('bought in') - a} seed={308} rot={-2} />
      <Money at={t.at('three million') - a} big="$3 million" small="$100,000 in 1872" x={1290} y={290} />
      <Note text="for a piece of their claim" x={780} y={848} size={52} rot={-3} at={t.at('piece of their claim') - a - 2} />
      <Tag text={RALSTON_TAG} />
    </AbsoluteFill>
  );
};

// the claim square on the desk, in screen px: back-left, back-right, front-right, front-left
const SQ = [[720, 480], [1200, 480], [1390, 790], [530, 790]];
// claim_stake_full: a full cut-out of the claim_stake source (the shared claim_stake.webp kept only the paper notice)
const STAKE_W = [64, 64, 86, 86];
const STAKE_AR = 1600 / 342;
const RING = [...SQ, SQ[0]];
const SEG = RING.slice(1).map(([x, y], i) => Math.hypot(x - RING[i][0], y - RING[i][1]));
const PERIM = SEG.reduce((s, d) => s + d, 0);
/** The square's outline drawn on up to fraction p of its perimeter, as polyline points. */
const partial = (p: number) => {
  let left = p * PERIM;
  const pts = [RING[0]];
  for (let i = 0; i < SEG.length && left > 0; i++) {
    const u = Math.min(1, left / SEG[i]);
    pts.push([RING[i][0] + (RING[i + 1][0] - RING[i][0]) * u, RING[i][1] + (RING[i + 1][1] - RING[i][1]) * u]);
    left -= SEG[i];
  }
  return pts.map(([x, y]) => `${x},${y}`).join(' ');
};

/** "A claim is your legal right to dig in a patch of ground. You hammer wooden stakes into the corners and post your name." */
const Claim: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  const draw = t.at('patch of ground') - a;
  const p = interpolate(g, [draw, draw + 12], [0, 1], clamp);
  const hits = ['hammer', 'wooden', 'stakes', 'into'].map((w) => t.at(w) - a - 1);
  const poly = SQ.map(([x, y]) => `${x},${y}`).join(' ') + ` ${SQ[0][0]},${SQ[0][1]}`;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <LampPool x={960} y={600} r={700} a={0.14} />
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        <defs>
          <pattern id="c3hatch" width={22} height={22} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1={0} y1={0} x2={0} y2={22} stroke="#FF6F61" strokeWidth={5} />
          </pattern>
        </defs>
        {g >= draw && <polygon points={poly} fill="url(#c3hatch)" opacity={0.32 * p} />}
        {g >= draw && <polyline points={partial(p)} fill="none" stroke={pal.mark} strokeWidth={5} strokeDasharray="18 14" strokeLinejoin="round" />}
      </svg>
      {SQ.map(([x, y], i) => {
        const w = STAKE_W[i];
        const h = w * STAKE_AR;
        return <Prop key={i} name="claim_stake_full" x={x - w / 2} y={y - h + 10} w={w} at={hits[i]} from="top" z={i >= 2 ? 2 : 1} />;
      })}
      <Highlight text="A CLAIM" x={130} y={110} size={96} at={t.at('A claim') - a} seed={309} rot={-2} />
      <Definition term="claim" def="your legal right to dig in a patch of ground" at={t.at('A claim') - a + 8} x={140} y={870} w={1300} />
      <Note text="your name here" x={1330} y={230} size={56} rot={-4} at={t.at('post your name') - a - 2} />
      <Arrow x1={1500} y1={330} x2={1425} y2={500} bow={-30} at={t.at('post your name') - a + 6} />
    </AbsoluteFill>
  );
};

/** "That's where 'staking a claim' comes from." The real thing: a White Pine County claim notice, Nov 1872. */
const Notice: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const [bx, by, bw] = STAKE_LINE[0];
  const cx = bx + bw / 2, cy = by + 12;
  const z = interpolate(f, [0, 100], [1.15, 1.55], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  const sx = interpolate(f, [0, 100], [CLAIM_SIZE[0] / 2, cx], clamp);
  const sy = interpolate(f, [0, 100], [CLAIM_SIZE[1] / 2 - 40, cy], clamp);
  const from = t.at('staking') - a + 2;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={CLAIM} size={CLAIM_SIZE} cam={{x: sx, y: sy, z, tilt: 8}} seed="c3claim" offset={[300, 60]}>
        <Swipe lines={STAKE_LINE} from={from} to={from + 16} seed="c3sw" />
      </Sheet>
      <Highlight text="STAKING A CLAIM" x={110} y={110} size={88} at={t.at('staking') - a} seed={310} rot={-2} />
      <Tag text="White Pine News, Nov. 9, 1872 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** "But if this was going to get bigger, they'd need a lot more stones. So the cousins spent some of that money on a trip." */
const MoreStones: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <LampPool x={900} y={620} r={680} a={0.14} />
    <Push dur={150} z={[1, 1.05]} ox={900} oy={620}>
      <Prop name="leather_pouch" x={520} y={380} w={420} at={-2} coral from="none" />
      <Prop name="rough_rubies" x={980} y={560} w={200} at={-2} rot={8} from="none" />
      <Prop name="banknotes_stack" x={1150} y={300} w={400} rot={6} at={t.at('spent') - a - 2} from="top" />
    </Push>
    <Note text="a lot more stones" x={140} y={190} size={62} rot={-4} at={t.at('more stones') - a - 2} />
    <Note text="a trip" x={1300} y={720} size={62} rot={-4} at={t.at('a trip') - a - 2} />
  </AbsoluteFill>
);

/** "To London. Under fake names, they bought about half a million dollars' worth of rough diamonds and rubies." */
const London: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <MoneyMap sfAt={0} londonAt={t.at('London') - a - 2} />
    <Highlight text="TO LONDON" x={130} y={110} size={92} at={t.at('London') - a} seed={311} rot={-2} />
    <Money at={t.at('half a million') - a} big="$500,000" small="about $20,000 in 1872" x={1300} y={690} />
  </AbsoluteFill>
);

/** "Low-grade stuff. Rejects." */
const Rejects: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <LampPool x={860} y={640} r={640} a={0.15} />
    <Prop name="rough_rubies" x={720} y={240} w={240} at={-2} rot={-10} from="top" />
    <Prop name="stone_pile" x={600} y={430} w={380} at={4} from="top" z={1} />
    <Prop name="leather_pouch" x={540} y={560} w={480} at={-4} coral from="none" z={2} />
    <Note text="low-grade stuff" x={140} y={200} size={62} rot={-4} at={t.at('Low-grade') - a - 2} />
    <Stamp text="REJECTS" x={1150} y={430} at={t.at('Rejects') - a} size={150} color="#FF9F1C" rot={-6} />
  </AbsoluteFill>
);

/** "Now they had plenty of stones. What they needed was somebody famous to call them treasure." */
const Famous: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const ny = t.at('somebody famous') - a;
  return (
    <AbsoluteFill>
      <MoneyMap sfAt={-400} londonAt={-300} nyAt={ny} cam={moneyCam(-400, -300, ny)} />
      <Note text="plenty of stones" x={1120} y={130} size={60} rot={-4} at={t.at('plenty') - a - 2} />
      <Highlight text="SOMEBODY FAMOUS" x={130} y={130} size={84} at={t.at('somebody famous') - a + 2} seed={312} rot={-2} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    silver: at('Ralston had') - 1, africa: at('Diamonds had') - 1, why: at('So why') - 1, money: at('Quick money') - 1,
    bag: at('Then the cousins') - 1, jew: at('A local jeweler') - 1, trick: at("That's the trick") - 1, drill: at('which use') - 1,
    bought: at('So Ralston') - 1, claim: at('A claim is') - 1, notice: at("That's where") - 1, stones: at("they'd need") - 1,
    london: at('To London') - 1, rejects: at('Low-grade') - 1, famous: at('Now they had') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Wanted t={t} a={0} />],
    [c.silver, <Sequence from={c.silver} layout="none"><Silver t={t} a={c.silver} /></Sequence>],
    [c.africa, <Sequence from={c.africa} layout="none"><Africa t={t} a={c.africa} /></Sequence>],
    [c.why, <Sequence from={c.why} layout="none"><WhyNot t={t} a={c.why} /></Sequence>],
    [c.money, <Sequence from={c.money} layout="none"><MoneyNote t={t} a={c.money} /></Sequence>],
    [c.bag, <Sequence from={c.bag} layout="none"><BiggerBag t={t} a={c.bag} /></Sequence>],
    [c.jew, <Sequence from={c.jew} layout="none"><Jeweler t={t} a={c.jew} /></Sequence>],
    [c.trick, <Sequence from={c.trick} layout="none"><Trick t={t} a={c.trick} /></Sequence>],
    [c.drill, <Sequence from={c.drill} layout="none"><Drill t={t} a={c.drill} b={c.bought} /></Sequence>],
    [c.bought, <Sequence from={c.bought} layout="none"><BoughtIn t={t} a={c.bought} /></Sequence>],
    [c.claim, <Sequence from={c.claim} layout="none"><Claim t={t} a={c.claim} /></Sequence>],
    [c.notice, <Sequence from={c.notice} layout="none"><Notice t={t} a={c.notice} /></Sequence>],
    [c.stones, <Sequence from={c.stones} layout="none"><MoreStones t={t} a={c.stones} /></Sequence>],
    [c.london, <Sequence from={c.london} layout="none"><London t={t} a={c.london} /></Sequence>],
    [c.rejects, <Sequence from={c.rejects} layout="none"><Rejects t={t} a={c.rejects} /></Sequence>],
    [c.famous, <Sequence from={c.famous} layout="none"><Famous t={t} a={c.famous} /></Sequence>],
  ];
  const highlights = ['Nevada', 'South Africa', 'Quick', 'real', 'trick', 'bought in', 'A claim', 'staking', 'London'];
  const notes = ['wanted', 'fortune', 'why not', 'every number', 'secret trip', 'bigger bag', 'they said', 'jeweler', 'reportedly', 'they were',
    'bookkeeper', 'diamond drills', 'cheap', 'nobody wanted', 'piece of their claim', 'post your name', 'more stones', 'a trip', 'Low-grade', 'plenty'];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {highlights.map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.27} />)}
      {[at('which use') + 2, at('somebody famous') + 2, at('Rejects')].map((f, i) => <Sfx key={`h${i}`} at={f} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      {['16 million', 'three million', 'half a million'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.3} />)}
      {['hammer', 'wooden', 'stakes', 'into'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/knock.wav" volume={0.35} />)}
      <Sfx at={at('27')} src="sfx/tick.wav" volume={0.35} />
      <Sfx at={at('A dollar')} src="sfx/tick.wav" volume={0.35} />
      <Sfx at={at('took a look') - 2} src="sfx/tick_soft.wav" volume={0.4} />
      <Sfx at={at('staking') + 2} src={WRITE.src} volume={0.15} />
    </>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_everybody_wants_a_diamond_mine.wav" lead={LEAD} music={[{src: 'music/dh_secret_bag.mp3', volume: bed('dh_secret_bag'), startFrom: 2490, to: THEY_WERE}, {src: 'music/dh_salted_theme.mp3', volume: bed('dh_salted_theme'), from: THEME, startFrom: THEME_START}]}>
    <Body />
  </ChapterShell>
);
