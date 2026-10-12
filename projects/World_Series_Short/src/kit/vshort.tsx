// Shared pieces for standalone native vertical Shorts (1080x1920): captions, wordmark, topic strip, counter,
// case-file folder, typed index card, a sideways phone that plays a clip, and the like/subscribe end card.
//
// Phone safe zones: YouTube's UI covers the top ~150 px, the bottom ~400 px, and the right ~150 px from y 900 down.
// Scene text stays in x 60–930, y 150–1150; captions sit at y ~1185; source tags at y ~1490.
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import type {Narration, Word} from '../lib/timing';
import {Arrow, Highlight, JF, Note, usePal, useGFrame} from './Kit';
import {DarkPaper} from './common';
import {Wordmark} from './Intro';
import type {TL} from './shell';

export const FPS = 30;
export const FRAME: [number, number] = [1080, 1920];
export const TAG_Y = 1490;

/** Open a beat of silence before the word `at` (e.g. "Thanks" for the subscribe line). */
export const withBeat = (n: Narration, at: string, beat: number) => {
  const split = n.words.findIndex((w) => w.w === at);
  const cut = (n.words[split - 1].e + n.words[split].s) / 2;
  const narr: Narration = {voice: n.voice, duration: n.duration + beat, words: n.words.map((w, i): Word => (i < split ? w : {...w, s: w.s + beat, e: w.e + beat}))};
  return {narr, cut, lastWordEnd: n.words[n.words.length - 1].e + beat};
};

/** Captions: three words at a time, the spoken word in orange; never across the end of a sentence. */
export const Captions: React.FC<{n: Narration; until: number}> = ({n, until}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (f >= until) return null;
  const i = n.words.findIndex((w) => w.e >= t - 0.05);
  if (i < 0 || t < n.words[0].s - 0.1) return null;
  if (t < n.words[i].s - 0.6) return null; // a long pause: clear the line
  const chunks: number[] = [0];
  n.words.forEach((w, k) => {
    if (k === 0) return;
    if (k - chunks[chunks.length - 1] >= 3 || /[.?!:]["”]?$/.test(n.words[k - 1].w)) chunks.push(k);
  });
  const start = chunks.filter((c) => c <= i).pop() ?? 0;
  const end = chunks.find((c) => c > i) ?? n.words.length;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 1130, width: 1080, height: 360, background: 'linear-gradient(180deg, rgba(8,7,5,0) 0%, rgba(8,7,5,0.75) 30%, rgba(8,7,5,0.75) 75%, rgba(8,7,5,0) 100%)'}} />
      <div style={{position: 'absolute', left: 50, width: 900, top: 1185, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px'}}>
        {n.words.slice(start, end).map((w, k) => (
          <span key={k} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 88, lineHeight: 1.2, textTransform: 'uppercase',
            color: start + k === i ? '#FF9F1C' : '#f4efe6', textShadow: '0 5px 0 #0d0c09, 0 0 18px rgba(0,0,0,0.95)'}}>{w.w.replace(/[{}*"“”]/g, '')}</span>
        ))}
      </div>
    </>
  );
};

/** Small wordmark, top-left (YouTube puts its own icons top-right). */
export const Mark: React.FC = () => {
  const s = 0.2;
  return (
    <div style={{position: 'absolute', left: 40, top: 40, width: 1440 * s, height: 530 * s, overflow: 'hidden', borderRadius: 12, background: 'rgba(13,12,9,0.7)'}}>
      <div style={{position: 'absolute', left: -170 * s, top: -275 * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Wordmark clockAt={-90} numAt={-90} minAt={-90} hisAt={-90} />
      </div>
    </div>
  );
};

/** The topic strip: a thin orange tape title that stays up all the way through. */
export const TopicStrip: React.FC<{text: string; until: number; underlineAt?: number}> = ({text, until, underlineAt}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f >= until) return null;
  const u = underlineAt === undefined ? 0 : interpolate(f, [underlineAt, underlineAt + 8], [0, 1], clamp);
  return (
    <>
      <Highlight text={text} x={50} y={168} size={44} at={2} seed={61} rot={-1.5} />
      {underlineAt !== undefined && (
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1080} height={400}>
          <path d="M70,248 C300,240 600,252 905,236" fill="none" stroke={pal.mark} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
        </svg>
      )}
    </>
  );
};

/** A number that climbs (or falls) as it's spoken, stepping at 12 fps. */
export const Counter: React.FC<{from: number; to: number; a: number; b: number; x: number; y: number; size?: number; prefix?: string; suffix?: string; round?: number; out?: number; color?: string}> = ({
  from, to, a, b, x, y, size = 150, prefix = '', suffix = '', round = 10, out = 1e7, color,
}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  if (f < a || f >= out) return null;
  const g = Math.floor(f / 2.5) * 2.5;
  const v = Math.round(interpolate(g, [a, b], [from, to], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)}) / round) * round;
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.display, fontSize: size, lineHeight: 1, color: color ?? pal.mark, whiteSpace: 'nowrap',
      textShadow: '0 6px 22px rgba(0,0,0,0.85), 0 0 4px #111'}}>{prefix}{v.toLocaleString('en-US')}{suffix}</div>
  );
};

