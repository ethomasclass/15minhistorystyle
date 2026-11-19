// Desk background modes (the colour-by-beat test, Nov 2026). The real chapters never set any of this, so DarkPaper stays the
// black desk everywhere; only the TestColor_* compositions (src/test/TestColor.tsx) provide a DeskMap.
//   black  archival evidence (documents, recipe pages, photos): the house dark ruled notebook, unchanged
//   teal   explainer beats (diagrams, counts, numbers); texture = a faint graph-paper grid
//   coral  a SHORT flash for punchlines and MOCK moments; texture = a linen / tablecloth weave
// Bright coral (#FF6F61) and bright teal (#2FE0C4) stay reserved for the subject and the marks.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export type DeskMode = 'black' | 'teal' | 'coral';
export type DeskLook = {mode: DeskMode; texture: boolean};

/** The desk DarkPaper draws. Default: the black desk. */
export const DeskCtx = React.createContext<DeskLook>({mode: 'black', texture: false});

/** Deep shades: centre of the radial, mid, edge. (Checked against teal writing, orange tape and coral swipes in the stills.) */
export const DESK_TONES: Record<Exclude<DeskMode, 'black'>, [string, string, string]> = {
  teal: ['#123B38', '#0B2826', '#061715'],
  coral: ['#521F1D', '#381513', '#220B0A'],
};

/**
 * A scene's mode: a fixed mode, or switches in narration frames (from the scene's timeline), e.g. a coral flash then back.
 * Keyed `chNN.sceneKey`, the keys of the chapter's cut table. Scenes not listed are black.
 */
export type DeskT = {at: (p: string, nth?: number) => number; end: (p: string, nth?: number) => number};
export type DeskEntry = DeskMode | ((t: DeskT) => [number, DeskMode][]);
export type DeskMap = {texture: boolean; scenes: Record<string, DeskEntry>};
export const DeskMapCtx = React.createContext<DeskMap | null>(null);

/** The coloured desk (not used for black, which DarkPaper draws as before). */
export const ToneDesk: React.FC<{mode: Exclude<DeskMode, 'black'>; texture: boolean}> = ({mode, texture}) => {
  const [c0, c1, c2] = DESK_TONES[mode];
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 45% 40%, ${c0} 0%, ${c1} 70%, ${c2} 100%)`}}>
      {!texture && (
        // the same notebook rules as the black desk
        <AbsoluteFill style={{opacity: 0.12, backgroundImage: 'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '100% 64px'}} />
      )}
      {texture && mode === 'teal' && (
        // blueprint graph paper: fine 32 px cells, a heavier line every 160 px
        <AbsoluteFill style={{
          backgroundImage: [
            'linear-gradient(rgba(170,235,225,0.16) 1.5px, transparent 1.5px)', 'linear-gradient(90deg, rgba(170,235,225,0.16) 1.5px, transparent 1.5px)',
            'linear-gradient(rgba(170,235,225,0.07) 1px, transparent 1px)', 'linear-gradient(90deg, rgba(170,235,225,0.07) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '160px 160px, 160px 160px, 32px 32px, 32px 32px', backgroundPosition: '-1px -1px'}} />
      )}
      {texture && mode === 'coral' && (
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
 * Wraps a chapter's current scene so DarkPaper inside it draws that scene's desk. Without a DeskMap (every real render) it
 * passes the scene through untouched. `cuts` are the chapter's scene start frames (narration time), `t` its timeline.
 */
export const DeskScene: React.FC<{ch: string; cuts: Record<string, number>; t: DeskT; children: React.ReactNode}> = ({
  ch, cuts, t, children,
}) => {
  const map = React.useContext(DeskMapCtx);
  const f = useCurrentFrame();
  if (!map) return <>{children}</>;
  const key = Object.entries(cuts).filter(([, at]) => at <= f).sort((a, b) => a[1] - b[1]).pop()?.[0] ?? '';
  const e = map.scenes[`${ch}.${key}`] ?? 'black';
  const mode = typeof e === 'string' ? e : e(t).reduce<DeskMode>((m, [at, md]) => (f >= at ? md : m), 'black');
  return <DeskCtx.Provider value={{mode, texture: map.texture}}>{children}</DeskCtx.Provider>;
};

/** True inside a TestColor composition (lets a chapter add a test-only cut, e.g. the "That's step one" hold). */
export const useDeskTest = () => React.useContext(DeskMapCtx) !== null;
