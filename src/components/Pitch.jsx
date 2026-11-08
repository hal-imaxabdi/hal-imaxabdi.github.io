import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect } from "react";
import { art } from "../art.js";
import "./pitch.css";

/* THE PITCH: built in code (no mockup artwork).
   A perspective wrapper holds a pitch plane tilted back by `tilt` degrees. Every player is a
   zero-size anchor on that plane (x / y = percent of the pitch, measured from the far goal line)
   with an "upright" child counter-rotated by -tilt, so the figure stands up facing the viewer.
   Both rotations come from one motion value, so a later rotation feature only has to drive it.

   Player fields:
     h     figure height as a fraction of the pitch width (w instead for landscape art)
     fx    where the feet are, as a fraction of the image width (the anchor sits under them)
     cx    where the head is, as a fraction of the image width (the label chip sits above it) */
export const PLAYERS = [
  { id: "profile", label: "Profile", n: "01", me: true, src: art.homeProfile, ratio: 841 / 900, x: 50, y: 64, h: 0.4, fx: 0.47, cx: 0.53 },
  { id: "intel", label: "Intel", n: "02", src: art.intel, ratio: 1047 / 1120, x: 20, y: 33, h: 0.37, fx: 0.5, cx: 0.62 },
  { id: "fieldwork", label: "Field Work", n: "03", src: art.fieldwork, ratio: 969 / 1000, x: 80, y: 30, h: 0.33, fx: 0.55, cx: 0.6 },
  { id: "achievements", label: "Achievements", n: "04", src: art.profile, ratio: 1005 / 1100, x: 12, y: 90, h: 0.4, fx: 0.5, cx: 0.45 },
  { id: "contact", label: "Contact", n: "05", src: art.contact, ratio: 1204 / 1100, x: 90, y: 92, h: 0.37, fx: 0.72, cx: 0.76 },
];

export const TILT = 50;
const EASE = [0.22, 1, 0.36, 1];

function PitchLines() {
  // FIFA proportions on a 68 × 105 field, inset 2 units so the lines sit inside the turf.
  return (
    <svg className="pitch-lines" viewBox="0 0 68 105" preserveAspectRatio="none" aria-hidden="true">
      <rect x="2" y="2" width="64" height="101" />
      <line x1="2" y1="52.5" x2="66" y2="52.5" />
      <circle cx="34" cy="52.5" r="9.15" />
      <circle className="dot" cx="34" cy="52.5" r=".5" />
      {/* far end */}
      <rect x="13.84" y="2" width="40.32" height="16.5" />
      <rect x="24.84" y="2" width="18.32" height="5.5" />
      <circle className="dot" cx="34" cy="13" r=".45" />
      <path d="M26.69 18.5 A9.15 9.15 0 0 0 41.31 18.5" />
      {/* near end */}
      <rect x="13.84" y="86.5" width="40.32" height="16.5" />
      <rect x="24.84" y="97.5" width="18.32" height="5.5" />
      <circle className="dot" cx="34" cy="92" r=".45" />
      <path d="M26.69 86.5 A9.15 9.15 0 0 1 41.31 86.5" />
      {/* corner arcs */}
      <path d="M2 3.2 A1.2 1.2 0 0 0 3.2 2 M64.8 2 A1.2 1.2 0 0 0 66 3.2 M2 101.8 A1.2 1.2 0 0 1 3.2 103 M64.8 103 A1.2 1.2 0 0 1 66 101.8" />
    </svg>
  );
}

function Player({ p, i, counter, reduce, onPick }) {
  const figStyle = p.w ? { width: `calc(var(--pw) * ${p.w})` } : { height: `calc(var(--pw) * ${p.h})` };
  return (
    <div className={`pp ${p.me ? "pp-me" : ""}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
      {/* lies flat on the turf under the feet */}
      <span className="pp-shadow" aria-hidden="true" />
      {p.me ? <span className="pp-ring" aria-hidden="true"><i /><i /></span> : <span className="pp-base" aria-hidden="true" />}

      <motion.div className="pp-upright" style={{ rotateX: counter, x: `${-(p.fx ?? 0.5) * 100}%` }}>
        <motion.div
          className="pp-drop"
          initial={reduce ? false : { opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 + i * 0.12, type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.div
            className="pp-float"
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={reduce ? undefined : { delay: 1.8 + i * 0.25, duration: 3.2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.button
              type="button"
              className="pp-btn"
              aria-label={`${p.label}: go to section ${p.n}`}
              onClick={() => onPick(p.id)}
              whileHover={reduce ? undefined : { y: -6 }}
              whileFocus={reduce ? undefined : { y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <span className={`chip ${p.me ? "chip-me" : ""}`} style={{ left: `${p.cx * 100}%` }}>{p.label}</span>
              <img className="pp-fig" src={p.src} alt="" style={{ ...figStyle, aspectRatio: p.ratio }} draggable="false"
                fetchpriority={p.me ? "high" : undefined} />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Pitch({ onPick, players = PLAYERS, tilt: tiltDeg = TILT }) {
  const reduce = useReducedMotion();
  const tilt = useMotionValue(reduce ? tiltDeg : 14);
  const counter = useTransform(tilt, (v) => -v);

  useEffect(() => {
    if (reduce) { tilt.set(tiltDeg); return; }
    const a = animate(tilt, tiltDeg, { duration: 1.3, ease: EASE, delay: 0.1 });
    return () => a.stop();
  }, [reduce, tilt, tiltDeg]);

  return (
    <div className="pitch-stage">
      {/* the fade lives here, not on the 3D plane: opacity would flatten preserve-3d */}
      <motion.div
        className="pitch-view"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <motion.div className="pitch-plane" style={{ rotateX: tilt }}>
          <div className="pitch-turf" aria-hidden="true" />
          <PitchLines />
          <span className="pitch-edge" aria-hidden="true" />
          <div className="pitch-players" role="group" aria-label="Pick a player to explore">
            {players.map((p, i) => <Player key={p.id} p={p} i={i} counter={counter} reduce={reduce} onPick={onPick} />)}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
