// Render thumbnail options: node render.mjs <outdir> [filter]
// Loads the look-dev page (../../lookdev/bridge.html), draws a scene with the series' own code, then lays the
// thumbnail overlay (desk cut-outs, tape, type) on top. Image paths in designs.mjs are relative to lookdev/.
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JOBS, CSS} from './designs.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const [out, filter] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1920}});
page.on('pageerror', (e) => console.log('ERR', e.message));
await page.goto('file://' + path.join(here, '../../lookdev/bridge.html'));
await page.addStyleTag({content: CSS});
for (const j of JOBS) {
  if (filter && !j.name.includes(filter)) continue;
  await page.evaluate(async (j) => {
    const st = document.getElementById('stage');
    st.style.width = j.w + 'px'; st.style.height = j.h + 'px';
    const sc = document.getElementById('scene');
    sc.innerHTML = j.scene ? (0, eval)(j.scene) : '';
    sc.style.cssText = j.sceneCss || '';
    if (j.strip) sc.querySelectorAll('text').forEach((t) => { const g = t.parentNode; (g.tagName === 'g' && g.parentNode.tagName !== 'svg' ? g : t).remove(); });
    document.getElementById('ov').innerHTML = j.ov;
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
  }, j);
  await page.locator('#stage').screenshot({path: path.join(out, j.name + '.png')});
  console.log('rendered', j.name);
}
await browser.close();
