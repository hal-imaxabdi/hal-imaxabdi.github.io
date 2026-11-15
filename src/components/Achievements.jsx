import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { writeups } from "../data.js";
import { CertCard, CertLightbox, earned } from "./Certs.jsx";
import { ShardNumber } from "./SectionHead.jsx";
import "./achievements.css";

const EASE = [0.22, 1, 0.36, 1];

const Stripes = () => <span className="rn-stripes" aria-hidden="true"><i /><i /><i /></span>;

const item = { off: { opacity: 0, y: 22 }, on: { opacity: 1, y: 0 } };
const List = ({ reduce, className, children }) => (
  <motion.ul className={className} initial={reduce ? false : "off"} animate="on" transition={{ staggerChildren: 0.06 }}>{children}</motion.ul>
);

/* Certificates on the home page: only the ones marked `featured: true` in data.js, as cards.
   Clicking one opens it full size. The full list lives on /certificates/. */
const featured = earned.filter((c) => c.featured);
function Certificates({ reduce }) {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      <motion.div className="cert-feature" initial={reduce ? false : "off"} whileInView="on" viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ staggerChildren: 0.1 }}>
        {featured.map((c, i) => (
          <motion.div key={c.t} variants={item} transition={{ duration: 0.6, ease: EASE }}>
            <CertCard c={c} onOpen={() => setOpen(i)} />
          </motion.div>
        ))}
      </motion.div>
      {earned.length > featured.length && (
        <p className="more-row"><a className="more-link" href="/certificates/">All certificates <b aria-hidden="true">→</b></a></p>
      )}
      <CertLightbox list={featured} index={open} onChange={setOpen} onClose={close} />
    </>
  );
}

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
      <div className="wrap rn-wrap">
        <header className="rn-head">
          <Stripes />
          <h2 id="achievements-title">Achievements</h2>
        </header>
        <p className="rn-intro">A few certificates that matter most for the work I do, and the CTFs I've played and written up.</p>

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
