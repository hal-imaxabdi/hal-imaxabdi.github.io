import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

// Register every GSAP plugin the site uses, once, before any component animates.
gsap.registerPlugin(useGSAP, ScrollTrigger);

// True when the visitor asked their system for less motion.
export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Media query used with gsap.matchMedia(): animations inside only run when motion is allowed.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// Smooth scrolling (mouse wheel and trackpad; touch keeps the phone's native scroll).
// Driven by GSAP's ticker so ScrollTrigger animations stay in step with it. Off for reduced motion.
export const lenis = typeof window !== "undefined" && !reducedMotion() ? new Lenis({ duration: 1.15, smoothWheel: true }) : null;
if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger, useGSAP };
