// Desk background modes (the colour-by-beat test, Nov 2026). The real chapters never set any of this, so DarkPaper stays the
// black desk everywhere; only the TestColor_* compositions (src/test/TestColor.tsx) provide a DeskMap.
//   black  archival evidence (documents, recipe pages, photos): the house dark ruled notebook, unchanged
//   teal   explainer beats (diagrams, counts, numbers); texture = a faint graph-paper grid
//   coral  a SHORT flash for punchlines and MOCK moments; texture = a linen / tablecloth weave
// Bright coral (#FF6F61) and bright teal (#2FE0C4) stay reserved for the subject and the marks.
// Desk background modes (the colour-by-beat look, Nov 2026; the user chose variant C, colour + texture, but brighter).
// The real chapters use DESK_MAP (kit/tg_desk_map.ts); the TestColor_* compositions (src/test/TestColor.tsx) provide their own.
//   black  archival evidence (documents, recipe pages, photos): the house dark ruled notebook, unchanged
//   teal   explainer beats (diagrams, counts, numbers); texture = a faint graph-paper grid
//   coral  a SHORT flash for punchlines and MOCK moments; texture = a linen / tablecloth weave
// The 1950s test-kitchen scenes (ch07) can swap the grid for a light halftone dot (`dots`).
// The desks are bright, so the marks swap with the mode (useMarks, and the palette DeskScene provides): on teal, teal marks
// go pale teal; on coral, coral marks go cream; the orange tape gets an ink edge on coral.
import React from 'react';
import {AbsoluteFill, getInputProps, useCurrentFrame} from 'remotion';
import {PaletteCtx, usePal} from './Kit';
import {DESK_MAP} from './tg_desk_map'; // the real chapters' scene modes

export type DeskMode = 'black' | 'teal' | 'coral';
export type DeskLook = {mode: DeskMode; texture: boolean; dots?: boolean};

/** The desk DarkPaper draws. Default: the black desk. */
export const DeskCtx = React.createContext<DeskLook>({mode: 'black', texture: false});

type Tones = [string, string, string];
/** Desk shades (centre of the radial, mid, edge). `deep` = the tested C; 1-3 = the brighter candidates (review/color_test/brighter_stills.jpg). */
export const TONE_SETS: Record<string, {teal: Tones; coral: Tones}> = {
  deep: {teal: ['#123B38', '#0B2826', '#061715'], coral: ['#521F1D', '#381513', '#220B0A']},
  '1': {teal: ['#1F5E58', '#16443F', '#0B2522'], coral: ['#8C3A33', '#6A2924', '#3A1512']},
  '2': {teal: ['#247068', '#1A524C', '#0E2E2A'], coral: ['#A0413A', '#7A302A', '#431915']},
  '3': {teal: ['#2A7A72', '#1F5C55', '#113532'], coral: ['#B5483F', '#8C352E', '#4C1C17']},
};
/** The chosen set (inputProps `deskTones` overrides it for comparisons). */
export const DESK_TONE_SET = '3';
const toneSet = () => TONE_SETS[String(getInputProps().deskTones ?? DESK_TONE_SET)] ?? TONE_SETS[DESK_TONE_SET];
export const deskTones = (mode: Exclude<DeskMode, 'black'>): Tones => toneSet()[mode];

export const CREAM = '#F4EFE6';
/**
 * Mark colours by desk. `teal` / `coral` stand in for the house teal and coral wherever a mark sits on the desk; `swipe` is the
 * highlighter on pages (`underline`: drawn as an ink rule under the line instead of a band); `edge` outlines the orange tape (null = none); `ground` is the desk's darkest tone (for drawn mud, slabs).
 */
export type Marks = {teal: string; coral: string; swipe: string; underline: boolean; slip: 'coral' | 'cream'; edge: string | null; ground: string};
export const MARKS: Record<DeskMode, Marks> = {
  black: {teal: '#2FE0C4', coral: '#FF6F61', swipe: '#FF6F61', underline: false, slip: 'coral', edge: null, ground: '#0d0c09'},
  teal: {teal: '#BDF5EC', coral: '#FF8A7C', swipe: '#FF6F61', underline: false, slip: 'coral', edge: null, ground: '#0d2624'},
  // on coral the highlighter would melt into the desk: an ink underline instead
  coral: {teal: '#2FE0C4', coral: CREAM, swipe: '#2a1210', underline: true, slip: 'cream', edge: '#1a0d0b', ground: '#2a0f0c'},
};
export const marksFor = (mode: DeskMode): Marks => (mode === 'black' ? MARKS.black : {...MARKS[mode], ground: deskTones(mode)[2]});
export const useDesk = () => React.useContext(DeskCtx);
export const useMarks = () => marksFor(useDesk().mode);
/** '#RRGGBB' + alpha as rgba(). */
export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
/** An ink outline (four hard drop-shadows) for a filter chain. */
export const edgeFilter = (c: string | null, w = 3) => (c ? ` drop-shadow(${w}px 0 0 ${c}) drop-shadow(-${w}px 0 0 ${c}) drop-shadow(0 ${w}px 0 ${c}) drop-shadow(0 -${w}px 0 ${c})` : '');

/**
 * A scene's mode: a fixed mode (optionally with the halftone dots), or switches in narration frames (test only: the real
 * chapters switch on hard cuts, never mid-shot). Keyed `chNN.sceneKey`, the keys of the chapter's cut table. Unlisted = black.
 */
