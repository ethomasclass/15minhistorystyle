// Chapter 7 · The test kitchens. Sweet potatoes, a marshmallow tin and a 1910s recipe booklet land on the desk (Flow stand-in
// props, tagged "illustration": never the real Angelus booklet; the real 1920-22 Angelus grocery ads are the evidence), the booklet
// on a 1910s ad plate (the chapter's one guided pan lands on the recipe, paraphrased in our own type, as it is said), Janet McKenzie
// Hill as a cooking-school table with her name in type, Marcus Urann as scoop, barrel, pot and can with his name in type, the cranberry can paid off on "Because it IS the can" (cran frame 6 held, a loupe on the ridges), 1955 in the
// second person (a kitchen diorama, the notes as your shopping list), a fast 1954/1955 montage (a recipe card, then Dorcas
// Reilly as a test-kitchen counter, a recipe card and an apron, her name in type; everything drops in on its own, no hands), the casserole state sheet (casserole -> three cans), the third mock morph with the MOCK tape, and the can
// landing on the collage board. Coral-desk flashes (kit/tg_desk_map): "Because it IS the can" (a cut-in on frame 6, then the
// ridges loupe on teal) and the MOCK tape cut-in. Scenes are timed to words (script/ch07_test_kitchens.txt). No placeholders remain (PLACEHOLDERS is empty).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Img, staticFile} from 'remotion';
import words from '../../public/audio/ch07_test_kitchens.words.json';
import {clamp} from '../lib/anim';
import {Highlight, INK, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {bed} from '../kit/levels';
import {ChapterShell, chapterFrames, hasFile, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {hold, readEnd} from '../lib/timing';
import {type Box, Slip, Swipe} from '../kit/vox';
import {TgPrint} from '../kit/tg_placeholder';
import {Clip, Cut, CUT_COLOUR, flowH, flowSrc, type FlowName, States} from '../kit/tg_cut';
import {DropDeal, type DropDealCard, DropIn, type From} from '../kit/tg_drop';
import {COLOUR_DOC, PageScrap} from './ch34/parts';
import {TgBoard} from '../kit/tg_board';
import {CutIn, DeskScene, rgba, useMarks} from '../kit/tg_desk';
import {CORAL, Cran, cranMap, Loupe, MockTape, type Placeholder, RecipeCard, tornPct} from '../kit/tg_late';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

// ------------------------------------------------------------------ the plates and the props
/** The two Flow ad plates (no text on them: our type goes on their blank panels). */
const PLATE = 'img/flow/tg_adplate_1910s.png';
const PLATE50 = 'img/flow/tg_adplate_1950s.png';
const PLATE_SIZE: [number, number] = [2880, 1080];

/** Every placeholder in this chapter, for the asset swap: none. The four real people / documents that were placeholders
 *  (the 1917 Angelus booklet, Janet McKenzie Hill, Marcus Urann, Dorcas Reilly) are not faked: each beat is built on Flow stand-in
 *  props with the name in our type and an "illustration" tag, and never claims to show the person or the document. */
export const PLACEHOLDERS: Placeholder[] = [];

const TAG_BOOKLET = 'Illustration · recipe paraphrased from the Angelus Marshmallows booklet, 1917';

/** A Flow prop cut-out dropped onto the desk on its own (kit/tg_drop DropIn: contact shadow at rest), natural aspect, `w` wide. */
const Prop: React.FC<{name: FlowName; at: number; x: number; y: number; w: number; rot?: number; from?: From; children?: React.ReactNode}> = ({name, at, x, y, w, rot, from, children}) => (
  <DropIn at={at} x={x} y={y} rot={rot} from={from}>
    <div style={{position: 'relative', width: w, height: flowH(name, w)}}>
      <Img src={staticFile(flowSrc(name))} style={{display: 'block', width: w, height: flowH(name, w), filter: CUT_COLOUR}} />
      {children}
    </div>
  </DropIn>
);

/** A name set in our type (never handwriting): the name in Abril, a mono role after it, on a dark box. Fades in over 6 frames. */
const NameType: React.FC<{name: string; role: string; x: number; y: number; at: number; size?: number}> = ({name, role, x, y, at, size = 50}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div data-tx style={{position: 'absolute', left: x, top: y, opacity: interpolate(g, [at, at + 6], [0, 1], clamp), background: 'rgba(13,12,9,0.82)', padding: '12px 22px 10px',
      whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', gap: 16}}>
      <span style={{fontFamily: JF.display, fontSize: size, lineHeight: 1, color: '#f4efe6'}}>{name}</span>
      <span style={{fontFamily: JF.mono, fontSize: Math.round(size * 0.46), letterSpacing: 3, color: '#2FE0C4', textTransform: 'uppercase'}}>· {role}</span>
    </div>
  );
};

/** Steam off a pot, stepped with the desk (12 drawings a second): three soft puffs rising and fading, from frame `at`. */
const Steam: React.FC<{x: number; y: number; at: number; w?: number}> = ({x, y, at, w = 260}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const q = (((g - at) / 42 + i / 4) % 1 + 1) % 1;
        const px = x + (i - 1.5) * (w / 5) + Math.sin((g + i * 30) / 14) * 14;
        const r = 40 + 50 * q;
        return <div key={i} style={{position: 'absolute', left: px - r, top: y - q * 200 - r, width: r * 2, height: r * 2, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 70%)', opacity: Math.sin(q * Math.PI) * Math.min(1, (g - at) / 10)}} />;
      })}
    </>
  );
};

