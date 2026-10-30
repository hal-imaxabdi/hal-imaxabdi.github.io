import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { G, me, about, education, interests, projectCats, projects, jobs, skillsIntro, stack, certCats, certs, goals, contact } from "./data.js";

/* ---------- ROUTER (hash based, so it works on GitHub Pages with no server rules) ----------
   Every nav item is its own page. Moving between them slides sideways: forward slides in from the right, back from the left.
   A single project (#/projects/slug) is a page too. */
const NAV = [["/", "Home"], ["/about", "About"], ["/experience", "Experience"], ["/skills", "Skills"], ["/projects", "Projects"], ["/certificates", "Certificates"], ["/contact", "Contact"]];
const ALIAS = {};
const pad = n => String(n).padStart(2, "0");
const parse = () => { const r = (location.hash.replace(/^#/, "") || "/").replace(/\/+$/, "") || "/"; return ALIAS[r] || r; };
function useRoute() {
  const [r, setR] = useState(parse);
  useEffect(() => { const f = () => setR(parse()); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []);
  return r;
}
try { history.scrollRestoration = "manual"; } catch (e) { /* not supported: fine */ }
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
/* position of a route in the nav; a project page counts as half a step after Projects */
const order = r => { const proj = /^\/projects\/.+/.test(r); return NAV.findIndex(([p]) => p === (proj ? "/projects" : r)) + (proj ? 0.5 : 0); };

/* ---------- SMALL PARTS ---------- */
const Arrow = ({ d = "right" }) => (
  <svg className={"arr " + d} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d={d === "left" ? "M12 7H2m4-4L2 7l4 4" : d === "up" ? "M3 11 11 3M5 3h6v6" : "M2 7h10M8 3l4 4-4 4"} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
/* Previous / next page links at the bottom of each page */
const Pager = ({ at }) => {
  const i = NAV.findIndex(([p]) => p === at), prev = NAV[i - 1], next = NAV[i + 1];
  return (
    <nav className="pager" aria-label="Previous and next page">
      {prev ? <a className="textlink" href={"#" + prev[0]}><Arrow d="left" />{prev[1]}</a> : <span />}
      {next ? <a className="textlink" href={"#" + next[0]}>{next[1]}<Arrow /></a> : <span />}
    </nav>
  );
};
/* ---------- 3D WIRE-MESH ----------
   A twisted ribbon drawn as shaded dots and wires on a canvas, with an orbit ring and small markers.
   It turns slowly by itself and follows the pointer. On the home page you can also drag it to spin it. */
const RIB = (() => {
  const U = 110, V = 26, P = new Float32Array(U * V * 3), N = new Float32Array(U * V * 3);
  const at = (u, v) => {
    const cx = 0.42 * Math.sin(2 * Math.PI * 1.1 * u + 0.6), cy = (u - 0.5) * 2.5, cz = 0.35 * Math.cos(2 * Math.PI * 0.9 * u);
    const th = Math.PI * 2.4 * u + 0.5 * Math.sin(2 * Math.PI * u);
    const w = 0.95 * (0.3 + 0.7 * Math.pow(Math.sin(Math.PI * u), 0.8));
    return [cx + w * v * Math.cos(th), cy + 0.07 * Math.sin(3 * v + 6 * u), cz + w * v * Math.sin(th)];
  };
  for (let i = 0; i < U; i++) for (let j = 0; j < V; j++) {
    const u = i / (U - 1), v = (j / (V - 1)) * 2 - 1, k = (i * V + j) * 3;
    const p = at(u, v), a = at(Math.min(1, u + 0.01), v), b = at(Math.max(0, u - 0.01), v), c = at(u, Math.min(1, v + 0.05)), d = at(u, Math.max(-1, v - 0.05));
    const t1 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], t2 = [c[0] - d[0], c[1] - d[1], c[2] - d[2]];
    const nx = t1[1] * t2[2] - t1[2] * t2[1], ny = t1[2] * t2[0] - t1[0] * t2[2], nz = t1[0] * t2[1] - t1[1] * t2[0], l = Math.hypot(nx, ny, nz) || 1;
    P.set(p, k); N[k] = nx / l; N[k + 1] = ny / l; N[k + 2] = nz / l;
  }
  return { U, V, P, N };
})();
const MARKS = [[0.9, 1.1, 0.2], [-1.0, -0.6, 0.5], [1.2, -1.0, -0.3], [-0.3, 1.4, -0.6]];
function Wire({ cls = "", hero = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d");
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#0b0b0c";
    const still = reduced(), dpr = Math.min(devicePixelRatio || 1, 2);
    const { U, V, P, N } = RIB, LV = 6, L = [-0.4, 0.6, 0.7].map((x, _, a) => x / Math.hypot(...a));
    const st = { spin: 0.6, vel: 0, px: 0, py: 0, cx: 0, cy: 0 };
    const SX = new Float32Array(U * V), SY = new Float32Array(U * V), lv = Array.from({ length: LV }, () => []);
    let raf = 0, last = performance.now(), drag = null;
    const size = () => { cv.width = Math.max(1, Math.round(cv.clientWidth * dpr)); cv.height = Math.max(1, Math.round(cv.clientHeight * dpr)); };
    const ro = new ResizeObserver(size); ro.observe(cv); size();
    const onMove = e => { if (e.pointerType === "touch") return; st.px = e.clientX / innerWidth - 0.5; st.py = e.clientY / innerHeight - 0.5; };
    addEventListener("pointermove", onMove);
    const down = e => { drag = e.clientX; cv.setPointerCapture(e.pointerId); cv.classList.add("grab"); };
    const move = e => { if (drag === null) return; st.vel = Math.max(-0.1, Math.min(0.1, st.vel + (e.clientX - drag) * 0.0012)); drag = e.clientX; };
    const up = () => { drag = null; cv.classList.remove("grab"); };
    if (hero) { cv.addEventListener("pointerdown", down); cv.addEventListener("pointermove", move); cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up); }
    const draw = t => {
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!still) st.spin += dt * 0.14;
      st.spin += st.vel; st.vel *= 0.94;
      st.cx += (st.px - st.cx) * 0.06; st.cy += (st.py - st.cy) * 0.06;
      const ay = st.spin + st.cx * 1.4, ax = -0.2 + st.cy * 0.8;
      const ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax);
      const W = cv.width, H = cv.height, S = Math.min(W, H) * 0.3, k = S / 280, ox = W / 2, oy = H / 2;
      const R = [0, 0, 0];
      const rot = (x, y, z) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca; R[0] = x1; R[1] = y * cb - z1 * sb; R[2] = y * sb + z1 * cb; };
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = ink; ctx.strokeStyle = ink;
      lv.forEach(a => (a.length = 0));
      for (let i = 0; i < U * V; i++) {
        const q = i * 3;
        rot(P[q], P[q + 1], P[q + 2]);
        const f = 3.4 / (3.4 - R[2]); SX[i] = ox + R[0] * S * f; SY[i] = oy + R[1] * S * f;
        const nx = N[q] * ca + N[q + 2] * sa, nz0 = -N[q] * sa + N[q + 2] * ca, ny = N[q + 1] * cb - nz0 * sb, nz = N[q + 1] * sb + nz0 * cb;
        const d = 1 - Math.abs(nx * L[0] + ny * L[1] + nz * L[2]);
        lv[Math.min(LV - 1, Math.floor(d * LV))].push(i);
      }
      ctx.lineWidth = 0.6 * dpr;
      ctx.globalAlpha = 0.16; ctx.beginPath();
      for (let i = 0; i < U; i += 7) for (let j = 0; j < V; j++) { const n = i * V + j; j ? ctx.lineTo(SX[n], SY[n]) : ctx.moveTo(SX[n], SY[n]); }
      ctx.stroke();
      ctx.globalAlpha = 0.1; ctx.beginPath();
      for (let j = 0; j < V; j += 5) for (let i = 0; i < U; i++) { const n = i * V + j; i ? ctx.lineTo(SX[n], SY[n]) : ctx.moveTo(SX[n], SY[n]); }
      ctx.stroke();
      for (let l = 0; l < LV; l++) {
        ctx.globalAlpha = 0.1 + 0.13 * l; ctx.beginPath();
        const r = (0.55 + 0.3 * l) * k * dpr;
        for (const i of lv[l]) { ctx.moveTo(SX[i] + r, SY[i]); ctx.arc(SX[i], SY[i], r, 0, 6.2832); }
        ctx.fill();
      }
      // orbit ring
      ctx.lineWidth = 0.9 * dpr;
      const ring = a => { const x = 1.35 * Math.cos(a), z = 1.35 * Math.sin(a); rot(x, -z * 0.9, z * 0.43 + x * 0.3); const f = 3.4 / (3.4 - R[2]); return [ox + R[0] * S * f, oy + R[1] * S * f, R[2]]; };
      let pr = ring(0);
      for (let n = 1; n <= 96; n++) {
        const c = ring((n / 96) * 6.2832);
        ctx.globalAlpha = 0.12 + 0.4 * ((c[2] + 1.6) / 3.2);
        ctx.beginPath(); ctx.moveTo(pr[0], pr[1]); ctx.lineTo(c[0], c[1]); ctx.stroke(); pr = c;
      }
      const bead = ring(st.spin * 1.3); ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(bead[0], bead[1], 3 * k * dpr, 0, 6.2832); ctx.fill();
      // small markers
      ctx.globalAlpha = 0.55; ctx.lineWidth = 1 * dpr;
      for (const m of MARKS) { rot(m[0], m[1], m[2]); const f = 3.4 / (3.4 - R[2]), x = ox + R[0] * S * f, y = oy + R[1] * S * f, a = 4 * k * dpr; ctx.beginPath(); ctx.moveTo(x - a, y); ctx.lineTo(x + a, y); ctx.moveTo(x, y - a); ctx.lineTo(x, y + a); ctx.stroke(); }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener("pointermove", onMove); };
  }, []);
  return <canvas ref={ref} className={"wire " + cls + (hero ? " hero" : "")} aria-hidden="true" />;
}
const Mesh = ({ cls = "" }) => <Wire cls={"mesh " + cls} />;
const Tags = ({ list }) => <ul className="tags">{list.map(t => <li key={t}>{t}</li>)}</ul>;
/* h="h2" for sections of the long page; the default h1 is for stand-alone pages (project, 404) */
const Head = ({ title, h: H = "h1", children }) => (
  <header className="phead">
    {H === "h1" ? <H data-focus tabIndex={-1}>{title}</H> : <H>{title}</H>}
    {children}
  </header>
);
const Filters = ({ items, value, onChange, label }) => (
  <div className="filters" role="group" aria-label={label}>
    {items.map(c => <button key={c} type="button" aria-pressed={value === c} onClick={() => onChange(c)}>{c}</button>)}
  </div>
);
/* the dot-mesh drifts slightly toward the pointer */
const drift = e => {
  if (reduced() || e.pointerType === "touch") return;
  e.currentTarget.style.setProperty("--px", (e.clientX / innerWidth - 0.5).toFixed(3));
  e.currentTarget.style.setProperty("--py", (e.clientY / innerHeight - 0.5).toFixed(3));
};
const Drift = ({ children }) => <div onPointerMove={drift}>{children}</div>;

