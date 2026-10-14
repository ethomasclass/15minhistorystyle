// Chapter 3 · The Trade: tombs near Cairo, the hand-drawn trade map, apothecaries, kings and chemists, subscribe plug.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch03_the_trade.words.json';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, PhotoCard, Stamp, type TL, useScene} from '../kit/shell';
import {Bed, Crate, IndexCard, MedMap, PLACES, ROUTE_LONDON, ROUTE_VENICE} from '../draw';
import {Pin} from '../kit/map';
import {Jar} from '../jar';
import {IMG} from '../images';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

/** Egypt: a city of tombs. */
const Tombs: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.cairoTombs.src} size={IMG.cairoTombs.size} fx={1920} fy={1300} z0={1.02} z1={1.1} a={0} b={t.at('Men climbed')}>
    {() => (
      <>
        <Note text="real mountain pitch: rare" x={110} y={110} size={56} rot={-3} at={t.at('rare')} color="#ffffff" />
        <Note text="Egypt: tombs full of the dead" x={110} y={210} size={56} rot={-3} at={t.at('tombs')} />
        {useGFrame() >= t.at('supply chain') && <Highlight text="THE SUPPLY CHAIN" x={110} y={860} size={84} at={t.at('supply chain')} seed={31} rot={-2} />}
        <Tag text="Tombs outside Cairo, Description de l'Égypte, 1809 · Wikimedia Commons" />
      </>
    )}
  </Photo>
);

/** Tomb robbers at night: the wrapped bundle is the coral subject. */
const Raid: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.tomb.src} size={IMG.tomb.size} fx={640} fy={420} z0={1.03} z1={1.14} a={t.at('Men climbed') - 1} b={t.at('The pieces')} mask={MASKS.tomb_bundle} traceAt={t.at('burial') + 2}>
    {() => (
      <>
        <Note text="old burial shafts near Cairo" x={110} y={100} size={56} rot={-3} at={t.at('burial')} color="#ffffff" />
        <Note text="broken into pieces" x={1250} y={820} size={58} rot={-4} at={t.at('broke')} />
        <Note text="→ sold to merchants" x={1250} y={920} size={58} rot={-4} at={t.at('sold')} />
        <Tag text="Illustration · Tomb robbers at Saqqara, c. 1550" />
      </>
    )}
  </Photo>
);

/** The hand-drawn Mediterranean: crates hop from Alexandria to Venice and London; 1586's 600 pounds. */
const TradeMap: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('The pieces');
  const lbl = (p: [number, number], text: string, at: number, dx = 18, dy = -64) => (
    <>
      <Pin x={p[0]} y={p[1]} at={at} r={11} />
      <Note text={text} x={p[0] + dx} y={p[1] + dy} size={40} rot={-3} at={at} color="#ffffff" />
    </>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'translate(30px, 170px) scale(0.78)', transformOrigin: '0 0'}}>
      <MedMap at={a - 2} />
      {lbl(PLACES.cairo, 'Cairo', a + 2, 24, 0)}
      {lbl(PLACES.alexandria, 'Alexandria', t.at('Alexandria'), -150, -80)}
      {lbl(PLACES.venice, 'Venice', t.at('to Europe'), -40, -80)}
      {lbl(PLACES.london, 'London', t.at('to Europe') + 4, 40, -40)}
      <Crate route={[PLACES.cairo, PLACES.alexandria]} a={a + 4} b={t.at('Alexandria') + 6} />
      <Crate route={ROUTE_VENICE} a={t.at('onto ships')} b={t.at('to Europe') + 6} />
      <Crate route={ROUTE_LONDON} a={t.at('onto ships') + 4} b={t.at('In 1586') + 20} />
      {[0, 1, 2, 3, 4].map((i) => <Crate key={i} route={ROUTE_LONDON} a={t.at('shipped') + i * 4} b={t.at('single load') + 10 + i * 4} size={28} />)}
      <Crate route={ROUTE_LONDON} a={t.at('Plus one')} b={t.at('In case') + 14} size={58} color={pal.mark} label="+1 whole" />
      </div>
      {g >= t.at('In 1586') && <Highlight text="1586" x={1290} y={110} size={110} at={t.at('In 1586')} seed={32} rot={-2} />}
      <Note text="one English merchant" x={1300} y={270} size={44} rot={-3} at={t.at('English merchant')} color="#ffffff" />
      <Stamp text="600 LB" x={1290} y={350} at={t.at('600')} size={130} color={pal.subject} rot={-4} />
      <Note text="+ one whole body" x={1300} y={530} size={50} rot={-3} at={t.at('Plus one')} />
      <Note text="(the full set)" x={1340} y={620} size={48} rot={-4} at={t.at('full set')} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** Apothecaries grind it to powder: what it was for. */
