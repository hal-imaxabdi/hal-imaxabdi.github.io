import { useCallback, useState } from "react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Copy, Plus } from "lucide-react";
import { about, contact, education, interests, jobs, me, skillsIntro, stack } from "../data.js";
import { certImg } from "../router.js";
import { CertLightbox, earned } from "./Certs.jsx";
import { ease, GitHubIcon, LinkedInIcon, pad, Reveal, SectionTitle } from "./ui.jsx";

export function Experience() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <SectionTitle title="Experience" count={jobs.length} intro="Where I’ve put what I’ve learned into practice." />
        <ol className="xp">
          {jobs.map((j, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={j.role + j.when} className={isOpen ? "is-open" : ""} delay={i * 0.06}>
                <button className="xp-row" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                  <span className="xp-when mono">{j.when}</span>
                  <span className="xp-role">
                    <strong>{j.role}</strong>
                    <span>{[j.org, j.mode].filter(Boolean).join(" · ")}</span>
                  </span>
                  <span className="xp-type mono">{j.type === "education" ? "Education" : "Work"}</span>
                  <motion.span className="xp-toggle" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3, ease }}><Plus size={18} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div className="xp-body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}>
                      <div className="xp-inner">
                        <ul className="xp-points">
                          {j.points.map(([b, t], k) => (
                            <motion.li key={b} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + k * 0.06, duration: 0.4 }}>
                              <strong>{b}</strong> {t}
                            </motion.li>
                          ))}
                        </ul>
                        {j.tags && <ul className="tags">{j.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// Black-and-white photo that tilts toward the cursor and turns to colour on hover.
function Portrait() {
  const rx = useSpring(0, { stiffness: 200, damping: 18 });
  const ry = useSpring(0, { stiffness: 200, damping: 18 });
  function onMove(e) {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -10);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
  }
  return (
    <motion.figure className="portrait" onPointerMove={onMove} onPointerLeave={() => (rx.set(0), ry.set(0))}
      initial={{ opacity: 0, y: 40, clipPath: "inset(18% 0 0 0 round 24px)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0 round 24px)" }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 1, ease }}>
      <motion.img src="/halima.webp" alt={me.name} style={{ rotateX: rx, rotateY: ry }} loading="lazy" />
    </motion.figure>
  );
}

export function About() {
  return (
    <section className="section section-alt" id="about">
      <div className="wrap about-grid">
        <div>
          <SectionTitle title="About me" />
          <Reveal as="p" className="about-big">{about[0]}</Reveal>
          {about.slice(1).map((t, i) => <Reveal as="p" className="about-text" key={i} delay={0.05 * (i + 1)}>{t}</Reveal>)}
        </div>
        <div className="about-side">
          <Portrait />
          <Reveal as="dl" className="facts" delay={0.1}>
            <div>
              <dt className="mono">Education</dt>
              <dd><strong>{education.degree}</strong><br />{education.school}</dd>
            </div>
            <div>
              <dt className="mono">Interests</dt>
              <dd><ul className="tags">{interests.map((t) => <li key={t}>{t}</li>)}</ul></dd>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  const [tab, setTab] = useState(0);
  const group = stack[tab];
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <SectionTitle title="What I work with" intro={skillsIntro} />
        <div className="skills">
          <div className="skill-tabs" role="tablist" aria-label="Skill groups">
            {stack.map((g, i) => (
              <button key={g.title} role="tab" aria-selected={tab === i} className={`skill-tab ${tab === i ? "is-active" : ""}`} onClick={() => setTab(i)}>
                {tab === i && <motion.span layoutId="skill-tab" className="skill-tab-bg" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                <span className="mono">{pad(i + 1)}</span>
                <span className="skill-tab-label">{g.title}</span>
                <span className="mono skill-tab-count">{g.items.length}</span>
              </button>
            ))}
          </div>
          <div className="skill-card" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div key={group.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <p className="mono skill-card-head">{group.title}</p>
                <ul className="skill-chips">
                  {group.items.map((s, i) => (
                    <motion.li key={s} initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.035, duration: 0.4, ease }}>{s}</motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// Two rows of real certificate images drifting in opposite directions.
export function CertsPreview() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const rows = [earned.filter((_, i) => i % 2 === 0), earned.filter((_, i) => i % 2 === 1)];
  return (
    <section className="section certs-preview" id="certs">
      <div className="wrap">
        <SectionTitle title="Certificates" count={earned.length}
          intro="Proof of the learning behind the projects. Tap any certificate to see it full size."
          action={<a className="link-arrow" href="#/certificates">All certificates <ArrowRight size={15} /></a>} />
      </div>
      <div className="marquee">
        {rows.map((row, r) => (
          <div className={`marquee-row ${r ? "reverse" : ""}`} key={r}>
            <div className="marquee-track" style={{ animationDuration: `${Math.max(row.length, 3) * 9}s` }}>
              {[...row, ...row, ...row, ...row].map((c, k) => (
                <button key={k} className="marquee-item" onClick={() => setOpen(earned.indexOf(c))} tabIndex={k < row.length ? 0 : -1}
                  aria-hidden={k >= row.length} aria-label={`View ${c.t} certificate`}>
                  <img src={certImg(c.img)} alt="" loading="lazy" />
                  <span><strong>{c.t}</strong><span className="muted">{c.org}</span></span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <CertLightbox list={earned} index={open} onChange={setOpen} onClose={close} />
    </section>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  }

  const links = [
    { icon: <LinkedInIcon />, label: "LinkedIn", value: contact.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""), href: contact.linkedin },
    { icon: <GitHubIcon />, label: "GitHub", value: contact.github.replace(/^https:\/\//, ""), href: contact.github },
  ];

  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <SectionTitle title="Let’s connect" intro="Feel free to reach out if you’d like to collaborate, have a question, or just say hi. I’d love to hear from you." />
        <Reveal className="contact-email" delay={0.1}>
          <span className="mono">Email me</span>
          <div className="contact-email-row">
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <button className="icon-btn" onClick={copyEmail} aria-label="Copy email address">{copied ? <Check size={18} /> : <Copy size={18} />}</button>
          </div>
          <AnimatePresence>
            {copied && <motion.span className="copied mono" role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>Copied to clipboard</motion.span>}
          </AnimatePresence>
        </Reveal>
        <Reveal className="contact-list" delay={0.15}>
          {links.map((l) => (
            <a key={l.label} className="contact-item" href={l.href} target="_blank" rel="noopener">
              {l.icon}
              <div><span className="mono">{l.label}</span><span>{l.value}</span></div>
              <ArrowUpRight size={16} />
            </a>
          ))}
        </Reveal>
        <p className="copyright">© {new Date().getFullYear()} {me.name}</p>
      </div>
    </section>
  );
}
