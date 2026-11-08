import { useEffect, useRef, useState } from "react";
import { me } from "../data.js";
import { scrollToSection } from "../router.js";
import { Close, Menu } from "./Icons.jsx";

export const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "intel", label: "Intel" },
  { id: "fieldwork", label: "Field Work" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

/* The fixed top bar. On the home page the links scroll to sections and the current one is marked;
   on other pages they go back to the home page. */
export default function Nav({ home = true }) {
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(!home);
  const menuBtn = useRef(null);

  useEffect(() => {
    if (!home) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      setSolid(window.scrollY > 40);
      if (window.scrollY < window.innerHeight * 0.4) setActive(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [home]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); menuBtn.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => { document.body.classList.remove("no-scroll"); window.removeEventListener("keydown", onKey); };
  }, [open]);

  const go = (id) => (e) => {
    setOpen(false);
    if (!home) return; // the router takes /#id back to the home page
    e.preventDefault();
    history.replaceState(null, "", `#${id}`);
    scrollToSection(id);
  };

  return (
    <header className={`nav ${solid ? "is-solid" : ""}`}>
      <a className="nav-mark" href={home ? "#top" : "/"} onClick={home ? (e) => { e.preventDefault(); history.replaceState(null, "", "/"); scrollToSection("top"); } : undefined}
        aria-label={`${me.name}: back to the top`}>
        {me.first}
      </a>

      <nav className="nav-links" aria-label="Sections">
        <ol>
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={home ? `#${s.id}` : `/#${s.id}`} onClick={go(s.id)} aria-current={active === s.id ? "location" : undefined}>
                <span className="nav-num">{String(i + 1).padStart(2, "0")}</span>{s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <button ref={menuBtn} className="nav-menu-btn" aria-expanded={open} aria-controls="nav-sheet" aria-label="Open menu" onClick={() => setOpen(true)}>
        <Menu size={22} />
      </button>

      {open && (
        <div className="nav-sheet" id="nav-sheet" data-lenis-prevent role="dialog" aria-modal="true" aria-label="Menu">
          <button className="nav-close" onClick={() => { setOpen(false); menuBtn.current?.focus(); }} aria-label="Close menu" autoFocus>
            <Close size={24} />
          </button>
          <ol>
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={home ? `#${s.id}` : `/#${s.id}`} onClick={go(s.id)}>
                  <span className="nav-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="nav-sheet-label">{s.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </header>
  );
}
