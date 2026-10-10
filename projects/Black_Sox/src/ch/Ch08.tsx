// Chapter 8 · Full Circle: Rule 21, the wall holds (1989), the law changes (2018), 2025–26, the answer, both readings,
// the last line over Hoboken, then a music-only end screen with the closing subscribe reminder.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch08_full_circle.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, Tag, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, Definition, hasFile, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Arch, Desk, DropCard, Ledger, Line, LOOK, ROWS, Sounds, StandIn, Wall} from '../kit/bs';

const N = words as Narration;
/** Music-only end screen after the last word (the shell adds its own tail and fade). */
const END_SCREEN = 330;
export const CH08_FRAMES = chapterFrames(N, LEAD) + END_SCREEN;
const RELEASE = 'img/ch01/mlb_polymarket_release_2026.png';
const CI = 'img/ch02/currier_ives_american_national_game_1866.jpg';

/** Rule 21, as a card on the desk. */
const Rule21: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const k = interpolate(f, [0, 6], [0, 1], clamp);
  return (
    <Desk a={0}>
      <div style={{position: 'absolute', left: 200, top: 90, width: 1000, padding: '40px 50px', background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
        transform: `rotate(-1.5deg) scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2)}}>
        <div style={{fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: '#555'}}>MAJOR LEAGUE RULES · MISCONDUCT</div>
        <div style={{fontFamily: JF.display, fontSize: 84, color: '#111', margin: '8px 0 18px'}}>RULE 21 (d)</div>
        <div style={{fontFamily: JF.heavy, fontWeight: 900, fontSize: 36, lineHeight: 1.4, color: '#222'}}>
          Any player, umpire, or Club or League official or employee, who shall bet any sum whatsoever upon any baseball game in connection with which the bettor has a duty to perform
          shall be declared <span style={{background: f >= t.at('banned for life') ? 'rgba(255,111,97,0.45)' : 'transparent'}}>permanently ineligible.</span>
        </div>
      </div>
      <Note text="posted in every clubhouse" x={220} y={780} size={52} rot={-3} at={t.at('posted') - 3} />
      <Note text="(it still is)" x={260} y={880} size={44} rot={-3} at={t.at('clubhouse') + 4} color="#ffffff" />
      <Stamp text="FOR LIFE." x={1260} y={760} at={t.at('banned for life') + 4} size={120} color={pal.subject} />
      <Tag text="Major League Rules, Rule 21 (d)(2), current text" />
    </Desk>
  );
};

/** The wall holds: 1989. */
const Held: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('The wall held')}>
    <Wall x={160} y={140} w={1600} rows={6} at={t.at('The wall held') - 30} dur={1} />
    <Note text="held for most of a century" x={170} y={530} size={66} rot={-3} at={t.at('held') - 3} color="#ffffff" />
    <Highlight text="1989" x={170} y={680} size={110} at={t.at('1989,')} seed={121} rot={-2} />
    <Note text="Pete Rose, all-time hits leader: banned" x={180} y={870} size={56} rot={-3} at={t.at('Pete Rose') - 3} />
  </Desk>
);

/** The law changes: 2018. Bricks fall. */
const Law: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Then the law')}>
    <Wall x={160} y={140} w={1600} rows={6} at={t.at('Then the law') - 30} dur={1} knock={t.at('changed')} />
    <Note text="then the law changed" x={170} y={530} size={66} rot={-3} at={t.at('Then the law') + 2} color="#ffffff" />
    <Highlight text="2018" x={170} y={660} size={110} at={t.at('2018,')} seed={123} rot={-2} />
    <Note text="Supreme Court: states may legalize sports betting" x={180} y={850} size={50} rot={-3} at={t.at('Supreme Court') - 3} />
    <Note text="betting apps sponsor teams, advertise in games" x={180} y={950} size={46} rot={-3} at={t.at('betting apps') - 3} color="#ffffff" />
  </Desk>
);

/** 2025: lifetime bans end at death (the ledger, stamped). */
const AtDeath: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const a = t.at('off the banned');
  const k = interpolate(f, [a, a + 4, a + 7], [1.35, 0.95, 1], clamp);
  return (
    <Desk a={t.at('In 2025')}>
      <Ledger x={300} y={30} w={1320} at={t.at('In 2025') - 1} entries={[ROWS.y1865(), ROWS.y1877(), ROWS.y1882(), ROWS.y1908(), ROWS.y1919(0, 0, 0), ROWS.y1921()]} />
      <Highlight text="2025" x={170} y={700} size={100} at={t.at('In 2025') + 4} seed={125} rot={-2} />
      <Note text="lifetime bans end at death" x={560} y={720} size={62} rot={-3} at={t.at('lifetime ban') - 3} color={pal.subject} />
      <Note text="Jackson, the 1919 Sox, Pete Rose: off the list" x={180} y={880} size={52} rot={-3} at={t.at('took Joe') - 3} color="#ffffff" />
      {f >= a && <div style={{position: 'absolute', left: 820, top: 420, padding: '6px 22px', border: `6px solid ${pal.mark}`, color: pal.mark, fontFamily: JF.display, fontSize: 56,
        transform: `rotate(-8deg) scale(${k})`, background: 'rgba(13,12,9,0.35)'}}>REMOVED AT DEATH</div>}
    </Desk>
  );
};

/** 2025: the Cleveland case, neutrally. */
const Case: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('That same year')}>
    <Note text="the same year:" x={170} y={120} size={58} rot={-3} at={t.at('That same year') - 2} color="#ffffff" />
    <Note text="two Cleveland pitchers charged" x={190} y={240} size={66} rot={-3} at={t.at('federal prosecutors') - 3} />
    <Highlight text="MICROBETS" x={180} y={400} size={110} at={t.at('microbets,')} seed={127} rot={-2} />
    <Definition term="microbet" def="a bet on a single pitch" at={t.at('bets on a') - 2} x={190} y={590} w={900} />
    <Note text="both pleaded not guilty" x={190} y={760} size={60} rot={-3} at={t.at('Both pleaded') - 3} color="#ffffff" />
    <Note text="no trial yet (as of Oct. 2026)" x={190} y={870} size={52} rot={-3} at={t.at('their case') - 3} />
    <Tag text="Indictment, E.D.N.Y., Nov. 2025 · pleas, Feb. 2026" />
  </Desk>
);

/** 2026: the league's partnership, with the single-pitch safeguard. */
const Deal: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('In 2026')}>
    {hasFile(RELEASE) ? <DropCard src={RELEASE} x={1020} y={130} w={760} rot={2} at={t.at('In 2026') - 1} filter={LOOK.doc} />
      : <StandIn x={1020} y={130} w={760} h={500} rot={2} label="MLB press release, Mar 19 2026 (callback to ch01)" />}
    <Highlight text="2026" x={150} y={130} size={110} at={t.at('In 2026') + 3} seed={129} rot={-2} />
    <Note text="the league's deal" x={160} y={330} size={54} rot={-3} at={t.at('signed its deal') - 3} color="#ffffff" />
    <Note text="with Polymarket" x={200} y={420} size={54} rot={-3} at={t.at('with Polymarket') - 3} color="#ffffff" />
    <Note text="single-pitch markets:" x={160} y={560} size={58} rot={-3} at={t.at('Part of that') - 3} />
    <Note text="off the board" x={200} y={660} size={78} rot={-3} at={t.at('off the board') - 3} />
    <Tag text="MLB press release, March 19, 2026" />
  </Desk>
);

/** Back to the question (callback to the cold open). */
const Question: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at("So let's")}>
      <Note text="back to the question:" x={180} y={150} size={60} rot={-3} at={t.at("So let's") + 2} color="#ffffff" />
      <Note text="part of the game," x={240} y={300} size={84} rot={-3} at={t.at('part of the game') - 3} />
      <Note text="to the unforgivable sin," x={240} y={430} size={84} rot={-3} at={t.at('unforgivable') - 5} color={pal.subject} />
      <Note text="and back?" x={240} y={560} size={84} rot={-3} at={t.at('and back') - 2} />
    </Desk>
  );
};

/** Never gone: the rule on paper, 1919 too big to hide, a wall for a hundred years. */
const Answer: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('It was never')}>
      <Highlight text="NEVER REALLY GONE" x={150} y={90} size={90} at={t.at('never really')} seed={131} rot={-2} />
      <Note text="before 1919: a rule, on paper" x={170} y={270} size={58} rot={-3} at={t.at('Before 1919') - 3} color="#ffffff" />
      <Note text="enforce it = admit a problem" x={170} y={370} size={58} rot={-3} at={t.at('admitting') - 3} />
      <Note text="1919: too big to hide" x={170} y={470} size={64} rot={-3} at={t.at('too big') - 3} color={pal.subject} />
      <Wall x={160} y={620} w={1600} rows={6} at={t.at('built a wall') - 2} dur={18} brickH={56} />
    </Desk>
  );
};

/** The line has moved: the wall becomes a dashed line between the stands and the field. */
const TheLine: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Now the line')}>
      <Wall x={160} y={240} w={1600} rows={6} at={t.at('Now the line') - 30} dur={1} brickH={56} line={t.at('moved') - 2} />
      <div style={{position: 'absolute', left: 170, top: 120, fontFamily: JF.mono, fontSize: 28, letterSpacing: 4, color: '#EDE7DC', opacity: 0.85}}>THE STANDS</div>
      <Note text="fans can bet" x={180} y={200} size={60} rot={-3} at={t.at('Fans can') - 3} color="#ffffff" />
      <Note text="leagues can partner with sportsbooks" x={180} y={300} size={50} rot={-3} at={t.at('Leagues') - 3} color="#ffffff" />
      <Note text="and prediction markets" x={240} y={390} size={50} rot={-3} at={t.at('prediction markets') - 3} color="#ffffff" />
      <div style={{position: 'absolute', left: 170, top: 640, fontFamily: JF.mono, fontSize: 28, letterSpacing: 4, color: pal.mark}}>THE FIELD</div>
      <Note text="the rule from 1921 stays:" x={180} y={720} size={58} rot={-3} at={t.at('The rule that') - 3} />
      <Note text="the people on the field can't be in on it" x={180} y={830} size={64} rot={-3} at={t.at('the people on') - 3} color={pal.subject} />
    </Desk>
  );
};

/** Two readings: supporters (teal) and critics (coral). */
const TwoViews: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('To supporters')}>
      <div style={{position: 'absolute', left: 958, top: 110, width: 4, height: 860, background: 'rgba(244,239,230,0.55)'}} />
      <div style={{position: 'absolute', left: 140, top: 150, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.mark}}>SUPPORTERS</div>
      <div style={{position: 'absolute', left: 1040, top: 150, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.subject}}>CRITICS</div>
      <Note text="betting out in the open" x={140} y={260} size={54} rot={-3} at={t.at('betting out') - 3} />
      <Note text="regulated" x={160} y={380} size={54} rot={-3} at={t.at('regulated') - 3} />
      <Note text="watched for anything suspicious" x={140} y={500} size={46} rot={-3} at={t.at('watched for') - 3} />
      <Note text="a bet in every fan's pocket" x={1040} y={260} size={52} rot={-3} at={t.at('puts a bet') - 3} color={pal.subject} />
      <Note text="more temptation" x={1040} y={380} size={52} rot={-3} at={t.at('more temptation') - 3} color={pal.subject} />
      <Note text="close to the game" x={1060} y={480} size={52} rot={-3} at={t.at('close to') - 3} color={pal.subject} />
    </Desk>
  );
};

/** The last line over Hoboken (callback), then the end screen. */
const Last: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const end = t.at('Thanks');
  return (
    <Arch src={CI} tag="Currier & Ives · The American National Game of Base Ball, Hoboken, 1866 · Library of Congress" a={t.at('Either way')} b={end + 400} z={[1.08, 1.3]} pos="50% 70%" look="dim">
      <Note text="since Hoboken, 1865..." x={140} y={110} size={60} rot={-3} at={t.at('since Hoboken') - 3} color="#ffffff" />
      <Line text="the question was never whether people would bet on baseball." x={140} y={250} w={1400} size={62} at={t.at('the question has') - 2} />
      <Highlight text="WHO'S WATCHING." x={140} y={470} size={130} at={t.at("who's watching")} seed={133} rot={-2} />
      <Loop cx={680} cy={560} rx={560} ry={130} at={t.at('they do') + 4} seed={135} tilt={-3} />
      <Note text="thanks for watching" x={150} y={760} size={58} rot={-3} at={end - 2} color="#ffffff" />
      <Note text="subscribe for more ↓" x={170} y={860} size={58} rot={-3} at={t.at('subscribe,') - 3} color={pal.subject} />
    </Arch>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Rule21 t={t} />],
    [at('The wall held') - 1, <Held t={t} />],
    [at('Then the law') - 1, <Law t={t} />],
    [at('In 2025') - 1, <AtDeath t={t} />],
    [at('That same year') - 1, <Case t={t} />],
    [at('In 2026') - 1, <Deal t={t} />],
    [at("So let's") - 1, <Question t={t} />],
    [at('It was never') - 1, <Answer t={t} />],
    [at('Now the line') - 1, <TheLine t={t} />],
    [at('To supporters') - 1, <TwoViews t={t} />],
    [at('Either way') - 1, <Last t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('1989,'), at('2018,'), at('In 2025') + 4, at('microbets,'), at('In 2026') + 3, at('never really'), at("who's watching")]}
        booms={[at('banned for life') + 4, at('changed'), at('off the banned'), at('built a wall')]}
        writes={['posted', 'held', 'Pete Rose', 'Then the law', 'Supreme Court', 'betting apps', 'lifetime ban', 'took Joe', 'That same year', 'federal prosecutors', 'Both pleaded', 'their case', 'signed its deal', 'Part of that', 'off the board', "So let's", 'part of the game', 'unforgivable', 'and back', 'Before 1919', 'admitting', 'too big', 'Fans can', 'Leagues', 'The rule that', 'the people on', 'betting out', 'regulated', 'watched for', 'puts a bet', 'more temptation', 'since Hoboken', 'Thanks', 'subscribe,'].map((p) => at(p))}
        extra={[{at: at('changed') + 4, src: 'sfx/smash.wav', volume: 0.3}]} />
    </>
  );
};

export const Ch08: React.FC = () => {
  const t = makeTimeline(N, 30);
  return (
    <ChapterShell n={N} audio="audio/ch08_full_circle.wav" lead={LEAD} extra={END_SCREEN}
      music={[{src: 'music/a_newsroom.mp3', volume: 0.13, startFrom: 300}, {src: 'music/r_ending.mp3', volume: 0.15, from: t.at('It was never') - 20}]}>
      <Body />
    </ChapterShell>
  );
};
