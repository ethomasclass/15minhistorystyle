// Chapter 9 · Who Paid (quiet): soldiers dead of disease, Mexico's uncounted losses, 80,000 people the border moved over,
// the 1851 land law, Native nations and enslaved Texans no one asked, and Juan Seguín, "a foreigner in my native land".
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import mapData from '../../public/maps/mex1846.json';
import words from '../../public/audio/ch09_who_paid.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {type Cam3, Count, Dot, Hand, MAP3D, Map3D, type MapData, MovingBorder, PlaceTag, Route, Stand} from '../kit/map3d';
import {Person} from '../kit/figures';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, Quote, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places;
export const CH09_FRAMES = chapterFrames(N, LEAD);

const GEN: [number, number] = [1376, 768];
const BONE = '#EDE7DC';

/** Who paid? Battle deaths vs. disease, over the sick tents. */
const Disease: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const r = t.at('For every') - 2;
  return (
    <Parallax name="orderly" src="img/gen/ch09_sick_tents.jpg" size={GEN} a={-10} b={t.at("Mexico's losses")} fx={0.5} fy={0.5}
      cam={{z: [1.0, 1.08]}} depth={1.04} vignette={0.55} mask={MASKS.orderly} tint={null} traceAt={t.at('disease:')}
      filter="grayscale(1) contrast(1.05) brightness(0.9)" tag="Illustration · a U.S. Army hospital camp in Mexico, 1847">
      {() => (
        <>
          <AbsoluteFill style={{background: 'rgba(8,7,5,0.45)'}} />
          <Note text="who paid for all this?" x={110} y={80} size={66} rot={-3} at={t.at('who') - 2} color={BONE} />
          <div style={{position: 'absolute', left: 110, top: 220, opacity: g >= t.at('1,700') - 2 ? 1 : 0}}>
            <Count to={1700} at={t.at('1,700') - 2} dur={14} size={96} color={BONE} />
            <div style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 52, color: BONE}}>Americans killed in battle</div>
          </div>
          <div style={{position: 'absolute', left: 1100, top: 220, opacity: g >= t.at('11,500') - 2 ? 1 : 0}}>
            <Count to={11500} at={t.at('11,500') - 2} dur={20} size={96} color={pal.mark} />
            <div style={{fontFamily: '"Nanum Pen Script", cursive', fontSize: 52, color: pal.mark}}>died of disease</div>
          </div>
          <Note text="dysentery · yellow fever · measles" x={1000} y={440} size={44} rot={-2} at={t.at('dysentery,') - 2} color={BONE} />
          {g >= r && (
            <>
              <Person x={300} y={900} h={150} color={BONE} at={r} />
              <div style={{position: 'absolute', left: 390, top: 820, fontFamily: '"Abril Fatface", serif', fontSize: 70, color: BONE}}>:</div>
              {Array.from({length: 7}).map((_, i) => <Person key={i} x={500 + i * 100} y={900} h={150} color={pal.mark} at={t.at('7') - 2 + i * 2} />)}
              <Note text="1 in battle : nearly 7 of sickness" x={600} y={720} size={50} rot={-3} at={t.at('sickness.') - 4} color={BONE} />
            </>
          )}
        </>
      )}
    </Parallax>
  );
};

