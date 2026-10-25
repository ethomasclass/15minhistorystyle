// Chapter 1 · Not in the Picture: the cold open (driving question), then the channel intro and the title card.
// The first ~22 s are the approved preview P1 (src/previews/P1ColdOpen.tsx), re-timed to this chapter's voice; then the faces,
// the Central Pacific's share, the empty gap, the question as bare handwriting, and the hand-off to the empty chairs.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_not_in_the_picture.words.json';
import {clamp} from '../lib/anim';
import {Finish, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, useGFrame, usePal} from '../kit/Kit';
import {Sfx} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {makeTimeline, type Narration} from '../kit/shell';
import {CutOut, Desk3D, keys, Lift, Mono, PhotoCam, ScrimTag, shake, Shots, SlapTitle, TornPrint, zkeys} from '../kit/west';
import {IMG, SM, SZ} from '../samples/masks';
import {Hand, House, LINES, MPin, MRoute, PL, WestCard, WestMap} from '../kit/ch01_extra';
import {SUBTITLE, TITLE, DATES} from '../project';
import {ChairsLitho} from '../kit/house_litho';

/** The House chamber: 'litho' (generated 1860s chamber; the user's pick) or 'diagram' (the drawn seats, kept as a fallback). */
const HOUSE_LOOK: 'litho' | 'diagram' = 'litho';

const N = words as Narration;
const T = makeTimeline(N, 30);
/** Title card length (frames) after the channel intro. */
const TITLE_FRAMES = 150;
/** Narration ends; ~2 s of hold, then the channel intro. */
const END = Math.ceil(N.duration * 30) + 40;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

const SPIKE_TAG = 'A. J. Russell, East and West Shaking Hands at Laying Last Rail, May 10, 1869 · Wikimedia Commons';
const WORKER = 'img/previews/hart_tunnel8_worker_w.jpg';
const CAMP = 'img/ch01/hart_chinese_camp_browns.jpg';
const CAMP_SZ: [number, number] = [2024, 1955];
const CAMP_TAG = 'A. A. Hart, Chinese Camp, Brown\'s Station, Nev., c. 1868 (CPRR stereo no. 313) · Library of Congress';
const at = T.at;

// ---------------------------------------------------------------------------------------------------------------- P1

