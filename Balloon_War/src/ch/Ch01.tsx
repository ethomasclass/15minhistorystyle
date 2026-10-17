// Chapter 1 · Look up: the 2023 balloon (in color: now), a wipe to 1944 (black and white: then), three balloons with
// three jobs, the long loop ("almost nobody was told"), the question, and the balloon on a leash. Then a one-second
// beat (the hook lands), the channel intro and the title card.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_look_up.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {makeTimeline, type Narration, PhotoCard, Stamp, type TL, useScene} from '../kit/shell';
import {Sketch, type P} from '../draw';
import {CORAL, P3, Ph, Redact, Wipe} from '../bw';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
const TITLE_FRAMES = 150;
/** The beat after the cold open: the last image holds for a second, only the music's tail (the user's rule). */
const BEAT = 30;
const END = Math.ceil(N.duration * 30) + BEAT;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

/** A small drawn school bus (local 0..300 x 0..120). */
const BUS: P[] = [[0, 100], [0, 30], [20, 10], [280, 10], [300, 30], [300, 100], [0, 100]];
const Buses: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => (
  <>
    {[0, 1, 2].map((i) => (
      <React.Fragment key={i}>
        <Sketch pts={BUS} x={x + i * 210} y={y} s={0.62} at={at + i * 4} dur={8} width={6} color="#FF9F1C" smooth={false} />
        <Sketch pts={[[40, 100], [60, 120], [80, 100]]} x={x + i * 210} y={y} s={0.62} at={at + i * 4 + 4} dur={4} width={5} color="#FF9F1C" />
        <Sketch pts={[[220, 100], [240, 120], [260, 100]]} x={x + i * 210} y={y} s={0.62} at={at + i * 4 + 4} dur={4} width={5} color="#FF9F1C" />
      </React.Fragment>
    ))}
  </>
);

/** "people all over America looked up and saw something strange" */
const LookUp: React.FC<{t: TL}> = ({t}) => (
  <Ph p="ch01_look_up/balloon_over_charlotte_2023.jpg" fx={1906} fy={1302} a={0} b={t.at('A giant')} z0={1.02} z1={1.22} color band="top"
    tag="The balloon over Charlotte, North Carolina, February 2023 · US Department of Defense">
    {(S) => {
      const [bx, by] = S(1906, 1302);
      return (
        <>
          <Highlight text="FEBRUARY 2023" x={110} y={90} size={96} at={t.at('February')} seed={11} rot={-2} />
          <Loop cx={bx} cy={by} rx={70} ry={60} at={t.at('strange')} seed={12} color={CORAL} width={7} />
          <Note text="looking up" x={bx + 90} y={by + 40} size={52} rot={-4} at={t.at('looked up')} color="#ffffff" />
        </>
      );
    }}
  </Ph>
);

/** The U-2 pilot's view, in 3D: the balloon below, the earth's curve behind it. */
const Cockpit: React.FC<{t: TL}> = ({t}) => (
  <P3 name="ch01_u2" a={t.at('A giant') - 1} b={t.at('For about')} dolly={200} yaw={[-2, 2]} color band="bottom"
    tag="A U-2 pilot's photo of the balloon, February 3, 2023 · US Department of Defense">
    <Note text="the size of" x={120} y={760} size={54} rot={-3} at={t.at('about the size')} color="#ffffff" />
    <Buses x={420} y={780} at={t.at('three school')} />
    <Note text="drifting across the country" x={120} y={930} size={50} rot={-3} at={t.at('drifting')} />
  </P3>
);

/** "Then a fighter jet shot it down off the coast of South Carolina." */
const Jet: React.FC<{t: TL}> = ({t}) => (
  <Ph p="ch01_look_up/f22_takeoff_2023.jpg" fx={1920} fy={1280} a={t.at('For about') - 1} b={t.at('off the coast')} z0={1.04} z1={1.12} color
    tag="An F-22 takes off for the mission, February 4, 2023 · US Air Force">
    {() => <Note text="a week of headlines" x={110} y={880} size={54} rot={-3} at={t.at('all anyone')} color="#ffffff" />}
  </Ph>
);

/** The recovery, then the wipe back eighty years. */
const Recovery: React.FC<{t: TL}> = ({t}) => (
  <Wipe a={t.at('Eighty')} dur={22}
    from={
      <Ph p="ch01_look_up/navy_recovers_balloon_envelope_2023.jpg" fx={1900} fy={1300} a={t.at('off the coast') - 1} b={t.at('Eighty') + 22} z0={1.04} z1={1.1} color
        tag="Navy sailors recover the balloon off South Carolina, February 5, 2023 · US Navy">
        {() => <Note text="off South Carolina" x={110} y={880} size={56} rot={-3} at={t.at('South Carolina')} color="#ffffff" />}
      </Ph>
    }
    to={
      <P3 name="ch02_channel" a={t.at('Eighty')} b={t.at('And in World')} dolly={180} band="top"
        tag="Landing craft cross the English Channel under barrage balloons, June 1944 · US Coast Guard">
        <Stamp text="1944" x={1500} y={80} at={t.at('Eighty') + 12} size={150} rot={-5} />
        <Note text="eighty years earlier" x={110} y={110} size={60} rot={-3} at={t.at('Eighty') + 8} color="#ffffff" />
        <Note text="the sky was FULL of them" x={140} y={210} size={56} rot={-3} at={t.at('FULL')} />
      </P3>
    } />
);

