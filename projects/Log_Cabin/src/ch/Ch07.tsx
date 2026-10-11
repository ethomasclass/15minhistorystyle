// Chapter 7 · Thirty-One Days: the inauguration, the two-hour speech on Rome, 31 days, the cause of death, Tyler and
// "His Accidency", the answer (they wore it), both readings, the last line, and a music-only end screen.
import React from 'react';
import words from '../../public/audio/ch07_thirty_one_days.words.json';
import {Arrow, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, onScreen, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Line, Sounds} from '../kit/bs';
import {Person} from '../kit/figures';
import {BARREL, Board, CABIN, COLUMN, COSTUME, DayGrid, DOOR, PaperCard, RACCOON, RubberStamp, Sketch, SpeechScroll, WIND} from '../kit/lc';
import {MASKS} from '../masks';

const N = words as Narration;
/** Music-only end screen after the last word (the shell adds its own tail and fade). */
const END_SCREEN = 300;
export const CH07_FRAMES = chapterFrames(N, LEAD) + END_SCREEN;

const INAUG: [number, number] = [3000, 2404];
const SADD: [number, number] = [2170, 3000];
const DEATH: [number, number] = [3000, 2368];
const HOUSE: [number, number] = [3000, 2266];
const TYLER: [number, number] = [2241, 3000];
const HOIT: [number, number] = [1920, 2314];

/** March 4th, 1841: cold, windy, no coat, no hat. */
const Inauguration: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Photo src="img/ch07/inauguration_harrison_1841.jpg" size={INAUG} fx={1600} fy={1100} z0={1.26} z1={1.34} a={0} b={t.at('Then he gives')}>
      {() => (
        <>
          {g >= t.at('March 4th,') && <Highlight text="MARCH 4, 1841" x={100} y={70} size={100} at={t.at('March 4th,')} seed={101} rot={-2} />}
          <Note text="inauguration day" x={120} y={230} size={56} rot={-3} at={t.at('Inauguration day.') - 3} color="#ffffff" />
          <Sketch d={WIND} x={1240} y={90} w={560} at={t.at('windy.') - 2} dur={10} seed="wd" />
          <Note text="cold and windy" x={1330} y={300} size={56} rot={-3} at={t.at('cold and windy') - 3} />
          <Note text="Harrison, 68" x={120} y={330} size={56} rot={-3} at={t.at('now 68,') - 3} />
          <Note text="no overcoat. no hat." x={1180} y={860} size={62} rot={-3} at={t.at('no overcoat') - 3} color={usePal().subject} />
          <Tag text="Charles Fenderich, Presidential Inauguration of Wm. H. Harrison, 1841 · Library of Congress" />
        </>
      )}
    </Photo>
  );
};

/** The longest inaugural address ever: a speech scroll that runs off the page, and Rome. */
const Speech: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Board>
      <CropCard src="img/ch07/harrison_inaugural_sadd.jpg" size={SADD} x={110} y={170} w={440} h={600} fx={980} fy={1250} scale={0.36} rot={-2} at={1} />
      <SpeechScroll x={650} y={110} w={230} at={t.at('the longest') - 4} dur={90} to={1200} />
      {g >= t.at('the longest') && <Highlight text="LONGEST INAUGURAL EVER" x={940} y={110} size={60} at={t.at('the longest')} seed={103} rot={-2} />}
      <Stamp text="8,000+ WORDS" x={980} y={280} at={t.at('More than')} size={96} color="#f4efe6" />
      <Stamp text="NEARLY 2 HOURS" x={980} y={430} at={t.at('Nearly two')} size={96} color={pal.subject} />
      <Sketch d={COLUMN} x={1500} y={600} w={150} at={t.at('ancient Rome.') - 2} dur={10} seed="col" />
      <Note text="much of it: ancient Rome" x={960} y={640} size={52} rot={-3} at={t.at('Much of it') - 3} />
      <Tag text="Henry S. Sadd, William Henry Harrison, inaugurated March 4th 1841 · Library of Congress" />
    </Board>
  );
};

/** The log cabin man, two hours on Rome. */
const Rome: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      <Sketch d={CABIN} x={200} y={360} w={520} at={t.at('The man who ran')} dur={10} seed="rc1" />
      <Arrow x1={780} y1={540} x2={1200} y2={540} bow={-50} at={t.at('spends two') - 2} />
      <Sketch d={COLUMN} x={1300} y={250} w={260} at={t.at('spends two')} dur={8} seed="rc2" />
      <Note text="ran on a log cabin" x={220} y={820} size={56} rot={-3} at={t.at('ran on') - 3} />
      <Note text="two hours on Rome" x={1180} y={900} size={60} rot={-3} at={t.at('hours on Rome.') - 3} color={pal.subject} />
    </Board>
  );
};

