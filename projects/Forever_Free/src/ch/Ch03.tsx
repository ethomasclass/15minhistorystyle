// Chapter 3 · Lincoln's Problems: McClellan (a great army, painfully slow, "borrow it"), Lincoln takes over the
// armies in March 1862, the Peninsula and Lee; Baltimore, the burned bridges and habeas corpus; Taney; who decides.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch03_lincolns_problems.words.json';
import data from '../../public/maps/civwar1861.json';
import {Arrow, Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {Desk, DropCard, Sounds, SyncQuote} from '../kit/bs';
import {sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {Box, CORAL, Cross, READING, Strike, WHITE} from '../kit/ff';
import {type Cam3, CONFEDERACY_1861, MAP3D, Map3D, type MapData, PlaceTag, Pin3, Route, Stand, StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {Backdrop, ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);
const D = data as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;

const ON_HORSE = 'img/ch03/mcclellan_on_horse_yorktown_currier_1862.jpg';
const MCCLELLAN = 'img/ch03/mcclellan_portrait_gutekunst_c1863.jpg';
const BATTERY = 'img/ch03/federal_battery_yorktown_1862.jpg';
const IN_TENT = 'img/ch03/lincoln_mcclellan_antietam_group_1862.jpg';
const BUTTRE = 'img/ch03/mcclellan_engraving_buttre_c1864.jpg';
const MCHENRY = 'img/ch03/fort_mchenry_bufford_1861.jpg';
const RIOT = 'img/ch03/sixth_massachusetts_baltimore_riot_1861.jpg';
const BRIDGE = 'img/ch03/burning_bridge_canton_md_and_fort_mchenry_harpers_1861-05-11.jpg';
const TANEY = 'img/ch03/taney_portrait_c1855.jpg';
const TENT = 'img/ch03/lincoln_mcclellan_antietam_tent_1862.jpg';
const TANEY_TAG = 'Chief Justice Roger B. Taney, c. 1855 · Library of Congress';

/** Meanwhile, Lincoln had other problems. Starting with his generals. */
const Problems: React.FC<{t: TL}> = ({t}) => {
  const a = -10;
  return (
    <Desk a={a}>
      <Backdrop src={IN_TENT} size={sizeOf(IN_TENT)} a={a} dim={0.24} side="left" />
      <DropCard src={ON_HORSE} x={1200} y={70} w={560} rot={3} at={t.at('Starting') - 2} />
      <Note text="meanwhile:" x={130} y={150} size={56} rot={-3} at={t.at('Meanwhile') - 2} color={WHITE} />
      <Note text="Lincoln had other problems" x={130} y={260} size={58} rot={-3} at={t.at('other problems') - 3} />
      <Note text="starting with..." x={130} y={480} size={54} rot={-3} at={t.at('Starting') - 2} color={WHITE} />
      <Highlight text="HIS GENERALS" x={130} y={580} size={110} at={t.at('his generals')} seed={301} rot={-2} />
      <Tag text="General McClellan and staff before Yorktown, Currier & Ives, 1862 · Gardner, Lincoln and McClellan, Antietam, 1862 · Library of Congress" />
    </Desk>
  );
};

/** General George McClellan: the Union's biggest army, trained well, loved, and painfully slow. */
const McClellan: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('General George') - 1;
  return (
    <Desk a={a}>
      <CropCard src={MCCLELLAN} size={sizeOf(MCCLELLAN)} x={170} y={130} w={560} h={740} fx={1240} fy={1700} scale={0.42} rot={-2} at={a + 1} mask={MASKS.mcclellan}
        traceAt={t.at('McClellan') + 3} />
      <Highlight text="GEN. GEORGE McCLELLAN" x={840} y={120} size={66} at={t.at('McClellan')} seed={303} rot={-2} />
      <Note text="built the Union's biggest army" x={870} y={300} size={50} rot={-3} at={t.at('built') - 3} color={WHITE} />
      <Note text="trained it well" x={870} y={410} size={52} rot={-3} at={t.at('trained it') - 3} />
      <Note text="his soldiers loved him" x={870} y={500} size={52} rot={-3} at={t.at('soldiers loved') - 3} />
      <Note text="but painfully slow to attack" x={860} y={680} size={58} rot={-3} at={t.at('painfully slow') - 3} color={CORAL} />
      <Tag text="F. Gutekunst, Gen. George B. McClellan, c. 1863 · Library of Congress" />
    </Desk>
  );
};

/** He always believed the enemy was bigger than it was, sometimes twice as big. */
const Twice: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('He always') - 1;
  return (
    <Desk a={a}>
      <Backdrop src={ON_HORSE} size={sizeOf(ON_HORSE)} a={a} dim={0.22} side="left" />
      <DropCard src={BATTERY} x={1220} y={130} w={580} rot={2} at={a + 2} />
      <Note text="he always saw a bigger enemy" x={130} y={100} size={56} rot={-3} at={t.at('He always') + 2} color={WHITE} />
      <Box x={170} y={470} w={260} h={190} at={t.at('than it was') - 4} label="real" size={50} seed={3} color="#f4efe6" />
      <Box x={540} y={330} w={520} h={380} at={t.at('sometimes twice') - 2} label="what he saw" size={56} seed={5} color={CORAL} />
      <Note text="the enemy" x={180} y={690} size={46} rot={-3} at={t.at('than it was') - 2} color={WHITE} />
      <Note text="sometimes twice as big" x={520} y={760} size={58} rot={-3} at={t.at('sometimes twice') - 2} color={CORAL} />
      <Tag text="James Gibson, a Federal battery before Yorktown, May 1862 · Currier & Ives, McClellan before Yorktown, 1862 · Library of Congress" />
    </Desk>
  );
};

/** Lincoln reportedly said that if McClellan wasn't using the army, he'd like to borrow it. */
const Borrow: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IN_TENT} size={sizeOf(IN_TENT)} fx={1270} fy={1500} z0={2.3} z1={2.45} a={t.at('Lincoln reportedly') - 1} b={t.at('In March')}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.88) 0%, rgba(10,9,7,0.6) 30%, rgba(0,0,0,0) 46%)'}} />
        <Note text="Lincoln, reportedly:" x={130} y={80} size={52} rot={-3} at={t.at('Lincoln reportedly') + 2} color="#FF9F1C" />
        <Note text="if McClellan isn't using the army..." x={140} y={180} size={52} rot={-3} at={t.at("wasn't using") - 3} color={WHITE} />
        <Note text="he'd like to borrow it" x={160} y={280} size={60} rot={-3} at={t.at('borrow it') - 3} />
        <Tag text="Alexander Gardner, The President and General McClellan on the battlefield of Antietam, Oct. 1862 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** March 1862: Lincoln takes away McClellan's job as commander of all the Union armies and directs them himself. */
