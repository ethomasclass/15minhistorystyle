// Chapter 4 · Ford's Theatre (the heavy chapter: plain, no jokes, no punch-ins, few marks, long holds).
// It opens on a few seconds of Conway's Band ("Memories of the War", 1915) before the first word, over a camera move into
// an 1865 stereograph of Richmond's burnt district (ch04_stereo.tsx, three.js: render with --gl=swangle). A parlor waltz
// sits under the voice until the shot, then silence until "Lincoln dies", then the brass dirge to the end.
// The plot is told on a board close-up, one night, three men (ch04_night.tsx), which comes back for the outcomes.
// Everything here runs in body time: the narration starts PRE frames after the fade up (see PreShell in ch04_kit.tsx).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch04_fords_theatre.words.json';
import ES from '../../public/img/ch04/lincoln_last_speech_evening_star_12apr1865.json';
import {Tag} from '../kit/Kit';
import {Quote, makeTimeline, type Narration, useScene} from '../kit/shell';
import {EpBoard} from '../kit/ep1board';
import {type Box, DocShot, Slip, Spot, Swipe} from '../kit/rc';
import {MASKS} from '../masks';
import {Cuts, DarkPaper, DeskPrint, Full, PreShell, preFrames, QuietPrint, shifted} from './ch04_kit';
import {StereoInto} from './ch04_stereo';
import {NightBoard} from './ch04_night';

const N = words as Narration;
/** Music-only pre-roll before the first word (frames). */
const PRE = 120;
const t = makeTimeline(shifted(N, PRE), 30);
export const CH04_FRAMES = preFrames(N, PRE);

const I = 'img/ch04/';
const ESS = ES.size as [number, number];
// "very intelligent, and on those who serve / our cause as soldiers." (Evening Star, measured on the crop)
const ES_LINES: Box[] = [[287, 392, 805, 46], [155, 430, 437, 46]];
const PLAYBILL_LINCOLN: Box = [112, 563, 672, 48];        // "PRESIDENT LINCOLN"
const CL_DRUNK: Box = [262, 256, 374, 30];                 // "drunk, before the Senate"
const PF = 'grayscale(1) contrast(1.25) brightness(1.02)';  // engravings and prints

const SRC = {
  stereo: 'Richmond, Va., the burnt district, April 1865 (stereograph, E. & H.T. Anthony) · Library of Congress',
  mclean: 'The McLean house, Appomattox Court House, Va., April 1865 · Library of Congress',
  lincoln: 'Abraham Lincoln, Feb. 5, 1865 (Alexander Gardner) · Library of Congress',
  star: "Lincoln's speech of April 11, Evening Star (Washington), April 12, 1865 · Library of Congress",
  booth: 'John Wilkes Booth (Alexander Gardner) · Library of Congress',
  playbill: "Playbill, Ford's Theatre, April 14, 1865 · Library of Congress",
  fords: "Ford's Theatre, draped in mourning, April 1865 · Library of Congress",
  box: "The President's box, Ford's Theatre, April 1865 · Library of Congress",
  shot: 'Currier & Ives, 1865 print, not an eyewitness view · Library of Congress',
  stage: "\"The assassin retreating across the stage\", Frank Leslie's, 1865 engraving · Library of Congress",
  deathbed: 'Currier & Ives, "The death bed of the martyr President", 1865 print, not an eyewitness view · Library of Congress',
  seward: 'William H. Seward (Brady studio) · Library of Congress',
  calamity: 'Courier extra, Washington, April 15, 1865 · Library of Congress',
  oath: "Johnson takes the oath, Kirkwood House, April 15, 1865 · Frank Leslie's, 1866 engraving · Library of Congress",
  johnson: 'Andrew Johnson · Library of Congress',
  inaug: 'Inauguration day at the Capitol, March 4, 1865 (Alexander Gardner) · Library of Congress',
  leader: 'Cleveland Morning Leader, March 13, 1865 · Library of Congress',
  johnson2: 'Andrew Johnson, 1865 (A. Bogardus & Co.) · Library of Congress',
};

