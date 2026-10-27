// Chapter 3, "Coffin Ships and Pumpkins": the tilted North Atlantic (src/kit/map3d.tsx, data from
// tools/build_map_atlantic.py → public/img/maps/atlantic.json). The camera starts over Ireland, pulls back and tilts while
// the famine-ship routes draw as dashed coral lines (Cork, Liverpool, Dublin → Boston, New York, Quebec) with small
// ships sailing them; a counter ticks to 1,000,000+. Then the lighter beat: a turnip lantern on Ireland arcs across the
// ocean and lands in America as a (drawn, coral) pumpkin.
//
// `AtlanticCrossing` takes `at(key)` → frame (in the scene's own time, frame 0 = the scene's first frame) for
//   'routes'  routes start drawing (the camera pulls back from Ireland over the ~4 s around it)
//   'counter' the 1,000,000+ counter starts ticking
//   'turnip'  the turnip lantern appears on Ireland
//   'pumpkin' the frame it LANDS in America as a pumpkin (the flight takes ~1.2 s before it, or starts 15 frames after
//             'turnip', whichever is later). Tie it to the word "pumpkins".
// Missing keys fall back to DEFAULT_AT. Keep the famine part clean: the turnip only appears from 'turnip'.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import data from '../../public/img/maps/atlantic.json';
import {clamp} from '../lib/anim';
import {Finish, Highlight, JF, Note, PALETTES, PaletteCtx, StepCtx, Tag, useGFrame} from '../kit/Kit';
import {Border, type Api, type Cam3, Count, Dot, Map3D, type MapData, PathText, PlaceTag, Stand} from '../kit/map3d';

const D = data as unknown as MapData;
const PL = D.places;
const CORAL = '#FF6F61';
const TEAL = '#2FE0C4';
const CREAM = '#f4efe6';

export type AtlanticKey = 'routes' | 'counter' | 'turnip' | 'pumpkin';
export const DEFAULT_AT: Record<AtlanticKey, number> = {routes: 75, counter: 200, turnip: 390, pumpkin: 462};

/** Routes in drawing order, with where they leave from and arrive. */
const ROUTES: {key: string; from: string; to: string; delay: number}[] = [
  {key: 'corkBoston', from: 'cork', to: 'boston', delay: 0},
  {key: 'corkNewYork', from: 'cork', to: 'newYork', delay: 8},
  {key: 'liverpoolNewYork', from: 'liverpool', to: 'newYork', delay: 16},
  {key: 'dublinQuebec', from: 'dublin', to: 'quebec', delay: 24},
];
const DRAW = 66; // frames for a route to draw across the ocean

/** Point at fraction t (0..1) along a polyline, by length. */
const along = (pts: number[][], t: number): [number, number] => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const f = seg[i] ? Math.min(1, d / seg[i]) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
    }
    d -= seg[i];
  }
  return [pts[0][0], pts[0][1]];
};

/** Anything standing up at map point `p`, lifted `z` px, facing the camera (no fade: for moving markers). */
const Up: React.FC<{api: Api; p: number[]; z?: number; children: React.ReactNode}> = ({api, p, z = 0, children}) => {
  const [x, y] = api.P(p[0], p[1]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transformStyle: 'preserve-3d',
      transform: `translateZ(${z}px) rotateZ(${-api.cam.rot}deg) rotateX(${-api.cam.tilt}deg)`, transformOrigin: '0 0'}}>
      <div style={{position: 'absolute', left: 0, bottom: 0, transform: 'translateX(-50%)'}}>{children}</div>
    </div>
  );
};

/** A small sailing ship (cream sails, ink hull), heading west. */
const Ship: React.FC<{w?: number; o?: number}> = ({w = 40, o = 1}) => (
  <svg width={w} height={w * 0.9} viewBox="0 0 44 40" style={{display: 'block', opacity: o, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.7))'}}>
    <path d="M3,27 L41,27 L35,36 L9,36 Z" fill="#1b1915" stroke={CREAM} strokeWidth={1.6} strokeLinejoin="round" />
    <line x1={22} y1={3} x2={22} y2={27} stroke={CREAM} strokeWidth={2} />
    <path d="M20.5,5 L8,24 L20.5,24 Z" fill={CREAM} />
    <path d="M23.5,8 L33,24 L23.5,24 Z" fill={CREAM} opacity={0.85} />
    <path d="M22,3 L14,6 L22,8 Z" fill={CORAL} />
  </svg>
);

