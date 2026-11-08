import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Close } from "./Icons.jsx";
import { certs, goals } from "../data.js";
import { certImg } from "../router.js";
import { pad, Tags } from "./ui.jsx";

export const earned = certs.filter((c) => (c.status || "earned") === "earned");

// The certificate image, or a quiet placeholder if the file is missing (e.g. not uploaded yet).
export function CertImage({ c, alt = "" }) {
  const [broken, setBroken] = useState(!c.img);
  if (broken) {
    return (
      <span className="cert-missing">
        <span className="cert-missing-mark" aria-hidden="true">CERT</span>
        <span className="mono">{c.org}</span>
      </span>
    );
  }
  return <img src={certImg(c.img)} alt={alt} loading="lazy" decoding="async" onError={() => setBroken(true)} />;
}

export function CertCard({ c, onOpen }) {
  return (
    <button className="cert card" onClick={onOpen} aria-label={`View ${c.t} certificate`}>
      <span className="cert-frame"><CertImage c={c} /></span>
      <span className="cert-caption">
        <strong>{c.t}</strong>
        <span className="mono">{[c.org, c.date].filter(Boolean).join(" · ")}</span>
      </span>
    </button>
  );
}

// Full-size certificate with its details. Arrow keys step through `list`, Esc closes.
export function CertLightbox({ list, index, onChange, onClose }) {
  const c = index == null ? null : list[index];
  const closeRef = useRef(null);

  useEffect(() => {
    if (!c) return;
    const previous = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      if (e.key === "ArrowRight") onChange((index + 1) % list.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey, true);
    document.body.classList.add("no-scroll");
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.classList.remove("no-scroll");
      previous?.focus?.({ preventScroll: true });
    };
  }, [c, index, list.length, onChange, onClose]);

  if (!c) return null;
  const details = [["Issued by", c.org], ["Date", c.date], ["Credential ID", c.id], ["Expires", c.expires]].filter(([, v]) => v);

  return (
    <div className="lightbox" data-lenis-prevent onClick={onClose}>
      <div className="lightbox-panel card" role="dialog" aria-modal="true" aria-label={c.t} onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-img"><CertImage c={c} alt={`${c.t} certificate from ${c.org}`} /></div>
        <aside className="lightbox-info">
          <button ref={closeRef} className="icon-btn lightbox-close" onClick={onClose} aria-label="Close">
            <Close size={18} />
          </button>
          <p className="mono dim">{pad(index + 1)} / {pad(list.length)}</p>
          <h3>{c.t}</h3>
          <dl>{details.map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>)}</dl>
          {c.skills && <Tags items={c.skills} />}
          {c.verify && (
            <a className="btn btn-primary" href={c.verify} target="_blank" rel="noopener">
              verify credential <ArrowUpRight size={16} />
            </a>
          )}
          <div className="lightbox-nav">
            <button className="icon-btn" onClick={() => onChange((index - 1 + list.length) % list.length)} aria-label="Previous certificate">
              <ArrowLeft size={18} />
            </button>
            <button className="icon-btn" onClick={() => onChange((index + 1) % list.length)} aria-label="Next certificate">
              <ArrowRight size={18} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Grid of earned certificates with optional category filters, the lightbox and the "next up" goals row.
export function CertGrid({ filters = false, cats = [] }) {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const tabs = ["All", ...cats.filter((x) => earned.some((c) => c.cat === x))];
  const shown = earned.filter((c) => cat === "All" || c.cat === cat);
  const inProgress = certs.filter((c) => c.status === "in progress" && (cat === "All" || c.cat === cat));

  return (
    <>
      {filters && tabs.length > 2 && (
        <div className="tabs" role="group" aria-label="Filter certificates">
          {tabs.map((t) => (
            <button key={t} className="tab" aria-pressed={cat === t} onClick={() => setCat(t)}>
              {t} <span className="mono">{earned.filter((c) => t === "All" || c.cat === t).length}</span>
            </button>
          ))}
        </div>
      )}
      <ul className="cert-grid">
        {shown.map((c, i) => <li key={c.t}><CertCard c={c} onOpen={() => setOpen(i)} /></li>)}
        {inProgress.map((c) => (
          <li key={c.t}>
            <div className="cert card is-building">
              <span className="cert-frame"><span className="mono">in progress</span></span>
              <span className="cert-caption"><strong>{c.t}</strong><span className="mono">{c.org}</span></span>
            </div>
          </li>
        ))}
      </ul>
      {goals.length > 0 && (
        <div className="goals">
          <h3 className="mono">next up</h3>
          <Tags items={goals} />
        </div>
      )}
      <CertLightbox list={shown} index={open} onChange={setOpen} onClose={close} />
    </>
  );
}
