/*=============== DATA: projects live in projects-data.js, certificates here ===============*/
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
const workTrack = document.getElementById('work-wrapper')
workTrack.innerHTML = projects.map(p => `
   <a href="project.html?p=${p.slug}" class="work__card">
      <div class="work__image">
         <img src="assets/img/projects/${p.img}" alt="${p.name} screenshot" class="work__img" loading="lazy" decoding="async">
      </div>
      <div class="work__data">
         <span class="work__kicker">${p.kicker.split(' · ')[0]}</span>
         <h3 class="work__name">${p.name}</h3>
         <p class="work__description">${p.tagline}</p>
         <span class="work__more">View case study <i class="ri-arrow-right-line"></i></span>
      </div>
   </a>`).join('')

/*=============== PROJECTS CAROUSEL ===============*/
/* A native scroll-snap track: swipe on phones, scroll on trackpads,
   arrows and dots on desktop. No autoplay, so cards never move on their own. */
const workPrev = document.getElementById('work-prev'),
      workNext = document.getElementById('work-next'),
      workDots = document.getElementById('work-dots')

const cardStep = () => {
   const cards = workTrack.children
   return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : workTrack.clientWidth
}
const perView = () => Math.max(1, Math.round(workTrack.clientWidth / cardStep()))
const positions = () => Math.max(1, projects.length - perView() + 1)
const currentIndex = () => Math.round(workTrack.scrollLeft / cardStep())
const goTo = i => workTrack.scrollTo({ left: i * cardStep(), behavior: 'smooth' })

const buildDots = () => {
   workDots.innerHTML = Array.from({ length: positions() }, (_, i) =>
      `<button class="work__dot" aria-label="Go to project ${i + 1}"></button>`).join('')
   ;[...workDots.children].forEach((dot, i) => dot.addEventListener('click', () => goTo(i)))
   updateCarousel()
}
const updateCarousel = () => {
   const i = currentIndex(), last = positions() - 1
   ;[...workDots.children].forEach((dot, d) => dot.classList.toggle('is-active', d === Math.min(i, last)))
   workPrev.disabled = i <= 0
   workNext.disabled = i >= last
}

workPrev.addEventListener('click', () => goTo(Math.max(0, currentIndex() - 1)))
workNext.addEventListener('click', () => goTo(Math.min(positions() - 1, currentIndex() + 1)))
let workTicking = false
workTrack.addEventListener('scroll', () => {
   if (workTicking) return
   workTicking = true
   requestAnimationFrame(() => { updateCarousel(); workTicking = false })
})
workTrack.addEventListener('keydown', e => {
   if (e.key === 'ArrowRight') { e.preventDefault(); workNext.click() }
   if (e.key === 'ArrowLeft') { e.preventDefault(); workPrev.click() }
})
let workResize
window.addEventListener('resize', () => { clearTimeout(workResize); workResize = setTimeout(buildDots, 150) })
buildDots()

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

/*=============== CONTACT EMAIL JS ===============*/
/* Create a free account at https://www.emailjs.com/ and paste your IDs below.
   Template content:  Name: {{user_name}} / Email: {{user_email}} / Message: {{user_message}}
   Until the IDs are set, the form falls back to opening the visitor's email app. */
const EMAILJS = {
   serviceID: 'service_byebz6i',
   templateID: 'template_rokzb9e',
   publicKey: 'tlTdicu14qj_du7UM',
}
const CONTACT_EMAIL = 'halimamohamedabdirizak@gmail.com'

const contactForm = document.getElementById('contact-form'),
      contactMessage = document.getElementById('contact-message')

const showMessage = text => {
   contactMessage.textContent = text
   setTimeout(() => contactMessage.textContent = '', 5000)    // Remove message after five seconds
}

contactForm.addEventListener('submit', e => {
   e.preventDefault()                                         // Prevent the page from reloading
   if (contactForm.company.value) { showMessage('Message sent successfully ✅'); contactForm.reset(); return } // Bot caught by honeypot
   const isPlaceholder = v => !v || v.startsWith('YOUR_') || v.startsWith('PASTE')
   const configured = window.emailjs && !Object.values(EMAILJS).some(isPlaceholder)

   if (!configured) {
      const f = new FormData(contactForm)
      const subject = encodeURIComponent(`Portfolio message from ${f.get('user_name')}`)
      const body = encodeURIComponent(`${f.get('user_message')}\n\n${f.get('user_name')} <${f.get('user_email')}>`)
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
      showMessage('Opening your email app… ✉️')
      return
   }

   emailjs.sendForm(EMAILJS.serviceID, EMAILJS.templateID, contactForm, EMAILJS.publicKey)
      .then(() => { showMessage('Message sent successfully ✅'); contactForm.reset() })
      .catch(() => showMessage('Message not sent (service error) ❌'))
})

/*=============== COPY EMAIL ===============*/
const copyEmail = document.getElementById('copy-email'),
      copyEmailLabel = document.getElementById('copy-email-label')

copyEmail.addEventListener('click', async () => {
   try {
      await navigator.clipboard.writeText(copyEmail.dataset.email)
      copyEmailLabel.innerHTML = '<i class="ri-check-line"></i> Copied'
   } catch {
      window.location.href = `mailto:${copyEmail.dataset.email}`  // Clipboard blocked: open the email app instead
   }
   setTimeout(() => copyEmailLabel.innerHTML = '<i class="ri-file-copy-line"></i> Copy', 2000)
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

/*=============== REVEAL ON SCROLL ===============*/
/* The hero is never hidden, so it shows the moment the page loads.
   Everything below fades in once as it scrolls into view. */
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
   const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
   }), { rootMargin: '0px 0px -10% 0px' })

   document.querySelectorAll('.section__title, .about__title, .about__data, .work__container, .services__card, .experience__item, .skills__card, .contact__form, .contact__data')
      .forEach(el => {
         if (el.getBoundingClientRect().top < innerHeight) return // Already on screen: leave it visible
         el.classList.add('reveal')
         revealObserver.observe(el)
      })
}
