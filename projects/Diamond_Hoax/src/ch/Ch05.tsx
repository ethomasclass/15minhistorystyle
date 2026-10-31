// Chapter 5 · The Long Way Around (114 s). Scene plan: script/SCENES.md "ch05"; build brief: script/BUILD_BRIEF.md.
// Every cut lands 1 frame before the word that starts its idea; each scene sits in a <Sequence from={cut}>, so its beats
// are passed relative to the cut (t.at(...) - a).
//   0:00  "there was no diamond field"                  the empty mesa (picks up ch 4's last shot)
//   0:05  "There was a bag." / "made one"                the bag alone, coral; the cousins (silhouettes) step in
//   0:10  "Picture a flat, empty mesa"                   sil_salting (hero, slow parallax): sandstone, sagebrush, wind
//   0:22  "Pressing them into the dirt"                  the mesa: coral stones drop in (saltAt); the pointed stick
//   0:27  "That's called salting"                        vocab card over the stone pile
//   0:35  "June 1872. The investors' expert arrives"     A. J. Russell's Bitter Creek valley, 1868
//   0:40  "Henry Janin"                                  Janin's silhouette (no reliable photo), THE EXPERT
//   0:44  "Four days on horseback"                       sil_ride, the leader circled
//   0:47  "Arnold keeps getting lost"                    the looping ride; the blindfold "by one account"
//   0:55  "starts finding stones"                        the mesa: the patch glows (glowAt)
//   1:05  "staked a claim on about 3,000 acres"          the mesa: four stakes (stakesAt)
//   1:11  "selling shares in it"                         shares as slices (vocab), $1,000 a share
//   1:28  "And Janin would know"                         Janin's stack of 1,000: $250 -> $1,000
//   1:35  "About 800,000 dollars, for saying yes."       Janin + money tag $800,000 / $30,000
//   1:39  "that's move four: the proof"                  the glowing patch, close; Con Card row 4
//   1:47  "getting out with the money"                   the bag cinches and slides off the desk
import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch05_the_long_way_around.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {ConCard} from '../kit/conCard';
import {Mesa, MESA_CAM} from '../fx/Mesa';
import {LoopingRide} from '../fx/LoopingRide';
import {ShareSlices} from '../fx/ShareSlices';
import salting from '../../public/img/layers/sil/sil_salting/layers.json';
import ride from '../../public/img/layers/sil/sil_ride/layers.json';
import {Lamp, MoneyTag, Print, SilFigure} from './ch04/bits';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

type L = {size: number[]; glowLayer?: number};
const sz = (l: L) => l.size as [number, number];
const RUSSELL = {src: 'img/ch05/russell_bitter_creek_valley_union_pacific_1868.jpg', size: [2570, 1492] as [number, number], tag: 'A. J. Russell, 1868 · Library of Congress'};

/** "And that was a problem. Because there was no diamond field." The empty mesa, as ch 4 left it. */
const NoField: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Mesa at={-200} labels cam={[{f: 0, ...MESA_CAM.claim, dist: 11}, {f: 140, ...MESA_CAM.claim, dist: 10}]} />
    <Highlight text="NO DIAMOND FIELD" x={140} y={110} size={84} at={t.at('no diamond field') - a} seed={51} rot={-2} />
  </AbsoluteFill>
);

/** "There was a bag. So the cousins went out and made one." */
const Bag: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={960} y={560} r={620} a={0.13} />
    <Prop name="leather_pouch" x={690} y={330} w={540} at={0} coral trace from="top" />
    <Note text="just a bag" x={830} y={830} size={62} rot={-4} at={t.at('bag') - a + 4} />
    <SilFigure name="sil_arnold" x={250} y={290} h={560} at={t.at('cousins') - a - 1} label="PHILIP ARNOLD" from="left" />
    <SilFigure name="sil_slack" x={1450} y={290} h={560} at={t.at('cousins') - a + 2} label="JOHN SLACK" from="right" />
    <Highlight text="SO THEY MADE ONE" x={140} y={110} size={84} at={t.at('made one') - a} seed={52} rot={-2} />
  </AbsoluteFill>
);

