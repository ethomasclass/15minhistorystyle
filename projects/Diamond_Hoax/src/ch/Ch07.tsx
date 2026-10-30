// Chapter 7 · The Anthills (King finds the salted field). Scene plan: script/SCENES.md "ch07"; build brief: script/BUILD_BRIEF.md.
// Cuts land 1 frame before the word that starts each idea; every scene sits in a <Sequence from={cut}> and gets its beats as
// t.at(...) - a.
//   0:00  "A train in California, that fall." sil_train, pushing toward the lit window
//   0:03  "Henry Janin is showing off his diamonds" Janin's silhouette, the rough diamond (coral)
//   0:07  "men from a government survey" O'Sullivan: King's camp, then the Washakie badlands
//   0:13  "Their leader was Clarence King" King's portrait (coral), the tape, three notes
//   0:19  "They'd mapped that part of Colorado" King's own atlas, wide, pushing to Diamond Peak
//   0:23  "They hadn't seen any diamonds" the atlas close: DIAMOND PK circled, "no diamonds"
//   0:27  "Diamonds, rubies and sapphires form in very different kinds of rock" fx/GemOrigins, then the X
//   0:35  "So King went to find the place himself" O'Sullivan, Vermillion Creek Canon
//   0:40  "Five days on horseback, in the cold" sil_cold_mesa
//   0:43  "They found the mesa" the mesa slab; the salted patch glows on "finding stones"
//   0:48  "Every time they found a diamond" the ruby ring: one diamond, 12 rubies, "Nature is not that tidy."
//   0:56  "Then they looked at the anthills" fx/AnthillCutaway (the cold open's loop closes): ruby, boot prints, the neighbour
//   1:06  "pushed the stones in with the end of a stick" close on the stick hole, the stick
//   1:10  "Then a stranger rode up" sil_stranger
//   1:15  "One of King's men blurted out" King's camp at the fire
//   1:19  the dealer's line, word by word
//   1:22  "To sell short" tape + definition
//   1:27  "Say a share sells for a thousand dollars" fx/ShortSale: borrow (cup of sugar), sell
//   1:40  "Next week the news breaks" ShortSale closer: crash, return
//   1:48  "So if you know a crash is coming" the dealer's motive: get paid
//   1:56  "Now the secret was out on that mesa" the mesa again
//   1:59  "King wanted to warn everybody. The dealer wanted a head start." the split: King (coral) | the stranger
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch07_the_anthills.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {camAt, Sheet, type SheetCam} from '../kit/vox';
import {maskRef} from '../kit/maskref';
import {Mesa, MESA_CAM} from '../fx/Mesa';
import {GemOrigins} from '../fx/GemOrigins';
import {AnthillCutaway} from '../fx/AnthillCutaway';
import {ShortSale} from '../fx/ShortSale';
import trainL from '../../public/img/layers/sil/sil_train/layers.json';
import coldL from '../../public/img/layers/sil/sil_cold_mesa/layers.json';
import strangerL from '../../public/img/layers/sil/sil_stranger/layers.json';
import kingMask from '../../public/img/masks/king.json';
import {DarkTag, Figure, Lamp, Money, Print, WordQuote} from './ch06/parts';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);
const END = Math.ceil(N.duration * 30) + 54;
const ORANGE = '#FF9F1C';

type L = {size: number[]; glowLayer?: number};
const sz = (l: L) => l.size as [number, number];
const KING = maskRef('king', kingMask);
const KING_SRC = 'img/ch07/king_clarence_age27_c1869.jpg';
const KING_SIZE: [number, number] = [923, 1536];
const KING_TAG = 'Clarence King, c. 1869 · Library of Congress';
const ATLAS = 'img/ch07/king_atlas_green_river_basin_topographical_map_ii_1876.jpg';
const ATLAS_DETAIL = 'img/ch07/king_atlas_diamond_peak_detail_1876.jpg';
const ATLAS_TAG = "King's Atlas, 1876 · Library of Congress";
const OSULLIVAN = (y: number) => `T. H. O'Sullivan, ${y} · Library of Congress`;
const MAP_FILTER = 'grayscale(1) contrast(1.35) brightness(0.8)';

