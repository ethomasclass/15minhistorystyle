// Chapter 7 · The test kitchens. The 1917 Angelus booklet on a 1910s ad plate (the chapter's one guided pan lands on the recipe as
// it is said), the cranberry can paid off on "Because it IS the can" (cran frame 6 held, a loupe on the ridges), 1955 in the
// second person (a kitchen diorama, the notes as your shopping list), a fast 1954/1955 montage of recipe cards dealt by the
// silhouette hand, the casserole state sheet (casserole -> three cans), the third mock morph with the MOCK tape, and the can
// landing on the collage board. Coral-desk flashes (kit/tg_desk_map): "Because it IS the can" (a cut-in on frame 6, then the
// ridges loupe on teal) and the MOCK tape cut-in. Scenes are timed to words (script/ch07_test_kitchens.txt); placeholders are listed in PLACEHOLDERS.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Img, staticFile} from 'remotion';
import words from '../../public/audio/ch07_test_kitchens.words.json';
import {clamp} from '../lib/anim';
import {Highlight, INK, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {bed} from '../kit/levels';
import {ChapterShell, chapterFrames, hasFile, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {type Box, Slip, Swipe} from '../kit/vox';
import {TgPrint} from '../kit/tg_placeholder';
import {Cut, Hand} from '../kit/tg_cut';
import {COLOUR_DOC, PageScrap} from './ch34/parts';
import {TgBoard} from '../kit/tg_board';
import {CutIn, DeskScene, rgba, useMarks} from '../kit/tg_desk';
import {CARD, CORAL, Cran, cranMap, type Deal, HandDeal, Loupe, MockTape, Morph, PH, type Placeholder, RecipeCard, tornPct} from '../kit/tg_late';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------ assets still to come
const P = {
  plate: {file: 'img/flow/tg_adplate_1910s.png', what: '1910s magazine ad plate (Flow #11), 2880 x 1080: the booklet area left, a blank cream panel right; colour'},
  booklet: {file: 'img/arch/angelus_1917_booklet.jpg', what: 'Angelus marshmallow recipe booklet, 1917 (cover scan; colour)'},
  hill: {file: 'img/arch/janet_mckenzie_hill.jpg', what: 'Janet McKenzie Hill, portrait (bust cut-out)'},
  urann: {file: 'img/arch/marcus_urann.jpg', what: 'Marcus Urann, portrait (bust cut-out)'},
  dSky: {file: 'img/flow/d4_kitchen_window.png', what: 'diorama D4, plane a: window, lawn, picket fence'},
  dCab: {file: 'img/flow/d4_kitchen_cabinets.png', what: 'diorama D4, plane b: 1950s cabinets and a new refrigerator'},
  dHost: {file: 'img/flow/d4_kitchen_hostess.png', what: 'diorama D4, plane c: a hostess in profile at the counter (solid black)'},
  dFront: {file: 'img/flow/d4_kitchen_front.png', what: 'diorama D4, plane d: the counter, a casserole dish (coral) and a row of plain cans'},
  plate50: {file: 'img/flow/tg_adplate_1950s.png', what: '1950s ad plate: a kitchen, a gingham table, a blank cream panel right; colour'},
  reilly: {file: 'img/arch/dorcas_reilly.jpg', what: 'Dorcas Reilly in the Campbell test kitchen (photo)'},
} satisfies Record<string, Placeholder>;
const PLATE_SIZE: [number, number] = [2880, 1080];

/** Every placeholder in this chapter, for the asset swap. */
export const PLACEHOLDERS: Placeholder[] = Object.values(P).filter((p) => p !== P.plate && p !== P.plate50);

const TAG_BOOKLET = 'Recipe paraphrased from the Angelus Marshmallows booklet, 1917';

// ------------------------------------------------------------------ the scans that have landed (CREDITS.md; line boxes from the .json / measured)
/** Piggly Wiggly price list, Albuquerque Morning Journal, 28 Oct 1922 (Chronicling America): "CRACKER JACKS" over "ANGELUS MARSHMALLOWS". */
const AD22 = {src: 'img/arch/angelus-marshmallows-cracker-jacks-piggly-wiggly-ad-1922.jpg', size: [1675, 2069] as [number, number], crop: [470, 966, 1150, 152] as Box,
  cj: [500, 972, 500, 46] as Box, angelus: [[500, 1016, 930, 46], [500, 1060, 930, 46]] as Box[],
  tag: 'Piggly Wiggly ad, Albuquerque Morning Journal, Oct. 28, 1922 · Library of Congress'};
/** Sanitary Grocery Co. ad, Washington Times, 8 Oct 1920: "Angelus Marshmallows ... 12½c" on the shelf list. */
const AD20 = {src: 'img/arch/sanitary-grocery-ad-angelus-marshmallows-knox-gelatine-washington-times-1920.jpg', size: [2600, 3805] as [number, number],
  crop: [950, 2090, 1530, 420] as Box, angelus: [976, 2276, 489, 68] as Box,
  tag: 'Sanitary Grocery Co. ad, Washington Times, Oct. 8, 1920 · Library of Congress'};
const LOOK = 'img/arch/look-miracle-kitchen-1959-woman-pantry-cans.jpg';
const TAG_LOOK = "LOOK Magazine, 'Miracle Kitchen', 1959 · Bob Lerner · Library of Congress";

// ------------------------------------------------------------------ 1917
/** The ad plate full frame, the booklet on it, held still: the cut in is the motion; a stepped 2% nudge lands on the year. */
const Booklet: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const nudge = g >= t.at('1917,') ? 1.02 : 1;
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${nudge})`, transformOrigin: '35% 50%'}}>
        <PH {...P.plate} w={PLATE_SIZE[0]} h={PLATE_SIZE[1]} fit="cover" filter="saturate(0.85)" shadow={false} />
        <PH {...P.booklet} x={250} y={130} w={560} h={800} rot={-3} filter="saturate(0.8) contrast(1.05)" />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)'}} />
      <Highlight text="1917" x={1000} y={170} size={130} at={t.at('1917,')} seed={71} rot={-2} />
      <Slip text="Angelus marshmallows" x={1010} y={390} at={t.at('Angelus') - 2} />
      <Slip text="a recipe booklet" x={1050} y={510} at={t.at('recipe booklet') - 2} rot={2} />
      <Tag text="Angelus Marshmallows recipe booklet, 1917" />
    </AbsoluteFill>
  );
};

/** Who was behind it: the booklet on the desk, the cooking teacher they hired. */
const Hired: React.FC<{t: TL; a: number}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    {/* the two products side by side on a 1922 grocer's list */}
    <PageScrap src={AD22.src} size={AD22.size} box={AD22.crop} x={110} y={190} w={900} rot={-2} seed="a22" tag={AD22.tag}>
      <Swipe lines={AD22.angelus} from={-999} to={-998} seed="a22a" color="rgba(255,111,97,0.55)" />
      <Swipe lines={[AD22.cj]} from={t.at('Cracker') - 1} to={t.end('Cracker Jack.') + 3} seed="a22c" />
    </PageScrap>
    <PH {...P.hill} x={1330} y={150} w={440} h={600} />
    <Slip text="the same company made Cracker Jack" x={170} y={850} at={t.at('Cracker') - 2} rot={-2} size={56} />
    <Note text="Janet McKenzie Hill" x={690} y={260} size={56} rot={-3} at={t.at('Janet') - 2} color="#ffffff" />
    <Note text="a well-known cooking teacher" x={710} y={380} size={44} rot={-3} at={t.at('well-known') - 2} />
    <Note text="writes the recipes" x={730} y={480} size={44} rot={-3} at={t.at('write the recipes') - 2} />
    <Tag text="Janet McKenzie Hill, portrait" />
  </AbsoluteFill>
);

/** The chapter's one guided pan (variant A): across the plate from the booklet to the recipe, landing on it as it is said; each
 *  word of the paraphrase lights up on its own spoken word, then the frame holds through "Was it a good idea? Maybe." */
const Recipe: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const land = t.at('baked with marshmallows') - 4;
  const x = interpolate(f, [a + 4, land], [0, 960], clamp); // linear: a guided move, no easing
  const real = hasFile(P.plate.file);
  const i0 = t.idx('baked with marshmallows on top.');
  const lit = (k: number) => g >= t.wordAt(i0 + k);
  const W = ['Sweet', 'potatoes,', 'baked', 'with', 'marshmallows', 'on', 'top.'];
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateX(${-x}px)`}}>
        <PH {...P.plate} w={PLATE_SIZE[0]} h={PLATE_SIZE[1]} fit="cover" filter="saturate(0.85)" shadow={false} label={false} />
        <PH {...P.booklet} x={250} y={130} w={560} h={800} rot={-3} filter="saturate(0.8) contrast(1.05)" label={false} />
        {/* the paraphrase, set in our own type on the plate's blank panel (never presented as the booklet's words) */}
        {f >= land - 8 && <div style={{position: 'absolute', left: 2010, top: 300, width: 760, opacity: interpolate(f, [land - 8, land - 2], [0, 1], clamp)}}>
          <div style={{fontFamily: JF.mono, fontSize: 20, letterSpacing: 3, color: real ? '#5a4a36' : 'rgba(244,239,230,0.6)', marginBottom: 26}}>THE RECIPE, IN SHORT</div>
          <div style={{fontFamily: JF.heavy, fontWeight: 900, fontSize: 76, lineHeight: 1.2, color: real ? '#2a2118' : '#f4efe6'}}>
            {W.map((w, k) => {
              const on = k >= 2 && lit(k - 2);
              return (
                <span key={k} style={{position: 'relative', display: 'inline-block', marginRight: 22}}>
                  {on && <span style={{position: 'absolute', left: -8, right: -10, top: '12%', bottom: '2%', background: CORAL, opacity: 0.85, mixBlendMode: real ? 'multiply' : 'normal',
                    clipPath: tornPct(`rw${k}`)}} />}
                  <span style={{position: 'relative', color: on ? '#1a120c' : undefined}}>{w}</span>
                </span>
              );
            })}
          </div>
        </div>}
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)'}} />
      <Tag text={TAG_BOOKLET} />
    </AbsoluteFill>
  );
};

