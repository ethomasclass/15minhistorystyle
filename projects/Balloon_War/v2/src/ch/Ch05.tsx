// Chapter 5 · "Paper". Scene plan: script/SCENES_v2.md "ch05"; build brief: script/BUILD_BRIEF_v2.md. Built on Ch01's pattern:
// every cut lands 1 frame before the word that starts its idea; each scene sits in <Sequence from={cut}> and gets its beats as
// t.at(...) - cut.
//   0:00  "Just after sunset on a December evening, near a small town in Wyoming..." BW10, the flash and the parachute
//   0:13  "Wyoming is about as far from the war as you can get. So what was that?" the incident map, pushing in on Wyoming
//   0:18  "Five days later... Montana... Alaska... Christmas Eve... Oregon." LandingMap (3D, the west): the first pins, one by one
//   0:27  "The Army was baffled." officials over a recovered envelope near Burns, Oregon
//   0:35  "Where were they coming from? ... germs." the questions, written beside the collapsed balloon (coral)
//   0:43  "In their reports... the word 'balloon.' The code word was 'paper.'" a typed line, struck out, PAPER stamped
//   0:52  "the only real clue was... a few bags of sand." the gondola's sandbags + the sandbag (coral)
import React from 'react';
import {AbsoluteFill, interpolate, Sequence} from 'remotion';
import words from '../../public/audio/v2_ch05_paper.words.json';
import collapsedMask from '../../public/img/masks/collapsed.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {maskRef} from '../kit/maskref';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {CropPrint, RubberStamp, Typed, TypeSfx} from './ch05/parts';
import {LandingMap, W3} from '../fx/LandingMap';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);
/** The last scene runs into the tail. */
const END = Math.ceil(N.duration * 30) + 80;
const COLLAPSED = maskRef('collapsed', collapsedMask);
const MIKESH = 'Mikesh, Smithsonian, 1973';

/** A quick burst of light where the flash is in the painting (screen px), fading over ~half a second. */
const Burst: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at || g > at + 20) return null;
  const o = interpolate(g, [at, at + 2, at + 20], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none', opacity: o}}>
      <AbsoluteFill style={{background: `radial-gradient(circle 900px at ${x}px ${y}px, #fff3e0 0%, ${pal.subject}aa 12%, rgba(255,111,97,0.18) 40%, transparent 75%)`}} />
    </AbsoluteFill>
  );
};

/** "Just after sunset on a December evening, near a small town in Wyoming, people heard an explosion... a parachute". */
const Flash: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW10_wyoming_flash" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.12], x: [20, -16], y: [6, -8]}} fog={0.3} />
    <Note text="a December evening, 1944" x={150} y={250} size={50} rot={-3} at={t.at('December') - a} />
    <Highlight text="WYOMING" x={140} y={124} size={84} at={t.at('Wyoming') - a} seed={51} rot={-2} />
    <Burst x={858} y={168} at={t.at('explosion') - a} />
    <Loop cx={858} cy={168} rx={70} ry={64} at={t.at('red') - a} seed={52} />
    <Note text="a red flame" x={950} y={110} size={54} rot={-4} at={t.at('flame') - a} />
    <Loop cx={985} cy={360} rx={58} ry={74} at={t.at('parachute') - a} seed={53} />
    <Note text="a parachute?" x={1080} y={360} size={54} rot={-3} at={t.at('parachute') - a + 6} />
  </AbsoluteFill>
);

/** "Wyoming is about as far from the war as you can get. So what was that?" Mikesh's incident map, pushing in on Wyoming. */
const Far: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch04_paper_balloon/incident_map_us_mexico_fig87.jpg" size={[2400, 1970]} x={360} y={150} w={1200} h={720} fx={1080} fy={420}
      z={[1.45, 1.7]} a={0} b={b - a} at={1} rot={-1} tag={`Balloon incidents, 1944–45 · ${MIKESH}`}>
      {(S) => {
        const [wx, wy] = S(1085, 400);
        return <Loop cx={wx} cy={wy} rx={150} ry={110} at={t.at('far') - a} seed={54} />;
      }}
    </CropPrint>
    <Note text="far from the war" x={1180} y={200} size={58} rot={-4} at={t.at('war') - a} />
    <Highlight text="SO WHAT WAS THAT?" x={1000} y={878} size={74} at={t.at('So what') - a} seed={55} rot={-2} />
  </AbsoluteFill>
);

