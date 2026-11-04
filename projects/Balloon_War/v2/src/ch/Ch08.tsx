// Chapter 8 · Gearhart Mountain. THE HEAVY CHAPTER: quiet palette (bone titles, teal lines, no coral anywhere), no jokes, no
// shouting tapes, no faces of the victims, nothing graphic, slow camera, prints fade in instead of slapping down. Forest birds under
// the first half; they stop dead on "too late", then black for a beat; then the six names by hand.
// Scene plan: script/SCENES_v2.md "ch08". Cuts 1 frame before the word that starts the idea; each scene in a <Sequence from={cut}>.
//   0:00  "May 5, 1945. A Saturday."              Gearhart Mountain pines (1964), the date
//   0:07  "The night before, in ... Bly, Oregon"  the Bly District, 1947; the chocolate cake
//   0:14  "She was 26, and pregnant"              a quiet page for Elsie (no photo used): 26, first child, almost stayed home
//   0:20  "But in the morning ... five kids"      period stand-in: picnickers in the pines, Klamath Falls 1942 (tagged: strangers)
//   0:28  "Two of them ... Dick and Joan Patzke"  their names in plain type over the forest; ten kids; a brother lost in the war
//   0:37  "While Archie parked the car"           BW04_bly_road (the car, no people)
//   0:41  "They found something"                  the hills around Gearhart Mountain, slow push; Archie's words in plain type
//   0:51  "He later said"                         "I hurriedly called a warning..." plain type over the dark woods
//   0:55  "...too late."                          birdsong stops; black
//   0:57  "Elsie and all five children"           the six names written by hand on a cream slip, one by one; ages 11 to 14
//   1:06  "When Dick and Joan's sister Dottie"    the slip fades; Dottie's question in plain type on black
//   1:13  "the only people killed"                the Mitchell Monument
//   1:19  "here's the hardest part"               the pines, the balloon "hadn't just arrived"
//   1:22  "lying in those woods for about a month" launches by month (stand-in for the LandingMap), the Bly pin in cream
//   1:28  "The silence beat the balloons"         the 1945 press code
//   1:33  "almost nobody in Bly knew"             the pines, closer
//   1:40  "an unidentified object"                typed on black
//   1:45  "Three days later, Germany surrendered" WAR OVER IN EUROPE on the chalkboard
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import words from '../../public/audio/v2_ch08_gearhart_mountain.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Note} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {SilScene} from '../kit/silparallax';
import {FullPhoto, NoPhoto, Plain, QuietPrint, Typed, Zoom} from './ch08/parts';
import {NameSlip} from './ch08/names';
import {Launches} from './ch08/launches';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);

const IMG = 'img/ch06_bly/';
type S = {t: TL; a: number; b: number};

/** "May 5, 1945. A Saturday. About two weeks after Japan launched its last balloon." */
const DateCard: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <FullPhoto src={`${IMG}gearhart_mountain_ponderosa_pine_1964.jpg`} size={[1390, 1925]} fx={700} fy={1000} z0={1.0} z1={1.05} a={0} b={b - a} dim={0.08}
      tag="Ponderosa pines, Gearhart Mountain · USFS / National Archives" />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,7,5,0.75) 0%, rgba(8,7,5,0.2) 60%, transparent 100%)'}} />
    <Highlight text="MAY 5, 1945" x={170} y={300} size={84} at={t.at('May') - a} seed={81} rot={-2} />
    <Note text="a Saturday" x={230} y={460} size={58} rot={-3} at={t.at('Saturday') - a} />
    <Note text="two weeks after the last launch" x={230} y={600} size={50} rot={-3} at={t.at('About two') - a} />
  </AbsoluteFill>
);

