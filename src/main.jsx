import { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, MotionConfig, useScroll, useSpring, useMotionValue, useTransform, useDragControls, useReducedMotion, animate } from "framer-motion";
import { logos } from "./logos.js";
import { skillLogos } from "./skillLogos.js";
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

function Nav() {
  const [on, setOn] = useState(""), [open, setOpen] = useState(false), [hide, setHide] = useState(false);
  const [theme, toggle] = useTheme();
  const wide = useWide();
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setOn(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    [...NAV.map(n => n[0]), "contact", "top"].forEach(id => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);
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
        <a href="#top" className="brand" aria-label="Home"><span className="mark">H</span><span className="brand-t">Halima</span></a>
        <div className="nav-r">
          <nav className="links" aria-label="Main">
            {DOCK.map(([id, label]) => (
              <a key={id} href={"#" + id} className={on === id ? "on" : undefined} aria-current={on === id ? "true" : undefined}>
                {on === id && <motion.span layoutId="toppill" className="pillbg" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
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
const TOOL_LOGOS = { ...logos, ...skillLogos };
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

/* ---------- EXPERIENCE: the ladybug's dashed trail, one point per role ---------- */
const TRAIL = "M100 0 C165 40 165 110 100 150 C35 190 30 245 70 280 C108 312 148 282 126 256 C104 232 72 285 90 335 C102 375 100 410 100 450 C165 490 165 545 130 580 C98 612 58 582 78 556 C98 530 130 590 112 640 C100 680 100 710 100 750 C35 790 40 850 100 880";
function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 90%"] });
  const len = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <section className="xp" id="experience"><div className="wrap">
      <Reveal as="h2">Where I've <em>worked</em></Reveal>
      <div className="trail" ref={ref}>
        <motion.img className="bug" src="assets/img/ladybug-icon.png" alt="" aria-hidden="true" initial={{ opacity: 0, y: -20, rotate: -20 }} whileInView={{ opacity: 1, y: 0, rotate: -8 }} viewport={{ once: true }} transition={{ duration: .9, ease }} />
        <svg className="path" viewBox="0 0 200 900" aria-hidden="true">
          <defs><mask id="trailmask" maskUnits="userSpaceOnUse" x="-50" y="-20" width="300" height="940">
            <motion.path d={TRAIL} fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round" style={{ pathLength: len }} />
          </mask></defs>
          <path d={TRAIL} fill="none" stroke="var(--text)" strokeWidth="2.2" strokeDasharray="7 9" strokeLinecap="round" mask="url(#trailmask)" />
          {[150, 450, 750].map((y, i) => (
            <motion.g key={y} initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: "0px 0px -25% 0px" }} transition={{ duration: .6, ease }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx="100" cy={y} r="17" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
              <circle cx="100" cy={y} r="8" fill="var(--accent)" />
            </motion.g>
          ))}
        </svg>
        {jobs.map((j, i) => (
          <div className={"trow " + (i % 2 ? "L" : "R")} key={j.org}>
            <Reveal className="tcard" y={24} delay={0.1}>
              <span className="when">{j.when}</span>
              <h3>{j.role}</h3>
              <b className="org">{j.org}</b>
              <p>{j.d}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </div></section>
  );
}

/* ---------- CERTIFICATIONS: the real logos, no plate; a click opens the certificate inside the polka-dot frame ---------- */
function Brand({ k, size = 72, className = "", fit = false }) {
  const l = TOOL_LOGOS[k];
  return <svg className={"logo " + className} viewBox={`0 0 ${l.w} ${l.h}`} style={fit ? undefined : { height: size, width: "auto" }} role="img" aria-label={k} dangerouslySetInnerHTML={{ __html: l.body }} />;
}
function Logo({ c, size = 56, fit = false }) {
  if (TOOL_LOGOS[c.logo]) return <Brand k={c.logo} size={size} fit={fit} />;
  return <span className="wordmark" style={{ fontSize: size * 0.5 }}>{c.mark || c.org}</span>;
}
function CertArt({ c }) {
  const [ok, setOk] = useState(true);
  if (ok) return <div className="cframe"><img src={"assets/certs/" + c.img} alt={c.t + " certificate"} onError={() => setOk(false)} /></div>;
  return (
    <div className="cfall big">
      <Logo c={c} size={56} />
      <small>Certificate</small>
      <b>{c.t}</b>
      <em>{c.org}</em>
    </div>
  );
}
function Certs() {
  const [sel, setSel] = useState(null);
  const close = useCallback(() => setSel(null), []);
  const win = useRef(null);     // the visible window (.cwindow)
  const track = useRef(null);   // the moving strip (.cmarq)
  const goRef = useRef(null);   // arrow buttons call this
  const st = useRef({ x: 0, hover: false, focus: false, drag: false, moved: false, anim: null, sel: false });
  st.current.sel = !!sel;

  /* The strip still flows on its own, but it is now driven here instead of by a CSS animation,
     so the arrows, dragging, swiping and the keyboard can move it too, and the loop stays seamless.
     It pauses while you hover (mouse), use the keyboard, drag, or have a certificate open. */
  useEffect(() => {
    const w = win.current, t = track.current;
    if (!w || !t) return;
    const s = st.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setWidth = () => t.firstElementChild?.getBoundingClientRect().width || 1; // one full copy of the row = the loop length
    const step = () => {
      const c = t.querySelectorAll(".ccard");
      if (c.length > 1) return c[1].getBoundingClientRect().left - c[0].getBoundingClientRect().left;
      return c[0]?.getBoundingClientRect().width || 300;
    };
    const stopAnim = () => { s.anim?.stop(); s.anim = null; };

    let raf, last = performance.now();
    const tick = now => {
      const dt = Math.min(now - last, 64) / 1000; last = now;
      if (!reduce.matches) {
        const L = setWidth();
        if (!s.hover && !s.focus && !s.drag && !s.sel && !s.anim && !document.hidden) s.x += (L / (certs.length * 7)) * dt;
        s.x = ((s.x % L) + L) % L;
        t.style.transform = "translate3d(" + (-s.x) + "px,0,0)";
      } else t.style.transform = "";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // arrows: slide by one card
    goRef.current = dir => {
      if (reduce.matches) { w.scrollBy({ left: dir * step(), behavior: "smooth" }); return; }
      stopAnim();
      s.anim = animate(s.x, s.x + dir * step(), { duration: 0.6, ease, onUpdate: v => { s.x = v; }, onComplete: () => { s.anim = null; } });
    };

    // drag with a mouse or swipe sideways on a phone (vertical swipes still scroll the page)
    let down = false, sx = 0, x0 = 0, pid = 0;
    const onDown = e => {
      if (reduce.matches || (e.pointerType === "mouse" && e.button !== 0)) return;
      down = true; s.moved = false; sx = e.clientX; x0 = s.x; pid = e.pointerId; stopAnim();
    };
    const onMove = e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (!s.moved && Math.abs(dx) > 6) { s.moved = true; s.drag = true; w.setPointerCapture?.(pid); w.classList.add("grab"); }
      if (s.moved) s.x = x0 - dx;
    };
    const onUp = () => { if (!down) return; down = false; s.drag = false; w.classList.remove("grab"); };
    // a drag must not open a certificate by accident
    const onClick = e => { if (s.moved) { e.stopPropagation(); e.preventDefault(); s.moved = false; } };

    // trackpad or shift + wheel sideways
    const onWheel = e => {
      if (reduce.matches || !e.deltaX || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault(); stopAnim(); s.x += e.deltaX;
    };

    // pause on hover (mouse only) and while a card has keyboard focus; bring a focused card into view
    const onEnter = e => { if (e.pointerType === "mouse") s.hover = true; };
    const onLeave = () => { s.hover = false; };
    const onFocusIn = e => {
      if (!e.target.matches?.(":focus-visible")) return;
      s.focus = true;
      const card = e.target.closest?.(".ccard");
      if (card && !reduce.matches) {
        stopAnim();
        const c = card.getBoundingClientRect(), tr = t.getBoundingClientRect();
        s.x = (c.left - tr.left) - (w.clientWidth - c.width) / 2;
      }
      w.scrollLeft = reduce.matches ? w.scrollLeft : 0;
    };
    const onFocusOut = () => { s.focus = false; };
    const onScroll = () => { if (!reduce.matches && w.scrollLeft) w.scrollLeft = 0; }; // the browser must not scroll the hidden overflow

    w.addEventListener("pointerdown", onDown);
    w.addEventListener("pointermove", onMove);
    w.addEventListener("pointerup", onUp);
    w.addEventListener("pointercancel", onUp);
    w.addEventListener("click", onClick, true);
    w.addEventListener("wheel", onWheel, { passive: false });
    w.addEventListener("pointerenter", onEnter);
    w.addEventListener("pointerleave", onLeave);
    w.addEventListener("focusin", onFocusIn);
    w.addEventListener("focusout", onFocusOut);
    w.addEventListener("scroll", onScroll);
    return () => {
      cancelAnimationFrame(raf); stopAnim();
      w.removeEventListener("pointerdown", onDown);
      w.removeEventListener("pointermove", onMove);
      w.removeEventListener("pointerup", onUp);
      w.removeEventListener("pointercancel", onUp);
      w.removeEventListener("click", onClick, true);
      w.removeEventListener("wheel", onWheel);
      w.removeEventListener("pointerenter", onEnter);
      w.removeEventListener("pointerleave", onLeave);
      w.removeEventListener("focusin", onFocusIn);
      w.removeEventListener("focusout", onFocusOut);
      w.removeEventListener("scroll", onScroll);
    };
  }, []);

  // the row is drawn twice so the loop never shows a gap; the copy is hidden from screen readers and the tab key
  const row = copy => (
    <div className="cset" aria-hidden={copy || undefined}>
      {certs.map(c => (
        <button key={c.t} className="ccard" tabIndex={copy ? -1 : 0} onClick={() => setSel(c)} aria-label={"View " + c.t + " certificate"}>
          <span className="cplate"><Logo c={c} fit /></span>
          <span className="ccap">{c.t}</span>
          <span className="cview">View certificate</span>
        </button>
      ))}
    </div>
  );
  return (
    <section className="certs" id="certifications"><div className="wrap">
      <div className="sec-head">
        <Reveal as="h2">My <em>certifications</em></Reveal>
      </div>
    </div>
      <Reveal y={24}>
        {/* flows on its own; pauses when you point at it or open a certificate. Use the arrows, drag or swipe to go back to one you missed. Add certificates in data.js and the speed adjusts by itself */}
        <div className="cwrap">
          <div className="cwindow" ref={win} role="region" aria-label="Certificates">
            <div className="cmarq" ref={track}>
              {row(false)}{row(true)}
            </div>
          </div>
          <button className="cnav prev" aria-label="Previous certificate" onClick={() => goRef.current?.(-1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button className="cnav next" aria-label="Next certificate" onClick={() => goRef.current?.(1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </Reveal>
      <AnimatePresence>
        {sel && (
          <Modal key="cm" bare onClose={close} label={sel.t}>
            <CertArt c={sel} />
          </Modal>
        )}
      </AnimatePresence>
    </section>
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
                <a className="ico" href={h} aria-label={n} title={n} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}><Brand k={k} size={34} className="plain" /></a>
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

function App() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="progress" style={{ scaleX: sx }} />
      <BugCursor /><Nav /><main><Hero /><About /><Work /><Skills /><Experience /><Certs /></main><Contact />
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")).render(<App />);
