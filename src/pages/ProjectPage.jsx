import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { G, caseStudies as projects } from "../data.js";
import { img } from "../router.js";
import { NagiPage, Pentagon } from "../components/FieldWork.jsx";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitHub } from "../components/Icons.jsx";
import "./project.css";

function Block({ title, children, className = "" }) {
  return (
    <section className={`pj-block ${className}`}>
      <h2 className="pj-h">{title}</h2>
      {children}
    </section>
  );
}

// Screenshot slider: glides to the next screenshot every few seconds (paused on hover/focus),
// with arrows and dots; you can also swipe or scroll it sideways.
function Gallery({ p }) {
  const shots = [p.img, ...(p.gallery ?? [])].filter(Boolean);
  const n = shots.length;
  const track = useRef(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const go = (k) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: (((k % n) + n) % n) * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };
  useEffect(() => {
    if (n < 2 || paused || reduce) return;
    const id = setTimeout(() => go(i + 1), 4500);
    return () => clearTimeout(id);
  }, [i, paused, reduce, n]);

  if (!n) return null;
  return (
    <div className="pj-gallery" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="pj-frame">
        <div className="pj-track" ref={track} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
          {shots.map((s, k) => (
            <a key={s} className="pj-slide" href={img(s)} target="_blank" rel="noopener" aria-label={`Open screenshot ${k + 1} full size`}>
              <img src={img(s)} alt={`${p.t} screenshot ${k + 1} of ${n}`} decoding="async" loading={k ? "lazy" : "eager"} />
            </a>
          ))}
        </div>
      </div>
      {n > 1 && (
        <div className="pj-ctrl">
          <button className="pj-arrow" onClick={() => go(i - 1)} aria-label="Previous screenshot"><ArrowLeft size={16} /></button>
          <div className="pj-dots" role="group" aria-label="Screenshots">
            {shots.map((s, k) => <button key={s} className="pj-dot" aria-pressed={k === i} aria-label={`Show screenshot ${k + 1}`} onClick={() => go(k)} />)}
          </div>
          <button className="pj-arrow" onClick={() => go(i + 1)} aria-label="Next screenshot"><ArrowRight size={16} /></button>
        </div>
      )}
    </div>
  );
}

/* One project: what it is, why, what I did, how it works, then results and tools on the side.
   A section only appears when data.js has that field. */
export default function ProjectPage({ slug }) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) {
    return (
      <NagiPage>
        <h1 className="pj-title">Project not found</h1>
        <p className="pj-d"><a href="/#fieldwork">See all projects</a></p>
      </NagiPage>
    );
  }
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <NagiPage>
      <article className="pj">
        <header className="pj-hero">
          <div className="pj-intro">
            <p className="pj-cats"><Pentagon />{p.cats.join(" / ")}</p>
            <h1 className="pj-title">{p.t}</h1>
            <p className="pj-k">{p.k}</p>
            <p className="pj-d">{p.d}</p>
            {(p.repo || p.live) && (
              <div className="pj-actions">
                {p.repo && <a className="btn btn-primary btn-sm" href={G + p.repo} target="_blank" rel="noopener"><GitHub size={16} /> GitHub</a>}
                {p.live && <a className={`btn btn-sm ${p.repo ? "btn-ghost" : "btn-primary"}`} href={p.live} target="_blank" rel="noopener">Live demo <ArrowUpRight size={16} /></a>}
              </div>
            )}
          </div>
          <Gallery p={p} />
        </header>

        <div className="pj-cols">
          <div className="pj-main">
            {p.problem && <Block title="Why I built it"><p className="pj-text">{p.problem}</p></Block>}

            {p.points && (
              <Block title="What I did">
                <ul className="pj-points">
                  {p.points.map(([t, d]) => <li key={t}><Pentagon /><p><strong>{t}:</strong> {d}</p></li>)}
                </ul>
              </Block>
            )}

            {p.flow && (
              <Block title="How it works">
                <ol className="pj-flow">
                  {p.flow.map(([name, note]) => <li key={name}><strong>{name}</strong><span>{note}</span></li>)}
                </ol>
              </Block>
            )}
          </div>

          <aside className="pj-side">
            {p.stats && (
              <Block title="Results" className="pj-panel">
                <ul className="pj-results">
                  {p.stats.map(([big, small]) => <li key={big}><strong>{big}</strong><span>{small}</span></li>)}
                </ul>
                {p.note && <p className="pj-note">{p.note}</p>}
              </Block>
            )}

            {p.stack && (
              <Block title="Tools I used" className="pj-panel">
                <dl className="pj-stack">
                  {p.stack.map(([g, items]) => (
                    <div key={g}><dt>{g}</dt><dd>{items.map((t) => <i key={t}>{t}</i>)}</dd></div>
                  ))}
                </dl>
              </Block>
            )}
          </aside>
        </div>

        <a className="pj-next" href={`/projects/${next.slug}/`}>
          <span>Next project</span>
          <strong>{next.t} <b aria-hidden="true">→</b></strong>
        </a>
      </article>
    </NagiPage>
  );
}
