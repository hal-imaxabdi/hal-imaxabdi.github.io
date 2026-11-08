import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { art } from "../art.js";
import { caseStudies, G, projectCats } from "../data.js";
import { img } from "../router.js";
import Art from "./Art.jsx";
import BackToPitch from "./BackToPitch.jsx";
import { ArrowRight, GitHub } from "./Icons.jsx";
import SectionHead from "./SectionHead.jsx";
import { Tags } from "./ui.jsx";
import "./fieldwork.css";

const EASE = [0.22, 1, 0.36, 1];
const COLS = 3;
const pad = (n) => String(n).padStart(2, "0");

// Decorative blue pentagon, top right.
function Pentagon() {
  return (
    <svg className="fw-pent" viewBox="0 0 200 190" aria-hidden="true">
      <polygon points="100,6 194,74 158,184 42,184 6,74" className="o" />
      <polygon points="100,34 62,62 76,106 124,106 138,62" className="i" />
      <path d="M100 6 L100 34 M194 74 L138 62 M158 184 L124 106 M42 184 L76 106 M6 74 L62 62" />
    </svg>
  );
}

const rise = { off: { opacity: 0, y: 34 }, on: { opacity: 1, y: 0 } };

function Card({ p, i, reduce }) {
  const href = `/projects/${p.slug}/`;
  return (
    <motion.article className="fw-card" variants={rise} transition={{ duration: 0.6, ease: EASE }} whileHover={reduce ? undefined : { y: -4 }}>
      <div className="fw-panel">
        <a className="fw-shot" href={href} tabIndex={-1} aria-hidden="true">
          {p.img && <img src={img(p.img)} alt="" loading="lazy" decoding="async" style={{ objectPosition: p.pos }} />}
          <span className="fw-no">{pad(i + 1)}</span>
        </a>
        <div className="fw-body">
          <p className="fw-cats">{p.cats.join(" / ")}</p>
          <h3 className="fw-title"><a href={href}>{p.t}</a></h3>
          <p className="fw-k">{p.k}</p>
          <p className="fw-d">{p.d}</p>
          <Tags items={p.tags.slice(0, 4)} />
          <div className="fw-links">
            <a className="btn btn-primary btn-sm" href={href}>Case study <ArrowRight size={16} /></a>
            {p.repo && <a className="btn btn-ghost btn-sm" href={G + p.repo} target="_blank" rel="noopener"><GitHub size={16} /> GitHub</a>}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- 03 FIELD WORK: every project at once, the character fills the spare spot in the grid ---------- */
export default function FieldWork() {
  const reduce = useReducedMotion();
  const [cat, setCat] = useState("All");
  const inView = { once: true, margin: "0px 0px -8% 0px" };
  const cats = ["All", ...projectCats.filter((c) => caseStudies.some((p) => p.cats.includes(c)))];
  const count = (c) => (c === "All" ? caseStudies.length : caseStudies.filter((p) => p.cats.includes(c)).length);
  const shown = caseStudies.filter((p) => cat === "All" || p.cats.includes(cat));
  // the character sits in the empty cells at the end of the grid (none when the last row is full)
  const spare = (COLS - (shown.length % COLS)) % COLS;

  return (
    <section className="sec sec-fieldwork" id="fieldwork" aria-labelledby="fieldwork-title">
      <Pentagon />
      <div className="wrap fw-wrap">
        <SectionHead n={3} title="Field Work" id="fieldwork-title" />
        <div className="fw-bar">
          <div className="tabs" role="group" aria-label="Filter projects">
            {cats.map((c) => (
              <button key={c} className="tab" aria-pressed={cat === c} onClick={() => setCat(c)}>
                {c} <span>{count(c)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* keyed by filter, so the cards stagger in again whenever the filter changes */}
        <motion.div className="fw-grid" key={cat}
          initial={reduce ? false : "off"} whileInView="on" viewport={inView} transition={{ staggerChildren: 0.1, delayChildren: 0.05 }}>
          {shown.map((p) => <Card key={p.slug} p={p} i={caseStudies.indexOf(p)} reduce={reduce} />)}
          {spare > 0 && (
            <motion.div className="fw-art-cell" style={{ gridColumn: `span ${spare}` }} aria-hidden="true"
              variants={{ off: { opacity: 0, x: 60 }, on: { opacity: 1, x: 0 } }} transition={{ duration: 0.9, ease: EASE }}>
              <motion.div className="fw-art-float" animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
                <Art src={art.fieldwork} className="fw-art" />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
        <BackToPitch />
      </div>
    </section>
  );
}
