// Chapter 6 · 1874. The hinge year; the promise first: the 1868 Fort Laramie Treaty (the real pages; Article II's "absolute and
// undisturbed use and occupation" swiped in coral), the Great Sioux Reservation and the Black Hills on the series map; Custer's
// 1874 expedition (Illingworth's wagon train, Custer in coral, the route), two miners, gold "at the grass roots", the Bismarck
// Tribune's GOLD!, prospectors pouring in across the treaty line, the 1875 offer, "The Lakota said no." on the resistance card
// (the layout Ep 4 uses), Deadwood in 1876, the stack, and "So who actually got the gold?".
// Sources: the treaty (National Archives), Custer (Brady studio, LOC), Illingworth's 1874 photographs (NARA / Commons), the
// Bismarck Tribune, Aug. 12, 1874 (LOC, Chronicling America; phrase boxes from its OCR), Deadwood 1876 (LOC; S. J. Morrow,
// LOC); AI lithograph props (no tags).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch06_1874.words.json';
import {clamp} from '../lib/anim';
import {JF, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration} from '../kit/shell';
import {bed} from '../kit/levels';
import {Field, HingeYear, SHADOW, tornPoly} from '../samples/kit';
import {Lift, ScrimTag, shake, SlapTitle, useSlap} from '../previews/fx';
import {Big, Clip, Counter, DeskCam, Float, Label, Lines, Print, Prop, Sounds, type SfxRow} from '../kit/ch04_extra';
import {Hand, MPin, MRegion, WestMap} from '../kit/ch01_extra';
import {TLINES, TPL, TREGIONS} from '../kit/trails';
import {WShots} from '../kit/ch07_extra';
import {MLine, MStandLabel} from '../kit/ch456_extra';
import {M6} from '../masks_ch06';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);
const T = makeTimeline(N, 30);
const at = T.at;
const END = Math.ceil(N.duration * 30) + 60;
const CORAL = '#FF6F61';
const WHITE = '#ffffff';

const I = {
  treaty1: 'img/ch06/fort_laramie_treaty_1868_p1.jpg',
  treaty2: 'img/ch06/fort_laramie_treaty_1868_p2_article2.jpg',
  headline: 'img/ch06/bismarck_tribune_gold_headline_1874.jpg',
  custer: 'img/ch06/custer_portrait_brady_1865.jpg',
  column: 'img/ch06/illingworth_custer_column_wagon_train_1874.jpg',
  castle: 'img/ch06/illingworth_castle_creek_camp_1874.jpg',
  deadwood: 'img/ch06/deadwood_1876.jpg',
  morrow: 'img/ch06/deadwood_from_south_morrow_1876.jpg',
  pan: 'img/props/p6_gold_pan.jpg',
  nugget: 'img/props/p6_nugget.jpg',
  pick: 'img/props/p6_pick_shovel.jpg',
  coins: 'img/props/p2_coin_stack.jpg',
};
const Z = {
  treaty1: [3347, 5123] as [number, number],
  treaty2: [3349, 5080] as [number, number],
  headline: [2600, 2765] as [number, number],
  custer: [1899, 3000] as [number, number],
  column: [3000, 2837] as [number, number],
  castle: [1920, 974] as [number, number],
  deadwood: [1536, 1112] as [number, number],
  morrow: [3000, 1737] as [number, number],
};
const TAG = {
  treaty: 'Treaty with the Sioux and Arapaho, Fort Laramie, 1868 · National Archives',
  headline: 'The Bismarck Tribune (Bismarck, D.T.), Aug. 12, 1874 · Library of Congress, Chronicling America',
  custer: 'George A. Custer, 1865 · Brady National Photographic Art Gallery · Library of Congress',
  column: "W. H. Illingworth, Custer's column crossing the plains, Black Hills Expedition, 1874 · National Archives",
  castle: 'W. H. Illingworth, Camp in Castle Creek Valley, 1874 (stereograph) · Wikimedia Commons',
  deadwood: 'Deadwood, Dakota Territory, 1876 · Library of Congress',
  morrow: 'S. J. Morrow, Deadwood, 1876 (stereograph) · Library of Congress',
  map: "Map: Natural Earth outlines (today's state lines for reference); 1868 reservation simplified; routes approx.",
};
/** Article II's last lines on the treaty's page 2: [x0, centre y, x1] in source px (read off the scan). */
const ART2 = [[2737, 4362, 3249], [637, 4562, 2262]] as [number, number, number][];
/** The Bismarck Tribune's "Gold and Silver in Immense Quantities" (from its OCR boxes). */
const GOLD_LINES = [[881, 1560, 1506], [977, 1641, 1412]] as [number, number, number][];
const PROP_F = 'saturate(0.6) contrast(1.08)';

