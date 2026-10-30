// Real elevation baked from the AWS Terrarium tiles (public/img/fx/mesa/bake_heightmap.py) into a world-space terrain:
// x east, z south (north is -z), y up; the map is `size` world units wide; heights scaled true-to-plan times `exag`.
// Built once per (name, size, exag, interval) at module load / first use, so every frame and render worker agrees.
import mesaHM from '../../../public/img/fx/mesa/mesa.json';
import regionHM from '../../../public/img/fx/mesa/region.json';

export type HM = {name: string; bounds: {lat0: number; lat1: number; lon0: number; lon1: number}; w: number; h: number; kmW: number; kmH: number; min: number; max: number; data: number[]};
export const HEIGHTMAPS: Record<'mesa' | 'region', HM> = {mesa: mesaHM as HM, region: regionHM as HM};

export type Terrain = {
  hm: HM; size: number; depth: number; exag: number; unitsPerM: number;
  /** grid heights in world y (0 = lowest point) */
  ys: Float32Array;
  toWorld: (lat: number, lon: number) => [number, number];
  heightAt: (x: number, z: number) => number;
  /** contour segments per level index: {m: metres, index: is an index contour, pos: segment pairs} */
  contours: {m: number; index: boolean; pos: Float32Array}[];
  /** boundary rim polyline (top edge of the slab), clockwise from NW */
  rim: number[][];
};

const CACHE = new Map<string, Terrain>();

export const buildTerrain = (name: 'mesa' | 'region', size: number, exag: number, interval: number, indexEvery: number, lift = 0.004): Terrain => {
  const key = `${name}|${size}|${exag}|${interval}|${indexEvery}|${lift}`;
  const hit = CACHE.get(key);
  if (hit) return hit;
  const hm = HEIGHTMAPS[name];
  const {w, h, data, min, bounds} = hm;
  const depth = (size * hm.kmH) / hm.kmW;
  const unitsPerM = size / (hm.kmW * 1000);
  const ys = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) ys[i] = (data[i] - min) * unitsPerM * exag;
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

  // marching squares, one level at a time
  const contours: Terrain['contours'] = [];
  const lo = Math.ceil(hm.min / interval) * interval;
  let level = 0;
  for (let m = lo; m < hm.max; m += interval, level++) {
    const t = (m - min) * unitsPerM * exag;
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
    contours.push({m, index: Math.round(m / interval) % indexEvery === 0, pos: new Float32Array(out)});
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

/** A polyline draped on the terrain (sampled every `step` world units), lifted by `lift`. */
export const drape = (T: Terrain, pts: [number, number][], step = 0.03, lift = 0.012): number[][] => {
  const out: number[][] = [];
  for (let k = 0; k < pts.length - 1; k++) {
    const [ax, az] = pts[k], [bx, bz] = pts[k + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / step));
    for (let s = 0; s < n; s++) {
      const x = ax + ((bx - ax) * s) / n, z = az + ((bz - az) * s) / n;
      out.push([x, T.heightAt(x, z) + lift, z]);
    }
  }
  const [lx, lz] = pts[pts.length - 1];
  out.push([lx, T.heightAt(lx, lz) + lift, lz]);
  return out;
};
