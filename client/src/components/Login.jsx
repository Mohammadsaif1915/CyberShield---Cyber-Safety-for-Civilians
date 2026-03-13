import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import ForgotPasswordPopup from "./ForgotPasswordPopup";
import { GoogleLogin } from "@react-oauth/google";

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    font-family: 'Instrument Sans', sans-serif;
    background: #fafafa;
    color: #111;
    -webkit-font-smoothing: antialiased;
  }

  /* ══════════════════════════════
     SHELL
  ══════════════════════════════ */
  .ln-shell {
    display: flex;
    min-height: 100vh;
    width: 100vw;
  }

  /* ══════════════════════════════
     LEFT — form
  ══════════════════════════════ */
  .ln-left {
    width: 48%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-right: 1px solid #f0f0f0;
    position: relative;
    overflow-y: auto;
  }

  /* topbar */
  .ln-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.4rem 2.4rem;
    border-bottom: 1px solid #f5f5f5;
    flex-shrink: 0;
  }
  .ln-logo {
    display: flex; align-items: center; gap: 0.5rem;
    font-weight: 700; font-size: 0.95rem; color: #111;
    letter-spacing: -0.02em; text-decoration: none;
  }
  .ln-logo-mark {
    width: 28px; height: 28px; border-radius: 7px;
    background: #111;
    display: flex; align-items: center; justify-content: center;
  }
  .ln-topbar-link { font-size: 0.8rem; color: #888; }
  .ln-topbar-link a {
    color: #111; font-weight: 600; text-decoration: none;
  }
  .ln-topbar-link a:hover { text-decoration: underline; }

  /* form area */
  .ln-form-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.5rem 3.2rem;
  }

  .ln-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: #888;
    margin-bottom: 0.9rem;
  }
  .ln-eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #6366f1;
  }

  .ln-title {
    font-family: 'Instrument Serif', serif;
    font-size: 2.2rem;
    color: #0a0a0a;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 0.3rem;
  }
  .ln-title em { font-style: italic; color: #6366f1; }

  .ln-sub {
    font-size: 0.82rem; color: #999;
    margin-bottom: 2rem; line-height: 1.5;
  }

  /* fields */
  .ln-field { margin-bottom: 0.9rem; }

  .ln-label {
    display: block;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    color: #888; margin-bottom: 0.4rem;
  }

  .ln-input-wrap { position: relative; }

  .ln-input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 2.5rem;
    background: #fafafa;
    border: 1.5px solid #ebebeb;
    border-radius: 10px;
    color: #111;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .ln-input::placeholder { color: #bbb; }
  .ln-input:hover { border-color: #d0d0d0; }
  .ln-input:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
  }
  .ln-input.err { border-color: #f43f5e; background: #fff8f9; }

  .ln-icon-l {
    position: absolute; left: 0.78rem; top: 50%;
    transform: translateY(-50%);
    color: #ccc; pointer-events: none;
  }
  .ln-eye {
    position: absolute; right: 0.78rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #bbb; display: flex; padding: 2px;
    transition: color 0.2s;
  }
  .ln-eye:hover { color: #6366f1; }

  .ln-err-msg {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: 0.7rem; color: #f43f5e; margin-top: 0.25rem;
  }

  /* remember + forgot row */
  .ln-row {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 1.2rem;
  }
  .ln-remember {
    display: flex; align-items: center; gap: 0.45rem;
    cursor: pointer; font-size: 0.78rem; color: #666;
    font-weight: 500;
  }
  .ln-remember input { display: none; }
  .ln-checkbox {
    width: 15px; height: 15px;
    border: 1.5px solid #ddd; border-radius: 4px;
    background: #fafafa;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .ln-remember input:checked ~ .ln-checkbox {
    background: #6366f1; border-color: #6366f1;
  }
  .ln-checkbox-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #fff; display: none;
  }
  .ln-remember input:checked ~ .ln-checkbox .ln-checkbox-dot { display: block; }

  .ln-forgot {
    background: none; border: none; cursor: pointer;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.78rem; font-weight: 600;
    color: #6366f1; transition: color 0.2s; padding: 0;
  }
  .ln-forgot:hover { color: #4f46e5; text-decoration: underline; }

  /* error banner */
  .ln-err-banner {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.65rem 0.85rem; margin-bottom: 0.8rem;
    background: #fff5f7; border: 1px solid #fecdd3;
    border-radius: 8px; font-size: 0.77rem; color: #e11d48;
  }

  /* submit */
  .ln-submit {
    width: 100%; padding: 0.82rem;
    background: #111;
    border: none; border-radius: 10px; color: #fff;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.875rem; font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.45rem;
    transition: background 0.2s, transform 0.15s;
    margin-bottom: 0.9rem;
    letter-spacing: 0.01em;
  }
  .ln-submit:hover { background: #222; transform: translateY(-1px); }
  .ln-submit:active { transform: translateY(0); background: #000; }
  .ln-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* divider */
  .ln-divider {
    display: flex; align-items: center; gap: 0.7rem;
    margin-bottom: 0.9rem;
  }
  .ln-divider-line { flex: 1; height: 1px; background: #f0f0f0; }
  .ln-divider-text { font-size: 0.71rem; color: #bbb; font-weight: 500; white-space: nowrap; }

  /* google */
  .ln-google { display: flex; justify-content: center; margin-bottom: 1.2rem; }

  /* signup link */
  .ln-signup-note {
    text-align: center; font-size: 0.78rem; color: #999;
  }
  .ln-signup-note a {
    color: #111; font-weight: 600; text-decoration: none;
  }
  .ln-signup-note a:hover { text-decoration: underline; }

  /* bottom note */
  .ln-bottom-note {
    padding: 1.2rem 2.4rem;
    border-top: 1px solid #f5f5f5;
    font-size: 0.72rem; color: #bbb;
    display: flex; align-items: center; gap: 0.4rem;
    flex-shrink: 0;
  }

  .spin { animation: spin 0.9s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ══════════════════════════════
     RIGHT — visual panel
  ══════════════════════════════ */
  .ln-right {
    flex: 1;
    min-width: 0;
    background: #f7f7f5;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2.5rem;
  }

  /* subtle grid */
  .ln-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }
  .ln-circle-bg {
    position: absolute;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .ln-right-inner {
    position: relative; z-index: 1;
    width: 100%; max-width: 340px;
    display: flex; flex-direction: column;
    gap: 1rem;
  }

  /* headline */
  .ln-visual-headline { margin-bottom: 0.5rem; }
  .ln-visual-headline h2 {
    font-family: 'Instrument Serif', serif;
    font-size: 2rem; color: #0a0a0a;
    line-height: 1.15; letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }
  .ln-visual-headline h2 em { font-style: italic; color: #6366f1; }
  .ln-visual-headline p { font-size: 0.8rem; color: #888; line-height: 1.6; }

  /* activity card */
  .ln-activity-card {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 14px;
    padding: 1.1rem 1.2rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .ln-activity-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.9rem;
  }
  .ln-activity-title {
    font-size: 0.78rem; font-weight: 700; color: #111;
  }
  .ln-activity-badge {
    font-size: 0.62rem; font-weight: 600;
    background: #f0fdf4; color: #16a34a;
    border: 1px solid #bbf7d0;
    border-radius: 99px; padding: 0.15rem 0.55rem;
  }
  .ln-activity-list { display: flex; flex-direction: column; gap: 0.55rem; }
  .ln-activity-item {
    display: flex; align-items: center; gap: 0.7rem;
  }
  .ln-activity-dot {
    width: 7px; height: 7px; border-radius: 50%;
    flex-shrink: 0;
  }
  .ln-activity-text { font-size: 0.75rem; color: #555; flex: 1; }
  .ln-activity-time { font-size: 0.68rem; color: #bbb; }

  /* security score */
  .ln-score-card {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 14px;
    padding: 1.1rem 1.2rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    display: flex; align-items: center; gap: 1rem;
  }
  .ln-score-ring {
    width: 56px; height: 56px; border-radius: 50%;
    background: conic-gradient(#6366f1 0% 82%, #ebebeb 82% 100%);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; position: relative;
  }
  .ln-score-inner {
    width: 40px; height: 40px; border-radius: 50%;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem; font-weight: 700; color: #111;
  }
  .ln-score-info {}
  .ln-score-label { font-size: 0.7rem; color: #888; margin-bottom: 0.15rem; }
  .ln-score-val {
    font-family: 'Instrument Serif', serif;
    font-size: 1.1rem; color: #0a0a0a;
    letter-spacing: -0.02em;
  }
  .ln-score-sub { font-size: 0.68rem; color: #22c55e; font-weight: 600; }

  /* trust badges */
  .ln-trust {
    display: flex; flex-direction: column; gap: 0.5rem;
  }
  .ln-trust-item {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 10px;
    padding: 0.72rem 0.9rem;
    display: flex; align-items: center; gap: 0.65rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    transition: border-color 0.2s;
  }
  .ln-trust-item:hover { border-color: #d8d8ff; }
  .ln-trust-icon {
    width: 28px; height: 28px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.82rem; flex-shrink: 0;
  }
  .ln-trust-icon.indigo { background: #ede9fe; }
  .ln-trust-icon.green  { background: #dcfce7; }
  .ln-trust-icon.sky    { background: #e0f2fe; }
  .ln-trust-text {}
  .ln-trust-title { font-size: 0.78rem; font-weight: 600; color: #111; }
  .ln-trust-desc  { font-size: 0.68rem; color: #999; }

  /* quote */
  .ln-quote {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 12px;
    padding: 1rem 1.1rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .ln-quote-text {
    font-family: 'Instrument Serif', serif;
    font-style: italic; font-size: 0.86rem;
    color: #444; line-height: 1.65; margin-bottom: 0.6rem;
  }
  .ln-quote-author { display: flex; align-items: center; gap: 0.55rem; }
  .ln-quote-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 700; color: #fff;
  }
  .ln-quote-name { font-size: 0.73rem; font-weight: 600; color: #333; }
  .ln-quote-role { font-size: 0.66rem; color: #aaa; }

  @media (max-width: 860px) {
    .ln-left { width: 100%; border-right: none; }
    .ln-right { display: none; }
  }
`;

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPwd,  setShowPwd]  = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [touched,  setTouched]  = useState({});
  const [showForgotPopup, setShowForgotPopup] = useState(false);

  const validate = (name, val) => {
    if (name === 'email') {
      if (!val) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Invalid email format';
    }
    if (name === 'password') {
      if (!val) return 'Password is required';
      if (val.length < 6) return 'Minimum 6 characters';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validate(name, value) }));
  };

  const validateAll = () => {
    const e = {};
    ['email', 'password'].forEach(k => {
      const err = validate(k, formData[k]);
      if (err) e[k] = err;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setTouched({ email: true, password: true });
    if (!validateAll()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(p => ({ ...p, submit: data.message || 'Invalid email or password.' }));
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch {
      setErrors(p => ({ ...p, submit: 'Could not connect to server.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(p => ({ ...p, submit: data.message || 'Google login failed.' }));
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch {
      setErrors(p => ({ ...p, submit: 'Google login failed. Try again.' }));
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="ln-shell">

        {/* ══ LEFT ══ */}
        <div className="ln-left">

          {/* Topbar */}
          <div className="ln-topbar">
            <a href="/" className="ln-logo">
              <div className="ln-logo-mark"><Shield size={14} color="#fff" /></div>
              CyberShield
            </a>
            <div className="ln-topbar-link">
              New here? <a href="/register">Create account</a>
            </div>
          </div>

          {/* Form */}
          <div className="ln-form-area">
            <div className="ln-eyebrow">
              <div className="ln-eyebrow-dot" />
              Secure login
            </div>
            <h1 className="ln-title">Welcome <em>back</em></h1>
            <p className="ln-sub">Sign in to your CyberShield account to continue.</p>

            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="ln-field">
                <label className="ln-label">Email address</label>
                <div className="ln-input-wrap">
                  <Mail size={13} className="ln-icon-l" />
                  <input
                    type="email" name="email" value={formData.email}
                    className={`ln-input${errors.email && touched.email ? ' err' : ''}`}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="you@example.com" disabled={loading}
                  />
                </div>
                {errors.email && touched.email && (
                  <div className="ln-err-msg"><AlertCircle size={11} /> {errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="ln-field">
                <label className="ln-label">Password</label>
                <div className="ln-input-wrap">
                  <Lock size={13} className="ln-icon-l" />
                  <input
                    type={showPwd ? 'text' : 'password'} name="password" value={formData.password}
                    className={`ln-input${errors.password && touched.password ? ' err' : ''}`}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="Enter your password" disabled={loading}
                    style={{ paddingRight: '2.4rem' }}
                  />
                  <button type="button" className="ln-eye" onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <div className="ln-err-msg"><AlertCircle size={11} /> {errors.password}</div>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="ln-row">
                <label className="ln-remember">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  <div className="ln-checkbox"><div className="ln-checkbox-dot" /></div>
                  Remember me
                </label>
                <button type="button" className="ln-forgot" onClick={() => setShowForgotPopup(true)}>
                  Forgot password?
                </button>
              </div>

              {/* Error */}
              {errors.submit && (
                <div className="ln-err-banner"><AlertCircle size={13} /> {errors.submit}</div>
              )}

              {/* Submit */}
              <button type="submit" className="ln-submit" disabled={loading}>
                {loading
                  ? <><Loader2 size={15} className="spin" /> Signing in…</>
                  : <>Sign in <ArrowRight size={15} /></>
                }
              </button>

              {/* Divider */}
              <div className="ln-divider">
                <div className="ln-divider-line" />
                <span className="ln-divider-text">or continue with</span>
                <div className="ln-divider-line" />
              </div>

              {/* Google */}
              <div className="ln-google">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrors(p => ({ ...p, submit: 'Google sign-in failed.' }))}
                  useOneTap={false}
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  text="continue_with"
                  width="340"
                />
              </div>

              <div className="ln-signup-note">
                Don't have an account? <a href="/register">Sign up free</a>
              </div>

            </form>
          </div>

          {/* Bottom note */}
          <div className="ln-bottom-note">
            <Lock size={11} style={{ color: '#ccc' }} />
            256-bit SSL encryption · Your data is always protected
          </div>

        </div>

        {/* ══ RIGHT ══ */}
        <div className="ln-right">
          <div className="ln-grid" />
          <div className="ln-circle-bg" />

          <div className="ln-right-inner">

            <div className="ln-visual-headline">
              <h2>Your digital life,<br /><em>secured</em></h2>
              <p>Every login is protected. Every session is monitored. Every threat is blocked before it reaches you.</p>
            </div>

            {/* Activity card */}
            <div className="ln-activity-card">
              <div className="ln-activity-header">
                <div className="ln-activity-title">Recent Security Activity</div>
                <div className="ln-activity-badge">All clear</div>
              </div>
              <div className="ln-activity-list">
                {[
                  { color: '#22c55e', text: 'Login from Mumbai, IN', time: '2m ago' },
                  { color: '#6366f1', text: 'Password check passed', time: '1h ago' },
                  { color: '#f59e0b', text: 'Phishing link blocked', time: '3h ago' },
                  { color: '#22c55e', text: 'Account scan complete', time: '1d ago' },
                ].map((item, i) => (
                  <div key={i} className="ln-activity-item">
                    <div className="ln-activity-dot" style={{ background: item.color }} />
                    <div className="ln-activity-text">{item.text}</div>
                    <div className="ln-activity-time">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security score */}
            <div className="ln-score-card">
              <div className="ln-score-ring">
                <div className="ln-score-inner">82</div>
              </div>
              <div className="ln-score-info">
                <div className="ln-score-label">Your Security Score</div>
                <div className="ln-score-val">Strong Protection</div>
                <div className="ln-score-sub">↑ 4 pts from last week</div>
              </div>
            </div>

            {/* Trust items */}
            <div className="ln-trust">
              {[
                { icon: '🛡️', cls: 'indigo', title: 'Zero-Trust Architecture', desc: 'Every request verified, every time' },
                { icon: '🔒', cls: 'green',  title: 'End-to-End Encrypted', desc: 'AES-256 encryption at rest & transit' },
                { icon: '⚡', cls: 'sky',    title: 'Instant Threat Response', desc: 'Blocked 12K+ threats this month' },
              ].map((t, i) => (
                <div key={i} className="ln-trust-item">
                  <div className={`ln-trust-icon ${t.cls}`}>{t.icon}</div>
                  <div className="ln-trust-text">
                    <div className="ln-trust-title">{t.title}</div>
                    <div className="ln-trust-desc">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {showForgotPopup && (
        <ForgotPasswordPopup onClose={() => setShowForgotPopup(false)} />
      )}
    </>
  );
}