// Chapter 4 · The Boy on the Beach. Scene plan: script/SCENES_v2.md "ch04"; build brief: script/BUILD_BRIEF_v2.md. Follows Ch01's
// pattern: a cut 1 frame before the word that starts each idea, each scene in <Sequence from={cut}> with beats as t.at(...) - cut.
//   0:00  "Meanwhile, on a beach east of Tokyo, a 16-year-old named Tatsuo Ogawa..." BW01 at dawn + the no-photo label
//   0:07  "...sent him to the beach on a 'special assignment.'" BW01 closer, tape
//   0:13  "He and five other boys carried the paper balloons down to the sand..." two real launch-crew photos (Mikesh)
//   0:20  "And there was a reward system..." Tatsuo's sweet-potato line as a quote card + the sweet potato (B&W, teal trace only)
//   0:28  "Nothing motivates a teenager like a potato." the potato, close
//   0:31  "Then they'd let each one go... until it disappeared." BW02, the coral balloon rising away
//   0:36  "Tatsuo knew exactly what they were. And the boys had their doubts." BW01 dimmed
//   0:43  "There's no way we can win with these things." / "Japan's gonna lose." two quote cards over a dim BW01
//   0:53  "On November 3, 1944, the real attack began, from three beaches..." Mikesh's launch-site map, Ichinomiya looped in coral
//   1:01  "Over the next five months, Japan launched about 9,300 balloons." a counter, one coral dot per hundred balloons
//   1:07  "Remember that beach." the map, close on Ichinomiya
//   1:10  "somebody was about to find it... with a microscope." the microscope on the dark desk
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/v2_ch04_the_boy_on_the_beach.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Quote, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Print} from '../kit/print';
import {Prop} from '../kit/prop';
import {PlaneImg, SilScene} from '../kit/silparallax';
import {CORAL} from '../kit/vox';
import {CropPrint, cropMap, type Crop, NoPhoto} from './ch02/parts';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

const TATSUO = 'Tatsuo Ogawa · no photo used';
const MIKESH = 'Mikesh, Smithsonian, 1973';
const SITES_SRC = 'img/ch04_paper_balloon/launch_sites_map_fig16.jpg';
const SITES_SIZE: [number, number] = [1720, 1885];
const SITES_TAG = `Launch sites on Honshu · ${MIKESH}`;

/** "Meanwhile, on a beach east of Tokyo, a 16-year-old named Tatsuo Ogawa had a job of his own." */
const Beach: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW01_beach_dawn" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.1], x: [-30, 10], y: [0, -6]}} fog={0.3} />
    <Note text="a beach east of Tokyo" x={1080} y={150} size={58} rot={-3} at={t.at('beach') - a} />
    <Note text="16 years old" x={1200} y={290} size={64} rot={-4} at={t.at('16-year-old') - a} />
    <NoPhoto text={TATSUO} at={t.at('Tatsuo') - a} />
  </AbsoluteFill>
);

/** "He'd been running a machine at that secret army lab when they sent him to the beach on a 'special assignment.'" */
const Assignment: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW01_beach_dawn" a={0} b={b - a} fade={1} cam={{z: [1.16, 1.24], x: [40, 10], y: [-10, -20]}} fog={0.3} />
    <Note text="ran a machine at the secret lab" x={980} y={150} size={54} rot={-3} at={t.at('machine') - a} />
    <Highlight text="SPECIAL ASSIGNMENT" x={760} y={330} size={92} at={t.at('special') - a} seed={61} rot={-3} />
    <NoPhoto text={TATSUO} at={0} />
  </AbsoluteFill>
);

/** "He and five other boys carried the paper balloons down to the sand, filled them with hydrogen gas, and checked them for leaks." */
const Crew: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 210], [1, 1.04], clamp);
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <Print src="img/ch04_paper_balloon/japanese_crew_experimental_launch_1944.jpg" x={150} y={140} w={1000} h={487} at={1} rot={-1}
          tag={`A test launch, Japan, 1944 · ${MIKESH}`} />
        <Print src="img/ch04_paper_balloon/japanese_crew_filling_balloon_wind.jpg" x={920} y={370} w={860} h={566} at={r('filled')} rot={2}
          tag={`A crew holds a balloon in the wind · ${MIKESH}`} />
      </AbsoluteFill>
      <Note text="six boys" x={1300} y={160} size={64} rot={-4} at={r('five')} />
      <Note text="filled with hydrogen" x={170} y={720} size={58} rot={-3} at={r('hydrogen')} />
      <Note text="checked for leaks" x={170} y={850} size={58} rot={-3} at={r('leaks')} />
    </AbsoluteFill>
  );
};

