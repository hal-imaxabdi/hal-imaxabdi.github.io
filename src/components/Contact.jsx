import { motion, useReducedMotion } from "framer-motion";
import { art } from "../art.js";
import { contact, me } from "../data.js";
import Art from "./Art.jsx";
import BackToPitch from "./BackToPitch.jsx";
import { Check, Copy, Download, GitHub, LinkedIn, Mail } from "./Icons.jsx";
import SectionHead from "./SectionHead.jsx";
import { useCopy } from "./ui.jsx";
import "./contact.css";

const EASE = [0.22, 1, 0.36, 1];

// Blue sweeping streaks behind everything.
function Streaks({ reduce }) {
  const paths = [
    "M-50 420 C 200 360, 380 230, 760 120 C 560 240, 300 330, -50 470 Z",
    "M-50 330 C 220 300, 420 180, 820 60 C 600 190, 320 270, -50 380 Z",
    "M-50 500 C 260 440, 480 320, 700 250 C 520 340, 280 420, -50 540 Z",
    "M-50 250 C 180 240, 360 150, 600 40 C 440 150, 240 210, -50 290 Z",
  ];
  return (
    <motion.svg className="ct-streaks" viewBox="0 0 800 560" preserveAspectRatio="none" aria-hidden="true"
      initial={reduce ? false : { opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }}>
      <defs>
        <linearGradient id="ctg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1f6bff" stopOpacity="0" /><stop offset=".45" stopColor="#1f6bff" stopOpacity=".55" /><stop offset="1" stopColor="#5aa2ff" stopOpacity=".1" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => <path key={i} d={d} fill="url(#ctg)" opacity={0.9 - i * 0.15} />)}
    </motion.svg>
  );
}

// Lightning bolts around her, with a glow that flickers (CSS; off for reduced motion).
function Lightning() {
  return (
    <svg className="ct-bolts" viewBox="0 0 400 500" aria-hidden="true">
      <g>
        <polyline points="70,120 96,150 78,168 108,214 90,230 124,282" />
        <polyline points="40,260 70,282 56,300 88,338" />
        <polyline points="330,70 306,112 322,126 294,170" />
        <polyline points="360,250 332,284 346,298 318,340 332,350 306,396" />
        <polyline points="150,420 176,440 162,458 196,494" />
        <polyline points="90,330 120,350 104,372 140,400" />
      </g>
    </svg>
  );
}

/* ---------- 05 CONTACT ---------- */
export default function Contact() {
  const reduce = useReducedMotion();
  const [copied, copy] = useCopy();
  const inView = { once: true, margin: "0px 0px -10% 0px" };
  const rise = (d = 0) => (reduce ? {} : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: inView, transition: { duration: 0.7, ease: EASE, delay: d } });

  return (
    <section className="sec sec-contact" id="contact" aria-labelledby="contact-title">
      <Streaks reduce={reduce} />

      <motion.div className="ct-art-wrap" aria-hidden="true"
        initial={reduce ? false : { opacity: 0, x: 120 }} whileInView={{ opacity: 1, x: 0 }} viewport={inView} transition={{ duration: 1, ease: EASE }}>
        <div className="ct-art-box">
          <Lightning />
          <Art src={art.contact} className="ct-art" />
        </div>
      </motion.div>

      <div className="wrap ct-wrap">
        <SectionHead n={5} title="Contact" id="contact-title" />
        <div className="ct-grid">
          <motion.p className="ct-big" {...rise(0.1)}>{me.status}.</motion.p>
          <motion.div className="ct-links" {...rise(0.25)}>
            <div className="ct-email">
              <Mail size={20} />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <button className="icon-btn" onClick={() => copy(contact.email)} aria-label="Copy email address">{copied ? <Check size={18} /> : <Copy size={18} />}</button>
              <span className="copied" role="status">{copied ? "Copied" : ""}</span>
            </div>
            <div className="ct-row">
              <a className="ct-btn" href={contact.linkedin} target="_blank" rel="noopener"><LinkedIn size={18} /> LinkedIn</a>
              <a className="ct-btn" href={contact.github} target="_blank" rel="noopener"><GitHub size={18} /> GitHub</a>
              <a className="ct-btn" href={contact.cv} download><Download size={18} /> Download CV</a>
            </div>
          </motion.div>
        </div>
        <BackToPitch />
      </div>

      <footer className="foot">
        <div className="wrap foot-inner"><p>© {new Date().getFullYear()} {me.name}</p></div>
      </footer>
    </section>
  );
}
