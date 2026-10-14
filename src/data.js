export const G = "https://github.com/hal-imaxabdi/";

export const me = {
  name: "Halima Abdirizak Mohamed",
  short: "Halima", 
  tagline: "Cybersecurity and backend enthusiast. I build secure systems, then attack them to see if they hold.", // one line under the greeting
};

/* About section: one string per paragraph. */
export const about = [
  "I'm Halima, a third-year Informatics student at President University, specializing in cybersecurity. I enjoy understanding how technology works, building with it, and finding ways to make it safer.",
  "Cybersecurity and backend development are where I spend most of my time, from SOC labs and security projects to APIs I build and test myself. I'm curious, hands-on, and always happy to learn from the people around me.",
];

/* Each project card: front = screenshot (or code). Back = 3 pages you can swipe:
   1) k / t / d + tags   2) points: [bold lead, rest]   3) stats: [big value, label] + optional note.
   Add live:"https://..." to show a Live demo button. fit:"cover" crops the screenshot to fill the card (pos:"right top" picks the part); the default shows the whole screenshot. Only real, checkable numbers here. */
export const projects = [
  { t:"SEMIS", k:"Secure employee management system", img:"semis.webp", repo:"SEMIS-Secure-Employee-Management-Information-System", live:"",
    d:"A full-stack HR platform for a fictional 150-person company, built to apply the OWASP Top 10 defences to real employee data.",
    tags:["React","Node.js","Express","MongoDB","JWT","AES-256"],
    points:[["Role-based access","admin, HR and employee roles checked in middleware on every protected route"],
            ["Encrypted at rest","salary and national ID stored with AES-256-CBC"],
            ["MFA","email one-time codes, stored hashed, expiring after 5 minutes"],
            ["Audit trail","append-only logs record who did what, when and from which IP"],
            ["Hardened","CSRF and XSS protection, rate limiting and secure headers"]],
    stats:[["10 / 10","OWASP Top 10 risks mapped to a mitigation in the README"],["AES-256","protects the most sensitive fields before they reach the database"]] },
  { t:"Hookline", k:"Chrome extension · Phishing detection", img:"hookline.webp", repo:"hookline", live:"", pos:"right top",
    d:"A Chrome extension that checks the links in your Gmail and shows why each one looks suspicious, instead of handing you a bare verdict.",
    tags:["TypeScript","React","Manifest V3","FastAPI"],
    points:[["Lexical detectors","typosquatting, lookalike characters, odd TLDs and IP-hosted links"],
            ["Email checks","flags a reply-to address that does not match the sender"],
            ["Evidence tab","every verdict explains exactly why it was flagged"],
            ["Private by design","never visits the page behind a link"]],
    stats:[["76.1%","precision on a balanced 50k-sample test"],["40.5%","recall, which is the honest limit of lexical-only detection"]],
    note:"False-positive rate 12.7%. The README documents the limits and how to reproduce the test." },
  { t:"AuditShield", k:"Risk & audit platform", img:"audit-shield.png", repo:"AI-Assisted-Risk-Assessment-Security-Audit-Platform", live:"",
    d:"An audit platform that walks through 51 NIST CSF controls, collects evidence and exports reports, with a local AI model that explains findings in plain language.",
    tags:["Flask","SQLite","Ollama","NIST CSF"],
    points:[["Full audit flow","assets, risks, evidence upload, findings and report export"],
            ["Compliance scoring","51 NIST CSF controls tracked as a checklist"],
            ["Plain-language findings","a local Ollama model (llama3.2) explains each result"]],
    stats:[["51","NIST CSF controls, each with evidence attached"],["Local AI","the explanations run on your own machine"]] },
  { t:"SOC Homelab", k:"Detection engineering", img:"soc-homelab.webp", repo:"Soc-Homelab", live:"",
    d:"A two-VM home SOC that streams Windows Sysmon and Kali logs into Elastic Cloud, where I wrote my own detections and tested them with real attacks.",
    tags:["Elastic","Sysmon","KQL","Kali"],
    points:[["Log pipeline","Winlogbeat and Filebeat ship Sysmon and auditd logs"],
            ["Custom detections","KQL rules written against the fields I actually ingest"],
            ["Validated","each rule tested with attack traffic from Kali"],
            ["Isolated","VirtualBox NAT and host-only networks"]],
    stats:[["1,740+","detection rules active (prebuilt and custom)"],["~60 s","from a reverse shell to an alert"]] },
  { t:"WAF Homelab", k:"Web application firewall", img:"waf-homelab.jpg", repo:"WAF-HomeLab-SafeLine", live:"",
    d:"A SafeLine WAF in Docker, set up as a reverse proxy in front of DVWA, then attacked from Kali to see what it blocked, logged or missed.",
    tags:["SafeLine","Docker","Apache","DVWA"],
    points:[["Layout","Kali attacker to SafeLine reverse proxy to Apache and DVWA"],
            ["Tested","SQL injection, XSS, command injection, HTTP flood and IP deny rules"],
            ["Documented","a build guide with images so the lab can be rebuilt"]],
    stats:[["SQLi, XSS","blocked"],["Command injection","logged but not blocked: a gap I found and documented"],["HTTP flood","rate-limited with an anti-bot challenge"]] },
  { t:"FlyRank Billing Engine", k:"Backend · Payments", img:"fly-rankbilling.png", repo:"flyrank-billing-engine", live:"",
    d:"A billing backend for usage-based SaaS where retries and duplicate webhooks never double-count, and every payment event is signature-verified.",
    tags:["FastAPI","PostgreSQL","Pytest","Midtrans"],
    points:[["Idempotent usage","a unique (tenant, idempotency key) constraint backs every request"],
            ["Quotas and cost","plan limits enforced, cost calculated in integer cents"],
            ["Payments","Midtrans sandbox flow with HMAC-SHA512 webhook verification"],
            ["Layered design","API, services, repositories, PostgreSQL, with tenants isolated"]],
    stats:[["68","automated tests: idempotency, quotas, webhooks, tenant isolation"],["HMAC-SHA512","checked before any payment event is processed"]] },
  { t:"Flask Auth Lab", k:"Authentication security", img:"flask-auth.png", repo:"Secure-Flask-Authentication-Lab", live:"",
    d:"One login built twice, vulnerable and hardened, then attacked with my own brute-force tool to measure what the defences actually stop.",
    tags:["Flask","bcrypt","JWT","Python"],
    points:[["Vulnerable version","plaintext passwords and no rate limiting"],
            ["Hardened version","bcrypt with per-user salt, rate limiting, lockout, single-use CSRF tokens"],
            ["Sessions","RS256-signed JWTs with a jti blacklist for revocation"],
            ["Attack tools","a Python CLI and GUI brute-forcer run against a local copy"]],
    stats:[["9 / 10","accounts cracked on the vulnerable login, in 74 seconds"],["0 / 10","cracked on the hardened login after 570 attempts"]] },
];

