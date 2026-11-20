// The Gilded Age brand pieces (projects/Gilded_Age/ep5/edit/title.js, brand.js, cards.js, edit.html on origin/gilded), ported to
// Remotion. Numbers are the Gilded Age's own unless a comment says otherwise.
//  - TitleIntro: the condensed Chunk intro and the title in one card. The logo assembles centred at 1.4x, locks by ~2.8 s, lifts,
//    and the title lands under it (orange torn strip, the subtitle in cream Abril, a teal mono line).
//  - MarkSnap: the 2 s mark snap between chapters. Flat: the teal mark is already there, the coral quarter swings in from -110
//    degrees with a small overshoot and locks at 1.0 s.
//  - BatonCard: the next chapter's title on a torn orange strip, slammed in over the dimmed picture, held 2.6 s.
//  - EndSlots: the 20 s end screen, slots sized to YouTube Studio's end-screen elements (614x345 video cards, 298 px circle).
//  - SAFE + SafeText: the 8% title-safe area (x 154 to 1766, y 86 to 994); text marked data-tx is nudged back inside it.
// Sound: the brand's clicks, the one exception to this video's no-sound-effects rule (the user, Nov 20 2026: "we are missing the
// clicks on the Chunk logo animation"). Played with <Audio> here, never through Sfx (common.tsx), which stays silent. Clicks only:
//  - TitleIntro: sfx/chunk_intro_clicks.wav (tools/intro_clicks.py), the jingle's clicks sliced one by one and put on the
//    frame each block / the coral quarter / CHUNK / HISTORY actually arrives at 1.4x (table in that script). Full volume, as the
//    Gilded Age plays chunk_jingle.mp3 (assemble.sh: no volume filter, trimmed at 3.1 s before the page turn).
//  - MarkSnap: sfx/chunk_snap.wav at 0.3, trimmed at 1.2 s with a 0.1 s fade (the Gilded Age's brk card); its click-clack at
//    0.99 s is the coral quarter's lock at 1.0 s.
//  - BatonCard: chunk_snap at 0.3 too, because the Gilded Age has it on every baton (mix/chNN.sh SFX="chunk_snap@0.3@<cardAt>").
//    Here its click is moved onto the slam's landing; BATON_CLICK = false turns it off.
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {INK, JF} from './Kit';
import {DarkPaper} from './common';
import {IntroScene, Stage} from './ChunkIntro';

const TEAL = '#2FE0C4';
const CORAL = '#FF6F61';
const ORANGE = '#FF9F1C';
const CREAM = '#F4EFE6';
const DESK = '#0d0c09';
const ease = Easing.inOut(Easing.cubic);
/** 0 -> 1 from second t0 over d seconds (edit.js fin), and 1 -> 0 from t1 (fout). */
const fin = (T: number, t0: number, d = 0.45) => Math.min(1, Math.max(0, (T - t0) / d));
const fout = (T: number, t1: number, d = 0.45) => 1 - Math.min(1, Math.max(0, (T - t1) / d));

// ------------------------------------------------------------------------------------------------------------------
// The 8% safe area
// ------------------------------------------------------------------------------------------------------------------

/** Title safe: 8% in from every edge of 1920 x 1080 (lookdev README, Nov 18). */
export const SAFE = {x0: 154, x1: 1766, y0: 86, y1: 994};
/** Text further out than this is on its way in or out of frame (or belongs to a pushed-in shot): it is left alone. */
const NUDGE_MAX = 240;

/**
 * The title-safe pass (edit.html's safe()): every text element marked `data-tx` that sits partly outside the 8% safe area is
 * moved back inside it. Full-width centred lines are measured by their text, not their box. Wrap a chapter's picture in it.
 * Anything inside an element marked `data-nosafe` (a pushed-in cut, a document pan) is left where it is.
 */
