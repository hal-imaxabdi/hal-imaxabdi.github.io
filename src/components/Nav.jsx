import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { homeSections } from "../router.js";
import { ease } from "./ui.jsx";

// `match` lists the pages and home sections that light up each link.
const links = [
  { href: "/projects", label: "Projects", match: ["projects", "project", "work"] },
  { href: "/#experience", label: "Experience", match: ["experience"] },
  { href: "/#about", label: "About", match: ["about", "skills"] },
  { href: "/certificates", label: "Certificates", match: ["certificates", "certs"] },
  { href: "/#contact", label: "Contact", match: ["contact"] },
];

// Which home section is in the middle of the screen right now.
function useVisibleSection(page) {
  const [visible, setVisible] = useState("");
  useEffect(() => {
    if (page !== "home") return setVisible("");
    let observer;
    // Wait for the page transition to mount the sections.
    const t = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && setVisible(e.target.id)),
        { rootMargin: "-45% 0px -50% 0px" }
      );
      ["top", ...homeSections].forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 700);
    return () => (clearTimeout(t), observer?.disconnect());
  }, [page]);
  return visible;
}

export default function Nav({ theme, onToggleTheme, route }) {
  const visible = useVisibleSection(route.page);
  const current = route.page === "home" ? visible : route.page;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // The router handles the navigation itself; links only need to close the mobile menu.
  const onLink = () => setOpen(false);

  return (
    <>
      <motion.header className={`nav ${scrolled ? "is-scrolled" : ""}`}
        initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease, delay: 0.2 }}>
        <div className="wrap nav-inner">
          <a className="logo" href="/" aria-label="Halima, home">H<span>.</span></a>

          <nav className="nav-links" aria-label="Main">
            {links.map((l) => {
              const active = l.match.includes(current);
              return (
                <a key={l.href} href={l.href} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined} onClick={(e) => onLink(e, l.href)}>
                  {active && <motion.span className="nav-pill" layoutId="nav-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="nav-label">{l.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="nav-actions">
            <button className="icon-btn" onClick={onToggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={theme} initial={{ rotate: -90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }} transition={{ duration: 0.25 }} style={{ display: "grid" }}>
                  {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </motion.span>
              </AnimatePresence>
            </button>
            <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
              <Menu size={18} />
            </button>
          </div>
        </div>
        <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.25rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" }}
            transition={{ duration: 0.6, ease }} role="dialog" aria-modal="true" aria-label="Menu">
            <button className="icon-btn mobile-close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
            <nav>
              {[{ href: "/", label: "Home" }, ...links].map((l, i) => (
                <motion.a key={l.href} href={l.href} onClick={(e) => onLink(e, l.href)}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease }}>
                  <span className="mono">0{i + 1}</span>{l.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
