// Chapter 4 · The Walls (heavy chapter, quiet palette): Matilda Scheurer, the flower-makers, her inquest ("used in her
// employment"); the Turner children in Limehouse, Thomas Orton and the green paper ("like paint"), "Natural Death";
// the pattern nobody saw. No jokes, no coral, few marks, long holds; the music drops out before "natural death".
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch04_the_walls.words.json';
import {clamp} from '../lib/anim';
import {Highlight, INK, Note, Picture, Tag, useGFrame} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, Definition, fill, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Arch, Desk, Sounds} from '../kit/bs';
import {Doc, type DocMark, Plain, Sil, sizeOf} from '../kit/dk';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

const BONE = '#EDE7DC';
const MTG61 = 'img/ch04/medical_times_gazette_1861-11-30_p560_scheurer_inquest.jpg';
const MTG62 = 'img/ch04/medical_times_gazette_1862-05-03_p471_turner_inquest.jpg';
const VERNOIS = 'img/ch04/vernois_1859_plate_flower_makers_hands.jpg';
const DAMP = 'img/ch04/builder_1862_a_damp_room_and_its_dangers.jpg';

/** London, 1861: Matilda at her bench (no picture of her survives). */
const Matilda: React.FC<{t: TL}> = ({t}) => (
  <Sil name="g_matilda" file="ch04_matilda_workbench.jpg" label="an artificial-flower maker, 1861" a={0} b={t.at('in a workshop')} fx={0.42} fy={0.45} z={[1.04, 1.1]}>
    {() => (
      <>
        <Highlight text="LONDON, 1861" x={100} y={90} size={84} at={t.at('London 1861')} seed={41} rot={-2} />
        <Note text="Matilda Scheurer, 19" x={1180} y={90} size={52} rot={-3} at={t.at('Matilda Scheurer') - 3} color="#ffffff" />
        <Note text="no picture of her survives" x={1200} y={190} size={38} rot={-3} at={t.at('Matilda Scheurer') + 14} color="#ffffff" />
      </>
    )}
  </Sil>
);

/** The workroom: about a hundred young women, thin cloth over their mouths. */
const Workroom: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch04/builder_1862_flower_makers_blighting_the_buds.jpg" tag="'Artificial-flower makers', The Builder, 28 June 1862 · Internet Archive"
    a={t.at('in a workshop') - 1} b={t.at('For a year')} z={[1.02, 1.07]} pos="50% 60%">
    <Note text="about a hundred young women" x={110} y={80} size={54} rot={-3} at={t.at('about a hundred') - 3} />
    <Note text="thin cloth over the mouth: it doesn't help much" x={110} y={190} size={46} rot={-3} at={t.at('They tie') - 3} color="#ffffff" />
  </Arch>
);

/** What the green did to the makers' hands (Vernois, 1859): held still. */
const Hands: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('For a year') - 1;
  return (
    <Desk a={a} push={0.02}>
      <CropCard src={VERNOIS} size={sizeOf(VERNOIS)} x={170} y={110} w={760} h={820} fx={840} fy={820} scale={0.52} rot={-1} at={a} bw="grayscale(1) contrast(1.15)" />
      <Plain text="Sick on and off, for a year and a half." x={1060} y={330} w={740} size={54} at={t.at('For a year') + 2} />
      <Note text="she throws up something green" x={1070} y={600} size={46} rot={-3} at={t.at('throws up') - 3} color="#ffffff" />
      <Tag text="Vernois, flower-makers' hands, Annales d'hygiène publique, 1859 · BIU Santé, Université Paris Cité" />
    </Desk>
  );
};

/** November 1861: the facts, plainly. */
const Dies: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('In November') - 1} push={0.02}>
    <Plain text="November 1861." x={180} y={250} size={72} at={t.at('In November')} />
    <Plain text="Matilda dies." x={180} y={360} size={72} at={t.at('she dies')} />
    <Note text="arsenic in her lungs and her liver" x={190} y={540} size={50} rot={-2} at={t.at('A doctor finds') - 3} color="#ffffff" />
    <Note text="her sister had died the same way" x={190} y={660} size={50} rot={-2} at={t.at('Her sister') - 3} />
  </Desk>
);

