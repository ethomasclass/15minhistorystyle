// Chapter 7 · The test kitchens. The 1917 Angelus booklet on a 1910s ad plate (the chapter's one guided pan lands on the recipe as
// it is said), the cranberry can paid off on "Because it IS the can" (cran frame 6 held, a loupe on the ridges), 1955 in the
// second person (a kitchen diorama, the notes as your shopping list), a fast 1954/1955 montage of recipe cards dealt by the
// silhouette hand, the casserole state sheet (casserole -> three cans), the third mock morph with the MOCK tape, and the can
// landing on the collage board. Scenes are timed to words (script/ch07_test_kitchens.txt); placeholders are listed in PLACEHOLDERS.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch07_test_kitchens.words.json';
import {clamp} from '../lib/anim';
import {Highlight, INK, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, hasFile, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Slip} from '../kit/vox';
import {centreOf, TgBoard} from '../kit/tg_endboard';
import {CARD, CORAL, Cran, cranMap, type Deal, HandDeal, Loupe, MockTape, Morph, PH, type Placeholder, RecipeCard, tgBed, tornPct} from '../kit/tg_late';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------ assets still to come
const P = {
  plate: {file: 'img/flow/tg_adplate_1910s.png', what: '1910s magazine ad plate (Flow #11), 2880 x 1080: the booklet area left, a blank cream panel right; colour'},
  booklet: {file: 'img/arch/angelus_1917_booklet.jpg', what: 'Angelus marshmallow recipe booklet, 1917 (cover scan; colour)'},
  hill: {file: 'img/arch/janet_mckenzie_hill.jpg', what: 'Janet McKenzie Hill, portrait (bust cut-out)'},
  bog: {file: 'img/arch/cranberry_harvest.jpg', what: 'archival photo: a cranberry bog harvest, early 1900s'},
  urann: {file: 'img/arch/marcus_urann.jpg', what: 'Marcus Urann, portrait (bust cut-out)'},
  ocean: {file: 'img/arch/ocean_spray_1940s_ad.jpg', what: 'an Ocean Spray cranberry sauce ad or can label, 1940s (colour)'},
  dSky: {file: 'img/flow/d4_kitchen_window.png', what: 'diorama D4, plane a: window, lawn, picket fence'},
  dCab: {file: 'img/flow/d4_kitchen_cabinets.png', what: 'diorama D4, plane b: 1950s cabinets and a new refrigerator'},
  dHost: {file: 'img/flow/d4_kitchen_hostess.png', what: 'diorama D4, plane c: a hostess in profile at the counter (solid black)'},
  dFront: {file: 'img/flow/d4_kitchen_front.png', what: 'diorama D4, plane d: the counter, a casserole dish (coral) and a row of plain cans'},
  reilly: {file: 'img/arch/dorcas_reilly.jpg', what: 'Dorcas Reilly in the Campbell test kitchen (photo)'},
  casA: {file: 'img/flow/s2_casserole_a.png', what: 'state sheet S2, A: green bean casserole with fried onions, 1950s glass dish'},
  casB: {file: 'img/flow/s2_casserole_b.png', what: 'S2, B: the same dish, half spooned out'},
  casC: {file: 'img/flow/s2_casserole_c.png', what: 'S2, C: the dish empty beside three plain unlabelled 1950s cans'},
  m3a: {file: 'img/flow/m3_homemade_pie.png', what: 'morph M3, first frame: a homemade pie on a cloth, a rolling pin beside it'},
  m3b: {file: 'img/flow/m3_can.png', what: 'morph M3, last frame: a plain unlabelled tin can on the same cloth'},
} satisfies Record<string, Placeholder>;
const MORPH_DIR = 'img/flow/m3_mock_homemade';
const PLATE_SIZE: [number, number] = [2880, 1080];

/** Every placeholder in this chapter, for the asset swap. */
export const PLACEHOLDERS: Placeholder[] = [...Object.values(P), {file: `${MORPH_DIR}/frame_0000.png`, what: 'morph M3 as frames (12/s), first frame 0000'}];

