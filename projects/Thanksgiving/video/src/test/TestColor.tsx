// The desk-colour A/B/C test (Nov 2026): the end of Ch03 from the Simmons pan ("Here's", so the "That's step one" hold and the
// pan are in range) through all of Ch04, played back to back with a DeskMap set. (The real chapters now use kit/tg_desk_map.ts,
// brighter tones and the mark swaps; these maps still override it: A = all black.)
//   A  all black (the current look)        B  colour by beat type, no textures        C  colour plus textures
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import w3 from '../../public/audio/ch03_showing_off.words.json';
import {Ch03, CH03_FRAMES} from '../ch/Ch03';
import {Ch04, CH04_FRAMES} from '../ch/Ch04';
import {LEAD, makeTimeline, type Narration} from '../kit/shell';
import {type DeskMap, DeskMapCtx} from '../kit/tg_desk';

/** Ch03 starts at its TurtlePan cut. */
const START3 = LEAD + makeTimeline(w3 as Narration, 30).at("Here's") - 1;
const LEN3 = CH03_FRAMES - START3;
export const TEST_COLOR_FRAMES = LEN3 + CH04_FRAMES;

/** The per-scene map (keys = each chapter's cut table). Unlisted scenes are black. */
export const DESK_SCENES: DeskMap['scenes'] = {
  'ch03.turtlePan': 'black',  // the Simmons page pan: archival
  'ch03.stepOne': 'coral',    // "That's step one" hold: punchline flash (~1.4 s, hard cut in and out)
  'ch03.steps': 'black',      // steps beside the page: archival
  'ch03.pie': 'teal',         // mince-pie state sheet + ingredients: explainer
  'ch03.count': 'teal',       // "count it out" MEAT cards
  'ch03.point': 'teal',       // the menu card: turtle = ships, pie = hours (stays teal: no switch for one scene)
  'ch04.pairEmpty': 'black',  // real vs fake slot: documents
  'ch04.book': 'black',       // recipe pages
  'ch04.recipe': 'black',
  'ch04.morph': 'black',
  // the MOCK tape: oxblood on the cut, back to black 1.5 s later
  'ch04.pairMock': (t) => [[t.at('Mock turtle') - 1, 'coral'], [t.at('Mock turtle') + 44, 'black']],
  'ch04.decline': 'teal',     // 97% of the turtles: the count
  'ch04.pairLate': 'black',
};

const Test: React.FC<{map: DeskMap | null}> = ({map}) => (
  <DeskMapCtx.Provider value={map ?? {texture: false, scenes: {}}}>
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence durationInFrames={LEN3}>
        <Sequence from={-START3}><Ch03 /></Sequence>
      </Sequence>
      <Sequence from={LEN3}><Ch04 /></Sequence>
    </AbsoluteFill>
  </DeskMapCtx.Provider>
);

export const TestColorA: React.FC = () => <Test map={null} />;
export const TestColorB: React.FC = () => <Test map={{texture: false, scenes: DESK_SCENES}} />;
export const TestColorC: React.FC = () => <Test map={{texture: true, scenes: DESK_SCENES}} />;
