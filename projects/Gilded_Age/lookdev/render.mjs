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
  // round 4: profile heads and expressions, locked walk, seated driver, horse gait
  {name: 'r4_faces', look: 'dusk', faces: true},
  {name: 'r4_walk_medium_smile', clip: 'walk_medium', t: 2.0},
  {name: 'r4_walk_wide_wagon', clip: 'walk_wide', t: 6},
  {name: 'r4_closeup_awe', clip: 'closeup_night', t: 7},
  {name: 'r4_detail_ladder', look: 'dusk', ladder: true},
  // round 5: the rig as a reusable model, and the tenement cutaway
  {name: 'r5_cast_sheet', castsheet: true},
  {name: 'r5_cut_wide', cut: true, t: 2, z: 0.8, ux: 900, uy: 470},
  {name: 'r5_cut_labels', cut: true, t: 2, z: 0.8, ux: 880, uy: 470, labels: true},
  {name: 'r5_cut_kellys', cut: true, t: 12.8, z: 7.6, ux: 556, uy: 560},
  {name: 'r5_cut_kellys_mid', cut: true, t: 9.4, z: 4.6, ux: 409, uy: 556},
  {name: 'r5_cut_garment_shop', cut: true, t: 3, z: 4.6, ux: 409, uy: 426},
  {name: 'r5_cut_saloon_cellar', cut: true, t: 3, z: 3, ux: 560, uy: 880},
  // round 7: the two integration explainers
  {name: 'r7_vi_mine', clip: 'vi_explainer', t: 1.2},
  {name: 'r7_vi_mill', clip: 'vi_explainer', t: 8.1},
  {name: 'r7_vi_end', clip: 'vi_explainer', t: 27.5},
  {name: 'r7_vi_stack', clip: 'vi_explainer', t: 20.4},
  {name: 'r7_hi_wide', clip: 'hi_explainer', t: 2},
  {name: 'r7_hi_rebate', clip: 'hi_explainer', t: 8.6},
  {name: 'r7_hi_bought', clip: 'hi_explainer', t: 16},
  {name: 'r7_hi_end', clip: 'hi_explainer', t: 23.5},
  {name: 'r7_hi_compare', clip: 'hi_explainer', t: 30.5},
  // round 8: the refinery
  {name: 'r8_rf_wide', clip: 'refinery_tour', t: 1},
  {name: 'r8_rf_ship', clip: 'refinery_tour', t: 3},
  {name: 'r8_rf_bags', clip: 'refinery_tour', t: 7.6},
  {name: 'r8_rf_char', clip: 'refinery_tour', t: 9.2},
  {name: 'r8_rf_pans', clip: 'refinery_tour', t: 10.6},
  {name: 'r8_rf_michael', clip: 'refinery_tour', t: 12.5},
  // round 9: the weaver's son
  {name: 'r9_lm_loom', clip: 'loom_weaver', t: 2.5},
  {name: 'r9_lm_street', clip: 'loom_weaver', t: 6.4},
  {name: 'r9_lm_factory', clip: 'loom_weaver', t: 8.4},
  {name: 'r9_lm_engine', clip: 'loom_weaver', t: 11},
  {name: 'r9_lm_idle', clip: 'loom_weaver', t: 16},
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
