// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const res = await login(form.email, form.password)
    if (res.success) navigate('/courses')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.head}>
          <div className={styles.shield}>🛡️</div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.sub}>Sign in to continue your cybersecurity journey</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => { setForm(p=>({...p,email:e.target.value})); setErrors(p=>({...p,email:''})) }}
              className={errors.email ? styles.inputErr : ''}
            />
            {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => { setForm(p=>({...p,password:e.target.value})); setErrors(p=>({...p,password:''})) }}
              className={errors.password ? styles.inputErr : ''}
            />
            {errors.password && <span className={styles.errMsg}>{errors.password}</span>}
          </div>

          <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className="spinner spinner-sm" /> : null}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.switchLink}>Create one</Link>
        </p>
      </div>

      {/* Decorative background */}
      <div className={styles.bgDecor} aria-hidden="true">
        {['🔐','🛡️','🔑','🌐','💻','⚠️','🔒','🕵️'].map((e,i)=>(
          <span key={i} className={styles.floatIcon} style={{ '--i': i }}>{e}</span>
        ))}
      </div>
    </div>
  )
}
