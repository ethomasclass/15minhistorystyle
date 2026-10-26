// Chapter 8 · Who Freed Them?: the case for Lincoln, the case for the enslaved people themselves, the Greeley letter
// again, historians still argue; "One man signed his name"; a proclamation is not a law; the end screen.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch08_who_freed_them.words.json';
import data from '../../public/maps/civwar1861.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {Desk, DropCard, Sounds} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {Box, Checklist, CORAL, LETTER, LETTER_QUOTE, LETTER_TAG, NARA, NARA_TAG, READING, READING_TAG, SMALLS_1862_TAG, STAMPEDE, STAMPEDE_TAG, TwoSides, WHITE} from '../kit/ff';
import {BORDER_1861, type Cam3, CONFEDERACY_1861, MAP3D, Map3D, type MapData, StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {Backdrop, ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
/** The end screen: after the last word, this many frames more (YouTube's end-screen elements sit here). */
const EXTRA = 200;
export const CH08_FRAMES = chapterFrames(N, LEAD) + EXTRA;
const D = data as unknown as MapData;

const FOLLERS = 'img/ch02/contrabands_follers_house_cumberland_1862.jpg';
const MEN_54TH = 'img/ch07/emilio_plate_54th_soldiers_p64_1891.jpg';
const DRAWER = 'img/gen/v2_ch04_desk_drawer.jpg';
const STORMING = 'img/ch07/storming_fort_wagner_kurz_allison_1890.jpg';

/** Back to the question: who freed the enslaved people? */
const Back: React.FC<{t: TL}> = ({t}) => (
  <Desk a={-10}>
    <Backdrop src={STAMPEDE} size={sizeOf(STAMPEDE)} a={-10} dim={0.22} />
    <Note text="back to the question:" x={130} y={100} size={54} rot={-3} at={t.at("So let's") + 2} color={WHITE} />
    <Highlight text="WHO FREED THEM?" x={860} y={90} size={90} at={t.at('Who freed')} seed={801} rot={-2} />
    <TwoSides at={0} lincolnAt={t.at('Who freed') + 2} smallsAt={t.at('Who freed') + 10} />
    <Tag text={`${READING_TAG} · ${SMALLS_1862_TAG}`} />
  </Desk>
);

/** The case for Lincoln: he wrote it, risked his presidency on it, and turned the war into a war against slavery. */
const ForLincoln: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("Here's the case for Lincoln") - 1;
  return (
    <Desk a={a}>
      <CropCard src={READING} size={sizeOf(READING)} x={160} y={170} w={480} h={660} fx={1120} fy={1220} scale={0.56} rot={-2} at={a + 1} mask={MASKS.lincoln_reading}
        traceAt={a + 5} />
      <Highlight text="THE CASE FOR LINCOLN" x={760} y={110} size={70} at={t.at('case for Lincoln')} seed={803} rot={-2} />
      <Checklist x={770} y={310} gap={120} size={50} items={[
        {text: 'he wrote the Proclamation', at: t.at('He wrote') - 3},
        {text: 'he risked his presidency on it', at: t.at('He risked') - 3},
        {text: 'turned a war for the Union', at: t.at('And he turned') - 3},
      ]} />
      <Note text="into a war against slavery" x={870} y={650} size={54} rot={-2} at={t.at('war against') - 3} color={CORAL} />
      <Tag text={READING_TAG} />
    </Desk>
  );
};

/** The case for the enslaved people themselves: they escaped, forced the decision, then put on the uniform. */
const ForThem: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('case for the enslaved') - 4;
  return (
    <Desk a={a}>
      <DropCard src={FOLLERS} x={110} y={130} w={620} rot={-2} at={a + 2} />
      <DropCard src={MEN_54TH} x={330} y={560} w={300} rot={3} at={t.at('Then they put') - 2} />
      <Highlight text="THE CASE FOR THE ENSLAVED" x={790} y={110} size={56} at={t.at('case for the enslaved')} seed={805} rot={-2} />
      <Checklist x={800} y={300} gap={130} size={48} items={[
        {text: 'escaped by the thousands', at: t.at('They escaped') - 3},
        {text: 'forced generals and presidents', at: t.at('They forced') - 3},
        {text: 'put on the uniform', at: t.at('Then they put') - 3},
      ]} />
      <Note text="before Washington acted" x={900} y={370} size={42} rot={-2} at={t.at('before Washington') - 3} color={CORAL} />
      <Note text="to decide what to do with them" x={900} y={500} size={42} rot={-2} at={t.at('to decide') - 3} color={CORAL} />
      <Tag text="James Gibson, contrabands at Cumberland Landing, 1862 · enlisted men of the 54th, Emilio, 1891 · Library of Congress, Internet Archive" />
    </Desk>
  );
};

