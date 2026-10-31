// Chapter 4 · The Tiffany Test (66 s). Scene plan: script/SCENES.md "ch04"; build brief: script/BUILD_BRIEF.md.
// Every cut lands 1 frame before the word that starts its idea; each scene sits in a <Sequence from={cut}>, so its beats
// are passed relative to the cut (t.at(...) - a).
//   0:00  "New York. A fancy house on Madison Avenue"     Madison Square c.1870 on the desk
//   0:04  "In the room: two famous Civil War generals"     McClellan, Butler (head only: broken plate), Greeley slap down
//   0:10  "And Charles Tiffany"                             Tiffany's engraving (coral, traced), his Union Square store
//   0:14  "The stones go out on the table"                  the stone pile
//   0:17  "holds them up to the light"                      the rough diamond (coral), the loupe, a light flare
//   0:21  "Gentlemen, these are beyond question..."         word-by-word quote, Charles L. Tiffany, 1871
//   0:26  "Two days later, his number"                      money tag $4 million / $150,000
//   0:32  "And if that was just a sample?"                  the bag swells; money tag $40 million / $1.5 million
//   0:38  "move three: borrowed trust"                      the cousins (silhouettes) vs Tiffany; Con Card row 3
//   0:47  "Here's what nobody asked"                        Tiffany's store; a cut brilliant vs a rough stone
//   0:55  "Now the money men were hooked"                   the H1 picture (the tycoon)
//   0:59  "they wanted one more thing"                      banknotes held back
//   1:02  "Somebody had to go stand on that diamond field." the empty mesa, push in, hold (the midpoint twist)
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch04_the_tiffany_test.words.json';
import tiffanyMask from '../../public/img/masks/ch04_tiffany.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {maskRef} from '../kit/maskref';
import {Prop} from '../kit/prop';
import {ConCard} from '../kit/conCard';
import {ColdOpenDepth} from '../fx/ColdOpenDepth';
import {Mesa, MESA_CAM} from '../fx/Mesa';
import {CutGem, Flare, Lamp, MoneyTag, Mono, Print, SilFigure, SyncQuote} from './ch04/bits';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

const TIFFANY = maskRef('ch04_tiffany', tiffanyMask);
const IMG = {
  madison: {src: 'img/ch04/madison_square_new_york_c1870.jpg', size: [4096, 3254] as [number, number], tag: 'Madison Square, c. 1870 · Library of Congress'},
  mcclellan: {src: 'img/ch04/mcclellan_george_brady_cdv_1861.jpg', size: [2123, 3359] as [number, number], tag: 'Brady, 1861 · Library of Congress'},
  butler: {src: 'img/ch04/butler_benjamin_brady_handy_c1870.jpg', size: [4438, 6000] as [number, number], tag: 'Brady-Handy, c. 1870 · Library of Congress'},
  greeley: {src: 'img/ch04/greeley_horace_engraving_walter_1872.jpg', size: [4908, 6000] as [number, number], tag: 'A. B. Walter, 1872 · Library of Congress'},
  tiffany: {src: 'img/ch04/tiffany_charles_engraving_1893.jpg', size: [1497, 2199] as [number, number], tag: 'Charles L. Tiffany and the House of Tiffany & Co., 1893'},
  store: {src: 'img/ch04/tiffany_store_union_square_c1870.jpg', size: [1993, 2898] as [number, number], tag: 'Tiffany & Co., 1893'},
};
// the engraving without its signature (the mask's crop)
const TIFF_CROP: [number, number, number, number] = [0, 0, 1497, 1640];
const STORE_CROP: [number, number, number, number] = [100, 330, 1700, 1980];

/** A slow push on the whole scene (one camera move per shot). */
const Push: React.FC<{z?: [number, number]; dur?: number; ox?: string; children: React.ReactNode}> = ({z = [1, 1.05], dur = 240, ox = '50% 50%', children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{transform: `scale(${interpolate(f, [0, dur], z, clamp)})`, transformOrigin: ox}}>{children}</AbsoluteFill>;
};

/** "New York. A fancy house on Madison Avenue." */
const Madison: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Push z={[1, 1.035]} dur={130} ox="35% 55%">
      <Print {...IMG.madison} crop={[300, 380, 3500, 2420]} x={190} y={250} w={1000} h={692} rot={-1.5} at={0} tagW={1000} />
    </Push>
    <Highlight text="NEW YORK, 1871" x={140} y={110} size={84} at={t.at('New York') - a} seed={41} rot={-2} />
    <Note text="a fancy house" x={1270} y={420} size={56} rot={-4} at={t.at('fancy') - a - 2} />
    <Note text="on Madison Ave." x={1270} y={510} size={56} rot={-3} at={t.at('Madison') - a - 2} />
  </AbsoluteFill>
);

