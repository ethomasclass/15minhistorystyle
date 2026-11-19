// Chapter 6 · Midpoint: Jell-O, the fanciest dish in the house. The aspic as a showpiece (Flow props and the Victorian kitchen
// diorama), Knox, the aspic mould morphing into a Jell-O box, the second MOCK tape on "Mock aspic", the real 1920 Jell-O
// booklet as a colour print, Perfection Salad. Then the pattern interrupt: a hard cut to the 1955 Monterey Souffle Salad ad,
// full frame in colour, a pan-to-reveal (this chapter's one pan), the music cut to silence, and the frame held with no new
// marks through the pause and "Yes. People ate this. On purpose." The Jell-O piece lands on the board on the last line.
// Hard, silent cuts. Placeholders are listed in PLACEHOLDERS; every beat is timed to the words.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch06_jello.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {FullFrame, Ph, PhLabel, type PlaceholderInfo, PrintOr, type StandIn, TgPrint} from '../kit/tg_placeholder';
import {MockTape} from '../kit/tg_mock';
import {TgBoard} from '../kit/tg_board';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

/** Music level 13 LU under the voice (as levels.ts bed(); the tg_ cues aren't in CUE_LUFS yet, so measured LUFS from MUSIC.md). */
const bedAt = (lufs: number, gap = 13) => +Math.pow(10, (-18 - gap - lufs) / 20).toFixed(3);

export const PLACEHOLDERS: PlaceholderInfo[] = [
  {file: 'img/flow/jello_ring/ring_0000.png …', what: 'Flow V2: the Jell-O ring trembling, video-to-cut-out frames at 12 fps (colour)', scene: 'Mold', anchor: "Here's a dish",
    swap: 'replace <Ph> in <Mold> with a frame loop like the eel (img/flow/jello_ring/ring_%04d.png)'},
  {file: 'img/props/aspic_showpiece.webp', what: 'Flow prop: a tall amber calves\'-foot jelly turned out of a copper mould (colour)', scene: 'Showpiece', anchor: 'But in the 1800s',
    swap: '<Prop name="aspic_showpiece" ...> (colour: a colour variant of Prop, or TgPrint-style filter)'},
  {file: 'img/flow/d3_kitchen_{1..4}.png', what: 'Flow D3 diorama: Victorian kitchen at night, 4 planes (sky/back wall, range + cook, table, front), copper mould coral',
    scene: 'Kitchen', anchor: 'To make one', swap: 'replace KitchenDiorama planes with PlaneImg layers (SilScene); steam loop screen-blended on the range'},
  {file: 'img/props/aspic_savory.webp', what: 'Flow prop: a savory aspic with vegetables and meat set inside, coral subject', scene: 'Aspic, Servants', anchor: 'Some were / Only a house',
    swap: '<Prop name="aspic_savory" coral trace ...>'},
  {file: 'img/arch/knox_gelatine_1890s.jpg', what: "a Knox's gelatine package or ad, 1890s", scene: 'Knox', anchor: 'Then came the shortcut', swap: 'drop in (PrintOr switches); fix the tag'},
  {file: 'img/flow/morph_aspic_jello.mp4', what: 'Flow M2 morph: copper aspic mould -> plain 1920s gelatin box, middle 2-3 s', scene: 'Morph', anchor: 'In 1897 … Jell-O',
    swap: '<OffthreadVideo> trimmed to MORPH_TRIM, from at("added sugar") to at("Jell-O.")'},
  {file: 'img/flow/morph_aspic_jello_first.png', what: "M2's first frame (the copper mould) as a cut-out", scene: 'Morph, Mock', anchor: 'In 1897 / Mock aspic', swap: '<Img> in the same box'},
  {file: 'img/flow/morph_aspic_jello_last.png', what: "M2's last frame (the box and the red gelatin) as a cut-out", scene: 'Morph, Mock', anchor: 'Jell-O / Mock aspic', swap: '<Img> in the same box'},
  {file: 'img/arch/perfection_salad.jpg', what: 'Perfection Salad, a period illustration or recipe (Knox, c. 1905)', scene: 'Perfection', anchor: 'Around 1905', swap: 'drop in; fix the tag'},
  {file: 'img/arch/starkist_monterey_souffle_salad_1955.jpg', what: "Star-Kist ad, Woman's Day, June 1955, 'Monterey Souffle Salad' (colour, full frame)", scene: 'Ad',
    anchor: 'Like this', swap: 'set AD_SIZE; move AD_DISH to the salad so the pan starts tight on it'},
];

