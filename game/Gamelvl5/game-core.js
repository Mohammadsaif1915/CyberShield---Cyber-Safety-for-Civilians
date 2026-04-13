// ==================== GAME CORE ENGINE ====================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ========== CONSTANTS ==========
const PLAYER_SPEED = 3.5;
const PLAYER_SIZE = 18;
const TERMINAL_SIZE = 40;
const INTERACT_DIST = 60;
const TOTAL_TIME = 600; // 10 minutes

// ========== COLORS ==========
const C = {
    cyan: '#00f0ff', purple: '#b040ff', red: '#ff2060', green: '#00ff88',
    yellow: '#ffe040', orange: '#ff8020', white: '#e0e8f0', bg: '#060612',
    darkCyan: '#003040', darkPurple: '#200040', darkRed: '#300018',
    grid: 'rgba(0,240,255,0.04)', gridBright: 'rgba(0,240,255,0.08)'
};

// ========== INPUT ==========
const keys = {};
window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; keys[e.code] = true; });
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; keys[e.code] = false; });
function kPressed(k) { const v = keys[k]; keys[k] = false; return v; }

// ========== GAME STATE ==========
const GS = {
    scene: 'hub', // hub, zone1..zone5, victory, defeat
    timer: TOTAL_TIME,
    score: 0,
    zonesCompleted: [false, false, false, false, false],
    zoneNames: ['Hospital Network', 'Traffic Grid', 'ATM Banking', 'Smart Home Tower', 'Power Grid'],
    zoneColors: [C.green, C.yellow, C.orange, C.purple, C.red],
    paused: false,
    messageActive: false,
    gameOver: false,
    alertText: '',
    alertTimer: 0,
    particles: [],
    screenShake: 0,
    lastTime: 0
};

// ========== PLAYER ==========
const player = {
    x: 0, y: 0, size: PLAYER_SIZE, angle: 0,
    vx: 0, vy: 0, trail: [], dashCool: 0
};

function resetPlayer(x, y) {
    player.x = x; player.y = y;
    player.vx = 0; player.vy = 0;
    player.trail = [];
}

function updatePlayer(dt, bounds) {
    let dx = 0, dy = 0;
    if (keys['w'] || keys['arrowup']) dy = -1;
    if (keys['s'] || keys['arrowdown']) dy = 1;
    if (keys['a'] || keys['arrowleft']) dx = -1;
    if (keys['d'] || keys['arrowright']) dx = 1;
    if (dx && dy) { dx *= 0.707; dy *= 0.707; }
    player.vx = dx * PLAYER_SPEED;
    player.vy = dy * PLAYER_SPEED;
    player.x += player.vx;
    player.y += player.vy;
    if (dx || dy) player.angle = Math.atan2(dy, dx);
    // bounds
    const s = player.size;
    if (bounds) {
        player.x = Math.max(bounds.x + s, Math.min(bounds.x + bounds.w - s, player.x));
        player.y = Math.max(bounds.y + s, Math.min(bounds.y + bounds.h - s, player.y));
    }
    // trail
    player.trail.push({ x: player.x, y: player.y, a: 1 });
    if (player.trail.length > 20) player.trail.shift();
    player.trail.forEach(t => t.a -= 0.05);
}

