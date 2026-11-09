import { motion, useReducedMotion } from "framer-motion";
import { contact, me } from "../data.js";
import { ArrowUpRight, Check, Copy, Download, GitHub, LinkedIn, Mail } from "./Icons.jsx";
import { RollingBall } from "./Ball3D.jsx";
import { useCopy } from "./ui.jsx";
import "./contact.css";

const EASE = [0.22, 1, 0.36, 1];

/* Chigiri Hyoma-inspired details (all blue, no character art): flowing wind ribbons for his long hair,
   faint panther claw marks, and links that a burst of speed lines (his speed) rips through on hover. */
const RIBBONS = [
  "M-60 520 C 220 470, 360 300, 640 260 S 1080 160, 1280 40",
  "M-60 560 C 260 520, 420 360, 700 320 S 1100 230, 1280 120",
  "M-60 600 C 300 570, 480 420, 760 380 S 1120 300, 1280 200",
];

const handle = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function LinkRow({ icon, label, value, href, download, children }) {
  return (
    <li className="ct-row">
      <a className="ct-link" href={href} {...(download ? { download: true } : { target: "_blank", rel: "noopener" })}>
        <span className="ct-burst" aria-hidden="true" />
        <span className="ct-ico" aria-hidden="true">{icon}</span>
        <span className="ct-txt"><small>{label}</small><strong>{value}</strong></span>
        <span className="ct-go" aria-hidden="true">{download ? <Download size={18} /> : <ArrowUpRight size={18} />}</span>
      </a>
      {children}
    </li>
  );
}

/* ---------- CONTACT: what I'm looking for on the left, ways to reach me on the right ---------- */
export default function Contact() {
  const reduce = useReducedMotion();
  const [copied, copy] = useCopy();
  const show = (d = 0, from = { opacity: 0, y: 24 }) =>
    reduce ? {} : { initial: from, whileInView: { opacity: 1, y: 0, x: 0 }, viewport: { once: true, margin: "0px 0px -10% 0px" }, transition: { duration: 0.7, ease: EASE, delay: d } };

  return (
    <section className="sec sec-contact" id="contact" aria-labelledby="contact-title">
      {/* background: wind ribbons, claw marks */}
      <svg className="ct-ribbons" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {RIBBONS.map((d, i) => <path key={i} d={d} className={`r${i}`} />)}
      </svg>
      <svg className="ct-claws" viewBox="0 0 120 160" aria-hidden="true">
        <path d="M20 10 Q 40 80 18 150" /><path d="M58 4 Q 78 78 56 156" /><path d="M96 10 Q 114 80 92 150" />
      </svg>

      <div className="wrap ct-wrap">
        <header className="ct-head">
          <span className="ct-stripes" aria-hidden="true"><i /><i /><i /></span>
          <h2 id="contact-title">Contact</h2>
        </header>

        <div className="ct-grid">
          <div className="ct-left">
            <motion.p className="ct-big" {...show(0.05)}>Let's connect</motion.p>
            <motion.p className="ct-note" {...show(0.12)}>Open to internship opportunities.</motion.p>
            {/* a real 3D ball rolling along the touchline */}
            <motion.div className="ct-ballspot" {...show(0.2)}>
              <RollingBall size={56} reduce={reduce} />
              <span className="ct-line" aria-hidden="true" />
            </motion.div>
          </div>

          <motion.ul className="ct-links" {...show(0.2, { opacity: 0, x: 40 })}>
            <LinkRow icon={<Mail size={20} />} label="Email" value={contact.email} href={`mailto:${contact.email}`}>
              <button className="ct-copy" onClick={() => copy(contact.email)} aria-label={copied ? "Email copied" : "Copy email address"}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </LinkRow>
            <LinkRow icon={<LinkedIn size={20} />} label="LinkedIn" value={handle(contact.linkedin).replace("linkedin.com/", "")} href={contact.linkedin} />
            <LinkRow icon={<GitHub size={20} />} label="GitHub" value={handle(contact.github).replace("github.com/", "")} href={contact.github} />
            <LinkRow icon={<Download size={20} />} label="CV" value="Download PDF" href={contact.cv} download />
          </motion.ul>
        </div>
      </div>

      <p className="wrap ct-foot">© {new Date().getFullYear()} {me.name}</p>
    </section>
  );
}
