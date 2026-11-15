import { useEffect, useRef } from "react";
import Home from "./pages/Home.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import CertificatesPage from "./pages/CertificatesPage.jsx";
import { lenis } from "./gsap.js";
import { useRoute } from "./router.js";
import { applyMeta, pageMeta } from "./seo.js";

// Space to leave above a section when scrolling to it: the menu floats at the top on wide screens
// and sits at the bottom on phones (see home.css).
const navGap = () => (window.innerWidth <= 700 ? 8 : 84);

export default function App() {
  const route = useRoute();
  const lastPage = useRef(null);

  // The home page is one long page. A link such as /#fieldwork scrolls down to that section:
  // smoothly when you are already on the home page, instantly when you arrive from another page.
  useEffect(() => {
    applyMeta(pageMeta(route));
    const samePage = lastPage.current === route.page;
    lastPage.current = route.page;

    if (route.page === "home" && route.section) {
      const go = (smooth) => {
        const el = document.getElementById(route.section);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - navGap();
        if (lenis) { lenis.resize(); lenis.scrollTo(y, { immediate: !smooth, force: true }); }
        else window.scrollTo({ top: y, behavior: smooth ? "smooth" : "instant" });
      };
      if (samePage) go(true);
      else { setTimeout(() => go(false), 80); setTimeout(() => go(false), 500); }  // twice: images above may still be loading
    } else if (route.page === "home" && samePage) {
      if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [route]);

  let page;
  if (route.page === "projects") page = <ProjectsPage />;
  else if (route.page === "project") page = <ProjectPage slug={route.slug} />;
  else if (route.page === "certificates") page = <CertificatesPage />;
  else page = <Home />;

  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>Skip to content</a>
      <main id="main" tabIndex={-1} key={route.page + (route.slug ?? "")}>{page}</main>
    </>
  );
}
