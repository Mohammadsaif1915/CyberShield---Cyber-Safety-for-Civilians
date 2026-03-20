import { useEffect } from "react";

function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const script = document.createElement("script");
      script.src = "/script.js?t=" + Date.now();
      script.async = false;
      document.body.appendChild(script);
    }, 50);

    return () => {
      clearTimeout(timer);
      const s = document.querySelector('script[src^="/script.js"]');
      if (s) document.body.removeChild(s);
    };
  }, []);

  return (
    <>
      <canvas id="particleCanvas"></canvas>

      <div id="loadingScreen" className="screen loading-screen active">
        <div className="load-inner">
          <div className="load-logo">
            <div className="hex-ring"></div>
            <img src="/logo.png.jpeg" className="load-img" alt="logo" />
          </div>
          <div className="terminal-lines">
            <p className="tline" style={{ "--d": "0.2s" }}>? Initializing firewall matrix...</p>
            <p className="tline" style={{ "--d": "0.9s" }}>? Encrypting secure channel...</p>
            <p className="tline" style={{ "--d": "1.6s" }}>? Loading cyber modules...</p>
            <p className="tline blink-text" style={{ "--d": "2.3s" }}>? ACCESS GRANTED</p>
          </div>
          <div className="load-bar-wrap"><div className="load-bar"></div></div>
        </div>
      </div>

      <div id="introScreen" className="screen intro-screen">
        <div className="intro-bg-grid"></div>
        <div className="intro-content">
          <img src="/logo.png.jpeg" className="intro-logo" alt="logo" />
          <h1 className="intro-title">CYBER<br /><span>DEFENSE</span></h1>
          <p className="intro-sub">SECURE THE DIGITAL WORLD</p>
          <div className="intro-bar"></div>
        </div>
      </div>

      <div id="homeScreen" className="screen home-screen">
        <div className="home-bg-overlay"></div>
        <header className="top-bar">
          <div className="tb-left">
            <button className="icon-btn" id="profileIconBtn" title="Profile" onClick={() => window.toggleProfile()}>
              <span className="icon-svg">??</span>
              <span id="userLabel" className="user-label-chip"></span>
            </button>
          </div>
          <div className="tb-center"><div className="logo-chip">CD</div></div>
          <div className="tb-right">
            <button className="icon-btn" id="settingsIconBtn" title="Settings" onClick={() => window.toggleSettings()}>
              <span className="icon-svg gear-icon">?</span>
            </button>
          </div>
        </header>
        <main className="home-hero">
          <div className="glitch-wrap">
            <h1 className="hero-title" data-text="CYBER DEFENSE">CYBER DEFENSE</h1>
          </div>
          <p className="hero-sub">SECURE THE DIGITAL WORLD</p>
          <div className="hero-stats">
            <div className="stat-chip"><span className="stat-n" id="statLevels">1000</span><span className="stat-l">LEVELS</span></div>
            <div className="stat-divider"></div>
            <div className="stat-chip"><span className="stat-n" id="statUnlocked">1</span><span className="stat-l">UNLOCKED</span></div>
            <div className="stat-divider"></div>
            <div className="stat-chip"><span className="stat-n" id="statCompleted">0</span><span className="stat-l">DONE</span></div>
          </div>
          <button className="start-btn" onClick={() => window.startGame()}>
            <span className="start-btn-text">ENTER GAME</span>
            <span className="start-btn-glow"></span>
          </button>
        </main>
        <footer className="home-footer">
          <span>v2.0</span><span className="footer-dot">?</span>
          <span>� CYBER DEFENSE</span><span className="footer-dot">?</span>
          <span id="footerTime"></span>
        </footer>
      </div>

      <div id="levelScreen" className="screen level-screen">
        <div className="level-topbar">
          <button className="back-btn" onClick={() => window.goHome()}><span>?</span> HOME</button>
          <div className="level-title-chip">MISSION SELECT</div>
          <div className="level-progress-chip"><span id="progressText">1 / 1000</span></div>
        </div>
        <div id="mapCanvas" className="map-canvas"></div>
      </div>

      <div className="popup-overlay" id="settingsOverlay" onClick={() => window.closeSettings()}></div>
      <div className="popup" id="settingsBox">
        <div className="popup-header">
          <span className="popup-icon">?</span><h2>SETTINGS</h2>
          <button className="popup-close-x" onClick={() => window.closeSettings()}>?</button>
        </div>
        <div className="popup-body">
          <div className="setting-row">
            <div className="setting-info"><span className="setting-name">Scanlines</span><span className="setting-desc">CRT screen effect</span></div>
            <button id="scanBtn" className="toggle-btn active" onClick={() => window.toggleScanline()}><span className="toggle-knob"></span></button>
          </div>
          <div className="setting-row">
            <div className="setting-info"><span className="setting-name">Sound FX</span><span className="setting-desc">UI click sounds</span></div>
            <button id="soundBtn" className="toggle-btn active" onClick={() => window.toggleSound()}><span className="toggle-knob"></span></button>
          </div>
          <div className="setting-row">
            <div className="setting-info"><span className="setting-name">Music</span><span className="setting-desc">Background soundtrack</span></div>
            <button id="musicBtn" className="toggle-btn active" onClick={() => window.toggleMusic()}><span className="toggle-knob"></span></button>
          </div>
          <div className="setting-row">
            <div className="setting-info"><span className="setting-name">Theme</span><span className="setting-desc">Dark / Light mode</span></div>
            <button id="themeBtn" className="toggle-btn" onClick={() => window.toggleTheme()}><span className="toggle-knob"></span></button>
          </div>
        </div>
      </div>

      <div className="popup-overlay" id="profileOverlay" onClick={() => window.closeProfile()}></div>
      <div className="popup" id="profileBox">
        <div className="popup-header">
          <span className="popup-icon">??</span><h2 id="profileTitle">CREATE AGENT</h2>
          <button className="popup-close-x" onClick={() => window.closeProfile()}>?</button>
        </div>
        <div className="popup-body">
          <div id="profileCreateView">
            <div className="input-wrap">
              <label className="input-label">AGENT CODENAME</label>
              <input id="nameInput" className="cyber-input" placeholder="e.g. ghost_wire" autoComplete="off" maxLength="20" />
              <p id="nameError" className="name-error"></p>
            </div>
            <button id="profileSubmitBtn" className="action-btn primary-btn">REGISTER AGENT</button>
          </div>
          <div id="profileViewMode" style={{ display: "none" }}>
            <div className="agent-card">
              <div className="agent-avatar">??</div>
              <div className="agent-info">
                <p className="agent-name" id="agentName">�</p>
                <p className="agent-id" id="agentId">�</p>
              </div>
            </div>
            <div className="agent-stats-row">
              <div className="astat"><span id="astatLvl">0</span><span>COMPLETED</span></div>
              <div className="astat"><span id="astatRank">E</span><span>RANK</span></div>
            </div>
            <button id="logoutBtn" className="action-btn danger-btn">LOGOUT AGENT</button>
          </div>
        </div>
      </div>

      <div className="popup-overlay" id="levelModalOverlay" onClick={() => window.closeLevelModal()}></div>
      <div className="popup" id="levelModal">
        <div className="popup-header">
          <span className="popup-icon" id="levelModalIcon">??</span>
          <h2 id="levelModalTitle">MISSION 1</h2>
          <button className="popup-close-x" onClick={() => window.closeLevelModal()}>?</button>
        </div>
        <div className="popup-body">
          <div className="mission-info">
            <div className="mission-stat"><span id="missionDiff">EASY</span><span>DIFFICULTY</span></div>
            <div className="mission-stat"><span id="missionType">FIREWALL</span><span>TYPE</span></div>
            <div className="mission-stat"><span id="missionXP">+100</span><span>XP REWARD</span></div>
          </div>
          <div id="levelLockedMsg" className="locked-msg" style={{ display: "none" }}>
            <p>?? Complete previous mission to unlock</p>
          </div>
          <button id="playLevelBtn" className="action-btn primary-btn" onClick={() => window.playLevel()}>
            LAUNCH MISSION
          </button>
        </div>
      </div>

      <div id="gameScreen" className="screen game-screen">
        <div className="gs-topbar">
          <button className="gs-exit-btn" onClick={() => window.exitGame()}>? EXIT</button>
          <div className="gs-center">
            <div className="gs-level-badge">
              <span id="gsLevelIcon">??</span>
              <span id="gsLevelName">LOADING...</span>
            </div>
            <div className="gs-progress-dots" id="gsProgressDots"></div>
          </div>
          <div className="gs-xp-display" id="gsXPDisplay">
            <span className="gs-xp-icon">?</span>
            <span id="gsXPValue">0</span>
            <span>XP</span>
          </div>
        </div>

        <div className="gs-content" id="gsContent">
          <div className="gs-context" id="gsContext"></div>
          <div id="gsScenarioFrame"></div>
          <div className="gs-question-wrap">
            <span className="gs-question-label">WHAT DO YOU DO?</span>
            <p className="gs-question-text" id="gsQuestionText"></p>
          </div>
          <div className="gs-choices-grid" id="gsChoicesGrid"></div>
        </div>

        <div className="gs-feedback-panel" id="gsFeedbackPanel">
          <div className="gsf-top">
            <div className="gsf-verdict" id="gsfVerdict"></div>
            <div className="gsf-xp-earned" id="gsfXPEarned"></div>
          </div>
          <div className="gsf-why-label">?? WHY THIS MATTERS</div>
          <p className="gsf-explanation" id="gsfExplanation"></p>
          <button className="gsf-next-btn" onClick={() => window.nextQuestion()}>
            NEXT CHALLENGE ?
          </button>
        </div>

        <div id="gsXPFloatContainer" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 200 }}></div>
      </div>

      <div id="levelCompleteScreen" className="screen level-complete-screen">
        <div className="lcs-bg-grid"></div>
        <div className="lcs-inner">
          <div className="lcs-shield-wrap">
            <div className="lcs-shield-ring"></div>
            <div className="lcs-shield-icon">???</div>
          </div>
          <div className="lcs-title-wrap">
            <p className="lcs-pre">MISSION</p>
            <h2 className="lcs-title">COMPLETE</h2>
          </div>
          <div className="lcs-stars-row" id="lcsStarsRow"></div>
          <div className="lcs-score-wrap">
            <span className="lcs-score-label">MISSION SCORE</span>
            <div className="lcs-score-nums">
              <span className="lcs-score-value" id="lcsScoreValue">0</span>
              <span className="lcs-score-max">/ 300 XP</span>
            </div>
          </div>
          <button className="lcs-back-btn" onClick={() => window.finishLevel()}>
           ← BACK TO MAP
          </button>
        </div>
      </div>
    </>
  );
}

export default App;