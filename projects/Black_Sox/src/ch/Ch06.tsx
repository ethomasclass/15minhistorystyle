// Chapter 6 · The Fix: the 1919 White Sox, the Comiskey legend vs. the payroll records, Gandil and the gamblers, the
// signal pitch, the Series, Jackson's .375.
import React from 'react';
import {interpolate} from 'remotion';
import words from '../../public/audio/ch06_the_fix.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Arch, Desk, DropCard, FlowCard, Sounds} from '../kit/bs';
import {Parallax} from '../kit/parallax';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);
const P = (s: string) => `img/ch06/pathe_ws1919_${s}.jpg`;
const PATHE = 'Pathé News, 1919 World Series newsreel · Wikimedia Commons';

/** The 1919 White Sox. */
const Team: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch06/white_sox_team_bain_1919.jpg" tag="Chicago White Sox, 1919 · Library of Congress · Bain News Service" a={0} b={t.at('Shoeless')} z={[1.08, 1.16]} pos="50% 62%">
    <Highlight text="THE 1919 WHITE SOX" x={100} y={100} size={96} at={t.at('Chicago')} seed={91} rot={-2} />
    <Note text="maybe the best team in baseball" x={110} y={890} size={56} rot={-3} at={t.at('best team') - 3} color="#ffffff" />
  </Arch>
);

/** Shoeless Joe Jackson. */
const Jackson: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="jackson" src="img/ch06/joe_jackson_cleveland_1911.jpg" size={[3000, 2198]} crop={[120, 170, 2900, 2100]} a={t.at('Shoeless')} b={t.at('Eddie')} fx={0.5} fy={0.42}
    cam={{z: [1.05, 1.12]}} mask={MASKS.jackson} traceAt={t.at('Shoeless') + 4} tag="Joe Jackson (then with Cleveland), 1911 · Library of Congress · Bain News Service">
    {() => (
      <>
        <Highlight text="SHOELESS JOE JACKSON" x={90} y={90} size={84} at={t.at('Shoeless')} seed={93} rot={-2} />
        <Note text="one of the best hitters alive" x={1100} y={900} size={52} rot={-3} at={t.at('best hitters') - 3} color="#ffffff" />
      </>
    )}
  </Parallax>
);

/** Eddie Cicotte: 29 wins; heavy favorites. */
const Cicotte: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="cicotte" src="img/ch06/eddie_cicotte_1917.jpg" size={[2989, 2257]} crop={[330, 170, 2780, 2120]} a={t.at('Eddie')} b={t.at("You've")} fx={0.55} fy={0.42}
    cam={{x: [-0.03, 0.03]}} mask={MASKS.cicotte} traceAt={t.at('Eddie') + 4} tag="Eddie Cicotte, 1917 · Library of Congress · Bain News Service">
    {() => (
      <>
        <Highlight text="EDDIE CICOTTE" x={90} y={90} size={96} at={t.at('Eddie')} seed={95} rot={-2} />
        <Stamp text="29 WINS" x={100} y={300} at={t.at('29')} size={120} />
        <Note text="heavy favorites vs. the Cincinnati Reds" x={100} y={900} size={52} rot={-3} at={t.at('heavy favorites') - 3} color="#ffffff" />
      </>
    )}
  </Parallax>
);

