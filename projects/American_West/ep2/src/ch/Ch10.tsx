// Chapter 10 · The Last of the Five Thousand (77.1 s + the 20 s music-only end screen).
// Back to the question, quick callback cards (McCoy, Goodnight, the Homestake, the cowboys and Bose Ikard, the Lakota's treaty),
// the Promise Ledger (Ep 1's row already written; row two writes in), the closing line over Russell's painting, the homestead
// hand-off and the end screen (clean slots for YouTube's elements, the static Chunk History mark).
// Shot list (narration words → shot):
//  A "So who actually got rich?"                 the question in bare handwriting over the blurred painting, "rich" coral
//  B "The men with herds…money behind them."     desk: a longhorn and the coin stack, two lines
//  C "McCoy's cattle trade made fortunes in Kansas." McCoy (1874 engraving), ABILENE, KANSAS
//  D "Goodnight, with money from a British investor…Texas." Goodnight print (coral), the notes
//  E "The Homestake made its owners rich…century." the open cut print, 1877 → 2002
//  F "The cowboys got wages."                    desk: the saddle, ≈ $25–40 A MONTH
//  G "Some, especially Black and Mexican cowboys…town." Bose Ikard print, the notes
//  H "And the Lakota got a treaty…gold under it." the 1868 treaty, Article II; the nugget drops onto it
//  I "Let's write it down. Row two."             the Promise Ledger lands, row one (Ep 1) already written
//  J "The promise: anyone with nerve can get rich." push: row two's promise writes in
//  K "Who got it? …for a while."                 pan: who got it
//  L "Who didn't? …the small ranchers…fenced out," pan: who didn't (coral)
//  M "and the Lakota, whose land was mined."     pull back to the whole ledger
//  N "So look at the steer again."               the painting, push to the steer (coral trace)
//  O "It took about twenty years…a fortune."     the closing line over the dimmed painting
//  P "It took one winter…a painting."            THE LAST OF THE FIVE THOUSAND; "the cowboys moved on"
//  Q "The farmers stayed…something even bigger than grass." Butcher's sod house print on the desk
//  R "The land itself."                           push into the homestead; → Episode 3
//  S "Thanks for watching…" + 20 s               the end screen
import React from 'react';
import {bed} from '../kit/levels';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch10_the_last_of_the_5000.words.json';
import {clamp} from '../lib/anim';
import {boxOf, JF, Note, Tag, useGFrame, useHand, usePal} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {ChapterShell, chapterFrames, FADE, LEAD, makeTimeline, TAIL, type Narration} from '../kit/shell';
import {keys, Lift, Mono, PhotoCam, ScrimTag, SHADOW, SlapTitle, SoftTint, Tape, tornPoly, TornPrint, useDrop, zkeys} from '../kit/west';
import {DeskCam, Float, Label, Prop} from '../kit/ch04_extra';
import {DeskShot, Hand, Print, Sounds, WShots} from '../kit/ch07_extra';
import {Bust, PROP} from '../kit/ch07_10_extra';
import type {MaskRef} from '../kit/maskref';
import {M10} from '../masks_ch10';

const N = words as Narration;
/** The music-only end screen after the narration (about 20 s), added to the chapter's length. */
const EXTRA = 600;
export const CH10_FRAMES = chapterFrames(N, LEAD) + EXTRA;
const T = makeTimeline(N, 30);
const at = T.at;
const END = T.frames + TAIL + FADE + EXTRA;