/** Mexico's losses; then the people the border moved over; Native nations. */
const Border: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at("Mexico's losses") - 1;
  const towns: [keyof typeof pl, string][] = [['santaFe', 'Santa Fe'], ['taos', 'Taos'], ['albuquerque', 'Albuquerque'], ['tucson', 'Tucson'], ['losAngeles', 'Los Angeles'],
    ['sanDiego', 'San Diego'], ['monterey', 'Monterey'], ['sanFrancisco', 'San Francisco']];
  const keys: Cam3[] = [
    {f: a, x: 2900, y: 2600, z: 0.32, tilt: 38, rot: 0},
    {f: t.at('About 80,000') - 2, x: 1800, y: 1300, z: 0.42, tilt: 42, rot: 2},
    {f: t.at('Native'), x: 1900, y: 1250, z: 0.44, tilt: 44, rot: 2},
    {f: t.at('In Texas,') + 4, x: 3000, y: 1800, z: 0.55, tilt: 46, rot: -4},
  ];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            {towns.map(([k, name], i) => (
              <React.Fragment key={k}>
                <Dot api={api} at={pl[k]} show={t.at('About 80,000') + i * 2} color={MAP3D.mexico} r={12} />
                <Stand api={api} at={[pl[k][0], pl[k][1] - 10]} show={t.at('Mexicans') + i * 2} out={t.at('On paper,')}><PlaceTag text={name} size={22} /></Stand>
              </React.Fragment>
            ))}
            <MovingBorder api={api} from={D.polylines.oldBorder} to={D.polylines.newBorder} at={t.at('The border') - 4} dur={30} show={t.at('About 80,000')} color={MAP3D.mexico} width={8} label="the border" />
            {Object.entries(D.nations).map(([name, at], i) => (
              <Stand key={name} api={api} at={at} z={20} show={t.at('Native') + i * 2} out={t.at('In Texas,')}><Hand text={name} size={40} color={BONE} bg /></Stand>
            ))}
            <Stand api={api} at={[3300, 1850]} z={30} show={t.at('enslaved') - 2}><Hand text="tens of thousands enslaved" size={56} color={BONE} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="Mexico's losses: larger, and never fully counted" x={110} y={80} size={52} rot={-2} at={t.at("Mexico's losses") - 2} color={BONE} out={t.at('About 80,000')} />
        <div style={{position: 'absolute', left: 110, top: 80, opacity: g >= t.at('About 80,000') && g < t.at('Native') ? 1 : 0}}>
          <Count to={80000} at={t.at('About 80,000')} dur={18} size={90} color={BONE} suffix=" people" />
        </div>
        {g >= t.at("They didn't") && g < t.at('Native') && <Highlight text="THEY DIDN'T MOVE. THE BORDER DID." x={110} y={880} size={66} at={t.at("They didn't")} seed={211} rot={-1} />}
        <Note text="no one asked them" x={110} y={90} size={64} rot={-3} at={t.at('No one asked') - 2} color={BONE} out={t.at('In Texas,')} />
        <Note text="no one asked them either" x={110} y={880} size={64} rot={-3} at={t.at('either.') - 6} color={BONE} />
      </AbsoluteFill>
    </>
  );
};

/** On paper, protected: the 1851 land law and the hearings. */
const Land: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Parallax name="ranchero" src="img/gen/ch09_land_hearing.jpg" size={GEN} a={t.at('On paper,') - 1} b={t.at('Native')} fx={0.4} fy={0.5}
      cam={{z: [1.0, 1.1], x: [0.04, -0.04]}} depth={1.05} vignette={0.5} mask={MASKS.ranchero} tint={null} traceAt={t.at('landowners')}
      filter="grayscale(1) contrast(1.05) brightness(0.92)" tag="Illustration · a California land-claims hearing, 1850s">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to left, rgba(8,7,5,0.9) 0%, rgba(8,7,5,0.8) 38%, rgba(0,0,0,0) 56%)'}} />
          <Note text="on paper: protected" x={1090} y={100} size={54} rot={-3} at={t.at('On paper,') + 2} color={BONE} />
          {g >= t.at('1851,') && <Highlight text="1851" x={1090} y={210} size={100} at={t.at('1851,')} seed={213} rot={-2} />}
          <Note text="prove your title in court" x={1090} y={380} size={50} rot={-3} at={t.at('prove') - 2} color={pal.mark} />
          <Note text="many cases: 15+ years" x={1090} y={490} size={50} rot={-3} at={t.at('15') - 2} color={BONE} />
          <Note text="lawyers' fees, squatters…" x={1090} y={600} size={50} rot={-3} at={t.at("Lawyers'") - 2} color={BONE} />
          <Note text="the land went anyway" x={1100} y={710} size={54} rot={-3} at={t.at('anyway.') - 4} color={pal.mark} />
        </>
      )}
    </Parallax>
  );
};