/** Thirty-one days. Quiet. */
const Days: React.FC<{t: TL}> = ({t}) => (
  <PaletteCtx.Provider value={PALETTES.quiet}>
    <Board>
      <DayGrid x={130} y={220} cell={84} cols={8} at={t.at('One month') - 2} dur={40} />
      <Line text="April 4th, 1841." x={130} y={90} at={t.at('April 4th,') - 2} size={60} />
      <CropCard src="img/ch07/death_of_harrison_currier.jpg" size={DEATH} x={950} y={180} w={860} h={560} fx={1430} fy={1080} scale={0.37} rot={1.5} at={t.at("he's dead.") - 2} />
      <Line text="31 days." x={130} y={640} at={t.at("That's 31") - 2} size={84} />
      <Line text="still the shortest presidency in American history" x={130} y={820} w={1700} at={t.at('Still the shortest') - 2} size={50} />
      <Tag text="N. Currier, Death of Harrison, April 4 A.D. 1841 · Library of Congress" />
    </Board>
  </PaletteCtx.Provider>
);

/** Pneumonia? Typhoid? The White House water? Nobody really knows. */
const Cause: React.FC<{t: TL}> = ({t}) => (
  <Photo src="img/ch07/presidents_house_1841.jpg" size={HOUSE} fx={1500} fy={1250} z0={1.3} z1={1.4} a={t.at('The story goes')} b={t.at('No president had')} bw="grayscale(1) contrast(1.2) brightness(0.6)">
    {() => (
      <>
        <Note text="the story: a cold, then pneumonia" x={100} y={80} size={54} rot={-3} at={t.at('caught a cold') - 3} color="#FF9F1C" />
        <Note text="doctors today: typhoid fever?" x={100} y={190} size={54} rot={-3} at={t.at('typhoid fever') - 3} color="#FF9F1C" />
        <Note text="the White House water?" x={1150} y={780} size={56} rot={-3} at={t.at('White House water') - 3} color="#FF9F1C" />
        <Note text="so the speech might be innocent" x={100} y={860} size={52} rot={-3} at={t.at('might be innocent') - 3} color="#ffffff" />
        <Note text="nobody really knows" x={140} y={950} size={56} rot={-3} at={t.at('Nobody really') - 3} />
        <Tag text="The President's House, c. 1841 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** The Constitution's unclear line. */
const Clause: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const mark = g >= t.at('whether the vice');
  return (
    <Board>
      <Note text="no president had ever died in office" x={110} y={80} size={56} rot={-3} at={t.at('No president had') - 3} color="#ffffff" />
      <PaperCard x={160} y={220} w={1180} at={t.at('The Constitution') - 2} rot={-1.5} head="U.S. Constitution · Article II, Section 1">
        <div style={{fontFamily: JF.heavy, fontWeight: 900, fontSize: 40, lineHeight: 1.45, color: '#222'}}>
          In Case of the Removal of the President from Office, or of his Death, Resignation, or Inability to discharge the Powers and Duties of the said Office,{' '}
          <span style={{background: mark ? 'rgba(255,159,28,0.55)' : 'transparent'}}>the Same shall devolve on the Vice President</span>...
        </div>
      </PaperCard>
      <Note text="the same what?" x={1380} y={520} size={64} rot={-4} at={t.at('whether the vice') + 4} color="#FF9F1C" />
      <Note text="the office?" x={1400} y={650} size={56} rot={-3} at={t.at('became president,') - 3} />
      <Note text="or just the job?" x={1400} y={760} size={56} rot={-3} at={t.at('or just took') - 3} />
    </Board>
  );
};

/** Tyler: "I'm the president." His Accidency. Then the Whigs throw him out. */
const Tyler: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Board>
      <CropCard mask={MASKS.tyler} src="img/ch07/tyler_fenderich_1841.jpg" size={TYLER} x={150} y={170} w={540} h={720} fx={1180} fy={1250} scale={0.4} rot={-2} at={1} traceAt={t.at('John Tyler said') + 4} />
      {g >= t.at("I'm the president.") && <Highlight text="I'M THE PRESIDENT." x={790} y={110} size={88} at={t.at("I'm the president.")} seed={105} rot={-2} />}
      <Note text="critics: 'His Accidency'" x={810} y={280} size={58} rot={-3} at={t.at('His Accidency.') - 3} color={pal.subject} />
      <Note text="a former Democrat" x={810} y={400} size={52} rot={-3} at={t.at('a former Democrat') - 3} color="#ffffff" />
      <Note text="vetoes the Whigs' bank bill" x={810} y={500} size={52} rot={-3} at={t.at('vetoed') - 3} />
      <Sketch d={DOOR} x={1620} y={620} w={200} at={t.at('So the Whigs threw') - 2} dur={8} seed="dr" />
      <RubberStamp text="OUT" x={1600} y={720} at={t.at('out of the party.')} size={110} rot={-14} />
      <Note text="the Whigs throw out their own VP" x={810} y={640} size={48} rot={-3} at={t.at('So the Whigs threw') - 3} />
      <Note text="within months" x={850} y={760} size={60} rot={-3} at={t.at('Within months.') - 3} color={pal.subject} />
      <Tag text="Charles Fenderich, John Tyler, 1841 · Library of Congress" />
    </Board>
  );
};

