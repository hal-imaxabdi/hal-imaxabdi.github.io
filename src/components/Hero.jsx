import { lazy, Suspense, useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { contact, me } from "../data.js";
import { ease, Magnetic } from "./ui.jsx";

const HeroScene = lazy(() => import("./HeroScene.jsx"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

// Shown while three.js loads, and as the fallback when WebGL is unavailable.
function Poster() {
  return (
    <div className="hero-poster" aria-hidden="true">
      <div className="poster-orb" />
      <div className="poster-ring" />
    </div>
  );
}

const line = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } };
const word = { hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, ease } } };

function Words({ text, className }) {
  return text.split(" ").map((w, i) => (
    <span key={i}>
      <span className="word-mask">
        <motion.span className={`word ${className ?? ""}`} variants={word}>{w}</motion.span>
      </span>{" "}
    </span>
  ));
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

export default function Hero({ theme }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const webgl = useMemo(hasWebGL, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-grid-bg" aria-hidden="true" />

      <div className="hero-canvas">
        {webgl ? (
          <Suspense fallback={<Poster />}>
            <HeroScene theme={theme} progress={scrollYProgress} reduced={!!reduced} />
          </Suspense>
        ) : (
          <Poster />
        )}
      </div>

      <motion.div className="wrap hero-content" style={{ y: textY, opacity: textOpacity }}>
        <motion.h1 variants={line} initial="hidden" animate="show" aria-label={`Hi, I'm ${me.first}.`}>
          <span aria-hidden="true">
            <Words text="Hi, I’m" className="thin" />
            <br />
            <Words text={`${me.first}.`} />
          </span>
        </motion.h1>

        <motion.p className="hero-lede" {...fadeUp(0.85)}>{me.tagline}</motion.p>

        <motion.div className="hero-actions" {...fadeUp(1)}>
          <Magnetic>
            <a className="btn btn-primary" href="#/work">
              View my projects <ArrowRight size={16} />
            </a>
          </Magnetic>
          <a className="btn btn-ghost" href={contact.cv} download>
            <Download size={16} /> Download CV
          </a>
        </motion.div>
      </motion.div>

      <motion.div className="wrap hero-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.3 }}>
        <a className="scroll-cue" href="#/work" aria-label="Scroll to projects">
          <span className="scroll-track"><span className="scroll-thumb" /></span>
          <span className="mono">Scroll to explore</span>
        </a>
      </motion.div>
    </section>
  );
}
