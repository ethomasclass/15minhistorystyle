// Chapter 7 · A Letter from Hell: the letter read word by word, the 12:15 deadline, the party night (a real 1918
// record and a montage on the beat), the clock reaching 12:15 in silence, and the turn: he probably never wrote it.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch07_letter.words.json';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, hasFile, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Bed, Clock, clockTicks, Counter, Desk, DropCard, Fit, Flicker, Pic, Sounds, SyncQuote} from '../kit/ax';
import {M} from '../music';
import {P} from '../pics';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

/** The letter arrives. */
const Arrives: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={0}>
      <DropCard src={P.letter.src} x={1040} y={110} w={640} rot={3} at={t.at('a letter')} />
      <Note text="three days after gretna" x={130} y={110} size={56} rot={-3} at={t.at('Three days')} color="#ffffff" />
      {g >= t.at('Hell,') && <Highlight text="HELL, MARCH 13, 1919" x={120} y={300} size={86} at={t.at('Hell,')} seed={81} rot={-2} />}
      <Note text="the Times-Picayune prints it" x={150} y={520} size={60} rot={-3} at={t.at('prints it.')} />
      <Tag text={P.letter.tag} />
    </Desk>
  );
};

/** The letter's own words over the dimmed page, as the narrator reads them. */
const Reading: React.FC<{t: TL; children: React.ReactNode}> = ({t, children}) => (
  <AbsoluteFill style={{background: '#0b0a08'}}>
    <Pic src={P.letter.src} tag={P.letter.tag} a={t.at('"Esteemed')} b={t.at('He will pass')} z0={1.1} z1={1.3} look="news" vignette={0.9}>
      {() => <AbsoluteFill style={{background: 'rgba(8,6,4,0.62)'}} />}
    </Pic>
    <Flicker />
    {children}
  </AbsoluteFill>
);

const Mortal: React.FC<{t: TL}> = ({t}) => (
  <Reading t={t}>
    <SyncQuote t={t} phrase={'"Esteemed Mortal,"'} x={160} y={220} w={1600} size={92} />
    <SyncQuote t={t} phrase={'"They have never caught me and they never will."'} x={160} y={420} w={1500} size={76} />
  </Reading>
);

const Demon: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Reading t={t}>
      <Note text="not human, he says:" x={160} y={130} size={56} rot={-3} at={t.at("isn't human.")} color="#ffffff" />
      <SyncQuote t={t} phrase={'"a spirit and a demon from the hottest hell."'} x={160} y={270} w={1600} size={88} marks={{7: pal.subject, 8: pal.subject}} />
      <Note text="the police? stupid, he says" x={180} y={680} size={60} rot={-3} at={t.at('brags')} />
      <Note text="and then: an offer" x={220} y={830} size={70} rot={-4} at={t.at('an offer.')} color={pal.subject} />
    </Reading>
  );
};

/** The deadline and the offer: the clock waits at 12:00 while the jazz clause is read. */
const Offer: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('He will pass')} flicker>
      <Clock cx={1570} cy={300} r={210} at={t.at('He will pass')} a={1e7} b={1e7} />
      <Note text="12:15, tuesday night" x={1330} y={560} size={56} rot={-3} at={t.at('12:15')} />
      <Note text="st. joseph's night" x={1360} y={660} size={56} rot={-3} at={t.at("St. Joseph's")} color="#ffffff" />
      <SyncQuote t={t} phrase={'"I am very fond of jazz music,"'} x={120} y={120} w={1150} size={64} marks={{5: pal.mark, 6: pal.mark}} />
      <SyncQuote t={t} phrase={'"and I swear by all the devils in the nether regions that every person shall be spared in whose home a jazz band is in full swing."'}
        x={120} y={330} w={1150} size={54} marks={{21: pal.subject, 22: pal.subject, 25: pal.subject, 26: pal.subject}} />
    </Desk>
  );
};

const GetTheAxe: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Anyone who')} flicker push={0.08}>
      <Note text="anyone who doesn't" x={180} y={150} size={64} rot={-3} at={t.at('Anyone who')} color="#ffffff" />
      <SyncQuote t={t} phrase={'"jazz it out,"'} x={200} y={260} w={1500} size={140} />
      <SyncQuote t={t} phrase={'"will get the axe."'} x={300} y={560} w={1500} size={140} marks={{3: pal.subject}} />
    </Desk>
  );
};

