// Chapter 2 · Too Late for the Bank (83 s). Scene plan: script/SCENES.md "ch02"; build brief: script/BUILD_BRIEF.md.
// Every cut lands 1 frame before the word that starts its idea; each scene sits in a <Sequence from={cut}> so its beats are
// passed relative to the cut (t.at(...) - a). Arnold and Slack have no reliable photos: silhouette figures with mono labels.
//   0:00  "San Francisco" the night street (sil_sf_night), the promoter's lit window
//   0:08  "They're cousins" the two silhouettes, named
//   0:12  "And Arnold is holding" the pouch, coral, shaking "like it might bite him"
//   0:15  "They'd meant to leave it" the Bank of California, c. 1867; "too late" the watch
//   0:20  "Could he keep it safe?" back to the bag; "what's in it?"
//   0:24  "The cousins hesitate" the silhouettes face each other; the loop on the bag: "lets it slip"
//   0:30  "Rough diamonds" the bag tips, the stones spill, the diamond coral; vocab card
//   0:34  "From where?" a blank map of the West, a big teal "?"
//   0:42  "That's how a con starts" the mark (top hat in the crosshair), vocab card
//   0:49  "Move one: the bait" hat and bag; the Con Card pops in (rows 1-2)
//   0:53  "Move two: play hard to get" the bag slides out of reach
//   1:02  "And our promoter" the night street again: the bank next door
//   1:07  "That banker was William Ralston" Ralston cut out, coral; the bank; "biggest money man"
//   1:17  "Which raises a question" Ralston and the bag, a "?"
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch02_too_late_for_the_bank.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, Loop, Note, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {ConCard} from '../kit/conCard';
import sfNight from '../../public/img/layers/sil/sil_sf_night/layers.json';
import {DrawnQ, Figure, LampPool, Print, RalstonCut, RALSTON_TAG, WEST_ASPECT, WestMap, westPoint} from './ch02/parts';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

type L = {size: number[]; glowLayer?: number};
const SF = {size: sfNight.size as [number, number], glow: (sfNight as L).glowLayer};
const BANK = 'img/ch02/bank_of_california_lawrence_houseworth_c1867.jpg';
const BANK_TAG = 'Lawrence & Houseworth, c. 1867 · Library of Congress';
const NO_PHOTO = 'no reliable photo';

/** A slow push on the whole shot (one camera move per shot). */
const Push: React.FC<{z?: [number, number]; dur: number; ox?: number; oy?: number; children: React.ReactNode}> = ({z = [1, 1.05], dur, ox = 960, oy = 540, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{transform: `scale(${interpolate(f, [0, dur], z, clamp)})`, transformOrigin: `${ox}px ${oy}px`}}>{children}</AbsoluteFill>;
};

/** "San Francisco, about 150 years ago. Late one evening, two scruffy men show up at a mining promoter's office." */
const Night: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_sf_night" size={SF.size} glowLayer={SF.glow} a={0} b={b - a + 8} fade={6} cam={{z: [1.03, 1.09], x: [-20, 0], y: [0, -6]}} />
    <Highlight text="SAN FRANCISCO, 1870" x={130} y={110} size={88} at={t.at('San') - a} seed={201} rot={-2} />
    <Note text="late one evening" x={150} y={260} size={60} rot={-4} at={t.at('Late') - a - 2} />
    <Loop cx={1112} cy={478} rx={70} ry={92} at={t.at('mining') - a} dur={10} width={6} seed={202} tilt={-3} />
    <Note text="a mining promoter" x={1210} y={150} size={56} rot={-3} at={t.at("promoter's") - a - 2} />
    <Arrow x1={1330} y1={250} x2={1165} y2={420} bow={-30} at={t.at('office') - a} />
  </AbsoluteFill>
);

const SLACK_X = 690, ARNOLD_X = 1230, FEET = 930, FIG_H = 640;

/** "They're cousins. Philip Arnold and John Slack." */
const Cousins: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <LampPool y={600} r={760} a={0.14} />
    <Push dur={110} z={[1, 1.04]} oy={620}>
      <Figure who="arnold" x={ARNOLD_X} y={FEET} h={FIG_H} at={t.at('Philip') - a - 1} label={`Philip Arnold · ${NO_PHOTO}`} />
      <Figure who="slack" x={SLACK_X} y={FEET} h={FIG_H} at={t.at('John') - a - 1} label={`John Slack · ${NO_PHOTO}`} />
    </Push>
    <Highlight text="THE COUSINS" x={130} y={110} size={92} at={t.at('cousins') - a} seed={203} rot={-2} />
  </AbsoluteFill>
);