const TAG_BOOKLET = 'Recipe paraphrased from the Angelus Marshmallows booklet, 1917';

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
    <PH {...P.booklet} x={150} y={170} w={420} h={600} rot={-4} filter="saturate(0.8)" />
    <PH {...P.hill} x={1330} y={150} w={440} h={600} />
    <Slip text="the same company made Cracker Jack" x={170} y={850} at={t.at('Cracker') - 2} rot={-2} size={56} />
    <Note text="Janet McKenzie Hill" x={690} y={260} size={56} rot={-3} at={t.at('Janet') - 2} color="#ffffff" />
    <Note text="a well-known cooking teacher" x={710} y={380} size={44} rot={-3} at={t.at('well-known') - 2} />
    <Note text="writes the recipes" x={730} y={480} size={44} rot={-3} at={t.at('write the recipes') - 2} />
    <Tag text="Angelus booklet, 1917 · Janet McKenzie Hill, portrait" />
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
        <PH {...P.plate} w={PLATE_SIZE[0]} h={PLATE_SIZE[1]} fit="cover" filter="saturate(0.85)" shadow={false} />
        <PH {...P.booklet} x={250} y={130} w={560} h={800} rot={-3} filter="saturate(0.8) contrast(1.05)" />
        {/* the paraphrase, set in our own type on the plate's blank panel (never presented as the booklet's words) */}
        <div style={{position: 'absolute', left: 2010, top: 300, width: 760}}>
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
        </div>
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
      <PH {...P.booklet} x={1240} y={160} w={500} h={710} rot={3} filter="saturate(0.8)" />
      <Highlight text="THE MOTIVE" x={130} y={150} size={110} at={t.at('motive.')} seed={72} rot={-2} />
      <Note text="sell marshmallows" x={160} y={340} size={74} rot={-3} at={t.at('sell marshmallows') - 2} color={pal.subject} />
      <Note text="a hundred years later..." x={160} y={560} size={52} rot={-3} at={t.at('a hundred years') - 2} color="#ffffff" />
      <Note text="...it's on your table" x={220} y={680} size={62} rot={-3} at={t.at('on your table') - 2} />
      <Tag text="Angelus Marshmallows recipe booklet, 1917" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the cranberry
const Berries: React.FC<{t: TL; a: number}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PH {...P.bog} x={880} y={150} w={920} h={640} rot={2} />
    <Highlight text="CRANBERRIES" x={120} y={140} size={96} at={t.at('cranberry sauce.')} seed={73} rot={-2} />
    <Note text="an American fruit" x={150} y={330} size={60} rot={-3} at={t.at('American fruit') - 2} />
    <Note text="sauce: for centuries" x={170} y={460} size={52} rot={-3} at={t.at('centuries.') - 2} color="#ffffff" />
    <Tag text="Cranberry harvest · archival photograph" />
  </AbsoluteFill>
);

/** Urann's problem as a drawn year: 52 weeks, fresh berries sell in a few of them; in a can, all of them. */
const Urann: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const drawAt = t.at('Fresh berries') - 2;
  const fewAt = t.at('few weeks');
  const canAt = t.at('in a can.');
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
                border: `2px solid ${can ? pal.mark : fresh ? pal.subject : 'rgba(47,224,196,0.35)'}`,
                background: can ? 'rgba(47,224,196,0.55)' : fresh ? 'rgba(255,111,97,0.85)' : 'transparent'}} />;
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
    <PH {...P.ocean} x={1060} y={130} w={700} h={800} rot={-2} filter="saturate(0.85)" />
    <Highlight text="1941" x={120} y={120} size={120} at={t.at('1941,')} seed={75} rot={-2} />
    <Note text="his growers' cooperative" x={140} y={300} size={52} rot={-3} at={t.at("growers'") - 2} color="#ffffff" />
    <Note text="takes the brand national" x={170} y={410} size={52} rot={-3} at={t.at('brand national.') - 2} />
    <Highlight text="OCEAN SPRAY" x={120} y={590} size={104} at={t.at('Ocean Spray.')} seed={76} rot={-3} />
    <Tag text="Ocean Spray advertisement, 1940s" />
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
      <Note text="same ridges." x={190} y={640} size={56} rot={-3} at={t.at("can's ridges.") + 6} color="#ffffff" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 1955, you