/** "In the room: two famous Civil War generals. The most famous newspaper editor in the country." */
const Room: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={960} y={520} r={760} a={0.07} />
    <Highlight text="IN THE ROOM" x={140} y={110} size={84} at={t.at('room') - a} seed={42} rot={-2} />
    <Print {...IMG.mcclellan} crop={[450, 500, 1250, 1590]} x={170} y={250} w={420} h={534} rot={-3} at={t.at('two famous') - a - 1} />
    <Print {...IMG.butler} crop={[800, 2000, 2300, 2920]} x={750} y={232} w={420} h={534} rot={2} at={t.at('War') - a - 1} />
    <Print {...IMG.greeley} crop={[900, 500, 3100, 3940]} x={1330} y={260} w={420} h={534} rot={-2} at={t.at('newspaper') - a - 1} />
    <Note text="Gen. McClellan" x={190} y={830} size={56} rot={-4} at={t.at('Civil') - a} />
    <Note text="Gen. Butler" x={790} y={830} size={56} rot={-3} at={t.at('generals') - a} />
    <Note text="Greeley, editor" x={1350} y={830} size={56} rot={-4} at={t.at('editor') - a - 2} />
  </AbsoluteFill>
);

/** "And Charles Tiffany, the man behind Tiffany and Company." */
const Tiffany: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={560} y={520} r={700} a={0.1} />
    <Push z={[1, 1.03]} dur={120} ox="30% 50%">
      <Print {...IMG.tiffany} crop={TIFF_CROP} x={220} y={170} w={640} h={701} rot={-1.5} at={1} mask={TIFFANY} traceAt={t.at('Tiffany') - a + 2} tag={IMG.tiffany.tag} tagW={640} />
      <Highlight text="CHARLES TIFFANY" x={960} y={170} size={72} at={t.at('Charles') - a} seed={43} rot={-2} />
      <Print {...IMG.store} crop={STORE_CROP} x={1110} y={380} w={440} h={512} rot={2.5} at={t.at('behind') - a} tag={IMG.store.tag} />
    </Push>
  </AbsoluteFill>
);

/** "The stones go out on the table." */
const Table: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={960} y={560} r={620} a={0.13} />
    <Push z={[1, 1.06]} dur={110}>
      <Prop name="stone_pile" x={640} y={300} w={640} at={t.at('stones') - a - 1} from="top" />
      <Note text="on the table" x={1300} y={780} size={62} rot={-4} at={t.at('table') - a - 2} />
    </Push>
  </AbsoluteFill>
);

/** "Tiffany picks through them and holds them up to the light. And then he says this." */
const Light: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Flare x={760} y={500} at={t.at('light') - a - 4} r={520} />
    <Push z={[1.02, 1.08]} dur={100} ox="40% 50%">
      <Prop name="rough_diamond" x={480} y={240} w={540} at={0} coral trace from="bottom" />
      <Prop name="jeweler_loupe" x={1180} y={360} w={330} at={6} rot={8} from="bottom" />
    </Push>
    <Note text="up to the light" x={1120} y={230} size={60} rot={-4} at={t.at('light') - a - 2} />
    <Note text="and then he says..." x={1120} y={820} size={60} rot={-3} at={t.at('then he says') - a - 2} />
  </AbsoluteFill>
);

/** The quote, word by word as it is read, over Tiffany's portrait. */
const QuoteScene: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Print {...IMG.tiffany} crop={TIFF_CROP} x={1240} y={190} w={560} h={613} rot={2} at={0} mask={TIFFANY} dim={0.62} tag={IMG.tiffany.tag} tagW={560} />
      <SyncQuote t={t} a={a} phrase="Gentlemen, these are beyond question precious stones of enormous value." x={140} y={230} w={1040} size={80}
        marks={{8: pal.subject, 9: pal.subject}} />
      <Mono text="— CHARLES L. TIFFANY, 1871" x={480} y={770} at={t.at('value') - a + 12} size={28} />
    </AbsoluteFill>
  );
};

/** "Two days later, his number: that sample alone is worth about four million dollars." */
const Number4: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={560} y={580} r={600} a={0.1} />
    <Highlight text="HIS NUMBER" x={140} y={110} size={84} at={t.at('his number') - a} seed={44} rot={-2} />
    <Note text="two days later" x={760} y={130} size={58} rot={-4} at={t.at('Two days') - a + 4} />
    <Prop name="stone_pile" x={250} y={380} w={480} at={1} from="none" />
    <Note text="the sample alone" x={260} y={850} size={58} rot={-3} at={t.at('sample alone') - a - 2} />
    <MoneyTag at={t.at('four million') - a - 2} big="$4 million" small="$150,000 in 1872" x={1270} y={430} />
  </AbsoluteFill>
);

