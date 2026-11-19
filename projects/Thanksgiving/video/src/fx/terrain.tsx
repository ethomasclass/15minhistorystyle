// Real-elevation terrain slab (from The Balloon War v2, adapted from projects/Diamond_Hoax/src/fx/terrain/): a heightmap baked from
// the AWS Terrarium tiles (tools/geo_bake.py heightmap -> public/data/<name>_hm.json; --sea clamps the sea to 0 m) becomes a
// world-space surface: x east, z south, y up; `size` world units wide; heights true-to-plan times `exag` (say "heights exaggerated"
// on screen). Drawn: near-black land, a darker flat sea, teal contours (index contours heavier; with seaLevel the 0 m contour is
// the coastline), dark sides, a teal rim and a contact shadow. Built once per (size, exag, interval) so every frame and worker agrees.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ContactShadow, Poly, Segs, TEAL} from './kit3d';

export type HM = {name: string; bounds: {lat0: number; lat1: number; lon0: number; lon1: number}; w: number; h: number; kmW: number; kmH: number; min: number; max: number; data: number[]};

export type Terrain = {
  hm: HM; size: number; depth: number; exag: number; unitsPerM: number; ys: Float32Array;
  toWorld: (lat: number, lon: number) => [number, number];
  heightAt: (x: number, z: number) => number;
  contours: {m: number; index: boolean; pos: Float32Array}[];
  rim: number[][];
};

const CACHE = new Map<string, Terrain>();
export const BASE = -0.3;

/** `seaLevel`: true when the heightmap's 0 m is the sea (a coast, baked with --sea): the first contour then traces the coastline. */
export const buildTerrain = (hm: HM, size: number, exag: number, interval: number, indexEvery: number, lift = 0.004, seaLevel = true): Terrain => {
  const key = `${hm.name}|${size}|${exag}|${interval}|${indexEvery}|${lift}`;
  const hit = CACHE.get(key);
  if (hit) return hit;
  const lo = seaLevel ? 0 : hm.min;
  const {w, h, data, bounds} = hm;
  const depth = (size * hm.kmH) / hm.kmW;
  const unitsPerM = size / (hm.kmW * 1000);
  const ys = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) ys[i] = Math.max(0, data[i] - lo) * unitsPerM * exag;
  const gx = (i: number) => (i / (w - 1) - 0.5) * size;
  const gz = (j: number) => (j / (h - 1) - 0.5) * depth;
  const heightAt = (x: number, z: number) => {
    const fi = Math.max(0, Math.min(w - 1.0001, (x / size + 0.5) * (w - 1)));
    const fj = Math.max(0, Math.min(h - 1.0001, (z / depth + 0.5) * (h - 1)));
    const i = Math.floor(fi), j = Math.floor(fj), a = fi - i, b = fj - j;
    const v = (ii: number, jj: number) => ys[jj * w + ii];
    return v(i, j) * (1 - a) * (1 - b) + v(i + 1, j) * a * (1 - b) + v(i, j + 1) * (1 - a) * b + v(i + 1, j + 1) * a * b;
  };
  const toWorld = (lat: number, lon: number): [number, number] => [
    ((lon - bounds.lon0) / (bounds.lon1 - bounds.lon0) - 0.5) * size,
    ((bounds.lat1 - lat) / (bounds.lat1 - bounds.lat0) - 0.5) * depth,
  ];
  const contours: Terrain['contours'] = [];
  const m0 = seaLevel ? 0 : Math.ceil(hm.min / interval) * interval;
  for (let m = m0; m < hm.max; m += interval) {
    const t = seaLevel && m === 0 ? 0.5 * unitsPerM * exag : (m - lo) * unitsPerM * exag; // 0 m: between sea and the first land
    const out: number[] = [];
    const y = t + lift;
    for (let j = 0; j < h - 1; j++) {
      for (let i = 0; i < w - 1; i++) {
        const a = ys[j * w + i], b = ys[j * w + i + 1], c = ys[(j + 1) * w + i + 1], d = ys[(j + 1) * w + i];
        const code = (a > t ? 8 : 0) | (b > t ? 4 : 0) | (c > t ? 2 : 0) | (d > t ? 1 : 0);
        if (code === 0 || code === 15) continue;
        const x0 = gx(i), x1 = gx(i + 1), z0 = gz(j), z1 = gz(j + 1);
        const top = (): number[] => [x0 + ((t - a) / (b - a)) * (x1 - x0), y, z0];
        const right = (): number[] => [x1, y, z0 + ((t - b) / (c - b)) * (z1 - z0)];
        const bottom = (): number[] => [x0 + ((t - d) / (c - d)) * (x1 - x0), y, z1];
        const left = (): number[] => [x0, y, z0 + ((t - a) / (d - a)) * (z1 - z0)];
        const seg = (p: number[], q: number[]) => out.push(...p, ...q);
        switch (code) {
          case 1: case 14: seg(left(), bottom()); break;
          case 2: case 13: seg(bottom(), right()); break;
          case 3: case 12: seg(left(), right()); break;
          case 4: case 11: seg(top(), right()); break;
          case 6: case 9: seg(top(), bottom()); break;
          case 7: case 8: seg(left(), top()); break;
          case 5: seg(left(), top()); seg(bottom(), right()); break;
          case 10: seg(top(), right()); seg(left(), bottom()); break;
        }
      }
    }
    contours.push({m, index: (seaLevel && m === 0) || Math.round(m / interval) % indexEvery === 0, pos: new Float32Array(out)});
  }
  const rim: number[][] = [];
  for (let i = 0; i < w; i++) rim.push([gx(i), ys[i], gz(0)]);
  for (let j = 1; j < h; j++) rim.push([gx(w - 1), ys[j * w + w - 1], gz(j)]);
  for (let i = w - 2; i >= 0; i--) rim.push([gx(i), ys[(h - 1) * w + i], gz(h - 1)]);
  for (let j = h - 2; j >= 0; j--) rim.push([gx(0), ys[j * w], gz(j)]);
  const T: Terrain = {hm, size, depth, exag, unitsPerM, ys, toWorld, heightAt, contours, rim};
  CACHE.set(key, T);
  return T;
};

