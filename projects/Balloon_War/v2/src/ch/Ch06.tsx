// Chapter 6 · The Sand. Scene plan: script/SCENES_v2.md "ch06"; build brief: script/BUILD_BRIEF_v2.md. Ch01's pattern: cuts 1 frame
// before the word that starts an idea, each scene in <Sequence from={cut}>, beats as t.at(...) - cut.
//   0:00  "Some of the balloons came down before they'd dropped all their sandbags." the sandbag (coral)
//   0:04  "So the Army sent the sand to {geologists}" Julia Gardner's USGS placard, the Definition card, the sand jar
//   0:09  "What can you learn from a bag of sand? A lot" the sand jar, A LOT
//   0:14  "Under a microscope..." the microscope + a round micrograph view: diatoms, then the tiny shells (forams)
//   0:21  "And one thing was missing: coral." one foram shell; CORAL? written, crossed out; SOMEWHERE COLDER
//   0:29  "Piece by piece... a few stretches of coastline... in Japan... a real launch site" Mikesh's launch-site map,
//         Ichinomiya circled, the Ichinomiya sand vials (placeholder for the 3D SandToBeach)
//   0:38  "The same beach where Tatsuo and his friends had hunted for holes." BW01
//   0:42  "Basically, CSI. About fifty years early." back on the microscope
//   0:46  "...nobody had wanted to believe... They'd crossed the whole Pacific. On their own." Mikesh's winter winds map, a coral
//         balloon riding the arrow across (placeholder for the 3D PacificWinds)
//   0:58  "So now there was a harder question... What do you tell people?" the woods, dim; the big held tape (the midpoint)
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/v2_ch06_the_sand.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, Loop, Note, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {Print} from '../kit/print';
import {SilScene} from '../kit/silparallax';
import {CH05_FRAMES} from './Ch05';
import {CropPrint, NoPhoto, Scope, Strike} from './ch05/parts';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);
/** The last scene runs into the tail. */
const END = Math.ceil(N.duration * 30) + 80;
const MIKESH = 'Mikesh, Smithsonian, 1973';

/** "Some of the balloons came down before they'd dropped all their sandbags." */
const Bags: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="sandbag" x={720} y={190} w={480} at={1} coral trace />
    <Note text="some never got dropped" x={1000} y={760} size={58} rot={-4} at={t.at('before') - a} />
  </AbsoluteFill>
);

/** "So the Army sent the sand to geologists, scientists who study rocks and dirt." */
const Geologists: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/v2/sand/julia_gardner_placard_reston_usgs.jpg" size={[5000, 3333]} x={150} y={130} w={860} h={574} fx={2560} fy={1560}
      z={[1.18, 1.26]} a={0} b={b - a} at={1} rot={-2} tag="Placard for USGS geologist Julia Gardner · USGS" />
    <Prop name="sand_jar" x={1300} y={170} w={300} at={t.at('sand') - a} />
    <Note text="one of them: Julia Gardner" x={1040} y={720} size={52} rot={-4} at={t.at('scientists') - a} />
    <Definition term="ge·ol·o·gists" def="scientists who study rocks and dirt" at={t.at('geologists') - a} x={150} y={800} w={1100} />
  </AbsoluteFill>
);

/** "What can you learn from a bag of sand? A lot, it turns out." */
const ALot: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="sand_jar" x={760} y={170} w={400} at={1} trace />
    <Note text="a bag of sand?" x={300} y={300} size={62} rot={-4} at={t.at('bag') - a} />
    <Highlight text="A LOT" x={1220} y={560} size={130} at={t.at('lot') - a} seed={61} rot={-4} />
  </AbsoluteFill>
);

/** "Under a microscope, it was beach sand. It had certain minerals, and tiny shells from creatures that live in the sea." */
const Micro: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="microscope" x={150} y={250} w={360} at={1} from="top" />
    <Scope src="img/v2/sand/diatoms_50_species_micrograph_usgs.jpg" cx={1350} cy={500} r={320} at={t.at('microscope') - a} out={t.at('shells') - a}
      zoom={1.15} tag="Diatom shells under the microscope · USGS" />
    <Scope src="img/v2/sand/planktic_foraminifera_sem_usgs.jpg" cx={1350} cy={500} r={320} at={t.at('shells') - a} pos="30% 50%" zoom={1.0}
      tag="Tiny sea shells (foraminifera), magnified · USGS" />
    <Note text="beach sand" x={540} y={250} size={60} rot={-4} at={t.at('beach') - a} />
    <Note text="+ minerals" x={560} y={380} size={60} rot={-4} at={t.at('minerals') - a} />
    <Note text="+ tiny shells" x={580} y={510} size={60} rot={-4} at={t.at('shells') - a} />
  </AbsoluteFill>
);

