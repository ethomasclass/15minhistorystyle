// Chapter 6 · Appomattox: Lee surrounded, the surrender on April 9, 1865 and its terms, Grant's rations, Lincoln shot at
// Ford's Theatre, the last armies surrender, and Juneteenth in Galveston.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import mapData from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch06_appomattox.words.json';
import {Highlight, Note, Tag} from '../kit/Kit';
import {Sfx, WRITE} from '../kit/common';
import {Desk} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {CORAL, WHITE} from '../kit/except';
import {BORDER_1861, type Cam3, CONFEDERACY_1861, Hand, MAP3D, Map3D, type MapData, Pin3, PlaceTag, Route, Stand, StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

const D = mapData as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;
const MCLEAN = 'img/ch06/mclean_house_appomattox_1865.jpg';
const SURRENDER = 'img/ch06/surrender_lee_currier_1865.jpg';
const LEE65 = 'img/ch06/lee_after_surrender_brady_1865.jpg';
const RATIONS = 'img/gen/v3_ch06_rations.jpg';
const FORDS = 'img/ch06/fords_theatre_april_1865.jpg';
const BOX = 'img/ch06/lincoln_assassination_currier_1865.jpg';
const FUNERAL = 'img/ch06/lincoln_funeral_pennsylvania_ave_1865.jpg';
const GALVESTON = 'img/gen/v3_ch06_galveston.jpg';
const ORDER = 'img/ch06/general_order_no3_juneteenth_page2_1865.jpg';

/** April 1865: Lee's army, starving and nearly surrounded, west of Petersburg. */
const Surrounded: React.FC<{t: TL}> = ({t}) => {
  const keys: Cam3[] = [{f: -10, x: 3720, y: 2080, z: 1.15, tilt: 40, rot: -4}, {f: t.at('On April'), x: 3700, y: 2120, z: 1.3, tilt: 46, rot: -8}];
  const pts = [pl.petersburg, [3760, 2190], [3690, 2180], pl.appomattox];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.7} rivers={0.6}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={10} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={-20} stagger={0} h={12} color={MAP3D.grey} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={-20} stagger={0} h={20} color={CORAL} />
            <Stand api={api} at={pl.richmond} z={20} show={-20}><Pin3 color={MAP3D.grey} /></Stand>
            <Stand api={api} at={[pl.richmond[0] + 30, pl.richmond[1] - 30]} z={90} show={-20}><PlaceTag text="Richmond" size={26} /></Stand>
            <Route api={api} pts={pts} at={8} dur={50} color={CORAL} width={9} bow={0} dashed />
            <Stand api={api} at={pl.appomattox} z={20} show={t.at('nearly') - 2}><Pin3 color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.appomattox[0] - 220, pl.appomattox[1] + 80]} z={90} show={t.at('nearly')}><Hand text="Lee's army" size={50} color={CORAL} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.78) 0%, rgba(0,0,0,0) 32%)'}} />
        <Highlight text="APRIL 1865" x={110} y={90} size={90} at={t.at('April') - 1} seed={61} rot={-2} />
        <Note text="Lee's army: starving and nearly surrounded" x={130} y={250} size={52} rot={-3} at={t.at('starving') - 2} color={WHITE} />
        <Tag text="Map · Virginia, April 1865" />
      </AbsoluteFill>
    </>
  );
};

/** April 9: Appomattox Court House, the McLean house. */
const Appomattox: React.FC<{t: TL}> = ({t}) => (
  <Photo src={MCLEAN} size={sizeOf(MCLEAN)} fx={1300} fy={1150} z0={1.04} z1={1.12} a={t.at('On April') - 1} b={t.at('Look at')} bw="grayscale(1) contrast(1.2) brightness(0.92)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.8) 0%, rgba(10,9,7,0.4) 26%, rgba(0,0,0,0) 40%)'}} />
        <Highlight text="APRIL 9, 1865" x={110} y={90} size={90} at={t.at('9th') - 1} seed={62} rot={-2} />
        <Note text="a village in Virginia: Appomattox Court House" x={130} y={250} size={50} rot={-3} at={t.at('Appomattox') - 2} color={WHITE} />
        <Note text="Lee surrenders to Grant" x={980} y={850} size={58} rot={-3} at={t.at('Lee surrenders') - 2} color={CORAL} />
        <Tag text="Timothy O'Sullivan, the McLean House, Appomattox Court House, April 1865 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** The terms. */
const Terms: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Look at') - 1;
  return (
    <Desk a={a} push={0.02}>
      <CropCard src={SURRENDER} size={sizeOf(SURRENDER)} x={140} y={140} w={500} h={780} fx={1130} fy={1700} scale={0.4} rot={-2} at={a + 1} />
      <Highlight text="THE TERMS" x={760} y={100} size={86} at={t.at('terms') - 1} seed={63} rot={-2} />
      <Note text="Lee's men aren't arrested" x={770} y={270} size={48} rot={-3} at={t.at('arrested') - 3} />
      <Note text="they promise not to fight again" x={770} y={380} size={44} rot={-3} at={t.at('They promise') - 2} color={WHITE} />
      <Note text="and they go home" x={790} y={470} size={44} rot={-3} at={t.at('go home') - 2} color={WHITE} />
      <Note text="keep the promise: no arrest or trial" x={770} y={580} size={44} rot={-3} at={t.at('protected') - 3} />
      <Note text="men who own horses keep them" x={770} y={700} size={48} rot={-3} at={t.at('Men who') - 2} color={WHITE} />
      <Note text="(for spring planting)" x={800} y={810} size={44} rot={-3} at={t.at('spring') - 2} />
      <Tag text="Currier & Ives, Surrender of Genl. Lee at Appomattox C.H. Va., April 9th 1865 · Library of Congress" />
    </Desk>
  );
};

