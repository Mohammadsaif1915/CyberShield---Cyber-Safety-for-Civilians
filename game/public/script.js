/* ========== DOM ========== */
const homeScreen       = document.getElementById("homeScreen");
const levelScreen      = document.getElementById("levelScreen");
const loadingScreen    = document.getElementById("loadingScreen");
const introScreen      = document.getElementById("introScreen");
const mapCanvas        = document.getElementById("mapCanvas");
const settingsBox      = document.getElementById("settingsBox");
const profileBox       = document.getElementById("profileBox");
const settingsOverlay  = document.getElementById("settingsOverlay");
const profileOverlay   = document.getElementById("profileOverlay");
const levelModal       = document.getElementById("levelModal");
const levelModalOverlay = document.getElementById("levelModalOverlay");
const nameInput        = document.getElementById("nameInput");
const nameError        = document.getElementById("nameError");
const userLabel        = document.getElementById("userLabel");
const profileTitle     = document.getElementById("profileTitle");
const profileSubmitBtn = document.getElementById("profileSubmitBtn");
const logoutBtn        = document.getElementById("logoutBtn");
const profileIconBtn   = document.getElementById("profileIconBtn");
const settingsIconBtn  = document.getElementById("settingsIconBtn");
const profileCreateView = document.getElementById("profileCreateView");
const profileViewMode  = document.getElementById("profileViewMode");
const agentName = document.getElementById("agentName");
const agentId   = document.getElementById("agentId");
const astatLvl  = document.getElementById("astatLvl");
const astatRank = document.getElementById("astatRank");

/* ========== AUDIO ========== */
const clickSound = new Audio("click.mp3");
const bgMusic    = new Audio("bg-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.2;

let audioUnlocked = false;
let soundOn    = true;
let musicOn    = true;
let scanlineOn = true;
let lightTheme = false;

/* ========== LEVEL DATA ========== */
const TOTAL_LEVELS   = 1000;
const LEVELS_VISIBLE = 50;
let levels = {};
let currentLevelSelected = null;

const LEVEL_TYPES  = ["FIREWALL","MALWARE","PHISHING","BOTNET","DDOS","RANSOMWARE","SPYWARE","TROJAN"];
const DIFFICULTIES = ["EASY","EASY","EASY","MEDIUM","MEDIUM","HARD","HARD","ELITE"];

/* ========== INIT ========== */
function initLevels() {
  const saved = localStorage.getItem("levels_v2");
  if (saved) {
    levels = JSON.parse(saved);
  } else {
    for (let i = 1; i <= TOTAL_LEVELS; i++)
      levels[i] = { unlocked: i === 1, completed: false };
    saveLevels();
  }
}

function saveLevels() {
  localStorage.setItem("levels_v2", JSON.stringify(levels));
}

function getCompletedCount() {
  return Object.values(levels).filter(l => l.completed).length;
}

function getUnlockedCount() {
  return Object.values(levels).filter(l => l.unlocked).length;
}

function getRank(completed) {
  if (completed >= 500) return "S+";
  if (completed >= 200) return "S";
  if (completed >= 100) return "A";
  if (completed >= 50)  return "B";
  if (completed >= 20)  return "C";
  if (completed >= 5)   return "D";
  return "E";
}

function updateStats() {
  document.getElementById("statLevels").textContent    = TOTAL_LEVELS;
  document.getElementById("statUnlocked").textContent  = getUnlockedCount();
  document.getElementById("statCompleted").textContent = getCompletedCount();
  document.getElementById("progressText").textContent  = `${getCompletedCount()} / ${TOTAL_LEVELS}`;
}

/* ========== PARTICLES ========== */
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  const ctx    = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({length: 60}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r:  Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.6 + 0.2
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,200,${p.alpha})`;
      ctx.fill();
    });
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,255,200,${0.08 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener("resize", () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

/* ========== CLOCK ========== */
function updateClock() {
  const el = document.getElementById("footerTime");
  if (el) el.textContent = new Date().toLocaleTimeString("en-US", {hour:"2-digit", minute:"2-digit"});
}
setInterval(updateClock, 1000);
updateClock();

/* ========== MAP ========== */
function renderMap() {
  const NODE_SIZE = 68;
  const SPACING_X = 130;
  const START_X   = 120;
  const CENTER_Y  = 260;
  const WAVE_AMP  = 130;
  const totalW    = START_X + LEVELS_VISIBLE * SPACING_X + START_X;
  const totalH    = CENTER_Y + WAVE_AMP + 140;

  const positions = [];
  for (let i = 1; i <= LEVELS_VISIBLE; i++) {
    positions.push({
      x: START_X + (i - 1) * SPACING_X,
      y: CENTER_Y + Math.sin(i * 0.55) * WAVE_AMP
    });
  }

  // SVG — behind nodes
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.style.cssText = `position:absolute;top:0;left:0;width:${totalW}px;height:${totalH}px;pointer-events:none;z-index:2;overflow:visible;`;

  // Glow filter
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML =
    '<filter id="lineGlow" x="-60%" y="-60%" width="220%" height="220%">' +
    '<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>' +
    '<feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
    '</filter>';
  svg.appendChild(defs);

  // Draw paths
  for (let i = 1; i < positions.length; i++) {
    const {x: ax, y: ay} = positions[i - 1];
    const {x: bx, y: by} = positions[i];
    const half = NODE_SIZE / 2;
    const mx = (ax + bx) / 2;
    const my = Math.min(ay, by) - 55;
    const d  = `M ${ax+half} ${ay+half} Q ${mx} ${my} ${bx+half} ${by+half}`;

    // Glow
    const glow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    glow.setAttribute("d", d);
    glow.setAttribute("fill", "none");
    glow.setAttribute("stroke", "rgba(0,255,200,0.55)");
    glow.setAttribute("stroke-width", "5");
    glow.setAttribute("filter", "url(#lineGlow)");
    svg.appendChild(glow);

    // Core dashed
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", d);
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "rgba(0,255,200,0.95)");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-dasharray", "10 6");
    line.style.animation = `dashFlow ${1.5 + i * 0.05}s linear infinite`;
    svg.appendChild(line);
  }

  // Wrapper
  const inner = document.createElement("div");
  inner.style.cssText = `position:relative;width:${totalW}px;height:${totalH}px;`;
  inner.appendChild(svg);

  // Nodes on top of SVG
  for (let i = 1; i <= LEVELS_VISIBLE; i++) {
    const {x, y} = positions[i - 1];
    const isCompleted = levels[i].completed;
    const isUnlocked  = levels[i].unlocked;

    const node = document.createElement("div");
    node.className = `level-node ${isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked"}`;
    node.style.cssText = `left:${x}px;top:${y}px;position:absolute;z-index:10;opacity:0;transform:scale(0.5);`;
    node.dataset.level = i;

    if (isCompleted) {
      node.innerHTML = '<span class="check">✔</span><span class="level-num">' + i + '</span>';
    } else if (isUnlocked) {
      node.innerHTML = '<span class="level-num">' + i + '</span>';
    } else {
      node.innerHTML = '<span class="lock">🔒</span><span class="level-num">' + i + '</span>';
    }

    setTimeout(((n) => () => {
      n.style.transition = "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)";
      n.style.opacity = "1";
      n.style.transform = "scale(1)";
    })(node), 25 * i);

    inner.appendChild(node);
  }

  mapCanvas.innerHTML = "";
  mapCanvas.appendChild(inner);

  setTimeout(() => {
    const target = mapCanvas.querySelector(".level-node.unlocked") ||
                   mapCanvas.querySelector(".level-node.completed");
    if (target) {
      const nodeLeft = parseInt(target.style.left);
      mapCanvas.scrollLeft = Math.max(0, nodeLeft - window.innerWidth / 2 + NODE_SIZE / 2);
    }
  }, 120);
}

