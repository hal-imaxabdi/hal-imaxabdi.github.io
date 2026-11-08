import { useState } from "react";

// An optional piece of character art. If the file doesn't exist (or fails to load), it renders
// `fallback` instead (nothing, by default), so a missing image never leaves a broken icon.
// Extra props (e.g. data-art="left" for the slide-in direction) go straight onto the <img>.
export default function Art({ src, className = "", fallback = null, eager = false, ...rest }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return fallback;
  return (
    <img className={className} src={src} alt="" aria-hidden="true" decoding="async"
      loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} {...rest} />
  );
}
