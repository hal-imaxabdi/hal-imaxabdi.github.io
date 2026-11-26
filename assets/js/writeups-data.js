/*=============== WRITEUPS DATA ===============
   One entry per writeup, rendered by main.js into the Writeups section.
     context  one line: where it comes from and my role
     numbers  [value, label] pairs shown as key numbers
     tools    tool or category chips
     links    buttons; the first one is the primary button */
window.WRITEUPS = [
   {
      title: 'Digital Forensics CTF',
      context: 'Digital Forensic Class 1, President University · Team captain, HIGH CORTISOL',
      desc: 'Seven forensics challenges solved and written up step by step. Traced a phishing email through a packet capture, pulled hidden data out of image colour channels, broke a message locked with three ciphers, found an LDAP exploit\'s crash in a Windows event log, recovered a securely deleted file\'s history from the NTFS journal, and repaired a corrupted PNG at the bit level.',
      numbers: [['7', 'challenges'], ['16', 'parts solved']],
      tools: ['Wireshark', 'Python', 'zsteg', 'binwalk', 'foremost', 'exiftool', 'FTK Imager', 'MFTECmd'],
      links: [
         { label: 'Read writeup', url: 'https://ctf-presuniv.netlify.app/' },
      ],
   },
   {
      title: 'TryHackMe Hacker Holidays',
      context: 'TryHackMe event writeups',
      desc: 'Writeups for 14 rooms across OSINT, AI prompt injection, web exploitation, cloud, forensics and boot2root.',
      numbers: [['14', 'rooms'], ['7 · 6 · 1', 'Easy · Medium · Hard']],
      tools: ['OSINT', 'AI / Prompt injection', 'Web', 'Cloud', 'Forensics', 'Boot2Root'],
      links: [
         { label: 'Read writeups', url: 'https://hal-imaxabdi.github.io/tryhackme-hacker-holidays/' },
         { label: 'Repo', url: 'https://github.com/hal-imaxabdi/tryhackme-hacker-holidays' },
      ],
   },
   {
      title: 'Splunk Boss of the SOC v1 investigation',
      context: 'SOC incident investigation',
      desc: 'Investigated a web defacement and a Cerber ransomware outbreak from raw logs to a written incident report. Followed a brute force that guessed the Joomla admin password after 412 attempts, a web shell and a Meterpreter backdoor, and ransomware that encrypted 970 files on a file server.',
      numbers: [['33M', 'log events'], ['24', 'ATT&CK techniques']],
      tools: ['Splunk SPL', 'VirusTotal', 'MITRE ATT&CK Navigator'],
      links: [
         { label: 'Repo', url: 'https://github.com/hal-imaxabdi/splunk-bots-v1-investigation' },
      ],
   },
]
