// Chapter 8 · What They Walked Into (quiet): young farmers on both sides, the rifled musket and the Minié ball (drawn),
// new weapons with old tactics, disease in the camps, amputation, 750,000 dead (two in three of disease), letters home,
// Andersonville. Quiet palette: teal lines, bone titles, no coral, no jokes, fewer marks, longer holds; no medical imagery.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch08_walked_into.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Desk, DropCard} from '../kit/bs';
import {sizeOf} from '../kit/dk';
import {Person} from '../kit/figures';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene, Backdrop} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);

const BONE = '#EDE7DC';
const END = Math.ceil(N.duration * 30) + 60;
const UNION = 'img/ch08/union_soldier_with_rifle_musket_portrait_c1861.jpg';
const CONFED = 'img/ch08/confederate_soldier_with_musket_portrait_c1861.jpg';
const PLATE = 'img/ch08/springfield_rifle_musket_appendages_m1863_plate_1863.jpg';
const AIM = 'img/ch08/heth_target_practice_soldiers_aiming_plate_1858.jpg';
const VT = 'img/ch08/union_camp_2nd_vermont_camp_griffin_1861.jpg';
const COOK = 'img/ch08/camp_cooking_army_potomac_1865.jpg';
const CAMERON = 'img/ch08/union_camp_cameron_georgetown_may1861.jpg';
const LETTER_U = 'img/ch08/soldier_letter_washington_sept29_1861.jpg';
const LETTER_C = 'img/ch08/mother_letter_to_confederate_sons_c1861.jpg';
const ANDERSONVILLE = 'img/ch08/andersonville_southeast_view_riddle_aug1864.jpg';

/** Small mono caption under a card. */
const Caption: React.FC<{text: string; x: number; y: number; at: number; w?: number}> = ({text, x, y, at, w = 600}) => {
  const g = useGFrame();
  if (g < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: 'center', fontFamily: JF.mono, fontSize: 26, letterSpacing: 3, color: BONE, textTransform: 'uppercase',
    opacity: interpolate(g, [at, at + 6], [0, 1], clamp), textShadow: '0 2px 8px #000'}}>{text}</div>;
};

/** The biggest group on both sides: young farmers. Two tintype soldiers, traced only. */
const Farmers: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={UNION} size={sizeOf(UNION)} x={250} y={90} w={560} h={700} fx={1070} fy={1620} scale={0.4} rot={-2} at={-6}
      mask={MASKS.union_soldier} tint={null} traceAt={t.at('both sides') - 2} />
    <CropCard src={CONFED} size={sizeOf(CONFED)} x={1110} y={90} w={560} h={700} fx={1200} fy={1560} scale={0.4} rot={2} at={-3}
      mask={MASKS.confed_soldier} tint={null} traceAt={t.at('both sides') + 2} />
    <Caption text="Union" x={230} y={830} at={t.at('both sides')} />
    <Caption text="Confederate" x={1090} y={830} at={t.at('both sides') + 2} />
    <Note text="mostly young farmers" x={700} y={900} size={58} rot={-2} at={t.at('young farmers.') - 3} color={BONE} />
    <Tag text="Unidentified Union soldier, c. 1861 · Unidentified Confederate soldier, c. 1861 · Library of Congress" />
  </AbsoluteFill>
);

/** The rifle musket plate, lying across the top of the desk (the page is upright; the card turns it). */
const Plate: React.FC<{at: number}> = ({at}) => (
  <CropCard src={PLATE} size={sizeOf(PLATE)} x={860} y={-390} w={200} h={1240} fx={400} fy={2000} scale={0.4} rot={90} at={at}
    bw="grayscale(1) contrast(1.25) brightness(1.02)" />
);

const PLATE_TAG = 'Rifle musket and appendages, model 1863, U.S. War Dept. manual, 1863 · Internet Archive';

