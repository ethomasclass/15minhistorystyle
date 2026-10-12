// The Pledge's Forgotten Salute: a standalone native vertical Short (1080x1920).
//
// Opens on the May 1942 Southington photo (the cover), then hand-drawn figures carry the story: a timeline of the
// salute 1892 → 1942, Bellamy's salute drawn on beside his portrait, the 1892 and 1930s silhouettes side by side, and
// the arm moving from the salute to the heart in December 1942. Ends back on the 1942 photo (a loop), then the end card.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration} from './lib/timing';
import {Finish, Highlight, Loop as Ring, Note, PALETTES, PaletteCtx, StepCtx, Tag, usePal} from './kit/Kit';
import {Sfx} from './kit/common';
import {hasFile, Stamp, type TL, useScene} from './kit/shell';
import {Arch, Desk, DropCard, LOOK, StandIn} from './kit/bs';
import {Captions, Counter, EndCard, Folder, FPS, Mark, TAG_Y, TopicStrip, withBeat} from './kit/vshort';
import {FlagSketch, SaluteFigure} from './salute';
import {Cover} from './cover';
import words from '../public/audio/short_pledge_salute.words.json';
import {IMG, type Pic} from './images';

const WAV = 'audio/short_pledge_salute.wav';
const BEAT = 0.7;
const HOLD = 30;
const COVER = {frames: 45, fade: 6};
// j_intrigue repeats a 10 s phrase that ends in ~1.5 s of near-silence (cue 8.5–10 s, 18.5–20 s, …). Starting 7.5 s in
// puts those silences just before "Columbus Day", "Then came", "So that December" and on the closing line.
const MUSIC = {src: 'music/j_intrigue.mp3', vol: 0.18, from: 7.5};

const {narr: NARR, cut: CUT, lastWordEnd} = withBeat(words as Narration, 'If', BEAT);
export const SHORT_FRAMES = Math.ceil(lastWordEnd * FPS) + HOLD;

/** A picture if it has arrived; otherwise a labelled stand-in of the same footprint. */
const Card: React.FC<{p: Pic; x: number; y: number; w: number; rot?: number; at: number; out?: number; filter?: string}> = ({p, x, y, w, rot = 0, at, out, filter}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f >= out)) return null;
  if (!hasFile(p.src)) return <StandIn x={x} y={y} w={w} h={w * (p.size[1] / p.size[0])} rot={rot} label={p.src.split('/').pop()!} />;
  return <DropCard src={p.src} x={x} y={y} w={w} rot={rot} at={at} out={out} filter={filter ?? LOOK.doc} />;
};

/** A full-frame archival photo, or a desk with a stand-in until it arrives. */
const Photo: React.FC<{p: Pic; a: number; b: number; z: [number, number]; children?: React.ReactNode}> = ({p, a, b, z, children}) =>
  hasFile(p.src) ? (
    <Arch src={p.src} tag={p.tag ?? ''} a={a} b={b} z={z} pos={p.pos} tagY={TAG_Y}>{children}</Arch>
  ) : (
    <Desk a={a}><StandIn x={60} y={260} w={960} h={860} label={p.src.split('/').pop()!} />{children}</Desk>
  );

const Scenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const T = (p: Pic) => (p.tag && hasFile(p.src) ? <Tag text={p.tag} x={44} y={TAG_Y} /> : null);
  const cuts: [number, React.ReactNode][] = [
    // 0:00 May 1942 (under the cover for 1.5 s); "Like this." punches in on the arms
    [0, (
      <Photo p={IMG.photo1942} a={at('Like this.') - 4} b={at('Like this.') + 4} z={[1.05, 1.35]}>
        <Note text="Connecticut, May 1942" x={70} y={300} size={58} rot={-3} at={at('Connecticut.') - 2} color="#ffffff" />
        <Ring cx={600} cy={720} rx={340} ry={170} at={at('salute the flag.')} dur={10} width={8} seed={7} color={pal.subject} />
      </Photo>
    )],
    // 0:06 The classroom: the same salute indoors (c. 1941)
    [at('That was the salute') - 1, (
      <Photo p={IMG.classroom} a={at('That was the salute')} b={at('In schools across')} z={[1.02, 1.1]}>
        <Note text="the Pledge of Allegiance" x={70} y={300} size={58} rot={-3} at={at('Pledge of Allegiance') - 2} color="#ffffff" />
      </Photo>
    )],
    // 0:09 Fifty years: a drawn timeline, the same salute at both ends
    [at('In schools across') - 1, (
      <Desk a={at('In schools across')}>
        <Note text="in schools everywhere" x={70} y={290} size={52} rot={-3} at={at('In schools across')} color="#ffffff" />
        <FlagSketch x={790} y={420} w={200} at={at('In schools across')} />
        <SaluteFigure x={20} y={540} h={400} at={at('In schools across')} from="salute" to="salute" />
        <SaluteFigure x={380} y={540} h={400} at={at('across the country') + 6} from="salute" to="salute" />
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1080} height={1920}>
          <path d="M140,1010 L940,1010" fill="none" stroke={pal.mark} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - interpolate(useCurrentFrame(), [at('fifty years.') - 6, at('fifty years.') + 6], [0, 1], clamp)} />
        </svg>
        <Note text="1892" x={150} y={1030} size={60} rot={-3} at={at('fifty years.') - 6} color={pal.mark} />
        <Note text="1942" x={800} y={1030} size={60} rot={-3} at={at('fifty years.')} color={pal.mark} />
        <Stamp text="50 YEARS" x={330} y={1030} at={at('fifty years.')} size={80} color={pal.subject} rot={-4} />
      </Desk>
    )],
    // 0:12 Where from? Columbus Day
    [at('So where') - 1, (
      <Desk a={at('So where')}>
        <Note text="so where did it come from?" x={80} y={520} size={70} rot={-3} at={at('So where')} color="#ffffff" />
        <Highlight text="COLUMBUS DAY" x={90} y={660} size={150} at={at('Columbus Day.', 1)} seed={73} rot={-4} />
      </Desk>
    )],
    // 0:15 1892: the magazine, Bellamy, and the salute drawn on
    [at('In 1892,') - 1, (
      <Desk a={at('In 1892,')}>
        <Folder at={at('In 1892,') - 1} label="1892 · COLUMBUS, 400 YEARS" />
        <Card p={IMG.magazine} x={100} y={370} w={420} rot={-3} at={at('A popular')} out={at('And a salute:')} />
        <Note text="a kids' magazine" x={110} y={360} size={46} rot={-3} at={at('A popular')} out={at('And a salute:')} color="#2b2113" />
        <Card p={IMG.bellamy} x={570} y={400} w={360} rot={3} at={at('Francis Bellamy,') - 4} out={at('And a salute:')} filter={LOOK.bw} />
        <Note text="Francis Bellamy" x={590} y={880} size={50} rot={-3} at={at('Francis Bellamy,')} out={at('And a salute:')} color="#2b2113" />
        <FlagSketch x={800} y={420} w={180} at={at('And a salute:') - 2} />
        <SaluteFigure x={260} y={430} h={560} at={at('And a salute:') - 2} from="down" to="salute" a={at('right arm,')} b={at('straight out') + 4} color="#0f5e55" />
        <Note text="right arm, straight out" x={200} y={1010} size={58} rot={-3} at={at('straight out') - 2} color="#b3261e" />
      </Desk>
    )],
    // 0:29 That October: millions said it together
    [at('That October,') - 1, (
      <Photo p={IMG.schoolroom} a={at('That October,')} b={at('Then came')} z={[1.02, 1.12]}>
        <Note text="the salute in practice, 1899" x={70} y={300} size={58} rot={-3} at={at('That October,')} color="#ffffff" />
        <Counter from={0} to={10000000} a={at('millions') - 4} b={at('first time.')} x={70} y={880} size={120} prefix="~" round={100000} />
        <Note text="schoolchildren, all at once" x={80} y={1010} size={52} rot={-3} at={at('schoolchildren') - 2} color="#ffffff" />
      </Photo>
    )],
    // 0:34 The 1920s–30s: the two salutes side by side, drawn (no Nazi imagery)
    [at('Then came') - 1, (
      <Desk a={at('Then came')}>
        <SaluteFigure x={90} y={420} h={430} at={at('Then came')} from="salute" to="salute" label="1892" labelColor={pal.mark} />
        <SaluteFigure x={560} y={420} h={430} at={at('Fascists') - 2} from="salute" to="salute" color={pal.subject} label="1920s–30s" labelColor={pal.subject} />
        <Note text="almost the same." x={250} y={300} size={70} rot={-3} at={at('almost the same.') - 2} color="#ffffff" />
        <Stamp text="1942: AT WAR WITH BOTH" x={70} y={1010} at={at('at war with both.') - 4} size={70} color="#f4efe6" rot={-3} />
      </Desk>
    )],
    // 0:43 December 1942: the arm moves to the heart
    [at('So that December,') - 1, (
      <Desk a={at('So that December,')}>
        <Stamp text="DEC. 1942" x={80} y={330} at={at('So that December,')} size={110} color={pal.subject} rot={-5} />
        <FlagSketch x={150} y={500} w={170} at={at('So that December,')} />
        <SaluteFigure x={250} y={520} h={520} at={at('So that December,')} from="salute" to="heart" a={at('Right hand,')} b={at('over the heart.') + 6} />
        <Note text="right hand, over the heart" x={70} y={1090} size={56} rot={-3} at={at('Right hand,')} color={pal.mark} />
      </Desk>
    )],
    // 0:47 The answer, back on the 1942 photo (the loop)
    [at('So why were') - 1, (
      <Photo p={IMG.photo1942} a={at('So why were')} b={at('If you want')} z={[1.05, 1.05]}>
        <Highlight text="THE PLEDGE'S SALUTE." x={50} y={300} size={92} at={at('Because it was')} seed={74} rot={-3} />
        <Note text="decades before anyone else" x={90} y={470} size={56} rot={-3} at={at('decades before') - 2} color="#ffffff" />
      </Photo>
    )],
  ];
  return <>{useScene(cuts)}</>;
};

