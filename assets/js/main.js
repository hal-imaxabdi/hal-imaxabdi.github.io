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

/*=============== RENDER PROJECTS: STACKED CARDS ===============*/
/* Each project is a card that fills the screen: a dark lit panel with the screenshot
   floating in it. Scrolling brings the next card up over it
   (CSS position: sticky); motion.js shrinks and dims the card underneath.
   Adding a project to projects-data.js simply adds one more card to the stack. */
const stack = document.getElementById('work-stack')
stack.innerHTML = projects.map((p, i) => `
   <li class="work__item" style="--i: ${i}">
      <a href="project.html?p=${p.slug}" class="work__card">
         <span class="work__shot"><img src="assets/img/projects/${p.img}" alt="" class="work__img" width="1200" height="750" loading="${i ? 'lazy' : 'eager'}" decoding="async"></span>
         <span class="work__body">
            <span class="work__index">${pad(i + 1)} / ${pad(projects.length)}</span>
            <span class="work__name">${p.name}</span>
            <span class="work__line">${p.tagline}</span>
            <span class="work__cta">View case study <i class="ri-arrow-right-up-line" aria-hidden="true"></i></span>
         </span>
      </a>
   </li>`).join('')

/*=============== RENDER WRITEUPS ===============*/
/* A simple list: what it is, one short line, and an arrow. The whole row is the link */
document.getElementById('writeups-list').innerHTML = window.WRITEUPS.map(w => `
   <li>
      <a href="${w.link.url}" target="_blank" rel="noopener" class="writeups__row" aria-label="${w.title}: ${w.link.label} (opens in a new tab)">
         <span class="writeups__text">
            <span class="writeups__title">${w.title}</span>
            <span class="writeups__note">${w.note}</span>
         </span>
         <span class="writeups__go" aria-hidden="true"><i class="${w.link.icon}"></i></span>
      </a>
   </li>`).join('')

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
