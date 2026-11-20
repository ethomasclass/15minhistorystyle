// Short 1 · "Why is cranberry sauce shaped like a can?" (native 1080x1920). Opens on the payoff picture (the jellied log standing on
// the plate beside its empty can, img/flow/cran2 frame 6) under the cover line, then: the cold open's question, the seventy million
// cans, Marcus Urann's 1912 problem as his props (scoop, barrel, pot) over a drawn 52-week year, 1941 and Ocean Spray, and the
// answer, "Because it IS the can." The end card sits over the opening picture, so the replay loops into the cover.
// Desks as in the chapter (kit/tg_desk_map): teal for the explainers, black for the document, a coral flash on the punchline.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../lib/anim';
import {Highlight, JF, Loop, Note, useGFrame, usePal} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {type TL, useScene} from '../kit/shell';
import {DropIn} from '../kit/tg_drop';
import {CUT_COLOUR, flowH, flowSrc, type FlowName} from '../kit/tg_cut';
import {Cran, cranMap, Loupe} from '../kit/tg_late';
import {rgba, useMarks} from '../kit/tg_desk';
import {PageScrap, COLOUR_DOC} from '../ch/ch34/parts';
import {build, type Built, Mode, OUTRO, PTag, type Seg, type ShortDef, storyFrames, VShell} from './vkit';

/** The spliced lines (phrases as in script/chNN_*.txt). A 0.4 s beat before the answer (the deadpan hold). */
export const SEGS1: Seg[] = [
  {ch: 'ch01', first: 'And why is', last: 'like a can?'},
  {ch: 'ch01', first: 'And we open', last: 'two months.'},
  {ch: 'ch07', first: 'But in 1912,', last: 'Ocean Spray.'},
  {ch: 'ch07', first: 'Because it IS', last: "can's ridges.", pre: 0.4},
];

/** The payoff picture: cran2 frame 6, its plate centred so the log and the can fill the width, the log's top at about y 630. */
const COVER = {cx: 390, by: 1130, pw: 700};

/** The jellied log on its plate beside the can (frame 6), on the teal desk: the cover, the ridges shot and the end card. */
const Payoff: React.FC = () => <Cran n={6} {...COVER} />;

/** Frame 0: the cover. Fully drawn from the first frame (the corner wordmark comes from the shell). */
const Cover: React.FC = () => (
  <Mode m="teal">
    <DarkPaper />
    <Payoff />
    <Highlight text="IT'S SHAPED" x={60} y={180} size={118} at={-30} seed={11} rot={-3} />
    <Highlight text="LIKE A CAN" x={110} y={335} size={118} at={-30} seed={12} rot={-2} />
    <Highlight text="BECAUSE…" x={60} y={490} size={118} at={-30} seed={13} rot={-3} />
  </Mode>
);

/** The close-up set (img/flow/cran, the can cropped at the right edge) slides the log out, stopping one drawing short of standing. */
const CRAN = [{cx: 413.5, by: 626, pw: 725}, {cx: 414, by: 623, pw: 728}, {cx: 411.5, by: 626, pw: 727}, {cx: 418.5, by: 621, pw: 715}, {cx: 417.5, by: 613, pw: 713}];
const SLIDE_SEQ = [0, 0, 1, 1, 2, 2, 3, 3, 4];
const Slide: React.FC<{a: number}> = ({a}) => {
  const g = useGFrame();
  const step = Math.floor(Math.max(0, g - a) / 2.5);
  const i = SLIDE_SEQ[Math.min(step, SLIDE_SEQ.length - 1)];
  const c = CRAN[i];
  const s = 980 / c.pw;
  return (
    <Mode m="teal">
      <DarkPaper />
      <div style={{position: 'absolute', left: 540 - c.cx * s + 90, top: 1120 - c.by * s, width: 842 * s, height: 695 * s, filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.6)) drop-shadow(18px 15px 15px rgba(0,0,0,0.55))'}}>
        <Img src={staticFile(`img/flow/cran/cran_cut${i + 1}.png`)} style={{width: '100%', height: '100%', display: 'block'}} />
      </div>
    </Mode>
  );
};

