// Chapter 7 · The answer: John Takeshita and Tule Lake, the thousand cranes (3D), the question answered with the three
// cards (the censor bar lifts off "one killed"), the paper balloon folding into a crane, and the end screen.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch07_the_answer.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, PhotoCard, Stamp, type TL, useScene} from '../kit/shell';
import {Bed, Sketch, type P} from '../draw';
import {CORAL, Desk, ORANGE, Redact} from '../bw';
import {CRANE} from './Ch06';

const N = words as Narration;
/** A music-only end screen after the narration (room for YouTube's end-screen elements). */
const EXTRA = 300;
export const CH07_FRAMES = chapterFrames(N, LEAD) + EXTRA;

const Takeshita: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk p="ch07_answer/tule_lake_war_relocation_center_russell_lee_1942.jpg" box={[200, 500, 900, 520]} at={0} rot={-2}
      tag="Tule Lake camp, California, 1942 · Russell Lee, FSA  |  Card: boys at recess · War Relocation Authority">
      {() => (
        <>
          {g >= t.at('John') && <Highlight text="JOHN TAKESHITA" x={110} y={90} size={96} at={t.at('John')} seed={71} rot={-2} />}
          <Note text="as a boy: held with his family" x={120} y={240} size={50} rot={-3} at={t.at('held')} color="#ffffff" />
          <Note text="in a camp for Japanese Americans" x={140} y={325} size={50} rot={-3} at={t.at('camp for')} color="#ffffff" />
          <Note text="about 50 miles from Bly" x={160} y={420} size={50} rot={-3} at={t.at('50 miles')} color={ORANGE} />
          <PhotoCard src="img/ch07_answer/tule_lake_boys_at_recess_wra.jpg" x={1240} y={300} w={560} h={600} rot={3} at={t.at('boy')} pos="50% 70%" />
          <Note text="boys at recess, Tule Lake" x={1260} y={940} size={42} rot={-3} at={t.at('boy') + 6} color="#ffffff" />
        </>
      )}
    </Desk>
  );
};

const Cranes: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Desk p="ch07_answer/origami_cranes_nagasaki_cc0.jpg" box={[300, 220, 880, 560]} at={t.at('In 1987') - 1} rot={-2}
      tag="Strings of a thousand paper cranes (illustrative), Nagasaki · CC0  |  Schoolgirls pasting balloon paper · R. Mikesh, 1973">
      {g >= t.at('1987') && <Highlight text="1987" x={110} y={90} size={100} at={t.at('1987')} seed={72} rot={-2} />}
      <Note text="a thousand paper cranes" x={500} y={110} size={60} rot={-3} at={t.at('thousand paper')} color="#ffffff" />
      <PhotoCard src="img/ch04_paper_balloon/schoolgirls_pasting_envelope_fig12.jpg" x={1300} y={150} w={500} h={400} rot={3} at={t.at('folded')} />
      <Note text="folded by the women who," x={1240} y={600} size={42} rot={-3} at={t.at('teenage')} color="#ffffff" />
      <Note text="as girls, made the balloons" x={1260} y={670} size={42} rot={-3} at={t.at('teenage') + 8} color="#ffffff" />
      <Note text="a wish for peace" x={120} y={820} size={60} rot={-3} at={t.at('wish')} color={ORANGE} />
      <Note text="to show their regret" x={120} y={920} size={60} rot={-3} at={t.at('regret')} color={pal.subject} />
    </Desk>
  );
};

/** The question answered: the three cards from the cold open, one job each; the censor bar lifts. */
const Answer: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const hot = (a: string, b: string) => g >= t.at(a) && g < t.at(b);
  const glow = (on: boolean) => (on ? 1 : 0.55);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="so: how do you fight a war with air?" x={120} y={90} size={58} rot={-2} at={t.at('So let\'s')} color="#ffffff" />
      <div style={{opacity: glow(hot('You tie', 'You pump'))}}><PhotoCard src="img/ch02_protector/320th_walk_balloon_to_winch_1944.jpg" x={90} y={250} w={520} h={520} rot={-4} at={t.at('So let\'s')} pos="50% 25%" /></div>
      <div style={{opacity: glow(hot('You pump', 'Or you'))}}><PhotoCard src="img/ch03_fake/rubber_tank_beside_real_tank_anzio_1944.jpg" x={700} y={270} w={520} h={500} rot={2} at={t.at('So let\'s') + 4} pos="60% 50%" /></div>
      <div style={{opacity: glow(hot('Or you', 'Three balloons'))}}><PhotoCard src="img/ch04_paper_balloon/moffett_balloon_inflated_hangar_1945.jpg" x={1310} y={240} w={500} h={540} rot={-2} at={t.at('So let\'s') + 8} pos="50% 20%" /></div>
      <Note text="tie it to a cable," x={110} y={820} size={44} rot={-3} at={t.at('tie')} color="#ffffff" />
      <Note text="(held by men denied equality)" x={110} y={890} size={36} rot={-3} at={t.at('equals')} color={ORANGE} />
      <Note text="pump it into rubber," x={700} y={820} size={44} rot={-3} at={t.at('pump')} color="#ffffff" />
      <Note text="and lie with it" x={720} y={890} size={38} rot={-3} at={t.at('lie with')} color={ORANGE} />
      <Note text="fill paper with it," x={1320} y={820} size={44} rot={-3} at={t.at('fill paper')} color="#ffffff" />
      <Note text="let the wind decide" x={1340} y={890} size={38} rot={-3} at={t.at('wind decide')} color={ORANGE} />
      {/* "Three balloons. One protected, one lied and one killed." The labels from the cold open, and the bar lifts. */}
      {g >= t.at('Three balloons') && <AbsoluteFill style={{background: 'rgba(11,11,11,0.6)', opacity: interpolate(g, [t.at('Three balloons'), t.at('Three balloons') + 6], [0, 1], clamp)}} />}
      <Stamp text="ONE PROTECTED" x={90} y={420} at={t.at('protected')} size={66} rot={-4} />
      <Stamp text="ONE LIED" x={780} y={420} at={t.at('lied')} size={66} rot={-3} />
      <Stamp text="ONE KILLED" x={1340} y={420} at={t.at('one killed')} size={66} rot={-4} color={pal.subject} />
      <Redact x={1330} y={415} w={460} h={84} at={t.at('Three balloons')} lift={t.at('one killed')} rot={-4} />
    </AbsoluteFill>
  );
};

