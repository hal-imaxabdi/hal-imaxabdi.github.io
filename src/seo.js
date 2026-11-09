import { caseStudies as projects, certs, me } from "./data.js";

// Page titles, descriptions and share images. Used in the browser (App.jsx) and at build time
// (vite.config.js) to write a separate HTML file per page with the right tags for Google and LinkedIn.
export const SITE = "https://hal-imaxabdi.github.io";
const SHARE_IMAGE = "/og.png";

export function pageMeta(route) {
  if (route.page === "projects") {
    const names = projects.slice(0, 4).map((p) => p.t).join(", ");
    return {
      path: "/projects/",
      title: `Projects · ${me.name}`,
      description: `Security labs and tools by ${me.name}, including ${names}.`,
      image: SHARE_IMAGE,
    };
  }
  if (route.page === "project") {
    const p = projects.find((x) => x.slug === route.slug);
    if (p) {
      return {
        path: `/projects/${p.slug}/`,
        title: `${p.t}: ${p.k} · ${me.name}`,
        description: p.d,
        image: p.img ? `/og/${p.slug}.jpg` : SHARE_IMAGE, // JPG made from the screenshot at build time
        type: "article",
      };
    }
  }
  if (route.page === "certificates") {
    return {
      path: "/certificates/",
      title: `Certificates · ${me.name}`,
      description: `${certs.length} certificates in cybersecurity and software development earned by ${me.name}, from Google, GitHub, AWS and more.`,
      image: SHARE_IMAGE,
    };
  }
  return {
    path: "/",
    title: me.name,
    description: `${me.name} is an Informatics student at President University focused on cybersecurity: SOC analysis, log investigation and network security.`,
    image: SHARE_IMAGE,
  };
}

// Every page that should exist as its own HTML file and appear in the sitemap.
// "projects" here is caseStudies, so status:"building" projects get no page and no sitemap entry.
export const allRoutes = () => [
  { page: "home" },
  { page: "projects" },
  ...projects.map((p) => ({ page: "project", slug: p.slug })),
  { page: "certificates" },
];

const abs = (path) => (path.startsWith("http") ? path : SITE + path);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// The <head> tags for one page, as an HTML string (build time).
export function metaTags(m) {
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${abs(m.path)}" />`,
    `<meta property="og:type" content="${m.type ?? "website"}" />`,
    `<meta property="og:site_name" content="${esc(me.name)}" />`,
    `<meta property="og:url" content="${abs(m.path)}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="${abs(m.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${abs(m.image)}" />`,
  ].join("\n  ");
}

// Update the same tags in the live page after client-side navigation.
export function applyMeta(m) {
  document.title = m.title;
  const set = (selector, attr, value) => {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  set('meta[name="description"]', "content", m.description);
  set('link[rel="canonical"]', "href", abs(m.path));
  set('meta[property="og:type"]', "content", m.type ?? "website");
  set('meta[property="og:url"]', "content", abs(m.path));
  set('meta[property="og:title"]', "content", m.title);
  set('meta[property="og:description"]', "content", m.description);
  set('meta[property="og:image"]', "content", abs(m.image));
  set('meta[name="twitter:title"]', "content", m.title);
  set('meta[name="twitter:description"]', "content", m.description);
  set('meta[name="twitter:image"]', "content", abs(m.image));
}

export function sitemap() {
  const urls = allRoutes().map((r) => `  <url><loc>${abs(pageMeta(r).path)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
