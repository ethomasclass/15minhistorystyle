// Chapter 8 · The turkey, and the ending. The Broad-Breasted White (the USDA ARS photo), "not a GMO", the old-fashioned way as a
// drawn loop, then the inflating turkey on its scale (IMAGE_PRESENTATION.md: chest swell, feather swap, the counter 13 -> 30+ with the
// legs unchanged, the tip forward, the hold on "Happy Thanksgiving."), the heritage bird beside it, the turkey landing on the board,
// the subscribe note, the question again, the recap stack, the pull-back to the whole board, the eel and the can side by side for
// the last lines, and the end screen (20 s from "Thanks for watching"). Placeholders are listed in PLACEHOLDERS. Coral-desk
// flashes (kit/tg_desk_map): "Happy Thanksgiving." (a cut in on the bird) and "It's still delicious." (a cut in on card and can).
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch08_turkey.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {CutIn, DeskScene, useMarks} from '../kit/tg_desk';
import {bed} from '../kit/levels';
import {ChapterShell, chapterFrames, FADE, LEAD, makeTimeline, type Narration, Stamp, TAIL, type TL, useScene} from '../kit/shell';
import {hold, readEnd, readFrames} from '../lib/timing';
import {type Box, Slip} from '../kit/vox';
import {PageScrap} from './ch34/parts';
import {Print} from '../kit/print';
import {EndSlots} from '../kit/ga_brand';
import {DropDeal, type DropDealCard, DropIn} from '../kit/tg_drop';
import {TgBoard} from '../kit/tg_board';
import {chestAt, SET, TURKEY, type TurkeyBeats, TurkeyRig, TurkeySet} from '../kit/tg_turkey';
import {CORAL, Cran, cranMap, EelLoop, Loupe, MockTape, ORANGE, PH, type Placeholder, RecipeCard, TEAL } from '../kit/tg_late';

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
} satisfies Record<string, Placeholder>;
/** Every placeholder in this chapter, for the asset swap. */
export const PLACEHOLDERS: Placeholder[] = Object.values(P);

const USDA = 'img/arch/large-white-turkey-female-usda-ars.jpg';
const USDA_TAG = 'Large White turkey hen · USDA Agricultural Research Service';
/** Turkey Raising, USDA Farmers' Bulletin 1409 (rev. 1952), Internet Archive: fig. 2 the Standardbred Bronze male, fig. 9 a Broad
 *  Breasted Bronze breeding hen (source px crops of the pages). */
const BULLETIN = "S. J. Marsden, Turkey Raising, USDA Farmers' Bulletin 1409, 1952 · Internet Archive";
const FIG2 = {src: 'img/arch/usda-1952-standardbred-bronze-male-fig2.jpg', size: [3298, 5212] as [number, number], crop: [280, 2190, 2700, 2560] as Box};
const FIG9 = {src: 'img/arch/usda-1952-broad-breasted-bronze-hen-and-carcasses-fig9-10.jpg', size: [3379, 5328] as [number, number], crop: [330, 350, 1100, 2800] as Box};
const FSA_FARM = 'img/arch/fsa-turkey-farm-harrisburg-pa-1940.jpg';
const OWI = 'img/arch/owi-thanksgiving-dinner-fincham-family-1942.jpg';
const AD22 = {src: 'img/arch/angelus-marshmallows-cracker-jacks-piggly-wiggly-ad-1922.jpg', size: [1675, 2069] as [number, number], crop: [470, 966, 1150, 152] as Box};

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
    <Highlight text="BROAD-BREASTED" x={120} y={330} size={104} at={t.at('called the')} seed={81} rot={-2} />
    <Highlight text="WHITE" x={150} y={480} size={104} at={t.at('called the') + 4} seed={82} rot={-3} />
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
    <PageScrap src={FSA_FARM} size={[5232, 4789]} box={[820, 480, 4150, 3800]} x={1160} y={200} w={620} rot={2} seed="fsa" />
    <Note text="a GMO turkey?" x={150} y={190} size={80} rot={-3} at={t.at('GMO turkey.') - 2} color={ORANGE} />
    <Strike x1={140} y1={265} x2={690} y2={215} at={t.at("isn't.")} />
    <Note text="nobody edited its genes" x={160} y={420} size={60} rot={-3} at={t.at("isn't.") - 2} color="#ffffff" />
    <Note text="no lab." x={200} y={560} size={70} rot={-3} at={t.at('edited its') - 2} />
    <Tag text="Turkey farm near Harrisburg, Pennsylvania, 1940 · Royden Dixon, FSA · Library of Congress" />
  </AbsoluteFill>
);

