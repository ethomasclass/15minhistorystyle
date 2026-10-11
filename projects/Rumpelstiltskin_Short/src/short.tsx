// This Movie Scene Never Existed (Rumpelstiltskin): a standalone native vertical Short (1080x1920).
//
// Presentation (script/SCRIPT.md): the viral AI clip plays muted inside a sideways teal phone, opens the Short and
// closes it (a loop); a typed index card for the real 1987 film; a film strip whose blank frames get filled in for
// the memory beat; the case-file folder for the 1812 tale; a split card for the two endings; a persistent topic strip;
// and the like/subscribe end card.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration} from './lib/timing';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, usePal} from './kit/Kit';
import {Sfx} from './kit/common';
import {hasFile, Stamp, type TL, useScene} from './kit/shell';
import {Desk, DropCard, LOOK, StandIn} from './kit/bs';
import {Captions, EndCard, Folder, FPS, Mark, PhoneWide, ScreenStill, TopicStrip, withBeat} from './kit/vshort';
import words from '../public/audio/short_rumpelstiltskin.words.json';
import {IMG, type Pic} from './images';
import {Cover} from './cover';

const WAV = 'audio/short_rumpelstiltskin.wav';
const BEAT = 0.9;
const COVER = {id: 'C' as const, frames: 45, fade: 6};  // hook cover: the first 1.5 s, fully drawn from frame 0 (pick it as the Shorts cover)
const HOLD = 45;
// r_schools: its comic final button (the last note before 59.3 s of the cue) lands on "a computer did too."
const MUSIC = {src: 'music/r_schools.mp3', vol: 0.13, soundEnd: 59.27, landOn: 'did too.'};
const CLIP = {tiptoe: 'video/ai_clip_tiptoe_shush_muted.mp4', dance: 'video/ai_clip_dance_muted.mp4', tiptoeFrames: 99, danceFrames: 75};

const {narr: NARR, cut: CUT, lastWordEnd} = withBeat(words as Narration, 'Thanks', BEAT);
export const SHORT_FRAMES = Math.ceil(lastWordEnd * FPS) + HOLD;

/** A picture if it has arrived; otherwise a labelled stand-in of the same footprint. */
const Card: React.FC<{p: Pic; x: number; y: number; w: number; rot?: number; at: number; out?: number; filter?: string}> = ({p, x, y, w, rot = 0, at, out, filter}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f >= out)) return null;
  if (!hasFile(p.src)) return <StandIn x={x} y={y} w={w} h={w * (p.size[1] / p.size[0])} rot={rot} label={p.src.split('/').pop()!} />;
  return <DropCard src={p.src} x={x} y={y} w={w} rot={rot} at={at} out={out} filter={filter ?? LOOK.doc} />;
};

