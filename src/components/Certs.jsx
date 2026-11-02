import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { certs } from "../data.js";
import { certImg } from "../router.js";
import { ease } from "./ui.jsx";

export const earned = certs.filter((c) => (c.status || "earned") === "earned");

// Full-size certificate with its details. Arrow keys step through `list`.
export function CertLightbox({ list, index, onChange, onClose }) {
  const c = index == null ? null : list[index];
  const closeRef = useRef(null);

  useEffect(() => {
    if (!c) return;
    const previous = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % list.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.({ preventScroll: true });
    };
  }, [c, index, list.length, onChange, onClose]);

  const details = c ? [["Issued by", c.org], ["Date", c.date], ["Credential ID", c.id], ["Expires", c.expires]].filter(([, v]) => v) : [];

  return (
    <AnimatePresence>
      {c && (
        <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="lightbox-panel" role="dialog" aria-modal="true" aria-label={c.t} onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.45, ease }}>
            <div className="lightbox-img">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img key={c.img} src={certImg(c.img)} alt={`${c.t} certificate from ${c.org}`}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease }} />
              </AnimatePresence>
            </div>
            <aside className="lightbox-info">
              <button ref={closeRef} className="icon-btn lightbox-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
              <p className="mono muted">{String(index + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</p>
              <h3>{c.t}</h3>
              <dl>
                {details.map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>)}
              </dl>
              {c.skills && <ul className="tags">{c.skills.map((s) => <li key={s}>{s}</li>)}</ul>}
              {c.verify && <a className="btn btn-primary" href={c.verify} target="_blank" rel="noopener">Verify credential <ArrowUpRight size={15} /></a>}
              <div className="lightbox-nav">
                <button className="icon-btn" onClick={() => onChange((index - 1 + list.length) % list.length)} aria-label="Previous certificate"><ArrowLeft size={16} /></button>
                <button className="icon-btn" onClick={() => onChange((index + 1) % list.length)} aria-label="Next certificate"><ArrowRight size={16} /></button>
              </div>
            </aside>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// A framed certificate that tilts toward the cursor.
export function CertCard({ c, onOpen }) {
  function onMove(e) {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -10}deg`);
    e.currentTarget.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`);
  }
  function onLeave(e) {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  }
  return (
    <button className="cert" onClick={onOpen} onPointerMove={onMove} onPointerLeave={onLeave} aria-label={`View ${c.t} certificate`}>
      <span className="cert-frame"><img src={certImg(c.img)} alt="" loading="lazy" /></span>
      <span className="cert-caption">
        <strong>{c.t}</strong>
        <span className="muted">{[c.org, c.date].filter(Boolean).join(" · ")}</span>
      </span>
    </button>
  );
}