/** "A train in California, that fall." */
const Train: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_train" size={sz(trainL)} glowLayer={(trainL as L).glowLayer} a={-8} b={b - a + 8} cam={{z: [1.1, 1.3], x: [-60, -200], y: [0, 16]}} fade={4} />
    <Highlight text="CALIFORNIA, FALL 1872" x={130} y={110} size={88} at={t.at('California') - a} seed={71} rot={-2} />
  </AbsoluteFill>
);

/** "In one seat, Henry Janin is showing off his diamonds." */
const Janin: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 110], [1, 1.05], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '800px 560px'}}>
        <Lamp x={800} y={600} rx={640} ry={480} a={0.14} />
        <Figure who="janin" x={640} y={950} h={760} at={0} />
        <Prop name="rough_diamond" x={880} y={250} w={250} at={t.at('his diamonds') - a - 3} coral trace from="top" />
      </AbsoluteFill>
      <Note text="Henry Janin" x={1190} y={300} size={66} rot={-4} at={t.at('Henry Janin') - a} />
      <Note text="showing off his diamonds" x={980} y={620} size={60} rot={-3} at={t.at('showing off') - a - 2} />
    </AbsoluteFill>
  );
};

/** "And a few seats away are men from a government survey, geologists who'd spent five years mapping the West." */
const Survey: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch07/osullivan_kings_camp_salt_lake_city_1868.jpg" x={140} y={240} w={760} h={470} rot={-2} pos="50% 50%" at={1} tag={OSULLIVAN(1868)} />
    <Print src="img/ch07/osullivan_washakie_badlands_wyoming_1872.jpg" x={1110} y={240} w={460} h={600} rot={3} pos="50% 40%" at={t.at('five years') - a - 1} tag={OSULLIVAN(1872)} />
    <Highlight text="A GOVERNMENT SURVEY" x={120} y={112} size={84} at={t.at('government survey') - a} seed={72} rot={-2} />
    <Note text="geologists" x={170} y={760} size={64} rot={-4} at={t.at('geologists') - a - 2} />
    <Note text="5 years mapping the West" x={260} y={842} size={60} rot={-3} at={t.at('five years') - a + 2} />
  </AbsoluteFill>
);

/** "Their leader was Clarence King. Thirty years old, brilliant, and very sure of himself." */
const King: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 180], [1, 1.05], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '1400px 500px'}}>
        <Lamp x={1440} y={520} rx={620} ry={520} a={0.12} />
        <Print src={KING_SRC} x={1160} y={140} w={560} h={760} rot={2} at={1} tag={KING_TAG} size={KING_SIZE} fy={0.1} mask={KING} traceAt={t.at('Clarence') - a + 2} />
      </AbsoluteFill>
      <Highlight text="CLARENCE KING" x={130} y={150} size={110} at={t.at('Clarence') - a} seed={73} rot={-2} />
      <Note text="30 years old" x={200} y={420} size={70} rot={-4} at={t.at('Thirty') - a - 2} />
      <Note text="brilliant" x={260} y={540} size={70} rot={-3} at={t.at('brilliant') - a - 2} />
      <Note text="very sure of himself" x={200} y={660} size={70} rot={-4} at={t.at('very sure') - a - 2} />
    </AbsoluteFill>
  );
};

/** A map sheet on the desk with a moving camera; children in page px. */
const MapSheet: React.FC<{src: string; size: [number, number]; keys: [number, SheetCam][]; children?: React.ReactNode}> = ({src, size, keys, children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={src} size={size} cam={camAt(keys, f)} seed="atl" filter={MAP_FILTER}>{children}</Sheet>
      <DarkTag text={ATLAS_TAG} />
    </AbsoluteFill>
  );
};

/** "Those diamonds bothered King's team. They'd mapped that part of Colorado." The whole sheet, pushing to Diamond Peak. */
const MapWide: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <MapSheet src={ATLAS} size={[6000, 4108]} keys={[[0, {x: 3000, y: 2100, z: 0.31, tilt: 10, rot: -1.5}], [135, {x: 3450, y: 2280, z: 0.62, tilt: 6, rot: -1}]]} />
    <Highlight text="THEY'D MAPPED IT" x={130} y={110} size={92} at={t.at("They'd mapped") - a} seed={74} rot={-2} />
  </AbsoluteFill>
);

