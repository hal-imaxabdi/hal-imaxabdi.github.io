import { G } from "../data.js";
import { img } from "../router.js";
import { ArrowRight, ArrowUpRight, GitHub } from "./Icons.jsx";
import { pad, Tags } from "./ui.jsx";

// One project row on the /projects/ page.
export default function MatchCard({ p, i }) {
  const href = `/projects/${p.slug}/`;
  return (
    <article className="match" data-reveal>
      <a className="match-shot" href={href} tabIndex={-1} aria-hidden="true">
        {p.img && <img src={img(p.img)} alt="" loading="lazy" decoding="async" style={{ objectPosition: p.pos }} />}
        <span className="match-no">{pad(i + 1)}</span>
      </a>
      <div className="match-body">
        <p className="match-cats">{p.cats.join(" / ")}</p>
        <h3 className="match-title"><a href={href}>{p.t}</a></h3>
        <p className="match-k">{p.k}</p>
        <p className="match-d">{p.d}</p>
        <Tags items={p.tags} />
        <div className="match-links">
          <a className="btn btn-primary btn-sm" href={href}>Case study <ArrowRight size={16} /></a>
          {p.repo && <a className="btn btn-ghost btn-sm" href={G + p.repo} target="_blank" rel="noopener"><GitHub size={16} /> GitHub</a>}
          {p.live && <a className="btn btn-ghost btn-sm" href={p.live} target="_blank" rel="noopener">Live demo <ArrowUpRight size={16} /></a>}
        </div>
      </div>
    </article>
  );
}
