import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { art } from "../art.js";
import { Ball } from "./Icons.jsx";
import "./pitch.css";

/* THE PITCH: the neon slab artwork (public/art/pitch.webp) on a plane tilted back by TILT degrees.
   The stage has the perspective; a "rig" around the plane turns a few degrees toward the mouse
   (or sways gently on touch screens). Every player is a zero-size anchor on the plane, with an
   upright child counter-rotated by the tilt so the figure stands up facing the viewer.

   Player fields:
     id      the section it opens (see homeSections in router.js)
     x, y    where the feet touch the turf, in percent of the pitch image
     h       figure height as a fraction of the pitch width
     ratio   image width / height
     fx      where the feet are, as a fraction of the image width (the anchor sits under them)
     cx      where the head is, as a fraction of the image width (the label sits above it) */
export const PLAYERS = [
  { id: "profile", label: "Profile", me: true, src: art.homeProfile, ratio: 841 / 900, x: 46, y: 49, h: 0.235, fx: 0.47, cx: 0.54 },
  { id: "intel", label: "Skills", src: art.intel, ratio: 1047 / 1120, x: 30, y: 21, h: 0.2, fx: 0.48, cx: 0.6 },
  { id: "fieldwork", label: "Project", src: art.fieldwork, ratio: 969 / 1000, x: 75, y: 20, h: 0.175, fx: 0.52, cx: 0.68 },
  { id: "achievements", label: "Achievements", src: art.profile, ratio: 1005 / 1100, x: 25, y: 83, h: 0.245, fx: 0.7, cx: 0.33 },
  { id: "contact", label: "Contact", src: art.contact, ratio: 1204 / 1100, x: 81, y: 86, h: 0.235, fx: 0.74, cx: 0.24 },
];

export const TILT = 16;
const EASE = [0.22, 1, 0.36, 1];
const KICK_MS = 620;

function useMedia(q) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [q]);
  return match;
}

function Player({ p, i, counter, reduce, kicking, onKick }) {
  const kick = kicking === p.id;
  return (
    <div className={`pp ${p.me ? "pp-me" : ""} ${kick ? "is-kicking" : ""}`} style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: Math.round(p.y) }}>
      {/* flat on the turf under the feet */}
      <span className="pp-shadow" aria-hidden="true" />
      <span className="pp-ring" aria-hidden="true"><i /><i /><i /></span>

      <motion.div className="pp-upright" style={{ rotateX: counter, x: `${-p.fx * 100}%` }}>
        <motion.div
          className="pp-drop"
          initial={reduce ? false : { opacity: 0, y: -70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + i * 0.12, type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.div
            className="pp-float"
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={reduce ? undefined : { delay: 1.8 + i * 0.25, duration: 3 + i * 0.35, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="pp-kick"
              animate={kick ? { y: [0, -34, -10, 0], rotate: [0, -7, 4, 0], scale: [1, 1.08, 1.03, 1] } : { y: 0, rotate: 0, scale: 1 }}
              transition={{ duration: KICK_MS / 1000, ease: "easeOut", times: [0, 0.35, 0.7, 1] }}
            >
              <motion.button
                type="button"
                className="pp-btn"
                aria-label={`${p.label}: open section`}
                onClick={() => onKick(p.id)}
                whileHover={reduce ? undefined : { y: -12 }}
                whileFocus={reduce ? undefined : { y: -12 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                <span className="tag" style={{ left: `${p.cx * 100}%` }} aria-hidden="true">
                  <span className="chip">{p.label}</span>
                  <span className="tag-line" />
                </span>
                <img className="pp-fig" src={p.src} alt="" style={{ height: `calc(var(--pw) * ${p.h})`, aspectRatio: p.ratio }}
                  draggable="false" decoding="async" fetchpriority={p.me ? "high" : undefined} />
              </motion.button>
              {/* the ball that flies off on kick-off */}
              <motion.span
                className="pp-ball"
                style={{ left: `${p.fx * 100}%` }}
                aria-hidden="true"
                initial={false}
                animate={kick
                  ? { opacity: [0, 1, 1, 0], x: ["-50%", "40%", "260%", "520%"], y: ["0%", "-160%", "-260%", "-200%"], rotate: [0, 200, 420, 600], scale: [0.6, 1, 0.9, 0.6] }
                  : { opacity: 0, x: "-50%", y: "0%", rotate: 0, scale: 0.6 }}
                transition={{ duration: kick ? KICK_MS / 1000 : 0, ease: "easeOut" }}
              >
                <Ball size="100%" />
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Pitch({ onPick, players = PLAYERS }) {
  const reduce = useReducedMotion();
  const noHover = useMedia("(hover: none)");     // phones and tablets: sway instead of following the mouse
  const [kicking, setKicking] = useState(null);
  const timer = useRef(0);

  // the plane settles back from a steeper angle on load
  const tilt = useMotionValue(reduce ? TILT : 38);
  const counter = useTransform(tilt, (v) => -v);
  useEffect(() => {
    if (reduce) { tilt.set(TILT); return; }
    const a = animate(tilt, TILT, { duration: 1.4, ease: EASE, delay: 0.1 });
    return () => a.stop();
  }, [reduce, tilt]);

  // parallax: the rig turns a few degrees toward the mouse
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 16, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 60, damping: 16, mass: 0.7 });
  const rotY = useTransform(sx, (v) => v * 7);
  const rotX = useTransform(sy, (v) => v * -4);
  const track = !reduce && !noHover;
  useEffect(() => {
    if (!track) { mx.set(0); my.set(0); return; }
    const move = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const leave = () => { mx.set(0); my.set(0); };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [track, mx, my]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const kick = (id) => {
    if (kicking) return;
    if (reduce) { onPick(id); return; }
    setKicking(id);
    timer.current = setTimeout(() => onPick(id), KICK_MS);
  };

  const sway = !reduce && noHover;

  return (
    <div className="pitch-stage">
      {/* the fade lives here, not on the 3D rig: opacity would flatten preserve-3d */}
      <motion.div
        className="pitch-view"
        initial={reduce ? false : { opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <motion.div className="pitch-rig" style={{ rotateX: rotX, rotateY: rotY }}>
          <motion.div
            className="pitch-sway"
            animate={sway ? { rotateY: [-3, 3, -3], rotateX: [1.5, -1.5, 1.5], y: [0, -6, 0] } : { rotateY: 0, rotateX: 0, y: 0 }}
            transition={sway ? { duration: 10, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
          >
            <motion.div className="pitch-plane" style={{ rotateX: tilt }}>
              <img className="pitch-img" src={art.pitch} alt="" aria-hidden="true" draggable="false" fetchpriority="high" />
              <div className="pitch-players" role="group" aria-label="Pick a player to explore">
                {players.map((p, i) => (
                  <Player key={p.id} p={p} i={i} counter={counter} reduce={reduce} kicking={kicking} onKick={kick} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
