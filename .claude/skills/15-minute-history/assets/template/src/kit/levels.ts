// Music bed levels, matched to the Black Sox mix (American West Ep 1, Oct 2026): the narration sits at -18 LUFS
// (tools/level_voice.py, which voice.py runs on every take) and the bed about 13 LU under it (Black Sox chapters 2-8 measured
// 12.2-15.1, mean 12.9). Library cues are mastered differently (-11 to -22 LUFS), so one flat volume puts some beds 9 dB louder
// than others; bed() turns a cue's measured loudness into the volume that lands it at the target. Use it for every music entry:
//   {src: 'music/g_grip.mp3', volume: bed('g_grip')}        a grave stretch: bed('j_grief', 14)
// CUE_LUFS is generated from music/catalog.json (integrated_lufs). A new cue: measure it (ffmpeg -af ebur128) and add it here.
const VOICE = -18;
export const CUE_LUFS: Record<string, number> = {
  a_civil_war: -15.37, a_mexico: -15.69, a_mexico_short: -14.69, a_newsroom: -15.1, a_price: -17.29, aw_iron_horse: -16.6,
  aw_legend_sours: -17.0, aw_long_grief: -22.0, aw_panic: -15.9, aw_promise_theme: -16.9, aw_robber_barons: -16.7,
  b_caper_40s: -16.0, b_newsreel: -16.4, b_paper_wind: -17.2, cw_aftermath: -18.3, cw_camp_night: -18.1, cw_fife_dread: -16.2,
  cw_telegraph: -19.1, g_cotton_engine: -14.95, g_founding: -15.51, g_grip: -16.34, g_pyramid: -15.81, g_southampton: -15.89,
  g_world_outside: -14.67, j_campaign: -14.53, j_cold_open: -17.77, j_good_feelings: -19.59, j_gossip: -12.82, j_grief: -13.99,
  j_intrigue: -15.4, m_1924: -15.9, m_alexandria: -17.7, m_apothecary: -16.2, m_frontier: -15.31, m_lament: -16.32,
  m_lament_baroque: -15.8, m_old_world: -15.4, m_parlor: -16.5, m_reveal: -17.4, m_tomb: -16.5, m_war_drums: -17.89,
  r_abolition_a: -13.08, r_abolition_b: -12.35, r_cold_open: -12.42, r_curtain: -12.69, r_dix: -11.88, r_ending: -11.97,
  r_nativism: -12.33, r_revival: -12.07, r_schools: -12.39, r_spirits: -10.74, r_spirits_dark: -12.05, r_temperance: -12.6,
  r_title_sting: -11.33, r_utopia: -12.12, rc_backroom: -20.1, rc_brass_dirge: -11.02, rc_codes: -16.02, rc_jubilee: -21.9,
  rc_jubilo: -19.45, rc_night_riders: -18.74, rc_parlor: -16.67, rc_reckoning: -18.3, rc_resolve: -20.1, w_aftermath: -12.78,
  w_calm_sea: -12.48, w_dawn: -11.6, w_fire: -11.08, w_frontier: -11.97, w_sea_battle: -11.26, w_title_fanfare: -10.79,
  // Ep 2 Suno cues (Oct 2026)
  aw_long_drive: -21.2, aw_white_cold: -21.1, aw_boomtown: -22.4, aw_boomtown_rush: -21.9, aw_boomtown_hollow: -23.0,
};
/** Volume for a cue so its bed sits `gap` LU under the voice (13 = the Black Sox norm; 14-15 for a quiet, grave stretch). */
export const bed = (cue: string, gap = 13) => {
  const l = CUE_LUFS[cue];
  if (l === undefined) throw new Error(`bed(): no loudness measured for ${cue}; add it to CUE_LUFS`);
  return +Math.pow(10, (VOICE - gap - l) / 20).toFixed(3);
};