/** A simple drawn jack-o'-lantern in coral (the American side of the turnip → pumpkin beat). */
export const Pumpkin: React.FC<{w?: number}> = ({w = 170}) => (
  <svg width={w} height={w * 0.92} viewBox="0 0 200 184" style={{display: 'block', overflow: 'visible', filter: 'drop-shadow(0 14px 16px rgba(0,0,0,0.65))'}}>
    {/* stem */}
    <path d="M94,40 C92,24 96,12 108,6 L114,12 C106,18 104,28 106,42 Z" fill="#3a2f25" stroke="#111" strokeWidth={3} strokeLinejoin="round" />
    {/* lobes, back to front */}
    <ellipse cx={52} cy={110} rx={46} ry={62} fill="#c9493e" stroke="#111" strokeWidth={4} />
    <ellipse cx={148} cy={110} rx={46} ry={62} fill="#c9493e" stroke="#111" strokeWidth={4} />
    <ellipse cx={74} cy={108} rx={42} ry={68} fill="#e85d50" stroke="#111" strokeWidth={4} />
    <ellipse cx={126} cy={108} rx={42} ry={68} fill="#e85d50" stroke="#111" strokeWidth={4} />
    <ellipse cx={100} cy={106} rx={38} ry={71} fill={CORAL} stroke="#111" strokeWidth={4} />
    {/* highlight */}
    <path d="M86,56 C80,72 80,92 84,104" fill="none" stroke="#ffb3a8" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
    {/* carved face, lit from inside */}
    <g fill="#ffe2c4" stroke="#111" strokeWidth={3.5} strokeLinejoin="round">
      <path d="M50,92 L76,80 L72,106 Z" />
      <path d="M150,92 L124,80 L128,106 Z" />
      <path d="M100,104 L90,122 L110,122 Z" />
      <path d="M44,134 Q100,176 156,134 L144,138 L136,130 L126,142 L114,134 L100,146 L86,134 L74,142 L64,130 L56,138 Z" />
    </g>
  </svg>
);

/** The turnip lantern cut-out, black and white like every prop. */
const Turnip: React.FC<{w?: number}> = ({w = 120}) => (
  <Img src={staticFile('img/props/turnip_lantern.webp')}
    style={{width: w, display: 'block', filter: 'grayscale(1) contrast(1.15) brightness(0.95) drop-shadow(0 12px 14px rgba(0,0,0,0.7))'}} />
);

/** Teal ripple rings on the map (the landing). */
const Ripple: React.FC<{api: Api; p: number[]; at: number}> = ({api, p, at}) => {
  const g = useGFrame();
  if (g < at || g > at + 26) return null;
  const [x, y] = api.P(p[0], p[1]);
  return (
    <>
      {[0, 6, 12].map((d) => {
        const k = interpolate(g, [at + d, at + d + 14], [0, 1], clamp);
        if (g < at + d || k >= 1) return null;
        const r = 20 + 130 * k;
        return <div key={d} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%',
          border: `${10 - 6 * k}px solid ${TEAL}`, opacity: 1 - k, transform: 'translateZ(2px)'}} />;
      })}
    </>
  );
};

const lift = (p: number[], dx = 0, dy = 0): [number, number] => [p[0] + dx, p[1] + dy];