/** "Picture a flat, empty mesa in northwest Colorado. Sandstone, sagebrush, wind. ... someone walked that ground with a bag of cheap stones." */
const Picture: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_salting" size={sz(salting)} glowLayer={(salting as L).glowLayer} a={0} b={b - a} cam={{z: [1.03, 1.2], x: [30, -20], y: [0, -24]}} fade={6} />
    <Highlight text="NORTHWEST COLORADO" x={140} y={110} size={76} at={t.at('northwest') - a} seed={53} rot={-2} />
    <Note text="sandstone," x={150} y={700} size={58} rot={-4} at={t.at('Sandstone') - a - 2} />
    <Note text="sagebrush," x={170} y={780} size={58} rot={-3} at={t.at('sagebrush') - a - 2} />
    <Note text="wind." x={190} y={860} size={58} rot={-4} at={t.at('wind') - a - 2} />
    <Note text="a bag of cheap stones" x={1130} y={815} size={56} rot={-4} at={t.at('cheap') - a - 2} />
  </AbsoluteFill>
);

/** "Pressing them into the dirt. Tucking them into cracks in the rock. Poking them into anthills." */
const Press: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Mesa at={-200} saltAt={t.at('Pressing') - a + 2} labels cam={[{f: 0, ...MESA_CAM.claim, dist: 8}, {f: 160, ...MESA_CAM.patch}]} />
    <Note text="into the dirt" x={1330} y={630} size={60} rot={-4} at={t.at('dirt') - a - 2} />
    <Note text="into cracks" x={1330} y={715} size={60} rot={-3} at={t.at('cracks') - a - 2} />
    <Note text="into anthills" x={1330} y={800} size={60} rot={-4} at={t.at('anthills') - a - 2} />
    <Prop name="pointed_stick" x={1360} y={150} w={400} at={t.at('Poking') - a - 1} rot={-6} from="top" />
  </AbsoluteFill>
);

/** "That's called salting: planting something valuable where a buyer is going to dig, so the ground looks richer than it is." */
const Salting: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={1450} y={600} r={560} a={0.12} />
    <Prop name="stone_pile" x={1230} y={420} w={520} at={1} coral from="none" />
    <Highlight text="SALTING" x={140} y={150} size={120} at={t.at('salting') - a} seed={54} rot={-2} />
    <Definition term="salting" def="planting something valuable where a buyer will dig, so the ground looks richer than it is" at={t.at('salting') - a + 8} x={140} y={340} w={1000} />
    <Note text="richer than it is" x={170} y={700} size={66} rot={-4} at={t.at('richer') - a - 2} />
  </AbsoluteFill>
);

/** "June 1872. The investors' expert arrives." Russell's view of the Bitter Creek country on the Union Pacific. */
const June: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print {...RUSSELL} x={180} y={230} w={1000} h={581} rot={-1.5} at={0} tagW={1000} />
    <Highlight text="JUNE 1872" x={140} y={110} size={84} at={t.at('June') - a} seed={55} rot={-2} />
    <Note text="southern Wyoming" x={1230} y={420} size={56} rot={-4} at={t.at('June') - a + 14} />
    <Note text="the expert arrives" x={1230} y={520} size={56} rot={-3} at={t.at('arrives') - a - 2} />
  </AbsoluteFill>
);

/** "Henry Janin, one of the best-known mining engineers in the country." */
const Janin: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <SilFigure name="sil_janin" x={360} y={240} h={620} at={0} label="HENRY JANIN" from="left" labelAt={8} />
    <Highlight text="THE EXPERT" x={800} y={280} size={100} at={t.at('Janin') - a + 2} seed={56} rot={-2} />
    <Note text="one of the best-known" x={830} y={460} size={58} rot={-4} at={t.at('best-known') - a - 4} />
    <Note text="mining engineers in the country" x={830} y={545} size={54} rot={-3} at={t.at('mining engineers') - a - 2} />
  </AbsoluteFill>
);

