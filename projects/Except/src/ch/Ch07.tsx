// Chapter 7 · Except (quiet): why the amendment, the votes (Senate 38 to 6, House 119 to 56), ratification and Georgia,
// slavery over, then "read it again": the exception, the Black Codes (Mississippi's vagrancy law, hired out), convict
// leasing. Quiet palette: teal lines, bone titles, no coral, no jokes, long holds.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import mapData from '../../public/maps/civwar1861.json';
import words from '../../public/audio/ch07_except.words.json';
import {Highlight, Note, Tag, useGFrame} from '../kit/Kit';
import {Sfx, WRITE} from '../kit/common';
import {Desk} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {AMEND, AMEND_TAG, BONE, Chain, exceptSwipe, SixWords, WHITE} from '../kit/except';
import {BORDER_1861, type Cam3, CONFEDERACY_1861, Hand, MAP3D, Map3D, type MapData, Slab, Stand, StateTiles, UNION_FREE_1861, Count} from '../kit/map3d';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

const D = mapData as unknown as MapData;
const QUIET = 'grayscale(1) contrast(1.12) brightness(0.9)';
const HOUSE = 'img/ch07/house_scene_passage_amendment_1865.jpg';
const CELEBRATION = 'img/ch06/emancipation_celebration_dc_1866.jpg';
const VAGRANT1 = 'img/ch07/mississippi_vagrant_law_1865_fleming_1906_p1.jpg';
const VAGRANT2 = 'img/ch07/mississippi_vagrant_law_1865_fleming_1906_p2.jpg';
const SEC7 = 'img/ch07/mississippi_civil_rights_of_freedmen_1865_fleming_1906.jpg';
const HIRED = 'img/gen/v3_ch07_hired_out.jpg';
const CHAIN = 'img/ch07/chain_gang_thomasville_georgia_c1890.jpg';
const FLEMING_TAG = 'Mississippi vagrant law, 1865, reprinted in Fleming, Documentary History of Reconstruction, 1906 · Internet Archive';

/** Now the amendment; why: the Proclamation was a war measure and didn't reach the border states. */
const WarMeasure: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Remember') - 1;
  const keys: Cam3[] = [{f: -10, x: 2900, y: 2350, z: 0.38, tilt: 32, rot: 0}, {f: t.at('To end'), x: 2950, y: 2250, z: 0.42, tilt: 38, rot: -4}];
  const border = t.at('border states') - 2;
  return (
    <>
      <Map3D data={D} keys={keys} states={0.5} rivers={0.4}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={12} color={MAP3D.free} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={-20} stagger={0} h={22} color={MAP3D.grey} />
            <StateTiles api={api} names={BORDER_1861} at={border} stagger={2} h={46} color={BONE} />
            <Stand api={api} at={[3200, 1950]} z={70} show={border + 6}><Hand text="not reached: the border states" size={56} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.82) 0%, rgba(0,0,0,0) 34%)'}} />
        <Note text="now, the amendment" x={110} y={80} size={50} rot={-3} at={-6} color={WHITE} />
        {/* the war measure line appears once the narrator gets there */}
        <Note text="the Emancipation Proclamation: a war measure" x={130} y={190} size={48} rot={-3} at={a + 4} />
        <Note text="once the war ended, a court might say it ended too" x={130} y={900} size={46} rot={-2} at={t.at('once the war') - 2} color={WHITE} />
        <Tag text="Map · the border states, 1865" x={44} y={1030} />
      </AbsoluteFill>
    </>
  );
};

