// Chapter 5 · Forever Free (quiet chapter): January 1, 1863, "are, and henceforward shall be free"; what it leaves out
// (the border states, Union-held areas; the coverage map); why (war powers, the property logic); few freed on day one;
// but it changed what the war was for, and opened the army to Black men.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch05_forever_free.words.json';
import data from '../../public/maps/civwar1861.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {Desk, Sounds, SyncQuote} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {Box, CORAL, NARA, NARA_TAG, U, WHITE} from '../kit/ff';
import {BORDER_1861, type Cam3, CONFEDERACY_1861, Hand, MAP3D, Map3D, type MapData, RegionName, Slab, Stand, StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {Backdrop, ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);
const D = data as unknown as MapData;

const WRITING = 'img/ch05/lincoln_writing_proclamation_ehrgott_1863.jpg';
const POP_MAP = 'img/ch05/slave_population_map_hergesheimer_1861.jpg';
const EFFECTS = 'img/ch05/effects_of_proclamation_freed_people_entering_lines_1863.jpg';
const SAXTON = 'img/ch05/emancipation_day_south_carolina_1863.jpg';
/** "are, and hence- / forward shall be free" on page 3 of the original (source pixels). */
const FREE_LINES: [number, number, number, number][] = [[1270, 2622, 1740, 2706], [250, 2712, 1130, 2794]];

/** January 1st, 1863: the Proclamation takes effect. */
const Jan1: React.FC<{t: TL}> = ({t}) => (
  <Desk a={-10}>
    <Doc src={NARA(1)} x={140} y={60} w={580} rot={-1.5} at={-8} />
    <Highlight text="JANUARY 1, 1863" x={860} y={160} size={80} at={t.at('January 1st')} seed={501} rot={-2} />
    <Note text="the Proclamation takes effect" x={880} y={340} size={52} rot={-3} at={t.at('takes effect') - 3} color={WHITE} />
    <Tag text={`${NARA_TAG}, page 1`} />
  </Desk>
);

/** It declares that enslaved people in areas still in rebellion "are, and henceforward shall be free." */
const Free: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('It declares') - 1;
  const s0 = t.at('are and') - 2;
  const s1 = t.at('be free') + 6;
  const widths = FREE_LINES.map(([x0, , x1]) => x1 - x0);
  const total = widths[0] + widths[1];
  const done = interpolate(g, [s0, s1], [0, total], clamp);
  return (
    <Desk a={a}>
      <CropCard src={NARA(3)} size={sizeOf(NARA(3))} x={120} y={150} w={760} h={700} fx={1000} fy={2300} scale={0.5} rot={-1.5} at={a + 1}>
        {(S) => (
          <>
            {FREE_LINES.map(([x0, y0, x1, y1], k) => {
              const len = Math.max(0, Math.min(widths[k], done - (k ? widths[0] : 0)));
              if (len <= 0) return null;
              const [l, tp] = S(x0, y0);
              const [r, bt] = S(x0 + len, y1);
              return <div key={k} style={{position: 'absolute', left: l, top: tp, width: r - l, height: bt - tp, background: pal.mark, opacity: 0.5, mixBlendMode: 'multiply', borderRadius: 4}} />;
            })}
          </>
        )}
      </CropCard>
      <Note text="enslaved people in the areas" x={960} y={130} size={50} rot={-3} at={t.at('It declares') + 4} color={WHITE} />
      <Note text="still in rebellion" x={980} y={220} size={50} rot={-3} at={t.at('still in rebellion') - 3} color={WHITE} />
      <SyncQuote t={t} phrase="are, and henceforward shall be free" x={960} y={420} w={860} size={68} />
      <Tag text={`${NARA_TAG}, page 3`} />
    </Desk>
  );
};

