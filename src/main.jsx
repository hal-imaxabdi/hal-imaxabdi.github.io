import { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, MotionConfig, useScroll, useSpring } from "framer-motion";
import { logos } from "./logos.js";
import { skillLogos } from "./skillLogos.js";
import { G, me, about, projects, jobs, stack, certs, contact } from "./data.js";

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
function Nav() {
  const [on, setOn] = useState(""), [open, setOpen] = useState(false);
  const [theme, toggle] = useTheme();
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setOn(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    [...NAV.map(n => n[0]), "contact", "top"].forEach(id => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);
  const Toggle = (
    <button className="theme" onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={{ rotate: -80, opacity: 0, scale: .6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 80, opacity: 0, scale: .6 }} transition={{ duration: .25 }}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
  return (
    <>
      <motion.header className="nav" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease, delay: 0.2 }}>
        <a href="#top" className="brand" aria-label="Home"><span className="mark">H</span><span className="brand-t">Halima</span></a>
        <nav className="links" aria-label="Main">
          {NAV.map(([id, label]) => (
            <a key={id} href={"#" + id} className={on === id ? "on" : ""}>
              {on === id && <motion.span layoutId="pill" className="pillbg" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-r">
          {Toggle}
          <a className="cta" href="#contact">Contact</a>
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

/* ---------- HERO: name, title, one button. The video melts into the page. ---------- */
function Hero() {
  const vid = useRef(null);
  useEffect(() => {
    const v = vid.current; if (!v) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { v.pause(); return; }
    const io = new IntersectionObserver(([e]) => e.isIntersecting ? v.play().catch(() => {}) : v.pause());
    io.observe(v); return () => io.disconnect();
  }, []);
  return (
    <section className="hero" id="top">
      <motion.div className="hero-video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 0.1 }} aria-hidden="true">
        <video ref={vid} src="assets/hero.mp4" poster="assets/img/poster.jpg" autoPlay muted loop playsInline />
      </motion.div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="wrap hero-copy">
        <h1 style={{ marginTop: 0 }}>
          {["Hi,", "I'm", "Halima"].map((w, i) => (
            <span key={i} className="w"><motion.span className={i === 2 ? "em" : ""} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.3 + i * 0.1 }}>{w}</motion.span>{" "}</span>
          ))}
        </h1>
        <motion.p className="tagline" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease, delay: 0.7 }}>{me.tagline}</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease, delay: 0.9 }}>
          <a className="btn" href="#work">View my work <span>→</span></a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- ABOUT: framed by the ladybug's dotted trail ---------- */
const LEFT_TRAIL = "M45 0 C45 40 8 70 12 108 C16 148 72 146 74 188 C76 226 24 218 26 192 C28 166 64 186 56 234 C52 262 45 276 45 300 C45 340 10 362 14 402 C18 442 76 432 72 474 C68 514 45 540 45 600";
const BOTTOM_TRAIL = "M0 45 C70 -10 150 -5 230 30 C310 66 380 100 470 62 C560 25 620 -5 710 24 C800 52 860 80 930 56 C960 46 985 45 1000 45";
function Ladybug({ rot = 0, delay = 0 }) {
  return (
    <motion.span className="lbug" initial={{ opacity: 0, scale: 0.3 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.6, ease, delay }}>
      <svg viewBox="0 0 64 64" style={{ transform: `rotate(${rot}deg)` }} aria-hidden="true">
        <path d="M27 13c-1-6-8-7-10-3M37 13c1-6 8-7 10-3" fill="none" stroke="#111" strokeWidth="1.7" strokeLinecap="round" />
        <ellipse cx="32" cy="38" rx="20" ry="22" fill="var(--accent)" />
        <path d="M32 16v44" stroke="#111" strokeWidth="1.8" />
        <path d="M16.5 24C19 13 25 9.5 32 9.5S45 13 47.5 24C42 20 37 19 32 19s-10 1-15.500 5z" fill="#111" />
        {[[21, 37], [25, 50], [26, 28], [43, 37], [39, 50], [38, 28]].map(([x, y]) => <circle key={x + "" + y} cx={x} cy={y} r="3.3" fill="#111" />)}
      </svg>
    </motion.span>
  );
}
function Trail({ d, id, vb }) {
  return (
    <svg viewBox={vb} preserveAspectRatio="none" aria-hidden="true">
      <defs><mask id={id} maskUnits="userSpaceOnUse" x="-40" y="-40" width="1200" height="800">
        <motion.path d={d} fill="none" stroke="#fff" strokeWidth="30" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: "0px 0px -15% 0px" }} transition={{ duration: 2.2, ease: "easeInOut" }} />
      </mask></defs>
      <path className="dots" d={d} mask={`url(#${id})`} />
    </svg>
  );
}
function LadyFrame({ children }) {
  return (
    <div className="lframe">
      <div className="lf-left">
        <Trail d={LEFT_TRAIL} id="lf-m1" vb="0 0 90 600" />
        <i className="lpos" style={{ top: "0%", left: "50%" }}><Ladybug rot={28} /></i>
        <i className="lpos" style={{ top: "50%", left: "50%" }}><Ladybug rot={-24} delay={0.5} /></i>
        <i className="lpos" style={{ top: "100%", left: "50%" }}><Ladybug rot={-12} delay={0.9} /></i>
      </div>
      <div className="lf-bottom">
        <Trail d={BOTTOM_TRAIL} id="lf-m2" vb="0 0 1000 90" />
        <i className="lpos" style={{ top: "50%", left: "100%" }}><Ladybug rot={-34} delay={1.3} /></i>
      </div>
      {children}
    </div>
  );
}
function About() {
  return (
    <section className="about" id="about"><div className="wrap">
      <LadyFrame>
        <div className="about-grid">
          <Reveal className="cutout" y={20}>
            <span className="glow" />
            <img src="assets/img/about.webp" alt="Illustration of a masked hero with dark blue hair" loading="lazy" />
          </Reveal>
          <div>
            <Reveal as="h2">About <em>me</em></Reveal>
            {about.map((t, i) => <Reveal key={i} delay={0.12 + i * 0.07} as="p" className="body">{t}</Reveal>)}
          </div>
        </div>
      </LadyFrame>
    </div></section>
  );
}

