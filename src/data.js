export const G = "https://github.com/hal-imaxabdi/";

export const heroVisual = "image"; // "image" = the masked hero on the right, "video" = the old illustrated video

export const me = {
  name: "Halima Abdirizak Mohamed",
  short: "Halima",
  rotator: ["Cybersecurity student", "Backend developer", "Security lab builder", "Problem solver"], // the big line that swaps under your name
  tagline: "I build software, explore security, and solve technical problems.", // one line under the greeting
};

/* About section: one string per paragraph, shown side by side in the normal text style. Your own words; the last two paragraphs are joined into one. */
export const about = [
  "I'm Halima, an Informatics student at President University in Indonesia, originally from Kenya, with an interest in cybersecurity and software development.",
  "Through internships, projects, and hands-on labs, I've worked on things like web application security, backend systems, security monitoring, and authentication. I enjoy understanding how things work, solving technical problems, and exploring how different parts of technology fit together.",
  "I'm always looking for opportunities to apply what I learn, strengthen my technical skills, and take on new challenges. I also use AI tools to support my workflow, while making sure I understand the code, decisions, and results behind my work. I'm still growing as a technologist, and I'm interested in opportunities where I can contribute, learn from others, and build things that are useful and reliable.",
];

/* Each project card: front = screenshot (or code). Back = 3 pages you can swipe:
   1) k / t / d + tags   2) points: [bold lead, rest]   3) stats: [big value, label] + optional note.
   Add live:"https://..." to show a Live demo button. fit:"cover" crops the screenshot to fill the card (pos:"right top" picks the part); the default shows the whole screenshot. Only real, checkable numbers here. */
