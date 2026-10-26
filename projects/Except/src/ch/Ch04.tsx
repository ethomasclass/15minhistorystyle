// Chapter 4 · Who Carried the War? (quiet): the drafts, the $300 and the substitute, the twenty-slave exemption, "a rich
// man's war", the New York draft riots and the Colored Orphan Asylum, the South's blockade and printed money, the Richmond
// bread riot. Quiet palette: teal lines, bone titles, no coral, no jokes, long holds.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch04_who_carried.words.json';
import {Highlight, Loop, Note, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Desk, DropCard, SyncQuote} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {BONE, WHITE} from '../kit/except';
import {Person} from '../kit/figures';
import {Backdrop, ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene} from '../kit/shell';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

const QUIET = 'grayscale(1) contrast(1.12) brightness(0.9)';
const DIM = 'grayscale(1) contrast(1.15) brightness(0.5)';
const ILN = 'img/ch04/conscription_in_new_york_ILN_1863.jpg';
const LOTTERY = 'img/ch04/draft_lottery_provost_marshal_1863.jpg';
const SUBST = 'img/ch04/wanted_a_substitute_sheet_music_1863.jpg';
const BROKERS = 'img/ch04/bounty_brokers_substitutes_1864.jpg';
const OFFICE = 'img/ch04/draft_office_burning_headley_1873_rot.jpg';
const ASYLUM = 'img/ch04/draft_riots_orphan_asylum_burning_1863.jpg';
const ASYLUM2 = 'img/ch04/draft_riots_orphan_asylum_later_print.jpg';
const MONEY = 'img/ch04/confederate_currency_plate_1875.jpg';
const MONEY2 = 'img/ch04/confederate_currency_plate_alt_1875.jpg';
const BREAD = 'img/gen/v3_ch04_bread_riot.jpg';
const DOC = 'grayscale(1) sepia(0.3) contrast(1.12)';
const ASYLUM_TAG = "The rioters burning and sacking the Colored Orphan Asylum, Harper's Weekly, Aug. 1, 1863 · Library of Congress";

/** Both sides were running out of volunteers. */
const Volunteers: React.FC<{t: TL}> = ({t}) => (
  <Photo src={ILN} size={sizeOf(ILN)} fx={760} fy={560} z0={1.04} z1={1.12} a={-10} b={t.at('In 1862')} bw={QUIET}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.7) 26%, rgba(0,0,0,0) 44%)'}} />
        <Note text="meanwhile: both sides are running out of volunteers" x={110} y={880} size={50} rot={-2} at={t.at('running out') - 3} color={BONE} />
        <Tag text="The conscription in New York, Illustrated London News, 1863 · Library of Congress" x={44} y={40} />
      </>
    )}
  </Photo>
);

/** The draft: the Confederacy first (1862), then the Union (1863). */
const Draft: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In 1862') - 1;
  return (
    <Desk a={a} push={0.02}>
      <DropCard src={LOTTERY} x={1080} y={170} w={720} rot={2} at={a + 2} filter={QUIET} />
      <Highlight text="DRAFT" x={110} y={110} size={100} at={t.at('draft')} seed={41} rot={-2} />
      <Definition term="draft" def="a law requiring men to serve" at={t.at('a law') - 1} x={120} y={290} w={800} />
      <Note text="1862: the Confederacy" x={130} y={480} size={58} rot={-3} at={a + 2} />
      <Note text="the first in American history" x={150} y={590} size={48} rot={-3} at={t.at('first in') - 2} color={WHITE} />
      <Note text="1863: the Union" x={130} y={740} size={58} rot={-3} at={t.at('The Union started') - 2} />
      <Tag text="Resumption of the draft, inside the Provost Marshal's office, New York, 1863 · Library of Congress" />
    </Desk>
  );
};