/** 1 · WIDE: the photo full-bleed, sky and crowd on separate layers so the push has depth. Hook tape at once. */
const Wide: React.FC = () => {
  const f = useCurrentFrame();
  const e = at('And most');
  const s = zkeys(f, [[0, 0.5], [e, 0.545]]);
  return (
    <AbsoluteFill>
      <PhotoCam src={IMG.spike} size={SZ.spike} cx={1920} cy={keys(f, [[0, 1330], [e, 1300]])} s={s} fg="img/previews/spike_fg.webp" bg="img/previews/spike_bg.jpg" fgK={keys(f, [[0, 0], [e, 0.06]])} />
      <SlapTitle text="NOT IN THE PICTURE" x={100} y={890} size={100} at={12} />
      <ScrimTag text={SPIKE_TAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** The desk with the torn print (gap bottom right), the worker in the gap and the map card. */
const DeskPieces: React.FC<{t0: number; worker: number; map: number; noWorker?: boolean}> = ({t0, worker, map, noWorker}) => (
  <>
    <Lift x={130} y={80} w={1150} hgt={875} h={10} at={t0} rot={-2} seed={2}>
      <TornPrint src={IMG.spike} size={SZ.spike} x={0} y={0} w={1150} at={-99} seed={3} corner={{at: 'br', x: 0.7, y: 0.58}} real grey shadow={5}
        tapes={[{x: -50, y: 30, w: 190, rot: -38}, {x: 1010, y: -6, w: 190, rot: 30}]} />
    </Lift>
    <Lift x={1360} y={640} w={440} hgt={300} h={4} at={map} rot={3} blur={0.7} seed={5}>
      <WestCard w={440} h={300} keys={[{f: 0, x: PL.promontory[0] + 60, y: PL.promontory[1] + 30, z: 1.5, tilt: 0}]} caption="UTAH TERR. · 1869" frame={0}>
        {(api) => <>
          <MRoute api={api} pts={LINES.cp} at={-99} width={6} />
          <MRoute api={api} pts={LINES.up} at={-99} width={6} color="#2FE0C4" ties={false} />
          <MPin api={api} at={PL.promontory} show={-99} label="Promontory" size={150} />
        </>}
      </WestCard>
    </Lift>
    {!noWorker && <Lift x={900} y={440} w={330} hgt={520} h={46} at={worker} seed={7}>
      <CutOut src={WORKER} size={SZ.tunnel8} mask={SM.worker} place={{left: 10 - 519 * 0.95, top: 18 - 1291 * 0.95, scale: 0.95}} at={-99} tint={0.6} soft traceAt={worker + 6}
        filter="grayscale(1) contrast(1.15) brightness(1.2)" />
    </Lift>}
  </>
);
const DESK_TAG = 'A. J. Russell, 1869 · Commons  ·  A. A. Hart, Heading of Tunnel No. 8, 1865–69 · LOC';

/** 2 · DESK: the print slaps onto the desk on "And most…", the worker lands in the torn gap on "aren't in it". */
const DeskReveal: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And most') - 1;
  const w = at("aren't") - 2;
  const sh = shake(f, [a + 3, w + 3], 10);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 26], [at('Look at it') - 1, 15]])} rotZ={keys(f, [[a, -2], [at('Look at it'), 0]])} z={0.9} y={10}>
        <DeskPieces t0={a} worker={w} map={a + 10} />
      </Desk3D>
      <Note text="the men who built it" x={1270} y={130} size={50} rot={-3} at={w + 10} />
      <ScrimTag text={DESK_TAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 3 · DETAIL pan across the two engines, a loop on each as it's named. */
const Engines: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Look at it');
  return (
    <PhotoCam src={IMG.spike} size={SZ.spike} cx={keys(f, [[a, 1150], [at('Two locomotives') + 22, 1150], [at('nose to nose') + 6, 2700], [at('Men'), 2760]])} cy={820} s={0.95}>
      {(S) => {
        const [jx, jy] = S(720, 720);
        const [ux, uy] = S(2700, 720);
        return (
          <>
            <Loop cx={jx} cy={jy} rx={330} ry={250} at={at('Two locomotives') + 3} seed={5} tilt={-6} width={6} />
            <Loop cx={ux} cy={uy} rx={320} ry={260} at={at('nose to nose') + 6} seed={9} tilt={4} width={6} />
            <Note text="Central Pacific" x={jx - 240} y={Math.min(880, jy + 260)} size={50} rot={-3} at={at('Two locomotives') + 8} out={at('Two locomotives') + 24} />
            <Note text="Union Pacific" x={ux - 200} y={Math.min(880, uy + 270)} size={50} rot={-3} at={at('nose to nose') + 10} />
            <ScrimTag text={SPIKE_TAG} x={34} y={24} />
          </>
        );
      }}
    </PhotoCam>
  );
};

/** 4 · DETAIL deep push (≈4× the wide) into the men holding up bottles. */
const Bottles: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Men') - 1;
  const b = at('Two engineers') - 1;
  return (
    <PhotoCam src={IMG.spike} size={SZ.spike} cx={keys(f, [[a, 1850], [b, 1680]])} cy={keys(f, [[a, 900], [b, 940]])} s={zkeys(f, [[a, 1.0], [b, 2.0]])}>
      {(S) => {
        const [bx, by] = S(1612, 925);
        return <Loop cx={bx} cy={by} rx={130} ry={190} at={at('bottles') - 2} seed={13} tilt={-8} width={6} />;
      }}
    </PhotoCam>
  );
};

/** 5 · DETAIL tilt from the faces down to the handshake; Montague in coral as the hands meet. */
const Handshake: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Two engineers') - 1;
  return (
    <PhotoCam src={IMG.spike} size={SZ.spike} cx={1860} cy={keys(f, [[a, 1400], [at('in the middle'), 1660]])} s={1.7} mask={SM.montague} tintAt={at('shaking') + 4} traceAt={at('shaking') + 6}>
      {() => <Note text="the engineers" x={1240} y={130} size={52} rot={-3} at={at('Two engineers') + 4} />}
    </PhotoCam>
  );
};

/** 6 · WIDE pull-out back on the desk: everything settled, the date slaps on; held through "…is finished." */
const DeskWide: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('May');
  const b = at('Now look') - 1;
  const sh = shake(f, [a + 2], 7);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a - 2, 12], [b, 20]])} z={zkeys(f, [[a - 2, 1.03], [b, 0.86]])} y={keys(f, [[a - 2, 40], [b, -10]])}>
        <DeskPieces t0={-99} worker={-99} map={-99} />
      </Desk3D>
      <SlapTitle text="MAY 10, 1869" x={1290} y={110} size={84} at={a} seed={11} rot={-3} />
      <Note text="the men who built it" x={1330} y={300} size={46} rot={-3} at={-99} />
      <Note text="coast to coast: done" x={1330} y={390} size={46} rot={-3} at={at('across the continent')} color="#ffffff" />
      <ScrimTag text={DESK_TAG} x={34} y={1026} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------- the rest

