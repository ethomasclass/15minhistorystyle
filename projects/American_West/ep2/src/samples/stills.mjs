// Render the review still of every sample (or the ids given) with one bundle:
//   node src/samples/stills.mjs review/samples [S1-Spike-A ...]   (frame = STILL_FRAME, override with FRAME=n)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [out, ...ids] = process.argv.slice(2);
const list = ids.length ? ids : ['S1-Spike-A', 'S1-Spike-B', 'S1-Spike-C', 'S2-Checker-A', 'S2-Checker-B', 'S2-Checker-C', 'S3-Race-A', 'S3-Race-B', 'S3-Race-C',
  'S4-Ledger-A', 'S4-Ledger-B', 'S5-Hinge-A', 'S5-Hinge-B', 'S5-Resist-A', 'S5-Resist-B'];
const frame = Number(process.env.FRAME ?? 84);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_CHROME || null;
for (const id of list) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  await renderStill({composition, serveUrl, frame, output: path.join(out, `${id}.jpg`), imageFormat: 'jpeg', jpegQuality: 90, browserExecutable});
  console.log('still', id);
}
fs.rmSync(serveUrl, {recursive: true, force: true});
