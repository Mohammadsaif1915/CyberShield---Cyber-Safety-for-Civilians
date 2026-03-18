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