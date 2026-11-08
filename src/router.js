import { useEffect, useState } from "react";
import { lenis } from "./gsap.js";
import { warpTo } from "./warp.js";

// Real paths, so every page has its own URL that search engines and link previews can read.
//   /                      home: the arena opening + Profile, Intel, Field Work, Achievements, Contact
//   /#fieldwork            home, scrolled to a section
//   /projects/             all projects
//   /projects/<slug>/      one project
//   /certificates/         all certificates
// GitHub Pages serves a generated HTML file for each of these (see vite.config.js).
export const homeSections = ["profile", "intel", "fieldwork", "achievements", "contact"];
// Section links from older versions of the site still land somewhere sensible.
const oldSections = { work: "fieldwork", experience: "profile", about: "profile", skills: "intel", certs: "achievements", readme: "profile" };

export function parse(pathname, hash = "") {
  const parts = pathname.split("/").filter(Boolean);
  const section = hash.replace(/^#/, "");
  if (parts[0] === "projects" && parts[1]) return { page: "project", slug: parts[1] };
  if (parts[0] === "projects") return { page: "projects" };
  if (parts[0] === "certificates") return { page: "certificates" };
  const known = homeSections.includes(section) ? section : oldSections[section];
  return { page: "home", section: known };
}

const current = () => parse(window.location.pathname, window.location.hash);

// Old links used hash routes like /#/projects/semis. Rewrite them to the real path.
function upgradeLegacyHash() {
  const h = window.location.hash;
  if (!h.startsWith("#/")) return;
  const path = h.slice(1);
  const section = path.slice(1);
  const target = homeSections.includes(section) ? section : oldSections[section];
  const next = target ? `/#${target}` : path;
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

// Move to a home-page section. smooth = true plays the speed-wipe transition (warp.js) and jumps
// behind it; smooth = false (e.g. opening /#intel directly) just jumps.
export function scrollToSection(id, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return false;
  const jump = () => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo({ top, behavior: "instant" });
  };
  if (smooth) warpTo(id, jump);
  else jump();
  return true;
}
