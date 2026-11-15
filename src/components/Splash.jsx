import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Ball } from "./Icons.jsx";
import "./splash.css";

/* KICK-OFF: the opening screen, shown once per visit before the home page.
   The pitch lines draw themselves, the ball drops onto the centre spot, a counter runs to 100,
   then the ball is struck and the screen splits apart diagonally to reveal the site.
   Click or press any key to skip.

   Timings (milliseconds): how long the build-up lasts, and how long the split takes. */
const BUILD_MS = 2100;
const SPLIT_MS = 900;
const EASE = [0.76, 0, 0.24, 1];

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const [count, setCount] = useState(0);

  // the counter, 0 to 100 across the build-up
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (BUILD_MS - 250));
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // build-up, then the split; skipping jumps straight to the split
  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), BUILD_MS);
    const skip = () => setLeaving(true);
    window.addEventListener("keydown", skip);
    return () => { clearTimeout(t); window.removeEventListener("keydown", skip); };
  }, []);
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onDone, SPLIT_MS);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  const half = (dir) => ({ animate: leaving ? { x: `${dir * 105}%` } : { x: "0%" }, transition: { duration: SPLIT_MS / 1000, ease: EASE } });

  return (
    <div className={`splash ${leaving ? "is-leaving" : ""}`} onClick={() => setLeaving(true)} role="presentation">
      {/* the two halves that slide apart */}
      <motion.div className="sp-half sp-a" {...half(-1)}><i /></motion.div>
      <motion.div className="sp-half sp-b" {...half(1)}><i /></motion.div>

      <motion.div className="sp-stage" animate={leaving ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
        <div className="sp-pitch">
          <svg viewBox="0 0 600 380" aria-hidden="true">
            <rect className="l l1" x="10" y="10" width="580" height="360" pathLength="1" />
            <path className="l l2" d="M300 10v360" pathLength="1" />
            <circle className="l l3" cx="300" cy="190" r="62" pathLength="1" />
            <rect className="l l4" x="10" y="100" width="92" height="180" pathLength="1" />
            <rect className="l l4" x="498" y="100" width="92" height="180" pathLength="1" />
            <path className="l l5" d="M102 150a52 52 0 0 1 0 80M498 150a52 52 0 0 0 0 80" pathLength="1" />
          </svg>
          <span className="sp-spot" aria-hidden="true" />
          {/* the ball: drops in, settles, then is struck up and away */}
          <motion.span className="sp-ball" aria-hidden="true"
            initial={{ y: "-340%", opacity: 0, rotate: -180 }}
            animate={leaving
              ? { x: "620%", y: "-520%", scale: 0.5, rotate: 540, opacity: 0 }
              : { y: ["-340%", "0%", "-46%", "0%", "-14%", "0%"], opacity: 1, rotate: [-180, 0, 40, 90, 110, 120] }}
            transition={leaving ? { duration: 0.55, ease: "easeIn" } : { delay: 0.75, duration: 1.05, times: [0, 0.42, 0.62, 0.8, 0.9, 1], ease: "easeOut" }}>
            <Ball size="100%" />
          </motion.span>
        </div>

        {/* the counter and label sit right under the pitch, so the whole thing fits any screen */}
        <div className="sp-foot">
          <p className="sp-count" aria-hidden="true">{String(count).padStart(3, "0")}</p>
          <p className="sp-label">{count < 100 ? "Getting ready for kick-off" : "Kick-off"}</p>
        </div>
      </motion.div>
      <span className="sr-only">Loading. Press any key to skip.</span>
    </div>
  );
}
