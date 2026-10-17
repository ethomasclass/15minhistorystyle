// Chapter 2 · The Perfect Green: the 1860s craze, Scheele's green (1775) and his own warning, Paris green, why
// everyone wanted it (smoke vs. country, machines, 1.2 → 32 million rolls), and the "everywhere" montage that fills
// the Swatch.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch02_perfect_green.words.json';
import {clamp} from '../lib/anim';
import {FPS} from '../lib/theme';
import {boxOf, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Desk, DropCard, LOOK, Sounds} from '../kit/bs';
import {Doc, GREEN, Swatch, sizeOf} from '../kit/dk';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

const COLOUR = 'contrast(1.05) saturate(1.02)';
const BLOSSOMS = 'img/ch02/green_wallpaper_blossoms_usa_1840s_ch.jpg';
const DRESS = 'img/ch03/met_green_silk_dress_1868.jpg';
const WREATH = 'img/ch03/met_wedding_headdress_green_leaves_1863.jpg';
const SCHEELE = 'img/ch02/scheele_scheffner_engraving.png';
const BAB = 'img/ch02/bab_ballads_only_a_dancing_girl_1869_p2_arsenic_green.jpg';

/** A colour CropCard that creeps in from its pop (a slow punch-in). */
const Creep: React.FC<{src: string; x: number; y: number; w: number; h: number; fx: number; fy: number; scale: number; rot: number; at: number}> = ({src, x, y, w, h, fx, fy, scale, rot, at}) => {
  const f = useCurrentFrame();
  const s = scale * (1 + Math.max(0, f - at) * 0.0018);
  return <CropCard src={src} size={sizeOf(src)} x={x} y={y} w={w} h={h} fx={fx} fy={fy} scale={s} rot={rot} at={at} bw={COLOUR} />;
};

/** By the 1860s you wanted green: walls, dress, hair (real objects, real colour). */
const Craze: React.FC<{t: TL}> = ({t}) => (
  <Desk a={0}>
    <Highlight text="THE 1860s" x={110} y={70} size={84} at={t.at('1860s')} seed={41} rot={-2} />
    <Note text="if you wanted to be in fashion..." x={720} y={60} size={50} rot={-3} at={t.at('if you wanted') - 3} color="#ffffff" />
    <Note text="...you wanted green." x={1020} y={140} size={56} rot={-3} at={t.at('wanted green') - 3} />
    <Creep src={BLOSSOMS} x={150} y={250} w={500} h={600} fx={900} fy={1450} scale={0.36} rot={-2} at={t.at('walls') - 2} />
    <Creep src={DRESS} x={710} y={250} w={500} h={600} fx={817} fy={1000} scale={0.31} rot={2} at={t.at('dress') - 2} />
    <Creep src={WREATH} x={1270} y={250} w={500} h={600} fx={1450} fy={1050} scale={0.31} rot={-1.5} at={t.at('hair') - 2} />
    <Note text="your walls" x={300} y={900} size={48} rot={-3} at={t.at('walls') - 3} color="#ffffff" />
    <Note text="your dress" x={860} y={900} size={48} rot={-3} at={t.at('dress') - 3} color="#ffffff" />
    <Note text="your hair" x={1430} y={900} size={48} rot={-3} at={t.at('hair') - 3} color="#ffffff" />
    <Tag text="Sidewall, USA, 1840s · Cooper Hewitt  ·  Dress, 1868; wedding headdress, 1863 · The Met" />
  </Desk>
);

