// Placeholder: the narration over this chapter's board (replaced by the built chapter).
import React from 'react';
import words from '../../public/audio/ch07_mississippi.words.json';
import {SeriesBoard} from '../kit/ep3board';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH07_FRAMES = chapterFrames(N, LEAD);

export const Ch07: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch07_mississippi.wav" lead={LEAD}>
    <SeriesBoard ch={7} from={0} at={40} />
  </ChapterShell>
);
