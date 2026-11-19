// Chapter 8 · The turkey, and the ending. The Broad-Breasted White (the USDA ARS photo), "not a GMO", the old-fashioned way as a
// drawn loop, then the inflating turkey on its scale (IMAGE_PRESENTATION.md: chest swell, feather swap, the counter 13 -> 30+ with the
// legs unchanged, the tip forward, the hold on "Happy Thanksgiving."), the heritage bird beside it, the turkey landing on the board,
// the subscribe note, the question again, the recap stack, the pull-back to the whole board, the eel and the can side by side for
// the last lines, and the end screen (20 s from "Thanks for watching"). Placeholders are listed in PLACEHOLDERS.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch08_turkey.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {bed} from '../kit/levels';
import {ChapterShell, chapterFrames, FADE, LEAD, makeTimeline, type Narration, Stamp, TAIL, type TL, useScene} from '../kit/shell';
import {Slip} from '../kit/vox';
import {Print} from '../kit/print';
import {TgBoard} from '../kit/tg_board';
import {chestAt, SET, TURKEY, type TurkeyBeats, TurkeyRig, TurkeySet} from '../kit/tg_turkey';
import {CORAL, Cran, cranMap, type Deal, EelLoop, HandDeal, Loupe, MockTape, ORANGE, PH, type Placeholder, RecipeCard, TEAL } from '../kit/tg_late';

const N = words as Narration;
const T0 = makeTimeline(N, 30);
/** The end screen runs 20 s from "Thanks for watching": music-only frames after the narration make up the rest. */
const END_LEN = 20 * 30;
const EXTRA = Math.max(0, T0.at('Thanks for watching.') + END_LEN - (T0.frames + TAIL + FADE));
export const CH08_FRAMES = chapterFrames(N, LEAD) + EXTRA;

// ------------------------------------------------------------------ assets still to come
const P = {
  bronze: {file: TURKEY.bronze, what: 'Flow: a heritage-type bronze turkey, live, side view facing left, feet at the bottom centre (RGBA)'},
  white: {file: TURKEY.white, what: 'Flow: the same bird and pose with white feathers (RGBA)'},
  scale: {file: TURKEY.scale, what: 'Flow or archival: a period platform scale, its deck at the top'},
  hale: {file: 'img/arch/hale_portrait.jpg', what: 'Sarah Josepha Hale, portrait (ch5)'},
  booklet: {file: 'img/arch/angelus_1917_booklet.jpg', what: 'Angelus marshmallow recipe booklet, 1917 (ch7)'},
} satisfies Record<string, Placeholder>;
/** Every placeholder in this chapter, for the asset swap. */
export const PLACEHOLDERS: Placeholder[] = Object.values(P);

const USDA = 'img/arch/large-white-turkey-female-usda-ars.jpg';
const USDA_TAG = 'Large White turkey hen · USDA Agricultural Research Service';

/** The inflating turkey's beats, from the words (one set, cut between framings; see kit/tg_turkey.tsx). */
const beatsOf = (t: TL): TurkeyBeats => ({
  swellAt: t.at('broader chest.'),
  swapAt: t.at('white ones.'),
  w13At: t.at('thirteen pounds,'),
  grow: [t.at('Today,'), t.at('over thirty.') + 10],
  tipAt: t.at('top-heavy'),
});

// ------------------------------------------------------------------ the breed
const Breed: React.FC<{t: TL; a: number}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src={USDA} x={1150} y={110} w={560} h={842} at={2} rot={2} pos="50% 50%" />
    <Highlight text="BROAD-BREASTED" x={120} y={330} size={104} at={t.at('Broad-Breasted White.')} seed={81} rot={-2} />
    <Highlight text="WHITE" x={150} y={480} size={104} at={t.at('Broad-Breasted White.') + 4} seed={82} rot={-3} />
    <Note text="on most American tables" x={140} y={180} size={50} rot={-3} at={t.at('most American') - 2} color="#ffffff" />
    <Tag text={USDA_TAG} />
  </AbsoluteFill>
);