/** To end slavery for good: into the Constitution. The votes. */
const Votes: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('To end') - 1;
  const house = t.at('The House');
  return (
    <Desk a={a} push={0.02}>
      <Doc src={AMEND} x={1300} y={110} w={480} rot={2} at={a + 1} out={house} />
      <Doc src={HOUSE} x={1180} y={90} w={620} rot={2} at={house - 1} push={[house, t.at('Then threefourths')]} fx={1200} fy={1700} zoom={1.1} />
      <Note text="to end slavery for good: into the Constitution" x={150} y={100} size={46} rot={-3} at={a + 2} out={house} color={WHITE} />
      <Note text="the Senate, April 1864" x={130} y={240} size={50} rot={-3} at={t.at('The Senate') - 2} />
      <Stamp text="38 to 6" x={130} y={330} at={t.at('38') - 1} size={130} color={BONE} rot={-3} />
      <Note text="the House took longer: January 31, 1865" x={130} y={560} size={46} rot={-3} at={t.at('It finally') - 2} />
      <Stamp text="119 to 56" x={130} y={650} at={t.at('119') - 1} size={130} color={BONE} rot={-3} />
      <Note text="the visitors' gallery cheered" x={150} y={880} size={52} rot={-3} at={t.at('gallery') - 2} color={WHITE} />
      <Tag text="Scene in the House on the passage of the amendment, January 31, 1865, Harper's Weekly · Library of Congress" x={44} y={1030} />
    </Desk>
  );
};

/** Three-fourths of the states had to ratify. Georgia put it over the top. */
const Ratify: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Then threefourths') - 1;
  const ga = t.at('was Georgia');
  const keys: Cam3[] = [{f: a, x: 2900, y: 2300, z: 0.4, tilt: 34, rot: 0}, {f: ga + 30, x: 2900, y: 2700, z: 0.7, tilt: 42, rot: -4}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.5} rivers={0.3}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={-20} stagger={0} h={12} color={MAP3D.free} />
            <StateTiles api={api} names={BORDER_1861} at={-20} stagger={0} h={12} color={MAP3D.free} />
            <StateTiles api={api} names={CONFEDERACY_1861.filter((s) => s !== 'USA:Georgia')} at={-20} stagger={0} h={12} color={MAP3D.grey} />
            <StateTiles api={api} names={['USA:Georgia']} at={-20} stagger={0} h={12} color={MAP3D.grey} />
            <Slab api={api} d={D.states['USA:Georgia']} clipLand={false} at={ga - 2} h={60} color={BONE} layers={8} />
            <Stand api={api} at={[2700, 3150]} z={90} show={ga + 2}><Hand text="Georgia · December 6, 1865" size={58} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.82) 0%, rgba(0,0,0,0) 36%)'}} />
        <Note text="then three-fourths of the states had to" x={110} y={80} size={44} rot={-3} at={a + 2} color={WHITE} />
        <Highlight text="RATIFY" x={120} y={190} size={84} at={t.at('ratify')} seed={71} rot={-2} />
        <Definition term="rat·i·fy" def="approve" at={t.at('or approve') - 1} x={560} y={210} w={420} />
        <Note text="the state that put it over the top:" x={960} y={330} size={40} rot={-3} at={t.at('The state') - 2} color={WHITE} />
        <Highlight text="GEORGIA" x={980} y={430} size={84} at={ga} seed={74} rot={-2} />
        <Tag text="Map · the states, December 1865" x={44} y={1030} />
      </AbsoluteFill>
    </>
  );
};

/** Slavery was over: nearly 4 million people legally free. */
const Over: React.FC<{t: TL}> = ({t}) => (
  <Photo src={CELEBRATION} size={sizeOf(CELEBRATION)} fx={1000} fy={2150} z0={1.5} z1={1.58} a={t.at('Slavery was') - 1} b={t.at('But read')} bw={QUIET}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.5) 28%, rgba(0,0,0,0) 44%)'}} />
        <Note text="slavery was over in the United States" x={130} y={100} size={56} rot={-3} at={t.at('Slavery was') + 1} color={WHITE} />
        <Note text="nearly 4 million people once enslaved: legally free" x={150} y={220} size={48} rot={-3} at={t.at('nearly 4') - 2} />
        <Tag text="Celebration of the abolition of slavery in the District of Columbia, April 19, 1866, Harper's Weekly · Library of Congress" />
      </>
    )}
  </Photo>
);

