// Placeholder: the narration over this chapter's board (replaced by the built chapter).
import React from 'react';
import words from '../../public/audio/ch09_voteless.words.json';
import {SeriesBoard} from '../kit/ep3board';
import {ChapterShell, chapterFrames, LEAD, type Narration} from '../kit/shell';

const N = words as Narration;
export const CH09_FRAMES = chapterFrames(N, LEAD);

export const Ch09: React.FC = () => (
  <ChapterShell n={N} audio="audio/ch09_voteless.wav" lead={LEAD}>
    <SeriesBoard ch={9} from={0} at={40} />
  </ChapterShell>
);