/** What it leaves out: the border states, and the parts of the South the Union army already held. */
const LeftOut: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Now look') - 1;
  const b = t.at('border states');
  const h = t.at('parts of') - 2;
  const keys: Cam3[] = [{f: a, x: 2700, y: 2750, z: 0.38, tilt: 34, rot: 0}, {f: t.at('Why do'), x: 2700, y: 2800, z: 0.42, tilt: 42, rot: -4}];
  const covered = CONFEDERACY_1861.filter((s) => !U(['Tennessee', 'West Virginia']).includes(s));
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.3}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-99} stagger={0} h={14} color={MAP3D.free} />
            <StateTiles api={api} names={covered} at={a + 2} stagger={1} h={46} color={CORAL} hatch="rgba(255,255,255,0.35)" />
            <StateTiles api={api} names={BORDER_1861} at={b - 2} stagger={2} h={22} color={MAP3D.grey} />
            <StateTiles api={api} names={U(['Tennessee', 'West Virginia'])} at={h} stagger={4} h={22} color={MAP3D.grey} />
            {(['exemptLouisiana', 'exemptVaTidewater', 'exemptVaShore'] as const).map((r, i) => (
              <Slab key={r} api={api} region={r} at={h + 8 + i * 4} h={62} color={MAP3D.grey} layers={6} />
            ))}
            <Stand api={api} at={[2650, 3150]} z={60} show={a + 10}><RegionName text="COVERED" size={110} color="#f4efe6" /></Stand>
            <Stand api={api} at={[2350, 2330]} z={50} show={b + 6}><Hand text="not covered" size={80} color="#f4efe6" rot={0} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="now: what it leaves out" x={130} y={80} size={54} rot={-2} at={t.at('Now look') + 2} color={WHITE} />
        <Note text="✗ the border states (remember them?)" x={130} y={180} size={50} rot={-2} at={b - 3} color={WHITE} />
        <Note text="✗ parts of the South the Union army already held" x={130} y={860} size={50} rot={-2} at={h} color={WHITE} />
        <Tag text="Map · what the Emancipation Proclamation covered, January 1, 1863 (grey: not covered)" />
      </AbsoluteFill>
    </>
  );
};

/** Why do it that way? War powers, as commander in chief. */
const WarPowers: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={WRITING} px={sizeOf(WRITING)} fx={1500} fy={1250} a={t.at('Why do') - 1} b={t.at("Here's the logic")} z0={1.1} z1={1.16} fade={6} quiet
    tag="Lincoln writing the Proclamation of Freedom, January 1st, 1863, lithograph · Library of Congress">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.88) 0%, rgba(10,9,7,0.55) 34%, rgba(0,0,0,0) 48%)'}} />
        <Note text="why do it that way?" x={130} y={80} size={54} rot={-3} at={t.at('Why do') + 2} color={WHITE} />
        <Highlight text="WAR POWERS" x={700} y={70} size={96} at={t.at('war powers')} seed={503} rot={-2} />
        <Definition term="war pow·ers" def="what a president can do as commander in chief to win a war" at={t.at('as commander') - 2} x={130} y={230} w={1300} />
      </>
    )}
  </Engraving>
);

/** The logic: the law treated enslaved people as property; a commander in chief can take enemy property. */
const Logic: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("Here's the logic") - 1;
  return (
    <Desk a={a}>
      <Backdrop src={NARA(2)} size={sizeOf(NARA(2))} a={a} dim={0.26} fy={1500} tag={`${NARA_TAG}, page 2`} />
      <Note text="here's the logic:" x={130} y={90} size={56} rot={-3} at={t.at("Here's the logic") + 2} color={WHITE} />
      <Box x={140} y={250} w={460} h={240} at={t.at('The law treated') - 2} label="the law: enslaved people as “property”" size={42} seed={21} color="#f4efe6" />
      <Arrow x1={610} y1={370} x2={700} y2={370} bow={10} at={t.at('and a commander') - 2} />
      <Box x={720} y={250} w={460} h={240} at={t.at('and a commander') - 2} label="a commander in chief can take enemy property" size={42} seed={23} />
      <Arrow x1={1190} y1={370} x2={1290} y2={370} bow={10} at={t.at('So the order') - 2} />
      <Box x={1300} y={250} w={460} h={240} at={t.at('So the order') - 2} label="so it can reach the enemy" size={42} seed={25} />
      <Note text="but not the loyal states" x={1060} y={540} size={52} rot={-3} at={t.at('but not the loyal') - 3} color={CORAL} />
      <Note text="and trying might have cost him those states" x={130} y={780} size={58} rot={-2} at={t.at('And trying') - 3} color={WHITE} />
    </Desk>
  );
};

