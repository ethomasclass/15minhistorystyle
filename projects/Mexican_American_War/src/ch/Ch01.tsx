// Chapter 1 · The Exact Spot (cold open): Lincoln's question, Polk's claim, the two rivers, the driving question.
// Then the channel intro and the title card. Chapter 1 has no logo break in front.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import mapData from '../../public/maps/mex1846.json';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {Border, type Cam3, Fill, Flow, Hand, MAP3D, Map3D, type MapData, Slab, Stake, Stand} from '../kit/map3d';
import {Parallax} from '../kit/parallax';
import {CropCard, makeTimeline, type Narration, Quote, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
const D = mapData as unknown as MapData;
const pl = D.places;
/** Title card length (frames) after the channel intro. */
const TITLE_FRAMES = 150;
/** Narration ends; the channel intro starts after a breath. */
const END = Math.ceil(N.duration * 30) + 45;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

const LINCOLN: [number, number] = [1920, 2432];
const POLK: [number, number] = [1920, 2309];
const SPOT: [number, number] = [960, 1207];
const SPOT_SRC = 'img/ch01/spot_resolutions.jpg';
const SPOT_TAG = 'Abraham Lincoln, the Spot Resolutions, Dec. 22, 1847 · National Archives';

/** December 1847: a brand-new congressman, 38. */
const Lincoln: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="lincoln" src="img/ch01/lincoln_shepherd_1846.jpg" size={LINCOLN} a={0} b={t.at('And he has')} fx={0.5} fy={0.3}
    cam={{z: [1.0, 1.12], y: [0.02, -0.01]}} depth={1.06} vignette={0.45} mask={MASKS.lincoln} tintStrength={0.6} traceAt={t.at('Abraham')}
    tag="Nicholas H. Shepherd, Abraham Lincoln, 1846 or 1847 · Library of Congress">
    {() => (
      <>
        <Highlight text="DEC. 22, 1847" x={100} y={100} size={96} at={t.at('December')} seed={11} rot={-2} />
        <Note text="brand-new congressman" x={100} y={540} size={50} rot={-4} at={t.at('brand-new') - 2} />
        <Note text="age 38" x={150} y={650} size={60} rot={-3} at={t.at('38') - 2} color="#ffffff" />
      </>
    )}
  </Parallax>
);

/** His resolutions, in his own hand: eight questions, one point. */
const Resolutions: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const z = interpolate(g, [t.at('And he has'), t.at('where')], [0.78, 0.9], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={SPOT_SRC} size={SPOT} x={150} y={110} w={720} h={860} fx={480} fy={interpolate(z, [0.78, 0.9], [610, 729])} scale={z} rot={-1.5} at={t.at('And he has')}>
        {(S) => {
          const [ax, ay] = S(790, 1058);
          const [bx, by] = S(175, 1102);
          return (
            <>
              <Loop cx={ax} cy={ay} rx={130 * z} ry={34 * z} at={t.at('where') + 2} seed={21} tilt={-3} />
              <Loop cx={bx} cy={by} rx={110 * z} ry={30 * z} at={t.at('spot?')} seed={23} tilt={-2} />
            </>
          );
        }}
      </CropCard>
      <Note text="8 questions" x={960} y={200} size={60} rot={-4} at={t.at('Eight') - 2} color="#ffffff" />
      <Note text="really just one:" x={1000} y={330} size={56} rot={-3} at={t.at('boil') - 2} />
      {g >= t.at('where') && <Highlight text="WHERE IS THE SPOT?" x={960} y={480} size={80} at={t.at('where')} seed={25} rot={-2} />}
      <Tag text={SPOT_TAG} />
    </AbsoluteFill>
  );
};

/** Polk's war message: American blood on American soil. */
const Polk: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
  <Parallax name="polk" src="img/ch01/polk_brady_1849.jpg" size={POLK} a={t.at('A year') - 1} b={t.at('Lincoln wants')} fx={0.5} fy={0.3}
    cam={{z: [1.0, 1.1], x: [0.02, -0.01]}} depth={1.06} vignette={0.5} mask={MASKS.polk} tintStrength={0.6} traceAt={t.at('Polk')}
    tag="Mathew Brady, James K. Polk, 1849 · Library of Congress">
    {() => (
      <>
        <Highlight text="PRESIDENT POLK" x={100} y={100} size={84} at={t.at('President James')} seed={31} rot={-2} />
        <Note text="May 1846: asks for war" x={1180} y={240} size={54} rot={-4} at={t.at('asked') - 2} />
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 45%)', opacity: interpolate(g, [t.at('shed'), t.at('shed') + 6], [0, 1], clamp)}} />
        <Quote text="shed American blood upon the American soil" at={t.at('shed')} x={140} y={720} w={1640} size={60} who="Polk to Congress, May 11, 1846" />
      </>
    )}
  </Parallax>
  );
};

/** "Which soil?": Lincoln's underlined "our own soil". */
const WhichSoil: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={SPOT_SRC} size={SPOT} x={150} y={150} w={820} h={560} fx={360} fy={980} scale={1.25} rot={1.5} at={t.at('Lincoln wants') - 1}>
        {(S) => {
          const [cx, cy] = S(360, 1150);
          return <Loop cx={cx} cy={cy} rx={190} ry={44} at={t.at('soil.', 2) - 2} seed={41} tilt={-2} />;
        }}
      </CropCard>
      <Note text="which soil?" x={1060} y={200} size={72} rot={-4} at={t.at('which') - 2} color="#ffffff" />
      <Note text="American?" x={1100} y={360} size={64} rot={-3} at={t.at('Because') - 2} />
      <Note text="or Mexican?" x={1140} y={480} size={64} rot={-3} at={t.at('Mexican') - 2} color={pal.subject} />
      <Note text="then the whole story changes" x={1000} y={680} size={52} rot={-3} at={t.at('whole') - 2} color="#ffffff" />
      <Tag text={SPOT_TAG} />
    </AbsoluteFill>
  );
};

