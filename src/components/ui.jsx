import { useState } from "react";

export const pad = (n) => String(n).padStart(2, "0");

// Small tag list.
export function Tags({ items, className = "" }) {
  return <ul className={`tags ${className}`}>{items.map((t) => <li key={t}>{t}</li>)}</ul>;
}

// Copy text to the clipboard; returns [copied, copy] where copied resets after 1.6s.
export function useCopy() {
  const [copied, setCopied] = useState(false);
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  return [copied, copy];
}

// Section heading (crystal shard number + title) lives in SectionHead.jsx.
export { default as SectionHead } from "./SectionHead.jsx";
