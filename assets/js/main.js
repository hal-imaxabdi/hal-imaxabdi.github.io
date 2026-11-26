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

/*=============== RENDER PROJECTS ===============*/
/* Three featured projects as large alternating rows, the rest as a two-column grid */
const FEATURED = ['hookline', 'dependency-compass', 'slotwise']
const caseUrl = p => `project.html?p=${p.slug}`
const tags = p => `<div class="work__tags">${p.tags.map(t => `<span class="work__tag">${t}</span>`).join('')}</div>`

/* Whole numbers of 10 or more count up in motion.js; everything else is shown as written */
const countable = value => /^\d+$/.test(value) && +value >= 10 ? ` data-count="${value}"` : ''

document.getElementById('work-featured').innerHTML = FEATURED
   .map(slug => projects.find(p => p.slug === slug))
   .map(p => {
      const [value, label] = p.stats[0]
      return `
      <article class="work__row">
         <a href="${caseUrl(p)}" class="work__media" tabindex="-1" aria-hidden="true">
            <img src="assets/img/projects/${p.img}" alt="" class="work__img" width="1200" height="750" loading="lazy" decoding="async">
         </a>
         <div class="work__body">
            <span class="work__kicker">${p.kicker}</span>
            <h3 class="work__title">${p.name}</h3>
            <p class="work__description">${p.desc}</p>
            <p class="work__stat"><strong${countable(value)}>${value}</strong> <span>${label}</span></p>
            ${tags(p)}
            <a href="${caseUrl(p)}" class="button work__button">Read case study <i class="ri-arrow-right-line" aria-hidden="true"></i><span class="sr-only">: ${p.name}</span></a>
         </div>
      </article>`
   }).join('')

document.getElementById('work-grid').innerHTML = projects
   .filter(p => !FEATURED.includes(p.slug))
   .map(p => `
      <a href="${caseUrl(p)}" class="work__card">
         <div class="work__image">
            <img src="assets/img/projects/${p.img}" alt="" class="work__img" width="1200" height="750" loading="lazy" decoding="async">
         </div>
         <div class="work__data">
            <span class="work__kicker">${p.kicker.split(' · ')[0]}</span>
            <h3 class="work__name">${p.name}</h3>
            <p class="work__summary">${p.tagline}</p>
            ${tags(p)}
            <span class="work__more">Read case study <i class="ri-arrow-right-line" aria-hidden="true"></i></span>
         </div>
      </a>`).join('')

/*=============== RENDER WRITEUPS ===============*/
document.getElementById('writeups-grid').innerHTML = window.WRITEUPS.map(w => `
   <article class="writeups__card">
      <span class="writeups__context">${w.context}</span>
      <h3 class="writeups__title">${w.title}</h3>
      <dl class="writeups__numbers">
         ${w.numbers.map(([value, label]) => `
            <div class="writeups__number">
               <dt>${label}</dt>
               <dd${countable(value)}>${value}</dd>
            </div>`).join('')}
      </dl>
      <p class="writeups__description">${w.desc}</p>
      <ul class="writeups__tools" aria-label="Tools">${w.tools.map(t => `<li class="work__tag">${t}</li>`).join('')}</ul>
      <div class="writeups__links">
         ${w.links.map((l, i) => `
            <a href="${l.url}" target="_blank" rel="noopener" class="button${i ? ' button--ghost' : ''} writeups__button">
               ${l.label} <i class="${l.label === 'Repo' ? 'ri-github-fill' : 'ri-arrow-right-up-line'}" aria-hidden="true"></i><span class="sr-only">: ${w.title} (opens in a new tab)</span>
            </a>`).join('')}
      </div>
   </article>`).join('')

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
      const top = section.offsetTop - 80,
            height = section.offsetHeight,
            link = document.querySelector(`.nav__list a[href*="#${section.id}"]`)
      if (!link) return
      link.classList.toggle('active-link', scrollDown > top && scrollDown <= top + height)
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
