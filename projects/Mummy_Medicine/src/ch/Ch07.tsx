// Chapter 7 · The Party: "quite out of use", Egyptomania, Mummy Pettigrew, the 1850 invitation (the Unwrap),
// and Gliddon's Boston princess who was a man.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch07_the_party.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame, useHand, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, onScreen, Photo, Stamp, type TL, useScene} from '../kit/shell';
import {Bed, IndexCard, Sketch, type P} from '../draw';
import {Jar} from '../jar';
import {IMG} from '../images';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

// A wrapped body lying on its back, in local units (0..620 x 0..170), head at the left; plus its bandage bands.
const BUNDLE: P[] = [[20, 95], [30, 55], [70, 35], [120, 45], [150, 70], [230, 60], [330, 55], [430, 60], [520, 70], [585, 85], [600, 105], [585, 125], [520, 135], [430, 140], [330, 140], [230, 138], [150, 130], [120, 150], [70, 158], [30, 140]];
const BANDS = [150, 210, 270, 330, 390, 450, 510, 560];

const DrawnBundle: React.FC<{x: number; y: number; s?: number; at: number}> = ({x, y, s = 1, at}) => (
  <>
    <Sketch pts={[[-40, 175], [680, 175]]} x={x} y={y} s={s} at={at} dur={8} width={6} smooth={false} color="#EDE7DC" />
    <Sketch pts={BUNDLE} x={x} y={y} s={s} at={at + 3} dur={14} width={7} closed />
    {BANDS.map((bx, i) => <Sketch key={i} pts={[[bx - 12, 62], [bx + 12, 138]]} x={x} y={y} s={s} at={at + 10 + i} dur={4} width={4} smooth={false} />)}
  </>
);

/** Quincy, 1718: "quite out of use". */
const OutOfUse: React.FC<{t: TL}> = ({t}) => (
  <Photo src={IMG.quincy148.src} size={IMG.quincy148.size} fx={600} fy={2470} z0={1.45} z1={1.55} a={0} b={t.at('Europe took')} bw="grayscale(1) contrast(1.15) sepia(0.2)">
    {(place) => {
      const S = onScreen(place);
      const [a, b] = S(480, 2598);
      const [c] = S(1065, 2598);
      return (
        <>
          <Sketch pts={[[a, b], [c, b + 4]]} x={0} y={0} at={t.at('quite out')} dur={8} width={8} color="#FF9F1C" smooth={false} />
          <AbsoluteFill style={{background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.78) 84%)'}} />
          <Highlight text="1718" x={1500} y={90} size={100} at={t.at('In 1718')} seed={71} rot={-2} />
          <Note text="doctors: losing faith" x={110} y={860} size={52} rot={-3} at={t.at('losing faith')} color="#ffffff" />
          <Note text="'quite out of use'" x={110} y={930} size={60} rot={-3} at={t.at('quite out')} />
          <Tag text="John Quincy, The Compleat English Dispensatory, 1718, p. 148 · Internet Archive" x={44} y={40} />
        </>
      );
    }}
  </Photo>
);

/** The Jar, gathering dust: still in the catalogs. */
const Dusty: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  const a = t.at('Europe took');
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Jar x={330} y={140} h={780} at={a - 2} labels={[{text: 'MUMIA', at: a - 2, size: 10}]} fill={[[a - 2, 0.6]]} cobweb={a + 4} dust={a + 2} />
      <IndexCard x={850} y={170} w={560} h={190} at={a + 2} rot={4} lines={[{text: 'quite out of use', at: a + 6, color: '#b8402f'}]} size={44} />
      <Note text="Europe took it as a suggestion." x={880} y={470} size={58} rot={-3} at={t.at('suggestion')} color={pal.subject} />
      <Note text="still in catalogs: 2 more centuries" x={860} y={600} size={48} rot={-3} at={t.at('stayed')} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** The 1800s: Egyptomania, and the new fashion. */
const Egyptomania: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Photo src={IMG.denon.src} size={IMG.denon.size} fx={1200} fy={950} z0={1.02} z1={1.12} a={t.at('And in the 1800s') - 1} b={t.at('In London')}>
      {() => (
        <>
          {g >= t.at('1800s') && <Highlight text="THE 1800s" x={110} y={90} size={100} at={t.at('1800s')} seed={72} rot={-2} />}
          <Note text="Europe + America: in love with ancient Egypt" x={110} y={240} size={50} rot={-3} at={t.at('fell in love')} color="#ffffff" />
          <Note text="the rich, with mummies:" x={1150} y={760} size={52} rot={-3} at={t.at('The rich')} color="#ffffff" />
          <Note text="unwrap them." x={1180} y={850} size={78} rot={-4} at={t.at('Unwrap')} color={pal.subject} />
          <Note text="(in front of an audience)" x={1200} y={960} size={46} rot={-3} at={t.at('audience')} />
          <Tag text="'Mr. Denon unrolling a mummy', lithograph, c. 1820 · Library of Congress" x={44} y={40} />
        </>
      )}
    </Photo>
  );
};

