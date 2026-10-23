// Chapter 5 · "Treason must be made odious": Johnson, Presidential Reconstruction, the pardons, and the land going back
// on Edisto. Terms: planters, Presidential Reconstruction, homestead. Music: g_grip.
// Sources on screen: Johnson's words in the New-York Tribune (Apr. 17, 1865); the Harper's Weekly cover of Oct. 14, 1865
// (his tailor shop above, pardon-seekers at the White House below); J. Jenkins Mikell's pardon application and amnesty
// oath (an Edisto planter, Aug. 1865, NARA M1003); the Edisto committee's letter to Howard (Oct. 1865, NARA M752).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch05_treason_odious.words.json';
import TR from '../../public/img/ch05/treason_must_be_made_odious_ny_tribune_17apr1865.json';
import {Sfx} from '../kit/common';
import {Highlight, Tag} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Quote, useScene} from '../kit/shell';
import {EpBoard} from '../kit/ep1board';
import {type Box, DocShot, EDISTO, LETTER_P1, Slip, Swipe} from '../kit/rc';
import {MASKS} from '../masks';
import {Cuts, DarkPaper, DeskPrint, Full, QuietPrint} from './ch04_kit';

const N = words as Narration;
const t = makeTimeline(N, 30);
export const CH05_FRAMES = chapterFrames(N, LEAD);

const I = 'img/ch05/';
const TRS = TR.size as [number, number];
const TR_LINE: Box = [425, 266, 512, 29];                                  // "treason must be made odious"
const HW_TAILOR: Box = [905, 1458, 742, 26];                               // "ANDREW JOHNSON'S TAILOR-SHOP IN GREENVILLE, TENNESSEE."
const MK_EDISTO: Box[] = [[1525, 1640, 375, 58], [130, 1688, 290, 60]];    // "Edisto Island / (1765 acres)"
const LT_PROMISED: Box[] = [[760, 1680, 650, 70], [310, 1762, 1005, 72]];  // "we were promised / Homestead's by the government"
const PF = 'grayscale(1) contrast(1.25) brightness(1.02)';

const SRC = {
  johnson: 'Andrew Johnson, 1865 (A. Bogardus & Co.) · Library of Congress',
  harpers: "Harper's Weekly, Oct. 14, 1865 · Library of Congress",
  hopkinson: 'Mansion of James Hopkinson, Edisto Island, S.C., 1862 (Henry P. Moore) · Library of Congress',
  johnsonB: 'Andrew Johnson, engraving, c.1865 · Library of Congress',
  tribune: 'New-York Daily Tribune, April 17, 1865 · Library of Congress',
  capitol: 'The Capitol, March 4, 1865 (Alexander Gardner) · Library of Congress',
  oath: 'Amnesty oath signed by J. Jenkins Mikell of Edisto Island, Aug. 1865 · National Archives',
  mikell: 'J. Jenkins Mikell to President Johnson, pardon application, Aug. 1865 · National Archives',
  seabrook: 'Mansion of John E. Seabrook, Edisto Island, S.C., 1862 (Henry P. Moore) · Library of Congress',
  howard: 'Gen. Oliver O. Howard · Library of Congress',
  letter: 'Edisto Island committee to Gen. O. O. Howard, Oct. 1865 · National Archives (M752)',
  reply: 'Howard to the Edisto committee, Oct. 1865 (letterpress copy, National Archives, RG 105) · text: Freedmen and Southern Society Project',
  stevens: 'Thaddeus Stevens (Brady-Handy) · Library of Congress',
  speech: "Stevens's speech at Lancaster, Pa., Sept. 7, 1865 (pamphlet) · Internet Archive",
};

// the shots (cut two frames before the phrase)
const S1 = t.at('He grew up') - 2;
const S2 = t.at('And he hated') - 2;
const S3 = t.at('When the South') - 2;
const S4 = t.at('And in April') - 2;
const S5 = t.at('But Johnson had owned') - 2;
const S6 = t.at('Congress was on a break') - 2;
const S7 = t.at('So that summer') - 2;
const S8 = t.at('It was even more') - 2;
const S9 = t.at('So they did') - 2;
const S10 = t.at('outside his office') - 2;
const S11 = t.at('Edisto Island') - 2;
const S12 = t.at('So in October') - 2;
const S13 = t.at('The families picked') - 2;
const S14 = t.at('Howard wrote back') - 2;
const S15 = t.at('In Congress') - 2;
const S16 = t.at('wanted to take land') - 2;
const S17 = t.at('Hold onto Stevens') - 2;
const S18 = t.at('But first') - 2;

