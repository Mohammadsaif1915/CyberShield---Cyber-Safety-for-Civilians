import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const css = `
  @keyframes fadeUp-hc    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse-hc     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  @keyframes slideDown-hc { from{opacity:0;max-height:0} to{opacity:1;max-height:600px} }
  @keyframes spin-hc      { to{transform:rotate(360deg)} }
  @keyframes progBar-hc   { from{width:0} to{width:100%} }

  .hc-fade { animation: fadeUp-hc .55s ease both; }

  .hc-nav { background:rgba(247,248,252,.92); backdrop-filter:blur(14px); border-bottom:1px solid #EAECF4; position:sticky; top:0; z-index:100; }
  .hc-nav-inner { max-width:1160px; margin:0 auto; padding:0 32px; height:64px; display:flex; align-items:center; justify-content:space-between; }
  .hc-logo { display:flex; align-items:center; gap:9px; font-family:'Syne',sans-serif; font-weight:800; font-size:19px; color:#0A0A1A; text-decoration:none; cursor:pointer; }
  .hc-nav-links { display:flex; gap:28px; font-size:13.5px; font-weight:500; color:#6B7280; }
  .hc-nav-links span { cursor:pointer; transition:color .2s; }
  .hc-nav-links span:hover,.hc-nav-links .hc-act { color:#0057FF; }
  .hc-nav-btn { background:#0057FF; color:#fff; border:none; padding:9px 20px; border-radius:100px; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .2s; }
  .hc-nav-btn:hover { background:#0045CC; transform:scale(1.03); }

  .hc-hero { background:linear-gradient(160deg,#EEF3FF 0%,#F7F8FC 60%); border-bottom:1px solid #E5E9F5; padding:64px 32px 56px; }
  .hc-hero-inner { max-width:760px; margin:0 auto; text-align:center; }
  .hc-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(0,87,255,.08); border:1px solid rgba(0,87,255,.16); color:#0057FF; padding:6px 14px; border-radius:100px; font-size:12px; font-weight:500; letter-spacing:.07em; text-transform:uppercase; margin-bottom:24px; }
  .hc-pulse { width:6px; height:6px; background:#0057FF; border-radius:50%; animation:pulse-hc 1.8s infinite; }
  .hc-hero-inner h1 { font-family:'Syne',sans-serif; font-size:clamp(32px,5vw,54px); font-weight:800; line-height:1.1; letter-spacing:-.03em; margin-bottom:16px; }
  .hc-grad { background:linear-gradient(135deg,#0057FF,#6C5CE7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .hc-hero-inner p { font-size:16.5px; color:#545878; line-height:1.7; margin-bottom:36px; }

  .hc-search-wrap { position:relative; max-width:520px; margin:0 auto; }
  .hc-search-wrap input { width:100%; padding:16px 52px; border:2px solid #E0E5F0; border-radius:16px; font-size:15px; font-family:'DM Sans',sans-serif; background:#fff; color:#0A0A1A; outline:none; transition:all .25s; box-shadow:0 2px 12px rgba(0,0,0,.06); }
  .hc-search-wrap input:focus { border-color:#0057FF; box-shadow:0 0 0 4px rgba(0,87,255,.1); }
  .hc-search-wrap input::placeholder { color:#A0A5BC; }
  .hc-s-icon { position:absolute; left:18px; top:50%; transform:translateY(-50%); color:#9099B8; }
  .hc-s-clear { position:absolute; right:16px; top:50%; transform:translateY(-50%); background:#E5E9F5; border:none; border-radius:50%; width:24px; height:24px; cursor:pointer; font-size:14px; color:#545878; display:flex; align-items:center; justify-content:center; transition:all .2s; }
  .hc-s-clear:hover { background:#0057FF; color:#fff; }
  .hc-s-results { position:absolute; top:calc(100% + 8px); left:0; right:0; background:#fff; border:1px solid #E0E5F0; border-radius:14px; box-shadow:0 8px 32px rgba(0,0,0,.1); z-index:50; overflow:hidden; }
  .hc-s-item { padding:12px 18px; font-size:14px; cursor:pointer; transition:background .15s; display:flex; align-items:center; gap:10px; color:#0A0A1A; }
  .hc-s-item:hover { background:#F0F4FF; color:#0057FF; }
  .hc-s-cat { font-size:11px; color:#9099B8; background:#F0F2F8; padding:2px 8px; border-radius:100px; margin-left:auto; }

  .hc-main { max-width:1160px; margin:0 auto; padding:56px 32px 80px; }
  .hc-slabel { font-size:11.5px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#0057FF; margin-bottom:10px; }
  .hc-stitle { font-family:'Syne',sans-serif; font-size:clamp(22px,3vw,30px); font-weight:800; letter-spacing:-.02em; margin-bottom:8px; }
  .hc-ssub { font-size:14.5px; color:#6B7280; margin-bottom:32px; }

  .hc-cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr)); gap:14px; margin-bottom:60px; }
  .hc-cat-card { background:#fff; border:1.5px solid #EAECF4; border-radius:16px; padding:22px 20px; cursor:pointer; transition:all .3s cubic-bezier(.22,1,.36,1); text-align:center; }
  .hc-cat-card:hover,.hc-cat-card.hc-sel { border-color:var(--c); box-shadow:0 8px 28px rgba(0,0,0,.08); transform:translateY(-3px); }
  .hc-cat-card.hc-sel { background:linear-gradient(135deg,#fff,#f5f7ff); }
  .hc-cat-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; transition:transform .3s; }
  .hc-cat-card:hover .hc-cat-icon { transform:scale(1.1) rotate(-4deg); }
  .hc-cat-name { font-size:13px; font-weight:600; color:#0A0A1A; }
  .hc-cat-cnt { font-size:11.5px; color:#9099B8; margin-top:3px; }

  .hc-two-col { display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start; }

  .hc-faq-wrap { margin-bottom:60px; }
  .hc-faq { background:#fff; border:1px solid #EAECF4; border-radius:16px; margin-bottom:10px; overflow:hidden; transition:all .25s; }
  .hc-faq.hc-open { border-color:#CCD7FF; box-shadow:0 4px 20px rgba(0,87,255,.08); }
  .hc-faq-q { padding:20px 24px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; gap:16px; }
  .hc-faq-qt { font-size:15px; font-weight:500; color:#0A0A1A; flex:1; }
  .hc-faq.hc-open .hc-faq-qt { color:#0057FF; }
  .hc-faq-tog { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:#F0F2F8; transition:all .3s; flex-shrink:0; }
  .hc-faq.hc-open .hc-faq-tog { background:#0057FF; color:#fff; transform:rotate(45deg); }
  .hc-faq-a { padding:0 24px 20px; font-size:14.5px; line-height:1.72; color:#545878; animation:slideDown-hc .3s ease both; }
  .hc-faq-tag { display:inline-block; font-size:11px; padding:3px 10px; border-radius:100px; margin-right:6px; margin-bottom:14px; font-weight:500; }

  .hc-art-list { display:flex; flex-direction:column; gap:10px; }
  .hc-art-item { background:#fff; border:1px solid #EAECF4; border-radius:14px; padding:16px 20px; display:flex; align-items:center; gap:14px; cursor:pointer; transition:all .25s; }
  .hc-art-item:hover { border-color:#CCD7FF; box-shadow:0 4px 16px rgba(0,87,255,.07); transform:translateX(4px); }
  .hc-art-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .hc-art-title { font-size:14px; font-weight:500; color:#0A0A1A; flex:1; }
  .hc-art-item:hover .hc-art-title { color:#0057FF; }
  .hc-art-views { font-size:12px; color:#9099B8; }

  .hc-sys-card { background:#fff; border:1px solid #EAECF4; border-radius:18px; padding:24px; margin-top:28px; }
  .hc-sys-title { font-size:13px; font-weight:600; color:#0057FF; letter-spacing:.07em; text-transform:uppercase; margin-bottom:16px; }
  .hc-sys-row { display:flex; align-items:center; justify-content:space-between; padding:9px 0; border-bottom:1px solid #F0F2F8; }
  .hc-sys-row:last-of-type { border:none; }
  .hc-sys-name { font-size:13.5px; color:#374151; }
  .hc-sys-badge { font-size:12px; font-weight:600; padding:3px 10px; border-radius:100px; }
  .hc-sys-foot { font-size:12px; color:#9099B8; margin-top:12px; }

  .hc-report { background:#fff; border:1px solid #EAECF4; border-radius:24px; padding:48px 44px; position:relative; overflow:hidden; }
  .hc-report::before { content:''; position:absolute; top:-60px; right:-60px; width:200px; height:200px; background:radial-gradient(circle,rgba(0,87,255,.06) 0%,transparent 70%); pointer-events:none; }
  .hc-form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .hc-form-grp { margin-bottom:18px; }
  .hc-form-grp label { display:block; font-size:13px; font-weight:600; color:#374151; margin-bottom:7px; }
  .hc-form-grp label span { color:#E84393; margin-left:2px; }
  .hc-input { width:100%; padding:13px 16px; border:1.5px solid #E0E5F0; border-radius:12px; font-size:14.5px; font-family:'DM Sans',sans-serif; color:#0A0A1A; background:#FAFBFF; outline:none; transition:all .25s; }
  .hc-input:focus { border-color:#0057FF; background:#fff; box-shadow:0 0 0 3px rgba(0,87,255,.09); }
  .hc-input::placeholder { color:#B0B8D0; }
  select.hc-input { cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239099B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; }
  textarea.hc-input { resize:vertical; min-height:110px; }

  .hc-file-drop { border:2px dashed #D0D7F0; border-radius:14px; padding:32px 24px; text-align:center; cursor:pointer; transition:all .25s; background:#FAFBFF; position:relative; }
  .hc-file-drop.hc-drag { border-color:#0057FF; background:#F0F4FF; transform:scale(1.01); }
  .hc-file-drop.hc-has { border-color:#00B894; background:#F0FDF9; border-style:solid; }
  .hc-file-prev { display:flex; align-items:center; gap:14px; background:#fff; border:1px solid #E0E5F0; border-radius:12px; padding:14px 16px; margin-top:12px; }
  .hc-file-prev-icon { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .hc-file-name { font-size:13.5px; font-weight:600; color:#0A0A1A; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .hc-file-size { font-size:12px; color:#9099B8; margin-top:2px; }
  .hc-file-rm { width:28px; height:28px; border-radius:50%; background:#FEE2E2; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#EF4444; transition:all .2s; flex-shrink:0; }
  .hc-file-rm:hover { background:#EF4444; color:#fff; }
  .hc-prog { height:4px; background:#E0E5F0; border-radius:100px; margin-top:10px; overflow:hidden; }
  .hc-prog-bar { height:100%; background:linear-gradient(90deg,#0057FF,#00B894); border-radius:100px; animation:progBar-hc .8s ease forwards; }
  .hc-file-err { color:#EF4444; font-size:12.5px; margin-top:8px; display:flex; align-items:center; gap:6px; }

  .hc-steps { display:flex; align-items:center; margin-bottom:32px; }
  .hc-step { flex:1; text-align:center; position:relative; }
  .hc-step::after { content:''; position:absolute; top:16px; left:50%; right:-50%; height:2px; background:#E0E5F0; z-index:0; }
  .hc-step:last-child::after { display:none; }
  .hc-step.hc-done::after { background:#0057FF; }
  .hc-step-c { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; font-size:12px; font-weight:700; position:relative; z-index:1; transition:all .3s; }
  .hc-step-c.hc-done { background:#0057FF; color:#fff; }
  .hc-step-c.hc-active { background:#fff; border:2px solid #0057FF; color:#0057FF; }
  .hc-step-c.hc-pending { background:#F0F2F8; color:#9099B8; border:2px solid #E0E5F0; }
  .hc-step-l { font-size:11.5px; color:#9099B8; font-weight:500; }
  .hc-step.hc-done .hc-step-l,.hc-step.hc-active .hc-step-l { color:#0A0A1A; font-weight:600; }

  .hc-success-ban { background:linear-gradient(135deg,#00B894,#00CEC9); color:#fff; border-radius:16px; padding:20px 24px; display:flex; align-items:center; gap:14px; margin-bottom:24px; animation:fadeUp-hc .4s ease both; }
  .hc-sub-btn { background:linear-gradient(135deg,#0057FF,#3B82F6); color:#fff; border:none; padding:15px 36px; border-radius:100px; font-size:15px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .3s; display:flex; align-items:center; gap:8px; }
  .hc-sub-btn:hover { transform:scale(1.03); box-shadow:0 8px 28px rgba(0,87,255,.35); }
  .hc-sub-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
  .hc-footer { text-align:center; margin-top:60px; color:#A0A5BC; font-size:13px; display:flex; align-items:center; justify-content:center; gap:6px; }

  @media(max-width:768px){ .hc-two-col{grid-template-columns:1fr} .hc-form-row{grid-template-columns:1fr} .hc-report{padding:28px 20px} }
`;

