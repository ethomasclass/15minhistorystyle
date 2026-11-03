// Depth parallax: Parallax (parallax.tsx) with real depth inside each layer instead of two flat cards. Every pixel
// moves by its own depth (tools/depth.py, Depth Anything V2 Small), so streets recede, buildings turn and the
// middle distance separates from the far distance; the subject stays its own layer with the mask's clean edge, so the
// coral tint and teal trace still sit on it. Drawn with WebGL2 (parallax occlusion mapping: each output pixel marches
// a ray from near to far through the depth map and takes the first surface it hits, so near things occlude far things
// rather than smearing over them). Needs public/img/depth/<name>_{depth.png,plate.jpg} from tools/depth.py; without
// them it falls back to Parallax.
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, Easing, getStaticFiles, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {clamp} from '../lib/anim';
import {INK, Tag, Tint, Traced, type Place} from './Kit';
import type {MaskRef} from './maskref';
import {Effect, Parallax, type Fx} from './parallax';

const hasFile = (p: string) => getStaticFiles().some((f) => f.name === p);

const VERT = `#version 300 es
in vec2 aPos; out vec2 vXY;
uniform vec2 uRes;
void main() { vXY = (aPos * 0.5 + 0.5) * uRes; vXY.y = uRes.y - vXY.y; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vXY; out vec4 outColor;
uniform sampler2D uPlate, uFg, uDepth;   // the plate; the picture (the subject's colour); depth R/G + mask B
uniform vec2 uRes, uSize, uCenter, uShift;   // frame px; source px; camera centre (source px); shift (frame px per unit depth)
uniform float uBase, uDolly, uFocus, uShadow;
const int N = 56;

// where a surface at depth h has to come from to land on this pixel
vec2 srcAt(vec2 p, float h) {
  float s = 1.0 + uDolly * (h - uFocus);
  return uCenter + (p - uCenter - uShift / uBase * (h - uFocus)) / s;
}

// a texel the ray can stop at. The subject layer is a thin shell inside its mask: a ray that passes beside it would
// otherwise hit its side wall and stretch the edge pixels across the background
bool solidAt(vec2 uv, float h, int ch, bool subj) {
  vec4 t = texture(uDepth, uv);
  return t[ch] >= h && (!subj || (t.b > 0.02 && t[ch] - h < 0.05));
}

// march near -> far through depth channel ch; subj = the subject layer
vec2 march(vec2 p, int ch, bool subj, out bool hit) {
  float dh = 1.0 / float(N);
  float prev = 1.0 + dh;
  hit = false;
  for (int i = 0; i <= N; i++) {
    float h = 1.0 - float(i) * dh;
    if (solidAt(srcAt(p, h) / uSize, h, ch, subj)) {
      float lo = h, hi = prev;              // refine between the last miss and this hit
      for (int k = 0; k < 5; k++) {
        float m = 0.5 * (lo + hi);
        if (solidAt(srcAt(p, m) / uSize, m, ch, subj)) lo = m; else hi = m;
      }
      hit = true;
      return srcAt(p, lo) / uSize;
    }
    prev = h;
  }
  return srcAt(p, 0.0) / uSize;
}

void main() {
  vec2 p = uCenter + (vXY - 0.5 * uRes) / uBase;   // the source pixel at the focus plane
  bool hb, hf;
  vec3 bg = texture(uPlate, march(p, 1, false, hb)).rgb;
  vec2 fuv = march(p, 0, true, hf);
  vec4 fg = hf ? vec4(texture(uFg, fuv).rgb, texture(uDepth, fuv).b) : vec4(0.0);
  // contact shadow: the lifted subject darkens what's behind it (blurred via a coarse mip)
  vec2 suv = srcAt(p - vec2(6.0, 10.0) / uBase, uFocus) / uSize;
  bg *= 1.0 - uShadow * texture(uDepth, suv, 4.0).b;
  outColor = vec4(mix(bg, fg.rgb, fg.a), 1.0);
}`;

type GLState = {gl: WebGL2RenderingContext; prog: WebGLProgram; u: Record<string, WebGLUniformLocation | null>};

const loadImg = (src: string) => new Promise<HTMLImageElement>((res, rej) => {
  const i = new Image();
  i.onload = () => res(i);
  i.onerror = () => rej(new Error(`DepthParallax: could not load ${src}`));
  i.src = src;
});

const initGL = (canvas: HTMLCanvasElement, imgs: HTMLImageElement[]): GLState => {
  const gl = canvas.getContext('webgl2', {preserveDrawingBuffer: true, antialias: false});
  if (!gl) throw new Error('DepthParallax: WebGL2 unavailable (render with --gl=angle or --gl=swangle)');
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  ['uPlate', 'uFg', 'uDepth'].forEach((name, i) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgs[i]);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(prog, name), i);
  });
  const u = Object.fromEntries(['uRes', 'uSize', 'uCenter', 'uShift', 'uBase', 'uDolly', 'uFocus', 'uShadow'].map((n) => [n, gl.getUniformLocation(prog, n)]));
  return {gl, prog, u};
};

type Cam = {z?: [number, number]; x?: [number, number]; y?: [number, number]; ease?: (t: number) => number};
type R2 = [number, number];

/**
 * Parallax's props, plus how the camera moves through depth over frames a..b:
 * `shift` {x, y}: [start, end] frame px that something one unit of depth nearer than the focus slides (a sideways
 * dolly; far things slide the other way). `dolly`: [start, end] extra scale per unit of depth (a push: near things
 * grow faster than far). `focus` (0..1, default the subject's depth from tools/depth.py) is the depth that stays put,
 * so by default the subject holds still and the world turns around it.
 */