/** Remember the Greeley letter: written while the Proclamation was in his desk; he may have been preparing the country. */
const GreeleyAgain: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And remember') - 1;
  return (
    <Desk a={a}>
      <Doc src={LETTER} x={110} y={70} w={560} rot={-2} at={a + 1} marks={[{at: a + 6, to: a + 40, swipe: LETTER_QUOTE}]} />
      <Note text="remember the Greeley letter?" x={760} y={110} size={54} rot={-3} at={t.at('And remember') + 2} color={WHITE} />
      <Note text="written while the Proclamation" x={760} y={240} size={52} rot={-3} at={t.at('Lincoln wrote it') - 3} />
      <Note text="sat in his desk" x={780} y={330} size={58} rot={-3} at={t.at('sitting in') - 3} color={CORAL} />
      <Note text="he knew every paper would print it" x={760} y={470} size={50} rot={-3} at={t.at('He knew') - 3} color={WHITE} />
      <Note text="getting the country ready?" x={760} y={590} size={54} rot={-3} at={t.at('He may') - 3} color="#FF9F1C" />
      <DropCard src={DRAWER} x={1330} y={700} w={440} rot={3} at={t.at('sitting in') - 2} />
      <Tag text={`${LETTER_TAG} · illustration, a draft in a desk drawer`} />
    </Desk>
  );
};

/** Historians still argue: some say Lincoln, some the people who freed themselves, many say both. */
const Argue: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Historians') - 1;
  return (
    <Desk a={a}>
      <Backdrop src={READING} size={sizeOf(READING)} a={a} dim={0.26} />
      <Highlight text="HISTORIANS STILL ARGUE" x={130} y={100} size={80} at={t.at('Historians') + 2} seed={807} rot={-2} />
      <Box x={150} y={390} w={440} h={200} at={t.at('Some say Lincoln') - 2} label="LINCOLN" size={60} seed={31} />
      <Box x={690} y={390} w={540} h={200} at={t.at('Some say the') - 2} label="THE PEOPLE WHO FREED THEMSELVES" size={40} seed={33} color={CORAL} />
      <Box x={1320} y={390} w={440} h={200} at={t.at('Many say both') - 2} label="BOTH" size={72} seed={35} color="#f4efe6" />
      <Note text="the evidence gives each side something to hold onto" x={130} y={720} size={50} rot={-2} at={t.at('The evidence') - 3} color={WHITE} />
      <Tag text={READING_TAG} />
    </Desk>
  );
};

/** One man signed his name. */
const Signed: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('One man') - 1;
  return (
    <Desk a={a}>
      <CropCard src={NARA(5)} size={sizeOf(NARA(5))} x={260} y={150} w={1400} h={560} fx={1200} fy={700} scale={0.9} rot={-1} at={a + 1}>
        {(S) => {
          const [cx, cy] = S(1340, 765);
          return <Loop cx={cx} cy={cy} rx={300} ry={80} at={t.at('signed') - 2} seed={41} />;
        }}
      </CropCard>
      <Note text="one man signed his name" x={300} y={800} size={66} rot={-3} at={t.at('One man') + 2} color={WHITE} />
      <Tag text={`${NARA_TAG}, page 5`} />
    </Desk>
  );
};

/** Thousands of people, like Robert Smalls, didn't wait for him to. */
const DidntWait: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={STAMPEDE} px={sizeOf(STAMPEDE)} fx={1500} fy={1100} a={t.at('Thousands of') - 1} b={t.at('But a proclamation')} z0={1.08} z1={1.16} fade={6} tag={STAMPEDE_TAG}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.5) 26%, rgba(0,0,0,0) 40%)'}} />
        <Note text="thousands of people, like Robert Smalls," x={130} y={80} size={56} rot={-2} at={t.at('Thousands of') + 2} color={WHITE} />
        <Note text="didn't wait for him to" x={150} y={180} size={70} rot={-2} at={t.at("didn't wait") - 3} color={CORAL} />
      </>
    )}
  </Engraving>
);

