// Building blocks shared by the Bierce chapters, on top of the Reform Era kit (jh/Kit.tsx).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, getStaticFiles, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import type {Narration, Timeline} from '../lib/timing';
import {boxOf, Finish, JF, type MaskData, Note, Tag, Tint, Traced, useGFrame, usePal} from '../jh/Kit';
import {DarkPaper, Sfx, WRITE} from './common';

/** Is this file in public/ (e.g. a Gemini image or a Suno cue that has not arrived yet)? */
const FILES = new Set(getStaticFiles().map((f) => f.name));
export const has = (path: string) => FILES.has(path);

/** Fetch a JSON file from public/ once, holding the render until it arrives. */
const useJson = <T,>(path: string | null): T | null => {
  const [data, setData] = useState<T | null>(null);
  const [handle] = useState(() => (path ? delayRender(`json ${path}`) : null));
  useEffect(() => {
    if (!path || handle === null) return;
    fetch(staticFile(path)).then((r) => r.json()).then((d) => { setData(d); continueRender(handle); });
  }, [path, handle]);
  return data;
};

/** Cover-fit placement of a w x h picture in the 1920 x 1080 frame, with a zoom about (fx, fy). */
const cover = (w: number, h: number, z: number, fx = 0.5, fy = 0.5) => {
  const scale = Math.max(1920 / w, 1080 / h) * z;
  return {left: 960 - w * scale * fx, top: 540 - h * scale * fy, scale};
};

/**
 * A Gemini illustration (public/img/gen/<name>.png). Until it arrives, a labelled placeholder
 * holds its place. Once its mask pass has been traced (tools/trace.py fromfile ... <name>), the
 * magenta subject is tinted coral and outlined in teal; `quiet` keeps the outline only.
 */
export const Gen: React.FC<{name: string; t0: number; t1: number; z0?: number; z1?: number; fx?: number; fy?: number; trace?: number; quiet?: boolean; brightness?: number}> = ({
  name, t0, t1, z0 = 1.03, z1 = 1.1, fx = 0.5, fy = 0.5, trace, quiet, brightness = 0.97,
}) => {
  const frame = useCurrentFrame();
  const src = `img/gen/${name}.png`;
  const maskJson = `img/jh/masks/${name}.json`;
  const m = useJson<MaskData>(has(src) && has(maskJson) ? maskJson : null);
  if (!has(src)) {
    return (
      <AbsoluteFill>
        <DarkPaper />
        <div style={{position: 'absolute', left: 160, top: 140, width: 1600, height: 800, border: '4px dashed rgba(47,224,196,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18}}>
          <div style={{fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color: 'rgba(255,255,255,0.7)'}}>GEMINI IMAGE PENDING</div>
          <div style={{fontFamily: JF.mono, fontSize: 40, color: '#2FE0C4'}}>{name}.png</div>
        </div>
      </AbsoluteFill>
    );
  }
  const z = interpolate(frame, [t0, t1], [z0, z1], clamp);
  const size: [number, number] = m ? m.size : [2752, 1536];
  const place = cover(size[0], size[1], z, fx, fy);
  const style: React.CSSProperties = {position: 'absolute', left: place.left, top: place.top, width: size[0] * place.scale, height: size[1] * place.scale};
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{...style, filter: `grayscale(1) contrast(1.25) brightness(${brightness})`}} />
      {m && m.shapes.magenta && !quiet && <Tint mask={`img/jh/masks/${name}_magenta_a.png`} place={place} size={size} />}
      {m && m.shapes.magenta && trace !== undefined && <Traced paths={m.shapes.magenta} place={place} at={trace} dur={12} part={0.9} />}
      {m && m.shapes.green && trace !== undefined && <Traced paths={m.shapes.green} place={place} at={trace + 6} dur={12} part={0.9} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)'}} />
    </AbsoluteFill>
  );
};

