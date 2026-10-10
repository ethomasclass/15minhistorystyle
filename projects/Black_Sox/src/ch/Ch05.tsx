// Chapter 5 · Prince Hal: Hal Chase accused in 1910 and 1918, cleared in 1919, signed by the Giants; what every player
// learned.
import React from 'react';
import words from '../../public/audio/ch05_prince_hal.words.json';
import {Arrow, Highlight, Note, Tag, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Arch, Desk, DropCard, Ledger, ROWS, Sounds} from '../kit/bs';
import {Parallax} from '../kit/parallax';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

/** Hal Chase: Prince Hal, best-fielding first baseman, and the accusation. */
const Chase: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="chase" src="img/ch05/hal_chase_1917.jpg" size={[1920, 2233]} a={0} b={t.at('1910.')} fx={0.5} fy={0.3}
    cam={{z: [1.03, 1.13]}} mask={MASKS.chase} traceAt={t.at('Hal Chase') + 3} tag="Hal Chase, Cincinnati, 1917 · Charles Conlon · Wikimedia Commons">
    {() => (
      <>
        <Highlight text="HAL CHASE" x={90} y={100} size={110} at={t.at('Hal Chase')} seed={71} rot={-2} />
        <Note text="best-fielding 1st baseman" x={100} y={300} size={52} rot={-3} at={t.at('best-fielding') - 3} color="#ffffff" />
        <Note text={'"Prince Hal"'} x={1380} y={180} size={70} rot={-4} at={t.at('Prince Hal') - 3} />
        <Note text="losing games on purpose?" x={100} y={790} size={58} rot={-3} at={t.at('losing games') - 3} color="#FF9F1C" />
        <Note text="say several of his own managers" x={110} y={890} size={46} rot={-3} at={t.at('according') - 3} color="#ffffff" />
      </>
    )}
  </Parallax>
);

/** 1910: the manager accuses, the owner sides with Chase, the manager leaves, Chase gets his job. */
const Nineteen10: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('1910.')}>
      <Highlight text="1910 · NEW YORK" x={130} y={100} size={90} at={t.at('1910.')} seed={73} rot={-2} />
      <Note text="manager: he's throwing games" x={150} y={300} size={56} rot={-3} at={t.at('accuses') - 3} color="#ffffff" />
      <Note text="owner: sides with Chase" x={150} y={410} size={56} rot={-3} at={t.at('owner') - 3} color="#ffffff" />
      <Note text="manager: leaves" x={150} y={520} size={56} rot={-3} at={t.at('leaves') - 3} color="#ffffff" />
      <Note text="new manager: Hal Chase" x={150} y={660} size={70} rot={-3} at={t.at('Chase gets') - 3} color={pal.subject} />
      <DropCard src="img/ch05/hal_chase_manager_highlanders_with_wallace_1911.jpg" x={1060} y={250} w={700} rot={3} at={t.at('Chase gets') - 1} />
      <Arrow x1={770} y1={710} x2={1160} y2={620} at={t.at('Chase gets') + 6} bow={-30} />
      <Tag text="Managers Bobby Wallace and Hal Chase (right), 1911 · Library of Congress" />
    </Desk>
  );
};

/** 1918: Christy Mathewson, Reds manager, suspends him. */
const Matty: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="mathewson" src="img/ch05/christy_mathewson_reds_bain_1916.jpg" size={[1920, 2813]} crop={[60, 220, 1880, 2700]} a={t.at('1918.')} b={t.at('The case')} fx={0.5} fy={0.32}
    cam={{z: [1.04, 1.14]}} mask={MASKS.mathewson} traceAt={t.at('Christy') + 3} tag="Christy Mathewson, Cincinnati, 1916 · Library of Congress · Bain News Service">
    {() => (
      <>
        <Highlight text="1918 · CINCINNATI" x={90} y={90} size={90} at={t.at('1918.')} seed={75} rot={-2} />
        <Note text="manager Christy Mathewson" x={100} y={780} size={56} rot={-3} at={t.at('Christy') - 3} color="#ffffff" />
        <Note text="suspends Chase: bribes" x={100} y={890} size={62} rot={-3} at={t.at('suspends') - 3} color="#FF6F61" />
      </>
    )}
  </Parallax>
);

