// Chapter 3 · On Paper: hippodroming, Hulbert's National League (1876), the 1877 Louisville Grays, the first lifetime
// bans, and the mid-video subscribe reminder.
import React from 'react';
import words from '../../public/audio/ch03_louisville.words.json';
import {Highlight, Loop, Note, Tag, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Arch, Desk, DropCard, Ledger, ROWS, Sounds} from '../kit/bs';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

/** Hippodroming: the term, with the circus-race card. */
const Hippo: React.FC<{t: TL}> = ({t}) => (
  <Desk a={0}>
    <DropCard src="img/ch02/harpers_athletics_atlantics_1865.jpg" x={1000} y={720} w={780} rot={2} at={t.at('Plenty') - 1} />
    <Highlight text="THE 1870s" x={140} y={120} size={96} at={t.at('1870s')} seed={41} rot={-2} />
    <Highlight text="HIPPODROMING" x={140} y={330} size={104} at={t.at('"hippodroming,"')} seed={43} rot={-2} />
    <Definition term="hippodroming" def="a fixed game, staged like a circus race" at={t.at('like a staged') - 2} x={150} y={510} w={900} />
    <Note text="any loss might be bought" x={160} y={760} size={62} rot={-3} at={t.at('Plenty') - 3} color="#ffffff" />
    <Tag text="Harper's Weekly, Nov. 18, 1865 · Internet Archive Book Images" />
  </Desk>
);

/** 1876: William Hulbert's new league and its promises. */
const Hulbert: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('So in 1876')}>
    <CropCard src="img/ch03/william_hulbert_1870s.jpg" size={[3840, 4357]} x={150} y={130} w={600} h={800} fx={1721} fy={2250} scale={0.3} rot={-2} at={t.at('So in 1876') - 1}
      mask={MASKS.hulbert} traceAt={t.at('William') + 3} />
    <Highlight text="1876" x={880} y={110} size={110} at={t.at('1876,')} seed={45} rot={-2} />
    <Note text="William Hulbert, Chicago" x={890} y={300} size={52} rot={-3} at={t.at('William') - 2} color="#ffffff" />
    <Highlight text="THE NATIONAL LEAGUE" x={880} y={420} size={72} at={t.at('National League')} seed={47} rot={-2} />
    <Note text="✓ no betting pools" x={900} y={590} size={54} rot={-3} at={t.at('No betting') - 3} />
    <Note text="✓ no beer" x={900} y={690} size={54} rot={-3} at={t.at('No beer') - 3} />
    <Note text="✓ fixers: gone" x={900} y={790} size={54} rot={-3} at={t.at('Players who') - 3} />
    <Tag text="William A. Hulbert · New York Public Library" />
  </Desk>
);

/** 1877: the Grays cruise, then collapse. */
const Grays: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('The promise')}>
      <Note text="year two:" x={150} y={130} size={58} rot={-3} at={t.at('The promise') - 2} color="#ffffff" />
      <Highlight text="1877" x={150} y={230} size={110} at={t.at('1877.')} seed={49} rot={-2} />
      <DropCard src="img/ch03/louisville_grays_team_1876.jpg" x={900} y={110} w={820} rot={2} at={t.at('The Louisville') - 1} />
      <Note text="Louisville Grays: cruising" x={150} y={460} size={50} rot={-3} at={t.at('cruising') - 3} />
      <Stamp text="COLLAPSE." x={140} y={620} at={t.at('collapse')} size={120} color={pal.subject} />
      <Note text="errors · wild throws · loss after loss" x={160} y={850} size={54} rot={-3} at={t.at('Errors') - 3} color="#ffffff" />
      <Tag text="Louisville Grays, 1876 · Wikimedia Commons" />
    </Desk>
  );
};

/** The telegrams: a Western Union room, the telegrams card, "show me". */
const Wires: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch03/western_union_operating_room_1875.jpg" tag="Western Union operating room, 1875 · Wikimedia Commons" a={t.at('A local')} b={t.at('The telegrams show')} z={[1.04, 1.12]} pos="40% 50%">
    <Note text="a newspaperman asks questions" x={110} y={120} size={56} rot={-3} at={t.at('newspaperman') - 3} color="#ffffff" />
    <Note text="a lot of telegrams" x={1180} y={130} size={56} rot={-3} at={t.at('telegrams.') - 3} />
    <Note text="the club wants to read them" x={110} y={860} size={56} rot={-3} at={t.at('demands') - 3} />
  </Arch>
);

/** What the telegrams showed: three players took money; a fourth refused to hand his over. */
const Four: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('The telegrams show')}>
      <DropCard src="img/ch03/jim_devlin_1876.jpg" x={130} y={130} w={290} rot={-3} at={t.at('Jim Devlin') - 1} />
      <Note text="Devlin, pitcher" x={130} y={690} size={42} rot={-3} at={t.at('Jim Devlin') - 2} />
      <DropCard src="img/ch03/george_hall_1874.jpg" x={520} y={110} w={310} rot={2} at={t.at('George Hall') - 1} />
      <Note text="Hall, outfield" x={530} y={690} size={42} rot={-3} at={t.at('George Hall') - 2} />
      <Note text="Nichols, utility" x={930} y={250} size={42} rot={-3} at={t.at('Al Nichols') - 2} />
      <Note text="(no photo)" x={950} y={320} size={34} rot={-3} at={t.at('Al Nichols') + 2} color="#ffffff" />
      <Note text="Craver, captain:" x={1340} y={250} size={42} rot={-3} at={t.at('Bill Craver') - 2} />
      <Note text="refused to hand his over" x={1300} y={320} size={38} rot={-3} at={t.at('refused') - 2} color="#FF9F1C" />
      <Note text="took gamblers' money to lose" x={140} y={850} size={60} rot={-3} at={t.at("gamblers'") - 3} color={pal.subject} />
      <Tag text="Devlin, c. 1876 · Hall, 1874 · Wikimedia Commons" />
    </Desk>
  );
};

