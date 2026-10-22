// Chapter 1 · the cold open: Robert Smalls steals the Planter past Fort Sumter (May 1862); the driving question
// (Lincoln, or the people who didn't wait?); the promised Greeley letter. Then the channel intro and the title card.
// Chapter 1 has no logo break in front.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, Picture, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {Desk, DropCard} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {CORAL, LETTER, LETTER_QUOTE, LETTER_TAG, SMALLS, SMALLS_1862, SMALLS_1862_TAG, TwoSides, WHITE} from '../kit/ff';
import {Backdrop, CropCard, fill, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
/** Title card length (frames) after the channel intro. */
const TITLE_FRAMES = 150;
/** Narration ends; the channel intro starts 20 frames later. */
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

const NIGHT = 'img/gen/v2_ch01_planter_night.jpg';
const SHEET = 'img/gen/v2_ch01_white_sheet.jpg';
const STEAMER = 'img/ch01/steamer_planter_charleston_c1860s.jpg';
const CREW = 'img/ch01/planter_captors_heroes_in_ebony_1862.jpg';
const HARBOR = 'img/ch01/charleston_harbor_siege_plan_1861.jpg';
const CAMP_SAXTON = 'img/ch05/emancipation_day_south_carolina_1863.jpg';
/** The Planter's way out on the 1861 harbor plan (source pixels): the Charleston wharves, down the harbor, past Sumter, to sea. */
const ROUTE = [[130, 340], [420, 430], [760, 560], [1010, 640], [1150, 655], [1330, 705], [1470, 765]];
const SUMTER_PX = [1085, 700];

/** A dark band on the left so notes read over a picture. */
const LeftShade: React.FC<{to?: number}> = ({to = 52}) => (
  <AbsoluteFill style={{background: `linear-gradient(to right, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.6) ${to * 0.6}%, rgba(0,0,0,0) ${to}%)`}} />
);

/** An enslaved man stole a Confederate ship and sailed it past Fort Sumter. */
const Stole: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={NIGHT} px={sizeOf(NIGHT)} fx={700} fy={380} a={-10} b={t.at('His name')} z0={1.0} z1={1.08} fade={8}
    tag="Illustration · the Planter in Charleston Harbor, May 1862">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.8) 0%, rgba(10,9,7,0.45) 30%, rgba(0,0,0,0) 46%)'}} />
        <Note text="an enslaved man" x={120} y={80} size={56} rot={-3} at={t.at('An enslaved') - 2} color={WHITE} />
        <Note text="stole a Confederate ship" x={140} y={180} size={56} rot={-3} at={t.at('stole') - 2} />
        <Highlight text="PAST FORT SUMTER" x={1000} y={110} size={78} at={t.at('Fort Sumter')} seed={101} rot={-2} />
      </>
    )}
  </Engraving>
);

/** His name was Robert Smalls. 23, grew up enslaved in South Carolina. */
const Name: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('His name') - 1;
  return (
    <Desk a={a}>
      <CropCard src={SMALLS_1862} size={sizeOf(SMALLS_1862)} x={170} y={130} w={620} h={800} fx={770} fy={1250} scale={0.68} rot={-2} at={a + 1} mask={MASKS.smalls_1862}
        traceAt={t.at('Robert Smalls') + 3} />
      <Highlight text="ROBERT SMALLS" x={930} y={170} size={100} at={t.at('Robert Smalls')} seed={103} rot={-2} />
      <Note text="age 23" x={950} y={350} size={64} rot={-3} at={t.at('was 23') - 2} color={WHITE} />
      <Note text="grew up enslaved" x={950} y={470} size={54} rot={-3} at={t.at("He'd grown") - 2} />
      <Note text="in South Carolina" x={970} y={560} size={54} rot={-3} at={t.at('South Carolina') - 3} />
      <Tag text={SMALLS_1862_TAG} />
    </Desk>
  );
};

/** He steered the Planter: guns and supplies for the Confederate army. A pilot's job, without the title. */
const Planter: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('he steered') - 1;
  return (
    <Photo src={STEAMER} size={sizeOf(STEAMER)} fx={800} fy={700} z0={1.92} z1={2.04} a={a} b={t.at('One night')}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.82) 0%, rgba(10,9,7,0.5) 32%, rgba(0,0,0,0) 48%, rgba(0,0,0,0) 62%, rgba(10,9,7,0.85) 100%)'}} />
          <Highlight text="THE PLANTER" x={110} y={90} size={96} at={t.at('the Planter')} seed={105} rot={-2} />
          <Note text="carried guns + supplies for the Confederate army" x={120} y={250} size={50} rot={-2} at={t.at('which carried') - 3} color={WHITE} />
          <Note text="in Charleston Harbor" x={130} y={360} size={50} rot={-2} at={t.at('Charleston Harbor') - 3} />
          <Note text="Smalls did a pilot's job" x={120} y={780} size={54} rot={-2} at={t.at("He did") - 3} color={WHITE} />
          <Note text="but the law gave a Black man no title" x={120} y={880} size={54} rot={-2} at={t.at('though the law') - 3} color={CORAL} />
          <Tag text="Steamer Planter at a Charleston wharf, stereograph, 1860s · Library of Congress" />
        </>
      )}
    </Photo>
  );
};

