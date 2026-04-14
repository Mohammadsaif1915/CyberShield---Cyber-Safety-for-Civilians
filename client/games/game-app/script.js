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

/* ========== BACKEND API ========== */
const API_BASE = 'http://localhost:5000/api/game';

/* ========== LEVEL DATA — 5 REAL LEVELS ========== */
const TOTAL_LEVELS = 5;
let currentLevelSelected = null;

const LEVEL_INFO = {
  1: {
    title: "THE PHISHING ROOM",
    icon: "🔐",
    difficulty: "BEGINNER",
    type: "PHISHING",
    xp: "+60",
    desc: "Identify phishing emails, fake OTPs, and unsafe networks in an interactive room.",
    url: "../Gamelvl1/frontend/index.html"
  },
  2: {
    title: "SOCIAL MEDIA SCAM ROOM",
    icon: "🎣",
    difficulty: "INTERMEDIATE",
    type: "SOCIAL MEDIA",
    xp: "+500",
    desc: "Infiltrate a compromised social media hub. Scan posts, block DM clones, detect deepfakes.",
    url: "../Gamelvl2/index.html"
  },
  3: {
    title: "RANSOMWARE OFFICE ATTACK",
    icon: "💀",
    difficulty: "ADVANCED",
    type: "RANSOMWARE",
    xp: "+1000",
    desc: "Investigate a ransomware attack in a corporate office. Forensics, network isolation, boss fight.",
    url: "../Gamelvl3/frontend/ransomware_level3.html"
  },
  4: {
    title: "DARK WEB IDENTITY THEFT",
    icon: "🦠",
    difficulty: "ADVANCED",
    type: "IDENTITY THEFT",
    xp: "+800",
    desc: "Navigate the dark web marketplace. Stop SIM-swap fraud, protect databases, crack passwords.",
    url: "../Gamelvl4/index.html"
  },
  5: {
    title: "CYBER CITY DEFENSE",
    icon: "🏙️",
    difficulty: "EXPERT",
    type: "INFRASTRUCTURE",
    xp: "+2000",
    desc: "Defend an entire city from coordinated cyber attacks. 5 critical zones + final boss battle.",
    url: "../Gamelvl5/index.html"
  }
};

/* ========== LEVEL STATE ========== */
// levels[i] = { unlocked: bool, completed: bool }
let levels = {};

function initLevels() {
  const saved = localStorage.getItem("cybershield_levels");
  if (saved) {
    levels = JSON.parse(saved);
    // Ensure all 5 levels exist
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      if (!levels[i]) levels[i] = { unlocked: i === 1, completed: false };
    }
  } else {
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      levels[i] = { unlocked: i === 1, completed: false };
    }
  }
  saveLevels();
}

function saveLevels() {
  localStorage.setItem("cybershield_levels", JSON.stringify(levels));
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
  return "E";
}

function updateStats() {
  document.getElementById("statLevels").textContent    = TOTAL_LEVELS;
  document.getElementById("statUnlocked").textContent  = getUnlockedCount();
  document.getElementById("statCompleted").textContent = getCompletedCount();
  document.getElementById("progressText").textContent  = `${getCompletedCount()} / ${TOTAL_LEVELS}`;
}

/* ========== SYNC WITH BACKEND ========== */
async function syncProgressFromBackend() {
  const user = JSON.parse(localStorage.getItem("user_v2"));
  if (!user) return;

  try {
    const res = await fetch(`${API_BASE}/completed-levels/${encodeURIComponent(user.name)}`);
    const data = await res.json();
    if (data.success && data.completedLevels) {
      data.completedLevels.forEach(lvl => {
        if (levels[lvl]) {
          levels[lvl].completed = true;
          levels[lvl].unlocked = true;
        }
        // Unlock next level
        const next = lvl + 1;
        if (next <= TOTAL_LEVELS && levels[next]) {
          levels[next].unlocked = true;
        }
      });
      saveLevels();
      updateStats();
      if (levelScreen.style.display === "flex") renderMap();
    }
  } catch (e) {
    // Backend unreachable — use localStorage only
    console.log("Backend sync skipped:", e.message);
  }
}

