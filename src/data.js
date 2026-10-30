export const G = "https://github.com/hal-imaxabdi/";


export const me = {
  name: "Halima Abdirizak Mohamed",
  first: "Halima",
  last: "A. Mohamed.",
  tagline: "I build software, explore how systems work, and look for ways to make applications more secure.",
  line: ["Informatics student", "Cybersecurity focus"],
  where: "President University · Indonesia",
  origin: "Based in Indonesia",
};

/* About page: one string per paragraph. The first two also appear in the "About me" section on the home page. */
export const about = [
  "I'm Halima, an Informatics student at President University in Indonesia, with a passion for software engineering and cybersecurity.",
  "Through internships, projects and hands-on labs, I've worked on web application security, backend systems, security monitoring and authentication. I enjoy understanding how things work behind the scenes, and building things that are useful and reliable.",
  "I learn by building, testing, investigating problems and documenting what I discover.",
];
export const education = { degree: "Informatics", school: "President University, Indonesia", status: "Ongoing" };
export const interests = ["Full-stack development", "Backend systems", "Application security", "Problem solving"];

/* Add a project by copying an entry. Required: t, slug, k, d, tags, cats.
   Optional (a missing field simply doesn't render its section):
     img, fit, pos          screenshot file, "contain" to avoid cropping, image focus point
     shots [files]          extra screenshots for the detail page (files in assets/img/). Until supplied, two placeholders show.
     repo, live, status     links and badge
     problem                "The problem" section
     points [[title,text]]  "Key features" cards
     flow [[name,note]]     "How it works" diagram
     stack [[group,[items]]] "Tech stack" grouped rows
     stats [[big,small]]    "Results" tiles, note = honest limitations
     skills [..]            "Skills demonstrated" tags */
