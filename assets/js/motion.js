/*=============== MOTION (motion.dev + Lenis) ===============
   Smooth scrolling, a reading-progress line, headings that rise in word by word,
   staggered cards and count-up numbers, for index.html and project.html.
   Rules this file keeps:
   - Content is visible by default. Only this file hides something, right before animating it.
     If the CDN fails, this module never runs and the page stays fully visible.
   - prefers-reduced-motion: no smooth scrolling and no animation at all.
   - The hero section on the homepage is never touched. */
import { animate, inView, stagger, scroll } from "https://cdn.jsdelivr.net/npm/motion@14.14.0/+esm"

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const ease = [0.16, 1, 0.3, 1]
const enterEls = [...document.querySelectorAll('[data-enter]')]

if (reduced) {
   enterEls.forEach(el => el.style.opacity = '')
} else {
   /*----- Smooth, weighted scrolling. Loaded separately so a failure here never blocks the rest -----*/
   import("https://cdn.jsdelivr.net/npm/lenis@1.3.28/+esm")
      .then(({ default: Lenis }) => {
         new Lenis({ autoRaf: true, lerp: 0.09, anchors: true }) // anchors honour the CSS scroll-padding under the fixed header
      })
      .catch(() => {})

   /*----- Reading progress along the top edge -----*/
   const bar = document.createElement('div')
   bar.className = 'scroll-progress'
   bar.setAttribute('aria-hidden', 'true')
   document.body.prepend(bar)
   scroll(progress => { bar.style.transform = `scaleX(${progress})` })

   /* Only what starts below the fold is hidden, so nothing on screen flickers at load */
   const below = el => el.getBoundingClientRect().top > innerHeight * 0.92
   const outsideHero = el => !el.closest('#home')
   const watch = (el, run) => inView(el, () => { run() }, { margin: '0px 0px -12% 0px' })

   /* Hand inline styles back to CSS when done, so hover effects keep working */
   const play = (els, from, opts) =>
      animate(els, { opacity: [0, 1], ...from }, { duration: 0.7, ease, ...opts })
         .then(() => els.forEach(el => { el.style.transform = ''; el.style.filter = '' }))

   const reveal = (selector, from, { children = false, step = 0.08, duration } = {}) => {
      document.querySelectorAll(selector).forEach(group => {
         if (!outsideHero(group) || !below(group)) return
         const items = children ? [...group.children] : [group]
         items.forEach(el => el.style.opacity = '0')
         watch(group, () => play(items, from, { delay: stagger(step), ...(duration && { duration }) }))
      })
   }

   /*----- Headings rise in word by word, out of a soft blur -----*/
   const splitWords = heading => {
      const walk = node => [...node.childNodes].forEach(child => {
         if (child.nodeType === Node.ELEMENT_NODE) return walk(child)
         if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) return
         const frag = document.createDocumentFragment()
         child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return
            if (/^\s+$/.test(part)) return frag.append(part)
            const word = document.createElement('span')
            word.className = 'split-word'
            word.textContent = part
            frag.append(word)
         })
         child.replaceWith(frag)
      })
      walk(heading)
      return [...heading.querySelectorAll('.split-word')]
   }
   document.querySelectorAll('.section__title, .about__title').forEach(heading => {
      if (!outsideHero(heading) || !below(heading)) return
      const words = splitWords(heading)
      words.forEach(w => w.style.opacity = '0')
      watch(heading, () => play(words, { y: ['0.55em', 0], filter: ['blur(10px)', 'blur(0px)'] }, { duration: 0.8, delay: stagger(0.06) }))
   })

   /*----- Case-study header: hidden by project.js, unless its 1s fallback already showed it -----*/
   clearTimeout(window.caseEnterFallback)
   if (enterEls.length && enterEls.every(el => el.style.opacity === '0')) {
      play(enterEls, { y: [18, 0], filter: ['blur(6px)', 'blur(0px)'] }, { duration: 0.8, delay: stagger(0.06) })
   } else {
      enterEls.forEach(el => el.style.opacity = '')
   }

   /*----- Homepage -----*/
   reveal('.about__data', { y: [24, 0] })
   reveal('.about__buttons', { y: [16, 0] })
   reveal('.work__track', { x: [80, 0], scale: [0.94, 1] }, { children: true, step: 0.09, duration: 0.9 })
   reveal('.work__controls', { y: [12, 0] })
   reveal('.writeups__list', { y: [48, 0], scale: [0.96, 1] }, { children: true, step: 0.1, duration: 0.8 })
   reveal('.services__container', { y: [32, 0] }, { children: true, step: 0.07 })
   reveal('.experience__container', { y: [32, 0] }, { children: true, step: 0.12 })
   reveal('.skills__description', { y: [16, 0] })
   reveal('.skills__container', { y: [40, 0] }, { children: true, step: 0.1 })
   reveal('.testimonials__container', { y: [24, 0] })
   reveal('.contact__intro', { y: [16, 0] })
   reveal('.contact__links', { y: [24, 0], scale: [0.8, 1] }, { children: true, step: 0.08 })

   /*----- Case-study page -----*/
   reveal('.case__stats', { y: [24, 0] }, { children: true })
   reveal('.case__problem', { y: [24, 0] })
   reveal('.case__timeline', { x: [-24, 0] }, { children: true, step: 0.12 })
   reveal('.case__outcomes', { y: [32, 0], scale: [0.96, 1] }, { children: true, step: 0.1 })
   reveal('.case__quote', { y: [24, 0], filter: ['blur(8px)', 'blur(0px)'] })
   reveal('.case__pager', { y: [16, 0] }, { children: true })

   /*----- Numbers count up the first time they are seen -----*/
   document.querySelectorAll('[data-count]').forEach(el => {
      if (!outsideHero(el)) return
      const target = +el.dataset.count
      el.style.display = 'inline-block'
      el.style.minWidth = `${el.offsetWidth}px`   // hold the final width so nothing shifts while counting
      el.textContent = '0'
      inView(el, () => {
         animate(0, target, {
            duration: 1.2,
            ease,
            onUpdate: v => { el.textContent = Math.round(v).toLocaleString('en-US') },
         })
      }, { amount: 0.6 })
   })
}