export const jobs = [
  { when:"Sep 2026 — Now", role:"Cybersecurity Intern", org:"ElectraWireless", d:"Built SHA-256 malware detection for an IoT firmware scanner and kept 130+ tests passing." },
  { when:"Aug — Sep 2026", role:"SOC Analyst Intern", org:"Tech Biz Security", d:"Investigated brute-force and phishing attacks. Built a Splunk SIEM lab with alerting." },
  { when:"Jul — Sep 2026", role:"Backend AI Engineering Intern", org:"FlyRank AI", d:"Secured payment webhooks with HMAC-SHA512 and blocked duplicate charges. 68 tests." },
];

/* Only what I can show in a project or an internship. Order = strongest first. */
export const stack = [
  { title:"Defend", items:[["SOC monitoring","activity"],["Splunk","splunk"],["Elastic SIEM","elastic"],["Phishing analysis","mail"],["Hash-based malware detection","alert"],["MITRE ATT&CK","grid"],["NIST CSF","check"]] },
  { title:"Build", items:[["Python","python"],["SQL (PostgreSQL, SQLite)","postgres"],["FastAPI","fastapi"],["Flask","flask"],["Node.js","node"],["JavaScript and TypeScript","node"],["React","node"],["Git","git"]] },
  { title:"Test", items:[["Kali Linux","kali"],["Wireshark","wireshark"],["SafeLine WAF","safeline"],["Web app security (OWASP)","owasp"],["pytest","pytest"]] },
];

export const certs = [
  { t:"Google Cybersecurity Professional", org:"Google", logo:"google", img:"google-cybersecurity.webp" },
  { t:"Google AI Professional", org:"Google", logo:"google", img:"google-ai.webp" },
  { t:"Incident Response and Digital Forensics", org:"IBM", logo:"ibm", img:"ibm-incident-response.webp" },
  { t:"GitHub Foundations (GH-900)", org:"GitHub", logo:"github", img:"github-foundations.webp" },
  { t:"AWS Security Fundamentals", org:"Amazon Web Services", logo:"aws", img:"aws-security.webp" },
  { t:"Cybersecurity Analyst Job Simulation", org:"Forage", logo:"forage", img:"forage-cyber.webp" },
  { t:"Pre Security Learning Path", org:"TryHackMe", logo:"tryhackme", img:"tryhackme-presecurity.webp" },
  { t:"Information Security Certification", org:"freeCodeCamp", logo:"freecodecamp", img:"freecodecamp-infosec.webp" },
  { t:"TechCrush Cybersecurity Bootcamp", org:"TechCrush", logo:"techcrush", img:"techcrush.webp" },
];

export const contact = {
  email:"halimamohamedabdirizak@gmail.com",
  linkedin:"https://www.linkedin.com/in/halima-abdirizak-mohamed/",
  github:"https://github.com/hal-imaxabdi",
};
