'use strict';
const canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d');
const PI2=Math.PI*2,PI=Math.PI,DEG=PI/180;
const HUD_H=64,WALL_T=12,P_RAD=14,P_SPEED=210,DASH_SPEED=550,DASH_DUR=0.15,DASH_CD=1.2;

/* ── Help / Tutorial System ── */
let helpOpen=false,tutorialOpen=false,tutorialData=null,tutorialTimer=0;
const PHASE_TUTORIALS={
  identity:{
    title:'PHASE 1: IDENTITY TRACE',
    icon:'◈',
    color:'#ffdd44',
    objectives:[
      '◈ Collect all 6 yellow identity fragments',
      '◈ Follow the cyan signal pulses to find fragments',
      '◈ Avoid the red vision cones of patrol guards',
      '◈ Hide behind cover walls (bright cyan borders)',
    ],
    tips:[
      'Hold SHIFT to enter Stealth Mode (slower but harder to detect)',
      'Press SPACE to Dash through danger zones',
      'Guards return to patrol after 3 seconds of losing sight',
      'Walk into fragments to auto-collect them',
    ]
  },
  sim_swap:{
    title:'PHASE 2: SIM SWAP DEFENSE',
    icon:'📡',
    color:'#00f5ff',
    objectives:[
      '◈ Block all 4 reroute nodes (yellow dots)',
      '◈ Reach each node BEFORE the red attacker dot',
      '◈ Stand near a node and press E to block it',
      '◈ If 3+ signals are hijacked, mission fails',
    ],
    tips:[
      'Prioritize the closest attacker first',
      'Use DASH (Space) to cover distance quickly',
      'Each lost signal costs 10 HP — be fast!',
      'A guard patrols the area — use stealth to avoid',
    ]
  },
  password:{
    title:'PHASE 3: PASSWORD BREACH',
    icon:'🔓',
    color:'#ff4444',
    objectives:[
      '◈ Stop the red infection from spreading',
      '◈ Stand between infected nodes and press E to clean links',
      '◈ Activate 4 security nodes (yellow) by HOLDING E for 2 sec',
      '◈ If 8+ nodes get infected, you take heavy damage',
    ],
    tips:[
      'Yellow nodes with [HOLD E] labels are security nodes',
      'The green progress circle shows activation progress',
      'Breaking infected links first slows the spread',
      'Infection spreads every 3.5 seconds along connections',
    ]
  },
  deepfake:{
    title:'PHASE 4: DEEPFAKE KYC',
    icon:'👁',
    color:'#bf00ff',
    objectives:[
      '◈ Find 5 deepfake cells in the verification grid',
      '◈ Deepfake cells GLITCH red periodically — watch carefully!',
      '◈ Move near a glitching cell and press E to flag it',
      '◈ You must press E DURING the glitch — timing matters!',
    ],
    tips:[
      'Wait for the red glitch flash before pressing E',
      'Pressing E when cell is NOT glitching = false positive (-5 HP)',
      'You have 45 seconds — time resets at 30s if it runs out',
      'A security drone patrols — stay out of its vision cone',
    ]
  },
  boss:{
    title:'FINAL BOSS: DARK WEB BROKER',
    icon:'💀',
    color:'#bf00ff',
    objectives:[
      '◈ Destroy the 3 orbiting shield nodes',
      '◈ Wait for a shield node to DETACH (turns orange)',
      '◈ Dash into or press E on detached nodes to damage them',
      '◈ When all shields are down, get CLOSE to boss and HOLD E',
    ],
    tips:[
      'DODGE purple & red projectiles — they deal 8 damage each',
      'DASH (Space) gives invincibility frames — use it to dodge!',
      'Detached shields have a timer — hit them before they return',
      'Boss regenerates 2 shields after each charge attack phase',
      'Two full charge attacks will defeat the boss',
    ]
  },
};
function showTutorial(phaseId){
  tutorialData=PHASE_TUTORIALS[phaseId];if(!tutorialData)return;
  tutorialOpen=true;tutorialTimer=0;
}
function drawTutorial(){
  if(!tutorialOpen||!tutorialData)return;
  const d=tutorialData,cx=canvas.width/2,cy=canvas.height/2;
  const pw=Math.min(560,canvas.width*0.85),ph=Math.min(420,canvas.height*0.8);
  // Backdrop
  ctx.save();ctx.fillStyle='rgba(0,0,12,0.88)';ctx.fillRect(0,0,canvas.width,canvas.height);
  // Panel
  ctx.fillStyle='rgba(6,6,24,0.98)';ctx.strokeStyle=d.color;ctx.lineWidth=1.5;
  ctx.shadowColor=d.color;ctx.shadowBlur=20;
  roundRect(cx-pw/2,cy-ph/2,pw,ph,4);ctx.fill();ctx.stroke();
  // Accent bar top
  ctx.fillStyle=d.color;ctx.shadowBlur=30;ctx.fillRect(cx-pw/2,cy-ph/2,pw,3);
  // Title
  ctx.shadowBlur=0;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='900 20px "Orbitron"';ctx.fillStyle=d.color;ctx.shadowColor=d.color;ctx.shadowBlur=16;
  ctx.fillText(d.icon+' '+d.title,cx,cy-ph/2+32);
  // Objectives
  ctx.textAlign='left';ctx.font='11px "Share Tech Mono"';
  const leftX=cx-pw/2+28;let oy=cy-ph/2+65;
  ctx.fillStyle='rgba(0,245,255,0.5)';ctx.shadowBlur=0;ctx.font='bold 10px "Orbitron"';
  ctx.fillText('OBJECTIVES:',leftX,oy);oy+=22;
  ctx.font='11px "Share Tech Mono"';ctx.fillStyle='rgba(220,240,255,0.8)';
  for(const obj of d.objectives){ctx.fillText(obj,leftX,oy);oy+=20;}
  // Tips
  oy+=12;ctx.fillStyle='rgba(0,245,255,0.5)';ctx.font='bold 10px "Orbitron"';
  ctx.fillText('TIPS:',leftX,oy);oy+=22;
  ctx.font='11px "Share Tech Mono"';ctx.fillStyle='rgba(0,245,255,0.45)';
  for(const tip of d.tips){ctx.fillText('▸ '+tip,leftX,oy);oy+=18;}
  // Controls reminder
  oy+=14;ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(cx-pw/2+20,oy-6,pw-40,1);
  oy+=12;ctx.fillStyle='rgba(0,245,255,0.3)';ctx.font='10px "Share Tech Mono"';
  ctx.fillText('WASD/Arrows = Move  |  SHIFT = Stealth  |  SPACE = Dash  |  E = Interact  |  H = Help',leftX,oy);
  // Close prompt
  const pulse=0.5+0.5*Math.sin(gameTime*3);
  ctx.textAlign='center';ctx.font='bold 12px "Share Tech Mono"';ctx.fillStyle=`rgba(0,245,255,${0.4+0.4*pulse})`;
  ctx.shadowColor='#00f5ff';ctx.shadowBlur=10;
  ctx.fillText('[ PRESS ENTER or ESC TO CONTINUE ]',cx,cy+ph/2-20);
  ctx.restore();
  if(consumeKey('Enter')||consumeKey('Escape')||consumeKey('Space')){tutorialOpen=false;}
}
function drawHelpOverlay(){
  if(!helpOpen)return;
  const cx=canvas.width/2,cy=canvas.height/2;
  const pw=Math.min(620,canvas.width*0.9),ph=Math.min(480,canvas.height*0.88);
  ctx.save();ctx.fillStyle='rgba(0,0,12,0.92)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(6,6,24,0.98)';ctx.strokeStyle='#00f5ff';ctx.lineWidth=1.5;
  ctx.shadowColor='#00f5ff';ctx.shadowBlur=20;
  roundRect(cx-pw/2,cy-ph/2,pw,ph,4);ctx.fill();ctx.stroke();
  ctx.fillStyle='#00f5ff';ctx.shadowBlur=30;ctx.fillRect(cx-pw/2,cy-ph/2,pw,3);
  ctx.shadowBlur=0;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='900 22px "Orbitron"';ctx.fillStyle='#00f5ff';ctx.shadowColor='#00f5ff';ctx.shadowBlur=16;
  ctx.fillText('HOW TO PLAY',cx,cy-ph/2+30);
  const leftX=cx-pw/2+28;let oy=cy-ph/2+60;
  const sections=[
    {label:'CONTROLS',color:'#00f5ff',items:['WASD or Arrow Keys — Move your agent','SHIFT (hold) — Stealth mode: move slower, harder to detect','SPACE — Dash: quick burst of speed + invincibility','E — Interact with objects / block nodes / flag targets','H — Toggle this help screen','ENTER — Start game / dismiss tutorials']},
    {label:'GAME ELEMENTS',color:'#ffdd44',items:['◈ Yellow Diamonds — Identity fragments to collect','● Red Dots with Cones — Enemy guards (avoid their vision!)','■ Cyan-bordered Walls — Cover objects (hide behind them)','● Yellow Circles — Interactive nodes (press or hold E)','◈ Orange Circles — Boss shield nodes (dash into them)']},
    {label:'SURVIVAL',color:'#ff4444',items:['Green HP bar (top-left) — Reach 0 and it\'s game over','Use Stealth to reduce detection range by 45%','Dash gives brief invincibility — dodge through projectiles','Getting detected triggers a chase — break line of sight!']},
  ];
  for(const sec of sections){
    ctx.textAlign='left';ctx.font='bold 9px "Orbitron"';ctx.fillStyle=sec.color;
    ctx.shadowColor=sec.color;ctx.shadowBlur=6;ctx.fillText(sec.label,leftX,oy);oy+=18;ctx.shadowBlur=0;
    ctx.font='10px "Share Tech Mono"';ctx.fillStyle='rgba(220,240,255,0.7)';
    for(const item of sec.items){ctx.fillText(item,leftX+8,oy);oy+=15;}oy+=10;
  }
  const pulse=0.5+0.5*Math.sin(gameTime*3);
  ctx.textAlign='center';ctx.font='bold 12px "Share Tech Mono"';ctx.fillStyle=`rgba(0,245,255,${0.4+0.4*pulse})`;
  ctx.shadowColor='#00f5ff';ctx.shadowBlur=10;
  ctx.fillText('[ PRESS H or ESC TO CLOSE ]',cx,cy+ph/2-18);ctx.restore();
  if(consumeKey('KeyH')||consumeKey('Escape')){helpOpen=false;}
}

