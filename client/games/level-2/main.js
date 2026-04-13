// ============ CYBER SHIELD - LEVEL 2: SOCIAL MEDIA SCAM ROOM ============
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

// ---- GLOBALS ----
let gameRunning = false, phase = 0, score = 0, timer = 180, infection = 0;
let lastTime = 0, dt = 0, scanProgress = 0, dragItem = null, dragOffX = 0, dragOffY = 0;
let phaseTransition = 0, phaseTransText = '', shatterTimer = 0;
let keys = {}, mouseX = 0, mouseY = 0, mouseDown = false;
let particles = [], messages = [], floatingTexts = [];
const PHASES = ['PHASE 1: VIRAL GIVEAWAY','PHASE 2: DM CLONE DETECTION','PHASE 3: DEEPFAKE DETECTION','PHASE 4: QR SCAN','PHASE 5: SECURITY SEQUENCE'];

// ---- TUTORIAL SYSTEM ----
let tutorialPopup = null; // {title, steps[], timer, dismissed}
const PHASE_TUTORIALS = [
  { title: '📡 VIRAL GIVEAWAY', steps: [
    '① Move near a glowing post  (WASD / Arrow Keys)',
    '② Hold  [E]  until scan bar fills',
    '③ If post turns RED → it is FAKE',
    '④ Click & drag the red post → drop it on QUARANTINE BIN',
    '⚠ Quarantine 6 fake posts to advance!'
  ]},
  { title: '💬 DM CLONE DETECTION', steps: [
    '① Moving purple bubbles are incoming DMs',
    '② Walk INTO a bubble to intercept it',
    '③ Hold  [E]  to inspect intercepted DM',
    '④ Red pattern = FAKE → gets blocked automatically',
    '⚠ Block 8 fake DMs to advance!'
  ]},
  { title: '🎥 DEEPFAKE DETECTION', steps: [
    '① Move your MOUSE over the face on screen',
    '② The cyan beam follows your mouse',
    '③ When beam hits a blinking red circle → Hold  [E]',
    '④ Find all 4 glitch zones to shatter the deepfake!'
  ]},
  { title: '📱 QR SCAM SYSTEM', steps: [
    '① Go to the TERMINAL on the LEFT first',
    '② Hold  [E]  at terminal to activate Sandbox',
    '③ Then walk to the QR POSTER on the RIGHT',
    '④ Hold  [E]  to scan it safely',
    '⚠ Scanning QR without sandbox = GLITCH ATTACK!'
  ]},
  { title: '🔐 SECURITY SEQUENCE', steps: [
    '① You see coloured module boxes scattered around',
    '② Click & drag each module upward to its slot',
    '③ Slots are shown with dashed outlines at the TOP',
    '④ Install all 4 modules to WIN the mission!'
  ]}
];
let tutorialDismissTimer = 0; // auto-dismiss after 8s
let showGuidePanel = true;

// ---- PLAYER ----
const player = { x: 400, y: 400, w: 32, h: 32, speed: 200, color: '#00ffc8', glowColor: 'rgba(0,255,200,0.3)', nearItem: null, scanning: false };

// ---- PHASE DATA ----
let posts = [], quarantineBin = {}, dmMessages = [], deepfakeScan = {}, qrSystem = {}, secModules = [];
let postsCleared = 0, postsRequired = 0, dmsBlocked = 0, dmsRequired = 0;
let deepfakeFound = false, qrSafe = false, modulesPlaced = 0, modulesRequired = 0;
let dmSpawnTimer = 0, postSpawnTimer = 0;

// ---- INPUT ----
function isTypingTarget(target) {
    return target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
    );
}

window.addEventListener('keydown', e => {
    if (isTypingTarget(e.target)) return;
    keys[e.key.toLowerCase()] = true;
    e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
canvas.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; if(dragItem) { dragItem.x = mouseX - dragOffX; dragItem.y = mouseY - dragOffY; }});
canvas.addEventListener('mousedown', e => { mouseDown = true; tryPickup(); });
canvas.addEventListener('mouseup', e => { mouseDown = false; tryDrop(); });

