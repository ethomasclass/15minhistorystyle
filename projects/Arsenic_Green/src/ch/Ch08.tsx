// Chapter 8 · Back to the Book: the answer (beautiful and cheap; messy proof, big money, nobody had to prove it safe),
// the Limehouse jury, the shoppers, Kedzie's book sealed in plastic (the Swatch SEALED beside it), the thesis line,
// the last line over the Arsenic Waltz, then a music-only end screen with two clear slots for YouTube's elements.
import React from 'react';
import {Img, interpolate, random, staticFile} from 'remotion';
import words from '../../public/audio/ch08_back_to_the_book.words.json';
import {clamp} from '../lib/anim';
import {Arrow, boxOf, Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, PhotoCard, type TL, useScene} from '../kit/shell';
import {Arch, Desk, Sounds} from '../kit/bs';
import {Doc, GreenParallax, Plain, Sil, SWATCH_LABELS, Swatch, sizeOf} from '../kit/dk';
import {MASKS} from '../masks';

const N = words as Narration;
/** Music-only end screen after the narration (the shell adds its own tail and fade): ~14 s of music after the last word. */
const END_SCREEN = 390;
export const CH08_FRAMES = chapterFrames(N, LEAD) + END_SCREEN;

const IVY = 'img/ch02/green_wallpaper_ivy_england_1840s_ch.jpg';
const MORRIS = 'img/ch05/william_morris_hollyer_c1887.jpg';
const MINE = 'img/ch05/mining_journal_1876-12-09_devon_great_consols_arsenic_letters.jpg';
const WOOLLAMS = 'img/ch07/advert_wallpaper_free_from_arsenic_c1890_crop.jpg';
const BOARD = 'img/ch01/kedzie_cover_green_label_1874.jpg';
const LEAF = 'img/ch01/kedzie_specimen_n184.jpg';
const WALTZ = 'img/ch03/arsenic_waltz_punch_1862.jpg';
const NLM = 'Courtesy of the National Library of Medicine';

/** "So let's go back to the question." The cold open's question, on the desk again. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={0}>
      <Note text="back to the question:" x={180} y={160} size={60} rot={-3} at={t.at("So let's") + 2} color="#ffffff" />
      <Note text="how did a poison end up on the walls?" x={220} y={330} size={62} rot={-3} at={t.at('How did a poison') - 2} />
      <Note text="and why did it take so long" x={220} y={500} size={62} rot={-3} at={t.at('And why did') - 2} color={pal.subject} />
      <Note text="to get it off?" x={300} y={630} size={62} rot={-3} at={t.at('to get it off') - 2} color={pal.subject} />
    </Desk>
  );
};

/** "It got there because it was beautiful, and cheap." A green wallpaper, in its own colour. */
const Beautiful: React.FC<{t: TL}> = ({t}) => (
  <Arch src={IVY} tag="Sidewall, England, 1840s, Arthur Sanderson & Sons · Cooper Hewitt, Smithsonian Design Museum" a={t.at('It got there')} b={t.at('It stayed')} z={[1.04, 1.12]} look="card">
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,9,7,0.55) 0%, rgba(10,9,7,0.3) 55%, transparent 80%)'}} />
    <Note text="it got there because it was..." x={130} y={180} size={56} rot={-3} at={t.at('It got there') - 2} color="#ffffff" />
    <Highlight text="BEAUTIFUL," x={140} y={360} size={130} at={t.at('beautiful')} seed={801} rot={-2} />
    <Highlight text="AND CHEAP." x={260} y={580} size={130} at={t.at('cheap')} seed={803} rot={-3} />
  </Arch>
);

