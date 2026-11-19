// Render named stills with one bundle, frames given by narration words (chapters 2+ add the 60-frame logo lead):
//   node tools/frames_at.mjs <outdir> <spec.json>    spec: [{id: 'Ch07', word: 'In 1955,', nth?: 1, off?: 0, label: '...'}, ...]
// Writes <outdir>/NN.jpg and <outdir>/index.json (label per file). Stills only: no video is rendered.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const [out, specPath] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const AUD = path.resolve('public/audio');
const wordsOf = (id) => JSON.parse(fs.readFileSync(path.join(AUD, fs.readdirSync(AUD).find((f) => f.startsWith(id.toLowerCase().replace('ch', 'ch')) && f.endsWith('.words.json'))), 'utf8')).words;
const frameOf = (s) => {
  const W = wordsOf(s.id), toks = W.map((w) => norm(w.w)), p = s.word.split(/\s+/).map(norm);
  let c = 0;
  for (let i = 0; i + p.length <= toks.length; i++) if (p.every((x, j) => toks[i + j] === x) && ++c === (s.nth || 1)) return (s.id === 'Ch01' ? 0 : 60) + Math.round(W[i].s * 30) + (s.off || 0);
  throw new Error('no ' + s.word);
};
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = {};
const index = [];
for (const [i, s] of spec.entries()) {
  comps[s.id] ??= await selectComposition({serveUrl, id: s.id});
  const frame = s.frame ?? frameOf(s);
  const file = path.join(out, String(i).padStart(2, '0') + '.jpg');
  await renderStill({composition: comps[s.id], serveUrl, frame, output: file, imageFormat: 'jpeg', scale: 0.5});
  index.push({file, label: `${s.label}  (${s.id} f${frame})`, group: s.group});
  console.log('still', i, s.id, frame);
}
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify(index, null, 1));
fs.rmSync(serveUrl, {recursive: true, force: true});
