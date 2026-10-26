// Chapter 4 · Beef for Bosque Redondo. Goodnight and Loving drive about 2,000 cattle up the Pecos to Fort Sumner; why there:
// the Army was holding about 8,000 Diné (Navajo) people and hundreds of Mescalero Apache at Bosque Redondo. QUIET from
// "How did they get there?" to "the Army needed beef." (teal only, no coral, no jokes): the raids, Carleton's plan, Kit Carson's
// campaign, the Long Walk on the series map, the camp. Then, plainly: a famous cattle trail began as a way to feed a prison camp;
// $12,000 in gold; the chuck wagon as a drawn 3D cut-away (the lid folds down into a table); "hold onto Bosque Redondo".
// The Diné and Apache people appear only in their own photographs, as plain cards on the desk (no cut-outs, no masks, no coral).
// Sources: Goodnight from Prose and Poetry of the Live Stock Industry (1905, Internet Archive); Loving, Carleton, Kit Carson
// (C. D. Fredricks, NPG), the Signal Corps photographs of Fort Sumner (Commons); O'Sullivan's Canyon de Chelly and Erwin E. Smith's
// J.A. Ranch chuck wagon (Library of Congress); AI lithograph props (no tags).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch04_beef_for_bosque_redondo.words.json';
import {clamp} from '../lib/anim';
import {Note, useGFrame, useHand, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {bed} from '../kit/levels';
import {CircleMount} from '../samples/kit';
import {keys, Lift, ScrimTag, shake, SlapTitle, zkeys} from '../previews/fx';
import {Big, Counter, DeskCam, Float, Label, Lines, Print, Prop, Sounds, type SfxRow, Stage, Upright} from '../kit/ch04_extra';
import {Hand, MPin, MRegion, WestMap} from '../kit/ch01_extra';
import {MHerd, MTrail, TLINES, TPL} from '../kit/trails';
import {M4} from '../masks_ch04';
import {MLine, MRiver, MStandLabel, Quiet} from '../kit/ch456_extra';
import {WShots} from '../kit/ch07_extra';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = Math.ceil(N.duration * 30) + 60;
const CORAL = '#FF6F61';
const WHITE = '#ffffff';
const BONE = '#EDE7DC';

const I = {
  goodnight: 'img/ch04/b_goodnight_1905.jpg',
  loving: 'img/ch04/b_loving.jpg',
  hweeldi: 'img/ch04/b_hweeldi_fort_sumner.jpg',
  captives: 'img/ch04/navajo_captives_fort_sumner_1860s.jpg',
  carleton: 'img/ch04/b_carleton_crop.jpg',
  carson: 'img/ch04/b_kit_carson.jpg',
  canyon: 'img/ch04/b_canyon_de_chelly.jpg',
  ja: 'img/ch04/b_ja_chuck_wagon_print.jpg',
  longhorn: 'img/props/p2_longhorn.jpg',
  coins: 'img/props/p2_coin_stack.jpg',
  wagon: 'img/props/p4_chuck_wagon.jpg',
  saddle: 'img/props/p3_saddle.jpg',
  lariat: 'img/props/p3_lariat.jpg',
};
const Z = {
  goodnight: [820, 800] as [number, number],
  loving: [482, 600] as [number, number],
  hweeldi: [3840, 2133] as [number, number],
  captives: [1000, 385] as [number, number],
  carleton: [430, 480] as [number, number],
  carson: [1280, 2169] as [number, number],
  canyon: [3840, 2813] as [number, number],
  ja: [2050, 1660] as [number, number],
};
const TAG = {
  goodnight: 'Charles Goodnight · Prose and Poetry of the Live Stock Industry, 1905 · Internet Archive',
  pair: 'Goodnight: Prose and Poetry of the Live Stock Industry, 1905 · Loving, before 1867 · Wikimedia Commons',
  hweeldi: 'U.S. Army Signal Corps, Diné (Navajo) captives under guard, Fort Sumner, c. 1864 · Wikimedia Commons',
  captives: 'U.S. Army Signal Corps, Navajo captives at Fort Sumner, 1860s · Wikimedia Commons',
  carleton: 'Gen. James H. Carleton · Palace of the Governors Photo Archives · Wikimedia Commons',
  carson: 'Kit Carson, c. 1863 · C. D. Fredricks · National Portrait Gallery',
  canyon: "T. H. O'Sullivan, Canyon de Chelly, 1873 · Library of Congress",
  ja: 'Erwin E. Smith, J.A. chuck-wagon, getting dinner, 1907 · Library of Congress',
  map: "Map: Natural Earth outlines (today's state lines for reference); trail and Long Walk route approx.",
};

/** The Goodnight-Loving trail from Fort Belknap up the Pecos as far as Fort Sumner (its 7th control point). */
const GL_SUMNER = TLINES.goodnightLoving.slice(0, 7);
/** Diné homeland between the four sacred mountains (Blanca Peak, Mount Taylor, San Francisco Peaks, Hesperus), simplified;
 *  same Albers projection as tools/build_trails.py. */
const DINE = [[2042.3, 1528.2], [1917.1, 1523.6], [1826.3, 1540.3], [1699.0, 1584.5], [1579.2, 1632.4], [1514.6, 1751.6], [1613.6, 1794.3],
  [1742.7, 1788.8], [1862.1, 1776.8], [1974.6, 1675.5]];
/** The Pecos River (approx.), from above Santa Rosa down to the Rio Grande. */
const PECOS = [[2018.7, 1712.9], [2034.2, 1760.8], [2086.0, 1813.7], [2152.2, 1858.6], [2140.3, 1972.7], [2151.0, 2078.8], [2215.4, 2162.4],
  [2316.8, 2233.4], [2402.7, 2325.1], [2418.9, 2356.1]];

// ───────────────────────── the drive ─────────────────────────

/** 1 · 1866: Goodnight (coral) and Loving (plain) land on the desk. */
const Ranchers: React.FC = () => {
  const f = useCurrentFrame();
  const b = at('gathered');
  return (
    <AbsoluteFill>
      <DeskCam k={[[0, 20, 0.96, 0, 0, -2], [b, 14, 1.05, -20, 10, 0]]}>
        <Lift x={250} y={160} w={640} hgt={624} h={10} at={-99} rot={-3} seed={41}>
          <Print src={I.goodnight} size={Z.goodnight} x={0} y={0} w={640} at={-99} seed={41} mask={M4.goodnight} tint={0.45 * interpolate(f, [at('Goodnight') - 2, at('Goodnight') + 6], [0, 1], clamp)}
            traceAt={at('Goodnight') + 2} />
        </Lift>
      </DeskCam>
      <CircleMount src={I.loving} size={Z.loving} cx={1440} cy={560} r={230} fx={241} fy={290} scale={0.92} at={at('Oliver') - 2} />
      <SlapTitle text="1866" x={110} y={80} size={110} at={at('1866')} seed={71} />
      <Label text="Charles Goodnight" x={300} y={900} size={28} at={at('Charles') - 2} color={CORAL} />
      <Label text="Oliver Loving" x={1310} y={850} size={28} at={at('Oliver')} color={WHITE} />
      <Note text="two Texas ranchers" x={1130} y={150} size={56} rot={-3} at={at('ranchers') - 4} />
      <ScrimTag text={TAG.pair} />
    </AbsoluteFill>
  );
};

/** 2 · about 2,000 cattle: longhorns slap down on the desk at three depths, the number counts up. */
const Herd: React.FC = () => {
  const a = at('gathered') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 26, 1.02, 0, 0, 2], [at('along'), 22, 1.1, 30, -10, 0]]}>
        <Float x={980} y={120} w={520} hgt={520} h={8} at={at('about') - 2} rot={2} blur={2.2} seed={2}>
          <Prop src={I.longhorn} m={M4.longhorn} x={0} y={0} w={480} at={-99} />
        </Float>
        <Float x={1300} y={300} w={600} hgt={600} h={14} at={at('two', 2)} rot={-3} blur={1} seed={3}>
          <Prop src={I.longhorn} m={M4.longhorn} x={0} y={0} w={560} at={-99} />
        </Float>
        <Float x={820} y={420} w={760} hgt={700} h={22} at={at('thousand') } rot={1} seed={4}>
          <Prop src={I.longhorn} m={M4.longhorn} x={0} y={0} w={720} at={-99} />
        </Float>
      </DeskCam>
      <Label text="the herd" x={140} y={250} size={28} at={at('about') - 2} />
      <Counter prefix="≈ " to={2000} at={at('two', 2) - 2} dur={18} x={130} y={300} size={170} />
      <Lines x={150} y={500} size={64} rows={[{text: 'Texas cattle', at: at('cattle') - 2}, {text: '→ driven west', at: at('drove') - 2}]} />
    </AbsoluteFill>
  );
};

