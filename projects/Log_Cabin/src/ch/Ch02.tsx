// Chapter 2 · Hard Times: Van Buren takes over, the Panic of 1837, "Martin Van Ruin", the Whigs, the convention, Clay.
import React from 'react';
import words from '../../public/audio/ch02_hard_times.words.json';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, Definition, DrawnCrown, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {DropCard, Sounds} from '../kit/bs';
import {Board, CHAIR, CrashChart, Sketch, Strike} from '../kit/lc';
import {Person} from '../kit/figures';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

const VB: [number, number] = [2386, 3000];
const VBB: [number, number] = [1920, 2434];
const CLAY: [number, number] = [2356, 3000];
const TIMES: [number, number] = [3000, 2090];

/** 1837: Jackson's vice president takes over. */
const VanBuren: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  return (
    <Board>
      <CropCard mask={MASKS.vanburen} src="img/ch02/van_buren_fenderich_1839.jpg" size={VB} x={150} y={170} w={560} h={740} fx={1200} fy={1180} scale={0.42} rot={-2} at={1} traceAt={t.at('Martin Van Buren') + 2} />
      <Highlight text="1837" x={820} y={120} size={120} at={t.at('1837.')} seed={21} rot={-2} />
      {g >= t.at('Martin Van Buren') && <Highlight text="MARTIN VAN BUREN" x={820} y={330} size={84} at={t.at('Martin Van Buren')} seed={23} rot={-2} />}
      <Note text="Jackson's vice president" x={850} y={470} size={54} rot={-3} at={t.at('his vice') - 3} />
      <Note text="a Democrat" x={850} y={590} size={60} rot={-3} at={t.at('Democrat,') - 3} />
      <Note text="same name as today's party," x={850} y={720} size={50} rot={-3} at={t.at('Same name') - 3} color="#ffffff" />
      <Note text="very different one" x={880} y={810} size={58} rot={-3} at={t.at('very different') - 3} color={pal.subject} />
      <Tag text="Charles Fenderich, Martin Van Buren, 1839 · Library of Congress" />
    </Board>
  );
};

/** Two months later: the Panic of 1837, in a cartoon from that year. */
const Panic: React.FC<{t: TL}> = ({t}) => (
  <Photo src="img/ch02/the_times_1837_cartoon.jpg" size={TIMES} fx={1500} fy={1000} z0={1.04} z1={1.14} a={t.at('Two months')} b={t.at('That sudden')}>
    {() => (
      <>
        <Note text="two months later..." x={110} y={90} size={60} rot={-3} at={t.at('Two months') - 3} color="#ffffff" />
        <Note text="banks close" x={1240} y={210} size={66} rot={-4} at={t.at('Banks close') - 3} />
        <Note text="prices drop" x={1260} y={330} size={66} rot={-3} at={t.at('Prices drop') - 3} />
        <Note text="jobs, farms, savings: gone" x={1060} y={830} size={60} rot={-3} at={t.at('People lose') - 3} color="#ff9f8f" />
        <Tag text="Edward Williams Clay, The Times, 1837 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** Vocabulary: panic and depression, with a falling chart and a closed bank. */
const Vocab: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Board>
      {g >= t.at('panic,') && <Highlight text="PANIC" x={110} y={100} size={110} at={t.at('panic,')} seed={25} rot={-2} />}
      <Definition term="pan·ic" def="a sudden financial crash" at={t.at('panic,') + 8} x={130} y={270} w={760} />
      {g >= t.at('depression,') && <Highlight text="DEPRESSION" x={110} y={470} size={110} at={t.at('depression,')} seed={27} rot={-2} />}
      <Definition term="de·pres·sion" def="a long slump: years of hard times" at={t.at('a slump')} x={130} y={640} w={840} />
      <CrashChart x={1080} y={150} w={700} h={360} at={1} dur={20} />
      <DropCard src="img/ch02/shinplaster_1837.jpg" x={1080} y={620} w={640} rot={3} at={t.at('depression,') + 4} />
      <Note text="money people stopped trusting" x={1070} y={960} size={44} rot={-2} at={t.at('lasts for') - 3} color="#ffffff" />
      <Tag text="Henry R. Robinson, 'Shin plaster' satire note, 1837 · Library of Congress" />
    </Board>
  );
};

/** Whose fault? The man in the chair. */
const Fault: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  return (
    <Board>
      <Note text="whose fault?" x={110} y={100} size={70} rot={-3} at={t.at('Whose fault') - 3} color="#ffffff" />
      <Sketch d={CHAIR} x={230} y={150} w={480} at={t.at('the guy in') - 4} dur={10} seed="ch2" />
      <CropCard mask={MASKS.vanburen_bust} src="img/ch02/van_buren_bust_1840.jpg" size={VBB} x={330} y={220} w={280} h={360} fx={960} fy={820} scale={0.24} rot={-2} at={t.at('opponents,') + 2} traceAt={t.at('the guy in')} />
      <Note text="the guy in the chair" x={760} y={420} size={70} rot={-3} at={t.at('the guy in') - 3} />
      <Arrow x1={760} y1={470} x2={640} y2={520} bow={30} at={t.at('the guy in') + 4} />
      {g >= t.at('Van Ruin') && <Highlight text="MARTIN VAN RUIN" x={760} y={620} size={100} at={t.at('Van Ruin')} seed={29} rot={-3} />}
      <Note text="(their nickname, not his)" x={800} y={800} size={46} rot={-3} at={t.at('Van Ruin') + 8} color={pal.subject} />
      <Tag text="Unknown artist, Martin Van Buren, c. 1840 · via Wikimedia Commons" />
    </Board>
  );
};

