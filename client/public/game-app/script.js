/* ═══════════════════════════════════════════════════════════════
   CYBER DEFENSE — Level Hub Script
  5 levels (1, 2, 3, 4, 5) — playable games for 1, 2, 3, 4, 5
   Sequential unlock: must complete previous to open next
   Backend persistence via /api/game/*
═══════════════════════════════════════════════════════════════ */

const API_BASE = window.location.origin.includes('localhost')
  ? 'http://localhost:5000'
  : '';

/* ========== DOM ========== */
const homeScreen        = document.getElementById("homeScreen");
const levelScreen       = document.getElementById("levelScreen");
const loadingScreen     = document.getElementById("loadingScreen");
const introScreen       = document.getElementById("introScreen");
const mapCanvas         = document.getElementById("mapCanvas");
const settingsBox       = document.getElementById("settingsBox");
const profileBox        = document.getElementById("profileBox");
const settingsOverlay   = document.getElementById("settingsOverlay");
const profileOverlay    = document.getElementById("profileOverlay");
const levelModal        = document.getElementById("levelModal");
const levelModalOverlay = document.getElementById("levelModalOverlay");
const nameInput         = document.getElementById("nameInput");
const nameError         = document.getElementById("nameError");
const userLabel         = document.getElementById("userLabel");
const profileTitle      = document.getElementById("profileTitle");
const profileSubmitBtn  = document.getElementById("profileSubmitBtn");
const logoutBtn         = document.getElementById("logoutBtn");
const profileIconBtn    = document.getElementById("profileIconBtn");
const settingsIconBtn   = document.getElementById("settingsIconBtn");
const profileCreateView = document.getElementById("profileCreateView");
const profileViewMode   = document.getElementById("profileViewMode");
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

/* ========== LEVEL CONFIG ========== */
const TOTAL_LEVELS = 5;
const LEVELS_VISIBLE = 5;

const LEVEL_META = {
  1: { title: "PASSWORD SECURITY",     icon: "🔐", type: "FIREWALL",   diff: "EASY",   xp: 100, playable: true,  path: "levels/1/index.html" },
  2: { title: "SOCIAL MEDIA SCAMS",    icon: "🎣", type: "PHISHING",   diff: "EASY",   xp: 200, playable: true,  path: "levels/2/index.html" },
  3: { title: "RANSOMWARE OFFICE ATTACK", icon: "💀", type: "RANSOMWARE", diff: "HARD",   xp: 300, playable: true,  path: "levels/3/index.html" },
  4: { title: "DARK WEB IDENTITY",     icon: "🎭", type: "IDENTITY",   diff: "HARD",   xp: 400, playable: true,  path: "levels/4/index.html" },
  5: { title: "CYBER CITY DEFENSE",    icon: "🏙️", type: "CITY",       diff: "ELITE",  xp: 500, playable: true,  path: "levels/5/index.html" },
};

let levels = {};
let currentLevelSelected = null;

/* ========== INIT ========== */
function initLevels() {
  // Default: only level 1 unlocked
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    levels[i] = { unlocked: i === 1, completed: false };
  }
  // Try to load from localStorage first (instant)
  const saved = localStorage.getItem("cd_levels");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(levels, parsed);
    } catch (e) {}
  }
  // Then sync from backend if user exists
  syncProgressFromBackend();
}

function saveLevels() {
  localStorage.setItem("cd_levels", JSON.stringify(levels));
}

function getCompletedCount() {
  return Object.values(levels).filter(l => l.completed).length;
}

function getUnlockedCount() {
  return Object.values(levels).filter(l => l.unlocked).length;
}

function getRank(completed) {
  if (completed >= 5) return "S+";
  if (completed >= 4) return "S";
  if (completed >= 3) return "A";
  if (completed >= 2) return "B";
  if (completed >= 1) return "C";
  return "D";
}

function updateStats() {
  document.getElementById("statLevels").textContent    = TOTAL_LEVELS;
  document.getElementById("statUnlocked").textContent  = getUnlockedCount();
  document.getElementById("statCompleted").textContent = getCompletedCount();
  document.getElementById("progressText").textContent  = `${getCompletedCount()} / ${TOTAL_LEVELS}`;
}

/* ========== BACKEND SYNC ========== */
async function syncProgressFromBackend() {
  const user = getUser();
  if (!user) return;

  try {
    const res = await fetch(`${API_BASE}/api/game/stats/${encodeURIComponent(user.name)}`);
    const data = await res.json();
    if (!data.success || !data.data?.levels) return;

    // Reset all to defaults
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      levels[i] = { unlocked: i === 1, completed: false };
    }

    // Mark completed levels from backend
    const completedSet = new Set();
    data.data.levels.forEach(entry => {
      if (entry.completed && levels[entry.level]) {
        levels[entry.level].completed = true;
        levels[entry.level].unlocked = true;
        completedSet.add(entry.level);
      }
    });

    // Unlock next levels sequentially
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      if (levels[i].completed && i < TOTAL_LEVELS) {
        levels[i + 1].unlocked = true;
      }
    }

    saveLevels();
    updateStats();
    if (levelScreen.style.display === "flex") renderMap();
    updateAgentStats();
  } catch (err) {
    console.warn("Backend sync failed, using local data:", err.message);
  }
}

