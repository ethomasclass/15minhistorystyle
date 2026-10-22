// Chapter 6 · King Cotton Fails: the South's bet; Britain's stored cotton and new suppliers; Antietam ends the fall
// 1862 talk of stepping in; 1833 and the Proclamation; never recognized; "not king"; the mid-video subscribe.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch06_king_cotton.words.json';
import {Highlight, Note, Tag} from '../kit/Kit';
import {Desk, DropCard, Sounds} from '../kit/bs';
import {sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {Box, Checklist, CORAL, Cross, WHITE} from '../kit/ff';
import {Backdrop, ChapterShell, chapterFrames, CropCard, Definition, DrawnCrown, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

const COTTON = 'img/ch06/cotton_shipment_savannah_1865.jpg';
const COTTON_TAG = "Cotton on the wharf at Savannah, shipped for New York, Frank Leslie's, 1865 · Library of Congress";
const MILL = 'img/ch06/iln_cotton_famine_mill_page_1862-11-22.jpg';
const COVER = 'img/ch06/iln_cotton_famine_cover_relief_1862-11-22.jpg';
const RELIEF = 'img/ch06/iln_cotton_famine_relief_page_1862-11-22.jpg';
const PALMERSTON = 'img/ch06/palmerston_portrait_engraving_1866.jpg';
const GLADSTONE = 'img/ch06/gladstone_portrait_engraving_1866.jpg';

/** Remember the South's bet? King Cotton: Britain would need Southern cotton so badly it would step in. */
const Bet: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={COTTON} px={sizeOf(COTTON)} fx={1500} fy={900} a={-10} b={t.at("It didn't")} z0={1.35} z1={1.42} fade={6} tag={COTTON_TAG}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.88) 0%, rgba(10,9,7,0.6) 40%, rgba(0,0,0,0) 56%)'}} />
        <Note text="remember the South's bet?" x={130} y={80} size={54} rot={-3} at={t.at('Remember') - 2} color={WHITE} />
        <Highlight text="KING COTTON" x={130} y={180} size={110} at={t.at('King Cotton')} seed={601} rot={-2} />
        <Definition term="King Cot·ton" def="the bet that Britain needed Southern cotton so badly it would have to step in" at={t.at('Britain needed') - 2} x={130} y={380} w={1300} />
      </>
    )}
  </Engraving>
);

/** It didn't: Britain had stored up cotton, then bought more from Egypt and India. A new supplier. */
const Didnt: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("It didn't") - 1;
  return (
    <Desk a={a}>
      <Backdrop src={COTTON} size={sizeOf(COTTON)} a={a} dim={0.24} side="left" />
      <DropCard src={MILL} x={1330} y={70} w={450} rot={3} at={a + 2} />
      <Stamp text="IT DIDN'T." x={130} y={100} at={t.at("It didn't")} size={140} color={CORAL} rot={-2} />
      <Checklist x={130} y={340} gap={130} size={50} items={[
        {text: 'stored up extra cotton before the war', at: t.at('stored up') - 3},
        {text: 'bought more from Egypt and India', at: t.at('Egypt') - 6},
      ]} />
      <Note text="= a new supplier" x={210} y={660} size={66} rot={-3} at={t.at('new supplier') - 3} />
      <Tag text="The Cotton Famine, Illustrated London News, Nov. 22, 1862 · Internet Archive · Frank Leslie's, Savannah, 1865 · Library of Congress" />
    </Desk>
  );
};

/** Fall 1862: British leaders talk of stepping in; Antietam makes them back off. */
const Talks: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And in the fall') - 1;
  return (
    <Desk a={a}>
      <CropCard src={PALMERSTON} size={sizeOf(PALMERSTON)} x={170} y={120} w={520} h={740} fx={835} fy={1380} scale={0.36} rot={-2} at={a + 1} />
      <Note text="fall 1862:" x={820} y={130} size={56} rot={-3} at={t.at('And in the fall') + 2} color={WHITE} />
      <Note text="British leaders talk" x={820} y={240} size={54} rot={-3} at={t.at('British leaders') - 3} />
      <Note text="of stepping in" x={840} y={330} size={54} rot={-3} at={t.at('stepping in') - 3} />
      <Highlight text="ANTIETAM" x={810} y={460} size={110} at={t.at('Antietam made')} seed={603} rot={-2} />
      <Note text="→ they back off" x={830} y={650} size={66} rot={-3} at={t.at('back off') - 3} color={CORAL} />
      <Tag text="Viscount Palmerston, British prime minister, engraving, 1866 · Internet Archive" />
    </Desk>
  );
};

/** Britain ended slavery in most of its empire in 1833; the Proclamation made siding with a slave nation harder. */
const Empire: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Britain had ended') - 1;
  return (
    <Desk a={a}>
      <Backdrop src={MILL} size={sizeOf(MILL)} a={a} dim={0.22} side="left" />
      <DropCard src={COVER} x={1440} y={80} w={390} rot={3} at={a + 2} />
      <Stamp text="1833" x={130} y={110} at={t.at('1833') - 2} size={220} color="#f4efe6" rot={-2} />
      <Note text="Britain ends slavery in most of its empire" x={130} y={400} size={52} rot={-2} at={t.at('Britain had ended') + 2} color={WHITE} />
      <Note text="over time, the Proclamation:" x={130} y={580} size={50} rot={-2} at={t.at('Over time') - 3} />
      <Note text="harder to side with a nation fighting for slavery" x={130} y={700} size={50} rot={-2} at={t.at('harder') - 3} color={CORAL} />
      <Tag text="Illustrated London News, Nov. 22, 1862 · Internet Archive" />
    </Desk>
  );
};