/** The opposition: the Whigs, named against kings. */
const Whigs: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Board>
      <Note text="his opponents:" x={110} y={110} size={60} rot={-3} at={t.at('And who are') - 3} color="#ffffff" />
      {g >= t.at('The Whigs.') && <Highlight text="THE WHIGS" x={110} y={200} size={130} at={t.at('The Whigs.')} seed={31} rot={-2} />}
      <Note text="a new party, built to stop Jackson" x={130} y={420} size={56} rot={-3} at={t.at('A new party') - 3} />
      <DrawnCrown x0={1220} x1={1600} y={560} h={170} at={t.at('opposed kings') - 2} />
      <Strike x1={1150} y1={600} x2={1690} y2={330} at={t.at('acted like one') - 2} color={pal.subject} />
      <Note text="named for a British party that opposed kings" x={130} y={560} size={46} rot={-3} at={t.at('The name comes') - 3} />
      <Note text="(we have a whole video on that)" x={150} y={840} size={44} rot={-3} at={t.at('We have a whole') - 3} color="#ffffff" />
    </Board>
  );
};

/** They agree on one thing, and argue about everything else. */
const OneThing: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Board>
      <Note text="the Whigs agree on one thing:" x={110} y={110} size={58} rot={-3} at={t.at('The Whigs agree') - 3} color="#ffffff" />
      {g >= t.at('has to go') && <Highlight text="VAN BUREN HAS TO GO" x={110} y={220} size={100} at={t.at('has to go')} seed={33} rot={-2} />}
      <Note text="banks" x={300} y={560} size={84} rot={-6} at={t.at('banks,', 2) - 3} />
      <Note text="taxes" x={880} y={500} size={84} rot={3} at={t.at('taxes,') - 3} />
      <Note text="roads" x={1400} y={600} size={84} rot={-4} at={t.at('roads,') - 3} />
      <Arrow x1={470} y1={600} x2={860} y2={560} bow={-40} at={t.at('they argue') - 2} color={pal.subject} />
      <Arrow x1={1050} y1={580} x2={1390} y2={640} bow={-40} at={t.at('they argue') + 1} color={pal.subject} />
      <Arrow x1={1420} y1={700} x2={480} y2={690} bow={-120} at={t.at('they argue') + 4} color={pal.subject} />
      <Note text="like relatives at a wedding" x={420} y={860} size={70} rot={-3} at={t.at('like relatives') - 3} color={pal.subject} />
    </Board>
  );
};