/** Mummy Pettigrew. */
const Pettigrew: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={IMG.pettigrewTitle.src} size={IMG.pettigrewTitle.size} x={180} y={140} w={560} h={780} fx={1071} fy={1200} scale={0.38} rot={-2} at={t.at('In London') - 2} />
      <Note text="London: a surgeon," x={880} y={130} size={54} rot={-3} at={t.at('surgeon')} color="#ffffff" />
      {g >= t.at('Thomas Pettigrew') && <Highlight text="THOMAS PETTIGREW" x={870} y={220} size={84} at={t.at('Thomas Pettigrew')} seed={73} rot={-2} />}
      <Note text="a.k.a. 'Mummy' Pettigrew" x={900} y={380} size={60} rot={-3} at={t.at('called him')} />
      <Note text="guests bought tickets" x={900} y={520} size={54} rot={-3} at={t.at('Guests')} color="#ffffff" />
      <Note text="some took home a scrap of bandage" x={900} y={620} size={44} rot={-3} at={t.at('scrap')} color="#ffffff" />
      <Note text="party favors." x={960} y={750} size={80} rot={-4} at={t.at('Party favors')} color={pal.subject} />
      <Tag text="T. J. Pettigrew, A History of Egyptian Mummies, 1834 · Internet Archive" />
    </AbsoluteFill>
  );
};

/** The Unwrap: a bandage end lifts and unspools across the frame into the 1850 invitation. */
const Invitation: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  const a = t.at('In 1850');
  const sp = t.at('sent out');
  // the unspooling bandage: from the bundle's foot end to the card, wavy
  const strip: P[] = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    strip.push([760 + u * 260, 690 - u * 330 + Math.sin(u * 14) * 22 * (1 - u)]);
  }
  const lines = [
    {text: 'Monday.', at: t.at('Monday')},
    {text: '144 Piccadilly.', at: t.at('144')},
    {text: 'A Mummy from Thebes', at: t.at('A Mummy from')},
    {text: 'to be unrolled at half-past Two.', at: t.at('unrolled')},
  ];
  return (
    <AbsoluteFill>
      <DarkPaper />
      <DrawnBundle x={130} y={600} s={1} at={a - 2} />
      <Sketch pts={strip} x={0} y={0} at={sp} dur={16} width={9} color="#EDE7DC" />
      {g >= a && <Highlight text="1850" x={110} y={90} size={100} at={a} seed={74} rot={-2} />}
      <Note text="a London lord's invitation" x={110} y={240} size={50} rot={-3} at={t.at('lord')} color="#ffffff" />
      {g >= sp + 10 && (
        <div style={{position: 'absolute', left: 960, top: 180, width: 880, height: 470, background: '#f4efe6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)', transform: `rotate(3deg) scale(${interpolate(g, [sp + 10, sp + 15], [0.7, 1], clamp)})`,
          border: '10px double #b9a98a'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 22, textAlign: 'center', fontFamily: JF.heavy, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: '#3b3222'}}>AT HOME</div>
          {lines.map((l, i) => g >= l.at && (
            <div key={i} style={{position: 'absolute', left: 40, top: 86 + i * 82, fontFamily: hand.family, fontSize: 38 * hand.scale, lineHeight: 1, color: '#2a2418', whiteSpace: 'nowrap',
              clipPath: `inset(-30% ${(1 - interpolate(g, [l.at, l.at + 10], [0, 1], clamp)) * 100}% -30% -5%)`}}>{l.text}</div>
          ))}
        </div>
      )}
      <Note text="light refreshments, presumably" x={960} y={760} size={52} rot={-3} at={t.at('Light')} color={pal.subject} />
      <Note text="(wording as described; no scan survives)" x={980} y={870} size={34} rot={-2} at={t.at('Light') + 10} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** Boston, 1850: Gliddon's show. */
const Boston: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Photo src={IMG.party.src} size={IMG.party.size} fx={600} fy={380} z0={1.02} z1={1.12} a={t.at('That same') - 1} b={t.at('The poster')} mask={MASKS.party_bundle} traceAt={t.at('Gliddon') + 4}>
      {() => (
        <>
          {g >= t.at('Boston') && <Highlight text="BOSTON, 1850" x={110} y={90} size={96} at={t.at('Boston')} seed={75} rot={-2} />}
          <Note text="George Gliddon, lecturer" x={110} y={240} size={54} rot={-3} at={t.at('Gliddon')} color="#ffffff" />
          <Note text="$5 = 4 tickets, 3 lectures" x={1060} y={880} size={54} rot={-4} at={t.at('Five dollars')} />
          <Tag text="Illustration · A mummy unwrapping party, 1850" x={44} y={40} />
        </>
      )}
    </Photo>
  );
};