/** "The night before, in the small town of Bly, Oregon, Elsie Mitchell baked a chocolate cake for a church picnic." */
const Bly: React.FC<S> = ({t, a, b}) => {
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Zoom a={0} b={b - a} s={1.04} ox={900} oy={500}>
        <QuietPrint src={`${IMG}bly_district_fremont_nf_1947.jpg`} x={220} y={150} w={1180} h={700} at={0} rot={-1} pos="50% 60%"
          tag="The Bly District, Fremont National Forest, 1947 · USFS / National Archives" />
      </Zoom>
      <Note text="Bly, Oregon" x={1300} y={170} size={64} rot={-4} at={t.at('Bly') - a} />
      <Note text="a chocolate cake" x={1180} y={800} size={58} rot={-3} at={t.at('chocolate') - a} />
    </AbsoluteFill>
  );
};

/** "She was 26, and pregnant with her first child. She hadn't been feeling well, and she almost stayed home." */
const Elsie: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <AbsoluteFill style={{background: 'radial-gradient(circle 700px at 760px 420px, rgba(255,214,160,0.07) 0%, transparent 100%)'}} />
    <Plain parts={[['Elsie Mitchell', 2]]} x={300} y={240} w={1300} size={84} />
    <NoPhoto text="No photo used" at={8} x={306} y={370} />
    <Note text="26" x={320} y={480} size={72} rot={-3} at={t.at('26') - a} />
    <Note text="expecting her first child" x={520} y={490} size={56} rot={-3} at={t.at('pregnant') - a} />
    <Note text="she almost stayed home" x={420} y={680} size={56} rot={-3} at={t.at('almost') - a} />
  </AbsoluteFill>
);

/** "But in the morning, she and her husband, a pastor named Archie Mitchell, drove five kids... to fish and have lunch." */
const Morning: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    {/* TODO(3D): GearhartTerrain (the Gearhart Mountain area as a quiet teal-contour slab, one small cream marker, no figures) for
        "up into the mountains": a beat from "up into the mountains" (t.at('up into')) on the slab, then this stand-in print. */}
    <Zoom a={0} b={b - a} s={1.05} ox={760} oy={480}>
      <QuietPrint src={`${IMG}klamath_falls_picnickers_in_pines_1942.jpg`} x={220} y={120} w={880} h={720} at={0} rot={1} pos="50% 55%" crop={1.14}
        tag="Klamath Falls, 1942 · not the Mitchell party · Russell Lee, Library of Congress" />
    </Zoom>
    <Note text="Archie, a pastor" x={1170} y={230} size={52} rot={-3} at={t.at('pastor') - a} />
    <Note text="five kids from church" x={1150} y={420} size={54} rot={-3} at={t.at('five') - a} />
    <Note text="to fish, and have lunch" x={1170} y={610} size={52} rot={-3} at={t.at('fish') - a} />
  </AbsoluteFill>
);

/** "Two of them were a brother and sister, Dick and Joan Patzke. Their family had ten kids. One of their brothers had already died in the war." */
const Patzke: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <FullPhoto src={`${IMG}forest_fog_fremont_winema_usfs.jpg`} size={[3840, 2568]} fx={1900} fy={1500} z0={1.04} z1={1.1} a={0} b={b - a} dim={0.45}
      tag="Fremont-Winema National Forest · USFS" />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.35)'}} />
    <Plain parts={[['Dick and Joan Patzke', t.at('Dick') - a]]} x={240} y={250} w={1400} size={84} who="Brother and sister · no photos used" />
    <Note text="ten kids in the family" x={300} y={560} size={56} rot={-3} at={t.at('ten') - a} />
    <Note text="one brother already lost in the war" x={300} y={720} size={56} rot={-3} at={t.at('One of their') - a} />
  </AbsoluteFill>
);

