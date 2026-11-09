import { motion, useReducedMotion } from "framer-motion";
import { skillsIntro, stack } from "../data.js";
import "./intel.css";

const EASE = [0.22, 1, 0.36, 1];

/* Bachira-inspired details (all blue, no character art): spirals, small stars,
   a curvy dribble trail with a ball running along it, and his #8. */

// Archimedean spiral as an SVG path, centred on (c, c)
function spiralPath(c, turns, gap) {
  let d = "";
  for (let t = 0, i = 0; t <= turns * 2 * Math.PI; t += 0.12, i++) {
    const r = (gap * t) / (2 * Math.PI);
    d += `${i ? "L" : "M"}${(c + r * Math.cos(t)).toFixed(1)} ${(c + r * Math.sin(t)).toFixed(1)}`;
  }
  return d;
}
const BIG_SPIRAL = spiralPath(200, 7, 26);
const MINI_SPIRAL = spiralPath(20, 3, 6);

// five-point star in a 24×24 box
const STAR = Array.from({ length: 10 }, (_, k) => {
  const r = k % 2 ? 4.6 : 11, a = (Math.PI / 5) * k - Math.PI / 2;
  return `${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`;
}).join(" ");
const Star = ({ className }) => <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><polygon points={STAR} /></svg>;

const TRAIL = "M-40 640 C120 560 220 700 380 600 S560 420 470 340 S560 180 720 250 S960 300 1000 170 S1160 60 1260 90";

export default function Intel() {
  const reduce = useReducedMotion();
  const inView = { once: true, margin: "0px 0px -12% 0px" };

  return (
    <section className="sec sec-intel" id="intel" aria-labelledby="intel-title">
      {/* background: big spiral, dribble trail, stars, #8 */}
      <svg className="sk-spiral" viewBox="0 0 400 400" aria-hidden="true"><path d={BIG_SPIRAL} /></svg>
      <svg className="sk-trail" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path id="sk-trail-path" d={TRAIL} />
        <circle r="5" className="sk-trail-ball">
          {!reduce && <animateMotion dur="16s" repeatCount="indefinite" rotate="auto"><mpath href="#sk-trail-path" /></animateMotion>}
        </circle>
      </svg>
      <Star className="sk-star s1" /><Star className="sk-star s2" /><Star className="sk-star s3" /><Star className="sk-star s4" /><Star className="sk-star s5" />
      <span className="sk-8" aria-hidden="true">8</span>

      <div className="wrap sk-wrap">
        <header className="sk-head">
          <span className="sk-stripes" aria-hidden="true"><i /><i /><i /></span>
          <h2 id="intel-title">Skills &amp; Technology</h2>
        </header>
        <motion.p className="sk-intro"
          initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}>
          {skillsIntro}
        </motion.p>

        <motion.div className="sk-grid"
          initial={reduce ? false : "off"} whileInView="on" viewport={inView}
          transition={{ staggerChildren: 0.1, delayChildren: 0.15 }}>
          {stack.map((g) => (
            <motion.article className="sk-card" key={g.title}
              variants={{ off: { opacity: 0, y: 26 }, on: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: EASE }}>
              <svg className="sk-mini" viewBox="0 0 40 40" aria-hidden="true"><path d={MINI_SPIRAL} /></svg>
              <header>
                <Star className="sk-card-star" />
                <h3>{g.title}</h3>
              </header>
              <ul className="sk-chips">{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
