// Native vertical YouTube Shorts (1080x1920), built only from this video's assets: the narration is spliced from the
// chapter WAVs (hook line first), the scenes are re-laid out for 9:16 with the same masked photos, parallax layers,
// ledger and phone sketch. Captions word by word; an end card points to the full video.
//
// Phone safe zones: the top ~150 px and the bottom ~400 px carry YouTube's own UI, and the right ~150 px from
// y 900 down holds the like/comment buttons. Scene text stays in x 60–930, y 150–1150; captions sit at y ~1190.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './lib/anim';
import {makeTimeline, type Narration, type Word} from './lib/timing';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, usePal} from './kit/Kit';
import {DarkPaper, Sfx} from './kit/common';
import {Wordmark} from './kit/Intro';
import {Stamp, type TL, useScene} from './kit/shell';
import {Arch, Desk, DropCard, Ledger, LOOK, PhoneSketch, ROWS, SyncQuote} from './kit/bs';
import {Parallax} from './kit/parallax';
import {MASKS} from './masks';
import w01 from '../public/audio/ch01_cold_open.words.json';
import w02 from '../public/audio/ch02_everybody_bet.words.json';
import w05 from '../public/audio/ch05_prince_hal.words.json';
import w06 from '../public/audio/ch06_the_fix.words.json';

const FPS = 30;
const FRAME: [number, number] = [1080, 1920];
const GAP = 0.3;      // seconds of air between spliced lines
const OUTRO = 90;     // end card, frames
const TAG_Y = 1490;
const CH: Record<string, {n: Narration; wav: string}> = {
  ch01: {n: w01 as Narration, wav: 'audio/ch01_cold_open.wav'},
  ch02: {n: w02 as Narration, wav: 'audio/ch02_everybody_bet.wav'},
  ch05: {n: w05 as Narration, wav: 'audio/ch05_prince_hal.wav'},
  ch06: {n: w06 as Narration, wav: 'audio/ch06_the_fix.wav'},
};

/** A spoken line taken from a chapter: from the phrase `first` to the end of the phrase `last`. */
type Seg = {ch: string; first: string; last: string; firstNth?: number; lastNth?: number};
type Built = {segs: {wav: string; from: number; to: number; at: number}[]; n: Narration};

/** Splice the lines back to back; the result is a narration whose word times are local to the Short. */
const build = (segs: Seg[]): Built => {
  let t = 0.25;
  const out: Built['segs'] = [];
  const words: Word[] = [];
  for (const s of segs) {
    const {n, wav} = CH[s.ch];
    const tl = makeTimeline(n, FPS);
    const i0 = tl.idx(s.first, s.firstNth ?? 1);
    const i1 = tl.idx(s.last, s.lastNth ?? 1) + s.last.split(/\s+/).length - 1;
    const from = n.words[i0].s - 0.12, to = n.words[i1].e + 0.2;
    out.push({wav, from, to, at: t});
    for (let i = i0; i <= i1; i++) words.push({...n.words[i], s: n.words[i].s - from + t, e: n.words[i].e - from + t});
    t += to - from + GAP;
  }
  return {segs: out, n: {voice: 'spliced', duration: t, words}};
};