/** "Five days later, a paper balloon turned up in Montana. Then two in Alaska... Christmas Eve. Then Oregon." LandingMap (3D), the
 *  west: the first pins stand up in date order (Wyoming 6 Dec, Montana 11 Dec, Alaska 23 + 24 Dec, Oregon 31 Dec), the date window
 *  timed so Montana lands on "Montana" and Oregon on "Oregon" (one day = DAY frames). */
const Landings: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const r = (p: string) => t.at(p) - a;
  const DAY = (r('Oregon') - r('Montana')) / 20; // 11 Dec -> 31 Dec
  const start = r('Montana') - 8 * DAY; // 3 Dec
  return (
    <AbsoluteFill>
      <LandingMap at={start} dur={28 * DAY} from="1944-12-03" to="1944-12-31" bars={false} cam={[
        {f: 0, target: [W3(-134, 59)[0], 0, W3(-134, 59)[2]], dist: 18, yaw: 0.04, pitch: 1.0},
        {f: start + 28 * DAY + 30, target: [W3(-132, 58)[0], 0, W3(-132, 58)[2]], dist: 17, yaw: 0, pitch: 0.96},
      ]} />
      <Note text="Wyoming" x={1490} y={860} size={52} rot={-2} at={start + 3 * DAY} />
      <Note text="+5 days: Montana" x={1250} y={690} size={56} rot={-2} at={r('Montana')} />
      <Note text="Alaska ×2" x={290} y={430} size={58} rot={-2} at={r('Alaska')} />
      <Note text="one on Christmas Eve" x={290} y={530} size={46} rot={-2} at={r('Christmas')} />
      <Note text="Oregon" x={850} y={760} size={58} rot={-2} at={r('Oregon')} />
    </AbsoluteFill>
  );
};

/** "The Army was baffled. Giant paper balloons, with Japanese writing on them, coming down in the middle of the country." */
const Baffled: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch04_paper_balloon/fugo_officials_inspect_burns_oregon_fig2.jpg" size={[1904, 824]} x={160} y={300} w={1600} h={620} fx={952} fy={440}
      z={[1, 1.06]} a={0} b={b - a} at={1} rot={-1} tag={`Officials over a recovered balloon, Burns, Oregon, 1945 · ${MIKESH}`}>
      {(S) => {
        const [ex, ey] = S(1130, 640);
        return <Loop cx={ex} cy={ey} rx={430} ry={100} at={t.at('Giant') - a} seed={56} tilt={-4} />;
      }}
    </CropPrint>
    <Highlight text="BAFFLED" x={150} y={130} size={96} at={t.at('baffled') - a} seed={57} rot={-3} />
    <Note text="Japanese writing on them" x={900} y={150} size={56} rot={-3} at={t.at('Japanese') - a} />
  </AbsoluteFill>
);

/** "Where were they coming from? And what were they carrying? Fire bombs? Or something worse? ... germs." */
const Questions: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch04_paper_balloon/collapsed_balloon_on_ground_nara285257.jpg" size={[1920, 1488]} x={960} y={190} w={800} h={620} fx={960} fy={744}
      at={1} rot={2} mask={COLLAPSED} tintAt={4} tag="Balloon envelope on the ground · National Archives" />
    <Note text="where from?" x={170} y={170} size={62} rot={-3} at={t.at('Where') - a} />
    <Note text="carrying what?" x={200} y={300} size={62} rot={-3} at={t.at('what were') - a} />
    <Note text="fire bombs?" x={230} y={430} size={62} rot={-3} at={t.at('Fire') - a} />
    <Note text="something worse?" x={260} y={560} size={62} rot={-3} at={t.at('something worse') - a} />
    <Highlight text="GERMS?" x={240} y={720} size={120} at={t.at('germs') - a} seed={58} rot={-3} />
  </AbsoluteFill>
);

