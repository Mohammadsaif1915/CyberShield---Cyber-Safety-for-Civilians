import { useState } from "react";
import {
  ShieldAlert, ChevronDown, ChevronUp, ExternalLink,
  AlertTriangle, Wifi, Bug, Mail,
  Activity, Search, Target
} from "lucide-react";

const C = {
  bg: "#050810",
  bgCard: "#0C1120",
  border: "rgba(99,102,241,0.18)",
  brand: "#6366F1",
  teal: "#14B8A6",
  violet: "#A78BFA",
  green: "#10B981",
  text: "#F1F5F9",
  textMd: "#94A3B8",
  textDim: "#475569",
};

const SEV = {
  Critical: { c: "#EF4444", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.30)", glow: "rgba(239,68,68,0.15)" },
  High:     { c: "#F97316", bg: "rgba(249,115,22,0.10)", border: "rgba(249,115,22,0.30)", glow: "rgba(249,115,22,0.12)" },
  Medium:   { c: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.30)", glow: "rgba(245,158,11,0.10)" },
  Low:      { c: "#10B981", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.30)", glow: "rgba(16,185,129,0.10)" },
};

const TYPE_ICONS = {
  Ransomware: Bug, APT: Target, Vulnerability: AlertTriangle,
  Phishing: Mail, Network: Wifi, Malware: Bug, DDoS: Activity,
};

const THREATS = [
  {
    id: 1, name: "LockBit 3.0 Ransomware", type: "Ransomware", sev: "Critical", date: "Jan 13",
    desc: "Most prolific RaaS operation targeting Indian enterprises. Self-propagation via SMB protocol exploitation, exfiltrates data before encryption. Average ransom demand: ₹85 lakh. Uses triple extortion: encrypt, exfiltrate, DDoS.",
    iocs: ["C2: 185.220.101.x", "Hash: a1b2c3d4e5...", "Domain: lockbit3[.]xyz"],
    mitre: ["T1486 - Data Encrypted for Impact", "T1021.002 - SMB/Windows Admin Shares", "T1567.002 - Exfil to Cloud Storage"],
    cve: "CVE-2021-34527", affected: "Windows Server 2012-2022", patch: "Available",
  },
  {
    id: 2, name: "APT-29 (Cozy Bear)", type: "APT", sev: "Critical", date: "Jan 14",
    desc: "Russian state-sponsored threat actor linked to SVR. Known for stealthy, long-term espionage campaigns. Uses SUNBURST malware for supply chain attacks. Recent activity targeting Indian government contractors.",
    iocs: ["IP: 45.142.212.x", "Mutex: Global\\{GUID}", "Reg: HKLM\\System\\..."],
    mitre: ["T1195.002 - Compromise Software Supply Chain", "T1059.001 - PowerShell", "T1078 - Valid Accounts"],
    cve: "CVE-2020-10148", affected: "SolarWinds Orion, Gov networks", patch: "Critical - Patch Now",
  },
  {
    id: 3, name: "Log4Shell (CVE-2021-44228)", type: "Vulnerability", sev: "High", date: "Jan 12",
    desc: "Remote Code Execution via JNDI injection in Apache Log4j2 versions 2.0-2.14.1. Still actively exploited in unpatched Indian enterprise Java applications. Trivial to exploit, no authentication required. CVSS: 10.0.",
    iocs: ["Payload: ${jndi:ldap://...}", "Port: 1389 (LDAP)", "User-Agent: PoC string"],
    mitre: ["T1190 - Exploit Public-Facing Application", "T1059 - Command and Scripting Interpreter"],
    cve: "CVE-2021-44228", affected: "Log4j2 < 2.17.1", patch: "Upgrade to 2.17.1+",
  },
  {
    id: 4, name: "BEC — CFO Impersonation", type: "Phishing", sev: "Medium", date: "Jan 09",
    desc: "Business Email Compromise targeting Indian fintech CFOs. AI-generated voice follow-ups. Average loss: ₹28 lakh. Attackers compromise exec email via credential stuffing, request overseas wire transfers.",
    iocs: ["Sender domain lookalike", "IBAN: XX94...", "Urgency keywords in subject"],
    mitre: ["T1566.002 - Spearphishing Link", "T1534 - Internal Spearphishing"],
    cve: "N/A", affected: "Finance & Fintech orgs", patch: "Enable DMARC/SPF/DKIM",
  },
  {
    id: 5, name: "SSH Brute-Force Campaign", type: "Network", sev: "Low", date: "Jan 07",
    desc: "Coordinated SSH brute-force from 312 Tor exit nodes targeting Indian cloud infrastructure. 45,000+ attempts/day. Targets default credentials on Ubuntu/CentOS. Mitigate with fail2ban and IP reputation feeds.",
    iocs: ["Source: Tor exit nodes", "Port: 22/TCP", "Tool: Hydra/Medusa signature"],
    mitre: ["T1110.001 - Password Guessing", "T1021.004 - SSH"],
    cve: "N/A", affected: "Linux cloud servers", patch: "Use SSH keys, disable passwords",
  },
  {
    id: 6, name: "Mirai Botnet Variant", type: "DDoS", sev: "Medium", date: "Jan 05",
    desc: "New Mirai variant targeting Indian IoT — routers, CCTV cameras. DDoS attacks peaking at 400 Gbps. Exploits default credentials and Telnet vulnerabilities on embedded Linux devices.",
    iocs: ["Port: 23, 2323 (Telnet)", "Traffic: SYN flood pattern", "C2: 194.165.x.x"],
    mitre: ["T1498 - Network Denial of Service", "T1584.005 - Botnet"],
    cve: "CVE-2022-26258", affected: "IoT / Home routers", patch: "Change creds, disable Telnet",
  },
];