/** Captions: three words at a time, the spoken word in orange. */
const Captions: React.FC<{n: Narration}> = ({n}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const i = n.words.findIndex((w) => w.e >= t - 0.05);
  if (i < 0 || t < n.words[0].s - 0.1) return null;
  // chunks of up to 3 words that never run across the end of a sentence
  const chunks: number[] = [0];
  n.words.forEach((w, k) => {
    if (k === 0) return;
    const prev = n.words[k - 1].w;
    if (k - chunks[chunks.length - 1] >= 3 || /[.?!:]["”]?$/.test(prev)) chunks.push(k);
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

/** End card: the full video's title and where to find it. */
const Outro: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < at) return null;
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [at, at + 8], [0, 1], clamp)}}>
      <DarkPaper />
      <Note text="the full story:" x={100} y={520} size={84} rot={-3} at={at} color="#ffffff" />
      <Highlight text="SAY IT" x={80} y={660} size={170} at={at + 4} seed={91} rot={-3} />
      <Highlight text="AIN'T SO" x={120} y={890} size={170} at={at + 8} seed={92} rot={-2} />
      <div style={{position: 'absolute', left: 110, top: 1130, width: 860, fontFamily: JF.display, fontSize: 54, lineHeight: 1.2, color: pal.mark}}>Baseball's Gambling Problem Before the Black Sox</div>
      <Note text="on the channel" x={120} y={1300} size={84} rot={-3} at={at + 14} color={pal.subject} />
    </AbsoluteFill>
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

type ShortDef = {id: string; segs: Seg[]; music: string; musicFrom?: number; musicVol?: number; Scenes: React.FC<{t: TL}>; whoosh: (t: TL) => number[]};

const Shell: React.FC<{d: ShortDef; b: Built}> = ({d, b}) => {
  const t = makeTimeline(b.n, FPS);
  const len = Math.ceil(b.n.duration * FPS);
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <StepCtx.Provider value={2.5}>
        <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
          <d.Scenes t={t} />
          {/* a dark band behind the captions so they read over any picture */}
          <div style={{position: 'absolute', left: 0, top: 1130, width: 1080, height: 360, background: 'linear-gradient(180deg, rgba(8,7,5,0) 0%, rgba(8,7,5,0.75) 30%, rgba(8,7,5,0.75) 75%, rgba(8,7,5,0) 100%)'}} />
          <Captions n={b.n} />
          <Mark />
          {b.segs.map((s, i) => (
            <Sequence key={i} from={Math.round(s.at * FPS)} layout="none">
              <Audio src={staticFile(s.wav)} startFrom={Math.round(s.from * FPS)} endAt={Math.round(s.to * FPS)} />
            </Sequence>
          ))}
          <Audio src={staticFile(d.music)} startFrom={Math.round((d.musicFrom ?? 0) * FPS)}
            volume={(f) => interpolate(f, [0, 12, len + OUTRO - 25, len + OUTRO], [0, d.musicVol ?? 0.15, d.musicVol ?? 0.15, 0], clamp)} />
          {d.whoosh(t).map((f, i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
          <Sfx at={len} src="sfx/stamp.wav" volume={0.3} />
          <Outro at={len} />
          <Finish vignette={0.35} />
        </AbsoluteFill>
      </StepCtx.Provider>
    </PaletteCtx.Provider>
  );
};

// ---------------------------------------------------------------------------------------------
// 1 · THE SIGNAL (the 1919 fix)

const SignalScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const cuts: [number, React.ReactNode][] = [
    [0, (
      <Parallax name="cicotte" src="img/ch06/eddie_cicotte_1917.jpg" size={[2989, 2257]} crop={[1080, 170, 2180, 2120]} frame={FRAME} a={0} b={at('The 1919')} fx={0.5} fy={0.42}
        cam={{z: [1.05, 1.16]}} mask={MASKS.cicotte} traceAt={4} tag="Eddie Cicotte, 1917 · Library of Congress">
        {() => (<>
          <Note text="1919 World Series, Game 1" x={70} y={200} size={60} rot={-3} at={0} color="#ffffff" />
          <Note text="2nd pitch: in the back" x={80} y={830} size={64} rot={-3} at={at('second pitch') - 3} />
          <Highlight text="THE SIGNAL" x={60} y={930} size={130} at={at('signal')} seed={11} rot={-3} />
        </>)}
      </Parallax>
    )],
    [at('The 1919') - 1, (
      <Arch src="img/ch06/white_sox_team_bain_1919.jpg" tag="Chicago White Sox, 1919 · Library of Congress" a={at('The 1919')} b={at('First baseman')} z={[1.05, 1.15]} pos="50% 60%" tagY={TAG_Y}>
        <Highlight text="THE 1919" x={70} y={220} size={130} at={at('The 1919')} seed={13} rot={-3} />
        <Highlight text="WHITE SOX" x={110} y={400} size={130} at={at('Chicago') + 2} seed={14} rot={-2} />
        <Note text="maybe the best team in baseball" x={80} y={1010} size={56} rot={-3} at={at('best team') - 3} color="#ffffff" />
      </Arch>
    )],
    [at('First baseman') - 1, (
      <Parallax name="gandil" src="img/ch06/chick_gandil_harris_ewing_c1913.jpg" size={[3840, 2621]} crop={[1400, 100, 2784, 2560]} frame={FRAME} a={at('First baseman')} b={at('Eight')} fx={0.55} fy={0.45}
        cam={{z: [1.04, 1.12]}} mask={MASKS.gandil} traceAt={at('Chick Gandil') + 3} tag="Chick Gandil, c. 1913 · Library of Congress">
        {() => (<>
          <Note text="first baseman Chick Gandil" x={70} y={200} size={60} rot={-3} at={at('Chick Gandil') - 3} color="#ffffff" />
          <Note text="goes to the gamblers" x={90} y={300} size={60} rot={-3} at={at('goes to') - 3} />
          <Note text="the plan: lose the Series" x={80} y={880} size={58} rot={-3} at={at('The plan') - 3} color="#ffffff" />
          <Stamp text="$100,000" x={70} y={960} at={at('100,000')} size={150} color={pal.subject} />
        </>)}
      </Parallax>
    )],
    [at('Eight') - 1, (
      <Desk a={at('Eight')}>
        {([['joe_jackson_1919', 'Jackson'], ['eddie_cicotte_1917', 'Cicotte'], ['chick_gandil_white_sox_1917', 'Gandil'], ['lefty_williams_1917_b', 'Williams'],
          ['swede_risberg_1917', 'Risberg'], ['happy_felsch_1920', 'Felsch'], ['fred_mcmullin_1917', 'McMullin'], ['buck_weaver_1920', 'Weaver']] as const).map(([f, name], i) => (
          <React.Fragment key={f}>
            <DropCard src={`img/ch06/${f}.jpg`} x={90 + (i % 4) * 230} y={240 + Math.floor(i / 4) * 400} w={190} rot={((i * 7) % 5) - 2} at={at('Eight') - 1 + i * 2} />
            <Note text={name} x={95 + (i % 4) * 230} y={545 + Math.floor(i / 4) * 400} size={34} rot={-3} at={at('Eight') + 3 + i * 2} color="#ffffff" />
          </React.Fragment>
        ))}
        <Highlight text="8 PLAYERS" x={80} y={1020} size={110} at={at('Eight') + 2} seed={15} rot={-3} />
      </Desk>
    )],
    [at('The Reds win') - 1, (
      <Desk a={at('The Reds win')}>
        <DropCard src="img/ch06/pathe_ws1919_199s_title_fourth_inning_cicotte.jpg" x={70} y={260} w={930} rot={-2} at={at('The Reds win') - 1} />
        <Stamp text="REDS, 5–3" x={80} y={960} at={at('5 games')} size={140} color={pal.subject} />
      </Desk>
    )],
    [at('And Joe') - 1, (
      <Parallax name="jackson_bat" src="img/ch06/joe_jackson_white_sox_1920.jpg" size={[2032, 3000]} crop={[300, 700, 1250, 2390]} frame={FRAME} a={at('And Joe')} b={at('years.') + 20} fx={0.5} fy={0.42}
        cam={{z: [1.03, 1.14]}} mask={MASKS.jackson_bat} traceAt={at('Jackson?') + 3} tag="Joe Jackson, Chicago AL · Library of Congress">
        {() => (<>
          <Note text="Shoeless Joe Jackson" x={70} y={200} size={64} rot={-3} at={at('Jackson?') - 3} color="#ffffff" />
          <Stamp text=".375" x={560} y={330} at={at('.375')} size={180} />
          <Note text="no errors" x={600} y={560} size={64} rot={-3} at={at('no errors') - 3} />
          <Note text="argued about for 100 years" x={70} y={1000} size={60} rot={-3} at={at('argued') - 3} color="#FF9F1C" />
        </>)}
      </Parallax>
    )],
  ];
  return <>{useScene(cuts)}</>;
};

// ---------------------------------------------------------------------------------------------
// 2 · ACCUSED TWICE (Hal Chase)

const ChaseScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const cuts: [number, React.ReactNode][] = [
    [0, (
      <Parallax name="chase" src="img/ch05/hal_chase_1917.jpg" size={[1920, 2233]} crop={[337, 0, 1607, 2233]} frame={FRAME} a={0} b={at('And then')} fx={0.5} fy={0.45}
        cam={{z: [1.12, 1.03]}} mask={MASKS.chase} traceAt={3} tag="Hal Chase, 1917 · Charles Conlon · Wikimedia Commons">
        {() => (<>
          <Note text="accused by your own manager." x={60} y={830} size={56} rot={-3} at={at('accused') - 3} color="#ffffff" />
          <Stamp text="TWICE." x={70} y={920} at={at('Twice')} size={150} color="#f4efe6" />
        </>)}
      </Parallax>
    )],
    [at('And then') - 1, (
      <Arch src="img/ch05/hal_chase_highlanders_1910.jpg" tag="Hal Chase, New York Highlanders, c. 1910" a={at('And then')} b={at('1910.')} z={[1.04, 1.14]} pos="50% 35%" tagY={TAG_Y}>
        <Highlight text="HAL CHASE" x={60} y={200} size={140} at={at('Hal Chase')} seed={21} rot={-3} />
        <Note text={'fans: "Prince Hal"'} x={80} y={420} size={70} rot={-4} at={at('Prince Hal') - 3} />
        <Note text="losing games on purpose?" x={70} y={900} size={62} rot={-3} at={at('losing games') - 3} color="#FF9F1C" />
        <Note text="say several of his own managers" x={80} y={1010} size={48} rot={-3} at={at('according') - 3} color="#ffffff" />
      </Arch>
    )],
    [at('1910.') - 1, (
      <Desk a={at('1910.')}>
        <Highlight text="1910" x={70} y={190} size={150} at={at('1910.')} seed={23} rot={-3} />
        <Note text="manager: he's throwing games" x={80} y={420} size={56} rot={-3} at={at('accuses') - 3} color="#ffffff" />
        <Note text="owner: sides with Chase" x={80} y={510} size={56} rot={-3} at={at('owner') - 3} color="#ffffff" />
        <Note text="manager: leaves" x={80} y={600} size={56} rot={-3} at={at('leaves') - 3} color="#ffffff" />
        <DropCard src="img/ch05/hal_chase_manager_highlanders_with_wallace_1911.jpg" x={90} y={700} w={880} rot={2} at={at('Chase gets') - 1} />
        <Note text="new manager: Hal Chase" x={90} y={1050} size={64} rot={-3} at={at('Chase gets') - 2} color={pal.subject} />
      </Desk>
    )],
    [at('1918.') - 1, (
      <Parallax name="mathewson" src="img/ch05/christy_mathewson_reds_bain_1916.jpg" size={[1920, 2813]} crop={[60, 700, 1600, 2760]} frame={FRAME} a={at('1918.')} b={at('The president')} fx={0.515} fy={0.32}
        cam={{z: [1.03, 1.12]}} mask={MASKS.mathewson} traceAt={at('Christy') + 3} tag="Christy Mathewson, Cincinnati, 1916 · Library of Congress">
        {() => (<>
          <Highlight text="1918" x={60} y={190} size={150} at={at('1918.')} seed={25} rot={-3} />
          <Note text="manager Christy Mathewson" x={70} y={920} size={54} rot={-3} at={at('Christy') - 3} color="#ffffff" />
          <Note text="suspends Chase: bribes" x={70} y={1020} size={62} rot={-3} at={at('suspends') - 3} color="#FF9F1C" />
        </>)}
      </Parallax>
    )],
    [at('The president') - 1, (
      <Desk a={at('The president')}>
        <DropCard src="img/ch05/john_heydler_1918.jpg" x={90} y={210} w={420} rot={-3} at={at('The president') - 1} />
        <Note text="N.L. president" x={90} y={760} size={50} rot={-3} at={at('The president') + 2} color="#ffffff" />
        <Note text="not enough evidence" x={560} y={330} size={52} rot={-3} at={at('enough evidence') - 3} color="#ffffff" />
        <Stamp text="CLEARED." x={70} y={880} at={at('cleared')} size={160} color={pal.subject} />
        <DropCard src="img/ch05/john_mcgraw_1918.jpg" x={560} y={430} w={380} rot={3} at={at('A few weeks') - 1} />
        <Note text="the Giants sign him" x={520} y={780} size={52} rot={-3} at={at('Giants sign') - 3} />
      </Desk>
    )],
  ];
  return <>{useScene(cuts)}</>;
};

// ---------------------------------------------------------------------------------------------
// 3 · THE FIRST FIXED GAME (Hoboken, 1865)

const FixedScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const cuts: [number, React.ReactNode][] = [
    [0, (
      <Parallax name="catcher_ci" src="img/ch02/currier_ives_american_national_game_1866.jpg" size={[3840, 2773]} crop={[940, 1600, 1446, 2500]} frame={FRAME} a={0} b={at('Bad day')} fx={0.5} fy={0.5}
        cam={{z: [1.02, 1.1]}} mask={MASKS.catcher_ci} traceAt={at('catcher,') + 3} tag="Currier & Ives, Hoboken, 1866 (detail) · Library of Congress" filter="grayscale(1) contrast(1.15) brightness(0.9)">
        {() => (<>
          <Note text="Hoboken, 1865. the catcher:" x={60} y={330} size={56} rot={-3} at={0} color="#ffffff" />
          <Highlight text="WILLIAM WANSLEY" x={60} y={420} size={96} at={at('William')} seed={31} rot={-3} />
          <Stamp text="6 PASSED BALLS" x={60} y={1030} at={at('Six')} size={100} color="#FF9F1C" />
          <Stamp text="23–11" x={620} y={170} at={at('23')} size={120} />
        </>)}
      </Parallax>
    )],
    [at('Bad day') - 1, (
      <Desk a={at('Bad day')}>
        <Note text="bad day?" x={80} y={200} size={90} rot={-3} at={at('Bad day') - 2} color="#ffffff" />
        <Note text="not exactly." x={140} y={330} size={90} rot={-3} at={at('Not exactly') - 2} color={pal.subject} />
        <DropCard src="img/ch02/low_class_gambling_den_engraving_1882.jpg" x={480} y={470} w={480} rot={3} at={at('A gambler') - 1} />
        <Stamp text="$100" x={70} y={560} at={at('100')} size={170} />
        <Note text="reportedly" x={90} y={760} size={52} rot={-4} at={at('reportedly') - 2} color="#FF9F1C" />
        <Note text="+ 2 teammates, a cut each" x={80} y={1030} size={58} rot={-3} at={at('two teammates') - 3} />
      </Desk>
    )],
    [at("It's the first") - 1, (
      <Arch src="img/ch02/currier_ives_american_national_game_1866.jpg" tag="Currier & Ives, Hoboken, 1866 · Library of Congress" a={at("It's the first")} b={at('All three')} z={[1.05, 1.12]} pos="35% 62%" look="dim" tagY={TAG_Y}>
        <Highlight text="THE FIRST" x={60} y={330} size={150} at={at('first fixed')} seed={33} rot={-3} />
        <Highlight text="FIXED GAME" x={100} y={530} size={150} at={at('fixed game')} seed={34} rot={-2} />
        <Note text="that we can document" x={100} y={760} size={64} rot={-3} at={at('document') - 6} />
      </Arch>
    )],
    [at('All three') - 1, (
      <Desk a={at('All three')}>
        <Ledger x={50} y={330} w={980} at={at('All three') - 1} size={34} entries={[ROWS.y1865(at('All three'), at('all three were'), at('back.') - 2)]} />
        <Note text="banned..." x={90} y={700} size={80} rot={-3} at={at('banned') - 3} color="#ffffff" />
        <Note text="and back in five years." x={110} y={830} size={70} rot={-3} at={at('Within') - 3} color={pal.subject} />
      </Desk>
    )],
  ];
  return <>{useScene(cuts)}</>;
};

