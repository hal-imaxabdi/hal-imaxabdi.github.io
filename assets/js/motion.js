/*=============== MOTION (motion.dev) ===============
   Scroll reveals, staggered cards, the case-study timeline and count-up numbers,
   for both index.html and project.html. Rules this file keeps:
   - Content is visible by default. Only this file hides something, right before animating it.
     If the CDN fails, this module never runs and the page stays fully visible.
   - prefers-reduced-motion: nothing here runs.
   - Only opacity and transform are animated (plus the count-up text).
   - The hero section on the homepage is never touched. */
import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@14.14.0/+esm"

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const ease = [0.16, 1, 0.3, 1]
const enterEls = [...document.querySelectorAll('[data-enter]')]

if (reduced) {
   enterEls.forEach(el => el.style.opacity = '')
} else {
   /* Only elements that start below the fold are hidden, so nothing on screen flickers at load */
   const below = el => el.getBoundingClientRect().top > innerHeight * 0.92
   const outsideHero = el => !el.closest('#home')

   /* Hand inline transform back to CSS when done, so hover lifts keep working */
   const play = (els, from, opts) =>
      animate(els, { opacity: [0, 1], ...from }, { duration: 0.5, ease, ...opts })
         .then(() => els.forEach(el => el.style.transform = ''))

   /* Fade and rise one element, or stagger the children of a group */
   const reveal = (selector, { children = false, y = 16, x = 0, step = 0.08 } = {}) => {
      document.querySelectorAll(selector).forEach(group => {
         if (!outsideHero(group) || !below(group)) return
         const items = children ? [...group.children] : [group]
         items.forEach(el => el.style.opacity = '0')
         const from = x ? { x: [x, 0] } : { y: [y, 0] }
         inView(group, () => { play(items, from, { delay: stagger(step) }) }, { margin: '0px 0px -10% 0px' })
      })
   }

   /*----- Case-study header: hidden by project.js, unless its 1s fallback already showed it -----*/
   clearTimeout(window.caseEnterFallback)
   if (enterEls.length && enterEls.every(el => el.style.opacity === '0')) {
      play(enterEls, { y: [14, 0] }, { duration: 0.55, delay: stagger(0.05) })
   } else {
      enterEls.forEach(el => el.style.opacity = '')
   }

   /*----- Homepage sections -----*/
   reveal('.section__title')
   reveal('.about__title')
   reveal('.about__data')
   reveal('.about__buttons')
   reveal('.work__row')
   reveal('.work__subtitle')
   reveal('.work__grid', { children: true })
   reveal('.writeups__grid', { children: true, step: 0.1 })
   reveal('.services__container', { children: true, step: 0.06 })
   reveal('.experience__container', { children: true })
   reveal('.skills__description')
   reveal('.skills__container', { children: true })
   reveal('.testimonials__container')
   reveal('.contact__intro')
   reveal('.contact__links', { children: true })
   reveal('.contact__cv')

   /*----- Case-study sections -----*/
   reveal('.case__stats', { children: true })
   reveal('.case__heading')
   reveal('.case__problem')
   reveal('.case__timeline', { children: true, x: -14, step: 0.12 })
   reveal('.case__outcomes', { children: true })
   reveal('.case__quote')
   reveal('.case__pager', { children: true, y: 10 })

   /*----- Numbers count up the first time they are seen -----*/
   document.querySelectorAll('[data-count]').forEach(el => {
      if (!outsideHero(el)) return
      const target = +el.dataset.count
      el.style.display = 'inline-block'
      el.style.minWidth = `${el.offsetWidth}px`   // hold the final width so nothing shifts while counting
      el.textContent = '0'
      inView(el, () => {
         animate(0, target, {
            duration: 1,
            ease,
            onUpdate: v => { el.textContent = Math.round(v).toLocaleString('en-US') },
         })
      }, { amount: 0.6 })
   })
}
