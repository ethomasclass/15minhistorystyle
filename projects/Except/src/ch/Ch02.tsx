// Chapter 2 · One Week in July: Gettysburg (three days, Pickett's Charge, about 50,000 lost), Vicksburg the next day
// (47-day siege, the caves), the Mississippi and the Confederacy cut in two, which win mattered more, and Grant.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import mapData from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch02_one_week.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Desk} from '../kit/bs';
import {sizeOf} from '../kit/dk';
import {CORAL, ORANGE, TwoViews, WHITE} from '../kit/except';
import {Person} from '../kit/figures';
import {
  Border, type Cam3, CONFEDERACY_1861, Count, Hand, MAP3D, Map3D, type MapData, PlaceTag, Route, Slab, Stake, Stand, StateTiles, UNION_FREE_1861, BORDER_1861,
} from '../kit/map3d';
import {Backdrop, ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

const D = mapData as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;
const U = (n: string[]) => n.map((s) => `USA:${s}`);
const WEST_OF_RIVER = U(['Texas', 'Arkansas', 'Louisiana']);
const EAST_CONFED = CONFEDERACY_1861.filter((s) => !WEST_OF_RIVER.includes(s));

const TOWN = 'img/ch02/gettysburg_town_from_cemetery_hill_1863.jpg';
const FORBES = 'img/ch02/gettysburg_little_round_top_forbes_1863.jpg';
const FIELD = 'img/ch02/gettysburg_town_from_northwest_1863.jpg';
const BATTLE = 'img/ch02/gettysburg_battle_july3_currier_1863.jpg';
const SIEGE = 'img/ch02/vicksburg_siege_grant_lithograph_1863.jpg';
const CAVES = 'img/ch02/vicksburg_cave_life_volck_1864.jpg';
const GRANT = 'img/ch02/grant_portrait_brady.jpg';
const GRANT_ENG = 'img/ch02/grant_lieutenant_general_buttre_1864.jpg';

/** July 1st, 1863: a crossroads town in Pennsylvania. */
const Town: React.FC<{t: TL}> = ({t}) => (
  <Photo src={TOWN} size={sizeOf(TOWN)} fx={1500} fy={1250} z0={1.15} z1={1.24} a={-10} b={t.at('They fight')} bw="grayscale(1) contrast(1.25) brightness(0.92)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.75) 0%, rgba(10,9,7,0.3) 34%, rgba(0,0,0,0) 50%)'}} />
        <Highlight text="JULY 1, 1863" x={110} y={90} size={96} at={t.at('July') - 1} seed={21} rot={-2} />
        <Note text="Lee's army collides with the Union army" x={130} y={260} size={50} rot={-3} at={t.at('collides') - 2} color={WHITE} />
        <Note text="a small crossroads town" x={980} y={690} size={56} rot={-3} at={t.at('crossroads') - 2} />
        <Note text="Gettysburg, Pennsylvania" x={960} y={810} size={60} rot={-3} at={t.at('Gettysburg') - 2} color={CORAL} />
        <Tag text="Timothy O'Sullivan, Gettysburg from Cemetery Hill, 1863 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** Three days. Forbes's sketch from Little Round Top. */
const ThreeDays: React.FC<{t: TL}> = ({t}) => (
  <Photo src={FORBES} size={sizeOf(FORBES)} fx={1500} fy={900} z0={1.08} z1={1.16} a={t.at('They fight') - 1} b={t.at('On the third')} bw="grayscale(1) contrast(1.45) brightness(0.95)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.7) 0%, rgba(0,0,0,0) 32%)'}} />
        <Note text="they fight for three days" x={110} y={100} size={66} rot={-3} at={t.at('three days') - 3} />
        <Tag text="Edwin Forbes, view from the summit of Little Round Top, July 2, 1863 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** Pickett's Charge, drawn: the attackers cross the open field at the Union line; more than half are lost. */
const Charge: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const pal = usePal();
  const a = t.at('On the third') - 1;
  const go = t.at('About') ;
  const stop = t.at('Union cannons');
  const lost = t.at('More than half');
  const cols = 12;
  const rows = 4;
  const adv = interpolate(f, [go, stop + 20], [0, 560], clamp);
  const lineX = 1560;
  return (
    <AbsoluteFill>
      <Backdrop src={BATTLE} size={sizeOf(BATTLE)} a={a} dim={0.28} />
      <Highlight text="PICKETT'S CHARGE" x={110} y={70} size={90} at={t.at("Pickett's")} seed={22} rot={-2} />
      <Definition term="Pick·ett's Charge" def="Lee's huge attack on the center of the Union line, July 3, 1863" at={t.at("Pickett's") + 9} x={120} y={240} w={1100} />
      {/* the Union line on the ridge */}
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        <path d={`M${lineX},420 Q${lineX + 18},560 ${lineX - 6},700 T${lineX + 4},900`} fill="none" stroke={pal.mark} strokeWidth={9} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - interpolate(g, [a + 2, a + 12], [0, 1], clamp)} />
        {g >= t.at('nearly a mile') - 2 && (
          <path d={`M330,905 L${lineX - 40},905`} fill="none" stroke={ORANGE} strokeWidth={5} strokeDasharray="22 16"
            pathLength={1} strokeDashoffset={0} opacity={interpolate(g, [t.at('nearly a mile') - 2, t.at('nearly a mile') + 4], [0, 1], clamp)} />
        )}
      </svg>
      <Note text="the Union line" x={lineX - 120} y={330} size={48} rot={-3} at={t.at('center') - 2} />
      {Array.from({length: cols * rows}).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = 330 + c * 46 + r * 14 + adv;
        const y = 600 + r * 92;
        const down = i % 20 < 11; // 11 of every 20: more than half
        const isLost = g >= lost && down;
        return <Person key={i} x={x} y={y} h={70} at={a + 4 + c} hat={false} color={isLost ? CORAL : '#f4efe6'} dashed={isLost} />;
      })}
      <Note text="nearly a mile of open field" x={660} y={918} size={46} rot={-1} at={t.at('nearly a mile') - 2} color={ORANGE} />
      {g >= t.at('12500') - 2 && <div style={{position: 'absolute', left: 1280, top: 240}}><Count to={12500} at={t.at('12500') - 2} dur={24} prefix="about " suffix=" men" size={64} color={WHITE} /></div>}
      {g >= stop && Array.from({length: 6}).map((_, i) => {
        const k = (g - stop - i * 4) % 24;
        return k >= 0 && k < 8 && <div key={i} style={{position: 'absolute', left: lineX - 30 + (i % 2) * 40, top: 450 + i * 80, width: 26, height: 26, borderRadius: 13, background: '#ffd7b0',
          boxShadow: `0 0 26px 10px ${CORAL}`, opacity: 1 - k / 8}} />;
      })}
      <Note text="more than half: killed, wounded or captured" x={110} y={410} size={46} rot={-2} at={lost - 2} color={CORAL} />
      <Tag text="Diagram · Pickett's Charge, July 3, 1863 (not to scale)" />
    </AbsoluteFill>
  );
};

