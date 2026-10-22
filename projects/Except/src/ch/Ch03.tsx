// Chapter 3 · A New Birth of Freedom: the cemetery at Gettysburg, two hours vs two minutes, "Four score and seven
// years ago" = 1776 and the Declaration, "a new birth of freedom", what changed, and the five handwritten copies.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch03_new_birth.words.json';
import {Highlight, Note, Tag} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Desk, DropCard, SyncQuote} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {CORAL, ORANGE, TwoViews, WHITE} from '../kit/except';
import {Backdrop, ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

const CROWD = 'img/ch03/lincoln_gettysburg_crowd_1863.jpg';
const EVERETT = 'img/ch03/edward_everett_sartain_1861.jpg';
const BLISS1 = 'img/ch03/gettysburg_address_bliss_copy_p1_facsimile_1909.jpg';
const BLISS2 = 'img/ch03/gettysburg_address_bliss_copy_p2_facsimile_1909.jpg';
const HAY1 = 'img/ch03/gettysburg_address_hay_copy_p1_facsimile_1909.jpg';
const DECL = 'img/ch03/declaration_independence_facsimile_1903.jpg';
const DEDICATION = 'img/ch03/cemetery_dedication_gardner_1863.jpg';
const BLISS_TAG = 'The Gettysburg Address in Lincoln\'s hand (Bliss copy), facsimile in Lambert, The Gettysburg Address, 1909 · Internet Archive';
const DOC = 'grayscale(1) sepia(0.3) contrast(1.12)';

/** November 1863: Lincoln at Gettysburg, somewhere in this crowd. */
const Crowd: React.FC<{t: TL}> = ({t}) => (
  <Photo src={CROWD} size={sizeOf(CROWD)} fx={1500} fy={820} z0={1.05} z1={1.16} a={-10} b={t.at('The main')} bw="grayscale(1) contrast(1.2) brightness(0.95)">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.55) 0%, rgba(0,0,0,0) 30%)'}} />
        <Highlight text="NOVEMBER 1863" x={110} y={90} size={86} at={t.at('November') - 1} seed={31} rot={-2} />
        <Note text="Lincoln travels to Gettysburg" x={130} y={240} size={52} rot={-3} at={t.at('Lincoln traveled') - 2} />
        <Note text="to dedicate a cemetery for the Union dead" x={150} y={350} size={48} rot={-3} at={t.at('dedicate') - 2} color={WHITE} />
        <Note text="(Lincoln is somewhere in this crowd)" x={130} y={900} size={44} rot={-2} at={t.at('Union dead') + 6} color={WHITE} />
        <Tag text="The crowd at the cemetery dedication, Gettysburg, November 19, 1863 · Library of Congress" x={44} y={1030} />
      </>
    )}
  </Photo>
);

/** About two hours vs about two minutes. */
const TwoSpeeches: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('The main') - 1;
  return (
    <AbsoluteFill>
      <Backdrop src={CROWD} size={sizeOf(CROWD)} a={a} dim={0.3} />
      <TwoViews a={a} left="THE MAIN SPEAKER" right="LINCOLN" leftAt={a + 1} rightAt={t.at('Lincoln spoke') - 2} />
      <CropCard src={EVERETT} size={sizeOf(EVERETT)} x={180} y={170} w={420} h={520} fx={1300} fy={1200} scale={0.33} rot={-2} at={a + 1} mask={MASKS.everett} tintStrength={0.5} traceAt={a + 8} />
      <Stamp text="2 hours" x={180} y={770} at={t.at('two hours') - 1} size={110} color={WHITE} rot={-3} />
      <DropCard src={BLISS1} x={1120} y={160} w={350} rot={2} at={t.at('Lincoln spoke') - 2} filter={DOC} />
      <Stamp text="2 minutes" x={1060} y={770} at={t.at('two minutes') - 1} size={110} color={CORAL} rot={-3} />
      <Note text="about 270 words" x={1540} y={400} size={46} rot={-4} at={t.at('270') - 2} />
      <Note text="guess which one students still memorize" x={420} y={935} size={44} rot={-2} at={t.at('Guess') - 2} color={WHITE} />
      <Tag text="John Sartain, Edward Everett, mezzotint, 1861 · Library of Congress · Bliss copy, facsimile, 1909 · Internet Archive" x={44} y={40} />
    </AbsoluteFill>
  );
};

