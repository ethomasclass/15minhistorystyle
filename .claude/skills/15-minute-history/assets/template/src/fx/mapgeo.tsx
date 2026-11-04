// Map helpers for drawn 3D map slabs (The Balloon War v2: PacificWinds, LandingMap): coastline rings (Natural Earth 1:50m, baked
// with tools/geo_bake.py coast, lon in 0..360 so a Pacific map stays in one piece) -> teal line segments and a dark land fill on
// the slab top; graticules, great circles and a rectangle clip. `P` is your projection (lon, lat) -> world (x, z).
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Segs, TEAL} from './kit3d';

export type Proj = (lon: number, lat: number) => [number, number]; // -> world (x, z)
export type BBox = [number, number, number, number]; // lon0, lat0, lon1, lat1 (the clip box the baker used)

const onEdge = (p: number[], b: BBox) => Math.abs(p[0] - b[0]) < 0.01 || Math.abs(p[0] - b[2]) < 0.01 || Math.abs(p[1] - b[1]) < 0.01 || Math.abs(p[1] - b[3]) < 0.01;

/** Segment pairs for the coastline at height y, leaving out the edges the clip made along the box. */
export const coastSegs = (rings: number[][][], P: Proj, b: BBox, y: number): Float32Array => {
  const out: number[] = [];
  for (const r of rings) {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], c = r[(i + 1) % r.length];
      if (onEdge(a, b) && onEdge(c, b)) continue;
      const [ax, az] = P(a[0], a[1]), [cx, cz] = P(c[0], c[1]);
      out.push(ax, y, az, cx, y, cz);
    }
  }
  return new Float32Array(out);
};

/** Graticule lines every `step` degrees inside the box (each line sampled so curved projections stay curved). */
export const graticule = (P: Proj, b: BBox, step: number, y: number): Float32Array => {
  const out: number[] = [];
  const seg = (pts: [number, number][]) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = P(...pts[i]), [cx, cz] = P(...pts[i + 1]);
      out.push(ax, y, az, cx, y, cz);
    }
  };
  for (let lon = Math.ceil(b[0] / step) * step; lon <= b[2]; lon += step) seg(Array.from({length: 21}, (_, i) => [lon, b[1] + ((b[3] - b[1]) * i) / 20] as [number, number]));
  for (let lat = Math.ceil(b[1] / step) * step; lat <= b[3]; lat += step) seg(Array.from({length: 41}, (_, i) => [b[0] + ((b[2] - b[0]) * i) / 40, lat] as [number, number]));
  return new Float32Array(out);
};

/** Dark land fill (flat, at height y). */
export const LandFill: React.FC<{rings: number[][][]; P: Proj; y: number; color?: string; opacity?: number}> = ({rings, P, y, color = '#29251e', opacity = 1}) => {
  const geo = useMemo(() => {
    const shapes = rings.map((r) => new THREE.Shape(r.map(([lon, lat]) => {
      const [x, z] = P(lon, lat);
      return new THREE.Vector2(x, -z);
    })));
    return new THREE.ShapeGeometry(shapes);
  }, [rings, P]);
  return (
    <mesh geometry={geo} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color={color} transparent={opacity < 1} opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
};

/** Coastline + land fill + faint graticule, with a draw-on `k` (0..1) for the lines. */
export const MapTop: React.FC<{rings: number[][][]; P: Proj; b: BBox; y?: number; k?: number; grat?: number; coastW?: number}> = ({rings, P, b, y = 0.002, k = 1, grat = 10, coastW = 1.8}) => {
  const coast = useMemo(() => coastSegs(rings, P, b, y + 0.004), [rings, P, b, y]);
  const g = useMemo(() => (grat > 0 ? graticule(P, b, grat, y + 0.002) : new Float32Array(0)), [P, b, grat, y]);
  return (
    <group>
      <LandFill rings={rings} P={P} y={y} opacity={k} />
      {g.length > 0 && <Segs pos={g} color={TEAL} width={1} opacity={0.13 * k} />}
      <Segs pos={coast} color={TEAL} width={coastW} opacity={0.95 * k} />
    </group>
  );
};

/** Great-circle points between two (lon, lat) points (degrees, lon may be 0..360). */
export const greatCircle = (a: [number, number], b: [number, number], n = 64): [number, number][] => {
  const r = Math.PI / 180;
  const v = ([lon, lat]: [number, number]) => [Math.cos(lat * r) * Math.cos(lon * r), Math.cos(lat * r) * Math.sin(lon * r), Math.sin(lat * r)];
  const A = v(a), B = v(b);
  const d = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
  return Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    const s1 = Math.sin((1 - t) * d) / Math.sin(d), s2 = Math.sin(t * d) / Math.sin(d);
    const x = s1 * A[0] + s2 * B[0], y = s1 * A[1] + s2 * B[1], z = s1 * A[2] + s2 * B[2];
    let lon = Math.atan2(y, x) / r;
    if (lon < 0) lon += 360;
    return [lon, Math.asin(z) / r] as [number, number];
  });
};
export const gcKm = (a: [number, number], b: [number, number]) => {
  const r = Math.PI / 180;
  const h = Math.sin(((b[1] - a[1]) * r) / 2) ** 2 + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(((b[0] - a[0]) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

/** Clip a polygon (world x, z) to a rectangle [x0, z0, x1, z1] (Sutherland-Hodgman). */
export const clipRect = (ring: number[][], r: BBox): number[][] => {
  let pts = ring;
  const edges: [(p: number[]) => boolean, (a: number[], b: number[]) => number[]][] = [
    [(p) => p[0] >= r[0], (a, b) => [r[0], a[1] + ((b[1] - a[1]) * (r[0] - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= r[2], (a, b) => [r[2], a[1] + ((b[1] - a[1]) * (r[2] - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= r[1], (a, b) => [a[0] + ((b[0] - a[0]) * (r[1] - a[1])) / (b[1] - a[1]), r[1]]],
    [(p) => p[1] <= r[3], (a, b) => [a[0] + ((b[0] - a[0]) * (r[3] - a[1])) / (b[1] - a[1]), r[3]]],
  ];
  for (const [inside, inter] of edges) {
    if (!pts.length) break;
    const out: number[][] = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i + pts.length - 1) % pts.length], b = pts[i];
      const ia = inside(a), ib = inside(b);
      if (ib) {
        if (!ia) out.push(inter(a, b));
        out.push(b);
      } else if (ia) out.push(inter(a, b));
    }
    pts = out;
  }
  return pts;
};
