

/**
 * LEVELS_DATA — Local game data for all 5 levels.
 * Used as fallback if backend is unavailable,
 * or directly if you prefer no API call for questions.
 *
 * Structure per level:
 *  id, title, icon, description, topic, questions[]
 *
 * Structure per question:
 *  scenario, question, options[], correctIndex, explanation
 */

export const LEVELS_DATA = [

  // ════════════════════════════════════════════════
  // LEVEL 1 — Password Security
  // ════════════════════════════════════════════════
  {
    id: 1,
    title: "Password Security",
    icon: "🔐",
    description: "Learn how to create and manage strong passwords.",
    topic: "password",

    questions: [
      {
        scenario:
          "You're creating an account on a banking website. The password field accepts up to 20 characters.",
        question: "Which of the following is the STRONGEST password?",
        options: [
          "password123",
          "John1990",
          "T#9vL!mQ2@xZ",
          "ilovecats",
        ],
        correctIndex: 2,
        explanation:
          "A strong password uses a mix of uppercase, lowercase, numbers, and special characters with no real words. 'T#9vL!mQ2@xZ' is random, long, and complex — making it extremely hard to brute-force.",
      },
      {
        scenario:
          "You have accounts on Gmail, Facebook, Netflix, and your bank. All have the same password.",
        question: "What is the main risk of reusing the same password everywhere?",
        options: [
          "It makes login slower",
          "If one site is hacked, all accounts are at risk",
          "Passwords expire faster",
          "It uses more memory",
        ],
        correctIndex: 1,
        explanation:
          "This is called 'credential stuffing.' If hackers breach one website and get your password, they'll try it on every other service. Always use unique passwords per site.",
      },
      {
        scenario:
          "Your company requires you to change your password every 90 days.",
        question: "What is the BEST practice when creating a new password?",
        options: [
          "Add '1' to the end of your old password",
          "Use your name + current year",
          "Create a completely new random passphrase",
          "Use your colleague's password temporarily",
        ],
        correctIndex: 2,
        explanation:
          "Simply modifying old passwords (e.g., 'Pass1' → 'Pass2') is predictable and easily guessed. A fresh, random passphrase or password manager-generated string is safest.",
      },
    ],
  },

  // ════════════════════════════════════════════════
  // LEVEL 2 — Phishing Detection
  // ════════════════════════════════════════════════
  {
    id: 2,
    title: "Phishing Detection",
    icon: "🎣",
    description: "Identify and avoid phishing emails and fake websites.",
    topic: "phishing",

    questions: [
      {
        scenario:
          "You receive an email: 'URGENT: Your PayPal account has been suspended! Click here to verify: www.paypa1-secure.com/login'",
        question: "What is the biggest red flag in this email?",
        options: [
          "The word URGENT in caps",
          "The misspelled domain (paypa1 instead of paypal)",
          "It mentions your account",
          "It has a link",
        ],
        correctIndex: 1,
        explanation:
          "Phishers use lookalike domains like 'paypa1.com' (number 1 instead of letter l) to trick users. Always inspect the exact URL before clicking. Legitimate companies use their real domain.",
      },
      {
        scenario:
          "An email from 'support@amaz0n-help.net' says your order is on hold and asks for your credit card details to re-confirm.",
        question: "What should you do?",
        options: [
          "Reply with your credit card details",
          "Click the link and log in to check",
          "Delete the email and go directly to Amazon.com",
          "Forward to your friends as a warning",
        ],
        correctIndex: 2,
        explanation:
          "Never trust email links for sensitive actions. Go directly to the official website by typing it in your browser. Amazon will NEVER ask for your card details via email.",
      },
      {
        scenario:
          "You hover over a button that says 'Reset Password' in an email and the URL at the bottom shows: http://192.168.1.1/reset?user=you",
        question: "Why is this suspicious?",
        options: [
          "Password resets are always scams",
          "An IP address URL is used instead of a real domain name",
          "The button text says Reset",
          "It uses HTTP instead of HTTPS only",
        ],
        correctIndex: 1,
        explanation:
          "Legitimate services always use their domain (e.g., google.com/reset), never raw IP addresses. An IP address in a link is a strong indicator of phishing or malicious redirection.",
      },
    ],
  },

  // ════════════════════════════════════════════════
  // LEVEL 3 — Social Engineering
  // ════════════════════════════════════════════════
  {
    id: 3,
    title: "Social Engineering",
    icon: "🎭",
    description: "Recognize manipulation tactics used by attackers.",
    topic: "social-engineering",

    questions: [
      {
        scenario:
          "A caller says: 'Hi, this is Mike from IT. We're doing urgent maintenance. I need your password to fix your account before it gets locked.'",
        question: "What should you do?",
        options: [
          "Give the password since it's IT",
          "Ask for his employee ID and hang up, then call IT directly",
          "Give a fake password to test him",
          "Email your password instead of saying it aloud",
        ],
        correctIndex: 1,
        explanation:
          "This is a classic 'vishing' (voice phishing) attack. Legitimate IT staff NEVER need your password. Always verify the caller's identity through official channels — hang up and call IT yourself.",
      },
      {
        scenario:
          "A stranger tailgates you through the secured office door, saying 'Thanks! My hands are full of boxes.'",
        question: "What is this attack called, and what should you do?",
        options: [
          "Phishing — report to email security",
          "Tailgating — politely stop them and ask for their badge",
          "Malware — scan your device",
          "Spoofing — ignore it",
        ],
        correctIndex: 1,
        explanation:
          "Tailgating is a physical social engineering attack where an attacker follows an authorized person into a restricted area. Always verify identity before letting anyone piggyback on your access.",
      },
      {
        scenario:
          "You find a USB drive labeled 'Q3 Salary Report' in the office parking lot.",
        question: "What should you do with it?",
        options: [
          "Plug it in to find the owner",
          "Keep it, it might be useful",
          "Hand it to IT/security without plugging it in",
          "Plug it into an old computer to be safe",
        ],
        correctIndex: 2,
        explanation:
          "This is a 'USB drop attack.' Attackers leave infected drives with enticing labels. Plugging it in can instantly install malware. Always give unknown USB drives to IT — never plug them in.",
      },
    ],
  },

  // ════════════════════════════════════════════════
  // LEVEL 4 — Malware Awareness
  // ════════════════════════════════════════════════
  {
    id: 4,
    title: "Malware Awareness",
    icon: "🦠",
    description: "Understand different types of malware and how to avoid them.",
    topic: "malware",

    questions: [
      {
        scenario:
          "After downloading a free game, all your files are renamed to '.locked' and a message demands $500 in Bitcoin to unlock them.",
        question: "What type of malware is this?",
        options: [
          "Spyware",
          "Ransomware",
          "Adware",
          "Trojan",
        ],
        correctIndex: 1,
        explanation:
          "This is ransomware — it encrypts your files and demands payment for decryption. The best defense is regular backups, never paying the ransom (no guarantee of recovery), and avoiding untrusted downloads.",
      },
      {
        scenario:
          "A pop-up appears: '⚠️ VIRUS DETECTED! Your PC is at risk! Call 1-800-FIX-NOW immediately to speak with a Microsoft technician!'",
        question: "What is this?",
        options: [
          "A real Windows warning",
          "A scareware/tech support scam",
          "A legitimate antivirus alert",
          "A firewall notification",
        ],
        correctIndex: 1,
        explanation:
          "Microsoft never displays phone numbers in browser pop-ups. This is 'scareware' designed to frighten you into calling scammers who will charge money or gain remote access to your PC. Close the browser tab.",
      },
      {
        scenario:
          "A free PDF converter app you installed shows ads, tracks your browsing, and slowed your computer significantly.",
        question: "What most likely happened?",
        options: [
          "Your internet is slow",
          "The app is a legitimate tool with ads",
          "The app bundled adware/spyware during installation",
          "Your antivirus is blocking the app",
        ],
        correctIndex: 2,
        explanation:
          "Many 'free' tools bundle unwanted software during installation. Always choose 'Custom Install,' uncheck extra software, and use trusted sources like official websites or verified app stores.",
      },
    ],
  },

  // ════════════════════════════════════════════════
  // LEVEL 5 — Encryption Basics
  // ════════════════════════════════════════════════
  {
    id: 5,
    title: "Encryption Basics",
    icon: "🔒",
    description: "Understand how encryption protects your data.",
    topic: "encryption",

    questions: [
      {
        scenario:
          "You're logging into your bank at a coffee shop using public Wi-Fi. The browser shows a padlock icon and 'https://'.",
        question: "What does the HTTPS padlock mean?",
        options: [
          "The website is government-approved",
          "Your connection to the site is encrypted",
          "The Wi-Fi is secure",
          "Your device has no viruses",
        ],
        correctIndex: 1,
        explanation:
          "HTTPS means the data between your browser and the website is encrypted using TLS/SSL. Attackers on the same Wi-Fi cannot read your login credentials. However, HTTPS does NOT make the website itself trustworthy.",
      },
      {
        scenario:
          "You send a message through an app that advertises 'End-to-End Encryption.'",
        question: "What does end-to-end encryption guarantee?",
        options: [
          "Only you and the recipient can read the message",
          "The app company can read messages to check for spam",
          "Messages are stored unencrypted on the server",
          "Only the app developer can decrypt messages",
        ],
        correctIndex: 0,
        explanation:
          "End-to-end encryption (E2EE) means only the sender and recipient hold the decryption keys. Not even the app company can read the messages. Apps like Signal use true E2EE.",
      },
      {
        scenario:
          "A company stores user passwords as plain text in a database. The database gets hacked.",
        question: "What should the company have done instead?",
        options: [
          "Stored passwords in a spreadsheet",
          "Hashed passwords using a strong algorithm like bcrypt",
          "Encrypted passwords using a key stored on the same server",
          "Asked users to use shorter passwords",
        ],
        correctIndex: 1,
        explanation:
          "Passwords should NEVER be stored as plain text. Hashing with bcrypt converts passwords into irreversible hashes. Even if the database is stolen, attackers can't reverse the hash to get the original password.",
      },
    ],
  },
];

// ── Helper: get a single level by ID ──────────────────────────────────────
export const getLevelById = (id) =>
  LEVELS_DATA.find((level) => level.id === id) || null;

// ── Helper: get total levels count ────────────────────────────────────────
export const getTotalLevels = () => LEVELS_DATA.length;