/* ========== LEVEL CLICK ========== */
document.addEventListener("click", e => {
  const node = e.target.closest(".level-node");
  if (!node) return;
  currentLevelSelected = parseInt(node.dataset.level);
  openLevelModal(currentLevelSelected);
});

function openLevelModal(lvl) {
  const isUnlocked  = levels[lvl].unlocked;
  const isCompleted = levels[lvl].completed;
  const typeIdx = (lvl - 1) % LEVEL_TYPES.length;
  const diffIdx = Math.min(Math.floor((lvl - 1) / 125), DIFFICULTIES.length - 1);
  const xp = 100 + (lvl - 1) * 10;

  document.getElementById("levelModalTitle").textContent = `MISSION ${lvl}`;
  document.getElementById("levelModalIcon").textContent  = isCompleted ? "✅" : isUnlocked ? "🎮" : "🔒";
  document.getElementById("missionDiff").textContent     = DIFFICULTIES[diffIdx];
  document.getElementById("missionType").textContent     = LEVEL_TYPES[typeIdx];
  document.getElementById("missionXP").textContent       = `+${xp}`;

  const playBtn   = document.getElementById("playLevelBtn");
  const lockedMsg = document.getElementById("levelLockedMsg");

  if (isUnlocked) {
    playBtn.style.display   = "block";
    lockedMsg.style.display = "none";
    playBtn.textContent     = isCompleted ? "REPLAY MISSION" : "LAUNCH MISSION";
  } else {
    playBtn.style.display   = "none";
    lockedMsg.style.display = "block";
  }

  openPopup(levelModal, levelModalOverlay);
}

function playLevel() {
  const lvl = currentLevelSelected;
  closeLevelModal();
  showToast(`🎮 Launching Mission ${lvl}...`);
  setTimeout(() => {
    levels[lvl].completed = true;
    if (lvl < TOTAL_LEVELS) levels[lvl + 1].unlocked = true;
    saveLevels();
    updateStats();
    renderMap();
    updateAgentStats();
    showToast(`✔ Mission ${lvl} Complete! +${100 + (lvl - 1) * 10} XP`);
  }, 1200);
}

/* ========== GAME FLOW ========== */
function startGame() {
  levelScreen.style.display = "flex";
  homeScreen.style.display  = "none";
  renderMap();
  updateStats();
}

function goHome() {
  homeScreen.style.display  = "flex";
  levelScreen.style.display = "none";
  updateStats();
}

/* ========== POPUPS ========== */
function openPopup(popup, overlay) {
  overlay.classList.add("active");
  popup.style.display = "block";
  requestAnimationFrame(() => popup.classList.add("active"));
}

function closePopup(popup, overlay) {
  popup.classList.remove("active");
  overlay.classList.remove("active");
  setTimeout(() => { popup.style.display = "none"; }, 260);
}

/* ========== PROFILE ========== */
function toggleProfile() {
  if (profileBox.classList.contains("active")) { closeProfile(); return; }
  closeSettings();
  const user = JSON.parse(localStorage.getItem("user_v2"));
  if (user) {
    profileTitle.textContent = user.name.toUpperCase();
    agentName.textContent    = user.name;
    agentId.textContent      = "ID: " + user.id;
    updateAgentStats();
    profileCreateView.style.display = "none";
    profileViewMode.style.display   = "block";
  } else {
    profileTitle.textContent = "CREATE AGENT";
    profileCreateView.style.display = "block";
    profileViewMode.style.display   = "none";
    nameInput.value = "";
    nameError.style.display = "none";
  }
  profileIconBtn.classList.add("active");
  openPopup(profileBox, profileOverlay);
}

function closeProfile() {
  closePopup(profileBox, profileOverlay);
  profileIconBtn.classList.remove("active");
}

function updateAgentStats() {
  const completed  = getCompletedCount();
  astatLvl.textContent  = completed;
  astatRank.textContent = getRank(completed);
}

profileSubmitBtn.onclick = function () {
  const name = nameInput.value.trim();
  nameError.style.display = "none";
  nameError.textContent   = "";
  if (!name) { nameError.textContent = "⚠ Agent codename required"; nameError.style.display = "block"; return; }
  if (name.length < 3) { nameError.textContent = "⚠ Minimum 3 characters required"; nameError.style.display = "block"; return; }
  if (!/^[A-Za-z0-9._]+$/.test(name)) { nameError.textContent = "⚠ Only letters, numbers, . and _ allowed"; nameError.style.display = "block"; return; }
  const user = { name, id: "CY-" + Math.floor(100000 + Math.random() * 900000) };
  localStorage.setItem("user_v2", JSON.stringify(user));
  updateUserLabel();
  profileTitle.textContent = user.name.toUpperCase();
  agentName.textContent    = user.name;
  agentId.textContent      = "ID: " + user.id;
  updateAgentStats();
  profileCreateView.style.display = "none";
  profileViewMode.style.display   = "block";
  showToast("✔ Agent registered: " + user.name);
};

logoutBtn.onclick = function () {
  localStorage.removeItem("user_v2");
  updateUserLabel();
  closeProfile();
  showToast("👋 Agent logged out");
};

function updateUserLabel() {
  const user = JSON.parse(localStorage.getItem("user_v2"));
  userLabel.textContent = user ? user.name : "";
}

/* ========== SETTINGS ========== */
function toggleSettings() {
  if (settingsBox.classList.contains("active")) { closeSettings(); return; }
  closeProfile();
  settingsIconBtn.classList.add("active");
  openPopup(settingsBox, settingsOverlay);
}

function closeSettings() {
  closePopup(settingsBox, settingsOverlay);
  settingsIconBtn.classList.remove("active");
}

function closeLevelModal() {
  closePopup(levelModal, levelModalOverlay);
}

function toggleScanline() {
  scanlineOn = !scanlineOn;
  document.body.classList.toggle("scanline-off", !scanlineOn);
  document.getElementById("scanBtn").classList.toggle("active", scanlineOn);
}

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("soundBtn").classList.toggle("active", soundOn);
}

function toggleMusic() {
  musicOn = !musicOn;
  document.getElementById("musicBtn").classList.toggle("active", musicOn);
  if (!musicOn) bgMusic.pause();
  else if (audioUnlocked) bgMusic.play().catch(() => {});
}

function toggleTheme() {
  lightTheme = !lightTheme;
  document.body.classList.toggle("light-theme", lightTheme);
  document.getElementById("themeBtn").classList.toggle("active", lightTheme);
}