/** But a proclamation is not a law. And the war still had to be won. */
const NotLaw: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('But a proclamation') - 1;
  return (
    <Desk a={a}>
      <Backdrop src={STORMING} size={sizeOf(STORMING)} a={a} dim={0.3} side="left" />
      <DropCard src={NARA(1)} x={1360} y={110} w={400} rot={3} at={a + 2} />
      <Note text="but a proclamation" x={130} y={180} size={60} rot={-3} at={t.at('But a proclamation') + 2} color={WHITE} />
      <Highlight text="IS NOT A LAW" x={130} y={290} size={110} at={t.at('not a law')} seed={809} rot={-2} />
      <Note text="and the war still had to be won" x={130} y={560} size={62} rot={-3} at={t.at('And the war') - 3} color={CORAL} />
      <Tag text={`${NARA_TAG} · Kurz & Allison, Storming Fort Wagner, 1890 · Library of Congress`} />
    </Desk>
  );
};

/** The end screen: the 1861 map drifting, two video slots, a subscribe circle, thanks. (YouTube's elements go on top.) */
const EndScreen: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Thanks') - 1;
  const k = interpolate(g, [a, a + 18], [0, 1], clamp);
  const keys: Cam3[] = [{f: a, x: 2900, y: 2500, z: 0.34, tilt: 40, rot: 0}, {f: a + 600, x: 2700, y: 2700, z: 0.38, tilt: 44, rot: -6}];
  const slot = (x: number, y: number, at: number) => (
    <div style={{position: 'absolute', left: x, top: y, width: 640, height: 360, border: `5px solid ${pal.mark}`, borderRadius: 10, background: 'rgba(10,10,10,0.55)',
      opacity: interpolate(g, [at, at + 10], [0, 1], clamp), boxShadow: '0 16px 30px rgba(0,0,0,0.5)'}} />
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `brightness(${1 - 0.55 * k})`}}>
        <Map3D data={D} keys={keys} states={0.5}>
          {(api) => (
            <>
              <StateTiles api={api} names={UNION_FREE_1861} at={-99} stagger={0} h={20} color={MAP3D.free} />
              <StateTiles api={api} names={BORDER_1861} at={-99} stagger={0} h={26} color={MAP3D.grey} />
              <StateTiles api={api} names={CONFEDERACY_1861} at={-99} stagger={0} h={56} color={CORAL} />
            </>
          )}
        </Map3D>
      </AbsoluteFill>
      {slot(130, 150, a + 6)}
      {slot(130, 590, a + 12)}
      <div style={{position: 'absolute', left: 1240, top: 170, width: 330, height: 330, borderRadius: '50%', border: `5px solid ${pal.mark}`, background: 'rgba(10,10,10,0.55)',
        opacity: interpolate(g, [a + 18, a + 28], [0, 1], clamp)}} />
      <Note text="thanks for watching" x={1060} y={580} size={62} rot={-3} at={a + 4} color={WHITE} />
      <Note text="next: how the war was decided" x={920} y={700} size={48} rot={-3} at={t.at('Next time') - 2} color={CORAL} />
      <Note text="+ the amendment that made freedom permanent" x={820} y={790} size={36} rot={-3} at={t.at('the amendment') - 3} color={CORAL} />
      <Note text="subscribe ↑" x={1290} y={880} size={54} rot={-3} at={t.at('Subscribe') - 2} />
      <Tag text="Map · the United States in 1861" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Back t={t} />],
    [at("Here's the case for Lincoln") - 1, <ForLincoln t={t} />],
    [at('case for the enslaved') - 4, <ForThem t={t} />],
    [at('And remember') - 1, <GreeleyAgain t={t} />],
    [at('Historians') - 1, <Argue t={t} />],
    [at('One man') - 1, <Signed t={t} />],
    [at('Thousands of') - 1, <DidntWait t={t} />],
    [at('But a proclamation') - 1, <NotLaw t={t} />],
    [at('Thanks') - 1, <EndScreen t={t} />],
  ];
  const writes = ["So let's", 'He wrote', 'He risked', 'And he turned', 'war against', 'They escaped', 'before Washington', 'They forced', 'to decide', 'Then they put',
    'And remember', 'Lincoln wrote it', 'sitting in', 'He knew', 'He may', 'The evidence', 'One man', 'Thousands of', "didn't wait", 'But a proclamation', 'And the war',
    'Next time', 'the amendment', 'Subscribe'].map((p) => at(p));
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map(([f]) => f)} stamps={[at('Who freed'), at('case for Lincoln'), at('case for the enslaved'), at('Historians') + 2, at('not a law')]} writes={writes}
        ticks={[at('Some say Lincoln') - 2, at('Some say the') - 2, at('Many say both') - 2]} extra={[{at: at('signed') - 2, src: 'sfx/quill.wav', volume: 0.35}]} />
    </>
  );
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_who_freed_them.wav" lead={LEAD} extra={EXTRA} music={[{src: 'music/r_dix.mp3', volume: 0.056}]}>
    <Body />
  </ChapterShell>
);