/** In 1919 jazz is new. */
const NewMusic: React.FC<{t: TL}> = ({t}) => (
  <Pic src={P.band.src} tag={P.band.tag} a={t.at('Now remember,')} b={t.at('And on Tuesday')} z0={1.02} z1={1.1}>
    {() => (
      <>
        <Note text="1919: jazz is new" x={120} y={110} size={66} rot={-3} at={t.at('jazz is new.')} />
        <Note text={'respectable people: "just noise"'} x={120} y={880} size={58} rot={-3} at={t.at('noise.')} color="#ffffff" />
      </>
    )}
  </Pic>
);

/** The party: hard cuts on the beat through the band pictures, notes on the spoken details. */
const Party: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const a = t.at('And on Tuesday');
  const gen = {src: 'img/gen/ch07_house_party.png', tag: "Illustration · A house party on St. Joseph's Night, 1919"};
  const pics = hasFile(gen.src) ? [P.band, gen, P.band2, gen] : [P.band, P.band2, P.band, P.band2];
  const beat = 22; // about the record's tempo: a cut every bar
  const i = Math.max(0, Math.floor((f - a) / beat)) % pics.length;
  const pic = pics[i];
  const zoom: [number, number] = i % 2 ? [1.25, 1.32] : [1.04, 1.12];
  return (
    <AbsoluteFill>
      <Pic key={i} src={pic.src} tag={pic.tag} a={a + i * beat} b={a + (i + 1) * beat} z0={zoom[0]} z1={zoom[1]} fx={i === 2 ? 500 : undefined}>
        {() => null}
      </Pic>
      <Counter label="TUESDAY NIGHT ·" n="11:42 PM" at={a + 4} />
      <Note text="new orleans jazzed it out" x={110} y={110} size={64} rot={-3} at={t.at('jazzed')} />
      <Note text="the dance halls: packed" x={110} y={250} size={64} rot={-3} at={t.at('The dance halls')} />
      <Note text="house parties all over town" x={110} y={820} size={58} rot={-3} at={t.at('house parties')} color="#ffffff" />
      <Note text="no band? records. the family piano." x={110} y={930} size={54} rot={-3} at={t.at('records,')} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** Joseph Davilla's song: the sheet music from the cold open. */
const Song: React.FC<{t: TL}> = ({t}) => (
  <Fit src={P.sheet.src} tag={P.sheet.tag} a={t.at('And a local')} b={t.at('Midnight.')} z0={1} z1={1.08}>
    {() => (
      <>
        <Note text="Joseph Davilla's song" x={1300} y={240} size={60} rot={-4} at={t.at('Davilla,')} />
        <Note text="our sheet music" x={1330} y={760} size={64} rot={-4} at={t.at('our sheet')} />
        <Loop cx={960} cy={540} rx={420} ry={480} at={t.at('our sheet')} seed={9} tilt={-3} />
      </>
    )}
  </Fit>
);

/** Midnight. 12:15. Then morning: the clock in silence, then the light comes up. */
const Midnight: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = t.at('Midnight.');
  const b = t.at('Then morning.');
  const dawn = interpolate(f, [b, b + 30], [0, 1], clamp);
  return (
    <Desk a={a} push={0.05}>
      <Clock cx={960} cy={500} r={300} at={a - 2} a={t.at('12:15.', 2) - 30} b={t.at('12:15.', 2)} glow={g >= t.at('12:15.', 2) ? 1 : 0} />
      <Note text="midnight" x={260} y={860} size={70} rot={-3} at={a} color="#ffffff" />
      <Note text="12:15" x={860} y={880} size={80} rot={-3} at={t.at('12:15.', 2)} />
      <Note text="morning" x={1400} y={860} size={70} rot={-3} at={b} color="#ffffff" />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 0%, rgba(255,250,235,0.5) 0%, transparent 70%)', opacity: dawn * 0.6, mixBlendMode: 'screen'}} />
    </Desk>
  );
};

const Nobody: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at('Nobody was attacked')}>
      {g >= t.at('Nobody was attacked') && <Highlight text="NOBODY WAS ATTACKED" x={210} y={380} size={120} at={t.at('Nobody was attacked')} seed={83} rot={-2} />}
      <Note text="that night" x={700} y={600} size={84} rot={-4} at={t.at('that night.')} />
    </Desk>
  );
};

