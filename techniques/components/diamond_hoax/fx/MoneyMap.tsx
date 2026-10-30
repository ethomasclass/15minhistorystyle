// The money map (ch 3 → ch 4): a period-style world map slab, tilted on the desk (three.js, drawn: teal coastlines and a
// faint graticule on a dark slab, a double border like an old chart). San Francisco → London (the stones bought under fake
// names: an orange dashed arc) → New York (Tiffany). The leather pouch, coral, travels the arcs.
// Coastlines: Natural Earth 1:50m land (public domain), Mercator, built by moneymap/build_coast.py into moneymap/coast.json.
//
// Props (frames in the parent's time; leave a beat out to skip it):
//   sfAt      the San Francisco pin drops, the pouch appears on it
//   londonAt  the arc to London draws on (~1.3 s) with the pouch riding it; London pin; Note "fake names" (if `notes`)
//   nyAt      the arc on to New York draws on with the pouch; New York pin; label TIFFANY & CO.
//   cam       camera keys (raw frames). Default (from the beats): close over the West at sfAt, pulling back to the whole
//             North Atlantic as the pouch crosses, settling toward New York
//   notes     the teal Note and mono labels (default true)
//
// Exports: MoneyMap, MoneyMapTest, MONEYMAP_TEST_FRAMES, mapPoint(lon, lat) → world point on the slab.
import React, {useMemo} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Finish, Note, PALETTES, PaletteCtx, StepCtx, Tag} from '../kit/Kit';
import {boxGeo, camAt, type CamKey, CORAL, Hull, Mono, ORANGE, Poly, projector, ramp, Shadow, shake, slap, Solid, Stage3D, step, TEAL, type V3, smooth} from './desk/kit3d';
import coast from './moneymap/coast.json';

const C = coast as {bbox: [number, number, number, number]; rings: number[][][]};
const [MX0, MY0, MX1, MY1] = C.bbox;
const S = 16 / (MX1 - MX0);
const CX = (MX0 + MX1) / 2, CY = (MY0 + MY1) / 2;
const SLAB_H = 0.3;
const TOP = SLAB_H + 0.002;
const merc = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
/** Map (lon, lat) → world point on top of the slab. */
export const mapPoint = (lon: number, lat: number, y = TOP): V3 => [(lon - CX) * S, y, -(merc(lat) - CY) * S];
const mx = (x: number) => (x - CX) * S;
const mz = (y: number) => -(y - CY) * S;
const MW = (MX1 - MX0) * S, MD = (MY1 - MY0) * S;

const CITIES = {
  sf: {name: 'SAN FRANCISCO', p: mapPoint(-122.42, 37.77)},
  london: {name: 'LONDON', p: mapPoint(-0.13, 51.51)},
  ny: {name: 'NEW YORK', p: mapPoint(-74.0, 40.71)},
};

const arc = (a: V3, b: V3, h: number, n = 60): V3[] => Array.from({length: n + 1}, (_, i) => {
  const t = i / n;
  return [a[0] + (b[0] - a[0]) * t, TOP + 0.02 + Math.sin(Math.PI * t) * h, a[2] + (b[2] - a[2]) * t] as V3;
});
const ARC1 = arc(CITIES.sf.p, CITIES.london.p, 1.6);
const ARC2 = arc(CITIES.london.p, CITIES.ny.p, 1.1);
const along = (pts: V3[], t: number): V3 => {
  const x = Math.max(0, Math.min(1, t)) * (pts.length - 1);
  const i = Math.min(pts.length - 2, Math.floor(x));
  const u = x - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u, pts[i][2] + (pts[i + 1][2] - pts[i][2]) * u];
};