/** 3 · along the Pecos to Fort Sumner: the trail draws on (coral) with a longhorn walking it; "Why there?". */
const Pecos: React.FC = () => {
  const a = at('along') - 1;
  const b = at('Because') - 1;
  const ks = [{f: a, x: 2420, y: 2060, z: 1.05, tilt: 46, rot: -4}, {f: at('Fort Sumner'), x: 2300, y: 1990, z: 1.3, tilt: 50, rot: 0}, {f: b, x: 2200, y: 1900, z: 1.75, tilt: 52, rot: 2}];
  const t0 = a + 4;
  const dur = at('Fort Sumner') - t0;
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRiver api={api} pts={PECOS} at={at('Pecos') - 6} />
          <MTrail api={api} pts={GL_SUMNER} at={t0} dur={dur} color={CORAL} width={10} />
          <MHerd api={api} pts={GL_SUMNER} at={t0} dur={dur} w={110} />
          <MPin api={api} at={TPL.fortBelknap} show={a + 2} label="Texas ranges" side="r" size={44} color={WHITE} />
          <MPin api={api} at={TPL.fortSumner} show={at('Fort Sumner') - 1} label="Fort Sumner" sub="NEW MEXICO TERRITORY" side="l" size={58} color={CORAL} />
          <MStandLabel api={api} at={[2252, 2120]} show={at('Pecos')} text="Pecos River" />
        </>}
      </WestMap>
      <Hand parts={[['Why there?', WHITE]]} x={1180} y={110} size={92} at={at('Why') - 2} />
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

/** 4–5 · the reason: the Army's captives beside the fort, as a plain print on the desk (no marks on the people). */
const Captives: React.FC<{detail: boolean}> = ({detail}) => {
  const a = detail ? at('eight') - 1 : at('Because') - 1;
  const b = detail ? at('How did') : at('eight');
  const cam: [number, number, number, number, number, number][] = detail ? [[a, 8, 1.28, 120, 40, 0], [b, 8, 1.36, 160, 60, 0]] : [[a, 18, 0.9, 0, 0, -1], [b, 14, 0.96, 0, 0, 0]];
  return (
    <AbsoluteFill>
      <DeskCam k={cam}>
        <Lift x={90} y={150} w={1560} hgt={830} h={8} at={detail ? -99 : a + 2} rot={-1} seed={42}>
          <Print src={I.hweeldi} size={Z.hweeldi} x={0} y={0} w={1560} crop={[0, 0, 3840, 2040]} at={-99} seed={42} />
        </Lift>
      </DeskCam>
      {!detail && <Note text="held by the Army, beside the fort" x={1060} y={70} size={52} rot={-2} at={at('holding') - 2} />}
      {detail && <>
        <Big text="≈ 8,000" x={1220} y={600} size={120} at={at('eight') + 2} color={WHITE} />
        <Lines x={1230} y={750} size={54} gap={74} rows={[{text: 'Diné (Navajo) people', at: at('Din') - 2}, {text: '+ hundreds of', at: at('hundreds') - 2}, {text: 'Mescalero Apache', at: at('Mescalero') - 2}]} />
      </>}
      <ScrimTag text={TAG.hweeldi} />
    </AbsoluteFill>
  );
};

// ───────────────────────── how they got there (quiet) ─────────────────────────

/** A drawn node on the dark desk (two-sided raiding diagram). */
const Node2: React.FC<{x: number; y: number; w: number; label: string; at: number}> = ({x, y, w, label, at: a}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (g < a) return null;
  const k = interpolate(g, [a, a + 3, a + 6], [1.25, 0.96, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 150, boxSizing: 'border-box', transform: `scale(${k})`, background: 'rgba(12,20,18,0.72)', border: `4px solid ${pal.mark}`,
      boxShadow: '12px 14px 0 #050403', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: hand.family, fontSize: 48 * hand.scale, color: BONE, whiteSpace: 'nowrap'}}>{label}</div>
    </div>
  );
};