const I = {
  paint: 'img/ch01/chinook_1887_restored.jpg',
  mccoy: 'img/ch02/mccoy_portrait_engraving_1874.jpg',
  goodnight: 'img/ch04/b_goodnight_1905.jpg',
  homestake: 'img/ch07/b_homestake_open_cut_1888.jpg',
  ikard: 'img/ch05/b_ikard_up.jpg',
  treaty: 'img/ch06/fort_laramie_treaty_1868_p2_article2.jpg',
  sod: 'img/ch10/b_sod_house_rawding_1886.jpg',
};
const Z = {
  paint: [4000, 2847] as [number, number],
  mccoy: [1800, 2709] as [number, number],
  goodnight: [820, 800] as [number, number],
  homestake: [1920, 2738] as [number, number],
  ikard: [800, 976] as [number, number],
  treaty: [3349, 5080] as [number, number],
  sod: [3000, 2243] as [number, number],
};
const TAG = {
  paint: 'C. M. Russell, Waiting for a Chinook, 1887, watercolor · Montana Historical Society · enhanced from a small scan',
  mccoy: 'Joseph G. McCoy, Historic Sketches of the Cattle Trade, 1874 · Internet Archive',
  goodnight: 'Charles Goodnight · via Wikimedia Commons',
  homestake: 'J. C. H. Grabill, Open cut in the great Homestake mine, 1888 · Library of Congress',
  ikard: 'Bose Ikard · via Wikimedia Commons',
  treaty: 'Treaty of Fort Laramie, 1868, Article II · National Archives',
  sod: 'S. D. Butcher, the Rawding family sod house, Custer County, Nebraska, 1886 · Library of Congress',
};
/** The painting in black and white, a little warm (as ch01). */
const PBW = 'grayscale(1) sepia(0.12) contrast(1.15) brightness(0.98)';

// ───────────────────────── the painting on the desk ─────────────────────────

const PaintPrint: React.FC<{at: number; blur?: number; dim?: number; tint?: number; traceAt?: number}> = ({at: a, blur = 0, dim = 1, tint = 0, traceAt}) => (
  <Lift x={240} y={160} w={1400} hgt={1400 * (Z.paint[1] / Z.paint[0])} h={8} at={a} rot={-2} seed={101} blur={blur}>
    <TornPrint src={I.paint} size={Z.paint} x={0} y={0} w={1400} at={-99} seed={102} real grey shadow={5} filter={`${PBW} brightness(${dim})`} mask={M10.c1_steer_1887} tint={tint} traceAt={traceAt}
      tapes={[{x: -40, y: 20, w: 160, rot: -36}, {x: 1280, y: -8, w: 160, rot: 28}]} />
  </Lift>
);

// A · so who actually got rich?
const Question: React.FC = () => {
  const f = useCurrentFrame();
  const b = at('The men') - 1;
  return (
    <DeskShot tilt={keys(f, [[0, 30], [b, 24]])} z={zkeys(f, [[0, 0.84], [b, 0.9]])} y={60}
      over={<Hand parts={[['so who actually got '], ['rich?', true]]} x={260} y={430} size={120} at={at('who') - 3} />}>
      <div style={{filter: 'blur(3px) brightness(0.45)'}}><PaintPrint at={-99} /></div>
    </DeskShot>
  );
};

// B · herds and money
const Herds: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The men') - 1;
  const b = at("McCoy's") - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 22, 0.94, 0, 0, -2], [b, 16, 1.02, -20, 0, 0]]}>
        <Float x={900} y={330} w={620} hgt={480} h={12} at={at('herds') - 2} rot={-4} seed={103}>
          <Prop src={PROP('p2_longhorn')} m={M10.p2_longhorn} x={0} y={0} w={600} at={-99} />
        </Float>
        <Float x={1540} y={300} w={420} hgt={520} h={18} at={at('money') - 2} rot={5} seed={104}>
          <Prop src={PROP('p2_coin_stack')} m={M10.p2_coin_stack} x={0} y={0} w={380} at={-99} />
        </Float>
      </DeskCam>
      <Hand parts={[['the men with herds,']]} x={130} y={160} size={76} at={at('herds') - 3} />
      <Hand parts={[['and the men with '], ['money', true], [' behind them']]} x={150} y={280} size={68} at={at('money') - 4} />
    </AbsoluteFill>
  );
};

