// Chapter 9 · Where the Money Went (the ending). Scene plan: script/SCENES.md "ch09" (the narration file is the truth: "Just before
// three in the afternoon"). Every cut lands 1 frame before the word that starts its idea; each scene sits in a <Sequence from={cut}>.
//   0:00  "First, the money"              the banknotes leave with the two cousins (silhouettes: no reliable photos)
//   0:07  "Arnold was charged"            Arnold's silhouette: charged, home in Kentucky, NEVER TRIED
//   0:12  "a good Henry rifle"            the 1868 Cheyenne ad, swiped; the quote
//   0:17  "A Henry rifle is not a lawyer" a soldier with a Henry (archival) and the rifle (coral)
//   0:19  "He settled one lawsuit"        $4 million; A BANKER; "of course he did."
//   0:26  "a shootout"                    brief and non-graphic: a flash, a note
//   0:34  "And John Slack?"               Slack's silhouette, "vanished?" struck through
//   0:39  "New Mexico... undertaker"      sil_undertaker
//   0:43  "He died there in 1896"         the coffin, 1896
//   0:49  Ralston: the quiet stretch      (PALETTES.quiet: teal only, no coral, no jokes)
//         "And Ralston?"                  his portrait (traced, not tinted), $7 million
//   0:54  "remember those dominoes?"      the four tiles fall, for real
//   1:00  "people lined up"               sil_bank_line
//   1:04  "Just before three"             the New-York Tribune, Aug. 27, 1875 (stopped paying at 2:45)
//   1:07  "ran out of cash"               the Los Angeles Herald: "closed its doors"
//   1:09  "his usual swim"                sil_bay_dusk, held after "an accident"
//   1:18  "So let's go back to the question"  the H1 picture: PAID FOR / DIRT?
//   1:25  "They ran the six moves"        the full Con Card, each row written and checked as it is said, its object beside it
//   1:45  "Tiffany and Janin did it for them"  Tiffany (coral) and Janin's silhouette
//   1:54  "A mark who wants it to be true"  push in on the tycoon; the three warning signs; "Check the list" (the card, then gone)
//   2:04  "The diamonds were real. The field was dirt."  the H1 picture, the stone drains to grey on "dirt": DIRT. / PAID FOR
//   2:11  "Thanks for watching"           the end screen (20 s)
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch09_paid_for_dirt.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Note, PALETTES, PaletteCtx, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {Sheet, Slip, Swipe, type Box, TEAL} from '../kit/vox';
import {maskRef} from '../kit/maskref';
import {ConCard} from '../kit/con';
import {ColdOpenDepth, MoneyTag} from '../fx/ColdOpenDepth';
import {Dominoes} from '../fx/Dominoes';
import type {CamKey} from '../fx/desk/kit3d';
import {Lamp, Print, SilFigure, Strike, SyncQuote} from './ch08/parts';
import {EndScreen, END_FRAMES} from './ch09/EndScreen';
import bankLine from '../../public/img/layers/sil/sil_bank_line/layers.json';
import bayDusk from '../../public/img/layers/sil/sil_bay_dusk/layers.json';
import undertaker from '../../public/img/layers/sil/sil_undertaker/layers.json';
import ralstonMask from '../../public/img/masks/ch08_ralston.json';
import tiffanyMask from '../../public/img/masks/ch09_tiffany.json';
import henryAd from '../../public/img/ch09/cheyenne_leader_1868-06-05_henrys_repeating_rifles_ad.json';
import tribune from '../../public/img/ch09/ny_tribune_1875-08-27_suspension_bank_of_california.json';
import herald from '../../public/img/ch09/la_herald_1875-08-27_bank_of_california_suspended.json';

const N = words as Narration;
const T = makeTimeline(N, 30);
const THANKS = T.at('Thanks');
/** The end screen runs 20 s from "Thanks", past the narration: the chapter is that much longer. */
const EXTRA = THANKS + END_FRAMES - Math.ceil(N.duration * 30);
export const CH09_FRAMES = chapterFrames(N, LEAD) + EXTRA;

