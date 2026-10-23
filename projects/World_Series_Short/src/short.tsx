// Why Is It Called the "World" Series? A standalone native vertical Short (1080x1920).
//
// Hook cover (Toronto, "2 of 121"), the 1997 logo's globe circled, the newspaper myth stamped MYTH, 1884 in the case
// file, the 1904 boycott, the name shrinking word by word over a hand-drawn Commissioner's Trophy, and the 2026
// kicker (Venezuela). Then the like/subscribe end card.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration} from './lib/timing';
import {Finish, Highlight, JF, Loop as Ring, Note, PALETTES, PaletteCtx, StepCtx, Tag, usePal} from './kit/Kit';
import {Sfx} from './kit/common';
import {hasFile, Stamp, type TL, useScene} from './kit/shell';
import {Arch, Desk, DropCard, LOOK, StandIn} from './kit/bs';
import {Captions, EndCard, Folder, FPS, Mark, TAG_Y, TopicStrip, withBeat} from './kit/vshort';
import {Trophy} from './trophy';
import {Cover} from './cover';
import words from '../public/audio/short_world_series.words.json';
import {IMG, type Pic} from './images';

const WAV = 'audio/short_world_series.wav';
const BEAT = 0.6;
const HOLD = 30;
const COVER = {frames: 45, fade: 6};
// a_price: its cheeky brass button (first hit at 61.5 s of the cue, after a short break) lands on "To Venezuela."
const MUSIC = {src: 'music/a_price.mp3', vol: 0.22, button: 61.5, landOn: 'Venezuela.'};

const {narr: NARR, cut: CUT, lastWordEnd} = withBeat(words as Narration, 'If', BEAT);
export const SHORT_FRAMES = Math.ceil(lastWordEnd * FPS) + HOLD;

/** A picture if it has arrived; otherwise a labelled stand-in of the same footprint. */
const Card: React.FC<{p: Pic; x: number; y: number; w: number; rot?: number; at: number; out?: number; filter?: string}> = ({p, x, y, w, rot = 0, at, out, filter}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f >= out)) return null;
  if (!hasFile(p.src)) return <StandIn x={x} y={y} w={w} h={w * (p.size[1] / p.size[0])} rot={rot} label={p.src.split('/').pop()!} />;
  return <DropCard src={p.src} x={x} y={y} w={w} rot={rot} at={at} out={out} filter={filter ?? LOOK.doc} />;
};

/** "WORLD'S CHAMPIONSHIP SERIES" losing words: CHAMPIONSHIP struck at `a`, the 's at `b`; then it settles. */
const Shrinking: React.FC<{a: number; b: number; c: number; y: number}> = ({a, b, c, y}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const g = Math.floor(f / 2.5) * 2.5;
  const strike = (at: number) => interpolate(g, [at, at + 6], [0, 1], clamp);
  const gone = (at: number) => interpolate(g, [at + 10, at + 16], [1, 0], clamp);
  const word = (text: string, out: number | null, key: string) => (
    <span key={key} style={{position: 'relative', display: 'inline-block', opacity: out === null ? 1 : gone(out), maxWidth: out === null ? undefined : `${gone(out) * 100}%`, overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'bottom'}}>
      {text}
      {out !== null && <span style={{position: 'absolute', left: 0, top: '52%', height: 9, width: `${strike(out) * 100}%`, background: pal.subject, transform: 'rotate(-3deg)'}} />}
    </span>
  );
  const done = f >= c;
  return (
    <div style={{position: 'absolute', left: 60, width: 960, top: y, textAlign: 'center', fontFamily: JF.display, fontSize: 84, lineHeight: 1.1, color: done ? (pal.box ?? '#FF9F1C') : '#f4efe6',
      textShadow: '0 6px 22px rgba(0,0,0,0.85)'}}>
      {word('WORLD', null, 'w')}
      {word('’S', b, 's')}
      {' '}
      {word('CHAMPIONSHIP\u00a0', a, 'c')}
      {word('SERIES', null, 'e')}
    </div>
  );
};

const Scenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const T = (p: Pic) => (p.tag ? <Tag text={p.tag} x={44} y={TAG_Y} /> : null);
  const cuts: [number, React.ReactNode][] = [
    // 0:00 Toronto, twice (under the cover for the first 1.5 s)
    [0, (
      <Arch src={IMG.jays.src} tag={IMG.jays.tag!} a={0} b={at('So why')} z={[1.0, 1.1]} pos="52% 30%" look="card" tagY={TAG_Y}>
        <Note text="outside the U.S.:" x={70} y={300} size={60} rot={-3} at={at('outside')} color="#ffffff" />
        <Stamp text="WON TWICE" x={70} y={380} at={at('exactly twice.')} size={130} color={pal.subject} rot={-4} />
        <DropCard src={IMG.si.src} x={600} y={620} w={330} rot={5} at={at('Both times,')} filter={LOOK.card} />
        <Note text="Toronto: 1992, 1993" x={70} y={1060} size={62} rot={-3} at={at('Toronto.') - 2} color={pal.mark} />
      </Arch>
    )],
    // 0:07 So why "World"? The globe in the logo, circled
    [at('So why') - 1, (
      <Desk a={at('So why')}>
        <DropCard src={IMG.logo.src} x={90} y={420} w={900} rot={-2} at={at('So why') - 1} filter="none" />
        <Ring cx={560} cy={700} rx={210} ry={190} at={at('why World') + 4} dur={10} width={8} seed={3} color={pal.subject} />
        <Note text="so why “World”?" x={90} y={300} size={70} rot={-3} at={at('So why')} color="#ffffff" />
      </Desk>
    )],
    // 0:09 The myth: the New York World
    [at("You've probably") - 1, (
      <Desk a={at("You've probably")}>
        <Note text="the story you've heard:" x={80} y={290} size={56} rot={-3} at={at("You've probably")} color="#ffffff" />
        <Card p={IMG.world} x={70} y={380} w={430} rot={-2} at={at('New York World.') - 6} />
        {T(IMG.world)}
        <Stamp text="MYTH" x={90} y={600} at={at('Not true.')} size={170} color={pal.subject} rot={-12} />
        <Note text="never sponsored it" x={530} y={560} size={44} rot={-3} at={at('never sponsored') - 2} color="#ffffff" />
        <Note text="first claimed in print:" x={530} y={680} size={38} rot={-3} at={at('earliest') - 2} color="#ffffff" />
        <Stamp text="1991" x={560} y={760} at={at('1991.')} size={130} color={pal.mark} rot={-4} />
      </Desk>
    )],
    // 0:20 The real answer
    [at('The real answer') - 1, (
      <Desk a={at('The real answer')}>
        <Note text="the real answer:" x={90} y={520} size={80} rot={-3} at={at('The real answer')} color="#ffffff" />
        <Highlight text="A BRAG." x={180} y={660} size={190} at={at('a brag.')} seed={84} rot={-4} />
      </Desk>
    )],
    // 0:22 1884
    [at('1884.') - 1, (
      <Desk a={at('1884.')}>
        <Folder at={at('1884.') - 1} label="1884 · THE FIRST ONE" />
        <Card p={IMG.grays} x={110} y={360} w={520} rot={-3} at={at('1884.')} />
        {T(IMG.grays)}
        <Stamp text="1884" x={680} y={400} at={at('1884.')} size={130} color={pal.subject} rot={-6} />
        <Note text="NL champs vs AA champs" x={110} y={700} size={42} rot={-3} at={at('two rival') - 2} color="#2b2113" />
        <Card p={IMG.headline1884} x={120} y={795} w={790} rot={1.5} at={at("World's Championship") - 4} />
        <Note text="best baseball on Earth? right here." x={70} y={1110} size={44} rot={-3} at={at('best baseball') - 2} color="#b3261e" />
      </Desk>
    )],
    // 0:35 1904: the Giants refuse
    [at('How confident') - 1, (
      <Desk a={at('How confident')}>
        <Note text="how confident?" x={80} y={290} size={70} rot={-3} at={at('How confident')} color="#ffffff" />
        <Card p={IMG.brush} x={80} y={400} w={300} rot={-3} at={at('In 1904,')} filter={LOOK.bw} />
        {T(IMG.brush)}
        <Note text="Giants owner John T. Brush" x={420} y={410} size={42} rot={-3} at={at('New York Giants') - 2} color="#ffffff" />
        <Stamp text="1904:" x={430} y={480} at={at('refused')} size={100} color="#f4efe6" rot={-4} />
        <Stamp text="NO SERIES" x={420} y={590} at={at('refused') + 4} size={96} color={pal.subject} rot={-4} />
        <Note text="the other league? “minor.”" x={420} y={730} size={48} rot={-3} at={at('minor."') - 8} color={pal.mark} />
        <Card p={IMG.noSeries} x={80} y={860} w={900} rot={-1} at={at('refused') + 2} />
      </Desk>
    )],
    // 0:44 The name stuck: the words fall away over a hand-drawn trophy
    [at('The name stuck.') - 1, (
      <Desk a={at('The name stuck.')}>
        <Shrinking a={at("World's Series.")} b={at('Then just:')} c={at('the World Series.', 2)} y={250} />
        <Trophy x={330} y={470} w={420} at={at('The name stuck.')} />
      </Desk>
    )],
    // 0:49 The kicker: 2026, Venezuela
    [at('And this year,') - 1, (
      <Arch src={IMG.venezuela.src} tag={IMG.venezuela.tag!} a={at('And this year,')} b={at('If you want')} z={[1.02, 1.1]} pos="50% 30%" look="card" tagY={TAG_Y}>
        <Note text="2026: the actual world" x={70} y={300} size={62} rot={-3} at={at('actual world') - 2} color="#ffffff" />
        <Note text="World Baseball Classic" x={90} y={380} size={52} rot={-3} at={at('played for') - 2} color={pal.mark} />
        <Stamp text="FINAL: VENEZUELA 3, USA 2" x={60} y={1000} at={at('lost the final.')} size={64} color="#f4efe6" rot={-3} />
      </Arch>
    )],
  ];
  return <>{useScene(cuts)}</>;
};