/* ── Audio ── */
let audioCtx;
function initAudio(){try{audioCtx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function sfx(freq,dur,type='square',vol=0.08){
  if(!audioCtx)return;try{
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.connect(g);g.connect(audioCtx.destination);o.type=type;
  o.frequency.setValueAtTime(freq,audioCtx.currentTime);
  g.gain.setValueAtTime(vol,audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+dur);
  o.start();o.stop(audioCtx.currentTime+dur);}catch(e){}}

/* ── Input ── */
const keys={},kDown={};
window.addEventListener('keydown',e=>{
  if(!keys[e.code])kDown[e.code]=true;keys[e.code]=true;
  // H key toggles help (only during gameplay, not on screens)
  if(e.code==='KeyH'&&phase!=='start'&&phase!=='victory'&&phase!=='gameover'&&!tutorialOpen){
    helpOpen=!helpOpen;
  }
});
window.addEventListener('keyup',e=>{keys[e.code]=false;});
function consumeKey(c){if(kDown[c]){kDown[c]=false;return true;}return false;}

/* ── Math ── */
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function lerp(a,b,t){return a+(b-a)*t;}
function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
function rnd(a,b){return a+Math.random()*(b-a);}
function angTo(a,b){return Math.atan2(b.y-a.y,b.x-a.x);}
function normAng(a){while(a>PI)a-=PI2;while(a<-PI)a+=PI2;return a;}
function circRect(cx,cy,r,rx,ry,rw,rh){
  const nx=Math.max(rx,Math.min(cx,rx+rw)),ny=Math.max(ry,Math.min(cy,ry+rh));
  return(cx-nx)**2+(cy-ny)**2<r*r;}
function lineRect(x1,y1,x2,y2,rx,ry,rw,rh){
  const dx=x2-x1,dy=y2-y1;let tmin=0,tmax=1;
  if(dx!==0){let t1=(rx-x1)/dx,t2=(rx+rw-x1)/dx;if(t1>t2)[t1,t2]=[t2,t1];tmin=Math.max(tmin,t1);tmax=Math.min(tmax,t2);if(tmin>tmax)return false;}
  else if(x1<rx||x1>rx+rw)return false;
  if(dy!==0){let t1=(ry-y1)/dy,t2=(ry+rh-y1)/dy;if(t1>t2)[t1,t2]=[t2,t1];tmin=Math.max(tmin,t1);tmax=Math.min(tmax,t2);if(tmin>tmax)return false;}
  else if(y1<ry||y1>ry+rh)return false;
  return true;}
function hexRgb(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)].join(',');}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}

/* ── Game State ── */
const PHASES=['start','identity','sim_swap','password','deepfake','boss','victory','gameover','transition'];
let phase='start',nextPhase='',transAlpha=0,transDir=0;
let gameTime=0,phaseTime=0,score=0;

/* ── Player ── */
const P={x:0,y:0,hp:100,maxHp:100,speed:P_SPEED,angle:0,pulseT:0,
  dashing:false,dashTimer:0,dashCD:0,dashAngle:0,
  stealth:false,invuln:0,dmgCD:0,trail:[],
  interacting:false,interactProg:0,interactTarget:null};

/* ── Shared Arrays ── */
let walls=[],npcs=[],fragments=[],particles=[],projectiles=[];
let phaseData={};

/* ── FX ── */
const fx={flash:{on:false,r:0,g:0,b:0,a:0},shake:{on:false,mag:0,dur:0,t:0},
  toasts:[],msgQueue:[]};
function flash(r,g,b,a=0.3){fx.flash={on:true,r,g,b,a};}
function shake(m,d){fx.shake={on:true,mag:m,dur:d,t:0};}
function toast(text,color='#00ff88'){fx.toasts.push({text,color,a:0,y:0,phase:'in',t:0});}
function showMsg(title,sub,dur=2.5){fx.msgQueue.push({title,sub,dur,t:0,a:0,phase:'in'});}

/* ── Particles ── */
function spawnP(x,y,count,color,spd=80,life=1){
  for(let i=0;i<count;i++){const a=rnd(0,PI2);particles.push({x,y,vx:Math.cos(a)*rnd(spd*0.3,spd),vy:Math.sin(a)*rnd(spd*0.3,spd),life:rnd(life*0.5,life),maxLife:life,r:rnd(1,3),color});}
}
function spawnBG(){for(let i=0;i<50;i++)particles.push({x:rnd(0,canvas.width),y:rnd(0,canvas.height),vx:rnd(-20,20),vy:rnd(-20,20),life:999,maxLife:999,r:rnd(0.5,2),color:Math.random()>0.5?'#00f5ff':'#bf00ff',bg:true});}

/* ── Collision ── */
function collidesWalls(px,py,r=P_RAD){for(const w of walls)if(circRect(px,py,r,w.x,w.y,w.w,w.h))return true;return false;}
function losCheck(ax,ay,bx,by){for(const w of walls)if(w.cover&&lineRect(ax,ay,bx,by,w.x,w.y,w.w,w.h))return false;return true;}

/* ── NPC System ── */
function createNPC(x,y,waypoints,color='#ff4444',visionRange=140,visionAngle=35){
  return{x,y,waypoints,wpIdx:0,color,state:'patrol',facing:0,speed:75,chaseSpeed:160,
    visionRange,visionAngle:visionAngle*DEG,detection:0,alertTimer:0,
    lastKnown:{x:0,y:0},patrolWait:0};}
let detectionAlert=0; // global detection danger level for screen effects
function npcMove(n,angle,speed,dt){
  const NPC_R=10;
  const mx=Math.cos(angle)*speed*dt, my=Math.sin(angle)*speed*dt;
  const canX=!collidesWalls(n.x+mx,n.y,NPC_R), canY=!collidesWalls(n.x,n.y+my,NPC_R);
  if(canX)n.x+=mx; else if(canY)n.y+=Math.sin(angle+0.5)*speed*dt*0.5; // slide along wall
  if(canY)n.y+=my; else if(canX)n.x+=Math.cos(angle+0.5)*speed*dt*0.5;
  n.x=clamp(n.x,WALL_T+NPC_R+2,canvas.width-WALL_T-NPC_R-2);
  n.y=clamp(n.y,HUD_H+WALL_T+NPC_R+2,canvas.height-WALL_T-NPC_R-2);
}
function updateNPCs(dt){
  let anyDetecting=false;
  for(const n of npcs){
    const inVision=npcCanSee(n,P);
    if(!n.stuckT)n.stuckT=0;
    if(!n.prevX){n.prevX=n.x;n.prevY=n.y;}

    if(n.state==='patrol'){
      if(n.patrolWait>0){n.patrolWait-=dt;}
      else{
        const wp=n.waypoints[n.wpIdx];
        const d=dist(n,wp);
        if(d<25){
          n.wpIdx=(n.wpIdx+1)%n.waypoints.length;
          n.patrolWait=rnd(0.2,0.6);n.stuckT=0;
        }else{
          const a=angTo(n,wp);n.facing=lerpAngle(n.facing,a,dt*5);
          npcMove(n,n.facing,n.speed,dt);
        }
        // Stuck detection - skip waypoint after 1.5s
        if(Math.abs(n.x-n.prevX)<0.5&&Math.abs(n.y-n.prevY)<0.5){n.stuckT+=dt;}
        else{n.stuckT=0;}
        if(n.stuckT>1.5){n.wpIdx=(n.wpIdx+1)%n.waypoints.length;n.stuckT=0;}
        n.prevX=n.x;n.prevY=n.y;
      }
      // ── DETECTION PENALTIES ──
      if(inVision){
        anyDetecting=true;
        n.detection+=dt*(P.stealth?35:75);
        // Partial detection penalties (in vision cone)
        if(n.detection>20&&n.detection<100){
          // Slow player slightly when being scanned
          P.speed=P_SPEED*0.85;
          // Periodic HP drain at high detection
          if(n.detection>60&&!P.dashing){
            if(!n._drainCD)n._drainCD=0;
            n._drainCD+=dt;
            if(n._drainCD>1){n._drainCD=0;P.hp=Math.max(0,P.hp-3);sfx(300,0.1,'square',0.03);}
          }
        }
        // Full detection → chase
        if(n.detection>=100){
          n.state='chase';n.lastKnown={x:P.x,y:P.y};
          sfx(880,0.3,'sawtooth',0.06);sfx(440,0.2,'square',0.04);
          toast('⚠ FULLY DETECTED — CHASE INITIATED!','#ff4444');
          flash(255,30,50,0.3);shake(4,0.3);
          P.hp=Math.max(0,P.hp-8); // penalty for getting caught
          if(P.hp<=0){P.hp=0;startPhase('gameover');}
        }
      }else{
        n.detection=Math.max(0,n.detection-dt*40);
        if(n.detection<=0){P.speed=P_SPEED;delete n._drainCD;}
      }
    }else if(n.state==='chase'){
      anyDetecting=true;
      if(inVision)n.lastKnown={x:P.x,y:P.y};
      const a=angTo(n,n.lastKnown);n.facing=lerpAngle(n.facing,a,dt*6);
      npcMove(n,n.facing,n.chaseSpeed,dt);
      if(!inVision){n.alertTimer+=dt;if(n.alertTimer>3.5){n.state='patrol';n.alertTimer=0;n.detection=0;P.speed=P_SPEED;toast('✔ Evaded pursuit','#00ff88');}}
      else n.alertTimer=0;
      if(dist(n,P)<P_RAD+14&&P.dmgCD<=0&&!P.dashing){
        P.hp-=15;P.dmgCD=0.8;P.invuln=0.5;flash(255,30,50,0.4);shake(6,0.35);sfx(120,0.3,'sawtooth',0.1);
        const ka=angTo(n,P);P.x+=Math.cos(ka)*50;P.y+=Math.sin(ka)*50;
        toast('✘ GUARD ATTACK! -15 HP','#ff4444');
        if(P.hp<=0){P.hp=0;startPhase('gameover');}
      }
    }
  }
  // Update global detection alert for screen effects
  detectionAlert=anyDetecting?Math.min(1,detectionAlert+dt*2):Math.max(0,detectionAlert-dt*3);
}
function npcCanSee(n,target){
  const d=dist(n,target);if(d>n.visionRange)return false;
  if(P.stealth&&d>n.visionRange*0.55)return false;
  const a=normAng(angTo(n,target)-n.facing);
  if(Math.abs(a)>n.visionAngle)return false;
  return losCheck(n.x,n.y,target.x,target.y);
}
function lerpAngle(a,b,t){const d=normAng(b-a);return a+d*Math.min(t,1);}

