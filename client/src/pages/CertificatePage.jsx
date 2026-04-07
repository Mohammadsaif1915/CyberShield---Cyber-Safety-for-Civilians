import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import styles from './CertificatePage.module.css'

export default function CertificatePage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(true)
  const [issuing,  setIssuing]  = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        // Check if already issued — go to profile
        const res = await api.get(`/certificate/${id}`)
        if (res.data.certificate) {
          navigate('/profile')
          return
        }
      } catch {
        // Not issued yet — show name input
      }
      try {
        const pRes = await api.get(`/progress/${id}`)
        setQuizPassed(pRes.data.progress.quizPassed)
      } catch {}
      setLoading(false)
    }
    check()
  }, [id])

  const handleIssue = async () => {
    if (!name.trim()) { toast.error('Please enter your name'); return }
    setIssuing(true)
    try {
      await api.post(`/certificate/${id}`, { recipientName: name.trim() })
      toast.success('🏆 Certificate issued!')
      navigate('/profile')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setIssuing(false)
    }
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      minHeight:'60vh', flexDirection:'column', gap:16 }}>
      <div className="spinner" />
      <p style={{ color:'var(--clr-text3)' }}>Loading…</p>
    </div>
  )

  if (!quizPassed) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      minHeight:'60vh', flexDirection:'column', gap:16, textAlign:'center' }}>
      <div style={{ fontSize:48 }}>🔒</div>
      <h3 style={{ fontFamily:'var(--font-display)' }}>Quiz not passed yet</h3>
      <p style={{ color:'var(--clr-text2)' }}>Pass the quiz to earn your certificate.</p>
      <button className="btn btn-primary"
        onClick={() => navigate(`/courses/${id}/quiz`)}>Take Quiz</button>
    </div>
  )

  return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center',
      justifyContent:'center', padding:'40px 24px' }}>
      <div style={{
        background:'var(--clr-surface)', border:'1px solid var(--clr-border)',
        borderRadius:20, padding:'40px 36px', width:'100%', maxWidth:480,
        boxShadow:'var(--shadow-xl)', textAlign:'center'
      }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🏆</div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:24,
          fontWeight:800, marginBottom:8 }}>
          Claim Your Certificate
        </h2>
        <p style={{ color:'var(--clr-text2)', fontSize:14, marginBottom:28 }}>
          Enter the name to display on your certificate
        </p>

        <input
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleIssue()}
          maxLength={60}
          style={{ marginBottom:16, fontSize:16, padding:'12px 16px' }}
        />

        <button
          className="btn btn-accent btn-lg"
          onClick={handleIssue}
          disabled={issuing}
          style={{ width:'100%', justifyContent:'center' }}
        >
          {issuing ? <span className="spinner spinner-sm" /> : '🎓'}
          {issuing ? 'Generating…' : 'Get My Certificate'}
        </button>
      </div>
    </div>
  )
}