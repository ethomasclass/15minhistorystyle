// Sample 2 · Ep 1 ch 2: the land-grant checkerboard (Pacific Railway Act, 1862, Sec. 3).
import React from 'react';
import {boxOf, Highlight, JF, Note, Tag, usePal} from '../kit/Kit';
import {DocFocus, PlatGrid, Sample, TornPrint} from './kit';
import {IMG, SZ} from './masks';

const ACT_TAG = 'Pacific Railway Act, 1862 (Senate Mis. Doc. 108) · Library of Congress  ·  Diagram: land grant, Sec. 3';

const Legend: React.FC<{x: number; y: number}> = ({x, y}) => {
  const pal = usePal();
  const item = (sw: React.ReactNode, t: string) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>{sw}<span style={{fontFamily: JF.mono, fontSize: 22, letterSpacing: 2, color: '#fff', whiteSpace: 'nowrap'}}>{t}</span></div>
  );
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', gap: 44}}>
      {item(<div style={{width: 30, height: 30, background: boxOf(pal), opacity: 0.85}} />, 'RAILROAD · ODD SECTIONS')}
      {item(<div style={{width: 30, height: 30, border: `2px solid ${pal.mark}`, boxSizing: 'border-box'}} />, 'GOVERNMENT · EVEN')}
      {item(<div style={{width: 40, height: 8, background: pal.subject}} />, 'THE LINE')}
    </div>
  );
};

const ActCard: React.FC<{x: number; y: number; w: number; rot: number; at: number}> = ({x, y, w, rot, at}) => (
  <TornPrint src={IMG.act1} size={SZ.act} x={x} y={y} w={w} crop={[100, 60, 2000, 1500]} rot={rot} at={at} seed={9} torn={{b: true, r: true}}
    filter="grayscale(1) sepia(0.3) contrast(1.15) brightness(0.95)" tapes={[{x: w * 0.4, y: -18, rot: -3}]} />
);

/** A · flat diagram: two townships in teal on the desk, the line draws across, odd sections fill; the Act beside it. */
export const S2A: React.FC = () => (
  <Sample>
    <Highlight text="LAND GRANT" x={110} y={80} size={96} at={2} seed={31} rot={-2} />
    <PlatGrid x={90} y={260} cols={12} rows={6} cell={82} at={6} per={2} />
    <Legend x={92} y={790} />
    <ActCard x={1210} y={250} w={600} rot={2} at={4} />
    <Note text="5 sections a mile, each side" x={1170} y={770} size={44} rot={-3} at={40} />
    <Note text="(the rest stays federal)" x={1230} y={860} size={40} rot={-3} at={48} color="#ffffff" />
    <Tag text={ACT_TAG} />
  </Sample>
);

/** B · the same plat tilted onto the desk like a surveyor's sheet, longer strip, the Act pinned above. */
export const S2B: React.FC = () => (
  <Sample>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 1500}}>
      <div style={{position: 'absolute', left: 220, top: 300, width: 1560, height: 720, transform: 'rotateX(50deg) rotateZ(-9deg)', transformOrigin: '50% 50%'}}>
        <PlatGrid x={0} y={0} cols={18} rows={8} cell={86} at={6} per={1.5} railRow={4} />
      </div>
    </div>
    <Highlight text="LAND GRANT" x={110} y={80} size={96} at={2} seed={31} rot={-2} />
    <Note text="the West, sold off as a grid" x={130} y={225} size={50} rot={-3} at={40} />
    <ActCard x={1390} y={60} w={430} rot={4} at={4} />
    <Legend x={140} y={330} />
    <Tag text={ACT_TAG} x={44} y={24} />
  </Sample>
);

/** C · the Act's own words: focus pull onto Sec. 3 with a coral highlighter, one township filling beside it. */
export const S2C: React.FC = () => (
  <Sample>
    <Highlight text="EVERY ALTERNATE SECTION" x={90} y={66} size={64} at={2} seed={33} rot={-2} />
    <DocFocus src={IMG.act4} size={SZ.act} x={70} y={190} w={1000} h={760} sx0={200} sy0={1772} scale={0.588} rot={-1.5} at={0}
      band={[2250, 2420]} pullAt={14} swipeAt={24} lineH={50}
      swipes={[[815, 2278, 1889], [233, 2335, 1889], [233, 2392, 1060]]} />
    <PlatGrid x={1250} y={300} cols={6} rows={6} cell={74} at={30} per={2} railRow={3} />
    <Note text="odd numbers: the railroad's" x={1190} y={790} size={44} rot={-3} at={50} />
    <Tag text={ACT_TAG} />
  </Sample>
);
