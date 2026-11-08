import "./warp.css";

/* SECTION TRANSITION ("speed wipe")
   Clicking a player (or a nav link) doesn't scroll through every section on the way, which
   stutters on heavy pages. Instead a blue slash sweeps across showing the section's name, the
   page jumps behind it, and the slash sweeps off. Reduced motion: a short fade, no movement.
   Uses the Web Animations API, so it needs no library. */
const LABELS = {
  top: ["", "The pitch"],
  profile: ["01", "Profile"],
  intel: ["02", "Intel"],
  fieldwork: ["03", "Field Work"],
  achievements: ["04", "Achievements"],
  contact: ["05", "Contact"],
};

let el = null;
let busy = false;

function overlay() {
  if (el) return el;
  el = document.createElement("div");
  el.className = "warp";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = '<div class="warp-slab"><i></i><i></i><i></i></div><p class="warp-label"><span class="warp-num"></span><span class="warp-title"></span></p>';
  document.body.appendChild(el);
  return el;
}

const finished = (anims) => Promise.all(anims.map((a) => a.finished.catch(() => {})));

/* jump: () => void, moves the page while it's covered */
export async function warpTo(id, jump) {
  if (busy) return;
  busy = true;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const w = overlay();
  const [n, title] = LABELS[id] ?? ["", ""];
  w.querySelector(".warp-num").textContent = n;
  w.querySelector(".warp-title").textContent = title;
  const slab = w.querySelector(".warp-slab");
  const label = w.querySelector(".warp-label");
  w.classList.add("is-on");

  try {
    if (reduce) {
      await finished([w.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, fill: "forwards" })]);
      jump();
      await new Promise((r) => setTimeout(r, 60));
      await finished([w.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" })]);
    } else {
      const ease = "cubic-bezier(.7,0,.3,1)";
      await finished([
        slab.animate([{ transform: "translateX(-115%) skewX(-14deg)" }, { transform: "translateX(0) skewX(-14deg)" }], { duration: 380, easing: ease, fill: "forwards" }),
        label.animate([{ opacity: 0, transform: "translateX(-60px) skewX(-8deg)" }, { opacity: 1, transform: "translateX(0) skewX(-8deg)" }], { duration: 300, delay: 120, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }),
      ]);
      jump();
      await new Promise((r) => setTimeout(r, 140));
      await finished([
        slab.animate([{ transform: "translateX(0) skewX(-14deg)" }, { transform: "translateX(115%) skewX(-14deg)" }], { duration: 480, easing: ease, fill: "forwards" }),
        label.animate([{ opacity: 1, transform: "translateX(0) skewX(-8deg)" }, { opacity: 0, transform: "translateX(80px) skewX(-8deg)" }], { duration: 260, easing: "ease-in", fill: "forwards" }),
      ]);
    }
  } finally {
    w.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    w.classList.remove("is-on");
    busy = false;
  }
}
