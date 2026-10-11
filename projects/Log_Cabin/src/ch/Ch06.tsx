// Chapter 6 · The Count: 234 to 60, 53 to 47, a landslide with no platform, record turnout, and who was left out
// (quiet: bone type, dashed figures, no coral, no jokes).
import React from 'react';
import words from '../../public/audio/ch06_the_count.words.json';
import {Highlight, JF, Note, PALETTES, PaletteCtx, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {SplitBar} from '../kit/charts';
import {Person} from '../kit/figures';
import {Line, Sounds} from '../kit/bs';
import {Board, PaperCard, RubberStamp} from '../kit/lc';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

const Mono: React.FC<{text: string; x: number; y: number; at: number; color?: string}> = ({text, x, y, at, color = '#EDE7DC'}) =>
  useGFrame() >= at ? <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.mono, fontSize: 28, letterSpacing: 4, color, textTransform: 'uppercase'}}>{text}</div> : null;

/** The result: electoral votes, then the popular vote. */
const Count: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Board>
      {g >= 2 && <Highlight text="NOVEMBER 1840" x={110} y={80} size={96} at={2} seed={91} rot={-2} />}
      <Mono text="electoral votes" x={140} y={260} at={t.at('234') - 4} />
      <Stamp text="234" x={140} y={330} at={t.at('234')} size={200} color={pal.subject} />
      <Note text="Harrison" x={160} y={540} size={56} rot={-3} at={t.at('234') + 4} color={pal.subject} />
      <Stamp text="60" x={700} y={330} at={t.at('to 60.')} size={200} color="#EDE7DC" />
      <Note text="Van Buren" x={700} y={540} size={56} rot={-3} at={t.at('to 60.') + 4} color="#ffffff" />
      <Mono text="popular vote" x={140} y={660} at={t.at('popular vote') - 4} />
      <SplitBar x={140} y={720} w={1640} h={130} at={t.at('about 53')} parts={[{label: 'Harrison', value: 53, subject: true}, {label: 'Van Buren', value: 47}]} />
      <Note text="closer" x={1200} y={590} size={60} rot={-3} at={t.at("it's closer") - 3} />
    </Board>
  );
};

/** A party with no platform wins in a landslide (callback to the empty platform card). */
const Landslide: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Board>
      <PaperCard x={200} y={200} w={600} at={1} rot={-2} title="PLATFORM">
        {[0, 1, 2, 3].map((i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, margin: '22px 0'}}><div style={{width: 18, height: 18, borderRadius: 9, background: '#333'}} /><div style={{flex: 1, borderBottom: '3px dashed #aaa', height: 4}} /></div>)}
      </PaperCard>
      <RubberStamp text="NOTHING." x={330} y={480} at={4} size={100} rot={-10} />
      <Note text="a party with no platform..." x={940} y={300} size={60} rot={-3} at={t.at('A party with') - 3} color="#ffffff" />
      {g >= t.at('landslide.') && <Highlight text="LANDSLIDE." x={930} y={420} size={130} at={t.at('landslide.')} seed={93} rot={-3} />}
    </Board>
  );
};

/** Turnout: eight in ten of the men allowed to vote. */
const Turnout: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  const lit = t.at('Nearly 80');
  return (
    <Board>
      <Note text="look who shows up" x={110} y={90} size={62} rot={-3} at={t.at('And look') - 3} color="#ffffff" />
      {Array.from({length: 10}).map((_, i) => (
        <Person key={i} x={260 + i * 150} y={660} h={250} at={t.at('who shows up') + i} color={i < 8 && g >= lit + i * 2 ? pal.mark : 'rgba(237,231,220,0.35)'} />
      ))}
      <Stamp text="NEARLY 80%" x={240} y={720} at={lit + 18} size={130} color={pal.mark} />
      <Note text="of the men allowed to vote" x={260} y={880} size={56} rot={-3} at={t.at('of the men') - 3} />
      <Note text="a record for the time" x={1200} y={900} size={56} rot={-3} at={t.at('A record') - 3} color="#ffffff" />
    </Board>
  );
};

/** Who was left out. Quiet: dashed figures, plain bone type. */
const LeftOut: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const groups: [string, string, boolean][] = [['Women.', 'women', true], ['Enslaved', 'enslaved people', false], ['free Black', 'free Black men (most states)', false], ['Native nations', 'Native nations', false]];
  return (
    <PaletteCtx.Provider value={PALETTES.quiet}>
      <Board>
        <Line text="Who wasn't allowed." x={140} y={90} at={t.at('Remember who') - 2} size={64} />
        {groups.map(([cue, label, dress], i) => (
          <React.Fragment key={cue}>
            {[0, 1].map((j) => <Person key={j} x={330 + i * 400 + j * 90 - 45} y={640} h={260} at={t.at(cue) + j * 2} dashed dress={dress && j === 0} color="#EDE7DC" />)}
            {g >= t.at(cue) && <div style={{position: 'absolute', left: 330 + i * 400 - 170, top: 680, width: 340, textAlign: 'center', fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: '#EDE7DC', textTransform: 'uppercase', lineHeight: 1.4}}>{label}</div>}
          </React.Fragment>
        ))}
        <Line text="the biggest turnout America had seen..." x={140} y={830} at={t.at('So the biggest') - 2} size={46} />
        <Line text="with millions left on the sidewalk, watching." x={140} y={900} at={t.at('left on the') - 2} size={46} />
      </Board>
    </PaletteCtx.Provider>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Count t={t} />],
    [at('A party with') - 1, <Landslide t={t} />],
    [at('And look') - 1, <Turnout t={t} />],
    [at('Remember who') - 1, <LeftOut t={t} />],
  ];
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[2, at('234'), at('to 60.'), at('landslide.'), at('Nearly 80') + 18]}
        writes={["it's closer", 'A party with', 'And look', 'of the men', 'A record'].map((p) => at(p))} />
    </>
  );
};

export const Ch06: React.FC = () => {
  const t = makeTimeline(N, 30);
  return (
    <ChapterShell n={N} audio="audio/ch06_the_count.wav" lead={LEAD}
      music={[{src: 'music/g_founding.mp3', volume: 0.17, to: t.at('Remember who')}, {src: 'music/r_dix.mp3', volume: 0.11, from: t.at('Remember who') - 15}]}>
      <Body />
    </ChapterShell>
  );
};
