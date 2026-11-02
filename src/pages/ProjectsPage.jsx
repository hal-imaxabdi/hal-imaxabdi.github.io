import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUpRight, LayoutGrid, List } from "lucide-react";
import { projectCats, projects } from "../data.js";
import { img } from "../router.js";
import Shot from "../components/Shot.jsx";
import { ease, pad, SectionTitle } from "../components/ui.jsx";

// Floating screenshot that trails the cursor over the list (desktop pointers only).
function HoverPreview({ items, active, x, y }) {
  return (
    <motion.div className="hover-preview" style={{ x, y }} aria-hidden="true"
      animate={{ opacity: active == null ? 0 : 1, scale: active == null ? 0.6 : 1 }}
      transition={{ duration: 0.35, ease }}>
      {items.map((p, i) => (
        <motion.img key={p.slug} src={img(p.img)} alt="" style={{ objectPosition: p.pos }}
          animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.12 }} transition={{ duration: 0.4, ease }} />
      ))}
    </motion.div>
  );
}

function ListView({ items }) {
  const [active, setActive] = useState(null);
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const move = (e) => { x.set(e.clientX); y.set(e.clientY); };

  return (
    <div className="plist" onPointerMove={move} onPointerLeave={() => setActive(null)}>
      <ul className={active != null ? "is-hovering" : ""}>
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((p, i) => (
            <motion.li key={p.slug} layout
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease, delay: i * 0.04 }}
              className={active === i ? "is-active" : ""}
              onPointerEnter={(e) => e.pointerType !== "touch" && setActive(i)}>
              <a href={`/projects/${p.slug}`}>
                <span className="plist-num mono">{pad(projects.indexOf(p) + 1)}</span>
                <span className="plist-title">{p.t}</span>
                <span className="plist-kicker">{p.k}</span>
                <span className="plist-cats mono">{p.cats.join(" · ")}</span>
                <img className="plist-thumb" src={img(p.img)} alt="" loading="lazy" style={{ objectPosition: p.pos }} />
                <span className="plist-arrow"><ArrowUpRight size={22} /></span>
              </a>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <HoverPreview items={items} active={active} x={x} y={y} />
    </div>
  );
}

function GridView({ items }) {
  return (
    <ul className="pgrid">
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map((p, i) => (
          <motion.li key={p.slug} layout
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease, delay: i * 0.05 }}>
            <a href={`/projects/${p.slug}`} className="pcard">
              <div className="pcard-media"><Shot p={p} card /></div>
              <div className="pcard-body">
                <span className="mono pcard-num">{pad(projects.indexOf(p) + 1)}</span>
                <h3>{p.t}</h3>
                <p>{p.k}</p>
                <ul className="tags">{p.tags.slice(0, 4).map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              <span className="pcard-arrow"><ArrowUpRight size={18} /></span>
            </a>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export default function ProjectsPage() {
  const cats = ["All", ...projectCats.filter((c) => projects.some((p) => p.cats.includes(c)))];
  const [cat, setCat] = useState("All");
  const [view, setView] = useState(() => {
    try { return localStorage.getItem("projectView") || "list"; } catch { return "list"; }
  });
  const items = projects.filter((p) => cat === "All" || p.cats.includes(cat));
  const count = (c) => (c === "All" ? projects.length : projects.filter((p) => p.cats.includes(c)).length);

  function pickView(v) {
    setView(v);
    try { localStorage.setItem("projectView", v); } catch {}
  }

  return (
    <section className="section page-top">
      <div className="wrap">
        <a className="back-link" href="/"><ArrowLeft size={15} /> Home</a>
        <SectionTitle as="h1" title="Projects" count={projects.length}
          intro="Everything I’ve built, from full-stack apps to security labs. Pick one to see how it works." />

        <div className="toolbar">
          <div className="filters" role="group" aria-label="Filter projects">
            {cats.map((c) => (
              <button key={c} className={`filter ${cat === c ? "is-active" : ""}`} onClick={() => setCat(c)} aria-pressed={cat === c}>
                {cat === c && <motion.span layoutId="pfilter" className="filter-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="filter-label">{c} <sup>{count(c)}</sup></span>
              </button>
            ))}
          </div>
          <div className="view-toggle" role="group" aria-label="Layout">
            <button className={view === "list" ? "is-active" : ""} onClick={() => pickView("list")} aria-pressed={view === "list"} aria-label="List view"><List size={17} /></button>
            <button className={view === "grid" ? "is-active" : ""} onClick={() => pickView("grid")} aria-pressed={view === "grid"} aria-label="Grid view"><LayoutGrid size={17} /></button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {view === "list" ? <ListView items={items} /> : <GridView items={items} />}
          </motion.div>
        </AnimatePresence>
        {!items.length && <p className="section-intro">No projects in this category yet.</p>}
      </div>
    </section>
  );
}
