// Chapter 4 · The Worst Halloween. Fargo 1933 (false alarms, lamps shot out, "prominent families"), Bismarck (300 boys, junk
// cars, tear gas: the cold open's headline again), the rest of the country (alarms, trolley wires, greased tracks), Black
// Halloween, then the explainer stack (four reasons, 1/4…4/4) that adds up to "a riot in costume", the ban that can't work,
// the question asked on screen, and "They decided to pay."
import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch04_the_worst_halloween.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Highlight, JF, Loop, Note, Tag, useGFrame} from '../kit/Kit';
import {DarkPaper, Sfx, WRITE} from '../kit/common';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, PhotoCard, Quote, Stamp, type TL, useScene} from '../kit/shell';
import {bed} from '../kit/levels';
import {Prop} from '../kit/prop';
import {SilScene} from '../kit/silparallax';
import {Slip, Swipe, type Box} from '../kit/vox';
import {Smoke} from '../fx/Headline';
import mob from '../../public/img/layers/sil/ch04_mob_school/layers.json';
import j300 from '../../public/img/ch04/bismarck_tribune_1933-11-01_about_300_boys.json';
import jHead from '../../public/img/ch03/bismarck_tribune_1933-11-01_tear_gas_headline.json';
import jIndy from '../../public/img/ch03/indianapolis_times_1931-11-02_halloween_pranksters.json';
import jIvp from '../../public/img/ch03/imperial_valley_press_1936-11-02_pranksters_run.json';
import jWdn from '../../public/img/ch03/washington_daily_news_1939-11-01_trolley_wire_vandalism.json';

const N = words as Narration;
export const CH04_FRAMES = chapterFrames(N, LEAD);
const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';

const ph = (j: {phrases: Record<string, number[][]>}, k: string) => j.phrases[k] as Box[];
const IMG = {
  b300: 'img/ch04/bismarck_tribune_1933-11-01_about_300_boys.jpg',
  head: 'img/ch03/bismarck_tribune_1933-11-01_tear_gas_headline.jpg',
  indy: 'img/ch03/indianapolis_times_1931-11-02_halloween_pranksters.jpg',
  ivp: 'img/ch03/imperial_valley_press_1936-11-02_pranksters_run.jpg',
  wdn: 'img/ch03/washington_daily_news_1939-11-01_trolley_wire_vandalism.jpg',
  pole: 'img/ch03/fsa_streetcar_trolley_pole_okc_1939.jpg',
};
const L300 = ph(j300, 'high school building, where it is estimated about 300 boys had assembled');
const LHEAD = ph(jHead, 'Tear Gas Used to Halt Pranks');
const LINDY = ph(jIndy, 'HALLOWEEN PRANKSTERS').slice(1);
const LIVP = ph(jIvp, 'PRANKSTERS RUN');
const LWDN = ph(jWdn, 'TROLLEY WIRE VANDALISM');
// crop windows (source px) for the clippings
const C_INDY: Box = [640, 1380, 1240, 560];
const C_IVP: Box = [780, 1570, 1250, 560];
const C_WDN: Box = [430, 640, 610, 300];

/** A newspaper clipping on cream card stock, cropped to `crop` (source px), `w` wide on screen. Children are in source px. */
const Clip: React.FC<{src: string; crop: Box; x: number; y: number; w: number; rot?: number; at: number; dim?: number; children?: React.ReactNode}> = ({
  src, crop: [cx, cy, cw, ch], x, y, w, rot = 0, at, dim = 1, children,
}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - 2.2 * t * (1 - t))});
  const s = w / cw;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2) * dim}}>
      <div style={{background: '#f4efe6', padding: 12, boxShadow: '0 18px 34px rgba(0,0,0,0.6)'}}>
        <div style={{position: 'relative', width: w, height: ch * s, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: -cx * s, top: -cy * s, transformOrigin: '0 0', transform: `scale(${s})`}}>
            <Img src={staticFile(src)} style={{display: 'block', filter: 'grayscale(1) sepia(0.1) contrast(1.2)'}} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/** 0:00 · Fargo, Halloween night 1933: the fire-alarm box (coral), lamps shot out. */
