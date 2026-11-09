import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { writeups } from "../data.js";
import { CertImage, CertLightbox, earned } from "./Certs.jsx";
import { ShardNumber } from "./SectionHead.jsx";
import ShatteredGlass from "./ShatteredGlass.jsx";
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

/* Certificates as two rows that keep sliding in opposite directions (top row left, bottom row right).
   Each row holds its certificates twice so the loop is seamless; hovering or focusing a row pauses it,
   and clicking a card opens it full size. Small HUD cards (the CTF card shape), so 30+ still fit. */
function Certificates({ reduce }) {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const rows = [0, 1].map((k) => earned.map((c, i) => ({ c, i })).filter(({ i }) => i % 2 === k));

  const Card = ({ c, i, copy }) => (
    <li className="rn-cw">
      <button className="rn-cert" onClick={() => setOpen(i)} tabIndex={copy ? -1 : 0} aria-hidden={copy || undefined} aria-label={`View ${c.t} certificate`}>
        <span className="rn-cert-in">
          <span className="rn-cert-img"><CertImage c={c} /></span>
          <span className="rn-cert-cap">
            <strong>{c.t}</strong>
            <span>{[c.org, c.date].filter(Boolean).join(" · ")}</span>
          </span>
        </span>
      </button>
    </li>
  );

  return (
    <>
      <div className={`rn-reels ${reduce ? "is-still" : ""}`}>
        {rows.map((row, k) => (
          <div key={k} className={`rn-reel ${k ? "is-right" : ""}`} style={{ "--dur": `${row.length * 6}s` }}>
            <ul className="rn-reel-track">
              {row.map((x) => <Card key={x.c.t} {...x} />)}
              {!reduce && row.map((x) => <Card key={`copy-${x.c.t}`} {...x} copy />)}
            </ul>
          </div>
        ))}
      </div>
      <CertLightbox list={earned} index={open} onChange={setOpen} onClose={close} />
    </>
  );
}

/* Background: faint pitch lines behind everything (the shattered glass is in ShatteredGlass.jsx). */
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
      <ShatteredGlass className="sg-tr" ball reduce={reduce} /><ShatteredGlass className="sg-bl" variant="b" />
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
              {tab === "certs" && <Certificates reduce={reduce} />}
              {tab === "writeups" && <Writeups reduce={reduce} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}
