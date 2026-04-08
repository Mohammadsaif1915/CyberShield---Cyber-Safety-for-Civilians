// ==================== ZONES 1-3 ====================

// ========== ZONE 1: HOSPITAL NETWORK ==========
let z1 = {};
zoneInits[0] = function() {
    z1 = {
        nodes: [], servers: [], cleaned: 0, total: 15,
        spreadTimer: 0, spreadRate: 2.5, backup: false, backupTimer: 0,
        backupPos: { x: canvas.width - 100, y: canvas.height / 2 }
    };
    resetPlayer(100, canvas.height / 2);
    // spawn virus nodes
    for (let i = 0; i < z1.total; i++) {
        z1.nodes.push({
            x: rnd(120, canvas.width - 120), y: rnd(100, canvas.height - 100),
            size: rnd(10, 18), alive: true, pulse: rnd(0, 6), spreading: false,
            spreadCool: rnd(2, 5)
        });
    }
    // server lines
    for (let i = 0; i < 4; i++) {
        z1.servers.push({
            x1: 80 + i * (canvas.width - 160) / 3, y1: 70,
            x2: 80 + i * (canvas.width - 160) / 3, y2: canvas.height - 70,
            connected: false, holdTime: 0, holdNeeded: 1.5
        });
    }
    showZoneIntro(0);
};

zoneUpdates[0] = function(dt) {
    const bounds = { x: 30, y: 30, w: canvas.width - 60, h: canvas.height - 60 };
    updatePlayer(dt, bounds);
    hideInteract();

    let aliveCount = 0;
    // check player collision with nodes
    for (const n of z1.nodes) {
        if (!n.alive) continue;
        aliveCount++;
        n.pulse += dt * 4;
        n.spreadCool -= dt;
        if (dist(player, n) < n.size + player.size) {
            n.alive = false;
            z1.cleaned++;
            GS.score += 50;
            spawnParticles(n.x, n.y, C.green, 10, 4);
        }
        // spreading
        if (n.spreadCool <= 0 && z1.nodes.length < 40) {
            n.spreadCool = rnd(3, 7) / (1 + z1.spreadRate * 0.1);
            z1.nodes.push({
                x: n.x + rnd(-60, 60), y: n.y + rnd(-60, 60),
                size: rnd(8, 14), alive: true, pulse: 0, spreading: false,
                spreadCool: rnd(3, 6)
            });
            z1.total++;
        }
    }

    // server reconnection (hold E near server line top)
    for (const s of z1.servers) {
        if (s.connected) continue;
        const d = Math.hypot(player.x - s.x1, player.y - s.y1);
        if (d < 40) {
            showInteract('Hold E to reconnect server');
            if (keys['e']) {
                s.holdTime += dt;
                if (s.holdTime >= s.holdNeeded) {
                    s.connected = true;
                    GS.score += 200;
                    spawnParticles(s.x1, s.y1, C.cyan, 15, 5);
                }
            } else {
                s.holdTime = Math.max(0, s.holdTime - dt * 0.5);
            }
        }
    }

    // backup server activation
    const allServersConnected = z1.servers.every(s => s.connected);
    if (allServersConnected && !z1.backup) {
        const bd = dist(player, z1.backupPos);
        if (bd < 50) {
            showInteract('Activate Backup Server');
            if (kPressed('e')) {
                z1.backup = true;
                GS.score += 500;
                spawnParticles(z1.backupPos.x, z1.backupPos.y, C.green, 25, 6);
            }
        }
    }

    // check completion
    const aliveNow = z1.nodes.filter(n => n.alive).length;
    if (aliveNow === 0 && z1.backup) {
        completeZone(0);
        return;
    }

    // Failure: speed up spreading
    z1.spreadRate += dt * 0.1;

    showZoneProgress('Hospital Cleanup', (z1.cleaned / Math.max(1, z1.total)) * 100,
        `Nodes: ${aliveNow} remaining | Servers: ${z1.servers.filter(s=>s.connected).length}/4`);
    showZoneMeter('Virus Spread Rate', Math.min(100, z1.spreadRate * 10));

    if (kPressed('escape')) exitZone();
};