/** The map: two rivers, two claims, the strip between; then the question, and the settlers coming in. */
const Rivers: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a0 = t.at('So look') - 1;
  const keys: Cam3[] = [
    {f: a0, x: 3400, y: 1650, z: 0.38, tilt: 22, rot: 0},
    {f: t.at('Nueces,'), x: 3110, y: 2210, z: 1.55, tilt: 46, rot: -8},
    {f: t.at('Mexico said'), x: 3110, y: 2240, z: 1.75, tilt: 50, rot: -12},
    {f: t.at('become') + 10, x: 3080, y: 2150, z: 0.95, tilt: 46, rot: -6},
    {f: t.at('half its'), x: 2550, y: 1700, z: 0.4, tilt: 38, rot: 0},
    {f: t.at('It starts'), x: 3250, y: 1850, z: 0.75, tilt: 44, rot: -4},
  ];
  const strip: [number, number] = [3120, 2210];
  return (
    <>
      <Map3D data={D} keys={keys}>
        {(api) => (
          <>
            <Border api={api} d={D.lines.nueces} at={t.at('Nueces,')} color={MAP3D.mexico} dashed label="Nueces · Mexico's line" labelSize={26} labelTo={0.9} labelOut={t.at("here's the question")} />
            <Border api={api} d={D.lines.rioGrande} at={t.at('Rio')} color={MAP3D.us} dashed label="Rio Grande · Texas's claim" labelSize={26} labelTo={0.3} labelOut={t.at("here's the question")} />
            <Fill api={api} region="nuecesStrip" at={t.at('Mexico said') + 20} out={t.at('strip')} color="#FF6F61" opacity={0.25} hatch="rgba(255,111,97,0.7)" />
            <Slab api={api} region="nuecesStrip" at={t.at('strip')} h={40} fall={t.at('It starts')} />
            <Stand api={api} at={[3170, 2240]} z={30} show={t.at('150') - 2} out={t.at('Texas said')}><Hand text="about 150 miles" size={64} color="#ffffff" bg /></Stand>
            <Stand api={api} at={pl.laredo} z={20} show={t.at('Texas said') + 4} out={t.at('become')}><Hand text="Texas: here" size={72} color={MAP3D.us} bg /></Stand>
            <Stand api={api} at={[3240, 2120]} z={20} show={t.at('Mexico said') + 4} out={t.at('become')}><Hand text="Mexico: here" size={72} color={MAP3D.mexico} bg /></Stand>
            <Stand api={api} at={pl.carricitos} show={t.at("here's the question") + 4} out={t.at('become')}><Stake /></Stand>
            <Slab api={api} region="texasClaim" at={t.at('half its') - 4} h={26} layers={6} fall={t.at('It starts') - 6} opacity={0.85} />
            <Slab api={api} region="cession" at={t.at('half its')} h={26} layers={6} fall={t.at('It starts') - 6} opacity={0.85} />
            <Flow api={api} from={[4050, 1650]} to={[3420, 1950]} at={t.at('inviting')} n={20} spread={150} toSpread={110} color={MAP3D.us} seed="ch1" />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="the question:" x={110} y={70} size={52} rot={-3} at={t.at("here's the question") - 2} out={t.at('become')} color="#ffffff" />
        <Note text="a fight over a strip of land…" x={150} y={170} size={62} rot={-3} at={t.at('strip') - 2} out={t.at('half its')} />
        <Note text="…a war that cost Mexico half its land" x={110} y={80} size={58} rot={-3} at={t.at('cost') - 2} out={t.at('It starts')} />
        <Note text="and made America's biggest problem worse?" x={140} y={180} size={56} rot={-3} at={t.at("America's") - 2} out={t.at('It starts')} color={pal.subject} />
      </AbsoluteFill>
    </>
  );
};

/** Title card after the channel intro: the tilted map, dimmed, the title on orange, the subtitle in teal. */
const Title: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  const keys: Cam3[] = [{f: 0, x: 3000, y: 1900, z: 0.42, tilt: 36, rot: -2}, {f: TITLE_FRAMES, x: 3060, y: 1950, z: 0.48, tilt: 40, rot: -5}];
  return (
    <AbsoluteFill style={{background: '#0b0c0d'}}>
      <AbsoluteFill style={{filter: 'brightness(0.5)'}}><Map3D data={D} keys={keys} rivers={0.6} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.15) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Highlight text={TITLE} x={300} y={360} size={170} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 340, top: 620, fontFamily: JF.display, fontSize: 46, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1340} y={740} size={52} rot={-5} at={24} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  // [cut frame, scene]: cut 1 frame before the word that starts the new idea
  const cuts: [number, React.ReactNode][] = [
    [0, <Lincoln t={t} />],
    [at('And he has') - 1, <Resolutions t={t} />],
    [at('A year') - 1, <Polk t={t} />],
    [at('Lincoln wants') - 1, <WhichSoil t={t} />],
    [at('So look') - 1, <Rivers t={t} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const notes = ['brand-new', '38', 'Eight', 'boil', 'asked', 'which', 'Because', 'Mexican', 'whole', "here's the question", 'strip', 'cost', "America's"];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/r_cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, END - 70, END - 10], [0, 0.17, 0.17 * 1.5, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['December', 'where', 'President James'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {['Nueces,', 'Rio'].map((c) => <Sfx key={c} at={at(c)} src="sfx/marker_tick.wav" volume={0.25} />)}
      <Sfx at={at("here's the question") + 4} src="sfx/tick.wav" volume={0.45} />
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Ch01: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