/** "And Arnold is holding a small leather bag like it might bite him." */
const Bag: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const bite = t.at('like it might') - a;
  // nervous: a small tremble, sharper from "like it might bite him"
  const amp = f < bite ? 1.5 : 5;
  const jx = Math.sin(f * 2.1) * amp, jr = Math.sin(f * 1.3 + 1) * amp * 0.4;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <LampPool x={960} y={600} r={620} a={0.16} />
      <AbsoluteFill style={{transform: `translate(${jx}px, 0) rotate(${jr}deg)`, transformOrigin: '960px 600px'}}>
        <Prop name="leather_pouch" x={680} y={330} w={560} at={t.at('small leather bag') - a - 2} coral trace from="top" />
      </AbsoluteFill>
      <Note text="like it might bite" x={1150} y={210} size={64} rot={-5} at={bite - 2} />
      <Note text="a small leather bag" x={150} y={210} size={58} rot={-4} at={t.at('small leather bag') - a} />
    </AbsoluteFill>
  );
};

/** "They'd meant to leave it at the Bank of California, they explain. But it was too late in the day." */
const Bank: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Push dur={150} z={[1, 1.04]} ox={640} oy={560}>
      <Print src={BANK} x={190} y={240} w={900} h={660} rot={-2} pos="35% 45%" zoom={1.12} at={t.at('Bank') - a - 3} tag={BANK_TAG} />
    </Push>
    <Highlight text="BANK OF CALIFORNIA" x={170} y={110} size={78} at={t.at('Bank') - a} seed={204} rot={-2} />
    <Highlight text="TOO LATE" x={1240} y={250} size={104} at={t.at('too late') - a} seed={205} rot={-4} />
    <Prop name="pocket_watch" x={1300} y={440} w={330} at={t.at('too late') - a - 1} rot={6} from="top" />
    <Note text="closed for the day" x={1190} y={820} size={56} rot={-4} at={t.at('in the day') - a - 2} />
  </AbsoluteFill>
);

/** "Could he keep it safe? Naturally, he asks what's in it." */
const Safe: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <LampPool x={820} y={600} r={620} a={0.16} />
    <Push dur={130} z={[1.02, 1.1]} ox={820} oy={600}>
      <Prop name="leather_pouch" x={560} y={340} w={520} at={-2} coral from="none" />
    </Push>
    <Note text="keep it safe?" x={1220} y={290} size={66} rot={-4} at={t.at('safe') - a - 2} />
    <Note text="what's in it?" x={1240} y={560} size={66} rot={-3} at={t.at("what's in it") - a - 2} />
  </AbsoluteFill>
);

/** "The cousins hesitate. They look at each other. Finally, Arnold lets it slip." */
const Hesitate: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const look = t.at('look at') - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <LampPool y={600} r={760} a={0.14} />
      <Push dur={170} z={[1.04, 1.0]} oy={600}>
        <Figure who="slack" x={SLACK_X} y={FEET} h={FIG_H} at={-6} label={`John Slack · ${NO_PHOTO}`} labelAt={-6} />
        <Figure who="arnold" x={ARNOLD_X} y={FEET} h={FIG_H} at={-6} label={`Philip Arnold · ${NO_PHOTO}`} labelAt={-6} />
      </Push>
      <Note text="they hesitate..." x={140} y={170} size={60} rot={-4} at={t.at('hesitate') - a - 2} />
      <Arrow x1={800} y1={340} x2={1100} y2={340} bow={-40} at={look} />
      <Arrow x1={1100} y1={400} x2={800} y2={400} bow={-40} at={look + 6} />
      <Loop cx={1095} cy={548} rx={72} ry={88} at={t.at('lets it slip') - a} dur={10} width={6} seed={206} tilt={-6} />
      <Note text="lets it slip" x={1420} y={470} size={62} rot={-4} at={t.at('lets it slip') - a + 2} />
    </AbsoluteFill>
  );
};

