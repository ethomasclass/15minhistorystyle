// Chapter 4 · Waiting for a Victory: Greeley's open letter and Lincoln's public reply ("the Union comes first"); the
// draft already in his desk, "wait"; Antietam (22,700 in one day); Clara Barton and the women of the war; Lee gets
// away and McClellan is fired; five days after the battle, the preliminary Emancipation Proclamation.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch04_waiting.words.json';
import data from '../../public/maps/civwar1861.json';
import {Arrow, Highlight, Note, Tag} from '../kit/Kit';
import {Desk, DropCard, Sounds, SyncQuote} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {Box, CORAL, LETTER, LETTER_QUOTE, LETTER_TAG, READING, READING_TAG, WHITE} from '../kit/ff';
import {BORDER_1861, type Cam3, CONFEDERACY_1861, Count, MAP3D, Map3D, type MapData, PlaceTag, Route, Stake, Stand, StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {Backdrop, ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);
const D = data as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;

const GREELEY = 'img/ch04/greeley_portrait_hat_c1860s.jpg';
const DRAWER = 'img/gen/v2_ch04_desk_drawer.jpg';
const FORBES = 'img/ch04/charge_burnside_bridge_forbes_1862.jpg';
const BARTON_FIELD = 'img/gen/v2_ch04_barton_antietam.jpg';
const BARTON = 'img/ch04/clara_barton_portrait_c1870.jpg';
const DIX = 'img/ch04/dorothea_dix_portrait_c1861.jpg';
const SISTER = 'img/ch04/sister_ann_alexis_shorb_satterlee_nurse_1864.jpg';
const HOMER = 'img/ch04/our_women_and_the_war_homer_1862_right.jpg';
const DUNKER = 'img/ch04/dunker_church_antietam_1862.jpg';

/** August 1862: Horace Greeley's open letter scolds Lincoln for moving too slowly on slavery. */
const Greeley: React.FC<{t: TL}> = ({t}) => (
  <Desk a={-10}>
    <CropCard src={GREELEY} size={sizeOf(GREELEY)} x={170} y={130} w={560} h={760} fx={950} fy={1500} scale={0.42} rot={-2} at={t.at('Horace') - 2} mask={MASKS.greeley}
      traceAt={t.at('Horace') + 3} />
    <Note text="now: that letter" x={870} y={90} size={54} rot={-3} at={t.at('Now that') - 2} color={WHITE} />
    <Highlight text="AUGUST 1862" x={860} y={190} size={96} at={t.at('August 1862')} seed={401} rot={-2} />
    <Note text="Horace Greeley, newspaper editor" x={880} y={380} size={50} rot={-3} at={t.at('Horace') - 2} color={WHITE} />
    <Note text="an open letter to Lincoln:" x={880} y={490} size={52} rot={-3} at={t.at('an open letter') - 3} />
    <Note text="you're too slow on slavery" x={900} y={580} size={52} rot={-3} at={t.at('too slowly') - 3} />
    <Note text="a public callout" x={880} y={740} size={64} rot={-3} at={t.at('Basically') - 2} color={CORAL} />
    <Tag text="Horace Greeley, carte de visite, 1860s · Library of Congress" />
  </Desk>
);

/** Lincoln answers in public: "If I could save the Union..." Translation: the Union comes first. */
const Reply: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Lincoln answers') - 1;
  return (
    <Desk a={a}>
      <Doc src={LETTER} x={110} y={70} w={590} rot={-1.5} at={a + 1}
        marks={[{at: t.at('If I could') - 2, to: t.at('the slaves I would') + 30, swipe: LETTER_QUOTE}]} />
      <Note text="Lincoln answers, in public:" x={820} y={100} size={48} rot={-3} at={t.at('Lincoln answers') + 2} color={WHITE} />
      <SyncQuote t={t} phrase="If I could save the Union without freeing any slave I would do it" x={820} y={190} w={930} size={46} />
      <SyncQuote t={t} phrase="and if I could save it by freeing all the slaves I would do it" x={820} y={440} w={930} size={46} />
      <Note text="translation:" x={830} y={700} size={48} rot={-3} at={t.at('Translation') - 2} color={WHITE} />
      <Highlight text="THE UNION COMES FIRST" x={820} y={790} size={66} at={t.at('the Union comes')} seed={403} rot={-2} />
      <Tag text={LETTER_TAG} />
    </Desk>
  );
};