// ---------------------------------------------------------------- The gelatin mold
const Mold: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Ph file="img/flow/jello_ring/ring_0000.png" what="Jell-O ring trembling · Flow cut-out loop, colour" x={1000} y={260} w={720} h={560} at={a + 1} land="drop" />
      {g >= t.at('gelatin') && <Highlight text="THE GELATIN MOLD" x={110} y={130} size={88} at={t.at('gelatin')} seed={61} rot={-2} />}
      <Note text="from nowhere?" x={150} y={320} size={54} rot={-3} at={t.at('nowhere.') - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- A showpiece
const Showpiece: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Ph file="img/props/aspic_showpiece.webp" what="calves'-foot jelly from a copper mould · Flow prop, colour" x={1020} y={190} w={700} h={720} at={a + 1} land="drop" />
      <Note text="in the 1800s:" x={140} y={150} size={54} rot={-3} at={a + 1} color="#ffffff" />
      <Note text="a shimmering jelly" x={160} y={290} size={56} rot={-3} at={t.at('shimmering') - 3} />
      <Note text="a showpiece." x={180} y={460} size={84} rot={-3} at={t.at('showpiece.') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- How you made one: the kitchen diorama (4 planes, parallax)
const PLANES = [
  {file: 'img/flow/d3_kitchen_1.png', what: 'plane 1 · back wall, copper pans, window', y: 0, h: 1080, depth: 0.25, tone: '#121a19'},
  {file: 'img/flow/d3_kitchen_2.png', what: 'plane 2 · the range, a steaming pot, the cook in profile', y: 300, h: 780, depth: 0.5, tone: '#141614'},
  {file: 'img/flow/d3_kitchen_3.png', what: 'plane 3 · the table, the copper jelly mould (coral)', y: 610, h: 470, depth: 0.78, tone: '#161411'},
  {file: 'img/flow/d3_kitchen_4.png', what: 'plane 4 · front: bowls, a strainer, cloth', y: 860, h: 220, depth: 1, tone: '#0f0e0b'},
];
/** The diorama's motion is built: a slow sideways camera drift, each plane moving by its depth (no 3D, no push). */
const KitchenDiorama: React.FC<{a: number; b: number}> = ({a, b}) => {
  const f = useCurrentFrame();
  const cx = interpolate(f, [a, b], [0, -90], clamp);
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      {PLANES.map((p, i) => (
        <div key={i} style={{position: 'absolute', left: -120 + cx * p.depth, top: p.y, width: 2160, height: p.h, background: p.tone, borderTop: `2px solid rgba(244,239,230,${0.1 + i * 0.04})`}}>
          <div style={{position: 'absolute', right: 260, top: 10, width: 520, height: Math.min(110, p.h - 10)}}><PhLabel file={p.file} what={p.what} scale={0.75} /></div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Kitchen: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  const steps: [string, string, string?][] = [
    ["1  boil calves' feet", 'boiled'], ['…for hours', 'hours.', '#ffffff'], ['2  skim it', 'skimmed'], ['3  strain it', 'strained'], ['4  clear it', 'cleared'],
    ['5  set it in a copper mold', 'copper', pal.subject],
  ];
  const ys = [130, 225, 340, 445, 550, 665];
  const xs = [130, 560, 130, 130, 130, 130];
  return (
    <AbsoluteFill>
      <KitchenDiorama a={a} b={t.at('Some were')} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(13,12,9,0.8) 0%, rgba(13,12,9,0.55) 45%, transparent 70%)'}} />
      {steps.map(([text, w, color], i) => <Note key={w} text={text} x={xs[i]} y={ys[i]} size={i === 1 ? 44 : 52} rot={-3} at={t.at(w) - 3} color={color} />)}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Aspic: the vocabulary beat, then who could make one
const ASPIC = {x: 1060, y: 230, w: 660, h: 640};
const Aspic: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Ph file="img/props/aspic_savory.webp" what="savory aspic, vegetables + meat set inside · coral subject" {...ASPIC} at={a + 1} land="drop" />
      <Note text="some sweet," x={140} y={130} size={52} rot={-3} at={t.at('sweet.') - 3} color="#ffffff" />
      <Note text="some savory" x={540} y={140} size={52} rot={-3} at={t.at('savory') - 3} />
      {g >= t.at('aspic.') && <Highlight text="ASPIC" x={140} y={290} size={130} at={t.at('aspic.')} seed={63} rot={-2} />}
      <Definition term="as·pic" def="a savory jelly with meat or vegetables set inside" at={t.at('aspic.') + 9} x={160} y={500} w={820} />
      <Note text="only a house with a cook" x={150} y={700} size={52} rot={-3} at={t.at('cook,') - 3} color="#ffffff" />
      <Note text="and a lot of time" x={170} y={820} size={52} rot={-3} at={t.at('lot of time') - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** The punchline as a detail cut-in on the same prop: coral, then the frame holds. */
const Servants: React.FC<{t: TL; a: number}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Ph file="img/props/aspic_savory.webp" what="savory aspic, close · coral tint + teal trace (the subject)" x={900} y={110} w={880} h={900} land="none" />
      <Note text="a wobbling aspic said:" x={140} y={300} size={54} rot={-3} at={t.at('A wobbling') - 3} />
      <Note text="“we have servants.”" x={160} y={460} size={72} rot={-3} at={t.at('we have servants') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Knox: the shortcut
const Knox: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PrintOr src="img/arch/knox_gelatine_1890s.jpg" what="Knox's gelatine package or ad, 1890s" x={1080} y={120} w={620} h={800} at={a + 1} rot={2} tag="Knox's Gelatine · source tbd" />
      {g >= t.at('shortcut.') && <Highlight text="THE SHORTCUT" x={110} y={130} size={100} at={t.at('shortcut.')} seed={64} rot={-2} />}
      <Note text="charles knox, around 1890" x={140} y={340} size={50} rot={-3} at={t.at('Charles Knox') - 3} color="#ffffff" />
      <Note text="already ground up" x={160} y={480} size={58} rot={-3} at={t.at('ground up') - 3} />
      <Note text="ready to dissolve" x={180} y={610} size={58} rot={-3} at={t.at('dissolve.') - 3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- The morph: aspic mould -> Jell-O box
const MORPH_BOX = {x: 1000, y: 200, w: 760, h: 700};
const Morph: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const pal = usePal();
  const m0 = t.at('added sugar') - 2;
  const m1 = t.at('Jell-O.');
  // the morph clip runs m0 -> m1 (Flow M2, its middle 2-3 s); before it, its first frame; after it, its last frame
  const phase = g < m0 ? ['img/flow/morph_aspic_jello_first.png', 'M2 first frame: the copper aspic mould'] : g < m1 ? ['img/flow/morph_aspic_jello.mp4', 'M2 morph playing: mould -> Jell-O box']
    : ['img/flow/morph_aspic_jello_last.png', 'M2 last frame: the box + red gelatin'];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Ph file={phase[0]} what={`${phase[1]} · colour`} {...MORPH_BOX} at={a + 1} land="none" shadow={false} />
      {g >= t.at('In 1897') && <Highlight text="1897" x={110} y={120} size={110} at={t.at('In 1897')} seed={65} rot={-2} />}
      <Note text="upstate new york" x={140} y={300} size={50} rot={-3} at={t.at('upstate') - 3} color="#ffffff" />
      <Note text="+ sugar" x={160} y={430} size={58} rot={-3} at={t.at('added sugar') - 3} />
      <Note text="+ fruit flavor" x={160} y={550} size={58} rot={-3} at={t.at('fruit flavor') - 3} />
      <Note text="= jell-o" x={170} y={700} size={92} rot={-3} at={t.at('Jell-O.') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Anyone could make it: the real 1920 booklet, in colour
const BOOK = 'The Jell-O Girl Gives a Party, booklet, 1920 · Genesee Pure Food Co.';
const Booklet: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <TgPrint src="img/arch/jello-girl-gives-a-party-1920-cover.jpg" x={160} y={100} w={560} h={766} at={a + 1} rot={-2} color tag={BOOK} />
      <Note text="anyone could make it" x={880} y={200} size={60} rot={-3} at={t.at('anyone') - 3} />
      <Note text="the rich family's dessert" x={920} y={330} size={50} rot={-3} at={t.at("rich family's") - 3} color="#ffffff" />
      <Note text="in about 10 minutes" x={900} y={520} size={76} rot={-3} at={t.at('In about') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Mock aspic: the pair, the tape, a held frame
const Mock: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 958, top: 130, width: 4, height: 820, background: 'rgba(244,239,230,0.35)'}} />
      <div style={{position: 'absolute', left: 200, top: 150, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.mark}}>THE REAL THING</div>
      <div style={{position: 'absolute', left: 1100, top: 150, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.subject}}>FROM A BOX</div>
      <Ph file="img/flow/morph_aspic_jello_first.png" what="the copper mould (M2 first frame)" x={180} y={240} w={620} h={620} at={a - 999} land="none" />
      <Ph file="img/flow/morph_aspic_jello_last.png" what="the Jell-O box (M2 last frame)" x={1100} y={240} w={620} h={620} at={a - 999} land="none" />
      <MockTape x={1410} y={560} at={t.at('Mock aspic')} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Perfection Salad
const Perfection: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <PrintOr src="img/arch/perfection_salad.jpg" what="Perfection Salad, Knox contest c. 1905" x={1080} y={150} w={640} h={720} at={a + 1} rot={-2} color tag="Perfection Salad · source tbd" />
      <Note text="a prize, around 1905:" x={140} y={140} size={50} rot={-3} at={t.at('prize') - 3} color="#ffffff" />
      {g >= t.at('Perfection') && <Highlight text="PERFECTION SALAD" x={130} y={270} size={80} at={t.at('Perfection')} seed={66} rot={-2} />}
      <Note text="cabbage" x={170} y={480} size={56} rot={-4} at={t.at('cabbage,') - 3} />
      <Note text="celery" x={460} y={490} size={56} rot={-2} at={t.at('celery') - 3} />
      <Note text="peppers" x={720} y={480} size={56} rot={-4} at={t.at('peppers,') - 3} />
      <Note text="…in gelatin" x={200} y={640} size={64} rot={-3} at={t.at('suspended') - 3} />
    </AbsoluteFill>
  );
};

const Fifties: React.FC<{t: TL; a: number}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      {g >= t.at('1950s,') && <Highlight text="BY THE 1950s" x={300} y={330} size={120} at={t.at('1950s,')} seed={67} rot={-2} />}
      <Note text="…just about anything" x={380} y={560} size={80} rot={-3} at={t.at('anything') - 3} color={pal.subject} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- The 1955 ad: hard cut, colour, pan to reveal, then hold
const AD_SIZE: [number, number] = [2000, 2700];
/** The salad on the page (source px): where the pan starts, tight. */
const AD_DISH = {x: 1000, y: 1560};
const AD_LINES: StandIn[] = [
  {x: 330, y: 260, w: 1340, h: 150, text: 'Monterey Soufflé Salad'},
  {x: 330, y: 1520, w: 1340, h: 84, text: '[ the salad: tuna in lemon gelatin ]'},
  {x: 420, y: 2280, w: 1160, h: 80, text: '[ recipe and Star-Kist copy ]'},
];
const Ad: React.FC<{t: TL; a: number}> = ({t, a}) => {
  // C: start tight on the odd detail, pull out to the whole ad as the name is said; then the frame holds, no new marks
  const out0 = t.at('Soufflé');
  const out1 = t.at("That's tuna") - 4;
  const cam: [number, {x: number; y: number; z: number}][] = [
    [a, {...AD_DISH, z: 3.2}],
    [out0, {x: AD_DISH.x, y: AD_DISH.y - 10, z: 3.05}],
    [out1, {x: 1000, y: 1350, z: 0.1}],
  ];
  return (
    <FullFrame src="img/arch/starkist_monterey_souffle_salad_1955.jpg" what="Star-Kist ad, Woman's Day, June 1955 · colour, pan to reveal" size={AD_SIZE} cam={cam} color lines={AD_LINES}
      tag="Star-Kist Tuna advertisement, Woman's Day, June 1955" tagAt={out1} vignette={0.35} />
  );
};

// ---------------------------------------------------------------- The board: the Jell-O piece lands with its MOCK tag
const Board: React.FC<{t: TL; a: number}> = ({a}) => <TgBoard ch={6} at={a + 4} />;

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {
    mold: at("Here's a dish") - 1,
    show: at('a shimmering') - 1,
    kitchen: at('To make one') - 1,
    aspic: at('Some were') - 1,
    servants: at('A wobbling') - 1,
    knox: at('Then came the shortcut') - 1,
    morph: at('In 1897') - 1,
    booklet: at('Suddenly') - 1,
    mock: at('Mock aspic') - 1,
    perfection: at('Around 1905') - 1,
    fifties: at('By the 1950s') - 1,
    ad: at('Like this') - 1,
    board: at('And the companies') - 1,
  };
  const cuts: [number, React.ReactNode][] = [
    [0, <Mold t={t} a={c.mold} />],
    [c.show, <Showpiece t={t} a={c.show} />],
    [c.kitchen, <Kitchen t={t} a={c.kitchen} />],
    [c.aspic, <Aspic t={t} a={c.aspic} />],
    [c.servants, <Servants t={t} a={c.servants} />],
    [c.knox, <Knox t={t} a={c.knox} />],
    [c.morph, <Morph t={t} a={c.morph} />],
    [c.booklet, <Booklet t={t} a={c.booklet} />],
    [c.mock, <Mock t={t} a={c.mock} />],
    [c.perfection, <Perfection t={t} a={c.perfection} />],
    [c.fifties, <Fifties t={t} a={c.fifties} />],
    [c.ad, <Ad t={t} a={c.ad} />],
    [c.board, <Board t={t} a={c.board} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      {/* silent cuts. Stamps on titles and the MOCK tape; the near-silent marker before notes. Nothing at all in the held ad frame. */}
      {['gelatin', 'aspic.', 'shortcut.', 'In 1897', 'Perfection', '1950s,'].map((w) => <Sfx key={w} at={at(w)} src="sfx/stamp.wav" volume={0.27} />)}
      <Sfx at={at('Mock aspic')} src="sfx/stamp.wav" volume={0.32} />
      {['nowhere.', 'showpiece.', 'shimmering', 'boiled', 'hours.', 'skimmed', 'strained', 'cleared', 'copper', 'sweet.', 'savory', 'cook,', 'lot of time', 'A wobbling',
        'we have servants', 'Charles Knox', 'ground up', 'dissolve.', 'upstate', 'added sugar', 'fruit flavor', 'Jell-O.', 'anyone', 'In about', "rich family's", 'prize', 'cabbage,', 'celery',
        'peppers,', 'suspended', 'anything'].map((w) => <Sfx key={w} at={at(w) - 5} src={WRITE.src} volume={WRITE.volume} />)}
    </>
  );
};

/** Music: the gelatin cue, dropped to silence 4 frames before the ad; the ad sting under the reveal, gone by the end of "box." so
 *  the pause and the deadpan line sit in silence; the gelatin cue back for the board, picked up where it stopped. */
const Music = (t: TL) => {
  const like = t.at('Like this');
  const back = t.at('And the companies') - 2;
  return [
    {src: 'music/tg_gelatin.mp3', volume: bedAt(-15.2), to: like - 4, fadeOut: 5},
    {src: 'music/tg_ad_sting.mp3', volume: bedAt(-14.8, 11), from: like - 1, to: t.end('box.') + 4, fadeOut: 12},
    {src: 'music/tg_gelatin.mp3', volume: bedAt(-15.2), from: back, startFrom: like},
  ];
};

export const Ch06: React.FC = () => {
  const t = makeTimeline(N, 30);
  return (
    <ChapterShell n={N} audio="audio/ch06_jello.wav" lead={LEAD} music={Music(t)}>
      <Body />
    </ChapterShell>
  );
};
