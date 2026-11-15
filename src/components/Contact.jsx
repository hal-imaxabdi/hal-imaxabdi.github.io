import { motion, useReducedMotion } from "framer-motion";
import { art } from "../art.js";
import { contact, me } from "../data.js";
import { ArrowUpRight, Check, Copy, Download, GitHub, LinkedIn, Mail } from "./Icons.jsx";
import { useCopy } from "./ui.jsx";
import "./contact.css";

const EASE = [0.22, 1, 0.36, 1];

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
      {/* background: the centre circle at night */}
      <img className="ct-pitch" src={art.centreCircle} alt="" aria-hidden="true" loading="lazy" decoding="async" />

      <div className="wrap ct-wrap">
        <header className="ct-head">
          <span className="ct-stripes" aria-hidden="true"><i /><i /><i /></span>
          <h2 id="contact-title">Contact</h2>
        </header>

        <div className="ct-grid">
          <div className="ct-left">
            <motion.p className="ct-big" {...show(0.05)}>Let's connect</motion.p>
            <motion.p className="ct-note" {...show(0.12)}>Open to internship opportunities.</motion.p>
          </div>

          <motion.ul className="ct-links" {...show(0.2, { opacity: 0, x: 40 })}>
            <LinkRow icon={<Mail size={20} />} label="Email" value={contact.email} href={`mailto:${contact.email}`}>
              <button className="ct-copy" onClick={() => copy(contact.email)} aria-label={copied ? "Email copied" : "Copy email address"}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </LinkRow>
            <LinkRow icon={<LinkedIn size={20} />} label="LinkedIn" value={handle(contact.linkedin).replace("linkedin.com/", "")} href={contact.linkedin} />
            <LinkRow icon={<GitHub size={20} />} label="GitHub" value={handle(contact.github).replace("github.com/", "")} href={contact.github} />
          </motion.ul>
        </div>
      </div>

      <p className="wrap ct-foot">© {new Date().getFullYear()} {me.name}</p>
    </section>
  );
}
