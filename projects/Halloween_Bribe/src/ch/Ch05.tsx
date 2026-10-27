// Chapter 5 · The Deal. Towns give teenagers somewhere better to be (parties, parades, costume prizes, haunted basements), a
// Puyallup party in the paper, a bowl by the front door; then the kids' name for it ("trick or treat", Alberta 1927: "edible
// plunder"), the wagons again, the phrase spreading through U.S. papers in the 1930s, and the payoff: it's a deal, a protection
// racket with better costumes. It mostly worked (bag vs. outhouse), until America ran out of sugar (sets up ch06's ration book).
import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch05_the_deal.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, PhotoCard, Quote, Stamp, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {type Box, Sheet, Slip, Spot, Swipe, camAt} from '../kit/vox';
import party from '../../public/img/layers/sil/ch05_party/layers.json';
import wagon from '../../public/img/layers/sil/ch03_wagon_roof/layers.json';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';

/** 0:00 · "Here's the plan": the town party painting; teens roam anyway, so give them somewhere better to be. */
const Plan: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="ch05_party" size={party.size as [number, number]} glowLayer={party.glowLayer} a={0} b={b - a + 6} cam={{z: [1.04, 1.12], x: [-30, 20]}} fade={4} />
    <Highlight text="THE PLAN" x={110} y={100} size={110} at={t.at('plan') - a} seed={51} rot={-2} />
    <Slip text="teens roam anyway…" x={130} y={290} size={58} at={t.at('teenagers') - a} rot={-3} />
    <Slip text="so give them somewhere better to be" x={130} y={400} size={58} at={t.at('give them') - a} rot={-2} coral />
  </AbsoluteFill>
);

/** 0:06 · "So towns started throwing Halloween parties. Parades." Two FSA party photos on the desk. */
const Parties: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src="img/ch04/fsa_osage_farms_halloween_party_1939.jpg" x={90} y={250} w={900} h={640} rot={-2} at={2} pos="50% 40%" />
    <PhotoCard src="img/ch04/fsa_shafter_halloween_party_waiting_1938.jpg" x={1060} y={300} w={760} h={560} rot={3} at={t.at('Parades') - a - 2} pos="50% 55%" />
    <Highlight text="HALLOWEEN PARTIES" x={110} y={70} size={100} at={t.at('parties') - a} seed={52} rot={-2} />
    <Note text="parades." x={1240} y={905} size={52} rot={-4} at={t.at('Parades') - a} color="#ffffff" />
    <Tag text="FSA: Osage Farms, Mo., 1939 · Shafter camp, Calif., 1938 · LOC" />
  </AbsoluteFill>
);

/** 0:10 · costume contests with prizes (the WPA poster, prize line circled) and haunted houses (Girl Scouts' party, 1938). */
const Contests: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src="img/ch04/wpa_halloween_skating_carnival_poster_1936.jpg" x={140} y={110} w={540} rot={-2} at={2} fit="contain" />
    <Loop cx={350} cy={722} rx={180} ry={58} at={t.at('with prizes') - a} seed={53} tilt={-2} />
    <PhotoCard src="img/ch04/girl_scouts_halloween_party_dc_1938.jpg" x={820} y={130} w={960} h={640} rot={2} at={t.at('Haunted') - a - 2} pos="50% 45%" />
    <Note text="costume contests" x={130} y={830} size={50} rot={-3} at={t.at('Costume') - a} color="#ffffff" />
    <Note text="(with prizes)" x={190} y={915} size={46} rot={-3} at={t.at('with prizes') - a} color="#ffffff" />
    <Note text="haunted houses" x={880} y={820} size={50} rot={-3} at={t.at('Haunted') - a} />
    <Note text="in gyms + church basements" x={930} y={905} size={44} rot={-3} at={t.at('school gyms') - a} />
    <Tag text="WPA poster, 1936 · Harris & Ewing, 1938 · LOC" />
  </AbsoluteFill>
);