export const SafeText: React.FC<{children: React.ReactNode}> = ({children}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, setReady] = useState(0);
  useCurrentFrame();
  // measure again once the fonts are in (the first frame can lay out before they load)
  useEffect(() => {
    const h = delayRender('safe-text fonts');
    document.fonts.ready.then(() => { setReady(1); requestAnimationFrame(() => continueRender(h)); });
  }, []);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-tx]')).filter((el) => !el.parentElement?.closest('[data-tx]') && !el.closest('[data-nosafe]'));
    els.forEach((el) => { el.style.translate = ''; });
    const c = root.getBoundingClientRect();
    const k = c.width / 1920 || 1; // the Studio preview is scaled; renders are 1:1
    const moved = new Map<HTMLElement, [number, number]>();
    // three passes: under a scaled or rotated parent one correction lands short, the next ones close the gap
    for (let pass = 0; pass < 3; pass++) {
      for (const el of els) {
        const rg = document.createRange();
        rg.selectNodeContents(el);
        const t = rg.getBoundingClientRect();
        const b = el.getBoundingClientRect();
        const wide = b.width / k > 1700;
        const r = wide ? t : {left: Math.min(t.left, b.left), right: Math.max(t.right, b.right), top: Math.min(t.top, b.top), bottom: Math.max(t.bottom, b.bottom)};
        const [l, rt, tp, bt] = [(r.left - c.left) / k, (r.right - c.left) / k, (r.top - c.top) / k, (r.bottom - c.top) / k];
        if (!(rt > l) || !(bt > tp)) continue;
        let dx = 0, dy = 0;
        if (rt - l <= SAFE.x1 - SAFE.x0) { if (rt > SAFE.x1) dx = SAFE.x1 - rt; if (l + dx < SAFE.x0) dx = SAFE.x0 - l; }
        if (bt - tp <= SAFE.y1 - SAFE.y0) { if (bt > SAFE.y1) dy = SAFE.y1 - bt; if (tp + dy < SAFE.y0) dy = SAFE.y0 - tp; }
        if (!dx && !dy) continue;
        const [ox, oy] = moved.get(el) ?? [0, 0];
        if (Math.abs(ox + dx) > NUDGE_MAX || Math.abs(oy + dy) > NUDGE_MAX) continue;
        moved.set(el, [ox + dx, oy + dy]);
        el.style.translate = `${(ox + dx).toFixed(1)}px ${(oy + dy).toFixed(1)}px`;
      }
    }
  });
  return <div ref={ref} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}>{children}</div>;
};

// ------------------------------------------------------------------------------------------------------------------
// The torn orange strip (lookdev/text.js tape())
// ------------------------------------------------------------------------------------------------------------------

const tornClip = (seed: number, depth = 9) => {
  const top: string[] = [], bot: string[] = [];
  for (let x = 0; x <= 100; x += 2.5) {
    top.push(`${x}% ${(random(`gt${seed}-${x}`) * depth).toFixed(1)}%`);
    bot.push(`${100 - x}% ${(100 - depth + random(`gb${seed}-${x}`) * depth).toFixed(1)}%`);
  }
  return `polygon(${top.join(',')},${bot.join(',')})`;
};

/** Abril on the channel's torn orange strip: padding 16% / 22% / 10% of the type size, tilted -2 degrees. Not positioned. */
export const Tape: React.FC<{text: string; size?: number; rot?: number; seed?: number}> = ({text, size = 84, rot = -2, seed = 3}) => (
  <div data-tx style={{transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.5))'}}>
    <div style={{background: ORANGE, clipPath: tornClip(seed), padding: `${size * 0.16}px ${size * 0.22}px ${size * 0.1}px`}}>
      <div style={{fontFamily: JF.display, fontSize: size, lineHeight: 1, color: INK, whiteSpace: 'nowrap'}}>{text}</div>
    </div>
  </div>
);

/** The largest type size (up to `max`) at which a strip of this text stays inside the safe area's width (Abril runs ~0.6 em a letter). */
const fitSize = (text: string, max: number, width = SAFE.x1 - SAFE.x0 - 60) => Math.min(max, Math.floor(width / (text.length * 0.6 + 0.44)));

