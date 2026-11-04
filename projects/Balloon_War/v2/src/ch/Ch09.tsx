// Chapter 9 · A Thousand Cranes (the ending), then a 20 s music-only end screen. Quiet and warm: no jokes; coral only on the
// beat's subject (the cranes, the balloon in the bookstore photo). Scene plan: script/SCENES_v2.md "ch09". Cuts 1 frame before the
// word that starts the idea; each scene in a <Sequence from={cut}>.
//   0:00  "Seventeen days after the picnic"      the radio, MAY 22, 1945, SILENCE BROKEN, don't touch it
//   0:09  "Saving even one American life"       the War and Navy Departments' statement, quote card
//   0:15  "Was the silence the right call?"      two columns on the desk, no verdict
//   0:26  "Then the war ended ... August 15"     split frame: Japan (BW15) | Washington (BW14), AUGUST 15, 1945
//   0:33  "That morning in Japan"                BW15, smoke behind the town; Tatsuo (no photo used), burn the documents
//   0:42  "Then he heard the Emperor"            the Asahi extra: an important broadcast at noon
//   0:47  "The grown-ups around him wept"        Japanese civilians hearing the broadcast; he wasn't surprised
//   0:51  "In Washington ... Byron Price"        BW14, push into the door: OUT OF BUSINESS lettered on the blank card
//   0:59  "And Rei Minamimura grew up"           BW09 (no photo used), still didn't know
//   1:05  "Until one day ... a bookstore"        BW16, the photo in the window glows, push in; WHAT SHE'D MADE
//   1:16  "She went to the government"          the washi stack, records, other women, their stories
//   1:22  "She called it"                        quote: "an act of resistance against being erased"
//   1:26  "She wasn't the only one remembering"  JOHN TAKESHITA (no photo used)
//   1:35  "When he was a boy"                    Tule Lake camp prints (tagged: not Takeshita)
//   1:38  "in a camp ... about fifty miles from Bly" GearhartTerrain (3D): pull back from the monument to Tule Lake, ≈ 46 MILES
//   1:42  "He started passing letters"           Japan <-> Bly, drawn
//   1:46  "And in 1987"                          the Mitchell Monument, 1987
//   1:51  "A thousand paper cranes"              BW05_cranes
//   1:56  "In Japan, a thousand cranes is a wish for peace"  two cranes; the paper crane in coral
//   2:02  "So let's go back to the question"     BW03, HOW DID IT GET HERE?; the answer, one line each over BW06, BW09, BW01
//   2:20  "And why did nobody warn those kids?"  BW12, WHY NO WARNING?; silence was a weapon; BW04, six people
//   2:29  "A war that came to Bly"              BW05_cranes, the closing line in plain type
//   2:35  "Thanks for watching"                  the end screen (20 s)
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import words from '../../public/audio/v2_ch09_a_thousand_cranes.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, Note, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, Quote, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Print} from '../kit/print';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {NoPhoto, Plain, QuietPrint, Zoom} from './ch08/parts';
import {DoorSign, CARD_PLANE} from './ch09/door';
import {GearhartTerrain} from '../fx/GearhartTerrain';
import {EndScreen, END_FRAMES} from './ch09/EndScreen';

const N = words as Narration;
const T = makeTimeline(N, 30);
const THANKS = T.at('Thanks');
/** The end screen runs 20 s from "Thanks", past the narration: the chapter is that much longer (the shell's `extra`). */
const EXTRA = THANKS + END_FRAMES - Math.ceil(N.duration * 30);
export const CH09_FRAMES = chapterFrames(N, LEAD) + EXTRA;

type S = {t: TL; a: number; b: number};

/** "Seventeen days after the picnic, the government broke its silence. It warned the country: ...don't touch it." */
const Warn: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="radio" x={220} y={330} w={620} at={2} trace={false} />
    <Note text="May 22, 1945" x={980} y={190} size={64} rot={-4} at={t.at('Seventeen') - a} />
    <Highlight text="SILENCE BROKEN" x={960} y={360} size={88} at={t.at('broke') - a} seed={91} rot={-2} />
    <Note text="found something strange?" x={1000} y={600} size={54} rot={-3} at={t.at('if you find') - a} />
    <Note text="don't touch it" x={1080} y={760} size={64} rot={-4} at={t.at("don't touch") - a} />
  </AbsoluteFill>
);

