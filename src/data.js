export const G = "https://github.com/hal-imaxabdi/";


export const me = {
  name: "Halima Abdirizak Mohamed",
  first: "Halima",
  last: "A. Mohamed.",
  tagline: "I read logs, investigate alerts and learn how networks break, so I can help keep them safe.",
  line: ["Cybersecurity", "SOC & blue team"],
  where: "President University · Indonesia",
  origin: "Based in Indonesia",
  status: "Open to security internships",
};

/* About section: one string per paragraph. */
export const about = [
  "I'm Halima, an international final-year Informatics (Cybersecurity) student at President University in Indonesia, focused on defensive security: reading logs, investigating alerts and spotting when something on a network is off.",
  "I've completed a SOC Analyst internship and I'm building a home SOC lab. My goal is to become a security architect who designs systems to be secure from the start.",
];
export const education = { degree: "Informatics", school: "President University, Indonesia", status: "Ongoing" };
export const interests = ["Security operations", "Network security", "Incident response", "AI security"];

/* Add a project by copying an entry. Order matters: the first three appear in the readme summary,
   and every finished project appears on the Projects page with its own case-study page.
   Images live in public/projects/. Required: t, slug, k, d, tags, cats.
   Optional (a missing field simply doesn't render its section):
     img, fit, pos          screenshot file, "contain" to avoid cropping, image focus point
     cardFit                optional: overrides fit on the Projects list only ("cover" crops to fill the card)
     gallery [..]           extra screenshots shown under the main image on the case-study page
     role, built, users     small "at a glance" facts under the project header (all optional)
     how [[title,text]]     numbered notes under the "How it works" diagram
     repo, live             links
     problem                "The problem" section
     points [[title,text]]  "Key features" cards
     flow [[name,note]]     "How it works" diagram
     stack [[group,[items]]] "Tech stack" grouped rows
     stats [[big,small]]    "Results" tiles, note = honest limitations
     skills [..]            "Skills demonstrated" tags
     status:"building"      work in progress: shown greyed in the desktop labs/ folder only,
                            with no case-study page and no sitemap entry (needs only t, slug, k, d, tags, cats) */