/* ---------- NAV / FOOTER ---------- */
function Nav({ active }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("lock", open);
    const k = e => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open]);
  const close = () => setOpen(false);
  return (
    <header className="nav">
      <a className="mark" href="#/" aria-label="Halima, home" onClick={close}>H.</a>
      <nav id="menu" className={open ? "open" : ""} aria-label="Main">
        <ul>{NAV.map(([p, l]) => <li key={p}><a href={"#" + p} aria-current={active === p ? "page" : undefined} onClick={close}>{l}</a></li>)}</ul>
      </nav>
      <div className="nav-end">
        <button className="burger" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
          <span className="sr">{open ? "Close menu" : "Open menu"}</span><b /><b />
        </button>
      </div>
    </header>
  );
}
const Footer = () => (
  <footer className="foot">
    <span>© {new Date().getFullYear()} {me.name}</span>
    <a href="#/contact">Get in touch</a>
  </footer>
);

/* ---------- HOME (hero) ---------- */
/* The hero visual is the 3D wire-mesh: drag it to spin it, or just move the pointer. */
function HeroArt() {
  return <div className="hero-art"><Wire hero /></div>;
}
function Home() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-name">
      <div className="hero-copy">
        <h1 id="hero-name" data-focus tabIndex={-1} aria-label={"Hi, I'm " + me.name}>
          <span className="ln" aria-hidden="true"><span className="hi" style={{ "--i": 0 }}>Hi, I&rsquo;m</span></span>
          <span className="ln" aria-hidden="true"><span className="nm" style={{ "--i": 1 }}>{me.first}</span></span>
          <span className="ln" aria-hidden="true"><span className="sn" style={{ "--i": 2 }}>{me.name.split(" ").slice(1).join(" ")}.</span></span>
        </h1>
        <p className="lede">{me.tagline}</p>
        <div className="actions">
          <a className="btn" href="#/projects">View My Projects</a>
          <a className="textlink" href="#/about">About Me <Arrow /></a>
        </div>
      </div>
      <HeroArt />
      <div className="hero-foot">
        <a className="scroll" href="#/about" aria-label="Next page: About">About <Arrow /></a>
      </div>
    </section>
  );
}

