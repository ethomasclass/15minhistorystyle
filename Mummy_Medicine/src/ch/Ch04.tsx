// Chapter 4 · The Fakes: supply and demand, the Alexandria dealer (1564), the plague question, "aged four years",
// Pomet's Venice and Lyon, made in France, and fish bait.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch04_the_fakes.words.json';
import {Arrow, Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Pin} from '../kit/map';
import {Bed, MedMap, PLACES, Sketch, SupplyChart} from '../draw';
import {Jar} from '../jar';
import {IMG} from '../images';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

/** Supply falls, demand doesn't; the gap fills with fakes. */
const Supply: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('one problem') && <Highlight text="ONE PROBLEM" x={120} y={90} size={96} at={t.at('one problem')} seed={41} rot={-2} />}
      <Note text="only so many ancient dead" x={140} y={240} size={52} rot={-3} at={t.at('only had')} color="#ffffff" />
      <Note text="+ Egypt restricts the trade" x={140} y={330} size={52} rot={-3} at={t.at('restrict')} color="#ffffff" />
      <SupplyChart x={980} y={300} w={760} h={560} at={t.at('restrict') + 6} supplyAt={t.at('Supply went')} demandAt={t.at('Demand')} gapAt={t.at('made more')} />
      <Note text="demand" x={1580} y={250} size={50} rot={-3} at={t.at('Demand')} color="#FF9F1C" />
      <Note text="supply" x={1600} y={760} size={50} rot={-3} at={t.at('Supply went')} />
      <Note text="the dealers' fix:" x={140} y={560} size={56} rot={-3} at={t.at('So the dealers')} color="#ffffff" />
      <Note text="make more." x={200} y={670} size={100} rot={-4} at={t.at('made more')} color={pal.subject} />
      <Note text="fakes" x={1250} y={410} size={64} rot={-4} at={t.at('made more') + 8} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** 1564, Alexandria: the royal physician arrives. */
const Alexandria: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.alexandriaMap.src} size={IMG.alexandriaMap.size} fx={1920} fy={1400} z0={1.02} z1={1.12} a={t.at('In 1564') - 1} b={t.at('The dealer showed')}>
    {() => (
      <>
        <Highlight text="1564" x={110} y={90} size={110} at={t.at('In 1564')} seed={42} rot={-2} />
        <Note text="Guy de la Fontaine" x={110} y={250} size={60} rot={-3} at={t.at('Guy')} color="#ffffff" />
        <Note text="a French royal physician" x={130} y={350} size={50} rot={-3} at={t.at('Guy') + 6} />
        <Note text="visits a mummy dealer" x={1200} y={880} size={56} rot={-4} at={t.at('visited')} />
        <Tag text="Braun & Hogenberg, Alexandria, c. 1575 · Bibliothèque nationale de France" />
      </>
    )}
  </Photo>
);

/** The dealer's storeroom. */
const Storeroom: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src={IMG.dealer.src} size={IMG.dealer.size} fx={760} fy={400} z0={1.02} z1={1.14} a={t.at('The dealer showed') - 1} b={t.at('Some researchers')} mask={MASKS.dealer} traceAt={t.at('The dealer showed') + 4}>
      {() => (
        <>
          <Note text="30–40 bodies" x={110} y={100} size={64} rot={-3} at={t.at('thirty')} color="#ffffff" />
          <Note text="none ancient." x={110} y={210} size={72} rot={-4} at={t.at('none')} color={pal.subject} />
          <Note text="all made in the last 4 years" x={110} y={330} size={52} rot={-3} at={t.at('last four')} />
          <Note text="enslaved people, and others" x={110} y={830} size={52} rot={-3} at={t.at('Enslaved')} color="#ffffff" />
          <Note text="pitch · wrapped · dried" x={110} y={920} size={52} rot={-3} at={t.at('Filled')} />
          <Note text="leprosy · pox · plague" x={1240} y={880} size={56} rot={-4} at={t.at('Leprosy')} color="#ffffff" />
          <Note text={'"all mummy to him"'} x={1300} y={970} size={46} rot={-4} at={t.at('all mummy')} />
          <Tag text="Illustration · A mummy dealer's storeroom, Alexandria, 1564" x={44} y={40} />
        </>
      )}
    </Photo>
  );
};

