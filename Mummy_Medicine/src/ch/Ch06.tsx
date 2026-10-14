// Chapter 6 · Beyond Mummies (the heavy chapter): quiet palette, teal marks only, no jokes, longer holds.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch06_beyond_mummies.words.json';
import {Arrow, Highlight, Note, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, onScreen, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Bed, Sketch, type P} from '../draw';
import {IMG} from '../images';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

const Box: React.FC<{S: (x: number, y: number) => number[]; x0: number; y0: number; x1: number; y1: number; at: number}> = ({S, x0, y0, x1, y1, at}) => {
  const [a, b] = S(x0, y0);
  const [c, d] = S(x1, y1);
  const pts: P[] = [[a, b], [c, b], [c, d], [a, d], [a, b + 6]];
  return <Sketch pts={pts} x={0} y={0} at={at} dur={12} width={5} smooth={false} />;
};
const Shade: React.FC = () => <AbsoluteFill style={{background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.78) 84%)'}} />;

/** The term. */
const Term: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="historians have a name for this:" x={160} y={220} size={56} rot={-2} at={0} color="#ffffff" />
      {g >= t.at('Medicinal') && <Highlight text="MEDICINAL CANNIBALISM" x={160} y={330} size={104} at={t.at('Medicinal')} seed={61} rot={-1.5} />}
      <Definition term="med·ic·i·nal can·ni·bal·ism" def="eating human remains as medicine" at={t.at('eating human')} x={180} y={520} w={1300} />
      <Note text="in early modern Europe: far beyond mummies" x={180} y={700} size={54} rot={-2} at={t.at('went far')} />
    </AbsoluteFill>
  );
};

/** Pomet's page: the skull, and the moss that grew on it. */
const SkullPage: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.pometSkull.src} size={IMG.pometSkull.size} fx={2300} fy={1050} z0={1.25} z1={1.32} a={t.at('Powdered') - 1} b={t.at('Human fat')} bw="grayscale(1) contrast(1.15) sepia(0.2)">
    {(place) => {
      const S = onScreen(place);
      return (
        <>
          <Box S={S} x0={1580} y0={640} x1={3020} y1={830} at={t.at('Powdered') + 4} />
          <Box S={S} x0={1880} y0={970} x1={2820} y1={1075} at={t.at('Moss') + 4} />
          <Shade />
          <Note text="powdered human skull: for epilepsy" x={110} y={850} size={54} rot={-2} at={t.at('Powdered')} color="#ffffff" />
          <Note text="moss from old skulls: to stop bleeding" x={110} y={950} size={54} rot={-2} at={t.at('Moss')} />
          <Tag text="Pomet, A Compleat History of Druggs, 1725 · Internet Archive" x={44} y={40} />
        </>
      );
    }}
  </Photo>
);

/** Pharmacy jars labelled for human fat. */
const Fat: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.fatJars.src} size={IMG.fatJars.size} fx={960} fy={700} z0={1.02} z1={1.1} a={t.at('Human fat') - 1} b={t.at('A London')}>
    {() => (
      <>
        <Shade />
        <Note text="AXUNG. HOMINIS = human fat" x={110} y={850} size={54} rot={-2} at={t.at('Human fat') + 4} color="#ffffff" />
        <Note text="bought from executioners · for wounds and aching joints" x={110} y={950} size={46} rot={-2} at={t.at('executioners')} />
        <Tag text="Pharmacy jars for human fat · Bullenwächter, CC BY-SA 3.0" x={44} y={40} />
      </>
    )}
  </Photo>
);

/** Quincy, 1718: the sympathetic liniment. */
const Liniment: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.quincy592.src} size={IMG.quincy592.size} fx={1560} fy={2640} z0={1.6} z1={1.7} a={t.at('A London') - 1} b={t.at('In 1685')} bw="grayscale(1) contrast(1.15) sepia(0.2)">
    {(place) => {
      const S = onScreen(place);
      return (
        <>
          <Box S={S} x0={1060} y0={2480} x1={2088} y1={2885} at={t.at('listed') + 2} />
          <Shade />
          <Highlight text="1718" x={110} y={90} size={96} at={t.at('1718')} seed={62} rot={-2} />
          <Note text="a London pharmacy book's 'Sympathetick Liniment'" x={110} y={940} size={46} rot={-2} at={t.at('still listed')} color="#ffffff" />
          <Tag text="John Quincy, The Compleat English Dispensatory, 1718, p. 592 · Internet Archive" />
        </>
      );
    }}
  </Photo>
);