/** One tall can (the left can of tg_three_cans, cropped at its own gap: x 11-315, y 11-595 of 1150 x 610). */
const CanIcon: React.FC<{w: number}> = ({w}) => {
  const s = w / 304;
  return (
    <div style={{width: w, height: 584 * s, overflow: 'hidden', position: 'relative'}}>
      <Img src={staticFile('img/flow/tg_three_cans.png')} style={{position: 'absolute', left: -11 * s, top: -11 * s, width: 1150 * s, height: 610 * s, filter: CUT_COLOUR}} />
    </div>
  );
};

/** A counter that climbs as it is spoken, stepping with the desk (Abril, as kit/vshort's Counter). */
const Climb: React.FC<{to: number; a: number; b: number; x: number; y: number; size: number}> = ({to, a, b, x, y, size}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < a) return null;
  const v = Math.round(interpolate(g, [a, b], [0, to], {...clamp, easing: (q) => 1 - Math.pow(1 - q, 3)}) / 100000) * 100000;
  return (
    <div data-tx style={{position: 'absolute', left: x, top: y, fontFamily: JF.display, fontSize: size, lineHeight: 1, color: pal.subject, whiteSpace: 'nowrap',
      textShadow: '0 6px 22px rgba(0,0,0,0.85), 0 0 4px #111'}}>{v.toLocaleString('en-US')}</div>
  );
};

/** About seventy million cans a year (a row of seven, one per ten million), most of them in about two months (a drawn year). */
const Numbers: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const mk = useMarks();
  const n70 = t.at('seventy million'), cans = t.at('cans of');
  const months = 'JFMAMJJASOND'.split('');
  const stripAt = t.at('a year,');
  const twoAt = t.at('two months.');
  return (
    <Mode m="teal">
      <DarkPaper />
      <Climb to={70000000} a={n70} b={cans + 4} x={70} y={200} size={150} />
      <Note text="cans of cranberry sauce, a year" x={80} y={380} size={56} rot={-3} at={cans - 2} color="#ffffff" />
      {Array.from({length: 7}, (_, i) => (
        <DropIn key={i} at={a + 3 + i * 3} x={58 + i * 138} y={480} rot={((i * 5) % 7) - 3} from={[0, -700, (i % 2 ? 1 : -1) * 12]}>
          <CanIcon w={128} />
        </DropIn>
      ))}
      <Note text="each = 10 million" x={80} y={755} size={58} rot={-3} at={cans + 4} />
      {g >= stripAt && (
        <div style={{position: 'absolute', left: 75, top: 860, display: 'flex', gap: 10}}>
          {months.map((m, i) => {
            const shown = g >= stripAt + Math.floor(i / 3) * 2;
            const hot = i >= 10 && g >= twoAt;
            return (
              <div key={i} style={{width: 63, height: 150, borderRadius: 4, opacity: shown ? 1 : 0, boxSizing: 'border-box', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                paddingBottom: 10, border: `3px solid ${hot ? mk.coral : rgba(mk.teal, 0.5)}`, background: hot ? rgba('#FF6F61', 0.85) : 'rgba(0,0,0,0.18)',
                fontFamily: JF.display, fontSize: 34, color: hot ? '#1a0d0b' : rgba('#f4efe6', 0.75)}}>{m}</div>
            );
          })}
        </div>
      )}
    </Mode>
  );
};

/** A Flow prop dropped onto the desk on its own (contact shadow at rest), natural aspect, `w` wide. */
const Prop: React.FC<{name: FlowName; at: number; x: number; y: number; w: number; rot?: number; from?: [number, number, number]}> = ({name, at, x, y, w, rot, from}) => (
  <DropIn at={at} x={x} y={y} rot={rot} from={from}>
    <Img src={staticFile(flowSrc(name))} style={{display: 'block', width: w, height: flowH(name, w), filter: CUT_COLOUR}} />
  </DropIn>
);

