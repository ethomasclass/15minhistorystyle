// The Last Public Execution in America (1936): a standalone native vertical Short (1080x1920).
//
// Presentation (script/SHORT_STYLE.md): one marked-up crowd photo that opens and closes the Short (a loop),
// a case file on the desk for the middle beats, a persistent topic strip, a crowd counter and a jury stopwatch,
// and a like/subscribe end card whose arrows point at YouTube's own buttons.
//
// Phone safe zones: YouTube's UI covers the top ~150 px, the bottom ~400 px, and the right ~150 px from y 900 down.
// Scene text stays in x 60–930, y 150–1150; captions sit at y ~1185; source tags at y ~1490.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration, type Word} from './lib/timing';
import {Arrow, Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, usePal} from './kit/Kit';
import {DarkPaper, Sfx} from './kit/common';
import {Wordmark} from './kit/Intro';
import {hasFile, Stamp, type TL, useScene} from './kit/shell';
import {Arch, Desk, DropCard, LOOK, StandIn} from './kit/bs';
import {Parallax} from './kit/parallax';
import words from '../public/audio/short_last_public_hanging.words.json';
import {IMG, type Pic} from './images';

const FPS = 30;
const FRAME: [number, number] = [1080, 1920];
const WAV = 'audio/short_last_public_hanging.wav';
const BEAT = 0.9;      // extra silence before the like/subscribe line, seconds
const HOLD = 45;       // end card holds after the last word, frames
const TAG_Y = 1490;
const MUSIC = {src: 'music/w_aftermath.mp3', vol: 0.12};

/** The voiced file, with a beat of silence opened up before "Thanks for watching". */
const N = words as Narration;
const SPLIT = N.words.findIndex((w) => w.w === 'Thanks');
const CUT = (N.words[SPLIT - 1].e + N.words[SPLIT].s) / 2;
const NARR: Narration = {
  voice: N.voice,
  duration: N.duration + BEAT,
  words: N.words.map((w, i): Word => (i < SPLIT ? w : {...w, s: w.s + BEAT, e: w.e + BEAT})),
};
export const SHORT_FRAMES = Math.ceil((N.words[N.words.length - 1].e + BEAT) * FPS) + HOLD;

/** A picture if it has arrived; otherwise a labelled stand-in of the same footprint. */
const Card: React.FC<{p: Pic; x: number; y: number; w: number; rot?: number; at: number; out?: number; filter?: string}> = ({p, x, y, w, rot = 0, at, out, filter}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f >= out)) return null;
  if (!hasFile(p.src)) return <StandIn x={x} y={y} w={w} h={w * (p.size[1] / p.size[0])} rot={rot} label={p.src.split('/').pop()!} />;
  return <DropCard src={p.src} x={x} y={y} w={w} rot={rot} at={at} out={out} filter={filter ?? LOOK.bw} />;
};

