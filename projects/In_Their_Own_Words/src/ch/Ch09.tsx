// Chapter 9 · Back to Stephens: the two answers (why they left, why a short war), Stephens's two stories again,
// the war beginning, and the built-in end screen.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import mapData from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch09_back_to_stephens.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {DropCard} from '../kit/bs';
import {sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {BORDER_1861, type Cam3, CONFEDERACY_1861, Count, MAP3D, Map3D, type MapData, StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene, Backdrop} from '../kit/shell';
import {Split, StephensPortrait} from './Ch01';

const N = words as Narration;
const D = mapData as unknown as MapData;
/** The end screen: after the last word, this many frames more (YouTube's end-screen elements sit here, about 15 s in all). */
const EXTRA = 200;
export const CH09_FRAMES = chapterFrames(N, LEAD) + EXTRA;

const CORAL = '#FF6F61';
const U = (n: string[]) => n.map((s) => `USA:${s}`);
const FIRST_SEVEN = U(['South Carolina', 'Mississippi', 'Florida', 'Alabama', 'Georgia', 'Louisiana', 'Texas']);
const UPPER_SOUTH = U(['Virginia', 'West Virginia', 'Arkansas', 'North Carolina', 'Tennessee']);
const DECLS = ['img/ch03/georgia_declaration_of_causes_journal_p1_1861.jpg', 'img/ch03/mississippi_declaration_cover_1861.jpg', 'img/ch03/sc_declaration_immediate_causes_cover_1860.jpg'];
const RETREAT = 'img/gen/v1_ch07_retreat.jpg';
const RATIONS = 'img/gen/v1_ch05_last_rations.jpg';

/** Why did they leave? Stephens again (coral back on), and the declarations: slavery. */
const Answer: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const drop = t.at('The people');
  return (
    <StephensPortrait a={-20} b={t.at('Seven states')} traceAt={6}
      tag="Vannerson, Stephens, 1859 · Library of Congress · Georgia, Mississippi, South Carolina declarations, 1860 to 1861 · Internet Archive">
      <Note text="why did 11 states leave?" x={1060} y={90} size={52} rot={-3} at={t.at('why') - 2} color="#ffffff" />
      {DECLS.map((s, i) => (
        <DropCard key={s} src={s} x={1080 + i * 250} y={250 + (i % 2) * 30} w={210} rot={[-3, 2, -2][i]} at={drop + i * 3} filter="grayscale(1) sepia(0.3) contrast(1.12)" />
      ))}
      <Note text="they told us:" x={1080} y={640} size={46} rot={-3} at={t.at('told us') - 2} color="#ffffff" />
      {g >= t.at('slavery') && <Highlight text="SLAVERY" x={1120} y={730} size={100} at={t.at('slavery')} seed={91} rot={-2} />}
      <Note text="Lincoln: it would not spread west" x={1040} y={910} size={44} rot={-2} at={t.at("Lincoln's") - 2} />
    </StephensPortrait>
  );
};

/** Seven, then eleven (ch05's secession beat, quick). */
const Secession: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Seven states') - 1;
  const keys: Cam3[] = [{f: a, x: 2850, y: 2600, z: 0.36, tilt: 36, rot: 0}, {f: t.at('And why') - 1, x: 2800, y: 2650, z: 0.39, tilt: 44, rot: -4}];
  const more = t.at('four');
  const g = useGFrame();
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={a} stagger={0} h={20} color={MAP3D.free} />
            <StateTiles api={api} names={FIRST_SEVEN} at={a + 4} stagger={2} h={60} color={CORAL} />
            <StateTiles api={api} names={UPPER_SOUTH} at={more - 2} stagger={2} h={60} color={CORAL} />
            <StateTiles api={api} names={BORDER_1861} at={t.at('troops') - 4} stagger={1} h={30} color={MAP3D.grey} />
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(10,9,7,0.8) 0%, rgba(10,9,7,0.5) 30%, rgba(0,0,0,0) 48%)'}} />
        <div style={{position: 'absolute', left: 124, top: 70}}><Count to={7} at={a + 4} dur={20} suffix=" states" size={84} color={CORAL} /></div>
        <Note text="before Lincoln took office" x={100} y={180} size={46} rot={-3} at={t.at('before') - 2} color="#ffffff" />
        {g >= more - 2 && <div style={{position: 'absolute', left: 124, top: 290}}><Count from={7} to={11} at={more - 2} dur={16} prefix="then " size={64} color={CORAL} /></div>}
        <Note text="when he called for troops" x={100} y={380} size={46} rot={-3} at={t.at('called') - 2} color="#ffffff" />
        <Note text="border states (grey): stay" x={100} y={900} size={46} rot={-2} at={t.at('troops')} color="#ffffff" />
      </AbsoluteFill>
    </>
  );
};

