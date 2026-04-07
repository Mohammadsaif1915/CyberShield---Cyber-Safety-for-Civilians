// ==================== ZONES 4-5 ====================

// ========== ZONE 4: SMART HOME TOWER ==========
let z4 = {};
zoneInits[3] = function() {
    const gridW = 10, gridH = 7, cellSize = 60;
    const ox = (canvas.width - gridW * cellSize) / 2;
    const oy = (canvas.height - gridH * cellSize) / 2;
    z4 = {
        gridW, gridH, cellSize, ox, oy,
        devices: [], cameras: [], secured: 0, totalDevices: 8,
        alarmLevel: 0, maxAlarm: 100, holdTarget: null, holdTime: 0, holdNeeded: 1.2
    };
    resetPlayer(ox + cellSize * 5, oy + cellSize * 6);
    // Infected devices
    const spots = [];
    while (spots.length < z4.totalDevices) {
        const gx = rndInt(1, gridW - 2), gy = rndInt(1, gridH - 2);
        const key = `${gx},${gy}`;
        if (!spots.includes(key)) {
            spots.push(key);
            z4.devices.push({
                gx, gy, x: ox + gx * cellSize + cellSize / 2, y: oy + gy * cellSize + cellSize / 2,
                infected: true, pulse: rnd(0, 6)
            });
        }
    }
    // Security cameras (cones)
    const camPositions = [
        { gx: 0, gy: 0, angle: Math.PI / 4 },
        { gx: gridW - 1, gy: 0, angle: 3 * Math.PI / 4 },
        { gx: 0, gy: gridH - 1, angle: -Math.PI / 4 },
        { gx: gridW - 1, gy: gridH - 1, angle: -3 * Math.PI / 4 },
        { gx: Math.floor(gridW / 2), gy: 0, angle: Math.PI / 2 }
    ];
    for (const cp of camPositions) {
        z4.cameras.push({
            x: ox + cp.gx * cellSize + cellSize / 2,
            y: oy + cp.gy * cellSize + cellSize / 2,
            angle: cp.angle, sweep: cp.angle, sweepSpeed: rnd(0.4, 0.8),
            coneAngle: 0.5, coneRange: 150
        });
    }
    showZoneIntro(3);
};

function pointInCone(px, py, cx, cy, angle, halfAngle, range) {
    const dx = px - cx, dy = py - cy;
    const d = Math.hypot(dx, dy);
    if (d > range) return false;
    const a = Math.atan2(dy, dx);
    let diff = a - angle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return Math.abs(diff) < halfAngle;
}

zoneUpdates[3] = function(dt) {
    const bounds = { x: z4.ox, y: z4.oy, w: z4.gridW * z4.cellSize, h: z4.gridH * z4.cellSize };
    updatePlayer(dt, bounds);
    hideInteract();

    // Update cameras
    for (const cam of z4.cameras) {
        cam.sweep += cam.sweepSpeed * dt;
        cam.angle = cam.sweep + Math.sin(cam.sweep) * 0.5;
        // Check player in cone
        if (pointInCone(player.x, player.y, cam.x, cam.y, cam.angle, cam.coneAngle, cam.coneRange)) {
            z4.alarmLevel += dt * 15;
            GS.screenShake = 2;
        }
    }
    z4.alarmLevel = Math.max(0, z4.alarmLevel - dt * 2);

    // Check alarm failure
    if (z4.alarmLevel >= z4.maxAlarm) {
        showMessage('ALARM TRIGGERED', 'Security detected you! Mission compromised.', () => exitZone());
        return;
    }

    // Device interaction
    z4.holdTarget = null;
    for (const dev of z4.devices) {
        if (!dev.infected) continue;
        dev.pulse += dt * 4;
        const d = dist(player, dev);
        if (d < 35) {
            z4.holdTarget = dev;
            showInteract('Hold E to secure device');
            if (keys['e']) {
                z4.holdTime += dt;
                if (z4.holdTime >= z4.holdNeeded) {
                    dev.infected = false;
                    z4.secured++;
                    z4.holdTime = 0;
                    GS.score += 200;
                    spawnParticles(dev.x, dev.y, C.green, 12, 4);
                }
            } else {
                z4.holdTime = Math.max(0, z4.holdTime - dt * 2);
            }
            break;
        }
    }
    if (!z4.holdTarget) z4.holdTime = 0;

    // Check completion
    if (z4.secured >= z4.totalDevices) {
        completeZone(3);
        return;
    }

    showZoneProgress('Smart Home Security', (z4.secured / z4.totalDevices) * 100,
        `Devices: ${z4.secured}/${z4.totalDevices}`);
    showZoneMeter('Alarm Level', (z4.alarmLevel / z4.maxAlarm) * 100);

    if (kPressed('escape')) exitZone();
};