const onBorder = (x: number, y: number) => Math.abs(x - MX0) < 0.02 || Math.abs(x - MX1) < 0.02 || Math.abs(y - MY0) < 0.02 || Math.abs(y - MY1) < 0.02;
/** Coastline segments (pairs), leaving out the edges the clip made along the map border. */
const COAST: V3[] = (() => {
  const out: V3[] = [];
  for (const r of C.rings) for (let i = 0; i < r.length - 1; i++) {
    const [ax, ay] = r[i], [bx, by] = r[i + 1];
    if (onBorder(ax, ay) && onBorder(bx, by)) continue;
    out.push([mx(ax), TOP + 0.004, mz(ay)], [mx(bx), TOP + 0.004, mz(by)]);
  }
  return out;
})();
const GRAT: V3[] = (() => {
  const out: V3[] = [];
  for (let lon = -130; lon <= 20; lon += 10) out.push([mx(lon), TOP + 0.002, mz(MY0)], [mx(lon), TOP + 0.002, mz(MY1)]);
  for (let lat = 20; lat <= 60; lat += 10) out.push([mx(MX0), TOP + 0.002, mz(merc(lat))], [mx(MX1), TOP + 0.002, mz(merc(lat))]);
  return out;
})();
const frame = (inset: number): V3[] => [[-MW / 2 + inset, TOP + 0.005, -MD / 2 + inset], [MW / 2 - inset, TOP + 0.005, -MD / 2 + inset], [MW / 2 - inset, TOP + 0.005, MD / 2 - inset],
  [-MW / 2 + inset, TOP + 0.005, MD / 2 - inset], [-MW / 2 + inset, TOP + 0.005, -MD / 2 + inset]];

