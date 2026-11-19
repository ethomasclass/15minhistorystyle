// Hand-direction prototypes (stills only, not used by any chapter): the Ch07 recipe-card deal, the Ch08 grandma's card / "an ad"
// beat and the Ch08 subscribe card, each in two directions.
//   A  No hands. Each object arrives on its own, the Gilded Age deskProp way (ep5/edit/edit.js deskCut): lifted, with a high soft
//      shadow, it drops onto the desk (the shadow closes to a tight contact shadow), slides the last few px and spins to rest.
//   B  A drawn hand in the silhouette style of the drawn scenes (lookdev/rig.js: flat ink, a cream rim light, a pale shirt cuff):
//      the arm comes in from the frame edge, the fingers lie over the card's edge with the thumb under it, and the hand casts a
//      shadow on the desk and on the card that tightens as it comes down.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {Loop, Note} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {DeskScene} from '../kit/tg_desk';
import {CARD, Cran, cranMap, EelLoop, PH, RecipeCard} from '../kit/tg_late';

const easeOut = (q: number) => 1 - Math.pow(1 - q, 3);
const T0: {at: (p: string) => number; end: (p: string) => number} = {at: () => 0, end: () => 0};
const CW = CARD[0], CH = CARD[1];

// ------------------------------------------------------------------ A: lift and drop
// Flight (F frames): from `from` (offset px, extra degrees) to 34 px short of the spot, lifted (scale 1.05, shadow 44 px down, wide
// and soft). Touch-down at `at`: the lifted shadow closes to the contact shadow in 4 frames. Then it slides the last 34 px and the
// last few degrees with friction (6 frames), with a 1 degree overshoot back.
const F = 11;
export const DropIn: React.FC<{at: number; x: number; y: number; rot?: number; from?: [number, number, number]; children: React.ReactNode}> = ({at, x, y, rot = 0, from = [700, -420, -24], children}) => {
  const f = useCurrentFrame(), t = f - at;
  if (t < -F) return null;
  const slideDir = Math.atan2(-from[1], -from[0]), sx = Math.cos(slideDir) * 34, sy = Math.sin(slideDir) * 34;
  let dx: number, dy: number, dr: number, k: number, lift: number;
  if (t < 0) { const p = easeOut((t + F) / F); dx = from[0] * (1 - p) - sx; dy = from[1] * (1 - p) - sy; dr = from[2] * (1 - p) + 6; k = 1.05; lift = 1; }
  else { const p = interpolate(t, [0, 6], [0, 1], {...clamp, easing: easeOut}); dx = -sx * (1 - p); dy = -sy * (1 - p); dr = 6 * (1 - p) - 1.0 * Math.sin(Math.PI * p) ; k = interpolate(t, [0, 2, 5], [1.05, 0.99, 1], clamp); lift = interpolate(t, [0, 4], [0.35, 0], clamp); }
  const L = 3 + 41 * lift, B = 2 + 34 * lift;
  return (
    <div style={{position: 'absolute', left: x + dx, top: y + dy, transform: `rotate(${rot + dr}deg) scale(${k})`,
      filter: `drop-shadow(0 ${(3 * (1 - lift)).toFixed(1)}px 2px rgba(0,0,0,${(0.75 * (1 - lift)).toFixed(2)})) drop-shadow(${(L * 0.35).toFixed(1)}px ${L.toFixed(1)}px ${B.toFixed(1)}px rgba(0,0,0,${(0.35 + 0.25 * lift).toFixed(2)}))`}}>
      {children}
    </div>
  );
};