/* ========== SCROLL ========== */
levelScreen.addEventListener("wheel", function (e) {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault();
    mapCanvas.scrollLeft += e.deltaY * 0.8;
  }
}, { passive: false });

/* ========== AUDIO ========== */
document.body.addEventListener("click", function (e) {
  if (!audioUnlocked) {
    audioUnlocked = true;
    [bgMusic, clickSound].forEach(a => {
      a.muted = true;
      a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; }).catch(() => {});
    });
  }
  if (soundOn && (e.target.closest("button") || e.target.closest(".level-node"))) {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }
  if (musicOn && bgMusic.paused && audioUnlocked) {
    bgMusic.play().catch(() => {});
  }
}, true);

/* ========== TOAST ========== */
function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.className   = "toast";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1300);
}

/* ========== BOOT ========== */
initLevels();
updateUserLabel();
updateStats();
initParticles();

homeScreen.style.display  = "none";
levelScreen.style.display = "none";
introScreen.style.display = "none";
loadingScreen.style.display = "flex";

setTimeout(() => {
  loadingScreen.style.display = "none";
  introScreen.style.display   = "flex";
}, 2800);

setTimeout(() => {
  introScreen.style.display = "none";
  homeScreen.style.display  = "flex";
}, 6800);

/* ═══════════════════════════════════════════════════════════════
   CYBER DEFENSE — GAME ENGINE
   Add this entire block at the bottom of script.js
═══════════════════════════════════════════════════════════════ */