/** "And there was a reward system. In his words: 'We'd get a sweet potato for each hole we found, so that was a great incentive.'" */
const Reward: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="A REWARD SYSTEM" x={170} y={110} size={92} at={r('reward')} seed={63} rot={-2} />
      <Quote text="We'd get a sweet potato for each hole we found, so that was a great incentive." at={r("We'd")} x={170} y={330} w={1100} size={62}
        who="Tatsuo Ogawa, remembering 1944" />
      {/* the sweet potato never gets coral (it reads as a watermelon): B&W with a teal trace */}
      <Prop name="sweet_potato" x={1330} y={470} w={460} at={r('sweet')} trace from="top" rot={-6} />
    </AbsoluteFill>
  );
};

/** "Nothing motivates a teenager like a potato." */
const Potato: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 100], [1, 1.06], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <Prop name="sweet_potato" x={460} y={380} w={1000} at={0} trace from="none" rot={-4} />
      </AbsoluteFill>
      <Note text="teenage motivation" x={1100} y={190} size={66} rot={-5} at={t.at('teenager') - a} />
    </AbsoluteFill>
  );
};

/** The balloon cut-out rising and shrinking away over the sea (from src/test/SilTest.tsx, timed to the release). */
const SZ: [number, number] = [2752, 1536];
const RisingBalloon: React.FC<{from: number; to: number}> = ({from, to}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [from, to], [0, 1], clamp);
  const y = 300 - 210 * k;
  const x = 2134 + 60 * k + Math.sin(f / 22) * 6;
  const w = 264 * (1 - 0.45 * k);
  const rot = Math.sin(f / 18) * 1.6;
  return <PlaneImg src="img/gen/scenes/plates/balloon_ring.png" size={SZ} x={x} y={y} w={w} aspect={576 / 264} anchor={[0.5, 122.4 / 576]}
    style={{transform: `rotate(${rot}deg)`, transformOrigin: '50% 21%', opacity: interpolate(k, [0.8, 1], [1, 0.25], clamp)}} />;
};

/** "Then they'd let each one go, and watch it drift out over the ocean until it disappeared." */
const Release: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW02_release" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.09], x: [-10, 10], y: [12, -24]}} fog={0.25}
      insert={[{plane: 3, node: <RisingBalloon from={t.at('let') - a} to={b - a} />}]} />
    <Note text="out over the ocean" x={180} y={160} size={58} rot={-3} at={t.at('drift') - a} />
    <Note text="...until it disappeared" x={240} y={290} size={58} rot={-3} at={t.at('disappeared') - a} />
  </AbsoluteFill>
);

/** "Tatsuo knew exactly what they were. And the boys had their doubts. One night they went back to their room laughing" */
const Doubts: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW01_beach_dawn" a={0} b={b - a} fade={1} cam={{z: [1.1, 1.04], x: [-20, 0], y: [-8, 0]}} fog={0.35} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.3)'}} />
    <Note text="he knew exactly what they were" x={980} y={150} size={54} rot={-3} at={t.at('exactly') - a} />
    <Highlight text="THEIR DOUBTS" x={1000} y={300} size={96} at={t.at('doubts') - a} seed={65} rot={-3} />
    <Note text="one night, laughing" x={1100} y={500} size={58} rot={-4} at={t.at('laughing') - a} />
    <NoPhoto text={TATSUO} at={0} />
  </AbsoluteFill>
);

/** "There's no way we can win with these things." Their team leader... "Japan's gonna lose." Those were test flights. */
const Lose: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const g = useGFrame();
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <SilScene name="BW01_beach_dawn" a={0} b={b - a} fade={1} cam={{z: [1.06, 1.12], x: [10, -10], y: [0, -6]}} fog={0.3} />
      <AbsoluteFill style={{background: 'rgba(8,7,5,0.68)'}} />
      {g < r('Their team') ? (
        <Quote text="There's no way we can win with these things." at={r("There's")} x={170} y={350} w={1500} size={80} who="The boys on the beach, 1944" />
      ) : (
        <>
          <Note text="their team leader, a little older" x={170} y={190} size={56} rot={-2} at={r('Their team')} />
          <Quote text="Japan's gonna lose." at={r("Japan's gonna")} x={170} y={380} w={1500} size={120} who="Their team leader, 1944" />
        </>
      )}
      <Note text="(those were test flights)" x={1080} y={790} size={56} rot={-3} at={r('test')} />
    </AbsoluteFill>
  );
};

