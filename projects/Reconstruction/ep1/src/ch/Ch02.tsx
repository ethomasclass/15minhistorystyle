// Chapter 2 · Forty Acres. January 1865: the Union and the Confederacy, Sherman's march, the Savannah meeting (Garrison
// Frazier's answer in the New-York Tribune's minutes), Special Field Order No. 15 and the forty acres on the 3D map
// (ported from the user's favourite test, tests/src/tests/AcresTest.tsx), and the catch: use, not ownership.
// The chapter opens on 4.5 s of "Marching Through Georgia" (Prince's Band, 1916) before the first word: the narration
// starts OPEN frames later than usual (ChapterShell lead = LEAD + OPEN) and the opening shot is drawn over the gap.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch02_forty_acres.words.json';
import {clamp} from '../lib/anim';
import {DarkPaper, Sfx} from '../kit/common';
import {Finish, Highlight, Loop, PALETTES, PaletteCtx, StepCtx, Tag} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, FADE, LEAD, makeTimeline, type Narration, onScreen, Photo, useScene} from '../kit/shell';
import {BORDER_1861, centreOf, Count, PlaceTag, RegionName, Route, Slab, Stand, StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {EpBoard} from '../kit/ep1board';
import {type Box, camAt, carry, cut, DOC_F, FocusIn, PhotoShot, Sheet, type SheetCam, Slip, Spot, Swipe, TEAL} from '../kit/rc';
import {MASKS} from '../masks';
import {ACRES_TAG, acam, AcresMap, CONF, Football, MAP_TAG, OrderScrap, TopShade, ucam, US, UsMap, USP} from './ch02_maps';

const N = words as Narration;
const t = makeTimeline(N, 30);
const c = (p: string, n = 1) => cut(t, p, n);

/** Frames of "Marching Through Georgia" before the first word. */
const OPEN = 135;
/** The board after the last word. */
const EXTRA = 30;
export const CH02_FRAMES = chapterFrames(N, LEAD + OPEN) + EXTRA;

// sources
const MIL = 'img/ch02/map_military_dept_south_ga_sc_fl_1865.jpg';
const MIL_S: [number, number] = [2319, 3000];
const TRIB = 'img/ch02/savannah_meeting_minutes_ny_tribune_13feb1865.jpg';
const TRIB_S: [number, number] = [1764, 3000];
const FO1 = 'img/ch02/field_order_15_printed_jan1865_p1.jpg';
const FO1_S: [number, number] = [1542, 2572];
const FO2 = 'img/ch02/field_order_15_printed_jan1865_p2.jpg';
const FO2_S: [number, number] = [1645, 2570];
const SRC = {
  mil: 'Part of the Military Department of the South, 1865 · Library of Congress',
  sherman: 'Maj. Gen. William T. Sherman, Brady studio, 1865 · Library of Congress',
  leslie: "Contrabands following Sherman's march, Frank Leslie's, Mar. 18, 1865 · Library of Congress",
  pair: 'Sherman, Brady studio, 1865 · Edwin Stanton, Brady-Handy · Library of Congress',
  meldrim: "Meldrim house, Sherman's headquarters, Savannah, 1865 · Library of Congress",
  trib: 'New-York Daily Tribune, Feb. 13, 1865 · Library of Congress',
  fo1: 'Special Field Orders No. 15, Jan. 16, 1865 (period printing) · Library of Congress',
  fo2: 'Special Field Orders No. 15, page 2, Jan. 16, 1865 · Library of Congress',
  moore: 'Freedpeople, Hopkinson plantation, Edisto Island, 1862 · Henry P. Moore · Library of Congress',
  helena: 'Going to the cotton field, St. Helena Island, S.C., 1863 · Hubbard & Mix · Library of Congress',
};

// line boxes (source px), each drawn on its page and checked
const FRAZIER: Box = [145, 405, 382, 24];            // "Garrison Frazier, aged 67 years,"
const BOUGHT: Box = [60, 456, 322, 26];              // "he bought himself and wife,"
const Q1: Box = [190, 2540, 522, 26];                // "The way we can best take care of ourselves"
const Q2: Box = [42, 2568, 678, 26];                 // "is to have land, and turn it and till it by our own labor"
const HEAD: Box[] = [[228, 403, 372, 34], [355, 440, 120, 32]];   // "Special Field Orders, / No. 15."
const FORTY: Box = [440, 2134, 222, 32];             // "(40) forty acres" (p1, last line)
const SIG: Box[] = [[255, 1870, 180, 32], [355, 1903, 560, 34]];  // p2 "By Order of / Major General W. T. Sherman,"
const POSS: Box = [385, 1338, 430, 40];              // p2 "a possessory title in writing,"

// the shots
const S1 = c('The Civil War'), S2 = c('A Union army'), S3 = c('marched across'), S4 = c('Thousands of'), S5 = c('So Sherman'), S6 = c('sat down');
const S7 = c('Their spokesman'), S8 = c('The way we'), S9 = c('Translation'), S10 = c('Sherman signed'), S11 = c('A strip'), S12 = c('The Army lent');
const S13 = c('By summer'), S14 = c('Edisto Island was'), S15 = c("But here's the catch"), B = c('And nobody in Washington');

/** Show children only before frame `out`. */
const Until: React.FC<{out: number; children: React.ReactNode}> = ({out, children}) => (useCurrentFrame() < out ? <>{children}</> : null);

/** A hard cut lands with a whoosh; titles with a stamp. */
const Sounds: React.FC = () => (
  <>
    {[S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15].map((f) => <Sfx key={f} at={f - 3} src="sfx/whoosh.wav" volume={0.22} />)}
    {[t.at('Union'), t.at('Confederacy'), t.at('Give us land'), t.at('Special Field'), t.at('forty acres and a mule')].map((f) => <Sfx key={f} at={f} src="sfx/stamp.wav" volume={0.3} />)}
  </>
);

// ---------------------------------------------------------------------------------------------------------- shots
/** January 1865: the Army's 1865 map of the coast. `shift` lets the opening draw it before the narration starts. */
const Open: React.FC<{shift?: number}> = ({shift = 0}) => {
  const f = useCurrentFrame() - shift;
  const cam = camAt([[-OPEN, {x: 1160, y: 1560, z: 0.34}], [S1, {x: 860, y: 2200, z: 0.72}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={MIL} size={MIL_S} cam={cam} seed="mil" filter="grayscale(1) sepia(0.2) contrast(1.3) brightness(1.02)" />
      <Slip text="January 1865" x={1240} y={170} rot={-2} at={t.at('January') - 2 + shift} />
      <Tag text={SRC.mil} />
    </AbsoluteFill>
  );
};

const OHIO = centreOf(US.states['USA:Ohio']);
const BAMA = centreOf(US.states['USA:Alabama']);
const AWAY = {dx: 95, dy: 115};

/** The Union rises teal, state by state; the South rises brick and breaks away. */
const Sides: React.FC = () => {
  const keys = [ucam(S1, 3700, 2300, 0.5, 36, -3), ucam(t.at('The South'), 3720, 2420, 0.54, 40, -4), ucam(S2, 3720, 2520, 0.58, 42, -6)];
  const u1 = t.at('Union'), c1 = t.at('Confederacy');
  return (
    <AbsoluteFill>
      <UsMap keys={keys}>
        {(api) => (
          <>
            <StateTiles api={api} names={[...UNION_FREE_1861, ...BORDER_1861]} at={t.at('The North')} stagger={1} h={24} color={TEAL} layers={5} />
            <Slab api={api} region="confed" at={t.at('The South')} h={34} dur={14} color={CONF} layers={8}
              slide={{at: t.at('broke away'), dur: 20, dx: AWAY.dx, dy: AWAY.dy, lift: 26}} />
            <Stand api={api} at={OHIO} z={40} show={u1 + 2}><RegionName text="UNION" size={58} /></Stand>
            <Stand api={api} at={[BAMA[0] + 120 + AWAY.dx, BAMA[1] + AWAY.dy]} z={70} show={c1 + 2}><RegionName text="CONFEDERACY" size={58} /></Stand>
          </>
        )}
      </UsMap>
      <TopShade />
      <Slip text="the Civil War, 1861–65" x={1250} y={150} rot={-2} at={t.at('Civil War') - 2} out={u1} />
      <Until out={c1}>
        <Highlight text="UNION" x={110} y={100} size={84} at={u1} seed={21} rot={-2} />
        <Definition term="Union" def="the United States: the North in the Civil War" at={u1 + 9} x={120} y={860} />
      </Until>
      <Slip text="11 states" x={1330} y={300} size={66} rot={3} at={t.at('11 states') - 2} />
      <Highlight text="CONFEDERACY" x={110} y={100} size={84} at={c1} seed={22} rot={-2} />
      <Definition term="Confederacy" def="the 11 Southern states that broke away, 1861–65" at={c1 + 9} x={120} y={860} />
      <Slip text="to protect slavery" x={1250} y={420} coral at={t.at('protect slavery') - 2} />
      <Sfx at={t.at('The North')} src="sfx/tick.wav" volume={0.35} />
      <Tag text={MAP_TAG} />
    </AbsoluteFill>
  );
};

/** A full-bleed picture with its tag. */
const Bleed: React.FC<{src: string; size: [number, number]; fx: number; fy: number; z0: number; z1: number; a: number; b: number; tag: string; mask?: (typeof MASKS)[keyof typeof MASKS];
  children?: React.ReactNode; over?: (p: ReturnType<typeof onScreen>) => React.ReactNode}> = ({src, size, fx, fy, z0, z1, a, b, tag, mask, children, over}) => (
  <AbsoluteFill>
    <Photo src={src} size={size} fx={fx} fy={fy} z0={z0} z1={z1} a={a} b={b} mask={mask} traceAt={a + 6}>{(p) => over?.(onScreen(p))}</Photo>
    {children}
    <Tag text={tag} />
  </AbsoluteFill>
);

/** Sherman's march to the sea, Atlanta to Savannah, on the map. */
const March: React.FC = () => {
  const keys = [ucam(S3, 4020, 2820, 1.45, 42, -6), ucam(S4, 4050, 2840, 1.62, 44, -8)];
  const pts = ['Atlanta', 'Milledgeville', 'Millen', 'Savannah'].map((k) => USP[k]);
  return (
    <AbsoluteFill>
      <UsMap keys={keys}>
        {(api) => (
          <>
            <Route api={api} pts={pts} at={t.at('marched across')} dur={34} color={TEAL} width={9} bow={0.08} />
            <Stand api={api} at={USP.Atlanta} show={S3 + 2}><PlaceTag text="Atlanta" size={34} /></Stand>
            <Stand api={api} at={USP.Savannah} show={t.at('the coast')}><PlaceTag text="Savannah" size={34} /></Stand>
          </>
        )}
      </UsMap>
      <Slip text="Nov.–Dec. 1864" x={1300} y={170} rot={-2} at={t.at('marched across') + 4} />
      <Tag text={MAP_TAG} />
    </AbsoluteFill>
  );
};

/** Sherman and the Secretary of War: two creased prints on the desk. */
const Pair: React.FC = () => {
  const f = useCurrentFrame();
  const a2 = t.at('Secretary of War') - 1;
  const dx = carry(f, S5, S6);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translateX(${dx}px)`}}>
        <FocusIn at={S5}><Img src={staticFile('img/ch02/cr_sherman.png')} style={{position: 'absolute', left: 300, top: 110, width: 480, transform: 'rotate(-3deg)', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} /></FocusIn>
        <FocusIn at={a2}><Img src={staticFile('img/ch02/cr_stanton.png')} style={{position: 'absolute', left: 1060, top: 150, width: 540, transform: 'rotate(2.5deg)', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.7))'}} /></FocusIn>
      </AbsoluteFill>
      <Slip text="Sherman" x={420} y={830} rot={-3} at={S5 + 4} />
      <Slip text="Edwin Stanton, Secretary of War" x={1000} y={880} rot={2} size={56} at={a2 + 2} />
      <Sfx at={S5} src="sfx/tick.wav" volume={0.35} />
      <Sfx at={a2} src="sfx/tick.wav" volume={0.35} />
      <Tag text={SRC.pair} />
    </AbsoluteFill>
  );
};

/** Frazier in the Tribune's list of the ministers: his name and age, then how he got free. No picture of him is known. */
const Frazier: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 432, z: 1.35, tilt: 30, dof: 2.6, band: 55};
  const cam = camAt([[S7, {...L, x: 250}], [t.at('bought his'), {...L, x: 330, y: 450, dofY: 450}], [S8, {...L, x: 360, y: 458, dofY: 458}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={TRIB} size={TRIB_S} cam={cam} seed="trib" filter={DOC_F} offset={[carry(f, S7, S8), 0]}>
        <Swipe lines={[FRAZIER]} from={t.at('Garrison Frazier')} to={t.end('67-year-old')} seed="fz" />
        <Swipe lines={[BOUGHT]} from={t.at('bought his')} to={t.end('freedom')} seed="fb" />
      </Sheet>
      <Slip text="no photograph of him is known" x={1060} y={800} size={54} at={t.at('minister') - 2} />
      <Sfx at={t.at('Garrison Frazier')} src="sfx/marker_tick.wav" volume={0.25} />
      <Tag text={SRC.trib} />
    </AbsoluteFill>
  );
};

/** His answer, swiped as it's said. */
const Answer: React.FC = () => {
  const f = useCurrentFrame();
  const L: SheetCam = {x: 0, y: 2556, z: 1.3, tilt: 32, dof: 2.6, band: 60};
  const cam = camAt([[S8, {...L, x: 330}], [t.at('is to have'), {...L, x: 300, y: 2582, dofY: 2582}], [t.end('labor'), {...L, x: 560, y: 2582, dofY: 2582}], [S9, {...L, x: 600, y: 2582, dofY: 2582}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={TRIB} size={TRIB_S} cam={cam} seed="trib" filter={DOC_F} offset={[carry(f, S8, S9), 0]}>
        <Swipe lines={[Q1]} from={t.at('The way we')} to={t.end('ourselves')} seed="q1" />
        <Swipe lines={[Q2]} from={t.at('is to have')} to={t.end('labor')} seed="q2" />
      </Sheet>
      <Sfx at={t.at('is to have')} src="sfx/marker_tick.wav" volume={0.25} />
      <Tag text={SRC.trib} />
    </AbsoluteFill>
  );
};

/** Translation: the rest of the page steps back; GIVE US LAND. */
const Translation: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt([[S9, {x: 760, y: 2470, z: 0.84}], [S10, {x: 760, y: 2470, z: 0.9}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={TRIB} size={TRIB_S} cam={cam} seed="trib" filter={DOC_F}>
        <Swipe lines={[Q1, Q2]} from={-20} to={-19} seed="q3" />
        <Spot size={TRIB_S} boxes={[Q1, Q2]} at={S9 + 2} id="trq" />
      </Sheet>
      <Slip text="“don't give us charity”" x={1080} y={160} rot={-2} size={58} at={t.at("don't give us") - 2} />
      <Highlight text="GIVE US LAND." x={560} y={760} size={110} at={t.at('Give us land')} seed={23} rot={-2} />
      <Slip text="4 days later" x={1420} y={290} rot={3} at={t.at('Four days later') - 2} />
      <Sfx at={S9 + 2} src="sfx/tick.wav" volume={0.4} />
      <Tag text={SRC.trib} />
    </AbsoluteFill>
  );
};

/** The order itself: its heading swiped as it's named. The title carries over the cut onto the map. */
const OUT1 = S11 + 12;
const OrderTitle: React.FC = () => (
  <Until out={OUT1}>
    <Highlight text="SPECIAL FIELD ORDER NO. 15" x={110} y={96} size={70} at={t.at('Special Field')} seed={24} rot={-2} />
    <Definition term="Special Field Order No. 15" def="Sherman's order setting aside coast land for freed families" at={t.at('Special Field') + 9} x={120} y={860} />
  </Until>
);

const Order: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt([[S10, {x: 700, y: 560, z: 0.95}], [S11, {x: 700, y: 600, z: 1.04}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <FocusIn at={S10}>
        <Sheet src={FO1} size={FO1_S} cam={cam} seed="fo1" filter={DOC_F}>
          <Swipe lines={HEAD} from={t.at('Special Field')} to={t.end('Order No. 15') + 4} seed="hd" />
        </Sheet>
      </FocusIn>
      <OrderTitle />
      <Slip text="Savannah, Jan. 16, 1865" x={1240} y={330} rot={2} size={56} at={S10 + 6} />
      <Tag text={SRC.fo1} />
    </AbsoluteFill>
  );
};

/** The forty acres: the strip rises from Charleston to the St. Johns, the camera dives to Edisto, the plots pop up. */
const Acres: React.FC = () => {
  const keys = [acam(S11, -1100, 2454, 0.115, 46, -24), acam(t.at('islands included'), -800, 1554, 0.14, 46, -18), acam(t.at('Up to'), -30, 14, 2.0, 54, -8),
    acam(S12, -18, 10, 2.3, 56, -5)];
  const sc = t.at('South Carolina');
  return (
    <AbsoluteFill>
      <AcresMap keys={keys} strip={t.at('strip')} settle={t.at('freed families')} labels={[sc, sc + 8, t.at('Florida')]} labelsOut={t.at('freed families') - 2}
        edisto={t.at('set aside')} rise={t.at('Up to') + 2} />
      <TopShade />
      <OrderTitle />
      <OrderScrap src={FO1} size={FO1_S} cx={570} cy={2150} s={1.25} w={940} h={96} x={110} y={100} at={t.at('Up to') - 1}
        swipe={{lines: [FORTY], from: t.at('40 acres'), to: t.end('acres') + 4}} seed="fo40" />
      <Football x={1440} y={250} at={t.at('about 30') - 2} />
      <Tag text={ACRES_TAG} />
    </AbsoluteFill>
  );
};

/** Some got Army mules: Moore's 1862 photograph on Edisto, the mule cart. */
const MOORE_S: [number, number] = [3000, 2055];
const Mule: React.FC = () => {
  const m = t.at('forty acres and a mule');
  return (
    <Bleed src="img/ch01/edisto_freedpeople_hopkinson_plantation_1862_moore.jpg" size={MOORE_S} fx={1500} fy={1150} z0={1.3} z1={1.42} a={S12} b={S13} tag={SRC.moore}
      over={(S) => {
        const [x, y] = S(1880, 1440);
        return <Loop cx={x} cy={y} rx={300} ry={230} at={t.at('mules')} seed={7} tilt={-6} />;
      }}>
      <Slip text="Army mules" x={1380} y={250} rot={2} at={t.at('mules') + 2} />
      <Highlight text="FORTY ACRES AND A MULE" x={110} y={96} size={74} at={m} seed={25} rot={-2} />
      <Definition term="forty acres and a mule" def="land for freed families, from Sherman's order" at={m + 9} x={120} y={860} />
    </Bleed>
  );
};

/** About 40,000 people farming the land by summer (St. Helena Island, 1863: the same coast). */
const Farming: React.FC = () => (
  <PhotoShot src="img/ch02/cr_sthelena.png" size={[1100, 1072]} a={S13} b={S14} w={660} x={530} y={540} rot={-2} tag={SRC.helena}>
    <Slip text="by summer 1865" x={1010} y={170} rot={-2} at={t.at('By summer') - 2} />
    <div style={{position: 'absolute', left: 1010, top: 360}}><Count to={40000} at={t.at('40,000')} dur={24} size={170} prefix="≈ " /></div>
    <Slip text="people farming the land" x={1020} y={590} rot={2} at={t.at('farming') - 2} />
  </PhotoShot>
);

/** Edisto Island was part of it: back on the map, the island covered in plots. */
const EdistoPart: React.FC = () => (
  <AbsoluteFill>
    <AcresMap keys={[acam(S14, -10, 4, 2.5, 57, -2), acam(S15, -60, 60, 1.25, 53, -8)]} strip={-600} settle={-560} labels={[1e7, 1e7, 1e7]} labelsOut={1e7}
      edisto={-400} rise={-300} />
    <Tag text={ACRES_TAG} />
  </AbsoluteFill>
);

/** The catch: a military order, and a "possessory title": use, not ownership. */
const Catch: React.FC = () => {
  const f = useCurrentFrame();
  const mv = t.at('It let them');
  const cam = camAt([[S15, {x: 640, y: 1880, z: 1.0}], [mv - 10, {x: 660, y: 1890, z: 1.06}], [mv + 14, {x: 640, y: 1380, z: 1.2}], [B, {x: 650, y: 1380, z: 1.28}]], f);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sheet src={FO2} size={FO2_S} cam={cam} seed="fo2" filter={DOC_F}>
        <Swipe lines={SIG} from={t.at('military order')} to={t.end('military order') + 6} seed="sg" />
        <Swipe lines={[POSS]} from={t.at('use the land')} to={t.end('use the land') + 4} seed="ps" />
        <Spot size={FO2_S} boxes={[POSS]} at={t.at("didn't make")} id="sp2" />
      </Sheet>
      <Slip text="a military order" x={1240} y={200} rot={-2} at={t.at('military order') - 2} out={mv} />
      <Slip text="in wartime" x={1300} y={330} rot={2} at={t.at('written in wartime') - 2} out={mv} />
      <Slip text="use ≠ own" x={1300} y={760} size={78} coral rot={-3} at={t.at("didn't make") - 2} />
      <Tag text={SRC.fo2} />
    </AbsoluteFill>
  );
};

/** Music (MUSIC.md): banjo and fiddle (rc_jubilo) under the whole chapter; "Marching Through Georgia" only before the
 *  first word (Opening). */
const Body: React.FC = () => {
  const scene = useScene([
    [0, <Open key="o" />],
    [S1, <Sides key="s" />],
    [S2, <Bleed key="sh" src="img/ch02/sherman_brady_1865.jpg" size={[1941, 3000]} fx={980} fy={980} z0={1.0} z1={1.07} a={S2} b={S3} tag={SRC.sherman} mask={MASKS.sherman}>
      <Slip text="Gen. William T. Sherman" x={1240} y={820} rot={-2} at={t.at('General') - 2} />
    </Bleed>],
    [S3, <March key="m" />],
    [S4, <Bleed key="l" src="img/ch02/contrabands_following_sherman_leslies_18mar1865.jpg" size={[3000, 2392]} fx={1500} fy={930} z0={1.15} z1={1.24} a={S4} b={S5} tag={SRC.leslie}>
      <Slip text="no plan for them" x={1280} y={150} coral rot={2} at={t.at('no plan') - 2} />
    </Bleed>],
    [S5, <Pair key="p" />],
    [S6, <Bleed key="h" src="img/ch02/meldrim_house_sherman_hq_savannah_1865.jpg" size={[2808, 3000]} fx={1404} fy={1780} z0={1.0} z1={1.07} a={S6} b={S7} tag={SRC.meldrim}>
      <Slip text="20 Black ministers" x={140} y={170} rot={-2} at={t.at('20 Black') - 2} />
      <Slip text="Savannah · Jan. 12, 1865" x={1150} y={150} rot={2} size={56} at={t.at('in Savannah') - 2} />
      <Slip text="“what do you want?”" x={1180} y={300} coral rot={-2} at={t.at('what do you want') - 2} />
    </Bleed>],
    [S7, <Frazier key="fz" />],
    [S8, <Answer key="an" />],
    [S9, <Translation key="tr" />],
    [S10, <Order key="or" />],
    [S11, <Acres key="ac" />],
    [S12, <Mule key="mu" />],
    [S13, <Farming key="fa" />],
    [S14, <EdistoPart key="ed" />],
    [S15, <Catch key="ca" />],
    [B, <EpBoard key="b" ch={2} from={B} at={t.at('whether it would last')} />],
  ]);
  return <>{scene}<Sounds /></>;
};

/** The opening before the narration: logo break, then the 1865 map fades up under "Marching Through Georgia". */
const Opening: React.FC = () => {
  const f = useCurrentFrame();
  const up = interpolate(f, [0, FADE], [0, 1], clamp);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{opacity: up}}>
          <Open shift={OPEN} />
          <Finish vignette={0.3} />
        </AbsoluteFill>
        <Audio src={staticFile('music/period/marching_through_georgia_princes_band_1916.mp3')} startFrom={78}
          volume={(v) => interpolate(v, [0, 12, OPEN - 26, OPEN + 6], [0, 0.42, 0.42, 0], clamp)} />
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};

export const Ch02: React.FC = () => (
  <AbsoluteFill>
    <ChapterShell n={N} audio="audio/ch02_forty_acres.wav" lead={LEAD + OPEN} extra={EXTRA} music={[{src: 'music/rc_jubilo.mp3', volume: 0.22}]}>
      <Body />
    </ChapterShell>
    <Sequence from={LEAD} durationInFrames={OPEN + FADE} layout="none">
      <Opening />
    </Sequence>
  </AbsoluteFill>
);
