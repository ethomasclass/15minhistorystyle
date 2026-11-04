// WebGL-capable stills (swangle): node tools/glstills.mjs <outdir> <CompId>:<frame>[,<frame>...] ...   (run from v2/)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const [out, ...specs] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: process.env.FX_PUBLIC});
const browserExecutable = process.env.REMOTION_CHROME || null;
import {openBrowser} from '@remotion/renderer';
const puppeteerInstance = await openBrowser('chrome', {browserExecutable, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 180000});
try {
  for (const spec of specs) {
    const [id, fr] = spec.split(':');
    const composition = await selectComposition({serveUrl, id, browserExecutable, puppeteerInstance, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 180000});
    for (const f of fr.split(',')) {
      const frame = Math.min(composition.durationInFrames - 1, Number(f));
      await renderStill({composition, serveUrl, frame, scale: Number(process.env.SCALE || 0.5), output: path.join(out, `${id}_${f}.jpg`), imageFormat: 'jpeg', jpegQuality: 88, browserExecutable, puppeteerInstance, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 180000});
      console.log('still', id, f);
    }
  }
} finally {
  await puppeteerInstance.close({silent: true});
  fs.rmSync(serveUrl, {recursive: true, force: true});
}