const Fargo: React.FC<{t: TL}> = ({t}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="fire_alarm_box" x={1300} y={150} w={380} at={t.at('false fire alarms') - 4} coral trace />
    <Highlight text="FARGO, N.D." x={120} y={120} size={110} at={t.at('Fargo')} seed={41} rot={-2} />
    <Note text="Halloween night, 1933" x={150} y={300} size={70} rot={-3} at={t.at('Halloween night') - 3} color="#ffffff" />
    <Note text="false fire alarms, again and again" x={150} y={470} size={62} rot={-3} at={t.at('pulling') - 3} />
    <Note text="porch lights + streetlamps:" x={150} y={640} size={62} rot={-3} at={t.at('Porch') - 3} color="#ffffff" />
    <Note text="shot out" x={300} y={760} size={90} rot={-5} at={t.at('shot out') - 3} color={CORAL} />
  </AbsoluteFill>
);

/** 0:10 · "the six boys charged … from prominent families" (the paper's own words, straight). */
const Families: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Prop name="police_cap" x={1260} y={170} w={520} at={2} />
    <Stamp text="6" x={170} y={140} size={260} at={t.at('six') - a} color={TEAL} />
    <Note text="boys charged" x={370} y={240} size={80} rot={-3} at={t.at('charged') - a - 3} color="#ffffff" />
    <Quote text="from prominent families" x={150} y={560} w={1300} size={92} at={t.at('prominent') - a - 2} who="the paper's phrase" />
  </AbsoluteFill>
);

/** 0:15 · Bismarck: the mob at the high school (silhouette painting), junk cars and garbage. */
const Mob: React.FC<{t: TL; a: number; b: number}> = ({t, a, b}) => {
  const f = useCurrentFrame();
  const dens = interpolate(f, [0, t.at('junk') - a, b - a], [0.12, 0.3, 0.55], clamp);
  return (
    <AbsoluteFill>
      <SilScene name="ch04_mob_school" size={mob.size as [number, number]} glowLayer={mob.glowLayer} a={0} b={b - a + 8} cam={{z: [1.12, 1.04], x: [30, -30]}} fade={4} />
      <Smoke density={dens} seed="m4" y={700} spread={220} speed={1.2} />
      <Highlight text="BISMARCK" x={120} y={100} size={110} at={t.at('Bismarck') - a} seed={42} rot={-2} />
      <Slip text="about 300 boys" x={140} y={300} size={70} at={t.at('about 300') - a - 2} coral />
      <Slip text="junk cars + garbage → the high school" x={180} y={430} size={58} at={t.at('junk') - a - 2} rot={-2} />
    </AbsoluteFill>
  );
};

/** 0:22 · the real story ("about 300 boys … tear gas bombs"), then the cold open's headline drops back on the desk. */
const Callback: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const f = useCurrentFrame();
  const dens = interpolate(f, [0, t.at('tear gas') - a, t.at('tear gas') - a + 20, 200], [0.05, 0.1, 0.6, 0.35], clamp);
  const hs = 900 / 2600;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Clip src={IMG.b300} crop={[90, 330, 1255, 767]} x={110} y={80} w={860} rot={-2} at={0}>
        <Swipe lines={L300} from={t.at('police') - a} to={t.at('gas') - a + 6} seed="b300" />
      </Clip>
      <Smoke density={dens} seed="cb" y={520} spread={260} speed={1.3} />
      <PhotoCard src={IMG.head} x={900} y={640} w={900} rot={2} at={t.at('headline') - a - 2} />
      {f >= t.at('headline') - a + 6 && (
        <Loop cx={900 + 900 * 0.0225 + (LHEAD[0][0] + LHEAD[0][2] / 2) * hs} cy={640 + 20 + (LHEAD[0][1] + LHEAD[0][3] / 2) * hs + 4} rx={LHEAD[0][2] * hs * 0.55} ry={LHEAD[0][3] * hs * 1.25}
          at={t.at('headline') - a + 6} color={CORAL} width={6} seed={44} tilt={2} />
      )}
      <Note text="the headline from the start" x={800} y={480} size={52} rot={-3} at={t.at('from the start') - a - 3} color="#ffffff" />
      <Arrow x1={1180} y1={560} x2={1260} y2={650} bow={-30} at={t.at('from the start') - a + 4} color={TEAL} width={6} />
      <Tag text="The Bismarck Tribune, 1 Nov 1933 · Library of Congress" />
    </AbsoluteFill>
  );
};