function drawNPCs(){
  // Screen danger tint when being detected
  if(detectionAlert>0){
    ctx.save();ctx.fillStyle=`rgba(255,20,20,${detectionAlert*0.08})`;
    ctx.fillRect(0,0,canvas.width,canvas.height);ctx.restore();
    // Pulsing border danger indicator
    ctx.save();ctx.strokeStyle=`rgba(255,40,40,${detectionAlert*0.4})`;
    ctx.lineWidth=3;ctx.shadowColor='#ff2222';ctx.shadowBlur=15*detectionAlert;
    ctx.strokeRect(2,HUD_H+2,canvas.width-4,canvas.height-HUD_H-4);ctx.restore();
  }
  for(const n of npcs){
    const pulse=0.5+0.5*Math.sin(gameTime*3);
    // Vision cone
    ctx.save();ctx.translate(n.x,n.y);ctx.rotate(n.facing);
    const vr=n.visionRange*(P.stealth?0.55:1);
    if(n.state==='chase'){
      ctx.fillStyle=`rgba(255,30,30,${0.12+0.06*pulse})`;
      ctx.strokeStyle='rgba(255,40,40,0.4)';
    }else if(n.detection>30){
      ctx.fillStyle=`rgba(255,160,0,${0.08+0.04*pulse})`;
      ctx.strokeStyle='rgba(255,160,0,0.25)';
    }else{
      ctx.fillStyle=`rgba(255,100,50,${0.04+0.02*pulse})`;
      ctx.strokeStyle='rgba(255,100,50,0.12)';
    }
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,vr,-n.visionAngle,n.visionAngle);ctx.closePath();ctx.fill();
    ctx.lineWidth=1;ctx.stroke();ctx.restore();
    // Body
    const bodyColor=n.state==='chase'?'#ff2222':n.detection>50?'#ff8800':n.color;
    ctx.save();ctx.shadowColor=bodyColor;ctx.shadowBlur=n.state==='chase'?22+12*pulse:10+4*pulse;
    ctx.fillStyle=bodyColor;ctx.beginPath();ctx.arc(n.x,n.y,11,0,PI2);ctx.fill();
    ctx.fillStyle='#000';ctx.beginPath();ctx.arc(n.x,n.y,7,0,PI2);ctx.fill();
    const ex=n.x+Math.cos(n.facing)*3,ey=n.y+Math.sin(n.facing)*3;
    ctx.fillStyle=n.state==='chase'?'#ff0000':'#ff8800';ctx.beginPath();ctx.arc(ex,ey,3,0,PI2);ctx.fill();
    ctx.restore();
    // State label
    if(n.state==='chase'){
      ctx.save();ctx.font='bold 8px "Share Tech Mono"';ctx.fillStyle='#ff4444';ctx.textAlign='center';
      ctx.shadowColor='#ff0000';ctx.shadowBlur=8;ctx.fillText('! CHASING !',n.x,n.y-22);ctx.restore();
    }
    // Detection progress ring
    if(n.detection>0&&n.state==='patrol'){
      const dc=n.detection>60?'#ff4444':n.detection>30?'#ffaa00':'#ffdd44';
      ctx.save();ctx.strokeStyle=dc;ctx.lineWidth=3;ctx.shadowColor=dc;ctx.shadowBlur=10;
      ctx.beginPath();ctx.arc(n.x,n.y-20,9,-PI/2,-PI/2+PI2*(n.detection/100));ctx.stroke();
      // Warning icon
      if(n.detection>30){
        ctx.font='bold 10px "Share Tech Mono"';ctx.fillStyle=dc;ctx.textAlign='center';
        ctx.fillText('⚠',n.x,n.y-32);
      }
      ctx.restore();
    }
  }
}

/* ── Player Update ── */
function updatePlayer(dt){
  P.pulseT+=dt*2.2;P.invuln=Math.max(0,P.invuln-dt);P.dmgCD=Math.max(0,P.dmgCD-dt);P.dashCD=Math.max(0,P.dashCD-dt);
  P.stealth=keys['ShiftLeft']||keys['ShiftRight'];
  if(consumeKey('Space')&&P.dashCD<=0&&!P.dashing){P.dashing=true;P.dashTimer=DASH_DUR;P.dashCD=DASH_CD;
    const dx=(keys['KeyD']||keys['ArrowRight']?1:0)-(keys['KeyA']||keys['ArrowLeft']?1:0);
    const dy=(keys['KeyS']||keys['ArrowDown']?1:0)-(keys['KeyW']||keys['ArrowUp']?1:0);
    P.dashAngle=(dx||dy)?Math.atan2(dy,dx):P.angle;sfx(200,0.15,'sawtooth',0.05);}
  if(P.dashing){P.dashTimer-=dt;if(P.dashTimer<=0)P.dashing=false;
    const s=DASH_SPEED;const mx=Math.cos(P.dashAngle)*s*dt,my=Math.sin(P.dashAngle)*s*dt;
    if(!collidesWalls(P.x+mx,P.y))P.x+=mx;if(!collidesWalls(P.x,P.y+my))P.y+=my;
    P.trail.push({x:P.x,y:P.y,a:1});
  }else{
    let dx=0,dy=0;
    if(keys['KeyW']||keys['ArrowUp'])dy=-1;if(keys['KeyS']||keys['ArrowDown'])dy=1;
    if(keys['KeyA']||keys['ArrowLeft'])dx=-1;if(keys['KeyD']||keys['ArrowRight'])dx=1;
    if(dx&&dy){dx*=0.707;dy*=0.707;}
    const spd=P.stealth?P_SPEED*0.55:P_SPEED;
    const mx=dx*spd*dt,my=dy*spd*dt;
    if(!collidesWalls(P.x+mx,P.y))P.x+=mx;if(!collidesWalls(P.x,P.y+my))P.y+=my;
    if(dx||dy)P.angle=Math.atan2(dy,dx);
  }
  P.x=clamp(P.x,P_RAD+2,canvas.width-P_RAD-2);P.y=clamp(P.y,HUD_H+P_RAD+2,canvas.height-P_RAD-2);
  P.trail=P.trail.filter(t=>{t.a-=dt*4;return t.a>0;});
}

function drawPlayer(){
  const{x,y,pulseT,angle}=P;const pulse=0.5+0.5*Math.sin(pulseT);
  for(const t of P.trail){ctx.save();ctx.globalAlpha=t.a*0.4;ctx.fillStyle='#00f5ff';ctx.shadowColor='#00f5ff';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(t.x,t.y,P_RAD*0.7,0,PI2);ctx.fill();ctx.restore();}
  if(P.invuln>0&&Math.floor(P.invuln*10)%2===0)return;
  const og=ctx.createRadialGradient(x,y,P_RAD*0.5,x,y,P_RAD*3);
  og.addColorStop(0,`rgba(0,245,255,${P.stealth?0.06:0.15+0.06*pulse})`);og.addColorStop(1,'transparent');
  ctx.beginPath();ctx.arc(x,y,P_RAD*3,0,PI2);ctx.fillStyle=og;ctx.fill();
  ctx.save();ctx.translate(x,y);ctx.rotate(gameTime*0.8);ctx.setLineDash([5,4]);ctx.lineWidth=1;
  ctx.strokeStyle=`rgba(0,245,255,${P.stealth?0.15:0.35+0.15*pulse})`;ctx.shadowColor='#00f5ff';ctx.shadowBlur=8;
  ctx.beginPath();ctx.arc(0,0,P_RAD+8,0,PI2);ctx.stroke();ctx.restore();
  const bg=ctx.createRadialGradient(x-3,y-3,1,x,y,P_RAD);
  bg.addColorStop(0,P.stealth?'#406880':'#a0f8ff');bg.addColorStop(0.5,P.stealth?'#204050':'#00c8e0');bg.addColorStop(1,'#0a0a2e');
  ctx.save();ctx.shadowColor=P.stealth?'#205060':'#00f5ff';ctx.shadowBlur=P.stealth?8:22+12*pulse;
  ctx.beginPath();ctx.arc(x,y,P_RAD,0,PI2);ctx.fillStyle=bg;ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();ctx.arc(x-P_RAD*0.25,y-P_RAD*0.25,P_RAD*0.25,0,PI2);
  ctx.fillStyle=`rgba(255,255,255,${0.4+0.2*pulse})`;ctx.fill();ctx.restore();
  if(P.stealth){ctx.save();ctx.font='8px "Share Tech Mono"';ctx.fillStyle='rgba(0,245,255,0.5)';ctx.textAlign='center';ctx.fillText('STEALTH',x,y+P_RAD+14);ctx.restore();}
}

