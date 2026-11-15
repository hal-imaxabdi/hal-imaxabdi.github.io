import { motion, useReducedMotion } from "framer-motion";
import { art } from "../art.js";
import { about, jobs, me } from "../data.js";
import "./profile.css";

const EASE = [0.22, 1, 0.36, 1];
// words in the bio picked out in blue
const HIGHLIGHT = /(Halima)/;
// current role ("… now") first, the rest in data order
const ordered = [...jobs].sort((a, b) => b.when.includes("now") - a.when.includes("now"));

const Stripes = () => <span className="pf-stripes" aria-hidden="true"><i /><i /><i /></span>;

export default function Profile() {
  const reduce = useReducedMotion();
  // whileInView reveal; with reduced motion everything simply renders in place
  const reveal = (i = 0, from = { opacity: 0, y: 24 }) => reduce ? {} : {
    initial: from, whileInView: { opacity: 1, x: 0, y: 0 }, viewport: { once: true, margin: "0px 0px -10% 0px" },
    transition: { duration: 0.7, ease: EASE, delay: i * 0.08 },
  };

  return (
    <section className="sec sec-profile" id="profile" aria-labelledby="profile-title">
      <div className="wrap pf-grid">
        <motion.aside className="pf-side" aria-label="Photo" {...reveal(0, { opacity: 0, x: -30 })}>
          <div className="pf-frame">
            <Stripes />
            <div className="pf-photo">
              <img src={art.photo} alt={me.name} width="400" height="400" loading="lazy" />
            </div>
            <svg className="pf-edge" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="9,12 32,0 100,0 100,60 72,100 0,100" />
            </svg>
          </div>
        </motion.aside>

        <div className="pf-main">
          <header className="pf-head">
            <Stripes />
            <h2 id="profile-title">Profile</h2>
          </header>
          <div className="pf-text">
            {about.map((para, i) => (
              <motion.p className="prose" key={para.slice(0, 24)} {...reveal(i + 1)}>
                {para.split(HIGHLIGHT).map((part, k) => (k % 2 ? <span className="hl" key={k}>{part}</span> : part))}
              </motion.p>
            ))}
          </div>

          <div className="pf-record">
            <header className="pf-head">
              <Stripes />
              <h3>Track record</h3>
            </header>
            <ol className="tr">
              {ordered.map((j, i) => (
                <motion.li key={j.role + j.org} {...reveal(i * 0.6)}>
                  <span className="tr-ball" aria-hidden="true"><i className="tr-dot" /></span>
                  <div className="tr-when">
                    <p className="tr-date">{j.when}</p>
                    <p className="tr-kind">{j.type === "education" ? "Education" : "Experience"}{j.mode ? ` · ${j.mode}` : ""}</p>
                  </div>
                  <div className="tr-what">
                    <h4 className="tr-role">{j.role}</h4>
                    <p className="tr-org">{j.org}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
