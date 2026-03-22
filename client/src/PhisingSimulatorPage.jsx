import { useState, useRef } from "react";
import {
  Mail, AlertTriangle, CheckCircle, XCircle, AlertCircle,
  Shield, Eye, Target, Award, ChevronRight, Inbox
} from "lucide-react";

const C = {
  bg: "#050810",
  bgCard: "#0C1120",
  bgCardHov: "#111827",
  border: "rgba(99,102,241,0.15)",
  brand: "#6366F1",
  teal: "#14B8A6",
  violet: "#A78BFA",
  amber: "#F59E0B",
  red: "#EF4444",
  green: "#10B981",
  text: "#F1F5F9",
  textMd: "#94A3B8",
  textDim: "#475569",
};

const PHISHING_EMAILS = [
  {
    id: 1, from: "PayPal Security", sender: "security@paypa1.com",
    subject: "Urgent: Verify your account immediately",
    time: "10:23 AM", fish: true, read: false,
    body: `Dear Customer,

Suspicious activity has been detected on your PayPal account. Your account has been temporarily limited.

To restore full access, verify your identity within 24 hours:

→  http://paypa1-secure.xyz/login

Failure to verify will result in permanent suspension.

PayPal Security Team`,
    flags: [
      "Misspelled domain: paypa1.com (not paypal.com)",
      "Urgent threatening language creating panic",
      "Link redirects to non-PayPal domain",
      "Generic greeting — no name used",
      "Artificial 24-hour deadline",
    ]
  },
  {
    id: 2, from: "GitHub", sender: "noreply@github.com",
    subject: "Your pull request #247 was merged",
    time: "9:45 AM", fish: false, read: true,
    body: `Hi there,

Your pull request #247 'Fix authentication middleware' was successfully merged into main by jsmith.

View your PR: github.com/cybershield/platform/pull/247

You can delete your branch if you're done with it.

Thanks,
The GitHub Team`,
    flags: []
  },
  {
    id: 3, from: "HR Department", sender: "hr-noreply@comp4ny-hr.net",
    subject: "Action Required: W-2 Form Update",
    time: "Yesterday", fish: true, read: false,
    body: `Dear Employee,

Annual tax filing requires you to update your W-2 information and banking details immediately for accurate payroll processing.

Update your details here:
http://comp4ny-hr.net/w2-update

⚠️ Deadline: End of today. Failure to update may delay your paycheck.

Human Resources`,
    flags: [
      "Unofficial lookalike domain (comp4ny-hr.net)",
      "Requests sensitive banking details via email",
      "Same-day deadline creates urgency",
      "No company name or HR contact provided",
    ]
  },
  {
    id: 4, from: "State Bank of India", sender: "alerts@sbi-bank-secure.in",
    subject: "URGENT: KYC Update — Account Blocked",
    time: "2 days ago", fish: true, read: false,
    body: `Dear Valued Customer,

Your SBI account has been blocked due to incomplete KYC verification. To unblock your account immediately:

Visit: http://sbi-kyc-update.in/verify

You will need to provide:
• Account Number
• Debit Card Number
• PIN
• OTP received on mobile

Act now to avoid permanent account closure.

SBI Customer Care`,
    flags: [
      "Fake domain — real SBI uses sbi.co.in",
      "SBI never asks for card number + PIN + OTP",
      "Requesting multiple credentials = major red flag",
      "Threatening 'permanent closure' creates panic",
    ]
  },
  {
    id: 5, from: "Medium Daily Digest", sender: "newsletter@medium.com",
    subject: "Your top cybersecurity stories for today",
    time: "3 days ago", fish: false, read: true,
    body: `Good morning,

Here are your personalized stories based on your reading history:

📌 The Future of Cybersecurity in 2025
📌 Zero Trust Architecture Explained  
📌 India's New Data Protection Bill: What You Need to Know

Read on Medium →

Have a great day,
The Medium Team`,
    flags: []
  },
];

