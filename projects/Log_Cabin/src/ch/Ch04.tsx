// Chapter 4 · The Log Cabin Candidate: the Whigs wear the insult, cabins everywhere, the raccoon, the "Royal Splendor"
// speech, the voters' "choice", and the mid-video subscribe line.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch04_log_cabin.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, onScreen, Photo, type TL, useScene} from '../kit/shell';
import {Desk, DropCard, Sounds} from '../kit/bs';
import {BARREL, Board, CABIN, CABIN_WHEELS, CARPET, CORSET, COSTUME, PERFUME, PLANTATION, RACCOON, Sketch, SPOON} from '../kit/lc';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);

const NB: [number, number] = [1536, 1177];
const HOIT: [number, number] = [1920, 2314];
const VBB: [number, number] = [1920, 2434];
const OGLE: [number, number] = [2636, 4328];

/** The Whigs read the insult... and hug it. */
const Hug: React.FC<{t: TL}> = ({t}) => (
  <Photo src="img/ch04/north_bend_log_cabin_1840.jpg" size={NB} fx={760} fy={560} z0={1.02} z1={1.1} a={0} b={t.at('Harrison is the')}>
    {() => (
      <>
        <Note text="the Whigs read the insult..." x={110} y={80} size={56} rot={-3} at={t.at('read the insult') - 3} color="#ffffff" />
        <Note text="they hug it" x={1300} y={170} size={74} rot={-4} at={t.at('They hug') - 3} color={usePal().subject} />
        <Tag text="'This log cabin was the first building erected on the North Bend...', Whig campaign print, 1840 · Library of Congress" />
      </>
    )}
  </Photo>
);

/** Harrison wears the cabin: the signature image (it comes back in chapter 7). */
const Costume: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Board>
      <CropCard mask={MASKS.harrison} src="img/ch03/harrison_hoit_1840.jpg" size={HOIT} x={1040} y={250} w={760} h={620} fx={1000} fy={1258} scale={0.34} rot={0} at={-10} traceAt={2}>
        {() => <Sketch d={COSTUME} x={1070} y={31} w={700} at={t.at('the log cabin candidate') - 6} dur={14} seed="cos" width={7} />}
      </CropCard>
      {g >= t.at('the log cabin candidate') && <Highlight text="THE LOG CABIN" x={110} y={330} size={110} at={t.at('the log cabin candidate')} seed={51} rot={-2} />}
      {g >= t.at('the log cabin candidate') + 6 && <Highlight text="CANDIDATE" x={130} y={490} size={110} at={t.at('the log cabin candidate') + 6} seed={52} rot={-3} />}
      <Tag text="Albert Gallatin Hoit, William Henry Harrison, 1840 (cabin drawn on) · via Wikimedia Commons" />
    </Board>
  );
};

/** Cabins everywhere: handkerchiefs, emblems, sheet music. */
const Everywhere: React.FC<{t: TL}> = ({t}) => (
  <Desk a={0}>
    <Note text="log cabins everywhere" x={110} y={80} size={66} rot={-3} at={t.at('Suddenly,') - 3} />
    <DropCard src="img/ch04/campaign_handkerchief.jpg" x={110} y={250} w={480} rot={-4} at={t.at('everywhere.')} />
    <DropCard src="img/ch04/harrison_tyler_emblem.jpg" x={640} y={300} w={720} rot={2} at={t.at('Little ones')} />
    <DropCard src="img/ch05/log_cabin_march.jpg" x={1300} y={520} w={540} rot={-3} at={t.at('Full-size')} />
    <Note text="parade floats" x={720} y={700} size={50} rot={-3} at={t.at('parade floats') - 3} color="#ffffff" />
    <Note text="rallies" x={1380} y={940} size={50} rot={-3} at={t.at('built at') - 3} color="#ffffff" />
    <Tag text="1840 campaign handkerchief; 'Harrison & Tyler' emblem; Log Cabin March sheet music · Library of Congress" />
  </Desk>
);

