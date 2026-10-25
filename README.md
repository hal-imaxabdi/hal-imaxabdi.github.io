# Halima — portfolio

Monochrome editorial portfolio. React + esbuild, deployed to GitHub Pages from the `site/` folder.
Routes use the URL hash (`#/projects/auditshield`), so every page has a real link and nothing needs server rules.

Order: Home · About · Projects · Skills · Experience · Certificates · Connect

## Run it
```
npm install
npm run build          # bundles src/ into site/app.js
npx serve site         # or: python3 -m http.server -d site
```

## Edit content (everything lives in `src/data.js`)
- **Add a project:** copy an entry in `projects`. Required: `t` (name), `slug` (URL), `k`, `d`, `tags`, `cats`.
  Optional: `img`, `repo`, `live`, `problem`, `approach`, `flow`, `points`, `stats`, `note`, `status`, `fit`, `pos`.
  Optional fields that are missing simply don't render. Put the screenshot in `site/assets/img/`.
  The card, case-study page, filters and previous/next links are generated automatically.
- **Add a certificate:** add an entry to `certs` (image in `site/assets/certs/`). Optional: `date`, `verify`, `skills`.
  Use `status:"in progress"` to keep one off the page until it's earned.
- **Add experience or education:** add an entry at the top of `jobs`.
- **Skills, About, contact links:** `stack`, `about`/`interests`, `contact`.

## Design rules
White, greys and black only (tokens at the top of `site/style.css`). Screenshots and certificates are shown in greyscale.
Fonts are self-hosted: Inter (variable) and JetBrains Mono.