/* ── Render Helpers ── */
function drawBG(){
  ctx.fillStyle='#04040e';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='rgba(0,245,255,0.03)';ctx.lineWidth=0.5;
  for(let x=0;x<canvas.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
  for(let y=0;y<canvas.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
}
function drawWalls(){
  for(const w of walls){
    const g=ctx.createLinearGradient(w.x,w.y,w.x+w.w,w.y+w.h);
    g.addColorStop(0,'#0a1028');g.addColorStop(1,'#0c1232');ctx.fillStyle=g;ctx.fillRect(w.x,w.y,w.w,w.h);
    ctx.save();ctx.strokeStyle=w.cover?'rgba(0,245,255,0.4)':'rgba(0,245,255,0.25)';ctx.lineWidth=1;
    ctx.shadowColor='#00f5ff';ctx.shadowBlur=w.cover?8:4;ctx.strokeRect(w.x+.5,w.y+.5,w.w-1,w.h-1);ctx.restore();
  }
}
function drawParticles(dt){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;
    if(!p.bg){p.life-=dt;if(p.life<=0){particles.splice(i,1);continue;}}
    else{if(p.x<0)p.x+=canvas.width;if(p.x>canvas.width)p.x-=canvas.width;if(p.y<0)p.y+=canvas.height;if(p.y>canvas.height)p.y-=canvas.height;}
    const a=p.bg?0.15+0.1*Math.sin(gameTime+i):p.life/p.maxLife;
    ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=4;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,PI2);ctx.fill();ctx.restore();
  }
}
function drawFX(dt){
  if(fx.flash.on){ctx.save();ctx.fillStyle=`rgba(${fx.flash.r},${fx.flash.g},${fx.flash.b},${fx.flash.a})`;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.restore();fx.flash.a-=dt*3;if(fx.flash.a<=0)fx.flash.on=false;}
  if(fx.shake.on){fx.shake.t+=dt;const p=1-fx.shake.t/fx.shake.dur;const m=fx.shake.mag*p;ctx.setTransform(1,0,0,1,(Math.random()-.5)*2*m,(Math.random()-.5)*2*m);if(fx.shake.t>=fx.shake.dur){fx.shake.on=false;ctx.setTransform(1,0,0,1,0,0);}}
  for(let i=fx.toasts.length-1;i>=0;i--){
    const t=fx.toasts[i];t.t+=dt;
    if(t.phase==='in'){t.a+=dt*5;t.y+=dt*40;if(t.a>=1){t.a=1;t.phase='hold';}}
    else if(t.phase==='hold'){if(t.t>2)t.phase='out';}
    else{t.a-=dt*3;if(t.a<=0){fx.toasts.splice(i,1);continue;}}
    const cx=canvas.width/2,cy=canvas.height-80-t.y-i*35;
    ctx.save();ctx.globalAlpha=t.a;ctx.font='bold 11px "Share Tech Mono"';const tw=ctx.measureText(t.text).width+30;
    ctx.fillStyle='rgba(0,0,16,0.85)';ctx.strokeStyle=t.color;ctx.lineWidth=1;ctx.shadowColor=t.color;ctx.shadowBlur=12;
    roundRect(cx-tw/2,cy-12,tw,24,12);ctx.fill();ctx.stroke();
    ctx.fillStyle=t.color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t.text,cx,cy);ctx.restore();
  }
  if(fx.msgQueue.length>0){
    const m=fx.msgQueue[0];m.t+=dt;
    if(m.phase==='in'){m.a+=dt*3;if(m.a>=1){m.a=1;m.phase='hold';}}
    else if(m.phase==='hold'){if(m.t>m.dur)m.phase='out';}
    else{m.a-=dt*2;if(m.a<=0){fx.msgQueue.shift();return;}}
    ctx.save();ctx.globalAlpha=m.a;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='900 28px "Orbitron"';ctx.fillStyle='#00f5ff';ctx.shadowColor='#00f5ff';ctx.shadowBlur=30;
    ctx.fillText(m.title,canvas.width/2,canvas.height/2-15);
    ctx.font='12px "Share Tech Mono"';ctx.fillStyle='rgba(0,245,255,0.6)';ctx.shadowBlur=10;
    ctx.fillText(m.sub,canvas.width/2,canvas.height/2+18);ctx.restore();
  }
}

/* ── HUD ── */
function drawHUD(){
  ctx.fillStyle='rgba(4,4,14,0.95)';ctx.fillRect(0,0,canvas.width,HUD_H);
  ctx.save();ctx.strokeStyle='rgba(0,245,255,0.2)';ctx.lineWidth=1;ctx.shadowColor='#00f5ff';ctx.shadowBlur=4;
  ctx.beginPath();ctx.moveTo(0,HUD_H);ctx.lineTo(canvas.width,HUD_H);ctx.stroke();ctx.restore();
  ctx.save();ctx.textAlign='center';ctx.font='900 15px "Orbitron"';ctx.fillStyle='#00f5ff';ctx.shadowColor='#00f5ff';ctx.shadowBlur=16;
  ctx.fillText('CYBER SHIELD',canvas.width/2,16);
  ctx.font='700 9px "Orbitron"';ctx.fillStyle='#bf00ff';ctx.shadowColor='#bf00ff';ctx.shadowBlur=10;
  ctx.fillText('LEVEL 4 — DARK WEB IDENTITY THEFT',canvas.width/2,32);ctx.restore();
  // HP bar
  const bx=14,by=8,bw=100,bh=8;
  ctx.fillStyle='rgba(255,255,255,0.05)';ctx.fillRect(bx,by,bw,bh);
  const hpPct=P.hp/P.maxHp;
  const hpColor=hpPct>0.5?'#00ff88':hpPct>0.25?'#ffaa00':'#ff4444';
  ctx.save();ctx.fillStyle=hpColor;ctx.shadowColor=hpColor;ctx.shadowBlur=6;ctx.fillRect(bx,by,bw*hpPct,bh);ctx.restore();
  ctx.save();ctx.font='7px "Share Tech Mono"';ctx.fillStyle='rgba(0,245,255,0.4)';ctx.textAlign='left';ctx.fillText('HP',bx,by+bh+10);
  ctx.fillStyle=hpColor;ctx.fillText(P.hp+'/'+P.maxHp,bx+18,by+bh+10);ctx.restore();
  // Dash CD
  ctx.save();ctx.font='7px "Share Tech Mono"';ctx.fillStyle=P.dashCD>0?'rgba(255,255,255,0.2)':'rgba(0,245,255,0.5)';
  ctx.textAlign='left';ctx.fillText('DASH '+(P.dashCD>0?P.dashCD.toFixed(1):'READY'),bx,by+bh+22);ctx.restore();
  // Stealth indicator
  if(P.stealth){ctx.save();ctx.font='bold 7px "Share Tech Mono"';ctx.fillStyle='rgba(0,245,255,0.6)';ctx.textAlign='left';ctx.fillText('◈ STEALTH ACTIVE',bx,by+bh+34);ctx.restore();}
  // Phase info
  const phaseNames={identity:'PHASE 1: IDENTITY TRACE',sim_swap:'PHASE 2: SIM SWAP DEFENSE',password:'PHASE 3: PASSWORD BREACH',deepfake:'PHASE 4: DEEPFAKE KYC',boss:'PHASE 5: DARK WEB BROKER'};
  if(phaseNames[phase]){ctx.save();ctx.font='8px "Share Tech Mono"';ctx.fillStyle='rgba(0,245,255,0.35)';ctx.textAlign='right';ctx.fillText(phaseNames[phase],canvas.width-14,16);ctx.restore();}
  // Objective
  if(phaseData.objective){ctx.save();ctx.font='9px "Share Tech Mono"';ctx.fillStyle='rgba(255,255,255,0.45)';ctx.textAlign='right';ctx.fillText(phaseData.objective,canvas.width-14,32);ctx.restore();}
  // Controls + Help hint
  ctx.save();ctx.font='7px "Share Tech Mono"';ctx.fillStyle='rgba(0,245,255,0.2)';ctx.textAlign='right';
  ctx.fillText('WASD Move | SHIFT Stealth | SPACE Dash | E Interact | H Help',canvas.width-14,HUD_H-8);ctx.restore();
  // Help button indicator
  const pulse2=0.5+0.5*Math.sin(gameTime*2);
  ctx.save();ctx.font='bold 9px "Share Tech Mono"';ctx.fillStyle=`rgba(0,245,255,${0.25+0.15*pulse2})`;
  ctx.textAlign='left';ctx.fillText('[H] HELP',bx,HUD_H-8);ctx.restore();
  // Navigation arrow to nearest objective
  drawNavArrow();
}
function drawNavArrow(){
  let tx=null,ty=null;
  if(phase==='identity'){
    const f=fragments.find(f=>!f.collected);if(f){tx=f.x;ty=f.y;}
  }else if(phase==='sim_swap'){
    const line=(phaseData.lines||[]).find(l=>!l.blocked&&!l.lost);if(line){tx=line.nodeX;ty=line.nodeY;}
  }else if(phase==='password'){
    const n=(phaseData.nodes||[]).find(n=>n.security&&!n.secured);if(n){tx=n.x;ty=n.y;}
  }else if(phase==='boss'&&phaseData.detachedShield){
    tx=phaseData.detachedShield.x;ty=phaseData.detachedShield.y;
  }
  if(tx===null)return;
  const dx=tx-P.x,dy=ty-P.y,d=Math.hypot(dx,dy);
  if(d<60)return; // close enough
  const a=Math.atan2(dy,dx),r=35;
  const ax=P.x+Math.cos(a)*r,ay=P.y+Math.sin(a)*r;
  const pulse=0.5+0.5*Math.sin(gameTime*4);
  ctx.save();ctx.translate(ax,ay);ctx.rotate(a);
  ctx.fillStyle=`rgba(255,220,60,${0.4+0.3*pulse})`;ctx.shadowColor='#ffdd44';ctx.shadowBlur=8;
  ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-4,-5);ctx.lineTo(-4,5);ctx.closePath();ctx.fill();
  ctx.restore();
}

/* ── Phase Management ── */
function startPhase(p){
  if(p==='transition')return;
  nextPhase=p;transAlpha=0;transDir=1;phase='transition';
}
function doTransition(dt){
  transAlpha+=dt*(transDir>0?2.5:2.5);
  if(transDir>0&&transAlpha>=1){transAlpha=1;transDir=-1;initPhase(nextPhase);phase=nextPhase;}
  if(transDir<0&&transAlpha<=0){transAlpha=0;phase=nextPhase;}
  ctx.save();ctx.fillStyle=`rgba(0,0,8,${transAlpha})`;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.restore();
}
function initPhase(p){
  walls=[];npcs=[];fragments=[];projectiles=[];phaseData={};P.interacting=false;P.interactProg=0;
  P.trail=[];P.dashing=false;P.dashTimer=0;
  const W=canvas.width,H=canvas.height,TOP=HUD_H+WALL_T,LEFT=WALL_T,PW=W-WALL_T*2,PH=H-HUD_H-WALL_T*2;
  const CX=LEFT+PW/2,CY=TOP+PH/2;
  if(p==='identity')initIdentity(LEFT,TOP,PW,PH);
  else if(p==='sim_swap')initSimSwap(LEFT,TOP,PW,PH);
  else if(p==='password')initPassword(LEFT,TOP,PW,PH);
  else if(p==='deepfake')initDeepfake(LEFT,TOP,PW,PH);
  else if(p==='boss')initBoss(LEFT,TOP,PW,PH);
  else if(p==='victory'||p==='gameover'){}
  buildPerimeter();
}
function buildPerimeter(){
  const W=canvas.width,H=canvas.height;
  walls.push({x:0,y:HUD_H,w:W,h:WALL_T},{x:0,y:H-WALL_T,w:W,h:WALL_T},{x:0,y:HUD_H,w:WALL_T,h:H-HUD_H},{x:W-WALL_T,y:HUD_H,w:WALL_T,h:H-HUD_H});
}