/** A hand-jittered diagram box (teal, drawn on over 8 frames) with an Abril label and a mono line under it. */
const DBox: React.FC<{x: number; y: number; w: number; h: number; label: string; sub: string; at: number; seed: string}> = ({x, y, w, h, label, sub, at, seed}) => {
  const g = useGFrame();
  const TEAL = useMarks().teal;
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
  const CORAL = useMarks().coral;
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
      <Note text="since the 1920s and '30s" x={900} y={800} size={60} rot={-3} at={t.at('starting back') - 2} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the inflating turkey (one set, cut between framings)

/** Wide: the bronze bird on the scale; more breast meat. */
const BirdWide: React.FC<{t: TL; a: number}> = ({t}) => (
  <TurkeySet b={beatsOf(t)} cam={{x: 760, y: 540, z: 1}} dial={false}>
    <PageScrap src={FIG9.src} size={FIG9.size} box={FIG9.crop} x={1480} y={130} w={300} rot={2} seed="f9" tag="Broad Breasted Bronze hen, USDA, 1952" />
    <Highlight text="MORE BREAST MEAT" x={110} y={120} size={80} at={t.at('farmers wanted')} seed={84} rot={-2} />
    <Note text="what farmers wanted" x={130} y={250} size={46} rot={-3} at={t.at('First, farmers') - 2} color="#ffffff" />
    <Note text="a broader chest" x={130} y={370} size={70} rot={-3} at={t.at('so they bred') - 2} />
  </TurkeySet>
);

/** Wide again: dark feathers wiped to white. */
const BirdWhite: React.FC<{t: TL; a: number}> = ({t}) => (
  <TurkeySet b={beatsOf(t)} cam={{x: 960, y: 540, z: 1}} dial={false}>
    <Highlight text="1950s" x={1250} y={130} size={110} at={t.at('1950s,')} seed={85} rot={-2} />
    <Note text="dark feathers..." x={1260} y={330} size={58} rot={-3} at={t.at('they swapped') - 2} color="#ffffff" />
    <Note text="...for white ones" x={1220} y={450} size={64} rot={-3} at={t.at('feathers for') - 2} />
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
      <Note text="leftover pin feathers" x={1180} y={590} size={50} rot={-3} at={t.at('little leftover') - 2} color="#ffffff" />
      <Note text="don't show on white" x={1190} y={690} size={56} rot={-3} at={t.at('pin feathers') - 2} />
      <Note text="cleaner in the store" x={1180} y={810} size={56} rot={-3} at={t.at("don't show.") - 2} color={usePal().subject} />
    </TurkeySet>
  );
};

/** The weights: the dial and the counter read 13 for the 1930s, then tick to 30+ while the body inflates over the same thin legs. */
const BirdWeight: React.FC<{t: TL; a: number}> = ({t}) => (
  <TurkeySet b={beatsOf(t)} cam={{x: 1060, y: 540, z: 0.92}}>
    <Highlight text="1930s" x={110} y={100} size={110} at={t.at('1930s,')} seed={86} rot={-2} />
    <Note text="average, live" x={130} y={270} size={46} rot={-3} at={t.at('average turkey') - 2} color="#ffffff" />
    <Highlight text="TODAY" x={1180} y={830} size={90} at={t.at('Today,')} seed={87} rot={-2} />
    <Note text="(same legs)" x={150} y={840} size={54} rot={-3} at={t.at('Today,') + 10} color="#ffffff" />
    <Arrow x1={440} y1={870} x2={690} y2={760} bow={-30} at={t.at('Today,') + 14} />
  </TurkeySet>
);

/** Too top-heavy: the bird tips forward about its feet and holds. Clinical notes, no joke on the picture. */
const BirdTip: React.FC<{t: TL; a: number}> = ({t}) => (
  <TurkeySet b={beatsOf(t)} cam={{x: 1100, y: 500, z: 1}} dial={false}>
    <Highlight text="TOO TOP-HEAVY" x={1190} y={130} size={70} at={t.at('top-heavy')} seed={88} rot={-2} />
    <Note text="to mate on their own" x={1220} y={300} size={44} rot={-3} at={t.at('to mate') - 2} color="#ffffff" />
    <Note text="males: too heavy" x={1220} y={410} size={44} rot={-3} at={t.at('males are') - 2} />
    <Note text="the shape is wrong" x={1240} y={510} size={44} rot={-3} at={t.at('shape is wrong.') - 2} />
    <Slip text="artificial insemination" x={1220} y={670} at={t.at('now comes') - 2} size={50} rot={-2} />
  </TurkeySet>
);

