import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { caseStudies as projects } from "./src/data.js";
import { allRoutes, metaTags, pageMeta, SITE, sitemap } from "./src/seo.js";

// After the build, write one HTML file per page (each with its own title, description and
// share image), a 404 fallback for the app, a sitemap and robots.txt. GitHub Pages serves
// these as real URLs, so Google and LinkedIn see the right details for every page.
function pages() {
  let outDir = "dist";
  return {
    name: "static-pages",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async writeBundle() {
      // 1200×630 JPG previews for each project (LinkedIn doesn't reliably show WebP).
      mkdirSync(join(outDir, "og"), { recursive: true });
      for (const p of projects.filter((x) => x.img)) {
        await sharp(join("public/projects", p.img))
          .resize(1200, 630, { fit: "contain", background: "#0b0b0c" })
          .jpeg({ quality: 85 })
          .toFile(join(outDir, "og", `${p.slug}.jpg`));
      }

      const template = readFileSync(join(outDir, "index.html"), "utf8");
      const withMeta = (m) => template.replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, metaTags(m));
      for (const route of allRoutes()) {
        const m = pageMeta(route);
        const dir = join(outDir, m.path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "index.html"), withMeta(m));
      }
      writeFileSync(join(outDir, "404.html"), withMeta(pageMeta({ page: "home" })));
      writeFileSync(join(outDir, "sitemap.xml"), sitemap());
      writeFileSync(join(outDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
    },
  };
}

export default defineConfig({
  plugins: [react(), pages()],
  base: "/",
  // React + GSAP (with Draggable, Flip, ScrollTrigger, TextPlugin) is one ~480 kB bundle (~165 kB gzipped).
  build: { chunkSizeWarningLimit: 600 },
});
