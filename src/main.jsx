import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { G, me, about, education, interests, projectCats, projects, jobs, skillsIntro, stack, certCats, certs, contact } from "./data.js";

/* ---------- ROUTER (hash based, so it works on GitHub Pages with no server rules) ---------- */
const NAV = [["/", "Home"], ["/about", "About"], ["/projects", "Projects"], ["/skills", "Skills"], ["/experience", "Experience"], ["/certificates", "Certificates"], ["/contact", "Connect"]];
const pad = n => String(n).padStart(2, "0");
const parse = () => (location.hash.replace(/^#/, "") || "/").replace(/\/+$/, "") || "/";
function useRoute() {
  const [r, setR] = useState(parse);
  useEffect(() => { const f = () => setR(parse()); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []);
  return r;
}
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- SMALL PARTS ---------- */
const Dot = ({ cls = "" }) => <i className={"dot " + cls} aria-hidden="true" />;
const Tags = ({ list }) => <ul className="tags">{list.map(t => <li key={t}>{t}</li>)}</ul>;
const Head = ({ no, label, title, children }) => (
  <header className="phead">
    <p className="label">{no}. {label}</p>
    <h1 data-focus tabIndex={-1}>{title}</h1>
    {children}
  </header>
);
const Filters = ({ items, value, onChange, label }) => (
  <div className="filters" role="group" aria-label={label}>
    {items.map(c => <button key={c} type="button" aria-pressed={value === c} onClick={() => onChange(c)}>{c}</button>)}
  </div>
);

/* ---------- NAV / FOOTER ---------- */
function Nav({ route }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [route]);
  useEffect(() => {
    document.body.classList.toggle("lock", open);
    const k = e => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open]);
  const on = p => (p === "/" ? route === "/" : route === p || route.startsWith(p + "/"));
  return (
    <header className="nav">
      <a className="mark" href="#/" aria-label="Halima, home">Halima.</a>
      <nav id="menu" className={open ? "open" : ""} aria-label="Main">
        <ul>{NAV.map(([p, l]) => <li key={p}><a href={"#" + p} aria-current={on(p) ? "page" : undefined}>{l}</a></li>)}</ul>
      </nav>
      <button className="burger" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
        <span className="sr">{open ? "Close menu" : "Open menu"}</span><b /><b />
      </button>
    </header>
  );
}
const Footer = () => (
  <footer className="foot">
    <span>© Halima Abdirizak Mohamed</span>
    <span>{me.origin}</span>
    <a href="#/contact">Get in touch</a>
  </footer>
);

/* ---------- HOME ---------- */
const Facts = () => (
  <dl className="facts">
    <div><dt>Education</dt><dd>{education.degree}<br />{education.school}<br /><span className="mute">({education.status.toLowerCase()})</span></dd></div>
    <div><dt>Location</dt><dd>Kenyan.<br />Currently studying in Indonesia.</dd></div>
    <div><dt>Interests</dt><dd><ul className="dots">{interests.map(x => <li key={x}>{x}</li>)}</ul></dd></div>
  </dl>
);
function Home() {
  const track = useRef(null);
  const [idx, setIdx] = useState(0);
  const N = 2;
  const go = i => {
    const t = track.current, k = Math.max(0, Math.min(N - 1, i));
    t.scrollTo({ left: k * t.clientWidth, behavior: reduced() ? "auto" : "smooth" });
  };
  const onScroll = e => { const t = e.currentTarget; setIdx(Math.round(t.scrollLeft / t.clientWidth)); };
  useEffect(() => {                         // the home page slides sideways: mouse wheel / trackpad / arrow keys step to the next panel
    const t = track.current; let lock = false;
    const step = d => { if (lock) return; lock = true; go(Math.round(t.scrollLeft / t.clientWidth) + d); setTimeout(() => (lock = false), 700); };
    const wheel = e => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX) || Math.abs(e.deltaY) < 8) return;
      const pn = e.target.closest(".hpanel"), c = pn && pn.querySelector(".hero-copy,.home-about-in");
      if (c && c.offsetHeight > pn.clientHeight - 40) return;   // a tall panel on a small screen scrolls normally
      e.preventDefault(); step(e.deltaY > 0 ? 1 : -1);
    };
    const key = e => { if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1); };
    t.addEventListener("wheel", wheel, { passive: false }); addEventListener("keydown", key);
    return () => { t.removeEventListener("wheel", wheel); removeEventListener("keydown", key); };
  }, []);
  return (
    <div className="hslide" ref={track} onScroll={onScroll}>
      <section className="hpanel hero" aria-labelledby="hero-name" aria-hidden={idx !== 0 ? "true" : undefined}>
        <Dot cls="h1" /><Dot cls="h2" /><Dot cls="h3" /><Dot cls="h4" /><Dot cls="h5 ring" />
        <div className="hero-copy">
          <h1 id="hero-name" data-focus tabIndex={-1} aria-label={"Hi, I'm " + me.first + " " + me.last}>
            <span className="ln" aria-hidden="true"><span className="hi" style={{ "--i": 0 }}>Hi, I&rsquo;m</span></span>
            <span className="ln" aria-hidden="true"><span style={{ "--i": 1 }}>{me.first}</span></span>
            <span className="ln" aria-hidden="true"><span style={{ "--i": 2 }}>{me.last}</span></span>
          </h1>
          <p className="lede">{me.tagline}</p>
          <a className="btn" href="#/projects">Explore my work <span aria-hidden="true">→</span></a>
        </div>
        <button type="button" className="hnext" onClick={() => go(1)}><span>Scroll</span><i aria-hidden="true" /></button>
      </section>
      <section className="hpanel home-about" aria-labelledby="about-h" aria-hidden={idx !== 1 ? "true" : undefined}>
        <Dot cls="ha1" /><Dot cls="ha2 ring" /><Dot cls="ha3" />
        <div className="home-about-in">
          <p className="label">About me</p>
          <h2 id="about-h">A bit about me.</h2>
          <div className="about-grid">
            <div className="prose">
              {about.slice(0, 2).map((p, i) => <p key={i}>{p}</p>)}
              <a className="btn" href="#/about">More about me <span aria-hidden="true">→</span></a>
            </div>
            <Facts />
          </div>
        </div>
        <button type="button" className="hnext back" onClick={() => go(0)}><i aria-hidden="true" /><span>Back</span></button>
      </section>
      <p className="hcount mono" aria-hidden="true">{pad(idx + 1)} / {pad(N)}</p>
    </div>
  );
}