/** Comiskey: the legend, crossed out by the records; but the players felt cheated. */
const Comiskey: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const s1 = interpolate(g, [t.at('Some of that'), t.at('Some of that') + 5], [0, 1], clamp);
  const s2 = interpolate(g, [t.at('no evidence'), t.at('no evidence') + 5], [0, 1], clamp);
  return (
    <Parallax name="comiskey" src="img/ch06/charles_comiskey_1914.jpg" size={[2174, 3000]} crop={[150, 300, 2060, 2900]} a={t.at("You've")} b={t.at('First baseman')} fx={0.35} fy={0.3}
      cam={{z: [1.03, 1.1]}} mask={MASKS.comiskey} traceAt={t.at('Charles Comiskey') + 3} tag="Charles Comiskey, White Sox owner, 1914 · Library of Congress · Bain News Service" vignette={0.75}>
      {() => (
        <>
          <Note text="owner Charles Comiskey" x={90} y={90} size={54} rot={-3} at={t.at('Charles Comiskey') - 3} color="#ffffff" />
          <Note text="the legend:" x={980} y={130} size={52} rot={-3} at={t.at('cheap') - 6} color="#ffffff" />
          <Note text="too cheap, underpaid everyone" x={1000} y={230} size={52} rot={-3} at={t.at('cheap') - 3} color="#FF9F1C" />
          <div style={{position: 'absolute', left: 990, top: 265, height: 7, borderRadius: 4, background: '#FF9F1C', width: 690 * s1, transform: 'rotate(-3deg)'}} />
          <Note text="benched his star to dodge a bonus" x={1000} y={340} size={52} rot={-3} at={t.at('benched') - 3} color="#FF9F1C" />
          <div style={{position: 'absolute', left: 990, top: 375, height: 7, borderRadius: 4, background: '#FF9F1C', width: 790 * s2, transform: 'rotate(-3deg)'}} />
          <Note text="the records:" x={980} y={500} size={52} rot={-3} at={t.at('Salary records') - 3} color="#ffffff" />
          <Note text="one of the highest payrolls" x={1000} y={600} size={56} rot={-3} at={t.at('highest payrolls') - 3} />
          <Note text="no evidence for the bonus story" x={1000} y={700} size={56} rot={-3} at={t.at('no evidence') - 3} />
          <Note text="but some players felt cheated" x={980} y={860} size={62} rot={-3} at={t.at('felt cheated') - 3} color={pal.subject} />
        </>
      )}
    </Parallax>
  );
};

/** Chick Gandil goes to the gamblers: $100,000. */
const Gandil: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="gandil" src="img/ch06/chick_gandil_harris_ewing_c1913.jpg" size={[3840, 2621]} crop={[100, 100, 3700, 2560]} a={t.at('First baseman')} b={t.at('Eight players')} fx={0.6} fy={0.4}
    cam={{z: [1.04, 1.14]}} mask={MASKS.gandil} traceAt={t.at('Chick Gandil') + 3} tag="Chick Gandil, c. 1913 · Library of Congress · Harris & Ewing">
    {() => (
      <>
        <Note text="first baseman Chick Gandil" x={90} y={100} size={56} rot={-3} at={t.at('Chick Gandil') - 3} color="#ffffff" />
        <Note text="goes to the gamblers" x={110} y={210} size={56} rot={-3} at={t.at('goes to') - 3} />
        <Note text="the plan: lose the Series" x={110} y={760} size={58} rot={-3} at={t.at('The plan') - 3} color="#ffffff" />
        <Stamp text="$100,000" x={100} y={850} at={t.at('100,000')} size={120} color="#FF6F61" />
      </>
    )}
  </Parallax>
);

const EIGHT: [string, string][] = [
  ['img/ch06/joe_jackson_1919.jpg', 'Jackson'], ['img/ch06/eddie_cicotte_1917.jpg', 'Cicotte'], ['img/ch06/chick_gandil_white_sox_1917.jpg', 'Gandil'],
  ['img/ch06/lefty_williams_1917_b.jpg', 'Williams'], ['img/ch06/swede_risberg_1917.jpg', 'Risberg'], ['img/ch06/happy_felsch_1920.jpg', 'Felsch'],
  ['img/ch06/fred_mcmullin_1917.jpg', 'McMullin'], ['img/ch06/buck_weaver_1920.jpg', 'Weaver'],
];