// ───────────────────────── the promise ─────────────────────────

/** 1 · "1874." alone: the hinge year. */
const Year: React.FC = () => (
  <AbsoluteFill>
    <DeskCam k={[[0, 16, 1.08, 0, 0, -2], [at('First'), 14, 1.0, 0, 0, 0]]}><></></DeskCam>
    <HingeYear year="1874" events={['Black Hills gold', 'barbed wire']} x={500} y={330} size={240} at={at('1874') - 1} />
  </AbsoluteFill>
);

/** 2 · "First, a promise.": the treaty's first page lands on the desk. */
const Promise: React.FC = () => {
  const a = at('First') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 24, 0.92, 0, 0, 2], [at('In 1868'), 20, 0.98, 0, 0, 0]]}>
        <Lift x={1150} y={20} w={640} hgt={980} h={8} at={at('promise') - 2} rot={4} seed={61}>
          <Print src={I.treaty1} size={Z.treaty1} x={0} y={0} w={640} at={-99} seed={61} filter="grayscale(1) sepia(0.25) contrast(1.15) brightness(0.92)" />
        </Lift>
      </DeskCam>
      <Hand parts={[['First, ', WHITE], ['a promise.', '#2FE0C4']]} x={150} y={420} size={110} at={at('First') - 2} />
      <ScrimTag text={TAG.treaty} />
    </AbsoluteFill>
  );
};

/** 3 · 1868: the United States and the Lakota sign at Fort Laramie (a push down the first page). */
const Treaty: React.FC = () => {
  const a = at('In 1868') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 12, 1.08, -160, 120, 0], [at('It set'), 12, 1.18, -240, 200, 0]]}>
        <Lift x={1150} y={20} w={640} hgt={980} h={8} at={-99} rot={4} seed={61}>
          <Print src={I.treaty1} size={Z.treaty1} x={0} y={0} w={640} at={-99} seed={61} filter="grayscale(1) sepia(0.25) contrast(1.15) brightness(0.92)" />
        </Lift>
      </DeskCam>
      <SlapTitle text="1868" x={110} y={90} size={120} at={at('1868')} seed={101} />
      <Label text="a treaty · signed at Fort Laramie" x={130} y={290} size={30} at={at('treaty') - 2} color={WHITE} />
      <Lines x={130} y={370} size={66} gap={100} rows={[{text: 'the United States', at: at('United') - 2}, {text: '+ the Lakota', at: at('Lakota') - 2}]} />
      <ScrimTag text={TAG.treaty} />
    </AbsoluteFill>
  );
};

/** 4 · the reservation on the series map (1868, simplified) and the Black Hills (coral); the definition. */
const Reservation: React.FC = () => {
  const a = at('It set') - 1;
  const b = at('for their') - 1;
  const ks = [{f: a, x: 2330, y: 860, z: 1.0, tilt: 46, rot: -2}, {f: at('Black Hills'), x: 2280, y: 850, z: 1.25, tilt: 50, rot: 0}, {f: b, x: 2220, y: 840, z: 1.6, tilt: 54, rot: 2}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRegion api={api} pts={TREGIONS.greatSioux1868} at={at('huge') - 2} />
          <MRegion api={api} pts={TREGIONS.blackHills} at={at('Black Hills') - 1} color={CORAL} />
          <MStandLabel api={api} at={[2420, 700]} show={at('reservation')} text="Great Sioux Reservation, 1868" color={WHITE} size={24} />
          <MPin api={api} at={TPL.blackHills} show={at('Black Hills')} label="the Black Hills" side="r" size={52} color={CORAL} />
          <MPin api={api} at={TPL.fortLaramie} show={a + 4} label="Fort Laramie" side="l" size={42} color={WHITE} />
        </>}
      </WestMap>
      <Lines x={120} y={100} size={60} rows={[{text: 'a huge reservation', at: at('huge') - 2}]} />
      <Definition term="Black Hills" def="forested mountains in today's western South Dakota, held sacred by the Lakota" at={at('sacred') - 4} x={120} y={880} w={1500} />
      <ScrimTag text={TAG.map} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 5 · Article II: "absolute and undisturbed use and occupation", focus pull and a coral swipe on the treaty's own lines. */
const Article: React.FC = () => {
  const a = at('for their') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 8, 1.0, 0, 0, 0], [at('Hold onto'), 8, 1.06, 20, -10, 0]]}>
        <Lift x={80} y={60} w={1500} hgt={900} h={6} at={-99} rot={-1} seed={62}>
          <Clip src={I.treaty2} size={Z.treaty2} x={0} y={0} w={1500} h={900} sx0={560} sy0={3480} scale={0.55} at={-99} band={[4250, 4680]} pullAt={a + 2}
            swipes={ART2} swipeAt={at('absolute') - 2} dur={at('occupation') - at('absolute') + 10} lineH={130} color={CORAL} />
        </Lift>
      </DeskCam>
      <Label text="Article II" x={1620} y={160} size={28} at={a + 4} color={WHITE} />
      <Lines x={140} y={960} size={50} rows={[{text: '“absolute and undisturbed use and occupation”', at: at('undisturbed') - 2, color: WHITE}]} />
      <ScrimTag text={TAG.treaty} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 6 · "Hold onto that treaty. It's where the last episode begins." */
