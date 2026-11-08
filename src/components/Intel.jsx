import { motion, useReducedMotion } from "framer-motion";
import { art } from "../art.js";
import { skillsIntro, stack } from "../data.js";
import { scrollToSection } from "../router.js";
import Art from "./Art.jsx";
import { ArrowLeft } from "./Icons.jsx";
import SectionHead from "./SectionHead.jsx";
import "./intel.css";

const EASE = [0.22, 1, 0.36, 1];
const pad = (n) => String(n).padStart(2, "0");

/* ---------- 02 INTEL: the character on the left, 4 neon skill panels ---------- */
export default function Intel() {
  const reduce = useReducedMotion();
  const inView = { once: true, margin: "0px 0px -12% 0px" };

  return (
    <section className="sec sec-intel" id="intel" aria-labelledby="intel-title">

      <div className="wrap intel-wrap">
        <motion.div className="intel-art-wrap" aria-hidden="true"
          initial={reduce ? false : { opacity: 0, x: -120 }} whileInView={{ opacity: 1, x: 0 }} viewport={inView}
          transition={{ duration: 1, ease: EASE }}>
          <Art src={art.intel} className="intel-art" />
        </motion.div>

        <div className="intel-main">
          <SectionHead n={2} title="Intel" id="intel-title" />
          <motion.p className="intel-intro"
            initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}>
            {skillsIntro}
          </motion.p>

          <motion.div className="intel-grid"
            initial={reduce ? false : "off"} whileInView="on" viewport={inView}
            transition={{ staggerChildren: 0.12, delayChildren: 0.2 }}>
            {stack.map((g, i) => (
              <motion.article className="intel-card" key={g.title}
                variants={{ off: { opacity: 0, y: 30, scale: 0.97 }, on: { opacity: 1, y: 0, scale: 1 } }}
                transition={{ duration: 0.6, ease: EASE }}>
                <div className="intel-panel">
                  <header>
                    <span className="intel-idx">{pad(i + 1)}</span>
                    <h3>{g.title}</h3>
                  </header>
                  <ul className="chips">{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <p className="back-pitch">
            <a className="btn btn-ghost btn-sm" href="#top" onClick={(e) => { e.preventDefault(); history.replaceState(null, "", "/"); scrollToSection("top"); }}>
              <ArrowLeft size={16} /> Back to pitch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