// ------------------------------------------------------------------ the scans that have landed (CREDITS.md; line boxes from the .json / measured)
/** Piggly Wiggly price list, Albuquerque Morning Journal, 28 Oct 1922 (Chronicling America): "CRACKER JACKS" over "ANGELUS MARSHMALLOWS". */
const AD22 = {src: 'img/arch/angelus-marshmallows-cracker-jacks-piggly-wiggly-ad-1922.jpg', size: [1675, 2069] as [number, number], crop: [470, 966, 1150, 152] as Box,
  cj: [500, 972, 500, 46] as Box, angelus: [[500, 1016, 930, 46], [500, 1060, 930, 46]] as Box[],
  tag: 'Piggly Wiggly ad, Albuquerque Morning Journal, Oct. 28, 1922 · Library of Congress'};
/** Sanitary Grocery Co. ad, Washington Times, 8 Oct 1920: "Angelus Marshmallows ... 12½c" on the shelf list. */
const AD20 = {src: 'img/arch/sanitary-grocery-ad-angelus-marshmallows-knox-gelatine-washington-times-1920.jpg', size: [2600, 3805] as [number, number],
  crop: [950, 2090, 1530, 420] as Box, angelus: [976, 2276, 489, 68] as Box,
  tag: 'Sanitary Grocery Co. ad, Washington Times, Oct. 8, 1920 · Library of Congress'};
// (The 1959 LOOK 'Miracle Kitchen' photograph, img/arch/look-miracle-kitchen-1959-woman-pantry-cans.jpg, sat over the placeholder
// diorama; the drawn kitchen now holds the frame alone. The scan is still in public/ if a beat wants it.)

// ------------------------------------------------------------------ 1917
/** The sweet potatoes land on the desk, then a marshmallow tin on "a marshmallow brand", then a recipe booklet of the period on
 *  "recipe booklet". All three are Flow props, tagged as an illustration: the booklet is never presented as the Angelus booklet. */