const HoldTreaty: React.FC = () => {
  const a = at('Hold onto') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 26, 0.86, 0, 0, -2], [at('Six years'), 22, 0.9, 0, 10, 0]]}>
        <Lift x={980} y={60} w={560} hgt={857} h={6} at={-99} rot={5} seed={63}>
          <Print src={I.treaty1} size={Z.treaty1} x={0} y={0} w={560} at={-99} seed={63} filter="grayscale(1) sepia(0.25) contrast(1.15) brightness(0.9)" />
        </Lift>
        <Lift x={1440} y={140} w={560} hgt={850} h={10} at={-99} rot={-3} seed={64}>
          <Print src={I.treaty2} size={Z.treaty2} x={0} y={0} w={560} at={-99} seed={64} filter="grayscale(1) sepia(0.25) contrast(1.15) brightness(0.9)" />
        </Lift>
      </DeskCam>
      <Hand parts={[['hold onto that treaty', WHITE]]} x={120} y={330} size={80} at={at('Hold onto') - 2} />
      <Hand parts={[['→ Episode 4']]} x={160} y={470} size={88} at={at('last episode') - 2} />
      <ScrimTag text={TAG.treaty} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the expedition ─────────────────────────

/** 7 · summer 1874: Illingworth's photograph of the column crossing the plains; about a thousand men. */
const Column: React.FC = () => {
  const a = at('Six years') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 10, 1.02, 0, 40, 0], [at('led by'), 10, 1.14, -60, 60, 0]]}>
        <Lift x={60} y={140} w={1800} hgt={900} h={8} at={-99} rot={-1} seed={65}>
          <Print src={I.column} size={Z.column} x={0} y={0} w={1800} crop={[0, 0, 3000, 1500]} at={-99} seed={65} />
        </Lift>
      </DeskCam>
      <SlapTitle text="SUMMER 1874" x={110} y={60} size={100} at={at('summer')} seed={103} />
      <Big text="≈ 1,000 men" x={1180} y={70} size={110} at={at('thousand') - 1} color={WHITE} />
      <Note2 text="into the Black Hills" x={1180} y={220} size={54} at={at('Black Hills', 2) - 2} />
      <ScrimTag text={TAG.column} />
    </AbsoluteFill>
  );
};

/** A teal handwritten note (no backing). */
const Note2: React.FC<{text: string; x: number; y: number; at: number; color?: string; size?: number}> = ({text, x, y, at: a, color, size = 60}) => (
  <Lines x={x} y={y} size={size} rows={[{text, at: a, color}]} />
);

/** 8 · led by George Armstrong Custer (coral). */
const Custer: React.FC = () => {
  const a = at('led by') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 18, 1.0, 0, 0, 2], [at('Officially'), 14, 1.06, 0, 20, 0]]}>
        <Lift x={1080} y={30} w={660} hgt={1036} h={10} at={a + 2} rot={2} seed={66}>
          <Print src={I.custer} size={Z.custer} x={0} y={0} w={660} crop={[200, 300, 1700, 2654]} at={-99} seed={66} mask={M6.custer} tint={0.38} traceAt={at('Custer') + 2} />
        </Lift>
      </DeskCam>
      <Label text="led by" x={130} y={330} size={30} at={at('led by')} color={WHITE} />
      <SlapTitle text="GEORGE ARMSTRONG CUSTER" x={110} y={400} size={74} at={at('George')} seed={105} />
      <ScrimTag text={TAG.custer} />
    </AbsoluteFill>
  );
};