/** Captions: three words at a time, the spoken word in orange; never across the end of a sentence. */
const Captions: React.FC<{n: Narration; until: number}> = ({n, until}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (f >= until) return null;
  const i = n.words.findIndex((w) => w.e >= t - 0.05);
  if (i < 0 || t < n.words[0].s - 0.1) return null;
  if (t < n.words[i].s - 0.6) return null; // a long pause: clear the line
  const chunks: number[] = [0];
  n.words.forEach((w, k) => {
    if (k === 0) return;
    if (k - chunks[chunks.length - 1] >= 3 || /[.?!:]["”]?$/.test(n.words[k - 1].w)) chunks.push(k);
  });
  const start = chunks.filter((c) => c <= i).pop() ?? 0;
  const end = chunks.find((c) => c > i) ?? n.words.length;
  return (
    <div style={{position: 'absolute', left: 50, width: 900, top: 1185, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px'}}>
      {n.words.slice(start, end).map((w, k) => (
        <span key={k} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 88, lineHeight: 1.2, textTransform: 'uppercase',
          color: start + k === i ? '#FF9F1C' : '#f4efe6', textShadow: '0 5px 0 #0d0c09, 0 0 18px rgba(0,0,0,0.95)'}}>{w.w.replace(/[{}*"“”]/g, '')}</span>
      ))}
    </div>
  );
};

/** Small wordmark, top-left (YouTube puts its own icons top-right). */
const Mark: React.FC = () => {
  const s = 0.2;
  return (
    <div style={{position: 'absolute', left: 40, top: 40, width: 1440 * s, height: 530 * s, overflow: 'hidden', borderRadius: 12, background: 'rgba(13,12,9,0.7)'}}>
      <div style={{position: 'absolute', left: -170 * s, top: -275 * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Wordmark clockAt={0} numAt={0} minAt={0} hisAt={0} />
      </div>
    </div>
  );
};

/** (3) The topic strip: a thin orange tape title that stays up all the way through. */
const TopicStrip: React.FC<{until: number; underlineAt: number}> = ({until, underlineAt}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f >= until) return null;
  const u = interpolate(f, [underlineAt, underlineAt + 8], [0, 1], clamp);
  return (
    <>
      <Highlight text="THE LAST PUBLIC EXECUTION · 1936" x={50} y={168} size={44} at={2} seed={61} rot={-1.5} />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1080} height={400}>
        <path d="M70,248 C300,240 600,252 905,236" fill="none" stroke={pal.mark} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
      </svg>
    </>
  );
};

/** (4) A number that climbs as it's spoken. */
const Counter: React.FC<{from: number; to: number; a: number; b: number; x: number; y: number; size?: number; prefix?: string; out?: number}> = ({from, to, a, b, x, y, size = 150, prefix = '', out = 1e7}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < a || f >= out) return null;
  // steps at 12 fps like the rest of the graphics
  const g = Math.floor(f / 2.5) * 2.5;
  const v = Math.round(interpolate(g, [a, b], [from, to], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)}) / 10) * 10;
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.display, fontSize: size, lineHeight: 1, color: pal.mark, whiteSpace: 'nowrap',
      textShadow: '0 6px 22px rgba(0,0,0,0.85), 0 0 4px #111'}}>{prefix}{v.toLocaleString('en-US')}</div>
  );
};

/** (4) A drawn stopwatch: the hand sweeps from 0:00 to `mins` while the jury is out. */
const Stopwatch: React.FC<{x: number; y: number; r: number; a: number; b: number; mins: number}> = ({x, y, r, a, b, mins}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < a) return null;
  const g = Math.floor(f / 2.5) * 2.5;
  const p = interpolate(g, [a, b], [0, 1], clamp);
  const m = p * mins;
  const ang = (m / 5) * Math.PI * 2 - Math.PI / 2; // a 5-minute dial
  const label = `${Math.floor(m)}:${String(Math.round((m % 1) * 60) % 60).padStart(2, '0')}`;
  const ticks = Array.from({length: 20}, (_, i) => i);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1080} height={1920}>
      <circle cx={x} cy={y} r={r} fill="rgba(13,12,9,0.55)" stroke={pal.mark} strokeWidth={7} />
      <rect x={x - 26} y={y - r - 44} width={52} height={34} rx={6} fill="none" stroke={pal.mark} strokeWidth={6} />
      {ticks.map((i) => {
        const t = (i / 20) * Math.PI * 2 - Math.PI / 2;
        const k = i % 4 === 0 ? 0.82 : 0.9;
        return <line key={i} x1={x + Math.cos(t) * r * k} y1={y + Math.sin(t) * r * k} x2={x + Math.cos(t) * r * 0.97} y2={y + Math.sin(t) * r * 0.97} stroke={pal.mark} strokeWidth={i % 4 === 0 ? 6 : 3} />;
      })}
      {/* the elapsed time as a coral wedge */}
      {p > 0 && <path d={`M${x},${y} L${x},${y - r * 0.75} A${r * 0.75},${r * 0.75} 0 ${m > 2.5 ? 1 : 0} 1 ${x + Math.cos(ang) * r * 0.75},${y + Math.sin(ang) * r * 0.75} Z`} fill={pal.subject} opacity={0.35} />}
      <line x1={x} y1={y} x2={x + Math.cos(ang) * r * 0.8} y2={y + Math.sin(ang) * r * 0.8} stroke="#f4efe6" strokeWidth={8} strokeLinecap="round" />
      <circle cx={x} cy={y} r={12} fill="#f4efe6" />
      <text x={x} y={y + r * 0.5} textAnchor="middle" fontFamily={JF.display} fontSize={r * 0.34} fill="#f4efe6">{label}</text>
    </svg>
  );
};

