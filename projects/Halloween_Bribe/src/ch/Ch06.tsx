// Chapter 6 · Sugar Goes to War. The ration book, five Halloweens with hardly any candy, pranks "help the enemy" (soap and
// grease callbacks), scrap drives, Chicago cancels Halloween; then the war ends, the baby boom, the suburbs, the candy pile
// ("that's a buffet"), the little-kid holiday, a quiet subscribe plug (ration-book callback), and a darkening last line
// into the Texas chapter. Music: b_newsreel for the war half, hb_suburbs_swing from "Then the war ended".
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch06_sugar_goes_to_war.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, PhotoCard, type TL, useScene} from '../kit/shell';
import {Desk} from '../kit/desk';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {CandyPile} from '../fx/CandyPile';
import {bed} from '../kit/levels';
import {MASKS} from '../masks';
import sub from '../../public/img/layers/sil/ch06_suburbs/layers.json';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);
const END = Math.ceil(N.duration * 30) + 54;
const WHITE = '#ffffff';

const BOOK = 'img/ch05/war_ration_book_one_sugar_1942.jpg';
const BOOK_TAG = 'OWI, 1942 · Library of Congress';

/** 0:00 · "This is a ration book": the book, then the sugar coupons at the counter; RATIONED + vocab bar. */
const Ration: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src={BOOK} x={110} y={90} w={780} rot={-2} at={0} filter="grayscale(1) contrast(1.25)" />
    <PhotoCard src="img/ch05/sugar_ration_coupons_1942.jpg" x={1010} y={140} w={800} h={560} rot={3} at={t.at('sugar became') - a - 2} pos="62% 55%" />
    <Note text="spring 1942" x={1080} y={760} size={58} rot={-4} at={t.at('spring of 1942') - a - 3} color={WHITE} />
    <Highlight text="RATIONED" x={120} y={740} size={92} at={t.at('rationed') - a} seed={61} rot={-2} />
    <Definition term="rationed" def="each family could only buy a set amount" at={t.at('meaning each') - a} x={120} y={868} w={1500} />
    <Tag text={BOOK_TAG} />
  </AbsoluteFill>
);

/** One drawn pumpkin with a count in it (coral: the five lost Halloweens are this scene's subject). */
const Pumpkin: React.FC<{x: number; y: number; n: number; at: number}> = ({x, y, n, at}) => {
  const g = useGFrame();
  const coral = usePal().subject;
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.4, 0.94, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 120, transform: `scale(${k})`}}>
      <svg width={120} height={120} style={{overflow: 'visible', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.6))'}}>
        <path d="M60,22 C63,12 68,8 74,6" stroke="#3b2a1c" strokeWidth={7} fill="none" strokeLinecap="round" />
        <ellipse cx={60} cy={66} rx={54} ry={44} fill={coral} stroke="#111" strokeWidth={4} />
        <path d="M40,26 C26,50 26,86 40,108 M80,26 C94,50 94,86 80,108" stroke="#111" strokeWidth={3} fill="none" opacity={0.55} />
      </svg>
      <div style={{position: 'absolute', left: 0, top: 30, width: 120, textAlign: 'center', fontFamily: JF.display, fontSize: 56, lineHeight: 1, color: '#111'}}>{n}</div>
    </div>
  );
};

const X0 = 300, STEP = 264, LINE_Y = 600;
const yx = (y: number) => X0 + (y - 1942) * STEP;

