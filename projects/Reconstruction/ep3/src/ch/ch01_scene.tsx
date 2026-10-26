// ch01's drawn scene and mood pieces (a heavy chapter: the killing is told, never shown).
//   ScenePlan   Chilton's store in section: the store, the cellar under it, the cellar window, the street. Three passes:
//               'shot'   the lamp, the two glasses meeting, a flash at the window, the lamp out
//               'cellar' where he fell, his call for help going out unanswered, the path up the stairs to the door
//               'street' the path into the street, the crowd closing in, the point going dark
//   Lamplight   a warm, flickering lamp from one side, laid over the testimony pages
//   LampFigure  an anonymous cut-paper silhouette (traced from an unidentified man, 1860: never a likeness) in lamplight
// The plan follows his widow's testimony (Mississippi in 1875, pp. 437-438); it is drawn, not to scale, and has no figures.
import React from 'react';
import {AbsoluteFill, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {DarkPaper, Sfx} from '../kit/common';
import {JF, Tag, useGFrame} from '../kit/Kit';
import {CORAL, TEAL} from '../kit/rc';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const CREAM = 'rgba(236,230,216,0.82)';
const FAINT = 'rgba(236,230,216,0.22)';
const AMBER = '255,186,110';

// --------------------------------------------------------------------------------------------- the drawing (px)
const G = 560;                                    // ground level
const S = {x0: 420, x1: 1080, top: 250, peak: 165}; // the store above ground
const C = {y1: 830};                              // the cellar floor
const WIN = {x: 1080, y0: 574, y1: 616};          // the cellar window, at ground level, on the street side
const DOOR = {y0: 452, y1: G};                    // the store's door onto the street
const TABLE = {x: 905, y: 770};
const LAMP = {x: 985, y: 728};
const FELL = {x: 930, y: 812};
const STREET = {x: 1400, y: G - 6};
/** the path he was carried along: from where he fell, to the stairs, up, across the store, out of the door, into the street */
const PATH: [number, number][] = [[FELL.x, FELL.y], [600, 812], [540, 812], [700, G - 6], [1040, G - 6], [1110, G - 6], [STREET.x, STREET.y]];
const DOOR_T = 0.63;                              // how far along the path the door is

const seg = (pts: [number, number][]) => {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  return {lens, total};
};
/** the first fraction `t` of a polyline, as an SVG path */
const partial = (pts: [number, number][], t: number) => {
  const {lens, total} = seg(pts);
  let left = total * t, d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < lens.length && left > 0; i++) {
    const k = Math.min(1, left / lens[i]);
    d += ` L ${pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k} ${pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k}`;
    left -= lens[i];
  }
  return d;
};

export type PlanCam = [number, number, number, number][];   // [frame, centre x, centre y, zoom]
const camAt = (keys: PlanCam, f: number) => {
  if (f <= keys[0][0]) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const [f0, x0, y0, z0] = keys[i - 1], [f1, x1, y1, z1] = keys[i];
      const k = ease((f - f0) / Math.max(1, f1 - f0));
      return [f, x0 + (x1 - x0) * k, y0 + (y1 - y0) * k, z0 + (z1 - z0) * k];
    }
  }
  return keys[keys.length - 1];
};