/** One night in May 1862: the officers go ashore; Smalls, the crew and their families. */
const Night: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('One night') - 1;
  return (
    <Desk a={a}>
      <Backdrop src={NIGHT} size={sizeOf(NIGHT)} a={a} dim={0.26} side="left" />
      <DropCard src={CREW} x={1230} y={80} w={560} rot={2} at={a + 2} />
      <Note text="one night in" x={120} y={100} size={54} rot={-3} at={t.at('One night') - 2} color={WHITE} />
      <Highlight text="MAY 1862" x={110} y={190} size={110} at={t.at('May 1862')} seed={107} rot={-2} />
      <Note text="the white officers go ashore" x={120} y={420} size={56} rot={-3} at={t.at('white officers') - 3} color={WHITE} />
      <Note text="Smalls and the crew stay aboard" x={120} y={540} size={56} rot={-3} at={t.at('Smalls and the crew') - 3} />
      <Note text="they pick up their families" x={120} y={660} size={56} rot={-3} at={t.at('picked up') - 3} color={CORAL} />
      <Tag text="Heroes in Ebony: the captors of the rebel steamer Planter (Robert Smalls top centre), 1862 · Library of Congress" />
    </Desk>
  );
};

/** Just before dawn: out of the harbor, the straw hat, the whistle signals, past Fort Sumter (the route draws on). */
const Escape: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('And just') - 1;
  const p = interpolate(g, [t.at('steered the'), t.at('He passed') + 8, t.at('He passed') + 9, t.at('Then he') + 30], [0, 0.66, 0.66, 1], clamp);
  return (
    <Desk a={a}>
      <Doc src={HARBOR} x={70} y={150} w={980} rot={-1} at={a + 1} push={[a, t.at('Then he')]} fx={900} fy={600} zoom={1.06}>
        {(S) => {
          const pts = ROUTE.map(([x, y]) => S(x, y));
          const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
          const [sx, sy] = S(SUMTER_PX[0], SUMTER_PX[1]);
          return (
            <>
              <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
                <path d={d} fill="none" stroke="#FF9F1C" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
                  strokeDasharray={1} strokeDashoffset={1 - p} />
              </svg>
              <Loop cx={sx} cy={sy} rx={80} ry={64} at={t.at('He passed') + 2} seed={11} />
              <Note text="Fort Sumter" x={sx - 120} y={sy + 70} size={46} rot={-3} at={t.at('He passed') + 4} />
              <Note text="Charleston" x={pts[0][0] + 10} y={pts[0][1] + 40} size={42} rot={-3} at={t.at('out of the harbor') - 3} color={WHITE} />
            </>
          );
        }}
      </Doc>
      <Note text="just before dawn" x={1150} y={120} size={50} rot={-3} at={t.at('just before dawn') - 3} color={WHITE} />
      <Note text="so the story goes:" x={1150} y={240} size={46} rot={-3} at={t.at('The story goes') - 3} color="#FF9F1C" />
      <Note text="the captain's straw hat" x={1150} y={330} size={50} rot={-3} at={t.at("captain's straw") - 3} />
      <Note text="+ the captain's stance" x={1150} y={420} size={50} rot={-3} at={t.at('stood the way') - 3} />
      <Note text="the right whistle signals" x={1150} y={560} size={50} rot={-3} at={t.at('whistle') - 3} color={WHITE} />
      <Note text="past Fort Sumter" x={1150} y={700} size={58} rot={-3} at={t.at('He passed') - 2} color={CORAL} />
      <Tag text="Plan of operations in Charleston Harbour, Frank Leslie's Illustrated Newspaper, April 27, 1861 · Library of Congress · route drawn" />
    </Desk>
  );
};

/** A white sheet, and straight for the Union ships waiting outside. */
const Sheet: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={SHEET} px={sizeOf(SHEET)} fx={690} fy={420} a={t.at('Then he') - 1} b={t.at("So here's")} z0={1.0} z1={1.07} fade={8}
    tag="Illustration · the Planter reaches the Union ships, May 1862">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.75) 0%, rgba(10,9,7,0.35) 26%, rgba(0,0,0,0) 40%)'}} />
        <Note text="then: a white sheet" x={120} y={80} size={58} rot={-3} at={t.at('white sheet') - 3} color={WHITE} />
        <Note text="straight for the Union ships" x={140} y={180} size={58} rot={-3} at={t.at('Union ships') - 3} />
      </>
    )}
  </Engraving>
);