/** A name set in our type (never handwriting), as Ch07's NameType: the name in Abril, a mono role, on a dark box. */
const NameType: React.FC<{name: string; role: string; x: number; y: number; at: number; size?: number}> = ({name, role, x, y, at, size = 54}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div data-tx style={{position: 'absolute', left: x, top: y, opacity: interpolate(g, [at, at + 6], [0, 1], clamp), background: 'rgba(13,12,9,0.82)', padding: '12px 22px 10px'}}>
      <div style={{fontFamily: JF.display, fontSize: size, lineHeight: 1, color: '#f4efe6', whiteSpace: 'nowrap'}}>{name}</div>
      <div style={{fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: '#2FE0C4', textTransform: 'uppercase', marginTop: 8}}>{role}</div>
    </div>
  );
};

/** Steam off the pot, stepped with the desk. */
const Steam: React.FC<{x: number; y: number; at: number; w?: number}> = ({x, y, at, w = 300}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const q = (((g - at) / 42 + i / 4) % 1 + 1) % 1;
        const px = x + (i - 1.5) * (w / 5) + Math.sin((g + i * 30) / 14) * 14;
        const r = 44 + 54 * q;
        return <div key={i} style={{position: 'absolute', left: px - r, top: y - q * 220 - r, width: r * 2, height: r * 2, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 70%)', opacity: Math.sin(q * Math.PI) * Math.min(1, (g - at) / 10)}} />;
      })}
    </>
  );
};

type Stage = 'scoop' | 'barrel' | 'pot';
/** Marcus Urann's year, 1912: the header (year and name) stays put while his props change under it: the scoop (the harvest),
 *  the barrel (fresh berries, which sell for a few weeks: the coral weeks of the drawn year), the pot (cook them down) and the
 *  can (all 52 weeks fill). Hard cuts between the stages; the header and the year carry across them. */
const Urann: React.FC<{t: TL; a: number; stage: Stage}> = ({t, a, stage}) => {
  const g = useGFrame();
  const pal = usePal();
  const mk = useMarks();
  const gridAt = t.at('Fresh berries');
  const fewAt = t.at('few weeks');
  const canAt = t.wordAt(t.idx('in a can.') + 2);
  return (
    <Mode m="teal">
      <DarkPaper />
      <Highlight text="1912" x={60} y={180} size={120} at={t.at('1912,')} seed={21} rot={-3} />
      <NameType name="Marcus Urann" role="cranberry grower" x={400} y={200} at={t.at('Marcus') - 2} />
      {stage === 'scoop' && <Prop name="tg_cranberry_scoop" at={a + 3} x={60} y={560} w={960} rot={-3} from={[-700, -300, -18]} />}
      {stage === 'barrel' && <Prop name="tg_cranberry_barrel" at={a + 2} x={330} y={390} w={400} rot={1} from={[-600, -500, -20]} />}
      {stage === 'pot' && (
        <>
          <Steam x={470} y={470} at={t.at('cook them')} w={360} />
          <Prop name="tg_cooking_pot_cranberries" at={a + 2} x={90} y={430} w={620} rot={-2} from={[500, -600, 22]} />
          <DropIn at={canAt} x={760} y={430} rot={3} from={[300, -700, 14]}><CanIcon w={170} /></DropIn>
        </>
      )}
      {stage !== 'scoop' && (
        <div style={{position: 'absolute', left: 92, top: 846}}>
          <div style={{fontFamily: JF.mono, fontSize: 38, letterSpacing: 5, color: 'rgba(244,239,230,0.9)', marginBottom: 12}}>52 WEEKS</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(13, 56px)', gap: 8}}>
            {Array.from({length: 52}, (_, i) => {
              const shown = g >= gridAt + Math.floor(i / 13) * 2;
              const fresh = i >= 40 && i <= 45 && g >= fewAt;
              const can = g >= canAt + Math.floor(i / 4);
              return <div key={i} style={{width: 56, height: 40, borderRadius: 3, opacity: shown ? 1 : 0, boxSizing: 'border-box',
                border: `2px solid ${can ? pal.mark : fresh ? mk.coral : rgba(mk.teal, 0.4)}`,
                background: can ? rgba('#2FE0C4', 0.6) : fresh ? rgba('#FF6F61', 0.9) : 'transparent'}} />;
            })}
          </div>
        </div>
      )}
      <PTag text="Illustration · a cranberry scoop, barrel and pot" />
    </Mode>
  );
};

