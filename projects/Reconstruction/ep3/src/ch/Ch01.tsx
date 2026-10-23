// Placeholder: the narration over this chapter's board (replaced by the built chapter).
import React from 'react';
import words from '../../public/audio/ch01_cold_open.words.json';
import {SeriesBoard} from '../kit/ep3board';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH01_FRAMES = chapterFrames(N, LEAD);

export const Ch01: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch01_cold_open.wav" lead={LEAD}>
    <SeriesBoard ch={1} from={0} at={40} />
  </ChapterShell>
);