zoneDraws[3] = function() {
    ctx.fillStyle = '#060612';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { ox, oy, gridW, gridH, cellSize } = z4;

    drawText('SMART HOME TOWER', canvas.width / 2, 20, 13, C.purple);
    drawText('ESC: Exit', 60, 20, 10, C.gray, 'center', "'Share Tech Mono', monospace");

    // Grid
    ctx.strokeStyle = 'rgba(176,64,255,0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= gridW; x++) {
        ctx.beginPath(); ctx.moveTo(ox + x * cellSize, oy); ctx.lineTo(ox + x * cellSize, oy + gridH * cellSize); ctx.stroke();
    }
    for (let y = 0; y <= gridH; y++) {
        ctx.beginPath(); ctx.moveTo(ox, oy + y * cellSize); ctx.lineTo(ox + gridW * cellSize, oy + y * cellSize); ctx.stroke();
    }

    // Camera cones
    for (const cam of z4.cameras) {
        ctx.fillStyle = 'rgba(255,32,96,0.08)';
        ctx.beginPath();
        ctx.moveTo(cam.x, cam.y);
        ctx.arc(cam.x, cam.y, cam.coneRange, cam.angle - cam.coneAngle, cam.angle + cam.coneAngle);
        ctx.closePath();
        ctx.fill();
        // Camera border
        ctx.strokeStyle = 'rgba(255,32,96,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cam.x, cam.y);
        ctx.arc(cam.x, cam.y, cam.coneRange, cam.angle - cam.coneAngle, cam.angle + cam.coneAngle);
        ctx.closePath();
        ctx.stroke();
        // Camera dot
        drawGlowCircle(cam.x, cam.y, 6, C.red, 0.8);
    }

    // Devices
    for (const dev of z4.devices) {
        if (dev.infected) {
            const p = Math.sin(dev.pulse) * 0.4 + 0.6;
            ctx.globalAlpha = p;
            drawGlowRect(dev.x - 12, dev.y - 12, 24, 24, C.red, 0.6);
            ctx.globalAlpha = 1;
            drawText('📱', dev.x, dev.y, 14, C.white);
        } else {
            drawGlowRect(dev.x - 12, dev.y - 12, 24, 24, C.green, 0.4);
            drawText('✓', dev.x, dev.y, 14, C.green);
        }
    }

    // Hold progress
    if (z4.holdTarget && z4.holdTime > 0) {
        const dev = z4.holdTarget;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(dev.x - 20, dev.y - 28, 40, 5);
        ctx.fillStyle = C.green;
        ctx.fillRect(dev.x - 20, dev.y - 28, 40 * (z4.holdTime / z4.holdNeeded), 5);
    }

    drawPlayer();
    drawParticles();
};

// ========== ZONE 5: FINAL BOSS – POWER GRID ==========
let z5 = {};
zoneInits[4] = function() {
    const cx = canvas.width / 2, cy = canvas.height / 2;
    z5 = {
        boss: {
            x: cx, y: cy - 80, size: 50, hp: 100, maxHp: 100,
            angle: 0, moveAngle: 0, speed: 1.5, phase: 0,
            shieldAngle: 0, shieldCount: 3, shieldGap: 0.4, shieldRadius: 100
        },
        empWaves: [], empTimer: 3,
        fragments: [], fragmentTimer: 2,
        playerCharge: 0, maxCharge: 100, chargePerFragment: 20,
        beam: null, beamTimer: 0,
        phase: 0, // 0=fight, 1=victory animation
        victoryTimer: 0
    };
    resetPlayer(cx, canvas.height - 80);
    showZoneIntro(4);
};

