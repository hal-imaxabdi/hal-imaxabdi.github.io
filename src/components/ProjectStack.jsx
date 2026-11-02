import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { G, projects } from "../data.js";
import Shot from "./Shot.jsx";
import { GitHubIcon, Magnetic, pad, SectionTitle } from "./ui.jsx";

const FEATURED = 4;

// One project card. It pins while the next card slides over it, then shrinks back into the pile.
function StackCard({ p, i, n, progress }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.05]);
  const lead = p.stats?.[0];

  return (
    <div ref={ref} className="stack-slot">
      <motion.article className={`stack-card ${i % 2 ? "is-dark" : ""}`} style={{ scale, top: `${i * 22}px` }}>
        <div className="stack-info">
          <p className="stack-meta mono">
            <span>{pad(i + 1)} / {pad(n)}</span>
            <span>{p.cats.join(" · ")}</span>
          </p>
          <h3><a href={`/projects/${p.slug}`}>{p.t}</a></h3>
          <p className="stack-kicker">{p.k}</p>
          <p className="stack-desc">{p.d}</p>
          {lead && (
            <p className="stack-stat"><strong>{lead[0]}</strong><span>{lead[1]}</span></p>
          )}
          <ul className="tags">{p.tags.slice(0, 5).map((t) => <li key={t}>{t}</li>)}</ul>
          <div className="stack-actions">
            <Magnetic>
              <a className="btn btn-primary" href={`/projects/${p.slug}`}>Read the case study <ArrowRight size={15} /></a>
            </Magnetic>
            {p.live && <a className="icon-btn" href={p.live} target="_blank" rel="noopener" aria-label={`${p.t} live demo`}><ArrowUpRight size={16} /></a>}
            {p.repo && <a className="icon-btn" href={G + p.repo} target="_blank" rel="noopener" aria-label={`${p.t} source code`}><GitHubIcon width={15} height={15} /></a>}
          </div>
        </div>
        <a className="stack-media" href={`/projects/${p.slug}`} tabIndex={-1} aria-hidden="true">
          <Shot p={p} card style={{ scale: imgScale }} />
        </a>
      </motion.article>
    </div>
  );
}

export default function ProjectStack() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const featured = projects.slice(0, FEATURED);

  return (
    <section className="section" id="work">
      <div className="wrap">
        <SectionTitle
          title="Selected work"
          count={projects.length}
          intro="Projects where I had to get security or correctness right. Each one opens into a full case study."
          action={<a className="link-arrow" href="/projects">All projects <ArrowRight size={15} /></a>}
        />
        <div className="stack" ref={container}>
          {featured.map((p, i) => (
            <StackCard key={p.slug} p={p} i={i} n={featured.length} progress={scrollYProgress} />
          ))}
        </div>
        {projects.length > FEATURED && (
          <div className="stack-more">
            <a className="more-link" href="/projects">
              <span>See all {projects.length} projects</span>
              <ArrowRight size={22} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
