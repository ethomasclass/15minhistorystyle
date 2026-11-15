// Chunk History branding for the edit: the 2 s mark snap between chapters, and the 20 s end screen.
// Mark snap (the template's LogoBreak): black, the teal mark already there, the coral quarter swings in and locks at 1.0 s on
// chunk_snap.wav's click-clack. End screen: clean slots for YouTube's end-screen elements (two videos, a subscribe button).
const MARK_TEAL = 'M106 26 L106 3 L103 0 L31.2 0 L29.1 0.9 L0.9 29.1 L0 31.2 L0 103 L3 106 L24 106 L24 118 L3 118 L0 121 L0 192.8 L0.9 194.9 L29.1 223.1 L31.2 224 L103 224 L106 221 L106 200 L118 200 L118 221 L121 224 L192.8 224 L194.9 223.1 L223.1 194.9 L224 192.8 L224 121 L221 118 L198 118 L197 117 L107 117 L107 81 L104 78 L81 78 L78 81 L78 143 L81 146 L143 146 L146 143 L146 135 L152 129 L178 129 L184 135 L184 178 L178 184 L46 184 L40 178 L40 46 L46 40 L104 40 L107 37 L107 27 Z';
const MARK_CORAL = 'M118 26 L117 27 L117 37 L120 40 L178 40 L184 46 L184 89 L178 95 L152 95 L146 89 L146 81 L143 78 L120 78 L117 81 L117 104 L120 107 L197 107 L198 106 L221 106 L224 103 L224 31.2 L223.1 29.1 L194.9 0.9 L192.8 0 L121 0 L118 3 Z';
function chunkMark(cx, cy, size, angle = 0, o = 1) {
  const s = size / 224;
  return `<g transform="translate(${cx - size / 2},${cy - size / 2}) scale(${s})" opacity="${o.toFixed(3)}">
    <path d="${MARK_TEAL}" fill="#2FE0C4" fill-rule="evenodd"/>
    <path d="${MARK_CORAL}" fill="#FF6F61" fill-rule="evenodd" transform="rotate(${angle.toFixed(2)} 112 112)"/></g>`;
}
EDITS.brk = () => ({dur: 2.0, shots: [{a: 0, b: 2.0, live: true, draw: (T) => {
  const u = clamp01(T / 1.0), back = 1.70158 * 1.3;                       // ease-out-back: a small overshoot as it locks
  const k = 1 + (back + 1) * Math.pow(u - 1, 3) + back * Math.pow(u - 1, 2);
  const o = fin(T, 0.05, 0.25) * fout(T, 1.65, 0.3);
  return `<div style="position:absolute;inset:0;background:#0b0b0b"></div>` + svg(chunkMark(960, 540, 230, -110 * (1 - k), o));
}}]});
EDITS.endscreen = () => {
  const dur = 20, V = [[150, 300], [1050, 300]], VW = 720, VH = 405;
  return {dur, fadeOut: 1.0, shots: [{a: 0, b: dur, draw: (T) => desk() +
    svg(chunkMark(960, 120, 110, 0, fin(T, 0.2, 0.5)) +
      V.map(([x, y]) => `<rect x="${x}" y="${y}" width="${VW}" height="${VH}" rx="6" fill="rgba(13,12,9,.55)" stroke="#2FE0C4" stroke-opacity=".35" stroke-width="3"/>`).join('') +
      `<circle cx="960" cy="860" r="92" fill="rgba(13,12,9,.55)" stroke="#FF6F61" stroke-opacity=".45" stroke-width="3"/>`) +
    op(fin(T, 0.4, 0.5), mono('watch next', {x: 150, y: 250, size: 26, color: C.teal, ls: 5})) +
    op(fin(T, 0.6, 0.5), mono('more from the gilded age', {x: 1050, y: 250, size: 26, color: C.teal, ls: 5})) +
    op(fin(T, 0.8, 0.5), mono('subscribe', {x: 0, y: 975, size: 24, color: C.cream, ls: 6, extra: 'width:1920px;text-align:center'}))}]};
};