function EmailListItem({ email, selected, answered }) {
  const a = answered;
  const isPhish = email.fish;
  return (
    <div style={{
      padding: "12px 16px",
      borderBottom: `1px solid rgba(255,255,255,0.04)`,
      cursor: "pointer",
      background: selected ? "rgba(99,102,241,0.08)" : "transparent",
      borderLeft: `2px solid ${selected ? C.brand : "transparent"}`,
      transition: "all .15s",
    }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 12, fontWeight: !a ? 700 : 500, color: C.text }}>{email.from}</span>
        <span style={{ fontSize: 9, color: C.textDim, fontFamily: "JetBrains Mono, monospace" }}>{email.time}</span>
      </div>
      <p style={{ fontSize: 11, color: C.textMd, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email.subject}</p>
      {a && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5, fontSize: 10, fontWeight: 700, color: a.ok ? C.green : C.red }}>
          {a.ok ? <CheckCircle size={10} /> : <XCircle size={10} />}
          {a.ok ? "Correct" : "Incorrect"}
        </div>
      )}
    </div>
  );
}

export default function PhishingPage({ onPhishingComplete, addActivityNotif }) {
  const [sel, setSel] = useState(null);
  const [ans, setAns] = useState({});
  const completedRef = useRef(false);

  const done = Object.keys(ans).length;
  const ok = Object.values(ans).filter(a => a.ok).length;
  const acc = done ? Math.round((ok / done) * 100) : 0;
  const pending = PHISHING_EMAILS.filter(e => !ans[e.id]).length;

  const handleAnswer = (emailId, isPhishGuess, emailIsFish) => {
    const correct = isPhishGuess === emailIsFish;
    const newAns = { ...ans, [emailId]: { ok: correct, pick: isPhishGuess } };
    setAns(newAns);
    if (Object.keys(newAns).length === PHISHING_EMAILS.length && !completedRef.current) {
      completedRef.current = true;
      const cc = Object.values(newAns).filter(a => a.ok).length;
      onPhishingComplete(cc, PHISHING_EMAILS.length);
      addActivityNotif(`Phishing sim — ${cc}/${PHISHING_EMAILS.length} correct`, cc >= 3 ? C.green : C.amber);
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .ph-enter{animation:fadeUp .35s ease both}
        .result-enter{animation:fadeIn .25s ease both}
      `}</style>

      {/* ── HEADER ── */}
      <div className="ph-enter" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mail size={20} style={{ color: C.amber }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>Phishing Simulator</h1>
            <p style={{ fontSize: 12, color: C.textMd, margin: 0 }}>Identify phishing attacks in real-world email samples</p>
          </div>
        </div>
        {/* Stats row */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { l: "Analyzed", v: `${done}/${PHISHING_EMAILS.length}`, c: C.brand },
            { l: "Correct", v: ok, c: C.green },
            { l: "Accuracy", v: done ? `${acc}%` : "—", c: C.violet },
            { l: "Pending", v: pending, c: pending > 0 ? C.amber : C.textDim },
          ].map(s => (
            <div key={s.l} style={{ textAlign: "center", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 16px" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.c, fontFamily: "Syne, sans-serif" }}>{s.v}</div>
              <div style={{ fontSize: 10, color: C.textDim }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── COMPLETION BANNER ── */}
      {completedRef.current && (
        <div className="result-enter" style={{ marginBottom: 16, padding: "16px 22px", background: ok >= 4 ? "rgba(16,185,129,0.06)" : "rgba(245,158,11,0.06)", border: `1px solid ${ok >= 4 ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`, borderRadius: 16, display: "flex", alignItems: "center", gap: 14 }}>
          {ok >= 4 ? <CheckCircle size={28} style={{ color: C.green, flexShrink: 0 }} /> : <AlertTriangle size={28} style={{ color: C.amber, flexShrink: 0 }} />}
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: ok >= 4 ? C.green : C.amber, margin: "0 0 3px" }}>
              {ok >= 4 ? "Excellent! Simulation Complete 🎉" : "Simulation Complete — Keep Practicing"}
            </p>
            <p style={{ fontSize: 12, color: C.textMd, margin: 0 }}>
              You scored <strong style={{ color: C.text }}>{ok}/{PHISHING_EMAILS.length}</strong> — {acc}% accuracy. XP and score updated!
            </p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "center", padding: "8px 14px", background: ok >= 4 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", borderRadius: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: ok >= 4 ? C.green : C.amber, fontFamily: "Syne, sans-serif" }}>{acc}%</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Final Score</div>
          </div>
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>

        {/* Email list */}
        <div className="ph-enter" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Inbox size={13} style={{ color: C.brand }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Inbox</span>
            </div>
            {pending > 0 && (
              <span style={{ fontSize: 9, fontWeight: 700, color: C.amber, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 5, padding: "2px 7px", fontFamily: "JetBrains Mono, monospace" }}>
                {pending} pending
              </span>
            )}
          </div>
          {PHISHING_EMAILS.map(email => (
            <div key={email.id} onClick={() => setSel(email)}>
              <EmailListItem email={email} selected={sel?.id === email.id} answered={ans[email.id]} />
            </div>
          ))}
          {/* Progress */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textDim, marginBottom: 5 }}>
              <span>Progress</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{done}/{PHISHING_EMAILS.length}</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: 4, width: `${(done / PHISHING_EMAILS.length) * 100}%`, background: `linear-gradient(90deg,${C.brand},${C.teal})`, borderRadius: 99, transition: "width .5s ease" }} />
            </div>
          </div>
        </div>

        {/* Email viewer */}
        {sel ? (
          <div className="ph-enter" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Email header */}
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.border}`, background: sel.fish ? "rgba(239,68,68,0.04)" : "rgba(16,185,129,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", background: sel.fish ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", color: sel.fish ? C.red : C.green, border: `1px solid ${sel.fish ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}` }}>
                  {ans[sel.id] ? (sel.fish ? "⚠ PHISHING EMAIL" : "✓ LEGITIMATE EMAIL") : "UNANALYZED"}
                </span>
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>{sel.subject}</h4>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: C.textMd, fontFamily: "JetBrains Mono, monospace" }}>
                <span><strong style={{ color: C.textDim }}>From:</strong> {sel.from} &lt;{sel.sender}&gt;</span>
                <span>{sel.time}</span>
              </div>
            </div>

            {/* Email body */}
            <div style={{ padding: "20px 22px", flex: 1 }}>
              <pre style={{ fontSize: 13, color: C.textMd, whiteSpace: "pre-wrap", fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.8, margin: 0 }}>{sel.body}</pre>
            </div>

            {/* Action footer */}
            {!ans[sel.id] ? (
              <div style={{ padding: "16px 22px", borderTop: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Is this email legitimate or a phishing attack?</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => handleAnswer(sel.id, true, sel.fish)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", color: C.red, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .18s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}>
                    <AlertTriangle size={16} /> This is Phishing
                  </button>
                  <button onClick={() => handleAnswer(sel.id, false, sel.fish)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.06)", color: C.green, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .18s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(16,185,129,0.12)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(16,185,129,0.06)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)"; }}>
                    <CheckCircle size={16} /> This is Legitimate
                  </button>
                </div>
              </div>
            ) : (
              <div className="result-enter" style={{ padding: "16px 22px", borderTop: `1px solid ${C.border}` }}>
                <div style={{
                  borderRadius: 14, padding: "16px 18px",
                  background: ans[sel.id].ok ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                  border: `1px solid ${ans[sel.id].ok ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 13, marginBottom: sel.fish && sel.flags.length > 0 ? 12 : 0, color: ans[sel.id].ok ? C.green : C.red }}>
                    {ans[sel.id].ok ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {ans[sel.id].ok ? "Correct! Well spotted." : `Incorrect — this was ${sel.fish ? "PHISHING" : "LEGITIMATE"}`}
                  </div>
                  {sel.fish && sel.flags.length > 0 && (
                    <div>
                      <p style={{ fontSize: 11, color: C.textMd, margin: "0 0 8px", fontWeight: 600 }}>🚩 Red flags in this email:</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {sel.flags.map((f, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, fontSize: 11, color: C.textMd }}>
                            <AlertCircle size={12} style={{ color: C.red, flexShrink: 0, marginTop: 1 }} />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Next email prompt */}
                {pending > 0 && (
                  <button onClick={() => { const next = PHISHING_EMAILS.find(e => !ans[e.id]); if (next) setSel(next); }}
                    style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: `1px solid ${C.border}`, background: "transparent", color: C.brand, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Next email <ChevronRight size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="ph-enter" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 40 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mail size={24} style={{ color: C.amber }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>Select an email to begin</p>
              <p style={{ fontSize: 12, color: C.textMd, lineHeight: 1.6, maxWidth: 260, margin: "0 auto 16px" }}>Click any email from the inbox to analyze it. Identify whether it's phishing or legitimate to earn XP.</p>
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: 12, color: C.textMd }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.red }} />Phishing</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />Legitimate</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}