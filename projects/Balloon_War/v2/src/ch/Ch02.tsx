// Chapter 2 · Revenge on the Wind. Scene plan: script/SCENES_v2.md "ch02"; build brief: script/BUILD_BRIEF_v2.md. Follows Ch01's
// pattern: a cut 1 frame before the word that starts each idea, each scene in <Sequence from={cut}> with its beats passed as
// t.at(...) - cut.
//   0:00  "In the spring of 1942, a handful of American bombers took off from an aircraft carrier" B-25s on Hornet, then the take-off
//   0:06  "and bombed Tokyo... furious." BW06, the raid over the rooftops
//   0:18  "So Japan wanted to hit back... At America itself." PacificWinds (3D): the North Pacific, no winds
//   0:25  "There was just one problem... make it home." PacificWinds closer: dashed Tokyo -> Seattle, ≈ 4,800 MILES, "too far"
//   0:34  "a secret army lab... What if the wind could do it?" the barometer on the dark desk
//   0:43  "Way up high... a fast river of air" PacificWinds: the January 1945 winds switch on, flowing west to east
//   0:51  "A Japanese weatherman had mapped it..." BW07, then the {jet stream} definition card
//   0:57  "So the army made a plan." the Moffett balloon print, three notes for the three sentences
//   1:05  "They just needed somebody to build thousands of them." a launch crew, "who would build them?"
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/v2_ch02_revenge_on_the_wind.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, Loop, Note} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Print} from '../kit/print';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {NoPhoto} from './ch02/parts';
import {PacificWinds} from '../fx/PacificWinds';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

/** "In the spring of 1942, a handful of American bombers took off from an aircraft carrier" */
const Carrier: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 200], [1, 1.05], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <Print src="img/v2/raid1942/b25s_crowded_on_hornet_deck_1942.jpg" x={150} y={150} w={940} h={717} at={2} rot={-2}
          tag="B-25s on USS Hornet's deck, April 1942 · National Archives" />
        <Print src="img/v2/raid1942/b25_takeoff_from_hornet_80g41196.jpg" x={850} y={230} w={920} h={717} at={t.at('took') - a} rot={2}
          tag="A B-25 takes off from USS Hornet, 1942 · US Navy" />
      </AbsoluteFill>
      <Highlight text="SPRING 1942" x={170} y={100} size={84} at={t.at('spring') - a} seed={31} rot={-2} />
    </AbsoluteFill>
  );
};

/** "and bombed Tokyo. They didn't do much damage... Japan's leaders were furious." */
const Raid: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW06_raid_tokyo" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.14], x: [-24, 20], y: [0, -10]}} fog={0.25} />
    <Note text="Tokyo" x={180} y={180} size={70} rot={-4} at={t.at('Tokyo') - a} />
    <Note text="not much damage" x={1180} y={560} size={56} rot={-3} at={t.at('damage') - a} />
    <Note text="right over the capital" x={760} y={150} size={52} rot={-3} at={t.at('flown') - a} />
    <Highlight text="FURIOUS" x={1160} y={760} size={120} at={t.at('furious') - a} seed={33} rot={-3} />
  </AbsoluteFill>
);

/** "So Japan wanted to hit back. Not at a ship, or an island. At America itself." The 3D Pacific, no winds yet. */
const HitBack: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <PacificWinds at={1} />
    <Highlight text="HIT BACK" x={170} y={116} size={96} at={t.at('hit') - a} seed={35} rot={-2} />
    <Note text="not a ship, not an island" x={560} y={760} size={54} rot={-3} at={t.at('ship') - a} />
    <Note text="America itself" x={1300} y={800} size={60} rot={-4} at={t.at('America itself') - a} />
  </AbsoluteFill>
);

/** "There was just one problem. America is on the other side of the biggest ocean on Earth. No Japanese bomber could fly that far..."
 *  The same map, closer: the dashed Tokyo -> Seattle line, its length, and the piece's own "too far" on "far". */
const TooFar: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const r = (p: string) => t.at(p) - a;
  const end = r('home') + 40;
  return (
    <AbsoluteFill>
      <PacificWinds at={-30} tooFarAt={r('far') - 34} cam={[
        {f: 0, target: [0.5, 0, 0.3], dist: 19.5, yaw: 0, pitch: 0.95},
        {f: end, target: [0.55, 0, 0.25], dist: 18.6, yaw: -0.03, pitch: 0.9},
      ]} />
      <Highlight text="ONE PROBLEM" x={170} y={110} size={96} at={r('problem')} seed={37} rot={-2} />
      <Note text="the biggest ocean on Earth" x={700} y={800} size={58} rot={-3} at={r('biggest')} />
      <Note text="no way home" x={1180} y={590} size={60} rot={-3} at={r('home')} />
    </AbsoluteFill>
  );
};

/** "So in a secret army lab outside Tokyo, somebody had a very strange idea. What if you didn't need a plane? What if the wind could do it?" */
const Lab: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{background: 'radial-gradient(circle 560px at 960px 520px, rgba(255,214,160,0.08) 0%, transparent 100%)'}} />
      <Prop name="barometer" x={700} y={250} w={520} at={3} />
      <Note text="a secret army lab, outside Tokyo" x={170} y={150} size={56} rot={-3} at={r('secret')} />
      <Note text="a very strange idea" x={1220} y={330} size={54} rot={-4} at={r('strange')} />
      <Note text="no plane?" x={250} y={600} size={64} rot={-4} at={r('plane')} />
      <Arrow x1={240} y1={790} x2={1660} y2={760} bow={-50} at={r('the wind could')} dur={10} />
      <Highlight text="WHAT IF THE WIND…?" x={470} y={850} size={96} at={r('the wind could')} seed={39} rot={-2} />
    </AbsoluteFill>
  );
};