// Mikesh Fig. 16, cropped to the Pacific coast north and east of Tokyo (source px).
const MAP_CROP: Crop = [330, 760, 1140, 1100];
const MAP_AT = {x: 200, y: 120, w: 800};
const M = cropMap(MAP_AT.x, MAP_AT.y, MAP_AT.w, MAP_CROP);

/** "On November 3, 1944, the real attack began, from three beaches on Japan's coast. That beach was one of them." */
const Sites: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 250], [1, 1.04], clamp);
  const r = (p: string) => t.at(p) - a;
  const [nx, ny] = M(1180, 1236); // Nakoso label + dot
  const [ox, oy] = M(1160, 1312); // Otsu
  const [ix, iy] = M(1070, 1676); // Ichinomiya
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '30% 50%'}}>
        <CropPrint src={SITES_SRC} size={SITES_SIZE} crop={MAP_CROP} x={MAP_AT.x} y={MAP_AT.y} w={MAP_AT.w} at={1} rot={-1} tag={SITES_TAG} />
        <Loop cx={nx} cy={ny} rx={200} ry={30} at={r('three')} dur={8} seed={11} />
        <Loop cx={ox} cy={oy} rx={200} ry={30} at={r('three') + 5} dur={8} seed={12} />
        <Loop cx={ix} cy={iy} rx={210} ry={58} at={r('beaches')} dur={8} seed={13} />
        <Loop cx={ix} cy={iy} rx={226} ry={70} at={r('That beach')} dur={10} width={8} color={CORAL} seed={14} tilt={-3} />
      </AbsoluteFill>
      <Highlight text="NOV. 3, 1944" x={1100} y={140} size={100} at={r('November')} seed={67} rot={-3} />
      <Note text="the real attack" x={1160} y={330} size={62} rot={-4} at={r('real')} />
      <Note text="three beaches" x={1160} y={470} size={62} rot={-3} at={r('three')} />
      <Note text="Tatsuo's beach: Ichinomiya" x={1060} y={760} size={58} rot={-3} at={r('That beach')} />
    </AbsoluteFill>
  );
};

/** "Over the next five months, Japan launched about 9,300 balloons." One coral dot per hundred balloons. */
const Count: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const r = (p: string) => t.at(p) - a;
  const k = interpolate(g, [r('launched'), t.at('balloons', 2) - a], [0, 1], clamp);
  const n = Math.round(9300 * k);
  const dots = Math.round(93 * k);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="Nov 1944 → Apr 1945" x={1080} y={170} size={60} rot={-3} at={r('five months')} />
      <div style={{position: 'absolute', left: 190, top: 230, fontFamily: JF.display, fontSize: 210, lineHeight: 1, color: '#f4efe6',
        textShadow: '0 6px 22px rgba(0,0,0,0.8)', opacity: interpolate(g, [r('launched') - 4, r('launched')], [0, 1], clamp)}}>
        {k < 1 ? n.toLocaleString('en-US') : 'about 9,300'}
      </div>
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        {Array.from({length: dots}, (_, i) => {
          const cx = 214 + (i % 31) * 49;
          const cy = 620 + Math.floor(i / 31) * 92;
          return (
            <g key={i}>
              <line x1={cx} y1={cy + 16} x2={cx} y2={cy + 34} stroke="rgba(244,239,230,0.55)" strokeWidth={2} />
              <circle cx={cx} cy={cy} r={16} fill={CORAL} opacity={0.9} />
            </g>
          );
        })}
      </svg>
      <Note text="each dot = 100 balloons" x={1160} y={880} size={52} rot={-3} at={t.at('balloons', 2) - a} />
    </AbsoluteFill>
  );
};

const CLOSE_CROP: Crop = [520, 1460, 800, 440];
const CLOSE_AT = {x: 360, y: 230, w: 1150};
const MC = cropMap(CLOSE_AT.x, CLOSE_AT.y, CLOSE_AT.w, CLOSE_CROP);

