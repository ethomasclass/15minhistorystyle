// The Candy Man: the Halloween poison scare. A standalone native vertical Short (1080x1920).
//
// Door to door: the hand at the dark door (the motif) comes back with a new thing in it each time the fear returns
// (a Pixy Stix in 1974, a capsule in 1982, a pill in 2022) and finally pulls back on an empty hall. Between doors:
// the bags, the stapled stick under a Loupe, the father as the coral cut-out, the policy, the 1982 papers with a
// highlighter swipe, the DEA warning, the X-ray scan and the counter that never leaves zero. Then the end card.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration} from './lib/timing';
import {Finish, Highlight, Loop as Ring, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame} from './kit/Kit';
import {Sfx} from './kit/common';
import {Stamp, type TL, useScene} from './kit/shell';
import {Desk, DropCard, LOOK} from './kit/bs';
import {Cut} from './kit/desk';
import {Captions, EndCard, FPS, Mark, TAG_Y, TopicStrip, withBeat} from './kit/vshort';
import {Bag, Chip, CORAL, CREAM, DoorShot, Loupe, ORANGE, Policy, Street, XRay, YearFlip} from './candy';
import {Cover} from './cover';
import {MASKS} from './masks';
import {IMG, type Pic} from './images';
import words from '../public/audio/short_candy_scare.words.json';

const WAV = 'audio/short_candy_scare.wav';
const BEAT = 0.7;
const HOLD = 30;
export const COVER = {frames: 45, fade: 6};
// m_reveal: a Shorts engine (ticking clock, pizzicato, low piano) whose last strong accent (~64 s) lands on "Not one child."
const MUSIC = {src: 'music/m_reveal.mp3', vol: 0.2, accent: 64, landOn: 'Not one child.'};

const {narr: NARR, cut: CUT, lastWordEnd} = withBeat(words as Narration, 'Thanks', BEAT);
export const SHORT_FRAMES = Math.ceil(lastWordEnd * FPS) + HOLD;

const tagOf = (p: Pic) => (p.tag ? <Tag text={p.tag} x={44} y={TAG_Y} /> : null);

/** A coral highlighter wash that sweeps left to right across a box of a card's source image (x0, y0, x1, y1 in source px). */
const Swipe: React.FC<{card: {w: number; img: [number, number]}; box: [number, number, number, number]; at: number; dur?: number}> = ({card, box, at, dur = 10}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = Math.max(8, card.w * 0.03);
  const s = (card.w - 2 * p) / card.img[0];
  const k = interpolate(g, [at, at + dur], [0, 1], clamp);
  const [x0, y0, x1, y1] = box;
  return (
    <div style={{position: 'absolute', left: p + x0 * s, top: p + y0 * s, width: (x1 - x0) * s * k, height: (y1 - y0) * s, background: CORAL, mixBlendMode: 'multiply', opacity: 0.75,
      clipPath: 'polygon(0 6%, 100% 0, 100% 94%, 0 100%)'}} />
  );
};

/** The door scene's hand reaching out a little further over time (it's never quite still). */
const reachOf = (f: number, a: number) => 0.92 + 0.08 * Math.min(1, Math.max(0, (f - a) / 90));