// ---- HELPERS ----
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function rectCollide(a, b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
function addMsg(text, type='info') {
    const el = document.getElementById('messageLog');
    const d = document.createElement('div'); d.className = 'log-msg ' + type; d.textContent = text;
    el.appendChild(d); setTimeout(() => d.remove(), 3500);
    if(el.children.length > 5) el.firstChild.remove();
}
function addFloatText(x, y, text, color='#00ffc8') { floatingTexts.push({x,y,text,color,life:1.5,vy:-40}); }
function spawnParticles(x, y, count, color, speed) {
    for(let i=0;i<count;i++) { let a=Math.random()*Math.PI*2; particles.push({x,y,vx:Math.cos(a)*speed*(0.5+Math.random()),vy:Math.sin(a)*speed*(0.5+Math.random()),life:0.6+Math.random()*0.8,color,size:2+Math.random()*3}); }
}

// ---- PHASE INIT ----
function initPhase(p) {
    phase = p; scanProgress = 0; player.nearItem = null; dragItem = null;
    document.getElementById('phaseTitle').textContent = PHASES[p];
    phaseTransition = 2; phaseTransText = PHASES[p];
    // Show tutorial popup
    tutorialPopup = { ...PHASE_TUTORIALS[p], dismissed: false };
    tutorialDismissTimer = 9;
    if(p === 0) initViralGiveaway();
    else if(p === 1) initDMClone();
    else if(p === 2) initDeepfake();
    else if(p === 3) initQRScan();
    else if(p === 4) initSecuritySeq();
}
// Dismiss tutorial on any key or click
window.addEventListener('keydown', e => { if(tutorialPopup && !tutorialPopup.dismissed && e.key !== 'F5') tutorialPopup.dismissed = true; }, true);
canvas.addEventListener('click', () => { if(tutorialPopup && !tutorialPopup.dismissed) tutorialPopup.dismissed = true; });

// ---- PHASE 1: VIRAL GIVEAWAY ----
function initViralGiveaway() {
    posts = []; postsCleared = 0; postsRequired = 6; postSpawnTimer = 0;
    quarantineBin = { x: W - 140, y: H - 140, w: 110, h: 110, color: '#ff3050' };
    const fakeIndicators = ['FREE iPhone! Click NOW!','You WON $10000!!!','Send SSN to claim','URGENT: Verify account','Limited time CRYPTO deal','Hot singles near you'];
    const realIndicators = ['New album release','Weather update','Tech conference 2026','Community meetup','Open source project','Game dev tutorial'];
    for(let i = 0; i < 10; i++) {
        let fake = i < 6;
        posts.push({
            x: 100 + Math.random() * (W - 300), y: 80 + Math.random() * (H - 250),
            w: 180, h: 70, fake, scanned: false, revealed: false, draggable: false, quarantined: false,
            scrollSpeed: (0.3 + Math.random()*0.5) * (Math.random()>0.5?1:-1),
            title: fake ? fakeIndicators[i] : realIndicators[i-6],
            hiddenText: fake ? '⚠ MALICIOUS LINK DETECTED' : '✓ SAFE CONTENT',
            glowTimer: Math.random()*6, scanAmount: 0
        });
    }
    addMsg('Scan posts with [E]. Drag fakes to quarantine bin!', 'info');
}

function updateViralGiveaway() {
    let nearPost = null; let minDist = 80;
    posts.forEach(p => {
        if(p.quarantined) return;
        p.x += p.scrollSpeed * 30 * dt;
        if(p.x > W - 50) p.scrollSpeed = -Math.abs(p.scrollSpeed);
        if(p.x < 50) p.scrollSpeed = Math.abs(p.scrollSpeed);
        p.glowTimer += dt;
        let d = dist({x:player.x+16,y:player.y+16},{x:p.x+p.w/2,y:p.y+p.h/2});
        if(d < minDist && !p.revealed) { nearPost = p; minDist = d; }
        if(d < minDist && p.revealed && p.fake && !p.draggable) { p.draggable = true; }
    });
    player.nearItem = nearPost;
    if(nearPost && (keys['e'] || mouseDown)) {
        scanProgress += dt / 1.5; nearPost.scanAmount = scanProgress;
        showPrompt('Scanning post...', scanProgress / 1);
        if(scanProgress >= 1) {
            nearPost.revealed = true; nearPost.scanned = true; scanProgress = 0;
            if(nearPost.fake) { addMsg('FAKE POST DETECTED! Drag to quarantine.', 'warning'); nearPost.draggable = true; }
            else { addMsg('Post verified safe.', 'success'); addFloatText(nearPost.x, nearPost.y, '+50', '#00ffc8'); score += 50; }
            spawnParticles(nearPost.x+nearPost.w/2, nearPost.y+nearPost.h/2, 15, nearPost.fake?'#ff3050':'#00ffc8', 100);
        }
    } else { scanProgress = Math.max(0, scanProgress - dt*2); if(!nearPost) hidePrompt(); else showPrompt('Hold [E] to Scan', 0); }
    // Check quarantine
    posts.forEach(p => {
        if(p.draggable && p === dragItem && rectCollide(p, quarantineBin)) {
            p.quarantined = true; p.draggable = false; dragItem = null; postsCleared++;
            score += 100; addMsg('Post quarantined! (' + postsCleared + '/' + postsRequired + ')', 'success');
            addFloatText(p.x, p.y, '+100', '#00ffc8');
            spawnParticles(quarantineBin.x+55, quarantineBin.y+55, 25, '#ff3050', 120);
        }
    });
    // Infection from unscanned fakes over time (slow rate)
    let unscannedFakes = posts.filter(p => p.fake && !p.scanned && !p.quarantined).length;
    if(unscannedFakes > 0) infection += dt * unscannedFakes * 0.4;
    if(postsCleared >= postsRequired) { addMsg('All fake posts quarantined!', 'success'); score += 200; initPhase(1); }
}

function drawViralGiveaway() {
    // Quarantine bin
    let qb = quarantineBin;
    ctx.save();
    ctx.shadowBlur = 20; ctx.shadowColor = '#ff3050';
    ctx.strokeStyle = '#ff3050'; ctx.lineWidth = 2;
    ctx.strokeRect(qb.x, qb.y, qb.w, qb.h);
    ctx.fillStyle = 'rgba(255,48,80,0.1)'; ctx.fillRect(qb.x,qb.y,qb.w,qb.h);
    ctx.shadowBlur = 0; ctx.fillStyle = '#ff3050'; ctx.font = '12px Orbitron';
    ctx.textAlign = 'center'; ctx.fillText('QUARANTINE', qb.x+qb.w/2, qb.y+qb.h/2-8);
    ctx.fillText('BIN', qb.x+qb.w/2, qb.y+qb.h/2+10);
    ctx.restore();
    // Posts
    posts.forEach(p => {
        if(p.quarantined) return;
        ctx.save();
        let glow = Math.sin(p.glowTimer*3)*0.3+0.7;
        ctx.shadowBlur = 12; ctx.shadowColor = p.fake && p.revealed ? 'rgba(255,48,80,'+glow+')' : 'rgba(180,100,255,'+glow+')';
        ctx.fillStyle = p.revealed ? (p.fake ? 'rgba(80,0,20,0.9)' : 'rgba(0,40,30,0.9)') : 'rgba(30,10,60,0.9)';
        ctx.strokeStyle = p.revealed ? (p.fake ? '#ff3050' : '#00ffc8') : '#b464ff';
        ctx.lineWidth = 2; roundRect(ctx, p.x, p.y, p.w, p.h, 8); ctx.fill(); ctx.stroke();
        ctx.shadowBlur = 0; ctx.fillStyle = p.revealed ? (p.fake ? '#ff8090' : '#80ffcc') : '#c0a0e0';
        ctx.font = 'bold 11px Share Tech Mono'; ctx.textAlign = 'left';
        wrapText(ctx, p.revealed ? p.title : '█ Social Post █', p.x+10, p.y+22, p.w-20, 16);
        if(p.revealed) { ctx.font = '10px Share Tech Mono'; ctx.fillStyle = p.fake?'#ff5070':'#00ffc8'; ctx.fillText(p.hiddenText, p.x+10, p.y+55); }
        if(p.scanAmount > 0 && !p.revealed) {
            ctx.fillStyle = 'rgba(0,200,255,0.3)'; ctx.fillRect(p.x, p.y+p.h-6, p.w*Math.min(p.scanAmount,1), 4);
        }
        ctx.restore();
    });
}

// ---- PHASE 2: DM CLONE DETECTION ----
function initDMClone() {
    dmMessages = []; dmsBlocked = 0; dmsRequired = 8; dmSpawnTimer = 0;
    player.x = W/2; player.y = H/2;
    const realMsgs = ['Hey! Lunch tomorrow?','Meeting at 3pm','Check this repo','Game night Friday?','Happy birthday!🎂'];
    const fakeMsgs = ['SEND CODE NOW','Verify ur account ASAP','Click link 4 prize','ur acc suspended!! act NOW','FREE gift card!! DM back','I need ur password','Wire me $500 urgent','Login here immediately'];
    for(let i=0;i<16;i++) {
        let fake = i < 8;
        let angle = Math.random()*Math.PI*2;
        dmMessages.push({
            x: W/2 + Math.cos(angle)*(300+Math.random()*200), y: H/2 + Math.sin(angle)*(200+Math.random()*150),
            w: 160, h: 50, fake, intercepted: false, blocked: false, inspecting: false, inspectProgress: 0,
            text: fake ? fakeMsgs[i] : realMsgs[i-8],
            vx: (Math.random()-0.5)*60, vy: (Math.random()-0.5)*60,
            patternType: fake ? Math.floor(Math.random()*3) : 3+Math.floor(Math.random()*2),
            multiplied: false, age: 0, glow: Math.random()*6
        });
    }
    addMsg('Intercept DMs by touching them. Hold [E] to inspect. Block fakes!', 'info');
}

function updateDMClone() {
    dmSpawnTimer += dt;
    // Multiply unblocked fakes over time
    if(dmSpawnTimer > 12) {
        dmSpawnTimer = 0;
        let unblockedFakes = dmMessages.filter(m=>m.fake&&!m.blocked&&!m.intercepted);
        if(unblockedFakes.length > 0 && dmMessages.length < 22) {
            let src = unblockedFakes[Math.floor(Math.random()*unblockedFakes.length)];
            dmMessages.push({...src, x:src.x+40, y:src.y+40, multiplied:true, intercepted:false, blocked:false, inspecting:false, inspectProgress:0, vx:(Math.random()-0.5)*60, vy:(Math.random()-0.5)*60});
            addMsg('⚠ Fake DM multiplied!', 'warning'); infection += 1.5;
        }
    }
    let nearDM = null; let minD = 60;
    dmMessages.forEach(m => {
        if(m.blocked) return;
        m.age += dt; m.glow += dt;
        if(!m.intercepted) {
            m.x += m.vx * dt; m.y += m.vy * dt;
            if(m.x < 30 || m.x > W-30-m.w) m.vx *= -1;
            if(m.y < 60 || m.y > H-30-m.h) m.vy *= -1;
            // Player intercept
            if(rectCollide(player, m)) {
                m.intercepted = true; m.vx = 0; m.vy = 0;
                addMsg('DM intercepted! Hold [E] to inspect.', 'info');
                spawnParticles(m.x+m.w/2, m.y+m.h/2, 10, '#b464ff', 60);
            }
        }
        if(m.intercepted && !m.blocked) {
            let d = dist({x:player.x+16,y:player.y+16},{x:m.x+m.w/2,y:m.y+m.h/2});
            if(d < minD) { nearDM = m; minD = d; }
        }
    });
    player.nearItem = nearDM;
    if(nearDM && (keys['e'] || mouseDown)) {
        nearDM.inspecting = true; nearDM.inspectProgress += dt / 1.2;
        showPrompt('Inspecting DM...', nearDM.inspectProgress);
        if(nearDM.inspectProgress >= 1) {
            nearDM.blocked = true; nearDM.inspecting = false;
            if(nearDM.fake) {
                dmsBlocked++; score += 80; addMsg('Fake DM blocked! (' + dmsBlocked + '/' + dmsRequired + ')', 'success');
                addFloatText(nearDM.x, nearDM.y, '+80 BLOCKED', '#00ffc8');
            } else {
                score += 30; addMsg('Real DM verified & delivered.', 'success');
                addFloatText(nearDM.x, nearDM.y, '+30 SAFE', '#80ff80');
            }
            spawnParticles(nearDM.x+nearDM.w/2,nearDM.y+nearDM.h/2,20,nearDM.fake?'#ff3050':'#00ffc8',100);
        }
    } else if(nearDM) { showPrompt('Hold [E] to Inspect', 0); } else { hidePrompt(); }
    if(dmsBlocked >= dmsRequired) { addMsg('All clone DMs blocked!', 'success'); score += 200; initPhase(2); }
}

function drawDMClone() {
    dmMessages.forEach(m => {
        if(m.blocked) return;
        ctx.save();
        let gl = Math.sin(m.glow*3)*0.3+0.7;
        ctx.shadowBlur = 10; ctx.shadowColor = m.intercepted ? (m.fake?'rgba(255,48,80,'+gl+')':'rgba(0,255,200,'+gl+')') : 'rgba(180,100,255,'+gl+')';
        ctx.fillStyle = m.intercepted ? (m.fake ? 'rgba(80,0,20,0.9)' : 'rgba(0,40,30,0.9)') : 'rgba(25,10,50,0.85)';
        ctx.strokeStyle = m.intercepted ? (m.fake ? '#ff3050' : '#00ffc8') : '#8040c0';
        ctx.lineWidth = 2; roundRect(ctx, m.x, m.y, m.w, m.h, 6); ctx.fill(); ctx.stroke();
        // Pattern indicator (visual, not text quiz)
        ctx.shadowBlur = 0;
        let px = m.x + m.w - 30, py = m.y + 8;
        drawPattern(ctx, px, py, 20, m.patternType, m.intercepted);
        ctx.fillStyle = m.intercepted ? '#e0d0ff' : '#a080c0'; ctx.font = '10px Share Tech Mono'; ctx.textAlign='left';
        wrapText(ctx, m.intercepted ? m.text : '██ Encrypted ██', m.x+8, m.y+20, m.w-40, 14);
        if(m.inspecting) { ctx.fillStyle='rgba(0,200,255,0.3)'; ctx.fillRect(m.x,m.y+m.h-5,m.w*Math.min(m.inspectProgress,1),4); }
        ctx.restore();
    });
}

function drawPattern(ctx, x, y, size, type, revealed) {
    ctx.save(); ctx.lineWidth = 1.5;
    let c = revealed ? ['#ff3050','#ff5020','#ff0060','#00ffc8','#40ff80'][type] : '#6030a0';
    ctx.strokeStyle = c;
    if(type===0){ctx.beginPath();for(let i=0;i<3;i++){ctx.moveTo(x+i*7,y);ctx.lineTo(x+i*7,y+size);}ctx.stroke();}
    else if(type===1){ctx.beginPath();ctx.arc(x+size/2,y+size/2,size/2,0,Math.PI*2);ctx.moveTo(x+size/2,y);ctx.lineTo(x+size/2,y+size);ctx.stroke();}
    else if(type===2){ctx.beginPath();ctx.moveTo(x,y+size);ctx.lineTo(x+size/2,y);ctx.lineTo(x+size,y+size);ctx.closePath();ctx.stroke();}
    else if(type===3){ctx.beginPath();ctx.rect(x+2,y+2,size-4,size-4);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+size,y+size);ctx.moveTo(x+size,y);ctx.lineTo(x,y+size);ctx.stroke();}
    ctx.restore();
}