// C–H · callback cards: a print on the desk, notes beside it
const Card: React.FC<{src: string; size: [number, number]; crop: [number, number, number, number]; a: number; b: number; tag: string; w?: number; rot?: number; x?: number; y?: number;
  bust?: {mask: MaskRef; cutY?: number; traceAt?: number}; children?: React.ReactNode; under?: React.ReactNode}> = ({src, size, crop, a, b, tag, w = 640, rot = 2, x = 1140, y = 60, bust, children, under}) => {
  const f = useCurrentFrame();
  return (
    <DeskShot tilt={keys(f, [[a, 18], [b, 13]])} z={zkeys(f, [[a, 0.94], [b, 1.02]])} x={keys(f, [[a, 30], [b, -30]])} hits={[a + 5]} lamp={[1300, 460]}
      over={<>{children}<ScrimTag text={tag} /></>}>
      {bust ? <Bust src={src} size={size} mask={bust.mask} x={x} y={y} w={w} cutY={bust.cutY} at={a + 2} rot={rot} seed={(a % 40) + 3} tint={0.3} traceAt={bust.traceAt ?? a + 8} />
        : <Print src={src} size={size} x={x} y={y} w={w} crop={crop} at={a + 2} rot={rot} seed={(a % 40) + 3} />}
      {under}
    </DeskShot>
  );
};
const McCoy: React.FC = () => (
  <Card src={I.mccoy} size={Z.mccoy} crop={[280, 300, 1520, 1880]} a={at("McCoy's") - 1} b={at('Goodnight') - 1} tag={TAG.mccoy} x={1180} y={120} w={600} bust={{mask: M10.b10_mccoy, cutY: 1800}}>
    <Mono text="ABILENE, KANSAS · FROM 1867" x={130} y={250} size={30} at={at("McCoy's") + 4} />
    <Note text="McCoy's cattle trade" x={130} y={340} size={62} rot={-3} at={at('cattle trade') - 2} />
    <Hand parts={[['made '], ['fortunes', true]]} x={150} y={480} size={96} at={at('fortunes') - 3} />
  </Card>
);
const Goodnight: React.FC = () => (
  <Card src={I.goodnight} size={Z.goodnight} crop={[60, 20, 780, 800]} a={at('Goodnight') - 1} b={at('The Homestake') - 1} tag={TAG.goodnight} x={1160} y={160} w={620} bust={{mask: M10.b10_goodnight, cutY: 760}}>
    <Note text="Charles Goodnight" x={130} y={230} size={64} rot={-3} at={at('Goodnight') + 2} />
    <Note text="+ money from a British investor" x={130} y={340} size={54} rot={-3} color="#f4efe6" at={at('British') - 3} />
    <Hand parts={[['one of the '], ['biggest ranches', true]]} x={150} y={480} size={66} at={at('biggest') - 3} />
    <Note text="in Texas" x={170} y={600} size={60} rot={-3} at={at('Texas') - 2} />
  </Card>
);
const Homestake: React.FC = () => (
  <Card src={I.homestake} size={Z.homestake} crop={[70, 130, 1860, 2440]} a={at('The Homestake') - 1} b={at('The cowboys') - 1} tag={TAG.homestake} w={600}>
    <Note text="the Homestake" x={130} y={240} size={66} rot={-3} at={at('Homestake') - 2} />
    <Hand parts={[['made its owners '], ['rich', true]]} x={150} y={380} size={84} at={at('rich', 2) - 3} />
    <Mono text="1877 → 2002 · MORE THAN A CENTURY" x={150} y={540} size={30} at={at('century') - 4} />
  </Card>
);
const Wages: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The cowboys') - 1;
  const b = at('Some') - 1;
  return (
    <AbsoluteFill>
      <DeskCam k={[[a, 20, 1.02, 0, 0, 2], [b, 26, 0.94, 0, 0, 0]]}>
        <Float x={1250} y={240} w={700} hgt={760} h={14} at={a + 2} rot={-4} seed={105}>
          <Prop src={PROP('p3_saddle')} m={M10.p3_saddle} x={0} y={0} w={640} at={-99} />
        </Float>
      </DeskCam>
      <Hand parts={[['the cowboys got '], ['wages.', true]]} x={130} y={300} size={96} at={at('cowboys') - 3} />
      <Mono text="≈ $25–40 A MONTH" x={160} y={480} size={34} at={at('wages') + 2} />
    </AbsoluteFill>
  );
};
const Ikard: React.FC = () => (
  <Card src={I.ikard} size={Z.ikard} crop={[60, 40, 760, 900]} a={at('Some') - 1} b={at('And the Lakota') - 1} tag={TAG.ikard} w={500} x={1260} y={200} bust={{mask: M10.b10_ikard}}>
    <Label text="Bose Ikard, trail hand for Goodnight and Loving" x={130} y={170} size={24} at={at('Some') + 4} />
    <Note text="especially Black and Mexican cowboys" x={130} y={250} size={50} rot={-3} at={at('Black') - 3} />
    <Hand parts={[['more '], ['freedom', true], [' on the trail']]} x={150} y={390} size={68} at={at('freedom') - 4} />
    <Note text="…until they rode into town" x={170} y={560} size={56} rot={-3} color="#f4efe6" at={at('until') - 2} />
  </Card>
);
const Treaty: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And the Lakota') - 1;
  const b = at("Let's write") - 1;
  const d = at('gold') - 3;
  return (
    <DeskShot tilt={keys(f, [[a, 22], [b, 15]])} z={zkeys(f, [[a, 0.94], [b, 1.02]])} hits={[a + 5, d + 4]} lamp={[1100, 440]}
      over={<>
        <Note text="the Lakota got a treaty" x={110} y={200} size={62} rot={-3} at={at('Lakota') - 2} />
        <Note text="that lasted until…" x={130} y={310} size={56} rot={-3} color="#f4efe6" at={at('lasted') - 2} />
        <Hand parts={[['someone found '], ['gold', true], [' under it.']]} x={130} y={860} size={84} at={at('someone') - 2} />
        <ScrimTag text={TAG.treaty} />
      </>}>
      <Print src={I.treaty} size={Z.treaty} x={1000} y={20} w={680} crop={[200, 1700, 3200, 4400]} at={a + 2} rot={-2} seed={106} />
      <Float x={1220} y={460} w={300} hgt={330} h={30} at={d} rot={-12} seed={107}>
        <Prop src={PROP('p6_nugget')} m={M10.p6_nugget} x={0} y={0} w={280} at={-99} tint={0.3} traceAt={d + 5} />
      </Float>
    </DeskShot>
  );
};