/* ========== CHECK RETURNING FROM LEVEL ========== */
function checkReturnFromLevel() {
  const completedLevel = localStorage.getItem("cybershield_just_completed");
  if (completedLevel) {
    const lvl = parseInt(completedLevel);
    localStorage.removeItem("cybershield_just_completed");
    if (lvl >= 1 && lvl <= TOTAL_LEVELS && levels[lvl]) {
      levels[lvl].completed = true;
      if (lvl < TOTAL_LEVELS) levels[lvl + 1].unlocked = true;
      saveLevels();
      updateStats();
      showToast(`✔ Mission ${lvl} Complete!`);
    }
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

/* ========== MAP — 5 LEVELS ========== */
function renderMap() {
  const NODE_SIZE = 90;
  const SPACING_X = 200;
  const START_X   = 140;
  const CENTER_Y  = 260;
  const WAVE_AMP  = 100;
  const totalW    = START_X + TOTAL_LEVELS * SPACING_X + START_X;
  const totalH    = CENTER_Y + WAVE_AMP + 160;

  const positions = [];
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    positions.push({
      x: START_X + (i - 1) * SPACING_X,
      y: CENTER_Y + Math.sin(i * 0.8) * WAVE_AMP
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
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const {x, y} = positions[i - 1];
    const isCompleted = levels[i].completed;
    const isUnlocked  = levels[i].unlocked;
    const info = LEVEL_INFO[i];

    const node = document.createElement("div");
    node.className = `level-node ${isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked"}`;
    node.style.cssText = `left:${x}px;top:${y}px;position:absolute;z-index:10;opacity:0;transform:scale(0.5);width:${NODE_SIZE}px;height:${NODE_SIZE}px;`;
    node.dataset.level = i;

    if (isCompleted) {
      node.innerHTML = `<span class="check">✔</span><span class="level-icon">${info.icon}</span><span class="level-num">${i}</span>`;
    } else if (isUnlocked) {
      node.innerHTML = `<span class="level-icon">${info.icon}</span><span class="level-num">${i}</span>`;
    } else {
      node.innerHTML = `<span class="lock">🔒</span><span class="level-num">${i}</span>`;
    }

    setTimeout(((n) => () => {
      n.style.transition = "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)";
      n.style.opacity = "1";
      n.style.transform = "scale(1)";
    })(node), 80 * i);

    inner.appendChild(node);
  }

  mapCanvas.innerHTML = "";
  mapCanvas.appendChild(inner);

  // Center scroll on first unlocked/incomplete level
  setTimeout(() => {
    let targetNode = null;
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      if (levels[i].unlocked && !levels[i].completed) {
        targetNode = mapCanvas.querySelector(`.level-node[data-level="${i}"]`);
        break;
      }
    }
    if (!targetNode) targetNode = mapCanvas.querySelector(".level-node.completed:last-child") || mapCanvas.querySelector(".level-node");
    if (targetNode) {
      const nodeLeft = parseInt(targetNode.style.left);
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
  const isUnlocked  = levels[lvl].unlocked;
  const isCompleted = levels[lvl].completed;
  const info = LEVEL_INFO[lvl];

  document.getElementById("levelModalTitle").textContent = `LEVEL ${lvl}: ${info.title}`;
  document.getElementById("levelModalIcon").textContent  = isCompleted ? "✅" : isUnlocked ? info.icon : "🔒";
  document.getElementById("missionDiff").textContent     = info.difficulty;
  document.getElementById("missionType").textContent     = info.type;
  document.getElementById("missionXP").textContent       = info.xp;
  document.getElementById("missionDesc").textContent     = info.desc;

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
  const info = LEVEL_INFO[lvl];
  if (!info) return;

  closeLevelModal();

  // Store username in localStorage so level pages can read it
  const user = JSON.parse(localStorage.getItem("user_v2"));
  if (user) {
    localStorage.setItem("cybershield_username", user.name);
  }

  // Store which level is being played
  localStorage.setItem("cybershield_current_level", lvl);

  showToast(`🎮 Launching Level ${lvl}...`);

  // Navigate to the actual game page after a brief delay
  setTimeout(() => {
    window.location.href = info.url;
  }, 600);
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
  localStorage.setItem("cybershield_username", user.name);
  updateUserLabel();
  profileTitle.textContent = user.name.toUpperCase();
  agentName.textContent    = user.name;
  agentId.textContent      = "ID: " + user.id;
  updateAgentStats();
  profileCreateView.style.display = "none";
  profileViewMode.style.display   = "block";
  showToast("✔ Agent registered: " + user.name);
  // Sync with backend
  syncProgressFromBackend();
};

logoutBtn.onclick = function () {
  localStorage.removeItem("user_v2");
  localStorage.removeItem("cybershield_username");
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
} );

/* ========== GAME COMPLETION & SCORE SAVING ========== */
/**
 * Save game/level score to backend when player completes or exits a level
 * Called when returning from level pages
 */
async function saveLevelScore(levelNum, score, wavesCompleted = 0, enemiesDefeated = 0, timeSpent = 0) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("⚠️ No auth token found — cannot save score");
    return;
  }

  try {
    console.log(`📤 Saving level ${levelNum} score:`, { score, wavesCompleted, enemiesDefeated, timeSpent });
    const res = await fetch("http://localhost:5000/api/game/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        score,
        level: levelNum,
        wavesCompleted: wavesCompleted || 0,
        enemiesDefeated: enemiesDefeated || 0,
        timeSpent: timeSpent || Math.floor(Math.random() * 600), // Fallback to random time if not provided
      }),
    });

    const data = await res.json();
    if (data.success) {
      console.log(`✅ Level ${levelNum} score saved! New total: ${data.totalScore}`);
      // Update localStorage immediately
      try {
        const cached = JSON.parse(localStorage.getItem("user") || "{}");
        const updated = {
          ...cached,
          score: data.totalScore,
          gameScore: data.gameScore,
          gameHighScore: data.gameHighScore,
          level: data.level,
          xp: data.totalScore,
        };
        localStorage.setItem("user", JSON.stringify(updated));
        
        // Custom event to force Dashboard to redraw
        window.dispatchEvent(new Event('storage'));
        if (window.parent && window.parent !== window) {
           window.parent.dispatchEvent(new StorageEvent('storage', { key: 'user' }));
        }

        console.log("💾 User data updated in localStorage");
      } catch (e) {
        console.error("Failed to update localStorage:", e);
      }
      return data;
    } else {
      console.error(`❌ Failed to save level ${levelNum} score:`, data.message);
    }
  } catch (err) {
    console.error("❌ Error saving level score:", err);
  }
}

