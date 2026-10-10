// Chapter 4 · The Open Secret: forty years of looking away; betting in the stands; handled quietly; the 1882 umpire;
// the 1908 bribe attempt on Bill Klem.
import React from 'react';
import words from '../../public/audio/ch04_open_secret.words.json';
import {Highlight, Note, Tag, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, hasFile, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Arch, Desk, FlowCard, Ledger, ROWS, Sounds} from '../kit/bs';
import {Parallax} from '../kit/parallax';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

/** Forty years of looking away: a 1909 Chicago ballpark panorama, panning. */
const Forty: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch04/white_sox_cubs_city_series_panorama_1909.jpg" tag="White Sox vs. Cubs, Chicago, 1909 · Library of Congress" a={0} b={t.at('Baseball booms')} z={[1.12, 1.2]} pos="30% 50%" look="dim">
    <Note text="a rule needs people to enforce it" x={150} y={180} size={64} rot={-3} at={t.at('enforcing') - 6} color="#ffffff" />
    <Stamp text="40 YEARS" x={150} y={380} at={t.at('40')} size={150} />
    <Note text="almost nobody wanted to look" x={170} y={620} size={64} rot={-3} at={t.at('almost nobody') - 3} color="#FF6F61" />
  </Arch>
);

/** Baseball booms: Shibe Park, 1913. */
const Booms: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch04/shibe_park_1913.jpg" tag="Shibe Park, Philadelphia, 1913 · Library of Congress" a={t.at('Baseball booms')} b={t.at('The betting comes')} z={[1.03, 1.12]} pos="50% 55%">
    <Highlight text="THE 1900s" x={100} y={100} size={100} at={t.at('1900s')} seed={61} rot={-2} />
    <Note text="two major leagues" x={1150} y={180} size={58} rot={-3} at={t.at('two major') - 3} />
    <Note text="big new ballparks" x={1150} y={300} size={58} rot={-3} at={t.at('big new') - 3} />
    <Note text="a World Series" x={1150} y={420} size={58} rot={-3} at={t.at('World Series') - 3} />
  </Arch>
);

/** Betting in the stands: the Flow wide card if it exists, otherwise the real 1908 Polo Grounds crowd. */
const Stands: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const gen = 'img/gen/wide_grandstand_bettors.png';
  const real = hasFile(gen);
  return (
    <Arch src={real ? gen : 'img/ch04/polo_grounds_crowd_giants_cubs_1908-10-08_b.jpg'} look={real ? 'card' : 'bw'}
      tag={real ? 'Illustration · betting in the grandstand, c. 1910' : 'Polo Grounds grandstand, 1908 · Library of Congress'} a={t.at('The betting comes')} b={t.at("Why didn't")} z={[1.04, 1.14]} pos="50% 45%">
      <Note text="bettors, openly, in the stands" x={110} y={110} size={60} rot={-3} at={t.at('Bettors') - 3} color="#ffffff" />
      <Note text="players bet." x={130} y={770} size={58} rot={-3} at={t.at('Players bet') - 3} />
      <Note text="club officials bet." x={130} y={870} size={58} rot={-3} at={t.at('Club officials') - 3} />
      <Note text="usually on their own team..." x={1000} y={770} size={54} rot={-3} at={t.at('Usually') - 3} color="#ffffff" />
      <Note text="not always." x={1100} y={870} size={64} rot={-4} at={t.at('Not always') - 3} color={pal.subject} />
    </Arch>
  );
};

/** Why didn't anyone stop it? Bad for business. Handled quietly. */
const Quietly: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at("Why didn't")}>
      <Note text="why didn't anyone stop it?" x={150} y={120} size={70} rot={-3} at={t.at("Why didn't") - 2} color="#ffffff" />
      <Note text="enforce it = admit a problem" x={170} y={260} size={62} rot={-3} at={t.at('admitting') - 3} />
      <Highlight text="BAD FOR BUSINESS" x={160} y={400} size={90} at={t.at('bad for business')} seed={63} rot={-2} />
      <Note text="handled quietly:" x={170} y={600} size={60} rot={-3} at={t.at('quietly') - 3} color={pal.subject} />
      <Note text="a trade." x={200} y={700} size={60} rot={-3} at={t.at('A trade') - 2} color="#ffffff" />
      <Note text="a release." x={420} y={700} size={60} rot={-3} at={t.at('A release') - 2} color="#ffffff" />
      <Note text="no headlines." x={200} y={810} size={60} rot={-3} at={t.at('No headlines') - 2} />
      <FlowCard file="card_quiet_release.png" x={1220} y={180} w={460} rot={3} at={t.at('Clubs usually') - 1} tab="QUIETLY" />
    </Desk>
  );
};

