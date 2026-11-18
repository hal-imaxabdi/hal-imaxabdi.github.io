export const G = "https://github.com/hal-imaxabdi/";


export const me = {
  name: "Halima Abdirizak Mohamed",
  first: "Halima",
  last: "A. Mohamed.",
  tagline: "I build backend systems, secure them, and detect what gets through.",
  line: ["Backend development", "Application security & security operations"],
  where: "President University · Indonesia",
  origin: "Based in Indonesia",
  status: "Open to internships",
};

/* About section: one string per paragraph. */
export const about = [
  "I'm Halima, an international Informatics (Cybersecurity) student at President University in Indonesia. I work between backend development and security: I build APIs and the tools around them, then test and monitor them the way an attacker or an analyst would.",
  "My backend work is mostly Python, FastAPI and PostgreSQL. On the security side I write detection rules, read logs and run small home labs and CTF challenges. In the long run, I'd like to help build systems that are secure from the start.",
];
export const education = { degree: "Informatics", school: "President University, Indonesia", status: "Ongoing" };

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
export const projects = [
  { t:"Hookline", slug:"hookline", cats:["Security", "Tools"],
    k:"Chrome extension · Phishing and scam detection", img:"hookline-gmail-three-verdicts.webp", repo:"hookline", live:"https://hal-imaxabdi.github.io/hookline/demo/", pos:"center top",
    gallery:["hookline-demo-scam-xray.webp", "hookline-gmail-phishing.webp"],
    d:"A Chrome extension that flags phishing, fake job offers and fake online shops in Gmail and on web pages, and explains each warning in plain language so you learn to spot the next one yourself.",
    tags:["TypeScript","React","Chrome Manifest V3"],
    problem:"Scammers target students and job seekers with fake internships, look-alike login pages and shops that seem too good to be true. Most tools either stay silent or block something without saying why, so people never learn what gave it away. Hookline explains every warning, and each one comes from a documented rule.",
    points:[["Phishing","look-alike domains such as paypa1.com, a sender pretending to be a brand, requests for your password"],
            ["Fake jobs","fees to get hired, moving the chat to Telegram or WhatsApp, offers with no interview, high pay for no experience"],
            ["Fake shops","80–90% discounts, payment only by crypto or gift cards, no contact details, countdown pressure"],
            ["Explains each result","a verdict with the scam type, numbered warning signs tied to its 47 documented rules, and what to do next; in the demo, Scam X-ray highlights the exact words"],
            ["Private","everything runs in the browser, and nothing you read is sent anywhere"]],
    flow:[["Gmail or web page", "Extension reads the message or page"], ["47 documented rules", "Phishing, fake-job and fake-shop checks in the browser"], ["Side panel", "Verdict, warning signs, what to do next"]],
    stack:[["Extension",["TypeScript","React","Chrome Manifest V3"]],
           ["Build",["webpack","Tailwind CSS"]],
           ["Evaluation data",["Kaggle Phishing Site URLs","PhiUSIIL","EMSCAD job ads"]],
           ["Testing",["Unit tests","Held-out test split, run once"]]],
    stats:[["98–99%","precision on phishing URLs: when it warns, it is almost always right (Kaggle and PhiUSIIL test sets, 25,000 URLs per class)"],["24–26%","of phishing URLs caught, with 0.2–0.5% of safe URLs wrongly flagged"],["6.2%","of fake job ads caught, at 82% precision and 0.1% false alarms (EMSCAD: 451 fake and 8,494 real ads)"]],
    note:"Hookline misses most phishing links, so \"No warning signs found\" never means safe. The rules only read the URL and text, and the shopping-scam rules have no public dataset to test against, so no number is claimed for them. Version 1.0 reported 40.5% recall because of an evaluation bug; the honest baseline was about 12%. The results page documents the fix and how to repeat every test.",
    skills:["Browser extension development","Detection logic","Explainable security","Evaluation and measurement","Frontend development"] },

  { t:"Dependency Compass", slug:"dependency-compass", cats:["Security", "Tools"],
    k:"Vulnerability triage · Web app, CLI and GitHub Action", img:"compass-results.webp", pos:"left top", repo:"Dependency-compass", live:"https://dependency-compass.onrender.com",
    gallery:["compass-home.webp"],
    d:"Drop in a lockfile and get a ranked fix list: actively exploited vulnerabilities first, then by severity, with one upgrade per package that fixes everything it can.",
    tags:["Python","FastAPI","OSV","CISA KEV","Pytest","GitHub Actions"],
    problem:"Vulnerability scanners tend to return a long, flat list of CVEs, which doesn't tell a developer where to start. Dependency Compass answers the question they actually have: what should I fix first?",
    points:[["Lockfiles it reads","package-lock.json, requirements.txt and composer.lock"],
            ["Checks every package","looks each dependency up in the OSV vulnerability database"],
            ["Ranked fix list","actively exploited (CISA KEV) first, then by severity"],
            ["One upgrade per package","suggests a single version that fixes every advisory it can"],
            ["Three ways to run it","in the browser, from the command line, or as a GitHub Action that fails the build"],
            ["Untrusted input","uploads have size, nesting and length limits, and are scanned in memory and never stored"],
            ["Honest about gaps","dependencies it couldn't check are listed separately, not counted as safe"]],
    flow:[["Lockfile", "npm, pip or Composer"], ["Scanner", "Parse, validate, look up"], ["OSV + CISA KEV", "Rank and suggest upgrades"]],
    stack:[["Backend",["Python","FastAPI"]],
           ["Data sources",["OSV.dev","CISA KEV catalog"]],
           ["Delivery",["Web app","CLI","GitHub Action"]],
           ["Testing",["Pytest","GitHub Actions CI"]],
           ["Hosting",["Render"]]],
    stats:[["208","automated tests, run in CI"],["3","ways to use it: web app, CLI and GitHub Action"],["In memory","uploads are scanned and never stored"]],
    note:"Hosted on Render's free tier, so the live demo can take about 30 seconds to wake up.",
    skills:["Vulnerability management","Secure file handling","API design","Backend engineering","CI/CD","Automated testing"] },

  { t:"Splunk BOTS v1 Investigation", slug:"splunk-bots-v1", cats:["Security"],
    k:"Splunk SIEM · Incident investigation", img:"splunk-process-chain.webp", pos:"left top", repo:"splunk-bots-v1-investigation", live:"",
    gallery:["splunk-bruteforce.webp", "splunk-encrypted-files.webp"],
    d:"I investigated two attacks on the fictional Wayne Enterprises in Splunk's BOTS v1 dataset, a website defacement and a Cerber ransomware outbreak. I traced both from raw logs to a written incident report, mapped them to MITRE ATT&CK and wrote searches that would have caught them.",
    tags:["Splunk","SPL","Sysmon","MITRE ATT&CK","VirusTotal"],
    problem:"An alert or a single log line rarely tells you what happened. To find out who got in, how, what they touched and how bad it is, you have to follow the attacker across many log sources, then write it up so someone else can act on it. I wanted to do that whole job once, from about 33 million raw events to an incident report.",
    points:[["Defacement chain (High)","an Acunetix scan, then a Python brute force that found the Joomla admin password after 412 attempts, a web shell and a Meterpreter backdoor, and the process chain php-cgi.exe → cmd.exe → 3791.exe calling back to its C2 server"],
            ["Ransomware chain (Critical)","bob.smith opened a macro document from a USB drive; obfuscated VBScript downloaded Cerber disguised as a .jpg, which deleted shadow copies, disabled recovery and spread to the file server, encrypting 970 of the 5,193 files it accessed"],
            ["ATT&CK mapping","24 techniques across both attacks, plus an ATT&CK Navigator layer you can import"],
            ["Documented SPL","31 queries in queries.md, each with why I ran it and what it showed, pivoting across web, DNS, IDS, firewall, Sysmon, Windows Security and SMB logs"],
            ["Detection ideas","five searches that could become alerts: CMS brute force, a web server spawning a shell, Office spawning a script engine, shadow copy deletion and mass file access on a share"]],
    flow:[["Raw logs", "~33M BOTS v1 events"], ["SPL pivots", "Web, DNS, IDS, firewall, Sysmon, SMB"], ["Incident report", "Timeline, IOCs, ATT&CK, remediation"]],
    stack:[["SIEM",["Splunk Enterprise 10.6","SPL"]],
           ["Enrichment",["VirusTotal"]],
           ["Framework",["MITRE ATT&CK Navigator"]],
           ["Add-ons",["Microsoft Windows","Sysmon","Stream","Fortinet FortiGate","Suricata"]],
           ["Environment",["Ubuntu on WSL2"]]],
    stats:[["24","MITRE ATT&CK techniques mapped across both attacks"],["31","SPL queries documented, with why each one was run"],["970","files encrypted on the file server, out of 5,193 accessed"]],
    note:"BOTS v1 is a public training dataset released by Splunk. Wayne Enterprises and its users and systems are fictional. The attacks date from 2016, so the attacker IPs look clean on VirusTotal today, while the malware hashes are still flagged.",
    skills:["Incident investigation","SIEM / SPL","Log analysis","Threat mapping (MITRE ATT&CK)","Incident reporting","Detection engineering"] },

  { t:"Slotwise", slug:"slotwise", cats:["Backend", "Web"],
    k:"Appointment booking platform", img:"slotwise-landing.webp", pos:"center top", repo:"slotwise", live:"https://slotwise-mocha.vercel.app",
    gallery:["slotwise-booking.webp", "slotwise-services.webp", "slotwise-staff.webp"],
    d:"Booking software for barbershops and salons. Clients book a time that is really free, staff work from one shared day, and the database itself refuses to give two clients the same slot.",
    tags:["FastAPI","PostgreSQL","React","TypeScript","Alembic"],
    problem:"When two clients press Book on the same slot at the same moment, a check in application code can let both through. Small shops then deal with the double booking at the counter. Slotwise moves that guarantee into the database, where it holds no matter how many requests arrive together.",
    points:[["No double bookings","a PostgreSQL exclusion constraint on appointment time ranges rejects overlapping bookings"],
            ["Real availability","free times come from opening hours, breaks, closures and existing bookings"],
            ["Three roles","clients book, move or cancel; staff run the day and add walk-ins; the owner sets services, prices and hours"],
            ["Sign-in and sessions","server-side sessions, CSRF tokens, origin checks, login throttling and argon2 password hashing"],
            ["Migrations","the schema is managed with Alembic, so every change is versioned"]],
    flow:[["React app", "Client, staff and owner screens"], ["FastAPI", "Sessions, availability, booking rules"], ["PostgreSQL", "Exclusion constraint blocks overlaps"]],
    stack:[["Backend",["Python","FastAPI","SQLAlchemy","Alembic"]],
           ["Database",["PostgreSQL","btree_gist exclusion constraints"]],
           ["Frontend",["React","TypeScript"]],
           ["Testing",["Pytest","Frontend tests"]],
           ["Hosting",["Vercel","Docker for local development"]]],
    stats:[["455","backend tests"],["317","frontend tests"],["Database-level","the no-overlap rule is enforced by PostgreSQL, not only by application code"]],
    note:"The live demo is a fictional barbershop with sample data that resets regularly. The server sleeps when idle, so the first visit can take up to a minute.",
    skills:["Backend engineering","Database design","API design","Authentication and sessions","Automated testing","Full-stack development"] },

  { t:"SOC Home Lab", slug:"soc-home-lab", cats:["Security"],
    k:"Elastic SIEM · Detection lab", img:"soc-alerts.webp", fit:"contain", cardFit:"cover", pos:"left top", repo:"Soc-Homelab", live:"",
    gallery:["soc-rules.webp", "soc-alert-detail.webp"],
    d:"Two virtual machines shipping logs to Elastic Cloud SIEM. I attacked the Windows machine from Kali, then wrote detection rules that caught what I had done.",
    tags:["Elastic SIEM","Sysmon","auditd","KQL","MITRE ATT&CK"],
    problem:"Reading about detection rules is not the same as watching one fire on your own attack. I wanted to see the whole chain: an attack happens, logs are collected, a rule matches, and an alert shows up with enough detail to investigate.",
    points:[["Log collection","Sysmon and Winlogbeat on Windows 10, auditd and Filebeat on Kali, all shipping to Elastic Cloud"],
            ["Attacks I ran","Nmap scanning, SMB enumeration, a reverse shell and post-exploitation commands"],
            ["Custom detections","two KQL rules for reconnaissance commands, mapped to MITRE ATT&CK T1033 and T1087"],
            ["A gap I found","some prebuilt Elastic rules didn't match my logs' field names, so I adapted the detections to the fields actually collected"]],
    flow:[["Kali + Windows VMs", "Attack and victim machines"], ["Sysmon, auditd, Beats", "Collect and ship logs"], ["Elastic SIEM", "Rules match, alerts fire"]],
    stack:[["SIEM",["Elastic Cloud","Kibana","KQL"]],
           ["Windows",["Sysmon","Winlogbeat","Windows Event Logs"]],
           ["Linux",["auditd","Filebeat","Kali Linux"]],
           ["Lab",["VirtualBox","Nmap","Netcat"]]],
    stats:[["About 60 seconds","from running recon commands to the alert firing"],["2","custom KQL detections mapped to MITRE ATT&CK"]],
    skills:["Detection engineering","Log analysis","SIEM configuration","Attack simulation","Documentation"] },

  { t:"Usage Metering & Billing Engine", slug:"billing-engine", cats:["Backend"],
    k:"Billing API · FlyRank backend capstone", img:"billing-success.webp", fit:"contain", cardFit:"cover", pos:"center top", repo:"flyrank-billing-engine", live:"",
    gallery:["billing-checkout.webp"],
    d:"A backend service that records AI-token usage, enforces plan quotas, works out the cost and takes payment for upgrades, without ever counting or charging the same thing twice.",
    tags:["FastAPI","PostgreSQL","SQLAlchemy","Alembic","Docker","Midtrans"],
    problem:"Billing code has to be right when things go wrong: a client retries a request, two requests arrive together, or a payment provider sends the same notification twice. Each of those can double-count usage or double-charge a customer unless the service is designed for it.",
    points:[["Exactly-once metering","a unique constraint on tenant and idempotency key means a retried request never counts twice"],
            ["Plan quotas","Free and Pro limits are checked before usage is recorded, with clear 402 and 429 responses"],
            ["Money in cents","costs are calculated in integer cents, including cached-input and reasoning-token pricing"],
            ["Signed webhooks","Midtrans payment notifications are verified with HMAC-SHA512 and processed once"],
            ["Tenant isolation","each customer's data sits behind its own API key"],
            ["Layered code","API, services and repositories are separate, with the payment provider behind a generic interface"]],
    flow:[["API request", "API key + idempotency key"], ["Metering service", "Quota check, cost, usage event"], ["PostgreSQL", "Unique constraint stops duplicates"]],
    stack:[["Backend",["Python","FastAPI","SQLAlchemy","Alembic"]],
           ["Database",["PostgreSQL"]],
           ["Payments",["Midtrans Sandbox","HMAC-SHA512 webhooks"]],
           ["Testing",["Pytest"]],
           ["Packaging",["Docker","Docker Compose"]]],
    stats:[["68","automated tests, including concurrent requests with the same key"],["Exactly once","retries and duplicate webhooks never double-count or double-charge"]],
    note:"Built as the capstone for the FlyRank backend track. Payments run against the Midtrans sandbox, not real money.",
    skills:["Backend engineering","Idempotent API design","Payment integration","Webhook security","Database design","Automated testing"] },

  { t:"SEMIS", slug:"semis", cats:["Backend", "Security"],
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
];

/* Finished projects only (no status:"building"). These get case-study pages and sitemap entries. */
export const caseStudies = projects.filter((p) => p.status !== "building");

/* Add new entries at the TOP. type: "work" | "education". Optional: mode ("Remote" | "Hybrid" | "On-site"), tags. */
export const jobs = [
  { when:"Sep 2026 — now", type:"work", role:"System Intern, E-Technology Program", org:"President University", mode:"On-site", tags:["Moodle","Backup & recovery"],
    points:[["Course platform.","Administer and maintain Moodle course content so online learning materials stay organized and accessible."],
            ["Backup dashboard.","Built and maintain a separate backup dashboard for course content backup and recovery, adding a second layer of protection for the program's materials."]] },
  { when:"Jul — Sep 2026", type:"work", role:"Backend AI Engineering Intern", org:"FlyRank AI", mode:"Remote", tags:["FastAPI","PostgreSQL","Docker","Midtrans"],
    points:[["Billing backend.","Built a usage-metering and billing service with FastAPI and PostgreSQL that tracks each account's usage, enforces plan quotas and calculates costs in whole cents."],
            ["Exactly once.","Used idempotency keys backed by a database constraint, so retries and concurrent requests never count the same usage twice."],
            ["Safe payments.","Verified HMAC-SHA512 signed webhooks from Midtrans (sandbox) and rejected duplicate payment events."],
            ["Tested.","Covered the service with 68 automated tests and packaged it with Docker."]] },
  { when:"Aug — Sep 2026", type:"work", role:"SOC Analyst Intern", org:"TechBiz Security Academy", mode:"Remote", tags:["Splunk","Wireshark","MITRE ATT&CK"],
    points:[["Logs and SIEM.","Analysed Linux auth logs and Windows Event IDs (4624, 4625, 4688), then ingested logs into Splunk and built dashboards and a failed-login alert."],
            ["Investigations.","Investigated phishing emails (headers, SPF, DKIM) and checked IOCs with VirusTotal and AbuseIPDB."],
            ["Capstone.","Wrote an incident report with a timeline, evidence, MITRE ATT&CK mapping and recommendations. Completed with distinction."]] },
  { when:"Ongoing", type:"education", role:"Informatics", org:"President University, Indonesia",
    points:[["Focus.","Cybersecurity concentration: secure systems, networking and security operations."]] },
];

/* Skills section: the heading's sentence, then one tab per group. Click a tab and its skills appear in the card. */
export const skillsIntro = "What I use to build software, secure it and detect attacks, practised in internships, projects and labs.";

/* img (optional): a square illustration from public/art/ shown at the top of the card. */
export const stack = [
  { title:"Build", sub:"APIs, databases and services", img:"/art/build.webp",
    items:["Python","FastAPI","Node.js & Express","TypeScript","React","PostgreSQL","MongoDB","SQLAlchemy & Alembic","REST APIs","Pytest","Docker","GitHub Actions"] },
  { title:"Secure", sub:"Hardening what I build", img:"/art/secure.webp",
    items:["OWASP Top 10","Authentication & sessions","Role-based access control","JWT","CSRF protection","Webhook signature verification","Rate limiting","Dependency scanning","SafeLine WAF","NIST CSF"] },
  { title:"Detect", sub:"Logs, alerts and investigation", img:"/art/detect.webp",
    items:["Elastic SIEM","Splunk","KQL","Sysmon & auditd","Log analysis (Linux & Windows)","MITRE ATT&CK","Wireshark","Nmap","Phishing analysis","Kali Linux"] },
];

/* Add new certificates here; images live in public/certs/. Optional per entry: date, id, verify (URL), skills, expires.
   status: "earned" | "in progress" (in-progress ones show as an "In development" card under All and their category tab).
   featured:true puts a certificate on the home page (keep it to about four); every certificate is on /certificates/. */
export const certCats = ["Security", "Development", "Other"];
export const certs = [
  { t:"SOC Analyst Internship", org:"TechBiz Security Academy", img:"techbiz-soc.webp", cat:"Security", status:"earned", date:"Sep 2026" },
  { featured:true, t:"Google Cybersecurity Professional", org:"Google", img:"google-cybersecurity.webp", cat:"Security", status:"earned", date:"Mar 2026",
    verify:"https://coursera.org/verify/professional-cert/RS5HS3738JU9",
    skills:["Linux","SQL","Python","SIEM tools","Intrusion detection"] },
  { featured:true, t:"Google AI Professional", org:"Google", img:"google-ai.webp", cat:"Development", status:"earned", date:"Jun 2026",
    verify:"https://coursera.org/verify/professional-cert/6E9PIWPSLVA3" },
  { featured:true, t:"GitHub Foundations (GH-900)", org:"GitHub", img:"github-foundations.webp", cat:"Development", status:"earned", date:"Oct 2026", expires:"Oct 2028",
    id:"931F4188610219D9" },
  { t:"AWS Security Fundamentals", org:"Amazon Web Services", img:"aws-security.webp", cat:"Security", status:"earned", date:"Sep 2025" },
  { t:"Cybersecurity Analyst Job Simulation", org:"Forage", img:"forage-cyber.webp", cat:"Security", status:"earned", date:"Jan 2026",
    skills:["IAM fundamentals","IAM strategy assessment","Custom IAM solutions","Platform integration"] },
  { t:"Pre Security Learning Path", org:"TryHackMe", img:"tryhackme-presecurity.webp", cat:"Security", status:"earned", date:"Feb 2026", id:"THM-3DKLN6D21B" },
  { t:"Information Security Certification", org:"freeCodeCamp", img:"freecodecamp-infosec.webp", cat:"Security", status:"earned", date:"May 2026",
    verify:"https://freecodecamp.org/certification/hassmium018/information-security-v7" },
  { t:"TechCrush Cybersecurity Bootcamp", org:"TechCrush", img:"techcrush.webp", cat:"Security", status:"earned", date:"Jun 2026", id:"TEC-D57F85B7" },
  { featured:true, t:"Backend AI Engineering Internship", org:"FlyRank AI", img:"flyrank-backend-ai.webp", cat:"Development", status:"earned", date:"Sep 2026",
    id:"FR-D11-4AF80-778F5", verify:"https://internship.flyrank.ai/verify" },
];

/* CTF write-ups on the Achievements "CTF write-ups" tab: one row per event, linking to its write-ups.
   Keep d to one short line; the write-up itself has the detail. */
export const writeups = [
  { t:"TryHackMe Hacker Holidays", meta:"Jul 27 – Aug 9 · TryHackMe",
    url:"https://hal-imaxabdi.github.io/tryhackme-hacker-holidays/",
    d:"14 rooms across OSINT, AI, web, cloud, forensics and boot2root." },
  { t:"Digital Forensics CTF", meta:"President University · Team captain",
    url:"https://gorgeous-snickerdoodle-a06df8.netlify.app",
    d:"16 challenge parts, from network traffic and steganography to NTFS journal forensics." },
];

/* Optional "Next goals" row on the Certificates page. It only renders when this list has entries, e.g. ["ISC2 CC", "AWS Security Specialty"]. */
export const goals = [];

export const contact = {
  email:"halimamohamedabdirizak@gmail.com",
  linkedin:"https://www.linkedin.com/in/halima-abdirizak-mohamed/",
  github:"https://github.com/hal-imaxabdi"
};
