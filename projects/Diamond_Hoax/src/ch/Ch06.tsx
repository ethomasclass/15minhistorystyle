// Chapter 6 · Diamond Fever (the rush and the exit). Scene plan: script/SCENES.md "ch06"; build brief: script/BUILD_BRIEF.md.
// Cuts land 1 frame before the word that starts each idea; every scene sits in a <Sequence from={cut}> and gets its beats as
// t.at(...) - a. The Con Card and the DIAMOND FEVER tape live above the scenes (they carry across a cut).
//   0:00  "Now the real money moved." the share certificate, money tag $270 million+
//   0:07  "The names on the list" three prints slap onto the certificate: a general, the Rothschild bank, Tiffany
//   0:15  "And it spread." the Cheyenne Daily Leader, Sept 1872, on the desk
//   0:19  "Prospectors fanned out" sil_fever
//   0:24  "People called it diamond fever" back on the paper, the line swiped; DIAMOND FEVER tape
//   0:27  "That's move five: the rush." sil_fever again, the Con Card pops in (row 5)
//   0:29  "Once everybody important is buying in" a fan of share certificates, then they get grabbed
//   0:37  "a smart con man leaves" Arnold and Slack (silhouettes); Con Card row 6 at "the exit"
//   0:43  "Most crooks get greedy" closer on the two; they walk out on "The cousins didn't."
//   0:48  "The investors bought them out" money tags for Arnold and Slack, the banknotes
//   0:56  "Arnold went home to Kentucky" the drawn US map: Arnold rides home and shrinks; Slack fades away
//   1:05  "a geologist got on the wrong train" sil_train
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch06_cash_out.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Note, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {ConCard} from '../kit/con';
import {Sheet, Swipe, type SheetCam, camAt} from '../kit/vox';
import {Tag} from '../kit/Kit';
import fever from '../../public/img/layers/sil/sil_fever/layers.json';
import train from '../../public/img/layers/sil/sil_train/layers.json';
import paper from '../../public/img/ch06/cheyenne_daily_leader_1872-09-19_diamond_fever.json';
import {DarkTag, Figure, Lamp, Money, Print, Strike} from './ch06/parts';
import {HomeMap} from './ch06/usmap';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);
const END = Math.ceil(N.duration * 30) + 54;

type L = {size: number[]; glowLayer?: number};
const sz = (l: L) => l.size as [number, number];
const PAPER = 'img/ch06/cheyenne_daily_leader_1872-09-19_diamond_fever.jpg';
const PAPER_SIZE: [number, number] = [715, 863];
const PAPER_TAG = 'Cheyenne Daily Leader, Sept. 19, 1872 · Library of Congress';
const FEVER_LINE = (paper as unknown as {phrases: Record<string, [number, number, number, number][]>}).phrases['The diamond fever is increasing'];

/** "Now the real money moved. The new company had more than a quarter of a billion dollars in stock." */
const RealMoney: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 210], [1, 1.05], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '1400px 520px'}}>
        <Lamp x={1440} y={520} rx={700} ry={560} a={0.14} />
        <Prop name="share_certificate" x={1120} y={110} w={640} at={2} rot={2} from="top" />
        <Money at={t.at('quarter') - a - 2} big="$270 million+" small="$10 million in 1872" x={1440} y={430} size={92} plate />
      </AbsoluteFill>
      <Highlight text="THE REAL MONEY" x={120} y={140} size={96} at={t.at('real money') - a} seed={61} rot={-2} />
      <Note text="a new company" x={170} y={400} size={64} rot={-4} at={t.at('new company') - a - 2} />
      <Note text="all in stock" x={220} y={540} size={64} rot={-3} at={t.at('in stock') - a - 2} />
    </AbsoluteFill>
  );
};