/** The question again. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      <Note text="so, the question:" x={180} y={170} size={60} rot={-3} at={t.at("So let's go back") - 3} color="#ffffff" />
      <Note text="how did an insult" x={230} y={300} size={96} rot={-3} at={t.at('How did') - 3} />
      <Note text="about a log cabin" x={260} y={450} size={96} rot={-3} at={t.at('about a log') - 3} />
      <Note text="get a man elected president?" x={290} y={610} size={96} rot={-3} at={t.at('get a man') - 3} color={pal.subject} />
      <Sketch d={CABIN} x={1420} y={760} w={300} at={t.at('about a log')} dur={8} seed="q7" />
    </Board>
  );
};

/** They wore it (the costume, again). */
const WoreIt: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Board>
      <CropCard mask={MASKS.harrison} src="img/ch03/harrison_hoit_1840.jpg" size={HOIT} x={1040} y={250} w={760} h={760} fx={1000} fy={1400} scale={0.42} at={-10} traceAt={2}>
        {() => <Sketch d={COSTUME} x={1040} y={-51} w={760} at={t.at('They wore it.') - 4} dur={10} seed="cos2" width={7} />}
      </CropCard>
      <Note text="they didn't argue with the insult" x={110} y={260} size={52} rot={-3} at={t.at("didn't argue") - 3} color="#ffffff" />
      {g >= t.at('They wore it.') && <Highlight text="THEY WORE IT." x={110} y={400} size={120} at={t.at('They wore it.')} seed={107} rot={-3} />}
      <Tag text="Albert Gallatin Hoit, William Henry Harrison, 1840 (cabin drawn on) · via Wikimedia Commons" />
    </Board>
  );
};

/** Two readings: critics and supporters. */
const TwoViews: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  return (
    <Board>
      <div style={{position: 'absolute', left: 958, top: 110, width: 4, height: 700, background: 'rgba(244,239,230,0.45)'}} />
      <div style={{position: 'absolute', left: 140, top: 130, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.subject, opacity: g >= t.at('Critics said') ? 1 : 0}}>CRITICS</div>
      <div style={{position: 'absolute', left: 1040, top: 130, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.mark, opacity: g >= t.at('Supporters said') ? 1 : 0}}>SUPPORTERS</div>
      <Note text="a costume party" x={140} y={240} size={70} rot={-3} at={t.at('costume party:') - 3} color={pal.subject} />
      <Note text="loud, cheerful and empty" x={150} y={380} size={58} rot={-3} at={t.at('loud, cheerful') - 3} color={pal.subject} />
      <Note text="millions of ordinary voters" x={1040} y={240} size={58} rot={-3} at={t.at('millions of ordinary') - 3} />
      <Note text="who'd never felt invited" x={1050} y={380} size={58} rot={-3} at={t.at('never felt') - 3} />
      <Note text="historians still argue." x={560} y={860} size={60} rot={-3} at={t.at('Historians still') - 3} color="#ffffff" />
      <Note text="both had a point." x={640} y={960} size={60} rot={-3} at={t.at('Both had') - 3} />
    </Board>
  );
};

/** Eight in ten showed up... some of them for a raccoon. */
const Raccoon: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const lit = t.at('Eight in ten');
  return (
    <Board>
      {Array.from({length: 10}).map((_, i) => <Person key={i} x={180 + i * 120} y={760} h={220} at={lit + i} color={i < 8 && g >= lit + 6 + i * 2 ? pal.mark : 'rgba(237,231,220,0.35)'} />)}
      <Stamp text="8 IN 10" x={180} y={160} at={lit + 4} size={150} color={pal.mark} />
      <Sketch d={RACCOON} x={1460} y={330} w={340} at={t.at('for a raccoon.') - 2} dur={10} seed="rc7" width={6} />
      <Note text="...for a raccoon" x={1260} y={880} size={64} rot={-4} at={t.at('for a raccoon.') - 3} color={pal.subject} />
    </Board>
  );
};

