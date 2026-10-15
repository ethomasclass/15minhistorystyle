// Chapter 4 · Remember the Alamo: Santa Anna's march, the Alamo and Seguín, Goliad, San Jacinto and the capture,
// the rejected treaty, the Rio Grande claim, nine years waiting on slavery politics, annexation in 1845.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import mapData from '../../public/maps/mex1846.json';
import words from '../../public/audio/ch04_remember_the_alamo.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Border, type Cam3, Count, Dot, Fill, Glow, Hand, MAP3D, Map3D, type MapData, PlaceTag, RegionName, Route, Slab, SLAVE_1837, FREE_1837, Stake, Stand, StateTiles} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Quote, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places;
export const CH04_FRAMES = chapterFrames(N, LEAD);

const GEN: [number, number] = [1376, 768];
const HUDDLE: [number, number] = [1456, 879];
const CARTOON: [number, number] = [3000, 2404];
const HOUSTON: [number, number] = [1687, 2250];
const FREE_C = '#4f7186';
const SLAVE_C = '#8a2f26';

/** Santa Anna marches north; the Alamo; Seguín rides for help. */
const March: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const keys: Cam3[] = [
    {f: 0, x: 3050, y: 2700, z: 0.5, tilt: 40, rot: -2},
    {f: t.at('February') + 6, x: 3120, y: 2200, z: 1.0, tilt: 48, rot: -8},
    {f: t.at('Juan'), x: 3180, y: 2090, z: 1.9, tilt: 52, rot: -12},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Dot api={api} at={pl.mexicoCity} color={MAP3D.mexico} />
            <Route api={api} pts={[pl.mexicoCity, pl.saltillo, [3000, 2300], pl.sanAntonio]} at={4} dur={60} color={MAP3D.mexico} width={12} bow={0.05} />
            <Stand api={api} at={[2930, 2900]} z={30} show={t.at('thousands') - 2} out={t.at('February') + 4}><Hand text="thousands of soldiers" size={64} color="#ffffff" bg /></Stand>
            <Dot api={api} at={pl.sanAntonio} show={t.at('About') - 4} color={MAP3D.us} />
            <Stand api={api} at={[pl.sanAntonio[0], pl.sanAntonio[1] - 6]} z={10} show={t.at('Alamo.') - 2}><PlaceTag text="The Alamo · San Antonio" size={26} /></Stand>
            <Route api={api} pts={[pl.sanAntonio, [3210, 2060], pl.gonzales]} at={t.at('ride') - 2} dur={24} color="#f4efe6" width={6} dashed />
            <Stand api={api} at={[3215, 2035]} z={10} show={t.at('ride') + 4}><Hand text="riding for help" size={50} color="#ffffff" bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        {g >= t.at('February') && <Highlight text="FEBRUARY 1836" x={100} y={90} size={96} at={t.at('February')} seed={111} rot={-2} />}
        <Note text="~200 Texans dig in" x={120} y={250} size={60} rot={-3} at={t.at('200') - 2} color="#ffffff" />
        <Note text="Juan Seguín, Tejano captain" x={120} y={760} size={62} rot={-3} at={t.at('Tejano') - 2} />
        {g >= t.at('Remember') && <Highlight text="REMEMBER HIM" x={140} y={880} size={80} at={t.at('Remember')} seed={113} rot={-2} />}
      </AbsoluteFill>
    </>
  );
};

/** March 6: the attack before dawn (quiet: trace the chapel only). */
const Attack: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="alamo_chapel" src="img/gen/ch04_alamo_dawn.jpg" size={GEN} a={t.at('March') - 1} b={t.at('Three weeks')} fx={0.5} fy={0.32}
    cam={{z: [1.0, 1.12], y: [0.04, -0.02]}} depth={1.03} vignette={0.5} mask={MASKS.alamo_chapel} tint={null} traceAt={t.at('attacks.')}
    effects={[{kind: 'smoke', x: 980, y: 300}]} tag="Illustration · the Alamo before dawn, March 6, 1836">
    {() => (
      <>
        <Highlight text="MARCH 6, 1836" x={100} y={90} size={90} at={t.at('March')} seed={115} rot={-2} />
        <Note text="before dawn" x={130} y={240} size={56} rot={-3} at={t.at('dawn,') - 2} color="#ffffff" />
        <Note text="~90 minutes" x={1350} y={700} size={60} rot={-3} at={t.at('90') - 2} color="#ffffff" />
        <Note text="nearly all the defenders killed" x={1000} y={810} size={56} rot={-3} at={t.at('defenders') - 2} color="#ffffff" />
      </>
    )}
  </Parallax>
);

