// Chapter 2 · The Night the Dead Came Home. Ireland ~200 years ago: kids with turnip lanterns (in the action), the hearth with seats
// saved for the dead, Maclise's Snap-Apple Night (small card, then the sharper 1919 engraving of it), the barmbrack ring, the real
// turnip lantern in the museum, the guisers, the mischief list (pinned: ch03 calls it back, see ch02/MischiefList.tsx) and the
// Samhain myth with the All Hallows' Eve vocab card.
import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch02_the_night_the_dead_came_home.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, PhotoCard, type TL, useScene} from '../kit/shell';
import {Desk} from '../kit/desk';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {Slip} from '../kit/vox';
import {Smoke} from '../fx/Headline';
import {MISCHIEF, MischiefList} from './ch02/MischiefList';
import hearth from '../../public/img/layers/sil/ch02_hearth/layers.json';
import guisers from '../../public/img/layers/sil/ch02_guisers/layers.json';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const ORANGE = '#FF9F1C';
const KELLEY = 'img/ch02/kelley_1919_frontis_halloween_festivities.jpg';
const KELLEY_SIZE: [number, number] = [2125, 1415];
const DARK_LEFT = 'linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0) 62%)';

/** 0:00 · in the action: kids carrying turnip lanterns over an Irish hill on Halloween (full-frame illustration, slow push). */
const Turnips: React.FC<{t: TL; b: number}> = ({t, b}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, b], [1.02, 1.12], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#0d0c09'}}>
      <Img src={staticFile('img/gen/tests/lay_pro2.png')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', transform: `scale(${z})`, transformOrigin: '50% 62%'}} />
      <AbsoluteFill style={{background: DARK_LEFT}} />
      <Highlight text="IRELAND" x={110} y={110} size={130} at={t.at('Ireland')} seed={201} rot={-3} />
      <Note text="about 200 years ago" x={130} y={290} size={60} rot={-3} at={t.at('about two hundred') - 3} color="#ffffff" />
      <Note text="October 31" x={150} y={400} size={70} rot={-4} at={t.at('last night') - 3} />
      <Note text="harvest in · winter tomorrow" x={140} y={520} size={52} rot={-3} at={t.at('harvest') - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** 0:10 · the hearth: the dead come home; the seats nearest the fire are theirs. */
const Hearth: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="ch02_hearth" size={hearth.size as [number, number]} glowLayer={hearth.glowLayer} a={0} b={b - a} cam={{z: [1.03, 1.08], x: [-10, 10]}} fade={4} flicker={0.8} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%)'}} />
    <Highlight text="THE DEAD COME HOME" x={110} y={70} size={92} at={t.at('coming home') - a} seed={202} rot={-2} />
    <Slip text="fire kept going · food left out" x={130} y={230} at={t.at('kept the fire') - a} size={50} rot={-2} />
    <Loop cx={1530} cy={905} rx={200} ry={95} at={t.at('seats') - a + 2} width={6} seed={203} tilt={-4} />
    <Slip text="saved for the family's dead" x={1080} y={720} at={t.at('saved') - a} size={48} rot={-3} />
    <Slip text="a very polite way to be haunted" x={140} y={930} at={t.at('very polite') - a} size={54} rot={-2} coral />
  </AbsoluteFill>
);

/** 0:23 · mostly a party: Maclise's Snap-Apple Night as a small card (the only scan is 800 px). */
const Party: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Highlight text="MOSTLY, A PARTY" x={110} y={100} size={100} at={t.at('party') - a} seed={204} rot={-2} />
    <PhotoCard src="img/ch02/maclise_snap_apple_night_1833_lowres.png" x={680} y={330} w={560} rot={-2} at={t.at('Look at this painting') - a - 2} fit="contain"
      filter="grayscale(1) contrast(1.25) brightness(1.08)" />
    <Loop cx={960} cy={535} rx={410} ry={300} at={t.at('painting') - a + 2} width={6} seed={205} tilt={-3} />
    <Note text="a real Halloween party" x={600} y={870} size={54} rot={-3} at={t.at('real Halloween party') - a - 3} color="#ffffff" />
    <Note text="County Cork" x={1420} y={420} size={60} rot={-4} at={t.at('County Cork') - a - 3} />
    <Note text="Daniel Maclise" x={90} y={430} size={52} rot={-4} at={t.at('painted by') - a - 3} />
    <Note text="1833 · he was there" x={100} y={530} size={44} rot={-3} at={t.at('who was there') - a - 3} color="#ffffff" />
    <Tag text="Daniel Maclise, Snap-Apple Night, 1833 (oil, private collection)" />
  </AbsoluteFill>
);

