// Chapter 2 · The Back Door: the Maggios, May 1918. The door motif is born; the chalk message on the sidewalk.
import React from 'react';
import words from '../../public/audio/ch02_back_door.words.json';
import {Highlight, Note, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Bed, Blamed, Chalk, Clip, Counter, Desk, Door, DropCard, Flicker, Pavement, Shadow, Sounds, SrcView} from '../kit/ax';
import {Tag} from '../kit/Kit';
import {IMG} from '../imgs';
import {P} from '../pics';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);
const PANEL = IMG[P.panelMap.src] ?? [665, 792];

/** The Times-Picayune's own map of the ax-murder scenes: we start on the city and drift uptown. */
const Where: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={0} push={0.02}>
      <SrcView src={P.panelMap.src} card look="news" keys={[[0, 330, 380, 1.3], [t.at('Uptown'), 230, 380, 1.75], [t.at('Upperline'), 200, 400, 1.95]]} />
      {g >= t.at('May') && <Highlight text="MAY 23, 1918" x={90} y={90} size={96} at={t.at('May')} seed={21} rot={-2} />}
      <Note text="uptown" x={1340} y={250} size={64} rot={-4} at={t.at('Uptown')} />
      <Note text="upperline & magnolia" x={1180} y={860} size={60} rot={-3} at={t.at('Upperline')} />
      <Tag text={P.panelMap.tag} />
    </Desk>
  );
};

/** A corner grocery: the store in front, the family in back (the paper's own floor plan). */
const Grocery: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Joseph Maggio')}>
    <DropCard src={P.maggios.src} x={110} y={120} w={620} rot={-3} at={t.at('Joseph Maggio') + 1} />
    <CropCard src={P.panelMap.src} size={PANEL} x={900} y={110} w={760} h={300} fx={190} fy={112} scale={2.05} rot={2} at={t.at('grocery')} bw="grayscale(1) sepia(0.28) contrast(1.18)" />
    <CropCard src={P.panelMap.src} size={PANEL} x={1240} y={500} w={460} h={230} fx={572} fy={86} scale={2.3} rot={-2} at={t.at('in the back.') - 2} bw="grayscale(1) sepia(0.28) contrast(1.18)" />
    <Note text="the store in front" x={880} y={470} size={52} rot={-4} at={t.at('grocery')} color="#ffffff" />
    <Note text="home in back" x={980} y={790} size={58} rot={-4} at={t.at('in the back.')} />
    <Note text="italian immigrants" x={150} y={880} size={64} rot={-3} at={t.at('Italian')} />
    <Tag text={`${P.maggios.tag} · ${P.panelMap.tag}`} />
  </Desk>
);

/** Before dawn: the drawn door loses its panel, then the real chiseled doors from the 1919 page. */
const Panel: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Sometime')} flicker>
      <Shadow a={t.at('Sometime')} b={t.at('chisels') + 10} y={120} size={900} />
      <Door x={260} y={150} h={720} at={t.at('Sometime')} cut={t.at('chisels')} />
      <Note text="before dawn" x={130} y={70} size={56} rot={-3} at={t.at('before dawn,')} color="#ffffff" />
      <CropCard src={P.panelMap.src} size={PANEL} x={1050} y={150} w={620} h={560} fx={210} fy={665} scale={2.9} rot={3} at={t.at('Just big')} bw="grayscale(1) sepia(0.2) contrast(1.25)" />
      <Note text="just big enough to crawl through" x={880} y={790} size={54} rot={-3} at={t.at('crawl')} />
      <Note text="their own axe" x={1010} y={900} size={62} rot={-4} at={t.at('axe')} color={pal.subject} />
      <Tag text={`Back doors with chiseled panels · ${P.panelMap.tag}`} />
    </Desk>
  );
};

/** Plain and quiet: who found them, and what happened. */
const Found: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at("Joseph's brothers")}>
    <Clip src={P.maggios.src} x={560} y={150} w={800} rot={-1} at={t.at("Joseph's brothers")} drop={false} />
    <Note text="his brothers find them" x={150} y={860} size={56} rot={-3} at={t.at('They find')} color="#ffffff" />
    <Note text="Catherine: killed · Joseph: dies minutes later" x={150} y={950} size={50} rot={-2} at={t.at('Catherine is')} color="#ffffff" />
    <Tag text={P.maggios.tag} y={40} />
  </Desk>
);

