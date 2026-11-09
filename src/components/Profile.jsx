import { motion, useReducedMotion } from "framer-motion";
import { art } from "../art.js";
import { about, jobs, me } from "../data.js";
import { Ball } from "./Icons.jsx";
import "./profile.css";

const EASE = [0.22, 1, 0.36, 1];
// words in the bio picked out in blue
const HIGHLIGHT = /(Halima)/;
// current role ("… now") first, the rest in data order
const ordered = [...jobs].sort((a, b) => b.when.includes("now") - a.when.includes("now"));

// A jigsaw piece: a nod to Isagi Yoichi (#11) fitting the puzzle of the field together.
function Puzzle({ className }) {
  return (
    <svg className={`pz ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M20 30 H38 C34 30 34 16 50 16 C66 16 66 30 62 30 H80 V48 C80 44 94 44 94 60 C94 76 80 76 80 72 V90 H62 C66 90 66 76 50 76 C34 76 34 90 38 90 H20 V72 C20 76 34 76 34 60 C34 44 20 44 20 48 Z" />
    </svg>
  );
}

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
      {/* faint circuit lines and puzzle pieces behind everything */}
      <svg className="pf-circuit" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 H40 L90 90 H230 L270 50 H470" />
        <path d="M1000 120 H860 L820 160 H560" />
        <path d="M1000 300 H930 L820 410" />
        <path d="M0 520 H60 L120 460 H300" />
      </svg>
      <Puzzle className="pz-1" /><Puzzle className="pz-2" /><Puzzle className="pz-3" /><Puzzle className="pz-4" /><Puzzle className="pz-5" />

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
          <span className="pf-11" aria-hidden="true">11</span>
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
                  <span className="tr-ball" aria-hidden="true"><Ball size={20} /></span>
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