/* ══════ PHASE 1: IDENTITY TRACE ══════ */
function initIdentity(L,T,PW,PH){
  P.x=L+PW*0.5;P.y=T+PH*0.85;P.hp=100;
  phaseData={collected:0,total:6,pulseTimer:0,pulses:[]};
  phaseData.objective='Collect all identity fragments (0/6)';
  const positions=[[0.15,0.15],[0.5,0.1],[0.85,0.2],[0.2,0.55],[0.7,0.5],[0.85,0.8]];
  for(const[px,py]of positions)fragments.push({x:L+PW*px,y:T+PH*py,collected:false,pulse:Math.random()*PI2});
  walls.push({x:L+PW*0.25,y:T+PH*0.25,w:PW*0.08,h:PH*0.2,cover:true});
  walls.push({x:L+PW*0.6,y:T+PH*0.15,w:PW*0.06,h:PH*0.25,cover:true});
  walls.push({x:L+PW*0.4,y:T+PH*0.5,w:PW*0.1,h:PH*0.12,cover:true});
  walls.push({x:L+PW*0.15,y:T+PH*0.7,w:PW*0.07,h:PH*0.15,cover:true});
  walls.push({x:L+PW*0.7,y:T+PH*0.65,w:PW*0.08,h:PH*0.18,cover:true});
  // NPC 1: patrols top area (avoids walls at 0.25/0.25 and 0.6/0.15)
  npcs.push(createNPC(L+PW*0.15,T+PH*0.12,[{x:L+PW*0.15,y:T+PH*0.12},{x:L+PW*0.5,y:T+PH*0.08},{x:L+PW*0.85,y:T+PH*0.12},{x:L+PW*0.85,y:T+PH*0.35},{x:L+PW*0.5,y:T+PH*0.35},{x:L+PW*0.15,y:T+PH*0.35}]));
  // NPC 2: patrols middle-lower area (avoids center wall at 0.4-0.5/0.5)
  npcs.push(createNPC(L+PW*0.15,T+PH*0.6,[{x:L+PW*0.15,y:T+PH*0.6},{x:L+PW*0.35,y:T+PH*0.45},{x:L+PW*0.55,y:T+PH*0.45},{x:L+PW*0.55,y:T+PH*0.68},{x:L+PW*0.35,y:T+PH*0.85},{x:L+PW*0.15,y:T+PH*0.85}]));
  // NPC 3: patrols right side (avoids wall at 0.7/0.65)
  npcs.push(createNPC(L+PW*0.9,T+PH*0.45,[{x:L+PW*0.9,y:T+PH*0.45},{x:L+PW*0.6,y:T+PH*0.45},{x:L+PW*0.6,y:T+PH*0.6},{x:L+PW*0.82,y:T+PH*0.6},{x:L+PW*0.82,y:T+PH*0.88},{x:L+PW*0.9,y:T+PH*0.88}]));
  showTutorial('identity');
}
function updateIdentity(dt){
  phaseData.pulseTimer+=dt;
  if(phaseData.pulseTimer>2){phaseData.pulseTimer=0;
    const uf=fragments.find(f=>!f.collected);
    if(uf)phaseData.pulses.push({x:uf.x,y:uf.y,r:0,a:1});}
  phaseData.pulses=phaseData.pulses.filter(p=>{p.r+=dt*120;p.a-=dt*0.8;return p.a>0;});
  for(const f of fragments){
    if(f.collected)continue;f.pulse+=dt*2.5;
    if(dist(P,f)<28){f.collected=true;phaseData.collected++;sfx(660,0.2,'sine',0.08);sfx(880,0.15,'sine',0.06);
      spawnP(f.x,f.y,15,'#ffdd44',100,0.8);toast('◈ FRAGMENT COLLECTED ('+phaseData.collected+'/'+phaseData.total+')','#ffdd44');
      phaseData.objective='Collect all identity fragments ('+phaseData.collected+'/'+phaseData.total+')';
      if(phaseData.collected>=phaseData.total){toast('✔ ALL FRAGMENTS COLLECTED','#00ff88');score+=200;
        setTimeout(()=>startPhase('sim_swap'),1500);}
    }
  }
}
function drawIdentity(){
  for(const p of phaseData.pulses||[]){ctx.save();ctx.strokeStyle=`rgba(0,245,255,${p.a*0.5})`;ctx.lineWidth=2;ctx.shadowColor='#00f5ff';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,PI2);ctx.stroke();ctx.restore();}
  for(const f of fragments){
    if(f.collected)continue;const p=0.5+0.5*Math.sin(f.pulse);
    ctx.save();ctx.translate(f.x,f.y);ctx.rotate(gameTime*1.5);
    ctx.shadowColor='#ffdd44';ctx.shadowBlur=15+8*p;ctx.fillStyle=`rgba(255,220,60,${0.7+0.3*p})`;
    ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(7,0);ctx.lineTo(0,10);ctx.lineTo(-7,0);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();ctx.restore();
    ctx.save();ctx.beginPath();ctx.arc(f.x,f.y,18+4*p,0,PI2);ctx.strokeStyle=`rgba(255,220,60,${0.15+0.1*p})`;ctx.lineWidth=1;ctx.setLineDash([3,5]);ctx.stroke();ctx.restore();
  }
}

/* ══════ PHASE 2: SIM SWAP DEFENSE ══════ */
function initSimSwap(L,T,PW,PH){
  P.x=L+PW*0.1;P.y=T+PH*0.5;P.hp=Math.max(P.hp,60);
  phaseData={lines:[],blocked:0,total:4,lost:0,objective:'Block reroute nodes before attackers reach them (0/4)'};
  phaseData.objective=phaseData.objective;
  const lineYs=[0.2,0.4,0.6,0.8];
  for(let i=0;i<4;i++){
    const ly=T+PH*lineYs[i];
    phaseData.lines.push({y:ly,nodeX:L+PW*(0.6+i*0.07),nodeY:ly,attackerX:L+PW*0.05,attackerSpeed:rnd(45,70),blocked:false,lost:false});
  }
  walls.push({x:L+PW*0.35,y:T+PH*0.1,w:PW*0.06,h:PH*0.25,cover:true});
  walls.push({x:L+PW*0.35,y:T+PH*0.65,w:PW*0.06,h:PH*0.25,cover:true});
  npcs.push(createNPC(L+PW*0.5,T+PH*0.3,[{x:L+PW*0.3,y:T+PH*0.3},{x:L+PW*0.7,y:T+PH*0.3},{x:L+PW*0.7,y:T+PH*0.7},{x:L+PW*0.3,y:T+PH*0.7}]));
  showTutorial('sim_swap');
}
function updateSimSwap(dt){
  let allDone=true;
  for(const line of phaseData.lines){
    if(line.blocked||line.lost)continue;allDone=false;
    line.attackerX+=line.attackerSpeed*dt;
    if(line.attackerX>=line.nodeX){line.lost=true;phaseData.lost++;flash(255,30,50,0.3);shake(4,0.3);sfx(200,0.4,'sawtooth',0.08);toast('✘ SIGNAL HIJACKED!','#ff4444');P.hp=Math.max(0,P.hp-10);if(P.hp<=0)startPhase('gameover');}
    if(!line.blocked&&dist(P,{x:line.nodeX,y:line.nodeY})<30&&keys['KeyE']){
      line.blocked=true;phaseData.blocked++;sfx(550,0.2,'sine',0.08);spawnP(line.nodeX,line.nodeY,12,'#00ff88',80,0.7);
      toast('✔ REROUTE BLOCKED ('+phaseData.blocked+'/'+phaseData.total+')','#00ff88');score+=100;
    }
  }
  phaseData.objective='Block reroute nodes ('+phaseData.blocked+'/'+phaseData.total+') | Lost: '+phaseData.lost;
  const allBlocked=phaseData.blocked>=phaseData.total;
  const tooManyLost=phaseData.lost>=3;
  if(allBlocked&&!phaseData._done){phaseData._done=true;toast('✔ ALL SIGNALS SECURED','#00ff88');setTimeout(()=>startPhase('password'),1500);}
  else if(tooManyLost&&!phaseData._done){phaseData._done=true;toast('✘ TOO MANY SIGNALS LOST','#ff4444');setTimeout(()=>startPhase('gameover'),1500);}
  else if(allDone&&!allBlocked&&!tooManyLost&&!phaseData._done){phaseData._done=true;toast('✘ SIGNALS COMPROMISED','#ff4444');setTimeout(()=>startPhase('gameover'),1500);}
}
function drawSimSwap(){
  const L=WALL_T,PW=canvas.width-WALL_T*2;
  for(const line of phaseData.lines||[]){
    ctx.save();ctx.strokeStyle=line.blocked?'rgba(0,255,136,0.3)':line.lost?'rgba(255,60,60,0.2)':'rgba(0,245,255,0.15)';
    ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.beginPath();ctx.moveTo(L,line.y);ctx.lineTo(L+PW,line.y);ctx.stroke();ctx.restore();
    if(!line.blocked&&!line.lost){
      ctx.save();ctx.fillStyle='#ff4444';ctx.shadowColor='#ff4444';ctx.shadowBlur=12;
      ctx.beginPath();ctx.arc(line.attackerX,line.y,6,0,PI2);ctx.fill();
      ctx.font='7px "Share Tech Mono"';ctx.fillStyle='rgba(255,100,100,0.7)';ctx.textAlign='center';ctx.fillText('ATTACKER',line.attackerX,line.y-12);ctx.restore();
    }
    const nc=line.blocked?'#00ff88':line.lost?'#ff4444':'#ffdd44';
    ctx.save();ctx.fillStyle=nc;ctx.shadowColor=nc;ctx.shadowBlur=line.blocked?8:14;
    ctx.beginPath();ctx.arc(line.nodeX,line.nodeY,line.blocked?6:8,0,PI2);ctx.fill();
    if(!line.blocked&&!line.lost){ctx.strokeStyle='rgba(255,220,60,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(line.nodeX,line.nodeY,22,0,PI2);ctx.stroke();
      ctx.font='7px "Share Tech Mono"';ctx.fillStyle='rgba(255,220,60,0.6)';ctx.textAlign='center';ctx.fillText('[E] BLOCK',line.nodeX,line.nodeY+20);}
    ctx.restore();
    // Signal flow animation
    if(!line.blocked&&!line.lost){const sx=(gameTime*80)%(PW);
      ctx.save();ctx.fillStyle='rgba(0,245,255,0.6)';ctx.shadowColor='#00f5ff';ctx.shadowBlur=6;
      for(let i=0;i<3;i++){const px=L+(sx+i*PW/3)%PW;ctx.beginPath();ctx.arc(px,line.y,2,0,PI2);ctx.fill();}ctx.restore();}
  }
}

