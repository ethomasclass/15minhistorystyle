// Chapter 2 · Contraband (quiet chapter): Lincoln's goal is the Union and he needs the border states; enslaved people
// don't wait; Fort Monroe, May 1861, and Butler's "contraband of war"; hundreds more by summer; 100+ contraband camps.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch02_contraband.words.json';
import data from '../../public/maps/civwar1861.json';
import {Highlight, Note, Tag} from '../kit/Kit';
import {Desk, DropCard, Sounds} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {CORAL, STAMPEDE, STAMPEDE_TAG, WHITE} from '../kit/ff';
import {BORDER_1861, type Cam3, CONFEDERACY_1861, Hand, MAP3D, Map3D, type MapData, Stand, StateTiles, UNION_FREE_1861} from '../kit/map3d';
import {Backdrop, ChapterShell, chapterFrames, CropCard, Definition, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);
const D = data as unknown as MapData;

const TENT = 'img/ch03/lincoln_mcclellan_antietam_tent_1862.jpg';
const ROWING = 'img/gen/v2_ch02_rowing_to_fort_monroe.jpg';
const BUTLER = 'img/ch02/butler_portrait_later_c1870s.jpg';
const CANNON = 'img/ch02/enslaved_men_mounting_cannon_charleston_waud_1861.jpg';
const SKETCH = 'img/ch02/butler_sketch_waud_c1861.jpg';
const ARRIVAL = 'img/ch02/arrival_at_fortress_monroe_leslies_spread_1861.jpg';
const FOLLERS = 'img/ch02/contrabands_follers_house_cumberland_1862.jpg';
const FORT = 'img/ch02/fortress_monroe_1861.jpg';
const VILLAGE = 'img/ch02/freedmans_village_arlington_1864.jpg';
const COMING = 'img/ch02/contrabands_coming_into_camp_waud_1863.jpg';

/** Lincoln's goal when the war started: save the Union, not end slavery. */
const Goal: React.FC<{t: TL}> = ({t}) => (
  <Photo src={TENT} size={sizeOf(TENT)} fx={1500} fy={1350} z0={2.0} z1={2.12} a={-10} b={t.at('He needed')} mask={MASKS.lincoln_tent} traceAt={t.at("Lincoln's goal") + 2}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(10,9,7,0.9) 0%, rgba(10,9,7,0.75) 30%, rgba(0,0,0,0) 46%)'}} />
        <Note text="when the war started" x={110} y={110} size={52} rot={-3} at={t.at('When the') - 2} color={WHITE} />
        <Note text="Lincoln's goal:" x={110} y={220} size={56} rot={-3} at={t.at("Lincoln's goal") - 3} />
        <Highlight text="SAVE THE UNION" x={100} y={330} size={80} at={t.at('save the Union')} seed={201} rot={-2} />
        <Note text="not end slavery" x={120} y={500} size={60} rot={-3} at={t.at('not to end') - 3} color={WHITE} />
        <Tag text="Alexander Gardner, Lincoln with McClellan and officers at Antietam, Oct. 1862 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** He needed the border states: slave states that stayed loyal. Push too hard and they might leave. */
const Border: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('He needed') - 1;
  const b = t.at('border states');
  const keys: Cam3[] = [{f: a, x: 2950, y: 2450, z: 0.36, tilt: 34, rot: 0}, {f: t.at('But enslaved'), x: 2750, y: 2250, z: 0.42, tilt: 42, rot: -4}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.6} rivers={0.35}>
        {(api) => (
          <>
            <StateTiles api={api} names={UNION_FREE_1861} at={a} stagger={0} h={14} color={MAP3D.free} />
            <StateTiles api={api} names={CONFEDERACY_1861} at={a} stagger={0} h={30} color={CORAL} />
            <StateTiles api={api} names={BORDER_1861} at={b - 2} stagger={3} h={60} color={MAP3D.grey} />
            <Stand api={api} at={[2350, 2120]} z={80} show={b + 6}><Hand text="border states" size={74} color="#f4efe6" rot={-2} bg /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <Note text="he needed the border states" x={110} y={90} size={54} rot={-2} at={b - 3} color={WHITE} />
        <Note text="slave states that stayed loyal" x={110} y={190} size={54} rot={-2} at={t.at('the slave') - 3} />
        <Note text="push too hard on slavery →" x={110} y={790} size={54} rot={-2} at={t.at('Push too') - 3} color={WHITE} />
        <Note text="they might leave too" x={150} y={890} size={54} rot={-2} at={t.at('might leave') - 3} color={CORAL} />
        <Tag text="Map · the United States in 1861: Union, border states, Confederacy" />
      </AbsoluteFill>
    </>
  );
};

