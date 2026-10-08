// Chapter 9 · So Who Was the Axeman? The Los Angeles story, the suspects, the question answered, and the last
// line: "It played." Then a 12-second end screen on the band with the record playing.
import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import words from '../../public/audio/ch09_who.words.json';
import {boxOf, Highlight, JF, Note, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {clamp} from '../lib/anim';
import {Bed, Blamed, Clip, Desk, DropCard, Fit, Pic, Sounds} from '../kit/ax';
import {M} from '../music';
import {P} from '../pics';

const N = words as Narration;
/** Frames the last picture holds after the narration, music only (room for YouTube's end-screen elements). */
const END_SCREEN = 360;
export const CH09_FRAMES = chapterFrames(N, LEAD) + END_SCREEN;

const Who: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={0}>
      {g >= t.at('So who') && <Highlight text="SO WHO WAS HE?" x={420} y={420} size={140} at={t.at('So who')} seed={101} rot={-2} />}
    </Desk>
  );
};

const LA: React.FC<{t: TL}> = ({t}) => (
  <Pic src={P.la.src} tag={P.la.tag} a={t.at('A couple')} b={t.at("It's a perfect")} z0={1.02} z1={1.1}>
    {() => (
      <>
        <Note text="los angeles, a couple of years later" x={110} y={110} size={58} rot={-3} at={t.at('Los Angeles,')} color="#ffffff" />
        <Note text="Pepitone's widow shoots a man" x={130} y={250} size={64} rot={-3} at={t.at('widow')} />
        <Note text={'"he killed my husband"'} x={160} y={860} size={66} rot={-3} at={t.at('She said')} />
      </>
    )}
  </Pic>
);

const Check: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at("It's a perfect")}>
      <Note text="a perfect ending" x={220} y={220} size={90} rot={-4} at={t.at('perfect ending.')} />
      <Note text="...hard to check" x={340} y={420} size={90} rot={-4} at={t.at('hard to check.')} color={pal.box} />
      <Note text="the records that would prove it: never turned up" x={200} y={700} size={60} rot={-3} at={t.at('never turned')} color="#ffffff" />
    </Desk>
  );
};

/** The suspects, as labelled cards pinned on the desk. No faces: there are no pictures of most of them. */
const Suspects: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const cards = [
    {label: 'A LONG CRIMINAL RECORD', at: t.at('criminal record.'), x: 120, y: 150},
    {label: 'AFTER THE WOMEN', at: t.at('the women'), x: 760, y: 120},
    {label: 'THE MAFIA', at: t.at('The Mafia.'), x: 1330, y: 170},
    {label: 'COPYCATS', at: t.at('Copycats.'), x: 220, y: 440},
    {label: 'SEVERAL ATTACKERS', at: t.at('several different'), x: 860, y: 430},
  ];
  return (
    <Desk a={t.at('There are other')}>
      <Note text="other suspects:" x={120} y={40} size={56} rot={-2} at={t.at('There are other')} color="#ffffff" />
      {cards.map((c, i) => {
        if (g < c.at) return null;
        const k = interpolate(g, [c.at, c.at + 5], [0, 1], {...clamp, easing: (u) => 1 - Math.pow(1 - u, 3) * (1 - 2.2 * u * (1 - u))});
        return (
          <div key={c.label} style={{position: 'absolute', left: c.x, top: c.y, width: 500, height: 220, background: '#efe7d6', boxShadow: '0 16px 30px rgba(0,0,0,0.6)',
            transform: `scale(${0.6 + 0.4 * k}) rotate(${(random(c.label) - 0.5) * 8}deg)`, opacity: Math.min(1, k * 2)}}>
            <div style={{position: 'absolute', left: 30, top: 70, fontFamily: '"Nanum Pen Script"', fontSize: 90, color: '#1b2a33', opacity: 0.85}}>?</div>
            <div style={{position: 'absolute', left: 14, bottom: -24, background: boxOf(pal), fontFamily: JF.display, fontSize: 38, color: '#111', padding: '2px 12px', whiteSpace: 'nowrap'}}>{c.label}</div>
          </div>
        );
      })}
      <Note text="stitched into one monster by the newspapers" x={150} y={800} size={60} rot={-3} at={t.at('stitched')} color={pal.subject} />
      <Note text="some attacks don't match at all" x={190} y={930} size={54} rot={-3} at={t.at("don't match")} color="#ffffff" />
    </Desk>
  );
};

