// The desk colour of every scene in the real chapters (keys `chNN.<cut key>`, the keys of each chapter's cut table; unlisted
// scenes are black). The user's rules (Nov 2026): black for archival evidence, teal for explainer beats, coral only for short
// (about 1-2 s) flashes on punchlines and the MOCK tapes; the collage board stays black; switch only on hard cuts, never
// mid-shot, and not more than once every few scenes apart from the flashes. Full-frame documents and dioramas cover the desk,
// so their entries don't matter (left black).
import type {DeskEntry} from './tg_desk';

const DOTS = {mode: 'teal', dots: true} as const;

export const DESK_MAP: Record<string, DeskEntry> = {
  // ch01: the eel (black), the treading drawing, the eel and its line, the barrel (teal); the plate, the can (black); the numbers,
  // the struck-out plate and the question (teal). The title card after the intro is outside the scenes: black.
  'ch01.tread': 'teal',
  'ch01.fat': 'teal',
  'ch01.barrel': 'teal',
  'ch01.numbers': 'teal',
  'ch01.meal': 'teal',
  'ch01.question': 'teal',
  // ch02: the half-dead marks; Massasoit's men through the 200-year gap (the five deer, the translation, the alliance, what
  // wasn't there, the timeline). The letter, Winslow and the board: black.
  'ch02.half': 'teal',
  'ch02.massasoit': 'teal',
  'ch02.deer': 'teal',
  'ch02.translation': 'teal',
  'ch02.alliance': 'teal',
  'ch02.notthere': 'teal',
  'ch02.forgot': 'teal',
  // ch03: "That's step one" (coral flash, 1.4 s); the mince pie, the count, the point (teal)
  'ch03.stepOne': 'coral',
  'ch03.pie': 'teal',
  'ch03.count': 'teal',
  'ch03.point': 'teal',
  // ch04: the MOCK tape cut-in (coral, ~1.5 s), back to the pair in black; the 97% count (teal)
  'ch04.mockFlash': 'coral',
  'ch04.decline': 'teal',
  // ch05: the table drawing (teal); everything else is Hale's documents
  'ch05.menu': 'teal',
  // ch06: "we have servants" (coral cut-in), the MOCK tape (coral cut-in), the tuna hold "Yes. People ate this. On purpose." (coral)
  'ch06.servantsFlash': 'coral',
  'ch06.mockFlash': 'coral',
  'ch06.tunaFlash': 'coral',
  // ch07: the 52-week grid (teal); the cranberry question (teal), "Because it IS the can" (coral), the ridges (teal); the 1950s
  // test kitchen: the dealt cards, the casserole, the twenty million (teal with the halftone dot), the MOCK tape (coral)
  'ch07.urann': 'teal',
  'ch07.question': 'teal',
  'ch07.payoff': 'coral',
  'ch07.ridges': 'teal',
  'ch07.montage': DOTS,
  'ch07.casserole': DOTS,
  'ch07.mock': DOTS,
  'ch07.mockFlash': 'coral',
  'ch07.mockAfter': DOTS,
  // ch08: PICK -> BREED -> REPEAT and the inflating turkey on its scale (teal) through the count; "Happy Thanksgiving." (coral);
  // the heritage bird beside it (teal); the recap stack (teal); "It's still delicious." (coral)
  'ch08.oldway': 'teal',
  'ch08.wide': 'teal',
  'ch08.chest': 'teal',
  'ch08.white': 'teal',
  'ch08.loupe': 'teal',
  'ch08.weight': 'teal',
  'ch08.tip': 'teal',
  'ch08.count': 'teal',
  'ch08.happy': 'coral',
  'ch08.heritage': 'teal',
  'ch08.recap': 'teal',
  'ch08.delicious': 'coral',
};