/** 1941: the brand goes national. No public-domain Ocean Spray item exists: a canned cranberry sauce of the time, labelled as what it is. */
const Ocean: React.FC<{t: TL; a: number}> = ({t, a}) => {
  const g = useGFrame();
  const z = interpolate(g, [a, a + 180], [1, 1.05], clamp);
  return (
    <Mode m="black">
      <DarkPaper />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 60%'}}>
        <PageScrap src="img/arch/empress-cranberry-sauce-trademark-label-1910.jpg" size={[4150, 6217]} box={[480, 480, 3200, 2500]} x={190} y={530} w={700} at={a + 2} rot={-2}
          seed="emp" filter={COLOUR_DOC} />
      </div>
      <Highlight text="1941" x={60} y={180} size={120} at={t.at('1941,')} seed={22} rot={-3} />
      <Highlight text="OCEAN SPRAY" x={90} y={350} size={118} at={t.at('brand national.')} seed={23} rot={-2} />
      <PTag text="Not Ocean Spray: Empress brand cranberry sauce, trademark registered 1910 · Library of Congress" />
    </Mode>
  );
};

/** "Because it IS the can.": a hard cut in on the log on the coral desk, nothing else on it, held. */
const Flash: React.FC = () => (
  <Mode m="coral">
    <DarkPaper />
    <AbsoluteFill style={{transform: 'scale(1.22)', transformOrigin: '300px 900px'}}>
      <Payoff />
    </AbsoluteFill>
  </Mode>
);

/** "Those ridges are the can's ridges.": back to the cover framing; a loupe on the log's ridges, a loop on the can's. */
const Ridges: React.FC<{t: TL}> = ({t}) => {
  const m = cranMap(6, COVER.cx, COVER.by, COVER.pw);
  const layer = <Cran n={6} {...COVER} shadow={false} />;
  const [lx, ly] = m.at(588, 360); // the log's ridges (frame 6's own pixels)
  const [kx, ky] = m.at(1010, 450); // the empty can's ridges
  return (
    <Mode m="teal">
      <DarkPaper />
      <Payoff />
      <Loupe layer={layer} cx={lx} cy={ly} r={170} zoom={2.4} to={[300, 380]} at={t.at('Those ridges') + 2} bow={-40} />
      <Loop cx={kx} cy={ky} rx={120} ry={90} at={t.at("can's ridges.") - 2} seed={9} tilt={-20} />
    </Mode>
  );
};

const Scenes: React.FC<{t: TL; len: number}> = ({t, len}) => {
  const at = t.at;
  const c = {
    cover: 0,
    slide: 75, // the cover holds 2.5 s
    numbers: at('And we open') - 1,
    scoop: at('But in 1912,') - 1,
    barrel: at('Fresh berries') - 1,
    pot: at('His fix:') - 1,
    ocean: at('In 1941,') - 1,
    flash: at('Because it IS') - 1,
    ridges: at('Those ridges') - 1,
  };
  return (
    <>
      {useScene([
        [c.cover, <Cover />],
        [c.slide, <Slide a={c.slide} />],
        [c.numbers, <Numbers t={t} a={c.numbers} />],
        [c.scoop, <Urann t={t} a={c.scoop} stage="scoop" />],
        [c.barrel, <Urann t={t} a={c.barrel} stage="barrel" />],
        [c.pot, <Urann t={t} a={c.pot} stage="pot" />],
        [c.ocean, <Ocean t={t} a={c.ocean} />],
        [c.flash, <Flash />],
        [c.ridges, <Ridges t={t} />],
        // the end card's picture: the cover's, so the replay loops (EndText in the shell draws over it)
        [len, <Mode m="teal"><DarkPaper /><Payoff /></Mode>],
      ])}
    </>
  );
};

const DEF: ShortDef = {music: 'tg_test_kitchen', Scenes, segs: SEGS1};
export const B1: Built = build(SEGS1);
export const VSHORT1_FRAMES = storyFrames(B1) + OUTRO;
export const VShort1: React.FC = () => <VShell d={DEF} b={B1} />;