const Demoted: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In March') - 1;
  return (
    <Desk a={a}>
      <Backdrop src={TENT} size={sizeOf(TENT)} a={a} dim={0.26} side="left" />
      <DropCard src={BUTTRE} x={1300} y={110} w={460} rot={3} at={a + 2} />
      <Highlight text="MARCH 1862" x={130} y={100} size={100} at={t.at('March 1862')} seed={305} rot={-2} />
      <Box x={110} y={300} w={1060} h={150} at={t.at('commander of all') - 2} label="COMMANDER OF ALL UNION ARMIES" size={46} seed={7} />
      <Note text="McClellan" x={190} y={500} size={66} rot={-3} at={t.at('took away') - 3} color={WHITE} />
      <Strike x1={180} x2={500} y={545} at={t.at('commander of all') + 6} />
      <Note text="→ Lincoln, himself" x={190} y={640} size={66} rot={-3} at={t.at('started directing') - 3} />
      <Tag text="J. C. Buttre, Maj. Gen. George B. McClellan, engraving, c. 1864 · Gardner, Antietam, Oct. 1862 · Library of Congress" />
    </Desk>
  );
};

/** That spring McClellan moves toward Richmond; by early summer Robert E. Lee drives him back. */
const Peninsula: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('That spring') - 1;
  const lee = t.at('Robert E');
  const keys: Cam3[] = [{f: a, x: 3900, y: 2120, z: 1.6, tilt: 40, rot: -6}, {f: t.at('Lincoln was also'), x: 3900, y: 2130, z: 1.75, tilt: 46, rot: -8}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.7} rivers={0.9}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-99} stagger={0} h={2} color={MAP3D.free} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={-99} stagger={0} h={2} color={CORAL} />
            <Stand api={api} at={pl.richmond} z={30} show={a + 2}><Pin3 /></Stand>
            <Stand api={api} at={[pl.richmond[0] - 150, pl.richmond[1] + 40]} z={60} show={a + 4}><PlaceTag text="Richmond" size={34} /></Stand>
            <Stand api={api} at={pl.washingtonDC} z={30} show={a + 2}><Pin3 color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.washingtonDC[0] + 20, pl.washingtonDC[1] - 40]} z={60} show={a + 4}><PlaceTag text="Washington" size={30} /></Stand>
            <Route api={api} pts={[pl.fortMonroe, [3900, 2140], [3840, 2120]]} at={t.at('moved toward') - 2} dur={30} color="#FF9F1C" width={10} bow={0.05} />
            <Route api={api} pts={[[3850, 2125], [3920, 2165], [3985, 2200]]} at={t.at('driven him') - 2} dur={24} color={CORAL} width={8} bow={-0.1} dashed />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="spring 1862: McClellan moves on Richmond" x={130} y={90} size={52} rot={-2} at={t.at('That spring') + 2} color={WHITE} />
        <Note text="by early summer:" x={130} y={760} size={50} rot={-2} at={t.at('By early') - 2} color={WHITE} />
        <Highlight text="ROBERT E. LEE" x={130} y={840} size={84} at={lee} seed={307} rot={-2} />
        <Note text="drives him back" x={760} y={860} size={60} rot={-3} at={t.at('driven him') - 3} color={CORAL} />
        <Tag text="Map · Virginia, 1862" />
      </AbsoluteFill>
    </>
  );
};