/** January 1919: the hearing, Mathewson in France, no witnesses, cleared. */
const Hearing: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('The case')}>
      <DropCard src="img/ch05/john_heydler_1918.jpg" x={140} y={150} w={400} rot={-3} at={t.at('National League president') - 1} />
      <Note text="N.L. president John Heydler" x={110} y={700} size={46} rot={-3} at={t.at('National League president') - 2} />
      <Highlight text="JAN. 1919" x={640} y={110} size={90} at={t.at('January')} seed={77} rot={-2} />
      <DropCard src="img/ch05/christy_mathewson_army_uniform_1918.jpg" x={1460} y={150} w={300} rot={3} at={t.at('France') - 1} />
      <Note text="Mathewson: in France, WWI" x={1080} y={760} size={46} rot={-3} at={t.at('France') - 3} color="#ffffff" />
      <Note text="witnesses: no-shows" x={660} y={330} size={56} rot={-3} at={t.at('Key witnesses') - 3} color="#ffffff" />
      <Note text="not enough evidence" x={660} y={440} size={56} rot={-3} at={t.at('enough evidence') - 3} color="#ffffff" />
      <Stamp text="CLEARED." x={630} y={560} at={t.at('cleared')} size={130} color={pal.subject} />
      <Tag text="Heydler, 1918 · Mathewson in uniform, c. 1918 · Wikimedia Commons" />
    </Desk>
  );
};

/** A few weeks later: the Giants sign him. */
const Giants: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch05/john_mcgraw_1918.jpg" tag="John McGraw, New York Giants manager, 1918 · Wikimedia Commons" a={t.at('A few weeks')} b={t.at('So think')} z={[1.04, 1.12]} pos="50% 30%">
    <Note text="a few weeks later..." x={110} y={110} size={60} rot={-3} at={t.at('A few weeks') - 2} color="#ffffff" />
    <Highlight text="THE GIANTS SIGN HIM" x={100} y={820} size={88} at={t.at('Giants sign')} seed={79} rot={-2} />
  </Arch>
);

/** The lesson: accused twice, still has a job (the ledger). */
const Lesson: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('So think')}>
      <Ledger x={300} y={40} w={1320} at={t.at('So think') - 1}
        entries={[ROWS.y1865(), ROWS.y1877(), ROWS.y1882(), ROWS.y1908(), ROWS.y1919(t.at('accused'), t.at('Twice'), t.at('still have'))]} />
      <Note text="what every player learned:" x={300} y={700} size={58} rot={-3} at={t.at('every player') - 3} color="#ffffff" />
      <Note text="accused twice. still has a job." x={360} y={820} size={72} rot={-3} at={t.at('Twice') - 3} color={pal.subject} />
    </Desk>
  );
};

/** That's baseball in 1919: the White Sox. */
const Sox: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch06/white_sox_team_bain_1919.jpg" tag="Chicago White Sox, 1919 · Library of Congress · Bain News Service" a={t.at("That's baseball")} b={t.at('Sox.') + 30} z={[1.03, 1.1]} pos="50% 60%">
    <Highlight text="1919" x={100} y={100} size={130} at={t.at('1919.', 2)} seed={81} rot={-2} />
    <Note text="now, the White Sox." x={110} y={880} size={66} rot={-3} at={t.at('White Sox') - 3} />
  </Arch>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Chase t={t} />],
    [at('1910.') - 1, <Nineteen10 t={t} />],
    [at('1918.') - 1, <Matty t={t} />],
    [at('The case') - 1, <Hearing t={t} />],
    [at('A few weeks') - 1, <Giants t={t} />],
    [at('So think') - 1, <Lesson t={t} />],
    [at("That's baseball") - 1, <Sox t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('Hal Chase'), at('1910.'), at('1918.'), at('January'), at('Giants sign'), at('1919.', 2)]}
        booms={[at('cleared'), at('Twice')]}
        writes={['best-fielding', 'Prince Hal', 'losing games', 'according', 'accuses', 'owner', 'leaves', 'Chase gets', 'Christy', 'suspends', 'National League president', 'France', 'Key witnesses', 'enough evidence', 'A few weeks', 'accused', 'every player', 'White Sox'].map((p) => at(p))}
        ticks={[at('National League president'), at('France')]} />
    </>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_prince_hal.wav" lead={LEAD} music={[{src: 'music/a_price.mp3', volume: 0.22}]}>
    <Body />
  </ChapterShell>
);
