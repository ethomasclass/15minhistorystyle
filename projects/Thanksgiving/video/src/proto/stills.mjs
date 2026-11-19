// node proto_stills.mjs outdir  (run from video/)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs'; import path from 'node:path';
const [out] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/proto/index.ts')});
const F = {Montage: [96, 100, 104, 118], Grandma: [13, 20, 26, 72], Subscribe: [15, 18, 24, 60]};
for (const [k, fr] of Object.entries(F)) for (const v of ['A', 'B']) {
  const composition = await selectComposition({serveUrl, id: `Proto-${k}-${v}`});
  for (const f of fr) { await renderStill({composition, serveUrl, frame: f, output: path.join(out, `${k}_${v}_${f}.jpg`), imageFormat: 'jpeg'}); console.log(k, v, f); }
}
fs.rmSync(serveUrl, {recursive: true, force: true});