/** A chemist in Sweden, 1775: Scheele (posthumous engraving, coral, traced) and his 1789 medal. */
const Scheele: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('And it goes')}>
    <CropCard src={SCHEELE} size={sizeOf(SCHEELE)} x={170} y={120} w={560} h={760} fx={1330} fy={1250} scale={0.36} rot={-2} at={t.at('And it goes') - 1}
      mask={MASKS.scheele} traceAt={t.at('Scheele') + 3} />
    <Note text="a chemist in Sweden" x={860} y={130} size={60} rot={-3} at={t.at('chemist') - 3} />
    <Highlight text="1775" x={860} y={270} size={130} at={t.at('1775')} seed={43} rot={-2} />
    <Note text="Carl Wilhelm Scheele" x={880} y={470} size={60} rot={-3} at={t.at('Carl') - 3} color="#ffffff" />
    <DropCard src="img/ch02/scheele_medal_wikman_1789.jpg" x={1340} y={560} w={360} rot={4} at={t.at('Scheele') - 1} />
    <Note text="(no life portrait survives)" x={860} y={860} size={40} rot={-2} at={t.at('Scheele') + 6} color="#ffffff" />
    <Tag text="Scheele, later engraving (J. G. Scheffner) · Wikimedia Commons  ·  Medal by I. G. Wikman, 1789 · Science Museum Group, CC BY 4.0" />
  </Desk>
);

/** A torn patch of the pigment itself (the only green on the desk). */
const Patch: React.FC<{x: number; y: number; w: number; h: number; at: number}> = ({x, y, w, h, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], clamp);
  const pts: string[] = [];
  for (let i = 0; i <= 20; i++) pts.push(`${(i / 20) * 100}% ${random(`pt${i}`) * 7}%`);
  for (let i = 0; i <= 14; i++) pts.push(`${100 - random(`pr${i}`) * 4}% ${(i / 14) * 100}%`);
  for (let i = 20; i >= 0; i--) pts.push(`${(i / 20) * 100}% ${100 - random(`pb${i}`) * 7}%`);
  for (let i = 14; i >= 0; i--) pts.push(`${random(`pl${i}`) * 4}% ${(i / 14) * 100}%`);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${0.6 + 0.4 * k}) rotate(3deg)`, opacity: Math.min(1, k * 2),
      filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.6))'}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 40% 35%, #8fd083 0%, ${GREEN} 55%, #5c9e56 100%)`, clipPath: `polygon(${pts.join(',')})`}} />
    </div>
  );
};

/** Copper + arsenic = a bright, clean green: Scheele's recipe (English edition), and the name. */
const Recipe: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('mixes');
  return (
    <Desk a={a}>
      <Doc src="img/ch02/scheele_new_green_colour_1778_essays1786_p253.jpg" x={110} y={60} w={520} at={a - 1} rot={-1.5} push={[a, t.at('In a letter')]} fx={770} fy={2300} zoom={1.3}
        marks={[{at: t.at('arsenic') - 2, to: t.at('arsenic') + 14, swipe: [[110, 2262, 1430, 2336], [110, 2342, 270, 2408]]},
          {at: t.at('knew exactly'), box: [100, 395, 1440, 560], seed: 7}]} />
      <Note text="copper" x={790} y={120} size={64} rot={-3} at={t.at('copper') - 3} />
      <Note text="+ arsenic" x={1050} y={120} size={64} rot={-3} at={t.at('arsenic') - 3} color={pal.subject} />
      <Note text="=" x={1405} y={115} size={64} rot={0} at={t.at('bright') - 3} />
      <Patch x={1490} y={95} w={220} h={150} at={t.at('clean green')} />
      <Note text="brighter than any plant dye" x={800} y={320} size={52} rot={-3} at={t.at('Brighter') - 3} color="#ffffff" />
      <Note text="...and cheap." x={830} y={420} size={60} rot={-3} at={t.at('cheap') - 3} color={pal.subject} />
      <Highlight text="SCHEELE'S GREEN" x={790} y={570} size={88} at={t.at("Scheele's Green")} seed={45} rot={-2} />
      <Definition term="Scheele's green" def="copper + arsenic: the first bright, cheap green paint" at={t.at("Scheele's Green") + 9} x={800} y={740} w={1020} />
      <Note text="and he knew exactly what was in it" x={800} y={900} size={46} rot={-3} at={t.at('knew exactly') - 3} color="#ffffff" />
      <Tag text="Scheele, 'A new green colour, 1778', Chemical Essays, 1786, p. 253 · Wellcome Collection" x={660} />
    </Desk>
  );
};

