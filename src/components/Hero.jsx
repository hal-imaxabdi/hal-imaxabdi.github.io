import { motion, useReducedMotion } from "framer-motion";
import { me } from "../data.js";
import { scrollToSection } from "../router.js";
import Pitch from "./Pitch.jsx";
import "./hero.css";

const EASE = [0.22, 1, 0.36, 1];

// Faint telemetry dial in the top-right corner (decoration only).
function HudCircle() {
  return (
    <svg className="hud" viewBox="0 0 240 240" aria-hidden="true">
      <circle cx="120" cy="120" r="108" className="hud-faint" />
      <g className="hud-spin">
        <path d="M120 20 A100 100 0 0 1 214 86" />
        <path d="M206 160 A100 100 0 0 1 150 215" />
        <path d="M40 180 A100 100 0 0 1 26 96" />
      </g>
      <circle cx="120" cy="120" r="78" className="hud-faint" strokeDasharray="2 6" />
      <circle cx="120" cy="120" r="46" />
      <circle cx="120" cy="120" r="30" className="hud-faint" />
      <path d="M120 66 v14 M120 160 v14 M66 120 h14 M160 120 h14" />
      <path d="M228 120 h60 M240 98 h40" className="hud-faint" />
      <text x="120" y="8" textAnchor="middle">SPORTS TELEMETRY</text>
      <text x="196" y="210">TRK 05</text>
    </svg>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const [firstName, ...rest] = me.name.split(" ");

  const pick = (id) => {
    history.replaceState(null, "", `#${id}`);
    scrollToSection(id);
  };

  // entrance: copy slides in from the left, staggered (skipped for reduced motion)
  const enter = (delay, x = -40) => ({
    initial: reduce ? false : { opacity: 0, x },
    animate: { opacity: 1, x: 0 },
    transition: { delay, duration: 0.8, ease: EASE },
  });

  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <div className="hero-bg" aria-hidden="true">
        <HudCircle />
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-name" id="hero-name">
            <motion.span className="line line-1" {...enter(0.1)}>{firstName}</motion.span>
            <motion.span className="line line-2" {...enter(0.22)}>{rest.join(" ")}</motion.span>
          </h1>
          <motion.p className="hero-motto" {...enter(0.45, -20)}>
            <span>I observe.</span><i aria-hidden="true">/</i><span>I investigate.</span><i aria-hidden="true">/</i><span>I protect.</span>
          </motion.p>
          <motion.p className="hero-hint" {...enter(0.6, -20)}>
            <span className="hint-arrow" aria-hidden="true">▸</span> Pick a player to explore
          </motion.p>
        </div>

        <Pitch onPick={pick} />
      </div>
    </section>
  );
}
