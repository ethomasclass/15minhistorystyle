// Chapter 7 · The Newspaperman (and the mid-video subscribe plug). Scene plan: script/SCENES_v2.md "ch07"; build brief:
// script/BUILD_BRIEF_v2.md. Ch01's pattern: cuts 1 frame before the word that starts an idea, each scene in <Sequence from={cut}>,
// beats as t.at(...) - cut. A new picture or mark every 4-8 s through the whole 137 s.
// Byron Price: no portrait (the LOC Harris & Ewing caption is unverified): BW12, his signed 1945 letter and the press code only.
//   0:00  "That question landed on the desk of a man named Byron Price." BW12
//   0:04  "almost thirty years... Associated Press" the 1942 NYT newsroom
//   0:09  "the Office of Censorship" the lapel pin (Silentium victoriam accelerat)
//   0:14  "A newspaperman, whose job was now keeping things out of the newspaper." a drawn front page, a column cut out
//   0:19  "Mostly, Price didn't order anybody around. He asked... voluntarily" his signed letter + the press code booklet
//   0:29  "Japan was reading American newspapers" BW13 presses
//   0:37  "that explosion in Wyoming had already made the papers" the drawn page, one small item circled
//   0:40  "So on January 4, 1945... don't report the balloons. Nothing." a typed request (a re-creation), NOTHING.
//   0:52  "from coast to coast, they did" the NYT presses + a row of blank front pages
//   0:57  "The silence left Japan blind... a Chinese newspaper. After that, nothing." notes on the dark desk
//   1:06  Quote card: "baffled the Japanese, annoyed and hindered them"
//   1:12  "In March, one hit a power line" Bonneville lines; "shut down Hanford" the 100-B area; JAPAN NEVER FOUND OUT
//   1:27  "you can't keep a secret from Japan without keeping it from Americans, too" the collapsed balloon (coral)
//   1:35  "As the weeks went by and nobody got hurt" tally marks
//   1:39  "At some point, Price asked to warn the public... The Navy said no." BW12, slower (no date implied)
//   1:45  "Back in Japan... the plants making the gas" the Otsu launch site
//   1:51  "five months of silence... in April 1945, they gave up." launches per month to zero (placeholder for the 3D LandingMap)
//   1:59  "The silence had worked." BW12;  2:02 the plug over BW13, a small "subscribe ↓" only
//   2:11  "one more balloon in this story. And it had already landed." BW03, dim
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import words from '../../public/audio/v2_ch07_the_newspaperman.words.json';
import collapsedMask from '../../public/img/masks/collapsed.json';
import {Arrow, Highlight, JF, Loop, Note} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Quote, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {maskRef} from '../kit/maskref';
import {SilScene} from '../kit/silparallax';
import {CropPrint, FrontPage, LaunchBars, NoPhoto, Tally, Typed, TypeSfx} from './ch05/parts';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);
/** The last scene runs into the tail. */
const END = Math.ceil(N.duration * 30) + 80;
const COLLAPSED = maskRef('collapsed', collapsedMask);
const MIKESH = 'Mikesh, Smithsonian, 1973';
const COLLINS = 'Marjory Collins, Library of Congress';

/** "That question landed on the desk of a man named Byron Price." */
const Desk: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW12_price_desk" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.1], x: [16, -10], y: [0, -6]}} fog={0.2} />
    <Note text="what do you tell people?" x={1080} y={330} size={50} rot={-3} at={t.at('question') - a} />
    <Highlight text="BYRON PRICE" x={1140} y={140} size={96} at={t.at('Byron') - a} seed={71} rot={-2} />
    <NoPhoto text="Byron Price · no photo used" at={t.at('Byron') - a} />
  </AbsoluteFill>
);