/**
 * Check if player has returned from a level and save their score
 * Called on page load and when levelScreen is shown
 */
function checkAndSaveLevelCompletionScore() {
  const completedLevel = localStorage.getItem("cybershield_level_completed");
  const levelScore = localStorage.getItem("cybershield_level_score");
  const levelWaves = localStorage.getItem("cybershield_level_waves");
  const levelEnemies = localStorage.getItem("cybershield_level_enemies");
  const levelTime = localStorage.getItem("cybershield_level_time");

  if (completedLevel && levelScore) {
    const levelNum = parseInt(completedLevel);
    const score = parseInt(levelScore) || 0;
    const waves = parseInt(levelWaves) || 0;
    const enemies = parseInt(levelEnemies) || 0;
    const time = parseInt(levelTime) || 0;

    console.log(`🎮 Detected level ${levelNum} completion with score ${score}`);
    saveLevelScore(levelNum, score, waves, enemies, time);

    // Clear the completion flags after saving
    localStorage.removeItem("cybershield_level_completed");
    localStorage.removeItem("cybershield_level_score");
    localStorage.removeItem("cybershield_level_waves");
    localStorage.removeItem("cybershield_level_enemies");
    localStorage.removeItem("cybershield_level_time");
  }
}

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
checkReturnFromLevel();
checkAndSaveLevelCompletionScore(); // Check for completed levels and save scores
updateUserLabel();
updateStats();
initParticles();
syncProgressFromBackend();

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