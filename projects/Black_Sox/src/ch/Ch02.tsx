// Chapter 2 · Everybody Bet: 1860s betting, pool selling, the first fixed game (Hoboken, 1865), the first bans.
import React from 'react';
import words from '../../public/audio/ch02_everybody_bet.words.json';
import {Highlight, Note, Tag, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Arch, Desk, DropCard, FlowCard, Ledger, LOOK, ROWS, Sounds} from '../kit/bs';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);
const CI = 'img/ch02/currier_ives_american_national_game_1866.jpg';

/** America's hot new game: the Currier & Ives print of a match at Hoboken. */
const Sixties: React.FC<{t: TL}> = ({t}) => (
  <Arch src={CI} tag="Currier & Ives · The American National Game of Base Ball, 1866 · Library of Congress" a={0} b={t.at('Gamblers')} z={[1.03, 1.14]} pos="50% 62%">
    <Highlight text="THE 1860s" x={100} y={100} size={100} at={t.at('1860s')} seed={31} rot={-2} />
    <Note text="America's hot new game" x={110} y={290} size={56} rot={-3} at={t.at('hot new') - 3} color="#ffffff" />
    <Note text="bet on like horse races" x={1080} y={880} size={56} rot={-3} at={t.at('horse races') - 3} />
  </Arch>
);

/** Pool selling: the Flow card, the term, and the 1882 description of New York's pool rooms. */
const Pools: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Gamblers')}>
    <FlowCard file="card_pool_seller.png" x={150} y={110} w={500} rot={-3} at={t.at('Gamblers') - 1} tab="POOL SELLING" />
    <Highlight text="POOL SELLING" x={760} y={130} size={96} at={t.at('pool selling')} seed={33} rot={-2} />
    <Definition term="pool selling" def="auctioning shares of a betting pool on a game" at={t.at('auction')} x={770} y={300} w={1000} />
    <DropCard src="img/ch02/broadway_gambling_hall_engraving_1882.jpg" x={1180} y={470} w={460} rot={3} at={t.at('often') - 1} />
    <Note text="right at the ballpark" x={760} y={560} size={52} rot={-3} at={t.at('right there') - 3} />
    <Tag text="Illustration · pool selling, 1860s   /   McCabe, New York by Sunlight and Gaslight, 1882" />
  </Desk>
);

/** If people bet, someone will rig one: the 1865 crowd at Philadelphia. */
const Rig: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Arch src="img/ch02/athletics_atlantics_beale_1865.jpg" tag="J. B. Beale · Athletics vs. Atlantics, Philadelphia, 1865 · Library of Congress" a={t.at('And if people')} b={t.at('September')} z={[1.1, 1.2]} pos="30% 60%" look="dim">
      <Note text="if people bet on games..." x={160} y={240} size={78} rot={-3} at={t.at('And if people') + 2} color="#ffffff" />
      <Note text="someone will try to rig one." x={220} y={420} size={78} rot={-3} at={t.at('someone') - 3} color={pal.subject} />
    </Arch>
  );
};

/** September 28, 1865: Hoboken, the Mutuals, the Eckfords. */
const Hoboken: React.FC<{t: TL}> = ({t}) => (
  <Arch src={CI} tag="Currier & Ives, Elysian Fields, Hoboken, 1866 · Mutuals of New York, c. 1870 · LOC / NYPL" a={t.at('September')} b={t.at("The Mutuals'")} z={[1.15, 1.3]} pos="45% 70%">
    <Highlight text="SEPT. 28, 1865" x={100} y={100} size={96} at={t.at('September')} seed={35} rot={-2} />
    <Note text="Hoboken, New Jersey" x={110} y={280} size={56} rot={-3} at={t.at('Hoboken') - 3} color="#ffffff" />
    <DropCard src="img/ch02/new_york_mutuals_team_c1870.jpg" x={1080} y={360} w={640} rot={3} at={t.at('The New York Mutuals') - 1} />
    <Note text="the N.Y. Mutuals" x={1140} y={250} size={56} rot={-3} at={t.at('Mutuals,') - 3} />
    <Note text="vs. the Brooklyn Eckfords" x={1000} y={900} size={56} rot={-3} at={t.at('Brooklyn') - 3} color="#ffffff" />
  </Arch>
);

