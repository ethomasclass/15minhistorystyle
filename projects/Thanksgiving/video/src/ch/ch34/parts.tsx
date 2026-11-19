// Pieces shared by chapters 3 and 4 (the turtle chapters). Chapter-local: not kit files.
//   Crop        a window onto a scan (source px box), at a given screen width; children in source px (Swipe, Loop)
//   PageScrap   a Crop as a torn print slapped onto the desk, with its source tag under it
//   AssetOr     an image (contain-fitted) when the file exists in public/, else a labelled placeholder (tg_placeholder Ph)
//   FrameSeqOr  a Flow frame sequence (img/.../name_0000.png …) played at 12/s, else a placeholder with a stepped frame counter
//   SIMMONS_P2, SIMMONS_P22, MINCE, BOSTON: the scans' sizes and the line boxes measured on them (source px)
import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../../lib/anim';
import {JF, useGFrame} from '../../kit/Kit';
import {hasFile} from '../../kit/shell';
import {Ph} from '../../kit/tg_placeholder';
import {type Box, tornPoly} from '../../kit/vox';

export const BW_DOC = 'grayscale(1) sepia(0.12) contrast(1.15) brightness(1.02)';

/** Amelia Simmons, American Cookery (1796), the page with "To Dress a Turtle" (page 20). */
export const SIMMONS_P2 = {
  src: 'img/arch/simmons-1796-to-dress-a-turtle-p2.jpg',
  /** p. 21, the turtle recipe continued (the file named "_p1" is p. 19 and has no turtle on it: don't use it) */
  p21: 'img/arch/simmons-1796-to-dress-a-turtle-p21.jpg',
  size: [3504, 4762] as [number, number],
  p21size: [3306, 4745] as [number, number],
  heading: [1490, 2858, 730, 86] as Box,
  /** "about 9 o'clock hang up your Turtle by the" / "hind fins, cut of the head and fave the blood," */
  quote: [[985, 3162, 1890, 84], [828, 3262, 1880, 84]] as Box[],
  /** the heading plus the four lines under it, for scraps */
  scrap: [770, 2840, 2160, 520] as Box,
};
/** Simmons p. 22: the end of the turtle (Madeira), then "To dress a Calve's Head. Turtle fashion." */
export const SIMMONS_P22 = {
  src: 'img/arch/simmons-1796-calves-head-turtle-fashion-p22.jpg',
  size: [3504, 4762] as [number, number],
  heading: [960, 1330, 1620, 100] as Box,
  /** "The head and feet being well fcalded and cleaned," */
  head: [840, 1432, 1990, 92] as Box,
  /** "open the head, taking the brains," */
  brains: [745, 1532, 1310, 92] as Box,
  scrap: [700, 1290, 2300, 1300] as Box,
};
export const MINCE = {
  src: 'img/arch/simmons-1796-minced-pies.jpg',
  size: [3306, 4816] as [number, number],
  scrap: [640, 3270, 2580, 960] as Box,
  heading: [1200, 3292, 1040, 76] as Box,
  feet: [770, 3384, 570, 78] as Box,       // "Scald neets feet"
  suet: [[2380, 3792, 370, 78], [680, 3892, 360, 78]] as Box[], // "pound of" / "beef fuet,"
  apples: [1770, 3892, 330, 78] as Box,    // "apple raw"
  wine: [2000, 3992, 720, 78] as Box,      // "one quart of wine,"
  raisins: [1150, 4092, 580, 78] as Box,   // "ftoned raifins,"
};
/** Mrs. Lincoln's Boston Cook Book (1884), p. 137: Mock Turtle Soup. */
export const BOSTON = {
  src: 'img/arch/mock-turtle-soup-boston-cook-book-1884.jpg',
  size: [1359, 2058] as [number, number],
  heading: [526, 1356, 334, 40] as Box,    // "Mock Turtle Soup."
  head: [243, 1424, 200, 36] as Box,       // "1 calf's head."
  brains: [392, 1845, 594, 40] as Box,     // "Remove the brains and tongue."
  scrap: [170, 1330, 1040, 580] as Box,
};

export const TAG_SIMMONS = 'Amelia Simmons, American Cookery, Hartford, 1796 · Library of Congress / Internet Archive';
export const TAG_BOSTON = "Mary J. Lincoln, Mrs. Lincoln's Boston Cook Book, 1884, p. 137 · Wellcome Collection / Internet Archive";

