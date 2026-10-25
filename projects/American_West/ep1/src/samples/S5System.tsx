// Sample 5 · the series system for later episodes: the hinge-year stamp and a resistance card (Ep 4).
import React from 'react';
import {Img, staticFile} from 'remotion';
import {Highlight, Note, PALETTES, Tag} from '../kit/Kit';
import {CircleMount, Field, HingeYear, MAPLOOK, MapCard, Sample, SHADOW} from './kit';
import {IMG, SM, SZ, WARREN} from './masks';

const EVENTS = ['PACIFIC RAILWAY ACT', 'HOMESTEAD ACT', 'MORRILL ACT'];

/** Hinge year 1 · the stamp large on the bare desk. */
export const S5A: React.FC = () => (
  <Sample>
    <HingeYear year="1862" events={EVENTS} x={180} y={300} size={230} at={4} />
    <Note text="remember this year" x={1120} y={330} size={56} rot={-4} at={30} />
    <Note text="(all three come back)" x={1150} y={440} size={44} rot={-4} at={40} color="#ffffff" />
    <Tag text="Hinge-year stamp · series device" />
  </Sample>
);

/** Hinge year 2 · smaller, in a fixed corner over the scene it interrupts (here the 1868 map, dimmed). */
export const S5B: React.FC = () => (
  <Sample desk={false}>
    <Img src={staticFile(IMG.warren)} style={{position: 'absolute', left: -700, top: -620, width: SZ.warren[0] * 0.7, height: SZ.warren[1] * 0.7, filter: MAPLOOK.replace('0.62', '0.42')}} />
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.1) 30%, rgba(8,6,4,0.8) 100%)'}} />
    <HingeYear year="1862" events={EVENTS} x={100} y={70} size={150} at={4} />
    <Tag text="Territory of the U.S. from the Mississippi to the Pacific, Warren & Freyhold, 1868 · Library of Congress" />
  </Sample>
);

const RC_TAG = 'Red Cloud (Makhpiya Luta), Oglala Lakota, c. 1891, Trager & Kuhn · LOC  ·  Map: Warren & Freyhold, 1868 · LOC';
const FIELDS: [string, string][] = [
  ['WHO', 'Red Cloud, Oglala Lakota'],
  ['WHERE', 'Powder River country'],
  ['WHEN', '1866 – 1868'],
  ['WHY', 'army forts on Lakota hunting land'],
  ['HOW IT ENDED', '1868 treaty: the forts close'],
];

/** Resistance card 1 · portrait circle left, five field tags stacked right, map card in the corner. */
export const S5C: React.FC = () => (
  <Sample>
    <CircleMount src={IMG.redcloud} size={SZ.redcloud} cx={420} cy={520} r={300} fx={1110} fy={1330} scale={0.4} at={2} mask={SM.redcloud} traceAt={12} />
    <Highlight text="RED CLOUD'S WAR" x={820} y={50} size={70} at={4} seed={61} rot={-2} />
    {FIELDS.map(([t, v], i) => <Field key={t} tag={t} text={v} x={820} y={170 + i * 112} at={14 + i * 7} tagW={260} size={36} />)}
    <MapCard x={1430} y={750} w={420} h={260} src={IMG.warren} size={SZ.warren} fx={WARREN.powderRiver[0]} fy={WARREN.powderRiver[1] + 30} scale={0.55} rot={3} at={50}
      loop={{sx: WARREN.powderRiver[0], sy: WARREN.powderRiver[1], rx: 170, ry: 110}} caption="POWDER RIVER · 1866" />
    <Tag text={RC_TAG} />
  </Sample>
);

/** Resistance card 2 · everything on one dark card: portrait and map stacked left, the fields right. */
export const S5D: React.FC = () => {
  const pal = PALETTES.locked; // outside <Sample>'s provider, so read the locked palette directly
  return (
    <Sample>
      <div style={{position: 'absolute', left: 90, top: 80, width: 1740, height: 900, background: 'radial-gradient(ellipse at 40% 30%, #2a2620 0%, #1a1813 75%, #12100c 100%)',
        boxShadow: `16px 20px 0 ${SHADOW}`, transform: 'rotate(-0.8deg)'}}>
        <div style={{position: 'absolute', inset: 10, border: `2px solid ${pal.mark}`, opacity: 0.7}} />
      </div>
      <CircleMount src={IMG.redcloud} size={SZ.redcloud} cx={370} cy={330} r={190} fx={1110} fy={1260} scale={0.27} at={2} mask={SM.redcloud} traceAt={12} />
      <Highlight text="RED CLOUD" x={170} y={560} size={64} at={6} seed={63} rot={-2} />
      <MapCard x={170} y={690} w={420} h={250} src={IMG.warren} size={SZ.warren} fx={WARREN.powderRiver[0]} fy={WARREN.powderRiver[1] + 30} scale={0.55} rot={-2} at={10}
        loop={{sx: WARREN.powderRiver[0], sy: WARREN.powderRiver[1], rx: 170, ry: 110}} caption="POWDER RIVER · 1866" />
      {FIELDS.map(([t, v], i) => <Field key={t} tag={t} text={v} x={700} y={190 + i * 140} at={16 + i * 7} tagW={250} size={38} />)}
      <Tag text={RC_TAG} x={44} y={1036} />
    </Sample>
  );
};