// ── ICONS ──────────────────────────────────────────────────────
const ILogin  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IQuiz   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>;
const IGame   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IBook   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const ILock   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IPerf   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const ISearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const ISearchSm=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9099B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>;
const ICheck  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const ISend   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IShield = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#0057FF"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IShieldSm=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="#0057FF"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IShieldG=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IArrow  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0C7D8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>;
const IDone   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ILoader = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:'spin-hc 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const IUpload = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IImage  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const IPDF    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IX      = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IAlert  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
// ── END ICONS ──────────────────────────────────────────────────

const categories = [
  {id:'login',name:'Login & Account',  count:'12 articles',color:'#0057FF',Icon:ILogin},
  {id:'quiz', name:'Quiz Issues',       count:'8 articles', color:'#00B894',Icon:IQuiz},
  {id:'game', name:'Game Problems',     count:'6 articles', color:'#E84393',Icon:IGame},
  {id:'learn',name:'Learning Modules',  count:'15 articles',color:'#6C5CE7',Icon:IBook},
  {id:'sec',  name:'Account & Security',count:'9 articles', color:'#FD7B00',Icon:ILock},
  {id:'perf', name:'Performance',       count:'5 articles', color:'#00CEC9',Icon:IPerf},
];
const faqs = [
  {q:"I can't log in to my CyberShield account",          tags:["Login","Account"],     color:"#0057FF",a:"First, try resetting your password via the Forgot Password link. Ensure your email is verified. If you signed up via Google, use Continue with Google. Clear browser cache if the issue persists."},
  {q:"My quiz score isn't saving / progress lost",         tags:["Quiz","Progress"],     color:"#00B894",a:"This usually happens due to session timeout or connectivity issues. Make sure you are logged in before starting. Progress auto-saves every 5 questions."},
  {q:"The Cyber Game isn't loading or keeps crashing",     tags:["Game","Browser"],      color:"#E84393",a:"Try refreshing the page (Ctrl+R). Disable browser extensions temporarily. Chrome or Firefox is recommended. On mobile, switch to desktop mode."},
  {q:"I'm not receiving the verification email",           tags:["Email","Account"],     color:"#6C5CE7",a:"Check your Spam or Junk folder. Add noreply@cybershield.app to your contacts. If using a corporate email, try a Gmail address instead."},
  {q:"How do I reset my password?",                        tags:["Password","Login"],    color:"#FD7B00",a:"Click Forgot Password on the login page, enter your registered email, then check your inbox for a reset link valid for 30 minutes."},
  {q:"My certificate/badge isn't showing after completion",tags:["Certificate","Module"],color:"#00CEC9",a:"Certificates are issued within 5-10 minutes after 100% module completion. Refresh your profile page. If it still does not appear after 24 hours, use the Report Issue form below."},
];
const articles = [
  {title:"How to enable two-factor authentication",           views:"2.4k",color:"#0057FF"},
  {title:"Understanding your CyberShield progress dashboard", views:"1.8k",color:"#6C5CE7"},
  {title:"Why phishing simulations feel so real",             views:"3.1k",color:"#E84393"},
  {title:"Complete guide to the Cyber Defense Game",          views:"2.9k",color:"#00B894"},
  {title:"How quiz scoring and grading works",                views:"1.5k",color:"#FD7B00"},
  {title:"Keeping your account secure — best practices",      views:"2.2k",color:"#00CEC9"},
];
const issueTypes=["Select issue type","Login / Authentication","Quiz not saving","Game loading error","Certificate not received","Email not delivered","Module / Content issue","Account security concern","Performance / Speed","Other"];
const allSearch=[...faqs.map(f=>({text:f.q,cat:'FAQ'})),...articles.map(a=>({text:a.title,cat:'Article'})),{text:'Reset password steps',cat:'Guide'},{text:'Verify email address',cat:'Guide'},{text:'Contact support team',cat:'Support'},{text:'Report a bug',cat:'Support'}];
const MAX=5*1024*1024;
const TYPES=["image/jpeg","image/jpg","image/png","image/gif","image/webp","application/pdf"];
const fmtBytes=b=>b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(2)+' MB';