/** The motive, said plainly. */
const Motive: React.FC<{t: TL; a: number}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PageScrap src={AD20.src} size={AD20.size} box={AD20.crop} x={960} y={250} w={860} rot={2} seed="a20" tag={AD20.tag}>
        <Swipe lines={[AD20.angelus]} from={t.at('sell marshmallows') - 1} to={t.end('sell marshmallows') + 4} seed="a20a" />
      </PageScrap>
      <Highlight text="THE MOTIVE" x={130} y={150} size={110} at={t.at('motive.')} seed={72} rot={-2} />
      <Note text="sell marshmallows" x={160} y={340} size={74} rot={-3} at={t.at('sell marshmallows') - 2} color={pal.subject} />
      <Note text="a hundred years later..." x={160} y={560} size={52} rot={-3} at={t.at('a hundred years') - 2} color="#ffffff" />
      <Note text="...it's on your table" x={220} y={680} size={62} rot={-3} at={t.at('on your table') - 2} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the cranberry
const Berries: React.FC<{t: TL; a: number}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <TgPrint src="img/arch/fsa-men-scooping-cranberries-nj-1938.jpg" x={880} y={150} w={920} h={640} at={-999} rot={2} pos="50% 60%" />
    <Highlight text="CRANBERRIES" x={120} y={140} size={96} at={t.at('cranberry sauce.')} seed={73} rot={-2} />
    <Note text="an American fruit" x={150} y={330} size={60} rot={-3} at={t.at('American fruit') - 2} />
    <Note text="sauce: for centuries" x={170} y={460} size={52} rot={-3} at={t.at('centuries.') - 2} color="#ffffff" />
    <Tag text="Men scooping cranberries, Burlington County, N.J., 1938 · Arthur Rothstein, FSA · Library of Congress" />
  </AbsoluteFill>
);

