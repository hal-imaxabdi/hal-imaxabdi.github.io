/*=============== DATA: projects-data.js and writeups-data.js, certificates here ===============*/
const projects = window.PROJECTS

const certs = [
   { name: 'Google Cybersecurity Professional', org: 'Google', img: 'google-cybersecurity.webp', date: 'Mar 2026', url: 'https://coursera.org/verify/professional-cert/RS5HS3738JU9' },
   { name: 'GitHub Foundations (GH-900)', org: 'GitHub', img: 'github-foundations.webp', date: 'Oct 2026' },
   { name: 'Backend AI Engineering Internship', org: 'FlyRank AI', img: 'flyrank-backend-ai.webp', date: 'Sep 2026', url: 'https://internship.flyrank.ai/verify' },
   { name: 'AWS Security Fundamentals', org: 'Amazon Web Services', img: 'aws-security.webp', date: 'Sep 2025' },
   { name: 'Information Security', org: 'freeCodeCamp', img: 'freecodecamp-infosec.webp', date: 'May 2026', url: 'https://freecodecamp.org/certification/hassmium018/information-security-v7' },
   { name: 'Google AI Professional', org: 'Google', img: 'google-ai.webp', date: 'Jun 2026', url: 'https://coursera.org/verify/professional-cert/6E9PIWPSLVA3' },
   { name: 'Pre Security Learning Path', org: 'TryHackMe', img: 'tryhackme-presecurity.webp', date: 'Feb 2026' },
   { name: 'Cybersecurity Job Simulation', org: 'Forage', img: 'forage-cyber.webp', date: 'Jan 2026' },
   { name: 'Cybersecurity Bootcamp', org: 'TechCrush', img: 'techcrush.webp', date: 'Jun 2026' },
]

const pad = n => String(n).padStart(2, '0')

/*=============== RENDER PROJECTS: A CARD DECK ===============*/
/* One big card in front, the next two stacked behind it. Swipe, drag, use the arrows
   or the arrow keys and the next project comes forward. It loops, so adding projects
   to projects-data.js never makes the section any bigger. */
const deck = document.getElementById('work-deck')
deck.innerHTML = projects.map(p => `
   <a href="project.html?p=${p.slug}" class="work__card" draggable="false">
      <img src="assets/img/projects/${p.img}" alt="" class="work__img" width="1200" height="750" loading="lazy" decoding="async" draggable="false">
      <span class="work__overlay">
         <span>
            <span class="work__name">${p.name}</span>
            <span class="work__type">${p.kicker.split(' · ')[0]}</span>
         </span>
         <span class="work__go" aria-hidden="true"><i class="ri-arrow-right-up-line"></i></span>
      </span>
   </a>`).join('')

const cards = [...deck.children]
const total = cards.length
const workCurrent = document.getElementById('work-current')
let current = 0

document.getElementById('work-total').textContent = pad(total)

/* data-pos 0 is the front card, 1 and 2 peek out behind it, the rest wait out of sight */
const layout = () => {
   cards.forEach((card, i) => {
      const pos = (i - current + total) % total
      card.dataset.pos = pos < 3 ? pos : 'rest'
      card.tabIndex = pos === 0 ? 0 : -1
      card.setAttribute('aria-hidden', pos === 0 ? 'false' : 'true')
      card.setAttribute('aria-label', `${projects[i].name}, ${i + 1} of ${total}. Open case study`)
   })
   workCurrent.textContent = pad(current + 1)
}

/* Forward: the front card flies off to the left and drops to the back.
   Back: the previous card flies in from the left. */
const go = dir => {
   if (total < 2) return
   const hadFocus = deck.contains(document.activeElement)
   if (dir > 0) {
      const leaving = cards[current]
      leaving.classList.add('is-out')
      setTimeout(() => leaving.classList.remove('is-out'), 420)
   }
   current = (current + dir + total) % total
   if (dir < 0) {
      const entering = cards[current]
      entering.style.transition = 'none'
      entering.classList.add('is-out')
      void entering.offsetWidth          // apply the off-screen start before animating in
      entering.style.transition = ''
      entering.classList.remove('is-out')
   }
   layout()
   if (hadFocus) cards[current].focus({ preventScroll: true })
}

document.getElementById('work-prev').addEventListener('click', () => go(-1))
document.getElementById('work-next').addEventListener('click', () => go(1))
deck.addEventListener('keydown', e => {
   if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
   if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
})

/* Swipe and drag (touch, pen and mouse). The card follows the finger and tilts a little;
   let go past the threshold and it moves on. A drag never counts as a click. */
let dragStart = null, dragX = 0, dragged = false
deck.addEventListener('pointerdown', e => {
   if (e.button !== 0 || !cards[current].contains(e.target)) return
   dragStart = e.clientX
   dragX = 0
   dragged = false
})
window.addEventListener('pointermove', e => {
   if (dragStart === null) return
   dragX = e.clientX - dragStart
   if (!dragged && Math.abs(dragX) > 6) { dragged = true; deck.classList.add('is-dragging') }
   if (dragged) cards[current].style.transform = `translateX(${dragX}px) rotate(${dragX / 28}deg)`
})
const endDrag = () => {
   if (dragStart === null) return
   dragStart = null
   deck.classList.remove('is-dragging')
   cards[current].style.transform = ''
   const threshold = Math.min(110, deck.offsetWidth * 0.18)
   if (dragX < -threshold) go(1)
   else if (dragX > threshold) go(-1)
}
window.addEventListener('pointerup', endDrag)
window.addEventListener('pointercancel', endDrag)
deck.addEventListener('click', e => { if (dragged) { e.preventDefault(); dragged = false } }, true)

