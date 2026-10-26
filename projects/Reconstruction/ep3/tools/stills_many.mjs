// Stills from several compositions with one bundle:  node tools/stills_many.mjs outdir Ch02:12.5,40 Ch03:8 ...  (seconds)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [out, ...specs] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_CHROME || null;
try {
  for (const spec of specs) {
    const [id, list] = spec.split(':');
    const composition = await selectComposition({serveUrl, id, browserExecutable});
    for (const s of list.split(',')) {
      const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
      await renderStill({composition, serveUrl, frame, output: path.join(out, `${id}_${s}.jpg`), imageFormat: 'jpeg', jpegQuality: 85, scale: 0.5, browserExecutable, timeoutInMilliseconds: 120000});
      console.log('still', id, s);
    }
  }
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true}); // bundles copy all of public/
}
