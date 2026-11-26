/*=============== CASE STUDY PAGE ===============
   Renders project.html?p=<slug> from projects-data.js:
   the problem, what I built, what it delivered and the decision behind it.
   Animation lives in motion.js; this file only builds the page. */
const projects = window.PROJECTS
const slug = new URLSearchParams(location.search).get('p')
const index = projects.findIndex(p => p.slug === slug)
const content = document.getElementById('case-content')

/* Whole numbers of 10 or more count up in motion.js; everything else is shown as written */
const statValue = value => /^\d+$/.test(value) && +value >= 10
   ? `<span class="case__stat-value" data-count="${value}">${value}</span>`
   : `<span class="case__stat-value">${value}</span>`

const block = (id, title, body) => `
   <section class="case__block" aria-labelledby="${id}">
      <h2 class="case__heading" id="${id}">${title}</h2>
      <div class="case__body">${body}</div>
   </section>`

if (index === -1) {
   document.title = 'Project not found | Halima A. Mohamed'
   content.innerHTML = `
      <div class="case__missing">
         <h1>Project not found</h1>
         <p>That project doesn't exist. <a href="index.html#work">See all projects</a>.</p>
      </div>`
} else {
   const p = projects[index]
   const prev = projects[(index - 1 + projects.length) % projects.length]
   const next = projects[(index + 1) % projects.length]
   document.title = `${p.name} case study | Halima A. Mohamed`
   document.querySelector('meta[name="description"]').content = `${p.name}: ${p.tagline} ${p.desc}`

   content.innerHTML = `
      <header class="case__intro">
         <div class="case__lead">
            <a href="index.html#work" class="case__back" data-enter><i class="ri-arrow-left-line" aria-hidden="true"></i> All projects</a>
            <p class="case__kind" data-enter>${p.kicker}</p>
            <h1 class="case__title" data-enter>${p.name}</h1>
            <p class="case__tagline" data-enter>${p.tagline}</p>
            <div class="case__tags" data-enter>${p.tags.map(t => `<span class="work__tag">${t}</span>`).join('')}</div>
            <div class="case__buttons" data-enter>
               ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" class="button">Live demo <i class="ri-external-link-line" aria-hidden="true"></i></a>` : ''}
               <a href="${GITHUB + p.repo}" target="_blank" rel="noopener" class="button${p.live ? ' button--ghost' : ''}">Code <i class="ri-github-fill" aria-hidden="true"></i></a>
            </div>
         </div>
         <figure class="case__cover" data-enter>
            <img src="assets/img/projects/${p.img}" alt="${p.name} screenshot" width="1200" height="750" fetchpriority="high">
         </figure>
      </header>

      <dl class="case__stats" aria-label="Key numbers">
         ${p.stats.map(([value, label]) => `
            <div class="case__stat">
               <dt class="case__stat-label">${label}</dt>
               <dd>${statValue(value)}</dd>
            </div>`).join('')}
      </dl>

      ${block('problem-title', 'The problem', `<p class="case__problem">${p.problem}</p>`)}

      ${block('built-title', 'What I built', `
         <ol class="case__timeline">
            ${p.built.map((step, i) => `
               <li class="case__milestone">
                  <span class="case__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
                  <p>${step}</p>
               </li>`).join('')}
         </ol>`)}

      ${block('outcome-title', 'What it delivered', `
         <ul class="case__outcomes">
            ${p.outcome.map(o => `
               <li class="case__outcome">
                  ${o.figure ? `<strong class="case__figure">${o.figure}</strong>` : '<i class="ri-check-line case__check" aria-hidden="true"></i>'}
                  <p>${o.text}</p>
               </li>`).join('')}
         </ul>`)}

      ${p.decision ? block('decision-title', 'The decision I\'d defend', `
         <blockquote class="case__quote">
            <i class="ri-double-quotes-l" aria-hidden="true"></i>
            <p>${p.decision}</p>
         </blockquote>`) : ''}

      <nav class="case__pager" aria-label="More projects">
         <a href="project.html?p=${prev.slug}"><span><i class="ri-arrow-left-line" aria-hidden="true"></i> Previous project</span><strong>${prev.name}</strong></a>
         <a href="project.html?p=${next.slug}" class="case__pager-next"><span>Next project <i class="ri-arrow-right-line" aria-hidden="true"></i></span><strong>${next.name}</strong></a>
      </nav>`

   /* Hand-off to motion.js: hide the header for its entrance, from JS only.
      If motion.js hasn't taken over within a second (slow or blocked CDN), show it anyway. */
   if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const enter = content.querySelectorAll('[data-enter]')
      enter.forEach(el => el.style.opacity = '0')
      window.caseEnterFallback = setTimeout(() => enter.forEach(el => el.style.opacity = ''), 1000)
   }
}

/*=============== MENU, HEADER, SCROLL UP, YEAR ===============*/
const navMenu = document.getElementById('nav-menu')
document.getElementById('nav-toggle').addEventListener('click', () => navMenu.classList.add('show-menu'))
document.getElementById('nav-close').addEventListener('click', () => navMenu.classList.remove('show-menu'))
document.querySelectorAll('.nav__link, .nav__contact').forEach(n => n.addEventListener('click', () => navMenu.classList.remove('show-menu')))

const header = document.getElementById('header'),
      scrollUp = document.getElementById('scroll-up')
const onScroll = () => {
   header.classList.toggle('bg-header', scrollY >= 50)
   scrollUp.classList.toggle('show-scroll', scrollY >= 350)
}
window.addEventListener('scroll', onScroll)
onScroll()

document.getElementById('year').textContent = new Date().getFullYear()

/*=============== CUSTOM CURSOR ===============*/
const cursor = document.getElementById('cursor')
let mouseX = 0, mouseY = 0, cursorQueued = false
document.addEventListener('mousemove', e => {
   mouseX = e.clientX; mouseY = e.clientY
   cursor.classList.add('cursor--on')
   if (cursorQueued) return
   cursorQueued = true
   requestAnimationFrame(() => {
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      cursorQueued = false
   })
})
document.querySelectorAll('a, button').forEach(item => {
   item.addEventListener('mouseover', () => cursor.classList.add('hide-cursor'))
   item.addEventListener('mouseleave', () => cursor.classList.remove('hide-cursor'))
})