/** "While Archie parked the car, Elsie and the kids walked ahead into the trees." The road, the car, no people. */
const Parked: React.FC<S> = ({a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW04_bly_road" a={0} b={b - a} fade={1} cam={{z: [1.05, 1.1], x: [10, -14], y: [0, -6]}} fog={0.3} />
  </AbsoluteFill>
);

/** "They found something, and called him over. He said, 'Wait a minute...' He was about forty feet away. ...rumors" */
const Found: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <FullPhoto src={`${IMG}hills_around_gearhart_mountain_usfs.jpg`} size={[3840, 2560]} fx={1900} fy={1300} z0={1.02} z1={1.1} a={0} b={b - a} dim={0.15}
      tag="Hills around Gearhart Mountain · USFS" />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,7,5,0.75) 0%, rgba(8,7,5,0.35) 45%, rgba(8,7,5,0.6) 100%)'}} />
    <Plain parts={[['“Wait a minute, and I’ll come and look at it.”', t.at('Wait') - a]]} x={180} y={170} w={1500} size={60} who="Archie Mitchell" />
    <Note text="about forty feet away" x={260} y={640} size={60} rot={-3} at={t.at('forty') - a} />
    <Note text="he'd heard rumors" x={1080} y={780} size={56} rot={-3} at={t.at('rumors') - a} />
  </AbsoluteFill>
);

/** "He later said, 'I hurriedly called a warning to them... but it was too late.'" Then black. */
const Later: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <FullPhoto src={`${IMG}gearhart_mountain_ponderosa_pine_alt_1964.jpg`} size={[1410, 1880]} fx={700} fy={800} z0={1.06} z1={1.1} a={0} b={b - a} dim={0.55}
      tag="Ponderosa pines, Gearhart Mountain · USFS / National Archives" />
    <AbsoluteFill style={{background: 'rgba(5,5,4,0.55)'}} />
    <Plain parts={[['“I hurriedly called a warning to them…\n', t.at('I hurriedly') - a], ['but it was too late.”', t.at('but it was') - a]]}
      x={180} y={380} w={1560} size={62} who="Archie Mitchell, later" whoAt={t.at('I hurriedly') - a + 10} />
  </AbsoluteFill>
);

/** Black for a beat, then the six names, one by one; the slip fades; Dottie's question on black. */
const Names: React.FC<S> = ({t, a}) => {
  const n = (p: string, k = 1) => t.at(p, k) - a;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <NameSlip at={n('children') - 6} out={n('there were cars')} x={660} y={90} w={600}
        names={[['Elsie', n('children') + 10], ['Joan', n('Joan', 2)], ['Dick', n('Dick', 2)], ['Jay', n('Jay')], ['Eddie', n('Eddie')], ['Sherman', n('Sherman')]]}
        footer={['The children were 11 to 14', n('between')]} />
      <Plain parts={[['“Is Dick dead? ', n('Is Dick')], ['Or Joan dead?”', n('Or Joan')]]} x={260} y={420} w={1400} size={66} align="center"
        who="Dottie Patzke, their sister" whoAt={n('Is Dick') + 12} />
    </AbsoluteFill>
  );
};

/** "They were the only people killed by enemy action on the American mainland in the whole war." */
const Monument: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <FullPhoto src={`${IMG}mitchell_monument_usfs_2007.jpg`} size={[1920, 1276]} fx={960} fy={600} z0={1.03} z1={1.1} a={0} b={b - a} dim={0.05}
      tag="The Mitchell Monument, Gearhart Mountain, 2007 · USFS" />
    <Note text="the only ones" x={1060} y={170} size={58} rot={-3} at={t.at('only') - a} />
    <Note text="on the American mainland" x={1020} y={800} size={52} rot={-3} at={t.at('mainland') - a} />
  </AbsoluteFill>
);

/** "And here's the hardest part. That balloon hadn't just arrived." */
const Hardest: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Zoom a={0} b={b - a} s={1.04} ox={700} oy={540}>
      <QuietPrint src={`${IMG}gearhart_mountain_ponderosa_pine_1964.jpg`} x={300} y={110} w={600} h={800} at={0} rot={-1} pos="50% 50%"
        tag="Gearhart Mountain · USFS / National Archives" />
    </Zoom>
    <Highlight text="THE HARDEST PART" x={1010} y={300} size={70} at={t.at('hardest') - a} seed={83} rot={-2} />
    <Note text="it hadn't just arrived" x={1060} y={520} size={60} rot={-3} at={t.at("hadn't just") - a} />
  </AbsoluteFill>
);

