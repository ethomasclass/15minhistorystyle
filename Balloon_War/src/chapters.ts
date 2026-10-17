// The chapters, in order. Each is its own composition (Ch01, Ch02, ...); tools/render.sh renders them one at a
// time, joins them and masters once. Add a line per chapter as you build it. (The template's examples are in
// src/ch_examples/, kept out of the build.)
import React from 'react';

export const CHAPTERS: {id: string; C: React.FC; frames: number}[] = [];