/** A full-bleed archival picture in black and white with a slow push-in. */
export const Full: React.FC<{src: string; t0: number; t1: number; z0?: number; z1?: number; fx?: number; fy?: number; w: number; h: number; bw?: string; fit?: 'cover' | 'contain'; tag?: string; tagTop?: boolean; panX?: [number, number]}> = ({
  src, t0, t1, z0 = 1.03, z1 = 1.12, fx = 0.5, fy = 0.5, w, h, bw = 'grayscale(1) contrast(1.3) brightness(0.97)', fit = 'cover', tag, tagTop, panX,
}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [t0, t1], [z0, z1], clamp);
  const px = panX ? interpolate(frame, [t0, t1], panX, {...clamp, easing: Easing.inOut(Easing.quad)}) : fx;
  let place;
  if (fit === 'contain') {
    const s = Math.min(1920 / w, 1080 / h) * z;
    place = {left: 960 - (w * s) / 2, top: 540 - (h * s) / 2, scale: s};
  } else place = cover(w, h, z, px, fy);
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      {fit === 'contain' && <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', filter: 'grayscale(1) blur(20px) brightness(0.42)'}} />}
      <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: w * place.scale, height: h * place.scale, filter: bw}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.68) 100%)'}} />
      {tag && <Tag text={tag} y={tagTop ? 40 : 1030} />}
    </AbsoluteFill>
  );
};

/** A quotation set large, each word lighting up as the narrator says it. `from` = the phrase where the quote starts. */
export const Quote: React.FC<{t: Timeline; n: Narration; from: string; text: string; source: string; size?: number; y?: number; keys?: string[]; bg?: React.ReactNode}> = ({
  t, n, from, text, source, size = 76, y = 250, keys = [], bg,
}) => {
  const g = useGFrame();
  const pal = usePal();
  const i0 = t.idx(from);
  const words = text.split(' ');
  const last = n.words[Math.min(n.words.length - 1, i0 + words.length - 1)];
  return (
    <AbsoluteFill>
      {bg ?? <DarkPaper />}
      <div style={{position: 'absolute', left: 170, top: y, width: 1580, fontFamily: '"Playfair Display", serif', fontWeight: 900, fontSize: size, lineHeight: 1.22, color: '#f4efe6', textShadow: '0 3px 14px #000'}}>
        {words.map((w, i) => {
          const wd = n.words[Math.min(n.words.length - 1, i0 + i)];
          const on = interpolate(g, [wd.s * 30 - 3, wd.s * 30 + 1], [0.14, 1], clamp);
          const key = keys.some((k) => w.toLowerCase().includes(k));
          return <span key={i} style={{opacity: on, color: key ? boxOf(pal) : undefined}}>{w} </span>;
        })}
      </div>
      <div style={{position: 'absolute', left: 176, top: 940, fontFamily: JF.mono, fontSize: 24, letterSpacing: 3, color: 'rgba(237,231,220,0.75)', opacity: interpolate(g, [last.e * 30, last.e * 30 + 6], [0, 1], clamp)}}>
        {source}
      </div>
    </AbsoluteFill>
  );
};

/** Vocabulary bar under a title: the term in teal with syllable dots, then a plain definition. */
export const Def: React.FC<{term: string; text: string; x: number; y: number; at: number; w?: number}> = ({term, text, x, y, at, w = 1100}) => {
  const g = useGFrame();
  if (g < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, padding: '16px 26px', background: 'rgba(10,10,10,0.8)', fontFamily: JF.sans, fontWeight: 600, fontSize: 36, lineHeight: 1.35, color: '#fff', opacity: interpolate(g, [at, at + 6], [0, 1], clamp)}}>
      <span style={{color: '#2FE0C4'}}>{term}</span> · {text}
    </div>
  );
};

/** A word stamped on with a small overshoot (onomatopoeia, big numbers). */
export const Stamp: React.FC<{text: string; x: number; y: number; at: number; size?: number; rot?: number; color?: string; out?: number}> = ({text, x, y, at, size = 130, rot = -6, color, out = Infinity}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at || g >= out) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [1.4, 0.95, 1], clamp);
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: JF.display, fontSize: size, lineHeight: 1, color: color ?? boxOf(pal), transform: `rotate(${rot}deg) scale(${k})`, transformOrigin: 'left center', textShadow: '0 6px 24px rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>{text}</div>;
};

