// Chapter 3 · In Their Own Words (quiet): the declarations of causes (Georgia, Mississippi, South Carolina), what
// "states' rights" meant in South Carolina's own complaint, Stephens's Cornerstone Speech, the Lost Cause told after
// the war, and the rule: evidence from the moment beats stories told afterward.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch03_in_their_own_words.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {Desk, DropCard, Line, SyncQuote} from '../kit/bs';
import {Doc, sizeOf} from '../kit/dk';
import {Parallax} from '../kit/parallax';
import {ChapterShell, chapterFrames, Definition, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {MASKS} from '../masks';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);

const BONE = '#EDE7DC';
const GA = 'img/ch03/georgia_declaration_of_causes_journal_p1_1861.jpg';
const MS_COVER = 'img/ch03/mississippi_declaration_cover_1861.jpg';
const MS = 'img/ch03/mississippi_declaration_p1_slavery_line_1861.jpg';
const SC_COVER = 'img/ch03/sc_declaration_immediate_causes_cover_1860.jpg';
const SC = 'img/ch03/sc_declaration_immediate_causes_p8_nullify_laws_1860.jpg';
const STEPHENS = 'img/ch01/stephens_portrait_vannerson_1859.jpg';
const DAVIS_BOOK = 'img/ch03/davis_rise_and_fall_title_page_1881.jpg';
const STEPHENS_BOOK = 'img/ch01/stephens_constitutional_view_title_page_1868.jpg';
const MONUMENT = 'img/ch03/confederate_monument_unveiling_arlington_1914.jpg';
const UCV = 'img/ch03/ucv_reunion_veterans_1900.jpg';

/** "Several states wrote out their reasons": the three declarations land on the desk. */
const Letters: React.FC<{t: TL}> = ({t}) => (
  <Desk a={0}>
    <Note text="so why did they go?" x={110} y={80} size={54} rot={-2} at={t.at('why did') - 2} color={BONE} out={t.at('Several states') - 1} />
    <DropCard src={GA} x={200} y={60} w={340} rot={-3} at={t.at('Several states') - 1} />
    <DropCard src={MS_COVER} x={790} y={80} w={340} rot={2} at={t.at('wrote out') - 1} />
    <DropCard src={SC_COVER} x={1380} y={100} w={340} rot={-2} at={t.at('their reasons') - 1} />
    <Note text="declarations of causes" x={190} y={780} size={52} rot={-2} at={t.at('declarations') - 3} />
    <Note text="official breakup letters: here's why we're leaving" x={200} y={890} size={46} rot={-2} at={t.at('official breakup') - 3} color="#ffffff" />
    <Tag text="Georgia, Mississippi and South Carolina declarations of causes, 1860 to 1861 · Internet Archive" x={44} y={40} />
  </Desk>
);

/** A declaration page large on the right, notes in a column on the left. */
const DeclarationPage: React.FC<{src: string; a: number; b: number; fy: number; w?: number; marks: React.ComponentProps<typeof Doc>['marks']; tag: string; children?: React.ReactNode}> = ({
  src, a, b, fy, w = 1200, marks, tag, children,
}) => {
  const sc = w / sizeOf(src)[0];
  return (
    <Desk a={a} push={0.02}>
      <Doc src={src} x={650} y={540 - fy * sc} w={w} rot={1} at={a} push={[a, b]} fx={sizeOf(src)[0] / 2} fy={fy} zoom={1.08} marks={marks} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 12%)'}} />
      {children}
      <Tag text={tag} />
    </Desk>
  );
};

/** Georgia: "numerous and serious causes of complaint ... with reference to the subject of African slavery." */
const Georgia: React.FC<{t: TL}> = ({t}) => (
  <DeclarationPage src={GA} a={t.at("Georgia's opens") - 1} b={t.at("Mississippi's")} fy={3480}
    marks={[{at: t.at('numerous') - 2, to: t.end('African slavery'), swipe: [[650, 3404, 1897, 3449], [210, 3487, 1897, 3539], [210, 3573, 1350, 3626]]}]}
    tag="Georgia declaration of causes, in the convention's Journal, 1861 · Internet Archive">
    <Note text="Georgia" x={128} y={90} size={64} rot={-3} at={t.at("Georgia's opens") + 2} color={BONE} />
    <Note text="January 1861" x={128} y={200} size={46} rot={-3} at={t.at('ten years') - 3} color={BONE} />
    <Note text="translation:" x={128} y={560} size={50} rot={-3} at={t.at('Translation') - 2} color={BONE} />
    <Note text="the complaint" x={126} y={650} size={50} rot={-3} at={t.at('the complaint is') - 2} />
    <Note text="is slavery" x={126} y={740} size={50} rot={-3} at={t.at('is slavery') - 2} />
  </DeclarationPage>
);