// I–M · the Promise Ledger: row one (Ep 1) already written, row two writes in
type Cell = {text: string; at: number; coral?: boolean; dim?: boolean};
const LedgerCard: React.FC<{x: number; y: number; w: number; at: number; rows: Cell[][]}> = ({x, y, w, at: a, rows}) => {
  const d = useDrop(a);
  const g = useGFrame();
  const pal = usePal();
  const hand = useHand();
  if (!d.on) return null;
  const heads = ['THE PROMISE', 'WHO GOT IT', "WHO DIDN'T"];
  const cols = [0, 0.27, 0.53];
  const mx = 130;
  const colX = cols.map((c) => mx + c * (w - mx - 30));
  const headY = 118;
  const rowH = 262;
  const empty = 2;
  const emptyH = 56;
  const h = headY + 62 + rowH * 2 + empty * emptyH + 30;
  const lineY = (i: number) => headY + 62 + (i <= 2 ? i * rowH : 2 * rowH + (i - 2) * emptyH);
  const margin = ['EP 1', 'EP 2', 'EP 3', 'EP 4'];
  return (
    <div style={{position: 'absolute', left: x, top: y - d.air * 40, width: w, height: h, transform: `rotate(${-1 + d.air * 3}deg)`, opacity: Math.min(1, d.k * 3)}}>
      <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(14px 18px 0 ${SHADOW})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: tornPoly(w, h, 7, {t: true}, 10), background: 'radial-gradient(ellipse at 40% 30%, #36312a 0%, #26231d 75%, #1d1a15 100%)'}}>
          {Array.from({length: 2 + empty + 1}).map((_, i) => <div key={i} style={{position: 'absolute', left: 20, right: 20, top: lineY(i), height: 2, background: pal.mark, opacity: i === 0 ? 0.9 : 0.35}} />)}
          <div style={{position: 'absolute', left: mx - 18, top: 20, bottom: 0, width: 2, background: pal.mark, opacity: 0.6}} />
          {colX.slice(1).map((cx, i) => <div key={i} style={{position: 'absolute', left: cx - 18, top: headY, bottom: 20, width: 1.5, background: pal.mark, opacity: 0.35}} />)}
        </div>
      </div>
      <div style={{position: 'absolute', left: mx, top: 30, fontFamily: JF.display, fontSize: 58, color: boxOf(pal), whiteSpace: 'nowrap'}}>THE PROMISE LEDGER</div>
      {heads.map((t, i) => <div key={t} style={{position: 'absolute', left: colX[i], top: headY + 16, fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: pal.mark, whiteSpace: 'nowrap'}}>{t}</div>)}
      {margin.map((t, i) => <div key={t} style={{position: 'absolute', left: 26, top: i < 2 ? lineY(i) + 24 : lineY(i) + emptyH / 2 - 14, fontFamily: JF.mono, fontSize: 22, letterSpacing: 2,
        color: i < 2 ? pal.mark : 'rgba(47,224,196,0.4)', whiteSpace: 'nowrap'}}>{t}</div>)}
      {rows.map((cells, ri) => cells.map((c, ci) => {
        if (g < c.at) return null;
        const p = interpolate(g, [c.at, c.at + 14], [0, 1], clamp);
        return <div key={`${ri}${ci}`} style={{position: 'absolute', left: colX[ci], top: lineY(ri) + 18, fontFamily: hand.family, fontSize: 29 * hand.scale, lineHeight: 1.05,
          color: c.coral ? pal.subject : pal.mark, opacity: c.dim ? 0.62 : 1, whiteSpace: 'pre', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`,
          textShadow: '0 0 2px #111, 2px 2px 0 #111, -2px 2px 0 #111'}}>{c.text}</div>;
      }))}
      <Tape x={w * 0.12} y={-16} w={170} rot={-6} seed={1} grey />
      <Tape x={w * 0.78} y={-14} w={160} rot={5} seed={2} grey />
    </div>
  );
};
const ROWS = (): Cell[][] => [
  [
    {text: 'Progress for a\nreunited nation', at: -99, dim: true},
    {text: 'travelers,\nsettlers,\nrailroad owners', at: -99, dim: true},
    {text: 'the Chinese workers\nwho built it,\nfreedmen in the South,\nthe nations whose land\nthe track ran through', at: -99, dim: true},
  ],
  [
    {text: 'Anyone with nerve\ncan get rich', at: at('anyone') - 2},
    {text: 'herd owners,\ninvestors, the\nHomestake\'s owners;\nsome cowboys,\nfor a while', at: at('Herd') - 2},
    {text: 'most cowboys and miners,\nsmall ranchers\nfenced out,\nthe Lakota, whose\nland was mined', at: at('Most') - 2, coral: true},
  ],
];
const LEDGER = {x: 110, y: 110, w: 1700};
const LedgerCam: React.FC<{z: number; cx: number; cy: number}> = ({z, cx, cy}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <DarkPaper />
    <AbsoluteFill style={{transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})`, transformOrigin: '0 0'}}>
      <LedgerCard {...LEDGER} at={at("Let's write") + 2} rows={ROWS()} />
    </AbsoluteFill>
    <Tag text="The Promise Ledger · one row per episode" />
  </AbsoluteFill>
);
const LedgerWide: React.FC = () => {
  const f = useCurrentFrame();
  const a = at("Let's write") - 1;
  const b = at('The promise') - 1;
  return <LedgerCam z={zkeys(f, [[a, 0.9], [b, 0.98]])} cx={960} cy={keys(f, [[a, 540], [b, 560]])} />;
};
const LedgerPromise: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The promise') - 1;
  const b = at('Who got') - 1;
  return <LedgerCam z={zkeys(f, [[a, 1.0], [b, 1.08]])} cx={keys(f, [[a, 960], [b, 920]])} cy={keys(f, [[a, 540], [b, 600]])} />;
};
const LedgerGot: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Who got') - 1;
  const b = at("Who didn't") - 1;
  return <LedgerCam z={zkeys(f, [[a, 1.08], [b, 1.1]])} cx={keys(f, [[a, 920], [b, 950]])} cy={keys(f, [[a, 600], [b, 620]])} />;
};
const LedgerDidnt: React.FC = () => {
  const f = useCurrentFrame();
  const a = at("Who didn't") - 1;
  const b = at('and the Lakota', 2) - 1;
  return <LedgerCam z={zkeys(f, [[a, 1.1], [b, 1.1]])} cx={keys(f, [[a, 950], [b, 950]])} cy={keys(f, [[a, 600], [b, 600]])} />;
};
const LedgerAll: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('and the Lakota', 2) - 1;
  const b = at('So look') - 1;
  return <LedgerCam z={zkeys(f, [[a, 1.1], [b, 0.95]])} cx={keys(f, [[a, 950], [b, 960]])} cy={keys(f, [[a, 620], [b, 540]])} />;
};