/** A drawn barrel seen from the side, with a cross-section ring at its breech end. Rifled: grooves inside, teal. */
const Barrel: React.FC<{at: number; rifled: boolean; y: number}> = ({at, rifled, y}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const col = rifled ? pal.mark : '#ffffff';
  const p = interpolate(g, [at, at + 10], [0, 1], clamp);
  const x0 = 300, x1 = 1000, r = 40, cx = 170;
  const grooves = rifled ? Array.from({length: 14}).map((_, i) => {
    const gx = x0 + 30 + i * 48;
    const show = interpolate(g, [at + 6 + i * 0.6, at + 8 + i * 0.6], [0, 1], clamp);
    return <path key={i} d={`M${gx},${y - r + 6} L${gx + 34},${y + r - 6}`} stroke={col} strokeWidth={3} opacity={0.75 * show} />;
  }) : null;
  const notches = rifled ? Array.from({length: 6}).map((_, i) => {
    const a = (i / 6) * Math.PI * 2 + (g - at) * 0.04;
    return <line key={i} x1={cx + Math.cos(a) * 40} y1={y + Math.sin(a) * 40} x2={cx + Math.cos(a) * 52} y2={y + Math.sin(a) * 52} stroke={col} strokeWidth={8} strokeLinecap="round" opacity={p} />;
  }) : null;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
      <path d={`M${x0},${y - r} L${x1},${y - r} M${x0},${y + r} L${x1},${y + r}`} stroke={col} strokeWidth={6} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={`M${x0},${y - r} L${x0},${y + r}`} stroke={col} strokeWidth={6} opacity={p} />
      {grooves}
      <circle cx={cx} cy={y} r={58} fill="none" stroke={col} strokeWidth={6} opacity={p} />
      <circle cx={cx} cy={y} r={40} fill="rgba(0,0,0,0.35)" stroke={col} strokeWidth={3} opacity={p} />
      {notches}
      <text x={cx} y={y + 100} textAnchor="middle" style={{fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, fill: BONE, opacity: p}}>INSIDE</text>
    </svg>
  );
};

/** A round ball leaving the smooth barrel and wobbling more and more as it flies. */
const Wobble: React.FC<{at: number; to: number; y: number}> = ({at, to, y}) => {
  const g = useGFrame();
  if (g < at) return null;
  const x0 = 1010, x1 = 1780;
  const k = interpolate(g, [at, to], [0, 1], clamp);
  const pathY = (x: number) => {
    const u = (x - x0) / (x1 - x0);
    return y + Math.sin(u * Math.PI * 4.5) * 70 * u + u * u * 40;
  };
  const xs = Array.from({length: 61}).map((_, i) => x0 + ((x1 - x0) * i) / 60).filter((x) => x <= x0 + (x1 - x0) * k);
  const bx = x0 + (x1 - x0) * k;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
      {xs.length > 1 && <polyline points={xs.map((x) => `${x.toFixed(1)},${pathY(x).toFixed(1)}`).join(' ')} fill="none" stroke="#ffffff" strokeWidth={4} strokeDasharray="14 12" opacity={0.8} />}
      <circle cx={bx} cy={pathY(bx)} r={22} fill="#d9d4ca" stroke="#111" strokeWidth={3} />
    </svg>
  );
};

/** A Minié ball leaving the rifled barrel on a straight line, a tight teal corkscrew behind it (the spin). */
const Spin: React.FC<{at: number; to: number; y: number}> = ({at, to, y}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const x0 = 1010, x1 = 1780;
  const k = interpolate(g, [at, to], [0, 1], {...clamp, easing: (u) => 1 - Math.pow(1 - u, 2)});
  const bx = x0 + (x1 - x0) * k;
  const xs: number[] = [];
  for (let x = x0; x <= bx - 34; x += 4) xs.push(x);
  const turn = (g - at) * 0.9;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
      {xs.length > 1 && <polyline points={xs.map((x) => `${x},${(y + Math.sin((x - x0) / 9) * 14).toFixed(1)}`).join(' ')} fill="none" stroke={pal.mark} strokeWidth={4} opacity={0.85} />}
      <g transform={`translate(${bx} ${y})`}>
        <path d="M -34,-17 L 4,-17 Q 30,-14 34,0 Q 30,14 4,17 L -34,17 Z" fill="#d9d4ca" stroke="#111" strokeWidth={3} />
        {[-26, -17, -8].map((dx, i) => <line key={i} x1={dx + Math.sin(turn + i) * 2} y1={-16} x2={dx - Math.sin(turn + i) * 2} y2={16} stroke="#5b544a" strokeWidth={3} />)}
      </g>
    </svg>
  );
};

/** The old smoothbore: a smooth tube; the ball wobbles. */
const Smoothbore: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Plate at={t.at('And they carried') - 2} />
    <Note text="a new weapon" x={160} y={370} size={52} rot={-3} at={t.at('new weapon.') - 3} color={BONE} />
    <Note text="the old smoothbore musket" x={160} y={470} size={50} rot={-2} at={t.at('The old smoothbore') - 3} color="#ffffff" />
    <Barrel at={t.at('smooth metal') - 2} rifled={false} y={640} />
    <Wobble at={t.at('its bullet')} to={t.at('wobbled.') + 22} y={640} />
    <Note text="it wobbles" x={1380} y={790} size={52} rot={-3} at={t.at('wobbled.') - 3} color="#ffffff" />
    <Tag text={PLATE_TAG} />
  </AbsoluteFill>
);