/** Mississippi: "Our position is thoroughly identified with the institution of slavery." */
const Mississippi: React.FC<{t: TL}> = ({t}) => (
  <DeclarationPage src={MS} a={t.at("Mississippi's") - 1} b={t.at("You'll often")} fy={2470}
    marks={[{at: t.at('Our position') - 2, to: t.end('institution of slavery'), swipe: [[297, 2405, 2000, 2449], [230, 2498, 520, 2541]]}]}
    tag="A Declaration of the Immediate Causes, Mississippi convention, 1861 · Internet Archive">
    <Note text="Mississippi" x={126} y={90} size={64} rot={-3} at={t.at("Mississippi's") + 2} color={BONE} />
    <Note text="January 1861" x={128} y={200} size={46} rot={-3} at={t.at('even more') - 3} color={BONE} />
    <Note text="translation:" x={128} y={560} size={50} rot={-3} at={t.at('Translation', 2) - 2} color={BONE} />
    <Note text="our whole way of life" x={126} y={650} size={38} rot={-3} at={t.at('our whole') - 2} />
    <Note text="is built on it" x={126} y={740} size={50} rot={-3} at={t.at('built on') - 2} />
  </DeclarationPage>
);

/** "You'll often hear the war was about states' rights." */
const StatesRights: React.FC<{t: TL}> = ({t}) => {
  const a = t.at("You'll often") - 1;
  return (
    <Desk a={a}>
      <Note text="you'll often hear the war was about..." x={140} y={230} size={56} rot={-2} at={a + 3} color={BONE} />
      <Highlight text="STATES' RIGHTS" x={140} y={380} size={120} at={t.at('states rights')} seed={301} rot={-2} />
      <Definition term="states' rights" def="the idea that states, not the national government, should make their own big decisions" at={t.at('states rights') + 9} x={160} y={580} w={1100} />
    </Desk>
  );
};

/** South Carolina: Northern states "have enacted laws which either nullify the Acts of Congress". */
const Carolina: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const o = t.at('In other words');
  return (
    <DeclarationPage src={SC} a={t.at('But South') - 1} b={t.at('Then Stephens')} fy={640} w={1150}
      marks={[{at: t.at('passing') - 2, to: t.end('escaped slavery'), swipe: [[1360, 569, 1682, 612], [190, 648, 1400, 689]]}]}
      tag="Declaration of the Immediate Causes, South Carolina convention, Dec. 1860, p. 8 · Internet Archive">
      <Note text="South Carolina" x={128} y={90} size={52} rot={-3} at={t.at('But South') + 2} color={BONE} />
      <Note text="December 1860" x={126} y={200} size={46} rot={-3} at={t.at('complains') - 3} color={BONE} />
      <Note text="Northern laws" x={126} y={400} size={50} rot={-3} at={t.at('passing') - 2} />
      <Note text="protecting people" x={125} y={480} size={42} rot={-3} at={t.at('to avoid') - 2} />
      <Note text="who escaped slavery" x={125} y={555} size={42} rot={-3} at={t.at('escaped') - 2} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(10,9,7,0.94) 0%, rgba(10,9,7,0.86) 26%, rgba(0,0,0,0) 44%)',
        opacity: interpolate(g, [o - 4, o + 6], [0, 1], clamp)}} />
      <Line text="South Carolina objected to Northern states using their own states' rights." x={122} y={770} at={o} size={56} w={1680} />
    </DeclarationPage>
  );
};

/** Stephens's speech in Savannah. Quiet: trace only, no coral. */
const Speech: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Then Stephens') - 1;
  return (
    <Parallax name="stephens" src={STEPHENS} size={sizeOf(STEPHENS)} a={a} b={t.at('"natural')} fx={1} fy={0.42} cam={{z: [1.22, 1.3]}} depth={1.05}
      mask={MASKS.stephens} tint={null} traceAt={t.at('Stephens') + 3} filter="grayscale(1) contrast(1.1) brightness(0.92)" vignette={0.55}
      tag="Julian Vannerson, Alexander H. Stephens, 1859 · Library of Congress">
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to left, rgba(10,9,7,0.94) 0%, rgba(10,9,7,0.85) 40%, rgba(0,0,0,0) 58%)'}} />
          <Note text="Alexander Stephens" x={1100} y={110} size={60} rot={-3} at={t.at('Stephens') + 2} color={BONE} />
          <Note text="Savannah, March 1861" x={1110} y={220} size={50} rot={-3} at={t.at('Savannah') - 2} />
          <Line text="The new government rests on the idea that Black people were not equal to white people." x={1100} y={420} w={720} size={46} at={t.at('rests on') - 2} />
        </>
      )}
    </Parallax>
  );
};

