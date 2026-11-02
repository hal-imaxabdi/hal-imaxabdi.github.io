import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1];
export const pad = (n) => String(n).padStart(2, "0");

// Fades and lifts children in once they scroll into view.
export function Reveal({ children, delay = 0, y = 24, as = "div", className, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Words slide up from behind a mask, one after another.
export function SplitText({ text, as = "h2", className, delay = 0, onMount = false }) {
  const Tag = motion[as];
  const words = text.split(" ");
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-60px" } };
  return (
    <Tag className={className} initial="hidden" {...trigger} aria-label={text}
      variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: delay } } }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="word-mask">
            <motion.span className="word" variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 0.85, ease } } }}>
              {w}
            </motion.span>
          </span>{i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

// Big section heading with an optional count, e.g. "Selected work (04)".
export function SectionTitle({ title, count, intro, action, as = "h2" }) {
  return (
    <header className="section-title">
      <div className="section-title-main">
        <div className="title-row">
          <SplitText as={as} text={title} />
          {count != null && (
            <motion.sup className="count mono" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              ({pad(count)})
            </motion.sup>
          )}
        </div>
        {intro && <Reveal as="p" className="section-intro" delay={0.1}>{intro}</Reveal>}
      </div>
      {action && <Reveal className="section-action" delay={0.15}>{action}</Reveal>}
    </header>
  );
}

// Pulls its child gently toward the cursor.
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  function onMove(e) {
    if (e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }
  return (
    <motion.span ref={ref} className="magnetic" style={{ x, y }} onPointerMove={onMove} onPointerLeave={() => (x.set(0), y.set(0))}>
      {children}
    </motion.span>
  );
}

// Brand icons are inlined because icon packs no longer ship them.
export const GitHubIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export const LinkedInIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);