export const projects = [
  { t:"SEMIS", k:"Secure employee management system", img:"semis.webp", repo:"SEMIS-Secure-Employee-Management-Information-System", live:"",
    d:"I wanted to see how the OWASP Top 10 web risks apply to real employee data, so I built an HR system for a fictional 150-person company and protected it against each one.",
    tags:["React","Node.js","Express","MongoDB","JWT","AES-256"],
    points:[["Access control","admin, HR and employee roles are checked on every protected page"],
            ["Sensitive data","salary and national ID are encrypted before they are stored"],
            ["Login","a one-time code sent by email as a second step, valid for 5 minutes"],
            ["Activity log","records who did what, when and from which IP address, and entries can't be edited"],
            ["Other protections","defences against CSRF and XSS attacks, limits on repeated requests and secure headers"]],
    stats:[["10 / 10","OWASP Top 10 risks matched to a protection I built, listed in the README"],["Encrypted","salary and national ID are encrypted before they reach the database"]] },
  { t:"Hookline", k:"Chrome extension · Phishing detection", img:"hookline.webp", repo:"hookline", live:"", pos:"right top",
    d:"A Chrome extension that checks the links in your Gmail and shows why each one looks suspicious, instead of giving you a bare yes or no.",
    tags:["TypeScript","React","Manifest V3","FastAPI"],
    points:[["Link checks","spots fake lookalike domains, odd domain endings and links that use a raw IP address"],
            ["Email checks","warns when the reply-to address doesn't match the sender"],
            ["Explains itself","every result says exactly why it was flagged"],
            ["Private","never opens the page a link leads to"]],
    stats:[["76.1%","of the links it flagged were really suspicious (tested on 50,000 balanced samples)"],["40.5%","of suspicious links it caught. It only looks at the link itself, so it misses many, and I say so in the README"]],
    note:"12.7% of safe links were wrongly flagged. The README explains the limits and how to repeat the test." },
  { t:"AuditShield", k:"Risk & audit platform", img:"audit-shield.png", repo:"AI-Assisted-Risk-Assessment-Security-Audit-Platform", live:"",
    d:"A tool that guides someone through a security audit using the 51 controls in the NIST Cybersecurity Framework, keeps the evidence and exports a report. A local AI model explains each finding in plain language.",
    tags:["Flask","SQLite","Ollama","NIST CSF"],
    points:[["The whole audit","list assets and risks, upload evidence, record findings and export a report"],
            ["Progress tracking","the 51 NIST CSF controls work as a checklist"],
            ["Plain-language findings","a local AI model (llama3.2 through Ollama) explains each result"]],
    stats:[["Start to finish","from listing assets to a finished report, in one tool"],["Runs locally","the AI explanations run on your own computer, not on an outside service"]] },
  { t:"SOC Homelab", k:"Monitoring and detection", img:"soc-homelab.webp", repo:"Soc-Homelab", live:"",
    d:"Two virtual machines set up like a small security operations centre. Logs from a Windows machine and a Kali machine flow into Elastic Cloud, where I wrote my own detection rules and tested them with real attacks.",
    tags:["Elastic","Sysmon","KQL","Kali"],
    points:[["Collecting logs","Winlogbeat and Filebeat send Sysmon and auditd logs to Elastic"],
            ["My own rules","written in KQL against the fields I actually collect"],
            ["Tested","each rule was tried with attack traffic from Kali"],
            ["Isolated","the lab runs on separate virtual networks in VirtualBox"]],
    stats:[["~60 s","from launching a reverse shell to getting an alert"],["Own rules","I wrote them and checked each one against a real attack"]] },
  { t:"WAF Homelab", k:"Web application firewall", img:"waf-homelab.jpg", repo:"WAF-HomeLab-SafeLine", live:"",
    d:"I wanted to know whether a web application firewall really stops common attacks. I put SafeLine in front of a deliberately vulnerable app (DVWA), attacked it from Kali, and recorded what was blocked, logged or missed.",
    tags:["SafeLine","Docker","Apache","DVWA"],
    points:[["Setup","Kali (attacker), then SafeLine (the firewall), then Apache and DVWA"],
            ["What I tried","SQL injection, XSS, command injection, an HTTP flood and blocking by IP address"],
            ["Documented","a step-by-step guide with images so the lab can be rebuilt"]],
    stats:[["SQL injection and XSS","blocked"],["Command injection","logged but not blocked: a gap I found and documented"],["HTTP flood","slowed down with rate limiting and an anti-bot challenge"]] },
  { t:"FlyRank Billing Engine", k:"Backend · Payments", img:"fly-rankbilling.png", repo:"flyrank-billing-engine", live:"",
    d:"A billing backend for a pay-per-use service. A repeated request or a duplicate payment notification is never counted twice, and every payment notification is checked to be genuine before it is processed.",
    tags:["FastAPI","PostgreSQL","Pytest","Midtrans"],
    points:[["No double counting","each request carries a unique key and the database rejects repeats"],
            ["Plans and costs","plan limits are enforced and costs are stored as whole cents to avoid rounding errors"],
            ["Payments","a Midtrans sandbox flow where each payment notification's signature (HMAC-SHA512) is verified"],
            ["Structure","separate layers for the API, the business logic and the database, with each customer's data kept apart"]],
    stats:[["68","automated tests covering repeated requests, plan limits, payment notifications and keeping customers' data apart"],["Verified first","a payment notification is checked before anything is processed"]] },
  { t:"Flask Auth Lab", k:"Authentication security", img:"flask-auth.png", repo:"Secure-Flask-Authentication-Lab", live:"",
    d:"A team project. I built the same login twice, once with deliberate weaknesses and once hardened. My teammate built a password-guessing tool, and we used it on both versions to see what the defences actually stop.",
    tags:["Flask","bcrypt","JWT","Python"],
    points:[["Weak version (mine)","plaintext passwords and no limit on login attempts"],
            ["Hardened version (mine)","passwords hashed with bcrypt, limits on attempts, account lockout and single-use CSRF tokens"],
            ["Sessions","signed JWT tokens that can be revoked"],
            ["Testing","my teammate's Python command-line and GUI password guesser, run only against a local copy"]],
    stats:[["9 of 10","accounts guessed on the weak login, in 74 seconds"],["0 of 10","accounts guessed on the hardened login, after 570 attempts"]],
    note:"The password-guessing tool was written by my teammate. I built both versions of the login and we ran the tests together." },
];

export const jobs = [
  { when:"Sep 2026 — Now", role:"Cybersecurity Intern", org:"ElectraWireless", d:"Built SHA-256 malware detection for an IoT firmware scanner and kept 130+ tests passing." },
  { when:"Aug — Sep 2026", role:"SOC Analyst Intern", org:"Tech Biz Security", d:"Investigated brute-force and phishing attacks. Built a Splunk SIEM lab with alerting." },
  { when:"Jul — Sep 2026", role:"Backend AI Engineering Intern", org:"FlyRank AI", d:"Secured payment notifications with HMAC-SHA512 and stopped duplicate charges. 68 automated tests." },
];

/* Skills section: the heading's sentence, then one tab per group. Click a tab and its skills appear in the card. */
export const skillsIntro = "A selection of technologies and concepts I've used across projects, internships, and hands-on practice.";

export const stack = [
  { title:"Programming & Development", items:["Python","SQL","JavaScript","TypeScript","React","Node.js","Flask","FastAPI","REST APIs","Git","GitHub","Docker"] },
  { title:"Cybersecurity", items:["Web application security","Authentication & authorization","Vulnerability analysis","Phishing analysis","Security monitoring","Log analysis"] },
  { title:"Tools & Platforms", items:["Linux","Wireshark","Elastic SIEM","Splunk","SafeLine WAF"] },
  { title:"Concepts & Frameworks", items:["OWASP Top 10","NIST Cybersecurity Framework","MITRE ATT&CK","Networking","Cryptography","Database Systems"] },
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