/* ---------- ABOUT ---------- */
/* The card has a soft spotlight that follows the pointer. */
function About() {
  const spot = e => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", (e.clientX - r.left) + "px");
    e.currentTarget.style.setProperty("--my", (e.clientY - r.top) + "px");
  };
  return (
    <section id="about" className="sect fit" aria-label="About">
      <Mesh cls="m-about" />
      <div className="about-grid">
        <div>
          <Head h="h2" title="About Me" />
          <div className="prose">{about.map((p, i) => <p key={i}>{p}</p>)}</div>
          {contact.cv && <div className="actions"><a className="btn" href={contact.cv} download>Download CV <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1v8m-3-3 3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></a></div>}
        </div>
        <dl className="facts" onPointerMove={spot}>
          <div><dt>Education</dt><dd>{education.degree}<br />{education.school} <span className="mute">({education.status.toLowerCase()})</span></dd></div>
          <div><dt>Interests</dt><dd><Tags list={interests} /></dd></div>
        </dl>
      </div>
      <Pager at="/about" />
    </section>
  );
}

/* ---------- EXPERIENCE ---------- */
/* Shows the work entries from data.js (jobs). Add a new job at the top of that list and it appears here. */
function Experience() {
  const work = jobs.filter(j => j.type === "work");
  return (
    <section id="experience" className="sect fit" aria-label="Experience">
      <Mesh cls="m-exp" />
      <Head h="h2" title="Experience"><p className="intro">Where I&rsquo;ve put what I&rsquo;ve learned into practice.</p></Head>
      <ol className="xp">
        {work.map(j => (
          <li key={j.when + j.role}>
            <p className="when">{j.when}</p>
            <div>
              <h3>{j.role}</h3>
              <p className="org">{j.org}</p>
              <ul className="pts">{j.points.map(([a, b]) => <li key={a}><b>{a}</b> {b}</li>)}</ul>
              {j.tags && <Tags list={j.tags} />}
            </div>
          </li>
        ))}
      </ol>
      <Pager at="/experience" />
    </section>
  );
}