const Mono: React.FC<{text: string; size?: number; color?: string; ls?: number; style?: React.CSSProperties}> = ({text, size = 24, color = CREAM, ls = 5, style}) => (
  <div data-tx style={{position: 'absolute', fontFamily: JF.mono, fontSize: size, letterSpacing: ls, color, textTransform: 'uppercase', whiteSpace: 'nowrap', ...style}}>{text}</div>
);

// ------------------------------------------------------------------------------------------------------------------
// The Chunk mark, flat (brand.js)
// ------------------------------------------------------------------------------------------------------------------

const MARK_TEAL = 'M106 26 L106 3 L103 0 L31.2 0 L29.1 0.9 L0.9 29.1 L0 31.2 L0 103 L3 106 L24 106 L24 118 L3 118 L0 121 L0 192.8 L0.9 194.9 L29.1 223.1 L31.2 224 L103 224 L106 221 L106 200 L118 200 L118 221 L121 224 L192.8 224 L194.9 223.1 L223.1 194.9 L224 192.8 L224 121 L221 118 L198 118 L197 117 L107 117 L107 81 L104 78 L81 78 L78 81 L78 143 L81 146 L143 146 L146 143 L146 135 L152 129 L178 129 L184 135 L184 178 L178 184 L46 184 L40 178 L40 46 L46 40 L104 40 L107 37 L107 27 Z';
const MARK_CORAL = 'M118 26 L117 27 L117 37 L120 40 L178 40 L184 46 L184 89 L178 95 L152 95 L146 89 L146 81 L143 78 L120 78 L117 81 L117 104 L120 107 L197 107 L198 106 L221 106 L224 103 L224 31.2 L223.1 29.1 L194.9 0.9 L192.8 0 L121 0 L118 3 Z';

/** The mark centred on (cx, cy), `size` px across; `angle` turns the coral quarter about the mark's centre. An SVG group. */
export const ChunkMark: React.FC<{cx: number; cy: number; size: number; angle?: number; o?: number}> = ({cx, cy, size, angle = 0, o = 1}) => (
  <g transform={`translate(${cx - size / 2},${cy - size / 2}) scale(${size / 224})`} opacity={o}>
    <path d={MARK_TEAL} fill={TEAL} fillRule="evenodd" />
    <path d={MARK_CORAL} fill={CORAL} fillRule="evenodd" transform={`rotate(${angle.toFixed(2)} 112 112)`} />
  </g>
);

/** The mark snap is 2 s. */
export const SNAP_FRAMES = 60;

/** chunk_snap.wav: the Gilded Age level (0.3), and its click-clack's offset in the file (0.994 s, measured; make_jingle.py puts it at 0.99). */
const SNAP_VOL = 0.3;
const SNAP_CLICK = 30;
/** chunk_snap.wav cut as the Gilded Age cuts it: 1.2 s, the last 0.1 s faded (assemble.sh brk). Starts at the Sequence's frame 0. */
const SnapClick: React.FC = () => (
  <Sequence durationInFrames={36} layout="none">
    <Audio src={staticFile('sfx/chunk_snap.wav')} volume={(f) => SNAP_VOL * interpolate(f, [33, 36], [1, 0], clamp)} />
  </Sequence>
);

