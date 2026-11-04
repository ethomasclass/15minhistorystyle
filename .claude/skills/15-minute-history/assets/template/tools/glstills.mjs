// WebGL-capable stills for three.js pieces and chapters (The Balloon War v2):
//   node tools/glstills.mjs <outdir> <CompId>:<frame>[,<frame>...] ...      e.g. node tools/glstills.mjs out/fx FX-DemoSlab:0,60,120 Ch05:900
// SCALE (default 0.5) sets the still size; GL (default swangle) the Chrome GL backend; FX_PUBLIC another public/ folder. Use the
// .real headless shell: REMOTION_CHROME=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/*/chrome-headless-shell.real | head -1).
// A three.js canvas must only mount after its textures have loaded, or the still (and the render) shows it blank.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const [out, ...specs] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: process.env.FX_PUBLIC});
const browserExecutable = process.env.REMOTION_CHROME || null;
const gl = process.env.GL || 'swangle';
const puppeteerInstance = await openBrowser('chrome', {browserExecutable, chromiumOptions: {gl}, timeoutInMilliseconds: 180000});
try {
  for (const spec of specs) {
    const [id, fr] = spec.split(':');
    const composition = await selectComposition({serveUrl, id, browserExecutable, puppeteerInstance, chromiumOptions: {gl}, timeoutInMilliseconds: 180000});
    for (const f of fr.split(',')) {
      const frame = Math.min(composition.durationInFrames - 1, Number(f));
      await renderStill({composition, serveUrl, frame, scale: Number(process.env.SCALE || 0.5), output: path.join(out, `${id}_${f}.jpg`), imageFormat: 'jpeg', jpegQuality: 88, browserExecutable, puppeteerInstance, chromiumOptions: {gl}, timeoutInMilliseconds: 180000});
      console.log('still', id, f);
    }
  }
} finally {
  await puppeteerInstance.close({silent: true});
  fs.rmSync(serveUrl, {recursive: true, force: true});
}
