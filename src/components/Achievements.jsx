import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const item = { off: { opacity: 0, y: 22 }, on: { opacity: 1, y: 0 } };
const List = ({ reduce, className, children }) => (
  <motion.ul className={className} initial={reduce ? false : "off"} animate="on" transition={{ staggerChildren: 0.06 }}>{children}</motion.ul>
);

/* Certificates as a calm two-column index (number, title, issuer, date). Hovering a row brings up a
   preview of that certificate in a small glowing HUD frame that follows the cursor and leans into the
   movement; clicking opens it full size. Nothing moves on its own, and it stays tidy at 10 or 40. */
function Certificates({ reduce }) {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const [hi, setHi] = useState(null);
  const card = useRef(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // the preview glides after the cursor and tilts with its speed
  useEffect(() => {
    if (hi == null) return;
    let raf;
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * (reduce ? 1 : 0.2);
      p.y += (p.ty - p.y) * (reduce ? 1 : 0.2);
      const tilt = reduce ? 0 : Math.max(-7, Math.min(7, (p.tx - p.x) * 0.06));
      if (card.current) card.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hi, reduce]);

  const aim = (e, snap) => {
    const w = 300, flip = e.clientX + w + 40 > window.innerWidth;
    const p = pos.current;
    p.tx = flip ? e.clientX - w - 28 : e.clientX + 28;
    p.ty = Math.min(window.innerHeight - 220, Math.max(16, e.clientY - 100));
    if (snap) { p.x = p.tx; p.y = p.ty; }
  };
  const hoverable = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  return (
    <>
      <ol className="rn-index">
        {earned.map((c, i) => (
          <li key={c.t}>
            <button className="rn-crow" onClick={() => setOpen(i)} aria-label={`View ${c.t} certificate`}
              onPointerEnter={hoverable ? (e) => { aim(e, hi == null); setHi(i); } : undefined}
              onPointerMove={hoverable ? (e) => aim(e) : undefined}
              onPointerLeave={hoverable ? () => setHi(null) : undefined}>
              <span className="rn-crow-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="rn-crow-txt">
                <strong>{c.t}</strong>
                <span>{c.org}</span>
              </span>
              <span className="rn-crow-date">{c.date}</span>
            </button>
          </li>
        ))}
      </ol>

      {hoverable && createPortal(
        <div ref={card} className={`rn-peek ${hi != null ? "is-on" : ""}`} aria-hidden="true">
          <span className="rn-peek-in">{hi != null && <CertImage key={earned[hi].t} c={earned[hi]} />}</span>
        </div>,
        document.body
      )}
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

/* ---------- ACHIEVEMENTS: certificates, then CTF write-ups, each under its own small heading ---------- */
export default function Achievements() {
  const reduce = useReducedMotion();

  return (
    <section className="sec sec-achievements" id="achievements" aria-labelledby="achievements-title">
      {/* background: the curved shot (a still trail), the shattered glass, crosshairs, #10 */}
      <svg className="rn-shot" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d={SHOT} /></svg>
      <Pitch />
      <ShatteredGlass className="sg-tr" ball reduce={reduce} /><ShatteredGlass className="sg-bl" />
      <Reticle className="r1" /><Reticle className="r2" /><Reticle className="r3" />
      <span className="rn-10" aria-hidden="true">10</span>

      <div className="wrap rn-wrap">
        <header className="rn-head">
          <Stripes />
          <h2 id="achievements-title">Achievements</h2>
        </header>
        <p className="rn-intro">Certificates I've earned and the CTFs I've played and written up.</p>

        <section className="rn-block" aria-labelledby="rn-certs-title">
          <h3 className="rn-sub" id="rn-certs-title">Certificates</h3>
          <Certificates reduce={reduce} />
        </section>

        <section className="rn-block" aria-labelledby="rn-ctf-title">
          <h3 className="rn-sub" id="rn-ctf-title">CTF write-ups</h3>
          <Writeups reduce={reduce} />
        </section>
      </div>
    </section>
  );
}
