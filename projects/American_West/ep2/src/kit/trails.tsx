// Ep 2's layer of the series map (the same WestMap as Ep 1, src/kit/ch01_extra.tsx): the cattle trails, the railheads, the
// Long Walk, the 1868 Great Sioux Reservation and the Black Hills, in the same map pixels. Data: public/img/maps/ep2_trails.json
// (tools/build_trails.py; approximate routes, like any trail map). Plus the pre-cut props (public/img/props/cut/*.webp) for
// small things that stand on the map or a card (a longhorn walking a trail).
import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {clamp} from '../lib/anim';
import {PALETTES, useGFrame} from './Kit';
import {SHADOW} from '../samples/kit';
import {along, MStand, subLine, W_MAP, WApi} from './ch01_extra';
import TR from '../../public/img/maps/ep2_trails.json';

const PAL = PALETTES.locked;
type TrailData = {places: Record<string, [number, number]>; lines: Record<string, number[][]>; regions: Record<string, number[][]>};
const T = TR as unknown as TrailData;
/** Places: sanAntonio, austin, fortWorth, abilene, dodgeCity, sedalia, kansasCity, ogallala, fortBelknap, horsehead, fortSumner,
 *  denver, cheyenne, canyonDeChelly, fortDefiance, albuquerque, deadwood, blackHills, fortLaramie, helena, medora, dekalb,
 *  chicago, piedrasNegras, fortSmith, redRiverStation, doansCrossing, lead. */
export const TPL = T.places;
/** Lines: chisholm, western, shawnee, goodnightLoving (trails, south → north); kansasPacific, santaFe, kcToChicago (rail);
 *  longWalk; southToMexico; toTheHills; custer1874. */
export const TLINES = T.lines;
/** Regions: greatSioux1868, blackHills. Draw with MRegion from ch01_extra. */
export const TREGIONS = T.regions;

const polyD = (pts: number[][]) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');

/**
 * A cattle trail: a dusty dashed path (no rail ties, so it never reads as a railroad), drawn on from its south end.
 * Coral for the trail the beat is about, teal for the rest. `prog` overrides the draw-on.
 */
export const MTrail: React.FC<{api: WApi; pts: number[][]; at: number; dur?: number; prog?: number; color?: string; width?: number; opacity?: number}> = ({
  api, pts, at, dur = 30, prog, color, width = 9, opacity = 1,
}) => {
  const g = useGFrame();
  const p = prog ?? interpolate(g, [at, at + dur], [0, 1], clamp);
  if (p <= 0.001) return null;
  const c = color ?? PAL.mark;
  const [W, H] = W_MAP.size;
  const d = polyD(subLine(pts, p));
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transform: 'translateZ(2px)', opacity}}>
      <path d={d} fill="none" stroke={SHADOW} strokeWidth={api.px(width + 8)} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
      <path d={d} fill="none" stroke={c} strokeWidth={api.px(width * 2.4)} strokeLinecap="round" strokeLinejoin="round" opacity={0.18} />
      <path d={d} fill="none" stroke={c} strokeWidth={api.px(width)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${api.px(22)} ${api.px(12)}`} />
    </svg>
  );
};

/** A pre-cut prop (public/img/props/cut/<name>.webp) standing upright on the map at a point, `w` screen px wide. */
export const MProp: React.FC<{api: WApi; at: number[]; name: string; w: number; show?: number; out?: number; flip?: boolean}> = ({api, at, name, w, show = -999, out, flip}) => (
  <MStand api={api} at={at} show={show} out={out}>
    <Img src={staticFile(`img/props/cut/${name}.webp`)} style={{position: 'absolute', width: w, left: -w / 2, bottom: 0, transform: flip ? 'scaleX(-1)' : undefined,
      filter: 'drop-shadow(0 6px 6px rgba(0,0,0,0.7))'}} />
  </MStand>
);

/** The longhorn walking a trail: it rides the front of the draw-on (same at/dur as its MTrail), with a little trot bob. */
export const MHerd: React.FC<{api: WApi; pts: number[][]; at: number; dur?: number; w?: number; out?: number}> = ({api, pts, at, dur = 30, w = 120, out}) => {
  const g = useGFrame();
  const p = interpolate(g, [at, at + dur], [0, 1], clamp);
  if (g < at) return null;
  const [x, y] = along(pts, p);
  const [x2] = along(pts, Math.min(1, p + 0.02));
  const bob = p < 1 ? Math.abs(Math.sin(g * 0.9)) * 4 : 0;
  return (
    <MStand api={api} at={[x, y]} out={out}>
      <Img src={staticFile('img/props/cut/p2_longhorn.webp')} style={{position: 'absolute', width: w, left: -w / 2, bottom: bob,
        transform: x2 < x ? 'scaleX(-1)' : undefined, filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.75))'}} />
    </MStand>
  );
};