const Apothecary: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const uses = [['Bruises', 'bruises'], ['bleeding', 'bleeding'], ['coughs', 'coughs'], ['headaches', 'headaches'], ['poison', 'poison']];
  return (
    <Photo src={IMG.apothecary.src} size={IMG.apothecary.size} fx={560} fy={380} z0={1.02} z1={1.12} a={t.at('Back home') - 1} b={t.at('And this')} mask={MASKS.apothecary} traceAt={t.at('apothecaries') + 2}>
      {() => (
        <>
          {g >= t.at('apothecaries') && <Highlight text="APOTHECARY" x={110} y={90} size={96} at={t.at('apothecaries')} seed={33} rot={-2} />}
          <Definition term="a·poth·e·car·y" def="a pharmacist of the day" at={t.at('pharmacists')} x={130} y={240} w={760} />
          <Note text="ground into powder" x={130} y={360} size={52} rot={-3} at={t.at('ground')} color="#ffffff" />
          <Note text="drink it, or rub it on" x={130} y={450} size={52} rot={-3} at={t.at('You drank')} color="#ffffff" />
          {uses.map(([label, word], i) => (
            <Note key={word} text={`${label} ✓`} x={1430} y={120 + i * 105} size={58} rot={-4} at={t.at(word)} />
          ))}
          <Note text="pretty much everything" x={1180} y={680} size={64} rot={-4} at={t.at('pretty much')} color={pal.subject} />
          <Tag text="Illustration · An apothecary grinding mumia, London, c. 1650" />
        </>
      )}
    </Photo>
  );
};

/** King Francis I and his emergency kit. */
const Francis: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={IMG.francis.src} size={IMG.francis.size} x={160} y={120} w={560} h={780} fx={1180} fy={1350} scale={0.4} rot={-2} at={t.at('And this')} />
      <Note text="not a back-alley cure" x={860} y={110} size={52} rot={-3} at={t.at('back-alley')} color="#ffffff" />
      {g >= t.at('King Francis') && <Highlight text="KING FRANCIS I" x={860} y={200} size={92} at={t.at('King Francis')} seed={34} rot={-2} />}
      <Note text="(reportedly)" x={1500} y={330} size={46} rot={-4} at={t.at('reportedly')} color="#FF9F1C" />
      <IndexCard x={880} y={430} w={820} h={330} at={t.at('carried')} rot={-2} title="THE KING'S EMERGENCY KIT"
        lines={[{text: '1. mummy', at: t.at('pouch of mummy'), tick: true}, {text: '2. rhubarb', at: t.at('rhubarb'), tick: true}, {text: 'carry at all times', at: t.at('Everywhere'), color: '#b8402f'}]} />
      <Note text="just in case." x={1220} y={820} size={66} rot={-4} at={t.at('Just in')} color={pal.subject} />
      <Tag text="Francis I of France, oil painting · Wellcome Collection" />
    </AbsoluteFill>
  );
};

/** The scientists: Paracelsus and Robert Boyle. */
const Scientists: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src={IMG.paracelsus.src} x={200} y={120} w={520} rot={-3} at={t.at('famous doctor')} filter="grayscale(1) contrast(1.15)" />
    <Note text="Paracelsus: praised it" x={160} y={880} size={56} rot={-3} at={t.at('praised')} />
    <PhotoCard src={IMG.boyle.src} x={1120} y={100} w={400} rot={2.5} at={t.at('Robert Boyle')} filter="grayscale(1) contrast(1.15)" />
    <Note text="Robert Boyle: so did he" x={1040} y={880} size={56} rot={-3} at={t.at('Robert Boyle')} />
    <Note text="a founder of modern chemistry" x={1000} y={970} size={46} rot={-3} at={t.at('founders')} color="#ffffff" />
    <Tag text="Paracelsus, woodcut, 1538 · Robert Boyle, engraving, 1696 · Wellcome Collection" x={44} y={40} />
  </AbsoluteFill>
);

/** Subscribe plug: the Jar, relabelled. */
const Plug: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Quick thing');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Jar x={300} y={150} h={780} at={a} labels={[{text: 'SUBSCRIBE', at: t.at('hit subscribe'), size: 7.5, small: 'ingredients: none'}]} />
      <Note text="quick thing:" x={900} y={200} size={60} rot={-3} at={a} color="#ffffff" />
      <Note text="subscribe ↓" x={940} y={330} size={84} rot={-4} at={t.at('hit subscribe')} />
      <Note text="free · helps the channel" x={940} y={500} size={56} rot={-3} at={t.at('free')} color="#ffffff" />
      <Note text="contains no one." x={940} y={640} size={76} rot={-4} at={t.at('contains')} color={pal.subject} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Tombs t={t} />],
    [at('Men climbed') - 1, <Raid t={t} />],
    [at('The pieces') - 1, <TradeMap t={t} />],
    [at('Back home') - 1, <Apothecary t={t} />],
    [at('And this') - 1, <Francis t={t} />],
    [at('The famous') - 1, <Scientists t={t} />],
    [at('Quick thing') - 1, <Plug t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/m_alexandria.mp3" from={0} to={at('Quick thing') + 10} volume={0.21} />
      <Bed src="music/m_apothecary.mp3" from={at('Quick thing') - 10} to={t.frames + 30} volume={0.16} startFrom={30 * 40} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['supply chain', 'In 1586', 'apothecaries', 'King Francis'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      <Sfx at={at('600')} src="sfx/stamp.wav" volume={0.35} />
      {['rare', 'tombs', 'burial', 'broke', 'sold', 'English merchant', 'Plus one', 'full set', 'ground', 'You drank', 'Bruises', 'bleeding', 'coughs', 'headaches', 'poison', 'pretty much',
        'back-alley', 'reportedly', 'pouch of mummy', 'rhubarb', 'Everywhere', 'Just in', 'praised', 'Robert Boyle', 'founders', 'hit subscribe', 'free', 'contains'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {['Alexandria', 'to Europe'].map((c) => <Sfx key={c} at={at(c)} src="sfx/tick.wav" volume={0.4} />)}
    </>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_the_trade.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