const Scenes: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    // 0:00 the cover, then the door: a hand, a giant Pixy Stix, a dark house
    [0, (
      <DoorShot ext={reachOf(f, 0)} held="stix" light={interpolate(f, [at('Within'), at('Within') + 20], [0.6, 0.3], clamp)}>
        <Highlight text="HALLOWEEN 1974 · OUTSIDE HOUSTON" x={60} y={250} size={46} at={at('Within')} seed={11} rot={-2} />
        <Ring cx={850} cy={720} rx={250} ry={110} at={at('Just a hand,')} dur={10} width={7} seed={4} tilt={-6} />
      </DoorShot>
    )],
    // 0:10 why it matters: a kid, a pail, the candy check
    [at('That hand is') - 1, (
      <Desk a={at('That hand is')}>
        <Cut name="kid79" mask={MASKS.kid79} size={IMG.kid79.size as [number, number]} box={[40, 450, 520, 690]} at={at('That hand is')} tint={false} bare />
        <Cut name="pail" mask={MASKS.pail} size={IMG.pail.size as [number, number]} box={[520, 640, 500, 500]} at={at('That hand is') + 4} bare />
        <Note text="every Halloween:" x={70} y={250} size={58} rot={-3} at={at('parents still')} color="#ffffff" />
        <Note text="check the candy." x={90} y={335} size={66} rot={-3} at={at('check Halloween')} />
        {tagOf(IMG.kid79)}
      </Desk>
    )],
    // 0:13 the question
    [at('So whose hand') - 1, (
      <DoorShot ext={reachOf(f, at('So whose hand'))} held="stix" light={0.3}>
        <Highlight text="WHOSE" x={640} y={480} size={92} at={at('So whose hand')} seed={21} rot={-4} />
        <Highlight text="HAND?" x={660} y={590} size={92} at={at('So whose hand') + 3} seed={22} rot={-3} />
      </DoorShot>
    )],
    // 0:16 four more sticks, four other bags; the Loupe on the stapled end
    [at('Four more Pixy') - 1, (
      <Desk a={at('Four more Pixy')}>
        <Note text="4 more · in 4 other kids' bags" x={70} y={250} size={50} rot={-3} at={at('Four more Pixy')} color="#ffffff" />
        {[0, 1, 2, 3].map((i) => (
          <Bag key={i} x={170 + i * 245} y={1120} w={190} seed={`bag${i}`} dropAt={at('Four more Pixy') + 4 + i * 5} checkAt={at('turn up') + 10 + i * 3} />
        ))}
        <Loupe cx={620} cy={470} r={160} fromX={430} fromY={760} at={at('cyanide.') - 2} />
        <Note text="refilled with cyanide" x={70} y={660} size={46} rot={-3} at={at('cyanide.') + 4} color={CORAL} />
        <Note text="stapled shut" x={90} y={330} size={46} rot={-3} at={at('cyanide.') + 8} />
      </Desk>
    )],
    // 0:21 the dark house: its owner was at work
    [at('And the dark house?') - 1, (
      <DoorShot ext={1} held="stix" light={0.3} strikeAt={at('The owner was')}>
        <Note text="the owner? at work." x={70} y={250} size={60} rot={-3} at={at('The owner was')} color="#ffffff" />
        <Note text="200+ people saw him" x={90} y={330} size={48} rot={-4} at={at('at work.')} />
      </DoorShot>
    )],
    // 0:24 the dad
    [at('The poisoner was') - 1, (
      <Desk a={at('The poisoner was')} push={0.03}>
        <Cut name="dad" mask={MASKS.dad} size={IMG.dad.size as [number, number]} box={[560, 400, 800, 1000]} at={at('The poisoner was')} traceAt={at('the dad.')} bare />
        <Highlight text="THE DAD" x={80} y={250} size={110} at={at('the dad.')} seed={31} rot={-3} />
        {tagOf(IMG.dad)}
      </Desk>
    )],
    // 0:26 the policy
    [at("He'd just bought") - 1, (
      <Desk a={at("He'd just bought")}>
        <Policy x={90} y={330} w={900} at={at("He'd just bought")} />
        <Stamp text="$10,000 · JAN" x={150} y={520} at={at('life insurance')} size={86} color="#1d1a14" rot={-3} />
        <Stamp text="$20,000 · SEPT" x={150} y={620} at={at('life insurance') + 7} size={86} color="#1d1a14" rot={-2} />
        <Stamp text="$20,000 · OCT" x={150} y={720} at={at('his kids.')} size={86} color={CORAL} rot={-4} />
      </Desk>
    )],
    // 0:28 caught
    [at('He was caught.') - 1, (
      <Desk a={at('He was caught.')}>
        <Cut name="dad" mask={MASKS.dad} size={IMG.dad.size as [number, number]} box={[560, 400, 800, 1000]} at={at('He was caught.') - 30} traceAt={-99} bare />
        <Stamp text="CONVICTED · 1975" x={90} y={260} at={at('caught.')} size={92} color={CORAL} rot={-5} />
        {tagOf(IMG.dad)}
      </Desk>
    )],
    // 0:29 the fear wasn't: same door, same hand, now a capsule
    [at("The fear wasn't.") - 1, (
      <DoorShot ext={reachOf(f, at("The fear wasn't."))} held="capsule" light={0.35}>
      </DoorShot>
    )],
    // 0:31 1982: seven deaths, Chicago
    [at('In 1982,') - 1, (
      <Desk a={at('In 1982,')}>
        <DropCard src={IMG.fda.src} x={60} y={330} w={560} rot={-3} at={at('In 1982,')} filter={LOOK.doc} />
        <Stamp text="7" x={700} y={330} at={at('Seven people')} size={330} color={CORAL} rot={-4} />
        <Note text="dead" x={720} y={690} size={70} rot={-4} at={at('died.')} color="#ffffff" />
        <Note text="Chicago area, 1982" x={600} y={790} size={44} rot={-4} at={at('died.') + 4} />
        <Note text="poisoned Tylenol" x={650} y={860} size={46} rot={-4} at={at('poisoned Tylenol')} color="#ffffff" />
        {tagOf(IMG.fda)}
      </Desk>
    )],
    // 0:34 that Halloween: the AP story, swiped
    [at('That Halloween,') - 1, (
      <Desk a={at('That Halloween,')}>
        <DropCard src={IMG.ap.src} x={50} y={330} w={970} rot={1} at={at('That Halloween,')} filter={LOOK.doc}>
          <Swipe card={{w: 970, img: IMG.ap.size as [number, number]}} box={[8, 14, 1030, 146]} at={at('That Halloween,') + 6} dur={12} />
          <Swipe card={{w: 970, img: IMG.ap.size as [number, number]}} box={[26, 606, 340, 662]} at={at('banned')} dur={8} />
        </DropCard>
        {tagOf(IMG.ap)}
      </Desk>
    )],
    // 0:37 forty years later: the same hand, now a pill
    [at('Forty years later,') - 1, (
      <DoorShot ext={reachOf(f, at('Forty years later,'))} held="pill" light={0.35}>
        <Stamp text="1982" x={640} y={880} at={at('Forty years later,')} size={100} color={CREAM} rot={-4} />
        <Stamp text="2022" x={650} y={985} at={at('later,')} size={100} color={ORANGE} rot={-3} />
      </DoorShot>
    )],
    // 0:39 the DEA warning and its pills
    [at('pills that looked') - 1, (
      <Desk a={at('pills that looked')}>
        <DropCard src={IMG.dea.src} x={40} y={300} w={1000} rot={-1} at={at('pills that looked') - 1} filter={LOOK.bw}>
          <Swipe card={{w: 1000, img: IMG.dea.size as [number, number]}} box={[20, 694, 1190, 732]} at={at('looked like candy.')} dur={10} />
        </DropCard>
        <DropCard src={IMG.pills.src} x={170} y={780} w={740} rot={2} at={at('looked like') } filter={LOOK.bw} />
        {tagOf(IMG.dea)}
      </Desk>
    )],
    // 0:41 the X-ray: just candy
    [at('Clinics still') - 1, (
      <Desk a={at('Clinics still')}>
        <XRay cx={540} top={430} at={at('X-ray candy.') - 4} />
        <Note text="free candy X-rays, every year" x={80} y={260} size={52} rot={-3} at={at('Clinics still')} color="#ffffff" />
      </Desk>
    )],
    // 0:43 the counter that never moves
    [at('So how many') - 1, (
      <Desk a={at('So how many')}>
        <Highlight text="HOW MANY?" x={70} y={250} size={100} at={at('So how many')} seed={41} rot={-3} />
        <Note text="kids killed by a stranger's candy:" x={70} y={420} size={50} rot={-3} at={at("stranger's candy")} color="#ffffff" />
        <YearFlip a={at('A sociologist')} b={at('Not one child.') - 6} x={80} y={520} size={150} />
        <div style={{position: 'absolute', left: 620, top: 470, fontFamily: '"Abril Fatface", serif', fontSize: 300, lineHeight: 1, color: CREAM, opacity: f >= at("stranger's candy") ? 1 : 0,
          textShadow: '0 6px 22px rgba(0,0,0,0.85)'}}>0</div>
        <Chip text="hoax" x={90} y={760} at={at('Hoaxes.')} rot={-4} />
        <Chip text="hoax" x={330} y={820} at={at('Hoaxes.') + 4} rot={3} />
        <Chip text="hoax" x={170} y={900} at={at('Hoaxes.') + 8} rot={-2} />
        <Chip text="pin" x={520} y={780} at={at('A few pins.')} rot={5} />
        <Chip text="pin" x={430} y={960} at={at('A few pins.') + 5} rot={-6} />
        <Stamp text="0" x={620} y={470} at={at('Not one child.')} size={300} color={ORANGE} rot={-3} />
        <Ring cx={720} cy={620} rx={170} ry={190} at={at('child.')} dur={10} width={8} seed={6} />
      </Desk>
    )],
    // 0:51 there was never a hand at the door
    [at('There was never') - 1, (
      <DoorShot ext={interpolate(f, [at('never') + 4, at('never') + 14], [1, 0], clamp)} held="stix" light={0.35}
        open={interpolate(f, [at('at the door.') - 4, at('at the door.') + 14], [0, 1], {...clamp, easing: (x) => x * x * (3 - 2 * x)})} />
    )],
    // 0:54 just a dad, walking his kids from house to house
    [at('Just a dad,') - 1, <Street a={at('Just a dad,')} />],
  ];
  return <>{useScene(cuts)}</>;
};

