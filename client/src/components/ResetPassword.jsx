import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Lock, Shield, CheckCircle2,
  AlertCircle, Loader2, ArrowRight
} from 'lucide-react';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    font-family: 'Instrument Sans', sans-serif;
    background: #f7f7f5;
    color: #111;
    -webkit-font-smoothing: antialiased;
  }

  /* ══════════════════════════
     PAGE WRAPPER
  ══════════════════════════ */
  .rsp-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  /* subtle grid bg */
  .rsp-wrap::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  /* soft radial accent */
  .rsp-wrap::after {
    content: '';
    position: fixed;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none; z-index: 0;
  }

  /* ══════════════════════════
     CARD
  ══════════════════════════ */
  .rsp-card {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 20px;
    box-shadow:
      0 0 0 1px rgba(0,0,0,0.03),
      0 20px 60px rgba(0,0,0,0.08),
      0 6px 16px rgba(0,0,0,0.04);
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
    overflow: hidden;
    animation: rsp-cardIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both;
  }

  /* top indigo stripe */
  .rsp-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #6366f1, #a78bfa, #6366f1);
    background-size: 200% 100%;
    animation: rsp-shimmer 3s linear infinite;
  }

  .rsp-body { padding: 2.4rem 2.2rem 2rem; }

  /* ══════════════════════════
     HEADER
  ══════════════════════════ */
  .rsp-header {
    display: flex; flex-direction: column;
    align-items: center; text-align: center;
    margin-bottom: 1.8rem;
  }
  .rsp-icon-box {
    width: 48px; height: 48px; border-radius: 12px;
    background: #111;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.2rem;
    box-shadow: 0 4px 14px rgba(0,0,0,0.14);
  }

  .rsp-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: #888;
    margin-bottom: 0.55rem;
  }
  .rsp-eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #6366f1;
  }

  .rsp-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.7rem; color: #0a0a0a;
    line-height: 1.1; letter-spacing: -0.02em;
    margin-bottom: 0.3rem;
  }
  .rsp-title em { font-style: italic; color: #6366f1; }
  .rsp-sub { font-size: 0.8rem; color: #999; line-height: 1.5; }

  /* ══════════════════════════
     FIELDS
  ══════════════════════════ */
  .rsp-field { margin-bottom: 1rem; }

  .rsp-label {
    display: block;
    font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: #888; margin-bottom: 0.4rem;
  }

  .rsp-input-wrap { position: relative; }

  .rsp-input {
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
  .rsp-input::placeholder { color: #bbb; }
  .rsp-input:hover { border-color: #d0d0d0; }
  .rsp-input:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
  }
  .rsp-input.err { border-color: #f43f5e; background: #fff8f9; }
  .rsp-input.ok  { border-color: #22c55e; }

  .rsp-icon-l {
    position: absolute; left: 0.78rem; top: 50%;
    transform: translateY(-50%);
    color: #ccc; pointer-events: none;
  }
  .rsp-eye {
    position: absolute; right: 0.78rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #bbb; display: flex; padding: 2px;
    transition: color 0.2s;
  }
  .rsp-eye:hover { color: #6366f1; }

  .rsp-err-msg {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: 0.7rem; color: #f43f5e; margin-top: 0.25rem;
  }

  /* strength */
  .rsp-strength { margin-top: 0.5rem; }
  .rsp-strength-bar {
    height: 3px; background: #ebebeb;
    border-radius: 99px; overflow: hidden; margin-bottom: 0.25rem;
  }
  .rsp-strength-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.35s ease, background-color 0.35s ease;
  }
  .rsp-strength-label {
    font-size: 0.68rem; font-weight: 600;
    text-align: right;
  }

  /* hints */
  .rsp-hints {
    margin-top: 0.4rem;
    display: flex; flex-direction: column; gap: 0.15rem;
  }
  .rsp-hint {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.69rem; color: #bbb; font-weight: 500;
    transition: color 0.2s;
  }
  .rsp-hint.met { color: #22c55e; }
  .rsp-hint-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: #ddd; flex-shrink: 0; transition: background 0.2s;
  }
  .rsp-hint.met .rsp-hint-dot { background: #22c55e; }

  /* api err */
  .rsp-api-err {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.6rem 0.8rem; margin-top: 0.5rem;
    background: #fff5f7; border: 1px solid #fecdd3;
    border-radius: 8px; font-size: 0.75rem; color: #e11d48;
  }

  /* submit */
  .rsp-submit {
    width: 100%; padding: 0.82rem;
    background: #111;
    border: none; border-radius: 10px; color: #fff;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.875rem; font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.45rem;
    transition: background 0.2s, transform 0.15s;
    margin-top: 1.3rem;
    letter-spacing: 0.01em;
  }
  .rsp-submit:hover { background: #222; transform: translateY(-1px); }
  .rsp-submit:active { transform: translateY(0); background: #000; }
  .rsp-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* footer note */
  .rsp-footer-note {
    display: flex; align-items: center; justify-content: center; gap: 0.35rem;
    margin-top: 1rem; font-size: 0.7rem; color: #bbb;
  }

  /* ══════════════════════════
     SUCCESS STATE
  ══════════════════════════ */
  .rsp-success {
    display: flex; flex-direction: column;
    align-items: center; text-align: center;
    animation: rsp-cardIn 0.35s ease both;
  }
  .rsp-success-ring {
    width: 52px; height: 52px; border-radius: 50%;
    background: #111;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.2rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.14);
  }
  .rsp-success-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.5rem; color: #0a0a0a;
    letter-spacing: -0.02em; margin-bottom: 0.35rem;
  }
  .rsp-success-title em { font-style: italic; color: #22c55e; }
  .rsp-success-sub {
    font-size: 0.8rem; color: #888; line-height: 1.65;
    margin-bottom: 1.4rem;
  }
  .rsp-login-btn {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.78rem 1.6rem;
    background: #111; color: #fff;
    border: none; border-radius: 10px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.84rem; font-weight: 600;
    cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    letter-spacing: 0.01em;
  }
  .rsp-login-btn:hover { background: #222; transform: translateY(-1px); }

  /* ══════════════════════════
     EXPIRED STATE
  ══════════════════════════ */
  .rsp-expired {
    display: flex; flex-direction: column;
    align-items: center; text-align: center;
  }
  .rsp-expired-ring {
    width: 52px; height: 52px; border-radius: 50%;
    background: #f43f5e;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.2rem;
    box-shadow: 0 4px 16px rgba(244,63,94,0.22);
  }
  .rsp-expired-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.5rem; color: #0a0a0a;
    letter-spacing: -0.02em; margin-bottom: 0.35rem;
  }
  .rsp-expired-title em { font-style: italic; color: #f43f5e; }
  .rsp-expired-sub {
    font-size: 0.8rem; color: #888; line-height: 1.65;
    margin-bottom: 1.4rem;
  }

  @keyframes rsp-cardIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes rsp-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.9s linear infinite; }
`;

const strengthMap = {
  0: { label: 'Very weak',   color: '#f43f5e' },
  1: { label: 'Weak',        color: '#fb923c' },
  2: { label: 'Fair',        color: '#f59e0b' },
  3: { label: 'Good',        color: '#34d399' },
  4: { label: 'Strong',      color: '#22c55e' },
  5: { label: 'Very strong', color: '#16a34a' },
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate  = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [touched,  setTouched]  = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [expired,  setExpired]  = useState(false);
  const [apiErr,   setApiErr]   = useState('');
  const [pwdStr,   setPwdStr]   = useState({ score: 0, label: '', color: '' });

  const calcStrength = (p) => {
    let s = 0;
    if (p.length >= 8)  s++;
    if (p.length >= 12) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    setPwdStr({ score: s, ...strengthMap[s] });
  };

  const validate = (name, val) => {
    if (name === 'password') {
      if (!val)                                 return 'Password is required';
      if (val.length < 8)                       return 'Minimum 8 characters';
      if (!/(?=.*[a-z])(?=.*[A-Z])/.test(val)) return 'Upper & lowercase required';
      if (!/(?=.*\d)/.test(val))                return 'At least one number';
    }
    if (name === 'confirm') {
      if (!val)             return 'Please confirm password';
      if (val !== password) return 'Passwords do not match';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    calcStrength(e.target.value);
    if (touched.password) setErrors(p => ({ ...p, password: validate('password', e.target.value) }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setTouched({ password: true, confirm: true });
    const pwdErr  = validate('password', password);
    const confErr = validate('confirm', confirm);
    if (pwdErr || confErr) { setErrors({ password: pwdErr, confirm: confErr }); return; }

    setLoading(true); setApiErr('');
    try {
      const res = await fetch(`${API_URL}/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.message?.toLowerCase().includes('invalid') || data.message?.toLowerCase().includes('expired')) {
          setExpired(true);
        } else {
          setApiErr(data.message || 'Something went wrong.');
        }
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      setApiErr('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const hints = [
    { label: 'At least 8 characters',              met: password.length >= 8 },
    { label: 'One number (0–9) or a symbol',        met: /\d/.test(password) || /[^a-zA-Z0-9]/.test(password) },
    { label: 'Lowercase (a–z) and uppercase (A–Z)', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="rsp-wrap">
        <div className="rsp-card">
          <div className="rsp-body">

            {/* ── Success ── */}
            {success && (
              <div className="rsp-success">
                <div className="rsp-success-ring">
                  <CheckCircle2 size={24} color="#fff" />
                </div>
                <div className="rsp-success-title">Password <em>reset</em></div>
                <p className="rsp-success-sub">
                  Your password has been updated successfully.<br />
                  Redirecting to login in 3 seconds…
                </p>
                <a href="/login" className="rsp-login-btn">
                  Go to login <ArrowRight size={14} />
                </a>
              </div>
            )}

            {/* ── Expired ── */}
            {expired && !success && (
              <div className="rsp-expired">
                <div className="rsp-expired-ring">
                  <AlertCircle size={24} color="#fff" />
                </div>
                <div className="rsp-expired-title">Link <em>expired</em></div>
                <p className="rsp-expired-sub">
                  This reset link has expired or is invalid.<br />
                  Please request a new one.
                </p>
                <a href="/login" className="rsp-login-btn">
                  Back to login <ArrowRight size={14} />
                </a>
              </div>
            )}

            {/* ── Form ── */}
            {!success && !expired && (
              <>
                <div className="rsp-header">
                  <div className="rsp-icon-box">
                    <Lock size={22} color="#fff" />
                  </div>
                  <div className="rsp-eyebrow">
                    <div className="rsp-eyebrow-dot" />
                    Secure reset
                  </div>
                  <h1 className="rsp-title">Set a new <em>password</em></h1>
                  <p className="rsp-sub">Create a strong new password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>

                  {/* New Password */}
                  <div className="rsp-field">
                    <label className="rsp-label">New password</label>
                    <div className="rsp-input-wrap">
                      <Lock size={13} className="rsp-icon-l" />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        className={`rsp-input ${errors.password && touched.password ? 'err' : password && !errors.password ? 'ok' : ''}`}
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={() => { setTouched(p => ({ ...p, password: true })); setErrors(p => ({ ...p, password: validate('password', password) })); }}
                        placeholder="Create a strong password"
                        disabled={loading}
                        style={{ paddingRight: '2.4rem' }}
                      />
                      <button type="button" className="rsp-eye" onClick={() => setShowPwd(v => !v)}>
                        {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {password && (
                      <div className="rsp-strength">
                        <div className="rsp-strength-bar">
                          <div className="rsp-strength-fill" style={{ width: `${(pwdStr.score / 5) * 100}%`, backgroundColor: pwdStr.color }} />
                        </div>
                        <div className="rsp-strength-label" style={{ color: pwdStr.color }}>{pwdStr.label}</div>
                      </div>
                    )}

                    {/* Hints */}
                    {password && (
                      <div className="rsp-hints">
                        {hints.map((h, i) => (
                          <div key={i} className={`rsp-hint ${h.met ? 'met' : ''}`}>
                            <div className="rsp-hint-dot" /> {h.label}
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.password && touched.password && (
                      <div className="rsp-err-msg"><AlertCircle size={11} /> {errors.password}</div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="rsp-field">
                    <label className="rsp-label">Confirm password</label>
                    <div className="rsp-input-wrap">
                      <Lock size={13} className="rsp-icon-l" />
                      <input
                        type={showConf ? 'text' : 'password'}
                        className={`rsp-input ${errors.confirm && touched.confirm ? 'err' : confirm && !errors.confirm && touched.confirm ? 'ok' : ''}`}
                        value={confirm}
                        onChange={(e) => { setConfirm(e.target.value); if (touched.confirm) setErrors(p => ({ ...p, confirm: validate('confirm', e.target.value) })); }}
                        onBlur={() => { setTouched(p => ({ ...p, confirm: true })); setErrors(p => ({ ...p, confirm: validate('confirm', confirm) })); }}
                        placeholder="Re-enter your password"
                        disabled={loading}
                        style={{ paddingRight: '2.4rem' }}
                      />
                      <button type="button" className="rsp-eye" onClick={() => setShowConf(v => !v)}>
                        {showConf ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                    {errors.confirm && touched.confirm && (
                      <div className="rsp-err-msg"><AlertCircle size={11} /> {errors.confirm}</div>
                    )}
                  </div>

                  {apiErr && (
                    <div className="rsp-api-err"><AlertCircle size={12} /> {apiErr}</div>
                  )}

                  <button type="submit" className="rsp-submit" disabled={loading}>
                    {loading
                      ? <><Loader2 size={15} className="spin" /> Updating…</>
                      : <>Reset password <ArrowRight size={15} /></>
                    }
                  </button>

                </form>

                <div className="rsp-footer-note">
                  <Lock size={10} style={{ color: '#ccc' }} /> 256-bit SSL · Your data is protected
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}