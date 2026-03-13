import React, { useState } from 'react';
import { Mail, X, AlertCircle, CheckCircle2, Loader2, Shield, ArrowRight, Lock } from 'lucide-react';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

  .fp-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(10, 10, 10, 0.35);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    animation: fp-overlayIn 0.2s ease both;
    font-family: 'Instrument Sans', sans-serif;
  }

  .fp-card {
    background: #fff;
    border-radius: 18px;
    border: 1px solid #ebebeb;
    box-shadow:
      0 0 0 1px rgba(0,0,0,0.04),
      0 24px 64px rgba(0,0,0,0.10),
      0 8px 20px rgba(0,0,0,0.06);
    width: 100%;
    max-width: 400px;
    position: relative;
    overflow: hidden;
    animation: fp-cardPop 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
  }

  /* top accent stripe */
  .fp-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #6366f1, #a78bfa, #6366f1);
    background-size: 200% 100%;
    animation: fp-shimmer 3s linear infinite;
  }

  .fp-body { padding: 2.2rem 2.2rem 1.8rem; }

  /* close */
  .fp-close {
    position: absolute; top: 1rem; right: 1rem;
    width: 28px; height: 28px; border-radius: 7px;
    background: #f5f5f5; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #888; transition: all 0.2s; z-index: 1;
  }
  .fp-close:hover { background: #eee; color: #111; }

  /* icon */
  .fp-icon-wrap { display: flex; justify-content: center; margin-bottom: 1.4rem; }
  .fp-icon-box {
    width: 48px; height: 48px; border-radius: 12px;
    background: #111;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  }

  /* heading */
  .fp-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.55rem;
    color: #0a0a0a;
    line-height: 1.15;
    letter-spacing: -0.02em;
    text-align: center;
    margin-bottom: 0.3rem;
  }
  .fp-title em { font-style: italic; color: #6366f1; }
  .fp-sub {
    font-size: 0.8rem; color: #999;
    text-align: center; line-height: 1.6;
    margin-bottom: 1.6rem;
  }

  /* field */
  .fp-field { margin-bottom: 0.5rem; }
  .fp-label {
    display: block;
    font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: #888; margin-bottom: 0.4rem;
  }
  .fp-input-wrap { position: relative; }
  .fp-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.4rem;
    background: #fafafa;
    border: 1.5px solid #ebebeb;
    border-radius: 10px;
    color: #111;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .fp-input::placeholder { color: #bbb; }
  .fp-input:hover { border-color: #d0d0d0; }
  .fp-input:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
  }
  .fp-input.err { border-color: #f43f5e; background: #fff8f9; }
  .fp-icon-l {
    position: absolute; left: 0.75rem; top: 50%;
    transform: translateY(-50%);
    color: #ccc; pointer-events: none;
  }
  .fp-err-msg {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: 0.7rem; color: #f43f5e; margin-top: 0.25rem;
  }

  /* api err */
  .fp-api-err {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.6rem 0.8rem; margin-top: 0.6rem;
    background: #fff5f7; border: 1px solid #fecdd3;
    border-radius: 8px; font-size: 0.75rem; color: #e11d48;
  }

  /* submit */
  .fp-submit {
    width: 100%; padding: 0.8rem;
    background: #111;
    border: none; border-radius: 10px; color: #fff;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.875rem; font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.45rem;
    transition: background 0.2s, transform 0.15s;
    margin-top: 1.1rem;
    letter-spacing: 0.01em;
  }
  .fp-submit:hover { background: #222; transform: translateY(-1px); }
  .fp-submit:active { transform: translateY(0); background: #000; }
  .fp-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* footer note */
  .fp-footer-note {
    display: flex; align-items: center; justify-content: center; gap: 0.35rem;
    margin-top: 1rem;
    font-size: 0.7rem; color: #bbb;
  }

  /* ── success ── */
  .fp-success {
    display: flex; flex-direction: column;
    align-items: center; text-align: center;
  }
  .fp-success-ring {
    width: 52px; height: 52px; border-radius: 50%;
    background: #111;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.2rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.14);
  }
  .fp-success-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.4rem; color: #0a0a0a;
    letter-spacing: -0.02em; margin-bottom: 0.35rem;
  }
  .fp-success-title em { font-style: italic; color: #22c55e; }
  .fp-success-sub {
    font-size: 0.8rem; color: #888; line-height: 1.65;
    margin-bottom: 1.4rem;
  }
  .fp-success-email {
    display: inline-block;
    background: #f5f5f5; border: 1px solid #ebebeb;
    border-radius: 6px; padding: 0.25rem 0.65rem;
    font-size: 0.8rem; font-weight: 600; color: #111;
    margin-bottom: 1.2rem;
  }
  .fp-back-btn {
    width: 100%; padding: 0.78rem;
    background: #fafafa;
    border: 1.5px solid #ebebeb; border-radius: 10px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.84rem; font-weight: 600; color: #111;
    cursor: pointer; transition: background 0.2s, border-color 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  }
  .fp-back-btn:hover { background: #f0f0f0; border-color: #d0d0d0; }

  @keyframes fp-overlayIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fp-cardPop {
    from { opacity: 0; transform: scale(0.94) translateY(12px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
  @keyframes fp-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.9s linear infinite; }
`;

export default function ForgotPasswordPopup({ onClose }) {
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [apiErr,  setApiErr]  = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const validate = (val) => {
    if (!val) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Invalid email format';
    return '';
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const err = validate(email);
    if (err) { setError(err); return; }
    setLoading(true);
    setApiErr('');
    try {
      const res = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiErr(data.message || 'Something went wrong. Try again.');
        return;
      }
      setSent(true);
    } catch {
      setApiErr('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <style>{css}</style>
      <div className="fp-overlay" onClick={handleOverlayClick}>
        <div className="fp-card">

          <button className="fp-close" onClick={onClose} aria-label="Close">
            <X size={13} />
          </button>

          <div className="fp-body">
            {sent ? (
              /* ── Success ── */
              <div className="fp-success">
                <div className="fp-success-ring">
                  <CheckCircle2 size={24} color="#fff" />
                </div>
                <div className="fp-success-title">Email <em>sent</em></div>
                <p className="fp-success-sub">
                  We've sent a password reset link to
                </p>
                <div className="fp-success-email">{email}</div>
                <p className="fp-success-sub" style={{ marginBottom: '1.4rem' }}>
                  Check your inbox and spam folder.<br />
                  The link expires in <strong style={{ color: '#111' }}>15 minutes</strong>.
                </p>
                <button className="fp-back-btn" onClick={onClose}>
                  ← Back to login
                </button>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div className="fp-icon-wrap">
                  <div className="fp-icon-box">
                    <Shield size={22} color="#fff" />
                  </div>
                </div>

                {/* Heading */}
                <h2 className="fp-title">Reset your <em>password</em></h2>
                <p className="fp-sub">
                  Enter your registered email and we'll send a secure reset link straight to your inbox.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="fp-field">
                    <label className="fp-label">Email address</label>
                    <div className="fp-input-wrap">
                      <Mail size={13} className="fp-icon-l" />
                      <input
                        type="email"
                        className={`fp-input ${error ? 'err' : ''}`}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); setApiErr(''); }}
                        onBlur={(e) => setError(validate(e.target.value))}
                        placeholder="you@example.com"
                        disabled={loading}
                      />
                    </div>
                    {error && (
                      <div className="fp-err-msg"><AlertCircle size={11} /> {error}</div>
                    )}
                  </div>

                  {apiErr && (
                    <div className="fp-api-err"><AlertCircle size={12} /> {apiErr}</div>
                  )}

                  <button type="submit" className="fp-submit" disabled={loading}>
                    {loading
                      ? <><Loader2 size={15} className="spin" /> Sending…</>
                      : <>Send reset link <ArrowRight size={15} /></>
                    }
                  </button>
                </form>

                <div className="fp-footer-note">
                  <Lock size={10} /> Secure · Expires in 15 min
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}