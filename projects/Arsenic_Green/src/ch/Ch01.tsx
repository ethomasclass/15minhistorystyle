// Chapter 1 · Dressed in Poison: the cold open (the Arsenic Waltz, Kedzie's book of poison wallpapers, the driving
// question), then the channel intro and the title card. Hook-first: frame 0 is the Waltz, already moving.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Finish, Highlight, INK, JF, Loop, Note, PALETTES, PaletteCtx, Picture, type Place, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {fill, makeTimeline, type Narration, onScreen, Stamp, type TL, useScene} from '../kit/shell';
import {Desk, DropCard} from '../kit/bs';
import {Doc, GREEN, Sil, sizeOf} from '../kit/dk';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
/** Title card length (frames) after the channel intro. */
const TITLE_FRAMES = 150;
/** Narration ends; the channel intro starts 20 frames later. */
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

const WALTZ = 'img/ch03/arsenic_waltz_punch_1862.jpg';
const COVER = 'img/ch01/kedzie_cover_green_label_crop_1874.jpg';
const LETTER = 'img/ch01/kedzie_baker_letter_1874.jpg';
const FIRST = 'img/ch01/kedzie_specimen_n018_first_leaf_spring_port.jpg';
const LEAVES = ['n110', 'n048', 'n126', 'n136'].map((n) => `img/ch01/kedzie_specimen_${n}.jpg`);
const NLM = 'Courtesy of the National Library of Medicine';
/** Real pigment keeps its colour: the Kedzie label and leaves are actual arsenical paper. */
const COLOUR = 'contrast(1.05) saturate(1.02)';

/**
 * The lady's gown in the Arsenic Waltz, in source pixels (hand-traced; the waltz_lady mask only catches the line work,
 * so the gown is filled from this outline). Bodice and skirt, not the skull.
 */
const GOWN: [number, number][] = [[929, 830], [1066, 780], [1230, 800], [1320, 880], [1380, 1010], [1420, 1150], [1546, 1175], [1695, 1219], [1903, 1427], [2082, 1606],
  [2141, 1784], [2090, 1940], [1903, 2030], [1487, 2110], [991, 2130], [595, 2100], [300, 1990], [160, 1800], [110, 1500], [150, 1250], [300, 1130], [560, 1070], [800, 1040], [910, 1000]];

/** The gown turning arsenic green: a colour blend (keeps the engraving's hatching) with a soft edge, stepped on at 12 fps. */
const GownGreen: React.FC<{place: Place; at: number}> = ({place, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 8], [0, 1], clamp);
  const pts = GOWN.map(([x, y]) => `${x},${y}`).join(' ');
  const layer = (blend: React.CSSProperties['mixBlendMode'], o: number, id: string) => (
    <svg key={id} width={1920} height={1080} style={{position: 'absolute', inset: 0, mixBlendMode: blend, opacity: o * k, pointerEvents: 'none'}}>
      <defs><filter id={`gb${id}`} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={14} /></filter></defs>
      <g transform={`translate(${place.left} ${place.top}) scale(${place.scale})`}>
        <polygon points={pts} fill={GREEN} filter={`url(#gb${id})`} />
      </g>
    </svg>
  );
  return <>{layer('color', 1, 'c')}{layer('multiply', 0.35, 'm')}{layer('screen', 0.12, 's')}</>;
};

/**
 * One framing of the Waltz: centred on source (fx, fy), pushing z0 → z1 between a and b, with a faint handheld drift.
 * `green` = the frame the gown turns green (stays green after).
 */
