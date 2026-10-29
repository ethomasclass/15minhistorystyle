// A real-elevation terrain slab drawn in the channel's style: a near-black surface, teal contour lines (index contours
// brighter and heavier), dark sides with faint strata lines, a teal rim, and a contact shadow on the desk.
// `reveal` 0..1 draws the contours on from the lowest level up; `dim` 0..1 dulls the lines (for the drained beat).
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ContactShadow, Poly, Segs, TEAL} from './drawn3d';
import type {Terrain} from './heightmap';

export const BASE = -0.32; // slab bottom (world y)

const surfaceGeo = (T: Terrain) => {
  const {w, h} = T.hm;
  const g = new THREE.PlaneGeometry(T.size, T.depth, w - 1, h - 1);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let k = 0; k < p.count; k++) p.setY(k, T.ys[k]);
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

export const TerrainSlab: React.FC<{T: Terrain; reveal?: number; dim?: number; contourW?: number; indexW?: number; surface?: string}> = ({
  T, reveal = 1, dim = 0, contourW = 1.3, indexW = 2.4, surface = '#121916',
}) => {
  const surf = useMemo(() => surfaceGeo(T), [T]);
  const skirt = useMemo(() => skirtGeo(T), [T]);
  const sx = T.size / 2, sz = T.depth / 2;
  const base = useMemo(() => [[-sx, BASE, -sz], [sx, BASE, -sz], [sx, BASE, sz], [-sx, BASE, sz], [-sx, BASE, -sz]], [sx, sz]);
  const corners = useMemo(() => {
    const out: number[] = [];
    for (const [x, z] of [[-sx, -sz], [sx, -sz], [sx, sz], [-sx, sz]]) out.push(x, BASE, z, x, T.heightAt(x * 0.9999, z * 0.9999), z);
    return new Float32Array(out);
  }, [T, sx, sz]);
  const strata = useMemo(() => [-0.11, -0.21].map((y) => new Float32Array([-sx, y, sz + 0.002, sx, y, sz + 0.002, sx + 0.002, y, -sz, sx + 0.002, y, sz, -sx - 0.002, y, -sz, -sx - 0.002, y, sz])), [sx, sz]);
  const n = T.contours.length;
  const lineK = 1 - 0.55 * dim;
  return (
    <group>
      <ContactShadow y={BASE - 0.01} w={T.size * 1.5} d={T.depth * 1.6} opacity={0.85} z={0.25} />
      <mesh geometry={surf}>
        <meshLambertMaterial color={surface} polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
      </mesh>
      <mesh geometry={skirt}>
        <meshLambertMaterial color="#0b0f0d" side={THREE.DoubleSide} />
      </mesh>
      {T.contours.map((c, i) => {
        const k = Math.max(0, Math.min(1, reveal * (n + 4) - i));
        if (k <= 0) return null;
        return <Segs key={i} pos={c.pos} color={TEAL} width={c.index ? indexW : contourW} opacity={(c.index ? 0.95 : 0.55) * k * lineK} />;
      })}
      <Poly pts={T.rim} color={TEAL} width={2.4} opacity={0.9 * lineK} />
      <Poly pts={base} color={TEAL} width={1.6} opacity={0.45} />
      <Segs pos={corners} color={TEAL} width={1.6} opacity={0.55} />
      {strata.map((s, i) => <Segs key={i} pos={s} color={TEAL} width={1} opacity={0.2} />)}
    </group>
  );
};
