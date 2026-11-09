import { motion, useReducedMotion } from "framer-motion";
import { caseStudies } from "../data.js";
import { img } from "../router.js";
import { Ball } from "./Icons.jsx";
import "./fieldwork.css";

const EASE = [0.22, 1, 0.36, 1];

/* Nagi-inspired details (no character art, no Japanese text): white/silver on dark navy marble,
   the ball's pentagon, a tiny button-eyed face, faint game controllers, the ball "trap",
   and his #7 once per page as a faint outline. */
function Pad({ className }) {
  return (
    <svg className={`nv-pad ${className}`} viewBox="0 0 64 40" aria-hidden="true">
      <path d="M15 6h34c7 0 11 5 12.5 12l1.8 10c1 6-5.5 9.5-9.8 5.2L47 27H17l-6.5 6.2C6.2 37.5-.3 34 .7 28L2.5 18C4 11 8 6 15 6Z" />
      <path d="M16 13v10M11 18h10" /><circle cx="45" cy="15" r="2.2" /><circle cx="51" cy="20" r="2.2" /><circle cx="39" cy="20" r="2.2" /><circle cx="45" cy="25" r="2.2" />
    </svg>
  );
}

export const Pentagon = ({ className = "" }) => (
  <svg className={`nv-pent ${className}`} viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,2 22,9.3 18.2,21 5.8,21 2,9.3" /></svg>
);

export function NagiDecor() {
  return (
    <>
      <span className="nv-dots" aria-hidden="true" />
      <Pad className="p1" /><Pad className="p2" />
      <span className="nv-7" aria-hidden="true">7</span>
    </>
  );
}

// the ball "trap": a ball resting in the air over soft rings
export function Trap({ className = "" }) {
  return (
    <span className={`nv-trap ${className}`} aria-hidden="true">
      <span className="nv-ball"><Ball size={40} /></span>
      <span className="nv-rings"><i /><i /><i /></span>
    </span>
  );
}

// a tiny sleepy plush face with button eyes (from the nail-art reference)
export function Face({ className = "" }) {
  return (
    <svg className={`nv-face ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" className="skin" />
      <g className="eye"><circle cx="22" cy="28" r="6" /><circle cx="42" cy="28" r="6" /></g>
      <g className="holes"><circle cx="20.5" cy="26.5" r="1" /><circle cx="23.5" cy="26.5" r="1" /><circle cx="20.5" cy="29.5" r="1" /><circle cx="23.5" cy="29.5" r="1" />
        <circle cx="40.5" cy="26.5" r="1" /><circle cx="43.5" cy="26.5" r="1" /><circle cx="40.5" cy="29.5" r="1" /><circle cx="43.5" cy="29.5" r="1" /></g>
      <path d="M29 41l6 5M35 41l-6 5" className="x" />
    </svg>
  );
}

// Every finished project as a "ball trap" card: on hover a ball drops in and sticks in the corner.
export function ProjectGrid() {
  const reduce = useReducedMotion();
  return (
    <ul className="nv-list">
      {caseStudies.map((p) => (
        <motion.li key={p.slug}
          initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }} transition={{ duration: 0.55, ease: EASE }}>
          {/* one row per project: a compact Blue Lock frame (ball trap on hover) + the explanation beside it;
              rows alternate sides */}
          <a className="nv-row" href={`/projects/${p.slug}/`}>
            <span className="nv-card">
              <span className="nv-card-in">
                <span className="nv-drop" aria-hidden="true"><span className="nv-drop-ring" /><span className="nv-drop-ball"><Ball size={28} /></span></span>
                <span className="nv-shot">
                  {p.img && <img src={img(p.img)} alt="" decoding="async" style={{ objectPosition: p.pos }} />}
                </span>
              </span>
            </span>
            <span className="nv-body">
              <span className="nv-cat"><span className="nv-stripes" aria-hidden="true"><i /><i /><i /></span>{p.cats.join(" / ")}</span>
              <span className="nv-title">{p.t}</span>
              <span className="nv-k">{p.k}</span>
              <span className="nv-d">{p.d}</span>
              <span className="nv-tags">{p.tags.map((t) => <i key={t}>{t}</i>)}</span>
              <span className="nv-go">View project <b aria-hidden="true">→</b></span>
            </span>
          </a>
        </motion.li>
      ))}
    </ul>
  );
}

// Page wrapper for /projects/ and each project page: Nagi background + one small back pill.
export function NagiPage({ children }) {
  return (
    <div className="page nv nv-page">
      <NagiDecor />
      <a className="nv-back" href="/#fieldwork"><span className="nv-back-ball" aria-hidden="true"><Ball size={20} /></span>Projects</a>
      <div className="wrap nv-wrap">{children}</div>
    </div>
  );
}

// heading row shared by the home section and /projects/
export function ProjectsHead({ as: H = "h2", id }) {
  return (
    <div className="nv-top">
      <div>
        <header className="nv-head">
          <span className="nv-stripes" aria-hidden="true"><i /><i /><i /></span>
          <H id={id}>Projects</H>
        </header>
        <p className="nv-intro">Labs, tools and web apps I've built. Open any project to see what I did and how.</p>
      </div>
      <Face />
    </div>
  );
}

/* ---------- PROJECTS (home view): every project, each opens its own page ---------- */
export default function FieldWork() {
  return (
    <section className="sec sec-fieldwork nv" id="fieldwork" aria-labelledby="fieldwork-title">
      <NagiDecor />
      <div className="wrap nv-wrap">
        <ProjectsHead id="fieldwork-title" />
        <ProjectGrid />
      </div>
    </section>
  );
}