// N · look at the steer again
const Steer: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('So look') - 1;
  const b = at('It took') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src={I.paint} size={Z.paint} cx={keys(f, [[a, 1960], [b, 1950]])} cy={keys(f, [[a, 1320], [b, 1200]])} s={zkeys(f, [[a, 0.5], [b, 0.7]])} bw={PBW}
        mask={M10.c1_steer_1887} traceAt={a + 6}>
        {(_S, p) => <SoftTint mask={M10.c1_steer_1887.alpha} place={p} size={Z.paint} strength={0.4 * interpolate(f, [a + 4, a + 12], [0, 1], clamp)} />}
      </PhotoCam>
      <ScrimTag text={TAG.paint} />
    </AbsoluteFill>
  );
};

// O–P · the closing line over the painting
const Closing: React.FC<{two: boolean}> = ({two}) => {
  const f = useCurrentFrame();
  const a = two ? at('It took', 2) - 1 : at('It took') - 1;
  const b = two ? at('The farmers') - 1 : at('It took', 2) - 1;
  const g = useGFrame();
  const dim = two ? interpolate(g, [a, a + 10], [0.55, 0.38], clamp) : 0.55;
  return (
    <AbsoluteFill>
      <PhotoCam src={I.paint} size={Z.paint} cx={keys(f, [[a, two ? 2080 : 1980], [b, two ? 2000 : 2040]])} cy={keys(f, [[a, 1300], [b, two ? 1280 : 1320]])} s={zkeys(f, [[a, two ? 0.49 : 0.53], [b, two ? 0.5 : 0.5]])}
        bw={`${PBW} brightness(${dim})`} />
      {!two && <>
        <Hand parts={[['about twenty years']]} x={140} y={80} size={80} at={at('about') - 2} white />
        <Hand parts={[['four-dollar cows → '], ['a fortune.', true]]} x={180} y={190} size={90} at={at('fourdollar') - 3} />
      </>}
      {two && <>
        <Hand parts={[['one winter']]} x={140} y={80} size={80} at={a + 2} white />
        <Hand parts={[['→ '], ['a painting.', true]]} x={180} y={190} size={104} at={at('painting') - 6} />
        <SlapTitle text="THE LAST OF THE FIVE THOUSAND" x={200} y={860} size={74} at={at('painting') + 2} seed={108} />
        <Note text="the cowboys moved on" x={1260} y={120} size={48} rot={-3} color="#f4efe6" at={at('moved on') - 3} />
      </>}
      <ScrimTag text={TAG.paint} x={34} y={24} />
    </AbsoluteFill>
  );
};