/** "They hadn't seen any diamonds. And something else didn't fit." The detail: DIAMOND PK circled. */
const MapClose: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <MapSheet src={ATLAS_DETAIL} size={[3603, 2162]} keys={[[0, {x: 1320, y: 1120, z: 1.25, rot: -1}], [115, {x: 1320, y: 1118, z: 1.42, rot: -1}]]} />
    <Loop cx={960} cy={548} rx={165} ry={78} at={t.at('any diamonds') - a - 2} dur={10} width={6} seed={31} tilt={-3} />
    <Note text="no diamonds" x={1170} y={340} size={74} rot={-5} at={t.at('any diamonds') - a + 6} />
    <Note text="...and something else" x={1060} y={760} size={66} rot={-3} at={t.at('something else') - a - 2} />
  </AbsoluteFill>
);

/** "Diamonds, rubies and sapphires form in very different kinds of rock. In nature, you basically never find them lying around together." */
const Gems: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <GemOrigins at={-26} diamondAt={t.at('Diamonds rubies') - a + 1} rubyAt={t.at('rubies and sapphires') - a + 1} sapphireAt={t.at('sapphires') - a + 1}
      liftAt={t.at('In nature') - a + 2} xAt={t.at('never find') - a} />
    <Sequence from={t.at('form in') - a} durationInFrames={t.at('In nature') - t.at('form in') + 2} layout="none">
      <Highlight text="DIFFERENT ROCKS" x={130} y={114} size={84} at={0} seed={75} rot={-2} />
    </Sequence>
  </AbsoluteFill>
);

/** "So King went to find the place himself, working from what Janin had let slip." */
const Look: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch07/osullivan_vermillion_creek_canon_1872.jpg" x={840} y={250} w={880} h={620} rot={2} pos="50% 50%" at={1} tag={OSULLIVAN(1872)} />
    <Highlight text="KING GOES TO LOOK" x={110} y={114} size={84} at={t.at('King went') - a} seed={76} rot={-2} />
    <Note text="from what Janin" x={150} y={430} size={66} rot={-4} at={t.at('working from') - a - 2} />
    <Note text="let slip" x={230} y={530} size={66} rot={-3} at={t.at('let slip') - a - 2} />
  </AbsoluteFill>
);

/** "Five days on horseback, in the cold." */
const Cold: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_cold_mesa" size={sz(coldL)} glowLayer={(coldL as L).glowLayer} a={0} b={b - a + 8} cam={{z: [1.04, 1.14], x: [-40, 30], y: [0, -10]}} />
    <Highlight text="FIVE DAYS" x={140} y={100} size={96} at={t.at('Five days') - a} seed={77} rot={-3} />
    <Note text="in the cold" x={760} y={150} size={70} rot={-4} at={t.at('cold') - a - 2} />
  </AbsoluteFill>
);

/** "They found the mesa. And they started finding stones. Too many, in a way." */
const MesaFound: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const glow = t.at('finding stones') - a;
  return (
    <AbsoluteFill>
      <Mesa at={-30} saltAt={-240} glowAt={glow} cam={[{f: 0, ...MESA_CAM.wide}, {f: glow + 6, ...MESA_CAM.patch}, {f: 165, ...MESA_CAM.patch, dist: 5.8}]} />
      <Highlight text="THE MESA" x={130} y={110} size={92} at={t.at('the mesa') - a} seed={78} rot={-2} />
      <Note text="too many" x={1220} y={240} size={72} rot={-4} at={t.at('Too many') - a - 2} />
    </AbsoluteFill>
  );
};

/** "Every time they found a diamond, there were about a dozen rubies near it. Every time. Nature is not that tidy." */
const Ring: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Mesa at={-300} saltAt={-280} glowAt={-200} rubyRingAt={t.at('there were') - a - 3} tidyAt={t.at('Nature is not') - a - 2}
      cam={[{f: 0, ...MESA_CAM.patch, dist: 5.8}, {f: 44, ...MESA_CAM.ring}, {f: 230, ...MESA_CAM.ring, dist: 2.75, yaw: -0.02}]} />
    <Note text="every time" x={1240} y={760} size={70} rot={-4} at={t.at('Every time', 2) - a - 2} />
  </AbsoluteFill>
);