export const projectCats = ["Security", "Tools", "Web"];
export const projects = [
  { t:"WAF Homelab", slug:"waf-homelab", cats:["Security"],
    problem:"Does a web application firewall really stop common attacks, and what slips past it? Reading about a WAF is not the same as watching one block (or miss) a live attack.",
    flow:[["Kali", "Attacker"], ["SafeLine", "Web application firewall"], ["Apache + DVWA", "Deliberately vulnerable app"]], k:"Web application firewall", img:"waf-cover.webp", repo:"WAF-HomeLab-SafeLine", live:"",
    gallery:["waf-sqli-blocked.webp", "waf-xss-blocked.webp", "waf-dashboard.webp"],
    d:"I wanted to know whether a web application firewall really stops common attacks. I put SafeLine in front of a deliberately vulnerable app (DVWA), attacked it from Kali, and recorded what was blocked, logged or missed.",
    tags:["SafeLine","Docker","Apache","DVWA"],
    points:[["Setup","Kali (attacker), then SafeLine (the firewall), then Apache and DVWA"],
            ["What I tried","SQL injection, XSS, command injection, an HTTP flood and blocking by IP address"],
            ["Network","reverse proxy, isolated NAT network, self-signed TLS and an authentication gateway"],
            ["Documented","a step-by-step guide with images so the lab can be rebuilt"]],
    stack:[["Virtualisation",["VirtualBox"]],
           ["Attacker",["Kali Linux"]],
           ["Target",["Ubuntu Server 22.04","Apache2","PHP","MySQL","DVWA"]],
           ["Defence",["SafeLine WAF","Docker","Self-signed TLS","NAT network"]]],
    stats:[["SQL injection and XSS","blocked"],["Command injection","logged but not blocked: a gap I found and documented"],["HTTP flood","slowed down with rate limiting and an anti-bot challenge"]],
    skills:["Security lab design","WAF deployment","Reverse proxy setup","Network segmentation","Web attack and defence","System administration"] },

  { t:"Hookline", slug:"hookline", cats:["Security", "Tools"],
    k:"Chrome extension · Phishing detection", img:"hookline-summary.webp", repo:"hookline", live:"", pos:"right top",
    gallery:["hookline-links.webp", "hookline-evidence.webp"],
    d:"A Chrome extension that checks the links in your Gmail and shows why each one looks suspicious, instead of giving you a bare yes or no.",
    tags:["TypeScript","React","Manifest V3","FastAPI"],
    problem:"Link checkers often give a bare yes or no, so people never learn why a link looks suspicious and click the next one anyway. Hookline is built around explaining: every warning comes with the evidence behind it.",
    points:[["Link checks","spots fake lookalike domains, odd domain endings, too many subdomains and links that use a raw IP address"],
            ["Email checks","warns when the reply-to address doesn't match the sender, and flags urgent or password-asking wording"],
            ["Domain lookups","the backend checks the domain's age, registrar and SSL certificate"],
            ["Explains itself","every result says exactly why it was flagged"],
            ["Private","never opens the page a link leads to"]],
    flow:[["Gmail + extension", "React panel reads the email"], ["FastAPI backend", "Domain age, registrar, SSL"], ["Evidence panel", "Why each link was flagged"]],
    stack:[["Extension",["React","TypeScript","Tailwind CSS","Chrome Manifest V3"]],
           ["Backend",["Python","FastAPI"]],
           ["Domain checks",["RDAP","DNS","SSL"]],
           ["Testing",["Node unit tests","Dataset evaluation"]]],
    stats:[["76.1%","of the links it flagged were really suspicious (tested on 50,000 balanced samples)"],["40.5%","of suspicious links it caught. It only looks at the link itself, so it misses many, and I say so in the README"]],
    note:"12.7% of safe links were wrongly flagged. The README explains the limits and how to repeat the test.",
    skills:["Browser extension development","Detection logic","Explainable security","Model evaluation","Domain and network analysis","Full-stack integration"] },

  { t:"Dependency Compass", slug:"dependency-compass", cats:["Security", "Tools"],
    k:"Vulnerability triage · Web tool", img:"compass-results.webp", pos:"left top", repo:"Dependency-compass", live:"https://dependency-compass.onrender.com",
    gallery:["compass-home.webp"],
    d:"Drop in a lockfile and get a ranked fix list: actively exploited vulnerabilities first, then by severity, with the exact upgrade for each package.",
    tags:["Python","FastAPI","OSV","CISA KEV","Pytest"],
    problem:"Vulnerability scanners tend to return a long, flat list of CVEs, which doesn't tell a developer where to start. Dependency Compass answers the question they actually have: what should I fix first?",
    points:[["Three file formats","parses requirements.txt, package.json and package-lock.json"],
            ["Checks every package","looks each dependency up in the OSV vulnerability database"],
            ["Ranked fix list","actively exploited (CISA KEV) first, then by severity, then by whether a fix exists"],
            ["Exact upgrades","shows the version to upgrade to, with a copy button"],
            ["Untrusted input","uploads have size, nesting and length limits, and are scanned in memory and never stored"],
            ["Honest about gaps","dependencies it couldn't verify are listed separately, not counted as safe"]],
    flow:[["Lockfile", "requirements.txt, package.json, lockfile"], ["FastAPI", "Parse, validate, look up"], ["OSV + CISA KEV", "Rank and suggest upgrades"]],
    stack:[["Backend",["Python","FastAPI"]],
           ["Data sources",["OSV.dev","CISA KEV catalog"]],
           ["Testing",["Pytest"]],
           ["Hosting",["Render"]]],
    stats:[["100+","pytest tests"],["3","lockfile formats supported"],["In memory","uploads are scanned and never stored"]],
    note:"Hosted on Render's free tier, so the live demo can take about 30 seconds to wake up.",
    skills:["Vulnerability management","Secure file handling","API design","Backend engineering","Automated testing"] },

  { t:"SEMIS", slug:"semis", cats:["Web", "Security"],
    k:"Secure employee management system", img:"semis-dashboard.webp", pos:"25% center", repo:"SEMIS-Secure-Employee-Management-Information-System", live:"",
    gallery:["semis-payroll.webp", "semis-audit.webp", "semis-otp.webp"],
    d:"I wanted to see how the OWASP Top 10 web risks apply to real employee data, so I built an HR system for a fictional 150-person company and protected it against each one.",
    tags:["React","Node.js","Express","MongoDB","JWT","AES-256"],
    problem:"Most internal business systems are built for convenience, not security. Yet an HR system holds some of the most sensitive data a company has: salaries, national IDs, attendance and payroll. SEMIS asks how the OWASP Top 10 risks apply to that kind of data, and what it takes to defend against each one.",
    points:[["HR features","employee directory, attendance, payroll and leave across admin, HR and employee portals"],
            ["Access control","admin, HR and employee roles are checked on every protected page"],
            ["Sensitive data","salary and national ID are encrypted (AES-256) before they are stored"],
            ["Login","a one-time code sent by email as a second step, valid for 5 minutes, plus password reset and forced password change"],
            ["Activity log","records who did what, when and from which IP address, and entries can't be edited"],
            ["Other protections","defences against CSRF and XSS attacks, limits on repeated requests, account lockout and secure headers"]],
    flow:[["React", "Admin, HR and employee portals"], ["Express API", "Login, roles, validation"], ["MongoDB Atlas", "Sensitive fields encrypted"]],
    stack:[["Frontend",["React","Tailwind CSS","React Router","Chart.js"]],
           ["Backend",["Node.js","Express.js","Nodemailer"]],
           ["Database",["MongoDB Atlas","Mongoose"]],
           ["Security",["JWT","bcrypt","AES-256","Helmet.js","express-rate-limit","express-validator"]]],
    stats:[["10 / 10","OWASP Top 10 risks matched to a protection I built, listed in the README"],["Encrypted","salary and national ID are encrypted before they reach the database"]],
    skills:["Full-stack development","Secure authentication","Role-based access control","Data protection","API design","Security engineering"] },

  { t:"AuditShield", slug:"auditshield", cats:["Web", "Security"], k:"Risk & audit platform", img:"auditshield-dashboard.webp", fit:"contain", cardFit:"cover", pos:"left center", repo:"AI-Assisted-Risk-Assessment-Security-Audit-Platform", live:"",
    d:"A tool that guides someone through a security audit using the 51 controls in the NIST Cybersecurity Framework, keeps the evidence and exports a report. A local AI model explains each finding in plain language.",
    tags:["Flask","SQLite","Ollama","NIST CSF"],
    problem:"Security audits often end up scattered across spreadsheets, checklists and documents, so it is hard to see what has been assessed, what evidence exists and where the risk is. AuditShield puts the whole audit in one guided workflow.",
    points:[["The whole audit","list assets, map risks, upload evidence, record findings and export a report"],
            ["Roles","admin, auditor and auditee accounts see different parts of the audit"],
            ["Risk scoring","vulnerabilities are mapped to OWASP and CWE and scored by likelihood × impact"],
            ["Progress tracking","the 51 NIST CSF controls work as a checklist with a compliance score"],
            ["Plain-language findings","a local AI model (llama3.2 through Ollama) explains each result"]],
    flow:[["Assets & risks", "CIA ratings, likelihood × impact"], ["51 NIST controls", "Checklist and evidence"], ["Findings & report", "Local AI explains each finding"]],
    stack:[["Backend",["Python","Flask"]],
           ["Database",["SQLite"]],
           ["AI",["Ollama","llama3.2 (runs locally)"]],
           ["Frontend",["HTML","CSS","JavaScript"]],
           ["Frameworks",["NIST CSF 2.0","OWASP","CWE"]]],
    stats:[["Start to finish","from listing assets to a finished report, in one tool"],["Runs locally","the AI explanations run on your own computer, not on an outside service"]],
    skills:["Risk modelling","Audit workflow design","Secure application workflows","AI for decision support","Full-stack development"] },

  { t:"SOC Detection Lab", slug:"soc-detection-lab", status:"building", cats:["Security"],
    k:"Home SIEM lab · in progress",
    d:"Brute-forcing my own Ubuntu VM from Kali, catching it in a SIEM, and building an alert and a timeline.",
    tags:["Splunk","Wazuh","Kali","Windows"] },

  { t:"SOC Investigations", slug:"soc-investigations", status:"building", cats:["Security"],
    k:"Case write-ups · in progress",
    d:"Phishing analysis and incident investigation write-ups, in my own words.",
    tags:["Phishing","IOCs","MITRE ATT&CK"] },

];