/* ---------- ABOUT ---------- */
function About() {
  return (
    <div className="page about">
      <Dot cls="a1" /><Dot cls="a2" /><Dot cls="a3" />
      <Head no="01" label="About" title={<>About<br />Me.</>} />
      <div className="about-grid">
        <div className="prose">{about.map((p, i) => <p key={i}>{p}</p>)}</div>
        <Facts />
      </div>
    </div>
  );
}

/* ---------- PROJECTS ---------- */
const SHAPES = ["wide", "m7", "m5", "rev"];    // repeating rhythm; works for any number of projects
function Shot({ p, big }) {
  if (!p.img) return <div className="shot ph" aria-hidden="true"><span>{p.t}</span></div>;
  return (
    <div className={"shot" + (p.fit === "contain" ? " contain" : "")}>
      <img src={"assets/img/" + p.img} alt={`${p.t} screenshot`} loading={big ? "eager" : "lazy"} style={p.pos ? { objectPosition: p.pos } : undefined} />
    </div>
  );
}
function Card({ p, i, n }) {
  const stat = p.stats && p.stats[0];
  // The screenshot tilts a few degrees toward the pointer and its image slides the other way (depth). Skipped for touch / reduced motion.
  const tilt = e => {
    if (reduced() || e.pointerType === "touch") return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty("--rx", (((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2));
    el.style.setProperty("--ry", (((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(2));
  };
  const flat = e => { e.currentTarget.style.setProperty("--rx", 0); e.currentTarget.style.setProperty("--ry", 0); };
  return (
    <li className={"card rv " + SHAPES[i % SHAPES.length]}>
      <a href={"#/projects/" + p.slug}>
        <span className="num" aria-hidden="true">{pad(n)}</span>
        <div className="meta">
          <h2>{p.t}</h2>
          <p className="kicker">{p.k}</p>
          <Tags list={p.tags.slice(0, 5)} />
          <p className="sum">{p.d}</p>
          <span className="more">View details <i aria-hidden="true">→</i></span>
        </div>
        <div className="fig" onPointerMove={tilt} onPointerLeave={flat}>
          <Shot p={p} big={i === 0} />
          <i className="orb" aria-hidden="true">↗</i>
          {stat && <p className="peek"><b>{stat[0]}</b> {stat[1]}</p>}
        </div>
      </a>
    </li>
  );
}
function Projects() {
  const cats = ["All", ...projectCats.filter(c => projects.some(p => p.cats.includes(c)))];
  const [cat, setCat] = useState("All");
  const list = projects.map((p, n) => ({ p, n: n + 1 })).filter(({ p }) => cat === "All" || p.cats.includes(cat));
  useEffect(() => {                         // each card reveals (image wipes in, text rises) the first time it scrolls into view
    const cards = [...document.querySelectorAll(".card.rv:not(.in)")];
    if (reduced() || !("IntersectionObserver" in window)) { cards.forEach(c => c.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    cards.forEach(c => io.observe(c));
    return () => io.disconnect();
  }, [cat]);
  return (
    <div className="page projects">
      <Dot cls="p1" /><Dot cls="p2" /><Dot cls="p3" />
      <Head no="03" label="Projects" title={<>Selected<br />Projects.</>}>
        <p className="intro">A collection of projects that showcase my skills in full-stack development, backend engineering and cybersecurity.</p>
      </Head>
      <Filters items={cats} value={cat} onChange={setCat} label="Filter projects" />
      <ol className="grid">{list.map(({ p, n }, i) => <Card key={p.slug} p={p} i={i} n={n} />)}</ol>
      {!list.length && <p className="intro">No projects in this category yet.</p>}
    </div>
  );
}

function Flow({ steps }) {
  return (
    <ol className="flow">
      {steps.map(([a, b], i) => <li key={a}><span className="box"><b>{a}</b><small>{b}</small></span>{i < steps.length - 1 && <i aria-hidden="true">→</i>}</li>)}
    </ol>
  );
}
function Project({ slug }) {
  const i = projects.findIndex(p => p.slug === slug);
  if (i < 0) return <NotFound />;
  const p = projects[i], prev = projects[i - 1], next = projects[i + 1];
  const secs = [
    p.problem && ["The problem", <p key="pr">{p.problem}</p>],
    p.approach && ["My approach", <p key="ap">{p.approach}</p>],
    p.points && ["Key features", <ul className="fgrid" key="k">{p.points.map(([a, b]) => <li key={a}><h3>{a}</h3><p>{b}</p></li>)}</ul>],
    p.flow && ["How it works", <Flow key="f" steps={p.flow} />],
    p.stack && ["Tech stack", <dl className="stk" key="st">{p.stack.map(([g, items]) => <div key={g}><dt>{g}</dt><dd><Tags list={items} /></dd></div>)}</dl>],
    p.stats && ["Results", <div key="r"><ul className="stats">{p.stats.map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>{p.note && <p className="note">{p.note}</p>}</div>],
    p.skills && ["Skills demonstrated", <Tags key="sk" list={p.skills} />],
  ].filter(Boolean);
  return (
    <div className="page case">
      <Dot cls="c1" /><Dot cls="c2 ring" />
      <div className="case-bar"><a className="link" href="#/projects">← Back to projects</a><span className="mute mono">{pad(i + 1)} / {pad(projects.length)}</span></div>
      <div className="case-top">
        <div>
          <p className="label">{pad(i + 1)}. Project{p.status ? " · " + p.status : ""}</p>
          <h1 data-focus tabIndex={-1}>{p.t}</h1>
          <p className="kicker">{p.k}</p>
          <Tags list={p.tags} />
          <p className="lead">{p.d}</p>
          <div className="actions">
            {p.repo && <a className="btn" href={G + p.repo} target="_blank" rel="noopener noreferrer">View repository <span aria-hidden="true">↗</span></a>}
            {p.live && <a className="btn ghost" href={p.live} target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
          </div>
        </div>
        <Shot p={p} big />
      </div>
      <div className="case-body">
        <div className="secs">
          {secs.map(([h, body], k) => (
            <section key={h} aria-labelledby={"s" + k}><h2 id={"s" + k}><span>{pad(k + 1)}.</span> {h}</h2>{body}</section>
          ))}
        </div>
        <aside className="side" aria-label="Project details">
          {p.status && <><h2>Status</h2><p>{p.status}</p></>}
          <h2>Category</h2><p>{p.cats.join(" · ")}</p>
          {p.repo && <><h2>Code</h2><p><a className="link" href={G + p.repo} target="_blank" rel="noopener noreferrer">{p.repo}</a></p></>}
          {p.live && <><h2>Live demo</h2><p><a className="link" href={p.live} target="_blank" rel="noopener noreferrer">{p.live.replace(/^https?:\/\//, "")}</a></p></>}
        </aside>
      </div>
      <nav className="pn" aria-label="More projects">
        {prev ? <a href={"#/projects/" + prev.slug}>← <span><small>Previous</small>{prev.t}</span></a> : <span />}
        {next ? <a className="r" href={"#/projects/" + next.slug}><span><small>Next</small>{next.t}</span> →</a> : <a className="r" href="#/projects"><span><small>That's all for now</small>All projects</span> →</a>}
      </nav>
    </div>
  );
}

/* ---------- SKILLS ---------- */
function Skills() {
  return (
    <div className="page skills">
      <Dot cls="s1" /><Dot cls="s2" />
      <Head no="04" label="Skills" title="Skills."><p className="intro">{skillsIntro}</p></Head>
      <div className="groups">
        {stack.map(g => (
          <section key={g.title} className="group"><h2>{g.title}</h2><ul className="dots cols">{g.items.map(x => <li key={x}>{x}</li>)}</ul></section>
        ))}
      </div>
    </div>
  );
}

/* ---------- EXPERIENCE ---------- */
function Experience() {
  return (
    <div className="page exp">
      <Dot cls="e1" /><Dot cls="e2" />
      <Head no="05" label="Experience" title={<>Experience<br />&amp; Learning.</>} />
      <ol className="line">
        {jobs.map(j => (
          <li key={j.role + j.when}>
            <p className="when mono">{j.when}{j.mode ? " · " + j.mode : ""}</p>
            <div>
              <h2>{j.role}</h2>
              <p className="org">{j.org}{j.type === "education" ? " · Education" : ""}</p>
              <ul className="pts">{j.points.map(([a, b]) => <li key={a}><b>{a}</b> {b}</li>)}</ul>
              {j.tags && <Tags list={j.tags} />}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- CERTIFICATES ---------- */
function Certificates() {
  const earned = certs.filter(c => (c.status || "earned") === "earned");
  const dev = certs.filter(c => c.status === "in progress");
  const cats = ["All", ...certCats.filter(c => earned.some(x => x.cat === c)), ...(dev.length ? ["In development"] : [])];
  const [cat, setCat] = useState("All");
  const [view, setView] = useState(null);
  const dlg = useRef(null);
  useEffect(() => { const d = dlg.current; if (view && d && !d.open) d.showModal(); }, [view]);
  const list = cat === "In development" ? dev : earned.filter(c => cat === "All" || c.cat === cat);
  return (
    <div className="page certs">
      <Dot cls="k1" /><Dot cls="k2 ring" />
      <Head no="06" label="Certificates" title="Certificates."><p className="intro">Verified credentials and continuous learning.</p></Head>
      {cats.length > 2 && <Filters items={cats} value={cat} onChange={setCat} label="Filter certificates" />}
      <ul className="cgrid">
        {list.map(c => c.status === "in progress" ? (
          <li key={c.t}>
            <div className="cimg dev"><span>In development</span></div>
            <h2>{c.t}</h2>
            <p className="org">{c.org}</p>
            <p className="mono soon">Currently working towards this certificate.</p>
          </li>
        ) : (
          <li key={c.t}>
            <button type="button" className="cimg" onClick={() => setView(c)} aria-label={`View ${c.t} certificate larger`}>
              <img src={"assets/certs/" + c.img} alt={`${c.t} certificate from ${c.org}`} loading="lazy" />
            </button>
            <h2>{c.t}</h2>
            <p className="org">{c.org}{c.date ? " · " + c.date : ""}</p>
            {c.skills && <Tags list={c.skills} />}
            <p className="row">
              <button type="button" className="link" onClick={() => setView(c)}>View certificate ↗</button>
              {c.verify && <a className="link" href={c.verify} target="_blank" rel="noopener noreferrer">Verify ↗</a>}
            </p>
          </li>
        ))}
      </ul>
      {view && (
        <dialog ref={dlg} className="lightbox" aria-label={view.t} onClose={() => setView(null)} onClick={e => e.target === dlg.current && dlg.current.close()}>
          <form method="dialog"><button className="x" aria-label="Close">×</button></form>
          <img src={"assets/certs/" + view.img} alt={`${view.t} certificate from ${view.org}`} />
          <p><b>{view.t}</b> · {view.org}</p>
        </dialog>
      )}
    </div>
  );
}

/* ---------- CONNECT ---------- */
function Contact() {
  const short = u => u.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");
  const rows = [["Email", contact.email, "mailto:" + contact.email], ["LinkedIn", short(contact.linkedin), contact.linkedin], ["GitHub", short(contact.github), contact.github]];
  return (
    <div className="page contact">
      <Dot cls="x1" /><Dot cls="x2" /><Dot cls="x3" />
      <Head no="07" label="Connect" title={<>Let&rsquo;s<br />Connect.</>}>
        <p className="intro">Feel free to reach out if you'd like to collaborate, have a question, or just say hi. I'd love to hear from you.</p>
      </Head>
      <ul className="links">
        {rows.map(([l, t, h]) => <li key={l}><a href={h} {...(h.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}><span className="label">{l}</span><span className="v">{t}</span><span aria-hidden="true">↗</span></a></li>)}
        {contact.cv && <li><a href={contact.cv} download><span className="label">Résumé</span><span className="v">Download as PDF</span><span aria-hidden="true">↓</span></a></li>}
      </ul>
    </div>
  );
}

const NotFound = () => (
  <div className="page"><Head no="404" label="Not found" title="Page not found." /><p className="intro">That page doesn't exist. <a className="link" href="#/">Go home →</a></p></div>
);

/* ---------- APP ---------- */
const TITLES = { "/about": "About", "/projects": "Projects", "/skills": "Skills", "/experience": "Experience", "/certificates": "Certificates", "/contact": "Connect" };
function App() {
  const route = useRoute();
  const m = route.match(/^\/projects\/(.+)$/);
  const mv = e => {                         // circles on every page drift slightly toward the pointer
    if (reduced() || e.pointerType === "touch") return;
    e.currentTarget.style.setProperty("--px", (e.clientX / innerWidth - 0.5).toFixed(3));
    e.currentTarget.style.setProperty("--py", (e.clientY / innerHeight - 0.5).toFixed(3));
  };
  useEffect(() => { document.body.classList.toggle("home", route === "/"); }, [route]);
  useEffect(() => {
    const proj = m && projects.find(p => p.slug === m[1]);
    document.title = route === "/" ? "Halima Abdirizak Mohamed · Software Engineering & Cybersecurity" : (proj ? proj.t : TITLES[route] || "Not found") + " · Halima";
    window.scrollTo(0, 0);
    document.querySelector("[data-focus]")?.focus({ preventScroll: true });
  }, [route]);
  let page;
  if (route === "/") page = <Home />;
  else if (route === "/about") page = <About />;
  else if (route === "/projects") page = <Projects />;
  else if (m) page = <Project slug={m[1]} />;
  else if (route === "/skills") page = <Skills />;
  else if (route === "/experience") page = <Experience />;
  else if (route === "/certificates") page = <Certificates />;
  else if (route === "/contact") page = <Contact />;
  else page = <NotFound />;
  return (
    <>
      <a className="skip" href="#main" onClick={e => { e.preventDefault(); document.getElementById("main").focus(); }}>Skip to content</a>
      <Nav route={route} />
      <main id="main" tabIndex={-1} key={route} onPointerMove={mv}>{page}</main>
      <Footer />
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
