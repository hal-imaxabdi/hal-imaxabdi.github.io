import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Nav from "./components/Nav.jsx";
import { ease } from "./components/ui.jsx";
import Home from "./pages/Home.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import CertificatesPage from "./pages/CertificatesPage.jsx";
import { me, projects } from "./data.js";
import { scrollToSection, useRoute } from "./router.js";

function initialTheme() {
  const saved = document.documentElement.dataset.theme;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const pageKey = (r) => (r.page === "project" ? `project/${r.slug}` : r.page);

function titleFor(r) {
  if (r.page === "projects") return `Projects · ${me.first}`;
  if (r.page === "certificates") return `Certificates · ${me.first}`;
  if (r.page === "project") return `${projects.find((p) => p.slug === r.slug)?.t ?? "Project"} · ${me.first}`;
  return `${me.name} · Software & Security`;
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [wipe, setWipe] = useState(0);
  const route = useRoute();
  const routeRef = useRef(route);
  const lastKey = useRef(pageKey(route));
  routeRef.current = route;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Same page: scroll to the requested section (or the top). New page: handled once the old one has left.
  useEffect(() => {
    document.title = titleFor(route);
    const key = pageKey(route);
    if (key !== lastKey.current) {
      lastKey.current = key;
      setWipe((w) => w + 1);
      return;
    }
    if (route.section) scrollToSection(route.section);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route]);

  // Deep link straight to a section on first load.
  useEffect(() => {
    if (route.section) setTimeout(() => scrollToSection(route.section, false), 350);
    try { history.scrollRestoration = "manual"; } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function onPageExit() {
    window.scrollTo({ top: 0, behavior: "instant" });
    const section = routeRef.current.section;
    if (section) requestAnimationFrame(() => scrollToSection(section, false));
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("theme", next); } catch {}
  }

  let page;
  if (route.page === "projects") page = <ProjectsPage />;
  else if (route.page === "project") page = <ProjectPage slug={route.slug} />;
  else if (route.page === "certificates") page = <CertificatesPage />;
  else page = <Home theme={theme} />;

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#main" onClick={(e) => (e.preventDefault(), document.getElementById("main")?.focus())}>Skip to content</a>
      <Nav theme={theme} onToggleTheme={toggleTheme} route={route} />
      <AnimatePresence mode="wait" onExitComplete={onPageExit}>
        <motion.main
          key={pageKey(route)}
          id="main"
          tabIndex={-1}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: 0.15 } }}
          exit={{ opacity: 0, y: -16, transition: { duration: 0.3, ease } }}
        >
          {page}
        </motion.main>
      </AnimatePresence>
      {wipe > 0 && (
        <motion.div key={wipe} className="curtain" aria-hidden="true" initial={{ y: "100%" }}
          animate={{ y: ["100%", "0%", "0%", "-100%"] }} transition={{ duration: 1.1, times: [0, 0.3, 0.5, 1], ease: "easeInOut" }} />
      )}
    </MotionConfig>
  );
}
