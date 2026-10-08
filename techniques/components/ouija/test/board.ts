// Layout of the talking board, shared by the flat texture (BoardTexture) and the 3D scene (Board3D),
// so the planchette can find any letter. Units: texture pixels.
export const TW = 2048;
export const TH = 1366;
/** Board size in 3D world units (same 3:2 ratio as the texture). */
export const BW = 3;
export const BH = 2;

const CX = TW / 2;
const CY = 1790; // centre of the two letter arcs, below the board
const SPAN = 0.6; // half-angle of each arc, radians

export type Glyph = {ch: string; x: number; y: number; rot: number; size: number};

const arc = (letters: string, r: number, size: number): Glyph[] =>
  letters.split('').map((ch, i, all) => {
    const a = -SPAN + (2 * SPAN * i) / (all.length - 1);
    return {ch, x: CX + Math.sin(a) * r, y: CY - Math.cos(a) * r, rot: (a * 180) / Math.PI, size};
  });

export const GLYPHS: Glyph[] = [
  ...arc('ABCDEFGHIJKLM', 1250, 128),
  ...arc('NOPQRSTUVWXYZ', 1060, 118),
  ...'1234567890'.split('').map((ch, i) => ({ch, x: 600 + i * 94, y: 1020, rot: 0, size: 92})),
];

export const WORDS_ON_BOARD = {
  YES: {x: 560, y: 250, size: 118},
  NO: {x: 1488, y: 250, size: 118},
  'GOOD BYE': {x: CX, y: 1175, size: 96},
};

/** Texture position of a letter, digit or word. */
export const spot = (key: string): {x: number; y: number} => {
  const w = (WORDS_ON_BOARD as Record<string, {x: number; y: number}>)[key];
  if (w) return w;
  const g = GLYPHS.find((g) => g.ch === key);
  if (!g) throw new Error(`not on the board: ${key}`);
  return g;
};

/** Texture pixels -> world x/z on the board's top face. */
export const toWorld = (p: {x: number; y: number}): [number, number] => [(p.x / TW - 0.5) * BW, (p.y / TH - 0.5) * BH];