/** The question again, in the cold open's layout. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at("So let's")}>
      <Note text="back to the question:" x={200} y={150} size={60} rot={-3} at={t.at('back to')} color="#ffffff" />
      {g >= t.at('How did') && <Highlight text="HOW DID A KILLER" x={200} y={290} size={104} at={t.at('How did')} seed={11} rot={-2} />}
      {g >= t.at('whole city') && <Highlight text="GET A WHOLE CITY" x={250} y={460} size={104} at={t.at('whole city')} seed={13} rot={-2} />}
      {g >= t.at('throw him') && <Highlight text="TO THROW HIM A PARTY?" x={300} y={630} size={104} at={t.at('throw him')} seed={15} rot={-2} />}
    </Desk>
  );
};

/** What actually did it: the fear, the papers, the blamed. */
const Answer: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('He probably')}>
      <Note text="he probably didn't." x={120} y={60} size={70} rot={-3} at={t.at('He probably')} color={pal.subject} />
      <DropCard src={P.street.src} x={110} y={240} w={520} rot={-3} at={t.at('so was the fear.')} look="night" />
      <Note text="real fear" x={180} y={640} size={60} rot={-3} at={t.at('so was the fear.')} />
      <Clip src={P.axMap1918.src} x={720} y={230} w={420} rot={2} at={t.at('Newspapers that')} />
      <Note text="a name for it" x={760} y={760} size={60} rot={-3} at={t.at('Newspapers that')} />
      <Blamed x={1230} y={230} at={t.at('Innocent people')} w={600} rot={3}
        rows={[{name: 'Andrew Maggio', at: -999, clear: -999}, {name: 'Louis Besumer', at: -999, clear: -999}, {name: 'the Jordanos', at: -999, clear: -999}]} />
      <Note text="again and again" x={1300} y={800} size={60} rot={-3} at={t.at('again and again.')} color="#ffffff" />
    </Desk>
  );
};

const Letter: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('And then a letter,')}>
      <DropCard src={P.letter.src} x={150} y={160} w={560} rot={-4} at={t.at('And then a letter,')} />
      <Note text="almost certainly fake" x={820} y={200} size={64} rot={-3} at={t.at('almost certainly')} color={pal.box} />
      <Note text="something to do with all that fear" x={820} y={420} size={60} rot={-3} at={t.at('something to do')} />
      <Note text="something they were good at" x={860} y={620} size={70} rot={-4} at={t.at('good at.')} color={pal.subject} />
    </Desk>
  );
};

const Name: React.FC<{t: TL}> = ({t}) => (
  <Fit src={P.sheet.src} tag={P.sheet.tag} a={t.at('New Orleans never')} b={t.at('It played.')} z0={1} z1={1.08}>
    {() => (
      <>
        <Note text="never learned his name" x={1280} y={260} size={60} rot={-4} at={t.at('never learned')} color="#ffffff" />
        <Note text="so it answered him" x={1300} y={720} size={64} rot={-4} at={t.at('So it answered')} />
      </>
    )}
  </Fit>
);

/** It played: the band, the record up full, and an end screen. */
const Played: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Pic src={P.band.src} tag={P.band.tag} a={t.at('It played.')} b={t.frames + END_SCREEN} z0={1.04} z1={1.14}>
      {() => (
        <>
          {g >= t.at('It played.') && <Highlight text="IT PLAYED." x={120} y={110} size={140} at={t.at('It played.')} seed={103} rot={-2} />}
          <AbsoluteFill style={{background: 'rgba(0,0,0,0.35)', opacity: interpolate(g, [t.frames + 40, t.frames + 70], [0, 1], clamp)}} />
        </>
      )}
    </Pic>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Who t={t} />],
    [at('A couple') - 1, <LA t={t} />],
    [at("It's a perfect") - 1, <Check t={t} />],
    [at('There are other') - 1, <Suspects t={t} />],
    [at("So let's") - 1, <Question t={t} />],
    [at('He probably') - 1, <Answer t={t} />],
    [at('And then a letter,') - 1, <Letter t={t} />],
    [at('New Orleans never') - 1, <Name t={t} />],
    [at('It played.') - 1, <Played t={t} />],
  ];
  const scene = useScene(cuts);
  const end = t.frames + END_SCREEN + 34;
  return (
    <>
      {scene}
      <Bed src="music/r_cold_open.mp3" from={0} to={at("So let's") + 6} vol={0.15} fadeOut={12} />
      <Bed src="music/r_ending.mp3" from={at("So let's") - 4} to={at('It played.') + 2} vol={0.15} fadeOut={4} />
      <Bed src={M.ending} from={at('It played.') - 2} to={end} vol={0.32} fadeIn={4} fadeOut={60} />
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['So who', 'How did', 'whole city', 'throw him', 'It played.']}
        writes={['Los Angeles,', 'widow', 'She said', 'perfect ending.', 'hard to check.', 'never turned', 'There are other', 'stitched', "don't match", 'back to', 'He probably', 'so was the fear.',
          'Newspapers that', 'again and again.', 'almost certainly', 'something to do', 'good at.', 'never learned', 'So it answered']}
        ticks={['criminal record.', 'the women', 'The Mafia.', 'Copycats.', 'several different', 'And then a letter,', 'Innocent people']} />
    </>
  );
};

export const Ch09 = () => (
  <ChapterShell n={N} audio="audio/ch09_who.wav" lead={LEAD} extra={END_SCREEN}>
    <Body />
  </ChapterShell>
);