// ---- PHASE 3: DEEPFAKE DETECTION ----
function initDeepfake() {
    deepfakeFound = false; player.x = W/2 - 100; player.y = H/2 + 100;
    let fw = 360, fh = 280;
    deepfakeScan = {
        screenX: W/2 - fw/2, screenY: H/2 - fh/2 - 30, screenW: fw, screenH: fh,
        beamX: W/2, beamY: H/2, beamW: 60, beamH: 12,
        glitchZones: [], foundZones: 0, totalZones: 4, shatter: false, shatterTime: 0,
        faceX: W/2, faceY: H/2 - 30, faceR: 80, frameTimer: 0, staticNoise: []
    };
    for(let i=0;i<4;i++) {
        let a = Math.random()*Math.PI*2, r = 30+Math.random()*40;
        deepfakeScan.glitchZones.push({
            x: deepfakeScan.faceX + Math.cos(a)*r, y: deepfakeScan.faceY + Math.sin(a)*r,
            r: 14+Math.random()*10, found: false, pulseTimer: Math.random()*6
        });
    }
    for(let i=0;i<200;i++) deepfakeScan.staticNoise.push({x:Math.random()*fw,y:Math.random()*fh,s:1+Math.random()*2});
    addMsg('Move scan beam with mouse/keys over the face. Detect glitch zones!', 'info');
}