/* ---------- SKILLS: Defend / Build / Test, official logos on white plates ---------- */
const L = {
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
  alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  check: <><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
  terminal: <><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>,
  wifi: <><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  beaker: <><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><line x1="8.5" y1="2" x2="15.5" y2="2" /><line x1="7" y1="16" x2="17" y2="16" /></>,
  ok: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
};
const TOOL_LOGOS = { ...logos, ...skillLogos };
function ToolIcon({ k }) {
  const l = TOOL_LOGOS[k];
  if (l) return <svg viewBox={`0 0 ${l.w} ${l.h}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: l.body }} />;
  return <svg className="line" viewBox="0 0 24 24" aria-hidden="true">{L[k]}</svg>;
}
const BUG_TILT = [-9, 6, -4];
function Skills() {
  return (
    <section className="skills" id="skills"><div className="wrap">
      <Reveal as="h2">What I <em>work with</em></Reveal>
      <div className="kits">
        {stack.map((g, gi) => (
          <Reveal key={g.title} delay={gi * 0.1} y={30} className="kit">
            <motion.img className="kit-bug" src="assets/img/ladybug-button.webp" alt="" aria-hidden="true"
              style={{ rotate: BUG_TILT[gi] }} whileHover={{ rotate: BUG_TILT[gi] + 12, scale: 1.07 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} />
            <h3>{g.title}</h3>
            <div className="kit-grid">
              {g.items.map(([name, icon], i) => (
                <motion.div key={name} className="tool" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -8% 0px" }} transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.05 }}>
                  <span className="tplate"><ToolIcon k={icon} /></span>
                  <span className="tname">{name}</span>
                </motion.div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div></section>
  );
}

/* ---------- MODAL ---------- */
function Modal({ onClose, label, children }) {
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
      <motion.div className="modal" onClick={e => e.stopPropagation()}
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
const Media = ({ p }) => p.code ? <Code lines={p.code} /> : <img src={"assets/img/" + p.img} alt={p.t + " screenshot"} style={p.pos ? { objectPosition: p.pos } : undefined} loading="lazy" />;

function ProjectModal({ p, onClose }) {
  return (
    <Modal onClose={onClose} label={p.t}>
      <div className="pm">
        <div className="pm-media"><Media p={p} /></div>
        <div className="pm-body">
          <p className="eyebrow">{p.k}</p>
          <h3>{p.t}</h3>
          <p className="pm-d">{p.d}</p>
          <div className="tags">{p.tags.map(x => <span key={x}>{x}</span>)}</div>
          <div className="pm-btns">
            <a className="btn" href={G + p.repo} target="_blank" rel="noopener noreferrer">View on GitHub <Arrow /></a>
            {p.live && <a className="btn ghost" href={p.live} target="_blank" rel="noopener noreferrer">Live demo <Arrow /></a>}
          </div>
        </div>
      </div>
    </Modal>
  );
}

const SPAN = ["s4", "s2", "s2", "s2", "s2", "s3", "s3"];
function Work() {
  const [sel, setSel] = useState(null);
  const close = useCallback(() => setSel(null), []);
  return (
    <section className="work" id="work"><div className="wrap">
      <div className="sec-head">
        <Reveal as="h2">Selected <em>projects</em></Reveal>
      </div>
      <div className="pgrid">
        {projects.map((p, i) => (
          <Reveal key={p.t} delay={(i % 3) * 0.08} y={36} className={"pcell " + SPAN[i]}>
            <button className="pcard" onClick={() => setSel(p)} aria-label={"Open " + p.t}>
              <div className="pmedia"><Media p={p} /></div>
              <div className="pcap"><span><small>{p.k}</small><b>{p.t}</b></span><i className="pgo">+</i></div>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>{sel && <ProjectModal key="pm" p={sel} onClose={close} />}</AnimatePresence>
    </div></section>
  );
}

/* ---------- EXPERIENCE: the ladybug's dashed trail, one point per role ---------- */
const TRAIL = "M100 0 C165 40 165 110 100 150 C35 190 30 245 70 280 C108 312 148 282 126 256 C104 232 72 285 90 335 C102 375 100 410 100 450 C165 490 165 545 130 580 C98 612 58 582 78 556 C98 530 130 590 112 640 C100 680 100 710 100 750 C35 790 40 850 100 880";
function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const len = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <section className="xp" id="experience"><div className="wrap">
      <Reveal as="p" className="eyebrow">Experience</Reveal>
      <Reveal as="h2" delay={0.08}>Where I've <em>worked</em></Reveal>
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

/* ---------- CERTIFICATIONS: just the logos ---------- */
function Brand({ k, size = 72, className = "" }) {
  const l = logos[k];
  return <svg className={"logo " + className} viewBox={`0 0 ${l.w} ${l.h}`} height={size} style={{ height: size, width: "auto" }} role="img" aria-label={k} dangerouslySetInnerHTML={{ __html: l.body }} />;
}
function Logo({ c, size = 72 }) {
  const [ok, setOk] = useState(true);
  if (logos[c.logo]) return <Brand k={c.logo} size={size} className={c.logo === "github" ? "" : ""} />;
  if (ok && c.logo) return <img className="logo" src={"assets/logos/" + c.logo} alt={c.org + " logo"} style={{ height: size, width: "auto", maxWidth: 180 }} onError={() => setOk(false)} />;
  return <span className="wordmark" style={{ fontSize: size * 0.5 }}>{c.mark || c.org}</span>;
}
function CertArt({ c }) {
  const [ok, setOk] = useState(true);
  if (ok) return <img src={"assets/certs/" + c.img} alt={c.t + " certificate"} onError={() => setOk(false)} />;
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
  return (
    <section className="certs" id="certifications"><div className="wrap">
      <div className="sec-head">
        <Reveal as="h2">My <em>certifications</em></Reveal>
      </div>
      <div className="cgrid">
        {certs.map((c, i) => (
          <Reveal key={c.t} delay={(i % 3) * 0.08} y={30}>
            <button className="ccard" onClick={() => setSel(c)} aria-label={"View " + c.t}>
              <span className="clogo"><Logo c={c} /></span>
              <span className="ccap">{c.t}</span>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {sel && (
          <Modal key="cm" onClose={close} label={sel.t}>
            <div className="cm">
              <div className="cm-media"><CertArt c={sel} /></div>
              <p className="cm-cap"><b>{sel.t}</b> · {sel.org}</p>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div></section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  const links = [
    ["LinkedIn", contact.linkedin, "linkedin", true],
    ["GitHub", contact.github, "github", true],
    ["Email", "mailto:" + contact.email, "gmail", false],
  ];
  return (
    <section className="contact" id="contact"><div className="wrap">
      <Reveal as="h2" className="big">Let's <em>connect.</em></Reveal>
      <div className="icons">
        {links.map(([n, h, k, ext], i) => (
          <Reveal key={n} delay={0.1 + i * 0.08} y={30}>
            <a className="ico" href={h} aria-label={n} title={n} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}><Brand k={k} size={34} className="plain" /></a>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.3} className="cv-row">
        <a className="btn" href="assets/Halima_Abdirizak_CV.pdf" download>Download résumé <span>↓</span></a>
      </Reveal>
      <footer><span>© 2026 {me.name}</span><a href="#top">Back to top ↑</a></footer>
    </div></section>
  );
}

function App() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="progress" style={{ scaleX: sx }} />
      <Nav /><main><Hero /><About /><Work /><Skills /><Experience /><Certs /></main><Contact />
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")).render(<App />);