/** What readers didn't know: a month earlier Lincoln had already written a draft order. */
const Drawer: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={DRAWER} px={sizeOf(DRAWER)} fx={480} fy={420} a={t.at("But here's") - 1} b={t.at('His secretary')} z0={1.0} z1={1.08} fade={6}
    tag="Illustration · a draft in a desk drawer">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.88) 0%, rgba(10,9,7,0.55) 30%, rgba(0,0,0,0) 44%)'}} />
        <Note text="what readers didn't know:" x={130} y={80} size={54} rot={-3} at={t.at("But here's") + 2} color={WHITE} />
        <Note text="a month earlier" x={1000} y={80} size={54} rot={-3} at={t.at('A month earlier') - 3} color={WHITE} />
        <Note text="a draft order freeing enslaved people" x={130} y={190} size={54} rot={-3} at={t.at('a draft') - 3} />
        <Note text="in the rebel states" x={1180} y={190} size={54} rot={-3} at={t.at('rebel states') - 3} />
      </>
    )}
  </Engraving>
);

/** His secretary of state: wait. After these defeats it would look desperate. He needed a victory. */
const Wait: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={READING} px={sizeOf(READING)} fx={1500} fy={1050} a={t.at('His secretary') - 1} b={t.at('He got one')} z0={1.12} z1={1.18} fade={6}
    mask={MASKS.lincoln_reading} traceAt={t.at('His secretary') + 4} tag={READING_TAG}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.4) 20%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 62%, rgba(10,9,7,0.88) 82%)'}} />
        <Note text="his secretary of state:" x={130} y={80} size={54} rot={-3} at={t.at('His secretary') + 2} color={WHITE} />
        <Highlight text="WAIT." x={920} y={60} size={100} at={t.at('wait')} seed={405} rot={-2} />
        <Note text="announce it after all these defeats? desperate" x={130} y={760} size={50} rot={-2} at={t.at('Announce') - 2} color={WHITE} />
        <Note text="a last-second shot from half court" x={140} y={860} size={50} rot={-2} at={t.at('last-second') - 3} />
        <Note text="he needed a victory" x={1150} y={880} size={58} rot={-3} at={t.at('He needed') - 3} color={CORAL} />
      </>
    )}
  </Engraving>
);

/** He got one, sort of: September 17, 1862, Antietam Creek, Maryland. Lee has invaded the North. */
const Antietam: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('He got one') - 1;
  const keys: Cam3[] = [{f: a, x: 3700, y: 1900, z: 0.85, tilt: 38, rot: -4}, {f: t.at('In one day'), x: 3720, y: 1820, z: 1.05, tilt: 46, rot: -8}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.7} rivers={0.9}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-99} stagger={0} h={2} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={-99} stagger={0} h={2} color={MAP3D.grey} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={-99} stagger={0} h={2} color={CORAL} />
            <Route api={api} pts={[[3640, 2010], [3700, 1880], pl.antietam]} at={t.at('Lee has') - 2} dur={24} color="#FF9F1C" width={10} bow={0.08} />
            <Stand api={api} at={pl.antietam} show={t.at('Antietam') - 2}><Stake /></Stand>
            <Stand api={api} at={[pl.antietam[0] - 260, pl.antietam[1] - 60]} z={80} show={t.at('Antietam')}><PlaceTag text="Antietam Creek, Maryland" size={34} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="he got one... sort of" x={130} y={90} size={54} rot={-2} at={t.at('He got one') + 2} color={WHITE} />
        <Highlight text="SEPT. 17, 1862" x={130} y={190} size={90} at={t.at('September 17th')} seed={407} rot={-2} />
        <Note text="Lee has invaded the North" x={130} y={850} size={58} rot={-2} at={t.at('Lee has') - 3} color={CORAL} />
        <Tag text="Map · Maryland and Virginia, September 1862" />
      </AbsoluteFill>
    </>
  );
};

/** In one day, about 22,700 men killed, wounded, captured or missing: still the bloodiest single day. */
const Toll: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={FORBES} px={sizeOf(FORBES)} fx={1500} fy={1150} a={t.at('In one day') - 1} b={t.at('On that field')} z0={1.08} z1={1.16} fade={6}
    tag="Edwin Forbes, the charge across the Burnside Bridge, Antietam, Sept. 17, 1862 · Library of Congress">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.88) 0%, rgba(10,9,7,0.55) 34%, rgba(0,0,0,0) 48%, rgba(0,0,0,0) 70%, rgba(10,9,7,0.85) 90%)'}} />
        <Note text="in one day:" x={130} y={80} size={54} rot={-3} at={t.at('In one day') + 2} color={WHITE} />
        <div style={{position: 'absolute', left: 130, top: 170}}><Count to={22700} at={t.at('22,700') - 2} dur={30} prefix="about " size={110} color={CORAL} /></div>
        <Note text="killed, wounded, captured or missing" x={130} y={330} size={52} rot={-2} at={t.at('killed') - 3} color={WHITE} />
        <Note text="still the bloodiest single day in American history" x={130} y={880} size={54} rot={-2} at={t.at('bloodiest') - 3} />
      </>
    )}
  </Engraving>
);