/** Britain never officially recognized the Confederacy. */
const Never: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Britain never') - 1;
  return (
    <Desk a={a}>
      <Backdrop src={COTTON} size={sizeOf(COTTON)} a={a} dim={0.22} side="left" />
      <DropCard src={RELIEF} x={1340} y={90} w={440} rot={3} at={a + 2} />
      <Highlight text="NEVER RECOGNIZED" x={130} y={110} size={96} at={t.at('recognized')} seed={605} rot={-2} />
      <Definition term="rec·og·nize" def="to treat a country as a real country" at={t.at('meaning') - 2} x={130} y={290} w={1000} />
      <Box x={200} y={470} w={760} h={220} at={t.at('the Confederacy') - 2} label="THE CONFEDERACY" size={64} seed={27} color="#f4efe6" />
      <Cross x={430} y={450} at={t.at('never treated') - 2} s={3.6} />
      <Note text="not a real country, to Britain" x={200} y={760} size={54} rot={-3} at={t.at('real country') - 3} color={WHITE} />
      <Tag text="The Cotton Famine, Illustrated London News, Nov. 22, 1862 · Internet Archive" />
    </Desk>
  );
};

/** King Cotton, it turned out, was not king. */
const NotKing: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('King Cotton it') - 1;
  return (
    <Engraving src={COTTON} px={sizeOf(COTTON)} fx={1100} fy={850} a={a} b={t.at('Quick thing')} z0={1.7} z1={1.8} fade={6} quiet tag={COTTON_TAG}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'rgba(10,9,7,0.55)'}} />
          <DrawnCrown x0={760} x1={1160} y={420} h={130} at={a + 3} />
          <Highlight text="KING COTTON" x={560} y={470} size={120} at={a + 2} seed={607} rot={-2} />
          <Cross x={800} y={250} at={t.at('not king') - 2} s={3.4} />
          <Note text="was not king" x={760} y={720} size={80} rot={-3} at={t.at('not king') - 3} color={CORAL} />
        </>
      )}
    </Engraving>
  );
};

/** Quick thing: subscribe. Unlike the British cabinet, you don't need a whole autumn to decide. */
const Subscribe: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Quick thing') - 1;
  const u = t.at('unlike the British') - 2;
  return (
    <Desk a={a}>
      <Backdrop src={COVER} size={sizeOf(COVER)} a={a} dim={0.22} side="left" />
      <Note text="quick thing, before the soldiers:" x={130} y={90} size={54} rot={-3} at={t.at('Quick thing') + 2} color={WHITE} />
      <Box x={140} y={270} w={560} h={170} at={t.at('subscribe') - 2} label="SUBSCRIBE" size={84} seed={29} color={CORAL} fill="rgba(255,111,97,0.18)" />
      <Note text="it's free, and it really helps" x={140} y={500} size={54} rot={-3} at={t.at("It's free") - 3} />
      <Note text="unlike the British cabinet," x={140} y={660} size={54} rot={-3} at={u} color={WHITE} />
      <Note text="you don't need a whole autumn" x={160} y={760} size={58} rot={-3} at={t.at('whole autumn') - 3} color={CORAL} />
      <DropCard src={PALMERSTON} x={1130} y={130} w={320} rot={-3} at={u} />
      <DropCard src={GLADSTONE} x={1490} y={170} w={300} rot={3} at={u + 4} />
      <Tag text="Palmerston and Gladstone, engravings, 1866 · Internet Archive" />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Bet t={t} />],
    [at("It didn't") - 1, <Didnt t={t} />],
    [at('And in the fall') - 1, <Talks t={t} />],
    [at('Britain had ended') - 1, <Empire t={t} />],
    [at('Britain never') - 1, <Never t={t} />],
    [at('King Cotton it') - 1, <NotKing t={t} />],
    [at('Quick thing') - 1, <Subscribe t={t} />],
  ];
  const writes = ['Remember', 'stored up', 'Egypt', 'new supplier', 'And in the fall', 'British leaders', 'back off', 'Britain had ended', 'Over time', 'harder', 'real country',
    'not king', 'Quick thing', "It's free", 'unlike the British', 'whole autumn'].map((p) => at(p));
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map(([f]) => f)} stamps={[at('King Cotton'), at("It didn't"), at('Antietam made'), at('1833') - 2, at('recognized'), at('King Cotton it') + 1]} writes={writes}
        ticks={[at('subscribe') - 2, at('unlike the British') - 2]} extra={[{at: at('never treated') - 2, src: 'sfx/smash.wav', volume: 0.2}, {at: at('not king') - 2, src: 'sfx/smash.wav', volume: 0.22}]} />
    </>
  );
};

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_king_cotton.wav" lead={LEAD} music={[{src: 'music/g_cotton_engine.mp3', volume: 0.079}]}>
    <Body />
  </ChapterShell>
);
