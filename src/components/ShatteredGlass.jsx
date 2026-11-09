import Ball3D from "./Ball3D.jsx";

/* Glass shattered by a ball: a real photo of an impact crack, turned into a blue crack-only overlay
   (public/art/shattered-glass.webp), fading out with distance from the impact. With `ball`, the 3D ball
   sits in the hole it made.
   Source photo: "Broken Glass, Smashed Glass" by Pixabay contributor, image 4024471,
   https://pixabay.com/illustrations/broken-glass-shashed-glass-4024471/ (Pixabay Content License).
   The impact point in the photo is at 57.8% / 34.2%. */
export default function ShatteredGlass({ ball = false, reduce = false, className = "" }) {
  return (
    <div className={`sg ${className}`} aria-hidden="true">
      <img src="/art/shattered-glass.webp" alt="" decoding="async" loading="lazy" />
      {ball && <span className="sg-ball"><Ball3D size={54} spin={0.4} still={reduce} /></span>}
    </div>
  );
}