/** "And one thing was missing: coral. No coral meant it wasn't from a warm, tropical beach. It came from somewhere colder." */
const NoCoral: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/v2/sand/foraminifera_shell_sem_usgs.jpg" size={[2560, 1920]} x={150} y={190} w={680} h={510} fx={1280} fy={960} at={1} rot={-2}
      tag="A foraminifera shell, magnified · USGS" />
    <Note text="missing:" x={1000} y={170} size={60} rot={-4} at={t.at('missing') - a} />
    <Note text="CORAL?" x={1050} y={270} size={100} rot={-5} at={t.at('coral') - a} />
    <Strike x1={1030} y1={360} x2={1420} y2={300} at={t.at('No coral') - a} />
    <Note text="not a warm, tropical beach" x={980} y={480} size={56} rot={-3} at={t.at('warm') - a} />
    <Highlight text="SOMEWHERE COLDER" x={890} y={660} size={84} at={t.at('colder') - a} seed={63} rot={-2} />
  </AbsoluteFill>
);

/** "Piece by piece, they narrowed it down to a few stretches of coastline... in Japan. And one of the beaches they picked was a real launch site." */
const Coast: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    {/* TODO(3D): SandToBeach — sand grains pulling out to Japan's Pacific coast, the Ichinomiya stretch lighting coral, replaces this map */}
    <CropPrint src="img/ch04_paper_balloon/launch_sites_map_fig16.jpg" size={[1720, 1885]} x={560} y={110} w={720} h={800} fx={860} fy={1150}
      z={[1.15, 1.3]} a={0} b={b - a} at={1} rot={-1} tag={`Launch sites on Honshu · ${MIKESH}`}>
      {(S) => {
        const [sx, sy] = S(943, 1481);
        const [ix, iy] = S(910, 1676);
        return (
          <>
            <Loop cx={sx} cy={sy} rx={50} ry={150} at={t.at('stretches') - a} seed={64} tilt={-4} />
            <Loop cx={ix} cy={iy} rx={60} ry={50} at={t.at('launch') - a} seed={65} />
          </>
        );
      }}
    </CropPrint>
    <Note text="a few stretches of coast" x={150} y={250} size={56} rot={-4} at={t.at('stretches') - a} />
    <Highlight text="IN JAPAN" x={170} y={400} size={96} at={t.at('Japan') - a} seed={66} rot={-3} />
    <Print src="img/v2/sand/ichinomiya_beach_sand_samples_usgs.jpg" x={1340} y={430} w={440} h={330} at={t.at('real') - a} rot={3}
      tag="Ichinomiya beach sand · USGS / PRI" />
    <Note text="Ichinomiya" x={1370} y={280} size={64} rot={-4} at={t.at('launch') - a} />
  </AbsoluteFill>
);

/** "The same beach where Tatsuo and his friends had hunted for holes." */
const Beach: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW01_beach_dawn" a={0} b={b - a} fade={1} cam={{z: [1.08, 1.14], x: [10, -20], y: [0, -6]}} fog={0.25} />
    <Note text="the same beach" x={1180} y={170} size={66} rot={-4} at={t.at('same') - a} />
    <NoPhoto text="Tatsuo Ogawa · no photo used" at={6} />
  </AbsoluteFill>
);

/** "Basically, CSI. About fifty years early." */
const CSI: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Scope src="img/v2/sand/live_foraminifera_microscope_usgs.jpg" cx={640} cy={500} r={330} at={1} zoom={1.2} tag="A foraminifera under the microscope · USGS" />
    <Prop name="microscope" x={1260} y={220} w={380} at={1} from="none" />
    <Highlight text="CSI" x={1060} y={150} size={130} at={t.at('CSI') - a} seed={67} rot={-5} />
    <Note text="...about 50 years early" x={1000} y={850} size={56} rot={-3} at={t.at('fifty') - a} />
  </AbsoluteFill>
);

/** A coral balloon riding a straight line from p to q between frames f0 and f1 (scene frames). */
const Rider: React.FC<{p: [number, number]; q: [number, number]; f0: number; f1: number}> = ({p, q, f0, f1}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  if (g < f0) return null;
  const u = interpolate(f, [f0, f1], [0, 1], clamp);
  const x = p[0] + (q[0] - p[0]) * u;
  const y = p[1] + (q[1] - p[1]) * u - Math.sin(u * Math.PI) * 60 - 34;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <line x1={x} y1={y + 20} x2={x} y2={y + 46} stroke="#1a1814" strokeWidth={3} />
      <rect x={x - 7} y={y + 44} width={14} height={9} fill="#1a1814" />
      <circle cx={x} cy={y} r={24} fill={pal.subject} stroke="#1a1814" strokeWidth={3} />
    </svg>
  );
};