/** 1882: an umpire, letters to a gambler, banned for life (the ledger grows). */
const Higham: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Umpires')}>
    <Ledger x={300} y={90} w={1320} at={t.at('Umpires') - 1} entries={[ROWS.y1865(), ROWS.y1877(), ROWS.y1882(t.at('Dick Higham'), t.at('banned for life'))]} />
    <Note text="letters to a gambler: which way to bet" x={330} y={540} size={56} rot={-3} at={t.at('writing letters') - 3} color="#ffffff" />
    <Note text="still the only umpire ever banned" x={330} y={660} size={56} rot={-3} at={t.at('only umpire') - 3} />
  </Desk>
);

/** October 8, 1908: the Polo Grounds crowd for the one-game playoff. */
const Playoff: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch04/polo_grounds_crowd_giants_cubs_1908-10-08.jpg" tag="Polo Grounds crowd, Cubs at Giants, Oct. 8, 1908 · Library of Congress" a={t.at('And in October')} b={t.at('Before it')} z={[1.03, 1.12]} pos="50% 40%">
    <Highlight text="OCT. 8, 1908" x={100} y={100} size={100} at={t.at('October')} seed={65} rot={-2} />
    <Note text="Giants vs. Cubs: one game for the pennant" x={110} y={900} size={54} rot={-3} at={t.at('the Giants') - 3} color="#ffffff" />
  </Arch>
);

/** The offer to Bill Klem: Klem coral and traced, the bribe card, "Klem says no". */
const Klem: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Parallax name="klem" src="img/ch04/bill_klem_umpire_1914_b.jpg" size={[3840, 2770]} crop={[760, 150, 3720, 2680]} a={t.at('Before it')} b={t.at('The man turns')} fx={0.45} fy={0.3}
      cam={{z: [1.03, 1.12]}} mask={MASKS.klem} traceAt={t.at('Bill Klem') + 3} tag="Bill Klem, umpire · Library of Congress · Bain News Service, 1914">
      {() => (
        <>
          <Note text="umpire Bill Klem" x={110} y={110} size={60} rot={-3} at={t.at('Bill Klem') - 3} color="#ffffff" />
          <FlowCard file="card_bribe_1908.png" x={1330} y={130} w={430} rot={3} at={t.at('a man offers') - 1} tab="THE OFFER" />
          <Note text="thousands of dollars" x={110} y={760} size={64} rot={-3} at={t.at('thousands') - 3} color={pal.subject} />
          <Note text="Klem says no. reports it." x={110} y={880} size={64} rot={-3} at={t.at('Klem says') - 3} />
        </>
      )}
    </Parallax>
  );
};

/** The Giants' own team doctor: banned from every park. Who sent him? Nobody asks. */
const Doctor: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('The man turns')}>
      <Ledger x={300} y={60} w={1320} at={t.at('The man turns') - 1}
        entries={[ROWS.y1865(), ROWS.y1877(), ROWS.y1882(), ROWS.y1908(t.at('team doctor') - 2, t.at('banned from every'))]} />
      <Note text="who sent him?" x={330} y={620} size={72} rot={-3} at={t.at('Who sent') - 3} color="#ffffff" />
      <Note text="nobody really asks." x={420} y={740} size={72} rot={-3} at={t.at('Nobody really') - 3} color={pal.subject} />
      <Note text="(the obvious next question)" x={460} y={870} size={52} rot={-3} at={t.at('obvious') - 3} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Forty t={t} />],
    [at('Baseball booms') - 1, <Booms t={t} />],
    [at('The betting comes') - 1, <Stands t={t} />],
    [at("Why didn't") - 1, <Quietly t={t} />],
    [at('Umpires') - 1, <Higham t={t} />],
    [at('And in October') - 1, <Playoff t={t} />],
    [at('Before it') - 1, <Klem t={t} />],
    [at('The man turns') - 1, <Doctor t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('1900s'), at('bad for business'), at('October')]}
        booms={[at('40'), at('banned for life'), at('banned from every')]}
        writes={['enforcing', 'almost nobody', 'two major', 'big new', 'World Series', 'Bettors', 'Players bet', 'Club officials', 'Usually', 'Not always', "Why didn't", 'admitting', 'quietly', 'A trade', 'A release', 'No headlines', 'Dick Higham', 'writing letters', 'only umpire', 'the Giants', 'Bill Klem', 'thousands', 'Klem says', 'team doctor', 'Who sent', 'Nobody really', 'obvious'].map((p) => at(p))}
        ticks={[at('Clubs usually'), at('a man offers')]}
        extra={[{at: at('The betting comes'), src: 'sfx/rowdy_crowd.wav', volume: 0.1}, {at: at('And in October'), src: 'sfx/crowd_cheer.wav', volume: 0.12}]} />
    </>
  );
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_open_secret.wav" lead={LEAD} music={[{src: 'music/a_newsroom.mp3', volume: 0.17}]}>
    <Body />
  </ChapterShell>
);
