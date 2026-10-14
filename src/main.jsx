import { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, MotionConfig, useScroll, useSpring, useMotionValue, useTransform, useDragControls, useReducedMotion } from "framer-motion";
import { logos } from "./logos.js";
import { G, me, heroVisual, about, projects, jobs, stack, skillsIntro, certs, contact } from "./data.js";

const ease = [0.22, 1, 0.36, 1];
const Arrow = () => <i className="arr">↗</i>;

function Reveal({ children, delay = 0, y = 32, className, as = "div" }) {
  const C = motion[as];
  return (
    <C className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.8, ease, delay }}>
      {children}
    </C>
  );
}

/* ---------- THEME ---------- */
const root = document.documentElement;
function useTheme() {
  const [theme, setTheme] = useState(root.dataset.theme || "dark");
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    root.classList.add("theming"); clearTimeout(window.__tt); window.__tt = setTimeout(() => root.classList.remove("theming"), 700);
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#070707" : "#ffffff");
    setTheme(next);
  };
  return [theme, toggle];
}
const Sun = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>;
const Moon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/></svg>;

/* ---------- NAV ---------- */
const NAV = [["about", "About"], ["work", "Projects"], ["skills", "Skills"], ["experience", "Experience"], ["certifications", "Certifications"]];
const NAV_ICON = {
  about: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
  work: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  skills: <><polyline points="8 7 3 12 8 17" /><polyline points="16 7 21 12 16 17" /><line x1="14" y1="4" x2="10" y2="20" /></>,
  experience: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  certifications: <><circle cx="12" cy="9" r="6" /><path d="M8.5 14.5 7 21l5-3 5 3-1.5-6.5" /></>,
  contact: <><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></>,
};
const DOCK = [...NAV, ["contact", "Contact"]];

function useWide() {
  const q = "(min-width: 901px)";   // same breakpoint as style.css
  const [w, setW] = useState(() => matchMedia(q).matches);
  useEffect(() => { const m = matchMedia(q), f = () => setW(m.matches); m.addEventListener("change", f); f(); return () => m.removeEventListener("change", f); }, []);
  return w;
}

function Nav({ route }) {
  const [on, setOn] = useState(""), [open, setOpen] = useState(false), [hide, setHide] = useState(false);
  const [theme, toggle] = useTheme();
  const wide = useWide();
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setOn(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    [...NAV.map(n => n[0]), "contact", "top"].forEach(id => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, [route]);
  const cur = route === "certs" ? "certifications" : on;
  // the top bar stays on screen the whole way down on desktop. On phones it slides away while you read down and returns when you scroll up
  useEffect(() => {
    let last = scrollY;
    const f = () => {
      const y = scrollY;
      if (Math.abs(y - last) < 6) return; setHide(y > 120 && y > last); last = y;
    };
    f();
    addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f);
  }, []);
  return (
    <>
      <motion.header className="nav" initial={{ y: -30, opacity: 0 }} animate={{ y: !wide && hide && !open ? -90 : 0, opacity: 1 }} transition={{ duration: 0.45, ease }}>
        <a href="#top" className="brand" aria-label="Home"><img className="mark" src="assets/img/ladybug-button.webp" alt="" aria-hidden="true" draggable="false" /><span className="brand-t">Halima</span></a>
        <div className="nav-r">
          <nav className="links" aria-label="Main">
            {DOCK.map(([id, label]) => (
              <a key={id} href={"#" + id} className={cur === id ? "on" : undefined} aria-current={cur === id ? "true" : undefined}>
                {cur === id && <motion.span layoutId="toppill" className="pillbg" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                {label}
              </a>
            ))}
          </nav>
          <button className="theme" onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>{theme === "dark" ? <Sun /> : <Moon />}</button>
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "Close" : "Menu"}</button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div className="sheet" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.55, ease }}>
            {[...NAV, ["contact", "Contact"]].map(([id, label], i) => (
              <motion.a key={id} href={"#" + id} onClick={() => setOpen(false)} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 + i * 0.06, ease, duration: 0.6 }}>{label}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- HERO HEADLINE: one big line under the name that keeps swapping (edit the words in data.js, me.rotator) ---------- */
function Rotator({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;   // reduced motion: the first phrase stays
    const t = setInterval(() => setI(v => (v + 1) % words.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div className="rotator" aria-label={words.join(", ")} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.55 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={i} className="rotator-w" aria-hidden="true" initial={{ y: "75%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-75%", opacity: 0 }} transition={{ duration: 0.45, ease }}>{words[i]}</motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- HERO: name, title, two buttons, the big swapping line, the sentence, two buttons, and the masked-hero picture on the right (mirrored in CSS) ---------- */
function Hero() {
  const vid = useRef(null);
  useEffect(() => {
    const v = vid.current; if (!v) return;   // only used when heroVisual is "video"
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { v.pause(); return; }
    const io = new IntersectionObserver(([e]) => e.isIntersecting ? v.play().catch(() => {}) : v.pause());
    io.observe(v); return () => io.disconnect();
  }, []);
  return (
    <section className="hero" id="top">
      {heroVisual === "video" ? (
        <motion.div className="hero-video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 0.1 }} aria-hidden="true">
          <video ref={vid} src="assets/hero.mp4" poster="assets/img/poster.jpg" autoPlay muted loop playsInline />
        </motion.div>
      ) : (
        <motion.div className="cutout hero-cutout" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.4 }}>
          <span className="glow" />
          <img src="assets/img/about.webp" alt="Illustration of a masked hero with dark blue hair" />
        </motion.div>
      )}
      <div className="hero-scrim" aria-hidden="true" />
      <div className="wrap hero-copy">
        <h1 style={{ marginTop: 0 }}>
          {["Hi,", "I'm", "Halima"].map((w, i) => (
            <span key={i} className="w"><motion.span className={i === 2 ? "em" : ""} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.3 + i * 0.1 }}>{w}</motion.span>{" "}</span>
          ))}
        </h1>
        <Rotator words={me.rotator} />
        <motion.p className="tagline" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease, delay: 0.7 }}>{me.tagline}</motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease, delay: 0.9 }}>
          <a className="btn" href="assets/Halima_Abdirizak_CV.pdf" download>Download résumé <span>↓</span></a>
          <a className="btn ghost" href="#work">View my work <span>→</span></a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- ABOUT: your paragraphs, one under the other, in the normal text style ---------- */