/* ---------- SKILLS ---------- */
function Skills() {
  return (
    <section id="skills" className="sect fit" aria-label="Skills">
      <Mesh cls="m-skills" />
      <Head h="h2" title="What I Work With"><p className="intro">{skillsIntro}</p></Head>
      <div className="wgrid">
        {stack.map(g => <div key={g.title}><h3>{g.title}</h3><Tags list={g.items} /></div>)}
      </div>
      <Pager at="/skills" />
    </section>
  );
}

/* ---------- PROJECTS ---------- */
/* Every project is shown in the big staggered layout. Click one to open its page. */
function Shot({ p, big }) {
  if (!p.img) return <div className="shot ph" aria-hidden="true"><span>{p.t}</span></div>;
  return (
    <div className={"shot" + (p.fit === "contain" ? " contain" : "")}>
      <img src={"assets/img/" + p.img} alt={`${p.t} screenshot`} loading={big ? "eager" : "lazy"} style={p.pos ? { objectPosition: p.pos } : undefined} />
    </div>
  );
}
const SHAPES = ["wide", "m7", "m5", "rev"];    // repeating rhythm; works for any number of projects
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
          <Shot p={p} big />
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
    <section id="projects" className="sect projects" aria-label="Projects">
      <Mesh cls="m-proj" />
      <Head h="h2" title="Selected Projects">
        <p className="intro">A collection of projects that showcase my skills in full-stack development, backend engineering and cybersecurity.</p>
      </Head>
      <Filters items={cats} value={cat} onChange={setCat} label="Filter projects" />
      <ol className="grid">{list.map(({ p, n }, i) => <Card key={p.slug} p={p} i={i} n={n} />)}</ol>
      {!list.length && <p className="intro">No projects in this category yet.</p>}
      <Pager at="/projects" />
    </section>
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
    <div className="sect case">
      <Mesh cls="m-case" />
      <div className="case-bar"><a className="link" href="#/projects">← Back to projects</a><span className="mute mono">{pad(i + 1)} / {pad(projects.length)}</span></div>
      <div className="case-top">
        <div>
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
      </div>
      <nav className="pn" aria-label="More projects">
        {prev ? <a href={"#/projects/" + prev.slug}>← <span><small>Previous</small>{prev.t}</span></a> : <a href="#/projects">← <span><small>Back</small>All projects</span></a>}
        {next ? <a className="r" href={"#/projects/" + next.slug}><span><small>Next</small>{next.t}</span> →</a> : <a className="r" href="#/projects"><span><small>That's all for now</small>More projects</span> →</a>}
      </nav>
    </div>
  );
}

