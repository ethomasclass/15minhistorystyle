// Sample 1 · Ep 1 cold open: A. J. Russell's "East and West Shaking Hands at Laying Last Rail", May 10, 1869.
import React from 'react';
import {Arrow, Highlight, Loop, Note, Tag} from '../kit/Kit';
import {onScreen, Photo} from '../kit/shell';
import {CutOut, MapCard, Sample, TornPrint} from './kit';
import {IMG, SM, SZ, WARREN} from './masks';

const SPIKE_TAG = 'A. J. Russell, East and West Shaking Hands at Laying Last Rail, 1869 · Wikimedia Commons';

/** A · the current look: full-bleed photo, slow push, one coral figure traced, teal loops, orange-tape date. */
export const S1A: React.FC = () => (
  <Sample desk={false}>
    <Photo src={IMG.spike} size={SZ.spike} fx={1900} fy={1330} z0={1.02} z1={1.06} a={0} b={90} mask={SM.montague} traceAt={14}>
      {(p) => {
        const S = onScreen(p);
        const [l1x, l1y] = S(620, 800);
        const [l2x, l2y] = S(3020, 800);
        return (
          <>
            <Loop cx={l1x + 50} cy={l1y} rx={240} ry={150} at={24} seed={5} tilt={-4} />
            <Loop cx={l2x - 40} cy={l2y} rx={300} ry={140} at={30} seed={9} tilt={3} />
            <Highlight text="MAY 10, 1869" x={640} y={60} size={84} at={6} seed={11} rot={-2} />
            <Note text="look at the faces." x={690} y={185} size={50} rot={-3} at={36} />
            <Tag text={SPIKE_TAG} />
          </>
        );
      }}
    </Photo>
  </Sample>
);

const PRINT = {x: 110, y: 66, w: 1150};

/** B · collage: the photo as a torn print with orange tape, its corner torn away, a dark map card pinning Promontory. */
export const S1B: React.FC = () => (
  <Sample>
    <TornPrint src={IMG.spike} size={SZ.spike} {...PRINT} rot={-2} at={2} seed={3} corner={{at: 'br', x: 0.7, y: 0.58}}
      tapes={[{x: -40, y: 20, rot: -38}, {x: 1040, y: -10, rot: 30}]} mask={SM.montague} tint={1} traceAt={14} />
    <MapCard x={1340} y={640} w={440} h={300} src={IMG.warren} size={SZ.warren} fx={WARREN.promontory[0] + 20} fy={WARREN.promontory[1] + 40} scale={0.62} rot={3} at={20}
      pin={WARREN.promontory} label="Promontory" labelAt={[250, 40]} caption="UTAH TERR. · 1869" />
    <Note text="look at the faces." x={1330} y={150} size={46} rot={-3} at={30} />
    <Note text="who's missing?" x={1340} y={380} size={52} rot={-4} at={40} />
    <Arrow x1={1360} y1={470} x2={1170} y2={620} bow={-30} at={48} />
    <Highlight text="NOT IN THE PICTURE" x={120} y={952} size={70} at={10} seed={21} rot={-2} />
    <Tag text={SPIKE_TAG} x={44} y={24} />
  </Sample>
);

/** C · B plus a Central Pacific Chinese worker (Hart, Tunnel No. 8) cut out and stepping into the torn gap: the coral subject moves to him. */
export const S1C: React.FC = () => (
  <Sample>
    <TornPrint src={IMG.spike} size={SZ.spike} {...PRINT} rot={-2} at={2} seed={3} corner={{at: 'br', x: 0.7, y: 0.58}}
      tapes={[{x: -40, y: 20, rot: -38}, {x: 1040, y: -10, rot: 30}]} />
    <MapCard x={1340} y={640} w={440} h={300} src={IMG.warren} size={SZ.warren} fx={WARREN.promontory[0] + 20} fy={WARREN.promontory[1] + 40} scale={0.62} rot={3} at={10}
      pin={WARREN.promontory} label="Promontory" labelAt={[250, 40]} caption="UTAH TERR. · 1869" />
    <CutOut src={IMG.tunnel8} size={SZ.tunnel8} mask={SM.worker} place={{left: 1100 - 680 * 0.88, top: 985 - 1780 * 0.88, scale: 0.88}} at={20} tint={0.6} traceAt={28}
      filter="grayscale(1) contrast(1.15) brightness(1.2)" />
    <Note text="the men who built it" x={1330} y={150} size={46} rot={-3} at={34} />
    <Note text="(left out of the frame)" x={1350} y={250} size={38} rot={-3} at={42} color="#ffffff" />
    <Arrow x1={1400} y1={350} x2={1180} y2={560} bow={-30} at={48} />
    <Highlight text="NOT IN THE PICTURE" x={120} y={952} size={70} at={6} seed={21} rot={-2} />
    <Tag text="A. J. Russell, 1869 · Commons  ·  A. A. Hart, Heading of Tunnel No. 8, 1865–69 · LOC" x={44} y={24} />
  </Sample>
);