/** "In their reports, soldiers didn't even write the word 'balloon.' The code word was 'paper.'" */
const Code: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Typed x={330} y={190} w={1260} h={560} at={1} rot={-1} label="re-creation" lines={[
      {text: 'REPORT', at: 4, bold: true},
      {text: 'Subject:', at: t.at('soldiers') - a, gap: 40},
      {text: 'BALLOON', at: t.at('balloon', 2) - a, strike: t.at('balloon', 2) - a + 12, gap: 10, size: 72},
    ]} />
    <RubberStamp text="PAPER" x={980} y={470} at={t.at('paper', 3) - a} size={130} rot={-9} />
    <Note text="not the hardest code to crack" x={300} y={820} size={56} rot={-3} at={t.at('Not the') - a} />
    <Note text="...but okay" x={1240} y={858} size={56} rot={-5} at={t.at('okay') - a} />
  </AbsoluteFill>
);

/** "But you can't stop the balloons until you know where they come from. And the only real clue was... a few bags of sand." */
const Sand: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch04_paper_balloon/gondola_sandbags_closeup_fig68.jpg" size={[1050, 695]} x={170} y={190} w={900} h={596} fx={525} fy={348}
      z={[1, 1.08]} a={0} b={b - a} at={1} rot={-2} tag={`A recovered gondola with its sandbags, 1945 · ${MIKESH}`}>
      {(S) => {
        const [cx, cy] = S(560, 470);
        return <Loop cx={cx} cy={cy} rx={300} ry={150} at={t.at('clue') - a} seed={59} tilt={-6} />;
      }}
    </CropPrint>
    <Note text="where from?" x={1180} y={190} size={60} rot={-4} at={t.at('know where') - a} />
    <Prop name="sandbag" x={1280} y={330} w={380} at={t.at('bags') - a} coral trace />
    <Highlight text="A FEW BAGS OF SAND" x={260} y={870} size={78} at={t.at('sand') - a} seed={60} rot={-2} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    far: at('Wyoming is') - 1, five: at('Five days') - 1, army: at('The Army') - 1, where: at('Where were') - 1,
    code: at('In their') - 1, clue: at('But you') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Flash t={t} a={0} b={c.far} />],
    [c.far, <Sequence from={c.far} layout="none"><Far t={t} a={c.far} b={c.five} /></Sequence>],
    [c.five, <Sequence from={c.five} layout="none"><Landings t={t} a={c.five} /></Sequence>],
    [c.army, <Sequence from={c.army} layout="none"><Baffled t={t} a={c.army} b={c.where} /></Sequence>],
    [c.where, <Sequence from={c.where} layout="none"><Questions t={t} a={c.where} /></Sequence>],
    [c.code, <Sequence from={c.code} layout="none"><Code t={t} a={c.code} /></Sequence>],
    [c.clue, <Sequence from={c.clue} layout="none"><Sand t={t} a={c.clue} b={END} /></Sequence>],
  ];
    return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {['Wyoming', 'So what', 'baffled', 'germs', 'sand'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.22} />)}
      <Sfx at={at('Montana') - Math.round(((at('Oregon') - at('Montana')) * 5) / 20) - 2} src={WRITE.src} volume={WRITE.volume} />{/* "Wyoming" */}
      {['December', 'flame', 'war', 'Montana', 'Alaska', 'Christmas', 'Oregon', 'Japanese', 'Where', 'what were', 'Fire', 'something worse', 'Not the', 'okay', 'know where']
        .map((p) => <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('explosion')} src="sfx/explosion_distant.wav" volume={0.3} />
      <Sfx at={c.army + 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={c.where + 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={c.code + 1} src="sfx/page_turn.wav" volume={0.25} />
      <TypeSfx at={c.code + 5} text="REPORT" />
      <TypeSfx at={at('soldiers')} text="Subject:" />
      <TypeSfx at={at('balloon', 2)} text="BALLOON" />
      <Sfx at={at('paper', 3)} src="sfx/stamp.wav" volume={0.32} />
      <Sfx at={c.clue + 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={at('bags') - 1} src="sfx/paper_slap_soft.wav" volume={0.3} />
    </>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/v2_ch05_paper.wav" lead={LEAD} music={[{src: 'music/bw_paper_and_sand.mp3', volume: bed('bw_paper_and_sand')}]}>
    <Body />
  </ChapterShell>
);