/** A teal hand underline drawn on under a quoted line (screen coords). */
const Underline: React.FC<{x0: number; y0: number; x1: number; y1: number; at: number}> = ({x0, y0, x1, y1, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  const d = Array.from({length: 10}, (_, i) => `${i ? 'L' : 'M'}${x0 + ((x1 - x0) * i) / 9},${y0 + ((y1 - y0) * i) / 9 + (random(`ul${i}`) - 0.5) * 4 + 6}`).join(' ');
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={d} fill="none" stroke={pal.mark} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** Why it stayed: messy proof, big money (Morris, the mine), and nobody had to prove it safe. */
const Stayed: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const money = t.at('the money');
  return (
    <Desk a={t.at('It stayed')}>
      <Note text="it stayed because..." x={130} y={90} size={56} rot={-3} at={t.at('It stayed') - 2} color="#ffffff" />
      <Note text="1. the proof was messy" x={150} y={230} size={58} rot={-3} at={t.at('the proof') - 2} />
      <Note text="2. the money was big" x={150} y={380} size={58} rot={-3} at={money - 2} />
      <Note text="3. nobody had to prove it was safe" x={150} y={530} size={56} rot={-3} at={t.at('nobody had to') - 2} color={pal.subject} />
      <PhotoCard src={MORRIS} x={1320} y={70} w={300} h={380} rot={3} at={money - 1} />
      <CropCard src={MINE} size={sizeOf(MINE)} x={1060} y={690} w={760} h={170} fx={1990} fy={1300} scale={0.5} rot={-2} at={money + 4} bw="grayscale(1) sepia(0.3) contrast(1.15)">
        {(S) => {
          const [x0, y0] = S(1935, 1334);
          const [x1, y1] = S(2420, 1334);
          return <Underline x0={x0} y0={y0} x1={x1} y1={y1} at={t.at('was big') + 2} />;
        }}
      </CropCard>
      <Note text="“the largest arsenic producers”" x={1100} y={890} size={42} rot={-2} at={t.at('was big') + 2} color="#ffffff" />
      <Tag text="William Morris, Frederick Hollyer, c.1887 · Supplement to the Mining Journal, 9 Dec 1876" />
    </Desk>
  );
};

/** The burden of proof on the sick: Limehouse, the green walls, the verdict. */
const Burden: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Sil name="g_doctor" file="ch04_limehouse_room.jpg" label="the Limehouse room, 1862" a={t.at('It was up to') - 1} b={t.at('In Britain')} fx={0.5} fy={0.5} z={[1.03, 1.08]}>
      {() => (
        <>
          <Note text="the sick had to prove it" x={110} y={40} size={52} rot={-2} at={t.at('up to the sick') - 2} color="#ffffff" />
          <Note text="a family in Limehouse couldn't." x={130} y={130} size={46} rot={-2} at={t.at('A family in Limehouse') - 2} color="#ffffff" />
          <Note text="verdict: “natural”" x={700} y={880} size={60} rot={-3} at={t.at('called it natural') - 2} color={pal.subject} />
        </>
      )}
    </Sil>
  );
};

/** In Britain it was shoppers, not lawmakers: the arsenic-free advert again. */
const Shoppers: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('In Britain');
  return (
    <Desk a={a}>
      <Doc src={WOOLLAMS} x={230} y={90} w={600} rot={-2} at={a - 1} push={[a, t.at("Kedzie's book")]} zoom={1.06} fy={2660}
        marks={[{at: a + 6, to: a + 24, swipe: [[529, 2521, 3396, 2806]]}]} />
      <Note text="in Britain, it was" x={1000} y={200} size={56} rot={-3} at={a + 2} color="#ffffff" />
      <Note text="shoppers" x={1040} y={320} size={110} rot={-4} at={t.at('shoppers') - 2} />
      <Note text="not lawmakers." x={1060} y={560} size={70} rot={-3} at={t.at('not lawmakers') - 2} color={boxOf(pal)} />
      <Tag text="Wm. Woollams & Co. advert, c.1890 · Wellcome Collection" />
    </Desk>
  );
};

/** A clear plastic sleeve drawn over a card: gloss streaks, a heat-sealed top edge; slides on at `at`. */
const Sleeve: React.FC<{x: number; y: number; w: number; h: number; at: number; rot?: number}> = ({x, y, w, h, at, rot = 0}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 7], [0, 1], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3)});
  const pad = 26;
  const W = w + 2 * pad;
  const H = h + 2 * pad + 30;
  const j = (s: string) => (random(`sl${s}`) - 0.5) * 5;
  const line = `M${4 + j('a')},${34 + j('b')} L${W - 4 + j('c')},${34 + j('d')} L${W - 6 + j('e')},${H - 4 + j('f')} L${6 + j('g')},${H - 4 + j('h')} Z`;
  return (
    <div style={{position: 'absolute', left: x - pad, top: y - pad - 30 - (1 - k) * 140, width: W, height: H, opacity: k, transform: `rotate(${rot}deg)`}}>
      <div style={{position: 'absolute', left: 0, top: 30, right: 0, bottom: 0, borderRadius: 8, background: 'rgba(225,235,240,0.07)',
        boxShadow: 'inset 0 0 30px rgba(255,255,255,0.10), 0 10px 30px rgba(0,0,0,0.35)'}} />
      <div style={{position: 'absolute', left: 0, top: 30, right: 0, bottom: 0, borderRadius: 8,
        background: 'linear-gradient(118deg, transparent 22%, rgba(255,255,255,0.22) 27%, transparent 33%, transparent 58%, rgba(255,255,255,0.13) 62%, transparent 67%)'}} />
      {/* the heat-sealed lip along the top */}
      <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 40, borderRadius: '8px 8px 0 0', background: 'rgba(230,236,240,0.20)',
        borderBottom: '3px dashed rgba(255,255,255,0.55)'}} />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={W} height={H}>
        <path d={line} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={3} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Kedzie's book, still out there, sealed in plastic. Still green. The Swatch, SEALED beside it. */