/** The poster: "Daughter of the High Priest of Thebes". */
const Poster: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <AbsoluteFill>
      <DarkPaper />
      <CropCard src={IMG.gliddon.src} size={IMG.gliddon.size} x={170} y={110} w={720} h={860} fx={260} fy={330} scale={1.85} rot={-1.5} at={t.at('The poster') - 2} />
      <Note text="the poster promised:" x={1000} y={170} size={56} rot={-3} at={t.at('promised')} color="#ffffff" />
      <Note text="'Daughter of the" x={1020} y={290} size={70} rot={-4} at={t.at('Daughter')} color={pal.subject} />
      <Note text="High Priest of Thebes'" x={1060} y={400} size={70} rot={-4} at={t.at('High Priest')} color={pal.subject} />
      <Note text="signed up: Boston's top" x={1000} y={580} size={46} rot={-3} at={t.at('signed up')} color="#ffffff" />
      <Note text="doctors and scientists" x={1030} y={670} size={46} rot={-3} at={t.at('signed up') + 4} color="#ffffff" />
      <Tag text="Gliddon's subscription broadsheet, Boston, 1850 · American Antiquarian Society" />
    </AbsoluteFill>
  );
};

/** The drawn bundle again, with a luggage tag: DAUGHTER becomes SON; filing error, 3,000 years ago. */
const Princess: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  const man = t.at('was a man');
  const k = interpolate(g, [man - 4, man + 2], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <DrawnBundle x={260} y={520} s={1} at={t.at('Halfway') - 2} />
      <Sketch pts={[[860, 610], [980, 470]]} x={0} y={0} at={t.at('Halfway') + 6} dur={6} width={4} color="#EDE7DC" smooth={false} />
      <div style={{position: 'absolute', left: 940, top: 330, width: 700, height: 170, background: '#e9dcc0', transform: 'rotate(-8deg)', boxShadow: '0 12px 24px rgba(0,0,0,0.5)', borderRadius: '0 18px 18px 0',
        opacity: g >= t.at('Halfway') + 8 ? 1 : 0}}>
        <div style={{position: 'absolute', left: 24, top: 22, fontFamily: JF.mono, fontSize: 22, color: '#555', letterSpacing: 2}}>CONTENTS</div>
        <div style={{position: 'absolute', left: 24, top: 58, fontFamily: hand.family, fontSize: 34 * hand.scale, color: '#2a2418', whiteSpace: 'nowrap', lineHeight: 1}}>
          <span style={{position: 'relative'}}>{k < 1 ? 'DAUGHTER' : 'SON'}
            {k > 0 && k < 1 && <span style={{position: 'absolute', left: -4, top: '50%', height: 5, width: `${k * 110}%`, background: '#FF9F1C'}} />}
          </span> of the High Priest
        </div>
      </div>
      <Note text="doctors on stage: arguing" x={160} y={150} size={56} rot={-3} at={t.at('arguing')} color="#ffffff" />
      <Note text="last lecture: agreed." x={160} y={250} size={56} rot={-3} at={t.at('agreed')} color="#ffffff" />
      <Note text="the princess was a man." x={160} y={740} size={74} rot={-3} at={man} color={pal.subject} />
      {g >= t.at("Gliddon's explanation") && <Note text="Gliddon's explanation:" x={1040} y={560} size={50} rot={-3} at={t.at("Gliddon's explanation")} color="#ffffff" />}
      <Note text="labels switched in embalming" x={1060} y={650} size={44} rot={-3} at={t.at('labels')} />
      <Stamp text="FILING ERROR, 3,000 YRS AGO" x={150} y={880} at={t.at('Three thousand')} size={70} color={pal.subject} rot={-3} />
      <Note text="Boston applauded." x={1380} y={930} size={56} rot={-4} at={t.at('applauded')} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <OutOfUse t={t} />],
    [at('Europe took') - 1, <Dusty t={t} />],
    [at('And in the 1800s') - 1, <Egyptomania t={t} />],
    [at('In London') - 1, <Pettigrew t={t} />],
    [at('In 1850') - 1, <Invitation t={t} />],
    [at('That same') - 1, <Boston t={t} />],
    [at('The poster') - 1, <Poster t={t} />],
    [at('Halfway') - 1, <Princess t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/m_old_world.mp3" from={0} to={at('And in the 1800s') + 15} volume={0.18} startFrom={30 * 30} fadeOut={20} />
      <Bed src="music/m_parlor.mp3" from={at('And in the 1800s') - 5} to={t.frames + 30} volume={0.2} />
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['In 1718', '1800s', 'Thomas Pettigrew', 'In 1850', 'Boston'].map((c) => <Sfx key={c} at={at(c)} src="sfx/stamp.wav" volume={0.28} />)}
      <Sfx at={at('Three thousand')} src="sfx/stamp.wav" volume={0.38} />
      {['losing faith', 'quite out', 'suggestion', 'stayed', 'fell in love', 'The rich', 'Unwrap', 'audience', 'surgeon', 'called him', 'Guests', 'scrap', 'Party favors', 'lord',
        'Monday', '144', 'A Mummy from', 'unrolled', 'Light', 'Gliddon', 'Five dollars', 'promised', 'Daughter', 'High Priest', 'signed up', 'arguing', 'agreed', 'was a man',
        "Gliddon's explanation", 'labels', 'applauded'].map((c) => <Sfx key={c} at={at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      <Sfx at={at('sent out')} src="sfx/whoosh.wav" volume={0.2} />
    </>
  );
};

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_the_party.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
