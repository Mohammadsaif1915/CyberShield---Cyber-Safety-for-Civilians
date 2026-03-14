import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const css = `
  @keyframes fadeUp-cc    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse-cc     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  @keyframes float-cc     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes spin-cc      { to{transform:rotate(360deg)} }
  @keyframes successPop-cc{ 0%{transform:scale(.8);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

  .cc-fade { animation: fadeUp-cc .55s ease both; }

  .cc-nav { background:rgba(247,248,252,.92); backdrop-filter:blur(14px); border-bottom:1px solid #EAECF4; position:sticky; top:0; z-index:100; }
  .cc-nav-inner { max-width:1160px; margin:0 auto; padding:0 32px; height:64px; display:flex; align-items:center; justify-content:space-between; }
  .cc-logo { display:flex; align-items:center; gap:9px; font-family:'Syne',sans-serif; font-weight:800; font-size:19px; color:#0A0A1A; cursor:pointer; }
  .cc-nav-links { display:flex; gap:28px; font-size:13.5px; font-weight:500; color:#6B7280; }
  .cc-nav-links span { cursor:pointer; transition:color .2s; }
  .cc-nav-links span:hover,.cc-nav-links .cc-act { color:#0057FF; }
  .cc-nav-btn { background:#0057FF; color:#fff; border:none; padding:9px 20px; border-radius:100px; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .2s; }
  .cc-nav-btn:hover { background:#0045CC; transform:scale(1.03); }

  .cc-hero-split { display:grid; grid-template-columns:1fr 1fr; min-height:340px; }
  .cc-hero-left { background:linear-gradient(150deg,#0A0A1A 0%,#141430 100%); padding:72px 56px 64px; display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden; }
  .cc-hero-left::before { content:''; position:absolute; top:-80px; left:-80px; width:300px; height:300px; background:radial-gradient(circle,rgba(0,87,255,.15) 0%,transparent 70%); }
  .cc-hero-left::after  { content:''; position:absolute; bottom:-60px; right:-40px; width:220px; height:220px; background:radial-gradient(circle,rgba(108,92,231,.12) 0%,transparent 70%); }
  .cc-hero-right { background:linear-gradient(150deg,#EEF3FF 0%,#F7F8FC 100%); padding:72px 56px 64px; display:flex; flex-direction:column; justify-content:center; }
  .cc-badge-dark { display:inline-flex; align-items:center; gap:7px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); color:rgba(255,255,255,.8); padding:6px 14px; border-radius:100px; font-size:11.5px; font-weight:500; letter-spacing:.07em; text-transform:uppercase; margin-bottom:24px; width:fit-content; }
  .cc-badge-light { display:inline-flex; align-items:center; gap:7px; background:rgba(0,87,255,.08); border:1px solid rgba(0,87,255,.16); color:#0057FF; padding:6px 14px; border-radius:100px; font-size:11.5px; font-weight:500; letter-spacing:.07em; text-transform:uppercase; margin-bottom:24px; width:fit-content; }
  .cc-pulse-w { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.7); animation:pulse-cc 1.8s infinite; }
  .cc-pulse-b { width:6px; height:6px; border-radius:50%; background:#0057FF; animation:pulse-cc 1.8s infinite; }
  .cc-h1-dark { font-family:'Syne',sans-serif; font-size:clamp(28px,3.5vw,44px); font-weight:800; color:#fff; line-height:1.1; letter-spacing:-.03em; margin-bottom:14px; }
  .cc-h1-light { font-family:'Syne',sans-serif; font-size:clamp(22px,2.5vw,34px); font-weight:800; color:#0A0A1A; line-height:1.15; letter-spacing:-.02em; margin-bottom:14px; }
  .cc-hero-grad { background:linear-gradient(135deg,#60A5FA,#818CF8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .cc-hero-sub-dark  { font-size:15px; color:rgba(255,255,255,.6); line-height:1.7; max-width:400px; }
  .cc-hero-sub-light { font-size:14.5px; color:#545878; line-height:1.7; }

  .cc-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; max-width:1160px; margin:0 auto; padding:0 32px; transform:translateY(-32px); }
  .cc-card { background:#fff; border:1px solid #EAECF4; border-radius:20px; padding:28px 24px; cursor:pointer; transition:all .3s cubic-bezier(.22,1,.36,1); position:relative; overflow:hidden; }
  .cc-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--cc-c); transform:scaleX(0); transition:transform .35s ease; transform-origin:left; }
  .cc-card:hover::before { transform:scaleX(1); }
  .cc-card:hover { border-color:transparent; box-shadow:0 16px 40px rgba(0,0,0,.1); transform:translateY(-4px); }
  .cc-card-icon { width:50px; height:50px; border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:18px; transition:transform .3s; }
  .cc-card:hover .cc-card-icon { transform:scale(1.1) rotate(-4deg); }
  .cc-card-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; margin-bottom:6px; }
  .cc-card-desc { font-size:13.5px; color:#6B7280; line-height:1.6; margin-bottom:14px; }
  .cc-card-val { font-size:14px; font-weight:600; }
  .cc-res-badge { display:inline-flex; align-items:center; gap:5px; font-size:11.5px; color:#9099B8; margin-top:8px; }

  .cc-main { max-width:1160px; margin:0 auto; padding:8px 32px 80px; }
  .cc-two-col { display:grid; grid-template-columns:1.1fr .9fr; gap:48px; align-items:start; margin-top:16px; }
  .cc-slabel { font-size:11.5px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#0057FF; margin-bottom:8px; }
  .cc-stitle { font-family:'Syne',sans-serif; font-size:clamp(20px,2.5vw,26px); font-weight:800; letter-spacing:-.02em; margin-bottom:6px; }
  .cc-ssub { font-size:14px; color:#6B7280; margin-bottom:28px; line-height:1.6; }

  .cc-form-sec { background:#fff; border:1px solid #EAECF4; border-radius:24px; padding:44px 40px; }
  .cc-form-grp { margin-bottom:16px; }
  .cc-form-grp label { display:block; font-size:13px; font-weight:600; color:#374151; margin-bottom:7px; }
  .cc-form-grp label span { color:#E84393; margin-left:2px; }
  .cc-input { width:100%; padding:13px 16px; border:1.5px solid #E0E5F0; border-radius:12px; font-size:14.5px; font-family:'DM Sans',sans-serif; color:#0A0A1A; background:#FAFBFF; outline:none; transition:all .25s; }
  .cc-input:focus { border-color:#0057FF; background:#fff; box-shadow:0 0 0 3px rgba(0,87,255,.08); }
  .cc-input::placeholder { color:#B0B8D0; }
  textarea.cc-input { resize:vertical; min-height:120px; }
  select.cc-input { cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239099B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; }
  .cc-form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .cc-char { font-size:12px; color:#B0B8D0; text-align:right; margin-top:4px; }
  .cc-char.cc-warn { color:#FD7B00; }
  .cc-chips { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }
  .cc-chip { padding:7px 14px; border-radius:100px; font-size:12.5px; font-weight:500; border:1.5px solid #E0E5F0; background:#FAFBFF; cursor:pointer; transition:all .2s; color:#545878; }
  .cc-chip.cc-sel { background:rgba(0,87,255,.08); border-color:#0057FF; color:#0057FF; }
  .cc-sub-btn { width:100%; background:linear-gradient(135deg,#0057FF,#3B82F6); color:#fff; border:none; padding:16px; border-radius:14px; font-size:15px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .3s; display:flex; align-items:center; justify-content:center; gap:9px; margin-top:8px; }
  .cc-sub-btn:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(0,87,255,.35); }
  .cc-sub-btn:disabled { opacity:.55; cursor:not-allowed; transform:none; box-shadow:none; }
  .cc-reset-btn { margin-top:20px; background:none; border:1.5px solid #E0E5F0; border-radius:100px; padding:10px 24px; font-size:13.5px; font-weight:600; cursor:pointer; color:#545878; font-family:'DM Sans',sans-serif; transition:all .2s; }
  .cc-reset-btn:hover { border-color:#0057FF; color:#0057FF; }

  .cc-success { text-align:center; padding:32px 0; animation:successPop-cc .5s ease both; }
  .cc-success-icon { width:72px; height:72px; background:linear-gradient(135deg,#00B894,#00CEC9); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; animation:float-cc 3s ease-in-out infinite; }

  .cc-info-panel { display:flex; flex-direction:column; gap:20px; }
  .cc-info-card { background:#fff; border:1px solid #EAECF4; border-radius:18px; padding:24px 22px; }
  .cc-info-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; margin-bottom:4px; }
  .cc-info-sub { font-size:13px; color:#6B7280; margin-bottom:16px; line-height:1.5; }
  .cc-info-row { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid #F0F2F8; }
  .cc-info-row:last-child { border-bottom:none; padding-bottom:0; }
  .cc-info-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .cc-info-label { font-size:11.5px; color:#9099B8; font-weight:500; margin-bottom:2px; }
  .cc-info-val { font-size:14px; font-weight:600; color:#0A0A1A; }
  .cc-info-val a { color:#0057FF; text-decoration:none; }
  .cc-info-val a:hover { text-decoration:underline; }
  .cc-hours-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #F0F2F8; font-size:13.5px; }
  .cc-hours-row:last-of-type { border:none; }
  .cc-hours-day { color:#374151; font-weight:500; }
  .cc-hours-time { color:#0057FF; font-weight:600; }
  .cc-hours-closed { color:#9099B8; }
  .cc-online { margin-top:12px; background:rgba(0,184,148,.08); border:1px solid rgba(0,184,148,.2); border-radius:10px; padding:10px 14px; display:flex; align-items:center; gap:8px; font-size:13px; }
  .cc-online-dot { width:8px; height:8px; border-radius:50%; background:#00B894; animation:pulse-cc 2s infinite; }
  .cc-social-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .cc-social-btn { display:flex; align-items:center; gap:10px; padding:12px 14px; background:#F7F8FC; border:1.5px solid #EAECF4; border-radius:12px; cursor:pointer; transition:all .25s; text-decoration:none; }
  .cc-social-btn:hover { border-color:var(--sc); background:var(--sbg); transform:translateY(-2px); }
  .cc-social-name { font-size:13px; font-weight:600; color:#0A0A1A; }
  .cc-social-handle { font-size:11.5px; color:#9099B8; }
  .cc-map-mock { background:linear-gradient(135deg,#EEF3FF,#E5EDFF); border-radius:16px; height:130px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; margin-bottom:14px; }
  .cc-map-mock::before { content:''; position:absolute; inset:0; background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='1' fill='%230057FF' opacity='.15'/%3E%3C/svg%3E") repeat; }
  .cc-map-pin { width:40px; height:40px; background:#0057FF; border-radius:50% 50% 50% 0; transform:rotate(-45deg); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(0,87,255,.4); }
  .cc-map-pin svg { transform:rotate(45deg); }
  .cc-footer { text-align:center; margin-top:60px; color:#A0A5BC; font-size:13px; display:flex; align-items:center; justify-content:center; gap:6px; }

  @media(max-width:900px){ .cc-hero-split{grid-template-columns:1fr} .cc-hero-right{display:none} .cc-cards{grid-template-columns:1fr} .cc-two-col{grid-template-columns:1fr} .cc-form-row{grid-template-columns:1fr} }
`;