/** "Then they looked at the anthills. Some had rubies in them. ... boot prints. The anthills without boot prints? No rubies." */
const Anthills: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <AnthillCutaway at={0} sliceAt={t.at('anthills') - a - 4} rubyAt={t.at('had rubies') - a + 2} printsAt={t.at('boot prints') - a - 4}
      compareAt={t.at('anthills without') - a} />
    <Highlight text="THE ANTHILLS" x={130} y={100} size={92} at={t.at('anthills') - a} seed={79} rot={-2} />
  </AbsoluteFill>
);

/** "One of King's men figured someone had pushed the stones in with the end of a stick." Close on the stick hole. */
const Stick: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <AnthillCutaway at={-400} sliceAt={-380} rubyAt={-330} printsAt={1e7} compareAt={1e7} />
    <Prop name="pointed_stick" x={872} y={-60} w={420} at={t.at('end of a stick') - a - 3} rot={8} from="top" />
    <Note text="pushed in" x={150} y={180} size={72} rot={-4} at={t.at('pushed') - a - 2} />
    <Note text="with a stick" x={190} y={280} size={72} rot={-3} at={t.at('end of a stick') - a} />
  </AbsoluteFill>
);

/** "Then a stranger rode up. A diamond dealer from New York, out hunting for the field himself." */
const Stranger: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_stranger" size={sz(strangerL)} glowLayer={(strangerL as L).glowLayer} a={0} b={b - a + 8} cam={{z: [1.04, 1.16], x: [20, -20], y: [0, -14]}} />
    <Highlight text="A STRANGER" x={130} y={100} size={96} at={t.at('stranger') - a} seed={80} rot={-2} />
    <Note text="a diamond dealer" x={150} y={250} size={66} rot={-4} at={t.at('diamond dealer') - a - 2} />
    <Note text="from New York" x={190} y={340} size={66} rot={-3} at={t.at('New York') - a - 2} />
  </AbsoluteFill>
);

/** "One of King's men blurted out that the whole thing was a fraud. And the dealer said:" The camp at the fire. */
const Blurt: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_cold_mesa" size={sz(coldL)} glowLayer={(coldL as L).glowLayer} a={0} b={b - a + 8} cam={{z: [1.3, 1.38], x: [120, 90], y: [-90, -100]}} fade={4} />
    <Note text="one of King's men:" x={150} y={150} size={64} rot={-4} at={t.at('blurted') - a - 6} />
    <Note text="it's a fraud!" x={230} y={250} size={84} rot={-4} at={t.at('a fraud') - a - 2} />
  </AbsoluteFill>
);

/** The dealer's line, word by word: "What a chance to sell short on the stock." */
const DealerQuote: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const who = t.at('What a chance') - a - 2;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={960} y={500} rx={900} ry={420} a={0.08} />
      <WordQuote t={t} a={a} phrase="What a chance to sell short on the stock" x={230} y={330} w={1460} size={104} marks={{4: ORANGE, 5: ORANGE}} />
      <div style={{position: 'absolute', left: 236, top: 680, fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: 'rgba(244,239,230,0.8)',
        opacity: interpolate(f, [who, who + 8], [0, 1], clamp)}}>J. F. BERRY, NEW YORK DIAMOND DEALER, 1872</div>
    </AbsoluteFill>
  );
};

/** "To sell short is to bet that a price will crash. Here's how it works." */
const Vocab: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Highlight text="SELL SHORT" x={160} y={300} size={130} at={t.at('sell short', 2) - a} seed={81} rot={-2} />
    <Definition term="sell short" def="to bet that a price will crash" at={t.at('sell short', 2) - a + 8} x={170} y={520} w={1300} />
    <Note text="here's how" x={1260} y={760} size={74} rot={-4} at={t.at("Here's how") - a - 2} />
  </AbsoluteFill>
);

/** "Say a share sells for a thousand dollars. You borrow one ... like borrowing a cup of sugar ... You sell it right away" */
const ShortA: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <ShortSale at={2} borrowAt={t.at('You borrow') - a} sugarAt={t.at('cup of sugar') - a - 2} sellAt={t.at('You sell it') - a} />
    <Money at={t.at('a thousand dollars') - a} big="$1,000 a share" small="about $40 in 1872" x={960} y={110} size={84} />
    <Note text="borrowed, not bought" x={1150} y={830} size={52} rot={-4} at={t.at('you can borrow') - a} />
  </AbsoluteFill>
);

