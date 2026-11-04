// Test compositions for the 3D pieces (src/fx/*.tsx), registered in Root as FX-<id>. Each piece adds {id, C, frames} here.
import React from 'react';

export const FX: {id: string; C: React.FC; frames: number}[] = [];