/** "Four score and seven years ago": the arithmetic lands on 1776. */
const FourScore: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('He started') - 1;
  const w = 1180;
  const sc = w / sizeOf(BLISS1)[0];
  return (
    <Desk a={a} push={0.03}>
      <Doc src={BLISS1} x={660} y={360 - 1600 * sc} w={w} rot={1} at={a} push={[a, t.at('Not the')]} fx={1100} fy={1600} zoom={1.08}
        marks={[{at: t.at('Four score'), to: t.end('ago'), swipe: [[400, 1555, 1850, 1660]]}]} />
      <Note text="he starts with a date" x={110} y={120} size={44} rot={-3} at={a + 2} color={WHITE} />
      <Note text="a score = 20" x={110} y={420} size={54} rot={-3} at={t.at('A score') - 2} />
      <Note text="4 × 20 + 7 = 87" x={110} y={560} size={54} rot={-3} at={t.at('87') - 2} />
      <Note text="1863 − 87 =" x={110} y={700} size={54} rot={-3} at={t.at('1776') - 6} color={WHITE} />
      <Highlight text="1776" x={120} y={810} size={100} at={t.at('1776')} seed={32} rot={-2} />
      <Tag text={BLISS_TAG} />
    </Desk>
  );
};

/** Not the Constitution: the Declaration, "all men are created equal". */
const Declaration: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Not the') - 1;
  return (
    <Desk a={a} push={0.03}>
      <DropCard src={DECL} x={1170} y={110} w={600} rot={2} at={t.at('The Declaration') - 2} filter={DOC} />
      <Note text="not the Constitution" x={110} y={110} size={56} rot={-3} at={a + 2} color={ORANGE} />
      <Note text="the Declaration of Independence" x={130} y={250} size={52} rot={-3} at={t.at('The Declaration') - 2} />
      <Note text="and its promise:" x={150} y={380} size={46} rot={-3} at={t.at('promise') - 2} color={WHITE} />
      <SyncQuote t={t} phrase="all men are created equal." x={150} y={500} w={950} size={84} />
      <Tag text="Official facsimile of the Declaration of Independence, 1903 print (later print) · Library of Congress" />
    </Desk>
  );
};

/** What the living owed the dead: "a new birth of freedom". */
const NewBirth: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Then he said') - 1;
  const w = 1180;
  const sc = w / sizeOf(BLISS2)[0];
  return (
    <Desk a={a} push={0.03}>
      <Doc src={BLISS2} x={660} y={420 - 3440 * sc} w={w} rot={-1} at={a} push={[a, t.at('Notice')]} fx={1400} fy={3440} zoom={1.08}
        marks={[{at: t.at('a new birth') - 2, to: t.end('freedom'), swipe: [[1590, 3388, 2405, 3472], [425, 3500, 570, 3574]]}]} />
      <Note text="what the living" x={110} y={120} size={48} rot={-3} at={t.at('what the living') - 2} color={WHITE} />
      <Note text="owed the dead:" x={130} y={220} size={48} rot={-3} at={t.at('owed') - 2} color={WHITE} />
      <SyncQuote t={t} phrase="a new birth of freedom." x={110} y={640} w={560} size={78} />
      <Tag text={BLISS_TAG} />
    </Desk>
  );
};