/** "Way up high, about 30,000 feet, there's a fast river of air that blows west to east, from Japan toward America."
 *  The winds switch on (real reanalysis data, January 1945); the piece's JET STREAM tab lands on "30,000 feet". */
const River: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <PacificWinds at={-30} windsAt={r('high')} />
      <Highlight text="A RIVER OF AIR" x={170} y={116} size={92} at={r('river')} seed={41} rot={-2} />
      <Note text="west → east" x={820} y={800} size={66} rot={-3} at={r('west')} />
    </AbsoluteFill>
  );
};

/** "A Japanese weatherman had mapped it twenty years earlier. Today we call it the {jet stream}." */
const Weatherman: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW07_weatherman" a={0} b={b - a} fade={1} cam={{z: [1.05, 1.13], x: [20, -10], y: [0, -10]}} fog={0.25} />
    <Note text="mapped it in the 1920s" x={1050} y={180} size={58} rot={-4} at={t.at('mapped') - a} />
    <Definition term="jet stream" def="a fast river of wind high up, blowing west to east" at={t.at('jet') - a} x={600} y={840} w={1220} />
    <NoPhoto text="A Japanese weatherman · 1920s" at={8} />
  </AbsoluteFill>
);

/** "So the army made a plan. Hang bombs from a balloon. Let the wind carry it for three days. Then let it fall on America." */
const Plan: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Print src="img/ch04_paper_balloon/fugo_moffett_classic_a37180c.jpg" x={300} y={130} w={560} h={732} at={1} rot={-1}
        tag="A captured balloon, re-inflated, 1945 · US Army" />
      <Loop cx={583} cy={711} rx={52} ry={64} at={r('bombs')} seed={9} />
      <Highlight text="THE PLAN" x={1000} y={140} size={96} at={r('plan')} seed={43} rot={-2} />
      <Note text="1. hang bombs from a balloon" x={1000} y={370} size={48} rot={-2} at={r('Hang')} />
      <Note text="2. the wind carries it 3 days" x={1000} y={520} size={48} rot={-2} at={r('Let the wind')} />
      <Note text="3. it falls on America" x={1000} y={670} size={48} rot={-2} at={r('Then let')} />
    </AbsoluteFill>
  );
};

/** "They just needed somebody to build thousands of them. And by then, most of Japan's grown men were at war." */
const Build: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 220], [1, 1.05], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <Print src="img/ch04_paper_balloon/japanese_crew_filling_balloon_wind.jpg" x={180} y={170} w={1080} h={711} at={1} rot={-1}
          tag="A launch crew holds a balloon against the wind · Mikesh, Smithsonian, 1973" />
      </AbsoluteFill>
      <Highlight text="THOUSANDS" x={1120} y={130} size={100} at={t.at('thousands') - a} seed={45} rot={-3} />
      <Note text="the men were at war" x={1230} y={560} size={48} rot={-4} at={t.at('grown') - a} />
      <Note text="who would build them?" x={1050} y={830} size={62} rot={-3} at={t.at('war') - a} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    raid: at('and bombed') - 1, hit: at('So Japan') - 1, far: at('There was') - 1, lab: at('So in a') - 1, river: at('Way up') - 1,
    weather: at('A Japanese weatherman') - 1, plan: at('So the army') - 1, build: at('They just') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Sequence from={0} layout="none"><Carrier t={t} a={0} /></Sequence>],
    [c.raid, <Sequence from={c.raid} layout="none"><Raid t={t} a={c.raid} b={c.hit} /></Sequence>],
    [c.hit, <Sequence from={c.hit} layout="none"><HitBack t={t} a={c.hit} /></Sequence>],
    [c.far, <Sequence from={c.far} layout="none"><TooFar t={t} a={c.far} /></Sequence>],
    [c.lab, <Sequence from={c.lab} layout="none"><Lab t={t} a={c.lab} /></Sequence>],
    [c.river, <Sequence from={c.river} layout="none"><River t={t} a={c.river} /></Sequence>],
    [c.weather, <Sequence from={c.weather} layout="none"><Weatherman t={t} a={c.weather} b={c.plan} /></Sequence>],
    [c.plan, <Sequence from={c.plan} layout="none"><Plan t={t} a={c.plan} /></Sequence>],
    [c.build, <Sequence from={c.build} layout="none"><Build t={t} a={c.build} /></Sequence>],
  ];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {['spring', 'furious', 'hit', 'problem', 'the wind could', 'river', 'plan', 'thousands'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.22} />)}
      {['Tokyo', 'damage', 'flown', 'ship', 'America itself', 'biggest', 'far', 'home', 'secret', 'strange', 'plane', 'west', 'mapped',
        'Hang', 'Let the wind', 'Then let', 'grown', 'war'].map((p) => <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={2} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={at('took')} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={c.raid + 4} src="sfx/plane_flyby.wav" volume={0.2} />
      <Sfx at={c.lab + 3} src="sfx/paper_slap_soft.wav" volume={0.3} />
      <Sfx at={at('the wind could') - 6} src="sfx/wind_high.wav" volume={0.12} />
      <Sfx at={at('river')} src="sfx/wind_high.wav" volume={0.14} />
      <Sfx at={c.plan + 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={c.build + 1} src="sfx/paper_rustle.wav" volume={0.2} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/v2_ch02_revenge_on_the_wind.wav" lead={LEAD} music={[{src: 'music/bw_revenge_on_the_wind.mp3', volume: bed('bw_revenge_on_the_wind')}]}>
    <Body />
  </ChapterShell>
);
