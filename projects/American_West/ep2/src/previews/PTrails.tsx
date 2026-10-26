// Check of Ep 2's map layer (src/kit/trails.tsx): the trails, rails, Long Walk and treaty land over Ep 1's series map.
import React from 'react';
import {LINES, MPin, MRegion, MRoute, WestMap} from '../kit/ch01_extra';
import {MHerd, MTrail, TLINES, TPL, TREGIONS} from '../kit/trails';

export const PTRAILS_FRAMES = 120;
export const PTrails: React.FC = () => (
  <WestMap keys={[{f: 0, x: 2350, y: 1450, z: 0.42, tilt: 32}]}>
    {(api) => <>
      <MRoute api={api} pts={LINES.up} at={-99} width={6} opacity={0.5} />
      <MRoute api={api} pts={TLINES.kansasPacific} at={-99} width={6} />
      <MRoute api={api} pts={TLINES.santaFe} at={-99} width={5} opacity={0.6} />
      <MTrail api={api} pts={TLINES.chisholm} at={0} color="#ff8a75" />
      <MTrail api={api} pts={TLINES.western} at={10} />
      <MTrail api={api} pts={TLINES.shawnee} at={20} />
      <MTrail api={api} pts={TLINES.goodnightLoving} at={30} />
      <MHerd api={api} pts={TLINES.chisholm} at={0} w={90} />
      <MTrail api={api} pts={TLINES.longWalk} at={40} color="#9fb3b8" />
      <MRegion api={api} pts={TREGIONS.greatSioux1868} at={50} />
      <MRegion api={api} pts={TREGIONS.blackHills} at={55} color="#ff8a75" />
      <MPin api={api} at={TPL.abilene} show={60} label="Abilene" />
      <MPin api={api} at={TPL.dodgeCity} show={62} label="Dodge City" side="l" />
      <MPin api={api} at={TPL.fortSumner} show={64} label="Fort Sumner" side="l" />
      <MPin api={api} at={TPL.sanAntonio} show={66} label="San Antonio" />
      <MPin api={api} at={TPL.deadwood} show={68} label="Deadwood" />
    </>}
  </WestMap>
);
