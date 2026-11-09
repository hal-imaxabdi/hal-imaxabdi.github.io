import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import "./typewriter.css";

// Wraps the first occurrence of `word` (if typed so far) in <b>, so it can be coloured.
function withHighlight(text, full, word) {
  const at = word ? full.indexOf(word) : -1;
  if (at < 0 || text.length <= at) return text;
  const end = Math.min(text.length, at + word.length);
  return <>{text.slice(0, at)}<b>{text.slice(at, end)}</b>{text.slice(end)}</>;
}

/* Types each message one character at a time, holds it, deletes it, then moves to the next
   (with loop={false} it stops on the last message, fully typed).
   Every message is also rendered invisibly in the same grid cell, so the box is always the size
   of the longest one and nothing around it moves while typing.
   Screen readers get the whole current message through a polite live region.
   With reduced motion it shows `staticText` (or the first message) in full and never animates. */
export default function Typewriter({ messages, staticText, highlight, loop = true, typeSpeed = 52, deleteSpeed = 24, hold = 1900, gap = 450, startDelay = 0, className = "" }) {
  const reduce = useReducedMotion();
  const [s, setS] = useState({ i: 0, n: 0, del: false, started: startDelay === 0 });

  useEffect(() => {
    if (reduce) return;
    const msg = messages[s.i];
    // without loop, stop once the last message is fully typed
    if (!loop && s.i === messages.length - 1 && !s.del && s.n === msg.length) return;
    let delay, next;
    if (!s.started) { delay = startDelay; next = { ...s, started: true }; }
    else if (!s.del && s.n < msg.length) { delay = typeSpeed + Math.random() * 45; next = { ...s, n: s.n + 1 }; }
    else if (!s.del) { delay = hold; next = { ...s, del: true }; }
    else if (s.n > 0) { delay = deleteSpeed; next = { ...s, n: s.n - 1 }; }
    else { delay = gap; next = { i: (s.i + 1) % messages.length, n: 0, del: false, started: true }; }
    const t = setTimeout(() => setS(next), delay);
    return () => clearTimeout(t);
  }, [s, reduce, messages, loop, typeSpeed, deleteSpeed, hold, gap, startDelay]);

  const full = reduce ? staticText ?? messages[0] : messages[s.i];
  const shown = reduce ? full : full.slice(0, s.n);
  const busy = !reduce && s.started && (s.del ? s.n > 0 : s.n < full.length);

  return (
    <span className={`tw ${className}`}>
      <span className="tw-sizer" aria-hidden="true">
        {(reduce ? [full] : messages).map((m) => <span key={m}>{m}<i className="tw-caret" /></span>)}
      </span>
      <span className="tw-text" aria-hidden="true">{withHighlight(shown, full, highlight)}<i className={`tw-caret ${busy ? "" : "is-idle"}`} /></span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{s.started || reduce ? full : ""}</span>
    </span>
  );
}
