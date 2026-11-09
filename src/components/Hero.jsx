import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { caseStudies, me } from "../data.js";
import { scrollToSection } from "../router.js";
import { earned } from "./Certs.jsx";
import Pitch from "./Pitch.jsx";
import "./hero.css";

const EASE = [0.22, 1, 0.36, 1];
const LINES = [
  "$ tail -f /var/log/auth.log",
  "[WARN]   14 failed logins from 203.0.113.7",
  "[TRIAGE] brute-force pattern confirmed",
  "[ACTION] source blocked, ticket opened",
  "[OK]     contained in 4 min",
];

// A SOC console that types out one alert, over and over (static when motion is reduced).
function Terminal({ reduce }) {
  const [s, setS] = useState({ line: 0, ch: 0 });
  useEffect(() => {
    if (reduce) return;
    const cur = LINES[s.line];
    const t = setTimeout(() => {
      if (s.ch < cur.length) setS({ line: s.line, ch: s.ch + 1 });
      else if (s.line < LINES.length - 1) setS({ line: s.line + 1, ch: 0 });
      else setS({ line: 0, ch: 0 });
    }, s.ch < cur.length ? 24 : s.line === LINES.length - 1 ? 2600 : 520);
    return () => clearTimeout(t);
  }, [s, reduce]);
  const shown = reduce ? LINES : [...LINES.slice(0, s.line), LINES[s.line].slice(0, s.ch)];
  return (
    <div className="term" aria-hidden="true">
      <div className="term-bar"><i /><i /><i /><span>soc-console</span></div>
      <pre>{shown.map((l, i) => <span key={i} className={l.startsWith("[OK]") ? "ok" : l.startsWith("[WARN]") ? "warn" : ""}>{l + "\n"}</span>)}<b className="caret" /></pre>
    </div>
  );
}

function HudCircle() {
  return (
    <svg className="hud" viewBox="0 0 240 240" aria-hidden="true">
      <circle cx="120" cy="120" r="108" className="hud-faint" />
      <g className="hud-spin"><path d="M120 20 A100 100 0 0 1 214 86" /><path d="M206 160 A100 100 0 0 1 150 215" /><path d="M40 180 A100 100 0 0 1 26 96" /></g>
      <circle cx="120" cy="120" r="78" className="hud-faint" strokeDasharray="2 6" />
      <circle cx="120" cy="120" r="46" /><circle cx="120" cy="120" r="30" className="hud-faint" />
      <path d="M120 66 v14 M120 160 v14 M66 120 h14 M160 120 h14" />
    </svg>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const [firstName, ...rest] = me.name.split(" ");
  const enter = (delay, x = -40) => ({ initial: reduce ? false : { opacity: 0, x }, animate: { opacity: 1, x: 0 }, transition: { delay, duration: 0.8, ease: EASE } });
  const stats = [[caseStudies.length, "Projects"], [earned.length, "Certificates"], ["1", "SOC internship"]];

  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <div className="hero-bg" aria-hidden="true"><i className="beam b1" /><i className="beam b2" /><i className="beam b3" /><HudCircle /></div>
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p className="hero-badge" {...enter(0.05, -20)}><span className="live-dot" />{me.status}</motion.p>
          <h1 className="hero-name" id="hero-name">
            <motion.span className="line line-1" {...enter(0.1)}>{firstName}</motion.span>
            <motion.span className="line line-2" {...enter(0.22)}>{rest.join(" ")}</motion.span>
          </h1>
          <motion.div {...enter(0.4, -20)}><Terminal reduce={reduce} /></motion.div>
          <motion.ul className="hero-stats" {...enter(0.55, -20)}>
            {stats.map(([n, l]) => <li key={l}><b>{n}</b><span>{l}</span></li>)}
          </motion.ul>
          <motion.p className="hero-hint" {...enter(0.7, -20)}><span className="hint-arrow" aria-hidden="true">▸</span> Pick a player to explore</motion.p>
        </div>
        <Pitch onPick={(id) => scrollToSection(id)} />
      </div>
    </section>
  );
}
