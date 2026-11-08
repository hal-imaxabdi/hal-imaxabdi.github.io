import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { art } from "../art.js";
import { caseStudies, G, projectCats } from "../data.js";
import { img } from "../router.js";
import Art from "./Art.jsx";
import { ArrowLeft, ArrowRight, GitHub } from "./Icons.jsx";
import SectionHead from "./SectionHead.jsx";
import { Tags } from "./ui.jsx";
import "./fieldwork.css";

const EASE = [0.22, 1, 0.36, 1];
const pad = (n) => String(n).padStart(2, "0");
const no = (p) => pad(caseStudies.indexOf(p) + 1);

function Frame({ p, onClick, className }) {
  const inner = (
    <span className="fw-frame-in">
      {p.img && <img src={img(p.img)} alt="" decoding="async" style={{ objectPosition: p.pos }} />}
      <span className="fw-no">{no(p)}</span>
    </span>
  );
  return onClick
    ? <button className={`fw-frame ${className}`} onClick={onClick} aria-label={`Show ${p.t}`}>{inner}</button>
    : <a className={`fw-frame ${className}`} href={`/projects/${p.slug}/`} aria-label={`${p.t} case study`}>{inner}</a>;
}

/* ---------- 03 FIELD WORK: one project big, the next peeking in, the character between; a strip of all of them ---------- */
export default function FieldWork() {
  const reduce = useReducedMotion();
  const [cat, setCat] = useState("All");
  const [i, setI] = useState(0);
  const cats = ["All", ...projectCats.filter((c) => caseStudies.some((p) => p.cats.includes(c)))];
  const count = (c) => (c === "All" ? caseStudies.length : caseStudies.filter((p) => p.cats.includes(c)).length);
  const list = caseStudies.filter((p) => cat === "All" || p.cats.includes(cat));
  const n = list.length, cur = ((i % n) + n) % n;
  const p = list[cur], next = list[(cur + 1) % n];

  return (
    <section className="sec sec-fieldwork" id="fieldwork" aria-labelledby="fieldwork-title">
      <motion.svg className="fw-pent" viewBox="0 0 200 190" aria-hidden="true" animate={reduce ? undefined : { rotate: [0, 6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
        <polygon points="100,6 194,74 158,184 42,184 6,74" /><polygon points="100,34 62,62 76,106 124,106 138,62" className="i" />
      </motion.svg>
      <div className="wrap fw-wrap">
        <SectionHead n={3} title="Field Work" id="fieldwork-title" />
        <div className="tabs fw-tabs" role="group" aria-label="Filter projects">
          {cats.map((c) => <motion.button key={c} whileTap={{ scale: 0.95 }} className="tab" aria-pressed={cat === c} onClick={() => { setCat(c); setI(0); }}>{c} <span>{count(c)}</span></motion.button>)}
        </div>

        <div className="fw-stage">
          <motion.div className="fw-art-wrap" aria-hidden="true" animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
            <Art src={art.fieldwork} className="fw-art" />
          </motion.div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={p.slug} className="fw-main" initial={{ opacity: 0, x: -40, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4, ease: EASE }}>
              <Frame p={p} className="fw-frame-main" />
            </motion.div>
          </AnimatePresence>
          {n > 1 && (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={next.slug} className="fw-next" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }} whileHover={reduce ? undefined : { y: -6 }}>
                <Frame p={next} className="fw-frame-next" onClick={() => setI(cur + 1)} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={p.slug} className="fw-info" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <p className="fw-cats">{p.cats.join(" / ")}</p>
            <h3 className="fw-title"><a href={`/projects/${p.slug}/`}>{p.t}</a></h3>
            <p className="fw-k">{p.k}</p>
            <p className="fw-d">{p.d}</p>
            <Tags items={p.tags} />
            <div className="fw-links">
              <motion.a whileHover={{ x: 3 }} className="btn btn-primary" href={`/projects/${p.slug}/`}>Case study <ArrowRight size={16} /></motion.a>
              {p.repo && <motion.a whileHover={{ x: 3 }} className="btn btn-ghost" href={G + p.repo} target="_blank" rel="noopener"><GitHub size={16} /> GitHub</motion.a>}
              {n > 1 && (
                <span className="fw-nav">
                  <button className="icon-btn fw-arrow" onClick={() => setI(cur - 1)} aria-label="Previous project"><ArrowLeft size={18} /></button>
                  <button className="icon-btn fw-arrow" onClick={() => setI(cur + 1)} aria-label="Next project"><ArrowRight size={18} /></button>
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* every project at a glance, each with its own screenshot */}
        <ul className="fw-strip" aria-label="All projects">
          {list.map((q, k) => (
            <li key={q.slug}>
              <button className="fw-thumb" aria-current={k === cur} onClick={() => setI(k)} aria-label={`Show ${q.t}`}>
                {q.img && <img src={img(q.img)} alt="" loading="lazy" style={{ objectPosition: q.pos }} />}
                <span>{no(q)}</span>
                {k === cur && <motion.i layoutId="fw-ring" className="fw-ring" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