/** The small credit, centred under the phone while the clip plays (never in a corner). */
const Credit: React.FC<{y: number}> = ({y}) => (
  <div style={{position: 'absolute', left: 0, width: 1080, top: y, textAlign: 'center', fontFamily: JF.mono, fontSize: 24, letterSpacing: 1.5, color: 'rgba(237,231,220,0.8)',
    textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>AI clip, 2026 · @stroinaya</div>
);

/** The muted AI clip, looping in the phone screen until `freeze`, then held on its last frame (grey once frozen). */
const ClipInPhone: React.FC<{src: string; frames: number; still: string; a: number; freeze: number; sw: number; sh: number; grey?: number}> = ({src, frames, still, a, freeze, sw, sh, grey}) => {
  const f = useCurrentFrame();
  const g = grey === undefined ? 0 : interpolate(f, [grey, grey + 10], [0, 1], clamp);
  const filter = `grayscale(${g}) brightness(${1 - g * 0.35})`;
  if (f >= freeze) return <ScreenStill src={still} sw={sw} sh={sh} filter={filter} />;
  return (
    <Sequence from={a} layout="none">
      <Loop durationInFrames={frames} layout="none">
        <OffthreadVideo src={staticFile(src)} muted style={{width: sw, height: sh, objectFit: 'cover', filter}} />
      </Loop>
    </Sequence>
  );
};

/** The memory beat: a film strip; three blank frames get filled with what's real, then the fake slides into the fourth. */
const FilmStrip: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const at = t.at;
  const x = 170, w = 740, fh = 150, gap = 24, y0 = 390;
  const fills: [string, number][] = [['a real title', at('A real title.')], ['a real actor', at('A real actor.')], ['the right decade', at('The right decade.')]];
  const fake = at('And the fake');
  const slide = interpolate(f, [fake, fake + 8], [-900, 0], {...clamp, easing: (u) => 1 - Math.pow(1 - u, 3)});
  return (
    <div style={{position: 'absolute', left: x, top: y0 - 30, width: w, height: 4 * fh + 3 * gap + 60, background: '#16130e', borderRadius: 8, boxShadow: '0 24px 50px rgba(0,0,0,0.7)'}}>
      {/* sprocket holes */}
      {Array.from({length: 14}, (_, i) => (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: 12, top: 20 + i * 52, width: 22, height: 30, borderRadius: 4, background: '#3a342a'}} />
          <div style={{position: 'absolute', right: 12, top: 20 + i * 52, width: 22, height: 30, borderRadius: 4, background: '#3a342a'}} />
        </React.Fragment>
      ))}
      {[0, 1, 2, 3].map((i) => {
        const top = 30 + i * (fh + gap);
        return (
          <div key={i} style={{position: 'absolute', left: 60, top, width: w - 120, height: fh, background: '#26221b', overflow: 'hidden', border: `3px solid ${i === 3 && f >= fake ? pal.subject : '#4a4337'}`}}>
            {i < 3 && <Note text={fills[i][0]} x={30} y={38} size={66} rot={-2} at={fills[i][1] - 2} color={pal.mark} />}
            {i === 3 && f >= fake && (
              <div style={{position: 'absolute', left: slide, top: 0, width: w - 120, height: fh}}>
                <ScreenStill src="video/ai_clip_shush.jpg" sw={w - 120} sh={fh} />
                <div style={{position: 'absolute', inset: 0, background: pal.subject, mixBlendMode: 'multiply', opacity: 0.45}} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Scenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const frame = useCurrentFrame();
  const phone = {x: 50, y: 360, w: 980};
  const sw = phone.w * 0.8, sh = phone.w * 0.62 - phone.w * 0.07;
  const below = phone.y + phone.w * 0.62 + 14;
  const cuts: [number, React.ReactNode][] = [
    // 0:00 The clip, playing muted in the phone; "Rumpelstiltskin, 1987" label; "they remember it"
    [0, (
      <Desk a={0}>
        <PhoneWide x={phone.x} y={phone.y} w={phone.w} at={0}>
          {() => <ClipInPhone src={CLIP.tiptoe} frames={CLIP.tiptoeFrames} still="video/ai_clip_tiptoe_last.jpg" a={0} freeze={at("They don't.")} sw={sw} sh={sh} grey={at("They don't.")} />}
        </PhoneWide>
        <Credit y={below} />
        <Note text={'"Rumpelstiltskin (1987)"'} x={80} y={300} size={60} rot={-3} at={at('labeled') - 2} color="#ffffff" />
        <Note text="people remember it..." x={80} y={1040} size={64} rot={-3} at={at('remember') - 4} out={at("They don't.")} color={pal.mark} />
        <Stamp text="AI · 2026" x={250} y={560} at={at('made with AI,')} size={150} color={pal.subject} rot={-8} />
        <Note text="they don't." x={80} y={1040} size={64} rot={-3} at={at("They don't.")} color={pal.subject} />
      </Desk>
    )],
    // 0:13 The real 1987 film: its poster and the facts in teal
    [at("Here's why") - 1, (
      <Desk a={at("Here's why")}>
        <Note text="so why does it feel familiar?" x={70} y={290} size={58} rot={-3} at={at("Here's why")} color="#ffffff" />
        <Card p={IMG.poster} x={70} y={380} w={440} rot={-3} at={at('There really')} filter={LOOK.card} />
        <Note text="the real one:" x={560} y={420} size={56} rot={-3} at={at('There really')} color="#ffffff" />
        <Note text="Cannon Films" x={570} y={510} size={56} rot={-3} at={at('Cannon Films,') - 2} color={pal.mark} />
        <Note text="a musical" x={570} y={590} size={56} rot={-3} at={at('A musical') - 2} color={pal.mark} />
        <Note text="Billy Barty" x={570} y={670} size={56} rot={-3} at={at('Billy Barty') - 2} color={pal.mark} />
        <Note text="in the title role" x={570} y={745} size={46} rot={-3} at={at('the title role') - 2} color="#ffffff" />
        <Note text="April 1987" x={570} y={830} size={56} rot={-3} at={at('the title role') + 6} color={pal.mark} />
        <Note text="the barn scene: ✗" x={90} y={1010} size={66} rot={-3} at={at('The barn scene') - 2} color={pal.subject} />
      </Desk>
    )],
    // 0:23 Memory: not a recording, a rebuild; the strip fills in; the fake slides in
    [at("That's how memory") - 1, (
      <Desk a={at("That's how memory")}>
        <Note text="memory ≠ a recording" x={80} y={260} size={62} rot={-3} at={at('play back') - 2} color="#ffffff" />
        {frame < at('A real title.') ? (
          <>
            <PhoneWide x={phone.x} y={phone.y} w={phone.w} at={at('rebuilds') - 4}>
              {() => <ClipInPhone src={CLIP.dance} frames={CLIP.danceFrames} still="video/ai_clip_dance_last.jpg" a={at('rebuilds') - 4} freeze={at('rebuilds') - 4 + CLIP.danceFrames} sw={sw} sh={sh} grey={at('fills the gaps')} />}
            </PhoneWide>
            {frame >= at('rebuilds') - 4 && <Credit y={below} />}
            <Note text="it rebuilds it" x={90} y={1050} size={66} rot={-3} at={at('rebuilds') - 2} color={pal.mark} />
          </>
        ) : (
          <FilmStrip t={t} />
        )}
      </Desk>
    )],
    // 0:35 The 1812 tale: the case-file folder, then the bargain as a ledger
    [at('The story itself') - 1, (
      <Desk a={at('The story itself')}>
        <Folder at={at('The story itself') - 1} label="KINDER- UND HAUSMÄRCHEN" />
        <Card p={IMG.grimm1812} x={110} y={390} w={340} rot={-3} at={at('The Brothers')} />
        <Stamp text="1812" x={590} y={430} at={at('1812', 1)} size={150} color={pal.subject} rot={-5} />
        <Card p={IMG.spinning} x={580} y={540} w={330} rot={3} at={at('A miller')} />
        <Note text="straw → gold" x={100} y={925} size={60} rot={-3} at={at('straw into') - 2} color="#2b2113" />
        <Note text="✓ necklace" x={100} y={1000} size={52} rot={-3} at={at('necklace,') - 2} color="#2b2113" />
        <Note text="✓ ring" x={460} y={1000} size={52} rot={-3} at={at('her ring,') - 2} color="#2b2113" />
        <Note text="her firstborn child" x={100} y={1070} size={58} rot={-3} at={at('firstborn') - 2} color="#b3261e" />
      </Desk>
    )],
    [at('She gets out') - 1, (
      <Desk a={at('She gets out')}>
        <Card p={IMG.name} x={220} y={300} w={640} rot={-2} at={at('She gets out')} />
        <Highlight text="GUESS HIS NAME" x={90} y={1060} size={88} at={at('guessing his name')} seed={81} rot={-3} />
      </Desk>
    )],
    // 0:50 Two endings, split top and bottom
    [at('In 1812, he') - 1, (
      <Desk a={at('In 1812, he')}>
        <Card p={IMG.dance} x={90} y={300} w={360} rot={-3} at={at('In 1812, he')} />
        <Note text="1812:" x={500} y={360} size={70} rot={-3} at={at('In 1812, he')} color="#ffffff" />
        <Note text="storms off." x={500} y={450} size={66} rot={-3} at={at('storms off') - 2} color={pal.mark} />
        <Card p={IMG.ending} x={600} y={600} w={300} rot={3} at={at('By 1857,')} />
        <Note text="1857:" x={90} y={760} size={70} rot={-3} at={at('By 1857,')} color="#ffffff" />
        <Note text="tears himself" x={90} y={850} size={62} rot={-3} at={at('tears himself') - 2} color={pal.subject} />
        <Note text="in two." x={110} y={930} size={62} rot={-3} at={at('in two.') - 2} color={pal.subject} />
        <Note text="okay. dramatic." x={90} y={1040} size={66} rot={-4} at={at('Okay.') - 2} color="#ffffff" />
      </Desk>
    )],
    // 0:57 Thousands of years; then the phone again: 1812 → 2026 (the loop)
    [at('Some researchers') - 1, (
      <Desk a={at('Some researchers')}>
        <Note text="how old is the story?" x={80} y={300} size={60} rot={-3} at={at('Some researchers')} color="#ffffff" />
        <Stamp text="THOUSANDS" x={70} y={460} at={at('thousands')} size={150} color={pal.subject} rot={-4} />
        <Note text="of years? (an estimate)" x={110} y={640} size={58} rot={-3} at={at('years old') - 2} color={pal.mark} />
        <Note text="retold, and retold, and retold..." x={80} y={820} size={56} rot={-3} at={at('retelling') - 2} color="#ffffff" />
      </Desk>
    )],
    [at('This year,') - 1, (
      <Desk a={at('This year,')}>
        <PhoneWide x={phone.x} y={phone.y} w={phone.w} at={at('This year,') - 1}>
          {() => <ClipInPhone src={CLIP.tiptoe} frames={CLIP.tiptoeFrames} still="video/ai_clip_tiptoe_first.jpg" a={at('This year,') - 1} freeze={1e7} sw={sw} sh={sh} />}
        </PhoneWide>
        <Credit y={below} />
        <Stamp text="1812 → 2026" x={150} y={1030} at={at('computer')} size={120} color={pal.subject} rot={-4} />
      </Desk>
    )],
  ];
  return <>{useScene(cuts)}</>;
};

export const RumpelShort: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(NARR, FPS);
  const endAt = t.at('Thanks') - 10;
  const cut = Math.round(CUT * FPS);
  const cutsAt = ["Here's why", "That's how memory", 'The story itself', 'She gets out', 'In 1812, he', 'Some researchers', 'This year,'].map((p) => t.at(p) - 1);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          <Scenes t={t} />
          <EndCard t={t} />
          {frame >= COVER.frames && <Captions n={NARR} until={endAt} />}
          <TopicStrip text="THIS SCENE NEVER EXISTED" until={endAt} />
          {frame < COVER.frames + COVER.fade && (
            <AbsoluteFill style={{opacity: interpolate(frame, [COVER.frames, COVER.frames + COVER.fade], [1, 0], clamp)}}>
              <Cover id={COVER.id} at={-40} />
            </AbsoluteFill>
          )}
          <Mark />
          <Audio src={staticFile(WAV)} endAt={cut} />
          <Sequence from={cut + Math.round(BEAT * FPS)} layout="none">
            <Audio src={staticFile(WAV)} startFrom={cut} />
          </Sequence>
          <Sequence from={Math.max(0, t.end(MUSIC.landOn) + 6 - Math.round(MUSIC.soundEnd * FPS))} layout="none">
            <Audio src={staticFile(MUSIC.src)} volume={(g) => interpolate(g, [0, 8], [0, MUSIC.vol], clamp)} />
          </Sequence>
          {cutsAt.map((g, i) => <Sfx key={i} at={g} src="sfx/whoosh.wav" volume={0.22} />)}
          <Sfx at={t.at('made with AI,')} src="sfx/stamp.wav" volume={0.3} />
          <Sfx at={t.at('1812', 1)} src="sfx/stamp.wav" volume={0.25} />
          <Sfx at={t.at('thousands')} src="sfx/stamp.wav" volume={0.25} />
          <Sfx at={t.at('computer')} src="sfx/stamp.wav" volume={0.3} />
          <Sfx at={t.at('There really')} src="sfx/tick.wav" volume={0.2} />
          <Sfx at={t.at('tap like') + 2} src="sfx/marker_tick.wav" volume={0.3} />
          <Sfx at={t.at('and subscribe') + 4} src="sfx/marker_tick.wav" volume={0.3} />
          <Finish vignette={0.35} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