/** The new rifled musket: spiral grooves, the Minié ball spins; several times the range. */
const Rifled: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const mb = t.at('the Minié ball,');
  const hit = t.at('It hit');
  const bar = interpolate(g, [hit + 2, hit + 16], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g < mb && <Highlight text="RIFLED MUSKET" x={100} y={80} size={84} at={t.at('rifled musket')} seed={81} rot={-2} />}
      {g < mb && <Definition term="ri·fled mus·ket" def="a musket with spiral grooves cut inside its barrel" at={t.at('rifled musket') + 9} x={120} y={220} w={1300} />}
      {g >= mb && <Highlight text="MINIÉ BALL" x={100} y={80} size={84} at={mb} seed={82} rot={-2} />}
      {g >= mb && g < hit && <Definition term="Min·ié ball" def="a soft lead bullet whose hollow base spreads into the grooves" at={mb + 9} x={120} y={220} w={1300} />}
      <Barrel at={t.at('spiral grooves') - 2} rifled y={500} />
      <Spin at={t.at('spin') - 2} to={t.at('tight spiral.')} y={500} />
      <Note text="it spins, like a football's tight spiral" x={960} y={590} size={44} rot={-2} at={t.at('like a football') - 3} color="#ffffff" />
      {bar > 0 && (
        <>
          <div style={{position: 'absolute', left: 160, top: 770, fontFamily: JF.sans, fontWeight: 600, fontSize: 32, color: '#ffffff'}}>smoothbore</div>
          <div style={{position: 'absolute', left: 470, top: 782, width: 220 * Math.min(1, bar * 3), height: 24, background: '#ffffff'}} />
          <div style={{position: 'absolute', left: 160, top: 850, fontFamily: JF.sans, fontWeight: 600, fontSize: 32, color: pal.mark}}>rifled musket</div>
          <div style={{position: 'absolute', left: 470, top: 862, width: 900 * bar, height: 24, background: pal.mark}} />
          <div style={{position: 'absolute', left: 160, top: 930, fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, color: BONE, opacity: 0.8}}>HOW FAR IT HITS · NOT TO SCALE</div>
        </>
      )}
      <Note text="several times farther" x={1150} y={920} size={50} rot={-3} at={t.at('several times') - 3} color={BONE} />
      <Tag text="Diagram · a smoothbore barrel and a rifled barrel, not to scale" x={44} y={40} />
    </AbsoluteFill>
  );
};

/** Old tactics: long lines of men, shoulder to shoulder (Heth's target-practice plate, 1858; the page turned upright). */
const Tactics: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={AIM} size={sizeOf(AIM)} x={271} y={92} w={702} h={936} fx={1080} fy={2330} scale={0.36} rot={-90} at={t.at('But generals') - 2}
      bw="grayscale(1) contrast(1.3) brightness(0.98)" />
    <Note text="long lines of men" x={1150} y={190} size={52} rot={-2} at={t.at('long lines') - 3} color={BONE} />
    <Note text="shoulder to shoulder" x={1150} y={290} size={52} rot={-2} at={t.at('shoulder to') - 3} color={BONE} />
    <Note text="straight at the enemy" x={1150} y={390} size={52} rot={-2} at={t.at('marching') - 3} color={BONE} />
    <Note text="new weapons, old tactics" x={1110} y={600} size={52} rot={-3} at={t.at('New weapons,') - 3} dur={14} />
    <Note text="so the battles turned deadly" x={1120} y={760} size={44} rot={-2} at={t.at('so deadly.') - 4} color="#ffffff" />
    <Tag text="Soldiers aiming, from A System of Target Practice, U.S. War Dept., 1858 · Internet Archive" />
  </AbsoluteFill>
);

