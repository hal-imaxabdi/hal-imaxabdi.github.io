import { motion, useReducedMotion } from "framer-motion";
import { caseStudies } from "../data.js";
import { img } from "../router.js";
import { ArrowLeft } from "./Icons.jsx";
import Showcase from "./Showcase.jsx";
import "./pageshell.css";
import "./fieldwork.css";

const EASE = [0.22, 1, 0.36, 1];

export const Pentagon = ({ className = "" }) => (
  <svg className={`nv-pent ${className}`} viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,2 22,9.3 18.2,21 5.8,21 2,9.3" /></svg>
);

// Page backdrop for /projects/ pages: a quiet dotted texture.
export function NagiDecor() {
  return <span className="nv-dots" aria-hidden="true" />;
}

// Every finished project as a framed card with the explanation beside it. `limit` shows only the first few.
export function ProjectGrid({ limit }) {
  const reduce = useReducedMotion();
  return (
    <ul className="nv-list">
      {(limit ? caseStudies.slice(0, limit) : caseStudies).map((p) => (
        <motion.li key={p.slug}
          initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }} transition={{ duration: 0.55, ease: EASE }}>
          {/* one row per project: a framed screenshot + the explanation beside it; rows alternate sides */}
          <a className="nv-row" href={`/projects/${p.slug}/`}>
            <span className="nv-card">
              <span className="nv-card-in">
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

// Page wrapper for /projects/ and each project page: backdrop + one small back pill.
export function NagiPage({ children }) {
  return (
    <div className="page nv nv-page">
      <NagiDecor />
      <a className="home-back" href="/#fieldwork"><ArrowLeft size={16} /> Back</a>
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
        <p className="nv-intro">Backend systems, security tools and labs I've built. Open any project to see what I did and how.</p>
      </div>
    </div>
  );
}

/* ---------- PROJECTS (home page): the first four, with a link to the rest ---------- */
const ON_HOME = 4;
export default function FieldWork() {
  return (
    <section className="sec sec-fieldwork nv" id="fieldwork" aria-labelledby="fieldwork-title">
      <div className="wrap nv-wrap">
        <ProjectsHead id="fieldwork-title" />
        <Showcase limit={ON_HOME} />
        {caseStudies.length > ON_HOME && (
          <p className="more-row"><a className="more-link" href="/projects/">All projects <b aria-hidden="true">→</b></a></p>
        )}
      </div>
    </section>
  );
}
