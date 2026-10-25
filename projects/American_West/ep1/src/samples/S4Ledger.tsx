// Sample 4 · the Promise Ledger (recurring device; Ep 1 writes row 1 at the end of chapter 9).
import React from 'react';
import {Highlight, Note, PALETTES, Tag} from '../kit/Kit';
import {Ledger, Sample, TornPrint} from './kit';
import {IMG, SZ} from './masks';

const HEADS = ['THE PROMISE', 'WHO GOT IT', "WHO DIDN'T"];

/** Layout 1 · wide ledger across the desk, four episode rows, row 1 written in teal. */
export const S4A: React.FC = () => (
  <Sample>
    <Highlight text="THE PROMISE LEDGER" x={110} y={70} size={84} at={2} seed={51} rot={-2} />
    <Ledger x={110} y={250} w={1700} cols={[0, 0.35, 0.64]} heads={HEADS} margin={['EP 1', 'EP 2', 'EP 3', 'EP 4']} empty={3} rowH={100} size={34} rot={-1} at={4}
      rows={[{cells: ['a country tied together', 'investors · the Union', 'the crews who built it'], at: 18}]} />
    <Note text="one row per episode" x={1300} y={880} size={44} rot={-3} at={56} color="#ffffff" />
    <Tag text="The Promise Ledger · series device, Ep 1 of 4" />
  </Sample>
);

/** Layout 2 · a narrower ledger card beside the golden-spike print (the callback), the "who didn't" entry as the coral punchline. */
export const S4B: React.FC = () => {
  const pal = PALETTES.locked; // outside <Sample>'s provider, so read the locked palette directly
  return (
    <Sample>
      <TornPrint src={IMG.spike} size={SZ.spike} x={1180} y={150} w={660} rot={4} at={2} seed={3} corner={{at: 'br', x: 0.7, y: 0.58}} tapes={[{x: 260, y: -18, rot: -4}]} />
      <Ledger x={80} y={230} w={1080} cols={[0, 0.36, 0.66]} heads={HEADS} margin={['EP 1', 'EP 2']} empty={1} rowH={150} size={34} rot={-2} at={6} title="THE PROMISE LEDGER"
        rows={[{cells: ['a country\ntied together', 'investors,\nthe Union', 'the Chinese\ncrews'], at: 20, colors: [undefined, undefined, pal.subject]}]} />
      <Note text="banned by nationality, 1882" x={1180} y={760} size={46} rot={-3} at={54} />
      <Tag text="The Promise Ledger · A. J. Russell, Promontory, May 10, 1869 · Wikimedia Commons" />
    </Sample>
  );
};