/** Disease was the biggest killer: a Union camp, winter 1861. */
const Disease: React.FC<{t: TL}> = ({t}) => (
  <Photo src={VT} size={sizeOf(VT)} fx={1500} fy={920} z0={1.18} z1={1.26} a={t.at("Bullets weren't") - 1} b={t.at('so they used') - 1} bw="grayscale(1) contrast(1.15) brightness(0.92)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'rgba(8,7,5,0.35)'}} />
        <Note text="bullets weren't the biggest killer" x={110} y={80} size={50} rot={-2} at={t.at("Bullets weren't") - 3} color="#ffffff" />
        <Highlight text="DISEASE" x={110} y={190} size={100} at={t.at('Disease was.')} seed={83} rot={-2} />
        <Note text="filthy camps" x={120} y={800} size={54} rot={-2} at={t.at('Camps were filthy.') - 3} color={BONE} />
        <Note text="doctors didn't know germs existed" x={120} y={890} size={50} rot={-2} at={t.at('Doctors') - 3} />
        <Tag text="Camp of the Second Vermont, Camp Griffin, 1861 · Library of Congress" x={44} y={40} />
      </>
    )}
  </Photo>
);

/** Camp life; the same unwashed tools, one patient after another. */
const Tools: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={COOK} size={sizeOf(COOK)} x={150} y={130} w={860} h={760} fx={860} fy={720} scale={0.68} rot={-2} at={t.at('so they used') - 2} />
    <Note text="the same unwashed tools" x={1110} y={300} size={52} rot={-2} at={t.at('the same unwashed') - 3} color={BONE} />
    <Note text="one patient after another" x={1110} y={410} size={52} rot={-2} at={t.at('one patient') - 3} color={BONE} />
    <Tag text="Camp cooking, Army of the Potomac, near City Point, Va., 1865 · Library of Congress" />
  </AbsoluteFill>
);

/** Amputation: the word and its reason, over a quiet camp (no surgical imagery). */
const Amputation: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={CAMERON} size={sizeOf(CAMERON)} x={260} y={470} w={1400} h={380} fx={980} fy={450} scale={0.98} rot={-1} at={t.at('When a') - 2}
      bw="grayscale(1) contrast(1.2) brightness(0.8)" />
    <Highlight text="AMPUTATION" x={110} y={100} size={96} at={t.at('amputation,')} seed={84} rot={-2} />
    <Definition term="am·pu·ta·tion" def="surgery to remove an arm or a leg" at={t.at('amputation,') + 9} x={130} y={260} w={1100} />
    <Note text="not carelessness" x={1180} y={110} size={52} rot={-3} at={t.at("wasn't carelessness.") - 3} color="#ffffff" />
    <Note text="before antibiotics, often the surest way to stop a deadly infection" x={130} y={900} size={40} rot={-1} at={t.at('Before antibiotics,') - 3} dur={18} color={BONE} />
    <Tag text="Camp Cameron, Georgetown, D.C., Harper's Weekly, May 25, 1861 · Library of Congress" x={44} y={40} />
  </AbsoluteFill>
);

/** 750,000 dead; two out of every three of disease. */
const Toll: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const two = t.at('two out');
  return (
    <AbsoluteFill>
      <Backdrop src="img/ch08/savage_station_field_hospital_gibson_1862.jpg" size={sizeOf('img/ch08/savage_station_field_hospital_gibson_1862.jpg')} a={t.at('750,000') - 1} side="none" dim={0.3} tag="James F. Gibson, Union field hospital at Savage Station, Va., 1862 · Library of Congress" />
      <Stamp text="750,000" x={560} y={140} at={t.at('750,000') - 1} size={200} color={BONE} rot={-1} />
      <Note text="soldiers died" x={640} y={360} size={56} rot={-2} at={t.at('would die.') - 4} color={BONE} />
      <Person x={700} y={860} h={280} color={pal.mark} at={two - 2} />
      <Person x={960} y={860} h={280} color={pal.mark} at={t.at('of every') - 2} />
      <Person x={1220} y={860} h={280} color={BONE} at={t.at('three') - 2} />
      <Caption text="disease" x={530} y={890} w={600} at={t.at('of disease,') - 2} />
      <Caption text="battle" x={1070} y={890} w={300} at={t.at('not battle.') - 2} />
      <Note text="two out of every three" x={1020} y={450} size={50} rot={-3} at={t.at('three') + 2} />
    </AbsoluteFill>
  );
};

/** Letters home, Union side. */
const LettersU: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Their letters') - 1}>
    <DropCard src={LETTER_U} x={300} y={70} w={470} rot={-3} at={t.at('Their letters') - 2} />
    <Note text="their letters home" x={900} y={150} size={56} rot={-2} at={t.at('Their letters') + 2} color={BONE} />
    <Note text="Union soldiers: saving the Union" x={900} y={330} size={48} rot={-2} at={t.at('saving the') - 3} color={BONE} />
    <Note text="later, more of them: ending slavery" x={900} y={440} size={48} rot={-2} at={t.at('ending slavery.') - 3} />
    <Tag text="Letter from a Union soldier, Washington, D.C., Sept. 1861 · Library of Congress" />
  </Desk>
);

