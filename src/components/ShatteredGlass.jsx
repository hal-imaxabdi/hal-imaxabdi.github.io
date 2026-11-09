import Ball3D from "./Ball3D.jsx";

/* Glass shattered by a ball, drawn the way real impact damage looks:
   - a crushed, frosted zone right where the ball hit, full of tiny chips
   - radial cracks running out from the impact, jagged and thinning as they go
   - concentric "spider web" cracks joining them, bowed slightly outward
   - a few loose pieces tilted to catch the light, glints on the fractures
   - the 3D ball sitting in the hole it made.
   The pattern is generated once from a fixed seed, so it is the same on every visit. */

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const C = 300;                                   // impact point in the 600x600 drawing
const RINGS = [26, 52, 90, 140, 200, 262, 300];  // where radial cracks bend / rings cross

function build(seed) {
  const r = rng(seed);
  const n = 17;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const base = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.22;
    const len = 4 + Math.floor(r() * 4); // how many rings this crack reaches
    let a = base;
    pts.push(RINGS.slice(0, len).map((rad) => {
      a += (r() - 0.5) * 0.09;          // cracks wander a little
      const rr = rad * (0.9 + r() * 0.2);
      return [C + Math.cos(a) * rr, C + Math.sin(a) * rr];
    }));
  }
  const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

  // radial cracks, segment by segment so they can thin out with distance
  const radial = [];
  pts.forEach((line) => {
    let prev = [C + (r() - 0.5) * 6, C + (r() - 0.5) * 6];
    line.forEach((p, j) => {
      // a small kink in the middle of each segment makes it look fractured, not drawn
      const mx = (prev[0] + p[0]) / 2 + (r() - 0.5) * 6, my = (prev[1] + p[1]) / 2 + (r() - 0.5) * 6;
      radial.push({ d: `M${f(prev)} L${mx.toFixed(1)} ${my.toFixed(1)} L${f(p)}`, j });
      prev = p;
    });
  });

  // spider-web rings between neighbouring cracks (not every gap, like real glass)
  const rings = [];
  const panes = [];
  for (let i = 0; i < n; i++) {
    const A = pts[i], B = pts[(i + 1) % n];
    for (let j = 0; j < 5; j++) {
      if (!A[j] || !B[j]) continue;
      if (r() < 0.78 - j * 0.1) {
        const mx = (A[j][0] + B[j][0]) / 2, my = (A[j][1] + B[j][1]) / 2;
        const bow = 1.06 + r() * 0.06; // bowed outward from the impact
        const cx = C + (mx - C) * bow, cy = C + (my - C) * bow;
        rings.push({ d: `M${f(A[j])} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${f(B[j])}`, j });
      }
      // some panes tilt and catch the light
      if (A[j + 1] && B[j + 1] && r() < 0.26) {
        panes.push({ d: `M${f(A[j])} L${f(B[j])} L${f(B[j + 1])} L${f(A[j + 1])} Z`, o: 0.05 + r() * 0.12, j });
      }
    }
  }

  // the crushed zone: lots of tiny chips around the hole
  const chips = [];
  for (let k = 0; k < 34; k++) {
    const a = r() * Math.PI * 2, d = 30 + r() * 26, s = 3 + r() * 6;
    const x = C + Math.cos(a) * d, y = C + Math.sin(a) * d;
    chips.push({ d: `M${(x).toFixed(1)} ${(y - s).toFixed(1)} L${(x + s * 0.9).toFixed(1)} ${(y + s * 0.4).toFixed(1)} L${(x - s * 0.7).toFixed(1)} ${(y + s * 0.6).toFixed(1)} Z`, o: 0.12 + r() * 0.3 });
  }

  // glints where cracks meet
  const glints = pts.flatMap((line) => line.slice(1, 4)).filter(() => r() < 0.22).map((p) => ({ x: p[0], y: p[1], s: 3 + r() * 4 }));

  // loose shards that broke off and drift
  const loose = Array.from({ length: 6 }, () => {
    const a = r() * Math.PI * 2, d = 230 + r() * 70, s = 8 + r() * 14;
    const x = C + Math.cos(a) * d, y = C + Math.sin(a) * d;
    return `M${x.toFixed(1)} ${(y - s).toFixed(1)} L${(x + s).toFixed(1)} ${(y + s * 0.3).toFixed(1)} L${(x - s * 0.4).toFixed(1)} ${(y + s * 0.8).toFixed(1)} Z`;
  });

  return { radial, rings, panes, chips, glints, loose };
}

const SHAPES = { a: build(11), b: build(29) };
const W = [1.7, 1.4, 1.1, 0.85, 0.65, 0.5, 0.4]; // crack width by distance

export default function ShatteredGlass({ variant = "a", ball = false, reduce = false, className = "" }) {
  const g = SHAPES[variant];
  const id = `sg-${variant}`;
  return (
    <div className={`sg ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 600">
        <defs>
          {/* the damage fades out the further it is from the impact */}
          <radialGradient id={`${id}-fade`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset=".55" stopColor="#fff" stopOpacity=".75" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={`${id}-mask`}><rect width="600" height="600" fill={`url(#${id}-fade)`} /></mask>
          <radialGradient id={`${id}-frost`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#d6ecff" stopOpacity=".28" />
            <stop offset=".6" stopColor="#5aa2ff" stopOpacity=".1" />
            <stop offset="1" stopColor="#5aa2ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g mask={`url(#${id}-mask)`}>
          {g.panes.map((p, k) => <path key={k} d={p.d} className="sg-pane" style={{ opacity: p.o }} />)}
          <circle cx={C} cy={C} r="64" fill={`url(#${id}-frost)`} />
          {/* a faint blue glow under each crack, then the crack itself */}
          <g className="sg-glow">
            {g.radial.map((s, k) => <path key={k} d={s.d} strokeWidth={W[s.j] * 3} />)}
          </g>
          <g className="sg-crack">
            {g.radial.map((s, k) => <path key={k} d={s.d} strokeWidth={W[s.j]} />)}
            {g.rings.map((s, k) => <path key={k} d={s.d} strokeWidth={W[s.j + 1] * 0.9} />)}
          </g>
          {g.chips.map((c, k) => <path key={k} d={c.d} className="sg-chip" style={{ opacity: c.o }} />)}
          {g.glints.map((p, k) => (
            <path key={k} className="sg-glint" d={`M${p.x - p.s} ${p.y}h${p.s * 2}M${p.x} ${p.y - p.s}v${p.s * 2}`} />
          ))}
        </g>
        <g className="sg-loose">{g.loose.map((d, k) => <path key={k} d={d} />)}</g>
      </svg>
      {ball && <span className="sg-ball"><Ball3D size={58} spin={0.5} still={reduce} /></span>}
    </div>
  );
}