/** The Union's catch: $300, or a substitute. */
const Catch: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("But the Union's") - 1;
  return (
    <Desk a={a} push={0.02}>
      <DropCard src={SUBST} x={1180} y={130} w={600} rot={3} at={t.at('substitute') - 3} filter={DOC} />
      <Note text="the Union's draft had a catch" x={140} y={100} size={52} rot={-3} at={a + 2} color={WHITE} />
      <Stamp text="$300" x={140} y={230} at={t.at('300') - 1} size={200} color={BONE} rot={-3} />
      <Note text="to get out of it" x={720} y={300} size={52} rot={-3} at={t.at('to get out') - 2} />
      <Note text="roughly a year's pay for a laborer" x={130} y={490} size={52} rot={-3} at={t.at("a year's") - 2} color={WHITE} />
      <Note text="or hire a substitute:" x={130} y={660} size={58} rot={-3} at={t.at('Or he could') - 2} />
      <Note text="someone paid to go in his place" x={150} y={780} size={50} rot={-3} at={t.at('someone paid') - 2} color={WHITE} />
      <Tag text="Wanted a Substitute, sheet music cover, Oliver Ditson, 1863 · Library of Congress" />
    </Desk>
  );
};

/** In the South: one white man per plantation with 20 or more enslaved people could be excused. */
const Exemption: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('In the South') - 1;
  const show = t.at('20 or more') - 2;
  return (
    <AbsoluteFill>
      <Backdrop src={BROKERS} size={sizeOf(BROKERS)} fx={750} a={a} dim={0.24} side="left" />
      <Note text="in the South:" x={110} y={90} size={56} rot={-3} at={a + 2} color={WHITE} />
      <Note text="one white man on any plantation" x={130} y={200} size={52} rot={-3} at={t.at('one white') - 2} />
      <Note text="with 20 or more enslaved people" x={150} y={310} size={52} rot={-3} at={show} />
      <Note text="could be excused too" x={170} y={430} size={58} rot={-3} at={t.at('excused') - 2} color={BONE} />
      <Person x={1080} y={760} h={190} at={t.at('one white') - 2} hat />
      {g >= t.at('excused') && <Loop cx={1080} cy={665} rx={110} ry={150} at={t.at('excused') - 1} seed={42} tilt={-4} />}
      {Array.from({length: 20}).map((_, i) => (
        <Person key={i} x={1290 + (i % 5) * 110} y={560 + Math.floor(i / 5) * 130} h={100} at={show + Math.floor(i / 5) * 2} hat={false} dashed color="rgba(237,231,220,0.7)" />
      ))}
      <Note text="20" x={1500} y={900} size={56} rot={-3} at={show + 6} color={BONE} />
      <Tag text="Diagram · the Confederate exemption of October 1862" />
    </AbsoluteFill>
  );
};

/** "A rich man's war and a poor man's fight." */
const RichMans: React.FC<{t: TL}> = ({t}) => (
  <Photo src={BROKERS} size={sizeOf(BROKERS)} fx={750} fy={760} z0={1.25} z1={1.33} a={t.at('People called') - 1} b={t.at('In July')} bw={DIM}>
    {() => (
      <>
        <Note text="people called it" x={150} y={230} size={52} rot={-3} at={t.at('People called') + 1} color={WHITE} />
        <SyncQuote t={t} phrase="a rich man's war and a poor man's fight." x={150} y={360} w={1500} size={84} />
        <Tag text="Bounty brokers looking out for substitutes, City Hall Park, New York, stereograph, c. 1864 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** July 1863: the draft begins in New York, and the city explodes. */
const NewYork: React.FC<{t: TL}> = ({t}) => (
  <Photo src={LOTTERY} size={sizeOf(LOTTERY)} fx={760} fy={480} z0={1.02} z1={1.1} a={t.at('In July') - 1} b={t.at('Rioters, many')} bw={QUIET}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.7) 30%, rgba(0,0,0,0) 48%)'}} />
        <Highlight text="JULY 1863" x={110} y={700} size={80} at={t.at('In July')} seed={43} rot={-2} />
        <Note text="days after Gettysburg, the draft begins in New York City" x={130} y={850} size={46} rot={-2} at={t.at('just days') - 2} color={BONE} />
        <Note text="the city explodes" x={1200} y={720} size={58} rot={-3} at={t.at('exploded') - 2} />
        <Tag text="Resumption of the draft, the wheel being turned, New York, 1863 · Library of Congress" x={44} y={40} />
      </>
    )}
  </Photo>
);

