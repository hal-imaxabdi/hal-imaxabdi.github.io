import { useEffect, useRef } from "react";

/* A real 3D football drawn on a small canvas, no libraries.
   Every pixel of the disc is a point on a sphere; we rotate it into the ball's own frame and ask
   which face of a truncated icosahedron (12 pentagons + 20 hexagons, the classic ball) it falls on.
   Then it is lit like a solid object: diffuse + a specular shine + a soft blue rim light. */

// 12 icosahedron vertices = pentagon centres; 20 face centres = hexagon centres
const PHI = (1 + Math.sqrt(5)) / 2;
const norm = ([x, y, z]) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; };
const ICO = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
].map(norm);
const FACES = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];
const HEX = FACES.map(([a, b, c]) => norm([0, 1, 2].map((k) => ICO[a][k] + ICO[b][k] + ICO[c][k])));
// a radial ray hits the face plane that maximises (n·p)/d, where d is that face's distance from the centre
const D_PENT = 2.32744, D_HEX = 2.26728;

const L = norm([-0.45, 0.6, 0.66]);      // light from the top left, towards the viewer
const H = norm([L[0], L[1], L[2] + 1]);  // half vector for the shine

function rotation(ax, ay) {
  const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
  // R = Ry * Rx, applied to view-space normals to get ball-space points
  return [cy, sx * sy, cx * sy, 0, cx, -sx, -sy, sx * cy, cx * cy];
}

function draw(ctx, img, size, ax, ay, az = 0) {
  const d = img.data, r = size / 2, R = rotation(ax, ay), cz = Math.cos(az), sz = Math.sin(az);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const i = (py * size + px) * 4;
      const x = (px + 0.5 - r) / r, y = (r - py - 0.5) / r, rr = x * x + y * y;
      if (rr > 1) { d[i + 3] = 0; continue; }
      const z = Math.sqrt(1 - rr);
      // roll: turn the view in the screen plane first (the axis a ball rolls around when it moves sideways)
      const qx = cz * x - sz * y, qy = sz * x + cz * y;
      const bx = R[0] * qx + R[1] * qy + R[2] * z, by = R[3] * qx + R[4] * qy + R[5] * z, bz = R[6] * qx + R[7] * qy + R[8] * z;
      let best = -9, second = -9, pent = false;
      for (let k = 0; k < 12; k++) {
        const s = (ICO[k][0] * bx + ICO[k][1] * by + ICO[k][2] * bz) / D_PENT;
        if (s > best) { second = best; best = s; pent = true; } else if (s > second) second = s;
      }
      for (let k = 0; k < 20; k++) {
        const s = (HEX[k][0] * bx + HEX[k][1] * by + HEX[k][2] * bz) / D_HEX;
        if (s > best) { second = best; best = s; pent = false; } else if (s > second) second = s;
      }
      // base colour: navy pentagons, white panels, thin grey seams between faces
      const gap = best - second;
      let cr, cg, cb;
      if (gap < 0.0035) { cr = 120; cg = 136; cb = 168; }
      else if (pent) { cr = 14; cg = 30; cb = 70; }
      else { cr = 238; cg = 244; cb = 255; }
      // lighting
      const diff = Math.max(0, x * L[0] + y * L[1] + z * L[2]);
      const spec = Math.pow(Math.max(0, x * H[0] + y * H[1] + z * H[2]), 40);
      const rim = Math.pow(1 - z, 2.4);
      const lit = 0.28 + 0.78 * diff;
      d[i] = Math.min(255, cr * lit + 255 * spec * 0.55 + 40 * rim);
      d[i + 1] = Math.min(255, cg * lit + 255 * spec * 0.55 + 110 * rim);
      d[i + 2] = Math.min(255, cb * lit + 255 * spec * 0.6 + 255 * rim);
      // soft anti-aliased edge
      d[i + 3] = Math.min(255, (1 - Math.sqrt(rr)) * r * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
}

/* size: CSS pixels. spin: radians per second around a tilted axis.
   rollRef: when given, the parent moves the ball and keeps its travelled distance (px) in rollRef.current,
   and the ball turns to match it. still: draw one frame and stop. */
export default function Ball3D({ size = 56, spin = 1.2, className = "", rollRef, still = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const px = Math.round(size * dpr);
    canvas.width = px; canvas.height = px;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(px, px);
    let raf, t0 = performance.now(), visible = true;
    const frame = (now) => {
      const t = (now - t0) / 1000;
      if (rollRef) {
        // rolling: the turn matches the distance travelled (distance / radius), clockwise when moving right
        draw(ctx, img, px, 0.4, 0.6, (rollRef.current || 0) / (size / 2));
      } else {
        const ay = still ? 0.6 : t * spin * 0.35 + 0.6;
        const ax = still ? 0.4 : t * spin + 0.4;
        draw(ctx, img, px, ax, ay);
      }
      if (!still && visible) raf = requestAnimationFrame(frame);
    };
    // only animate while on screen
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [size, spin, still, rollRef]);
  return <canvas ref={ref} className={`ball3d ${className}`} style={{ width: size, height: size }} aria-hidden="true" />;
}

// smooth start and stop
const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

/* The ball rolling left to right along its parent's width, pausing at each end, then back.
   Its shadow travels with it. With reduce, it just rests at the start. */
export function RollingBall({ size = 56, period = 7, reduce = false, className = "" }) {
  const track = useRef(null), mover = useRef(null), roll = useRef(0);
  useEffect(() => {
    if (reduce) return;
    let raf, t0 = performance.now();
    const tick = (now) => {
      const w = Math.max(0, (track.current?.clientWidth || 0) - size);
      const u = (((now - t0) / 1000) % period) / period;
      // 0-0.42 roll right, hold, 0.5-0.92 roll back, hold
      const s = u < 0.42 ? ease(u / 0.42) : u < 0.5 ? 1 : u < 0.92 ? 1 - ease((u - 0.5) / 0.42) : 0;
      const x = s * w;
      roll.current = x;
      if (mover.current) mover.current.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [size, period, reduce]);
  return (
    <span ref={track} className={`ball-track ${className}`} aria-hidden="true">
      <span ref={mover} className="ball-mover" style={{ width: size }}>
        <Ball3D size={size} rollRef={roll} still={reduce} />
        <span className="ball-shadow" />
      </span>
    </span>
  );
}