/** 6–7 · "How did they get there?": generations of raiding both ways, for sheep, horses and captives. Drawn, teal only. */
const Raids: React.FC<{detail: boolean}> = ({detail}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = detail ? at('for sheep') - 1 : at('How did') - 1;
  const b = detail ? at('In 1863') : at('for sheep');
  const arrow = (y: number, dir: 1 | -1, t: number) => {
    const p = interpolate(g, [t, t + 10], [0, 1], clamp);
    if (p <= 0) return null;
    const x0 = dir > 0 ? 790 : 1130;
    const x1 = x0 + dir * 340 * p;
    return <g key={`${y}${dir}`}>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={pal.mark} strokeWidth={7} strokeLinecap="round" />
      {p >= 1 && <path d={`M${x1 - dir * 26},${y - 18} L${x1},${y} L${x1 - dir * 26},${y + 18}`} fill="none" stroke={pal.mark} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />}
    </g>;
  };
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={detail ? [[a, 10, 1.22, 0, 60, 0], [b, 10, 1.3, 0, 70, 0]] : [[a, 16, 0.98, 0, 0, 1], [b, 12, 1.04, 0, 10, 0]]}><></></DeskCam>
        <AbsoluteFill style={{transform: detail ? 'scale(1.08) translateY(20px)' : undefined}}>
          {!detail && <Hand parts={[['How did they get there?', BONE]]} x={420} y={110} size={84} at={at('How did') - 2} dur={16} />}
          <Node2 x={210} y={430} w={560} label="Diné raiders" at={at('raiders') - 2} />
          <Node2 x={1150} y={430} w={560} label="New Mexican settlers" at={at('settlers') - 2} />
          <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
            {arrow(475, 1, at('raided'))}
            {arrow(535, -1, at('each other'))}
          </svg>
          <Label text="for generations · both ways" x={720} y={640} size={26} at={at('generations')} color={BONE} />
          {detail && <>
            <Note text="sheep" x={560} y={720} size={64} rot={-3} at={at('sheep') - 2} />
            <Note text="horses" x={820} y={735} size={64} rot={-2} at={at('horses') - 2} />
            <Note text="captives" x={1110} y={725} size={64} rot={-3} at={at('captives') - 2} color={BONE} />
          </>}
        </AbsoluteFill>
      </AbsoluteFill>
    </Quiet>
  );
};