zoneDraws[0] = function() {
    ctx.fillStyle = '#040810';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(0, 0, canvas.width, canvas.height, 50);

    drawText('HOSPITAL NETWORK', canvas.width / 2, 20, 13, C.green);
    drawText('ESC: Exit Zone', 80, 20, 10, C.gray, 'center', "'Share Tech Mono', monospace");

    // server lines
    for (const s of z1.servers) {
        ctx.strokeStyle = s.connected ? C.cyan : C.red + '60';
        ctx.lineWidth = s.connected ? 3 : 1;
        ctx.setLineDash(s.connected ? [] : [5, 5]);
        ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke();
        ctx.setLineDash([]);
        // reconnection progress
        if (!s.connected && s.holdTime > 0) {
            ctx.fillStyle = C.cyan;
            ctx.fillRect(s.x1 - 15, s.y1 - 20, 30 * (s.holdTime / s.holdNeeded), 4);
        }
        // top node
        drawGlowCircle(s.x1, s.y1, 8, s.connected ? C.cyan : C.red, 0.8);
    }

    // virus nodes
    for (const n of z1.nodes) {
        if (!n.alive) continue;
        const p = Math.sin(n.pulse) * 0.3 + 0.7;
        drawGlowCircle(n.x, n.y, n.size * p, C.red, 0.7);
        // inner
        ctx.fillStyle = '#ff4060';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    // backup server
    if (z1.servers.every(s => s.connected) && !z1.backup) {
        const bp = z1.backupPos;
        const p = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
        drawGlowCircle(bp.x, bp.y, 25 * p, C.green, 0.6);
        drawText('BACKUP', bp.x, bp.y, 10, C.green);
    }
    if (z1.backup) {
        drawGlowCircle(z1.backupPos.x, z1.backupPos.y, 20, C.green, 1);
        drawText('ACTIVE', z1.backupPos.x, z1.backupPos.y, 9, C.white);
    }

    drawPlayer();
    drawParticles();
};

// ========== ZONE 2: TRAFFIC GRID ==========
let z2 = {};
zoneInits[1] = function() {
    z2 = {
        signals: [], cars: [], crashes: 0, maxCrashes: 8,
        stabilized: 0, totalSignals: 8, spawnTimer: 0
    };
    resetPlayer(canvas.width / 2, canvas.height / 2);
    // Create signal nodes in a grid
    const cols = 4, rows = 2;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = 150 + c * ((canvas.width - 300) / (cols - 1));
            const y = 200 + r * ((canvas.height - 400) / Math.max(1, rows - 1));
            z2.signals.push({
                x, y, state: rndInt(0, 3), // 0=up,1=right,2=down,3=left
                correct: rndInt(0, 3), fixed: false, pulse: rnd(0, 6)
            });
        }
    }
    // spawn initial cars
    for (let i = 0; i < 6; i++) spawnCar();
    showZoneIntro(1);
};

function spawnCar() {
    const horizontal = Math.random() > 0.5;
    const speed = rnd(1.5, 3);
    if (horizontal) {
        const fromLeft = Math.random() > 0.5;
        z2.cars.push({
            x: fromLeft ? -30 : canvas.width + 30,
            y: rnd(120, canvas.height - 120),
            vx: fromLeft ? speed : -speed, vy: 0,
            w: 30, h: 14, alive: true, color: ['#ff6060','#60ff60','#6060ff','#ffff60','#ff60ff'][rndInt(0,4)]
        });
    } else {
        const fromTop = Math.random() > 0.5;
        z2.cars.push({
            x: rnd(120, canvas.width - 120),
            y: fromTop ? -30 : canvas.height + 30,
            vx: 0, vy: fromTop ? speed : -speed,
            w: 14, h: 30, alive: true, color: ['#ff6060','#60ff60','#6060ff','#ffff60','#ff60ff'][rndInt(0,4)]
        });
    }
}