/** "And if that was just a sample? One of the investors did the math on the whole bag. Forty million dollars." */
const WholeBag: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const sw = t.at('whole bag') - a;
  const k = interpolate(f, [sw, sw + 14], [1, 1.32], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={470} y={560} r={640} a={0.12} />
      <AbsoluteFill style={{transform: `scale(${k})`, transformOrigin: '470px 560px'}}>
        <Prop name="leather_pouch" x={220} y={340} w={500} at={0} coral trace from="none" />
      </AbsoluteFill>
      <Note text="just a sample?" x={1010} y={150} size={60} rot={-4} at={t.at('sample', 2) - a - 2} />
      <Note text="one investor's math" x={1010} y={240} size={56} rot={-3} at={t.at('did the math') - a - 2} />
      <MoneyTag at={t.at('Forty') - a - 2} big="$40 million" small="$1.5 million in 1872" x={1340} y={470} />
    </AbsoluteFill>
  );
};

/** "This is move three: borrowed trust. Nobody had to trust two scruffy cousins from Kentucky. They just had to trust Tiffany." */
const Trust: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const card = t.at('move three') - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Lamp x={1040} y={500} r={560} a={0.09} />
      <Highlight text="BORROWED TRUST" x={140} y={110} size={84} at={t.at('borrowed') - a} seed={45} rot={-2} />
      <SilFigure name="sil_arnold" x={150} y={330} h={480} at={2} label="PHILIP ARNOLD" from="left" dim={0.9} />
      <SilFigure name="sil_slack" x={470} y={330} h={480} at={5} label="JOHN SLACK" from="left" dim={0.9} />
      <Note text="two scruffy cousins" x={170} y={238} size={56} rot={-4} at={t.at('scruffy') - a - 2} />
      <Print {...IMG.tiffany} crop={TIFF_CROP} x={830} y={250} w={420} h={460} rot={2} at={1} mask={TIFFANY} tintAt={t.at('trust Tiffany') - a}
        traceAt={t.at('trust Tiffany') - a + 4} tag={IMG.tiffany.tag} tagW={420} />
      <Note text="trust him" x={900} y={820} size={62} rot={-4} at={t.at('trust Tiffany') - a + 6} />
      <ConCard x={1350} y={560} scale={0.7} at={card} out={card + 108}
        rows={[{n: 1, at: -999, faint: true}, {n: 2, at: -999, faint: true}, {n: 3, at: t.at('borrowed') - a}]} />
    </AbsoluteFill>
  );
};

/** "Here's what nobody asked. Tiffany sold cut and polished diamonds. He and his gem cutter knew very little about rough stones..." */
const Asked: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={1100} y={540} r={760} a={0.08} />
    <Highlight text="WHAT NOBODY ASKED" x={140} y={110} size={80} at={t.at('nobody asked') - a} seed={46} rot={-2} />
    <Print {...IMG.store} crop={STORE_CROP} x={150} y={260} w={380} h={442} rot={-2} at={1} tag={IMG.store.tag} tagW={380} />
    <CutGem cx={860} cy={460} w={330} at={t.at('cut and polished') - a} />
    <Mono text="CUT & POLISHED" x={860} y={660} at={t.at('polished') - a} />
    <Mono text="WHAT TIFFANY SOLD" x={860} y={700} at={t.at('polished') - a + 4} size={18} color="rgba(47,224,196,0.9)" />
    <Note text="knew very little" x={1250} y={180} size={58} rot={-4} at={t.at('knew') - a - 2} />
    <Prop name="rough_diamond" x={1290} y={330} w={350} at={t.at('rough stones') - a - 1} coral from="top" />
    <Mono text="ROUGH, FROM THE GROUND" x={1465} y={680} at={t.at('rough stones') - a + 4} />
    <Note text="not the same thing" x={700} y={810} size={64} rot={-3} at={t.at('straight out') - a - 2} />
  </AbsoluteFill>
);

/** "Now the money men were hooked. But they weren't stupid." */
const Hooked: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <ColdOpenDepth cam={[{f: 0, d: 20, x: 0, y: 0}, {f: 110, d: 55, x: 0, y: -12}]} />
    <Note text="hooked" x={720} y={140} size={72} rot={-4} at={t.at('hooked') - a - 2} />
    <Note text="...but not stupid" x={1010} y={230} size={60} rot={-3} at={t.at('stupid') - a - 2} />
  </AbsoluteFill>
);