const Land: React.FC = () => {
  const geo = useMemo(() => {
    const shapes = C.rings.map((r) => new THREE.Shape(r.map(([x, y]) => new THREE.Vector2(mx(x), -mz(y)))));
    return new THREE.ShapeGeometry(shapes);
  }, []);
  return (
    <mesh geometry={geo} position={[0, TOP + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color="#302b23" />
    </mesh>
  );
};

const Pin: React.FC<{p: V3; k: number}> = ({p, k}) => {
  if (k <= 0) return null;
  return (
    <group position={[p[0], p[1] + (1 - Math.min(1, k)) * 1.2, p[2]]}>
      <Hull geo={pinStem} pos={[0, 0.22, 0]} thick={0.5} />
      <Hull geo={pinHead} pos={[0, 0.47, 0]} thick={0.18} />
    </group>
  );
};
const pinStem = new THREE.CylinderGeometry(0.025, 0.012, 0.44, 8);
const pinHead = new THREE.SphereGeometry(0.085, 16, 12);

/** The pouch prop on screen: black and white with the coral tint (the video's recurring object). */
const Pouch: React.FC<{x: number; y: number; w: number; rot?: number; opacity?: number}> = ({x, y, w, rot = 0, opacity = 1}) => {
  const src = staticFile('img/props/leather_pouch.webp');
  const mask = {WebkitMaskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskImage: `url(${src})`, maskSize: '100% 100%'} as React.CSSProperties;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%, -100%) translateY(-46px) rotate(${rot}deg)`, opacity, filter: 'drop-shadow(0 14px 14px rgba(0,0,0,0.7))'}}>
      <div style={{position: 'relative'}}>
        <Img src={src} style={{width: '100%', display: 'block', filter: 'grayscale(1) contrast(1.15) brightness(0.95)'}} />
        <div style={{position: 'absolute', inset: 0, ...mask, background: CORAL, mixBlendMode: 'color'}} />
        <div style={{position: 'absolute', inset: 0, ...mask, background: CORAL, mixBlendMode: 'multiply', opacity: 0.25}} />
      </div>
    </div>
  );
};

const FLY1 = 40, FLY2 = 32;

export const moneyCam = (sfAt: number, londonAt: number, nyAt: number): CamKey[] => [
  {f: sfAt - 20, pos: [-6.0, 6.2, 6.6], look: [-6.4, 0.2, 0.3], fov: 30},
  {f: londonAt + FLY1, pos: [-0.6, 13.6, 12.7], look: [-0.6, 0.0, -0.25], fov: 30},
  {f: nyAt + FLY2 + 40, pos: [-0.7, 12.9, 11.9], look: [-0.7, 0.0, -0.25], fov: 30},
];

export type MoneyMapProps = {sfAt?: number; londonAt?: number; nyAt?: number; cam?: CamKey[]; notes?: boolean};

export const MoneyMap: React.FC<MoneyMapProps> = ({sfAt = 10, londonAt = 1e9, nyAt = 1e9, cam, notes = true}) => {
  const f = useCurrentFrame();
  const g = step(f);
  const c = camAt(cam ?? moneyCam(sfAt, Math.min(londonAt, sfAt + 200), Math.min(nyAt, sfAt + 400)), f);
  const P = projector(c);

  const d1 = ramp(g, londonAt, londonAt + FLY1);
  const d2 = ramp(g, nyAt, nyAt + FLY2);
  // where the pouch is
  let pouch: V3 | null = g >= sfAt ? [CITIES.sf.p[0], TOP, CITIES.sf.p[2]] : null;
  if (g >= londonAt) pouch = along(ARC1, smooth(Math.min(1, (g - londonAt) / FLY1)));
  if (g >= nyAt) pouch = along(ARC2, smooth(Math.min(1, (g - nyAt) / FLY2)));
  const pinK = (at: number) => slap(g, at, 7);
  const pins = {sf: pinK(sfAt), london: pinK(londonAt + FLY1 - 6), ny: pinK(nyAt + FLY2 - 6)};
  const hits = [sfAt + 5, londonAt + FLY1 - 1, nyAt + FLY2 - 1];

  const label = (key: keyof typeof CITIES, at: number, sub?: string) => {
    if (!notes || g < at) return null;
    const [x, y] = P([CITIES[key].p[0], TOP, CITIES[key].p[2]]);
    return (
      <React.Fragment key={key}>
        <Mono text={CITIES[key].name} x={x} y={y + 34} anchor="c" size={22} opacity={Math.min(1, (g - at) / 4)} />
        {sub && <Mono text={sub} x={x} y={y + 64} anchor="c" size={20} color={TEAL} opacity={Math.min(1, (g - at - 8) / 4)} />}
      </React.Fragment>
    );
  };
  const pp = pouch ? P(pouch) : null;
  const ground = pouch ? P([pouch[0], TOP, pouch[2]]) : null;
  const [lnx, lny] = P(CITIES.london.p);

  return (
    <Stage3D cam={c} grid={0.06} shakeXY={shake(f, hits, 4)} lamp={[900, 480]} fog={[12, 34]}
      over={<>
        {label('sf', sfAt + 4)}
        {label('london', londonAt + FLY1 - 4)}
        {label('ny', nyAt + FLY2 - 4, 'TIFFANY & CO.')}
        {notes && <Note text="fake names" x={Math.max(140, lnx - 420)} y={lny + 70} size={58} rot={-5} at={londonAt + FLY1 + 10} />}
        {pp && ground && <Pouch x={pp[0]} y={pp[1]} w={120} rot={Math.sin(g * 0.3) * 4} />}
        <Tag text="Map drawn for the series · Natural Earth coastlines · Mercator" x={110} y={1000} />
      </>}>
      {/* the slab */}
      <Shadow pos={[0, 0, 0]} size={[MW + 3, MD + 3]} opacity={0.7} />
      <group position={[0, SLAB_H / 2, 0]}><Solid geo={boxGeo(MW, SLAB_H, MD)} face="#151412" width={2.6} /></group>
      <Land />
      <Poly pts={GRAT} segments color={TEAL} width={1.1} opacity={0.18} />
      <Poly pts={COAST} segments color={TEAL} width={2} />
      <Poly pts={frame(0.18)} color={TEAL} width={1.6} opacity={0.7} />
      <Poly pts={frame(0.28)} color={TEAL} width={1} opacity={0.45} />
      {/* routes: orange dashed arcs */}
      <Poly pts={ARC1} color={ORANGE} width={3} dashed dash={[0.22, 0.14]} draw={d1} />
      <Poly pts={ARC2} color={ORANGE} width={3} dashed dash={[0.22, 0.14]} draw={d2} />
      {pouch && <Shadow pos={[pouch[0], TOP, pouch[2]]} size={[0.7, 0.5]} opacity={0.6 * Math.max(0.25, 1 - (pouch[1] - TOP) / 2.5)} />}
      <Pin p={CITIES.sf.p} k={pins.sf} />
      <Pin p={CITIES.london.p} k={pins.london} />
      <Pin p={CITIES.ny.p} k={pins.ny} />
    </Stage3D>
  );
};

// ---------------------------------------------------------------- test composition
export const MONEYMAP_TEST_FRAMES = 300;
export const MoneyMapTest: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <AbsoluteFill style={{background: '#0d0c09'}}>
        <MoneyMap sfAt={20} londonAt={70} nyAt={185} />
        <Finish vignette={0.3} />
      </AbsoluteFill>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