/* ══════ PHASE 3: PASSWORD BREACH ══════ */
function initPassword(L,T,PW,PH){
  P.x=L+PW*0.5;P.y=T+PH*0.85;P.hp=Math.max(P.hp,50);
  const nodes=[];const positions=[[0.2,0.15],[0.5,0.1],[0.8,0.15],[0.1,0.4],[0.4,0.38],[0.65,0.4],[0.9,0.38],[0.25,0.65],[0.55,0.68],[0.8,0.65]];
  for(let i=0;i<10;i++){nodes.push({x:L+PW*positions[i][0],y:T+PH*positions[i][1],infected:i<2,secured:false,security:i>=6,secureProg:0});}
  const links=[[0,1],[1,2],[0,3],[1,4],[2,5],[2,6],[3,4],[4,5],[5,6],[3,7],[4,8],[5,9],[7,8],[8,9]];
  phaseData={nodes,links,infectionTimer:0,infectionRate:3.5,secured:0,totalSecurity:4,objective:'Break infected links & activate security nodes (0/4)'};
  walls.push({x:L+PW*0.45,y:T+PH*0.5,w:PW*0.08,h:PH*0.15,cover:true});
  npcs.push(createNPC(L+PW*0.3,T+PH*0.3,[{x:L+PW*0.15,y:T+PH*0.25},{x:L+PW*0.5,y:T+PH*0.2},{x:L+PW*0.5,y:T+PH*0.5},{x:L+PW*0.15,y:T+PH*0.5}]));
  showTutorial('password');
}
function updatePassword(dt){
  const d=phaseData;
  d.infectionTimer+=dt;
  if(d.infectionTimer>d.infectionRate){d.infectionTimer=0;
    for(const[a,b]of d.links){
      if(d.nodes[a].infected&&!d.nodes[b].infected&&!d.nodes[b].secured&&Math.random()<0.4){d.nodes[b].infected=true;sfx(150,0.2,'square',0.04);spawnP(d.nodes[b].x,d.nodes[b].y,6,'#ff4444',60,0.5);}
      if(d.nodes[b].infected&&!d.nodes[a].infected&&!d.nodes[a].secured&&Math.random()<0.4){d.nodes[a].infected=true;sfx(150,0.2,'square',0.04);spawnP(d.nodes[a].x,d.nodes[a].y,6,'#ff4444',60,0.5);}
    }
  }
  // Break infected links near player
  if(keys['KeyE']){
    for(const[a,b]of d.links){
      const mx=(d.nodes[a].x+d.nodes[b].x)/2,my=(d.nodes[a].y+d.nodes[b].y)/2;
      if(d.nodes[a].infected&&d.nodes[b].infected&&dist(P,{x:mx,y:my})<40){
        d.nodes[a].infected=false;d.nodes[b].infected=false;sfx(440,0.15,'sine',0.06);
        spawnP(mx,my,8,'#00f5ff',70,0.6);toast('◈ LINK CLEANED','#00f5ff');score+=25;break;
      }
    }
    // Activate security nodes
    for(const n of d.nodes){
      if(n.security&&!n.secured&&dist(P,n)<35){
        n.secureProg+=dt;
        if(n.secureProg>=2){n.secured=true;n.infected=false;d.secured++;sfx(660,0.3,'sine',0.08);sfx(880,0.2,'sine',0.06);
          spawnP(n.x,n.y,15,'#00ff88',90,0.8);toast('✔ SECURITY NODE ACTIVE ('+d.secured+'/'+d.totalSecurity+')','#00ff88');score+=100;
          if(d.secured>=d.totalSecurity&&!d._done){d._done=true;toast('✔ NETWORK SECURED','#00ff88');setTimeout(()=>startPhase('deepfake'),1500);}
        }
      }
    }
  }else{for(const n of d.nodes)if(n.security)n.secureProg=Math.max(0,n.secureProg-dt*0.5);}
  const infCount=d.nodes.filter(n=>n.infected).length;
  if(infCount>=8){toast('✘ NETWORK COMPROMISED','#ff4444');P.hp-=20;if(P.hp<=0)startPhase('gameover');else{for(const n of d.nodes)if(!n.security)n.infected=false;d.nodes[0].infected=true;d.nodes[1].infected=true;}}
  d.objective='Secure nodes ('+d.secured+'/'+d.totalSecurity+') | Infected: '+infCount+'/'+d.nodes.length;
}
function drawPassword(){
  const d=phaseData;if(!d.nodes)return;
  for(const[a,b]of d.links){
    const na=d.nodes[a],nb=d.nodes[b];
    const infected=na.infected&&nb.infected;
    ctx.save();ctx.strokeStyle=infected?`rgba(255,60,60,${0.4+0.2*Math.sin(gameTime*4)})`:'rgba(0,245,255,0.12)';
    ctx.lineWidth=infected?2:1;if(infected){ctx.shadowColor='#ff4444';ctx.shadowBlur=8;}
    ctx.beginPath();ctx.moveTo(na.x,na.y);ctx.lineTo(nb.x,nb.y);ctx.stroke();ctx.restore();
  }
  for(const n of d.nodes){
    const color=n.secured?'#00ff88':n.infected?'#ff4444':n.security?'#ffdd44':'#00f5ff';
    const pulse=0.5+0.5*Math.sin(gameTime*3);const r=n.security?10:8;
    ctx.save();ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=n.infected?12+6*pulse:8;
    ctx.beginPath();ctx.arc(n.x,n.y,r,0,PI2);ctx.fill();
    if(n.security&&!n.secured){ctx.strokeStyle='rgba(255,220,60,0.4)';ctx.lineWidth=1;ctx.setLineDash([3,4]);
      ctx.beginPath();ctx.arc(n.x,n.y,20,0,PI2);ctx.stroke();
      if(n.secureProg>0){ctx.setLineDash([]);ctx.strokeStyle='#00ff88';ctx.lineWidth=3;ctx.shadowColor='#00ff88';ctx.shadowBlur=10;
        ctx.beginPath();ctx.arc(n.x,n.y,20,-PI/2,-PI/2+PI2*(n.secureProg/2));ctx.stroke();}
      ctx.font='7px "Share Tech Mono"';ctx.fillStyle='rgba(255,220,60,0.5)';ctx.textAlign='center';ctx.setLineDash([]);
      ctx.fillText('[HOLD E]',n.x,n.y+28);
    }
    if(n.secured){ctx.font='8px "Share Tech Mono"';ctx.fillStyle='#00ff88';ctx.textAlign='center';ctx.fillText('✓',n.x,n.y+4);}
    ctx.restore();
  }
}

/* ══════ PHASE 4: DEEPFAKE KYC ══════ */
function initDeepfake(L,T,PW,PH){
  P.x=L+PW*0.5;P.y=T+PH*0.85;P.hp=Math.max(P.hp,40);
  const cells=[];const gridW=6,gridH=4;const cellW=PW*0.08,cellH=PH*0.1;
  const startX=L+PW*0.5-gridW*cellW/2,startY=T+PH*0.15;
  const fakes=new Set();while(fakes.size<5){fakes.add(Math.floor(Math.random()*gridW*gridH));}
  for(let gy=0;gy<gridH;gy++)for(let gx=0;gx<gridW;gx++){
    const idx=gy*gridW+gx;
    cells.push({x:startX+gx*cellW+cellW/2,y:startY+gy*cellH+cellH/2,w:cellW-4,h:cellH-4,fake:fakes.has(idx),flagged:false,glitchT:rnd(0,10),glitchDur:rnd(0.3,0.6),glitchInterval:rnd(2.5,4.5)});
  }
  phaseData={cells,flagged:0,total:5,timer:45,scanX:L+PW*0.5,objective:'Detect deepfake cells (0/5) — 45s remaining'};
  walls.push({x:L+PW*0.15,y:T+PH*0.6,w:PW*0.06,h:PH*0.15,cover:true});
  walls.push({x:L+PW*0.8,y:T+PH*0.6,w:PW*0.06,h:PH*0.15,cover:true});
  npcs.push(createNPC(L+PW*0.2,T+PH*0.4,[{x:L+PW*0.1,y:T+PH*0.3},{x:L+PW*0.9,y:T+PH*0.3},{x:L+PW*0.9,y:T+PH*0.55},{x:L+PW*0.1,y:T+PH*0.55}],'#ff8800',120,30));
  showTutorial('deepfake');
}
function updateDeepfake(dt){
  const d=phaseData;d.timer-=dt;
  if(d.timer<=0){toast('✘ TIME EXPIRED','#ff4444');P.hp-=15;if(P.hp<=0){startPhase('gameover');return;}
    d.timer=30;for(const c of d.cells)if(c.fake&&!c.flagged){c.glitchInterval*=0.7;}}
  for(const c of d.cells){c.glitchT+=dt;if(c.fake&&!c.flagged){
    if(dist(P,c)<30&&consumeKey('KeyE')){
      const inGlitch=(c.glitchT%c.glitchInterval)<c.glitchDur;
      if(inGlitch){c.flagged=true;d.flagged++;sfx(550,0.2,'sine',0.07);spawnP(c.x,c.y,10,'#00ff88',60,0.6);
        toast('✔ DEEPFAKE DETECTED ('+d.flagged+'/'+d.total+')','#00ff88');score+=100;
        if(d.flagged>=d.total&&!d._done){d._done=true;toast('✔ ALL DEEPFAKES IDENTIFIED','#00ff88');setTimeout(()=>startPhase('boss'),1500);}
      }else{sfx(200,0.3,'sawtooth',0.06);flash(255,30,50,0.2);shake(3,0.2);toast('✘ FALSE POSITIVE — Wait for glitch!','#ff4444');P.hp-=5;}
    }
  }}
  d.objective='Detect deepfakes ('+d.flagged+'/'+d.total+') — '+Math.ceil(d.timer)+'s remaining';
}
function drawDeepfake(){
  const d=phaseData;if(!d.cells)return;
  // Scanning line
  ctx.save();ctx.strokeStyle='rgba(0,245,255,0.15)';ctx.lineWidth=1;ctx.setLineDash([4,8]);
  ctx.beginPath();ctx.moveTo(P.x,HUD_H);ctx.lineTo(P.x,canvas.height);ctx.stroke();ctx.restore();
  for(const c of d.cells){
    const inGlitch=c.fake&&!c.flagged&&(c.glitchT%c.glitchInterval)<c.glitchDur;
    let color=c.flagged?'#00ff88':inGlitch?'#ff4444':'#0a1428';
    let border=c.flagged?'rgba(0,255,136,0.5)':inGlitch?'rgba(255,60,60,0.6)':'rgba(0,245,255,0.15)';
    ctx.save();
    if(inGlitch){ctx.shadowColor='#ff4444';ctx.shadowBlur=10;const ox=rnd(-2,2),oy=rnd(-2,2);ctx.translate(ox,oy);}
    ctx.fillStyle=color;ctx.fillRect(c.x-c.w/2,c.y-c.h/2,c.w,c.h);
    ctx.strokeStyle=border;ctx.lineWidth=1;ctx.strokeRect(c.x-c.w/2,c.y-c.h/2,c.w,c.h);
    if(c.flagged){ctx.font='12px "Share Tech Mono"';ctx.fillStyle='#00ff88';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('✓',c.x,c.y);}
    // Face pattern lines inside cells
    if(!c.flagged){ctx.strokeStyle=inGlitch?'rgba(255,100,100,0.3)':'rgba(0,245,255,0.06)';ctx.lineWidth=0.5;
      for(let ly=c.y-c.h/2+4;ly<c.y+c.h/2-2;ly+=4){ctx.beginPath();ctx.moveTo(c.x-c.w/2+3,ly);ctx.lineTo(c.x+c.w/2-3,ly);ctx.stroke();}}
    ctx.restore();
  }
  // Timer display
  ctx.save();ctx.font='bold 14px "Orbitron"';ctx.fillStyle=d.timer<10?'#ff4444':'#ffdd44';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=12;
  ctx.textAlign='center';ctx.fillText(Math.ceil(d.timer)+'s',canvas.width/2,canvas.height-30);ctx.restore();
}