/** "Price had spent almost thirty years as a reporter and editor at the Associated Press." */
const Newsroom: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch05_silence/nyt_newsroom_1942.jpg" size={[6000, 4578]} x={300} y={150} w={1320} h={700} fx={3000} fy={2400} z={[1.1, 1.17]}
      a={0} b={b - a} at={1} rot={-1} tag={`A newsroom: The New York Times, 1942 · ${COLLINS}`} />
    <Note text="almost 30 years" x={1180} y={130} size={60} rot={-4} at={t.at('thirty') - a} />
    <Highlight text="ASSOCIATED PRESS" x={150} y={112} size={68} at={t.at('Associated') - a} seed={72} rot={-2} />
  </AbsoluteFill>
);

/** "Then the war came, and the government put him in charge of the Office of Censorship." */
const Pin: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch05_silence/office_of_censorship_pin.jpg" size={[960, 962]} x={330} y={200} w={600} h={600} fx={480} fy={481} at={1} rot={-2}
      tag="Office of Censorship lapel pin · Wikimedia Commons" />
    <Highlight text="CENSORSHIP" x={1040} y={290} size={100} at={t.at('Office') - a} seed={73} rot={-3} />
    <Note text="“silence speeds victory”" x={1020} y={520} size={54} rot={-3} at={t.at('Censorship') - a + 6} />
    <Arrow x1={1010} y1={570} x2={760} y2={510} bow={30} at={t.at('Censorship') - a + 16} />
  </AbsoluteFill>
);

/** "A newspaperman, whose job was now keeping things out of the newspaper." */
const Aside: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <FrontPage x={1020} y={110} w={640} h={860} at={1} rot={2} seed="aside" hole={[2, 1, 17]} holeAt={t.at('out') - a} />
    <Highlight text="A NEWSPAPERMAN" x={140} y={220} size={76} at={t.at('newspaperman') - a} seed={74} rot={-2} />
    <Note text="...keeping news OUT" x={170} y={460} size={64} rot={-4} at={t.at('keeping') - a} />
  </AbsoluteFill>
);

/** "Mostly, Price didn't order anybody around. He asked. Newspapers and radio stations agreed, voluntarily..." */
const Asked: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/v2/price/byron_price_letter_to_president_nov1945.jpg" size={[2067, 1758]} x={140} y={170} w={760} h={646} fx={1033} fy={879} at={1} rot={-2}
      tag="Byron Price to President Truman, Nov. 1945 · Office of Censorship">
      {(S) => {
        const [sx, sy] = S(1590, 1625);
        return <Loop cx={sx} cy={sy} rx={170} ry={44} at={t.at("Price didn't") - a} seed={75} />;
      }}
    </CropPrint>
    <Note text="he asked." x={300} y={110} size={66} rot={-3} at={t.at('asked') - a} />
    <CropPrint src="img/v2/price/code_of_wartime_practices_press_radio_may1945.jpg" size={[2523, 3958]} x={1120} y={110} w={520} h={816} fx={1261} fy={1979}
      at={t.at('Newspapers') - a} rot={2} tag="Code of Wartime Practices, 1945 · Office of Censorship" />
    <Note text="voluntarily" x={1040} y={720} size={78} rot={-8} at={t.at('voluntarily') - a} />
  </AbsoluteFill>
);

/** "And the balloons were exactly that kind of thing. Japan was reading American newspapers, looking for proof the balloons were working." */
const Reading: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW13_presses" a={0} b={b - a} fade={1} cam={{z: [1.05, 1.12], x: [-20, 16], y: [0, -8]}} fog={0.25} />
    <Note text="exactly that kind of thing" x={980} y={300} size={54} rot={-3} at={t.at('exactly') - a} />
    <Highlight text="JAPAN WAS READING" x={140} y={140} size={84} at={t.at('Japan') - a} seed={76} rot={-2} />
    <Note text="looking for proof it worked" x={1000} y={420} size={54} rot={-3} at={t.at('proof') - a} />
  </AbsoluteFill>
);

/** "And that explosion in Wyoming had already made the papers." */
const MadePapers: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <FrontPage x={640} y={110} w={640} h={860} at={1} rot={-1} seed="wyo" />
    <Loop cx={1178} cy={835} rx={100} ry={84} at={t.at('Wyoming') - a} seed={77} />
    <Note text="already in the papers" x={130} y={520} size={60} rot={-4} at={t.at('papers') - a} />
    <Arrow x1={720} y1={600} x2={1070} y2={810} bow={40} at={t.at('papers') - a + 10} />
  </AbsoluteFill>
);