/** 9 · officially, a site for a fort: Custer's 1874 route into the Hills on the map. */
const Route: React.FC = () => {
  const a = at('Officially') - 1;
  const b = at('They also') - 1;
  const ks = [{f: a, x: 2260, y: 700, z: 1.1, tilt: 48, rot: 4}, {f: b, x: 2240, y: 740, z: 1.3, tilt: 52, rot: 0}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRegion api={api} pts={TREGIONS.greatSioux1868} at={-99} />
          <MRegion api={api} pts={TREGIONS.blackHills} at={-99} color={CORAL} />
          <MLine api={api} pts={TLINES.custer1874} at={a + 2} dur={at('a fort') - a + 6} color={WHITE} width={7} />
          <MPin api={api} at={TLINES.custer1874[0]} show={a + 4} label="Fort Abraham Lincoln" side="r" size={40} color={WHITE} />
        </>}
      </WestMap>
      <Label text="Custer's route, 1874" x={130} y={110} size={28} color={WHITE} at={a + 4} />
      <Lines x={130} y={170} size={62} rows={[{text: 'officially: looking for a place to build a fort', at: at('Officially') + 2}]} />
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

/** 10 · they also brought along two miners: Illingworth's Castle Creek camp; the pick and shovel land. */
const Miners: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('They also') - 1;
  const sh = shake(f, [at('two miners') + 4], 6);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 20, 1.0, 0, 0, -1], [at('The miners'), 16, 1.06, 30, 10, 0]]}>
        <Lift x={100} y={120} w={1150} hgt={1041} h={6} at={-99} rot={-2} seed={67}>
          <Print src={I.castle} size={Z.castle} x={0} y={0} w={1150} crop={[200, 200, 950, 880]} at={-99} seed={67} filter="grayscale(1) contrast(1.15)" />
        </Lift>
        <Float x={1250} y={250} w={620} hgt={620} h={20} at={at('two miners') + 1} rot={8} seed={12}>
          <Prop src={I.pick} m={M6.pick} x={0} y={0} w={560} at={-99} filter={PROP_F} />
        </Float>
      </DeskCam>
      <Hand parts={[['+ two miners', WHITE]]} x={1300} y={110} size={84} at={at('two miners') - 2} />
      <ScrimTag text={TAG.castle} />
    </AbsoluteFill>
  );
};

/** 11 · the miners found gold: the gold pan slaps down. */
const Found: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The miners') - 1;
  const sh = shake(f, [at('found') + 3], 9);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 26, 1.06, 0, 0, 3], [at('The reports'), 20, 1.0, 0, 0, 0]]}>
        <Float x={720} y={220} w={1000} hgt={760} h={16} at={at('found') - 1} rot={-4} seed={13}>
          <Prop src={I.pan} m={M6.pan} x={0} y={0} w={940} at={-99} filter="saturate(0.75) contrast(1.08)" />
        </Float>
      </DeskCam>
      <SlapTitle text="GOLD." x={130} y={180} size={180} at={at('gold')} seed={107} />
    </AbsoluteFill>
  );
};

/** 12 · the hero shot: a nugget huge in the foreground; "right there, at the grass roots". */
const GrassRoots: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The reports') - 1;
  const b = at('Newspapers') - 1;
  const s = interpolate(f, [a, b], [1.0, 1.12], clamp);
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 30, 1.2, 0, 60, 0], [b, 30, 1.2, 0, 60, 0]]}>
        {/* grass drawn as teal strokes on the desk, the nugget sitting among the roots */}
        <svg style={{position: 'absolute', left: 400, top: 300, overflow: 'visible'}} width={1920} height={1080}>
          {Array.from({length: 90}).map((_, i) => {
            const x = 80 + ((i * 197) % 1760);
            const y = 700 + ((i * 53) % 220);
            const h = 60 + ((i * 37) % 90);
            const lean = ((i * 29) % 40) - 20;
            return <path key={i} d={`M${x},${y} Q${x + lean / 2},${y - h / 2} ${x + lean},${y - h}`} fill="none" stroke="#2FE0C4" strokeWidth={3} opacity={0.45} />;
          })}
          <line x1={0} y1={820} x2={1920} y2={820} stroke="#2FE0C4" strokeWidth={2} opacity={0.4} />
        </svg>
      </DeskCam>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '1100px 640px'}}>
        <Prop src={I.nugget} m={M6.nugget} x={760} y={240} w={720} at={a + 3} filter="saturate(0.85) contrast(1.1)" />
      </div>
      <Label text="the reports that came back" x={120} y={130} size={28} at={at('reports')} color={WHITE} />
      <Lines x={120} y={200} size={66} gap={100} rows={[{text: 'right there', at: at('right there') - 2}, {text: 'at the grass roots', at: at('grass') - 2, color: CORAL}]} />
    </AbsoluteFill>
  );
};

