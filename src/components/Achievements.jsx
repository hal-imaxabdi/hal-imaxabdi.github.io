import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { writeups } from "../data.js";
import { CertImage, CertLightbox, earned } from "./Certs.jsx";
import { ShardNumber } from "./SectionHead.jsx";
import "./achievements.css";

const EASE = [0.22, 1, 0.36, 1];

/* Rin Itoshi-inspired details (all blue, no character art): his curved shot as a bending trail
   with a ball riding it, faint crosshairs for his precision, frames that "lock on" with a
   crosshair on hover, and his #10. */
const SHOT = "M-40 660 C 260 660, 420 160, 760 150 S 1120 260, 1260 60";

// a small crosshair / target-lock mark
const Reticle = ({ className = "" }) => (
  <svg className={`rn-reticle ${className}`} viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="12" /><circle cx="20" cy="20" r="2" className="dot" />
    <path d="M20 2v9M20 29v9M2 20h9M29 20h9" />
  </svg>
);
const Stripes = () => <span className="rn-stripes" aria-hidden="true"><i /><i /><i /></span>;

const TABS = [
  { id: "certs", label: "Certificates" },
  { id: "writeups", label: "CTF write-ups" },
];

function Tabs({ tab, setTab }) {
  const refs = useRef([]);
  const onKey = (e, i) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const k = (i + step + TABS.length) % TABS.length;
    setTab(TABS[k].id);
    refs.current[k]?.focus();
  };
  return (
    <div className="rn-tabs" role="tablist" aria-label="Achievements">
      {TABS.map((t, i) => (
        <button key={t.id} ref={(el) => (refs.current[i] = el)} role="tab" id={`rn-tab-${t.id}`} aria-controls="rn-panel"
          aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1} className="rn-tab"
          onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

const item = { off: { opacity: 0, y: 22 }, on: { opacity: 1, y: 0 } };
const List = ({ reduce, className, children }) => (
  <motion.ul className={className} initial={reduce ? false : "off"} animate="on" transition={{ staggerChildren: 0.06 }}>{children}</motion.ul>
);

/* A Blue Lock frame: cut corners, a glowing blue edge, solid navy inside, speed lines in the corner,
   and a crosshair that locks onto the corner on hover. `as` is the outer element (a, button or div). */
function Frame({ as: Tag = "div", className = "", children, ...rest }) {
  return (
    <div className="rn-glow">
      <Tag className={`rn-frame ${className}`} {...rest}>
        <span className="rn-frame-in">
          <span className="rn-speed" aria-hidden="true" />
          <Reticle className="rn-lock" />
          {children}
        </span>
      </Tag>
    </div>
  );
}

function Certificates({ reduce, onOpen }) {
  return (
    <List reduce={reduce} className="rn-certs">
      {earned.map((c, i) => (
        <motion.li key={c.t} variants={item} transition={{ duration: 0.45, ease: EASE }}>
          <Frame as="button" className="rn-cert" onClick={() => onOpen(i)} aria-label={`View ${c.t} certificate`}>
            <span className="rn-cert-img"><CertImage c={c} /></span>
            <span className="rn-cert-cap">
              <strong>{c.t}</strong>
              <span>{[c.org, c.date].filter(Boolean).join(" · ")}</span>
            </span>
          </Frame>
        </motion.li>
      ))}
    </List>
  );
}

/* Background: shattered glass breaking in from two corners (drawn for the top-right corner,
   flipped for the bottom-left), plus faint pitch lines behind everything. */
const GLASS = [
  "300,0 196,0 236,58", "300,0 236,58 300,96", "236,58 196,0 150,34 204,104", "236,58 300,96 262,156 204,104",
  "204,104 150,34 112,92 160,150", "262,156 204,104 160,150 214,206", "300,96 300,190 262,156",
];
const FLOAT = ["124,170 146,154 140,186", "84,58 102,48 96,76", "178,226 200,214 190,244", "250,240 266,232 262,256", "60,128 72,118 70,140"];
const Glass = ({ className }) => (
  <svg className={`rn-glass ${className}`} viewBox="0 0 300 300" aria-hidden="true">
    {GLASS.map((p) => <polygon key={p} points={p} />)}
    <g className="float">{FLOAT.map((p) => <polygon key={p} points={p} />)}</g>
    <path className="crack" d="M300 0 L120 150 M300 0 L170 260 M300 0 L70 50 M236 58 L40 100" />
  </svg>
);
const Pitch = () => (
  <svg className="rn-pitch" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect x="40" y="40" width="1120" height="620" /><path d="M600 40v620" /><circle cx="600" cy="350" r="92" />
    <rect x="40" y="190" width="170" height="320" /><rect x="40" y="275" width="62" height="150" />
    <rect x="990" y="190" width="170" height="320" /><rect x="1098" y="275" width="62" height="150" />
    <path d="M210 290a70 70 0 0 1 0 120M990 290a70 70 0 0 0 0 120" />
  </svg>
);

// CTF write-ups as glowing HUD cards: a crystal-shard number on the left, title, when/where, one line.
function Writeups({ reduce }) {
  return (
    <List reduce={reduce} className="rn-wus">
      {writeups.map((w, i) => (
        <motion.li key={w.t} className="rn-wu-wrap" variants={item} transition={{ duration: 0.5, ease: EASE }}>
          <a className="rn-wu" href={w.url} target="_blank" rel="noopener">
            <span className="rn-wu-in">
              <span className="rn-wu-badge" aria-hidden="true"><ShardNumber n={i + 1} /></span>
              <span className="rn-wu-body">
                <span className="rn-wu-t">{w.t}</span>
                <span className="rn-wu-meta">{w.meta}</span>
                <span className="rn-wu-d">{w.d}</span>
              </span>
              <span className="rn-wu-go" aria-hidden="true">›</span>
            </span>
          </a>
        </motion.li>
      ))}
    </List>
  );
}

/* ---------- ACHIEVEMENTS: certificates and CTF write-ups behind two tabs ---------- */
export default function Achievements() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState("certs");
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section className="sec sec-achievements" id="achievements" aria-labelledby="achievements-title">
      {/* background: the curved shot with a ball riding it, crosshairs, #10 */}
      <svg className="rn-shot" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path id="rn-shot-path" d={SHOT} />
        <circle r="5" className="rn-shot-ball">
          {!reduce && <animateMotion dur="9s" repeatCount="indefinite"><mpath href="#rn-shot-path" /></animateMotion>}
        </circle>
      </svg>
      <Pitch />
      <Glass className="g-tr" /><Glass className="g-bl" />
      <Reticle className="r1" /><Reticle className="r2" /><Reticle className="r3" />
      <span className="rn-10" aria-hidden="true">10</span>

      <div className="wrap rn-wrap">
        <header className="rn-head">
          <Stripes />
          <h2 id="achievements-title">Achievements</h2>
        </header>
        <p className="rn-intro">Certificates I've earned and the CTFs I've played and written up.</p>

        <Tabs tab={tab} setTab={setTab} />

        <div className="rn-body" role="tabpanel" id="rn-panel" aria-labelledby={`rn-tab-${tab}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.15 } }}>
              {tab === "certs" && <Certificates reduce={reduce} onOpen={setOpen} />}
              {tab === "writeups" && <Writeups reduce={reduce} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <CertLightbox list={earned} index={open} onChange={setOpen} onClose={close} />
    </section>
  );
}