// ── ICONS ──────────────────────────────────────────────────────
const IEmail   = ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IPhone   = ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.61 4.5 2 2 0 0 1 3.58 2.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.77-1.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IMap     = ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IMapPin  = ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="10" r="3"/></svg>;
const IClock   = ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ISend    = ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const ILoader  = ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:'spin-cc 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const IShield  = ()=><svg width="24" height="24" viewBox="0 0 24 24" fill="#0057FF"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IShieldSm= ()=><svg width="15" height="15" viewBox="0 0 24 24" fill="#0057FF"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ITwitter = ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>;
const ILinkedIn= ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const IInsta   = ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>;
const IDiscord = ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>;
// ── END ICONS ──────────────────────────────────────────────────

const contactInfo=[
  {Icon:IEmail,color:'#0057FF',label:'Support Email',   val:'support@cybershield.app',link:'mailto:support@cybershield.app',sub:'For general queries & issues',badge:'Reply in ~24h'},
  {Icon:IPhone,color:'#00B894',label:'Phone / WhatsApp',val:'+91 98765 43210',          link:null,                            sub:'Mon-Fri, 10AM-6PM IST',        badge:'Instant response'},
  {Icon:IMap,  color:'#6C5CE7',label:'Headquarters',    val:'Mumbai, Maharashtra',      link:null,                            sub:'India 400001',                 badge:'Real-time chat'},
];
const socials=[
  {name:'Twitter / X',handle:'@CyberShieldApp',color:'#1DA1F2',bg:'rgba(29,161,242,.06)', Icon:ITwitter},
  {name:'LinkedIn',   handle:'CyberShield',    color:'#0A66C2',bg:'rgba(10,102,194,.06)',  Icon:ILinkedIn},
  {name:'Instagram',  handle:'@cybershield',   color:'#E1306C',bg:'rgba(225,48,108,.06)',  Icon:IInsta},
  {name:'Discord',    handle:'CyberShield',    color:'#5865F2',bg:'rgba(88,101,242,.06)',  Icon:IDiscord},
];
const topics=['General Inquiry','Technical Support','Feedback','Partnership','Press / Media','Career'];
const departments=['Select department','Technical Support','Content & Courses','Account & Billing','Partnerships','Press & Media','General'];