/** But enslaved people didn't wait for Washington. */
const DidntWait: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={STAMPEDE} px={sizeOf(STAMPEDE)} fx={1600} fy={1150} a={t.at('But enslaved') - 1} b={t.at('May 1861')} z0={1.04} z1={1.12} fade={6} quiet tag={STAMPEDE_TAG}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.5) 24%, rgba(0,0,0,0) 38%)'}} />
        <Note text="but enslaved people didn't wait for Washington" x={130} y={90} size={64} rot={-2} at={t.at('But enslaved') + 2} color={WHITE} />
      </>
    )}
  </Engraving>
);

/** May 1861: three enslaved men slip away to Fort Monroe, a Union fort in Virginia. */
const Monroe: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={ROWING} px={sizeOf(ROWING)} fx={555} fy={330} a={t.at('May 1861') - 1} b={t.at('Their owner')} z0={1.0} z1={1.08} fade={6}
    tag="Illustration · three men row to Fort Monroe, May 1861">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.6) 28%, rgba(0,0,0,0) 46%)'}} />
        <Highlight text="MAY 1861" x={110} y={100} size={100} at={t.at('May 1861')} seed={203} rot={-2} />
        <Note text="weeks into the war" x={120} y={270} size={52} rot={-3} at={t.at('just weeks') - 3} color={WHITE} />
        <Note text="three enslaved men" x={120} y={380} size={56} rot={-3} at={t.at('Three enslaved') - 3} />
        <Note text="slip away to Fort Monroe" x={120} y={480} size={56} rot={-3} at={t.at('slip away') - 3} />
        <Note text="a Union fort in Virginia" x={120} y={580} size={50} rot={-3} at={t.at('a Union fort') - 3} color={WHITE} />
      </>
    )}
  </Engraving>
);

/** Their owner wants them back. General Benjamin Butler, the fort's commander, says no. */
const Butler: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Their owner') - 1;
  return (
    <Desk a={a}>
      <CropCard src={BUTLER} size={sizeOf(BUTLER)} x={180} y={130} w={560} h={740} fx={880} fy={1580} scale={0.5} rot={-2} at={a + 1} mask={MASKS.butler}
        traceAt={t.at('General Benjamin') + 3} />
      <Note text="their owner wants them back" x={860} y={130} size={54} rot={-3} at={t.at('Their owner') - 2} color={WHITE} />
      <Note text="the fort's commander:" x={860} y={270} size={52} rot={-3} at={t.at("fort's commander") - 3} />
      <Highlight text="GEN. BENJAMIN BUTLER" x={850} y={370} size={70} at={t.at('General Benjamin')} seed={205} rot={-2} />
      <Note text="says no" x={880} y={560} size={84} rot={-4} at={t.at('says no') - 2} color={CORAL} />
      <Tag text="Brady-Handy studio, Benjamin Butler, 1870s (after the war) · Library of Congress" />
    </Desk>
  );
};

/** These men had been put to work on Confederate defenses. */
const Defenses: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={CANNON} px={sizeOf(CANNON)} fx={1500} fy={1150} a={t.at('These men') - 1} b={t.at('So, he says')} z0={1.04} z1={1.1} fade={6}
    tag="William Waud, enslaved men mounting cannon in the works against Fort Sumter, Charleston, April 1861 · Library of Congress">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.82) 0%, rgba(10,9,7,0.4) 24%, rgba(0,0,0,0) 36%)'}} />
        <Note text="put to work on Confederate defenses" x={130} y={90} size={62} rot={-2} at={t.at('put to work') - 3} color={WHITE} />
      </>
    )}
  </Engraving>
);

/** So they are contraband of war: enemy property the army can keep. A cold word for human beings. But it worked. */
const Contraband: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('So, he says') - 1;
  return (
    <Desk a={a}>
      <Backdrop src={FORT} size={sizeOf(FORT)} a={a} dim={0.3} side="right" />
      <Doc src={SKETCH} x={110} y={180} w={640} rot={-2} at={a + 1} />
      <Highlight text="CONTRABAND OF WAR" x={830} y={110} size={80} at={t.at('contraband of war')} seed={207} rot={-2} />
      <Definition term="con·tra·band of war" def="enemy property that an army can keep" at={t.at('contraband of war') + 9} x={850} y={290} w={950} />
      <Note text="like captured horses or wagons" x={870} y={440} size={50} rot={-3} at={t.at('captured horses') - 3} color={WHITE} />
      <Note text="a cold word for human beings" x={850} y={640} size={54} rot={-3} at={t.at('cold word') - 3} />
      <Note text="but it worked" x={870} y={790} size={64} rot={-3} at={t.at('But it worked') - 2} color={WHITE} />
      <Tag text="Alfred Waud, sketches of General Butler, c. 1861 · Fortress Monroe, stereograph, 1861 · Library of Congress" />
    </Desk>
  );
};