/** 0:15 · "Look at this one": the Tacoma Times on the Puyallup party, the camera pushing onto the headline. */
const PUY: [number, number] = [1918, 1769];
const PUY_HEAD: Box[] = [[220, 348, 981, 124], [220, 470, 960, 118]];
const PUY_SUB: Box[] = [[300, 618, 862, 62]];
const Puyallup: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const cam = camAt([[0, {x: 900, y: 760, z: 0.95, tilt: 8}], [16, {x: 720, y: 560, z: 1.35, tilt: 4}], [b - a, {x: 700, y: 540, z: 1.5, tilt: 2}]], f);
  const look = t.at('Look') - a;
  return (
    <AbsoluteFill style={{background: '#0d0c09'}}>
      <DarkPaper />
      <Sheet src="img/ch04/tacoma_times_1940-10-23_puyallup_trick_or_treat_party.jpg" size={PUY} cam={cam} seed="puy">
        <Spot size={PUY} boxes={[...PUY_HEAD, ...PUY_SUB]} at={look + 14} id="puy" />
        <Swipe lines={PUY_SUB} from={t.at('small town') - a} to={t.at('small town') - a + 14} seed="puysub" />
      </Sheet>
      <Slip text="Puyallup, Wash. · Oct. 1940" x={1180} y={880} size={56} at={t.at('Washington') - a} rot={-3} coral />
      <Tag text="The Tacoma Times, 23 Oct 1940 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** 0:18 · "And at home": the bowl of treats by the front door (coral). */
const Bowl: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="candy_bowl" x={1060} y={330} w={760} at={t.at('bowl') - a - 6} coral trace />
    <Note text="and at home:" x={130} y={200} size={60} rot={-4} at={t.at('home') - a} color="#ffffff" />
    <Highlight text="A BOWL OF TREATS" x={110} y={360} size={84} at={t.at('bowl') - a} seed={54} rot={-2} />
    <Note text="by the front door" x={150} y={560} size={64} rot={-4} at={t.at('by the front') - a} />
  </AbsoluteFill>
);

/** 0:22 · the kids' name for it: TRICK OR TREAT, first in Canadian papers, 1920s. */
const Name: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="the kids had a name for it:" x={140} y={170} size={64} rot={-3} at={t.at('kids') - a} color="#ffffff" />
    <Highlight text="TRICK OR TREAT" x={180} y={340} size={150} at={t.at('trick or treat') - a} seed={55} rot={-3} />
    <Note text="first in print: Canadian newspapers" x={200} y={640} size={58} rot={-3} at={t.at('Canadian') - a} />
    <Stamp text="1920s" x={1320} y={700} size={170} at={t.at('1920s') - a} color={CORAL} rot={-6} />
  </AbsoluteFill>
);

/** 0:29 · Alberta, 1927: the quote card, then the dry beat "Edible plunder." */
const Alberta: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="Alberta · 1927" x={160} y={110} size={64} rot={-3} at={t.at('In 1927') - a} />
    <Note text="kids at the back door and the front" x={170} y={230} size={52} rot={-2} at={t.at('back door') - a} color="#ffffff" />
    <Quote text="demanding edible plunder by the word ‘trick or treat.’" at={t.at('demanding') - a - 1} x={160} y={400} w={1560} size={80}
      who="Lethbridge Herald, Alberta, 4 Nov 1927" />
    <Note text="edible plunder." x={1080} y={810} size={78} rot={-5} at={t.at('Edible plunder', 2) - a} color={CORAL} />
  </AbsoluteFill>
);

/** 0:40 · the town out next morning, hunting for its wagons (the ch03 wagon-roof painting). WAGONS · AGAIN. */
const Wagons: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="ch03_wagon_roof" size={wagon.size as [number, number]} glowLayer={wagon.glowLayer} a={0} b={b - a + 6} cam={{z: [1.06, 1.15], x: [20, -30]}} fade={4} />
    <Slip text="the next morning:" x={120} y={110} size={58} at={t.at('next morning') - a} rot={-3} />
    <Slip text="the town hunting for its wagons" x={120} y={220} size={58} at={t.at('hunting') - a} rot={-2} />
    <Highlight text="WAGONS" x={120} y={800} size={120} at={t.at('wagons') - a} seed={56} rot={-3} />
    <Highlight text="AGAIN." x={720} y={790} size={120} at={t.at('again') - a} seed={57} rot={-2} />
  </AbsoluteFill>
);