/** The catcher: no photo survives, so the Flow card; six passed balls; 23 to 11. */
const Catcher: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at("The Mutuals'")}>
      <FlowCard file="card_catcher_1865.png" x={170} y={110} w={500} rot={-2} at={t.at("The Mutuals'") - 1} tab="THE CATCHER" />
      <Highlight text="WILLIAM WANSLEY" x={780} y={140} size={90} at={t.at('William')} seed={37} rot={-2} />
      <Note text="(no photo of him survives)" x={800} y={300} size={44} rot={-3} at={t.at('has a terrible') - 3} color="#ffffff" />
      <Stamp text="6 PASSED BALLS" x={790} y={420} at={t.at('Six')} size={92} color={pal.subject} />
      <Note text="11 runs in one inning" x={800} y={600} size={56} rot={-3} at={t.at('score') - 3} />
      <Stamp text="23–11" x={800} y={720} at={t.at('23')} size={150} />
    </Desk>
  );
};

/** Bad day? Not exactly: the cash card, $100, two teammates. */
const Paid: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Bad day')}>
      <FlowCard file="card_cash_hands.png" x={1180} y={110} w={520} rot={3} at={t.at('A gambler') - 1} tab="THE PAYOFF" />
      <Note text="bad day?" x={170} y={170} size={84} rot={-3} at={t.at('Bad day') - 2} color="#ffffff" />
      <Note text="not exactly." x={230} y={300} size={84} rot={-3} at={t.at('Not exactly') - 2} color={pal.subject} />
      <Stamp text="$100" x={170} y={470} at={t.at('100')} size={160} />
      <Note text="reportedly" x={560} y={540} size={48} rot={-4} at={t.at('reportedly') - 2} color="#FF9F1C" />
      <Note text="+ 2 teammates, a cut each" x={180} y={760} size={58} rot={-3} at={t.at('two teammates') - 3} />
    </Desk>
  );
};

/** The term: throwing a game. */
const Throwing: React.FC<{t: TL}> = ({t}) => (
  <Arch src={CI} tag="Currier & Ives · The American National Game of Base Ball, 1866 · Library of Congress" a={t.at("That's called")} b={t.at('All three')} z={[1.3, 1.36]} pos="50% 75%" look="dim">
    <Highlight text="THROWING A GAME" x={130} y={240} size={110} at={t.at('throwing a game')} seed={39} rot={-2} />
    <Definition term="throwing a game" def="losing on purpose, for money" at={t.at('losing') - 2} x={140} y={440} w={1100} />
    <Note text="the first one we can document" x={160} y={640} size={60} rot={-3} at={t.at('first fixed') - 3} />
  </Arch>
);

/** The ledger opens: three banned, three back. */
const Banned: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('All three')}>
      <Ledger x={300} y={120} w={1320} at={t.at('All three') - 1} entries={[ROWS.y1865(t.at('All three'), t.at('all three were back'), t.at('back.') - 2)]} />
      <Note text="remember this." x={980} y={700} size={72} rot={-4} at={t.at('Remember') - 2} color={pal.subject} />
      <Note text="it keeps happening →" x={1040} y={820} size={56} rot={-4} at={t.at('keep happening') - 3} color="#ffffff" />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Sixties t={t} />],
    [at('Gamblers') - 1, <Pools t={t} />],
    [at('And if people') - 1, <Rig t={t} />],
    [at('September') - 1, <Hoboken t={t} />],
    [at("The Mutuals'") - 1, <Catcher t={t} />],
    [at('Bad day') - 1, <Paid t={t} />],
    [at("That's called") - 1, <Throwing t={t} />],
    [at('All three') - 1, <Banned t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('1860s'), at('pool selling'), at('September'), at('William'), at('throwing a game')]}
        booms={[at('Six'), at('23'), at('100')]}
        writes={['hot new', 'horse races', 'right there', 'And if people', 'someone', 'Hoboken', 'Mutuals,', 'Brooklyn', 'has a terrible', 'score', 'Bad day', 'Not exactly', 'reportedly', 'two teammates', 'first fixed', 'All three', 'Remember', 'keep happening'].map((p) => at(p))}
        ticks={[at('often'), at('The New York Mutuals'), at('A gambler')]}
        extra={[{at: at('1860s'), src: 'sfx/crowd_cheer.wav', volume: 0.12}]} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_everybody_bet.wav" lead={LEAD} music={[{src: 'music/r_temperance.mp3', volume: 0.13}]}>
    <Body />
  </ChapterShell>
);