/** His letter to a friend: the highlighter runs along his warning. Not a great sign. */
const Warning: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('In a letter');
  return (
    <Desk a={a}>
      <Doc src="img/ch02/scheele_letter_gahn_9feb1777_p195_arsenic.jpg" x={60} y={-300} w={1150} at={a - 1} push={[a, t.at('In 1814')]} fx={1300} fy={1810} zoom={1.25}
        marks={[{at: t.at('he said') - 2, to: t.end('making it'), swipe: [[578, 1668, 2155, 1722], [440, 1746, 2155, 1800], [440, 1826, 2155, 1880], [440, 1906, 910, 1958]]}]} />
      <Note text="to a friend, 1777" x={1330} y={150} size={52} rot={-3} at={t.at('to a friend') - 3} color="#ffffff" />
      <Note text="translation:" x={1330} y={360} size={56} rot={-3} at={t.at('arsenic in it') - 3} />
      <Note text="careful," x={1360} y={460} size={64} rot={-3} at={t.at('in case') - 3} />
      <Note text="it's arsenic." x={1380} y={560} size={64} rot={-3} at={t.at('someone hurt') - 3} />
      <Note text="not a great sign." x={1300} y={780} size={56} rot={-4} at={t.at('Not a great') - 3} color={pal.subject} />
      <Tag text="Scheele to J. G. Gahn, 9 Feb. 1777, in Nachgelassene Briefe (1892), p. 195 · Internet Archive" />
    </Desk>
  );
};

/** 1814, Paris green; same thing for us; the poet's name for it. */
const Paris: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In 1814');
  const poet = t.at('one Victorian') - 1;
  return (
    <Desk a={a}>
      <Highlight text="1814" x={110} y={90} size={110} at={t.at('1814')} seed={47} rot={-2} />
      <Note text="German chemists: even brighter" x={130} y={260} size={48} rot={-3} at={t.at('German') - 3} color="#ffffff" />
      <Highlight text="PARIS GREEN" x={110} y={390} size={96} at={t.at('Paris green')} seed={48} rot={-2} />
      <Definition term="Paris green" def="copper, arsenic and vinegar: Scheele's green, only brighter" at={t.at('Paris green') + 9} x={120} y={560} w={900} />
      <Note text="(for us: the same thing)" x={140} y={710} size={50} rot={-3} at={t.at('same thing') - 3} />
      <Highlight text="ARSENIC GREEN" x={110} y={830} size={96} at={t.at('arsenic green')} seed={49} rot={-2} />
      <Doc src={BAB} x={1190} y={90} w={560} at={poet} rot={2} push={[poet, t.at('So why')]} fx={970} fy={1030} zoom={1.3}
        marks={[{at: t.at('arsenic green') - 1, box: [815, 1008, 1125, 1052], tint: true, seed: 3}]} />
      <CropCard src={BAB} size={sizeOf(BAB)} x={1060} y={700} w={740} h={140} fx={980} fy={1030} scale={1.4} rot={-2} at={t.at('arsenic green') - 2} bw={LOOK.doc}>
        {(S) => {
          const [cx, cy] = S(970, 1030);
          return <Loop cx={cx} cy={cy} rx={240} ry={52} at={t.at('arsenic green') + 3} seed={9} tilt={-2} />;
        }}
      </CropCard>
      <Tag text="W. S. Gilbert, 'Only a Dancing Girl', The Bab Ballads, 1869, p. 25 · Internet Archive" />
    </Desk>
  );
};