function FileUpload({file,setFile,fileError,setFileError}){
  const [drag,setDrag]=useState(false);
  const [uploading,setUploading]=useState(false);
  const ref=useRef(null);
  const validate=f=>{
    setFileError('');
    if(!f)return;
    if(!TYPES.includes(f.type)){setFileError('Only PNG, JPG, GIF, WEBP, PDF allowed.');return;}
    if(f.size>MAX){setFileError('Max file size is 5MB.');return;}
    setUploading(true);
    setTimeout(()=>{setFile(f);setUploading(false);},800);
  };
  const onDrop=e=>{e.preventDefault();setDrag(false);if(e.dataTransfer.files[0])validate(e.dataTransfer.files[0]);};
  const remove=e=>{e.stopPropagation();setFile(null);setFileError('');if(ref.current)ref.current.value='';};
  const isPDF=file&&file.type==='application/pdf';
  const isImg=file&&file.type.startsWith('image/');
  return(
    <div>
      <div className={`hc-file-drop ${drag?'hc-drag':''} ${file?'hc-has':''}`}
        onClick={()=>!file&&ref.current&&ref.current.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop}
        style={{cursor:file?'default':'pointer'}}>
        {!file&&<input ref={ref} type="file" accept=".png,.jpg,.jpeg,.gif,.webp,.pdf" onChange={e=>e.target.files[0]&&validate(e.target.files[0])} style={{display:'none'}}/>}
        {uploading?(
          <div style={{padding:'8px 0'}}>
            <div style={{color:'#0057FF',marginBottom:10,display:'flex',justifyContent:'center'}}><ILoader/></div>
            <p style={{fontSize:14,color:'#0057FF',fontWeight:600}}>Uploading...</p>
            <div className="hc-prog" style={{maxWidth:200,margin:'12px auto 0'}}><div className="hc-prog-bar"/></div>
          </div>
        ):!file?(
          <div>
            <div style={{color:'#9099B8',marginBottom:12,display:'flex',justifyContent:'center'}}><IUpload/></div>
            <p style={{fontSize:14,color:'#374151',fontWeight:500,marginBottom:6}}><strong style={{color:'#0057FF'}}>Click to upload</strong> or drag and drop</p>
            <p style={{fontSize:12.5,color:'#9099B8'}}>PNG, JPG, GIF, WEBP, PDF — Max 5MB</p>
            <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:14}}>
              {['PNG','JPG','GIF','PDF'].map(t=><span key={t} style={{fontSize:11,background:'#EEF3FF',color:'#0057FF',padding:'3px 8px',borderRadius:6,fontWeight:600}}>{t}</span>)}
            </div>
          </div>
        ):(
          <div onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:10,color:'#00B894'}}>{isPDF?<IPDF/>:<IImage/>}</div>
            <p style={{fontSize:13.5,color:'#00B894',fontWeight:600}}>File attached successfully!</p>
          </div>
        )}
      </div>
      {file&&(
        <div className="hc-file-prev">
          <div className="hc-file-prev-icon" style={{background:isPDF?'#FEF3F2':'#EFF6FF',color:isPDF?'#EF4444':'#0057FF'}}>{isPDF?<IPDF/>:<IImage/>}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="hc-file-name">{file.name}</div>
            <div className="hc-file-size">{fmtBytes(file.size)} — {isPDF?'PDF Document':'Image File'}</div>
            <div className="hc-prog" style={{marginTop:6}}><div className="hc-prog-bar"/></div>
          </div>
          {isImg&&<img src={URL.createObjectURL(file)} alt="preview" style={{width:44,height:44,borderRadius:8,objectFit:'cover',flexShrink:0,border:'1px solid #E0E5F0'}}/>}
          <button className="hc-file-rm" onClick={remove}><IX/></button>
        </div>
      )}
      {fileError&&<div className="hc-file-err"><IAlert/>{fileError}</div>}
    </div>
  );
}