/** Grant sends food. On purpose. */
const Rations: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={RATIONS} px={sizeOf(RATIONS)} fx={700} fy={400} a={t.at('Grant sends') - 1} b={t.at('Five days')} z0={1.0} z1={1.07} fade={6}
    tag="Illustration · Union rations handed out to Lee's soldiers, April 1865">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.9) 0%, rgba(10,9,7,0.55) 26%, rgba(0,0,0,0) 42%)'}} />
        <Note text="Grant sends food to Lee's hungry soldiers" x={110} y={700} size={52} rot={-2} at={t.at('Grant sends') + 1} color={WHITE} />
        <Note text="that was on purpose:" x={130} y={820} size={56} rot={-2} at={t.at('on purpose') - 3} />
        <Note text="put back together, not punished" x={760} y={820} size={56} rot={-2} at={t.at('put back') - 2} color={CORAL} />
      </>
    )}
  </Engraving>
);

/** Five days later: Ford's Theatre. */
const Fords: React.FC<{t: TL}> = ({t}) => (
  <Photo src={FORDS} size={sizeOf(FORDS)} fx={760} fy={760} z0={1.85} z1={1.95} a={t.at('Five days') - 1} b={t.at('by John')} bw="grayscale(1) contrast(1.25) brightness(0.88)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.5) 34%, rgba(0,0,0,0) 50%)'}} />
        <Note text="five days later" x={110} y={110} size={60} rot={-3} at={t.at('Five days') + 1} color={WHITE} />
        <Note text="Lincoln is shot" x={130} y={240} size={70} rot={-3} at={t.at('shot') - 2} color={CORAL} />
        <Note text="at Ford's Theatre, Washington" x={150} y={380} size={50} rot={-3} at={t.at("Ford's") - 2} />
        <Tag text="Ford's Theatre, Washington, April 1865, stereograph · Library of Congress" />
      </>
    )}
  </Photo>
);

/** John Wilkes Booth. */
const Booth: React.FC<{t: TL}> = ({t}) => (
  <Photo src={BOX} size={sizeOf(BOX)} fx={1500} fy={1150} z0={1.45} z1={1.52} a={t.at('by John') - 1} b={t.at('He dies')} bw="grayscale(1) contrast(1.2) brightness(0.9)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.6) 26%, rgba(0,0,0,0) 42%)'}} />
        <Highlight text="JOHN WILKES BOOTH" x={110} y={760} size={72} at={t.at('John Wilkes')} seed={64} rot={-2} />
        <Note text="an actor who supported the Confederacy" x={130} y={900} size={50} rot={-2} at={t.at('an actor') - 2} color={WHITE} />
        <Tag text="Currier & Ives, The Assassination of President Lincoln, 1865 · Library of Congress" x={44} y={40} />
      </>
    )}
  </Photo>
);

