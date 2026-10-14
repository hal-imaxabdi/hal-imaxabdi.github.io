# Halima's portfolio

The website is the `site/` folder (plain HTML/CSS/JS, nothing to install to view it).

**Preview locally:** `cd site && python3 -m http.server 8000`, then open http://localhost:8000

**Live site:** https://hal-imaxabdi.github.io/halima_portfolio/ (deploys automatically on every push to `main`)

## Edit content
Text, projects, jobs, skills and certificates are in `src/data.js`. After editing, run once:

    npm install
    npm run build

That regenerates `site/app.js`. Commit and push, and GitHub redeploys.

## Images
Projects: `site/assets/img/` · Certificates: `site/assets/certs/` (file names are the `img` fields in `src/data.js`) · Video: `site/assets/hero.mp4`