async function saveProgressToBackend(lvl, completed) {
  const user = getUser();
  if (!user) return;

  try {
    await fetch(`${API_BASE}/api/game/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.name,
        level: [1, 2, 3, 4, 5].includes(lvl) ? lvl : undefined,
        score: completed ? (LEVEL_META[lvl]?.xp || 100) : 0,
        maxScore: LEVEL_META[lvl]?.xp || 100,
        levelCompleted: completed,
        timeSpent: 0,
      }),
    });
    console.log(`✅ Progress saved to backend: Level ${lvl}, completed: ${completed}`);
  } catch (err) {
    console.warn("Failed to save to backend:", err.message);
  }
}

/* ========== USER ========== */
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user_v2"));
  } catch {
    return null;
  }
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
  const NODE_SIZE = 78;
  const SPACING_X = 160;
  const START_X   = 120;
  const CENTER_Y  = 240;
  const WAVE_AMP  = 110;
  const totalW    = START_X + LEVELS_VISIBLE * SPACING_X + START_X;
  const totalH    = CENTER_Y + WAVE_AMP + 180;

  const positions = [];
  for (let i = 1; i <= LEVELS_VISIBLE; i++) {
    positions.push({
      x: START_X + (i - 1) * SPACING_X,
      y: CENTER_Y + Math.sin(i * 0.7) * WAVE_AMP
    });
  }

  // SVG paths
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.style.cssText = `position:absolute;top:0;left:0;width:${totalW}px;height:${totalH}px;pointer-events:none;z-index:2;overflow:visible;`;

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML =
    '<filter id="lineGlow" x="-60%" y="-60%" width="220%" height="220%">' +
    '<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>' +
    '<feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
    '</filter>';
  svg.appendChild(defs);

  for (let i = 1; i < positions.length; i++) {
    const {x: ax, y: ay} = positions[i - 1];
    const {x: bx, y: by} = positions[i];
    const half = NODE_SIZE / 2;
    const mx = (ax + bx) / 2;
    const my = Math.min(ay, by) - 55;
    const d  = `M ${ax+half} ${ay+half} Q ${mx} ${my} ${bx+half} ${by+half}`;

    const glow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    glow.setAttribute("d", d);
    glow.setAttribute("fill", "none");
    glow.setAttribute("stroke", "rgba(0,255,200,0.55)");
    glow.setAttribute("stroke-width", "5");
    glow.setAttribute("filter", "url(#lineGlow)");
    svg.appendChild(glow);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", d);
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "rgba(0,255,200,0.95)");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-dasharray", "10 6");
    line.style.animation = `dashFlow ${1.5 + i * 0.05}s linear infinite`;
    svg.appendChild(line);
  }

  const inner = document.createElement("div");
  inner.style.cssText = `position:relative;width:${totalW}px;height:${totalH}px;`;
  inner.appendChild(svg);

  // Nodes
  for (let i = 1; i <= LEVELS_VISIBLE; i++) {
    const {x, y} = positions[i - 1];
    const isCompleted = levels[i]?.completed;
    const isUnlocked  = levels[i]?.unlocked;
    const meta        = LEVEL_META[i];

    const node = document.createElement("div");
    node.className = `level-node ${isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked"}`;
    node.style.cssText = `left:${x}px;top:${y}px;position:absolute;z-index:10;opacity:0;transform:scale(0.5);width:${NODE_SIZE}px;height:${NODE_SIZE}px;`;
    node.dataset.level = i;

    if (isCompleted) {
      node.innerHTML = `<span class="check">✔</span><span class="level-num">${i}</span>`;
    } else if (isUnlocked) {
      node.innerHTML = `<span class="level-icon">${meta?.icon || "🎮"}</span><span class="level-num">${i}</span>`;
    } else {
      node.innerHTML = `<span class="lock">🔒</span><span class="level-num">${i}</span>`;
    }

    // Level title label below node
    const label = document.createElement("div");
    label.style.cssText = `position:absolute;top:${NODE_SIZE + 8}px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:9px;font-family:'Share Tech Mono',monospace;color:rgba(0,255,200,0.6);text-align:center;letter-spacing:0.05em;`;
    label.textContent = meta?.title || `LEVEL ${i}`;
    node.appendChild(label);

    setTimeout(((n) => () => {
      n.style.transition = "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)";
      n.style.opacity = "1";
      n.style.transform = "scale(1)";
    })(node), 80 * i);

    inner.appendChild(node);
  }

  mapCanvas.innerHTML = "";
  mapCanvas.appendChild(inner);

  // Center scroll on current unlocked
  setTimeout(() => {
    const target = mapCanvas.querySelector(".level-node.unlocked:not(.completed)") ||
                   mapCanvas.querySelector(".level-node.completed:last-child");
    if (target) {
      const nodeLeft = parseInt(target.style.left);
      mapCanvas.scrollLeft = Math.max(0, nodeLeft - window.innerWidth / 2 + NODE_SIZE / 2);
    }
  }, 200);
}

/* ========== LEVEL CLICK ========== */
document.addEventListener("click", e => {
  const node = e.target.closest(".level-node");
  if (!node) return;
  currentLevelSelected = parseInt(node.dataset.level);
  openLevelModal(currentLevelSelected);
});

function openLevelModal(lvl) {
  const isUnlocked  = levels[lvl]?.unlocked;
  const isCompleted = levels[lvl]?.completed;
  const meta        = LEVEL_META[lvl] || {};

  document.getElementById("levelModalTitle").textContent = `MISSION ${lvl}`;
  document.getElementById("levelModalIcon").textContent  = isCompleted ? "✅" : isUnlocked ? (meta.icon || "🎮") : "🔒";
  document.getElementById("missionDiff").textContent     = meta.diff || "—";
  document.getElementById("missionType").textContent     = meta.type || "—";
  document.getElementById("missionXP").textContent       = `+${meta.xp || 100}`;

  // Level name
  const nameEl = document.getElementById("missionName");
  if (nameEl) nameEl.textContent = meta.title || `LEVEL ${lvl}`;

  const playBtn   = document.getElementById("playLevelBtn");
  const lockedMsg = document.getElementById("levelLockedMsg");

  if (isUnlocked) {
    if (meta.playable) {
      playBtn.style.display   = "block";
      lockedMsg.style.display = "none";
      playBtn.textContent     = isCompleted ? "REPLAY MISSION" : "LAUNCH MISSION";
    } else {
      playBtn.style.display   = "none";
      lockedMsg.style.display = "block";
      lockedMsg.querySelector("p").textContent = "🔧 This mission is under development";
    }
  } else {
    playBtn.style.display   = "none";
    lockedMsg.style.display = "block";
    lockedMsg.querySelector("p").textContent = "🔒 Complete previous mission to unlock";
  }

  openPopup(levelModal, levelModalOverlay);
}

function playLevel() {
  const lvl = currentLevelSelected;
  const meta = LEVEL_META[lvl];
  closeLevelModal();

  if (!meta?.playable || !meta?.path) {
    showToast("🔧 This level is coming soon!");
    return;
  }

  // No agent registration needed — individual levels handle username

  showToast(`🎮 Launching ${meta.title}...`);

  // Navigate to the game level after a short delay
  setTimeout(() => {
    window.location.href = meta.path;
  }, 600);
}

/* ========== MARK LEVEL COMPLETE (called via postMessage from game levels) ========== */
window.addEventListener("message", async (e) => {
  if (e.data?.type === "GAME_COMPLETE" && e.data?.level) {
    const lvl = e.data.level;
    const score = e.data.score || 0;

    levels[lvl].completed = true;
    if (lvl < TOTAL_LEVELS) levels[lvl + 1].unlocked = true;
    saveLevels();

    // Save to backend
    await saveProgressToBackend(lvl, true);

    updateStats();
    renderMap();
    updateAgentStats();
    showToast(`✔ Mission ${lvl} Complete! +${LEVEL_META[lvl]?.xp || 100} XP`);
  }
});

// Also check URL param for completion (when navigating back from a game)
function checkReturnCompletion() {
  const params = new URLSearchParams(window.location.search);
  const completedLvl = parseInt(params.get("completed"));
  const score = parseInt(params.get("score")) || 0;

  if (completedLvl && LEVEL_META[completedLvl]) {
    levels[completedLvl].completed = true;
    if (completedLvl < TOTAL_LEVELS) levels[completedLvl + 1].unlocked = true;
    saveLevels();
    saveProgressToBackend(completedLvl, true);
    updateStats();
    updateAgentStats();
    showToast(`✔ Mission ${completedLvl} Complete! +${LEVEL_META[completedLvl]?.xp || 100} XP`);

    // Clean URL
    window.history.replaceState({}, "", window.location.pathname);
  }
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
  const user = getUser();
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

  // Sync from backend for this user (in case they played before)
  syncProgressFromBackend();
};

logoutBtn.onclick = function () {
  localStorage.removeItem("user_v2");
  localStorage.removeItem("cd_levels");
  // Reset levels
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    levels[i] = { unlocked: i === 1, completed: false };
  }
  saveLevels();
  updateUserLabel();
  updateStats();
  closeProfile();
  showToast("👋 Agent logged out");
  if (levelScreen.style.display === "flex") {
    goHome();
  }
};

function updateUserLabel() {
  const user = getUser();
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
  setTimeout(() => t.remove(), 2000);
}

/* ========== BOOT ========== */
initLevels();
updateUserLabel();
updateStats();
initParticles();

homeScreen.style.display    = "none";
levelScreen.style.display   = "none";
introScreen.style.display   = "none";
loadingScreen.style.display = "flex";

setTimeout(() => {
  loadingScreen.style.display = "none";
  introScreen.style.display   = "flex";
}, 2800);

setTimeout(() => {
  introScreen.style.display = "none";
  homeScreen.style.display  = "flex";
  checkReturnCompletion();
}, 6800);