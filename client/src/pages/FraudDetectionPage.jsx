import { useState } from "react";
import { Search, Mail, Lock, AlertTriangle, CheckCircle, Shield, Eye, EyeOff, Copy, ExternalLink } from "lucide-react";

const T = {
  bg: "#F0F2F8", surface: "#FFFFFF", card: "#FFFFFF", border: "rgba(99,102,241,0.14)",
  brand: "#4F46E5", brandDark: "#3730A3", brandGlow: "rgba(79,70,229,0.18)",
  teal: "#0D9488", tealDim: "rgba(13,148,136,0.10)", tealLight: "rgba(13,148,136,0.20)",
  violet: "#7C3AED", amber: "#D97706", amberDim: "rgba(217,119,6,0.10)",
  red: "#DC2626", redDim: "rgba(220,38,38,0.08)", green: "#059669", greenDim: "rgba(5,150,105,0.10)",
  text: "#111827", textMd: "#4B5563", textDim: "#9CA3AF",
  sh: "0 1px 4px rgba(0,0,0,0.07)", shMd: "0 4px 20px rgba(0,0,0,0.10)",
};

function URLRiskAnalyzer() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeURL = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    
    try {
      // Simulate analysis - in production, call a real threat intelligence API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const urlLower = url.toLowerCase();
      const riskFactors = [];
      let riskScore = 0;
      
      // Known malicious domain patterns
      const maliciousDomains = ["phishing", "fake", "scam", "hack", "malware", "trojan", "virus", "paypa1", "goggl", "amazo", "bankkk"];
      const isMaliciousDomain = maliciousDomains.some(d => urlLower.includes(d));
      if (isMaliciousDomain) { riskFactors.push("⚠️ Known malicious domain pattern"); riskScore += 45; }
      
      // Suspicious patterns
      if (urlLower.includes("bit.ly") || urlLower.includes("tinyurl") || urlLower.includes("short.link")) { riskFactors.push("🔗 Shortened URL (hides real destination)"); riskScore += 20; }
      if (urlLower.includes("@")) { riskFactors.push("⚠️ @ Symbol in URL (phishing indicator)"); riskScore += 40; }
      if (!urlLower.startsWith("https://")) { 
        riskFactors.push("🔓 No HTTPS encryption"); 
        riskScore += 25; 
      } else {
        riskFactors.push("✓ HTTPS encrypted connection");
      }
      if ((urlLower.match(/\d+\.\d+\.\d+\.\d+/g) || []).length > 0) { riskFactors.push("⚠️ IP-Based address (suspicious)"); riskScore += 35; }
      if (urlLower.includes("login") || urlLower.includes("signin") || urlLower.includes("account")) { 
        if (!this?.isOfficialDomain?.(url)) {
          riskFactors.push("⚠️ Login page on non-official domain"); 
          riskScore += 40; 
        }
      }
      if (urlLower.includes("-") && urlLower.includes(".")) {
        const domain = urlLower.split("/")[2];
        if (domain && domain.split(".")[0].split("-").length > 3) { 
          riskFactors.push("⚠️ Suspicious domain pattern (many hyphens)"); 
          riskScore += 15; 
        }
      }
      if (url.length > 120) { riskFactors.push("📏 Unusually long URL"); riskScore += 10; }
      
      // Look for common phishing indicators
      const phishingWords = ["confirm", "verify", "update-now", "act-now", "click-here", "urgent"];
      const hasPhishingWord = phishingWords.some(w => urlLower.includes(w));
      if (hasPhishingWord) { riskFactors.push("🎣 Contains phishing-trigger words"); riskScore += 25; }
      
      // Safe indicators
      if (urlLower.includes("bank") && urlLower.includes("official")) riskScore -= 10;
      if (riskFactors.length === 0 || (riskScore < 20 && !isMaliciousDomain)) {
        riskFactors.push("✓ URL appears legitimate based on available checks");
      }
      
      const finalScore = Math.min(100, Math.max(0, riskScore));
      
      setAnalysis({
        url,
        riskScore: finalScore,
        riskLevel: finalScore >= 75 ? "CRITICAL" : finalScore >= 50 ? "HIGH" : finalScore >= 25 ? "MEDIUM" : "LOW",
        riskFactors: riskFactors.length > 0 ? riskFactors : ["URL appears legitimate based on current analysis"],
        safe: finalScore < 25,
      });
    } catch (err) {
      console.error("URL Analysis Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "CRITICAL": return T.red;
      case "HIGH": return T.amber;
      case "MEDIUM": return "#EAB308";
      default: return T.green;
    }
  };

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", boxShadow: T.sh }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: T.brandGlow, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Search size={20} style={{ color: T.brand }} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>URL Risk Analyzer</h3>
      </div>

      <form onSubmit={analyzeURL} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a URL to analyze... https://example.com"
            style={{
              flex: 1, padding: "12px 16px", border: `1px solid ${T.border}`, borderRadius: 10,
              fontSize: 13, fontFamily: "'Nunito',sans-serif",
              outline: "none", transition: "border-color 0.2s",
              borderColor: url ? T.brand : T.border,
            }}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            style={{
              padding: "12px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              background: T.brand, color: "#fff", fontSize: 13, fontWeight: 600,
              fontFamily: "'Nunito',sans-serif", opacity: loading || !url.trim() ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </form>

      {analysis && (
        <div>
          <div style={{ background: `${getRiskColor(analysis.riskLevel)}15`, border: `1px solid ${getRiskColor(analysis.riskLevel)}40`, borderRadius: 12, padding: "16px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {analysis.safe ? <CheckCircle size={20} style={{ color: T.green }} /> : <AlertTriangle size={20} style={{ color: getRiskColor(analysis.riskLevel) }} />}
              <span style={{ fontSize: 14, fontWeight: 700, color: getRiskColor(analysis.riskLevel) }}>{analysis.riskLevel} RISK</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${analysis.riskScore}%`, height: "100%", background: getRiskColor(analysis.riskLevel), borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.textMd }}>{analysis.riskScore}%</span>
            </div>
            <p style={{ fontSize: 12, color: T.textMd }}>{analysis.url}</p>
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8 }}>Risk Factors:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {analysis.riskFactors.map((factor, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.textMd }}>
                  <div style={{ width: 4, height: 4, background: analysis.safe ? T.green : T.amber, borderRadius: 99 }} />
                  {factor}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmailAnalyzer() {
  const [email, setEmail] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const suspiciousPatterns = [];
      let riskScore = 0;

      if (!email.includes("@")) { suspiciousPatterns.push("Invalid email format"); riskScore += 50; }
      if (email.includes("..")) { suspiciousPatterns.push("Double dots detected"); riskScore += 25; }
      if (email.split("@")[0].length > 50) { suspiciousPatterns.push("Unusually long local part"); riskScore += 15; }
      if (!/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) { suspiciousPatterns.push("Invalid format"); riskScore += 40; }

      const domain = email.split("@")[1];
      if (domain && domain.length > 50) { suspiciousPatterns.push("Suspicious domain length"); riskScore += 20; }
      if (domain && domain.includes("-")) { suspiciousPatterns.push("Hyphens in domain (common in phishing)"); riskScore += 20; }

      setAnalysis({
        email,
        riskScore: Math.min(100, riskScore),
        riskLevel: riskScore > 60 ? "CRITICAL" : riskScore > 35 ? "HIGH" : riskScore > 15 ? "MEDIUM" : "LOW",
        patterns: suspiciousPatterns.length > 0 ? suspiciousPatterns : ["Email appears legitimate"],
      });
    } catch (err) {
      console.error("Email Analysis Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "CRITICAL": return T.red;
      case "HIGH": return T.amber;
      case "MEDIUM": return "#EAB308";
      default: return T.green;
    }
  };

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", boxShadow: T.sh }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: T.tealDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Mail size={20} style={{ color: T.teal }} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>Email Analyzer</h3>
      </div>

      <form onSubmit={analyzeEmail} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Check email legitimacy... sender@example.com"
            style={{
              flex: 1, padding: "12px 16px", border: `1px solid ${T.border}`, borderRadius: 10,
              fontSize: 13, fontFamily: "'Nunito',sans-serif",
              outline: "none", transition: "border-color 0.2s",
              borderColor: email ? T.teal : T.border,
            }}
          />
          <button
            type="submit"
            disabled={loading || !email.trim()}
            style={{
              padding: "12px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              background: T.teal, color: "#fff", fontSize: 13, fontWeight: 600,
              fontFamily: "'Nunito',sans-serif", opacity: loading || !email.trim() ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </form>

      {analysis && (
        <div>
          <div style={{ background: `${getRiskColor(analysis.riskLevel)}15`, border: `1px solid ${getRiskColor(analysis.riskLevel)}40`, borderRadius: 12, padding: "16px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {analysis.riskScore < 30 ? <CheckCircle size={20} style={{ color: T.green }} /> : <AlertTriangle size={20} style={{ color: getRiskColor(analysis.riskLevel) }} />}
              <span style={{ fontSize: 14, fontWeight: 700, color: getRiskColor(analysis.riskLevel) }}>{analysis.riskLevel}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${analysis.riskScore}%`, height: "100%", background: getRiskColor(analysis.riskLevel), borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.textMd }}>{analysis.riskScore}%</span>
            </div>
            <p style={{ fontSize: 12, color: T.textMd, wordBreak: "break-all" }}>{analysis.email}</p>
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8 }}>Findings:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {analysis.patterns.map((pattern, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.textMd }}>
                  <div style={{ width: 4, height: 4, background: analysis.riskScore < 30 ? T.green : T.amber, borderRadius: 99 }} />
                  {pattern}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [showing, setShowing] = useState(false);
  const [strength, setStrength] = useState(null);

  const checkPassword = (pwd) => {
    let score = 0;
    const feedback = [];

    if (pwd.length >= 12) score += 20;
    else if (pwd.length >= 8) score += 10;
    else feedback.push("Use at least 12 characters");

    if (/[a-z]/.test(pwd)) score += 15;
    else feedback.push("Add lowercase letters");

    if (/[A-Z]/.test(pwd)) score += 15;
    else feedback.push("Add uppercase letters");

    if (/\d/.test(pwd)) score += 15;
    else feedback.push("Add numbers");

    if (/[!@#$%^&*]/.test(pwd)) score += 20;
    else feedback.push("Add special characters (!@#$%^&*)");

    if (["password", "123456", "qwerty", "abc123"].some(w => pwd.toLowerCase().includes(w))) {
      score = Math.max(0, score - 30);
      feedback.push("Contains common passwords");
    }

    const level = score >= 80 ? "STRONG" : score >= 50 ? "GOOD" : score >= 25 ? "FAIR" : "WEAK";
    const color = level === "STRONG" ? T.green : level === "GOOD" ? T.teal : level === "FAIR" ? T.amber : T.red;

    return { score: Math.min(100, Math.max(0, score)), level, color, feedback };
  };

  const handlePassword = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (pwd) setStrength(checkPassword(pwd));
    else setStrength(null);
  };

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", boxShadow: T.sh }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={20} style={{ color: T.violet }} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>Password Strength Checker</h3>
      </div>

      <div style={{ position: "relative", marginBottom: 16 }}>
        <input
          type={showing ? "text" : "password"}
          value={password}
          onChange={handlePassword}
          placeholder="Enter password to check strength..."
          style={{
            width: "100%", padding: "12px 40px 12px 16px", border: `1px solid ${T.border}`, borderRadius: 10,
            fontSize: 13, fontFamily: "'Nunito',sans-serif", outline: "none",
          }}
        />
        <button
          type="button"
          onClick={() => setShowing(!showing)}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {showing ? <EyeOff size={18} style={{ color: T.textDim }} /> : <Eye size={18} style={{ color: T.textDim }} />}
        </button>
      </div>

      {strength && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>Strength</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: strength.color }}>{strength.level}</span>
          </div>
          <div style={{ width: "100%", height: 8, background: T.border, borderRadius: 4, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ width: `${strength.score}%`, height: "100%", background: strength.color, borderRadius: 4, transition: "width 0.3s ease" }} />
          </div>

          {strength.feedback.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.textMd, marginBottom: 8 }}>Suggestions:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {strength.feedback.map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: T.textMd }}>
                    <span style={{ color: T.amber }}>→</span> {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FraudDetectionPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>Fraud Detection Tools</h1>
        <p style={{ fontSize: 14, color: T.textMd }}>Analyze URLs, emails, and passwords to protect yourself from threats</p>
      </div>

      {/* Tools Grid */}
      <div className="dg2" style={{ marginBottom: 24 }}>
        <URLRiskAnalyzer />
        <EmailAnalyzer />
      </div>

      <PasswordStrengthChecker />

      {/* Quick Tips */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", marginTop: 24, boxShadow: T.sh }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16, fontFamily: "'Syne',sans-serif" }}>🛡️ Safety Tips</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { title: "Verify URLs", desc: "Always check for HTTPS and familiar domain names" },
            { title: "Check Email Senders", desc: "Be wary of slight misspellings in official domains" },
            { title: "Strong Passwords", desc: "Use 12+ chars with mix of upper, lower, numbers, symbols" },
            { title: "Two-Factor Auth", desc: "Enable 2FA on all important accounts" },
          ].map((tip, i) => (
            <div key={i} style={{ background: T.bg, borderRadius: 10, padding: "12px", fontSize: 12 }}>
              <p style={{ fontWeight: 600, color: T.text, marginBottom: 4 }}>{tip.title}</p>
              <p style={{ color: T.textMd, lineHeight: 1.4 }}>{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