/** A cabin on wheels rolls through town (smooth roll, the drawing steps at 12 fps). */
const Wheels: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const a = t.at('Cabins on wheels') - 1;
  const x = interpolate(f, [a, a + 70], [-700, 640], {...clamp, easing: (k) => 1 - Math.pow(1 - k, 3)});
  return (
    <Board>
      <Note text="cabins on wheels" x={110} y={90} size={70} rot={-3} at={t.at('Cabins on wheels') - 2} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${x}px)`}}>
        <Sketch d={CABIN_WHEELS} x={0} y={280} w={640} at={a} dur={10} seed="cw" />
      </div>
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}><path d="M0,900 L1920,900" stroke="rgba(237,231,220,0.5)" strokeWidth={4} strokeDasharray="30 22" /></svg>
      <Note text="pulled through town" x={1250} y={960} size={52} rot={-3} at={t.at('pulled through') - 3} color="#ffffff" />
    </Board>
  );
};

/** On the real print: the raccoon skin on the wall, the barrels by the door. */
const Skins: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Photo src="img/ch04/north_bend_log_cabin_1840.jpg" size={NB} fx={820} fy={680} z0={2.0} z1={2.2} a={t.at('with raccoon skins') - 1} b={t.at('The raccoon becomes')}>
      {(p) => {
        const S = onScreen(p);
        const [rx, ry] = S(832, 642);
        const [bx, by] = S(905, 790);
        return (
          <>
            <Loop cx={rx} cy={ry} rx={95} ry={95} at={t.at('raccoon skins') + 2} seed={53} />
            <Note text="raccoon skin" x={rx + 110} y={ry - 160} size={56} rot={-4} at={t.at('raccoon skins') - 2} />
            <Loop cx={bx} cy={by} rx={170} ry={100} at={t.at('a barrel') + 2} seed={55} color={pal.subject} />
            <Note text="hard cider by the door" x={bx - 160} y={880} size={56} rot={-3} at={t.at('a barrel') - 2} color={pal.subject} />
            <Tag text="Detail · Whig campaign print, 1840 · Library of Congress" />
          </>
        );
      }}
    </Photo>
  );
};

/** The raccoon: unofficial mascot. Don't ask. */
const Mascot: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Board>
      <Sketch d={RACCOON} x={720} y={250} w={520} at={t.at('The raccoon becomes') - 1} dur={14} seed="rc" width={6} />
      {g >= t.at('unofficial mascot') && <Highlight text="UNOFFICIAL MASCOT" x={140} y={90} size={96} at={t.at('unofficial mascot')} seed={57} rot={-2} />}
      <Note text="don't ask." x={1300} y={820} size={78} rot={-5} at={t.at("Don't ask.") - 3} color={pal.subject} />
    </Board>
  );
};

/** Ogle's "Royal Splendor" speech, and what it said Van Buren owned. */
const Splendor: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Board>
      <CropCard src="img/ch04/ogle_speech_p1.jpg" size={OGLE} x={120} y={200} w={620} h={780} fx={1250} fy={3480} scale={0.36} rot={-2} at={1} bw="grayscale(1) sepia(0.25) contrast(1.15)">
        {(S) => {
          const [x0, y0] = S(1480, 3525);
          return <Loop cx={x0 + 40} cy={y0} rx={120} ry={34} at={t.at('very long') + 4} seed={59} />;
        }}
      </CropCard>
      <Note text="a Whig congressman:" x={120} y={80} size={54} rot={-3} at={t.at('A Whig congressman') - 3} color="#ffffff" />
      {g >= t.at('Royal Splendor') && <Highlight text="'ROYAL SPLENDOR'" x={830} y={110} size={96} at={t.at('Royal Splendor')} seed={61} rot={-2} />}
      <Note text="a very long speech" x={860} y={270} size={52} rot={-3} at={t.at('very long') - 3} />
      <Sketch d={SPOON} x={880} y={390} w={70} at={t.at('Gold spoons.')} dur={8} seed="sp" />
      <Sketch d={SPOON} x={940} y={400} w={70} at={t.at('Gold spoons.') + 2} dur={8} seed="sp2" rot={12} />
      <Sketch d={PERFUME} x={1080} y={430} w={170} at={t.at('Perfume.')} dur={8} seed="pf" />
      <Sketch d={CARPET} x={1300} y={460} w={280} at={t.at('Fancy carpets.')} dur={8} seed="cp" />
      <Sketch d={CORSET} x={1640} y={400} w={150} at={t.at('corset.') - 2} dur={8} seed="co" />
      <Note text="gold spoons" x={860} y={610} size={44} rot={-3} at={t.at('Gold spoons.') - 2} color={pal.subject} />
      <Note text="perfume" x={1090} y={610} size={44} rot={-3} at={t.at('Perfume.') - 2} color={pal.subject} />
      <Note text="carpets" x={1360} y={610} size={44} rot={-3} at={t.at('Fancy carpets.') - 2} color={pal.subject} />
      <Note text="a corset?" x={1620} y={610} size={44} rot={-3} at={t.at('corset.') - 2} color="#FF9F1C" />
      <Note text="mostly exaggerated" x={880} y={780} size={62} rot={-3} at={t.at('exaggerated.') - 3} color="#FF9F1C" />
      <Note text="nobody checks" x={1000} y={890} size={62} rot={-3} at={t.at('Nobody checks.') - 3} color={pal.subject} />
      <Tag text="Speech of Mr. Ogle, of Pennsylvania, on the Regal Splendor of the President's Palace, 1840 · Internet Archive" />
    </Board>
  );
};

/** "Here's your choice": the man of the people vs the perfumed aristocrat. */
const Choice: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const g = useGFrame();
  return (
    <Board>
      <div style={{position: 'absolute', left: 958, top: 110, width: 4, height: 860, background: 'rgba(244,239,230,0.45)'}} />
      <div style={{position: 'absolute', left: 110, top: 80, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.mark, opacity: g >= t.at('A hardworking') ? 1 : 0}}>MAN OF THE PEOPLE</div>
      <div style={{position: 'absolute', left: 1010, top: 80, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: pal.subject, opacity: g >= t.at('Or a perfumed') ? 1 : 0}}>PERFUMED ARISTOCRAT</div>
      <CropCard mask={MASKS.harrison} src="img/ch03/harrison_hoit_1840.jpg" size={HOIT} x={130} y={160} w={360} h={440} fx={1000} fy={850} scale={0.3} rot={-2} at={t.at('A hardworking') - 2} traceAt={t.at('A hardworking') + 4} />
      <Sketch d={CABIN} x={540} y={260} w={360} at={t.at('in a log cabin') - 2} dur={10} seed="ch4" />
      {g >= t.at('Or a perfumed') && <CropCard mask={MASKS.vanburen_bust} src="img/ch02/van_buren_bust_1840.jpg" size={VBB} x={1030} y={160} w={360} h={440} fx={960} fy={820} scale={0.28} rot={2} at={t.at('Or a perfumed') - 2} traceAt={t.at('Or a perfumed') + 4} />}
      <Sketch d={SPOON} x={1500} y={220} w={90} at={t.at('eating off gold') - 2} dur={8} seed="sp3" />
      <Sketch d={PERFUME} x={1610} y={300} w={190} at={t.at('perfumed aristocrat')} dur={8} seed="pf2" />
      <Sketch d={PLANTATION} x={160} y={700} w={420} at={t.at('grew up') - 2} dur={10} seed="pl2" />
      <Note text="grew up on a plantation" x={600} y={720} size={50} rot={-3} at={t.at('grew up') - 3} color="#FF9F1C" />
      <Arrow x1={590} y1={790} x2={420} y2={600} bow={-40} at={t.at('grew up') + 6} color="#FF9F1C" />
      <Note text="but sure." x={640} y={880} size={78} rot={-4} at={t.at('But sure.') - 3} color={pal.subject} />
    </Board>
  );
};

/** The mid-video subscribe reminder, tied to the cider. */
const Subscribe: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Board>
      <Sketch d={BARREL} x={780} y={250} w={360} at={t.at('Quick thing')} dur={10} seed="sb" />
      <Note text="subscribe ↓" x={1180} y={420} size={70} rot={-4} at={t.at('hit subscribe') - 3} />
      <Note text="(no cider included)" x={1180} y={560} size={56} rot={-3} at={t.at('not offering') - 3} color={pal.subject} />
    </Board>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Hug t={t} />],
    [at('Harrison is the') - 1, <Costume t={t} />],
    [at('Suddenly,') - 1, <Everywhere t={t} />],
    [at('Cabins on wheels') - 1, <Wheels t={t} />],
    [at('with raccoon skins') - 1, <Skins t={t} />],
    [at('The raccoon becomes') - 1, <Mascot t={t} />],
    [at('Next,') - 1, <Splendor t={t} />],
    [at('So, voters') - 1, <Choice t={t} />],
    [at('Quick thing') - 1, <Subscribe t={t} />],
  ];
  return (
    <AbsoluteFill>
      {useScene(cuts)}
      <Sounds cuts={cuts.map((c) => c[0])}
        stamps={[at('the log cabin candidate'), at('unofficial mascot'), at('Royal Splendor')]}
        ticks={[at('everywhere.'), at('Little ones'), at('Full-size'), at('Gold spoons.'), at('Perfume.'), at('Fancy carpets.'), at('corset.')]}
        writes={['read the insult', 'They hug', 'Suddenly,', 'parade floats', 'built at', 'Cabins on wheels', 'pulled through', 'raccoon skins', 'a barrel', "Don't ask.", 'A Whig congressman', 'very long', 'exaggerated.', 'Nobody checks.', 'grew up', 'But sure.', 'hit subscribe', 'not offering'].map((p) => at(p))} />
    </AbsoluteFill>
  );
};

export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_log_cabin.wav" lead={LEAD} music={[{src: 'music/j_gossip.mp3', volume: 0.15}]}>
    <Body />
  </ChapterShell>
);