/** "Next week the news breaks, and the share is worth about nothing. You buy one back for twenty bucks, return it, and keep the difference." */
// all four lane labels stay inside the frame (an earlier, tighter framing cut BORROW off the left edge)
const SHORT_CLOSE = [
  {f: 0, pos: [0.55, 8.8, 11.2] as [number, number, number], look: [0.55, 0.7, -0.3] as [number, number, number], fov: 30},
  {f: 220, pos: [0.55, 8.4, 10.7] as [number, number, number], look: [0.55, 0.7, -0.3] as [number, number, number], fov: 30},
];
const ShortB: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <ShortSale at={-600} borrowAt={-500} sugarAt={1e9} sellAt={-300} crashAt={t.at('breaks') - a - 4} returnAt={t.at('return it') - a - 2} cam={SHORT_CLOSE} />
  </AbsoluteFill>
);

/** "So if you know a crash is coming, and nobody else does, you can get rich off it. He didn't want to warn anybody. He wanted to get paid." */
const Paid: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={1200} y={520} rx={700} ry={460} a={0.13} />
    <Note text="a crash only you know about" x={150} y={170} size={66} rot={-3} at={t.at('know a crash') - a - 2} />
    <Prop name="banknotes_stack" x={980} y={330} w={560} at={t.at('get rich') - a - 2} rot={-5} coral trace from="top" />
    <Note text="warn anybody? no." x={170} y={560} size={70} rot={-4} at={t.at('warn anybody') - a - 2} />
    <Highlight text="GET PAID" x={170} y={720} size={110} at={t.at('get paid') - a} seed={82} rot={-3} />
  </AbsoluteFill>
);

/** "Now the secret was out on that mesa." */
const Secret: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Mesa at={-200} saltAt={-200} glowAt={-120} labels cam={[{f: 0, ...MESA_CAM.claim}, {f: 90, ...MESA_CAM.wide, dist: 15}]} />
    <Note text="the secret's out" x={150} y={130} size={72} rot={-4} at={t.at('secret') - a - 2} />
  </AbsoluteFill>
);