/** 0:31 · the same party in the sharper 1919 engraving after it: apple ducking at the tub. */
const Ducking: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <Desk src={KELLEY} size={KELLEY_SIZE} box={[700, 130, 1120, 763]} at={-2} rot={1.5} tag="Hallowe'en Festivities, after Maclise · The Book of Hallowe'en, 1919">
    {(S) => {
      const [cx, cy] = S(805, 1100);
      return (
        <>
          <Loop cx={cx} cy={cy - 20} rx={170} ry={120} at={t.at('ducking') - a + 2} width={6} seed={206} tilt={-6} />
          <Highlight text="APPLE" x={90} y={140} size={110} at={t.at('ducking') - a} seed={207} rot={-3} />
          <Highlight text="DUCKING" x={110} y={290} size={110} at={t.at('ducking') - a + 3} seed={208} rot={-2} />
          <Note text="in a tub of water" x={110} y={450} size={52} rot={-3} at={t.at('tub') - a - 3} color="#ffffff" />
          <Note text="games" x={120} y={590} size={64} rot={-4} at={t.at('Games') - a - 3} />
          <Note text="food" x={140} y={690} size={64} rot={-3} at={t.at('food', 2) - a - 3} />
          <Note text="fortune-telling" x={140} y={790} size={58} rot={-4} at={t.at('fortune-telling') - a - 3} />
        </>
      );
    }}
  </Desk>
);

/** The barmbrack with the slice (and its ring) in coral; the ring glints on "teeth". */
const Barmbrack: React.FC<{x: number; y: number; w: number; at: number; glint: number}> = ({x, y, w, at, glint}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 6], [0, 1], {...clamp, easing: (q) => 1 - Math.pow(1 - q, 3)});
  const h = (w * 992) / 1600;
  const src = staticFile('img/props/barmbrack.webp');
  // the cut slice (and the ring on it), in fractions of the image
  const slice = 'polygon(37% 60%, 70% 57%, 90% 58%, 99% 66%, 98% 82%, 88% 93%, 62% 100%, 41% 96%, 36% 82%)';
  const mask = {WebkitMaskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskImage: `url(${src})`, maskSize: '100% 100%', clipPath: slice} as React.CSSProperties;
  const gl = interpolate(f, [glint, glint + 5, glint + 16], [0, 1, 0], clamp);
  const rx = x + 0.6875 * w, ry = y + 0.69 * h;
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y + (1 - k) * 260, width: w, opacity: Math.min(1, k * 1.6), filter: 'drop-shadow(0 22px 26px rgba(0,0,0,0.7))'}}>
        <div style={{position: 'relative', width: '100%'}}>
          <Img src={src} style={{width: '100%', display: 'block', filter: 'grayscale(1) contrast(1.15) brightness(0.95)'}} />
          <div style={{position: 'absolute', inset: 0, ...mask, background: CORAL, mixBlendMode: 'color'}} />
          <div style={{position: 'absolute', inset: 0, ...mask, background: CORAL, mixBlendMode: 'multiply', opacity: 0.25}} />
        </div>
      </div>
      {gl > 0 && (
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          <g transform={`translate(${rx - 30} ${ry - 40}) rotate(${gl * 25}) scale(${0.4 + gl})`} opacity={gl}>
            <path d="M0,-46 L7,-7 L46,0 L7,7 L0,46 L-7,7 L-46,0 L-7,-7 Z" fill="#fff" />
          </g>
          <circle cx={rx - 30} cy={ry - 40} r={30 * gl} fill="rgba(255,255,255,0.35)" />
        </svg>
      )}
    </>
  );
};

/** 0:36 · the big fortune: who you'd marry. The barmbrack, the ring, the dentist. */
const Brack: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const bx = 920, by = 310, bw = 920;
  const glint = t.at('teeth') - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Prop name="hazelnuts" x={1470} y={60} w={300} at={2} from="top" />
      <Barmbrack x={bx} y={by} w={bw} at={t.at('fruit bread') - a - 2} glint={glint} />
      <Highlight text="WHO YOU'D MARRY" x={100} y={100} size={84} at={t.at("who you'd marry") - a} seed={209} rot={-2} />
      <Highlight text="BARMBRACK" x={110} y={270} size={100} at={t.at('barmbrack') - a} seed={210} rot={-3} />
      <Definition term="barmbrack" def="a fruit bread, baked with a ring inside" at={t.at('barmbrack') - a + 9} x={110} y={430} w={680} />
      <Note text="find the ring in your slice" x={110} y={630} size={46} rot={-3} at={t.at('Find the ring') - a - 3} />
      <Note text="= married within a year" x={140} y={720} size={46} rot={-3} at={t.at('married within') - a - 3} />
      <Loop cx={bx + 0.6875 * bw} cy={by + 0.7 * bw * 0.62} rx={90} ry={60} at={glint + 2} width={6} seed={211} tilt={-8} />
      <Slip text="...or a dentist" x={1060} y={900} at={t.at('dentist') - a} size={60} rot={-3} coral />
    </AbsoluteFill>
  );
};