/** Eight players in on it, or knew; the money reportedly from Rothstein. */
const Eight: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Eight players');
  return (
    <Desk a={a}>
      {EIGHT.map(([src, name], i) => (
        <React.Fragment key={name}>
          <DropCard src={src} x={110 + (i % 4) * 300} y={70 + Math.floor(i / 4) * 420} w={230} rot={((i * 7) % 5) - 2} at={a - 1 + i * 3} />
          <Note text={name} x={130 + (i % 4) * 300} y={410 + Math.floor(i / 4) * 420} size={40} rot={-3} at={a + 4 + i * 3} color="#ffffff" />
        </React.Fragment>
      ))}
      <Note text="8 in on it, or knew" x={140} y={930} size={60} rot={-3} at={t.at('or at least') - 3} />
      <DropCard src="img/ch06/arnold_rothstein_desk_c1915.jpg" x={1360} y={110} w={380} rot={3} at={t.at('The money') - 1} />
      <Note text="reportedly: Arnold Rothstein" x={1280} y={680} size={48} rot={-3} at={t.at('Arnold') - 3} color="#FF9F1C" />
      <Note text="New York's biggest gambler" x={1290} y={770} size={42} rot={-3} at={t.at('biggest') - 3} color="#ffffff" />
      <Tag text="Library of Congress · Bain News Service; Rothstein, c. 1915 · Wikimedia Commons" />
    </Desk>
  );
};

/** October 1, 1919: Game 1 at Redland Field (newsreel). */
const Game1: React.FC<{t: TL}> = ({t}) => (
  <Arch src={P('127s_redland_field_grandstand_game1')} tag={PATHE} a={t.at('October')} b={t.at("Cicotte's")} z={[1.04, 1.12]} pos="50% 50%" look="bw">
    <Highlight text="OCT. 1, 1919 · GAME 1" x={100} y={100} size={90} at={t.at('October')} seed={97} rot={-2} />
    <Note text="Redland Field, Cincinnati" x={110} y={900} size={52} rot={-3} at={t.at('Game 1') - 3} color="#ffffff" />
  </Arch>
);

/** The signal: the second pitch hits Morrie Rath in the back. */
const Signal: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at("Cicotte's")}>
      <FlowCard file="card_signal_pitch.png" x={140} y={100} w={500} rot={-3} at={t.at("Cicotte's") - 1} tab="THE SIGNAL" />
      <DropCard src="img/ch06/morrie_rath_reds_1919.jpg" x={1340} y={110} w={380} rot={3} at={t.at('leadoff') - 1} />
      <Note text="Reds leadoff man Morrie Rath" x={1220} y={720} size={44} rot={-3} at={t.at('leadoff') - 2} color="#ffffff" />
      <Note text="2nd pitch: in the back" x={760} y={170} size={56} rot={-3} at={t.at('second pitch') - 3} />
      <Highlight text="THE SIGNAL" x={740} y={330} size={100} at={t.at('signal')} seed={99} rot={-2} />
      <Note text="the fix is on." x={770} y={520} size={70} rot={-3} at={t.at('The fix') - 3} color={pal.subject} />
      <Note text="not exactly subtle." x={790} y={650} size={56} rot={-3} at={t.at('Not exactly') - 3} color="#ffffff" />
      <Tag text="Illustration · the signal pitch, Oct. 1, 1919   /   Morrie Rath, 1919 · Library of Congress" />
    </Desk>
  );
};

/** The odds swing; sportswriters notice (the next day's paper). */
const Odds: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch06/ny_herald_1919-10-02_p18.jpg" tag="New York Herald, Oct. 2, 1919 · Wikimedia Commons" a={t.at('Right before')} b={t.at('The Reds win')} z={[1.4, 1.55]} pos="50% 8%" look="doc">
    <Note text="the odds swung hard to Cincinnati" x={110} y={760} size={58} rot={-3} at={t.at('odds') - 3} color="#ffffff" />
    <Note text="sportswriters noticed. a few said so." x={110} y={880} size={58} rot={-3} at={t.at('Sportswriters') - 3} />
  </Arch>
);