/** "Rough diamonds. Uncut, the way they come out of the ground." */
const Rough: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const spill = t.at('Rough') - a - 2;
  const k = interpolate(g, [spill, spill + 10], [0, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <LampPool x={900} y={620} r={700} a={0.16} />
      <Push dur={120} z={[1, 1.05]} ox={1000} oy={600}>
        {/* the bag tipped on its side, the stones spilling out of its mouth */}
        <Prop name="leather_pouch" x={240} y={380} w={430} rot={-72} at={-4} from="none" />
        <AbsoluteFill style={{transform: `translate(${(1 - k) * -330}px, ${(1 - k) * 40}px) scale(${0.35 + 0.65 * k})`, transformOrigin: '640px 600px', opacity: Math.min(1, k * 3)}}>
          <Prop name="stone_pile" x={640} y={390} w={480} at={spill} from="none" />
        </AbsoluteFill>
        <Prop name="rough_diamond" x={1180} y={470} w={300} at={spill + 8} coral trace from="top" />
      </Push>
      <Highlight text="ROUGH DIAMONDS" x={130} y={110} size={92} at={t.at('Rough') - a} seed={207} rot={-2} />
      <Definition term="rough diamonds" def="uncut, the way they come out of the ground" at={t.at('Uncut') - a - 2} x={140} y={850} w={1400} />
    </AbsoluteFill>
  );
};

const MAP_H = 800;
const MAP_BOX: [number, number, number, number] = [780, 150, Math.round(MAP_H * WEST_ASPECT), MAP_H];

/** "From where? They won't say. Somewhere out West. Somewhere secret. And he has to swear he won't tell a soul." */
const Secret: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const [qx, qy] = westPoint(MAP_BOX, -111, 42.5);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <WestMap box={MAP_BOX} at={-3} cam={[[0, 1, qx, qy], [b - a, 1.07, qx, qy]]}>
        <DrawnQ x={qx - 95} y={qy - 170} size={300} at={t.at('Somewhere out West') - a} dur={14} />
        <Tag text="Map drawn for the series · Natural Earth coastlines" x={MAP_BOX[0] + 30} y={MAP_BOX[1] + MAP_H + 18} />
      </WestMap>
      <Note text="from where?" x={140} y={190} size={60} rot={-4} at={t.at('From where') - a - 2} />
      <Note text="they won't say" x={140} y={330} size={60} rot={-3} at={t.at("won't say") - a - 2} />
      <Note text="swear: not a soul" x={140} y={470} size={60} rot={-4} at={t.at('swear') - a - 2} />
      <Highlight text="SOMEWHERE SECRET" x={110} y={820} size={78} at={t.at('Somewhere secret') - a} seed={208} rot={-2} />
    </AbsoluteFill>
  );
};

/** "That's how a con starts. In a con, the person being fooled is called the mark." */
const Mark: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const m = t.at('mark') - a;
  const cross = interpolate(g, [m, m + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <LampPool x={900} y={560} r={600} a={0.15} />
      <Push dur={180} z={[1, 1.06]} ox={900} oy={560}>
        <Prop name="top_hat" x={720} y={340} w={360} at={-2} from="top" />
        <Loop cx={900} cy={540} rx={270} ry={270} at={m} dur={10} width={6} seed={209} />
        {g >= m && (
          <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
            {[[900, 240, 900, 330], [900, 750, 900, 830], [580, 540, 690, 540], [1110, 540, 1220, 540]].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * cross} y2={y1 + (y2 - y1) * cross} stroke="#2FE0C4" strokeWidth={6} strokeLinecap="round" />
            ))}
          </svg>
        )}
      </Push>
      <Note text="how a con starts" x={140} y={190} size={60} rot={-4} at={t.at('con starts') - a - 2} />
      <Highlight text="THE MARK" x={1210} y={190} size={104} at={m} seed={210} rot={-3} />
      <Definition term="the mark" def="the person being fooled in a con" at={m + 8} x={140} y={875} w={1300} />
    </AbsoluteFill>
  );
};

