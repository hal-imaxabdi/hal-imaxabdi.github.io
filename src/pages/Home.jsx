import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Achievements from "../components/Achievements.jsx";
import Contact from "../components/Contact.jsx";
import FieldWork from "../components/FieldWork.jsx";
import Hero from "../components/Hero.jsx";
import Intel from "../components/Intel.jsx";
import Profile from "../components/Profile.jsx";
import { scrollToSection } from "../router.js";
import "../components/home.css";

const VIEWS = { profile: Profile, intel: Intel, fieldwork: FieldWork, achievements: Achievements, contact: Contact };
const EASE = [0.76, 0, 0.24, 1];

// Blue Lock themed "back to pitch" button: a #11 player bib, a padlock that unlocks on hover, and a light sweep.
function BackGate() {
  return (
    <button className="home-back" onClick={() => scrollToSection("top")}>
      <span className="hb-bib" aria-hidden="true">11</span>
      <span className="hb-lock" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path className="hb-shackle" d="M7.5 11V8a4.5 4.5 0 0 1 9 0v3" /><rect x="5" y="11" width="14" height="10" rx="1.5" /><path d="M12 14.5v3" /></svg>
      </span>
      <span className="hb-text"><small>Exit gate</small>Back to pitch</span>
    </button>
  );
}

// One view at a time. Changing view plays a diagonal blue sweep; the new view appears while the screen is covered.
export default function Home({ section }) {
  const reduce = useReducedMotion();
  const View = VIEWS[section];
  const key = section ?? "pitch";
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={key} className="home-view"
          initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: reduce ? 0 : 0.28, ease: "easeOut" } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}>
          {View ? (<><BackGate /><View /></>) : <Hero />}
        </motion.div>
      </AnimatePresence>
      {!reduce && (
        <motion.div key={`wipe-${key}`} className="wipe" aria-hidden="true" initial={{ x: "-120%" }} animate={{ x: "120%" }} transition={{ duration: 0.85, ease: EASE }}>
          <i /><i />
        </motion.div>
      )}
    </>
  );
}