/** "So on January 4, 1945, Price's office asked every newspaper and radio station in the country: don't report the balloons. Nothing. Not one word." */
const Jan4: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Typed x={330} y={150} w={1260} h={580} at={1} rot={-1} label="re-creation" lines={[
      {text: 'JANUARY 4, 1945', at: t.at('January') - a, bold: true},
      {text: 'To every newspaper and radio station:', at: t.at('every') - a, gap: 40},
      {text: "Don't report the balloons.", at: t.at("don't") - a, gap: 40, size: 56, bold: true},
    ]} />
    <Highlight text="NOTHING." x={1150} y={760} size={110} at={t.at('Nothing') - a} seed={78} rot={-3} />
    <Note text="not one word" x={380} y={800} size={66} rot={-3} at={t.at('Not one') - a} />
  </AbsoluteFill>
);

/** "Nobody had to go along with it. And yet, from coast to coast, they did." */
const CoastToCoast: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch05_silence/nyt_presses_start_rolling_1942.jpg" size={[4808, 4769]} x={130} y={160} w={620} h={620} fx={2500} fy={2450} z={[1.12, 1.12]}
      at={1} rot={-2} tag={`The Times presses start rolling, 1942 · ${COLLINS}`} />
    <Note text="nobody had to" x={860} y={170} size={62} rot={-4} at={t.at('Nobody') - a} />
    {[0, 1, 2, 3, 4].map((i) => (
      <FrontPage key={i} x={860 + i * 186} y={340 + (i % 2) * 24} w={168} h={232} at={t.at('coast') - a + i * 4} rot={(i % 2 ? 3 : -3)} seed={`cc${i}`} blank />
    ))}
    <Highlight text="THEY DID" x={1120} y={720} size={110} at={t.at('did') - a} seed={79} rot={-3} />
  </AbsoluteFill>
);

/** "The silence left Japan blind. It heard about that one balloon in Wyoming, from a Chinese newspaper. After that, nothing." */
const Blind: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Highlight text="JAPAN: BLIND" x={150} y={140} size={96} at={t.at('blind') - a} seed={80} rot={-2} />
    <Note text="it heard of one balloon: Wyoming" x={170} y={340} size={56} rot={-3} at={t.at('heard') - a} />
    <Note text="...from a Chinese newspaper" x={210} y={470} size={56} rot={-3} at={t.at('Chinese') - a} />
    <FrontPage x={1320} y={260} w={420} h={560} at={t.at('Chinese') - a} rot={4} seed="china" />
    <Note text="after that: nothing" x={250} y={640} size={66} rot={-3} at={t.at('nothing', 2) - a} />
  </AbsoluteFill>
);

/** Price's office told editors their silence had "baffled the Japanese, annoyed and hindered them." */
const Baffled: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="Price's office, to editors:" x={200} y={200} size={58} rot={-3} at={t.at('told') - a} />
    <Quote text="baffled the Japanese, annoyed and hindered them." at={t.at('baffled') - a - 3} x={200} y={360} w={1500} size={80} who="Office of Censorship, to editors" />
  </AbsoluteFill>
);

/** "And the balloons weren't harmless. In March, one hit a power line in Washington State" */
const PowerLine: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch05_silence/bonneville_transmission_lines_1941.jpg" size={[6000, 4910]} x={300} y={140} w={1320} h={700} fx={3000} fy={2500} z={[1.12, 1.2]}
      a={0} b={b - a} at={1} rot={-1} tag="Bonneville power lines (the grid that fed Hanford), 1941 · Russell Lee, Library of Congress">
      {(S) => {
        const [lx, ly] = S(4400, 2250);
        return <Loop cx={lx} cy={ly} rx={240} ry={120} at={t.at('power') - a} seed={81} tilt={-15} />;
      }}
    </CropPrint>
    <Highlight text="NOT HARMLESS" x={150} y={110} size={84} at={t.at('harmless') - a} seed={82} rot={-3} />
    <Note text="March 1945" x={880} y={170} size={62} rot={-3} at={t.at('March') - a} />
  </AbsoluteFill>
);