/** "It had probably been lying in those woods for about a month. Since around the time Japan gave up." */
const Month: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    {/* TODO(3D): LandingMap (pins in date order, launches dropping to zero in April, one cream pin at Bly on 5 May) */}
    <Launches at={2} pin={t.at('lying') - a} month={t.at('month') - a} gaveUp={t.at('gave up') - a} />
  </AbsoluteFill>
);

/** "The silence beat the balloons. Japan never learned they worked, so it stopped." */
const SilenceWon: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Zoom a={0} b={b - a} s={1.04} ox={560} oy={500}>
      <QuietPrint src="img/v2/price/code_of_wartime_practices_press_radio_may1945.jpg" x={300} y={90} w={520} h={816} at={0} rot={-1} fit="contain"
        tag="Code of Wartime Practices, 1945 · Office of Censorship" />
    </Zoom>
    <Note text="the silence worked" x={960} y={260} size={60} rot={-3} at={t.at('silence beat') - a} />
    <Note text="Japan never knew they worked" x={960} y={460} size={50} rot={-3} at={t.at('never learned') - a} />
    <Note text="so it stopped" x={960} y={640} size={60} rot={-3} at={t.at('stopped') - a} />
  </AbsoluteFill>
);

/** "But the same silence meant almost nobody in Bly knew what one looked like. Nobody had told those kids not to touch it." */
const Nobody: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <FullPhoto src={`${IMG}gearhart_mountain_ponderosa_pine_alt_1964.jpg`} size={[1410, 1880]} fx={700} fy={1100} z0={1.04} z1={1.12} a={0} b={b - a} dim={0.15}
      tag="Ponderosa pines, Gearhart Mountain · USFS / National Archives" />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,7,5,0.7) 0%, rgba(8,7,5,0.25) 60%, rgba(8,7,5,0.4) 100%)'}} />
    <Note text="almost nobody in Bly knew" x={200} y={300} size={60} rot={-3} at={t.at('almost nobody') - a} />
    <Note text="nobody told those kids" x={260} y={560} size={64} rot={-3} at={t.at('Nobody had') - a} />
  </AbsoluteFill>
);

/** "Even then, the papers could only say that an unidentified object had exploded in the woods." */
const Papers: React.FC<S> = ({t, a}) => (
  <AbsoluteFill style={{background: '#050504'}}>
    <NoPhoto text="All the papers could say, May 1945" at={6} x={220} y={380} />
    <Typed text="…an unidentified object had exploded in the woods." x={220} y={440} at={t.at('unidentified') - a} dur={t.end('exploded in the woods') - t.at('unidentified')} size={46} w={1560} />
  </AbsoluteFill>
);

