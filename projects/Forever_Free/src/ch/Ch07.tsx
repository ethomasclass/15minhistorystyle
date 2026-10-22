// Chapter 7 · The 54th (quiet chapter): 178,000 Black soldiers; separate units, unequal pay until 1864; the 54th
// Massachusetts at Fort Wagner, July 1863; Douglass urges enlistment, "there is no power on earth"; Smalls goes to Congress.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import words from '../../public/audio/ch07_the_54th.words.json';
import data from '../../public/maps/civwar1861.json';
import {Highlight, Note, Tag} from '../kit/Kit';
import {Desk, DropCard, Sounds, SyncQuote} from '../kit/bs';
import {sizeOf} from '../kit/dk';
import {Engraving} from '../kit/engraving';
import {CORAL, SMALLS, SMALLS_TAG, WHITE} from '../kit/ff';
import {type Cam3, CONFEDERACY_1861, Count, MAP3D, Map3D, type MapData, PlaceTag, Pin3, Stake, Stand, StateTiles} from '../kit/map3d';
import {Backdrop, ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, Photo, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);
const D = data as unknown as MapData;
const pl = D.places as Record<string, [number, number]>;

const COMPANY_E = 'img/ch07/company_e_4th_usct_fort_lincoln_c1864.jpg';
const POSTER = 'img/ch07/come_and_join_us_brothers_poster_c1864.jpg';
const CHARGE = 'img/ch07/gallant_charge_54th_currier_ives_1863.jpg';
const DOUGLASS = 'img/ch07/douglass_portrait_seated_1864.jpg';
const TO_ARMS = 'img/ch07/men_of_color_to_arms_douglass_monthly_1863-03.jpg';
const MEN_54TH = 'img/ch07/emilio_plate_54th_soldiers_p64_1891.jpg';

/** About 178,000 Black men served in the Union army, one in ten; thousands more in the navy. */
const Served: React.FC<{t: TL}> = ({t}) => (
  <Photo src={COMPANY_E} size={sizeOf(COMPANY_E)} fx={1500} fy={1350} z0={1.05} z1={1.12} a={-10} b={t.at('They served')}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.9) 0%, rgba(10,9,7,0.6) 30%, rgba(0,0,0,0) 42%, rgba(0,0,0,0) 66%, rgba(10,9,7,0.9) 86%)'}} />
        <div style={{position: 'absolute', left: 130, top: 80}}><Count to={178000} at={t.at('178,000') - 2} dur={30} prefix="about " size={104} color="#f4efe6" /></div>
        <Note text="Black men in the Union army" x={140} y={220} size={54} rot={-2} at={t.at('Black men') - 3} />
        <Note text="≈ 1 in 10 Union soldiers" x={1120} y={110} size={56} rot={-3} at={t.at('roughly one') - 3} color={WHITE} />
        <Note text="+ thousands more in the navy" x={140} y={810} size={52} rot={-2} at={t.at('Thousands more') - 3} color={WHITE} />
        <Note text="many had escaped slavery only months before" x={140} y={900} size={52} rot={-2} at={t.at('Many had') - 3} />
        <Tag text="Company E, 4th U.S. Colored Infantry, Fort Lincoln, D.C., c. 1864 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** Separate units, mostly white officers; paid less until 1864; some regiments refused pay until it was equal. */
const Separate: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('They served') - 1;
  return (
    <Desk a={a}>
      <DropCard src={POSTER} x={110} y={150} w={760} rot={-2} at={a + 2} filter="saturate(0.85) contrast(1.05)" />
      <Note text="separate units" x={960} y={140} size={56} rot={-3} at={t.at('separate units') - 3} color={WHITE} />
      <Note text="mostly under white officers" x={960} y={240} size={46} rot={-3} at={t.at('mostly under') - 3} color={WHITE} />
      <Note text="paid less, until 1864" x={960} y={410} size={58} rot={-3} at={t.at('paid less') - 3} color={CORAL} />
      <Note text="some regiments refused any pay" x={960} y={580} size={42} rot={-3} at={t.at('Some regiments') - 3} />
      <Note text="until it was equal" x={980} y={670} size={50} rot={-3} at={t.at('it was equal') - 3} />
      <Tag text="Come and Join Us Brothers, Supervisory Committee for Recruiting Colored Regiments, c. 1864 · Library of Congress" />
    </Desk>
  );
};