/** 0:46 · "By the 1930s, the phrase was spreading across the United States": clippings fall onto the desk, each tagged. */
type Clip = {src: string; size: [number, number]; x: number; y: number; w: number; rot: number; tag: string};
const CLIPS: Clip[] = [
  {src: 'img/ch05/waterbury_democrat_1934-10-30_no_vandalism_now.jpg', size: [1385, 1080], x: 90, y: 70, w: 470, rot: -5, tag: 'Waterbury Democrat, Conn. · 1934'},
  {src: 'img/ch04/imperial_valley_press_1935-10-31_trick_or_treat_stunt.jpg', size: [1090, 926], x: 720, y: 50, w: 440, rot: 3, tag: 'Imperial Valley Press, Calif. · 1935'},
  {src: 'img/ch05/hagerstown_globe_1939-10-27_halloween_grows_up.jpg', size: [1375, 1074], x: 1330, y: 80, w: 470, rot: -3, tag: 'Hagerstown Globe, Md. · 1939'},
  {src: 'img/ch05/tacoma_times_1940-11-02_trick_or_treat_ghosts_abroad.jpg', size: [920, 715], x: 130, y: 470, w: 460, rot: 4, tag: 'Tacoma Times, Wash. · 1940'},
  {src: 'img/ch05/daily_alaska_empire_1941-11-01_juneau_treated.jpg', size: [791, 466], x: 1340, y: 500, w: 480, rot: 3, tag: 'Daily Alaska Empire, Juneau · 1941'},
  {src: 'img/ch05/harlem_news_1941-11-07_no_mischief.jpg', size: [1003, 811], x: 1000, y: 330, w: 400, rot: -4, tag: 'Harlem News, Mont. · 1941'},
  {src: 'img/ch04/browning_chief_1941-10-31_trick_or_treat_refrain_from_tricks.jpg', size: [824, 663], x: 560, y: 360, w: 460, rot: -6, tag: 'Browning Chief, Mont. · 1941'},
];
const FallingClip: React.FC<{c: Clip; at: number}> = ({c, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});
  const pad = 10;
  const h = ((c.w - 2 * pad) * c.size[1]) / c.size[0];
  return (
    <div style={{position: 'absolute', left: c.x, top: c.y - (1 - k) * 420, width: c.w, opacity: Math.min(1, k * 2),
      transform: `rotate(${c.rot + (1 - k) * 14}deg) scale(${1.15 - 0.15 * k})`}}>
      <div style={{background: '#f4efe6', padding: pad, boxShadow: '0 18px 34px rgba(0,0,0,0.65)'}}>
        <Img src={staticFile(c.src)} style={{width: c.w - 2 * pad, height: h, display: 'block', filter: 'grayscale(1) contrast(1.2)'}} />
        <div style={{marginTop: 6, fontFamily: JF.mono, fontSize: 15, letterSpacing: 0.5, color: '#2a2620', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{c.tag}</div>
      </div>
    </div>
  );
};
const CLIP_STEP = 9;
const Spreading: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    {CLIPS.map((c, i) => <FallingClip key={c.src} c={c} at={2 + i * CLIP_STEP} />)}
    <Highlight text="ACROSS THE U.S." x={110} y={890} size={92} at={t.at('spreading') - a} seed={58} rot={-2} />
    <Note text="1930s" x={1460} y={900} size={70} rot={-4} at={t.at('By the 1930s') - a} />
    <Tag text="Chronicling America · Library of Congress" x={1020} y={1030} />
  </AbsoluteFill>
);

/** 0:50 · "So listen to the words one more time": not a greeting. IT'S A DEAL. Give me something… or else. */
const Deal: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="listen to the words again:" x={140} y={90} size={56} rot={-3} at={t.at('listen') - a} color="#ffffff" />
    <Stamp text="“Trick or treat”" x={150} y={210} size={130} at={t.at('Trick or treat', 3) - a} rot={-2} />
    <Note text="isn't a greeting." x={1080} y={250} size={64} rot={-5} at={t.at('greeting') - a} />
    <Highlight text="IT'S A DEAL" x={150} y={440} size={180} at={t.at("It's a deal") - a} seed={59} rot={-3} />
    <Note text="give me something…" x={190} y={780} size={66} rot={-3} at={t.at('Give me') - a} />
    <Note text="…or else." x={960} y={810} size={78} rot={-4} at={t.at('or else') - a} color={CORAL} />
  </AbsoluteFill>
);

/** 0:57 · the vocab beat: PROTECTION RACKET + its definition, with better costumes. */
const Racket: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Highlight text="PROTECTION RACKET" x={120} y={220} size={124} at={t.at('protection') - a} seed={60} rot={-2} />
    <Definition term="protection racket" def="you pay up, and nothing bad happens to your property" at={t.at('protection') - a + 9} x={140} y={450} w={1500} />
    <Note text="…with better costumes." x={760} y={680} size={72} rot={-4} at={t.at('better costumes') - a} color="#ffffff" />
  </AbsoluteFill>
);