/** Lee retreats to Virginia and never invades the North again. */
const Retreat: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Lee retreats') - 1;
  const keys: Cam3[] = [{f: a, x: 3760, y: 1880, z: 0.95, tilt: 42, rot: -4}, {f: t.at('In three days'), x: 3720, y: 1960, z: 0.85, tilt: 40, rot: -2}];
  const pts = [pl.gettysburg, [3720, 1780], [3640, 1900], [3600, 2030]];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.5}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={14} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={-20} stagger={0} h={18} color={MAP3D.grey} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={-20} stagger={0} h={30} color={CORAL} />
            <Stand api={api} at={pl.gettysburg} show={-20}><Stake color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.gettysburg[0] - 280, pl.gettysburg[1] - 30]} z={90} show={-20}><PlaceTag text="Gettysburg" size={32} /></Stand>
            <Route api={api} pts={pts} at={a + 4} dur={30} color={MAP3D.us} width={11} bow={0} dashed />
            <Stand api={api} at={[3330, 2120]} z={60} show={t.at('Virginia') - 2}><Hand text="back to Virginia" size={64} color={MAP3D.us} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.75) 0%, rgba(0,0,0,0) 30%)'}} />
        <Note text="Lee retreats" x={110} y={90} size={66} rot={-3} at={a + 2} color={WHITE} />
        <Note text="he never invades the North again" x={130} y={210} size={56} rot={-3} at={t.at('never invade') - 2} color={CORAL} />
        <Tag text="Map · Lee's retreat from Gettysburg, July 1863" />
      </AbsoluteFill>
    </>
  );
};