/* ---------- CERTIFICATES ---------- */
function Certificates() {
  const done = certs.filter(c => (c.status || "earned") === "earned");
  const going = certs.filter(c => c.status === "in progress");
  const cats = ["All", ...certCats.filter(c => certs.some(x => x.cat === c))];
  const [cat, setCat] = useState("All");
  const [view, setView] = useState(null);
  const dlg = useRef(null);
  useEffect(() => { const d = dlg.current; if (view && d && !d.open) d.showModal(); }, [view]);
  const inCat = c => cat === "All" || c.cat === cat;
  const Item = ({ c }) => (
    <li className="ccard">
      {c.status === "in progress"
        ? <div className="cthumb dev" aria-hidden="true"><span>···</span></div>
        : <button type="button" className="cthumb" onClick={() => setView(c)} aria-label={`View ${c.t} certificate larger`}><img src={"assets/certs/" + c.img} alt="" loading="lazy" /></button>}
      <div>
        <h3>{c.t}</h3>
        <p className="org">{c.status === "in progress" ? "In progress · " : ""}{c.org}{c.date ? " · " + c.date : ""}</p>
        {c.skills && <Tags list={c.skills} />}
        <p className="row">
          {c.status !== "in progress" && <button type="button" className="textlink" onClick={() => setView(c)}>View Certificate <Arrow /></button>}
          {c.verify && <a className="textlink" href={c.verify} target="_blank" rel="noopener noreferrer">Verify <Arrow d="up" /></a>}
        </p>
      </div>
    </li>
  );
  return (
    <section id="certificates" className="sect" aria-label="Certificates">
      <Mesh cls="m-certs" />
      <Head h="h2" title="My Certifications">
        <p className="intro">I&rsquo;m always learning and working towards new skills. Here are the certificates and courses I&rsquo;ve completed so far.</p>
      </Head>
      {cats.length > 2 && <Filters items={cats} value={cat} onChange={setCat} label="Filter certificates" />}
      {going.some(inCat) && <><h3 className="sub">In progress</h3><ul className="cgrid">{going.filter(inCat).map(c => <Item key={c.t} c={c} />)}</ul><h3 className="sub">Completed</h3></>}
      <ul className="cgrid">{done.filter(inCat).map(c => <Item key={c.t} c={c} />)}</ul>
      {goals.length > 0 && <div className="goals"><h3 className="sub">Next Goals</h3><Tags list={goals} /></div>}
      {view && (
        <dialog ref={dlg} className="lightbox" aria-label={view.t} onClose={() => setView(null)} onClick={e => e.target === dlg.current && dlg.current.close()}>
          <form method="dialog"><button className="x" aria-label="Close">×</button></form>
          <img src={"assets/certs/" + view.img} alt={`${view.t} certificate from ${view.org}`} />
          <p><b>{view.t}</b> · {view.org}</p>
        </dialog>
      )}
      <Pager at="/certificates" />
    </section>
  );
}