/** A loupe: a teal ring that shows the photo 2.3× magnified under it, gliding along the row of faces. */
const Loupe: React.FC<{cx: number; cy: number; r: number; s: number; sx: number; sy: number; at: number}> = ({cx, cy, r, s, sx, sy, at: a}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < a) return null;
  const k = interpolate(g, [a, a + 5], [0.3, 1], clamp);
  const m = s * 2.3;
  return (
    <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, transform: `scale(${k})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', boxShadow: '14px 18px 0 #050403'}}>
        <Img src={staticFile(IMG.spike)} style={{position: 'absolute', left: r - sx * m, top: r - sy * m, width: SZ.spike[0] * m, height: SZ.spike[1] * m, filter: 'grayscale(1) contrast(1.25) brightness(1.02)'}} />
      </div>
      <div style={{position: 'absolute', inset: -6, borderRadius: '50%', border: `8px solid ${pal.mark}`}} />
    </div>
  );
};

/** 7 · "Now look at the faces": pan along the crowd with a loupe. */
const Faces: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Now look') - 1;
  const b = at('The Central') - 1;
  const cx = keys(f, [[a, 1150], [b + 6, 2350]]);
  const s = 1.05;
  return (
    <AbsoluteFill>
      <PhotoCam src={IMG.spike} size={SZ.spike} cx={cx} cy={1520} s={s} />
      <Loupe cx={960} cy={470} r={210} s={s} sx={cx} sy={1470} at={a + 6} />
      <Note text="the faces" x={1240} y={810} size={58} rot={-3} at={at('faces') - 2} />
      <ScrimTag text={SPIKE_TAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 8 · The Central Pacific built the western half: the series map, both lines, the CP's half in coral. */
const WestHalf: React.FC = () => {
  const a = at('The Central') - 1;
  const ks = [{f: a, x: 1700, y: 1250, z: 0.5, tilt: 34, rot: -4}, {f: at('And most of its') - 1, x: 1480, y: 1260, z: 0.62, tilt: 40, rot: -1}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRoute api={api} pts={LINES.up} at={-99} color="#2FE0C4" ties={false} width={6} opacity={0.75} />
          <MRoute api={api} pts={LINES.cp} at={at('western') - 4} dur={14} width={9} />
          <MPin api={api} at={PL.sacramento} show={a + 4} label="Sacramento" side="l" size={46} />
          <MPin api={api} at={PL.omaha} show={a + 4} label="Omaha" size={46} />
          <MPin api={api} at={PL.promontory} show={at('half') - 2} label="Promontory" size={46} />
        </>}
      </WestMap>
      <SlapTitle text="CENTRAL PACIFIC" x={110} y={90} size={84} at={at('Central') + 2} seed={23} />
      <Note text="the western half" x={130} y={240} size={54} rot={-3} at={at('western') - 2} />
      <ScrimTag text="Map: Natural Earth outlines; lines from town control points, approx." />
    </AbsoluteFill>
  );
};

/** 9 · "around four out of five, were Chinese": Hart's Chinese camp, wide, then the stamp. */
const Camp: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('And most of its') - 1;
  const b = at('Look again') - 1;
  return (
    <AbsoluteFill>
      <PhotoCam src={CAMP} size={CAMP_SZ} cx={keys(f, [[a, 1150], [b, 760]])} cy={keys(f, [[a, 1150], [b, 1180]])} s={zkeys(f, [[a, 0.98], [b, 1.35]])} vignette={0.7} />
      <Mono text="Most estimates" x={1240} y={170} size={26} at={at('most estimates') - 1} />
      <SlapTitle text="≈ 4 IN 5" x={1240} y={240} size={130} at={at('four')} seed={41} rot={-3} />
      <Hand parts={[['were '], ['Chinese', '#FF6F61']]} x={1250} y={470} size={86} at={at('Chinese') - 2} />
      <ScrimTag text={CAMP_TAG} />
    </AbsoluteFill>
  );
};

/** 10 · "Look again. You can't find them." The torn print, the empty gap held, then the worker slaps in. */
const Gap: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('Look again') - 1;
  const w = at('them') + 1;
  const sh = shake(f, [w + 3], 10);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Desk3D tilt={keys(f, [[a, 14], [at('question'), 20]])} z={zkeys(f, [[a, 1.12], [at('question'), 1.2]])} x={keys(f, [[a, -90], [at('question'), -130]])} y={keys(f, [[a, -120], [at('question'), -150]])}>
        <DeskPieces t0={-99} worker={w} map={-99} />
      </Desk3D>
      <ScrimTag text={DESK_TAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 11 · The question: the print far back and soft, the title slaps on. */
const QuestionTitle: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('question') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 30], [at('The railroad was'), 24]])} z={zkeys(f, [[a, 0.72], [at('The railroad was'), 0.78]])} rotZ={keys(f, [[a, 6], [at('The railroad was'), 3]])}>
        <Lift x={330} y={140} w={1150} hgt={875} h={4} at={-99} rot={-2} blur={4} seed={2}>
          <TornPrint src={IMG.spike} size={SZ.spike} x={0} y={0} w={1150} at={-99} seed={3} corner={{at: 'br', x: 0.7, y: 0.58}} real grey shadow={5} filter="grayscale(1) contrast(1.1) brightness(0.55)" />
        </Lift>
      </Desk3D>
      <SlapTitle text="THE QUESTION" x={560} y={420} size={140} at={at('question')} seed={52} rot={-2} />
    </AbsoluteFill>
  );
};

/** 12 · "tie a country … back together": the handshake again, pulling out slowly, the trace on Montague. */
const TieTogether: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The railroad was') - 1;
  const b = at('and open the West') - 1;
  return (
    <PhotoCam src={IMG.spike} size={SZ.spike} cx={keys(f, [[a, 1800], [b, 1880]])} cy={1560} s={zkeys(f, [[a, 1.45], [b, 1.05]])} mask={SM.montague} tintAt={a + 2} traceAt={a + 4}>
      {() => <>
        <Note text="a civil war behind them" x={1150} y={120} size={50} rot={-3} at={at('civil war') - 2} color="#ffffff" />
        <Note text="tie it back together" x={1150} y={210} size={60} rot={-3} at={at('back together') - 2} />
        <ScrimTag text={SPIKE_TAG} x={34} y={24} />
      </>}
    </PhotoCam>
  );
};

/** 13 · "open the West to anyone": the map, both lines finished, an arrow of people west. */
const OpenWest: React.FC = () => {
  const a = at('and open the West') - 1;
  const ks = [{f: a, x: 2050, y: 1300, z: 0.36, tilt: 46, rot: 3}, {f: at('So who did') - 1, x: 1950, y: 1250, z: 0.42, tilt: 40, rot: 0}];
  return (
    <AbsoluteFill>
      <WestMap keys={ks}>
        {(api) => <>
          <MRoute api={api} pts={LINES.cp} at={-99} width={6} color="#2FE0C4" ties={false} />
          <MRoute api={api} pts={LINES.up} at={-99} width={6} color="#2FE0C4" ties={false} />
          <MPin api={api} at={PL.promontory} show={-99} />
        </>}
      </WestMap>
      <Hand parts={[['open the West '], ['to anyone', '#ffffff']]} x={260} y={130} size={84} at={at('open the West') - 2} />
      <ScrimTag text="Map: Natural Earth outlines; lines approx." />
    </AbsoluteFill>
  );
};

/** 14 · The question as bare handwriting on the desk ("open" in coral), then its answer line under it. */
const QuestionDesk: React.FC<{second?: boolean}> = ({second}) => {
  const f = useCurrentFrame();
  const a = at('So who did') - 1;
  const b = at("It's about") - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={second ? keys(f, [[b, 8], [at("We'll"), 14]]) : keys(f, [[a, 10], [at('The answer'), 6]])} z={second ? zkeys(f, [[b, 1.0], [at("We'll"), 0.92]]) : zkeys(f, [[a, 1.0], [at('The answer'), 1.06]])} lamp={[900, 420]}>
        <div />
      </Desk3D>
      <Hand parts={[['who did it actually ']]} x={210} y={second ? 170 : 300} size={second ? 76 : 96} at={second ? -99 : at('who did') - 2} dur={10} />
      <Hand parts={[['open', '#FF6F61'], [' it for?']]} x={300} y={second ? 290 : 450} size={second ? 76 : 96} at={second ? -99 : at('open it for') - 2} dur={10} />
      {second && <>
        <Hand parts={[['not trains:', '#ffffff']]} x={260} y={520} size={64} at={-99} />
        <Hand parts={[['who counted as '], ['part of the country', '#ffffff']]} x={220} y={640} size={72} at={at('who counted') - 2} dur={16} />
      </>}
      {!second && <Loop cx={420} cy={530} rx={170} ry={78} at={at('open it for') + 6} seed={61} tilt={-5} width={6} color="#FF6F61" />}
    </AbsoluteFill>
  );
};

/** 15 · "The answer isn't really about trains": the engines, a quiet pull-out, struck through. */
const NotTrains: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('The answer') - 1;
  const b = at("It's about") - 1;
  return (
    <PhotoCam src={IMG.spike} size={SZ.spike} cx={keys(f, [[a, 2600], [b, 2450]])} cy={keys(f, [[a, 700], [b, 900]])} s={zkeys(f, [[a, 1.1], [b, 0.8]])}>
      {() => <>
        <Hand parts={[['not about trains', '#ffffff']]} x={180} y={850} size={76} at={at('trains') - 4} />
        <ScrimTag text={SPIKE_TAG} x={34} y={24} />
      </>}
    </PhotoCam>
  );
};

/** 16 · "We'll come back to the men who aren't in this picture": push into the empty gap of the torn print. */
const BackToGap: React.FC = () => {
  const f = useCurrentFrame();
  const a = at("We'll") - 1;
  const b = at('But first') - 1;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 18], [b, 12]])} z={zkeys(f, [[a, 1.0], [b, 1.45]])} x={keys(f, [[a, 0], [b, -380]])} y={keys(f, [[a, 0], [b, -260]])} lamp={[1100, 620]}>
        <DeskPieces t0={-99} worker={-99} map={-99} noWorker />
      </Desk3D>
      <Note text="we'll come back to them" x={1180} y={170} size={54} rot={-3} at={at('come back') - 2} />
      <ScrimTag text={SPIKE_TAG} x={34} y={24} />
    </AbsoluteFill>
  );
};

/** 17 · Hand-off: "a room full of empty chairs" (the House, drawn on the desk). */
const Chairs: React.FC = () => {
  const f = useCurrentFrame();
  const a = at('But first') - 1;
  if (HOUSE_LOOK === 'litho') return <ChairsLitho a={a} end={END} emptyAt={at('empty')} />;
  return (
    <AbsoluteFill>
      <Desk3D tilt={keys(f, [[a, 6], [END, 10]])} z={zkeys(f, [[a, 1.0], [END, 0.95]])} lamp={[960, 620]}><div /></Desk3D>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zkeys(f, [[a, 1.08], [END, 1.0]])})`, transformOrigin: '960px 760px'}}>
        <House cx={960} cy={900} s={1.15} at={at('room') - 4} emptyAt={at('empty') - 2} />
      </div>
      <Note text="a room full of empty chairs" x={560} y={110} size={64} rot={-3} at={at('empty') - 2} color="#ffffff" />
    </AbsoluteFill>
  );
};

