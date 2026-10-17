// Chapter 6 · Bly, Oregon (the heavy chapter: quiet palette, no jokes, nothing staged). The real woods, slow pushes,
// birdsong that stops on "too late", the six names written by hand, the monument, the 2014 find, and one drawn crane.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch06_bly.words.json';
import {clamp} from '../lib/anim';
import {Note, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Bed, Sketch, type P} from '../draw';
import {Ph} from '../bw';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);
const BONE = '#EDE7DC';

/** An origami crane in profile (local 0..300 x 0..170). */
export const CRANE: P[] = [[20, 40], [95, 118], [150, 0], [182, 112], [292, 50], [205, 142], [120, 146], [20, 40]];

const Woods: React.FC<{t: TL}> = ({t}) => (
  <Ph p="ch06_bly/hills_around_gearhart_mountain_usfs.jpg" fx={1920} fy={1280} a={0} b={t.at('A pastor')} z0={1.02} z1={1.1} band="bottom"
    tag="The hills around Gearhart Mountain, near Bly, Oregon · US Forest Service">
    {() => (
      <>
        <Note text="May 5, 1945" x={120} y={820} size={72} rot={-3} at={t.at('May')} color={BONE} />
        <Note text="the woods near Bly, Oregon" x={140} y={930} size={54} rot={-3} at={t.at('woods')} color={BONE} />
      </>
    )}
  </Ph>
);

const Picnic: React.FC<{t: TL}> = ({t}) => (
  <Ph p="ch06_bly/gearhart_mountain_ponderosa_pine_1964.jpg" fx={700} fy={900} a={t.at('A pastor') - 1} b={t.at('While Archie')} z0={1.0} z1={1.06} band="left"
    tag="Ponderosa pines on Gearhart Mountain, 1964 · US Forest Service">
    {() => (
      <>
        <Note text="a pastor, Archie Mitchell," x={110} y={240} size={54} rot={-2} at={t.at('pastor')} color={BONE} />
        <Note text="his wife, Elsie," x={130} y={340} size={54} rot={-2} at={t.at('Elsie,')} color={BONE} />
        <Note text="and five children from their church" x={130} y={440} size={50} rot={-2} at={t.at('five children')} color={BONE} />
        <Note text="a picnic in the mountains" x={130} y={540} size={50} rot={-2} at={t.at('picnic')} color={BONE} />
        <Note text="Elsie was pregnant" x={130} y={660} size={50} rot={-2} at={t.at('pregnant')} color={BONE} />
      </>
    )}
  </Ph>
);

/** The walk ahead; the warning; then black. */
const Ahead: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const late = t.at('too late');
  const o = interpolate(g, [late, late + 10], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: o}}>
        <Ph p="ch06_bly/fog_over_forest_fremont_winema_usfs.jpg" fx={1920} fy={1300} a={t.at('While Archie') - 1} b={late} z0={1.04} z1={1.12} band="bottom"
          tag="The Fremont-Winema National Forest · US Forest Service">
          {() => <Note text="the others walked ahead" x={120} y={900} size={54} rot={-3} at={t.at('walked')} color={BONE} />}
        </Ph>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** The six names, one at a time. */
const Names: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Elsie and');
  const names = ['Elsie Mitchell', 'Joan Patzke', 'Dick Patzke', 'Jay Gifford', 'Eddie Engen', 'Sherman Shoemaker'];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="one of the balloons" x={160} y={120} size={52} rot={-2} at={t.at('one of the')} color="#9CC9C4" />
      {names.map((n, i) => <Note key={n} text={n} x={i === 0 ? 160 : 200} y={250 + i * 105} size={i === 0 ? 70 : 62} rot={-2} at={a + i * 14} dur={14} color={BONE} />)}
      <Note text="the children were about 11 to 14" x={1100} y={820} size={46} rot={-2} at={t.at('between')} color="#9CC9C4" />
      <Tag text="Their names, as they are on the Mitchell Monument" />
    </AbsoluteFill>
  );
};