// the shots (cut two frames before the phrase)
const S1 = t.at('The main') - 2;
const S2 = t.at('Two days later') - 2;
const S3 = t.at('Near the end') - 2;
const S4 = t.at('Standing in that crowd') - 2;
const S5 = t.at('Booth and a few') - 2;
const S6 = t.at('April 14') - 2;
const S7 = t.at("Ford's Theatre") - 2;
const S8 = t.at('Booth slips') - 2;
const S9 = t.at('fires one shot') - 2;
const S10 = t.at('Then he jumps') - 2;
const S11 = t.at('Lincoln dies') - 2;
const S12 = t.at('Across town') - 2;
const S13 = t.at('is stabbed') - 2;
const S14 = t.at('The man sent') - 2;
const S15 = t.at('So by morning') - 2;
const S16 = t.at('And in Washington') - 2;
const S17 = t.at('Six weeks earlier') - 2;
const S18 = t.at("He'd been sick") - 2;
const S19 = t.at('Lincoln reportedly') - 2;
const S20 = t.at('Now Andy') - 2;
const S21 = t.at('Same name') - 2;

const Body: React.FC = () => {
  const long = S5 - 400; // pieces of the night board that are already pinned when it comes back
  const scene = useScene([
    // April 1865: into the burnt district of Richmond (music only for the first four seconds)
    [0, <AbsoluteFill key="st">
      <StereoInto dur={S1 + 10} />
      <Slip text="Richmond, Va. · April 1865" x={130} y={140} at={t.at('April') - 2} />
      <Tag text={SRC.stereo} />
    </AbsoluteFill>],
    [S1, <Full key="mc" src={I + 'mclean_house_appomattox_april1865.jpg'} size={[3000, 2524]} rect={[420, 650, 2480, 2000]} f0={[1400, 1300]} a={S1} b={S2}
      bw="grayscale(1) contrast(1.2) brightness(0.85)">
      {() => <><Slip text="Appomattox, Va. · April 9" x={1180} y={140} at={t.at('surrenders')} /><Tag text={SRC.mclean} /></>}
    </Full>],
    // the window speech
    [S2, <Full key="li" src={I + 'lincoln_gardner_feb1865.jpg'} size={[2133, 2999]} rect={[160, 200, 1850, 2800]} f0={[1000, 1150]} z1={1.05} a={S2} b={S3}
      mask={MASKS.lincoln} traceAt={S2 + 8}>
      {() => <><Slip text="April 11 · the White House" x={130} y={140} at={S2 + 6} /><Tag text={SRC.lincoln} /></>}
    </Full>],
    [S3, <DocShot key="es" src={I + 'lincoln_last_speech_evening_star_12apr1865.jpg'} size={ESS} tag={SRC.star} focusAt={S3}
      keys={[[S3, {x: 624, y: 381, z: 1.28}], [t.at('Some Black men'), {x: 620, y: 345, z: 1.5}], [t.at('very intelligent'), {x: 640, y: 420, z: 1.6}], [S4, {x: 650, y: 425, z: 1.68}]]}
      over={<Slip text="a first, for a president" x={130} y={140} at={t.at('no president')} />}>
      <Swipe lines={ES_LINES} from={t.at('very intelligent')} to={t.end('Union soldiers')} seed="es" />
      <Spot size={ESS} boxes={ES_LINES} at={t.at('It was a small step')} id="es1" />
    </DocShot>],
    // Booth (traced, not tinted: he is not the subject)
    [S4, <Full key="bo" src={I + 'booth_carte_de_visite_1865.jpg'} size={[1836, 3000]} rect={[140, 170, 1690, 2600]} f0={[760, 1100]} a={S4} b={S5}
      mask={MASKS.booth} tint={null} traceAt={S4 + 10}>
      {() => <><Slip text="according to later accounts" x={1150} y={140} size={50} at={t.at('according')} /><Tag text={SRC.booth} /></>}
    </Full>],
    // the plan: one night, three men
    [S5, <NightBoard key="n1" from={S5}
      t={{booth: S5 + 4, lincoln: t.at('The President'), johnson: t.at('vice president'), seward: t.at('Secretary of State'), date: t.at('same night'), died: 1e7, survived: 1e7, never: 1e7}}
      cam={[[S5, 960, 440, 1.9], [t.at('became murder'), 960, 440, 1.84], [t.at('The President'), 960, 540, 1.0], [S6, 960, 540, 0.985]]} />],
    // April 14
    [S6, <DocShot key="pb" src={I + 'our_american_cousin_playbill_fords_theatre_14apr1865.jpg'} size={[905, 3000]} tag={SRC.playbill}
      keys={[[S6, {x: 452, y: 500, z: 1.2}], [t.at('Lincoln and his wife') + 10, {x: 452, y: 520, z: 1.2}], [t.at('comedy') + 4, {x: 452, y: 1560, z: 1.0}], [S7, {x: 452, y: 1580, z: 1.0}]]}>
      <Swipe lines={[PLAYBILL_LINCOLN]} from={t.at('Lincoln and his wife')} to={t.at('Lincoln and his wife') + 14} seed="pb" />
    </DocShot>],
    [S7, <Full key="ft" src={I + 'fords_theatre_exterior_april1865.jpg'} size={[3000, 2271]} rect={[100, 80, 2880, 2200]} f0={[1300, 1150]} f1={[1360, 1150]} z1={1.05} a={S7} b={S8}>
      {() => <><Slip text="a little after 10 p.m." x={1250} y={140} at={t.at('A little after')} /><Tag text={SRC.fords} /></>}
    </Full>],
    [S8, <Full key="bx" src={I + 'fords_theatre_presidents_box_april1865.jpg'} size={[2949, 3000]} rect={[160, 160, 2800, 2800]} f0={[1250, 1650]} z1={1.1} a={S8} b={S9}>
      {() => <Tag text={SRC.box} />}
    </Full>],
    // the shot: hold, no marks; the music stops here
    [S9, <Full key="ci" src={I + 'assassination_of_lincoln_currier_ives_1865.jpg'} size={[3000, 2164]} rect={[500, 350, 2480, 1620]} f0={[1700, 1050]} z1={1.03} a={S9} b={S10} bw={PF}>
      {() => <Tag text={SRC.shot} />}
    </Full>],
    [S10, <DocShot key="ls" src={I + 'assassin_retreating_across_stage_leslies_1865.jpg'} size={[1070, 1536]} tag={SRC.stage} filter={PF}
      keys={[[S10, {x: 560, y: 500, z: 1.12}], [S11, {x: 590, y: 520, z: 1.22}]]}
      over={<Slip text="“sic semper tyrannis”" x={130} y={880} size={54} at={t.at('Sic') - 2} />} />],
    [S11, <Full key="db" src={I + 'lincoln_deathbed_currier_ives_1865.jpg'} size={[3000, 2299]} rect={[420, 380, 2500, 1820]} f0={[1450, 1050]} z1={1.03} a={S11} b={S12} bw={PF}>
      {() => <Tag text={SRC.deathbed} />}
    </Full>],
    // Seward
    [S12, <Full key="se" src={I + 'seward_brady.jpg'} size={[1946, 3000]} rect={[400, 300, 1850, 2850]} f0={[1000, 1150]} z1={1.05} a={S12} b={S13}
      mask={MASKS.seward} traceAt={S12 + 10}>
      {() => <Tag text={SRC.seward} />}
    </Full>],
    [S13, <DocShot key="nc" src={I + 'national_calamity_lincoln_seward_assassinated_broadside_15apr1865.jpg'} size={[2092, 3000]} tag={SRC.calamity}
      keys={[[S13, {x: 1046, y: 640, z: 0.8}], [S14, {x: 1046, y: 700, z: 0.86}]]}
      over={<Slip text="Seward survived" x={1180} y={830} size={58} at={t.at('He survives')} />} />],
    // the board again: the outcomes
    [S14, <NightBoard key="n2" from={S14}
      t={{booth: long, lincoln: long, johnson: long, seward: long, date: long, died: long, survived: long, never: t.at('never goes')}}
      cam={[[S14, 960, 540, 0.985], [S15, 960, 540, 0.97]]} />],
    // by morning, the President
    [S15, <Full key="ok" src={I + 'johnson_oath_kirkwood_house_15apr1865.jpg'} size={[3000, 2370]} rect={[120, 200, 2880, 2200]} f0={[1250, 1150]} a={S15} b={S16} bw={PF}>
      {() => <><Slip text="sworn in · April 15, 1865" x={130} y={140} at={t.at('the President of the United States')} /><Tag text={SRC.oath} /></>}
    </Full>],
    [S16, <AbsoluteFill key="jp"><DarkPaper /><QuietPrint src="img/wall/cr_johnson.png" size={[900, 1101]} w={560} a={S16} b={S17} /><Tag text={SRC.johnson} /></AbsoluteFill>],
    // the drunk swearing-in
    [S17, <Full key="in" src={I + 'lincoln_second_inauguration_4mar1865_gardner.jpg'} size={[3000, 2184]} rect={[750, 415, 2245, 1490]} f0={[1500, 900]} z1={1.05} a={S17} b={S18}>
      {() => <><Slip text="March 4, 1865 · inauguration day" x={130} y={140} at={t.at('Six weeks earlier') + 4} /><Tag text={SRC.inaug} /></>}
    </Full>],
    [S18, <DocShot key="cl" src={I + 'johnson_inauguration_drunk_editorial_cleveland_leader_13mar1865.jpg'} size={[805, 3000]} tag={SRC.leader}
      keys={[[S18, {x: 430, y: 170, z: 1.55}], [t.at('rambling'), {x: 440, y: 240, z: 1.7}], [S19, {x: 445, y: 255, z: 1.75}]]}>
      <Swipe lines={[CL_DRUNK]} from={t.at('rambling')} to={t.end('whole Senate')} seed="cl" />
    </DocShot>],
    [S19, <AbsoluteFill key="qu">
      <DarkPaper />
      <QuietPrint src="img/wall/cr_lincoln.png" size={[900, 1394]} w={330} x={1540} y={520} rot={2} a={S19} b={S20} />
      <Quote text="Andy ain’t a drunkard." at={t.at('Andy')} x={170} y={400} w={1050} size={86} who="Lincoln, reportedly, to worried friends" />
      <Tag text="Abraham Lincoln · Library of Congress" />
    </AbsoluteFill>],
    // Andy in charge
    [S20, <AbsoluteFill key="jj">
      <DarkPaper />
      <DeskPrint src="img/ch05/andrew_johnson_portrait_1865.jpg" size={[939, 1536]} rect={[30, 60, 910, 1420]} h={860} x={600} y={540} a={S20} b={S21} rot={-1.5}
        mask={MASKS.johnson} traceAt={S20 + 8} />
      <Slip text="not a Republican" x={1050} y={250} at={t.at('Republican') - 2} />
      <Slip text="a Democrat, from Tennessee" x={1050} y={410} at={t.at('Democrat from') - 2} />
      <Slip text="the 1864 “National Union” ticket" x={1050} y={570} size={54} at={t.at('put on the ticket') - 2} />
      <Tag text={SRC.johnson2} />
    </AbsoluteFill>],
    [S21, <EpBoard key="b" ch={4} from={S21} at={t.at('a very different party')} />],
  ]);
  return <>{scene}<Cuts at={[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20]} volume={0.18} /></>;
};

export const Ch04: React.FC = () => (
  <PreShell n={N} pre={PRE} audio="audio/ch04_fords_theatre.wav"
    music={[
      // Conway's Band before the first word only, out as the voice comes in
      {src: 'music/period/memories_of_the_war_conway_1915.mp3', volume: 0.38, startFrom: 36, to: PRE + 16, fadeOut: 28},
      // a parlor waltz under the voice, cut dead on the shot
      {src: 'music/rc_parlor.mp3', volume: 0.14, startFrom: 30, from: PRE - 6, to: S9 + 2, fadeOut: 4},
      // silence, then the dirge from "Lincoln dies" to the end
      {src: 'music/rc_brass_dirge.mp3', volume: 0.12, startFrom: 30, from: S11 - 4},
    ]}>
    <Body />
  </PreShell>
);