/* ── GAME DATA ─────────────────────────────────────────────────
   5 levels × 3 questions each
   Types: "email" | "terminal" | "sms" | "browser"
──────────────────────────────────────────────────────────────── */
const GAME_DATA = {

  /* ╔══════════════════════════════════╗
     ║  LEVEL 1 — PASSWORD SECURITY    ║
     ╚══════════════════════════════════╝ */
  1: {
    id: 1, title: "PASSWORD SECURITY", icon: "🔐",
    questions: [
      {
        type: "terminal",
        context: "You are the security officer at a company. A new employee just created their work account password and you're reviewing it in the audit terminal.",
        scenario: {
          title: "SECURITY-AUDIT v1.0",
          lines: [
            { text: "$ run password-analyzer --target 'sarah2024'", cls: "" },
            { text: "  Scanning dictionary patterns...", cls: "t-dim", delay: 350 },
            { text: "  ► Real name detected: 'sarah'  ⚠", cls: "t-warn", delay: 700 },
            { text: "  ► Year pattern detected: '2024' ⚠", cls: "t-warn", delay: 1050 },
            { text: "  ► No special characters found  ⚠", cls: "t-warn", delay: 1400 },
            { text: "  ► Estimated crack time: < 1 min", cls: "t-danger", delay: 1750 },
            { text: "  Awaiting your verdict..._", cls: "", delay: 2100 }
          ]
        },
        question: "The system flagged this password. How would you classify it?",
        choices: [
          { icon: "💀", text: "Critically Weak",    sub: "Reject — force change immediately" },
          { icon: "⚠️", text: "Weak but Passable",  sub: "Warn user and monitor" },
          { icon: "✅", text: "Acceptable",          sub: "Meets basic requirements" },
          { icon: "🔒", text: "Strong",              sub: "No action needed" }
        ],
        correctIndex: 0,
        explanation: "'sarah2024' contains a real name + a year — the two most predictable password patterns. Modern cracking tools break these in under a minute using dictionary attacks. A strong password must be random, 12+ characters, mixing uppercase, lowercase, numbers, and symbols — with no personal information."
      },
      {
        type: "sms",
        context: "Your work colleague texts you complaining about passwords. They've found a 'solution' to remembering them all.",
        scenario: {
          contact: "Alex — Work",
          sub: "⚠ Potential Security Risk",
          messages: [
            { text: "bro I have like 25 accounts and I keep forgetting passwords 😩", delay: 0 },
            { text: "I just started using the same password for all of them. SO much easier lol", delay: 450 },
            { text: "It's a strong password anyway so it should be fine right?", delay: 900 }
          ]
        },
        question: "What's the real danger with what Alex is doing?",
        choices: [
          { icon: "👍", text: "It's fine",                sub: "One strong password is enough" },
          { icon: "🔑", text: "Use a Password Manager",   sub: "Unique strong password for every site" },
          { icon: "📓", text: "Write them all down",       sub: "Keep a physical notebook" },
          { icon: "🔢", text: "Use 2-3 passwords",         sub: "Rotate between a few strong ones" }
        ],
        correctIndex: 1,
        explanation: "Password reuse is one of the top causes of account takeovers. If ANY one website leaks Alex's password, attackers automatically test it on Gmail, banks, and Netflix — this is called credential stuffing. A password manager generates a unique, random, strong password for every site. You only remember one master password."
      },
      {
        type: "browser",
        context: "You're at an airport using free WiFi. You need to quickly check your bank balance before your flight.",
        scenario: {
          url: "http://nationalbank.com/login",
          isSecure: false,
          content: `<div style="text-align:center;padding:8px 0;font-family:Arial;">
            <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:6px;padding:10px;margin-bottom:14px;font-size:11px;color:#664d03;text-align:left;">
              ⚠️ Your connection is <b>not secure</b>. Others on this network may be able to see what you send.
            </div>
            <h3 style="color:#112;font-size:15px;margin-bottom:12px;">🏦 National Bank — Sign In</h3>
            <div style="background:#f8f8f8;border:1px solid #ddd;border-radius:6px;padding:14px;max-width:240px;margin:0 auto;">
              <input style="width:100%;padding:7px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;font-size:12px;" placeholder="Account Number" disabled/>
              <input style="width:100%;padding:7px;margin-bottom:10px;border:1px solid #ccc;border-radius:4px;font-size:12px;" placeholder="Password" type="password" disabled/>
              <button style="width:100%;padding:8px;background:#005a9e;color:white;border:none;border-radius:4px;font-size:12px;">Login</button>
            </div></div>`
        },
        question: "You need to check your bank account on public WiFi. What do you do?",
        choices: [
          { icon: "✅", text: "Log in — banks are secure",    sub: "Financial sites have protection built in" },
          { icon: "📱", text: "Switch to mobile data",        sub: "Your carrier network, not public WiFi" },
          { icon: "🔄", text: "Reload until HTTPS appears",   sub: "Wait for the padlock icon" },
          { icon: "🌐", text: "Use a VPN first",              sub: "Encrypt all traffic on public networks" }
        ],
        correctIndex: 1,
        explanation: "The 'http://' (no S) means data travels completely unencrypted. On public WiFi, anyone nearby can intercept your login credentials with free tools — no hacking skills needed. Switch to mobile data (your carrier encrypts traffic) or use a VPN. Never enter passwords on HTTP sites, especially on shared networks."
      }
    ]
  },

  /* ╔══════════════════════════════════╗
     ║  LEVEL 2 — PHISHING DETECTION   ║
     ╚══════════════════════════════════╝ */
  2: {
    id: 2, title: "PHISHING DETECTION", icon: "🎣",
    questions: [
      {
        type: "email",
        context: "Monday morning, 7:48 AM. This email is waiting in your inbox when you arrive at work.",
        scenario: {
          from: "security@paypa1-accounts.net",
          subject: "⚠️ URGENT: Your account has been permanently limited",
          to: "you@company.com",
          body: `Dear Valued Customer,<br><br>
We have detected <b>suspicious login attempts</b> on your PayPal account. Your account has been <b style="color:#cc3300">temporarily suspended</b> for your security.<br><br>
You must verify your identity within <b>24 HOURS</b> or your account will be <b>permanently closed</b> and all funds held for 180 days.<br><br>
<a class="email-link" style="font-size:14px;font-weight:bold;">► CLICK HERE TO RESTORE ACCESS ◄</a><br><br>
PayPal Security Team`,
          warning: "⚠ Sent from outside your organization — treat with caution"
        },
        question: "What is the clearest sign this is a phishing email?",
        choices: [
          { icon: "🌐", text: "The sender domain",          sub: "'paypa1-accounts.net' — '1' not 'l'" },
          { icon: "⏰", text: "The fake urgency",            sub: "'24 hours or permanent closure'" },
          { icon: "🔗", text: "The suspicious link",        sub: "No real URL visible on hover" },
          { icon: "✅", text: "It looks completely real",    sub: "I would click to verify my account" }
        ],
        correctIndex: 0,
        explanation: "The sender domain is always your first check — 'paypa1' uses the NUMBER '1' instead of the LETTER 'l'. This homograph trick fools a quick glance. Urgency and hidden links are also red flags, but a fake domain proves it's phishing immediately. Real PayPal only ever emails from @paypal.com — nothing else."
      },
      {
        type: "browser",
        context: "Your IT department sent a company-wide email about a new HR portal. You search for it and click the first result.",
        scenario: {
          url: "https://hr-portal-companyname.web.app/login",
          isSecure: true,
          content: `<div style="text-align:center;padding:8px 0;font-family:Arial;">
            <div style="font-size:30px;margin-bottom:6px;">🏢</div>
            <h3 style="color:#112;font-size:15px;margin-bottom:3px;">Company HR Portal</h3>
            <p style="color:#778;font-size:11px;margin-bottom:14px;">Sign in with your corporate credentials</p>
            <div style="background:#f8f8f8;border:1px solid #ddd;border-radius:6px;padding:14px;max-width:240px;margin:0 auto;">
              <input style="width:100%;padding:7px;margin-bottom:7px;border:1px solid #ccc;border-radius:4px;font-size:11px;" placeholder="Corporate Email" disabled/>
              <input style="width:100%;padding:7px;margin-bottom:10px;border:1px solid #ccc;border-radius:4px;font-size:11px;" placeholder="Password" type="password" disabled/>
              <button style="width:100%;padding:8px;background:#1a3d6e;color:white;border:none;border-radius:4px;font-size:12px;">Sign In</button>
            </div></div>`
        },
        question: "This HR portal has a padlock (HTTPS). Is it safe to enter your credentials?",
        choices: [
          { icon: "✅", text: "Yes — HTTPS means it's secure", sub: "The padlock confirms it's safe" },
          { icon: "🚫", text: "No — wrong domain entirely",    sub: "Real HR portal would be on company's actual domain" },
          { icon: "🧪", text: "Try a fake password first",     sub: "If it accepts anything, it's fake" },
          { icon: "📩", text: "Email IT to get the real link", sub: "Confirm the official URL before logging in" }
        ],
        correctIndex: 1,
        explanation: "HTTPS only means the connection is encrypted — NOT that the website is legitimate. Attackers can get SSL certificates for free in minutes. 'hr-portal-companyname.web.app' is a free Firebase hosting domain, not your company's real domain. Always use the exact URL provided by IT, from a trusted source — never from a Google search result."
      },
      {
        type: "email",
        context: "It's 11:55 AM on a Friday. You receive this email from what appears to be your company CEO.",
        scenario: {
          from: "ceo.williams@your-company-corp.net",
          subject: "Confidential — Urgent Payment Required",
          to: "finance@yourcompany.com",
          body: `Hi,<br><br>
I'm currently in a board meeting and <b>cannot take any calls</b>. I need you to process an <b>urgent wire transfer of $52,000</b> to a new supplier before 3PM today.<br><br>
Beneficiary: Global Supplies Ltd.<br>
Account: 4421-8876-0023<br>
Bank: International Trade Bank<br><br>
<b>This is time-sensitive and strictly confidential.</b> Do not discuss with anyone — I will explain after the meeting. Process immediately.<br><br>
Thanks,<br><i>David Williams, CEO</i>`,
          warning: "⚠ This sender domain does not match your company's registered domain"
        },
        question: "Your CEO is asking you to urgently wire $52,000. What do you do?",
        choices: [
          { icon: "💸", text: "Process it now",              sub: "CEO requests are highest priority" },
          { icon: "📞", text: "Call the CEO directly",       sub: "Verify on a known number — NOT email reply" },
          { icon: "📧", text: "Reply asking for more details", sub: "Confirm over the same email thread" },
          { icon: "⏳", text: "Wait until Monday",           sub: "Urgent Friday requests are always suspicious" }
        ],
        correctIndex: 1,
        explanation: "This is CEO Fraud / Business Email Compromise (BEC) — the FBI reports billions lost annually to this scam. Red flags: wrong email domain (.net vs .com), extreme urgency, secrecy ('tell no one'), and a financial request. NEVER process payments from email alone. Call the CEO directly on a known phone number. Replying to the same email is useless — you're emailing the attacker."
      }
    ]
  },

  /* ╔══════════════════════════════════╗
     ║  LEVEL 3 — SOCIAL ENGINEERING   ║
     ╚══════════════════════════════════╝ */
  3: {
    id: 3, title: "SOCIAL ENGINEERING", icon: "🎭",
    questions: [
      {
        type: "sms",
        context: "You're working from home. You receive a WhatsApp message from an unknown number claiming to be IT support.",
        scenario: {
          contact: "+1 (800) 555-0142",
          sub: "⚠ Unknown Number — Not in contacts",
          messages: [
            { text: "Hello, this is Kevin from IT Support.", delay: 0 },
            { text: "We detected unusual activity on your account. A breach is currently in progress.", delay: 450 },
            { text: "I need your current login password IMMEDIATELY to lock the attacker out. You have 5 minutes before permanent damage.", delay: 900 }
          ]
        },
        question: "An IT support agent urgently needs your password to stop a breach. What do you do?",
        choices: [
          { icon: "🔑", text: "Share the password",          sub: "Stopping the breach is most important" },
          { icon: "🚫", text: "Refuse — report to real IT",  sub: "IT never needs your password. Report this." },
          { icon: "🪪", text: "Ask for employee ID first",   sub: "Verify their identity, then decide" },
          { icon: "🔄", text: "Change password then share",  sub: "New password renders the old one useless" }
        ],
        correctIndex: 1,
        explanation: "Real IT teams NEVER need your password — they have admin tools to manage accounts without it. The '5 minutes' pressure is a manipulation tactic called false urgency, designed to stop you from thinking. This is vishing (voice/text phishing). Report the number to your actual IT department using contact info from your official company directory."
      },
      {
        type: "terminal",
        context: "You're walking to your car in the office parking lot after lunch. You spot something on the ground.",
        scenario: {
          title: "INCIDENT REPORT TERMINAL",
          lines: [
            { text: "$ log-incident --type physical --location 'Parking Bay 7'", cls: "" },
            { text: "  Item found: USB Flash Drive (32GB)", cls: "t-dim", delay: 350 },
            { text: "  Label: 'Q4 SALARY REVIEW — CONFIDENTIAL'", cls: "t-warn", delay: 700 },
            { text: "  Device owner: UNKNOWN", cls: "t-danger", delay: 1050 },
            { text: "  Autorun payload: UNVERIFIED", cls: "t-danger", delay: 1400 },
            { text: "  Last seen near: Visitor parking", cls: "t-warn", delay: 1750 },
            { text: "  Your action required..._", cls: "", delay: 2100 }
          ]
        },
        question: "You found a USB drive labeled with confidential salary data in the parking lot. What do you do?",
        choices: [
          { icon: "💻", text: "Plug into your work PC",      sub: "Check if it has real data inside" },
          { icon: "🖥️", text: "Use an old spare computer",   sub: "Safer to open on a non-critical machine" },
          { icon: "🛡️", text: "Hand to IT Security untouched", sub: "Never plug in unknown devices" },
          { icon: "🗑️", text: "Throw it in the bin",         sub: "Eliminate the threat completely" }
        ],
        correctIndex: 2,
        explanation: "This is a USB drop attack. Attackers deliberately leave drives with tempting labels like 'Salary' or 'Confidential' to trigger curiosity. Plugging it in can silently install malware in under 3 seconds — even on isolated 'spare' computers that share a network. Throwing it away risks someone else plugging it in. Always hand unknown USB drives to IT Security without plugging them in."
      },
      {
        type: "sms",
        context: "You're entering your office building through the secure badge-access door. Someone is right behind you.",
        scenario: {
          contact: "🏢 Physical Security Alert",
          sub: "Situation: Building Entry",
          messages: [
            { text: "A person follows you to the badge reader. They're carrying 3 large boxes stacked up to their chin.", delay: 0 },
            { text: "'Oh thank goodness! Can you hold the door? My hands are completely full and I can't reach my badge!'", delay: 500 },
            { text: "They're wearing a visitor lanyard. On closer look — it expired 4 months ago.", delay: 1000 }
          ]
        },
        question: "Someone needs help through the secure door. What is the correct response?",
        choices: [
          { icon: "🚪", text: "Hold the door open",          sub: "They look genuine, just helping out" },
          { icon: "📦", text: "Carry some boxes for them",   sub: "So they can badge in themselves" },
          { icon: "🛡️", text: "Offer help AFTER they badge", sub: "Hold boxes so they can scan their badge first" },
          { icon: "🚨", text: "Call security immediately",   sub: "Expired badge is an automatic threat" }
        ],
        correctIndex: 2,
        explanation: "This is tailgating — one of the most common physical security attacks. The boxes are often a deliberate prop to prevent badging. The expired lanyard is a major red flag. The correct response: offer to hold their boxes so THEY can scan their badge themselves. This is polite AND secure. Everyone must badge in individually, no exceptions, regardless of how friendly or helpless they seem."
      }
    ]
  },

  /* ╔══════════════════════════════════╗
     ║  LEVEL 4 — MALWARE AWARENESS    ║
     ╚══════════════════════════════════╝ */
  4: {
    id: 4, title: "MALWARE AWARENESS", icon: "🦠",
    questions: [
      {
        type: "browser",
        context: "You're browsing a food blog for dinner recipes. Suddenly, without clicking anything, this appears on screen.",
        scenario: {
          url: "bestrecipes247.com/pasta/carbonara",
          isSecure: false,
          content: `<div class="fake-popup">
            <div class="fake-popup-title">⚠️ CRITICAL VIRUS ALERT</div>
            <div class="fake-popup-body">
              <b>5 viruses detected</b> on your computer!<br>
              Your personal data is at immediate risk.<br><br>
              Call Microsoft Support NOW:<br>
              <b style="font-size:16px;color:#cc3300;">☎ 1-800-642-7676</b>
            </div>
            <button class="fake-popup-btn">REMOVE VIRUSES NOW</button>
          </div>`
        },
        question: "A scary virus warning appeared while reading a recipe. What do you do?",
        choices: [
          { icon: "📞", text: "Call the number now",         sub: "Microsoft support can help remotely" },
          { icon: "🖱️", text: "Click Remove Viruses",        sub: "Let the tool fix the problem" },
          { icon: "❌", text: "Close the browser tab",       sub: "This is scareware — not a real alert" },
          { icon: "🔄", text: "Restart the computer",        sub: "A restart clears most threats" }
        ],
        correctIndex: 2,
        explanation: "This is scareware — a fake alert designed to cause panic. Microsoft NEVER displays phone numbers or virus warnings in your web browser. Real Windows security alerts are system notifications, never browser pop-ups. Calling that number connects you to scammers who charge hundreds of dollars and may install actual malware remotely. Just close the browser tab — nothing happened to your computer."
      },
      {
        type: "browser",
        context: "You need to install VLC Media Player. You Google it and click the top result — an ad.",
        scenario: {
          url: "free-vlc-download-player.net/get-vlc-now",
          isSecure: false,
          content: `<div style="text-align:center;padding:8px 0;font-family:Arial;">
            <h3 style="color:#112;margin-bottom:10px;font-size:14px;">VLC Media Player — Free Official Download</h3>
            <div style="display:flex;flex-direction:column;gap:8px;max-width:240px;margin:0 auto;">
              <button style="padding:11px;background:#ff6600;color:white;border:none;border-radius:5px;font-size:13px;font-weight:bold;cursor:default;">⬇ DOWNLOAD NOW (Recommended)</button>
              <button style="padding:9px;background:#0066cc;color:white;border:none;border-radius:5px;font-size:12px;cursor:default;">⬇ Alternative Download</button>
              <button style="padding:9px;background:#228822;color:white;border:none;border-radius:5px;font-size:12px;cursor:default;">⬇ VLC v3.0.20 Stable</button>
              <p style="color:#e55;font-size:10px;margin:2px 0 0;">⚠ Not affiliated with VideoLAN.org</p>
            </div></div>`
        },
        question: "Three download buttons are shown. Which is actually safe to use?",
        choices: [
          { icon: "🟠", text: "Big orange 'DOWNLOAD NOW'",   sub: "It's labeled Recommended" },
          { icon: "🔵", text: "Blue 'Alternative Download'", sub: "Alternative mirrors are usually official backups" },
          { icon: "🟢", text: "Green version-labeled button", sub: "Shows the exact version number" },
          { icon: "🚫", text: "None — wrong website entirely", sub: "VLC's real site is videolan.org only" }
        ],
        correctIndex: 3,
        explanation: "The entire website is fake. The real VLC is ONLY distributed by VideoLAN at videolan.org. All three buttons likely install malware. Large colorful 'DOWNLOAD NOW' buttons are bait — they install adware, spyware, or worse. The version number label ('v3.0.20') is copied to look authentic. Always download software directly from the official developer's website, never from search result ads."
      },
      {
        type: "terminal",
        context: "You arrive at work and turn on your computer. All your files show strange extensions and this message fills the screen.",
        scenario: {
          title: "SYSTEM MESSAGE",
          lines: [
            { text: "⚠ YOUR FILES HAVE BEEN ENCRYPTED ⚠", cls: "t-danger", delay: 0 },
            { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", cls: "t-dim", delay: 200 },
            { text: "All documents, images, and databases", cls: "t-warn", delay: 500 },
            { text: "are now encrypted with AES-256 RSA.", cls: "t-warn", delay: 750 },
            { text: "", cls: "", delay: 850 },
            { text: "RESTORE ACCESS:", cls: "t-danger", delay: 1050 },
            { text: "Send $3,200 Bitcoin → 1BvBMSEYstWe...", cls: "t-warn", delay: 1300 },
            { text: "DEADLINE: 48 hours. Then files are deleted.", cls: "t-danger", delay: 1600 }
          ]
        },
        question: "Ransomware has encrypted all your files. The deadline is 48 hours. What do you do first?",
        choices: [
          { icon: "💰", text: "Pay the ransom now",           sub: "Get files back before the clock runs out" },
          { icon: "🔌", text: "Disconnect & contact IT",      sub: "Stop spread, report incident, check backups" },
          { icon: "🔄", text: "Restart the computer",         sub: "Restarting may reverse the encryption" },
          { icon: "🛠️", text: "Try free decryption tools",    sub: "Nomoreransom.org has free decryptors" }
        ],
        correctIndex: 1,
        explanation: "First response: disconnect from the network IMMEDIATELY to prevent ransomware from spreading to every connected drive and colleague's machine. Then report to IT — they check for offline backups. NEVER pay the ransom: there's no guarantee of decryption, it funds more attacks, and 80% of paying victims are attacked again. Check nomoreransom.org for free decryptors — many ransomware families have been cracked."
      }
    ]
  },

  /* ╔══════════════════════════════════╗
     ║  LEVEL 5 — ENCRYPTION BASICS    ║
     ╚══════════════════════════════════╝ */
  5: {
    id: 5, title: "ENCRYPTION BASICS", icon: "🔒",
    questions: [
      {
        type: "browser",
        context: "You're on a business trip and need to quickly transfer money via your banking app. You're connected to the hotel's free WiFi.",
        scenario: {
          url: "http://firstnationalbank.com/transfer",
          isSecure: false,
          content: `<div style="text-align:center;padding:8px;font-family:Arial;">
            <div style="background:#fff3cd;border:1px solid #f0ad4e;border-radius:6px;padding:9px;margin-bottom:12px;font-size:11px;color:#664d03;text-align:left;">
              ⚠️ <b>Not secure.</b> Information you submit could be intercepted by others on this network.
            </div>
            <h3 style="color:#112;font-size:14px;margin-bottom:12px;">🏦 Transfer Funds</h3>
            <div style="background:#f8f8f8;border:1px solid #ddd;border-radius:6px;padding:12px;max-width:240px;margin:0 auto;">
              <input style="width:100%;padding:7px;margin-bottom:7px;border:1px solid #ccc;border-radius:3px;font-size:11px;" placeholder="Recipient Account" disabled/>
              <input style="width:100%;padding:7px;margin-bottom:7px;border:1px solid #ccc;border-radius:3px;font-size:11px;" placeholder="Amount ($)" disabled/>
              <input style="width:100%;padding:7px;margin-bottom:10px;border:1px solid #ccc;border-radius:3px;font-size:11px;" placeholder="Your Password" type="password" disabled/>
              <button style="width:100%;padding:8px;background:#005a9e;color:white;border:none;border-radius:3px;font-size:12px;">Confirm Transfer</button>
            </div></div>`
        },
        question: "You need to do online banking on hotel WiFi. This page loads. What do you do?",
        choices: [
          { icon: "✅", text: "Proceed — bank sites are safe", sub: "Financial sites have strong security" },
          { icon: "📱", text: "Use mobile data instead",       sub: "Switch off WiFi — use carrier network" },
          { icon: "🔒", text: "Use a VPN then proceed",        sub: "Encrypt all traffic over public WiFi" },
          { icon: "⏳", text: "Wait until you get home",       sub: "Never bank on public networks at all" }
        ],
        correctIndex: 1,
        explanation: "HTTP (no padlock) on public WiFi is extremely dangerous for banking. Your password and transaction details travel completely unencrypted — anyone on the same WiFi with free software can intercept them in real time. Switch to mobile data: your carrier encrypts traffic end-to-end. Using a VPN (option C) is also correct and the best practice when mobile data isn't available."
      },
      {
        type: "terminal",
        context: "Your company just suffered a database breach. You're examining how user passwords were stored — the results reveal two very different methods.",
        scenario: {
          title: "DATABASE BREACH ANALYSIS",
          lines: [
            { text: "$ SELECT user, password FROM accounts LIMIT 3;", cls: "" },
            { text: "", cls: "t-dim", delay: 250 },
            { text: "  ── Method A (Plain Text) ──────────────", cls: "t-danger", delay: 500 },
            { text: "  alice   | hunter2secure!2024", cls: "t-danger", delay: 750 },
            { text: "  bob     | MyD0gL0vesB0nes", cls: "t-danger", delay: 950 },
            { text: "", cls: "", delay: 1050 },
            { text: "  ── Method B (bcrypt Hashed) ────────────", cls: "t-success", delay: 1200 },
            { text: "  alice   | $2b$12$X9mR2kLp...3aQz [hash]", cls: "", delay: 1450 },
            { text: "  bob     | $2b$12$nPqA7vMw...8fYk [hash]", cls: "", delay: 1650 }
          ]
        },
        question: "The breach exposed the database. Which storage method actually protects the users?",
        choices: [
          { icon: "📄", text: "Plain Text (Method A)",        sub: "Simple and easy for admins to manage" },
          { icon: "🔐", text: "bcrypt Hash (Method B)",       sub: "One-way function — cannot be reversed" },
          { icon: "🔁", text: "Both are equally exposed",     sub: "Once the DB is stolen, all passwords are gone" },
          { icon: "🗝️", text: "Encryption is best",          sub: "Reversible encryption protects better" }
        ],
        correctIndex: 1,
        explanation: "bcrypt hashing is the correct approach. Unlike encryption, hashing is a ONE-WAY mathematical function — you physically cannot reverse a bcrypt hash back to the original password. Attackers who steal Method B only get useless strings. Method A exposes every password instantly. Encryption (option D) is better than plain text but the decryption key can be stolen too. Hashing + salting is the industry standard for password storage."
      },
      {
        type: "sms",
        context: "A friend is planning a sensitive conversation with you and wants to know which messaging app is actually private.",
        scenario: {
          contact: "Jordan 👤",
          sub: "Friend",
          messages: [
            { text: "Hey I want to talk about something private. What app should we use?", delay: 0 },
            { text: "I was thinking WhatsApp since it says end-to-end encrypted? 🤔", delay: 500 },
            { text: "Or just normal SMS? What actually gives us the most privacy?", delay: 1000 }
          ]
        },
        question: "Which option genuinely provides the most privacy for sensitive conversations?",
        choices: [
          { icon: "💬", text: "Regular SMS",                  sub: "Built-in, no app needed" },
          { icon: "📲", text: "WhatsApp",                     sub: "Has end-to-end encryption" },
          { icon: "🔐", text: "Signal",                       sub: "Open-source E2E, minimal metadata stored" },
          { icon: "📧", text: "Email",                        sub: "Professional and keeps a record" }
        ],
        correctIndex: 2,
        explanation: "Signal is the gold standard for private communication. It uses true end-to-end encryption (E2EE) where ONLY you and the recipient can read messages — not even Signal's servers. Regular SMS has zero encryption. WhatsApp has E2EE for message content but Meta (Facebook) retains metadata: who you talk to, when, and how often — which reveals a lot. Signal stores almost no metadata and is fully open-source, meaning independent security experts have verified its code."
      }
    ]
  }
};

/* ── GAME STATE ──────────────────────────────────────────────── */
let gs = {
  levelId:       null,
  questionIndex: 0,
  score:         0,
  answered:      false
};

/* ── OPEN GAME SCREEN ────────────────────────────────────────── */
function openGameScreen(levelId) {
  const level = GAME_DATA[levelId];
  if (!level) { showToast("⚠ No game data for this level yet"); return; }

  // Reset state
  gs = { levelId, questionIndex: 0, score: 0, answered: false };

  // Switch screens
  document.getElementById("levelScreen").style.display = "none";
  const gameScreen = document.getElementById("gameScreen");
  gameScreen.style.display = "flex";

  // Set level name in topbar
  document.getElementById("gsLevelIcon").textContent = level.icon;
  document.getElementById("gsLevelName").textContent = level.title;
  document.getElementById("gsXPValue").textContent   = "0";

  renderCurrentQuestion();
}

/* ── RENDER CURRENT QUESTION ─────────────────────────────────── */
function renderCurrentQuestion() {
  const level = GAME_DATA[gs.levelId];
  const q     = level.questions[gs.questionIndex];
  gs.answered = false;

  // Update progress dots
  renderDots(level.questions.length, gs.questionIndex);

  // Populate content areas
  document.getElementById("gsContext").textContent      = q.context;
  document.getElementById("gsQuestionText").textContent = q.question;

  // Build scenario frame based on type
  renderFrame(q);

  // Build decision cards
  renderCards(q.choices);

  // Hide feedback panel
  const fb = document.getElementById("gsFeedbackPanel");
  fb.classList.remove("visible", "f-correct", "f-wrong");

  // Scroll to top
  document.getElementById("gsContent").scrollTop = 0;
}

/* ── PROGRESS DOTS ───────────────────────────────────────────── */
function renderDots(total, current) {
  const wrap = document.getElementById("gsProgressDots");
  wrap.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const d = document.createElement("div");
    d.className = "gs-dot" +
      (i < current  ? " done"   : "") +
      (i === current ? " active" : "");
    wrap.appendChild(d);
  }
}