/** "Four days on horseback, with Arnold leading the way." */
const Ride: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="sil_ride" size={sz(ride)} glowLayer={(ride as L).glowLayer} a={0} b={b - a + 6} cam={{z: [1.04, 1.1], x: [-30, 10], y: [0, -6]}} fade={4} />
    <Note text="four days on horseback" x={150} y={830} size={62} rot={-3} at={t.at('Four days') - a + 2} />
    <Loop cx={420} cy={520} rx={120} ry={110} at={t.at('Arnold leading') - a} dur={10} width={6} seed={57} tilt={-8} />
    <Note text="Arnold, leading" x={250} y={300} size={60} rot={-4} at={t.at('Arnold leading') - a + 2} />
  </AbsoluteFill>
);

/** "And Arnold keeps getting lost. Doubling back. Going in circles. By one account, Janin was blindfolded for part of the ride." */
const Lost: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <LoopingRide at={-40} pinAt={-14} lineAt={-4} rideAt={t.at('lost') - a - 8} rideDur={100} />
    <Note text="doubling back" x={590} y={110} size={58} rot={-4} at={t.at('Doubling') - a - 2} />
    <Note text="going in circles" x={610} y={195} size={58} rot={-3} at={t.at('circles') - a - 2} />
  </AbsoluteFill>
);

/** "By one account, Janin was blindfolded for part of the ride." */
const Blind: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={900} y={560} r={680} a={0.11} />
    <SilFigure name="sil_janin" x={330} y={240} h={620} at={0} label="HENRY JANIN" from="none" labelAt={-10} />
    <Note text="by one account" x={980} y={240} size={64} rot={-4} at={2} />
    <Prop name="bandana_blindfold" x={930} y={430} w={640} at={t.at('blindfolded') - a - 1} rot={-5} coral trace from="top" />
    <Note text="blindfolded" x={1090} y={830} size={64} rot={-3} at={t.at('blindfolded') - a + 6} />
  </AbsoluteFill>
);

/** "Then they arrive. And almost right away, Janin's group starts finding stones. Diamonds. Rubies. Right there in the dirt." */
const Found: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Mesa at={-200} saltAt={-150} glowAt={t.at('finding') - a} labels cam={[{f: 0, ...MESA_CAM.wide}, {f: t.at('finding') - a, ...MESA_CAM.patch}]} />
    <Note text="diamonds." x={150} y={640} size={62} rot={-4} at={t.at('Diamonds') - a - 2} />
    <Note text="rubies." x={170} y={720} size={62} rot={-3} at={t.at('Rubies') - a - 2} />
    <Note text="right there in the dirt" x={190} y={800} size={58} rot={-4} at={t.at('Right there') - a - 2} />
  </AbsoluteFill>
);

/** "Janin was thrilled. He staked a claim on about 3,000 acres and wrote a glowing report." */
const Claim: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Mesa at={-200} saltAt={-150} glowAt={-100} stakesAt={t.at('staked') - a} labels cam={[{f: 0, ...MESA_CAM.patch}, {f: 70, ...MESA_CAM.claim}]} />
    <Highlight text="STAKED A CLAIM" x={140} y={110} size={84} at={t.at('staked') - a} seed={58} rot={-2} />
    <Note text="thrilled" x={1380} y={180} size={64} rot={-4} at={t.at('thrilled') - a - 2} />
    <Note text="a glowing report" x={1220} y={820} size={62} rot={-4} at={t.at('glowing') - a - 2} />
  </AbsoluteFill>
);

/** "...selling shares in it. A share is a small slice of ownership. If the company strikes it rich, every slice is worth more.
 *  Janin's report said those shares were easily worth about a thousand dollars each." */
const Shares: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <ShareSlices sliceAt={t.at('slice') - a} liftAt={t.at('strikes') - a} growAt={t.at('worth more') - a} />
    <Highlight text="SHARES" x={140} y={110} size={96} at={t.at('shares') - a} seed={59} rot={-2} />
    <Definition term="shares" def="small slices of ownership in a company" at={t.at('A share is') - a} x={140} y={860} />
    <Note text="Janin's report:" x={1340} y={340} size={56} rot={-4} at={t.at("Janin's report") - a - 2} />
    <MoneyTag at={t.at('thousand dollars') - a - 2} big="$1,000" small="a share · $40 in 1872" x={1580} y={470} size={130} />
  </AbsoluteFill>
);