/** "Three days later, Germany surrendered. The country had bigger news." */
const Germany: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Zoom a={0} b={b - a + 60} s={1.05} ox={760} oy={500}>
      <QuietPrint src="img/v2/ve_day/war_over_in_europe_chalkboard_1945.jpg" x={240} y={110} w={1000} h={800} at={0} rot={-1} pos="50% 40%"
        tag="Hampton Roads, Virginia, 7 May 1945 · U.S. Army Signal Corps / National Archives" />
    </Zoom>
    <Note text="May 8, 1945" x={1330} y={260} size={62} rot={-3} at={t.at('Germany') - a} />
    <Note text="bigger news" x={1330} y={520} size={64} rot={-3} at={t.at('bigger') - a} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    night: at('The night before') - 1, elsie: at('She was 26') - 1, morning: at('But in the morning') - 1, patzke: at('Two of them') - 1,
    parked: at('While Archie') - 1, found: at('They found') - 1, later: at('He later said') - 1, black: t.end('too late') + 2,
    only: at('They were the only') - 1, hardest: at("And here's the hardest") - 1, month: at('It had probably') - 1,
    silence: at('The silence beat') - 1, nobody: at('But the same silence') - 1, papers: at('Even then') - 1, germany: at('Three days later') - 1,
  };
  const end = CH08_FRAMES - LEAD;
  const seq = (from: number, node: React.ReactNode): [number, React.ReactNode] => [from, <Sequence from={from} layout="none">{node}</Sequence>];
  const cuts: [number, React.ReactNode][] = [
    seq(0, <DateCard t={t} a={0} b={c.night} />),
    seq(c.night, <Bly t={t} a={c.night} b={c.elsie} />),
    seq(c.elsie, <Elsie t={t} a={c.elsie} b={c.morning} />),
    seq(c.morning, <Morning t={t} a={c.morning} b={c.patzke} />),
    seq(c.patzke, <Patzke t={t} a={c.patzke} b={c.parked} />),
    seq(c.parked, <Parked t={t} a={c.parked} b={c.found} />),
    seq(c.found, <Found t={t} a={c.found} b={c.later} />),
    seq(c.later, <Later t={t} a={c.later} b={c.black} />),
    seq(c.black, <Names t={t} a={c.black} b={c.only} />),
    seq(c.only, <Monument t={t} a={c.only} b={c.hardest} />),
    seq(c.hardest, <Hardest t={t} a={c.hardest} b={c.month} />),
    seq(c.month, <Month t={t} a={c.month} b={c.silence} />),
    seq(c.silence, <SilenceWon t={t} a={c.silence} b={c.nobody} />),
    seq(c.nobody, <Nobody t={t} a={c.nobody} b={c.papers} />),
    seq(c.papers, <Papers t={t} a={c.papers} b={c.germany} />),
    seq(c.germany, <Germany t={t} a={c.germany} b={end} />),
  ];
  // soft cuts only before the silence; none into the black, the names or Dottie
  const soft = [c.night, c.elsie, c.morning, c.patzke, c.parked, c.found, c.later, c.only, c.hardest, c.month, c.silence, c.nobody, c.germany];
  const notes = ['Saturday', 'About two', 'Bly', 'chocolate', '26', 'pregnant', 'almost stayed', 'pastor', 'five kids', 'fish', 'ten', 'One of their', 'forty', 'rumors',
    'only', 'mainland', "hadn't just", 'month', 'gave up', 'silence beat', 'never learned', 'stopped', 'almost nobody', 'Nobody had', 'Germany', 'bigger'];
  const names: [string, number][] = [['Joan', 2], ['Dick', 2], ['Jay', 1], ['Eddie', 1], ['Sherman', 1]];
  return (
    <>
      {useScene(cuts)}
      {/* forest birds, stopping dead on "too late" */}
      <Sequence from={0} durationInFrames={c.black - 2} layout="none">
        <Audio src={staticFile('sfx/forest_birds.wav')} loop volume={(f) => interpolate(f, [0, 20], [0, 0.13], clamp)} />
      </Sequence>
      {soft.map((f) => <Sfx key={f} at={f} src="sfx/whoosh.wav" volume={0.1} />)}
      {notes.map((p) => <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume * 0.8} />)}
      <Sfx at={at('children') + 8} src={WRITE.src} volume={WRITE.volume * 0.8} />
      {names.map(([p, k]) => <Sfx key={`n${p}`} at={at(p, k) - 2} src={WRITE.src} volume={WRITE.volume * 0.8} />)}
      <Sfx at={at('children') - 6} src="sfx/paper_slap_soft.wav" volume={0.18} />
      <Sfx at={at('unidentified')} src="sfx/typewriter.wav" volume={0.12} />
    </>
  );
};

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/v2_ch08_gearhart_mountain.wav" lead={LEAD} quiet music={[]}>
    <Body />
  </ChapterShell>
);
