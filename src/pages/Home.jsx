import { AnimatePresence, motion } from "framer-motion";
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

// One view at a time: the pitch, or the section of the player you picked. No scrolling between sections.
export default function Home({ section }) {
  const View = VIEWS[section];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={section ?? "pitch"} className="home-view"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
        {View ? (
          <>
            <button className="home-back" onClick={() => scrollToSection("top")}><ArrowLeft size={16} /> Pitch</button>
            <View />
          </>
        ) : <Hero />}
      </motion.div>
    </AnimatePresence>
  );
}