/** Lincoln was also finding out how far a president's power went in wartime. */
const Wartime: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={MCHENRY} px={sizeOf(MCHENRY)} fx={1500} fy={980} a={t.at('Lincoln was also') - 1} b={t.at('Back in')} z0={1.3} z1={1.38} fade={6}
    tag="E. Sachse, Fort McHenry, Baltimore, 1861, occupied by Union troops, lithograph · Library of Congress">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.55) 28%, rgba(0,0,0,0) 42%)'}} />
        <Note text="how far does a president's power go" x={130} y={90} size={58} rot={-2} at={t.at('how far') - 3} color={WHITE} />
        <Note text="in wartime?" x={140} y={200} size={64} rot={-2} at={t.at('in wartime') - 3} />
      </>
    )}
  </Engraving>
);

/** Back in 1861, a mob in Baltimore had attacked Union troops. */
const Riot: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={RIOT} px={sizeOf(RIOT)} fx={1500} fy={1300} a={t.at('Back in') - 1} b={t.at('Then railroad')} z0={1.12} z1={1.2} fade={6}
    tag="The 6th Massachusetts attacked on Pratt Street, Baltimore, April 19, 1861, Frank Leslie's · Library of Congress">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.5) 26%, rgba(0,0,0,0) 40%)'}} />
        <Highlight text="BALTIMORE, 1861" x={130} y={90} size={90} at={t.at('Baltimore')} seed={309} rot={-2} />
        <Note text="a mob attacks Union troops" x={940} y={120} size={52} rot={-3} at={t.at('a mob') - 3} color={WHITE} />
      </>
    )}
  </Engraving>
);

