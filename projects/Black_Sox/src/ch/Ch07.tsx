// Chapter 7 · Regardless of the Verdict: the grand jury, the confessions, "Say it ain't so" (the myth), Landis hired,
// the trial and acquittal, the bans, Buck Weaver, the wall.
import React from 'react';
import words from '../../public/audio/ch07_regardless.words.json';
import {Highlight, Note, Tag, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Arch, Desk, DropCard, Ledger, ROWS, Sounds, SyncQuote, Wall} from '../kit/bs';
import {Parallax} from '../kit/parallax';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

/** A year of rumor; September 1920, the grand jury (the Tribune's page). */
const Jury: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch01/chicago_tribune_1920-10-27_p17.jpg" tag="Chicago Tribune, Oct. 27, 1920 · Wikimedia Commons" a={0} b={t.at('Cicotte breaks')} z={[1.35, 1.5]} pos="50% 10%" look="dim">
    <Note text="almost a year of rumor" x={140} y={120} size={60} rot={-3} at={t.at('rumor') - 4} color="#ffffff" />
    <Highlight text="SEPT. 1920" x={130} y={260} size={110} at={t.at('September')} seed={101} rot={-2} />
    <Highlight text="GRAND JURY" x={130} y={460} size={96} at={t.at('grand jury')} seed={103} rot={-2} />
    <Definition term="grand jury" def="a panel that decides if there's enough evidence for a trial" at={t.at('a panel') - 2} x={140} y={640} w={1200} />
  </Arch>
);

/** The confessions: Cicotte, then Jackson, $5,000. */
const Confess: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Cicotte breaks')}>
      <DropCard src="img/ch06/eddie_cicotte_1917.jpg" x={140} y={130} w={620} rot={-3} at={t.at('Cicotte breaks') - 1} />
      <Note text="Cicotte confesses" x={170} y={640} size={60} rot={-3} at={t.at('confesses') - 3} color="#ffffff" />
      <DropCard src="img/ch06/joe_jackson_1919.jpg" x={1150} y={110} w={430} rot={3} at={t.at('So does') - 1} />
      <Note text="so does Jackson:" x={1000} y={760} size={56} rot={-3} at={t.at('So does') - 2} color="#ffffff" />
      <Stamp text={'"$5,000"'} x={1000} y={850} at={t.at('5,000')} size={120} color={pal.subject} />
      <Tag text="Cicotte, 1917 · Library of Congress · Jackson, 1919 · Wikimedia Commons" />
    </Desk>
  );
};

/** "Say it ain't so, Joe": the legend, and Jackson's denial. */
const SayIt: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Outside')}>
    <DropCard src="img/ch07/criminal_courts_building_doorway_habs_1964.jpg" x={150} y={110} w={520} rot={-3} at={t.at('Outside') - 1} />
    <Note text="the story goes..." x={790} y={160} size={56} rot={-3} at={t.at('the story goes') - 3} color="#ffffff" />
    <SyncQuote t={t} phrase={'"Say it ain\'t so, Joe."'} x={780} y={300} w={1000} size={96} />
    <Note text="Jackson: it never happened" x={800} y={640} size={64} rot={-3} at={t.at('Jackson said') - 3} color="#FF9F1C" />
    <Tag text="Criminal Courts Building doorway, Chicago (site of the 1920 grand jury) · HABS, 1964" />
  </Desk>
);

/** The owners hire Judge Landis as the first commissioner. */
const Commissioner: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="landis_1907" src="img/ch07/landis_judge_seated_1907.jpg" size={[3287, 4096]} crop={[150, 300, 3150, 3950]} a={t.at('The owners')} b={t.at('Summer')} fx={0.55} fy={0.3}
    cam={{z: [1.04, 1.12]}} mask={MASKS.landis_1907} traceAt={t.at('federal judge') + 3} tag="Judge Kenesaw Mountain Landis · Library of Congress">
    {() => (
      <>
        <Note text="the owners are scared" x={1080} y={110} size={56} rot={-3} at={t.at('owners') - 3} color="#ffffff" />
        <Note text="a fixed Series can't be hidden" x={1090} y={220} size={46} rot={-3} at={t.at('A fixed') - 3} />
        <Highlight text="COMMISSIONER" x={90} y={690} size={96} at={t.at('commissioner,')} seed={105} rot={-2} />
        <Definition term="commissioner" def="baseball's first boss, with almost total power" at={t.at('almost total') - 2} x={100} y={870} w={1100} />
      </>
    )}
  </Parallax>
);

/** Summer 1921: the trial, the confessions taken back. */
const Trial: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch07/criminal_courts_building_hubbard_st_habs_1964.jpg" tag="Criminal Courts Building, Chicago (site of the 1921 trial) · HABS, 1964" a={t.at('Summer')} b={t.at('On August')} z={[1.03, 1.1]} pos="50% 40%">
    <Highlight text="SUMMER 1921: THE TRIAL" x={100} y={100} size={88} at={t.at('Summer')} seed={107} rot={-2} />
    <Note text="the confessions: taken back" x={110} y={880} size={60} rot={-3} at={t.at('take back') - 3} color="#ffffff" />
  </Arch>
);

