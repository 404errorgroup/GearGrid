import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Ellipse, Path, Polygon } from 'react-native-svg';

// Rastgele arka plan üreticisi: her seed farklı bir sahne (gün saati x renk x dağ düzeni x spora özel öğeler).
const HUE = { camping: 28, 'ultra-trail': 150, paragliding: 205, 'rock-climbing': 8, kitesurf: 190, 'mtb-downhill': 35, scuba: 215 };
const TOD = [
  { n: 'gün', top: [205, 70, 52], bot: [200, 75, 80], sun: [48, 95, 72], m: 0.5 },
  { n: 'şafak', top: [250, 45, 38], bot: [22, 90, 70], sun: [40, 100, 75], m: 0.35 },
  { n: 'akşam', top: [285, 45, 30], bot: [12, 85, 58], sun: [30, 100, 65], m: 0.28 },
  { n: 'gece', top: [230, 55, 8], bot: [225, 45, 22], sun: [210, 20, 88], m: 0.12 },
];
const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const hex = (h, s, l) => {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1))).toString(16).padStart(2, '0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
};
const peaks = (r, base, amp, n) => {
  let d = `M0 800 L0 ${base}`;
  for (let i = 1; i <= n; i++) d += ` L${i === n ? 400 : (400 / n) * (i - r() * 0.7)} ${base - r() * amp}`;
  return d + ' L400 800 Z';
};

function Scene({ sportId, seed }) {
  const r = rng(seed); const t = TOD[Math.floor(r() * 4)]; const hj = (r() - 0.5) * 50; const hue = HUE[sportId] + hj;
  const night = t.n === 'gece'; let k = 0; const els = [];
  if (night) for (let i = 0; i < 30; i++) els.push(<Circle key={k++} cx={r() * 400} cy={r() * 400} r={0.6 + r() * 1.2} fill="#fff" opacity={0.7} />);
  const sx = 60 + r() * 280, sy = 90 + r() * 180, sr = 24 + r() * 22, sun = hex(...t.sun);
  els.push(<Circle key={k++} cx={sx} cy={sy} r={sr * 2.2} fill={sun} opacity={0.2} />, <Circle key={k++} cx={sx} cy={sy} r={sr} fill={sun} />);
  for (let i = 0; i < (sportId === 'paragliding' ? 5 : 2); i++) {
    const cx = r() * 400, cy = 120 + r() * 260, rx = 40 + r() * 50;
    els.push(<Ellipse key={k++} cx={cx} cy={cy} rx={rx} ry={rx * 0.28} fill="#fff" opacity={night ? 0.07 : 0.35} />);
  }
  [0, 1, 2].forEach((i) => els.push(<Path key={k++} d={peaks(r, [430, 530, 640][i], [170, 130, 90][i], 5 + i * 2)} fill={hex(hue, 30 + i * 8, Math.round((t.m * 70 + 10) * (1 - i * 0.28)))} />));
  const dark = hex(hue, 20, Math.round(t.m * 40 + 6));
  if (sportId === 'rock-climbing') {
    els.push(<Polygon key={k++} points={`0,220 ${70 + r() * 60},${180 + r() * 80} ${100 + r() * 50},800 0,800`} fill={dark} />,
      <Polygon key={k++} points={`400,260 ${330 - r() * 60},${200 + r() * 80} ${300 - r() * 50},800 400,800`} fill={dark} />);
  } else if (sportId === 'paragliding' || sportId === 'kitesurf') {
    for (let i = 0; i < 3; i++) {
      const x = 30 + r() * 300, y = 300 + r() * 250;
      els.push(<Path key={k++} d={`M${x} ${y} Q${x + 32} ${y - 34} ${x + 64} ${y} Q${x + 32} ${y + 8} ${x} ${y}`} fill={hex(r() * 360, 80, 55)} />,
        <Path key={k++} d={`M${x + 6} ${y + 3} L${x + 32} ${y + 36} L${x + 58} ${y + 3}`} stroke="#fff" strokeWidth={1} fill="none" opacity={0.7} />);
    }
  } else if (sportId === 'ultra-trail' || sportId === 'mtb-downhill') {
    els.push(<Path key={k++} d={`M${100 + r() * 200} 800 C${r() * 400} 730 ${r() * 400} 690 ${100 + r() * 200} 630`} stroke={hex(40, 40, 75)} strokeWidth={5} fill="none" opacity={0.6} />);
  } else if (sportId === 'scuba') {
    els.push(<Rect key={k++} width="400" height="800" fill="#0b3a6b" opacity={0.75} />);
    for (let i = 0; i < 14; i++) els.push(<Circle key={k++} cx={r() * 400} cy={r() * 800} r={3 + r() * 9} stroke="#fff" strokeWidth={1} fill="none" opacity={0.5} />);
  } else {
    for (let i = 0; i < 7; i++) { const x = r() * 400, y = 670 + r() * 100, h = 40 + r() * 50;
      els.push(<Polygon key={k++} points={`${x},${y - h} ${x - h * 0.35},${y} ${x + h * 0.35},${y}`} fill={hex(140, 35, Math.round(t.m * 35 + 8))} />); }
    const x = 120 + r() * 160;
    if (night || t.n === 'akşam') els.push(<Circle key={k++} cx={x} cy={705} r={40} fill="#f59e0b" opacity={0.25} />);
    els.push(<Polygon key={k++} points={`${x},672 ${x - 30},706 ${x + 30},706`} fill={hex(25, 85, 55)} />);
  }
  if (sportId === 'kitesurf') els.push(<Rect key={k++} y="560" width="400" height="240" fill="#0e7490" opacity={0.8} />);
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
      <Defs><LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={hex(t.top[0] + hj / 2, t.top[1], t.top[2])} /><Stop offset="1" stopColor={hex(t.bot[0] + hj / 3, t.bot[1], t.bot[2])} />
      </LinearGradient></Defs>
      <Rect width="400" height="800" fill="url(#sky)" />{els}
    </Svg>
  );
}
export default memo(Scene);
