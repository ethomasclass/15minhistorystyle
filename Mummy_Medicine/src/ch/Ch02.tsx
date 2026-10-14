// Chapter 2 · The Typo: mumiya was a mineral; a translation turned it into the mummy.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch02_the_typo.words.json';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, PhotoCard, type TL, useScene} from '../kit/shell';
import {Bed, MOUNTAIN, MUMMY_CASE, Sketch, TAR} from '../draw';
import {IMG} from '../images';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

/** The seep: mumiya defined. */
const Seep: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  return (
    <Photo src={IMG.seep.src} size={IMG.seep.size} fx={700} fy={420} z0={1.02} z1={1.12} a={0} b={t.at('But the ancient')} mask={MASKS.seep_man} traceAt={t.at('oozed')}>
      {() => (
        <>
          {g >= t.at('mumiya') && <Highlight text="MUMIYA" x={110} y={90} size={110} at={t.at('mumiya')} seed={21} rot={-2} />}
          <Definition term="mu·mi·ya" def="a natural black pitch, sold as medicine" at={t.at('was a mineral')} x={130} y={250} w={900} />
          <Note text="Persia" x={1460} y={130} size={60} rot={-4} at={t.at('Persia')} color="#ffffff" />
          <Note text="for bruises + broken bones" x={1080} y={820} size={52} rot={-3} at={t.at('bruises')} color="#ffffff" />
          <Note text="no one was in it." x={1180} y={920} size={62} rot={-4} at={t.at('No one')} color={pal.subject} />
          <Tag text="Illustration · A bitumen seep in Persia" />
        </>
      )}
    </Photo>
  );
};

/** Egyptian embalming: black resins and pitch on dark, glossy bodies (a coffin plate, no remains). */
const Embalmed: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.blackCoffin.src} size={IMG.blackCoffin.size} fx={843} fy={1300} z0={1.02} z1={1.1} a={t.at('But the ancient') - 1} b={t.at('Black stuff in')}>
    {() => (
      <>
        <Note text="ancient Egypt: black resin + pitch" x={110} y={110} size={56} rot={-3} at={t.at('black resins')} color="#ffffff" />
        <Note text="dark, glossy bodies" x={1180} y={860} size={60} rot={-4} at={t.at('dark glossy')} />
        <Tag text="Coffin of Paankhenamun, Egypt, c. 945–715 BC · Art Institute of Chicago" />
      </>
    )}
  </Photo>
);

/** Black stuff in the mountain. Black stuff on the mummy. Same thing, right? */
const SameThing: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Black stuff in');
  const b = t.at('Black stuff on');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sketch pts={MOUNTAIN} x={150} y={260} s={1} at={a} dur={14} width={7} />
      <Sketch pts={TAR} x={150} y={260} s={1} at={a + 8} dur={8} width={12} color="#111" />
      <Sketch pts={TAR} x={150} y={260} s={1} at={a + 8} dur={8} width={6} color={pal.subject} />
      <Note text="black stuff in the mountain" x={140} y={720} size={52} rot={-3} at={a + 4} color="#ffffff" />
      <Sketch pts={MUMMY_CASE} x={1060} y={210} s={1.05} at={b} dur={14} width={7} closed />
      <Sketch pts={[[230, 190], [260, 220], [300, 200], [280, 260], [240, 300], [290, 330]]} x={1060} y={210} s={1.05} at={b + 8} dur={8} width={10} color={pal.subject} />
      <Note text="black stuff on the mummy" x={1080} y={720} size={52} rot={-3} at={b + 4} color="#ffffff" />
      <Note text="= ?" x={830} y={400} size={140} rot={-4} at={t.at('Same thing')} color={pal.subject} />
      <Note text="same thing, right?" x={700} y={880} size={66} rot={-4} at={t.at('Same thing')} />
    </AbsoluteFill>
  );
};

