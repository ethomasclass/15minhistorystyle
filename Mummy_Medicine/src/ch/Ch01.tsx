// Chapter 1 · cold open: Merck's 1903 price list ("while supplies last"), 1924, the Jar, the driving question,
// then the channel intro and the title card.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, Picture, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {fill, makeTimeline, type Narration, onScreen, Photo, PhotoCard, type TL, useScene} from '../kit/shell';
import {Jar} from '../jar';
import {IMG} from '../images';
import {DATES, SUBTITLE} from '../project';

const N = words as Narration;
const TITLE_FRAMES = 150;
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

/** Merck's 1903 price list: the title page. */
const PriceList: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.merckTitle.src} size={IMG.merckTitle.size} fx={1250} fy={1500} z0={1.0} z1={1.1} a={0} b={t.at('Page after')}>
    {() => (
      <>
        <Highlight text="1903" x={110} y={100} size={110} at={t.at('1903')} seed={11} rot={-2} />
        <Note text="Merck: a German drug company" x={1040} y={830} size={50} rot={-3} at={t.at('Merck')} color="#ffffff" />
        <Tag text="E. Merck, Darmstadt, Preis-Liste, 1903 · Internet Archive" />
      </>
    )}
  </Photo>
);

/** Page 254: the camera runs down the page to the line under the musk, then leans in on it. */
const TheLine: React.FC<{t: TL}> = ({t}) => {
  const frame = useCurrentFrame();
  const pal = usePal();
  const {src, size} = IMG.merckPage;
  const a = t.at('Page after');
  const b = t.at('this line');
  const c = t.at('Mumia');
  const fy = interpolate(frame, [a, b], [700, 3404], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  const fx = interpolate(frame, [b, c + 20], [1250, 1240], clamp);
  const z = interpolate(frame, [a, b, c, c + 30, t.at('Supplies lasted'), t.at('Supplies lasted') + 60], [1.0, 1.05, 1.05, 1.1, 1.1, 1.13], clamp);
  const place = fill(size, fx, fy, z);
  const S = onScreen(place);
  const [ux0, uy] = S(240, 3440);
  const [ux1] = S(1030, 3440);
  const [px, py] = S(2160, 3404);
  const [sx0] = S(1050, 3440);
  const [sx1] = S(1545, 3440);
  const g = useGFrame();
  const under = (x0: number, x1: number, y: number, at: number, color: string) => g >= at && (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
      <path d={`M${x0},${y} Q${(x0 + x1) / 2},${y + 6} ${x1},${y - 2}`} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - interpolate(g, [at, at + 8], [0, 1], clamp)} />
    </svg>
  );
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Picture src={src} place={place} size={size} bw="grayscale(1) contrast(1.15) sepia(0.25)" />
      {g >= t.at('musk') && g < c && <Arrow x1={S(1260, 3215)[0]} y1={S(1260, 3215)[1] + 40} x2={S(1000, 3325)[0]} y2={S(1000, 3325)[1]} bow={30} at={t.at('musk') + 2} />}
      {g >= t.at('musk') && g < c && <Note text="musk" x={S(1280, 3170)[0]} y={S(1280, 3170)[1]} size={50} rot={-4} at={t.at('musk')} color="#ffffff" />}
      {under(ux0, ux1, uy, c, pal.mark)}
      {g >= t.at('Genuine') && <Note text="= genuine Egyptian mummy" x={Math.max(80, ux0)} y={uy + 40} size={58} rot={-3} at={t.at('Genuine')} />}
      <Loop cx={px} cy={py} rx={150} ry={70} at={t.at('Seventeen')} seed={4} tilt={-4} color={pal.subject} />
      {g >= t.at('Seventeen') && <Note text="17.50 marks a kilo" x={Math.min(px - 360, 1380)} y={py + 80} size={46} rot={-4} at={t.at('Seventeen') + 4} color="#ffffff" />}
      {under(sx0, sx1, uy + 4, t.at('While supplies'), '#FF9F1C')}
      {g >= t.at('While supplies') && <Highlight text="WHILE SUPPLIES LAST" x={Math.min(sx0, 760)} y={uy + 150} size={84} at={t.at('While supplies') + 3} seed={12} rot={-2} />}
      {g >= t.at('Supplies lasted') && <Note text="(supplies lasted.)" x={980} y={uy + 300} size={60} rot={-4} at={t.at('Supplies lasted')} color={pal.subject} />}
      <Tag text="E. Merck, Preis-Liste, 1903, p. 254 · Internet Archive" />
    </AbsoluteFill>
  );
};