/** "But that answer meant something nobody had wanted to believe... They'd crossed the whole Pacific. On their own. And nothing could stop the next one." */
const Crossed: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const box = {x: 260, y: 300, w: 1400, h: 603};
  const sc = box.w / 1990;
  const P = (sx: number, sy: number): [number, number] => [box.x + sx * sc, box.y + sy * sc];
  const [j, us] = [P(300, 560), P(1290, 520)];
  return (
    <AbsoluteFill>
      <DarkPaper />
      {/* TODO(3D): PacificWinds — the jet-stream particles with the coral balloon riding them replace this map and its arrow */}
      <Print src="img/ch04_paper_balloon/jet_stream_winter_map_fig25bottom.jpg" x={box.x} y={box.y} w={box.w} h={box.h} at={1} fit="contain"
        tag={`Winter winds over the Pacific · ${MIKESH}`} />
      <Note text="nobody wanted to believe it" x={160} y={130} size={56} rot={-3} at={t.at('nobody') - a} />
      <Note text="not from anywhere nearby" x={1000} y={200} size={56} rot={-3} at={t.at('nearby') - a} />
      <Arrow x1={j[0]} y1={j[1]} x2={us[0]} y2={us[1]} bow={40} width={7} at={t.at('crossed') - a} dur={30} />
      <Rider p={j} q={us} f0={t.at('crossed') - a} f1={t.at('own') - a + 6} />
      <Note text="on their own" x={760} y={700} size={60} rot={-3} at={t.at('own') - a} />
      <Highlight text="NOTHING COULD STOP IT" x={300} y={790} size={70} at={t.at('nothing') - a} seed={68} rot={-2} />
    </AbsoluteFill>
  );
};

/** "So now there was a harder question than where they were coming from. What do you tell people?" The midpoint: held. */
const Tell: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW03_woods_open" a={0} b={b - a} fade={1} cam={{z: [1.06, 1.12], x: [0, -14], y: [0, -6]}} fog={0.35} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.55)'}} />
    <Note text="where from? ✓" x={180} y={170} size={62} rot={-4} at={t.at('So now') - a} />
    <Note text="a harder question..." x={260} y={290} size={56} rot={-3} at={t.at('harder') - a} />
    <Highlight text="WHAT DO YOU" x={420} y={420} size={150} at={t.at('What do') - a} seed={69} rot={-2} />
    <Highlight text="TELL PEOPLE?" x={520} y={630} size={150} at={t.at('tell') - a} seed={70} rot={-2} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    geo: at('So the Army') - 1, lot: at('What can') - 1, micro: at('Under a') - 1, coral: at('And one thing') - 1, coast: at('Piece by') - 1,
    beach: at('The same') - 1, csi: at('Basically') - 1, crossed: at('But that') - 1, tell: at('So now') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Bags t={t} a={0} />],
    [c.geo, <Sequence from={c.geo} layout="none"><Geologists t={t} a={c.geo} b={c.lot} /></Sequence>],
    [c.lot, <Sequence from={c.lot} layout="none"><ALot t={t} a={c.lot} /></Sequence>],
    [c.micro, <Sequence from={c.micro} layout="none"><Micro t={t} a={c.micro} /></Sequence>],
    [c.coral, <Sequence from={c.coral} layout="none"><NoCoral t={t} a={c.coral} /></Sequence>],
    [c.coast, <Sequence from={c.coast} layout="none"><Coast t={t} a={c.coast} b={c.beach} /></Sequence>],
    [c.beach, <Sequence from={c.beach} layout="none"><Beach t={t} a={c.beach} b={c.csi} /></Sequence>],
    [c.csi, <Sequence from={c.csi} layout="none"><CSI t={t} a={c.csi} /></Sequence>],
    [c.crossed, <Sequence from={c.crossed} layout="none"><Crossed t={t} a={c.crossed} b={c.tell} /></Sequence>],
    [c.tell, <Sequence from={c.tell} layout="none"><Tell t={t} a={c.tell} b={END} /></Sequence>],
  ];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {['lot', 'colder', 'Japan', 'CSI', 'nothing'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.22} />)}
      {/* the midpoint: a heavier stamp on each half of the held tape */}
      <Sfx at={at('What do')} src="sfx/stamp.wav" volume={0.32} />
      <Sfx at={at('tell')} src="sfx/stamp.wav" volume={0.32} />
      {['before', 'scientists', 'bag', 'beach', 'minerals', 'shells', 'missing', 'coral', 'warm', 'stretches', 'launch', 'same', 'fifty', 'nobody', 'nearby', 'own',
        'So now', 'harder'].map((p) => <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('No coral')} src="sfx/marker_tick.wav" volume={0.25} />
      <Sfx at={1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      {['sand', 'microscope', 'real'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/paper_slap_soft.wav" volume={0.25} />)}
      <Sfx at={c.beach + 2} src="sfx/waves_beach.wav" volume={0.12} />
      <Sfx at={at('crossed')} src="sfx/wind_high.wav" volume={0.1} />
    </>
  );
};

// The music cue carries on from ch05: start where ch05's bed stopped (ch05 plays the cue from 0 for CH05_FRAMES - LEAD frames).
export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/v2_ch06_the_sand.wav" lead={LEAD}
    music={[{src: 'music/bw_paper_and_sand.mp3', volume: bed('bw_paper_and_sand'), startFrom: CH05_FRAMES - LEAD}]}>
    <Body />
  </ChapterShell>
);
