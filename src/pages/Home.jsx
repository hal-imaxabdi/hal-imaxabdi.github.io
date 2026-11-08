import { useRef } from "react";
import Achievements from "../components/Achievements.jsx";
import Contact from "../components/Contact.jsx";
import FieldWork from "../components/FieldWork.jsx";
import Hero from "../components/Hero.jsx";
import Intel from "../components/Intel.jsx";
import Profile from "../components/Profile.jsx";
import { useReveal } from "../components/useReveal.js";

// No top nav bar here: the players on the pitch are the menu, and every section has "Back to pitch".
export default function Home() {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <div ref={ref}>
      <Hero />
      <Profile />
      <Intel />
      <FieldWork />
      <Achievements />
      <Contact />
    </div>
  );
}