/** But read it again: the six words. */
const ReadAgain: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('But read') - 1;
  const w = 1700;
  const sc = w / sizeOf(AMEND)[0];
  return (
    <Desk a={a} push={0.02}>
      <Doc src={AMEND} x={110} y={480 - 1530 * sc} w={w} rot={-1} at={a} push={[a, t.at('Even before')]} fx={720} fy={1560} zoom={1.1} marks={[exceptSwipe(t.at('Except') - 2, t.end('crime'))]} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.95) 0%, rgba(10,9,7,0.85) 26%, rgba(0,0,0,0) 44%)'}} />
      <Note text="but read it again" x={130} y={760} size={54} rot={-3} at={a + 2} color={WHITE} />
      <SixWords x={120} y={870} at={t.at('Except')} size={70} />
      <Tag text={AMEND_TAG} x={44} y={40} />
    </Desk>
  );
};

/** The Black Codes. */
const BlackCodes: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Even before') - 1;
  const w = 600;
  return (
    <Desk a={a} push={0.02}>
      <Doc src={VAGRANT1} x={1180} y={-260} w={w} rot={2} at={a + 2} push={[a, t.at('In Mississippi')]} fx={920} fy={2948} zoom={1.08}
        marks={[{at: t.at('aimed') , box: [520, 2915, 1310, 2980], seed: 7}]} />
      <Note text="even before the amendment was ratified" x={150} y={110} size={48} rot={-3} at={a + 2} color={WHITE} />
      <Note text="Southern states began passing" x={130} y={220} size={48} rot={-3} at={t.at('Southern states') - 2} color={WHITE} />
      <Highlight text="BLACK CODES" x={130} y={350} size={110} at={t.at('Black Codes')} seed={72} rot={-2} />
      <Definition term="Black Codes" def="laws aimed only at Black Americans" at={t.at('laws aimed') - 1} x={140} y={560} w={820} />
      <Tag text={FLEMING_TAG} />
    </Desk>
  );
};

/** In Mississippi: no job, arrested, fined, can't pay, hired out. */
const Vagrancy: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('In Mississippi') - 1;
  const hire = t.at('hired out');
  return (
    <Desk a={a} push={0.02}>
      <Chain x={170} y={110} w={280} h={140} gap={50} size={48} links={[
        {label: 'no job', at: t.at('without a job') - 2},
        {label: 'arrested', at: t.at('arrested') - 2},
        {label: 'fined', at: t.at('fined') - 2},
        {label: "can't pay", at: t.at("couldn't pay") - 2},
        {label: 'hired out', at: hire - 2, color: BONE},
      ]} />
      <Doc src={VAGRANT2} x={190} y={330} w={720} rot={-2} at={a + 1}
        marks={[{at: t.at('without a job'), to: t.at('arrested'), swipe: [[1577, 1575, 2100, 1640], [431, 1652, 670, 1715]]}, {at: t.at('fined') - 2, underline: [1700, 2100, 2152]}]} />
      <Doc src={SEC7} x={1040} y={360} w={720} rot={2} at={hire - 3}
        marks={[{at: hire, to: t.end('the fine'), swipe: [[1295, 1040, 2205, 1104], [451, 1114, 2205, 1178]]}]} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.95) 0%, rgba(10,9,7,0.75) 14%, rgba(0,0,0,0) 26%)'}} />
      <Note text="Mississippi, 1865" x={200} y={870} size={46} rot={-2} at={a + 2} color={WHITE} />
      <Note text="to work for whoever paid the fine" x={1000} y={870} size={40} rot={-2} at={t.at('whoever') - 2} />
      <Tag text={FLEMING_TAG} x={44} y={30} />
    </Desk>
  );
};

/** The exception, at work: back to forced work. */
const Exception: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={HIRED} px={sizeOf(HIRED)} fx={700} fy={380} a={t.at('Arrest someone') - 1} b={t.at('Later')} z0={1.0} z1={1.07} fade={6} quiet
    mask={MASKS.hired_man} traceAt={t.at('forced') - 2} tag="Illustration · a freedman hired out to pay a fine, Mississippi, 1866">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.82) 0%, rgba(10,9,7,0.45) 24%, rgba(0,0,0,0) 38%)'}} />
        <Note text="arrest someone for a crime," x={110} y={80} size={52} rot={-3} at={t.at('Arrest someone') + 1} color={WHITE} />
        <Note text="and that exception could put them back to forced work" x={130} y={200} size={46} rot={-2} at={t.at('that exception') - 2} />
      </>
    )}
  </Engraving>
);

