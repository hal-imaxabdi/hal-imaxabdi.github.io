import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { art } from "../art.js";
import { me } from "../data.js";
import { scrollToSection } from "../router.js";
import "./hero.css";

const EASE = [0.22, 1, 0.36, 1];

/* The line under the name that keeps changing. Edit, add or remove lines here. */
const LINES = [
  { tag: "Build", text: "I build backend systems." },
  { tag: "Secure", text: "I secure what I build." },
  { tag: "Detect", text: "I detect what gets through." },
];
const LINE_MS = 2800;

// the changing line: each sentence slides up into place, then the next one replaces it
function Rotator({ run }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setI((n) => (n + 1) % LINES.length), LINE_MS);
    return () => clearInterval(t);
  }, [run]);
  const line = LINES[i];
  return (
    <div className="hero-rot">
      <p className="rot-tags" aria-hidden="true">
        {LINES.map((l, k) => <i key={l.tag} className={k === i ? "is-on" : ""}>{l.tag}</i>)}
      </p>
      <p className="rot-line">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={line.text} initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} exit={{ y: "-110%", opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            {line.text}
          </motion.span>
        </AnimatePresence>
      </p>
    </div>
  );
}

/* `ready` turns true when the opening screen has finished, which starts the entrance animations. */
export default function Hero({ ready = true }) {
  const reduce = useReducedMotion();
  const [firstName, ...rest] = me.name.split(" ");
  const on = ready || reduce;
  const enter = (delay, from = { opacity: 0, y: 30 }) => ({
    initial: reduce ? false : from, animate: on ? { opacity: 1, x: 0, y: 0 } : from, transition: { delay, duration: 0.8, ease: EASE },
  });

  // the stadium drifts a little against the mouse, so the scene feels deep
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 }), sy = useSpring(my, { stiffness: 40, damping: 18 });
  const bgX = useTransform(sx, (v) => `${v * -18}px`), bgY = useTransform(sy, (v) => `${v * -12}px`);
  const copyX = useTransform(sx, (v) => `${v * 8}px`);
  useEffect(() => {
    if (reduce) return;
    const move = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mx.set((e.clientX / window.innerWidth) * 2 - 1); my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, mx, my]);

  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <div className="hero-bg" aria-hidden="true">
        <motion.img className="hero-stadium" style={{ x: bgX, y: bgY }} src={art.stadium} srcSet={`${art.stadiumSm} 900w, ${art.stadium} 1672w`} sizes="100vw" alt="" decoding="async" fetchpriority="high" draggable="false" />
        {/* the floodlights breathe */}
        <i className="flood f1" /><i className="flood f2" />
      </div>

      <motion.div className="hero-inner" style={{ x: copyX }}>
        <motion.p className="hero-hi" {...enter(0.05)}>Hi, I&rsquo;m</motion.p>
        <h1 className="hero-name" id="hero-name" aria-label={me.name}>
          {/* the first name arrives one letter at a time */}
          <span className="line line-1" aria-hidden="true">
            {[...firstName].map((ch, k) => (
              <span className="ch" key={k}>
                <motion.span initial={reduce ? false : { y: "105%" }} animate={on ? { y: "0%" } : { y: "105%" }} transition={{ delay: 0.15 + k * 0.06, duration: 0.7, ease: EASE }}>{ch}</motion.span>
              </span>
            ))}
          </span>
          <motion.span className="line line-2" aria-hidden="true" {...enter(0.55)}>{rest.join(" ")}</motion.span>
        </h1>
        <motion.p className="hero-fields" {...enter(0.7)}>Cybersecurity <i aria-hidden="true">/</i> Software Engineering</motion.p>
        <motion.div {...enter(0.8)}><Rotator run={on && !reduce} /></motion.div>
      </motion.div>

      <motion.button type="button" className="hero-scroll" onClick={() => scrollToSection("profile")} aria-label="Scroll to profile" {...enter(1.2, { opacity: 0, y: 0 })}>
        <span>Scroll</span><i aria-hidden="true" />
      </motion.button>
    </section>
  );
}