// ------------------------------------------------------------------ B: the drawn hand
// A right hand from above (the back of the hand), fingers pointing along -x from the knuckles, the wrist at the origin, the forearm
// going off along +x. `curl` 0: fingers lying flat over a card's edge (gripping it with the thumb underneath); 1: lifted off
// (fingertips raised, so they foreshorten and the shadow comes away). Units: px at scale 1 (the hand is about 250 px long).
const INK = '#0D0C09', RIM = '#F4EFE6', CUFF = '#E9DFC6';
const fingerSet = (curl: number) => [[-39, 78, 25], [-13, 88, 27], [13, 82, 26], [37, 64, 22]].map(([oy, L, w], i) => {
  const kx = -100 + Math.abs(oy + 6) * 0.16, ky = oy, l1 = L * 0.55, l2 = L * 0.5 * (1 - 0.6 * curl), a = (oy * 0.07 + (i === 3 ? 5 : 0)) * Math.PI / 180;
  const m = [kx - Math.cos(a) * l1, ky + Math.sin(a) * l1], tip = [m[0] - Math.cos(a + 0.1) * l2, m[1] + Math.sin(a + 0.1) * l2];
  return {k: [kx, ky], m, tip, w};
});
const handPaths = (curl: number, thumb: boolean) => {
  const fs = fingerSet(curl), seg = (p: number[], q: number[], w: number) => `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke-width="${w}" stroke-linecap="round"/>`;
  const back = `<path d="M10,-38 C-30,-48 -78,-56 -104,-52 C-118,-34 -118,36 -106,50 C-74,56 -30,50 10,40 Z"/>`;
  const fingers = fs.map((g) => seg(g.k, g.m, g.w) + seg(g.m, g.tip, g.w - 3)).join('');
  const th = thumb ? seg([-28, 38], [-74, 66], 28) + seg([-74, 66], [-110, 72], 23) : '';
  return {back, fingers, th};
};
/** The hand as SVG, wrist at (x, y), turned by `ang` (deg; 0 = fingers pointing left). `h`: height above the desk (px) for its
 *  shadow. `layer`: 'under' draws only the thumb (under the card), 'over' the rest. */