/** "King wanted to warn everybody. The dealer wanted a head start." The split: King (coral) | the stranger. */
const Split: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const pal = usePal();
  const f = useCurrentFrame();
  const right = t.at('The dealer', 2) - a - 1;
  const ro = interpolate(f, [right, right + 6], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={480} y={560} rx={460} ry={460} a={0.12} />
      <Print src={KING_SRC} x={230} y={270} w={490} h={620} rot={-2} at={0} tag={KING_TAG} size={KING_SIZE} fy={0.08} mask={KING} traceAt={4} />
      <div style={{position: 'absolute', left: 962, top: 0, width: 958, height: 1080, overflow: 'hidden', opacity: ro}}>
        <div style={{position: 'absolute', left: -560, top: 0, width: 1920, height: 1080}}>
          <SilScene name="sil_stranger" size={sz(strangerL)} glowLayer={(strangerL as L).glowLayer} a={right - 20} b={b - a + 20} cam={{z: [1.1, 1.16], x: [0, -20], y: [0, -10]}} fade={1} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 958, top: 0, width: 4, height: 1080, background: 'rgba(244,239,230,0.75)'}} />
      <div style={{position: 'absolute', left: 140, top: 226, fontFamily: JF.mono, fontSize: 26, letterSpacing: 6, color: pal.mark}}>KING</div>
      <div style={{position: 'absolute', left: 1100, top: 226, fontFamily: JF.mono, fontSize: 26, letterSpacing: 6, color: pal.subject, opacity: ro,
        textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>THE DEALER</div>
      <Highlight text="WARN EVERYBODY" x={110} y={114} size={78} at={t.at('warn everybody') - a} seed={83} rot={-2} />
      <Highlight text="A HEAD START" x={1080} y={114} size={78} at={t.at('head start') - a} seed={84} rot={-2} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    janin: at('In one seat') - 1, survey: at('And a few seats') - 1, king: at('Their leader') - 1, mapW: at('Those diamonds') - 1,
    mapC: at("They hadn't") - 1, gems: at('Diamonds rubies') - 1, look: at('So King went') - 1, cold: at('Five days') - 1,
    mesa: at('They found the mesa') - 1, ring: at('Every time they found') - 1, ants: at('Then they looked') - 1, stick: at("One of King's men") - 1,
    stranger: at('Then a stranger') - 1, blurt: at("One of King's men", 2) - 1, quote: at('And the dealer said') - 1, vocab: at('To sell short', 2) - 1,
    shortA: at('Say a share') - 1, shortB: at('Next week') - 1, paid: at('So if you know') - 1, secret: at('Now the secret') - 1,
    split: at('King wanted to warn') - 1,
  };
  const S = (from: number, node: React.ReactNode): [number, React.ReactNode] => [from, <Sequence from={from} layout="none">{node}</Sequence>];
  const cuts: [number, React.ReactNode][] = [
    S(0, <Train t={t} a={0} b={c.janin} />),
    S(c.janin, <Janin t={t} a={c.janin} />),
    S(c.survey, <Survey t={t} a={c.survey} />),
    S(c.king, <King t={t} a={c.king} />),
    S(c.mapW, <MapWide t={t} a={c.mapW} />),
    S(c.mapC, <MapClose t={t} a={c.mapC} />),
    S(c.gems, <Gems t={t} a={c.gems} />),
    S(c.look, <Look t={t} a={c.look} />),
    S(c.cold, <Cold t={t} a={c.cold} b={c.mesa} />),
    S(c.mesa, <MesaFound t={t} a={c.mesa} />),
    S(c.ring, <Ring t={t} a={c.ring} />),
    S(c.ants, <Anthills t={t} a={c.ants} />),
    S(c.stick, <Stick t={t} a={c.stick} />),
    S(c.stranger, <Stranger t={t} a={c.stranger} b={c.blurt} />),
    S(c.blurt, <Blurt t={t} a={c.blurt} b={c.quote} />),
    S(c.quote, <DealerQuote t={t} a={c.quote} />),
    S(c.vocab, <Vocab t={t} a={c.vocab} />),
    S(c.shortA, <ShortA t={t} a={c.shortA} />),
    S(c.shortB, <ShortB t={t} a={c.shortB} />),
    S(c.paid, <Paid t={t} a={c.paid} />),
    S(c.secret, <Secret t={t} a={c.secret} />),
    S(c.split, <Split t={t} a={c.split} b={END} />),
  ];
  const scene = useScene(cuts);
  const tapes: [string, number?][] = [['California'], ['government survey'], ['Clarence'], ["They'd mapped"], ['form in'], ['King went'], ['Five days'], ['the mesa'],
    ['anthills'], ['stranger'], ['sell short', 2], ['get paid'], ['warn everybody'], ['head start']];
  const notes: [string, number?][] = [['Henry Janin'], ['showing off'], ['geologists'], ['five years'], ['Thirty'], ['brilliant'], ['very sure'], ['any diamonds'], ['something else'],
    ['working from'], ['let slip'], ['cold'], ['Too many'], ['Every time', 2], ['Nature is not'], ['pushed'], ['end of a stick'], ['diamond dealer'], ['New York'], ['blurted'],
    ['a fraud'], ["Here's how"], ['you can borrow'], ['know a crash'], ['warn anybody'], ['secret']];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {tapes.map(([p, n]) => <Sfx key={p} at={at(p, n)} src="sfx/stamp.wav" volume={0.27} />)}
      {notes.map(([p, n]) => <Sfx key={p} at={at(p, n) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      {[at('five years') - 1, at('a thousand dollars'), at('get rich') - 2].map((f, i) => <Sfx key={`s${i}`} at={f} src="sfx/stamp.wav" volume={0.24} />)}
      <Sfx at={at('cup of sugar') - 2} src="sfx/tick_soft.wav" volume={0.45} />
      <Sfx at={at('end of a stick') - 3} src="sfx/tick_soft.wav" volume={0.4} />
      <Sfx at={c.quote} src="sfx/paper_rustle.wav" volume={0.25} />
    </>
  );
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_the_anthills.wav" lead={LEAD} music={[{src: 'music/aw_white_cold.mp3', volume: bed('aw_white_cold')}]}>
    <Body />
  </ChapterShell>
);