/** Urann's problem as a drawn year: 52 weeks, fresh berries sell in a few of them; in a can, all of them. */
const Urann: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const drawAt = t.at('Fresh berries') - 2;
  const fewAt = t.at('few weeks');
  const canAt = t.at('in a can.');
  const mk = useMarks();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PH {...P.urann} x={1340} y={150} w={430} h={590} />
      <Highlight text="1912" x={120} y={110} size={120} at={t.at('1912,')} seed={74} rot={-2} />
      <Note text="Marcus Urann, cranberry grower" x={140} y={290} size={46} rot={-2} at={t.at('Marcus') - 2} color="#ffffff" />
      {g >= drawAt && (
        <div style={{position: 'absolute', left: 150, top: 430}}>
          <div style={{fontFamily: JF.mono, fontSize: 20, letterSpacing: 3, color: 'rgba(244,239,230,0.7)', marginBottom: 12}}>
            {g >= canAt ? 'IN A CAN: ALL 52 WEEKS' : 'FRESH BERRIES SELL: A FEW WEEKS A YEAR'}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(13, 56px)', gap: 8}}>
            {Array.from({length: 52}, (_, i) => {
              const shown = g >= drawAt + Math.floor(i / 13) * 2;
              const fresh = i >= 40 && i <= 46 && g >= fewAt;
              const can = g >= canAt + Math.floor(i / 4);
              return <div key={i} style={{width: 56, height: 40, borderRadius: 3, opacity: shown ? 1 : 0, boxSizing: 'border-box',
                border: `2px solid ${can ? pal.mark : fresh ? pal.subject : rgba(mk.teal, 0.35)}`,
                background: can ? rgba(mk.teal, 0.55) : fresh ? rgba(mk.coral, 0.85) : 'transparent'}} />;
            })}
          </div>
        </div>
      )}
      <Note text="his fix: cook them down," x={150} y={720} size={50} rot={-2} at={t.at('His fix:') - 2} />
      <Note text="put them in a can" x={190} y={830} size={62} rot={-3} at={t.at('in a can.') - 2} color={pal.subject} />
      <Tag text="Marcus Urann · portrait" />
    </AbsoluteFill>
  );
};

