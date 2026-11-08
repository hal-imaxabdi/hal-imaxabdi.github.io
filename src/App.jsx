import { useEffect } from "react";
import Home from "./pages/Home.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import CertificatesPage from "./pages/CertificatesPage.jsx";
import { scrollToSection, useRoute } from "./router.js";
import { applyMeta, pageMeta } from "./seo.js";

export default function App() {
  const route = useRoute();

  useEffect(() => {
    applyMeta(pageMeta(route));
    if (route.section) setTimeout(() => scrollToSection(route.section, false), 80);
    else window.scrollTo({ top: 0, behavior: "instant" });
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