/** "And Janin would know. He'd bought 1,000 of those shares at a quarter of that price, and sold them at full price." */
const Stack: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <ShareSlices sliceAt={-200} liftAt={-180} growAt={-160} stackAt={t.at("He'd bought") - a} priceAt={t.at('quarter') - a} fullAt={t.at('full price') - a} notes={false} />
    <Note text="and he would know" x={140} y={130} size={62} rot={-4} at={t.at('would know') - a - 2} />
  </AbsoluteFill>
);

/** "About 800,000 dollars, for saying yes." */
const Paid: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <SilFigure name="sil_janin" x={330} y={230} h={620} at={0} label="HENRY JANIN" from="none" labelAt={-10} />
      <MoneyTag at={t.at('800000') - a - 2} big="$800,000" small="about $30,000 in 1872" x={1180} y={330} />
      <Note text="for saying yes." x={920} y={680} size={76} rot={-4} color={pal.subject} at={t.at('saying yes') - a - 2} />
    </AbsoluteFill>
  );
};

/** "But he'd seen it with his own eyes. And that's move four: the proof. Don't tell the mark it's real. Let him dig it up himself." */
const Proof: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const card = t.at('move four') - a;
  return (
    <AbsoluteFill>
      <Mesa at={-200} saltAt={-150} glowAt={-100} labels={false} cam={[{f: 0, ...MESA_CAM.patch}, {f: 200, ...MESA_CAM.ring, dist: 4.2}]} />
      <Note text="with his own eyes" x={150} y={245} size={62} rot={-4} at={t.at('own eyes') - a - 2} />
      <Highlight text="THE PROOF" x={140} y={110} size={96} at={t.at('the proof') - a} seed={60} rot={-2} />
      <ConCard x={1350} y={560} scale={0.7} at={card} out={card + 110}
        rows={[{n: 1, at: -999, faint: true}, {n: 2, at: -999, faint: true}, {n: 3, at: -999, faint: true}, {n: 4, at: t.at('the proof') - a}]} />
      <Note text="let him dig it up himself" x={150} y={830} size={64} rot={-3} at={t.at('dig it up') - a - 2} />
    </AbsoluteFill>
  );
};