const Sealed: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at("Kedzie's book");
  const sealed = t.at('sealed in plastic');
  const green = t.at('Still green');
  const [x, y, w] = [990, 200, 500];
  const h = (w * 7483) / 5569;
  const k = interpolate(g, [a, a + 5], [0, 1], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3) * (1 - 2.2 * v * (1 - v))});
  const col = interpolate(g, [green, green + 8], [0, 1], clamp);
  return (
    <Desk a={a}>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(-2deg) scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2),
        boxShadow: '0 18px 34px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
        <Img src={staticFile(BOARD)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'grayscale(1) sepia(0.2) contrast(1.1)'}} />
        <Img src={staticFile(BOARD)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'contrast(1.05)', opacity: col}} />
      </div>
      <Sleeve x={x} y={y} w={w} h={h} at={sealed} rot={-2} />
      <Swatch items={SWATCH_LABELS.map((label) => ({label, at: -99}))} at={a + 4} sealAt={sealed + 2} />
      <Note text="Kedzie's book, 1874" x={130} y={180} size={56} rot={-3} at={a - 2} color="#ffffff" />
      <Note text="still out there," x={150} y={300} size={56} rot={-3} at={t.at('still out there') - 2} color="#ffffff" />
      <Note text="sealed in plastic." x={170} y={420} size={56} rot={-3} at={sealed - 2} />
      <Highlight text="STILL GREEN." x={140} y={600} size={110} at={green} seed={805} rot={-2} />
      <Tag text={`R. C. Kedzie, Shadows from the Walls of Death, 1874: cover label, arsenical paper · ${NLM}`} />
    </Desk>
  );
};

/** The thesis: the green never changed; who had to prove it was safe did. A green sample beside it. */
const Changed: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('The green never')}>
    <Doc src={LEAF} x={150} y={110} w={500} rot={-2} at={t.at('The green never') - 1} colour push={[t.at('The green never'), t.at('William Morris')]} zoom={1.05} />
    <Plain text="The green never changed." x={790} y={200} size={66} at={t.at('The green never')} w={1060} />
    <Plain text="What changed was" x={790} y={420} size={56} at={t.at('What changed') - 2} w={1000} />
    <Highlight text="WHO HAD TO PROVE" x={790} y={540} size={88} at={t.at('who had to prove')} seed={807} rot={-2} />
    <Highlight text="IT WAS SAFE." x={850} y={690} size={88} at={t.at('it was safe', 2)} seed={809} rot={-2} />
    <Tag text={`Kedzie, Shadows from the Walls of Death, 1874: sample 184 · ${NLM}`} />
  </Desk>
);

/** "William Morris called it witch fever. But this time, the witch was real." The Waltz, pushing to the skull. */
const Witch: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <GreenParallax name="waltz_lady" src={WALTZ} size={sizeOf(WALTZ)} a={t.at('William Morris') - 1} b={t.at('Thanks') + 10}
      tag="The Arsenic Waltz, Punch, 8 Feb 1862 · Wellcome Collection" fx={0.43} fy={0.27} cam={{z: [1.2, 1.9]}} depth={1.05} mask={MASKS.waltz_lady} vignette={0.65}>
      {() => (
        <>
          <Note text="William Morris called it" x={110} y={60} size={50} rot={-3} at={t.at('William Morris') - 2} color="#ffffff" />
          <Note text="“witch fever.”" x={150} y={160} size={70} rot={-3} at={t.at('witch fever') - 2} color={boxOf(pal)} />
          <Note text="but this time..." x={1340} y={110} size={56} rot={-3} at={t.at('But this time') - 2} color="#ffffff" />
          <Highlight text="THE WITCH WAS REAL." x={120} y={860} size={100} at={t.at('the witch was real')} seed={811} rot={-2} />
        </>
      )}
    </GreenParallax>
  );
};

