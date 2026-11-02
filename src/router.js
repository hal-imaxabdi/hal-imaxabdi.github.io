import { useEffect, useState } from "react";

// Real paths, so every page has its own URL that search engines and link previews can read.
//   /                      home
//   /#work, /#about ...    home, scrolled to that section
//   /projects              all projects
//   /projects/<slug>       one project
//   /certificates          all certificates
// GitHub Pages serves a generated HTML file for each of these (see vite.config.js).
export const homeSections = ["work", "experience", "about", "skills", "certs", "contact"];

export function parse(pathname, hash = "") {
  const parts = pathname.split("/").filter(Boolean);
  const section = hash.replace(/^#/, "");
  if (parts[0] === "projects" && parts[1]) return { page: "project", slug: parts[1] };
  if (parts[0] === "projects") return { page: "projects" };
  if (parts[0] === "certificates") return { page: "certificates" };
  return { page: "home", section: homeSections.includes(section) ? section : undefined };
}

const current = () => parse(window.location.pathname, window.location.hash);

// Old links used hash routes like /#/projects/slotwise. Rewrite them to the real path.
function upgradeLegacyHash() {
  const h = window.location.hash;
  if (!h.startsWith("#/")) return;
  const path = h.slice(1);
  const section = path.slice(1);
  const next = homeSections.includes(section) ? `/#${section}` : path;
  window.history.replaceState(null, "", next);
}

export function navigate(href) {
  const same = href === window.location.pathname + window.location.hash;
  window.history[same ? "replaceState" : "pushState"](null, "", href);
  window.dispatchEvent(new Event("routechange"));
}

export function useRoute() {
  const [route, setRoute] = useState(() => (upgradeLegacyHash(), current()));

  useEffect(() => {
    const update = () => setRoute(current());

    // Handle clicks on internal links without a full page reload.
    function onClick(e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (/\.[a-z0-9]+$/i.test(href.split("#")[0])) return; // files such as the CV
      e.preventDefault();
      navigate(href);
    }

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", update);
    window.addEventListener("routechange", update);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", update);
      window.removeEventListener("routechange", update);
    };
  }, []);

  return route;
}

export const img = (file) => `/projects/${file}`;
export const certImg = (file) => `/certs/${file}`;

export function scrollToSection(id, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top, behavior: smooth ? "smooth" : "instant" });
  return true;
}
