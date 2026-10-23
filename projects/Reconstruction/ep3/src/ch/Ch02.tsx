// Placeholder: the narration over this chapter's board (replaced by the built chapter).
import React from 'react';
import words from '../../public/audio/ch02_the_klan.words.json';
import {SeriesBoard} from '../kit/ep3board';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);

export const Ch02: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch02_the_klan.wav" lead={LEAD}>
    <SeriesBoard ch={2} from={0} at={40} />
  </ChapterShell>
);
