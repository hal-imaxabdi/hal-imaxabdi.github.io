import { motion, useReducedMotion } from "framer-motion";
import { me } from "../data.js";
import { scrollToSection } from "../router.js";
import { Ball } from "./Icons.jsx";
import Pitch from "./Pitch.jsx";
import Typewriter from "./Typewriter.jsx";
import "./hero.css";

const EASE = [0.22, 1, 0.36, 1];

// Typed into the football chat pill each time the page opens.
const MESSAGES = ["Pick any character to explore."];

export default function Hero() {
  const reduce = useReducedMotion();
  const [firstName, ...rest] = me.name.split(" ");
  const enter = (delay, x = -40) => ({ initial: reduce ? false : { opacity: 0, x }, animate: { opacity: 1, x: 0 }, transition: { delay, duration: 0.8, ease: EASE } });

  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <div className="hero-bg" aria-hidden="true">
        <i className="streak s1" /><i className="streak s2" /><i className="streak s3" /><i className="streak s4" /><i className="streak s5" /><i className="streak s6" />
      </div>
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p className="hero-hi" {...enter(0.02)}>
            <span className="sr-only">Hi, I'm</span>
            {/* "Hi" uses a dotless i with a football for its dot */}
            <span aria-hidden="true">H<span className="hi-i">ı<span className="hi-dot"><Ball size="100%" /></span></span>, I&rsquo;m</span>
          </motion.p>
          <h1 className="hero-name" id="hero-name">
            <motion.span className="line line-1" {...enter(0.1)}>{firstName}</motion.span>
            <motion.span className="line line-2" {...enter(0.22)}>{rest.join(" ")}</motion.span>
          </h1>
          <motion.p className="hero-tag" {...enter(0.36, -24)}>I investigate threats and build practical defenses.</motion.p>
          <motion.p className="hero-cta" {...enter(0.5, -24)}>
            <Typewriter className="cta-text" messages={MESSAGES} highlight="character" loop={false} startDelay={reduce ? 0 : 1100} />
          </motion.p>
        </div>
        <Pitch onPick={(id) => scrollToSection(id)} />
      </div>
    </section>
  );
}