/** 194 million, almost all this one breed. Then "Happy Thanksgiving." over the held frame: nothing new, then the cut. */
const BirdCount: React.FC<{t: TL; a: number}> = ({t}) => (
  <TurkeySet b={beatsOf(t)} cam={{x: 960, y: 480, z: 0.8}} dial={false}>
    <Stamp text="194 MILLION" x={130} y={175} size={120} at={t.at('194 million')} rot={-3} />
    <Note text="raised last year" x={1260} y={420} size={46} rot={-3} at={t.at('turkeys raised') - 2} color="#ffffff" />
    <Note text="almost all: this breed" x={1240} y={530} size={46} rot={-3} at={t.at('almost all') - 2} />
  </TurkeySet>
);

// ------------------------------------------------------------------ heritage, the board
/** "Happy Thanksgiving.": a hard cut in to the bird alone on the coral desk, nothing new on it, held (the flash), then the cut. */
const BirdHappy: React.FC<{t: TL; a: number}> = ({t}) => <TurkeySet b={beatsOf(t)} cam={{x: 900, y: 560, z: 1.2}} dial={false} labels={false} />;

const Heritage: React.FC<{t: TL; a: number}> = ({t}) => {
  const pal = usePal();
  const done: TurkeyBeats = {swellAt: -100, tipAt: -100};
  const label = (x: number, text: string) => (
    <div style={{position: 'absolute', left: x, top: 960, transform: 'translateX(-50%)', fontFamily: JF.mono, fontSize: 22, letterSpacing: 3, color: 'rgba(244,239,230,0.8)', whiteSpace: 'nowrap'}}>{text}</div>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      {/* a real heritage-type bird: the Standardbred Bronze male of the 1952 USDA bulletin */}
      <PageScrap src={FIG2.src} size={FIG2.size} box={FIG2.crop} x={250} y={420} w={540} rot={-1.5} seed="f2" />
      <TurkeyRig x={1360} y={930} size={400} b={done} white grow={1} />
      {label(520, 'HERITAGE')}
      {label(1360, 'BROAD-BREASTED WHITE')}
      <Highlight text="HERITAGE TURKEYS" x={120} y={115} size={90} at={t.at('heritage turkeys,')} seed={89} rot={-2} />
      <Note text="can still do it themselves" x={130} y={250} size={46} rot={-3} at={t.at('do it themselves.') - 2} color="#ffffff" />
      <Note text="smaller," x={130} y={350} size={46} rot={-3} at={t.at('smaller,') - 2} />
      <Note text="slower-growing," x={390} y={350} size={46} rot={-3} at={t.at('slower-growing,') - 2} />
      <Note text="pricier" x={830} y={350} size={46} rot={-3} at={t.at('more expensive.') - 2} />
      <Note text="what a turkey used to be" x={1060} y={240} size={54} rot={-3} at={t.at("They're what") - 2} color={pal.subject} />
      <Arrow x1={1060} y1={300} x2={700} y2={520} bow={-50} at={t.at("They're what") + 6} />
      <Tag text={`Standardbred Bronze male · ${BULLETIN}`} />
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
const Subscribe: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="quick favor:" x={200} y={240} size={56} rot={-3} at={t.at('Quick favor:') - 2} color="#ffffff" />
    <Note text="hit subscribe" x={240} y={360} size={96} rot={-3} at={t.at('hit subscribe.') - 2} />
    <Note text="it's free." x={290} y={540} size={60} rot={-3} at={t.at("It's free.") - 2} color="#ffffff" />
    {/* no hands: the ask lands on its own card (lifted, drops, slides and turns to rest) and stays; the grocer's ad lands below it */}
    <DropIn at={Math.max(a + 12, t.at('hit subscribe.') + 2)} x={1130} y={330} rot={5} from={[650, -480, 30]} out={1e7}>
      <RecipeCard kicker="QUICK FAVOR" title="subscribe" lines={["it's free."]} />
    </DropIn>
    <PageScrap src={AD22.src} size={AD22.size} box={AD22.crop} x={1080} y={760} w={700} at={t.at('marshmallow people,')} rot={2} seed="s22"
      tag="Piggly Wiggly ad, 1922 · LOC" />
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
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="back to the question:" x={200} y={230} size={56} rot={-3} at={t.at('the question.') - 2} color="#ffffff" />
      <Note text="how did we get from eels..." x={240} y={380} size={88} rot={-3} at={t.at('How did we') - 2} />
      <Note text="...to this?" x={420} y={560} size={100} rot={-3} at={t.at('to this?') - 2} color={pal.subject} />
      <Print src={OWI} x={1230} y={560} w={560} h={448} at={t.at('eels...')} rot={2} pos="60% 50%" />
      {g >= t.at('eels...') && <Tag text="Thanksgiving dinner, 1942 · OWI · Library of Congress" />}
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
      <Print src="img/arch/simmons-1796-to-dress-a-turtle-p2.jpg" x={1010} y={120} w={460} h={640} at={s1 - 1} rot={-4} pos="50% 62%" />
      <Print src="img/arch/mock-turtle-soup-boston-cook-book-1884.jpg" x={1090} y={160} w={440} h={640} at={t.at('Then the people') - 1} rot={3} pos="50% 30%" />
      <MockTape x={1060} y={560} at={s2 + 4} size={80} />
      <Print src="img/arch/sarah-josepha-hale-engraving-1880-signature.jpg" x={1340} y={190} w={440} h={620} at={s3 - 1} rot={-2} pos="50% 20%" />
      <Print src="img/arch/jello-girl-gives-a-party-1920-cover.jpg" x={1250} y={230} w={450} h={620} at={s4 - 1} rot={4} pos="50% 30%" />
      <Highlight text="1 · SHOW OFF" x={110} y={130} size={66} at={s1} seed={90} rot={-2} />
      <Note text="turtles, oysters, meat in the pie" x={140} y={240} size={40} rot={-2} at={t.at('turtles,') - 2} color="#ffffff" />
      <Highlight text="2 · FAKE IT" x={110} y={350} size={66} at={s2} seed={91} rot={-2} />
      <Highlight text="3 · WRITE IT DOWN" x={110} y={530} size={66} at={s3} seed={92} rot={-2} />
      <Note text="a homemade menu, made national" x={140} y={640} size={40} rot={-2} at={t.at('homemade menu') - 2} color="#ffffff" />
      <Highlight text="4 · SELL THE SHORTCUT" x={110} y={750} size={66} at={s4} seed={93} rot={-2} />
      <Note text="dressed up as homemade" x={140} y={860} size={50} rot={-2} at={t.at('the shortcut,') - 2} color={pal.subject} />
      <Tag text="Simmons, American Cookery, 1796 · Boston Cook Book, 1884 · Hale, engraving, 1880 · Jell-O booklet, 1920 · LOC / Wellcome / Internet Archive" />
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
/** (`solo`: no notes or dates, for the "It's still delicious." cut-in.) The eel and the can, side by side; one last recipe card drops between them (no hands). Then hold. */
const EelCan: React.FC<{t: TL; a: number; solo?: boolean}> = ({t, a, solo}) => {
  const pal = usePal();
  const can = {cx: 1370, by: 860, pw: 540};
  const cm = cranMap(6, can.cx, can.by, can.pw);
  const [lx, ly] = [690, 757]; // the "1 can" line on the card (screen px), for the loop
  const deals: DropDealCard[] = [{at: t.at('recipe card') + 2, x: 690, y: 640, rot: -3, from: [600, 520, 22], card: (
    <RecipeCard kicker="FROM THE KITCHEN OF GRANDMA" title="Cranberry sauce" lines={['1 can, jellied', 'open both ends', 'slide onto a plate']} />
  )}];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <EelLoop x={20} y={170} w={900} at={a} />
      <Cran n={6} {...can} />
      {!solo && <div style={{position: 'absolute', left: 150, top: 110, fontFamily: JF.mono, fontSize: 24, letterSpacing: 4, color: 'rgba(244,239,230,0.75)'}}>1621</div>}
      {!solo && <div style={{position: 'absolute', left: cm.at(620, 0)[0] - 60, top: 110, fontFamily: JF.mono, fontSize: 24, letterSpacing: 4, color: 'rgba(244,239,230,0.75)'}}>NOW</div>}
      {!solo && <Note text="what they could catch" x={140} y={580} size={50} rot={-3} at={t.at('could catch.') - 2} color="#ffffff" />}
      {!solo && <Note text="what somebody wrote down," x={1060} y={170} size={44} rot={-3} at={t.at('somebody wrote down,') - 2} color="#ffffff" />}
      {!solo && <Note text="...and sold back to us" x={1100} y={270} size={50} rot={-3} at={t.at('sold back') - 2} color={pal.subject} />}
      <DropDeal deals={deals} />
      <Loop cx={lx + 150} cy={ly} rx={170} ry={36} at={t.at('an ad.') + 2} seed={21} tilt={-3} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the end screen
/** The 20 s end screen from "Thanks for watching" (kit/ga_brand EndSlots, as the Gilded Age's): the desk, the mark, two video slots
 *  and the subscribe circle sized to YouTube Studio's end-screen elements, three mono labels. Music only after the voice. */
const EndScreen: React.FC<{t: TL; a: number}> = ({a}) => <EndSlots at={a} />;

// ------------------------------------------------------------------ the chapter
const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  // cut 1 frame before the word that starts the new idea (beatscope reads this object)
  const c = {
    breed: 0,
    gmo: hold(at('You may have') - 1, readEnd(at('called the') + 4, 'WHITE', 7)),
    oldway: hold(at('They did it') - 1, readEnd(at('edited its') - 2, 'no lab.')),
    wide: hold(at('First, farmers') - 1, readEnd(at('starting back') - 2, "since the 1920s and '30s")),
    white: hold(at('Then in the 1950s,') - 1, readEnd(at('so they bred') - 2, 'a broader chest')),
    loupe: hold(at('Why? Because') - 1, readEnd(at('feathers for') - 2, '...for white ones')),
    weight: hold(at('And the birds kept') - 1, readEnd(at("don't show.") - 2, 'cleaner in the store')),
    tip: hold(at('It worked so well') - 1, readEnd(at('Today,'), 'TODAY', 7), readEnd(at('Today,') + 10, '(same legs)')),
    count: hold(at('Out of the roughly') - 1, readEnd(at('now comes') - 2, 'artificial insemination', 13)),
    happy: hold(at('Happy Thanksgiving.') - 1, readEnd(at('almost all') - 2, 'almost all: this breed')),
    heritage: at('The older breeds,') - 1,
    invention: hold(at('So even the bird') - 1, readEnd(at("They're what") - 2, 'what a turkey used to be')),
    subscribe: hold(at('Quick favor:') - 1, readEnd(at('an invention.'), 'REDESIGNED', 8)),
    // the grocer's ad strip lands on "marshmallow people" and settles: its tag and the strip get their time
    question: hold(at("So let's go back") - 1, readEnd(at('not selling') - 2, '(not selling anything)'), at('marshmallow people,') + 7 + readFrames('Piggly Wiggly ad, 1922 · LOC', true)),
    recap: hold(at('Step by step.') - 1, readEnd(at('to this?') - 2, '...to this?'), at('eels...') + 7 + readFrames('', true)),
    pull: hold(at('That means almost') - 1, readEnd(at('the shortcut,') - 2, 'dressed up as homemade')),
    eelcan: hold(at('The people of 1621') - 1, readEnd(at("marshmallow company's.") - 2, "a marshmallow company's.")),
    delicious: at("It's still delicious.") - 1,
    end: at('Thanks for watching.') - 1,
  };
  const scene = useScene([
    [c.breed, <Breed t={t} a={c.breed} />],
    [c.gmo, <Gmo t={t} a={c.gmo} />],
    [c.oldway, <OldWay t={t} a={c.oldway} />],
    [c.wide, <BirdWide t={t} a={c.wide} />],
    [c.white, <BirdWhite t={t} a={c.white} />],
    [c.loupe, <BirdLoupe t={t} a={c.loupe} />],
    [c.weight, <BirdWeight t={t} a={c.weight} />],
    [c.tip, <BirdTip t={t} a={c.tip} />],
    [c.count, <BirdCount t={t} a={c.count} />],
    [c.happy, <BirdHappy t={t} a={c.happy} />],
    [c.heritage, <Heritage t={t} a={c.heritage} />],
    [c.invention, <Invention t={t} a={c.invention} />],
    [c.subscribe, <Subscribe t={t} a={c.subscribe} />],
    [c.question, <Question t={t} a={c.question} />],
    [c.recap, <Recap t={t} a={c.recap} />],
    [c.pull, <PullBack t={t} a={c.pull} />],
    [c.eelcan, <EelCan t={t} a={c.eelcan} />],
    [c.delicious, <CutIn x={1240} y={700} z={1.3}><EelCan t={t} a={c.eelcan} solo /></CutIn>],
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
      <DeskScene ch="ch08" cuts={c} t={t}>{scene}</DeskScene>
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
