// Sample 3 · Ep 1 ch 3: the race. Central Pacific (Hart's "Goliah", mirrored to face east) and Union Pacific
// (Carbutt, 1866) facing each other across the frame, the UP's own 1869 survey map as a strip between them.
import React from 'react';
import {Highlight, Note, Tag} from '../kit/Kit';
import {type Place} from '../kit/Kit';
import {CutOut, Sample, TornPrint} from './kit';
import {IMG, SM, SZ} from './masks';

const TAG = 'A. A. Hart, The Goliah (CP), c. 1868, mirrored · J. Carbutt, UP at the 100th Meridian, 1866 · G. M. Dodge, UP map, 1869 · LOC';
const CP: Place = {left: 50 - 1000 * 0.56, top: 860 - 1300 * 0.56, scale: 0.56};
const UP: Place = {left: 1870 - 898 * 0.75, top: 860 - 1152 * 0.75, scale: 0.75};

const Strip: React.FC<{at: number; y?: number}> = ({at, y = 455}) => (
  <TornPrint src={IMG.dodge} size={SZ.dodge} x={640} y={y} w={560} crop={[700, 250, 5700, 1250]} rot={-1} at={at} seed={17}
    filter="grayscale(1) sepia(0.25) contrast(1.2) brightness(0.8)" torn={{l: true, r: true, t: false, b: false}} tapes={[{x: 220, y: -20, w: 120, rot: -4}]} />
);

const Labels: React.FC = () => (
  <>
    <Highlight text="CENTRAL PACIFIC" x={70} y={880} size={46} at={24} seed={41} rot={-2} />
    <Note text="east from Sacramento" x={80} y={950} size={40} rot={-3} at={34} />
    <Highlight text="UNION PACIFIC" x={1395} y={880} size={46} at={28} seed={43} rot={2} />
    <Note text="west from Omaha" x={1440} y={950} size={40} rot={-3} at={38} />
  </>
);

/** A · two cut-outs with a hard ink shadow; the CP engine is the coral subject (tint + teal trace). */
export const S3A: React.FC = () => (
  <Sample>
    <Highlight text="THE RACE" x={110} y={80} size={110} at={2} seed={45} rot={-2} />
    <Strip at={4} />
    <CutOut src={IMG.goliah} size={SZ.goliah} mask={SM.goliah} place={CP} at={8} tint={0.7} traceAt={16} />
    <CutOut src={IMG.carbutt} size={SZ.carbutt} mask={SM.up} place={UP} at={12} filter="grayscale(1) contrast(1.4) brightness(0.95)" />
    <Note text="paid by the mile" x={1180} y={150} size={52} rot={-3} at={44} />
    <Labels />
    <Tag text={TAG} x={44} y={1036} />
  </Sample>
);

/** B · the CP engine lifted by a coral offset shadow instead of tint + trace (still one coral subject); UP in ink. */
export const S3B: React.FC = () => (
  <Sample>
    <Highlight text="THE RACE" x={110} y={80} size={110} at={2} seed={45} rot={-2} />
    <Strip at={4} />
    <CutOut src={IMG.goliah} size={SZ.goliah} mask={SM.goliah} place={CP} at={8} shadow="coral" off={[16, 12]} />
    <CutOut src={IMG.carbutt} size={SZ.carbutt} mask={SM.up} place={UP} at={12} filter="grayscale(1) contrast(1.4) brightness(0.95)" />
    <Note text="paid by the mile" x={1180} y={150} size={52} rot={-3} at={44} />
    <Labels />
    <Tag text={TAG} x={44} y={1036} />
  </Sample>
);

/** C · each engine stays inside its own torn photo print (no cut-out), taped to the desk, the strip between. */
export const S3C: React.FC = () => (
  <Sample>
    <Highlight text="THE RACE" x={110} y={80} size={110} at={2} seed={45} rot={-2} />
    <TornPrint src={IMG.goliah} size={SZ.goliah} x={60} y={260} w={600} crop={[960, 240, 2104, 1400]} rot={-3} at={6} seed={5} mask={SM.goliah} tint={0.7} traceAt={16}
      tapes={[{x: -30, y: 10, rot: -40}, {x: 480, y: -14, rot: 12}]} />
    <TornPrint src={IMG.carbutt} size={SZ.carbutt} x={1250} y={300} w={620} crop={[0, 480, 960, 1220]} rot={3} at={10} seed={6}
      tapes={[{x: 30, y: -16, rot: -10}, {x: 500, y: 450, rot: 35}]} />
    <Strip at={4} y={560} />
    <Note text="paid by the mile" x={1180} y={150} size={52} rot={-3} at={44} />
    <Labels />
    <Tag text={TAG} x={44} y={1036} />
  </Sample>
);