const WaltzShot: React.FC<{fx: number; fy: number; z0: number; z1: number; a: number; b: number; green?: number; shade?: boolean; children?: (p: Place) => React.ReactNode}> = ({
  fx, fy, z0, z1, a, b, green, shade, children,
}) => {
  const f = useCurrentFrame();
  const size = sizeOf(WALTZ);
  const p0 = fill(size, fx, fy, interpolate(f, [a, b], [z0, z1], clamp));
  const place = {left: p0.left + noise2D('wx', f * 0.018, 0) * 3, top: p0.top + noise2D('wy', 0, f * 0.018) * 3, scale: p0.scale};
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src={WALTZ} place={place} size={size} bw="grayscale(1) contrast(1.28) brightness(0.98)" />
      {green !== undefined && <GownGreen place={place} at={green} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.6) 100%)'}} />
      {shade && <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 68%, rgba(0,0,0,0.55) 100%)'}} />}
      {children?.(place)}
      <Tag text="The Arsenic Waltz, Punch, 8 Feb. 1862 · Wellcome Collection" />
    </AbsoluteFill>
  );
};

/** 0 → "Twelve": the Waltz. Wide push, then the Punch header, then a punch-in on the two skulls, then her green dress. */
const Waltz: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const c1 = t.at('In 1862') - 1;
  const c2 = t.at('Now look') - 1;
  const c3 = t.at('The joke') - 1;
  const end = t.at('Twelve') - 1;
  if (f < c1) {
    return (
      <WaltzShot fx={1500} fy={1250} z0={1.1} z1={1.22} a={0} b={c1} shade>
        {() => (
          <>
            <Note text="the most fashionable colour" x={110} y={70} size={50} rot={-3} at={t.at('most fashionable') - 3} color="#ffffff" />
            <Highlight text="OF THE 1860s" x={110} y={180} size={100} at={t.at('1860s')} seed={11} rot={-2} />
            <Note text="...was made with arsenic." x={1080} y={800} size={60} rot={-3} at={t.at('made with') - 3} color={pal.subject} />
            <Note text="and people knew it." x={1180} y={910} size={52} rot={-3} at={t.at('And people') - 3} color="#ffffff" />
          </>
        )}
      </WaltzShot>
    );
  }
  if (f < c2) {
    return (
      <WaltzShot fx={1487} fy={700} z0={1.0} z1={1.06} a={c1} b={c2} shade>
        {(p) => {
          const S = onScreen(p);
          const [dx, dy] = S(2822, 64);
          const [hx, hy] = S(1493, 62);
          return (
            <>
              <Loop cx={dx} cy={dy} rx={128 * p.scale + 16} ry={40} at={t.at('1862')} seed={13} tilt={-3} />
              <Loop cx={hx} cy={hy} rx={720 * p.scale + 20} ry={44} at={t.at('London magazine') + 2} seed={14} tilt={-1} />
              <Note text="Punch, a London humour magazine" x={110} y={880} size={48} rot={-3} at={t.at('London magazine') - 2} color="#ffffff" />
              <Note text={'"may I have this dance?"'} x={1100} y={600} size={50} rot={-4} at={t.at('asks') - 3} />
            </>
          );
        }}
      </WaltzShot>
    );
  }
  if (f < c3) {
    return (
      <WaltzShot fx={1640} fy={520} z0={2.0} z1={2.12} a={c2} b={c3}>
        {(p) => {
          const S = onScreen(p);
          const [mx, my] = S(1850, 330);
          const [lx, ly] = S(1300, 610);
          return (
            <>
              <Loop cx={mx} cy={my} rx={170} ry={190} at={t.at('closer') + 1} seed={15} tilt={-8} width={6} />
              <Loop cx={lx} cy={ly} rx={130} ry={160} at={t.at('both') + 1} seed={16} tilt={4} width={6} />
              <Stamp text="SKELETONS." x={110} y={880} at={t.at('skeletons')} size={130} color={pal.subject} rot={-2} />
            </>
          );
        }}
      </WaltzShot>
    );
  }
  return (
    <WaltzShot fx={1150} fy={1400} z0={1.2} z1={1.27} a={c3} b={end} green={t.at('green') + 1}>
      {(p) => {
        const [gx, gy] = onScreen(p)(1500, 1500);
        return (
          <>
            <Note text="the joke:" x={1420} y={120} size={64} rot={-4} at={t.at('The joke') - 1} color="#ffffff" />
            <Note text="her dress" x={1480} y={230} size={64} rot={-4} at={t.at('her green') - 3} />
            <Arrow x1={1560} y1={340} x2={gx + 40} y2={gy - 60} bow={-40} at={t.at('green') + 2} />
          </>
        );
      }}
    </WaltzShot>
  );
};