/** The fold: the round paper balloon flattens into a square, turns, folds into a crane, and flies. */
const Fold: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = t.at('And for one');
  const circle: P[] = [...Array(24)].map((_, i) => [160 + 90 * Math.cos((i / 24) * Math.PI * 2), 90 + 90 * Math.sin((i / 24) * Math.PI * 2)]);
  const square: P[] = [[70, 0], [250, 0], [250, 180], [70, 180]];
  const diamond: P[] = [[160, -10], [260, 90], [160, 190], [60, 90]];
  const kite: P[] = [[160, -20], [205, 95], [160, 200], [115, 95]];
  const steps: [P[], P[], number][] = [
    [circle, square, t.at('arrived')],
    [square, diamond, t.at('paper balloons')],
    [diamond, kite, t.at('ended')],
    [kite, CRANE, t.at('paper birds')],
  ];
  const cur = steps.filter((s) => g >= s[2]).pop() ?? steps[0];
  const fly = interpolate(f, [t.at('birds') + 20, t.at('birds') + 70], [0, 1], {...clamp, easing: (x) => x * x});
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 45% at 50% 50%, rgba(255,214,150,0.12), transparent 70%)'}} />
      <Note text="for one small town…" x={160} y={150} size={58} rot={-2} at={a} color="#ffffff" />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${fly * 700}px, ${-fly * 620}px) rotate(${-fly * 8}deg)`}}>
        <Sketch key={cur[2]} pts={cur[0]} to={cur[1]} ma={cur[2]} mb={cur[2] + 14} x={720} y={380} s={1.7} at={a} dur={10} width={7} closed color="#EDE7DC" fill="#efe6d3" fillOpacity={0.85} n={120} />
      </div>
      <Note text="a war that arrived on paper balloons…" x={160} y={820} size={58} rot={-2} at={t.at('arrived')} color="#ffffff" />
      <Note text="…ended with paper birds." x={300} y={920} size={66} rot={-2} at={t.at('ended')} color={ORANGE} />
    </AbsoluteFill>
  );
};

/** Thanks, and the end screen (YouTube places its own elements over the right half). */
const EndScreen: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Thanks');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sketch pts={CRANE} x={140} y={360} s={1.5} at={a} dur={14} width={6} closed color="#EDE7DC" fill="#efe6d3" fillOpacity={0.85} />
      {g >= a + 4 && <Highlight text="THANKS FOR WATCHING" x={620} y={170} size={64} at={a + 4} seed={73} rot={-2} />}
      <Note text="subscribe ↓" x={640} y={330} size={84} rot={-3} at={t.at('subscribe')} />
      <Note text="more stories like this one" x={660} y={480} size={54} rot={-3} at={t.at('more stories')} color="#ffffff" />
      <Note text="(all real photos)" x={680} y={590} size={46} rot={-3} at={t.at('subscribe') + 10} color={pal.subject} />
      <Tag text="Music: original cues made with Suno for 15 Minute History. Sound effects: Freesound via Openverse (CC0 / CC BY)" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Takeshita t={t} />],
    [at('In 1987') - 1, <Cranes t={t} />],
    [at("So let's") - 1, <Answer t={t} />],
    [at('And for one') - 1, <Fold t={t} />],
    [at('Thanks') - 1, <EndScreen t={t} />],
  ];
  const scene = useScene(cuts.map(([f, n], i): [number, React.ReactNode] => [f, <React.Fragment key={i}>{n}</React.Fragment>]));
  return (
    <>
      {scene}
      {/* b_paper_wind: started so its return after the near-silence (cue 108 s) lands on "And for one small town" */}
      <Bed src="music/b_paper_wind.mp3" from={0} to={t.frames + EXTRA + 30} volume={0.2} startFrom={Math.round(30 * (108 - 46.3))} fadeIn={40} fadeOut={80} />
      {cuts.slice(1, 4).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.24} />)}
      {['John', '1987', 'protected', 'lied', 'one killed'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.26} />)}
      {['held', '50 miles', 'thousand paper', 'teenage', 'wish', 'regret', "So let's", 'tie', 'equals', 'pump', 'fill paper', 'wind decide', 'arrived', 'ended', 'subscribe', 'more stories'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {['arrived', 'paper balloons', 'ended', 'paper birds'].map((c) => <Sfx key={`f${c}`} at={at(c)} src="sfx/paper_rustle.wav" volume={0.22} />)}
      <Sfx at={at('one killed')} src="sfx/paper_rustle.wav" volume={0.3} />
    </>
  );
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_the_answer.wav" lead={LEAD} extra={EXTRA}>
    <Body />
  </ChapterShell>
);
