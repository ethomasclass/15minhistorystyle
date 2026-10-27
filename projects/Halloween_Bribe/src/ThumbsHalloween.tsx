// Halloween thumbnail concepts, drawn at 1920x1080 and exported at 1280x720 by tools/thumbs.mjs (frame 140).
//   C  · IT WAS A BRIBE: silhouette painting, kids paid at the door while a wagon sits on the barn roof against the moon.
//   C2 · PAID TO STOP: same painting, the outline's tape words.
//   D  · HALLOWEEN WAS A RIOT: silhouette painting, boys running from the wagon on the roof, a tiny ghost with a lantern.
//   E  · TEAR GAS: the real Bismarck Tribune headline, 1 Nov 1933, "Tear Gas" looped in coral.
//   F  · masked kids, 1964 (Angelo Rizzuto, LOC), one mask in coral.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, Picture, Tint, Traced} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {fill} from './kit/shell';
import {MASKS} from './masks';

const CORAL = '#FF6F61';

/** Chunk History logo, top-left (YouTube covers the bottom corners). */
const Logo: React.FC = () => (
  <div style={{position: 'absolute', left: 40, top: 36, padding: '16px 22px', borderRadius: 14, background: 'rgba(13,12,9,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)'}}>
    <Img src={staticFile('img/brand/chunk-history-horizontal.svg')} style={{width: 380, display: 'block'}} />
  </div>
);

const Frame: React.FC<{children: React.ReactNode; vignette?: number}> = ({children, vignette = 0.3}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {children}
      <Finish vignette={vignette} />
      <Logo />
    </AbsoluteFill>
  </PaletteCtx.Provider>
);

const SIL: [number, number] = [1376, 768];

const DoorPainting: React.FC = () => <Picture src="img/gen/thumb/th1_a.png" place={fill(SIL, 688, 384, 1)} size={SIL} bw="saturate(1.15) contrast(1.08)" />;

export const ThumbC: React.FC = () => (
  <Frame>
    <DoorPainting />
    <Highlight text="IT WAS" x={330} y={200} size={160} at={0} seed={81} rot={-3} />
    <Highlight text="A BRIBE" x={420} y={410} size={160} at={0} seed={82} rot={-2} />
  </Frame>
);

export const ThumbC2: React.FC = () => (
  <Frame>
    <DoorPainting />
    <Highlight text="PAID" x={380} y={200} size={180} at={0} seed={83} rot={-3} />
    <Highlight text="TO STOP" x={440} y={420} size={160} at={0} seed={84} rot={-2} />
  </Frame>
);

export const ThumbD: React.FC = () => (
  <Frame>
    <Picture src="img/gen/thumb/th2_a.png" place={fill(SIL, 688, 384, 1)} size={SIL} bw="saturate(1.15) contrast(1.08)" />
    <Highlight text="HALLOWEEN" x={150} y={210} size={150} at={0} seed={85} rot={-3} />
    <Highlight text="WAS A RIOT" x={230} y={410} size={150} at={0} seed={86} rot={-2} />
  </Frame>
);

/** The real front-page headline as a torn newsprint strip across the desk. */
export const ThumbE: React.FC = () => {
  const size: [number, number] = [2600, 607];
  const w = 1760;
  const s = w / size[0];
  return (
    <Frame vignette={0.4}>
      <DarkPaper />
      <div style={{position: 'absolute', left: 80, top: 250, width: w, height: size[1] * s, transform: 'rotate(-2deg)', boxShadow: '0 22px 40px rgba(0,0,0,0.7)', background: '#efe8da', overflow: 'hidden'}}>
        <Picture src="img/ch03/bismarck_tribune_1933-11-01_tear_gas_headline.jpg" place={{left: 0, top: 0, scale: s}} size={size} bw="grayscale(1) contrast(1.35) sepia(0.2)" />
      </div>
      <Loop cx={362} cy={478} rx={300} ry={88} at={0} seed={87} color={CORAL} width={13} tilt={-2} />
      <Note text="the morning after Halloween, 1933" x={560} y={140} size={64} rot={-3} at={0} color="#ffffff" />
      <Highlight text="ON HALLOWEEN?" x={330} y={760} size={160} at={0} seed={88} rot={-2} />
    </Frame>
  );
};

/** 1964 street portrait: the monster-mask kid in coral. Needs MASKS.kids (tools/mask.py kids). */
export const ThumbF: React.FC = () => {
  const size: [number, number] = [3000, 2028];
  const place = fill(size, 1000, 560, 1);
  const m = (MASKS as Record<string, {alpha: string; data: {shapes: Record<string, string[]>}}>).kids;
  return (
    <Frame>
      <Picture src="img/ch05/kids_halloween_masks_nywts_1964.jpg" place={place} size={size} bw="grayscale(1) contrast(1.3) brightness(0.95)" />
      {m && <Tint mask={m.alpha} place={place} size={size} />}
      {m && <Traced paths={m.data.shapes.subject} place={place} at={0} dur={1} width={9} />}
      <AbsoluteFill style={{background: 'linear-gradient(200deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 40%)'}} />
      <Highlight text="IT WAS" x={1240} y={60} size={150} at={0} seed={89} rot={-3} />
      <Highlight text="A BRIBE" x={1180} y={250} size={150} at={0} seed={90} rot={-2} />
    </Frame>
  );
};