/** 0:48 · kids carried turnip lanterns: carved face, candle inside. */
const Lantern: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="turnip_lantern" x={980} y={170} w={640} at={t.at('turnips') - a - 6} coral trace from="top" />
    <Highlight text="TURNIP" x={110} y={130} size={120} at={t.at('turnips') - a} seed={212} rot={-3} />
    <Highlight text="LANTERNS" x={130} y={300} size={120} at={t.at('turnips') - a + 3} seed={213} rot={-2} />
    <Note text="a face carved in" x={140} y={520} size={64} rot={-4} at={t.at('face carved') - a - 3} />
    <Arrow x1={620} y1={580} x2={1080} y2={560} bow={-40} at={t.at('face carved') - a + 6} color={TEAL} width={6} />
    <Prop name="tallow_candle" x={420} y={680} w={300} at={t.at('candle') - a - 2} />
    <Note text="+ a candle" x={140} y={760} size={64} rot={-3} at={t.at('candle') - a - 3} />
  </AbsoluteFill>
);

/** 0:53 · "Look at this one": the real turnip lantern in the Museum of Country Life. */
const Museum: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <Desk src="img/ch02/turnip_jackolantern_museum_country_life.jpg" size={[1000, 1287]} box={[220, 100, 640, 816]} at={-2} rot={-2} pos={[0.5, 0.5]}
    tag="Museum of Country Life, Ireland · CC BY-SA 3.0">
    {(S) => {
      const [cx, cy] = S(520, 520);
      return (
        <>
          <Loop cx={cx} cy={cy} rx={290} ry={250} at={t.at('this one') - a} width={6} seed={214} tilt={-5} />
          <Note text="a real one" x={1000} y={170} size={70} rot={-4} at={t.at('this one') - a - 3} />
          <Note text="Museum of Country Life, Co. Mayo" x={1000} y={300} size={46} rot={-3} at={t.at('museum') - a - 3} color="#ffffff" />
          <Note text="(a cast of an old carved turnip)" x={1010} y={390} size={40} rot={-3} at={t.at('museum') - a + 8} color="#ffffff" />
          <Highlight text="WAY CREEPIER" x={990} y={560} size={100} at={t.at('Way creepier') - a} seed={215} rot={-3} />
          <Note text="than a pumpkin." x={1020} y={740} size={70} rot={-4} at={t.at('than a pumpkin') - a - 3} color={CORAL} />
        </>
      );
    }}
  </Desk>
);

/** 0:59 · guisers: soot-blacked faces, fake voices (the guisers painting; a sacking mask on the desk edge). */
const Guisers: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="ch02_guisers" size={guisers.size as [number, number]} glowLayer={guisers.glowLayer} a={0} b={b - a} cam={{z: [1.04, 1.1], x: [30, -30]}} fade={4} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 28%)'}} />
    <Highlight text="IN DISGUISE" x={110} y={80} size={100} at={t.at('disguise') - a} seed={216} rot={-2} />
    <Slip text="faces blacked with soot" x={130} y={240} at={t.at('faces blacked') - a} size={52} rot={-2} />
    <Slip text="fake voices" x={170} y={340} at={t.at('fake voices') - a} size={52} rot={-3} />
  </AbsoluteFill>
);

/** 1:05 · the mischief: the list card, a prop per line; then "hold onto that list": the pin goes in. */
const Mischief: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const hold = t.at('Hold onto') - a;
  const smoke = interpolate(f, [t.at('Chimneys') - a, t.at('smoke') - a, hold, hold + 10], [0, 0.45, 0.45, 0], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Prop name="guising_mask" x={1280} y={90} w={420} at={2} rot={6} out={t.at('Gates') - a - 2} from="top" />
      <Smoke density={smoke} seed="chimney" y={860} spread={160} speed={1.2} />
      <MischiefList x={120} y={250} rot={-2} at={t.at('mischief') - a - 2}
        lines={MISCHIEF.map((text, i) => ({text, at: t.at(['Gates', 'Cabbages', 'Chimneys'][i]) - a - 2}))} pinAt={hold} loopAt={t.at('that list') - a} />
      <Prop name="iron_gate" x={1080} y={120} w={760} rot={-8} at={t.at('Gates') - a - 2} out={t.at('cross an ocean') - a - 4} from="top" />
      <Prop name="cabbage" x={1260} y={540} w={360} at={t.at('Cabbages') - a - 2} out={t.at('cross an ocean') - a - 4} />
      <Note text="it's about to cross an ocean" x={1110} y={500} size={56} rot={-4} at={t.at('cross an ocean') - a - 3} />
      <Arrow x1={1300} y1={640} x2={1760} y2={700} bow={-50} at={t.at('cross an ocean') - a + 8} color={TEAL} width={7} />
    </AbsoluteFill>
  );
};