/** Letters home, Confederate side; always short of food, shoes and uniforms. */
const LettersC: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Confederates wrote') - 1}>
    <DropCard src={LETTER_U} x={170} y={110} w={340} rot={-4} at={-99} />
    <DropCard src={LETTER_C} x={1330} y={60} w={430} rot={3} at={t.at('Confederates wrote') - 2} />
    <Note text="Confederates:" x={640} y={150} size={52} rot={-2} at={t.at('Confederates wrote') + 2} color={BONE} />
    <Note text="home" x={660} y={250} size={50} rot={-2} at={t.at('about home') - 3} color={BONE} />
    <Note text="independence" x={660} y={340} size={50} rot={-2} at={t.at('independence,') - 3} color={BONE} />
    <Note text="and often, slavery" x={660} y={430} size={50} rot={-2} at={t.at('often slavery.') - 3} />
    <Note text="always short of food, shoes and uniforms" x={300} y={880} size={50} rot={-2} at={t.at('always short') - 3} color="#ffffff" />
    <Tag text="Union soldier's letter, 1861 · A mother's letter to her Confederate soldier sons, 1861 · Library of Congress" />
  </Desk>
);

/** Andersonville, August 1864. Slow, long hold. */
const Andersonville: React.FC<{t: TL}> = ({t}) => (
  <Photo src={ANDERSONVILLE} size={sizeOf(ANDERSONVILLE)} fx={1516} fy={1150} z0={2.0} z1={2.1} a={t.at('And prison') - 1} b={END} vignette={0.6}
    bw="grayscale(1) contrast(1.1) brightness(0.95)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 35%)'}} />
        <Note text="prison camps were worse" x={110} y={80} size={50} rot={-2} at={t.at('And prison') - 3} color="#ffffff" />
        <Note text="Andersonville, southwest Georgia" x={110} y={170} size={46} rot={-2} at={t.at('Andersonville,') - 3} color={BONE} />
        <Stamp text="13,000" x={110} y={700} at={t.at('13,000') - 1} size={170} color={BONE} rot={-1} />
        <Note text="Union prisoners died" x={130} y={890} size={52} rot={-2} at={t.at('Union prisoners') - 3} color={BONE} />
        <Tag text="A. J. Riddle, Andersonville Prison, southeast view, Aug. 17, 1864 · Library of Congress" />
      </>
    )}
  </Photo>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Farmers t={t} />],
    [at('And they carried') - 1, <Smoothbore t={t} />],
    [at('The new rifled') - 1, <Rifled t={t} />],
    [at('But generals') - 1, <Tactics t={t} />],
    [at("Bullets weren't") - 1, <Disease t={t} />],
    [at('so they used') - 1, <Tools t={t} />],
    [at('When a') - 1, <Amputation t={t} />],
    [at('By the end,') - 1, <Toll t={t} />],
    [at('Their letters') - 1, <LettersU t={t} />],
    [at('Confederates wrote') - 1, <LettersC t={t} />],
    [at('And prison') - 1, <Andersonville t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['young farmers.', 'new weapon.', 'The old smoothbore', 'wobbled.', 'like a football', 'several times', 'long lines', 'shoulder to', 'marching', 'New weapons,', 'so deadly.',
    "Bullets weren't", 'Camps were filthy.', 'Doctors', 'the same unwashed', 'one patient', "wasn't carelessness.", 'Before antibiotics,', 'would die.', 'saving the',
    'ending slavery.', 'about home', 'independence,', 'often slavery.', 'always short', 'And prison', 'Andersonville,', 'Union prisoners'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume * 0.8} />)}
      {['rifled musket', 'the Minié ball,', 'Disease was.', 'amputation,'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.22} />)}
      {['750,000', '13,000'].map((c) => <Sfx key={c} at={at(c) - 1} src="sfx/tick_soft.wav" volume={0.35} />)}
      <Sfx at={at('Their letters') - 2} src="sfx/page_turn.wav" volume={0.35} />
    </>
  );
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_walked_into.wav" lead={LEAD} quiet music={[
    // w_aftermath runs 59 s; a grieving solo cello takes over for the rest of the chapter
    {src: 'music/w_aftermath.mp3', volume: 0.062, to: 56 * 30},
    {src: 'music/j_grief.mp3', volume: 0.071, from: 54 * 30},
  ]}>
    <Body />
  </ChapterShell>
);