/** The last line over the White House, then the end screen. */
const Last: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const end = t.at('Thanks');
  return (
    <Photo src="img/ch07/presidents_house_1841.jpg" size={HOUSE} fx={1500} fy={1250} z0={1.3} z1={1.5} a={t.at('Give him') - 1} b={end + 300} bw="grayscale(1) contrast(1.2) brightness(0.6)">
      {(p) => {
        const S = onScreen(p);
        const [hx, hy] = S(1250, 1150);
        return (
          <>
            <Note text="'give him a barrel of hard cider...'" x={100} y={70} size={54} rot={-3} at={t.at('Give him') - 3} color="#ffffff" />
            <Note text="'...he'll sit in his log cabin'" x={140} y={170} size={54} rot={-3} at={t.at("he'll sit") - 3} color="#ffffff" />
            <Sketch d={BARREL} x={hx + 380} y={hy - 60} w={150} at={t.at('Give him') + 6} dur={8} seed="lb" />
            <Loop cx={hx} cy={hy - 40} rx={420} ry={190} at={t.at('he got the White') + 8} seed={109} />
            {g >= t.at('For 31') && <Highlight text="FOR 31 DAYS." x={110} y={780} size={130} at={t.at('For 31')} seed={111} rot={-3} />}
            <Note text="thanks for watching" x={1250} y={790} size={56} rot={-3} at={end - 2} color="#ffffff" />
            <Note text="subscribe for more ↓" x={1270} y={880} size={56} rot={-3} at={t.at('subscribe,') - 3} color={pal.subject} />
            <Tag text="The President's House, c. 1841 · Library of Congress" />
          </>
        );
      }}
    </Photo>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Inauguration t={t} />],
    [at('Then he gives') - 1, <Speech t={t} />],
    [at('The man who ran') - 1, <Rome t={t} />],
    [at('One month') - 1, <Days t={t} />],
    [at('The story goes') - 1, <Cause t={t} />],
    [at('No president had') - 1, <Clause t={t} />],
    [at('John Tyler said') - 1, <Tyler t={t} />],
    [at("So let's go back") - 1, <Question t={t} />],
    [at("The Whigs didn't") - 1, <WoreIt t={t} />],
    [at('Critics said') - 1, <TwoViews t={t} />],
    [at('Eight in ten') - 1, <Raccoon t={t} />],
    [at('Give him') - 1, <Last t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('March 4th,'), at('the longest'), at('More than'), at('Nearly two'), at("I'm the president."), at('out of the party.'), at('They wore it.'), at('Eight in ten') + 4, at('For 31')]}
        writes={['Inauguration day.', 'cold and windy', 'now 68,', 'no overcoat', 'Much of it', 'ran on', 'hours on Rome.', 'caught a cold', 'typhoid fever', 'White House water', 'might be innocent', 'Nobody really', 'No president had', 'whether the vice', 'became president,', 'or just took', 'His Accidency.', 'a former Democrat', 'vetoed', 'So the Whigs threw', 'Within months.', "So let's go back", 'How did', 'about a log', 'get a man', "didn't argue", 'costume party:', 'loud, cheerful', 'millions of ordinary', 'never felt', 'Historians still', 'Both had', 'for a raccoon.', 'Give him', "he'll sit", 'Thanks', 'subscribe,'].map((p) => at(p))} />
    </>
  );
};

export const Ch07: React.FC = () => {
  const t = makeTimeline(N, 30);
  return (
    <ChapterShell n={N} audio="audio/ch07_thirty_one_days.wav" lead={LEAD} extra={END_SCREEN}
      music={[
        {src: 'music/a_newsroom.mp3', volume: 0.18, to: t.at('One month')},
        {src: 'music/j_grief.mp3', volume: 0.15, from: t.at('One month') - 10, to: t.at('No president had')},
        {src: 'music/j_intrigue.mp3', volume: 0.16, from: t.at('No president had') - 10, to: t.at("So let's go back")},
        {src: 'music/r_ending.mp3', volume: 0.15, from: t.at("So let's go back") - 20},
      ]}>
      <Body />
    </ChapterShell>
  );
};