/** Then railroad bridges north of the city were burned, to keep soldiers from reaching Washington. */
const Bridges: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Then railroad') - 1;
  return (
    <Desk a={a}>
      <CropCard src={BRIDGE} size={sizeOf(BRIDGE)} x={110} y={230} w={920} h={520} fx={2150} fy={2380} scale={0.55} rot={-1.5} at={a + 1} />
      <Note text="railroad bridges burned" x={1120} y={200} size={46} rot={-3} at={t.at('railroad bridges') - 3} color={WHITE} />
      <Note text="north of the city" x={1140} y={300} size={46} rot={-3} at={t.at('north of') - 3} color={WHITE} />
      <Note text="to keep soldiers" x={1120} y={480} size={50} rot={-3} at={t.at('to keep') - 3} />
      <Note text="from reaching Washington" x={1120} y={570} size={46} rot={-3} at={t.at('reaching Washington') - 3} color={CORAL} />
      <Tag text="Burning of the bridge at Canton, Md., by the mob, Harper's Weekly, May 11, 1861 · Internet Archive" />
    </Desk>
  );
};

/** So Lincoln suspended habeas corpus: the right to go before a judge. A show-your-work rule for jailers. */
const Habeas: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('So Lincoln') - 1;
  const wo = t.at('Without it');
  return (
    <Desk a={a}>
      <Backdrop src={MCHENRY} size={sizeOf(MCHENRY)} a={a} dim={0.26} tag="E. Sachse, Fort McHenry, Baltimore, 1861 · Library of Congress" />
      <Note text="so Lincoln suspends" x={130} y={100} size={54} rot={-3} at={t.at('So Lincoln') + 2} color={WHITE} />
      <Highlight text="HABEAS CORPUS" x={780} y={90} size={96} at={t.at('habeas corpus')} seed={311} rot={-2} />
      <Definition term="ha·be·as cor·pus" def="the right to go before a judge, who decides whether you're being held legally" at={t.at("That's the right") - 2} x={130} y={250} w={1500} />
      <Note text="a show-your-work rule for jailers:" x={130} y={430} size={54} rot={-2} at={t.at('show-your-work') - 3} />
      <Box x={200} y={580} w={420} h={170} at={t.at('lock someone') - 2} label="JAILER" size={60} seed={9} color="#f4efe6" />
      <Arrow x1={660} y1={665} x2={1080} y2={665} bow={-30} at={t.at('explain why') - 2} />
      <Note text="explain why" x={720} y={560} size={46} rot={-3} at={t.at('explain why') - 2} color={WHITE} />
      <Box x={1120} y={580} w={420} h={170} at={t.at('why to a judge') - 4} label="JUDGE" size={60} seed={11} />
      <Cross x={830} y={630} at={wo + 2} s={1.1} />
      <Note text="without it: held with no hearing" x={200} y={830} size={60} rot={-3} at={wo - 3} color={CORAL} />
    </Desk>
  );
};

/** Roger Taney, head of the Supreme Court: only Congress had that power. The same Taney as Dred Scott. */
const Taney: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Roger Taney') - 1;
  return (
    <Desk a={a}>
      <CropCard src={TANEY} size={sizeOf(TANEY)} x={170} y={110} w={560} h={790} fx={1300} fy={1330} scale={0.32} rot={-2} at={a + 1} mask={MASKS.taney} traceAt={t.at('Roger Taney') + 4} />
      <Highlight text="ROGER TANEY" x={860} y={120} size={96} at={t.at('Roger Taney')} seed={313} rot={-2} />
      <Note text="head of the Supreme Court" x={880} y={300} size={52} rot={-3} at={t.at('the head') - 3} color={WHITE} />
      <Note text="only Congress has that power" x={880} y={430} size={54} rot={-3} at={t.at('only Congress') - 3} />
      <Note text="yes: the Dred Scott Taney" x={880} y={620} size={56} rot={-3} at={t.at('Dred Scott') - 3} color={CORAL} />
      <Tag text={TANEY_TAG} />
    </Desk>
  );
};