export const CandyShort: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(NARR, FPS);
  const endAt = t.at('Thanks') - 10;
  const cut = Math.round(CUT * FPS);
  const drop = t.at('the dad.');
  const music0 = Math.max(0, Math.round(MUSIC.accent * FPS) - t.at(MUSIC.landOn));
  const cutsAt = ['That hand is', 'So whose hand', 'Four more Pixy', 'And the dark house?', 'The poisoner was', "He'd just bought", 'He was caught.', "The fear wasn't.", 'In 1982,', 'That Halloween,',
    'Forty years later,', 'pills that looked', 'Clinics still', 'So how many', 'There was never', 'Just a dad,'].map((p) => t.at(p) - 1);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          <Scenes t={t} />
          <EndCard t={t} start="Thanks" />
          {frame >= COVER.frames && <Captions n={NARR} until={endAt} />}
          <TopicStrip text="THE HALLOWEEN CANDY SCARE" until={endAt} />
          {frame < COVER.frames + COVER.fade && (
            <AbsoluteFill style={{opacity: interpolate(frame, [COVER.frames, COVER.frames + COVER.fade], [1, 0], clamp)}}>
              <Cover />
            </AbsoluteFill>
          )}
          <Mark />
          <Audio src={staticFile(WAV)} endAt={cut} />
          <Sequence from={cut + Math.round(BEAT * FPS)} layout="none">
            <Audio src={staticFile(WAV)} startFrom={cut} />
          </Sequence>
          {/* the bed drops out just before "the dad" and comes back after a held beat */}
          <Audio src={staticFile(MUSIC.src)} startFrom={music0}
            volume={(g) => MUSIC.vol * interpolate(g, [0, 10], [0, 1], clamp) * interpolate(g, [drop - 6, drop - 2, drop + 40, drop + 60], [1, 0, 0, 1], clamp)
              * interpolate(g, [endAt, endAt + 20], [1, 0.6], clamp)} />
          {cutsAt.map((g, i) => <Sfx key={i} at={g} src="sfx/whoosh.wav" volume={0.18} />)}
          <Sfx at={0} src="sfx/rope_creak.wav" volume={0.18} />
          <Sfx at={t.at('So whose hand') + 2} src="sfx/knock.wav" volume={0.25} />
          <Sfx at={t.at('The owner was')} src="sfx/marker_tick.wav" volume={0.3} />
          <Sfx at={t.at('life insurance')} src="sfx/stamp.wav" volume={0.22} />
          <Sfx at={t.at('life insurance') + 7} src="sfx/stamp.wav" volume={0.22} />
          <Sfx at={t.at('his kids.')} src="sfx/stamp.wav" volume={0.28} />
          <Sfx at={t.at('caught.')} src="sfx/stamp.wav" volume={0.3} />
          <Sfx at={t.at('Seven people')} src="sfx/stamp.wav" volume={0.3} />
          <Sfx at={t.at('X-ray candy.') - 4} src="sfx/tick_soft.wav" volume={0.3} />
          <Sfx at={t.at('Not one child.')} src="sfx/stamp.wav" volume={0.35} />
          <Sfx at={t.at('at the door.') - 4} src="sfx/rope_creak.wav" volume={0.22} />
          <Sfx at={t.at('tap like') + 2} src="sfx/marker_tick.wav" volume={0.3} />
          <Sfx at={t.at('and subscribe') + 4} src="sfx/marker_tick.wav" volume={0.3} />
          <Finish vignette={0.35} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};