export const WorldSeriesShort: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(NARR, FPS);
  const endAt = t.at('If you want') - 10;
  const cut = Math.round(CUT * FPS);
  const cutsAt = ['So why', "You've probably", 'The real answer', '1884.', 'How confident', 'The name stuck.', 'And this year,'].map((p) => t.at(p) - 1);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          <Scenes t={t} />
          <EndCard t={t} start="If you want" thanks={false} />
          {frame >= COVER.frames && <Captions n={NARR} until={endAt} />}
          <TopicStrip text="WHY “WORLD” SERIES?" until={endAt} />
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
          <Audio src={staticFile(MUSIC.src)} startFrom={Math.max(0, Math.round(MUSIC.button * FPS) - t.at(MUSIC.landOn))}
            volume={(g) => interpolate(g, [0, 10], [0, MUSIC.vol], clamp)} />
          {cutsAt.map((g, i) => <Sfx key={i} at={g} src="sfx/whoosh.wav" volume={0.22} />)}
          <Sfx at={t.at('exactly twice.')} src="sfx/stamp.wav" volume={0.3} />
          <Sfx at={t.at('Not true.')} src="sfx/stamp.wav" volume={0.35} />
          <Sfx at={t.at('1884.')} src="sfx/stamp.wav" volume={0.25} />
          <Sfx at={t.at('refused')} src="sfx/stamp.wav" volume={0.3} />
          <Sfx at={t.at('lost the final.')} src="sfx/stamp.wav" volume={0.3} />
          <Sfx at={t.at('tap like') + 2} src="sfx/marker_tick.wav" volume={0.3} />
          <Sfx at={t.at('and subscribe') + 4} src="sfx/marker_tick.wav" volume={0.3} />
          <Finish vignette={0.35} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};

