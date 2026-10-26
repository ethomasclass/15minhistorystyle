// Chapter 5 · Fresh Is Best: the theory, Croll's 1609 recipe written on a card, then the real printed pages.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch05_fresh.words.json';
import {Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, onScreen, Photo, PhotoCard, type TL, useScene} from '../kit/shell';
import {Bed, IndexCard, Sketch, type P} from '../draw';
import {Jar} from '../jar';
import {IMG} from '../images';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

/** A box drawn round a passage, in screen pixels. */
const Box: React.FC<{x0: number; y0: number; x1: number; y1: number; at: number; color?: string}> = ({x0, y0, x1, y1, at, color}) => {
  const pts: P[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0 + 6]];
  return <Sketch pts={pts} x={0} y={0} at={at} dur={10} width={6} smooth={false} color={color} />;
};

/** The theory: Egypt overrated; fresh and young is best. */
const Theory: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={IMG.crollFront.src} size={IMG.crollFront.size} x={170} y={140} w={540} h={760} fx={1200} fy={1500} scale={0.33} rot={-2} at={0} />
      <Note text="Egypt? overrated." x={860} y={130} size={76} rot={-4} at={t.at('overrated')} color={pal.subject} />
      <Note text="a popular theory:" x={880} y={300} size={56} rot={-3} at={t.at('popular theory')} color="#ffffff" />
      <Note text="healing power is strongest in" x={900} y={400} size={52} rot={-3} at={t.at('healing power')} />
      <Note text="young ✓" x={930} y={510} size={64} rot={-4} at={t.at('young')} />
      <Note text="healthy ✓" x={1300} y={510} size={64} rot={-4} at={t.at('healthy')} />
      <Note text="died suddenly ✓" x={960} y={620} size={64} rot={-4} at={t.at('died suddenly')} />
      <Tag text="Paracelsus, frontispiece of Croll's Basilica Chymica · Wellcome Collection" />
    </AbsoluteFill>
  );
};

/** Fresh beats a pharaoh. */
const Fresh: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('By that');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PhotoCard src={IMG.mummyCase.src} x={330} y={110} w={360} rot={-3} at={a} filter="grayscale(1) contrast(1.15)" />
      <Note text="3,000 years old" x={300} y={880} size={58} rot={-3} at={a + 4} color="#ffffff" />
      <Sketch pts={[[300, 140], [720, 840]]} x={0} y={0} at={t.at('pharaoh')} dur={5} width={14} color="#FF9F1C" smooth={false} />
      <Sketch pts={[[720, 140], [300, 840]]} x={0} y={0} at={t.at('pharaoh') + 4} dur={5} width={14} color="#FF9F1C" smooth={false} />
      <Jar x={1200} y={140} h={700} at={t.at('fresh body')} labels={[{text: 'FRESH', at: t.at('fresh body') + 4, size: 10}]} fill={[[t.at('fresh body'), 0], [t.at('fresh body') + 14, 0.85]]} />
      <Note text="fresh: better (they said)" x={1100} y={880} size={58} rot={-3} at={t.at('beat')} color={pal.subject} />
      <Tag text="Cartonnage mummy case · Cleveland Museum of Art" />
    </AbsoluteFill>
  );
};

/** Oswald Croll, 1609. */
const Croll: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={IMG.crollTitle.src} size={IMG.crollTitle.size} x={180} y={130} w={520} h={790} fx={807} fy={1050} scale={0.42} rot={-2} at={t.at('So in 1609') - 2} />
      {g >= t.at('So in 1609') && <Highlight text="1609" x={860} y={150} size={110} at={t.at('So in 1609')} seed={51} rot={-2} />}
      <Note text="Oswald Croll" x={880} y={330} size={76} rot={-3} at={t.at('Oswald')} color="#ffffff" />
      <Note text="German chemist" x={900} y={450} size={56} rot={-3} at={t.at('chemist')} />
      <Note text="published a recipe" x={880} y={610} size={66} rot={-4} at={t.at('published')} />
      <Note text="for making your own." x={920} y={720} size={72} rot={-4} at={t.at('making your own')} color={usePal().subject} />
      <Tag text="Croll, Basilica Chymica (1635 printing), title page · BIU Santé / Internet Archive" />
    </AbsoluteFill>
  );
};

/** The recipe card, written ingredient by ingredient, read flat. */
const Recipe: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <IndexCard x={260} y={90} w={1400} h={760} at={t.at('Take the body') - 4} rot={-1.5} title="RECIPE: MODERN MUMMY · O. CROLL, 1609" size={50} lineH={86}
      lines={[
        {text: 'the body of a red-haired man', at: t.at('Take the body'), tick: true},
        {text: 'age 24', at: t.at('Twenty-four'), tick: true},
        {text: 'hanged, or broken on the wheel', at: t.at('Hanged'), tick: true},
        {text: 'leave out 1 day + 1 night (sun & moon)', at: t.at('Leave him'), tick: true},
        {text: 'cut the flesh into small pieces', at: t.at('Cut the'), tick: true},
        {text: 'soak: myrrh, aloe, spirit of wine', at: t.at('Soak'), tick: true},
        {text: 'dry.', at: t.at('Dry'), tick: true},
      ]} />
  </AbsoluteFill>
);