const Monument: React.FC<{t: TL}> = ({t}) => (
  <Ph p="ch06_bly/mitchell_monument_usfs_2007.jpg" fx={960} fy={700} a={t.at('They were the') - 1} b={t.at('And some')} z0={1.02} z1={1.1} band="bottom"
    tag="The Mitchell Monument, Fremont-Winema National Forest · US Forest Service">
    {() => (
      <>
        <Note text="the only people killed by enemy action on the US mainland" x={110} y={850} size={46} rot={-2} at={t.at('only people')} color={BONE} />
        <Note text="in the whole war" x={130} y={930} size={46} rot={-2} at={t.at('entire war')} color={BONE} />
        <Note text="a few weeks later: the warning" x={900} y={120} size={46} rot={-2} at={t.at('A few weeks')} color="#9CC9C4" />
      </>
    )}
  </Ph>
);

const StillThere: React.FC<{t: TL}> = ({t}) => (
  <Ph p="ch06_bly/forest_fog_fremont_winema_usfs.jpg" fx={1920} fy={1200} a={t.at('And some') - 1} b={t.at('About forty')} z0={1.04} z1={1.12} band="bottom"
    tag="Southern Oregon's forests · US Forest Service">
    {() => (
      <>
        <Note text="some are still out there" x={120} y={820} size={56} rot={-3} at={t.at('still out')} color={BONE} />
        <Note text="2014, British Columbia: one found half buried; a bomb team blew it up" x={120} y={920} size={42} rot={-3} at={t.at('In 2014')} color="#9CC9C4" />
      </>
    )}
  </Ph>
);

/** "About forty years after the picnic, a man arrived in Bly carrying a gift... from Japan." One crane, drawn on. */
const Gift: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="about forty years later" x={160} y={160} size={56} rot={-2} at={t.at('About forty')} color={BONE} />
    <Note text="a gift, from Japan" x={180} y={270} size={56} rot={-2} at={t.at('gift')} color="#9CC9C4" />
    <Sketch pts={CRANE} x={760} y={430} s={1.6} at={t.at('from Japan')} dur={24} width={6} closed color={BONE} fill="#EDE7DC" fillOpacity={0.12} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Woods t={t} />],
    [at('A pastor') - 1, <Picnic t={t} />],
    [at('While Archie') - 1, <Ahead t={t} />],
    [at('It was one') - 1, <Names t={t} />],
    [at('They were the') - 1, <Monument t={t} />],
    [at('And some') - 1, <StillThere t={t} />],
    [at('About forty') - 1, <Gift t={t} />],
  ];
  const scene = useScene(cuts.map(([f, n], i): [number, React.ReactNode] => [f, <React.Fragment key={i}>{n}</React.Fragment>]));
  return (
    <>
      {scene}
      {/* birdsong until the warning, then silence; a low lament only from the names on */}
      <Bed src="sfx/forest_birds.wav" from={0} to={at('too late') + 2} volume={0.16} fadeIn={10} fadeOut={6} />
      <Bed src="sfx/forest_birds.wav" from={at('mountains')} to={at('too late') + 2} volume={0.12} startFrom={30 * 5} fadeIn={20} fadeOut={6} />
      <Bed src="music/m_lament.mp3" from={at('Elsie and') - 20} to={t.frames + 20} volume={0.12} startFrom={0} fadeIn={60} />
      {[at('A pastor'), at('While Archie'), at('They were the'), at('And some'), at('About forty')].map((f, i) => <Sfx key={i} at={f - 1} src="sfx/page_turn.wav" volume={0.15} />)}
      {['May', 'pastor', 'five children', 'pregnant', 'walked', 'only people', 'still out', 'gift'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={0.12} />)}
    </>
  );
};

export const Ch06: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch06_bly.wav" lead={LEAD} quiet>
    <Body />
  </ChapterShell>
);