/** The inquest: an accident, "used in her employment". */
const Inquest: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('The inquest') - 1;
  return (
    <Desk a={a} push={0.02}>
      <Doc src={MTG61} x={-700} y={-1550} w={2300} rot={-1} at={a} push={[a, t.at('A few months')]} fx={1490} fy={1930} zoom={1.1}
        marks={[
          {at: t.at('an accident') - 2, to: t.end('an accident') + 6, swipe: [[1150, 1886, 1368, 1914]]},
          {at: t.at('by the arsenic') - 2, to: t.end('employment'), swipe: [[1733, 1918, 1940, 1948], [1037, 1950, 1515, 1980]]},
        ]} />
      <Definition term="inquest" def="the official investigation into a death" at={t.at('The inquest') + 2} x={120} y={90} w={1100} />
      <Tag text="Medical Times & Gazette, 30 Nov. 1861, p.560 · Internet Archive" y={1030} />
    </Desk>
  );
};

/** A few months later, across London: the Turners of Limehouse. */
const Street: React.FC<{t: TL}> = ({t}) => (
  <Sil name="g_street" file="ch04_turner_street_1862.jpg" label="Limehouse, London, 1862" a={t.at('A few months') - 1} b={t.at('Then three-year-old')} fx={0.45} fy={0.5} z={[1.04, 1.1]}>
    {() => (
      <>
        <Note text="the Turners: a bricklayer's family" x={100} y={100} size={52} rot={-3} at={t.at("bricklayer's") - 3} color="#ffffff" />
        <Note text="the doctors: diphtheria (a throat infection)" x={100} y={850} size={46} rot={-2} at={t.at('diphtheria') - 3} color="#ffffff" />
      </>
    )}
  </Sil>
);

/** Ann Amelia, three; Thomas Orton notices the walls. The camera drifts toward the green paper. */
const Room: React.FC<{t: TL}> = ({t}) => (
  <Sil name="g_doctor" file="ch04_limehouse_room.jpg" label="the Turners' room, Limehouse, 1862" a={t.at('Then three-year-old') - 1} b={t.at('The color came')} fx={0.55} fy={0.5}
    z={[1.04, 1.14]} x={[0.02, -0.05]}>
    {() => (
      <>
        <Note text="Ann Amelia, 3" x={130} y={600} size={52} rot={-3} at={t.at('Ann Amelia') - 3} color="#ffffff" />
        <Note text="Thomas Orton, surgeon" x={1100} y={80} size={50} rot={-3} at={t.at('Thomas Orton') - 3} />
        <Note text="green paper. damp." x={800} y={930} size={50} rot={-3} at={t.at('Green paper') - 3} color="#ffffff" />
      </>
    )}
  </Sil>
);

/** The Medical Times page for the Turner inquest: "like paint", then (after the four children) "Natural Death". */
const Page: React.FC<{t: TL; children?: React.ReactNode}> = ({t, children}) => {
  const marks: DocMark[] = [
    {at: t.at('your hand') - 2, to: t.end('like paint'), swipe: [[1050, 174, 1455, 205]]},
    {at: t.at('natural death') - 2, to: t.end('natural death') + 4, swipe: [[1052, 240, 1368, 270]]},
  ];
  return (
    <Desk a={t.at('The color came')} push={0.02}>
      <Doc src={MTG62} x={-429} y={276} w={2300} rot={-1} at={t.at('The color came') - 1} push={[t.at('The color came'), t.at('And that was the pattern')]} fx={1250} fy={220} zoom={1.12} marks={marks} />
      {children}
      <Tag text="Medical Times & Gazette, 3 May 1862, p.471 · Internet Archive" y={40} />
    </Desk>
  );
};