/** 8 · 1863: the Army's commander in New Mexico (Carleton), plain portrait in a circle mount. */
const Carleton: React.FC = () => {
  const a = at('In 1863') - 1;
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={[[a, 12, 1.0, 0, 0, 0], [at('He wanted'), 12, 1.05, 0, 10, 0]]}><></></DeskCam>
        <CircleMount src={I.carleton} size={Z.carleton} cx={1380} cy={540} r={300} fx={215} fy={230} scale={1.3} at={a + 2} />
        <SlapTitle text="1863" x={110} y={90} size={110} at={at('1863')} seed={73} />
        <Label text="Gen. James H. Carleton" x={120} y={330} size={30} at={at('commander') - 2} color={BONE} />
        <Label text="the Army's commander in New Mexico" x={120} y={380} size={24} at={at('commander')} />
        <Lines x={120} y={520} size={64} gap={96} rows={[{text: 'decided to end it', at: at('decided') - 2}, {text: 'his way', at: at('his way') - 2}]} />
        <ScrimTag text={TAG.carleton} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 9–10 · the plan on the map: the Diné homeland (he believed it held gold), and a reservation far from home. */
const Plan: React.FC<{far: boolean}> = ({far}) => {
  const a = far ? at('and turned') - 1 : at('He wanted') - 1;
  const b = far ? at('Troops') : at('and turned');
  const ks = far ? [{f: a, x: 1880, y: 1720, z: 1.25, tilt: 46, rot: 0}, {f: b, x: 1900, y: 1740, z: 1.05, tilt: 44, rot: -3}]
    : [{f: a, x: 1780, y: 1660, z: 1.35, tilt: 50, rot: 4}, {f: b, x: 1820, y: 1690, z: 1.6, tilt: 52, rot: 2}];
  return (
    <Quiet>
      <AbsoluteFill>
        <WestMap keys={ks}>
          {(api) => <>
            <MRegion api={api} pts={DINE} at={far ? -99 : a + 4} />
            <MStandLabel api={api} at={[1640, 1700]} show={far ? -99 : a + 8} text="Diné homeland" color={BONE} />
            {far && <>
              <MLine api={api} pts={[[1760, 1720], [1960, 1800], [2152.2, 1858.6]]} at={at('reservation') - 4} dur={14} color={BONE} width={5} opacity={0.85} />
              <MPin api={api} at={TPL.fortSumner} show={at('reservation') + 6} label="a reservation" sub="BESIDE FORT SUMNER" side="r" size={50} />
            </>}
          </>}
        </WestMap>
        {!far && <>
          <Lines x={120} y={120} size={62} rows={[{text: 'off their land', at: at('off their') - 2}]} />
          <Note text="(he believed it held gold)" x={150} y={230} size={54} rot={-3} at={at('believed') - 2} color={BONE} />
        </>}
        {far && <>
          <Lines x={120} y={120} size={62} gap={92} rows={[{text: '→ farmers on a reservation', at: at('farmers') - 2}, {text: 'far from home', at: at('far from') - 2, color: BONE}]} />
        </>}
        <ScrimTag text={TAG.map} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 11 · troops led by Kit Carson: the portrait plain; three lines of what they destroyed. */
const Carson: React.FC = () => {
  const a = at('Troops') - 1;
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={[[a, 14, 1.06, 0, 0, 1], [at('until'), 14, 0.98, -20, 0, 0]]}><></></DeskCam>
        <CircleMount src={I.carson} size={Z.carson} cx={1420} cy={520} r={320} fx={640} fy={780} scale={0.6} at={a + 2} />
        <Label text="troops led by Kit Carson" x={120} y={190} size={30} at={at('Kit') - 2} color={BONE} />
        <Lines x={120} y={300} size={66} gap={120} rows={[
          {text: 'burned their fields', at: at('burned') - 2},
          {text: 'cut down their orchards', at: at('cut down') - 2},
          {text: 'killed their sheep', at: at('killed') - 2},
        ]} />
        <ScrimTag text={TAG.carson} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 12 · that winter: Canyon de Chelly (the Diné homeland; O'Sullivan, 1873) as a print; starving families surrendered. */
const Winter: React.FC = () => {
  const a = at('until') - 1;
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={[[a, 10, 1.14, 120, 20, 0], [at('Then soldiers'), 12, 1.0, 60, 0, -1]]}>
          <Lift x={120} y={80} w={1180} hgt={864} h={8} at={-99} rot={-1.5} seed={43}>
            <Print src={I.canyon} size={Z.canyon} x={0} y={0} w={1180} at={-99} seed={43} filter="grayscale(1) contrast(1.15) brightness(0.92)" />
          </Lift>
        </DeskCam>
        <Label text="Canyon de Chelly · Diné homeland" x={1350} y={230} size={24} at={a + 4} color={BONE} />
        <Lines x={1350} y={320} size={60} gap={100} rows={[
          {text: 'that winter,', at: at('that winter') - 2},
          {text: 'starving families', at: at('starving') - 2},
          {text: 'surrendered', at: at('surrendered') - 2, color: BONE},
        ]} />
        <ScrimTag text={TAG.canyon} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 13–15 · the Long Walk on the series map, drawn slowly in teal; the title; then held with no marks. */
const LongWalk: React.FC<{part: 0 | 1 | 2}> = ({part}) => {
  const g = useGFrame();
  const a0 = at('Then soldiers') - 1;
  const a1 = at('call it') - 5;
  const a2 = at('Hundreds died') - 1;
  const ks = part === 0 ? [{f: a0, x: 1880, y: 1760, z: 1.15, tilt: 50, rot: -2}, {f: a1, x: 1940, y: 1790, z: 1.3, tilt: 50, rot: -4}]
    : part === 1 ? [{f: a1, x: 2010, y: 1800, z: 1.55, tilt: 54, rot: 6}, {f: a2, x: 1900, y: 1770, z: 1.55, tilt: 54, rot: 4}]
      : [{f: a2, x: 1945, y: 1790, z: 1.12, tilt: 48, rot: 0}, {f: at('The camp'), x: 1945, y: 1790, z: 1.08, tilt: 48, rot: 0}];
  const labels = part < 2;
  const fade = part === 2 ? interpolate(g, [a2, a2 + 10], [1, 0], clamp) : 1;
  return (
    <Quiet>
      <AbsoluteFill>
        <WestMap keys={ks}>
          {(api) => <>
            <MRegion api={api} pts={DINE} at={-99} color="rgba(47,224,196,0.6)" />
            <MTrail api={api} pts={TLINES.longWalk} at={part === 0 ? at('marched') - 2 : -99} dur={at('Pecos', 2) - at('marched') + 2} width={10} color="#2FE0C4" />
            {labels && <>
              <MPin api={api} at={TPL.fortDefiance} show={part === 0 ? a0 + 4 : -99} label="Fort Defiance" side="l" size={46} color={BONE} />
              <MPin api={api} at={TPL.fortSumner} show={part === 0 ? at('Pecos', 2) - 2 : -99} label="Fort Sumner" sub="ON THE PECOS" side="r" size={50} />
            </>}
          </>}
        </WestMap>
        {part === 0 && <Big text="≈ 300 miles" x={1180} y={100} size={110} at={at('three hundred')} color={BONE} />}
        {part === 0 && <Note text="marched, 1864" x={1200} y={250} size={52} rot={-3} at={at('miles') + 2} />}
        {part === 1 && <>
          <SlapTitle text="THE LONG WALK" x={110} y={90} size={104} at={at('Long Walk')} seed={75} />
          <Label text="what the Diné call it" x={120} y={240} size={26} at={a1 + 4} color={BONE} />
        </>}
        {part === 2 && <div style={{opacity: fade}}><Label text="the Long Walk" x={120} y={110} size={26} color={BONE} /></div>}
        <ScrimTag text={TAG.map} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 16–17 · the camp: Bosque Redondo (a plain print of the Signal Corps photograph), the definition; water, crops. */
const Camp: React.FC<{detail: boolean}> = ({detail}) => {
  const a = detail ? at('The water') - 1 : at('The camp') - 1;
  const b = detail ? at('People were') : at('The water');
  const cam: [number, number, number, number, number, number][] = detail ? [[a, 8, 1.24, 0, -60, 0], [b, 8, 1.3, -30, -60, 0]] : [[a, 18, 0.94, 0, 0, 1], [b, 14, 1.0, 0, 0, 0]];
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={cam}>
          <Lift x={160} y={250} w={1600} hgt={616} h={8} at={detail ? -99 : a + 2} rot={1} seed={44}>
            <Print src={I.captives} size={Z.captives} x={0} y={0} w={1600} at={-99} seed={44} filter="grayscale(1) contrast(1.1) brightness(0.95)" />
          </Lift>
        </DeskCam>
        {!detail && <SlapTitle text="BOSQUE REDONDO" x={110} y={80} size={100} at={at('Bosque')} seed={77} />}
        <Definition term="Bosque Redondo" def="Spanish for “round grove”: the reservation camp beside Fort Sumner, 1863–68" at={detail ? -99 : at('Redondo') + 8} x={120} y={830} w={1500} />
        {detail && <Lines x={130} y={90} size={62} gap={96} rows={[{text: 'the water was bad', at: at('bad') - 4}, {text: 'the crops failed', at: at('crops') - 2}]} />}
        <ScrimTag text={TAG.captives} />
      </AbsoluteFill>
    </Quiet>
  );
};

/** 18 · people going hungry, and the Army needed beef: the Fort Sumner photograph, a slow pull; the last quiet beat. */
const Hungry: React.FC = () => {
  const a = at('People were') - 1;
  return (
    <Quiet>
      <AbsoluteFill>
        <DeskCam k={[[a, 8, 1.2, -260, 40, 0], [at("So let's"), 10, 1.08, -220, 50, 0]]}>
          <Lift x={90} y={150} w={1560} hgt={830} h={8} at={-99} rot={-1} seed={42}>
            <Print src={I.hweeldi} size={Z.hweeldi} x={0} y={0} w={1560} crop={[0, 0, 3840, 2040]} at={-99} seed={42} />
          </Lift>
        </DeskCam>
        <Lines x={1130} y={130} size={56} gap={92} rows={[{text: 'people went hungry', at: at('hungry') - 4}, {text: '→ the Army needed beef', at: at('needed') - 4, color: BONE}]} />
        <ScrimTag text={TAG.hweeldi} />
      </AbsoluteFill>
    </Quiet>
  );
};

// ───────────────────────── said plainly ─────────────────────────

/** 19 · "So let's say it plainly": the map pulled back, the trail to Fort Sumner lit; two plain lines of handwriting. */
const Plainly: React.FC = () => {
  const a = at("So let's") - 1;
  const b = at('Goodnight and Loving') - 1;
  const ks = [{f: a, x: 2350, y: 1950, z: 0.95, tilt: 44, rot: -2}, {f: b, x: 2300, y: 1930, z: 1.05, tilt: 46, rot: 0}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MTrail api={api} pts={GL_SUMNER} at={-99} width={9} color="#2FE0C4" />
          <MPin api={api} at={TPL.fortSumner} show={a + 6} label="Bosque Redondo" side="l" size={48} color={WHITE} />
        </>}
      </WestMap>
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(8,7,5,0.82) 0%, rgba(8,7,5,0.55) 40%, rgba(8,7,5,0) 62%)'}} />
      <Label text="said plainly" x={120} y={80} size={26} at={at('plainly') - 2} color={WHITE} />
      <Lines x={120} y={150} size={66} gap={104} rows={[
        {text: 'One of the most famous cattle trails in America', at: at('One of the') - 2, color: WHITE},
        {text: 'began as a way to feed a prison camp.', at: at('began') - 2},
      ]} />
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

/** 20 · sold for about $12,000 in gold: the coin stack slaps down. */
const Gold: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Goodnight and Loving') - 1;
  const sh = shake(f, [at('twelve') + 3], 7);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 22, 1.04, 0, 0, -2], [at('Goodnight is'), 16, 1.0, 0, 20, 0]]}>
        <Float x={1100} y={240} w={620} hgt={700} h={18} at={at('sold') - 1} rot={-4} seed={5}>
          <Prop src={I.coins} m={M4.coins} x={0} y={0} w={560} at={-99} />
        </Float>
      </DeskCam>
      <Label text="the steers, sold at Fort Sumner" x={130} y={250} size={28} at={at('sold')} color={WHITE} />
      <Big text="≈ $12,000" x={120} y={320} size={180} at={at('twelve')} />
      <Note text="in gold" x={160} y={560} size={72} rot={-3} at={at('in gold') - 2} color={WHITE} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the chuck wagon ─────────────────────────

/** 21 · Goodnight (coral) is usually credited: the chuck wagon print slides in; the title. */
const Credited: React.FC = () => {
  const a = at('Goodnight is') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 18, 1.0, 0, 0, 2], [at('an old Army'), 14, 1.06, 20, 0, 0]]}>
        <Lift x={170} y={330} w={420} hgt={410} h={6} at={-99} rot={-4} blur={1.2} seed={45}>
          <Print src={I.goodnight} size={Z.goodnight} x={0} y={0} w={420} at={-99} seed={45} mask={M4.goodnight} tint={0.45} />
        </Lift>
        <Float x={760} y={260} w={1100} hgt={900} h={20} at={at('chuck') - 2} rot={2} seed={6}>
          <Prop src={I.wagon} m={M4.wagon} x={0} y={0} w={1040} at={-99} />
        </Float>
      </DeskCam>
      <Note text="usually credited" x={130} y={250} size={54} rot={-3} at={at('usually') - 2} color={WHITE} />
      <SlapTitle text="THE CHUCK WAGON" x={700} y={90} size={100} at={at('chuck')} seed={79} />
    </AbsoluteFill>
  );
};