/** Toledo, the 1100s: the translator. */
const Translator: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.translator.src} size={IMG.translator.size} fx={700} fy={380} z0={1.02} z1={1.14} a={t.at('In the 1100s') - 1} b={t.at('And he described')} mask={MASKS.translator} traceAt={t.at('Gerard') + 2}>
    {() => (
      <>
        <Highlight text="THE 1100s" x={110} y={90} size={100} at={t.at('In the 1100s')} seed={22} rot={-2} />
        <Note text="Gerard of Cremona" x={1240} y={120} size={60} rot={-4} at={t.at('Gerard')} color="#ffffff" />
        <Note text="Arabic → Latin" x={1300} y={240} size={64} rot={-4} at={t.at('translated')} />
        <Note text="(Europe's doctors read Latin)" x={1060} y={900} size={48} rot={-3} at={t.at('the language')} color="#ffffff" />
        <Tag text="Illustration · A translator at work, Toledo, c. 1170" />
      </>
    )}
  </Photo>
);

/** A page from one of Gerard's translations, and the definition that changed everything. */
const Definition2: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={IMG.gerardMs.src} size={IMG.gerardMs.size} x={170} y={140} w={600} h={690} fx={533} fy={600} scale={0.62} rot={-2} at={t.at('And he described')} />
      <Note text="mumia =" x={900} y={260} size={80} rot={-4} at={t.at('mumia as')} color="#ffffff" />
      <Note text="the stuff found in" x={940} y={400} size={74} rot={-4} at={t.at('the stuff')} />
      <Note text="embalmed bodies" x={980} y={520} size={86} rot={-4} at={t.at('embalmed')} color={pal.subject} />
      <Note text="who got it wrong first?" x={900} y={720} size={56} rot={-3} at={t.at('Historians')} color="#ffffff" />
      <Note text="(historians still argue)" x={960} y={820} size={48} rot={-3} at={t.at('argue')} color="#FF9F1C" />
      <Tag text="Gerard of Cremona's Latin translation of al-Razi, c. 1250 copy · Wikimedia Commons" />
    </AbsoluteFill>
  );
};

/** Somebody read pitch and wrote people: the mountain morphs into the mummy case. */
const Typo: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('Somebody');
  const ppl = t.at('people');
  const m0 = t.at('Mumia stopped');
  const m1 = t.at('meaning the mummy');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Sketch pts={MOUNTAIN} x={180} y={300} s={0.95} at={a - 4} dur={10} width={7} to={MUMMY_CASE} ma={m0} mb={m1 + 6} />
      <Note text="pitch" x={1050} y={300} size={130} rot={-4} at={t.at('read pitch')} />
      {g >= ppl - 4 && (
        <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
          <path d="M1030,400 L1420,370" stroke="#FF9F1C" strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1}
            strokeDashoffset={Math.max(0, 1 - (g - ppl + 4) / 5)} />
        </svg>
      )}
      <Note text="people." x={1090} y={470} size={140} rot={-4} at={ppl} color={pal.subject} />
      <Note text="mineral → mummy" x={1020} y={800} size={68} rot={-3} at={m0} color="#ffffff" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Seep t={t} />],
    [at('But the ancient') - 1, <Embalmed t={t} />],
    [at('Black stuff in') - 1, <SameThing t={t} />],
    [at('In the 1100s') - 1, <Translator t={t} />],
    [at('And he described') - 1, <Definition2 t={t} />],
    [at('Somebody') - 1, <Typo t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/m_old_world.mp3" from={0} to={t.frames + 30} volume={0.2} startFrom={0} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['mumiya', 'In the 1100s'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['Persia', 'bruises', 'No one', 'black resins', 'dark glossy', 'Same thing', 'Gerard', 'translated', 'mumia as', 'embalmed', 'Historians', 'read pitch', 'people', 'Mumia stopped'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('Black stuff in')} src="sfx/quill.wav" volume={0.25} />
      <Sfx at={at('Black stuff on')} src="sfx/quill.wav" volume={0.25} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_the_typo.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