const JOHNSON_PRINT = (a: number, b: number, x = 600) => (
  <DeskPrint src={I + 'andrew_johnson_portrait_1865.jpg'} size={[939, 1536]} rect={[30, 60, 910, 1420]} h={860} x={x} y={540} a={a} b={b} rot={-1.5}
    mask={MASKS.johnson} traceAt={a + 8} />
);

const Body: React.FC = () => {
  const scene = useScene([
    // the Radicals' hopes
    [0, <AbsoluteFill key="j0">
      <DarkPaper />
      {JOHNSON_PRINT(0, S1)}
      <Slip text="on their side?" x={1080} y={430} at={t.at('on their side')} />
      <Tag text={SRC.johnson} />
    </AbsoluteFill>],
    // poor, no school, a tailor: the tailor shop on the Harper's cover
    [S1, <DocShot key="hw" src={I + 'johnson_pardoning_rebels_white_house_1865.jpg'} size={[2424, 3000]} tag={SRC.harpers} filter={PF}
      keys={[[S1, {x: 1280, y: 1150, z: 1.3}], [S2, {x: 1290, y: 1180, z: 1.4}]]}
      over={<>
        <Slip text="grew up poor" x={130} y={150} at={t.at('grew up poor')} />
        <Slip text="no school" x={130} y={270} at={t.at('never went')} />
      </>}>
      <Swipe lines={[HW_TAILOR]} from={t.at('tailor')} to={t.at('tailor') + 16} seed="hw" />
    </DocShot>],
    // planters
    [S2, <Full key="ho" src={I + 'edisto_hopkinson_mansion_1862_moore.jpg'} size={[3000, 2301]} rect={[100, 150, 2900, 2200]} f0={[1700, 1250]} a={S2} b={S3}
      bw="grayscale(1) contrast(1.25) brightness(0.95)">
      {() => <>
        <Highlight text="PLANTERS" x={110} y={110} size={96} at={t.at('planters')} seed={51} rot={-2} />
        <Definition term="planters" def="the rich plantation owners who ran the South" at={t.at('planters') + 9} x={120} y={860} />
        <Tag text={SRC.hopkinson} />
      </>}
    </Full>],
    // the only senator who stayed
    [S3, <Full key="jb" src={I + 'andrew_johnson_portrait_b.jpg'} size={[2433, 3000]} rect={[490, 450, 1930, 2380]} f0={[1250, 1150]} z1={1.05} a={S3} b={S4} bw={PF}>
      {() => <><Slip text="the only one who stayed" x={1180} y={760} at={t.at('only senator')} /><Tag text={SRC.johnsonB} /></>}
    </Full>],
    // "treason must be made odious"
    [S4, <DocShot key="tr" src={I + 'treason_must_be_made_odious_ny_tribune_17apr1865.jpg'} size={TRS} tag={SRC.tribune} focusAt={S4}
      keys={[[S4, {x: 560, y: 280, z: 1.5}], [t.at('treason must'), {x: 650, y: 285, z: 1.8}], [S5, {x: 690, y: 285, z: 1.86}]]}
      over={<Slip text="odious = hated" x={1240} y={790} at={t.at('meaning hated')} />}>
      <Swipe lines={[TR_LINE]} from={t.at('treason must')} to={t.end('made odious')} seed="tr" />
    </DocShot>],
    // but: no equal rights, no vote
    [S5, <AbsoluteFill key="j1">
      <DarkPaper />
      {JOHNSON_PRINT(S5, S6, 560)}
      <Slip text="had owned enslaved people" x={1010} y={250} at={t.at('owned enslaved')} />
      <Slip text="slavery over: yes" x={1010} y={420} at={t.at('He accepted')} />
      <Slip text="equal rights, the vote: no" x={1010} y={590} at={t.at('did not believe')} />
      <Tag text={SRC.johnson} />
    </AbsoluteFill>],
    // Congress away
    [S6, <Full key="ca" src="img/ch04/lincoln_second_inauguration_4mar1865_gardner.jpg" size={[3000, 2184]} rect={[750, 415, 2245, 1490]} f0={[1500, 800]} z1={1.05} a={S6} b={S7}>
      {() => <><Slip text="Congress: away until December" x={130} y={130} at={t.at('until December')} /><Tag text={SRC.capitol} /></>}
    </Full>],
    // Presidential Reconstruction
    [S7, <AbsoluteFill key="pr">
      <DarkPaper />
      <QuietPrint src="img/wall/cr_johnson.png" size={[900, 1101]} w={400} x={1530} y={580} rot={2} a={S7} b={S8} />
      <Slip text="summer 1865 · alone" x={140} y={420} at={t.at('alone')} />
      <Highlight text="PRESIDENTIAL RECONSTRUCTION" x={110} y={120} size={70} at={t.at('Presidential Reconstruction')} seed={52} rot={-2} />
      <Definition term="Presidential Reconstruction" def="Johnson's plan to bring the South back, made without Congress" at={t.at('Presidential Reconstruction') + 9} x={120} y={820} />
      <Tag text={SRC.johnson} />
    </AbsoluteFill>],
    // the oath, and who had to ask in person
    [S8, <DocShot key="ao" src={I + 'amnesty_oath_mikell_edisto_planter_1865.jpg'} size={[2277, 3000]} tag={SRC.oath}
      keys={[[S8, {x: 1140, y: 1380, z: 0.95}], [S9, {x: 1140, y: 1420, z: 1.02}]]}
      over={<>
        <Slip text="swear loyalty → pardon" x={130} y={140} at={t.at('swore loyalty')} />
        <Slip text="worth over $20,000, or a Confederate leader: ask Johnson" x={130} y={820} size={50} at={t.at('The richest men')} />
      </>} />],
    // by the thousands
    [S9, <DocShot key="hp" src={I + 'johnson_pardoning_rebels_white_house_1865.jpg'} size={[2424, 3000]} tag={SRC.harpers} filter={PF}
      keys={[[S9, {x: 1300, y: 2180, z: 1.15}], [S10, {x: 1320, y: 2230, z: 1.25}]]}
      over={<>
        <Slip text="by the thousands" x={130} y={130} at={t.at('By the thousands')} />
        <Slip text="the planters, lining up" x={1180} y={130} at={t.at('lining up')} coral />
      </>} />],
    // one of them: an Edisto planter
    [S10, <DocShot key="mk" src={I + 'pardon_application_mikell_edisto_planter_aug1865_p1.jpg'} size={[1952, 3000]} tag={SRC.mikell}
      keys={[[S10, {x: 920, y: 300, z: 0.95}], [t.at('A pardon gave'), {x: 920, y: 330, z: 0.97}], [t.at('your property'), {x: 1060, y: 1690, z: 0.95}], [S11, {x: 1060, y: 1700, z: 0.98}]]}
      over={<Slip text="J. Jenkins Mikell, Edisto Island planter" x={130} y={820} size={54} at={S10 + 6} />}>
      <Swipe lines={MK_EDISTO} from={t.at('your property') + 6} to={t.at('like Edisto')} seed="mk" />
    </DocShot>],
    [S11, <Full key="sb" src={I + 'edisto_seabrook_mansion_1862_moore.jpg'} size={[3000, 2296]} rect={[100, 80, 2900, 2200]} f0={[1450, 1000]} a={S11} b={S12}
      bw="grayscale(1) contrast(1.25) brightness(0.95)">
      {() => <><Slip text="Edisto Island, 1862" x={130} y={130} at={S11 + 4} /><Tag text={SRC.seabrook} /></>}
    </Full>],
    // Howard sent to Edisto
    [S12, <AbsoluteFill key="hw2">
      <DarkPaper />
      <DeskPrint src={I + 'oliver_otis_howard_portrait.jpg'} size={[1056, 1536]} rect={[40, 90, 1040, 1520]} h={880} x={620} y={540} a={S12} b={S13} rot={1.5}
        mask={MASKS.howard} traceAt={S12 + 10} />
      <Slip text="October 1865" x={1080} y={250} at={t.at('October')} />
      <Slip text="Gen. Oliver O. Howard" x={1080} y={420} at={t.at('General Oliver Howard')} />
      <Slip text="the land goes back" x={1080} y={590} at={t.at('the land was going back')} />
      <Tag text={SRC.howard} />
    </AbsoluteFill>],
    // the committee's letter: homesteads
    [S13, <DocShot key="lt" src={LETTER_P1} size={EDISTO.letterSize} tag={SRC.letter}
      keys={[[S13, {x: 860, y: 740, z: 0.8}], [t.at('They wrote to Howard'), {x: 860, y: 770, z: 0.82}], [t.at('we were promised'), {x: 830, y: 1730, z: 0.98}], [S14, {x: 840, y: 1760, z: 1.04}]]}
      over={<>
        <Slip text="Bram, Moultrie, Sampson" x={1180} y={140} at={t.at('committee of three')} />
        <Highlight text="HOMESTEAD" x={110} y={110} size={92} at={t.at('homestead')} seed={53} rot={-2} />
        <Definition term="homestead" def="a farm of your own" at={t.at('homestead') + 9} x={120} y={860} />
        <Slip text="then, to the President" x={1180} y={300} at={t.at('Then they wrote')} />
      </>}>
      <Swipe lines={LT_PROMISED} from={t.at('we were promised')} to={t.end('the government')} seed="lt" />
    </DocShot>],
    // Howard's reply (no scan: typeset)
    [S14, <AbsoluteFill key="rp">
      <DarkPaper />
      <DeskPrint src={I + 'oliver_otis_howard_portrait.jpg'} size={[1056, 1536]} rect={[40, 90, 1040, 1520]} h={600} x={1520} y={520} a={S14} b={S15} rot={2} />
      <Quote text="…right in wanting homesteads…" at={t.at('right in wanting')} x={150} y={300} w={1100} size={74} />
      <Quote text="…Congress must meet…" at={t.at('Congress must meet')} x={150} y={520} w={1100} size={74} who="O. O. Howard to the Edisto committee, Oct. 1865" />
      <Tag text={SRC.reply} />
    </AbsoluteFill>],
    // Stevens
    [S15, <Full key="st" src={I + 'thaddeus_stevens_brady_handy.jpg'} size={[2323, 3000]} rect={[250, 600, 2100, 2950]} f0={[1180, 1450]} z1={1.05} a={S15} b={S16}
      mask={MASKS.stevens} traceAt={S15 + 10}>
      {() => <><Slip text="Thaddeus Stevens" x={1360} y={150} at={t.at('Thaddeus Stevens')} /><Slip text="a Radical leader" x={1360} y={270} at={t.at('Radical leader')} /><Tag text={SRC.stevens} /></>}
    </Full>],
    [S16, <DocShot key="sp" src={I + 'stevens_lancaster_speech_reconstruction_1865_title.jpg'} size={[1975, 3000]} tag={SRC.speech}
      keys={[[S16, {x: 990, y: 1200, z: 0.62}], [S17, {x: 990, y: 1260, z: 0.7}]]}
      over={<>
        <Slip text="40 acres for every freed family" x={1080} y={300} at={t.at('40 acres')} />
        <Slip text="too far, said most Republicans" x={1080} y={640} at={t.at('most Republicans')} />
      </>} />],
    [S17, <AbsoluteFill key="sr">
      <DarkPaper />
      <QuietPrint src="img/wall/cr_stevens.png" size={[900, 1134]} w={560} x={760} y={540} rot={-1.5} a={S17} b={S18} />
      <Slip text="remember him" x={1200} y={420} size={70} at={t.at('Hold onto')} />
      <Tag text={SRC.stevens} />
    </AbsoluteFill>],
    [S18, <EpBoard key="b" ch={5} from={S18} at={t.at('What was it going to do')} />],
  ]);
  return (
    <>
      {scene}
      <Cuts at={[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17]} volume={0.22} />
      {[t.at('planters'), t.at('Presidential Reconstruction'), t.at('homestead')].map((a) => <Sfx key={a} at={a} src="sfx/stamp.wav" volume={0.32} />)}
      {[t.at('tailor'), t.at('treason must'), t.at('your property') + 6, t.at('we were promised')].map((a) => <Sfx key={a} at={a} src="sfx/marker_tick.wav" volume={0.22} />)}
    </>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_treason_odious.wav" lead={LEAD} music={[{src: 'music/g_grip.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