/** Three balloons, three jobs: three cards land on the desk. The third one's label gets censored. */
const ThreeJobs: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('three very') && <Highlight text="THREE BALLOONS, THREE JOBS" x={120} y={80} size={84} at={t.at('three very')} seed={14} rot={-2} />}
      <PhotoCard src="img/ch02_protector/320th_walk_balloon_to_winch_1944.jpg" x={90} y={280} w={520} h={520} rot={-4} at={t.at('One protected')} pos="50% 25%" />
      <Note text="one protected" x={130} y={880} size={60} rot={-3} at={t.at('protected')} color="#ffffff" />
      <PhotoCard src="img/ch03_fake/rubber_tank_beside_real_tank_anzio_1944.jpg" x={700} y={300} w={520} h={500} rot={2} at={t.at('One lied')} pos="60% 50%" />
      <Note text="one lied" x={780} y={880} size={60} rot={-3} at={t.at('lied')} color="#ffffff" />
      <PhotoCard src="img/ch04_paper_balloon/moffett_balloon_inflated_hangar_1945.jpg" x={1310} y={270} w={500} h={540} rot={-2} at={t.at('And one crossed')} pos="50% 20%" />
      <Note text="one killed" x={1360} y={880} size={60} rot={-3} at={t.at('killed')} color={pal.subject} />
      <Redact x={1330} y={872} w={330} h={86} at={t.at('almost nobody')} rot={-3} />
      <Note text="(almost nobody was told)" x={1160} y={970} size={44} rot={-3} at={t.at('nobody was')} />
    </AbsoluteFill>
  );
};

/** The question. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="the question:" x={220} y={250} size={64} rot={-3} at={t.at('question')} color="#ffffff" />
      {g >= t.at('How do') && <Highlight text="HOW DO YOU FIGHT" x={240} y={390} size={150} at={t.at('How do')} seed={15} rot={-2} />}
      {g >= t.at('war with') && <Highlight text="A WAR WITH AIR?" x={300} y={600} size={150} at={t.at('war with')} seed={16} rot={-3} />}
    </AbsoluteFill>
  );
};

/** "It starts on a beach in France, with a balloon on a leash." The 320th photo in 3D; it holds through the beat. */
const Leash: React.FC<{t: TL}> = ({t}) => (
  <P3 name="ch02_320th" a={t.at('It starts') - 1} b={END} dolly={160} yaw={[-1.5, 1.5]} band="bottom"
    tag="Men of the 320th Barrage Balloon Battalion, Normandy, 1944 · US Army Signal Corps (NARA 111-SC-191713)">
    <Note text="a beach in France" x={120} y={880} size={58} rot={-3} at={t.at('beach')} color="#ffffff" />
    <Note text="on a leash" x={1300} y={300} size={64} rot={-4} at={t.at('leash')} color={CORAL} />
    <Arrow x1={1360} y1={380} x2={1170} y2={560} bow={40} width={7} at={t.at('leash') + 4} />
  </P3>
);

/** Title card after the channel intro. */
const Title: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#0b0b0b'}}>
      <P3 name="ch04_moffett" a={0} b={TITLE_FRAMES} dolly={120} yaw={[-1, 1]} band={null} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.35) 30%, rgba(8,6,4,0.88) 100%)'}} />
      <Highlight text={TITLE} x={170} y={380} size={150} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 220, top: 630, fontFamily: JF.display, fontSize: 64, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1360} y={790} size={54} rot={-5} at={26} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <LookUp t={t} />],
    [at('A giant') - 1, <Cockpit t={t} />],
    [at('For about') - 1, <Jet t={t} />],
    [at('off the coast') - 1, <Recovery t={t} />],
    [at('And in World') - 1, <ThreeJobs t={t} />],
    [at("So here's") - 1, <Question t={t} />],
    [at('It starts') - 1, <Leash t={t} />],
  ];
  let scene = useScene(cuts.map(([f, n], i): [number, React.ReactNode] => [f, <React.Fragment key={i}>{n}</React.Fragment>]));
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_look_up.wav')} />
      {/* b_newsreel: its quiet build under the cold open, out through the beat */}
      <Audio src={staticFile('music/b_newsreel.mp3')} volume={(f) => interpolate(f, [0, 12, END - 40, END - 4], [0, 0.2, 0.2, 0], clamp)} />
      <Sfx at={0} src="sfx/wind_high.wav" volume={0.12} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['February', 'three very', 'How do', 'war with'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      <Sfx at={at('Eighty') + 12} src="sfx/stamp.wav" volume={0.32} />
      {['looked up', 'about the size', 'drifting', 'all anyone', 'South Carolina', 'Eighty', 'FULL', 'protected', 'lied', 'killed', 'nobody was', 'question', 'beach', 'leash'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {['One protected', 'One lied', 'And one crossed'].map((c) => <Sfx key={c} at={at(c)} src="sfx/page_turn.wav" volume={0.4} />)}
      <Sfx at={at('almost nobody')} src="sfx/boom.wav" volume={0.42} />
      <Sfx at={at('shot it')} src="sfx/plane_flyby.wav" volume={0.18} />
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