/** 13 · newspapers did the rest: the Bismarck Tribune, Aug. 12, 1874; focus on GOLD!, a coral swipe on "Gold and Silver". */
const Headline: React.FC = () => {
  const a = at('Newspapers') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 10, 1.04, 0, 0, 2], [at('Prospectors'), 10, 1.12, 0, 20, 0]]}>
        <Lift x={640} y={20} w={1100} hgt={1000} h={8} at={a + 2} rot={2} seed={68}>
          <Clip src={I.headline} size={Z.headline} x={0} y={0} w={1100} h={1000} sx0={560} sy0={700} scale={0.78} at={-99} band={[740, 1740]} pullAt={a + 4}
            swipes={GOLD_LINES} swipeAt={at('rest') - 6} dur={14} lineH={84} color={CORAL} />
        </Lift>
      </DeskCam>
      <Lines x={110} y={300} size={62} gap={96} rows={[{text: 'newspapers', at: at('Newspapers') - 2}, {text: 'did the rest', at: at('rest') - 4, color: WHITE}]} />
      <ScrimTag text={TAG.headline} />
    </AbsoluteFill>
  );
};

/** 14 · prospectors pour in across the treaty line (from the railroad at Cheyenne); the Army tries, then mostly stops. */
const Rush: React.FC<{army: boolean}> = ({army}) => {
  const a = army ? at('The Army tried') - 1 : at('Prospectors') - 1;
  const b = army ? at('In 1875') - 1 : at('The Army tried') - 1;
  const ks = army ? [{f: a, x: 2160, y: 900, z: 1.7, tilt: 54, rot: 6}, {f: b, x: 2170, y: 870, z: 1.85, tilt: 56, rot: 8}]
    : [{f: a, x: 2150, y: 1000, z: 1.0, tilt: 48, rot: -4}, {f: b, x: 2160, y: 940, z: 1.2, tilt: 50, rot: 0}];
  // a fan of arrows into the Hills: the Cheyenne road plus two more from the east (approx.)
  const fan = [TLINES.toTheHills, [[2425, 792], [2300, 820], [2200, 835]], [[2380, 1000], [2280, 920], [2190, 860]]];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRegion api={api} pts={TREGIONS.greatSioux1868} at={-99} />
          <MRegion api={api} pts={TREGIONS.blackHills} at={-99} color={CORAL} />
          {fan.map((pts, i) => <MLine key={i} api={api} pts={pts} at={army ? -99 : at('pouring') - 10 + i * 5} dur={22} color={WHITE} width={7} />)}
          <MPin api={api} at={TPL.cheyenne} show={army ? -99 : a + 4} label="Cheyenne" sub="UNION PACIFIC" side="l" size={42} color={WHITE} />
          <MStandLabel api={api} at={[2240, 1000]} show={-99} text="treaty line" color="#2FE0C4" size={22} />
        </>}
      </WestMap>
      {!army && <Lines x={120} y={100} size={64} rows={[{text: 'prospectors started pouring in', at: at('Prospectors') - 2, color: WHITE}]} />}
      {army && <Lines x={120} y={100} size={62} gap={96} rows={[{text: 'the Army tried to keep them out', at: at('keep') - 6}, {text: 'then mostly stopped trying', at: at('mostly') - 4, color: WHITE}]} />}
      <ScrimTag text={TAG.map} />
    </AbsoluteFill>
  );
};

// ───────────────────────── the offer, and no ─────────────────────────

/** 15–16 · 1875: the offer to buy the Black Hills (about $6 million), or rent them; coins on the desk. */
const Offer: React.FC<{detail: boolean}> = ({detail}) => {
  const f = useCurrentFrame();
  const a = detail ? at('six million') - 1 : at('In 1875') - 1;
  const b = detail ? at('The Lakota said') : at('six million');
  const sh = shake(f, [at('six million') + 4], 6);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={detail ? [[a, 14, 1.1, -60, 20, 0], [b, 14, 1.16, -80, 20, 0]] : [[a, 22, 0.98, 0, 0, -2], [b, 18, 1.04, 0, 0, 0]]}>
        <Float x={1240} y={300} w={560} hgt={640} h={14} at={detail ? -99 : a + 4} rot={-3} seed={14}>
          <Prop src={I.coins} m={M6.coins} x={0} y={0} w={500} at={-99} />
        </Float>
      </DeskCam>
      <SlapTitle text="1875" x={110} y={90} size={120} at={detail ? -99 : at('1875')} seed={109} />
      <Label text="the U.S. government's offer to the Lakota" x={130} y={290} size={28} at={detail ? -99 : at('offered') - 2} color={WHITE} />
      <Lines x={130} y={360} size={66} rows={[{text: 'buy the Black Hills', at: detail ? -99 : at('buy') - 2}]} />
      {detail && <>
        <Counter prefix="≈ $" to={6000000} at={a + 2} dur={18} x={130} y={480} size={140} />
        <Lines x={140} y={680} size={66} rows={[{text: '…or rent them', at: at('rent') - 2, color: WHITE}]} />
      </>}
    </AbsoluteFill>
  );
};

