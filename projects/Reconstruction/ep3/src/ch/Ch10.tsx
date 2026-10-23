// Placeholder: the narration over this chapter's board (replaced by the built chapter).
import React from 'react';
import words from '../../public/audio/ch10_a_few_acres.words.json';
import {SeriesBoard} from '../kit/ep3board';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH10_FRAMES = chapterFrames(N, LEAD);

export const Ch10: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch10_a_few_acres.wav" lead={LEAD}>
    <SeriesBoard ch={10} from={0} at={40} />
  </ChapterShell>
);