/** Rioters attack the draft offices (Headley's 1873 engraving). */
const Offices: React.FC<{t: TL}> = ({t}) => (
  <Photo src={OFFICE} size={sizeOf(OFFICE)} fx={2260} fy={1500} z0={1.05} z1={1.12} a={t.at('Rioters, many') - 1} b={t.at('Then they')} bw={QUIET}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.5) 24%, rgba(0,0,0,0) 40%)'}} />
        <Note text="rioters, many of them poor Irish immigrant workers" x={110} y={90} size={48} rot={-2} at={t.at('Rioters, many')} color={BONE} />
        <Note text="attack draft offices" x={130} y={200} size={58} rot={-3} at={t.at('attacked') - 2} />
        <Tag text="Burning of the Provost-Marshal's office, in Headley, The Great Riots of New York, 1873 (later depiction) · Internet Archive" />
      </>
    )}
  </Photo>
);

/** Then they turned on Black New Yorkers. */
const Turned: React.FC<{t: TL}> = ({t}) => (
  <Photo src={ASYLUM} size={sizeOf(ASYLUM)} fx={1500} fy={1450} z0={1.3} z1={1.36} a={t.at('Then they') - 1} b={t.at('Rioters burned')} bw={QUIET} vignette={0.75}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.5) 24%, rgba(0,0,0,0) 40%)'}} />
        <Note text="then they turned on Black New Yorkers" x={110} y={90} size={52} rot={-2} at={t.at('Then they') + 1} color={BONE} />
        <Note text="they feared freed people would compete for their jobs" x={130} y={210} size={44} rot={-2} at={t.at('feared') - 2} />
        <Tag text={ASYLUM_TAG} />
      </>
    )}
  </Photo>
);

/** The orphanage burned; the children escaped; at least 119 killed in four days. */
const Orphanage: React.FC<{t: TL}> = ({t}) => (
  <Photo src={ASYLUM} size={sizeOf(ASYLUM)} fx={1500} fy={1100} z0={1.18} z1={1.26} a={t.at('Rioters burned') - 1} b={t.at('The South was')} bw={QUIET} vignette={0.75}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.7) 30%, rgba(0,0,0,0) 50%)'}} />
        <Note text="an orphanage for Black children, burned" x={110} y={640} size={52} rot={-2} at={t.at('Rioters burned') + 1} color={BONE} />
        <Note text="the children escaped" x={130} y={760} size={58} rot={-2} at={t.at('The children') - 2} />
        <Stamp text="119" x={1280} y={640} at={t.at('119') - 1} size={180} color={BONE} rot={-3} />
        <Note text="at least, killed in four days" x={1080} y={850} size={44} rot={-2} at={t.at('four days') - 2} color={WHITE} />
        <Tag text={ASYLUM_TAG} x={44} y={40} />
      </>
    )}
  </Photo>
);

/** The South suffers too: the blockade, printed money, prices soar. */
const Money: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('The South was') - 1;
  return (
    <Desk a={a} push={0.02}>
      <Doc src={MONEY} x={130} y={110} w={540} rot={-2} at={t.at('printed') - 2} />
      <DropCard src={MONEY2} x={470} y={400} w={400} rot={4} at={t.at('printed') + 6} filter={DOC} />
      <Note text="the South was suffering too" x={980} y={100} size={50} rot={-3} at={a + 2} color={WHITE} />
      <Note text="the blockade chokes off supplies" x={1000} y={210} size={46} rot={-3} at={t.at('blockade') - 2} />
      <Note text="the government prints money" x={1000} y={330} size={46} rot={-3} at={t.at('printed') - 2} />
      <Note text="but printing money" x={1000} y={430} size={44} rot={-3} at={t.at('But printing') - 2} color={WHITE} />
      <Note text="doesn't grow more food" x={1020} y={510} size={44} rot={-3} at={t.at('grow') - 2} color={WHITE} />
      <Note text="more dollars, the same bread" x={1000} y={620} size={52} rot={-3} at={t.at('More dollars') - 2} />
      <Note text="each dollar buys less" x={1000} y={720} size={52} rot={-3} at={t.at('each dollar') - 2} color={WHITE} />
      <Highlight text="PRICES SOAR" x={1000} y={830} size={78} at={t.at('soared') - 1} seed={44} rot={-2} />
      <Tag text="Confederate notes, plates in Currency of the Confederate States, 1875 · Internet Archive" />
    </Desk>
  );
};