/** Juan Seguín: mayor, driven out, a foreigner in his native land. */
const Seguin: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('And Juan') - 1;
  const keys: Cam3[] = [
    {f: a, x: 3150, y: 2120, z: 1.4, tilt: 50, rot: -8},
    {f: t.at('drove') + 6, x: 3000, y: 2400, z: 0.8, tilt: 46, rot: -6},
    {f: t.at('Years later'), x: 3100, y: 2250, z: 1.0, tilt: 48, rot: -6},
  ];
  const quiet = interpolate(g, [t.at('Years later') - 4, t.at('Years later') + 10], [0, 0.85], clamp);
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Dot api={api} at={pl.sanAntonio} color={MAP3D.mexico} r={14} />
            <Stand api={api} at={[pl.sanAntonio[0], pl.sanAntonio[1] - 10]}><PlaceTag text="San Antonio · the Alamo" size={28} /></Stand>
            <Stand api={api} at={[3160, 2040]} z={30} show={t.at('mayor') - 2} out={t.at('drove')}><Hand text="Mayor Seguín, 1841" size={60} color={BONE} bg /></Stand>
            <Route api={api} pts={[pl.sanAntonio, [3060, 2300], pl.monterrey]} at={t.at('drove')} dur={24} color={BONE} width={8} dashed />
            <Stand api={api} at={[3050, 2420]} z={30} show={t.at('drove') + 20}><Hand text="driven out → Mexico, 1842" size={54} color={BONE} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="Juan Seguín: the Tejano who rode for help" x={110} y={80} size={54} rot={-2} at={t.at('Juan') - 2} color={BONE} out={t.at('Years later')} />
        <Note text="accused of siding with Mexico" x={110} y={180} size={52} rot={-2} at={t.at('accused') - 2} color={pal.mark} out={t.at('Years later')} />
        <Note text="under pressure, he ends up fighting for Mexico" x={110} y={880} size={50} rot={-2} at={t.at('Under') - 2} color={BONE} out={t.at('Years later')} />
        <CropCard src="img/ch04/seguin_1838.jpg" size={[1464, 1306]} x={1380} y={240} w={420} h={480} fx={700} fy={560} scale={0.42} rot={2} at={t.at('Juan') - 2}
          mask={MASKS.seguin} tint={null} traceAt={t.at('Juan') + 2} />
        {g >= t.at('Juan') - 2 && <Tag text="Juan N. Seguín, painted from life by Thomas Jefferson Wright, 1838 · Texas State Capitol" />}
        <AbsoluteFill style={{background: '#000', opacity: quiet}} />
        <Quote text="a foreigner in my native land" at={t.at('"a')} x={240} y={420} w={1440} size={84} who="Juan N. Seguín, Personal Memoirs (1858)" />
      </AbsoluteFill>
    </>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Disease t={t} />],
    [at("Mexico's losses") - 1, <Border t={t} />],
    [at('On paper,') - 1, <Land t={t} />],
    [at('Native') - 1, <Border t={t} />],
    [at('And Juan') - 1, <Seguin t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['who', 'dysentery,', 'sickness.', 'No one asked', 'either.', 'prove', '15', "Lawyers'", 'anyway.', 'Juan', 'accused', 'Under'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume * 0.8} />)}
      {['1,700', '11,500', 'About 80,000'].map((c) => <Sfx key={c} at={at(c) - 2} src="sfx/tick_soft.wav" volume={0.35} />)}
      <Sfx at={at('1851,')} src="sfx/stamp.wav" volume={0.22} />
    </>
  );
};

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_who_paid.wav" lead={LEAD} quiet music={[{src: 'music/m_lament.mp3', volume: 0.13}]}>
    <Body />
  </ChapterShell>
);