/* Finished projects only (no status:"building"). These get case-study pages and sitemap entries. */
export const caseStudies = projects.filter((p) => p.status !== "building");

/* Add new entries at the TOP. type: "work" | "education". Optional: mode ("Remote" | "Hybrid" | "On-site"), tags. */
export const jobs = [
  { when:"Aug — Sep 2026", type:"work", role:"SOC Analyst Intern", org:"TechBiz Security Academy", mode:"Remote", tags:["Splunk","Wireshark","MITRE ATT&CK"],
    points:[["Home SOC lab.","Built a VirtualBox lab with Kali Linux and Windows VMs as the base for log analysis and investigations."],
            ["Logs and SIEM.","Analysed Linux auth logs and Windows Event IDs (4624, 4625, 4688), then ingested logs into Splunk and built dashboards and a failed-login alert."],
            ["Investigations.","Investigated phishing emails (headers, SPF, DKIM) and checked IOCs with VirusTotal and AbuseIPDB."],
            ["Capstone.","Wrote an incident report with a timeline, evidence, MITRE ATT&CK mapping and recommendations. Completed with distinction."]] },
  { when:"Sep 2026 — now", type:"work", role:"System Intern, E-Technology Program", org:"President University", mode:"On-site", tags:["Moodle","Backup & recovery"],
    points:[["Course platform.","Administer and maintain Moodle course content so online learning materials stay organized and accessible."],
            ["Backup dashboard.","Built and maintain a separate backup dashboard for course content backup and recovery, adding a second layer of protection for the program's materials."]] },
  { when:"Jul — Sep 2026", type:"work", role:"Backend AI Engineering Intern", org:"FlyRank AI", mode:"Remote", tags:["FastAPI","PostgreSQL","Midtrans"],
    points:[["Billing backend.","Built a usage-metering and billing service with FastAPI and PostgreSQL that tracks each account's usage, enforces plan quotas and calculates costs in whole cents."],
            ["Safe payments.","Added idempotency keys and HMAC-SHA512 signed webhooks with Midtrans (sandbox), so a repeated request or notification is never charged twice."],
            ["Tested.","Covered the billing flows with 68 automated tests."]] },
  { when:"Ongoing", type:"education", role:"Informatics", org:"President University, Indonesia",
    points:[["Focus.","Cybersecurity concentration: networking, security operations and secure systems."]] },
];