/** Speculation, flagged: did fakes carry disease? Paré, who recorded the dealer's story, on a card. */
const Plague: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropCard src={IMG.pare.src} size={IMG.pare.size} x={170} y={150} w={520} h={720} fx={1200} fy={1450} scale={0.3} rot={-2} at={t.at('Some researchers')} mask={MASKS.pare} tint={null} />
    <Note text="Ambroise Paré recorded the dealer's story (1582)" x={150} y={930} size={42} rot={-2} at={t.at('Some researchers') + 6} color="#ffffff" />
    <Note text="speculation:" x={860} y={200} size={56} rot={-3} at={t.at('Some researchers')} color="#FF9F1C" />
    <Note text="did fakes carry disease" x={860} y={320} size={62} rot={-4} at={t.at('wondered')} />
    <Note text="into Europe's pharmacies?" x={880} y={430} size={62} rot={-4} at={t.at('carried')} />
    <Note text="nobody knows." x={940} y={620} size={64} rot={-3} at={t.at('Nobody')} color="#ffffff" />
    <Note text="hard to rule out." x={980} y={730} size={64} rot={-3} at={t.at('hard to')} color={usePal().subject} />
  </AbsoluteFill>
);

/** The Jar: ANCIENT*, *aged 4 years. */
const Ancient: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Ancient Egyptian');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Jar x={380} y={130} h={800} at={a - 2} labels={[{text: 'MUMIA', at: a - 2, size: 10}, {text: 'ANCIENT*', at: a + 2, size: 8, strike: true, small: '*aged 4 years'}]} fill={[[a - 2, 0.75]]} />
      <Note text="*aged a full four years" x={1000} y={760} size={58} rot={-4} at={t.at('Aged')} color={usePal().subject} />
    </AbsoluteFill>
  );
};

/** Pierre Pomet, 1694. */
const Pomet: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="not only made in Egypt" x={140} y={100} size={56} rot={-3} at={t.at('And the fakes')} color="#ffffff" />
      <CropCard src={IMG.pomet.src} size={IMG.pomet.size} x={190} y={260} w={480} h={640} fx={1400} fy={1700} scale={0.3} rot={-2} at={t.at('In 1694') - 4} />
      {g >= t.at('In 1694') && <Highlight text="1694" x={860} y={240} size={110} at={t.at('In 1694')} seed={43} rot={-2} />}
      <Note text="Pierre Pomet" x={880} y={420} size={72} rot={-3} at={t.at('Pierre')} color="#ffffff" />
      <Note text="the French king's own drug expert" x={880} y={540} size={52} rot={-3} at={t.at('drug expert')} />
      <Note text="complained:" x={900} y={680} size={56} rot={-3} at={t.at('complained')} color="#ffffff" />
      <Tag text="Pierre Pomet, engraved portrait, 1694 · Wellcome Collection" />
    </AbsoluteFill>
  );
};

/** The oven workshop: recent bodies, pitch, an oven. */
const Oven: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.oven.src} size={IMG.oven.size} fx={620} fy={430} z0={1.02} z1={1.12} a={t.at('mummies were arriving') - 1} b={t.at('Genuine')} mask={MASKS.oven_bundles} traceAt={t.at('Recent') + 2}>
    {() => (
      <>
        <Note text="arriving from Venice and Lyon" x={110} y={100} size={56} rot={-3} at={t.at('arriving')} color="#ffffff" />
        <Note text="recent bodies" x={1290} y={110} size={64} rot={-4} at={t.at('Recent')} />
        <Note text="+ pitch + an oven" x={1290} y={220} size={60} rot={-4} at={t.at('stuffed')} />
        <Tag text="Illustration · Drying fake mummies, Lyon, c. 1690" />
      </>
    )}
  </Photo>
);

