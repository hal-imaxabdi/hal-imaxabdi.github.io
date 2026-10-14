// ✏️ EDIT YOUR CONTENT HERE, then run:  npm run build
export const G = "https://github.com/hal-imaxabdi/";

export const me = {
  name: "Halima Abdirizak Mohamed",
  short: "Halima", // home page greeting: "Hi, I'm Halima"
  tagline: "Informatics student at President University, focused on cybersecurity and backend development.", // one line under the greeting: who you are
};

/* About section: one string per paragraph. */
export const about = [
  "I'm Halima, a third-year Informatics student at President University, specializing in cybersecurity. I enjoy understanding how technology works, building with it, and finding ways to make it safer.",
  "Cybersecurity and backend development are where I spend most of my time, from SOC labs and security projects to APIs I build and test myself. I'm curious, hands-on, and always happy to learn from the people around me, and I'll stay with a problem until I understand it properly.",
];

/* Projects appear in this order. SEMIS and Hookline are the two big cards.
   repo = GitHub repo name   live = add a demo URL and a "Live demo" button appears   pos = image crop (CSS object-position) */
export const projects = [
  { t:"SEMIS", k:"Secure employee management system", img:"semis.webp", repo:"SEMIS-Secure-Employee-Management-Information-System", live:"",
    d:"An internal HR platform built security-first: multi-factor authentication, role-based access control and AES-256 encrypted sensitive fields.",
    tags:["Node.js","MongoDB","MFA","RBAC","AES-256"] },
  { t:"Hookline", k:"Chrome extension · Phishing detection", img:"hookline.webp", repo:"hookline", live:"", pos:"right top",
    d:"Flags phishing links before you click and shows the evidence behind every verdict, so you can judge it yourself.",
    tags:["TypeScript","React","FastAPI"] },
  { t:"AuditShield", k:"Risk & audit platform", img:"ai-risk.webp", repo:"AI-Assisted-Risk-Assessment-Security-Audit-Platform", live:"",
    d:"51 NIST CSF controls, generated audit reports, and a local AI model that explains findings in plain language.",
    tags:["Flask","Ollama","NIST CSF"] },
  { t:"SOC Homelab", k:"Detection engineering", img:"soc-homelab.webp", repo:"Soc-Homelab", live:"",
    d:"Windows and Linux machines ship Sysmon logs into Elastic SIEM, where I wrote custom detections and tested them with attacks from Kali.",
    tags:["Elastic","Sysmon","Kali"] },
  { t:"WAF Homelab", k:"Web application firewall", img:"waf-homelab.webp", repo:"WAF-HomeLab-SafeLine", live:"",
    d:"A SafeLine firewall in front of a deliberately vulnerable app. Common web attacks, launched and blocked.",
    tags:["SafeLine","Apache","Linux"] },
  { t:"FlyRank Billing Engine", k:"Backend · Payments", repo:"flyrank-billing-engine", live:"",
    d:"A billing API where retries and duplicate webhooks never double-count. Every webhook is verified, every event idempotent.",
    tags:["FastAPI","PostgreSQL","68 tests"],
    code:["def handle_webhook(body, signature):","    expected = hmac_sha512(SECRET, body)","    if not compare_digest(expected, signature):","        raise Reject(401)      # forged","    if already_processed(event.id):","        return ok()            # retry: do nothing","    charge_once(event)","","# simplified illustration"] },
  { t:"Flask Auth Lab", k:"Authentication security", repo:"Secure-Flask-Authentication-Lab", live:"",
    d:"One login, built twice: vulnerable and hardened, then attacked with a brute-force script to show the difference.",
    tags:["Flask","bcrypt","JWT"],
    code:["# vulnerable","if password == user.password:   # plain text","    login()","","# hardened","if bcrypt.checkpw(pw, user.hash):","    return jwt.encode(claims)"] },
];

export const jobs = [
  { when:"Sep 2026 — Now", role:"Cybersecurity Intern", org:"ElectraWireless", d:"Built SHA-256 malware detection for an IoT firmware scanner and kept 130+ tests passing." },
  { when:"Aug — Sep 2026", role:"SOC Analyst Intern", org:"TechBiz Security", d:"Investigated brute-force and phishing attacks. Built a Splunk SIEM lab with alerting." },
  { when:"Jul — Sep 2026", role:"Backend AI Intern", org:"FlyRank AI", d:"Secured payment webhooks with HMAC-SHA512 and blocked duplicate charges. 68 tests." },
];

/* Skills panels. Each item: [name, icon].
   An icon that matches a logo key shows the official logo (python, fastapi, flask, node, php, postgres, docker, git,
   splunk, elastic, kali, wireshark, pytest, owasp, safeline). The others have no single official logo, so they get a simple line icon
   (activity, mail, alert, check, grid ...). */
export const stack = [
  { title:"Defend", items:[["SOC monitoring","activity"],["Splunk","splunk"],["Elastic SIEM","elastic"],["Phishing analysis","mail"],["Malware detection","alert"],["MITRE ATT&CK","grid"],["NIST CSF","check"]] },
  { title:"Build", items:[["Python","python"],["FastAPI","fastapi"],["Flask","flask"],["Node.js","node"],["PHP","php"],["PostgreSQL","postgres"],["Docker","docker"],["Git","git"]] },
  { title:"Test", items:[["Kali Linux","kali"],["Wireshark","wireshark"],["SafeLine WAF","safeline"],["Web app security","owasp"],["pytest","pytest"]] },
];

/* Certificates: logo = brand logo shown on the tile. "google", "github" and "aws" are built in.
   For the others, put the official logo file in site/assets/logos/ (svg or png) and set logo to its file name;
   until the file exists, a clean wordmark is shown. img = certificate image in site/assets/certs/ (shown when clicked). */
export const certs = [
  { t:"Google Cybersecurity Professional", org:"Google", logo:"google", img:"google-cybersecurity.webp" },
  { t:"Google AI Professional", org:"Google", logo:"google", img:"google-ai.webp" },
  { t:"GitHub Foundations (GH-900)", org:"GitHub", logo:"github", img:"github-foundations.webp" },
  { t:"TechCrush Cybersecurity Bootcamp", org:"TechCrush", mark:"TechCrush", img:"techcrush.webp" },
  { t:"Cybersecurity Analyst Simulation", org:"Forage", mark:"Forage", img:"forage-cyber.webp" },
  { t:"Pre Security Learning Path", org:"TryHackMe", mark:"TryHackMe", img:"tryhackme-presecurity.webp" },
  { t:"Information Security Certification", org:"freeCodeCamp", mark:"freeCodeCamp", img:"freecodecamp-infosec.webp" },
  { t:"AWS Security Fundamentals", org:"Amazon Web Services", mark:"aws", logo:"aws", img:"aws-security.webp" },
];

export const contact = {
  email:"halimamohamedabdirizak@gmail.com",
  linkedin:"https://www.linkedin.com/in/halima-abdirizak-mohamed/",
  github:"https://github.com/hal-imaxabdi",
};