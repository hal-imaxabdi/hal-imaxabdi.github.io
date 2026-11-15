import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { caseStudies } from "../data.js";
import { img } from "../router.js";
import "./showcase.css";

const EASE = [0.22, 1, 0.36, 1];

/* PROJECT SHOWCASE (home page): one large card per project.
   As you scroll, each card slides up and stacks on top of the one before it.
   The screenshot tilts towards the mouse, and a light sweeps across it on hover.
   Everything shown comes from the project's entry in data.js:
   t (title), k (one-line kind), d (description), tags, cats, img, live, and the first two `stats`. */
function Card({ p, i, total }) {
  const reduce = useReducedMotion();
  // the screenshot leans towards the pointer
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 120, damping: 14 }), sy = useSpring(ry, { stiffness: 120, damping: 14 });
  const rotateX = useTransform(sx, (v) => `${v}deg`), rotateY = useTransform(sy, (v) => `${v}deg`);
  const lean = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -9);
  };
  const rest = () => { rx.set(0); ry.set(0); };
  const page = `/projects/${p.slug}/`;

  return (
    <li className="sc-item" style={{ "--i": i }}>
      <motion.article className={`sc-card ${i % 2 ? "is-flip" : ""}`} onPointerMove={lean} onPointerLeave={rest}
        initial={reduce ? false : { opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.7, ease: EASE }}>
        <div className="sc-text">
          <p className="sc-meta">
            <span className="sc-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="sc-of" aria-hidden="true">/ {String(total).padStart(2, "0")}</span>
            <span className="sc-cat">{p.cats.join(" · ")}</span>
          </p>
          <h3 className="sc-title"><a href={page}>{p.t}</a></h3>
          <p className="sc-k">{p.k}</p>
          <p className="sc-d">{p.d}</p>
          {p.stats && (
            <dl className="sc-stats">
              {p.stats.slice(0, 2).map(([big, small]) => (
                <div key={big}><dt>{big}</dt><dd>{small}</dd></div>
              ))}
            </dl>
          )}
          <ul className="sc-tags">{p.tags.slice(0, 5).map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="sc-actions">
            <a className="sc-btn is-main" href={page}>Read the case study <b aria-hidden="true">→</b></a>
            {p.live && <a className="sc-btn" href={p.live} target="_blank" rel="noopener">Live demo <b aria-hidden="true">↗</b></a>}
          </p>
        </div>

        <a className="sc-stage" href={page} tabIndex={-1} aria-hidden="true">
          <motion.span className="sc-shot" style={{ rotateX, rotateY }}>
            {p.img && <img src={img(p.img)} alt="" loading="lazy" decoding="async" style={{ objectPosition: p.pos, objectFit: p.cardFit || p.fit || "cover" }} />}
            <i className="sc-sheen" />
          </motion.span>
        </a>
      </motion.article>
    </li>
  );
}

export default function Showcase({ limit }) {
  const list = limit ? caseStudies.slice(0, limit) : caseStudies;
  return <ol className="sc-list">{list.map((p, i) => <Card key={p.slug} p={p} i={i} total={list.length} />)}</ol>;
}