// The 3D cut-away: an old Army wagon box with the chuck box on its back. World px on a Stage: x along the wagon (front 0 →
// rear 860), y across (−150 … 150), z up (translateZ). Drawn teal, never photoreal; heights and parts simplified.
const WL = 1060;
type BoxP = {x: number; y: number; z: number; w: number; d: number; h: number};
const FILL = 'rgba(10,18,16,0.72)';

/** Six faces of a drawn box; `back` (the x = x+w face, the wagon's rear) can carry its own drawing (u = height, v = across). */
const Box3: React.FC<{b: BoxP; stroke: string; width?: number; fill?: string; back?: React.ReactNode; hide?: string[]}> = ({b, stroke, width = 3, fill = FILL, back, hide = []}) => {
  const {x, y, z, w, d, h} = b;
  const face = (st: React.CSSProperties, key: string, child?: React.ReactNode) => hide.includes(key) ? null : (
    <div key={key} style={{position: 'absolute', boxSizing: 'border-box', background: fill, border: `${width}px solid ${stroke}`, backfaceVisibility: 'visible', ...st}}>{child}</div>
  );
  return (
    <>
      {face({left: x, top: y, width: w, height: d, transform: `translateZ(${z}px)`}, 'bottom')}
      {face({left: x, top: y, width: w, height: d, transform: `translateZ(${z + h}px)`}, 'top')}
      {face({left: x, top: y - h, width: w, height: h, transformOrigin: '50% 100%', transform: `translateZ(${z}px) rotateX(-90deg)`}, 'north')}
      {face({left: x, top: y + d - h, width: w, height: h, transformOrigin: '50% 100%', transform: `translateZ(${z}px) rotateX(-90deg)`}, 'south')}
      {face({left: x - h, top: y, width: h, height: d, transformOrigin: '100% 50%', transform: `translateZ(${z}px) rotateY(90deg)`}, 'front')}
      {face({left: x + w, top: y, width: h, height: d, transformOrigin: '0% 50%', transform: `translateZ(${z}px) rotateY(-90deg)`}, 'back', back)}
    </>
  );
};