function updateDeepfake() {
    let ds = deepfakeScan; ds.frameTimer += dt;
    // Beam follows mouse or keys
    if(keys['arrowleft']||keys['a']) ds.beamX -= 200*dt;
    if(keys['arrowright']||keys['d']) ds.beamX += 200*dt;
    if(keys['arrowup']||keys['w']) ds.beamY -= 200*dt;
    if(keys['arrowdown']||keys['s']) ds.beamY += 200*dt;
    ds.beamX += (mouseX - ds.beamX)*0.08; ds.beamY += (mouseY - ds.beamY)*0.08;
    ds.beamX = Math.max(ds.screenX, Math.min(ds.screenX+ds.screenW-ds.beamW, ds.beamX));
    ds.beamY = Math.max(ds.screenY, Math.min(ds.screenY+ds.screenH-ds.beamH, ds.beamY));
    // Check glitch zones
    ds.glitchZones.forEach(gz => {
        gz.pulseTimer += dt;
        if(gz.found) return;
        let bCx = ds.beamX+ds.beamW/2, bCy = ds.beamY+ds.beamH/2;
        if(Math.hypot(bCx-gz.x, bCy-gz.y) < gz.r+20 && (keys['e']||mouseDown)) {
            gz.found = true; ds.foundZones++; score += 120;
            addMsg('Glitch zone ' + ds.foundZones + '/' + ds.totalZones + ' locked!', 'success');
            addFloatText(gz.x, gz.y, '+120 GLITCH', '#00ffc8');
            spawnParticles(gz.x, gz.y, 30, '#ff00ff', 120);
        }
    });
    showPrompt('Sweep beam over face. Hold [E] on glitch zones. (' + ds.foundZones + '/' + ds.totalZones + ')', 0);
    if(ds.foundZones >= ds.totalZones && !ds.shatter) {
        ds.shatter = true; ds.shatterTime = 0;
        addMsg('DEEPFAKE DETECTED! Screen shattering...', 'success'); score += 300;
        spawnParticles(ds.faceX, ds.faceY, 60, '#c860ff', 200);
        shatterTimer = 2;
    }
    if(ds.shatter) { ds.shatterTime += dt; if(ds.shatterTime > 2.5) { addMsg('Deepfake neutralized!', 'success'); initPhase(3); } }
}