/** Four small marks, drawn one by one. */
const Four: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const g = useGFrame();
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      {[0, 1, 2, 3].map((i) => {
        const p = interpolate(g, [at + i * 5, at + i * 5 + 5], [0, 1], clamp);
        if (p <= 0) return null;
        const cx = x + i * 46;
        return <path key={i} d={`M${cx},${y} L${cx + 3},${y + 92}`} stroke={BONE} strokeWidth={7} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
      })}
    </svg>
  );
};

/** A chemist tests it. Arsenic. Four children in about two months. Hold. */
const Count: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Arsenic Four') - 1} push={0.015}>
    <Plain text="Arsenic." x={180} y={240} size={84} at={t.at('Arsenic Four')} />
    <Four x={190} y={440} at={t.at('Four children')} />
    <Plain text="Four children in about two months." x={180} y={600} w={1500} size={64} at={t.at('Four children') + 4} />
  </Desk>
);

/** "And that was the pattern": the damp room, then the push into the wallpaper. */
const Pattern: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const size = sizeOf(DAMP);
  const a = t.at('And that was the pattern') - 1;
  const k = t.at('nobody thought');
  const z = interpolate(f, [a, k, k + 120], [1.02, 1.08, 1.5], clamp);
  const fx = interpolate(f, [a, k, k + 120], [840, 760, 470], clamp);
  const fy = interpolate(f, [a, k, k + 120], [560, 520, 330], clamp);
  const place = fill(size, fx, fy, z);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Picture src={DAMP} place={place} size={size} bw="grayscale(1) contrast(1.3) brightness(0.92)" />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.7) 100%)'}} />
      {f < k && (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 34%)'}} />
          <Plain text="Sick at home." x={110} y={835} w={560} size={52} at={t.at('People got sick')} />
          <Plain text="Better away." x={680} y={835} w={520} size={52} at={t.at('got better')} />
          <Plain text="Sick again." x={1220} y={835} w={520} size={52} at={t.at('sick again')} />
        </>
      )}
      <Tag text="'A damp room; and its dangers', The Builder, 5 July 1862 · Internet Archive" y={40} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Matilda t={t} />],
    [at('in a workshop') - 1, <Workroom t={t} />],
    [at('For a year') - 1, <Hands t={t} />],
    [at('In November') - 1, <Dies t={t} />],
    [at('The inquest') - 1, <Inquest t={t} />],
    [at('A few months') - 1, <Street t={t} />],
    [at('Then three-year-old') - 1, <Room t={t} />],
    [at('The color came') - 1, <Page t={t}><Note text="a chemist tests it" x={120} y={150} size={50} rot={-2} at={at('A chemist') - 3} color="#ffffff" /></Page>],
    [at('Arsenic Four') - 1, <Count t={t} />],
    [at('The jury') - 1, <Page t={t}><Note text="the jury's verdict:" x={120} y={150} size={50} rot={-2} at={at('calls it a natural') - 3} color="#ffffff" /></Page>],
    [at('And that was the pattern') - 1, <Pattern t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('London 1861')]}
        writes={['Matilda Scheurer', 'about a hundred', 'They tie', 'throws up', 'A doctor finds', 'Her sister', "bricklayer's", 'diphtheria', 'Ann Amelia', 'Thomas Orton', 'Green paper',
          'A chemist', 'calls it a natural'].map((p) => at(p))} />
    </>
  );
};

export const Ch04: React.FC = () => {
  const t = makeTimeline(N, 30);
  const drop = t.at('natural death');
  const pattern = t.at('And that was the pattern');
  return (
    <ChapterShell n={N} audio="audio/ch04_the_walls.wav" lead={LEAD} quiet
      music={[{src: 'music/r_dix.mp3', volume: 0.12, to: drop - 4, fadeOut: 5}, {src: 'music/j_grief.mp3', volume: 0.14, from: pattern}]}>
      <Body />
    </ChapterShell>
  );
};
