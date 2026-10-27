// Chapter 3 · "Coffin Ships and Pumpkins". Two halves: grave (the blight, the famine, the crossing, the landing: ILN plates on
// cards, the 3D Atlantic, two silhouette paintings; no jokes, no playful marks, white notes) and lighter from "Other Americans
// loved" (parties, the turnip → pumpkin on the same map, the prank list crossing over, soap, outhouses, wagons), ending darker
// on the Depression and a dim callback to the 1933 tear-gas headline.
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch03_coffin_ships_and_pumpkins.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, PhotoCard, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {Slip} from '../kit/vox';
import {AtlanticCrossing} from './ch03/Atlantic';
import ship from '../../public/img/layers/sil/ch03_coffin_ship/layers.json';
import landing from '../../public/img/layers/sil/ch03_landing/layers.json';
import roof from '../../public/img/layers/sil/ch03_wagon_roof/layers.json';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);
const WHITE = '#ffffff';
const CORAL = '#FF6F61';
const ORANGE = '#FF9F1C';
const BW = 'grayscale(1) contrast(1.3) brightness(0.97)';
const I = (f: string) => `img/ch03/${f}.jpg`;

// ───────────────────────── first half: grave ─────────────────────────

/** 0:00 · 1845, the blight: the stubble-field plate (searching for leftover potatoes). */
const Blight: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={I('iln_searching_potatoes_stubble_field_1849')} size={[1405, 1450]} x={1200} y={100} w={600} h={780} fx={660} fy={760} scale={0.56} rot={2} at={2} bw={BW} />
    <Highlight text="1845" x={130} y={140} size={150} at={t.at('in 1845')} seed={31} rot={-2} />
    <Note text="a disease hits the potatoes" x={150} y={400} size={54} rot={-3} at={t.at('disease') - 3} color={WHITE} />
    <Note text="the plants turn black" x={170} y={520} size={54} rot={-3} at={t.at('turned black') - 3} color={WHITE} />
    <Note text="the potatoes rot in the ground" x={150} y={640} size={54} rot={-3} at={t.at('rotted') - 3} color={WHITE} />
    <Tag text="Searching for potatoes in a stubble field · Illustrated London News, 1849" />
  </AbsoluteFill>
);

/** 0:09 · what they ate: Old Chapel Lane, Skibbereen; the woman begging at Clonakilty. */
const Families: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={I('iln_mahony_old_chapel_lane_skibbereen_1847')} size={[2626, 1885]} x={130} y={110} w={980} h={660} fx={1350} fy={900} scale={0.41} rot={-2} at={1} bw={BW} />
    <CropCard src={I('iln_woman_begging_clonakilty_1847')} size={[1108, 1623]} x={1280} y={130} w={500} h={700} fx={560} fy={620} scale={0.62} rot={2} at={t.at('poor Irish') - a - 1} bw={BW} />
    <Note text="potatoes: most of what they ate" x={150} y={820} size={62} rot={-2} at={t.at('potatoes were most') - a - 3} color={WHITE} />
    <Tag text="James Mahony · Old Chapel Lane, Skibbereen; Woman begging at Clonakilty · Illustrated London News, 1847" />
  </AbsoluteFill>
);

/** 0:14 · the Great Famine (vocab), about a million died: Bridget O'Donnel, the funeral on the mountain road. */
const Famine: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={I('iln_bridget_odonnel_and_children_1849')} size={[1307, 1962]} x={1230} y={90} w={540} h={820} fx={650} fy={940} scale={0.5} rot={1.5} at={1} bw={BW} />
    <Highlight text="THE GREAT FAMINE" x={110} y={112} size={92} at={t.at('Great Famine') - a} seed={32} rot={-2} />
    <Definition term="Great Famine" def="Ireland, 1845–1852: the potato crop failed year after year, and people starved." at={t.at('Great Famine') - a + 9} x={120} y={262} w={980} />
    <Note text="about 1,000,000 died" x={140} y={448} size={64} rot={-2} at={t.at('About a million') - a - 3} color={WHITE} />
    <CropCard src={I('iln_mahony_funeral_skibbereen_1847')} size={[2299, 1186]} x={150} y={600} w={900} h={340} fx={1220} fy={640} scale={0.42} rot={-1.5} at={t.at('died') - a - 2} bw={BW} />
    <Tag text="Bridget O'Donnel and children, 1849; a funeral near Skibbereen, 1847 · Illustrated London News" />
  </AbsoluteFill>
);