/** 0:11 · first on, last off: a 1942–1947 line; five October pumpkins count 1–5 on "five Halloweens". */
const FiveHalloweens: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  const draw = interpolate(g, [2, 14], [0, 1], clamp);
  const five = t.at('five Halloweens') - a;
  const span0 = yx(1942.3), span1 = interpolate(g, [2, t.at('in 1947') - a + 4], [yx(1942.3), yx(1947.45)], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="SUGAR" after="1942 – 1947" x={120} y={112} size={100} at={2} seed={62} rot={-2} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={span0} y={LINE_Y - 14} width={Math.max(0, span1 - span0)} height={28} fill="#f4efe6" opacity={0.22} />
        <line x1={X0 - 80} y1={LINE_Y} x2={X0 - 80 + (yx(1947) + 140 - X0) * draw} y2={LINE_Y} stroke={pal.mark} strokeWidth={6} strokeLinecap="round" />
        {[1942, 1943, 1944, 1945, 1946, 1947].map((y, i) => g >= 4 + i &&
          <line key={y} x1={yx(y)} y1={LINE_Y - 22} x2={yx(y)} y2={LINE_Y + 22} stroke={pal.mark} strokeWidth={6} strokeLinecap="round" />)}
      </svg>
      {[1942, 1943, 1944, 1945, 1946, 1947].map((y, i) => g >= 4 + i && (
        <div key={y} style={{position: 'absolute', left: yx(y) - 100, top: LINE_Y + 36, width: 200, textAlign: 'center', fontFamily: JF.display, fontSize: 54,
          color: y === 1947 ? '#f4efe6' : 'rgba(244,239,230,0.8)'}}>{y}</div>
      ))}
      <Note text="first on" x={yx(1942) - 90} y={330} size={52} rot={-4} at={4} color={WHITE} />
      <Arrow x1={yx(1942) - 10} y1={420} x2={yx(1942.3)} y2={LINE_Y - 30} bow={-20} at={8} />
      <Note text="last off" x={yx(1947) - 120} y={330} size={52} rot={-4} at={t.at('in 1947') - a - 3} color={WHITE} />
      <Arrow x1={yx(1947.3)} y1={420} x2={yx(1947.45)} y2={LINE_Y - 30} bow={20} at={t.at('in 1947') - a + 6} />
      {[0, 1, 2, 3, 4].map((i) => <Pumpkin key={i} x={yx(1942.83 + i)} y={LINE_Y - 110} n={i + 1} at={five + 2 + i * 5} />)}
      <Highlight text="FIVE HALLOWEENS" x={120} y={800} size={100} at={five + 2} seed={63} rot={-2} />
      <Note text="...hardly any candy" x={1150} y={820} size={58} rot={-4} at={t.at('hardly any candy') - a - 3} color={WHITE} />
    </AbsoluteFill>
  );
};

/** 0:19 · pranks help the enemy: the soap and the grease (callbacks), coral passing from one to the other. */
const Enemy: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const soap = t.at('soap') - a, grease = t.at('grease') - a, war = t.at('The war needed') - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="halloween, pulled way back" x={120} y={118} size={56} rot={-3} at={t.at('pulled way back') - a - 3} color={WHITE} />
      <Highlight text="PRANKS" after="HELP THE ENEMY" x={120} y={235} size={96} at={t.at('pranks helped') - a} seed={64} rot={-2} />
      <Prop name="soap_bar" x={150} y={420} w={520} at={soap} rot={-6} />
      <Prop name="soap_bar" x={150} y={420} w={520} at={soap} out={grease} rot={-6} coral trace />
      <Note text="windows" x={250} y={840} size={58} rot={-4} at={t.at('smear') - a - 3} />
      <Prop name="grease_can" x={1320} y={390} w={400} at={grease} rot={4} coral trace />
      <Note text="streetcar tracks" x={1250} y={840} size={58} rot={-4} at={t.at('tracks') - a - 3} />
      <Note text="the war" x={800} y={560} size={68} rot={-4} at={war - 3} color={WHITE} />
      <Note text="needed those." x={760} y={660} size={68} rot={-4} at={war + 6} color={WHITE} />
      <Arrow x1={690} y1={640} x2={770} y2={630} bow={-14} at={war + 4} />
      <Arrow x1={1270} y1={640} x2={1150} y2={630} bow={14} at={war + 6} />
    </AbsoluteFill>
  );
};

/** 0:30 · scrap-metal drives on Halloween night: the old junk car and an iron gate go to the war. */
const Scrap: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Highlight text="SCRAP-METAL DRIVES" x={120} y={112} size={96} at={t.at('scrapmetal') - a} seed={65} rot={-2} />
    <Prop name="junk_car" x={900} y={300} w={860} at={2} from="top" />
    <Prop name="iron_gate" x={300} y={430} w={760} rot={-7} at={t.at('drives') - a} from="top" coral trace />
    <Note text="on halloween night, instead" x={140} y={830} size={60} rot={-3} at={t.at('Halloween night') - a - 3} color={WHITE} />
  </AbsoluteFill>
);