/* ══════ PHASE 5: BOSS FIGHT ══════ */
function initBoss(L,T,PW,PH){
  P.x=L+PW*0.5;P.y=T+PH*0.85;P.hp=Math.max(P.hp,80);
  const cx=L+PW*0.5,cy=T+PH*0.35;
  const shields=[];for(let i=0;i<3;i++){const a=i*PI2/3;shields.push({angle:a,r:70,hp:3,alive:true});}
  phaseData={bx:cx,by:cy,bossHp:100,maxBossHp:100,shields,bossPhase:1,
    attackTimer:0,attackType:'none',laserAngle:0,laserSpeed:1.2,
    projectiles:[],vulnTimer:0,vulnerable:false,chargeTimer:0,charging:false,
    bossSpeed:40,bossAngle:0,detachTimer:rnd(4,6),detachedShield:null,
    objective:'Destroy shield nodes — then charge final attack on boss'};
  showTutorial('boss');
}
function updateBoss(dt){
  const d=phaseData;
  // Boss movement
  d.bossAngle+=dt*0.3;d.bx+=Math.cos(d.bossAngle)*d.bossSpeed*dt;d.by+=Math.sin(d.bossAngle*0.7)*d.bossSpeed*0.5*dt;
  const L=WALL_T,T=HUD_H+WALL_T,PW=canvas.width-WALL_T*2,PH=canvas.height-HUD_H-WALL_T*2;
  d.bx=clamp(d.bx,L+PW*0.25,L+PW*0.75);d.by=clamp(d.by,T+PH*0.15,T+PH*0.5);
  // Shield orbit
  const aliveShields=d.shields.filter(s=>s.alive);
  for(const s of d.shields){if(!s.alive)continue;s.angle+=dt*1.2;}
  // Detach shield periodically
  if(aliveShields.length>0&&!d.detachedShield){
    d.detachTimer-=dt;
    if(d.detachTimer<=0){
      const s=aliveShields[Math.floor(Math.random()*aliveShields.length)];
      d.detachedShield={shield:s,x:d.bx+Math.cos(s.angle)*s.r,y:d.by+Math.sin(s.angle)*s.r,timer:6};
      d.detachTimer=rnd(5,8);
    }
  }
  // Detached shield interaction
  if(d.detachedShield){
    const ds=d.detachedShield;ds.timer-=dt;
    if(ds.timer<=0){d.detachedShield=null;}
    else if(dist(P,ds)<25&&(P.dashing||keys['KeyE'])){
      ds.shield.hp--;sfx(330,0.2,'square',0.07);spawnP(ds.x,ds.y,10,'#bf00ff',80,0.5);shake(3,0.2);
      if(ds.shield.hp<=0){ds.shield.alive=false;sfx(220,0.4,'sawtooth',0.08);spawnP(ds.x,ds.y,20,'#ff8800',100,0.8);toast('✔ SHIELD NODE DESTROYED','#00ff88');score+=150;}
      d.detachedShield=null;
    }
  }
  // Boss attacks
  d.attackTimer+=dt;
  if(d.attackTimer>2.5){d.attackTimer=0;
    const r=Math.random();
    if(r<0.5){// Laser grid
      for(let i=0;i<3;i++){const a=rnd(0,PI2);const spd=rnd(100,200);
        d.projectiles.push({x:d.bx,y:d.by,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,life:3,r:4,color:'#ff2850',type:'laser'});}
    }else{// Data swarm
      const count=6+d.bossPhase*2;for(let i=0;i<count;i++){const a=PI2*i/count+gameTime;const spd=120+d.bossPhase*30;
        d.projectiles.push({x:d.bx,y:d.by,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,life:2.5,r:3,color:'#bf00ff',type:'swarm'});}
      sfx(300,0.3,'square',0.05);
    }
  }
  // Update projectiles
  for(let i=d.projectiles.length-1;i>=0;i--){
    const p=d.projectiles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(p.life<=0||p.x<0||p.x>canvas.width||p.y<0||p.y>canvas.height){d.projectiles.splice(i,1);continue;}
    if(dist(P,p)<P_RAD+p.r&&P.dmgCD<=0&&!P.dashing){
      P.hp-=8;P.dmgCD=0.5;P.invuln=0.3;flash(255,30,50,0.25);shake(3,0.15);sfx(120,0.2,'sawtooth',0.06);
      d.projectiles.splice(i,1);if(P.hp<=0){P.hp=0;startPhase('gameover');}
    }
  }
  // Boss vulnerable when all shields down
  if(aliveShields.length===0&&!d.vulnerable){d.vulnerable=true;toast('◈ BOSS VULNERABLE — Get close and hold [E]!','#ffdd44');}
  if(d.vulnerable&&dist(P,{x:d.bx,y:d.by})<50&&keys['KeyE']){
    d.charging=true;d.chargeTimer+=dt;
    if(d.chargeTimer>=3){
      d.bossHp-=50;sfx(440,0.5,'sine',0.1);sfx(660,0.3,'sine',0.08);flash(0,255,100,0.4);shake(8,0.5);
      spawnP(d.bx,d.by,30,'#00ff88',150,1);d.chargeTimer=0;d.charging=false;score+=300;
      if(d.bossHp<=0&&!d._done){d._done=true;toast('✔ DARK WEB BROKER NEUTRALIZED','#00ff88');score+=500;setTimeout(()=>startPhase('victory'),2000);}
      else{d.vulnerable=false;d.bossPhase++;
        for(let i=0;i<2;i++){const idx=d.shields.findIndex(s=>!s.alive);if(idx>=0){d.shields[idx].alive=true;d.shields[idx].hp=2;}}
        toast('⚠ BOSS REGENERATING SHIELDS','#ff4444');
      }
    }
  }else{d.charging=false;d.chargeTimer=Math.max(0,d.chargeTimer-dt*0.5);}
  d.objective='Boss HP: '+Math.max(0,d.bossHp)+'/'+d.maxBossHp+' | Shields: '+aliveShields.length+'/3';
}
function drawBoss(){
  const d=phaseData;if(!d.bx)return;const pulse=0.5+0.5*Math.sin(gameTime*3);
  // Boss aura
  const ag=ctx.createRadialGradient(d.bx,d.by,20,d.bx,d.by,100);
  ag.addColorStop(0,`rgba(191,0,255,${0.1+0.05*pulse})`);ag.addColorStop(1,'transparent');
  ctx.fillStyle=ag;ctx.beginPath();ctx.arc(d.bx,d.by,100,0,PI2);ctx.fill();
  // Boss body
  ctx.save();ctx.translate(d.bx,d.by);ctx.rotate(gameTime*0.4);
  ctx.fillStyle=d.vulnerable?`rgba(255,60,60,${0.3+0.1*pulse})`:'rgba(20,0,40,0.9)';
  ctx.strokeStyle=d.vulnerable?'#ff4444':'#bf00ff';ctx.lineWidth=2;ctx.shadowColor=d.vulnerable?'#ff4444':'#bf00ff';ctx.shadowBlur=20+10*pulse;
  ctx.beginPath();for(let i=0;i<6;i++){const a=i*PI2/6;ctx.lineTo(Math.cos(a)*30,Math.sin(a)*30);}ctx.closePath();ctx.fill();ctx.stroke();
  // Inner core
  ctx.fillStyle=d.vulnerable?'#ff6666':'#bf00ff';ctx.shadowBlur=15;ctx.beginPath();ctx.arc(0,0,12,0,PI2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,5,0,PI2);ctx.fill();ctx.restore();
  // Boss HP bar
  const bhw=80;ctx.save();ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(d.bx-bhw/2,d.by-50,bhw,6);
  ctx.fillStyle='#bf00ff';ctx.shadowColor='#bf00ff';ctx.shadowBlur=6;ctx.fillRect(d.bx-bhw/2,d.by-50,bhw*(d.bossHp/d.maxBossHp),6);ctx.restore();
  // Shield nodes
  for(const s of d.shields){if(!s.alive)continue;
    const sx=d.bx+Math.cos(s.angle)*s.r,sy=d.by+Math.sin(s.angle)*s.r;
    ctx.save();ctx.fillStyle='#ffdd44';ctx.shadowColor='#ffdd44';ctx.shadowBlur=10+5*pulse;
    ctx.beginPath();ctx.arc(sx,sy,8,0,PI2);ctx.fill();
    ctx.strokeStyle='rgba(255,220,60,0.3)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(d.bx,d.by);ctx.lineTo(sx,sy);ctx.stroke();ctx.restore();
  }
  // Detached shield
  if(d.detachedShield){const ds=d.detachedShield;
    ctx.save();ctx.fillStyle='#ff8800';ctx.shadowColor='#ff8800';ctx.shadowBlur=15+8*pulse;
    ctx.beginPath();ctx.arc(ds.x,ds.y,10,0,PI2);ctx.fill();
    ctx.strokeStyle='rgba(255,136,0,0.4)';ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(ds.x,ds.y,22,0,PI2);ctx.stroke();
    ctx.setLineDash([]);ctx.font='7px "Share Tech Mono"';ctx.fillStyle='rgba(255,180,60,0.7)';ctx.textAlign='center';ctx.fillText('[E] or DASH',ds.x,ds.y+25);
    // Timer arc
    ctx.strokeStyle='#ff8800';ctx.lineWidth=2;ctx.beginPath();ctx.arc(ds.x,ds.y,12,-PI/2,-PI/2+PI2*(ds.timer/6));ctx.stroke();ctx.restore();
  }
  // Charge indicator
  if(d.charging){ctx.save();ctx.strokeStyle='#00ff88';ctx.lineWidth=4;ctx.shadowColor='#00ff88';ctx.shadowBlur=15;
    ctx.beginPath();ctx.arc(d.bx,d.by,40,-PI/2,-PI/2+PI2*(d.chargeTimer/3));ctx.stroke();
    ctx.font='bold 10px "Share Tech Mono"';ctx.fillStyle='#00ff88';ctx.textAlign='center';ctx.fillText('CHARGING...',d.bx,d.by+55);ctx.restore();}
  else if(d.vulnerable){ctx.save();ctx.font='9px "Share Tech Mono"';ctx.fillStyle=`rgba(255,220,60,${0.5+0.3*pulse})`;ctx.textAlign='center';ctx.fillText('▶ GET CLOSE + HOLD [E] ◀',d.bx,d.by+55);ctx.restore();}
  // Projectiles
  for(const p of d.projectiles){
    ctx.save();ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=8;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,PI2);ctx.fill();ctx.restore();
  }
}

