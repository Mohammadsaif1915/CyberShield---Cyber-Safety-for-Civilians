import { useState } from "react";
import { AlertTriangle, Send, CheckCircle, AlertCircle } from "lucide-react";

const T = {
  bg: "#F0F2F8", surface: "#FFFFFF", card: "#FFFFFF", border: "rgba(99,102,241,0.14)",
  brand: "#4F46E5", brandDark: "#3730A3", brandGlow: "rgba(79,70,229,0.18)",
  teal: "#0D9488", tealDim: "rgba(13,148,136,0.10)",
  amber: "#D97706", amberDim: "rgba(217,119,6,0.10)",
  red: "#DC2626", redDim: "rgba(220,38,38,0.08)", green: "#059669", greenDim: "rgba(5,150,105,0.10)",
  text: "#111827", textMd: "#4B5563", textDim: "#9CA3AF",
  sh: "0 1px 4px rgba(0,0,0,0.07)", shMd: "0 4px 20px rgba(0,0,0,0.10)",
};

const API = {
  headers: () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` }),
  post: (url, body) => fetch(url, { method: "POST", headers: API.headers(), body: JSON.stringify(body) }).then(r => r.json()),
};

const REPORT_TYPES = [
  { value: "phishing", label: "🎣 Phishing Email", desc: "Deceptive email pretending to be from trusted source" },
  { value: "malware", label: "🦠 Malware", desc: "Suspicious file or link that could contain malware" },
  { value: "scam_call", label: "☎️ Scam Call", desc: "Fraudulent phone call attempting to steal information" },
  { value: "fraud_link", label: "🔗 Fraudulent Link", desc: "Link promoting financial scams or fake services" },
  { value: "suspicious_email", label: "✉️ Suspicious Email", desc: "Email with unclear origin requesting action" },
  { value: "other", label: "❓ Other", desc: "Other suspicious activity not listed above" },
];

const SEVERITY_LEVELS = [
  { value: "low", label: "Low", color: T.teal, desc: "Minor concern, low immediate risk" },
  { value: "medium", label: "Medium", color: T.amber, desc: "Moderate concern, worth reporting" },
  { value: "high", label: "High", color: "#EA580C", desc: "Serious threat, needs attention" },
  { value: "critical", label: "Critical", color: T.red, desc: "Severe threat, immediate action needed" },
];

export default function IncidentReportPage() {
  const [reportType, setReportType] = useState("phishing");
  const [severity, setSeverity] = useState("medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !description.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await API.post("/api/features/incidents/report", {
        type: reportType,
        severity,
        subject: subject.trim(),
        description: description.trim(),
        evidenceUrl: evidenceUrl.trim(),
        reporterEmail: anonymous ? undefined : reporterEmail.trim(),
        anonymous,
      });

      if (res?.success) {
        setSuccess(true);
        setReportType("phishing");
        setSeverity("medium");
        setSubject("");
        setDescription("");
        setEvidenceUrl("");
        setReporterEmail("");
        setAnonymous(false);

        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(res?.message || "Failed to submit report");
      }
    } catch (err) {
      console.error("Report Submission Error:", err);
      setError("Error submitting report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>Report a Threat</h1>
        <p style={{ fontSize: 14, color: T.textMd }}>Help protect our community by reporting suspicious activity, phishing attempts, and scams</p>
      </div>

      {success && (
        <div style={{ background: T.greenDim, border: `1px solid ${T.green}`, color: T.green, padding: "16px 20px", borderRadius: 12, marginBottom: 24, display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
          <CheckCircle size={18} />
          <div>
            <p style={{ fontWeight: 600 }}>✓ Report Submitted Successfully</p>
            <p style={{ fontSize: 12, marginTop: 2 }}>Thank you for helping keep our community safe. Our team will review your report.</p>
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: T.redDim, border: `1px solid ${T.red}`, color: T.red, padding: "16px 20px", borderRadius: 12, marginBottom: 24, display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
          <AlertCircle size={18} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Report Type Selection */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", marginBottom: 24, boxShadow: T.sh }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16, fontFamily: "'Syne',sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={18} style={{ color: T.brand }} />
            What type of threat are you reporting?
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {REPORT_TYPES.map((type) => (
              <label
                key={type.value}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "14px", borderRadius: 12,
                  border: `2px solid ${reportType === type.value ? T.brand : T.border}`, cursor: "pointer",
                  background: reportType === type.value ? T.brandGlow : T.bg, transition: "all 0.2s",
                }}
              >
                <input
                  type="radio"
                  value={type.value}
                  checked={reportType === type.value}
                  onChange={(e) => setReportType(e.target.value)}
                  style={{ marginTop: 3, cursor: "pointer" }}
                />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{type.label}</p>
                  <p style={{ fontSize: 11, color: T.textMd, marginTop: 2 }}>{type.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Severity Level */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", marginBottom: 24, boxShadow: T.sh }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16, fontFamily: "'Syne',sans-serif" }}>Severity Level</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {SEVERITY_LEVELS.map((level) => (
              <label
                key={level.value}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "14px", borderRadius: 12,
                  border: `2px solid ${severity === level.value ? level.color : T.border}`, cursor: "pointer",
                  background: severity === level.value ? `${level.color}15` : T.bg, transition: "all 0.2s",
                }}
              >
                <input
                  type="radio"
                  value={level.value}
                  checked={severity === level.value}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{ marginTop: 3, cursor: "pointer" }}
                />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: level.color }}>{level.label}</p>
                  <p style={{ fontSize: 11, color: T.textMd, marginTop: 2 }}>{level.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Report Details */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", marginBottom: 24, boxShadow: T.sh }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16, fontFamily: "'Syne',sans-serif" }}>Report Details</h3>

          {/* Subject */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8 }}>
              Subject <span style={{ color: T.red }}>*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the threat..."
              style={{
                width: "100%", padding: "12px 16px", border: `1px solid ${T.border}`, borderRadius: 10,
                fontSize: 13, fontFamily: "'Nunito',sans-serif", outline: "none",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8 }}>
              Description <span style={{ color: T.red }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about the threat and how you encountered it..."
              rows={6}
              style={{
                width: "100%", padding: "12px 16px", border: `1px solid ${T.border}`, borderRadius: 10,
                fontSize: 13, fontFamily: "'Nunito',sans-serif", outline: "none", resize: "vertical",
              }}
            />
          </div>

          {/* Evidence URL */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8 }}>Evidence URL (Optional)</label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://example.com/phishing-site (if applicable)"
              style={{
                width: "100%", padding: "12px 16px", border: `1px solid ${T.border}`, borderRadius: 10,
                fontSize: 13, fontFamily: "'Nunito',sans-serif", outline: "none",
              }}
            />
            <p style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>Do not interact with the link; paste it here for investigation</p>
          </div>

          {/* Reporter Email */}
          <div style={{ marginBottom: 0 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 12 }}>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <span style={{ fontSize: 12, fontWeight: 500, color: T.text }}>Submit anonymously</span>
            </label>

            {!anonymous && (
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8 }}>Your Email</label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  style={{
                    width: "100%", padding: "12px 16px", border: `1px solid ${T.border}`, borderRadius: 10,
                    fontSize: 13, fontFamily: "'Nunito',sans-serif", outline: "none",
                  }}
                />
                <p style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>We'll contact you if we need more details about this report</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1, padding: "14px 24px", borderRadius: 12, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${T.brand}, ${T.brandDark})`, color: "#fff",
              fontSize: 13, fontWeight: 600, fontFamily: "'Nunito',sans-serif",
              opacity: loading ? 0.7 : 1, transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Send size={16} />
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>

        {/* Privacy Notice */}
        <div style={{ background: T.bg, border: `1px dashed ${T.border}`, borderRadius: 10, padding: "14px", marginTop: 20, fontSize: 11, color: T.textMd, lineHeight: 1.6 }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>🔒 Your Privacy</p>
          All reports are confidential and processed by our security team. If you choose to report anonymously, your identity will be completely protected. We never share reporter information with third parties.
        </div>
      </form>
    </div>
  );
}