export const DepthParallax: React.FC<React.ComponentProps<typeof Parallax> & {shift?: {x?: R2; y?: R2}; dolly?: R2; focus?: number}> = (props) => {
  const {name} = props;
  const ok = hasFile(`img/depth/${name}_depth.png`) && hasFile(`img/depth/${name}_plate.jpg`);
  return ok ? <DepthScene {...props} /> : <Parallax {...props} />;
};

const DepthScene: React.FC<React.ComponentProps<typeof DepthParallax>> = ({
  name, src, size, a, b, tag, fx = 0.5, fy = 0.5, cam = {}, crop, frame = [1920, 1080], mask, tint, traceAt, filter = 'grayscale(1) contrast(1.2) brightness(0.97)',
  effects = [], vignette = 0.6, children, shift = {x: [-36, 36]}, dolly = [0, 0.12], focus: focusProp,
}) => {
  const f = useCurrentFrame();
  const canvas = useRef<HTMLCanvasElement>(null);
  const st = useRef<GLState | null>(null);
  const [ready, setReady] = useState(false);
  const [subject, setSubject] = useState(0.5);
  const [handle] = useState(() => delayRender(`depth textures ${name}`));
  const released = useRef(false);

  useEffect(() => {
    Promise.all([
      Promise.all([`img/depth/${name}_plate.jpg`, src, `img/depth/${name}_depth.png`].map((p) => loadImg(staticFile(p)))),
      fetch(staticFile(`img/depth/${name}_depth.json`)).then((r) => r.json()).catch(() => ({subject: 0.5})),
    ]).then(([imgs, meta]) => {
      st.current = initGL(canvas.current!, imgs);
      setSubject(meta.subject);
      setReady(true);
    }).catch((e) => cancelRender(e));
  }, [name, src, handle]);

  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: cam.ease ?? Easing.inOut(Easing.sin)});
  const lerp = (r: R2 | undefined, d: number) => (r ? r[0] + (r[1] - r[0]) * u : d);
  const [W, H] = size;
  const [FW, FH] = frame;
  const focus = focusProp ?? subject;
  const sh = {x: lerp(shift.x, 0) + noise2D(`${name}x`, f * 0.018, 0) * 4, y: lerp(shift.y, 0) + noise2D(`${name}y`, 0, f * 0.018) * 4};
  const dz = lerp(dolly, 0);
  // headroom so the far plane never pulls in an edge: the biggest slide, and the far plane shrinking under the dolly
  const reach = Math.max(focus, 1 - focus);
  const slide = Math.max(...[shift.x, shift.y].flatMap((r) => (r ? r.map(Math.abs) : [0]))) * reach + 6;
  const shrink = 1 - Math.max(...dolly.map(Math.abs)) * reach;
  const z = lerp(cam.z, 1.03 + 0.07 * u) * Math.max((FW + 2 * slide) / FW, (FH + 2 * slide) / FH) / shrink;
  const [x0, y0, x1, y1] = crop ?? [0, 0, W, H];
  const base = Math.max(FW / (x1 - x0), FH / (y1 - y0)) * z;
  const hw = FW / 2 / base, hh = FH / 2 / base;
  const cx = Math.min(x1 - hw, Math.max(x0 + hw, x0 + fx * (x1 - x0) + lerp(cam.x, 0) * (x1 - x0)));
  const cy = Math.min(y1 - hh, Math.max(y0 + hh, y0 + fy * (y1 - y0) + lerp(cam.y, 0) * (y1 - y0)));

  useLayoutEffect(() => {
    const s = st.current;
    if (!ready || !s) return;
    const {gl, u: U} = s;
    gl.viewport(0, 0, FW, FH);
    gl.uniform2f(U.uRes, FW, FH);
    gl.uniform2f(U.uSize, W, H);
    gl.uniform2f(U.uCenter, cx, cy);
    gl.uniform2f(U.uShift, sh.x, sh.y);
    gl.uniform1f(U.uBase, base);
    gl.uniform1f(U.uDolly, dz);
    gl.uniform1f(U.uFocus, focus);
    gl.uniform1f(U.uShadow, 0.28);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.finish();
    if (!released.current) {
      released.current = true;
      continueRender(handle);
    }
  });

  // the subject's screen placement (for the tint, trace and children): a plane at the subject's depth
  const ss = base * (1 + dz * (subject - focus));
  const fg: Place = {left: FW / 2 - cx * ss + sh.x * (subject - focus), top: FH / 2 - cy * ss + sh.y * (subject - focus), scale: ss};
  const film = effects.some((e) => e.kind === 'film');
  const weave = film ? {x: noise2D('gw', f * 0.5, 0) * 1.5, y: noise2D('gw', 0, f * 0.5) * 1.5} : {x: 0, y: 0};
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${weave.x}px, ${weave.y}px)`}}>
        <canvas ref={canvas} width={FW} height={FH} style={{position: 'absolute', inset: 0, width: FW, height: FH, filter}} />
        {mask && tint !== null && <Tint mask={mask.alpha} place={fg} size={size} color={tint ?? undefined} />}
        {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={fg} at={traceAt} dur={12} width={5} part={0.92} />}
        {effects.filter((e) => e.kind !== 'film').map((e, i) => <Effect key={i} fx={e} />)}
        {children?.(fg)}
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,${vignette}) 100%)`}} />
        {film && <Effect fx={{kind: 'film'}} />}
      </AbsoluteFill>
      <Tag text={tag} y={FH - 50} />
    </AbsoluteFill>
  );
};

/** Fx is re-exported so scenes can import everything from one place. */
export type {Fx};