/* Skills section: the heading's sentence, then one tab per group. Click a tab and its skills appear in the card. */
export const skillsIntro = "Tools and concepts I've practised in internships, labs and projects.";

export const stack = [
  { title:"Security operations", items:["Splunk","Log analysis (Linux & Windows)","Windows Event IDs","Wireshark","Phishing analysis","VirusTotal","AbuseIPDB"] },
  { title:"Frameworks", items:["MITRE ATT&CK","Cyber Kill Chain","NIST incident response","OWASP Top 10","NIST CSF"] },
  { title:"Lab & infrastructure", items:["Kali Linux","Ubuntu","Windows","VirtualBox","Docker","SafeLine WAF","Nmap"] },
  { title:"Networking", items:["TCP/IP","DNS","OSI model","Ports & protocols"] },
];

/* Add new certificates here; images live in public/certs/. Optional per entry: date, id, verify (URL), skills, expires.
   status: "earned" | "in progress" (in-progress ones show as an "In development" card under All and their category tab). */
export const certCats = ["Security", "Development", "Other"];
export const certs = [
  { t:"SOC Analyst Internship", org:"TechBiz Security Academy", img:"techbiz-soc.webp", cat:"Security", status:"earned", date:"Sep 2026" },
  { t:"Google Cybersecurity Professional", org:"Google", img:"google-cybersecurity.webp", cat:"Security", status:"earned", date:"Mar 2026",
    verify:"https://coursera.org/verify/professional-cert/RS5HS3738JU9",
    skills:["Linux","SQL","Python","SIEM tools","Intrusion detection"] },
  { t:"Google AI Professional", org:"Google", img:"google-ai.webp", cat:"Development", status:"earned", date:"Jun 2026",
    verify:"https://coursera.org/verify/professional-cert/6E9PIWPSLVA3" },
  { t:"GitHub Foundations (GH-900)", org:"GitHub", img:"github-foundations.webp", cat:"Development", status:"earned", date:"Oct 2026", expires:"Oct 2028",
    id:"931F4188610219D9" },
  { t:"AWS Security Fundamentals", org:"Amazon Web Services", img:"aws-security.webp", cat:"Security", status:"earned", date:"Sep 2025" },
  { t:"Cybersecurity Analyst Job Simulation", org:"Forage", img:"forage-cyber.webp", cat:"Security", status:"earned", date:"Jan 2026",
    skills:["IAM fundamentals","IAM strategy assessment","Custom IAM solutions","Platform integration"] },
  { t:"Pre Security Learning Path", org:"TryHackMe", img:"tryhackme-presecurity.webp", cat:"Security", status:"earned", date:"Feb 2026", id:"THM-3DKLN6D21B" },
  { t:"Information Security Certification", org:"freeCodeCamp", img:"freecodecamp-infosec.webp", cat:"Security", status:"earned", date:"May 2026",
    verify:"https://freecodecamp.org/certification/hassmium018/information-security-v7" },
  { t:"TechCrush Cybersecurity Bootcamp", org:"TechCrush", img:"techcrush.webp", cat:"Security", status:"earned", date:"Jun 2026", id:"TEC-D57F85B7" },
  { t:"Backend AI Engineering Internship", org:"FlyRank AI", img:"flyrank-backend-ai.webp", cat:"Development", status:"earned", date:"Sep 2026",
    id:"FR-D11-4AF80-778F5", verify:"https://internship.flyrank.ai/verify" },
];

/* Optional "Next goals" row on the Certificates page. It only renders when this list has entries, e.g. ["ISC2 CC", "AWS Security Specialty"]. */
export const goals = [];

export const contact = {
  email:"halimamohamedabdirizak@gmail.com",
  linkedin:"https://www.linkedin.com/in/halima-abdirizak-mohamed/",
  github:"https://github.com/hal-imaxabdi",
  cv:"/assets/Halima_Abdirizak_Mohamed_CV.pdf"
};