/** August 2: not guilty; jurors celebrate (reportedly). */
const Verdict: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch01/black_sox_at_trial_1921.jpg" tag="The players at trial, Chicago, 1921 · Wikimedia Commons" a={t.at('On August')} b={t.at('The next day')} z={[1.12, 1.2]} pos="50% 45%">
    <Highlight text="AUG. 2, 1921" x={90} y={860} size={84} at={t.at('August')} seed={109} rot={-2} />
    <Stamp text="NOT GUILTY" x={1000} y={860} at={t.at('not guilty')} size={110} color="#FF9F1C" />
    <Note text="jurors celebrate with them (reportedly)" x={900} y={770} size={38} rot={-3} at={t.at('jurors') - 3} color="#ffffff" />
  </Arch>
);

/** The next day: Landis bans all eight, for life (the ledger). */
const Banned: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('The next day')}>
    <Ledger x={300} y={30} w={1320} at={t.at('The next day') - 1}
      entries={[ROWS.y1865(), ROWS.y1877(), ROWS.y1882(), ROWS.y1908(), ROWS.y1919(0, 0, 0), ROWS.y1921(t.at('bans all eight'), t.at('For life'))]} />
    <Note text="the next day. anyway." x={340} y={700} size={66} rot={-3} at={t.at('anyway') - 3} color="#ffffff" />
  </Desk>
);

/** Even Buck Weaver. */
const Weaver: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Parallax name="weaver" src="img/ch07/buck_weaver_1917.jpg" size={[3000, 2277]} crop={[300, 200, 2900, 2180]} a={t.at('Even third')} b={t.at('This time')} fx={0.5} fy={0.45}
      cam={{z: [1.04, 1.14]}} mask={MASKS.weaver} traceAt={t.at('Buck Weaver') + 3} tag="Buck Weaver, 1917 · Library of Congress · Bain News Service">
      {() => (
        <>
          <Note text="even 3rd baseman Buck Weaver" x={90} y={90} size={54} rot={-3} at={t.at('Buck Weaver') - 3} color="#ffffff" />
          <Note text="took no money. played hard." x={100} y={200} size={52} rot={-3} at={t.at('took no') - 3} />
          <Note text="knew. didn't report it." x={90} y={900} size={58} rot={-3} at={t.at('He knew') - 3} color={pal.subject} />
          <Note text="that was enough." x={1340} y={780} size={56} rot={-3} at={t.at('That was enough') - 3} color="#ffffff" />
        </>
      )}
    </Parallax>
  );
};

/** Nobody came back: the wall goes up. */
const TheWall: React.FC<{t: TL}> = ({t}) => {
  return (
    <Desk a={t.at('This time')}>
      <Note text="this time, nobody came back." x={160} y={110} size={68} rot={-3} at={t.at('nobody came') - 3} color="#ffffff" />
      <Wall x={160} y={330} w={1600} rows={6} at={t.at("That's the wall") - 6} dur={24} />
      <Note text="open secret →" x={180} y={720} size={60} rot={-3} at={t.at('open secret') - 3} />
      <Highlight text="WILL NOT FORGIVE" x={720} y={860} size={96} at={t.at('not forgive')} seed={111} rot={-2} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Jury t={t} />],
    [at('Cicotte breaks') - 1, <Confess t={t} />],
    [at('Outside') - 1, <SayIt t={t} />],
    [at('The owners') - 1, <Commissioner t={t} />],
    [at('Summer') - 1, <Trial t={t} />],
    [at('On August') - 1, <Verdict t={t} />],
    [at('The next day') - 1, <Banned t={t} />],
    [at('Even third') - 1, <Weaver t={t} />],
    [at('This time') - 1, <TheWall t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('September'), at('grand jury'), at('commissioner,'), at('Summer'), at('August'), at('not forgive')]}
        booms={[at('5,000'), at('For life'), at("That's the wall")]}
        writes={['rumor', 'confesses', 'So does', 'the story goes', 'Jackson said', 'owners', 'A fixed', 'take back', 'jurors', 'anyway', 'Buck Weaver', 'took no', 'He knew', 'That was enough', 'nobody came', 'open secret'].map((p) => at(p))}
        ticks={[at('Cicotte breaks'), at('Outside')]}
        extra={[{at: at('not guilty'), src: 'sfx/gavel.wav', volume: 0.45}, {at: at('bans all eight'), src: 'sfx/gavel.wav', volume: 0.45}]} />
    </>
  );
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_regardless.wav" lead={LEAD} music={[{src: 'music/j_cold_open.mp3', volume: 0.2}]}>
    <Body />
  </ChapterShell>
);