/** Lincoln kept doing it. The Constitution: "in cases of rebellion or invasion." It doesn't say who decides. */
const WhoDecides: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Lincoln kept') - 1;
  const pal = usePal();
  const g = useGFrame();
  return (
    <Desk a={a}>
      <Backdrop src={RIOT} size={sizeOf(RIOT)} a={a} dim={0.2} side="none" />
      <CropCard src={READING} size={sizeOf(READING)} x={200} y={90} w={340} h={400} fx={1120} fy={1100} scale={0.42} rot={-2} at={a + 1} mask={MASKS.lincoln_reading}
        traceAt={a + 5} />
      <CropCard src={TANEY} size={sizeOf(TANEY)} x={1380} y={90} w={340} h={400} fx={1260} fy={1000} scale={0.2} rot={2} at={a + 3} mask={MASKS.taney} traceAt={a + 7} />
      {g >= a + 4 && <div style={{position: 'absolute', left: 140, top: 530, width: 460, textAlign: 'center', fontFamily: JF.mono, fontSize: 28, letterSpacing: 2, color: pal.mark}}>LINCOLN: KEEPS DOING IT</div>}
      {g >= a + 6 && <div style={{position: 'absolute', left: 1320, top: 530, width: 460, textAlign: 'center', fontFamily: JF.mono, fontSize: 28, letterSpacing: 2, color: CORAL}}>TANEY: ONLY CONGRESS</div>}
      <Note text="the Constitution allows it:" x={600} y={170} size={44} rot={-3} at={t.at('The Constitution') - 3} color={WHITE} />
      <SyncQuote t={t} phrase="in cases of rebellion or invasion" x={170} y={620} w={1580} size={64} />
      <Highlight text="WHO DECIDES?" x={680} y={840} size={100} at={t.at('who decides', 2)} seed={315} rot={-2} />
      <Tag text={`Ritchie after Carpenter, 1866 · ${TANEY_TAG} · Leslie's, Baltimore, 1861`} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Problems t={t} />],
    [at('General George') - 1, <McClellan t={t} />],
    [at('He always') - 1, <Twice t={t} />],
    [at('Lincoln reportedly') - 1, <Borrow t={t} />],
    [at('In March') - 1, <Demoted t={t} />],
    [at('That spring') - 1, <Peninsula t={t} />],
    [at('Lincoln was also') - 1, <Wartime t={t} />],
    [at('Back in') - 1, <Riot t={t} />],
    [at('Then railroad') - 1, <Bridges t={t} />],
    [at('So Lincoln') - 1, <Habeas t={t} />],
    [at('Roger Taney') - 1, <Taney t={t} />],
    [at('Lincoln kept') - 1, <WhoDecides t={t} />],
  ];
  const writes = ['Meanwhile', 'other problems', 'Starting', 'built', 'trained it', 'soldiers loved', 'painfully slow', 'He always', 'than it was', 'sometimes twice', 'Lincoln reportedly',
    "wasn't using", 'borrow it', 'took away', 'started directing', 'That spring', 'By early', 'driven him', 'how far', 'in wartime', 'a mob', 'railroad bridges', 'north of', 'to keep',
    'reaching Washington', 'So Lincoln', 'show-your-work', 'explain why', 'Without it', 'the head', 'only Congress', 'Dred Scott', 'The Constitution'].map((p) => at(p));
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map(([f]) => f)} stamps={[at('his generals'), at('McClellan'), at('March 1862'), at('Robert E'), at('Baltimore'), at('habeas corpus'), at('Roger Taney'),
        at('who decides', 2)]} writes={writes} ticks={[at('moved toward') - 2, at('lock someone') - 2, at('why to a judge') - 4]}
        extra={[{at: at('Without it') + 2, src: 'sfx/gavel.wav', volume: 0.3}]} />
    </>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_lincolns_problems.wav" lead={LEAD} music={[{src: 'music/j_intrigue.mp3', volume: 0.084}]}>
    <Body />
  </ChapterShell>
);