/* ── SCENARIO FRAME BUILDER ──────────────────────────────────── */
function renderFrame(q) {
  const frame = document.getElementById("gsScenarioFrame");
  switch (q.type) {
    case "email":
      frame.innerHTML = buildEmail(q.scenario);
      break;
    case "terminal":
      frame.innerHTML = buildTerminal(q.scenario);
      animateTerminal(q.scenario.lines);
      break;
    case "sms":
      frame.innerHTML = buildSMS(q.scenario);
      animateSMS(q.scenario.messages);
      break;
    case "browser":
      frame.innerHTML = buildBrowser(q.scenario);
      break;
    default:
      frame.innerHTML = "";
  }
}

/* ── EMAIL FRAME ─────────────────────────────────────────────── */
function buildEmail(s) {
  return `
    <div class="scenario-email">
      <div class="email-chrome">
        <div class="email-dots"><span></span><span></span><span></span></div>
        <span class="email-chrome-label">📧 INBOX</span>
      </div>
      <div class="email-header">
        <div class="email-field">
          <span class="ef-label">From:</span>
          <span class="email-suspicious">${s.from}</span>
        </div>
        <div class="email-field">
          <span class="ef-label">To:</span>
          <span>${s.to}</span>
        </div>
        <div class="email-field">
          <span class="ef-label">Subject:</span>
          <b>${s.subject}</b>
        </div>
      </div>
      <div class="email-body">${s.body}</div>
      ${s.warning ? `<div class="email-warning">${s.warning}</div>` : ""}
    </div>`;
}