/** "Saving even one American life, it said, was worth more than anything Japan might learn." */
const Statement: React.FC<S> = () => (
  <AbsoluteFill>
    <DarkPaper />
    <AbsoluteFill style={{background: 'radial-gradient(circle 760px at 900px 500px, rgba(255,214,160,0.07) 0%, transparent 100%)'}} />
    <Quote text="…the possible saving of even one American life… would more than offset any military gain" at={2} x={200} y={370} w={1480} size={64}
      who="War and Navy Departments, 22 May 1945" />
  </AbsoluteFill>
);

/** "Was the silence the right call? It kept Japan blind, and it helped end the attacks. It also meant six people never got a warning." */
const RightCall: React.FC<S> = ({t, a}) => {
  const g = useGFrame();
  const line = interpolate(g, [t.at('kept') - a - 4, t.at('kept') - a + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="THE RIGHT CALL?" x={600} y={110} size={88} at={t.at('right call') - a} seed={93} rot={-2} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={960} y1={330} x2={960} y2={330 + 520 * line} stroke="rgba(244,239,230,0.45)" strokeWidth={4} strokeLinecap="round" />
      </svg>
      <Note text="kept Japan blind" x={250} y={380} size={60} rot={-3} at={t.at('kept') - a} />
      <Note text="helped end the attacks" x={200} y={560} size={56} rot={-3} at={t.at('helped') - a} />
      <Note text="six people" x={1150} y={380} size={60} rot={-3} at={t.at('six') - a} />
      <Note text="never got a warning" x={1100} y={560} size={56} rot={-3} at={t.at('never got') - a} />
      <Note text="people still argue" x={700} y={820} size={54} rot={-2} at={t.at('argue') - a} color="#ece6d8" />
    </AbsoluteFill>
  );
};

/** One half of a split frame: a 960 px window onto a full-frame scene, showing screen x from `from`. */
const Half: React.FC<{left: number; from: number; children: React.ReactNode}> = ({left, from, children}) => (
  <div style={{position: 'absolute', left, top: 0, width: 957, height: 1080, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: -from, top: 0, width: 1920, height: 1080}}>{children}</div>
  </div>
);

/** "Then the war ended. And on August 15, 1945, both sides of this story started to disappear." */
const Split: React.FC<S> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const dim = interpolate(f, [t.at('disappear') - a, t.at('disappear') - a + 24], [0, 0.55], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Half left={0} from={260}><SilScene name="BW15_aug15_japan" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.08], x: [0, -10], y: [0, -4]}} fog={0.25} /></Half>
      <Half left={963} from={0}><SilScene name="BW14_aug15_dc" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.08], x: [0, 10], y: [0, -4]}} fog={0.15} /></Half>
      <AbsoluteFill style={{background: `rgba(0,0,0,${dim})`}} />
      <Highlight text="AUGUST 15, 1945" x={600} y={120} size={92} at={t.at('August') - a} seed={95} rot={-2} />
      <Note text="Japan" x={180} y={840} size={64} rot={-4} at={t.at('both sides') - a} />
      <Note text="Washington" x={1180} y={840} size={64} rot={-4} at={t.at('both sides') - a + 6} />
    </AbsoluteFill>
  );
};

/** "That morning in Japan, the secret lab got orders to destroy the evidence. Tatsuo Ogawa helped burn the documents and bury the ashes." */
const Lab: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW15_aug15_japan" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.16], x: [0, -70], y: [0, 14]}} fog={0.3} />
    <Note text="destroy the evidence" x={170} y={150} size={56} rot={-3} at={t.at('destroy') - a} />
    <Note text="burn the documents, bury the ashes" x={170} y={290} size={52} rot={-3} at={t.at('burn') - a} />
    <NoPhoto text="Tatsuo Ogawa · no photo used" at={t.at('Tatsuo') - a} />
  </AbsoluteFill>
);

