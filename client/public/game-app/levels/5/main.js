// ==================== MAIN GAME LOOP ====================

// ========== INSTRUCTIONS OVERLAY ==========
const instrOverlay   = document.getElementById('instructions-overlay');
const instrCloseTop  = document.getElementById('instructions-close');
const instrCloseBot  = document.getElementById('instructions-close-bottom');
const howToPlayBtn   = document.getElementById('how-to-play-btn');

function openInstructions() { instrOverlay.classList.remove('hidden'); }
function closeInstructions() { instrOverlay.classList.add('hidden'); }

howToPlayBtn.addEventListener('click', openInstructions);
instrCloseTop.addEventListener('click', closeInstructions);
instrCloseBot.addEventListener('click', closeInstructions);

// ========== IN-GAME HELP PANEL ==========
const helpBtn   = document.getElementById('help-btn');
const helpPanel = document.getElementById('help-panel');
let helpVisible = false;

function toggleHelp() {
    helpVisible = !helpVisible;
    helpPanel.classList.toggle('hidden', !helpVisible);
}

helpBtn.addEventListener('click', toggleHelp);

// ========== ZONE INTRO MESSAGES ==========
const zoneIntros = [
    {
        title: '🏥 HOSPITAL NETWORK',
        text: 'Walk into RED virus nodes to destroy them. Hold [E] near server line tops to reconnect them. Once all 4 servers are fixed, activate the BACKUP node on the right side. Watch out — viruses spread over time!'
    },
    {
        title: '🚦 TRAFFIC GRID',
        text: 'Traffic signals are hacked! Walk near a signal and press [SPACE] to rotate it. Match the correct direction to turn it GREEN. Fixed signals slow cars down. Avoid 8 crashes or the grid fails!'
    },
    {
        title: '🏧 ATM BANKING NETWORK',
        text: 'Red diamond packets = MALICIOUS. Walk into them and press [SPACE] or [F] to intercept. Green square packets are safe — ignore them. Activate the 4 lock icons with [E] for auto-blocking. Do not let the overload meter fill up!'
    },
    {
        title: '🏠 SMART HOME TOWER',
        text: 'Secure all 8 infected devices (red blinking squares) by walking close and holding [E]. BEWARE the camera cones — stepping inside them raises the alarm. If the alarm maxes out, you fail! Sneak between camera sweeps.'
    },
    {
        title: '⚡ POWER GRID — AI CORE',
        text: 'BOSS FIGHT! Collect yellow ⚡ energy fragments to charge your beam (need 5). Dodge the expanding EMP rings — they drain your charge! When fully charged, press [F] to fire. The boss has rotating purple shields — aim through the GAPS. Hit it 4 times to win!'
    }
];

// Track which zones have been introduced
const zoneIntroShown = [false, false, false, false, false];

function showZoneIntro(idx) {
    if (zoneIntroShown[idx]) return;
    zoneIntroShown[idx] = true;
    showMessage(zoneIntros[idx].title, zoneIntros[idx].text);
}

// ========== INITIALIZATION ==========
let gameStarted = false;

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', () => location.reload());

function startGame() {
    // Validate username
    const usernameInput = document.getElementById('username-input');
    const errorEl = document.getElementById('username-error');
    const username = (usernameInput.value || '').trim();
    if (username.length < 2) {
        errorEl.style.display = 'block';
        usernameInput.style.borderColor = '#ff4466';
        usernameInput.focus();
        return;
    }
    errorEl.style.display = 'none';
    currentUsername = username;
    gameApi?.rememberAgent(username);

    document.getElementById('start-screen').classList.add('hidden');
    closeInstructions();
    helpBtn.classList.remove('hidden');
    gameStarted = true;
    GS.timer = TOTAL_TIME;
    GS.score = 0;
    GS.zonesCompleted = [false, false, false, false, false];
    GS.scene = 'hub';
    GS.gameOver = false;
    GS.paused = false;
    GS.particles = [];
    initHub();
    GS.lastTime = performance.now();

    // Welcome intro on first launch
    showMessage(
        '📡 MISSION BRIEFING',
        'All 5 city systems are under cyber attack! Secure zones in any order. Complete the Hospital, Traffic, ATM, and Smart Home before the Power Grid boss unlocks. You have 10 minutes. Press [H] anytime for a quick-reference guide.'
    );

    requestAnimationFrame(gameLoop);
}

// ========== KEY EVENTS ==========
window.addEventListener('keydown', e => {
    if (e.key === 'Enter' && GS.messageActive) {
        dismissMessage();
    }
    // Toggle help panel with H (only during gameplay, not while typing)
    if ((e.key === 'h' || e.key === 'H') && gameStarted && !GS.messageActive) {
        toggleHelp();
    }
});

// Allow Enter on username input to start game
document.getElementById('username-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') startGame();
    e.stopPropagation();
});