/** July 1863: the 54th Massachusetts, one of the first Black regiments raised in the North, attacks Fort Wagner. */
const Wagner: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('July 1863') - 1;
  const w = t.at('Fort Wagner');
  const keys: Cam3[] = [{f: a, x: 3400, y: 3040, z: 2.4, tilt: 40, rot: -4}, {f: t.at("They don't"), x: 3405, y: 3045, z: 2.6, tilt: 44, rot: -6}];
  return (
    <>
      <Map3D data={D} keys={keys} states={0.7} rivers={0.8}>
        {(api) => (
          <>
            <StateTiles api={api} names={CONFEDERACY_1861} at={-99} stagger={0} h={20} color={CORAL} />
            <Stand api={api} at={pl.charleston} z={20} show={a + 4}><Pin3 color={MAP3D.grey} h={50} /></Stand>
            <Stand api={api} at={[pl.charleston[0] - 80, pl.charleston[1] - 30]} z={50} show={a + 6}><PlaceTag text="Charleston" size={30} /></Stand>
            <Stand api={api} at={pl.fortSumter} z={20} show={a + 6}><Pin3 color={MAP3D.grey} h={40} /></Stand>
            <Stand api={api} at={[pl.fortSumter[0] + 14, pl.fortSumter[1] - 30]} z={60} show={a + 8}><PlaceTag text="Fort Sumter" size={26} /></Stand>
            <Stand api={api} at={pl.fortWagner} show={w - 2}><Stake color={MAP3D.us} /></Stand>
            <Stand api={api} at={[pl.fortWagner[0] + 16, pl.fortWagner[1] + 14]} z={60} show={w}><PlaceTag text="Fort Wagner" size={36} /></Stand>
          </>
        )}
      </Map3D>
      <AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(10,9,7,0.8) 0%, rgba(10,9,7,0.5) 30%, rgba(0,0,0,0) 45%)'}} />
        <Highlight text="JULY 1863" x={130} y={90} size={96} at={t.at('July 1863')} seed={701} rot={-2} />
        <Note text="the 54th Massachusetts" x={140} y={260} size={58} rot={-2} at={t.at('54th Massachusetts') - 3} color={WHITE} />
        <Note text="one of the first Black regiments" x={140} y={360} size={50} rot={-2} at={t.at('one of the first') - 3} />
        <Note text="raised in the North" x={160} y={440} size={50} rot={-2} at={t.at('raised in') - 3} />
        <Note text="attacks Fort Wagner, guarding Charleston Harbor" x={140} y={880} size={52} rot={-2} at={t.at('leads an attack') - 3} color={WHITE} />
        <Tag text="Map · Charleston Harbor, July 1863" />
      </AbsoluteFill>
    </>
  );
};

/** They don't take the fort; nearly half who charged are killed, wounded or captured; Northern papers report how they fought. */
const Charge: React.FC<{t: TL}> = ({t}) => (
  <Engraving src={CHARGE} px={sizeOf(CHARGE)} fx={1500} fy={950} a={t.at("They don't") - 1} b={t.at('Frederick')} z0={1.22} z1={1.3} fade={6} quiet
    tag="The Gallant Charge of the Fifty Fourth Massachusetts (Colored) Regiment, Currier & Ives, 1863 · Library of Congress">
    {() => (
      <>
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,9,7,0.88) 0%, rgba(10,9,7,0.4) 20%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 66%, rgba(10,9,7,0.9) 86%)'}} />
        <Note text="they don't take the fort" x={130} y={80} size={56} rot={-2} at={t.at("They don't") + 2} color={WHITE} />
        <Note text="nearly half: killed, wounded or captured" x={140} y={180} size={50} rot={-2} at={t.at('Nearly half') - 3} />
        <Note text="but newspapers across the North" x={130} y={800} size={54} rot={-2} at={t.at('But newspapers') - 3} color={WHITE} />
        <Note text="report how they fought" x={160} y={895} size={58} rot={-2} at={t.at('report how') - 3} />
      </>
    )}
  </Engraving>
);

/** Frederick Douglass, who had escaped slavery, urged Black men to enlist; two of his sons joined the 54th. */
const Douglass: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Frederick') - 1;
  return (
    <Desk a={a}>
      <CropCard src={DOUGLASS} size={sizeOf(DOUGLASS)} x={170} y={120} w={520} h={760} fx={900} fy={1500} scale={0.3} rot={-2} at={a + 1} mask={MASKS.douglass}
        traceAt={t.at('Frederick') + 4} />
      <Highlight text="FREDERICK DOUGLASS" x={790} y={100} size={74} at={t.at('Frederick')} seed={703} rot={-2} />
      <Note text="escaped slavery himself" x={820} y={270} size={52} rot={-3} at={t.at('who had escaped') - 3} color={WHITE} />
      <Note text="urged Black men to enlist" x={820} y={380} size={52} rot={-3} at={t.at('urged') - 3} />
      <DropCard src={TO_ARMS} x={1440} y={480} w={340} rot={3} at={t.at('urged') - 2} />
      <Note text="two of his own sons" x={820} y={600} size={52} rot={-3} at={t.at('Two of his') - 3} color={WHITE} />
      <Note text="joined the 54th" x={840} y={690} size={58} rot={-3} at={t.at('joined the') - 3} color={CORAL} />
      <Tag text="B. F. Smith & Son, Frederick Douglass, 1864 · Men of Color, To Arms!, Douglass' Monthly, March 1863 · Library of Congress, Internet Archive" />
    </Desk>
  );
};