/** 0:17 · about two million left: the priest's blessing, the quay at Cork. */
const Leave: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={I('iln_emigrants_leaving_home_priests_blessing_1851')} size={[3585, 2097]} x={120} y={110} w={1060} h={600} fx={1790} fy={1000} scale={0.31} rot={-2} at={1} bw={BW} />
    <CropCard src={I('iln_emigrants_arrival_at_cork_quay_1851')} size={[3543, 2433]} x={1200} y={420} w={600} h={410} fx={1770} fy={1100} scale={0.185} rot={2.5} at={t.at('left Ireland') - a - 1} bw={BW} />
    <Note text="about 2,000,000 left" x={150} y={810} size={72} rot={-3} at={t.at('two million') - a - 3} color={WHITE} />
    <Tag text="Emigrants leaving home: the priest's blessing; arrival at Cork quay · Illustrated London News, 1851" />
  </AbsoluteFill>
);

/** 0:19 · the crossing: routes draw from Ireland, the counter ticks on "more than a million". */
const Crossing: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill style={{background: '#15130f'}}>
    <AtlanticCrossing at={(k) => ({routes: 8, counter: t.at('more than a million') - a + 4, turnip: 1e6, pumpkin: 1e6 + 60} as Record<string, number>)[k]}
      title={{text: 'ACROSS THE OCEAN', at: t.at('crossed the ocean') - a}} />
  </AbsoluteFill>
);

/** 0:24 · coffin ships: the painting, and the ILN's own view below decks. */
const Ships: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="ch03_coffin_ship" size={ship.size as [number, number]} glowLayer={ship.glowLayer} a={0} b={b - a + 8} cam={{z: [1.04, 1.12], x: [30, -30]}} fade={4} flicker={0.3} />
    <CropCard src={I('iln_emigration_vessel_between_decks_1851')} size={[3824, 1382]} x={1040} y={650} w={760} h={280} fx={1800} fy={690} scale={0.23} rot={-1.5} at={2} bw="grayscale(1) contrast(1.05) brightness(1.35)" />
    <Slip text="crowded and sick" x={1060} y={540} size={56} at={t.at('crowded') - a} rot={-2} />
    <Highlight text="COFFIN SHIPS" x={110} y={100} size={100} at={t.at('coffin ships') - a} seed={33} rot={-2} />
    <Tag text="Emigration vessel: between decks · Illustrated London News, 1851" />
  </AbsoluteFill>
);

/** 0:27 · landing in Boston and New York (painting). */
const Landing: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="ch03_landing" size={landing.size as [number, number]} glowLayer={landing.glowLayer} a={-6} b={b - a + 8} cam={{z: [1.03, 1.12], x: [-30, 30]}} fade={4} />
    <Slip text="boston · new york" x={120} y={130} size={62} at={t.at('Boston') - a - 2} />
    <Slip text="poor, and often not welcome" x={150} y={240} size={56} at={t.at('poor, and often') - a - 2} rot={-2} />
    <Slip text="...and they brought halloween" x={130} y={340} size={56} at={t.at('brought their Halloween') - a - 2} rot={-3} />
  </AbsoluteFill>
);

// ───────────────────────── second half: lighter ─────────────────────────

const PUCK = 'img/ch02/puck_uncle_sams_halloween_1904.jpg';