/** 0:27 · "North Dakota wasn't special": three more papers land, headlines swiped. */
const Country: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const i1 = t.at('wasnt special') - a - 2, i2 = t.at('Across the country') - a - 2, i3 = t.at('Halloween came') - a - 2;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="ACROSS THE COUNTRY" x={110} y={110} size={96} at={t.at('Across the country') - a} seed={45} rot={-2} />
      <Clip src={IMG.indy} crop={C_INDY} x={90} y={300} w={560} rot={-3} at={i1}><Swipe lines={LINDY} from={i1 + 6} to={i1 + 20} seed="in" /></Clip>
      <Clip src={IMG.ivp} crop={C_IVP} x={690} y={350} w={540} rot={2} at={i2}><Swipe lines={LIVP} from={i2 + 6} to={i2 + 16} seed="iv" /></Clip>
      <Clip src={IMG.wdn} crop={C_WDN} x={1290} y={310} w={520} rot={-2} at={i3}><Swipe lines={LWDN} from={i3 + 6} to={i3 + 16} seed="wd" /></Clip>
      <Note text="1931 · 1936 · 1939" x={760} y={240} size={52} rot={-2} at={i2 + 4} color="#ffffff" />
      <Note text="smashed windows" x={640} y={790} size={78} rot={-3} at={t.at('smashed') - a - 3} color={CORAL} />
      <Tag text="Indianapolis Times, 2 Nov 1931 · Imperial Valley Press, 2 Nov 1936 · Washington Daily News, 1 Nov 1939 · LOC" />
    </AbsoluteFill>
  );
};

/** 0:33 · trolley wires pulled down, tracks greased (the grease can is the coral subject). */
const Streetcars: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <PhotoCard src={IMG.pole} x={110} y={110} w={860} h={560} rot={-2} at={0} pos="50% 50%" />
    <Note text="trolley wires: pulled down" x={130} y={720} size={64} rot={-3} at={t.at('trolley wires') - a - 3} color="#ffffff" />
    <Clip src={IMG.wdn} crop={C_WDN} x={1100} y={100} w={560} rot={2} at={t.at('trolley wires') - a + 4}>
      <Swipe lines={LWDN} from={t.at('trolley wires') - a + 10} to={t.at('trolley wires') - a + 20} seed="wd2" />
    </Clip>
    <Prop name="grease_can" x={1280} y={400} w={370} at={t.at('smeared') - a - 3} coral trace rot={-4} />
    <Note text="grease on the tracks" x={1170} y={830} size={58} rot={-3} at={t.at('grease') - a - 3} color={CORAL} />
    <Note text="→ cars slide past their stops" x={170} y={830} size={52} rot={-3} at={t.at('slid') - a - 3} />
    <Tag text="FSA, Oklahoma City, 1939 · Washington Daily News, 1 Nov 1939 · LOC" />
  </AbsoluteFill>
);

/** 0:39 · "Some histories call that year Black Halloween." */
const Black: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Clip src={IMG.indy} crop={C_INDY} x={90} y={120} w={520} rot={-4} at={-10} dim={0.3} />
    <Clip src={IMG.ivp} crop={C_IVP} x={1250} y={640} w={520} rot={3} at={-10} dim={0.3} />
    <Clip src={IMG.b300} crop={[0, 330, 1345, 767]} x={1240} y={90} w={520} rot={2} at={-10} dim={0.3} />
    <Note text="some histories call that year" x={260} y={380} size={62} rot={-3} at={t.at('Some histories') - a - 3} color="#ffffff" />
    <Highlight text="BLACK HALLOWEEN" x={220} y={500} size={150} at={t.at('Black') - a} seed={46} rot={-3} />
    <Tag text="Indianapolis Times, 1931 · Imperial Valley Press, 1936 · Bismarck Tribune, 1933 · LOC" />
  </AbsoluteFill>
);

const STACK = [
  {k: 'Teenage boys', n: 'teenage boys', b: 'BOYS'},
  {k: 'No jobs', n: 'no jobs (the Depression)', b: 'NO JOBS'},
  {k: 'A night when', n: 'a night with no rules', b: 'NO RULES'},
  {k: 'And towns', n: 'towns full of things to break', b: 'THINGS TO BREAK'},
];