function drawDeepfake() {
    let ds = deepfakeScan;
    ctx.save();
    // Video screen
    ctx.fillStyle = '#100828'; ctx.strokeStyle = '#b464ff'; ctx.lineWidth = 3;
    roundRect(ctx, ds.screenX-5, ds.screenY-5, ds.screenW+10, ds.screenH+10, 10); ctx.fill(); ctx.stroke();
    // Static noise
    ds.staticNoise.forEach(n => { ctx.fillStyle = 'rgba(180,100,255,'+(0.1+Math.random()*0.15)+')'; ctx.fillRect(ds.screenX+n.x, ds.screenY+n.y, n.s, n.s); });
    if(!ds.shatter) {
        // Face
        ctx.beginPath(); ctx.arc(ds.faceX, ds.faceY, ds.faceR, 0, Math.PI*2);
        let g1 = ctx.createRadialGradient(ds.faceX,ds.faceY,10,ds.faceX,ds.faceY,ds.faceR);
        g1.addColorStop(0,'#d4a0ff'); g1.addColorStop(1,'#6020a0'); ctx.fillStyle = g1; ctx.fill();
        ctx.strokeStyle='#c860ff'; ctx.lineWidth=2; ctx.stroke();
        // Eyes
        ctx.fillStyle='#200840';
        ctx.beginPath(); ctx.ellipse(ds.faceX-22,ds.faceY-15,10,6,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(ds.faceX+22,ds.faceY-15,10,6,0,0,Math.PI*2); ctx.fill();
        // Mouth
        ctx.beginPath(); ctx.arc(ds.faceX,ds.faceY+25,18,0.1*Math.PI,0.9*Math.PI); ctx.strokeStyle='#200840'; ctx.lineWidth=2; ctx.stroke();
        // Glitch zones
        ds.glitchZones.forEach(gz => {
            let p = Math.sin(gz.pulseTimer*5)*0.4+0.6;
            if(!gz.found) { ctx.save(); ctx.globalAlpha=p*0.6; ctx.strokeStyle='#ff0060'; ctx.lineWidth=2; ctx.setLineDash([4,4]);
                ctx.beginPath(); ctx.arc(gz.x,gz.y,gz.r,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
                // Glitch visual
                ctx.fillStyle='rgba(255,0,96,0.15)'; ctx.fillRect(gz.x-gz.r,gz.y-3,gz.r*2,6);
                ctx.restore();
            } else { ctx.save(); ctx.shadowBlur=15; ctx.shadowColor='#00ffc8'; ctx.strokeStyle='#00ffc8'; ctx.lineWidth=2;
                ctx.beginPath(); ctx.arc(gz.x,gz.y,gz.r,0,Math.PI*2); ctx.stroke();
                ctx.fillStyle='rgba(0,255,200,0.15)'; ctx.fill(); ctx.restore(); }
        });
        // Scan beam
        ctx.save(); ctx.shadowBlur=20; ctx.shadowColor='#00c8ff';
        ctx.fillStyle='rgba(0,200,255,0.25)'; ctx.fillRect(ds.beamX-100, ds.beamY-2, 200+ds.beamW, ds.beamH+4);
        ctx.fillStyle='rgba(0,200,255,0.6)'; ctx.fillRect(ds.beamX, ds.beamY, ds.beamW, ds.beamH);
        ctx.restore();
        ctx.fillStyle='#00c8ff'; ctx.font='10px Orbitron'; ctx.textAlign='center';
        ctx.fillText('SCAN BEAM', ds.beamX+ds.beamW/2, ds.beamY-8);
    } else {
        // Shatter animation
        let t = ds.shatterTime;
        for(let i=0;i<20;i++) {
            let sx = ds.screenX + Math.random()*ds.screenW, sy = ds.screenY + Math.random()*ds.screenH;
            let sw = 20+Math.random()*40, sh = 20+Math.random()*40;
            ctx.save(); ctx.translate(sx,sy); ctx.rotate(t*2*(Math.random()-0.5));
            ctx.globalAlpha = Math.max(0,1-t/2);
            ctx.fillStyle = ['#c860ff','#ff0060','#00ffc8','#0080ff'][i%4];
            ctx.fillRect(-sw/2*(1+t), -sh/2*(1+t), sw, sh);
            ctx.restore();
        }
    }
    ctx.restore();
}

// ---- PHASE 4: QR SCAM ----
function initQRScan() {
    qrSafe = false; player.x = 200; player.y = H/2;
    qrSystem = {
        terminalX: 100, terminalY: H/2 - 50, terminalW: 80, terminalH: 80, terminalActivated: false,
        qrX: W - 220, qrY: H/2 - 60, qrW: 120, qrH: 120, scanned: false, glitchAttack: false, glitchTimer: 0,
        sandboxActive: false, scanProgress: 0
    };
    addMsg('Go to TERMINAL first to activate sandbox. Then scan QR safely!', 'info');
}

function updateQRScan() {
    let qs = qrSystem;
    let nearTerminal = dist({x:player.x+16,y:player.y+16},{x:qs.terminalX+qs.terminalW/2,y:qs.terminalY+qs.terminalH/2}) < 70;
    let nearQR = dist({x:player.x+16,y:player.y+16},{x:qs.qrX+qs.qrW/2,y:qs.qrY+qs.qrH/2}) < 80;
    if(qs.glitchAttack) {
        qs.glitchTimer += dt; infection += dt * 4;
        showPrompt('⚠ GLITCH ATTACK! Go to terminal to fix!', 0);
        if(nearTerminal && (keys['e']||mouseDown)) {
            qs.glitchAttack = false; qs.terminalActivated = true; qs.sandboxActive = true; qs.glitchTimer = 0;
            addMsg('Sandbox activated! Glitch neutralized. Now scan QR safely.', 'success');
            spawnParticles(qs.terminalX+40, qs.terminalY+40, 20, '#00ffc8', 100);
        }
        return;
    }
    if(nearTerminal && !qs.terminalActivated) {
        showPrompt('Hold [E] to Activate Sandbox Scanner', scanProgress);
        if(keys['e']||mouseDown) {
            scanProgress += dt/1.5;
            if(scanProgress >= 1) { qs.terminalActivated = true; qs.sandboxActive = true; scanProgress = 0;
                addMsg('Sandbox scanner ACTIVATED! Now scan the QR poster.', 'success'); score += 50;
                spawnParticles(qs.terminalX+40, qs.terminalY+40, 25, '#00ffc8', 80);
            }
        } else scanProgress = Math.max(0,scanProgress-dt*2);
    } else if(nearQR && !qs.scanned) {
        if(!qs.sandboxActive) {
            showPrompt('⚠ DANGER: Activate sandbox first!', 0);
            if(keys['e']||mouseDown) {
                qs.glitchAttack = true; addMsg('DIRECT SCAN! Glitch attack triggered!', 'warning');
                spawnParticles(qs.qrX+60, qs.qrY+60, 40, '#ff0040', 150); infection += 10;
            }
        } else {
            showPrompt('Hold [E] to Scan QR Safely', scanProgress);
            if(keys['e']||mouseDown) {
                scanProgress += dt/2;
                if(scanProgress >= 1) { qs.scanned = true; qrSafe = true; scanProgress = 0; score += 200;
                    addMsg('QR decoded safely in sandbox! Threat contained.', 'success');
                    addFloatText(qs.qrX, qs.qrY, '+200 SAFE SCAN', '#00ffc8');
                    spawnParticles(qs.qrX+60, qs.qrY+60, 30, '#00ffc8', 120);
                    setTimeout(()=>initPhase(4), 1500);
                }
            } else scanProgress = Math.max(0,scanProgress-dt*2);
        }
    } else hidePrompt();
}

function drawQRScan() {
    let qs = qrSystem;
    // Terminal
    ctx.save(); ctx.shadowBlur=15; ctx.shadowColor = qs.terminalActivated?'#00ffc8':'#b464ff';
    ctx.fillStyle = qs.terminalActivated?'rgba(0,60,40,0.9)':'rgba(30,10,60,0.9)';
    ctx.strokeStyle = qs.terminalActivated?'#00ffc8':'#b464ff'; ctx.lineWidth=2;
    roundRect(ctx,qs.terminalX,qs.terminalY,qs.terminalW,qs.terminalH,8); ctx.fill(); ctx.stroke();
    ctx.shadowBlur=0; ctx.fillStyle=qs.terminalActivated?'#00ffc8':'#c0a0e0'; ctx.font='bold 11px Orbitron'; ctx.textAlign='center';
    ctx.fillText('TERMINAL',qs.terminalX+qs.terminalW/2,qs.terminalY+35);
    ctx.fillText(qs.terminalActivated?'[ACTIVE]':'[IDLE]',qs.terminalX+qs.terminalW/2,qs.terminalY+52);
    ctx.restore();
    // QR Poster
    ctx.save(); let qGlow = qs.glitchAttack ? '#ff0040' : (qs.scanned?'#00ffc8':'#c860ff');
    ctx.shadowBlur=20; ctx.shadowColor=qGlow;
    ctx.fillStyle = qs.scanned?'rgba(0,60,40,0.9)':'rgba(40,10,60,0.9)';
    ctx.strokeStyle = qGlow; ctx.lineWidth = 2;
    roundRect(ctx,qs.qrX,qs.qrY,qs.qrW,qs.qrH,8); ctx.fill(); ctx.stroke();
    ctx.shadowBlur=0;
    // Draw QR pattern
    ctx.fillStyle = qs.scanned?'#00ffc8':'#e0d0ff';
    let qs2 = 8, ox = qs.qrX+20, oy = qs.qrY+20;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
        if((r<3&&c<3)||(r<3&&c>4)||(r>4&&c<3)||Math.random()>0.5)
            ctx.fillRect(ox+c*qs2+c, oy+r*qs2+r, qs2, qs2);
    }
    ctx.fillStyle = qGlow; ctx.font='10px Orbitron'; ctx.textAlign='center';
    ctx.fillText('QR POSTER', qs.qrX+qs.qrW/2, qs.qrY+qs.qrH+15);
    if(qs.glitchAttack) {
        ctx.globalAlpha = 0.3+Math.random()*0.3; ctx.fillStyle='#ff0040';
        ctx.fillRect(qs.qrX-10,qs.qrY-10,qs.qrW+20,qs.qrH+20);
        ctx.globalAlpha=1; ctx.fillStyle='#ff0040'; ctx.font='bold 14px Orbitron';
        ctx.fillText('⚠ GLITCH ATTACK ⚠', qs.qrX+qs.qrW/2, qs.qrY-20);
    }
    ctx.restore();
}

// ---- PHASE 5: SECURITY SEQUENCE ----
function initSecuritySeq() {
    secModules = []; modulesPlaced = 0; modulesRequired = 4; player.x = W/2; player.y = H - 150;
    const mods = [{name:'2FA AUTH',color:'#00ffc8'},{name:'RECOVERY KEY',color:'#c860ff'},{name:'ENCRYPTION',color:'#0080ff'},{name:'FIREWALL',color:'#ff9020'}];
    const slotXStart = W/2 - 200;
    for(let i=0;i<4;i++) {
        secModules.push({
            x: 80+Math.random()*(W-260), y: 100+Math.random()*(H-300), w:100, h:50,
            name: mods[i].name, color: mods[i].color, placed: false, dragging: false,
            slotX: slotXStart + i*110, slotY: 80, slotW: 100, slotH: 50
        });
    }
    addMsg('Drag security modules to their slots! Time is running out!', 'info');
}

function updateSecuritySeq() {
    // Check drop
    secModules.forEach(m => {
        if(m.placed) return;
        if(m === dragItem && !mouseDown) {
            if(Math.hypot(m.x+m.w/2 - (m.slotX+m.slotW/2), m.y+m.h/2 - (m.slotY+m.slotH/2)) < 60) {
                m.placed = true; m.x = m.slotX; m.y = m.slotY; modulesPlaced++; dragItem = null;
                score += 100; addMsg(m.name + ' installed! (' + modulesPlaced + '/' + modulesRequired + ')', 'success');
                addFloatText(m.x, m.y, '+100', '#00ffc8');
                spawnParticles(m.x+m.w/2, m.y+m.h/2, 25, m.color, 100);
            }
        }
    });
    hidePrompt();
    if(modulesPlaced >= modulesRequired) { winGame(); }
}

function drawSecuritySeq() {
    // Slots
    secModules.forEach(m => {
        ctx.save(); ctx.setLineDash([6,4]); ctx.strokeStyle = m.color; ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
        roundRect(ctx, m.slotX, m.slotY, m.slotW, m.slotH, 6); ctx.stroke(); ctx.setLineDash([]);
        ctx.globalAlpha = 0.3; ctx.fillStyle = m.color; ctx.font='9px Orbitron'; ctx.textAlign='center';
        ctx.fillText(m.name, m.slotX+m.slotW/2, m.slotY+m.slotH/2+3); ctx.restore();
    });
    // Modules
    secModules.forEach(m => {
        ctx.save(); ctx.shadowBlur=12; ctx.shadowColor=m.color;
        ctx.fillStyle = m.placed?'rgba(0,60,40,0.9)':'rgba(30,10,60,0.9)';
        ctx.strokeStyle = m.color; ctx.lineWidth = 2;
        roundRect(ctx, m.x, m.y, m.w, m.h, 6); ctx.fill(); ctx.stroke();
        ctx.shadowBlur=0; ctx.fillStyle=m.placed?'#00ffc8':m.color; ctx.font='bold 11px Orbitron'; ctx.textAlign='center';
        ctx.fillText(m.name, m.x+m.w/2, m.y+m.h/2+4);
        if(m.placed) { ctx.fillStyle='#00ffc8'; ctx.font='16px Share Tech Mono'; ctx.fillText('✓', m.x+m.w-15, m.y+18); }
        ctx.restore();
    });
}

// ---- DRAG & DROP ----
function tryPickup() {
    if(phase === 0) { posts.forEach(p => { if(p.draggable && !p.quarantined && rectCollide({x:mouseX-5,y:mouseY-5,w:10,h:10}, p)) { dragItem = p; dragOffX = mouseX-p.x; dragOffY = mouseY-p.y; }}); }
    if(phase === 4) { secModules.forEach(m => { if(!m.placed && rectCollide({x:mouseX-5,y:mouseY-5,w:10,h:10}, m)) { dragItem = m; dragOffX = mouseX-m.x; dragOffY = mouseY-m.y; m.dragging = true; }}); }
}
function tryDrop() { if(dragItem) { if(dragItem.dragging) dragItem.dragging = false; dragItem = null; } }

// ---- PROMPT HELPERS ----
function showPrompt(text, progress) {
    let el = document.getElementById('interactPrompt'); el.classList.remove('hidden');
    document.getElementById('promptText').textContent = text;
    document.getElementById('scanBarInner').style.width = Math.min(progress*100,100)+'%';
}
function hidePrompt() { document.getElementById('interactPrompt').classList.add('hidden'); }

// ---- DRAWING HELPERS ----
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath(); }
function wrapText(ctx, text, x, y, maxW, lineH) { let words=text.split(' '),line=''; for(let w of words){let test=line+w+' '; if(ctx.measureText(test).width>maxW&&line!==''){ctx.fillText(line,x,y);y+=lineH;line=w+' ';}else line=test;} ctx.fillText(line,x,y); }