// Q–R · the farmers stayed: the sod house
const SOD_CROP: [number, number, number, number] = [95, 75, 2905, 1950];
const Farmers: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The farmers') - 1;
  const b = at('The land') - 1;
  return (
    <DeskShot tilt={keys(f, [[a, 22], [b, 14]])} z={zkeys(f, [[a, 0.9], [b, 1.0]])} x={keys(f, [[a, 30], [b, -20]])} hits={[a + 5]}
      over={<>
        <Note text="the farmers stayed" x={110} y={110} size={64} rot={-3} at={at('farmers') - 2} />
        <Note text="promised something even bigger than grass" x={130} y={900} size={52} rot={-2} color="#f4efe6" at={at('promised') - 3} />
        <ScrimTag text={TAG.sod} x={34} y={24} />
      </>}>
      <Print src={I.sod} size={Z.sod} x={760} y={160} w={1000} crop={SOD_CROP} at={a + 2} rot={2} seed={109} />
    </DeskShot>
  );
};
const Land: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The land') - 1;
  const b = at('Thanks') - 1;
  const s = zkeys(f, [[a, 0.72], [b, 0.84]]);
  return (
    <AbsoluteFill>
      <PhotoCam src={I.sod} size={Z.sod} cx={keys(f, [[a, 1500], [b, 1650]])} cy={keys(f, [[a, 1050], [b, 1000]])} s={s} bw="grayscale(1) contrast(1.15) brightness(0.95)" />
      <Hand parts={[['the '], ['land', true], [' itself.']]} x={130} y={150} size={110} at={at('land itself') - 3} />
      <Note text="→ Episode 3" x={1440} y={880} size={60} rot={-3} at={at('itself') + 6} />
      <ScrimTag text={TAG.sod} x={34} y={24} />
    </AbsoluteFill>
  );
};