/** 0:35 · everybody throws parties: Puck's 1904 "Uncle Sam's Hallowe'en", two of its panels pulled out. */
const Parties: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src={PUCK} x={110} y={120} w={860} rot={-2} at={1} filter={BW} />
    <CropCard src={PUCK} size={[4000, 2529]} x={1040} y={110} w={760} h={420} fx={800} fy={540} scale={0.66} rot={2} at={t.at('apple games') - a - 1} bw={BW} />
    <CropCard src={PUCK} size={[4000, 2529]} x={1070} y={590} w={740} h={280} fx={3040} fy={1960} scale={0.5} rot={-1.5} at={t.at('everybody') - a - 1} bw={BW} />
    <Note text="apple games + fortunes" x={140} y={700} size={56} rot={-3} at={t.at('apple games') - a - 3} />
    <Highlight text="HALLOWEEN PARTIES" x={120} y={800} size={78} at={t.at('parties') - a} seed={34} rot={-2} />
    <Note text="...two things changed" x={1200} y={880} size={46} rot={-3} at={t.at('two things') - a - 3} color={WHITE} />
    <Tag text="S. D. Ehrhart, Uncle Sam's Hallowe'en · Puck, 1904 · LOC" />
  </AbsoluteFill>
);

/** 0:45 · "First, America had pumpkins": back on the same map, the turnip lantern flies over and lands as a pumpkin. */
const Pumpkins: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill style={{background: '#15130f'}}>
    <AtlanticCrossing wide counter={false}
      at={(k) => ({routes: -400, counter: 1e6, turnip: t.at('than a turnip') - a + 2, pumpkin: t.at('vegetables') - a + 4} as Record<string, number>)[k]}
      title={{text: 'AMERICA HAD PUMPKINS', at: t.at('pumpkins') - a}} />
    <Note text="big. cheap. easy to carve." x={1120} y={150} size={50} rot={-3} at={t.at('Big') - a - 3} color={WHITE} />
    <Definition term="jack-o'-lantern" def="a carved vegetable lantern with a candle inside: first a turnip, then a pumpkin" at={t.at("jack-o'-lantern") - a} x={120} y={840} w={1300} />
  </AbsoluteFill>
);

/** 0:54 · the American upgrade: the c. 1910 postcard, the pumpkin looped. */
const Upgrade: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src="img/ch02/postcard_boys_carry_jackolantern_c1910.jpg" x={150} y={110} w={1000} rot={-2} at={1} filter={BW} />
    <Loop cx={640} cy={500} rx={230} ry={190} at={t.at('carve a pumpkin') - a + 2} seed={35} />
    <Note text="this week?" x={1260} y={260} size={66} rot={-4} at={t.at('this week') - a - 3} />
    <Highlight text="THE AMERICAN UPGRADE" x={150} y={820} size={88} at={t.at("you're doing") - a} seed={36} rot={-2} />
    <Tag text="Halloween Greetings postcard, c. 1910 · Boston Public Library" />
  </AbsoluteFill>
);

/** The Irish prank list from chapter 2, pinned to the desk (cream index card, handwritten). */
const PrankList: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], clamp);
  const line = {fontFamily: '"Nanum Pen Script", cursive', fontSize: 72, lineHeight: 1.15, color: '#1d1a16', whiteSpace: 'nowrap'} as React.CSSProperties;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 640, transform: `rotate(-3deg) scale(${0.8 + 0.2 * k})`, opacity: Math.min(1, k * 2),
      background: '#ece6d8', padding: '34px 40px 40px', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
      backgroundImage: 'repeating-linear-gradient(transparent 0 82px, rgba(47,120,196,0.25) 82px 84px)'}}>
      <div style={{position: 'absolute', left: 290, top: -16, width: 70, height: 34, background: 'rgba(242,140,40,0.85)', transform: 'rotate(4deg)'}} />
      <div style={{...line, fontSize: 52, color: '#6b6258'}}>ireland, halloween night:</div>
      <div style={line}>gates off their hinges</div>
      <div style={line}>cabbages at doors</div>
      <div style={line}>chimneys stuffed up</div>
    </div>
  );
};

/** 0:58 · "remember those gates off their hinges?" The list, the gate (coral), the mischief crosses over. */
const Gates: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PrankList x={150} y={160} at={1} />
    <Loop cx={470} cy={330} rx={330} ry={62} at={t.at('gates') - a + 1} seed={37} />
    <Prop name="iron_gate" x={1000} y={170} w={780} at={t.at('gates') - a - 1} rot={-14} coral trace />
    <Prop name="cabbage" x={1560} y={560} w={240} at={t.at('remember') - a + 4} rot={8} />
    <Highlight text="THE MISCHIEF CAME TOO" x={140} y={760} size={84} at={t.at('mischief came') - a} seed={38} rot={-2} />
    <Note text="...and got bigger" x={1300} y={830} size={58} rot={-3} at={t.at('got bigger') - a - 3} color={CORAL} />
  </AbsoluteFill>
);

