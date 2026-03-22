import { useState } from "react";
import {
  ShieldAlert, ChevronDown, ChevronUp, ExternalLink,
  AlertTriangle, Wifi, Bug, Mail, Database, Globe,
  Eye, TrendingUp, Clock, Filter, Search, RefreshCw,
  Zap, Activity, Target
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

const SEV_CONFIG = {
  Critical: { c: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", glow: "rgba(239,68,68,0.15)" },
  High: { c: "#F97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.25)", glow: "rgba(249,115,22,0.12)" },
  Medium: { c: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", glow: "rgba(245,158,11,0.1)" },
  Low: { c: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", glow: "rgba(16,185,129,0.1)" },
};

const TYPE_ICONS = {
  Ransomware: Bug,
  APT: Target,
  Vulnerability: AlertTriangle,
  Phishing: Mail,
  Network: Wifi,
  Malware: Bug,
  DDoS: Activity,
};

const THREATS = [
  {
    id: 1, name: "LockBit 3.0 Ransomware", type: "Ransomware", sev: "Critical", date: "Jan 13",
    desc: "Most prolific RaaS operation targeting Indian enterprises. Self-propagation via SMB protocol exploitation, exfiltrates data before encryption. Average ransom demand: ₹85 lakh. Uses triple extortion: encrypt, exfiltrate, DDoS.",
    iocs: ["C2: 185.220.101.x", "Hash: a1b2c3d4e5...", "Domain: lockbit3[.]xyz"],
    mitre: ["T1486 - Data Encrypted for Impact", "T1021.002 - SMB/Windows Admin Shares", "T1567.002 - Exfiltration to Cloud Storage"],
    cve: "CVE-2021-34527", affected: "Windows Server 2012-2022", patch: "Available",
  },
  {
    id: 2, name: "APT-29 (Cozy Bear)", type: "APT", sev: "Critical", date: "Jan 14",
    desc: "Russian state-sponsored threat actor linked to SVR. Known for stealthy, long-term espionage campaigns. Uses SUNBURST malware for supply chain attacks. Recent activity targeting Indian government contractors and defense suppliers.",
    iocs: ["IP: 45.142.212.x", "Mutex: Global\\{GUID}", "Reg key: HKLM\\System\\..."],
    mitre: ["T1195.002 - Compromise Software Supply Chain", "T1059.001 - PowerShell", "T1078 - Valid Accounts"],
    cve: "CVE-2020-10148", affected: "SolarWinds Orion, Gov networks", patch: "Critical - Patch Now",
  },
  {
    id: 3, name: "Log4Shell (CVE-2021-44228)", type: "Vulnerability", sev: "High", date: "Jan 12",
    desc: "Remote Code Execution via JNDI injection in Apache Log4j2 versions 2.0-2.14.1. Still actively exploited in unpatched Indian enterprise Java applications. Trivial to exploit, requires no authentication. CVSS score: 10.0.",
    iocs: ["Payload: ${jndi:ldap://...}", "Port: 1389 (LDAP)", "User-Agent: PoC string"],
    mitre: ["T1190 - Exploit Public-Facing Application", "T1059 - Command and Scripting Interpreter"],
    cve: "CVE-2021-44228", affected: "Log4j2 < 2.17.1", patch: "Upgrade to 2.17.1+",
  },
  {
    id: 4, name: "BEC — CFO Impersonation", type: "Phishing", sev: "Medium", date: "Jan 09",
    desc: "Business Email Compromise targeting Indian fintech CFOs. AI-generated voice messages used as follow-up. Average financial loss: ₹28 lakh. Attackers compromise exec email via credential stuffing, then request wire transfers to overseas accounts.",
    iocs: ["Sender domain lookalike", "IBAN: XX94...", "Urgency keywords in subject"],
    mitre: ["T1566.002 - Spearphishing Link", "T1534 - Internal Spearphishing"],
    cve: "N/A", affected: "Finance & Fintech orgs", patch: "Enable email authentication (DMARC/SPF)",
  },
  {
    id: 5, name: "SSH Brute-Force Campaign", type: "Network", sev: "Low", date: "Jan 07",
    desc: "Coordinated SSH brute-force from 312 Tor exit nodes hitting Indian cloud infrastructure. 45,000+ attempts/day detected. Targeting default credentials on Ubuntu/CentOS boxes. Block via fail2ban + IP reputation feeds.",
    iocs: ["Source: Tor exit nodes", "Port: 22/TCP", "Tool: Hydra/Medusa signature"],
    mitre: ["T1110.001 - Password Guessing", "T1021.004 - SSH"],
    cve: "N/A", affected: "Linux cloud servers", patch: "Disable password auth, use SSH keys",
  },
  {
    id: 6, name: "Mirai Botnet Variant", type: "DDoS", sev: "Medium", date: "Jan 05",
    desc: "New Mirai variant targeting IoT devices in India — routers, CCTV cameras. Recruited devices used for DDoS attacks peaking at 400 Gbps. Exploits default credentials and Telnet vulnerabilities on embedded Linux devices.",
    iocs: ["Port: 23, 2323 (Telnet)", "Traffic: SYN flood pattern", "C2: 194.165.x.x"],
    mitre: ["T1498 - Network Denial of Service", "T1584.005 - Botnet"],
    cve: "CVE-2022-26258", affected: "IoT / Home routers", patch: "Change default credentials, disable Telnet",
  },
];

const Tag = ({ label, color, bg }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.04em", background: bg || color + "14", color, border: `1px solid ${color}25` }}>
    {label}
  </span>
);

export default function ThreatsPage({ stats, onThreatView }) {
  const [filter, setSev] = useState("All");
  const [typeFilter, setType] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");

  const allTypes = ["All", ...new Set(THREATS.map(t => t.type))];
  const list = THREATS.filter(t =>
    (filter === "All" || t.sev === filter) &&
    (typeFilter === "All" || t.type === typeFilter) &&
    (search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExpand = (t) => {
    const opening = expanded !== t.id;
    setExpanded(opening ? t.id : null);
    if (opening) onThreatView(t.id, t.name);
  };

  const sevCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  THREATS.forEach(t => sevCounts[t.sev]++);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseRed{0%,100%{box-shadow:0 0 6px rgba(239,68,68,0.6)}50%{box-shadow:0 0 16px rgba(239,68,68,0.9)}}
        .threat-page{animation:fadeUp .3s ease both}
      `}</style>

      <div className="threat-page">

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldAlert size={20} style={{ color: "#EF4444" }} />
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>Threat Intelligence</h1>
                <p style={{ fontSize: 12, color: C.textMd, margin: 0 }}>Real-time IOCs · MITRE ATT&CK mapping · Security advisories</p>
              </div>
            </div>
            {/* Live badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", animation: "pulseRed 1.5s infinite" }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: "#EF4444", letterSpacing: "0.1em", fontFamily: "JetBrains Mono, monospace" }}>LIVE FEED</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Tag label={`${stats.threatsViewed?.length || 0} analyzed by you`} color={C.teal} bg="rgba(20,184,166,0.08)" />
            <Tag label={`${THREATS.length} active threats`} color={C.violet} bg="rgba(167,139,250,0.08)" />
          </div>
        </div>

        {/* ── SEVERITY CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
          {Object.entries(sevCounts).map(([sev, count]) => {
            const sc = SEV_CONFIG[sev];
            const active = filter === sev;
            return (
              <button key={sev} onClick={() => setSev(active ? "All" : sev)}
                style={{ padding: "16px", border: `1px solid ${active ? sc.border : C.border}`, borderRadius: 16, textAlign: "center", cursor: "pointer", background: active ? sc.bg : C.bgCard, fontFamily: "inherit", transition: "all .2s", boxShadow: active ? `0 0 20px ${sc.glow}` : "none" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = sc.border; e.currentTarget.style.boxShadow = `0 0 16px ${sc.glow}`; }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; } }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: sc.c, fontFamily: "Syne, sans-serif", lineHeight: 1 }}>{count}</div>
                <div style={{ fontSize: 11, color: C.textMd, marginTop: 4, fontWeight: 600 }}>{sev}</div>
                <div style={{ width: 20, height: 2, background: sc.c, borderRadius: 99, margin: "6px auto 0", opacity: active ? 1 : 0.3 }} />
              </button>
            );
          })}
        </div>

        {/* ── FILTERS + SEARCH ── */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textDim }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threats..."
              style={{ width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bgCard, color: C.text, fontSize: 12, boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {allTypes.map(t => (
              <button key={t} onClick={() => setType(t)}
                style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", border: `1px solid ${typeFilter === t ? C.brand + "50" : C.border}`, background: typeFilter === t ? "rgba(99,102,241,0.1)" : "transparent", color: typeFilter === t ? C.brand : C.textMd, transition: "all .15s", fontFamily: "inherit" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── THREAT CARDS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", background: C.bgCard, borderRadius: 16, border: `1px solid ${C.border}` }}>
              <ShieldAlert size={32} style={{ color: C.textDim, marginBottom: 12 }} />
              <p style={{ color: C.textMd, fontSize: 14 }}>No threats match your filter</p>
            </div>
          )}
          {list.map((t, idx) => {
            const sc = SEV_CONFIG[t.sev];
            const open = expanded === t.id;
            const viewed = stats.threatsViewed?.includes(t.id);
            const TypeIcon = TYPE_ICONS[t.type] || AlertTriangle;
            return (
              <div key={t.id}
                style={{ background: C.bgCard, border: `1px solid ${open ? sc.border : C.border}`, borderRadius: 16, overflow: "hidden", transition: "all .22s", boxShadow: open ? `0 0 30px ${sc.glow}` : "none" }}>
                {/* Accent line */}
                <div style={{ height: 2, background: `linear-gradient(90deg, ${sc.c}, ${sc.c}40)` }} />
                {/* Header row */}
                <div style={{ padding: "14px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
                  onClick={() => handleExpand(t)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: sc.bg, border: `1px solid ${sc.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <TypeIcon size={16} style={{ color: sc.c }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.name}</span>
                        <Tag label={t.sev} color={sc.c} bg={sc.bg} />
                        <Tag label={t.type} color={C.textMd} bg="rgba(255,255,255,0.04)" />
                        {viewed && <Tag label="✓ Analyzed" color={C.green} bg="rgba(16,185,129,0.08)" />}
                        {t.cve !== "N/A" && <Tag label={t.cve} color={C.violet} bg="rgba(167,139,250,0.08)" />}
                      </div>
                      <p style={{ fontSize: 12, color: C.textMd, margin: 0 }}>{open ? t.desc : t.desc.slice(0, 100) + "..."}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: C.textDim, fontFamily: "JetBrains Mono, monospace" }}>{t.date}</span>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: sc.bg, border: `1px solid ${sc.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {open ? <ChevronUp size={13} style={{ color: sc.c }} /> : <ChevronDown size={13} style={{ color: sc.c }} />}
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {open && (
                  <div style={{ padding: "0 20px 20px", borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                    <p style={{ fontSize: 13, color: C.textMd, lineHeight: 1.75, margin: "14px 0 16px" }}>{t.desc}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                      {/* IOCs */}
                      <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 12, padding: 14 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", margin: "0 0 8px", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.07em" }}>INDICATORS OF COMPROMISE</p>
                        {t.iocs.map((ioc, i) => <p key={i} style={{ fontSize: 11, color: C.textMd, margin: "3px 0", fontFamily: "JetBrains Mono, monospace" }}>{ioc}</p>)}
                      </div>
                      {/* MITRE */}
                      <div style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 12, padding: 14 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: C.brand, margin: "0 0 8px", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.07em" }}>MITRE ATT&CK</p>
                        {t.mitre.map((m, i) => <p key={i} style={{ fontSize: 10, color: C.textMd, margin: "3px 0" }}>{m}</p>)}
                      </div>
                      {/* Patch info */}
                      <div style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 12, padding: 14 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: C.green, margin: "0 0 8px", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.07em" }}>REMEDIATION</p>
                        <p style={{ fontSize: 11, color: C.textMd, margin: "0 0 4px" }}>Affected: <strong style={{ color: C.text }}>{t.affected}</strong></p>
                        <p style={{ fontSize: 11, color: C.textMd, margin: "0 0 4px" }}>Patch: <strong style={{ color: t.patch.includes("Now") ? "#EF4444" : C.green }}>{t.patch}</strong></p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {["Full Report", "MITRE ATT&CK", "Export IOCs"].map(b => (
                        <button key={b} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9, fontSize: 11, fontWeight: 600, border: `1px solid ${C.border}`, background: "transparent", color: C.textMd, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand + "50"; e.currentTarget.style.color = C.brand; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMd; }}>
                          <ExternalLink size={10} />{b}
                        </button>
                      ))}
                      <span style={{ fontSize: 11, color: C.green, marginLeft: "auto", fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>+10 XP earned</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}