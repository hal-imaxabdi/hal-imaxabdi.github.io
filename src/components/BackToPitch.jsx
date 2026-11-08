import { scrollToSection } from "../router.js";
import { ArrowLeft } from "./Icons.jsx";

// The small "Back to pitch" button every section ends with (shared, so all sections match).
export default function BackToPitch() {
  return (
    <p className="back-pitch">
      <a className="btn btn-ghost btn-sm" href="#top" onClick={(e) => { e.preventDefault(); history.replaceState(null, "", "/"); scrollToSection("top"); }}>
        <ArrowLeft size={16} /> Back to pitch
      </a>
    </p>
  );
}