/** About 50,000 lost in three days, over the empty fields. */
const Cost: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In three days') - 1;
  const g = useGFrame();
  return (
    <Photo src={FIELD} size={sizeOf(FIELD)} fx={1500} fy={760} z0={1.12} z1={1.2} a={a} b={t.at('The very next')} bw="grayscale(1) contrast(1.25) brightness(0.55)">
      {() => (
        <>
          <Note text="in three days, the two armies lose" x={110} y={110} size={54} rot={-3} at={a + 2} color={WHITE} />
          {g >= t.at('50000') - 2 && <div style={{position: 'absolute', left: 110, top: 260}}><Count to={50000} at={t.at('50000') - 2} dur={26} prefix="about " size={150} color={CORAL} /></div>}
          <Note text="killed, wounded, captured or missing" x={130} y={470} size={56} rot={-3} at={t.at('men killed') - 2} />
          <Tag text="Gettysburg from the northwest, 1863 · Library of Congress" />
        </>
      )}
    </Photo>
  );
};

/** The map of the week: Gettysburg, then Vicksburg far to the west (camera shared with the Mississippi beat). */
const WEEK_KEYS = (a: number, b: number): Cam3[] => [{f: a, x: 2750, y: 2250, z: 0.36, tilt: 28, rot: 0}, {f: b, x: 2700, y: 2280, z: 0.38, tilt: 34, rot: -4}];

const Week: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('The very next') - 1;
  const vb = t.at('Vicksburg');
  return (
    <>
      <Map3D data={D} keys={WEEK_KEYS(a, t.at('Soon the'))} states={0.5} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={14} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={-20} stagger={0} h={18} color={MAP3D.grey} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={-20} stagger={0} h={36} color={CORAL} />
            <Stand api={api} at={pl.gettysburg} show={-20}><Stake color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.gettysburg[0] - 380, pl.gettysburg[1] + 300]} z={80} show={-20}><PlaceTag text="Gettysburg · July 1 to 3" size={34} /></Stand>
            <Stand api={api} at={pl.vicksburg} show={vb - 2}><Stake color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.vicksburg[0] - 360, pl.vicksburg[1] + 120]} z={80} show={vb}><PlaceTag text="Vicksburg · July 4" size={34} /></Stand>
            <Stand api={api} at={[pl.vicksburg[0] - 300, pl.vicksburg[1] + 330]} z={60} show={t.at('surrenders') - 2}><Hand text="surrenders to Grant" size={64} color={MAP3D.us} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.75) 0%, rgba(0,0,0,0) 30%)'}} />
        <Highlight text="JULY 4, 1863" x={110} y={90} size={86} at={t.at('July 4th') - 1} seed={23} rot={-2} />
        <Note text="the very next day, far to the west" x={130} y={200} size={44} rot={-3} at={t.at('far to') - 2} color={WHITE} />
        {g >= t.at('47day') - 2 && <div style={{position: 'absolute', left: 1300, top: 110}}><Count to={47} at={t.at('47day') - 2} dur={18} suffix="-day siege" size={70} color={WHITE} /></div>}
        <Tag text="Map · Gettysburg and Vicksburg, July 1863" />
      </AbsoluteFill>
    </>
  );
};