/** April 1863: hungry women in Richmond demand bread. */
const Bread: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={BREAD} px={sizeOf(BREAD)} fx={600} fy={360} a={t.at('In April') - 1} b={t.at('Who carried')} z0={1.0} z1={1.07} fade={6} quiet
    tag="Illustration · the Richmond bread riot, April 1863">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.8) 0%, rgba(10,9,7,0.4) 22%, rgba(0,0,0,0) 36%)'}} />
        <Note text="Richmond, April 1863" x={110} y={80} size={54} rot={-3} at={t.at('In April') + 1} color={BONE} />
        <Note text="hungry women break into shops, demanding bread" x={130} y={190} size={46} rot={-2} at={t.at('hungry') - 2} />
      </>
    )}
  </Engraving>
);

/** Who carried the war? */
const WhoCarried: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Who carried') - 1;
  return (
    <Desk a={a} push={0.02}>
      <DropCard src={SUBST} x={150} y={150} w={400} rot={-3} at={a + 1} filter={DOC} />
      <DropCard src={ASYLUM2} x={690} y={190} w={560} rot={2} at={a + 4} filter={QUIET} />
      <DropCard src={BREAD} x={1350} y={170} w={450} rot={-2} at={a + 7} filter={QUIET} />
      <Note text="who carried the war?" x={150} y={720} size={64} rot={-3} at={a + 2} color={WHITE} />
      <Note text="often, the people with the least say in it" x={180} y={850} size={56} rot={-2} at={t.at('Often') - 2} />
      <Tag text="Wanted a Substitute, 1863 · the Colored Orphan Asylum, later print · Library of Congress · Illustration · the Richmond bread riot" />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Volunteers t={t} />],
    [at('In 1862') - 1, <Draft t={t} />],
    [at("But the Union's") - 1, <Catch t={t} />],
    [at('In the South') - 1, <Exemption t={t} />],
    [at('People called') - 1, <RichMans t={t} />],
    [at('In July') - 1, <NewYork t={t} />],
    [at('Rioters, many') - 1, <Offices t={t} />],
    [at('Then they') - 1, <Turned t={t} />],
    [at('Rioters burned') - 1, <Orphanage t={t} />],
    [at('The South was') - 1, <Money t={t} />],
    [at('In April') - 1, <Bread t={t} />],
    [at('Who carried') - 1, <WhoCarried t={t} />],
  ];
  const writes = ['running out', 'first in', 'The Union started', 'to get out', "a year's", 'Or he could', 'someone paid', 'one white', '20 or more', 'excused', 'just days', 'exploded',
    'attacked', 'feared', 'The children', 'four days', 'blockade', 'printed', 'But printing', 'More dollars', 'each dollar', 'hungry', 'Often'];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {['draft', '300', 'In July', '119', 'soared'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/stamp.wav" volume={0.2} />)}
      {writes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume * 0.8} />)}
      <Sfx at={at('substitute') - 3} src="sfx/page_turn.wav" volume={0.3} />
    </>
  );
};

export const Ch04: React.FC = () => {
  return (
    <ChapterShell n={N} audio="audio/ch04_who_carried.wav" lead={LEAD} quiet music={[
      // r_dix's first ~45 s (grave piano and cello), dropped before its hopeful rise; silence under the riots;
      // then its opening again, quietly, for the South's suffering and the question at the end
      {src: 'music/r_dix.mp3', volume: 0.056, to: makeTimeline(N, 30).at('They resented'), fadeOut: 60},
      {src: 'music/r_dix.mp3', volume: 0.05, from: makeTimeline(N, 30).at('The South was') - 10},
    ]}>
      <Body />
    </ChapterShell>
  );
};