/* ── TERMINAL FRAME ──────────────────────────────────────────── */
function buildTerminal(s) {
  return `
    <div class="scenario-terminal">
      <div class="terminal-chrome">
        <div class="term-dots"><span></span><span></span><span></span></div>
        <span class="terminal-chrome-title">${s.title}</span>
      </div>
      <div class="terminal-body" id="termBody"></div>
    </div>`;
}

function animateTerminal(lines) {
  const body = document.getElementById("termBody");
  if (!body) return;
  lines.forEach((line, i) => {
    setTimeout(() => {
      const div = document.createElement("div");
      div.className = `t-line ${line.cls || ""}`;
      div.innerHTML = `<span class="t-prompt">›</span>${line.text}`;
      body.appendChild(div);
    }, line.delay !== undefined ? line.delay : i * 220);
  });
}

/* ── SMS FRAME ───────────────────────────────────────────────── */
function buildSMS(s) {
  return `
    <div class="scenario-sms">
      <div class="sms-chrome">
        <span class="sms-back">‹</span>
        <div class="sms-avatar">👤</div>
        <div class="sms-info">
          <div class="sms-name">${s.contact}</div>
          <div class="sms-sub">${s.sub}</div>
        </div>
      </div>
      <div class="sms-messages" id="smsBody"></div>
    </div>`;
}

