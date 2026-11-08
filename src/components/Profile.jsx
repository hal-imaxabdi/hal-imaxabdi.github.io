import { motion, useReducedMotion } from "framer-motion";
import { art } from "../art.js";
import { about, jobs, me } from "../data.js";
import { scrollToSection } from "../router.js";
import Art from "./Art.jsx";
import { ArrowLeft } from "./Icons.jsx";
import SectionHead from "./SectionHead.jsx";
import { Tags } from "./ui.jsx";
import "./profile.css";

const EASE = [0.22, 1, 0.36, 1];
// Cikarang, West Java (President University)
const COORDS = "6.28° S / 107.17° E";

// A glowing map pin with Halima's photo, flat rings pulsing under it, and its coordinates.
function LocationPin() {
  return (
    <div className="loc">
      <svg className="loc-circuit" viewBox="0 0 300 260" aria-hidden="true">
        <path d="M150 60 H40 V170 H0 M150 60 H262 V128 H300 M60 230 H200 L230 200 H300" />
        <circle cx="40" cy="170" r="3" /><circle cx="262" cy="128" r="3" /><circle cx="230" cy="200" r="3" />
      </svg>
      <p className="loc-coords"><span>{me.first}_loc //</span>{COORDS}</p>
      <div className="loc-pin">
        <span className="loc-photo"><img src={art.photo} alt={me.name} width="400" height="400" loading="lazy" /></span>
      </div>
      <span className="loc-rings" aria-hidden="true"><i /><i /><i /></span>
    </div>
  );
}

export default function Profile() {
  const reduce = useReducedMotion();
  // whileInView reveal; with reduced motion everything simply renders in place
  const reveal = (i = 0, from = { opacity: 0, y: 28 }) => reduce ? {} : {
    initial: from, whileInView: { opacity: 1, x: 0, y: 0 }, viewport: { once: true, margin: "0px 0px -10% 0px" },
    transition: { duration: 0.7, ease: EASE, delay: i * 0.08 },
  };

  return (
    <section className="sec sec-profile" id="profile" aria-labelledby="profile-title">
      <div className="wrap">
        <div className="profile-top">
          <div className="profile-main">
            <SectionHead n={1} title="Profile" id="profile-title" />
            <div className="profile-text">
              {about.map((para, i) => <motion.p className="prose" key={para.slice(0, 24)} {...reveal(i + 1)}>{para}</motion.p>)}
            </div>
          </div>
          <motion.aside className="profile-side" aria-label="Location" {...reveal(1, { opacity: 0, y: -30 })}>
            <LocationPin />
          </motion.aside>
        </div>

        <div className="record">
          <motion.h3 className="record-title" {...reveal(0, { opacity: 0, x: -30 })}>Track record</motion.h3>

          {/* the runner, with blue motion streaks sliding in behind him */}
          <div className="record-runner" aria-hidden="true">
            <motion.div className="streaks"
              initial={reduce ? false : "off"} whileInView="on" viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ staggerChildren: 0.07 }}>
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <motion.i key={k} variants={{ off: { x: "60%", opacity: 0 }, on: { x: "0%", opacity: 1 } }} transition={{ duration: 0.9, ease: EASE }} />
              ))}
            </motion.div>
            <motion.div {...reveal(1, { opacity: 0, x: 80 })}>
              <Art src={art.profile} className="runner-art" />
            </motion.div>
          </div>

          <ol className="timeline">
            {jobs.map((j, i) => (
              <motion.li key={j.role + j.org} className={j.type === "education" ? "is-edu" : ""} {...reveal(i * 0.6)}>
                <div className="tl-side">
                  <p className="tl-when">{j.when}</p>
                  <span className="tl-hex" aria-hidden="true"><i /></span>
                </div>
                <span className="tl-node" aria-hidden="true" />
                <div className="tl-body">
                  <p className="tl-kind">{j.type === "education" ? "Education" : "Experience"}{j.mode ? ` · ${j.mode}` : ""}</p>
                  <h4 className="tl-role">{j.role}</h4>
                  <p className="tl-org">{j.org}</p>
                  <ul className="tl-points">
                    {j.points.map(([t, d]) => <li key={t}><strong>{t}</strong> {d}</li>)}
                  </ul>
                  {j.tags && <Tags items={j.tags} />}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <p className="back-pitch">
          <a className="btn btn-ghost btn-sm" href="#top" onClick={(e) => { e.preventDefault(); history.replaceState(null, "", "/"); scrollToSection("top"); }}>
            <ArrowLeft size={16} /> Back to pitch
          </a>
        </p>
      </div>
    </section>
  );
}