zoneUpdates[1] = function(dt) {
    const bounds = { x: 30, y: 30, w: canvas.width - 60, h: canvas.height - 60 };
    updatePlayer(dt, bounds);
    hideInteract();

    // Spawn cars
    z2.spawnTimer -= dt;
    if (z2.spawnTimer <= 0 && z2.cars.length < 20) {
        spawnCar();
        z2.spawnTimer = rnd(0.8, 2);
    }

    // Update cars
    for (const car of z2.cars) {
        if (!car.alive) continue;
        // Check if near a fixed signal - slow down
        let nearFixed = false;
        for (const s of z2.signals) {
            if (s.fixed && Math.hypot(car.x - s.x, car.y - s.y) < 80) {
                nearFixed = true;
                break;
            }
        }
        const speedMult = nearFixed ? 0.3 : 1;
        car.x += car.vx * speedMult;
        car.y += car.vy * speedMult;
        // Remove if off screen
        if (car.x < -60 || car.x > canvas.width + 60 || car.y < -60 || car.y > canvas.height + 60) {
            car.alive = false;
        }
    }

    // Check car collisions
    for (let i = 0; i < z2.cars.length; i++) {
        for (let j = i + 1; j < z2.cars.length; j++) {
            const a = z2.cars[i], b = z2.cars[j];
            if (!a.alive || !b.alive) continue;
            if (Math.hypot(a.x - b.x, a.y - b.y) < 25) {
                a.alive = false; b.alive = false;
                z2.crashes++;
                GS.screenShake = 5;
                spawnParticles((a.x + b.x) / 2, (a.y + b.y) / 2, C.orange, 15, 5);
            }
        }
    }
    z2.cars = z2.cars.filter(c => c.alive);

    // Signal interaction
    for (const s of z2.signals) {
        s.pulse += dt * 3;
        if (s.fixed) continue;
        const d = dist(player, s);
        if (d < 50) {
            showInteract('SPACE: Rotate Signal');
            if (kPressed(' ')) {
                s.state = (s.state + 1) % 4;
                spawnParticles(s.x, s.y, C.yellow, 5, 2);
                if (s.state === s.correct) {
                    s.fixed = true;
                    z2.stabilized++;
                    GS.score += 150;
                    spawnParticles(s.x, s.y, C.green, 12, 4);
                }
            }
        }
    }

    // Check failure
    if (z2.crashes >= z2.maxCrashes) {
        showMessage('SYSTEM FAILURE', 'Too many crashes! Traffic grid overwhelmed.', () => exitZone());
        return;
    }

    // Check completion
    if (z2.stabilized >= z2.totalSignals) {
        completeZone(1);
        return;
    }

    showZoneProgress('Traffic Stabilization', (z2.stabilized / z2.totalSignals) * 100,
        `Signals: ${z2.stabilized}/${z2.totalSignals} | Crashes: ${z2.crashes}/${z2.maxCrashes}`);
    showZoneMeter('Crash Counter', (z2.crashes / z2.maxCrashes) * 100);

    if (kPressed('escape')) exitZone();
};

zoneDraws[1] = function() {
    ctx.fillStyle = '#080810';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Road grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 40;
    for (const s of z2.signals) {
        ctx.beginPath(); ctx.moveTo(s.x, 0); ctx.lineTo(s.x, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, s.y); ctx.lineTo(canvas.width, s.y); ctx.stroke();
    }
    // Road markings
    ctx.strokeStyle = 'rgba(255,255,0,0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 15]);
    for (const s of z2.signals) {
        ctx.beginPath(); ctx.moveTo(s.x, 0); ctx.lineTo(s.x, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, s.y); ctx.lineTo(canvas.width, s.y); ctx.stroke();
    }
    ctx.setLineDash([]);

    drawText('TRAFFIC GRID', canvas.width / 2, 20, 13, C.yellow);
    drawText('ESC: Exit', 60, 20, 10, C.gray, 'center', "'Share Tech Mono', monospace");

    // Cars
    for (const car of z2.cars) {
        ctx.fillStyle = car.color;
        ctx.shadowColor = car.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(car.x - car.w / 2, car.y - car.h / 2, car.w, car.h);
        ctx.shadowBlur = 0;
    }

    // Signals
    for (const s of z2.signals) {
        const arrows = ['↑', '→', '↓', '←'];
        const col = s.fixed ? C.green : C.red;
        const p = s.fixed ? 1 : (Math.sin(s.pulse) * 0.3 + 0.7);
        ctx.globalAlpha = p;
        drawGlowCircle(s.x, s.y, 20, col, 0.5);
        ctx.globalAlpha = 1;
        drawText(arrows[s.state], s.x, s.y, 18, col);
        if (s.fixed) drawText('✓', s.x + 18, s.y - 18, 12, C.green);
    }

    drawPlayer();
    drawParticles();
};

// ========== ZONE 3: ATM BANKING ==========
let z3 = {};
zoneInits[2] = function() {
    z3 = {
        packets: [], encNodes: [], overload: 0, maxOverload: 100,
        intercepted: 0, needed: 20, spawnTimer: 0,
        encActivated: 0, totalEnc: 4
    };
    resetPlayer(canvas.width / 2, canvas.height - 80);
    // encryption nodes
    const positions = [
        { x: 150, y: canvas.height / 2 },
        { x: canvas.width - 150, y: canvas.height / 2 },
        { x: canvas.width / 2 - 150, y: 150 },
        { x: canvas.width / 2 + 150, y: 150 }
    ];
    for (const p of positions) {
        z3.encNodes.push({ x: p.x, y: p.y, active: false, pulse: rnd(0, 6) });
    }
    showZoneIntro(2);
};