/** Goliad: more than 300 prisoners shot. */
const Goliad: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Three weeks') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3200, y: 2130, z: 1.7, tilt: 50, rot: -10},
    {f: t.at('April') - 1, x: 3250, y: 2170, z: 2.0, tilt: 54, rot: -12},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Dot api={api} at={pl.sanAntonio} color={MAP3D.us} />
            <Stand api={api} at={[pl.sanAntonio[0], pl.sanAntonio[1] - 6]}><PlaceTag text="The Alamo" size={24} /></Stand>
            <Dot api={api} at={pl.goliad} show={t.at('Goliad,') - 2} color="#1b1915" r={12} />
            <Stand api={api} at={[pl.goliad[0], pl.goliad[1] - 6]} show={t.at('Goliad,')}><PlaceTag text="Goliad" size={30} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="3 weeks later" x={110} y={90} size={60} rot={-3} at={t.at('Three weeks') - 2} color="#ffffff" />
        <div style={{position: 'absolute', left: 110, top: 720}}><Count to={300} at={t.at('300') - 4} dur={14} suffix="+" size={120} color="#FF6F61" /></div>
        <Note text="prisoners shot" x={430} y={760} size={64} rot={-3} at={t.at('prisoners') - 2} color={'#FF6F61'} />
      </AbsoluteFill>
    </>
  );
};

/** San Jacinto: the retreat, the turn, 18 minutes. Houston's portrait on the desk edge. */
const SanJacinto: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('April') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3360, y: 2060, z: 1.5, tilt: 48, rot: -8},
    {f: t.at('off guard'), x: 3470, y: 2030, z: 2.3, tilt: 52, rot: -12},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Route api={api} pts={[pl.gonzales, [3330, 2010], pl.sanFelipe, [3420, 1965], pl.sanJacinto]} at={a + 2} dur={30} color={MAP3D.us} width={10} bow={0.08} />
            <Route api={api} pts={[pl.sanAntonio, [3290, 2080], pl.sanFelipe, pl.houston, pl.sanJacinto]} at={a + 10} dur={30} color={MAP3D.mexico} width={8} bow={0.06} dashed />
            <Stand api={api} at={pl.sanJacinto} show={t.at('San Jacinto')}><Stake /></Stand>
            <Stand api={api} at={[pl.sanJacinto[0] + 10, pl.sanJacinto[1] + 18]} show={t.at('San Jacinto') + 3}><PlaceTag text="San Jacinto" size={28} /></Stand>
            <Stand api={api} at={[3300, 1950]} z={20} show={a + 14}><Hand text="Houston retreats east" size={46} color={MAP3D.us} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        {g >= t.at('April') && <Highlight text="APRIL 21, 1836" x={100} y={80} size={90} at={t.at('April')} seed={117} rot={-2} />}
        <CropCard src="img/ch04/houston_1855.jpg" size={HOUSTON} x={1450} y={110} w={360} h={460} fx={900} fy={820} scale={0.3} rot={2} at={t.at("Houston's") - 2}
          mask={MASKS.houston} tintStrength={0.5} traceAt={t.at("Houston's") + 4} />
        <Note text="Sam Houston" x={1470} y={600} size={50} rot={-3} at={t.at("Houston's")} color="#ffffff" />
        <Note text="catches Santa Anna off guard" x={110} y={820} size={58} rot={-3} at={t.at('catches') - 2} color="#ffffff" />
        <Note text="the battle: ~18 minutes" x={140} y={920} size={58} rot={-3} at={t.at('18') - 2} />
        <Tag text="Sam Houston, engraving by N. Orr · C. E. Lester, The Life of Sam Houston (1855)" />
      </AbsoluteFill>
    </>
  );
};