const Ocean: React.FC<{t: TL; a: number}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    {/* no PD Ocean Spray item exists: a canned cranberry sauce of the time, labelled as what it is (another brand, 1910) */}
    <PageScrap src="img/arch/empress-cranberry-sauce-trademark-label-1910.jpg" size={[4150, 6217]} box={[480, 480, 3200, 2500]} x={1040} y={180} w={720} at={t.at('1941,') + 2} rot={-2}
      seed="emp" filter={COLOUR_DOC} />
    <Highlight text="1941" x={120} y={120} size={120} at={t.at('1941,')} seed={75} rot={-2} />
    <Note text="his growers' cooperative" x={140} y={300} size={52} rot={-3} at={t.at("growers'") - 2} color="#ffffff" />
    <Note text="takes the brand national" x={170} y={410} size={52} rot={-3} at={t.at('brand national.') - 2} />
    <Highlight text="OCEAN SPRAY" x={120} y={590} size={104} at={t.at('Ocean Spray.')} seed={76} rot={-3} />
    <Tag text="Not Ocean Spray: Empress brand cranberry sauce, trademark registered 1910 · Library of Congress" />
  </AbsoluteFill>
);

// ------------------------------------------------------------------ the can, paid off
/** Plate centre and width for the payoff shots (screen px). */
const PAY = {cx: 1330, by: 930, pw: 860};