// ---------------------------------------------------------------------------------------------
// 4 · BANNED → PARTNER (1921 vs. 2026)

const PartnerScenes: React.FC<{t: TL}> = ({t}) => {
  const at = t.at;
  const pal = usePal();
  const cuts: [number, React.ReactNode][] = [
    [0, (
      <Desk a={0}>
        <DropCard src="img/ch01/eight_men_banned_1920.png" x={90} y={220} w={430} rot={-3} at={0} filter={LOOK.doc} />
        <PhoneSketch x={620} y={200} w={330} at={4} rot={3} buttons={false} />
        <Note text="1921: bans players" x={80} y={880} size={60} rot={-3} at={at('bans') - 3} />
        <Note text="2026: names a partner" x={80} y={990} size={60} rot={-3} at={at('The other') - 3} color={pal.subject} />
      </Desk>
    )],
    [at('"Regardless') - 1, (
      <Arch src="img/ch01/landis_commissioner_bain_1920s.jpg" tag="Judge Landis, c. 1921 · Library of Congress" a={at('"Regardless')} b={at('Eight')} z={[1.04, 1.12]} pos="50% 45%" look="dim" tagY={TAG_Y}>
        <Note text="Judge Landis, Aug. 3, 1921:" x={70} y={190} size={56} rot={-3} at={at('"Regardless') - 4} color="#ffffff" />
        <SyncQuote t={t} phrase="Regardless of the verdict of juries," x={70} y={280} w={940} size={66} close={false} marks={{3: pal.subject}} />
        <SyncQuote t={t} phrase="no player that throws a ball game... will ever play professional baseball." x={70} y={480} w={940} size={66} open={false} marks={{3: pal.subject}} />
      </Arch>
    )],
    [at('Eight') - 1, (
      <Desk a={at('Eight')}>
        <DropCard src="img/ch01/black_sox_at_trial_1921.jpg" x={60} y={250} w={960} rot={-2} at={at('Eight') - 1} />
        <Stamp text="FOR LIFE." x={70} y={830} at={at('For life')} size={150} color={pal.subject} />
        <Note text="a day after: NOT GUILTY" x={80} y={1030} size={58} rot={-3} at={at('not guilty') - 3} color="#FF9F1C" />
      </Desk>
    )],
    [at('Now jump') - 1, (
      <Desk a={at('Now jump')}>
        <Stamp text="+105 YEARS" x={70} y={190} at={at('105')} size={120} />
        <PhoneSketch x={340} y={330} w={340} at={at('Another') - 1} rot={3} />
        <Highlight text="POLYMARKET" x={60} y={1030} size={100} at={at('Polymarket')} seed={41} rot={-3} />
      </Desk>
    )],
    [at("So here's") - 1, (
      <Desk a={at("So here's")}>
        <Note text="so how did betting go" x={70} y={260} size={74} rot={-3} at={at('How did') - 3} color="#ffffff" />
        <Note text="from part of the game," x={90} y={400} size={74} rot={-3} at={at('part of') - 3} />
        <Note text="to the unforgivable sin," x={90} y={540} size={74} rot={-3} at={at('unforgivable') - 6} color={pal.subject} />
        <Note text="and back again?" x={90} y={680} size={86} rot={-3} at={at('back again') - 3} />
      </Desk>
    )],
  ];
  return <>{useScene(cuts)}</>;
};

