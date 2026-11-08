import { motion, useReducedMotion } from "framer-motion";
import { art } from "../art.js";
import { contact, me } from "../data.js";
import Art from "./Art.jsx";
import { Check, Copy, Download, GitHub, LinkedIn, Mail } from "./Icons.jsx";
import SectionHead from "./SectionHead.jsx";
import { useCopy } from "./ui.jsx";
import "./contact.css";

const EASE = [0.22, 1, 0.36, 1];
const STREAKS = [
  "M-50 420 C 200 360, 380 230, 760 120 C 560 240, 300 330, -50 470 Z",
  "M-50 330 C 220 300, 420 180, 820 60 C 600 190, 320 270, -50 380 Z",
  "M-50 500 C 260 440, 480 320, 700 250 C 520 340, 280 420, -50 540 Z",
];

/* ---------- 05 CONTACT: swooshes, big gradient line, the character with lightning, links on the right ---------- */
export default function Contact() {
  const reduce = useReducedMotion();
  const [copied, copy] = useCopy();
  const rise = (d = 0) => (reduce ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: EASE, delay: d } });
  return (
    <section className="sec sec-contact" id="contact" aria-labelledby="contact-title">
      <svg className="ct-streaks" viewBox="0 0 800 560" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="ctg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1f6bff" stopOpacity="0" /><stop offset=".5" stopColor="#1f6bff" stopOpacity=".6" /><stop offset="1" stopColor="#8fc1ff" stopOpacity=".15" /></linearGradient></defs>
        {STREAKS.map((d, i) => <path key={i} d={d} fill="url(#ctg)" opacity={0.9 - i * 0.2} />)}
      </svg>
      <div className="ct-grid">
        <div className="ct-left">
          <SectionHead n={5} title="Contact" id="contact-title" />
          <motion.p className="ct-big" {...rise(0.1)}>{me.status}.</motion.p>
        </div>
        <div className="ct-right">
          <motion.div className="ct-art-box" aria-hidden="true" {...(reduce ? {} : { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.9, ease: EASE } })}>
            <svg className="ct-bolts" viewBox="0 0 400 500" aria-hidden="true">
              <polyline points="330,70 306,112 322,126 294,170" /><polyline points="360,250 332,284 346,298 318,340 332,350 306,396" />
              <polyline points="40,260 70,282 56,300 88,338" /><polyline points="150,420 176,440 162,458 196,494" />
            </svg>
            <Art src={art.contact} className="ct-art" eager />
          </motion.div>
          <motion.div className="ct-links" {...rise(0.3)}>
            <div className="ct-email">
              <Mail size={18} /><a href={`mailto:${contact.email}`}>{contact.email}</a>
              <button className="icon-btn" onClick={() => copy(contact.email)} aria-label="Copy email address">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
            </div>
            <div className="ct-row">
              <motion.a whileHover={{ x: 4 }} whileTap={{ scale: 0.96 }} className="ct-btn" href={contact.linkedin} target="_blank" rel="noopener"><LinkedIn size={16} /> LinkedIn</motion.a>
              <motion.a whileHover={{ x: 4 }} whileTap={{ scale: 0.96 }} className="ct-btn" href={contact.github} target="_blank" rel="noopener"><GitHub size={16} /> GitHub</motion.a>
              <motion.a whileHover={{ x: 4 }} whileTap={{ scale: 0.96 }} className="ct-btn" href={contact.cv} download><Download size={16} /> Download CV</motion.a>
            </div>
          </motion.div>
        </div>
      </div>
      <p className="ct-foot">© {new Date().getFullYear()} {me.name}</p>
    </section>
  );
}
