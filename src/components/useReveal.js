import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "../gsap.js";

// Scroll animations for the home page. Reduced motion (or JavaScript failing): everything is simply visible.
//   (section headers and the Profile section animate with Framer Motion instead)
//   [data-art]     character art slides in from its side (data-art="left" | "right"), then drifts (parallax)
//   [data-reveal]  everything else rises and fades in, staggered, once
export function useReveal(scope) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const root = scope.current;

      gsap.utils.toArray("[data-art]", root).forEach((el) => {
        const dir = el.dataset.art === "left" ? -1 : 1;
        const section = el.closest("section") ?? el.parentElement;
        gsap.from(el, { xPercent: 22 * dir, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 70%", once: true } });
        gsap.to(el, { yPercent: -7, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });

      const els = gsap.utils.toArray("[data-reveal]", root);
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: 36 });
      ScrollTrigger.batch(els, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.09, overwrite: true }),
      });
    });
  }, { scope });
}
