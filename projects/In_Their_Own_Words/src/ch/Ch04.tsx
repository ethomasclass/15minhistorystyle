// Chapter 4 · Which Georgians? (quiet): Georgia's convention at Milledgeville, the 208 to 89 vote, and who chose the
// delegates: white men; no women; no one enslaved (about 44 percent of the state). Which Georgians?
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import words from '../../public/audio/ch04_which_georgians.words.json';
import {clamp} from '../lib/anim';
import {Note, Tag, useGFrame} from '../kit/Kit';
import {Sfx, WRITE} from '../kit/common';
import {Desk} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Person} from '../kit/figures';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene} from '../kit/shell';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

const BONE = '#EDE7DC';
const HOUSE = 'img/ch04/milledgeville_state_house_engraving_white_1854.jpg';
const VOTE = 'img/ch04/georgia_convention_vote_208_89_journal_1861.jpg';
const SLAVE_MAP = 'img/ch04/slave_population_map_coast_survey_1861.jpg';

/** The State House at Milledgeville (cropped to the engraving on the book page). */
const Convention: React.FC<{t: TL}> = ({t}) => (
  <>
  <Photo src={HOUSE} size={sizeOf(HOUSE)} fx={910} fy={1930} z0={1.32} z1={1.4} a={-10} b={t.at('The vote')} bw="grayscale(1) contrast(1.15) brightness(0.92)" vignette={0.6}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.8) 28%, rgba(0,0,0,0) 46%)'}} />
        <Note text="Milledgeville, Georgia · January 1861" x={110} y={700} size={50} rot={-2} at={t.at('January 1861') - 2} color={BONE} />
        <Note text="convention: a special meeting of delegates" x={110} y={800} size={50} rot={-2} at={t.at('a special') - 3} />
        <Note text="elected to make the decision" x={130} y={890} size={50} rot={-2} at={t.at('elected') - 3} />
      </>
    )}
  </Photo>
  <Tag text="State House, Milledgeville, engraving, in George White, Historical Collections of Georgia, 1854 · Internet Archive" x={44} y={40} />
  </>
);

/** The convention journal: "There are yeas 208; nays 89." */
const Vote: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('The vote') - 1;
  const w = 1150;
  const sc = w / sizeOf(VOTE)[0];
  return (
    <Desk a={a} push={0.02}>
      <Doc src={VOTE} x={740} y={560 - 3392 * sc} w={w} rot={1} at={a} push={[a, t.at('White men')]} fx={760} fy={3392} zoom={1.1}
        marks={[{at: t.at('208') - 2, ellipse: [770, 3392, 330, 66], seed: 4, width: 6}]} />
      <Stamp text="208 to 89" x={90} y={330} at={t.at('89') - 1} size={110} color={BONE} rot={-3} />
      <Note text="for secession" x={110} y={500} size={52} rot={-3} at={t.at('for secession') - 2} color={BONE} />
      <Note text="who chose the delegates?" x={80} y={700} size={44} rot={-3} at={t.at('who chose') - 3} />
      <Tag text="Journal of the Convention of the People of Georgia, Jan. 19, 1861 · Internet Archive" />
    </Desk>
  );
};

/** 100 Georgians: 56 free, 44 enslaved. White men chose the delegates. Which Georgians? */
const WhichGeorgians: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('White men') - 1;
  const en = t.at('enslaved');
  const cols = 10;
  const cw = 70;
  const rh = 78;
  const gx = 1110;
  const gy = 150;
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      <Img src={staticFile(SLAVE_MAP)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        filter: 'grayscale(1) contrast(1.15) brightness(0.32)', transform: `scale(${interpolate(g, [a, CH04_FRAMES], [1.04, 1.1], clamp)})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.65) 100%)'}} />
      {Array.from({length: 100}).map((_, i) => {
        const x = gx + (i % cols) * cw + cw / 2;
        const y = gy + Math.floor(i / cols) * rh + rh;
        const enslaved = i >= 56;
        const at = a + Math.floor(i / cols);
        return <Person key={i} x={x} y={y} h={64} at={at} hat={false} color={enslaved && g >= en ? 'rgba(237,231,220,0.55)' : BONE} dashed={enslaved && g >= en} />;
      })}
      <Note text="white men" x={110} y={110} size={56} rot={-3} at={t.at('White men') - 2} />
      <Note text="no women" x={110} y={210} size={56} rot={-3} at={t.at('No women') - 2} color={BONE} />
      <Note text="no one enslaved" x={110} y={310} size={56} rot={-3} at={t.at('no one who') - 2} color={BONE} />
      <Note text="enslaved: no say" x={1240} y={950} size={44} rot={-2} at={en + 4} color={BONE} />
      <Stamp text="44%" x={110} y={470} at={t.at('44')} size={220} color={BONE} rot={-3} />
      <Note text="of the people in the state" x={120} y={700} size={46} rot={-3} at={t.at('percent') + 2} color={BONE} />
      <Note text="almost half" x={120} y={790} size={56} rot={-3} at={t.at('Almost half') - 2} />
      <Note text="which Georgians?" x={110} y={900} size={70} rot={-3} at={t.at('which Georgians') - 2} color="#ffffff" />
      <Tag text="Map showing the distribution of the slave population, U.S. Coast Survey, 1861 · Library of Congress" x={44} y={40} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Convention t={t} />],
    [at('The vote') - 1, <Vote t={t} />],
    [at('White men') - 1, <WhichGeorgians t={t} />],
  ];
  const writes = ['January 1861', 'a special', 'elected', 'for secession', 'who chose', 'White men', 'No women', 'no one who', 'enslaved', 'percent', 'Almost half', 'which Georgians'];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {writes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume * 0.8} />)}
      <Sfx at={at('208') - 2} src="sfx/marker_tick.wav" volume={0.16} />
      <Sfx at={at('89') - 1} src="sfx/stamp.wav" volume={0.2} />
      <Sfx at={at('44')} src="sfx/stamp.wav" volume={0.2} />
      <Sfx at={at('White men')} src="sfx/tick_soft.wav" volume={0.3} />
    </>
  );
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_which_georgians.wav" lead={LEAD} quiet music={[{src: 'music/r_dix.mp3', volume: 0.13}]}>
    <Body />
  </ChapterShell>
);