/** Made in France: the map with Lyon and Venice looping back on themselves. */
const MadeInFrance: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Genuine');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <MedMap at={a - 14} dim />
      <Pin x={PLACES.alexandria[0]} y={PLACES.alexandria[1]} at={a - 8} r={11} />
      <Note text="'Egypt'" x={PLACES.alexandria[0] - 70} y={PLACES.alexandria[1] + 20} size={44} rot={-3} at={a - 8} color="#ffffff" />
      <Pin x={PLACES.lyon[0]} y={PLACES.lyon[1]} at={a} r={13} color={pal.subject} />
      <Note text="Lyon" x={PLACES.lyon[0] - 40} y={PLACES.lyon[1] - 80} size={52} rot={-3} at={a} />
      <Loop cx={PLACES.lyon[0]} cy={PLACES.lyon[1]} rx={90} ry={60} at={a + 4} seed={44} color={pal.subject} />
      <Pin x={PLACES.venice[0]} y={PLACES.venice[1]} at={a + 4} r={13} color={pal.subject} />
      <Note text="Venice" x={PLACES.venice[0] + 10} y={PLACES.venice[1] - 80} size={52} rot={-3} at={a + 4} />
      <Loop cx={PLACES.venice[0]} cy={PLACES.venice[1]} rx={80} ry={56} at={a + 8} seed={45} color={pal.subject} />
      <Note text="genuine Egyptian mummy..." x={110} y={80} size={60} rot={-3} at={a} color="#ffffff" />
      {g >= t.at('Made in France') && <Highlight text="MADE IN FRANCE" x={150} y={190} size={92} at={t.at('Made in France')} seed={46} rot={-3} />}
    </AbsoluteFill>
  );
};

/** Pomet's plate: the finest grade's greatest use. */
const Fish: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src={IMG.pomet1712Plate.src} size={IMG.pomet1712Plate.size} fx={1600} fy={1900} z0={1.0} z1={1.08} a={t.at("Pomet's verdict") - 1} b={t.frames + 30} bw="grayscale(1) contrast(1.15) sepia(0.2)">
      {() => (
        <>
          <Note text="Pomet's verdict on the finest grade:" x={110} y={100} size={52} rot={-3} at={t.at("Pomet's verdict")} color="#ffffff" />
          <Note text="its greatest use:" x={1180} y={760} size={56} rot={-3} at={t.at('greatest use')} color="#ffffff" />
          <Stamp text="FISH BAIT" x={1150} y={840} at={t.at('catching fish')} size={130} color={pal.subject} rot={-6} />
          <Tag text="Pomet, A Compleat History of Druggs, 1712, plate of mummies · Internet Archive" />
        </>
      )}
    </Photo>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Supply t={t} />],
    [at('In 1564') - 1, <Alexandria t={t} />],
    [at('The dealer showed') - 1, <Storeroom t={t} />],
    [at('Some researchers') - 1, <Plague t={t} />],
    [at('Ancient Egyptian') - 1, <Ancient t={t} />],
    [at('And the fakes') - 1, <Pomet t={t} />],
    [at('mummies were arriving') - 1, <Oven t={t} />],
    [at('Genuine') - 1, <MadeInFrance t={t} />],
    [at("Pomet's verdict") - 1, <Fish t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/m_apothecary.mp3" from={0} to={at('In 1564') + 20} volume={0.2} />
      <Bed src="music/m_tomb.mp3" from={at('In 1564')} to={at('Ancient Egyptian') + 10} volume={0.22} startFrom={60} />
      <Bed src="music/m_apothecary.mp3" from={at('Ancient Egyptian') - 6} to={t.frames + 30} volume={0.2} startFrom={30 * 14} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['one problem', 'In 1564', 'In 1694', 'Made in France'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      <Sfx at={at('catching fish')} src="sfx/stamp.wav" volume={0.38} />
      {['only had', 'restrict', 'So the dealers', 'made more', 'Guy', 'visited', 'thirty', 'none', 'last four', 'Enslaved', 'Filled', 'Leprosy', 'all mummy', 'wondered', 'Nobody', 'hard to',
        'Aged', 'And the fakes', 'Pierre', 'drug expert', 'complained', 'arriving', 'Recent', 'stuffed', "Pomet's verdict", 'greatest use'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
    </>
  );
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_the_fakes.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