/** By summer, hundreds more had come to the fort. */
const Summer: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={ARRIVAL} px={sizeOf(ARRIVAL)} fx={1480} fy={1050} a={t.at('By summer') - 1} b={t.at('Over the course')} z0={1.45} z1={1.55} fade={6} quiet
    tag="Stampede among the Negroes in Virginia, their arrival at Fortress Monroe, Frank Leslie's, 1861 · Library of Congress">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.82) 0%, rgba(10,9,7,0.4) 24%, rgba(0,0,0,0) 36%)'}} />
        <Note text="by summer: hundreds more at the fort" x={130} y={90} size={62} rot={-2} at={t.at('By summer') + 2} color={WHITE} />
      </>
    )}
  </Engraving>
);

/** Over the war, the Union army ran more than 100 contraband camps. */
const Camps: React.FC<{t: TL}> = ({t}) => (
  <Photo src={FOLLERS} size={sizeOf(FOLLERS)} fx={1300} fy={1450} z0={1.08} z1={1.16} a={t.at('Over the course') - 1} b={t.at('Every person')}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.55) 26%, rgba(0,0,0,0) 40%)'}} />
        <Note text="over the whole war:" x={120} y={90} size={52} rot={-3} at={t.at('Over the course') + 2} color={WHITE} />
        <Highlight text="100+ CONTRABAND CAMPS" x={110} y={180} size={80} at={t.at('contraband camps')} seed={209} rot={-2} />
        <Definition term="con·tra·band camps" def="Union army camps for people who escaped slavery" at={t.at('contraband camps') + 9} x={130} y={340} w={1100} />
        <Tag text="James Gibson, contrabands at Foller's house, Cumberland Landing, Va., May 1862 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** Every person who escaped: one less worker for the Confederacy, one more question for Washington. */
const Ledger: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Every person') - 1;
  return (
    <Desk a={a}>
      <Backdrop src={VILLAGE} size={sizeOf(VILLAGE)} a={a} dim={0.26} side="right" />
      <DropCard src={COMING} x={120} y={170} w={820} rot={-2} at={a + 2} />
      <Note text="every person who escaped:" x={1020} y={170} size={54} rot={-3} at={t.at('Every person') + 2} color={WHITE} />
      <Note text="− one worker" x={1020} y={340} size={60} rot={-3} at={t.at('one less') - 3} color={CORAL} />
      <Note text="for the Confederacy" x={1060} y={430} size={54} rot={-3} at={t.at('for the Confederacy') - 3} color={CORAL} />
      <Note text="+ one more question" x={1020} y={600} size={60} rot={-3} at={t.at('one more question') - 3} />
      <Note text="for Washington" x={1060} y={690} size={54} rot={-3} at={t.at('Washington had') - 3} />
      <Tag text="A. R. Waud, Contrabands coming into camp, Harper's Weekly, Jan. 31, 1863 · Freedman's Village, Arlington, Harper's Weekly, 1864 · Library of Congress" />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Goal t={t} />],
    [at('He needed') - 1, <Border t={t} />],
    [at('But enslaved') - 1, <DidntWait t={t} />],
    [at('May 1861') - 1, <Monroe t={t} />],
    [at('Their owner') - 1, <Butler t={t} />],
    [at('These men') - 1, <Defenses t={t} />],
    [at('So, he says') - 1, <Contraband t={t} />],
    [at('By summer') - 1, <Summer t={t} />],
    [at('Over the course') - 1, <Camps t={t} />],
    [at('Every person') - 1, <Ledger t={t} />],
  ];
  const writes = ['When the', "Lincoln's goal", 'not to end', 'border states', 'the slave', 'Push too', 'might leave', 'But enslaved', 'just weeks', 'Three enslaved', 'slip away',
    'a Union fort', 'Their owner', "fort's commander", 'says no', 'put to work', 'captured horses', 'cold word', 'But it worked', 'By summer', 'Over the course', 'Every person', 'one less',
    'one more question'].map((p) => at(p));
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map(([f]) => f)} stamps={[at('save the Union'), at('May 1861'), at('General Benjamin'), at('contraband of war'), at('contraband camps')]} writes={writes}
        ticks={[at('border states') - 2]} />
    </>
  );
};

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_contraband.wav" lead={LEAD} quiet music={[{src: 'music/g_world_outside.mp3', volume: 0.077}]}>
    <Body />
  </ChapterShell>
);