/** "Twelve years later": Kedzie's book on the desk, its cover label itself a poison paper; the leaves fan out. */
const Book: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Every page');
  return (
    <Desk a={t.at('Twelve')}>
      <DropCard src={COVER} x={150} y={110} w={600} rot={-3} at={t.at('Twelve') - 1} filter={COLOUR} />
      <Highlight text="MICHIGAN, 1874" x={830} y={110} size={84} at={t.at('Michigan')} seed={21} rot={-2} />
      <Stamp text="100" x={840} y={250} at={t.at('100')} size={190} />
      <Note text="public libraries" x={1270} y={320} size={60} rot={-3} at={t.at('public libraries') - 3} color="#ffffff" />
      {LEAVES.map((src, i) => (
        <DropCard key={src} src={src} x={820 + i * 245} y={560 + (i % 2) * 18} w={230} rot={[-6, -2, 3, 7][i]} at={a - 1 + i * 4} filter={COLOUR} pad={7} />
      ))}
      <Note text="real wallpaper" x={860} y={930} size={48} rot={-2} at={t.at('real wallpaper') - 3} />
      <Note text="every page: arsenic." x={160} y={830} size={58} rot={-3} at={t.at('has arsenic') - 3} color={pal.subject} />
      <Tag text={`R. C. Kedzie, Shadows from the Walls of Death, Michigan State Board of Health, 1874 · ${NLM}`} />
    </Desk>
  );
};

/** The cover letter: the highlighter runs along "not allowing it to be handled by children"; then page one. */
const Letter: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('The letter');
  const first = t.at('very first') - 1;
  return (
    <Desk a={a}>
      <Doc src={LETTER} x={60} y={-840} w={1100} at={a - 1} push={[a, t.at('So heres')]} fx={1040} fy={2500} zoom={1.1}
        marks={[{at: t.at('asks', 2) - 2, to: t.end('handle it'), swipe: [[325, 2385, 1845, 2450], [240, 2480, 1845, 2545], [240, 2570, 445, 2620]]}]} />
      <Note text="the cover letter, 1874" x={1290} y={150} size={44} rot={-3} at={t.at('letter') - 3} out={first} color="#ffffff" />
      <Note text="not for children." x={1300} y={560} size={52} rot={-4} at={t.at('children') - 3} out={first} color={pal.subject} />
      {g >= first && <AbsoluteFill style={{background: 'rgba(13,12,9,0.62)'}} />}
      <DropCard src={FIRST} x={1250} y={60} w={540} rot={3} at={first} filter={COLOUR} />
      <Note text="page one" x={1360} y={850} size={60} rot={-3} at={t.at('first sample') - 3} color="#ffffff" />
      <Note text="from a house where a girl, about ten," x={100} y={760} size={48} rot={-3} at={t.at('a girl') - 3} color={pal.subject} />
      <Note text="had died that year." x={140} y={860} size={48} rot={-3} at={t.at('had died') - 3} color={pal.subject} />
      <Tag text={g >= first ? `Kedzie, Shadows from the Walls of Death, 1874, first specimen · ${NLM}` : `Henry B. Baker, Michigan State Board of Health, 1874 · ${NLM}`} />
    </Desk>
  );
};

