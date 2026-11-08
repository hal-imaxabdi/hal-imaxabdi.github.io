import { useState } from "react";
import { G, caseStudies as projects } from "../data.js";
import { img } from "../router.js";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitHub } from "../components/Icons.jsx";
import PageShell from "../components/PageShell.jsx";
import { pad, Tags } from "../components/ui.jsx";

// Request flow: numbered boxes joined by arrows.
function Flow({ steps }) {
  return (
    <ol className="flow">
      {steps.map(([name, note], i) => (
        <li key={name} className="flow-node">
          <span className="flow-step">{pad(i + 1)}</span>
          <strong>{name}</strong>
          <small>{note}</small>
        </li>
      ))}
    </ol>
  );
}

function Block({ n, title, children }) {
  return (
    <section className="case-block" data-reveal>
      <h2 className="case-label"><span>{pad(n)}</span>{title}</h2>
      <div className="case-content">{children}</div>
    </section>
  );
}

function Gallery({ p }) {
  const shots = [p.img, ...(p.gallery ?? [])].filter(Boolean);
  const [i, setI] = useState(0);
  if (!shots.length) return null;
  return (
    <div className="case-gallery" data-reveal>
      <div className="case-shot">
        <img src={img(shots[i])} alt={`${p.t} screenshot ${i + 1} of ${shots.length}`} decoding="async" />
      </div>
      {shots.length > 1 && (
        <div className="thumbs" role="group" aria-label="Screenshots">
          {shots.map((s, k) => (
            <button key={s} className="thumb" aria-pressed={k === i} aria-label={`Show screenshot ${k + 1}`} onClick={() => setI(k)}>
              <img src={img(s)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* One project as a case study. Sections appear only when data.js has that field:
   purpose (d), problem, role/built/users, points, flow + how, stack, stats, learned, skills. */
export default function ProjectPage({ slug }) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) {
    return (
      <PageShell crumb="Field Work">
        <h1 className="page-h1">Project not found</h1>
        <p className="prose">It may still be in the training ground. <a href="/projects/">See all projects →</a></p>
      </PageShell>
    );
  }
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  const glance = [["My role", p.role], ["What I built", p.built], ["Who it's for", p.users]].filter(([, v]) => v);

  const blocks = [
    p.problem && ["The problem", <p className="prose case-lead">{p.problem}</p>],
    p.points && ["Key features", (
      <ul className="feature-grid">
        {p.points.map(([t, d], i) => <li key={t}><span>{pad(i + 1)}</span><h3>{t}</h3><p>{d}</p></li>)}
      </ul>
    )],
    p.flow && ["How it works", (
      <>
        <Flow steps={p.flow} />
        {p.how && (
          <ol className="how-list">
            {p.how.map(([t, d], i) => <li key={t}><span>{pad(i + 1)}</span><div><strong>{t}</strong><p>{d}</p></div></li>)}
          </ol>
        )}
      </>
    )],
    p.stack && ["Tools & technologies", (
      <dl className="stack-rows">
        {p.stack.map(([g, items]) => <div key={g}><dt>{g}</dt><dd><Tags items={items} /></dd></div>)}
      </dl>
    )],
    p.stats && ["Results", (
      <>
        <ul className="result-grid">
          {p.stats.map(([big, small]) => <li key={big}><strong>{big}</strong><span>{small}</span></li>)}
        </ul>
        {p.note && <p className="case-note">{p.note}</p>}
      </>
    )],
    p.learned && ["What I learned", <ul className="learned">{p.learned.map((l) => <li key={l}>{l}</li>)}</ul>],
    p.skills && ["Skills demonstrated", <Tags items={p.skills} className="tags-lg" />],
  ].filter(Boolean);

  return (
    <PageShell crumb={`Field Work / ${pad(index + 1)} of ${pad(projects.length)}`}>
      <article className="case">
        <a className="back-link" href="/projects/"><ArrowLeft size={16} /> All projects</a>

        <header className="case-head" data-reveal>
          <p className="case-cats">{p.cats.join(" / ")}</p>
          <h1 className="page-h1">{p.t}</h1>
          <p className="case-kicker">{p.k}</p>
          <p className="prose case-purpose">{p.d}</p>
          <div className="case-actions">
            {p.repo && <a className="btn btn-primary" href={G + p.repo} target="_blank" rel="noopener"><GitHub size={16} /> View on GitHub</a>}
            {p.live && <a className={`btn ${p.repo ? "btn-ghost" : "btn-primary"}`} href={p.live} target="_blank" rel="noopener">Live demo <ArrowUpRight size={16} /></a>}
          </div>
          <Tags items={p.tags} />
        </header>

        <Gallery p={p} />

        {glance.length > 0 && (
          <dl className="glance" data-reveal>{glance.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        )}

        <div className="case-blocks">
          {blocks.map(([title, body], i) => <Block key={title} n={i + 1} title={title}>{body}</Block>)}
        </div>

        <a className="next-project" href={`/projects/${next.slug}/`} data-reveal>
          <span className="next-label">Next project</span>
          <span className="next-title">{next.t} <ArrowRight size={24} /></span>
        </a>
      </article>
    </PageShell>
  );
}
