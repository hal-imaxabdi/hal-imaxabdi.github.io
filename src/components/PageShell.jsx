import { art } from "../art.js";
import Art from "./Art.jsx";
import { ArrowLeft } from "./Icons.jsx";
import "./pageshell.css";

// Sub-pages (all projects, one project): no top bar, just a back button and the Blue Lock look
// (Isagi in the corner, blue streaks, glowing panels).
export default function PageShell({ crumb, children }) {
  return (
    <div className="page ps">
      <div className="ps-bg" aria-hidden="true" />
      <Art src={art.homeProfile} className="ps-art" eager />
      <a className="home-back" href="/#fieldwork"><ArrowLeft size={16} /> Back</a>
      <div className="wrap page-inner ps-inner">
        {crumb && <p className="crumb">{crumb}</p>}
        {children}
      </div>
    </div>
  );
}