/** "...and shut down Hanford, the top-secret plant making plutonium for the atomic bomb. It took about three days... Japan never found out." */
const Hanford: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch05_silence/hanford_b_reactor_100b_area_1944.jpg" size={[3605, 2760]} x={300} y={120} w={1320} h={680} fx={1800} fy={1380} z={[1.05, 1.13]}
      a={0} b={b - a} at={1} rot={1} tag="Hanford's 100-B area, 1944–45 · National Archives (DOE)" />
    <Highlight text="HANFORD" x={150} y={110} size={100} at={t.at('Hanford') - a} seed={83} rot={-3} />
    <Note text="plutonium → the atomic bomb" x={760} y={690} size={58} rot={-3} at={t.at('plutonium') - a} />
    <Note text="about 3 days to full power" x={1000} y={170} size={56} rot={-3} at={t.at('three') - a} />
    <Highlight text="JAPAN NEVER FOUND OUT" x={360} y={860} size={70} at={t.at('Japan never') - a} seed={84} rot={-2} />
  </AbsoluteFill>
);

/** "But you can't keep a secret from Japan without keeping it from Americans, too. Nobody could be told what to look for, or not to touch one." */
const Secret: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch04_paper_balloon/collapsed_balloon_on_ground_nara285257.jpg" size={[1920, 1488]} x={960} y={200} w={800} h={620} fx={960} fy={744}
      at={1} rot={-2} mask={COLLAPSED} tintAt={4} tag="Balloon envelope on the ground · National Archives" />
    <Highlight text="AMERICANS TOO" x={150} y={200} size={92} at={t.at('Americans') - a} seed={85} rot={-3} />
    <Note text="what to look for?" x={180} y={430} size={62} rot={-3} at={t.at('look') - a} />
    <Note text="don't touch it" x={220} y={570} size={62} rot={-3} at={t.at('touch') - a} />
  </AbsoluteFill>
);

/** "As the weeks went by and nobody got hurt, the risk seemed worth it." */
const Weeks: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="weeks go by..." x={300} y={240} size={62} rot={-3} at={t.at('weeks') - a} />
    <Tally x={320} y={420} n={14} at={t.at('weeks') - a + 4} every={5} h={160} />
    <Note text="nobody hurt" x={1000} y={460} size={66} rot={-4} at={t.at('nobody got') - a} />
    <Note text="worth the risk?" x={1040} y={620} size={62} rot={-4} at={t.at('risk') - a} />
  </AbsoluteFill>
);

/** "At some point, Price asked to warn the public about the danger, at least partly. The Navy said no." (no date implied) */
const Warn: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW12_price_desk" a={0} b={b - a} fade={1} cam={{z: [1.12, 1.15], x: [-10, -16], y: [-6, -8]}} fog={0.2} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.2)'}} />
    <Note text="warn the public?" x={1080} y={160} size={60} rot={-3} at={t.at('warn') - a} />
    <Note text="...at least partly" x={1160} y={260} size={48} rot={-3} at={t.at('least') - a} />
    <Note text="the Navy said no." x={1100} y={380} size={76} rot={-4} at={t.at('Navy') - a} />
  </AbsoluteFill>
);

/** "Back in Japan, American bombers had hit the plants making the gas that filled the balloons." */
const Otsu: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <CropPrint src="img/ch04_paper_balloon/otsu_launch_site_sc284816.jpg" size={[1470, 1115]} x={300} y={150} w={1320} h={700} fx={735} fy={600} z={[1.05, 1.14]}
      a={0} b={b - a} at={1} rot={-1} tag={`The Otsu launch site, after the war · US Army, via ${MIKESH}`} />
    <Note text="back in Japan" x={170} y={124} size={60} rot={-4} at={t.at('Back in') - a} />
    <Note text="the gas plants: bombed" x={900} y={740} size={62} rot={-3} at={t.at('plants') - a} />
  </AbsoluteFill>
);