/** On that field, Clara Barton, a former government clerk, hauled in supplies and nursed the wounded under fire. */
const Barton: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={BARTON_FIELD} px={sizeOf(BARTON_FIELD)} fx={600} fy={420} a={t.at('On that field') - 1} b={t.at('She was one')} z0={1.0} z1={1.07} fade={6}
    tag="Illustration · Clara Barton brings supplies to the wounded, Antietam, 1862">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.5) 26%, rgba(0,0,0,0) 40%)'}} />
        <Note text="a former government clerk" x={130} y={80} size={52} rot={-3} at={t.at('former government') - 3} color={WHITE} />
        <Highlight text="CLARA BARTON" x={900} y={70} size={96} at={t.at('Clara Barton')} seed={409} rot={-2} />
        <Note text="hauled in supplies, nursed the wounded under fire" x={130} y={190} size={52} rot={-2} at={t.at('hauled in') - 3} />
      </>
    )}
  </Engraving>
);

/** Thousands of women nurses; Dorothea Dix; about 600 Catholic sisters; farms, businesses, spies. */
const Women: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('She was one') - 1;
  const d = t.at('Dorothea') - 2;
  const s = t.at('About 600') - 2;
  const o = t.at('Other women') - 2;
  return (
    <Desk a={a}>
      <CropCard src={BARTON} size={sizeOf(BARTON)} x={110} y={110} w={360} h={470} fx={1150} fy={1350} scale={0.25} rot={-2} at={a + 1} mask={MASKS.barton} traceAt={a + 5} />
      <CropCard src={DIX} size={sizeOf(DIX)} x={560} y={130} w={360} h={470} fx={1050} fy={1500} scale={0.22} rot={2} at={d} mask={MASKS.dix} traceAt={d + 5} />
      <CropCard src={SISTER} size={sizeOf(SISTER)} x={1010} y={110} w={360} h={470} fx={940} fy={1550} scale={0.17} rot={-1.5} at={s} />
      <CropCard src={HOMER} size={sizeOf(HOMER)} x={1450} y={130} w={360} h={470} fx={1300} fy={4000} scale={0.2} rot={2} at={o} />
      <Note text="thousands of" x={130} y={660} size={44} rot={-3} at={t.at('thousands of women') - 3} color={WHITE} />
      <Note text="women nurses" x={130} y={740} size={44} rot={-3} at={t.at('as nurses') - 3} color={WHITE} />
      <Note text="Dorothea Dix ran" x={560} y={660} size={44} rot={-3} at={d + 2} />
      <Note text="the army nurses" x={570} y={740} size={44} rot={-3} at={d + 8} />
      <Note text="~600 Catholic" x={1010} y={660} size={44} rot={-3} at={s + 2} color={WHITE} />
      <Note text="sisters, both sides" x={1010} y={740} size={42} rot={-3} at={t.at('both sides') - 3} color={WHITE} />
      <Note text="farms, businesses" x={1420} y={660} size={38} rot={-3} at={o + 2} />
      <Note text="and some spies" x={1430} y={740} size={38} rot={-3} at={t.at('spies') - 3} color={CORAL} />
      <Tag text="Clara Barton · Dorothea Dix · Sister Ann Alexis Shorb · Winslow Homer, Our Women and the War, Harper's Weekly, 1862 · Library of Congress, Internet Archive" />
    </Desk>
  );
};

/** Lee retreats; McClellan lets him get away; Lincoln fires him that November. */
const Fired: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Lee retreats') - 1;
  return (
    <Desk a={a}>
      <DropCard src={DUNKER} x={110} y={150} w={820} rot={-2} at={a + 2} />
      <Note text="Lee retreats" x={1020} y={150} size={58} rot={-3} at={t.at('Lee retreats') + 2} color={WHITE} />
      <Note text="McClellan lets him get away" x={1020} y={270} size={50} rot={-3} at={t.at('McClellan lets') - 3} />
      <Highlight text="FIRED" x={1010} y={420} size={120} at={t.at('fires him')} seed={411} rot={-3} />
      <Note text="November 1862" x={1030} y={630} size={56} rot={-3} at={t.at('that November') - 3} color={WHITE} />
      <Tag text="Alexander Gardner, Dunker Church, Antietam battlefield, 1862 · Library of Congress" />
    </Desk>
  );
};