/** The siege of Vicksburg: surrounded, starved out, families in caves. */
const Siege: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("Grant's army") - 1;
  return (
    <Desk a={a} push={0.03}>
      <CropCard src={SIEGE} size={sizeOf(SIEGE)} x={120} y={150} w={860} h={520} fx={1500} fy={1220} scale={0.4} rot={-2} at={a} />
      <CropCard src={CAVES} size={sizeOf(CAVES)} x={1180} y={200} w={560} h={520} fx={1500} fy={1180} scale={0.42} rot={3} at={t.at('families') - 2} />
      <Note text="Grant's army surrounds the city" x={150} y={760} size={52} rot={-3} at={t.at('surrounded') - 2} color={WHITE} />
      <Note text="and starves it out" x={170} y={860} size={58} rot={-3} at={t.at('starved') - 2} color={CORAL} />
      <Note text="families dug caves" x={1180} y={760} size={56} rot={-3} at={t.at('caves') - 2} />
      <Note text="to hide from the shelling" x={1140} y={870} size={44} rot={-3} at={t.at('shelling') - 2} color={WHITE} />
      <Tag text="The Siege of Vicksburg, lithograph, 1863 · Adalbert Volck, Cave life in Vicksburg, etching, 1864 · Library of Congress" />
    </Desk>
  );
};

/** The Union holds the Mississippi: the Confederacy is cut in two (the Anaconda Plan from Video 1). */
const CutInTwo: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Soon the') - 1;
  const draw = t.at('whole Mississippi') - 4;
  const slide = {at: t.at('cut in two') - 2, dur: 30, dx: -180, dy: 40, lift: 30};
  return (
    <>
      <Map3D data={D} keys={WEEK_KEYS(a, t.at('So which'))} states={0.5} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={14} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={-20} stagger={0} h={18} color={MAP3D.grey} />
            <StateTiles api={api} names={EAST_CONFED} at={-20} stagger={0} h={36} color={CORAL} />
            {WEST_OF_RIVER.map((s) => <Slab key={s} api={api} d={D.states[s]} clipLand={false} at={-20} h={36} color={CORAL} layers={6} slide={slide} />)}
            <Stand api={api} at={pl.vicksburg} show={-20}><Stake color={MAP3D.us} /></Stand>
            <Border api={api} d={D.lines.lowerMississippi} at={draw} dur={24} color={MAP3D.mexico} width={9} z={44} />
            <Stand api={api} at={[2450, 2450]} z={60} show={t.at('cut in two')}><Hand text="cut in two" size={84} color={MAP3D.mexico} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.75) 0%, rgba(0,0,0,0) 30%)'}} />
        <Note text="the Union controls the whole Mississippi" x={110} y={90} size={54} rot={-3} at={draw} />
        <Note text="remember the Anaconda Plan?" x={130} y={210} size={50} rot={-3} at={t.at('Remember') - 2} color={WHITE} />
        <Tag text="Map · the Mississippi River and the Confederacy, July 1863" />
      </AbsoluteFill>
    </>
  );
};