/** "The names on the list were huge. One of those generals. The Rothschild banking family. Tiffany himself." */
const Names: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 235], [1.04, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '960px 500px'}}>
        <Lamp x={960} y={520} rx={760} ry={520} a={0.12} />
        <Prop name="share_certificate" x={650} y={130} w={620} at={-20} rot={-2} from="none" />
        <Print src="img/ch04/mcclellan_george_brady_cdv_1861.jpg" x={470} y={250} w={300} h={390} rot={-7} pos="50% 18%" at={t.at('generals') - a - 1}
          tag="" />
        <Print src="img/ch06/rothschild_baron_harpending_plate_1913.jpg" x={810} y={290} w={300} h={390} rot={2} pos="50% 20%" at={t.at('Rothschild') - a - 1}
          tag="" />
        <Print src="img/ch04/tiffany_charles_engraving_1893.jpg" x={1150} y={240} w={300} h={390} rot={6} pos="50% 22%" at={t.at('Tiffany') - a - 1}
          tag="" />
      </AbsoluteFill>
      <Highlight text="THE LIST" x={120} y={100} size={96} at={t.at('list') - a} seed={62} rot={-3} />
      <Note text="a general" x={190} y={720} size={62} rot={-5} at={t.at('generals') - a + 3} />
      <Note text="the Rothschild bank" x={700} y={850} size={62} rot={-3} at={t.at('Rothschild') - a + 3} />
      <Note text="Tiffany" x={1490} y={700} size={66} rot={-4} at={t.at('Tiffany') - a + 3} />
      <Tag text="McClellan: Brady, 1861 · Library of Congress  /  Rothschild: Harpending, 1913  /  Tiffany: engraving, 1893" />
    </AbsoluteFill>
  );
};

/** The Cheyenne paper on the desk; `keys` are the camera, `children` are in page px. */
const Paper: React.FC<{keys: [number, SheetCam][]; offset?: [number, number]; children?: React.ReactNode}> = ({keys, offset, children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={PAPER} size={PAPER_SIZE} cam={camAt(keys, f)} seed="cdl" offset={offset}>{children}</Sheet>
      <DarkTag text={PAPER_TAG} />
    </AbsoluteFill>
  );
};

/** "And it spread. Newspapers printed how-to articles on diamond mining." */
const Spread: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Paper keys={[[0, {x: 357, y: 430, z: 1.0, tilt: 8, rot: -2}], [150, {x: 357, y: 420, z: 1.08, tilt: 6, rot: -1}]]} offset={[330, 0]} />
    <Highlight text="IT SPREAD" x={110} y={120} size={96} at={t.at('spread') - a} seed={63} rot={-3} />
    <Note text="how-to articles" x={150} y={430} size={64} rot={-4} at={t.at('how-to') - a - 2} />
    <Note text="on diamond mining" x={170} y={530} size={64} rot={-3} at={t.at('diamond mining') - a - 2} />
  </AbsoluteFill>
);

/** "Prospectors fanned out across the West, hunting for diamond fields of their own." */
const Fever: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_fever" size={sz(fever)} glowLayer={(fever as L).glowLayer} a={0} b={b - a + 8} cam={{z: [1.06, 1.18], x: [-40, 20], y: [0, -16]}} />
    <Note text="hunting for their own" x={660} y={150} size={64} rot={-3} at={t.at('hunting') - a - 2} />
  </AbsoluteFill>
);

/** "People called it diamond fever." The line in the paper, swiped. (The DIAMOND FEVER tape sits above the scenes.) */
const FeverLine: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const [x, y, w] = FEVER_LINE[0];
  return (
    <Paper keys={[[0, {x: x + w / 2 + 40, y: y + 20, z: 2.05, tilt: 4, rot: -1.5}], [90, {x: x + w / 2 + 20, y: y + 18, z: 2.2, tilt: 3, rot: -1}]]}>
      <Swipe lines={FEVER_LINE} from={t.at('diamond fever') - a - 4} to={t.at('fever') - a + 14} seed="fev" />
    </Paper>
  );
};

/** "That's move five: the rush." The prospectors again (the Con Card pops in above the scenes). */
const Rush: React.FC<{a: number; b: number}> = ({a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_fever" size={sz(fever)} glowLayer={(fever as L).glowLayer} a={-6} b={b - a + 8} cam={{z: [1.22, 1.12], x: [60, 20], y: [-30, -20]}} fade={2} />
  </AbsoluteFill>
);

/** "Once everybody important is buying in, nobody wants to be the one asking questions. They just want in before it's gone." */
const FAN = [
  {x: 330, y: 190, r: -14}, {x: 560, y: 140, r: -7}, {x: 790, y: 120, r: 0}, {x: 1020, y: 140, r: 7}, {x: 1250, y: 190, r: 14},
];
const Everyone: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const grab = t.at('want in') - a + 2;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={960} y={400} rx={820} ry={470} a={0.13} />
      {FAN.map((c, i) => {
        // grabbed one by one: each flies off toward a different edge
        const t0 = grab + [6, 0, 12, 3, 9][i] * 1.6;
        const k = interpolate(g, [t0, t0 + 6], [0, 1], {...clamp, easing: (u) => u * u});
        const dir = [[-1, -0.6], [-0.4, -1], [0.2, -1], [0.6, -1], [1, -0.5]][i];
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: 0, transform: `translate(${dir[0] * k * 1300}px, ${dir[1] * k * 1100}px)`}}>
            <Prop name="share_certificate" x={c.x} y={c.y} w={340} at={2 + i * 2} rot={c.r} from="top" z={i} />
          </div>
        );
      })}
      <Note text="everybody's in" x={160} y={700} size={66} rot={-3} at={t.at('everybody important') - a - 2} />
      <Note text="questions?" x={300} y={810} size={70} rot={-4} at={t.at('asking questions') - a - 2} />
      <Strike x1={290} y1={874} x2={640} y2={850} at={t.at('questions') - a + 8} />
      <Note text="before it's gone" x={760} y={560} size={76} rot={-5} at={t.at("before it's gone") - a - 2} />
    </AbsoluteFill>
  );
};