/** 0:43 · the explainer: stack it up, 1/4 … 4/4, then "a riot in costume". */
const Stack: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const f = useCurrentFrame();
  const means = t.at('That means') - a;
  const riot = t.at('riot') - a;
  const dimL = interpolate(g, [means - 2, means + 4], [1, 0.12], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <Highlight text="STACK IT UP" x={110} y={105} size={100} at={t.at('stack') - a} seed={47} rot={-2} />
      <div style={{position: 'absolute', inset: 0, opacity: dimL}}>
        {STACK.map((s, i) => {
          const at = t.at(s.k) - a - 2;
          return g < at ? null : (
            <React.Fragment key={s.k}>
              <div style={{position: 'absolute', left: 130, top: 290 + i * 140, fontFamily: JF.mono, fontSize: 48, color: TEAL, letterSpacing: 2, textShadow: '0 2px 8px #000'}}>{i + 1}/4</div>
              <Slip text={s.n} x={300} y={280 + i * 140} size={64} at={at} rot={-2 + (i % 2) * 1.5} seed={`st${i}`} />
            </React.Fragment>
          );
        })}
      </div>
      {/* the stack itself: four blocks dropping onto each other, bottom up */}
      {STACK.map((s, i) => {
        const at = t.at(s.k) - a - 2;
        if (g < at) return null;
        const drop = interpolate(g, [at, at + 4], [-260, 0], {...clamp, easing: (x) => x * x});
        const shake = g >= riot ? Math.sin(f * 0.9 + i * 2) * 4 * (i + 1) : 0;
        return (
          <div key={s.b} style={{position: 'absolute', left: 1360 + shake + (i % 2 ? 14 : -10), top: 830 - i * 130 + drop, width: 420, height: 116, background: '#ece6d8',
            border: `4px solid ${TEAL}`, boxShadow: '0 12px 20px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `rotate(${(i % 2 ? 1.5 : -1.2) + (g >= riot ? Math.sin(f * 0.7 + i) * 1.5 : 0)}deg)`, fontFamily: JF.mono, fontSize: 36, color: '#1a1712', letterSpacing: 2,
            opacity: interpolate(g, [at, at + 2], [0, 1], clamp)}}>{s.b}</div>
        );
      })}
      <Smoke density={interpolate(f, [riot, riot + 20], [0, 0.45], clamp)} seed="riot" y={760} spread={200} />
      <Note text="Halloween ≠ a kids' holiday anymore" x={120} y={270} size={56} rot={-3} at={t.at('kids') - a - 3} color="#ffffff" />
      <Highlight text="A RIOT IN COSTUME" x={110} y={560} size={98} at={riot} seed={48} rot={-3} />
    </AbsoluteFill>
  );
};