/** A drawn calendar leaf: OCTOBER 31, crossed out in coral at `x`. */
const Calendar: React.FC<{at: number; xAt: number}> = ({at, xAt}) => {
  const g = useGFrame();
  const coral = usePal().subject;
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0.85, 1], clamp);
  const p1 = interpolate(g, [xAt, xAt + 5], [0, 1], clamp), p2 = interpolate(g, [xAt + 4, xAt + 9], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 1120, top: 210, width: 560, height: 620, transform: `rotate(3deg) scale(${k})`, opacity: Math.min(1, (g - at) / 3 + 0.3)}}>
      <div style={{position: 'absolute', inset: 0, background: '#ece6d8', boxShadow: '0 24px 44px rgba(0,0,0,0.7)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 560, height: 130, background: '#2a2620', color: '#ece6d8', fontFamily: JF.display, fontSize: 70,
        textAlign: 'center', lineHeight: '130px'}}>OCTOBER</div>
      <div style={{position: 'absolute', left: 0, top: 160, width: 560, textAlign: 'center', fontFamily: JF.display, fontSize: 340, lineHeight: 1, color: '#111'}}>31</div>
      <div style={{position: 'absolute', left: 0, top: 530, width: 560, textAlign: 'center', fontFamily: JF.mono, fontSize: 28, letterSpacing: 4, color: '#3a352c'}}>SATURDAY · 1942</div>
      <svg width={560} height={620} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d="M70,170 L490,560" stroke={coral} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p1} />
        <path d="M490,170 L70,560" stroke={coral} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p2} />
      </svg>
    </div>
  );
};

/** 0:33 · Chicago, 1942: the council votes to cancel Halloween; the dry aside. */
const Chicago: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Highlight text="CHICAGO, 1942" x={120} y={110} size={120} at={t.at('Chicago') - a} seed={66} rot={-2} />
    <Calendar at={t.at('city council') - a - 2} xAt={t.at('cancel Halloween') - a} />
    <Note text="city council voted:" x={140} y={400} size={60} rot={-3} at={t.at('voted') - a - 3} color={WHITE} />
    <Note text="cancelled for the war" x={140} y={500} size={74} rot={-4} at={t.at('cancel Halloween') - a - 2} dur={14} />
    <Note text="(did anybody tell the kids?)" x={150} y={760} size={54} rot={-3} at={t.at('actually told') - a - 3} color={WHITE} />
  </AbsoluteFill>
);

