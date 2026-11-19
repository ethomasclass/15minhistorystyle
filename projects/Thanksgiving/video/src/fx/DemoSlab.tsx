// The smallest drawn 3D piece, as a pattern to copy (delete it once the video has its own): the dark map table with teal edges,
// a route drawn on over time in teal, ONE coral element riding it, a label projected from 3D into the DOM overlay, and a fine
// source line. Beats are props (`drawAt`, `labelAt`), so a chapter can pass word-anchored frames: <DemoSlab drawAt={t.at('route') - a} />.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CORAL, Fine, Label, MapSlab, Poly, Stage, SyncCam, along, camAt, makeCam, partOf, project, ramp, type CamKey} from './kit3d';

export const DEMO_SLAB_FRAMES = 150;
const ROUTE = Array.from({length: 40}, (_, i) => [-2.2 + i * 0.11, 0.02, Math.sin(i / 6) * 0.6]);
const KEYS: CamKey[] = [
  {f: 0, target: [0, 0, 0], dist: 9, yaw: -0.25, pitch: 0.75},
  {f: DEMO_SLAB_FRAMES, target: [0.4, 0, 0], dist: 7.5, yaw: 0.1, pitch: 0.6},
];

export const DemoSlab: React.FC<{drawAt?: number; labelAt?: number}> = ({drawAt = 10, labelAt = 70}) => {
  const f = useCurrentFrame();
  const cam = makeCam(camAt(KEYS, f));
  const k = ramp(f, drawAt, drawAt + 60);
  const head = along(ROUTE, k);
  const p = project(cam, head);
  return (
    <Stage over={<>
      <Label x={p.x} y={p.y - 30} text="THE ROUTE" opacity={ramp(f, labelAt, labelAt + 6)} />
      <Fine text="drawn for scale, not a real route" />
    </>}>
      <SyncCam cam={cam} />
      <ambientLight intensity={1.2} />
      <MapSlab w={5.6} d={3.2} />
      <Poly pts={partOf(ROUTE, k)} width={3} />
      {k > 0 ? (
        <mesh position={[head[0], 0.12, head[2]]}>
          <sphereGeometry args={[0.1, 20, 14]} />
          <meshBasicMaterial color={CORAL} />
        </mesh>
      ) : null}
    </Stage>
  );
};