/** "Then he heard the Emperor announce the surrender, standing in a vegetable patch in front of his house." */
const Broadcast: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/v2/japan/asahi_extra_15aug1945_clipping.jpg" x={330} y={80} w={330} h={838} at={1} rot={-1} fit="contain"
      tag="Asahi Shimbun extra, 15 August 1945" />
    <div style={{position: 'absolute', left: 760, top: 160, fontFamily: '"IBM Plex Mono", monospace', fontSize: 22, letterSpacing: 2, color: 'rgba(244,239,230,0.75)'}}>
      “AN IMPORTANT BROADCAST AT NOON TODAY”
    </div>
    <Note text="the Emperor, on the radio" x={780} y={330} size={58} rot={-3} at={t.at('Emperor') - a} />
    <Note text="in a vegetable patch" x={840} y={560} size={56} rot={-3} at={t.at('vegetable') - a} />
  </AbsoluteFill>
);

/** "The grown-ups around him wept. He wasn't surprised." */
const Wept: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <QuietPrint src="img/v2/japan/japanese_civilians_listen_surrender_broadcast_1945.jpg" x={180} y={130} w={980} h={690} at={0} rot={-1} pos="50% 50%"
      tag="Hearing the surrender broadcast, Japan, 15 August 1945" />
    <Note text="he wasn't surprised" x={1230} y={460} size={52} rot={-3} at={t.at("He wasn't") - a} />
  </AbsoluteFill>
);

/** "In Washington, on the same date, Byron Price ended the censorship rules and hung a sign on his office door: 'Out of Business.'" */
const Door: React.FC<S> = ({t, a, b}) => {
  const push = t.at('hung') - a - 6;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Zoom a={push} b={t.at('Out of') - a + 4} s={2.6} ox={373} oy={356} tx={820} ty={470}>
        <SilScene name="BW14_aug15_dc" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.06], x: [0, 0], y: [0, 0]}} fog={0.12}
          insert={[{plane: CARD_PLANE, node: <DoorSign at={t.at('Out of') - a} at2={t.at('Business') - a} />}]} />
      </Zoom>
      <Note text="Byron Price" x={1140} y={240} size={60} rot={-3} at={t.at('Byron') - a} out={push} />
      <Note text="censorship ends" x={1140} y={420} size={60} rot={-3} at={t.at('ended the censorship') - a} out={push} />
    </AbsoluteFill>
  );
};

/** "And Rei Minamimura grew up, got married, raised her children... and still didn't know." */
const Rei: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW09_rei" a={0} b={b - a} fade={1} cam={{z: [1.1, 1.04], x: [-10, 10], y: [-10, 0]}} fog={0.2}
      dust={{x: 1080, y: 260, w: 560, h: 760, n: 30, seed: 'rei9'}} />
    <NoPhoto text="Rei Minamimura · no photo used" at={t.at('Rei') - a} />
    <Note text="grew up, married, raised a family" x={880} y={130} size={50} rot={-3} at={t.at('grew') - a} />
    <Note text="still didn't know" x={1080} y={300} size={60} rot={-4} at={t.at("still didn't") - a} />
  </AbsoluteFill>
);

/** "Until one day, decades later, she walked past a bookstore and saw a photograph in the window. A paper balloon... what she'd made." */
const Bookstore: React.FC<S> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const glowAt = t.at('photograph') - a;
  const glow = interpolate(f, [glowAt, glowAt + 18], [0, 1], clamp) * (0.85 + 0.15 * Math.sin((f - glowAt) / 9));
  const ins = (
    <div style={{position: 'absolute', left: `${((2040 - 340) / 2752) * 100}%`, top: `${((770 - 340) / 1536) * 100}%`, width: `${(680 / 2752) * 100}%`,
      height: `${(680 / 1536) * 100}%`, borderRadius: '50%', opacity: glow, mixBlendMode: 'screen',
      background: 'radial-gradient(circle, rgba(255,226,190,0.55) 0%, rgba(255,180,150,0.22) 35%, transparent 70%)'}} />
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Zoom a={t.at('A paper balloon') - a - 10} b={t.at('glued') - a} s={1.9} ox={1445} oy={541} tx={1150} ty={540}>
        <SilScene name="BW16_bookstore" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.07], x: [0, -6], y: [0, -4]}} fog={0.2} insert={[{plane: 1, node: ins}]} />
      </Zoom>
      <Note text="decades later" x={200} y={150} size={60} rot={-4} at={t.at('decades') - a} out={t.at('A paper balloon') - a - 10} />
      <Highlight text="WHAT SHE'D MADE" x={160} y={820} size={84} at={t.at('realized') - a} seed={97} rot={-2} />
    </AbsoluteFill>
  );
};