type L = {size: number[]; glowLayer?: number};
const sz = (l: L) => l.size as [number, number];
const RALSTON = maskRef('ch08_ralston', ralstonMask);
const TIFFANY = maskRef('ch09_tiffany', tiffanyMask);
const TILE3 = 'img/ch08/ralston_tile_crop.jpg';
type Phr = {phrases: Record<string, number[][]>};
const boxes = (j: unknown, k: string) => (j as Phr).phrases[k] as Box[];

type S = {t: TL; a: number; b: number};

/** "First, the money. Most of it went home with the cousins, and most of it never came back." */
const Money: React.FC<S> = ({t, a}) => {
  const g = useGFrame();
  const go = t.at('went home') - a;
  const k = interpolate(g, [go, go + 22], [0, 1], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={700} y={560} r={600} a={0.12} />
      <Highlight text="THE MONEY" x={140} y={120} size={100} at={t.at('money') - a} seed={91} rot={-2} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${k * 760}px, ${k * 60}px) scale(${1 - k * 0.55})`, transformOrigin: '780px 560px',
        opacity: 1 - interpolate(g, [go + 16, go + 24], [0, 1], clamp)}}>
        <Prop name="banknotes_stack" x={420} y={400} w={720} at={t.at('Most') - a - 1} coral trace from="top" />
      </div>
      <SilFigure name="sil_arnold" x={1200} y={300} h={560} at={t.at('cousins') - a - 4} label={false} />
      <SilFigure name="sil_slack" x={1530} y={300} h={560} at={t.at('cousins') - a - 1} label={false} />
      <div style={{position: 'absolute', left: 1130, top: 900, fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, letterSpacing: 1.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)',
        textShadow: '0 1px 6px rgba(0,0,0,0.9)', opacity: g >= t.at('cousins') - a + 2 ? 1 : 0}}>PHILIP ARNOLD · JOHN SLACK<br />NO RELIABLE PHOTOS</div>
      <Note text="…and it never came back" x={170} y={820} size={62} rot={-3} at={t.at('never came back') - a - 3} />
    </AbsoluteFill>
  );
};

/** "Arnold was charged with fraud, but he was home in Kentucky, and he never stood trial." */
const Charged: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <SilFigure name="sil_arnold" x={260} y={150} h={720} at={1} />
    <Note text="charged with fraud" x={900} y={200} size={66} rot={-4} at={t.at('charged') - a - 3} />
    <Note text="…home in Kentucky" x={960} y={330} size={62} rot={-3} at={t.at('Kentucky') - a - 3} color="#ffffff" />
    <Stamp text="NEVER TRIED" x={900} y={520} at={t.at('stood trial') - a} size={130} color="#FF9F1C" rot={-4} />
  </AbsoluteFill>
);

/** "He reportedly said he'd already hired a lawyer: 'a good Henry rifle.'" The 1868 ad, the quote. */
const Lawyer: React.FC<S> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const L = boxes(henryAd, "One Case of Henry's Repeating Rifles");
  const z = interpolate(f, [0, b - a], [1.05, 1.18], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src="img/ch09/cheyenne_leader_1868-06-05_henrys_repeating_rifles_ad.jpg" size={[681, 658]} cam={{x: 340, y: 380, z, tilt: 6}} offset={[-430, 10]} seed="hr">
        <Swipe lines={L} from={t.at('Henry rifle') - a - 4} to={t.end('Henry rifle') - a + 6} seed="hr" />
      </Sheet>
      <Note text="“I've hired a lawyer…”" x={1000} y={220} size={56} rot={-3} at={t.at('hired') - a - 3} color="#ffffff" />
      <SyncQuote t={t} a={a} phrase="a good Henry rifle." x={1050} y={380} w={760} size={84} />
      <Tag text="Cheyenne Leader, June 5, 1868 · Library of Congress" x={110} y={990} />
    </AbsoluteFill>
  );
};

/** "A Henry rifle is not a lawyer." */
const NotALawyer: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch09/henry_rifle_cavalryman_kauffman_abell_c1864.jpg" x={170} y={90} w={460} h={760} rot={-2} pos="50% 35%" at={1}
      tag="Kauffman & Abell, 1860s · Library of Congress" />
    <Prop name="henry_rifle" x={760} y={470} w={1000} rot={-4} at={3} coral trace from="top" />
    <Note text="a Henry rifle" x={900} y={250} size={62} rot={-3} at={6} color="#ffffff" />
    <Note text="not a lawyer" x={1180} y={760} size={78} rot={-4} at={t.at('not a lawyer') - a - 3} />
  </AbsoluteFill>
);

/** "He settled one lawsuit for about four million dollars, then became a banker. Of course he did." */
const Banker: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <SilFigure name="sil_arnold" x={1380} y={250} h={640} at={1} />
    <Note text="settled one lawsuit" x={170} y={140} size={62} rot={-3} at={t.at('settled') - a - 3} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 3840, height: 1080}}>
      <MoneyTag at={t.at('four million') - a - 1} big="$4 million" small="$150,000 in 1872" x={620} y={300} />
    </div>
    <Highlight text="A BANKER" x={240} y={640} size={110} at={t.at('banker') - a} seed={92} rot={-3} />
    <Note text="of course he did." x={260} y={815} size={74} rot={-4} color="#FF6F61" at={t.at('Of course') - a - 3} />
  </AbsoluteFill>
);

/** "A few years later, a feud with a rival banker turned into a shootout. Arnold was shot, and died of pneumonia about six months later." */
const Shootout: React.FC<S> = ({t, a}) => {
  const g = useGFrame();
  const flash = t.at('shootout') - a + 2;
  const fl = g >= flash && g < flash + 5 ? interpolate(g, [flash, flash + 5], [0.55, 0], clamp) : 0;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <SilFigure name="sil_arnold" x={250} y={220} h={640} at={1} />
      <Note text="a feud with a rival banker" x={880} y={180} size={60} rot={-3} at={t.at('feud') - a - 3} color="#ffffff" />
      <Highlight text="A SHOOTOUT" x={900} y={320} size={100} at={t.at('shootout') - a} seed={93} rot={-3} />
      <Note text="shot…" x={940} y={560} size={66} rot={-3} at={t.at('Arnold was shot') - a - 3} />
      <Note text="…pneumonia, six months later" x={830} y={680} size={56} rot={-3} at={t.at('pneumonia') - a - 3} color="#ffffff" />
      <AbsoluteFill style={{background: '#fff4e0', opacity: fl}} />
    </AbsoluteFill>
  );
};

/** "And John Slack? You may have heard that he vanished. He didn't." */
const Vanished: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <SilFigure name="sil_slack" x={330} y={160} h={720} at={1} />
    <Highlight text="JOHN SLACK" x={880} y={150} size={96} at={t.at('John Slack') - a} seed={94} rot={-2} />
    <Note text="vanished?" x={960} y={420} size={96} rot={-4} color="#FF9F1C" at={t.at('vanished') - a - 3} />
    <Strike x1={930} y1={478} x2={1445} y2={452} at={t.at("He didn't") - a} />
    <Note text="he didn't." x={1080} y={600} size={70} rot={-3} at={t.at("He didn't") - a + 3} />
  </AbsoluteFill>
);

/** "He moved to a small town in New Mexico and became the local undertaker." */
const Undertaker: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_undertaker" size={sz(undertaker)} glowLayer={(undertaker as L).glowLayer} a={0} b={b - a + 8} cam={{z: [1.05, 1.16], x: [-30, 30], y: [0, -12]}} />
    <Slip text="a small town in New Mexico" x={150} y={150} size={60} rot={-3} at={t.at('New Mexico') - a - 6} />
    <Slip text="the local undertaker" x={190} y={270} size={60} rot={-2} at={t.at('undertaker') - a - 3} />
  </AbsoluteFill>
);

/** "He died there in 1896, a small-town undertaker with a small-town bank account." */
const Coffin: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={1100} y={560} r={600} a={0.12} />
    <SilFigure name="sil_slack" x={260} y={230} h={600} at={1} />
    <Prop name="undertaker_coffin" x={900} y={300} w={460} rot={-3} at={3} coral trace from="top" />
    <Stamp text="1896" x={1420} y={220} at={t.at('1896') - a} size={140} color="#FF9F1C" rot={-4} />
    <Note text="a small-town bank account" x={900} y={830} size={60} rot={-3} at={t.at('small-town bank') - a - 3} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- the quiet stretch (Ralston)
/** "And Ralston? He reportedly lost about seven million dollars on the diamond field." */
const Ralston: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch02/ralston_william_harpending_plate_1913.jpg" size={[895, 1230]} mask={RALSTON} tint={false} x={200} y={80} w={560} rot={-1.5} at={1}
      tag="Harpending, The Great Diamond Hoax, 1913" />
    <Note text="William Ralston" x={1000} y={170} size={64} rot={-3} at={t.at('And Ralston') - a - 2} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 3840, height: 1080}}>
      <MoneyTag at={t.at('seven million') - a - 1} big="$7 million" small="about $250,000 in 1872" x={1330} y={380} />
    </div>
    <Note text="lost, reportedly" x={1110} y={720} size={56} rot={-3} at={t.at('reportedly lost') - a + 6} color="#EDE7DC" />
  </AbsoluteFill>
);

const FALL_CAM: CamKey[] = [
  {f: 0, pos: [-8.8, 4.2, 10.6], look: [0.6, 2.0, 0], fov: 30},
  {f: 60, pos: [-8.4, 4.4, 10.2], look: [0.8, 1.9, 0], fov: 30},
  {f: 170, pos: [-6.6, 7.6, 9.0], look: [1.9, 0.5, 0], fov: 30},
];

/** "But remember those dominoes? Three years later, his bank got caught in other bad mining bets." The tiles fall, for real. */
const Fall: React.FC<S & {fall: number}> = ({t, a, fall}) => (
  <AbsoluteFill>
    <Dominoes showLabels tallerAt={-500} fallAt={fall - a} portrait={TILE3} coral={null} cam={FALL_CAM} />
    <Note text="three years later" x={150} y={130} size={62} rot={-3} at={t.at('Three years') - a - 3} />
    <Note text="other bad mining bets" x={1080} y={830} size={58} rot={-3} at={t.at('mining bets') - a - 3} color="#EDE7DC" />
  </AbsoluteFill>
);

/** "Word spread, and people lined up to pull their money out." */
const Line: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_bank_line" size={sz(bankLine)} glowLayer={(bankLine as L).glowLayer} a={0} b={b - a + 8} cam={{z: [1.1, 1.2], x: [30, -10], y: [-10, -20]}} flicker={0.3} />
    <Slip text="people lined up" x={150} y={150} size={60} rot={-3} at={t.at('lined up') - a - 3} />
  </AbsoluteFill>
);

/** "Just before three in the afternoon, the Bank of California..." The Tribune: "stopped paying checks at 2:45 to-day". */
const Tribune: React.FC<S> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const head = boxes(tribune, 'SUSPENSION OF THE BANK OF CALIFORNIA');
  const L = boxes(tribune, 'stopped paying checks at 2:45 to-day');
  const y = interpolate(f, [0, b - a], [300, 420], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src="img/ch09/ny_tribune_1875-08-27_suspension_bank_of_california.jpg" size={[1075, 1427]} cam={{x: 520, y, z: 1.15, tilt: 6}} seed="tb">
        <Swipe lines={[head[0]]} from={2} to={10} seed="tb1" color={TEAL} />
        <Swipe lines={L} from={t.at('Just before') - a + 4} to={t.end('afternoon') - a} seed="tb2" color={TEAL} />
      </Sheet>
      <Tag text="New-York Tribune, Aug. 27, 1875 · Library of Congress" x={110} y={70} />
    </AbsoluteFill>
  );
};

/** "...ran out of cash and closed its doors." The Los Angeles Herald. */
const Herald: React.FC<S> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const L = boxes(herald, 'closed its doors');
  const z = interpolate(f, [0, b - a], [1.0, 1.12], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src="img/ch09/la_herald_1875-08-27_bank_of_california_suspended.jpg" size={[856, 1250]} cam={{x: 440, y: 560, z, tilt: 6}} offset={[330, 0]} seed="lh">
        <Swipe lines={L} from={t.at('closed its doors') - a - 1} to={t.end('closed its doors') - a + 2} seed="lh" color={TEAL} />
      </Sheet>
      <Tag text="Los Angeles Herald, Aug. 27, 1875 · Library of Congress" x={110} y={990} />
    </AbsoluteFill>
  );
};

/** "The next day, Ralston went for his usual swim in San Francisco Bay, and drowned. To this day, nobody knows if it was an accident." */
const Bay: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_bay_dusk" size={sz(bayDusk)} glowLayer={(bayDusk as L).glowLayer} a={0} b={b - a + 10} cam={{z: [1.03, 1.1], x: [-12, 12], y: [0, -6]}} flicker={0.15} fog={0.25} />
    <Slip text="the next day" x={150} y={140} size={56} rot={-2} at={t.at('next day') - a - 3} />
    <Slip text="nobody knows" x={1360} y={860} size={56} rot={-2} at={t.at('nobody knows') - a - 3} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- the answer
/** "So let's go back to the question. How do two cousins get the richest men in America to pay millions for dirt?" */
const Question: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <ColdOpenDepth cam={[{f: 0, d: 0, x: 0, y: 0}, {f: 210, d: 45, x: 0, y: 14}]} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.35)'}} />
    <Highlight text="PAID FOR" x={600} y={104} size={100} at={t.at('pay') - a} seed={98} rot={-4} />
    <Highlight text="DIRT?" x={640} y={212} size={220} at={t.at('dirt') - a} seed={99} rot={-2} />
  </AbsoluteFill>
);

/** "They ran the six moves." The full card: each row writes on as it is named, its object lands beside it, and it is checked. */
const Moves: React.FC<S & {m: {row: number; check: number}[]}> = ({t, a, b, m}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, b - a], [1, 1.05], clamp);
  const r = (i: number) => m[i].row - a;
  const until = (i: number) => (i < 5 ? r(i + 1) : 1e7);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={1400} y={540} r={520} a={0.12} />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '700px 540px'}}>
        <ConCard x={170} y={100} scale={1.32} at={t.at('six moves') - a - 2} rows={m.map((x, i) => ({n: i + 1, at: r(i)}))} checks={m.map((x, i) => ({n: i + 1, at: x.check - a}))} />
      </AbsoluteFill>
      <Prop name="leather_pouch" x={1220} y={330} w={420} at={r(0) + 2} out={until(0)} coral trace from="top" />
      <Prop name="bandana_blindfold" x={1120} y={380} w={620} at={r(1) + 2} out={until(1)} coral trace from="top" />
      <Print src="img/ch04/tiffany_charles_engraving_1893.jpg" x={1220} y={170} w={440} h={560} rot={2} pos="50% 30%" at={r(2) + 1} out={until(2)} tag="Engraving, 1893" />
      <Prop name="stone_pile" x={1180} y={360} w={520} at={r(3) + 2} out={until(3)} coral trace from="top" />
      <Prop name="share_certificate" x={1250} y={220} w={400} rot={4} at={r(4) + 2} out={until(4)} coral trace from="top" />
      <Prop name="pocket_watch" x={1240} y={300} w={440} at={r(5) + 2} coral trace from="top" />
    </AbsoluteFill>
  );
};

/** "But the cousins didn't do the convincing. Tiffany and Janin did it for them. And there's one part a con man can't build for himself." */
const Convincing: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch04/tiffany_charles_engraving_1893.jpg" size={[1497, 2199]} mask={TIFFANY} x={240} y={110} w={480} rot={-2} at={t.at('Tiffany and Janin') - a - 1}
      tag="Engraving, 1893" />
    <SilFigure name="sil_janin" x={1500} y={170} h={640} at={t.at('Janin') - a - 1} labelX={-90} />
    <Note text="not the cousins" x={800} y={160} size={58} rot={-4} at={t.at("didn't do") - a - 3} color="#ffffff" />
    <Note text="the experts did it" x={800} y={420} size={56} rot={-3} at={t.at('did it for them') - a - 3} />
    <Note text="one part they can't build…" x={780} y={700} size={48} rot={-3} at={t.at('one part') - a - 3} color="#ffffff" />
  </AbsoluteFill>
);

/** "A mark who wants it to be true. So the next time a deal looks too good... Check the list." Push in on the tycoon. */
const Mark: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <ColdOpenDepth cam={[{f: 0, d: 20, x: 0, y: 10}, {f: 90, d: 150, x: 12, y: 70}, {f: b - a, d: 255, x: 15, y: 90}]} />
    <Highlight text="THE MARK" x={1240} y={110} size={96} at={t.at('mark') - a} seed={95} rot={-3} />
    <Slip text="…who wants it to be true" x={1220} y={250} size={56} rot={-2} at={t.at('wants it') - a - 3} />
    <Slip text="too good?" x={130} y={260} size={60} rot={-3} at={t.at('too good') - a - 3} />
    <Slip text="everyone you trust is in?" x={130} y={380} size={56} rot={-2} at={t.at('already in') - a - 3} />
    <Slip text="no time to think?" x={130} y={500} size={60} rot={-3} at={t.at('no time') - a - 3} />
    <ConCard x={1250} y={560} scale={0.72} at={t.at('Check the list') - a - 1} rows={[1, 2, 3, 4, 5, 6].map((n) => ({n, at: -999}))} counter={false} examples={false}
      checks={[1, 2, 3, 4, 5, 6].map((n) => ({n, at: -999}))} />
  </AbsoluteFill>
);

/** "The diamonds were real. The field was dirt. And the richest men in America paid for it." Over the H1 picture. */
const Closing: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <ColdOpenDepth cam={[{f: 0, d: 70, x: 0, y: 30}, {f: 220, d: 10, x: 0, y: 0}]} drainAt={t.at('dirt', 2) - a} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.25)'}} />
    <Highlight text="DIRT." x={640} y={212} size={220} at={t.at('dirt', 2) - a} seed={99} rot={-2} />
    <Highlight text="PAID FOR" x={600} y={104} size={100} at={t.at('paid') - a} seed={98} rot={-4} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = T;
  const at = t.at;
  const c = {
    charged: at('Arnold was charged') - 1, lawyer: at('He reportedly said') - 1, notLawyer: at('A Henry rifle is') - 1, banker: at('He settled') - 1,
    shoot: at('A few years') - 1, slack: at('And John Slack') - 1, moved: at('He moved') - 1, died: at('He died there') - 1, ralston: at('And Ralston') - 1,
    fall: at('But remember') - 1, line: at('Word spread') - 1, tribune: at('Just before') - 1, herald: at('ran out of cash') - 1, bay: at('The next day') - 1,
    question: at("So let's go back") - 1, moves: at('They ran') - 1, convince: at('But the cousins') - 1, mark: at('A mark who') - 1, closing: at('The diamonds were') - 1,
  };
  const fall = at('those dominoes') + 14;
  const m = [
    {row: at('The bait'), check: at('diamonds') + 10},
    {row: at('Hard to get'), check: at('nobody could find') + 22},
    {row: at('Borrowed trust'), check: at('Tiffany') + 18},
    {row: at('The proof'), check: at('yourself') + 12},
    {row: at('The rush'), check: at('Rothschilds') + 18},
    {row: at('the exit'), check: at('right on time') + 18},
  ];
  const seq = (from: number, node: React.ReactNode): [number, React.ReactNode] => [from, <Sequence from={from} layout="none">{node}</Sequence>];
  const quiet = (from: number, node: React.ReactNode): [number, React.ReactNode] => [from, <PaletteCtx.Provider value={PALETTES.quiet}><Sequence from={from} layout="none">{node}</Sequence></PaletteCtx.Provider>];
  const cuts: [number, React.ReactNode][] = [
    seq(0, <Money t={t} a={0} b={c.charged} />),
    seq(c.charged, <Charged t={t} a={c.charged} b={c.lawyer} />),
    seq(c.lawyer, <Lawyer t={t} a={c.lawyer} b={c.notLawyer} />),
    seq(c.notLawyer, <NotALawyer t={t} a={c.notLawyer} b={c.banker} />),
    seq(c.banker, <Banker t={t} a={c.banker} b={c.shoot} />),
    seq(c.shoot, <Shootout t={t} a={c.shoot} b={c.slack} />),
    seq(c.slack, <Vanished t={t} a={c.slack} b={c.moved} />),
    seq(c.moved, <Undertaker t={t} a={c.moved} b={c.died} />),
    seq(c.died, <Coffin t={t} a={c.died} b={c.ralston} />),
    quiet(c.ralston, <Ralston t={t} a={c.ralston} b={c.fall} />),
    quiet(c.fall, <Fall t={t} a={c.fall} b={c.line} fall={fall} />),
    quiet(c.line, <Line t={t} a={c.line} b={c.tribune} />),
    quiet(c.tribune, <Tribune t={t} a={c.tribune} b={c.herald} />),
    quiet(c.herald, <Herald t={t} a={c.herald} b={c.bay} />),
    quiet(c.bay, <Bay t={t} a={c.bay} b={c.question} />),
    seq(c.question, <Question t={t} a={c.question} b={c.moves} />),
    seq(c.moves, <Moves t={t} a={c.moves} b={c.convince} m={m} />),
    seq(c.convince, <Convincing t={t} a={c.convince} b={c.mark} />),
    seq(c.mark, <Mark t={t} a={c.mark} b={c.closing} />),
    seq(c.closing, <Closing t={t} a={c.closing} b={THANKS} />),
  ];
  const scene = useScene(cuts);
  const XF = 12; // the closing picture dissolves into the end screen
  const out = interpolate(frame, [THANKS, THANKS + XF], [1, 0], clamp);
  const notes = ['never came back', 'charged', 'Kentucky', 'hired', 'not a lawyer', 'settled', 'Of course', 'feud', 'Arnold was shot', 'pneumonia', 'vanished', "He didn't",
    'small-town bank', 'And Ralston', 'Three years', 'mining bets', "didn't do", 'did it for them', 'one part'];
  const titles = ['money', 'banker', 'shootout', 'John Slack', 'pay', 'dirt', 'mark', 'paid'];
  const dirt2 = at('dirt', 2);
  const stamps = ['stood trial', '1896'];
  return (
    <AbsoluteFill>
      {frame < THANKS ? scene : (
        <>
          <Sequence from={THANKS} layout="none"><EndScreen start={THANKS} subscribe={at('subscribe')} more={at('more stories')} /></Sequence>
          {frame < THANKS + XF && <AbsoluteFill style={{opacity: out}}>{scene}</AbsoluteFill>}
        </>
      )}
      {cuts.slice(1).map(([f]) => <Sfx key={f} at={f} src="sfx/whoosh.wav" volume={f >= c.ralston && f < c.question ? 0.16 : 0.28} />)}
      {notes.map((p) => <Sfx key={p} at={at(p) - 5} src={WRITE.src} volume={WRITE.volume} />)}
      {titles.map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.27} />)}
      {stamps.map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.3} />)}
      <Sfx at={dirt2} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={at('four million') - 1} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={at('seven million') - 1} src="sfx/stamp.wav" volume={0.22} />
      <Sfx at={c.moves + 4} src="sfx/page_turn.wav" volume={0.35} />
      {m.map((x, i) => <Sfx key={`c${i}`} at={x.check} src="sfx/tick.wav" volume={0.45} />)}
      <Sfx at={at('Check the list') - 1} src="sfx/tick.wav" volume={0.4} />
      {/* end screen (relative to "Thanks", as in Halloween's EndScreenTest) */}
      <Sfx at={THANKS + 2} src="sfx/stamp.wav" volume={0.28} />
      <Sfx at={THANKS + 8} src="sfx/chunk_snap.wav" volume={0.3} />
      {[at('more stories'), at('subscribe')].map((x) => <Sfx key={x} at={x - 2} src={WRITE.src} volume={WRITE.volume} />)}
    </AbsoluteFill>
  );
};

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_paid_for_dirt.wav" lead={LEAD} extra={EXTRA} music={[{src: 'music/aw_boomtown_hollow.mp3', volume: bed('aw_boomtown_hollow')}]}>
    <Body />
  </ChapterShell>
);