/** "natural and normal condition": the quote over the dimmed portrait, then the CORNERSTONE SPEECH. */
const Cornerstone: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('"natural') - 1;
  const g = useGFrame();
  return (
    <Parallax name="stephens" src={STEPHENS} size={sizeOf(STEPHENS)} a={a} b={t.at('Davis and')} fx={0.55} fy={0.35} cam={{z: [1.7, 1.78]}} depth={1.04}
      tint={null} filter="grayscale(1) contrast(1.1) brightness(0.4)" vignette={0.7} tag="Julian Vannerson, Alexander H. Stephens, 1859 · Library of Congress">
      {() => (
        <>
          <AbsoluteFill style={{background: 'rgba(8,7,5,0.45)'}} />
          <SyncQuote t={t} phrase={'"natural and normal condition."'} x={160} y={220} w={1600} size={92} />
          <div style={{position: 'absolute', left: 166, top: 380, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2, color: 'rgba(244,239,230,0.8)',
            opacity: g >= t.at('condition') ? 1 : 0}}>ALEXANDER STEPHENS, SAVANNAH, MARCH 21, 1861</div>
          <Highlight text="THE CORNERSTONE SPEECH" x={160} y={560} size={84} at={t.at('Cornerstone')} seed={303} rot={-2} />
          <Definition term="Corner·stone Speech" def="Stephens's 1861 speech naming slavery as the foundation of the new government" at={t.at('Cornerstone') + 9} x={180} y={720} w={1300} />
        </>
      )}
    </Parallax>
  );
};

/** After the war: Davis's and Stephens's books say the South fought for states' rights. */
const Books: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('Davis and') - 1;
  return (
    <Desk a={a}>
      <Note text="after the war, the story changed" x={124} y={87} size={52} rot={-2} at={a + 2} color={BONE} />
      <DropCard src={DAVIS_BOOK} x={240} y={190} w={400} rot={-3} at={a} />
      <DropCard src={STEPHENS_BOOK} x={760} y={200} w={400} rot={2} at={t.at('Stephens both') - 1} />
      <Note text="Davis, 1881" x={290} y={880} size={46} rot={-3} at={a + 6} />
      <Note text="Stephens, 1868" x={800} y={890} size={46} rot={-3} at={t.at('Stephens both') + 4} />
      <Note text="the South fought" x={1270} y={400} size={56} rot={-3} at={t.at('saying') - 3} color={BONE} />
      <Note text="for states' rights" x={1254} y={500} size={56} rot={-3} at={t.at('fought for') - 2} color={BONE} />
      <Tag text="Davis, The Rise and Fall of the Confederate Government, 1881 · Stephens, A Constitutional View of the Late War, 1868 · Internet Archive" x={44} y={1030} />
    </Desk>
  );
};

/** Monuments and reunions: the Lost Cause. */
const LostCause: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('monuments') - 1;
  return (
    <Desk a={a}>
      <DropCard src={MONUMENT} x={110} y={70} w={760} rot={-2} at={a} />
      <Note text="Arlington, 1914" x={140} y={650} size={44} rot={-3} at={a + 6} color={BONE} />
      <DropCard src={UCV} x={1000} y={90} w={720} rot={2} at={t.at('for decades') - 1} />
      <Note text="veterans' reunion, 1900" x={1030} y={700} size={44} rot={-3} at={t.at('for decades') + 6} color={BONE} />
      <Highlight text="THE LOST CAUSE" x={130} y={740} size={96} at={t.at('Lost Cause')} seed={305} rot={-2} />
      <Definition term="Lost Cause" def="the idea that the Confederacy fought a noble fight, and slavery had little to do with it" at={t.at('Lost Cause') + 9} x={150} y={860} w={1620} />
      <Tag text="Unveiling of Confederate monument, Arlington, June 4, 1914 · United Confederate Veterans reunion, Louisville, 1900 · Library of Congress" x={44} y={40} />
    </Desk>
  );
};