/** The money is still there: not a robbery. */
const Money: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Desk a={t.at("Here's what")}>
      <Note text="what bothers the police:" x={180} y={150} size={62} rot={-3} at={t.at('bothers')} color="#ffffff" />
      <Note text="money — still there" x={260} y={330} size={84} rot={-3} at={t.at('Money')} />
      <Note text="jewelry — still there" x={300} y={490} size={84} rot={-3} at={t.at('jewelry')} />
      <Note text="nobody took them" x={340} y={650} size={84} rot={-3} at={t.at('Nobody took')} color={pal.subject} />
      {g >= t.at('robbery.') && <Highlight text="NOT A ROBBERY" x={900} y={820} size={110} at={t.at('robbery.')} seed={23} rot={-2} />}
    </Desk>
  );
};

/** The razor was his brother's: the first name on the card of people blamed. */
const Razor: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('The razor')}>
    <Blamed x={180} y={170} at={t.at('The razor')} rows={[{name: 'Andrew Maggio, the barber', at: t.at('Andrew,'), clear: t.at('released.')}]} w={760} />
    <Note text="his razor" x={1080} y={240} size={70} rot={-4} at={t.at('razor')} />
    <Note text="arrested..." x={1080} y={420} size={70} rot={-4} at={t.at('arrested.')} color="#ffffff" />
    <Note text="...released" x={1180} y={540} size={70} rot={-4} at={t.at('released.')} color="#ffffff" />
    <Note text="nobody can prove otherwise" x={1000} y={760} size={58} rot={-3} at={t.at('prove otherwise.')} />
  </Desk>
);

/** A block away, in chalk on the sidewalk. Written on as it's read. */
const Sidewalk: React.FC<{t: TL}> = ({t}) => (
  <>
    <Pavement />
    <Chalk t={t} phrase={'"Mrs. Maggio will sit up tonight, just like Mrs. Toney."'} x={240} y={330} w={1500} size={120} />
    <Note text="a block away, in chalk" x={120} y={90} size={58} rot={-3} at={t.at('a block')} color="#ffffff" />
    <Flicker x={900} y={480} />
  </>
);

/** Old cases dug up: 1910, 1911, and the Schiambras in 1912. Connected? */
const OldCases: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Police guessed')}>
      <Note text="Mrs. Toney = Mrs. Schiambra? (1912)" x={140} y={110} size={58} rot={-3} at={t.at('Schiambra,')} color={pal.box} />
      <DropCard src={P.davi.src} x={260} y={290} w={420} rot={-3} at={t.at('old cases')} />
      <DropCard src={P.rissetto.src} x={820} y={330} w={560} rot={3} at={t.at('1911,') - 1} />
      <Note text="connected?" x={1300} y={820} size={80} rot={-5} at={t.at('connected?')} color={pal.box} />
      <Note text="nobody could prove it" x={260} y={900} size={56} rot={-3} at={t.at('prove that')} color="#ffffff" />
      <Tag text={`${P.davi.tag} · ${P.rissetto.tag}`} />
    </Desk>
  );
};

/** Hold onto that back door. */
const Hold: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Hold onto')} flicker>
    <Door x={790} y={150} h={720} at={t.at('Hold onto') + 1} done label="remember this door" />
    <Counter label="BACK DOORS" n={1} at={t.at('see it')} />
  </Desk>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Where t={t} />],
    [at('Joseph Maggio') - 1, <Grocery t={t} />],
    [at('Sometime') - 1, <Panel t={t} />],
    [at("Joseph's brothers") - 1, <Found t={t} />],
    [at("Here's what") - 1, <Money t={t} />],
    [at('The razor') - 1, <Razor t={t} />],
    [at('And a block') - 1, <Sidewalk t={t} />],
    [at('Police guessed') - 1, <OldCases t={t} />],
    [at('Hold onto') - 1, <Hold t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/r_spirits_dark.mp3" from={0} to={at('And a block') + 4} vol={0.13} fadeOut={12} />
      <Bed src="sfx/crackle.wav" from={at('And a block')} to={at('Police guessed')} vol={0.0} />
      <Bed src="music/r_spirits_dark.mp3" from={at('Police guessed') - 4} to={t.frames + 34} vol={0.12} skip={60} />
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['May', 'robbery.']}
        writes={['Uptown', 'Upperline', 'grocery', 'in the back.', 'Italian', 'before dawn,', 'crawl', 'axe', 'They find', 'Catherine is', 'bothers', 'Money', 'jewelry', 'Nobody took',
          'razor', 'Andrew,', 'arrested.', 'released.', 'prove otherwise.', 'a block', 'Schiambra,', 'connected?', 'prove that']}
        ticks={['Joseph Maggio', 'Just big', 'old cases', '1911,', 'see it']}
        extra={[[at('chisels'), 'sfx/chisel.wav', 0.45], [at('Mrs. Maggio will'), 'sfx/pencil_soft.wav', 0.3], [at('Mrs. Toney.'), 'sfx/pencil_soft.wav', 0.3]]} />
    </>
  );
};

export const Ch02 = () => (
  <ChapterShell n={N} audio="audio/ch02_back_door.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