/** G · hybrid: the real 1933 headline in two torn strips + the 1964 monster mask cut out in coral. No logo (unreadable in the feed). */
const Strip: React.FC<{crop: [number, number, number, number]; x: number; y: number; w: number; rot: number}> = ({crop, x, y, w, rot}) => {
  const [x0, y0, x1, y1] = crop;
  const s = w / (x1 - x0);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w + 40, height: (y1 - y0) * s + 30, padding: '15px 20px', background: '#efe8da', transform: `rotate(${rot}deg)`, boxShadow: '0 18px 34px rgba(0,0,0,0.7)', overflow: 'hidden'}}>
      <div style={{position: 'relative', width: w, height: (y1 - y0) * s, overflow: 'hidden'}}>
        <Picture src="img/ch03/bismarck_tribune_1933-11-01_tear_gas_headline.jpg" place={{left: -x0 * s, top: -y0 * s, scale: s}} size={[2600, 607]} bw="grayscale(1) contrast(1.4) sepia(0.15)" />
      </div>
    </div>
  );
};

export const ThumbG: React.FC = () => {
  const size: [number, number] = [3000, 2028];
  const m = MASKS.kids;
  const sc = 1.45;
  const place = {left: 1240 - 569 * sc, top: 170 - 178 * sc, scale: sc};
  const cutStyle = {WebkitMaskImage: `url(${staticFile(m.alpha)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(m.alpha)})`, maskSize: '100% 100%'} as React.CSSProperties;
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
        <DarkPaper />
        <Strip crop={[50, 228, 1195, 392]} x={60} y={170} w={1120} rot={-3} />
        <Strip crop={[1215, 228, 2405, 392]} x={140} y={420} w={1050} rot={-1.5} />
        <Loop cx={420} cy={265} rx={360} ry={120} at={0} seed={91} color={CORAL} width={14} tilt={-3} />
        <div style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * sc, height: size[1] * sc, ...cutStyle, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}}>
          <Picture src="img/ch05/kids_halloween_masks_nywts_1964.jpg" place={{left: 0, top: 0, scale: sc}} size={size} bw="grayscale(1) contrast(1.3)" />
        </div>
        <Tint mask={m.alpha} place={place} size={size} />
        <Traced paths={m.data.shapes.subject} place={place} at={0} dur={1} width={10} />
        <Highlight text="ON HALLOWEEN?" x={110} y={760} size={150} at={0} seed={92} rot={-2} />
        <Finish vignette={0.35} />
      </AbsoluteFill>
    </PaletteCtx.Provider>
  );
};


// H1–H4 · clean type instead of newsprint (user note): big bold words in mixed faces and colours, the coral mask on the right.
const CREAM = '#f4efe6';
const TEALC = '#2FE0C4';
const ORANGE_T = '#FF9F1C';
const MaskHead: React.FC<{x?: number; y?: number; sc?: number}> = ({x = 1240, y = 170, sc = 1.45}) => {
  const size: [number, number] = [3000, 2028];
  const m = MASKS.kids;
  const place = {left: x - 569 * sc, top: y - 178 * sc, scale: sc};
  const cutStyle = {WebkitMaskImage: `url(${staticFile(m.alpha)})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile(m.alpha)})`, maskSize: '100% 100%'} as React.CSSProperties;
  return (
    <>
      <div style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * sc, height: size[1] * sc, ...cutStyle, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}}>
        <Picture src="img/ch05/kids_halloween_masks_nywts_1964.jpg" place={{left: 0, top: 0, scale: sc}} size={size} bw="grayscale(1) contrast(1.3)" />
      </div>
      <Tint mask={m.alpha} place={place} size={size} />
      <Traced paths={m.data.shapes.subject} place={place} at={0} dur={1} width={10} />
    </>
  );
};
const Word: React.FC<{t: string; x: number; y: number; size: number; color: string; font?: string; weight?: number; rot?: number; spacing?: number}> = ({t, x, y, size, color, font = JF.sans, weight = 800, rot = 0, spacing = -0.02}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 0.9, color, letterSpacing: `${spacing}em`, whiteSpace: 'nowrap', transform: `rotate(${rot}deg)`, transformOrigin: 'left center',
    textShadow: '0 6px 0 rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.8)'}}>{t}</div>
);
const Clean: React.FC<{children: React.ReactNode}> = ({children}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <DarkPaper />
      <MaskHead />
      {children}
      <Finish vignette={0.35} />
    </AbsoluteFill>
  </PaletteCtx.Provider>
);

/** H1 · TEAR GAS / ON HALLOWEEN? */
export const ThumbH1: React.FC = () => (
  <Clean>
    <Note text="North Dakota, 1933:" x={100} y={120} size={80} rot={-3} at={0} color={TEALC} />
    <Word t="TEAR" x={90} y={250} size={250} color={CREAM} />
    <Word t="GAS" x={90} y={470} size={250} color={CORAL} />
    <Highlight text="ON HALLOWEEN?" x={90} y={750} size={130} at={0} seed={93} rot={-2} />
  </Clean>
);