/** The 2 s mark snap between chapters: black, the teal mark already there, the coral quarter swings in and locks at 1.0 s on the click-clack. */
export const MarkSnap: React.FC = () => {
  const T = useCurrentFrame() / 30;
  const u = Math.min(1, Math.max(0, T / 1.0));
  const back = 1.70158 * 1.3; // ease-out-back: a small overshoot as it locks
  const k = 1 + (back + 1) * Math.pow(u - 1, 3) + back * Math.pow(u - 1, 2);
  const o = fin(T, 0.05, 0.25) * fout(T, 1.65, 0.3);
  return (
    <AbsoluteFill style={{background: '#0b0b0b'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <ChunkMark cx={960} cy={540} size={230} angle={-110 * (1 - k)} o={o} />
      </svg>
      <SnapClick />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// The condensed intro + title card (title.js)
// ------------------------------------------------------------------------------------------------------------------

/** The logo assembles at 1.4x the brand intro's speed. */
const INTRO_SPEED = 1.4;
/** The Gilded Age card runs 4.2 s, which leaves its title 1.25 s on screen. This video's title is a full phrase and a subtitle,
 *  so the card holds longer: the reading-time rule (Nov 19: every text fully readable for at least 2.5 s, plus 0.25 s a word
 *  beyond five) gives the six-word subtitle 2.75 s once it has faded in, so the card runs 6.6 s. 4.2 is the Gilded Age's length. */
export const TITLE_SECONDS = 6.6;
export const TITLE_INTRO_FRAMES = Math.round(TITLE_SECONDS * 30);

/** The intro's clicks, each on its piece's arrival at INTRO_SPEED (built by tools/intro_clicks.py; regenerate it if INTRO_SPEED or
 *  ChunkIntro's MARK_LAND / WM_LAND / FLIGHT change). Output frames, 30 fps, with the jingle click each one is cut from:
 *    block 1-5   17.16  27.16  34.30  40.01  44.30   (1.20 1.67 2.00 2.27 2.47 s)
 *    quarter     51.44  click-clack                  (2.79 s)
 *    CHUNK       68.59                               (3.60 s)
 *    HISTORY     76.44 HIS, 78.37 TO, 80.30 RY       (3.95 4.04 4.13 s; one slab, so HIS lands with it and TO, RY follow 1.4x)  */
export const INTRO_CLICKS = 'sfx/chunk_intro_clicks.wav';

/** The channel intro and the title in one card: the logo assembles centred, locks by ~2.8 s, lifts, and the title lands under it. */
export const TitleIntro: React.FC<{title: string; subtitle: string; line?: string}> = ({title, subtitle, line}) => {
  const T = useCurrentFrame() / 30;
  const u = ease(Math.min(1, Math.max(0, (T - 2.75) / 0.45))); // the lift
  const tapeIn = fin(T, 2.95, 0.3);
  const out = fout(T, TITLE_SECONDS - 0.35, 0.35);
  const size = fitSize(title, 150);
  return (
    <AbsoluteFill style={{background: DESK}}>
      <AbsoluteFill style={{opacity: out}}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 75% at 50% 45%, #1b1b1b 0%, #121212 60%, #0b0b0b 100%)'}} />
        <AbsoluteFill style={{transform: `translateY(${(-250 * u).toFixed(1)}px) scale(${(1 - 0.28 * u).toFixed(3)})`, transformOrigin: '960px 540px'}}>
          <Stage opacity={1} bare><IntroScene speed={INTRO_SPEED} max={185} /></Stage>
        </AbsoluteFill>
        {T > 2.9 && (
          <div style={{position: 'absolute', left: 0, top: 470, width: 1920, display: 'flex', justifyContent: 'center', opacity: tapeIn, transform: `translateY(${((1 - ease(tapeIn)) * 40).toFixed(1)}px)`}}>
            <Tape text={title} size={size} seed={131} />
          </div>
        )}
        <div data-tx style={{position: 'absolute', left: 0, top: 720, width: 1920, textAlign: 'center', fontFamily: JF.display, fontSize: Math.min(84, Math.floor(2900 / subtitle.length)), color: CREAM,
          opacity: fin(T, 3.1, 0.3)}}>{subtitle}</div>
        {line && <Mono text={line} size={28} color={TEAL} ls={6} style={{left: 0, top: 860, width: 1920, textAlign: 'center', opacity: fin(T, 3.2, 0.3)}} />}
      </AbsoluteFill>
      <Sequence durationInFrames={93} layout="none"><Audio src={staticFile(INTRO_CLICKS)} /></Sequence>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// The baton card (cards.js)
// ------------------------------------------------------------------------------------------------------------------

/** A baton card holds 2.6 s: about 2 s after its words, 2.5 s of reading. */
export const CARD_HOLD = 78;

/** chunk_snap under each baton card, as the Gilded Age has it (false: silent cards). */
export const BATON_CLICK = true;
/** The slam lands (scale 1.12 -> 1) 0.16 s after `at`: the snap's click-clack goes there. */
const SLAM = 5;

/** The next chapter's title on a torn orange strip, slammed in at frame `at` over the dimmed picture; it holds to the chapter's end. */
export const BatonCard: React.FC<{title: string; at: number}> = ({title, at}) => {
  const f = useCurrentFrame();
  const click = BATON_CLICK && <Sequence from={at + SLAM - SNAP_CLICK} layout="none"><SnapClick /></Sequence>;
  if (f < at) return <>{click}</>;
  const T = (f - at) / 30;
  const u = Math.min(1, T / 0.16);
  return (
    <AbsoluteFill>
      {click}
      <AbsoluteFill style={{background: `rgba(13,12,9,${(0.62 * Math.min(1, T / 0.12)).toFixed(3)})`}} />
      <AbsoluteFill style={{transform: `scale(${(1.12 - 0.12 * ease(u)).toFixed(4)})`, transformOrigin: '960px 540px', opacity: Math.min(1, u * 2)}}>
        <div style={{position: 'absolute', left: 0, top: 460, width: 1920, display: 'flex', justifyContent: 'center'}}>
          <Tape text={title} size={fitSize(title, 132)} seed={300 + title.length} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// The end screen (brand.js)
// ------------------------------------------------------------------------------------------------------------------

/** The end screen is 20 s. */
export const END_SCREEN_FRAMES = 20 * 30;
/** YouTube Studio's end-screen elements at 1920x1080: two 614x345 video or playlist cards, 80 px apart, and a 298 px subscribe
 *  circle, all inside the 10% margin (x 192 to 1728, y 108 to 972). Drop the elements straight onto the boxes. */
const VW = 614, VH = 345, GAP = 80, X0 = (1920 - 2 * VW - GAP) / 2, VY = 250;
export const END_SLOTS = {
  videoA: {x: X0, y: VY, w: VW, h: VH},
  videoB: {x: X0 + VW + GAP, y: VY, w: VW, h: VH},
  subscribe: {cx: 960, cy: 780, r: 149},
};

/** The end screen's picture from frame `at`: the desk, the mark, two video slots, the subscribe circle, three mono labels. */
export const EndSlots: React.FC<{at?: number; left?: string; right?: string}> = ({at = 0, left = 'watch next', right = 'more chunk history'}) => {
  const T = (useCurrentFrame() - at) / 30;
  const {videoA, videoB, subscribe: s} = END_SLOTS;
  return (
    <AbsoluteFill style={{background: DESK}}>
      <DarkPaper />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <ChunkMark cx={960} cy={132} size={96} o={fin(T, 0.2, 0.5)} />
        {[videoA, videoB].map((v, i) => <rect key={i} x={v.x} y={v.y} width={v.w} height={v.h} rx={6} fill="rgba(13,12,9,.55)" stroke={TEAL} strokeOpacity={0.35} strokeWidth={3} />)}
        <circle cx={s.cx} cy={s.cy} r={s.r} fill="rgba(13,12,9,.55)" stroke={CORAL} strokeOpacity={0.45} strokeWidth={3} />
      </svg>
      <Mono text={left} color={TEAL} style={{left: videoA.x, top: VY - 44, opacity: fin(T, 0.4, 0.5)}} />
      <Mono text={right} color={TEAL} style={{left: videoB.x, top: VY - 44, opacity: fin(T, 0.6, 0.5)}} />
      <Mono text="subscribe" ls={6} style={{left: 0, top: s.cy + s.r + 16, width: 1920, textAlign: 'center', opacity: fin(T, 0.8, 0.5)}} />
    </AbsoluteFill>
  );
};
