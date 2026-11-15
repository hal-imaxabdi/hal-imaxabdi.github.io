import { motion, useReducedMotion } from "framer-motion";
import { art } from "../art.js";
import { contact, me } from "../data.js";
import { ArrowUpRight, Check, Copy, GitHub, LinkedIn, Mail } from "./Icons.jsx";
import { useCopy } from "./ui.jsx";
import "./contact.css";

const EASE = [0.22, 1, 0.36, 1];
const handle = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/* The ways to reach me, one tile each. To add one, copy a line (icon, label, value, link). */
const WAYS = [
  { key: "email", icon: <Mail size={22} />, label: "Email", value: contact.email, href: `mailto:${contact.email}`, copy: contact.email },
  { key: "linkedin", icon: <LinkedIn size={22} />, label: "LinkedIn", value: handle(contact.linkedin).replace("linkedin.com/", ""), href: contact.linkedin },
  { key: "github", icon: <GitHub size={22} />, label: "GitHub", value: handle(contact.github).replace("github.com/", ""), href: contact.github },
];

/* ---------- CONTACT: two plain sentences, then one tile per way to reach me ---------- */
export default function Contact() {
  const reduce = useReducedMotion();
  const [copied, copy] = useCopy();
  const view = { once: true, margin: "0px 0px -10% 0px" };
  const rise = (d = 0) => reduce ? {} : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: view, transition: { duration: 0.7, ease: EASE, delay: d } };

  return (
    <section className="sec sec-contact" id="contact" aria-labelledby="contact-title">
      {/* background: the centre circle at night */}
      <img className="ct-pitch" src={art.centreCircle} alt="" aria-hidden="true" loading="lazy" decoding="async" />

      <div className="wrap ct-wrap">
        <header className="ct-head">
          <span className="ct-stripes" aria-hidden="true"><i /><i /><i /></span>
          <h2 id="contact-title">Contact</h2>
        </header>

        <div className="ct-top">
          <motion.p className="ct-big" {...rise(0.05)}>Let&rsquo;s connect.</motion.p>
          <motion.p className="ct-note" {...rise(0.12)}>I&rsquo;m open to <span>internship opportunities</span>, so feel free to reach out.</motion.p>
        </div>

        <motion.ul className="ct-tiles" initial={reduce ? false : "off"} whileInView="on" viewport={view} transition={{ staggerChildren: 0.1, delayChildren: 0.15 }}>
          {WAYS.map((w) => (
            <motion.li key={w.key} className={`ct-tile is-${w.key}`} variants={{ off: { opacity: 0, y: 30 }, on: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: EASE }}>
              <a className="ct-link" href={w.href} target="_blank" rel="noopener">
                <i className="ct-sheen" aria-hidden="true" />
                <span className="ct-ico" aria-hidden="true">{w.icon}</span>
                <span className="ct-txt"><small>{w.label}</small><strong>{w.value}</strong></span>
                <span className="ct-go" aria-hidden="true"><ArrowUpRight size={20} /></span>
              </a>
              {w.copy && (
                <button className="ct-copy" onClick={() => copy(w.copy)} aria-label={copied ? "Email copied" : "Copy email address"}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}<span>{copied ? "Copied" : "Copy"}</span>
                </button>
              )}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <p className="wrap ct-foot">© {new Date().getFullYear()} {me.name}</p>
    </section>
  );
}