/** "She went to the government for records. She found other women who'd done the same work and wrote down their stories." */
const Records: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="washi_stack" x={240} y={250} w={560} at={2} />
    <Note text="the government's records" x={920} y={200} size={54} rot={-3} at={t.at('records') - a} />
    <Note text="other women who did the work" x={920} y={400} size={52} rot={-3} at={t.at('other women') - a} />
    <Note text="their stories, written down" x={920} y={600} size={54} rot={-3} at={t.at('wrote') - a} />
  </AbsoluteFill>
);

/** "She called it an act of resistance against being erased." */
const Erased: React.FC<S> = ({a, b}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{opacity: 0.28}}>
      <SilScene name="BW09_rei" a={0} b={b - a} fade={1} cam={{z: [1.12, 1.16], x: [0, -10], y: [0, -6]}} fog={0.2} />
    </AbsoluteFill>
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.45)'}} />
    <Quote text="an act of resistance against being erased" at={2} x={180} y={380} w={1600} size={70} who="Rei Minamimura" />
  </AbsoluteFill>
);

/** "She wasn't the only one remembering. In the 1980s, a professor named John Takeshita learned that the wife of a childhood friend..." */
const Takeshita: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <AbsoluteFill style={{background: 'radial-gradient(circle 700px at 760px 420px, rgba(255,214,160,0.07) 0%, transparent 100%)'}} />
    <Note text="she wasn't the only one" x={200} y={160} size={56} rot={-3} at={4} />
    <Highlight text="JOHN TAKESHITA" x={200} y={330} size={100} at={t.at('John') - a} seed={99} rot={-2} />
    <NoPhoto text="A professor, 1980s · no photo used" at={t.at('John') - a + 8} x={230} y={490} />
    <Note text="a childhood friend's wife" x={260} y={620} size={58} rot={-3} at={t.at('wife') - a} />
    <Note text="had made those balloons as a girl" x={360} y={770} size={56} rot={-3} at={t.at('made those') - a} />
  </AbsoluteFill>
);

/** "When he was a boy, the US government had held him and his family" the Tule Lake camp prints (tagged: not Takeshita). */
const Camp: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch07_answer/tule_lake_birds_eye_view_wra.jpg" x={150} y={150} w={960} h={640} at={1} rot={-1} pos="50% 60%"
      tag="Tule Lake camp, California · War Relocation Authority / National Archives" />
    <Print src="img/ch07_answer/tule_lake_boys_at_recess_wra.jpg" x={1230} y={120} w={460} h={600} at={t.at('boy') - a} rot={2} pos="50% 70%"
      tag="Tule Lake children · not John Takeshita · WRA" />
  </AbsoluteFill>
);

/** "...in a camp for Japanese Americans, about fifty miles from Bly." GearhartTerrain (3D): from the monument the camera pulls back south
 *  to the Tule Lake camp; the dashed line and "≈ 46 MILES" (straight line; the narration's "about fifty") land on "about fifty". */
const CampMap: React.FC<S> = ({t, a}) => {
  const pull = 50;
  return (
    <AbsoluteFill>
      <GearhartTerrain at={0} markerAt={-30} pullBackAt={t.at('fifty') - a - pull * 1.1} pullDur={pull} />
    </AbsoluteFill>
  );
};

