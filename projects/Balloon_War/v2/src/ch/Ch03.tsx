// Chapter 3 · The Girl Who Glued. Scene plan: script/SCENES_v2.md "ch03"; build brief: script/BUILD_BRIEF_v2.md. Follows Ch01's
// pattern: a cut 1 frame before the word that starts each idea, each scene in <Sequence from={cut}> with beats as t.at(...) - cut.
//   0:00  "So they used kids... as young as 12" BW08, the theater floor of girls
//   0:09  "One of them was a schoolgirl named Rei Minamimura." BW09 + the no-photo label
//   0:13  "the biggest theaters in Tokyo" two theater prints (Takarazuka, Nichigeki)
//   0:17  "They sat on cushions... panels about the size of a door." Mikesh's photo of schoolgirls pasting; a drawn door
//   0:22  "Not normal paper... tree bark... see light through." the washi stack, a lamp coming up behind it
//   0:28  "the glue was a paste made from a root vegetable, tinted blue" konnyaku root, then the paste pot (coral)
//   0:34  "that paste was edible... eating the glue." the root, now coral
//   0:45  "The rules were strict. No hairpins..." BW08 dimmed, the rules as notes
//   0:52  "military police... top military secret" the girls' photo, a TOP SECRET stamp
//   0:58  "What they were making, nobody explained. Rei just glued." BW09, the lamp beam
//   1:04  "About 600 pieces made one balloon, 33 feet across..." BalloonAssembly (3D): 600 panels, then the house and 33 FT
//   1:11  "A metal ring of sandbags..." AltitudeRibbon (3D, wide): three days of rise and sink, 32 sandbags to 0, the bombs
//   1:18  "Rei didn't know any of that... decades." BW09 again, quieter
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/v2_ch03_the_girl_who_glued.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Note, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Print} from '../kit/print';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {CropPrint, DrawPath, NoPhoto, RubberStamp} from './ch02/parts';
import {AltitudeRibbon} from '../fx/AltitudeRibbon';
import {BalloonAssembly} from '../fx/BalloonAssembly';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

const REI = 'Rei Minamimura · no photo used';
const REI_DUST = {x: 1080, y: 260, w: 560, h: 760, n: 30};
const GIRLS_SRC = 'img/ch04_paper_balloon/schoolgirls_pasting_envelope_fig12.jpg';
const GIRLS_TAG = 'Schoolgirls pasting a balloon envelope · Mikesh, Smithsonian, 1973';

/** "So they used kids. In 1944, Japan ordered unmarried girls, as young as 12, to go to work for the war." */
const Kids: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW08_theater_girls" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.12], x: [-20, 20], y: [0, -12]}} fog={0.25} />
    <Highlight text="THEY USED KIDS" x={160} y={110} size={92} at={t.at('kids') - a} seed={51} rot={-2} />
    <Note text="1944" x={1500} y={130} size={70} rot={-4} at={t.at('1944') - a} />
    <Note text="girls, as young as 12" x={1100} y={330} size={58} rot={-3} at={t.at('young') - a} />
  </AbsoluteFill>
);

/** "One of them was a schoolgirl named Rei Minamimura." */
const Rei: React.FC<{a: number; b: number}> = ({a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW09_rei" a={0} b={b - a} fade={1} cam={{z: [1.06, 1.12], x: [14, 0], y: [4, -8]}} fog={0.2} dust={{...REI_DUST, seed: 'rei3a'}} />
    <NoPhoto text={REI} at={6} />
  </AbsoluteFill>
);

/** "Girls like Rei were sent into some of the biggest theaters in Tokyo." */
const Theaters: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 130], [1, 1.04], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <Print src="img/v2/japan/tokyo_takarazuka_theater_1930s.jpg" x={190} y={340} w={720} h={435} at={2} rot={-3} tag="Tokyo Takarazuka Theater, 1930s · postcard" />
        <Print src="img/v2/japan/nichigeki_theater_1933.jpg" x={1010} y={450} w={720} h={459} at={t.at('theaters') - a} rot={2} tag="The Nichigeki theater, Tokyo, 1933" />
      </AbsoluteFill>
      <Highlight text="TOKYO'S BIGGEST THEATERS" x={170} y={110} size={86} at={t.at('biggest') - a} seed={53} rot={-2} />
    </AbsoluteFill>
  );
};

/** "They sat on cushions, gluing sheets of paper into panels about the size of a door." */
const Pasting: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropPrint src={GIRLS_SRC} size={[970, 1000]} crop={[48, 134, 896, 846]} x={230} y={140} w={720} at={1} rot={-1} tag={GIRLS_TAG} />
      <Note text="sitting on cushions" x={1060} y={160} size={56} rot={-3} at={r('cushions')} />
      <Note text="gluing paper into panels" x={1060} y={270} size={52} rot={-3} at={r('gluing')} />
      {/* a door, about 3 x 6 ft (the panel size) */}
      <DrawPath d="M1330,800 L1330,380 L1540,380 L1540,800 M1505,600 a9,9 0 1,0 0.1,0" at={r('size')} dur={12} width={7} />
      <Note text="the size of a door" x={1250} y={830} size={56} rot={-3} at={r('door')} />
    </AbsoluteFill>
  );
};