/** The cold open's question comes back while the log slides out (frames 1-5), stopping one frame short. */
const Question: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const q0 = t.at('Why is'), q1 = t.end('like a can?');
  const n = 1 + Math.min(4, Math.max(0, Math.floor(interpolate(g, [q0, q1], [0, 4.99], clamp))));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Cran n={n} cx={1540} by={930} pw={700} />
      <Note text="one of our questions:" x={130} y={170} size={50} rot={-3} at={t.at('answers') - 2} color="#ffffff" />
      <Note text="why is it shaped" x={150} y={300} size={70} rot={-3} at={t.at('Why is') - 2} />
      <Note text="like a can?" x={200} y={430} size={70} rot={-3} at={t.at('like a can?') - 2} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** "Because it IS the can." Frame 6, held: no title, no zoom. Then a loupe on the log's ridges, and a loop on the can's. */
const Payoff: React.FC<{t: TL; a: number}> = ({t}) => {
  const m = cranMap(6, PAY.cx, PAY.by, PAY.pw);
  const layer = <Cran n={6} {...PAY} shadow={false} />;
  const [lx, ly] = m.at(330, 380); // the log's ridges (frame 6's own pixels)
  const [kx, ky] = m.at(690, 250); // the empty can's ridges
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Cran n={6} {...PAY} />
      <Loupe layer={layer} cx={lx} cy={ly} r={170} zoom={2.6} to={[430, 360]} at={t.at('Those ridges') + 2} bow={50} />
      <Loop cx={kx} cy={ky} rx={110} ry={80} at={t.at("can's ridges.") + 2} seed={9} tilt={-20} />
      <Hand name="tg_hand_point" x={kx + 150} y={ky + 10} w={620} at={t.at("can's ridges.") + 2} out={t.at("can's ridges.") + 40} />
      <Note text="same ridges." x={190} y={640} size={56} rot={-3} at={t.at("can's ridges.") + 6} color="#ffffff" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 1955, you
/** The 1950s kitchen diorama: four planes in parallax (a slow drift), placeholders until D4's planes exist. */
const Diorama: React.FC<{drift: number; z?: number; fx?: number; fy?: number; labels?: boolean}> = ({drift, z = 1, fx = 960, fy = 540, labels = true}) => {
  const planes: [Placeholder, number, [number, number, number, number], number][] = [
    [P.dSky, 0.15, [-80, 0, 2080, 1100], 0.05],
    [P.dCab, 0.4, [-80, 150, 2080, 700], 0.14],
    [P.dHost, 0.7, [1120, 230, 420, 780], 0.24],
    [P.dFront, 1, [-80, 760, 2080, 360], 0.33],
  ];
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: INK}}>
      <AbsoluteFill style={{transform: `translate(${fx - fx * z}px, ${fy - fy * z}px) scale(${z})`, transformOrigin: '0 0'}}>
        {planes.map(([ph, depth, [x, y, w, h], tone], i) => (
          <PH key={i} {...ph} x={x + drift * depth} y={y} w={w} h={h} tone={tone} fit="cover" filter="none" shadow={i > 0} inset={x < 0 ? 160 : 14} label={labels} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Hosting: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [a, t.at("You've got")], [30, -30], clamp);
  return (
    <AbsoluteFill>
      <Diorama drift={drift} />
      <Highlight text="1955" x={140} y={230} size={130} at={t.at("It's 1955.")} seed={78} rot={-2} />
      <Slip text="you're hosting." x={160} y={440} at={t.at("You're hosting.") - 2} size={64} />
      <Slip text="the in-laws: at four" x={200} y={570} at={t.at('in-laws') - 2} size={56} rot={2} />
      {/* a real kitchen of the time, labelled by its own date (1959, not 1955) */}
      <TgPrint src={LOOK} x={1080} y={200} w={720} h={493} at={t.at("You're hosting.") - 1} rot={2} pos="30% 40%" tag={TAG_LOOK} />
    </AbsoluteFill>
  );
};

/** Your shopping list (dark paper, teal rules), writing itself as the voice lists what you've got. */
const ListPad: React.FC<{x: number; y: number; items: {text: string; at: number; coral?: boolean}[]}> = ({x, y, items}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 560, height: 700, background: 'linear-gradient(170deg, #26221c, #181612)', boxShadow: '0 24px 40px rgba(0,0,0,0.7)',
      transform: 'rotate(2deg)', borderRadius: 4}}>
      {Array.from({length: 9}, (_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 150 + i * 62, height: 1.5, background: 'rgba(47,224,196,0.2)'}} />)}
      <div style={{position: 'absolute', left: 60, top: 0, bottom: 0, width: 2, background: 'rgba(255,111,97,0.45)'}} />
      <div style={{position: 'absolute', left: 84, top: 56, fontFamily: JF.mono, fontSize: 22, letterSpacing: 3, color: 'rgba(244,239,230,0.6)'}}>THURSDAY · TO DO</div>
      {items.map((it, i) => {
        if (g < it.at) return null;
        const p = interpolate(g, [it.at, it.at + 10], [0, 1], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: 84, top: 102 + i * 124, fontFamily: '"Nanum Pen Script", cursive', fontSize: 64, lineHeight: 1, whiteSpace: 'nowrap',
            color: it.coral ? pal.subject : pal.mark, clipPath: `inset(-60% ${(1 - p) * 100}% -60% -5%)`}}>□ {it.text}</div>
        );
      })}
    </div>
  );
};

