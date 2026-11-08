import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { art } from "../art.js";
import Art from "./Art.jsx";
import BackToPitch from "./BackToPitch.jsx";
import { CertImage, CertLightbox, earned } from "./Certs.jsx";
import SectionHead from "./SectionHead.jsx";
import "./achievements.css";

const EASE = [0.22, 1, 0.36, 1];
// The front page shows a few highlights (the first ones in data.js); the full list is on /certificates/.
const FEATURED = 4;

// Cyan glass shards that drift slowly behind his head (decoration only).
const SHARDS = [
  { p: "70,30 118,18 96,64", x: 6, d: 7 }, { p: "230,150 280,120 262,176", x: -8, d: 9 },
  { p: "420,20 470,34 440,70", x: 7, d: 8 }, { p: "560,190 612,170 590,226", x: -6, d: 10 },
  { p: "700,40 744,70 706,96", x: 8, d: 7.5 }, { p: "820,150 868,132 850,188", x: -7, d: 9.5 },
  { p: "330,90 352,60 366,104", x: 5, d: 11 }, { p: "150,210 190,196 176,240", x: -5, d: 8.5 },
];

function Shards({ reduce }) {
  return (
    <svg className="ach-shards" viewBox="0 0 900 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {SHARDS.map((s, i) => (
        <motion.polygon key={i} points={s.p} style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={reduce ? undefined : { y: [0, -10, 0], x: [0, s.x, 0], rotate: [0, s.x * 2, 0] }}
          transition={{ duration: s.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }} />
      ))}
    </svg>
  );
}

/* ---------- 04 ACHIEVEMENTS: portrait banner with glass shards, certificates across its bottom edge ---------- */
export default function Achievements() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const featured = earned.slice(0, FEATURED);
  const inView = { once: true, margin: "0px 0px -10% 0px" };

  return (
    <section className="sec sec-achievements" id="achievements" aria-labelledby="achievements-title">
      <div className="wrap ach-wrap">
        <SectionHead n={4} title="Achievements" id="achievements-title" />

        <motion.div className="ach-banner"
          initial={reduce ? false : { opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={inView} transition={{ duration: 0.9, ease: EASE }}>
          <div className="ach-banner-in">
            <Shards reduce={reduce} />
            <Art src={art.achievements} className="ach-art" />
          </div>
        </motion.div>

        <motion.ul className="ach-cards"
          initial={reduce ? false : "off"} whileInView="on" viewport={inView} transition={{ staggerChildren: 0.12, delayChildren: 0.25 }}>
          {featured.map((c, i) => (
            <motion.li key={c.t} variants={{ off: { opacity: 0, y: 36 }, on: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: EASE }}>
              <button className="ach-card" onClick={() => setOpen(i)} aria-label={`View ${c.t} certificate`}>
                <span className="ach-panel">
                  <span className="ach-img"><CertImage c={c} /></span>
                  <span className="ach-cap">
                    <strong>{c.t}</strong>
                    <span>{[c.org, c.date].filter(Boolean).join(" - ")}</span>
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </motion.ul>

        {earned.length > FEATURED && (
          <div className="ach-foot">
            <a className="ach-all" href="/certificates/">
              <span>See all {earned.length} certificates</span>
              <svg viewBox="0 0 40 20" aria-hidden="true"><path d="M2 2 12 10 2 18M16 2 26 10 16 18M30 2 40 10 30 18" /></svg>
            </a>
          </div>
        )}
        <CertLightbox list={featured} index={open} onChange={setOpen} onClose={close} />
        <BackToPitch />
      </div>
    </section>
  );
}
