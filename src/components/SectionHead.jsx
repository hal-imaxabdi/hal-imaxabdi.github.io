import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import "./sechead.css";

const pad = (n) => String(n).padStart(2, "0");
const EASE = [0.22, 1, 0.36, 1];

/* A "crystal shard" number: blue gradient fill, lighter facet planes and lines clipped to the
   digits, a thin ice edge, and a soft glow (CSS). Pure SVG, so it scales with no image. */
export function ShardNumber({ n }) {
  const uid = useId().replace(/:/g, "");
  const txt = { x: 14, y: 112, fontSize: 132, className: "shard-text", transform: "skewX(-12)" };
  return (
    <svg className="shard" viewBox="0 0 132 120" aria-hidden="true">
      <defs>
        <linearGradient id={`sg${uid}`} x1="0" y1="0" x2=".35" y2="1">
          <stop offset="0" stopColor="#d6ecff" />
          <stop offset=".42" stopColor="#5aa2ff" />
          <stop offset="1" stopColor="#1f6bff" />
        </linearGradient>
        <clipPath id={`sc${uid}`}><text {...txt}>{pad(n)}</text></clipPath>
      </defs>
      <text {...txt} fill={`url(#sg${uid})`}>{pad(n)}</text>
      <g clipPath={`url(#sc${uid})`} className="shard-facets">
        <polygon points="0,0 95,0 30,58" className="lite" />
        <polygon points="96,120 140,44 140,120" className="lite" />
        <polygon points="40,120 92,30 120,120" className="dark" />
        <path d="M0 58 L140 18 M30 58 L92 30 L140 44 M92 30 L95 0 M60 120 L92 30 M0 92 L140 70" />
      </g>
      <text {...txt} className="shard-text shard-edge">{pad(n)}</text>
    </svg>
  );
}

// Section heading: the shard number followed by the italic uppercase title.
export default function SectionHead({ n, title, id }) {
  const reduce = useReducedMotion();
  const show = reduce ? {} : { initial: "off", whileInView: "on", viewport: { once: true, margin: "0px 0px -12% 0px" } };
  return (
    <motion.header className="sec-head" {...show}>
      <motion.span className="sec-num" variants={{ off: { opacity: 0, x: -40, skewX: -12 }, on: { opacity: 1, x: 0, skewX: 0 } }} transition={{ duration: 0.8, ease: EASE }}>
        <ShardNumber n={n} />
      </motion.span>
      <motion.h2 className="sec-title" id={id} variants={{ off: { opacity: 0, y: 30 }, on: { opacity: 1, y: 0 } }} transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}>
        {title}
      </motion.h2>
    </motion.header>
  );
}