/** The next day: the man in the marsh grass. "El Presidente!" */
const Capture: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Parallax name="huddle_santa_anna" src="img/ch04/huddle_surrender.jpg" size={HUDDLE} a={t.at('The next day') - 1} b={t.at("It's Santa")} fx={0.45} fy={0.62}
      cam={{z: [1.05, 1.5], x: [-0.12, 0.0], y: [0.12, -0.06]}} depth={1.04} vignette={0.5} mask={MASKS.huddle_santa_anna} tintStrength={0.35} traceAt={t.at("It's Santa")}
      tag="William H. Huddle, The Surrender of Santa Anna (1886) · Texas State Capitol · photo Carol M. Highsmith, Library of Congress">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 34%)'}} />
          <Note text="the next day: a man hiding in the marsh grass" x={90} y={70} size={52} rot={-2} at={t.at('hiding') - 4} color="#ffffff" out={t.at('"El')} />
          <Note text="dressed as a private" x={130} y={160} size={56} rot={-2} at={t.at('dressed') - 2} out={t.at('"El')} />
          <AbsoluteFill style={{background: '#000', opacity: interpolate(g, [t.at('"El') - 2, t.at('"El') + 4, t.at("It's Santa") - 2, t.at("It's Santa") + 4], [0, 0.55, 0.55, 0], clamp)}} />
          {g < t.at("It's Santa") && <Quote text="¡El Presidente!" at={t.at('"El')} x={420} y={420} w={1200} size={120} />}
          {g >= t.at("It's Santa") && <Highlight text="IT'S SANTA ANNA" x={100} y={80} size={96} at={t.at("It's Santa")} seed={119} rot={-2} />}
        </>
      )}
    </Parallax>
  );
};

/** To go free he signs a treaty; Mexico rejects it. */
const Treaty: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('To win') - 1;
  const z = interpolate(g, [a, t.at('And the new')], [0.31, 0.34], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src="img/ch04/cartoon_capture_1836.jpg" size={CARTOON} x={90} y={120} w={900} h={760} fx={1500} fy={1180} scale={z} rot={-1.5} at={a}
        mask={MASKS.cartoon_santa_anna} tintStrength={0.5} traceAt={a + 6}>
        {(S) => {
          const [bx, by] = S(1610, 330);
          return <Loop cx={bx} cy={by} rx={380 * z} ry={120 * z} at={t.at('signs') - 2} seed={41} tilt={-2} />;
        }}
      </CropCard>
      <Note text="“I consent to remain your prisoner”" x={1060} y={130} size={40} rot={-2} at={t.at('signs') - 2} color="#ffffff" />
      <Note text="to go free, he signs a treaty" x={1070} y={230} size={50} rot={-3} at={t.at('signs')} />
      <Stamp text="REJECTED" x={1080} y={370} at={t.at('rejects')} size={110} color={pal.subject} rot={-6} />
      <Note text="Mexico: Texas is still Mexico" x={1070} y={570} size={50} rot={-3} at={t.at('still') - 4} color="#ffffff" />
      {g >= t.at('Hold') && <Highlight text="HOLD THAT THOUGHT" x={1060} y={720} size={64} at={t.at('Hold')} seed={121} rot={-2} />}
      <Tag text="H. R. Robinson, Houston, Santa Anna, and Cos (1836), lithograph cartoon · Library of Congress" />
    </AbsoluteFill>
  );
};