/** 17 · "The Lakota said no." on the resistance card (the layout Ep 4 uses: who · where · when · why · how it ended). */
const NoCard: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  const a = at('The Lakota said') - 1;
  const sl = useSlap(a + 1, 1.2);
  const w = 1180;
  const h = 640;
  const f0 = a + 4;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 14, 1.0, 0, 0, 0], [at('By the summer'), 14, 1.04, 0, 10, 0]]}><></></DeskCam>
      {sl.on && <div style={{position: 'absolute', left: 120, top: 250, width: w, height: h, opacity: sl.opacity, transform: `rotate(-1.5deg) scale(${sl.scale})`}}>
        <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(16px 20px 0 ${SHADOW})`}}>
          <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(w, h, 71, {t: true, b: true}, 8), background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)'}}>
            <div style={{position: 'absolute', left: 24, right: 24, top: 96, height: 2, background: pal.mark, opacity: 0.9}} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 40, top: 38, fontFamily: JF.mono, fontSize: 28, letterSpacing: 5, color: pal.mark}}>RESISTANCE · 1</div>
        <Field tag="WHO" text="The Lakota" x={40} y={140} at={f0} size={48} />
        <Field tag="WHERE" text="The Black Hills" x={40} y={230} at={f0 + 3} size={48} />
        <Field tag="WHEN" text="1875" x={40} y={320} at={f0 + 6} size={48} />
        <Field tag="WHY" text="treaty land: the 1868 promise" x={40} y={410} at={f0 + 9} size={48} />
        <Field tag="HOW IT ENDED" text="→ Episode 4" x={40} y={500} at={f0 + 12} size={48} color={WHITE} />
      </div>}
      <Hand parts={[['The Lakota ', WHITE], ['said no.', CORAL]]} x={130} y={90} size={90} at={at('said no') - 2} />
      {g >= at("didn't") - 2 && <Lines x={1380} y={960} size={52} rows={[{text: "It didn't matter.", at: at("didn't") - 2, color: WHITE}]} />}
    </AbsoluteFill>
  );
};

// ───────────────────────── Deadwood ─────────────────────────

/** 18–19 · by summer 1876: Deadwood, on treaty land, thousands of people (two 1876 photographs). */
const Deadwood: React.FC<{detail: boolean}> = ({detail}) => {
  const a = detail ? at('had thousands') - 1 : at('By the summer') - 1;
  const b = detail ? at('So stack') : at('had thousands');
  return (
    <AbsoluteFill>
      <DeskCam k={detail ? [[a, 10, 1.08, 120, 20, 0], [b, 10, 1.16, 140, 30, 0]] : [[a, 18, 0.98, 0, 0, -1], [b, 14, 1.06, 0, 10, 0]]}>
        {!detail ? (
          <Lift x={80} y={190} w={1240} hgt={898} h={8} at={-99} rot={-1.5} seed={69}>
            <Print src={I.deadwood} size={Z.deadwood} x={0} y={0} w={1240} at={-99} seed={69} filter="grayscale(1) contrast(1.15)" />
          </Lift>
        ) : (
          <Lift x={60} y={80} w={1080} hgt={1311} h={8} at={-99} rot={1.5} seed={70}>
            <Print src={I.morrow} size={Z.morrow} x={0} y={0} w={1080} crop={[220, 100, 1480, 1000]} at={-99} seed={70} filter="grayscale(1) contrast(1.15)" />
          </Lift>
        )}
      </DeskCam>
      {!detail && <>
        <SlapTitle text="DEADWOOD · 1876" x={110} y={60} size={90} at={at('Deadwood') } seed={111} />
        <Lines x={1420} y={260} size={58} gap={90} rows={[{text: 'a mining camp', at: at('mining camp') - 2}, {text: 'on treaty land', at: at('treaty land') - 2, color: CORAL}]} />
      </>}
      {detail && <>
        <Big text="thousands" x={1180} y={140} size={120} at={at('thousands') - 1} color={WHITE} />
        <Lines x={1200} y={330} size={58} rows={[{text: 'of people', at: at('people') - 2}]} />
      </>}
      <ScrimTag text={detail ? TAG.morrow : TAG.deadwood} />
    </AbsoluteFill>
  );
};

// ───────────────────────── stack it up ─────────────────────────

/** 20 · the stack: a treaty, an expedition, a rumor, a rush, each piece landing on the last. */
const Stack: React.FC = () => {
  const a = at('So stack') - 1;
  const items: {src: string; size: [number, number]; crop?: [number, number, number, number]; w: number; x: number; y: number; rot: number; word: string; n?: number; label: string}[] = [
    {src: I.treaty1, size: Z.treaty1, crop: [0, 0, 3347, 2600], w: 480, x: 120, y: 260, rot: -6, word: 'A treaty', n: 2, label: 'a treaty'},
    {src: I.column, size: Z.column, crop: [0, 0, 3000, 1500], w: 560, x: 470, y: 340, rot: 4, word: 'An expedition', label: 'an expedition'},
    {src: I.headline, size: Z.headline, crop: [560, 700, 1900, 1800], w: 480, x: 860, y: 250, rot: -3, word: 'A rumor', label: 'a rumor'},
    {src: I.deadwood, size: Z.deadwood, w: 540, x: 1180, y: 380, rot: 5, word: 'A rush', label: 'a rush'},
  ];
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 22, 0.96, 0, 0, -1], [at('That means'), 18, 1.02, 0, 10, 0]]}>
        {items.map((it, i) => (
          <Lift key={i} x={it.x} y={it.y} w={it.w} hgt={500} h={6 + i * 6} at={at(it.word, it.n ?? 1) - 1} rot={it.rot} seed={72 + i}>
            <Print src={it.src} size={it.size} crop={it.crop} x={0} y={0} w={it.w} at={-99} seed={72 + i} filter="grayscale(1) sepia(0.15) contrast(1.15)" />
          </Lift>
        ))}
      </DeskCam>
      <Label text="stack it up" x={130} y={90} size={30} at={at('stack')} color={WHITE} />
      {items.map((it, i) => <Lines key={i} x={[130, 520, 1000, 1420][i]} y={900} size={54} rows={[{text: it.label, at: at(it.word, it.n ?? 1) - 1, color: i === 3 ? CORAL : undefined}]} />)}
    </AbsoluteFill>
  );
};

/** 21 · the payoff: a promise on paper lasted about six years, once someone found gold underneath it (the nugget lands on
 *  the treaty page). */
const Lasted: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('That means') - 1;
  const sh = shake(f, [at('underneath') + 2], 8);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <DeskCam k={[[a, 24, 0.94, 160, 0, -2], [at('So who'), 18, 1.0, 160, 10, 0]]}>
        <Lift x={1100} y={60} w={600} hgt={918} h={6} at={-99} rot={3} seed={76}>
          <Print src={I.treaty1} size={Z.treaty1} x={0} y={0} w={600} at={-99} seed={76} filter="grayscale(1) sepia(0.25) contrast(1.15) brightness(0.92)" />
        </Lift>
        <Float x={1180} y={420} w={460} hgt={460} h={24} at={at('gold', 2) - 1} rot={-8} seed={15}>
          <Prop src={I.nugget} m={M6.nugget} x={0} y={0} w={400} at={-99} filter="saturate(0.85) contrast(1.1)" />
        </Float>
      </DeskCam>
      <Label text="that means" x={120} y={150} size={30} at={at('That means')} color={WHITE} />
      <Lines x={120} y={230} size={70} gap={110} rows={[
        {text: 'a promise on paper', at: at('promise', 2) - 2},
        {text: 'lasted about six years,', at: at('lasted') - 2, color: CORAL},
        {text: 'once someone found', at: at('once') - 2, color: WHITE},
        {text: 'gold underneath it.', at: at('gold', 2) - 2, color: WHITE},
      ]} />
      <ScrimTag text={TAG.treaty} />
    </AbsoluteFill>
  );
};

/** 22 · hand-off: so who actually got the gold? The pan on the desk; held through the tail. */
const WhoGot: React.FC = () => {
  const a = at('So who') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 26, 1.0, 0, 0, 2], [END, 18, 1.1, -30, 20, 0]]}>
        <Float x={1000} y={300} w={860} hgt={660} h={12} at={a + 2} rot={6} blur={1.2} seed={16}>
          <Prop src={I.pan} m={M6.pan} x={0} y={0} w={800} at={-99} filter={PROP_F} />
        </Float>
      </DeskCam>
      <Hand parts={[['So who actually ', WHITE], ['got the gold?', '#2FE0C4']]} x={120} y={300} size={92} at={at('So who') - 2} />
    </AbsoluteFill>
  );
};

// ───────────────────────── assembly ─────────────────────────

const c = (w: string, n = 1) => at(w, n) - 1;
const SHOTS: [number, React.ReactNode, ('whip' | 'cut')?][] = [
  [0, <Year />],
  [c('First'), <Promise />, 'cut'],
  [c('In 1868'), <Treaty />, 'cut'],
  [c('It set'), <Reservation />, 'whip'],
  [c('for their'), <Article />, 'cut'],
  [c('Hold onto'), <HoldTreaty />, 'cut'],
  [c('Six years'), <Column />, 'whip'],
  [c('led by'), <Custer />, 'cut'],
  [c('Officially'), <Route />, 'cut'],
  [c('They also'), <Miners />, 'cut'],
  [c('The miners'), <Found />, 'cut'],
  [c('The reports'), <GrassRoots />, 'cut'],
  [c('Newspapers'), <Headline />, 'whip'],
  [c('Prospectors'), <Rush army={false} />, 'cut'],
  [c('The Army tried'), <Rush army />, 'cut'],
  [c('In 1875'), <Offer detail={false} />, 'whip'],
  [c('six million'), <Offer detail />, 'cut'],
  [c('The Lakota said'), <NoCard />, 'cut'],
  [c('By the summer'), <Deadwood detail={false} />, 'whip'],
  [c('had thousands'), <Deadwood detail />, 'cut'],
  [c('So stack'), <Stack />, 'cut'],
  [c('That means'), <Lasted />, 'cut'],
  [c('So who'), <WhoGot />, 'cut'],
];

const tick = (w: string, d = 2, n = 1): SfxRow => [at(w, n) - d, 'marker_tick', 0.2];
const SFX: SfxRow[] = [
  ...SHOTS.slice(1).map(([s, , k]): SfxRow => (k === 'whip' ? [s - 4, 'whip_soft', 0.25] : [s, 'whoosh', 0.2])),
  [at('1874') - 1, 'stamp', 0.24],
  tick('First'), [at('promise') - 1, 'page_turn', 0.4],
  [at('1868'), 'stamp', 0.22], tick('treaty'), tick('United'), tick('Lakota'),
  tick('huge'), [at('Black Hills') - 1, 'block_tap_soft', 0.15], [at('sacred') - 4, 'card_slide_soft', 0.15],
  [at('for their') + 1, 'page_turn', 0.35], tick('undisturbed'),
  tick('Hold onto'), tick('last episode'),
  [at('summer'), 'stamp', 0.22], [at('thousand') - 1, 'stamp', 0.16], tick('Black Hills', 2, 2),
  [at('led by') + 1, 'paper_slap_soft', 0.22], [at('George'), 'stamp', 0.22],
  tick('Officially', -2),
  [at('two miners') + 1, 'paper_slap_soft', 0.25], tick('two miners'),
  [at('found'), 'paper_slap_soft', 0.25], [at('gold'), 'stamp', 0.24],
  [at('The reports') + 2, 'paper_slap_soft', 0.2], tick('right there'), tick('grass'),
  [at('Newspapers') + 1, 'page_turn', 0.4], tick('Newspapers'), tick('rest', 4),
  tick('Prospectors'), [at('pouring') - 10, 'whoosh', 0.12], tick('keep', 6), tick('mostly', 4),
  [at('1875'), 'stamp', 0.22], tick('offered'), [at('buy'), 'paper_slap_soft', 0.2], [at('six million') + 3, 'block_tap_soft', 0.15], tick('rent'),
  [at('The Lakota said'), 'card_slide_soft', 0.2], ...[0, 3, 6, 9, 12].map((d): SfxRow => [at('The Lakota said') + 3 + d, 'tick_soft', 0.12]), tick('said no'), tick("didn't"),
  [at('Deadwood'), 'stamp', 0.22], tick('mining camp'), tick('treaty land'), [at('thousands') - 1, 'stamp', 0.16], tick('people'),
  tick('stack'), ...([['A treaty', 2], ['An expedition', 1], ['A rumor', 1], ['A rush', 1]] as [string, number][]).map(([w, n]): SfxRow => [at(w, n), 'paper_slap_soft', 0.22]),
  tick('That means', 0), tick('promise', 2, 2), tick('lasted'), tick('once'), [at('underneath') + 1, 'paper_slap_soft', 0.25],
  tick('So who'),
];

const Body: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <WShots shots={SHOTS} />
    <Sounds list={SFX} />
  </AbsoluteFill>
);

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_1874.wav" lead={LEAD} music={[
    // the promise and the expedition (j_intrigue, picking up from ch05's tease)
    {src: 'music/j_intrigue.mp3', volume: bed('j_intrigue'), startFrom: 8 * 30, to: at('Newspapers') + 6, fadeOut: 24},
    // the rush, from "Newspapers did the rest" (SUNO: aw_boomtown replaces r_temperance)
    {src: 'music/r_temperance.mp3', volume: bed('r_temperance'), from: at('Newspapers') - 6},
  ]}>
    <Body />
  </ChapterShell>
);