/** "And that's exactly when a smart con man leaves. Move six: the exit." Arnold and Slack, on a lamp pool. */
const Leave: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 190], [1, 1.05], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '760px 600px'}}>
        <Lamp x={760} y={620} rx={700} ry={480} a={0.13} />
        <Figure who="arnold" x={540} y={900} h={640} at={2} />
        <Figure who="slack" x={1000} y={900} h={620} at={5} />
      </AbsoluteFill>
      <Highlight text="KNOW WHEN TO LEAVE" x={120} y={90} size={84} at={t.at('leaves') - a} seed={64} rot={-2} />
    </AbsoluteFill>
  );
};

/** "Most crooks get greedy and stay one round too long. The cousins didn't." Closer; they walk out. */
const Greedy: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const go = t.at("didn't") - a + 4;
  const k = interpolate(g, [go, go + 16], [0, 1], {...clamp, easing: (u) => u * u});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={860} y={640} rx={760} ry={520} a={0.14} />
      <Figure who="arnold" x={640} y={1010} h={800} at={-10} dx={k * 1100} fade={1 - k} label={k > 0 ? false : undefined} />
      <Figure who="slack" x={1080} y={1010} h={770} at={-10} dx={k * 1000} fade={1 - k} label={k > 0 ? false : undefined} />
      <Note text="most crooks stay one round too long" x={130} y={110} size={60} rot={-3} at={t.at('stay one round') - a - 2} />
      <Note text="not these two" x={180} y={520} size={74} rot={-5} at={t.at('The cousins') - a} />
    </AbsoluteFill>
  );
};