/** Why did everyone want it? Timing. Then the smoky city against the green countryside (both B&W). */
const Timing: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const split = t.at('Factories') - 1;
  if (f < split) {
    return (
      <Desk a={t.at('So why')}>
        <Note text="so why did everyone want it?" x={300} y={330} size={80} rot={-3} at={t.at('So why') + 1} color="#ffffff" />
        <Highlight text="TIMING." x={560} y={520} size={150} at={t.at('Timing')} seed={51} rot={-2} />
      </Desk>
    );
  }
  const k = interpolate(f, [split, t.at('And with new')], [1.04, 1.12], {...clamp, easing: Easing.inOut(Easing.sin)});
  const half = (src: string, left: number, pos: string, look: string) => (
    <div style={{position: 'absolute', left, top: 0, width: 958, height: 1080, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: look,
        transform: `scale(${k})`, transformOrigin: pos}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.6) 100%)'}} />
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      {half('img/ch02/dore_over_london_by_rail_1872.jpg', 0, '45% 30%', 'grayscale(1) contrast(1.3) brightness(0.9)')}
      {f >= t.at('Green was') - 1 && half('img/ch02/wyld_manchester_from_kersal_moor_1852.jpg', 962, '30% 60%', 'grayscale(1) contrast(1.25) brightness(0.95)')}
      <div style={{position: 'absolute', left: 958, top: 0, width: 4, height: 1080, background: '#f4efe6'}} />
      <div style={{position: 'absolute', left: 80, top: 60, fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color: pal.mark, background: 'rgba(10,10,10,0.75)', padding: '6px 14px'}}>THE CITY</div>
      {f >= t.at('Green was') - 1 && <div style={{position: 'absolute', left: 1040, top: 60, fontFamily: JF.mono, fontSize: 34, letterSpacing: 3, color: pal.subject, background: 'rgba(10,10,10,0.75)', padding: '6px 14px'}}>THE COUNTRY</div>}
      <Note text="smoke and soot" x={110} y={860} size={64} rot={-3} at={t.at('smoke') - 3} color="#ffffff" />
      <Note text="green = the countryside" x={1040} y={760} size={54} rot={-3} at={t.at('countryside') - 3} color="#ffffff" />
      <Note text="everything the city wasn't" x={1060} y={870} size={54} rot={-3} at={t.at('city wasnt') - 3} />
      <Tag text="Gustave Doré, Over London by Rail, 1872  ·  William Wyld, Manchester from Kersal Moor, 1852" />
    </AbsoluteFill>
  );
};

/**
 * Two bars, each on its spoken number. The second (32 million) overshoots the frame for a beat, then the axis
 * rescales (log space) so both fit. Bone and coral only, never green.
 */
const RollsChart: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const base = 900, H = 640, bw = 230;
  const b1 = t.at('12');
  const b2 = t.at('32');
  const rs = b2 + 12;
  const M = Math.exp(interpolate(g, [rs, rs + 12], [Math.log(1.6), Math.log(34)], {...clamp, easing: Easing.inOut(Easing.cubic)}));
  const v1 = 1.2 * interpolate(g, [b1, b1 + 8], [0, 1], clamp);
  const v2 = 32 * interpolate(g, [b2, b2 + 8], [0, 1], clamp);
  const h1 = (v1 / M) * H;
  const h2 = Math.min((v2 / M) * H, 1400);
  const x1 = 1060, x2 = 1450;
  const jit = Array.from({length: 24}, (_, i) => `${i ? 'L' : 'M'}${980 + (860 * i) / 23},${base + (random(`rb${i}`) - 0.5) * 4}`).join(' ');
  const baseP = interpolate(g, [t.at('In 1834'), t.at('In 1834') + 8], [0, 1], clamp);
  const lbl = (x: number, text: string, on: boolean) => (
    <div style={{position: 'absolute', left: x, top: base + 18, width: bw, textAlign: 'center', fontFamily: JF.mono, fontSize: 30, letterSpacing: 2, color: 'rgba(255,255,255,0.85)', opacity: on ? 1 : 0.35}}>{text}</div>
  );
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d={jit} fill="none" stroke={pal.mark} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - baseP} />
        {h1 > 0 && <rect x={x1} y={base - h1} width={bw} height={h1} rx={4} fill="rgba(237,231,220,0.62)" />}
        {h2 > 0 && <rect x={x2} y={base - h2} width={bw} height={h2} rx={4} fill={pal.subject} />}
      </svg>
      {g >= t.at('In 1834') && lbl(x1, '1834', g >= b1)}
      {g >= t.at('Forty') && lbl(x2, '1874', g >= b2)}
      {g >= b1 + 8 && (
        <div style={{position: 'absolute', left: x1 - 40, top: base - h1 - 70, width: bw + 80, textAlign: 'center', fontFamily: JF.display, fontSize: 46, color: '#f4efe6', whiteSpace: 'nowrap',
          textShadow: '0 3px 12px rgba(0,0,0,0.8)'}}>1.2 million</div>
      )}
      {g >= rs + 12 && (
        <div style={{position: 'absolute', left: x2 - 40, top: base - h2 - 80, width: bw + 80, textAlign: 'center', fontFamily: JF.display, fontSize: 58, color: pal.subject, whiteSpace: 'nowrap',
          textShadow: '0 3px 12px rgba(0,0,0,0.8)'}}>32 million</div>
      )}
      <Note text="rolls of wallpaper a year, Britain" x={990} y={110} size={44} rot={-2} at={t.at('rolls') - 3} color="#ffffff" />
      <Note text="about 27×" x={1110} y={620} size={56} rot={-3} at={rs + 16} />
    </>
  );
};