/** The league bans all four, for life; Devlin begs; Hulbert says no. */
const ForLife: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('The league banned')}>
    <Ledger x={300} y={110} w={1320} at={t.at('The league banned') - 1} entries={[ROWS.y1865(), ROWS.y1877(t.at('banned all four'), t.at('For life'))]} />
    <Note text="unlike 1865, it meant it" x={330} y={560} size={58} rot={-3} at={t.at('unlike 1865') - 3} color="#ffffff" />
    <Note text="Devlin begged, every year." x={330} y={690} size={58} rot={-3} at={t.at('Devlin begged') - 3} />
    <Note text="Hulbert: no." x={1100} y={790} size={72} rot={-4} at={t.at('Hulbert said') - 3} color="#FF6F61" />
  </Desk>
);

/** The rule isn't new... on paper. */
const OnPaper: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Arch src="img/ch02/pool_selling_text_page_mccabe_1882.jpg" tag="McCabe, New York by Sunlight and Gaslight, 1882 · Internet Archive" a={t.at('So the rule')} b={t.at('Quick thing')} z={[1.1, 1.2]} pos="50% 30%" look="dim">
      <Note text="the rule against gambling:" x={160} y={220} size={66} rot={-3} at={t.at('So the rule') + 2} color="#ffffff" />
      <Note text="there almost from the start" x={200} y={360} size={66} rot={-3} at={t.at('almost from') - 3} />
      <Highlight text="ON PAPER." x={260} y={560} size={150} at={t.at('On paper')} seed={51} rot={-3} />
      <Loop cx={620} cy={660} rx={420} ry={130} at={t.at('On paper') + 8} seed={53} tilt={-4} color={pal.subject} />
    </Arch>
  );
};

/** The mid-video subscribe reminder, tied to Wansley. */
const Subscribe: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Quick thing')}>
      <CropCard src="img/ch02/currier_ives_american_national_game_1866.jpg" size={[3840, 2773]} x={1220} y={160} w={480} h={640} fx={1170} fy={2010} scale={0.95} rot={4} at={t.at('unlike William') - 1}
        mask={MASKS.catcher_ci} tint={null} traceAt={t.at('unlike William') + 4} />
      <Note text="quick thing:" x={170} y={170} size={60} rot={-3} at={t.at('Quick thing') - 2} color="#ffffff" />
      <Highlight text="SUBSCRIBE" x={170} y={300} size={130} at={t.at('subscribe.')} seed={55} rot={-2} />
      <Note text="free" x={200} y={530} size={64} rot={-3} at={t.at('free') - 3} />
      <Note text="really helps the channel" x={200} y={640} size={64} rot={-3} at={t.at('really helps') - 3} />
      <Note text="nobody's paying me to say it" x={200} y={790} size={64} rot={-3} at={t.at("nobody's") - 3} color={pal.subject} />
      <Note text="subscribe ↓" x={1500} y={960} size={44} rot={-2} at={t.at('subscribe.') + 6} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Hippo t={t} />],
    [at('So in 1876') - 1, <Hulbert t={t} />],
    [at('The promise') - 1, <Grays t={t} />],
    [at('A local') - 1, <Wires t={t} />],
    [at('The telegrams show') - 1, <Four t={t} />],
    [at('The league banned') - 1, <ForLife t={t} />],
    [at('So the rule') - 1, <OnPaper t={t} />],
    [at('Quick thing') - 1, <Subscribe t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('1870s'), at('"hippodroming,"'), at('1876,'), at('National League'), at('1877.'), at('On paper'), at('subscribe.')]}
        booms={[at('collapse'), at('For life')]}
        writes={['Plenty', 'telegrams.', 'William', 'No betting', 'No beer', 'Players who', 'The promise', 'cruising', 'Errors', 'newspaperman', 'demands', 'Jim Devlin', 'George Hall', 'Al Nichols', "gamblers'", 'Bill Craver', 'refused', 'banned all four', 'unlike 1865', 'Devlin begged', 'Hulbert said', 'almost from', 'Quick thing', 'free', 'really helps', "nobody's"].map((p) => at(p))}
        ticks={[at('The Louisville'), at('Plenty'), at('unlike William')]}
        extra={[{at: at('telegrams.') + 4, src: 'sfx/tick_soft.wav', volume: 0.4}]} />
    </>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_louisville.wav" lead={LEAD} music={[{src: 'music/j_intrigue.mp3', volume: 0.17}]}>
    <Body />
  </ChapterShell>
);
