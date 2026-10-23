// Placeholder: the narration over this chapter's board (replaced by the built chapter).
import React from 'react';
import words from '../../public/audio/ch08_1876.words.json';
import {SeriesBoard} from '../kit/ep3board';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);

export const Ch08: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch08_1876.wav" lead={LEAD}>
    <SeriesBoard ch={8} from={0} at={40} />
  </ChapterShell>
);