/** An orange strike through a note (a rejected idea). */
export const StrikeLine: React.FC<{x: number; y: number; w: number; at: number}> = ({x, y, w, at}) => {
  const g = useGFrame();
  const pal = usePal();
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  if (g < at) return null;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x},${y + 6} Q${x + w / 2},${y - 8} ${x + w},${y}`} fill="none" stroke={boxOf(pal)} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** The "lives" counter, top right (like the Reform Era scene counter). */
export const Lives: React.FC<{n: number; at: number; of?: string}> = ({n, at, of = '7'}) => {
  const g = useGFrame();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.3, 1], clamp);
  return (
    <div style={{position: 'absolute', right: 60, top: 46, fontFamily: JF.mono, fontSize: 34, color: '#fff', transform: `scale(${k})`, transformOrigin: 'right top', textShadow: '0 2px 10px #000'}}>
      LIFE <span style={{color: '#FF6F61'}}>{n}</span>/{of}
    </div>
  );
};

type Cut = [number, React.ReactNode];

/**
 * A chapter: hard cuts between scenes, narration, a music bed (if the cue has arrived), a whoosh
 * on every cut, a stamp under every highlight title and a marker stroke under every note.
 */
export const Chapter: React.FC<{cuts: Cut[]; audio: string; music?: string; musicVol?: number; frames: number; t: Timeline; stamps?: string[]; writes?: string[]; ticks?: string[]; booms?: string[]; extra?: React.ReactNode; vignette?: number}> = ({
  cuts, audio, music, musicVol = 0.15, frames, t, stamps = [], writes = [], ticks = [], booms = [], extra, vignette = 0.3,
}) => {
  const frame = useCurrentFrame();
  const scene = cuts.reduce<React.ReactNode>((acc, [f, node]) => (frame >= f ? node : acc), cuts[0][1]);
  const end = frames - 30;
  return (
    <AbsoluteFill style={{background: '#0d0c09'}}>
      {scene}
      <Finish vignette={vignette} />
      <Audio src={staticFile(audio)} />
      {music && has(music) && <Audio src={staticFile(music)} volume={(f) => interpolate(f, [0, 20, end - 10, end + 25], [0, musicVol, musicVol, 0], clamp)} />}
      {cuts.slice(1).map(([f], i) => <Sfx key={`w${i}`} at={f} src="sfx/whoosh.wav" volume={0.28} />)}
      {stamps.map((c) => <Sfx key={`s${c}`} at={t.at(c)} src="sfx/stamp.wav" volume={0.27} />)}
      {writes.map((c) => <Sfx key={`n${c}`} at={t.at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
      {ticks.map((c) => <Sfx key={`t${c}`} at={t.at(c)} src="sfx/tick.wav" volume={0.45} />)}
      {booms.map((c) => <Sfx key={`b${c}`} at={t.at(c)} src="sfx/boom.wav" volume={0.45} />)}
      {extra}
    </AbsoluteFill>
  );
};

export {Note};

/** A photo card with an orange label tab hanging off its bottom-left corner (the "wall of causes" card). */
export const TabCard: React.FC<{src: string; x: number; y: number; w: number; h: number; rot?: number; at: number; label: string; filter?: string; pos?: string}> = ({src, x, y, w, h, rot = 0, at, label, filter = 'grayscale(1) contrast(1.2)', pos = 'center'}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (u) => 1 - Math.pow(1 - u, 3) * (1 - 2.2 * u * (1 - u))});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2)}}>
      <div style={{background: '#f4efe6', padding: 10, boxShadow: '0 16px 30px rgba(0,0,0,0.6)'}}>
        <Img src={staticFile(src)} style={{width: '100%', height: h, objectFit: 'cover', objectPosition: pos, display: 'block', filter}} />
      </div>
      <div style={{position: 'absolute', left: 14, bottom: -24, background: boxOf(pal), fontFamily: JF.display, fontSize: 34, color: '#111', padding: '2px 12px', whiteSpace: 'nowrap'}}>{label}</div>
    </div>
  );
};

/** A music cue under part of a chapter (from/to in chapter frames), faded in and out; `skip` starts the cue that many
 * seconds in. Silent until the file arrives. */
export const MusicBed: React.FC<{src: string; from: number; to: number; vol?: number; fade?: number; skip?: number}> = ({src, from, to, vol = 0.15, fade = 20, skip = 0}) =>
  has(src) ? (
    <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
      <Audio src={staticFile(src)} startFrom={Math.round(skip * 30)} volume={(f) => interpolate(f, [0, fade, to - from - fade, to - from], [0, vol, vol, 0], clamp)} />
    </Sequence>
  ) : null;