/** The driving question, written on the desk. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('So heres')}>
      <Note text="the question:" x={180} y={110} size={56} rot={-3} at={t.at('question') - 3} color="#ffffff" />
      <Note text="if everybody knew arsenic was poison," x={220} y={220} size={64} rot={-3} at={t.at('If everybody') - 3} />
      <Note text="how did it end up on the..." x={240} y={345} size={64} rot={-3} at={t.at('how did') - 3} />
      <Highlight text="WALLS," x={260} y={480} size={84} at={t.at('walls')} seed={31} rot={-2} />
      <Highlight text="DRESSES," x={720} y={490} size={84} at={t.at('dresses')} seed={32} rot={2} />
      <Highlight text="CANDY?" x={1320} y={475} size={84} at={t.at('candy')} seed={33} rot={-3} />
      <Note text="and why did it take" x={220} y={680} size={64} rot={-3} at={t.at('And why') - 3} />
      <Note text="so long to get it off?" x={330} y={800} size={72} rot={-3} at={t.at('so long') - 6} color={pal.subject} />
    </Desk>
  );
};

/** "We'll come back to that girl": a librarian opens the book; the designer who called it witch fever. */
const Library: React.FC<{t: TL}> = ({t}) => (
  <Sil name="g_library" file="ch01_library_1874.jpg" label="a librarian opens the book, 1874" a={t.at("We'll")} b={END} z={[1.04, 1.12]} fx={0.45}>
    {() => (
      <>
        <Note text="the most famous designer of his day..." x={880} y={830} size={40} rot={-3} at={t.at('most famous') - 3} color="#ffffff" />
        <Note text="witch fever?" x={1250} y={150} size={72} rot={-5} at={t.at('witch fever') - 3} color="#FF9F1C" />
      </>
    )}
  </Sil>
);

/** Title card after the channel intro: a green Kedzie leaf (real arsenical paper, dimmed), the title on orange tape. */
const Title: React.FC = () => {
  const g = useGFrame();
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <Img src={staticFile(LEAVES[0])} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 40%',
        filter: 'contrast(1.05) brightness(0.42) saturate(0.95)', transform: `scale(${1.04 + g * 0.0004})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.35) 25%, rgba(8,6,4,0.9) 100%)'}} />
      <Highlight text={TITLE} x={230} y={340} size={160} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 270, top: 610, fontFamily: JF.display, fontSize: 58, color: '#f4efe6', whiteSpace: 'nowrap', textShadow: '0 3px 16px rgba(0,0,0,0.9)',
        opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1320} y={740} size={56} rot={-5} at={24} color="#ffffff" />
      <Tag text={`Kedzie, Shadows from the Walls of Death, 1874, an arsenical wallpaper sample · ${NLM}`} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  // [cut frame, scene]: cut 1 frame before the word that starts the new idea
  const cuts: [number, React.ReactNode][] = [
    [0, <Waltz t={t} />],
    [at('Twelve') - 1, <Book t={t} />],
    [at('The letter') - 1, <Letter t={t} />],
    [at("So here's") - 1, <Question t={t} />],
    [at("We'll") - 1, <Library t={t} />],
  ];
  // hard punch-ins inside the Waltz get a whoosh too
  const punches = [at('In 1862') - 1, at('Now look') - 1, at('The joke') - 1];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/r_spirits_dark.mp3')} volume={(f) => interpolate(f, [0, 3, END - 50, END], [0, 0.14, 0.14, 0], clamp)} />
      {[...cuts.slice(1).map(([f]) => f), ...punches].map((f, i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.32} />)}
      {['1860s', 'Michigan', 'walls', 'dresses', 'candy'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['skeletons', '100'].map((c) => <Sfx key={c} at={at(c)} src="sfx/boom.wav" volume={0.3} />)}
      {['most fashionable', 'made with', 'And people', 'London magazine', 'asks', 'closer', 'both', 'The joke', 'her green', 'public libraries', 'real wallpaper', 'has arsenic',
        'letter', 'children', 'first sample', 'a girl', 'had died', 'question', 'If everybody', 'how did', 'And why', 'so long', 'most famous', 'witch fever'].map((c) => (
        <Sfx key={c} at={at(c) - 3} src={WRITE.src} volume={WRITE.volume} />
      ))}
      {[0, 1, 2, 3].map((i) => <Sfx key={`l${i}`} at={at('Every page') - 1 + i * 4} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('Twelve') - 1} src="sfx/tick.wav" volume={0.45} />
      <Sfx at={at('The letter') - 1} src="sfx/page_turn.wav" volume={0.4} />
      <Sfx at={at('very first') - 1} src="sfx/tick.wav" volume={0.45} />
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Ch01: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