/** New printing machines made it cheap; output went from 1.2 to 32 million rolls. */
const Machines: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('And with new')}>
    <DropCard src="img/ch02/figuier_wallpaper_machine_twenty_colours_1873.jpg" x={110} y={100} w={520} rot={-2} at={t.at('And with new') - 1} />
    <Note text="new printing machines" x={120} y={760} size={56} rot={-3} at={t.at('printing machines') - 3} />
    <Note text="cheap enough for ordinary families" x={130} y={870} size={42} rot={-3} at={t.at('ordinary families') - 3} color="#ffffff" />
    <RollsChart t={t} />
    <Tag text="Figuier, Les Merveilles de l'industrie, 1873–77: printing wallpaper in twenty colours  ·  output figures approximate" />
  </Desk>
);

/** A small card that drops onto the desk, cropped to a fixed window, with an orange tab. */
const Item: React.FC<{src: string; x: number; y: number; w?: number; h?: number; rot: number; at: number; pos: string; colour?: boolean; tab: string}> = ({
  src, x, y, w = 300, h = 300, rot, at, pos, colour, tab,
}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < at) return null;
  const sp = spring({frame: f - at, fps: FPS, config: {stiffness: 260, damping: 15, mass: 0.9}});
  const air = 1 - Math.min(sp, 1);
  const scale = 1 + air * 0.4 - Math.max(sp - 1, 0) * 0.6;
  return (
    <div style={{position: 'absolute', left: x, top: y - air * 60, width: w + 20, transform: `scale(${scale}) rotate(${rot + air * 7}deg)`, opacity: Math.min(1, (f - at + 1) / 2)}}>
      <div style={{background: '#f4efe6', padding: 10, boxShadow: `0 ${14 + air * 70}px ${12 + air * 60}px rgba(0,0,0,${0.7 - air * 0.35})`}}>
        <Img src={staticFile(src)} style={{width: w, height: h, objectFit: 'cover', objectPosition: pos, display: 'block', filter: colour ? COLOUR : LOOK.bw}} />
      </div>
      <div style={{position: 'absolute', left: 14, bottom: -26, transform: 'rotate(-2deg)', background: boxOf(pal), padding: '3px 14px 1px', fontFamily: JF.display, fontSize: 30,
        color: pal.ink, whiteSpace: 'nowrap', boxShadow: '0 6px 14px rgba(0,0,0,0.5)'}}>{tab}</div>
    </div>
  );
};

