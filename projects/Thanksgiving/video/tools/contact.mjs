// Contact frames for review: one bundle, a frame every N seconds of each composition, half size.
//   node tools/contact.mjs Ch01,Ch02 <outdir> [everySeconds=4]     then: python3 tools/contact_sheet.py <outdir> Ch01
import {bundle} from '@remotion/bundler';
import {renderFrames, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const [idsArg, out, every = '4'] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_CHROME || null;
for (const id of idsArg.split(',')) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  const outputDir = path.join(out, id);
  fs.rmSync(outputDir, {recursive: true, force: true});
  fs.mkdirSync(outputDir, {recursive: true});
  await renderFrames({composition, serveUrl, inputProps: {}, browserExecutable, outputDir, imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5,
    everyNthFrame: Math.round(Number(every) * composition.fps), concurrency: Number(process.env.CONC || 4), timeoutInMilliseconds: 240000, onStart: () => {}, onFrameUpdate: () => {}});
  console.log('frames', id, fs.readdirSync(outputDir).length);
}
fs.rmSync(serveUrl, {recursive: true, force: true});