export const AtlanticCrossing: React.FC<{at?: (key: string) => number}> = ({at: atIn}) => {
  const g = useGFrame();
  const at = (k: AtlanticKey) => {
    const v = atIn?.(k);
    return typeof v === 'number' && Number.isFinite(v) ? v : DEFAULT_AT[k];
  };
  const R = at('routes');
  const C = at('counter');
  const T = at('turnip');
  const P = at('pumpkin');
  const FLY = 36;
  const fly0 = Math.max(T + 15, P - FLY);
  const land = Math.max(fly0 + 12, P);

  // camera: close over Ireland → pull back and tilt over the whole ocean → a slow drift
  const keys: Cam3[] = [
    {f: 0, x: 4560, y: 880, z: 1.15, tilt: 26, rot: 0},
    {f: Math.max(1, R - 22), x: 4520, y: 900, z: 1.0, tilt: 30, rot: 1},
    {f: R + 110, x: 2500, y: 860, z: 0.35, tilt: 46, rot: 9},
    {f: Math.max(R + 111, T - 10), x: 2480, y: 865, z: 0.36, tilt: 47, rot: 10},
    {f: Math.max(R + 112, land + 90), x: 2440, y: 880, z: 0.375, tilt: 48, rot: 10.5},
  ];

  const turnipHome = lift(PL.ireland, 10, 50);
  const pumpkinHome: [number, number] = [1130, 1400]; // Maine / New Brunswick, between Quebec and Boston
  const ocean = [PL.atlantic[0] - 360, PL.atlantic[1] + 40];

  return (
    <AbsoluteFill>
      <Map3D data={D} keys={keys} rivers={0}>
        {(api) => {
          const fp = interpolate(g, [fly0, land], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
          const fpos: [number, number] = [turnipHome[0] + (pumpkinHome[0] - turnipHome[0]) * fp, turnipHome[1] + (pumpkinHome[1] - turnipHome[1]) * fp];
          const fz = 300 * Math.sin(Math.PI * fp) + 4;
          return (
            <>
              {/* the US–Canada line, faint */}
              <Border api={api} d={D.lines.border} at={-99} dur={1} color="rgba(42,39,35,0.55)" width={2} dashed ticks={false} z={1} />
              <PathText api={api} d={`M${ocean[0] - 900},${ocean[1]} L${ocean[0] + 900},${ocean[1]}`} text="ATLANTIC OCEAN" at={R + 84} size={40}
                color="rgba(244,239,230,0.75)" dy={0} />

              {/* routes and their ports */}
              {ROUTES.map((r) => (
                <Border key={r.key} api={api} d={D.lines[r.key]} at={R + r.delay} dur={DRAW} color={CORAL} width={5} dashed ticks={false} z={3} />
              ))}
              {['cork', 'dublin', 'liverpool'].map((k, i) => <Dot key={k} api={api} at={PL[k]} show={14 + i * 4} r={10} color={TEAL} />)}
              {['boston', 'newYork', 'quebec'].map((k) => {
                const arrive = Math.min(...ROUTES.filter((r) => r.to === k).map((r) => R + r.delay + DRAW - 6));
                return <Dot key={k} api={api} at={PL[k]} show={arrive} r={10} color={TEAL} />;
              })}

              {/* ships sailing the routes once they are drawn (until the turnip beat) */}
              {g < T + 6 && ROUTES.flatMap((r, ri) => [0, 1, 2].map((s) => {
                const start = R + r.delay + 10 + s * 30;
                if (g < start) return null;
                const period = 150;
                const u = ((g - start) % period) / period;
                // the first trip may not overtake the line being drawn
                const head = interpolate(g, [R + r.delay, R + r.delay + DRAW], [0, 1], clamp);
                const t = Math.min(u, head);
                const o = Math.min(1, u * 12, (1 - u) * 12) * interpolate(g, [T, T + 6], [1, 0], clamp);
                return <Up key={`${ri}-${s}`} api={api} p={along(D.polylines[r.key], t)} z={2}><Ship o={o} w={g < R + 60 ? 46 : 38} /></Up>;
              }))}

              {/* labels: mono caps tabs standing on the map */}
              <Stand api={api} at={lift(PL.ireland, -60, -40)} z={60} show={6} out={T - 6}><PlaceTag text="IRELAND" size={34} /></Stand>
              <Stand api={api} at={lift(PL.cork, -40, 0)} z={14} show={18} out={R + 22}><PlaceTag text="CORK" size={24} /></Stand>
              <Stand api={api} at={lift(PL.dublin, 50, -10)} z={14} show={22} out={R + 22}><PlaceTag text="DUBLIN" size={24} /></Stand>
              <Stand api={api} at={lift(PL.liverpool, 60, -10)} z={14} show={26} out={R + 22}><PlaceTag text="LIVERPOOL" size={24} /></Stand>
              <Stand api={api} at={lift(PL.boston, 340, 40)} z={12} show={R + DRAW - 4}><PlaceTag text="BOSTON" size={28} color={CREAM} /></Stand>
              <Stand api={api} at={lift(PL.newYork, 230, 250)} z={0} show={R + 106}><PlaceTag text="NEW YORK" size={28} /></Stand>
              <Stand api={api} at={lift(PL.quebec, -120, -40)} z={12} show={R + 24 + DRAW - 4} out={land - 6}><PlaceTag text="QUEBEC" size={28} /></Stand>

              {/* the turnip → pumpkin beat */}
              <Stand api={api} at={turnipHome} z={0} show={T} out={fly0 - 1}><Turnip w={150} /></Stand>
              {g >= fly0 && g < land && (
                <>
                  {/* its shadow on the sea, smaller and fainter the higher it flies */}
                  <div style={{position: 'absolute', left: api.P(fpos[0], fpos[1])[0] - 60, top: api.P(fpos[0], fpos[1])[1] - 24, width: 120, height: 48, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.55)', filter: 'blur(10px)', opacity: 1 - 0.6 * Math.sin(Math.PI * fp), transform: 'translateZ(1px)'}} />
                  <Up api={api} p={fpos} z={fz}>
                    <div style={{transform: `rotate(${-28 * Math.sin(Math.PI * fp * 2)}deg) scale(${1 - 0.15 * fp})`}}><Turnip w={150} /></div>
                  </Up>
                </>
              )}
              <Ripple api={api} p={pumpkinHome} at={land} />
              {g >= land && (
                <Up api={api} p={pumpkinHome} z={0}>
                  <div style={{transformOrigin: '50% 100%', transform: `scale(${interpolate(g, [land, land + 3, land + 6], [0.2, 1.3, 1], clamp)})`}}><Pumpkin w={170} /></div>
                </Up>
              )}
            </>
          );
        }}
      </Map3D>

      {/* screen-space titles */}
      <Highlight text="COFFIN SHIPS" x={110} y={102} size={84} at={8} rot={-2} />
      {g >= 16 && (
        <div style={{position: 'absolute', left: 124, top: 220, fontFamily: JF.mono, fontSize: 30, letterSpacing: 4, color: CREAM, textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          opacity: interpolate(g, [16, 22], [0, 1], clamp)}}>1845–1855</div>
      )}

      {/* the counter, top right */}
      <div style={{position: 'absolute', right: 110, top: 96, textAlign: 'right'}}>
        <Count to={1000000} at={C} dur={54} size={100} color={CORAL}
          fmt={(n) => (n >= 999999.5 ? '1,000,000+' : (Math.round(n / 1000) * 1000).toLocaleString('en-US'))} />
      </div>
      <Note text="crossed to america" x={1340} y={214} size={44} rot={-3} at={C + 30} dur={12} color="#ffffff" />

      <Note text="the turnip lantern..." x={1240} y={420} size={44} rot={-3} at={T + 4} dur={12} out={land + 40} />
      <Note text="...becomes a pumpkin" x={240} y={300} size={48} rot={-3} at={land + 6} dur={12} color={CORAL} />

      <Tag text={`Map drawn from Natural Earth data · routes simplified${g >= T ? ' · turnip lantern: illustration' : ''}`} />
    </AbsoluteFill>
  );
};

/** Standalone test: the scene with its default beats, 20 s. */
export const AtlanticMap_TEST_FRAMES = 600;
export const AtlanticMapTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#15130f'}}>
        <AtlanticCrossing />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