// ---------------------------------------------------------------------------------------------

const DEFS: ShortDef[] = [
  {id: 'VShort1', music: 'music/g_grip.mp3', musicFrom: 20, musicVol: 0.16, Scenes: SignalScenes,
    segs: [{ch: 'ch06', first: "Cicotte's second", last: 'is on.'}, {ch: 'ch06', first: 'The 1919 Chicago', last: 'in baseball.'},
      {ch: 'ch06', first: 'First baseman', last: 'about it.', lastNth: 1}, {ch: 'ch06', first: 'The Reds win', last: '5 games to 3.'},
      {ch: 'ch06', first: 'And Joe Jackson?', last: 'hundred years.'}],
    whoosh: (t) => [t.at('The 1919'), t.at('First baseman'), t.at('Eight'), t.at('The Reds win'), t.at('And Joe')].map((f) => f - 1)},
  {id: 'VShort2', music: 'music/a_price.mp3', musicVol: 0.22, Scenes: ChaseScenes,
    segs: [{ch: 'ch05', first: 'You can be accused', last: 'a job.'}, {ch: 'ch05', first: 'And then', last: 'on purpose.'},
      {ch: 'ch05', first: '1910.', last: 'his job.'}, {ch: 'ch05', first: '1918.', last: 'and opponents.'}, {ch: 'ch05', first: 'The president rules', last: 'sign him.'}],
    whoosh: (t) => [t.at('And then'), t.at('1910.'), t.at('1918.'), t.at('The president')].map((f) => f - 1)},
  {id: 'VShort3', music: 'music/r_temperance.mp3', musicFrom: 10, musicVol: 0.13, Scenes: FixedScenes,
    segs: [{ch: 'ch02', first: "The Mutuals' catcher", last: 'to 11.'}, {ch: 'ch02', first: 'Bad day?', last: 'a cut.'},
      {ch: 'ch02', first: "It's the first", last: 'can document.'}, {ch: 'ch02', first: 'All three players', last: 'were back.'}],
    whoosh: (t) => [t.at('Bad day'), t.at("It's the first"), t.at('All three')].map((f) => f - 1)},
  {id: 'VShort4', music: 'music/r_cold_open.mp3', musicVol: 0.15, Scenes: PartnerScenes,
    segs: [{ch: 'ch01', first: 'Same sport.', last: 'official partner.', lastNth: 2}, {ch: 'ch01', first: '"Regardless', last: 'professional baseball."'},
      {ch: 'ch01', first: 'Eight Chicago', last: 'not guilty.'}, {ch: 'ch01', first: 'Now jump', last: 'baseball games.'}, {ch: 'ch01', first: "So here's the question", last: 'back again?'}],
    whoosh: (t) => [t.at('"Regardless'), t.at('Eight'), t.at('Now jump'), t.at("So here's")].map((f) => f - 1)},
];

export const VSHORTS = DEFS.map((d) => {
  const b = build(d.segs);
  return {id: d.id, frames: Math.ceil(b.n.duration * FPS) + OUTRO, C: () => <Shell d={d} b={b} />};
});