/* ══════ START SCREEN ══════ */
function drawStart(){
  drawBG();drawParticles(1/60);
  const cx=canvas.width/2,cy=canvas.height/2;const pulse=0.5+0.5*Math.sin(gameTime*2);
  ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
  // Glitch effect
  ctx.font='900 42px "Orbitron"';ctx.fillStyle='#00f5ff';ctx.shadowColor='#00f5ff';ctx.shadowBlur=40;
  if(Math.random()<0.05){ctx.fillStyle='#bf00ff';ctx.fillText('CYBER SHIELD',cx+rnd(-3,3),cy-120+rnd(-2,2));}
  ctx.fillStyle='#00f5ff';ctx.fillText('CYBER SHIELD',cx,cy-120);
  ctx.font='700 16px "Orbitron"';ctx.fillStyle='#bf00ff';ctx.shadowColor='#bf00ff';ctx.shadowBlur=20;
  ctx.fillText('LEVEL 4',cx,cy-80);
  ctx.font='12px "Share Tech Mono"';ctx.fillStyle='rgba(255,255,255,0.5)';ctx.shadowBlur=0;
  ctx.fillText('— DARK WEB IDENTITY THEFT —',cx,cy-55);
  // Mission briefing
  ctx.font='10px "Share Tech Mono"';ctx.fillStyle='rgba(0,245,255,0.4)';
  const brief=['Your identity has been compromised on the Dark Web.','Navigate through 5 phases to recover your data,','defend your accounts, and take down the Dark Web Broker.'];
  brief.forEach((b,i)=>ctx.fillText(b,cx,cy-25+i*16));
  // Controls
  ctx.fillStyle='rgba(0,245,255,0.25)';ctx.fillRect(cx-180,cy+25,360,1);
  const controls=[['WASD / Arrows','Move'],['SHIFT (hold)','Stealth Mode'],['SPACE','Dash (dodge)'],['E','Interact'],['H','Help Guide']];
  ctx.font='10px "Share Tech Mono"';
  controls.forEach((c,i)=>{
    const y=cy+42+i*18;
    ctx.fillStyle='rgba(0,245,255,0.45)';ctx.textAlign='right';ctx.fillText(c[0],cx-10,y);
    ctx.fillStyle='rgba(255,255,255,0.35)';ctx.textAlign='left';ctx.fillText('—  '+c[1],cx+10,y);
  });
  // Phases preview
  ctx.textAlign='center';ctx.fillStyle='rgba(0,245,255,0.25)';ctx.fillRect(cx-180,cy+138,360,1);
  ctx.font='8px "Orbitron"';ctx.fillStyle='rgba(0,245,255,0.3)';
  ctx.fillText('5 PHASES: Identity Trace → SIM Swap → Password Breach → Deepfake KYC → Boss Fight',cx,cy+155);
  // Start prompt
  ctx.font='bold 14px "Share Tech Mono"';ctx.fillStyle=`rgba(0,245,255,${0.4+0.4*pulse})`;ctx.shadowColor='#00f5ff';ctx.shadowBlur=14;
  ctx.fillText('[ PRESS ENTER TO BEGIN ]',cx,cy+185);
  // Decorative corners
  const cw=220;
  ctx.strokeStyle='rgba(0,245,255,0.2)';ctx.lineWidth=2;ctx.shadowColor='#00f5ff';ctx.shadowBlur=8;
  [[cx-cw,cy-140,1,1],[cx+cw,cy-140,-1,1],[cx-cw,cy+200,1,-1],[cx+cw,cy+200,-1,-1]].forEach(([x,y,sx,sy])=>{
    ctx.beginPath();ctx.moveTo(x+sx*20,y);ctx.lineTo(x,y);ctx.lineTo(x,y+sy*20);ctx.stroke();});
  ctx.restore();
  if(consumeKey('Enter')||consumeKey('Space')){initAudio();spawnBG();startPhase('identity');}
}

/* ══════ VICTORY SCREEN ══════ */
function drawVictory(){
  drawBG();drawParticles(1/60);
  // Show HTML overlay on first frame
  const ov=document.getElementById('victoryOverlay');
  if(ov&&!ov.classList.contains('show')){
    ov.classList.add('show');
    const sc=document.getElementById('voScore');
    if(sc){sc.innerHTML='FINAL SCORE: <span style="color:#00ff88;font-weight:bold">'+score+'</span><br>HEALTH REMAINING: '+P.hp+'/'+P.maxHp;}
  }
}

/* ══════ GAME OVER ══════ */
function drawGameOver(){
  drawBG();drawParticles(1/60);
  const cx=canvas.width/2,cy=canvas.height/2;const pulse=0.5+0.5*Math.sin(gameTime*2);
  ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='900 28px "Orbitron"';ctx.fillStyle='#ff4444';ctx.shadowColor='#ff4444';ctx.shadowBlur=30;
  ctx.fillText('IDENTITY COMPROMISED',cx,cy-40);
  ctx.font='12px "Share Tech Mono"';ctx.fillStyle='rgba(255,100,100,0.5)';ctx.shadowBlur=8;
  ctx.fillText('YOUR DIGITAL IDENTITY HAS BEEN STOLEN',cx,cy-10);
  ctx.fillStyle='rgba(0,245,255,0.4)';ctx.font='11px "Share Tech Mono"';
  ctx.fillText('SCORE: '+score,cx,cy+30);
  ctx.font='bold 13px "Share Tech Mono"';ctx.fillStyle=`rgba(255,100,100,${0.4+0.4*pulse})`;ctx.shadowColor='#ff4444';ctx.shadowBlur=14;
  ctx.fillText('[ PRESS ENTER TO RETRY ]',cx,cy+70);
  ctx.restore();
  if(consumeKey('Enter')){resetGame();phase='start';}
}

function resetGame(){P.hp=100;score=0;particles=[];fx.toasts=[];fx.msgQueue=[];gameTime=0;walls=[];npcs=[];fragments=[];projectiles=[];phaseData={};helpOpen=false;tutorialOpen=false;tutorialData=null;spawnBG();
  const ov=document.getElementById('victoryOverlay');if(ov)ov.classList.remove('show');}

function lvl4PlayAgain(){
  const ov=document.getElementById('victoryOverlay');if(ov)ov.classList.remove('show');
  resetGame();phase='start';
}

function lvl4ContinueToNext(){
  localStorage.setItem('cybershield_just_completed','4');
  window.location.href='../../game-app/index.html';
}

/* ══════ MAIN UPDATE ══════ */
function update(dt){
  gameTime+=dt;phaseTime+=dt;
  if(phase==='start'||phase==='victory'||phase==='gameover'||phase==='transition')return;
  if(tutorialOpen||helpOpen)return; // pause game while overlays are open
  updatePlayer(dt);updateNPCs(dt);
  if(phase==='identity')updateIdentity(dt);
  else if(phase==='sim_swap')updateSimSwap(dt);
  else if(phase==='password')updatePassword(dt);
  else if(phase==='deepfake')updateDeepfake(dt);
  else if(phase==='boss')updateBoss(dt);
}

/* ══════ MAIN DRAW ══════ */
function draw(dt){
  if(fx.shake.on){const p=1-fx.shake.t/fx.shake.dur;const m=fx.shake.mag*p;ctx.setTransform(1,0,0,1,(Math.random()-.5)*2*m,(Math.random()-.5)*2*m);}
  if(phase==='start'){drawStart();Object.keys(kDown).forEach(k=>kDown[k]=false);return;}
  if(phase==='victory'){drawVictory();Object.keys(kDown).forEach(k=>kDown[k]=false);return;}
  if(phase==='gameover'){drawGameOver();Object.keys(kDown).forEach(k=>kDown[k]=false);return;}
  drawBG();drawWalls();drawParticles(dt);
  if(phase==='identity')drawIdentity();
  else if(phase==='sim_swap')drawSimSwap();
  else if(phase==='password')drawPassword();
  else if(phase==='deepfake')drawDeepfake();
  else if(phase==='boss')drawBoss();
  drawNPCs();drawPlayer();drawHUD();drawFX(dt);
  if(phase==='transition')doTransition(dt);
  // Overlays on top of everything
  if(tutorialOpen)drawTutorial();
  if(helpOpen)drawHelpOverlay();
  ctx.setTransform(1,0,0,1,0,0);
  Object.keys(kDown).forEach(k=>kDown[k]=false);
}

/* ══════ RESIZE ══════ */
function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
window.addEventListener('resize',resize);

/* ══════ GAME LOOP ══════ */
let lastTime=null;
function loop(ts){
  if(!lastTime)lastTime=ts;const dt=Math.min((ts-lastTime)/1000,0.05);lastTime=ts;
  update(dt);draw(dt);requestAnimationFrame(loop);
}
resize();spawnBG();requestAnimationFrame(loop);