/** 1:05 · soaped windows; the outhouse stands, then tips (prop lies on its side; we stand it up first). */
const Outhouse: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const tip = t.at('tipped') - a;
  const rot = interpolate(g, [tip, tip + 5], [90, 0], {...clamp, easing: (u) => u * u});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Prop name="soap_bar" x={170} y={330} w={440} at={1} rot={-6} />
      <Note text="windows soaped" x={170} y={170} size={66} rot={-3} at={t.at('soaped') - a - 3} />
      <div style={{position: 'absolute', left: 960, top: 300, width: 760, height: 480, transform: `rotate(${rot}deg)`, transformOrigin: '50% 50%'}}>
        <Prop name="outhouse" x={0} y={0} w={760} at={t.at('Outhouses') - a - 1} coral trace from="none" />
      </div>
      <Note text="outhouses tipped over" x={940} y={130} size={66} rot={-3} at={t.at('tipped') - a - 3} />
      <Note text="(so the stories go)" x={170} y={720} size={56} rot={-3} at={t.at('the stories go') - a - 3} color={ORANGE} />
      <Note text="...with somebody still inside" x={170} y={820} size={64} rot={-3} at={t.at('somebody') - a - 3} color={CORAL} />
    </AbsoluteFill>
  );
};

/** 1:12 · "And wagons." The wheel. */
const Wagons: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="wagon_wheel" x={1080} y={110} w={640} at={1} rot={6} coral trace />
    <Highlight text="WAGONS." x={140} y={160} size={130} at={t.at('wagons') - a} seed={39} rot={-3} />
    <Note text="somehow, always wagons" x={160} y={470} size={66} rot={-3} at={t.at('always wagons') - a - 3} color={WHITE} />
  </AbsoluteFill>
);

/** 1:16 · Newton, Kansas: the wagon on the lumberyard roof (painting). */
const Roof: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="ch03_wagon_roof" size={roof.size as [number, number]} glowLayer={roof.glowLayer} a={-6} b={b - a + 8} cam={{z: [1.04, 1.1], x: [-20, 20]}} fade={4} />
    <Slip text="newton, kansas" x={1180} y={420} size={64} at={t.at('Newton') - a - 2} />
    <Loop cx={760} cy={430} rx={240} ry={130} at={t.at('a wagon on the roof') - a + 2} seed={40} width={6} />
    <Slip text="on the lumberyard roof" x={1180} y={530} size={56} at={t.at('lumberyard') - a - 2} rot={-2} />
    <Slip text="for decades: every november 1st" x={1060} y={640} size={56} at={t.at('November first') - a - 6} rot={-3} />
  </AbsoluteFill>
);

/** 1:26 · boys will be boys (the 1911 "Halloween Pranks" postcard). */
const Boys: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src="img/ch02/postcard_halloween_pranks_boy_jackolantern_1911.jpg" x={1320} y={110} w={440} rot={3} at={1} filter={BW} />
    <Note text="grown-ups: mostly shrugged" x={150} y={180} size={60} rot={-3} at={t.at('mostly shrugged') - a - 3} color={WHITE} />
    <Highlight text="BOYS WILL BE BOYS" x={130} y={360} size={92} at={t.at('Boys will') - a} seed={41} rot={-2} />
    <Note text="...which is not a legal defense." x={170} y={600} size={68} rot={-3} at={t.at('Which is not') - a - 3} dur={16} color={CORAL} />
    <Tag text="Hallowe'en Pranks postcard, 1911 · NYPL" />
  </AbsoluteFill>
);