function animateSMS(messages) {
  const body = document.getElementById("smsBody");
  if (!body) return;
  messages.forEach((msg, i) => {
    setTimeout(() => {
      const b = document.createElement("div");
      b.className = "sms-bubble";
      b.style.animationDelay = "0s";
      b.textContent = msg.text;
      body.appendChild(b);
    }, msg.delay !== undefined ? msg.delay : i * 350);
  });
}

/* ── BROWSER FRAME ───────────────────────────────────────────── */
function buildBrowser(s) {
  const lockIcon = s.isSecure ? "🔒" : "⚠️";
  const lockCls  = s.isSecure ? "browser-lock-secure" : "browser-lock-insecure";
  return `
    <div class="scenario-browser">
      <div class="browser-chrome">
        <div class="browser-dots"><span></span><span></span><span></span></div>
        <div class="browser-urlbar">
          <span class="${lockCls}">${lockIcon}</span>
          <span class="browser-url-txt">${s.url}</span>
        </div>
      </div>
      <div class="browser-body">${s.content}</div>
    </div>`;
}

/* ── DECISION CARDS ──────────────────────────────────────────── */
function renderCards(choices) {
  const grid = document.getElementById("gsChoicesGrid");
  grid.innerHTML = "";
  choices.forEach((c, i) => {
    const card = document.createElement("div");
    card.className = "gs-choice-card";
    // Stagger appearance
    card.style.animation = `fadeUp 0.35s ease ${0.3 + i * 0.07}s both`;
    card.innerHTML = `
      <div class="choice-icon">${c.icon}</div>
      <div class="choice-text">${c.text}</div>
      <div class="choice-sub">${c.sub}</div>`;
    card.onclick = () => handleAnswer(i);
    grid.appendChild(card);
  });
}