/** "He started passing letters between women in Japan and the families in Bly." */
const Letters: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="Japan" x={250} y={470} size={80} rot={-3} at={t.at('women in Japan') - a} />
    <Note text="Bly" x={1480} y={470} size={80} rot={-3} at={t.at('families in Bly') - a + 10} />
    <Arrow x1={520} y1={480} x2={1420} y2={480} bow={-170} at={t.at('letters') - a} dur={14} />
    <Arrow x1={1420} y1={600} x2={520} y2={600} bow={-170} at={t.at('families') - a} dur={14} />
    <Note text="letters" x={860} y={250} size={62} rot={-3} at={t.at('letters') - a + 8} />
  </AbsoluteFill>
);

/** "And in 1987, he carried something to the memorial in those woods." */
const Memorial: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Zoom a={0} b={b - a} s={1.04} ox={760} oy={480}>
      <QuietPrint src="img/ch06_bly/mitchell_monument_usfs_2007.jpg" x={200} y={140} w={1040} h={690} at={0} rot={-1} pos="50% 50%"
        tag="The Mitchell Monument, Gearhart Mountain, 2007 · USFS" />
    </Zoom>
    <Note text="1987" x={1380} y={250} size={96} rot={-4} at={t.at('1987') - a} />
    <Note text="to the memorial" x={1300} y={500} size={58} rot={-3} at={t.at('memorial') - a} />
  </AbsoluteFill>
);

/** "A thousand paper cranes, folded by women who'd glued balloons as schoolgirls." */
const Cranes: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW05_cranes" a={0} b={b - a} fade={1} cam={{z: [1.04, 1.12], x: [20, -10], y: [0, -8]}} fog={0.3} />
    <Note text="a thousand paper cranes" x={980} y={150} size={58} rot={-3} at={t.at('thousand') - a} />
    <Note text="folded by the women who glued" x={940} y={300} size={50} rot={-3} at={t.at('folded') - a} />
  </AbsoluteFill>
);

/** "In Japan, a thousand cranes is a wish for peace. They sent them as a sign of their regret." */
const Peace: React.FC<S> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Print src="img/ch07_answer/two_paper_cranes_closeup_pd.jpg" x={170} y={200} w={900} h={550} at={1} rot={-1} pos="50% 50%"
      tag="Folded paper cranes · Laitche, Wikimedia Commons" />
    <Prop name="paper_crane" x={1180} y={540} w={520} at={t.at('cranes is') - a} coral trace from="top" />
    <Note text="a wish for peace" x={1180} y={180} size={62} rot={-3} at={t.at('wish') - a} />
    <Note text="and a sign of regret" x={1180} y={350} size={56} rot={-3} at={t.at('regret') - a} />
  </AbsoluteFill>
);

/** "So let's go back to the question. How does a paper balloon from Japan end up in a forest in Oregon?" */
const Question: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW03_woods_open" a={0} b={b - a} fade={1} cam={{z: [1.06, 1.14], x: [-10, 10], y: [0, -8]}} fog={0.3} />
    <AbsoluteFill style={{background: 'rgba(8,7,5,0.3)'}} />
    <Highlight text="HOW DID IT GET HERE?" x={160} y={150} size={92} at={t.at('How does') - a} seed={21} rot={-3} />
  </AbsoluteFill>
);

/** One line of the answer over a silhouette scene. */
const Recap: React.FC<{a: number; b: number; name: string; line: string; at: number; x: number; y: number; cam: {z: [number, number]; x: [number, number]; y: [number, number]};
  dust?: boolean; children?: React.ReactNode}> = ({a, b, name, line, at, x, y, cam, dust, children}) => (
  <AbsoluteFill>
    <SilScene name={name} a={0} b={b - a} fade={1} cam={cam} fog={0.25} dust={dust ? {x: 1080, y: 260, w: 560, h: 760, n: 30, seed: 'rei10'} : undefined} />
    {children}
    <Note text={line} x={x} y={y} size={62} rot={-3} at={at} />
  </AbsoluteFill>
);