const Pantry: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [a, t.at('In 1954,')], [-20, 20], clamp);
  return (
    <AbsoluteFill>
      <Diorama drift={drift} z={1.3} fx={700} fy={860} labels={false} />
      <ListPad x={1220} y={150} items={[
        {text: 'new refrigerator', at: t.at('refrigerator,') - 2},
        {text: 'pantry full of cans', at: t.at('pantry full') - 2},
        {text: 'the magazine says:', at: t.at('magazine') - 2},
        {text: 'all in half an hour', at: t.at('half an hour.') - 2, coral: true},
      ]} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the montage
/** 1954, 1955: the silhouette hand deals one recipe card per date, fast. */
const Montage: React.FC<{t: TL; a: number}> = ({t}) => {
  const deals: Deal[] = [
    {at: t.at('1954,'), x: 150, y: 150, rot: -4, card: <RecipeCard kicker="1954 · SWIFT AND COMPANY" title="Butterball turkey" lines={['on the market']} />},
    {at: t.at('In 1955,') + 2, x: 720, y: 330, rot: 3, card: <RecipeCard kicker="1955 · NEW JERSEY" title="Campbell's test kitchen" lines={['home economists']} />},
    {at: t.at('Dorcas'), x: 1290, y: 160, rot: -2, card: (
      <RecipeCard kicker="HOME ECONOMIST" title="Dorcas Reilly" lines={['the ask: a recipe', 'from the pantry']}>
        <PH {...P.reilly} x={CARD[0] - 150} y={20} w={130} h={170} shadow={false} />
      </RecipeCard>
    )},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <HandDeal deals={deals} />
      <Note text="things people already have" x={170} y={800} size={56} rot={-3} at={t.at('already have') - 2} />
      <Tag text="Dorcas Reilly · Campbell Soup Company photo" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the casserole
/** The casserole on the 1950s kitchen table (the 1950s ad plate, full frame, colour): one still, the dish; the three ingredients
 *  land on it as slips, the last one dropped in by the pinching hand; MIX. BAKE. DONE. on the plate's blank panel. */
const Casserole: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const cAt = t.at('Fried onions');
  const ink = '#2a2118';
  return (
    <AbsoluteFill style={{background: INK}}>
      <Img src={staticFile(P.plate50.file)} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'saturate(0.85) contrast(1.02)'}} />
      <Cut name="tg_casserole_A" x={330} y={470} w={760} rot={-2} at={a + 1} land="slap" />
      <Slip text="green beans" x={420} y={520} at={t.at('Green beans.') - 2} size={50} rot={-3} />
      <Slip text="cream of mushroom soup" x={470} y={680} at={t.at('cream of mushroom') - 2} size={50} rot={2} />
      <Slip text="fried onions" x={620} y={840} at={cAt} size={50} rot={-2} coral />
      <Hand name="tg_hand_pinch" x={900} y={850} w={700} at={cAt} out={cAt + 14} />
      <Stamp text="MIX." x={1400} y={250} size={96} at={t.at('Mix,')} rot={-4} color={ink} />
      <Stamp text="BAKE." x={1410} y={390} size={96} at={t.at('bake,')} rot={-2} color={ink} />
      <Stamp text="DONE." x={1420} y={530} size={96} at={t.at('done.')} rot={-5} color="#c2452f" />
      <Highlight text="GREEN BEAN CASSEROLE" x={170} y={110} size={84} at={t.at('Green bean casserole.')} seed={79} rot={-2} />
    </AbsoluteFill>
  );
};