function About() {
  // the ladybug and its trail are drawn in from the top as you scroll to this section (it is fully drawn by the time the section fills the screen)
  const art = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: art, offset: ["start 95%", "center 55%"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24 });
  const clip = useTransform(p, [0, 1], ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]);
  return (
    <section className="about" id="about"><div className="wrap">
      <Reveal as="h2">About <em>me</em></Reveal>
      <div className="ab-grid">
        <div className="ab">
          {about.map((t, i) => <Reveal key={i} as="p" delay={0.08 + i * 0.08} className="body">{t}</Reveal>)}
        </div>
        <motion.div className="ab-art" ref={art} aria-hidden="true" style={calm ? undefined : { clipPath: clip }}>
          <img src="assets/img/ladybug-curl.webp" alt="" loading="lazy" />
        </motion.div>
      </div>
    </div></section>
  );
}

/* ---------- SKILLS: small tabs (each with the ladybug button beside its name); click one and its skills show in the card ---------- */
const TOOL_LOGOS = logos;
function Skills() {
  const [tab, setTab] = useState(0);
  const tabs = useRef([]);
  const g = stack[tab];
  // arrow keys, Home and End move between tabs, like any tab list
  const onKey = (e, i) => {
    const n = stack.length;
    const next = { ArrowRight: (i + 1) % n, ArrowDown: (i + 1) % n, ArrowLeft: (i + n - 1) % n, ArrowUp: (i + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault(); setTab(next); tabs.current[next]?.focus();
  };
  return (
    <section className="skills" id="skills"><div className="wrap">
      <Reveal as="h2">What I <em>work with</em></Reveal>
      <Reveal as="p" delay={0.1} className="sintro">{skillsIntro}</Reveal>
      <Reveal y={24} delay={0.15}>
        <div className="stabs" role="tablist" aria-label="Skill groups">
          {stack.map((s, i) => (
            <button key={s.title} ref={el => (tabs.current[i] = el)} role="tab" id={"stab-" + i} aria-selected={i === tab} aria-controls="spanel"
              tabIndex={i === tab ? 0 : -1} className={"stab" + (i === tab ? " on" : "")} onClick={() => setTab(i)} onKeyDown={e => onKey(e, i)}>
              <img src="assets/img/ladybug-button.webp" alt="" aria-hidden="true" loading="lazy" /><span>{s.title}</span>
            </button>
          ))}
        </div>
        <div className="sstage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease }}>
              <article className="scard" role="tabpanel" id="spanel" aria-labelledby={"stab-" + tab}>
                <ul>
                  {g.items.map(name => <li key={name}>{name}</li>)}
                </ul>
              </article>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </div></section>
  );
}

/* ---------- MODAL ---------- */
function Modal({ onClose, label, children, bare = false }) {
  const btn = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    const key = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden"; document.body.style.paddingRight = sw + "px";
    btn.current?.focus();
    return () => { document.removeEventListener("keydown", key); document.body.style.overflow = ""; document.body.style.paddingRight = ""; prev?.focus?.(); };
  }, []);
  return (
    <motion.div className="overlay" role="dialog" aria-modal="true" aria-label={label} onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
      <motion.div className={"modal" + (bare ? " bare" : "")} onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .98 }} transition={{ duration: .45, ease }}>
        <button ref={btn} className="x" onClick={onClose} aria-label="Close">✕</button>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ---------- PROJECTS ---------- */