/** Charles II, 1685. */
const Charles: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={IMG.charles.src} size={IMG.charles.size} x={180} y={120} w={540} h={820} fx={1200} fy={1300} scale={0.38} rot={-1.5} at={t.at('In 1685') - 2} />
      {g >= t.at('In 1685') && <Highlight text="1685" x={860} y={150} size={110} at={t.at('In 1685')} seed={63} rot={-2} />}
      <Note text="King Charles II of England, dying" x={880} y={330} size={56} rot={-2} at={t.at('King Charles')} color="#ffffff" />
      <Note text="his doctors gave him" x={880} y={470} size={56} rot={-2} at={t.at('his doctors')} />
      <Stamp text="40 DROPS" x={880} y={560} at={t.at('forty drops')} size={120} color="#EDE7DC" rot={-2} />
      <Note text="spirit of human skull" x={900} y={720} size={62} rot={-2} at={t.at('spirit of human')} />
      <Note text="he died four days later." x={900} y={850} size={56} rot={-2} at={t.at('He died')} color="#ffffff" />
      <Tag text="Charles II, engraving after Sherwin · Wellcome Collection" />
    </AbsoluteFill>
  );
};

/** Executions: the crowd at a distance (Hogarth, 1747). */
const Scaffold: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.tyburn.src} size={IMG.tyburn.size} fx={1200} fy={820} z0={1.02} z1={1.1} a={t.at('At public') - 1} b={t.at('Around 1580')}>
    {() => (
      <>
        <Shade />
        <Note text="at public executions: waiting with cups" x={110} y={830} size={52} rot={-2} at={t.at('waited')} color="#ffffff" />
        <Note text="they believed the blood would cure epilepsy" x={110} y={925} size={48} rot={-2} at={t.at('They believed')} />
        <Stamp text="1908" x={1540} y={110} at={t.at('1908')} size={120} color="#EDE7DC" rot={-2} />
        <Note text="Germany: a reported attempt" x={1260} y={260} size={48} rot={-2} at={t.at('1908') + 4} color="#ffffff" />
        <Tag text="William Hogarth, The Idle 'Prentice Executed at Tyburn, 1747 · Wellcome Collection" x={44} y={40} />
      </>
    )}
  </Photo>
);

/** Montaigne: the arrow labelled "cannibals" turns round to point back at Europe. */
const Montaigne: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const back = t.at('He could');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={IMG.montaigne.src} size={IMG.montaigne.size} x={180} y={140} w={560} h={760} fx={960} fy={1100} scale={0.5} rot={-1.5} at={t.at('Around 1580') - 2} />
      {g >= t.at('Around 1580') && <Highlight text="c. 1580" x={860} y={130} size={100} at={t.at('Around 1580')} seed={64} rot={-2} />}
      <Note text="Michel de Montaigne, 'Of Cannibals'" x={880} y={290} size={52} rot={-2} at={t.at('Michel')} color="#ffffff" />
      {g < back && <Arrow x1={900} y1={470} x2={1760} y2={470} bow={-20} at={t.at('called cannibals')} width={7} />}
      {g < back && <Note text="'cannibals'" x={1180} y={380} size={54} rot={-2} at={t.at('called cannibals')} />}
      <Note text="Europe: just as savage, and called it normal" x={880} y={560} size={50} rot={-2} at={t.at('Europe did')} color="#ffffff" />
      <Note text="(he meant torture and war)" x={900} y={660} size={46} rot={-2} at={t.at('torture')} />
      {g >= back && <Arrow x1={1760} y1={800} x2={900} y2={800} bow={60} at={back} width={7} />}
      {g >= back && <Note text="...and the pharmacy." x={1100} y={850} size={66} rot={-2} at={t.at('the pharmacy')} />}
      <Tag text="Michel de Montaigne, engraving by Saint-Aubin, 1774 · The Metropolitan Museum of Art" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Term t={t} />],
    [at('Powdered') - 1, <SkullPage t={t} />],
    [at('Human fat') - 1, <Fat t={t} />],
    [at('A London') - 1, <Liniment t={t} />],
    [at('In 1685') - 1, <Charles t={t} />],
    [at('At public') - 1, <Scaffold t={t} />],
    [at('Around 1580') - 1, <Montaigne t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/m_lament.mp3" from={0} to={t.frames + 30} volume={0.15} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/page_turn.wav" volume={0.18} />)}
      {['Powdered', 'Moss', 'executioners', 'still listed', 'King Charles', 'his doctors', 'spirit of human', 'He died', 'waited', 'They believed', 'Michel', 'Europe did', 'torture', 'the pharmacy'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={0.14} />)}
    </>
  );
};

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_beyond_mummies.wav" lead={LEAD} quiet>
    <Body />
  </ChapterShell>
);
