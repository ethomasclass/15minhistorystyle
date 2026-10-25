// Low-res preview renders with one bundle.
//   node src/previews/render.mjs video review/previews P1-ColdOpen P2-Race ...     -> <id>.mp4 at 960x540
//   node src/previews/render.mjs stills /tmp/out P1-ColdOpen 10 120 300 ...         -> <id>_<frame>.jpg at 960x540
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [mode, out, ...rest] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_CHROME || null;
const scale = Number(process.env.SCALE ?? 0.5);
if (mode === 'video') {
  for (const id of rest) {
    const composition = await selectComposition({serveUrl, id, browserExecutable});
    await renderMedia({composition, serveUrl, codec: 'h264', crf: 24, scale, outputLocation: path.join(out, `${id}.mp4`), browserExecutable,
      concurrency: Number(process.env.CONC ?? 4), onProgress: ({progress}) => { if (Math.round(progress * 100) % 20 === 0) process.stdout.write(`\r${id} ${Math.round(progress * 100)}%`); }});
    console.log('\nvideo', id);
  }
} else {
  const [id, ...frames] = rest;
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  for (const fr of frames) {
    await renderStill({composition, serveUrl, frame: Number(fr), scale, output: path.join(out, `${id}_${fr}.jpg`), imageFormat: 'jpeg', jpegQuality: 88, browserExecutable});
  }
  console.log('stills', id, frames.join(' '));
}
fs.rmSync(serveUrl, {recursive: true, force: true});