/** "The investors bought them out completely: about 15 million dollars for Arnold, nearly three million for Slack." */
const Buyout: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const z = interpolate(f, [0, 220], [1.03, 1], clamp);
  const off = interpolate(g, [t.at('for Slack') - a + 12, t.at('for Slack') - a + 22], [0, 1], {...clamp, easing: (u) => u * u});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '960px 600px'}}>
        <Lamp x={960} y={640} rx={820} ry={480} a={0.13} />
        <Figure who="arnold" x={500} y={930} h={540} at={-10} />
        <Figure who="slack" x={1420} y={930} h={520} at={-10} />
        <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${off * 1300}px, ${off * 120}px)`}}>
          <Prop name="banknotes_stack" x={760} y={560} w={420} at={t.at('bought') - a} rot={-6} from="top" />
        </div>
      </AbsoluteFill>
      <Money at={t.at('about 15') - a - 2} big="$15 million" small="about $550,000 in 1872" x={520} y={110} size={104} />
      <Money at={t.at('nearly three') - a - 2} big="$3 million" small="$100,000 in 1872" x={1400} y={110} size={104} />
      <Note text="bought out" x={790} y={430} size={58} rot={-4} at={t.at('bought them out') - a + 2} />
    </AbsoluteFill>
  );
};

/** "Arnold went home to Kentucky, a rich man. Slack just disappeared. For a few months, it looked like they'd gotten away with it." */
const Home: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <HomeMap goAt={t.at('went home') - a} arriveAt={t.at('rich man') - a} goneAt={t.at('disappeared') - a - 4} />
    <Note text="home, and rich" x={1250} y={330} size={64} rot={-4} at={t.at('rich man') - a} />
    <Note text="gone" x={330} y={300} size={70} rot={-5} at={t.at('disappeared') - a + 6} />
    <Note text="got away with it?" x={640} y={850} size={70} rot={-3} at={t.at('gotten away') - a - 2} />
  </AbsoluteFill>
);

/** "Then, in California, a geologist got on the wrong train. Or the right one." */
const Train: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_train" size={sz(train)} glowLayer={(train as L).glowLayer} a={0} b={b - a + 40} cam={{z: [1.04, 1.16], x: [-30, 10], y: [0, -12]}} />
    <Note text="a geologist" x={190} y={300} size={66} rot={-4} at={t.at('geologist') - a - 2} />
    <Highlight text="THE WRONG TRAIN" x={150} y={110} size={92} at={t.at('wrong train') - a} seed={65} rot={-2} />
    <Note text="...or the right one" x={1180} y={780} size={68} rot={-4} at={t.at('right one') - a - 2} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    names: at('The names') - 1, spread: at('And it spread') - 1, fever: at('Prospectors') - 1, line: at('People called') - 1,
    rush: at("That's move five") - 1, all: at('Once everybody') - 1, leave: at("And that's exactly") - 1, greedy: at('Most crooks') - 1,
    buy: at('The investors') - 1, home: at('Arnold went home') - 1, train: at('Then in California') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Sequence from={0} layout="none"><RealMoney t={t} a={0} /></Sequence>],
    [c.names, <Sequence from={c.names} layout="none"><Names t={t} a={c.names} /></Sequence>],
    [c.spread, <Sequence from={c.spread} layout="none"><Spread t={t} a={c.spread} /></Sequence>],
    [c.fever, <Sequence from={c.fever} layout="none"><Fever t={t} a={c.fever} b={c.line} /></Sequence>],
    [c.line, <Sequence from={c.line} layout="none"><FeverLine t={t} a={c.line} /></Sequence>],
    [c.rush, <Sequence from={c.rush} layout="none"><Rush a={c.rush} b={c.all} /></Sequence>],
    [c.all, <Sequence from={c.all} layout="none"><Everyone t={t} a={c.all} /></Sequence>],
    [c.leave, <Sequence from={c.leave} layout="none"><Leave t={t} a={c.leave} /></Sequence>],
    [c.greedy, <Sequence from={c.greedy} layout="none"><Greedy t={t} a={c.greedy} /></Sequence>],
    [c.buy, <Sequence from={c.buy} layout="none"><Buyout t={t} a={c.buy} /></Sequence>],
    [c.home, <Sequence from={c.home} layout="none"><Home t={t} a={c.home} /></Sequence>],
    [c.train, <Sequence from={c.train} layout="none"><Train t={t} a={c.train} b={END} /></Sequence>],
  ];
  const scene = useScene(cuts);
  // the Con Card: small, lower right, 3-4 s; rows 1-4 faint, the new row in full
  const faint = (n: number) => ({n, at: -999, faint: true});
  const five = at('move five') - 1, six = at('Move six') - 1;
  const tapes = ['real money', 'list', 'spread', 'diamond fever', 'leaves', 'wrong train'];
  const notes = ['new company', 'in stock', 'generals', 'Rothschild', 'Tiffany', 'how-to', 'diamond mining', 'hunting', 'everybody important', 'asking questions',
    "before it's gone", 'stay one round', 'The cousins', 'bought them out', 'rich man', 'gotten away', 'geologist', 'right one'];
  return (
    <>
      {scene}
      {/* DIAMOND FEVER: lands on the swiped line and stays over the prospectors as the rush is named */}
      <Sequence from={at('diamond fever') - 2} durationInFrames={c.all - at('diamond fever') + 2} layout="none">
        <Highlight text="DIAMOND FEVER" x={120} y={110} size={100} at={0} seed={66} rot={-3} />
      </Sequence>
      <ConCard x={1380} y={600} scale={0.7} at={five} out={five + 108} rows={[faint(1), faint(2), faint(3), faint(4), {n: 5, at: at('the rush') - 1}]} />
      <ConCard x={1380} y={600} scale={0.7} at={six} out={six + 108} rows={[faint(1), faint(2), faint(3), faint(4), faint(5), {n: 6, at: at('the exit') - 1}]} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {tapes.map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.27} />)}
      {['generals', 'Rothschild', 'Tiffany'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/stamp.wav" volume={0.22} />)}
      {['quarter', 'about 15', 'nearly three'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.3} />)}
      {[five, six, at('the rush') - 1, at('the exit') - 1].map((f, i) => <Sfx key={`cc${i}`} at={f} src="sfx/tick_soft.wav" volume={0.4} />)}
      <Sfx at={c.spread} src="sfx/paper_rustle.wav" volume={0.3} />
      <Sfx at={at('diamond fever') - 4} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at('want in') + 2} src="sfx/paper_rustle.wav" volume={0.3} />
      <Sfx at={at('bought')} src="sfx/paper_rustle.wav" volume={0.25} />
      {notes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume} />)}
    </>
  );
};

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_cash_out.wav" lead={LEAD} music={[{src: 'music/aw_boomtown_rush.mp3', volume: bed('aw_boomtown_rush')}]}>
    <Body />
  </ChapterShell>
);
