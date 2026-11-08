import { useRef } from "react";
import Nav from "./Nav.jsx";
import { useReveal } from "./useReveal.js";

// Sub-pages (all projects, one project, certificates): the same top bar and a calm navy page.
export default function PageShell({ crumb, children }) {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <div className="page" ref={ref}>
      <Nav home={false} />
      <div className="wrap page-inner">
        {crumb && <p className="crumb">{crumb}</p>}
        {children}
      </div>
    </div>
  );
}