/** (`solo`: the picture and the tape only, for the MOCK flash's cut-in.) Twenty million a year, then the third mock, made in code
 *  from stills: the homemade pie sits on the desk; the silhouette hand reaches in and sets a can down in its place (a hard swap on
 *  the drawing the can lands), and the MOCK tape lands on "Mock". */
const MockHomemade: React.FC<{t: TL; a: number; solo?: boolean}> = ({t, a, solo}) => {
  const pal = usePal();
  const mockAt = t.at('Mock homemade.');
  const swap = Math.max(a + 14, mockAt - 12);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {!solo && <Stamp text="20 MILLION" x={120} y={170} size={140} at={t.at('twenty million')} rot={-3} />}
      {!solo && <Note text="casseroles, every Thanksgiving" x={130} y={360} size={46} rot={-3} at={t.at('every Thanksgiving.') - 2} />}
      {!solo && <Note text="(Campbell's own count)" x={150} y={460} size={40} rot={-3} at={t.at('every Thanksgiving.') + 8} color="#ffffff" />}
      <Cut name="tg_homemade_pie" x={1010} y={250} w={780} at={solo ? -999 : a + 2} out={swap} land="slap" />
      <Hand name="tg_hand_can" x={1280} y={700} w={1150} at={swap} />
      <MockTape x={1150} y={400} at={mockAt} size={140} />
      {!solo && <Note text="store-bought," x={150} y={640} size={56} rot={-3} at={t.at('Store-bought,') - 2} color="#ffffff" />}
      {!solo && <Note text="dressed up as Grandma's" x={190} y={760} size={64} rot={-3} at={t.at('dressed up') - 2} color={pal.subject} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the board
/** The can lands on the board; the yarn from the Jell-O mould says "therefore"; the turkey's slot waits, with a question. */
const Board: React.FC<{t: TL; a: number}> = ({t, a}) => {
  return (
    <TgBoard subject="can" only={['hale', 'jello', 'can', 'turkey']} cam={[[a, 1512, 560, 1.5], [t.at('redesigned') - 4, 1512, 560, 1.5], [t.at('redesigned') + 16, 1570, 520, 1.4]]}
      land={{can: a + 6, turkey: null}} threads={{can: t.at('one step further.')}} ghost={{id: 'turkey', at: t.at('redesigned')}} />
  );
};

// ------------------------------------------------------------------ the chapter
const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  // cut 1 frame before the word that starts the new idea (beatscope reads this object)
  const c = {
    booklet: 0,
    hired: at('The company') - 1,
    recipe: at('And one of them') - 1,
    motive: at('But notice') - 1,
    berries: at("Then there's") - 1,
    urann: at('But in 1912,') - 1,
    ocean: at('In 1941,') - 1,
    question: at('And that answers') - 1,
    payoff: at('Because it IS') - 1,
    ridges: at('Those ridges') - 1,
    hosting: at('Now jump') - 1,
    pantry: at("You've got") - 1,
    montage: at('In 1954,') - 1,
    casserole: at('Green beans.') - 1,
    mock: at("Campbell's says") - 1,
    mockFlash: at('Mock homemade.') - 1,
    mockAfter: at('dressed up') - 1,
    board: at('And then they') - 1,
  };
  const scene = useScene([
    [c.booklet, <Booklet t={t} a={c.booklet} />],
    [c.hired, <Hired t={t} a={c.hired} />],
    [c.recipe, <Recipe t={t} a={c.recipe} />],
    [c.motive, <Motive t={t} a={c.motive} />],
    [c.berries, <Berries t={t} a={c.berries} />],
    [c.urann, <Urann t={t} a={c.urann} />],
    [c.ocean, <Ocean t={t} a={c.ocean} />],
    [c.question, <Question t={t} a={c.question} />],
    [c.payoff, <CutIn x={PAY.cx - 60} y={640} z={1.25}><Payoff t={t} a={c.payoff} /></CutIn>],
    [c.ridges, <Payoff t={t} a={c.ridges} />],
    [c.hosting, <Hosting t={t} a={c.hosting} />],
    [c.pantry, <Pantry t={t} a={c.pantry} />],
    [c.montage, <Montage t={t} a={c.montage} />],
    [c.casserole, <Casserole t={t} a={c.casserole} />],
    [c.mock, <MockHomemade t={t} a={c.mock} />],
    [c.mockFlash, <CutIn x={1400} y={470} z={1.3}><MockHomemade t={t} a={c.mock} solo /></CutIn>],
    [c.mockAfter, <MockHomemade t={t} a={c.mock} />],
    [c.board, <Board t={t} a={c.board} />],
  ]);
  // sound lists, kept next to the scenes: silent cuts; a stamp per title, stamp and tape; the near-silent marker per note; a tick per card
  const stamps = ['1917,', 'motive.', 'cranberry sauce.', '1912,', '1941,', 'Ocean Spray.', "It's 1955.", 'Mix,', 'bake,', 'done.', 'Green bean casserole.', 'twenty million', 'Mock homemade.'];
  const notes = ['Janet', 'well-known', 'write the recipes', 'sell marshmallows', 'a hundred years', 'on your table', 'American fruit', 'centuries.', 'Marcus', 'His fix:', 'in a can.',
    "growers'", 'brand national.', 'answers', 'Why is', 'like a can?', 'refrigerator,', 'pantry full', 'magazine', 'half an hour.', 'already have', 'every Thanksgiving.', 'Store-bought,', 'dressed up'];
  const ticks = [at('1954,'), at('In 1955,') + 2, at('Dorcas'), at('Fresh berries'), at('Those ridges') + 10];
  return (
    <>
      <DeskScene ch="ch07" cuts={c} t={t}>{scene}</DeskScene>
      {stamps.map((s) => <Sfx key={s} at={at(s)} src="sfx/stamp.wav" volume={0.28} />)}
      {notes.map((s) => <Sfx key={s} at={at(s) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((f, i) => <Sfx key={i} at={f} src="sfx/tick.wav" volume={0.45} />)}
      <Sfx at={at("can's ridges.") + 6} src={WRITE.src} volume={WRITE.volume} />
    </>
  );
};

// Music: Test Kitchen 2 (1:44). If the voiced chapter runs past the cue, a second copy picks the cue up again from 0:20 and the
// first hands over to it (MUSIC.md: "needs an Extend in Suno, or a loop at a phrase"). Check the join by ear once voiced.
const CUE = 104 * 30;
const total = CH07_FRAMES - LEAD;
const music = total <= CUE - 30
  ? [{src: 'music/tg_test_kitchen.mp3', volume: bed('tg_test_kitchen')}]
  : [{src: 'music/tg_test_kitchen.mp3', volume: bed('tg_test_kitchen'), to: CUE - 150, fadeOut: 45},
    {src: 'music/tg_test_kitchen.mp3', volume: bed('tg_test_kitchen'), from: CUE - 200, startFrom: 20 * 30}];

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_test_kitchens.wav" lead={LEAD} baton="The Turkey" batonWords={2} music={music}>
    <Body />
  </ChapterShell>
);