/** 1:00 · "And mostly, it worked": a kid filling a bag (coral) isn't tipping over your outhouse. */
const Outhouse: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Highlight text="MOSTLY, IT WORKED" x={110} y={80} size={96} at={t.at('it worked') - a} seed={61} rot={-2} />
    <Prop name="treat_bag" x={170} y={330} w={500} at={t.at('filling a bag') - a - 2} coral trace />
    <Note text="busy filling a bag" x={170} y={880} size={60} rot={-3} at={t.at('filling a bag') - a} />
    <Note text="≠" x={845} y={540} size={120} rot={0} at={t.at("isn't busy") - a} color="#ffffff" />
    <Prop name="outhouse" x={1060} y={400} w={720} at={t.at('tipping') - a - 2} from="top" rot={4} />
    <Note text="not tipping your outhouse" x={1030} y={880} size={60} rot={-3} at={t.at('outhouse') - a} color="#ffffff" />
  </AbsoluteFill>
);

/** 1:06 · "Then, right as the deal was catching on, America ran out of sugar." The bowl loses its colour. */
const Sugar: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const sugar = t.at('sugar') - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Prop name="candy_bowl" x={1060} y={300} w={720} at={2} coral from="none" out={sugar} />
      <div style={{opacity: 0.45}}><Prop name="candy_bowl" x={1060} y={300} w={720} at={sugar} from="none" /></div>
      <Note text="right as the deal caught on…" x={130} y={240} size={62} rot={-3} at={t.at('right as') - a} color="#ffffff" />
      <Highlight text="OUT OF SUGAR" x={120} y={460} size={130} at={sugar} seed={62} rot={-3} />
    </AbsoluteFill>
  );
};

const STAMPS = ['plan', 'parties', 'bowl', 'trick or treat', 'wagons', 'again', 'spreading', "It's a deal", 'protection', 'it worked', 'sugar'];
const WRITES: [string, number?][] = [['Parades'], ['Costume'], ['with prizes'], ['Haunted'], ['school gyms'], ['home'], ['by the front'], ['kids'], ['Canadian'], ['In 1927'], ['back door'],
  ['Edible plunder', 2], ['By the 1930s'], ['listen'], ['greeting'], ['Give me'], ['or else'], ['better costumes'], ['filling a bag'], ["isn't busy"], ['outhouse'], ['right as']];

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {par: at('So towns') - 1, con: at('Costume') - 1, puy: at('Look at this') - 1, bowl: at('And at home') - 1, name: at('The kids had') - 1,
    alb: at('In 1927') - 1, wag: at('And the same') - 1, spr: at('By the 1930s') - 1, deal: at('So listen') - 1, rack: at("It's a protection") - 1,
    out: at('And mostly') - 1, sug: at('Then, right') - 1};
  const seq = (from: number, node: React.ReactNode) => <Sequence from={from} layout="none">{node}</Sequence>;
  const cuts: [number, React.ReactNode][] = [
    [0, <Plan t={t} a={0} b={c.par} />],
    [c.par, seq(c.par, <Parties t={t} a={c.par} />)],
    [c.con, seq(c.con, <Contests t={t} a={c.con} />)],
    [c.puy, seq(c.puy, <Puyallup t={t} a={c.puy} b={c.bowl} />)],
    [c.bowl, seq(c.bowl, <Bowl t={t} a={c.bowl} />)],
    [c.name, seq(c.name, <Name t={t} a={c.name} />)],
    [c.alb, seq(c.alb, <Alberta t={t} a={c.alb} />)],
    [c.wag, seq(c.wag, <Wagons t={t} a={c.wag} b={c.spr} />)],
    [c.spr, seq(c.spr, <Spreading t={t} a={c.spr} />)],
    [c.deal, seq(c.deal, <Deal t={t} a={c.deal} />)],
    [c.rack, seq(c.rack, <Racket t={t} a={c.rack} />)],
    [c.out, seq(c.out, <Outhouse t={t} a={c.out} />)],
    [c.sug, seq(c.sug, <Sugar t={t} a={c.sug} />)],
  ];
  const scene = useScene(cuts);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {STAMPS.map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.28} />)}
      {WRITES.map(([p, n]) => <Sfx key={`${p}${n ?? 1}`} at={at(p, n) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {CLIPS.map((_, i) => <Sfx key={`clip${i}`} at={c.spr + 2 + i * CLIP_STEP} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('1920s')} src="sfx/stamp.wav" volume={0.28} />
      <Sfx at={at('Trick or treat', 3)} src="sfx/stamp.wav" volume={0.28} />
      <Sfx at={c.puy + 2} src="sfx/paper_rustle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_the_deal.wav" lead={LEAD} music={[{src: 'music/m_1924.mp3', volume: bed('m_1924')}]}>
    <Body />
  </ChapterShell>
);
