/*=============== MOTION (motion.dev) ===============
   All animation for the case-study page. Rules this file keeps:
   - Content is visible by default. Only JS ever hides something, right before animating it in.
   - prefers-reduced-motion: nothing here runs at all.
   - Only transform and opacity are animated (plus the count-up text).
   - If the CDN fails, the page stays exactly as project.js rendered it. */
const MOTION_URL = 'https://cdn.jsdelivr.net/npm/motion@14.14.0/+esm'
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const enterEls = [...document.querySelectorAll('[data-enter]')]
const showAll = () => enterEls.forEach(el => el.style.opacity = '')

let M = null
if (!reduced) {
   try {
      M = await import(MOTION_URL) // animate, inView, scroll, stagger, hover, press
   } catch {
      showAll()                    // CDN blocked or offline: reveal the header right away
   }
}

if (M) {
   const { animate, inView, scroll, stagger, hover, press } = M

   /* Fast, subtle springs: critically damped, so nothing overshoots */
   const spring = { type: 'spring', stiffness: 520, damping: 44 }
   const easeOut = [0.16, 1, 0.3, 1]
   const below = el => el.getBoundingClientRect().top > innerHeight * 0.92

   /*----- 1. Header entrance (hidden by project.js, unless its 1s fallback already showed it) -----*/
   clearTimeout(window.caseEnterFallback)
   if (enterEls.length && enterEls.every(el => el.style.opacity === '0')) {
      animate(enterEls, { opacity: [0, 1], y: [18, 0] }, { duration: 0.6, ease: easeOut, delay: stagger(0.06) })
   } else {
      showAll()
   }

   /*----- 2. Reading progress bar -----*/
   const bar = document.createElement('div')
   bar.className = 'scroll-progress'
   bar.setAttribute('aria-hidden', 'true')
   document.body.prepend(bar)
   scroll(progress => { bar.style.transform = `scaleX(${progress})` })

   /*----- 3. Section reveals: only what starts below the fold is hidden first -----*/
   const reveal = (selector, { y = 20, each = 0 } = {}) => {
      document.querySelectorAll(selector).forEach(group => {
         const items = each ? [...group.children] : [group]
         if (!below(group)) return
         items.forEach(el => el.style.opacity = '0')
         inView(group, () => {
            animate(items, { opacity: [0, 1], y: [y, 0] }, { duration: 0.55, ease: easeOut, delay: stagger(0.07) })
         }, { margin: '0px 0px -12% 0px' })
      })
   }
   reveal('.case__stats', { each: true })
   reveal('.case__block .case__heading')
   reveal('.case__problem')
   reveal('.case__outcomes', { each: true })
   reveal('.case__quote')
   reveal('.case__pager', { each: true, y: 12 })
   reveal('.case__cta')

   /*----- 4. Stats count up when they come into view -----*/
   document.querySelectorAll('[data-count]').forEach(el => {
      const target = +el.dataset.count
      el.style.minWidth = `${el.offsetWidth}px`   // hold the final width so nothing shifts while counting
      el.textContent = '0'
      inView(el, () => {
         animate(0, target, {
            duration: 1.1,
            ease: easeOut,
            onUpdate: v => { el.textContent = Math.round(v).toLocaleString('en-US') },
         })
      }, { amount: 0.6 })
   })

   /*----- 5. "What I built": the rail fills with scroll, each step slides in -----*/
   document.querySelectorAll('.case__timeline').forEach(timeline => {
      const fill = timeline.querySelector('.case__rail-fill')
      fill.style.transform = 'scaleY(0)'
      scroll(progress => { fill.style.transform = `scaleY(${progress})` }, {
         target: timeline,
         offset: ['start 75%', 'end 55%'],
      })
      timeline.querySelectorAll('.case__build').forEach(step => {
         if (!below(step)) return
         step.style.opacity = '0'
         inView(step, () => {
            animate(step, { opacity: [0, 1], x: [-16, 0] }, { duration: 0.5, ease: easeOut })
         }, { margin: '0px 0px -15% 0px' })
      })
   })

   /*----- 6. Spring hover and press on buttons and links that act like cards -----*/
   const interactive = document.querySelectorAll('.case .button, .case__pager a')
   interactive.forEach(el => {
      let hovered = false
      const to = scale => animate(el, { scale }, spring)
      hover(el, () => {
         hovered = true
         to(1.03)
         return () => { hovered = false; to(1) }
      })
      press(el, () => {
         to(0.97)
         return () => to(hovered ? 1.03 : 1)
      })
   })
}