function HelpCenter(){
  const navigate=useNavigate();
  const [search,setSearch]=useState('');
  const [results,setResults]=useState([]);
  const [openFaq,setOpenFaq]=useState(null);
  const [selCat,setSelCat]=useState(null);
  const [form,setForm]=useState({name:'',email:'',issue:'',desc:'',priority:'medium'});
  const [file,setFile]=useState(null);
  const [fileError,setFileError]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [mounted,setMounted]=useState(false);

  useEffect(()=>{
    const s=document.createElement('style');s.id='hc-styles';s.textContent=css;document.head.appendChild(s);
    setTimeout(()=>setMounted(true),50);
    return()=>{const el=document.getElementById('hc-styles');if(el)el.remove();};
  },[]);

  useEffect(()=>{
    if(search.length>1)setResults(allSearch.filter(i=>i.text.toLowerCase().includes(search.toLowerCase())).slice(0,6));
    else setResults([]);
  },[search]);

  const doSubmit=()=>{
    if(!form.name||!form.email||!form.issue||!form.desc)return;
    setSubmitting(true);
    setTimeout(()=>{setSubmitting(false);setSubmitted(true);setForm({name:'',email:'',issue:'',desc:'',priority:'medium'});setFile(null);setFileError('');},1800);
  };

  const filteredFaqs=selCat?faqs.filter(f=>f.tags.some(t=>t.toLowerCase().includes(selCat.slice(0,4)))):faqs;

  return(
    <div style={{background:'#F7F8FC',minHeight:'100vh',fontFamily:"'DM Sans',sans-serif",color:'#0A0A1A'}}>
      <nav className="hc-nav">
        <div className="hc-nav-inner">
          <div className="hc-logo" onClick={()=>navigate('/features')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:9,fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:19,color:'#0A0A1A',textDecoration:'none'}}>
            <IShield/> CyberShield
          </div>
          <div className="hc-nav-links">
            <span onClick={()=>navigate('/features')}>Features</span>
            <span className="hc-act">Help</span>
            <span onClick={()=>navigate('/contact')}>Contact</span>
          </div>
          <button className="hc-nav-btn">Back to App</button>
        </div>
      </nav>

      <div className="hc-hero">
        <div className="hc-hero-inner" style={{animation:mounted?'fadeUp-hc .6s ease both':'none'}}>
          <div className="hc-badge"><div className="hc-pulse"/>Help Center</div>
          <h1>How can we <span className="hc-grad">help you?</span></h1>
          <p>Search our knowledge base or browse common issues below</p>
          <div className="hc-search-wrap">
            <div className="hc-s-icon"><ISearch/></div>
            <input type="text" placeholder="Search — e.g. 'login issue', 'quiz not saving'..." value={search} onChange={e=>setSearch(e.target.value)}/>
            {search&&<button className="hc-s-clear" onClick={()=>setSearch('')}>✕</button>}
            {results.length>0&&(
              <div className="hc-s-results">
                {results.map((r,i)=>(
                  <div key={i} className="hc-s-item" onClick={()=>setSearch('')}>
                    <ISearchSm/>{r.text}<span className="hc-s-cat">{r.cat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hc-main">
        <div className={mounted?'hc-fade':''} style={{animationDelay:'.1s',marginBottom:8}}>
          <div className="hc-slabel">Browse by Topic</div>
          <div className="hc-stitle">What area needs help?</div>
          <div className="hc-ssub">Click a category to filter the FAQs below</div>
        </div>
        <div className={`hc-cat-grid ${mounted?'hc-fade':''}`} style={{animationDelay:'.15s'}}>
          {categories.map(c=>(
            <div key={c.id} className={`hc-cat-card ${selCat===c.id?'hc-sel':''}`} style={{'--c':c.color}} onClick={()=>setSelCat(selCat===c.id?null:c.id)}>
              <div className="hc-cat-icon" style={{background:`${c.color}14`,color:c.color}}><c.Icon/></div>
              <div className="hc-cat-name">{c.name}</div>
              <div className="hc-cat-cnt">{c.count}</div>
            </div>
          ))}
        </div>

        <div className={`hc-two-col ${mounted?'hc-fade':''}`} style={{animationDelay:'.2s'}}>
          <div>
            <div className="hc-slabel">Common Questions</div>
            <div className="hc-stitle" style={{marginBottom:6}}>Frequently Asked</div>
            <div className="hc-ssub">{selCat?`Showing results for "${categories.find(c=>c.id===selCat)?.name}"`:'Most reported issues and solutions'}</div>
            <div className="hc-faq-wrap">
              {(filteredFaqs.length?filteredFaqs:faqs).map((f,i)=>(
                <div key={i} className={`hc-faq ${openFaq===i?'hc-open':''}`}>
                  <div className="hc-faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                    <span className="hc-faq-qt">{f.q}</span>
                    <div className="hc-faq-tog"><IPlus/></div>
                  </div>
                  {openFaq===i&&(
                    <div className="hc-faq-a">
                      <div>{f.tags.map(t=><span key={t} className="hc-faq-tag" style={{background:`${f.color}12`,color:f.color}}>{t}</span>)}</div>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="hc-slabel">Popular Reads</div>
            <div className="hc-stitle" style={{marginBottom:6}}>Top Articles</div>
            <div className="hc-ssub">Most viewed guides this week</div>
            <div className="hc-art-list">
              {articles.map((a,i)=>(
                <div key={i} className="hc-art-item">
                  <div className="hc-art-dot" style={{background:a.color}}/>
                  <div className="hc-art-title">{a.title}</div>
                  <div className="hc-art-views">{a.views} views</div>
                  <IArrow/>
                </div>
              ))}
            </div>
            <div className="hc-sys-card">
              <div className="hc-sys-title">System Status</div>
              {[['All Services','Operational','#00B894'],['Quiz Engine','Operational','#00B894'],['Game Server','Maintenance','#FD7B00'],['Auth Service','Operational','#00B894']].map(([s,st,c])=>(
                <div key={s} className="hc-sys-row">
                  <span className="hc-sys-name">{s}</span>
                  <span className="hc-sys-badge" style={{color:c,background:`${c}14`}}>{st}</span>
                </div>
              ))}
              <div className="hc-sys-foot">Last checked: 2 mins ago</div>
            </div>
          </div>
        </div>

        <div style={{marginTop:64}}>
          <div className="hc-slabel">Still Need Help?</div>
          <div className="hc-stitle" style={{marginBottom:6}}>Report an Issue</div>
          <div className="hc-ssub">Fill out the form and our team will get back to you within 24 hours</div>
        </div>

        <div className="hc-report">
          <div className="hc-steps">
            {['Fill Details','Submit','Under Review','Resolved'].map((s,i)=>(
              <div key={s} className={`hc-step ${submitted&&i<2?'hc-done':submitted&&i===2?'hc-active':''}`}>
                <div className={`hc-step-c ${submitted&&i<2?'hc-done':submitted&&i===2?'hc-active':'hc-pending'}`}>
                  {submitted&&i<2?<ICheck/>:i+1}
                </div>
                <div className="hc-step-l">{s}</div>
              </div>
            ))}
          </div>

          {submitted&&(
            <div className="hc-success-ban">
              <IDone/>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>Report submitted successfully!</div>
                <div style={{fontSize:13,opacity:.9,marginTop:2}}>Ticket #CS-{Math.floor(Math.random()*90000+10000)} — You will receive a confirmation at your email</div>
              </div>
            </div>
          )}

          <div className="hc-form-row">
            <div className="hc-form-grp">
              <label>Full Name <span>*</span></label>
              <input className="hc-input" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>
            <div className="hc-form-grp">
              <label>Email Address <span>*</span></label>
              <input className="hc-input" type="email" placeholder="you@gmail.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            </div>
          </div>
          <div className="hc-form-row">
            <div className="hc-form-grp">
              <label>Issue Type <span>*</span></label>
              <select className="hc-input" value={form.issue} onChange={e=>setForm({...form,issue:e.target.value})}>
                {issueTypes.map(t=><option key={t} value={t==='Select issue type'?'':t}>{t}</option>)}
              </select>
            </div>
            <div className="hc-form-grp">
              <label>Priority</label>
              <div style={{display:'flex',gap:8,marginTop:2}}>
                {['low','medium','high'].map(p=>{
                  const cols={low:'#00B894',medium:'#FD7B00',high:'#E84393'};
                  const on=form.priority===p;
                  return <button key={p} onClick={()=>setForm({...form,priority:p})} style={{flex:1,padding:'12px 8px',border:`2px solid ${on?cols[p]:'#E0E5F0'}`,borderRadius:10,background:on?`${cols[p]}14`:'#FAFBFF',cursor:'pointer',fontSize:13,fontWeight:600,color:on?cols[p]:'#9099B8',transition:'all .2s',textTransform:'capitalize',fontFamily:"'DM Sans',sans-serif"}}>{p}</button>;
                })}
              </div>
            </div>
          </div>
          <div className="hc-form-grp">
            <label>Describe the Issue <span>*</span></label>
            <textarea className="hc-input" placeholder="Describe what happened, what you expected, and what you saw." value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})}/>
          </div>
          <div className="hc-form-grp">
            <label>Attach Screenshot or PDF (optional)</label>
            <FileUpload file={file} setFile={setFile} fileError={fileError} setFileError={setFileError}/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <button className="hc-sub-btn" onClick={doSubmit} disabled={submitting||!form.name||!form.email||!form.issue||!form.desc}>
              {submitting?<span style={{display:'flex',alignItems:'center',gap:8}}><ILoader/>Submitting...</span>:<span style={{display:'flex',alignItems:'center',gap:8}}><ISend/>Submit Report</span>}
            </button>
            <span style={{fontSize:13,color:'#9099B8',display:'flex',alignItems:'center',gap:5}}><IShieldG/>Response within 24 hours</span>
          </div>
        </div>

        <div className="hc-footer"><IShieldSm/> CyberShield Help Center — Available 24/7 — support@cybershield.app</div>
      </div>
    </div>
  );
}

export default HelpCenter;