/** 1:18 · the Samhain myth: a messy line back from Halloween; the name is Christian (All Hallows' Eve). */
const Samhain: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  const line = t.at('line back') - a;
  const p = interpolate(g, [line, line + 30], [0, 1], clamp);
  // a tangled, doubling-back line from ALL HALLOWS' EVE up to SAMHAIN?
  const d = 'M800,620 C700,560 760,470 640,500 S560,600 520,500 S600,380 480,420 S380,520 400,400 S470,300 360,330 S300,280 330,250';
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="SAMHAIN?" x={110} y={110} size={110} at={t.at('Samhain') - a} seed={217} rot={-3} />
      <Note text="a Celtic festival, 2,000 years ago?" x={790} y={150} size={46} rot={-3} at={t.at('two thousand') - a - 3} color="#ffffff" />
      <Note text="historians argue about that" x={800} y={270} size={54} rot={-4} at={t.at('Historians argue') - a - 3} color={ORANGE} />
      <Note text="the name: a Christian holiday" x={830} y={500} size={50} rot={-3} at={t.at('Christian holiday') - a - 3} />
      <Highlight text="ALL HALLOWS' EVE" x={810} y={600} size={84} at={t.at("All Hallows' Eve") - a} seed={218} rot={-2} />
      <Definition term="All Hallows' Eve" def="the night before All Saints' Day (Nov. 1). Shortened, it became “Halloween”" at={t.at("All Hallows' Eve") - a + 9} x={810} y={760} w={980} />
      {g >= line && (
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          <path d={d} fill="none" stroke={pal.mark} strokeWidth={6} strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p} strokeLinecap="round" />
        </svg>
      )}
      <Note text="?" x={600} y={300} size={110} rot={-8} at={t.at('anything ancient') - a} color={CORAL} />
      <Note text="messier than the internet says" x={110} y={900} size={58} rot={-3} at={t.at('messier') - a - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {hearth: at('And the dead') - 1, party: at('But mostly') - 1, duck: at('People ducking') - 1, brack: at('The big fortune') - 1, lantern: at('Kids carried') - 1,
    museum: at('Look at this one') - 1, guise: at('People went out') - 1, mischief: at('Which came in handy') - 1, samhain: at('You may have heard') - 1};
  const cuts: [number, React.ReactNode][] = [
    [0, <Turnips t={t} b={c.hearth} />],
    [c.hearth, <Sequence from={c.hearth} layout="none"><Hearth t={t} a={c.hearth} b={c.party} /></Sequence>],
    [c.party, <Sequence from={c.party} layout="none"><Party t={t} a={c.party} /></Sequence>],
    [c.duck, <Sequence from={c.duck} layout="none"><Ducking t={t} a={c.duck} /></Sequence>],
    [c.brack, <Sequence from={c.brack} layout="none"><Brack t={t} a={c.brack} /></Sequence>],
    [c.lantern, <Sequence from={c.lantern} layout="none"><Lantern t={t} a={c.lantern} /></Sequence>],
    [c.museum, <Sequence from={c.museum} layout="none"><Museum t={t} a={c.museum} /></Sequence>],
    [c.guise, <Sequence from={c.guise} layout="none"><Guisers t={t} a={c.guise} b={c.mischief} /></Sequence>],
    [c.mischief, <Sequence from={c.mischief} layout="none"><Mischief t={t} a={c.mischief} /></Sequence>],
    [c.samhain, <Sequence from={c.samhain} layout="none"><Samhain t={t} a={c.samhain} /></Sequence>],
  ];
  const scene = useScene(cuts);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['Ireland', 'coming home', 'party', 'ducking', "who you'd marry", 'barmbrack', 'turnips', 'Way creepier', 'disguise', 'mischief', 'Samhain', "All Hallows' Eve"].map((p) =>
        <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.28} />)}
      {['about two hundred', 'last night', 'harvest', 'real Halloween party', 'County Cork', 'painted by', 'who was there', 'tub', 'Games', 'fortune-telling', 'Find the ring', 'married within', 'face carved',
        'candle', 'this one', 'museum', 'than a pumpkin', 'Gates', 'Cabbages', 'Chimneys', 'cross an ocean', 'two thousand', 'Historians argue', 'Christian holiday', 'messier'].map((p) =>
        <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('Look at this painting') - 2} src="sfx/tick.wav" volume={0.45} />
      <Sfx at={at('teeth')} src="sfx/tick_soft.wav" volume={0.5} />
      <Sfx at={at('food', 2) - 2} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at('Hold onto')} src="sfx/tick.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_the_night_the_dead_came_home.wav" lead={LEAD}
    music={[{src: 'music/hb_oiche_shamhna.mp3', volume: bed('hb_oiche_shamhna')}]}>
    <Body />
  </ChapterShell>
);