/** The Republic claims the Rio Grande; Texas had stopped at the Nueces; the strip between is the future spot. */
const Claim: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And the new') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3000, y: 1700, z: 0.48, tilt: 40, rot: -2},
    {f: t.at('Nueces.'), x: 3050, y: 1950, z: 0.7, tilt: 46, rot: -6},
    {f: t.at('strip'), x: 3130, y: 2230, z: 1.3, tilt: 50, rot: -10},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Fill api={api} region="texasClaim" at={t.at('Republic')} out={t.at('even though')} outline={MAP3D.us} color={MAP3D.us} opacity={0.4} />
            <Stand api={api} at={[2900, 1350]} z={50} show={t.at('Republic') + 4} out={t.at('even though')}><RegionName text="REPUBLIC OF TEXAS" size={74} /></Stand>
            <Border api={api} d={D.lines.rioGrande} at={t.at('Rio')} color={MAP3D.us} dashed label="Rio Grande · Texas's claim" labelSize={26} labelTo={0.3} />
            <Border api={api} d={D.lines.texasClaimWest} at={t.at('Rio') + 6} color={MAP3D.us} dashed />
            <Fill api={api} region="texasProvince" at={t.at('even though')} out={t.at('strip')} outline={MAP3D.mexico} color={MAP3D.mexico} opacity={0.35} />
            <Border api={api} d={D.lines.nueces} at={t.at('stopped')} color={MAP3D.mexico} dashed label="Nueces · where Texas stopped" labelSize={26} labelTo={0.9} />
            <Slab api={api} region="nuecesStrip" at={t.at('strip')} h={50} hatch="rgba(255,255,255,0.35)" />
            <Glow api={api} d={D.regions.nuecesStrip} at={t.at('strip') + 4} color="#FF6F61" />
            <Stand api={api} at={pl.carricitos} show={t.at("Lincoln's") - 2}><Stake /></Stand>
            <Stand api={api} at={[3200, 2300]} z={60} show={t.at("Lincoln's")}><Hand text="Lincoln's spot" size={72} color="#ffffff" bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="the strip in between" x={110} y={90} size={62} rot={-3} at={t.at('strip') - 2} color="#ffffff" />
      </AbsoluteFill>
    </>
  );
};