/** H2 · CANDY WAS A BRIBE */
export const ThumbH2: React.FC = () => (
  <Clean>
    <Word t="CANDY" x={90} y={170} size={260} color={CREAM} />
    <Word t="was a" x={110} y={440} size={120} color={TEALC} font='"Nanum Pen Script", cursive' weight={400} rot={-4} spacing={0} />
    <Highlight text="BRIBE" x={90} y={560} size={230} at={0} seed={94} rot={-3} />
  </Clean>
);

/** H3 · TRICK OR TREAT, with TREAT struck out and BRIBE written in */
export const ThumbH3: React.FC = () => (
  <Clean>
    <Word t="TRICK OR" x={90} y={170} size={190} color={CREAM} />
    <div style={{position: 'absolute', left: 90, top: 380}}>
      <Word t="TREAT" x={0} y={0} size={190} color="rgba(244,239,230,0.55)" />
      <div style={{position: 'absolute', left: -15, top: 75, width: 640, height: 22, background: CORAL, transform: 'rotate(-4deg)', borderRadius: 11, boxShadow: '0 4px 12px rgba(0,0,0,0.6)'}} />
    </div>
    <Highlight text="BRIBE" x={150} y={640} size={200} at={0} seed={95} rot={-4} />
  </Clean>
);

/** H4 · HALLOWEEN WAS A RIOT */
export const ThumbH4: React.FC = () => (
  <Clean>
    <Note text="before candy..." x={100} y={130} size={80} rot={-3} at={0} color={TEALC} />
    <Word t="HALLOWEEN" x={90} y={270} size={170} color={CREAM} />
    <Word t="WAS A" x={90} y={450} size={120} color={CREAM} />
    <Highlight text="RIOT" x={90} y={600} size={260} at={0} seed={96} rot={-3} />
  </Clean>
);

// X1–X5 · thumbnail-only Gemini images (B&W, one coral accent), clean type on the empty left.
const XImg: React.FC<{n: number; children: React.ReactNode}> = ({n, children}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Img src={staticFile(`img/gen/thumb/x${n}.png`)} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover'}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 50%)'}} />
      {children}
      <Finish vignette={0.3} />
    </AbsoluteFill>
  </PaletteCtx.Provider>
);
export const ThumbX1: React.FC = () => (
  <XImg n={1}>
    <Word t="TRICK OR" x={80} y={230} size={170} color={CREAM} />
    <Word t="TREAT?" x={80} y={420} size={170} color={CORAL} />
    <Highlight text="(PAY UP)" x={80} y={650} size={120} at={0} seed={97} rot={-3} />
  </XImg>
);
export const ThumbX2: React.FC = () => (
  <XImg n={2}>
    <Word t="TEAR" x={90} y={230} size={250} color={CREAM} />
    <Word t="GAS" x={90} y={450} size={250} color={CORAL} />
    <Highlight text="ON HALLOWEEN?" x={90} y={740} size={130} at={0} seed={98} rot={-2} />
  </XImg>
);
export const ThumbX3: React.FC = () => (
  <XImg n={3}>
    <Word t="CANDY" x={80} y={130} size={210} color={CREAM} />
    <Word t="was a" x={100} y={350} size={110} color={TEALC} font='"Nanum Pen Script", cursive' weight={400} rot={-4} spacing={0} />
    <Highlight text="BRIBE" x={80} y={460} size={200} at={0} seed={99} rot={-3} />
  </XImg>
);
export const ThumbX4: React.FC = () => (
  <XImg n={4}>
    <Word t="HALLOWEEN" x={80} y={220} size={170} color={CREAM} />
    <Word t="WAS A" x={80} y={400} size={120} color={CREAM} />
    <Highlight text="RIOT" x={80} y={550} size={250} at={0} seed={100} rot={-3} />
  </XImg>
);
export const ThumbX5: React.FC = () => (
  <XImg n={5}>
    <Word t="TRICK OR" x={60} y={200} size={150} color={CREAM} />
    <div style={{position: 'absolute', left: 60, top: 370}}>
      <Word t="TREAT" x={0} y={0} size={150} color="rgba(244,239,230,0.55)" />
      <div style={{position: 'absolute', left: -12, top: 58, width: 500, height: 18, background: CORAL, transform: 'rotate(-4deg)', borderRadius: 9}} />
    </div>
    <Highlight text="BRIBE" x={100} y={560} size={170} at={0} seed={101} rot={-4} />
  </XImg>
);

export const HALLOWEEN_THUMBS: Record<string, React.FC> = {C: ThumbC, C2: ThumbC2, D: ThumbD, E: ThumbE, F: ThumbF, G: ThumbG, H1: ThumbH1, H2: ThumbH2, H3: ThumbH3, H4: ThumbH4, X1: ThumbX1, X2: ThumbX2, X3: ThumbX3, X4: ThumbX4, X5: ThumbX5};