/** Title card after the channel intro: the Russell photo dimmed, the title on orange, the subtitle in teal. */
const Title: React.FC = () => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#0b0a08'}}>
      <PhotoCam src={IMG.spike} size={SZ.spike} cx={1920} cy={1350} s={zkeys(f, [[0, 0.52], [TITLE_FRAMES, 0.56]])} bw="grayscale(1) contrast(1.15) brightness(0.42)" vignette={0.8} />
      <SlapTitle text={TITLE} x={280} y={370} size={130} at={4} seed={61} />
      {g >= 14 && <div style={{position: 'absolute', left: 340, top: 600, fontFamily: JF.display, fontSize: 60, color: pal.mark, whiteSpace: 'nowrap', textShadow: '0 3px 16px rgba(0,0,0,0.9)',
        opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1300} y={730} size={56} rot={-5} at={24} />
      <ScrimTag text={SPIKE_TAG} />
    </AbsoluteFill>
  );
};

/** Gentle sound effects under the narration (felt more than heard). */
const Sounds: React.FC = () => {
  const cut = (w: string, d = 1) => at(w) - d;
  const sfx: [number, string, number][] = [
    [12, 'stamp', 0.22],
    [cut('And most'), 'whip_soft', 0.16], [cut('And most') + 3, 'paper_slap_soft', 0.25], [cut('And most') + 6, 'tape_press', 0.18],
    [cut('And most') + 11, 'card_slide_soft', 0.2],
    [at("aren't") + 1, 'paper_slap_soft', 0.25], [at("aren't") + 8, 'marker_tick', 0.2],
    [cut('Look at it') - 4, 'whip_soft', 0.25], [at('Two locomotives') + 1, 'marker_tick', 0.2], [at('nose to nose') + 4, 'marker_tick', 0.2],
    [cut('Men'), 'whoosh', 0.2], [at('bottles') - 4, 'marker_tick', 0.2],
    [cut('Two engineers'), 'whoosh', 0.2], [at('Two engineers') + 2, 'marker_tick', 0.2],
    [at('May') - 6, 'whip_soft', 0.25], [at('May'), 'stamp', 0.22], [at('across the continent') - 2, 'marker_tick', 0.2],
    // the rest
    [cut('Now look'), 'whoosh', 0.22], [at('Now look') + 5, 'card_slide_soft', 0.18], [at('faces') - 4, 'marker_tick', 0.2],
    [cut('The Central') - 4, 'whip_soft', 0.25], [at('Central') + 2, 'stamp', 0.22], [at('western') - 4, 'marker_tick', 0.2],
    [cut('And most of its'), 'whoosh', 0.22], [at('most estimates') - 1, 'block_tap_soft', 0.15], [at('four'), 'stamp', 0.22], [at('Chinese') - 4, 'marker_tick', 0.2],
    [cut('Look again'), 'whoosh', 0.2], [at('them') + 2, 'paper_slap_soft', 0.25], [at('them') + 5, 'tape_press', 0.16],
    [cut('question'), 'whoosh', 0.2], [at('question'), 'stamp', 0.22],
    [cut('The railroad was'), 'whoosh', 0.2], [at('civil war') - 4, 'marker_tick', 0.2], [at('back together') - 4, 'marker_tick', 0.2],
    [cut('and open the West') - 4, 'whip_soft', 0.22], [at('open the West') - 4, 'marker_tick', 0.2],
    [cut('So who did'), 'whoosh', 0.2], [at('who did') - 4, 'marker_tick', 0.2], [at('open it for') - 4, 'marker_tick', 0.2],
    [cut('The answer'), 'whoosh', 0.2], [at('trains') - 6, 'marker_tick', 0.2],
    [cut("It's about"), 'whoosh', 0.2], [at('who counted') - 4, 'marker_tick', 0.2],
    [cut("We'll"), 'whip_soft', 0.2], [at('come back') - 4, 'marker_tick', 0.2],
    [cut('But first'), 'whoosh', 0.2], [at('room') - 2, 'block_tap_soft', 0.12], [at('room') + 6, 'block_tap_soft', 0.1], [at('empty') - 4, 'marker_tick', 0.2],
  ];
  return <>{sfx.map(([f, n, v], i) => <Sfx key={i} at={f} src={`sfx/${n}.wav`} volume={v} />)}</>;
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const shots: [number, React.ReactNode, ('whip' | 'cut')?][] = [
    [0, <Wide />],
    [at('And most') - 1, <DeskReveal />, 'cut'],
    [at('Look at it') - 1, <Engines />, 'whip'],
    [at('Men') - 1, <Bottles />, 'cut'],
    [at('Two engineers') - 1, <Handshake />, 'cut'],
    [at('May') - 2, <DeskWide />, 'whip'],
    [at('Now look') - 1, <Faces />, 'cut'],
    [at('The Central') - 1, <WestHalf />, 'whip'],
    [at('And most of its') - 1, <Camp />, 'cut'],
    [at('Look again') - 1, <Gap />, 'cut'],
    [at('question') - 1, <QuestionTitle />, 'cut'],
    [at('The railroad was') - 1, <TieTogether />, 'cut'],
    [at('and open the West') - 1, <OpenWest />, 'whip'],
    [at('So who did') - 1, <QuestionDesk />, 'cut'],
    [at('The answer') - 1, <NotTrains />, 'cut'],
    [at("It's about") - 1, <QuestionDesk second />, 'cut'],
    [at("We'll") - 1, <BackToGap />, 'whip'],
    [at('But first') - 1, <Chairs />, 'cut'],
  ];
  let scene: React.ReactNode = <Shots shots={shots} />;
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      {frame >= END + INTRO_FRAMES && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_not_in_the_picture.wav')} />
      {/* cold-open bed: the channel's "investigators" cue, dipping out under the hand-off into the channel intro */}
      <Audio src={staticFile('music/r_cold_open.mp3')} volume={(fr) => interpolate(fr, [0, 15, at('But first'), END - 10, END + 6], [0, 0.17, 0.17, 0.1, 0], clamp)} />
      {frame < END && <Sounds />}
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

export const Ch01: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