/** The 1950s kitchen diorama: four planes in parallax (a slow drift), placeholders until D4's planes exist. */
const Diorama: React.FC<{drift: number; z?: number; fx?: number; fy?: number}> = ({drift, z = 1, fx = 960, fy = 540}) => {
  const planes: [Placeholder, number, [number, number, number, number], number][] = [
    [P.dSky, 0.15, [-80, -40, 2080, 1160], 0.05],
    [P.dCab, 0.4, [-80, 150, 2080, 700], 0.14],
    [P.dHost, 0.7, [1120, 230, 420, 780], 0.24],
    [P.dFront, 1, [-80, 760, 2080, 360], 0.33],
  ];
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: INK}}>
      <AbsoluteFill style={{transform: `translate(${fx - fx * z}px, ${fy - fy * z}px) scale(${z})`, transformOrigin: '0 0'}}>
        {planes.map(([ph, depth, [x, y, w, h], tone], i) => (
          <PH key={i} {...ph} x={x + drift * depth} y={y} w={w} h={h} tone={tone} fit="cover" filter="none" shadow={i > 0} inset={x < 0 ? 130 : 14} />
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
      <Diorama drift={drift} z={1.3} fx={700} fy={860} />
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
/** State sheet S2, swapped like stop-motion replacement frames on the ingredient words: the dish -> half gone -> three cans. */
const Casserole: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const bAt = t.at('cream of mushroom'), cAt = t.at('Fried onions');
  const st = g >= cAt ? P.casC : g >= bAt ? P.casB : P.casA;
  const X = 680, Y = 140, Wd = 1140, Ht = 640;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PH {...st} x={X} y={Y} w={Wd} h={Ht} filter="saturate(0.9)" tone={st === P.casC ? 0.2 : st === P.casB ? 0.1 : 0} />
      {/* the three cans in state C: a label slip on each */}
      <Slip text="green beans" x={X + Wd * 0.5} y={Y + Ht * 0.22} at={cAt} size={48} rot={-3} />
      <Slip text="cream of mushroom soup" x={X + Wd * 0.42} y={Y + Ht * 0.44} at={cAt + 3} size={48} rot={2} />
      <Slip text="fried onions" x={X + Wd * 0.55} y={Y + Ht * 0.66} at={cAt + 6} size={48} rot={-2} coral />
      <Stamp text="MIX." x={130} y={200} size={96} at={t.at('Mix,')} rot={-4} />
      <Stamp text="BAKE." x={150} y={330} size={96} at={t.at('bake,')} rot={-2} />
      <Stamp text="DONE." x={170} y={460} size={96} at={t.at('done.')} rot={-5} color={pal.subject} />
      <Highlight text="GREEN BEAN CASSEROLE" x={130} y={850} size={88} at={t.at('Green bean casserole.')} seed={79} rot={-2} />
    </AbsoluteFill>
  );
};

/** Twenty million a year, then the third mock: the homemade pie becomes a can (morph M3), and the MOCK tape lands on "Mock". */
const MockHomemade: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  const mockAt = t.at('Mock homemade.');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Stamp text="20 MILLION" x={120} y={170} size={140} at={t.at('twenty million')} rot={-3} />
      <Note text="casseroles, every Thanksgiving" x={130} y={360} size={46} rot={-3} at={t.at('every Thanksgiving.') - 2} />
      <Note text="(Campbell's own count)" x={150} y={460} size={40} rot={-3} at={t.at('every Thanksgiving.') + 8} color="#ffffff" />
      <Morph a={P.m3a} b={P.m3b} dir={MORPH_DIR} from={Math.max(a + 10, mockAt - 90)} to={mockAt - 3} x={1000} y={170} w={800} h={600} />
      <MockTape x={1150} y={400} at={mockAt} size={140} />
      <Note text="store-bought," x={150} y={640} size={56} rot={-3} at={t.at('Store-bought,') - 2} color="#ffffff" />
      <Note text="dressed up as Grandma's" x={190} y={760} size={64} rot={-3} at={t.at('dressed up') - 2} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the board
/** The can lands on the board; the yarn from the Jell-O mould says "therefore"; the turkey's slot waits, with a question. */
const Board: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const [cx, cy] = centreOf('can');
  return (
    <TgBoard subject="can" cam={[[a, cx - 40, cy - 20, 1.5], [t.at('redesigned') - 4, 1560, 470, 1.4], [t.at('redesigned') + 16, 1560, 470, 1.4]]}
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
    hosting: at('Now jump') - 1,
    pantry: at("You've got") - 1,
    montage: at('In 1954,') - 1,
    casserole: at('Green beans.') - 1,
    mock: at("Campbell's says") - 1,
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
    [c.payoff, <Payoff t={t} a={c.payoff} />],
    [c.hosting, <Hosting t={t} a={c.hosting} />],
    [c.pantry, <Pantry t={t} a={c.pantry} />],
    [c.montage, <Montage t={t} a={c.montage} />],
    [c.casserole, <Casserole t={t} a={c.casserole} />],
    [c.mock, <MockHomemade t={t} a={c.mock} />],
    [c.board, <Board t={t} a={c.board} />],
  ]);
  // sound lists, kept next to the scenes: silent cuts; a stamp per title, stamp and tape; the near-silent marker per note; a tick per card
  const stamps = ['1917,', 'motive.', 'cranberry sauce.', '1912,', '1941,', 'Ocean Spray.', "It's 1955.", 'Mix,', 'bake,', 'done.', 'Green bean casserole.', 'twenty million', 'Mock homemade.'];
  const notes = ['Janet', 'well-known', 'write the recipes', 'sell marshmallows', 'a hundred years', 'on your table', 'American fruit', 'centuries.', 'Marcus', 'His fix:', 'in a can.',
    "growers'", 'brand national.', 'answers', 'Why is', 'like a can?', 'refrigerator,', 'pantry full', 'magazine', 'half an hour.', 'already have', 'every Thanksgiving.', 'Store-bought,', 'dressed up'];
  const ticks = [at('1954,'), at('In 1955,') + 2, at('Dorcas'), at('Fresh berries'), at('Those ridges') + 10];
  return (
    <>
      {scene}
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
  ? [{src: 'music/tg_test_kitchen.mp3', volume: tgBed('tg_test_kitchen')}]
  : [{src: 'music/tg_test_kitchen.mp3', volume: tgBed('tg_test_kitchen'), to: CUE - 150, fadeOut: 45},
    {src: 'music/tg_test_kitchen.mp3', volume: tgBed('tg_test_kitchen'), from: CUE - 200, startFrom: 20 * 30}];

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_test_kitchens.wav" lead={LEAD} music={music}>
    <Body />
  </ChapterShell>
);