/** A label on the drawing: small mono caps, written on (clip), dark backed so it reads on the hatching. */
const Label: React.FC<{text: string; x: number; y: number; at: number; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; out?: number}> = ({text, x, y, at, color = CREAM, size = 22, anchor = 'start', out = 1e7}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 8], [0, 1], clamp);
  const w = text.length * (size * 0.62 + 3) + 32;   // mono, with 3 px letter spacing
  const left = anchor === 'start' ? x : anchor === 'middle' ? x - w / 2 : x - w;
  return (
    <div style={{position: 'absolute', left, top: y - size, width: w, height: size * 1.7, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(14,13,11,0.78)', fontFamily: JF.mono, fontSize: size, letterSpacing: 3, color, whiteSpace: 'nowrap', clipPath: `inset(0 ${(1 - k) * 100}% 0 0)`}}>{text}</div>
  );
};

export type SceneCues = {
  a: number;            // the cut onto the drawing
  out: number;          // the next cut
  cam: PlanCam;
  glasses?: number;     // the two glasses slide together…
  touch?: number;       // …and touch
  fired?: number;       // the flash at the window
  shot?: number;        // 'shot in a store's cellar'
  called?: number;      // 'He called for help'
  nobody?: number;      // 'Nobody came'
  asked?: number;       // 'He asked to be carried outside'
  street?: number;      // 'They carried him into the street'
  crowd?: number;       // 'a crowd of armed men'
  again?: number;       // 'shot him again, many times'
};

/** Chilton's store at Clinton, in section: drawn on, then lit, then the moments of the testimony, told on the plan. */
export const ScenePlan: React.FC<{mode: 'shot' | 'cellar' | 'street'; c: SceneCues; children?: React.ReactNode}> = ({mode, c, children}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const [, cx, cy, z] = camAt(c.cam, f);
  // the first pass draws the building on; the later passes open on it already drawn
  const draw = mode === 'shot' ? interpolate(f, [c.a, c.a + 22], [0, 1], clamp) : 1;
  const dash = (len = 1) => ({pathLength: len, strokeDasharray: len, strokeDashoffset: len * (1 - draw)});
  // the lamp: on until the shot, then out (it stays out in the later passes)
  const lampOn = mode === 'shot' ? (c.fired === undefined || f < c.fired ? interpolate(f, [c.a + 10, c.a + 22], [0, 1], clamp) : interpolate(f, [c.fired, c.fired + 10], [1, 0], clamp)) : 0;
  const flick = 0.86 + 0.14 * random(`lf${Math.floor(f / 2)}`);
  // the glasses meet
  const meet = c.glasses !== undefined ? interpolate(f, [c.glasses, (c.touch ?? c.glasses + 12)], [0, 1], clamp) : 0;
  const flash = c.fired !== undefined ? interpolate(f, [c.fired, c.fired + 2, c.fired + 9], [0, 1, 0], clamp) : 0;
  const trail = c.fired !== undefined ? interpolate(f, [c.fired, c.fired + 3], [0, 1], clamp) : 0;
  // where he fell, the call for help, the path
  const fell = mode !== 'shot' || (c.fired !== undefined && f >= c.fired + 12);
  const pathT = mode === 'cellar' ? (c.asked !== undefined ? interpolate(f, [c.asked + 4, c.asked + 40], [0, DOOR_T], clamp) : 0)
    : mode === 'street' ? interpolate(f, [c.street ?? c.a, (c.street ?? c.a) + 30], [DOOR_T, 1], clamp) : 0;
  const crowdK = c.crowd !== undefined ? interpolate(f, [c.crowd, c.crowd + 40], [0, 1], clamp) : 0;
  const darken = c.again !== undefined ? interpolate(f, [c.again, c.again + 24], [0, 1], clamp) : 0;
  const N = 34;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DarkPaper />
      <AbsoluteFill style={{transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})`, transformOrigin: '0 0'}}>
        {/* the lamp's glow, under the lines */}
        <div style={{position: 'absolute', left: LAMP.x - 330, top: LAMP.y - 260, width: 660, height: 520, borderRadius: '50%',
          background: `radial-gradient(closest-side, rgba(${AMBER},${0.42 * lampOn * flick}), rgba(${AMBER},0))`}} />
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs>
            <pattern id="earth" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="22" stroke={FAINT} strokeWidth="2" />
            </pattern>
            <clipPath id="cellarClip"><rect x={S.x0} y={G} width={S.x1 - S.x0} height={C.y1 - G} /></clipPath>
          </defs>
          {/* the ground, and the earth round the cellar */}
          <path d={`M 120 ${G} L ${S.x0} ${G} M ${S.x1} ${G} L 1880 ${G}`} stroke={CREAM} strokeWidth={4} {...dash()} />
          <rect x={S.x0 - 70} y={G} width={S.x1 - S.x0 + 140} height={C.y1 - G + 60} fill="url(#earth)" opacity={draw} />
          <rect x={S.x0} y={G} width={S.x1 - S.x0} height={C.y1 - G} fill="#151412" opacity={draw} />
          {/* the cellar, dark until the lamp */}
          <rect x={S.x0} y={G} width={S.x1 - S.x0} height={C.y1 - G} fill={`rgba(${AMBER},${0.07 * lampOn * flick})`} />
          <path d={`M ${S.x0} ${G} L ${S.x0} ${C.y1} L ${S.x1} ${C.y1} L ${S.x1} ${WIN.y1} M ${S.x1} ${WIN.y0} L ${S.x1} ${G}`} fill="none" stroke={CREAM} strokeWidth={5} strokeLinejoin="round" {...dash()} />
          {/* the store above ground */}
          <path d={`M ${S.x0} ${G} L ${S.x0} ${S.top} L ${(S.x0 + S.x1) / 2} ${S.peak} L ${S.x1} ${S.top} L ${S.x1} ${DOOR.y0} M ${S.x1} ${DOOR.y1 - 1} L ${S.x1} ${G}`}
            fill="none" stroke={CREAM} strokeWidth={5} strokeLinejoin="round" {...dash()} />
          <line x1={S.x0} y1={G} x2={S.x1} y2={G} stroke={CREAM} strokeWidth={4} {...dash()} />
          {[560, 760, 940].map((x) => <rect key={x} x={x - 45} y={310} width={90} height={110} fill="none" stroke={FAINT} strokeWidth={3} opacity={draw} />)}
          {/* the stairs, cellar to store */}
          {Array.from({length: 7}, (_, i) => {
            const x = 540 + (160 * i) / 7, y = C.y1 - 18 - ((C.y1 - G - 10) * i) / 7;
            return <path key={i} d={`M ${x} ${y} L ${x + 160 / 7} ${y} L ${x + 160 / 7} ${y - (C.y1 - G - 10) / 7}`} fill="none" stroke={FAINT} strokeWidth={3} opacity={draw} />;
          })}
          {/* the window's frame, and the door's */}
          <rect x={WIN.x - 7} y={WIN.y0} width={14} height={WIN.y1 - WIN.y0} fill={`rgba(${AMBER},${0.8 * lampOn * flick})`} stroke={CREAM} strokeWidth={3} opacity={draw} />
          <path d={`M ${S.x1 - 16} ${DOOR.y0} L ${S.x1} ${DOOR.y0} M ${S.x1 - 16} ${DOOR.y1 - 2} L ${S.x1} ${DOOR.y1 - 2}`} stroke={CREAM} strokeWidth={3} opacity={draw} />
          {/* the table, the lamp, two glasses */}
          <g opacity={draw}>
            <path d={`M ${TABLE.x - 70} ${TABLE.y} L ${TABLE.x + 70} ${TABLE.y} M ${TABLE.x - 55} ${TABLE.y} L ${TABLE.x - 55} ${C.y1} M ${TABLE.x + 55} ${TABLE.y} L ${TABLE.x + 55} ${C.y1}`} stroke={CREAM} strokeWidth={4} />
            <path d={`M ${LAMP.x - 9} ${LAMP.y + 40} L ${LAMP.x + 9} ${LAMP.y + 40} L ${LAMP.x + 5} ${LAMP.y + 14} L ${LAMP.x - 5} ${LAMP.y + 14} Z`} fill="none" stroke={CREAM} strokeWidth={3} />
            <ellipse cx={LAMP.x} cy={LAMP.y + 4} rx={9} ry={13} fill={`rgba(${AMBER},${0.9 * lampOn})`} stroke={CREAM} strokeWidth={2.5} />
            {mode === 'shot' && [-1, 1].map((s) => {
              const x = TABLE.x + s * (30 - 22 * meet);
              const tilt = s * -10 * meet;
              return <path key={s} transform={`rotate(${tilt} ${x} ${TABLE.y - 4})`} d={`M ${x - 9} ${TABLE.y - 36} L ${x + 9} ${TABLE.y - 36} L ${x + 6} ${TABLE.y - 4} L ${x - 6} ${TABLE.y - 4} Z`}
                fill="rgba(236,230,216,0.12)" stroke={CREAM} strokeWidth={3} />;
            })}
          </g>
          {/* the shot: from outside the window, in */}
          {mode === 'shot' && trail > 0 && (
            <line x1={WIN.x + 230} y1={WIN.y0 + 6} x2={WIN.x + 230 + (TABLE.x + 10 - WIN.x - 230) * trail} y2={WIN.y0 + 6 + (TABLE.y - 30 - WIN.y0 - 6) * trail}
              stroke={CORAL} strokeWidth={4} strokeDasharray="14 10" opacity={interpolate(f, [c.fired! + 3, c.fired! + 40], [1, 0.55], clamp)} />
          )}
          {/* where he fell */}
          {fell && mode !== 'street' && <g opacity={mode === 'cellar' ? 1 : interpolate(f, [c.fired! + 12, c.fired! + 18], [0, 1], clamp)}>
            <circle cx={FELL.x} cy={FELL.y} r={11} fill={CORAL} />
          </g>}
          {/* his call for help: rings going out, reaching nobody */}
          {mode === 'cellar' && c.called !== undefined && [0, 1, 2, 3].map((i) => {
            const t0 = c.called! + i * 9;
            const k = interpolate(f, [t0, t0 + 34], [0, 1], clamp);
            if (k <= 0 || k >= 1) return null;
            return <circle key={i} cx={FELL.x} cy={FELL.y} r={20 + 300 * k} fill="none" stroke={CREAM} strokeWidth={3} opacity={0.6 * (1 - k)} clipPath="url(#cellarClip)" />;
          })}
          {/* the path he was carried along */}
          {pathT > 0 && <path d={partial(PATH, pathT)} fill="none" stroke={TEAL} strokeWidth={5} strokeDasharray="16 12" strokeLinecap="round" />}
          {mode === 'street' && pathT >= 0.999 && (
            <g opacity={1 - 0.6 * darken}>
              {/* the crowd: marks closing in (no figures) */}
              {Array.from({length: N}, (_, i) => {
                const a0 = (Math.PI * 2 * i) / N + random(`ca${i}`) * 0.3;
                const r0 = 520 + random(`cr${i}`) * 200, r1 = 110 + random(`cq${i}`) * 50;
                const k = interpolate(crowdK, [random(`cd${i}`) * 0.3, 0.7 + random(`ce${i}`) * 0.3], [0, 1], clamp);
                if (crowdK <= 0) return null;
                const r = r0 + (r1 - r0) * ease(k);
                const x = STREET.x + r * Math.cos(a0), y = STREET.y + r * Math.sin(a0) * 0.45;
                return <rect key={i} x={x - 7} y={y - 20} width={14} height={40} rx={5} fill="rgba(236,230,216,0.78)" opacity={Math.min(1, k * 3)} />;
              })}
              <circle cx={STREET.x} cy={STREET.y + 10} r={12} fill={CORAL} />
            </g>
          )}
        </svg>
        {/* labels, in drawing space */}
        <div style={{opacity: draw}}>
          {mode !== 'cellar' && <Label text="CHILTON'S STORE" x={750} y={240} at={c.a + 14} anchor="middle" />}
          <Label text="THE CELLAR" x={S.x0 + 24} y={G + 46} at={c.a + 18} />
          <Label text="THE STREET" x={mode === 'street' ? 1720 : 1400} y={G + 66} at={c.a + 20} anchor="middle" />
          {mode === 'shot' && <Label text="WINDOW" x={WIN.x + 26} y={WIN.y1 + 40} at={c.a + 22} size={18} />}
        </div>
        {mode === 'shot' && c.glasses !== undefined && <Label text="A CHRISTMAS DRINK" x={TABLE.x} y={TABLE.y - 70} at={c.glasses} anchor="middle" size={20} out={c.fired} />}
        {mode === 'shot' && c.fired !== undefined && <Label text="A SHOT, THROUGH THE WINDOW" x={WIN.x - 24} y={WIN.y0 - 44} at={c.fired + 6} color={CORAL} size={22} anchor="end" />}
        {mode === 'cellar' && <>
          {c.shot !== undefined && <Label text="SHOT IN THE CELLAR" x={FELL.x} y={FELL.y + 64} at={c.shot} anchor="middle" color={CORAL} />}
          {c.called !== undefined && <Label text="HE CALLED FOR HELP" x={S.x0 + 24} y={G + 100} at={c.called} />}
          {c.nobody !== undefined && <Label text="NOBODY CAME" x={S.x0 + 24} y={G + 150} at={c.nobody} />}
          {c.asked !== undefined && <Label text="HE ASKED TO BE CARRIED OUT" x={720} y={G - 40} at={c.asked + 10} anchor="middle" color={TEAL} />}
        </>}
        {mode === 'street' && <>
          {c.street !== undefined && <Label text="CARRIED INTO THE STREET" x={STREET.x} y={STREET.y - 150} at={c.street + 10} anchor="middle" color={TEAL} />}
          {c.crowd !== undefined && <Label text="A CROWD OF ARMED MEN" x={STREET.x} y={STREET.y + 170} at={c.crowd + 6} anchor="middle" />}
          {c.again !== undefined && <Label text="SHOT AGAIN, MANY TIMES" x={STREET.x} y={STREET.y + 225} at={c.again} anchor="middle" color={CORAL} />}
        </>}
      </AbsoluteFill>
      {/* the flash fills the frame for a few frames */}
      {flash > 0 && <AbsoluteFill style={{background: `rgba(255,244,228,${0.85 * flash})`}} />}
      {/* a soft vignette, heavier than the shell's, for night */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none'}} />
      <div style={{position: 'absolute', left: 110, top: 948, padding: '6px 14px', background: 'rgba(14,13,11,0.8)', fontFamily: JF.mono, fontSize: 22, letterSpacing: 4,
        color: 'rgba(236,230,216,0.8)', opacity: interpolate(f, [c.a + 6, c.a + 14], [0, 1], clamp)}}>CLINTON, MISSISSIPPI · DECEMBER 30, 1875</div>
      {children}
      {mode === 'shot' && <Sfx at={c.a + 2} src="sfx/tick_soft.wav" volume={0.25} />}
      <Tag text="Drawn from Margaret Ann Caldwell's testimony, Mississippi in 1875 (Senate report, 1876), pp. 437-438 (not to scale)" />
    </AbsoluteFill>
  );
};

/** A warm lamp from one side, flickering: laid over a page to put it in the room. */
export const Lamplight: React.FC<{x?: number; y?: number; strength?: number}> = ({x = 18, y = 30, strength = 1}) => {
  const f = useCurrentFrame();
  const k = (0.85 + 0.15 * random(`ll${Math.floor(f / 2)}`)) * strength;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at ${x}% ${y}%, rgba(${AMBER},${0.16 * k}) 0%, rgba(${AMBER},0) 55%)`, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0) 30%, rgba(0,0,0,${0.5 * strength}) 100%)`}} />
    </AbsoluteFill>
  );
};

/** An anonymous silhouette in lamplight: no face, no likeness (he has no known photograph). Rises in, then holds. */
export const LampFigure: React.FC<{at: number; x: number; y: number; h: number}> = ({at, x, y, h}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 24], [0, 1], clamp);
  const flick = 0.85 + 0.15 * random(`fg${Math.floor(f / 2)}`);
  const w = (h * 361) / 415;
  const src = staticFile('img/board/sil/front.png');
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y + 24 * (1 - ease(k)), width: w, height: h, opacity: k}}>
      {/* the lamp behind and to one side */}
      <div style={{position: 'absolute', left: -w * 0.55, top: -h * 0.25, width: w * 2.1, height: h * 1.5, borderRadius: '50%',
        background: `radial-gradient(closest-side, rgba(${AMBER},${0.3 * flick}), rgba(${AMBER},0))`}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(100deg, #2a2621 0%, #0d0c0b 55%)', filter: 'blur(0.6px)',
        WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%'}} />
      {/* a thin warm rim on the lamp side */}
      <div style={{position: 'absolute', inset: 0, transform: 'translateX(-3px)', background: `rgba(${AMBER},${0.35 * flick})`, mixBlendMode: 'screen',
        WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', clipPath: 'inset(0 70% 0 0)'}} />
    </div>
  );
};