/** (2) The case file: a manila folder lying open on the desk; documents are dropped onto it. */
const Folder: React.FC<{at: number; label: string}> = ({at, label}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 6], [1.06, 1], clamp);
  const o = interpolate(f, [at, at + 4], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 40, top: 260, width: 1000, height: 1020, opacity: o, transform: `scale(${k}) rotate(-1deg)`}}>
      <div style={{position: 'absolute', left: 40, top: 0, width: 560, height: 70, background: '#b89a63', borderRadius: '14px 14px 0 0'}} />
      <div style={{position: 'absolute', left: 0, top: 56, width: 1000, height: 964, background: 'linear-gradient(160deg, #c7a974 0%, #a8894f 100%)', borderRadius: 10,
        boxShadow: '0 30px 60px rgba(0,0,0,0.7), inset 0 0 80px rgba(60,40,10,0.35)'}} />
      <div style={{position: 'absolute', left: 70, top: 14, fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: '#2b2113'}}>{label}</div>
    </div>
  );
};

/** (1)/(5) The crowd photo: the opening and closing frame are the same crop, so a replay loops cleanly. */
const Crowd: React.FC<{a: number; b: number; z: [number, number]; children?: React.ReactNode}> = ({a, b, z, children}) => {
  const p = IMG.crowd;
  if (!hasFile(p.src)) {
    return (
      <Desk a={a}>
        <StandIn x={60} y={260} w={960} h={860} label={`${p.src.split('/').pop()} (the 1936 crowd)`} />
        {children}
      </Desk>
    );
  }
  return (
    <Parallax name="crowd" src={p.src} size={p.size} crop={p.crop} frame={FRAME} a={a} b={b} fx={p.fx ?? 0.5} fy={p.fy ?? 0.5} cam={{z}} tint={null} tag={p.tag}>
      {() => <>{children}</>}
    </Parallax>
  );
};

// ---------------------------------------------------------------------------------------------

const Scenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const S = IMG.scaffold;
  const cuts: [number, React.ReactNode][] = [
    // 0:00 Sunrise · 20,000 · "usually called"
    [0, (
      <Crowd a={0} b={at('That June')} z={[1.12, 1.0]}>
        <Note text="Owensboro, Kentucky" x={70} y={330} size={62} rot={-3} at={at('Owensboro')} color="#ffffff" />
        <Note text="Aug. 14, 1936 · sunrise" x={80} y={420} size={56} rot={-3} at={at('August')} />
        <Counter from={0} to={20000} a={at('About 20,000') - 4} b={at('standing')} x={70} y={880} prefix="~" />
        <Note text="people" x={640} y={950} size={70} rot={-3} at={at('people')} color="#ffffff" />
        <Note text="usually" x={780} y={250} size={40} rot={-6} at={at('usually')} color={pal.subject} />
      </Crowd>
    )],
    // 0:10 The case: the folder opens
    [at('That June') - 1, (
      <Desk a={at('That June')}>
        <Folder at={at('That June') - 1} label="DAVIESS CO. · 1936" />
        <Card p={IMG.town} x={110} y={380} w={560} rot={-3} at={at('That June')} filter={LOOK.doc} />
        <Note text="June 1936" x={700} y={420} size={60} rot={-4} at={at('That June')} />
        <Note text="Lischia Edwards, 70" x={110} y={830} size={60} rot={-3} at={at('Lischia') - 3} color="#ffffff" />
        <Note text="killed in her home" x={130} y={915} size={52} rot={-3} at={at('attacked') - 3} color="#ffffff" />
        <Note text="Rainey Bethea" x={110} y={995} size={56} rot={-3} at={at('Rainey') - 2} color="#ffffff" />
        <Stamp text="CONFESSED" x={110} y={1065} at={at('confessed')} size={74} color={pal.subject} rot={-3} />
      </Desk>
    )],
    // 0:19 The law: two crimes, two punishments
    [at('Under Kentucky') - 1, (
      <Desk a={at('Under Kentucky')}>
        <Folder at={-99} label="KENTUCKY LAW · 1936" />
        <Card p={IMG.prison} x={100} y={360} w={880} rot={-2} at={at('Under Kentucky')} />
        <Note text="murder → electric chair" x={90} y={810} size={60} rot={-3} at={at('murder') - 2} color="#ffffff" />
        <Note text="(inside prison walls)" x={130} y={885} size={44} rot={-3} at={at('inside') - 2} color="#ffffff" />
        <Note text="sexual assault →" x={90} y={965} size={60} rot={-3} at={at('one crime') - 2} color={pal.subject} />
        <Note text="a PUBLIC hanging" x={150} y={1045} size={66} rot={-3} at={at('public') - 2} color={pal.subject} />
        <Stamp text="CHARGED: THAT ONE" x={130} y={560} at={at('So prosecutors')} size={76} color="#FF9F1C" rot={-6} />
      </Desk>
    )],
    // 0:30 Guilty plea · the jury stopwatch
    [at('He pleaded') - 1, (
      <Desk a={at('He pleaded')}>
        <Folder at={-99} label="THE TRIAL · JUNE 25, 1936" />
        <Stamp text="PLEADED GUILTY" x={90} y={400} at={at('pleaded')} size={92} color="#f4efe6" rot={-3} />
        <Note text="the jury: all white" x={110} y={560} size={58} rot={-3} at={at('An all-white') - 2} color="#ffffff" />
        <Stopwatch x={540} y={860} r={210} a={at('took about')} b={at('minutes.') + 6} mins={4.5} />
      </Desk>
    )],
    // 0:35 The headline: Sheriff Florence Thompson
    [at('Then reporters') - 1, (
      hasFile(IMG.thompson.src) ? (
        <Arch src={IMG.thompson.src} tag={IMG.thompson.tag} a={at('Then reporters')} b={at("She didn't.")} z={[1.04, 1.14]} pos={IMG.thompson.pos ?? '50% 30%'} tagY={TAG_Y}>
          <Note text="the headline:" x={70} y={300} size={58} rot={-3} at={at('headline') - 2} color="#ffffff" />
          <Highlight text="A WOMAN SHERIFF" x={60} y={380} size={96} at={at('a woman')} seed={71} rot={-3} />
          <Note text="Sheriff Florence Thompson" x={70} y={900} size={56} rot={-3} at={at('Florence') - 2} color="#ffffff" />
          <Note text="would she pull the lever?" x={70} y={1010} size={62} rot={-3} at={at('Would she') - 2} color={pal.subject} />
        </Arch>
      ) : (
        <Desk a={at('Then reporters')}>
          <Card p={IMG.thompson} x={260} y={330} w={560} at={at('Then reporters')} />
          <Note text="would she pull the lever?" x={70} y={1010} size={62} rot={-3} at={at('Would she') - 2} color={pal.subject} />
        </Desk>
      )
    )],
    // 0:44 "She didn't. A volunteer did." Back to the crowd; the scaffold circled.
    [at("She didn't.") - 1, (
      <Crowd a={at("She didn't.")} b={at('Papers across')} z={[1.0, 1.06]}>
        <Loop cx={S.x} cy={S.y} rx={S.rx} ry={S.ry} at={at("She didn't.") + 4} dur={14} width={7} seed={5} />
        <Note text="she didn't." x={70} y={300} size={70} rot={-3} at={at("She didn't.")} color="#ffffff" />
        <Note text="a volunteer did." x={90} y={1010} size={66} rot={-3} at={at('A volunteer') - 2} color={pal.mark} />
      </Crowd>
    )],
    // 0:47 The coverage: "a carnival" vs "exaggerated"
    [at('Papers across') - 1, (
      <Desk a={at('Papers across')}>
        <Card p={IMG.paper} x={70} y={290} w={600} rot={-3} at={at('Papers across')} filter={LOOK.doc} />
        <Note text={'papers: "a carnival"'} x={80} y={920} size={62} rot={-3} at={at('a carnival') - 3} color="#ffffff" />
        <Note text="people there: exaggerated" x={80} y={1020} size={58} rot={-3} at={at('exaggerated') - 6} color={pal.mark} />
      </Desk>
    )],
    // 0:54 1938
    [at('Either way') - 1, (
      <Desk a={at('Either way')}>
        <Folder at={-99} label="ACTS OF KENTUCKY · 1938" />
        <Card p={IMG.statute} x={150} y={360} w={780} rot={-2} at={at('Either way')} filter={LOOK.doc} />
        <Note text="Kentucky, embarrassed" x={90} y={300} size={56} rot={-3} at={at('embarrassed') - 3} color="#ffffff" />
        <Stamp text="1938 · ENDED" x={110} y={980} at={at('1938,')} size={130} color={pal.subject} rot={-4} />
      </Desk>
    )],
    // 0:58 the same crowd, the same crop as the first frame: the loop
    [at('Twenty thousand') - 1, (
      <Crowd a={at('Twenty thousand')} b={at('Thanks') - 8} z={[1.0, 1.12]}>
        <Note text="20,000 came to watch." x={70} y={300} size={64} rot={-3} at={at('Twenty thousand')} color="#ffffff" />
        <Note text="the end of watching." x={90} y={1010} size={70} rot={-3} at={at('end of watching') - 2} color={pal.subject} />
      </Crowd>
    )],
  ];
  return <>{useScene(cuts)}</>;
};