/** 0:58 · banning it: a calendar page, a BANNED? stamp, and the kids come out anyway. */
const Ban: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const st = t.at('banning') - a;
  const k = interpolate(g, [st, st + 3, st + 6], [1.5, 0.95, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 1160, top: 170, width: 520, height: 620, background: '#ece6d8', transform: 'rotate(3deg)', boxShadow: '0 20px 36px rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{width: '100%', height: 110, background: '#2b2722', color: '#ece6d8', fontFamily: JF.mono, fontSize: 52, letterSpacing: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>OCTOBER</div>
        <div style={{fontFamily: JF.display, fontSize: 340, lineHeight: 1.2, color: CORAL}}>31</div>
      </div>
      {g >= st && (
        <div style={{position: 'absolute', left: 1150, top: 420, transform: `rotate(-14deg) scale(${k})`, fontFamily: JF.heavy, fontWeight: 900, fontSize: 112, color: '#c9372c',
          border: '10px solid #c9372c', padding: '0 26px', letterSpacing: 6, opacity: 0.88, mixBlendMode: 'multiply'}}>BANNED?</div>
      )}
      <Note text="officials in some cities:" x={140} y={180} size={62} rot={-3} at={t.at('Officials') - a - 3} color="#ffffff" />
      <Note text="ban it?" x={180} y={290} size={96} rot={-4} at={st - 3} />
      <Highlight text="BAN A NIGHT?" x={120} y={480} size={120} at={t.at('ban a night') - a} seed={49} rot={-2} />
      <Note text="the kids come out anyway" x={150} y={760} size={70} rot={-3} at={t.at('The kids would') - a - 3} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** 1:05 · the question, asked on screen. */
const Question: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const q2 = t.at('what do you do') - a - 1;
  return (
    <AbsoluteFill>
      <DarkPaper />
      <div style={{position: 'absolute', left: 170, top: 330, fontFamily: JF.heavy, fontWeight: 900, fontSize: 80, color: '#f4efe6', whiteSpace: 'nowrap', textShadow: '0 3px 14px #000',
        opacity: interpolate(g, [0, 4], [0, 1], clamp)}}>So if you can't stop Halloween,</div>
      {g >= q2 && <div style={{position: 'absolute', left: 170, top: 470, fontFamily: JF.heavy, fontWeight: 900, fontSize: 130, color: TEAL, whiteSpace: 'nowrap', textShadow: '0 3px 14px #000',
        opacity: interpolate(g, [q2, q2 + 4], [0, 1], clamp)}}>what do you do?</div>}
    </AbsoluteFill>
  );
};

/** 1:08 · "Some towns came up with a better idea. They decided to pay." The treat bag (coral). */
const Pay: React.FC<{t: TL; a: number}> = ({t, a}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Note text="some towns had a better idea" x={140} y={200} size={70} rot={-3} at={t.at('better idea') - a - 3} color="#ffffff" />
    <Prop name="treat_bag" x={1260} y={110} w={480} at={t.at('decided') - a - 2} coral trace from="top" />
    <Highlight text="THEY DECIDED TO PAY" x={110} y={760} size={104} at={t.at('pay') - a} seed={50} rot={-3} />
  </AbsoluteFill>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const c = {fam: at('The paper') - 1, mob: at('Across the state') - 1, cb: at("That's when the police") - 1, ctry: at('And North Dakota') - 1,
    car: at('pulleddown') - 1, black: at('Some histories') - 1, stack: at('Now stack') - 1, ban: at('Officials') - 1, q: at('So if you') - 1, pay: at('Some towns') - 1};
  const cuts: [number, React.ReactNode][] = [
    [0, <Fargo t={t} />],
    [c.fam, <Sequence from={c.fam} layout="none"><Families t={t} a={c.fam} /></Sequence>],
    [c.mob, <Sequence from={c.mob} layout="none"><Mob t={t} a={c.mob} b={c.cb} /></Sequence>],
    [c.cb, <Sequence from={c.cb} layout="none"><Callback t={t} a={c.cb} /></Sequence>],
    [c.ctry, <Sequence from={c.ctry} layout="none"><Country t={t} a={c.ctry} /></Sequence>],
    [c.car, <Sequence from={c.car} layout="none"><Streetcars t={t} a={c.car} /></Sequence>],
    [c.black, <Sequence from={c.black} layout="none"><Black t={t} a={c.black} /></Sequence>],
    [c.stack, <Sequence from={c.stack} layout="none"><Stack t={t} a={c.stack} /></Sequence>],
    [c.ban, <Sequence from={c.ban} layout="none"><Ban t={t} a={c.ban} /></Sequence>],
    [c.q, <Sequence from={c.q} layout="none"><Question t={t} a={c.q} /></Sequence>],
    [c.pay, <Sequence from={c.pay} layout="none"><Pay t={t} a={c.pay} /></Sequence>],
  ];
  const scene = useScene(cuts);
  return (
    <AbsoluteFill>
      {scene}
      {cuts.slice(1).map(([f], i) => <Sfx key={i} at={f} src="sfx/whoosh.wav" volume={0.3} />)}
      {['Fargo', 'Bismarck', 'Across the country', 'Black', 'stack', 'riot', 'ban a night', 'pay'].map((p) => <Sfx key={p} at={at(p)} src="sfx/stamp.wav" volume={0.3} />)}
      {['Halloween night', 'pulling', 'Porch', 'shot out', 'charged', 'from the start', 'smashed', 'trolley wires', 'grease', 'slid', 'Some histories', 'kids', 'Officials',
        'banning', 'The kids would', 'better idea'].map((p) => <Sfx key={p} at={at(p) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {['six', 'banning'].map((p) => <Sfx key={`g${p}`} at={at(p)} src="sfx/gavel.wav" volume={0.22} />)}
      {[at('police'), at('wasnt special') - 2, at('Across the country') - 2, at('Halloween came') - 2].map((f, i) => <Sfx key={`p${i}`} at={f} src="sfx/paper_rustle.wav" volume={0.3} />)}
      <Sfx at={at('headline') - 2} src="sfx/page_turn.wav" volume={0.35} />
      <Sfx at={at('false fire alarms') - 4} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('smeared') - 3} src="sfx/tick.wav" volume={0.4} />
      <Sfx at={at('decided') - 2} src="sfx/tick.wav" volume={0.45} />
      {STACK.map((s) => <Sfx key={s.k} at={at(s.k) + 2} src="sfx/knock.wav" volume={0.3} />)}
    </AbsoluteFill>
  );
};

// hb_black_halloween from 73 s into the cue: its ~85 s build lands under Fargo's "prominent families", the ~130 s build
// under "a riot in costume", and the cue (151.5 s) runs past the chapter's fade.
export const Ch04: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch04_the_worst_halloween.wav" lead={LEAD} music={[{src: 'music/hb_black_halloween.mp3', volume: bed('hb_black_halloween'), startFrom: 73 * 30}]}>
    <Body />
  </ChapterShell>
);