/** Why a quick war? Each side counted its own strengths. */
const Strengths: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('And why') - 1;
  const head = (text: string, x: number, color: string, at: number) => g >= at && (
    <div style={{position: 'absolute', left: x, top: 330, fontFamily: JF.mono, fontSize: 34, letterSpacing: 4, color, textShadow: '0 1px 6px #000'}}>{text}</div>
  );
  return (
    <AbsoluteFill>
      <Backdrop src="img/ch07/first_bull_run_sunday_afternoon.jpg" size={sizeOf('img/ch07/first_bull_run_sunday_afternoon.jpg')} a={t.at('And why') - 1} side="none" dim={0.3} tag="The First Battle of Bull Run, Sunday afternoon, July 21, 1861 · Library of Congress" />
      <Note text="why did everyone expect a quick war?" x={110} y={80} size={58} rot={-2} at={t.at('everyone') - 2} color="#ffffff" />
      <Note text="each side counted its own strengths" x={150} y={200} size={46} rot={-2} at={t.at('counted') - 2} />
      <div style={{position: 'absolute', left: 958, top: 330, width: 4, height: 640, background: '#f4efe6', opacity: interpolate(g, [a, a + 4], [0, 0.8], clamp)}} />
      {head('THE NORTH', 160, pal.mark, t.at('North') - 2)}
      {head('THE SOUTH', 1060, CORAL, t.at('South') - 2)}
      <Note text="people" x={180} y={430} size={72} rot={-3} at={t.at('people and') - 2} />
      <Note text="factories" x={200} y={560} size={72} rot={-3} at={t.at('factories') - 2} />
      <Note text="generals" x={1080} y={430} size={66} rot={-3} at={t.at('generals') - 2} color={CORAL} />
      <Note text="home ground" x={1100} y={560} size={66} rot={-3} at={t.at('home') - 2} color={CORAL} />
      <Note text="King Cotton" x={1120} y={690} size={66} rot={-3} at={t.at('King') - 2} color={CORAL} />
      <Note text="(both sides: this will be quick)" x={1000} y={860} size={42} rot={-2} at={t.at('Cotton') + 6} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** Then came Bull Run. */
const BullRun: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={RETREAT} px={sizeOf(RETREAT)} fx={700} fy={400} a={t.at('Then came') - 1} b={t.at('Stephens told')} z0={1.02} z1={1.1} fade={6}
    tag="Illustration · the retreat from Bull Run, July 21, 1861">
    {() => <Highlight text="BULL RUN" x={110} y={110} size={110} at={t.at('Bull')} seed={93} rot={-2} />}
  </Engraving>
);

/** Stephens's two stories again; the 1861 side gets the loop. */
const TwoStories: React.FC<{t: TL}> = ({t}) => (
  <Split a={t.at('Stephens told') - 1} label1={t.at('Stephens told') + 4} label2={t.at('different') - 2} loopAt={t.at('exactly') - 2}>
    <Note text="what his country was for" x={200} y={935} size={46} rot={-3} at={t.at('what his') - 2} color={CORAL} />
  </Split>
);

