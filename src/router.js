import { useEffect, useState } from "react";

// Hash routes so deep links work on GitHub Pages without server rewrites.
//   #/                     home
//   #/work, #/about ...    home, scrolled to that section
//   #/projects             all projects
//   #/projects/<slug>      one project
//   #/certificates         all certificates
export const homeSections = ["work", "experience", "about", "skills", "certs", "contact"];

export function parse(hash) {
  const path = hash.replace(/^#/, "") || "/";
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "projects" && parts[1]) return { page: "project", slug: parts[1] };
  if (parts[0] === "projects") return { page: "projects" };
  if (parts[0] === "certificates") return { page: "certificates" };
  if (homeSections.includes(parts[0])) return { page: "home", section: parts[0] };
  return { page: "home" };
}

export function useRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash));
  useEffect(() => {
    // Hashes that aren't routes (like the skip link's #main) leave the page alone.
    const onChange = () => window.location.hash.startsWith("#/") || !window.location.hash ? setRoute(parse(window.location.hash)) : null;
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
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