/** The driving question: who freed them? Lincoln, or people like Smalls who didn't wait? */
const Question: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("So here's") - 1;
  return (
    <Desk a={a}>
      <Backdrop src={'img/ch02/stampede_slaves_hampton_fortress_monroe_1861.jpg'} size={sizeOf('img/ch02/stampede_slaves_hampton_fortress_monroe_1861.jpg')} a={a} dim={0.2} side="none" />
      <Note text="today's question:" x={120} y={100} size={54} rot={-3} at={t.at("So here's") + 2} color={WHITE} />
      <Highlight text="WHO FREED THEM?" x={720} y={90} size={100} at={t.at('Who freed')} seed={109} rot={-2} />
      <TwoSides at={a} lincolnAt={t.at('President Lincoln')} smallsAt={t.at('Or people')} rightNote="who didn't wait to be freed" />
      <Tag text="Ritchie after Carpenter, The First Reading of the Emancipation Proclamation, 1866 · Harper's Weekly, June 14, 1862 · Library of Congress" />
    </Desk>
  );
};

/** We'll come back to Smalls, and to a letter Lincoln wrote. */
const Letter: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("We'll come") - 1;
  const l = t.at('And to a letter') - 1;
  return (
    <Desk a={a}>
      <DropCard src={SMALLS} x={120} y={110} w={360} rot={-3} at={a + 2} />
      <Note text="we'll come back" x={110} y={660} size={52} rot={-3} at={t.at("We'll come") + 2} color={WHITE} />
      <Note text="to Smalls" x={130} y={750} size={52} rot={-3} at={t.at('back to Smalls') - 2} color={WHITE} />
      <Doc src={LETTER} x={620} y={70} w={520} rot={2} at={l} marks={[{at: t.at('seems to say'), to: END - 30, swipe: LETTER_QUOTE}]} />
      <Note text="a letter Lincoln wrote" x={1240} y={300} size={48} rot={-3} at={t.at('a letter Lincoln') - 2} color={WHITE} />
      <Note text="he didn't care" x={1240} y={430} size={56} rot={-3} at={t.at('seems to say') - 2} color="#FF9F1C" />
      <Note text="either way?" x={1260} y={520} size={56} rot={-3} at={t.at('either way') - 3} color="#FF9F1C" />
      <Tag text={`${LETTER_TAG} · Robert Smalls, c. 1870s · Library of Congress`} />
    </Desk>
  );
};

/** Title card after the channel intro: Emancipation Day at Camp Saxton, dimmed; title on orange; subtitle in teal. */
const Title: React.FC = () => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const pal = usePal();
  const size = sizeOf(CAMP_SAXTON);
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <Picture src={CAMP_SAXTON} place={fill(size, 1500, 1050, 1.16 + f * 0.0004)} size={size} bw="grayscale(1) contrast(1.25) brightness(0.42)" />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Highlight text={TITLE} x={170} y={350} size={120} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 210, top: 580, fontFamily: JF.display, fontSize: 46, color: pal.mark, whiteSpace: 'nowrap', textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1300} y={720} size={56} rot={-5} at={24} />
      <Tag text="Emancipation Day in South Carolina, Camp Saxton, Frank Leslie's Illustrated Newspaper, Jan. 24, 1863 · Library of Congress" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  // [cut frame, scene]: cut 1 frame before the word that starts the new idea
  const cuts: [number, React.ReactNode][] = [
    [0, <Stole t={t} />],
    [at('His name') - 1, <Name t={t} />],
    [at('he steered') - 1, <Planter t={t} />],
    [at('One night') - 1, <Night t={t} />],
    [at('And just') - 1, <Escape t={t} />],
    [at('Then he') - 1, <Sheet t={t} />],
    [at("So here's") - 1, <Question t={t} />],
    [at("We'll come") - 1, <Letter t={t} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const notes = ['An enslaved', 'stole', "He'd grown", 'was 23', 'which carried', 'Charleston Harbor', 'He did', 'though the law', 'One night', 'white officers', 'Smalls and the crew',
    'picked up', 'just before dawn', 'The story goes', "captain's straw", 'stood the way', 'whistle', 'He passed', 'white sheet', 'Union ships', "So here's", 'Or people', "We'll come",
    'a letter Lincoln', 'seems to say', 'either way'];
  const stamps = ['Fort Sumter', 'Robert Smalls', 'the Planter', 'May 1862', 'Who freed'];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/w_dawn.mp3')} volume={(f) => interpolate(f, [0, 15, END - 70, END - 10], [0, 0.054, 0.054, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.32} />)}
      {stamps.map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      {notes.map((c) => <Sfx key={c} at={at(c) - 5} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('One night') + 1} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('And to a letter') - 1} src="sfx/page_turn.wav" volume={0.35} />
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
