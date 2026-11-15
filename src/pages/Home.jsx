import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Achievements from "../components/Achievements.jsx";
import Contact from "../components/Contact.jsx";
import FieldWork from "../components/FieldWork.jsx";
import Hero from "../components/Hero.jsx";
import Intel from "../components/Intel.jsx";
import Profile from "../components/Profile.jsx";
import Splash from "../components/Splash.jsx";
import { lenis } from "../gsap.js";
import { scrollToSection } from "../router.js";
import "../components/home.css";

/* Small line icons for the menu (24 × 24 box). */
const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const ICONS = {
  home: "M4 11.5 12 4l8 7.5M6.5 10v9.5h11V10",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0",
  skills: "m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5",
  projects: "M4 5h7v7H4zM13 5h7v4h-7zM13 12h7v7h-7zM4 15h7v4H4z",
  awards: "M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM9 13.5 7.5 21l4.5-2.5 4.5 2.5L15 13.5",
  contact: "M3.5 6h17v12h-17zM4 7l8 6.5L20 7",
};

/* THE HOME PAGE: the kick-off screen, the hero, then every section below in the order of this list.
   To rename a tab, reorder the page or drop a section, edit this list only.
     label  the name in the menu          short  a shorter name for phones (optional)
     icon   one of ICONS above            word   the huge outlined word that drifts behind the section */
const SECTIONS = [
  { id: "profile", label: "Profile", icon: "profile", word: "Who I am", View: Profile },
  { id: "intel", label: "Skills", icon: "skills", word: "Build Secure Detect", View: Intel },
  { id: "fieldwork", label: "Projects", icon: "projects", word: "What I built", View: FieldWork },
  { id: "achievements", label: "Achievements", short: "Awards", icon: "awards", word: "Earned", View: Achievements },
  { id: "contact", label: "Contact", icon: "contact", word: "Say hello", View: Contact },
];
const TABS = [{ id: "top", label: "Home", icon: "home" }, ...SECTIONS];

/* The moving band under the hero. Edit the words freely. */
const BAND = ["Build", "Secure", "Detect", "Backend", "Application security", "Python", "FastAPI", "PostgreSQL", "Detection", "Elastic SIEM"];

// Which section is on screen right now (for the highlighted tab), and whether we have left the hero.
function useScrollSpy() {
  const [current, setCurrent] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setCurrent(e.target.id === "top" ? null : e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["top", ...SECTIONS.map((s) => s.id)].forEach((id) => { const el = document.getElementById(id); if (el) seen.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); seen.disconnect(); };
  }, []);
  return { current, scrolled };
}

/* THE MENU: a floating glass capsule. On wide screens it hangs at the top of the page;
   on phones it docks at the bottom, where a thumb can reach it, with an icon over each name.
   A blue pill slides to whichever section is on screen, and a thin line across the very top
   of the page fills up as you scroll. */
function NavBar({ current, scrolled }) {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const here = current ?? "top";
  return (
    <>
      <motion.i className="progress" style={{ scaleX: p }} aria-hidden="true" />
      <nav className={`dock ${scrolled ? "is-solid" : ""}`} aria-label="Sections">
        <ul>
          {TABS.map((t) => {
            const on = t.id === here;
            return (
              <li key={t.id}>
                <button type="button" className={on ? "is-on" : ""} aria-current={on ? "true" : undefined} onClick={() => scrollToSection(t.id)}>
                  {on && <motion.span layoutId="dock-pill" className="dock-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <Icon d={ICONS[t.icon]} />
                  <span className="dock-name">{t.label}</span>
                  <span className="dock-short">{t.short ?? t.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

// The moving band of words under the hero.
function Band() {
  const row = [...BAND, ...BAND];
  return (
    <div className="band-hold" aria-hidden="true">
      <div className="band">
        <div className="band-row">{row.map((w, i) => <span key={i} className={i % 2 ? "is-line" : ""}>{w}<i>✦</i></span>)}</div>
      </div>
    </div>
  );
}

// One section, with its huge outlined word sliding sideways behind it as you scroll past.
function Shell({ word, children }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-34%"]);
  return (
    <div className="shell" ref={ref}>
      <div className="ghost" aria-hidden="true"><motion.span style={reduce ? undefined : { x }}>{word}</motion.span></div>
      {children}
    </div>
  );
}

// The kick-off screen plays once per visit, and only when you land at the top of the home page.
function shouldKickOff() {
  if (typeof window === "undefined") return false;
  if (window.location.hash || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try { return !sessionStorage.getItem("kicked-off"); } catch { return true; }
}

export default function Home() {
  const spy = useScrollSpy();
  const [splash, setSplash] = useState(shouldKickOff);

  // no scrolling behind the kick-off screen
  useEffect(() => {
    if (!splash) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => { lenis?.start(); document.documentElement.style.overflow = ""; };
  }, [splash]);
  const done = useCallback(() => {
    try { sessionStorage.setItem("kicked-off", "1"); } catch { /* private mode: it simply plays again next time */ }
    setSplash(false);
  }, []);

  return (
    <div className="home-view">
      {splash && <Splash onDone={done} />}
      <div className="home-bg" aria-hidden="true" />
      <NavBar {...spy} />
      <Hero ready={!splash} />
      <Band />
      {SECTIONS.map(({ id, word, View }) => <Shell key={id} word={word}><View /></Shell>)}
    </div>
  );
}