const hl = l => l.split(/(#.*$|\b(?:def|if|not|return|raise)\b)/).map((s, i) =>
  !s ? null : s[0] === "#" ? <span key={i} className="c">{s}</span> : /^(def|if|not|return|raise)$/.test(s) ? <span key={i} className="k">{s}</span> : s);
const Code = ({ lines }) => <div className="code">{lines.map((l, i) => <div key={i}>{hl(l) || " "}</div>)}</div>;
/* the whole screenshot is always visible (never cropped or stretched) on a softly blurred copy of itself. Add fit:"cover" in data.js to fill the card instead. */
const Media = ({ p }) => p.img
  ? (<><span className="pbg" style={{ backgroundImage: `url(assets/img/${p.img})` }} />
      <img className={p.fit === "cover" ? "cover" : "contain"} src={"assets/img/" + p.img} alt={p.t + " screenshot"} style={p.pos ? { objectPosition: p.pos } : undefined} loading="lazy" /></>)
  : p.code ? <Code lines={p.code} /> : null;

const FlipIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.5-4.5L4 8" /><path d="M4 3v5h5" /><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16" /><path d="M20 21v-5h-5" /></svg>;

/* the back of a project card: its pages sit side by side. Swipe, use the arrow or tap a dot to read on. */
function PBack({ p, flipped, onFlip }) {
  const sc = useRef(null);
  const [page, setPage] = useState(0);
  // page 1: what it is + the tech stack right after the sentence. page 2: what I built. page 3: the results. No headings, so it reads as one flow.
  const pages = [
    <>
      <small className="pk">{p.k}</small>
      <h3>{p.t}</h3>
      <p className="pd">{p.d}</p>
      <div className="tags">{p.tags.map(x => <span key={x}>{x}</span>)}</div>
    </>,
    ...(p.points ? [
      <ul className="ppts">{p.points.map(([a, b]) => <li key={a}><b>{a}</b> {b}</li>)}</ul>
    ] : []),
    ...(p.stats ? [<>
      <div className="pstats">{p.stats.map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
      {p.note && <p className="pnote">{p.note}</p>}
    </>] : []),
  ];
  const last = pages.length - 1;
  const check = useCallback(() => {
    const el = sc.current; if (el && el.clientWidth) setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);
  const go = i => sc.current?.scrollTo({ left: i * sc.current.clientWidth, behavior: "smooth" });
  useEffect(() => {
    if (flipped) return;
    const t = setTimeout(() => { if (sc.current) { sc.current.scrollTo({ left: 0, behavior: "instant" }); setPage(0); } }, 800);
    return () => clearTimeout(t);
  }, [flipped]);
  return (
    <div className="pface pback" style={{ "--pg": page }} inert={flipped ? undefined : ""} aria-hidden={!flipped}>
      <img className="pbug" src="assets/img/ladybug-spiral.webp" alt="" aria-hidden="true" draggable="false" />
      <button className="pflipback" onClick={onFlip} aria-label="Flip the card back"><FlipIcon /></button>
      <div className="pscroll" ref={sc} onScroll={check} tabIndex={0} role="region" aria-label={p.t + " details"}>
        {pages.map((c, i) => <div className="ppage" key={i}>{c}</div>)}
      </div>
      {page < last && (
        <button className="pnext" onClick={() => go(page + 1)} tabIndex={-1} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      )}
      <div className="pbtns">
        <a className="btn" href={G + p.repo} target="_blank" rel="noopener noreferrer">View on GitHub <Arrow /></a>
        {p.live && <a className="btn ghost" href={p.live} target="_blank" rel="noopener noreferrer">Live demo <Arrow /></a>}
        <span className="pdots" role="tablist" aria-label="Card pages">
          {pages.map((_, i) => <button key={i} role="tab" aria-selected={i === page} aria-label={"Page " + (i + 1)} className={i === page ? "on" : ""} onClick={() => go(i)} />)}
        </span>
      </div>
    </div>
  );
}

/* two cards at a time (one on phones). Use the arrows, the dots, swipe or scroll sideways to see the next ones. */
function Work() {
  const [open, setOpen] = useState(null);
  const [pg, setPg] = useState(0);
  const [per, setPer] = useState(2);
  const sc = useRef(null);
  const n = Math.ceil(projects.length / per);
  const groups = Array.from({ length: n }, (_, g) => projects.slice(g * per, g * per + per));
  useEffect(() => {
    if (!open) return;
    const k = e => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k);
  }, [open]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const set = () => setPer(mq.matches ? 2 : 1);
    set(); mq.addEventListener("change", set); return () => mq.removeEventListener("change", set);
  }, []);
  const check = useCallback(() => {
    const el = sc.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPg(max <= 0 || n < 2 ? 0 : Math.round(el.scrollLeft / max * (n - 1)));
  }, [n]);
  useEffect(() => { check(); addEventListener("resize", check); return () => removeEventListener("resize", check); }, [check]);
  const go = i => {
    const el = sc.current; if (!el) return;
    const k = Math.max(0, Math.min(n - 1, i));
    el.scrollTo({ left: n < 2 ? 0 : k * (el.scrollWidth - el.clientWidth) / (n - 1), behavior: "smooth" });
  };
  return (
    <section className="work" id="work"><div className="wrap">
      <div className="sec-head">
        <Reveal as="h2">Selected <em>projects</em></Reveal>
        <div className="parrows">
          <button className="pbtn" onClick={() => go(pg - 1)} disabled={pg === 0} aria-label="Previous projects"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg></button>
          <button className="pbtn" onClick={() => go(pg + 1)} disabled={pg >= n - 1} aria-label="Next projects"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg></button>
        </div>
      </div>
      <div className="pview" ref={sc} onScroll={check} role="region" aria-label="Projects">
        {groups.map((grp, g) => (
          <div className="pgrp" key={g}>
            {grp.map((p, j) => {
              const flipped = open === p.t;
              return (
                <div key={p.t} className="pcell">
                  <div className={"pflip" + (flipped ? " flipped" : "")}>
                    <button type="button" className="pface pcard" onClick={() => setOpen(p.t)} aria-expanded={flipped} aria-label={"Flip to read about " + p.t} inert={flipped ? "" : undefined}>
                      <div className="pmedia"><Media p={p} /></div>
                      <div className="pcap"><span><small>{p.k}</small><b>{p.t}</b></span><i className="pgo"><FlipIcon /></i></div>
                    </button>
                    <PBack p={p} flipped={flipped} onFlip={() => setOpen(null)} />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="pdotsrow" role="tablist" aria-label="Project pages">
        {groups.map((_, g) => <button key={g} role="tab" aria-selected={g === pg} aria-label={"Projects page " + (g + 1)} className={g === pg ? "on" : ""} onClick={() => go(g)} />)}
      </div>
    </div></section>
  );
}

/* ---------- EXPERIENCE: a sideways timeline. Add a role in data.js (jobs) and it simply joins the row; arrows appear when there are more cards than fit ---------- */
function Experience() {
  const sc = useRef(null);
  const [edge, setEdge] = useState({ scroll: false, l: false, r: false });
  const check = useCallback(() => {
    const el = sc.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({ scroll: max > 4, l: el.scrollLeft > 4, r: el.scrollLeft < max - 4 });
  }, []);
  useEffect(() => {
    check(); const t = setTimeout(check, 600);
    addEventListener("resize", check);
    return () => { clearTimeout(t); removeEventListener("resize", check); };
  }, [check]);
  const step = dir => {
    const el = sc.current; if (!el) return;
    const card = el.querySelector(".xitem:not(.xstart)");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * ((card ? card.getBoundingClientRect().width : el.clientWidth * 0.8) + gap), behavior: "smooth" });
  };
  const chev = d => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
  return (
    <section className="xp" id="experience"><div className="wrap">
      <div className="sec-head">
        <Reveal as="h2">Where I've <em>worked</em></Reveal>
        {edge.scroll && (
          <div className="parrows">
            <button className="pbtn" onClick={() => step(-1)} disabled={!edge.l} aria-label="Earlier experience">{chev("M15 6l-6 6 6 6")}</button>
            <button className="pbtn" onClick={() => step(1)} disabled={!edge.r} aria-label="More experience">{chev("M9 6l6 6-6 6")}</button>
          </div>
        )}
      </div>
      <div className="xview" ref={sc} onScroll={check} role="region" aria-label="Work experience" tabIndex={0}>
        <div className="xitem xstart" aria-hidden="true">
          <motion.img className="xbug" src="assets/img/ladybug-icon.png" alt="" draggable="false" initial={{ opacity: 0, x: -20, rotate: -20 }} whileInView={{ opacity: 1, x: 0, rotate: -8 }} viewport={{ once: true }} transition={{ duration: .9, ease }} />
        </div>
        {jobs.map((x, i) => (
          <div className="xitem" key={x.org + x.when}>
            <span className="xdot" aria-hidden="true" />
            <Reveal className="tcard" y={24} delay={0.1 + i * 0.08}>
              <span className="when">{x.when}</span>
              <h3>{x.role}</h3>
              <b className="org">{x.org}</b>
              {x.d && <p>{x.d}</p>}
              {x.points && <ul className="xpts">{x.points.map(([a, b]) => <li key={a}><b>{a}</b> {b}</li>)}</ul>}
              {x.tags && <div className="tags">{x.tags.map(t => <span key={t}>{t}</span>)}</div>}
            </Reveal>
          </div>
        ))}
      </div>
    </div></section>
  );
}

/* ---------- CERTIFICATIONS: framed certificates in a grid (4 on the home page, all of them on their own page) ---------- */
function Brand({ k, size = 72, className = "", fit = false }) {
  const l = TOOL_LOGOS[k];
  return <svg className={"logo " + className} viewBox={`0 0 ${l.w} ${l.h}`} style={fit ? undefined : { height: size, width: "auto" }} role="img" aria-label={k} dangerouslySetInnerHTML={{ __html: l.body }} />;
}
function CertArt({ c }) {
  const [ok, setOk] = useState(true);
  if (ok) return <div className="cframe"><img src={"assets/certs/" + c.img} alt={c.t + " certificate"} onError={() => setOk(false)} /></div>;
  return (
    <div className="cfall big">
      <small>Certificate</small>
      <b>{c.t}</b>
      <em>{c.org}</em>
    </div>
  );
}
const FEATURED = 4;                 // how many certificates show on the home page
const CERT_PAGE = "#/certificates"; // the "view more" page

/* the certificate picture sitting inside the polka-dot frame (falls back to the name if the image is missing) */
function CertThumb({ c }) {
  const [ok, setOk] = useState(true);
  return (
    <span className="cframe thumb">
      {ok
        ? <img src={"assets/certs/" + c.img} alt={c.t + " certificate"} loading="lazy" onError={() => setOk(false)} />
        : <span className="cmiss"><b>{c.t}</b><em>{c.org}</em></span>}
    </span>
  );
}

/* a grid of framed certificates: name, who issued it and when I received it. A click opens the full certificate. */
function CertGrid({ list, all = false }) {
  const [sel, setSel] = useState(null);
  const close = useCallback(() => setSel(null), []);
  return (
    <>
      <div className={"cgrid" + (all ? " all" : "")}>
        {list.map((c, i) => (
          <Reveal key={c.t} y={24} delay={(i % 4) * 0.08}>
            <button className="ccard" onClick={() => setSel(c)} aria-label={"View " + c.t + " certificate"}>
              <CertThumb c={c} />
              <span className="ccap">{c.t}</span>
              <span className="cmeta">{c.org}{c.date ? " · Received " + c.date : ""}</span>
              <span className="cview">View certificate</span>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {sel && (
          <Modal key="cm" bare onClose={close} label={sel.t}>
            <CertArt c={sel} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

/* home page: the first few certificates and a link to the full page */
function Certs() {
  return (
    <section className="certs" id="certifications"><div className="wrap wide">
      <div className="sec-head">
        <Reveal as="h2">My <em>certifications</em></Reveal>
      </div>
      <CertGrid list={certs.slice(0, FEATURED)} />
      {certs.length > FEATURED && (
        <Reveal y={20} className="cmore">
          <a className="btn" href={CERT_PAGE}>View all certificates <span>→</span></a>
        </Reveal>
      )}
    </div></section>
  );
}

/* the "view more" page: every certificate in its frame */
function CertsPage() {
  return (
    <section className="certs certs-page" id="all-certificates"><div className="wrap wide">
      <Reveal y={16}><a className="back" href="#certifications"><span>←</span> Back to portfolio</a></Reveal>
      <div className="sec-head">
        <Reveal as="h2">All my <em>certifications</em></Reveal>
      </div>
      <CertGrid list={certs} all />
    </div></section>
  );
}

/* ---------- CONTACT: heading and icons on one side, the ladybug flying in on the other ---------- */
function Contact() {
  const links = [
    ["LinkedIn", contact.linkedin, "linkedin", true],
    ["GitHub", contact.github, "github", true],
    ["Email", "mailto:" + contact.email, "gmail", false],
  ];
  return (
    <section className="contact" id="contact"><div className="wrap">
      <div className="contact-grid">
        <div className="contact-text">
          <Reveal as="h2" className="big">Let's <em>connect.</em></Reveal>
          <div className="icons">
            {links.map(([n, h, k, ext], i) => (
              <Reveal key={n} delay={0.1 + i * 0.08} y={30}>
                <a className="ico" href={h} aria-label={n} title={n} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}><Brand k={k} size={44} className="plain" /></a>
              </Reveal>
            ))}
          </div>
        </div>
        <motion.div className="flyer" aria-hidden="true" initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }} whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }} transition={{ duration: 2.6, ease: [0.45, 0, 0.25, 1], opacity: { duration: 0.4 } }}>
          <img src="assets/img/ladybug-flying.webp" alt="" loading="lazy" />
        </motion.div>
      </div>
      <footer><span>© 2026 {me.name}</span><a href="#top">Back to top ↑</a></footer>
    </div></section>
  );
}

/* ---------- CURSOR: a ladybug that follows the mouse. It swings as you move, grows over buttons and squishes when you click.
   Only on devices with a real mouse; phones and tablets are untouched. ---------- */
const HOT = 'a,button,[role="button"],[role="tab"],summary,label,input,select,textarea';
function BugCursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 650, damping: 38, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 650, damping: 38, mass: 0.35 });
  const tilt = useTransform([x, sx], ([a, b]) => Math.max(-24, Math.min(24, (a - b) * 0.9)));
  const [seen, setSeen] = useState(false), [hot, setHot] = useState(false), [down, setDown] = useState(false);
  useEffect(() => {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const html = document.documentElement;
    html.classList.add("has-bug");
    const move = e => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      x.set(e.clientX); y.set(e.clientY); setSeen(true);
      setHot(!!e.target.closest?.(HOT));
    };
    const dn = () => setDown(true), up = () => setDown(false);
    const out = e => { if (!e.relatedTarget) setSeen(false); };
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", dn); addEventListener("pointerup", up);
    document.addEventListener("mouseout", out);
    return () => {
      html.classList.remove("has-bug");
      removeEventListener("pointermove", move); removeEventListener("pointerdown", dn); removeEventListener("pointerup", up);
      document.removeEventListener("mouseout", out);
    };
  }, []);
  return (
    <motion.div className="bugcur" aria-hidden="true" style={{ x: sx, y: sy, rotate: tilt, opacity: seen ? 1 : 0 }}>
      <motion.img src="assets/img/ladybug-cursor.png" alt="" draggable="false" animate={{ scale: down ? 0.8 : hot ? 1.3 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 24 }} />
    </motion.div>
  );
}

/* two "pages": the home page and #/certificates. No library needed; the address bar hash decides. */
function useRoute() {
  const get = () => (location.hash === CERT_PAGE ? "certs" : "home");
  const [r, setR] = useState(get);
  useEffect(() => {
    const f = () => setR(get());
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  return r;
}

function App() {
  const route = useRoute();
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const first = useRef(true);
  // after the page swaps: open the certificates page at the top, or jump to the section that was clicked (#about, #certifications...)
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = route === "home" && id ? document.getElementById(id) : null;
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    else if (route === "certs" || !first.current) window.scrollTo({ top: 0, behavior: "instant" });
    first.current = false;
  }, [route]);
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="progress" style={{ scaleX: sx }} />
      <BugCursor /><Nav route={route} />
      {route === "certs"
        ? <main><CertsPage /></main>
        : <><main><Hero /><About /><Work /><Skills /><Experience /><Certs /></main><Contact /></>}
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")).render(<App />);
