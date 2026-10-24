// Which board pieces a camera framing slices:  node tools/boardfit.mjs <ch> <cx> <cy> <zoom>
import {build} from 'esbuild';
import path from 'node:path';
const out = path.resolve('out/boardfit.cjs');
await build({entryPoints: ['src/kit/ep2board.tsx'], bundle: true, platform: 'node', format: 'cjs', outfile: out, external: ['react', 'remotion', '@remotion/*', 'three', '@react-three/*'], loader: {'.png': 'empty', '.jpg': 'empty'}, logLevel: 'error'});
const {createRequire} = await import('node:module');
const req = createRequire(path.resolve('package.json'));
const m = req(out);
const SIZE = {drop: [380, 300], slap: [190, 175], stamp: [360, 60], tape: [120, 40], slide: [360, 40], fade: [160, 30]};
const ch = Number(process.argv[2]);
const rects = m.PIECES.filter((p) => p.ch <= ch).map((p) => ({id: p.id, r: [p.x, p.y, p.x + SIZE[p.kind][0], p.y + SIZE[p.kind][1]]}));
const [cx, cy, z] = process.argv[3] === 'search' ? [0, 0, 1] : process.argv.slice(3).map(Number);
const hw = 960 / z, hh = 540 / z, v = [cx - hw, cy - hh, cx + hw, cy + hh];
for (const {id, r} of rects) {
  const off = r[2] <= v[0] || r[0] >= v[2] || r[3] <= v[1] || r[1] >= v[3];
  const inside = r[0] >= v[0] && r[2] <= v[2] && r[1] >= v[1] && r[3] <= v[3];
  if (!off && !inside) console.log('cut', id, r.join(','));
}
console.log('view', v.map(Math.round).join(','));
// search: node tools/boardfit.mjs <ch> search x0,y0,x1,y1  (framings around a box that slice nothing)
if (process.argv[3] === 'search') {
  const b = process.argv[4].split(',').map(Number);
  const res = [];
  for (let z = 1.2; z >= 0.5; z -= 0.025) for (let cx = b[0] - 1200; cx <= b[2] + 1200; cx += 25) for (let cy = b[1] - 800; cy <= b[3] + 800; cy += 25) {
    const hw = 960 / z, hh = 540 / z, v = [cx - hw, cy - hh, cx + hw, cy + hh], m = 70 / z;
    if (b[0] < v[0] + m || b[2] > v[2] - m || b[1] < v[1] + m || b[3] > v[3] - m) continue;
    const sm = 60 / z;
    if (rects.every(({r}) => r[2] <= v[0] || r[0] >= v[2] || r[3] <= v[1] || r[1] >= v[3] || (r[0] >= v[0] + sm && r[2] <= v[2] - sm && r[1] >= v[1] + sm && r[3] <= v[3] - sm))) res.push([cx, cy, +z.toFixed(3)]);
  }
  const best = {};
  for (const r of res) (best[r[2]] ??= []).push(r);
  for (const z of Object.keys(best).sort((a, b) => b - a).slice(0, 6)) console.log(z, best[z].length, best[z].slice(0, 3).map((r) => r.join(' ')).join(' | '), '…', best[z].at(-1).join(' '));
}
