import { motion } from "framer-motion";
import { img } from "../router.js";

// A project screenshot inside minimal browser chrome. Honours the data's fit / cardFit / pos fields.
export default function Shot({ p, src, card = false, eager = false, style, className = "" }) {
  const file = src ?? p.img;
  const fit = (card && p.cardFit) || p.fit || "cover";
  const host = p.live ? new URL(p.live).host : `github.com/hal-imaxabdi/${p.repo ?? p.slug}`;
  return (
    <div className={`shot ${className}`}>
      <div className="shot-bar" aria-hidden="true">
        <span className="dots"><i /><i /><i /></span>
        <span className="shot-url mono">{host}</span>
      </div>
      <div className={`shot-view fit-${fit}`}>
        {file ? (
          <motion.img
            src={img(file)}
            alt={`${p.t} screenshot`}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            style={{ objectPosition: p.pos, ...style }}
          />
        ) : (
          <span className="shot-placeholder">{p.t}</span>
        )}
      </div>
    </div>
  );
}