function ContactCyber(){
  const navigate=useNavigate();
  const [form,setForm]=useState({name:'',email:'',dept:'',msg:''});
  const [topic,setTopic]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [mounted,setMounted]=useState(false);
  const [charCount,setCharCount]=useState(0);
  const [savedEmail,setSavedEmail]=useState('');

  useEffect(()=>{
    const s=document.createElement('style');s.id='cc-styles';s.textContent=css;document.head.appendChild(s);
    setTimeout(()=>setMounted(true),50);
    return()=>{const el=document.getElementById('cc-styles');if(el)el.remove();};
  },[]);

  const handleMsg=e=>{setForm({...form,msg:e.target.value});setCharCount(e.target.value.length);};
  const handleSubmit=()=>{
    if(!form.name||!form.email||!form.msg)return;
    setSavedEmail(form.email);setSubmitting(true);
    setTimeout(()=>{setSubmitting(false);setSubmitted(true);},1800);
  };

  return(
    <div style={{background:'#F7F8FC',minHeight:'100vh',fontFamily:"'DM Sans',sans-serif",color:'#0A0A1A'}}>
      <nav className="cc-nav">
        <div className="cc-nav-inner">
          <div className="cc-logo" onClick={()=>navigate('/features')}><IShield/> CyberShield</div>
          <div className="cc-nav-links">
            <span onClick={()=>navigate('/features')}>Features</span>
            <span onClick={()=>navigate('/help')}>Help</span>
            <span className="cc-act">Contact</span>
          </div>
          <button className="cc-nav-btn">Get Started</button>
        </div>
      </nav>

      <div className="cc-hero-split" style={mounted?{animation:'fadeUp-cc .5s ease both'}:{}}>
        <div className="cc-hero-left">
          <div className="cc-badge-dark"><div className="cc-pulse-w"/>Contact Us</div>
          <h1 className="cc-h1-dark">We are here<br/><span className="cc-hero-grad">to help you.</span></h1>
          <p className="cc-hero-sub-dark">Reach out to our team for support, feedback, or partnership inquiries. We typically respond within 24 hours.</p>
          <div style={{display:'flex',gap:24,marginTop:32,flexWrap:'wrap'}}>
            {[['24h','Response Time'],['98%','Satisfaction'],['5K+','Users Helped']].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:'#fff',lineHeight:1}}>{n}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.5)',marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="cc-hero-right">
          <div className="cc-badge-light"><div className="cc-pulse-b"/>Live Support</div>
          <h2 className="cc-h1-light">Multiple ways<br/>to reach us</h2>
          <p className="cc-hero-sub-light">Whether it is a quick question or a complex issue, choose the channel that works best for you.</p>
          <div style={{display:'flex',gap:10,marginTop:24,flexWrap:'wrap'}}>
            {[{l:'Email',c:'#0057FF'},{l:'WhatsApp',c:'#00B894'},{l:'Discord',c:'#5865F2'}].map(i=>(
              <span key={i.l} style={{padding:'8px 16px',background:`${i.c}12`,border:`1.5px solid ${i.c}28`,borderRadius:100,fontSize:13,fontWeight:600,color:i.c}}>{i.l}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={`cc-cards ${mounted?'cc-fade':''}`} style={{animationDelay:'.15s'}}>
        {contactInfo.map((c,i)=>(
          <div key={i} className="cc-card" style={{'--cc-c':c.color}}>
            <div className="cc-card-icon" style={{background:`${c.color}12`,color:c.color}}><c.Icon/></div>
            <div className="cc-card-title">{c.label}</div>
            <div className="cc-card-desc">{c.sub}</div>
            <div className="cc-card-val" style={{color:c.color}}>
              {c.link?<a href={c.link} style={{color:c.color,textDecoration:'none'}}>{c.val}</a>:c.val}
            </div>
            <div className="cc-res-badge"><IClock/>{c.badge}</div>
          </div>
        ))}
      </div>

      <div className="cc-main">
        <div className="cc-two-col">
          <div className={`cc-form-sec ${mounted?'cc-fade':''}`} style={{animationDelay:'.2s'}}>
            <div className="cc-slabel">Send a Message</div>
            <div className="cc-stitle">Get in Touch</div>
            <div className="cc-ssub">Fill out the form and we will get back to you shortly.</div>

            {submitted?(
              <div className="cc-success">
                <div className="cc-success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,marginBottom:10}}>Message Sent! 🎉</div>
                <p style={{color:'#6B7280',fontSize:15,lineHeight:1.7,marginBottom:24}}>
                  Thanks for reaching out. Our team will respond to <strong style={{color:'#0057FF'}}>{savedEmail}</strong> within 24 hours.
                </p>
                <div style={{background:'#F0F4FF',borderRadius:14,padding:'16px 20px',textAlign:'left'}}>
                  <div style={{color:'#9099B8',fontSize:12,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:8}}>Reference ID</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#0057FF',fontSize:18}}>#CS-{Math.floor(Math.random()*900000+100000)}</div>
                </div>
                <button className="cc-reset-btn" onClick={()=>{setSubmitted(false);setForm({name:'',email:'',dept:'',msg:''});setCharCount(0);}}>Send Another Message</button>
              </div>
            ):(
              <div>
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:10}}>What is this about?</div>
                  <div className="cc-chips">
                    {topics.map(t=><div key={t} className={`cc-chip ${topic===t?'cc-sel':''}`} onClick={()=>setTopic(topic===t?'':t)}>{t}</div>)}
                  </div>
                </div>
                <div className="cc-form-row">
                  <div className="cc-form-grp">
                    <label>Full Name <span>*</span></label>
                    <input className="cc-input" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                  </div>
                  <div className="cc-form-grp">
                    <label>Email <span>*</span></label>
                    <input className="cc-input" type="email" placeholder="you@gmail.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                  </div>
                </div>
                <div className="cc-form-grp">
                  <label>Department</label>
                  <select className="cc-input" value={form.dept} onChange={e=>setForm({...form,dept:e.target.value})}>
                    {departments.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="cc-form-grp">
                  <label>Your Message <span>*</span></label>
                  <textarea className="cc-input" placeholder="Tell us what is on your mind..." value={form.msg} onChange={handleMsg} maxLength={500}/>
                  <div className={`cc-char ${charCount>400?'cc-warn':''}`}>{charCount}/500</div>
                </div>
                <button className="cc-sub-btn" onClick={handleSubmit} disabled={submitting||!form.name||!form.email||!form.msg}>
                  {submitting?<span style={{display:'flex',alignItems:'center',gap:8}}><ILoader/>Sending...</span>:<span style={{display:'flex',alignItems:'center',gap:8}}><ISend/>Send Message</span>}
                </button>
              </div>
            )}
          </div>

          <div className={`cc-info-panel ${mounted?'cc-fade':''}`} style={{animationDelay:'.28s'}}>
            <div className="cc-info-card">
              <div className="cc-info-title">Direct Contact</div>
              <div className="cc-info-sub">Prefer a direct line? Here is how to reach us</div>
              {contactInfo.map((c,i)=>(
                <div key={i} className="cc-info-row">
                  <div className="cc-info-icon" style={{background:`${c.color}12`,color:c.color}}><c.Icon/></div>
                  <div>
                    <div className="cc-info-label">{c.label}</div>
                    <div className="cc-info-val">{c.link?<a href={c.link}>{c.val}</a>:c.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cc-info-card">
              <div className="cc-info-title">Support Hours</div>
              <div className="cc-info-sub">Our team is available during these times (IST)</div>
              {[['Monday - Friday','10:00 AM - 7:00 PM',false],['Saturday','11:00 AM - 4:00 PM',false],['Sunday','Closed',true]].map(([d,t,c])=>(
                <div key={d} className="cc-hours-row">
                  <span className="cc-hours-day">{d}</span>
                  <span className={c?'cc-hours-closed':'cc-hours-time'}>{t}</span>
                </div>
              ))}
              <div className="cc-online">
                <div className="cc-online-dot"/>
                <span style={{color:'#00B894',fontWeight:600}}>Currently Online</span>
                <span style={{color:'#6B7280'}}>Typical reply in 2 hours</span>
              </div>
            </div>

            <div className="cc-info-card">
              <div className="cc-info-title">Find Us Online</div>
              <div className="cc-info-sub">Follow for tips, updates and community</div>
              <div className="cc-social-grid">
                {socials.map(s=>(
                  <a key={s.name} href="#" className="cc-social-btn" style={{'--sc':s.color,'--sbg':s.bg}}>
                    <span style={{color:s.color}}><s.Icon/></span>
                    <div>
                      <div className="cc-social-name">{s.name}</div>
                      <div className="cc-social-handle">{s.handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="cc-info-card">
              <div className="cc-info-title">Our Location</div>
              <div className="cc-map-mock"><div className="cc-map-pin"><IMapPin/></div></div>
              <div style={{fontSize:14,color:'#374151',fontWeight:500}}>Mumbai, Maharashtra, India</div>
              <div style={{fontSize:13,color:'#9099B8',marginTop:4}}>400001 - Available remotely worldwide</div>
            </div>
          </div>
        </div>

        <div className="cc-footer"><IShieldSm/> CyberShield - Built with love to keep you cyber safe - 2025</div>
      </div>
    </div>
  );
}

export default ContactCyber;
