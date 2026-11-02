import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { G, projects } from "../data.js";
import { img } from "../router.js";
import Shot from "../components/Shot.jsx";
import { ease, GitHubIcon, Magnetic, pad, Reveal, SplitText } from "../components/ui.jsx";

// Request flow: boxes connected by lines that draw in, with a pulse travelling along them.
function Flow({ steps }) {
  return (
    <ol className="flow">
      {steps.map(([name, note], i) => (
        <motion.li key={name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease, delay: i * 0.18 }}>
          <div className="flow-node">
            <span className="mono flow-step">{pad(i + 1)}</span>
            <strong>{name}</strong>
            <small>{note}</small>
          </div>
          {i < steps.length - 1 && (
            <span className="flow-link" aria-hidden="true">
              <motion.span className="flow-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.18 }} />
              <span className="flow-pulse" style={{ animationDelay: `${i * 0.6}s` }} />
            </span>
          )}
        </motion.li>
      ))}
    </ol>
  );
}

function Block({ n, title, children }) {
  return (
    <section className="case-block">
      <Reveal as="h2" className="case-label"><span className="mono">{pad(n)}</span>{title}</Reveal>
      <div className="case-content">{children}</div>
    </section>
  );
}

function Gallery({ p }) {
  const shots = [p.img, ...(p.gallery ?? [])].filter(Boolean);
  const [i, setI] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotateX = useTransform(scrollYProgress, [0, 0.45], [14, 0]);

  return (
    <div className="case-gallery" ref={ref}>
      <motion.div style={{ y, rotateX }} className="case-gallery-frame">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={shots[i]} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }}>
            <Shot p={{ ...p, fit: "contain" }} src={shots[i]} eager />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {shots.length > 1 && (
        <div className="thumbs" role="tablist" aria-label="Screenshots">
          {shots.map((s, k) => (
            <button key={s} role="tab" aria-selected={k === i} aria-label={`Screenshot ${k + 1}`} className={`thumb ${k === i ? "is-active" : ""}`} onClick={() => setI(k)}>
              <img src={img(s)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectPage({ slug }) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) {
    return (
      <section className="section page-top"><div className="wrap">
        <h1 className="case-title">Project not found.</h1>
        <a className="link-arrow" href="#/projects">All projects <ArrowRight size={15} /></a>
      </div></section>
    );
  }
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  const glance = [["Role", p.role], ["What I built", p.built], ["Who it's for", p.users]].filter(([, v]) => v);

  let n = 0;
  const blocks = [
    p.problem && ["The problem", <p className="case-lead">{p.problem}</p>],
    p.points && ["Key features", (
      <ul className="feature-grid">
        {p.points.map(([t, d], i) => (
          <Reveal as="li" key={t} delay={(i % 3) * 0.06}>
            <span className="mono">{pad(i + 1)}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </Reveal>
        ))}
      </ul>
    )],
    p.flow && ["How it works", (
      <>
        <Flow steps={p.flow} />
        {p.how && (
          <ol className="how-list">
            {p.how.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.05}><span className="mono">{pad(i + 1)}</span><div><strong>{t}</strong><p>{d}</p></div></Reveal>
            ))}
          </ol>
        )}
      </>
    )],
    p.stack && ["Tech stack", (
      <dl className="stack-rows">
        {p.stack.map(([g, items], i) => (
          <Reveal key={g} delay={i * 0.05}><dt className="mono">{g}</dt><dd><ul className="tags">{items.map((t) => <li key={t}>{t}</li>)}</ul></dd></Reveal>
        ))}
      </dl>
    )],
    p.stats && ["Results", (
      <>
        <ul className="result-grid">
          {p.stats.map(([big, small], i) => (
            <Reveal as="li" key={big} delay={i * 0.08}><strong>{big}</strong><span>{small}</span></Reveal>
          ))}
        </ul>
        {p.note && <p className="case-note">{p.note}</p>}
      </>
    )],
    p.skills && ["Skills demonstrated", <ul className="tags tags-lg">{p.skills.map((t) => <li key={t}>{t}</li>)}</ul>],
  ].filter(Boolean);

  return (
    <article className="case page-top">
      <div className="wrap">
        <div className="case-bar">
          <a className="back-link" href="#/projects"><ArrowLeft size={15} /> All projects</a>
          <span className="mono muted">{pad(index + 1)} / {pad(projects.length)}</span>
        </div>

        <header className="case-head">
          <motion.p className="mono case-cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{p.cats.join(" · ")}</motion.p>
          <SplitText as="h1" className="case-title" text={p.t} onMount delay={0.1} />
          <div className="case-head-grid">
            <Reveal as="p" className="case-kicker" delay={0.3}>{p.k}</Reveal>
            <Reveal className="case-head-side" delay={0.4}>
              <p>{p.d}</p>
              <div className="case-actions">
                {p.live && <Magnetic><a className="btn btn-primary" href={p.live} target="_blank" rel="noopener">Live demo <ArrowUpRight size={15} /></a></Magnetic>}
                {p.repo && <a className={`btn ${p.live ? "btn-ghost" : "btn-primary"}`} href={G + p.repo} target="_blank" rel="noopener"><GitHubIcon width={15} height={15} /> View repository</a>}
              </div>
            </Reveal>
          </div>
          <Reveal className="case-tags" delay={0.5}><ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul></Reveal>
        </header>

        <Gallery p={p} />

        {glance.length > 0 && (
          <dl className="glance">
            {glance.map(([k, v], i) => <Reveal key={k} delay={i * 0.06}><dt className="mono">{k}</dt><dd>{v}</dd></Reveal>)}
          </dl>
        )}

        <div className="case-blocks">
          {blocks.map(([title, body]) => <Block key={title} n={++n} title={title}>{body}</Block>)}
        </div>
      </div>

      <a className="next-project" href={`#/projects/${next.slug}`}>
        <div className="wrap next-inner">
          <span className="mono">Next project</span>
          <span className="next-title">{next.t} <ArrowRight className="next-arrow" /></span>
          <img className="next-img" src={img(next.img)} alt="" loading="lazy" style={{ objectPosition: next.pos }} />
        </div>
      </a>
    </article>
  );
}