/** 1:32 · the Great Depression: the desk darkens; the 1933 tear-gas headline (the cold open's) surfaces, dim. */
const Depression: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const head = t.at('pranks stopped') - a;
  const dark = interpolate(f, [0, 200], [0.15, 0.55], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PhotoCard src="img/ch03/bismarck_tribune_1933-11-01_tear_gas_headline.jpg" x={260} y={400} w={1400} h={330} rot={-2} at={head - 1} fit="cover" pos="50% 50%"
        filter="grayscale(1) contrast(1.35) brightness(0.7)" />
      <AbsoluteFill style={{background: `rgba(0,0,0,${dark})`}} />
      <Highlight text="THE GREAT DEPRESSION" x={120} y={110} size={96} at={t.at('Great Depression') - a} seed={42} rot={-2} />
      <Note text="...and the pranks stopped being funny." x={300} y={810} size={64} rot={-2} at={t.at('stopped being funny') - a - 3} dur={16} color={WHITE} />
      {f >= head && <Tag text="The Bismarck Tribune, 1 Nov 1933 · Library of Congress" />}
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    fam: at('And for millions') - 1, famine: at("That's the Great") - 1, leave: at('Around two million') - 1, cross: at('and more than a million') - 1,
    ships: at('so crowded') - 1, land: at('They landed') - 1, party: at('Other Americans') - 1, pump: at('First, America') - 1, up: at('If you carve') - 1,
    gates: at('Second, remember') - 1, out: at('Windows soaped') - 1, wag: at('And wagons') - 1, roof: at('One Halloween in') - 1, boys: at('Grown-ups') - 1,
    dep: at('Then came') - 1,
  };
  const S = (from: number, node: React.ReactNode): [number, React.ReactNode] => [from, <Sequence from={from} layout="none">{node}</Sequence>];
  const cuts: [number, React.ReactNode][] = [
    [0, <Blight t={t} />],
    S(c.fam, <Families t={t} a={c.fam} />),
    S(c.famine, <Famine t={t} a={c.famine} />),
    S(c.leave, <Leave t={t} a={c.leave} />),
    S(c.cross, <Crossing t={t} a={c.cross} />),
    S(c.ships, <Ships t={t} a={c.ships} b={c.land} />),
    S(c.land, <Landing t={t} a={c.land} b={c.party} />),
    S(c.party, <Parties t={t} a={c.party} />),
    S(c.pump, <Pumpkins t={t} a={c.pump} />),
    S(c.up, <Upgrade t={t} a={c.up} />),
    S(c.gates, <Gates t={t} a={c.gates} />),
    S(c.out, <Outhouse t={t} a={c.out} />),
    S(c.wag, <Wagons t={t} a={c.wag} />),
    S(c.roof, <Roof t={t} a={c.roof} b={c.boys} />),
    S(c.boys, <Boys t={t} a={c.boys} />),
    S(c.dep, <Depression t={t} a={c.dep} />),
  ];
  const scene = useScene(cuts);
  // the grave half gets softer whooshes
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={f < c.party ? 0.2 : 0.3} />)}
      {['in 1845', 'Great Famine', 'crossed the ocean', 'coffin ships'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.2} />)}
      {['parties', 'pumpkins', "you're doing", 'mischief came', 'wagons', 'Boys will', 'Great Depression'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.3} />)}
      {['disease', 'turned black', 'rotted', 'potatoes were most', 'About a million', 'two million', 'apple games', 'two things', 'Big', 'this week', 'got bigger', 'soaped',
        'tipped', 'the stories go', 'somebody', 'always wagons', 'mostly shrugged', 'Which is not', 'stopped being funny'].map((p) =>
        <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
    </AbsoluteFill>
  );
};

export const Ch03: React.FC = () => {
  const t = makeTimeline(N, 30);
  const hand = t.at('Other Americans');
  const dep = t.at('Then came');
  return (
    <ChapterShell n={N} audio="audio/ch03_coffin_ships_and_pumpkins.wav" lead={LEAD} music={[
      {src: 'music/hb_coffin_ships.mp3', volume: bed('hb_coffin_ships', 14), to: hand + 20, fadeOut: 50},
      {src: 'music/hb_mischief_rag.mp3', volume: bed('hb_mischief_rag'), from: hand - 8, to: dep + 6, fadeOut: 10},
      {src: 'music/hb_black_halloween.mp3', volume: bed('hb_black_halloween', 14), from: dep},
    ]}>
      <Body />
    </ChapterShell>
  );
};
