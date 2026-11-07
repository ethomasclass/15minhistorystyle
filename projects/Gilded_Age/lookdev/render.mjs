// Render look-dev frames: node render.mjs [filter]
// Each job: {name, look, cx, overlay, dim}. Output: out/<name>.png (1920x1080, the video frame size).
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const JOBS = [
  {name: 'look1_channel_dusk', look: 'dusk', cx: 0},
  {name: 'look2_opening_night', look: 'night', cx: 0},
  {name: 'look3_flat_poster', look: 'flat', cx: 0},
  {name: 'look4_gaslight_warm', look: 'warm', cx: 0},
  {name: 'look5_cut_paper', look: 'paper', cx: 0},
  // the camera path of one side-scroll, four stops
  {name: 'scroll_1', look: 'dusk', cx: -3600},
  {name: 'scroll_2', look: 'dusk', cx: -2400},
  {name: 'scroll_3', look: 'dusk', cx: -1200},
  {name: 'scroll_4', look: 'dusk', cx: 0},
  // text and card options, over the channel dusk look
  {name: 'text_sec_A_tape', look: 'dusk', cx: 0, overlay: 'secTape'},
  {name: 'text_sec_B_band', look: 'dusk', cx: 0, overlay: 'secBand'},
  {name: 'text_sec_C_handbill', look: 'dusk', cx: 0, overlay: 'secHandbill'},
  {name: 'vocab_1_current_bar', look: 'dusk', cx: 0, overlay: 'vBar'},
  {name: 'vocab_2_index_card', look: 'dusk', cx: 0, overlay: 'vCard'},
  {name: 'vocab_3_lower_tab', look: 'dusk', cx: 0, overlay: 'vTab'},
  {name: 'vocab_4_in_scene', look: 'dusk', cx: 400, overlay: 'vScene'},
  {name: 'vocab_5_dictionary', look: 'dusk', cx: 0, overlay: 'vDict'},
  {name: 'text_callouts_composite', look: 'dusk', cx: 0, overlay: 'callouts'},
  {name: 'text_gold_or_gilt', look: 'dusk', cx: 0, overlay: 'gilt'},
  // round 2: the detail ladder and stills from the three clips
  {name: 'r2_detail_ladder', look: 'dusk', ladder: true},
  {name: 'r2_detail_ladder_night', look: 'night', ladder: true},
  {name: 'r2_alive_dusk_t3', clip: 'alive_dusk', t: 3},
  {name: 'r2_fireworks_t2', clip: 'fireworks_night', t: 2},
  {name: 'r2_closeup_t7', clip: 'closeup_night', t: 7},
  {name: 'r2_closeup_t2', clip: 'closeup_night', t: 2.6},
  // round 3: Michael walks home down a tenement street
  {name: 'r3_walk_wide_t1', clip: 'walk_wide', t: 1},
  {name: 'r3_walk_wide_t6', clip: 'walk_wide', t: 6},
  {name: 'r3_walk_medium_t2', clip: 'walk_medium', t: 2},
];

const filter = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}, deviceScaleFactor: 1});
await page.goto('file://' + path.join(here, 'bridge.html'));
for (const job of JOBS) {
  if (filter && !job.name.includes(filter)) continue;
  await page.evaluate((cfg) => window.draw(cfg), job);
  await page.locator('#stage').screenshot({path: path.join(here, 'out', job.name + '.png')});
  console.log('rendered', job.name);
}
await browser.close();