// S · the end screen: clean slots for YouTube's elements, the Chunk History mark
const Slot: React.FC<{x: number; y: number; w: number; h: number; round?: boolean; at: number}> = ({x, y, w, h, round = false, at: a}) => {
  const g = useGFrame();
  const pal = usePal();
  const k = interpolate(g, [a, a + 10], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: round ? '50%' : 4, background: 'rgba(8,7,5,0.55)', opacity: k,
      boxShadow: `inset 0 0 0 2px rgba(47,224,196,0.35), 12px 14px 0 ${SHADOW}`}}>
      {!round && <div style={{position: 'absolute', inset: 10, border: `1px solid ${pal.mark}`, opacity: 0.15}} />}
    </div>
  );
};
const EndScreen: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = at('Thanks') - 1;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DeskShot tilt={keys(f, [[a, 16], [END, 10]])} z={zkeys(f, [[a, 0.84], [END, 0.8]])} lamp={[960, 420]}>
        <div style={{filter: 'blur(4px) brightness(0.35)'}}><PaintPrint at={-99} /></div>
      </DeskShot>
      <SlapTitle text="CHEAP AS DIRT" x={110} y={80} size={64} at={a + 2} seed={110} />
      <Note text="thanks for watching" x={1220} y={90} size={52} rot={-3} at={at('watching') - 3} />
      {/* two video slots (16:9) and a subscribe circle: left empty for YouTube */}
      <Slot x={130} y={300} w={800} h={450} at={a + 6} />
      <Slot x={990} y={300} w={800} h={450} at={a + 8} />
      <Slot x={850} y={800} w={220} h={220} round at={a + 10} />
      <Mono text="NEXT · EP 3" x={130} y={250} size={24} at={a + 6} />
      <Img src={staticFile('brand/chunk-history-horizontal.svg')} style={{position: 'absolute', left: 1330, top: 880, height: 62, opacity: interpolate(g, [a + 12, a + 24], [0, 0.9], clamp)}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── assembly ─────────────────────────

const c = (w: string, n = 1) => at(w, n) - 1;
const SHOTS: [number, React.ReactNode, ('whip' | 'cut')?][] = [
  [0, <Question />],
  [c('The men'), <Herds />, 'cut'],
  [c("McCoy's"), <McCoy />, 'whip'],
  [c('Goodnight'), <Goodnight />, 'whip'],
  [c('The Homestake'), <Homestake />, 'whip'],
  [c('The cowboys'), <Wages />, 'whip'],
  [c('Some'), <Ikard />, 'whip'],
  [c('And the Lakota'), <Treaty />, 'whip'],
  [c("Let's write"), <LedgerWide />, 'whip'],
  [c('The promise'), <LedgerPromise />, 'cut'],
  [c('Who got'), <LedgerGot />, 'cut'],
  [c("Who didn't"), <LedgerDidnt />, 'cut'],
  [c('and the Lakota', 2), <LedgerAll />, 'cut'],
  [c('So look'), <Steer />, 'whip'],
  [c('It took'), <Closing two={false} />, 'cut'],
  [c('It took', 2), <Closing two />, 'cut'],
  [c('The farmers'), <Farmers />, 'whip'],
  [c('The land'), <Land />, 'cut'],
  [c('Thanks'), <EndScreen />, 'whip'],
];

const tick = (w: string, d = 2, n = 1): [number, string, number] => [at(w, n) - d, 'marker_tick', 0.2];
const SFX: [number, string, number][] = [
  ...SHOTS.slice(1).map(([s, , k]): [number, string, number] => (k === 'whip' ? [s - 4, 'whip_soft', 0.22] : [s, 'whoosh', 0.18])),
  tick('who', 5),
  [at('herds') - 1, 'paper_slap_soft', 0.2], tick('herds', 5), [at('money') - 1, 'paper_slap_soft', 0.2], tick('money', 6),
  [at("McCoy's") + 3, 'paper_slap_soft', 0.22], [at("McCoy's") + 4, 'block_tap_soft', 0.12], tick('cattle trade', 4), tick('fortunes', 5),
  [at('Goodnight') + 3, 'paper_slap_soft', 0.22], tick('Goodnight', 0), tick('British', 5), tick('biggest', 5),
  [at('The Homestake') + 3, 'paper_slap_soft', 0.22], tick('Homestake', 4), tick('rich', 5, 2), [at('century') - 4, 'block_tap_soft', 0.12],
  [at('The cowboys') + 3, 'paper_slap_soft', 0.2], tick('cowboys', 5), [at('wages') + 2, 'block_tap_soft', 0.12],
  [at('Some') + 3, 'paper_slap_soft', 0.22], tick('Black', 5), tick('freedom', 6), tick('until', 4),
  [at('And the Lakota') + 3, 'page_turn', 0.35], tick('Lakota', 4), tick('lasted', 4), [at('gold') + 1, 'paper_slap_soft', 0.22], tick('someone', 4),
  [at("Let's write") + 3, 'paper_slap_soft', 0.25], [at("Let's write") + 6, 'tape_press', 0.2],
  tick('anyone', 4), tick('Herd', 4), tick('Most', 4),
  tick('about', 4), tick('fourdollar', 5), tick('It took', 0, 2), tick('painting', 8), [at('painting') + 2, 'stamp', 0.22], tick('moved on', 5),
  [at('The farmers') + 3, 'paper_slap_soft', 0.22], tick('farmers', 4), tick('promised', 5), tick('land itself', 5), tick('itself', -4),
  [at('Thanks') + 1, 'stamp', 0.18], tick('watching', 5),
];

const Body: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <WShots shots={SHOTS} />
    <Sounds list={SFX} />
  </AbsoluteFill>
);

export const Ch10: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch10_the_last_of_the_5000.wav" lead={LEAD} extra={EXTRA} music={[
    // aw_promise_theme (Suno, 2:05), the series theme: the whole chapter through the music-only end screen (~1:37)
    {src: 'music/aw_promise_theme.mp3', volume: bed('aw_promise_theme')},
  ]}>
    <Body />
  </ChapterShell>
);
