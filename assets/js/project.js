/*=============== CASE STUDY PAGE ===============
   Renders project.html?p=<slug> from projects-data.js using the STAR format. */
const projects = window.PROJECTS
const slug = new URLSearchParams(location.search).get('p')
const index = projects.findIndex(p => p.slug === slug)
const content = document.getElementById('case-content')

const list = items => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`
const step = (letter, title, body, mod = '') => `
   <section class="case__step${mod}">
      <span class="case__letter" aria-hidden="true">${letter}</span>
      <div>
         <h3 class="case__step-title">${title}</h3>
         ${body}
      </div>
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
         <div>
            <a href="index.html#work" class="case__back"><i class="ri-arrow-left-line"></i> All projects</a>
            <span class="case__kicker">${p.kicker}</span>
            <h1 class="case__title">${p.name}</h1>
            <p class="case__tagline">${p.tagline}</p>
            <div class="case__tags">${p.tags.map(t => `<span class="work__tag">${t}</span>`).join('')}</div>
            <div class="case__buttons">
               ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" class="button">Live demo <i class="ri-external-link-line"></i></a>` : ''}
               <a href="${GITHUB + p.repo}" target="_blank" rel="noopener" class="button${p.live ? ' button--ghost' : ''}">View code <i class="ri-github-line"></i></a>
            </div>
         </div>
         <figure class="case__cover">
            <img src="assets/img/projects/${p.img}" alt="${p.name} screenshot" width="1200" height="750" fetchpriority="high">
         </figure>
      </header>

      <section aria-label="Key numbers" class="case__stats">
         ${p.stats.map(([value, label]) => `
            <div class="case__stat">
               <span class="case__stat-value">${value}</span>
               <span class="case__stat-label">${label}</span>
            </div>`).join('')}
      </section>

      <section aria-labelledby="star-title">
         <h2 class="case__heading" id="star-title">How it <span>went</span></h2>
         <div class="case__star">
            ${step('S', 'Situation', `<p>${p.situation}</p>`)}
            ${step('T', 'Task', `<p>${p.task}</p>`)}
            ${step('A', 'Action', list(p.action), ' case__step--action')}
            ${step('R', 'Result', list(p.result), ' case__step--result')}
         </div>
      </section>

      ${p.takeaway ? `<p class="case__takeaway"><strong>// Key takeaway</strong>${p.takeaway}</p>` : ''}

      <nav class="case__pager" aria-label="More projects">
         <a href="project.html?p=${prev.slug}"><span>← Previous project</span><strong>${prev.name}</strong></a>
         <a href="project.html?p=${next.slug}" class="case__pager-next"><span>Next project →</span><strong>${next.name}</strong></a>
      </nav>

      <section class="case__cta">
         <h2>Hiring for a security or backend role?</h2>
         <p>I'd be glad to walk you through this project in more depth.</p>
         <a href="index.html#contact" class="button">Get in touch <i class="ri-arrow-right-line"></i></a>
      </section>`
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
