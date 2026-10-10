// Chapter 1 · Two Documents: the cold open (Landis 1921 vs MLB 2026, the driving question), then the channel intro
// and the title card.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame, usePal} from '../kit/Kit';
import {Sfx, WRITE} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {CropCard, Definition, hasFile, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Arch, Desk, DropCard, LOOK, StandIn, SyncQuote} from '../kit/bs';
import {Parallax} from '../kit/parallax';
import {MASKS} from '../masks';
import {DATES, SUBTITLE, TITLE} from '../project';

const N = words as Narration;
const TITLE_FRAMES = 150;
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

/** The user's screenshot of the league's release (mlb.com, March 19, 2026). Stand-in until it exists. */
const RELEASE = 'img/ch01/mlb_polymarket_release_2026.png';

/** August 3rd, 1921: Landis on a Washington street, coral, traced; the date as the title. */
const Landis: React.FC<{t: TL}> = ({t}) => (
  <Parallax name="landis_street" src="img/ch01/landis_street_1924_crop.jpg" size={[3280, 2430]} a={0} b={t.at('"Regardless')} fx={0.56} fy={0.4}
    cam={{z: [1.02, 1.14]}} mask={MASKS.landis_street} traceAt={t.at('Judge') + 2} tag="Library of Congress · National Photo Co., 1924">
    {() => (
      <>
        <Highlight text="AUGUST 3, 1921" x={100} y={100} size={96} at={t.at('August')} seed={11} rot={-2} />
        <Note text="baseball's brand-new boss" x={1180} y={300} size={50} rot={-3} at={t.at('brand-new') - 3} color="#ffffff" />
        <Note text="Judge Kenesaw Mountain Landis" x={1060} y={860} size={50} rot={-3} at={t.at('Judge') - 2} />
      </>
    )}
  </Parallax>
);

/** His statement, word by word over the dimmed desk portrait. */
const Statement: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Arch src="img/ch01/landis_commissioner_bain_1920s.jpg" tag="Library of Congress · Bain News Service, c. 1921" a={t.at('"Regardless')} b={t.at('Eight')} z={[1.05, 1.12]} pos="50% 45%" look="dim">
      <SyncQuote t={t} phrase="Regardless of the verdict of juries," x={150} y={190} w={1620} size={74} close={false} marks={{3: pal.subject}} />
      <SyncQuote t={t} phrase="no player that throws a ball game... will ever play professional baseball." x={150} y={420} w={1620} size={74} open={false} marks={{3: pal.subject}} />
      <Note text="Landis · Aug. 3, 1921" x={1260} y={850} size={46} rot={-3} at={t.at('it says') - 2} color="#ffffff" />
    </Arch>
  );
};

/** The eight, a day after the verdict: the courtroom photo, FOR LIFE, NOT GUILTY. */
const Eight: React.FC<{t: TL}> = ({t}) => (
  <Arch src="img/ch01/black_sox_at_trial_1921.jpg" tag="The players at trial, Chicago, 1921 · Wikimedia Commons" a={t.at('Eight')} b={t.at('Now jump')} z={[1.04, 1.12]} pos="50% 40%">
    <Stamp text="FOR LIFE." x={90} y={870} at={t.at('For life')} size={130} color="#FF6F61" />
    <Note text="the day before:" x={1200} y={800} size={52} rot={-3} at={t.at('The day before') - 2} color="#ffffff" />
    <Note text="NOT GUILTY" x={1240} y={880} size={80} rot={-4} at={t.at('not guilty') - 2} color="#FF9F1C" />
  </Arch>
);

/** 105 years later: a second document on the desk. */
const Release: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  return (
  <Desk a={t.at('Now jump')}>
    <Stamp text="+105 YEARS" x={110} y={110} at={t.at('105')} size={130} />
    <Note text="March 2026" x={130} y={300} size={60} rot={-3} at={t.at('March') - 2} />
    {hasFile(RELEASE) ? <DropCard src={RELEASE} x={900} y={150} w={880} rot={2} at={t.at('Another') - 1} filter={LOOK.doc} />
      : t.at('Another') - 1 <= f && <StandIn x={900} y={150} w={880} h={560} rot={2} label="your screenshot: MLB press release, Mar 19 2026 → img/ch01/mlb_polymarket_release_2026.png" />}
    <Highlight text="POLYMARKET" x={120} y={470} size={104} at={t.at('Polymarket')} seed={21} rot={-2} />
    <Definition term="prediction market" def="where people trade on what's going to happen" at={t.at('prediction market') + 8} x={120} y={660} w={760} />
    <Note text="including baseball games" x={150} y={880} size={52} rot={-3} at={t.at('Including') - 2} color="#ffffff" />
  </Desk>
  );
};

/** Same sport, two documents side by side. */
const TwoDocs: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Same sport')}>
      <DropCard src="img/ch01/eight_men_banned_1920.png" x={230} y={110} w={540} rot={-3} at={t.at('Same sport') - 1} filter={LOOK.doc} />
      {hasFile(RELEASE) ? <DropCard src={RELEASE} x={1080} y={180} w={640} rot={2} at={t.at('Same sport') + 3} filter={LOOK.doc} />
        : <StandIn x={1080} y={180} w={640} h={430} rot={2} label="MLB press release, 2026" />}
      <div style={{position: 'absolute', left: 958, top: 90, width: 4, height: 860, background: 'rgba(244,239,230,0.55)'}} />
      <div style={{position: 'absolute', left: 230, top: 760, fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: pal.mark}}>1921</div>
      <div style={{position: 'absolute', left: 1090, top: 760, fontFamily: JF.mono, fontSize: 28, letterSpacing: 3, color: pal.subject}}>2026</div>
      <Note text="bans players over gambling" x={200} y={810} size={46} rot={-3} at={t.at('bans') - 3} />
      <Note text="names an official partner" x={1080} y={810} size={46} rot={-3} at={t.at('The other names') - 2} color={pal.subject} />
    </Desk>
  );
};