/** A wheel standing in the plane y = const. */
const Wheel: React.FC<{cx: number; y: number; r: number; stroke: string}> = ({cx, y, r, stroke}) => (
  <div style={{position: 'absolute', left: cx - r, top: y - 2 * r, width: 2 * r, height: 2 * r, transformOrigin: '50% 100%', transform: 'rotateX(-90deg)'}}>
    <svg width={2 * r} height={2 * r} style={{overflow: 'visible'}}>
      <circle cx={r} cy={r} r={r - 4} fill="rgba(10,18,16,0.35)" stroke={stroke} strokeWidth={6} />
      <circle cx={r} cy={r} r={r * 0.16} fill="none" stroke={stroke} strokeWidth={4} />
      {Array.from({length: 12}).map((_, i) => {
        const t = (i / 12) * Math.PI * 2;
        return <line key={i} x1={r + Math.cos(t) * r * 0.16} y1={r + Math.sin(t) * r * 0.16} x2={r + Math.cos(t) * (r - 6)} y2={r + Math.sin(t) * (r - 6)} stroke={stroke} strokeWidth={3} opacity={0.8} />;
      })}
    </svg>
  </div>
);

/** A wagon bow (canvas hoop) in the plane x = bx, rising from the bed top. */
const Bow: React.FC<{bx: number; z: number; hh: number; stroke: string}> = ({bx, z, hh, stroke}) => {
  const dd = 300;
  const pts = Array.from({length: 21}).map((_, i) => {
    const t = i / 20;
    const zz = hh * Math.sin(Math.PI * t) ** 0.6;
    return `${(hh - zz).toFixed(1)},${(dd * t).toFixed(1)}`;
  }).join(' ');
  return (
    <div style={{position: 'absolute', left: bx - hh, top: -150, width: hh, height: dd, transformOrigin: '100% 50%', transform: `translateZ(${z}px) rotateY(90deg)`}}>
      <svg width={hh} height={dd} style={{overflow: 'visible'}}><polyline points={pts} fill="none" stroke={stroke} strokeWidth={5} strokeLinecap="round" /></svg>
    </div>
  );
};

/** The chuck box's rear face (drawn in u = height above its base, v = across): shelves and a grid of small drawers. */
const ChuckFace: React.FC<{h: number; d: number; stroke: string; reveal: number}> = ({h, d, stroke, reveal}) => {
  const rows = [0.08, 0.3, 0.52, 0.74, 0.95];
  return (
    <svg width={h} height={d} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: reveal}}>
      {/* shelves: lines across at each height (u), drawers: little boxes with knobs in the lower rows */}
      {rows.map((r, i) => <line key={i} x1={h * r} y1={8} x2={h * r} y2={d - 8} stroke={stroke} strokeWidth={4} />)}
      {[0, 1].map((ri) => Array.from({length: 4}).map((_, ci) => {
        const u0 = h * rows[ri] + 6;
        const u1 = h * rows[ri + 1] - 6;
        const v0 = 12 + ci * ((d - 24) / 4) + 5;
        const v1 = 12 + (ci + 1) * ((d - 24) / 4) - 5;
        return <g key={`${ri}${ci}`}>
          <rect x={u0} y={v0} width={u1 - u0} height={v1 - v0} fill="rgba(47,224,196,0.12)" stroke={stroke} strokeWidth={2.5} />
          <circle cx={(u0 + u1) / 2} cy={(v0 + v1) / 2} r={4} fill={stroke} />
        </g>;
      }))}
      {/* upper shelves: cubbies */}
      {[2, 3].map((ri) => [0.33, 0.66].map((v, k) => <line key={`${ri}${k}`} x1={h * rows[ri]} y1={d * v} x2={h * rows[ri + 1]} y2={d * v} stroke={stroke} strokeWidth={2.5} opacity={0.8} />))}
    </svg>
  );
};