/** 1924: Howard Carter at Tutankhamun's coffin; the catalog still sells mummy. */
const Tut: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.carter.src} size={IMG.carter.size} fx={800} fy={560} z0={1.02} z1={1.12} a={t.at('In 1924') - 1} b={t.at('For centuries')}>
    {() => (
      <>
        <Highlight text="1924" x={110} y={100} size={110} at={t.at('In 1924')} seed={13} rot={-2} />
        <Note text="Tutankhamun's tomb: found 1922" x={110} y={270} size={52} rot={-3} at={t.at('Tutankhamuns')} color="#ffffff" />
        <Note text="mummy: still in the catalog" x={860} y={860} size={58} rot={-4} at={t.at('still in the catalog')} color={usePal().subject} />
        <Tag text="Howard Carter at Tutankhamun's coffin, c. 1925 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** The Jar's first appearance: label MUMIA, coral fill that empties when supplies run out and refills "fresher". */
const FirstJar: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('For centuries');
  const ro = t.at('ran out');
  const fr = t.at('fresher');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Jar x={250} y={150} h={780} at={a} labels={[{text: 'MUMIA', at: a + 10, size: 10}]}
        fill={[[a + 12, 0], [a + 30, 0.78], [ro, 0.78], [ro + 12, 0.04], [fr, 0.04], [fr + 12, 0.8]]} />
      <Highlight text="FOR CENTURIES" x={860} y={120} size={88} at={a} seed={14} rot={-2} />
      <Note text="Europeans ate mummies as medicine" x={880} y={270} size={50} rot={-3} at={t.at('ate mummies')} color="#ffffff" />
      <Note text="kings ✓" x={940} y={400} size={62} rot={-4} at={t.at('Kings')} />
      <Note text="scientists ✓" x={940} y={510} size={62} rot={-4} at={t.at('Scientists')} />
      <Note text="real mummies: ran out" x={900} y={660} size={56} rot={-3} at={ro - 2} color="#ffffff" />
      <Note text="→ fresher ones" x={960} y={780} size={68} rot={-4} at={fr} color={pal.subject} />
    </AbsoluteFill>
  );
};

/** The driving question, written on the desk, with the Merck line as a card. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="the question:" x={180} y={130} size={60} rot={-3} at={t.at("So here's")} color="#ffffff" />
      <Note text="how did eating the dead" x={220} y={260} size={92} rot={-3} at={t.at('How did eating')} />
      <Note text="become medicine?" x={300} y={400} size={92} rot={-3} at={t.at('become')} color={pal.subject} />
      <Note text="...and how did it last until 1924?" x={240} y={560} size={70} rot={-3} at={t.at('last until')} />
      <PhotoCard src={IMG.merckLine.src} x={260} y={770} w={1400} rot={-1.5} at={t.at('last until') + 10} fit="contain" filter="grayscale(1) contrast(1.15)" />
    </AbsoluteFill>
  );
};

/** Teaser for chapter 2: the bitumen seep. */
const Rock: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.seep.src} size={IMG.seep.size} fx={760} fy={480} z0={1.04} z1={1.16} a={t.at('It starts') - 1} b={END}>
    {() => (
      <>
        <Note text="a black, sticky rock" x={1180} y={140} size={60} rot={-4} at={t.at('black')} />
        <Tag text="Illustration · A bitumen seep in Persia" />
      </>
    )}
  </Photo>
);

/** Title card after the channel intro: Pomet's mummy plate dimmed behind the title. */
const Title: React.FC = () => {
  const g = useGFrame();
  const frame = useCurrentFrame();
  const pal = usePal();
  const {src, size} = IMG.pometPlate;
  const place = fill(size, 2100, 1900, 1.25 + frame * 0.0004);
  return (
    <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
      <div style={{opacity: 0.35}}><Picture src={src} place={place} size={size} /></div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.25) 30%, rgba(8,6,4,0.9) 100%)'}} />
      <Highlight text="WHEN EUROPE" x={250} y={290} size={150} at={4} seed={61} rot={-2} />
      <Highlight text="ATE MUMMIES" x={330} y={480} size={150} at={9} seed={62} rot={-2} />
      {g >= 16 && <div style={{position: 'absolute', left: 360, top: 720, fontFamily: JF.display, fontSize: 64, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [16, 22], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1360} y={850} size={54} rot={-5} at={26} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <PriceList t={t} />],
    [at('Page after') - 1, <TheLine t={t} />],
    [at('In 1924') - 1, <Tut t={t} />],
    [at('For centuries') - 1, <FirstJar t={t} />],
    [at("So here's") - 1, <Question t={t} />],
    [at('It starts') - 1, <Rock t={t} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/m_1924.mp3')} volume={(f) => interpolate(f, [0, 12, END - 45, END - 5], [0, 0.2, 0.2, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['1903', 'While supplies', 'In 1924', 'For centuries'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {['Merck', 'musk', 'Genuine', 'Supplies lasted', 'Tutankhamuns', 'still in the catalog', 'ate mummies', 'Kings', 'Scientists', 'ran out', 'fresher', 'question', 'How did eating', 'become', 'last until', 'black'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('Seventeen')} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Ch01: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