/** The myth, crossed out: before 1919 it wasn't taboo; it was everywhere. A big 1865 crowd behind. */
const Everywhere: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const strike = interpolate(g, [t.at("wasn't taboo"), t.at("wasn't taboo") + 5], [0, 1], clamp);
  return (
    <Arch src="img/ch02/athletics_atlantics_beale_1865.jpg" tag="J. B. Beale · Athletics vs. Atlantics, Philadelphia, 1865 · Library of Congress" a={t.at("So it's easy")} b={t.at("So here's")} z={[1.05, 1.16]} pos="40% 55%" look="dim">
      <Note text="back then: taboo" x={180} y={190} size={78} rot={-3} at={t.at('back then') - 2} color="#ffffff" />
      <div style={{position: 'absolute', left: 170, top: 262, height: 9, borderRadius: 5, background: '#FF9F1C', width: 560 * strike, transform: 'rotate(-3deg)'}} />
      <Note text="now: everywhere" x={180} y={330} size={78} rot={-3} at={t.at('and now') - 2} color="#ffffff" />
      <Note text="before 1919?" x={180} y={560} size={70} rot={-3} at={t.at('Before 1919') - 2} />
      <Highlight text="EVERYWHERE." x={180} y={690} size={130} at={t.at('everywhere', 2)} seed={23} rot={-2} />
    </Arch>
  );
};

/** The driving question on the desk. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at("So here's")}>
      <Note text="the question:" x={180} y={150} size={60} rot={-3} at={t.at('question') - 2} color="#ffffff" />
      <Note text="how did betting go from" x={220} y={270} size={84} rot={-3} at={t.at('How did') - 2} />
      <Note text="part of the game," x={280} y={400} size={84} rot={-3} at={t.at('part of') - 2} />
      <Note text="to baseball's unforgivable sin," x={280} y={530} size={84} rot={-3} at={t.at('unforgivable') - 6} color={pal.subject} />
      <Note text="and back again?" x={280} y={660} size={84} rot={-3} at={t.at('back again') - 2} />
      <Loop cx={640} cy={720} rx={330} ry={95} at={t.at('back again') + 8} seed={17} tilt={-4} />
    </Desk>
  );
};

/** Hook into chapter 2: the 1865 catcher card. */
const Catcher: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('It starts')}>
    <CropCard src="img/ch02/currier_ives_american_national_game_1866.jpg" size={[3840, 2773]} x={560} y={100} w={800} h={700} fx={1190} fy={2000} scale={1.1} rot={-2} at={t.at('It starts') - 1}
      mask={MASKS.catcher_ci} traceAt={t.at('catcher') + 3} />
    <Note text="a catcher who couldn't catch" x={560} y={900} size={62} rot={-3} at={t.at('catcher') - 3} />
    <Tag text="Currier & Ives, Hoboken, 1866 (detail) · Library of Congress" />
  </Desk>
);

/** Title card after the channel intro: the Currier & Ives Hoboken print dimmed, title on orange, subtitle teal. */
const Title: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#15130f', overflow: 'hidden'}}>
      <Img src={staticFile('img/ch02/currier_ives_american_national_game_1866.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        filter: 'grayscale(1) contrast(1.2) brightness(0.45)', transform: `scale(${1.04 + g * 0.0004})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.2) 30%, rgba(8,6,4,0.85) 100%)'}} />
      <Highlight text={TITLE} x={250} y={330} size={170} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 290, top: 600, fontFamily: JF.display, fontSize: 58, color: pal.mark, whiteSpace: 'nowrap', textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1300} y={740} size={56} rot={-5} at={24} />
      <Tag text="Currier & Ives · The American National Game of Base Ball, Hoboken, 1866 · Library of Congress" />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Landis t={t} />],
    [at('"Regardless') - 1, <Statement t={t} />],
    [at('Eight') - 1, <Eight t={t} />],
    [at('Now jump') - 1, <Release t={t} />],
    [at('Same sport') - 1, <TwoDocs t={t} />],
    [at("So it's easy") - 1, <Everywhere t={t} />],
    [at("So here's") - 1, <Question t={t} />],
    [at('It starts') - 1, <Catcher t={t} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      <Audio src={staticFile('music/r_cold_open.mp3')} volume={(f) => interpolate(f, [0, 15, END - 40, END], [0, 0.17, 0.17, 0], clamp)} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.32} />)}
      {['August', 'Polymarket', 'everywhere'].map((c) => <Sfx key={c} at={c === 'everywhere' ? at(c, 2) : at(c)} src="sfx/stamp.wav" volume={0.3} />)}
      {['For life', '105'].map((c) => <Sfx key={c} at={at(c)} src="sfx/boom.wav" volume={0.3} />)}
      {['brand-new', 'Judge', 'not guilty', 'March', 'Including', 'bans', 'The other names', 'back then', 'and now', 'Before 1919', 'question', 'How did', 'catcher'].map((c) => (
        <Sfx key={c} at={at(c) - 3} src={WRITE.src} volume={WRITE.volume} />
      ))}
      <Sfx at={at('Another')} src="sfx/page_turn.wav" volume={0.4} />
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
