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

/*=============== RENDER PROJECTS ===============*/
/* One swipeable row of large cards, in projects-data.js order.
   Adding a project adds a card; the layout never gets more crowded. */
const workTrack = document.getElementById('work-track')
/* The screenshot is the card. Only the name and what it is sit on top; the case study has the rest */
workTrack.innerHTML = projects.map(p => `
   <li class="work__slide">
      <a href="project.html?p=${p.slug}" class="work__card" draggable="false">
         <img src="assets/img/projects/${p.img}" alt="" class="work__img" width="1200" height="750" loading="lazy" decoding="async" draggable="false">
         <div class="work__overlay">
            <div>
               <h3 class="work__name">${p.name}</h3>
               <p class="work__type">${p.kicker.split(' · ')[0]}</p>
            </div>
            <span class="work__go" aria-hidden="true"><i class="ri-arrow-right-up-line"></i></span>
         </div>
      </a>
   </li>`).join('')

/*=============== PROJECTS: SWIPE, DRAG, ARROWS ===============*/
/* Native scroll-snap does the swiping on touch screens and trackpads.
   On desktop the row can also be dragged with the mouse, or moved with the arrows. */
const workPrev = document.getElementById('work-prev'),
      workNext = document.getElementById('work-next'),
      workCurrent = document.getElementById('work-current'),
      workBar = document.getElementById('work-bar')
const slides = [...workTrack.children]
document.getElementById('work-total').textContent = pad(slides.length)

const slideStep = () => slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : workTrack.clientWidth
const maxScroll = () => workTrack.scrollWidth - workTrack.clientWidth
const slideIndex = () => Math.min(slides.length - 1, Math.round(workTrack.scrollLeft / slideStep()))
const goToSlide = i => workTrack.scrollTo({ left: Math.max(0, Math.min(i, slides.length - 1)) * slideStep(), behavior: 'smooth' })

const updateWork = () => {
   const atEnd = workTrack.scrollLeft >= maxScroll() - 4
   const progress = maxScroll() > 0 ? workTrack.scrollLeft / maxScroll() : 1
   workCurrent.textContent = pad(atEnd ? slides.length : slideIndex() + 1)
   workBar.style.transform = `scaleX(${Math.max(1 / slides.length, progress)})`
   workPrev.disabled = workTrack.scrollLeft <= 4
   workNext.disabled = atEnd
}
workPrev.addEventListener('click', () => goToSlide(slideIndex() - 1))
workNext.addEventListener('click', () => goToSlide(slideIndex() + 1))
let workTicking = false
workTrack.addEventListener('scroll', () => {
   if (workTicking) return
   workTicking = true
   requestAnimationFrame(() => { updateWork(); workTicking = false })
})
window.addEventListener('resize', updateWork)
updateWork()

/* Mouse drag. A drag of more than a few pixels cancels the click, so dragging never opens a project */
let drag = null, dragged = false
workTrack.addEventListener('pointerdown', e => {
   if (e.pointerType !== 'mouse' || e.button !== 0) return
   drag = { x: e.clientX, left: workTrack.scrollLeft }
   dragged = false
})
window.addEventListener('pointermove', e => {
   if (!drag) return
   const dx = e.clientX - drag.x
   if (!dragged && Math.abs(dx) > 6) { dragged = true; workTrack.classList.add('is-dragging') }
   if (dragged) workTrack.scrollLeft = drag.left - dx
})
window.addEventListener('pointerup', () => {
   if (!drag) return
   drag = null
   if (!dragged) return
   workTrack.classList.remove('is-dragging')
   goToSlide(slideIndex())
})
workTrack.addEventListener('click', e => { if (dragged) { e.preventDefault(); dragged = false } }, true)

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