/** The war had started. A held picture, no marks. */
const Started: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={RATIONS} px={sizeOf(RATIONS)} fx={645} fy={380} a={t.at('The war had') - 1} b={t.at('Thanks') + 8} z0={1.0} z1={1.07} fade={8}
    tag="Illustration · the Fort Sumter garrison, April 1861" />
);

/** The end screen: the 1861 map drifting, two video slots, a subscribe circle, thanks. (YouTube's elements go on top.) */
const EndScreen: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Thanks') - 1;
  const k = interpolate(g, [a, a + 18], [0, 1], clamp);
  const keys: Cam3[] = [
    {f: a, x: 2900, y: 2500, z: 0.34, tilt: 40, rot: 0},
    {f: a + 600, x: 2700, y: 2700, z: 0.38, tilt: 44, rot: -6},
  ];
  const slot = (x: number, y: number, at: number) => (
    <div style={{position: 'absolute', left: x, top: y, width: 640, height: 360, border: `5px solid ${pal.mark}`, borderRadius: 10, background: 'rgba(10,10,10,0.55)',
      opacity: interpolate(g, [at, at + 10], [0, 1], clamp), boxShadow: '0 16px 30px rgba(0,0,0,0.5)'}} />
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `brightness(${1 - 0.55 * k})`}}>
        <Map3D data={D} keys={keys} states={0.5}>
          {(api) => (
            <>
              <StateTiles api={api} names={UNION_FREE_1861} at={-99} stagger={0} h={20} color={MAP3D.free} />
              <StateTiles api={api} names={BORDER_1861} at={-99} stagger={0} h={26} color={MAP3D.grey} />
              <StateTiles api={api} names={CONFEDERACY_1861} at={-99} stagger={0} h={56} color={CORAL} />
            </>
          )}
        </Map3D>
      </AbsoluteFill>
      {slot(110, 150, a + 6)}
      {slot(110, 590, a + 12)}
      <div style={{position: 'absolute', left: 1240, top: 200, width: 330, height: 330, borderRadius: '50%', border: `5px solid ${pal.mark}`, background: 'rgba(10,10,10,0.55)',
        opacity: interpolate(g, [a + 18, a + 28], [0, 1], clamp)}} />
      <Note text="thanks for watching" x={1060} y={600} size={62} rot={-3} at={a + 4} color="#ffffff" />
      <Note text="next: a war about freedom" x={1000} y={720} size={50} rot={-3} at={t.at('Next time') - 2} color={CORAL} />
      <Note text="subscribe ↑" x={1270} y={840} size={54} rot={-3} at={t.at('Subscribe') - 2} />
      <Tag text="Map · the United States in 1861" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Answer t={t} />],
    [at('Seven states') - 1, <Secession t={t} />],
    [at('And why') - 1, <Strengths t={t} />],
    [at('Then came') - 1, <BullRun t={t} />],
    [at('Stephens told') - 1, <TwoStories t={t} />],
    [at('The war had') - 1, <Started t={t} />],
    [at('Thanks') - 1, <EndScreen t={t} />],
  ];
  const scene = useScene(cuts);
  const notes = ['why', 'told us', "Lincoln's", 'before', 'called', 'troops', 'everyone', 'counted', 'people and', 'factories', 'generals', 'home', 'King', 'different', 'what his', 'Next time', 'Subscribe'];
  return (
    <>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['slavery', 'Bull'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {[0, 1, 2].map((i) => <Sfx key={`d${i}`} at={at('The people') + i * 3} src="sfx/tick.wav" volume={0.4} />)}
      <Sfx at={at('four') - 2} src="sfx/tick_soft.wav" volume={0.4} />
    </>
  );
};

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_back_to_stephens.wav" lead={LEAD} extra={EXTRA} music={[{src: 'music/r_abolition_a.mp3', volume: 0.064}]}>
    <Body />
  </ChapterShell>
);
