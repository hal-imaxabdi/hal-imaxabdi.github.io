import { useState } from "react";
import { caseStudies, projectCats } from "../data.js";
import PageShell from "../components/PageShell.jsx";
import MatchCard from "../components/MatchCard.jsx";
import { pad } from "../components/ui.jsx";

export default function ProjectsPage() {
  const [cat, setCat] = useState("All");
  const cats = ["All", ...projectCats.filter((c) => caseStudies.some((p) => p.cats.includes(c)))];
  const shown = caseStudies.filter((p) => cat === "All" || p.cats.includes(cat));
  return (
    <PageShell crumb="Field Work / all projects">
      <header className="page-head">
        <h1 className="page-h1">Field Work <span className="count">{pad(caseStudies.length)}</span></h1>
        <p className="prose">Security labs, tools and secure web apps. Open any project for the full case study.</p>
      </header>
      <div className="tabs" role="group" aria-label="Filter projects">
        {cats.map((c) => (
          <button key={c} className="tab" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c} <span>{c === "All" ? caseStudies.length : caseStudies.filter((p) => p.cats.includes(c)).length}</span>
          </button>
        ))}
      </div>
      <div className="matches">{shown.map((p) => <MatchCard key={p.slug} p={p} i={caseStudies.indexOf(p)} />)}</div>
    </PageShell>
  );
}