/** "Before they put in serious money, they wanted one more thing." */
const OneMore: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Lamp x={960} y={580} r={600} a={0.11} />
    <Push z={[1, 1.05]} dur={110}>
      <Prop name="banknotes_stack" x={560} y={420} w={760} at={t.at('serious') - a - 2} from="top" />
      <Note text="serious money" x={1210} y={330} size={58} rot={-4} at={t.at('serious money') - a + 6} />
    </Push>
    <Highlight text="ONE MORE THING" x={140} y={110} size={84} at={t.at('one more thing') - a} seed={47} rot={-2} />
  </AbsoluteFill>
);

/** "Somebody had to go stand on that diamond field." The mesa, empty: no stones yet. Push in and hold. */
const Field: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Mesa at={-200} labels cam={[{f: 0, ...MESA_CAM.wide}, {f: 150, ...MESA_CAM.claim, dist: 11}]} />
    <Highlight text="GO STAND ON IT" x={140} y={110} size={84} at={t.at('stand') - a} seed={48} rot={-2} />
    <Loop cx={1010} cy={560} rx={180} ry={95} at={t.at('diamond field') - a + 6} dur={12} width={5} seed={49} tilt={-6} />
    <Note text="nothing here. yet." x={1230} y={760} size={58} rot={-4} at={t.at('field') - a + 18} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    room: at('In the room') - 1, tiff: at('And Charles') - 1, table: at('The stones') - 1, light: at('holds them up') - 1, quote: at('Gentlemen') - 1,
    num: at('Two days') - 1, bag: at('And if that') - 1, trust: at('This is move') - 1, asked: at("Here's what") - 1, hooked: at('Now the money') - 1,
    more: at('Before they put') - 1, field: at('Somebody had') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Sequence from={0} layout="none"><Madison t={t} a={0} /></Sequence>],
    [c.room, <Sequence from={c.room} layout="none"><Room t={t} a={c.room} /></Sequence>],
    [c.tiff, <Sequence from={c.tiff} layout="none"><Tiffany t={t} a={c.tiff} /></Sequence>],
    [c.table, <Sequence from={c.table} layout="none"><Table t={t} a={c.table} /></Sequence>],
    [c.light, <Sequence from={c.light} layout="none"><Light t={t} a={c.light} /></Sequence>],
    [c.quote, <Sequence from={c.quote} layout="none"><QuoteScene t={t} a={c.quote} /></Sequence>],
    [c.num, <Sequence from={c.num} layout="none"><Number4 t={t} a={c.num} /></Sequence>],
    [c.bag, <Sequence from={c.bag} layout="none"><WholeBag t={t} a={c.bag} /></Sequence>],
    [c.trust, <Sequence from={c.trust} layout="none"><Trust t={t} a={c.trust} /></Sequence>],
    [c.asked, <Sequence from={c.asked} layout="none"><Asked t={t} a={c.asked} /></Sequence>],
    [c.hooked, <Sequence from={c.hooked} layout="none"><Hooked t={t} a={c.hooked} /></Sequence>],
    [c.more, <Sequence from={c.more} layout="none"><OneMore t={t} a={c.more} /></Sequence>],
    [c.field, <Sequence from={c.field} layout="none"><Field t={t} a={c.field} /></Sequence>],
  ];
  const scene = useScene(cuts);
  // sound: whoosh per cut, stamp per tape title and money tag, a slap per print, the marker 2 frames before each note
  const titles = ['New York', 'room', 'Charles', 'his number', 'borrowed', 'nobody asked', 'one more thing', 'stand'];
  const notes = ['fancy', 'Madison', 'Civil', 'generals', 'editor', 'table', 'light', 'then he says', 'Two days', 'sample alone', 'did the math',
    'scruffy', 'knew', 'straight out', 'hooked', 'stupid'];
  const prints = ['two famous', 'War', 'newspaper', 'behind', 'stones', 'serious', 'rough stones'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {titles.map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.27} />)}
      {['four million', 'Forty'].map((p) => <Sfx key={p} at={at(p) - 2} src="sfx/stamp.wav" volume={0.32} />)}
      {prints.map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/paper_rustle.wav" volume={0.22} />)}
      {notes.map((p, i) => <Sfx key={`${p}${i}`} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('sample', 2) - 4} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at('serious money') + 4} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at('trust Tiffany') + 4} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at('move three')} src="sfx/tick.wav" volume={0.45} />
      <Sfx at={at('cut and polished')} src="sfx/tick_soft.wav" volume={0.4} />
    </>
  );
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_the_tiffany_test.wav" lead={LEAD} music={[{src: 'music/dh_parlor_appraisal.mp3', volume: bed('dh_parlor_appraisal'), startFrom: 1440}]}>
    <Body />
  </ChapterShell>
);