/** "Not normal paper. A tough Japanese paper made from tree bark, thin enough to see light through." */
const Washi: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const r = (p: string) => t.at(p) - a;
  const lamp = interpolate(g, [r('light'), r('light') + 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{opacity: lamp, background: 'radial-gradient(circle 420px at 960px 520px, rgba(255,240,214,0.5) 0%, rgba(255,240,214,0.14) 55%, transparent 100%)'}} />
      <Prop name="washi_stack" x={720} y={290} w={480} at={3} />
      <Highlight text="NOT NORMAL PAPER" x={170} y={110} size={92} at={r('normal')} seed={55} rot={-2} />
      <Note text="made from tree bark" x={180} y={520} size={58} rot={-3} at={r('bark')} />
      <Note text="thin enough to see light through" x={780} y={840} size={54} rot={-3} at={r('light')} />
    </AbsoluteFill>
  );
};

/** "And the glue was a paste made from a root vegetable, tinted blue, so any thin spots would show." */
const Paste: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Prop name="konnyaku_root" x={250} y={330} w={420} at={r('root')} />
      <Prop name="paste_brush_pot" x={950} y={420} w={680} at={r('tinted')} coral from="top" />
      <Note text="the glue" x={180} y={150} size={64} rot={-4} at={r('glue')} />
      <Note text="a root vegetable: konnyaku" x={180} y={800} size={54} rot={-3} at={r('root')} />
      <Note text="tinted blue" x={1080} y={250} size={60} rot={-4} at={r('blue')} />
      <Note text="so thin spots would show" x={1060} y={800} size={54} rot={-3} at={r('show')} />
    </AbsoluteFill>
  );
};

/** "It turns out that paste was edible. So, during a wartime food shortage, workers kept getting caught... eating the glue. Which tells you..." */
const Edible: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 340], [1, 1.06], clamp);
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <Prop name="konnyaku_root" x={700} y={250} w={520} at={2} coral from="none" />
      </AbsoluteFill>
      <Note text="edible!" x={1280} y={260} size={78} rot={-6} at={r('edible')} />
      <Note text="a wartime food shortage" x={130} y={150} size={56} rot={-3} at={r('food')} />
      <Highlight text="EATING THE GLUE" x={540} y={830} size={100} at={r('eating')} seed={57} rot={-2} />
      <Note text="how was the war going?" x={1130} y={600} size={52} rot={-4} at={r('tells')} />
    </AbsoluteFill>
  );
};

/** "The rules were strict. No hairpins. Fingernails cut short. Nothing that could scratch the paper." */
const Rules: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <SilScene name="BW08_theater_girls" a={0} b={b - a} fade={1} cam={{z: [1.14, 1.2], x: [10, -10], y: [-20, -26]}} fog={0.2} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,7,5,0.82) 0%, rgba(8,7,5,0.6) 50%, rgba(8,7,5,0.15) 100%)'}} />
      <Highlight text="STRICT RULES" x={170} y={110} size={96} at={r('strict')} seed={59} rot={-2} />
      <Note text="✕ no hairpins" x={210} y={350} size={62} rot={-2} at={r('hairpins')} />
      <Note text="✕ fingernails cut short" x={210} y={490} size={62} rot={-2} at={r('Fingernails')} />
      <Note text="✕ nothing that could scratch the paper" x={210} y={630} size={62} rot={-2} at={r('Nothing')} />
    </AbsoluteFill>
  );
};

/** "And military police told the girls their work was a top military secret. They were never to talk about it." */
const Secret: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 200], [1, 1.05], clamp);
  const r = (p: string) => t.at(p) - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <CropPrint src={GIRLS_SRC} size={[970, 1000]} crop={[48, 134, 896, 600]} x={220} y={150} w={1000} at={1} rot={1} tag={GIRLS_TAG} />
      </AbsoluteFill>
      <Note text="military police" x={1300} y={180} size={60} rot={-3} at={r('police')} />
      <RubberStamp text="TOP SECRET" x={1000} y={420} size={96} at={r('secret')} rot={-9} />
      <Note text="never talk about it" x={1180} y={760} size={60} rot={-3} at={r('never')} />
    </AbsoluteFill>
  );
};

/** "What they were making, nobody explained. Rei just glued. Panel after panel." */
const Glued: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW09_rei" a={0} b={b - a} fade={1} cam={{z: [1.08, 1.18], x: [0, -16], y: [-4, -18]}} fog={0.2} dust={{...REI_DUST, seed: 'rei3b'}} />
    <Note text="nobody explained" x={1200} y={150} size={60} rot={-4} at={t.at('nobody') - a} />
    <Note text="panel after panel" x={1240} y={820} size={58} rot={-3} at={t.at('Panel') - a} />
    <NoPhoto text={REI} at={6} />
  </AbsoluteFill>
);