/**
 * The end screen: dark desk, a faint green Kedzie leaf, and two clear slots for YouTube's end-screen elements:
 * a video at x 150-950 / y 300-750 (left) and a subscribe circle centred near (1440, 525) (right). Nothing is drawn
 * inside either slot.
 */
export const VIDEO_SLOT = {x: 150, y: 300, w: 800, h: 450};
export const SUB_SLOT = {cx: 1440, cy: 525, r: 170};
const EndScreen: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Thanks');
  const leaf = interpolate(g, [a, a + 20], [0, 1], clamp);
  return (
    <Desk a={a} push={0.02}>
      {/* a faint green Kedzie leaf, in its own colour, lying in the top-right corner, clear of both slots */}
      <div style={{position: 'absolute', left: 1610, top: -150, width: 360, transform: 'rotate(12deg)', opacity: 0.34 * leaf, background: '#f4efe6', padding: 10,
        boxShadow: '0 18px 34px rgba(0,0,0,0.6)'}}>
        <Img src={staticFile(LEAF)} style={{width: '100%', display: 'block', filter: 'contrast(1.05)'}} />
      </div>
      <Note text="thanks for watching" x={150} y={140} size={62} rot={-3} at={a - 2} color="#ffffff" />
      <Note text="next: Good Luck · the Ouija board" x={160} y={790} size={46} rot={-2} at={a + 30} color="#ffffff" />
      <Note text="subscribe" x={1300} y={770} size={66} rot={-3} at={t.at('subscribe') - 2} color={pal.subject} />
      <Arrow x1={1520} y1={800} x2={1560} y2={SUB_SLOT.cy + SUB_SLOT.r + 20} bow={-30} at={t.at('subscribe') + 8} />
      <div style={{position: 'absolute', left: 1500, top: 980, fontFamily: JF.mono, fontSize: 18, letterSpacing: 2, color: 'rgba(237,231,220,0.45)'}}>15 MINUTE HISTORY</div>
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Question t={t} />],
    [at('It got there') - 1, <Beautiful t={t} />],
    [at('It stayed') - 1, <Stayed t={t} />],
    [at('It was up to') - 1, <Burden t={t} />],
    [at('In Britain') - 1, <Shoppers t={t} />],
    [at("Kedzie's book") - 1, <Sealed t={t} />],
    [at('The green never') - 1, <Changed t={t} />],
    [at('William Morris') - 1, <Witch t={t} />],
    [at('Thanks') - 1, <EndScreen t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('beautiful'), at('cheap'), at('Still green'), at('who had to prove'), at('it was safe', 2), at('the witch was real')]}
        ticks={[at('the money') - 1, at('sealed in plastic') + 2]}
        writes={[at("So let's") + 2, at('How did a poison') - 2, at('And why did') - 2, at('to get it off') - 2, at('It got there') - 2, at('It stayed') - 2, at('the proof') - 2,
          at('the money') - 2, at('nobody had to') - 2, at('was big') + 2, at('up to the sick') - 2, at('A family in Limehouse') - 2, at('called it natural') - 2, at('In Britain') + 2,
          at('shoppers') - 2, at('not lawmakers') - 2, at("Kedzie's book") - 2, at('still out there') - 2, at('sealed in plastic') - 2, at('William Morris') - 2, at('witch fever') - 2,
          at('But this time') - 2, at('Thanks') - 2, at('subscribe') - 2]} />
    </>
  );
};

// r_ending (61 s): warm piano for its first ~30 s, then low strings and brass build to ~52 s, a hush at ~53-54 s, and
// the unresolved chord swells at ~55 s. Started 13.1 s in (startFrom 394) so the dark turn arrives under "up to the
// sick to prove it", the hush on "But this time", and the chord on "the witch was real". The cue runs out just after the
// last word, so a second pass of its warm opening carries the end screen.
const ENDING_IN = 394;
export const Ch08: React.FC = () => {
  const t = makeTimeline(N, 30);
  return (
    <ChapterShell n={N} audio="audio/ch08_back_to_the_book.wav" lead={LEAD} extra={END_SCREEN}
      music={[{src: 'music/r_ending.mp3', volume: 0.16, startFrom: ENDING_IN}, {src: 'music/r_ending.mp3', volume: 0.15, from: t.at('next time') + 10}]}>
      <Body />
    </ChapterShell>
  );
};

