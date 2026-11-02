import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { certCats, certs, goals } from "../data.js";
import { CertCard, CertLightbox, earned } from "../components/Certs.jsx";
import { ease, Reveal, SectionTitle } from "../components/ui.jsx";

export default function CertificatesPage() {
  const cats = ["All", ...certCats.filter((c) => certs.some((x) => x.cat === c))];
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(null);
  const shown = earned.filter((c) => cat === "All" || c.cat === cat);
  const inProgress = certs.filter((c) => c.status === "in progress" && (cat === "All" || c.cat === cat));
  const count = (c) => earned.filter((x) => c === "All" || x.cat === c).length;
  const close = useCallback(() => setOpen(null), []);

  return (
    <section className="section page-top">
      <div className="wrap">
        <a className="back-link" href="#/"><ArrowLeft size={15} /> Home</a>
        <SectionTitle as="h1" title="Certificates" count={earned.length}
          intro="Courses, programs and credentials I’ve completed. Open any certificate to see the original and verify it." />

        {cats.length > 2 && (
          <div className="toolbar">
            <div className="filters" role="group" aria-label="Filter certificates">
              {cats.map((c) => (
                <button key={c} className={`filter ${cat === c ? "is-active" : ""}`} onClick={() => setCat(c)} aria-pressed={cat === c}>
                  {cat === c && <motion.span layoutId="cfilter" className="filter-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className="filter-label">{c} <sup>{count(c)}</sup></span>
                </button>
              ))}
            </div>
          </div>
        )}

        <ul className="cert-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((c, i) => (
              <motion.li key={c.t} layout initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease, delay: i * 0.05 }}>
                <CertCard c={c} onOpen={() => setOpen(i)} />
              </motion.li>
            ))}
            {inProgress.map((c) => (
              <motion.li key={c.t} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="cert cert-dev">
                  <span className="cert-frame"><span className="mono">In development</span></span>
                  <span className="cert-caption"><strong>{c.t}</strong><span className="muted">{c.org}</span></span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {goals.length > 0 && (
          <Reveal className="goals">
            <h2 className="mono">Next goals</h2>
            <ul className="tags tags-lg">{goals.map((g) => <li key={g}>{g}</li>)}</ul>
          </Reveal>
        )}
      </div>
      <CertLightbox list={shown} index={open} onChange={setOpen} onClose={close} />
    </section>
  );
}