/** On the first day it freed relatively few people: most places it covered were still under Confederate control. */
const FewFreed: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('So on the first') - 1;
  return (
    <Desk a={a}>
      <Doc src={POP_MAP} x={130} y={130} w={900} rot={-1} at={a + 1} />
      <Note text="day one:" x={1120} y={150} size={54} rot={-3} at={t.at('So on the first') + 2} color={WHITE} />
      <Note text="relatively few freed" x={1120} y={250} size={52} rot={-3} at={t.at('relatively few') - 3} color={CORAL} />
      <Note text="most of the places it covered:" x={1120} y={430} size={42} rot={-3} at={t.at('Most of the') - 3} color={WHITE} />
      <Note text="still under" x={1130} y={530} size={52} rot={-3} at={t.at('still under') - 3} />
      <Note text="Confederate control" x={1130} y={620} size={52} rot={-3} at={t.at('Confederate control') - 3} />
      <Tag text="Map showing the distribution of the slave population of the Southern states, U.S. Coast Survey, 1861 · Library of Congress" />
    </Desk>
  );
};

/** But it changed what the war was for: wherever the Union army marched, freedom marched with it. */
const Changed: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={EFFECTS} px={sizeOf(EFFECTS)} fx={1500} fy={1250} a={t.at('But it changed') - 1} b={t.at('And the Proclamation')} z0={1.08} z1={1.16} fade={6} quiet
    tag="The effects of the Proclamation: freed people coming into the Union lines, New Bern, N.C., Harper's Weekly, 1863 · Library of Congress">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.4) 22%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 66%, rgba(10,9,7,0.88) 86%)'}} />
        <Note text="but it changed what the war was for" x={130} y={80} size={62} rot={-2} at={t.at('But it changed') + 2} color={WHITE} />
        <Note text="wherever the Union army marched," x={130} y={780} size={56} rot={-2} at={t.at('wherever') - 3} color={WHITE} />
        <Note text="freedom marched with it" x={160} y={880} size={60} rot={-2} at={t.at('freedom marched') - 3} />
      </>
    )}
  </Engraving>
);

/** And the Proclamation opened the Union army to Black men on a large scale. */
const Army: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={SAXTON} px={sizeOf(SAXTON)} fx={1500} fy={1100} a={t.at('And the Proclamation') - 1} b={CH05_FRAMES} z0={1.1} z1={1.18} fade={6} quiet
    tag="Emancipation Day at Camp Saxton, S.C.: the 1st South Carolina Volunteers, Frank Leslie's, Jan. 24, 1863 · Library of Congress">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.88) 0%, rgba(10,9,7,0.5) 26%, rgba(0,0,0,0) 38%)'}} />
        <Note text="and it opened the Union army" x={130} y={80} size={58} rot={-2} at={t.at('opened') - 3} color={WHITE} />
        <Note text="to Black men, on a large scale" x={150} y={180} size={58} rot={-2} at={t.at('Black men') - 3} />
      </>
    )}
  </Engraving>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Jan1 t={t} />],
    [at('It declares') - 1, <Free t={t} />],
    [at('Now look') - 1, <LeftOut t={t} />],
    [at('Why do') - 1, <WarPowers t={t} />],
    [at("Here's the logic") - 1, <Logic t={t} />],
    [at('So on the first') - 1, <FewFreed t={t} />],
    [at('But it changed') - 1, <Changed t={t} />],
    [at('And the Proclamation') - 1, <Army t={t} />],
  ];
  const writes = ['takes effect', 'It declares', 'still in rebellion', 'Now look', 'border states', 'parts of', 'Why do', "Here's the logic", 'but not the loyal', 'And trying',
    'So on the first', 'relatively few', 'Most of the', 'still under', 'But it changed', 'wherever', 'freedom marched', 'opened', 'Black men'].map((p) => at(p));
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map(([f]) => f)} stamps={[at('January 1st'), at('war powers')]} writes={writes}
        ticks={[at('The law treated') - 2, at('and a commander') - 2, at('So the order') - 2]} extra={[{at: at('It declares') - 1, src: 'sfx/page_turn.wav', volume: 0.3}]} />
    </>
  );
};

export const Ch05: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch05_forever_free.wav" lead={LEAD} quiet music={[{src: 'music/r_curtain.mp3', volume: 0.062}]}>
    <Body />
  </ChapterShell>
);
