// Render-time reading-time audit (tools/audit_text.mjs, ported from the Gilded Age ep5/edit/audit_text.mjs). With the input prop
// `audit`, every rendered frame logs one line `AUDIT {...}`: each piece of text that is fully readable on that frame, and each
// archival document / print (img/arch/...) in full view, with its box. The node side turns the samples into runs and flags SHORT.
//   fully readable: effective opacity >= 0.9 (fade-ins count only once done), not mid write-on (no positive clip-path inset on it or
//   an ancestor), at least 85% of its box inside the frame, and not covered at its centre by an opaque picture or panel.
import React, {useEffect} from 'react';
import {continueRender, delayRender, useCurrentFrame, useVideoConfig} from 'remotion';

type Hit = {k: string; doc?: 1; x: number; y: number; w: number; h: number};

const insetOpen = (cp: string) => {
  if (!cp.startsWith('inset(')) return true;
  const nums = (cp.slice(6).match(/-?[\d.]+(%|px)/g) || []).slice(0, 4);
  return nums.every((n) => parseFloat(n) <= (n.endsWith('%') ? 1.5 : 3));
};

const effOpacity = (el: Element | null): number => {
  let o = 1;
  for (let e = el; e && e !== document.body; e = e.parentElement) {
    const s = getComputedStyle(e);
    if (s.display === 'none' || s.visibility === 'hidden') return 0;
    o *= Number(s.opacity);
    if (s.clipPath && s.clipPath !== 'none' && !insetOpen(s.clipPath)) return 0;
  }
  return o;
};

const opaqueBlocker = (e: Element) => {
  if (/^(IMG|VIDEO|CANVAS)$/.test(e.tagName)) return effOpacity(e) > 0.75;
  const s = getComputedStyle(e);
  const m = s.backgroundColor.match(/rgba?\(([^)]+)\)/);
  const a = m ? (m[1].split(',').length === 4 ? Number(m[1].split(',')[3]) : 1) : 0;
  return a > 0.85 && effOpacity(e) > 0.75;
};

const covered = (el: Element, x: number, y: number) => {
  if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false;
  for (const e of document.elementsFromPoint(x, y)) {
    if (e === el || e.contains(el)) return false; // reached the element itself (or something it sits on)
    if (el.contains(e)) continue;
    if (opaqueBlocker(e)) return true;
  }
  return false;
};

// an element's box cut down by every ancestor that clips (overflow or clip-path): the part of a cropped page actually shown
const clippedRect = (el: Element) => {
  const r = el.getBoundingClientRect();
  let l = r.left, t = r.top, rr = r.right, b = r.bottom;
  for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
    const s = getComputedStyle(e);
    if (s.overflow === 'visible' && (!s.clipPath || s.clipPath === 'none')) continue;
    const q = e.getBoundingClientRect();
    if (q.width < 1 || q.height < 1) continue;
    l = Math.max(l, q.left); t = Math.max(t, q.top); rr = Math.min(rr, q.right); b = Math.min(b, q.bottom);
  }
  return new DOMRect(l, t, Math.max(0, rr - l), Math.max(0, b - t));
};

const inFrame = (r: DOMRect, W: number, H: number) => {
  const ix = Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)), iy = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0));
  return (ix * iy) / Math.max(1, r.width * r.height);
};

// where a numeric text sits in its own layout (its and its parent's left/top/size), unchanged by camera moves or by siblings mounting
const domPath = (el: Element) => {
  const sig = (e: Element | null) => { if (!e) return ''; const st = (e as HTMLElement).style; return st ? `${st.left}|${st.top}|${st.fontSize}` : ''; };
  return `${sig(el)}/${sig(el.parentElement)}`;
};

export const AuditProbe: React.FC = () => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  useEffect(() => {
    const h = delayRender('text-audit');
    document.fonts.ready.then(() => requestAnimationFrame(() => {
      const hits: Hit[] = [];
      document.querySelectorAll('body *').forEach((el) => {
        if (el.tagName === 'IMG') {
          const src = decodeURIComponent((el as HTMLImageElement).src || '');
          const m = src.match(/img\/arch\/([^/?]+)$/);
          if (!m) return;
          const r = clippedRect(el);
          if (r.width < 120 || r.height < 60) return;
          const fr = inFrame(r, W, H), frameCover = (Math.min(r.right, W) - Math.max(r.left, 0)) * (Math.min(r.bottom, H) - Math.max(r.top, 0)) / (W * H);
          if (fr < 0.6 && frameCover < 0.6) return;
          if (effOpacity(el) < 0.9) return;
          // in full view: at most two of five points (centre and the quarter points) under something opaque (a tape on a page is fine)
          const pts = [[0.5, 0.5], [0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]].map(([u, v]) => [Math.min(W - 2, Math.max(1, r.left + r.width * u)), Math.min(H - 2, Math.max(1, r.top + r.height * v))]);
          if (pts.filter(([x, y]) => covered(el, x, y)).length > 2) return;
          hits.push({k: m[1], doc: 1, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height)});
          return;
        }
        const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3 && n.textContent!.trim()).map((n) => n.textContent!.trim()).join(' ');
        if (own.length < 2 || !/[A-Za-z0-9]/.test(own)) return;
        const rg = document.createRange();
        rg.selectNodeContents(el);
        const r = rg.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return;
        if (inFrame(r, W, H) < 0.85) return;
        if (effOpacity(el) < 0.9) return;
        if (covered(el, r.left + r.width / 2, r.top + r.height / 2)) return;
        const isDoc = /\.(jpg|png)$/i.test(own) && own.includes('/');
        // a text with no letters (a counter, a dial figure) is keyed by where it sits in the tree, so a ticking counter is one text
        const k = /[A-Za-z]/.test(own) ? own.replace(/\s+/g, ' ').slice(0, 90) : `${own} @${domPath(el)}`;
        hits.push({k, ...(isDoc ? {doc: 1 as const} : {}), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height)});
      });
      console.log('AUDIT ' + JSON.stringify({f: frame, hits}));
      continueRender(h);
    }));
  }, [frame, W, H]);
  return null;
};