/** Nine years waiting: 13 free, 13 slave, Texas would tip it. Then 1845. */
const Union: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('For nine') - 1;
  const tiles = t.at('slave state') - 6;
  const keys: Cam3[] = [
    {f: a, x: 3500, y: 1950, z: 0.6, tilt: 44, rot: -4},
    {f: t.at('asks') + 4, x: 3900, y: 1650, z: 0.42, tilt: 40, rot: -2},
    {f: tiles + 10, x: 4250, y: 1150, z: 0.33, tilt: 34, rot: 0},
    {f: t.at('1845,'), x: 4100, y: 1300, z: 0.36, tilt: 38, rot: -2},
    {f: t.at('breaks'), x: 3500, y: 1800, z: 0.6, tilt: 44, rot: -4},
    {f: t.at('spark.'), x: 3120, y: 2430, z: 1.2, tilt: 50, rot: -8},
  ];
  const joined = t.at('annexes');
  return (
    <>
      <Map3D data={D} keys={keys} states={interpolate(g, [tiles - 10, tiles], [0, 0.7], clamp)}>
        {(api) => (
          <>
            <Slab api={api} region="texasClaim" at={a + 2} h={30} layers={6} color={MAP3D.us} opacity={0.8} fall={joined} />
            <Route api={api} pts={[[3400, 1800], pl.washingtonDC]} at={t.at('asks')} dur={24} color={MAP3D.us} width={10} bow={0.15} out={tiles} />
            <StateTiles api={api} names={FREE_1837} at={tiles} stagger={1} h={26} color={FREE_C} />
            <StateTiles api={api} names={SLAVE_1837} at={tiles + 4} stagger={1} h={26} color={SLAVE_C} />
            <Slab api={api} d={D.states['USA:Texas']} at={joined} h={44} layers={8} color={SLAVE_C} clipLand={false} fall={t.at('Now')} />
            <Stand api={api} at={[3000, 1700]} z={70} show={joined + 4} out={t.at('breaks')}><Hand text="+ Texas, 1845" size={64} color="#ffffff" bg /></Stand>
            <Border api={api} d={D.lines.nueces} at={t.at('Now')} color={MAP3D.mexico} dashed />
            <Border api={api} d={D.lines.rioGrande} at={t.at('Now')} color={MAP3D.us} dashed />
            <Fill api={api} region="nuecesStrip" at={t.at('Now') + 6} color="#FF6F61" opacity={0.35} hatch="rgba(255,111,97,0.8)" />
            <Dot api={api} at={pl.carricitos} show={t.at('spark.') - 2} color="#FF9F1C" r={22} />
            <Glow api={api} d={D.regions.nuecesStrip} at={t.at('spark.') - 4} color="#FF9F1C" width={10} />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        {g >= t.at('nine') && g < tiles && <Highlight text="1836 – 1845" x={100} y={90} size={90} at={t.at('nine')} seed={123} rot={-2} />}
        <Note text="its own country" x={110} y={250} size={56} rot={-3} at={t.at('country,') - 4} color="#ffffff" out={tiles} />
        <Note text="slavery written into its laws" x={130} y={340} size={56} rot={-3} at={t.at('slavery') - 2} color={pal.subject} out={tiles} />
        <Note text="asks to join the U.S." x={150} y={430} size={56} rot={-3} at={t.at('asks') - 2} out={tiles} />
        {g >= tiles + 8 && g < t.at('1845,') && (
          <>
            <div style={{position: 'absolute', left: 110, top: 90, display: 'flex', gap: 60}}>
              <div><Count to={13} at={tiles + 6} dur={12} size={110} color="#9fc0d2" /><div style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 56, color: '#9fc0d2'}}>free states</div></div>
              <div><Count to={13} at={tiles + 10} dur={12} size={110} color="#e3746a" /><div style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 56, color: '#e3746a'}}>slave states</div></div>
            </div>
            <Note text="a big new slave state = a fight in Congress" x={110} y={820} size={54} rot={-2} at={t.at('Congress,') - 4} color="#ffffff" />
            <Note text="…maybe a war with Mexico" x={140} y={910} size={54} rot={-2} at={t.at('war') - 2} color="#ffffff" />
            <Stamp text="NOT YET" x={1300} y={160} at={t.at('not yet')} size={120} color={pal.subject} rot={-6} />
          </>
        )}
        {g >= t.at('1845,') && <Highlight text="1845" x={100} y={90} size={110} at={t.at('1845,')} seed={125} rot={-2} />}
        {g < t.at('breaks') && <Definition term="annex" def="to add a territory to a country" at={t.at('annexes')} x={110} y={260} w={900} />}
        <Note text="Mexico breaks off relations" x={880} y={780} size={56} rot={-3} at={t.at('breaks') - 2} color="#ffffff" />
        <Note text="all it would take is a spark" x={910} y={880} size={56} rot={-3} at={t.at('spark.') - 8} color={'#FF9F1C'} />
      </AbsoluteFill>
    </>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <March t={t} />],
    [at('March') - 1, <Attack t={t} />],
    [at('Three weeks') - 1, <Goliad t={t} />],
    [at('April') - 1, <SanJacinto t={t} />],
    [at('The next day') - 1, <Capture t={t} />],
    [at('To win') - 1, <Treaty t={t} />],
    [at('And the new') - 1, <Claim t={t} />],
    [at('For nine') - 1, <Union t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['200', 'Tejano', 'dawn,', '90', 'defenders', 'Three weeks', 'prisoners', "Houston's", 'catches', '18', 'hiding', 'dressed', 'signs', 'still',
    'strip', 'country,', 'slavery', 'asks', 'Congress,', 'war', 'breaks'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['February', 'Remember', 'March', 'April', "It's Santa", 'Hold', '1845,', 'annexes'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['rejects', 'not yet'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.38} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('300') - 4} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('San Jacinto')} src="sfx/boom.wav" volume={0.35} />
      <Sfx at={at('"El')} src="sfx/crowd_cheer.wav" volume={0.18} />
      <Sfx at={at('slave state') - 6} src="sfx/tick_soft.wav" volume={0.4} />
      <Sfx at={at('spark.')} src="sfx/marker_tick.wav" volume={0.4} />
    </>
  );
};

const TM = makeTimeline(N, 30);

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_remember_the_alamo.wav" lead={LEAD} music={[
    {src: 'music/w_aftermath.mp3', volume: 0.14, to: TM.at('April') + 6},
    {src: 'music/a_mexico.mp3', volume: 0.15, from: TM.at('April') - 6},
  ]}>
    <Body />
  </ChapterShell>
);