/** The case file: a manila folder lying open on the desk; documents are dropped onto it. */
export const Folder: React.FC<{at: number; label: string}> = ({at, label}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 6], [1.06, 1], clamp);
  const o = interpolate(f, [at, at + 4], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 40, top: 260, width: 1000, height: 1020, opacity: o, transform: `scale(${k}) rotate(-1deg)`}}>
      <div style={{position: 'absolute', left: 40, top: 0, width: 600, height: 70, background: '#b89a63', borderRadius: '14px 14px 0 0'}} />
      <div style={{position: 'absolute', left: 0, top: 56, width: 1000, height: 964, background: 'linear-gradient(160deg, #c7a974 0%, #a8894f 100%)', borderRadius: 10,
        boxShadow: '0 30px 60px rgba(0,0,0,0.7), inset 0 0 80px rgba(60,40,10,0.35)'}} />
      <div style={{position: 'absolute', left: 70, top: 14, fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: '#2b2113', whiteSpace: 'nowrap'}}>{label}</div>
    </div>
  );
};

/** A typed index card; lines type on one after another (each [text, frame]). */
export const IndexCard: React.FC<{x: number; y: number; w: number; at: number; lines: [string, number][]; rot?: number; size?: number}> = ({x, y, w, at, lines, rot = -2, size = 40}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 6], [1.08, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `scale(${k}) rotate(${rot}deg)`, background: '#f1ead9', padding: '34px 40px 30px',
      boxShadow: '0 24px 50px rgba(0,0,0,0.7)', backgroundImage: 'linear-gradient(transparent 0 70px, #d26b5e 70px 73px, transparent 73px), repeating-linear-gradient(transparent 0 57px, rgba(80,120,170,0.35) 57px 59px)'}}>
      {lines.map(([text, t], i) => {
        const n = Math.floor(interpolate(f, [t, t + Math.max(6, text.length * 0.6)], [0, text.length], clamp));
        return <div key={i} style={{fontFamily: JF.mono, fontSize: size, lineHeight: '58px', color: '#1d1a14', whiteSpace: 'nowrap', minHeight: 58}}>{f >= t ? text.slice(0, n) : ''}</div>;
      })}
    </div>
  );
};

/** A phone held sideways, drawn in teal; children render in its screen (w x h available via the render prop). */
export const PhoneWide: React.FC<{x: number; y: number; w: number; at: number; rot?: number; children?: (sw: number, sh: number) => React.ReactNode}> = ({x, y, w, at, rot = 0, children}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const h = w * 0.62;
  const draw = interpolate(g, [at, at + 10], [0, 1], clamp);
  const fill = interpolate(g, [at + 6, at + 12], [0, 1], clamp);
  const boil = Math.floor(g / 5);
  const sx = w * 0.1, sy = w * 0.035;
  const sw = w - 2 * sx, sh = h - 2 * sy;
  const j = (s: string, a = 3) => (random(`${s}${boil}`) - 0.5) * a;
  const stroke = {fill: 'none', stroke: pal.mark, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw};
  const r = h * 0.14;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`}}>
      <div style={{position: 'absolute', left: sx, top: sy, width: sw, height: sh, borderRadius: 10, background: '#000', opacity: fill, overflow: 'hidden'}}>
        {children?.(sw, sh)}
      </div>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={w} height={h}>
        <rect x={3 + j('a')} y={3 + j('b')} width={w - 6} height={h - 6} rx={r} {...stroke} />
        <rect x={sx - 3 + j('c')} y={sy - 3 + j('d')} width={sw + 6} height={sh + 6} rx={12} {...stroke} strokeWidth={4} />
        <path d={`M${sx * 0.5},${h * 0.38} L${sx * 0.5 + j('e')},${h * 0.62}`} {...stroke} />
      </svg>
    </div>
  );
};

/** A still filling a phone screen (cover). */
export const ScreenStill: React.FC<{src: string; sw: number; sh: number; filter?: string}> = ({src, sw, sh, filter}) => (
  <Img src={staticFile(src)} style={{width: sw, height: sh, objectFit: 'cover', filter}} />
);

/** End card: points at YouTube's own like button (right rail) and Subscribe button (by the channel name). */
export const EndCard: React.FC<{t: TL; start?: string; thanks?: boolean}> = ({t, start = 'Thanks', thanks = true}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const a = t.at(start) - 10;
  if (f < a) return null;
  const like = t.at('tap like');
  const sub = t.at('and subscribe');
  const there = t.at('right there');
  const wig = (k: number) => (f >= there && f < there + 12 ? Math.sin(Math.floor((f - there) / 2.5) * 2) * k : 0);
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [a, a + 8], [0, 1], clamp)}}>
      <DarkPaper />
      <div style={{position: 'absolute', left: 90, top: 330, width: 1920, height: 1080, transform: 'scale(0.47)', transformOrigin: '0 0'}}>
        <Wordmark clockAt={a} numAt={a + 4} minAt={a + 8} hisAt={a + 12} />
      </div>
      {thanks && <Note text="thanks for watching." x={110} y={300} size={64} rot={-3} at={t.at(start)} color="#ffffff" />}
      <Note text="tap like" x={470} y={760} size={78} rot={-4} at={like - 2} color={pal.subject} />
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${wig(6)}px, ${wig(-4)}px)`}}>
        <Arrow x1={640} y1={850} x2={905} y2={950} bow={-50} width={8} at={like + 2} dur={8} />
      </div>
      <Note text="subscribe" x={160} y={1080} size={78} rot={-4} at={sub - 2} color={pal.subject} />
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${wig(-4)}px, ${wig(6)}px)`}}>
        <Arrow x1={380} y1={1180} x2={540} y2={1420} bow={40} width={8} at={sub + 4} dur={8} />
      </div>
    </AbsoluteFill>
  );
};