/** December 1839: the convention in Harrisburg. */
const Convention: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Board>
      <Note text="December 1839 · Harrisburg, Pennsylvania" x={110} y={110} size={56} rot={-3} at={t.at('December 1839.') - 3} color="#ffffff" />
      {g >= t.at('nominating convention') && <Highlight text="NOMINATING CONVENTION" x={110} y={220} size={100} at={t.at('nominating convention')} seed={35} rot={-2} />}
      <Definition term="nom·i·nat·ing con·ven·tion" def="a big party meeting to choose its candidate" at={t.at('a big meeting')} x={130} y={400} w={1300} />
      {Array.from({length: 9}).map((_, i) => <Person key={i} x={260 + i * 150} y={900} h={220} at={t.at('to choose') + i} color="#EDE7DC" />)}
      <Note text="delegates" x={1600} y={920} size={50} rot={-3} at={t.at('to choose') + 6} />
    </Board>
  );
};

/** Clay wants it; Clay has enemies; the Whigs pick someone nobody hates. */
const Clay: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const e = t.at('enemies.');
  return (
    <Board>
      <CropCard mask={MASKS.clay} src="img/ch02/henry_clay_duval.jpg" size={CLAY} x={170} y={170} w={560} h={740} fx={1190} fy={1250} scale={0.4} rot={2} at={1} traceAt={t.at('Henry Clay') + 2} />
      {g >= t.at('Henry Clay') && <Highlight text="HENRY CLAY" x={840} y={140} size={100} at={t.at('Henry Clay')} seed={37} rot={-2} />}
      <Note text="wants the job" x={860} y={320} size={64} rot={-3} at={t.at('wants the job') - 3} />
      <Note text="but: enemies" x={860} y={450} size={64} rot={-3} at={e - 3} color={pal.subject} />
      {[[100, 300], [90, 600], [760, 820], [740, 240], [430, 960]].map(([x, y], i) => (
        <Arrow key={i} x1={x < 400 ? x - 60 : x + 80} y1={y} x2={x < 400 ? x + 70 : x - 40} y2={y + 20} bow={20} at={e + 2 + i * 2} color={pal.subject} />
      ))}
      <Note text="so: someone nobody hates" x={860} y={620} size={64} rot={-3} at={t.at('So the Whigs') - 3} />
      <Loop cx={1210} cy={660} rx={390} ry={80} at={t.at('nobody hates') + 2} seed={39} tilt={-3} />
      <Tag text="Peter S. Duval, Henry Clay, 1844 · Library of Congress" />
    </Board>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <VanBuren t={t} />],
    [at('Two months') - 1, <Panic t={t} />],
    [at('That sudden') - 1, <Vocab t={t} />],
    [at('Whose fault') - 1, <Fault t={t} />],
    [at('And who are') - 1, <Whigs t={t} />],
    [at('The Whigs agree') - 1, <OneThing t={t} />],
    [at('December 1839.') - 1, <Convention t={t} />],
    [at('Their most famous') - 1, <Clay t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('1837.'), at('Martin Van Buren'), at('panic,'), at('depression,'), at('Van Ruin'), at('The Whigs.'), at('has to go'), at('nominating convention'), at('Henry Clay')]}
        writes={['his vice', 'Democrat,', 'Same name', 'very different', 'Two months', 'Banks close', 'Prices drop', 'People lose', 'lasts for', 'Whose fault', 'the guy in', 'And who are', 'A new party', 'The name comes', 'We have a whole', 'The Whigs agree', 'else, banks', 'taxes,', 'roads,', 'like relatives', 'December 1839.', 'wants the job', 'enemies.', 'So the Whigs'].map((p) => at(p))} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_hard_times.wav" lead={LEAD} music={[{src: 'music/j_intrigue.mp3', volume: 0.19}]}>
    <Body />
  </ChapterShell>
);
