import { useId } from "react";

// A small, consistent icon set (24px grid, 2px strokes, square ends) drawn for this site.
const Svg = ({ size = 18, children, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" focusable="false" {...p}>
    {children}
  </svg>
);

export const ArrowRight = (p) => <Svg {...p}><path d="M4 12h15M13 6l6 6-6 6" /></Svg>;
export const ArrowLeft = (p) => <Svg {...p}><path d="M20 12H5M11 6l-6 6 6 6" /></Svg>;
export const ArrowUpRight = (p) => <Svg {...p}><path d="M7 17 17 7M8 7h9v9" /></Svg>;
export const Download = (p) => <Svg {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></Svg>;
export const Mail = (p) => <Svg {...p}><path d="M3 6h18v12H3zM3 7l9 7 9-7" /></Svg>;
export const Copy = (p) => <Svg {...p}><path d="M9 9h11v11H9zM5 15H4V4h11v1" /></Svg>;
export const Check = (p) => <Svg {...p}><path d="m5 12 5 5 9-10" /></Svg>;
export const Close = (p) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>;
export const Menu = (p) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h10" /></Svg>;

// A full-colour football: white leather, a dark centre pentagon, seams and the edge patches.
const ring = (r, a0) => Array.from({ length: 5 }, (_, k) => {
  const a = ((a0 + k * 72) * Math.PI) / 180;
  return [12 + r * Math.cos(a), 12 + r * Math.sin(a)];
});
const pts = (list) => list.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
const BALL_CORE = ring(3.4, -90);
const BALL_OUTER = ring(6.8, -90);
// an outer pentagon sits beyond each corner of the core, one point facing the centre
const BALL_PATCHES = ring(9.6, -90).map(([cx, cy], k) => pts(ring(2.8, 90 + k * 72).map(([x, y]) => [x - 12 + cx, y - 12 + cy])));
export function Ball({ size = 24, ...p }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...p}>
      <defs>
        <radialGradient id={`bs${id}`} cx=".38" cy=".32" r=".75"><stop offset="0" stopColor="#fff" /><stop offset=".7" stopColor="#e6eefb" /><stop offset="1" stopColor="#9fb3d6" /></radialGradient>
        <clipPath id={`bc${id}`}><circle cx="12" cy="12" r="10.6" /></clipPath>
      </defs>
      <circle cx="12" cy="12" r="10.6" fill={`url(#bs${id})`} />
      <g clipPath={`url(#bc${id})`} fill="#0b1630" stroke="#0b1630" strokeWidth=".6" strokeLinejoin="round">
        <polygon points={pts(BALL_CORE)} />
        {BALL_CORE.map(([x, y], k) => <line key={k} x1={x} y1={y} x2={BALL_OUTER[k][0]} y2={BALL_OUTER[k][1]} />)}
        {BALL_PATCHES.map((d, k) => <polygon key={k} points={d} />)}
      </g>
      <circle cx="12" cy="12" r="10.6" fill="none" stroke="#0b1630" strokeWidth=".8" />
    </svg>
  );
}

export const GitHub = ({ size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
export const LinkedIn = ({ size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);
