import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Achievements from "../components/Achievements.jsx";
import Contact from "../components/Contact.jsx";
import FieldWork from "../components/FieldWork.jsx";
import Hero from "../components/Hero.jsx";
import Intel from "../components/Intel.jsx";
import Profile from "../components/Profile.jsx";
import { ArrowLeft } from "../components/Icons.jsx";
import { scrollToSection } from "../router.js";
import "../components/home.css";

const VIEWS = { profile: Profile, intel: Intel, fieldwork: FieldWork, achievements: Achievements, contact: Contact };
const EASE = [0.76, 0, 0.24, 1];

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
          {View ? (<><button className="home-back" onClick={() => scrollToSection("top")}><ArrowLeft size={16} /> Pitch</button><View /></>) : <Hero />}
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