const Tag = ({ label, color, bg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center",
    padding: "2px 7px", borderRadius: 5,
    fontSize: 10, fontWeight: 700,
    fontFamily: "JetBrains Mono, monospace",
    letterSpacing: "0.03em",
    background: bg || color + "18", color,
    border: `1px solid ${color}28`,
    whiteSpace: "nowrap", flexShrink: 0,
  }}>
    {label}
  </span>
);

export default function ThreatsPage({ stats = {}, onThreatView = () => {} }) {
  const [filter, setSev]      = useState("All");
  const [typeFilter, setType] = useState("All");
  const [expanded, setExp]    = useState(null);
  const [search, setSearch]   = useState("");

  const allTypes = ["All", ...new Set(THREATS.map(t => t.type))];

  const list = THREATS.filter(t =>
    (filter === "All" || t.sev === filter) &&
    (typeFilter === "All" || t.type === typeFilter) &&
    (search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExpand = (t) => {
    const opening = expanded !== t.id;
    setExp(opening ? t.id : null);
    if (opening) onThreatView(t.id, t.name);
  };

  const sevCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  THREATS.forEach(t => sevCounts[t.sev]++);

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: "12px 14px 32px",
      boxSizing: "border-box",
      width: "100%",
      maxWidth: "100%",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes pulseRed { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .tp { animation:fadeUp .28s ease both; }

        /* sev grid always 2 col */
        .sev-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }

        /* chip scroll row */
        .chip-row { display:flex; gap:6px; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; padding-bottom:2px; }
        .chip-row::-webkit-scrollbar { display:none; }
        .chip { flex-shrink:0; padding:5px 13px; border-radius:20px; font-size:11px; font-weight:600; cursor:pointer; border:1px solid; font-family:inherit; white-space:nowrap; transition:all .15s; background:transparent; }

        /* threat card */
        .t-card { border-radius:14px; overflow:hidden; transition:border-color .2s,box-shadow .2s; }

        /* card tap row */
        .c-row { display:flex; align-items:flex-start; gap:10px; padding:12px 12px; cursor:pointer; }

        /* text block must clip */
        .c-body { flex:1; min-width:0; }

        /* name: ellipsis if needed */
        .c-name { font-size:13px; font-weight:700; color:#F1F5F9; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:0 0 4px; }

        /* tags row */
        .c-tags { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:5px; }

        /* desc clamp */
        .c-desc { font-size:12px; color:#94A3B8; line-height:1.55; margin:0;
                  overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
        .c-desc.full { display:block; }

        /* chevron col */
        .c-chev { display:flex; flex-direction:column; align-items:center; gap:5px; flex-shrink:0; }

        /* detail block */
        .d-sec { border-radius:11px; padding:11px 12px; margin-bottom:8px; }
        .d-lbl { font-size:9px; font-weight:700; font-family:"JetBrains Mono",monospace; letter-spacing:.08em; margin:0 0 7px; }
        .d-ln  { font-size:11px; color:#94A3B8; margin:3px 0; word-break:break-all; line-height:1.5; }

        /* actions */
        .a-row { display:flex; gap:6px; }
        .a-btn { flex:1; display:inline-flex; align-items:center; justify-content:center; gap:4px;
                 padding:6px 8px; border-radius:8px; font-size:11px; font-weight:600;
                 border:1px solid rgba(99,102,241,0.22); background:transparent;
                 cursor:pointer; font-family:inherit; color:#94A3B8; transition:all .15s; }
        .a-btn:hover { border-color:rgba(99,102,241,0.5); color:#6366F1; }
      `}</style>

      <div className="tp">

        {/* ── INFO STRIP ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, gap:8 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <Tag label={`${stats.threatsViewed?.length || 0} analyzed`} color={C.teal} bg="rgba(20,184,166,0.09)" />
            <Tag label={`${THREATS.length} active threats`} color={C.violet} bg="rgba(167,139,250,0.09)" />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:99, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.22)", flexShrink:0 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#EF4444", animation:"pulseRed 1.5s infinite" }} />
            <span style={{ fontSize:9, fontWeight:700, color:"#EF4444", letterSpacing:"0.1em", fontFamily:"JetBrains Mono,monospace" }}>LIVE</span>
          </div>
        </div>

        {/* ── SEV GRID 2×2 ── */}
        <div className="sev-grid">
          {Object.entries(sevCounts).map(([sev, count]) => {
            const sc = SEV[sev];
            const active = filter === sev;
            return (
              <button key={sev} onClick={() => setSev(active ? "All" : sev)}
                style={{ padding:"13px 8px", border:`1px solid ${active ? sc.border : C.border}`, borderRadius:13, textAlign:"center", cursor:"pointer", background: active ? sc.bg : C.bgCard, fontFamily:"inherit", transition:"all .2s", boxShadow: active ? `0 0 16px ${sc.glow}` : "none" }}>
                <div style={{ fontSize:26, fontWeight:800, color:sc.c, fontFamily:"Syne,sans-serif", lineHeight:1 }}>{count}</div>
                <div style={{ fontSize:11, color:C.textMd, marginTop:3, fontWeight:600 }}>{sev}</div>
                <div style={{ width:16, height:2, background:sc.c, borderRadius:99, margin:"5px auto 0", opacity: active ? 1 : 0.3 }} />
              </button>
            );
          })}
        </div>

        {/* ── SEARCH ── */}
        <div style={{ position:"relative", marginBottom:10 }}>
          <Search size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:C.textDim, pointerEvents:"none" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search threats…"
            style={{ width:"100%", boxSizing:"border-box", padding:"9px 12px 9px 32px", borderRadius:11, border:`1px solid ${C.border}`, background:C.bgCard, color:C.text, fontSize:13, fontFamily:"inherit", outline:"none" }}
          />
        </div>

        {/* ── TYPE CHIPS ── */}
        <div className="chip-row" style={{ marginBottom:12 }}>
          {allTypes.map(t => (
            <button key={t} onClick={() => setType(t)} className="chip"
              style={{ borderColor: typeFilter===t ? C.brand+"55" : C.border, background: typeFilter===t ? "rgba(99,102,241,0.12)" : "transparent", color: typeFilter===t ? C.brand : C.textMd }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── CARDS ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {list.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px 20px", background:C.bgCard, borderRadius:14, border:`1px solid ${C.border}` }}>
              <ShieldAlert size={26} style={{ color:C.textDim, marginBottom:8 }} />
              <p style={{ color:C.textMd, fontSize:13, margin:0 }}>No threats match your filter</p>
            </div>
          )}

          {list.map(t => {
            const sc   = SEV[t.sev];
            const open = expanded === t.id;
            const viewed = stats.threatsViewed?.includes(t.id);
            const Icon = TYPE_ICONS[t.type] || AlertTriangle;

            return (
              <div key={t.id} className="t-card"
                style={{ background:C.bgCard, border:`1px solid ${open ? sc.border : C.border}`, boxShadow: open ? `0 0 20px ${sc.glow}` : "none" }}>

                {/* accent */}
                <div style={{ height:2, background:`linear-gradient(90deg,${sc.c},${sc.c}30)` }} />

                {/* tap row */}
                <div className="c-row" onClick={() => handleExpand(t)}>

                  {/* icon */}
                  <div style={{ width:34, height:34, borderRadius:9, background:sc.bg, border:`1px solid ${sc.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                    <Icon size={15} style={{ color:sc.c }} />
                  </div>

                  {/* body */}
                  <div className="c-body">
                    {/* name row */}
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4, overflow:"hidden" }}>
                      <p className="c-name">{t.name}</p>
                      <Tag label={t.sev} color={sc.c} bg={sc.bg} />
                      {viewed && <Tag label="✓" color={C.green} bg="rgba(16,185,129,0.09)" />}
                    </div>
                    {/* secondary tags */}
                    <div className="c-tags">
                      <Tag label={t.type} color={C.textMd} bg="rgba(255,255,255,0.05)" />
                      {t.cve !== "N/A" && <Tag label={t.cve} color={C.violet} bg="rgba(167,139,250,0.09)" />}
                    </div>
                    {/* description */}
                    <p className={`c-desc${open ? " full" : ""}`}>{t.desc}</p>
                  </div>

                  {/* chevron */}
                  <div className="c-chev">
                    <div style={{ width:24, height:24, borderRadius:7, background:sc.bg, border:`1px solid ${sc.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {open ? <ChevronUp size={12} style={{ color:sc.c }} /> : <ChevronDown size={12} style={{ color:sc.c }} />}
                    </div>
                    <span style={{ fontSize:9, color:C.textDim, fontFamily:"JetBrains Mono,monospace" }}>{t.date}</span>
                  </div>
                </div>

                {/* expanded */}
                {open && (
                  <div style={{ padding:"0 12px 14px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>

                    <p style={{ fontSize:13, color:C.textMd, lineHeight:1.7, margin:"12px 0" }}>{t.desc}</p>

                    <div className="d-sec" style={{ background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.15)" }}>
                      <p className="d-lbl" style={{ color:"#EF4444" }}>INDICATORS OF COMPROMISE</p>
                      {t.iocs.map((v,i) => <p key={i} className="d-ln" style={{ fontFamily:"JetBrains Mono,monospace" }}>{v}</p>)}
                    </div>

                    <div className="d-sec" style={{ background:"rgba(99,102,241,0.05)", border:"1px solid rgba(99,102,241,0.15)" }}>
                      <p className="d-lbl" style={{ color:C.brand }}>MITRE ATT&CK</p>
                      {t.mitre.map((v,i) => <p key={i} className="d-ln">{v}</p>)}
                    </div>

                    <div className="d-sec" style={{ background:"rgba(16,185,129,0.05)", border:"1px solid rgba(16,185,129,0.15)", marginBottom:12 }}>
                      <p className="d-lbl" style={{ color:C.green }}>REMEDIATION</p>
                      <p className="d-ln">Affected: <strong style={{ color:C.text }}>{t.affected}</strong></p>
                      <p className="d-ln">Patch: <strong style={{ color: t.patch.includes("Now") ? "#EF4444" : C.green }}>{t.patch}</strong></p>
                    </div>

                    <div className="a-row">
                      {["Full Report","MITRE","Export IOCs"].map(b => (
                        <button key={b} className="a-btn">
                          <ExternalLink size={10} />{b}
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize:11, color:C.green, fontFamily:"JetBrains Mono,monospace", fontWeight:600, textAlign:"center", margin:"10px 0 0" }}>+10 XP earned</p>

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