export const PledgeShort: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(NARR, FPS);
  const endAt = t.at('If you want') - 10;
  const cut = Math.round(CUT * FPS);
  const cutsAt = ['That was the salute', 'In schools across', 'So where', 'In 1892,', 'That October,', 'Then came', 'So that December,', 'So why were'].map((p) => t.at(p) - 1);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          <Scenes t={t} />
          <EndCard t={t} start="If you want" thanks={false} />
          {frame >= COVER.frames && <Captions n={NARR} until={endAt} />}
          <TopicStrip text="THE PLEDGE'S FORGOTTEN SALUTE" until={endAt} />
          {frame < COVER.frames + COVER.fade && (
            <AbsoluteFill style={{opacity: interpolate(frame, [COVER.frames, COVER.frames + COVER.fade], [1, 0], clamp)}}>
              <Cover at={-40} />
            </AbsoluteFill>
          )}
          <Mark />
          <Audio src={staticFile(WAV)} endAt={cut} />
          <Sequence from={cut + Math.round(BEAT * FPS)} layout="none">
            <Audio src={staticFile(WAV)} startFrom={cut} />
          </Sequence>
          <Audio src={staticFile(MUSIC.src)} startFrom={Math.round(MUSIC.from * FPS)} volume={(g) => interpolate(g, [0, 10, endAt - 10, endAt + 20], [0, MUSIC.vol, MUSIC.vol, 0.04], clamp)} />
          {cutsAt.map((g, i) => <Sfx key={i} at={g} src="sfx/page_turn.wav" volume={0.18} />)}
          <Sfx at={t.at('fifty years.')} src="sfx/stamp.wav" volume={0.25} />
          <Sfx at={t.at('straight out')} src="sfx/marker_tick.wav" volume={0.3} />
          <Sfx at={t.at('at war with both.') - 4} src="sfx/stamp.wav" volume={0.25} />
          <Sfx at={t.at('So that December,')} src="sfx/stamp.wav" volume={0.28} />
          <Sfx at={t.at('tap like') + 2} src="sfx/marker_tick.wav" volume={0.3} />
          <Sfx at={t.at('and subscribe') + 4} src="sfx/marker_tick.wav" volume={0.3} />
          <Finish vignette={0.35} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