/** An orange strike-through across a disputed note, drawn over 5 frames. */
const Strike: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number}> = ({x1, y1, x2, y2, at}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 - 18} ${x2},${y2}`} fill="none" stroke={ORANGE} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Gmo: React.FC<{t: TL; a: number}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src={USDA} x={1280} y={180} w={440} h={662} at={-999} rot={2} pos="50% 50%" />
    <Note text="a GMO turkey?" x={150} y={190} size={80} rot={-3} at={t.at('GMO turkey.') - 2} color={ORANGE} />
    <Strike x1={140} y1={265} x2={690} y2={215} at={t.at("isn't.")} />
    <Note text="nobody edited its genes" x={160} y={420} size={60} rot={-3} at={t.at('Nobody edited') - 2} color="#ffffff" />
    <Note text="no lab." x={200} y={560} size={70} rot={-3} at={t.at('in a lab.') - 2} />
    <Tag text={USDA_TAG} />
  </AbsoluteFill>
);

/** A hand-jittered diagram box (teal, drawn on over 8 frames) with an Abril label and a mono line under it. */
const DBox: React.FC<{x: number; y: number; w: number; h: number; label: string; sub: string; at: number; seed: string}> = ({x, y, w, h, label, sub, at, seed}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  const j = (k: string) => (random(`${seed}${k}`) - 0.5) * 10;
  const d = `M${x + j('a')},${y + j('b')} L${x + w + j('c')},${y + j('d')} L${x + w + j('e')},${y + h + j('f')} L${x + j('g')},${y + h + j('h')} Z`;
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={d} fill="rgba(0,0,0,0.25)" stroke={TEAL} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
      <div style={{position: 'absolute', left: x, top: y + h * 0.18, width: w, textAlign: 'center', fontFamily: JF.display, fontSize: 64, color: '#fff', opacity: p}}>{label}</div>
      <div style={{position: 'absolute', left: x - 40, top: y + h + 22, width: w + 80, textAlign: 'center', fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, color: 'rgba(244,239,230,0.75)', opacity: p}}>{sub}</div>
    </>
  );
};

/** The old-fashioned way, as a drawn loop: pick -> breed -> repeat, and a generation count ticking. */
const OldWay: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const genAt = t.at('Generation after generation,');
  const gen = g >= genAt ? 2 + Math.floor((g - genAt) / 5) : 1;
  const y = 400, w = 360, h = 150;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="THE OLD-FASHIONED WAY" x={120} y={110} size={84} at={t.at('old-fashioned')} seed={83} rot={-2} />
      <DBox x={190} y={y} w={w} h={h} label="PICK" sub="THE BIGGEST BIRDS" at={t.at('pick the biggest') - 1} seed="p" />
      <Arrow x1={570} y1={y + 75} x2={760} y2={y + 75} bow={-24} at={t.at('breed them,') - 6} />
      <DBox x={780} y={y} w={w} h={h} label="BREED" sub="THEM WITH EACH OTHER" at={t.at('breed them,') - 1} seed="b" />
      <Arrow x1={1160} y1={y + 75} x2={1350} y2={y + 75} bow={-24} at={t.at('and repeat.') - 6} />
      <DBox x={1370} y={y} w={w} h={h} label="REPEAT" sub="EVERY GENERATION" at={t.at('and repeat.') - 1} seed="r" />
      <Arrow x1={1550} y1={y + h + 70} x2={400} y2={y + h + 70} bow={-90} at={t.at('and repeat.') + 6} dur={12} />
      {g >= genAt && (
        <div style={{position: 'absolute', left: 190, top: 800, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: 'rgba(244,239,230,0.85)'}}>
          GENERATION <span style={{fontFamily: JF.display, fontSize: 64, letterSpacing: 0, color: CORAL}}>{gen}</span>
        </div>
      )}
      <Note text="since the 1920s and '30s" x={900} y={800} size={60} rot={-3} at={t.at('1920s') - 2} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the inflating turkey (one set, cut between framings)

/** Wide: the bronze bird on the scale; more breast meat. */
const BirdWide: React.FC<{t: TL; a: number}> = ({t}) => (
  <TurkeySet b={beatsOf(t)} cam={{x: 760, y: 540, z: 1}} dial={false}>
    <Highlight text="MORE BREAST MEAT" x={110} y={120} size={80} at={t.at('more breast meat,')} seed={84} rot={-2} />
    <Note text="what farmers wanted" x={130} y={250} size={46} rot={-3} at={t.at('farmers wanted') - 2} color="#ffffff" />
  </TurkeySet>
);

/** Cut-in on the chest (a slow push): it swells on "broader chest". */
const BirdChest: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const [cx, cy] = chestAt();
  const z = interpolate(f, [a, t.at('Then in the 1950s,')], [1.6, 1.75], clamp);
  return (
    <TurkeySet b={beatsOf(t)} cam={{x: cx + 120, y: cy - 40, z}} dial={false} labels={false}>
      <Note text="a broader chest" x={130} y={130} size={70} rot={-3} at={t.at('broader chest.') - 2} />
    </TurkeySet>
  );
};

/** Wide again: dark feathers wiped to white. */
const BirdWhite: React.FC<{t: TL; a: number}> = ({t}) => (
  <TurkeySet b={beatsOf(t)} cam={{x: 960, y: 540, z: 1}} dial={false}>
    <Highlight text="1950s" x={1250} y={130} size={110} at={t.at('1950s,')} seed={85} rot={-2} />
    <Note text="dark feathers..." x={1260} y={330} size={58} rot={-3} at={t.at('dark feathers') - 2} color="#ffffff" />
    <Note text="...for white ones" x={1220} y={450} size={64} rot={-3} at={t.at('white ones.') - 2} />
  </TurkeySet>
);

/** Why white: a loupe on the plucked chest; the pin feathers don't show. */
const BirdLoupe: React.FC<{t: TL; a: number}> = ({t}) => {
  const b = beatsOf(t);
  const [cx, cy] = chestAt();
  const layer = <TurkeyRig x={SET.feet[0]} y={SET.feet[1]} size={SET.size} b={b} label={false} />;
  return (
    <TurkeySet b={b} cam={{x: 960, y: 540, z: 1}} dial={false}>
      <Loupe layer={layer} cx={cx} cy={cy} r={180} zoom={3} to={[1480, 340]} at={t.at('pluck a white bird,') + 2} bow={-40} />
      <Note text="leftover pin feathers" x={1180} y={590} size={50} rot={-3} at={t.at('pin feathers') - 2} color="#ffffff" />
      <Note text="don't show on white" x={1190} y={690} size={56} rot={-3} at={t.at("don't show.") - 2} />
      <Note text="cleaner in the store" x={1180} y={810} size={56} rot={-3} at={t.at('looks cleaner') - 2} color={CORAL} />
    </TurkeySet>
  );
};

/** The weights: the dial and the counter read 13 for the 1930s, then tick to 30+ while the body inflates over the same thin legs. */
const BirdWeight: React.FC<{t: TL; a: number}> = ({t}) => (
  <TurkeySet b={beatsOf(t)} cam={{x: 1060, y: 540, z: 0.92}}>
    <Highlight text="1930s" x={110} y={100} size={110} at={t.at('1930s,')} seed={86} rot={-2} />
    <Note text="average, live" x={130} y={270} size={46} rot={-3} at={t.at('average turkey') - 2} color="#ffffff" />
    <Highlight text="TODAY" x={1180} y={830} size={90} at={t.at('Today,')} seed={87} rot={-2} />
    <Note text="(same legs)" x={150} y={840} size={54} rot={-3} at={t.at('over thirty.') + 16} color="#ffffff" />
    <Arrow x1={440} y1={870} x2={690} y2={760} bow={-30} at={t.at('over thirty.') + 20} />
  </TurkeySet>
);

/** Too top-heavy: the bird tips forward about its feet and holds. Clinical notes, no joke on the picture. */
const BirdTip: React.FC<{t: TL; a: number}> = ({t}) => (
  <TurkeySet b={beatsOf(t)} cam={{x: 1100, y: 500, z: 1}} dial={false}>
    <Highlight text="TOO TOP-HEAVY" x={1190} y={130} size={70} at={t.at('top-heavy')} seed={88} rot={-2} />
    <Note text="to mate on their own" x={1220} y={300} size={44} rot={-3} at={t.at('to mate') - 2} color="#ffffff" />
    <Note text="males: too heavy" x={1220} y={410} size={44} rot={-3} at={t.at('males are') - 2} />
    <Note text="the shape is wrong" x={1240} y={510} size={44} rot={-3} at={t.at('shape is wrong.') - 2} />
    <Slip text="artificial insemination" x={1220} y={670} at={t.at('artificial insemination.') - 2} size={50} rot={-2} />
  </TurkeySet>
);

/** 194 million, almost all this one breed. Then "Happy Thanksgiving." over the held frame: nothing new, then the cut. */
const BirdCount: React.FC<{t: TL; a: number}> = ({t}) => (
  <TurkeySet b={beatsOf(t)} cam={{x: 960, y: 480, z: 0.8}} dial={false}>
    <Stamp text="194 MILLION" x={130} y={175} size={120} at={t.at('194 million')} rot={-3} />
    <Note text="raised last year" x={1260} y={420} size={46} rot={-3} at={t.at('turkeys raised') - 2} color="#ffffff" />
    <Note text="almost all: this breed" x={1240} y={530} size={46} rot={-3} at={t.at('this one breed.') - 2} />
  </TurkeySet>
);

// ------------------------------------------------------------------ heritage, the board
const Heritage: React.FC<{t: TL; a: number}> = ({t}) => {
  const pal = usePal();
  const done: TurkeyBeats = {swellAt: -100, tipAt: -100};
  const label = (x: number, text: string) => (
    <div style={{position: 'absolute', left: x, top: 960, transform: 'translateX(-50%)', fontFamily: JF.mono, fontSize: 22, letterSpacing: 3, color: 'rgba(244,239,230,0.8)', whiteSpace: 'nowrap'}}>{text}</div>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <TurkeyRig x={520} y={930} size={400} b={{}} />
      <TurkeyRig x={1360} y={930} size={400} b={done} white grow={1} />
      {label(520, 'HERITAGE')}
      {label(1360, 'BROAD-BREASTED WHITE')}
      <Highlight text="HERITAGE TURKEYS" x={120} y={115} size={90} at={t.at('heritage turkeys,')} seed={89} rot={-2} />
      <Note text="can still do it themselves" x={130} y={250} size={46} rot={-3} at={t.at('do it themselves.') - 2} color="#ffffff" />
      <Note text="smaller," x={130} y={350} size={46} rot={-3} at={t.at('smaller,') - 2} />
      <Note text="slower-growing," x={390} y={350} size={46} rot={-3} at={t.at('slower-growing,') - 2} />
      <Note text="pricier" x={830} y={350} size={46} rot={-3} at={t.at('more expensive.') - 2} />
      <Note text="what a turkey used to be" x={1060} y={240} size={54} rot={-3} at={t.at('what a turkey') - 2} color={pal.subject} />
      <Arrow x1={1060} y1={300} x2={640} y2={560} bow={-50} at={t.at('what a turkey') + 6} />
    </AbsoluteFill>
  );
};

/** The turkey lands on the board, the yarn from the can says "therefore", and it is stamped REDESIGNED on "invention". */
const tkey = (): [number, number] => [1500, 450];
const CLOSE: ('hale' | 'jello' | 'can' | 'turkey')[] = ['hale', 'jello', 'can', 'turkey'];
const Invention: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const [x, y] = tkey();
  return (
    <TgBoard subject="turkey" only={CLOSE} cam={[[a, x, y, 1.3], [a + 1, x, y, 1.3]]} land={{turkey: a + 6}} threads={{turkey: a + 20}}
      stamps={[{text: 'REDESIGNED', x: 1590, y: 476, at: t.at('an invention.'), rot: -8}]} />
  );
};

// ------------------------------------------------------------------ subscribe, the question, the recap
const Subscribe: React.FC<{t: TL; a: number}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="quick favor:" x={200} y={240} size={56} rot={-3} at={t.at('Quick favor:') - 2} color="#ffffff" />
    <Note text="hit subscribe" x={240} y={360} size={96} rot={-3} at={t.at('hit subscribe.') - 2} />
    <Note text="it's free." x={290} y={540} size={60} rot={-3} at={t.at("It's free.") - 2} color="#ffffff" />
    <Slap at={t.at('marshmallow people,')} x={1240} y={190} rot={4}><PH {...P.booklet} w={460} h={650} filter="saturate(0.8)" /></Slap>
    <Note text="(not selling anything)" x={300} y={700} size={50} rot={-3} at={t.at('not selling') - 2} />
  </AbsoluteFill>
);

/** A piece slapped onto the desk with a little overshoot (for placeholders, which Print can't take). */
const Slap: React.FC<{at: number; x: number; y: number; rot?: number; children: React.ReactNode}> = ({at, x, y, rot = 0, children}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  return <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%'}}>{children}</div>;
};

const Question: React.FC<{t: TL; a: number}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="back to the question:" x={200} y={230} size={56} rot={-3} at={t.at('the question.') - 2} color="#ffffff" />
      <Note text="how did we get from eels..." x={240} y={380} size={88} rot={-3} at={t.at('How did we') - 2} />
      <Note text="...to this?" x={420} y={560} size={100} rot={-3} at={t.at('to this?') - 2} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Step by step: one print per step lands on the stack, each with its numbered tape. */
const Recap: React.FC<{t: TL; a: number}> = ({t}) => {
  const pal = usePal();
  const s1 = t.at('show off:'), s2 = t.at('faked it.'), s3 = t.at('Sarah Hale'), s4 = t.at('companies sold');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Print src="img/arch/simmons-1796-to-dress-a-turtle-p1.jpg" x={1010} y={120} w={460} h={640} at={s1 - 1} rot={-4} pos="50% 20%" />
      <Print src="img/arch/mock-turtle-soup-boston-cook-book-1884.jpg" x={1090} y={160} w={440} h={640} at={s2 - 1} rot={3} pos="50% 30%" />
      <MockTape x={1200} y={520} at={s2 + 4} size={80} />
      <Slap at={s3 - 1} x={1170} y={190} rot={-2}><PH {...P.hale} w={440} h={620} /></Slap>
      <Print src="img/arch/jello-girl-gives-a-party-1920-cover.jpg" x={1250} y={230} w={450} h={620} at={s4 - 1} rot={4} pos="50% 30%" />
      <Note text="step by step:" x={130} y={40 + 100} size={50} rot={-3} at={t.at('Step by step.') - 2} out={s1} color="#ffffff" />
      <Highlight text="1 · SHOW OFF" x={110} y={130} size={66} at={s1} seed={90} rot={-2} />
      <Note text="turtles, oysters, meat in the pie" x={140} y={240} size={40} rot={-2} at={t.at('turtles,') - 2} color="#ffffff" />
      <Highlight text="2 · FAKE IT" x={110} y={350} size={66} at={s2} seed={91} rot={-2} />
      <Highlight text="3 · WRITE IT DOWN" x={110} y={530} size={66} at={s3} seed={92} rot={-2} />
      <Note text="a homemade menu, made national" x={140} y={640} size={40} rot={-2} at={t.at('homemade menu') - 2} color="#ffffff" />
      <Highlight text="4 · SELL THE SHORTCUT" x={110} y={750} size={66} at={s4} seed={93} rot={-2} />
      <Note text="dressed up as homemade" x={140} y={860} size={50} rot={-2} at={t.at('dressed it up') - 2} color={pal.subject} />
      <Tag text="Simmons, American Cookery, 1796 · Boston Cook Book, 1884 · Jell-O, 1920 · Library of Congress / Internet Archive" />
    </AbsoluteFill>
  );
};

/** The pull-back: from the turkey out to the whole board; whose idea each dish was, written under it. */
const PullBack: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  const f = useCurrentFrame();
  const [x, y] = tkey();
  return (
    <AbsoluteFill>
      <TgBoard subject="turkey" only={f < a + 8 ? CLOSE : undefined} cam={[[a, x, y, 1.3], [a + 8, x, y, 1.3], [a + 62, 960, 500, 0.86]]} stamps={[{text: 'REDESIGNED', x: 1590, y: 476, at: -999, rot: -8}]} />
      <Note text="a novelist's." x={150} y={870} size={44} rot={-3} at={t.at("A novelist's.") - 2} color="#ffffff" />
      <Note text="a magazine's." x={620} y={870} size={44} rot={-3} at={t.at("A magazine's.") - 2} color="#ffffff" />
      <Note text="a marshmallow company's." x={1090} y={870} size={44} rot={-3} at={t.at("marshmallow company's.") - 2} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the last lines
/** The eel and the can, side by side; the hand deals one last recipe card between them. Then hold. */
const EelCan: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  const can = {cx: 1560, by: 860, pw: 560};
  const cm = cranMap(6, can.cx, can.by, can.pw);
  const [lx, ly] = [690, 757]; // the "1 can" line on the card (screen px), for the loop
  const deals: Deal[] = [{at: t.at('recipe card') + 2, x: 690, y: 640, rot: -3, card: (
    <RecipeCard kicker="FROM THE KITCHEN OF GRANDMA" title="Cranberry sauce" lines={['1 can, jellied', 'open both ends', 'slide onto a plate']} />
  )}];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <EelLoop x={20} y={170} w={900} at={a} />
      <Cran n={6} {...can} />
      <div style={{position: 'absolute', left: 150, top: 110, fontFamily: JF.mono, fontSize: 24, letterSpacing: 4, color: 'rgba(244,239,230,0.75)'}}>1621</div>
      <div style={{position: 'absolute', left: cm.at(370, 0)[0] - 260, top: 110, fontFamily: JF.mono, fontSize: 24, letterSpacing: 4, color: 'rgba(244,239,230,0.75)'}}>NOW</div>
      <Note text="what they could catch" x={140} y={580} size={50} rot={-3} at={t.at('could catch.') - 2} color="#ffffff" />
      <Note text="what somebody wrote down," x={1060} y={170} size={44} rot={-3} at={t.at('somebody wrote down,') - 2} color="#ffffff" />
      <Note text="...and sold back to us" x={1100} y={270} size={50} rot={-3} at={t.at('sold back') - 2} color={pal.subject} />
      <HandDeal deals={deals} />
      <Loop cx={lx + 150} cy={ly} rx={170} ry={36} at={t.at('an ad.') + 2} seed={21} tilt={-3} color={CORAL} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the end screen
/** YouTube end-screen element slots (1080p px): two 16:9 videos and the subscribe circle. Place the elements over these in Studio. */
export const SLOTS = {videoA: {x: 1120, y: 175, w: 604, h: 340}, videoB: {x: 1120, y: 610, w: 604, h: 340}, subscribe: {cx: 380, cy: 760, r: 150}};

const Slot: React.FC<{x: number; y: number; w: number; h: number; at: number; label: string}> = ({x, y, w, h, at, label}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 12], [0, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: 'rgba(8,8,6,0.55)', borderRadius: 6, opacity: p}} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={8} fill="none" stroke={TEAL} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
          strokeLinecap="round" transform={`rotate(-0.6 ${x + w / 2} ${y + h / 2})`} />
      </svg>
      <Note text={label} x={x + 10} y={y - 70} size={46} rot={-2} at={at + 4} color="#ffffff" />
    </>
  );
};

/** Thanks, the logo, a drawn subscribe circle, two watch-next slots and the eel still wriggling on the desk. Music only after the voice. */
const EndScreen: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const sub = t.at('subscribe, and');
  const more = t.at('more stories');
  const {cx, cy, r} = SLOTS.subscribe;
  const ring = interpolate(g, [sub, sub + 12], [0, 1], clamp);
  const logoIn = interpolate(f, [a + 6, a + 16], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <DarkPaper />
      <div style={{position: 'absolute', left: 130, top: 104, opacity: logoIn}}>
        <Img src={staticFile('img/brand/chunk-history-horizontal.svg')} style={{height: 72}} />
      </div>
      <Highlight text="THANKS FOR WATCHING" x={120} y={240} size={70} at={a + 2} seed={94} rot={-2} />
      <Note text="more stories, right here" x={140} y={390} size={50} rot={-3} at={more - 2} color="#ffffff" />
      <Arrow x1={800} y1={410} x2={1085} y2={345} bow={-20} at={more + 8} />
      <Arrow x1={800} y1={450} x2={1085} y2={760} bow={30} at={more + 14} />
      {g >= sub && (
        <>
          <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', background: '#15130f', opacity: ring,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Img src={staticFile('img/brand/chunk-history-mark.svg')} style={{width: r * 1.1, height: r * 1.1, opacity: 0.9}} />
          </div>
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke={CORAL} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring}
              transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="round" />
          </svg>
          <Note text="subscribe" x={cx + r + 40} y={cy - 40} size={60} rot={-4} at={sub} />
        </>
      )}
      <EelLoop x={560} y={760} w={420} at={a} />
      <Slot {...SLOTS.videoA} at={a + 10} label="watch next" />
      <Slot {...SLOTS.videoB} at={a + 18} label="more history" />
      <Tag text="Image credits in the description" x={110} y={1010} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the chapter
const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  // cut 1 frame before the word that starts the new idea (beatscope reads this object)
  const c = {
    breed: 0,
    gmo: at('You may have') - 1,
    oldway: at('They did it') - 1,
    wide: at('First, farmers') - 1,
    chest: at('so they bred') - 1,
    white: at('Then in the 1950s,') - 1,
    loupe: at('Why? Because') - 1,
    weight: at('And the birds kept') - 1,
    tip: at('It worked so well') - 1,
    count: at('Out of the roughly') - 1,
    heritage: at('The older breeds,') - 1,
    invention: at('So even the bird') - 1,
    subscribe: at('Quick favor:') - 1,
    question: at("So let's go back") - 1,
    recap: at('Step by step.') - 1,
    pull: at('That means almost') - 1,
    eelcan: at('The people of 1621') - 1,
    end: at('Thanks for watching.') - 1,
  };
  const scene = useScene([
    [c.breed, <Breed t={t} a={c.breed} />],
    [c.gmo, <Gmo t={t} a={c.gmo} />],
    [c.oldway, <OldWay t={t} a={c.oldway} />],
    [c.wide, <BirdWide t={t} a={c.wide} />],
    [c.chest, <BirdChest t={t} a={c.chest} />],
    [c.white, <BirdWhite t={t} a={c.white} />],
    [c.loupe, <BirdLoupe t={t} a={c.loupe} />],
    [c.weight, <BirdWeight t={t} a={c.weight} />],
    [c.tip, <BirdTip t={t} a={c.tip} />],
    [c.count, <BirdCount t={t} a={c.count} />],
    [c.heritage, <Heritage t={t} a={c.heritage} />],
    [c.invention, <Invention t={t} a={c.invention} />],
    [c.subscribe, <Subscribe t={t} a={c.subscribe} />],
    [c.question, <Question t={t} a={c.question} />],
    [c.recap, <Recap t={t} a={c.recap} />],
    [c.pull, <PullBack t={t} a={c.pull} />],
    [c.eelcan, <EelCan t={t} a={c.eelcan} />],
    [c.end, <EndScreen t={t} a={c.end} />],
  ]);
  // sound lists, kept next to the scenes: silent cuts; a stamp per title, stamp and tape; the near-silent marker per note; ticks on
  // the counter's landings, the dealt card and the loupes
  const stamps = ['Broad-Breasted White.', 'old-fashioned', 'more breast meat,', '1950s,', '1930s,', 'Today,', 'top-heavy', '194 million', 'heritage turkeys,', 'an invention.',
    'show off:', 'faked it.', 'Sarah Hale', 'companies sold'];
  const notes = ['Step by step.', 'most American', 'GMO turkey.', 'Nobody edited', 'in a lab.', '1920s', 'farmers wanted', 'broader chest.', 'dark feathers', 'white ones.', 'pin feathers',
    "don't show.", 'looks cleaner', 'average turkey', 'to mate', 'males are', 'shape is wrong.', 'turkeys raised', 'this one breed.', 'do it themselves.', 'smaller,',
    'slower-growing,', 'more expensive.', 'what a turkey', 'Quick favor:', 'hit subscribe.', "It's free.", 'not selling', 'the question.', 'How did we', 'to this?', 'turtles,',
    'homemade menu', 'dressed it up', "A novelist's.", "A magazine's.", "marshmallow company's.", 'could catch.', 'somebody wrote down,', 'sold back', 'more stories'];
  const ticks = [at('thirteen pounds,'), at('over thirty.') + 10, at('pluck a white bird,') + 10, at('pick the biggest') - 1, at('breed them,') - 1, at('and repeat.') - 1,
    at('recipe card') + 2, at('marshmallow people,'), at('subscribe, and')];
  return (
    <>
      {scene}
      {stamps.map((s) => <Sfx key={s} at={at(s)} src="sfx/stamp.wav" volume={0.28} />)}
      <Sfx at={at('faked it.') + 4} src="sfx/stamp.wav" volume={0.3} />
      <Sfx at={at('Thanks for watching.') + 1} src="sfx/stamp.wav" volume={0.26} />
      {notes.map((s) => <Sfx key={s} at={at(s) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={i} at={f} src="sfx/tick.wav" volume={0.45} />)}
    </>
  );
};

// Music: Turkey 3 under the bird and the plug; the Table Theme comes back for the ending and carries the end screen.
const HAND = T0.at("So let's go back");
const music = [
  {src: 'music/tg_turkey.mp3', volume: bed('tg_turkey'), to: HAND + 6, fadeOut: 45},
  {src: 'music/tg_table_theme.mp3', volume: bed('tg_table_theme'), from: HAND - 30},
];

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_turkey.wav" lead={LEAD} extra={EXTRA} music={music}>
    <Body />
  </ChapterShell>
);