export type DeskT = {at: (p: string, nth?: number) => number; end: (p: string, nth?: number) => number};
export type DeskEntry = DeskMode | {mode: DeskMode; dots?: boolean} | ((t: DeskT) => [number, DeskMode][]);
export type DeskMap = {texture: boolean; scenes: Record<string, DeskEntry>};
export const DeskMapCtx = React.createContext<DeskMap | null>(null);

/** The coloured desk (not used for black, which DarkPaper draws as before). */
export const ToneDesk: React.FC<{mode: Exclude<DeskMode, 'black'>; texture: boolean; dots?: boolean}> = ({mode, texture, dots}) => {
  const [c0, c1, c2] = deskTones(mode);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 45% 40%, ${c0} 0%, ${c1} 70%, ${c2} 100%)`}}>
      {!texture && (
        // the same notebook rules as the black desk
        <AbsoluteFill style={{opacity: 0.12, backgroundImage: 'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '100% 64px'}} />
      )}
      {texture && dots && (
        // the 1950s test kitchen: a light halftone dot, a little larger towards the edges
        <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle, rgba(255,240,225,0.18) 2.4px, transparent 2.8px)', backgroundSize: '18px 18px',
          WebkitMaskImage: 'radial-gradient(ellipse at 45% 40%, rgba(0,0,0,0.55) 20%, #000 90%)'}} />
      )}
      {texture && !dots && mode === 'teal' && (
        // blueprint graph paper: fine 32 px cells, a heavier line every 160 px
        <AbsoluteFill style={{
          backgroundImage: [
            'linear-gradient(rgba(170,235,225,0.16) 1.5px, transparent 1.5px)', 'linear-gradient(90deg, rgba(170,235,225,0.16) 1.5px, transparent 1.5px)',
            'linear-gradient(rgba(170,235,225,0.07) 1px, transparent 1px)', 'linear-gradient(90deg, rgba(170,235,225,0.07) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '160px 160px, 160px 160px, 32px 32px, 32px 32px', backgroundPosition: '-1px -1px'}} />
      )}
      {texture && !dots && mode === 'coral' && (
        <>
          {/* linen: fine warp and weft threads, then slubby noise stretched along each */}
          <AbsoluteFill style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,220,205,0.09) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 4px)'}} />
          <AbsoluteFill style={{opacity: 0.35, mixBlendMode: 'soft-light'}}>
            <svg width="100%" height="100%">
              <filter id="linenH"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.9" numOctaves="2" seed={7} /><feColorMatrix type="saturate" values="0" /></filter>
              <filter id="linenV"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.012" numOctaves="2" seed={11} /><feColorMatrix type="saturate" values="0" /></filter>
              <rect width="100%" height="100%" filter="url(#linenH)" />
              <rect width="100%" height="100%" filter="url(#linenV)" opacity={0.6} />
            </svg>
          </AbsoluteFill>
        </>
      )}
    </AbsoluteFill>
  );
};

/**
 * Wraps a chapter's current scene so DarkPaper inside it draws that scene's desk, and the marks inside it take the desk's
 * colours (the palette: mark/accent = the desk's teal, subject = its coral, tint = the original coral for archival subjects).
 * `cuts` are the chapter's scene start frames (narration time), `t` its timeline. The real chapters use DESK_MAP; a TestColor
 * composition sets its own map through DeskMapCtx.
 */
export const DeskScene: React.FC<{ch: string; cuts: Record<string, number>; t: DeskT; children: React.ReactNode}> = ({
  ch, cuts, t, children,
}) => {
  const map = React.useContext(DeskMapCtx) ?? REAL_MAP;
  const pal = usePal();
  const f = useCurrentFrame();
  const key = Object.entries(cuts).filter(([, at]) => at <= f).sort((a, b) => a[1] - b[1]).pop()?.[0] ?? '';
  const e = map.scenes[`${ch}.${key}`] ?? 'black';
  const mode = typeof e === 'string' ? e : typeof e === 'function' ? e(t).reduce<DeskMode>((m, [at, md]) => (f >= at ? md : m), 'black') : e.mode;
  const dots = typeof e === 'object' && e.dots;
  const m = marksFor(mode);
  const p = mode === 'black' ? pal : {...pal, mark: m.teal, accent: m.teal, subject: m.coral, tint: pal.tint ?? pal.subject, edge: m.edge ?? undefined};
  return (
    <DeskCtx.Provider value={{mode, texture: map.texture, dots}}>
      <PaletteCtx.Provider value={p}>{children}</PaletteCtx.Provider>
    </DeskCtx.Provider>
  );
};

/** True inside a TestColor composition. */
export const useDeskTest = () => React.useContext(DeskMapCtx) !== null;

const REAL_MAP: DeskMap = {texture: true, scenes: DESK_MAP};

/** A cut-in: the same layout pushed in on (x, y) by z (screen px), for a flash that has to be its own shot (a hard cut, not a mid-shot colour change). */
// (the offset is clamped so the pushed-in desk still covers the frame)
export const CutIn: React.FC<{x: number; y: number; z: number; children: React.ReactNode}> = ({x, y, z, children}) => {
  const L = Math.min(0, Math.max(1920 - 1920 * z, 960 - x * z));
  const T = Math.min(0, Math.max(1080 - 1080 * z, 540 - y * z));
  // data-nosafe: a pushed-in shot crops its text on purpose; the title-safe pass (kit/ga_brand SafeText) leaves it alone
  return <AbsoluteFill data-nosafe style={{transform: `translate(${L}px, ${T}px) scale(${z})`, transformOrigin: '0 0'}}>{children}</AbsoluteFill>;
};