/* Sideways trackpad swipes move the deck too; vertical scrolling is left alone */
let wheelLock = false
deck.addEventListener('wheel', e => {
   if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 25) return
   e.preventDefault()
   if (wheelLock) return
   wheelLock = true
   go(e.deltaX > 0 ? 1 : -1)
   setTimeout(() => wheelLock = false, 650)
}, { passive: false })

layout()

/*=============== RENDER WRITEUPS ===============*/
/* Same card language as the projects: one link each, the writeup itself has the detail */
const MAX_TOOLS = 3
document.getElementById('writeups-list').innerHTML = window.WRITEUPS.map(w => {
   const extra = w.tools.length - MAX_TOOLS
   return `
   <li class="writeups__slide">
      <a href="${w.link.url}" target="_blank" rel="noopener" class="writeups__card">
         <h3 class="writeups__title">${w.title}</h3>
         <p class="writeups__context">${w.context}</p>
         <div class="writeups__tools">
            ${w.tools.slice(0, MAX_TOOLS).map(t => `<span class="work__tag">${t}</span>`).join('')}
            ${extra > 0 ? `<span class="work__tag work__tag--more">+${extra}</span>` : ''}
         </div>
         <div class="writeups__foot">
            <span class="writeups__cta">${w.link.label}<span class="sr-only"> (opens in a new tab)</span></span>
            <span class="work__go" aria-hidden="true"><i class="${w.link.icon}"></i></span>
         </div>
      </a>
   </li>`
}).join('')

/*=============== RENDER CERTIFICATES ===============*/
const certsTrack = document.getElementById('certs-track')
const certCard = c => `
   <${c.url ? `a href="${c.url}" target="_blank" rel="noopener"` : 'div'} class="testimonials__card">
      <img src="assets/img/certs/${c.img}" alt="${c.name} certificate" class="testimonials__img" loading="lazy" decoding="async" width="280" height="210">
      <h3 class="testimonials__name">${c.name}</h3>
      <div class="testimonials__meta"><span>${c.org}</span><span>${c.date}</span></div>
   </${c.url ? 'a' : 'div'}>`
certsTrack.innerHTML = certs.map(certCard).join('')

/*=============== SHOW & CLOSE MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'))
if (navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'))

/*=============== REMOVE MOBILE MENU ===============*/
document.querySelectorAll('.nav__link, .nav__contact')
   .forEach(n => n.addEventListener('click', () => navMenu.classList.remove('show-menu')))

/*=============== HOME TYPED JS ===============*/
if (window.Typed) {
   document.getElementById('home-typed').textContent = ''
   new Typed('#home-typed', {
      strings: ['Software Engineering', 'Backend Development', 'Secure APIs'],
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 2000,
      loop: true,
      cursorChar: '_',
   })
} else {
   document.getElementById('home-typed').textContent = 'Software Engineering'
}

/*=============== CHANGE HEADER STYLES ===============*/
const header = document.getElementById('header')
const bgHeader = () => header.classList.toggle('bg-header', window.scrollY >= 50)
window.addEventListener('scroll', bgHeader)
bgHeader()

/*=============== SERVICES ACCORDION ===============*/
const servicesCards = document.querySelectorAll('.services__card')

const setInfoHeight = card => {
   const info = card.querySelector('.services__info')
   info.style.height = card.classList.contains('services-open') ? info.scrollHeight + 'px' : '0'
}

servicesCards.forEach(card => {
   setInfoHeight(card)
   card.querySelector('.services__button').addEventListener('click', () => {
      const isOpen = card.classList.contains('services-open')   // true or false
      servicesCards.forEach(c => { c.classList.remove('services-open'); setInfoHeight(c) }) // Close all others
      if (!isOpen) { card.classList.add('services-open'); setInfoHeight(card) }              // Open the clicked one
   })
})
window.addEventListener('resize', () => servicesCards.forEach(setInfoHeight))

/*=============== CERTIFICATES: DUPLICATE CARDS FOR INFINITE SCROLL ===============*/
;[...certsTrack.children].forEach(card => {
   const clone = card.cloneNode(true)
   clone.setAttribute('aria-hidden', 'true')
   clone.tabIndex = -1
   certsTrack.appendChild(clone)
})

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = document.getElementById('scroll-up')
window.addEventListener('scroll', () => scrollUp.classList.toggle('show-scroll', window.scrollY >= 350))

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
const scrollActive = () => {
   const scrollDown = window.scrollY
   sections.forEach(section => {
      const top = section.offsetTop - 120,
            height = section.offsetHeight,
            link = document.querySelector(`.nav__list a[href*="#${section.id}"]`)
      if (!link) return
      link.classList.toggle('active-link', scrollDown >= top && scrollDown < top + height)
   })
}
window.addEventListener('scroll', scrollActive)

/*=============== CUSTOM CURSOR ===============*/
const cursor = document.getElementById('cursor')
let mouseX = 0, mouseY = 0, cursorQueued = false

const cursorMove = () => {
   cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)` // Centers the element at the pointer
   cursorQueued = false
}
document.addEventListener('mousemove', e => {
   mouseX = e.clientX; mouseY = e.clientY
   cursor.classList.add('cursor--on')                        // Stays hidden until the mouse first moves
   if (!cursorQueued) { cursorQueued = true; requestAnimationFrame(cursorMove) } // Only redraw when the mouse moves
})

/* Hide custom cursor on links */
document.querySelectorAll('a, button').forEach(item => {
   item.addEventListener('mouseover', () => cursor.classList.add('hide-cursor'))
   item.addEventListener('mouseleave', () => cursor.classList.remove('hide-cursor'))
})

/*=============== FOOTER YEAR ===============*/
document.getElementById('year').textContent = new Date().getFullYear()

/* Scroll reveals and count-ups live in motion.js */
