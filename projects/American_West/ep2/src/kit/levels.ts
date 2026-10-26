// Music bed levels, matched to the Black Sox mix: the narration sits at -18 LUFS (tools/level_voice.py) and the bed about
// 13 LU under it (Black Sox chapters 2-8 measured 12.2-15.1, mean 12.9). Each library cue is mastered differently (-11 to
// -18 LUFS), so one flat volume puts some beds 9 dB louder than others; bed() turns a cue's measured loudness into the
// volume that lands it at the target. Cue loudness: EBU R128 integrated, measured on music/cues/*.mp3 (Oct 2026).
const VOICE = -18;
export const CUE_LUFS: Record<string, number> = {
  a_price: -17.2, g_cotton_engine: -14.9, g_founding: -15.4, g_grip: -16.2, g_world_outside: -14.6, j_grief: -14.0,
  r_cold_open: -12.4, r_curtain: -12.7, r_ending: -11.9, r_nativism: -12.3, w_aftermath: -12.7, w_fire: -11.0,
  // the series' Suno cues (Oct 2026); aw_long_grief measured after trimming to 3:04
  aw_iron_horse: -16.6, aw_legend_sours: -17.0, aw_long_grief: -22.0, aw_panic: -15.9, aw_promise_theme: -16.9, aw_robber_barons: -16.7,
  // Ep 2's library fallbacks (measured Oct 2026)
  m_frontier: -15.2, m_lament: -16.3, a_mexico: -15.7, j_intrigue: -15.4, r_temperance: -12.6,
  // Ep 2 Suno cues (Oct 2026)
  aw_long_drive: -21.2, aw_white_cold: -21.1, aw_boomtown: -22.4, aw_boomtown_rush: -21.9, aw_boomtown_hollow: -23.0,
};
/** Volume for a cue so its bed sits `gap` LU under the voice (13 = the Black Sox norm; 14-15 for a quiet, grave stretch). */
export const bed = (cue: string, gap = 13) => {
  const l = CUE_LUFS[cue];
  if (l === undefined) throw new Error(`bed(): no loudness measured for ${cue}; add it to CUE_LUFS`);
  return +Math.pow(10, (VOICE - gap - l) / 20).toFixed(3);
};