/** He dies the next morning; the last armies surrender. */
const Funeral: React.FC<{t: TL}> = ({t}) => (
  <Photo src={FUNERAL} size={sizeOf(FUNERAL)} fx={1500} fy={1700} z0={1.08} z1={1.16} a={t.at('He dies') - 1} b={t.at('But in Texas')} bw="grayscale(1) contrast(1.2) brightness(0.85)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.5) 26%, rgba(0,0,0,0) 42%)'}} />
        <Note text="he dies the next morning" x={110} y={90} size={60} rot={-3} at={t.at('He dies') + 1} color={WHITE} />
        <Note text="the other Confederate armies surrender over the next 2½ months" x={130} y={220} size={44} rot={-2} at={t.at('The other') - 2} />
        <Tag text="Lincoln's funeral procession on Pennsylvania Avenue, Washington, April 1865 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** But in Texas: a long move west to Galveston. */
const Texas: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('But in Texas') - 1;
  const keys: Cam3[] = [{f: a, x: 3500, y: 2400, z: 0.42, tilt: 36, rot: -4}, {f: t.at('enforced') - 8, x: 1300, y: 3400, z: 0.85, tilt: 44, rot: -6}, {f: t.at('On June'), x: 1290, y: 3420, z: 0.9, tilt: 46, rot: -7}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={10} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={-20} stagger={0} h={10} color={MAP3D.grey} />
            <StateTiles api={api} names={CONFEDERACY_1861.filter((s) => s !== 'USA:Texas')} at={-20} stagger={0} h={14} color={MAP3D.grey} />
            <StateTiles api={api} names={['USA:Texas']} at={-20} stagger={0} h={40} color={CORAL} />
            <Stand api={api} at={pl.galveston} z={30} show={t.at('enforced') - 2}><Pin3 color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.galveston[0] + 40, pl.galveston[1] - 40]} z={120} show={t.at('enforced')}><PlaceTag text="Galveston" size={30} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.78) 0%, rgba(0,0,0,0) 32%)'}} />
        <Note text="but in Texas, freedom still hadn't been enforced" x={110} y={90} size={50} rot={-3} at={a + 2} color={WHITE} />
        <Note text="2½ years after the Emancipation Proclamation" x={130} y={210} size={50} rot={-3} at={t.at('two and a half years') - 2} />
        <Tag text="Map · Texas, 1865" />
      </AbsoluteFill>
    </>
  );
};

/** June 19, 1865, Galveston: all enslaved people in Texas are free. */
const Galveston: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={GALVESTON} px={sizeOf(GALVESTON)} fx={700} fy={350} a={t.at('On June') - 1} b={t.at('That day')} z0={1.0} z1={1.06} fade={6}
    mask={MASKS.galveston_officer} traceAt={t.at('announced') - 1} tag="Illustration · General Order No. 3 read in Galveston, Texas, June 19, 1865">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to left, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.5) 30%, rgba(0,0,0,0) 46%)'}} />
        <Highlight text="JUNE 19, 1865" x={1060} y={90} size={70} at={t.at('19th') - 1} seed={65} rot={-2} />
        <Note text="Union soldiers arrive" x={1080} y={240} size={46} rot={-3} at={t.at('Union soldiers') - 2} color={WHITE} />
        <Note text="in Galveston" x={1100} y={330} size={46} rot={-3} at={t.at('Galveston') - 2} color={WHITE} />
        <Note text="and announce:" x={1080} y={460} size={48} rot={-3} at={t.at('announced') - 2} />
        <Note text="all enslaved people" x={1100} y={560} size={52} rot={-3} at={t.at('all enslaved') - 2} />
        <Note text="in Texas are free" x={1120} y={660} size={52} rot={-3} at={t.at('people in Texas') + 4} />
      </>
    )}
  </Engraving>
);

/** That day became Juneteenth. */
const Juneteenth: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('That day') - 1;
  const w = 560;
  return (
    <Desk a={a} push={0.02}>
      <Doc src={ORDER} x={1220} y={140} w={w} rot={2} at={a + 1} push={[a, a + 120]} fx={3100} fy={1700} zoom={1.05} />
      <Highlight text="JUNETEENTH" x={110} y={260} size={120} at={t.at('Juneteenth')} seed={66} rot={-2} />
      <Definition term="June·teenth" def="June 19, the day in 1865 freedom was announced in Texas" at={t.at('Juneteenth') + 9} x={120} y={470} w={900} />
      <Note text="that day became" x={130} y={130} size={52} rot={-3} at={a + 2} color={WHITE} />
      <Tag text="General Orders No. 3 (end) and No. 4, Galveston, June 1865, order book · National Archives" />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Surrounded t={t} />],
    [at('On April') - 1, <Appomattox t={t} />],
    [at('Look at') - 1, <Terms t={t} />],
    [at('Grant sends') - 1, <Rations t={t} />],
    [at('Five days') - 1, <Fords t={t} />],
    [at('by John') - 1, <Booth t={t} />],
    [at('He dies') - 1, <Funeral t={t} />],
    [at('But in Texas') - 1, <Texas t={t} />],
    [at('On June') - 1, <Galveston t={t} />],
    [at('That day') - 1, <Juneteenth t={t} />],
  ];
  const writes = ['starving', 'Appomattox', 'Lee surrenders', 'arrested', 'They promise', 'protected', 'Men who', 'spring', 'on purpose', 'put back', 'shot', "Ford's", 'an actor',
    'The other', 'two and a half years', 'Union soldiers', 'announced', 'people in Texas'];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['April', '9th', 'terms', 'John Wilkes', '19th', 'Juneteenth'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/stamp.wav" volume={0.26} />)}
      {writes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('enforced') - 2} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('nearly') - 2} src="sfx/tick_soft.wav" volume={0.4} />
    </>
  );
};

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_appomattox.wav" lead={LEAD} music={[{src: 'music/w_dawn.mp3', volume: 0.054}]}>
    <Body />
  </ChapterShell>
);