/** A hand-drawn box (jittered corners), drawn on. */
const Box: React.FC<{x: number; y: number; w: number; h: number; at: number; color: string; seed?: number}> = ({x, y, w, h, at, color, seed = 1}) => {
  const g = useGFrame();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 8], [0, 1], clamp);
  const j = (k: number) => ((Math.sin(seed * 97 + k * 13.7) * 1000) % 1) * 5;
  const d = `M${x + j(1)},${y + j(2)} L${x + w + j(3)},${y + j(4)} L${x + w + j(5)},${y + h + j(6)} L${x + j(7)},${y + h + j(8)} L${x + j(1) + 4},${y + j(2) - 3}`;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={d} fill="rgba(0,0,0,0.25)" stroke={color} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** A good rule for history: what they said in 1861 vs what they remembered after the war. */
const Rule: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('A good rule') - 1;
  const ul = t.at('evidence from');
  const u = interpolate(g, [ul, ul + 12], [0, 1], clamp);
  const head = (x: number, top: string, sub: string, color: string, show: number) => g >= show && (
    <div style={{position: 'absolute', left: x, top: 330}}>
      <div style={{fontFamily: JF.display, fontSize: 76, lineHeight: 1, color, whiteSpace: 'nowrap'}}>{top}</div>
      <div style={{marginTop: 22, fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: '#f4efe6', whiteSpace: 'nowrap'}}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Note text="a good rule for history:" x={150} y={80} size={58} rot={-2} at={a + 3} color={BONE} />
      <Box x={150} y={270} w={760} h={420} at={a + 6} color={pal.mark} seed={3} />
      <Box x={1010} y={270} w={760} h={420} at={a + 9} color="rgba(237,231,220,0.6)" seed={5} />
      {head(210, '1861', 'WHAT THEY SAID', BONE, a + 8)}
      {head(1070, 'AFTER THE WAR', 'WHAT THEY REMEMBERED', 'rgba(237,231,220,0.75)', a + 11)}
      {g >= ul && <div style={{position: 'absolute', left: 210, top: 520, height: 8, borderRadius: 4, background: pal.mark, width: 540 * u}} />}
      <Note text="slavery" x={220} y={560} size={58} rot={-2} at={ul + 6} />
      <Note text="states' rights" x={1080} y={560} size={58} rot={-2} at={t.at('stories told') - 2} color="rgba(237,231,220,0.75)" />
      <Line text="Evidence from the moment usually beats stories told afterward." x={116} y={740} w={1700} size={48} at={t.at('evidence from')} />
      <Note text="in 1861, the people leaving told us why" x={160} y={850} size={54} rot={-2} at={t.at('In 1861') - 2} color={BONE} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Letters t={t} />],
    [at("Georgia's opens") - 1, <Georgia t={t} />],
    [at("Mississippi's") - 1, <Mississippi t={t} />],
    [at("You'll often") - 1, <StatesRights t={t} />],
    [at('But South') - 1, <Carolina t={t} />],
    [at('Then Stephens') - 1, <Speech t={t} />],
    [at('"natural') - 1, <Cornerstone t={t} />],
    [at('Davis and') - 1, <Books t={t} />],
    [at('monuments') - 1, <LostCause t={t} />],
    [at('A good rule') - 1, <Rule t={t} />],
  ];
  const stamps = [at('states rights'), at('Cornerstone'), at('Lost Cause')];
  const writes = ['why did', 'declarations', 'official breakup', "Georgia's opens", 'Translation', 'the complaint is', "Mississippi's", 'our whole', "You'll often",
    'But South', 'passing', 'escaped', 'Then Stephens', 'Savannah', 'saying', 'A good rule', 'evidence from', 'In 1861'];
  const ticks = [at('Several states') - 1, at('wrote out') - 1, at('their reasons') - 1, at('Davis and') - 1, at('Stephens both') - 1, at('for decades') - 1];
  return (
    <>
      {useScene(cuts)}
      {cuts.slice(1).map(([f], i) => <Sfx key={`c${i}`} at={f} src="sfx/whoosh.wav" volume={0.22} />)}
      {stamps.map((f, i) => <Sfx key={`s${i}`} at={f} src="sfx/stamp.wav" volume={0.2} />)}
      {writes.map((p) => <Sfx key={p} at={at(p) - 4} src={WRITE.src} volume={WRITE.volume * 0.8} />)}
      {ticks.map((f, i) => <Sfx key={`t${i}`} at={f} src="sfx/tick_soft.wav" volume={0.35} />)}
      {[at('numerous'), at('Our position'), at('passing')].map((f, i) => <Sfx key={`h${i}`} at={f} src="sfx/marker_tick.wav" volume={0.16} />)}
    </>
  );
};

export const Ch03: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch03_in_their_own_words.wav" lead={LEAD} quiet music={[{src: 'music/g_pyramid.mp3', volume: 0.088}]}>
    <Body />
  </ChapterShell>
);