export const projectCats = ["Web & Full Stack", "Security", "Tools"];
export const projects = [
  { t:"SEMIS", slug:"semis", cats:["Web & Full Stack", "Security"], status:"Complete",
    k:"Secure employee management system", img:"semis.webp", repo:"SEMIS-Secure-Employee-Management-Information-System", live:"",
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

  { t:"Hookline", slug:"hookline", cats:["Security", "Tools"], status:"Complete",
    k:"Chrome extension · Phishing detection", img:"hookline.webp", repo:"hookline", live:"", pos:"right top",
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

  { t:"AuditShield", slug:"auditshield", cats:["Web & Full Stack", "Security"], status:"Complete", k:"Risk & audit platform", img:"audit-shield.png", fit:"contain", repo:"AI-Assisted-Risk-Assessment-Security-Audit-Platform", live:"",
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

  { t:"WAF Homelab", slug:"waf-homelab", cats:["Security"], status:"Complete",
    problem:"Does a web application firewall really stop common attacks, and what slips past it? Reading about a WAF is not the same as watching one block (or miss) a live attack.",
    flow:[["Kali", "Attacker"], ["SafeLine", "Web application firewall"], ["Apache + DVWA", "Deliberately vulnerable app"]], k:"Web application firewall", img:"waf-homelab.jpg", repo:"WAF-HomeLab-SafeLine", live:"",
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

  { t:"FlyRank Billing Engine", slug:"flyrank-billing", cats:["Web & Full Stack"], status:"Complete",
    problem:"Pay-per-use platforms must count each customer's usage exactly once, enforce plan limits and only trust genuine payment notifications. Systems fail here when requests are retried, notifications arrive twice or limits are checked loosely.",
    flow:[["API", "Requests and validation"], ["Business logic", "Plans, quotas, costs"], ["Database", "PostgreSQL, per-customer data"]], k:"Backend · Payments", img:"fly-rankbilling.png", fit:"contain", repo:"flyrank-billing-engine", live:"",
    d:"A billing backend for a pay-per-use service. A repeated request or a duplicate payment notification is never counted twice, and every payment notification is checked to be genuine before it is processed.",
    tags:["FastAPI","PostgreSQL","Pytest","Midtrans"],
    points:[["No double counting","each request carries a unique key and the database rejects repeats"],
            ["Plans and costs","Free and Pro limits are enforced and costs are stored as whole cents to avoid rounding errors"],
            ["Payments","a Midtrans sandbox checkout where each payment notification's signature (HMAC-SHA512) is verified"],
            ["Structure","separate layers for the API, the business logic and the database, with each customer's data kept apart"]],
    stack:[["Backend",["Python","FastAPI"]],
           ["Database",["PostgreSQL","SQLAlchemy","Alembic"]],
           ["Payments",["Midtrans Sandbox"]],
           ["Testing & ops",["Pytest","Docker","Swagger / OpenAPI docs"]]],
    stats:[["68","automated tests covering repeated requests, plan limits, payment notifications and keeping customers' data apart"],["Verified first","a payment notification is checked before anything is processed"]],
    skills:["Backend API design","Usage-based billing","Idempotent systems","Database modelling","Webhook security","Payment integration"] },
];

/* Add new entries at the TOP. type: "work" | "education". Optional: mode ("Remote" | "Hybrid" | "On-site"), tags. */
export const jobs = [
  { when:"Jul — Sep 2026", type:"work", role:"Backend AI Engineering Intern", org:"FlyRank AI", tags:["FastAPI","PostgreSQL","Midtrans"],
    points:[["Billing backend.","Built a usage-metering and billing service with FastAPI and PostgreSQL that tracks each account's usage, enforces plan quotas and calculates costs in whole cents."],
            ["Safe payments.","Added idempotency keys and HMAC-SHA512 signed webhooks with Midtrans (sandbox), so a repeated request or notification is never charged twice."],
            ["Tested.","Covered the billing flows with 68 automated tests."]] },
  { when:"Ongoing", type:"education", role:"Informatics", org:"President University, Indonesia",
    points:[["Focus.","Software engineering, backend development and cybersecurity, learned through coursework, personal projects and labs."]] },
];

/* Skills section: the heading's sentence, then one tab per group. Click a tab and its skills appear in the card. */
export const skillsIntro = "A selection of technologies and concepts I've used across projects, internships, and hands-on practice.";

export const stack = [
  { title:"Programming & Development", items:["Python","SQL","JavaScript","TypeScript","Node.js","Flask","FastAPI","Git","GitHub","Docker"] },
  { title:"Cybersecurity", items:["Web application security","Authentication & authorization","Vulnerability analysis","Phishing analysis"] },
  { title:"Tools & Platforms", items:["Linux","Wireshark","SafeLine WAF","VirtualBox","Nmap"] },
  { title:"Concepts & Frameworks", items:["OWASP Top 10","NIST Cybersecurity Framework","Networking","Database Systems"] },
];

/* Add new certificates here. Optional per entry: date, id, verify (URL), skills, expires. status: "earned" | "in progress" (in-progress ones show as an "In development" card under All and their category tab). */
export const certCats = ["Security", "Development", "Other"];
export const certs = [
  { t:"Google Cybersecurity Professional", org:"Google", img:"google-cybersecurity.webp", cat:"Security", status:"earned" },
  { t:"Google AI Professional", org:"Google", img:"google-ai.webp", cat:"Development", status:"earned", date:"Jun 2026" },
  { t:"GitHub Foundations (GH-900)", org:"GitHub", img:"github-foundations.webp", cat:"Development", status:"earned" },
  { t:"AWS Security Fundamentals", org:"Amazon Web Services", img:"aws-security.webp", cat:"Security", status:"earned" },
  { t:"Cybersecurity Analyst Job Simulation", org:"Forage", img:"forage-cyber.webp", cat:"Security", status:"earned" },
  { t:"Pre Security Learning Path", org:"TryHackMe", img:"tryhackme-presecurity.webp", cat:"Security", status:"earned" },
  { t:"Information Security Certification", org:"freeCodeCamp", img:"freecodecamp-infosec.webp", cat:"Security", status:"earned" },
  { t:"TechCrush Cybersecurity Bootcamp", org:"TechCrush", img:"techcrush.webp", cat:"Security", status:"earned" },
  { t:"Backend AI Engineering Internship", org:"FlyRank AI", img:"flyrank-backend-ai.png", cat:"Development", status:"earned", date:"Sep 2026" },
];

/* Optional "Next goals" row on the Certificates page. It only renders when this list has entries, e.g. ["ISC2 CC", "AWS Security Specialty"]. */
export const goals = [];

export const contact = {
  email:"halimamohamedabdirizak@gmail.com",
  linkedin:"https://www.linkedin.com/in/halima-abdirizak-mohamed/",
  github:"https://github.com/hal-imaxabdi",
  cv:"assets/Halima_Abdirizak_CV.pdf"
};