/** "Remember that beach." */
const Remember: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 110], [1, 1.06], clamp);
  const [ix, iy] = MC(1070, 1676);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${ix}px ${iy}px`}}>
        <CropPrint src={SITES_SRC} size={SITES_SIZE} crop={CLOSE_CROP} x={CLOSE_AT.x} y={CLOSE_AT.y} w={CLOSE_AT.w} at={1} rot={-1} tag={SITES_TAG} />
        <Loop cx={ix} cy={iy} rx={340} ry={110} at={6} dur={10} width={9} color={CORAL} seed={15} tilt={-3} />
      </AbsoluteFill>
      <Highlight text="REMEMBER THAT BEACH" x={170} y={100} size={92} at={t.at('Remember') - a} seed={69} rot={-2} />
    </AbsoluteFill>
  );
};

/** "Because on the other side of the ocean, somebody was about to find it... with a microscope." */
const Microscope: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <AbsoluteFill style={{background: 'radial-gradient(circle 520px at 960px 560px, rgba(255,214,160,0.09) 0%, transparent 100%)'}} />
    <Prop name="microscope" x={790} y={200} w={360} at={2} />
    <Note text="somebody in America" x={1200} y={230} size={58} rot={-4} at={t.at('somebody') - a} />
    <Highlight text="A MICROSCOPE" x={1120} y={760} size={96} at={t.at('microscope') - a} seed={71} rot={-3} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    assign: at("He'd been") - 1, crew: at('He and five') - 1, reward: at('And there was') - 1, potato: at('Nothing motivates') - 1,
    release: at("Then they'd") - 1, doubts: at('Tatsuo knew') - 1, lose: at('saying') - 1, sites: at('On November') - 1,
    count: at('Over the next') - 1, remember: at('Remember') - 1, microscope: at('somebody') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Sequence from={0} layout="none"><Beach t={t} a={0} b={c.assign} /></Sequence>],
    [c.assign, <Sequence from={c.assign} layout="none"><Assignment t={t} a={c.assign} b={c.crew} /></Sequence>],
    [c.crew, <Sequence from={c.crew} layout="none"><Crew t={t} a={c.crew} /></Sequence>],
    [c.reward, <Sequence from={c.reward} layout="none"><Reward t={t} a={c.reward} /></Sequence>],
    [c.potato, <Sequence from={c.potato} layout="none"><Potato t={t} a={c.potato} /></Sequence>],
    [c.release, <Sequence from={c.release} layout="none"><Release t={t} a={c.release} b={c.doubts} /></Sequence>],
    [c.doubts, <Sequence from={c.doubts} layout="none"><Doubts t={t} a={c.doubts} b={c.lose} /></Sequence>],
    [c.lose, <Sequence from={c.lose} layout="none"><Lose t={t} a={c.lose} b={c.sites} /></Sequence>],
    [c.sites, <Sequence from={c.sites} layout="none"><Sites t={t} a={c.sites} /></Sequence>],
    [c.count, <Sequence from={c.count} layout="none"><Count t={t} a={c.count} /></Sequence>],
    [c.remember, <Sequence from={c.remember} layout="none"><Remember t={t} a={c.remember} /></Sequence>],
    [c.microscope, <Sequence from={c.microscope} layout="none"><Microscope t={t} a={c.microscope} /></Sequence>],
  ];
  return (
    <>
      {useScene(cuts)}
      {/* waves at dawn under the beach scenes */}
      <Sequence from={0} durationInFrames={c.crew + 10} layout="none"><Audio src={staticFile('sfx/waves_beach.wav')} volume={0.1} /></Sequence>
      <Sequence from={c.release} durationInFrames={c.sites - c.release} layout="none"><Audio src={staticFile('sfx/waves_beach.wav')} volume={0.08} /></Sequence>
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {['special', 'reward', 'doubts', 'November', 'Remember', 'microscope'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.22} />)}
      {['beach', '16-year-old', 'machine', 'five', 'hydrogen', 'leaks', 'teenager', 'drift', 'disappeared', 'exactly', 'laughing', 'Their team', 'test',
        'real', 'three', 'That beach', 'five months', 'somebody'].map((p) => <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('balloons', 2) - 2} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={c.crew + 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={at('filled')} src="sfx/gas_hiss.wav" volume={0.18} />
      <Sfx at={at('filled')} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={at('sweet') - 1} src="sfx/paper_slap_soft.wav" volume={0.3} />
      <Sfx at={at('let')} src="sfx/rope_creak.wav" volume={0.15} />
      <Sfx at={at('launched')} src="sfx/tick.wav" volume={0.2} />
      <Sfx at={c.sites + 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={c.microscope + 2} src="sfx/paper_slap_soft.wav" volume={0.3} />
    </>
  );
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/v2_ch04_the_boy_on_the_beach.wav" lead={LEAD} music={[{src: 'music/bw_dawn_launch.mp3', volume: bed('bw_dawn_launch')}]}>
    <Body />
  </ChapterShell>
);