const Booklet: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="tg_sweet_potato_dish" at={Math.max(a + 4, t.at('sweet potatoes.'))} x={180} y={610} w={660} rot={-2} from={[-700, 420, 18]} />
    <Prop name="tg_marshmallow_tin" at={t.at('a marshmallow brand')} x={1330} y={540} w={420} rot={3} from={[600, 500, 22]} />
    <Prop name="tg_booklet_1910s" at={t.at('recipe booklet.')} x={880} y={170} w={580} rot={-4} />
    <Highlight text="1917" x={170} y={120} size={130} at={t.at('1917,')} seed={71} rot={-2} />
    <Slip text="Angelus marshmallows" x={180} y={330} at={t.at('a marshmallow brand') - 2} />
    <Slip text="a recipe booklet" x={220} y={450} at={t.at('Angelus put') - 2} rot={2} />
    <Tag text="Illustration · a recipe booklet of the 1910s, not the Angelus booklet" />
  </AbsoluteFill>
);

/** Who was behind it: the booklet on the desk, the cooking teacher they hired. */
const Hired: React.FC<{t: TL; a: number}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    {/* the two products side by side on a 1922 grocer's list */}
    <PageScrap src={AD22.src} size={AD22.size} box={AD22.crop} x={110} y={190} w={900} rot={-2} seed="a22" tag={AD22.tag}>
      <Swipe lines={AD22.angelus} from={-999} to={-998} seed="a22a" color="rgba(255,111,97,0.55)" />
      <Swipe lines={[AD22.cj]} from={t.at('Cracker') - 1} to={t.end('Cracker Jack.') + 3} seed="a22c" />
    </PageScrap>
    {/* a cooking-school demonstration table of the 1900s, with her name in type: not a portrait, and not claimed to be hers */}
    <Prop name="tg_cooking_school" at={t.at('well-known')} x={1260} y={250} w={500} rot={1} />
    <NameType name="Janet McKenzie Hill" role="cooking teacher" x={1000} y={720} at={t.at('Janet') - 2} size={46} />
    <Slip text="the same company made Cracker Jack" x={170} y={850} at={t.at('Cracker') - 2} rot={-2} size={56} />
    <Note text="hired: a well-known cooking teacher" x={170} y={470} size={46} rot={-3} at={t.at('well-known') - 2} color="#ffffff" />
    <Note text="writes the recipes" x={230} y={590} size={50} rot={-3} at={t.at('to write') - 2} />
    <Tag text="Illustration · a cooking-school table of the 1900s" />
  </AbsoluteFill>
);

/** The chapter's one guided pan (variant A): across the plate from the booklet to the recipe, landing on it as it is said; each
 *  word of the paraphrase lights up on its own spoken word, then the frame holds through "Was it a good idea? Maybe." */