// ========== GAME LOOP ==========
function gameLoop(now) {
    if (!gameStarted) return;
    const dt = Math.min((now - GS.lastTime) / 1000, 0.05); // cap delta
    GS.lastTime = now;

    if (!GS.gameOver) {
        // Timer
        if (!GS.paused) {
            GS.timer -= dt;
            if (GS.timer <= 0) {
                GS.timer = 0;
                showGameOver(false);
            }
            // Alert timer
            if (GS.alertTimer > 0) GS.alertTimer -= dt;
            // Screen shake decay
            if (GS.screenShake > 0) GS.screenShake *= 0.9;
            if (GS.screenShake < 0.1) GS.screenShake = 0;
        }

        // Update
        if (!GS.paused) {
            updateParticles(dt);

            if (GS.scene === 'hub') {
                updateHub(dt);
            } else {
                const idx = parseInt(GS.scene.replace('zone', '')) - 1;
                if (zoneUpdates[idx]) zoneUpdates[idx](dt);
            }
        }

        // Draw
        ctx.save();
        if (GS.screenShake > 0) {
            ctx.translate(rnd(-GS.screenShake, GS.screenShake), rnd(-GS.screenShake, GS.screenShake));
        }

        if (GS.scene === 'hub') {
            drawHub();
        } else {
            const idx = parseInt(GS.scene.replace('zone', '')) - 1;
            if (zoneDraws[idx]) zoneDraws[idx]();
        }

        ctx.restore();

        // Scanline effect
        ctx.fillStyle = 'rgba(0,240,255,0.01)';
        const scanY = (Date.now() * 0.1) % canvas.height;
        ctx.fillRect(0, scanY, canvas.width, 2);

        // Vignette
        const vg = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
            canvas.width / 2, canvas.height / 2, canvas.width * 0.8
        );
        vg.addColorStop(0, 'transparent');
        vg.addColorStop(1, 'rgba(6,6,18,0.6)');
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // HUD update
        updateHUD();

        // Check total victory
        if (GS.zonesCompleted.every(Boolean) && GS.scene === 'hub' && !GS.gameOver) {
            showGameOver(true);
        }
    }

    requestAnimationFrame(gameLoop);
}

// ==================== BACKEND INTEGRATION ====================

async function saveGameProgress(finalScore, victory) {
    const statusEl = document.getElementById('game-save-status');
    if (statusEl) {
        statusEl.textContent = '\u23f3 Saving progress...';
        statusEl.style.color = '#666';
    }
    try {
        const zonesNames = ['Hospital Network', 'Traffic Grid', 'ATM Banking', 'Smart Home Tower', 'Power Grid'];
        const completedZones = GS.zonesCompleted
            .map((done, i) => done ? zonesNames[i] : null)
            .filter(Boolean);

        const data = await gameApi.saveProgress({
            username: currentUsername,
            level: 5,
            score: finalScore,
            maxScore: 15000,
            levelCompleted: victory,
            timeRemaining: Math.ceil(GS.timer),
            phasesCompleted: completedZones,
            totalPhases: 5,
            stats: {
                zonesCompleted: GS.zonesCompleted.filter(Boolean).length,
                timeRemaining: Math.ceil(GS.timer),
                victory: victory
            }
        });
        if (data.success && statusEl) {
            statusEl.textContent = '\u2705 Progress saved!';
            statusEl.style.color = '#00ff88';
        } else if (statusEl) {
            throw new Error(data.error || 'Save failed');
        }
    } catch (err) {
        console.error('Save failed:', err.message);
        if (statusEl) {
            statusEl.textContent = '\u26a0 Could not save \u2014 backend offline';
            statusEl.style.color = '#ff4466';
        }
    }
}

async function fetchLeaderboard() {
    const box = document.getElementById('game-leaderboard-box');
    const rowsEl = document.getElementById('game-leaderboard-rows');
    if (!box || !rowsEl) return;
    box.style.display = 'block';
    try {
        const data = await gameApi.getLeaderboard(5);
        if (!data.success || !data.leaderboard || !data.leaderboard.length) {
            rowsEl.innerHTML = '<p style="color:#555;font-size:12px;">No entries yet.</p>';
            return;
        }
        rowsEl.innerHTML = data.leaderboard.map((e, i) => `
            <div style="display:flex;justify-content:space-between;color:#aaa;font-size:12px;padding:3px 0;border-bottom:1px solid #1a2a3a;">
                <span style="color:#b040ff;margin-right:8px;">#${i+1}</span>
                <span style="flex:1;color:#eee;">${escapeHtml(e.username)}</span>
                <span style="color:#00ff88;font-weight:bold;">${e.bestScore} ${e.completed ? '\ud83d\udee1\ufe0f' : ''}</span>
            </div>
        `).join('');
    } catch (err) {
        console.error('Leaderboard error:', err.message);
        rowsEl.innerHTML = '<p style="color:#555;font-size:12px;">Leaderboard offline.</p>';
    }
}

function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

gameApi?.prefillAgentInput('username-input');