/** Which win mattered more? */
const WhichWin: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('So which') - 1;
  return (
    <AbsoluteFill>
      <Backdrop src={FIELD} size={sizeOf(FIELD)} a={a} dim={0.3} />
      <Note text="which win mattered more?" x={130} y={74} size={56} rot={-2} at={a + 2} color={WHITE} />
      <TwoViews a={a} left="GETTYSBURG" right="VICKSBURG" top={200} leftAt={a + 2} rightAt={a + 2} />
      <CropCard src={BATTLE} size={sizeOf(BATTLE)} x={180} y={290} w={600} h={380} fx={1500} fy={1000} scale={0.3} rot={-2} at={a + 3} />
      <CropCard src={SIEGE} size={sizeOf(SIEGE)} x={1100} y={290} w={600} h={380} fx={1500} fy={1220} scale={0.3} rot={2} at={a + 5} />
      <Note text="ended Lee's invasion" x={180} y={740} size={60} rot={-3} at={t.at('Gettysburg ended') - 2} />
      <Note text="split the South" x={1120} y={740} size={60} rot={-3} at={t.at('Vicksburg split') - 2} color={CORAL} />
      <Note text="people still argue about it" x={640} y={900} size={50} rot={-2} at={t.at('People still') - 2} color={WHITE} />
      <Tag text="Currier & Ives, The Battle of Gettysburg, 1863 · The Siege of Vicksburg, 1863 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** Lincoln noticed who won at Vicksburg: Grant. */
const Grant: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('But Lincoln') - 1;
  return (
    <Desk a={a} push={0.03}>
      <CropCard src={GRANT} size={sizeOf(GRANT)} x={170} y={120} w={520} h={800} fx={930} fy={1300} scale={0.36} rot={-2} at={a} mask={MASKS.grant} tintStrength={0.6} traceAt={t.at('Grant unlike') + 2} />
      <Note text="Lincoln noticed who won at Vicksburg" x={820} y={110} size={44} rot={-3} at={t.at('noticed') - 2} color={WHITE} />
      <Highlight text="ULYSSES S. GRANT" x={830} y={240} size={80} at={t.at('Grant unlike') - 1} seed={24} rot={-2} />
      <Note text="unlike McClellan..." x={850} y={420} size={56} rot={-3} at={t.at('unlike') - 2} color={WHITE} />
      <Note text="he liked attacking" x={880} y={530} size={70} rot={-3} at={t.at('liked attacking') - 2} color={CORAL} />
      
      <Note text="March 1864:" x={830} y={770} size={48} rot={-2} at={t.at('In March') - 2} color={WHITE} />
      <Note text="in charge of all the Union armies" x={850} y={870} size={48} rot={-2} at={t.at('in charge') - 2} />
      <Tag text="Mathew Brady studio, Ulysses S. Grant, 1861 to 1865 · Library of Congress" />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Town t={t} />],
    [at('They fight') - 1, <ThreeDays t={t} />],
    [at('On the third') - 1, <Charge t={t} />],
    [at('Lee retreats') - 1, <Retreat t={t} />],
    [at('In three days') - 1, <Cost t={t} />],
    [at('The very next') - 1, <Week t={t} />],
    [at("Grant's army") - 1, <Siege t={t} />],
    [at('Soon the') - 1, <CutInTwo t={t} />],
    [at('So which') - 1, <WhichWin t={t} />],
    [at('But Lincoln') - 1, <Grant t={t} />],
  ];
  const writes = ['collides', 'crossroads', 'Gettysburg', 'three days', 'center', 'nearly a mile', 'More than half', 'never invade', 'men killed', 'far to', 'surrenders',
    'surrounded', 'starved', 'caves', 'shelling', 'whole Mississippi', 'Remember', 'Gettysburg ended', 'Vicksburg split', 'People still', 'noticed', 'unlike', 'liked attacking', 'In March'];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['July', "Pickett's", 'July 4th', 'Grant unlike'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/stamp.wav" volume={0.27} />)}
      {writes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      {[0, 8, 16].map((d) => <Sfx key={`b${d}`} at={at('Union cannons') + d} src="sfx/boom.wav" volume={0.22} />)}
      <Sfx at={at('Vicksburg') - 2} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('cut in two') - 2} src="sfx/tick_soft.wav" volume={0.4} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_one_week.wav" lead={LEAD} music={[{src: 'music/g_southampton.mp3', volume: 0.089}]}>
    <Body />
  </ChapterShell>
);