const Recipe: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const land = t.at('baked with marshmallows') - 4;
  const x = interpolate(f, [a + 4, land], [0, 960], clamp); // linear: a guided move, no easing
  const real = hasFile(PLATE);
  const i0 = t.idx('baked with marshmallows on top.');
  const lit = (k: number) => g >= t.wordAt(i0 + k);
  const W = ['Sweet', 'potatoes,', 'baked', 'with', 'marshmallows', 'on', 'top.'];
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateX(${-x}px)`}}>
        <Img src={staticFile(PLATE)} style={{position: 'absolute', left: 0, top: 0, width: PLATE_SIZE[0], height: PLATE_SIZE[1], objectFit: 'cover', filter: 'saturate(0.85)'}} />
        {/* the generic 1910s booklet (a Flow prop, not the Angelus booklet) lying on the plate */}
        <Cut name="tg_booklet_1910s" x={230} y={270} w={640} rot={-3} land="none" />
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
      <Note text="...it's on your table" x={220} y={680} size={62} rot={-3} at={t.at('that booklet') - 2} />
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
    <Note text="sauce: for centuries" x={170} y={460} size={52} rot={-3} at={t.at('people have been') - 2} color="#ffffff" />
    <Tag text="Men scooping cranberries, Burlington County, N.J., 1938 · Arthur Rothstein, FSA · Library of Congress" />
  </AbsoluteFill>
);

/** Urann's problem as a drawn year: 52 weeks, fresh berries sell in a few of them; in a can, all of them. */
const Urann: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const drawAt = t.at('Fresh berries') - 2;
  const fewAt = t.at('few weeks');
  const canAt = t.at('cook them');
  const mk = useMarks();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {/* his year as props: the scoop (the harvest), the barrel (fresh berries), the pot (cook them down), then "in a can" */}
      <Prop name="tg_cranberry_scoop" at={t.at('Marcus')} x={1120} y={140} w={620} rot={-3} />
      <Prop name="tg_cranberry_barrel" at={t.at('Fresh berries')} x={1110} y={400} w={290} rot={1} from={[-600, -500, -20]} />
      <Steam x={1595} y={555} at={t.at('cook them')} w={300} />
      <Prop name="tg_cooking_pot_cranberries" at={t.at('His fix:')} x={1400} y={540} w={400} rot={-2} from={[500, 600, 22]} />
      <Stamp text="IN A CAN" x={1180} y={850} size={84} at={t.at('in a can.')} rot={-4} color={CORAL} />
      <Highlight text="1912" x={120} y={110} size={120} at={t.at('1912,')} seed={74} rot={-2} />
      <NameType name="Marcus Urann" role="cranberry grower" x={140} y={290} at={t.at('Marcus') - 2} size={48} />
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
      <Note text="put them in a can" x={190} y={830} size={62} rot={-3} at={t.at('cook them') - 2} color={pal.subject} />
      <Tag text="Illustration · a cranberry scoop, barrel and pot" />
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
    <Note text="takes the brand national" x={170} y={410} size={52} rot={-3} at={t.at('cooperative took') - 2} />
    <Highlight text="OCEAN SPRAY" x={120} y={590} size={104} at={t.at('Ocean Spray.')} seed={76} rot={-3} />
    <Tag text="Not Ocean Spray: Empress brand cranberry sauce, trademark registered 1910 · Library of Congress" />
  </AbsoluteFill>
);

// ------------------------------------------------------------------ the can, paid off
/** Plate centre and width for the payoff shots (screen px). */
const PAY = {cx: 1010, by: 930, pw: 740};

/** The cold open's question comes back while the log slides out (frames 1-5), stopping one frame short. */
const Question: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const q0 = t.at('Why is'), q1 = t.end('like a can?');
  const n = 1 + Math.min(4, Math.max(0, Math.floor(interpolate(g, [q0, q1], [0, 4.99], clamp))));
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Cran n={n} cx={1300} by={930} pw={700} />
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
  const [lx, ly] = m.at(588, 340); // the log's ridges (frame 6's own pixels)
  const [kx, ky] = m.at(1010, 450); // the empty can's ridges
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Cran n={6} {...PAY} />
      <Loupe layer={layer} cx={lx} cy={ly} r={170} zoom={2.6} to={[430, 360]} at={t.at('Those ridges') + 2} bow={50} />
      <Loop cx={kx} cy={ky} rx={110} ry={80} at={t.at("can's ridges.") + 2} seed={9} tilt={-20} />
      <Note text="same ridges." x={190} y={640} size={56} rot={-3} at={t.at('Those ridges') + 6} color="#ffffff" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 1955, you
/** "It's 1955. You're hosting.": our drawn 1950s kitchen (lookdev/tg_c.js tg_1950s_kitchen), from its first frame. */
const Hosting: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <Clip name="fifties_kitchen" at={a} />
    <Highlight text="1955" x={1400} y={100} size={120} at={t.at("It's 1955.")} seed={78} rot={-2} />
    <Slip text="you're hosting." x={1380} y={290} at={t.at("It's 1955.") - 2} size={60} />
    <Slip text="the in-laws: at four" x={1330} y={395} at={t.at('in-laws') - 2} size={54} rot={2} />
    <Tag text="Drawn scene" />
  </AbsoluteFill>
);

/** The same kitchen, carried on: she takes the casserole to the table while the list writes itself. `from` = where Hosting began. */
const Pantry: React.FC<{t: TL; a: number; from: number}> = ({t, from}) => (
  <AbsoluteFill>
    <Clip name="fifties_kitchen" at={from} />
    {useGFrame() < readEnd(t.at('in-laws') - 2, 'the in-laws: at four', 13) && <Slip text="the in-laws: at four" x={1330} y={395} at={-999} size={54} rot={2} />}
    {useGFrame() < readEnd(t.at("It's 1955.") - 2, "you're hosting.", 13) && <Slip text="you're hosting." x={1380} y={290} at={-999} size={60} />}
    {/* what you've got, as the voice lists it */}
    <Slip text="a new refrigerator" x={140} y={110} at={t.at('refrigerator,') - 2} size={52} rot={-2} />
    <Slip text="a pantry full of cans" x={170} y={215} at={t.at('pantry full') - 2} size={52} rot={1.5} />
    <Slip text="the magazine says:" x={140} y={320} at={t.at('magazine') - 2} size={52} rot={-2} />
    <Slip text="all in half an hour" x={180} y={425} at={t.at('do it all') - 2} size={56} rot={2} coral />
    <Tag text="Drawn scene" />
  </AbsoluteFill>
);

// ------------------------------------------------------------------ the montage
/** 1954, 1955: the Butterball card drops onto the desk on its own (no hands); then Campbell's test kitchen as props: a 1950s
 *  counter, a blank recipe card with Dorcas Reilly's name set on it in our type, an apron on its hook. No photograph of her. */
const Montage: React.FC<{t: TL; a: number}> = ({t}) => {
  const deals: DropDealCard[] = [
    {at: t.at('1954,'), x: 150, y: 130, rot: -4, card: <RecipeCard kicker="1954 · SWIFT AND COMPANY" title="Butterball turkey" lines={['on the market']} />},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <DropDeal deals={deals} />
      <Prop name="tg_test_kitchen_counter" at={t.at('In 1955,') + 2} x={330} y={610} w={1260} from={[0, 700, 0]} />
      <Slip text="Campbell's test kitchen, 1955" x={190} y={500} at={t.at('test kitchen') - 2} size={50} rot={-2} />
      <Prop name="tg_apron_hook" at={t.at('home economist')} x={1570} y={110} w={190} from={[300, -600, 12]} />
      <Prop name="tg_recipe_card_1955" at={t.at('Dorcas')} x={880} y={110} w={560} rot={3} from={[700, -420, -24]}>
        {/* her name set on the blank card in our type (never a facsimile of a real card) */}
        <div data-tx style={{position: 'absolute', left: 56, top: 74, color: '#2a2118', whiteSpace: 'nowrap'}}>
          <div style={{fontFamily: JF.mono, fontSize: 19, letterSpacing: 3, color: '#8a3a2c'}}>HOME ECONOMIST · CAMPBELL'S</div>
          <div style={{fontFamily: JF.display, fontSize: 64, lineHeight: 1.15, marginTop: 10}}>Dorcas Reilly</div>
        </div>
      </Prop>
      <Note text="things people already have" x={1010} y={520} size={52} rot={-3} at={t.at('recipe made') - 2} />
      <Tag text="Illustration · a 1950s test-kitchen counter" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the casserole
/** The casserole on the 1950s kitchen table (the 1950s ad plate, full frame, colour). Three registered state stills swapped like
 *  stop-motion: the full dish, half spooned out ("Green beans."), the empty dish ("cream of mushroom"); then a hard cut from the
 *  empty dish to what it was made of, three cans, a slip on each (the last lands on its own); MIX. BAKE. DONE. on the
 *  plate's blank panel; and the full dish back on its name. */
const Casserole: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const bAt = t.at('Green beans.') - 1, cAt = t.at('cream of mushroom') - 1, cans = t.at('Fried onions') - 1, back = t.at('Green bean casserole.') - 1;
  const ink = '#2a2118';
  const CX = 300, CY = 440, CW = 740; // the cans' picture (1150 x 610) on the table
  const can = (sx: number, sy: number): [number, number] => [CX + (sx * CW) / 1150, CY + (sy * CW) / 1150];
  return (
    <AbsoluteFill style={{background: INK}}>
      <Img src={staticFile(PLATE50)} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'saturate(0.85) contrast(1.02)'}} />
      <States srcs={['s2_casserole_a', 's2_casserole_b', 's2_casserole_c']} at={[a + 1, bAt, cAt]} x={150} y={370} w={1040} out={cans} />
      <Cut name="tg_three_cans" x={CX} y={CY} w={CW} at={cans} out={back} land="slap" />
      {g >= cans && g < back && (
        <>
          <Slip text="green beans" x={can(161, 303)[0] - 110} y={can(161, 303)[1] - 20} at={cans + 2} size={46} rot={-3} />
          <Slip text="cream of mushroom soup" x={can(565, 357)[0] - 150} y={can(565, 357)[1] + 60} at={cans + 5} size={44} rot={2} />
          <Slip text="fried onions" x={can(971, 439)[0] - 90} y={can(971, 439)[1] - 10} at={cans + 8} size={46} rot={-2} coral />
        </>
      )}
      <States srcs={['s2_casserole_a']} at={[back]} x={150} y={370} w={1040} />
      <Stamp text="MIX." x={1400} y={250} size={96} at={t.at('Mix,')} rot={-4} color={ink} />
      <Stamp text="BAKE." x={1410} y={390} size={96} at={t.at('bake,')} rot={-2} color={ink} />
      <Stamp text="DONE." x={1420} y={530} size={96} at={t.at('done.')} rot={-5} color="#c2452f" />
      <Highlight text="GREEN BEAN CASSEROLE" x={170} y={110} size={84} at={t.at('Green bean casserole.')} seed={79} rot={-2} />
    </AbsoluteFill>
  );
};

/** "store-bought," over the MOCK flash, where MockHomemade's own copy will sit after it (the flash's left side is empty desk). */
const StoreBought: React.FC<{t: TL}> = ({t}) => <Note text="store-bought," x={150} y={640} size={56} rot={-3} at={t.at('Store-bought,') - 2} color="#ffffff" />;

/** The question carried over the payoff's cut-in until it has been read: the answer arrives beside it. */
const QuestionCarry: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <>
      {g < readEnd(t.at('Why is') - 2, 'why is it shaped') && <Note text="why is it shaped" x={150} y={300} size={70} rot={-3} at={-999} />}
      {g < readEnd(t.at('like a can?') - 2, 'like a can?') && <Note text="like a can?" x={200} y={430} size={70} rot={-3} at={-999} color={pal.subject} />}
    </>
  );
};

/** (`solo`: the picture and the tape only, for the MOCK flash's cut-in.) Twenty million a year, then the third mock, made in code
 *  from stills: the homemade pie sits on its cloth; the can simply swaps in on the same cloth (no hands), and the MOCK tape lands on "Mock". */
const MockHomemade: React.FC<{t: TL; a: number; solo?: boolean; after?: boolean}> = ({t, a, solo, after}) => {
  const pal = usePal();
  const mockAt = t.at('Mock homemade.');
  const swap = Math.max(a + 14, mockAt - 12);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {!solo && !after && <Stamp text="20 MILLION" x={120} y={170} size={140} at={t.at('twenty million')} rot={-3} />}
      {!solo && !after && <Note text="casseroles, every Thanksgiving" x={130} y={360} size={46} rot={-3} at={t.at('twenty million') - 2} />}
      {/* two registered stills on the same checked cloth: the lattice pie and its rolling pin, then a tin can; the can swaps in */}
      <States srcs={['m3_homemade_pie', 'm3_can']} at={[solo ? -999 : a + 2, swap]} x={700} y={80} w={1376} />
      <MockTape x={1150} y={400} at={mockAt} size={140} />
      {/* (in the flash this one is drawn in screen space, outside the cut-in: see StoreBought) */}
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
    hired: hold(at('The company') - 1, readEnd(at('Angelus put') - 2, 'a recipe booklet', 13)),
    recipe: hold(at('And one of them') - 1, readEnd(at('Janet') - 2, 'Janet McKenzie Hill · cooking teacher', 6), readEnd(at('to write') - 2, 'writes the recipes')),
    motive: at('But notice') - 1,
    berries: hold(at("Then there's") - 1, readEnd(at('that booklet') - 2, "...it's on your table")),
    urann: hold(at('But in 1912,') - 1, readEnd(at('people have been') - 2, 'sauce: for centuries')),
    ocean: hold(at('In 1941,') - 1, readEnd(at('cook them') - 2, 'put them in a can'), readEnd(at('cook them'), 'IN A CAN: ALL 52 WEEKS', 2), readEnd(at('in a can.'), 'IN A CAN', 6)),
    // Ocean Spray holds through "And that answers one of our questions." (its name lands late in the sentence)
    question: hold(at('And that answers') - 1, readEnd(at('Ocean Spray.'), 'OCEAN SPRAY', 7)),
    payoff: at('Because it IS') - 1,
    ridges: at('Those ridges') - 1,
    hosting: hold(at('Now jump') - 1, readEnd(at('Those ridges') + 6, 'same ridges.')),
    pantry: at("You've got") - 1,
    montage: hold(at('In 1954,') - 1, readEnd(at('do it all') - 2, 'all in half an hour', 13)),
    casserole: at('Green beans.') - 1,
    mock: hold(at("Campbell's says") - 1, readEnd(at('Green bean casserole.') - 1, 'GREEN BEAN CASSEROLE', 8)),
    mockFlash: at('Mock homemade.') - 1,
    mockAfter: at('dressed up') - 1,
    board: hold(at('And then they') - 1, readEnd(at('dressed up') - 2, "dressed up as Grandma's"), readEnd(at('Store-bought,') - 2, 'store-bought,')),
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
    [c.payoff, <><CutIn x={PAY.cx - 60} y={640} z={1.25}><Payoff t={t} a={c.payoff} /></CutIn><QuestionCarry t={t} /></>],
    [c.ridges, <Payoff t={t} a={c.ridges} />],
    [c.hosting, <Hosting t={t} a={c.hosting} />],
    [c.pantry, <Pantry t={t} a={c.pantry} from={c.hosting} />],
    [c.montage, <Montage t={t} a={c.montage} />],
    [c.casserole, <Casserole t={t} a={c.casserole} />],
    [c.mock, <MockHomemade t={t} a={c.mock} />],
    [c.mockFlash, <><CutIn x={1400} y={470} z={1.3}><MockHomemade t={t} a={c.mock} solo /></CutIn><StoreBought t={t} /></>],
    [c.mockAfter, <MockHomemade t={t} a={c.mock} after />],
    [c.board, <Board t={t} a={c.board} />],
  ]);
  // sound lists, kept next to the scenes: silent cuts; a stamp per title, stamp and tape; the near-silent marker per note; a tick per card
  const stamps = ['1917,', 'motive.', 'cranberry sauce.', '1912,', '1941,', 'Ocean Spray.', "It's 1955.", 'Mix,', 'bake,', 'done.', 'Green bean casserole.', 'twenty million', 'Mock homemade.'];
  const notes = ['well-known', 'to write', 'sell marshmallows', 'a hundred years', 'that booklet', 'American fruit', 'people have been', 'Marcus', 'His fix:', 'cook them',
    "growers'", 'cooperative took', 'answers', 'Why is', 'like a can?', 'refrigerator,', 'pantry full', 'magazine', 'do it all', 'recipe made', 'Store-bought,', 'dressed up'];
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