/** Reds win, five games to three (the newsreel's own intertitle). */
const Result: React.FC<{t: TL}> = ({t}) => (
  <Arch src={P('199s_title_fourth_inning_cicotte')} tag={PATHE} a={t.at('The Reds win')} b={t.at('And Joe')} z={[1.02, 1.06]} pos="50% 50%">
    <Stamp text="REDS, 5 GAMES TO 3" x={130} y={800} at={t.at('5 games')} size={92} color="#FF6F61" />
    <Note text="best of nine" x={1400} y={120} size={52} rot={-3} at={t.at('best-of-nine') - 3} />
  </Arch>
);

/** Jackson: .375, no errors. */
const Avg: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="jackson_bat" src="img/ch06/joe_jackson_white_sox_1920.jpg" size={[2032, 3000]} crop={[60, 150, 1980, 2850]} a={t.at('And Joe')} b={t.at('By their')} fx={0.38} fy={0.42}
    cam={{z: [1.05, 1.18]}} mask={MASKS.jackson_bat} traceAt={t.at('Jackson?', 2) + 3} tag="Joe Jackson, Chicago AL · Library of Congress · Bain News Service">
    {() => (
      <>
        <Stamp text=".375" x={1060} y={130} at={t.at('.375')} size={240} />
        <Note text="no errors" x={1100} y={450} size={70} rot={-3} at={t.at('no errors') - 3} />
        <Note text="argued about for 100 years" x={1060} y={850} size={56} rot={-3} at={t.at('argued') - 3} color="#FF9F1C" />
      </>
    )}
  </Parallax>
);

/** The money under the pillow: only part of what was promised. */
const Money: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('By their')}>
    <FlowCard file="card_hotel_envelope.png" x={1150} y={110} w={520} rot={3} at={t.at('By their') - 1} tab="THE PAYOFF" />
    <Note text="by their own accounts:" x={170} y={300} size={62} rot={-3} at={t.at('By their') + 2} color="#ffffff" />
    <Note text="only part of the money" x={200} y={430} size={78} rot={-3} at={t.at('only part') - 3} color="#FF6F61" />
  </Desk>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Team t={t} />],
    [at('Shoeless') - 1, <Jackson t={t} />],
    [at('Eddie') - 1, <Cicotte t={t} />],
    [at("You've") - 1, <Comiskey t={t} />],
    [at('First baseman') - 1, <Gandil t={t} />],
    [at('Eight players') - 1, <Eight t={t} />],
    [at('October') - 1, <Game1 t={t} />],
    [at("Cicotte's") - 1, <Signal t={t} />],
    [at('Right before') - 1, <Odds t={t} />],
    [at('The Reds win') - 1, <Result t={t} />],
    [at('And Joe') - 1, <Avg t={t} />],
    [at('By their') - 1, <Money t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('Chicago'), at('Shoeless'), at('Eddie'), at('October'), at('signal')]}
        booms={[at('29'), at('100,000'), at('5 games'), at('.375')]}
        writes={['best team', 'best hitters', 'heavy favorites', 'Charles Comiskey', 'cheap', 'benched', 'Salary records', 'highest payrolls', 'no evidence', 'felt cheated', 'Chick Gandil', 'goes to', 'The plan', 'or at least', 'Arnold', 'biggest', 'Game 1', 'second pitch', 'The fix', 'Not exactly', 'odds', 'Sportswriters', 'best-of-nine', 'no errors', 'argued', 'By their', 'only part'].map((p) => at(p))}
        ticks={[at('Eight players'), at('The money'), at('leadoff')]}
        extra={[{at: at('October'), src: 'sfx/crowd_cheer.wav', volume: 0.12}, {at: at('hits the'), src: 'sfx/knock.wav', volume: 0.4}]} />
    </>
  );
};

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_the_fix.wav" lead={LEAD} music={[{src: 'music/g_grip.mp3', volume: 0.18}]}>
    <Body />
  </ChapterShell>
);