/** Five days after the battle: the preliminary Emancipation Proclamation, an advance warning. Rejoin by January 1st. */
const Preliminary: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("But it's enough") - 1;
  return (
    <Desk a={a}>
      <Backdrop src={FORBES} size={sizeOf(FORBES)} a={a} dim={0.24} side="left" />
      <Note text="but it's enough" x={130} y={80} size={54} rot={-3} at={t.at("But it's enough") + 2} color={WHITE} />
      <Note text="Lincoln announces a preliminary" x={130} y={180} size={52} rot={-3} at={t.at('Lincoln announces') - 3} />
      <Highlight text="EMANCIPATION PROCLAMATION" x={130} y={280} size={70} at={t.at('Emancipation Proclamation')} seed={413} rot={-2} />
      <Definition term="pre·lim·i·nar·y" def="an advance warning" at={t.at('an advance') - 2} x={130} y={430} w={900} />
      <Note text="rejoin the Union by January 1st..." x={130} y={600} size={54} rot={-3} at={t.at('rejoin') - 3} color={WHITE} />
      <Note text="or the enslaved people in your state" x={130} y={710} size={52} rot={-3} at={t.at('or the enslaved') - 3} color={CORAL} />
      <Note text="will be declared free" x={150} y={810} size={62} rot={-3} at={t.at('declared free') - 3} color={CORAL} />
      <Box x={1360} y={130} w={360} h={200} at={t.at('Five days') - 2} label="+5 DAYS" size={64} seed={13} color="#f4efe6" />
      <Note text="after the battle" x={1390} y={350} size={44} rot={-3} at={t.at('after the battle') - 3} color={WHITE} />
      <Arrow x1={1540} y1={430} x2={1540} y2={560} bow={20} at={t.at('rejoin') - 2} />
      <Box x={1360} y={590} w={360} h={200} at={t.at('January 1st') - 2} label="JAN. 1" size={72} seed={15} color={CORAL} />
      <Tag text="Edwin Forbes, the charge across the Burnside Bridge, Antietam, 1862 · Library of Congress" />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Greeley t={t} />],
    [at('Lincoln answers') - 1, <Reply t={t} />],
    [at("But here's") - 1, <Drawer t={t} />],
    [at('His secretary') - 1, <Wait t={t} />],
    [at('He got one') - 1, <Antietam t={t} />],
    [at('In one day') - 1, <Toll t={t} />],
    [at('On that field') - 1, <Barton t={t} />],
    [at('She was one') - 1, <Women t={t} />],
    [at('Lee retreats') - 1, <Fired t={t} />],
    [at("But it's enough") - 1, <Preliminary t={t} />],
  ];
  const writes = ['Now that', 'Horace', 'an open letter', 'too slowly', 'Basically', 'Lincoln answers', 'Translation', "But here's", 'A month earlier', 'a draft', 'rebel states',
    'His secretary', 'Announce', 'last-second', 'He needed', 'He got one', 'Lee has', 'In one day', 'killed', 'bloodiest', 'former government', 'hauled in', 'thousands of women',
    'as nurses', 'Dorothea', 'About 600', 'both sides', 'Other women', 'spies', 'Lee retreats', 'McClellan lets', 'that November', "But it's enough", 'Lincoln announces', 'rejoin',
    'or the enslaved', 'declared free', 'after the battle'].map((p) => at(p));
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map(([f]) => f)} stamps={[at('August 1862'), at('the Union comes'), at('wait'), at('September 17th'), at('Clara Barton'), at('fires him'),
        at('Emancipation Proclamation')]} writes={writes} ticks={[at('Antietam') - 2, at('Five days') - 2, at('January 1st') - 2, at('Dorothea') - 2, at('About 600') - 2, at('Other women') - 2]}
        extra={[{at: at('22,700') - 2, src: 'sfx/boom.wav', volume: 0.22}, {at: at('Lincoln answers') - 1, src: 'sfx/page_turn.wav', volume: 0.35}]} />
    </>
  );
};

// g_grip (70 s) comes in under the letter's "Translation" so its dark final chord lands at the chapter's end.
export const Ch04: React.FC = () => {
  const t = makeTimeline(N, 30);
  return (
    <ChapterShell n={N} audio="audio/ch04_waiting.wav" lead={LEAD} music={[{src: 'music/g_grip.mp3', volume: 0.093, from: t.at('Translation') - 6}]}>
      <Body />
    </ChapterShell>
  );
};