const surfaceGeo = (T: Terrain, landCol: string) => {
  const {w, h} = T.hm;
  const g = new THREE.PlaneGeometry(T.size, T.depth, w - 1, h - 1);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(p.count * 3);
  const land = new THREE.Color(landCol), sea = new THREE.Color('#0b1113');
  for (let k = 0; k < p.count; k++) {
    p.setY(k, T.ys[k]);
    const c = T.ys[k] > 0 ? land : sea;
    col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
};
const skirtGeo = (T: Terrain) => {
  const pos: number[] = [];
  const r = T.rim;
  for (let k = 0; k < r.length; k++) {
    const a = r[k], b = r[(k + 1) % r.length];
    pos.push(a[0], a[1], a[2], b[0], BASE, b[2], b[0], b[1], b[2]);
    pos.push(a[0], a[1], a[2], a[0], BASE, a[2], b[0], BASE, b[2]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
};

/** The slab. `reveal` 0..1 draws the contours on from the coast up; `lines` scales all line opacity. */
export const TerrainSlab: React.FC<{T: Terrain; reveal?: number; lines?: number; contourW?: number; indexW?: number; color?: string; land?: string}> = ({
  T, reveal = 1, lines = 1, contourW = 1.2, indexW = 2.2, color = TEAL, land = '#17201b',
}) => {
  const surf = useMemo(() => surfaceGeo(T, land), [T, land]);
  const skirt = useMemo(() => skirtGeo(T), [T]);
  const sx = T.size / 2, sz = T.depth / 2;
  const base = useMemo(() => [[-sx, BASE, -sz], [sx, BASE, -sz], [sx, BASE, sz], [-sx, BASE, sz], [-sx, BASE, -sz]], [sx, sz]);
  const corners = useMemo(() => {
    const out: number[] = [];
    for (const [x, z] of [[-sx, -sz], [sx, -sz], [sx, sz], [-sx, sz]]) out.push(x, BASE, z, x, T.heightAt(x * 0.9999, z * 0.9999), z);
    return new Float32Array(out);
  }, [T, sx, sz]);
  const n = T.contours.length;
  return (
    <group>
      <ContactShadow y={BASE - 0.01} w={T.size * 1.5} d={T.depth * 1.6} opacity={0.85} z={0.25} />
      <mesh geometry={surf}>
        <meshLambertMaterial vertexColors polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
      </mesh>
      <mesh geometry={skirt}>
        <meshLambertMaterial color="#0b0f0d" side={THREE.DoubleSide} />
      </mesh>
      {T.contours.map((c, i) => {
        const k = Math.max(0, Math.min(1, reveal * (n + 4) - i));
        if (k <= 0) return null;
        return <Segs key={i} pos={c.pos} color={color} width={c.m === 0 ? 2.4 : c.index ? indexW : contourW} opacity={(c.m === 0 ? 1 : c.index ? 0.85 : 0.45) * k * lines} />;
      })}
      <Poly pts={T.rim} color={color} width={2.2} opacity={0.85 * lines} />
      <Poly pts={base} color={color} width={1.5} opacity={0.4 * lines} />
      <Segs pos={corners} color={color} width={1.5} opacity={0.5 * lines} />
    </group>
  );
};
