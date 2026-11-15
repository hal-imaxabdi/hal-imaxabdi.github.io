import { motion, useReducedMotion } from "framer-motion";
import { skillsIntro, stack } from "../data.js";
import "./intel.css";

const EASE = [0.22, 1, 0.36, 1];

// five-point star in a 24×24 box (the small mark beside each card title)
const STAR = Array.from({ length: 10 }, (_, k) => {
  const r = k % 2 ? 4.6 : 11, a = (Math.PI / 5) * k - Math.PI / 2;
  return `${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`;
}).join(" ");
const Star = ({ className }) => <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><polygon points={STAR} /></svg>;

export default function Intel() {
  const reduce = useReducedMotion();
  const inView = { once: true, margin: "0px 0px -12% 0px" };

  return (
    <section className="sec sec-intel" id="intel" aria-labelledby="intel-title">
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
              {g.img && <img className="sk-art" src={g.img} alt="" width="640" height="640" loading="lazy" decoding="async" />}
              <header>
                <Star className="sk-card-star" />
                <h3>{g.title}</h3>
              </header>
              {g.sub && <p className="sk-sub">{g.sub}</p>}
              <ul className="sk-chips">{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