/** A window onto a scan: source box `box` shown `w` px wide. Children are drawn in source px. */
export const Crop: React.FC<{src: string; size: [number, number]; box: Box; w: number; filter?: string; children?: React.ReactNode}> = ({src, size, box: [sx, sy, sw, sh], w, filter = BW_DOC, children}) => {
  const s = w / sw;
  return (
    <div style={{position: 'relative', width: w, height: sh * s, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -sx * s, top: -sy * s, width: size[0], height: size[1], transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: size[0], height: size[1], filter}} />
        {children}
      </div>
    </div>
  );
};

/** A torn scrap of a scan slapped onto the desk at (x, y), `w` wide, with an optional source tag under it. */
export const PageScrap: React.FC<{src: string; size: [number, number]; box: Box; x: number; y: number; w: number; at?: number; rot?: number; tag?: string; opacity?: number;
  seed?: string; children?: React.ReactNode}> = ({src, size, box, x, y, w, at = -999, rot = 0, tag, opacity = 1, seed = 'scrap', children}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = at < -900 ? 1 : interpolate(g, [at, at + 4, at + 7], [1.3, 0.96, 1], clamp);
  const h = (box[3] * w) / box[2];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: '50% 60%', opacity}}>
      <div style={{filter: 'drop-shadow(0 22px 30px rgba(0,0,0,0.75))'}}>
        <div style={{clipPath: tornPoly(seed, w, h, 9)}}>
          <Crop src={src} size={size} box={box} w={w}>{children}</Crop>
        </div>
      </div>
      {tag ? <div style={{position: 'absolute', left: 0, top: h + 16, width: 'max-content', maxWidth: w + 60, fontFamily: JF.mono, fontSize: 16, letterSpacing: 1,
        color: 'rgba(244,239,230,0.75)', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)'}}>{tag}</div> : null}
    </div>
  );
};

/** The image (fitted inside the box, B&W unless `color`) once it exists, else a placeholder card in the same place. */
export const AssetOr: React.FC<{src: string; what: string; x: number; y: number; w: number; h: number; at?: number; out?: number; color?: boolean; land?: 'rise' | 'slap' | 'drop' | 'none';
  children?: React.ReactNode}> = ({src, what, x, y, w, h, at = -999, out = Infinity, color = true, land = 'none', children}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  if (hasFile(src)) {
    return (
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'contain', filter: `${color ? 'saturate(0.9)' : 'grayscale(1) contrast(1.15)'} drop-shadow(0 22px 26px rgba(0,0,0,0.7))`}} />
        {children}
      </div>
    );
  }
  return <Ph file={src} what={what} x={x} y={y} w={w} h={h} at={at} land={land} shadow>{children}</Ph>;
};

/**
 * A Flow frame sequence `${base}_0000.png` … (`n` drawings) played at 12/s from `from` to `to` (stretched or held to fit),
 * then held on its last drawing. Until the frames exist, a placeholder card with the file pattern and a stepped counter.
 */
export const FrameSeqOr: React.FC<{base: string; n: number; what: string; x: number; y: number; w: number; h: number; from: number; to: number; labels?: [string, string]}> = ({
  base, n, what, x, y, w, h, from, to, labels,
}) => {
  const g = useGFrame();
  const p = interpolate(g, [from, to], [0, 1], clamp);
  const i = Math.min(n - 1, Math.floor(p * n));
  const file = `${base}_${String(i).padStart(4, '0')}.png`;
  if (hasFile(`${base}_0000.png`)) {
    return <Img src={staticFile(file)} style={{position: 'absolute', left: x, top: y, width: w, height: h, objectFit: 'contain', filter: 'saturate(0.9) drop-shadow(0 22px 26px rgba(0,0,0,0.7))'}} />;
  }
  return (
    <Ph file={`${base}_0000…${String(n - 1).padStart(4, '0')}.png`} what={what} x={x} y={y} w={w} h={h} land="none">
      {labels && (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center', gap: 30, fontFamily: JF.mono, fontSize: 24, letterSpacing: 2}}>
          <span style={{color: `rgba(244,239,230,${0.85 - 0.6 * p})`}}>{labels[0]}</span>
          <span style={{color: 'rgba(244,239,230,0.4)'}}>→</span>
          <span style={{color: `rgba(244,239,230,${0.25 + 0.6 * p})`}}>{labels[1]}</span>
          <span style={{color: 'rgba(244,239,230,0.45)'}}>{`[${i + 1}/${n}]`}</span>
        </div>
      )}
    </Ph>
  );
};
