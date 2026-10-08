// Review composition: every chart planned for the video, one after another (6 s each). Not part of the render.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Bars, CountUp, HBars, Pie, SplitBar} from './kit/charts';
import {DarkPaper, Finish, Highlight, Note, Tag} from './kit/look';
import {COTTON_BALES_K, ENSLAVED, EXPORTS_1860, SLAVE_STATES_1860, TRADE_BY_DECADE, VALUE_1860, WHITE_FAMILIES_1860} from './data/charts';

export const CHART_SECS = 6;
const F = CHART_SECS * 30;

const Frame: React.FC<{title: string; tag: string; children: React.ReactNode}> = ({title, tag, children}) => (
  <AbsoluteFill>
    <DarkPaper />
    <Highlight text={title} x={110} y={70} size={84} at={0} />
    {children}
    <Tag text={tag} />
    <Finish />
  </AbsoluteFill>
);

const pct = (a: number, total: number) => `${Math.round((a / total) * 100)}%`;

const PieWho: React.FC = () => {
  const s = SLAVE_STATES_1860;
  const t = s.enslaved + s.freeBlack + s.white;
  return (
    <Frame title="WHO LIVED IN THE SLAVE STATES, 1860" tag="U.S. Census, 1860 · population of the 15 slave states">
      <Pie cx={760} cy={600} r={300} at={4} seed={3} slices={[
        {label: 'enslaved', value: s.enslaved, subject: true, pct: pct(s.enslaved, t), note: 'about 1 in 3 people', labelAt: [1140, 470]},
        {label: 'free Black', value: s.freeBlack, pct: pct(s.freeBlack, t), labelAt: [1140, 700]},
        {label: 'white', value: s.white, pct: pct(s.white, t), labelAt: [360, 860]},
      ]} />
    </Frame>
  );
};

const PieFamilies: React.FC = () => {
  const s = WHITE_FAMILIES_1860;
  const t = s.none + s.small + s.planters;
  return (
    <Frame title="WHITE FAMILIES, 1860" tag="U.S. Census, 1860 · families and slaveholders, 15 slave states">
      <Pie cx={760} cy={600} r={300} at={4} seed={5} slices={[
        {label: 'owned no one', value: s.none, subject: true, pct: pct(s.none, t), note: 'about 3 in 4', labelAt: [1110, 800]},
        {label: 'enslaved 1 to 19', value: s.small, pct: pct(s.small, t), labelAt: [380, 300]},
        {label: 'planters (20 or more)', value: s.planters, pct: pct(s.planters, t), labelAt: [1100, 250]},
      ]} />
    </Frame>
  );
};

const Population: React.FC = () => (
  <Frame title="ENSLAVED PEOPLE COUNTED" tag="U.S. Census, 1790–1860">
    <Bars x={200} y={260} w={1520} h={560} max={4.2e6} at={4} per={5} bars={ENSLAVED.map((d) => ({label: String(d.year), value: d.n, subject: d.year === 1830,
      show: d.n >= 1e6 ? `${(d.n / 1e6).toFixed(1)}M` : `${Math.round(d.n / 1000)}K`}))} />
    <Note text="nearly tripled by 1830" x={760} y={170} size={50} rot={-3} at={70} />
  </Frame>
);

const Twin: React.FC = () => (
  <Frame title="COTTON AND SLAVERY GREW TOGETHER" tag="Cotton: Historical Statistics of the U.S., K 554 · People: U.S. Census">
    <Note text="cotton grown" x={210} y={190} size={44} rot={-2} at={2} color="#ffffff" />
    <Bars x={200} y={250} w={1520} h={250} max={4000} at={4} per={4} seed={7} valueEvery={[0, 7]} bars={COTTON_BALES_K.map((d) => ({label: '', value: d.n, subject: true, show: d.n >= 1000 ? `${(d.n / 1000).toFixed(1)}M bales` : `${d.n}K bales`}))} />
    <Note text="enslaved people" x={210} y={560} size={44} rot={-2} at={30} color="#ffffff" />
    <Bars x={200} y={620} w={1520} h={250} max={4.2e6} at={32} per={4} seed={8} valueEvery={[0, 7]} bars={ENSLAVED.map((d) => ({label: String(d.year), value: d.n, show: `${(d.n / 1e6).toFixed(1)}M`}))} />
  </Frame>
);
const fmt = (n: number) => n.toLocaleString('en-US');

const Exports: React.FC = () => (
  <Frame title="WHAT AMERICA SOLD THE WORLD, 1860" tag="Historical Statistics of the U.S. · merchandise exports by value, 1860">
    <SplitBar x={160} y={420} w={1600} h={200} at={6} parts={[{label: 'raw cotton', value: EXPORTS_1860.cotton, subject: true}, {label: 'everything else', value: EXPORTS_1860.other}]} />
  </Frame>
);

const Value: React.FC = () => (
  <Frame title="WHERE THE WEALTH WAS, 1860" tag="Historical Statistics of the U.S., Bb213 · U.S. Census 1860">
    <HBars x={160} y={400} w={1150} rowH={130} gap={190} max={3.2e9} at={6} rows={[
      {label: 'four million enslaved people, counted as property', parts: [{label: 'enslaved', value: VALUE_1860.enslaved, subject: true}]},
      {label: 'all the railroads + all the factories', parts: [{label: 'railroads', value: VALUE_1860.railroads}, {label: 'factories', value: VALUE_1860.manufacturing}]},
    ]} />
  </Frame>
);

const Trade: React.FC = () => (
  <Frame title="SOLD SOUTH, DECADE BY DECADE" tag="Tadman, Speculators and Slaves (1989) · net moves, Upper to Lower South">
    <Bars x={200} y={260} w={1520} h={560} max={300000} at={4} per={5} seed={9} bars={TRADE_BY_DECADE.map((d) => ({label: d.decade, value: d.n, subject: d.decade === '1830s', show: `${Math.round(d.n / 1000)}K`}))} />
    <Note text="about 1 million people in all" x={230} y={250} size={50} rot={-3} at={60} />
  </Frame>
);

const Counter: React.FC = () => (
  <Frame title="THE CENSUS COUNTER" tag="U.S. Census, 1790–1860 · runs in a corner through ch02, ch04, ch10">
    <CountUp from={0} to={697681} at={6} x={200} y={320} label="enslaved · 1790" />
    <CountUp from={697681} to={2009043} at={50} x={200} y={540} color="#FF6F61" label="enslaved · 1830" />
    <CountUp from={2009043} to={3953760} at={100} x={200} y={760} label="enslaved · 1860" />
  </Frame>
);

export const CHARTS = [PieWho, PieFamilies, Population, Twin, Exports, Value, Trade, Counter];
export const ChartPreview: React.FC = () => (
  <AbsoluteFill style={{background: '#0d0c09'}}>
    {CHARTS.map((C, i) => (
      <Sequence key={i} from={i * F} durationInFrames={F}><C /></Sequence>
    ))}
  </AbsoluteFill>
);