/** It was real: Croll's printed Latin page, the recipe boxed, "ruffi" circled. */
const LatinPage: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at("That's a real");
  return (
    <Photo src={IMG.crollPage.src} size={IMG.crollPage.size} fx={950} fy={1150} z0={1.0} z1={1.06} a={a} b={t.at('other doctors')} bw="grayscale(1) contrast(1.15) sepia(0.25)">
      {(place) => {
        const S = onScreen(place);
        const [x0, y0] = S(330, 1160);
        const [x1, y1] = S(1560, 1470);
        const [rx, ry] = S(1190, 1210);
        return (
          <>
            <Box x0={x0} y0={y0} x1={x1} y1={y1} at={a + 4} />
            <Loop cx={rx} cy={ry} rx={110} ry={56} at={a + 12} seed={52} color={pal.subject} />
            <AbsoluteFill style={{background: 'linear-gradient(transparent 62%, rgba(0,0,0,0.78) 82%)'}} />
            <Note text="hominis ruffi = a red-haired man" x={110} y={770} size={50} rot={-3} at={a + 14} color="#ffffff" />
            <Note text="a real recipe." x={1150} y={850} size={72} rot={-4} at={t.at('real recipe')} color={pal.subject} />
            <Note text="printed in a medical book" x={1150} y={960} size={50} rot={-3} at={t.at('printed')} color="#ffffff" />
            <Tag text="Croll, Basilica Chymica, 'Theriaca de Mumia' (1635 printing) · BIU Santé / Internet Archive" x={44} y={40} />
          </>
        );
      }}
    </Photo>
  );
};

/** Copied for decades: Schroeder's 1669 English version, signed "Croll." Then: why red hair? */
const English: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const a = t.at('other doctors');
  return (
    <Photo src={IMG.schroederPage.src} size={IMG.schroederPage.size} fx={1580} fy={1950} z0={1.75} z1={1.9} a={a} b={t.at('And mummy was')} bw="grayscale(1) contrast(1.15) sepia(0.25)">
      {(place) => {
        const S = onScreen(place);
        const [cx, cy] = S(1810, 2325);
        const [hx, hy] = S(1450, 1752);
        const u = (sx0: number, sx1: number, sy: number, at: number) => {
          const [ax, ay] = S(sx0, sy);
          const [bx] = S(sx1, sy);
          return <Sketch pts={[[ax, ay], [bx, ay + 4]]} x={0} y={0} at={at} dur={8} width={7} color="#FF9F1C" smooth={false} />;
        };
        return (
          <>
            <AbsoluteFill style={{background: 'linear-gradient(transparent 68%, rgba(0,0,0,0.75) 85%)'}} />
            <Loop cx={cx} cy={cy} rx={120} ry={56} at={t.at('copied') + 4} seed={53} />
            <Note text="the English edition, 1669: signed 'Croll.'" x={110} y={900} size={50} rot={-3} at={t.at('copied')} color="#ffffff" />
            <Loop cx={hx} cy={hy} rx={200} ry={62} at={t.at('Why red')} seed={54} color={pal.subject} />
            {u(1640, 2140, 1782, t.at('Because'))}
            {u(1020, 1450, 1855, t.at('Because') + 8)}
            {g >= t.at('least disturbing') && <Highlight text="THE LEAST DISTURBING PART" x={110} y={100} size={70} at={t.at('least disturbing')} seed={55} rot={-2} />}
            <Tag text="Schroeder, The Compleat Chymical Dispensatory, London, 1669, p. 520 · Wellcome Collection / Internet Archive" x={44} y={1030} />
          </>
        );
      }}
    </Photo>
  );
};

/** And mummy was only the beginning. */
const Beginning: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="...and mummy was only the beginning." x={360} y={460} size={72} rot={-3} at={t.at('And mummy was')} color="#ffffff" />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Theory t={t} />],
    [at('By that') - 1, <Fresh t={t} />],
    [at('So in 1609') - 1, <Croll t={t} />],
    [at('Take the body') - 6, <Recipe t={t} />],
    [at("That's a real") - 1, <LatinPage t={t} />],
    [at('other doctors') - 1, <English t={t} />],
    [at('And mummy was') - 1, <Beginning t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      {/* music drops out under the recipe, returns after it */}
      <Bed src="music/m_apothecary.mp3" from={0} to={at('Take the body') + 6} volume={0.2} startFrom={30 * 4} fadeOut={20} />
      <Bed src="music/m_apothecary.mp3" from={at("That's a real") + 10} to={at('And mummy was') + 20} volume={0.18} startFrom={30 * 30} fadeOut={30} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['So in 1609', 'least disturbing'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['overrated', 'popular theory', 'healing power', 'young', 'healthy', 'died suddenly', 'beat', 'Oswald', 'chemist', 'published', 'making your own',
        'real recipe', 'printed', 'copied', 'Why red', 'Because'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {['Take the body', 'Twenty-four', 'Hanged', 'Leave him', 'Cut the', 'Soak', 'Dry'].map((c) => <Sfx key={c} at={at(c)} src="sfx/quill.wav" volume={0.3} />)}
    </>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_fresh.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