/** The turn: he probably never wrote it. */
const Hoax: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('So did')}>
      <DropCard src={P.letter.src} x={120} y={140} w={560} rot={-4} at={t.at('So did') + 1} />
      <Note text="did he keep his word?" x={800} y={110} size={60} rot={-3} at={t.at('keep his')} color="#ffffff" />
      <Note text="he probably never wrote it" x={800} y={240} size={66} rot={-3} at={t.at('never wrote')} color={pal.box} />
      <Note text="fake letters: common in famous cases" x={800} y={380} size={52} rot={-2} at={t.at('Fake letters')} color="#ffffff" />
      <Note text="a prankster?" x={840} y={520} size={64} rot={-4} at={t.at('A prankster.')} />
      <Note text="a reporter?" x={1120} y={620} size={64} rot={-4} at={t.at('A reporter.')} />
      <Note text="someone selling jazz?" x={900} y={740} size={64} rot={-4} at={t.at('make money')} />
      <Note text="never proved" x={1160} y={900} size={64} rot={-3} at={t.at('Nobody ever')} color={pal.subject} />
      <Tag text={P.letter.tag} />
    </Desk>
  );
};

const Real: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Desk a={t.at('The party was')}>
      {g >= t.at('The party was') && <Highlight text="THE PARTY: REAL" x={200} y={300} size={120} at={t.at('The party was')} seed={85} rot={-2} />}
      <Note text="the invitation: almost certainly fake" x={240} y={560} size={84} rot={-4} at={t.at('The invitation')} color={pal.subject} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const party = at('And on Tuesday');
  const mid = at('Midnight.');
  const cuts: [number, React.ReactNode][] = [
    [0, <Arrives t={t} />],
    [at('"Esteemed') - 1, <Mortal t={t} />],
    [at('The writer') - 1, <Demon t={t} />],
    [at('He will pass') - 1, <Offer t={t} />],
    [at('Anyone who') - 1, <GetTheAxe t={t} />],
    [at('Now remember,') - 1, <NewMusic t={t} />],
    [party - 1, <Party t={t} />],
    [at('And a local') - 1, <Song t={t} />],
    [mid - 1, <Midnight t={t} />],
    [at('Nobody was attacked') - 1, <Nobody t={t} />],
    [at('So did') - 1, <Hoax t={t} />],
    [at('The party was') - 1, <Real t={t} />],
  ];
  const scene = useScene(cuts);
  // the montage's own cuts get a soft tick instead of a whoosh
  const beats = Array.from({length: Math.max(0, Math.floor((at('And a local') - party) / 22))}, (_, i) => party + (i + 1) * 22).filter((f) => f < at('And a local') - 4);
  return (
    <>
      {scene}
      <Bed src="music/r_spirits_dark.mp3" from={0} to={at('Now remember,') + 6} vol={0.12} />
      <Bed src="sfx/crackle.wav" from={at('Now remember,') - 10} to={party} vol={0.12} />
      <Bed src={M.party} from={party - 8} to={mid + 2} vol={0.24} fadeIn={6} fadeOut={2} />
      <Bed src="sfx/crackle.wav" from={mid} to={at('Nobody was attacked') + 20} vol={0.1} fadeIn={2} />
      <Bed src="music/a_price.mp3" from={at('So did') - 6} to={t.frames + 34} vol={0.22} />
      <Sounds t={t} cuts={cuts.map(([f]) => f).filter((f) => f !== party - 1)}
        stamps={['Hell,', 'Nobody was attacked', 'The party was']}
        writes={['Three days', 'prints it.', "isn't human.", 'brags', 'an offer.', '12:15', "St. Joseph's", 'Anyone who', 'jazz is new.', 'noise.', 'jazzed', 'The dance halls', 'house parties', 'records,',
          'Davilla,', 'our sheet', 'that night.', 'keep his', 'never wrote', 'Fake letters', 'A prankster.', 'A reporter.', 'make money', 'Nobody ever', 'The invitation']}
        ticks={['a letter', 'So did', ...beats, ...clockTicks(at('12:15.') - 30, at('12:15.'))]}
        booms={['axe."']}
        extra={[[mid - 1, 'sfx/needle.wav', 0.5], [at('Then morning.'), 'sfx/tick_soft.wav', 0.3]]} />
    </>
  );
};

export const Ch07 = () => (
  <ChapterShell n={N} audio="audio/ch07_letter.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