/** Convict leasing. */
const Leasing: React.FC<{t: TL}> = ({t}) => (
  <Photo src={CHAIN} size={sizeOf(CHAIN)} fx={1500} fy={1050} z0={1.08} z1={1.15} a={t.at('Later') - 1} b={t.at('Freedom was')} bw={QUIET}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.7) 30%, rgba(0,0,0,0) 48%)'}} />
        <Highlight text="CONVICT LEASING" x={110} y={650} size={92} at={t.at('convict leasing')} seed={73} rot={-2} />
        <Definition term="con·vict leas·ing" def="states renting out prisoners to plantations, mines and railroads" at={t.at('rented') - 2} x={120} y={830} w={1200} />
        <Tag text="The chain gang, Thomasville, Georgia, 1880s (later) · Library of Congress" x={44} y={40} />
      </>
    )}
  </Photo>
);

/** Freedom was in the Constitution. What it would mean was another fight. */
const AnotherFight: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Freedom was') - 1;
  return (
    <Desk a={a} push={0.03}>
      <Doc src={AMEND} x={1160} y={120} w={620} rot={2} at={a + 1} marks={[exceptSwipe(a + 4, a + 20)]} />
      <Note text="freedom was in the Constitution" x={150} y={260} size={58} rot={-3} at={a + 2} color={WHITE} />
      <Note text="what freedom would mean" x={130} y={480} size={62} rot={-3} at={t.at('What freedom') - 2} />
      <Note text="was another fight" x={150} y={600} size={70} rot={-3} at={t.at('another fight') - 2} color={BONE} />
      <Tag text={AMEND_TAG} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <WarMeasure t={t} />],
    [at('To end') - 1, <Votes t={t} />],
    [at('Then threefourths') - 1, <Ratify t={t} />],
    [at('Slavery was') - 1, <Over t={t} />],
    [at('But read') - 1, <ReadAgain t={t} />],
    [at('Even before') - 1, <BlackCodes t={t} />],
    [at('In Mississippi') - 1, <Vagrancy t={t} />],
    [at('Arrest someone') - 1, <Exception t={t} />],
    [at('Later') - 1, <Leasing t={t} />],
    [at('Freedom was') - 1, <AnotherFight t={t} />],
  ];
  const writes = ['Remember', 'once the war', 'The Senate', 'It finally', 'gallery', 'The state', 'nearly 4', 'Southern states', 'whoever', 'that exception', 'What freedom', 'another fight'];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {['38', '119', 'ratify', 'Except', 'Black Codes', 'convict leasing'].map((p) => <Sfx key={p} at={at(p) - 1} src="sfx/stamp.wav" volume={0.2} />)}
      {writes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume * 0.8} />)}
      {['without a job', 'arrested', 'fined', "couldn't pay", 'hired out'].map((p) => <Sfx key={p} at={at(p) - 2} src="sfx/tick_soft.wav" volume={0.3} />)}
      <Sfx at={at('was Georgia') - 2} src="sfx/tick.wav" volume={0.35} />
      <Sfx at={at('border states') - 2} src="sfx/tick_soft.wav" volume={0.3} />
    </>
  );
};

export const Ch07: React.FC = () => {
  const t = makeTimeline(N, 30);
  return (
    <ChapterShell n={N} audio="audio/ch07_except.wav" lead={LEAD} quiet music={[
      // j_grief under the amendment's passage, gone before "But read it again"; silence under the Black Codes;
      // its opening returns, quietly, for the last two lines
      {src: 'music/j_grief.mp3', volume: 0.071, to: t.at('But read'), fadeOut: 40},
      {src: 'music/j_grief.mp3', volume: 0.06, from: t.at('Freedom was') - 30},
    ]}>
      <Body />
    </ChapterShell>
  );
};