const Wagon3D: React.FC<{lid: number; parts: number}> = ({lid, parts}) => {
  const pal = usePal();
  const st = pal.mark;
  const bedZ = 110;
  const bedH = 120;
  const box: BoxP = {x: 640, y: -150, z: bedZ, w: 220, d: 300, h: 340};
  const hinge = {x: 860, z: bedZ + 130};
  const lidH = 210;
  const th = lid * 90;
  const lidColor = lid > 0.02 ? pal.subject : st;
  const legOn = interpolate(lid, [0.8, 1], [0, 1], clamp);
  const legTop = hinge.z;
  return (
    <>
      {/* ground grid */}
      <div style={{position: 'absolute', left: -260, top: -520, width: WL + 520, height: 1040,
        backgroundImage: 'linear-gradient(rgba(47,224,196,0.14) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(47,224,196,0.14) 1.5px, transparent 1.5px)',
        backgroundSize: '60px 60px', WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, #000 35%, transparent 70%)', maskImage: 'radial-gradient(ellipse at 50% 50%, #000 35%, transparent 70%)'} as React.CSSProperties} />
      {/* wheels on both sides, the far side fainter */}
      {[-160, 160].map((y) => (
        <div key={y} style={{position: 'absolute', inset: 0, opacity: y < 0 ? 0.55 : 1, transformStyle: 'preserve-3d'}}>
          <Wheel cx={150} y={y} r={95} stroke={st} />
          <Wheel cx={700} y={y} r={115} stroke={st} />
        </div>
      ))}
      {/* the old Army wagon box (open top) */}
      <Box3 b={{x: 0, y: -150, z: bedZ, w: 860, d: 300, h: bedH}} stroke={st} hide={['top']} fill="rgba(10,18,16,0.6)" />
      {/* bows over the front of the wagon */}
      {[120, 300, 480].map((bx) => <Bow key={bx} bx={bx} z={bedZ + bedH} hh={230} stroke={st} />)}
      {/* the chuck box on the back */}
      <Box3 b={box} stroke={st} width={4} fill="rgba(12,22,19,0.85)" back={<ChuckFace h={box.h} d={box.d} stroke={st} reveal={parts} />} />
      {/* the hinged lid: closed it covers the chuck box's back; it swings down on its hinge into a table */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `translate3d(${hinge.x + 4}px, 0px, ${hinge.z}px) rotateY(${th}deg)`}}>
        <div style={{position: 'absolute', left: 0, top: -150, width: lidH, height: 300, boxSizing: 'border-box', transformOrigin: '0% 50%', transform: 'rotateY(-90deg)',
          background: lid > 0.02 ? 'rgba(255,111,97,0.28)' : 'rgba(12,22,19,0.92)', border: `5px solid ${lidColor}`}} />
      </div>
      {/* the table's leg */}
      {legOn > 0 && <div style={{position: 'absolute', left: hinge.x + lidH - 6, top: -110 - legTop, width: 8, height: legTop, transformOrigin: '50% 100%', transform: 'rotateX(-90deg)',
        background: pal.subject, opacity: legOn}} />}
      {legOn > 0 && <div style={{position: 'absolute', left: hinge.x + lidH - 6, top: 110 - legTop, width: 8, height: legTop, transformOrigin: '50% 100%', transform: 'rotateX(-90deg)',
        background: pal.subject, opacity: legOn}} />}
    </>
  );
};

/** 22–24 · the 3D cut-away: slow orbit; shelves & drawers; (the J.A. photo between); the lid folds down into a table. */
const Wagon: React.FC<{close: boolean}> = ({close}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = close ? at('The lid') - 1 : at('an old Army') - 1;
  const b = close ? at('Hold onto') : at('so a cook');
  const lid = close ? interpolate(f, [at('folded') - 2, at('table') + 4], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) * (1 + 1.6 * t * (1 - t))}) : 0;
  const parts = close ? 1 : interpolate(g, [at('shelves') - 4, at('shelves') + 6], [0, 1], clamp);
  const fx = close ? keys(f, [[a, 760], [b, 820]]) : keys(f, [[a, 470], [b, 600]]);
  const spin = close ? keys(f, [[a, 64], [b, 78]]) : keys(f, [[a, 44], [b, 62]]);
  const tilt = close ? keys(f, [[a, 64], [b, 60]]) : keys(f, [[a, 66], [b, 62]]);
  const z = close ? zkeys(f, [[a, 1.18], [b, 1.26]]) : zkeys(f, [[a, 0.92], [b, 1.02]]);
  return (
    <AbsoluteFill>
      <Stage w={WL} fx={fx} tilt={tilt} spin={spin} z={z} dy={close ? 170 : 200}>
        <Wagon3D lid={lid} parts={parts} />
      </Stage>
      {!close && <>
        <Lines x={110} y={110} size={60} gap={92} rows={[{text: 'an old Army wagon', at: at('old Army') - 2}, {text: '+ a box on the back', at: at('box') - 2}]} />
        <Lines x={1260} y={770} size={58} rows={[{text: 'shelves & drawers', at: at('shelves') - 2}]} />
        <Definition term="chuck wagon" def="a trail crew's kitchen on wheels" at={a + 6} x={110} y={930} w={1100} />
      </>}
      {close && <>
        <Hand parts={[['the lid → ', '#2FE0C4'], ['a table', CORAL]]} x={1080} y={110} size={72} at={at('folded') - 2} />
        <Label text="shelves & drawers behind it" x={120} y={940} size={26} at={a + 4} />
      </>}
      <ScrimTag text="Drawn diagram · parts simplified" />
    </AbsoluteFill>
  );
};

/** 23 · the real thing: a cook at the J.A. Ranch chuck wagon (Goodnight's ranch), 1907. */
const Cook: React.FC = () => {
  const a = at('so a cook') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 12, 1.12, 80, 30, 0], [at('The lid'), 12, 1.2, 160, 20, 0]]}>
        <Lift x={80} y={70} w={1180} hgt={955} h={8} at={-99} rot={1.5} seed={46}>
          <Print src={I.ja} size={Z.ja} x={0} y={0} w={1180} at={-99} seed={46} filter="grayscale(1) contrast(1.25) brightness(1.02)" />
        </Lift>
      </DeskCam>
      <Lines x={1260} y={260} size={60} gap={92} rows={[{text: 'so a cook could feed', at: at('cook') - 2}, {text: 'a crew on the trail', at: at('crew') - 2}]} />
      <Label text="J.A. Ranch (Goodnight's), 1907" x={1270} y={500} size={24} at={a + 6} color={WHITE} />
      <ScrimTag text={TAG.ja} />
    </AbsoluteFill>
  );
};

// ───────────────────────── hold onto it ─────────────────────────

/** 25 · "Hold onto Bosque Redondo": the pin on the map, "→ Episode 4". */
const HoldOn: React.FC = () => {
  const a = at('Hold onto') - 1;
  const b = at('So who') - 1;
  const ks = [{f: a, x: 2100, y: 1830, z: 1.35, tilt: 52, rot: -4}, {f: b, x: 2140, y: 1850, z: 1.6, tilt: 54, rot: -6}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRegion api={api} pts={DINE} at={-99} />
          <MTrail api={api} pts={TLINES.longWalk} at={-99} width={8} color="#2FE0C4" opacity={0.7} />
          <MTrail api={api} pts={GL_SUMNER} at={-99} width={8} color="#2FE0C4" opacity={0.7} />
          <MPin api={api} at={TPL.fortSumner} show={a + 4} label="Bosque Redondo" side="r" size={60} color={WHITE} />
        </>}
      </WestMap>
      <Hand parts={[['hold onto Bosque Redondo', WHITE]]} x={110} y={90} size={74} at={at('Hold onto') - 2} />
      <Hand parts={[['→ Episode 4']]} x={150} y={210} size={84} at={at('last episode') - 2} />
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

/** 26 · hand-off: who rode these trails? Saddle and rope on the desk; held through the tail. */
const Riders: React.FC = () => {
  const a = at('So who') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 24, 0.98, 0, 0, -2], [END, 16, 1.08, -20, 20, 0]]}>
        <Float x={980} y={250} w={640} hgt={660} h={16} at={a + 2} rot={-3} seed={7}>
          <Prop src={I.saddle} m={M4.saddle} x={0} y={0} w={600} at={-99} />
        </Float>
        <Float x={1560} y={460} w={460} hgt={460} h={10} at={at('riding') - 2} rot={6} seed={8}>
          <Prop src={I.lariat} m={M4.lariat} x={0} y={0} w={420} at={-99} />
        </Float>
      </DeskCam>
      <Hand parts={[['who were the men', WHITE]]} x={110} y={330} size={84} at={at('who were') - 2} />
      <Hand parts={[['riding these trails?', '#2FE0C4']]} x={150} y={460} size={84} at={at('riding') - 2} />
    </AbsoluteFill>
  );
};