/** Once a Black man wore the uniform, Douglass said, "there is no power on earth" that could deny his citizenship. */
const Earned: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Once a Black') - 1;
  return (
    <Desk a={a}>
      <Backdrop src={MEN_54TH} size={sizeOf(MEN_54TH)} a={a} fx={800} fy={1150} dim={0.34} side="none" />
      <Note text="once a Black man wore the uniform" x={140} y={110} size={56} rot={-2} at={t.at('Once a Black') + 2} color={WHITE} />
      <Note text="and carried a musket," x={160} y={210} size={56} rot={-2} at={t.at('carried a musket') - 3} color={WHITE} />
      <Note text="Douglass said:" x={160} y={330} size={50} rot={-2} at={t.at('Douglass said') - 3} />
      <SyncQuote t={t} phrase="there is no power on earth" x={160} y={430} w={1600} size={92} />
      <Note text="could deny he had earned" x={160} y={740} size={56} rot={-2} at={t.at('that could deny') - 3} color={CORAL} />
      <Note text="the right to citizenship" x={180} y={840} size={60} rot={-2} at={t.at('right to citizenship') - 3} color={CORAL} />
      <Tag text="Enlisted men of the 54th Massachusetts, from Luis Emilio, A Brave Black Regiment, 1891 · Internet Archive" />
    </Desk>
  );
};

/** And Robert Smalls? He piloted ships for the Union navy; after the war, South Carolina sent him to Congress. */
const SmallsAfter: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('And Robert Smalls') - 1;
  return (
    <Desk a={a}>
      <CropCard src={SMALLS} size={sizeOf(SMALLS)} x={170} y={120} w={560} h={760} fx={1100} fy={1700} scale={0.33} rot={-2} at={a + 1} mask={MASKS.smalls}
        traceAt={a + 6} />
      <Note text="and Robert Smalls?" x={880} y={120} size={60} rot={-3} at={t.at('And Robert Smalls') + 2} color={WHITE} />
      <Note text="piloted ships for the Union navy" x={880} y={260} size={50} rot={-3} at={t.at('pilot ships') - 3} />
      <Note text="after the war," x={880} y={400} size={50} rot={-3} at={t.at('After the war') - 3} color={WHITE} />
      <Note text="South Carolina's voters" x={900} y={480} size={50} rot={-3} at={t.at('the voters') - 3} color={WHITE} />
      <Note text="sent him to" x={900} y={570} size={52} rot={-3} at={t.at('sent him') - 3} color={WHITE} />
      <Highlight text="CONGRESS" x={880} y={660} size={120} at={t.at('to Congress') + 4} seed={705} rot={-2} />
      <Tag text={SMALLS_TAG} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Served t={t} />],
    [at('They served') - 1, <Separate t={t} />],
    [at('July 1863') - 1, <Wagner t={t} />],
    [at("They don't") - 1, <Charge t={t} />],
    [at('Frederick') - 1, <Douglass t={t} />],
    [at('Once a Black') - 1, <Earned t={t} />],
    [at('And Robert Smalls') - 1, <SmallsAfter t={t} />],
  ];
  const writes = ['Black men', 'roughly one', 'Thousands more', 'Many had', 'separate units', 'mostly under', 'paid less', 'Some regiments', 'it was equal', '54th Massachusetts',
    'one of the first', 'raised in', 'leads an attack', "They don't", 'Nearly half', 'But newspapers', 'report how', 'who had escaped', 'urged', 'Two of his', 'joined the',
    'Once a Black', 'carried a musket', 'Douglass said', 'that could deny', 'And Robert Smalls', 'pilot ships', 'After the war', 'sent him'].map((p) => at(p));
  return (
    <>
      {useScene(cuts)}
      <Sounds cuts={cuts.map(([f]) => f)} stamps={[at('July 1863'), at('Frederick'), at('to Congress') + 4]} writes={writes} ticks={[at('Fort Wagner') - 2]} />
    </>
  );
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_the_54th.wav" lead={LEAD} quiet music={[{src: 'music/r_abolition_b.mp3', volume: 0.059}]}>
    <Body />
  </ChapterShell>
);