function spawnPacket() {
    const malicious = Math.random() < 0.35;
    const side = rndInt(0, 3);
    let x, y, vx, vy;
    const sp = rnd(1.5, 3);
    switch (side) {
        case 0: x = rnd(50, canvas.width - 50); y = -10; vx = rnd(-0.5, 0.5); vy = sp; break;
        case 1: x = canvas.width + 10; y = rnd(50, canvas.height - 50); vx = -sp; vy = rnd(-0.5, 0.5); break;
        case 2: x = rnd(50, canvas.width - 50); y = canvas.height + 10; vx = rnd(-0.5, 0.5); vy = -sp; break;
        default: x = -10; y = rnd(50, canvas.height - 50); vx = sp; vy = rnd(-0.5, 0.5); break;
    }
    z3.packets.push({ x, y, vx, vy, malicious, alive: true, size: malicious ? 10 : 7 });
}

zoneUpdates[2] = function(dt) {
    const bounds = { x: 30, y: 30, w: canvas.width - 60, h: canvas.height - 60 };
    updatePlayer(dt, bounds);
    hideInteract();

    // Spawn packets
    z3.spawnTimer -= dt;
    if (z3.spawnTimer <= 0) {
        spawnPacket();
        z3.spawnTimer = rnd(0.3, 0.8);
    }

    // Update packets
    for (const p of z3.packets) {
        if (!p.alive) continue;
        // Encryption nodes deflect malicious packets
        for (const en of z3.encNodes) {
            if (en.active && Math.hypot(p.x - en.x, p.y - en.y) < 60 && p.malicious) {
                p.alive = false;
                spawnParticles(p.x, p.y, C.cyan, 5, 2);
                break;
            }
        }
        p.x += p.vx; p.y += p.vy;
        // Off screen malicious = overload
        if (p.x < -20 || p.x > canvas.width + 20 || p.y < -20 || p.y > canvas.height + 20) {
            if (p.malicious) z3.overload += 3;
            p.alive = false;
        }
        // Player intercept (SPACE or collision with malicious)
        if (p.malicious && p.alive) {
            const d = dist(player, p);
            if (d < player.size + p.size + 5) {
                if (keys[' '] || keys['f']) {
                    p.alive = false;
                    z3.intercepted++;
                    GS.score += 80;
                    spawnParticles(p.x, p.y, C.green, 8, 3);
                }
            }
        }
    }
    z3.packets = z3.packets.filter(p => p.alive);

    // Encryption nodes
    for (const en of z3.encNodes) {
        en.pulse += dt * 3;
        if (en.active) continue;
        if (dist(player, en) < 40) {
            showInteract('E: Activate Encryption');
            if (kPressed('e')) {
                en.active = true;
                z3.encActivated++;
                GS.score += 300;
                spawnParticles(en.x, en.y, C.cyan, 20, 5);
            }
        }
    }

    // Check overload failure
    if (z3.overload >= z3.maxOverload) {
        showMessage('SYSTEM OVERLOAD', 'ATM network overwhelmed!', () => exitZone());
        return;
    }

    // Check completion
    if (z3.intercepted >= z3.needed && z3.encActivated >= z3.totalEnc) {
        completeZone(2);
        return;
    }

    const progress = ((z3.intercepted / z3.needed) * 0.6 + (z3.encActivated / z3.totalEnc) * 0.4) * 100;
    showZoneProgress('ATM Security', progress,
        `Intercepted: ${z3.intercepted}/${z3.needed} | Encryption: ${z3.encActivated}/${z3.totalEnc}`);
    showZoneMeter('System Overload', (z3.overload / z3.maxOverload) * 100);

    if (kPressed('escape')) exitZone();
};

zoneDraws[2] = function() {
    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(0, 0, canvas.width, canvas.height, 60);

    drawText('ATM BANKING NETWORK', canvas.width / 2, 20, 13, C.orange);
    drawText('ESC: Exit', 60, 20, 10, C.gray, 'center', "'Share Tech Mono', monospace");

    // Packets
    for (const p of z3.packets) {
        if (!p.alive) continue;
        const col = p.malicious ? C.red : C.green;
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 8;
        if (p.malicious) {
            // diamond shape
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        } else {
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.shadowBlur = 0;
    }

    // Encryption nodes
    for (const en of z3.encNodes) {
        const col = en.active ? C.cyan : C.purple;
        const p = en.active ? 1 : (Math.sin(en.pulse) * 0.3 + 0.7);
        // Range circle
        if (en.active) {
            ctx.strokeStyle = C.cyan + '30';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(en.x, en.y, 60, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.globalAlpha = p;
        drawGlowCircle(en.x, en.y, 18, col, 0.7);
        ctx.globalAlpha = 1;
        drawText(en.active ? '🔐' : '🔓', en.x, en.y, 16, C.white);
    }

    drawPlayer();
    drawParticles();
};