zoneUpdates[4] = function(dt) {
    if (z5.phase === 1) {
        // Victory animation
        z5.victoryTimer += dt;
        if (z5.victoryTimer > 0.1) {
            spawnParticles(
                rnd(100, canvas.width - 100), rnd(100, canvas.height - 100),
                [C.cyan, C.green, C.purple, C.yellow][rndInt(0, 3)], 5, 6
            );
            z5.victoryTimer = 0;
        }
        updateParticles(dt);
        if (z5.victoryTimer > -1 && GS.particles.length > 200) {
            completeZone(4);
        }
        return;
    }

    const bounds = { x: 30, y: 30, w: canvas.width - 60, h: canvas.height - 60 };
    updatePlayer(dt, bounds);
    hideInteract();

    const boss = z5.boss;
    // Boss movement
    boss.moveAngle += dt * 0.5;
    boss.x = canvas.width / 2 + Math.cos(boss.moveAngle) * 150;
    boss.y = canvas.height / 2 - 80 + Math.sin(boss.moveAngle * 0.7) * 80;
    boss.angle += dt;
    boss.shieldAngle += dt * 1.5;

    // EMP waves
    z5.empTimer -= dt;
    if (z5.empTimer <= 0) {
        z5.empWaves.push({ x: boss.x, y: boss.y, radius: 0, maxRadius: 300, speed: 3 });
        z5.empTimer = rnd(2, 4);
    }
    for (let i = z5.empWaves.length - 1; i >= 0; i--) {
        const w = z5.empWaves[i];
        w.radius += w.speed;
        // Check player hit
        const pd = dist(player, w);
        if (Math.abs(pd - w.radius) < 15) {
            GS.screenShake = 8;
            z5.playerCharge = Math.max(0, z5.playerCharge - 10);
            spawnParticles(player.x, player.y, C.red, 8, 3);
        }
        if (w.radius >= w.maxRadius) z5.empWaves.splice(i, 1);
    }

    // Energy fragments
    z5.fragmentTimer -= dt;
    if (z5.fragmentTimer <= 0 && z5.fragments.length < 5) {
        z5.fragments.push({
            x: rnd(80, canvas.width - 80), y: rnd(80, canvas.height - 80),
            pulse: 0, alive: true
        });
        z5.fragmentTimer = rnd(2, 4);
    }
    for (let i = z5.fragments.length - 1; i >= 0; i--) {
        const f = z5.fragments[i];
        f.pulse += dt * 5;
        if (dist(player, f) < 30) {
            z5.playerCharge = Math.min(z5.maxCharge, z5.playerCharge + z5.chargePerFragment);
            GS.score += 100;
            spawnParticles(f.x, f.y, C.yellow, 10, 4);
            z5.fragments.splice(i, 1);
        }
    }

    // Fire beam (F key when fully charged)
    if (z5.playerCharge >= z5.maxCharge && (kPressed('f') || kPressed(' '))) {
        z5.beam = { timer: 0.5 };
        z5.playerCharge = 0;
        // Check if beam hits boss (check shield gaps)
        const angle = Math.atan2(boss.y - player.y, boss.x - player.x);
        let blocked = false;
        for (let s = 0; s < boss.shieldCount; s++) {
            const sa = boss.shieldAngle + (s * Math.PI * 2) / boss.shieldCount;
            let diff = angle - sa;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            if (Math.abs(diff) < boss.shieldGap) {
                // in gap - not blocked by this shield
            } else if (Math.abs(diff) < (Math.PI * 2 / boss.shieldCount) / 2) {
                blocked = true;
            }
        }
        if (!blocked) {
            boss.hp -= 25;
            GS.screenShake = 10;
            spawnParticles(boss.x, boss.y, C.cyan, 25, 8);
            GS.score += 500;
        } else {
            spawnParticles(
                boss.x + Math.cos(angle + Math.PI) * boss.shieldRadius,
                boss.y + Math.sin(angle + Math.PI) * boss.shieldRadius,
                C.purple, 15, 4
            );
        }
    }

    if (z5.beam) {
        z5.beam.timer -= dt;
        if (z5.beam.timer <= 0) z5.beam = null;
    }

    // Boss defeated
    if (boss.hp <= 0) {
        z5.phase = 1;
        z5.victoryTimer = 0;
        spawnParticles(boss.x, boss.y, C.red, 40, 10);
        spawnParticles(boss.x, boss.y, C.cyan, 40, 10);
        return;
    }

    if (z5.playerCharge >= z5.maxCharge) {
        showInteract('F: Fire Beam at AI Core');
    }

    showZoneProgress('AI Core HP', ((z5.boss.maxHp - z5.boss.hp) / z5.boss.maxHp) * 100,
        `Boss HP: ${boss.hp}/${boss.maxHp}`);
    showZoneMeter('Charge', (z5.playerCharge / z5.maxCharge) * 100);
    // Override meter color for charge
    document.getElementById('zone-meter-fill').style.background =
        `linear-gradient(90deg, ${C.cyan}, ${C.green})`;
    document.getElementById('zone-meter-label').textContent = 'ENERGY CHARGE';

    if (kPressed('escape')) exitZone();
};