/* ── HANDLE ANSWER ───────────────────────────────────────────── */
function handleAnswer(chosenIndex) {
  if (gs.answered) return;
  gs.answered = true;

  const q         = GAME_DATA[gs.levelId].questions[gs.questionIndex];
  const isCorrect = chosenIndex === q.correctIndex;
  const xp        = isCorrect ? 100 : 0;

  gs.score += xp;
  document.getElementById("gsXPValue").textContent = gs.score;

  // Animate XP display
  const xpDisplay = document.getElementById("gsXPDisplay");
  xpDisplay.classList.add("bump");
  setTimeout(() => xpDisplay.classList.remove("bump"), 400);

  // Style all cards
  const cards = document.querySelectorAll(".gs-choice-card");
  cards.forEach((card, i) => {
    card.classList.add("disabled");
    if (i === q.correctIndex) {
      card.classList.add("correct");
      const badge = document.createElement("span");
      badge.className = "choice-badge";
      badge.textContent = "✅";
      card.appendChild(badge);
    } else if (i === chosenIndex && !isCorrect) {
      card.classList.add("wrong");
      const badge = document.createElement("span");
      badge.className = "choice-badge";
      badge.textContent = "❌";
      card.appendChild(badge);
    } else {
      card.classList.add("dimmed");
    }
  });

  // Float XP animation for correct answers
  if (isCorrect) spawnXPFloat(xp);

  // Show feedback after brief pause
  setTimeout(() => showFeedback(isCorrect, q.explanation, xp), 500);
}

/* ── FLOATING XP ANIMATION ───────────────────────────────────── */
function spawnXPFloat(amount) {
  const container = document.getElementById("gsXPFloatContainer");
  const el = document.createElement("div");
  el.className = "xp-float";
  el.textContent = `+${amount} XP`;
  el.style.right = "24px";
  el.style.top   = "56px";
  container.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

/* ── SHOW FEEDBACK PANEL ─────────────────────────────────────── */
function showFeedback(isCorrect, explanation, xp) {
  const panel = document.getElementById("gsFeedbackPanel");
  const verdict = document.getElementById("gsfVerdict");
  const xpEl    = document.getElementById("gsfXPEarned");
  const expEl   = document.getElementById("gsfExplanation");

  const totalQ   = GAME_DATA[gs.levelId].questions.length;
  const isLast   = gs.questionIndex === totalQ - 1;

  verdict.textContent = isCorrect ? "✅ CORRECT!" : "❌ NOT QUITE";
  verdict.className   = `gsf-verdict ${isCorrect ? "v-correct" : "v-wrong"}`;
  xpEl.textContent    = isCorrect ? `+${xp} XP` : "+0 XP";
  expEl.textContent   = explanation;

  // Change next button label on last question
  document.querySelector(".gsf-next-btn").textContent =
    isLast ? "VIEW RESULTS →" : "NEXT CHALLENGE →";

  panel.classList.remove("f-correct", "f-wrong");
  panel.classList.add(isCorrect ? "f-correct" : "f-wrong");
  requestAnimationFrame(() => panel.classList.add("visible"));
}

/* ── NEXT QUESTION ───────────────────────────────────────────── */
function nextQuestion() {
  const totalQ = GAME_DATA[gs.levelId].questions.length;
  const next   = gs.questionIndex + 1;

  // Hide feedback panel first
  document.getElementById("gsFeedbackPanel").classList.remove("visible");

  if (next < totalQ) {
    // More questions — wait for panel slide-out then render next
    gs.questionIndex = next;
    setTimeout(() => renderCurrentQuestion(), 320);
  } else {
    // All done — show level complete screen
    setTimeout(() => showLevelComplete(), 320);
  }
}

/* ── LEVEL COMPLETE ──────────────────────────────────────────── */
function showLevelComplete() {
  const lvl   = gs.levelId;
  const score = gs.score;
  const stars = score >= 300 ? 3 : score >= 200 ? 2 : 1;

  // Persist progress using existing system
  levels[lvl].completed = true;
  if (lvl < TOTAL_LEVELS) levels[lvl + 1].unlocked = true;
  saveLevels();
  updateStats();

  // Switch screens
  document.getElementById("gameScreen").style.display = "none";
  const lcs = document.getElementById("levelCompleteScreen");
  lcs.style.display = "flex";

  // Stars — add class with staggered delay for animation
  const starsRow = document.getElementById("lcsStarsRow");
  starsRow.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    const star = document.createElement("div");
    star.className = "lcs-star";
    star.textContent = "⭐";
    starsRow.appendChild(star);
    // Stagger each star lighting up
    if (i <= stars) {
      setTimeout(() => star.classList.add("lit"), 400 + i * 180);
    }
  }

  // Score counter animation
  const scoreEl = document.getElementById("lcsScoreValue");
  scoreEl.textContent = "0";
  let counted = 0;
  const step = Math.ceil(score / 30);
  const counter = setInterval(() => {
    counted = Math.min(counted + step, score);
    scoreEl.textContent = counted;
    if (counted >= score) clearInterval(counter);
  }, 40);
}

/* ── FINISH LEVEL (return to map) ────────────────────────────── */
function finishLevel() {
  document.getElementById("levelCompleteScreen").style.display = "none";
  document.getElementById("levelScreen").style.display = "flex";
  renderMap();
  updateAgentStats();
  showToast(`🛡️ Mission ${gs.levelId} Complete! +${gs.score} XP`);
}

/* ── EXIT GAME MID-LEVEL ─────────────────────────────────────── */
function exitGame() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("levelScreen").style.display = "flex";
}

/* ── OVERRIDE playLevel() ────────────────────────────────────── 
   JavaScript uses the LAST definition — this replaces the
   original instant-complete version above in script.js
──────────────────────────────────────────────────────────────── */
function playLevel() {
  const lvl = currentLevelSelected;
  closeLevelModal();
  setTimeout(() => openGameScreen(lvl), 280);
}

/* ── EXPOSE ALL FUNCTIONS TO REACT onClick HANDLERS ─────────── */
window.startGame       = startGame;
window.goHome          = goHome;
window.toggleProfile   = toggleProfile;
window.closeProfile    = closeProfile;
window.toggleSettings  = toggleSettings;
window.closeSettings   = closeSettings;
window.closeLevelModal = closeLevelModal;
window.playLevel       = playLevel;
window.toggleScanline  = toggleScanline;
window.toggleSound     = toggleSound;
window.toggleMusic     = toggleMusic;
window.toggleTheme     = toggleTheme;
window.exitGame        = exitGame;
window.nextQuestion    = nextQuestion;
window.finishLevel     = finishLevel;