// scratch: node tools/_stills_frames.mjs <out> <Comp> <frame> [frame...]  (scale 0.5)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const [out, id, ...frames] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const browserExecutable = process.env.REMOTION_CHROME || null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const f of frames) {
  await renderStill({composition, serveUrl, frame: Number(f), output: path.join(out, `${id}_${String(f).padStart(5, '0')}.jpg`), imageFormat: 'jpeg', scale: Number(process.env.SCALE || 0.5), browserExecutable});
}
console.log('done', frames.length);
fs.rmSync(serveUrl, {recursive: true, force: true});