/** End card: points at YouTube's own like button (right rail) and Subscribe button (by the channel name). */
const EndCard: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const a = t.at('Thanks') - 10;
  if (f < a) return null;
  const like = t.at('tap like');
  const sub = t.at('and subscribe');
  const there = t.at('right there');
  const wig = (k: number) => (f >= there && f < there + 12 ? Math.sin(Math.floor((f - there) / 2.5) * 2) * k : 0);
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [a, a + 8], [0, 1], clamp)}}>
      <DarkPaper />
      <div style={{position: 'absolute', left: 90, top: 330, width: 1920, height: 1080, transform: 'scale(0.47)', transformOrigin: '0 0'}}>
        <Wordmark clockAt={a} numAt={a + 4} minAt={a + 8} hisAt={a + 12} />
      </div>
      <Note text="thanks for watching." x={110} y={300} size={64} rot={-3} at={t.at('Thanks')} color="#ffffff" />
      <Note text="tap like" x={470} y={760} size={78} rot={-4} at={like - 2} color={pal.subject} />
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${wig(6)}px, ${wig(-4)}px)`}}>
        <Arrow x1={640} y1={850} x2={905} y2={950} bow={-50} width={8} at={like + 2} dur={8} />
      </div>
      <Note text="subscribe" x={160} y={1080} size={78} rot={-4} at={sub - 2} color={pal.subject} />
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${wig(-4)}px, ${wig(6)}px)`}}>
        <Arrow x1={380} y1={1180} x2={540} y2={1420} bow={40} width={8} at={sub + 4} dur={8} />
      </div>
    </AbsoluteFill>
  );
};

export const LastPublicShort: React.FC = () => {
  const t = makeTimeline(NARR, FPS);
  const endAt = t.at('Thanks') - 10;
  const cut = Math.round(CUT * FPS);
  const cutsAt = ['That June', 'Under Kentucky', 'He pleaded', 'Then reporters', "She didn't.", 'Papers across', 'Either way', 'Twenty thousand'].map((p) => t.at(p) - 1);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          <Scenes t={t} />
          <EndCard t={t} />
          {/* a dark band behind the captions so they read over any picture */}
          {useCurrentFrame() < endAt && <div style={{position: 'absolute', left: 0, top: 1130, width: 1080, height: 360, background: 'linear-gradient(180deg, rgba(8,7,5,0) 0%, rgba(8,7,5,0.75) 30%, rgba(8,7,5,0.75) 75%, rgba(8,7,5,0) 100%)'}} />}
          <Captions n={NARR} until={endAt} />
          <TopicStrip until={endAt} underlineAt={t.at('usually')} />
          <Mark />
          {/* narration: the story, then (after a beat) the like/subscribe line */}
          <Audio src={staticFile(WAV)} endAt={cut} />
          <Sequence from={cut + Math.round(BEAT * FPS)} layout="none">
            <Audio src={staticFile(WAV)} startFrom={cut} />
          </Sequence>
          <Audio src={staticFile(MUSIC.src)}
            volume={(f) => interpolate(f, [0, 12, endAt - 10, endAt + 20], [0, MUSIC.vol, MUSIC.vol, 0.05], clamp)} />
          {cutsAt.map((f, i) => <Sfx key={i} at={f} src="sfx/page_turn.wav" volume={0.18} />)}
          <Sfx at={t.at('confessed')} src="sfx/stamp.wav" volume={0.25} />
          <Sfx at={t.at('pleaded')} src="sfx/stamp.wav" volume={0.25} />
          <Sfx at={t.at('1938,')} src="sfx/stamp.wav" volume={0.3} />
          <Sfx at={t.at('took about')} src="sfx/tick.wav" volume={0.2} />
          <Sfx at={t.at('tap like') + 2} src="sfx/marker_tick.wav" volume={0.3} />
          <Sfx at={t.at('and subscribe') + 4} src="sfx/marker_tick.wav" volume={0.3} />
          <Finish vignette={0.35} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};