/* ---------- CONTACT (old look) ---------- */
function Contact() {
  const short = u => u.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");
  const rows = [["Email", contact.email, "mailto:" + contact.email], ["LinkedIn", short(contact.linkedin), contact.linkedin], ["GitHub", short(contact.github), contact.github]];
  return (
    <section id="contact" className="sect fit contact" aria-label="Contact">
      <Mesh cls="m-contact" />
      <Head h="h2" title="Let&rsquo;s Connect">
        <p className="intro">Feel free to reach out if you'd like to collaborate, have a question, or just say hi. I'd love to hear from you.</p>
      </Head>
      <ul className="links">
        {rows.map(([l, t, h]) => <li key={l}><a href={h} {...(h.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}><span className="label">{l}</span><span className="v">{t}</span><span aria-hidden="true">↗</span></a></li>)}
      </ul>
      <Pager at="/contact" />
    </section>
  );
}

const NotFound = () => (
  <div className="sect"><Head title="Page not found." /><p className="intro">That page doesn&rsquo;t exist. <a className="textlink" href="#/">Go home <Arrow /></a></p></div>
);

/* ---------- APP ---------- */
const TITLES = { "/about": "About", "/experience": "Experience", "/skills": "Skills", "/projects": "Projects", "/certificates": "Certificates", "/contact": "Contact" };
const PAGES = { "/": Home, "/about": About, "/experience": Experience, "/skills": Skills, "/projects": Projects, "/certificates": Certificates, "/contact": Contact };
function App() {
  const route = useRoute();
  const m = route.match(/^\/projects\/(.+)$/);
  const seen = useRef(order(route));
  const dir = order(route) >= seen.current ? "fwd" : "back";     // which way the new page slides in from

  useEffect(() => {
    seen.current = order(route);
    const proj = m && projects.find(p => p.slug === m[1]);
    document.title = route === "/" ? "Halima Abdirizak" : (proj ? proj.t : TITLES[route] || "Not found") + " · Halima";
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [route]);

  const Page = PAGES[route];
  let page;
  if (Page) page = <Page />;
  else if (m) page = <Project slug={m[1]} />;
  else page = <NotFound />;
  return (
    <>
      <a className="skip" href="#main" onClick={e => { e.preventDefault(); document.getElementById("main").focus(); }}>Skip to content</a>
      <Nav active={Page ? route : m ? "/projects" : null} />
      <main id="main" tabIndex={-1} key={route} className={dir}><Drift>{page}</Drift></main>
      <Footer />
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