/** "A war that came to Bly on paper balloons... ended there with paper birds." */
const Closing: React.FC<S> = ({t, a, b}) => (
  <AbsoluteFill>
    <SilScene name="BW05_cranes" a={0} b={b - a + 12} fade={1} cam={{z: [1.12, 1.04], x: [-10, 10], y: [-8, 0]}} fog={0.35} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 45%, rgba(6,6,5,0.8) 100%)'}} />
    <Plain parts={[['A war that came to Bly on paper balloons…\n', t.at('A war') - a], ['ended there with paper birds.', t.at('ended there') - a]]}
      x={200} y={760} w={1520} size={56} align="center" />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = T;
  const at = t.at;
  const c = {
    quote: at('Saving') - 1, call: at('Was the silence') - 1, aug: at('Then the war') - 1, lab: at('That morning') - 1, radio: at('Then he heard') - 1,
    wept: at('The grown-ups') - 1, dc: at('In Washington') - 1, rei: at('And Rei') - 1, book: at('Until one day') - 1, records: at('She went to') - 1,
    erased: at('She called it') - 1, tak: at("She wasn't the only") - 1, camp: at('When he was a boy') - 1, campMap: at('in a camp') - 1, letters: at('He started passing') - 1,
    memorial: at('And in 1987') - 1, cranes: at('A thousand paper cranes') - 1, peace: at('In Japan, a thousand') - 1, q: at("So let's go back") - 1,
    r1: at('A country wanted') - 1, r2: at('A girl glued') - 1, r3: at('A boy filled') - 1, why: at('And why did') - 1, six: at('And it left') - 1,
    closing: at('A war that came') - 1,
  };
  const seq = (from: number, node: React.ReactNode): [number, React.ReactNode] => [from, <Sequence from={from} layout="none">{node}</Sequence>];
  const cuts: [number, React.ReactNode][] = [
    seq(0, <Warn t={t} a={0} b={c.quote} />),
    seq(c.quote, <Statement t={t} a={c.quote} b={c.call} />),
    seq(c.call, <RightCall t={t} a={c.call} b={c.aug} />),
    seq(c.aug, <Split t={t} a={c.aug} b={c.lab} />),
    seq(c.lab, <Lab t={t} a={c.lab} b={c.radio} />),
    seq(c.radio, <Broadcast t={t} a={c.radio} b={c.wept} />),
    seq(c.wept, <Wept t={t} a={c.wept} b={c.dc} />),
    seq(c.dc, <Door t={t} a={c.dc} b={c.rei} />),
    seq(c.rei, <Rei t={t} a={c.rei} b={c.book} />),
    seq(c.book, <Bookstore t={t} a={c.book} b={c.records} />),
    seq(c.records, <Records t={t} a={c.records} b={c.erased} />),
    seq(c.erased, <Erased t={t} a={c.erased} b={c.tak} />),
    seq(c.tak, <Takeshita t={t} a={c.tak} b={c.camp} />),
    seq(c.camp, <Camp t={t} a={c.camp} b={c.campMap} />),
    seq(c.campMap, <CampMap t={t} a={c.campMap} b={c.letters} />),
    seq(c.letters, <Letters t={t} a={c.letters} b={c.memorial} />),
    seq(c.memorial, <Memorial t={t} a={c.memorial} b={c.cranes} />),
    seq(c.cranes, <Cranes t={t} a={c.cranes} b={c.peace} />),
    seq(c.peace, <Peace t={t} a={c.peace} b={c.q} />),
    seq(c.q, <Question t={t} a={c.q} b={c.r1} />),
    seq(c.r1, <Recap a={c.r1} b={c.r2} name="BW06_raid_tokyo" line="revenge, a wind, and kids" at={at('revenge') - c.r1} x={170} y={160}
      cam={{z: [1.04, 1.1], x: [-20, 10], y: [0, -6]}} />),
    seq(c.r2, <Recap a={c.r2} b={c.r3} name="BW09_rei" line="she didn't know" at={at('glued it') - c.r2} x={1100} y={160}
      cam={{z: [1.06, 1.1], x: [10, -6], y: [0, -6]}} dust />),
    seq(c.r3, <Recap a={c.r3} b={c.why} name="BW01_beach_dawn" line="sure it could never win" at={at('sure') - c.r3} x={1000} y={160}
      cam={{z: [1.04, 1.1], x: [-20, 10], y: [0, -6]}} />),
    seq(c.why, <Recap a={c.why} b={c.six} name="BW12_price_desk" line="silence was a weapon too" at={at('Because') - c.why} x={180} y={300}
      cam={{z: [1.05, 1.12], x: [10, -10], y: [0, -6]}}>
      <Highlight text="WHY NO WARNING?" x={150} y={120} size={84} at={at('why did') - c.why} seed={25} rot={-2} />
    </Recap>),
    seq(c.six, <Recap a={c.six} b={c.closing} name="BW04_bly_road" line="six people, no warning" at={at('six', 2) - c.six} x={260} y={180}
      cam={{z: [1.05, 1.09], x: [0, -10], y: [0, -4]}} />),
    seq(c.closing, <Closing t={t} a={c.closing} b={THANKS} />),
  ];
  const scene = useScene(cuts);
  const XF = 12; // the closing picture dissolves into the end screen
  const out = interpolate(frame, [THANKS, THANKS + XF], [1, 0], clamp);
  const notes: [string, number?][] = [['Seventeen'], ['if you find'], ["don't touch"], ['kept'], ['helped'], ['six'], ['never got'], ['argue'], ['both sides'],
    ['destroy'], ['burn'], ['Emperor'], ['vegetable'], ["He wasn't"], ['Byron'], ['ended the censorship'], ['grew'], ["still didn't"], ['decades'], ['records'], ['other women'], ['wrote'],
    ['wife'], ['made those'], ['letters'], ['women in Japan'], ['families in Bly'], ['1987'], ['memorial'], ['thousand'], ['folded'], ['wish'], ['regret'], ['revenge'], ['glued it'], ['sure'],
    ['Because'], ['six', 2]];
  const titles: [string, number?][] = [['broke'], ['right call'], ['August'], ['realized'], ['John'], ['How does'], ['why did']];
  return (
    <AbsoluteFill>
      {frame < THANKS ? scene : (
        <>
          <Sequence from={THANKS} layout="none"><EndScreen start={THANKS} subscribe={at('subscribe')} more={at('more stories')} /></Sequence>
          {frame < THANKS + XF && <AbsoluteFill style={{opacity: out}}>{scene}</AbsoluteFill>}
        </>
      )}
      {cuts.slice(1).map(([f]) => <Sfx key={f} at={f} src="sfx/whoosh.wav" volume={0.2} />)}
      {notes.map(([p, k]) => <Sfx key={`${p}${k ?? ''}`} at={at(p, k) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {titles.map(([p, k]) => <Sfx key={p} at={at(p, k)} src="sfx/stamp.wav" volume={0.22} />)}
      <Sfx at={2} src="sfx/radio_static.wav" volume={0.12} />
      <Sfx at={at('Out of') - 2} src="sfx/marker_tick.wav" volume={0.3} />
      <Sfx at={at('Business') - 2} src="sfx/marker_tick.wav" volume={0.3} />
      <Sfx at={c.records + 2} src="sfx/paper_rustle.wav" volume={0.2} />
      <Sfx at={at('cranes is') - 1} src="sfx/paper_slap_soft.wav" volume={0.25} />
      {/* end screen (relative to "Thanks", as in Diamond Hoax) */}
      <Sfx at={THANKS + 2} src="sfx/stamp.wav" volume={0.28} />
      <Sfx at={THANKS + 8} src="sfx/chunk_snap.wav" volume={0.3} />
      {[at('more stories'), at('subscribe')].map((x) => <Sfx key={x} at={x - 2} src={WRITE.src} volume={WRITE.volume} />)}
    </AbsoluteFill>
  );
};

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/v2_ch09_a_thousand_cranes.wav" lead={LEAD} extra={EXTRA}
    music={[{src: 'music/bw_a_thousand_cranes.mp3', volume: bed('bw_a_thousand_cranes')}]}>
    <Body />
  </ChapterShell>
);