/** "Move one: the bait. Show the mark something he already wants." The Con Card sits lower left (drawn in Body). */
const Bait: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <LampPool x={1060} y={580} r={680} a={0.15} />
    <Push dur={140} z={[1, 1.04]} ox={1100} oy={560}>
      <Prop name="top_hat" x={660} y={380} w={300} at={-2} from="none" />
      <Prop name="leather_pouch" x={1220} y={370} w={440} at={t.at('the bait') - a - 2} coral trace from="top" />
      <Arrow x1={960} y1={560} x2={1200} y2={560} bow={-30} at={t.at('already wants') - a} />
    </Push>
    <Highlight text="THE BAIT" x={1180} y={150} size={104} at={t.at('the bait') - a} seed={211} rot={-3} />
    <Note text="something he already wants" x={640} y={810} size={52} rot={-3} at={t.at('something he') - a - 2} />
  </AbsoluteFill>
);

/** "Move two: play hard to get. Don't sell it. Make him chase it. Nothing makes a man want something like being told he can't have it." */
const HardToGet: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const away = t.at("Don't sell") - a;
  const dx = interpolate(f, [away, away + 40], [0, 150], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  const dy = interpolate(f, [away, away + 40], [0, -40], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <LampPool x={1060} y={580} r={680} a={0.15} />
      <Prop name="top_hat" x={640} y={380} w={300} at={-6} from="none" />
      <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) rotate(${dx * 0.02}deg)`}}>
        <Prop name="leather_pouch" x={1220} y={370} w={440} at={-6} coral trace from="none" />
      </AbsoluteFill>
      <Arrow x1={960} y1={600} x2={1380} y2={640} bow={-50} at={t.at('chase') - a} dur={10} />
      <Highlight text="PLAY HARD TO GET" x={640} y={150} size={96} at={t.at('play hard') - a} seed={212} rot={-2} />
      <Note text="make him chase it" x={640} y={790} size={58} rot={-3} at={t.at('chase') - a - 2} />
      <Note text="you can't have it" x={1150} y={845} size={52} rot={-4} at={t.at("can't have it") - a - 2} />
    </AbsoluteFill>
  );
};

/** "And our promoter kept his promise for about as long as it took to find a banker." The bank next door. */
const Kept: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_sf_night" size={SF.size} glowLayer={SF.glow} a={-6} b={b - a + 8} fade={6} cam={{z: [1.06, 1.12], x: [-40, -70], y: [-6, -12]}} />
    <Note text="kept his promise..." x={150} y={180} size={60} rot={-4} at={t.at('kept') - a - 2} />
    <Arrow x1={1180} y1={420} x2={1440} y2={450} bow={-60} at={t.at('find a banker') - a} dur={10} />
    <Highlight text="FIND A BANKER" x={1120} y={170} size={86} at={t.at('find a banker') - a + 4} seed={213} rot={-3} />
  </AbsoluteFill>
);

/** "That banker was William Ralston. He ran the Bank of California, ... the biggest money man on the West Coast." */
const Ralston: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <LampPool x={480} y={540} r={560} a={0.12} />
    <RalstonCut x={170} y={150} h={760} at={t.at('William') - a - 2} push={0.03} pushDur={280} />
    <Highlight text="WILLIAM RALSTON" x={900} y={150} size={86} at={t.at('William') - a} seed={214} rot={-2} />
    <Print src={BANK} x={880} y={350} w={480} h={390} rot={2} pos="35% 45%" zoom={1.12} at={t.at('Bank of California', 2) - a - 1} tag={BANK_TAG} />
    <Note text="the same bank" x={1410} y={440} size={50} rot={-5} at={t.at('same bank') - a - 2} />
    <Note text="biggest money man out West" x={900} y={820} size={52} rot={-3} at={t.at('biggest money man') - a - 2} />
    <Tag text={RALSTON_TAG} />
  </AbsoluteFill>
);

/** "Which raises a question. Why would a man like that believe two guys with a bag?" */
const Question: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <LampPool x={960} y={580} r={820} a={0.12} />
    <Push dur={200} z={[1, 1.05]} oy={560}>
      <RalstonCut x={150} y={240} h={680} at={-4} tint={false} traceAt={-4} />
      <Prop name="leather_pouch" x={1250} y={430} w={420} at={t.at('two guys') - a - 2} coral trace from="top" />
      <DrawnQ x={880} y={380} size={280} at={t.at('question') - a} dur={12} />
    </Push>
    <Highlight text="WHY BELIEVE THEM?" x={720} y={120} size={86} at={t.at('Why would') - a} seed={215} rot={-2} />
    <Note text="two guys with a bag" x={1150} y={840} size={52} rot={-4} at={t.at('two guys') - a} />
    <Tag text={RALSTON_TAG} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    cousins: at("They're cousins") - 1, bag: at('And Arnold') - 1, bank: at("They'd meant") - 1, safe: at('Could he') - 1,
    hes: at('The cousins hesitate') - 1, rough: at('Rough') - 1, secret: at('From where') - 1, mark: at("That's how") - 1,
    bait: at('Move one') - 1, hard: at('Move two') - 1, promise: at('And our promoter') - 1, ralston: at('That banker') - 1,
    q: at('Which raises') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Night t={t} a={0} b={c.cousins} />],
    [c.cousins, <Sequence from={c.cousins} layout="none"><Cousins t={t} a={c.cousins} /></Sequence>],
    [c.bag, <Sequence from={c.bag} layout="none"><Bag t={t} a={c.bag} /></Sequence>],
    [c.bank, <Sequence from={c.bank} layout="none"><Bank t={t} a={c.bank} /></Sequence>],
    [c.safe, <Sequence from={c.safe} layout="none"><Safe t={t} a={c.safe} /></Sequence>],
    [c.hes, <Sequence from={c.hes} layout="none"><Hesitate t={t} a={c.hes} /></Sequence>],
    [c.rough, <Sequence from={c.rough} layout="none"><Rough t={t} a={c.rough} /></Sequence>],
    [c.secret, <Sequence from={c.secret} layout="none"><Secret t={t} a={c.secret} b={c.mark} /></Sequence>],
    [c.mark, <Sequence from={c.mark} layout="none"><Mark t={t} a={c.mark} /></Sequence>],
    [c.bait, <Sequence from={c.bait} layout="none"><Bait t={t} a={c.bait} /></Sequence>],
    [c.hard, <Sequence from={c.hard} layout="none"><HardToGet t={t} a={c.hard} /></Sequence>],
    [c.promise, <Sequence from={c.promise} layout="none"><Kept t={t} a={c.promise} b={c.ralston} /></Sequence>],
    [c.ralston, <Sequence from={c.ralston} layout="none"><Ralston t={t} a={c.ralston} /></Sequence>],
    [c.q, <Sequence from={c.q} layout="none"><Question t={t} a={c.q} /></Sequence>],
  ];
  // the Con Card: one appearance for moves 1 and 2, small, lower left, over the hat-and-bag shots (no document on screen)
  const conAt = at('Move one') - 2, conOut = at('Make him');
  const highlights = ['San', 'cousins', 'Bank', 'too late', 'Rough', 'Somewhere secret', 'mark', 'the bait', 'play hard', 'William', 'Why would'];
  const notes = ['Late', "promoter's", 'small leather bag', 'like it might', 'in the day', 'safe', "what's in it", 'hesitate', 'lets it slip',
    'From where', "won't say", 'swear', 'con starts', 'something he', 'chase', "can't have it", 'kept', 'same bank', 'biggest money man', 'two guys'];
  return (
    <>
      {useScene(cuts)}
      <ConCard x={110} y={540} scale={0.8} at={conAt} out={conOut} rows={[{n: 1, at: at('the bait')}, {n: 2, at: at('play hard to get')}]} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {highlights.map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.27} />)}
      <Sfx at={at('find a banker') + 4} src="sfx/stamp.wav" volume={0.27} />
      {notes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      {['small leather bag', 'Bank', 'too late', 'the bait'].map((p) => <Sfx key={p} at={at(p) - 2} src="sfx/tick_soft.wav" volume={0.4} />)}
      <Sfx at={at('Rough') - 2} src="sfx/paper_rustle.wav" volume={0.3} />
      <Sfx at={conAt} src="sfx/page_turn.wav" volume={0.35} />
      <Sfx at={at('office')} src="sfx/knock.wav" volume={0.3} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_too_late_for_the_bank.wav" lead={LEAD} music={[{src: 'music/rc_backroom.mp3', volume: bed('rc_backroom')}]}>
    <Body />
  </ChapterShell>
);