/** "That left two moves. And the last one is the hardest in any con: getting out with the money." The bag cinches and slides off. */
const Exit: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const cinch = interpolate(f, [t.at('hardest') - a, t.at('hardest') - a + 8], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const go = t.at('money') - a + 34; // leave as the chapter fades, not before (no empty desk)
  const slide = interpolate(f, [go, go + 22], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={960} y={580} r={620} a={0.13} />
      <AbsoluteFill style={{transform: `translateX(${slide * 1350}px) rotate(${slide * 8}deg) scale(${1 - 0.1 * cinch}, ${1 + 0.06 * cinch})`, transformOrigin: '960px 820px'}}>
        <Prop name="leather_pouch" x={690} y={330} w={540} at={0} coral trace from="none" />
      </AbsoluteFill>
      <Note text="two moves left" x={1250} y={260} size={62} rot={-4} at={t.at('two moves') - a - 2} />
      <Highlight text="GETTING OUT" x={140} y={110} size={84} at={t.at('getting out') - a} seed={61} rot={-2} />
      <Note text="...with the money" x={180} y={245} size={64} rot={-3} at={t.at('money') - a} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    bag: at('There was a bag') - 1, pic: at('Picture') - 1, press: at('Pressing') - 1, salt: at("That's called") - 1, june: at('June') - 1,
    janin: at('Henry Janin') - 1, ride: at('Four days') - 1, lost: at('And Arnold keeps') - 1, blind: at('By one account') - 1, found: at('Then they arrive') - 1,
    claim: at('Janin was thrilled') - 1, shares: at('By now') - 1, stack: at('And Janin would know') - 1, paid: at('About 800000') - 1,
    proof: at("But he'd seen") - 1, exit: at('That left') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Sequence from={0} layout="none"><NoField t={t} a={0} /></Sequence>],
    [c.bag, <Sequence from={c.bag} layout="none"><Bag t={t} a={c.bag} /></Sequence>],
    [c.pic, <Sequence from={c.pic} layout="none"><Picture t={t} a={c.pic} b={c.press} /></Sequence>],
    [c.press, <Sequence from={c.press} layout="none"><Press t={t} a={c.press} /></Sequence>],
    [c.salt, <Sequence from={c.salt} layout="none"><Salting t={t} a={c.salt} /></Sequence>],
    [c.june, <Sequence from={c.june} layout="none"><June t={t} a={c.june} /></Sequence>],
    [c.janin, <Sequence from={c.janin} layout="none"><Janin t={t} a={c.janin} /></Sequence>],
    [c.ride, <Sequence from={c.ride} layout="none"><Ride t={t} a={c.ride} b={c.lost} /></Sequence>],
    [c.lost, <Sequence from={c.lost} layout="none"><Lost t={t} a={c.lost} /></Sequence>],
    [c.blind, <Sequence from={c.blind} layout="none"><Blind t={t} a={c.blind} /></Sequence>],
    [c.found, <Sequence from={c.found} layout="none"><Found t={t} a={c.found} /></Sequence>],
    [c.claim, <Sequence from={c.claim} layout="none"><Claim t={t} a={c.claim} /></Sequence>],
    [c.shares, <Sequence from={c.shares} layout="none"><Shares t={t} a={c.shares} /></Sequence>],
    [c.stack, <Sequence from={c.stack} layout="none"><Stack t={t} a={c.stack} /></Sequence>],
    [c.paid, <Sequence from={c.paid} layout="none"><Paid t={t} a={c.paid} /></Sequence>],
    [c.proof, <Sequence from={c.proof} layout="none"><Proof t={t} a={c.proof} /></Sequence>],
    [c.exit, <Sequence from={c.exit} layout="none"><Exit t={t} a={c.exit} /></Sequence>],
  ];
  const scene = useScene(cuts);
  // sound: whoosh per cut, stamp per tape title and money tag, the marker before each note, ticks on the card and the stakes
  const titles = ['no diamond field', 'made one', 'northwest', 'salting', 'June', 'shares', 'the proof', 'getting out'];
  const notes = ['bag', 'Sandstone', 'sagebrush', 'wind', 'cheap', 'dirt', 'cracks', 'anthills', 'richer', 'arrives', 'best-known', 'mining engineers',
    'Doubling', 'circles', 'blindfolded', 'Diamonds', 'Rubies', 'Right there', 'thrilled', 'glowing', "Janin's report", 'would know', 'saying yes', 'own eyes',
    'dig it up', 'two moves'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {titles.map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.27} />)}
      <Sfx at={at('Janin') + 2} src="sfx/stamp.wav" volume={0.27} />
      <Sfx at={at('staked')} src="sfx/stamp.wav" volume={0.27} />
      {['thousand dollars', '800000'].map((p) => <Sfx key={p} at={at(p) - 2} src="sfx/stamp.wav" volume={0.32} />)}
      {notes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      {[0, 7, 14, 21].map((k) => <Sfx key={k} at={at('staked') + k + 5} src="sfx/tick.wav" volume={0.35} />)}
      {['Poking', 'blindfolded'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/paper_rustle.wav" volume={0.22} />)}
      <Sfx at={at('move four')} src="sfx/tick.wav" volume={0.45} />
      <Sfx at={at('money') - 4} src="sfx/whoosh.wav" volume={0.25} />
    </>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_the_long_way_around.wav" lead={LEAD} music={[{src: 'music/aw_long_drive.mp3', volume: bed('aw_long_drive')}]}>
    <Body />
  </ChapterShell>
);