function drawPlayer() {
    // trail
    player.trail.forEach(t => {
        if (t.a <= 0) return;
        ctx.globalAlpha = t.a * 0.3;
        ctx.fillStyle = C.cyan;
        ctx.beginPath();
        ctx.arc(t.x, t.y, player.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
    // glow
    const g = ctx.createRadialGradient(player.x, player.y, 0, player.x, player.y, player.size * 2.5);
    g.addColorStop(0, 'rgba(0,240,255,0.15)');
    g.addColorStop(1, 'rgba(0,240,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
    // body
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.fillStyle = C.cyan;
    ctx.shadowColor = C.cyan;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(player.size, 0);
    ctx.lineTo(-player.size * 0.7, -player.size * 0.6);
    ctx.lineTo(-player.size * 0.4, 0);
    ctx.lineTo(-player.size * 0.7, player.size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    // core
    ctx.fillStyle = C.white;
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// ========== DRAWING UTILS ==========
function drawGrid(ox, oy, w, h, spacing) {
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    for (let x = ox; x <= ox + w; x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy + h); ctx.stroke();
    }
    for (let y = oy; y <= oy + h; y += spacing) {
        ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + w, y); ctx.stroke();
    }
}

function drawGlowCircle(x, y, r, color, alpha) {
    ctx.globalAlpha = alpha || 1;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

function drawGlowRect(x, y, w, h, color, alpha) {
    ctx.globalAlpha = alpha || 1;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

function drawText(text, x, y, size, color, align, font) {
    ctx.fillStyle = color || C.white;
    ctx.font = `${size || 14}px ${font || "'Orbitron', monospace"}`;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
}

function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function rnd(min, max) { return Math.random() * (max - min) + min; }
function rndInt(min, max) { return Math.floor(rnd(min, max + 1)); }

// ========== PARTICLES ==========
function spawnParticles(x, y, color, count, speed) {
    for (let i = 0; i < (count || 8); i++) {
        const a = rnd(0, Math.PI * 2);
        const s = rnd(1, speed || 3);
        GS.particles.push({
            x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
            life: 1, color: color || C.cyan, size: rnd(2, 5)
        });
    }
}

function updateParticles(dt) {
    for (let i = GS.particles.length - 1; i >= 0; i--) {
        const p = GS.particles[i];
        p.x += p.vx; p.y += p.vy;
        p.life -= 0.02;
        p.vx *= 0.98; p.vy *= 0.98;
        if (p.life <= 0) GS.particles.splice(i, 1);
    }
}

function drawParticles() {
    GS.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

// ========== HUD UPDATE ==========
function updateHUD() {
    const min = Math.floor(GS.timer / 60);
    const sec = Math.floor(GS.timer % 60);
    const tv = document.getElementById('timer-value');
    tv.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
    tv.className = 'hud-value' + (GS.timer < 60 ? ' danger' : GS.timer < 180 ? ' warning' : '');

    document.getElementById('zone-value').textContent =
        GS.scene === 'hub' ? 'COMMAND HUB' : GS.zoneNames[parseInt(GS.scene.replace('zone','')) - 1] || 'UNKNOWN';
    document.getElementById('score-value').textContent = GS.score;
    const done = GS.zonesCompleted.filter(Boolean).length;
    document.getElementById('zones-value').textContent = `${done}/5`;

    const ad = document.getElementById('alert-display');
    if (GS.alertTimer > 0) {
        ad.classList.remove('hidden');
        document.getElementById('alert-text').textContent = GS.alertText;
    } else {
        ad.classList.add('hidden');
    }
}

function showZoneProgress(label, pct, text) {
    const bar = document.getElementById('zone-progress-bar');
    bar.classList.remove('hidden');
    document.getElementById('zone-progress-label').textContent = label;
    document.getElementById('zone-progress-fill').style.width = `${Math.min(100, pct)}%`;
    document.getElementById('zone-progress-text').textContent = text || '';
}

function hideZoneProgress() {
    document.getElementById('zone-progress-bar').classList.add('hidden');
}

function showZoneMeter(label, pct) {
    const m = document.getElementById('zone-meter');
    m.classList.remove('hidden');
    document.getElementById('zone-meter-label').textContent = label;
    document.getElementById('zone-meter-fill').style.width = `${Math.min(100, pct)}%`;
}

function hideZoneMeter() {
    document.getElementById('zone-meter').classList.add('hidden');
}

function showInteract(text) {
    const p = document.getElementById('interaction-prompt');
    p.classList.remove('hidden');
    document.getElementById('interact-text').textContent = text;
}

function hideInteract() {
    document.getElementById('interaction-prompt').classList.add('hidden');
}

function showMessage(title, text, cb) {
    GS.messageActive = true;
    GS.paused = true;
    document.getElementById('message-overlay').classList.remove('hidden');
    document.getElementById('message-title').textContent = title;
    document.getElementById('message-text').textContent = text;
    GS._messageCb = cb;
}

function dismissMessage() {
    if (!GS.messageActive) return;
    GS.messageActive = false;
    GS.paused = false;
    document.getElementById('message-overlay').classList.add('hidden');
    if (GS._messageCb) { GS._messageCb(); GS._messageCb = null; }
}

function triggerAlert(text, dur) {
    GS.alertText = text;
    GS.alertTimer = dur || 5;
}

function showGameOver(victory) {
    GS.gameOver = true;
    const ov = document.getElementById('game-over-overlay');
    ov.classList.remove('hidden');
    const t = document.getElementById('game-over-title');
    t.textContent = victory ? 'CITY SECURED' : 'MISSION FAILED';
    t.className = victory ? 'victory' : 'defeat';
    document.getElementById('game-over-text').textContent = victory
        ? 'All systems restored. The city is safe.'
        : 'Time ran out. The cyber attack succeeded.';
    document.getElementById('final-score').textContent = `SCORE: ${GS.score}`;

    // Show "Return to Hub" only on victory (level 5 is the final level)
    const nb = document.getElementById('next-level-btn5');
    if (nb) {
        if (victory) {
            nb.style.display = 'block';
            nb.onclick = function() {
                localStorage.setItem('cybershield_just_completed', '5');
                window.location.href = '../../game-app/index.html';
            };
        } else {
            nb.style.display = 'none';
        }
    }
}

// ========== HUB ==========
const terminals = [];
function initHub() {
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const positions = [
        { x: cx - 220, y: cy - 140 }, // Hospital
        { x: cx + 220, y: cy - 140 }, // Traffic
        { x: cx - 220, y: cy + 140 }, // ATM
        { x: cx + 220, y: cy + 140 }, // Smart Home
        { x: cx, y: cy - 20 }          // Power Grid (center)
    ];
    terminals.length = 0;
    for (let i = 0; i < 5; i++) {
        terminals.push({
            x: positions[i].x, y: positions[i].y,
            name: GS.zoneNames[i], color: GS.zoneColors[i],
            zone: `zone${i + 1}`,
            completed: false,
            locked: i === 4, // Power Grid locked
            pulse: 0, alert: false
        });
    }
    resetPlayer(cx, cy + 80);
}

function updateHub(dt) {
    const bounds = { x: 50, y: 50, w: canvas.width - 100, h: canvas.height - 100 };
    updatePlayer(dt, bounds);
    hideInteract();
    hideZoneProgress();
    hideZoneMeter();

    // Update terminal states
    const allDone = GS.zonesCompleted[0] && GS.zonesCompleted[1] && GS.zonesCompleted[2] && GS.zonesCompleted[3];
    terminals[4].locked = !allDone;
    for (let i = 0; i < 5; i++) terminals[i].completed = GS.zonesCompleted[i];

    // Check proximity
    let nearTerminal = null;
    for (const t of terminals) {
        t.pulse += dt * 2;
        const d = dist(player, t);
        if (d < INTERACT_DIST) nearTerminal = t;
    }

    if (nearTerminal) {
        if (nearTerminal.completed) {
            showInteract(`${nearTerminal.name} - SECURED ✓`);
        } else if (nearTerminal.locked) {
            showInteract(`${nearTerminal.name} - LOCKED`);
        } else {
            showInteract(`Enter ${nearTerminal.name}`);
            if (kPressed('e')) {
                enterZone(nearTerminal.zone);
            }
        }
    }

    // Random alerts
    if (GS.alertTimer <= 0 && Math.random() < 0.002) {
        const avail = [0,1,2,3].filter(i => !GS.zonesCompleted[i]);
        if (avail.length) {
            const i = avail[rndInt(0, avail.length - 1)];
            const msgs = [
                'Hospital under attack!', 'Traffic system compromised!',
                'ATM network breach detected!', 'Smart Home intrusion!'
            ];
            triggerAlert(msgs[i], 4);
            terminals[i].alert = true;
            setTimeout(() => terminals[i].alert = false, 4000);
        }
    }
}

function drawHub() {
    // Background
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(0, 0, canvas.width, canvas.height, 40);

    // Room border
    ctx.strokeStyle = 'rgba(0,240,255,0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Title
    drawText('CYBER COMMAND CENTER', canvas.width / 2, 28, 14, C.cyan);

    // Connection lines from center terminal to others
    const ct = terminals[4];
    ctx.strokeStyle = 'rgba(176,64,255,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(ct.x, ct.y);
        ctx.lineTo(terminals[i].x, terminals[i].y);
        ctx.stroke();
    }

    // Terminals
    for (const t of terminals) {
        const s = TERMINAL_SIZE;
        const pulse = Math.sin(t.pulse) * 0.2 + 0.8;
        // base glow
        const g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, s * 1.5);
        g.addColorStop(0, t.color + '30');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(t.x, t.y, s * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // terminal body
        ctx.fillStyle = t.completed ? C.green + '40' : t.locked ? C.gray + '40' : t.color + '30';
        ctx.strokeStyle = t.alert ? C.red : t.completed ? C.green : t.locked ? C.gray : t.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = t.alert ? pulse : 1;
        ctx.beginPath();
        ctx.arc(t.x, t.y, s, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.globalAlpha = 1;

        // icon
        const icon = t.completed ? '✓' : t.locked ? '🔒' : ['🏥','🚦','🏧','🏠','⚡'][terminals.indexOf(t)];
        drawText(icon, t.x, t.y - 2, 20, C.white);
        drawText(t.name, t.x, t.y + s + 16, 11, t.completed ? C.green : t.locked ? C.gray : t.color, 'center', "'Share Tech Mono', monospace");
        if (t.completed) drawText('SECURED', t.x, t.y + s + 30, 9, C.green, 'center', "'Share Tech Mono', monospace");
    }

    drawPlayer();
    drawParticles();
}

function enterZone(zone) {
    GS.scene = zone;
    const idx = parseInt(zone.replace('zone', '')) - 1;
    const z = zoneInits[idx];
    if (z) z();
}

function completeZone(idx) {
    GS.zonesCompleted[idx] = true;
    GS.score += 2000;
    const name = GS.zoneNames[idx];
    showMessage(`${name} SECURED`, `System restored. +2000 points.`, () => {
        GS.scene = 'hub';
        initHub();
    });
}

function exitZone() {
    GS.scene = 'hub';
    hideZoneProgress();
    hideZoneMeter();
    initHub();
}

// placeholder arrays for zone init/update/draw functions - filled in game-zones.js
const zoneInits = [];
const zoneUpdates = [];
const zoneDraws = [];