// ───────────────────────── assembly ─────────────────────────

const c = (w: string, n = 1) => at(w, n) - 1;
const SHOTS: [number, React.ReactNode, ('whip' | 'cut')?][] = [
  [0, <Ranchers />],
  [c('gathered'), <Herd />, 'cut'],
  [c('along'), <Pecos />, 'whip'],
  [c('Because'), <Captives detail={false} />, 'cut'],
  [c('eight'), <Captives detail />, 'cut'],
  [c('How did'), <Raids detail={false} />, 'cut'],
  [c('for sheep'), <Raids detail />, 'cut'],
  [c('In 1863'), <Carleton />, 'cut'],
  [c('He wanted'), <Plan far={false} />, 'cut'],
  [c('and turned'), <Plan far />, 'cut'],
  [c('Troops'), <Carson />, 'cut'],
  [c('until'), <Winter />, 'cut'],
  [c('Then soldiers'), <LongWalk part={0} />, 'cut'],
  [at('call it') - 5, <LongWalk part={1} />, 'cut'],
  [c('Hundreds died'), <LongWalk part={2} />, 'cut'],
  [c('The camp'), <Camp detail={false} />, 'cut'],
  [c('The water'), <Camp detail />, 'cut'],
  [c('People were'), <Hungry />, 'cut'],
  [c("So let's"), <Plainly />, 'whip'],
  [c('Goodnight and Loving'), <Gold />, 'cut'],
  [c('Goodnight is'), <Credited />, 'whip'],
  [c('an old Army'), <Wagon close={false} />, 'cut'],
  [c('so a cook'), <Cook />, 'cut'],
  [c('The lid'), <Wagon close />, 'cut'],
  [c('Hold onto'), <HoldOn />, 'whip'],
  [c('So who'), <Riders />, 'cut'],
];

const QUIET_FROM = at('How did');
const QUIET_TO = at("So let's");
const tick = (w: string, d = 2, n = 1): SfxRow => [at(w, n) - d, 'marker_tick', 0.2];
const SFX: SfxRow[] = [
  // shot changes: whip_soft on drifts, a soft whoosh on dissolves (softer still in the quiet section)
  ...SHOTS.slice(1).map(([s, , k]): SfxRow => (k === 'whip' ? [s - 4, 'whip_soft', 0.25] : [s, 'whoosh', s >= QUIET_FROM && s < QUIET_TO ? 0.1 : 0.2])),
  [at('1866'), 'stamp', 0.22], [at('Oliver') - 2, 'card_slide_soft', 0.18], tick('ranchers', 4),
  [at('about') - 1, 'paper_slap_soft', 0.2], [at('two', 2) + 1, 'paper_slap_soft', 0.2], [at('thousand') + 1, 'paper_slap_soft', 0.25], tick('cattle'), tick('drove'),
  [at('Fort Sumner'), 'block_tap_soft', 0.15], tick('Why'),
  [at('Because') + 1, 'card_slide_soft', 0.18], tick('holding'),
  [at('eight') + 2, 'stamp', 0.18], tick('Din'), tick('Mescalero'),
  // quiet: fewer, softer
  [at('How did') - 3, 'marker_tick', 0.15], [at('raiders') - 1, 'block_tap_soft', 0.1], [at('settlers') - 1, 'block_tap_soft', 0.1],
  [at('sheep') - 3, 'marker_tick', 0.14], [at('horses') - 3, 'marker_tick', 0.14], [at('captives') - 3, 'marker_tick', 0.14],
  [at('1863'), 'stamp', 0.15], [at('decided') - 3, 'marker_tick', 0.14],
  [at('believed') - 3, 'marker_tick', 0.14], [at('farmers') - 3, 'marker_tick', 0.14],
  [at('burned') - 3, 'marker_tick', 0.14], [at('cut down') - 3, 'marker_tick', 0.14], [at('killed') - 3, 'marker_tick', 0.14],
  [at('starving') - 3, 'marker_tick', 0.14],
  [at('three hundred'), 'stamp', 0.14], [at('Long Walk'), 'stamp', 0.15],
  [at('Bosque'), 'stamp', 0.15], [at('bad') - 5, 'marker_tick', 0.14], [at('hungry') - 5, 'marker_tick', 0.14],
  // after the quiet section
  tick('plainly', 4), tick('One of the'), tick('began'),
  [at('sold'), 'paper_slap_soft', 0.25], [at('twelve'), 'stamp', 0.2], tick('in gold'),
  tick('usually'), [at('chuck') - 1, 'paper_slap_soft', 0.22], [at('chuck'), 'stamp', 0.22],
  tick('old Army'), tick('box'), tick('shelves'),
  tick('cook'), tick('crew'), [at('folded'), 'card_slide_soft', 0.2], [at('table') + 4, 'block_tap_soft', 0.15],
  tick('Hold onto'), tick('last episode'),
  [at('So who') + 1, 'paper_slap_soft', 0.22], tick('who were'), tick('riding'),
];

const Body: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <WShots shots={SHOTS} />
    <Sounds list={SFX} />
  </AbsoluteFill>
);

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_beef_for_bosque_redondo.wav" lead={LEAD} music={[
    // ch03's trail cue carries the drive (SUNO: aw_long_drive replaces it)
    {src: 'music/m_frontier.mp3', volume: bed('m_frontier'), startFrom: 20 * 30, to: QUIET_FROM + 4, fadeOut: 24},
    // the quiet section: m_lament at a lower bed (15 LU under the voice), through the plain statement and the $12,000
    {src: 'music/m_lament.mp3', volume: bed('m_lament', 15), from: QUIET_FROM - 8, to: at('Goodnight is') + 6, fadeOut: 36},
    // the chuck wagon and the hand-off: the trail cue back, from its top (SUNO: aw_long_drive)
    {src: 'music/m_frontier.mp3', volume: bed('m_frontier'), from: at('Goodnight is') - 6},
  ]}>
    <Body />
  </ChapterShell>
);