// ---- ROOM DRAWING ----
function drawRoom() {
    // Background
    let bgG = ctx.createRadialGradient(W/2,H/2,100,W/2,H/2,Math.max(W,H));
    bgG.addColorStop(0,'#1a0030'); bgG.addColorStop(1,'#0a0015'); ctx.fillStyle=bgG; ctx.fillRect(0,0,W,H);
    // Grid
    ctx.strokeStyle = 'rgba(180,100,255,0.06)'; ctx.lineWidth = 1;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Ambient particles
    let t = performance.now()/1000;
    for(let i=0;i<8;i++){
        let px=(W/2+Math.sin(t*0.3+i*1.2)*W*0.4), py=(H/2+Math.cos(t*0.2+i*0.9)*H*0.35);
        ctx.beginPath(); ctx.arc(px,py,1.5+Math.sin(t+i)*1,0,Math.PI*2);
        ctx.fillStyle='rgba(200,96,255,0.25)'; ctx.fill();
    }
    // Neon border
    ctx.save(); ctx.shadowBlur=15; ctx.shadowColor='rgba(180,100,255,0.3)';
    ctx.strokeStyle='rgba(180,100,255,0.15)'; ctx.lineWidth=2;
    ctx.strokeRect(15,15,W-30,H-30); ctx.restore();
}

// ---- PLAYER DRAWING ----
function drawPlayer() {
    ctx.save(); let t = performance.now()/1000;
    // Glow
    ctx.shadowBlur = 20; ctx.shadowColor = player.glowColor;
    // Body
    ctx.fillStyle = player.color;
    ctx.beginPath(); ctx.arc(player.x+16, player.y+16, 14, 0, Math.PI*2); ctx.fill();
    // Inner
    ctx.fillStyle = '#0a0015'; ctx.beginPath(); ctx.arc(player.x+16, player.y+16, 8, 0, Math.PI*2); ctx.fill();
    // Pulse ring
    ctx.shadowBlur = 0; ctx.strokeStyle = player.color; ctx.lineWidth = 1; ctx.globalAlpha = 0.3+Math.sin(t*4)*0.2;
    ctx.beginPath(); ctx.arc(player.x+16, player.y+16, 20+Math.sin(t*3)*3, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
    // Shield icon
    ctx.fillStyle = player.color; ctx.font = '10px Orbitron'; ctx.textAlign = 'center';
    ctx.fillText('◆', player.x+16, player.y+20);
    ctx.restore();
}

// ---- PARTICLES ----
function updateParticles() {
    for(let i=particles.length-1;i>=0;i--) {
        let p=particles[i]; p.x+=p.vx*dt; p.y+=p.vy*dt; p.life-=dt; p.vx*=0.97; p.vy*=0.97;
        if(p.life<=0) particles.splice(i,1);
    }
    for(let i=floatingTexts.length-1;i>=0;i--) {
        let f=floatingTexts[i]; f.y+=f.vy*dt; f.life-=dt;
        if(f.life<=0) floatingTexts.splice(i,1);
    }
}
function drawParticles() {
    particles.forEach(p => { ctx.save(); ctx.globalAlpha=p.life; ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2); ctx.fill(); ctx.restore(); });
    floatingTexts.forEach(f => { ctx.save(); ctx.globalAlpha=f.life; ctx.fillStyle=f.color; ctx.font='bold 16px Orbitron'; ctx.textAlign='center'; ctx.fillText(f.text,f.x,f.y); ctx.restore(); });
}

// ---- MAIN UPDATE ----
function update() {
    // Player movement (not in deepfake phase for beam control)
    let mx=0, my=0;
    if(phase !== 2) {
        if(keys['w']||keys['arrowup']) my=-1; if(keys['s']||keys['arrowdown']) my=1;
        if(keys['a']||keys['arrowleft']) mx=-1; if(keys['d']||keys['arrowright']) mx=1;
        if(mx&&my){mx*=0.707;my*=0.707;}
        player.x += mx*player.speed*dt; player.y += my*player.speed*dt;
        player.x = Math.max(20,Math.min(W-52,player.x)); player.y = Math.max(60,Math.min(H-52,player.y));
    }
    // Timer
    timer -= dt;
    if(timer <= 0) { failGame('Time ran out! The system was compromised.'); return; }
    document.getElementById('timerVal').textContent = Math.ceil(timer);
    // Infection
    if(infection >= 100) { failGame('Infection reached critical level!'); return; }
    document.getElementById('infectionBarInner').style.width = Math.min(infection,100)+'%';
    document.getElementById('scoreVal').textContent = score;
    // Phase updates
    if(phase===0) updateViralGiveaway();
    else if(phase===1) updateDMClone();
    else if(phase===2) updateDeepfake();
    else if(phase===3) updateQRScan();
    else if(phase===4) updateSecuritySeq();
    updateParticles();
}

