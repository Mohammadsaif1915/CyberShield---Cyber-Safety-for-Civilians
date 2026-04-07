// src/pages/RegisterPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name     = 'Name is required'
    if (!form.email)              e.email    = 'Email is required'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const res = await register(form.name, form.email, form.password)
    if (res.success) navigate('/courses')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.head}>
          <div className={styles.shield}>🛡️</div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.sub}>Join CyberLearn and start learning cybersecurity today</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => { setForm(p=>({...p,name:e.target.value})); setErrors(p=>({...p,name:''})) }}
              className={errors.name ? styles.inputErr : ''}
            />
            {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
          </div>

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
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => { setForm(p=>({...p,password:e.target.value})); setErrors(p=>({...p,password:''})) }}
              className={errors.password ? styles.inputErr : ''}
            />
            {errors.password && <span className={styles.errMsg}>{errors.password}</span>}
          </div>

          <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className="spinner spinner-sm" /> : null}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>

      <div className={styles.bgDecor} aria-hidden="true">
        {['🔐','🛡️','🔑','🌐','💻','⚠️','🔒','🕵️'].map((e,i)=>(
          <span key={i} className={styles.floatIcon} style={{ '--i': i }}>{e}</span>
        ))}
      </div>
    </div>
  )
}
