import { ArrowLeft } from "./Icons.jsx";
import "./pageshell.css";

// Sub-pages (all projects, one project): no top bar, just a back button, blue streaks and glowing panels.
// `back` is where the Back button goes (a section of the home page).
export default function PageShell({ crumb, children, back = "/#fieldwork" }) {
  return (
    <div className="page ps">
      <div className="ps-bg" aria-hidden="true" />
      <a className="home-back" href={back}><ArrowLeft size={16} /> Back</a>
      <div className="wrap page-inner ps-inner">
        {crumb && <p className="crumb">{crumb}</p>}
        {children}
      </div>
    </div>
  );
}