/** "And after five months of silence, the generals had no proof... So in April 1945, they gave up." */
const GaveUp: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const b0 = t.at('after five') - a;
  return (
    <AbsoluteFill>
      <DarkPaper />
      {/* TODO(3D): LandingMap — its launches-per-month counter dropping to zero in April replaces these drawn bars */}
      <LaunchBars x={330} base={830} ats={[b0, b0 + 14, b0 + 28, b0 + 42, b0 + 56, t.at('April') - a, t.at('gave') - a]} />
      <div style={{position: 'absolute', left: 330, top: 900, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase'}}>
        Balloons launched per month, 1944–45 · {MIKESH}
      </div>
      <Note text="5 months of silence" x={250} y={130} size={58} rot={-3} at={t.at('silence', 3) - a} />
      <Note text="no proof it worked" x={290} y={240} size={58} rot={-3} at={t.at('no proof') - a} />
      <Highlight text="THEY GAVE UP" x={1060} y={130} size={84} at={t.at('gave') - a} seed={86} rot={-3} />
    </AbsoluteFill>
  );
};

/** "The silence had worked." Then the plug ("Quick favor...") stays on Price's desk until the presses take over. */
const Worked: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW12_price_desk" a={0} b={b - a} fade={1} cam={{z: [1.08, 1.04], x: [10, 0], y: [-4, 0]}} fog={0.2} />
    <Highlight text="THE SILENCE HAD WORKED" x={300} y={440} size={96} at={t.at('silence had worked') - a} seed={87} rot={-2} />
  </AbsoluteFill>
);

/** The plug: "If you're enjoying this, hit subscribe... unlike those newspapers in 1945, you're allowed to tell your friends." */
const Plug: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW13_presses" a={0} b={b - a} fade={1} cam={{z: [1.12, 1.04], x: [24, -24], y: [-6, 4]}} fog={0.3} />
    <Note text="subscribe ↓" x={1480} y={850} size={46} rot={-4} at={t.at('subscribe') - a} />
  </AbsoluteFill>
);