/** What changed: 1861, hold the Union together; 1863, finish what 1776 started. */
const Changed: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Notice') - 1;
  return (
    <AbsoluteFill>
      <Backdrop src={DEDICATION} size={sizeOf(DEDICATION)} a={a} dim={0.26} />
      <Note text="notice what changed" x={110} y={50} size={52} rot={-2} at={a + 2} color={WHITE} />
      <TwoViews a={a} left="TWO YEARS EARLIER" right="NOW" top={190} leftAt={t.at('Two years') - 2} rightAt={t.at('Now Lincoln') - 2} />
      <Stamp text="1861" x={170} y={270} at={t.at('Two years') - 1} size={170} color={WHITE} rot={-3} />
      <Note text="the war is about" x={180} y={520} size={50} rot={-3} at={t.at('the war was') - 2} color={WHITE} />
      <Note text="holding the Union together" x={180} y={630} size={56} rot={-3} at={t.at('holding') - 2} />
      <Stamp text="1863" x={1060} y={270} at={t.at('Now Lincoln') - 1} size={170} color={CORAL} rot={-3} />
      <Note text="finishing what" x={1070} y={520} size={56} rot={-3} at={t.at('finishing') - 2} color={WHITE} />
      <Highlight text="1776" x={1080} y={620} size={92} at={t.at('1776', 2)} seed={33} rot={-2} />
      <Note text="started" x={1420} y={640} size={56} rot={-3} at={t.at('started', 2) - 2} color={WHITE} />
      <DropCard src={DEDICATION} x={1080} y={790} w={520} rot={2} at={t.at('Now Lincoln') + 6} />
      <DropCard src={DECL} x={260} y={790} w={150} rot={-3} at={t.at('Two years') + 6} filter={DOC} />
      <Tag text="Alexander Gardner, dedication ceremonies, Gettysburg, 1863 · Library of Congress" x={44} y={1030} />
    </AbsoluteFill>
  );
};

/** Five handwritten copies, no two alike. Which is the real speech? */
const Copies: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Five copies') - 1;
  return (
    <Desk a={a} push={0.03}>
      <DropCard src={BLISS1} x={300} y={180} w={420} rot={-3} at={a + 1} filter={DOC} />
      <DropCard src={HAY1} x={1200} y={190} w={420} rot={3} at={a + 5} filter={DOC} />
      <Note text="5 copies in Lincoln's handwriting survive" x={110} y={60} size={48} rot={-2} at={a + 2} color={WHITE} />
      <Note text="no two" x={850} y={400} size={56} rot={-4} at={t.at('no two') - 2} color={CORAL} />
      <Note text="exactly alike" x={790} y={500} size={50} rot={-4} at={t.at('exactly') - 2} color={CORAL} />
      <Note text="so which one is the real speech?" x={110} y={880} size={48} rot={-2} at={t.at('So which') - 2} />
      <Note text="no recording, and the reporters wrote it down differently" x={330} y={960} size={42} rot={-1} at={t.at('There was no') - 2} color={WHITE} />
      <Tag text="Two of Lincoln's handwritten copies, facsimiles in Lambert, The Gettysburg Address, 1909 · Internet Archive" x={44} y={30} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Crowd t={t} />],
    [at('The main') - 1, <TwoSpeeches t={t} />],
    [at('He started') - 1, <FourScore t={t} />],
    [at('Not the') - 1, <Declaration t={t} />],
    [at('Then he said') - 1, <NewBirth t={t} />],
    [at('Notice') - 1, <Changed t={t} />],
    [at('Five copies') - 1, <Copies t={t} />],
  ];
  const writes = ['Lincoln traveled', 'dedicate', '270', 'Guess', 'A score', '87', 'The Declaration', 'promise', 'what the living', 'the war was', 'holding', 'finishing',
    'no two', 'So which', 'There was no'];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['November', 'two hours', 'two minutes', '1776'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/stamp.wav" volume={0.26} />)}
      <Sfx at={at('1776', 2) - 1} src="sfx/stamp.wav" volume={0.26} />
      <Sfx at={at('Two years') - 1} src="sfx/stamp.wav" volume={0.22} />
      <Sfx at={at('Now Lincoln') - 1} src="sfx/stamp.wav" volume={0.22} />
      {writes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume} />)}
      {[at('Lincoln spoke') - 2, at('Five copies'), at('Five copies') + 4].map((f, i) => <Sfx key={`p${i}`} at={f} src="sfx/page_turn.wav" volume={0.35} />)}
      <Sfx at={at('Four score') - 2} src="sfx/marker_tick.wav" volume={0.2} />
      <Sfx at={at('a new birth') - 2} src="sfx/marker_tick.wav" volume={0.2} />
    </>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_new_birth.wav" lead={LEAD} music={[{src: 'music/g_world_outside.mp3', volume: 0.077}]}>
    <Body />
  </ChapterShell>
);