const HandSvg: React.FC<{x: number; y: number; ang: number; s?: number; curl?: number; h?: number; layer: 'under' | 'over'; cuffAt?: number}> = ({x, y, ang, s = 1.45, curl = 0, h = 8, layer, cuffAt = 70}) => {
  const {back, fingers, th} = handPaths(curl, true);
  const arm = `<path d="M-4,-40 L${cuffAt},-46 L900,-62 L900,66 L${cuffAt},50 L-4,40 Z"/>`;
  const cuff = `<path d="M${cuffAt},-47 L${cuffAt + 44},-50 L${cuffAt + 44},54 L${cuffAt},51 Z"/>`;
  const sleeve = `<path d="M${cuffAt + 44},-58 L900,-80 L900,84 L${cuffAt + 44},62 Z"/>`;
  const body = layer === 'under' ? `<g stroke="${INK}" fill="${INK}">${th}</g>` :
    `<g stroke="${INK}" fill="${INK}">${arm}${back}${fingers}</g><g fill="${CUFF}">${cuff}</g><g fill="#24302E">${sleeve}</g>`;
  const rim = layer === 'under' ? '' : `<g transform="translate(-1.5,-3.5)" opacity="0.8" stroke="${RIM}" fill="${RIM}">${back}${fingers}</g>`;
  const shadow = layer === 'under' ? '' : `<g transform="translate(${(h * 0.45).toFixed(1)},${(h * 0.8).toFixed(1)})" opacity="${(0.55 - Math.min(0.3, h / 260)).toFixed(2)}" stroke="#000" fill="#000" filter="url(#hb${Math.round(Math.min(40, 2 + h * 0.35))})">${arm}${back}${fingers}</g>`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>{Array.from({length: 41}, (_, i) => <filter key={i} id={`hb${i}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={i} /></filter>)}</defs>
      <g transform={`translate(${x},${y}) rotate(${ang}) scale(${s})`} dangerouslySetInnerHTML={{__html: shadow + rim + body}} />
    </svg>
  );
};
// where a card's right-edge grip is on screen: the card's div turns about its centre
const gripOf = (x: number, y: number, rot: number, inset = 46): [number, number] => {
  const cx = x + CW / 2, cy = y + CH / 2, a = (rot * Math.PI) / 180, px = CW / 2 - inset, py = 0;
  return [cx + px * Math.cos(a) - py * Math.sin(a), cy + px * Math.sin(a) + py * Math.cos(a)];
};
/** B: the hand carries a card in from the right edge, lays it down (its shadow and the card's close as it comes down), lets go
 *  (fingers lift) and goes back out. Card lands at `at`. */
export const RigDeal: React.FC<{at: number; x: number; y: number; rot?: number; card: React.ReactNode; armAng?: number; hold?: number}> = ({at, x, y, rot = 0, card, armAng = 32, hold = 7}) => {
  const f = useCurrentFrame(), t = f - at, IN = 12, OUT = 10;
  if (t < -IN) return null;
  const pIn = interpolate(t, [-IN, 0], [0, 1], {...clamp, easing: easeOut}), pOut = interpolate(t, [hold, hold + OUT], [0, 1], {...clamp, easing: (q) => q * q});
  const off = (1 - pIn) * 1300 + pOut * 1300, ang = armAng + rot, a = (ang * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a);
  const cardH = t < 0 ? 26 * (1 - pIn) + 8 : 0, handH = t < 0 ? cardH + 10 : interpolate(t, [0, 3, hold, hold + OUT], [10, 22, 26, 90], clamp);
  const curl = interpolate(t, [0, 3], [0, 1], clamp);
  const cardOff = t < 0 ? off : 0, [gx, gy] = gripOf(x + ux * cardOff, y + uy * cardOff, rot);
  const back = 246 + 40 * curl, wrist: [number, number] = [gx + ux * back + ux * (t >= 0 ? off : 0), gy + uy * back + uy * (t >= 0 ? off : 0)];
  const lifted = t < 0 ? cardH : 0;
  return (
    <AbsoluteFill>
      {t < 0 && <HandSvg x={wrist[0]} y={wrist[1]} ang={ang} layer="under" />}
      <div style={{position: 'absolute', left: x + ux * cardOff, top: y + uy * cardOff, transform: `rotate(${rot}deg) scale(${1 + lifted * 0.0012})`,
        filter: `drop-shadow(0 ${(3 * (lifted ? 0 : 1)).toFixed(1)}px 2px rgba(0,0,0,${lifted ? 0 : 0.75})) drop-shadow(${(lifted * 0.45 + 4).toFixed(1)}px ${(lifted * 0.8 + 12).toFixed(1)}px ${(lifted * 0.6 + 18).toFixed(1)}px rgba(0,0,0,0.5))`}}>{card}</div>
      {off < 1250 && <HandSvg x={wrist[0]} y={wrist[1]} ang={ang} curl={curl} h={handH} layer="over" />}
    </AbsoluteFill>
  );
};
/** B: the hand holds a card out over the desk (both lifted), for the subscribe ask. */
export const RigHold: React.FC<{at: number; x: number; y: number; rot?: number; card: React.ReactNode; armAng?: number}> = ({at, x, y, rot = 0, card, armAng = 34}) => {
  const f = useCurrentFrame(), t = f - at, p = interpolate(t, [-12, 0], [0, 1], {...clamp, easing: easeOut});
  if (t < -12) return null;
  const ang = armAng + rot, a = (ang * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a), off = (1 - p) * 1300, bob = 3 * Math.sin(f / 9);
  const [gx, gy] = gripOf(x + ux * off, y + uy * off + bob, rot), H = 54;
  return (
    <AbsoluteFill>
      <HandSvg x={gx + ux * 246} y={gy + uy * 246} ang={ang} layer="under" />
      <div style={{position: 'absolute', left: x + ux * off, top: y + uy * off + bob, transform: `rotate(${rot}deg) scale(1.03)`, filter: `drop-shadow(${H * 0.45}px ${H * 0.8}px 26px rgba(0,0,0,0.45))`}}>{card}</div>
      <HandSvg x={gx + ux * 246} y={gy + uy * 246} ang={ang} h={H + 8} layer="over" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the three beats
type V = 'A' | 'B';
const deal = (v: V, at: number, x: number, y: number, rot: number, card: React.ReactNode, from?: [number, number, number], armAng?: number) =>
  v === 'A' ? <DropIn at={at} x={x} y={y} rot={rot} from={from}>{card}</DropIn> : <RigDeal at={at} x={x} y={y} rot={rot} card={card} armAng={armAng} />;

/** Ch07 "In 1954, ... In 1955, ... Dorcas Reilly": three cards, one a date (cards land at 20, 60, 100). */
export const MontageProto: React.FC<{v: V}> = ({v}) => (
  <DeskScene ch="ch07" cuts={{montage: 0}} t={T0}>
    <AbsoluteFill>
      <DarkPaper />
      {deal(v, 20, 150, 150, -4, <RecipeCard kicker="1954 · SWIFT AND COMPANY" title="Butterball turkey" lines={['on the market']} />, [-900, -300, -30])}
      {deal(v, 60, 720, 330, 3, <RecipeCard kicker="1955 · NEW JERSEY" title="Campbell's test kitchen" lines={['home economists']} />, [500, 700, 26])}
      {deal(v, 100, 1290, 160, -2, (
        <RecipeCard kicker="HOME ECONOMIST" title="Dorcas Reilly" lines={['the ask: a recipe', 'from the pantry']}>
          <PH file="img/arch/dorcas_reilly.jpg" what="Dorcas Reilly" x={CW - 150} y={20} w={130} h={170} shadow={false} />
        </RecipeCard>
      ), [700, -420, -24], 62)}
      <Note text="things people already have" x={170} y={800} size={56} rot={-3} at={108} />
    </AbsoluteFill>
  </DeskScene>
);

/** Ch08 "...on a recipe card ... an ad.": the eel and the can, Grandma's card lands between them (at 20), the loop on "1 can" (50). */
export const GrandmaProto: React.FC<{v: V}> = ({v}) => {
  const can = {cx: 1370, by: 860, pw: 540};
  return (
    <DeskScene ch="ch08" cuts={{eelcan: 0}} t={T0}>
      <AbsoluteFill>
        <DarkPaper />
        <EelLoop x={20} y={170} w={900} at={0} />
        <Cran n={6} {...can} />
        {deal(v, 20, 690, 640, -3, <RecipeCard kicker="FROM THE KITCHEN OF GRANDMA" title="Cranberry sauce" lines={['1 can, jellied', 'open both ends', 'slide onto a plate']} />, [600, 520, 22])}
        <Loop cx={690 + 150} cy={757} rx={170} ry={36} at={50} seed={21} tilt={-3} />
        <Note text="what they could catch" x={140} y={580} size={50} rot={-3} at={-999} color="#ffffff" />
        <Note text="what somebody wrote down," x={1060} y={170} size={44} rot={-3} at={-999} color="#ffffff" />
        <Note text="...and sold back to us" x={1100} y={270} size={50} rot={-3} at={-999} color="#FF6F61" />
      </AbsoluteFill>
    </DeskScene>
  );
};
void cranMap;

/** Ch08 "hit subscribe": A, the card drops onto the desk; B, the hand holds it out over the desk (at 20). */
export const SubscribeProto: React.FC<{v: V}> = ({v}) => {
  const card = <RecipeCard kicker="QUICK FAVOR" title="subscribe" lines={["it's free."]} />;
  return (
    <DeskScene ch="ch08" cuts={{subscribe: 0}} t={T0}>
      <AbsoluteFill>
        <DarkPaper />
        <Note text="quick favor:" x={200} y={240} size={56} rot={-3} at={-999} color="#ffffff" />
        <Note text="hit subscribe" x={240} y={360} size={96} rot={-3} at={-999} />
        {v === 'A' ? <DropIn at={20} x={1130} y={330} rot={5} from={[650, -480, 30]}>{card}</DropIn> : <RigHold at={20} x={1110} y={300} rot={-6} card={card} />}
      </AbsoluteFill>
    </DeskScene>
  );
};