/** "Because there was one more balloon in this story. And it had already landed." */
const Landed: React.FC<{a: number; b: number}> = ({a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW03_woods_open" a={0} b={b - a} fade={1} cam={{z: [1.16, 1.08], x: [-20, 0], y: [-10, 0]}} fog={0.45} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.5)'}} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    ap: at('Price had') - 1, censor: at('Then the war') - 1, aside: at('A newspaperman') - 1, asked: at('Mostly') - 1,
    reading: at('And the balloons were') - 1, papers: at('And that explosion') - 1, jan4: at('So on January') - 1, coast: at('Nobody had') - 1,
    blind: at('The silence left') - 1, quote: at("Price's office told") - 1, power: at("And the balloons weren't") - 1, hanford: at('and shut') - 1,
    secret: at("But you can't keep") - 1, weeks: at('As the weeks') - 1, warn: at('At some point') - 1, back: at('Back in Japan') - 1,
    bars: at('And after five') - 1, worked: at('The silence had') - 1, plug: at("If you're") - 1, last: at('Because there') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Desk t={t} a={0} b={c.ap} />],
    [c.ap, <Sequence from={c.ap} layout="none"><Newsroom t={t} a={c.ap} b={c.censor} /></Sequence>],
    [c.censor, <Sequence from={c.censor} layout="none"><Pin t={t} a={c.censor} /></Sequence>],
    [c.aside, <Sequence from={c.aside} layout="none"><Aside t={t} a={c.aside} /></Sequence>],
    [c.asked, <Sequence from={c.asked} layout="none"><Asked t={t} a={c.asked} /></Sequence>],
    [c.reading, <Sequence from={c.reading} layout="none"><Reading t={t} a={c.reading} b={c.papers} /></Sequence>],
    [c.papers, <Sequence from={c.papers} layout="none"><MadePapers t={t} a={c.papers} /></Sequence>],
    [c.jan4, <Sequence from={c.jan4} layout="none"><Jan4 t={t} a={c.jan4} /></Sequence>],
    [c.coast, <Sequence from={c.coast} layout="none"><CoastToCoast t={t} a={c.coast} /></Sequence>],
    [c.blind, <Sequence from={c.blind} layout="none"><Blind t={t} a={c.blind} /></Sequence>],
    [c.quote, <Sequence from={c.quote} layout="none"><Baffled t={t} a={c.quote} /></Sequence>],
    [c.power, <Sequence from={c.power} layout="none"><PowerLine t={t} a={c.power} b={c.hanford} /></Sequence>],
    [c.hanford, <Sequence from={c.hanford} layout="none"><Hanford t={t} a={c.hanford} b={c.secret} /></Sequence>],
    [c.secret, <Sequence from={c.secret} layout="none"><Secret t={t} a={c.secret} /></Sequence>],
    [c.weeks, <Sequence from={c.weeks} layout="none"><Weeks t={t} a={c.weeks} /></Sequence>],
    [c.warn, <Sequence from={c.warn} layout="none"><Warn t={t} a={c.warn} b={c.back} /></Sequence>],
    [c.back, <Sequence from={c.back} layout="none"><Otsu t={t} a={c.back} b={c.bars} /></Sequence>],
    [c.bars, <Sequence from={c.bars} layout="none"><GaveUp t={t} a={c.bars} /></Sequence>],
    [c.worked, <Sequence from={c.worked} layout="none"><Worked t={t} a={c.worked} b={c.plug} /></Sequence>],
    [c.plug, <Sequence from={c.plug} layout="none"><Plug t={t} a={c.plug} b={c.last} /></Sequence>],
    [c.last, <Sequence from={c.last} layout="none"><Landed a={c.last} b={END} /></Sequence>],
  ];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {['Byron', 'Associated', 'Office', 'newspaperman', 'Japan', 'Nothing', 'did', 'blind', 'harmless', 'Hanford', 'Japan never', 'Americans', 'gave', 'silence had worked']
        .map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.22} />)}
      {['question', 'thirty', 'keeping', 'asked', 'voluntarily', 'exactly', 'proof', 'papers', 'Not one', 'Nobody', 'heard', 'Chinese', 'told', 'March',
        'plutonium', 'three', 'look', 'touch', 'weeks', 'nobody got', 'risk', 'warn', 'least', 'Navy', 'Back in', 'plants', 'no proof', 'subscribe']
        .map((p) => <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('Censorship') + 4} src={WRITE.src} volume={WRITE.volume} />
      <Sfx at={at('silence', 3) - 2} src={WRITE.src} volume={WRITE.volume} />
      {[c.ap, c.censor, c.asked, c.coast, c.power, c.hanford, c.secret, c.back].map((f) => <Sfx key={f} at={f + 1} src="sfx/paper_slap_soft.wav" volume={0.25} />)}
      {[c.aside, c.papers].map((f) => <Sfx key={f} at={f + 1} src="sfx/page_turn.wav" volume={0.25} />)}
      <Sfx at={at('Newspapers') - 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      <Sfx at={at('out') - 1} src="sfx/paper_rustle.wav" volume={0.25} />
      <Sfx at={at('Chinese') - 1} src="sfx/paper_slap_soft.wav" volume={0.2} />
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} at={at('coast') + i * 4} src="sfx/paper_slap_soft.wav" volume={0.15} />)}
      <TypeSfx at={at('January')} text="JANUARY 4, 1945" />
      <TypeSfx at={at('every')} text="To every newspaper and radio station:" />
      <TypeSfx at={at("don't")} text="Don't report the balloons." />
      <Sfx at={c.reading + 2} src="sfx/paper_rustle.wav" volume={0.12} />
    </>
  );
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/v2_ch07_the_newspaperman.wav" lead={LEAD} music={[{src: 'music/bw_the_newspaperman.mp3', volume: bed('bw_the_newspaperman')}]}>
    <Body />
  </ChapterShell>
);