/** "About 600 pieces made one balloon, 33 feet across. As tall as a three-story house." BalloonAssembly (3D): 600 panels fill in
 *  with the counter, then the camera eases back for the house and the 33-ft dimensions (the piece's own labels carry the numbers). */
const Size: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <BalloonAssembly at={2} fillDur={t.at('balloon') - a} houseAt={t.at('across') - a - 20} />
  </AbsoluteFill>
);

/** "A metal ring of sandbags kept it at the right height for three days. Then it dropped its bombs and blew itself up."
 *  AltitudeRibbon (3D): the three-day sawtooth, two sandbags at every low point, 32 -> 0, the bombs on "bombs". */
const Ring: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <AltitudeRibbon at={2} bombsAt={t.at('bombs') - a} cam="wide" />
    <Note text="and blew itself up" x={1180} y={700} size={54} rot={-3} at={t.at('blew') - a} />
  </AbsoluteFill>
);

/** "Rei didn't know any of that. She wouldn't find out for decades." */
const Decades: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW09_rei" a={0} b={b - a} fade={1} cam={{z: [1.16, 1.08], x: [-10, 6], y: [-14, -4]}} fog={0.35} dust={{...REI_DUST, n: 18, seed: 'rei3c'}} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.4)'}} />
    <Note text="decades" x={1280} y={180} size={84} rot={-4} at={t.at('decades') - a} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const END = Math.ceil(N.duration * 30) + 80;
  const c = {
    rei: at('One of them') - 1, theaters: at('Girls like') - 1, pasting: at('They sat') - 1, washi: at('Not normal') - 1, paste: at('And the glue') - 1,
    edible: at('It turns') - 1, rules: at('The rules') - 1, secret: at('And military') - 1, glued: at('What they') - 1, size: at('About 600') - 1,
    ring: at('A metal ring') - 1, decades: at("Rei didn't") - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Sequence from={0} layout="none"><Kids t={t} a={0} b={c.rei} /></Sequence>],
    [c.rei, <Sequence from={c.rei} layout="none"><Rei a={c.rei} b={c.theaters} /></Sequence>],
    [c.theaters, <Sequence from={c.theaters} layout="none"><Theaters t={t} a={c.theaters} /></Sequence>],
    [c.pasting, <Sequence from={c.pasting} layout="none"><Pasting t={t} a={c.pasting} /></Sequence>],
    [c.washi, <Sequence from={c.washi} layout="none"><Washi t={t} a={c.washi} /></Sequence>],
    [c.paste, <Sequence from={c.paste} layout="none"><Paste t={t} a={c.paste} /></Sequence>],
    [c.edible, <Sequence from={c.edible} layout="none"><Edible t={t} a={c.edible} /></Sequence>],
    [c.rules, <Sequence from={c.rules} layout="none"><Rules t={t} a={c.rules} b={c.secret} /></Sequence>],
    [c.secret, <Sequence from={c.secret} layout="none"><Secret t={t} a={c.secret} /></Sequence>],
    [c.glued, <Sequence from={c.glued} layout="none"><Glued t={t} a={c.glued} b={c.size} /></Sequence>],
    [c.size, <Sequence from={c.size} layout="none"><Size t={t} a={c.size} /></Sequence>],
    [c.ring, <Sequence from={c.ring} layout="none"><Ring t={t} a={c.ring} /></Sequence>],
    [c.decades, <Sequence from={c.decades} layout="none"><Decades t={t} a={c.decades} b={END} /></Sequence>],
  ];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {['kids', 'biggest', 'normal', 'eating', 'strict'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.22} />)}
      {['1944', 'young', 'cushions', 'gluing', 'door', 'bark', 'light', 'glue', 'root', 'blue', 'show', 'edible', 'food', 'tells', 'hairpins', 'Fingernails',
        'Nothing', 'police', 'never', 'nobody', 'Panel', 'blew', 'decades'].map((p) =>
        <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('secret')} src="sfx/stamp.wav" volume={0.32} />
      <Sfx at={c.theaters + 2} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={at('theaters')} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={c.pasting + 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={c.washi + 3} src="sfx/paper_rustle.wav" volume={0.3} />
      <Sfx at={at('root')} src="sfx/paper_slap_soft.wav" volume={0.3} />
      <Sfx at={at('tinted')} src="sfx/paper_slap_soft.wav" volume={0.3} />
      <Sfx at={c.size + 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={c.ring + 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={c.glued + 4} src="sfx/paper_rustle.wav" volume={0.18} />
    </>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/v2_ch03_the_girl_who_glued.wav" lead={LEAD} music={[{src: 'music/bw_paper_and_paste.mp3', volume: bed('bw_paper_and_paste')}]}>
    <Body />
  </ChapterShell>
);