zoneDraws[4] = function() {
    ctx.fillStyle = '#0a0408';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(0, 0, canvas.width, canvas.height, 40);

    drawText('POWER GRID – AI CORE', canvas.width / 2, 20, 13, C.red);
    drawText('ESC: Exit', 60, 20, 10, C.gray, 'center', "'Share Tech Mono', monospace");

    const boss = z5.boss;

    // EMP waves
    for (const w of z5.empWaves) {
        ctx.strokeStyle = `rgba(255,32,96,${0.5 * (1 - w.radius / w.maxRadius)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Energy fragments
    for (const f of z5.fragments) {
        const p = Math.sin(f.pulse) * 0.3 + 0.7;
        drawGlowCircle(f.x, f.y, 10 * p, C.yellow, 0.8);
        drawText('⚡', f.x, f.y, 12, C.yellow);
    }

    // Boss shields (rotating barriers)
    for (let s = 0; s < boss.shieldCount; s++) {
        const sa = boss.shieldAngle + (s * Math.PI * 2) / boss.shieldCount;
        const arcLen = (Math.PI * 2 / boss.shieldCount) - boss.shieldGap * 2;
        ctx.strokeStyle = C.purple;
        ctx.lineWidth = 6;
        ctx.shadowColor = C.purple;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, boss.shieldRadius, sa - arcLen / 2, sa + arcLen / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // Boss body
    const bossGlow = ctx.createRadialGradient(boss.x, boss.y, 0, boss.x, boss.y, boss.size * 2);
    bossGlow.addColorStop(0, 'rgba(255,32,96,0.3)');
    bossGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = bossGlow;
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.size * 2, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.save();
    ctx.translate(boss.x, boss.y);
    ctx.rotate(boss.angle);
    // Hexagonal core
    ctx.fillStyle = C.red;
    ctx.shadowColor = C.red;
    ctx.shadowBlur = 25;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const px = Math.cos(a) * boss.size;
        const py = Math.sin(a) * boss.size;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    // Inner core
    ctx.fillStyle = '#ff6080';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + boss.angle;
        const px = Math.cos(a) * boss.size * 0.5;
        const py = Math.sin(a) * boss.size * 0.5;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    // Eye
    ctx.fillStyle = C.white;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Boss HP bar
    const barW = 120, barH = 8;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(boss.x - barW / 2, boss.y - boss.size - 25, barW, barH);
    ctx.fillStyle = boss.hp > 50 ? C.red : C.yellow;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 8;
    ctx.fillRect(boss.x - barW / 2, boss.y - boss.size - 25, barW * (boss.hp / boss.maxHp), barH);
    ctx.shadowBlur = 0;

    // Beam
    if (z5.beam) {
        const a = Math.atan2(boss.y - player.y, boss.x - player.x);
        ctx.strokeStyle = C.cyan;
        ctx.lineWidth = 6;
        ctx.shadowColor = C.cyan;
        ctx.shadowBlur = 30;
        ctx.globalAlpha = z5.beam.timer / 0.5;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x + Math.cos(a) * 800, player.y + Math.sin(a) * 800);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }

    drawPlayer();
    drawParticles();
};