// ---- TUTORIAL POPUP DRAW ----
function drawTutorialPopup() {
    if(!tutorialPopup || tutorialPopup.dismissed) return;
    tutorialDismissTimer -= dt;
    if(tutorialDismissTimer <= 0) { tutorialPopup.dismissed = true; return; }
    let alpha = Math.min(tutorialDismissTimer, 1);
    let pw = 420, ph = 200 + tutorialPopup.steps.length * 26;
    let px = W/2 - pw/2, py = H/2 - ph/2;
    ctx.save();
    ctx.globalAlpha = alpha * 0.97;
    // Shadow backdrop
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, W, H);
    // Panel
    ctx.shadowBlur = 30; ctx.shadowColor = '#c860ff';
    ctx.fillStyle = 'rgba(18,4,40,0.98)';
    roundRect(ctx, px, py, pw, ph, 14); ctx.fill();
    ctx.strokeStyle = '#c860ff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowBlur = 0;
    // Title bar
    ctx.fillStyle = 'rgba(100,30,180,0.5)';
    roundRect(ctx, px, py, pw, 44, 14); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 17px Orbitron'; ctx.textAlign = 'center';
    ctx.fillText(tutorialPopup.title, px+pw/2, py+28);
    // Steps
    ctx.textAlign = 'left'; ctx.font = '14px Share Tech Mono';
    tutorialPopup.steps.forEach((s, i) => {
        ctx.fillStyle = s.startsWith('⚠') ? '#ff8090' : (i % 2 === 0 ? '#c0e8ff' : '#a0c0e0');
        ctx.fillText(s, px+22, py+66 + i*26);
    });
    // Dismiss hint
    let rc = Math.ceil(tutorialDismissTimer);
    ctx.fillStyle = 'rgba(180,100,255,0.6)'; ctx.font = '11px Share Tech Mono'; ctx.textAlign = 'center';
    ctx.fillText('Press any key or click to dismiss  (' + rc + 's)', px+pw/2, py+ph-12);
    ctx.restore();
}

// ---- GUIDE PANEL DRAW ----
function drawGuidePanel() {
    if(!showGuidePanel) return;
    const guides = [
      ['Ph.1 Posts','Walk near post → Hold E → Drag red post to QUARANTINE BIN'],
      ['Ph.2 DMs','Walk into bubble → Hold E to inspect → Red = Fake (auto-blocked)'],
      ['Ph.3 Face','Move mouse over face → Hold E on blinking red circles'],
      ['Ph.4 QR','Terminal (left) → Hold E → then QR poster (right) → Hold E'],
      ['Ph.5 Modules','Click+drag coloured boxes → drop on matching dashed slot at top']
    ];
    let gx = 10, gy = 70, gw = 210, lh = 44;
    ctx.save();
    ctx.fillStyle = 'rgba(10,0,25,0.82)';
    roundRect(ctx, gx, gy, gw, 20 + guides.length*lh, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(180,100,255,0.25)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle = '#b464ff'; ctx.font = 'bold 10px Orbitron'; ctx.textAlign='left';
    ctx.fillText('GUIDE', gx+10, gy+14);
    guides.forEach((g, i) => {
        let active = i === phase;
        ctx.fillStyle = active ? 'rgba(0,255,200,0.12)' : 'transparent';
        ctx.fillRect(gx+4, gy+20+i*lh, gw-8, lh-2);
        if(active) { ctx.fillStyle='#00ffc8'; ctx.fillRect(gx+4,gy+20+i*lh,3,lh-2); }
        ctx.fillStyle = active ? '#00ffc8' : '#8060a0';
        ctx.font = 'bold 9px Orbitron';
        ctx.fillText((active?'▶ ':'')+g[0], gx+10, gy+33+i*lh);
        ctx.fillStyle = active ? '#c0e8ff' : '#604080';
        ctx.font = '9px Share Tech Mono';
        // word-wrap guide text
        let words = g[1].split(' '), line='', ly=gy+44+i*lh;
        for(let w of words){ let t=line+w+' '; if(ctx.measureText(t).width>gw-18&&line!==''){ctx.fillText(line,gx+10,ly);ly+=11;line=w+' ';}else line=t;}
        ctx.fillText(line, gx+10, ly);
    });
    ctx.restore();
}

// ---- OBJECTIVE ARROW ----
function drawArrow(fromX, fromY, toX, toY, color) {
    let angle = Math.atan2(toY-fromY, toX-fromX);
    let d = Math.hypot(toX-fromX, toY-fromY);
    if(d < 60) return;
    let t = performance.now()/1000;
    let pulse = Math.sin(t*4)*4;
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = 2; ctx.globalAlpha = 0.6+Math.sin(t*4)*0.3;
    ctx.setLineDash([8,6]);
    ctx.beginPath(); ctx.moveTo(fromX, fromY);
    let ex = toX - Math.cos(angle)*20, ey = toY - Math.sin(angle)*20;
    ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
    // arrowhead
    ctx.beginPath();
    ctx.moveTo(toX + pulse*Math.cos(angle), toY + pulse*Math.sin(angle));
    ctx.lineTo(ex - Math.cos(angle-0.5)*14, ey - Math.sin(angle-0.5)*14);
    ctx.lineTo(ex - Math.cos(angle+0.5)*14, ey - Math.sin(angle+0.5)*14);
    ctx.closePath(); ctx.fill();
    ctx.restore();
}

// ---- PHASE ARROWS ----
function drawPhaseArrows() {
    let px = player.x+16, py = player.y+16;
    if(phase === 0) {
        // Arrow to nearest unscanned post
        let nearest = null, nd = Infinity;
        posts.forEach(p => { if(!p.quarantined && !p.scanned){ let d=Math.hypot(px-p.x-90,py-p.y-35); if(d<nd){nd=d;nearest=p;} }});
        if(nearest && nd > 80) drawArrow(px,py,nearest.x+90,nearest.y+35,'#c860ff');
        // Arrow to quarantine if draggable post exists
        let draggable = posts.find(p=>p.draggable&&!p.quarantined);
        if(draggable) drawArrow(draggable.x+90,draggable.y+35, quarantineBin.x+55,quarantineBin.y+55,'#ff3050');
    } else if(phase === 1) {
        // Arrow to nearest unblocked DM
        let nearest=null, nd=Infinity;
        dmMessages.forEach(m=>{ if(!m.blocked){ let d=Math.hypot(px-m.x-80,py-m.y-25); if(d<nd){nd=d;nearest=m;} }});
        if(nearest && nd > 80) drawArrow(px,py,nearest.x+80,nearest.y+25,'#c860ff');
    } else if(phase === 3) {
        let qs=qrSystem;
        if(!qs.terminalActivated) drawArrow(px,py,qs.terminalX+40,qs.terminalY+40,'#00ffc8');
        else if(!qs.scanned) drawArrow(px,py,qs.qrX+60,qs.qrY+60,'#c860ff');
    } else if(phase === 4) {
        let unplaced = secModules.find(m=>!m.placed);
        if(unplaced) {
            drawArrow(px,py,unplaced.x+50,unplaced.y+25,unplaced.color);
            drawArrow(unplaced.x+50,unplaced.y+25,unplaced.slotX+50,unplaced.slotY+25,unplaced.color);
        }
    }
}

// ---- MAIN DRAW ----
function draw() {
    ctx.clearRect(0,0,W,H);
    drawRoom();
    if(phase===0) drawViralGiveaway();
    else if(phase===1) drawDMClone();
    else if(phase===2) drawDeepfake();
    else if(phase===3) drawQRScan();
    else if(phase===4) drawSecuritySeq();
    if(phase !== 2) drawPlayer();
    drawPhaseArrows();
    drawParticles();
    drawGuidePanel();
    drawTutorialPopup();
    // Glitch overlay during shatter
    if(shatterTimer > 0) {
        shatterTimer -= dt; ctx.save();
        ctx.globalAlpha = shatterTimer*0.15;
        ctx.fillStyle = '#ff00ff'; ctx.fillRect(0,0,W,H);
        for(let i=0;i<10;i++){ctx.fillStyle=['#ff0040','#00ffc8','#c860ff'][i%3]; ctx.globalAlpha=Math.random()*0.2;
            ctx.fillRect(Math.random()*W, Math.random()*H, Math.random()*200, 3);}
        ctx.restore();
    }
    // Phase transition overlay
    if(phaseTransition > 0) {
        phaseTransition -= dt; ctx.save();
        ctx.globalAlpha = Math.min(phaseTransition, 1) * 0.8;
        ctx.fillStyle = '#0a0015'; ctx.fillRect(0,0,W,H);
        ctx.globalAlpha = Math.min(phaseTransition, 1);
        ctx.fillStyle = '#00ffc8'; ctx.font = 'bold 36px Orbitron'; ctx.textAlign = 'center';
        ctx.fillText(phaseTransText, W/2, H/2);
        ctx.restore();
    }
}

// ---- GAME LOOP ----
function gameLoop(timestamp) {
    if(!gameRunning) return;
    dt = Math.min((timestamp - lastTime) / 1000, 0.05); lastTime = timestamp;
    update(); draw();
    requestAnimationFrame(gameLoop);
}

// ---- GAME CONTROL ----
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('endScreen').classList.add('hidden');
    document.getElementById('failScreen').classList.add('hidden');
    gameRunning = true; score = 0; timer = 180; infection = 0; phase = 0;
    particles = []; floatingTexts = []; dragItem = null; scanProgress = 0; shatterTimer = 0;
    player.x = 200; player.y = H/2;
    lastTime = performance.now();
    initPhase(0);
    requestAnimationFrame(gameLoop);
}

