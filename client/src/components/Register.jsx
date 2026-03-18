import React, { useState } from 'react';
import {
  Eye, EyeOff, CheckCircle2, AlertCircle, Lock,
  User, Mail, MapPin, Briefcase, Loader2, ArrowRight, Shield
} from 'lucide-react';
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

  /* ══════════════════════════════════════
     SHELL
  ══════════════════════════════════════ */
  .rg-shell {
    display: flex;
    min-height: 100vh;
    width: 100vw;
  }

  /* ══════════════════════════════════════
     LEFT — form panel
  ══════════════════════════════════════ */
  .rg-left {
    width: 48%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-right: 1px solid #f0f0f0;
    position: relative;
    overflow-y: auto;
  }

  /* top bar */
  .rg-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.4rem 2.4rem;
    border-bottom: 1px solid #f5f5f5;
    flex-shrink: 0;
  }
  .rg-logo {
    display: flex; align-items: center; gap: 0.5rem;
    font-weight: 700; font-size: 0.95rem; color: #111;
    letter-spacing: -0.02em;
  }
  .rg-logo-mark {
    width: 28px; height: 28px; border-radius: 7px;
    background: #111;
    display: flex; align-items: center; justify-content: center;
  }
  .rg-topbar-link {
    font-size: 0.8rem; color: #888;
  }
  .rg-topbar-link a {
    color: #111; font-weight: 600; text-decoration: none;
  }
  .rg-topbar-link a:hover { text-decoration: underline; }

  /* form area */
  .rg-form-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.5rem 3.2rem;
  }

  .rg-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: #888;
    margin-bottom: 0.9rem;
  }
  .rg-eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #22c55e;
  }

  .rg-title {
    font-family: 'Instrument Serif', serif;
    font-size: 2.2rem;
    color: #0a0a0a;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 0.3rem;
  }
  .rg-title em {
    font-style: italic;
    color: #6366f1;
  }
  .rg-sub {
    font-size: 0.82rem; color: #999;
    margin-bottom: 2rem; line-height: 1.5;
  }

  /* ── field ── */
  .rg-field { margin-bottom: 0.8rem; }
  .rg-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }

  .rg-input-wrap { position: relative; }

  .rg-input, .rg-select {
    width: 100%;
    padding: 0.72rem 2.4rem 0.72rem 2.4rem;
    background: #fafafa;
    border: 1.5px solid #ebebeb;
    border-radius: 10px;
    color: #111;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .rg-input::placeholder { color: #bbb; }
  .rg-input:hover, .rg-select:hover { border-color: #d0d0d0; }
  .rg-input:focus, .rg-select:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
  }
  .rg-input.err { border-color: #f43f5e; background: #fff8f9; }
  .rg-input.ok  { border-color: #22c55e; }
  .rg-select { appearance: none; cursor: pointer; }
  .rg-select option { background: #fff; }
  .rg-select.err { border-color: #f43f5e; }

  .rg-icon-l {
    position: absolute; left: 0.78rem; top: 50%;
    transform: translateY(-50%);
    color: #ccc; pointer-events: none;
  }
  .rg-icon-r {
    position: absolute; right: 0.78rem; top: 50%;
    transform: translateY(-50%);
    color: #22c55e; pointer-events: none;
  }
  .rg-eye {
    position: absolute; right: 0.78rem; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #bbb; display: flex; padding: 2px;
    transition: color 0.2s;
  }
  .rg-eye:hover { color: #6366f1; }

  .rg-err-msg {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: 0.7rem; color: #f43f5e; margin-top: 0.22rem;
  }

  /* password hints */
  .rg-hints {
    margin-top: 0.4rem;
    display: flex; flex-direction: column; gap: 0.18rem;
  }
  .rg-hint {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.69rem; color: #bbb; font-weight: 500;
    transition: color 0.2s;
  }
  .rg-hint.met { color: #22c55e; }
  .rg-hint-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: #ddd; flex-shrink: 0; transition: background 0.2s;
  }
  .rg-hint.met .rg-hint-dot { background: #22c55e; }

  /* terms */
  .rg-terms {
    display: flex; align-items: flex-start; gap: 0.6rem;
    margin-bottom: 1rem; cursor: pointer;
  }
  .rg-terms input { display: none; }
  .rg-checkbox {
    width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px;
    border: 1.5px solid #ddd; border-radius: 4px;
    background: #fafafa;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .rg-terms input:checked ~ .rg-checkbox {
    background: #6366f1; border-color: #6366f1;
  }
  .rg-checkbox svg { display: none; }
  .rg-terms input:checked ~ .rg-checkbox svg { display: block; }
  .rg-terms-text { font-size: 0.77rem; color: #888; line-height: 1.5; }
  .rg-terms-text a { color: #6366f1; font-weight: 600; text-decoration: none; }
  .rg-terms-text a:hover { text-decoration: underline; }

  /* submit */
  .rg-submit {
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
  .rg-submit:hover { background: #222; transform: translateY(-1px); }
  .rg-submit:active { transform: translateY(0); background: #000; }
  .rg-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* divider */
  .rg-divider {
    display: flex; align-items: center; gap: 0.7rem;
    margin-bottom: 0.9rem;
  }
  .rg-divider-line { flex: 1; height: 1px; background: #f0f0f0; }
  .rg-divider-text { font-size: 0.71rem; color: #bbb; font-weight: 500; white-space: nowrap; }

  /* google */
  .rg-google { display: flex; justify-content: center; }

  /* error banner */
  .rg-err-banner {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.62rem 0.82rem; margin-bottom: 0.7rem;
    background: #fff5f7; border: 1px solid #fecdd3;
    border-radius: 8px; font-size: 0.77rem; color: #e11d48;
  }

  /* bottom note */
  .rg-bottom-note {
    padding: 1.2rem 2.4rem;
    border-top: 1px solid #f5f5f5;
    font-size: 0.72rem; color: #bbb;
    display: flex; align-items: center; gap: 0.4rem;
    flex-shrink: 0;
  }

  .spin { animation: spin 0.9s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ══════════════════════════════════════
     RIGHT — visual panel
  ══════════════════════════════════════ */
  .rg-right {
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
  .rg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  /* large circle accent */
  .rg-circle-bg {
    position: absolute;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .rg-right-inner {
    position: relative; z-index: 1;
    width: 100%; max-width: 340px;
    display: flex; flex-direction: column;
    gap: 1rem;
  }

  /* headline text */
  .rg-visual-headline {
    margin-bottom: 0.5rem;
  }
  .rg-visual-headline h2 {
    font-family: 'Instrument Serif', serif;
    font-size: 2rem;
    color: #0a0a0a;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }
  .rg-visual-headline h2 em { font-style: italic; color: #6366f1; }
  .rg-visual-headline p {
    font-size: 0.8rem; color: #888; line-height: 1.6;
  }

  /* stats row */
  .rg-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0.7rem; margin-top: 0.4rem;
  }
  .rg-stat {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 12px;
    padding: 0.9rem 0.8rem;
    text-align: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .rg-stat-val {
    font-family: 'Instrument Serif', serif;
    font-size: 1.35rem; font-weight: 400;
    color: #0a0a0a; letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 0.25rem;
  }
  .rg-stat-label {
    font-size: 0.63rem; color: #aaa;
    font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* feature cards */
  .rg-features { display: flex; flex-direction: column; gap: 0.6rem; }

  .rg-feat {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 12px;
    padding: 0.9rem 1rem;
    display: flex; align-items: flex-start; gap: 0.75rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .rg-feat:hover {
    border-color: #d8d8ff;
    box-shadow: 0 4px 12px rgba(99,102,241,0.08);
  }
  .rg-feat-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 0.9rem;
  }
  .rg-feat-icon.purple { background: #ede9fe; }
  .rg-feat-icon.green  { background: #dcfce7; }
  .rg-feat-icon.amber  { background: #fef3c7; }
  .rg-feat-body {}
  .rg-feat-title {
    font-size: 0.82rem; font-weight: 600;
    color: #111; margin-bottom: 0.15rem;
  }
  .rg-feat-desc {
    font-size: 0.72rem; color: #999; line-height: 1.5;
  }

  /* testimonial */
  .rg-quote {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 12px;
    padding: 1rem 1.1rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .rg-quote-text {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-size: 0.88rem;
    color: #444;
    line-height: 1.65;
    margin-bottom: 0.65rem;
  }
  .rg-quote-author {
    display: flex; align-items: center; gap: 0.55rem;
  }
  .rg-quote-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 700; color: #fff;
  }
  .rg-quote-name {
    font-size: 0.75rem; font-weight: 600; color: #333;
  }
  .rg-quote-role {
    font-size: 0.68rem; color: #aaa;
  }

  /* success */
  .rg-success {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; min-height: 70vh; gap: 0.8rem;
  }
  .rg-success-ring {
    width: 68px; height: 68px; border-radius: 50%;
    background: #111;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.4rem;
  }
  .rg-success h2 {
    font-family: 'Instrument Serif', serif;
    font-size: 1.6rem; color: #0a0a0a;
  }
  .rg-success p { color: #888; font-size: 0.82rem; }

  @media (max-width: 860px) {
    .rg-left { width: 100%; border-right: none; }
    .rg-right { display: none; }
  }
`;

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    city: '', role: '', agreeToTerms: false,
  });
  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [touched,  setTouched]  = useState({});

  const validate = (name, val) => {
    switch (name) {
      case 'fullName':
        if (!val.trim()) return 'Full name is required';
        if (val.trim().length < 2) return 'At least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(val)) return 'Letters only';
        return '';
      case 'email':
        if (!val) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Invalid email format';
        return '';
      case 'password':
        if (!val) return 'Password is required';
        if (val.length < 8) return 'Minimum 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])/.test(val)) return 'Upper & lowercase required';
        if (!/(?=.*\d)/.test(val)) return 'At least one number';
        return '';
      case 'confirmPassword':
        if (!val) return 'Please confirm password';
        if (val !== formData.password) return 'Passwords do not match';
        return '';
      case 'city':
        if (!val.trim()) return 'City is required';
        return '';
      case 'role':
        if (!val) return 'Please select a role';
        return '';
      case 'agreeToTerms':
        if (!val) return 'You must agree to continue';
        return '';
      default: return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fv = type === 'checkbox' ? checked : value;
    setFormData(p => ({ ...p, [name]: fv }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: validate(name, fv) }));
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fv = type === 'checkbox' ? checked : value;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validate(name, fv) }));
  };

  const validateAll = () => {
    const e = {};
    Object.keys(formData).forEach(k => {
      const err = validate(k, formData[k]);
      if (err) e[k] = err;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setTouched(Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {}));
    if (!validateAll()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          city: formData.city,
          role: formData.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(prev => ({ ...prev, ...data.errors }));
        else setErrors(prev => ({ ...prev, submit: data.message || 'Registration failed.' }));
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
    } catch {
      setErrors(prev => ({ ...prev, submit: 'Could not connect to server.' }));
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
        setErrors(p => ({ ...p, submit: data.message || 'Google sign up failed.' }));
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
    } catch {
      setErrors(p => ({ ...p, submit: 'Google sign up failed. Try again.' }));
    }
  };

  const p = formData.password;
  const hints = [
    { label: 'At least 8 characters',              met: p.length >= 8 },
    { label: 'One number (0–9) or a symbol',        met: /\d/.test(p) || /[^a-zA-Z0-9]/.test(p) },
    { label: 'Lowercase (a–z) and uppercase (A–Z)', met: /[a-z]/.test(p) && /[A-Z]/.test(p) },
  ];

  if (success) {
    return (
      <>
        <style>{css}</style>
        <div className="rg-shell">
          <div className="rg-left">
            <div className="rg-success">
              <div className="rg-success-ring"><CheckCircle2 size={32} color="#fff" /></div>
              <h2>Account created.</h2>
              <p>Redirecting to your dashboard…</p>
              <Loader2 size={16} className="spin" style={{ color: '#6366f1', marginTop: '0.4rem' }} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="rg-shell">

        {/* ══ LEFT ══ */}
        <div className="rg-left">

          {/* Top bar */}
          <div className="rg-topbar">
            <div className="rg-logo">
              <div className="rg-logo-mark">
                <Shield size={14} color="#fff" />
              </div>
              CyberShield
            </div>
            <div className="rg-topbar-link">
              Already registered? <a href="/login">Sign in</a>
            </div>
          </div>

          {/* Form */}
          <div className="rg-form-area">
            <div className="rg-eyebrow">
              <div className="rg-eyebrow-dot" />
              Free account · No credit card
            </div>
            <h1 className="rg-title">Create your<br /><em>secure</em> account</h1>
            <p className="rg-sub">Join 2.4M+ Indians protecting themselves online.</p>

            <form onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div className="rg-field">
                <div className="rg-input-wrap">
                  <User size={13} className="rg-icon-l" />
                  <input
                    className={`rg-input ${errors.fullName && touched.fullName ? 'err' : formData.fullName && !errors.fullName ? 'ok' : ''}`}
                    name="fullName" value={formData.fullName}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="Full name" disabled={loading}
                  />
                  {formData.fullName && !errors.fullName && <CheckCircle2 size={12} className="rg-icon-r" />}
                </div>
                {errors.fullName && touched.fullName && <div className="rg-err-msg"><AlertCircle size={11} /> {errors.fullName}</div>}
              </div>

              {/* Email */}
              <div className="rg-field">
                <div className="rg-input-wrap">
                  <Mail size={13} className="rg-icon-l" />
                  <input type="email"
                    className={`rg-input ${errors.email && touched.email ? 'err' : formData.email && !errors.email && touched.email ? 'ok' : ''}`}
                    name="email" value={formData.email}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="Email address" disabled={loading}
                  />
                  {formData.email && !errors.email && touched.email && <CheckCircle2 size={12} className="rg-icon-r" />}
                </div>
                {errors.email && touched.email && <div className="rg-err-msg"><AlertCircle size={11} /> {errors.email}</div>}
              </div>

              {/* Password */}
              <div className="rg-field">
                <div className="rg-input-wrap">
                  <Lock size={13} className="rg-icon-l" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className={`rg-input ${errors.password && touched.password ? 'err' : ''}`}
                    name="password" value={formData.password}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="Create password" disabled={loading}
                    style={{ paddingRight: '2.4rem' }}
                  />
                  <button type="button" className="rg-eye" onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="rg-hints">
                    {hints.map((h, i) => (
                      <div key={i} className={`rg-hint ${h.met ? 'met' : ''}`}>
                        <div className="rg-hint-dot" /> {h.label}
                      </div>
                    ))}
                  </div>
                )}
                {errors.password && touched.password && <div className="rg-err-msg"><AlertCircle size={11} /> {errors.password}</div>}
              </div>

              {/* Confirm Password */}
              <div className="rg-field">
                <div className="rg-input-wrap">
                  <Lock size={13} className="rg-icon-l" />
                  <input
                    type={showConf ? 'text' : 'password'}
                    className={`rg-input ${errors.confirmPassword && touched.confirmPassword ? 'err' : formData.confirmPassword && !errors.confirmPassword && touched.confirmPassword ? 'ok' : ''}`}
                    name="confirmPassword" value={formData.confirmPassword}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="Confirm password" disabled={loading}
                    style={{ paddingRight: '2.4rem' }}
                  />
                  <button type="button" className="rg-eye" onClick={() => setShowConf(v => !v)}>
                    {showConf ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && <div className="rg-err-msg"><AlertCircle size={11} /> {errors.confirmPassword}</div>}
              </div>

              {/* City + Role */}
              <div className="rg-row2">
                <div className="rg-field" style={{ marginBottom: 0 }}>
                  <div className="rg-input-wrap">
                    <MapPin size={13} className="rg-icon-l" />
                    <input
                      className={`rg-input ${errors.city && touched.city ? 'err' : formData.city && !errors.city && touched.city ? 'ok' : ''}`}
                      name="city" value={formData.city}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="City" disabled={loading}
                    />
                  </div>
                  {errors.city && touched.city && <div className="rg-err-msg"><AlertCircle size={11} /> {errors.city}</div>}
                </div>
                <div className="rg-field" style={{ marginBottom: 0 }}>
                  <div className="rg-input-wrap">
                    <Briefcase size={13} className="rg-icon-l" />
                    <select
                      className={`rg-select ${errors.role && touched.role ? 'err' : ''}`}
                      name="role" value={formData.role}
                      onChange={handleChange} onBlur={handleBlur} disabled={loading}
                    >
                      <option value="">Select role</option>
                      <option value="student">Student</option>
                      <option value="working_professional">Professional</option>
                      <option value="senior_citizen">Senior Citizen</option>
                    </select>
                  </div>
                  {errors.role && touched.role && <div className="rg-err-msg"><AlertCircle size={11} /> {errors.role}</div>}
                </div>
              </div>

              <div style={{ marginTop: '0.9rem' }} />

              {/* Terms */}
              <label className="rg-terms">
                <input type="checkbox" name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange} onBlur={handleBlur} disabled={loading}
                />
                <div className="rg-checkbox"><CheckCircle2 size={9} color="#fff" /></div>
                <span className="rg-terms-text">
                  I agree to CyberShield's <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                </span>
              </label>
              {errors.agreeToTerms && touched.agreeToTerms && (
                <div className="rg-err-msg" style={{ marginBottom: '0.6rem', marginTop: '-0.5rem' }}>
                  <AlertCircle size={11} /> {errors.agreeToTerms}
                </div>
              )}

              {errors.submit && (
                <div className="rg-err-banner"><AlertCircle size={13} /> {errors.submit}</div>
              )}

              <button type="submit" className="rg-submit" disabled={loading}>
                {loading
                  ? <><Loader2 size={15} className="spin" /> Creating account…</>
                  : <>Create account <ArrowRight size={15} /></>
                }
              </button>

              <div className="rg-divider">
                <div className="rg-divider-line" />
                <span className="rg-divider-text">or continue with</span>
                <div className="rg-divider-line" />
              </div>

              <div className="rg-google">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrors(p => ({ ...p, submit: 'Google sign-up failed.' }))}
                  useOneTap={false}
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  text="signup_with"
                  width="340"
                />
              </div>

            </form>
          </div>

          {/* Bottom note */}
          <div className="rg-bottom-note">
            <Lock size={11} style={{ color: '#ccc' }} />
            256-bit SSL encryption · Your data is always protected
          </div>

        </div>

        {/* ══ RIGHT ══ */}
        <div className="rg-right">
          <div className="rg-grid" />
          <div className="rg-circle-bg" />

          <div className="rg-right-inner">

            <div className="rg-visual-headline">
              <h2>Protect what<br /><em>matters most</em></h2>
              <p>Real-time threat detection, AI-powered security, and complete peace of mind — all in one platform.</p>
            </div>

            {/* Stats */}
            <div className="rg-stats">
              <div className="rg-stat">
                <div className="rg-stat-val">2.4M+</div>
                <div className="rg-stat-label">Users</div>
              </div>
              <div className="rg-stat">
                <div className="rg-stat-val">99.9%</div>
                <div className="rg-stat-label">Uptime</div>
              </div>
              <div className="rg-stat">
                <div className="rg-stat-val">0</div>
                <div className="rg-stat-label">Breaches</div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="rg-features">
              <div className="rg-feat">
                <div className="rg-feat-icon purple">🛡️</div>
                <div className="rg-feat-body">
                  <div className="rg-feat-title">Real-time Threat Detection</div>
                  <div className="rg-feat-desc">AI scans and neutralizes threats before they reach you.</div>
                </div>
              </div>
              <div className="rg-feat">
                <div className="rg-feat-icon green">🔒</div>
                <div className="rg-feat-body">
                  <div className="rg-feat-title">End-to-End Encryption</div>
                  <div className="rg-feat-desc">Your data is encrypted at rest and in transit. Always.</div>
                </div>
              </div>
              <div className="rg-feat">
                <div className="rg-feat-icon amber">⚡</div>
                <div className="rg-feat-body">
                  <div className="rg-feat-title">Instant Alerts</div>
                  <div className="rg-feat-desc">Get notified the moment anything suspicious is detected.</div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="rg-quote">
              <div className="rg-quote-text">
                "CyberShield gave me complete confidence online. I sleep better knowing my data is protected."
              </div>
              <div className="rg-quote-author">
                <div className="rg-quote-avatar">RK</div>
                <div>
                  <div className="rg-quote-name">Rahul Kapoor</div>
                  <div className="rg-quote-role">Software Engineer, Bengaluru</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}