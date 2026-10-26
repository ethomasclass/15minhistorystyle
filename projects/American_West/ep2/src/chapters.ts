// The chapters, in order. Each is its own composition (Ch01 … Ch10); tools/render.sh renders them one at a
// time, joins them and masters once. Chapters are added here as they are built.
import React from 'react';

export const CHAPTERS: {id: string; C: React.FC; frames: number}[] = [];