/** 0:44 · the war ends: the ration book again (callback), sugar back, soldiers back. */
const WarEnds: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const away = interpolate(f, [t.at('Sugar came back') - a, t.at('Sugar came back') - a + 24], [0, 1], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${away * 300}px, ${away * -20}px) rotate(${away * 6}deg)`, opacity: 1 - away * 0.55}}>
        <PhotoCard src={BOOK} x={600} y={230} w={700} rot={-2} at={0} filter="grayscale(1) contrast(1.25)" />
      </div>
      <Highlight text="THE WAR ENDS" x={120} y={112} size={110} at={t.at('war ended') - a} seed={67} rot={-2} />
      <Note text="sugar: back" x={140} y={800} size={68} rot={-4} at={t.at('Sugar came back') - a - 3} />
      <Note text="soldiers: back" x={760} y={810} size={68} rot={-4} at={t.at('soldiers') - a - 3} color={WHITE} />
      <Tag text={BOOK_TAG} />
    </AbsoluteFill>
  );
};

/** 0:49 · BABY BOOM (vocab), then the brand-new suburb (HABS card). */
const Boom: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <Desk src="img/ch05/habs_belair_bowie_suburb_street.jpg" size={[1920, 1391]} box={[980, 400, 820, 594]} at={t.at('brandnew suburbs') - a - 2} rot={2} pos={[0.5, 0.55]}
    tag="HABS MD-1267 · Library of Congress">
    <Highlight text="BABY BOOM" x={120} y={100} size={120} at={t.at('baby boom') - a} seed={68} rot={-2} />
    <Definition term="baby boom" def="the wave of births after the war: millions of new kids" at={t.at('millions') - a} x={120} y={280} w={1500} />
    <Note text="brand-new suburbs" x={140} y={560} size={68} rot={-4} at={t.at('brandnew suburbs') - a - 3} />
    <Note text="(a Levitt suburb, Bowie, Md.)" x={150} y={680} size={46} rot={-3} at={t.at('brandnew suburbs') - a + 10} color={WHITE} />
  </Desk>
);

/** 0:54 · the suburbs painting: houses close together, door to door. */
const Suburbs: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="ch06_suburbs" size={sub.size as [number, number]} glowLayer={sub.glowLayer} a={0} b={b - a + 8} cam={{z: [1.04, 1.12], x: [30, -30]}} fade={4} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 34%)'}} />
    <Note text="houses close together" x={120} y={118} size={62} rot={-3} at={t.at('houses sat') - a - 3} color={WHITE} />
    <Note text="every door: a few steps from the next" x={140} y={222} size={62} rot={-3} at={t.at('every front door') - a - 3} />
  </AbsoluteFill>
);

/** 0:58 · "five years old with a pillowcase… That's a buffet." The candy physics pile (keeps its own note). */
const Buffet: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    {/* the pile's own "that's a buffet." note writes 128 frames after the first candy falls: land it on "buffet" */}
    <CandyPile at={t.at('buffet') - a + 2 - 128} />
    <Note text="age five + one pillowcase" x={140} y={130} size={58} rot={-3} at={t.at('five years old') - a - 2} color={WHITE} />
    <Note text="not a neighborhood..." x={160} y={300} size={58} rot={-3} at={t.at('not a neighborhood') - a - 3} color={WHITE} />
  </AbsoluteFill>
);

/** 1:03 · candy companies, kids' magazines, Donald Duck (a note only): the 1964 masked kids, the monster mask in coral. */
const Noticed: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <Desk src="img/ch05/kids_halloween_masks_nywts_1964.jpg" size={[3000, 2028]} box={[960, 330, 880, 600]} at={0} rot={2} name="kids" mask={MASKS.kids}
    traceAt={t.at('noticed') - a} tag="Angelo Rizzuto, 1964 · Library of Congress">
    <Highlight text="CANDY COMPANIES NOTICED" x={110} y={112} size={84} at={t.at('Candy companies') - a} seed={69} rot={-2} />
    <Note text="kids' magazines:" x={110} y={360} size={56} rot={-3} at={t.at('magazines') - a - 3} color={WHITE} />
    <Note text="trick-or-treat stories" x={130} y={450} size={56} rot={-3} at={t.at('ran trickortreat') - a - 3} />
    <Note text="even donald duck" x={110} y={620} size={56} rot={-3} at={t.at('Donald Duck') - a - 3} color={WHITE} />
    <Note text="got a cartoon (1952)" x={130} y={710} size={56} rot={-3} at={t.at('trickortreat cartoon') - a - 3} />
  </Desk>
);

/** 1:10 · "By the early 1950s, Halloween belonged to little kids." Beaumont, 1950. */
const LittleKids: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <Desk src="img/ch05/beaumont_trick_or_treat_1950.png" size={[960, 1325]} box={[140, 90, 640, 760]} at={0} rot={-2} pos={[0.5, 0]} tag="Beaumont, Calif., 1950">
    <Loop cx={300} cy={580} rx={170} ry={250} at={t.at('little kids') - a + 2} seed={6} tilt={-4} width={6} />
    <Highlight text="EARLY 1950s" x={900} y={200} size={110} at={t.at('early 1950s') - a} seed={70} rot={-2} />
    <Note text="halloween belonged to" x={920} y={440} size={64} rot={-3} at={t.at('belonged') - a - 3} color={WHITE} />
    <Highlight text="LITTLE KIDS" x={920} y={580} size={120} at={t.at('little kids') - a} seed={71} rot={-2} />
  </Desk>
);

/** 1:14 · the plug, quietly: a small teal "subscribe" and the ration book again on "unlike 1943". */
const Plug: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="quick thing..." x={220} y={300} size={52} rot={-3} at={t.at('Quick thing') - a - 3} color={WHITE} />
    <Note text="subscribe" x={240} y={420} size={72} rot={-4} at={t.at('hit subscribe') - a - 2} />
    <Note text="(free)" x={300} y={540} size={48} rot={-3} at={t.at('free') - a - 3} color={WHITE} />
    <PhotoCard src={BOOK} x={1000} y={300} w={640} rot={4} at={t.at('unlike 1943') - a - 2} filter="grayscale(1) contrast(1.25)" />
    <Note text="keep your sugar." x={1080} y={820} size={56} rot={-3} at={t.at('your sugar') - a - 3} color={WHITE} />
    {useGFrame() >= t.at('unlike 1943') - a - 2 && <Tag text={BOOK_TAG} />}
  </AbsoluteFill>
);

/** 1:23 · "Halloween had never been safer. Which is exactly when parents got scared." The suburb again, going dark. */
const Safer: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const dark = interpolate(f, [t.at('Which is exactly') - a, t.at('got scared') - a + 40], [0.15, 0.82], clamp);
  return (
    <AbsoluteFill>
      <SilScene name="ch06_suburbs" size={sub.size as [number, number]} glowLayer={sub.glowLayer} a={0} b={b - a + 30} cam={{z: [1.12, 1.2], x: [-30, -60]}} fade={4} flicker={0.2} />
      <AbsoluteFill style={{background: `rgba(4,8,10,${dark})`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 36%)'}} />
      <Note text="never safer." x={140} y={118} size={70} rot={-3} at={t.at('never been safer') - a - 3} />
      <Note text="...which is exactly when parents got scared." x={150} y={240} size={60} rot={-3} at={t.at('when parents') - a - 3} color={WHITE} dur={16} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {five: at('And it was the last') - 1, enemy: at('So Halloween got') - 1, scrap: at('Some towns held') - 1, chicago: at('And Chicago') - 1,
    ends: at('Then the war ended') - 1, boom: at('Then came the baby') - 1, sub: at('where the houses') - 1, buffet: at("If you're five") - 1,
    noticed: at('Candy companies') - 1, little: at('By the early') - 1, plug: at('Quick thing') - 1, safer: at('Halloween had never') - 1};
  const S = (from: number, node: React.ReactNode): [number, React.ReactNode] => [from, <Sequence from={from} layout="none">{node}</Sequence>];
  const cuts: [number, React.ReactNode][] = [
    [0, <Ration t={t} a={0} />],
    S(c.five, <FiveHalloweens t={t} a={c.five} />),
    S(c.enemy, <Enemy t={t} a={c.enemy} />),
    S(c.scrap, <Scrap t={t} a={c.scrap} />),
    S(c.chicago, <Chicago t={t} a={c.chicago} />),
    S(c.ends, <WarEnds t={t} a={c.ends} />),
    S(c.boom, <Boom t={t} a={c.boom} />),
    S(c.sub, <Suburbs t={t} a={c.sub} b={c.buffet} />),
    S(c.buffet, <Buffet t={t} a={c.buffet} />),
    S(c.noticed, <Noticed t={t} a={c.noticed} />),
    S(c.little, <LittleKids t={t} a={c.little} />),
    S(c.plug, <Plug t={t} a={c.plug} />),
    S(c.safer, <Safer t={t} a={c.safer} b={END} />),
  ];
  const scene = useScene(cuts);
  const stamps = ['rationed', 'five Halloweens', 'pranks helped', 'scrapmetal', 'Chicago', 'war ended', 'baby boom', 'Candy companies', 'early 1950s', 'little kids'];
  const notes = ['spring of 1942', 'hardly any candy', 'pulled way back', 'smear', 'tracks', 'The war needed', 'Halloween night', 'voted', 'cancel Halloween', 'actually told',
    'Sugar came back', 'soldiers', 'brandnew suburbs', 'houses sat', 'every front door', 'five years old', 'not a neighborhood', 'magazines', 'ran trickortreat',
    'Donald Duck', 'trickortreat cartoon', 'belonged', 'Quick thing', 'hit subscribe', 'free', 'your sugar', 'never been safer', 'when parents'];
  return (
    <AbsoluteFill>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      <Sfx at={0} src="sfx/paper_rustle.wav" volume={0.35} />
      <Sfx at={c.five + 2} src="sfx/stamp.wav" volume={0.28} />
      {stamps.map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.28} />)}
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={`p${i}`} at={at('five Halloweens') + 2 + i * 5} src="sfx/tick.wav" volume={0.4} />)}
      {notes.map((p) => <Sfx key={p} at={at(p) - 5} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('cancel Halloween')} src="sfx/marker_tick.wav" volume={0.35} />
      <Sfx at={at('unlike 1943') - 2} src="sfx/page_turn.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

const TM = makeTimeline(N, 30);
const HANDOVER = TM.at('Then the war ended');

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_sugar_goes_to_war.wav" lead={LEAD}
    music={[
      {src: 'music/b_newsreel.mp3', volume: bed('b_newsreel'), to: HANDOVER + 8, fadeOut: 36},
      // the swing fades out under the last line so the chapter goes dark and quiet into Texas
      {src: 'music/hb_suburbs_swing.mp3', volume: bed('hb_suburbs_swing'), from: HANDOVER - 6, to: TM.at('got scared') + 30, fadeOut: 75},
    ]}>
    <Body />
  </ChapterShell>
);