/** "So arsenic green went everywhere": each thing lands on its word and the Swatch fills. All of it, arsenic. */
const Everywhere: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('So arsenic');
  const W = t.at('Parlor walls') - 1, G = t.at('Ball gowns') - 1, R = t.at('fake leaves') - 1, C = t.at('Candy') - 1, T = t.at('toys') - 1, B = t.at('book covers') - 1;
  return (
    <Desk a={a}>
      <Item src="img/ch02/green_wallpaper_ivy_england_1840s_ch.jpg" x={110} y={110} rot={-3} at={W} pos="40% 50%" colour tab="WALLS" />
      <Item src="img/ch03/met_green_silk_dress_1868_view2.jpg" x={490} y={95} rot={2} at={G} pos="50% 35%" colour tab="GOWNS" />
      <Item src={WREATH} x={870} y={120} rot={-2} at={R} pos="60% 50%" colour tab="WREATHS" />
      <Item src="img/ch02/great_lozenge_maker_punch_1858.jpg" x={200} y={500} rot={2} at={C} pos="55% 62%" tab="CANDY" />
      <Item src="img/ch02/paper_doll_nursery_1883_met.jpg" x={580} y={515} rot={-3} at={T} pos="30% 60%" tab="TOYS" />
      <Item src="img/ch02/green_book_cloth_rhymes_country_life_1858_bl.jpg" x={960} y={500} rot={3} at={B} pos="78% 50%" tab="BOOKS" />
      <Swatch at={a} items={[{label: 'WALLS', at: W + 2}, {label: 'GOWNS', at: G + 2}, {label: 'WREATHS', at: R + 2}, {label: 'CANDY', at: C + 2}, {label: 'TOYS', at: T + 2}, {label: 'BOOKS', at: B + 2}]} />
      <Highlight text="EVERYWHERE." x={110} y={900} size={96} at={t.at('everywhere')} seed={53} rot={-2} />
      <Note text="all of it," x={1420} y={520} size={64} rot={-4} at={t.at('All of it') - 3} color="#ffffff" />
      <Stamp text="ARSENIC." x={1060} y={890} at={t.at('arsenic', 5)} size={130} color={pal.subject} rot={-3} />
      <Tag text="Cooper Hewitt · The Met · Punch, 20 Nov. 1858 · The Met · British Library" x={44} y={40} />
    </Desk>
  );
};

export const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Craze t={t} />],
    [at('And it goes') - 1, <Scheele t={t} />],
    [at('mixes') - 1, <Recipe t={t} />],
    [at('In a letter') - 1, <Warning t={t} />],
    [at('In 1814') - 1, <Paris t={t} />],
    [at('So why') - 1, <Timing t={t} />],
    [at('And with new') - 1, <Machines t={t} />],
    [at('So arsenic') - 1, <Everywhere t={t} />],
  ];
  const items = ['Parlor walls', 'Ball gowns', 'fake leaves', 'Candy', 'toys', 'book covers'].map((p) => at(p) - 1);
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={[...cuts.map((c) => c[0]), at('Factories') - 1]}
        stamps={[at('1860s'), at('1775'), at("Scheele's Green"), at('1814'), at('Paris green'), at('arsenic green'), at('Timing'), at('everywhere')]}
        booms={[at('32'), at('arsenic', 5)]}
        writes={['if you wanted', 'wanted green', 'walls', 'dress', 'hair', 'chemist', 'Carl', 'copper', 'arsenic', 'bright', 'Brighter', 'cheap', 'knew exactly', 'to a friend', 'arsenic in it',
          'in case', 'someone hurt', 'Not a great', 'German', 'same thing', 'So why', 'smoke', 'countryside', 'city wasnt', 'printing machines', 'ordinary families', 'rolls', 'All of it'].map((p) => at(p))}
        ticks={[at('walls') - 2, at('dress') - 2, at('hair') - 2, at('Scheele') - 1, at('clean green'), at('12'), ...items]}
        extra={[{at: at('one Victorian') - 1, src: 'sfx/page_turn.wav', volume: 0.35}, {at: at('In a letter') - 1, src: 'sfx/page_turn.wav', volume: 0.35}]} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_perfect_green.wav" lead={LEAD} music={[{src: 'music/g_pyramid.mp3', volume: 0.22}]}>
    <Body />
  </ChapterShell>
);