function winGame() {
    gameRunning = false; hidePrompt();
    document.getElementById('endScreen').classList.remove('hidden');
    let timeBonus = Math.floor(timer * 5);
    let infectionPenalty = Math.floor(infection * 2);
    let finalScore = score + timeBonus - infectionPenalty;
    document.getElementById('endStats').innerHTML =
        '<div style="color:#c860ff;font-family:Orbitron;font-size:14px;letter-spacing:2px;">FINAL REPORT</div><br>' +
        'Base Score: <span style="color:#00ffc8">' + score + '</span><br>' +
        'Time Bonus: <span style="color:#00ffc8">+' + timeBonus + '</span><br>' +
        'Infection Penalty: <span style="color:#ff3050">-' + infectionPenalty + '</span><br><br>' +
        '<div style="font-size:28px;color:#00ffc8;font-family:Orbitron;text-shadow:0 0 20px rgba(0,255,200,0.5)">TOTAL: ' + finalScore + '</div>';
    
    // 🎮 Save level completion score for syncing with dashboard
    console.log('🏆 Level 2 COMPLETED! Score:', finalScore);
    localStorage.setItem('cybershield_level_completed', '2');
    localStorage.setItem('cybershield_level_score', Math.floor(finalScore));
    localStorage.setItem('cybershield_level_waves', '5'); // Level 2 has 5 phases
    localStorage.setItem('cybershield_level_enemies', Math.floor(score / 10)); // Estimate enemies as score/10
    localStorage.setItem('cybershield_level_time', '180'); // Game duration
    console.log('💾 Score saved to localStorage for dashboard sync');
    
    // Submit to main dashboard backend if authenticated
    submitScoreToDashboard(finalScore, 2, 5);
}

/**
 * Submit game score to authenticated backend endpoint
 * This updates the user's profile with game stats
 */
async function submitScoreToDashboard(score, level, waves) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('⚠️ No auth token - score will not update in dashboard');
    return;
  }
  
  console.log('📤 Submitting game score to dashboard...', { score, level, waves, token: token.substring(0, 20) + '...' });
  
  try {
    const response = await fetch('http://localhost:5000/api/game/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        score: Math.floor(score),
        level: level,
        wavesCompleted: waves,
        enemiesDefeated: Math.floor(score / 50),
        timeSpent: 180
      }),
    });
    
    console.log('📨 Backend response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Score submitted to dashboard:', data);
      
      // Set detailed completion flags for Dashboard to detect
      localStorage.setItem('cybershield_just_completed', JSON.stringify({
        level: 2,
        score: finalScore,
        timestamp: Date.now(),
        status: 'completed'
      }));
      
      // Trigger immediate Dashboard refresh by updating user in localStorage
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updated = {
          ...currentUser,
          gameScore: data.gameScore || currentUser.gameScore,
          gameHighScore: data.gameHighScore || currentUser.gameHighScore,
          gamesPlayed: (currentUser.gamesPlayed || 0) + 1,
          score: data.totalScore || currentUser.score,
          level: data.level || currentUser.level,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        console.log('💾 User cache updated in localStorage:', updated);
        // Dispatch storage event manually since we're on same tab
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.warn('Could not update localStorage:', e);
      }
    } else {
      const error = await response.json();
      console.error('❌ Backend rejected submission:', error);
    }
  } catch (err) {
    console.error('❌ Failed to submit score to dashboard:', err);
  }
}

function failGame(reason) {
    gameRunning = false; hidePrompt();
    document.getElementById('failScreen').classList.remove('hidden');
    document.getElementById('failReason').textContent = reason;
    
    // Still save partial progress even on failure
    console.log('❌ Level 2 FAILED:', reason, 'Partial score:', score);
    localStorage.setItem('cybershield_level_completed', '2');
    localStorage.setItem('cybershield_level_score', Math.floor(score * 0.5)); // 50% of partial score
    localStorage.setItem('cybershield_level_waves', '5');
    localStorage.setItem('cybershield_level_enemies', Math.floor(score / 10));
    localStorage.setItem('cybershield_level_time', '180');
}

function restartGame() { startGame(); }
